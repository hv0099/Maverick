import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HamburgerDrawer } from './components/HamburgerDrawer';
import { AuthModal } from './components/AuthModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { BookingModal } from './components/BookingModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ProfileModal } from './components/ProfileModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { HomePage } from './pages/HomePage';
import { DoctorsPage } from './pages/DoctorsPage';
import { DashboardPatient } from './components/DashboardPatient';
import { DashboardDoctor } from './components/DashboardDoctor';
import { DashboardAdmin } from './components/DashboardAdmin';
import { User, Doctor, Patient, SystemNotification } from './types';
import { api } from './services/api';

export default function App() {
  // Authentication & session
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);

  // App dataset
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Navigation views
  const [activeView, setActiveView] = useState<string>('home');
  const [patientTab, setPatientTab] = useState<string>('DASHBOARD');
  const [doctorTab, setDoctorTab] = useState<string>('DASHBOARD');
  const [adminTab, setAdminTab] = useState<string>('DASHBOARD');

  // Search parameters for Doctors page
  const [searchParams, setSearchParams] = useState({
    search: '',
    specialization: 'All',
    location: 'All',
  });

  // Modal dialog states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [bookingLoginContext, setBookingLoginContext] = useState<string | undefined>(undefined);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [profileDoctor, setProfileDoctor] = useState<Doctor | null>(null);
  const [userProfileOpen, setUserProfileOpen] = useState(false);
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // Initial load
  const loadInitialData = async () => {
    try {
      // Restore user from localStorage if token exists
      const storedToken = localStorage.getItem('cc_token');
      const storedUser = localStorage.getItem('cc_user');
      const storedDoc = localStorage.getItem('cc_doctor');
      const storedPat = localStorage.getItem('cc_patient');

      if (storedToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          if (storedDoc) setCurrentDoctor(JSON.parse(storedDoc));
          if (storedPat) setCurrentPatient(JSON.parse(storedPat));

          // Validate against server
          api.getCurrentUser().then(res => {
            if (res.success && res.user) {
              setCurrentUser(res.user);
              if (res.doctor) setCurrentDoctor(res.doctor);
              if (res.patient) setCurrentPatient(res.patient);
            }
          }).catch(() => {
            // keep stored
          });
        } catch {
          // ignore error
        }
      }

      // Fetch doctors list
      const docsRes = await api.getDoctors();
      if (docsRes.success && Array.isArray(docsRes.data)) {
        setDoctors(docsRes.data);
      }

      // Fetch notifications
      if (storedUser) {
        api.getNotifications().then(nRes => {
          if (nRes.success && Array.isArray(nRes.data)) {
            setNotifications(nRes.data);
          }
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Initial data load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRefreshAll = async () => {
    try {
      const [docsRes, notifsRes] = await Promise.all([
        api.getDoctors(),
        api.getNotifications(),
      ]);
      if (docsRes.success) setDoctors(docsRes.data);
      if (notifsRes.success) setNotifications(notifsRes.data);

      if (currentUser) {
        const meRes = await api.getCurrentUser();
        if (meRes.success) {
          if (meRes.user) setCurrentUser(meRes.user);
          if (meRes.doctor) setCurrentDoctor(meRes.doctor);
          if (meRes.patient) setCurrentPatient(meRes.patient);
        }
      }
    } catch (err) {
      console.error('Error refreshing app data:', err);
    }
  };

  const handleLoginSuccess = (user: User, doctor: Doctor | null, patient: Patient | null) => {
    setCurrentUser(user);
    setCurrentDoctor(doctor);
    setCurrentPatient(patient);
    setAuthModalOpen(false);
    setBookingLoginContext(undefined);

    // Route to appropriate dashboard
    if (user.role === 'ADMIN') {
      setActiveView('admin_dashboard');
      setAdminTab('DASHBOARD');
    } else if (user.role === 'DOCTOR') {
      setActiveView('doctor_dashboard');
      setDoctorTab('DASHBOARD');
    } else if (user.role === 'PATIENT') {
      // If patient was booking a specific doctor, open booking modal
      if (bookingDoctor) {
        // keep view on doctors and open booking
      } else {
        setActiveView('patient_dashboard');
        setPatientTab('DASHBOARD');
      }
    }

    handleRefreshAll();
  };

  const handleLogout = () => {
    localStorage.removeItem('cc_token');
    localStorage.removeItem('cc_user');
    localStorage.removeItem('cc_doctor');
    localStorage.removeItem('cc_patient');
    setCurrentUser(null);
    setCurrentDoctor(null);
    setCurrentPatient(null);
    setActiveView('home');
    setNotifications([]);
  };

  const handleSearchDoctors = (search: string, specialization: string, location: string) => {
    setSearchParams({ search, specialization, location });
    setActiveView('doctors');
  };

  const handleBookDoctor = (doctor: Doctor) => {
    if (!currentUser) {
      setBookingLoginContext(doctor.fullName);
      setBookingDoctor(doctor);
      setAuthModalOpen(true);
    } else {
      setBookingDoctor(doctor);
    }
  };

  const handleRequireLogin = (doctorName: string) => {
    setBookingLoginContext(doctorName);
    setAuthModalOpen(true);
  };

  const handleOpenAuth = () => {
    setBookingLoginContext(undefined);
    setAuthModalOpen(true);
  };

  const handleSelectViewFromDrawer = (view: string, tab?: string) => {
    setActiveView(view);
    if (tab) {
      if (view === 'admin_dashboard') setAdminTab(tab);
      if (view === 'doctor_dashboard') setDoctorTab(tab);
      if (view === 'patient_dashboard') setPatientTab(tab);
    }
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentDoctor={currentDoctor}
        currentPatient={currentPatient}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenArch={() => setArchModalOpen(true)}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenHamburger={() => setHamburgerOpen(true)}
        onOpenProfile={() => setUserProfileOpen(true)}
        unreadCount={unreadNotificationsCount}
      />

      {/* Main Page View Switcher */}
      <main className="flex-1">
        {activeView === 'home' && (
          <HomePage
            doctors={doctors}
            onSearch={handleSearchDoctors}
            onNavigateDoctors={() => {
              setSearchParams({ search: '', specialization: 'All', location: 'All' });
              setActiveView('doctors');
            }}
            onViewDoctorProfile={(doc) => setProfileDoctor(doc)}
            onBookDoctor={handleBookDoctor}
            onOpenAuth={handleOpenAuth}
            onOpenArch={() => setArchModalOpen(true)}
          />
        )}

        {activeView === 'doctors' && (
          <DoctorsPage
            doctors={doctors}
            initialSearch={searchParams.search}
            initialSpecialization={searchParams.specialization}
            initialLocation={searchParams.location}
            onViewDoctorProfile={(doc) => setProfileDoctor(doc)}
            onBookDoctor={handleBookDoctor}
          />
        )}

        {activeView === 'patient_dashboard' && currentPatient && (
          <DashboardPatient
            patient={currentPatient}
            onNavigateToFindDoctors={() => setActiveView('doctors')}
            onRefreshAll={handleRefreshAll}
            onLogout={handleLogout}
            initialTab={patientTab}
          />
        )}

        {activeView === 'doctor_dashboard' && currentDoctor && (
          <DashboardDoctor
            doctor={currentDoctor}
            onRefreshAll={handleRefreshAll}
            onLogout={handleLogout}
            initialTab={doctorTab}
          />
        )}

        {activeView === 'admin_dashboard' && currentUser?.role === 'ADMIN' && (
          <DashboardAdmin
            currentUser={currentUser}
            onRefreshAll={handleRefreshAll}
            onLogout={handleLogout}
            initialTab={adminTab}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Left Navigation Drawer */}
      <HamburgerDrawer
        isOpen={hamburgerOpen}
        onClose={() => setHamburgerOpen(false)}
        currentUser={currentUser}
        currentDoctor={currentDoctor}
        currentPatient={currentPatient}
        activeView={activeView}
        onSelectView={handleSelectViewFromDrawer}
        onOpenNotifications={() => setNotificationsOpen(true)}
        onLogout={handleLogout}
        unreadNotificationsCount={unreadNotificationsCount}
      />

      {/* Right Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onRefreshNotifications={handleRefreshAll}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        bookingContextDoctorName={bookingLoginContext}
      />

      {/* Specialist Public Profile Modal */}
      <DoctorProfileModal
        doctor={profileDoctor}
        onClose={() => setProfileDoctor(null)}
        onBookAppointment={(doc) => {
          setProfileDoctor(null);
          handleBookDoctor(doc);
        }}
      />

      {/* Appointment Booking Modal */}
      <BookingModal
        isOpen={Boolean(bookingDoctor)}
        doctor={bookingDoctor}
        patient={currentPatient}
        currentUser={currentUser}
        onClose={() => setBookingDoctor(null)}
        onBookingSuccess={() => {
          handleRefreshAll();
          if (currentUser?.role === 'PATIENT') {
            setActiveView('patient_dashboard');
            setPatientTab('APPOINTMENTS');
          }
        }}
        onRequireLogin={handleRequireLogin}
      />

      {/* User Account / Security Profile Modal */}
      <ProfileModal
        isOpen={userProfileOpen}
        onClose={() => setUserProfileOpen(false)}
        currentUser={currentUser}
        currentDoctor={currentDoctor}
        currentPatient={currentPatient}
        onRefreshAll={handleRefreshAll}
      />

      {/* Interactive Architecture & University Rubric Modal */}
      <ArchitectureModal
        isOpen={archModalOpen}
        onClose={() => setArchModalOpen(false)}
      />
    </div>
  );
}
