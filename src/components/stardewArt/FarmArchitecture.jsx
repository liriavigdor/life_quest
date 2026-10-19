import React from 'react';

// =========================================================================
// GRAND FARMSTEAD BARN ARCHITECTURAL SHELL (6-CHAMBER ASYMMETRIC MASTERPIECE)
// Built under [MASTER ROOM FRAMER] & [COGNITIVE MEMORY SPECIALIST] Skills
// Dimensions: 1360 x 820
// Features:
// 1. Asymmetric Organic Layout & Broken Grid:
//    - Animals and major props placed at varied, organic coordinates.
//    - Giant focal anchors with high visual mass (River Boulder, Apple Cart,
//      Milking Churns, Roost Tower, Giant Carrot Trough, Spinning Wheel on Rug).
// 2. Gateway Transition Anchors on Promenade Curbs (Method of Loci trajectory):
//    - Gate 1 (SW Pig): Lit Iron Lantern on Oak Barrel
//    - Gate 2 (SE Duck): Polished Brass Nautical Bell on Post
//    - Gate 3 (Mid-W Sheep): Resting Iron Pitchfork
//    - Gate 4 (Mid-E Poultry): Brass Grain Scale & Wooden Desk
//    - Gate 5 (NW Cow): Silver Milk Urn with Wildflower Bouquet
//    - Gate 6 (NE Horse): Golden Horseshoe Gateway Arch Crest
// 3. Grand Climax Shrine at North Granary Loft:
//    - Arched studded barn doors, Golden Wheat Sculpture Crest,
//      and Two Burning Iron Torch Braziers casting flickering light!
// =========================================================================

export const FARM_W = 1360;
export const FARM_H = 820;

export function FarmArchitectureSVG() {
  return (
    <svg 
      className="farm-architecture-svg"
      viewBox={`0 0 ${FARM_W} ${FARM_H}`}
      width={FARM_W} 
      height={FARM_H}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        {/* 1. CENTRAL PROMENADE: Blue-Grey Flagstones (96x96 seamless rich texture) */}
        <pattern id="promenadeStone" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#334155" />
          <path d="M 0,24 L 96,24 M 0,48 L 96,48 M 0,72 L 96,72" stroke="#1e293b" strokeWidth="2.5" />
          <path d="M 32,0 L 32,24 M 64,24 L 64,48 M 24,48 L 24,72 M 72,72 L 72,96" stroke="#1e293b" strokeWidth="2" />
          <rect x="2" y="2" width="28" height="20" rx="2" fill="#475569" />
          <rect x="34" y="2" width="60" height="20" rx="2" fill="#3f4f64" />
          <rect x="2" y="26" width="60" height="20" rx="2" fill="#38475a" />
          <rect x="66" y="26" width="28" height="20" rx="2" fill="#475569" />
          <rect x="2" y="50" width="20" height="20" rx="2" fill="#3f4f64" />
          <rect x="26" y="50" width="68" height="20" rx="2" fill="#475569" />
          <rect x="2" y="74" width="68" height="20" rx="2" fill="#38475a" />
          <rect x="74" y="74" width="20" height="20" rx="2" fill="#3f4f64" />
          <circle cx="32" cy="24" r="2.5" fill="#15803d" opacity="0.65" />
          <circle cx="64" cy="48" r="2" fill="#166534" opacity="0.7" />
          <circle cx="24" cy="72" r="2.5" fill="#15803d" opacity="0.65" />
        </pattern>

        {/* 2. AISLE GAP LOWER WOOD WALKWAY */}
        <pattern id="aisleWoodPlanks" width="48" height="28" patternUnits="userSpaceOnUse">
          <rect width="48" height="28" fill="#1c0f07" />
          <line x1="0" y1="28" x2="48" y2="28" stroke="#0a0502" strokeWidth="2" />
          <rect x="1" y="2" width="46" height="24" fill="#2d170a" />
          <circle cx="6" cy="14" r="1.5" fill="#475569" />
          <circle cx="42" cy="14" r="1.5" fill="#475569" />
        </pattern>

        {/* 3. COW STALL: Lush Deep Green Pasture (96x96 with dirt trail & flowers) */}
        <pattern id="pastureGrass" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#14532d" />
          <rect x="4" y="4" width="40" height="40" rx="12" fill="#15803d" />
          <rect x="52" y="52" width="40" height="40" rx="12" fill="#15803d" />
          <rect x="50" y="8" width="38" height="38" rx="10" fill="#16a34a" opacity="0.4" />
          <path d="M 8,24 L 11,14 L 14,24 M 18,22 L 20,12 L 22,22" stroke="#22c55e" strokeWidth="1.5" fill="none" />
          <path d="M 60,70 L 63,58 L 66,70 M 72,68 L 74,56 L 76,68" stroke="#4ade80" strokeWidth="1.5" fill="none" />
          <path d="M 32,80 L 35,68 L 38,80" stroke="#22c55e" strokeWidth="1.5" fill="none" />
          <circle cx="28" cy="32" r="2" fill="#ffffff" />
          <circle cx="78" cy="24" r="2" fill="#ffffff" />
          <circle cx="45" cy="62" r="2" fill="#ffffff" />
          <circle cx="16" cy="68" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
          <circle cx="84" cy="82" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
        </pattern>

        {/* 4. SHEEP PEN: Soft Clover Meadow & Fluffy Wool Tufts (96x96) */}
        <pattern id="cloverMeadow" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#365314" />
          <rect x="6" y="6" width="42" height="42" rx="14" fill="#4d7c0f" />
          <rect x="50" y="48" width="40" height="42" rx="14" fill="#65a30d" opacity="0.8" />
          <ellipse cx="24" cy="24" rx="5" ry="3.5" fill="#f8fafc" opacity="0.9" />
          <ellipse cx="74" cy="74" rx="6" ry="4" fill="#f8fafc" opacity="0.9" />
          <ellipse cx="68" cy="20" rx="4.5" ry="3" fill="#f1f5f9" opacity="0.85" />
          <circle cx="36" cy="72" r="2" fill="#d8b4fe" />
          <circle cx="82" cy="42" r="2" fill="#c084fc" />
          <circle cx="14" cy="84" r="2" fill="#e9d5ff" />
        </pattern>

        {/* 5. PIG PEN: Dark Wet Mud with Glossy Puddles (96x96) */}
        <pattern id="wetMud" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#24130a" />
          <ellipse cx="32" cy="32" rx="26" ry="16" fill="#361c0e" />
          <ellipse cx="74" cy="74" rx="22" ry="14" fill="#361c0e" />
          <ellipse cx="32" cy="30" rx="18" ry="10" fill="#4a2916" stroke="#1f1008" strokeWidth="1.5" />
          <ellipse cx="32" cy="29" rx="14" ry="7" fill="#60371e" />
          <path d="M 24,28 Q 30,26 36,28" stroke="#a16207" strokeWidth="1" fill="none" opacity="0.8" />
          <ellipse cx="64" cy="24" rx="3" ry="4" fill="#170b05" />
          <ellipse cx="70" cy="25" rx="3" ry="4" fill="#170b05" />
          <ellipse cx="20" cy="74" rx="3" ry="4" fill="#170b05" />
          <ellipse cx="26" cy="75" rx="3" ry="4" fill="#170b05" />
        </pattern>

        {/* 6. HORSE STABLE: Raked Arena Earth & Sand (96x96) */}
        <pattern id="arenaDirt" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#78350f" />
          <path d="M 0,12 L 96,12 M 0,24 L 96,24 M 0,36 L 96,36 M 0,48 L 96,48 M 0,60 L 96,60 M 0,72 L 96,72 M 0,84 L 96,84" stroke="#582407" strokeWidth="1.5" opacity="0.75" />
          <rect x="8" y="14" width="36" height="18" rx="6" fill="#92400e" opacity="0.6" />
          <rect x="52" y="50" width="38" height="20" rx="6" fill="#92400e" opacity="0.6" />
          <path d="M 24,22 Q 28,18 32,22" stroke="#451a03" strokeWidth="2.5" fill="none" />
          <path d="M 68,64 Q 72,60 76,64" stroke="#451a03" strokeWidth="2.5" fill="none" />
          <circle cx="44" cy="40" r="1.5" fill="#fef08a" />
          <circle cx="82" cy="18" r="1.5" fill="#fef08a" />
        </pattern>

        {/* 7. POULTRY COOP: Radiant Golden Straw Bedding (96x96) */}
        <pattern id="radiantStraw" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#a16207" />
          <g stroke="#facc15" strokeWidth="2.4" strokeLinecap="round">
            <line x1="4" y1="12" x2="36" y2="18" /><line x1="48" y1="8" x2="88" y2="16" />
            <line x1="12" y1="36" x2="44" y2="44" /><line x1="56" y1="32" x2="92" y2="40" />
            <line x1="8" y1="64" x2="40" y2="72" /><line x1="52" y1="60" x2="90" y2="68" />
            <line x1="16" y1="84" x2="48" y2="90" /><line x1="58" y1="80" x2="94" y2="88" />
          </g>
          <g stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round">
            <line x1="20" y1="6" x2="44" y2="28" /><line x1="68" y1="12" x2="86" y2="34" />
            <line x1="10" y1="48" x2="32" y2="70" /><line x1="62" y1="42" x2="82" y2="64" />
          </g>
          <ellipse cx="30" cy="52" rx="6" ry="2.5" fill="#ffffff" transform="rotate(-25 30 52)" />
          <ellipse cx="76" cy="84" rx="5.5" ry="2" fill="#78350f" transform="rotate(35 76 84)" />
          <circle cx="16" cy="24" r="2" fill="#fef08a" />
          <circle cx="74" cy="50" r="2" fill="#fef08a" />
        </pattern>

        {/* 8. DUCK POND: Cyan Water with Caustic Rings & Pebble Beach (96x96) */}
        <pattern id="cyanWater" width="96" height="96" patternUnits="userSpaceOnUse">
          <rect width="96" height="96" fill="#0284c7" />
          <path d="M 0,16 Q 24,8 48,16 T 96,16" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          <path d="M 0,36 Q 24,28 48,36 T 96,36" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.8" />
          <path d="M 0,56 Q 24,48 48,56 T 96,56" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
          <path d="M 0,76 Q 24,68 48,76 T 96,76" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.8" />
          <circle cx="28" cy="26" r="2" fill="#ffffff" opacity="0.85" />
          <circle cx="68" cy="46" r="2" fill="#ffffff" opacity="0.85" />
          <circle cx="38" cy="82" r="2" fill="#ffffff" opacity="0.85" />
        </pattern>

        {/* Volumetric Amber Light Cones */}
        <linearGradient id="loftSunBeam" x1="10%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="focalSpotlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.65" />
          <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>

        {/* Torch Fire Gradient */}
        <linearGradient id="torchFire" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="80%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* 1. BLACK RPG VOID BASE */}
      <rect width={FARM_W} height={FARM_H} fill="#050302" />

      {/* 2. LOWER WOODEN AISLE GAPS & RUNNER WALKWAYS */}
      <g className="aisle-walkways">
        <rect x="100" y="280" width="460" height="28" fill="url(#aisleWoodPlanks)" />
        <rect x="100" y="500" width="460" height="28" fill="url(#aisleWoodPlanks)" />
        <rect x="800" y="280" width="460" height="28" fill="url(#aisleWoodPlanks)" />
        <rect x="800" y="500" width="460" height="28" fill="url(#aisleWoodPlanks)" />
      </g>

      {/* 3. MAIN FLOOR PLANS (Raised Stall Platforms + 240px Central Promenade) */}
      <g className="barn-floors">
        {/* Central Cobblestone Promenade (x: 560 to 800) */}
        <rect x="560" y="90" width="240" height="650" fill="url(#promenadeStone)" />
        {/* North Granary Loft Alcove */}
        <polygon points="570,40 790,40 790,90 570,90" fill="url(#promenadeStone)" />
        {/* Exit Stoop */}
        <rect x="620" y="740" width="120" height="44" fill="#1e293b" stroke="#0f172a" strokeWidth="2.5" />

        {/* Woven Patterned Runner Rug down the Promenade centre */}
        <g transform="translate(635, 90)">
          <rect x="0" y="0" width="90" height="650" fill="#7f1d1d" opacity="0.88" />
          <rect x="6" y="0" width="78" height="650" fill="#991b1b" />
          <line x1="12" y1="0" x2="12" y2="650" stroke="#fef08a" strokeWidth="1.8" />
          <line x1="78" y1="0" x2="78" y2="650" stroke="#fef08a" strokeWidth="1.8" />
          <line x1="0" y1="2" x2="90" y2="2" stroke="#fde047" strokeWidth="3" strokeDasharray="3,3" />
          <line x1="0" y1="648" x2="90" y2="648" stroke="#fde047" strokeWidth="3" strokeDasharray="3,3" />
        </g>

        {/* 6 HETEROGENEOUS RAISED STALLS */}
        {/* NW: Cow Stall (Lush Green Grass) */}
        <polygon points="100,90 560,90 560,280 100,280 100,130 140,90" fill="url(#pastureGrass)" />
        {/* Mid-W: Sheep Pen (Clover Meadow & Wool) */}
        <polygon points="100,308 560,308 560,500 100,500" fill="url(#cloverMeadow)" />
        {/* SW: Pig Pen (Dark Wet Mud) */}
        <polygon points="100,528 560,528 560,740 140,740 100,700" fill="url(#wetMud)" />

        {/* NE: Horse Stable (Packed Arena Earth) */}
        <polygon points="800,90 1260,90 1260,130 1260,280 800,280" fill="url(#arenaDirt)" />
        {/* Mid-E: Poultry Coop (Radiant Golden Straw) */}
        <polygon points="800,308 1260,308 1260,500 800,500" fill="url(#radiantStraw)" />
        {/* SE: Duck Pond (Cyan Water with Pebble Beach) */}
        <polygon points="800,528 1260,528 1260,700 1220,740 800,740" fill="url(#cyanWater)" />

        {/* Raised Stall Platform Front Lip Trims */}
        <rect x="100" y="274" width="460" height="8" fill="#14532d" stroke="#052e16" strokeWidth="1" />
        <rect x="100" y="494" width="460" height="8" fill="#365314" stroke="#1a2e05" strokeWidth="1" />
        <rect x="100" y="734" width="460" height="8" fill="#24130a" stroke="#0f0703" strokeWidth="1" />
        <rect x="800" y="274" width="460" height="8" fill="#542308" stroke="#321404" strokeWidth="1" />
        <rect x="800" y="494" width="460" height="8" fill="#713f12" stroke="#451a03" strokeWidth="1" />
        <rect x="800" y="734" width="460" height="8" fill="#0369a1" stroke="#082f49" strokeWidth="1" />
      </g>

      {/* 4. WALLS & ELEVATIONS (Rustic Red Barn Weatherboard & Wainscoting) */}
      <g className="barn-walls">
        <rect x="100" y="40" width="1160" height="50" fill="#7f1d1d" stroke="#450a0a" strokeWidth="2.5" />
        <line x1="100" y1="65" x2="1260" y2="65" stroke="#f8fafc" strokeWidth="2.5" opacity="0.85" />
        <g stroke="#f8fafc" strokeWidth="2.2" opacity="0.75">
          <line x1="200" y1="40" x2="280" y2="90" /><line x1="280" y1="40" x2="200" y2="90" />
          <line x1="420" y1="40" x2="500" y2="90" /><line x1="500" y1="40" x2="420" y2="90" />
          <line x1="860" y1="40" x2="940" y2="90" /><line x1="940" y1="40" x2="860" y2="90" />
          <line x1="1080" y1="40" x2="1160" y2="90" /><line x1="1160" y1="40" x2="1080" y2="90" />
        </g>
        <rect x="100" y="82" width="1160" height="8" fill="#2d170a" stroke="#180b03" strokeWidth="1" />

        {/* 2 Loft Windows on sides */}
        <g className="loft-windows">
          <path d="M 330,60 Q 360,42 390,60 Z" fill="#fef08a" stroke="#450a0a" strokeWidth="2" opacity="0.9" />
          <path d="M 970,60 Q 1000,42 1030,60 Z" fill="#fef08a" stroke="#450a0a" strokeWidth="2" opacity="0.9" />
        </g>
      </g>

      {/* 5. MASTER ROOM FRAMER ENVELOPE (Monolithic Timber Ribbon with Golden Inlay) */}
      <g className="barn-framing">
        <path 
          d="
            M 620,784 L 500,784 L 440,740 L 140,740 L 88,688 L 88,128 L 138,78 L 560,78 L 560,34 L 800,34 L 800,78 L 1222,78 L 1272,128 L 1272,688 L 1220,740 L 920,740 L 860,784 L 740,784
          " 
          fill="none" 
          stroke="#1b0e06" 
          strokeWidth="24" 
          strokeLinejoin="round" 
        />
        <path 
          d="
            M 620,784 L 500,784 L 440,740 L 140,740 L 88,688 L 88,128 L 138,78 L 560,78 L 560,34 L 800,34 L 800,78 L 1222,78 L 1272,128 L 1272,688 L 1220,740 L 920,740 L 860,784 L 740,784
          " 
          fill="none" 
          stroke="#381d0d" 
          strokeWidth="16" 
          strokeLinejoin="round" 
        />
        <path 
          d="
            M 620,784 L 500,784 L 440,740 L 140,740 L 88,688 L 88,128 L 138,78 L 560,78 L 560,34 L 800,34 L 800,78 L 1222,78 L 1272,128 L 1272,688 L 1220,740 L 920,740 L 860,784 L 740,784
          " 
          fill="none" 
          stroke="#c6923c" 
          strokeWidth="3.2" 
          strokeLinejoin="round" 
        />
        <path 
          d="
            M 620,784 L 500,784 L 440,740 L 140,740 L 88,688 L 88,128 L 138,78 L 560,78 L 560,34 L 800,34 L 800,78 L 1222,78 L 1272,128 L 1272,688 L 1220,740 L 920,740 L 860,784 L 740,784
          " 
          fill="none" 
          stroke="#fef08a" 
          strokeWidth="1.2" 
          strokeLinejoin="round" 
        />
      </g>

      {/* 6. PROMENADE STONE CURBS & TIMBER GATES */}
      <g className="promenade-curbs-gates">
        <rect x="552" y="90" width="8" height="650" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />
        <rect x="800" y="90" width="8" height="650" fill="#475569" stroke="#1e293b" strokeWidth="1.5" />

        {/* 6 Half-Open Timber Gates with Iron Hinges */}
        {/* Gate 1: Cow (NW) */}
        <g transform="translate(550, 160)">
          <rect x="-26" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(-35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
        {/* Gate 2: Sheep (Mid-W) */}
        <g transform="translate(550, 380)">
          <rect x="-26" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(-35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
        {/* Gate 3: Pig (SW) */}
        <g transform="translate(550, 600)">
          <rect x="-26" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(-35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
        {/* Gate 4: Horse (NE) */}
        <g transform="translate(806, 160)">
          <rect x="0" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
        {/* Gate 5: Poultry (Mid-E) */}
        <g transform="translate(806, 380)">
          <rect x="0" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
        {/* Gate 6: Duck (SE) */}
        <g transform="translate(806, 600)">
          <rect x="0" y="0" width="26" height="7" rx="2" fill="#78350f" stroke="#361f0e" strokeWidth="1.2" transform="rotate(35 0 0)" />
          <circle cx="0" cy="0" r="3.5" fill="#ca8a04" />
        </g>
      </g>

      {/* 7. GATEWAY TRANSITION ANCHORS (עוגני מעבר בכניסה לכל תא - Method of Loci) */}
      <g className="gateway-anchors">
        {/* Gate 1 (SW - Pig): Lit Iron Lantern on Oak Barrel */}
        <g transform="translate(530, 615)">
          <ellipse cx="14" cy="24" rx="12" ry="7" fill="rgba(0,0,0,0.4)" />
          <rect x="4" y="6" width="20" height="22" rx="3" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
          <line x1="4" y1="13" x2="24" y2="13" stroke="#291205" strokeWidth="1.5" />
          {/* Iron Lantern on top */}
          <rect x="9" y="-6" width="10" height="12" rx="2" fill="#1c1917" stroke="#44403c" strokeWidth="1" />
          <circle cx="14" cy="0" r="4" fill="#fde047" />
        </g>

        {/* Gate 2 (SE - Duck): Polished Brass Nautical Bell on post */}
        <g transform="translate(812, 615)">
          <rect x="4" y="0" width="6" height="28" fill="#451a03" />
          <path d="M 0,4 L 14,4 L 12,14 L 2,14 Z" fill="#facc15" stroke="#b45309" strokeWidth="1.2" />
          <circle cx="7" cy="15" r="2" fill="#ca8a04" />
        </g>

        {/* Gate 3 (Mid-W - Sheep): Resting Iron Pitchfork */}
        <g transform="translate(534, 375)">
          <line x1="2" y1="-14" x2="16" y2="44" stroke="#78350f" strokeWidth="2.5" />
          <path d="M -2,-14 L 6,-14 M -2,-14 L -2,-26 M 2,-14 L 2,-28 M 6,-14 L 6,-26" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Gate 4 (Mid-E - Poultry): Brass Grain Scale & Wooden Desk */}
        <g transform="translate(810, 385)">
          <rect x="0" y="8" width="34" height="22" rx="2" fill="#543319" stroke="#361f0e" strokeWidth="1.2" />
          <line x1="17" y1="-2" x2="17" y2="8" stroke="#ca8a04" strokeWidth="1.8" />
          <line x1="8" y1="-2" x2="26" y2="-2" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="8" cy="4" rx="4" ry="1.5" fill="#facc15" />
          <ellipse cx="26" cy="4" rx="4" ry="1.5" fill="#facc15" />
        </g>

        {/* Gate 5 (NW - Cow): Silver Milk Urn with Wildflower Bouquet */}
        <g transform="translate(532, 160)">
          <ellipse cx="12" cy="22" rx="11" ry="6" fill="rgba(0,0,0,0.35)" />
          <rect x="4" y="4" width="16" height="20" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.2" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="#f59e0b" strokeWidth="1.5" />
          {/* Flower Bouquet */}
          <circle cx="8" cy="-1" r="3" fill="#f43f5e" />
          <circle cx="16" cy="-2" r="3.5" fill="#facc15" />
          <circle cx="12" cy="-6" r="3" fill="#38bdf8" />
        </g>

        {/* Gate 6 (NE - Horse): Golden Horseshoe Gateway Arch Crest */}
        <g transform="translate(812, 160)">
          <path d="M 4,4 Q 12,-6 20,4 L 18,16 L 6,16 Z" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
          <circle cx="6" cy="14" r="1.5" fill="#78350f" />
          <circle cx="18" cy="14" r="1.5" fill="#78350f" />
        </g>
      </g>

      {/* 8. GRAND CLIMAX SHRINE AT NORTH GRANARY (פסל תבואת הזהב והשער המלכותי) */}
      <g className="granary-climax-shrine" transform="translate(580, 20)">
        {/* Double Studded Cedar Barn Arch Doors */}
        <path d="M 10,65 L 10,25 Q 100,-10 190,25 L 190,65 Z" fill="#451a03" stroke="#1c0a02" strokeWidth="3" />
        <line x1="100" y1="0" x2="100" y2="65" stroke="#1c0a02" strokeWidth="2.5" />
        {/* Iron Strap Hinges */}
        <line x1="10" y1="35" x2="90" y2="35" stroke="#1e293b" strokeWidth="3.5" strokeDasharray="8,6" />
        <line x1="110" y1="35" x2="190" y2="35" stroke="#1e293b" strokeWidth="3.5" strokeDasharray="8,6" />

        {/* Majestic Golden Wheat Sculpture Crest (פסל תבואת הזהב) */}
        <g transform="translate(100, 16)">
          <circle cx="0" cy="0" r="16" fill="#f59e0b" stroke="#fef08a" strokeWidth="2" />
          <path d="M -6,8 Q 0,-14 6,8 M -8,2 Q 0,-12 8,2" stroke="#fef08a" strokeWidth="2.5" fill="none" />
          <circle cx="0" cy="-6" r="3" fill="#ffffff" />
        </g>

        {/* Left Burning Iron Torch Brazier */}
        <g transform="translate(-10, 40)">
          <rect x="0" y="0" width="8" height="26" fill="#1c1917" />
          <path d="M -4,0 L 12,0 L 8,-8 L 0,-8 Z" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
          <ellipse cx="4" cy="-14" rx="7" ry="12" fill="url(#torchFire)" />
        </g>

        {/* Right Burning Iron Torch Brazier */}
        <g transform="translate(202, 40)">
          <rect x="0" y="0" width="8" height="26" fill="#1c1917" />
          <path d="M -4,0 L 12,0 L 8,-8 L 0,-8 Z" fill="#44403c" stroke="#1c1917" strokeWidth="1" />
          <ellipse cx="4" cy="-14" rx="7" ry="12" fill="url(#torchFire)" />
        </g>
      </g>

      {/* 9. DRAMATIC LARGE STATIC PHYSICAL ANCHORS (Asymmetric, Volumetric & Distinct) */}
      <g className="chamber-anchors">
        {/* ---------------- 1. COW STALL (NW): Milking Churn Stand & Hay Pyramid ---------------- */}
        {/* 4 Large Silver Churns on Timber Bench (Top-Left corner x: 120, y: 95) */}
        <g transform="translate(120, 95)">
          <rect x="0" y="38" width="130" height="14" rx="3" fill="#543319" stroke="#361f0e" strokeWidth="1.8" />
          <line x1="20" y1="52" x2="20" y2="64" stroke="#361f0e" strokeWidth="4" />
          <line x1="110" y1="52" x2="110" y2="64" stroke="#361f0e" strokeWidth="4" />
          {/* 4 Churns */}
          <rect x="8" y="4" width="24" height="34" rx="4" fill="#f1f5f9" stroke="#64748b" strokeWidth="1.8" />
          <rect x="12" y="0" width="16" height="5" fill="#f59e0b" rx="1.5" />
          <line x1="8" y1="20" x2="32" y2="20" stroke="#f59e0b" strokeWidth="2.5" />
          <rect x="38" y="10" width="22" height="28" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.8" />
          <rect x="66" y="2" width="26" height="36" rx="4" fill="#f8fafc" stroke="#64748b" strokeWidth="1.8" />
          <rect x="71" y="-2" width="16" height="5" fill="#f59e0b" rx="1.5" />
          <line x1="66" y1="18" x2="92" y2="18" stroke="#f59e0b" strokeWidth="2.5" />
          <rect x="98" y="12" width="22" height="26" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="1.8" />
        </g>
        {/* Massive Haybale Pyramid (x: 430, y: 100) */}
        <g transform="translate(430, 100)">
          <rect x="0" y="20" width="56" height="26" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <rect x="60" y="20" width="56" height="26" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="2" />
          <rect x="30" y="-4" width="56" height="24" rx="3" fill="#fde047" stroke="#ca8a04" strokeWidth="2" />
          <line x1="58" y1="-4" x2="58" y2="20" stroke="#854d0e" strokeWidth="2" />
        </g>

        {/* ---------------- 2. SHEEP PEN (MID-W): Traditional Spinning Wheel & Giant Wool Baskets ---------------- */}
        {/* Realistic Rich Wood Spinning Wheel on Persian Rug (x: 130, y: 320) */}
        <g transform="translate(130, 320)">
          <ellipse cx="36" cy="44" rx="36" ry="18" fill="#581c87" stroke="#7e22ce" strokeWidth="1.5" />
          {/* Wheel frame */}
          <rect x="34" y="6" width="5" height="42" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
          <circle cx="36" cy="18" r="22" fill="none" stroke="#b45309" strokeWidth="3" />
          <circle cx="36" cy="18" r="4" fill="#fde047" />
          <line x1="16" y1="18" x2="56" y2="18" stroke="#78350f" strokeWidth="2" />
          <line x1="36" y1="-2" x2="36" y2="38" stroke="#78350f" strokeWidth="2" />
          <line x1="22" y1="4" x2="50" y2="32" stroke="#78350f" strokeWidth="2" />
          <line x1="22" y1="32" x2="50" y2="4" stroke="#78350f" strokeWidth="2" />
        </g>
        {/* 3 GIANT Overflowing Wicker Wool Baskets (Cream, White, Lavender) (x: 230, y: 320) */}
        <g transform="translate(230, 320)">
          <ellipse cx="28" cy="28" rx="28" ry="17" fill="#92400e" stroke="#713f12" strokeWidth="2.5" />
          <ellipse cx="28" cy="18" rx="22" ry="13" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
          <ellipse cx="80" cy="28" rx="26" ry="16" fill="#92400e" stroke="#713f12" strokeWidth="2.5" />
          <ellipse cx="80" cy="18" rx="20" ry="12" fill="#f1f5f9" stroke="#e2e8f0" strokeWidth="1.5" />
          <ellipse cx="130" cy="28" rx="24" ry="15" fill="#92400e" stroke="#713f12" strokeWidth="2.5" />
          <ellipse cx="130" cy="18" rx="18" ry="11" fill="#c084fc" stroke="#a855f7" strokeWidth="1.5" />
        </g>

        {/* ---------------- 3. PIG PEN (SW): Apple Cart & Massive Mud Wallow ---------------- */}
        {/* Large Mud Wallow Trough (x: 320, y: 550) */}
        <g transform="translate(320, 550)">
          <rect x="0" y="0" width="170" height="52" rx="8" fill="#451a03" stroke="#27150c" strokeWidth="2.5" />
          <rect x="8" y="8" width="154" height="36" rx="6" fill="#3b2012" />
          <circle cx="44" cy="26" r="14" fill="#24130a" />
          <circle cx="110" cy="24" r="16" fill="#24130a" />
        </g>
        {/* GIANT APPLE CART OVERFLOWING WITH VIBRANT RED APPLES 🍎 (x: 130, y: 535) */}
        <g transform="translate(130, 535)">
          <rect x="0" y="12" width="100" height="42" rx="4" fill="#78350f" stroke="#451a03" strokeWidth="2.5" />
          <circle cx="20" cy="56" r="15" fill="none" stroke="#451a03" strokeWidth="3" />
          <circle cx="80" cy="56" r="15" fill="none" stroke="#451a03" strokeWidth="3" />
          {/* Ripe Red Apples with Leaves */}
          <circle cx="16" cy="10" r="10" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
          <circle cx="34" cy="6" r="11" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
          <circle cx="52" cy="7" r="10.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
          <circle cx="70" cy="6" r="11" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.2" />
          <circle cx="86" cy="10" r="10" fill="#dc2626" stroke="#991b1b" strokeWidth="1.2" />
          <circle cx="26" cy="18" r="10.5" fill="#f87171" />
          <circle cx="46" cy="16" r="11" fill="#ef4444" />
          <circle cx="66" cy="17" r="10.5" fill="#dc2626" />
        </g>

        {/* ---------------- 4. HORSE STABLE (NE): Giant Carrot Trough & Royal Saddle Rack ---------------- */}
        {/* GIANT GLOWING CARROT TROUGH 🥕 (x: 1110, y: 95) */}
        <g transform="translate(1110, 95)">
          <rect x="0" y="24" width="120" height="34" rx="4" fill="#543319" stroke="#361f0e" strokeWidth="2" />
          {/* Overflowing Carrots */}
          <polygon points="12,24 18,2 24,24" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
          <polygon points="26,24 32,-2 38,24" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <polygon points="40,24 46,3 52,24" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
          <polygon points="54,24 60,-3 66,24" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <polygon points="68,24 74,4 80,24" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
          <polygon points="82,24 88,0 94,24" fill="#ea580c" stroke="#c2410c" strokeWidth="1.5" />
          <polygon points="96,24 102,5 108,24" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
          <path d="M 18,2 L 14,-5 M 32,-2 L 32,-8 M 46,3 L 48,-4 M 60,-3 L 62,-9 M 74,4 L 76,-3" stroke="#22c55e" strokeWidth="2.8" />
        </g>
        {/* Full Saddle & Blanket on Cedar Rack (x: 830, y: 95) */}
        <g transform="translate(830, 95)">
          <rect x="4" y="0" width="46" height="8" rx="2" fill="#451a03" />
          <rect x="8" y="8" width="38" height="26" fill="#1e3a8a" stroke="#172554" strokeWidth="1" />
          <path d="M 8,12 Q 27,28 46,12 L 42,38 Q 27,30 12,38 Z" fill="#78350f" stroke="#451a03" strokeWidth="2.2" />
          <line x1="16" y1="38" x2="14" y2="58" stroke="#451a03" strokeWidth="2" />
          <line x1="38" y1="38" x2="40" y2="58" stroke="#451a03" strokeWidth="2" />
          <ellipse cx="14" cy="60" rx="5" ry="4" fill="none" stroke="#cbd5e1" strokeWidth="1.8" />
          <ellipse cx="40" cy="60" rx="5" ry="4" fill="none" stroke="#cbd5e1" strokeWidth="1.8" />
        </g>

        {/* ---------------- 5. POULTRY COOP (MID-E): 2-Tier Roost Tower & Golden Egg Nests ---------------- */}
        {/* Massive 2-Tier A-Frame Roost Tower (x: 1110, y: 310) */}
        <g transform="translate(1110, 310)">
          <rect x="0" y="52" width="90" height="6" fill="#543319" />
          <rect x="15" y="30" width="75" height="6" fill="#543319" />
          <rect x="30" y="8" width="60" height="6" fill="#543319" />
          <line x1="25" y1="8" x2="25" y2="65" stroke="#3b2211" strokeWidth="4" />
          <line x1="75" y1="8" x2="75" y2="65" stroke="#3b2211" strokeWidth="4" />
          {/* Golden Rooster Weathervane on top */}
          <path d="M 50,8 L 50,-8 M 44,-4 L 56,-4" stroke="#ca8a04" strokeWidth="2" />
          <circle cx="50" cy="-8" r="4" fill="#facc15" />
        </g>
        {/* 4 Large Straw Nest Boxes with Golden Eggs (x: 880, y: 315) */}
        <g transform="translate(880, 315)">
          <rect x="0" y="0" width="180" height="46" rx="5" fill="#6d4323" stroke="#3e2210" strokeWidth="2.5" />
          <line x1="45" y1="0" x2="45" y2="46" stroke="#3e2210" strokeWidth="2.5" />
          <line x1="90" y1="0" x2="90" y2="46" stroke="#3e2210" strokeWidth="2.5" />
          <line x1="135" y1="0" x2="135" y2="46" stroke="#3e2210" strokeWidth="2.5" />
          {/* Eggs */}
          <ellipse cx="22" cy="22" rx="8" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="67" cy="22" rx="8" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="112" cy="22" rx="9" ry="13" fill="#ffd700" stroke="#b45309" strokeWidth="2" />
          <ellipse cx="157" cy="22" rx="8" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
        </g>

        {/* ---------------- 6. DUCK POND (SE): Giant River Boulder & Boardwalk Dock ---------------- */}
        {/* GIANT MOSSY RIVER BOULDER (סלע נהר ענק עמוס טחב שיוצא מהמים) (x: 1140, y: 570) */}
        <g transform="translate(1140, 570)">
          <ellipse cx="45" cy="35" rx="50" ry="24" fill="rgba(0,0,0,0.4)" />
          {/* Boulder Body */}
          <path d="M 0,30 Q 15,0 55,2 Q 95,4 85,38 Q 65,55 25,50 Z" fill="#64748b" stroke="#334155" strokeWidth="3" />
          <path d="M 15,22 Q 40,8 70,12" stroke="#94a3b8" strokeWidth="3" fill="none" />
          {/* Green Moss Cap on Boulder */}
          <path d="M 20,14 Q 50,4 75,10 Q 65,22 45,18 Q 30,22 20,14 Z" fill="#15803d" />
          {/* Water Ripples hitting rock */}
          <path d="M -8,40 Q 40,56 95,44" stroke="#7dd3fc" strokeWidth="2.5" fill="none" />
        </g>
        {/* EXTENDED WOODEN BOARDWALK DOCK JETTY with Mooring Pilings (x: 820, y: 530) */}
        <g transform="translate(820, 530)">
          <rect x="0" y="0" width="130" height="38" fill="#6d4323" stroke="#3e2210" strokeWidth="2.5" />
          <line x1="32" y1="0" x2="32" y2="38" stroke="#3e2210" strokeWidth="2" />
          <line x1="65" y1="0" x2="65" y2="38" stroke="#3e2210" strokeWidth="2" />
          <line x1="98" y1="0" x2="98" y2="38" stroke="#3e2210" strokeWidth="2" />
          {/* Pilings with tied mooring rope */}
          <circle cx="120" cy="10" r="5" fill="#2d170a" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="120" cy="28" r="5" fill="#2d170a" stroke="#ca8a04" strokeWidth="1.5" />
        </g>
        {/* Water Lilies with Lotus Flowers */}
        <g transform="translate(970, 640)">
          <ellipse cx="20" cy="16" rx="22" ry="12" fill="#15803d" stroke="#166534" strokeWidth="1.5" />
          <circle cx="20" cy="14" r="6" fill="#f472b6" />
          <circle cx="20" cy="14" r="2.5" fill="#ffffff" />
        </g>
      </g>

      {/* 10. VOLUMETRIC LIGHTING & FOCAL SPOTLIGHTS */}
      <g className="barn-lighting" style={{ mixBlendMode: 'screen' }}>
        {/* North Granary Shrine Light Pool */}
        <ellipse cx="680" cy="65" rx="140" ry="60" fill="url(#focalSpotlight)" />
        <polygon points="650,45 710,45 800,340 560,340" fill="url(#loftSunBeam)" />

        {/* Spotlights directly on the Asymmetric Anchors */}
        <ellipse cx="185" cy="120" rx="95" ry="65" fill="url(#focalSpotlight)" />
        <ellipse cx="250" cy="335" rx="95" ry="65" fill="url(#focalSpotlight)" opacity="0.85" />
        <ellipse cx="180" cy="555" rx="95" ry="65" fill="url(#focalSpotlight)" opacity="0.85" />
        <ellipse cx="1170" cy="120" rx="95" ry="65" fill="url(#focalSpotlight)" />
        <ellipse cx="970" cy="335" rx="100" ry="65" fill="url(#focalSpotlight)" />
        <ellipse cx="1180" cy="590" rx="95" ry="65" fill="url(#focalSpotlight)" opacity="0.85" />

        {/* Promenade Warm Lamps */}
        <ellipse cx="680" cy="240" rx="110" ry="65" fill="url(#focalSpotlight)" opacity="0.7" />
        <ellipse cx="680" cy="560" rx="110" ry="65" fill="url(#focalSpotlight)" opacity="0.7" />
      </g>
    </svg>
  );
}
