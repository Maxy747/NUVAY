'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const HeroBackgroundEffects: React.FC = () => {
  // Generate 8 floating ambient particle positions
  const particles = [
    { top: '15%', left: '20%', duration: 12, size: 6 },
    { top: '25%', left: '75%', duration: 16, size: 8 },
    { top: '45%', left: '10%', duration: 14, size: 5 },
    { top: '55%', left: '85%', duration: 18, size: 7 },
    { top: '70%', left: '30%', duration: 15, size: 6 },
    { top: '80%', left: '65%', duration: 13, size: 8 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Animated Breathing Radial Orange Glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.35, 0.6, 0.35],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] bg-gradient-to-tr from-amber-500/20 via-orange-600/20 to-amber-400/10 rounded-full blur-[140px]"
      />

      {/* Floating Motion Particles */}
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
          animate={{
            y: [-15, 15, -15],
            x: [-10, 10, -10],
            opacity: [0.2, 0.7, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full bg-amber-400/60 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
        />
      ))}
    </div>
  );
};
