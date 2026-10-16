import React from 'react';

// Handcrafted architectural SVG backdrop for RealCoopInterior.
// Features multi-zone layout: Roosting Loft (left), Straw Scratch Yard (center),
// Nesting & Brooder Bay (right), and Storage Rafters (back).
// All elements use rich umber outlines (#2A160B) and deep plum cast shadows (rgba(30, 15, 10, 0.4)).

const OUT = '#2A160B';
const SHADOW = 'rgba(30, 15, 10, 0.4)';

export function CoopArchitectureSVG() {
  return (
    <svg 
      className="coop-architecture-svg"
      viewBox="0 0 1000 420"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Horizontal Dark Pine Planks for Back Wall */}
        <pattern id="coop-wall-planks" width="120" height="28" patternUnits="userSpaceOnUse">
          <rect width="120" height="14" fill="#361f12" />
          <rect y="14" width="120" height="14" fill="#2d190e" />
          <path d="M0 0H120M0 14H120M0 28H120" stroke="#1c0f08" strokeWidth="1.5" opacity="0.9" />
          <path d="M40 0V14M90 14V28" stroke="#1c0f08" strokeWidth="1.2" opacity="0.8" />
          <circle cx="20" cy="7" r="1.5" fill="#1c0f08" opacity="0.6" />
          <circle cx="70" cy="21" r="1.5" fill="#1c0f08" opacity="0.6" />
        </pattern>

        {/* Straw Ground Floor with Grain and Fiber Texture */}
        <pattern id="coop-straw-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
          <rect width="80" height="80" fill="#7a4618" />
          <path d="M10 15L25 10M45 20L60 14M15 50L30 45M50 65L70 58M5 75L20 70" stroke="#b8782a" strokeWidth="1.8" strokeLinecap="round" opacity="0.5" />
          <path d="M30 30L42 22M65 40L75 32M25 68L35 60M40 75L55 68" stroke="#f0b448" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
          <circle cx="35" cy="18" r="1.5" fill="#fde047" opacity="0.6" />
          <circle cx="65" cy="52" r="1.2" fill="#fde047" opacity="0.6" />
        </pattern>

        {/* Volumetric Wall Timber Top Cap Gradient */}
        <linearGradient id="coop-timber-cap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a35f29" />
          <stop offset="0.4" stopColor="#7c4217" />
          <stop offset="1" stopColor="#4a240a" />
        </linearGradient>

        {/* Warm Golden Sunbeam Gradient */}
        <linearGradient id="coop-sunbeam-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(254, 240, 138, 0.32)" />
          <stop offset="0.45" stopColor="rgba(245, 158, 11, 0.12)" />
          <stop offset="1" stopColor="rgba(245, 158, 11, 0)" />
        </linearGradient>

        {/* Soft Shadow Filter */}
        <filter id="coop-shadow-blur" x="-20%" y="-20%" width="140%" height="150%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="coop-light-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* 1. Upper Back Wall */}
      <rect x="0" y="0" width="1000" height="150" fill="url(#coop-wall-planks)" />
      
      {/* 2. Heavy Contact Shadow under Upper Wall */}
      <rect x="0" y="145" width="1000" height="24" fill={SHADOW} filter="url(#coop-shadow-blur)" />

      {/* 3. Straw Floor Body with Warm Vignette */}
      <rect x="0" y="150" width="1000" height="270" fill="url(#coop-straw-pattern)" />
      
      {/* Straw floor depth shading: darker in corners and under walls */}
      <rect x="0" y="150" width="1000" height="270" fill="url(#coop-wall-planks)" opacity="0.15" />
      <radialGradient id="coop-floor-ambient" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stopColor="transparent" />
        <stop offset="70%" stopColor="rgba(30, 15, 10, 0.25)" />
        <stop offset="100%" stopColor="rgba(20, 10, 5, 0.65)" />
      </radialGradient>
      <rect x="0" y="150" width="1000" height="270" fill="url(#coop-floor-ambient)" />

      {/* 4. Architectural Heavy Timber Beams (Top Crown Rafter) */}
      <rect x="0" y="0" width="1000" height="18" fill="url(#coop-timber-cap)" stroke={OUT} strokeWidth="2" />
      <path d="M0 4H1000" stroke="rgba(255, 230, 180, 0.4)" strokeWidth="1.2" />

      {/* Vertical support posts on left and right borders */}
      <rect x="4" y="18" width="22" height="402" fill="url(#coop-timber-cap)" stroke={OUT} strokeWidth="2" />
      <rect x="974" y="18" width="22" height="402" fill="url(#coop-timber-cap)" stroke={OUT} strokeWidth="2" />

      {/* 5. ZONE DIVIDER A (Left Roosting Niche Divider Wall) */}
      {/* Shadow */}
      <rect x="235" y="60" width="16" height="360" fill={SHADOW} filter="url(#coop-shadow-blur)" />
      {/* Timber Post */}
      <g>
        <rect x="228" y="50" width="18" height="370" fill="url(#coop-timber-cap)" stroke={OUT} strokeWidth="2.2" />
        <path d="M231 52V418" stroke="rgba(255, 220, 160, 0.35)" strokeWidth="1" />
        {/* Carved archway bracket */}
        <path d="M228 85 Q195 85 195 120 L228 120Z" fill="#5c3013" stroke={OUT} strokeWidth="2" />
      </g>

      {/* 6. ZONE DIVIDER B (Right Nesting & Incubator Bay Divider Wall) */}
      {/* Shadow */}
      <rect x="615" y="60" width="16" height="360" fill={SHADOW} filter="url(#coop-shadow-blur)" />
      {/* Timber Post */}
      <g>
        <rect x="608" y="50" width="18" height="370" fill="url(#coop-timber-cap)" stroke={OUT} strokeWidth="2.2" />
        <path d="M611 52V418" stroke="rgba(255, 220, 160, 0.35)" strokeWidth="1" />
        {/* Carved archway bracket */}
        <path d="M626 85 Q658 85 658 120 L626 120Z" fill="#5c3013" stroke={OUT} strokeWidth="2" />
      </g>

      {/* 7. Micro-Detailing Assets */}
      {/* Feed Pantry Corner (Far Left): Barrels and Sacks */}
      <g id="coop-feed-storage" transform="translate(36, 175)">
        {/* Cast shadow under barrels */}
        <ellipse cx="32" cy="190" rx="36" ry="12" fill={SHADOW} filter="url(#coop-shadow-blur)" />
        
        {/* Grain Sack */}
        <path d="M5 190 Q-2 165 8 152 L12 146 Q18 150 24 146 L28 152 Q38 165 31 190Z" fill="#c7b084" stroke={OUT} strokeWidth="2" />
        <path d="M12 147H24" stroke="#85481d" strokeWidth="2" />
        
        {/* Big Feed Barrel */}
        <path d="M22 135 Q16 158 20 188 Q40 196 60 188 Q64 158 58 135Z" fill="#6d3916" stroke={OUT} strokeWidth="2.2" />
        <ellipse cx="40" cy="135" rx="18" ry="7" fill="#8f4f22" stroke={OUT} strokeWidth="2" />
        <path d="M18 152Q40 160 62 152M19 172Q40 180 61 172" fill="none" stroke="#2a160b" strokeWidth="3" />
        
        {/* Grain scoop / shovel leaning */}
        <line x1="68" y1="130" x2="52" y2="192" stroke="#a35f29" strokeWidth="4" strokeLinecap="round" />
        <path d="M66 125L75 132L69 138Z" fill="#9ca3af" stroke={OUT} strokeWidth="1.5" />
      </g>

      {/* Hanging garlic & dried corn braids on rafters */}
      <g id="coop-dried-provisions" transform="translate(130, 18)">
        <path d="M0 0V26" stroke="#85481d" strokeWidth="2" />
        <circle cx="0" cy="28" r="6" fill="#f8fafc" stroke={OUT} strokeWidth="1.2" />
        <circle cx="-4" cy="38" r="6" fill="#f8fafc" stroke={OUT} strokeWidth="1.2" />
        <circle cx="4" cy="38" r="6" fill="#f8fafc" stroke={OUT} strokeWidth="1.2" />
        
        <path d="M35 0V32" stroke="#85481d" strokeWidth="2" />
        <ellipse cx="35" cy="40" rx="5" ry="11" fill="#eab308" stroke={OUT} strokeWidth="1.2" />
        <path d="M33 34H37M32 40H38M33 46H37" stroke="#ca8a04" strokeWidth="1" />
      </g>

      {/* Additional Herb Braid in Center Rafter */}
      <g transform="translate(480, 18)">
        <path d="M0 0V22" stroke="#85481d" strokeWidth="1.8" />
        <ellipse cx="0" cy="30" rx="4.5" ry="10" fill="#eab308" stroke={OUT} strokeWidth="1.2" />
        <path d="M25 0V26" stroke="#85481d" strokeWidth="1.8" />
        <ellipse cx="25" cy="34" rx="4.5" ry="10" fill="#f59e0b" stroke={OUT} strokeWidth="1.2" />
      </g>

      {/* 8. Volumetric Sunbeam pouring from Window */}
      <polygon 
        points="460,25 540,25 640,420 380,420" 
        fill="url(#coop-sunbeam-grad)" 
        style={{ mixBlendMode: 'screen', filter: 'blur(8px)' }} 
      />

      {/* 9. Warm Pools of Golden Light */}
      {/* Center sunlight pool */}
      <ellipse cx="500" cy="270" rx="140" ry="65" fill="#fef08a" opacity="0.14" style={{ mixBlendMode: 'screen' }} />
      {/* Brooder heat lamp pool (right bay) */}
      <ellipse cx="890" cy="220" rx="75" ry="40" fill="#fb7185" opacity="0.22" style={{ mixBlendMode: 'screen' }} />
      {/* Lantern light pools (left & right walls) */}
      <ellipse cx="60" cy="180" rx="60" ry="45" fill="#f59e0b" opacity="0.18" style={{ mixBlendMode: 'screen' }} />
      <ellipse cx="940" cy="180" rx="60" ry="45" fill="#f59e0b" opacity="0.18" style={{ mixBlendMode: 'screen' }} />
    </svg>
  );
}
