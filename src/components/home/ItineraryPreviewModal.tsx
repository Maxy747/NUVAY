'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Sparkles, Sun, ShieldCheck, IndianRupee, ArrowRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface PrebuiltItem {
  id: string;
  title: string;
  theme: string;
  duration: string;
  budget: string;
  season: string;
  difficulty: 'Easy' | 'Moderate' | 'Active';
  image: string;
  prompt: string;
  days: {
    dayNumber: number;
    title: string;
    highlights: string[];
  }[];
  budgetItems: { item: string; cost: string }[];
}

interface ItineraryPreviewModalProps {
  item: PrebuiltItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ItineraryPreviewModal: React.FC<ItineraryPreviewModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  if (!isOpen || !item) return null;

  const handleGenerateCustom = () => {
    onClose();
    router.push(`/planner?prompt=${encodeURIComponent(item.prompt)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl bg-[#050A18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-slate-950/80 text-slate-300 hover:text-white border border-white/10 flex items-center justify-center min-h-[40px] min-w-[40px]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hero Banner */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/40 to-transparent"></div>

            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-[#FF7A00]/20 text-amber-400 border border-[#FF7A00]/30">
                  {item.duration}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950/80 text-slate-200 border border-white/10 flex items-center space-x-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400 mr-1" />
                  {item.season}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-950/80 text-slate-200 border border-white/10">
                  Difficulty: {item.difficulty}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white">{item.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">{item.theme}</p>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-8 max-h-[60vh] overflow-y-auto">
            {/* Days Timeline */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#FF7A00]" />
                <span>Day-by-Day Journey Overview</span>
              </h3>

              <div className="space-y-3">
                {item.days.map((d) => (
                  <div
                    key={d.dayNumber}
                    className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.06] space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 rounded-lg bg-[#FF7A00]/20 text-amber-400 font-black text-xs flex items-center justify-center border border-[#FF7A00]/30">
                        D{d.dayNumber}
                      </span>
                      <h4 className="font-bold text-slate-200 text-sm">{d.title}</h4>
                    </div>

                    <ul className="pl-9 space-y-1">
                      {d.highlights.map((h, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Itemized Budget Table */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                <IndianRupee className="w-4 h-4 text-[#FF7A00]" />
                <span>Itemized Cost Breakdown</span>
              </h3>

              <div className="bg-slate-900/80 rounded-2xl border border-white/[0.06] p-4 space-y-3">
                <div className="grid grid-cols-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  <span>Expense Item</span>
                  <span className="text-right">Estimated Cost</span>
                </div>

                {item.budgetItems.map((b, idx) => (
                  <div key={idx} className="grid grid-cols-2 text-xs font-medium text-slate-200">
                    <span>{b.item}</span>
                    <span className="text-right font-mono font-bold text-amber-400">{b.cost}</span>
                  </div>
                ))}

                <div className="grid grid-cols-2 text-sm font-black text-white border-t border-slate-800 pt-3">
                  <span>Total Estimated Budget:</span>
                  <span className="text-right text-[#FF7A00]">{item.budget}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Action CTA */}
          <div className="p-6 bg-slate-950 border-t border-white/[0.08] flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">
              Optimized by NUVAY AI Engine
            </span>

            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={handleGenerateCustom}
              className="w-full sm:w-auto min-h-[48px] px-8 py-3 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,122,0,0.5)]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Customize & Generate with AI</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
