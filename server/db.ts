import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
  phone: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: string; // 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  startTime: string; // '09:00 AM'
  endTime: string; // '05:00 PM'
  slotDurationMinutes?: number;
  breakStartTime?: string; // '01:00 PM'
  breakEndTime?: string; // '02:00 PM'
  isAvailable: boolean;
  blockedDates?: string[]; // e.g. ['2026-10-15']
}

export interface Doctor {
  id: string;
  userId: string;
  fullName: string;
  specialization: string;
  qualification: string;
  experience: number;
  hospital: string;
  consultationFee: number;
  location: string;
  about: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  availableDays: string[];
  availableTimeSlots: string[];
  email: string;
  phone: string;
  availabilityStatus: 'AVAILABLE_TODAY' | 'AVAILABLE_TOMORROW' | 'NEXT_WEEK';
  photoUrl: string;
  availabilitySchedule?: DoctorAvailability[];
}

export interface Patient {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  allergies: string;
  avatarUrl?: string;
}

export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // e.g. "10:00 AM"
  reason: string;
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
  notes: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  doctorName: string;
  doctorSpecialization: string;
  hospital: string;
  consultationFee: number;
  diagnosis?: string;
  prescriptionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  doctorName: string;
  patientName: string;
  date: string;
  medications: PrescriptionItem[];
  instructions?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  patientName: string;
  date: string;
  diagnosis: string;
  symptoms: string;
  treatment: string;
  doctorNotes: string;
  followUpDate?: string;
  prescriptions?: PrescriptionItem[];
  createdAt: string;
}

export interface Review {
  id: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface SystemNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'APPOINTMENT' | 'SYSTEM' | 'MEDICAL';
  isRead: boolean;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  prescriptions: Prescription[];
  doctorAvailability: DoctorAvailability[];
  reviews: Review[];
  notifications: SystemNotification[];
}

const DB_FILE_PATH = path.resolve(process.cwd(), 'data', 'careconnect_db.json');

const INITIAL_DATA: DatabaseSchema = {
  users: [
    {
      id: 'usr-admin-1',
      email: 'admin@careconnect.com',
      passwordHash: 'admin123',
      name: 'System Administrator',
      role: 'ADMIN',
      phone: '+91 98765 43210',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00Z'
    },
    {
      id: 'usr-doc-1',
      email: 'dr.rajesh@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Rajesh Patel',
      role: 'DOCTOR',
      phone: '+91 98234 56781',
      avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-05T00:00:00Z'
    },
    {
      id: 'usr-doc-2',
      email: 'dr.priya@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Priya Sharma',
      role: 'DOCTOR',
      phone: '+91 98234 56782',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-06T00:00:00Z'
    },
    {
      id: 'usr-doc-3',
      email: 'dr.arun@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Arun Venkatesh',
      role: 'DOCTOR',
      phone: '+91 98234 56783',
      avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-07T00:00:00Z'
    },
    {
      id: 'usr-doc-4',
      email: 'dr.sunita@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Sunita Kulkarni',
      role: 'DOCTOR',
      phone: '+91 98234 56784',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-08T00:00:00Z'
    },
    {
      id: 'usr-doc-5',
      email: 'dr.amitabha@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Amitabha Roy',
      role: 'DOCTOR',
      phone: '+91 98234 56785',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-09T00:00:00Z'
    },
    {
      id: 'usr-doc-6',
      email: 'dr.meera@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Meera Nambiar',
      role: 'DOCTOR',
      phone: '+91 98234 56786',
      avatarUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-10T00:00:00Z'
    },
    {
      id: 'usr-doc-7',
      email: 'dr.vikram@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Vikramaditya Rathore',
      role: 'DOCTOR',
      phone: '+91 98234 56787',
      avatarUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-11T00:00:00Z'
    },
    {
      id: 'usr-doc-8',
      email: 'dr.kavita@careconnect.com',
      passwordHash: 'doctor123',
      name: 'Dr. Kavita Desai',
      role: 'DOCTOR',
      phone: '+91 98234 56788',
      avatarUrl: 'https://images.unsplash.com/photo-1643297654416-05795d640792?auto=format&fit=crop&q=80&w=800',
      status: 'ACTIVE',
      createdAt: '2026-01-12T00:00:00Z'
    },
    {
      id: 'usr-pat-1',
      email: 'patient@careconnect.com',
      passwordHash: 'patient123',
      name: 'Rahul Verma',
      role: 'PATIENT',
      phone: '+91 98111 22334',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-15T00:00:00Z'
    },
    {
      id: 'usr-pat-2',
      email: 'ananya.sen@gmail.com',
      passwordHash: 'patient123',
      name: 'Ananya Sen',
      role: 'PATIENT',
      phone: '+91 98111 22335',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-16T00:00:00Z'
    },
    {
      id: 'usr-pat-3',
      email: 'rohit.gupta@gmail.com',
      passwordHash: 'patient123',
      name: 'Rohit Gupta',
      role: 'PATIENT',
      phone: '+91 98111 22336',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
      status: 'ACTIVE',
      createdAt: '2026-01-17T00:00:00Z'
    }
  ],
  doctors: [
    {
      id: 'doc-1',
      userId: 'usr-doc-1',
      fullName: 'Dr. Rajesh Patel',
      specialization: 'Cardiology',
      qualification: 'MBBS, MD (Medicine), DM (Cardiology), FACC',
      experience: 16,
      hospital: 'Apex Heart & Multispeciality Hospital',
      consultationFee: 900,
      location: 'Mumbai, Maharashtra',
      about: 'Senior Interventional Cardiologist with extensive expertise in coronary angiography, angioplasty, heart failure management, and preventive cardiac wellness. Committed to compassionate, evidence-based care.',
      languages: ['English', 'Hindi', 'Gujarati'],
      rating: 4.9,
      reviewCount: 184,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableTimeSlots: ['09:00 AM', '10:00 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'],
      email: 'dr.rajesh@careconnect.com',
      phone: '+91 98234 56781',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-2',
      userId: 'usr-doc-2',
      fullName: 'Dr. Priya Sharma',
      specialization: 'Neurology',
      qualification: 'MBBS, MD, DM (Neurology), Fellowship in Stroke (UK)',
      experience: 13,
      hospital: 'Max Super Speciality Neuro Institute',
      consultationFee: 1000,
      location: 'New Delhi, Delhi NCR',
      about: 'Renowned Neurologist specializing in stroke management, epilepsy, Parkinson disease, migraines, and neuro-rehabilitation with 13+ years of clinical excellence.',
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.9,
      reviewCount: 156,
      availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      availableTimeSlots: ['09:30 AM', '11:00 AM', '01:30 PM', '03:00 PM', '04:30 PM'],
      email: 'dr.priya@careconnect.com',
      phone: '+91 98234 56782',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-3',
      userId: 'usr-doc-3',
      fullName: 'Dr. Arun Venkatesh',
      specialization: 'Orthopedics',
      qualification: 'MBBS, MS (Orthopedics), M.Ch (Joint Replacement)',
      experience: 18,
      hospital: 'Apollo Ortho & Sports Injury Centre',
      consultationFee: 850,
      location: 'Bengaluru, Karnataka',
      about: 'Senior Consultant Orthopedic & Joint Replacement Surgeon with more than 3,000 successful hip and knee arthroplasties and arthroscopic sports surgeries.',
      languages: ['English', 'Hindi', 'Kannada', 'Tamil'],
      rating: 4.8,
      reviewCount: 210,
      availableDays: ['Tuesday', 'Thursday', 'Friday', 'Saturday'],
      availableTimeSlots: ['10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM', '05:30 PM'],
      email: 'dr.arun@careconnect.com',
      phone: '+91 98234 56783',
      availabilityStatus: 'AVAILABLE_TOMORROW',
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-4',
      userId: 'usr-doc-4',
      fullName: 'Dr. Sunita Kulkarni',
      specialization: 'Pediatrics',
      qualification: 'MBBS, DCH, DNB (Pediatrics), MNAMS',
      experience: 15,
      hospital: 'Rainbow Children Medicare & Child Hospital',
      consultationFee: 700,
      location: 'Pune, Maharashtra',
      about: 'Dedicated Pediatrician and Child Health Specialist with expertise in neonatal care, infant nutrition, childhood developmental screening, and vaccination programmes.',
      languages: ['English', 'Hindi', 'Marathi'],
      rating: 4.9,
      reviewCount: 245,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      availableTimeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'],
      email: 'dr.sunita@careconnect.com',
      phone: '+91 98234 56784',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-5',
      userId: 'usr-doc-5',
      fullName: 'Dr. Amitabha Roy',
      specialization: 'Dermatology',
      qualification: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
      experience: 11,
      hospital: 'DermaCare Skin & Aesthetic Clinic',
      consultationFee: 750,
      location: 'Kolkata, West Bengal',
      about: 'Leading Dermatologist specializing in clinical dermatology, acne scarring, eczema, psoriasis, hair restoration, and laser aesthetic procedures.',
      languages: ['English', 'Hindi', 'Bengali'],
      rating: 4.7,
      reviewCount: 132,
      availableDays: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
      availableTimeSlots: ['10:00 AM', '11:30 AM', '01:00 PM', '03:30 PM', '05:00 PM'],
      email: 'dr.amitabha@careconnect.com',
      phone: '+91 98234 56785',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-6',
      userId: 'usr-doc-6',
      fullName: 'Dr. Meera Nambiar',
      specialization: 'General Medicine',
      qualification: 'MBBS, MD (Internal Medicine), FICP',
      experience: 14,
      hospital: 'Aster Prime Multispeciality Hospital',
      consultationFee: 650,
      location: 'Hyderabad, Telangana',
      about: 'Senior Consultant Physician experienced in managing chronic conditions including diabetes mellitus, hypertension, thyroid disorders, and infectious diseases.',
      languages: ['English', 'Hindi', 'Telugu', 'Malayalam'],
      rating: 4.8,
      reviewCount: 198,
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableTimeSlots: ['08:30 AM', '10:00 AM', '11:30 AM', '02:00 PM', '04:00 PM'],
      email: 'dr.meera@careconnect.com',
      phone: '+91 98234 56786',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-7',
      userId: 'usr-doc-7',
      fullName: 'Dr. Vikramaditya Rathore',
      specialization: 'Ophthalmology',
      qualification: 'MBBS, MS (Ophthalmology), FICO (London)',
      experience: 12,
      hospital: 'Sankara Eye & Retina Institute',
      consultationFee: 700,
      location: 'Jaipur, Rajasthan',
      about: 'Cataract, Cornea, and Refractive Surgeon with advanced expertise in robotic blade-free LASIK, phacoemulsification, and diabetic retinopathy screening.',
      languages: ['English', 'Hindi', 'Rajasthani'],
      rating: 4.8,
      reviewCount: 164,
      availableDays: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
      availableTimeSlots: ['09:00 AM', '10:30 AM', '12:00 PM', '03:00 PM', '04:30 PM'],
      email: 'dr.vikram@careconnect.com',
      phone: '+91 98234 56787',
      availabilityStatus: 'AVAILABLE_TOMORROW',
      photoUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'doc-8',
      userId: 'usr-doc-8',
      fullName: 'Dr. Kavita Desai',
      specialization: 'Psychiatry',
      qualification: 'MBBS, MD (Psychiatry), DNB, Diploma in CBT',
      experience: 10,
      hospital: 'MindWell Behavioral Health & Wellness Clinic',
      consultationFee: 1100,
      location: 'Ahmedabad, Gujarat',
      about: 'Compassionate Consultant Psychiatrist and Psychotherapist specializing in anxiety disorders, depression, stress management, insomnia, and adolescent mental health.',
      languages: ['English', 'Hindi', 'Gujarati'],
      rating: 4.9,
      reviewCount: 118,
      availableDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
      availableTimeSlots: ['11:00 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM'],
      email: 'dr.kavita@careconnect.com',
      phone: '+91 98234 56788',
      availabilityStatus: 'AVAILABLE_TODAY',
      photoUrl: 'https://images.unsplash.com/photo-1643297654416-05795d640792?auto=format&fit=crop&q=80&w=800'
    }
  ],
  doctorAvailability: [
    {
      id: 'avail-1',
      doctorId: 'doc-1',
      dayOfWeek: 'Monday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 30,
      breakStartTime: '01:00 PM',
      breakEndTime: '02:00 PM',
      isAvailable: true,
      blockedDates: []
    },
    {
      id: 'avail-2',
      doctorId: 'doc-1',
      dayOfWeek: 'Tuesday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 30,
      breakStartTime: '01:00 PM',
      breakEndTime: '02:00 PM',
      isAvailable: true,
      blockedDates: []
    },
    {
      id: 'avail-3',
      doctorId: 'doc-1',
      dayOfWeek: 'Wednesday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 30,
      breakStartTime: '01:00 PM',
      breakEndTime: '02:00 PM',
      isAvailable: true,
      blockedDates: []
    },
    {
      id: 'avail-4',
      doctorId: 'doc-1',
      dayOfWeek: 'Thursday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 30,
      breakStartTime: '01:00 PM',
      breakEndTime: '02:00 PM',
      isAvailable: true,
      blockedDates: []
    },
    {
      id: 'avail-5',
      doctorId: 'doc-1',
      dayOfWeek: 'Friday',
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      slotDurationMinutes: 30,
      breakStartTime: '01:00 PM',
      breakEndTime: '02:00 PM',
      isAvailable: true,
      blockedDates: []
    }
  ],
  patients: [
    {
      id: 'pat-1',
      userId: 'usr-pat-1',
      fullName: 'Rahul Verma',
      email: 'patient@careconnect.com',
      phone: '+91 98111 22334',
      gender: 'Male',
      dateOfBirth: '1992-06-14',
      bloodGroup: 'B+',
      address: 'Flat 402, Green Meadows, Andheri West, Mumbai',
      emergencyContact: '+91 98111 99887 (Pooja Verma - Spouse)',
      allergies: 'Penicillin'
    },
    {
      id: 'pat-2',
      userId: 'usr-pat-2',
      fullName: 'Ananya Sen',
      email: 'ananya.sen@gmail.com',
      phone: '+91 98111 22335',
      gender: 'Female',
      dateOfBirth: '1995-11-20',
      bloodGroup: 'O+',
      address: '7B, Lake View Enclave, Salt Lake, Kolkata',
      emergencyContact: '+91 98111 88776 (Subhash Sen - Father)',
      allergies: 'None known'
    },
    {
      id: 'pat-3',
      userId: 'usr-pat-3',
      fullName: 'Rohit Gupta',
      email: 'rohit.gupta@gmail.com',
      phone: '+91 98111 22336',
      gender: 'Male',
      dateOfBirth: '1988-03-05',
      bloodGroup: 'A+',
      address: '24, Indiranagar 100ft Road, Bengaluru',
      emergencyContact: '+91 98111 77665 (Kavita Gupta - Sister)',
      allergies: 'Sulfa Drugs'
    }
  ],
  appointments: [],
  prescriptions: [],
  medicalRecords: [],
  reviews: [],
  notifications: []
};

class RelationalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (!parsed.prescriptions) parsed.prescriptions = INITIAL_DATA.prescriptions;
        if (!parsed.doctorAvailability) parsed.doctorAvailability = INITIAL_DATA.doctorAvailability;
        return parsed;
      } else {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
        return JSON.parse(JSON.stringify(INITIAL_DATA));
      }
    } catch (err) {
      console.error('Failed to load database file, falling back to initial data:', err);
      return JSON.parse(JSON.stringify(INITIAL_DATA));
    }
  }

  private persist() {
    try {
      const dir = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save to database file:', err);
    }
  }

  // Users
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.users.push(newUser);
    this.persist();
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.persist();
    return this.data.users[index];
  }

  deleteUser(id: string): boolean {
    const prevLen = this.data.users.length;
    this.data.users = this.data.users.filter(u => u.id !== id);
    this.data.doctors = this.data.doctors.filter(d => d.userId !== id);
    this.data.patients = this.data.patients.filter(p => p.userId !== id);
    this.persist();
    return this.data.users.length < prevLen;
  }

  // Doctors
  getDoctors(): Doctor[] {
    return this.data.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.data.doctors.find(d => d.id === id);
  }

  getDoctorByUserId(userId: string): Doctor | undefined {
    return this.data.doctors.find(d => d.userId === userId);
  }

  createDoctor(doctor: Omit<Doctor, 'id'>): Doctor {
    const newDoc: Doctor = {
      ...doctor,
      id: `doc-${Date.now()}`
    };
    this.data.doctors.push(newDoc);
    this.persist();
    return newDoc;
  }

  updateDoctor(id: string, updates: Partial<Doctor>): Doctor | undefined {
    const index = this.data.doctors.findIndex(d => d.id === id);
    if (index === -1) return undefined;
    this.data.doctors[index] = { ...this.data.doctors[index], ...updates };
    this.persist();
    return this.data.doctors[index];
  }

  deleteDoctor(id: string): boolean {
    const prev = this.data.doctors.length;
    const doc = this.getDoctorById(id);
    if (!doc) return false;
    this.data.doctors = this.data.doctors.filter(d => d.id !== id);
    if (doc.userId) {
      this.data.users = this.data.users.filter(u => u.id !== doc.userId);
    }
    this.data.doctorAvailability = this.data.doctorAvailability.filter(a => a.doctorId !== id);
    this.persist();
    return this.data.doctors.length < prev;
  }

  // Doctor Availability
  getDoctorAvailability(doctorId: string): DoctorAvailability[] {
    return this.data.doctorAvailability.filter(a => a.doctorId === doctorId);
  }

  setDoctorAvailability(doctorId: string, schedules: Omit<DoctorAvailability, 'id'>[]): DoctorAvailability[] {
    this.data.doctorAvailability = this.data.doctorAvailability.filter(a => a.doctorId !== doctorId);
    const created: DoctorAvailability[] = schedules.map((s, idx) => ({
      ...s,
      id: `avail-${doctorId}-${Date.now()}-${idx}`
    }));
    this.data.doctorAvailability.push(...created);
    const doc = this.getDoctorById(doctorId);
    if (doc) {
      doc.availableDays = created.filter(c => c.isAvailable).map(c => c.dayOfWeek);
    }
    this.persist();
    return created;
  }

  blockDoctorDate(doctorId: string, date: string): boolean {
    const avail = this.data.doctorAvailability.filter(a => a.doctorId === doctorId);
    avail.forEach(a => {
      if (!a.blockedDates) a.blockedDates = [];
      if (!a.blockedDates.includes(date)) a.blockedDates.push(date);
    });
    this.persist();
    return true;
  }

  // Patients
  getPatients(): Patient[] {
    return this.data.patients;
  }

  getPatientById(id: string): Patient | undefined {
    return this.data.patients.find(p => p.id === id);
  }

  getPatientByUserId(userId: string): Patient | undefined {
    return this.data.patients.find(p => p.userId === userId);
  }

  createPatient(patient: Omit<Patient, 'id'>): Patient {
    const newPat: Patient = {
      ...patient,
      id: `pat-${Date.now()}`
    };
    this.data.patients.push(newPat);
    this.persist();
    return newPat;
  }

  updatePatient(id: string, updates: Partial<Patient>): Patient | undefined {
    const index = this.data.patients.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.data.patients[index] = { ...this.data.patients[index], ...updates };
    this.persist();
    return this.data.patients[index];
  }

  // Appointments
  getAppointments(): Appointment[] {
    return this.data.appointments;
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.data.appointments.find(a => a.id === id);
  }

  getAppointmentsByPatientId(patientId: string): Appointment[] {
    return this.data.appointments
      .filter(a => a.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAppointmentsByDoctorId(doctorId: string): Appointment[] {
    return this.data.appointments
      .filter(a => a.doctorId === doctorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createAppointment(apt: Omit<Appointment, 'id' | 'appointmentNumber' | 'createdAt' | 'updatedAt'>): Appointment {
    const count = this.data.appointments.length + 1001;
    const now = new Date().toISOString();
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      appointmentNumber: `APT-${count}`,
      createdAt: now,
      updatedAt: now
    };
    this.data.appointments.push(newApt);

    // Notify doctor
    const doctor = this.getDoctorById(apt.doctorId);
    if (doctor) {
      this.createNotification({
        userId: doctor.userId,
        title: 'New Appointment Booked',
        message: `${apt.patientName} booked an appointment for ${apt.appointmentDate} at ${apt.appointmentTime}.`,
        type: 'APPOINTMENT'
      });
    }

    // Notify patient
    const patient = this.getPatientById(apt.patientId);
    if (patient) {
      this.createNotification({
        userId: patient.userId,
        title: 'Appointment Request Submitted',
        message: `Your appointment request with ${apt.doctorName} for ${apt.appointmentDate} at ${apt.appointmentTime} is PENDING confirmation.`,
        type: 'APPOINTMENT'
      });
    }

    this.persist();
    return newApt;
  }

  updateAppointmentStatus(id: string, status: Appointment['status'], notes?: string): Appointment | undefined {
    const index = this.data.appointments.findIndex(a => a.id === id);
    if (index === -1) return undefined;
    const apt = this.data.appointments[index];
    apt.status = status;
    if (notes) apt.notes = notes;
    apt.updatedAt = new Date().toISOString();

    const patient = this.getPatientById(apt.patientId);
    if (patient) {
      let msg = `Your appointment with ${apt.doctorName} on ${apt.appointmentDate} is now ${status}.`;
      if (status === 'CONFIRMED') {
        msg = `Good news! ${apt.doctorName} has CONFIRMED your appointment on ${apt.appointmentDate} at ${apt.appointmentTime}.`;
      } else if (status === 'REJECTED') {
        msg = `Your appointment request with ${apt.doctorName} for ${apt.appointmentDate} was declined. Please choose another slot.`;
      } else if (status === 'COMPLETED') {
        msg = `Your consultation with ${apt.doctorName} has been completed. A digital prescription and medical record have been issued.`;
      } else if (status === 'CANCELLED') {
        msg = `Appointment with ${apt.doctorName} on ${apt.appointmentDate} has been cancelled.`;
      }
      this.createNotification({
        userId: patient.userId,
        title: `Appointment ${status}`,
        message: msg,
        type: 'APPOINTMENT'
      });
    }

    if (status === 'CANCELLED') {
      const doctor = this.getDoctorById(apt.doctorId);
      if (doctor) {
        this.createNotification({
          userId: doctor.userId,
          title: 'Appointment Cancelled',
          message: `Appointment ${apt.appointmentNumber} for ${apt.patientName} on ${apt.appointmentDate} at ${apt.appointmentTime} has been cancelled.`,
          type: 'APPOINTMENT'
        });
      }
    }

    this.persist();
    return apt;
  }

  deleteAppointment(id: string): boolean {
    const prev = this.data.appointments.length;
    this.data.appointments = this.data.appointments.filter(a => a.id !== id);
    this.persist();
    return this.data.appointments.length < prev;
  }

  // Medical Records
  getMedicalRecords(): MedicalRecord[] {
    return this.data.medicalRecords;
  }

  getMedicalRecordById(id: string): MedicalRecord | undefined {
    return this.data.medicalRecords.find(m => m.id === id);
  }

  getMedicalRecordsByPatientId(patientId: string): MedicalRecord[] {
    return this.data.medicalRecords
      .filter(m => m.patientId === patientId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getMedicalRecordsByDoctorId(doctorId: string): MedicalRecord[] {
    return this.data.medicalRecords
      .filter(m => m.doctorId === doctorId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  updateMedicalRecord(id: string, updates: Partial<MedicalRecord>): MedicalRecord | null {
    const idx = this.data.medicalRecords.findIndex(m => m.id === id);
    if (idx === -1) return null;
    this.data.medicalRecords[idx] = {
      ...this.data.medicalRecords[idx],
      ...updates,
    };
    this.persist();
    return this.data.medicalRecords[idx];
  }

  createMedicalRecord(record: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord {
    const newRecord: MedicalRecord = {
      ...record,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.medicalRecords.push(newRecord);

    if (record.prescriptions && record.prescriptions.length > 0) {
      this.createPrescription({
        patientId: record.patientId,
        doctorId: record.doctorId,
        appointmentId: record.appointmentId,
        doctorName: record.doctorName,
        patientName: record.patientName,
        date: record.date,
        medications: record.prescriptions,
        instructions: record.treatment || record.doctorNotes
      });
    }

    const patient = this.getPatientById(record.patientId);
    if (patient) {
      this.createNotification({
        userId: patient.userId,
        title: 'New Medical Record & Prescription Added',
        message: `${record.doctorName} has added diagnosis (${record.diagnosis}) and prescription to your medical history.`,
        type: 'MEDICAL'
      });
    }

    this.persist();
    return newRecord;
  }

  // Prescriptions
  getPrescriptions(): Prescription[] {
    return this.data.prescriptions;
  }

  getPrescriptionsByPatientId(patientId: string): Prescription[] {
    return this.data.prescriptions
      .filter(p => p.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getPrescriptionsByDoctorId(doctorId: string): Prescription[] {
    return this.data.prescriptions
      .filter(p => p.doctorId === doctorId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getPrescriptionById(id: string): Prescription | undefined {
    return this.data.prescriptions.find(p => p.id === id);
  }

  createPrescription(p: Omit<Prescription, 'id' | 'createdAt'>): Prescription {
    const newRx: Prescription = {
      ...p,
      id: `rx-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.prescriptions.push(newRx);
    this.persist();
    return newRx;
  }

  // Reviews
  getReviews(): Review[] {
    return this.data.reviews;
  }

  getReviewsByDoctorId(doctorId: string): Review[] {
    return this.data.reviews.filter(r => r.doctorId === doctorId);
  }

  createReview(review: Omit<Review, 'id' | 'date'>): Review {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    this.data.reviews.push(newRev);

    const docReviews = this.getReviewsByDoctorId(review.doctorId);
    const avg = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
    this.updateDoctor(review.doctorId, {
      rating: parseFloat(avg.toFixed(1)),
      reviewCount: docReviews.length
    });

    this.persist();
    return newRev;
  }

  deleteReview(id: string): boolean {
    const rev = this.data.reviews.find(r => r.id === id);
    if (!rev) return false;
    const docId = rev.doctorId;
    this.data.reviews = this.data.reviews.filter(r => r.id !== id);

    const docReviews = this.getReviewsByDoctorId(docId);
    if (docReviews.length > 0) {
      const avg = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
      this.updateDoctor(docId, {
        rating: parseFloat(avg.toFixed(1)),
        reviewCount: docReviews.length
      });
    } else {
      this.updateDoctor(docId, { rating: 5.0, reviewCount: 0 });
    }

    this.persist();
    return true;
  }

  // Notifications
  getNotifications(userId: string): SystemNotification[] {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createNotification(notif: Omit<SystemNotification, 'id' | 'createdAt' | 'isRead'>): SystemNotification {
    const newNotif: SystemNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    this.data.notifications.push(newNotif);
    this.persist();
    return newNotif;
  }

  markNotificationAsRead(id: string): void {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }

  // Stats for Admin
  getSystemStats() {
    const totalUsers = this.data.users.length;
    const totalDoctors = this.data.doctors.length;
    const totalPatients = this.data.patients.length;
    const totalAppointments = this.data.appointments.length;
    const completedAppointments = this.data.appointments.filter(a => a.status === 'COMPLETED').length;
    const pendingAppointments = this.data.appointments.filter(a => a.status === 'PENDING').length;
    const confirmedAppointments = this.data.appointments.filter(a => a.status === 'CONFIRMED').length;
    const rejectedAppointments = this.data.appointments.filter(a => a.status === 'REJECTED').length;
    const cancelledAppointments = this.data.appointments.filter(a => a.status === 'CANCELLED').length;
    const totalRevenue = this.data.appointments
      .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
      .reduce((sum, a) => sum + (a.consultationFee || 0), 0);

    const appointmentsByStatus = {
      PENDING: pendingAppointments,
      CONFIRMED: confirmedAppointments,
      COMPLETED: completedAppointments,
      REJECTED: rejectedAppointments,
      CANCELLED: cancelledAppointments
    };

    const monthsMap: Record<string, number> = {};
    ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].forEach(m => { monthsMap[m] = 0; });
    this.data.appointments.forEach(apt => {
      const d = new Date(apt.appointmentDate);
      if (!isNaN(d.getTime())) {
        const monthName = d.toLocaleString('en-US', { month: 'short' });
        monthsMap[monthName] = (monthsMap[monthName] || 0) + 1;
      }
    });

    const appointmentsByMonth = Object.keys(monthsMap).map(month => ({
      month,
      count: Math.max(monthsMap[month], 1)
    }));

    const specMap: Record<string, { count: number; totalRating: number }> = {};
    this.data.doctors.forEach(doc => {
      if (!specMap[doc.specialization]) {
        specMap[doc.specialization] = { count: 0, totalRating: 0 };
      }
      specMap[doc.specialization].count += 1;
      specMap[doc.specialization].totalRating += doc.rating;
    });

    const doctorStats = Object.keys(specMap).map(spec => ({
      specialization: spec,
      count: specMap[spec].count,
      avgRating: parseFloat((specMap[spec].totalRating / specMap[spec].count).toFixed(1))
    }));

    const regMap: Record<string, number> = {
      'Jan': 4,
      'Feb': 6,
      'Mar': 9,
      'Apr': 12,
      'May': 15,
      'Jun': 21
    };

    const patientRegistrations = Object.keys(regMap).map(month => ({
      month,
      count: regMap[month]
    }));

    return {
      totalUsers,
      totalDoctors,
      totalPatients,
      totalAppointments,
      completedAppointments,
      pendingAppointments,
      confirmedAppointments,
      totalRevenue,
      appointmentsByStatus,
      appointmentsByMonth,
      doctorStats,
      patientRegistrations
    };
  }
}

export const db = new RelationalDatabase();
