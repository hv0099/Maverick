import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User as UserIcon, 
  FileText, 
  Star, 
  Stethoscope, 
  Building2, 
  Plus, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Filter, 
  Check, 
  X,
  Pill,
  Activity,
  BarChart3,
  CalendarDays,
  Users,
  LogOut,
  Save,
  Ban
} from 'lucide-react';
import { Doctor, Appointment, MedicalRecord, Review, Patient, DoctorAvailability, Prescription } from '../types';
import { api } from '../services/api';

interface DashboardDoctorProps {
  doctor: Doctor;
  onRefreshAll: () => void;
  onLogout: () => void;
  initialTab?: string;
}

export const DashboardDoctor: React.FC<DashboardDoctorProps> = ({ doctor, onRefreshAll, onLogout, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'SCHEDULE' | 'APPOINTMENTS' | 'PATIENTS' | 'RECORDS' | 'PRESCRIPTIONS' | 'REVIEWS' | 'PROFILE'>(
    (initialTab as any) || 'DASHBOARD'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Doctor Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [schedule, setSchedule] = useState<DoctorAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Patient Details
  const [viewingPatient, setViewingPatient] = useState<Patient | null>(null);
  const [viewingPatientRecords, setViewingPatientRecords] = useState<MedicalRecord[]>([]);

  const handleOpenPatientFile = async (patientId: string) => {
    try {
      const [pRes, mRes] = await Promise.all([
        api.getPatient(patientId),
        api.getPatientMedicalRecords(patientId)
      ]);
      if (pRes.success) setViewingPatient(pRes.data);
      if (mRes.success) setViewingPatientRecords(mRes.data);
    } catch (err) {
      console.error('Failed to load patient file:', err);
    }
  };

  // Consultation Modal State
  const [consultModalAppointment, setConsultModalAppointment] = useState<Appointment | null>(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [doctorNotes, setDoctorNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [medications, setMedications] = useState<Array<{ medicine: string; dosage: string; frequency: string; duration: string; instructions?: string }>>([
    { medicine: '', dosage: '1 tablet', frequency: 'Twice daily after meals', duration: '5 days', instructions: 'Take with warm water' }
  ]);
  const [submittingRecord, setSubmittingRecord] = useState(false);

  // Profile Edit State
  const [profileFee, setProfileFee] = useState(doctor.consultationFee);
  const [profileAbout, setProfileAbout] = useState(doctor.about);
  const [profileHospital, setProfileHospital] = useState(doctor.hospital);
  const [profilePhone, setProfilePhone] = useState(doctor.phone);
  const [profileQualification, setProfileQualification] = useState(doctor.qualification || '');
  const [profileSpecialization, setProfileSpecialization] = useState(doctor.specialization || '');
  const [profileLanguages, setProfileLanguages] = useState(doctor.languages?.join(', ') || 'English, Hindi');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(doctor.photoUrl || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Medical Record Management State
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | null>(null);
  const [recordSearch, setRecordSearch] = useState('');
  const [savingEditRecord, setSavingEditRecord] = useState(false);
  const [recordUpdateSuccess, setRecordUpdateSuccess] = useState('');

  // Prescription Management State
  const [viewingRx, setViewingRx] = useState<Prescription | null>(null);
  const [rxSearch, setRxSearch] = useState('');
  const [newRxModalOpen, setNewRxModalOpen] = useState(false);
  const [newRxPatientId, setNewRxPatientId] = useState('');
  const [newRxMeds, setNewRxMeds] = useState<Array<{ medicine: string; dosage: string; frequency: string; duration: string; instructions?: string }>>([
    { medicine: '', dosage: '500 mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }
  ]);
  const [newRxInstructions, setNewRxInstructions] = useState('');
  const [savingNewRx, setSavingNewRx] = useState(false);

  // Date Block State
  const [blockDateInput, setBlockDateInput] = useState('');

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      const [aptsRes, docDetailsRes, recordsRes, rxRes] = await Promise.all([
        api.getDoctorAppointments(doctor.id),
        api.getDoctorById(doctor.id),
        api.getDoctorMedicalRecords(doctor.id),
        api.getDoctorPrescriptions(doctor.id),
      ]);
      if (aptsRes.success) setAppointments(aptsRes.data);
      if (recordsRes.success) setMedicalRecords(recordsRes.data);
      if (rxRes.success) setPrescriptions(rxRes.data);
      if (docDetailsRes.success) {
        if (docDetailsRes.data.reviews) setReviews(docDetailsRes.data.reviews);
        if (docDetailsRes.data.availabilitySchedule) setSchedule(docDetailsRes.data.availabilitySchedule);
      }
    } catch (err) {
      console.error('Failed to load doctor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorData();
  }, [doctor.id]);

  const handleUpdateStatus = async (id: string, newStatus: string, notes?: string) => {
    try {
      const res = await api.updateAppointmentStatus(id, newStatus, notes);
      if (res.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus as any } : a));
        onRefreshAll();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleOpenConsultModal = (apt: Appointment) => {
    setConsultModalAppointment(apt);
    setDiagnosis(apt.diagnosis || '');
    setSymptoms(apt.reason || '');
    setTreatment('');
    setDoctorNotes('');
    setFollowUpDate('');
    setMedications([
      { medicine: '', dosage: '1 tablet', frequency: 'Twice daily after meals', duration: '5 days', instructions: 'Take with warm water' }
    ]);
  };

  const handleAddMedicationRow = () => {
    setMedications([...medications, { medicine: '', dosage: '1 tablet', frequency: 'Twice daily', duration: '5 days', instructions: '' }]);
  };

  const handleRemoveMedicationRow = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleSaveMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultModalAppointment) return;
    try {
      setSubmittingRecord(true);
      const validMeds = medications.filter(m => m.medicine.trim() !== '');
      const res = await api.createMedicalRecord({
        appointmentId: consultModalAppointment.id,
        patientId: consultModalAppointment.patientId,
        doctorId: doctor.id,
        diagnosis,
        symptoms,
        treatment,
        doctorNotes,
        followUpDate,
        prescriptions: validMeds,
      });
      if (res.success) {
        await api.updateAppointmentStatus(
          consultModalAppointment.id,
          'COMPLETED',
          'Consultation concluded. Prescription issued.',
          diagnosis,
          validMeds.map(m => `${m.medicine} (${m.dosage})`).join(', ')
        );
        setConsultModalAppointment(null);
        fetchDoctorData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Failed to save clinical encounter:', err);
    } finally {
      setSubmittingRecord(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const res = await api.updateDoctor(doctor.id, {
        consultationFee: profileFee,
        about: profileAbout,
        hospital: profileHospital,
        phone: profilePhone,
        qualification: profileQualification,
        specialization: profileSpecialization,
        languages: profileLanguages.split(',').map(s => s.trim()).filter(Boolean),
        photoUrl: profilePhotoUrl
      });
      if (res.success) {
        setProfileSuccess(true);
        setTimeout(() => setProfileSuccess(false), 3000);
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error updating doctor profile:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdateMedicalRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      setSavingEditRecord(true);
      const res = await api.updateMedicalRecord(editingRecord.id, {
        diagnosis: editingRecord.diagnosis,
        symptoms: editingRecord.symptoms,
        treatment: editingRecord.treatment,
        doctorNotes: editingRecord.doctorNotes,
        followUpDate: editingRecord.followUpDate,
        prescriptions: editingRecord.prescriptions,
      });
      if (res.success) {
        setRecordUpdateSuccess('Medical record successfully updated.');
        setMedicalRecords(medicalRecords.map(m => m.id === editingRecord.id ? res.data : m));
        setTimeout(() => {
          setRecordUpdateSuccess('');
          setEditingRecord(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Failed to update medical record:', err);
    } finally {
      setSavingEditRecord(false);
    }
  };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRxPatientId) return;
    const validMeds = newRxMeds.filter(m => m.medicine.trim() !== '');
    if (validMeds.length === 0) return;
    try {
      setSavingNewRx(true);
      const res = await api.createPrescription({
        patientId: newRxPatientId,
        doctorId: doctor.id,
        medications: validMeds,
        instructions: newRxInstructions,
      });
      if (res.success) {
        setPrescriptions([res.data, ...prescriptions]);
        setNewRxModalOpen(false);
        setNewRxPatientId('');
        setNewRxInstructions('');
        setNewRxMeds([{ medicine: '', dosage: '500 mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }]);
        fetchDoctorData();
      }
    } catch (err) {
      console.error('Failed to create prescription:', err);
    } finally {
      setSavingNewRx(false);
    }
  };

  const handleBlockDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      const res = await api.blockDoctorDate(doctor.id, blockDateInput);
      if (res.success) {
        setBlockDateInput('');
        fetchDoctorData();
      }
    } catch (err) {
      console.error('Error blocking date:', err);
    }
  };

  // Unique Patients
  const uniquePatientsMap: Record<string, { patientName: string; patientPhone?: string; patientEmail?: string; lastAppointment: Appointment; count: number }> = {};
  appointments.forEach(apt => {
    if (!uniquePatientsMap[apt.patientId]) {
      uniquePatientsMap[apt.patientId] = {
        patientName: apt.patientName,
        patientPhone: apt.patientPhone,
        patientEmail: apt.patientEmail,
        lastAppointment: apt,
        count: 1
      };
    } else {
      uniquePatientsMap[apt.patientId].count += 1;
    }
  });
  const myPatientsList = Object.entries(uniquePatientsMap);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.appointmentDate === todayStr);
  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED' && a.appointmentDate >= todayStr);
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          {[
            { id: 'DASHBOARD', label: 'Dashboard Overview', icon: BarChart3 },
            { id: 'SCHEDULE', label: 'Clinical Schedule', icon: CalendarDays },
            { id: 'APPOINTMENTS', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'PATIENTS', label: `My Patients (${myPatientsList.length})`, icon: Users },
            { id: 'RECORDS', label: `Medical Records (${medicalRecords.length})`, icon: FileText },
            { id: 'PRESCRIPTIONS', label: `Prescriptions (${prescriptions.length})`, icon: Pill },
            { id: 'REVIEWS', label: `Patient Reviews (${reviews.length})`, icon: Star },
            { id: 'PROFILE', label: 'Doctor Profile', icon: Stethoscope },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800">
                {doctor.specialization}
              </span>
              <span className="text-xs text-slate-400">Hospital Staff Practitioner</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {activeTab === 'DASHBOARD' && `Welcome, ${doctor.fullName}`}
              {activeTab === 'SCHEDULE' && 'Doctor Working Schedule & Availability'}
              {activeTab === 'APPOINTMENTS' && 'Appointment Requests & Consultations'}
              {activeTab === 'PATIENTS' && 'My Registered Patients'}
              {activeTab === 'RECORDS' && 'Medical Records & Clinical Diagnoses'}
              {activeTab === 'PRESCRIPTIONS' && 'Prescription Management & Digital Slips'}
              {activeTab === 'REVIEWS' && 'Patient Ratings & Reviews'}
              {activeTab === 'PROFILE' && 'Doctor Clinical Profile Settings'}
            </h1>
            <p className="text-xs text-slate-500">{doctor.hospital} • {doctor.qualification}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {doctor.rating.toFixed(1)} ({doctor.reviewCount} Reviews)
            </span>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Today's Visits</span>
                  <Clock className="w-4 h-4 text-cyan-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{todayAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Consultations today</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Pending Requests</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-amber-600">{pendingAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Requires your action</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Upcoming Confirmed</span>
                  <Calendar className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-700">{upcomingAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Ready for consultation</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Total Patients</span>
                  <Users className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-black text-purple-700">{myPatientsList.length}</p>
                <p className="text-[11px] text-slate-400">Unique treated patients</p>
              </div>
            </div>

            {/* Pending Action Banner */}
            {pendingAppointments.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <h3 className="text-xs font-bold text-amber-900">
                      {pendingAppointments.length} New Appointment Request(s) Awaiting Review
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Patients booked slots from the portal. Review and click Accept or Reject to update database.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setActiveTab('APPOINTMENTS'); setStatusFilter('PENDING'); }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                >
                  Review Now
                </button>
              </div>
            )}

            {/* Today's Appointments List & Recent Patients */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-600" />
                    Upcoming Scheduled Visits
                  </h3>
                  <button
                    onClick={() => setActiveTab('APPOINTMENTS')}
                    className="text-xs text-cyan-700 font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {upcomingAppointments.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No upcoming visits confirmed yet.</p>
                  ) : (
                    upcomingAppointments.slice(0, 4).map(apt => (
                      <div key={apt.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{apt.patientName}</p>
                          <p className="text-[11px] text-slate-500">{apt.appointmentDate} • {apt.appointmentTime}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-xs">{apt.reason}</p>
                        </div>
                        <button
                          onClick={() => handleOpenConsultModal(apt)}
                          className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Consult
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-teal-600" />
                    Recent Patients
                  </h3>
                  <button
                    onClick={() => setActiveTab('PATIENTS')}
                    className="text-xs text-cyan-700 font-semibold hover:underline cursor-pointer"
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {myPatientsList.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 text-center">No patients registered with this doctor yet.</p>
                  ) : (
                    myPatientsList.slice(0, 4).map(([pId, data]) => (
                      <div key={pId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{data.patientName}</p>
                          <p className="text-[11px] text-slate-500">{data.patientPhone || data.patientEmail}</p>
                          <p className="text-[10px] text-cyan-700 font-semibold">{data.count} Consultation{data.count > 1 ? 's' : ''}</p>
                        </div>
                        <button
                          onClick={() => handleOpenPatientFile(pId)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Profile
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCHEDULE MANAGEMENT */}
        {activeTab === 'SCHEDULE' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div>
              <h3 className="text-base font-bold text-slate-900">Weekly Clinical Practice Schedule</h3>
              <p className="text-xs text-slate-500">Define working days, consultation duration, and block out dates.</p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Practice Days</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                  const isAvailable = doctor.availableDays.includes(day);
                  return (
                    <div key={day} className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                      isAvailable ? 'bg-cyan-50/70 border-cyan-300 text-cyan-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <span>{day}</span>
                      <span>{isAvailable ? '✓ 9AM - 5PM' : 'Off'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-rose-600" />
                Block Date (Leave / Emergency)
              </h4>
              <p className="text-xs text-slate-500">Mark a specific calendar date as unavailable for appointments.</p>
              <form onSubmit={handleBlockDate} className="flex gap-2 max-w-sm">
                <input
                  type="date"
                  required
                  value={blockDateInput}
                  onChange={e => setBlockDateInput(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Block Date
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'REJECTED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'ALL' ? 'All Bookings' : st}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredAppointments.length} appointment records
              </span>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No appointments in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAppointments.map(apt => (
                  <div key={apt.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-2xs hover:border-cyan-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        {apt.appointmentNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'PENDING' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                        apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{apt.patientName}</h3>
                        <p className="text-xs text-slate-500">{apt.patientPhone || apt.patientEmail}</p>
                      </div>
                      <button
                        onClick={() => handleOpenPatientFile(apt.patientId)}
                        className="px-2 py-1 bg-cyan-50 text-cyan-800 rounded-lg text-xs font-semibold border border-cyan-200 cursor-pointer"
                      >
                        View Patient
                      </button>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{apt.appointmentDate}</span>
                        <span>{apt.appointmentTime}</span>
                      </div>
                      <p className="text-slate-600 pt-1"><strong>Reason:</strong> {apt.reason}</p>
                    </div>

                    {apt.diagnosis && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                        <p className="font-bold flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-blue-600" />
                          Diagnosis: {apt.diagnosis}
                        </p>
                        {apt.prescriptionNotes && <p className="text-[11px]">{apt.prescriptionNotes}</p>}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      {apt.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'CONFIRMED')}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(apt.id, 'REJECTED')}
                            className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {apt.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleOpenConsultModal(apt)}
                          className="w-full py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm shadow-cyan-600/30 cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Complete Consultation & Prescribe</span>
                        </button>
                      )}
                      {apt.status === 'COMPLETED' && (
                        <div className="w-full py-1.5 text-center text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Consultation Completed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PATIENTS */}
        {activeTab === 'PATIENTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-800">
              Patients with Scheduled or Past Consultations ({myPatientsList.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Total Consultations</th>
                    <th className="py-3 px-4">Last Visit</th>
                    <th className="py-3 px-4">Last Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myPatientsList.map(([pId, data]) => (
                    <tr key={pId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{data.patientName}</td>
                      <td className="py-3 px-4">{data.patientPhone || data.patientEmail}</td>
                      <td className="py-3 px-4 font-semibold text-cyan-800">{data.count}</td>
                      <td className="py-3 px-4">{data.lastAppointment.appointmentDate}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {data.lastAppointment.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenPatientFile(pId)}
                          className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          View Medical File
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: MEDICAL RECORDS */}
        {activeTab === 'RECORDS' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Clinical Medical Records</h3>
                <p className="text-xs text-slate-500">All medical diagnoses and clinical notes issued by Dr. {doctor.fullName}</p>
              </div>
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search records or patients..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50"
                />
              </div>
            </div>

            {medicalRecords.filter(r => !recordSearch || r.patientName.toLowerCase().includes(recordSearch.toLowerCase()) || r.diagnosis.toLowerCase().includes(recordSearch.toLowerCase())).length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No medical records found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {medicalRecords
                  .filter(r => !recordSearch || r.patientName.toLowerCase().includes(recordSearch.toLowerCase()) || r.diagnosis.toLowerCase().includes(recordSearch.toLowerCase()))
                  .map((rec) => (
                    <div key={rec.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div>
                          <span className="text-xs font-mono text-slate-400">Record #{rec.id} • {rec.date}</span>
                          <h4 className="text-base font-bold text-slate-900 mt-0.5">{rec.diagnosis}</h4>
                          <p className="text-xs text-cyan-700 font-semibold">Patient: {rec.patientName}</p>
                        </div>
                        <button
                          onClick={() => setEditingRecord(rec)}
                          className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-semibold border border-cyan-200 cursor-pointer"
                        >
                          Edit Medical Record
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {rec.symptoms && (
                          <div>
                            <span className="text-slate-500 font-medium block">Symptoms:</span>
                            <p className="text-slate-700 bg-slate-50 p-2 rounded-xl">{rec.symptoms}</p>
                          </div>
                        )}
                        {rec.treatment && (
                          <div>
                            <span className="text-slate-500 font-medium block">Treatment:</span>
                            <p className="text-slate-700 bg-slate-50 p-2 rounded-xl">{rec.treatment}</p>
                          </div>
                        )}
                        {rec.doctorNotes && (
                          <div>
                            <span className="text-slate-500 font-medium block">Doctor Notes:</span>
                            <p className="text-slate-700 bg-slate-50 p-2 rounded-xl">{rec.doctorNotes}</p>
                          </div>
                        )}
                        {rec.followUpDate && (
                          <div>
                            <span className="text-slate-500 font-medium block">Follow-up Date:</span>
                            <p className="text-slate-700 font-semibold">{rec.followUpDate}</p>
                          </div>
                        )}
                      </div>

                      {rec.prescriptions && rec.prescriptions.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">Prescribed Medicines ({rec.prescriptions.length}):</span>
                          <div className="flex flex-wrap gap-2">
                            {rec.prescriptions.map((m, idx) => (
                              <span key={idx} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800">
                                <strong>{m.medicine}</strong> ({m.dosage} - {m.frequency}, {m.duration})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: PRESCRIPTIONS */}
        {activeTab === 'PRESCRIPTIONS' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Prescriptions Management</h3>
                <p className="text-xs text-slate-500">Official medical prescriptions issued to patients with full dosage schedules.</p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search prescriptions..."
                  value={rxSearch}
                  onChange={(e) => setRxSearch(e.target.value)}
                  className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs bg-slate-50 w-full sm:w-48"
                />
                <button
                  onClick={() => {
                    if (myPatientsList.length > 0) setNewRxPatientId(myPatientsList[0][0]);
                    setNewRxModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-linear-to-r from-cyan-600 to-teal-600 text-white rounded-xl text-xs font-semibold whitespace-nowrap shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Prescription</span>
                </button>
              </div>
            </div>

            {prescriptions.filter(p => !rxSearch || p.patientName.toLowerCase().includes(rxSearch.toLowerCase())).length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <Pill className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No prescriptions issued yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions
                  .filter(p => !rxSearch || p.patientName.toLowerCase().includes(rxSearch.toLowerCase()))
                  .map((rx) => (
                    <div key={rx.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {rx.id}
                        </span>
                        <span className="text-xs text-slate-500">{rx.date}</span>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{rx.patientName}</h4>
                        <p className="text-xs text-cyan-700 font-semibold">Physician: Dr. {rx.doctorName}</p>
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Medications:</span>
                        <ul className="space-y-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {rx.medications.map((m, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span className="font-semibold">{m.medicine} ({m.dosage})</span>
                              <span className="text-slate-500">{m.frequency} • {m.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {rx.instructions && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                          <strong>Instructions:</strong> {rx.instructions}
                        </p>
                      )}
                      <div className="pt-2 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => setViewingRx(rx)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          View & Print Slip
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'REVIEWS' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-900">Patient Feedback for {doctor.fullName}</h3>
              <span className="font-bold text-amber-600 text-lg flex items-center gap-1">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                {doctor.rating.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="space-y-3">
              {reviews.map(rev => (
                <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{rev.patientName}</span>
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 italic">"{rev.comment}"</p>
                  <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: PROFILE */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs max-w-2xl">
            <h3 className="text-base font-bold text-slate-900">Update Doctor Profile</h3>
            {profileSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Profile updated successfully.</span>
              </div>
            )}
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Consultation Fee (₹)</label>
                  <input type="number" min="100" value={profileFee} onChange={e => setProfileFee(parseInt(e.target.value) || 500)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Hospital / Clinic</label>
                  <input type="text" value={profileHospital} onChange={e => setProfileHospital(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Contact Phone</label>
                  <input type="text" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Specialization</label>
                  <input type="text" value={profileSpecialization} onChange={e => setProfileSpecialization(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Qualifications / Board Certifications</label>
                  <input type="text" value={profileQualification} onChange={e => setProfileQualification(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Languages (comma-separated)</label>
                  <input type="text" value={profileLanguages} onChange={e => setProfileLanguages(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Profile Photo URL</label>
                <input type="text" value={profilePhotoUrl} onChange={e => setProfilePhotoUrl(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Biography / About</label>
                <textarea rows={3} value={profileAbout} onChange={e => setProfileAbout(e.target.value)} className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <button type="submit" disabled={profileSaving} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold cursor-pointer shadow-sm">
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* CLINICAL CONSULTATION MODAL */}
      {consultModalAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-linear-to-r from-cyan-600 to-teal-700 p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Clinical Consultation & Multi-Medication Prescription</h3>
                <p className="text-xs text-cyan-100">
                  Patient: {consultModalAppointment.patientName} • Ref: {consultModalAppointment.appointmentNumber}
                </p>
              </div>
              <button onClick={() => setConsultModalAppointment(null)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMedicalRecord} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Diagnosis *</label>
                  <input
                    type="text"
                    required
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Upper Respiratory Infection, Viral Fever"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reported Symptoms</label>
                  <input
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. High fever, headache, body chills"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Treatment Plan & Patient Advice</label>
                <input
                  type="text"
                  value={treatment}
                  onChange={(e) => setTreatment(e.target.value)}
                  placeholder="e.g. Bed rest, high fluid intake, avoid exertion"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
                />
              </div>

              {/* Multi-medication Prescriptions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-cyan-600" />
                    Prescribed Medications (Multi-Medication Structure)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMedicationRow}
                    className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-semibold hover:bg-cyan-100 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {medications.map((med, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="col-span-4">
                        <input
                          type="text"
                          placeholder="Medicine (e.g. Paracetamol 650mg)"
                          value={med.medicine}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].medicine = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Dosage (e.g. 1 tab)"
                          value={med.dosage}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].dosage = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          placeholder="Frequency (e.g. Thrice daily)"
                          value={med.frequency}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].frequency = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="col-span-2 flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="5 days"
                          value={med.duration}
                          onChange={(e) => {
                            const updated = [...medications];
                            updated[index].duration = e.target.value;
                            setMedications(updated);
                          }}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                        {medications.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicationRow(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Doctor Remarks / Notes</label>
                  <textarea
                    rows={2}
                    value={doctorNotes}
                    onChange={(e) => setDoctorNotes(e.target.value)}
                    placeholder="Additional clinical remarks..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden resize-none bg-white"
                  ></textarea>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommended Follow-up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConsultModalAppointment(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRecord}
                  className="px-5 py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  {submittingRecord ? 'Saving...' : 'Complete & Issue Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PATIENT PROFILE & MEDICAL HISTORY MODAL */}
      {viewingPatient && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-sm">
                  {viewingPatient.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Patient Medical Dossier: {viewingPatient.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-500">ID: {viewingPatient.id} • Gender: {viewingPatient.gender} • DOB: {viewingPatient.dateOfBirth}</p>
                </div>
              </div>
              <button onClick={() => setViewingPatient(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                <span className="text-[10px] text-rose-600 font-bold block uppercase">Blood Group</span>
                <span className="text-base font-black text-rose-700">{viewingPatient.bloodGroup}</span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                <span className="text-[10px] text-amber-700 font-bold block uppercase">Known Allergies</span>
                <span className="text-xs font-semibold text-amber-900 truncate block">{viewingPatient.allergies || 'None'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Contact Phone</span>
                <span className="text-xs font-semibold text-slate-800 truncate block">{viewingPatient.phone}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-500 font-bold block uppercase">Emergency Contact</span>
                <span className="text-xs font-semibold text-slate-800 truncate block">{viewingPatient.emergencyContact || '—'}</span>
              </div>
            </div>

            {/* Appointment History with Doctor */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-600" />
                Consultation History ({appointments.filter(a => a.patientId === viewingPatient.id).length} visits with Dr. {doctor.fullName})
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {appointments.filter(a => a.patientId === viewingPatient.id).map(apt => (
                  <div key={apt.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <span className="font-bold text-slate-900">{apt.appointmentDate} at {apt.appointmentTime}</span>
                      <p className="text-[11px] text-slate-500 truncate max-w-sm">Reason: {apt.reason}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                      apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Medical Records */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-600" />
                Clinical Medical Records & Prescriptions ({viewingPatientRecords.length})
              </h4>
              {viewingPatientRecords.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No prior clinical records recorded for this patient.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {viewingPatientRecords.map(rec => (
                    <div key={rec.id} className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{rec.diagnosis}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{rec.date} • Dr. {rec.doctorName}</span>
                      </div>
                      {rec.treatment && <p className="text-slate-600 text-[11px]"><strong>Treatment:</strong> {rec.treatment}</p>}
                      {rec.prescriptions && rec.prescriptions.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[10px] font-semibold text-cyan-800">Prescriptions: </span>
                          <span className="text-[11px] text-slate-700">
                            {rec.prescriptions.map(p => `${p.medicine} (${p.dosage}, ${p.frequency})`).join('; ')}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setViewingPatient(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl text-xs cursor-pointer"
              >
                Close Medical File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MEDICAL RECORD MODAL */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Edit Medical Record #{editingRecord.id}</h3>
                <p className="text-xs text-slate-400">Patient: {editingRecord.patientName} • Date: {editingRecord.date}</p>
              </div>
              <button onClick={() => setEditingRecord(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMedicalRecord} className="p-6 space-y-4 text-xs">
              {recordUpdateSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold">
                  {recordUpdateSuccess}
                </div>
              )}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Diagnosis *</label>
                <input
                  type="text"
                  required
                  value={editingRecord.diagnosis}
                  onChange={(e) => setEditingRecord({ ...editingRecord, diagnosis: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reported Symptoms</label>
                  <input
                    type="text"
                    value={editingRecord.symptoms}
                    onChange={(e) => setEditingRecord({ ...editingRecord, symptoms: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Recommended Follow-up Date</label>
                  <input
                    type="date"
                    value={editingRecord.followUpDate || ''}
                    onChange={(e) => setEditingRecord({ ...editingRecord, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Treatment Plan</label>
                <textarea
                  rows={2}
                  value={editingRecord.treatment}
                  onChange={(e) => setEditingRecord({ ...editingRecord, treatment: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Remarks & Notes</label>
                <textarea
                  rows={2}
                  value={editingRecord.doctorNotes}
                  onChange={(e) => setEditingRecord({ ...editingRecord, doctorNotes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEditRecord}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl cursor-pointer"
                >
                  {savingEditRecord ? 'Updating...' : 'Update Medical Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRESCRIPTION MODAL */}
      {newRxModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-linear-to-r from-cyan-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">Create New Prescription</h3>
                <p className="text-xs text-cyan-100">Issued by Dr. {doctor.fullName}</p>
              </div>
              <button onClick={() => setNewRxModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrescription} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
                <select
                  value={newRxPatientId}
                  onChange={(e) => setNewRxPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-semibold bg-white"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {myPatientsList.map(([pId, data]) => (
                    <option key={pId} value={pId}>{data.patientName} ({pId})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">Medications Schedule</span>
                  <button
                    type="button"
                    onClick={() => setNewRxMeds([...newRxMeds, { medicine: '', dosage: '500 mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals' }])}
                    className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Medicine</span>
                  </button>
                </div>
                {newRxMeds.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div className="col-span-4">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={med.medicine}
                        onChange={(e) => {
                          const updated = [...newRxMeds];
                          updated[idx].medicine = e.target.value;
                          setNewRxMeds(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => {
                          const updated = [...newRxMeds];
                          updated[idx].dosage = e.target.value;
                          setNewRxMeds(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-3">
                      <input
                        type="text"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => {
                          const updated = [...newRxMeds];
                          updated[idx].frequency = e.target.value;
                          setNewRxMeds(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs"
                      />
                    </div>
                    <div className="col-span-2 flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => {
                          const updated = [...newRxMeds];
                          updated[idx].duration = e.target.value;
                          setNewRxMeds(updated);
                        }}
                        className="w-full px-2 py-1.5 bg-white border rounded-lg text-xs"
                      />
                      {newRxMeds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setNewRxMeds(newRxMeds.filter((_, i) => i !== idx))}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Instructions / Dietary Advice</label>
                <textarea
                  rows={2}
                  value={newRxInstructions}
                  onChange={(e) => setNewRxInstructions(e.target.value)}
                  placeholder="e.g. Take with warm water, avoid dairy for 2 hours..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs resize-none bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNewRxModalOpen(false)}
                  className="px-4 py-2 text-slate-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingNewRx}
                  className="px-5 py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl cursor-pointer"
                >
                  {savingNewRx ? 'Saving...' : 'Save Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCTOR VIEW PRESCRIPTION SLIP */}
      {viewingRx && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 p-8 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900">MAVERICK HEALTHCARE</h2>
                <p className="text-xs text-slate-500">Official Clinical Outpatient Prescription</p>
                <p className="text-xs text-slate-700 font-semibold mt-1">Doctor: Dr. {viewingRx.doctorName}</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono text-slate-500 block">Prescription ID: {viewingRx.id}</span>
                <span className="font-semibold text-slate-800">Date: {viewingRx.date}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
              <div><span className="text-slate-400 block">Patient Name</span><span className="font-bold text-slate-900">{viewingRx.patientName}</span></div>
              <div><span className="text-slate-400 block">Patient ID</span><span className="font-mono text-slate-700">{viewingRx.patientId}</span></div>
            </div>

            <div className="text-xs space-y-2">
              <span className="font-bold text-xl text-cyan-800 font-serif">℞ Prescription</span>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                    <tr>
                      <th className="p-2.5">Medicine</th>
                      <th className="p-2.5">Dosage</th>
                      <th className="p-2.5">Frequency</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {viewingRx.medications.map((rx, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-slate-900">{rx.medicine}</td>
                        <td className="p-2.5">{rx.dosage}</td>
                        <td className="p-2.5">{rx.frequency}</td>
                        <td className="p-2.5 font-semibold text-emerald-700">{rx.duration}</td>
                        <td className="p-2.5 text-slate-600">{rx.instructions || 'As directed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {viewingRx.instructions && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-semibold text-slate-700 block mb-0.5">Doctor Instructions:</span>
                <p className="text-slate-600">{viewingRx.instructions}</p>
              </div>
            )}

            <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
              <p className="text-[10px] text-slate-400">Maverick EMR System • Authenticated Medical Practitioner Authorization</p>
              <div className="text-right">
                <div className="w-36 border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-900">Dr. {viewingRx.doctorName}</p>
                <p className="text-[10px] text-slate-500">Authorized Specialist</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => setViewingRx(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer">Close</button>
              <button onClick={() => window.print()} className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
                <span>Print Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
