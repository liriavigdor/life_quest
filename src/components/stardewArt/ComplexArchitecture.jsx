import React from 'react';

// =========================================================================
// PURE ARCHITECTURAL SHELL — COZY ASYMMETRIC COTTAGE (STARDEW MASTER CARPENTRY)
// Authentic Stardew Valley Pierre's Shop / Multi-Wing Manor Architecture
//
// 1. PALETTE WARMTH & COHESION:
//    - Deep Cedar Brown (#5c3a21) & Rich Rustic Oak (#8B5A2B) timber frames.
//    - Soft Muted Copper (#CD7F32) highlights instead of harsh yellow streaks.
//    - Aged Straw Cream (#EEDC82 / #ebd89f) cottage wallpaper.
//    - Single unified rustic oak hardwood flooring across the entire layout.
// 2. MASTER FRAMING CARPENTRY (SEAMLESS SOFT SEAMS):
//    - Zero robotic black grid lines dividing the wood.
//    - Continuous horizontal timber beams & wall caps with natural wood grain.
//    - Subtle 45° miter carpentry joints at corners.
//    - Pixel-level ambient occlusion & inner bevels for hand-carved depth.
// 3. FLUID CORNER JOINERY:
//    - Smooth 45° sloped perimeter walls that blend naturally into horizontal sills.
//    - Hand-carved curved wooden brackets (corbels) softening inside corners & doorways.
// 4. ARCHITECTURAL INDIVIDUALITY:
//    - Deep recessed bed nook in NW wing with raised cedar step nosing.
//    - Raised fireplace alcove in Central Hall with elevated wooden platform threshold.
//    - 100% empty canvas — no furniture, no props, pristine structural shell.
// =========================================================================

const OUT = '#241206';        // Deep dark outline against the black void
const VOID = '#070504';       // Deep RPG void background
const W = 1260;
const H = 660;

const F = 56;     // Wall face height (wallpaper + wainscot)
const CAP = 14;   // Wall-top timber cap thickness
const SW = 14;    // Side-wall timber cap thickness
const SLOPE = 0.6; // Uniform diagonal sunbeam slope

// -------------------------------------------------------------------------
// 1. FLOOR GEOMETRY (Unified Oak Hardwood)
// -------------------------------------------------------------------------
const FLOORS = [
  [60, 118, 150, 170],    // Deep bed nook (raised)
  [60, 170, 280, 290],    // NW wing (A1)
  [60, 290, 180, 370],    // NW front-jutting nook (A2)
  [280, 242, 430, 278],   // Cozy W-E corridor (C1, tight 36px)
  [430, 140, 690, 340],   // Central Grand Hall (B)
  [520, 112, 600, 140],   // Hearth alcove (raised)
  [690, 292, 780, 328],   // East connector corridor (C2, tight 36px)
  [542, 340, 578, 480],   // N-S corridor (C3, tight 36px)
  [430, 480, 690, 590],   // Entrance Foyer (F)
  [780, 250, 1180, 400],  // East wing north room
  [1030, 400, 1100, 468], // East partition doorway corridor
  [900, 468, 1180, 580],  // East wing south room
  [505, 590, 635, 612],   // Village entrance stoop
];

// 45° Corner Floor Cuts (Removing triangular corners to void)
const FLOOR_CUTS = [
  [[60, 334], [60, 370], [96, 370]],
  [[430, 554], [430, 590], [466, 590]],
  [[690, 554], [690, 590], [654, 590]],
  [[1180, 540], [1180, 580], [1140, 580]],
];

// -------------------------------------------------------------------------
// 2. WALL FACES (Wallpaper + Cedar Wainscot)
// -------------------------------------------------------------------------
const FACES = [
  { id: 'nk', x1: 60, x2: 150, base: 118, skipL: true, skipR: true },
  { id: 'a1', x1: 164, x2: 280, base: 170 },
  { id: 'alc', x1: 520, x2: 600, base: 112, skipL: true, skipR: true },
  { id: 'bl', x1: 430, x2: 520, base: 140, skipR: true },
  { id: 'br', x1: 600, x2: 690, base: 140, skipL: true },
  { id: 'dn', x1: 780, x2: 1180, base: 250 },
  { id: 'c1', x1: 294, x2: 416, base: 242 },
  { id: 'c2', x1: 704, x2: 766, base: 292 },
  { id: 'fl', x1: 430, x2: 542, base: 480, skipR: true },
  { id: 'fr', x1: 578, x2: 690, base: 480, skipL: true },
  { id: 'pl', x1: 900, x2: 1030, base: 468, skipR: true },
  { id: 'pr', x1: 1100, x2: 1180, base: 468, skipL: true },
];

// Wall Tops: Continuous Horizontal Rafter Caps
const CAPS = [
  { x1: 46, x2: 164, y: 50 },    // Bed nook back
  { x1: 164, x2: 294, y: 102 },  // NW wing back
  { x1: 506, x2: 614, y: 44 },   // Alcove back
  { x1: 416, x2: 704, y: 72 },   // Central Hall back (unbroken header over alcove)
  { x1: 766, x2: 1194, y: 182 }, // East wing back
  { x1: 294, x2: 416, y: 174 },  // C1 corridor north header
  { x1: 704, x2: 766, y: 224 },  // C2 corridor north header
  { x1: 416, x2: 704, y: 412 },  // Foyer north header (unbroken over C3)
  { x1: 886, x2: 1194, y: 400 }, // East wing partition header
];

// Wall Tops: Continuous Vertical Side Strips
const STRIPS = [
  { x: 46, y1: 50, y2: 334, w: SW },     // NW west exterior
  { x: 150, y1: 50, y2: 236, w: SW },    // Bed nook east partition
  { x: 280, y1: 102, y2: 242, w: SW },   // NW east upper
  { x: 280, y1: 278, y2: 302, w: SW },   // NW east lower
  { x: 180, y1: 290, y2: 382, w: SW },   // NW front-jut east
  { x: 416, y1: 72, y2: 242, w: SW },    // Central Hall west upper
  { x: 416, y1: 278, y2: 352, w: SW },   // Central Hall west lower
  { x: 690, y1: 72, y2: 292, w: SW },    // Central Hall east upper
  { x: 690, y1: 328, y2: 352, w: SW },   // Central Hall east lower
  { x: 506, y1: 44, y2: 140, w: SW },    // Alcove west
  { x: 600, y1: 44, y2: 140, w: SW },    // Alcove east
  { x: 528, y1: 352, y2: 424, w: SW },   // C3 west
  { x: 578, y1: 352, y2: 424, w: SW },   // C3 east
  { x: 416, y1: 412, y2: 554, w: SW },   // Foyer west
  { x: 690, y1: 412, y2: 554, w: SW },   // Foyer east
  { x: 766, y1: 182, y2: 292, w: SW },   // East wing west upper
  { x: 766, y1: 328, y2: 412, w: SW },   // East wing west lower
  { x: 1180, y1: 182, y2: 540, w: SW },  // East wing east
  { x: 886, y1: 400, y2: 592, w: SW },   // East south room west
  { x: 1040, y1: 250, y2: 320, w: 12 },  // East reading nook stub
];

// Front-Facing Low-Profile Wall Sills (Baseboards with wainscot facet)
const LOW_WALLS = [
  { x1: 180, x2: 280, y: 290 },
  { x1: 280, x2: 430, y: 278 },
  { x1: 96, x2: 194, y: 370 },
  { x1: 416, x2: 542, y: 340 },
  { x1: 578, x2: 704, y: 340 },
  { x1: 690, x2: 780, y: 328 },
  { x1: 766, x2: 886, y: 400 },
  { x1: 886, x2: 1140, y: 580 },
  { x1: 466, x2: 505, y: 590 },
  { x1: 635, x2: 654, y: 590 },
];

// 45° Sloped Exterior Corner Timber Polygons (Seamless miters into horizontal/vertical runs)
const SLOPED_CORNERS = [
  // 1. NW Front-Jut SW Chamfer
  {
    outerPts: [[46, 320], [46, 334], [86, 374], [96, 382], [106, 382]],
    innerPts: [[60, 320], [60, 334], [96, 370], [106, 370]],
    poly: "46,324 46,334 86,374 96,384 106,384 106,370 96,370 60,334 60,324"
  },
  // 2. Foyer SW Chamfer
  {
    outerPts: [[416, 540], [416, 554], [456, 594], [466, 602], [476, 602]],
    innerPts: [[430, 540], [430, 554], [466, 590], [476, 590]],
    poly: "416,544 416,554 456,594 466,604 476,604 476,590 466,590 430,554 430,544"
  },
  // 3. Foyer SE Chamfer
  {
    outerPts: [[644, 602], [654, 602], [694, 562], [704, 554], [704, 540]],
    innerPts: [[644, 590], [654, 590], [690, 554], [690, 540]],
    poly: "644,604 654,604 694,564 704,554 704,544 690,544 690,554 654,590 644,590"
  },
  // 4. East South Room SE Chamfer
  {
    outerPts: [[1130, 592], [1140, 592], [1184, 548], [1194, 540], [1194, 526]],
    innerPts: [[1130, 580], [1140, 580], [1180, 540], [1180, 526]],
    poly: "1130,594 1140,594 1184,550 1194,540 1194,530 1180,530 1180,540 1140,580 1130,580"
  }
];

// Soft 45° Miter Carpentry Seams between intersecting timber frames
const MITER_JOINTS = [
  // Bed Nook top corners
  { x1: 46, y1: 50, x2: 60, y2: 64 },
  { x1: 164, y1: 50, x2: 150, y2: 64 },
  // NW Wing top corners
  { x1: 280, y1: 116, x2: 294, y2: 102 },
  // Central Hall top corners
  { x1: 416, y1: 72, x2: 430, y2: 86 },
  { x1: 704, y1: 72, x2: 690, y2: 86 },
  // Alcove corners
  { x1: 506, y1: 44, x2: 520, y2: 58 },
  { x1: 614, y1: 44, x2: 600, y2: 58 },
  // East Wing top corners
  { x1: 766, y1: 182, x2: 780, y2: 196 },
  { x1: 1194, y1: 182, x2: 1180, y2: 196 },
  // Foyer North corners
  { x1: 416, y1: 412, x2: 430, y2: 426 },
  { x1: 704, y1: 412, x2: 690, y2: 426 },
  // East partition corners
  { x1: 886, y1: 400, x2: 900, y2: 414 },
  { x1: 1194, y1: 400, x2: 1180, y2: 414 },
];

// Structural Support Pillars (Carved Cedar Timber)
const PILLARS = [
  { cx: 513, base: 140 }, { cx: 607, base: 140 },   // Alcove mouth
  { cx: 535, base: 480 }, { cx: 585, base: 480 },   // C3 / Foyer mouth
  { cx: 1037, base: 468 }, { cx: 1093, base: 468 }, // East partition doorway
  { cx: 157, base: 240, w: 16 },                    // Bed nook divider post
  { cx: 1046, base: 324, w: 16 },                   // East reading nook post
];

// Split-Level Raised Wooden Steps with Cedar Nosing
const STEPS = [
  { x1: 520, x2: 600, y: 140, label: 'hearth' },  // Central Hall hearth alcove step
  { x1: 60, x2: 150, y: 170, label: 'bed_nook' }, // NW wing deep bed nook step
];

// Cottage Windows on Back-Most Walls
const WINDOWS = [
  [87, 118],   // Bed nook window
  [212, 170],  // NW wing window
  [448, 140], [624, 140], // Central Hall twin windows
  [820, 250], [944, 250], [1100, 250], // East wing triple windows
];

// Continuous Horizontal Ceiling Timbers (Crown Rafters)
const CROWNS = [
  { x1: 60, x2: 150, y: 62 }, { x1: 164, x2: 280, y: 114 },
  { x1: 520, x2: 600, y: 56 },
  { x1: 430, x2: 690, y: 84 }, { x1: 780, x2: 1180, y: 194 },
  { x1: 294, x2: 416, y: 186 }, { x1: 704, x2: 766, y: 236 },
  { x1: 430, x2: 690, y: 424 }, { x1: 900, x2: 1180, y: 412 },
];

// =========================================================================
// 3. SVG DEFINITIONS & PALETTE SYSTEM
// =========================================================================
const OAK_ROWS = [[52, 118], [22, 92], [70, 134]];
// Stardew Muted Cozy Earth Tones for Floor Planks
const OAK_PALETTE = ['#8B5A2B', '#7d4c20', '#945e2e', '#724119'];
const OAK_W = 160;
const OAK_RH = 18;

const OakFloorPattern = () => (
  <pattern id="cxs-floor-oak" width={OAK_W} height={OAK_RH * OAK_ROWS.length} patternUnits="userSpaceOnUse" patternTransform="skewX(-6)">
    {OAK_ROWS.map((joints, r) => {
      const xs = [0, ...joints, OAK_W];
      const y = r * OAK_RH;
      return (
        <React.Fragment key={r}>
          {xs.slice(0, -1).map((x0, b) => {
            const x1 = xs[b + 1];
            const bw = x1 - x0;
            return (
              <React.Fragment key={b}>
                <rect x={x0} y={y} width={bw} height={OAK_RH} fill={OAK_PALETTE[(r * 2 + b) % OAK_PALETTE.length]} />
                {/* Subtle Hand-Carved Wood Grain Waves */}
                <path d={`M ${x0 + 5} ${y + OAK_RH * 0.4} Q ${x0 + bw * 0.5} ${y + OAK_RH * 0.28} ${x1 - 6} ${y + OAK_RH * 0.5}`} stroke="rgba(50,22,5,0.28)" strokeWidth="0.7" fill="none" />
                <path d={`M ${x0 + 9} ${y + OAK_RH * 0.74} Q ${x0 + bw * 0.55} ${y + OAK_RH * 0.66} ${x1 - 10} ${y + OAK_RH * 0.78}`} stroke="rgba(50,22,5,0.2)" strokeWidth="0.6" fill="none" />
                {/* Warm Muted Copper (#CD7F32) Plank Highlight */}
                <line x1={x0} y1={y + 0.8} x2={x1} y2={y + 0.8} stroke="rgba(205,127,50,0.28)" strokeWidth="0.9" />
                {/* Organic Plank Joints & Nails */}
                {x0 !== 0 && (
                  <>
                    <line x1={x0} y1={y} x2={x0} y2={y + OAK_RH} stroke="rgba(40,16,4,0.65)" strokeWidth="1.1" />
                    <circle cx={x0 + 3} cy={y + OAK_RH * 0.5} r="0.9" fill="rgba(30,12,3,0.6)" />
                  </>
                )}
              </React.Fragment>
            );
          })}
          <line x1="0" y1={y + OAK_RH} x2={OAK_W} y2={y + OAK_RH} stroke="rgba(40,16,4,0.7)" strokeWidth="1.2" />
        </React.Fragment>
      );
    })}
  </pattern>
);

const Defs = () => (
  <defs>
    <OakFloorPattern />

    {/* Continuous Wood Grain Texture for Rafters & Frames */}
    <pattern id="cxs-grain" width="96" height="8" patternUnits="userSpaceOnUse">
      <path d="M 0 2 Q 24 0.8 48 2.4 T 96 2" stroke="rgba(50,22,5,0.32)" strokeWidth="0.8" fill="none" />
      <path d="M 0 5.6 Q 32 4.2 64 6 T 96 5.4" stroke="rgba(205,127,50,0.2)" strokeWidth="0.7" fill="none" />
    </pattern>

    {/* Soft Straw Cream (#EEDC82) Vintage Cottage Wallpaper */}
    <pattern id="cxs-wallpaper" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#ebd89f" />
      <path d="M 0 10 Q 5 5 10 10 T 20 10" stroke="rgba(165,125,65,0.22)" strokeWidth="0.8" fill="none" />
      <path d="M 10 0 Q 15 5 10 10 T 10 20" stroke="rgba(165,125,65,0.22)" strokeWidth="0.8" fill="none" />
      <polygon points="10,4 16,10 10,16 4,10" fill="rgba(195,155,90,0.18)" />
      <circle cx="10" cy="10" r="1.3" fill="#c4aa68" />
      <circle cx="0" cy="0" r="1" fill="#cbb375" opacity="0.8" />
      <circle cx="20" cy="0" r="1" fill="#cbb375" opacity="0.8" />
      <circle cx="0" cy="20" r="1" fill="#cbb375" opacity="0.8" />
      <circle cx="20" cy="20" r="1" fill="#cbb375" opacity="0.8" />
    </pattern>

    {/* Wall Face Ambient Occlusion Shading Under Rafters */}
    <linearGradient id="cxs-wall-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(45,20,6,0.38)" />
      <stop offset="30%" stopColor="rgba(45,20,6,0.08)" />
      <stop offset="100%" stopColor="rgba(45,20,6,0.18)" />
    </linearGradient>

    {/* Rich Cedar & Rustic Oak Wainscot Gradient */}
    <linearGradient id="cxs-wainscot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7a461e" />
      <stop offset="35%" stopColor="#633615" />
      <stop offset="75%" stopColor="#4a250e" />
      <stop offset="100%" stopColor="#321606" />
    </linearGradient>

    {/* Master Ceiling Timber Cap Gradient (Cedar #5c3a21 to Rustic Oak #8B5A2B) */}
    <linearGradient id="cxs-timber-cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#9c6430" />
      <stop offset="25%" stopColor="#8B5A2B" />
      <stop offset="65%" stopColor="#5c3a21" />
      <stop offset="100%" stopColor="#3a1e0d" />
    </linearGradient>

    {/* Continuous Horizontal Crown Rafter Molding */}
    <linearGradient id="cxs-crown" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#CD7F32" />
      <stop offset="35%" stopColor="#8B5A2B" />
      <stop offset="85%" stopColor="#5c3a21" />
      <stop offset="100%" stopColor="#361a09" />
    </linearGradient>

    {/* Low-Profile Front Wall Sill Gradient */}
    <linearGradient id="cxs-low-wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#a46c36" />
      <stop offset="30%" stopColor="#8B5A2B" />
      <stop offset="70%" stopColor="#5c3a21" />
      <stop offset="100%" stopColor="#2c1406" />
    </linearGradient>

    {/* Hand-Carved Timber Pillar Gradient */}
    <linearGradient id="cxs-pillar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#a06633" />
      <stop offset="25%" stopColor="#8B5A2B" />
      <stop offset="70%" stopColor="#5c3a21" />
      <stop offset="100%" stopColor="#3a1e0b" />
    </linearGradient>

    {/* Curved Wooden Bracket (Corbel) Gradient */}
    <linearGradient id="cxs-bracket" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#945d2b" />
      <stop offset="100%" stopColor="#5c3a21" />
    </linearGradient>

    {/* Warm Glowing Cottage Glass Gradient */}
    <linearGradient id="cxs-glass" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stopColor="#fff8db" />
      <stop offset="55%" stopColor="#fde08a" />
      <stop offset="100%" stopColor="#d99b38" />
    </linearGradient>

    {/* Floor Grounding Ambient Occlusion Shadows */}
    <linearGradient id="cxs-ao-down" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(24,10,2,0.62)" />
      <stop offset="45%" stopColor="rgba(24,10,2,0.26)" />
      <stop offset="100%" stopColor="rgba(24,10,2,0)" />
    </linearGradient>
    <linearGradient id="cxs-ao-up" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stopColor="rgba(24,10,2,0.52)" />
      <stop offset="45%" stopColor="rgba(24,10,2,0.22)" />
      <stop offset="100%" stopColor="rgba(24,10,2,0)" />
    </linearGradient>
    <linearGradient id="cxs-ao-right" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="rgba(24,10,2,0.52)" />
      <stop offset="45%" stopColor="rgba(24,10,2,0.22)" />
      <stop offset="100%" stopColor="rgba(24,10,2,0)" />
    </linearGradient>
    <linearGradient id="cxs-ao-left" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0%" stopColor="rgba(24,10,2,0.52)" />
      <stop offset="45%" stopColor="rgba(24,10,2,0.22)" />
      <stop offset="100%" stopColor="rgba(24,10,2,0)" />
    </linearGradient>
    <linearGradient id="cxs-cast" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(20,8,1,0.45)" />
      <stop offset="100%" stopColor="rgba(20,8,1,0)" />
    </linearGradient>

    {/* Floor Union Clip for Directional Sunbeams */}
    <clipPath id="cxs-clip-floor">
      {FLOORS.map(([x1, y1, x2, y2], i) => (
        <rect key={i} x={x1} y={y1} width={x2 - x1} height={y2 - y1} />
      ))}
    </clipPath>
  </defs>
);

// =========================================================================
// 4. ARCHITECTURAL ELEMENTS & WOOD CARPENTRY
// =========================================================================

// Hand-Carved Wooden Corner Bracket (Corbel)
const Corbel = ({ x, y, dir = 1, s = 18 }) => (
  <g>
    <path
      d={`M ${x},${y} L ${x + dir * s},${y} Q ${x + dir * s * 0.25},${y + s * 0.25} ${x},${y + s} Z`}
      fill="url(#cxs-bracket)"
      stroke={OUT}
      strokeWidth="1.1"
      strokeLinejoin="round"
    />
    <path
      d={`M ${x + dir * 2},${y + 1.8} L ${x + dir * (s - 4)},${y + 1.8} Q ${x + dir * s * 0.28},${y + s * 0.28 - 1} ${x + dir * 1.8},${y + s - 4}`}
      fill="none"
      stroke="#CD7F32"
      strokeWidth="0.9"
      opacity="0.7"
    />
    <circle cx={x + dir * 4.2} cy={y + 4.4} r="1.4" fill="#321606" />
  </g>
);

// Hand-Carved Cedar Support Column with Plinth & Capital
const Pillar = ({ cx, base, h = F, w = 14 }) => {
  const x = cx - w / 2;
  const top = base - h;
  return (
    <g>
      <ellipse cx={cx} cy={base + 1} rx={w * 0.95} ry="3.5" fill="rgba(0,0,0,0.48)" />
      {/* Plinth Base */}
      <rect x={x - 3} y={base - 7} width={w + 6} height="7" rx="1" fill="#3e210d" stroke={OUT} strokeWidth="1.2" />
      {/* Pillar Shaft */}
      <rect x={x} y={top + 9} width={w} height={h - 16} fill="url(#cxs-pillar)" stroke={OUT} strokeWidth="1.2" />
      <line x1={x + 2} y1={top + 10} x2={x + 2} y2={base - 8} stroke="#CD7F32" strokeWidth="1.1" opacity="0.85" />
      {/* Capital Crown */}
      <rect x={x - 4} y={top} width={w + 8} height="9" rx="1.5" fill="url(#cxs-pillar)" stroke={OUT} strokeWidth="1.2" />
      <line x1={x - 2} y1={top + 1.6} x2={x + w + 2} y2={top + 1.6} stroke="#CD7F32" strokeWidth="1" opacity="0.85" />
    </g>
  );
};

// Seamless Archway Header with Twin Corbels
const Archway = ({ x1, x2, y, ix1, ix2, s = 16 }) => (
  <g>
    <rect x={x1} y={y} width={x2 - x1} height="8" rx="1.5" fill="url(#cxs-crown)" stroke={OUT} strokeWidth="1.2" />
    <line x1={x1 + 2} y1={y + 1.5} x2={x2 - 2} y2={y + 1.5} stroke="#CD7F32" strokeWidth="1" opacity="0.85" />
    <Corbel x={ix1} y={y + 8} dir={1} s={s} />
    <Corbel x={ix2} y={y + 8} dir={-1} s={s} />
  </g>
);

// Rustic Cottage Window with Warm Cedar Frame & Glowing Glass
const CottageWindow = ({ x, y, w = 36, h = 38 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d={`M -3,${h + 2} L -3,12 Q ${w / 2},-5 ${w + 3},12 L ${w + 3},${h + 2} Z`} fill="rgba(0,0,0,0.58)" />
    <path d={`M -2,${h} L -2,13 Q ${w / 2},-3 ${w + 2},13 L ${w + 2},${h} Z`} fill="url(#cxs-wainscot)" stroke={OUT} strokeWidth="1.6" />
    <path d={`M 3,${h - 3} L 3,13 Q ${w / 2},1 ${w - 3},13 L ${w - 3},${h - 3} Z`} fill="url(#cxs-glass)" stroke={OUT} strokeWidth="1" />
    {/* Brass Muntins */}
    <line x1={w / 2} y1="3" x2={w / 2} y2={h - 3} stroke="#fffae0" strokeWidth="1.8" />
    <line x1="3" y1={h / 2 + 2} x2={w - 3} y2={h / 2 + 2} stroke="#fffae0" strokeWidth="1.8" />
    <polygon points="6,16 12,9 15,9 8,20" fill="rgba(255,255,255,0.65)" />
    {/* Cedar Window Sill with Muted Copper Trim */}
    <rect x="-5" y={h - 2} width={w + 10} height="6" rx="1.5" fill="#5c3a21" stroke={OUT} strokeWidth="1.3" />
    <line x1="-4" y1={h} x2={w + 4} y2={h} stroke="#CD7F32" strokeWidth="1.1" opacity="0.9" />
  </g>
);

// Wall Face: Soft Straw Cream Wallpaper + Rich Cedar Wainscoting + Skirting
const Face = ({ x1, x2, base, skipL, skipR }) => {
  const top = base - F;
  const w = x2 - x1;
  return (
    <g>
      {/* 1. Upper Half: Vintage Straw Cream Cottage Wallpaper */}
      <rect x={x1} y={top} width={w} height={F} fill="url(#cxs-wallpaper)" />
      <rect x={x1} y={top} width={w} height={F} fill="url(#cxs-wall-shade)" />

      {/* 2. Chair Rail (Muted Copper Highlight + Cedar Base) */}
      <rect x={x1} y={base - 29} width={w} height="4" fill="#7a461e" />
      <line x1={x1} y1={base - 28.2} x2={x2} y2={base - 28.2} stroke="#CD7F32" strokeWidth="0.9" opacity="0.85" />

      {/* 3. Lower Half: Rich Cedar Tongue-and-Groove Wainscoting */}
      <rect x={x1} y={base - 25} width={w} height="19" fill="url(#cxs-wainscot)" />
      <line x1={x1} y1={base - 20} x2={x2} y2={base - 20} stroke="rgba(20,8,1,0.5)" strokeWidth="1" />
      <line x1={x1} y1={base - 12} x2={x2} y2={base - 12} stroke="rgba(20,8,1,0.42)" strokeWidth="1" />
      <line x1={x1} y1={base - 19.2} x2={x2} y2={base - 19.2} stroke="rgba(205,127,50,0.2)" strokeWidth="0.8" />

      {/* 4. Skirting Baseboard */}
      <rect x={x1} y={base - 6} width={w} height="6" fill="#2c1406" />
      <line x1={x1} y1={base - 5.2} x2={x2} y2={base - 5.2} stroke="#CD7F32" strokeWidth="0.9" opacity="0.8" />

      {/* 5. Corner Softening Corbels */}
      {!skipL && w >= 60 && <Corbel x={x1} y={top + 7} dir={1} />}
      {!skipR && w >= 60 && <Corbel x={x2} y={top + 7} dir={-1} />}
    </g>
  );
};

// Soft Volumetric Sunbeam Streaming at 45° Uniform Diagonal
const Sunbeam = ({ wx, ys, w = 36, L = 200 }) => {
  const sx = SLOPE * L;
  const half = w / 2 - 1.5;
  return (
    <g>
      <polygon
        points={`${wx},${ys} ${wx + half},${ys} ${wx + half + sx},${ys + L} ${wx + sx},${ys + L}`}
        fill="rgba(255, 240, 200, 0.11)"
      />
      <polygon
        points={`${wx + half + 3},${ys} ${wx + w},${ys} ${wx + w + sx},${ys + L} ${wx + half + 3 + sx},${ys + L}`}
        fill="rgba(255, 240, 200, 0.11)"
      />
    </g>
  );
};

// =========================================================================
// 5. MAIN ARCHITECTURAL COMPONENT
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
          LAYER 1: DEEP RPG VOID BACKGROUND (Bites aggressively into the structure)
          ========================================================================= */}
      <rect x="0" y="0" width={W} height={H} fill={VOID} />

      {/* =========================================================================
          LAYER 2: SINGLE CONTINUOUS OAK HARDWOOD FLOOR (Absolute Material Unification)
          ========================================================================= */}
      <g id="cx-floor-unified">
        {FLOORS.map(([x1, y1, x2, y2], i) => (
          <rect
            key={`fl-${i}`}
            x={x1 - 0.5}
            y={y1 - 0.5}
            width={x2 - x1 + 1}
            height={y2 - y1 + 1}
            fill="url(#cxs-floor-oak)"
          />
        ))}

        {/* 45° Corner Floor Void Cuts */}
        {FLOOR_CUTS.map((pts, i) => (
          <polygon
            key={`cut-${i}`}
            points={pts.map(p => p.join(',')).join(' ')}
            fill={VOID}
            stroke={VOID}
            strokeWidth="1.2"
          />
        ))}

        {/* Village Doorway Step Riser */}
        <line x1="506" y1="592" x2="634" y2="592" stroke="#CD7F32" strokeWidth="1" opacity="0.65" />
        <rect x="505" y="604" width="130" height="8" fill="#3e210d" stroke={OUT} strokeWidth="1.2" />
      </g>

      {/* =========================================================================
          LAYER 3: GROUNDING AMBIENT OCCLUSION SHADOWS (Wall Bases & Raised Steps)
          ========================================================================= */}
      <g id="cx-ambient-occlusion">
        {/* Wall Face Drop Shadows */}
        {FACES.map(f => (
          <rect key={`aof-${f.id}`} x={f.x1} y={f.base} width={f.x2 - f.x1} height="28" fill="url(#cxs-ao-down)" />
        ))}

        {/* Side Wall Strip Shadows */}
        {STRIPS.map((s, i) => (
          <React.Fragment key={`aos-${i}`}>
            <rect x={s.x + s.w} y={s.y1} width="16" height={s.y2 - s.y1} fill="url(#cxs-ao-right)" />
            <rect x={s.x - 16} y={s.y1} width="16" height={s.y2 - s.y1} fill="url(#cxs-ao-left)" />
          </React.Fragment>
        ))}

        {/* Low-Profile Front Sill Drop Shadows */}
        {LOW_WALLS.map((l, i) => (
          <rect key={`aol-${i}`} x={l.x1} y={l.y - 16} width={l.x2 - l.x1} height="16" fill="url(#cxs-ao-up)" />
        ))}

        {/* East Partition Shadow */}
        <rect x="900" y="384" width="130" height="16" fill="url(#cxs-ao-up)" />
        <rect x="1100" y="384" width="80" height="16" fill="url(#cxs-ao-up)" />

        {/* Raised Step Grounding Drop Shadows */}
        {STEPS.map((s, i) => (
          <rect key={`aost-${i}`} x={s.x1} y={s.y + 6} width={s.x2 - s.x1} height="12" fill="url(#cxs-ao-down)" />
        ))}
      </g>

      {/* =========================================================================
          LAYER 4: VOLUMETRIC SUNBEAMS & PILLAR CAST SHADOWS (Clipped to Floor)
          ========================================================================= */}
      <g id="cx-sunbeams-and-shadows" clipPath="url(#cxs-clip-floor)" style={{ pointerEvents: 'none' }}>
        {/* Volumetric Morning Light Beams */}
        {WINDOWS.map(([wx, base], i) => (
          <Sunbeam key={`beam-${i}`} wx={wx} ys={base - 8} />
        ))}

        {/* Pillars Blocking Light: Realistic Diagonal Cast Shadows */}
        {PILLARS.map((p, i) => {
          const hw = (p.w || 14) / 2 + 1;
          const len = 50;
          const sx = SLOPE * len;
          return (
            <polygon
              key={`cast-${i}`}
              points={`${p.cx - hw},${p.base} ${p.cx + hw},${p.base} ${p.cx + hw + sx},${p.base + len} ${p.cx - hw + sx},${p.base + len}`}
              fill="url(#cxs-cast)"
            />
          );
        })}
      </g>

      {/* =========================================================================
          LAYER 5: WALL FACES, WINDOWS & CONTINUOUS CEILING CROWN TIMBERS
          ========================================================================= */}
      <g id="cx-wall-faces">
        {FACES.map(f => <Face key={`face-${f.id}`} {...f} />)}

        {/* Back-Wall Cottage Windows */}
        {WINDOWS.map(([wx, base], i) => (
          <CottageWindow key={`win-${i}`} x={wx} y={base - F + 10} />
        ))}

        {/* Continuous Horizontal Ceiling Timbers (Crown Rafters) */}
        {CROWNS.map((c, i) => (
          <g key={`crown-${i}`}>
            <rect x={c.x1} y={c.y} width={c.x2 - c.x1} height="7" fill="url(#cxs-crown)" />
            <line x1={c.x1} y1={c.y + 1.2} x2={c.x2} y2={c.y + 1.2} stroke="#CD7F32" strokeWidth="1" opacity="0.85" />
            <line x1={c.x1} y1={c.y + 7.6} x2={c.x2} y2={c.y + 7.6} stroke="rgba(24,10,2,0.5)" strokeWidth="1.2" />
          </g>
        ))}
      </g>

      {/* =========================================================================
          LAYER 6: MASTER CARPENTRY FRAMES — ZERO MODULAR SEAMS & COHESIVE TIMBER
          (Single Unified Outer Silhouette, Continuous Grain, Soft Miter Joints)
          ========================================================================= */}
      <g id="cx-master-framing">
        {/* 6.1 Outer Silhouette Pass: Dark Outline against the Void (#241206) */}
        <g id="framing-outer-silhouette">
          {CAPS.map((c, i) => (
            <rect key={`co-${i}`} x={c.x1} y={c.y} width={c.x2 - c.x1} height={CAP} fill={OUT} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
          {STRIPS.map((s, i) => (
            <rect key={`so-${i}`} x={s.x} y={s.y1} width={s.w} height={s.y2 - s.y1} fill={OUT} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
          {LOW_WALLS.map((l, i) => (
            <rect key={`lo-${i}`} x={l.x1} y={l.y} width={l.x2 - l.x1} height="12" fill={OUT} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
          {SLOPED_CORNERS.map((sc, i) => (
            <polygon key={`sco-${i}`} points={sc.poly} fill={OUT} stroke={OUT} strokeWidth="2.5" strokeLinejoin="round" />
          ))}
        </g>

        {/* 6.2 Continuous Wood Fill: Cedar (#5c3a21) & Rustic Oak (#8B5A2B) */}
        <g id="framing-wood-fill">
          {/* Horizontal Rafter Caps */}
          {CAPS.map((c, i) => (
            <g key={`cf-${i}`}>
              <rect x={c.x1} y={c.y} width={c.x2 - c.x1} height={CAP} fill="url(#cxs-timber-cap)" />
              <rect x={c.x1} y={c.y} width={c.x2 - c.x1} height={CAP} fill="url(#cxs-grain)" />
              {/* Soft Muted Copper Top Highlight */}
              <line x1={c.x1} y1={c.y + 1} x2={c.x2} y2={c.y + 1} stroke="#CD7F32" strokeWidth="1.1" opacity="0.85" />
              {/* Pixel-Level Inner Shading for Hand-Carved Volumetric Depth */}
              <line x1={c.x1} y1={c.y + CAP - 1} x2={c.x2} y2={c.y + CAP - 1} stroke="rgba(35,14,3,0.6)" strokeWidth="1.2" />
            </g>
          ))}

          {/* Vertical Side Wall Strips */}
          {STRIPS.map((s, i) => (
            <g key={`sf-${i}`}>
              <rect x={s.x} y={s.y1} width={s.w} height={s.y2 - s.y1} fill="url(#cxs-timber-cap)" />
              <rect x={s.x} y={s.y1} width={s.w} height={s.y2 - s.y1} fill="url(#cxs-grain)" />
              {/* Soft Muted Copper Left Highlight */}
              <line x1={s.x + 1.2} y1={s.y1 + 1} x2={s.x + 1.2} y2={s.y2 - 1} stroke="#CD7F32" strokeWidth="1.1" opacity="0.85" />
              {/* Inner Edge Hand-Carved Shading */}
              <line x1={s.x + s.w - 1.2} y1={s.y1 + 1} x2={s.x + s.w - 1.2} y2={s.y2 - 1} stroke="rgba(35,14,3,0.6)" strokeWidth="1.2" />
            </g>
          ))}

          {/* Low-Profile Front Sills */}
          {LOW_WALLS.map((l, i) => (
            <g key={`lf-${i}`}>
              <rect x={l.x1} y={l.y} width={l.x2 - l.x1} height="12" fill="url(#cxs-low-wall)" />
              <line x1={l.x1} y1={l.y + 1} x2={l.x2} y2={l.y + 1} stroke="#CD7F32" strokeWidth="1" opacity="0.85" />
              <line x1={l.x1} y1={l.y + 6.5} x2={l.x2} y2={l.y + 6.5} stroke="rgba(24,10,2,0.4)" strokeWidth="0.8" />
            </g>
          ))}

          {/* 45° Sloped Corner Timber Polygons (Smoothly Blended) */}
          {SLOPED_CORNERS.map((sc, i) => (
            <g key={`scf-${i}`}>
              <polygon points={sc.poly} fill="url(#cxs-low-wall)" />
              <polygon points={sc.poly} fill="url(#cxs-grain)" opacity="0.85" />
            </g>
          ))}
        </g>

        {/* 6.3 Soft Carpentry Seams: 45° Miter Joints at Timber Intersections */}
        <g id="framing-soft-miter-joints">
          {MITER_JOINTS.map((m, i) => (
            <line
              key={`mj-${i}`}
              x1={m.x1}
              y1={m.y1}
              x2={m.x2}
              y2={m.y2}
              stroke="rgba(45,20,5,0.45)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
          ))}
        </g>
      </g>

      {/* =========================================================================
          LAYER 7: SPLIT-LEVEL STEPS, ARCHWAYS & STRUCTURAL TIMBER COLUMNS
          ========================================================================= */}
      <g id="cx-steps-and-archways">
        {/* Split-Level Raised Steps with Cedar Nosing */}
        {STEPS.map((s, i) => (
          <g key={`step-${i}`}>
            <rect x={s.x1} y={s.y} width={s.x2 - s.x1} height="6" fill="#4a250e" stroke={OUT} strokeWidth="1.2" />
            <line x1={s.x1 + 1} y1={s.y + 0.8} x2={s.x2 - 1} y2={s.y + 0.8} stroke="#CD7F32" strokeWidth="1.1" opacity="0.9" />
          </g>
        ))}

        {/* Seamless Wooden Archways */}
        <Archway x1={506} x2={614} y={84} ix1={520} ix2={600} s={16} />
        <Archway x1={528} x2={592} y={424} ix1={542} ix2={578} s={12} />
        <Archway x1={1030} x2={1100} y={412} ix1={1044} ix2={1086} s={14} />

        {/* Carved Cedar Support Pillars */}
        {PILLARS.map((p, i) => <Pillar key={`pil-${i}`} {...p} />)}

        {/* Village Exit Doorway Jambs */}
        <rect x="498" y="588" width="8" height="16" fill="url(#cxs-pillar)" stroke={OUT} strokeWidth="1.2" />
        <rect x="634" y="588" width="8" height="16" fill="url(#cxs-pillar)" stroke={OUT} strokeWidth="1.2" />
      </g>
    </svg>
  );
}

// =========================================================================
// 6. SOFT AMBIENT LAMPLIGHT POOLS (Cozy Warm Glow)
// =========================================================================
const POOLS = [
  { x: 105, y: 150, rx: 60, ry: 40, o: 0.55 },   // Bed nook
  { x: 225, y: 235, rx: 100, ry: 70, o: 0.6 },   // NW wing
  { x: 355, y: 260, rx: 80, ry: 24, o: 0.4 },    // W-E corridor
  { x: 560, y: 240, rx: 170, ry: 110, o: 0.85 }, // Central Hall
  { x: 560, y: 128, rx: 60, ry: 30, o: 0.55 },   // Hearth alcove
  { x: 735, y: 310, rx: 55, ry: 22, o: 0.4 },    // East connector
  { x: 560, y: 410, rx: 40, ry: 70, o: 0.4 },    // N-S corridor
  { x: 560, y: 535, rx: 130, ry: 60, o: 0.6 },   // Foyer
  { x: 980, y: 330, rx: 210, ry: 110, o: 0.75 }, // East wing
  { x: 1040, y: 525, rx: 120, ry: 50, o: 0.55 }, // East south room
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
        <g key={i} className="complex-light-pool" style={{ animationDelay: `${(i % 5) * 0.35}s` }}>
          <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="url(#cx-lamp-glow)" opacity={p.o} style={{ mixBlendMode: 'soft-light' }} />
          <ellipse cx={p.x} cy={p.y} rx={p.rx * 0.75} ry={p.ry * 0.75} fill="url(#cx-lamp-glow)" opacity={p.o * 0.35} style={{ mixBlendMode: 'screen' }} />
        </g>
      ))}
    </svg>
  );
}
