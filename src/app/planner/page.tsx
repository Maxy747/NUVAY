'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { StepWizardPlanner } from '@/components/planner/StepWizardPlanner';
import { NaturalPromptBar } from '@/components/planner/NaturalPromptBar';
import { TripGeneratorState } from '@/components/planner/TripGeneratorState';
import { TripHeader } from '@/components/trip/TripHeader';
import { ItineraryTimeline } from '@/components/trip/ItineraryTimeline';
import { BudgetBreakdownCard } from '@/components/trip/BudgetBreakdownCard';
import { TransportRouteCard } from '@/components/trip/TransportRouteCard';
import { StayFoodCard } from '@/components/trip/StayFoodCard';
import { SafetyPanelCard } from '@/components/trip/SafetyPanelCard';
import { TripPlan, TripRequest } from '@/lib/ai/types';
import { Compass, Sparkles, AlertCircle, SlidersHorizontal, ArrowUp } from 'lucide-react';

const TripMap = dynamic(() => import('@/components/map/TripMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[40vh] sm:h-[450px] rounded-3xl bg-slate-900 animate-pulse flex items-center justify-center text-slate-500 font-mono text-xs border border-slate-800">
      Loading OpenStreetMap Leaflet Engine...
    </div>
  ),
});

function PlannerContent() {
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<'wizard' | 'bar'>('wizard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  const generateTrip = async (requestPayload: TripRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate trip plan');
      }

      setTripPlan(data.plan);
      // Smooth scroll down to results
      window.scrollTo({ top: 350, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Trip Generation Error:', err);
      setError(err.message || 'Something went wrong generating your trip.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const qPrompt = searchParams.get('prompt');
    if (qPrompt) {
      const qBudget = searchParams.get('budget');
      const qDays = searchParams.get('days');

      generateTrip({
        prompt: qPrompt,
        budget: qBudget ? Number(qBudget) : undefined,
        durationDays: qDays ? Number(qDays) : undefined,
      });
    }
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header Banner */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-amber-500" />
          <span>Mobile-First AI Journey Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight">
          Where does your next journey begin?
        </h1>

        <div className="flex justify-center space-x-2 pt-2">
          <button
            onClick={() => setMode('wizard')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
              mode === 'wizard'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Step-by-Step Wizard
          </button>
          <button
            onClick={() => setMode('bar')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
              mode === 'bar'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            Quick Natural Prompt
          </button>
        </div>
      </div>

      {/* Input Mode Container */}
      <div>
        {mode === 'wizard' ? (
          <StepWizardPlanner onGenerate={generateTrip} />
        ) : (
          <NaturalPromptBar
            onSubmitPrompt={(text) => generateTrip({ prompt: text })}
            onOpenPreferences={() => setMode('wizard')}
          />
        )}
      </div>

      {/* Loading State Animation */}
      {isLoading && <TripGeneratorState />}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center space-x-3 max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Trip Results */}
      {tripPlan && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-8 sm:space-y-12"
        >
          {/* Trip Header Banner */}
          <TripHeader plan={tripPlan} />

          {/* Interactive Map & Route Logistics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Interactive Route & Waypoint Map</span>
                </h3>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                  {tripPlan.markers.length} Pins
                </span>
              </div>

              {/* Responsive 40% Mobile Map with MapBottomSheet */}
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

          {/* Day-by-Day Accordion Itinerary & Itemized Budget */}
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

          {/* Accommodations & Food Cards */}
          <StayFoodCard
            accommodations={tripPlan.accommodationSuggestions}
            food={tripPlan.foodHighlights}
            activities={tripPlan.activitiesHighlights}
            currency={tripPlan.currency}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading Journey Planner...</div>}>
      <PlannerContent />
    </Suspense>
  );
}
