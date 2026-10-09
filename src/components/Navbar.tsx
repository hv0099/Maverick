import React from 'react';
import { 
  HeartPulse, 
  Calendar, 
  Users, 
  User as UserIcon, 
  LogOut, 
  LogIn, 
  Bell, 
  ShieldCheck, 
  Stethoscope, 
  ChevronDown,
  LayoutDashboard,
  Menu
} from 'lucide-react';
import { User, Doctor, Patient } from '../types';

interface NavbarProps {
  currentUser: User | null;
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenArch: () => void;
  onOpenNotifications: () => void;
  onOpenHamburger: () => void;
  onOpenProfile: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentDoctor,
  currentPatient,
  activeView,
  setActiveView,
  onOpenAuth,
  onLogout,
  onOpenArch,
  onOpenNotifications,
  onOpenHamburger,
  onOpenProfile,
  unreadCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const displayName = currentDoctor?.fullName || currentPatient?.fullName || currentUser?.name;
  const displayAvatar = currentDoctor?.photoUrl || currentPatient?.avatarUrl || currentUser?.avatarUrl;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hamburger */}
          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={onOpenHamburger}
                className="p-2 -ml-2 rounded-xl text-slate-700 hover:text-cyan-800 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                title="Open Navigation Menu"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>
            )}

            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveView('home')}
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform">
                <HeartPulse className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900">Maverick</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                    HEALTHCARE
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                  Hospital & Patient Care System
                </p>
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'home'
                  ? 'text-cyan-700 bg-cyan-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveView('doctors')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                activeView === 'doctors'
                  ? 'text-cyan-700 bg-cyan-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Find Doctors
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  if (currentUser.role === 'ADMIN') setActiveView('admin_dashboard');
                  else if (currentUser.role === 'DOCTOR') setActiveView('doctor_dashboard');
                  else setActiveView('patient_dashboard');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeView.includes('dashboard')
                    ? 'text-cyan-700 bg-cyan-50 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
            )}
            <button
              onClick={onOpenArch}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              <span>System Design</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            {currentUser && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                title="System Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>
            )}

            {/* User Login/Account */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <img
                    src={displayAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                    alt={displayName || ''}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
                    }}
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-800 leading-tight">
                      {displayName}
                    </p>
                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-sm ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700'
                          : currentUser.role === 'DOCTOR'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 truncate mb-1">{currentUser.email}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                        currentUser.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : currentUser.role === 'DOCTOR'
                          ? 'bg-cyan-100 text-cyan-700 border border-cyan-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}>
                        {currentUser.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (currentUser.role === 'ADMIN') setActiveView('admin_dashboard');
                          else if (currentUser.role === 'DOCTOR') setActiveView('doctor_dashboard');
                          else setActiveView('patient_dashboard');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-500" />
                        <span>Go to Dashboard</span>
                      </button>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenProfile();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2.5 cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </button>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-sm shadow-cyan-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login / Register</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
