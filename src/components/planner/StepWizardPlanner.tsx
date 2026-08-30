'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IndianRupee,
  Calendar,
  Users,
  Sparkles,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Flame,
  SlidersHorizontal,
} from 'lucide-react';
import { TripRequest } from '@/lib/ai/types';

interface StepWizardPlannerProps {
  onGenerate: (requestPayload: TripRequest) => void;
  initialValues?: Partial<TripRequest>;
}

const BUDGET_PRESETS = [15000, 20000, 35000, 50000, 75000];
const DURATION_PRESETS = [2, 3, 4, 5, 7, 10];
const TRAVELER_TYPES: TripRequest['travelerType'][] = ['Solo', 'Couple', 'Friends', 'Family'];
const VIBE_OPTIONS = [
  { label: 'Nature', emoji: '🌲' },
  { label: 'Adventure', emoji: '⛰️' },
  { label: 'Good Food', emoji: '🍱' },
  { label: 'Beach', emoji: '🏖️' },
  { label: 'Culture', emoji: '🛕' },
  { label: 'Waterfalls', emoji: '🌊' },
  { label: 'Relaxation', emoji: '🧘' },
  { label: 'Off-Roading', emoji: '🚜' },
];

const SUGGESTION_PROMPTS = [
  'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.',
  '₹35,000 couple getaway for 5 days starting from Bangalore with beach, sunsets, and luxury homestay.',
  '₹15,000 solo backpacker trek for 3 days starting from Mysore with waterfalls and peaceful cafe vibes.',
];

export const StepWizardPlanner: React.FC<StepWizardPlannerProps> = ({
  onGenerate,
  initialValues,
}) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  // Form State
  const [budget, setBudget] = useState<number>(initialValues?.budget || 20000);
  const [durationDays, setDurationDays] = useState<number>(initialValues?.durationDays || 4);
  const [travelersCount, setTravelersCount] = useState<number>(initialValues?.travelersCount || 3);
  const [travelerType, setTravelerType] = useState<TripRequest['travelerType']>(
    initialValues?.travelerType || 'Friends'
  );
  const [origin, setOrigin] = useState<string>(initialValues?.origin || 'Mangalore');
  const [vibes, setVibes] = useState<string[]>(
    initialValues?.vibes || ['Nature', 'Adventure', 'Good Food']
  );
  const [promptText, setPromptText] = useState<string>(
    initialValues?.prompt ||
      'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.'
  );

  const toggleVibe = (vibeLabel: string) => {
    if (vibes.includes(vibeLabel)) {
      setVibes(vibes.filter((v) => v !== vibeLabel));
    } else {
      setVibes([...vibes, vibeLabel]);
    }
  };

  const nextStep = () => {
    if (step < 5) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    // Generate summarized natural prompt if prompt text is default or unedited
    const finalPrompt = promptText.trim()
      ? promptText
      : `I have ₹${budget.toLocaleString()}, ${durationDays} days, ${travelersCount} ${(travelerType || 'Friends').toLowerCase()}, starting from ${origin}. We want ${vibes.join(', ')}.`;

    onGenerate({
      prompt: finalPrompt,
      budget,
      currency: '₹',
      durationDays,
      travelersCount,
      travelerType,
      origin,
      vibes,
      pace: 'Balanced',
      accommodationType: budget < 15000 ? 'Budget' : budget < 35000 ? 'Homestay' : 'Boutique',
    });
  };

  // Sync prompt text automatically when step attributes change
  const updateSummaryPrompt = (
    newBudget: number = budget,
    newDays: number = durationDays,
    newPax: number = travelersCount,
    newOrigin: string = origin,
    newVibes: string[] = vibes
  ) => {
    setPromptText(
      `I have ₹${newBudget.toLocaleString()}, ${newDays} days, ${newPax} ${(travelerType || 'Friends').toLowerCase()}, starting from ${newOrigin}. We want ${newVibes.join(', ')}.`
    );
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 40 : -40,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Wizard Step Progress Header */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-amber-500/20 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center border border-amber-500/30">
              {step}/5
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-100">
              {step === 1 && 'Set Your Budget'}
              {step === 2 && 'Trip Duration'}
              {step === 3 && 'Travel Group'}
              {step === 4 && 'Travel Style & Vibes'}
              {step === 5 && 'AI Prompt & Confirm'}
            </h2>
          </div>

          <span className="text-xs font-mono text-amber-400 font-semibold">
            {step === 1 && 'Step 1 of 5'}
            {step === 2 && 'Step 2 of 5'}
            {step === 3 && 'Step 3 of 5'}
            {step === 4 && 'Step 4 of 5'}
            {step === 5 && 'Final Step'}
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full"
            initial={{ width: '20%' }}
            animate={{ width: `${(step / 5) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content Container */}
      <div className="relative bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-amber-500/20 shadow-2xl min-h-[380px] flex flex-col justify-between overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-6 flex-1 flex flex-col justify-between"
          >
            {/* STEP 1: BUDGET */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1">
                    <IndianRupee className="w-4 h-4 text-amber-500 mr-1.5" />
                    Total Trip Budget (INR)
                  </label>
                  <p className="text-xs text-slate-400">Select or slide your estimated budget.</p>
                </div>

                <div className="text-center py-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                  <span className="text-3xl sm:text-4xl font-black text-amber-400">
                    ₹{budget.toLocaleString()}
                  </span>
                  <span className="block text-[11px] font-mono text-slate-400 mt-1">
                    Per group total estimate
                  </span>
                </div>

                {/* Quick Budget Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Selection Chips:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {BUDGET_PRESETS.map((b) => (
                      <motion.button
                        key={b}
                        whileTap={{ scale: 0.94 }}
                        type="button"
                        onClick={() => {
                          setBudget(b);
                          updateSummaryPrompt(b);
                        }}
                        className={`min-h-[48px] px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                          budget === b
                            ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        ₹{b.toLocaleString()}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Range Slider */}
                <div>
                  <input
                    type="range"
                    min={5000}
                    max={150000}
                    step={2500}
                    value={budget}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setBudget(val);
                      updateSummaryPrompt(val);
                    }}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: DURATION */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1">
                    <Calendar className="w-4 h-4 text-amber-500 mr-1.5" />
                    Trip Duration (Days)
                  </label>
                  <p className="text-xs text-slate-400">Choose how many days your journey lasts.</p>
                </div>

                <div className="flex items-center justify-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => {
                      const d = Math.max(1, durationDays - 1);
                      setDurationDays(d);
                      updateSummaryPrompt(budget, d);
                    }}
                    className="w-12 h-12 rounded-2xl bg-slate-800 text-2xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 min-h-[48px] min-w-[48px]"
                  >
                    -
                  </motion.button>
                  <div className="text-center min-w-[120px]">
                    <span className="text-3xl font-black text-amber-400">{durationDays}</span>
                    <span className="block text-xs font-bold text-slate-300">
                      {durationDays === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => {
                      const d = Math.min(14, durationDays + 1);
                      setDurationDays(d);
                      updateSummaryPrompt(budget, d);
                    }}
                    className="w-12 h-12 rounded-2xl bg-slate-800 text-2xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 min-h-[48px] min-w-[48px]"
                  >
                    +
                  </motion.button>
                </div>

                {/* Quick Duration Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Preset Duration Chips:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {DURATION_PRESETS.map((d) => (
                      <motion.button
                        key={d}
                        whileTap={{ scale: 0.94 }}
                        type="button"
                        onClick={() => {
                          setDurationDays(d);
                          updateSummaryPrompt(budget, d);
                        }}
                        className={`min-h-[48px] px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                          durationDays === d
                            ? 'bg-amber-500 text-slate-950 border border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {d} Days
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: TRAVELERS */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1">
                    <Users className="w-4 h-4 text-amber-500 mr-1.5" />
                    Travel Group Type & Size
                  </label>
                  <p className="text-xs text-slate-400">Who is going on this trip?</p>
                </div>

                {/* Group Type Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Traveler Type:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {TRAVELER_TYPES.map((type) => (
                      <motion.button
                        key={type}
                        whileTap={{ scale: 0.94 }}
                        type="button"
                        onClick={() => {
                          setTravelerType(type);
                          const count = type === 'Solo' ? 1 : type === 'Couple' ? 2 : travelersCount;
                          setTravelersCount(count);
                          updateSummaryPrompt(budget, durationDays, count);
                        }}
                        className={`min-h-[48px] px-4 py-3 rounded-2xl text-sm font-bold flex items-center justify-between border transition-all ${
                          travelerType === type
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{type}</span>
                        {travelerType === type && <Check className="w-4 h-4" />}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Pax Stepper */}
                <div className="flex items-center justify-between bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                  <span className="text-sm font-bold text-slate-300">Total Travelers (Pax)</span>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => {
                        const count = Math.max(1, travelersCount - 1);
                        setTravelersCount(count);
                        updateSummaryPrompt(budget, durationDays, count);
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-800 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
                    >
                      -
                    </motion.button>
                    <span className="text-lg font-black text-amber-400 min-w-[32px] text-center">
                      {travelersCount}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      type="button"
                      onClick={() => {
                        const count = Math.min(20, travelersCount + 1);
                        setTravelersCount(count);
                        updateSummaryPrompt(budget, durationDays, count);
                      }}
                      className="w-10 h-10 rounded-xl bg-slate-800 text-xl font-bold text-slate-200 border border-slate-700 flex items-center justify-center shrink-0 min-h-[44px] min-w-[44px]"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: VIBES */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1">
                    <Sparkles className="w-4 h-4 text-amber-500 mr-1.5" />
                    Travel Style & Interest Vibes
                  </label>
                  <p className="text-xs text-slate-400">Select one or more interest tags.</p>
                </div>

                <div className="flex flex-wrap gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {VIBE_OPTIONS.map((item) => {
                    const isSelected = vibes.includes(item.label);
                    return (
                      <motion.button
                        key={item.label}
                        whileTap={{ scale: 0.94 }}
                        type="button"
                        onClick={() => {
                          const updated = isSelected
                            ? vibes.filter((v) => v !== item.label)
                            : [...vibes, item.label];
                          setVibes(updated);
                          updateSummaryPrompt(budget, durationDays, travelersCount, origin, updated);
                        }}
                        className={`min-h-[48px] px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center space-x-2 border transition-all ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                            : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span>{item.emoji}</span>
                        <span>{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: PROMPT & CONFIRM */}
            {step === 5 && (
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center mb-1">
                    <MapPin className="w-4 h-4 text-amber-500 mr-1.5" />
                    Starting Origin & AI Prompt
                  </label>
                  <p className="text-xs text-slate-400">Confirm origin and natural language request.</p>
                </div>

                {/* Origin Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Starting Location / Origin City:
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      updateSummaryPrompt(budget, durationDays, travelersCount, e.target.value);
                    }}
                    placeholder="e.g. Mangalore, Bangalore, Mumbai"
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-base text-slate-100 focus:outline-none focus:border-amber-500 min-h-[48px]"
                  />
                </div>

                {/* Natural Language Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Custom Prompt (Editable):
                  </label>
                  <textarea
                    rows={3}
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-base text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>

                {/* Quick Examples */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center">
                    <Flame className="w-3.5 h-3.5 text-amber-500 mr-1" />
                    Try Preset Prompt Examples:
                  </span>
                  <div className="flex flex-col space-y-1.5 max-h-28 overflow-y-auto">
                    {SUGGESTION_PROMPTS.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPromptText(sample)}
                        className="text-left text-xs text-slate-300 hover:text-amber-400 bg-slate-950 p-2 rounded-xl border border-slate-800 hover:border-amber-500/40 truncate"
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Wizard Controls Footer */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4 mt-6">
          {step > 1 ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={prevStep}
              className="min-h-[48px] px-4 py-2.5 rounded-2xl font-bold text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center space-x-2 border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={nextStep}
              className="min-h-[48px] px-6 py-2.5 rounded-2xl font-bold text-sm text-slate-950 bg-amber-500 hover:bg-amber-400 flex items-center space-x-2 shadow-[0_0_20px_rgba(245,158,11,0.4)] ml-auto"
            >
              <span>Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={handleFinish}
              className="min-h-[48px] px-6 py-3 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:brightness-110 flex items-center space-x-2 shadow-[0_0_25px_rgba(245,158,11,0.6)] ml-auto"
            >
              <Sparkles className="w-5 h-5" />
              <span>Generate Journey</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
