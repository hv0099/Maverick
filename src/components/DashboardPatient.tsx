import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  User as UserIcon, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Pill, 
  Building2, 
  Printer, 
  Plus, 
  Search,
  Activity,
  Heart,
  ShieldAlert,
  Phone,
  Edit2,
  Star,
  LogOut,
  X,
  MessageSquarePlus,
  HelpCircle,
  Stethoscope
} from 'lucide-react';
import { Patient, Appointment, MedicalRecord, Doctor, Review } from '../types';
import { api } from '../services/api';

interface DashboardPatientProps {
  patient: Patient;
  onNavigateToFindDoctors: () => void;
  onRefreshAll: () => void;
  onLogout: () => void;
  initialTab?: string;
}

export const DashboardPatient: React.FC<DashboardPatientProps> = ({
  patient,
  onNavigateToFindDoctors,
  onRefreshAll,
  onLogout,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'APPOINTMENTS' | 'RECORDS' | 'REVIEWS' | 'PROFILE'>(
    (initialTab as any) || 'DASHBOARD'
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Cancel Appointment Confirmation
  const [cancellingAptId, setCancellingAptId] = useState<string | null>(null);

  // View Prescription Modal
  const [viewingPrescription, setViewingPrescription] = useState<MedicalRecord | null>(null);

  // Medical Records Filter & Search State
  const [recordDoctorFilter, setRecordDoctorFilter] = useState<string>('ALL');
  const [recordSearchQuery, setRecordSearchQuery] = useState<string>('');

  // Selected Appointment Details Modal
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Review Modal State
  const [reviewModalApt, setReviewModalApt] = useState<Appointment | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<string>('');

  // Profile Edit State
  const [profileData, setProfileData] = useState({
    phone: patient.phone || '',
    bloodGroup: patient.bloodGroup || 'O+',
    address: patient.address || '',
    emergencyContact: patient.emergencyContact || '',
    allergies: patient.allergies || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [aptsRes, recordsRes] = await Promise.all([
        api.getPatientAppointments(patient.id),
        api.getPatientMedicalRecords(patient.id)
      ]);
      if (aptsRes.success) setAppointments(aptsRes.data);
      if (recordsRes.success) setMedicalRecords(recordsRes.data);
    } catch (err) {
      console.error('Failed to load patient data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patient.id]);

  const handleCancelAppointment = async (id: string) => {
    try {
      const res = await api.updateAppointmentStatus(id, 'CANCELLED', 'Cancelled by patient from portal.');
      if (res.success) {
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
        setCancellingAptId(null);
        onRefreshAll();
      }
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalApt) return;
    try {
      setSubmittingReview(true);
      const res = await api.submitReview({
        doctorId: reviewModalApt.doctorId,
        patientId: patient.id,
        appointmentId: reviewModalApt.id,
        rating: reviewRating,
        comment: reviewComment
      });
      if (res.success) {
        setReviewSuccess('Review successfully recorded for this specialist!');
        setTimeout(() => {
          setReviewSuccess('');
          setReviewModalApt(null);
          setReviewComment('');
        }, 2000);
        onRefreshAll();
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await api.updatePatient(patient.id, profileData);
      if (res.success) {
        setProfileSuccessMsg('Health profile updated successfully in hospital database.');
        setTimeout(() => setProfileSuccessMsg(''), 4000);
        onRefreshAll();
      }
    } catch (err) {
      console.error('Failed to update patient profile:', err);
    } finally {
      setProfileSaving(false);
    }
  };

  const confirmedAppointments = appointments.filter(a => a.status === 'CONFIRMED');
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING');
  const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');
  const filteredAppointments = appointments.filter(a => {
    if (statusFilter === 'ALL') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* MAIN PATIENT CONTENT AREA */}
      <div className="w-full space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs">
          {[
            { id: 'DASHBOARD', label: 'Dashboard Overview', icon: Activity },
            { id: 'APPOINTMENTS', label: `My Appointments (${appointments.length})`, icon: Calendar },
            { id: 'RECORDS', label: `Medical Records (${medicalRecords.length})`, icon: FileText },
            { id: 'PROFILE', label: 'Health Profile', icon: UserIcon },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Verified Patient
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {patient.id}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {activeTab === 'DASHBOARD' && `Welcome, ${patient.fullName}`}
              {activeTab === 'APPOINTMENTS' && 'My Hospital Consultations'}
              {activeTab === 'RECORDS' && 'Clinical Diagnoses & Electronic Prescriptions'}
              {activeTab === 'PROFILE' && 'Health Profile & Personal Information'}
            </h1>
            <p className="text-xs text-slate-500">{patient.email} • {patient.phone}</p>
          </div>
          <button
            onClick={onNavigateToFindDoctors}
            className="px-4 py-2 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'DASHBOARD' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Confirmed Visits</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-2xl font-black text-emerald-700">{confirmedAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Upcoming appointments</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Pending Review</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-black text-amber-600">{pendingAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Doctor review pending</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Completed</span>
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-2xl font-black text-slate-900">{completedAppointments.length}</p>
                <p className="text-[11px] text-slate-400">Past consultations</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-xs font-semibold">Prescriptions</span>
                  <FileText className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-2xl font-black text-purple-700">{medicalRecords.length}</p>
                <p className="text-[11px] text-slate-400">Digital slips issued</p>
              </div>
            </div>

            {/* Next Scheduled Visit Banner */}
            {confirmedAppointments.length > 0 && (
              <div className="p-5 bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    Next Confirmed Appointment
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Dr. {confirmedAppointments[0].doctorName} ({confirmedAppointments[0].doctorSpecialization})
                  </h3>
                  <p className="text-xs text-slate-600">
                    {confirmedAppointments[0].appointmentDate} at {confirmedAppointments[0].appointmentTime} • {confirmedAppointments[0].hospital}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAppointment(confirmedAppointments[0])}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                >
                  View Appointment Details
                </button>
              </div>
            )}

            {/* Recent Consultations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Recent Bookings
                </h3>
                <button onClick={() => setActiveTab('APPOINTMENTS')} className="text-xs text-cyan-700 font-semibold hover:underline cursor-pointer">
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {appointments.slice(0, 3).map((apt) => (
                  <div key={apt.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{apt.doctorName}</span>
                        <span className="text-cyan-700 font-semibold text-[11px]">{apt.doctorSpecialization}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">{apt.appointmentDate} at {apt.appointmentTime} • {apt.hospital}</p>
                      <p className="text-slate-700 mt-1">Reason: {apt.reason}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        apt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                        apt.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                        apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {apt.status === 'CONFIRMED' ? 'Confirmed' : 
                         apt.status === 'PENDING' ? 'Pending Review' : 
                         apt.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                      </span>
                      <button
                        onClick={() => setSelectedAppointment(apt)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY APPOINTMENTS */}
        {activeTab === 'APPOINTMENTS' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
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
                {filteredAppointments.length} appointments listed
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
                        {apt.status === 'CONFIRMED' ? 'Confirmed' : 
                         apt.status === 'PENDING' ? 'Pending Review' : 
                         apt.status === 'COMPLETED' ? 'Completed' : 'Cancelled'}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">{apt.doctorName}</h3>
                      <p className="text-xs text-cyan-700 font-semibold">{apt.doctorSpecialization}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {apt.hospital}
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>{apt.appointmentDate}</span>
                        <span>{apt.appointmentTime}</span>
                      </div>
                      <p className="text-slate-600 pt-1"><strong>Reason:</strong> {apt.reason}</p>
                      <p className="text-slate-500 pt-0.5">Fee: ₹{apt.consultationFee}</p>
                    </div>

                    {/* Completed appointment diagnosis preview */}
                    {apt.diagnosis && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1 text-blue-900">
                        <p className="font-bold flex items-center gap-1">
                          <Pill className="w-3.5 h-3.5 text-blue-600" />
                          Diagnosis: {apt.diagnosis}
                        </p>
                      </div>
                    )}

                    {/* ACTION BUTTONS */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedAppointment(apt)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          View Details
                        </button>
                        {/* Submit review button if completed */}
                        {apt.status === 'COMPLETED' && (
                          <button
                            onClick={() => setReviewModalApt(apt)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Rate Doctor</span>
                          </button>
                        )}
                      </div>

                      {(apt.status === 'PENDING' || apt.status === 'CONFIRMED') && (
                        <button
                          onClick={() => setCancellingAptId(apt.id)}
                          className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                        >
                          Cancel Visit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MEDICAL RECORDS & COMPLETE HISTORY */}
        {activeTab === 'RECORDS' && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Patient Electronic Medical Records & History</h3>
                  <p className="text-xs text-slate-500">Official medical diagnoses, clinical treatment plans, and medication schedules issued by Maverick specialists.</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Medical History</span>
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Filter by Attending Doctor</label>
                  <select
                    value={recordDoctorFilter}
                    onChange={(e) => setRecordDoctorFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="ALL">All Attending Doctors</option>
                    {Array.from(new Set(medicalRecords.map(r => r.doctorName))).map(doc => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Search Diagnosis, Symptoms or Date</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search by diagnosis, symptoms, or YYYY-MM-DD..."
                      value={recordSearchQuery}
                      onChange={(e) => setRecordSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {medicalRecords
              .filter(r => (recordDoctorFilter === 'ALL' || r.doctorName === recordDoctorFilter))
              .filter(r => !recordSearchQuery || r.diagnosis.toLowerCase().includes(recordSearchQuery.toLowerCase()) || r.symptoms.toLowerCase().includes(recordSearchQuery.toLowerCase()) || r.date.includes(recordSearchQuery))
              .length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold">No medical records match your filter.</p>
                <p className="text-xs text-slate-400">When your attending doctor completes a consultation and prescribes medications, records appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {medicalRecords
                  .filter(r => (recordDoctorFilter === 'ALL' || r.doctorName === recordDoctorFilter))
                  .filter(r => !recordSearchQuery || r.diagnosis.toLowerCase().includes(recordSearchQuery.toLowerCase()) || r.symptoms.toLowerCase().includes(recordSearchQuery.toLowerCase()) || r.date.includes(recordSearchQuery))
                  .map((record) => (
                    <div key={record.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-xs font-mono text-slate-400">Consultation Date: {record.date}</span>
                          <h4 className="text-lg font-bold text-slate-900 mt-0.5">{record.diagnosis}</h4>
                          <p className="text-xs text-cyan-700 font-medium">Attending Physician: {record.doctorName}</p>
                        </div>
                        <button
                          onClick={() => setViewingPrescription(record)}
                          className="px-3.5 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-cyan-200 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View & Print Prescription</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-700">Reported Symptoms:</span>
                          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{record.symptoms || 'None recorded'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="font-semibold text-slate-700">Treatment Plan:</span>
                          <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">{record.treatment || 'Clinical guidance'}</p>
                        </div>
                      </div>

                      {/* Multi-medication Prescriptions list */}
                      {record.prescriptions && record.prescriptions.length > 0 && (
                        <div className="pt-2">
                          <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-cyan-600" />
                            Prescribed Medications
                          </h5>
                          <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left text-xs text-slate-600">
                              <thead className="bg-slate-50 text-slate-700 text-[10px] uppercase font-semibold">
                                <tr>
                                  <th className="py-2.5 px-3">Medicine</th>
                                  <th className="py-2.5 px-3">Dosage</th>
                                  <th className="py-2.5 px-3">Frequency</th>
                                  <th className="py-2.5 px-3">Duration</th>
                                  <th className="py-2.5 px-3">Instructions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {record.prescriptions.map((p, idx) => (
                                  <tr key={idx}>
                                    <td className="py-2 px-3 font-semibold text-slate-900">{p.medicine}</td>
                                    <td className="py-2 px-3">{p.dosage}</td>
                                    <td className="py-2 px-3">{p.frequency}</td>
                                    <td className="py-2 px-3 font-medium text-emerald-700">{p.duration}</td>
                                    <td className="py-2 px-3 text-slate-500">{p.instructions || 'As advised'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {record.doctorNotes && (
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-xs text-amber-900">
                          <strong>Doctor's Notes: </strong> {record.doctorNotes}
                        </div>
                      )}

                      {record.followUpDate && (
                        <div className="text-xs text-slate-600 flex items-center gap-1 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <Clock className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Recommended Follow-up Consultation Date: <strong>{record.followUpDate}</strong></span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'PROFILE' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs max-w-xl">
            <h3 className="text-base font-bold text-slate-900">Personal Health Record</h3>
            {profileSuccessMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}
            <form onSubmit={handleUpdateProfile} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Blood Group</label>
                  <select
                    value={profileData.bloodGroup}
                    onChange={e => setProfileData({...profileData, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 border rounded-xl font-bold bg-white"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Phone Number</label>
                  <input type="text" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Emergency Contact</label>
                <input type="text" value={profileData.emergencyContact} onChange={e => setProfileData({...profileData, emergencyContact: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Known Allergies / Medical Conditions</label>
                <textarea rows={2} value={profileData.allergies} onChange={e => setProfileData({...profileData, allergies: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <div>
                <label className="block font-semibold mb-1">Address</label>
                <input type="text" value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})} className="w-full px-3 py-2 border rounded-xl bg-white" />
              </div>
              <button type="submit" disabled={profileSaving} className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* DETAILED APPOINTMENT MODAL */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Appointment Details #{selectedAppointment.appointmentNumber}</h3>
              <button onClick={() => setSelectedAppointment(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              <div className="flex justify-between"><span className="text-slate-500">Attending Doctor:</span><span className="font-bold text-cyan-800">{selectedAppointment.doctorName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Specialization:</span><span>{selectedAppointment.doctorSpecialization}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Hospital:</span><span>{selectedAppointment.hospital}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Date & Slot:</span><span className="font-bold text-slate-900">{selectedAppointment.appointmentDate} at {selectedAppointment.appointmentTime}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-bold text-emerald-700">{selectedAppointment.status}</span></div>
              <div className="p-3 bg-slate-50 rounded-xl"><span className="text-slate-500 block mb-0.5">Reason for Visit:</span><p>{selectedAppointment.reason}</p></div>
              {selectedAppointment.diagnosis && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 space-y-1">
                  <strong>Clinical Diagnosis:</strong> {selectedAppointment.diagnosis}
                  {selectedAppointment.prescriptionNotes && <p className="text-[11px]">{selectedAppointment.prescriptionNotes}</p>}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button onClick={() => setSelectedAppointment(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL CONFIRMATION DIALOG */}
      {cancellingAptId && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Cancel Appointment?</h3>
            <p className="text-xs text-slate-600">Are you sure you want to cancel this appointment? The doctor schedule will be updated immediately.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setCancellingAptId(null)} className="px-3 py-1.5 text-xs text-slate-600 cursor-pointer">Keep Visit</button>
              <button onClick={() => handleCancelAppointment(cancellingAptId)} className="px-4 py-2 text-xs bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT REVIEW MODAL */}
      {reviewModalApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Rate Consultation with {reviewModalApt.doctorName}</h3>
              <button onClick={() => setReviewModalApt(null)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs text-center font-bold">
                {reviewSuccess}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1.5">Rating (1 to 5 Stars)</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        className={`p-2 rounded-xl border flex items-center gap-1 cursor-pointer ${
                          reviewRating >= num ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${reviewRating >= num ? 'fill-amber-400 text-amber-400' : ''}`} />
                        <span className="font-bold">{num}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Your Feedback & Comment</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="Share your experience regarding diagnosis, doctor communication, and clinic environment..."
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  ></textarea>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setReviewModalApt(null)} className="px-3 py-1.5 text-slate-600 cursor-pointer">Cancel</button>
                  <button type="submit" disabled={submittingReview} className="px-4 py-2 bg-cyan-600 text-white rounded-xl font-semibold cursor-pointer">
                    {submittingReview ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* PRINTABLE PRESCRIPTION SLIP */}
      {viewingPrescription && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 p-8 space-y-6 animate-in fade-in zoom-in-95 my-8">
            <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">MAVERICK HEALTHCARE</h2>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">Prescription Slip</span>
                <p className="text-xs text-slate-700 font-semibold mt-2">Doctor: Dr. {viewingPrescription.doctorName}</p>
                <p className="text-xs text-slate-600">Patient: {patient.fullName}</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-mono text-slate-500 block">Prescription Ref: {viewingPrescription.id}</span>
                <span className="font-semibold text-slate-900 block mt-1">Date: {viewingPrescription.date}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-3 gap-2">
              <div><span className="text-slate-400 block">Patient Name</span><span className="font-bold text-slate-900">{patient.fullName}</span></div>
              <div><span className="text-slate-400 block">Gender / Blood Group</span><span className="font-semibold text-slate-800">{patient.gender} • {patient.bloodGroup}</span></div>
              <div><span className="text-slate-400 block">Contact Phone</span><span className="font-semibold text-slate-800">{patient.phone}</span></div>
            </div>

            <div className="text-xs space-y-1">
              <span className="font-bold uppercase tracking-wider text-slate-500">Clinical Diagnosis</span>
              <p className="text-base font-bold text-slate-900">{viewingPrescription.diagnosis}</p>
              {viewingPrescription.symptoms && <p className="text-slate-600 italic">Symptoms: {viewingPrescription.symptoms}</p>}
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
                    {viewingPrescription.prescriptions?.map((rx, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold text-slate-900">{rx.medicine}</td>
                        <td className="p-2.5">{rx.dosage}</td>
                        <td className="p-2.5">{rx.frequency}</td>
                        <td className="p-2.5 font-semibold text-emerald-700">{rx.duration}</td>
                        <td className="p-2.5 text-slate-600">{rx.instructions || 'After food'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Doctor Notes:</span>
                <p className="text-slate-600">{viewingPrescription.doctorNotes || 'Take medications on time and maintain hydration.'}</p>
              </div>
              <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200">
                <span className="font-bold text-cyan-900 block mb-1">Recommended Follow-up Date:</span>
                <p className="text-cyan-800 font-semibold">{viewingPrescription.followUpDate || 'As needed / Upon symptom persistence'}</p>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs">
              <p className="text-[10px] text-slate-400">Maverick Electronic Medical Records System • Validated digital physician authorization</p>
              <div className="text-right">
                <div className="w-36 border-b border-slate-400 mb-1"></div>
                <p className="font-bold text-slate-900">Dr. {viewingPrescription.doctorName}</p>
                <p className="text-[10px] text-slate-500">Authorized Medical Practitioner</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
              <button onClick={() => setViewingPrescription(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer">Close</button>
              <button onClick={() => window.print()} className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-sm">
                <Printer className="w-3.5 h-3.5" />
                <span>Print Prescription</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
