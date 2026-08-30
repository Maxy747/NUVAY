'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AccommodationOption, FoodHighlight, ActivityHighlight } from '@/lib/ai/types';
import { Hotel, Utensils, Star, MapPin } from 'lucide-react';

interface StayFoodCardProps {
  accommodations: AccommodationOption[];
  food: FoodHighlight[];
  activities: ActivityHighlight[];
  currency: string;
}

export const StayFoodCard: React.FC<StayFoodCardProps> = ({
  accommodations,
  food,
  activities,
  currency,
}) => {
  return (
    <div className="space-y-8">
      {/* Accommodation Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-6 space-y-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Hotel className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-100">Recommended Stays & Accommodations</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accommodations.map((stay, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-3 hover:border-amber-500/40 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-xl border border-amber-500/20">
                    {stay.type}
                  </span>
                  <div className="flex items-center space-x-1 text-xs font-bold text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{stay.rating}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-100 text-base">
                  {stay.name}
                </h4>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {stay.description}
                </p>
              </div>

              <div className="border-t border-slate-800/80 pt-3 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 mr-1 shrink-0" />
                  {stay.location}
                </span>
                <span className="text-base font-black text-amber-400">
                  {currency}{stay.pricePerNight.toLocaleString()}<span className="text-xs font-normal text-slate-400">/night</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Food & Culinary Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-6 space-y-6 shadow-xl"
      >
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
          <Utensils className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-100">Local Culinary & Food Highlights</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {food.map((item, idx) => (
            <div key={idx} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-mono text-amber-400 font-bold">
                <span className="capitalize">{item.type.replace(/-/g, ' ')}</span>
                <span>{currency}{item.estimatedCost} est.</span>
              </div>
              <h4 className="font-bold text-slate-100 text-base">{item.dishOrPlace}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
