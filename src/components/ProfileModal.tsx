import React, { useState } from 'react';
import { X, User as UserIcon, Lock, Key, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { User, Doctor, Patient } from '../types';
import { api } from '../services/api';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  currentDoctor: Doctor | null;
  currentPatient: Patient | null;
  onRefreshAll: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  currentDoctor,
  currentPatient,
  onRefreshAll,
}) => {
  if (!isOpen || !currentUser) return null;

  const [activeTab, setActiveTab] = useState<'DETAILS' | 'PASSWORD'>('DETAILS');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await api.changePassword(currentUser.id, currentPassword, newPassword);
      if (res.success) {
        setPasswordMsg({ type: 'success', text: 'Password successfully changed!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Failed to update password.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Error updating password.' });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const displayName = currentDoctor?.fullName || currentPatient?.fullName || currentUser.name;
  const displayAvatar = currentDoctor?.photoUrl || currentPatient?.avatarUrl || currentUser.avatarUrl;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-linear-to-r from-teal-600 to-cyan-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="w-5 h-5 text-teal-200" />
            <h3 className="text-base font-bold tracking-tight">Account & Security</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-white/80 hover:text-white hover:bg-white/15 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-slate-50">
          <button
            onClick={() => setActiveTab('DETAILS')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'DETAILS'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Profile Overview
          </button>
          <button
            onClick={() => setActiveTab('PASSWORD')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
              activeTab === 'PASSWORD'
                ? 'border-cyan-600 text-cyan-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Change Password
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'DETAILS' ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <img
                  src={displayAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt={displayName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{displayName}</h4>
                  <p className="text-slate-500 font-medium">{currentUser.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentUser.role === 'ADMIN'
                      ? 'bg-purple-100 text-purple-800'
                      : currentUser.role === 'DOCTOR'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-slate-700 bg-white p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">User Identifier:</span>
                  <span className="font-mono text-slate-900 font-semibold">{currentUser.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Phone Number:</span>
                  <span className="font-semibold text-slate-900">{currentUser.phone || 'Not configured'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Account Status:</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {currentUser.status}
                  </span>
                </div>

                {/* Patient specific details */}
                {currentPatient && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Blood Group:</span>
                      <span className="font-bold text-rose-700">{currentPatient.bloodGroup}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Known Allergies:</span>
                      <span className="text-amber-700 font-semibold">{currentPatient.allergies || 'None'}</span>
                    </div>
                  </>
                )}

                {/* Doctor specific details */}
                {currentDoctor && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Specialization:</span>
                      <span className="font-bold text-cyan-800">{currentDoctor.specialization}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Affiliation:</span>
                      <span className="font-semibold text-slate-900">{currentDoctor.hospital}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Fee:</span>
                      <span className="font-bold text-emerald-700">₹{currentDoctor.consultationFee}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              {passwordMsg && (
                <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-700'
                }`}>
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <span>{passwordMsg.text}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  placeholder="At least 6 characters"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  placeholder="Repeat new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="w-full py-2.5 bg-linear-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
