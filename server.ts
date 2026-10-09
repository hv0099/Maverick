import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Request logger for API calls
  app.use('/api', (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[REST API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // ----------------------------------------------------
  // AUTHENTICATION APIs
  // ----------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Role check if provided
    if (role && user.role !== role) {
      return res.status(401).json({ success: false, message: `Account exists, but is not registered as a ${role}` });
    }

    if (user.status === 'INACTIVE') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated. Please contact administration.' });
    }

    // Password check: accept configured password or demo standards
    if (user.passwordHash !== password && password !== 'password123' && password !== 'admin123' && password !== 'doctor123' && password !== 'patient123') {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    let doctorProfile = null;
    let patientProfile = null;

    if (user.role === 'DOCTOR') {
      doctorProfile = db.getDoctorByUserId(user.id);
    } else if (user.role === 'PATIENT') {
      patientProfile = db.getPatientByUserId(user.id);
    }

    const token = `cc_token_${user.id}_${Date.now()}`;

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
        status: user.status
      },
      doctor: doctorProfile,
      patient: patientProfile
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { name, email, password, phone, role, gender, dateOfBirth, bloodGroup, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    const assignedRole = role === 'DOCTOR' ? 'DOCTOR' : 'PATIENT';
    const newUser = db.createUser({
      email,
      passwordHash: password,
      name,
      role: assignedRole,
      phone: phone || '',
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400`,
      status: 'ACTIVE'
    });

    let patientProfile = null;
    if (assignedRole === 'PATIENT') {
      patientProfile = db.createPatient({
        userId: newUser.id,
        fullName: name,
        email,
        phone: phone || '',
        gender: gender || 'Not specified',
        dateOfBirth: dateOfBirth || '1998-01-01',
        bloodGroup: bloodGroup || 'O+',
        address: address || 'City Center, India',
        emergencyContact: phone || '',
        allergies: 'None recorded'
      });
    }

    const token = `cc_token_${newUser.id}_${Date.now()}`;

    return res.status(201).json({
      success: true,
      token,
      user: newUser,
      patient: patientProfile
    });
  });

  app.get('/api/auth/me', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = db.getUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const doctor = user.role === 'DOCTOR' ? db.getDoctorByUserId(user.id) : null;
    const patient = user.role === 'PATIENT' ? db.getPatientByUserId(user.id) : null;

    return res.json({ success: true, user, doctor, patient });
  });

  // ----------------------------------------------------
  // DOCTOR APIs
  // ----------------------------------------------------
  app.get('/api/doctors', (req, res) => {
    let doctors = db.getDoctors();
    const { search, specialization, location, minRating } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        d =>
          d.fullName.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.hospital.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }

    if (specialization && typeof specialization === 'string' && specialization !== 'All') {
      doctors = doctors.filter(d => d.specialization.toLowerCase() === specialization.toLowerCase());
    }

    if (location && typeof location === 'string' && location !== 'All') {
      doctors = doctors.filter(d => d.location.toLowerCase().includes(location.toLowerCase()));
    }

    if (minRating && typeof minRating === 'string') {
      const ratingVal = parseFloat(minRating);
      if (!isNaN(ratingVal)) {
        doctors = doctors.filter(d => d.rating >= ratingVal);
      }
    }

    return res.json({ success: true, count: doctors.length, data: doctors });
  });

  app.get('/api/doctors/:id', (req, res) => {
    const doctor = db.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const reviews = db.getReviewsByDoctorId(doctor.id);
    const availabilitySchedule = db.getDoctorAvailability(doctor.id);

    return res.json({ success: true, data: { ...doctor, reviews, availabilitySchedule } });
  });

  app.post('/api/doctors', (req, res) => {
    const { fullName, email, phone, specialization, qualification, experience, hospital, consultationFee, location, about, languages, photoUrl } = req.body;
    if (!fullName || !specialization || !email) {
      return res.status(400).json({ success: false, message: 'Name, email, and specialization are required' });
    }

    let user = db.getUserByEmail(email);
    if (!user) {
      user = db.createUser({
        email,
        passwordHash: 'doctor123',
        name: fullName,
        role: 'DOCTOR',
        phone: phone || '',
        avatarUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
        status: 'ACTIVE'
      });
    }

    const newDoctor = db.createDoctor({
      userId: user.id,
      fullName,
      specialization,
      qualification: qualification || 'MBBS, MD',
      experience: Number(experience) || 5,
      hospital: hospital || 'CareConnect Medical Center',
      consultationFee: Number(consultationFee) || 800,
      location: location || 'Mumbai, Maharashtra',
      about: about || 'Experienced medical specialist committed to evidence-based patient healthcare.',
      languages: Array.isArray(languages) ? languages : ['English', 'Hindi'],
      rating: 5.0,
      reviewCount: 0,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableTimeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
      email,
      phone: phone || '',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
    });

    return res.status(201).json({ success: true, data: newDoctor });
  });

  app.put('/api/doctors/:id', (req, res) => {
    const { fullName, phone, qualification, specialization, experience, hospital, location, languages, about, consultationFee, photoUrl } = req.body;
    const doc = db.getDoctorById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }

    const updated = db.updateDoctor(req.params.id, {
      fullName: fullName || doc.fullName,
      phone: phone || doc.phone,
      qualification: qualification || doc.qualification,
      specialization: specialization || doc.specialization,
      experience: experience !== undefined ? Number(experience) : doc.experience,
      hospital: hospital || doc.hospital,
      location: location || doc.location,
      languages: Array.isArray(languages) ? languages : doc.languages,
      about: about || doc.about,
      consultationFee: consultationFee !== undefined ? Number(consultationFee) : doc.consultationFee,
      photoUrl: photoUrl || doc.photoUrl
    });

    if (doc.userId) {
      db.updateUser(doc.userId, { name: updated?.fullName, phone: updated?.phone });
    }

    return res.json({ success: true, data: updated });
  });

  app.delete('/api/doctors/:id', (req, res) => {
    const success = db.deleteDoctor(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    return res.json({ success: true, message: 'Doctor profile and account removed successfully' });
  });

  app.get('/api/doctors/:id/availability', (req, res) => {
    const doctor = db.getDoctorById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    const date = req.query.date as string;
    let bookedSlots: string[] = [];
    if (date) {
      const dayAppointments = db
        .getAppointmentsByDoctorId(doctor.id)
        .filter(a => a.appointmentDate === date && a.status !== 'CANCELLED' && a.status !== 'REJECTED');
      bookedSlots = dayAppointments.map(a => a.appointmentTime);
    }

    const schedule = db.getDoctorAvailability(doctor.id);

    return res.json({
      success: true,
      doctorId: doctor.id,
      availableDays: doctor.availableDays,
      availableTimeSlots: doctor.availableTimeSlots,
      bookedSlots,
      schedule
    });
  });

  app.post('/api/doctors/:id/availability', (req, res) => {
    const { schedules } = req.body;
    if (!Array.isArray(schedules)) {
      return res.status(400).json({ success: false, message: 'Schedules array is required' });
    }
    const saved = db.setDoctorAvailability(req.params.id, schedules);
    return res.json({ success: true, data: saved });
  });

  app.post('/api/doctors/:id/block-date', (req, res) => {
    const { date } = req.body;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Date is required' });
    }
    db.blockDoctorDate(req.params.id, date);
    return res.json({ success: true, message: `Date ${date} marked unavailable.` });
  });

  // ----------------------------------------------------
  // APPOINTMENT APIs
  // ----------------------------------------------------
  app.post('/api/appointments', (req, res) => {
    const { patientId, doctorId, appointmentDate, appointmentTime, reason, notes } = req.body;
    if (!patientId || !doctorId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, Doctor ID, Date and Time slot are mandatory.'
      });
    }

    const doctor = db.getDoctorById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Selected doctor not found' });
    }

    const patient = db.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient record not found' });
    }

    // Check if slot is already occupied
    const existing = db
      .getAppointmentsByDoctorId(doctorId)
      .find(
        a =>
          a.appointmentDate === appointmentDate &&
          a.appointmentTime === appointmentTime &&
          a.status !== 'CANCELLED' &&
          a.status !== 'REJECTED'
      );

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Sorry, this time slot has already been booked.'
      });
    }

    const appointment = db.createAppointment({
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentDate,
      appointmentTime,
      reason: reason || 'General Consultation',
      status: 'PENDING',
      notes: notes || '',
      patientName: patient.fullName,
      patientPhone: patient.phone,
      patientEmail: patient.email,
      doctorName: doctor.fullName,
      doctorSpecialization: doctor.specialization,
      hospital: doctor.hospital,
      consultationFee: doctor.consultationFee
    });

    const admins = db.getUsers().filter(u => u.role === 'ADMIN');
    admins.forEach(admin => {
      db.createNotification({
        userId: admin.id,
        title: 'New Appointment Created',
        message: `Appointment ${appointment.appointmentNumber} scheduled by ${patient.fullName} with ${doctor.fullName}.`,
        type: 'APPOINTMENT'
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment request submitted successfully! Status is PENDING review.',
      data: appointment
    });
  });

  app.get('/api/appointments', (req, res) => {
    const appointments = db.getAppointments();
    return res.json({ success: true, count: appointments.length, data: appointments });
  });

  app.get('/api/appointments/:id', (req, res) => {
    const appointment = db.getAppointmentById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.json({ success: true, data: appointment });
  });

  app.get('/api/appointments/patient/:patientId', (req, res) => {
    const appointments = db.getAppointmentsByPatientId(req.params.patientId);
    return res.json({ success: true, count: appointments.length, data: appointments });
  });

  app.get('/api/appointments/doctor/:doctorId', (req, res) => {
    const appointments = db.getAppointmentsByDoctorId(req.params.doctorId);
    return res.json({ success: true, count: appointments.length, data: appointments });
  });

  app.put('/api/appointments/:id/status', (req, res) => {
    const { status, notes, diagnosis, prescriptionNotes, doctorId: reqDoctorId } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status code' });
    }

    const apt = db.getAppointmentById(req.params.id);
    if (!apt) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    const headerDoctorId = req.headers['x-doctor-id'] as string;
    const callerDoctorId = headerDoctorId || reqDoctorId;
    if (callerDoctorId && apt.doctorId !== callerDoctorId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Doctor cannot modify appointments belonging to another specialist.'
      });
    }

    if (apt.status === 'COMPLETED' && status !== 'COMPLETED') {
      return res.status(400).json({ success: false, message: 'Completed appointments cannot be altered.' });
    }

    const updated = db.updateAppointmentStatus(req.params.id, status, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }

    if (diagnosis || prescriptionNotes) {
      if (diagnosis) updated.diagnosis = diagnosis;
      if (prescriptionNotes) updated.prescriptionNotes = prescriptionNotes;
    }

    return res.json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: updated
    });
  });

  app.delete('/api/appointments/:id', (req, res) => {
    const success = db.deleteAppointment(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Appointment not found' });
    }
    return res.json({ success: true, message: 'Appointment cancelled and removed' });
  });

  // ----------------------------------------------------
  // PATIENT & MEDICAL RECORD APIs
  // ----------------------------------------------------
  app.get('/api/patients', (req, res) => {
    const patients = db.getPatients();
    return res.json({ success: true, count: patients.length, data: patients });
  });

  app.get('/api/patients/:id', (req, res) => {
    const patient = db.getPatientById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.json({ success: true, data: patient });
  });

  app.put('/api/patients/:id', (req, res) => {
    const updated = db.updatePatient(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }
    return res.json({ success: true, data: updated });
  });

  app.get('/api/medical-records', (req, res) => {
    const records = db.getMedicalRecords();
    return res.json({ success: true, count: records.length, data: records });
  });

  app.get('/api/medical-records/patient/:patientId', (req, res) => {
    const records = db.getMedicalRecordsByPatientId(req.params.patientId);
    return res.json({ success: true, count: records.length, data: records });
  });

  app.get('/api/medical-records/doctor/:doctorId', (req, res) => {
    const records = db.getMedicalRecordsByDoctorId(req.params.doctorId);
    return res.json({ success: true, count: records.length, data: records });
  });

  app.get('/api/patients/:id/medical-records', (req, res) => {
    const records = db.getMedicalRecordsByPatientId(req.params.id);
    return res.json({ success: true, count: records.length, data: records });
  });

  app.get('/api/medical-records/:id', (req, res) => {
    const record = db.getMedicalRecordById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }
    return res.json({ success: true, data: record });
  });

  app.put('/api/medical-records/:id', (req, res) => {
    const { diagnosis, symptoms, treatment, doctorNotes, followUpDate, prescriptions } = req.body;
    const updated = db.updateMedicalRecord(req.params.id, {
      diagnosis,
      symptoms,
      treatment,
      doctorNotes,
      followUpDate,
      prescriptions
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Medical record not found' });
    }
    return res.json({ success: true, message: 'Medical record updated successfully in database', data: updated });
  });

  app.post('/api/medical-records', (req, res) => {
    const { patientId, doctorId, appointmentId, diagnosis, symptoms, treatment, doctorNotes, followUpDate, prescriptions } = req.body;
    if (!patientId || !doctorId || !diagnosis) {
      return res.status(400).json({ success: false, message: 'Patient ID, Doctor ID, and Diagnosis are required' });
    }

    const patient = db.getPatientById(patientId);
    const doctor = db.getDoctorById(doctorId);

    const record = db.createMedicalRecord({
      appointmentId,
      patientId,
      doctorId,
      patientName: patient ? patient.fullName : 'Patient',
      doctorName: doctor ? doctor.fullName : 'Doctor',
      date: new Date().toISOString().split('T')[0],
      diagnosis,
      symptoms: symptoms || '',
      treatment: treatment || '',
      doctorNotes: doctorNotes || '',
      followUpDate: followUpDate || '',
      prescriptions: prescriptions || []
    });

    if (appointmentId) {
      const rxSummary = prescriptions && prescriptions.length > 0
        ? prescriptions.map((p: any) => `${p.medicine} (${p.dosage})`).join(', ')
        : 'Prescription filed';
      db.updateAppointmentStatus(appointmentId, 'COMPLETED', 'Consultation finished and prescription issued.');
      const apt = db.getAppointmentById(appointmentId);
      if (apt) {
        apt.diagnosis = diagnosis;
        apt.prescriptionNotes = rxSummary;
      }
    }

    return res.status(201).json({ success: true, data: record });
  });

  // ----------------------------------------------------
  // PRESCRIPTIONS APIs
  // ----------------------------------------------------
  app.get('/api/prescriptions', (req, res) => {
    const rx = db.getPrescriptions();
    return res.json({ success: true, count: rx.length, data: rx });
  });

  app.get('/api/prescriptions/patient/:patientId', (req, res) => {
    const rx = db.getPrescriptionsByPatientId(req.params.patientId);
    return res.json({ success: true, count: rx.length, data: rx });
  });

  app.get('/api/prescriptions/doctor/:doctorId', (req, res) => {
    const rx = db.getPrescriptionsByDoctorId(req.params.doctorId);
    return res.json({ success: true, count: rx.length, data: rx });
  });

  app.get('/api/prescriptions/:id', (req, res) => {
    const rx = db.getPrescriptionById(req.params.id);
    if (!rx) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }
    return res.json({ success: true, data: rx });
  });

  app.post('/api/prescriptions', (req, res) => {
    const { patientId, doctorId, appointmentId, medications, instructions } = req.body;
    if (!patientId || !doctorId || !medications || !Array.isArray(medications)) {
      return res.status(400).json({ success: false, message: 'Patient ID, Doctor ID, and Medications array are required' });
    }

    const patient = db.getPatientById(patientId);
    const doctor = db.getDoctorById(doctorId);

    const rx = db.createPrescription({
      patientId,
      doctorId,
      appointmentId,
      doctorName: doctor ? doctor.fullName : 'Doctor',
      patientName: patient ? patient.fullName : 'Patient',
      date: new Date().toISOString().split('T')[0],
      medications,
      instructions: instructions || 'Take medications as directed.'
    });

    return res.status(201).json({ success: true, data: rx });
  });

  // ----------------------------------------------------
  // REVIEWS & FEEDBACK
  // ----------------------------------------------------
  app.get('/api/reviews', (req, res) => {
    const reviews = db.getReviews();
    return res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.get('/api/reviews/:doctorId', (req, res) => {
    const reviews = db.getReviewsByDoctorId(req.params.doctorId);
    return res.json({ success: true, count: reviews.length, data: reviews });
  });

  app.post('/api/reviews', (req, res) => {
    const { doctorId, patientId, appointmentId, rating, comment } = req.body;
    if (!doctorId || !patientId || !rating) {
      return res.status(400).json({ success: false, message: 'Doctor ID, Patient ID, and Rating are required' });
    }

    if (appointmentId) {
      const apt = db.getAppointmentById(appointmentId);
      if (!apt) {
        return res.status(404).json({ success: false, message: 'Associated appointment not found.' });
      }
      if (apt.patientId !== patientId) {
        return res.status(403).json({ success: false, message: 'Unauthorized: You can only submit reviews for your own appointments.' });
      }
      if (apt.status !== 'COMPLETED') {
        return res.status(400).json({ success: false, message: 'Reviews can only be submitted for completed consultations.' });
      }
      const existingRev = db.getReviews().find(r => r.appointmentId === appointmentId);
      if (existingRev) {
        return res.status(400).json({ success: false, message: 'A review has already been submitted for this appointment.' });
      }
    }

    const patient = db.getPatientById(patientId);
    const review = db.createReview({
      doctorId,
      patientId,
      appointmentId,
      patientName: patient ? patient.fullName : 'Verified Patient',
      rating: Number(rating),
      comment: comment || 'Great consultation.'
    });

    return res.status(201).json({ success: true, data: review });
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const success = db.deleteReview(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    return res.json({ success: true, message: 'Review moderated and removed.' });
  });

  // User Profile & Password Change
  app.put('/api/users/:id/password', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current password and new password are required.' });
    }

    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.passwordHash !== currentPassword) {
      return res.status(400).json({ success: false, message: 'Current password does not match.' });
    }

    db.updateUser(user.id, { passwordHash: newPassword });
    return res.json({ success: true, message: 'Password updated successfully!' });
  });

  // ----------------------------------------------------
  // ADMIN APIs
  // ----------------------------------------------------
  app.get('/api/admin/users', (req, res) => {
    const users = db.getUsers().map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      phone: u.phone,
      status: u.status,
      createdAt: u.createdAt
    }));
    return res.json({ success: true, count: users.length, data: users });
  });

  app.post('/api/admin/users', (req, res) => {
    const { name, email, password, role, phone, status } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Name, email, password, and role are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email is already registered' });
    }

    const newUser = db.createUser({
      email,
      passwordHash: password,
      name,
      role,
      phone: phone || '',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
      status: status || 'ACTIVE'
    });

    if (role === 'PATIENT') {
      db.createPatient({
        userId: newUser.id,
        fullName: name,
        email,
        phone: phone || '',
        gender: 'Not specified',
        dateOfBirth: '1995-01-01',
        bloodGroup: 'O+',
        address: 'City Center',
        emergencyContact: phone || '',
        allergies: 'None recorded'
      });
    }

    return res.status(201).json({ success: true, data: newUser });
  });

  app.put('/api/admin/users/:id', (req, res) => {
    const { name, email, phone, role, status } = req.body;
    const updated = db.updateUser(req.params.id, { name, email, phone, role, status });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, data: updated });
  });

  app.delete('/api/admin/users/:id', (req, res) => {
    const success = db.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.json({ success: true, message: 'User deleted successfully' });
  });

  app.get('/api/admin/stats', (req, res) => {
    const stats = db.getSystemStats();
    return res.json({ success: true, data: stats });
  });

  // Notifications
  app.get('/api/notifications', (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return res.json({ success: true, data: [] });
    }
    const notifs = db.getNotifications(userId);
    return res.json({ success: true, data: notifs });
  });

  app.get('/api/notifications/:userId', (req, res) => {
    const notifs = db.getNotifications(req.params.userId);
    return res.json({ success: true, data: notifs });
  });

  app.put('/api/notifications/:id/read', (req, res) => {
    db.markNotificationAsRead(req.params.id);
    return res.json({ success: true });
  });

  // ----------------------------------------------------
  // VITE DEV SERVER INTEGRATION
  // ----------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maverick Healthcare server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
