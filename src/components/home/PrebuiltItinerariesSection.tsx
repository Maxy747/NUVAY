'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, ArrowRight, Sun, ShieldCheck } from 'lucide-react';
import { ItineraryPreviewModal, PrebuiltItem } from './ItineraryPreviewModal';

const PREBUILT_ITEMS: PrebuiltItem[] = [
  {
    id: 'pb1',
    title: 'Coorg 3D2N Coffee & Mist Trail',
    theme: 'Coffee Estates & Waterfall Hikes',
    duration: '3 Days, 2 Nights',
    budget: '₹20,000',
    season: 'Oct - Mar (Best)',
    difficulty: 'Moderate',
    image: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹20,000, 3 days, 3 friends, starting from Mangalore to Coorg for coffee estates, Abbey falls and authentic Kodava dinner.',
    days: [
      { dayNumber: 1, title: 'Scenic Drive & Abbey Falls', highlights: ['Drive through Western Ghats', 'Abbey Waterfalls hike', 'Sunset at Raja\'s Seat'] },
      { dayNumber: 2, title: 'Mandalpatti 4x4 Cloud Trail', highlights: ['Jeep safari above cloud sea', 'Namdroling Golden Temple', 'Coffee Estate Walk'] },
      { dayNumber: 3, title: 'Iruppu Falls & Return', highlights: ['Iruppu Wildlife Trail', 'Spiced Pandi Curry Lunch', 'Return Drive'] },
    ],
    budgetItems: [
      { item: 'Transport (Car Rental)', cost: '₹4,500' },
      { item: 'Homestay Stay (2 Nights)', cost: '₹8,000' },
      { item: 'Food & Kodava Meals', cost: '₹4,000' },
      { item: 'Activities & Permits', cost: '₹3,500' },
    ],
  },
  {
    id: 'pb2',
    title: 'Gokarna Beach & Cliff Trail',
    theme: 'Coastal Treks & Sunset Cafes',
    duration: '4 Days, 3 Nights',
    budget: '₹22,000',
    season: 'Nov - Feb (Best)',
    difficulty: 'Active',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹22,000, 4 days, 4 friends, starting from Mangalore to Gokarna for beach treks and seafood.',
    days: [
      { dayNumber: 1, title: 'Kudle Beach Arrival', highlights: ['Check-in beach shack', 'Kudle beach sunset', 'Namaste Cafe dinner'] },
      { dayNumber: 2, title: '5-Beach Cliff Trek', highlights: ['Om Beach to Paradise Beach trek', 'Dolphin sighting boat tour', 'Cliff cafe chill'] },
      { dayNumber: 3, title: 'Mirjan Fort & Water Sports', highlights: ['Mirjan Fort heritage tour', 'Jet ski at Main Beach', 'Live beach bonfire'] },
      { dayNumber: 4, title: 'Mahabaleshwar Temple & Return', highlights: ['Atmalinga temple visit', 'Seafood Thali lunch', 'Coastal drive return'] },
    ],
    budgetItems: [
      { item: 'Transport', cost: '₹5,000' },
      { item: 'Beach Shack Stay', cost: '₹9,000' },
      { item: 'Seafood & Food', cost: '₹4,500' },
      { item: 'Water Sports & Permits', cost: '₹3,500' },
    ],
  },
  {
    id: 'pb3',
    title: 'Wayanad Mountain & Cave Trail',
    theme: 'Peak Hikes & Ziplining',
    duration: '3 Days, 2 Nights',
    budget: '₹18,000',
    season: 'Sep - Mar (Best)',
    difficulty: 'Active',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹18,000, 3 days, couple trip from Mysore to Wayanad with mist, mountains and resort stay.',
    days: [
      { dayNumber: 1, title: 'Edakkal Caves & Tea Gardens', highlights: ['Neolithic rock carvings', 'Spice plantation walk', 'Resort check-in'] },
      { dayNumber: 2, title: 'Chembra Peak Heart Lake Trek', highlights: ['Heart-shaped lake hike', 'Longest zip line in Kerala', 'Campfire dinner'] },
      { dayNumber: 3, title: 'Banasura Sagar Dam & Return', highlights: ['Speed boat at Banasura', 'Traditional Sadhya lunch', 'Return to Mysore'] },
    ],
    budgetItems: [
      { item: 'Transport', cost: '₹4,000' },
      { item: 'Resort Stay', cost: '₹7,500' },
      { item: 'Food & Meals', cost: '₹3,500' },
      { item: 'Zipline & Entry Fees', cost: '₹3,000' },
    ],
  },
  {
    id: 'pb4',
    title: 'Munnar Tea Valley & Anamudi Summit',
    theme: 'Mist Valleys & Waterfalls',
    duration: '4 Days, 3 Nights',
    budget: '₹25,000',
    season: 'Sep - May (Best)',
    difficulty: 'Easy',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    prompt: 'I have ₹25,000, 4 days, family trip from Kochi to Munnar tea gardens and mist peaks.',
    days: [
      { dayNumber: 1, title: 'Cheeyappara Waterfalls & Tea Gardens', highlights: ['Drive through waterfall trail', 'Tea museum tour', 'Munnar town stay'] },
      { dayNumber: 2, title: 'Eravikulam & Nilgiri Tahr', highlights: ['Rajamalai National Park', 'Anamudi view point', 'Mattupetty Lake boat ride'] },
      { dayNumber: 3, title: 'Top Station Sunrise', highlights: ['Panoramic cloud valley view', 'Echo Point stroll', 'Authentic Kerala dinner'] },
      { dayNumber: 4, title: 'Spice Shopping & Return', highlights: ['Fresh cardamom & tea buying', 'Return drive to Kochi'] },
    ],
    budgetItems: [
      { item: 'Transport', cost: '₹6,000' },
      { item: 'Tea Estate Hotel', cost: '₹10,500' },
      { item: 'Food & Dining', cost: '₹5,000' },
      { item: 'Park Entry & Boating', cost: '₹3,500' },
    ],
  },
];

export const PrebuiltItinerariesSection: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<PrebuiltItem | null>(null);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#FF7A00]/20 text-amber-400 flex items-center justify-center border border-[#FF7A00]/30 shadow-[0_0_12px_rgba(255,122,0,0.3)]">
            <Sparkles className="w-4 h-4 text-[#FF7A00]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Ready-to-Go Itineraries
            </h2>
            <p className="text-xs text-slate-400 font-medium">Curated by locals and optimized by AI</p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-amber-400 bg-[#FF7A00]/10 px-3 py-1.5 rounded-full border border-[#FF7A00]/20">
          Prebuilt Vault
        </span>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {PREBUILT_ITEMS.map((item, idx) => {
          const isLiked = !!likedMap[item.id];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              whileHover={{ y: -5 }}
              onClick={() => setSelectedItem(item)}
              className="bg-[#050A18]/90 backdrop-blur-xl rounded-3xl border border-white/[0.08] overflow-hidden shadow-2xl cursor-pointer group flex flex-col justify-between hover:border-[#FF7A00]/40 transition-all"
            >
              <div>
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050A18] via-[#050A18]/20 to-transparent"></div>

                  {/* Heart Save Button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    type="button"
                    onClick={(e) => toggleLike(item.id, e)}
                    className="absolute top-3 right-3 w-10 h-10 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800 flex items-center justify-center text-slate-300 hover:text-amber-400 min-h-[40px] min-w-[40px]"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-300'
                      }`}
                    />
                  </motion.button>

                  {/* Badges */}
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                    <span className="text-xs font-mono font-bold text-slate-200 bg-slate-950/90 px-2.5 py-1 rounded-xl border border-white/10">
                      {item.duration}
                    </span>
                    <span className="text-xs font-black text-amber-400 bg-slate-950/90 px-3 py-1 rounded-xl border border-[#FF7A00]/30">
                      {item.budget}
                    </span>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 space-y-2">
                  <span className="text-[11px] font-bold text-[#FF7A00] uppercase tracking-wider block">
                    {item.theme}
                  </span>
                  <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="w-full py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider bg-slate-900 hover:bg-[#FF7A00] hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center space-x-2 border border-white/10 hover:border-amber-400 min-h-[44px]"
                >
                  <span>Open Itinerary</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Preview Modal */}
      <ItineraryPreviewModal
        item={selectedItem}
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
};
