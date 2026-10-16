import React from 'react';

/**
 * Game Art Craftsman - Elevated Vector Asset Library for Stardew Interiors
 * High-complexity SVG components replacing naive geometric composites & raw emojis.
 * Implements multi-pass lighting, gradients, ambient occlusion, bevels, and micro-textures.
 */

// 1. Store Shelves with Jars, Bottles, Sacks & Bread
export function StoreShelvesSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 280 140" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="shelfWoodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a16207" />
          <stop offset="25%" stopColor="#854d0e" />
          <stop offset="75%" stopColor="#713f12" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="jamRedGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </linearGradient>
        <linearGradient id="honeyAmberGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="glassPotionGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#083344" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="breadCrustGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fed7aa" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
        <linearGradient id="sackBurlapGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d6d3d1" />
          <stop offset="50%" stopColor="#a8a29e" />
          <stop offset="100%" stopColor="#78716c" />
        </linearGradient>
        <filter id="assetShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Back Support Uprights */}
      <rect x="18" y="10" width="8" height="120" rx="1.5" fill="#451a03" />
      <rect x="254" y="10" width="8" height="120" rx="1.5" fill="#451a03" />

      {/* --- TIER 1 (TOP SHELF) --- */}
      {/* Top Shelf Plank */}
      <rect x="10" y="58" width="260" height="9" rx="2" fill="url(#shelfWoodGrad)" filter="url(#assetShadow)" />
      <line x1="12" y1="59" x2="268" y2="59" stroke="#fde047" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="14" y="66" width="252" height="3" fill="#291203" />

      {/* Item 1: Strawberry Jam Jar with Cloth Lid */}
      <g transform="translate(26, 26)">
        <rect x="0" y="8" width="20" height="24" rx="4" fill="url(#jamRedGrad)" stroke="#7f1d1d" strokeWidth="1" />
        {/* Specular glass gleam */}
        <path d="M 4 10 L 4 28" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        {/* White cloth lid cover */}
        <path d="M -2 7 Q 10 2 22 7 L 20 11 Q 10 9 0 11 Z" fill="#fef2f2" stroke="#b91c1c" strokeWidth="0.8" />
        {/* Twine ribbon */}
        <line x1="-1" y1="9" x2="21" y2="9" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="10" cy="9" r="1.5" fill="#92400e" />
      </g>

      {/* Item 2: Amber Olive Oil Bottle */}
      <g transform="translate(60, 20)">
        <rect x="3" y="14" width="16" height="24" rx="3" fill="url(#honeyAmberGrad)" stroke="#78350f" strokeWidth="1" />
        {/* Neck */}
        <rect x="8" y="4" width="6" height="10" fill="url(#honeyAmberGrad)" stroke="#78350f" strokeWidth="0.8" />
        {/* Cork */}
        <rect x="8.5" y="0" width="5" height="4.5" rx="1" fill="#d97706" stroke="#451a03" strokeWidth="0.8" />
        {/* Glass reflection */}
        <line x1="6" y1="16" x2="6" y2="34" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round" />
        {/* Label */}
        <rect x="6" y="20" width="10" height="11" rx="1" fill="#fef3c7" stroke="#b45309" strokeWidth="0.6" />
        <line x1="8" y1="24" x2="14" y2="24" stroke="#92400e" strokeWidth="0.8" />
        <line x1="8" y1="27" x2="12" y2="27" stroke="#92400e" strokeWidth="0.8" />
      </g>

      {/* Item 3: Wicker Bread Basket with Golden Baguettes */}
      <g transform="translate(98, 22)">
        {/* Baguette 1 */}
        <ellipse cx="14" cy="12" rx="4" ry="16" transform="rotate(22 14 12)" fill="url(#breadCrustGrad)" stroke="#451a03" strokeWidth="0.8" />
        <line x1="12" y1="6" x2="17" y2="9" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />
        <line x1="11" y1="12" x2="16" y2="15" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />
        {/* Baguette 2 */}
        <ellipse cx="26" cy="11" rx="4" ry="17" transform="rotate(-15 26 11)" fill="url(#breadCrustGrad)" stroke="#451a03" strokeWidth="0.8" />
        <line x1="24" y1="4" x2="28" y2="8" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />
        <line x1="23" y1="11" x2="27" y2="15" stroke="#fef3c7" strokeWidth="1" strokeLinecap="round" />
        {/* Woven Basket */}
        <path d="M 4 20 L 36 20 L 32 36 L 8 36 Z" fill="#b45309" stroke="#451a03" strokeWidth="1.2" />
        <line x1="4" y1="24" x2="36" y2="24" stroke="#78350f" strokeWidth="1" />
        <line x1="6" y1="29" x2="34" y2="29" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Item 4: Stoneware Honey Crock */}
      <g transform="translate(156, 25)">
        <ellipse cx="14" cy="22" rx="12" ry="14" fill="#d97706" stroke="#451a03" strokeWidth="1" />
        <ellipse cx="14" cy="9" rx="8" ry="3" fill="#92400e" stroke="#451a03" strokeWidth="0.8" />
        {/* Honey drip */}
        <path d="M 12 11 Q 14 17 17 14 Q 19 22 18 24 Q 15 26 13 22 Z" fill="#fef08a" />
        <text x="14" y="26" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#451a03">דבש</text>
      </g>

      {/* Item 5: Seed Packet & Mason Jar */}
      <g transform="translate(202, 24)">
        {/* Seed Pouch */}
        <polygon points="4,10 20,8 22,34 2,34" fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
        <circle cx="12" cy="20" r="4" fill="#84cc16" />
        <path d="M 10 20 Q 12 14 14 20" stroke="#365314" strokeWidth="1" fill="none" />
        {/* Cyan Potion Bottle */}
        <g transform="translate(24, 0)">
          <ellipse cx="10" cy="22" rx="8" ry="10" fill="url(#glassPotionGrad)" stroke="#0e7490" strokeWidth="0.8" />
          <rect x="7.5" y="7" width="5" height="6" fill="#06b6d4" stroke="#0e7490" strokeWidth="0.8" />
          <rect x="7" y="4" width="6" height="3.5" rx="1" fill="#b45309" />
          <circle cx="10" cy="22" r="3" fill="#ffffff" fillOpacity="0.4" />
        </g>
      </g>

      {/* --- TIER 2 (BOTTOM SHELF) --- */}
      {/* Bottom Shelf Plank */}
      <rect x="10" y="118" width="260" height="9" rx="2" fill="url(#shelfWoodGrad)" filter="url(#assetShadow)" />
      <line x1="12" y1="119" x2="268" y2="119" stroke="#fde047" strokeOpacity="0.4" strokeWidth="1" />
      <rect x="14" y="126" width="252" height="3" fill="#291203" />

      {/* Item 6: Hessian Flour Sack */}
      <g transform="translate(24, 82)">
        <path d="M 4 12 Q 1 20 2 34 Q 15 37 30 34 Q 31 20 28 12 Q 22 8 16 10 Q 10 8 4 12 Z" fill="url(#sackBurlapGrad)" stroke="#44403c" strokeWidth="1" />
        {/* Tied neck */}
        <ellipse cx="16" cy="11" rx="8" ry="2.5" fill="#57534e" />
        <text x="16" y="27" fontSize="7" fontWeight="900" textAnchor="middle" fill="#292524">קמח</text>
      </g>

      {/* Item 7: Wooden Cheese Box & Wheel */}
      <g transform="translate(74, 86)">
        <ellipse cx="18" cy="22" rx="16" ry="9" fill="#facc15" stroke="#b45309" strokeWidth="1" />
        <ellipse cx="18" cy="17" rx="16" ry="8" fill="#fef08a" stroke="#b45309" strokeWidth="0.8" />
        {/* Slice cut out */}
        <polygon points="18,17 32,19 24,25" fill="#ca8a04" stroke="#854d0e" strokeWidth="0.8" />
      </g>

      {/* Item 8: Two Preserve Jars (Pickles & Jam) */}
      <g transform="translate(130, 88)">
        <rect x="0" y="6" width="16" height="22" rx="3" fill="#65a30d" stroke="#365314" strokeWidth="1" />
        <rect x="2" y="2" width="12" height="5" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
        <rect x="20" y="8" width="16" height="20" rx="3" fill="#c026d3" stroke="#701a75" strokeWidth="1" />
        <rect x="22" y="4" width="12" height="5" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
      </g>

      {/* Item 9: Crate with Farm Fresh Eggs */}
      <g transform="translate(186, 90)">
        <rect x="0" y="8" width="34" height="18" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="1" />
        {/* Straw */}
        <line x1="2" y1="8" x2="32" y2="8" stroke="#fef08a" strokeWidth="3" />
        {/* Eggs */}
        <ellipse cx="8" cy="7" rx="3.5" ry="4.5" fill="#ffedd5" stroke="#c2410c" strokeWidth="0.6" />
        <ellipse cx="17" cy="6" rx="3.5" ry="4.5" fill="#ffffff" stroke="#9a3412" strokeWidth="0.6" />
        <ellipse cx="26" cy="7" rx="3.5" ry="4.5" fill="#ffedd5" stroke="#c2410c" strokeWidth="0.6" />
      </g>

      {/* Item 10: Glass Milk Bottle */}
      <g transform="translate(236, 84)">
        <rect x="3" y="10" width="14" height="24" rx="3" fill="#f8fafc" stroke="#64748b" strokeWidth="1" />
        <rect x="6.5" y="4" width="7" height="7" fill="#f8fafc" stroke="#64748b" strokeWidth="0.8" />
        <rect x="6" y="1" width="8" height="3" rx="1" fill="#ef4444" />
        <line x1="5" y1="12" x2="5" y2="30" stroke="#cbd5e1" strokeWidth="1" />
      </g>
    </svg>
  );
}

// 2. Pierre's Store Counter with Brass Register, Scales & Ledger Book
export function StoreCounterSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 160 80" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="counterWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="25%" stopColor="#92400e" />
          <stop offset="70%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="brassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="85%" stopColor="#a16207" />
          <stop offset="100%" stopColor="#713f12" />
        </linearGradient>
      </defs>

      {/* Counter Base Wooden Structure */}
      <rect x="6" y="24" width="148" height="52" rx="4" fill="url(#counterWood)" stroke="#291203" strokeWidth="2.5" />
      {/* Relief panels on front */}
      <rect x="14" y="32" width="38" height="36" rx="2" fill="#522504" stroke="#78350f" strokeWidth="1" />
      <rect x="60" y="32" width="40" height="36" rx="2" fill="#522504" stroke="#78350f" strokeWidth="1" />
      <rect x="108" y="32" width="38" height="36" rx="2" fill="#522504" stroke="#78350f" strokeWidth="1" />
      {/* Top Countertop Slab */}
      <rect x="2" y="18" width="156" height="9" rx="3" fill="#d97706" stroke="#451a03" strokeWidth="1.5" />
      <line x1="4" y1="20" x2="156" y2="20" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.6" />

      {/* --- PROPS ON TOP OF COUNTER --- */}

      {/* 1. Vintage Brass Cash Register (Left Side) */}
      <g transform="translate(18, 0)">
        {/* Base */}
        <polygon points="2,20 32,20 28,8 6,8" fill="url(#brassGrad)" stroke="#451a03" strokeWidth="1" />
        {/* Upper Housing */}
        <rect x="8" y="2" width="18" height="9" rx="1.5" fill="url(#brassGrad)" stroke="#713f12" strokeWidth="0.8" />
        {/* Amount Display Flag */}
        <rect x="11" y="-3" width="12" height="6" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
        <text x="17" y="1.5" fontSize="4.5" fontWeight="900" textAnchor="middle" fill="#451a03">0.00</text>
        {/* Tiered Keys */}
        <circle cx="10" cy="12" r="1.2" fill="#fff" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="14" cy="12" r="1.2" fill="#fff" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="18" cy="12" r="1.2" fill="#fff" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="22" cy="12" r="1.2" fill="#fff" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="10" cy="16" r="1.2" fill="#fde047" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="14" cy="16" r="1.2" fill="#fde047" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="18" cy="16" r="1.2" fill="#fde047" stroke="#713f12" strokeWidth="0.5" />
        <circle cx="22" cy="16" r="1.2" fill="#fde047" stroke="#713f12" strokeWidth="0.5" />
      </g>

      {/* 2. Brass Balance Scales (Center) */}
      <g transform="translate(68, 2)">
        {/* Central Stand */}
        <rect x="11" y="4" width="2" height="15" fill="url(#brassGrad)" />
        <ellipse cx="12" cy="18" rx="6" ry="2" fill="#a16207" />
        {/* Crossbeam */}
        <line x1="2" y1="5" x2="22" y2="5" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="5" r="1.8" fill="#451a03" />
        {/* Left Pan */}
        <line x1="3" y1="6" x2="1" y2="12" stroke="#a16207" strokeWidth="0.7" />
        <line x1="3" y1="6" x2="5" y2="12" stroke="#a16207" strokeWidth="0.7" />
        <path d="M -1 12 Q 3 15 7 12 Z" fill="url(#brassGrad)" stroke="#713f12" strokeWidth="0.6" />
        {/* Right Pan */}
        <line x1="21" y1="6" x2="19" y2="12" stroke="#a16207" strokeWidth="0.7" />
        <line x1="21" y1="6" x2="23" y2="12" stroke="#a16207" strokeWidth="0.7" />
        <path d="M 17 12 Q 21 15 25 12 Z" fill="url(#brassGrad)" stroke="#713f12" strokeWidth="0.6" />
      </g>

      {/* 3. Open Leather Ledger Book & Quill (Right Side) */}
      <g transform="translate(108, 7)">
        {/* Left Page */}
        <polygon points="2,13 16,11 15,2 1,4" fill="#fef3c7" stroke="#78350f" strokeWidth="0.8" />
        <line x1="4" y1="7" x2="13" y2="6" stroke="#a1a1aa" strokeWidth="0.6" />
        <line x1="4" y1="10" x2="13" y2="9" stroke="#a1a1aa" strokeWidth="0.6" />
        {/* Right Page */}
        <polygon points="16,11 30,13 31,4 17,2" fill="#fffbeb" stroke="#78350f" strokeWidth="0.8" />
        <line x1="19" y1="6" x2="28" y2="7" stroke="#a1a1aa" strokeWidth="0.6" />
        <line x1="19" y1="9" x2="28" y2="10" stroke="#a1a1aa" strokeWidth="0.6" />
        {/* Spine */}
        <line x1="16" y1="2" x2="16" y2="12" stroke="#7f1d1d" strokeWidth="1.8" />
        {/* Feather Quill */}
        <path d="M 30 1 L 35 -5 Q 33 0 26 8" stroke="#ffffff" strokeWidth="1.2" fill="none" />
      </g>
    </svg>
  );
}

// 3. Wooden Produce Bins with Carrots, Apples & Potatoes
export function ProduceBinsSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 140 50" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crateWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#522504" />
        </linearGradient>
        <linearGradient id="appleRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
        <linearGradient id="carrotOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="40%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#9a3412" />
        </linearGradient>
      </defs>

      {/* Crate 1: Carrots (Left) */}
      <g transform="translate(6, 6)">
        <polygon points="0,12 40,12 36,38 4,38" fill="url(#crateWood)" stroke="#291203" strokeWidth="1.5" />
        <line x1="2" y1="24" x2="38" y2="24" stroke="#451a03" strokeWidth="1.2" />
        {/* Carrot tops & bodies */}
        <ellipse cx="12" cy="11" rx="5" ry="9" transform="rotate(-15 12 11)" fill="url(#carrotOrange)" stroke="#7c2d12" strokeWidth="0.8" />
        <ellipse cx="22" cy="10" rx="5" ry="10" fill="url(#carrotOrange)" stroke="#7c2d12" strokeWidth="0.8" />
        <ellipse cx="30" cy="12" rx="4.5" ry="8" transform="rotate(20 30 12)" fill="url(#carrotOrange)" stroke="#7c2d12" strokeWidth="0.8" />
        {/* Green fronds */}
        <path d="M 12 4 Q 8 0 10 -2 Q 13 1 12 4" fill="#4d7c0f" />
        <path d="M 22 2 Q 22 -3 24 -4 Q 25 0 22 2" fill="#4d7c0f" />
        <path d="M 30 4 Q 34 0 33 -3 Q 29 0 30 4" fill="#4d7c0f" />
      </g>

      {/* Crate 2: Red Apples (Center) */}
      <g transform="translate(50, 6)">
        <polygon points="0,12 40,12 36,38 4,38" fill="url(#crateWood)" stroke="#291203" strokeWidth="1.5" />
        <line x1="2" y1="24" x2="38" y2="24" stroke="#451a03" strokeWidth="1.2" />
        {/* Apples */}
        <circle cx="12" cy="12" r="6.5" fill="url(#appleRed)" stroke="#450a0a" strokeWidth="0.8" />
        <circle cx="10" cy="10" r="1.5" fill="#fff" fillOpacity="0.5" />
        <circle cx="22" cy="10" r="6.5" fill="url(#appleRed)" stroke="#450a0a" strokeWidth="0.8" />
        <circle cx="20" cy="8" r="1.5" fill="#fff" fillOpacity="0.5" />
        <circle cx="31" cy="12" r="6" fill="url(#appleRed)" stroke="#450a0a" strokeWidth="0.8" />
        <circle cx="29" cy="10" r="1.5" fill="#fff" fillOpacity="0.5" />
      </g>

      {/* Crate 3: Earthy Potatoes (Right) */}
      <g transform="translate(94, 6)">
        <polygon points="0,12 40,12 36,38 4,38" fill="url(#crateWood)" stroke="#291203" strokeWidth="1.5" />
        <line x1="2" y1="24" x2="38" y2="24" stroke="#451a03" strokeWidth="1.2" />
        {/* Potatoes */}
        <ellipse cx="12" cy="12" rx="7" ry="5.5" transform="rotate(10 12 12)" fill="#a8a29e" stroke="#44403c" strokeWidth="0.8" />
        <ellipse cx="22" cy="11" rx="8" ry="6" transform="rotate(-12 22 11)" fill="#78716c" stroke="#292524" strokeWidth="0.8" />
        <ellipse cx="30" cy="13" rx="6.5" ry="5" transform="rotate(25 30 13)" fill="#a8a29e" stroke="#44403c" strokeWidth="0.8" />
      </g>
    </svg>
  );
}

// 4. Grand Stone & Brick Hearth with Animated Vector Flames
export function GrandHearthSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 160 140" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brickGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#991b1b" />
          <stop offset="50%" stopColor="#7f1d1d" />
          <stop offset="100%" stopColor="#450a0a" />
        </linearGradient>
        <radialGradient id="flameCenter" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="75%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#b91c1c" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hearthGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
          <stop offset="70%" stopColor="#b45309" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Hearth Ambient Glow */}
      <circle cx="80" cy="110" r="50" fill="url(#hearthGlow)" />

      {/* Chimney Flue Column */}
      <rect x="42" y="0" width="76" height="48" fill="url(#brickGrad)" stroke="#290505" strokeWidth="2" />
      {/* Brick relief lines */}
      <line x1="42" y1="12" x2="118" y2="12" stroke="#450a0a" strokeWidth="1" />
      <line x1="42" y1="24" x2="118" y2="24" stroke="#450a0a" strokeWidth="1" />
      <line x1="42" y1="36" x2="118" y2="36" stroke="#450a0a" strokeWidth="1" />
      <line x1="60" y1="0" x2="60" y2="12" stroke="#450a0a" strokeWidth="1" />
      <line x1="88" y1="0" x2="88" y2="12" stroke="#450a0a" strokeWidth="1" />
      <line x1="74" y1="12" x2="74" y2="24" stroke="#450a0a" strokeWidth="1" />
      <line x1="102" y1="12" x2="102" y2="24" stroke="#450a0a" strokeWidth="1" />

      {/* Carved Oak Mantelpiece Shelf */}
      <rect x="24" y="44" width="112" height="13" rx="2" fill="#78350f" stroke="#451a03" strokeWidth="2" />
      <line x1="26" y1="46" x2="134" y2="46" stroke="#fde68a" strokeWidth="1" strokeOpacity="0.5" />

      {/* Props on Mantel */}
      {/* Carriage Clock */}
      <rect x="73" y="30" width="14" height="14" rx="2" fill="#d97706" stroke="#78350f" strokeWidth="1" />
      <circle cx="80" cy="37" r="5" fill="#fef3c7" stroke="#451a03" strokeWidth="0.6" />
      <line x1="80" y1="37" x2="80" y2="34" stroke="#000" strokeWidth="0.8" />
      <line x1="80" y1="37" x2="83" y2="37" stroke="#000" strokeWidth="0.8" />

      {/* Candle in Brass Holder */}
      <g transform="translate(36, 28)">
        <ellipse cx="6" cy="16" rx="5" ry="1.5" fill="#d97706" stroke="#78350f" strokeWidth="0.6" />
        <rect x="5" y="4" width="2.5" height="12" fill="#fef3c7" stroke="#d4d4d8" strokeWidth="0.5" />
        {/* Flame */}
        <ellipse cx="6" cy="1" rx="1.8" ry="3" fill="#f59e0b" />
        <circle cx="6" cy="2" r="1" fill="#fff" />
      </g>

      {/* Arched Fireplace Hearth Opening */}
      <path d="M 36 130 L 36 78 Q 80 52 124 78 L 124 130 Z" fill="#18181b" stroke="#450a0a" strokeWidth="3" />

      {/* Firewood Logs */}
      <ellipse cx="68" cy="116" rx="22" ry="6" transform="rotate(-12 68 116)" fill="#78350f" stroke="#291203" strokeWidth="1.2" />
      <ellipse cx="92" cy="116" rx="22" ry="6" transform="rotate(12 92 116)" fill="#92400e" stroke="#291203" strokeWidth="1.2" />

      {/* Vector Flame Shapes with Layered Glowing Pulsing Paths */}
      <g className="vector-hearth-flames">
        <path d="M 64 120 Q 56 94 72 74 Q 82 92 80 120 Z" fill="url(#flameCenter)" opacity="0.9" />
        <path d="M 78 120 Q 94 88 88 68 Q 106 88 96 120 Z" fill="url(#flameCenter)" opacity="0.9" />
        <path d="M 72 120 Q 80 84 80 72 Q 88 84 88 120 Z" fill="#fef08a" opacity="0.95" />
        {/* Sparks */}
        <circle cx="74" cy="62" r="1.5" fill="#fef08a" />
        <circle cx="86" cy="58" r="1.2" fill="#fde047" />
        <circle cx="82" cy="50" r="1" fill="#f59e0b" />
      </g>
    </svg>
  );
}

// 5. Authentic Stardew Folk Carpet with Medallion
export function CentralCarpetSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="carpetBase" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="55%" stopColor="#b45309" />
          <stop offset="85%" stopColor="#78350f" />
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
      </defs>

      {/* Outer Woven Tassel Fringe */}
      <circle cx="100" cy="100" r="96" fill="none" stroke="#fef3c7" strokeWidth="4" strokeDasharray="3 3" />
      {/* Outer Border Ring */}
      <circle cx="100" cy="100" r="92" fill="url(#carpetBase)" stroke="#291203" strokeWidth="4" />
      {/* Middle Decorative Ring */}
      <circle cx="100" cy="100" r="74" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="6 4" />
      <circle cx="100" cy="100" r="66" fill="#92400e" stroke="#451a03" strokeWidth="2" />
      {/* Inner Cream Medallion */}
      <circle cx="100" cy="100" r="44" fill="#fef3c7" stroke="#78350f" strokeWidth="3" />
      {/* Center Wheat / Oak Leaf Emblem */}
      <path d="M 100 70 Q 112 85 100 100 Q 88 85 100 70 Z" fill="#b45309" />
      <path d="M 100 100 Q 112 115 100 130 Q 88 115 100 100 Z" fill="#b45309" />
      <path d="M 70 100 Q 85 112 100 100 Q 85 88 70 100 Z" fill="#b45309" />
      <path d="M 100 100 Q 115 112 130 100 Q 115 88 100 100 Z" fill="#b45309" />
      <circle cx="100" cy="100" r="6" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
    </svg>
  );
}

// 6. Sacred Altar with Glowing Hovering Crystal Star
export function ShrineAltarSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 140 120" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldPedestal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="35%" stopColor="#f59e0b" />
          <stop offset="80%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#fef08a" />
          <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Stepped Altar Stone Base */}
      <polygon points="15,115 125,115 115,95 25,95" fill="#451a03" stroke="#291203" strokeWidth="2" />
      <polygon points="25,95 115,95 105,75 35,75" fill="url(#goldPedestal)" stroke="#78350f" strokeWidth="2" />
      <polygon points="35,75 105,75 100,65 40,65" fill="#fef08a" stroke="#78350f" strokeWidth="1.5" />

      {/* Carved Rune Relief on Pedestal */}
      <circle cx="70" cy="85" r="7" fill="none" stroke="#78350f" strokeWidth="1.5" />
      <line x1="70" y1="78" x2="70" y2="92" stroke="#78350f" strokeWidth="1.2" />
      <line x1="63" y1="85" x2="77" y2="85" stroke="#78350f" strokeWidth="1.2" />

      {/* Ambient Celestial Glow Behind Floating Star */}
      <circle cx="70" cy="38" r="32" fill="url(#crystalGlow)" />

      {/* Floating Multifaceted Golden / Diamond Star Relic */}
      <g transform="translate(70, 38)">
        {/* Outer 8-point Facets */}
        <polygon points="0,-24 6,-7 24,0 6,7 0,24 -6,7 -24,0 -6,-7" fill="#ffffff" stroke="#f59e0b" strokeWidth="1.2" />
        <polygon points="0,-16 4,-5 16,0 4,5 0,16 -4,5 -16,0 -4,-5" fill="#38bdf8" />
        {/* Core Diamond */}
        <polygon points="0,-9 9,0 0,9 -9,0" fill="#fef08a" stroke="#ffffff" strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#ffffff" />
      </g>
    </svg>
  );
}

// 7. Velvet Pews & Benches for the Shrine Sanctuary
export function ShrineBenchesSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 160 80" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="benchWood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
        <linearGradient id="royalVelvet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="35%" stopColor="#0284c7" />
          <stop offset="85%" stopColor="#0369a1" />
          <stop offset="100%" stopColor="#0c4a6e" />
        </linearGradient>
      </defs>

      {/* Bench Row 1 (Back Row) */}
      <g transform="translate(10, 8)">
        {/* Wooden Frame */}
        <rect x="0" y="8" width="140" height="22" rx="3" fill="url(#benchWood)" stroke="#291203" strokeWidth="1.5" />
        {/* Turned Posts */}
        <rect x="-2" y="2" width="6" height="30" rx="1.5" fill="#451a03" />
        <rect x="136" y="2" width="6" height="30" rx="1.5" fill="#451a03" />
        {/* Blue Velvet Cushion */}
        <rect x="6" y="11" width="128" height="15" rx="3" fill="url(#royalVelvet)" stroke="#bae6fd" strokeWidth="0.8" />
        {/* Tufted Buttons */}
        <circle cx="26" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="56" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="86" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="114" cy="18" r="1.5" fill="#fef08a" />
      </g>

      {/* Bench Row 2 (Front Row) */}
      <g transform="translate(10, 44)">
        <rect x="0" y="8" width="140" height="22" rx="3" fill="url(#benchWood)" stroke="#291203" strokeWidth="1.5" />
        <rect x="-2" y="2" width="6" height="30" rx="1.5" fill="#451a03" />
        <rect x="136" y="2" width="6" height="30" rx="1.5" fill="#451a03" />
        <rect x="6" y="11" width="128" height="15" rx="3" fill="url(#royalVelvet)" stroke="#bae6fd" strokeWidth="0.8" />
        <circle cx="26" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="56" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="86" cy="18" r="1.5" fill="#fef08a" />
        <circle cx="114" cy="18" r="1.5" fill="#fef08a" />
      </g>
    </svg>
  );
}

// 8. Tea Table with Teapot, Teacups & Steaming Vapor
export function TeaTableSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 100 70" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="teaTableTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="50%" stopColor="#92400e" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>
      </defs>

      {/* Pedestal Legs */}
      <rect x="47" y="32" width="6" height="28" fill="#451a03" />
      <path d="M 32 60 Q 50 56 68 60 L 64 63 Q 50 60 36 63 Z" fill="#291203" />

      {/* Tabletop Surface */}
      <ellipse cx="50" cy="32" rx="42" ry="16" fill="url(#teaTableTop)" stroke="#291203" strokeWidth="2" />
      <ellipse cx="50" cy="30" rx="38" ry="14" fill="#a16207" stroke="#fde68a" strokeWidth="0.8" strokeOpacity="0.5" />

      {/* Porcelain Teapot (Center) */}
      <g transform="translate(42, 10)">
        <ellipse cx="8" cy="13" rx="7" ry="8" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8" />
        {/* Lid */}
        <ellipse cx="8" cy="5" rx="4.5" ry="2" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8" />
        <circle cx="8" cy="3" r="1.5" fill="#f59e0b" />
        {/* Spout */}
        <path d="M 1 12 Q -5 9 -4 4 Q -1 6 3 10 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="0.8" />
        {/* Handle */}
        <path d="M 15 8 Q 20 12 14 17" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
        {/* Steam */}
        <path d="M -4 2 Q -7 -3 -3 -7" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />
      </g>

      {/* Teacup Left */}
      <g transform="translate(24, 22)">
        <ellipse cx="6" cy="9" rx="5" ry="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
        <path d="M 2 4 L 10 4 L 9 8 Q 6 10 3 8 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="0.6" />
        <ellipse cx="6" cy="4" rx="4" ry="1.5" fill="#d97706" />
      </g>

      {/* Teacup Right */}
      <g transform="translate(64, 22)">
        <ellipse cx="6" cy="9" rx="5" ry="2" fill="#78350f" stroke="#451a03" strokeWidth="0.6" />
        <path d="M 2 4 L 10 4 L 9 8 Q 6 10 3 8 Z" fill="#ffffff" stroke="#0284c7" strokeWidth="0.6" />
        <ellipse cx="6" cy="4" rx="4" ry="1.5" fill="#d97706" />
      </g>
    </svg>
  );
}

// 9. Retro Wood-Grain CRT Television
export function RetroTvSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 80 75" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      {/* Antennas */}
      <line x1="38" y1="12" x2="22" y2="2" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="12" x2="58" y2="2" stroke="#d4d4d8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Walnut Cabinet */}
      <rect x="6" y="12" width="68" height="50" rx="6" fill="#78350f" stroke="#291203" strokeWidth="2.5" />
      <rect x="9" y="15" width="62" height="44" rx="4" fill="#522504" />

      {/* CRT Curved Screen */}
      <rect x="12" y="18" width="44" height="38" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
      <rect x="15" y="21" width="38" height="32" rx="4" fill="#0284c7" fillOpacity="0.15" />
      {/* Scanline reflections */}
      <line x1="16" y1="26" x2="48" y2="26" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="16" y1="32" x2="44" y2="32" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.2" />

      {/* Control Dials & Speaker Louvers (Right Panel) */}
      <circle cx="63" cy="24" r="3.5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
      <circle cx="63" cy="33" r="3.5" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
      {/* Speaker slits */}
      <line x1="59" y1="42" x2="67" y2="42" stroke="#291203" strokeWidth="1.2" />
      <line x1="59" y1="46" x2="67" y2="46" stroke="#291203" strokeWidth="1.2" />
      <line x1="59" y1="50" x2="67" y2="50" stroke="#291203" strokeWidth="1.2" />

      {/* Table Stand */}
      <rect x="22" y="62" width="36" height="12" rx="2" fill="#451a03" stroke="#291203" strokeWidth="1.5" />
    </svg>
  );
}

// 10. Cozy Wooden Four-Poster Bed with Red Quilt
export function CozyBedSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 90 120" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="quiltPattern" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dc2626" />
          <stop offset="50%" stopColor="#b91c1c" />
          <stop offset="100%" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>

      {/* Headboard Wooden Posts & Slats */}
      <rect x="4" y="6" width="82" height="24" rx="3" fill="#522504" stroke="#291203" strokeWidth="2" />
      {/* Bedposts */}
      <rect x="2" y="0" width="8" height="34" rx="2" fill="#78350f" stroke="#291203" strokeWidth="1.5" />
      <circle cx="6" cy="0" r="3" fill="#f59e0b" />
      <rect x="80" y="0" width="8" height="34" rx="2" fill="#78350f" stroke="#291203" strokeWidth="1.5" />
      <circle cx="84" cy="0" r="3" fill="#f59e0b" />

      {/* White Feathered Pillow */}
      <rect x="16" y="24" width="58" height="20" rx="6" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
      <ellipse cx="45" cy="34" rx="14" ry="4" fill="#e2e8f0" />

      {/* Red Quilt Mattress Area */}
      <rect x="8" y="42" width="74" height="72" rx="4" fill="url(#quiltPattern)" stroke="#450a0a" strokeWidth="2" />
      {/* Golden Fold Trim */}
      <line x1="8" y1="44" x2="82" y2="44" stroke="#fef08a" strokeWidth="3" />
      {/* Quilted diamond stitching */}
      <line x1="16" y1="60" x2="45" y2="85" stroke="#fef08a" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="74" y1="60" x2="45" y2="85" stroke="#fef08a" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="16" y1="90" x2="45" y2="115" stroke="#fef08a" strokeWidth="0.8" strokeOpacity="0.4" />
      <line x1="74" y1="90" x2="45" y2="115" stroke="#fef08a" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Footboard */}
      <rect x="6" y="112" width="78" height="8" rx="2" fill="#78350f" stroke="#291203" strokeWidth="1.5" />
    </svg>
  );
}

// 11. Potted Houseplant (Ficus / Monstera)
export function PottedPlantSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 60 75" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      {/* Stems */}
      <path d="M 30 50 Q 22 35 15 20" stroke="#365314" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 30 50 Q 38 32 45 18" stroke="#365314" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 30 46 Q 30 25 30 10" stroke="#365314" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Leaves with Dual-Tone Shading */}
      <g transform="translate(15, 20)">
        <ellipse cx="0" cy="0" rx="12" ry="7" transform="rotate(-35)" fill="#65a30d" stroke="#1a2e05" strokeWidth="1" />
        <line x1="-9" y1="6" x2="9" y2="-6" stroke="#a3e635" strokeWidth="1" />
      </g>
      <g transform="translate(45, 18)">
        <ellipse cx="0" cy="0" rx="12" ry="7" transform="rotate(35)" fill="#84cc16" stroke="#1a2e05" strokeWidth="1" />
        <line x1="-9" y1="-6" x2="9" y2="6" stroke="#d9f99d" strokeWidth="1" />
      </g>
      <g transform="translate(30, 10)">
        <ellipse cx="0" cy="0" rx="8" ry="14" fill="#4d7c0f" stroke="#1a2e05" strokeWidth="1" />
        <line x1="0" y1="-12" x2="0" y2="12" stroke="#bef264" strokeWidth="1" />
      </g>

      {/* Terracotta Clay Pot */}
      <polygon points="16,48 44,48 40,72 20,72" fill="#c2410c" stroke="#431407" strokeWidth="1.5" />
      <rect x="14" y="44" width="32" height="6" rx="1.5" fill="#ea580c" stroke="#431407" strokeWidth="1.2" />
    </svg>
  );
}

// 12. Wrapped Gift Parcel with Satin Ribbon & Bow
export function GiftParcelSVG({ className = '', style = {} }) {
  return (
    <svg 
      viewBox="0 0 50 50" 
      className={`stardew-vector-asset ${className}`} 
      style={{ width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="giftBoxGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>
      </defs>

      {/* Box Base */}
      <rect x="6" y="16" width="38" height="30" rx="3" fill="url(#giftBoxGrad)" stroke="#451a03" strokeWidth="1.5" />
      {/* Box Lid */}
      <rect x="4" y="12" width="42" height="7" rx="2" fill="#ca8a04" stroke="#451a03" strokeWidth="1.5" />

      {/* Blue Ribbon Vertical Strip */}
      <rect x="22" y="12" width="6" height="34" fill="#0284c7" />
      {/* Blue Ribbon Horizontal Strip */}
      <rect x="6" y="28" width="38" height="6" fill="#0284c7" />

      {/* Top Ribbon Bow Loops */}
      <ellipse cx="18" cy="8" rx="6" ry="4" transform="rotate(-25 18 8)" fill="#38bdf8" stroke="#0369a1" strokeWidth="0.8" />
      <ellipse cx="32" cy="8" rx="6" ry="4" transform="rotate(25 32 8)" fill="#38bdf8" stroke="#0369a1" strokeWidth="0.8" />
      <circle cx="25" cy="11" r="2.5" fill="#0284c7" />
    </svg>
  );
}

// 13. High-Quality Vector Anchor Token Icons (For Memory Loci)
export function VectorAnchorToken({ icon = 'key', size = 28, className = '' }) {
  const s = size;

  switch (icon) {
    case 'key':
    case '🔑':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="10" cy="12" r="7" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="10" cy="12" r="3.5" fill="#78350f" />
          <line x1="16" y1="14" x2="28" y2="24" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="22" y1="19" x2="24" y2="16" stroke="#f59e0b" strokeWidth="2.5" />
          <line x1="26" y1="22" x2="28" y2="19" stroke="#f59e0b" strokeWidth="2.5" />
        </svg>
      );

    case 'scroll':
    case '📜':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M 6 8 Q 12 4 18 8 L 26 6 Q 24 14 26 22 Q 20 18 14 22 L 6 24 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />
          <line x1="9" y1="11" x2="22" y2="9" stroke="#b45309" strokeWidth="1" />
          <line x1="9" y1="15" x2="22" y2="13" stroke="#b45309" strokeWidth="1" />
          <line x1="9" y1="19" x2="18" y2="18" stroke="#b45309" strokeWidth="1" />
          <circle cx="20" cy="22" r="3.5" fill="#dc2626" />
        </svg>
      );

    case 'compass':
    case '🧭':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="13" fill="#fef08a" stroke="#78350f" strokeWidth="2" />
          <circle cx="16" cy="16" r="10" fill="#451a03" />
          <polygon points="16,8 19,16 16,15 13,16" fill="#ef4444" />
          <polygon points="16,24 19,16 16,17 13,16" fill="#f8fafc" />
          <circle cx="16" cy="16" r="2" fill="#fde047" />
        </svg>
      );

    case 'book':
    case '📚':
    case '📖':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="6" y="5" width="20" height="23" rx="3" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1.5" />
          <rect x="9" y="7" width="15" height="19" rx="1.5" fill="#fef3c7" />
          <line x1="6" y1="5" x2="6" y2="28" stroke="#f59e0b" strokeWidth="2.5" />
          <circle cx="16" cy="16" r="3.5" fill="none" stroke="#b45309" strokeWidth="1" />
        </svg>
      );

    case 'gem':
    case '💎':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <polygon points="10,6 22,6 29,14 16,28 3,14" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
          <polygon points="10,6 22,6 20,14 12,14" fill="#bae6fd" />
          <line x1="3" y1="14" x2="29" y2="14" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="12" y1="14" x2="16" y2="28" stroke="#0284c7" strokeWidth="1.2" />
          <line x1="20" y1="14" x2="16" y2="28" stroke="#0284c7" strokeWidth="1.2" />
        </svg>
      );

    case 'shield':
    case '🛡️':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M 6 6 L 26 6 L 26 16 Q 26 26 16 30 Q 6 26 6 16 Z" fill="#0284c7" stroke="#082f49" strokeWidth="2" />
          <line x1="16" y1="6" x2="16" y2="30" stroke="#f59e0b" strokeWidth="2" />
          <line x1="6" y1="16" x2="26" y2="16" stroke="#f59e0b" strokeWidth="2" />
        </svg>
      );

    case 'sword':
    case '⚔️':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <line x1="26" y1="6" x2="10" y2="22" stroke="#e2e8f0" strokeWidth="3" strokeLinecap="round" />
          <line x1="26" y1="6" x2="10" y2="22" stroke="#64748b" strokeWidth="1" />
          <line x1="8" y1="18" x2="14" y2="24" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="22" x2="5" y2="27" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="5" cy="27" r="2" fill="#f59e0b" />
        </svg>
      );

    case 'clock':
    case '⏰':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="18" r="11" fill="#fef3c7" stroke="#78350f" strokeWidth="2" />
          <line x1="16" y1="18" x2="16" y2="11" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="16" y1="18" x2="21" y2="18" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
          {/* Bells */}
          <ellipse cx="9" cy="8" rx="3.5" ry="2" transform="rotate(-30 9 8)" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
          <ellipse cx="23" cy="8" rx="3.5" ry="2" transform="rotate(30 23 8)" fill="#f59e0b" stroke="#78350f" strokeWidth="1" />
        </svg>
      );

    case 'coffee':
    case '☕':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="7" y="10" width="14" height="15" rx="3" fill="#ffffff" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 21 13 Q 26 13 25 19 Q 24 23 21 21" fill="none" stroke="#78350f" strokeWidth="2" />
          <ellipse cx="14" cy="10" rx="7" ry="2.5" fill="#78350f" />
          {/* Steam */}
          <path d="M 11 6 Q 9 3 11 1" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 16 6 Q 18 3 16 1" stroke="#a1a1aa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
        </svg>
      );

    case 'star':
    case '🌟':
    case '✨':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <polygon points="16,3 20,12 29,12 22,18 25,28 16,21 7,28 10,18 3,12 12,12" fill="#fde047" stroke="#b45309" strokeWidth="1.5" />
          <circle cx="16" cy="15" r="3" fill="#ffffff" />
        </svg>
      );

    case 'potion':
    case '🧪':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <ellipse cx="16" cy="22" rx="10" ry="8" fill="#a855f7" stroke="#4a044e" strokeWidth="1.5" />
          <rect x="13" y="7" width="6" height="9" fill="#e9d5ff" stroke="#4a044e" strokeWidth="1.2" />
          <rect x="12" y="4" width="8" height="3.5" rx="1" fill="#78350f" />
          <circle cx="14" cy="22" r="2.5" fill="#ffffff" fillOpacity="0.6" />
        </svg>
      );

    case 'wheat':
    case '🌾':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <line x1="8" y1="28" x2="24" y2="4" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="18" cy="10" rx="3.5" ry="6" transform="rotate(45 18 10)" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
          <ellipse cx="14" cy="14" rx="3.5" ry="6" transform="rotate(-45 14 14)" fill="#facc15" stroke="#713f12" strokeWidth="0.8" />
          <ellipse cx="20" cy="16" rx="3.5" ry="6" transform="rotate(45 20 16)" fill="#eab308" stroke="#713f12" strokeWidth="0.8" />
        </svg>
      );

    case 'phone':
    case '📱':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="9" y="3" width="14" height="26" rx="3.5" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.2" />
          <rect x="11" y="6" width="10" height="19" rx="1" fill="#38bdf8" fillOpacity="0.9" />
          <line x1="14" y1="4.5" x2="18" y2="4.5" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />
          <circle cx="16" cy="27" r="1.2" fill="#94a3b8" />
          <line x1="12" y1="8" x2="15" y2="8" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.8" />
        </svg>
      );

    case 'sunglasses':
    case '🕶️':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M 4 11 Q 16 9 28 11" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Left Lens */}
          <path d="M 5 12 L 13 12 C 13 18.5, 7 20, 5 16 Z" fill="#09090b" stroke="#18181b" strokeWidth="1.2" />
          <line x1="7" y1="13" x2="11" y2="17" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.75" />
          {/* Right Lens */}
          <path d="M 19 12 L 27 12 C 27 20, 21 18.5, 19 16 Z" fill="#09090b" stroke="#18181b" strokeWidth="1.2" />
          <line x1="21" y1="13" x2="25" y2="17" stroke="#38bdf8" strokeWidth="1.2" strokeOpacity="0.75" />
        </svg>
      );

    case 'shirt':
    case '👕':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <path d="M 10 7 L 13 10 L 19 10 L 22 7 L 27 10 L 24 16 L 21 15 L 21 27 L 11 27 L 11 15 L 8 16 L 5 10 Z" 
                fill="#ef4444" stroke="#991b1b" strokeWidth="1.2" />
          <polygon points="13,10 16,13 19,10" fill="#fee2e2" stroke="#991b1b" strokeWidth="0.6" />
          <line x1="16" y1="14" x2="16" y2="24" stroke="#b91c1c" strokeWidth="1" strokeDasharray="1,2" />
        </svg>
      );

    case 'water_bottle':
    case '🍶':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="11" y="9" width="10" height="19" rx="3.5" fill="#0284c7" stroke="#0369a1" strokeWidth="1.2" />
          <rect x="13" y="4" width="6" height="5" rx="1.5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
          <rect x="12" y="14" width="8" height="6" rx="1" fill="#e0f2fe" fillOpacity="0.4" />
          <line x1="13" y1="10" x2="13" y2="26" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round" />
        </svg>
      );

    case 'dumbbell':
    case '🏋️':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <line x1="8" y1="16" x2="24" y2="16" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
          <rect x="5" y="10" width="4" height="12" rx="1.5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
          <rect x="23" y="10" width="4" height="12" rx="1.5" fill="#334155" stroke="#0f172a" strokeWidth="1" />
          <rect x="3" y="12" width="2" height="8" rx="1" fill="#475569" />
          <rect x="27" y="12" width="2" height="8" rx="1" fill="#475569" />
        </svg>
      );

    case 'backpack':
    case '🎒':
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <rect x="8" y="9" width="16" height="19" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="1.2" />
          <rect x="10" y="17" width="12" height="9" rx="2" fill="#b45309" stroke="#78350f" strokeWidth="0.8" />
          <path d="M 12 9 C 12 4, 20 4, 20 9" fill="none" stroke="#78350f" strokeWidth="2" strokeLinecap="round" />
          <circle cx="16" cy="14" r="1.5" fill="#fde68a" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 32 32" className={className} aria-hidden="true">
          <circle cx="16" cy="16" r="12" fill="#f59e0b" stroke="#78350f" strokeWidth="2" />
          <circle cx="16" cy="16" r="4" fill="#ffffff" />
        </svg>
      );
  }
}

// Available Token Catalog
export const VECTOR_ANCHOR_TOKENS = [
  { id: 'phone', label: 'טלפון', icon: 'phone' },
  { id: 'sunglasses', label: 'משקפי שמש', icon: 'sunglasses' },
  { id: 'shirt', label: 'חולצה', icon: 'shirt' },
  { id: 'water_bottle', label: 'בקבוק מים', icon: 'water_bottle' },
  { id: 'dumbbell', label: 'משקולת', icon: 'dumbbell' },
  { id: 'backpack', label: 'תיק', icon: 'backpack' },
  { id: 'key', label: 'מפתח', icon: 'key' },
  { id: 'scroll', label: 'מגילה', icon: 'scroll' },
  { id: 'compass', label: 'מצפן', icon: 'compass' },
  { id: 'book', label: 'ספר', icon: 'book' },
  { id: 'gem', label: 'קריסטל', icon: 'gem' },
  { id: 'shield', label: 'מגן', icon: 'shield' },
  { id: 'sword', label: 'חרב', icon: 'sword' },
  { id: 'clock', label: 'שעון', icon: 'clock' },
  { id: 'coffee', label: 'ספל', icon: 'coffee' },
  { id: 'star', label: 'כוכב', icon: 'star' },
  { id: 'potion', label: 'שיקוי', icon: 'potion' },
  { id: 'wheat', label: 'שיבולת', icon: 'wheat' }
];
