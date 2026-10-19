import React from 'react';

// =========================================================================
// GRAND BOTANICAL CONSERVATORY ARCHITECTURAL SHELL
// Built under [MASTER ROOM FRAMER] & [2.5D AMBIENT SHADOWS & LIGHTING] Skills
// Features:
// 1. Unified 45° Chamfered Timber Framing with Concentric Brass Inlay (#c6923c)
// 2. Terracotta Paver Flooring, Mossy Stone Raised Beds & Tilled Soil
// 3. Stained Glass Conservatory Skylights with Volumetric Sunlight Cones
// 4. Dedicated Zones: Germination Bench, Root Veggie Beds, Herb Trellis, Wildflower Sanctuary
// =========================================================================

export const GARDEN_W = 1100;
export const GARDEN_H = 660;

export function GardenArchitectureSVG() {
  return (
    <svg 
      className="garden-architecture-svg"
      viewBox={`0 0 ${GARDEN_W} ${GARDEN_H}`}
      width={GARDEN_W} 
      height={GARDEN_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* Floor Terracotta Pavers Pattern */}
        <pattern id="gardenPavers" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#8d4925" />
          <path d="M 0,0 L 32,0 L 32,32 L 0,32 Z" fill="none" stroke="#5a2a14" strokeWidth="1.5" />
          <rect x="2" y="2" width="28" height="28" fill="#9e532b" rx="2" />
          <path d="M 2,16 L 30,16 M 16,2 L 16,30" stroke="#7c3a1b" strokeWidth="1" opacity="0.6" />
          <circle cx="8" cy="8" r="1.5" fill="#3f6212" opacity="0.4" />
          <circle cx="24" cy="22" r="2" fill="#4d7c0f" opacity="0.35" />
        </pattern>

        {/* Tilled Loam Soil Pattern for Plots */}
        <pattern id="gardenSoil" width="24" height="12" patternUnits="userSpaceOnUse">
          <rect width="24" height="12" fill="#2d1a0e" />
          <path d="M 0,3 Q 6,0 12,3 T 24,3" stroke="#1d1008" strokeWidth="1.8" fill="none" />
          <path d="M 0,9 Q 6,6 12,9 T 24,9" stroke="#3d2414" strokeWidth="1.5" fill="none" />
          <circle cx="4" cy="6" r="1" fill="#4a2e1b" />
          <circle cx="16" cy="11" r="1.2" fill="#140b05" />
        </pattern>

        {/* Conservatory Stained Glass Header Pattern */}
        <linearGradient id="glassRoofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#14b8a6" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.35" />
        </linearGradient>

        {/* Volumetric Sunlight Cone */}
        <linearGradient id="sunBeamGrad" x1="20%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.42" />
          <stop offset="40%" stopColor="#fef3c7" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
        </linearGradient>

        {/* Soft Ambient Contact Shadow */}
        <radialGradient id="gardenDropShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#050805" stopOpacity="0.75" />
          <stop offset="70%" stopColor="#050805" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#050805" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 1. BLACK RPG VOID BASE */}
      <rect width={GARDEN_W} height={GARDEN_H} fill="#060806" />

      {/* 2. MAIN CONSERVATORY FLOOR PLAN (Terracotta Paver Polygons) */}
      <g className="conservatory-floors">
        {/* Central Atrium Floor */}
        <rect x="360" y="190" width="380" height="260" fill="url(#gardenPavers)" />
        {/* North Root Bed Wing Floor */}
        <polygon points="340,110 760,110 760,200 340,200" fill="url(#gardenPavers)" />
        {/* West Germination Wing Floor */}
        <polygon points="120,210 380,210 380,440 150,440 120,410" fill="url(#gardenPavers)" />
        {/* East Herb Wing Floor */}
        <polygon points="720,210 980,210 980,410 950,440 720,440" fill="url(#gardenPavers)" />
        {/* South Wildflower Sanctuary Floor */}
        <polygon points="360,430 740,430 740,520 710,550 390,550 360,520" fill="url(#gardenPavers)" />
        {/* Exit Stoop */}
        <rect x="500" y="550" width="100" height="34" fill="#6c3417" stroke="#4a220e" strokeWidth="2" />
      </g>

      {/* 3. WALLS & ELEVATIONS (Dual Surface: Wainscot + Botanical Moss Ashlar) */}
      <g className="conservatory-walls">
        {/* North Back Wall Elevation (Y: 60 - 110) */}
        <rect x="340" y="60" width="420" height="50" fill="#243320" stroke="#132011" strokeWidth="2" />
        {/* Wall Ivy & Decorative Trellis */}
        <line x1="340" y1="85" x2="760" y2="85" stroke="#3f6212" strokeWidth="2" strokeDasharray="6,4" />
        <rect x="340" y="95" width="420" height="15" fill="#3b2516" stroke="#24140a" strokeWidth="1" />

        {/* West Wing Back Wall Elevation (Y: 160 - 210) */}
        <rect x="120" y="160" width="240" height="50" fill="#1e2c1c" stroke="#132011" strokeWidth="2" />
        <rect x="120" y="195" width="240" height="15" fill="#3b2516" stroke="#24140a" strokeWidth="1" />

        {/* East Wing Back Wall Elevation (Y: 160 - 210) */}
        <rect x="740" y="160" width="240" height="50" fill="#1e2c1c" stroke="#132011" strokeWidth="2" />
        <rect x="740" y="195" width="240" height="15" fill="#3b2516" stroke="#24140a" strokeWidth="1" />

        {/* Stained Glass Domed Windows on Back Wall */}
        <g className="stained-glass-windows">
          {/* North Center Glass Dome */}
          <path d="M 500,105 Q 550,68 600,105 Z" fill="url(#glassRoofGrad)" stroke="#134e4a" strokeWidth="2.5" />
          <line x1="550" y1="72" x2="550" y2="105" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
          <path d="M 525,88 Q 550,82 575,88" stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.7" />

          {/* West Window */}
          <path d="M 200,205 Q 240,175 280,205 Z" fill="url(#glassRoofGrad)" stroke="#134e4a" strokeWidth="2" />
          {/* East Window */}
          <path d="M 820,205 Q 860,175 900,205 Z" fill="url(#glassRoofGrad)" stroke="#134e4a" strokeWidth="2" />
        </g>
      </g>

      {/* 4. PERIMETER FRAMING ENVELOPE (Master Room Framer standard with concentric gold inlay) */}
      <g className="conservatory-framing">
        {/* Outer Solid Timber Body Path */}
        <path 
          d="
            M 500,584 L 390,584 L 348,542 L 348,440 L 140,440 L 108,408 L 108,210 L 328,210 L 328,110 L 340,98 L 760,98 L 772,110 L 772,210 L 992,210 L 992,408 L 960,440 L 752,440 L 752,542 L 710,584 L 600,584
          " 
          fill="none" 
          stroke="#26150b" 
          strokeWidth="24" 
          strokeLinejoin="round" 
        />
        
        {/* Warm Timber Core Bevel */}
        <path 
          d="
            M 500,584 L 390,584 L 348,542 L 348,440 L 140,440 L 108,408 L 108,210 L 328,210 L 328,110 L 340,98 L 760,98 L 772,110 L 772,210 L 992,210 L 992,408 L 960,440 L 752,440 L 752,542 L 710,584 L 600,584
          " 
          fill="none" 
          stroke="#422513" 
          strokeWidth="16" 
          strokeLinejoin="round" 
        />

        {/* Refined Concentric Golden/Brass Inlay Pinstripe (#c6923c) */}
        <path 
          d="
            M 500,584 L 390,584 L 348,542 L 348,440 L 140,440 L 108,408 L 108,210 L 328,210 L 328,110 L 340,98 L 760,98 L 772,110 L 772,210 L 992,210 L 992,408 L 960,440 L 752,440 L 752,542 L 710,584 L 600,584
          " 
          fill="none" 
          stroke="#d4a359" 
          strokeWidth="3.2" 
          strokeLinejoin="round" 
        />
        <path 
          d="
            M 500,584 L 390,584 L 348,542 L 348,440 L 140,440 L 108,408 L 108,210 L 328,210 L 328,110 L 340,98 L 760,98 L 772,110 L 772,210 L 992,210 L 992,408 L 960,440 L 752,440 L 752,542 L 710,584 L 600,584
          " 
          fill="none" 
          stroke="#fef08a" 
          strokeWidth="1.2" 
          strokeLinejoin="round" 
        />
      </g>

      {/* 5. RAISED GARDEN PLOTS & BOTANICAL FIXTURES */}
      <g className="garden-plots-fixtures">
        {/* NORTH WING: 3 Raised Root Vegetable Soil Beds */}
        {/* Bed 1 (Left) */}
        <g transform="translate(365, 125)">
          <rect x="-4" y="-4" width="108" height="64" rx="4" fill="#1b120c" opacity="0.6" />
          <rect x="0" y="0" width="100" height="56" rx="4" fill="#5c381f" stroke="#3b2211" strokeWidth="2" />
          <rect x="6" y="6" width="88" height="44" rx="2" fill="url(#gardenSoil)" />
        </g>
        {/* Bed 2 (Center) */}
        <g transform="translate(500, 125)">
          <rect x="-4" y="-4" width="108" height="64" rx="4" fill="#1b120c" opacity="0.6" />
          <rect x="0" y="0" width="100" height="56" rx="4" fill="#5c381f" stroke="#3b2211" strokeWidth="2" />
          <rect x="6" y="6" width="88" height="44" rx="2" fill="url(#gardenSoil)" />
        </g>
        {/* Bed 3 (Right) */}
        <g transform="translate(635, 125)">
          <rect x="-4" y="-4" width="108" height="64" rx="4" fill="#1b120c" opacity="0.6" />
          <rect x="0" y="0" width="100" height="56" rx="4" fill="#5c381f" stroke="#3b2211" strokeWidth="2" />
          <rect x="6" y="6" width="88" height="44" rx="2" fill="url(#gardenSoil)" />
        </g>

        {/* WEST WING: Sprouting Table & Germination Bench */}
        <g transform="translate(140, 235)">
          {/* Table shadow */}
          <rect x="-4" y="60" width="216" height="20" rx="8" fill="url(#gardenDropShadow)" />
          {/* Heavy Cedar Nursery Bench */}
          <rect x="0" y="0" width="208" height="68" rx="4" fill="#6d4323" stroke="#3e2210" strokeWidth="2.5" />
          <rect x="6" y="6" width="196" height="56" rx="2" fill="#543319" />
          {/* Table Slats */}
          <line x1="0" y1="22" x2="208" y2="22" stroke="#3e2210" strokeWidth="1.5" />
          <line x1="0" y1="44" x2="208" y2="44" stroke="#3e2210" strokeWidth="1.5" />
          {/* Peat Pots & Germination Trays indicator */}
          <rect x="16" y="12" width="56" height="44" fill="#3b2211" rx="2" stroke="#78350f" strokeWidth="1" />
          <rect x="80" y="12" width="56" height="44" fill="#3b2211" rx="2" stroke="#78350f" strokeWidth="1" />
          <rect x="144" y="12" width="48" height="44" fill="#3b2211" rx="2" stroke="#78350f" strokeWidth="1" />
        </g>

        {/* EAST WING: Herb & Aromatic Healing Planters */}
        <g transform="translate(755, 235)">
          <rect x="-4" y="60" width="216" height="20" rx="8" fill="url(#gardenDropShadow)" />
          <rect x="0" y="0" width="208" height="68" rx="4" fill="#6d4323" stroke="#3e2210" strokeWidth="2.5" />
          <rect x="6" y="6" width="196" height="56" rx="2" fill="url(#gardenSoil)" />
          <rect x="12" y="12" width="56" height="44" rx="2" fill="#2d1a0e" stroke="#15803d" strokeWidth="1.5" />
          <rect x="76" y="12" width="56" height="44" rx="2" fill="#2d1a0e" stroke="#15803d" strokeWidth="1.5" />
          <rect x="140" y="12" width="56" height="44" rx="2" fill="#2d1a0e" stroke="#15803d" strokeWidth="1.5" />
        </g>

        {/* SOUTH WING: 2 Long Curved Wildflower Sanctuary Plots */}
        <g transform="translate(380, 450)">
          <rect x="-4" y="-4" width="158" height="68" rx="6" fill="#1b120c" opacity="0.6" />
          <rect x="0" y="0" width="150" height="60" rx="6" fill="#5c381f" stroke="#3b2211" strokeWidth="2" />
          <rect x="6" y="6" width="138" height="48" rx="4" fill="url(#gardenSoil)" />
        </g>
        <g transform="translate(570, 450)">
          <rect x="-4" y="-4" width="158" height="68" rx="6" fill="#1b120c" opacity="0.6" />
          <rect x="0" y="0" width="150" height="60" rx="6" fill="#5c381f" stroke="#3b2211" strokeWidth="2" />
          <rect x="6" y="6" width="138" height="48" rx="4" fill="url(#gardenSoil)" />
        </g>

        {/* CENTRAL FOUNTAIN / WATER BASIN (Stone Basin with Sparkles) */}
        <g transform="translate(550, 310)">
          <ellipse cx="0" cy="18" rx="54" ry="24" fill="url(#gardenDropShadow)" />
          {/* Outer Octagonal Stone Basin */}
          <polygon points="-46,0 -32,-20 32,-20 46,0 32,20 -32,20" fill="#64748b" stroke="#334155" strokeWidth="3" />
          <polygon points="-40,0 -28,-16 28,-16 40,0 28,16 -28,16" fill="#475569" />
          {/* Clear Cyan Water */}
          <ellipse cx="0" cy="0" rx="32" ry="13" fill="#06b6d4" opacity="0.85" />
          <ellipse cx="0" cy="0" rx="26" ry="10" fill="#22d3ee" opacity="0.6" />
          <circle cx="-6" cy="-2" r="3" fill="#ffffff" opacity="0.8" />
          <circle cx="8" cy="3" r="2" fill="#ffffff" opacity="0.6" />
        </g>
      </g>

      {/* 6. VOLUMETRIC SUNLIGHT RAYS & AMBIENT ATMOSPHERE */}
      <g className="conservatory-lighting" style={{ mixBlendMode: 'screen' }}>
        {/* Ray 1 (From North Center Skylight) */}
        <polygon points="530,95 570,95 650,420 450,420" fill="url(#sunBeamGrad)" />
        {/* Ray 2 (From West Skylight onto Sprouting Table) */}
        <polygon points="220,195 260,195 360,400 120,400" fill="url(#sunBeamGrad)" opacity="0.7" />
        {/* Ray 3 (From East Skylight onto Herb Sanctuary) */}
        <polygon points="840,195 880,195 980,400 740,400" fill="url(#sunBeamGrad)" opacity="0.7" />
      </g>
    </svg>
  );
}
