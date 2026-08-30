'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { PreviousPlanningCarousel } from '@/components/home/PreviousPlanningCarousel';
import { PrebuiltItinerariesSection } from '@/components/home/PrebuiltItinerariesSection';
import { LiveMomentsSection } from '@/components/home/LiveMomentsSection';
import { SmartCategoriesSection } from '@/components/home/SmartCategoriesSection';
import { TrendingCarousel } from '@/components/home/TrendingCarousel';
import { FeaturedCarousel } from '@/components/home/FeaturedCarousel';
import { NuvayTransformationOverlay } from '@/components/planner/NuvayTransformationOverlay';
import { Sparkles, Compass, Mic, ArrowRight, Search, ShieldCheck, Wallet, Route } from 'lucide-react';

// Dynamic client-only import for 3D Three.js WebGL Background (SSR: false)
const LivingUIBackground = dynamic(
  () => import('@/components/home/LivingUIBackground').then((m) => m.LivingUIBackground),
  { ssr: false }
);

export default function LandingPage() {
  const router = useRouter();
  const [promptText, setPromptText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [activeTargetPrompt, setActiveTargetPrompt] = useState('');

  const PROMPT_SUGGESTIONS = [
    'Hidden waterfalls near Coorg',
    'College IV under ₹20k',
    'Solo weekend from Mangalore',
    'Theyyam experience',
  ];

  const handleStartTrip = (text: string) => {
    if (!text.trim()) return;
    setActiveTargetPrompt(text);
    setIsTransforming(true);
  };

  const handleTransformationComplete = () => {
    setIsTransforming(false);
    router.push(`/planner?prompt=${encodeURIComponent(activeTargetPrompt)}`);
  };

  const toggleVoiceInput = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      setPromptText('College IV for 30 students under ₹20,000');
    }
  };

  return (
    <div className="relative space-y-14 sm:space-y-20 pb-24 overflow-hidden">
      {/* 3D WebGL Living UI Background (Client Only) */}
      <LivingUIBackground />

      {/* Signature NUVAY Moment Animated Transformation Overlay */}
      <NuvayTransformationOverlay
        isVisible={isTransforming}
        promptText={activeTargetPrompt}
        targetBudget={20000}
        onComplete={handleTransformationComplete}
      />

      {/* 1. HERO SECTION (Above the Fold) */}
      <section className="relative pt-6 sm:pt-12 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Brand Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-[#050A18]/90 backdrop-blur-md border border-[#FF7A00]/30 text-amber-400 text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,122,0,0.2)]"
        >
          <Sparkles className="w-4 h-4 text-[#FF7A00] animate-pulse" />
          <span>Next-Generation AI Travel OS</span>
        </motion.div>

        {/* Headline: "Where next?" */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-5xl sm:text-7xl lg:text-8xl font-black text-slate-100 tracking-tight leading-[1.05] max-w-4xl mx-auto"
        >
          Where <span className="text-[#FF7A00] drop-shadow-[0_0_25px_rgba(255,122,0,0.5)]">next?</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 max-w-xl mx-auto font-medium leading-relaxed"
        >
          AI-powered journeys crafted for you.
        </motion.p>

        {/* Glass AI Search Card with Voice Input & Send Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="pt-2 max-w-3xl mx-auto space-y-4"
        >
          <div className="relative p-2.5 sm:p-3 rounded-[32px] bg-[#050A18]/85 backdrop-blur-[24px] border border-white/10 shadow-[0_0_35px_rgba(255,122,0,0.2)] flex items-center gap-2 sm:gap-3">
            <Search className="w-5 h-5 text-amber-500 shrink-0 ml-3 hidden sm:block" />

            <input
              type="text"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleStartTrip(promptText)}
              placeholder="Describe your trip... e.g. ₹20k, 4 days, 3 friends from Mangalore"
              className="w-full bg-transparent border-none text-base sm:text-lg font-medium text-slate-100 placeholder-slate-400 focus:outline-none px-2 min-h-[48px]"
            />

            {/* Voice Input Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={toggleVoiceInput}
              title="Voice Search"
              className={`p-3 rounded-2xl border transition-all shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                isVoiceActive
                  ? 'bg-rose-600 text-white border-rose-400 animate-pulse'
                  : 'bg-slate-900 text-slate-300 hover:text-white border-white/10'
              }`}
            >
              <Mic className="w-4 h-4" />
            </motion.button>

            {/* Send CTA Button */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              type="button"
              onClick={() => handleStartTrip(promptText || 'College IV for 30 students under ₹20,000')}
              className="px-6 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] shadow-[0_0_20px_rgba(255,122,0,0.5)] flex items-center space-x-2 shrink-0 min-h-[48px]"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Generate</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </motion.button>
          </div>

          {/* Preset Suggestion Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Try Prompts:
            </span>
            {PROMPT_SUGGESTIONS.map((chip, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.94 }}
                type="button"
                onClick={() => handleStartTrip(chip)}
                className="text-xs font-semibold text-slate-300 hover:text-amber-400 bg-[#050A18]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 hover:border-[#FF7A00]/40 transition-colors"
              >
                "{chip}"
              </motion.button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 2. PREVIOUS PLANNING ("Continue Your Journey") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PreviousPlanningCarousel />
      </section>

      {/* 3. PREBUILT ITINERARIES ("Ready-to-Go Itineraries") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PrebuiltItinerariesSection />
      </section>

      {/* 4. LIVE MOMENTS ("Stories Feature") */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LiveMomentsSection />
      </section>

      {/* 5. SMART CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SmartCategoriesSection />
      </section>

      {/* 6. TRENDING THIS WEEK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrendingCarousel />
      </section>

      {/* 7. CURATED EXPEDITIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FeaturedCarousel />
      </section>

      {/* Core OS Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Travel Operating System Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Pure travel intelligence with zero affiliate markup or fake pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#050A18]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">AI Itinerary Engine</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Gemini intelligence generating dynamic, non-repeating day-by-day activity schedules.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#050A18]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-amber-400 flex items-center justify-center">
              <Route className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">OSRM Route Maps</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              OpenStreetMap and OSRM integration with dynamic driving distances and waypoints.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#050A18]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-amber-400 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Itemized Budgeting</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Transparent cost breakdowns across transportation, stay, food, activities, and contingency.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-[#050A18]/90 backdrop-blur-xl p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#FF7A00]" />
            </div>
            <h3 className="font-bold text-slate-100 text-lg">Safety Index</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Safety scores, local emergency helplines, health tips, and weather advisories per destination.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
