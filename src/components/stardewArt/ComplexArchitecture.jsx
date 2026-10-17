import React from 'react';

// =========================================================================
// PURE ARCHITECTURAL SHELL — INTERNAL ASYMMETRY & SEALED FRAMING ENGINE
// Executed under [MASTER INTERIOR DECORATOR] & [THE STRUCTURAL DIRECTOR] Skills
//
// 1. SEALED STRUCTURAL FRAMING (No Broken Trims / Zero Void Bleeding):
//    - Every high wall ceiling ribbon terminates securely into a solid dark oak
//      terminal jamb post (TerminalPost) that connects ceiling to floor.
//    - Front low-profile sills terminate flush into corner plinths.
//    - Every edge is capped, closed, and sealed against the black void.
// 2. BANISH ROOM-LEVEL SYMMETRY (Strict Anti-Internal Symmetry):
//    - Foyer: Left is 45° chamfered; right features an inset cloak alcove nook.
//    - Grand Hall: Hearth alcove shifted off-center to the right; left side
//      features a wide gallery wall with double windows; SW is chamfered, SE is straight.
//    - Left Wing: NW bed nook with cedar nosing step; front-jut A2 has SW chamfer and straight SE plinth.
//    - East Wing: North room has NW chamfer and straight NE corner with an east reading bay;
//      South room has straight SW and deep 45° chamfered SE.
// 3. PRISTINE SANDBOX ISOLATION:
//    - 100% empty canvas — zero furniture, zero props, zero UI alterations.
// =========================================================================

const OUT = '#140803';        // Deep dark outline against the black void
const VOID = '#070504';       // Deep RPG void background
const W = 1260;
const H = 660;

const F = 56;       // Wall face height (wallpaper + wainscot)
const BEAM_W = 12;  // Unified dark oak timber beam width
const SILL_W = 10;  // Unified front wall sill width
const SLOPE = 0.6;  // Uniform diagonal sunbeam slope

// -------------------------------------------------------------------------
// 1. FLOOR GEOMETRY (Asymmetric & Space-Optimized Blueprint)
// -------------------------------------------------------------------------
const FLOORS = [
  // Left Wing (Urgent Wing)
  [80, 90, 190, 150],     // Deep bed nook (raised bay)
  [80, 150, 380, 310],    // NW wing main room (A1)
  [80, 310, 220, 410],    // NW front-jutting nook (A2)
  // W-E Corridor C1 (Tightened to 50px)
  [380, 230, 430, 266],   // W-E timber corridor tunnel (36px wide)
  // Central Grand Hall (Hearth Wing - Asymmetric Layout)
  [430, 108, 760, 340],   // Central Grand Hall (B)
  [610, 76, 700, 108],    // Asymmetric Off-Center Hearth alcove
  // East Connector C2 (Tightened to 50px)
  [760, 230, 810, 266],   // East connector corridor tunnel (36px wide)
  // N-S Corridor C3 (80px long, 40px wide - Eliminates room collision!)
  [575, 340, 615, 420],   // N-S connector corridor tunnel
  // Entrance Foyer (Asymmetric Layout with Inset Cloak Alcove Nook)
  [440, 420, 750, 570],   // Main Foyer floor
  [750, 510, 776, 570],   // Inset cloak alcove nook floor
  [535, 570, 655, 594],   // Village entrance stoop
  // East Wing (Sanctuary Wing - Asymmetric Layout)
  [810, 170, 1180, 340],  // East wing north room
  [970, 340, 1026, 420],  // Asymmetric partition doorway tunnel (80px long, 56px wide)
  [880, 420, 1180, 570],  // East wing south room
];

// Asymmetric Corner Floor Cuts
const FLOOR_CUTS = [
  // Left Wing A2 front-jut: SW chamfer cut only (SE is straight plinth)
  [[80, 374], [80, 410], [116, 410]],

  // Foyer: SW chamfer cut only (SE has inset cloak nook!)
  [[440, 534], [440, 570], [476, 570]],

  // East South Room: SE chamfer cut only (SW is straight!)
  [[1144, 570], [1180, 570], [1180, 534]],

  // Inner chamfer cuts:
  // Bed Nook back corners:
  [[80, 90], [106, 90], [80, 116]],
  [[190, 90], [164, 90], [190, 116]],
  // Left Wing NE:
  [[354, 150], [380, 150], [380, 176]],
  // Hearth Alcove corners (Off-Center):
  [[610, 76], [626, 76], [610, 92]],
  [[700, 76], [684, 76], [700, 92]],
  // Grand Hall back corners:
  [[430, 108], [454, 108], [430, 132]],
  [[760, 108], [736, 108], [760, 132]],
  // Grand Hall SW front chamfer cut only (SE is straight):
  [[430, 316], [430, 340], [454, 340]],
  // Foyer back NW chamfer cut only (NE is straight):
  [[440, 420], [464, 420], [440, 444]],
  // East North Room back NW chamfer cut only (NE is straight):
  [[810, 170], [834, 170], [810, 194]],
];

// -------------------------------------------------------------------------
// 2. ASYMMETRIC UNIFIED POLY-WALL PATHS (Completely Sealed Boundaries)
// -------------------------------------------------------------------------

// Zone 1: Left Wing Asymmetric Paths (Exclusively South-Facing Back Walls & Front Sills)
const ZONE1_BACK_WALL = [
  [80, 116], [106, 90], [164, 90], [190, 116], [190, 150], [354, 150], [380, 176]
];
// Corridor C1 (Left Wing <-> Grand Hall, horizontal hallway)
const ZONE1_CORRIDOR_BACK = [
  [380, 230], [430, 230]
];

// Zone 2: Central Grand Hall Asymmetric Paths (Off-Center Hearth + Chamfered Corners)
const ZONE2_BACK_WALL = [
  [430, 132], [454, 108], [610, 108], [610, 92],
  [626, 76], [684, 76], [700, 92], [700, 108], [736, 108], [760, 132]
];
// Corridor C2 (Grand Hall <-> East Wing North, horizontal hallway)
const ZONE2_CORRIDOR_BACK = [
  [760, 230], [810, 230]
];

// Zone 3: Entrance Foyer Asymmetric Paths (NW Chamfer, Straight NE, SW Chamfer, SE Inset Nook)
const ZONE3_BACK_WALL_LEFT = [
  [440, 444], [464, 420], [575, 420]
];
const ZONE3_BACK_WALL_RIGHT = [
  [615, 420], [750, 420]
];

// Zone 4: East Wing Asymmetric Paths (North Room, Partition Doorway, South Room)
const ZONE4_NORTH_BACK_WALL = [
  [810, 194], [834, 170], [1180, 170]
];
const ZONE4_SOUTH_NORTH_WALL_LEFT = [
  [880, 420], [970, 420]
];
const ZONE4_SOUTH_NORTH_WALL_RIGHT = [
  [1026, 420], [1180, 420]
];

// =========================================================================
// =========================================================================
// =========================================================================
// GRAND UNIFIED ARCHITECTURAL TIMBER FRAME (Under [MASTER ROOM FRAMER] Skill)
// One continuous, monolithic, unbroken ribbon wrapping the entire cottage perimeter.
// Seamlessly merges room-to-room transitions with 100% open passages (ZERO overlapping beams).
// =========================================================================
const GRAND_UNIFIED_PERIMETER_FRAME = [
  // 1. Entrance Stoop West start (flat butt cut flush with doorway)
  [535, 570],
  // 2. Foyer South Sill & SW 45° Chamfer
  [476, 570], [440, 534],
  // 3. Foyer West Wall & NW 45° Chamfer (at ceiling height)
  [440, 388], [464, 364],
  // 4. Foyer North Wall to Corridor C3 West Jamb
  [575, 364],
  // 5. Corridor C3 West Jamb into Central Grand Hall (open passage - NO cross beam!)
  [575, 340],
  // 6. Grand Hall South Sill & SW 45° Chamfer
  [454, 340], [430, 316],
  // 7. Grand Hall West Sill & Corridor C1 South Sill into Left Wing
  [430, 266], [380, 266],
  // 8. Left Wing A1/A2 Transition & Front Nook
  [380, 310], [220, 310], [220, 410],
  // 9. Left Wing SW 45° Chamfer & West Wall up to Bed Nook Roof
  [116, 410], [80, 374], [80, 60],
  // 10. Bed Nook 45° Roof Chamfer & Horizontal Ridge
  [106, 34], [164, 34], [190, 60], [190, 94],
  // 11. Left Wing Gallery Ceiling Rafter & NE 45° Chamfer
  [354, 94], [380, 120],
  // 12. Left Wing East Upper Wall & Corridor C1 North Ceiling into Grand Hall
  [380, 230], [430, 230],
  // 13. Grand Hall West Upper Wall & NW 45° Chamfer
  [430, 76], [454, 52],
  // 14. Grand Hall Hearth Alcove (Asymmetric Multi-Facet Roof Peak)
  [610, 52], [610, 36], [626, 20], [684, 20], [700, 36], [700, 52],
  // 15. Grand Hall East Gallery Ceiling & NE 45° Chamfer
  [736, 52], [760, 76],
  // 16. Grand Hall East Upper Wall & Corridor C2 North Ceiling into East Wing North
  [760, 230], [810, 230],
  // 17. East Wing North West Upper Wall & NW 45° Chamfer
  [810, 138], [834, 114],
  // 18. East Wing North Ceiling Rafter to Far East Corner (Seamless 90° Miter)
  [1180, 114],
  // 19. East Wing North East Wall & South Sill to East Doorway East Jamb
  [1180, 340], [1026, 340],
  // 20. East Doorway East Jamb into East Wing South Room (open passage - NO cross beam!)
  [1026, 364],
  // 21. East South North Wall Ceiling to Far East Corner
  [1180, 364],
  // 22. East South East Wall & SE 45° Chamfer (The Benchmark Image 5 Standard!)
  [1180, 534], [1144, 570],
  // 23. East South Front Sill & West Wall up to Ceiling
  [880, 570], [880, 364],
  // 24. East South North Wall to East Doorway West Jamb
  [970, 364],
  // 25. East Doorway West Jamb into East Wing North Room (open passage - NO cross beam!)
  [970, 340],
  // 26. East Wing North South Sill to Corridor C2 South Sill
  [810, 340], [810, 266],
  // 27. Across Corridor C2 South Sill into Grand Hall South Sill
  [760, 266], [760, 340],
  // 28. Grand Hall South Sill to Corridor C3 East Jamb
  [615, 340],
  // 29. Corridor C3 East Jamb into Foyer (open passage - NO cross beam!)
  [615, 364],
  // 30. Foyer North Wall Ceiling to East Wall
  [750, 364],
  // 31. Foyer East Wall & Inset Cloak Alcove Nook
  [750, 510], [776, 510], [776, 570],
  // 32. Foyer Front Sill to Entrance Stoop East end (flat butt cut flush with doorway)
  [655, 570]
];

// Wooden Doorway Threshold Strips across exterior openings (Only at stoop)
const THRESHOLDS = [
  { x1: 535, x2: 655, y: 570 },  // Village Stoop
];

// Elevated Bullnose Wooden Steps
const STEPS = [
  { x1: 608, x2: 702, y: 106, label: 'hearth' },  // Asymmetric Hearth Step
  { x1: 78, x2: 192, y: 148, label: 'bed_nook' },  // Deep Bed Nook Step
  { x1: 534, x2: 656, y: 570, label: 'stoop' },    // Village Entrance Stoop
];

// Windows on Back Walls (Exclusively on South-Facing Back Walls - Zero Side Bleeding)
const WINDOWS = [
  [130, 90],              // Bed nook
  [270, 150],             // NW wing main room
  [480, 108], [550, 108], // Grand Hall gallery double windows
  [910, 170], [1070, 170], // East North Room double windows
];

// =========================================================================
// 3. MASTER PIXEL ART PARQUET GENERATOR & DEFS
// =========================================================================
const PARQUET_COLUMNS = [
  {
    x: 0,
    rects: [
      { y0: 0, y1: 115, fill: '#5c3a21' },
      { y0: 115, y1: 235, fill: '#4e2e18' },
      { y0: 235, y1: 360, fill: '#3d2516' },
      { y0: 360, y1: 495, fill: '#663e22' },
      { y0: 495, y1: 620, fill: '#4a2d1a' },
      { y0: 620, y1: 720, fill: '#5c3a21' }
    ],
    joints: [115, 235, 360, 495, 620],
    knots: [{ cx: 9, cy: 180 }, { cx: 9, cy: 560 }],
    scuffs: [80, 420]
  },
  {
    x: 18,
    rects: [
      { y0: 0, y1: 75, fill: '#4a2d1a' },
      { y0: 75, y1: 195, fill: '#663e22' },
      { y0: 195, y1: 315, fill: '#54331a' },
      { y0: 315, y1: 445, fill: '#4e2e18' },
      { y0: 445, y1: 580, fill: '#3d2516' },
      { y0: 580, y1: 720, fill: '#4a2d1a' }
    ],
    joints: [75, 195, 315, 445, 580],
    knots: [{ cx: 27, cy: 130 }, { cx: 27, cy: 380 }],
    scuffs: [260, 640]
  },
  {
    x: 36,
    rects: [
      { y0: 0, y1: 140, fill: '#3d2516' },
      { y0: 140, y1: 265, fill: '#5c3a21' },
      { y0: 265, y1: 395, fill: '#4e2e18' },
      { y0: 395, y1: 525, fill: '#422715' },
      { y0: 525, y1: 650, fill: '#663e22' },
      { y0: 650, y1: 720, fill: '#3d2516' }
    ],
    joints: [140, 265, 395, 525, 650],
    knots: [{ cx: 45, cy: 70 }, { cx: 45, cy: 470 }],
    scuffs: [210, 590]
  },
  {
    x: 54,
    rects: [
      { y0: 0, y1: 90, fill: '#663e22' },
      { y0: 90, y1: 210, fill: '#4a2d1a' },
      { y0: 210, y1: 340, fill: '#382012' },
      { y0: 340, y1: 465, fill: '#5c3a21' },
      { y0: 465, y1: 600, fill: '#4e2e18' },
      { y0: 600, y1: 720, fill: '#663e22' }
    ],
    joints: [90, 210, 340, 465, 600],
    knots: [{ cx: 63, cy: 165 }, { cx: 63, cy: 535 }],
    scuffs: [280, 670]
  },
  {
    x: 72,
    rects: [
      { y0: 0, y1: 160, fill: '#422715' },
      { y0: 160, y1: 285, fill: '#4e2e18' },
      { y0: 285, y1: 415, fill: '#5c3a21' },
      { y0: 415, y1: 550, fill: '#3d2516' },
      { y0: 550, y1: 675, fill: '#54331a' },
      { y0: 675, y1: 720, fill: '#422715' }
    ],
    joints: [160, 285, 415, 550, 675],
    knots: [{ cx: 81, cy: 220 }, { cx: 81, cy: 610 }],
    scuffs: [95, 350]
  },
  {
    x: 90,
    rects: [
      { y0: 0, y1: 60, fill: '#382012' },
      { y0: 60, y1: 180, fill: '#663e22' },
      { y0: 180, y1: 305, fill: '#5c3a21' },
      { y0: 305, y1: 435, fill: '#4a2d1a' },
      { y0: 435, y1: 565, fill: '#4e2e18' },
      { y0: 565, y1: 720, fill: '#382012' }
    ],
    joints: [60, 180, 305, 435, 565],
    knots: [{ cx: 99, cy: 115 }, { cx: 99, cy: 490 }],
    scuffs: [240, 630]
  },
  {
    x: 108,
    rects: [
      { y0: 0, y1: 125, fill: '#54331a' },
      { y0: 125, y1: 250, fill: '#4e2e18' },
      { y0: 250, y1: 380, fill: '#3d2516' },
      { y0: 380, y1: 505, fill: '#663e22' },
      { y0: 505, y1: 630, fill: '#5c3a21' },
      { y0: 630, y1: 720, fill: '#54331a' }
    ],
    joints: [125, 250, 380, 505, 630],
    knots: [{ cx: 117, cy: 310 }, { cx: 117, cy: 575 }],
    scuffs: [55, 440]
  },
  {
    x: 126,
    rects: [
      { y0: 0, y1: 80, fill: '#4a2d1a' },
      { y0: 80, y1: 205, fill: '#5c3a21' },
      { y0: 205, y1: 330, fill: '#663e22' },
      { y0: 330, y1: 460, fill: '#382012' },
      { y0: 460, y1: 590, fill: '#422715' },
      { y0: 590, y1: 720, fill: '#4a2d1a' }
    ],
    joints: [80, 205, 330, 460, 590],
    knots: [{ cx: 135, cy: 150 }, { cx: 135, cy: 400 }],
    scuffs: [270, 660]
  },
  {
    x: 144,
    rects: [
      { y0: 0, y1: 150, fill: '#3d2516' },
      { y0: 150, y1: 275, fill: '#4e2e18' },
      { y0: 275, y1: 400, fill: '#54331a' },
      { y0: 400, y1: 535, fill: '#5c3a21' },
      { y0: 535, y1: 660, fill: '#663e22' },
      { y0: 660, y1: 720, fill: '#3d2516' }
    ],
    joints: [150, 275, 400, 535, 660],
    knots: [{ cx: 153, cy: 220 }, { cx: 153, cy: 480 }],
    scuffs: [85, 340]
  },
  {
    x: 162,
    rects: [
      { y0: 0, y1: 100, fill: '#5c3a21' },
      { y0: 100, y1: 225, fill: '#4a2d1a' },
      { y0: 225, y1: 350, fill: '#382012' },
      { y0: 350, y1: 480, fill: '#4e2e18' },
      { y0: 480, y1: 610, fill: '#422715' },
      { y0: 610, y1: 720, fill: '#5c3a21' }
    ],
    joints: [100, 225, 350, 480, 610],
    knots: [{ cx: 171, cy: 160 }, { cx: 171, cy: 550 }],
    scuffs: [40, 290]
  }
];

const MasterParquetPattern = () => (
  <pattern
    id="cxs-floor-oak"
    width="180"
    height="720"
    patternUnits="userSpaceOnUse"
  >
    {PARQUET_COLUMNS.map((col, cIdx) => (
      <g key={`pcol-${cIdx}`}>
        {/* 1. Wooden plank rectangles */}
        {col.rects.map((r, rIdx) => {
          const ph = r.y1 - r.y0;
          return (
            <React.Fragment key={`rect-${cIdx}-${rIdx}`}>
              <rect x={col.x} y={r.y0} width={18} height={ph} fill={r.fill} />
              {/* Vertical woodgrain flowing through plank */}
              <path
                d={`M ${col.x + 5} ${r.y0 + 4} Q ${col.x + 3.5} ${r.y0 + ph * 0.45} ${col.x + 6} ${r.y1 - 4}`}
                stroke="rgba(24,10,3,0.28)"
                strokeWidth="0.7"
                fill="none"
              />
              <path
                d={`M ${col.x + 12} ${r.y0 + 8} Q ${col.x + 13.5} ${r.y0 + ph * 0.55} ${col.x + 11} ${r.y1 - 6}`}
                stroke="rgba(24,10,3,0.2)"
                strokeWidth="0.6"
                fill="none"
              />
              <line
                x1={col.x + 0.8}
                y1={r.y0}
                x2={col.x + 0.8}
                y2={r.y1}
                stroke="rgba(107,66,38,0.32)"
                strokeWidth="0.8"
              />
            </React.Fragment>
          );
        })}

        {/* 2. Staggered end-joints with authentic Stardew brass nails */}
        {col.joints.map((jy, jIdx) => (
          <React.Fragment key={`joint-${cIdx}-${jIdx}`}>
            <line
              x1={col.x}
              y1={jy}
              x2={col.x + 18}
              y2={jy}
              stroke="rgba(20,8,2,0.85)"
              strokeWidth="1.2"
            />
            <line
              x1={col.x}
              y1={jy + 0.8}
              x2={col.x + 18}
              y2={jy + 0.8}
              stroke="rgba(107,66,38,0.25)"
              strokeWidth="0.8"
            />
            <circle cx={col.x + 4.5} cy={jy + 3} r="0.8" fill="rgba(18,7,2,0.8)" />
            <circle cx={col.x + 13.5} cy={jy + 3} r="0.8" fill="rgba(18,7,2,0.8)" />
          </React.Fragment>
        ))}

        {/* 3. Knots & Scuffs */}
        {col.knots?.map((k, kIdx) => (
          <g key={`knot-${cIdx}-${kIdx}`}>
            <ellipse cx={k.cx} cy={k.cy} rx="1.6" ry="2.8" fill="#241005" />
            <ellipse cx={k.cx} cy={k.cy} rx="2.5" ry="4.5" stroke="rgba(107,66,38,0.25)" strokeWidth="0.6" fill="none" />
          </g>
        ))}
        {col.scuffs?.map((sy, sIdx) => (
          <line
            key={`scuff-${cIdx}-${sIdx}`}
            x1={col.x + 4}
            y1={sy}
            x2={col.x + 13}
            y2={sy + 10}
            stroke="rgba(24,9,2,0.4)"
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}

        {/* 4. Continuous vertical groove separating columns */}
        <line
          x1={col.x + 18}
          y1="0"
          x2={col.x + 18}
          y2="720"
          stroke="rgba(22,8,2,0.88)"
          strokeWidth="1.2"
        />
        <line
          x1={col.x + 18.8}
          y1="0"
          x2={col.x + 18.8}
          y2="720"
          stroke="rgba(107,66,38,0.18)"
          strokeWidth="0.7"
        />
      </g>
    ))}
  </pattern>
);

const Defs = () => (
  <defs>
    <MasterParquetPattern />

    <pattern id="cxs-grain" width="96" height="8" patternUnits="userSpaceOnUse">
      <path d="M 0 2 Q 24 0.8 48 2.4 T 96 2" stroke="rgba(28,12,3,0.35)" strokeWidth="0.8" fill="none" />
      <path d="M 0 5.6 Q 32 4.2 64 6 T 96 5.4" stroke="rgba(107,66,38,0.22)" strokeWidth="0.7" fill="none" />
    </pattern>

    {/* 1. Stardew Saloon Arcade Bricks (Image 1): Warm Earthy Tavern Cobblestones */}
    <pattern id="cxs-bricks-amber" width="32" height="16" patternUnits="userSpaceOnUse">
      <rect width="32" height="16" fill="#241407" />
      {/* Row 1 Bricks */}
      <rect x="1" y="1" width="14" height="6.5" rx="0.8" fill="#8c5828" stroke="#1f0f04" strokeWidth="0.6" />
      <line x1="1.5" y1="1.8" x2="14.5" y2="1.8" stroke="#b67a3d" strokeWidth="0.8" opacity="0.85" />
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke="#48250c" strokeWidth="0.7" />
      <circle cx="4" cy="4" r="0.5" fill="#3a1c07" opacity="0.6" />
      <circle cx="11" cy="5" r="0.6" fill="#3a1c07" opacity="0.6" />

      <rect x="17" y="1" width="14" height="6.5" rx="0.8" fill="#7a4b20" stroke="#1f0f04" strokeWidth="0.6" />
      <line x1="17.5" y1="1.8" x2="30.5" y2="1.8" stroke="#a46b33" strokeWidth="0.8" opacity="0.85" />
      <line x1="17.5" y1="7" x2="30.5" y2="7" stroke="#48250c" strokeWidth="0.7" />
      <circle cx="21" cy="3.5" r="0.5" fill="#3a1c07" opacity="0.6" />

      {/* Row 2 Bricks (Staggered by 8px) */}
      <rect x="9" y="9" width="14" height="6.5" rx="0.8" fill="#825224" stroke="#1f0f04" strokeWidth="0.6" />
      <line x1="9.5" y1="9.8" x2="22.5" y2="9.8" stroke="#ad7238" strokeWidth="0.8" opacity="0.85" />
      <line x1="9.5" y1="15" x2="22.5" y2="15" stroke="#48250c" strokeWidth="0.7" />
      <circle cx="16" cy="12" r="0.6" fill="#3a1c07" opacity="0.6" />

      <rect x="-7" y="9" width="14" height="6.5" rx="0.8" fill="#7a4b20" stroke="#1f0f04" strokeWidth="0.6" />
      <line x1="-6.5" y1="9.8" x2="6.5" y2="9.8" stroke="#a46b33" strokeWidth="0.8" opacity="0.85" />

      <rect x="25" y="9" width="14" height="6.5" rx="0.8" fill="#8c5828" stroke="#1f0f04" strokeWidth="0.6" />
      <line x1="25.5" y1="9.8" x2="38.5" y2="9.8" stroke="#b67a3d" strokeWidth="0.8" opacity="0.85" />
    </pattern>

    {/* 2. Stardew Saloon Fireplace Wallpaper (Image 2): Rich Burgundy/Mahogany Victorian Stripes */}
    <pattern id="cxs-stripes-burgundy" width="16" height="32" patternUnits="userSpaceOnUse">
      <rect width="16" height="32" fill="#35141c" />
      <rect x="0" y="0" width="8" height="32" fill="#4d1b27" />
      <line x1="0" y1="0" x2="0" y2="32" stroke="#220b12" strokeWidth="0.8" />
      <line x1="1" y1="0" x2="1" y2="32" stroke="#682535" strokeWidth="0.7" opacity="0.8" />
      <line x1="4" y1="0" x2="4" y2="32" stroke="rgba(245, 158, 11, 0.28)" strokeWidth="0.8" />

      <rect x="8" y="0" width="8" height="32" fill="#35141c" />
      <line x1="8" y1="0" x2="8" y2="32" stroke="#220b12" strokeWidth="0.8" />
      <line x1="12" y1="0" x2="12" y2="32" stroke="rgba(180, 83, 9, 0.25)" strokeWidth="0.7" />
    </pattern>

    {/* 3. Stardew Cellar Blue Bricks (Image 3): Slate Blue-Gray Stone Masonry */}
    <pattern id="cxs-bricks-slate" width="32" height="16" patternUnits="userSpaceOnUse">
      <rect width="32" height="16" fill="#131b24" />
      <rect x="1" y="1" width="14" height="6.5" rx="0.8" fill="#3b4b5e" stroke="#0e151c" strokeWidth="0.6" />
      <line x1="1.5" y1="1.8" x2="14.5" y2="1.8" stroke="#5a6e87" strokeWidth="0.8" opacity="0.85" />
      <line x1="1.5" y1="7" x2="14.5" y2="7" stroke="#243140" strokeWidth="0.7" />

      <rect x="17" y="1" width="14" height="6.5" rx="0.8" fill="#313f50" stroke="#0e151c" strokeWidth="0.6" />
      <line x1="17.5" y1="1.8" x2="30.5" y2="1.8" stroke="#4f627a" strokeWidth="0.8" opacity="0.85" />
      <line x1="17.5" y1="7" x2="30.5" y2="7" stroke="#243140" strokeWidth="0.7" />

      <rect x="9" y="9" width="14" height="6.5" rx="0.8" fill="#364557" stroke="#0e151c" strokeWidth="0.6" />
      <line x1="9.5" y1="9.8" x2="22.5" y2="9.8" stroke="#546780" strokeWidth="0.8" opacity="0.85" />
      <line x1="9.5" y1="15" x2="22.5" y2="15" stroke="#243140" strokeWidth="0.7" />

      <rect x="-7" y="9" width="14" height="6.5" rx="0.8" fill="#313f50" stroke="#0e151c" strokeWidth="0.6" />
      <line x1="-6.5" y1="9.8" x2="6.5" y2="9.8" stroke="#4f627a" strokeWidth="0.8" opacity="0.85" />

      <rect x="25" y="9" width="14" height="6.5" rx="0.8" fill="#3b4b5e" stroke="#0e151c" strokeWidth="0.6" />
      <line x1="25.5" y1="9.8" x2="38.5" y2="9.8" stroke="#5a6e87" strokeWidth="0.8" opacity="0.85" />
    </pattern>

    {/* 4. Warm Country Cottage Damask (Foyer) */}
    <pattern id="cxs-damask-warm" width="24" height="24" patternUnits="userSpaceOnUse">
      <rect width="24" height="24" fill="#dfcca0" />
      <path d="M 0 12 Q 6 6 12 12 T 24 12" stroke="rgba(146, 64, 14, 0.16)" strokeWidth="0.8" fill="none" />
      <path d="M 12 0 Q 6 6 12 12 T 12 24" stroke="rgba(146, 64, 14, 0.16)" strokeWidth="0.8" fill="none" />
      <polygon points="12,5 17,12 12,19 7,12" fill="rgba(180, 110, 40, 0.14)" />
      <circle cx="12" cy="12" r="1.5" fill="#b45309" opacity="0.5" />
      <circle cx="0" cy="0" r="1.2" fill="#92400e" opacity="0.4" />
      <circle cx="24" cy="0" r="1.2" fill="#92400e" opacity="0.4" />
      <circle cx="0" cy="24" r="1.2" fill="#92400e" opacity="0.4" />
      <circle cx="24" cy="24" r="1.2" fill="#92400e" opacity="0.4" />
    </pattern>

    <pattern id="cxs-wallpaper" width="20" height="20" patternUnits="userSpaceOnUse">
      <rect width="20" height="20" fill="#dfcca0" />
      <circle cx="10" cy="10" r="1.2" fill="#b45309" opacity="0.3" />
    </pattern>

    <linearGradient id="cxs-wall-shade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(30,12,3,0.45)" />
      <stop offset="35%" stopColor="rgba(30,12,3,0.12)" />
      <stop offset="100%" stopColor="rgba(30,12,3,0.22)" />
    </linearGradient>

    <linearGradient id="cxs-dark-oak" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5c3a21" />
      <stop offset="25%" stopColor="#4a2e1b" />
      <stop offset="65%" stopColor="#3d2516" />
      <stop offset="100%" stopColor="#241206" />
    </linearGradient>

    <linearGradient id="cxs-wainscot" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#5c3a21" />
      <stop offset="35%" stopColor="#4a2e1b" />
      <stop offset="75%" stopColor="#382012" />
      <stop offset="100%" stopColor="#241206" />
    </linearGradient>

    {/* Honey Wainscot (Arcade & Cellar) */}
    <linearGradient id="cxs-wainscot-honey" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#7c4a22" />
      <stop offset="35%" stopColor="#673d1a" />
      <stop offset="75%" stopColor="#4e2c10" />
      <stop offset="100%" stopColor="#351d09" />
    </linearGradient>

    {/* Mahogany Wainscot (Grand Hall Fireplace) */}
    <linearGradient id="cxs-wainscot-mahogany" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#542421" />
      <stop offset="35%" stopColor="#421a18" />
      <stop offset="75%" stopColor="#301210" />
      <stop offset="100%" stopColor="#1e0a09" />
    </linearGradient>

    <linearGradient id="cxs-tunnel-shadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(14,6,1,0.72)" />
      <stop offset="50%" stopColor="rgba(14,6,1,0.3)" />
      <stop offset="100%" stopColor="rgba(14,6,1,0)" />
    </linearGradient>

    <linearGradient id="cxs-glass" x1="0" y1="0" x2="0.5" y2="1">
      <stop offset="0%" stopColor="#fff8db" />
      <stop offset="55%" stopColor="#fde08a" />
      <stop offset="100%" stopColor="#d99b38" />
    </linearGradient>

    <linearGradient id="cxs-cast" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="rgba(14,5,1,0.5)" />
      <stop offset="100%" stopColor="rgba(14,5,1,0)" />
    </linearGradient>

    <clipPath id="cxs-clip-floor">
      {FLOORS.map(([x1, y1, x2, y2], i) => (
        <rect key={i} x={x1} y={y1} width={x2 - x1} height={y2 - y1} />
      ))}
    </clipPath>
  </defs>
);

// =========================================================================
// 4. THE UNIFIED POLY-WALL RENDERERS & SEALED STRUCTURAL POSTS
// =========================================================================

const toPathD = (pts) => pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ');

// =========================================================================
// MASTER TIMBER FRAMING RIBBON (Under [MASTER ROOM FRAMER] Benchmark Image 5)
// Exact single profile across all room boundaries, ceiling rafters, and sills.
// 100% airtight joinery, continuous 45° chamfers, concentric gold pinstripe,
// and clean flush butt terminations (ZERO Frankenstein sausage pills!).
// =========================================================================
const MasterFramingRibbon = ({ pts, width = 14, cap = 'butt' }) => {
  const d = toPathD(pts);
  return (
    <g className="master-frame-ribbon">
      {/* 1. Ground contact drop-shadow under the entire ribbon */}
      <path
        d={d}
        fill="none"
        stroke="rgba(14,5,1,0.42)"
        strokeWidth={width + 5}
        strokeLinejoin="round"
        strokeLinecap={cap}
      />
      {/* 2. Deep dark outer boundary outline against the void */}
      <path
        d={d}
        fill="none"
        stroke={OUT}
        strokeWidth={width + 3}
        strokeLinejoin="round"
        strokeLinecap={cap}
      />
      {/* 3. Solid Dark Walnut Timber Core Body */}
      <path
        d={d}
        fill="none"
        stroke="url(#cxs-dark-oak)"
        strokeWidth={width}
        strokeLinejoin="round"
        strokeLinecap={cap}
      />
      {/* 4. Directional Hand-Carved Woodgrain Texture */}
      <path
        d={d}
        fill="none"
        stroke="url(#cxs-grain)"
        strokeWidth={width - 2}
        strokeLinejoin="round"
        strokeLinecap={cap}
        opacity="0.65"
      />
      {/* 5. Warm Amber/Caramel Bevel Contour */}
      <path
        d={d}
        fill="none"
        stroke="#854d0e"
        strokeWidth="2.4"
        strokeLinejoin="round"
        strokeLinecap={cap}
        opacity="0.9"
      />
      {/* 6. Pure Golden Brass Pinstripe Inlay (Benchmark Image 5) */}
      <path
        d={d}
        fill="none"
        stroke="#d49b38"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap={cap}
      />
      {/* 7. Specular Glint Highlight on Inlay */}
      <path
        d={d}
        fill="none"
        stroke="#fef08a"
        strokeWidth="0.6"
        strokeLinejoin="round"
        strokeLinecap={cap}
        opacity="0.75"
      />
      {/* 8. Crisp Carved Inner Shadow Groove */}
      <path
        d={d}
        fill="none"
        stroke="rgba(16,6,1,0.85)"
        strokeWidth="0.8"
        strokeLinejoin="round"
        strokeLinecap={cap}
      />
    </g>
  );
};

// Continuous Wall Face Ribbon with Custom Theme (Wallpaper, Chair Rail, Wainscot, Baseboard & Blending Line)
const UnifiedWallFace = ({ 
  pts, 
  wallpaper = 'cxs-wallpaper', 
  wainscot = 'cxs-wainscot',
  chairRailColor = '#3d2516'
}) => {
  const topPts = pts.map(p => `${p[0]},${p[1] - F}`);
  const basePts = [...pts].reverse().map(p => `${p[0]},${p[1]}`);
  const polyStr = `${topPts.join(' ')} ${basePts.join(' ')}`;

  const chairRailD = toPathD(pts.map(p => [p[0], p[1] - 29]));
  const skirtD = toPathD(pts.map(p => [p[0], p[1] - 6]));
  const contactD = toPathD(pts);

  return (
    <g>
      {/* 1. Full Wall Face Polygon with Distinct Pattern */}
      <polygon points={polyStr} fill={`url(#${wallpaper})`} stroke={OUT} strokeWidth="1" strokeLinejoin="round" />
      <polygon points={polyStr} fill="url(#cxs-wall-shade)" />

      {/* 2. Continuous Chair Rail Ribbon */}
      <path d={chairRailD} fill="none" stroke={chairRailColor} strokeWidth="4.5" strokeLinejoin="round" />
      <path d={chairRailD} fill="none" stroke="#854d0e" strokeWidth="1.2" strokeLinejoin="round" opacity="0.9" />

      {/* 3. Lower Wainscot Cedar Slats Fill */}
      {pts.slice(0, -1).map((p1, idx) => {
        const p2 = pts[idx + 1];
        const segPoly = `${p1[0]},${p1[1] - 27} ${p2[0]},${p2[1] - 27} ${p2[0]},${p2[1] - 6} ${p1[0]},${p1[1] - 6}`;
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const segLen = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.floor(segLen / 10));

        return (
          <g key={`wseg-${idx}`}>
            <polygon points={segPoly} fill={`url(#${wainscot})`} />
            {Array.from({ length: steps - 1 }).map((_, sIdx) => {
              const t = (sIdx + 1) / steps;
              const sx = p1[0] + dx * t;
              const sy = p1[1] + dy * t;
              return (
                <line
                  key={`groove-${idx}-${sIdx}`}
                  x1={sx}
                  y1={sy - 26}
                  x2={sx}
                  y2={sy - 6}
                  stroke="rgba(22,8,2,0.7)"
                  strokeWidth="1.1"
                />
              );
            })}
          </g>
        );
      })}

      {/* 4. Skirting Baseboard Ribbon */}
      <path d={skirtD} fill="none" stroke="#1f1007" strokeWidth="6" strokeLinejoin="round" />
      <path d={skirtD} fill="none" stroke="#6b4226" strokeWidth="0.8" strokeLinejoin="round" opacity="0.8" />

      {/* 5. Seamless Floor Blending Contact Line */}
      <path d={contactD} fill="none" stroke="rgba(14,5,1,0.95)" strokeWidth="1.4" strokeLinejoin="round" />

      {/* 6. Fluid Ambient Occlusion Ribbon Hugging Baseboard */}
      <path d={contactD} fill="none" stroke="rgba(14,5,1,0.42)" strokeWidth="7" strokeLinejoin="round" opacity="0.85" />
    </g>
  );
};

// Authentic Stardew Valley Brass Wall Sconce Lamp (Warm Glowing Amber Bulb)
const WallSconce = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <ellipse cx="0" cy="-6" rx="14" ry="10" fill="rgba(245, 158, 11, 0.28)" style={{ mixBlendMode: 'screen' }} />
    <ellipse cx="0" cy="-6" rx="7" ry="5" fill="rgba(254, 240, 138, 0.45)" style={{ mixBlendMode: 'screen' }} />
    <ellipse cx="0" cy="4" rx="3" ry="1.2" fill="rgba(14,5,1,0.5)" />
    <rect x="-2.5" y="-3" width="5" height="7" rx="1" fill="#b45309" stroke="#1f1007" strokeWidth="0.8" />
    <circle cx="0" cy="0.5" r="0.7" fill="#fef08a" />
    <path d="M 0 1 Q -3 -2 0 -5" fill="none" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
    <polygon points="-2.5,-5 2.5,-5 1.8,-3 -1.8,-3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.6" />
    <circle cx="0" cy="-7" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
    <circle cx="0" cy="-7" r="0.9" fill="#ffffff" />
  </g>
);




// Seamless Wooden Threshold Plank across door openings
const DoorThreshold = ({ x1, x2, y }) => {
  const w = x2 - x1;
  return (
    <g id={`thresh-${x1}-${y}`}>
      <rect
        x={x1}
        y={y - 2}
        width={w}
        height="6"
        rx="1"
        fill="#321b0e"
        stroke={OUT}
        strokeWidth="0.9"
      />
      <line
        x1={x1 + 1}
        y1={y - 1}
        x2={x2 - 1}
        y2={y - 1}
        stroke="#854d0e"
        strokeWidth="0.8"
        opacity="0.9"
      />
    </g>
  );
};

// Elevated Bullnose Step
const BullnoseStep = ({ x1, x2, y }) => {
  const w = x2 - x1;
  return (
    <g>
      <ellipse cx={(x1 + x2) / 2} cy={y + 7} rx={w / 2 + 2} ry="4" fill="rgba(14,5,1,0.65)" />
      <rect
        x={x1}
        y={y}
        width={w}
        height="7.5"
        rx="3.75"
        ry="3.75"
        fill="url(#cxs-dark-oak)"
        stroke={OUT}
        strokeWidth="1.2"
      />
      <line
        x1={x1 + 3}
        y1={y + 1.2}
        x2={x2 - 3}
        y2={y + 1.2}
        stroke="#6b4226"
        strokeWidth="1.1"
        opacity="0.9"
      />
      <line
        x1={x1 + 3}
        y1={y + 6.2}
        x2={x2 - 3}
        y2={y + 6.2}
        stroke="rgba(20,8,2,0.75)"
        strokeWidth="1"
      />
    </g>
  );
};

// Rustic Cottage Window
const CottageWindow = ({ x, y, w = 36, h = 38 }) => (
  <g transform={`translate(${x}, ${y})`}>
    <path d={`M -3,${h + 2} L -3,12 Q ${w / 2},-5 ${w + 3},12 L ${w + 3},${h + 2} Z`} fill="rgba(0,0,0,0.65)" />
    <path d={`M -2,${h} L -2,13 Q ${w / 2},-3 ${w + 2},13 L ${w + 2},${h} Z`} fill="url(#cxs-wainscot)" stroke={OUT} strokeWidth="1.6" />
    <path d={`M 3,${h - 3} L 3,13 Q ${w / 2},1 ${w - 3},13 L ${w - 3},${h - 3} Z`} fill="url(#cxs-glass)" stroke={OUT} strokeWidth="1" />
    <line x1={w / 2} y1="3" x2={w / 2} y2={h - 3} stroke="#fffae0" strokeWidth="1.8" />
    <line x1="3" y1={h / 2 + 2} x2={w - 3} y2={h / 2 + 2} stroke="#fffae0" strokeWidth="1.8" />
    <polygon points="6,16 12,9 15,9 8,20" fill="rgba(255,255,255,0.65)" />
    <rect x="-5" y={h - 2} width={w + 10} height="6" rx="1.5" fill="#3d2516" stroke={OUT} strokeWidth="1.3" />
    <line x1="-4" y1={h} x2={w + 4} y2={h} stroke="#6b4226" strokeWidth="1.1" opacity="0.9" />
  </g>
);

// Soft Volumetric Sunbeam Streaming at 45° Uniform Diagonal
const Sunbeam = ({ wx, ys, w = 36, L = 200 }) => {
  const sx = SLOPE * L;
  const half = w / 2 - 1.5;
  return (
    <g>
      <polygon
        points={`${wx},${ys} ${wx + half},${ys} ${wx + half + sx},${ys + L} ${wx + sx},${ys + L}`}
        fill="rgba(255, 235, 190, 0.1)"
      />
      <polygon
        points={`${wx + half + 3},${ys} ${wx + w},${ys} ${wx + w + sx},${ys + L} ${wx + half + 3 + sx},${ys + L}`}
        fill="rgba(255, 235, 190, 0.1)"
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

      {/* LAYER 1: DEEP RPG VOID BACKGROUND */}
      <rect x="0" y="0" width={W} height={H} fill={VOID} />

      {/* LAYER 2: MASTER PARQUET FLOOR */}
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

        {/* Asymmetric 45° Corner Floor Cuts */}
        {FLOOR_CUTS.map((pts, i) => (
          <polygon
            key={`cut-${i}`}
            points={pts.map(p => p.join(',')).join(' ')}
            fill={VOID}
            stroke={VOID}
            strokeWidth="1.2"
          />
        ))}
      </g>

      {/* LAYER 3: VOLUMETRIC SUNBEAMS & CAST SHADOWS */}
      <g id="cx-sunbeams-and-shadows" clipPath="url(#cxs-clip-floor)" style={{ pointerEvents: 'none' }}>
        {WINDOWS.map(([wx, base], i) => (
          <Sunbeam key={`beam-${i}`} wx={wx} ys={base - 8} />
        ))}
      </g>

      {/* LAYER 4: ASYMMETRIC WALL FACES WITH DISTINCTIVE STARDEW THEMES */}
      <g id="cx-wall-faces">
        {/* Zone 1: Left Wing - Warm Tavern Cobblestone Bricks & Honey Wainscot */}
        <UnifiedWallFace pts={ZONE1_BACK_WALL} wallpaper="cxs-bricks-amber" wainscot="cxs-wainscot-honey" />
        <UnifiedWallFace pts={ZONE1_CORRIDOR_BACK} wallpaper="cxs-bricks-amber" wainscot="cxs-wainscot-honey" />

        {/* Zone 2: Grand Hall - Victorian Burgundy Saloon Stripes & Mahogany Wainscot */}
        <UnifiedWallFace pts={ZONE2_BACK_WALL} wallpaper="cxs-stripes-burgundy" wainscot="cxs-wainscot-mahogany" chairRailColor="#4a1518" />
        <UnifiedWallFace pts={ZONE2_CORRIDOR_BACK} wallpaper="cxs-stripes-burgundy" wainscot="cxs-wainscot-mahogany" chairRailColor="#4a1518" />

        {/* Zone 3: Entrance Foyer - Warm Country Cottage Damask Wallpaper */}
        <UnifiedWallFace pts={ZONE3_BACK_WALL_LEFT} wallpaper="cxs-damask-warm" wainscot="cxs-wainscot" />
        <UnifiedWallFace pts={ZONE3_BACK_WALL_RIGHT} wallpaper="cxs-damask-warm" wainscot="cxs-wainscot" />

        {/* Zone 4: East Wing North - Cool Slate Blue-Gray Stone Masonry */}
        <UnifiedWallFace pts={ZONE4_NORTH_BACK_WALL} wallpaper="cxs-bricks-slate" wainscot="cxs-wainscot-honey" />

        {/* Zone 4: East Wing South - Burgundy Saloon Stripes */}
        <UnifiedWallFace pts={ZONE4_SOUTH_NORTH_WALL_LEFT} wallpaper="cxs-stripes-burgundy" wainscot="cxs-wainscot" />
        <UnifiedWallFace pts={ZONE4_SOUTH_NORTH_WALL_RIGHT} wallpaper="cxs-stripes-burgundy" wainscot="cxs-wainscot" />

        {/* Cottage Windows */}
        {WINDOWS.map(([wx, base], i) => (
          <CottageWindow key={`win-${i}`} x={wx} y={base - F + 10} />
        ))}

        {/* Authentic Stardew Brass Wall Sconces with Cozy Glowing Amber Flame */}
        <WallSconce x={220} y={150 - 36} />
        <WallSconce x={340} y={150 - 36} />
        <WallSconce x={475} y={108 - 36} />
        <WallSconce x={735} y={108 - 36} />
        <WallSconce x={875} y={170 - 36} />
        <WallSconce x={1135} y={170 - 36} />
        <WallSconce x={495} y={420 - 36} />
        <WallSconce x={700} y={420 - 36} />
      </g>

      {/* LAYER 5: MASTER ARCHITECTURAL FRAMING (Under [MASTER ROOM FRAMER] Skill) */}
      <g id="cx-master-framing">
        {/* Single continuous monolithic ribbon wrapping the entire house perimeter */}
        <MasterFramingRibbon pts={GRAND_UNIFIED_PERIMETER_FRAME} cap="butt" />

        {/* Wooden Doorway Threshold Strips across exterior village entrance */}
        {THRESHOLDS.map((t, i) => (
          <DoorThreshold key={`thresh-${i}`} {...t} />
        ))}
      </g>

      {/* LAYER 6: ELEVATED BULLNOSE STEPS */}
      <g id="cx-steps-and-archways">
        {STEPS.map((s, i) => (
          <BullnoseStep key={`step-${i}`} {...s} />
        ))}
      </g>
    </svg>
  );
}

// =========================================================================
// 6. SOFT AMBIENT LAMPLIGHT POOLS (Cozy Warm Glow)
// =========================================================================
const POOLS = [
  { x: 135, y: 120, rx: 65, ry: 40, o: 0.55 },   // Bed nook
  { x: 280, y: 230, rx: 110, ry: 75, o: 0.65 },  // NW wing
  { x: 405, y: 248, rx: 50, ry: 20, o: 0.4 },    // W-E corridor C1
  { x: 540, y: 220, rx: 150, ry: 100, o: 0.85 }, // Central Hall gallery
  { x: 655, y: 92, rx: 60, ry: 30, o: 0.6 },     // Hearth alcove (off-center)
  { x: 785, y: 248, rx: 50, ry: 20, o: 0.4 },    // East connector C2
  { x: 595, y: 380, rx: 36, ry: 40, o: 0.4 },    // N-S corridor C3
  { x: 595, y: 490, rx: 140, ry: 70, o: 0.65 },  // Foyer
  { x: 762, y: 540, rx: 40, ry: 25, o: 0.45 },   // Foyer inset cloak alcove
  { x: 995, y: 260, rx: 200, ry: 100, o: 0.75 }, // East wing north
  { x: 1030, y: 495, rx: 130, ry: 60, o: 0.55 }, // East south room
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
