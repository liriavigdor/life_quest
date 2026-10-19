import React from "react";

/**
 * NewCottageEngine.jsx
 * -------------------------------------------------------------
 * 2.5D Orthographic Interior Engine - Blacksmith's Asymmetric Cottage
 * 
 * Blueprint (viewBox="0 0 1000 600"):
 *  1. Main Forge Wing (Left):
 *     - Recessed Hearth/Forge Niche: [160, 80, 380, 160]
 *     - Main Workshop: [100, 160, 500, 520]
 *  2. Connecting Corridor: [500, 260, 580, 340]
 *  3. Deep Storage Wing (Right): [580, 120, 900, 480]
 * 
 * Features:
 *  - Deterministic procedural patterns (no runtime Math.random)
 *  - Dual-surface stone walls with wainscoting and crown rafters
 *  - Asymmetric 45° corner chamfers
 *  - Volumetric sunbeams & glowing bronze sconces
 *  - Recessed blacksmith forge with glowing embers & anvil station
 *  - Continuous sealed outer ribbon preventing void bleed
 */

const VOID_BG = "#070504";
const OUTLINE_COLOR = "#140803";

// -----------------------------------------------------------------------------
// Vector Sub-Components
// -----------------------------------------------------------------------------

// Stardew-style Arched Cottage Window
const CottageWindow = ({ x, y, width = 42, height = 48 }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Wall recess drop shadow */}
      <path
        d={`M -3,${height + 2} L -3,14 Q ${width / 2},-6 ${width + 3},14 L ${width + 3},${height + 2} Z`}
        fill="rgba(0, 0, 0, 0.6)"
      />
      {/* Wooden Arch Frame */}
      <path
        d={`M -2,${height} L -2,15 Q ${width / 2},-4 ${width + 2},15 L ${width + 2},${height} Z`}
        fill="url(#cxs-wainscot)"
        stroke={OUTLINE_COLOR}
        strokeWidth="1.6"
      />
      {/* Luminous Warm Stained Glass */}
      <path
        d={`M 3,${height - 4} L 3,16 Q ${width / 2},0 ${width - 3},16 L ${width - 3},${height - 4} Z`}
        fill="url(#cxs-glass)"
        stroke={OUTLINE_COLOR}
        strokeWidth="1"
      />
      {/* Mullions / Crossbars */}
      <line x1={width / 2} y1="3" x2={width / 2} y2={height - 4} stroke="#4a2e1b" strokeWidth="1.8" />
      <line x1="3" y1={height / 2 + 2} x2={width - 3} y2={height / 2 + 2} stroke="#4a2e1b" strokeWidth="1.8" />
      {/* Specular Glint */}
      <polygon points="7,18 14,10 17,10 9,23" fill="rgba(255,255,255,0.7)" />
      {/* Stone / Timber Sill */}
      <rect x="-6" y={height - 3} width={width + 12} height="7" rx="1.5" fill="#3d2516" stroke={OUTLINE_COLOR} strokeWidth="1.2" />
      <line x1="-5" y1={height - 1} x2={width + 5} y2={height - 1} stroke="#7a4b20" strokeWidth="1.1" />
    </g>
  );
};

// 45° Volumetric Sunbeam Streaming Downwards
const Sunbeam = ({ wx, wy, width = 42, length = 180 }) => {
  const slopeX = length * 0.7;
  return (
    <g style={{ pointerEvents: "none" }}>
      <polygon
        points={`${wx},${wy} ${wx + width / 2 - 2},${wy} ${wx + width / 2 - 2 + slopeX},${wy + length} ${wx + slopeX},${wy + length}`}
        fill="rgba(255, 235, 180, 0.12)"
      />
      <polygon
        points={`${wx + width / 2 + 2},${wy} ${wx + width},${wy} ${wx + width + slopeX},${wy + length} ${wx + width / 2 + 2 + slopeX},${wy + length}`}
        fill="rgba(255, 235, 180, 0.14)"
      />
      {/* Floor light pool */}
      <ellipse
        cx={wx + width / 2 + slopeX}
        cy={wy + length}
        rx={width * 0.9}
        ry="14"
        fill="rgba(255, 230, 160, 0.15)"
      />
    </g>
  );
};

// Wall-Mounted Bronze Sconce with Radiant Soft Ambient Glow
const WallSconce = ({ cx, cy }) => {
  return (
    <g transform={`translate(${cx}, ${cy})`} style={{ pointerEvents: "none" }}>
      {/* Ambient radial glow halo */}
      <circle cx="0" cy="-6" r="42" fill="url(#cx-lamp-glow)" />
      {/* Cast shadow behind mount */}
      <rect x="-3" y="-1" width="6" height="14" fill="rgba(0,0,0,0.5)" rx="1" />
      {/* Bronze bracket backplate */}
      <rect x="-2.5" y="0" width="5" height="12" rx="1" fill="#8c5828" stroke="#1f0f04" strokeWidth="0.8" />
      {/* Curved sconce arm */}
      <path d="M 0,9 Q 8,5 6,-4" fill="none" stroke="#241407" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M 0,9 Q 8,5 6,-4" fill="none" stroke="#b67a3d" strokeWidth="1" strokeLinecap="round" />
      {/* Torch cup */}
      <path d="M 2,-4 L 10,-4 L 8,0 L 4,0 Z" fill="#4a2e1b" stroke="#140803" strokeWidth="0.8" />
      {/* Ember torch head & flame */}
      <circle cx="6" cy="-6" r="3.5" fill="#ff7a00" />
      <circle cx="6" cy="-7.5" r="2" fill="#fff3a1" />
      <circle cx="6" cy="-6" r="6" fill="rgba(255, 150, 0, 0.35)" />
    </g>
  );
};

// Sealed Outer Ribbon Boundary
const OuterRibbon = ({ d }) => {
  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Soft drop shadow against the outer void */}
      <path d={d} fill="none" stroke="rgba(0, 0, 0, 0.7)" strokeWidth="20" strokeLinejoin="round" />
      {/* Deep border outline */}
      <path d={d} fill="none" stroke={OUTLINE_COLOR} strokeWidth="15" strokeLinejoin="round" />
      {/* Dark walnut wood core */}
      <path d={d} fill="none" stroke="#3d2516" strokeWidth="11" strokeLinejoin="round" />
      {/* Amber bevel contour */}
      <path d={d} fill="none" stroke="#7a4b20" strokeWidth="5" strokeLinejoin="round" />
      {/* Pure golden pinstripe highlight */}
      <path d={d} fill="none" stroke="#d49b38" strokeWidth="1.8" strokeLinejoin="round" />
      {/* Crisp specular inner hairline */}
      <path d={d} fill="none" stroke="#fef08a" strokeWidth="0.8" strokeLinejoin="round" opacity="0.8" />
    </g>
  );
};

// -----------------------------------------------------------------------------
// Main Component
// -----------------------------------------------------------------------------
const NewCottageEngine = () => {
  const WIDTH = 1000;
  const HEIGHT = 600;

  // Outer blueprint boundary path connecting all wings and chamfers
  const outerRibbonPath = [
    // Recessed Hearth Niche Roof
    "M 160 80",
    "L 380 80",
    "L 380 160",
    // Forge Wing East Wall
    "L 500 160",
    // Corridor North Roof
    "L 500 260",
    "L 580 260",
    // Storage Wing North Roof
    "L 580 120",
    "L 900 120",
    // Storage Wing East Wall & SE Chamfer
    "L 900 440",
    "L 860 480",
    "L 580 480",
    // Corridor South Wall
    "L 580 340",
    "L 500 340",
    // Forge South Wall & SW Chamfer
    "L 500 520",
    "L 140 520",
    "L 100 480",
    // Forge West Wall
    "L 100 160",
    "L 160 160",
    "Z"
  ].join(" ");

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{
        backgroundColor: VOID_BG,
        display: "block",
        margin: "0 auto",
        boxShadow: "0 10px 40px rgba(0,0,0,0.85)"
      }}
    >
      <defs>
        {/* Oak Wood Floor Pattern */}
        <pattern id="cxs-floor-oak" width="72" height="72" patternUnits="userSpaceOnUse">
          <rect width="72" height="72" fill="#3d2516" />
          {/* Vertical Planks */}
          {[0, 18, 36, 54].map((px, i) => (
            <g key={i}>
              <rect
                x={px}
                y="0"
                width="18"
                height="72"
                fill={i % 2 === 0 ? "#4a2e1b" : "#432817"}
                stroke="#29180c"
                strokeWidth="0.8"
              />
              {/* Woodgrain Lines */}
              <line x1={px + 5} y1="0" x2={px + 5} y2="72" stroke="#5a3821" strokeWidth="0.6" opacity="0.35" />
              <line x1={px + 12} y1="0" x2={px + 12} y2="72" stroke="#2c170a" strokeWidth="0.6" opacity="0.45" />
              {/* Staggered Horizontal Joints */}
              <line
                x1={px}
                y1={(i * 24 + 18) % 72}
                x2={px + 18}
                y2={(i * 24 + 18) % 72}
                stroke="#1f0f04"
                strokeWidth="1.2"
              />
              {/* Authentic Nail Fasteners */}
              <circle cx={px + 4.5} cy={(i * 24 + 22) % 72} r="0.75" fill="#140802" />
              <circle cx={px + 13.5} cy={(i * 24 + 22) % 72} r="0.75" fill="#140802" />
            </g>
          ))}
        </pattern>

        {/* Chiseled Slate & Granite Stone Bricks */}
        <pattern id="cxs-bricks-slate" width="36" height="20" patternUnits="userSpaceOnUse">
          <rect width="36" height="20" fill="#1c1f24" />
          {/* Row 1 */}
          <rect x="1" y="1" width="16" height="8" rx="0.8" fill="#3d4652" stroke="#121518" strokeWidth="0.8" />
          <line x1="2" y1="2" x2="16" y2="2" stroke="#5d6978" strokeWidth="0.8" opacity="0.8" />
          <line x1="2" y1="8" x2="16" y2="8" stroke="#252b33" strokeWidth="0.8" />

          <rect x="19" y="1" width="16" height="8" rx="0.8" fill="#323b45" stroke="#121518" strokeWidth="0.8" />
          <line x1="20" y1="2" x2="34" y2="2" stroke="#4f5b6b" strokeWidth="0.8" opacity="0.8" />

          {/* Row 2 (Staggered) */}
          <rect x="10" y="11" width="16" height="8" rx="0.8" fill="#38424d" stroke="#121518" strokeWidth="0.8" />
          <line x1="11" y1="12" x2="25" y2="12" stroke="#546373" strokeWidth="0.8" opacity="0.8" />
          <line x1="11" y1="18" x2="25" y2="18" stroke="#22272e" strokeWidth="0.8" />

          <rect x="-8" y="11" width="16" height="8" rx="0.8" fill="#303842" stroke="#121518" strokeWidth="0.8" />
          <rect x="28" y="11" width="16" height="8" rx="0.8" fill="#3a444f" stroke="#121518" strokeWidth="0.8" />
        </pattern>

        {/* Wainscot Cedar Slats Linear Gradient */}
        <linearGradient id="cxs-wainscot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c3a21" />
          <stop offset="30%" stopColor="#4a2e1b" />
          <stop offset="70%" stopColor="#382012" />
          <stop offset="100%" stopColor="#241206" />
        </linearGradient>

        {/* Top Wall Drop Shadow onto Wall Base */}
        <linearGradient id="cxs-wall-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(10, 4, 1, 0.65)" />
          <stop offset="40%" stopColor="rgba(10, 4, 1, 0.2)" />
          <stop offset="100%" stopColor="rgba(10, 4, 1, 0.45)" />
        </linearGradient>

        {/* Ambient Lamp Radial Glow */}
        <radialGradient id="cx-lamp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="rgba(255, 215, 120, 0.75)" />
          <stop offset="35%" stopColor="rgba(255, 180, 70, 0.35)" />
          <stop offset="70%" stopColor="rgba(255, 140, 40, 0.1)" />
          <stop offset="100%" stopColor="rgba(255, 140, 40, 0)" />
        </radialGradient>

        {/* Hearth Glowing Embers Gradient */}
        <radialGradient id="cxs-hearth-glow" cx="0.5" cy="0.6" r="0.5">
          <stop offset="0%" stopColor="rgba(255, 240, 150, 0.95)" />
          <stop offset="25%" stopColor="rgba(255, 120, 20, 0.85)" />
          <stop offset="60%" stopColor="rgba(180, 40, 0, 0.4)" />
          <stop offset="100%" stopColor="rgba(60, 10, 0, 0)" />
        </radialGradient>

        {/* Stained Glass Warm Gradient */}
        <linearGradient id="cxs-glass" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#fff8db" />
          <stop offset="55%" stopColor="#fde08a" />
          <stop offset="100%" stopColor="#d99b38" />
        </linearGradient>
      
        {/* Green Emerald Rug for Upper Mezzanine */}
        <pattern id="cxs-rug-green" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#0a4c33" />
          <path d="M0,40 L80,40" stroke="#1d7a4d" strokeWidth="4" opacity="0.6" />
          <path d="M40,0 L40,80" stroke="#1d7a4d" strokeWidth="4" opacity="0.6" />
        </pattern>

        {/* Billiard Table Felt */}
        <pattern id="cxs-felt-green" width="100" height="50" patternUnits="userSpaceOnUse">
          <rect width="100" height="50" fill="#1a6b38" />
        </pattern>

      </defs>

      {/* =====================================================================
          LAYER 1: PARQUET WOOD FLOORS (Bounded Blueprint)
          ===================================================================== */}
      <g id="architectural-floors">
        {/* Main Forge Floor */}
        <rect x="100" y="210" width="400" height="310" fill="url(#cxs-floor-oak)" />

        {/* Recessed Hearth Niche Floor */}
        <rect x="160" y="130" width="220" height="80" fill="url(#cxs-floor-oak)" />

        {/* Connecting Corridor Floor */}
        <rect x="500" y="260" width="80" height="80" fill="url(#cxs-floor-oak)" />

        {/* Storage Wing Floor */}
        <rect x="580" y="170" width="320" height="310" fill="url(#cxs-floor-oak)" />

        {/* Chamfer Floor Cuts (45° Triangles filled with VOID) */}
        {/* Forge SW Chamfer Cut: [100, 480], [100, 520], [140, 520] */}
        <polygon points="100,480 100,520 140,520" fill={VOID_BG} stroke={VOID_BG} strokeWidth="1.5" />

        {/* Storage SE Chamfer Cut: [860, 480], [900, 480], [900, 440] */}
        <polygon points="860,480 900,480 900,440" fill={VOID_BG} stroke={VOID_BG} strokeWidth="1.5" />
      </g>

      {/* =====================================================================
          LAYER 2: BACK WALLS (Dual Surface: Stone + Wainscoting)
          ===================================================================== */}
      <g id="architectural-walls">
        {/* --- Recessed Hearth Niche Back Wall (Y: 80 - 130) --- */}
        <rect x="160" y="80" width="220" height="50" fill="url(#cxs-bricks-slate)" />
        <rect x="160" y="80" width="220" height="50" fill="url(#cxs-wall-shade)" />
        {/* Hearth Niche Wainscot Base */}
        <rect x="160" y="118" width="220" height="12" fill="url(#cxs-wainscot)" />
        <line x1="160" y1="118" x2="380" y2="118" stroke="#7a4b20" strokeWidth="1.2" />

        {/* --- Main Forge Back Wall (Y: 160 - 210) --- */}
        {/* Left segment (100 to 160) */}
        <rect x="100" y="160" width="60" height="50" fill="url(#cxs-bricks-slate)" />
        <rect x="100" y="160" width="60" height="50" fill="url(#cxs-wall-shade)" />
        <rect x="100" y="196" width="60" height="14" fill="url(#cxs-wainscot)" />
        <line x1="100" y1="196" x2="160" y2="196" stroke="#7a4b20" strokeWidth="1.2" />

        {/* Right segment (380 to 500) */}
        <rect x="380" y="160" width="120" height="50" fill="url(#cxs-bricks-slate)" />
        <rect x="380" y="160" width="120" height="50" fill="url(#cxs-wall-shade)" />
        <rect x="380" y="196" width="120" height="14" fill="url(#cxs-wainscot)" />
        <line x1="380" y1="196" x2="500" y2="196" stroke="#7a4b20" strokeWidth="1.2" />

        {/* --- Connecting Corridor North Back Wall (Y: 260 - 280) --- */}
        <rect x="500" y="260" width="80" height="20" fill="url(#cxs-bricks-slate)" />
        <rect x="500" y="260" width="80" height="20" fill="url(#cxs-wall-shade)" />
        <rect x="500" y="274" width="80" height="6" fill="url(#cxs-wainscot)" />

        {/* --- Storage Wing Back Wall (Y: 120 - 170) --- */}
        <rect x="580" y="120" width="320" height="50" fill="url(#cxs-bricks-slate)" />
        <rect x="580" y="120" width="320" height="50" fill="url(#cxs-wall-shade)" />
        <rect x="580" y="156" width="320" height="14" fill="url(#cxs-wainscot)" />
        <line x1="580" y1="156" x2="900" y2="156" stroke="#7a4b20" strokeWidth="1.2" />

        {/* Baseboard Skirting Lines for Grounding Contact */}
        <line x1="160" y1="130" x2="380" y2="130" stroke="#1f0f04" strokeWidth="2.5" />
        <line x1="100" y1="210" x2="160" y2="210" stroke="#1f0f04" strokeWidth="2.5" />
        <line x1="380" y1="210" x2="500" y2="210" stroke="#1f0f04" strokeWidth="2.5" />
        <line x1="500" y1="280" x2="580" y2="280" stroke="#1f0f04" strokeWidth="2.5" />
        <line x1="580" y1="170" x2="900" y2="170" stroke="#1f0f04" strokeWidth="2.5" />
      </g>

      {/* =====================================================================
          LAYER 3: BLACKSMITH RECESSED FORGE & HEARTH (160, 80 to 380, 160)
          ===================================================================== */}
      <g id="blacksmith-hearth">
        {/* Masonry Hearth Chimney Hood */}
        <polygon points="190,80 350,80 330,120 210,120" fill="#24282e" stroke={OUTLINE_COLOR} strokeWidth="2" />
        <line x1="210" y1="120" x2="330" y2="120" stroke="#d49b38" strokeWidth="2" />
        <line x1="205" y1="100" x2="335" y2="100" stroke="#14171a" strokeWidth="1.5" />

        {/* Forge Fire Pit Base */}
        <rect x="220" y="120" width="100" height="34" rx="2" fill="#181a1f" stroke="#0e1014" strokeWidth="2" />
        {/* Fire Brick Lining */}
        <rect x="224" y="123" width="92" height="28" fill="#4a1c14" />
        {/* Charcoal & Embers Bed */}
        <ellipse cx="270" cy="136" rx="42" ry="12" fill="#260b06" />
        {/* Glowing Fire Coals */}
        <ellipse cx="270" cy="136" rx="36" ry="9" fill="url(#cxs-hearth-glow)" />
        <circle cx="260" cy="134" r="5" fill="#fff7b8" />
        <circle cx="280" cy="136" r="4" fill="#ffb43b" />
        <circle cx="270" cy="132" r="3" fill="#ffef99" />
        {/* Heavy Iron Grate Bars */}
        <line x1="230" y1="130" x2="310" y2="130" stroke="#121317" strokeWidth="2" />
        <line x1="230" y1="136" x2="310" y2="136" stroke="#121317" strokeWidth="2" />
        <line x1="230" y1="142" x2="310" y2="142" stroke="#121317" strokeWidth="2" />

        {/* Hearth Ambient Soft Radiance onto floor */}
        <circle cx="270" cy="140" r="75" fill="url(#cxs-hearth-glow)" opacity="0.45" style={{ pointerEvents: "none" }} />
      </g>

      {/* =====================================================================
          LAYER 4: ARCHITECTURAL WINDOWS & VOLUMETRIC SUNBEAMS
          ===================================================================== */}
      <g id="windows-and-sunbeams">
        {/* Window 1: Main Forge Back Wall (Right of hearth) */}
        <CottageWindow x={425} y={154} width={40} height={46} />
        <Sunbeam wx={425} wy={200} width={40} length={210} />

        {/* Window 2: Deep Storage Back Wall (Center) */}
        <CottageWindow x={720} y={114} width={42} height={48} />
        <Sunbeam wx={720} wy={162} width={42} length={240} />
      </g>

      {/* =====================================================================
          LAYER 5: BRONZE WALL SCONCES
          ===================================================================== */}
      <g id="wall-sconces">
        {/* Sconce 1: West wall of Forge */}
        <WallSconce cx={114} cy={230} />
        {/* Sconce 2: Corridor Entryway */}
        <WallSconce cx={486} cy={220} />
        {/* Sconce 3: Deep Storage East Wall */}
        <WallSconce cx={886} cy={180} />
      </g>

      {/* =====================================================================
          LAYER 6: WORKSHOP INTEGRATED ANVIL & STORAGE PROPS (2.5D Orthographic)
          ===================================================================== */}
      <g id="workshop-props">
        {/* Heavy Oak Anvil Stump */}
        <g transform="translate(230, 270)">
          {/* Stump Shadow */}
          <ellipse cx="25" cy="46" rx="28" ry="12" fill="rgba(0,0,0,0.5)" />
          {/* Tree Stump Trunk */}
          <path d="M 4,14 L 0,44 Q 25,50 50,44 L 46,14 Q 25,18 4,14 Z" fill="#4a2e1b" stroke="#1f0f04" strokeWidth="1.5" />
          {/* Bark Textures */}
          <line x1="12" y1="16" x2="10" y2="44" stroke="#2e190a" strokeWidth="1.2" />
          <line x1="26" y1="17" x2="25" y2="46" stroke="#2e190a" strokeWidth="1.2" />
          <line x1="38" y1="16" x2="39" y2="44" stroke="#2e190a" strokeWidth="1.2" />
          {/* Stump Top Ring */}
          <ellipse cx="25" cy="14" rx="21" ry="8" fill="#7a4b20" stroke="#1f0f04" strokeWidth="1.5" />
          <ellipse cx="25" cy="14" rx="14" ry="5" fill="#5c3a21" stroke="#3d2516" strokeWidth="1" />

          {/* Cast Iron Blacksmith Anvil */}
          <path
            d="M 12,6 L 15,2 L 35,2 L 44,-2 L 44,2 L 36,6 L 33,10 L 17,10 Z"
            fill="#2c3038"
            stroke="#121317"
            strokeWidth="1.4"
          />
          {/* Anvil Bevel Highlight */}
          <line x1="15" y1="3" x2="42" y2="3" stroke="#5d6978" strokeWidth="1" />
          {/* Forging Hammer resting on anvil */}
          <line x1="18" y1="-1" x2="32" y2="5" stroke="#8c5828" strokeWidth="2.2" strokeLinecap="round" />
          <rect x="30" y="2" width="7" height="5" rx="1" fill="#404652" stroke="#121317" strokeWidth="1" />
        </g>

        {/* Quenching Water Trough */}
        <g transform="translate(130, 260)">
          <ellipse cx="20" cy="40" rx="22" ry="10" fill="rgba(0,0,0,0.4)" />
          {/* Timber Trough Box */}
          <rect x="0" y="10" width="40" height="28" rx="2" fill="#5c3a21" stroke="#1f0f04" strokeWidth="1.5" />
          {/* Water Surface */}
          <ellipse cx="20" cy="12" rx="18" ry="6" fill="#3b6978" stroke="#1f0f04" strokeWidth="1" />
          <ellipse cx="20" cy="12" rx="13" ry="3.5" fill="#5a9cb3" />
          {/* Iron Reinforcing Straps */}
          <line x1="0" y1="18" x2="40" y2="18" stroke="#121317" strokeWidth="2" />
          <line x1="0" y1="32" x2="40" y2="32" stroke="#121317" strokeWidth="2" />
        </g>

        {/* Storage Wing Crates & Iron Ingots */}
        <g transform="translate(820, 210)">
          {/* Crate Shadow */}
          <ellipse cx="24" cy="48" rx="26" ry="10" fill="rgba(0,0,0,0.45)" />
          {/* Wooden Storage Crate */}
          <rect x="2" y="14" width="42" height="34" rx="1.5" fill="#7a4b20" stroke="#1f0f04" strokeWidth="1.5" />
          {/* Crate Diagonal Bracing */}
          <line x1="2" y1="14" x2="44" y2="48" stroke="#3d2516" strokeWidth="2" />
          <line x1="2" y1="48" x2="44" y2="14" stroke="#3d2516" strokeWidth="2" />
          <rect x="2" y="14" width="42" height="34" fill="none" stroke="#3d2516" strokeWidth="3" />

          {/* Stacked Iron Ingots on Top */}
          <rect x="8" y="7" width="18" height="7" rx="1" fill="#4a525d" stroke="#1a1d21" strokeWidth="1" />
          <line x1="9" y1="8" x2="25" y2="8" stroke="#788596" strokeWidth="0.8" />
          <rect x="18" y="1" width="18" height="7" rx="1" fill="#3d444e" stroke="#1a1d21" strokeWidth="1" />
          <line x1="19" y1="2" x2="35" y2="2" stroke="#687585" strokeWidth="0.8" />
        </g>
      </g>

      {/* =====================================================================
          LAYER 7: CONTINUOUS SEALED OUTER RIBBON (Prevents Void Bleed)
          ===================================================================== */}
      <OuterRibbon d={outerRibbonPath} />

      
        {/* =====================================================================
            LAYER 8: GRAND TAPROOM BAR & BOTTLE DISPLAY
            ===================================================================== */}
        <g id="grand-taproom">
          {/* L-shaped Bar */}
          <rect x="140" y="320" width="290" height="70" fill="#3d2516" stroke={OUTLINE_COLOR} strokeWidth="2" />
          {/* Bar top */}
          <rect x="140" y="310" width="290" height="10" fill="#4a2e1b" />
          {/* Bottle Shelf */}
          <g transform="translate(150, 330)">
            {/* Row of bottles */}
            {[0,30,60,90,120,150,180,210].map((dx,i)=>(
              <rect key={i} x={dx} y={0} width="12" height="45" fill={["#ff6666","#66ff66","#ffcc66","#6699ff","#cc66ff"][i%5]} />
            ))}
          </g>
          {/* Ambient Shadow under Bar */}
          <ellipse cx="285" cy="380" rx="150" ry="30" fill="rgba(0,0,0,0.25)" />
        </g>

        {/* =====================================================================
            LAYER 9: UPPER MEZZANINE & STAIRCASE
            ===================================================================== */}
        <g id="upper-mezzanine">
          {/* Mezzanine floor with green rug */}
          <rect x="100" y="80" width="400" height="140" fill="url(#cxs-rug-green)" />
          {/* Balustrade */}
          <g transform="translate(100,220)">
            {[0,80,160,240].map((dx,i)=>(
              <g key={i}>
                <rect x={dx} y={0} width="6" height="20" fill="#3d2516" />
                <circle cx={dx+3} cy={22} r="4" fill="#d49b38" />
              </g>
            ))}
          </g>
          {/* Stairs */}
          <g transform="translate(440,140)">
            {[0,40,80].map((dy,i)=>(
              <rect key={i} x={0} y={dy} width="40" height="30" fill="#3d2516" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
            ))}
          </g>
        </g>

        {/* =====================================================================
            LAYER 10: BARREL CELLAR (STONE FLOOR & OAK CASKS)
            ===================================================================== */}
        <g id="barrel-cellar">
          {/* Stone floor */}
          <rect x="580" y="80" width="320" height="160" fill="url(#cxs-bricks-slate)" />
          {/* Oak Casks */}
          <g transform="translate(600,120)">
            {[0,80,160].map((dx,i)=>(
              <g key={i} transform={`translate(${dx},0)`}>
                <ellipse cx={30} cy={30} rx={25} ry={20} fill="#7a4b20" stroke="#3d2516" strokeWidth="1.5" />
                <rect x={15} y={10} width={30} height={40} fill="#8a5a33" />
              </g>
            ))}
          </g>
        </g>

        {/* =====================================================================
            LAYER 11: GAME LOUNGE & BILLIARD TABLE
            ===================================================================== */}
        <g id="game-lounge">
          {/* Billiard Table */}
          <rect x="650" y="360" width="180" height="100" fill="url(#cxs-felt-green)" stroke={OUTLINE_COLOR} strokeWidth="2" />
          {/* Table pockets */}
          {[0,180].map((x,i)=>(
            <circle key={i} cx={x+10} cy={360} r="8" fill="#000" />
          ))}
          {[0,180].map((x,i)=>(
            <circle key={i+2} cx={x+10} cy={460} r="8" fill="#000" />
          ))}
          {[0,100].map((y,i)=>(
            <circle key={i+4} cx={660} cy={360+y} r="8" fill="#000" />
          ))}
          {[0,100].map((y,i)=>(
            <circle key={i+6} cx={820} cy={360+y} r="8" fill="#000" />
          ))}
          {/* Cue stick */}
          <rect x="720" y="370" width="120" height="6" fill="#8c5828" transform="rotate(-10 720 373)" />
          {/* Velvet Sofa */}
          <g transform="translate(810,260)">
            <rect x="0" y="0" width="70" height="60" rx="10" fill="#6b2c5e" />
            <circle cx="15" cy="15" r="5" fill="#c58bba" />
            <circle cx="55" cy="15" r="5" fill="#c58bba" />
          </g>
        </g>

        {/* Front Entrance Threshold Marker (South Wall) */}
      <g transform="translate(300, 514)">
        <rect x="0" y="0" width="70" height="8" rx="2" fill="#d49b38" stroke={OUTLINE_COLOR} strokeWidth="1.5" />
        <line x1="4" y1="3" x2="66" y2="3" stroke="#fef08a" strokeWidth="1" />
      </g>
    </svg>
  );
};

export default NewCottageEngine;
