'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Compass, Clock, ArrowRight, Play, Sparkles } from 'lucide-react';
import { getSavedTripsFromLocalStorage } from '@/lib/db/trips';
import { TripPlan } from '@/lib/ai/types';

interface SavedSession {
  id: string;
  title: string;
  destination: string;
  lastEdited: string;
  progress: number;
  image: string;
  prompt: string;
}

const DEFAULT_SESSIONS: SavedSession[] = [
  {
    id: 's1',
    title: 'Coorg IV Expedition',
    destination: 'Coorg (Kodagu), Karnataka',
    lastEdited: '2 hours ago',
    progress: 70,
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.',
  },
  {
    id: 's2',
    title: 'Gokarna Weekend Coastal Trail',
    destination: 'Gokarna Beach, Karnataka',
    lastEdited: 'Yesterday',
    progress: 100,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹22,000, 4 days, 4 friends, starting from Mangalore to Gokarna for beach treks and seafood.',
  },
  {
    id: 's3',
    title: 'Wayanad Mountain Draft',
    destination: 'Wayanad, Kerala',
    lastEdited: '3 days ago',
    progress: 45,
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹18,000, 3 days, couple trip from Mysore to Wayanad with mist, mountains and resort stay.',
  },
];

export const PreviousPlanningCarousel: React.FC = () => {
  const router = useRouter();
  const [sessions, setSessions] = useState<SavedSession[]>(DEFAULT_SESSIONS);

  useEffect(() => {
    const saved = getSavedTripsFromLocalStorage();
    if (saved && saved.length > 0) {
      const mapped: SavedSession[] = saved.map((t, idx) => ({
        id: t.id,
        title: t.title,
        destination: t.destination,
        lastEdited: idx === 0 ? 'Recently' : `${idx + 1}d ago`,
        progress: 85 - idx * 10,
        image: DEFAULT_SESSIONS[idx % DEFAULT_SESSIONS.length].image,
        prompt: `I have ₹${t.requestedBudget.toLocaleString()}, ${t.durationDays} days, ${t.travelersCount} ${t.travelerType.toLowerCase()}, starting from ${t.origin}.`,
      }));
      setSessions(mapped);
    }
  }, []);

  const handleResume = (session: SavedSession) => {
    router.push(`/planner?prompt=${encodeURIComponent(session.prompt)}`);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/20 text-amber-400 flex items-center justify-center border border-[#FF7A00]/30 shadow-[0_0_12px_rgba(255,122,0,0.3)]">
            <Compass className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Continue Your Journey
            </h2>
            <p className="text-xs text-slate-400 font-medium">Resume your active AI planning sessions</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-[#FF7A00]/10 px-3 py-1.5 rounded-full border border-[#FF7A00]/20">
          {sessions.length} Saved
        </span>
      </div>

      {/* Horizontal Snap Scroll Cards */}
      <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory py-2 pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {sessions.map((session, idx) => {
          const circumference = 2 * Math.PI * 18;
          const strokeDashoffset = circumference - (session.progress / 100) * circumference;

          return (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={() => handleResume(session)}
              className="snap-start shrink-0 w-[290px] sm:w-[340px] bg-[#050A18]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] p-5 flex flex-col justify-between shadow-2xl cursor-pointer group hover:border-[#FF7A00]/40 transition-all"
            >
              <div className="space-y-4">
                {/* Header with Image & SVG Progress Ring */}
                <div className="flex items-center justify-between">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 shrink-0">
                    <img
                      src={session.image}
                      alt={session.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Circular SVG Progress Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3.5"
                        fill="transparent"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="18"
                        stroke="#FF7A00"
                        strokeWidth="3.5"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-amber-400">
                      {session.progress}%
                    </span>
                  </div>
                </div>

                {/* Title & Last Edited */}
                <div className="space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Edited {session.lastEdited}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-1">
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 truncate">
                    {session.destination}
                  </p>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-white/[0.06] mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  {session.progress === 100 ? 'Ready to View' : 'Draft Itinerary'}
                </span>

                <motion.button
                  whileTap={{ scale: 0.92 }}
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#FFB000] to-[#FF7A00] text-slate-950 flex items-center space-x-1.5 shadow-[0_0_15px_rgba(255,122,0,0.4)]"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Resume</span>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
