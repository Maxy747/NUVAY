'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, X, MapPin, Sparkles, Eye, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LiveStory {
  id: string;
  name: string;
  location: string;
  viewers: string;
  image: string;
  prompt: string;
}

const LIVE_STORIES: LiveStory[] = [
  {
    id: 's1',
    name: 'Theyyam Ritual Live',
    location: 'Kannur, Kerala',
    viewers: '1.4k watching',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'I want a 3-day cultural trail starting from Kozhikode to Kannur for Theyyam ritual performances, temple heritage, and Malabar cuisine.',
  },
  {
    id: 's2',
    name: 'Gokarna Sunset',
    location: 'Kudle Cliff, Gokarna',
    viewers: '2.8k watching',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹22,000, 4 days, 4 friends, starting from Mangalore to Gokarna for beach treks and seafood.',
  },
  {
    id: 's3',
    name: 'Coorg Monsoon Rain',
    location: 'Madikeri Estates',
    viewers: '950 watching',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.',
  },
  {
    id: 's4',
    name: 'Munnar Tea Mist',
    location: 'Top Station, Kerala',
    viewers: '3.1k watching',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹25,000, 4 days, family trip from Kochi to Munnar tea gardens and mist peaks.',
  },
  {
    id: 's5',
    name: 'High Peak Trek',
    location: 'Chikmagalur Peak',
    viewers: '1.1k watching',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹19,500, 3 days, 4 friends starting from Bangalore to Chikmagalur for peak trekking.',
  },
];

export const LiveMomentsSection: React.FC = () => {
  const router = useRouter();
  const [activeStory, setActiveStory] = useState<LiveStory | null>(null);

  const handlePlanStory = (story: LiveStory) => {
    setActiveStory(null);
    router.push(`/planner?prompt=${encodeURIComponent(story.prompt)}`);
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Live Moments
            </h2>
            <p className="text-xs text-slate-400 font-medium">Real-time explorer streams & stories</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>LIVE NOW</span>
        </span>
      </div>

      {/* Story Circles Horizon */}
      <div className="flex space-x-4 overflow-x-auto py-2 pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {LIVE_STORIES.map((story) => (
          <motion.div
            key={story.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setActiveStory(story)}
            className="shrink-0 flex flex-col items-center space-y-2 cursor-pointer group"
          >
            {/* Animated Glowing Ring Container */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FFB000] via-rose-500 to-[#FF7A00] shadow-[0_0_15px_rgba(255,122,0,0.4)]">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden border-2 border-slate-950 bg-slate-900">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* LIVE Badge Pill */}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-md">
                LIVE
              </span>
            </div>

            <div className="text-center w-24">
              <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-amber-400">
                {story.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate block">{story.location}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm sm:max-w-md bg-[#050A18] rounded-3xl border border-white/10 shadow-2xl overflow-hidden my-auto"
            >
              <button
                onClick={() => setActiveStory(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-2xl bg-slate-950/80 text-white border border-white/10 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-96 w-full overflow-hidden">
                <img
                  src={activeStory.image}
                  alt={activeStory.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-transparent to-black/60"></div>

                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="text-xs font-bold text-white bg-rose-600/80 px-2.5 py-1 rounded-full backdrop-blur-md">
                    LIVE STREAM
                  </span>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeStory.location}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">{activeStory.name}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-300">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeStory.viewers}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-950 border-t border-white/10">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  onClick={() => handlePlanStory(activeStory)}
                  className="w-full py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-[#FFB000] to-[#FF7A00] flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(255,122,0,0.5)] min-h-[48px]"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Plan Similar Trip to This Location</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
