import React, { useState } from 'react';
import { X, Layers, Database, Server, Code, ShieldCheck, CheckCircle2, Cpu } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'DATABASE' | 'APIS' | 'SECURITY'>('OVERVIEW');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold">Maverick Healthcare System Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-200 text-xs font-bold text-slate-600 bg-slate-50 shrink-0">
          {(['OVERVIEW', 'DATABASE', 'APIS', 'SECURITY'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'border-cyan-600 text-cyan-800 bg-white'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab === 'OVERVIEW' && 'Dual Backend & Architecture'}
              {tab === 'DATABASE' && 'Relational Schema (9 Tables)'}
              {tab === 'APIS' && 'REST API Endpoints'}
              {tab === 'SECURITY' && 'RBAC & Conflict Engine'}
            </button>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-700">
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-4">
              <div className="p-4 bg-cyan-50/70 border border-cyan-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                  Dual Backend Architecture
                </span>
                <h4 className="text-sm font-bold text-slate-900">Enterprise High-Availability Design</h4>
                <p className="text-slate-600 leading-relaxed">
                  Maverick Healthcare demonstrates production-grade full-stack patterns:
                  an active runtime powering the responsive UI via <strong>Node.js / Express + TSX</strong> with instant persistent JSON storage,
                  paired with an enterprise <strong>Spring Boot 3 + Spring Data JPA + MySQL</strong> backend prepared for enterprise deployment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-cyan-700 font-bold">
                    <Server className="w-4 h-4" />
                    <span>Active Web Runtime (Port 3000)</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    <li>React 19 + Vite 6 + Tailwind CSS</li>
                    <li>Express 4.21 with mounted Vite middlewares</li>
                    <li>Persistent store at <code className="text-cyan-800 font-mono">data/careconnect_db.json</code></li>
                    <li>Instant live state synchronization</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2 text-teal-700 font-bold">
                    <Cpu className="w-4 h-4" />
                    <span>Spring Boot Backend (Port 8080)</span>
                  </div>
                  <ul className="space-y-1 text-slate-600 list-disc list-inside">
                    <li>Java 17, Spring Boot 3.2.3, Spring Web MVC</li>
                    <li>Spring Data JPA & Hibernate 6.4 ORM</li>
                    <li>Relational schema with foreign keys in MySQL</li>
                    <li>Spring Security & JWT token authentication</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DATABASE' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Normalized Relational Schema (9 Relational Entities)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { name: 'USERS', desc: 'Authentication, passwords, RBAC roles (ADMIN, DOCTOR, PATIENT)' },
                  { name: 'DOCTORS', desc: 'Specialties, hospital affiliations, ratings, consultation fees' },
                  { name: 'PATIENTS', desc: 'Medical dossiers, emergency contacts, blood groups, allergies' },
                  { name: 'APPOINTMENTS', desc: 'Zero double-booking slots, dates, status tracking' },
                  { name: 'MEDICAL_RECORDS', desc: 'Diagnoses, symptoms, clinical treatment plans' },
                  { name: 'PRESCRIPTIONS', desc: 'Multi-medication schedules, dosage, frequencies' },
                  { name: 'DOCTOR_AVAILABILITY', desc: 'Custom working hours, blocked dates, duration' },
                  { name: 'REVIEWS', desc: 'Patient ratings (1-5 stars) and doctor moderation' },
                  { name: 'NOTIFICATIONS', desc: 'System alerts for confirmations, cancellations, EMRs' },
                ].map(table => (
                  <div key={table.name} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-mono font-bold text-cyan-800 block text-xs">{table.name}</span>
                    <p className="text-[11px] text-slate-500 mt-1">{table.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'APIS' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Core REST API Endpoint Catalog
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {[
                  { m: 'POST', u: '/api/auth/login', d: 'User authentication & role-based token issue' },
                  { m: 'POST', u: '/api/auth/register', d: 'New patient onboarding with health profile' },
                  { m: 'GET', u: '/api/doctors', d: 'Search specialists by department, rating & city' },
                  { m: 'GET', u: '/api/doctors/:id/availability', d: 'Slot query with booked slot exclusion' },
                  { m: 'POST', u: '/api/appointments', d: 'Book appointment with conflict verification' },
                  { m: 'PUT', u: '/api/appointments/:id/status', d: 'Doctor confirms, rejects or completes' },
                  { m: 'POST', u: '/api/medical-records', d: 'Issue diagnosis, clinical notes & prescription' },
                  { m: 'POST', u: '/api/reviews', d: 'Submit post-consultation patient feedback' },
                  { m: 'GET', u: '/api/admin/stats', d: 'Aggregated operational metrics & chart datasets' },
                ].map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.m === 'POST' ? 'bg-emerald-100 text-emerald-800' :
                      ep.m === 'GET' ? 'bg-cyan-100 text-cyan-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ep.m}
                    </span>
                    <span className="font-semibold text-slate-800">{ep.u}</span>
                    <span className="text-[11px] text-slate-500 font-sans ml-auto truncate">{ep.d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Conflict Engine & Zero Double-Booking Guarantee</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Both backends enforce strict slot conflict checks. When a patient requests a slot, the system queries active appointments (<code className="font-mono text-emerald-800">status NOT IN ('CANCELLED', 'REJECTED')</code>) for that doctor and date. If matched, HTTP 409 Conflict is returned, ensuring concurrent booking integrity.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Role-Based Access Control (RBAC)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Role segregation enforces that only doctors can complete consultations and author medical records, patients can only access their personal health dossiers, and administrators oversee system-wide users and practitioner onboarding.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
