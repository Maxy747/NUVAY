'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, IndianRupee, Sun, ShieldCheck, Check, ArrowRight } from 'lucide-react';

interface NuvayTransformationOverlayProps {
  isVisible: boolean;
  promptText: string;
  targetBudget?: number;
  onComplete: () => void;
}

export const NuvayTransformationOverlay: React.FC<NuvayTransformationOverlayProps> = ({
  isVisible,
  promptText,
  targetBudget = 20000,
  onComplete,
}) => {
  const [stage, setStage] = useState(1);
  const [currentBudget, setCurrentBudget] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setStage(1);
      setCurrentBudget(0);
      return;
    }

    // Stage 1 -> 2: Map & Route (800ms)
    const t1 = setTimeout(() => setStage(2), 800);

    // Stage 2 -> Budget Count Up (1200ms)
    const t2 = setTimeout(() => {
      let val = 0;
      const step = Math.ceil(targetBudget / 20);
      const interval = setInterval(() => {
        val += step;
        if (val >= targetBudget) {
          setCurrentBudget(targetBudget);
          clearInterval(interval);
          setStage(3);
        } else {
          setCurrentBudget(val);
        }
      }, 40);
    }, 1200);

    // Stage 3 -> Day Timeline (2500ms)
    const t3 = setTimeout(() => setStage(4), 2500);

    // Stage 4 -> Morph CTA & Auto Complete (3600ms)
    const t4 = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isVisible, targetBudget, onComplete]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050A18]/95 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-xl bg-slate-950 p-6 sm:p-8 rounded-[36px] border border-[#FF7A00]/30 shadow-[0_0_50px_rgba(255,122,0,0.3)] space-y-6 text-center relative overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF7A00]/20 rounded-full blur-[90px] pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#FFB000] to-[#FF7A00] text-slate-950 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(255,122,0,0.6)]">
            <Sparkles className="w-8 h-8 text-slate-950 animate-spin" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#FF7A00] uppercase tracking-widest block">
              Signature NUVAY Moment
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              AI Crafting Your Journey...
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto truncate font-medium">
              "{promptText}"
            </p>
          </div>

          {/* Animated Stages Box */}
          <div className="space-y-4 pt-2">
            {/* Stage 1: Map Route Line Drawing */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 1 ? 1 : 0.3, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                stage >= 1
                  ? 'bg-slate-900 border-[#FF7A00]/40 shadow-lg'
                  : 'bg-slate-950 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2 text-slate-200">
                  <MapPin className="w-4 h-4 text-[#FF7A00]" />
                  <span>OSRM Route & Coordinates Calculation</span>
                </div>
                {stage >= 1 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                )}
              </div>
            </motion.div>

            {/* Stage 2: Budget Count-Up */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 2 ? 1 : 0.3, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                stage >= 2
                  ? 'bg-slate-900 border-[#FF7A00]/40 shadow-lg'
                  : 'bg-slate-950 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2 text-slate-200">
                  <IndianRupee className="w-4 h-4 text-amber-400" />
                  <span>Itemized Cost Optimization</span>
                </div>
                <span className="font-mono text-amber-400 font-black text-sm">
                  ₹{currentBudget.toLocaleString()}
                </span>
              </div>
            </motion.div>

            {/* Stage 3: Day Timeline Build */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: stage >= 3 ? 1 : 0.3, y: 0 }}
              className={`p-4 rounded-2xl border transition-all ${
                stage >= 3
                  ? 'bg-slate-900 border-[#FF7A00]/40 shadow-lg'
                  : 'bg-slate-950 border-white/[0.06]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <div className="flex items-center space-x-2 text-slate-200">
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Day 1 → Day 2 → Day 3 Non-Repeating Schedules</span>
                </div>
                {stage >= 3 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Morphing CTA Button */}
          <div className="pt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="w-full min-h-[52px] px-6 py-3.5 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(255,122,0,0.6)]"
            >
              <span>{stage >= 4 ? 'Start This Journey' : 'Building Itinerary...'}</span>
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
