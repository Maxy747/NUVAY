'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BudgetBreakdown } from '@/lib/ai/types';
import { Wallet, Car, Hotel, Utensils, Compass, ShieldAlert } from 'lucide-react';

interface BudgetBreakdownCardProps {
  totalEstimate: number;
  requestedBudget: number;
  currency: string;
  breakdown: BudgetBreakdown;
  travelersCount: number;
}

export const BudgetBreakdownCard: React.FC<BudgetBreakdownCardProps> = ({
  totalEstimate,
  requestedBudget,
  currency,
  breakdown,
  travelersCount,
}) => {
  const perHeadEstimate = Math.round(totalEstimate / travelersCount);

  const items = [
    { label: 'Accommodation & Stay', amount: breakdown.accommodation, icon: Hotel, barColor: 'bg-purple-500' },
    { label: 'Transportation & Fuel', amount: breakdown.transportation, icon: Car, barColor: 'bg-blue-500' },
    { label: 'Food & Dining', amount: breakdown.food, icon: Utensils, barColor: 'bg-orange-500' },
    { label: 'Activities & Permits', amount: breakdown.activities, icon: Compass, barColor: 'bg-amber-500' },
    { label: 'Emergency Contingency', amount: breakdown.contingency, icon: ShieldAlert, barColor: 'bg-emerald-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-amber-500/20 p-5 sm:p-6 space-y-6 shadow-xl"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-100">Itemized Budget Allocation</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-amber-400">
            {currency}{totalEstimate.toLocaleString()}
          </div>
          <div className="text-xs font-mono font-bold text-slate-400">
            ~{currency}{perHeadEstimate.toLocaleString()} / head
          </div>
        </div>
      </div>

      {/* Target Gauge Indicator */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-slate-400">Requested Budget: {currency}{requestedBudget.toLocaleString()}</span>
          <span className="text-emerald-400 font-bold">
            {totalEstimate <= requestedBudget ? 'Within Budget Target' : 'Flexible Margin'}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
          {items.map((item, idx) => {
            const pct = (item.amount / totalEstimate) * 100;
            return (
              <div
                key={idx}
                style={{ width: `${pct}%` }}
                className={`h-full ${item.barColor}`}
                title={`${item.label}: ${currency}${item.amount}`}
              />
            );
          })}
        </div>
      </div>

      {/* Itemized Rows */}
      <div className="space-y-3">
        {items.map((item, idx) => {
          const Icon = item.icon;
          const pct = Math.round((item.amount / totalEstimate) * 100);

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-base"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
                  <Icon className="w-4 h-4 text-amber-500" />
                </div>
                <div>
                  <div className="font-bold text-slate-100 text-sm sm:text-base">{item.label}</div>
                  <div className="text-xs text-slate-400 font-mono">{pct}% of budget</div>
                </div>
              </div>
              <div className="font-extrabold text-slate-100 text-base">
                {currency}{item.amount.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
