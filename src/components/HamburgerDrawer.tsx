import React, { useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Users, 
  Stethoscope, 
  UserCheck, 
  Calendar, 
  FileText, 
  Star, 
  Settings, 
  BarChart3, 
  Bell, 
  LogOut, 
  CalendarDays, 
  Pill, 
  Search, 
  Clock, 
  HeartPulse, 
  User as UserIcon,
  ShieldCheck
} from 'lucide-react';
import { User, Doctor, Patient } from '../types';

interface HamburgerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  activeView: string;
  onSelectView: (view: string, tab?: string) => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  unreadNotificationsCount: number;
}

export const HamburgerDrawer: React.FC<HamburgerDrawerProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentDoctor,
  currentPatient,
  activeView,
  onSelectView,
  onOpenNotifications,
  onLogout,
  unreadNotificationsCount,
}) => {
  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const role = currentUser?.role || 'PATIENT';
  const displayName = currentDoctor?.fullName || currentPatient?.fullName || currentUser?.name || 'User';
  const displayAvatar = currentDoctor?.photoUrl || currentPatient?.avatarUrl || currentUser?.avatarUrl;

  const handleNavClick = (view: string, tab?: string) => {
    onSelectView(view, tab);
    onClose();
  };

  const handleNotificationsClick = () => {
    onOpenNotifications();
    onClose();
  };

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-out Drawer from Left */}
      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200 border-r border-slate-200 z-10">
          
          <div>
            {/* Top Brand Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                  <HeartPulse className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <span className="font-extrabold text-slate-900 text-sm tracking-tight">Maverick</span>
                  <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded font-bold bg-cyan-100 text-cyan-800">
                    HEALTHCARE
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                title="Close Menu (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Logged In User Profile Summary */}
            {currentUser && (
              <div className="p-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  {displayAvatar ? (
                    <img 
                      src={displayAvatar} 
                      alt={displayName} 
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-xl bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-sm border border-cyan-200 shrink-0">
                      {displayName.charAt(0)}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate leading-snug">{displayName}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        role === 'DOCTOR' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {role}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate ml-1">{currentUser.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Links */}
            <div className="p-3 border-b border-slate-100">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors text-left cursor-pointer"
              >
                <HeartPulse className="w-4 h-4 text-slate-400" />
                <span>Home Page</span>
              </button>
              <button
                onClick={() => handleNavClick('doctors')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors text-left cursor-pointer"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Find Doctors & Clinics</span>
              </button>
            </div>

            {/* ROLE-SPECIFIC MENU ITEMS */}
            <div className="p-3 space-y-1">
              
              {/* ===================== ADMIN MENU ===================== */}
              {role === 'ADMIN' && (
                <>
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Admin Navigation
                  </div>
                  {[
                    { id: 'DASHBOARD', label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'USERS', label: 'Users', icon: Users },
                    { id: 'DOCTORS', label: 'Doctors', icon: Stethoscope },
                    { id: 'PATIENTS', label: 'Patients', icon: UserCheck },
                    { id: 'APPOINTMENTS', label: 'Appointments', icon: Calendar },
                    { id: 'RECORDS', label: 'Medical Records', icon: FileText },
                    { id: 'REVIEWS', label: 'Reviews', icon: Star },
                    { id: 'SETTINGS', label: 'System Settings', icon: Settings },
                    { id: 'REPORTS', label: 'Reports', icon: BarChart3 },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick('admin_dashboard', item.id)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors text-left cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="my-2 border-t border-slate-100"></div>
                  <button
                    onClick={handleNotificationsClick}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* ===================== DOCTOR MENU ===================== */}
              {role === 'DOCTOR' && (
                <>
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Doctor Navigation
                  </div>
                  {[
                    { id: 'DASHBOARD', label: 'Dashboard Overview', icon: LayoutDashboard },
                    { id: 'SCHEDULE', label: 'My Clinical Schedule', icon: CalendarDays },
                    { id: 'APPOINTMENTS', label: 'Appointments', icon: Calendar },
                    { id: 'PATIENTS', label: 'My Patients', icon: Users },
                    { id: 'RECORDS', label: 'Medical Records', icon: FileText },
                    { id: 'PRESCRIPTIONS', label: 'Prescriptions', icon: Pill },
                    { id: 'REVIEWS', label: 'Patient Reviews', icon: Star },
                    { id: 'PROFILE', label: 'My Doctor Profile', icon: Stethoscope },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick('doctor_dashboard', item.id)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors text-left cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="my-2 border-t border-slate-100"></div>
                  <button
                    onClick={handleNotificationsClick}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </>
              )}

              {/* ===================== PATIENT MENU ===================== */}
              {role === 'PATIENT' && (
                <>
                  <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Patient Navigation
                  </div>
                  {[
                    { id: 'DASHBOARD', label: 'Dashboard Overview', icon: LayoutDashboard, view: 'patient_dashboard', tab: 'DASHBOARD' },
                    { id: 'APPOINTMENTS', label: 'My Appointments', icon: Calendar, view: 'patient_dashboard', tab: 'APPOINTMENTS' },
                    { id: 'RECORDS', label: 'Medical Records', icon: FileText, view: 'patient_dashboard', tab: 'RECORDS' },
                    { id: 'PROFILE', label: 'My Profile', icon: UserIcon, view: 'patient_dashboard', tab: 'PROFILE' },
                    { id: 'FIND_DOCTORS', label: 'Find Doctors & Book', icon: Search, view: 'doctors', tab: '' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item.view, item.tab)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-cyan-50 hover:text-cyan-800 transition-colors text-left cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="my-2 border-t border-slate-100"></div>
                  <button
                    onClick={handleNotificationsClick}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <span>Notifications</span>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom Action: Logout */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors text-left cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>
                {role === 'PATIENT' ? 'Logout Patient' : role === 'DOCTOR' ? 'Logout Doctor' : 'Logout Admin'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
