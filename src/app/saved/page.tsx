'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TripPlan } from '@/lib/ai/types';
import { getSavedTripsFromLocalStorage, removeSavedTripFromLocalStorage } from '@/lib/db/trips';
import { Bookmark, MapPin, Calendar, Users, Trash2, ArrowRight, Compass } from 'lucide-react';

export default function SavedTripsPage() {
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const trips = getSavedTripsFromLocalStorage();
    setSavedTrips(trips);
    setLoaded(true);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeSavedTripFromLocalStorage(id);
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
  };

  if (!loaded) {
    return <div className="p-12 text-center text-slate-400">Loading saved journeys...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Journeys Vault</span>
          </div>
          <h1 className="text-3xl font-black text-slate-100">
            Your Saved Travel Plans ({savedTrips.length})
          </h1>
        </div>

        <Link
          href="/planner"
          className="min-h-[48px] px-5 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider bg-amber-500 text-slate-950 hover:bg-amber-400 flex items-center space-x-2 shadow-[0_0_15px_rgba(245,158,11,0.4)]"
        >
          <Compass className="w-4 h-4" />
          <span>Plan New Trip</span>
        </Link>
      </div>

      {savedTrips.length === 0 ? (
        <div className="max-w-md mx-auto my-16 p-8 bg-slate-900/80 rounded-3xl border border-amber-500/20 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-100">No Saved Trips Yet</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            When you generate personalized trip plans in the Journey Planner, tap "Save Trip" to access them here anytime.
          </p>
          <Link
            href="/planner"
            className="min-h-[48px] inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.4)]"
          >
            <span>Create Your First Trip</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTrips.map((trip, idx) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Link
                href={`/trip/${trip.id}`}
                className="group bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all shadow-xl relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      {trip.travelerType} Trip
                    </span>
                    <button
                      onClick={(e) => handleDelete(trip.id, e)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-100 text-lg group-hover:text-amber-400 transition-colors line-clamp-2">
                      {trip.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 italic">
                      "{trip.tagline}"
                    </p>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300 font-semibold pt-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{trip.destination}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{trip.durationDays} Days ({trip.origin} → Destination)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{trip.travelersCount} Travelers</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 mt-4 flex items-center justify-between">
                  <span className="text-lg font-black text-amber-400">
                    {trip.currency}{trip.totalBudgetEstimate.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 flex items-center space-x-1">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
