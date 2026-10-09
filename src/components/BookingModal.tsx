import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, ShieldCheck, User as UserIcon, Building2, Stethoscope, ChevronRight } from 'lucide-react';
import { Doctor, Patient, User } from '../types';
import { api } from '../services/api';

interface BookingModalProps {
  isOpen: boolean;
  doctor: Doctor | null;
  patient: Patient | null;
  currentUser: User | null;
  onClose: () => void;
  onBookingSuccess: () => void;
  onRequireLogin: (doctorName: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  doctor,
  patient,
  currentUser,
  onClose,
  onBookingSuccess,
  onRequireLogin,
}) => {
  if (!isOpen || !doctor) return null;

  // If not logged in as patient
  useEffect(() => {
    if (!currentUser) {
      onRequireLogin(doctor.fullName);
      onClose();
    }
  }, [currentUser, doctor, onClose, onRequireLogin]);

  // Form states
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('General Consultation');
  const [notes, setNotes] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successReceipt, setSuccessReceipt] = useState<{
    appointmentNumber: string;
    doctorName: string;
    date: string;
    time: string;
  } | null>(null);

  // Fetch booked slots for the selected date
  useEffect(() => {
    if (!doctor || !selectedDate) return;
    const loadAvailability = async () => {
      setLoadingAvailability(true);
      try {
        const res = await api.getDoctorAvailability(doctor.id, selectedDate);
        if (res.success && Array.isArray(res.bookedSlots)) {
          setBookedSlots(res.bookedSlots);
        } else {
          setBookedSlots([]);
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoadingAvailability(false);
      }
    };
    loadAvailability();
  }, [doctor, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) {
      setErrorMessage('Patient record not found. Please log in as a patient.');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage('Please select an available time slot.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await api.bookAppointment({
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedTimeSlot,
        reason,
        notes,
      });

      if (res.success && res.data) {
        setSuccessReceipt({
          appointmentNumber: res.data.appointmentNumber,
          doctorName: doctor.fullName,
          date: res.data.appointmentDate,
          time: res.data.appointmentTime,
        });
        onBookingSuccess();
      } else {
        setErrorMessage(res.message || 'Slot already booked or booking failed.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not schedule appointment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setSuccessReceipt(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-cyan-600 via-teal-600 to-teal-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-200" />
            <h3 className="text-base font-bold">Schedule Doctor Consultation</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt View on Booking Success */}
        {successReceipt ? (
          <div className="p-7 space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                Reservation Confirmed
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">Appointment Request Submitted!</h3>
              <p className="text-xs text-slate-500">
                Ref Number: <strong className="font-mono text-slate-900 text-sm">{successReceipt.appointmentNumber}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor:</span>
                <span className="font-bold text-slate-900">{successReceipt.doctorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-bold text-cyan-800">{successReceipt.date} at {successReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="text-slate-800">{doctor.hospital}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Consultation Fee:</span>
                <span className="font-bold text-emerald-700">₹{doctor.consultationFee}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  PENDING DOCTOR REVIEW
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              The attending specialist has received your booking in their Doctor Portal. You can track status anytime under <strong>My Appointments</strong>.
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Doctor Brief Info */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <img
                src={doctor.photoUrl}
                alt={doctor.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800';
                }}
              />
              <div className="min-w-0 flex-1 text-xs">
                <h4 className="font-bold text-slate-900 text-sm truncate">{doctor.fullName}</h4>
                <p className="text-cyan-700 font-semibold">{doctor.specialization} • {doctor.hospital}</p>
                <p className="text-slate-500 font-bold mt-0.5">Consultation Fee: ₹{doctor.consultationFee}</p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Appointment Date *
              </label>
              <input
                type="date"
                required
                min={todayStr}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTimeSlot('');
                }}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
              />
            </div>

            {/* Time slot selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Slots *
                </label>
                {loadingAvailability && (
                  <span className="text-[10px] text-cyan-600 font-semibold animate-pulse">
                    Checking slot availability...
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {doctor.availableTimeSlots?.map((slot) => {
                  const isBooked = bookedSlots.includes(slot);
                  const isSelected = selectedTimeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isBooked}
                      onClick={() => {
                        setSelectedTimeSlot(slot);
                        setErrorMessage('');
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center border cursor-pointer ${
                        isBooked
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : isSelected
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                      }`}
                      title={isBooked ? 'Slot already reserved by another patient' : 'Click to select this slot'}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5">
                * Zero double-booking algorithm: Unavailable slots are automatically locked in real-time.
              </p>
            </div>

            {/* Reason for Visit */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Consultation *
              </label>
              <input
                type="text"
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chest pain, recurring fever, skin allergy review"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Notes / Past Reports (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any previous medications, report numbers, or specific symptoms..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden bg-white resize-none"
              ></textarea>
            </div>

            {/* Patient identity confirmation banner */}
            {patient && (
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center justify-between">
                <span>Booking as: <strong>{patient.fullName}</strong></span>
                <span className="font-mono text-emerald-700 font-semibold">{patient.phone}</span>
              </div>
            )}

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !selectedTimeSlot}
                className="w-full py-3 bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-bold rounded-xl text-xs shadow-md shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Reserving Slot in Database...</span>
                ) : (
                  <span>Confirm Appointment Reservation (₹{doctor.consultationFee})</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
