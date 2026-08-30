'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapMarker } from '@/lib/ai/types';
import { MapPin, X, Navigation, Sparkles } from 'lucide-react';

interface MapBottomSheetProps {
  selectedMarker: MapMarker | null;
  onClose: () => void;
}

export const MapBottomSheet: React.FC<MapBottomSheetProps> = ({
  selectedMarker,
  onClose,
}) => {
  if (!selectedMarker) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute bottom-3 left-3 right-3 z-30 bg-slate-950/95 backdrop-blur-2xl rounded-3xl border border-amber-500/30 p-4 shadow-2xl space-y-3 md:hidden"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {selectedMarker.type} {selectedMarker.day ? `• Day ${selectedMarker.day}` : ''}
            </span>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h4 className="text-base font-bold text-slate-100 flex items-center">
            <MapPin className="w-4 h-4 text-amber-500 mr-1.5 shrink-0" />
            {selectedMarker.title}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {selectedMarker.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono text-slate-400">
          <span>Lat: {selectedMarker.lat.toFixed(4)}, Lng: {selectedMarker.lng.toFixed(4)}</span>
          <span className="flex items-center text-amber-400 font-bold">
            <Navigation className="w-3 h-3 mr-1" /> Waypoint Pin
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
