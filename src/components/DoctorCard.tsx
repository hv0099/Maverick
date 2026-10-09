import React from 'react';
import { Star, MapPin, Building2, Calendar, Award, Clock } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorCardProps {
  doctor: Doctor;
  onViewProfile: (doctor: Doctor) => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  onViewProfile,
  onBookAppointment,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-cyan-400/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Image & Status */}
        <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          <img
            src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'}
            alt={doctor.fullName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent"></div>

          {/* Availability badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide shadow-xs flex items-center gap-1 ${
                doctor.availabilityStatus === 'AVAILABLE_TODAY'
                  ? 'bg-emerald-500/95 text-white'
                  : 'bg-amber-500/95 text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              {doctor.availabilityStatus === 'AVAILABLE_TODAY' ? 'Available Today' : 'Available Tomorrow'}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-1 rounded-lg shadow-xs flex items-center gap-1 text-[11px] font-bold text-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{doctor.rating.toFixed(1)}</span>
            <span className="text-[10px] text-slate-400">({doctor.reviewCount})</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-100">
                {doctor.specialization}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                {doctor.experience} Yrs Exp
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors mt-1.5 line-clamp-1">
              {doctor.fullName}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-1 font-medium mt-0.5">
              {doctor.qualification}
            </p>
          </div>

          <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5 truncate">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.hospital}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{doctor.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2 space-y-3">
        <div className="flex items-baseline justify-between pt-2">
          <span className="text-xs text-slate-500 font-medium">Consultation Fee</span>
          <span className="text-base font-extrabold text-slate-900">
            ₹{doctor.consultationFee}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onViewProfile(doctor)}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer text-center"
          >
            Profile
          </button>
          <button
            onClick={() => onBookAppointment(doctor)}
            className="w-full py-2 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all cursor-pointer text-center"
          >
            Book Slot
          </button>
        </div>
      </div>
    </div>
  );
};
