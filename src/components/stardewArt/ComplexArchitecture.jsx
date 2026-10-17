import React from 'react';

// =========================================================================
// RE-ARCHITECTED 2.5D COMPLEX ARCHITECTURE (Stardew Valley Style)
// SKILL: Master_Carpentry_&_Seamless_Architecture
// 1. SEAMLESS WOOD JOINERY: All roof wall caps, horizontal beams, and timber
//    cove moldings flow as continuous, unbroken architectural contours with
//    ZERO artificial black divider lines or modular rectangular breaks.
// 2. UNIFIED ARCHWAYS: Doorways organically carve out of the partition walls
//    using sweeping hand-carved curved timber corbels and curved soffits.
// 3. INTEGRATED BASEBOARDS & CROWNS: Skirting boards and ceiling moldings wrap
//    seamlessly around the entire 45° layout as single continuous trims.
// 4. HAND-CRAFTED RUSTIC VIBE: Soft organic curves, continuous grain lines,
//    and authentic master-carpentry joinery throughout.
// =========================================================================

const OUT = '#241206';
const VOID = '#070504';
const W = 1260;
const H = 660;

// =========================================================================
// 1. SVG DEFS: TEXTURES, PATTERNS, GRADIENTS, FILTERS
// =========================================================================
const Defs = () => (
  <defs>
    {/* -----------------------------------------------------------------
        1.1 RUSTIC OAK HARDWOOD FLOOR (Continuous staggered planks)
        ----------------------------------------------------------------- */}
    <pattern id="cx-unified-hardwood" width="96" height="32" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="96" height="8" fill="#c97f33" />
      <rect x="0" y="0" width="56" height="8" fill="#ba7128" />
      <line x1="0" y1="0.7" x2="96" y2="0.7" stroke="rgba(254, 240, 138, 0.3)" strokeWidth="0.8" />
      <line x1="0" y1="8" x2="96" y2="8" stroke="#381703" strokeWidth="1.2" />
      <line x1="56" y1="0" x2="56" y2="8" stroke="#381703" strokeWidth="1.2" />
      <path d="M 8 2.5 Q 24 4.5 44 2 Q 52 1.5 54 2.5" stroke="#78350f" strokeWidth="0.6" fill="none" opacity="0.32" />
      <path d="M 62 3 Q 76 5 90 3" stroke="#78350f" strokeWidth="0.6" fill="none" opacity="0.28" />
      <rect x="2.5" y="2.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="52" y="2.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="58.5" y="2.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />

      <rect x="0" y="8" width="96" height="8" fill="#dc9242" />
      <rect x="24" y="8" width="72" height="8" fill="#cf8538" />
      <line x1="0" y1="8.7" x2="96" y2="8.7" stroke="rgba(254, 240, 138, 0.25)" strokeWidth="0.8" />
      <line x1="0" y1="16" x2="96" y2="16" stroke="#381703" strokeWidth="1.2" />
      <line x1="24" y1="8" x2="24" y2="16" stroke="#381703" strokeWidth="1.2" />
      <path d="M 2 11 Q 12 13 20 11" stroke="#854d0e" strokeWidth="0.6" fill="none" opacity="0.3" />
      <path d="M 32 10.5 Q 54 13.5 86 11" stroke="#854d0e" strokeWidth="0.6" fill="none" opacity="0.32" />
      <rect x="20" y="10.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="26.5" y="10.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="92" y="10.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />

      <rect x="0" y="16" width="96" height="8" fill="#ba7128" />
      <rect x="0" y="16" width="70" height="8" fill="#a8601c" />
      <line x1="0" y1="16.7" x2="96" y2="16.7" stroke="rgba(254, 240, 138, 0.28)" strokeWidth="0.8" />
      <line x1="0" y1="24" x2="96" y2="24" stroke="#381703" strokeWidth="1.2" />
      <line x1="70" y1="16" x2="70" y2="24" stroke="#381703" strokeWidth="1.2" />
      <path d="M 12 19 Q 34 22 60 19" stroke="#632e09" strokeWidth="0.6" fill="none" opacity="0.35" />
      <rect x="2.5" y="18.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="66" y="18.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="72.5" y="18.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />

      <rect x="0" y="24" width="96" height="8" fill="#a05918" />
      <rect x="40" y="24" width="56" height="8" fill="#ba7128" />
      <line x1="0" y1="24.7" x2="96" y2="24.7" stroke="rgba(254, 240, 138, 0.25)" strokeWidth="0.8" />
      <line x1="0" y1="32" x2="96" y2="32" stroke="#381703" strokeWidth="1.2" />
      <line x1="40" y1="24" x2="40" y2="32" stroke="#381703" strokeWidth="1.2" />
      <path d="M 6 27 Q 20 29 36 27" stroke="#54280b" strokeWidth="0.6" fill="none" opacity="0.35" />
      <path d="M 48 26.5 Q 68 29.5 90 27" stroke="#54280b" strokeWidth="0.6" fill="none" opacity="0.3" />
      <rect x="36" y="26.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="42.5" y="26.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
      <rect x="92" y="26.5" width="1.8" height="1.8" fill="#1f0902" rx="0.3" />
    </pattern>

    {/* -----------------------------------------------------------------
        1.2 WALLPAPERS (Upper portion of Double-Wall System)
        ----------------------------------------------------------------- */}
    <pattern id="cx-wallpaper-salon" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="#78350f" />
      <rect x="0" y="0" width="12" height="24" fill="#6d300d" />
      <line x1="12" y1="0" x2="12" y2="24" stroke="#92400e" strokeWidth="0.8" opacity="0.4" />
      <polygon points="6,4 8,8 6,12 4,8" fill="#f59e0b" opacity="0.4" />
      <polygon points="18,16 20,20 18,24 16,20" fill="#f59e0b" opacity="0.4" />
      <circle cx="6" cy="8" r="1.2" fill="#fef08a" opacity="0.55" />
      <circle cx="18" cy="20" r="1.2" fill="#fef08a" opacity="0.55" />
    </pattern>

    <pattern id="cx-wallpaper-store" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="#4c0519" />
      <rect x="0" y="0" width="12" height="24" fill="#430415" />
      <polygon points="6,5 9,8 6,11 3,8" fill="#881337" opacity="0.6" />
      <polygon points="18,17 21,20 18,23 15,20" fill="#881337" opacity="0.6" />
      <circle cx="6" cy="8" r="1.2" fill="#f43f5e" opacity="0.4" />
      <circle cx="18" cy="20" r="1.2" fill="#f43f5e" opacity="0.4" />
    </pattern>

    <pattern id="cx-wallpaper-sanctuary" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="#022c22" />
      <rect x="0" y="0" width="12" height="24" fill="#01221a" />
      <path d="M 6 4 Q 8 7 6 10 Q 4 7 6 4 Z" fill="#059669" opacity="0.5" />
      <path d="M 18 16 Q 20 19 18 22 Q 16 19 18 16 Z" fill="#059669" opacity="0.5" />
      <circle cx="6" cy="7" r="1" fill="#34d399" opacity="0.45" />
      <circle cx="18" cy="19" r="1" fill="#34d399" opacity="0.45" />
    </pattern>

    <pattern id="cx-wallpaper-foyer" width="14" height="24" patternUnits="userSpaceOnUse">
      <rect width="14" height="24" fill="#854d0e" />
      <rect x="0" y="0" width="7" height="24" fill="#713f12" />
      <line x1="7" y1="0" x2="7" y2="24" stroke="#451a03" strokeWidth="0.8" />
      <line x1="1" y1="0" x2="1" y2="24" stroke="rgba(254, 240, 138, 0.15)" strokeWidth="0.8" />
      <line x1="8" y1="0" x2="8" y2="24" stroke="rgba(254, 240, 138, 0.15)" strokeWidth="0.8" />
    </pattern>

    {/* -----------------------------------------------------------------
        1.3 CONTINUOUS CARPENTRY JOINERY GRADIENTS
        ----------------------------------------------------------------- */}
    <linearGradient id="cx-wainscot-oak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#54280b" />
      <stop offset="20%" stopColor="#804112" />
      <stop offset="80%" stopColor="#5c2c0a" />
      <stop offset="100%" stopColor="#2e1406" />
    </linearGradient>

    <linearGradient id="cx-wall-cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f7d094" />
      <stop offset="20%" stopColor="#df944a" />
      <stop offset="65%" stopColor="#9a521e" />
      <stop offset="100%" stopColor="#5a2707" />
    </linearGradient>

    <linearGradient id="cx-bottom-facing-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#eab308" stopOpacity="0.85" />
      <stop offset="35%" stopColor="#92400e" />
      <stop offset="100%" stopColor="#451a03" />
    </linearGradient>

    {/* Seamless Continuous Skirting Board Profile */}
    <linearGradient id="cx-skirting-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#9a521e" />
      <stop offset="25%" stopColor="#6d300d" />
      <stop offset="70%" stopColor="#421a05" />
      <stop offset="100%" stopColor="#1a0802" />
    </linearGradient>

    {/* Seamless Continuous Crown Molding Profile */}
    <linearGradient id="cx-crown-profile" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
      <stop offset="25%" stopColor="#d48a42" />
      <stop offset="65%" stopColor="#78350f" />
      <stop offset="100%" stopColor="#2e1406" />
    </linearGradient>

    {/* -----------------------------------------------------------------
        1.4 VOLUMETRIC SUNLIGHT SHAFTS & FLOOR HIGHLIGHTS
        ----------------------------------------------------------------- */}
    <linearGradient id="sunbeam-left-grad" x1="0.3" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(255, 252, 230, 0.35)" />
      <stop offset="35%" stopColor="rgba(255, 240, 185, 0.20)" />
      <stop offset="75%" stopColor="rgba(255, 225, 140, 0.09)" />
      <stop offset="100%" stopColor="rgba(255, 215, 100, 0)" />
    </linearGradient>

    <linearGradient id="sunbeam-center-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(255, 252, 235, 0.38)" />
      <stop offset="30%" stopColor="rgba(255, 242, 190, 0.22)" />
      <stop offset="75%" stopColor="rgba(255, 225, 140, 0.10)" />
      <stop offset="100%" stopColor="rgba(255, 215, 100, 0)" />
    </linearGradient>

    <linearGradient id="sunbeam-right-grad" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0%" stopColor="rgba(255, 252, 230, 0.35)" />
      <stop offset="35%" stopColor="rgba(255, 240, 185, 0.20)" />
      <stop offset="75%" stopColor="rgba(255, 225, 140, 0.09)" />
      <stop offset="100%" stopColor="rgba(255, 215, 100, 0)" />
    </linearGradient>

    <radialGradient id="sun-floor-patch-radial" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="rgba(255, 245, 195, 0.35)" />
      <stop offset="50%" stopColor="rgba(255, 235, 160, 0.18)" />
      <stop offset="100%" stopColor="rgba(255, 220, 120, 0)" />
    </radialGradient>

    <linearGradient id="cx-window-glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#ffffff" />
      <stop offset="30%" stopColor="#fef08a" />
      <stop offset="75%" stopColor="#fde047" />
      <stop offset="100%" stopColor="#f59e0b" />
    </linearGradient>

    {/* -----------------------------------------------------------------
        1.5 AMBIENT OCCLUSION & DIRECTIONAL CAST SHADOWS
        ----------------------------------------------------------------- */}
    <linearGradient id="ao-wall-drop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.58)" />
      <stop offset="60%" stopColor="rgba(0, 0, 0, 0.24)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </linearGradient>

    <linearGradient id="partition-cast-shadow-right" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.38)" />
      <stop offset="40%" stopColor="rgba(0, 0, 0, 0.22)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </linearGradient>

    <linearGradient id="partition-cast-shadow-down" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.32)" />
      <stop offset="70%" stopColor="rgba(0, 0, 0, 0.14)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </linearGradient>

    <linearGradient id="ao-side-drop-right" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </linearGradient>

    <linearGradient id="ao-side-drop-left" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </linearGradient>

    <radialGradient id="ao-corner-tl" cx="0%" cy="0%" r="100%">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
      <stop offset="70%" stopColor="rgba(0, 0, 0, 0.16)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </radialGradient>
    <radialGradient id="ao-corner-tr" cx="100%" cy="0%" r="100%">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.45)" />
      <stop offset="70%" stopColor="rgba(0, 0, 0, 0.16)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </radialGradient>
    <radialGradient id="ao-corner-bl" cx="0%" cy="100%" r="100%">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.42)" />
      <stop offset="70%" stopColor="rgba(0, 0, 0, 0.14)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </radialGradient>
    <radialGradient id="ao-corner-br" cx="100%" cy="100%" r="100%">
      <stop offset="0%" stopColor="rgba(0, 0, 0, 0.42)" />
      <stop offset="70%" stopColor="rgba(0, 0, 0, 0.14)" />
      <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
    </radialGradient>

    <filter id="cx-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" />
    </filter>
  </defs>
);

// =========================================================================
// 2. RUSTIC COTTAGE WINDOW COMPONENT
// =========================================================================
const CottageWindow = ({ x, y, width = 46, height = 54 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-4" y="-3" width={width + 8} height={height + 10} rx="16" fill="rgba(0,0,0,0.38)" filter="url(#cx-soft-shadow)" />

    <path
      d={`M -3,${height} L -3,18 Q ${width / 2},-4 ${width + 3},18 L ${width + 3},${height} Z`}
      fill="url(#cx-wainscot-oak)"
      stroke={OUT}
      strokeWidth="2"
    />
    <path
      d={`M -1,${height} L -1,19 Q ${width / 2},-1 ${width + 1},19 L ${width + 1},${height}`}
      fill="none"
      stroke="#fef08a"
      strokeWidth="1.2"
      opacity="0.85"
    />

    <path
      d={`M 4,${height - 4} L 4,18 Q ${width / 2},3 ${width - 4},18 L ${width - 4},${height - 4} Z`}
      fill="#241206"
      stroke={OUT}
      strokeWidth="1.5"
    />

    <path
      d={`M 6,${height - 6} L 6,19 Q ${width / 2},6 ${width - 6},19 L ${width - 6},${height - 6} Z`}
      fill="url(#cx-window-glass)"
    />

    <polygon points="8,24 18,12 23,12 11,28" fill="rgba(255, 255, 255, 0.55)" />

    <line x1={width / 2} y1="7" x2={width / 2} y2={height - 6} stroke="#ffffff" strokeWidth="2.4" />
    <line x1={width / 2} y1="7" x2={width / 2} y2={height - 6} stroke="#b45309" strokeWidth="0.8" opacity="0.6" />
    <line x1="6" y1={height / 2 + 4} x2={width - 6} y2={height / 2 + 4} stroke="#ffffff" strokeWidth="2.4" />
    <line x1="6" y1={height / 2 + 4} x2={width - 6} y2={height / 2 + 4} stroke="#b45309" strokeWidth="0.8" opacity="0.6" />

    <rect x="-6" y={height - 2} width={width + 12} height="8" rx="1.5" fill="#a16207" stroke={OUT} strokeWidth="1.6" />
    <line x1="-5" y1={height} x2={width + 5} y2={height} stroke="#fef08a" strokeWidth="1.2" opacity="0.85" />
    <polygon points={`-2,${height + 6} 4,${height + 6} 2,${height + 12} -2,${height + 12}`} fill="#54280b" stroke={OUT} strokeWidth="1" />
    <polygon points={`${width - 4},${height + 6} ${width + 2},${height + 6} ${width + 2},${height + 12} ${width - 2},${height + 12}`} fill="#54280b" stroke={OUT} strokeWidth="1" />
  </g>
);

// =========================================================================
// 3. UNIFIED HAND-CARVED TIMBER ARCHWAYS (Flowing smoothly into walls)
// =========================================================================
const WoodenArchway = ({ x, y, width = 36, height = 135, hasStep = false }) => (
  <g transform={`translate(${x}, ${y})`}>
    {/* 1. Floor Threshold Transition */}
    {hasStep ? (
      /* Split-Level 1-Step Inset */
      <g id="split-level-step">
        <rect x="-8" y="10" width={8} height={height - 20} fill="rgba(0,0,0,0.52)" filter="url(#cx-soft-shadow)" />
        <rect x="-4" y="12" width="6" height={height - 24} fill="#241206" stroke={OUT} strokeWidth="1" />
        <line x1="-1" y1="14" x2="-1" y2={height - 14} stroke="#451a03" strokeWidth="1" />
        <rect x="2" y="10" width={width} height={height - 20} rx="2" fill="#d97706" stroke={OUT} strokeWidth="1.4" />
        <line x1="2" y1="11" x2="2" y2={height - 11} stroke="#fef08a" strokeWidth="2.4" />
        <line x1="3" y1="11" x2="3" y2={height - 11} stroke="#f59e0b" strokeWidth="1" />
        <line x1={width / 2 + 2} y1="12" x2={width / 2 + 2} y2={height - 12} stroke="#78350f" strokeWidth="1.2" />
        <circle cx={width / 2 + 2} cy={height / 3} r="1.4" fill="#fef08a" stroke="#451a03" strokeWidth="0.8" />
        <circle cx={width / 2 + 2} cy={(height * 2) / 3} r="1.4" fill="#fef08a" stroke="#451a03" strokeWidth="0.8" />
      </g>
    ) : (
      /* Flush Hardwood & Brass Saddle */
      <g id="flush-threshold">
        <rect x="-2" y="10" width={width + 4} height={height - 20} rx="2" fill="#854d0e" stroke="#241206" strokeWidth="1.2" />
        <line x1="-1" y1="12" x2="-1" y2={height - 12} stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />
        <line x1={width + 1} y1="12" x2={width + 1} y2={height - 12} stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />
        <line x1={width / 2} y1="11" x2={width / 2} y2={height - 11} stroke="#54280b" strokeWidth="1.6" />
      </g>
    )}

    {/* Archway Interior Ambient Shadow */}
    <rect x="0" y="10" width={width} height="16" fill="rgba(0,0,0,0.42)" />

    {/* 2. Seamlessly Blended Curved Arch Spandrel & Header */}
    {/* Sweeping outer timber header connecting to partition wall */}
    <path
      d={`
        M -6,-6
        L ${width + 6},-6
        L ${width + 6},14
        Q ${width + 6},24 ${width},28
        L ${width},18
        Q ${width / 2},6 0,18
        L 0,28
        Q -6,24 -6,14
        Z
      `}
      fill="url(#cx-wall-cap)"
      stroke={OUT}
      strokeWidth="1.8"
    />
    {/* Continuous curved gold highlight contour */}
    <path
      d={`M -5,-4 L ${width + 5},-4 L ${width + 5},12 Q ${width + 4},20 ${width},22`}
      fill="none"
      stroke="#fef08a"
      strokeWidth="1.4"
      opacity="0.9"
    />

    {/* Inner Curved Hand-Carved Arch Soffit */}
    <path
      d={`M -2,22 Q ${width / 2},8 ${width + 2},22 L ${width + 2},27 Q ${width / 2},13 -2,27 Z`}
      fill="#451a03"
      stroke={OUT}
      strokeWidth="1.2"
    />

    {/* Elegant Center Carved Keystone */}
    <polygon points={`${width / 2 - 5},-8 ${width / 2 + 5},-8 ${width / 2 + 3.5},10 ${width / 2 - 3.5},10`} fill="#b45309" stroke={OUT} strokeWidth="1.2" />
    <circle cx={width / 2} cy="1" r="2" fill="#fef08a" stroke="#451a03" strokeWidth="0.8" />

    {/* 3. Door Jambs with Curved Capital Brackets */}
    {/* North side corbel curve */}
    <path d="M -3,14 Q 0,26 -3,38 L 3,38 Q 4,26 3,14 Z" fill="#632e09" stroke={OUT} strokeWidth="1" />
    <path d={`M ${width + 3},14 Q ${width},26 ${width + 3},38 L ${width - 3},38 Q ${width - 4},26 ${width - 3},14 Z`} fill="#632e09" stroke={OUT} strokeWidth="1" />

    {/* 4. South Doorpost Facing Player (Smoothly blending with baseboard) */}
    <g transform={`translate(0, ${height - 26})`}>
      <path
        d={`
          M -4,0
          L ${width + 4},0
          L ${width + 4},16
          Q ${width + 4},24 ${width},24
          L 0,24
          Q -4,24 -4,16
          Z
        `}
        fill="url(#cx-wainscot-oak)"
        stroke={OUT}
        strokeWidth="1.6"
      />
      <line x1="-3" y1="2" x2={width + 3} y2="2" stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />
      <rect x="-4" y="14" width={width + 8} height="10" rx="1.5" fill="url(#cx-skirting-face)" stroke={OUT} strokeWidth="1.2" />
      <line x1="-3" y1="15" x2={width + 3} y2="15" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />
      <ellipse cx={width / 2} cy="26" rx={width / 2 + 8} ry="5" fill="rgba(0,0,0,0.4)" filter="url(#cx-soft-shadow)" />
    </g>
  </g>
);

// =========================================================================
// 4. MAIN ARCHITECTURAL COMPONENT
// =========================================================================
export function ComplexArchitectureSVG() {
  return (
    <svg
      className="complex-architecture-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Defs />

      {/* =========================================================================
          LAYER 1: DEEP RPG VOID BACKGROUND
          ========================================================================= */}
      <rect x="0" y="0" width={W} height={H} fill={VOID} />

      {/* =========================================================================
          LAYER 2: UNIFIED HOUSE HARDWOOD FOUNDATION (45° CHAMFERED SILHOUETTE)
          ========================================================================= */}
      <path
        d={`
          M 46,200
          L 150,96
          L 410,96
          L 470,36
          L 790,36
          L 850,96
          L 1110,96
          L 1214,200
          L 1214,470
          L 1100,584
          L 1100,605
          L 850,605
          L 850,555
          L 814,555
          L 814,605
          L 690,605
          L 690,624
          L 570,624
          L 570,605
          L 446,605
          L 446,555
          L 410,555
          L 410,605
          L 160,605
          L 160,584
          L 46,470
          Z
        `}
        fill="url(#cx-unified-hardwood)"
        stroke={OUT}
        strokeWidth="2.5"
      />

      {/* =========================================================================
          LAYER 3: AREA RUGS WITH COMPLETE 4-SIDED FRINGE THREADS & MICRO SHADOWS
          ========================================================================= */}

      {/* --- 3.1 URGENT ZONE (RED ROOM): Deep Burgundy Persian Accent Rug --- */}
      <g id="area-rug-urgent">
        <ellipse cx="230" cy="375" rx="146" ry="164" fill="rgba(0,0,0,0.32)" filter="url(#cx-soft-shadow)" />
        {/* Micro Drop-Shadow elevating rug on top of hardwood */}
        <rect x="101" y="221" width="260" height="310" rx="7" fill="rgba(0,0,0,0.32)" />

        {/* Top Fringes */}
        <g id="rug-urgent-top-fringes">
          {Array.from({ length: 50 }).map((_, i) => (
            <line
              key={`u-tf-${i}`}
              x1={102 + i * 5.1}
              y1="214"
              x2={102 + i * 5.1 + (i % 2 === 0 ? 0.8 : -0.8)}
              y2="221"
              stroke="#fef3c7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <line x1="102" y1="213" x2="358" y2="213" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
        </g>

        {/* Bottom Fringes */}
        <g id="rug-urgent-bottom-fringes">
          {Array.from({ length: 50 }).map((_, i) => (
            <line
              key={`u-bf-${i}`}
              x1={102 + i * 5.1}
              y1="529"
              x2={102 + i * 5.1 + (i % 2 === 0 ? 0.8 : -0.8)}
              y2="537"
              stroke="#fef3c7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <line x1="102" y1="538" x2="358" y2="538" stroke="rgba(0,0,0,0.35)" strokeWidth="1.2" />
        </g>

        {/* Left Edge Fringes */}
        <g id="rug-urgent-left-fringes">
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={`u-lf-${i}`}
              x1="96"
              y1={230 + i * 7.5}
              x2="101"
              y2={230 + i * 7.5}
              stroke="#fef3c7"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}
        </g>
        {/* Right Edge Fringes */}
        <g id="rug-urgent-right-fringes">
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={`u-rf-${i}`}
              x1="359"
              y1={230 + i * 7.5}
              x2="364"
              y2={230 + i * 7.5}
              stroke="#fef3c7"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}
        </g>

        {/* Main Rug Body */}
        <rect x="100" y="220" width="260" height="310" rx="6" fill="#58111e" stroke={OUT} strokeWidth="2.4" />
        <rect x="110" y="230" width="240" height="290" rx="4" fill="none" stroke="#d97706" strokeWidth="4" strokeDasharray="8 4" />
        <rect x="118" y="238" width="224" height="274" rx="3" fill="#6d1226" stroke="#f59e0b" strokeWidth="1.6" />
        <polygon points="230,270 305,375 230,480 155,375" fill="#440915" stroke="#f59e0b" strokeWidth="2.2" />
        <polygon points="230,290 290,375 230,460 170,375" fill="#78162b" stroke="#fef08a" strokeWidth="1.4" strokeDasharray="5 3" />
        <circle cx="230" cy="375" r="9" fill="#fef08a" stroke="#440915" strokeWidth="1.8" />
        <circle cx="122" cy="242" r="3.5" fill="#f59e0b" stroke="#440915" strokeWidth="1" />
        <circle cx="338" cy="242" r="3.5" fill="#f59e0b" stroke="#440915" strokeWidth="1" />
        <circle cx="122" cy="508" r="3.5" fill="#f59e0b" stroke="#440915" strokeWidth="1" />
        <circle cx="338" cy="508" r="3.5" fill="#f59e0b" stroke="#440915" strokeWidth="1" />
      </g>

      {/* --- 3.2 CENTRAL HALL (YELLOW ZONE): Festive Terracotta & Gold Medallion Rug --- */}
      <g id="area-rug-central-hall">
        <ellipse cx="630" cy="255" rx="164" ry="114" fill="rgba(0,0,0,0.32)" filter="url(#cx-soft-shadow)" />
        <rect x="481" y="156" width="300" height="200" rx="13" fill="rgba(0,0,0,0.32)" />

        {/* Left Side Fringes */}
        <g id="rug-central-left-fringes">
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`c-lf-${i}`}
              x1="474"
              y1={160 + i * 5.8}
              x2="481"
              y2={160 + i * 5.8}
              stroke="#fef3c7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* Right Side Fringes */}
        <g id="rug-central-right-fringes">
          {Array.from({ length: 32 }).map((_, i) => (
            <line
              key={`c-rf-${i}`}
              x1={779}
              y1={160 + i * 5.8}
              x2={786}
              y2={160 + i * 5.8}
              stroke="#fef3c7"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
        </g>
        {/* Top Edge Fringes */}
        <g id="rug-central-top-fringes">
          {Array.from({ length: 44 }).map((_, i) => (
            <line
              key={`c-tf-${i}`}
              x1={490 + i * 6.5}
              y1="150"
              x2={490 + i * 6.5}
              y2="155"
              stroke="#fef3c7"
              strokeWidth="1.2"
              opacity="0.85"
            />
          ))}
        </g>
        {/* Bottom Edge Fringes */}
        <g id="rug-central-bottom-fringes">
          {Array.from({ length: 44 }).map((_, i) => (
            <line
              key={`c-bf-${i}`}
              x1={490 + i * 6.5}
              y1="355"
              x2={490 + i * 6.5}
              y2="360"
              stroke="#fef3c7"
              strokeWidth="1.2"
              opacity="0.85"
            />
          ))}
        </g>

        <rect x="480" y="155" width="300" height="200" rx="12" fill="#92400e" stroke={OUT} strokeWidth="2.4" />
        <rect x="492" y="167" width="276" height="176" rx="8" fill="#b45309" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
        <rect x="504" y="179" width="252" height="152" rx="6" fill="#d97706" stroke="#fef08a" strokeWidth="1.6" />
        <ellipse cx="630" cy="255" rx="72" ry="48" fill="#fef3c7" stroke="#78350f" strokeWidth="2.5" />
        <path d="M 630 220 Q 644 238 630 255 Q 616 238 630 220 Z" fill="#b45309" />
        <path d="M 630 255 Q 644 272 630 290 Q 616 272 630 255 Z" fill="#b45309" />
        <path d="M 590 255 Q 610 268 630 255 Q 610 242 590 255 Z" fill="#b45309" />
        <path d="M 630 255 Q 650 268 670 255 Q 650 242 630 255 Z" fill="#b45309" />
        <circle cx="630" cy="255" r="7.5" fill="#f59e0b" stroke="#78350f" strokeWidth="1.6" />
      </g>

      {/* --- 3.3 ROUTINE ZONE (GREEN ROOM): Sage Green Earth-Toned Rug --- */}
      <g id="area-rug-routine">
        <ellipse cx="1030" cy="375" rx="146" ry="164" fill="rgba(0,0,0,0.32)" filter="url(#cx-soft-shadow)" />
        <rect x="901" y="221" width="260" height="310" rx="7" fill="rgba(0,0,0,0.32)" />

        {/* Top Fringes */}
        <g id="rug-routine-top-fringes">
          {Array.from({ length: 50 }).map((_, i) => (
            <line
              key={`r-tf-${i}`}
              x1={902 + i * 5.1}
              y1="214"
              x2={902 + i * 5.1 + (i % 2 === 0 ? 0.8 : -0.8)}
              y2="221"
              stroke="#d1fae5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <line x1="902" y1="213" x2="1158" y2="213" stroke="rgba(0,0,0,0.32)" strokeWidth="1.2" />
        </g>

        {/* Bottom Fringes */}
        <g id="rug-routine-bottom-fringes">
          {Array.from({ length: 50 }).map((_, i) => (
            <line
              key={`r-bf-${i}`}
              x1={902 + i * 5.1}
              y1="529"
              x2={902 + i * 5.1 + (i % 2 === 0 ? 0.8 : -0.8)}
              y2="537"
              stroke="#d1fae5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
          <line x1="902" y1="538" x2="1158" y2="538" stroke="rgba(0,0,0,0.32)" strokeWidth="1.2" />
        </g>

        {/* Left Edge Fringes */}
        <g id="rug-routine-left-fringes">
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={`r-lf-${i}`}
              x1="896"
              y1={230 + i * 7.5}
              x2="901"
              y2={230 + i * 7.5}
              stroke="#d1fae5"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}
        </g>
        {/* Right Edge Fringes */}
        <g id="rug-routine-right-fringes">
          {Array.from({ length: 38 }).map((_, i) => (
            <line
              key={`r-rf-${i}`}
              x1="1159"
              y1={230 + i * 7.5}
              x2="1164"
              y2={230 + i * 7.5}
              stroke="#d1fae5"
              strokeWidth="1.2"
              opacity="0.8"
            />
          ))}
        </g>

        <rect x="900" y="220" width="260" height="310" rx="6" fill="#064e3b" stroke={OUT} strokeWidth="2.4" />
        <rect x="910" y="230" width="240" height="290" rx="4" fill="none" stroke="#34d399" strokeWidth="3.5" strokeDasharray="8 4" />
        <rect x="918" y="238" width="224" height="274" rx="3" fill="#047857" stroke="#a7f3d0" strokeWidth="1.6" />
        <ellipse cx="1030" cy="375" rx="65" ry="85" fill="#022c22" stroke="#34d399" strokeWidth="2.2" />
        <ellipse cx="1030" cy="375" rx="50" ry="68" fill="#065f46" stroke="#a7f3d0" strokeWidth="1.4" strokeDasharray="5 3" />
        <circle cx="1030" cy="375" r="14" fill="#a7f3d0" stroke="#047857" strokeWidth="2.2" />
      </g>

      {/* --- 3.4 NEUTRAL FOYER: Braided Oval Welcome Mat --- */}
      <g id="area-rug-foyer">
        <ellipse cx="630" cy="560" rx="60" ry="25" fill="rgba(0,0,0,0.28)" filter="url(#cx-soft-shadow)" />
        <ellipse cx="631" cy="561" rx="58" ry="23" fill="rgba(0,0,0,0.3)" />
        <ellipse cx="630" cy="558" rx="58" ry="23" fill="#451a03" stroke={OUT} strokeWidth="2.2" />
        <ellipse cx="630" cy="558" rx="50" ry="18" fill="#78350f" stroke="#f59e0b" strokeWidth="1.6" strokeDasharray="5 3" />
        <ellipse cx="630" cy="558" rx="40" ry="13" fill="#a16207" stroke="#fef08a" strokeWidth="1" opacity="0.8" />
      </g>

      {/* =========================================================================
          LAYER 4: DIRECTIONAL LIGHT OCCLUSION & CAST SHADOWS
          ========================================================================= */}
      {/* Wall-Base Drop Shadows under North Facades */}
      <rect x="470" y="114" width="320" height="26" fill="url(#ao-wall-drop)" />
      <rect x="150" y="164" width="260" height="26" fill="url(#ao-wall-drop)" />
      <rect x="850" y="164" width="260" height="26" fill="url(#ao-wall-drop)" />
      <rect x="446" y="440" width="109" height="20" fill="url(#ao-wall-drop)" />
      <rect x="705" y="440" width="109" height="20" fill="url(#ao-wall-drop)" />

      {/* Partition Directional Cast Shadows */}
      <polygon points="446,96 476,120 476,430 446,420" fill="url(#partition-cast-shadow-right)" />
      <polygon points="446,555 474,575 474,605 446,605" fill="url(#partition-cast-shadow-right)" />
      <polygon points="850,96 882,120 882,430 850,420" fill="url(#partition-cast-shadow-right)" />
      <polygon points="850,555 878,575 878,605 850,605" fill="url(#partition-cast-shadow-right)" />
      <rect x="410" y="406" width="145" height="18" fill="url(#partition-cast-shadow-down)" />
      <rect x="705" y="406" width="145" height="18" fill="url(#partition-cast-shadow-down)" />

      {/* Partition Ambient Side Shadows */}
      <rect x="394" y="96" width="16" height="330" fill="url(#ao-side-drop-left)" />
      <rect x="850" y="96" width="16" height="330" fill="url(#ao-side-drop-right)" />

      {/* Corner Vignettes */}
      <rect x="46" y="200" width="90" height="90" fill="url(#ao-corner-tl)" />
      <rect x="320" y="96" width="90" height="90" fill="url(#ao-corner-tr)" />
      <rect x="46" y="440" width="90" height="90" fill="url(#ao-corner-bl)" />
      <rect x="320" y="515" width="90" height="90" fill="url(#ao-corner-br)" />

      <rect x="470" y="36" width="90" height="90" fill="url(#ao-corner-tl)" />
      <rect x="700" y="36" width="90" height="90" fill="url(#ao-corner-tr)" />

      <rect x="850" y="96" width="90" height="90" fill="url(#ao-corner-tl)" />
      <rect x="1124" y="200" width="90" height="90" fill="url(#ao-corner-tr)" />
      <rect x="850" y="515" width="90" height="90" fill="url(#ao-corner-bl)" />
      <rect x="1124" y="440" width="90" height="90" fill="url(#ao-corner-br)" />

      {/* =========================================================================
          LAYER 5: DOUBLE-WALL SYSTEM WITH CONTINUOUS, SEAMLESS CARPENTRY TRIMS
          Baseboards and crown moldings wrap as unbroken ribbons around the corners
          ========================================================================= */}

      {/* --- 5.1 MAIN HALL NORTH WALL & WALLPAPERS --- */}
      <g id="wall-face-main-hall">
        <rect x="470" y="36" width="320" height="44" fill="url(#cx-wallpaper-salon)" stroke={OUT} strokeWidth="1.2" />
        <polygon points="410,96 470,36 470,80 410,140" fill="url(#cx-wallpaper-salon)" />
        <polygon points="790,36 850,96 850,140 790,80" fill="url(#cx-wallpaper-salon)" />

        {/* Lower Wainscot Oak Paneling with grooves */}
        <polygon points="410,145 470,85 790,85 850,145 850,168 790,108 470,108 410,168" fill="url(#cx-wainscot-oak)" />
        <rect x="470" y="85" width="320" height="23" fill="url(#cx-wainscot-oak)" />
        {Array.from({ length: 19 }).map((_, i) => (
          <line key={`groove-mh-${i}`} x1={470 + (i + 1) * 16} y1="86" x2={470 + (i + 1) * 16} y2="108" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
        ))}

        {/* UNIFIED CONTINUOUS CROWN MOLDING (Wrapping from West to East without seams!) */}
        <path
          d="M 408,94 L 468,34 L 792,34 L 852,94"
          fill="none"
          stroke="url(#cx-crown-profile)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 408,92 L 468,32 L 792,32 L 852,92"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.9"
          strokeLinejoin="round"
        />

        {/* UNIFIED CONTINUOUS CHAIR RAIL (Mid-wall divider ribbon) */}
        <path
          d="M 410,140 L 470,80 L 790,80 L 850,140"
          fill="none"
          stroke="#b45309"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 410,140 L 470,80 L 790,80 L 850,140"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.2"
          opacity="0.85"
          strokeLinejoin="round"
        />

        {/* UNIFIED CONTINUOUS BASEBOARD SKIRTING (Wrapping smoothly across corners!) */}
        <path
          d="M 410,168 L 470,108 L 790,108 L 850,168"
          fill="none"
          stroke="url(#cx-skirting-face)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 410,165 L 470,105 L 790,105 L 850,165"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.85"
          strokeLinejoin="round"
        />
        {/* Baseboard bottom contact line */}
        <path
          d="M 410,172 L 470,112 L 790,112 L 850,172"
          fill="none"
          stroke="#120803"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* --- 5.2 LEFT WING (RED ROOM / ZONE) --- */}
      <g id="wall-face-left-store">
        <polygon points="46,200 150,96 410,96 410,138 150,138 46,242" fill="url(#cx-wallpaper-store)" />
        <polygon points="46,242 150,138 410,138 410,164 150,164 46,268" fill="url(#cx-wainscot-oak)" />

        {/* Continuous Crown Molding wrapping around NW 45° angle */}
        <path
          d="M 44,198 L 148,94 L 410,94"
          fill="none"
          stroke="url(#cx-crown-profile)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 44,196 L 148,92 L 410,92"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.9"
          strokeLinejoin="round"
        />

        {/* Continuous Chair Rail */}
        <path
          d="M 46,242 L 150,138 L 410,138"
          fill="none"
          stroke="#881337"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 46,242 L 150,138 L 410,138"
          fill="none"
          stroke="#f43f5e"
          strokeWidth="1.2"
          opacity="0.8"
          strokeLinejoin="round"
        />

        {/* Continuous Baseboard Skirting Board */}
        <path
          d="M 46,268 L 150,164 L 410,164"
          fill="none"
          stroke="url(#cx-skirting-face)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 46,265 L 150,161 L 410,161"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.85"
          strokeLinejoin="round"
        />
        <path
          d="M 46,272 L 150,168 L 410,168"
          fill="none"
          stroke="#120803"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* --- 5.3 RIGHT WING (GREEN ROOM / ZONE) --- */}
      <g id="wall-face-right-sanctuary">
        <polygon points="850,96 1110,96 1214,200 1214,242 1110,138 850,138" fill="url(#cx-wallpaper-sanctuary)" />
        <polygon points="850,138 1110,138 1214,242 1214,268 1110,164 850,164" fill="url(#cx-wainscot-oak)" />

        {/* Continuous Crown Molding wrapping around NE 45° angle */}
        <path
          d="M 850,94 L 1112,94 L 1216,198"
          fill="none"
          stroke="url(#cx-crown-profile)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 850,92 L 1112,92 L 1216,196"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.9"
          strokeLinejoin="round"
        />

        {/* Continuous Chair Rail */}
        <path
          d="M 850,138 L 1110,138 L 1214,242"
          fill="none"
          stroke="#047857"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 850,138 L 1110,138 L 1214,242"
          fill="none"
          stroke="#34d399"
          strokeWidth="1.2"
          opacity="0.8"
          strokeLinejoin="round"
        />

        {/* Continuous Baseboard Skirting Board */}
        <path
          d="M 850,164 L 1110,164 L 1214,268"
          fill="none"
          stroke="url(#cx-skirting-face)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 850,161 L 1110,161 L 1214,265"
          fill="none"
          stroke="#fef08a"
          strokeWidth="1.4"
          opacity="0.85"
          strokeLinejoin="round"
        />
        <path
          d="M 850,168 L 1110,168 L 1214,272"
          fill="none"
          stroke="#120803"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      {/* --- 5.4 FOYER DIVIDERS WITH INTEGRATED BASEBOARDS --- */}
      <rect x="446" y="406" width="109" height="28" fill="url(#cx-wallpaper-foyer)" stroke={OUT} strokeWidth="1.2" />
      <rect x="446" y="434" width="109" height="8" fill="url(#cx-skirting-face)" stroke={OUT} strokeWidth="1.2" />
      <line x1="446" y1="435" x2="555" y2="435" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />

      <rect x="705" y="406" width="109" height="28" fill="url(#cx-wallpaper-foyer)" stroke={OUT} strokeWidth="1.2" />
      <rect x="705" y="434" width="109" height="8" fill="url(#cx-skirting-face)" stroke={OUT} strokeWidth="1.2" />
      <line x1="705" y1="435" x2="814" y2="435" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />

      {/* =========================================================================
          LAYER 6: UNIFIED CONTINUOUS TIMBER WALL CAPS & RAFTERS
          Zero modular tile seams: full continuous flowing contours around the entire house
          ========================================================================= */}

      {/* 6.1 MAIN HALL CONTINUOUS ROOF BEAM CONTOUR (NW Chamfer -> North -> NE Chamfer) */}
      <path
        d={`
          M 400,72
          L 460,12
          L 800,12
          L 860,72
          L 838,94
          L 778,34
          L 482,34
          L 422,94
          Z
        `}
        fill="url(#cx-wall-cap)"
        stroke={OUT}
        strokeWidth="2"
      />
      {/* Unbroken top highlight contour */}
      <path
        d="M 402,74 L 462,14 L 798,14 L 858,74"
        fill="none"
        stroke="#fef08a"
        strokeWidth="1.6"
        opacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 6.2 LEFT WING CONTINUOUS TIMBER WALL CAP (South West -> Side Wall -> NW Chamfer -> North Run) */}
      <path
        d={`
          M 18,490
          L 18,180
          L 26,176
          L 136,66
          L 410,66
          L 410,98
          L 142,98
          L 48,198
          L 52,470
          Z
        `}
        fill="url(#cx-wall-cap)"
        stroke={OUT}
        strokeWidth="2"
      />
      {/* Unbroken left wing highlight ribbon */}
      <path
        d="M 20,488 L 20,181 L 28,178 L 138,68 L 408,68"
        fill="none"
        stroke="#fef08a"
        strokeWidth="1.6"
        opacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Left Wing SW 45° Chamfer Cap (Cleanly mitered into side wall) */}
      <polygon points="26,494 150,618 172,596 48,472" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
      <line x1="28" y1="492" x2="148" y2="612" stroke="#fef08a" strokeWidth="1.8" opacity="0.85" />

      {/* 6.3 RIGHT WING CONTINUOUS TIMBER WALL CAP (North Run -> NE Chamfer -> Side Wall -> SE) */}
      <path
        d={`
          M 850,66
          L 1120,66
          L 1230,176
          L 1238,180
          L 1238,490
          L 1204,470
          L 1208,198
          L 1098,88
          L 850,88
          Z
        `}
        fill="url(#cx-wall-cap)"
        stroke={OUT}
        strokeWidth="2"
      />
      {/* Unbroken right wing highlight ribbon */}
      <path
        d="M 852,68 L 1118,68 L 1228,178 L 1236,181 L 1236,488"
        fill="none"
        stroke="#fef08a"
        strokeWidth="1.6"
        opacity="0.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Right Wing SE 45° Chamfer Cap */}
      <polygon points="1230,494 1106,618 1084,596 1208,472" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
      <line x1="1228" y1="492" x2="1108" y2="612" stroke="#fef08a" strokeWidth="1.8" opacity="0.85" />

      {/* 6.4 CONTINUOUS VERTICAL PARTITION BEAMS (Flowing down into the archways) */}
      <rect x="410" y="88" width="36" height="332" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
      <line x1="411" y1="90" x2="411" y2="418" stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />

      <rect x="814" y="88" width="36" height="332" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
      <line x1="815" y1="90" x2="815" y2="418" stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />

      {/* Lower Partition Runs */}
      <rect x="410" y="555" width="36" height="50" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
      <rect x="814" y="555" width="36" height="50" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />

      {/* 6.5 UNIFIED FOYER TIE-BEAM & PORTAL (Spanning x: 410 to x: 850 seamlessly) */}
      <g id="unified-foyer-tiebeam">
        {/* Continuous top beam spanning across foyer */}
        <rect x="410" y="374" width="440" height="32" fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2" />
        <line x1="411" y1="376" x2="849" y2="376" stroke="#fef08a" strokeWidth="1.6" opacity="0.9" />

        {/* Central Portal Opening (x: 555 to x: 705) with Hand-Carved Curved Brackets */}
        {/* Cutout portal arch threshold */}
        <rect x="555" y="374" width="150" height="32" fill="#78350f" stroke="#351602" strokeWidth="1.5" />
        <line x1="555" y1="376" x2="705" y2="376" stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />
        <line x1="555" y1="405" x2="705" y2="405" stroke="#241206" strokeWidth="1.5" />

        {/* Sweeping hand-carved timber corbels at portal opening */}
        <path
          d="M 555,374 Q 555,398 540,406 L 555,406 Q 562,398 565,374 Z"
          fill="#54280b"
          stroke={OUT}
          strokeWidth="1.2"
        />
        <path
          d="M 705,374 Q 705,398 720,406 L 705,406 Q 698,398 695,374 Z"
          fill="#54280b"
          stroke={OUT}
          strokeWidth="1.2"
        />
      </g>

      {/* =========================================================================
          LAYER 7: RUSTIC COTTAGE WINDOWS & VOLUMETRIC SUNBEAMS
          ========================================================================= */}
      <CottageWindow x={245} y={102} width={44} height={52} />
      <CottageWindow x={535} y={42} width={42} height={50} />
      <CottageWindow x={685} y={42} width={42} height={50} />
      <CottageWindow x={965} y={102} width={44} height={52} />

      {/* Volumetric Sunbeams */}
      <polygon
        points="247,150 289,150 250,440 90,440"
        fill="url(#sunbeam-left-grad)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
      <polygon
        points="90,430 250,430 230,480 70,480"
        fill="url(#sun-floor-patch-radial)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />

      <polygon
        points="537,90 577,90 610,340 480,340"
        fill="url(#sunbeam-center-grad)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
      <polygon
        points="687,90 727,90 760,340 640,340"
        fill="url(#sunbeam-center-grad)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
      <ellipse
        cx="545"
        cy="335"
        rx="75"
        ry="34"
        fill="url(#sun-floor-patch-radial)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
      <ellipse
        cx="695"
        cy="335"
        rx="75"
        ry="34"
        fill="url(#sun-floor-patch-radial)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />

      <polygon
        points="967,150 1009,150 1170,440 1010,440"
        fill="url(#sunbeam-right-grad)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />
      <polygon
        points="1010,430 1170,430 1190,480 1030,480"
        fill="url(#sun-floor-patch-radial)"
        style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
      />

      {/* =========================================================================
          LAYER 8: UNIFIED HAND-CARVED TIMBER ARCHWAYS
          Morphing organically from the partition walls with curved brackets
          ========================================================================= */}
      {/* 8.1 West Archway (Transition between Urgent Room and Foyer/Hall) */}
      <WoodenArchway x={410} y={420} width={36} height={135} hasStep={false} />

      {/* 8.2 East Archway WITH 1-STEP SPLIT-LEVEL THRESHOLD (Sanctuary Inset) */}
      <WoodenArchway x={814} y={420} width={36} height={135} hasStep={true} />

      {/* =========================================================================
          LAYER 9: LOW-PROFILE FRONT-FACING WALLS (WITH 45° SLOPED CORNER SILLS)
          ========================================================================= */}
      {/* Left Wing South Horizontal Sill */}
      <rect x="160" y="605" width="250" height="14" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <line x1="160" y1="606.5" x2="410" y2="606.5" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />

      {/* Left Wing SW 45° Sloped Sill */}
      <polygon points="46,470 160,584 170,574 56,460" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <line x1="48" y1="468" x2="162" y2="582" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />

      {/* Right Wing South Horizontal Sill */}
      <rect x="850" y="605" width="250" height="14" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <line x1="850" y1="606.5" x2="1100" y2="606.5" stroke="#fef08a" strokeWidth="1.2" opacity="0.75" />

      {/* Right Wing SE 45° Sloped Sill */}
      <polygon points="1214,470 1100,584 1090,574 1204,460" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <line x1="1212" y1="468" x2="1098" y2="582" stroke="#fef08a" strokeWidth="1.2" opacity="0.8" />

      {/* Foyer South Sills & Entrance Step */}
      <rect x="446" y="605" width="124" height="14" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <rect x="690" y="605" width="124" height="14" fill="url(#cx-bottom-facing-wall)" stroke={OUT} strokeWidth="1.8" />
      <rect x="570" y="605" width="120" height="20" fill="#78350f" stroke={OUT} strokeWidth="1.8" />
      <line x1="570" y1="606.5" x2="690" y2="606.5" stroke="#fef08a" strokeWidth="1.2" opacity="0.7" />
      <rect x="580" y="618" width="100" height="8" rx="2" fill="#451a03" stroke={OUT} strokeWidth="1.2" />
    </svg>
  );
}

// =========================================================================
// 5. VOLUMETRIC LIGHTING OVERLAY
// =========================================================================
const POOLS = [
  { x: 630, y: 180, rx: 250, ry: 160, o: 0.95 },
  { x: 230, y: 350, rx: 210, ry: 190, o: 0.75 },
  { x: 1010, y: 350, rx: 210, ry: 190, o: 0.8 },
  { x: 630, y: 500, rx: 170, ry: 120, o: 0.7 },
  { x: 630, y: 610, rx: 110, ry: 55, o: 0.75 },
  { x: 180, y: 175, rx: 90, ry: 70, o: 0.6 }
];

export function ComplexLightingSVG() {
  return (
    <svg
      className="complex-lighting-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', left: 0, top: 0, zIndex: 28, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cx-lamp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(255, 215, 120, 0.9)" />
          <stop offset="0.45" stopColor="rgba(255, 175, 75, 0.4)" />
          <stop offset="1" stopColor="rgba(255, 150, 50, 0)" />
        </radialGradient>
      </defs>
      {POOLS.map((p, i) => (
        <g key={i} className="complex-light-pool" style={{ animationDelay: `${(i % 6) * 0.35}s` }}>
          <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="url(#cx-lamp-glow)" opacity={p.o} style={{ mixBlendMode: 'soft-light' }} />
          <ellipse cx={p.x} cy={p.y} rx={p.rx * 0.75} ry={p.ry * 0.75} fill="url(#cx-lamp-glow)" opacity={p.o * 0.35} style={{ mixBlendMode: 'screen' }} />
        </g>
      ))}
    </svg>
  );
}
