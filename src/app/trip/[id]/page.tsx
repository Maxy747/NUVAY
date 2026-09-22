'use client';

import React, { useEffect, useState, use } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TripHeader } from '@/components/trip/TripHeader';
import { ItineraryTimeline } from '@/components/trip/ItineraryTimeline';
import { BudgetBreakdownCard } from '@/components/trip/BudgetBreakdownCard';
import { TransportRouteCard } from '@/components/trip/TransportRouteCard';
import { StayFoodCard } from '@/components/trip/StayFoodCard';
import { SafetyPanelCard } from '@/components/trip/SafetyPanelCard';
import { TripPlan } from '@/lib/ai/types';
import { getSavedTripsFromLocalStorage } from '@/lib/db/trips';
import { loadTrip as loadSavedTrip } from '@/lib/tripLinks';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const TripMap = dynamic(() => import('@/components/map/TripMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[40vh] sm:h-[450px] rounded-3xl bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-mono text-xs border border-slate-800">
      Loading OpenStreetMap Leaflet Engine...
    </div>
  ),
});

export default function TripDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setTripPlan(null);
    async function loadTrip() {
      try {
        const plan = await loadSavedTrip(id, fetch, getSavedTripsFromLocalStorage);
        if (cancelled) return;
        setTripPlan(plan);
        if (!plan) setError('This trip link has expired or the trip is unavailable. Check Saved Trips on the device where you saved it.');
      } catch (err) {
        console.error('Error loading trip:', err);
        if (!cancelled) setError('Unable to load trip details.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTrip();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-sm font-mono font-bold text-slate-400">Loading NUVAY Trip Plan...</p>
      </div>
    );
  }

  if (error || !tripPlan) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-slate-900/80 rounded-3xl border border-slate-800 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-100">Trip Plan Not Found</h2>
        <p className="text-sm text-slate-300">{error || 'The requested trip could not be located.'}</p>
        <Link
          href="/planner"
          className="min-h-[48px] inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Create New Journey Plan</span>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10"
    >
      <Link
        href="/saved"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-300 hover:text-amber-400 transition-colors min-h-[44px]"
      >
        <ArrowLeft className="w-4 h-4 text-amber-500" />
        <span>Back to Saved Trips</span>
      </Link>

      <TripHeader plan={tripPlan} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Route & Attraction Map</span>
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              {tripPlan.markers.length} Pins
            </span>
          </div>

          <TripMap
            center={tripPlan.mapCenter}
            zoom={tripPlan.mapZoom}
            markers={tripPlan.markers}
            waypoints={tripPlan.routeInfo.waypoints}
          />
        </div>

        <div className="lg:col-span-1">
          <TransportRouteCard route={tripPlan.routeInfo} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ItineraryTimeline
            dayItineraries={tripPlan.dayItineraries}
            currency={tripPlan.currency}
          />
        </div>

        <div className="lg:col-span-1 space-y-8">
          <BudgetBreakdownCard
            totalEstimate={tripPlan.totalBudgetEstimate}
            requestedBudget={tripPlan.requestedBudget}
            currency={tripPlan.currency}
            breakdown={tripPlan.budgetBreakdown}
            travelersCount={tripPlan.travelersCount}
          />

          <SafetyPanelCard safety={tripPlan.safetyInfo} />
        </div>
      </div>

      <StayFoodCard
        accommodations={tripPlan.accommodationSuggestions}
        food={tripPlan.foodHighlights}
        activities={tripPlan.activitiesHighlights}
        currency={tripPlan.currency}
      />
    </motion.div>
  );
}
