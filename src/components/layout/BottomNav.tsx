'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Compass, Bookmark, User, X, Sparkles, ShieldCheck } from 'lucide-react';
import { getSavedTripsFromLocalStorage } from '@/lib/db/trips';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const trips = getSavedTripsFromLocalStorage();
    setSavedCount(trips.length);
  }, [pathname]);

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Plan', href: '/planner', icon: Compass },
    { label: 'Saved', href: '/saved', icon: Bookmark, badge: savedCount },
    { label: 'Profile', onClick: () => setIsProfileOpen(true), icon: User },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-amber-500/20 px-3 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-10px_25px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href ? pathname === item.href : isProfileOpen;

            const content = (
              <motion.div
                whileTap={{ scale: 0.92 }}
                className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-3 py-1.5 rounded-2xl transition-colors ${
                  isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute inset-0 bg-amber-500/15 rounded-2xl border border-amber-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative flex items-center justify-center">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] font-semibold mt-1 tracking-tight">
                  {item.label}
                </span>
              </motion.div>
            );

            if (item.href) {
              return (
                <Link key={item.label} href={item.href}>
                  {content}
                </Link>
              );
            }

            return (
              <button key={item.label} onClick={item.onClick} type="button" className="focus:outline-none">
                {content}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Profile Modal Sheet */}
      <AnimatePresence>
        {isProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-md bg-slate-900 rounded-t-3xl sm:rounded-3xl border-t sm:border border-amber-500/30 p-6 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">Explorer Profile</h3>
                    <p className="text-xs text-slate-400">NUVAY Travel Intelligence</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsProfileOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>Saved Trips</span>
                    <span className="text-amber-400 font-bold">{savedCount} Journeys</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                    <span>AI Engine Status</span>
                    <span className="text-emerald-400 font-bold flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5"></span>
                      Active & Ready
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                  <div className="font-bold flex items-center text-amber-400">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    Mobile-First AI Assistant
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Designed for one-handed operation. Speak or type your trip requests naturally anytime.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsProfileOpen(false)}
                className="w-full py-3.5 rounded-2xl font-bold text-sm bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
              >
                Close Profile
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
