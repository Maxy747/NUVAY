'use client';

import React from 'react';

interface NuvayWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const NuvayWordmark: React.FC<NuvayWordmarkProps> = ({
  className = '',
  size = 'md',
}) => {
  const textSizes = {
    sm: 'text-lg tracking-[0.22em]',
    md: 'text-2xl sm:text-3xl tracking-[0.25em]',
    lg: 'text-4xl sm:text-5xl tracking-[0.28em]',
    xl: 'text-6xl sm:text-7xl tracking-[0.3em]',
  };

  return (
    <div className={`font-black uppercase text-slate-100 flex items-center select-none ${textSizes[size]} ${className}`}>
      <span>N</span>
      <span className="ml-[0.18em]">U</span>
      <span className="ml-[0.18em]">V</span>
      {/* Exact Stylized Orange Ʌ (lambda / chevron A) */}
      <span className="ml-[0.18em] text-[#FF7A00] drop-shadow-[0_0_8px_rgba(255,122,0,0.5)]">
        Ʌ
      </span>
      <span className="ml-[0.18em]">Y</span>
    </div>
  );
};
