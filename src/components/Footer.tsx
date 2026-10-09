import React from 'react';
import { HeartPulse, PhoneCall, Mail, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <HeartPulse className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">Maverick</span>
                <span className="ml-2 text-xs px-2 py-0.5 rounded-full font-semibold bg-cyan-900/60 text-cyan-300 border border-cyan-700/50">
                  HEALTHCARE
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An integrated, enterprise-grade healthcare management system connecting patients with certified medical specialists, facilitating real-time appointments, clinical records, and hospital oversight.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NABH Accredited</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>ISO 9001:2015</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#specializations" className="hover:text-cyan-400 transition-colors">Medical Specializations</a></li>
              <li><a href="#featured-doctors" className="hover:text-cyan-400 transition-colors">Verified Doctors</a></li>
              <li><a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How Appointment Works</a></li>
              <li><a href="#testimonials" className="hover:text-cyan-400 transition-colors">Patient Testimonials</a></li>
              <li><a href="#stats" className="hover:text-cyan-400 transition-colors">Clinical Statistics</a></li>
            </ul>
          </div>

          {/* Clinical Departments */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Departments</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Cardiology & Heart Care</li>
              <li>Neurology & Stroke Unit</li>
              <li>Orthopedics & Joint Care</li>
              <li>Pediatrics & Neonatal Care</li>
              <li>Dermatology & Cosmetology</li>
              <li>Internal Medicine</li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Emergency Hotline</h4>
            <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
                <PhoneCall className="w-4 h-4" />
                <span>108 / 1800-CARE-NOW</span>
              </div>
              <p className="text-xs text-slate-400">24/7 Rapid Ambulance & Emergency Casualty response</p>
            </div>
            <div className="space-y-1.5 text-xs text-slate-400 pt-1">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-cyan-400" /> support@maverick.health</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Metro Health Hub, Mumbai, India</p>
              <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Mon - Sun, 24 Hours</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Technical Stack Note */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Maverick Healthcare Systems. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Architecture:</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">React + TypeScript</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Spring Boot REST API</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">MySQL Database</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
