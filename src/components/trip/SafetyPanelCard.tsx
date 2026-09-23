'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SafetyInfo } from '@/lib/ai/types';
import { ShieldCheck, PhoneCall, AlertTriangle, CloudSun, HeartPulse, CheckCircle2 } from 'lucide-react';

interface SafetyPanelCardProps {
  safety: SafetyInfo;
}

export const SafetyPanelCard: React.FC<SafetyPanelCardProps> = ({ safety }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.25 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-6 space-y-6 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-slate-100">Safety Index & Advisory</h3>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1 rounded-2xl border border-emerald-500/20">
          <span className="text-xs font-mono font-bold text-emerald-400">
            {safety.overallSafetyIndex === null ? 'Not independently verified' : `Sample score: ${safety.overallSafetyIndex}/100`}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <CloudSun className="w-4 h-4 mr-1.5" />
              Weather Advisory
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {safety.weatherAdvisory}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-1.5" />
              Local Travel Advice
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              {safety.localTips.map((tip, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <PhoneCall className="w-4 h-4 mr-1.5" />
              Emergency Contacts & Helplines
            </h4>
            <div className="space-y-2">
              {safety.emergencyContacts.length === 0 && <p className="text-sm text-slate-300">Check official local emergency contacts before departure.</p>}
              {safety.emergencyContacts.map((contact, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-900 px-3.5 py-2.5 rounded-xl text-sm">
                  <span className="font-semibold text-slate-200">{contact.name}</span>
                  <a
                    href={`tel:${contact.number}`}
                    className="font-mono font-bold text-amber-400 hover:underline min-h-[44px] flex items-center"
                  >
                    {contact.number}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center">
              <HeartPulse className="w-4 h-4 mr-1.5" />
              Health & Hygiene Tips
            </h4>
            <ul className="space-y-1.5 text-sm text-slate-300">
              {safety.healthTips.map((tip, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
