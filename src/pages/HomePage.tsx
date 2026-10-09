import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  Award, 
  HeartPulse, 
  Activity, 
  Users, 
  Star, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  Building2,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Doctor } from '../types';
import { DoctorCard } from '../components/DoctorCard';

interface HomePageProps {
  doctors: Doctor[];
  onSearch: (search: string, specialization: string, location: string) => void;
  onNavigateDoctors: () => void;
  onViewDoctorProfile: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
  onOpenAuth: () => void;
  onOpenArch: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  doctors,
  onSearch,
  onNavigateDoctors,
  onViewDoctorProfile,
  onBookDoctor,
  onOpenAuth,
  onOpenArch,
}) => {
  // Search bar state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const specializations = [
    { name: 'Cardiology', icon: HeartPulse, count: '18 Specialists', desc: 'Heart & cardiovascular diseases' },
    { name: 'Neurology', icon: Activity, count: '14 Specialists', desc: 'Brain, nerves & stroke management' },
    { name: 'Orthopedics', icon: Award, count: '22 Specialists', desc: 'Joint replacement & spine care' },
    { name: 'Pediatrics', icon: Users, count: '16 Specialists', desc: 'Infant & child health specialists' },
    { name: 'Dermatology', icon: Sparkles, count: '12 Specialists', desc: 'Clinical skin, hair & lasers' },
    { name: 'General Medicine', icon: Stethoscope, count: '25 Specialists', desc: 'Primary care & lifestyle disorders' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm, selectedSpecialization, selectedLocation);
    onNavigateDoctors();
  };

  const handleSpecialtyClick = (spec: string) => {
    setSelectedSpecialization(spec);
    onSearch('', spec, 'All');
    onNavigateDoctors();
  };

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-cyan-50/70 via-white to-white pt-10 pb-16 sm:pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100/80 text-cyan-800 text-xs font-semibold border border-cyan-200 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-cyan-700" />
                <span>Verified Specialist Hospital Network</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Your Health, <br />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-600 via-teal-600 to-emerald-600">
                  Our Priority
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Find trusted doctors, book appointments, and manage your healthcare in one place. Instant live database slot confirmation with top medical specialists.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={onNavigateDoctors}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 shadow-md shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find a Doctor</span>
                </button>
                <button
                  onClick={onNavigateDoctors}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>Book Appointment</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/70 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-2xl font-bold text-slate-900">120+</p>
                  <p className="text-xs text-slate-500 font-medium">Certified Doctors</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-cyan-700">15,000+</p>
                  <p className="text-xs text-slate-500 font-medium">Happy Patients</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-emerald-700">99.4%</p>
                  <p className="text-xs text-slate-500 font-medium">Care Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Right Column: Healthcare Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-4/3 sm:aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 relative group">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
                    alt="Maverick Hospital Consultation & Clinical Services"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent"></div>
                  
                  {/* Floating Doctor Tag */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-lg border border-white/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                        <HeartPulse className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Live Hospital OPD</p>
                        <p className="text-[11px] text-slate-500">Instant database scheduling</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Slots Open
                    </span>
                  </div>
                </div>

                {/* Floating Pill Rating */}
                <div className="absolute -top-4 -left-4 bg-white p-3 rounded-2xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">4.9 / 5.0 Rating</p>
                    <p className="text-[10px] text-slate-400">Over 3,500 reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SEARCH APPOINTMENT QUICK WIDGET (Below Hero) */}
          <div className="mt-12 max-w-4xl mx-auto bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200">
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Search input */}
              <div className="sm:col-span-4 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Doctor name, condition, clinic..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
                />
              </div>

              {/* Specialization select */}
              <div className="sm:col-span-3">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-hidden font-medium"
                >
                  <option value="All">All Specializations</option>
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

              {/* Location select */}
              <div className="sm:col-span-3">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-hidden font-medium"
                >
                  <option value="All">All Locations</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi NCR</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Pune">Pune</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>

              {/* Quick Submit */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* POPULAR SPECIALIZATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
              Clinical Departments
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Popular Medical Specializations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select a clinical department to consult with board-certified healthcare professionals.
            </p>
          </div>
          <button
            onClick={onNavigateDoctors}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Departments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {specializations.map((spec) => {
            const Icon = spec.icon;
            return (
              <div
                key={spec.name}
                onClick={() => handleSpecialtyClick(spec.name)}
                className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-50 group-hover:bg-cyan-600 text-cyan-700 group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-2xs">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {spec.name}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{spec.desc}</p>
                  <p className="text-[11px] font-semibold text-cyan-700 mt-2">{spec.count}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED DOCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
              Verified Doctors
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              Featured Healthcare Specialists
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Experienced doctors with proven clinical records, hospital affiliations, and high patient ratings.
            </p>
          </div>
          <button
            onClick={onNavigateDoctors}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Browse All {doctors.length} Doctors</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewProfile={onViewDoctorProfile}
              onBookAppointment={onBookDoctor}
            />
          ))}
        </div>
      </section>

      {/* HOW MAVERICK WORKS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/80 px-2.5 py-1 rounded-md border border-cyan-200">
              Step-by-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How Maverick Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Seamless connection between Patients, Attending Doctors, and Hospital Administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="text-base font-bold text-slate-900">Find Your Specialist</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter verified medical practitioners by department, experience, consultation fee, or clinic location.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="text-base font-bold text-slate-900">Pick Available Slot</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose convenient consultation date and time slot with automated conflict detection.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="text-base font-bold text-slate-900">Direct Doctor Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                The attending physician reviews the booking on their Doctor Portal and updates status to Confirmed.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 relative">
              <span className="w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="text-base font-bold text-slate-900">Digital Prescriptions</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Conclude visit with clinical notes, electronic prescriptions, and diagnostic tracking accessible anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE MAVERICK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200">
              Why Choose Maverick
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Hospital-Grade Healthcare Technology Built for Trust
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Maverick provides a seamless healthcare experience connecting patients directly with accredited hospital specialists for transparent consultations, verified reviews, and secure medical history.
            </p>

            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Doctor-Patient Communication</h4>
                  <p className="text-xs text-slate-500">Instant appointment requests directly confirmed by the attending specialist.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Verified Specialist Credentials</h4>
                  <p className="text-xs text-slate-500">Every physician is vetted with hospital affiliations, qualifications, and transparent consultation fees.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Complete Clinical History & Rx Generation</h4>
                  <p className="text-xs text-slate-500">Prescription records with exact dosage, frequencies, instructions, and follow-up guidance.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateDoctors}
                className="px-5 py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-sm shadow-cyan-600/20"
              >
                <span>Find a Doctor & Book Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Clinical Excellence Showcase Card */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6 relative overflow-hidden">
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-md">
                Patient-First Healthcare
              </span>
              <h3 className="text-xl font-bold text-slate-900">Standard of Excellence</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Slot Guarantee:</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Zero Double-Bookings</span>
              </div>
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Practitioner Verification:</span>
                <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">100% Board Certified</span>
              </div>
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Health Dossier Security:</span>
                <span className="text-slate-800 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Encrypted & Confidential</span>
              </div>
              <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Emergency Care Access:</span>
                <span className="text-cyan-800 font-semibold bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">24/7 Hospital Helplines</span>
              </div>
            </div>

            <div className="p-4 bg-sky-50/80 border border-sky-100 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium">
              Maverick brings hospital-level precision and patient convenience together for high quality clinical outpatient care.
            </div>
          </div>
        </div>
      </section>

      {/* HEALTHCARE STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-sky-50/60 rounded-3xl p-8 sm:p-12 border border-sky-100/90 shadow-2xs relative">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-100/70 border border-teal-200/70 px-2.5 py-1 rounded-md">
              Clinical Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trusted Healthcare Statistics</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Transforming outpatient consultations and clinical workflow with reliable persistent records.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-700 tracking-tight">120+</p>
              <p className="text-xs font-semibold text-slate-900 mt-2">Board-Certified Specialists</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Across 9 Core Disciplines</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-700 tracking-tight">15,000+</p>
              <p className="text-xs font-semibold text-slate-900 mt-2">Consultations Completed</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Zero Double-Bookings</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-700 tracking-tight">99.4%</p>
              <p className="text-xs font-semibold text-slate-900 mt-2">Patient Satisfaction</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Verified Medical Reviews</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">24 / 7</p>
              <p className="text-xs font-semibold text-slate-900 mt-2">Emergency Hospital Care</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Rapid Response Helpline</p>
            </div>
          </div>
        </div>
      </section>

      {/* PATIENT REVIEWS & TESTIMONIALS */}
      <section className="bg-slate-50 py-16 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2.5 py-1 rounded-md">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
              What Our Patients Say
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Real experiences from patients treated across our specialist departments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Booking an appointment with Dr. Rajesh Patel was effortless. He explained my ECG results with great clarity and never rushed the consultation. Highly recommended!"
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Rahul Verma</p>
                <p className="text-[11px] text-slate-400">Cardiology Patient • Mumbai</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "Dr. Priya Sharma diagnosed my migraine triggers accurately. Having my prescriptions securely stored and printable directly from my patient dashboard is fantastic."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Ananya Sen</p>
                <p className="text-[11px] text-slate-400">Neurology Patient • Kolkata</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "The doctor dashboard accepted my appointment within 15 minutes. Very transparent fees and no waiting in crowded hospital lines."
              </p>
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Rohit Gupta</p>
                <p className="text-[11px] text-slate-400">Orthopedic Patient • Bengaluru</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-linear-to-r from-cyan-600 via-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-xs sm:text-sm text-cyan-50 leading-relaxed">
              Connect with India's leading medical specialists, manage digital prescriptions, and track your clinical health history from any device.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={onNavigateDoctors}
              className="px-6 py-3.5 bg-white text-cyan-800 hover:bg-slate-100 font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
            >
              Find a Doctor
            </button>
            <button
              onClick={onNavigateDoctors}
              className="px-6 py-3.5 bg-cyan-900/40 hover:bg-cyan-900/60 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
