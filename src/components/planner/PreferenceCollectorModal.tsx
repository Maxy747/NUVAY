'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, IndianRupee, Calendar, Users, MapPin, Sparkles, Compass } from 'lucide-react';
import { TripRequest } from '@/lib/ai/types';

interface PreferenceCollectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPreferences: (preferences: TripRequest) => void;
  initialValues?: TripRequest;
}

const AVAILABLE_VIBES = [
  'Nature', 'Adventure', 'Good Food', 'Beach', 'Culture & Heritage',
  'Waterfalls', 'Off-Roading', 'Relaxation', 'Nightlife', 'Cafes'
];

export const PreferenceCollectorModal: React.FC<PreferenceCollectorModalProps> = ({
  isOpen,
  onClose,
  onApplyPreferences,
  initialValues,
}) => {
  const [budget, setBudget] = useState(initialValues?.budget || 20000);
  const [durationDays, setDurationDays] = useState(initialValues?.durationDays || 4);
  const [travelersCount, setTravelersCount] = useState(initialValues?.travelersCount || 3);
  const [travelerType, setTravelerType] = useState<TripRequest['travelerType']>(initialValues?.travelerType || 'Friends');
  const [origin, setOrigin] = useState(initialValues?.origin || 'Mangalore');
  const [selectedVibes, setSelectedVibes] = useState<string[]>(initialValues?.vibes || ['Nature', 'Adventure', 'Good Food']);
  const [pace, setPace] = useState<TripRequest['pace']>(initialValues?.pace || 'Balanced');

  if (!isOpen) return null;

  const toggleVibe = (vibe: string) => {
    if (selectedVibes.includes(vibe)) {
      setSelectedVibes(selectedVibes.filter(v => v !== vibe));
    } else {
      setSelectedVibes([...selectedVibes, vibe]);
    }
  };

  const handleSave = () => {
    const promptSummary = `I have ₹${budget.toLocaleString()}, ${durationDays} days, ${travelersCount} ${(travelerType || 'Friends').toLowerCase()}, starting from ${origin}. We want ${selectedVibes.join(', ')}.`;

    onApplyPreferences({
      prompt: promptSummary,
      budget,
      currency: '₹',
      durationDays,
      travelersCount,
      travelerType,
      origin,
      vibes: selectedVibes,
      pace,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-amber-500/30 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-amber-500" />
            <h3 className="text-xl font-bold text-slate-100">Trip Preferences Collector</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Starting Origin */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center">
              <MapPin className="w-4 h-4 text-amber-500 mr-1.5" />
              Starting Location / Origin City
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Mangalore, Bangalore, Mumbai, Delhi"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Total Budget Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                <IndianRupee className="w-4 h-4 text-amber-500 mr-1.5" />
                Total Trip Budget (INR)
              </label>
              <span className="text-lg font-black text-amber-400">
                ₹{budget.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={150000}
              step={2500}
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
              <span>₹5,000</span>
              <span>₹50,000</span>
              <span>₹1,50,000+</span>
            </div>
          </div>

          {/* Duration & Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center">
                <Calendar className="w-4 h-4 text-amber-500 mr-1.5" />
                Trip Duration (Days)
              </label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setDurationDays(Math.max(1, durationDays - 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-lg font-bold text-slate-200 hover:bg-slate-700"
                >
                  -
                </button>
                <div className="flex-1 text-center bg-slate-950 border border-slate-800 rounded-xl py-2 font-bold text-slate-100">
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </div>
                <button
                  type="button"
                  onClick={() => setDurationDays(Math.min(14, durationDays + 1))}
                  className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-lg font-bold text-slate-200 hover:bg-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center">
                <Users className="w-4 h-4 text-amber-500 mr-1.5" />
                Travelers & Group Type
              </label>
              <div className="flex items-center space-x-2">
                <select
                  value={travelerType}
                  onChange={(e) => setTravelerType(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="Solo">Solo</option>
                  <option value="Couple">Couple</option>
                  <option value="Friends">Friends</option>
                  <option value="Family">Family</option>
                </select>
                <div className="flex items-center space-x-1 flex-1">
                  <button
                    type="button"
                    onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                    className="w-8 h-10 rounded-xl bg-slate-800 border border-slate-700 font-bold text-slate-200 hover:bg-slate-700"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center bg-slate-950 border border-slate-800 rounded-xl py-2 text-xs font-bold text-slate-100">
                    {travelersCount} Pax
                  </div>
                  <button
                    type="button"
                    onClick={() => setTravelersCount(Math.min(20, travelersCount + 1))}
                    className="w-8 h-10 rounded-xl bg-slate-800 border border-slate-700 font-bold text-slate-200 hover:bg-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Vibes Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center">
              <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
              Travel Vibe & Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_VIBES.map((vibe) => {
                const isSelected = selectedVibes.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleVibe(vibe)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl orange-glow-sm hover:brightness-110"
          >
            Apply & Generate
          </button>
        </div>
      </div>
    </div>
  );
};
