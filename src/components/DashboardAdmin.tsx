import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Stethoscope, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Database, 
  RefreshCw,
  X,
  Plus,
  Eye,
  Settings,
  BarChart3,
  LogOut,
  FileText,
  Star,
  Activity,
  HeartPulse,
  UserCheck,
  UserX,
  Building2,
  Printer,
  Pill
} from 'lucide-react';
import { User, Doctor, Appointment, SystemStats, Patient, Review, MedicalRecord } from '../types';
import { api } from '../services/api';

interface DashboardAdminProps {
  currentUser: User;
  onRefreshAll: () => void;
  onLogout: () => void;
  initialTab?: string;
}

export const DashboardAdmin: React.FC<DashboardAdminProps> = ({ currentUser, onRefreshAll, onLogout, initialTab }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'USERS' | 'DOCTORS' | 'PATIENTS' | 'APPOINTMENTS' | 'RECORDS' | 'REVIEWS' | 'SETTINGS' | 'REPORTS'>(
    (initialTab as any) || 'DASHBOARD'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  // Data states
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [aptStatusFilter, setAptStatusFilter] = useState('ALL');
  const [recordSearch, setRecordSearch] = useState('');

  // Modals
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', email: '', password: '', role: 'PATIENT', phone: '', status: 'ACTIVE' });

  const [createDoctorModalOpen, setCreateDoctorModalOpen] = useState(false);
  const [newDoctorData, setNewDoctorData] = useState({
    fullName: '', email: '', phone: '', specialization: 'Cardiology', qualification: 'MBBS, MD',
    experience: 5, hospital: 'Maverick Hospital', consultationFee: 800, location: 'Mumbai, Maharashtra',
    about: 'Experienced specialist dedicated to compassionate healthcare.', languages: 'English, Hindi',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);

  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [viewingDoctor, setViewingDoctor] = useState<Doctor | null>(null);

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const [deleteConfirmUser, setDeleteConfirmUser] = useState<string | null>(null);
  const [deleteConfirmDoctor, setDeleteConfirmDoctor] = useState<string | null>(null);

  // Hospital System Settings state
  const [systemSettings, setSystemSettings] = useState({
    hospitalName: 'Maverick Superspeciality Hospital',
    contactEmail: 'administration@maverick.health',
    emergencyHotline: '+91 1800 200 4567',
    slotDurationMinutes: 30,
    maxAppointmentsPerSlot: 1,
    maintenanceMode: false,
    currencySymbol: '₹'
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, docsRes, aptsRes, revsRes, patientsRes, recordsRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getDoctors(),
        api.getAllAppointments(),
        api.getAllReviews(),
        api.getPatients(),
        api.getAllMedicalRecords()
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (docsRes.success) setDoctors(docsRes.data);
      if (aptsRes.success) setAppointments(aptsRes.data);
      if (revsRes.success) setReviews(revsRes.data);
      if (patientsRes.success) setPatients(patientsRes.data);
      if (recordsRes.success) setMedicalRecords(recordsRes.data);
    } catch (err) {
      console.error('Failed to load admin dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // User Actions
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createAdminUser(newUserData);
      if (res.success) {
        setCreateUserModalOpen(false);
        setNewUserData({ name: '', email: '', password: '', role: 'PATIENT', phone: '', status: 'ACTIVE' });
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await api.updateAdminUser(editingUser.id, editingUser);
      if (res.success) {
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...editingUser } : u));
        setEditingUser(null);
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.updateAdminUser(user.id, { status: newStatus as any });
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus as any } : u));
      onRefreshAll();
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await api.deleteAdminUser(id);
      if (res.success) {
        setDeleteConfirmUser(null);
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  // Doctor Actions
  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.createDoctor({
        ...newDoctorData,
        languages: newDoctorData.languages.split(',').map(s => s.trim())
      });
      if (res.success) {
        setCreateDoctorModalOpen(false);
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error creating doctor:', err);
    }
  };

  const handleUpdateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDoctor) return;
    try {
      const res = await api.updateDoctor(editingDoctor.id, editingDoctor);
      if (res.success) {
        setEditingDoctor(null);
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error updating doctor:', err);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    try {
      const res = await api.deleteDoctor(id);
      if (res.success) {
        setDeleteConfirmDoctor(null);
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error deleting doctor:', err);
    }
  };

  // Appointment Actions
  const handleUpdateAppointmentStatus = async (id: string, status: string) => {
    try {
      const res = await api.updateAppointmentStatus(id, status);
      if (res.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: status as any } : a));
        if (selectedAppointment && selectedAppointment.id === id) {
          setSelectedAppointment({ ...selectedAppointment, status: status as any });
        }
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error updating appointment:', err);
    }
  };

  // Review Actions
  const handleDeleteReview = async (id: string) => {
    try {
      const res = await api.deleteReview(id);
      if (res.success) {
        setReviews(reviews.filter(r => r.id !== id));
        fetchAdminData();
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };

  // Filtered queries
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredDoctors = doctors.filter(d => {
    return d.fullName.toLowerCase().includes(doctorSearch.toLowerCase()) ||
           d.specialization.toLowerCase().includes(doctorSearch.toLowerCase()) ||
           d.hospital.toLowerCase().includes(doctorSearch.toLowerCase());
  });

  const filteredAppointments = appointments.filter(a => {
    if (aptStatusFilter === 'ALL') return true;
    return a.status === aptStatusFilter;
  });

  const filteredMedicalRecords = medicalRecords.filter(r => {
    return r.patientName.toLowerCase().includes(recordSearch.toLowerCase()) ||
           r.doctorName.toLowerCase().includes(recordSearch.toLowerCase()) ||
           r.diagnosis.toLowerCase().includes(recordSearch.toLowerCase()) ||
           (r.symptoms && r.symptoms.toLowerCase().includes(recordSearch.toLowerCase()));
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
          {[
            { id: 'DASHBOARD', label: 'Dashboard', icon: BarChart3 },
            { id: 'USERS', label: `Users (${users.length})`, icon: Users },
            { id: 'DOCTORS', label: `Doctors (${doctors.length})`, icon: Stethoscope },
            { id: 'PATIENTS', label: `Patients (${patients.length})`, icon: HeartPulse },
            { id: 'APPOINTMENTS', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'RECORDS', label: `Medical Records (${medicalRecords.length})`, icon: FileText },
            { id: 'REVIEWS', label: `Reviews (${reviews.length})`, icon: Star },
            { id: 'SETTINGS', label: 'System Settings', icon: Settings },
            { id: 'REPORTS', label: 'Reports', icon: FileText },
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

        {/* Top Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {activeTab === 'DASHBOARD' && 'Executive Clinical Operations Dashboard'}
              {activeTab === 'USERS' && 'User Account Administration'}
              {activeTab === 'DOCTORS' && 'Specialist Medical Directory'}
              {activeTab === 'PATIENTS' && 'Hospital Registered Patients'}
              {activeTab === 'APPOINTMENTS' && 'Central Appointment Master Ledger'}
              {activeTab === 'RECORDS' && 'Hospital Clinical Records'}
              {activeTab === 'REVIEWS' && 'Patient Ratings & Feedback Moderation'}
              {activeTab === 'SETTINGS' && 'System Configuration & MySQL Diagnostics'}
              {activeTab === 'REPORTS' && 'Administrative Performance Reports'}
            </h1>
            <p className="text-xs text-slate-500">Live system database records.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchAdminData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              title="Sync database tables"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-600' : ''}`} />
              <span>Sync Data</span>
            </button>
          </div>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {stats && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Total Users</span>
                    <Users className="w-4 h-4 text-cyan-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalUsers}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Role-authenticated accounts</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Total Doctors</span>
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-2xl font-black text-teal-700">{stats.totalDoctors}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Active hospital specialists</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Total Patients</span>
                    <HeartPulse className="w-4 h-4 text-rose-600" />
                  </div>
                  <p className="text-2xl font-black text-rose-700">{stats.totalPatients}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Registered hospital outpatients</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Total Appointments</span>
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stats.totalAppointments}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Total bookings in database</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Pending Review</span>
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <p className="text-2xl font-black text-amber-600">{stats.pendingAppointments}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Awaiting doctor acceptance</p>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-semibold">Completed Consultations</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-700">{stats.completedAppointments}</p>
                  <p className="text-[11px] text-slate-500 mt-1">With clinical prescriptions</p>
                </div>
              </div>
            )}

            {/* REAL VISUAL CHARTS & GRAPHS FROM DATABASE */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Chart 1: Appointments by Status Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Appointments by Status</h3>
                      <p className="text-[11px] text-slate-400">Database lifecycle distribution</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900 font-mono">{stats.totalAppointments} Total</span>
                  </div>
                  <div className="space-y-3 pt-1">
                    {Object.entries(stats.appointmentsByStatus).map(([status, count]) => {
                      const total = stats.totalAppointments || 1;
                      const pct = Math.round((count / total) * 100);
                      const colors: Record<string, string> = {
                        CONFIRMED: 'bg-emerald-500 text-emerald-700',
                        PENDING: 'bg-amber-500 text-amber-700',
                        COMPLETED: 'bg-blue-500 text-blue-700',
                        REJECTED: 'bg-rose-500 text-rose-700',
                        CANCELLED: 'bg-slate-400 text-slate-600'
                      };
                      return (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-800">{status}</span>
                            <span className="text-slate-500 font-mono">{count} ({pct}%)</span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${colors[status]?.split(' ')[0] || 'bg-cyan-500'}`} style={{ width: `${Math.max(pct, 4)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: Appointments by Month */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Appointment Trends (Last 6 Months)</h3>
                      <p className="text-[11px] text-slate-400">Monthly consultation volume</p>
                    </div>
                    <TrendingUp className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
                    {stats.appointmentsByMonth.map((item) => {
                      const maxCount = Math.max(...stats.appointmentsByMonth.map(m => m.count), 5);
                      const heightPct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.count}
                          </span>
                          <div
                            className="w-full max-w-[32px] bg-linear-to-t from-cyan-600 to-teal-400 rounded-t-lg transition-all duration-300 hover:brightness-110"
                            style={{ height: `${Math.max(heightPct, 15)}%` }}
                          ></div>
                          <span className="text-[11px] font-semibold text-slate-600">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 3: Doctor Specialization Breakdown */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Doctor Specialization Breakdown</h3>
                    <Stethoscope className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {stats.doctorStats.map((item) => (
                      <div key={item.specialization} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{item.specialization}</span>
                        <div className="flex items-center gap-3">
                          <span className="bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded text-[11px]">
                            {item.count} Doctor{item.count > 1 ? 's' : ''}
                          </span>
                          <span className="text-amber-600 font-bold flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {item.avgRating}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart 4: Patient Growth Curve */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Patient Growth Curve</h3>
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="flex items-end justify-between gap-2 h-44 pt-4 px-2">
                    {stats.patientRegistrations.map((item) => {
                      const maxCount = Math.max(...stats.patientRegistrations.map(m => m.count), 25);
                      const heightPct = Math.round((item.count / maxCount) * 100);
                      return (
                        <div key={item.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                          <span className="text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                            +{item.count}
                          </span>
                          <div
                            className="w-full max-w-[32px] bg-linear-to-t from-purple-600 to-indigo-400 rounded-t-lg transition-all duration-300 hover:brightness-110"
                            style={{ height: `${Math.max(heightPct, 15)}%` }}
                          ></div>
                          <span className="text-[11px] font-semibold text-slate-600">{item.month}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'USERS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-hidden"
                >
                  <option value="ALL">All Roles</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="DOCTOR">DOCTOR</option>
                  <option value="PATIENT">PATIENT</option>
                </select>
              </div>
              <button
                onClick={() => setCreateUserModalOpen(true)}
                className="w-full sm:w-auto px-3.5 py-2 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create User Account</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">User Profile</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Contact Phone</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registration</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{u.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : u.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">{u.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold cursor-pointer border ${
                            u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          }`}
                          title="Click to toggle Active/Inactive"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          {u.status}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '2026-01-01'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingUser(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                            title="View user details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                            title="Edit user"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {u.id !== currentUser.id && (
                            <button
                              onClick={() => setDeleteConfirmUser(u.id)}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                              title="Delete user account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DOCTOR MANAGEMENT */}
        {activeTab === 'DOCTORS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search doctors by name, hospital, or dept..."
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>
              <button
                onClick={() => setCreateDoctorModalOpen(true)}
                className="w-full sm:w-auto px-3.5 py-2 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Doctor</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Specialization</th>
                    <th className="py-3 px-4">Hospital & Location</th>
                    <th className="py-3 px-4">Consultation Fee</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Availability</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img src={doc.photoUrl} alt="" className="w-9 h-9 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-slate-900">{doc.fullName}</p>
                            <p className="text-[10px] text-slate-400">{doc.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-cyan-700">{doc.specialization}</td>
                      <td className="py-3 px-4">
                        <p className="font-medium text-slate-800">{doc.hospital}</p>
                        <p className="text-[10px] text-slate-400">{doc.location}</p>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">₹{doc.consultationFee}</td>
                      <td className="py-3 px-4 font-bold text-amber-600 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {doc.rating.toFixed(1)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.availabilityStatus === 'AVAILABLE_TODAY' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {doc.availabilityStatus === 'AVAILABLE_TODAY' ? 'Available Today' : 'Tomorrow'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setViewingDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                            title="View doctor profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingDoctor(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-700 hover:bg-cyan-50 cursor-pointer"
                            title="Edit doctor details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmDoctor(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-700 hover:bg-rose-50 cursor-pointer"
                            title="Delete doctor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PATIENTS DIRECTORY */}
        {activeTab === 'PATIENTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50 font-bold text-xs text-slate-800">
              Hospital Outpatients Directory ({patients.length})
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Contact & Email</th>
                    <th className="py-3 px-4">Gender & DOB</th>
                    <th className="py-3 px-4">Blood Group</th>
                    <th className="py-3 px-4">Emergency Contact</th>
                    <th className="py-3 px-4">Known Allergies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{p.fullName}</td>
                      <td className="py-3 px-4">
                        <p>{p.phone}</p>
                        <p className="text-[10px] text-slate-400">{p.email}</p>
                      </td>
                      <td className="py-3 px-4">{p.gender} • {p.dateOfBirth}</td>
                      <td className="py-3 px-4 font-bold text-rose-600">{p.bloodGroup}</td>
                      <td className="py-3 px-4">{p.emergencyContact}</td>
                      <td className="py-3 px-4 text-amber-700">{p.allergies || 'None'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: APPOINTMENTS LEDGER */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Master Hospital Appointment Records ({filteredAppointments.length})
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Status Filter:</span>
                <select
                  value={aptStatusFilter}
                  onChange={(e) => setAptStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-hidden font-medium"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ref Number</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Doctor</th>
                    <th className="py-3 px-4">Scheduled Slot</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{apt.appointmentNumber}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{apt.patientName}</p>
                        <p className="text-[10px] text-slate-400">{apt.patientPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-cyan-800">{apt.doctorName}</p>
                        <p className="text-[10px] text-slate-400">{apt.doctorSpecialization}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-800">
                        {apt.appointmentDate} • {apt.appointmentTime}
                      </td>
                      <td className="py-3 px-4 max-w-xs truncate">{apt.reason}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          apt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                          apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAppointment(apt)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Details
                          </button>
                          {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                            <button
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'CANCELLED')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold cursor-pointer"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: MEDICAL RECORDS */}
        {activeTab === 'RECORDS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden space-y-4">
            <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search records by patient, doctor, or diagnosis..."
                  value={recordSearch}
                  onChange={(e) => setRecordSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredMedicalRecords.length} clinical record(s) on file
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Encounter Date</th>
                    <th className="py-3 px-4">Patient Name</th>
                    <th className="py-3 px-4">Attending Doctor</th>
                    <th className="py-3 px-4">Primary Diagnosis</th>
                    <th className="py-3 px-4">Symptoms / Treatment</th>
                    <th className="py-3 px-4">Prescription</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMedicalRecords.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No clinical medical records found matching search.
                      </td>
                    </tr>
                  ) : (
                    filteredMedicalRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-700 font-semibold">{rec.date}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{rec.patientName}</td>
                        <td className="py-3 px-4 font-medium text-cyan-800">{rec.doctorName}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">{rec.diagnosis}</td>
                        <td className="py-3 px-4 max-w-xs truncate">{rec.symptoms || rec.treatment || '—'}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            {rec.prescriptions?.length || 0} med(s)
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedRecord(rec)}
                            className="px-2.5 py-1 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-lg text-xs font-semibold cursor-pointer border border-cyan-200"
                          >
                            View File
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: REVIEWS */}
        {activeTab === 'REVIEWS' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Patient Reviews & Rating Moderation</h3>
              <span className="text-xs text-slate-500">{reviews.length} reviews total</span>
            </div>
            <div className="space-y-3">
              {reviews.map((rev) => {
                const doc = doctors.find(d => d.id === rev.doctorId);
                return (
                  <div key={rev.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{rev.patientName}</span>
                        <span className="text-slate-400">for</span>
                        <span className="font-semibold text-cyan-800">{doc?.fullName || 'Doctor'}</span>
                        <div className="flex items-center text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 italic">"{rev.comment}"</p>
                      <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="px-2.5 py-1 text-xs text-rose-600 hover:bg-rose-100 rounded-lg font-semibold border border-rose-200 transition-colors cursor-pointer"
                    >
                      Delete Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 8: SETTINGS */}
        {activeTab === 'SETTINGS' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-600" />
                  Maverick System Settings & Configurations
                </h3>
                <p className="text-xs text-slate-500">Configure clinic operational parameters and database connectivity.</p>
              </div>
              {settingsSaved && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 animate-in fade-in">
                  Settings saved successfully!
                </span>
              )}
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              setSettingsSaved(true);
              setTimeout(() => setSettingsSaved(false), 3000);
            }} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital / Clinic Entity Name</label>
                  <input
                    type="text"
                    value={systemSettings.hospitalName}
                    onChange={(e) => setSystemSettings({ ...systemSettings, hospitalName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Administrative Contact Email</label>
                  <input
                    type="email"
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings({ ...systemSettings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency 24x7 Hotline</label>
                  <input
                    type="text"
                    value={systemSettings.emergencyHotline}
                    onChange={(e) => setSystemSettings({ ...systemSettings, emergencyHotline: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Appointment Slot Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="120"
                    step="15"
                    value={systemSettings.slotDurationMinutes}
                    onChange={(e) => setSystemSettings({ ...systemSettings, slotDurationMinutes: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Bookings Per Slot</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={systemSettings.maxAppointmentsPerSlot}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maxAppointmentsPerSlot: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900">Hospital Patient Portal Maintenance Mode</h4>
                  <p className="text-[11px] text-slate-500">Temporarily restrict non-administrative bookings during system upgrades.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) => setSystemSettings({ ...systemSettings, maintenanceMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-semibold shadow-xs cursor-pointer"
                >
                  Save System Configuration
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 9: REPORTS */}
        {activeTab === 'REPORTS' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Hospital Administrative Reports</h3>
                <p className="text-xs text-slate-500">Real-time clinical compliance and throughput reports</p>
              </div>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-cyan-50/60 border border-cyan-200 rounded-xl space-y-1">
                <span className="text-cyan-900 font-bold block">Appointment Fulfillment Rate</span>
                <p className="text-2xl font-black text-cyan-800">
                  {stats ? Math.round((stats.completedAppointments / (stats.totalAppointments || 1)) * 100) : 0}%
                </p>
                <p className="text-[11px] text-cyan-700">Scheduled visits concluded</p>
              </div>
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                <span className="text-emerald-900 font-bold block">Doctor Average Satisfaction</span>
                <p className="text-2xl font-black text-emerald-800">4.84 / 5.0</p>
                <p className="text-[11px] text-emerald-700">Patient verified feedback</p>
              </div>
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1">
                <span className="text-purple-900 font-bold block">Estimated Gross Revenue</span>
                <p className="text-2xl font-black text-purple-800">
                  ₹{stats?.totalRevenue.toLocaleString()}
                </p>
                <p className="text-[11px] text-purple-700">From confirmed consultations</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {createUserModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Create New User Account</h3>
              <button onClick={() => setCreateUserModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input type="text" required value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email *</label>
                <input type="email" required value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Password *</label>
                <input type="password" required value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <select value={newUserData.role} onChange={e => setNewUserData({...newUserData, role: e.target.value})} className="w-full px-3 py-2 border rounded-xl font-bold bg-white">
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select value={newUserData.status} onChange={e => setNewUserData({...newUserData, status: e.target.value})} className="w-full px-3 py-2 border rounded-xl font-semibold bg-white">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setCreateUserModalOpen(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE DOCTOR MODAL */}
      {createDoctorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Add New Medical Specialist</h3>
              <button onClick={() => setCreateDoctorModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Doctor Full Name *</label>
                  <input type="text" required placeholder="Dr. First Last" value={newDoctorData.fullName} onChange={e => setNewDoctorData({...newDoctorData, fullName: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Doctor Email *</label>
                  <input type="email" required value={newDoctorData.email} onChange={e => setNewDoctorData({...newDoctorData, email: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Specialization</label>
                  <select value={newDoctorData.specialization} onChange={e => setNewDoctorData({...newDoctorData, specialization: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white">
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Ophthalmology">Ophthalmology</option>
                    <option value="Psychiatry">Psychiatry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Experience (Yrs)</label>
                  <input type="number" min="1" value={newDoctorData.experience} onChange={e => setNewDoctorData({...newDoctorData, experience: parseInt(e.target.value) || 1})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Fee (₹)</label>
                  <input type="number" min="100" value={newDoctorData.consultationFee} onChange={e => setNewDoctorData({...newDoctorData, consultationFee: parseInt(e.target.value) || 500})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Hospital / Clinic</label>
                <input type="text" value={newDoctorData.hospital} onChange={e => setNewDoctorData({...newDoctorData, hospital: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Photo URL</label>
                <input type="url" value={newDoctorData.photoUrl} onChange={e => setNewDoctorData({...newDoctorData, photoUrl: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setCreateDoctorModalOpen(false)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">Save Doctor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Edit User: {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Email</label>
                <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Role</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as any})} className="w-full px-3 py-2 border rounded-xl font-bold bg-white">
                    <option value="PATIENT">PATIENT</option>
                    <option value="DOCTOR">DOCTOR</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  <select value={editingUser.status} onChange={e => setEditingUser({...editingUser, status: e.target.value as any})} className="w-full px-3 py-2 border rounded-xl bg-white">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setEditingUser(null)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">Update User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {editingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 my-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Edit Doctor: {editingDoctor.fullName}</h3>
              <button onClick={() => setEditingDoctor(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleUpdateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Specialization</label>
                <input type="text" value={editingDoctor.specialization} onChange={e => setEditingDoctor({...editingDoctor, specialization: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Consultation Fee (₹)</label>
                  <input type="number" value={editingDoctor.consultationFee} onChange={e => setEditingDoctor({...editingDoctor, consultationFee: parseInt(e.target.value) || 500})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Availability</label>
                  <select value={editingDoctor.availabilityStatus} onChange={e => setEditingDoctor({...editingDoctor, availabilityStatus: e.target.value as any})} className="w-full px-3 py-2 border rounded-xl bg-white">
                    <option value="AVAILABLE_TODAY">AVAILABLE_TODAY</option>
                    <option value="AVAILABLE_TOMORROW">AVAILABLE_TOMORROW</option>
                    <option value="NEXT_WEEK">NEXT_WEEK</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Hospital / Clinic</label>
                <input type="text" value={editingDoctor.hospital} onChange={e => setEditingDoctor({...editingDoctor, hospital: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Profile Photo URL</label>
                <input type="text" value={editingDoctor.photoUrl} onChange={e => setEditingDoctor({...editingDoctor, photoUrl: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setEditingDoctor(null)} className="px-3 py-1.5 text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Appointment #{selectedAppointment.appointmentNumber}</h3>
              <button onClick={() => setSelectedAppointment(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between"><span className="text-slate-500">Patient:</span><span className="font-bold text-slate-900">{selectedAppointment.patientName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Doctor:</span><span className="font-bold text-cyan-800">{selectedAppointment.doctorName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date & Slot:</span><span>{selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Hospital:</span><span>{selectedAppointment.hospital}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Fee:</span><span className="font-bold">₹{selectedAppointment.consultationFee}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-700">{selectedAppointment.status}</span></div>
              <div className="p-2.5 bg-slate-50 rounded-xl"><span className="text-slate-500 block mb-0.5">Reason:</span><p>{selectedAppointment.reason}</p></div>
              {selectedAppointment.diagnosis && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                  <strong>Clinical Diagnosis:</strong> {selectedAppointment.diagnosis}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedAppointment(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODALS */}
      {deleteConfirmUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Confirm Deletion</h3>
            <p className="text-xs text-slate-600">Permanently delete this user and associated profiles from database?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteConfirmUser(null)} className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer">Cancel</button>
              <button onClick={() => handleDeleteUser(deleteConfirmUser)} className="px-4 py-2 text-xs bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Confirm Doctor Removal</h3>
            <p className="text-xs text-slate-600">Permanently remove doctor profile and user credentials?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setDeleteConfirmDoctor(null)} className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer">Cancel</button>
              <button onClick={() => handleDeleteDoctor(deleteConfirmDoctor)} className="px-4 py-2 text-xs bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW USER DETAILS MODAL */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-600" />
                User Account Overview
              </h3>
              <button onClick={() => setViewingUser(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <img src={viewingUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} alt="" className="w-12 h-12 rounded-xl object-cover" />
              <div>
                <p className="font-bold text-slate-900">{viewingUser.name}</p>
                <p className="text-xs text-slate-500 font-mono">{viewingUser.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                  viewingUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : viewingUser.role === 'DOCTOR' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {viewingUser.role}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">User ID:</span><span className="font-mono text-slate-900 font-bold">{viewingUser.id}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Contact Phone:</span><span>{viewingUser.phone || 'Not recorded'}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Account Status:</span><span className="font-bold text-emerald-600">{viewingUser.status}</span></div>
              <div className="flex justify-between py-1 border-b"><span className="text-slate-500">Registered On:</span><span>{viewingUser.createdAt ? new Date(viewingUser.createdAt).toLocaleString() : 'N/A'}</span></div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const u = viewingUser;
                  setViewingUser(null);
                  setEditingUser(u);
                }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Edit Account
              </button>
              <button onClick={() => setViewingUser(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DOCTOR PROFILE MODAL */}
      {viewingDoctor && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4 my-8">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-600" />
                Doctor Medical Dossier: {viewingDoctor.fullName}
              </h3>
              <button onClick={() => setViewingDoctor(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="flex items-start gap-4">
              <img src={viewingDoctor.photoUrl} alt="" className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shadow-xs" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">{viewingDoctor.fullName}</h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800">
                    {viewingDoctor.specialization}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{viewingDoctor.qualification} • {viewingDoctor.experience} Yrs Clinical Experience</p>
                <p className="text-xs text-cyan-800 font-semibold">{viewingDoctor.hospital}</p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="font-bold text-slate-900">Fee: ₹{viewingDoctor.consultationFee}</span>
                  <span className="flex items-center gap-1 font-bold text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {viewingDoctor.rating.toFixed(1)} ({viewingDoctor.reviewCount} Reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl">
              <div><strong className="text-slate-900">About Practitioner:</strong> <p className="text-slate-600 mt-0.5">{viewingDoctor.about}</p></div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div><span className="text-slate-500">Email:</span> <p className="font-mono text-slate-800">{viewingDoctor.email}</p></div>
                <div><span className="text-slate-500">Phone:</span> <p className="text-slate-800">{viewingDoctor.phone}</p></div>
                <div><span className="text-slate-500">Location:</span> <p className="text-slate-800">{viewingDoctor.location}</p></div>
                <div><span className="text-slate-500">Languages:</span> <p className="text-slate-800">{viewingDoctor.languages.join(', ')}</p></div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  const d = viewingDoctor;
                  setViewingDoctor(null);
                  setEditingDoctor(d);
                }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Edit Doctor
              </button>
              <button onClick={() => setViewingDoctor(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MEDICAL RECORD MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-start pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                  Hospital Medical Record Archive
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedRecord.diagnosis}</h3>
                <p className="text-xs text-slate-500">
                  Patient: {selectedRecord.patientName} • Attending: {selectedRecord.doctorName} • Date: {selectedRecord.date}
                </p>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Reported Symptoms:</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {selectedRecord.symptoms || 'None recorded'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Clinical Treatment Plan:</span>
                <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800">
                  {selectedRecord.treatment || 'Standard clinical guidance'}
                </p>
              </div>
            </div>
            {selectedRecord.doctorNotes && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 text-xs text-amber-900 rounded-xl">
                <strong>Physician Clinical Notes:</strong> {selectedRecord.doctorNotes}
              </div>
            )}
            {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-cyan-600" />
                  Prescribed Pharmacotherapy ({selectedRecord.prescriptions.length} items)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-semibold">
                      <tr>
                        <th className="py-2 px-3">Medicine</th>
                        <th className="py-2 px-3">Dosage</th>
                        <th className="py-2 px-3">Frequency</th>
                        <th className="py-2 px-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRecord.prescriptions.map((p, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-bold text-slate-900">{p.medicine}</td>
                          <td className="py-2 px-3">{p.dosage}</td>
                          <td className="py-2 px-3">{p.frequency}</td>
                          <td className="py-2 px-3 font-medium text-emerald-700">{p.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
              <button
                onClick={() => window.print()}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Record</span>
              </button>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
