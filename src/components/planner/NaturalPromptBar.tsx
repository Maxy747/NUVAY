'use client';

import React, { useState } from 'react';
import { Sparkles, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { TripRequest } from '@/lib/ai/types';

interface NaturalPromptBarProps {
  onSubmitPrompt: (promptText: string) => void;
  onOpenPreferences: () => void;
  initialPrompt?: string;
}

const EXAMPLE_PROMPTS = [
  "I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.",
  "₹35,000 couple getaway for 5 days starting from Bangalore with beach, sunsets, and luxury homestay.",
  "₹15,000 solo backpacker trek for 3 days starting from Mysore with waterfalls and peaceful cafe vibes.",
  "₹50,000 family trip for 6 days starting from Kochi to hill stations, tea gardens and boat cruise."
];

export const NaturalPromptBar: React.FC<NaturalPromptBarProps> = ({
  onSubmitPrompt,
  onOpenPreferences,
  initialPrompt = '',
}) => {
  const [promptText, setPromptText] = useState(initialPrompt);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;
    onSubmitPrompt(promptText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 opacity-30 group-hover:opacity-60 blur-lg transition duration-300"></div>

        <div className="relative flex flex-col sm:flex-row items-center bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-amber-500/30 p-2 sm:p-2.5 shadow-2xl">
          <div className="flex items-center w-full pl-3 sm:pl-4 pr-2 py-2 sm:py-0">
            <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mr-3 animate-pulse" />
            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Describe your trip naturally... e.g. ₹20k, 4 days, 3 friends from Mangalore for nature & food"
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0 justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0 mt-1 sm:mt-0">
            <button
              type="button"
              onClick={onOpenPreferences}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/80 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Custom Filters</span>
            </button>

            <button
              type="submit"
              disabled={!promptText.trim()}
              className="flex items-center space-x-2 px-6 py-3 font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 rounded-xl orange-glow-sm hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Generate Trip</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* Example Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 shrink-0">
          Try Examples:
        </span>
        {EXAMPLE_PROMPTS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setPromptText(sample);
              onSubmitPrompt(sample);
            }}
            className="text-xs text-slate-300 hover:text-amber-400 bg-slate-900/60 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-800 hover:border-amber-500/40 transition-all text-left truncate max-w-xs sm:max-w-md"
          >
            "{sample}"
          </button>
        ))}
      </div>
    </div>
  );
};
