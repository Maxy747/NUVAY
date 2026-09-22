'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TripPlan } from '@/lib/ai/types';
import { Bookmark, Share2, Printer, MapPin, Calendar, Users, Sparkles, CheckCircle } from 'lucide-react';
import { saveTripToLocalStorage } from '@/lib/db/trips';
import { copyTripLink } from '@/lib/tripLinks';

interface TripHeaderProps {
  plan: TripPlan;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ plan }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  const handleSave = () => {
    saveTripToLocalStorage(plan);
    setIsSaved(true);
  };

  const handleShare = async () => {
    setCopied(false);
    setShareStatus('');
    try {
      if (!navigator.clipboard) throw new Error('Clipboard access is unavailable in this browser.');
      await copyTripLink(plan.id, window.location.origin, fetch, text => navigator.clipboard.writeText(text));
      setCopied(true);
      setShareStatus('Link copied. Anyone with it can view this trip. Links are temporary and may expire within 24 hours or when the server restarts.');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setShareStatus(error instanceof Error ? error.message : 'Could not copy the trip link.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const budgetDiff = Math.abs(plan.totalBudgetEstimate - plan.requestedBudget);
  const matchPct = Math.max(70, Math.min(99, Math.round(100 - (budgetDiff / plan.requestedBudget) * 100)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NUVAY AI Personalised Journey</span>
            </span>

            <span className="px-3 py-1.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {matchPct}% Budget Match
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-100 tracking-tight leading-tight">
            {plan.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-200/90 italic font-serif">
            "{plan.tagline}"
          </p>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-slate-300 pt-2">
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>{plan.destination}</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>{plan.durationDays} Days / {plan.durationDays - 1} Nights</span>
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-950/80 px-3.5 py-2 rounded-2xl border border-slate-800">
              <Users className="w-4 h-4 text-amber-500" />
              <span>{plan.travelersCount} Travelers ({plan.travelerType})</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2.5 shrink-0 pt-2 md:pt-0">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleSave}
            className={`min-h-[48px] flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
              isSaved
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>{isSaved ? 'Saved' : 'Save Trip'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handleShare}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center p-3 rounded-2xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Copy Trip Link"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-500" />}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={handlePrint}
            className="min-h-[48px] min-w-[48px] flex items-center justify-center p-3 rounded-2xl text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
            title="Print / Save PDF"
          >
            <Printer className="w-4 h-4 text-amber-500" />
          </motion.button>
        </div>
      </div>
      {shareStatus && <p role="status" className="mt-3 text-xs text-slate-300">{shareStatus}</p>}
    </motion.div>
  );
};
