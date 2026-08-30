'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MapPin, Star, Heart, Flame, ArrowRight } from 'lucide-react';

interface TrendingDestination {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviewsCount: number;
  priceTag: string;
  duration: string;
  image: string;
  prompt: string;
}

const TRENDING_DESTINATIONS: TrendingDestination[] = [
  {
    id: 't1',
    title: 'Coorg Coffee Estates & Mist Trail',
    location: 'Madikeri, Karnataka',
    rating: 4.9,
    reviewsCount: 342,
    priceTag: '₹20,000 / group',
    duration: '4 Days',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹20,000, 4 days, 3 friends, starting from Mangalore. We want nature, adventure and good food.',
  },
  {
    id: 't2',
    title: 'Gokarna Kudle Cliff & Beach Trek',
    location: 'Gokarna, Coast',
    rating: 4.8,
    reviewsCount: 512,
    priceTag: '₹22,000 / group',
    duration: '4 Days',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹22,000, 4 days, 4 friends, starting from Mangalore to Gokarna for beach treks and seafood.',
  },
  {
    id: 't3',
    title: 'Wayanad Chembra Peak & Zipline',
    location: 'Wayanad, Kerala',
    rating: 4.9,
    reviewsCount: 289,
    priceTag: '₹18,000 / group',
    duration: '3 Days',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹18,000, 3 days, couple trip from Mysore to Wayanad with mist, mountains and resort stay.',
  },
  {
    id: 't4',
    title: 'Munnar Tea Valley & Anamudi Summit',
    location: 'Munnar, Kerala',
    rating: 4.9,
    reviewsCount: 420,
    priceTag: '₹28,000 / group',
    duration: '5 Days',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹28,000, 5 days, family trip from Kochi to Munnar tea gardens and mist peaks.',
  },
  {
    id: 't5',
    title: 'Chikmagalur Mullayanagiri Peak Trek',
    location: 'Chikmagalur, Western Ghats',
    rating: 4.8,
    reviewsCount: 375,
    priceTag: '₹19,500 / group',
    duration: '3 Days',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹19,500, 3 days, 4 friends starting from Bangalore to Chikmagalur for peak trekking and coffee estates.',
  },
];

export const TrendingCarousel: React.FC = () => {
  const router = useRouter();
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (prompt: string) => {
    router.push(`/planner?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Trending This Week
            </h2>
            <p className="text-xs text-slate-400 font-medium">Curated high-demand journeys</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20">
          Swipe ➔
        </span>
      </div>

      {/* Horizontal Snap Scroll Container */}
      <div className="flex space-x-4 overflow-x-auto snap-x snap-mandatory py-2 pb-4 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {TRENDING_DESTINATIONS.map((dest, idx) => {
          const isLiked = !!likedMap[dest.id];

          return (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => handleSelect(dest.prompt)}
              className="snap-start shrink-0 w-[280px] sm:w-[320px] bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Parallax Feel & Heart Button */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                  {/* Heart / Save Button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={(e) => toggleLike(dest.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 min-h-[40px] min-w-[40px]"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                      }`}
                    />
                  </motion.button>

                  {/* Rating Badge */}
                  <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-800 flex items-center space-x-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">{dest.rating}</span>
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-xs font-mono font-bold text-slate-200 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-slate-800">
                      {dest.duration}
                    </span>
                    <span className="text-sm font-black text-amber-400 bg-slate-950/90 px-3 py-1 rounded-xl border border-amber-500/30">
                      {dest.priceTag}
                    </span>
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-5 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{dest.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors leading-tight">
                    {dest.title}
                  </h3>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <motion.button
                  whileTap={{ scale: 0.94 }}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center space-x-2 border border-slate-700 hover:border-amber-400 min-h-[44px]"
                >
                  <span>Plan This Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
