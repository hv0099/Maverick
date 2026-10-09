export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
}

export interface DoctorAvailability {
  id: string;
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  slotDurationMinutes?: number;
  breakStartTime?: string;
  breakEndTime?: string;
  isAvailable: boolean;
  blockedDates?: string[];
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
  reviews?: Review[];
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

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  totalRevenue: number;
  appointmentsByStatus: Record<string, number>;
  appointmentsByMonth: Array<{ month: string; count: number }>;
  doctorStats: Array<{ specialization: string; count: number; avgRating: number }>;
  patientRegistrations: Array<{ month: string; count: number }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  count?: number;
  token?: string;
  user?: User;
  doctor?: Doctor;
  patient?: Patient;
}
