'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { NuvayLogo } from '../ui/NuvayLogo';
import { Compass, Bookmark, Sparkles } from 'lucide-react';
import { getSavedTripsFromLocalStorage } from '@/lib/db/trips';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const trips = getSavedTripsFromLocalStorage();
    setSavedCount(trips.length);
  }, [pathname]);

  return (
    <header className="sticky top-4 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Floating 76px Glassmorphism Navbar with 32px Border Radius & Soft Orange Glow */}
      <div className="w-full h-[76px] px-6 rounded-[32px] bg-[#05070A]/85 backdrop-blur-[24px] border border-white/[0.08] shadow-[0_0_35px_rgba(255,122,0,0.18)] flex items-center justify-between transition-all duration-300">
        
        {/* Primary Website Logo (52x52 Squircle Icon + Exact N U V Ʌ Y Wordmark) */}
        <NuvayLogo variant="primary" />

        {/* Navigation Links & Subtle Status Pill */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link
            href="/planner"
            className={`flex items-center space-x-2 text-sm font-semibold transition-colors ${
              pathname === '/planner' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-[#FF7A00]" />
            <span>Journey Planner</span>
          </Link>

          <Link
            href="/saved"
            className={`flex items-center space-x-2 text-sm font-semibold transition-colors relative ${
              pathname === '/saved' ? 'text-amber-400 font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#FF7A00]" />
            <span>Saved Trips</span>
            {savedCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-[#FF7A00]/20 text-amber-400 border border-[#FF7A00]/30">
                {savedCount}
              </span>
            )}
          </Link>

          <Link
            href="/branding"
            className={`flex items-center space-x-2 text-sm font-semibold transition-colors ${
              pathname === '/branding' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Brand System</span>
          </Link>

          {/* Subtle Low-Contrast Glass Status Pill */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.06]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Journey Planner</span>
          </div>
        </nav>

        {/* CTA Button: #FFB000 -> #FF7A00 Full Pill with Soft Glow */}
        <div className="flex items-center space-x-3">
          <motion.div whileHover={{ y: -2, scale: 1.03 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/planner"
              className="min-h-[48px] px-6 py-2.5 rounded-full text-sm font-black text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] shadow-[0_0_25px_rgba(255,122,0,0.5)] flex items-center space-x-2 tracking-wide"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Plan Trip</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
};
