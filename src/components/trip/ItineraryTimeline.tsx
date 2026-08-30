'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayItinerary, ActivitySchedule } from '@/lib/ai/types';
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Utensils,
  Compass,
  Car,
  Hotel,
  Smile,
  Sparkles,
} from 'lucide-react';

interface ItineraryTimelineProps {
  dayItineraries: DayItinerary[];
  currency: string;
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({
  dayItineraries,
  currency,
}) => {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]); // Day 1 expanded by default

  const toggleDay = (dayNum: number) => {
    if (expandedDays.includes(dayNum)) {
      setExpandedDays(expandedDays.filter((d) => d !== dayNum));
    } else {
      setExpandedDays([...expandedDays, dayNum]);
    }
  };

  const categoryIcons: Record<ActivitySchedule['category'], React.ReactNode> = {
    food: <Utensils className="w-4 h-4 text-amber-400" />,
    activity: <Compass className="w-4 h-4 text-orange-400" />,
    travel: <Car className="w-4 h-4 text-blue-400" />,
    stay: <Hotel className="w-4 h-4 text-purple-400" />,
    relaxation: <Smile className="w-4 h-4 text-emerald-400" />,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-amber-500" />
          <span>Day-by-Day Journey Itinerary</span>
        </h2>
        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
          {dayItineraries.length} Days Planned
        </span>
      </div>

      <div className="space-y-4">
        {dayItineraries.map((day) => {
          const isExpanded = expandedDays.includes(day.day);

          return (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: day.day * 0.05 }}
              className="bg-slate-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl overflow-hidden shadow-xl"
            >
              <button
                type="button"
                onClick={() => toggleDay(day.day)}
                className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors min-h-[56px]"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black flex items-center justify-center text-base shrink-0">
                    D{day.day}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-base sm:text-lg">
                      {day.title}
                    </h3>
                    <p className="text-xs text-amber-400 font-semibold mt-0.5">
                      Theme: {day.theme}
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-amber-500" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 sm:px-6 pb-6 pt-3 border-t border-slate-800/80 space-y-4">
                      <div className="relative pl-6 sm:pl-8 border-l-2 border-amber-500/30 space-y-5">
                        {day.schedule.map((item, idx) => (
                          <div key={idx} className="relative group">
                            {/* Timeline Node */}
                            <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-amber-500 group-hover:scale-125 transition-transform"></div>

                            <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs font-mono font-bold text-amber-400 flex items-center bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/20">
                                    <Clock className="w-3.5 h-3.5 mr-1" />
                                    {item.time}
                                  </span>
                                  <span className="flex items-center space-x-1 text-xs font-bold text-slate-200 bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-700">
                                    {categoryIcons[item.category]}
                                    <span className="capitalize ml-1">{item.category}</span>
                                  </span>
                                </div>

                                <div className="text-xs font-bold text-slate-200 flex items-center bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                                  <IndianRupee className="w-3.5 h-3.5 text-amber-500 mr-0.5" />
                                  <span>
                                    {item.costPerPerson > 0
                                      ? `${currency}${item.costPerPerson.toLocaleString()} / head`
                                      : 'Free Access'}
                                  </span>
                                </div>
                              </div>

                              <h4 className="font-bold text-slate-100 text-base">
                                {item.title}
                              </h4>

                              <p className="text-sm text-slate-300 leading-relaxed">
                                {item.description}
                              </p>

                              <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 pt-1">
                                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                <span>{item.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
