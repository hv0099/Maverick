import { User, Doctor, Patient, Appointment, MedicalRecord, Prescription, Review, SystemNotification, SystemStats, ApiResponse, UserRole } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('cc_token');
  const storedUser = localStorage.getItem('cc_user');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (storedUser) {
    try {
      const u = JSON.parse(storedUser);
      if (u.id) headers['x-user-id'] = u.id;
      if (u.role === 'DOCTOR') {
        const storedDoc = localStorage.getItem('cc_doctor');
        if (storedDoc) {
          const doc = JSON.parse(storedDoc);
          if (doc.id) headers['x-doctor-id'] = doc.id;
        }
      }
    } catch {
      // ignore
    }
  }
  return headers;
}

export const api = {
  // Auth
  async login(email: string, password: string, role?: UserRole): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_user', JSON.stringify(data.user));
      if (data.doctor) localStorage.setItem('cc_doctor', JSON.stringify(data.doctor));
      if (data.patient) localStorage.setItem('cc_patient', JSON.stringify(data.patient));
    }
    return data;
  },

  async register(params: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role?: UserRole;
    gender?: string;
    dateOfBirth?: string;
    bloodGroup?: string;
    address?: string;
  }): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (data.success && data.token) {
      localStorage.setItem('cc_token', data.token);
      localStorage.setItem('cc_user', JSON.stringify(data.user));
      if (data.patient) localStorage.setItem('cc_patient', JSON.stringify(data.patient));
    }
    return data;
  },

  async getCurrentUser(): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Doctors
  async getDoctors(params?: { search?: string; specialization?: string; location?: string; minRating?: string }): Promise<ApiResponse<Doctor[]>> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.specialization && params.specialization !== 'All') query.append('specialization', params.specialization);
    if (params?.location && params.location !== 'All') query.append('location', params.location);
    if (params?.minRating) query.append('minRating', params.minRating);

    const res = await fetch(`${API_BASE}/doctors?${query.toString()}`);
    return res.json();
  },

  async getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    const res = await fetch(`${API_BASE}/doctors/${id}`);
    return res.json();
  },

  async createDoctor(docData: any): Promise<ApiResponse<Doctor>> {
    const res = await fetch(`${API_BASE}/doctors`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(docData),
    });
    return res.json();
  },

  async updateDoctor(id: string, updates: Partial<Doctor>): Promise<ApiResponse<Doctor>> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteDoctor(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getDoctorAvailability(doctorId: string, date?: string): Promise<any> {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await fetch(`${API_BASE}/doctors/${doctorId}/availability${query}`);
    return res.json();
  },

  async blockDoctorDate(doctorId: string, date: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/doctors/${doctorId}/block-date`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ date }),
    });
    return res.json();
  },

  // Appointments
  async getAllAppointments(): Promise<ApiResponse<Appointment[]>> {
    const res = await fetch(`${API_BASE}/appointments`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getPatientAppointments(patientId: string): Promise<ApiResponse<Appointment[]>> {
    const res = await fetch(`${API_BASE}/appointments/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getDoctorAppointments(doctorId: string): Promise<ApiResponse<Appointment[]>> {
    const res = await fetch(`${API_BASE}/appointments/doctor/${doctorId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async bookAppointment(data: {
    patientId: string;
    doctorId: string;
    appointmentDate: string;
    appointmentTime: string;
    reason?: string;
    notes?: string;
  }): Promise<ApiResponse<Appointment>> {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateAppointmentStatus(
    id: string,
    status: string,
    notes?: string,
    diagnosis?: string,
    prescriptionNotes?: string
  ): Promise<ApiResponse<Appointment>> {
    const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes, diagnosis, prescriptionNotes }),
    });
    return res.json();
  },

  async deleteAppointment(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Patients
  async getPatients(): Promise<ApiResponse<Patient[]>> {
    const res = await fetch(`${API_BASE}/patients`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getPatient(id: string): Promise<ApiResponse<Patient>> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<ApiResponse<Patient>> {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Medical Records
  async getAllMedicalRecords(): Promise<ApiResponse<MedicalRecord[]>> {
    const res = await fetch(`${API_BASE}/medical-records`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getPatientMedicalRecords(patientId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const res = await fetch(`${API_BASE}/medical-records/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getDoctorMedicalRecords(doctorId: string): Promise<ApiResponse<MedicalRecord[]>> {
    const res = await fetch(`${API_BASE}/medical-records/doctor/${doctorId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createMedicalRecord(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    diagnosis: string;
    symptoms?: string;
    treatment?: string;
    doctorNotes?: string;
    followUpDate?: string;
    prescriptions?: any[];
  }): Promise<ApiResponse<MedicalRecord>> {
    const res = await fetch(`${API_BASE}/medical-records`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updateMedicalRecord(id: string, updates: Partial<MedicalRecord>): Promise<ApiResponse<MedicalRecord>> {
    const res = await fetch(`${API_BASE}/medical-records/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  // Prescriptions
  async getDoctorPrescriptions(doctorId: string): Promise<ApiResponse<Prescription[]>> {
    const res = await fetch(`${API_BASE}/prescriptions/doctor/${doctorId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getPatientPrescriptions(patientId: string): Promise<ApiResponse<Prescription[]>> {
    const res = await fetch(`${API_BASE}/prescriptions/patient/${patientId}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createPrescription(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    medications: any[];
    instructions?: string;
  }): Promise<ApiResponse<Prescription>> {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Reviews
  async getAllReviews(): Promise<ApiResponse<Review[]>> {
    const res = await fetch(`${API_BASE}/reviews`);
    return res.json();
  },

  async getDoctorReviews(doctorId: string): Promise<ApiResponse<Review[]>> {
    const res = await fetch(`${API_BASE}/reviews/${doctorId}`);
    return res.json();
  },

  async submitReview(data: {
    doctorId: string;
    patientId: string;
    appointmentId?: string;
    rating: number;
    comment: string;
  }): Promise<ApiResponse<Review>> {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteReview(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Admin
  async getAdminUsers(): Promise<ApiResponse<User[]>> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async createAdminUser(userData: any): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return res.json();
  },

  async updateAdminUser(id: string, updates: any): Promise<ApiResponse<User>> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  async deleteAdminUser(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async getAdminStats(): Promise<ApiResponse<SystemStats>> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Notifications
  async getNotifications(): Promise<ApiResponse<SystemNotification[]>> {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async markNotificationAsRead(id: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Password update
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/users/${userId}/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return res.json();
  },
};
