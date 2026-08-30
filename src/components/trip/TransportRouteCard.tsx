'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RouteInfo } from '@/lib/ai/types';
import { Navigation, Car, Clock, MapPin, ArrowRight } from 'lucide-react';

interface TransportRouteCardProps {
  route: RouteInfo;
}

export const TransportRouteCard: React.FC<TransportRouteCardProps> = ({ route }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-6 space-y-6 shadow-xl"
    >
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
        <Navigation className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-bold text-slate-100">Transportation & Route Guide</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MapPin className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase font-bold">Total Distance</div>
            <div className="text-xl font-black text-slate-100">{route.distanceKm} km</div>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-6 h-6 shrink-0" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono uppercase font-bold">Est. Drive Time</div>
            <div className="text-xl font-black text-slate-100">{route.estimatedDriveHours} Hours</div>
          </div>
        </div>
      </div>

      {/* Suggested Transport Modes */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
          <Car className="w-4 h-4 text-amber-500 mr-1.5" />
          Recommended Transport Modes
        </h4>
        <div className="flex flex-wrap gap-2">
          {route.suggestedModes.map((mode, idx) => (
            <span
              key={idx}
              className="px-3.5 py-2 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 text-xs font-bold"
            >
              {mode}
            </span>
          ))}
        </div>
      </div>

      {/* Highway Waypoints */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
          Highway Waypoint Trail
        </h4>
        <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 font-mono">
          {route.waypoints.map((point, idx) => (
            <React.Fragment key={idx}>
              <span className="font-bold text-amber-400">{point}</span>
              {idx < route.waypoints.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
