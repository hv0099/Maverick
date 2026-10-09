import React, { useState, useMemo } from 'react';
import { Search, Filter, Stethoscope, MapPin, Building2, Star, Award, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { Doctor } from '../types';
import { DoctorCard } from '../components/DoctorCard';

interface DoctorsPageProps {
  doctors: Doctor[];
  initialSearch?: string;
  initialSpecialization?: string;
  initialLocation?: string;
  onViewDoctorProfile: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorsPage: React.FC<DoctorsPageProps> = ({
  doctors,
  initialSearch = '',
  initialSpecialization = 'All',
  initialLocation = 'All',
  onViewDoctorProfile,
  onBookDoctor,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSpecialization, setSelectedSpecialization] = useState(initialSpecialization);
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedMinRating, setSelectedMinRating] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'RATING' | 'EXPERIENCE' | 'FEE_LOW' | 'FEE_HIGH'>('RATING');

  const specializations = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'General Medicine',
    'Ophthalmology',
    'Psychiatry',
  ];

  const locations = [
    'All',
    'Mumbai',
    'Delhi',
    'Bengaluru',
    'Pune',
    'Kolkata',
    'Hyderabad',
    'Jaipur',
    'Ahmedabad',
  ];

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      // Search
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.fullName.toLowerCase().includes(q) ||
        doc.specialization.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q) ||
        doc.location.toLowerCase().includes(q);

      // Specialization
      const matchesSpec =
        selectedSpecialization === 'All' ||
        doc.specialization.toLowerCase() === selectedSpecialization.toLowerCase();

      // Location
      const matchesLoc =
        selectedLocation === 'All' ||
        doc.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Min Rating
      const minRat = selectedMinRating === 'All' ? 0 : parseFloat(selectedMinRating);
      const matchesRating = doc.rating >= minRat;

      // Availability
      const matchesAvail =
        availabilityFilter === 'All' ||
        (availabilityFilter === 'TODAY' && doc.availabilityStatus === 'AVAILABLE_TODAY') ||
        (availabilityFilter === 'TOMORROW' && doc.availabilityStatus === 'AVAILABLE_TOMORROW');

      return matchesSearch && matchesSpec && matchesLoc && matchesRating && matchesAvail;
    }).sort((a, b) => {
      if (sortBy === 'RATING') return b.rating - a.rating;
      if (sortBy === 'EXPERIENCE') return b.experience - a.experience;
      if (sortBy === 'FEE_LOW') return a.consultationFee - b.consultationFee;
      if (sortBy === 'FEE_HIGH') return b.consultationFee - a.consultationFee;
      return 0;
    });
  }, [
    doctors,
    searchTerm,
    selectedSpecialization,
    selectedLocation,
    selectedMinRating,
    availabilityFilter,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('All');
    setSelectedLocation('All');
    setSelectedMinRating('All');
    setAvailabilityFilter('All');
    setSortBy('RATING');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedSpecialization !== 'All' ||
    selectedLocation !== 'All' ||
    selectedMinRating !== 'All' ||
    availabilityFilter !== 'All';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-teal-700 via-cyan-700 to-teal-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-semibold backdrop-blur-xs">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Verified Healthcare Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Discover & Book Top Medical Specialists
          </h1>
          <p className="text-xs sm:text-sm text-teal-100 font-medium">
            Search qualified medical practitioners across clinical disciplines. Instant slot booking with real-time zero double-booking confirmation.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center shrink-0">
          <p className="text-3xl font-black">{doctors.length}</p>
          <p className="text-xs text-teal-100 font-semibold mt-0.5">Verified Doctors</p>
        </div>
      </div>

      {/* Main Filter & Search Control Panel */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          {/* Text Search */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-cyan-500 outline-hidden font-medium"
            />
          </div>

          {/* Department dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-hidden font-medium"
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'All' ? 'All Specializations' : spec}
                </option>
              ))}
            </select>
          </div>

          {/* Location dropdown */}
          <div className="sm:col-span-2">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-hidden font-medium"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="sm:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 outline-hidden font-medium"
            >
              <option value="RATING">Highest Rated</option>
              <option value="EXPERIENCE">Most Experienced</option>
              <option value="FEE_LOW">Fee: Low to High</option>
              <option value="FEE_HIGH">Fee: High to Low</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter by:
            </span>

            {/* Availability pills */}
            <button
              onClick={() => setAvailabilityFilter('All')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                availabilityFilter === 'All'
                  ? 'bg-cyan-100 text-cyan-800 font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Slots
            </button>
            <button
              onClick={() => setAvailabilityFilter('TODAY')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                availabilityFilter === 'TODAY'
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Available Today
            </button>
            <button
              onClick={() => setAvailabilityFilter('TOMORROW')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                availabilityFilter === 'TOMORROW'
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Available Tomorrow
            </button>

            {/* Min Rating */}
            <select
              value={selectedMinRating}
              onChange={(e) => setSelectedMinRating(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium outline-hidden"
            >
              <option value="All">All Ratings</option>
              <option value="4.5">★ 4.5 & above</option>
              <option value="4.8">★ 4.8 & above</option>
              <option value="4.9">★ 4.9 & above</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs sm:text-sm font-semibold text-slate-700">
          Showing <strong>{filteredDoctors.length}</strong> of {doctors.length} doctors
        </p>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">No doctors matched your criteria</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your department filter, location or search term.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 bg-cyan-600 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onViewProfile={onViewDoctorProfile}
              onBookAppointment={onBookDoctor}
            />
          ))}
        </div>
      )}
    </div>
  );
};
