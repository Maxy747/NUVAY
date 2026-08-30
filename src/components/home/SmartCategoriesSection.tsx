'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryItem {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
}

const SMART_CATEGORIES: CategoryItem[] = [
  { id: 'c1', label: 'IV Trips', emoji: '🎒', prompt: 'College IV trip for 30 students under ₹20,000 for 4 days.' },
  { id: 'c2', label: 'Weekend', emoji: '⚡', prompt: 'Quick 2-day weekend getaway starting from Mangalore or Bangalore.' },
  { id: 'c3', label: 'Solo', emoji: '🧭', prompt: 'Solo backpacker trip for 3 days with peaceful cafes and mountain treks.' },
  { id: 'c4', label: 'Hidden Spots', emoji: '🌲', prompt: 'Hidden waterfalls and offbeat nature trails near Western Ghats.' },
  { id: 'c5', label: 'Festivals', emoji: '🛕', prompt: 'Cultural festival trail to experience Theyyam or local temple rituals.' },
  { id: 'c6', label: 'Luxury', emoji: '💎', prompt: 'Luxury resort and homestay weekend with private infinity pool and spa.' },
  { id: 'c7', label: 'Adventure', emoji: '⛰️', prompt: 'High peak trekking, 4x4 jeep safari, and white water river rafting.' },
  { id: 'c8', label: 'Budget', emoji: '💰', prompt: 'Budget friendly 3-day road trip under ₹12,000 per group.' },
];

export const SmartCategoriesSection: React.FC = () => {
  const router = useRouter();

  const handleSelectCategory = (cat: CategoryItem) => {
    router.push(`/planner?prompt=${encodeURIComponent(cat.prompt)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/20 text-amber-400 flex items-center justify-center border border-[#FF7A00]/30">
            <SlidersHorizontal className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Smart Categories
            </h2>
            <p className="text-xs text-slate-400 font-medium">Filter by travel style and intent</p>
          </div>
        </div>
      </div>

      {/* Glass Pill Tags Grid */}
      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {SMART_CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, delay: idx * 0.04 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => handleSelectCategory(cat)}
            className="min-h-[48px] px-5 py-2.5 rounded-full bg-[#050A18]/90 backdrop-blur-xl border border-white/10 hover:border-[#FF7A00]/50 text-sm font-bold text-slate-200 hover:text-white flex items-center space-x-2.5 shadow-lg group transition-all"
          >
            <span className="text-base group-hover:scale-110 transition-transform">{cat.emoji}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
