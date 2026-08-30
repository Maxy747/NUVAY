'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Calendar, Users } from 'lucide-react';

interface FeaturedJourney {
  id: string;
  title: string;
  origin: string;
  duration: string;
  budget: string;
  tags: string[];
  image: string;
  prompt: string;
}

const FEATURED_JOURNEYS: FeaturedJourney[] = [
  {
    id: 'f1',
    title: 'Coorg Coffee Estates & Waterfalls Trek',
    origin: 'From Mangalore',
    duration: '4 Days',
    budget: '₹20,000',
    tags: ['Nature', 'Off-Roading', 'Coffee Estates'],
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.',
  },
  {
    id: 'f2',
    title: 'Gokarna Coastal & Cliff Beach Trail',
    origin: 'From Udupi / Mangalore',
    duration: '4 Days',
    budget: '₹22,000',
    tags: ['Beach Trek', 'Sunset Cafes', 'Seafood'],
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹22,000, 4 days, 4 friends, starting from Mangalore to Gokarna for beach treks and seafood.',
  },
  {
    id: 'f3',
    title: 'Wayanad Mountain & Cave Trail',
    origin: 'From Kozhikode / Mysore',
    duration: '3 Days',
    budget: '₹18,000',
    tags: ['Mountains', 'Ziplining', 'Spice Trails'],
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹18,000, 3 days, couple trip from Mysore to Wayanad with mist, mountains and resort stay.',
  },
];

export const FeaturedCarousel: React.FC = () => {
  const router = useRouter();

  const handleSelect = (prompt: string) => {
    router.push(`/planner?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Curated Expeditions
            </h2>
            <p className="text-xs text-slate-400 font-medium">Handpicked itineraries ready to generate</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Carousel ➔
        </span>
      </div>

      <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory py-2 pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {FEATURED_JOURNEYS.map((dest, idx) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => handleSelect(dest.prompt)}
            className="snap-start shrink-0 w-[290px] sm:w-[340px] bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-xl text-[11px] font-bold bg-slate-950/85 backdrop-blur-md text-amber-400 border border-slate-800">
                    {dest.origin}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                  <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800">
                    {dest.duration}
                  </span>
                  <span className="text-sm font-black text-amber-400 bg-slate-950/90 px-3 py-1 rounded-xl border border-amber-500/30">
                    {dest.budget}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                  {dest.title}
                </h3>

                <div className="flex flex-wrap gap-1.5">
                  {dest.tags.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 pb-5 pt-0">
              <motion.button
                whileTap={{ scale: 0.94 }}
                className="w-full py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-amber-400 min-h-[48px]"
              >
                <span>Explore Plan</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
