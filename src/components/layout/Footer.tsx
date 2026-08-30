import React from 'react';
import { NuvayLogo } from '../ui/NuvayLogo';
import { Map, Cpu, ShieldCheck, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-slate-950/90 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4 md:col-span-1">
          <NuvayLogo size="md" />
          <p className="text-sm text-slate-400 leading-relaxed">
            NUVAY is an AI-powered travel intelligence platform designed for modern explorers. Speak your journey naturally and receive personalized day-by-day itineraries, route maps, and budget breakdowns.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Platform</span>
          </h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/planner" className="hover:text-amber-400 transition-colors">Journey Planner</a></li>
            <li><a href="/saved" className="hover:text-amber-400 transition-colors">Saved Trips</a></li>
            <li><a href="/#features" className="hover:text-amber-400 transition-colors">Platform Features</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-amber-500" />
            <span>Open Tech Stack</span>
          </h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Next.js 15 App Router</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>Google Gemini AI Architecture</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>OpenStreetMap & Leaflet GL</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
              <span>OSRM & Nominatim Geo Engine</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span>V1 Principles</span>
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Pure travel decision intelligence with zero affiliate markup, fake pricing, or forced bookings.
          </p>
          <span className="inline-block px-3 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-800 text-amber-400">
            Version 1.0.0 Stable
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
        <p>© {new Date().getFullYear()} NUVAY Travel Technologies. All rights reserved.</p>
        <p className="mt-2 sm:mt-0">Crafted with passion for adventurous journeys.</p>
      </div>
    </footer>
  );
};
