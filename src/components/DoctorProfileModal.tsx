import React from 'react';
import { X, Star, MapPin, Building2, Award, Calendar, Clock, Languages, Stethoscope, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Doctor } from '../types';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-linear-to-r from-teal-600 via-cyan-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-200" />
            <h3 className="text-base font-bold tracking-tight">Specialist Profile</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <img
              src={doctor.photoUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'}
              alt={doctor.fullName}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
              }}
            />
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                  {doctor.specialization}
                </span>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Specialist
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {doctor.fullName}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {doctor.qualification} • {doctor.experience} Years Clinical Practice
              </p>
              <div className="flex items-center gap-4 pt-1 text-xs text-slate-600">
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  {doctor.rating.toFixed(1)} ({doctor.reviewCount} Reviews)
                </span>
                <span className="text-slate-400">|</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  ₹{doctor.consultationFee} <span className="text-xs font-normal text-slate-500">per visit</span>
                </span>
              </div>
            </div>
          </div>

          {/* About Specialist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Clinical Background & Biography
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              {doctor.about}
            </p>
          </div>

          {/* Hospital, Location, Languages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 flex items-center gap-1 mb-1 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Affiliated Hospital
              </span>
              <p className="font-bold text-slate-900">{doctor.hospital}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 flex items-center gap-1 mb-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Clinical Location
              </span>
              <p className="font-bold text-slate-900">{doctor.location}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 flex items-center gap-1 mb-1 font-medium">
                <Languages className="w-3.5 h-3.5 text-slate-400" />
                Languages Spoken
              </span>
              <p className="font-bold text-slate-900">{doctor.languages?.join(', ') || 'English, Hindi'}</p>
            </div>
          </div>

          {/* Schedule & Available Slots */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Consultation Schedule & Days
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => {
                const isAvail = doctor.availableDays?.includes(day);
                return (
                  <span
                    key={day}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      isAvail
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Standard Time Slots:
              </span>
              <div className="flex flex-wrap gap-2">
                {doctor.availableTimeSlots?.map((slot) => (
                  <span
                    key={slot}
                    className="px-2.5 py-1 bg-cyan-50 text-cyan-800 rounded-md text-xs font-medium border border-cyan-200"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Reviews Section */}
          {doctor.reviews && doctor.reviews.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Verified Patient Testimonials ({doctor.reviews.length})
                </h4>
              </div>
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {doctor.reviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{rev.patientName}</span>
                      <div className="flex items-center text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 italic">"{rev.comment}"</p>
                    <span className="text-[10px] text-slate-400">{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <p className="text-xs text-slate-500 font-medium">Standard Outpatient Consultation</p>
            <p className="text-base font-extrabold text-slate-900">₹{doctor.consultationFee}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 cursor-pointer transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor);
              }}
              className="px-5 py-2.5 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-600/25 cursor-pointer transition-all"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
