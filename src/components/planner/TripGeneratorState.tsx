'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, MapPin, Compass, ShieldCheck, DollarSign, CheckCircle2, Loader2 } from 'lucide-react';

const GENERATION_STEPS = [
  { id: 1, label: 'Parsing natural prompt & trip intent...', icon: Sparkles },
  { id: 2, label: 'Evaluating route options & highway nodes...', icon: MapPin },
  { id: 3, label: 'Optimizing budget allocation across stay, food & activities...', icon: DollarSign },
  { id: 4, label: 'Verifying local safety advisory & emergency helplines...', icon: ShieldCheck },
  { id: 5, label: 'Building day-by-day itinerary & interactive map markers...', icon: Compass },
];

const QUOTES = [
  "“Travel makes one modest. You see what a tiny place you occupy in the world.” — Gustave Flaubert",
  "“Life is either a daring adventure or nothing at all.” — Helen Keller",
  "“The journey of a thousand miles begins with a single step.” — Lao Tzu",
  "“Not all those who wander are lost.” — J.R.R. Tolkien"
];

export const TripGeneratorState: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < GENERATION_STEPS.length ? prev + 1 : prev));
    }, 1200);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 3000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(quoteInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-slate-900/90 rounded-3xl border border-amber-500/30 glass-panel-orange shadow-2xl text-center space-y-8 my-12 animate-in fade-in zoom-in duration-300">
      {/* Animated Glowing Ring */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 animate-ping"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-amber-500 border-r-amber-600 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center orange-glow">
          <Sparkles className="w-8 h-8 text-slate-950 animate-bounce" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-100">
          Crafting Your NUVAY Journey
        </h3>
        <p className="text-sm text-slate-400 font-mono">
          AI Engine Provider: Google Gemini + Geo Routing Service
        </p>
      </div>

      {/* Progress Timeline */}
      <div className="space-y-3 text-left max-w-md mx-auto bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
        {GENERATION_STEPS.map((step) => {
          const isDone = step.id < activeStep;
          const isCurrent = step.id === activeStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center space-x-3 text-sm">
              {isDone ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0"></div>
              )}
              <span
                className={`transition-colors ${
                  isDone
                    ? 'text-slate-400 line-through text-xs'
                    : isCurrent
                    ? 'text-amber-400 font-bold'
                    : 'text-slate-600'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Rotating Travel Quote */}
      <div className="pt-4 border-t border-slate-800/80">
        <p className="text-xs italic text-slate-400 font-serif leading-relaxed px-4">
          {QUOTES[quoteIndex]}
        </p>
      </div>
    </div>
  );
};
