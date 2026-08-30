'use client';

import React from 'react';
import Link from 'next/link';
import { NuvayWordmark } from './NuvayWordmark';

interface NuvayLogoProps {
  className?: string;
  variant?: 'primary' | 'compact' | 'favicon' | 'app_icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  href?: string;
}

export const NuvayLogo: React.FC<NuvayLogoProps> = ({
  className = '',
  variant = 'primary',
  href = '/',
}) => {
  // Standalone Favicon Variant (256x256 / 32x32)
  if (variant === 'favicon') {
    return (
      <div className={`relative w-8 h-8 shrink-0 ${className}`}>
        <img
          src="/nuvay-logo-256.png"
          alt="NUVAY Favicon"
          className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]"
        />
      </div>
    );
  }

  // App Icon Variant (Glossy 512x512 / 1024x1024 App Icon with Glow)
  if (variant === 'app_icon') {
    return (
      <div className={`relative group cursor-pointer ${className}`}>
        {/* Soft Amber Glow Halo */}
        <div className="absolute inset-0 bg-[#FF7A00]/30 rounded-3xl blur-2xl group-hover:bg-[#FF7A00]/50 transition-all duration-500"></div>

        {/* 512x512 Transparent PNG App Icon */}
        <div className="relative w-36 h-36 sm:w-44 sm:h-44 p-1 flex items-center justify-center">
          <img
            src="/nuvay-logo-512.png"
            alt="NUVAY App Icon"
            className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,122,0,0.6)] group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
    );
  }

  // Compact Variant (Mobile & Sticky Navbar)
  if (variant === 'compact') {
    return (
      <Link href={href} className={`inline-flex items-center gap-3 group ${className}`}>
        <img
          src="/nuvay-logo-256.png"
          alt="NUVAY Logo"
          className="w-9 h-9 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(245,158,11,0.45)] group-hover:scale-105 transition-transform duration-300"
        />
        <NuvayWordmark size="sm" />
      </Link>
    );
  }

  // Primary Website Logo (Main Navbar: 52x52 Isolated Icon + N U V Ʌ Y Wordmark)
  return (
    <Link href={href} className={`inline-flex items-center gap-3.5 group ${className}`}>
      {/* 52x52 Isolated Transparent Squircle PNG with Amber Glow */}
      <img
        src="/nuvay-logo-512.png"
        alt="NUVAY Isolated Squircle Icon"
        className="w-[52px] h-[52px] object-contain shrink-0 drop-shadow-[0_0_18px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-transform duration-300"
      />

      {/* Original N U V Ʌ Y Wordmark */}
      <NuvayWordmark size="md" />
    </Link>
  );
};
