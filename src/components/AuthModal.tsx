import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Stethoscope, 
  AlertCircle, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Phone, 
  CheckCircle2,
  Calendar,
  Building2
} from 'lucide-react';
import { UserRole, User, Doctor, Patient } from '../types';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, doctor: Doctor | null, patient: Patient | null) => void;
  bookingContextDoctorName?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  bookingContextDoctorName 
}) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PATIENT');

  // Form states
  const [email, setEmail] = useState('patient@careconnect.com');
  const [password, setPassword] = useState('patient123');
  const [showPassword, setShowPassword] = useState(false);

  // Registration states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('1995-05-15');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick Demo Accounts
  const quickLogins = [
    {
      role: 'ADMIN' as UserRole,
      title: 'ADMIN',
      subtitle: 'Full Oversight',
      email: 'admin@careconnect.com',
      password: 'admin123',
    },
    {
      role: 'DOCTOR' as UserRole,
      title: 'DOCTOR',
      subtitle: 'Dr. Rajesh Patel',
      email: 'dr.rajesh@careconnect.com',
      password: 'doctor123',
    },
    {
      role: 'PATIENT' as UserRole,
      title: 'PATIENT',
      subtitle: 'Rahul Verma',
      email: 'patient@careconnect.com',
      password: 'patient123',
    },
  ];

  const handleQuickLoginClick = (item: typeof quickLogins[0]) => {
    setSelectedRole(item.role);
    setEmail(item.email);
    setPassword(item.password);
    setMode('LOGIN');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      if (mode === 'LOGIN') {
        const res = await api.login(email, password, selectedRole);
        if (res.success && res.user) {
          onLoginSuccess(res.user, res.doctor || null, res.patient || null);
          onClose();
        } else {
          setErrorMessage(res.message || 'Invalid email or password for selected role.');
        }
      } else {
        const res = await api.register({
          name,
          email,
          password,
          phone,
          role: selectedRole,
          gender,
          dateOfBirth,
          bloodGroup,
          address,
        });
        if (res.success && res.user) {
          onLoginSuccess(res.user, null, res.patient || null);
          onClose();
        } else {
          setErrorMessage(res.message || 'Registration failed. Please try again.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error connecting to backend API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* ===================== HEADER ===================== */}
        <div className="bg-linear-to-r from-teal-600 via-cyan-600 to-teal-700 px-7 py-5 text-white flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight">
              {mode === 'LOGIN' ? 'Sign In to Maverick' : 'Create Patient Account'}
            </h3>
            <p className="text-xs text-teal-100 mt-0.5 font-medium">
              {mode === 'LOGIN' ? 'Role-authenticated hospital portal' : 'Access instant appointments & medical records'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Booking Requirement Notice Banner if triggered from Book Slot */}
        {bookingContextDoctorName && (
          <div className="px-7 py-3 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-semibold">
              <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Please login to book an appointment with <strong>{bookingContextDoctorName}</strong>.</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => { setMode('LOGIN'); setSelectedRole('PATIENT'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                  mode === 'LOGIN' ? 'bg-amber-700 text-white' : 'bg-white text-amber-900 border border-amber-300'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setMode('REGISTER'); setSelectedRole('PATIENT'); }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer transition-colors ${
                  mode === 'REGISTER' ? 'bg-amber-700 text-white' : 'bg-white text-amber-900 border border-amber-300'
                }`}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* ===================== QUICK DEMO LOGINS ===================== */}
        {mode === 'LOGIN' && (
          <div className="px-7 pt-5 pb-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                QUICK DEMO ACCOUNTS
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {quickLogins.map((item) => {
                const isSelected = selectedRole === item.role && email === item.email;
                return (
                  <button
                    key={item.role}
                    type="button"
                    onClick={() => handleQuickLoginClick(item)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className={`text-xs font-bold tracking-wide ${
                        isSelected ? 'text-teal-800' : 'text-slate-800'
                      }`}>
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ===================== FORM CONTENT ===================== */}
        <div className="px-7 py-5 space-y-4">
          
          {/* ROLE SELECTOR */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              SELECT PORTAL ROLE
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
              {(['PATIENT', 'DOCTOR', 'ADMIN'] as UserRole[]).map((r) => {
                const isSelected = selectedRole === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      setErrorMessage('');
                      if (mode === 'LOGIN') {
                        if (r === 'PATIENT') {
                          setEmail('patient@careconnect.com');
                          setPassword('patient123');
                        } else if (r === 'DOCTOR') {
                          setEmail('dr.rajesh@careconnect.com');
                          setPassword('doctor123');
                        } else if (r === 'ADMIN') {
                          setEmail('admin@careconnect.com');
                          setPassword('admin123');
                        }
                      }
                    }}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200/60'
                        : 'text-slate-600 hover:text-slate-900 bg-transparent'
                    }`}
                  >
                    {r === 'PATIENT' ? 'Patient' : r === 'DOCTOR' ? 'Doctor' : 'Admin'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Notification */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Extra Fields */}
            {mode === 'REGISTER' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Verma"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Blood Group</label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 outline-hidden bg-white"
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
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 outline-hidden bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98111 22334"
                      className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 outline-hidden bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            {/* EMAIL FIELD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@careconnect.com"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all bg-white placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all bg-white placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* LOGIN / REGISTER BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-teal-600/25 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : mode === 'LOGIN' ? (
                <span>Sign In as {selectedRole}</span>
              ) : (
                <span>Create Patient Account</span>
              )}
            </button>

            {/* TOGGLE / REGISTRATION FOOTER */}
            {mode === 'LOGIN' ? (
              selectedRole === 'PATIENT' ? (
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600">
                    New patient at Maverick?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('REGISTER');
                        setSelectedRole('PATIENT');
                        setErrorMessage('');
                      }}
                      className="font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer ml-0.5"
                    >
                      Register Here
                    </button>
                  </p>
                </div>
              ) : (
                <div className="text-center pt-2">
                  <p className="text-[11px] text-slate-400">
                    Staff authentication is managed by Hospital Administration
                  </p>
                </div>
              )
            ) : (
              <div className="text-center pt-2">
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('LOGIN');
                      setErrorMessage('');
                    }}
                    className="font-bold text-teal-700 hover:text-teal-800 hover:underline cursor-pointer ml-0.5"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
