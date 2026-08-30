'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NuvayLogo } from '@/components/ui/NuvayLogo';
import { NuvayWordmark } from '@/components/ui/NuvayWordmark';
import { Compass, Bookmark, Sparkles, Download, CheckCircle } from 'lucide-react';

export default function BrandingPresentationPage() {
  return (
    <div className="min-h-screen bg-[#05070A] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Radial Glow Halos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF7A00]/20 via-[#FFB000]/10 to-transparent rounded-full blur-[160px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#FF7A00]/10 rounded-full blur-[140px] pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-16 py-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/30 text-amber-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
            <span>NUVAY Brand Design System</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Official Logo & Navbar Architecture
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-medium">
            Apple App Store × Nothing OS × Arc Search Luxury Aesthetic
          </p>
        </div>

        {/* 1. Large Primary Website Logo Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-10 sm:p-16 rounded-[40px] bg-slate-950/80 border border-white/[0.08] backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF7A00]/15 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 relative z-10">
            {/* Transparent Isolated N Squircle Logo Icon with Amber Glow */}
            <img
              src="/nuvay-logo-1024.png"
              alt="NUVAY 1024x1024 Transparent Logo Icon"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-[0_0_35px_rgba(255,122,0,0.65)]"
            />

            {/* Exact Wordmark Typography N U V Ʌ Y */}
            <NuvayWordmark size="xl" />
          </div>

          <p className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-widest pt-4">
            Primary Website Logo — Isolated Transparent N Squircle + Original Wordmark
          </p>
        </motion.div>

        {/* 2. Glassmorphism Navbar Mockup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              Live Glassmorphism Navbar Mockup (76px Height, 32px Radius)
            </span>
          </div>

          <div className="w-full h-[76px] px-6 rounded-[32px] bg-[#05070A]/85 backdrop-blur-[24px] border border-white/[0.08] shadow-[0_0_35px_rgba(255,122,0,0.18)] flex items-center justify-between">
            {/* Left: Primary Logo */}
            <NuvayLogo variant="primary" />

            {/* Center: Nav Items */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
                <Compass className="w-4 h-4 text-[#FF7A00]" />
                <span>Journey Planner</span>
              </div>

              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
                <Bookmark className="w-4 h-4 text-[#FF7A00]" />
                <span>Saved Trips</span>
              </div>

              {/* Status Pill */}
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-400 bg-white/[0.04] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.06]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AI Engine Active</span>
              </div>
            </div>

            {/* Right: Orange Gradient Pill CTA */}
            <div className="px-6 py-2.5 rounded-full text-sm font-black text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] shadow-[0_0_25px_rgba(255,122,0,0.5)] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Plan Trip</span>
            </div>
          </div>
        </motion.div>

        {/* 3. Export Resolutions & Variants Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {/* 1024x1024 High-Res Logo Card */}
          <div className="bg-slate-950/80 rounded-3xl border border-white/[0.08] p-6 flex flex-col items-center justify-between h-72 shadow-xl relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 bg-[#FF7A00]/20 rounded-full blur-xl pointer-events-none"></div>
            <img
              src="/nuvay-logo-1024.png"
              alt="1024x1024 Logo"
              className="w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(255,122,0,0.5)]"
            />
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                1024×1024 PNG (Transparent)
              </span>
              <a
                href="/nuvay-logo-1024.png"
                download="nuvay-logo-1024.png"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </a>
            </div>
          </div>

          {/* 512x512 App Icon Card */}
          <div className="bg-slate-950/80 rounded-3xl border border-white/[0.08] p-6 flex flex-col items-center justify-between h-72 shadow-xl">
            <img
              src="/nuvay-logo-512.png"
              alt="512x512 App Icon"
              className="w-20 h-20 object-contain drop-shadow-[0_0_25px_rgba(255,122,0,0.5)]"
            />
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                512×512 App Icon PNG
              </span>
              <a
                href="/nuvay-logo-512.png"
                download="nuvay-logo-512.png"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </a>
            </div>
          </div>

          {/* 256x256 Favicon Ready Card */}
          <div className="bg-slate-950/80 rounded-3xl border border-white/[0.08] p-6 flex flex-col items-center justify-between h-72 shadow-xl">
            <img
              src="/nuvay-logo-256.png"
              alt="256x256 Favicon"
              className="w-16 h-16 object-contain drop-shadow-[0_0_20px_rgba(255,122,0,0.5)]"
            />
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 block">
                256×256 Favicon PNG
              </span>
              <a
                href="/nuvay-logo-256.png"
                download="nuvay-logo-256.png"
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-slate-900 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </a>
            </div>
          </div>
        </motion.div>

        {/* Verification Checklist Banner */}
        <div className="p-6 rounded-3xl bg-slate-950/60 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-100 block">Transparent Background Export Verified</span>
              <span className="text-slate-400">Mountain, backpacker, river, sunset, sailboat, compass, and arrow details preserved 100%.</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20">
            Exported & Active
          </span>
        </div>
      </div>
    </div>
  );
}
