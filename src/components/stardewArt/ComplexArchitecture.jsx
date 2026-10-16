import React from 'react';

// "Ant-farm" architecture for the institution complex: void, floors, volumetric walls, door frames,
// and a dense set of vector props. Everything is in the complex's origin space (hall top-left = 0,0).
// Purely visual: no state, no handlers.

const OUT = '#2A160B';                      // rich umber outline
const SHADOW = 'rgba(30, 15, 10, 0.4)';     // heavy dark-plum cast shadow
const VOID = '#120a07';

const W = 1900;
const H = 1180;
const PAD = 120;

const FLOORS = [
  { id: 'hall', x: 0, y: 0, w: 960, h: 520, fill: 'url(#cx-planks-v)' },
  { id: 'eastdoor', x: 960, y: 296, w: 30, h: 88, fill: 'url(#cx-planks-h)' },
  { id: 'corridor', x: 986, y: 300, w: 514, h: 80, fill: 'url(#cx-planks-h)' },
  { id: 'northdoor', x: 1195, y: 262, w: 80, h: 38, fill: 'url(#cx-planks-h)' },
  { id: 'north', x: 1050, y: 120, w: 390, h: 142, fill: 'url(#cx-planks-d)' },
  { id: 'southdoor', x: 1325, y: 380, w: 80, h: 38, fill: 'url(#cx-planks-h)' },
  { id: 'south', x: 1050, y: 418, w: 390, h: 142, fill: 'url(#cx-planks-h)' },
  { id: 'alcovedoor', x: 1500, y: 310, w: 30, h: 60, fill: 'url(#cx-planks-h)' },
  { id: 'alcove', x: 1530, y: 270, w: 150, h: 140, fill: 'url(#cx-planks-d)' },
  { id: 'stairs', x: 100, y: 520, w: 100, h: 212, fill: 'url(#cx-planks-v)' },
  { id: 'cellar', x: 40, y: 732, w: 390, h: 188, fill: 'url(#cx-stone)' }
];

// Thick dividers: cap + visible south face (walls that separate two rooms)
const BANDS = [
  [986, 262, 209, 38], [1275, 262, 255, 38],      // corridor north wall (north-room door gap between)
  [986, 380, 339, 38], [1405, 380, 125, 38],      // corridor south wall (south-room door gap between)
  [14, 700, 86, 32], [200, 700, 256, 32]          // cellar north wall (stair gap between)
];

// Outer / side walls: cap only
const CAPS = [
  [-26, -26, 1012, 26], [-26, -26, 26, 572],
  [960, -26, 26, 322], [960, 384, 26, 162],
  [-26, 520, 126, 26], [200, 520, 250, 26], [545, 520, 441, 26],
  [1024, 94, 26, 206], [1440, 94, 26, 206], [1024, 94, 442, 26],
  [1024, 418, 26, 168], [1440, 418, 26, 168], [1024, 560, 442, 26],
  [1500, 244, 206, 26], [1500, 410, 206, 26], [1680, 244, 26, 192],
  [1500, 300, 30, 10], [1500, 370, 30, 10],
  [74, 546, 26, 186], [200, 546, 26, 186],
  [14, 700, 26, 246], [430, 700, 26, 246], [14, 920, 442, 26]
];

const Defs = () => (
  <defs>
    {/* Vertical hall planks */}
    <pattern id="cx-planks-v" width="64" height="140" patternUnits="userSpaceOnUse">
      <rect width="32" height="140" fill="#c47c2c" />
      <rect x="32" width="32" height="140" fill="#b9701f" />
      <rect x="0" y="0" width="32" height="70" fill="rgba(255, 220, 150, 0.07)" />
      <rect x="32" y="70" width="32" height="70" fill="rgba(255, 220, 150, 0.07)" />
      <path d="M0 0V140M32 0V140M64 0V140" stroke="#6e3a12" strokeWidth="1.6" opacity="0.8" />
      <path d="M0 70H32M32 35H64M32 105H64" stroke="#6e3a12" strokeWidth="1.2" opacity="0.7" />
      <path d="M9 6V60M22 14V50M43 80V132M54 88V120" stroke="#8a4d18" strokeWidth="0.8" opacity="0.55" />
      <circle cx="16" cy="102" r="2.2" fill="#7a410f" opacity="0.6" />
      <circle cx="48" cy="22" r="2" fill="#7a410f" opacity="0.6" />
    </pattern>
    {/* Horizontal corridor planks */}
    <pattern id="cx-planks-h" width="140" height="48" patternUnits="userSpaceOnUse">
      <rect width="140" height="24" fill="#b8721f" />
      <rect y="24" width="140" height="24" fill="#c47c2a" />
      <path d="M0 0H140M0 24H140M0 48H140" stroke="#6e3a12" strokeWidth="1.6" opacity="0.8" />
      <path d="M70 0V24M20 24V48M110 24V48" stroke="#6e3a12" strokeWidth="1.2" opacity="0.7" />
      <path d="M8 8H60M80 14H128M30 34H96M104 40H134" stroke="#8a4d18" strokeWidth="0.8" opacity="0.55" />
    </pattern>
    {/* Darker herringbone-ish boards for the nested rooms */}
    <pattern id="cx-planks-d" width="96" height="48" patternUnits="userSpaceOnUse">
      <rect width="96" height="24" fill="#8f4f1d" />
      <rect y="24" width="96" height="24" fill="#9b5821" />
      <path d="M0 0H96M0 24H96M0 48H96" stroke="#3e1f0a" strokeWidth="1.6" opacity="0.85" />
      <path d="M48 0V24M16 24V48M80 24V48" stroke="#3e1f0a" strokeWidth="1.2" opacity="0.75" />
      <path d="M6 9H38M58 15H90M20 35H66" stroke="#6e3a12" strokeWidth="0.8" opacity="0.6" />
    </pattern>
    {/* Cellar flagstones */}
    <pattern id="cx-stone" width="64" height="64" patternUnits="userSpaceOnUse">
      <rect width="64" height="64" fill="#594638" />
      <rect x="2" y="2" width="28" height="28" rx="3" fill="#675141" />
      <rect x="34" y="2" width="28" height="28" rx="3" fill="#5d493b" />
      <rect x="2" y="34" width="28" height="28" rx="3" fill="#5f4a3b" />
      <rect x="34" y="34" width="28" height="28" rx="3" fill="#6a5443" />
      <path d="M0 32H64M32 0V64" stroke="#2c211a" strokeWidth="2.2" />
    </pattern>
    {/* Wall front face: vertical wainscot */}
    <pattern id="cx-wainscot" width="16" height="40" patternUnits="userSpaceOnUse">
      <rect width="16" height="40" fill="#8e4c1d" />
      <path d="M0 0V40M16 0V40" stroke="#4a2409" strokeWidth="1.6" />
      <path d="M5 4V30M11 10V36" stroke="#b36a30" strokeWidth="0.7" opacity="0.6" />
    </pattern>
    <linearGradient id="cx-wall-cap" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f0c27c" />
      <stop offset="0.45" stopColor="#d6954f" />
      <stop offset="1" stopColor="#a8672a" />
    </linearGradient>
    <linearGradient id="cx-wall-face" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="rgba(30,15,10,0)" />
      <stop offset="1" stopColor="rgba(30,15,10,0.45)" />
    </linearGradient>
    <linearGradient id="cx-wood-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#c98a45" />
      <stop offset="1" stopColor="#8f5223" />
    </linearGradient>
    <linearGradient id="cx-wood-front" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#7d4118" />
      <stop offset="1" stopColor="#4a230a" />
    </linearGradient>
    <radialGradient id="cx-barrel-top" cx="0.4" cy="0.35" r="0.8">
      <stop offset="0" stopColor="#d9a05a" />
      <stop offset="1" stopColor="#8a5223" />
    </radialGradient>
    <radialGradient id="cx-crystal-glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="rgba(255, 236, 170, 0.95)" />
      <stop offset="0.5" stopColor="rgba(255, 190, 90, 0.35)" />
      <stop offset="1" stopColor="rgba(255, 170, 60, 0)" />
    </radialGradient>
    <filter id="cx-soft-shadow" x="-20%" y="-20%" width="140%" height="160%">
      <feGaussianBlur stdDeviation="4" />
    </filter>
    <filter id="cx-edge-blur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    {FLOORS.map(f => (
      <clipPath id={`cx-clip-${f.id}`} key={f.id}>
        <rect x={f.x} y={f.y} width={f.w} height={f.h} />
      </clipPath>
    ))}
  </defs>
);

// --- Prop helpers (all outlined in umber, each with a cast shadow) -------------------------------

const Shadow = ({ x, y, rx, ry }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={SHADOW} filter="url(#cx-soft-shadow)" />
);

const Barrel = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={6} y={22} rx={20} ry={8} />
    <path d="M-16 -6 Q-20 8 -16 22 Q0 28 16 22 Q20 8 16 -6Z" fill="url(#cx-wood-front)" stroke={OUT} strokeWidth="2" />
    <path d="M-8 -4V24M0 -4V26M8 -4V24" stroke="#2a160b" strokeWidth="0.9" opacity="0.6" />
    <path d="M-18 4Q0 10 18 4M-17 16Q0 22 17 16" fill="none" stroke="#3a3a3a" strokeWidth="2.6" />
    <path d="M-18 4Q0 10 18 4M-17 16Q0 22 17 16" fill="none" stroke="#9aa0a6" strokeWidth="0.8" opacity="0.7" />
    <ellipse cx="0" cy="-6" rx="16" ry="7" fill="url(#cx-barrel-top)" stroke={OUT} strokeWidth="2" />
    <ellipse cx="0" cy="-6" rx="10" ry="4" fill="none" stroke="#5c3414" strokeWidth="0.9" />
    <circle cx="-3" cy="-7" r="1.6" fill="#3a1d08" />
  </g>
);

const Crate = ({ x, y, w = 34, h = 26, tint = '#a66a2e' }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={w / 2 + 4} y={h + 6} rx={w * 0.62} ry={7} />
    <rect y="8" width={w} height={h - 8} fill="url(#cx-wood-front)" stroke={OUT} strokeWidth="2" />
    <path d={`M0 8 L8 0 H${w + 8} L${w} 8Z`} fill={tint} stroke={OUT} strokeWidth="2" />
    <path d={`M${w} 8 L${w + 8} 0 V${h - 8} L${w} ${h}Z`} fill="#6e3a12" stroke={OUT} strokeWidth="2" />
    <path d={`M6 12V${h - 3}M${w - 6} 12V${h - 3}`} stroke={OUT} strokeWidth="1.4" opacity="0.7" />
    <path d={`M2 ${h - 4}L${w - 2} 12`} stroke={OUT} strokeWidth="1.4" opacity="0.6" />
  </g>
);

const Sack = ({ x, y, color = '#d8c394' }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={2} y={22} rx={17} ry={6} />
    <path d="M-14 22 Q-18 6 -8 -4 L-6 -10 Q0 -6 6 -10 L8 -4 Q18 6 14 22Z" fill={color} stroke={OUT} strokeWidth="2" />
    <path d="M-6 -8 Q0 -2 6 -8" fill="none" stroke={OUT} strokeWidth="1.6" />
    <path d="M-6 -9H6" stroke="#7a3d12" strokeWidth="2.4" />
    <path d="M-8 6Q0 12 8 6" fill="none" stroke="rgba(42,22,11,0.35)" strokeWidth="1.2" />
  </g>
);

const FloorLamp = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={4} y={4} rx={14} ry={5} />
    <rect x="-2.5" y="-40" width="5" height="44" fill="#4a3a2a" stroke={OUT} strokeWidth="1.6" />
    <ellipse cx="0" cy="3" rx="10" ry="4" fill="#5d4630" stroke={OUT} strokeWidth="1.6" />
    <path d="M-12 -40 L-8 -58 H8 L12 -40Z" fill="#f6d58a" stroke={OUT} strokeWidth="2" />
    <path d="M-5 -56L-6 -42M5 -56L6 -42" stroke="#c59a3d" strokeWidth="1" opacity="0.7" />
  </g>
);

const Candle = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-2.5" y="-9" width="5" height="9" rx="1" fill="#f7efd9" stroke={OUT} strokeWidth="1.2" />
    <path d="M0 -10Q-3 -15 0 -20Q3 -15 0 -10Z" fill="#ffc94d" stroke="#d97706" strokeWidth="0.8" />
  </g>
);

const Plant = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={4} y={16} rx={16} ry={6} />
    <path d="M-10 -2H10L8 16H-8Z" fill="#c4572f" stroke={OUT} strokeWidth="2" />
    <rect x="-11" y="-5" width="22" height="5" rx="1.5" fill="#d96a3a" stroke={OUT} strokeWidth="2" />
    <path d="M0 -6C-14 -14 -22 -28 -16 -40C-8 -34 -2 -22 0 -6Z" fill="#4f8f33" stroke={OUT} strokeWidth="1.8" />
    <path d="M0 -6C14 -14 22 -28 16 -40C8 -34 2 -22 0 -6Z" fill="#5fa23a" stroke={OUT} strokeWidth="1.8" />
    <path d="M0 -6C-3 -20 -2 -34 0 -48C4 -34 3 -20 0 -6Z" fill="#6bb344" stroke={OUT} strokeWidth="1.8" />
  </g>
);

const Rug = ({ x, y, w, h, c1 = '#8b2c25', c2 = '#e7c27a', round = false }) => (
  <g>
    <Shadow x={x + w / 2 + 2} y={y + h / 2 + 6} rx={w / 2} ry={h / 2} />
    {round ? (
      <>
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2} fill={c1} stroke={OUT} strokeWidth="2.4" />
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2 - 8} ry={h / 2 - 8} fill="none" stroke={c2} strokeWidth="2.2" strokeDasharray="6 4" />
        <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 4} ry={h / 4} fill="none" stroke={c2} strokeWidth="2" />
        <path d={`M${x + w / 2} ${y + h * 0.28}l8 ${h * 0.22}l-8 ${h * 0.22}l-8 -${h * 0.22}Z`} fill={c2} opacity="0.85" />
      </>
    ) : (
      <>
        <rect x={x} y={y} width={w} height={h} rx="4" fill={c1} stroke={OUT} strokeWidth="2.4" />
        <rect x={x + 6} y={y + 6} width={w - 12} height={h - 12} rx="2" fill="none" stroke={c2} strokeWidth="2" />
        <rect x={x + 12} y={y + 12} width={w - 24} height={h - 24} rx="2" fill="none" stroke={c2} strokeWidth="1" strokeDasharray="5 4" />
        {Array.from({ length: Math.floor(w / 22) }).map((_, i) => (
          <path key={i} d={`M${x + 11 + i * 22} ${y + h / 2 - 4}l5 4l-5 4l-5 -4Z`} fill={c2} opacity="0.85" />
        ))}
      </>
    )}
  </g>
);

const Bookcase = ({ x, y, w = 120, h = 50 }) => {
  const colors = ['#9c2f2f', '#2f5f8f', '#3f7a3a', '#c79a2a', '#6b3a8a', '#b4542a', '#2c6f6a'];
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shadow x={w / 2 + 3} y={h + 4} rx={w / 2 + 4} ry={7} />
      <rect width={w} height={h} fill="#5b2d0f" stroke={OUT} strokeWidth="2.2" />
      {[0, 1].map(row => (
        <g key={row} transform={`translate(4 ${5 + row * 22})`}>
          <rect width={w - 8} height="18" fill="#2c1507" />
          {Array.from({ length: Math.floor((w - 12) / 8) }).map((_, i) => (
            <rect
              key={i}
              x={2 + i * 8}
              y={3 + ((i * 5 + row * 3) % 4)}
              width="6"
              height={15 - ((i * 5 + row * 3) % 4)}
              fill={colors[(i * 3 + row * 2) % colors.length]}
              stroke={OUT}
              strokeWidth="0.9"
            />
          ))}
        </g>
      ))}
      <rect y={h - 2} width={w} height="4" fill="#8f5223" stroke={OUT} strokeWidth="1.6" />
    </g>
  );
};

const WineRack = ({ x, y, w = 110, h = 52 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={w / 2 + 3} y={h + 4} rx={w / 2} ry={7} />
    <rect width={w} height={h} fill="#4a230a" stroke={OUT} strokeWidth="2.2" />
    {Array.from({ length: 6 }).map((_, i) =>
      Array.from({ length: 3 }).map((__, j) => (
        <g key={`${i}-${j}`}>
          <circle cx={10 + i * 18} cy={9 + j * 15} r="6" fill="#2a160b" stroke="#7a4d22" strokeWidth="1" />
          <circle cx={10 + i * 18} cy={9 + j * 15} r="3.4" fill={['#6d1f2f', '#8b3a2a', '#3f5a2f'][(i + j) % 3]} />
        </g>
      ))
    )}
  </g>
);

const Counter = ({ x, y, w = 200, h = 46 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={w / 2 + 4} y={h + 6} rx={w / 2 + 6} ry={9} />
    <rect y="14" width={w} height={h - 14} fill="url(#cx-wood-front)" stroke={OUT} strokeWidth="2.4" />
    {Array.from({ length: Math.floor(w / 50) }).map((_, i) => (
      <rect key={i} x={8 + i * 50} y="20" width="40" height={h - 26} rx="2" fill="none" stroke="#c98a45" strokeWidth="1.2" opacity="0.65" />
    ))}
    <rect width={w} height="16" rx="3" fill="url(#cx-wood-top)" stroke={OUT} strokeWidth="2.4" />
    <path d={`M4 4H${w - 4}`} stroke="#f0c27c" strokeWidth="1.2" opacity="0.7" />
  </g>
);

const Stool = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={3} y={14} rx={11} ry={4} />
    <path d="M-7 3L-9 14M7 3L9 14M0 3V14" stroke={OUT} strokeWidth="2" />
    <ellipse cx="0" cy="0" rx="11" ry="5.5" fill="#b4542a" stroke={OUT} strokeWidth="2" />
    <ellipse cx="-2" cy="-1" rx="6" ry="2.2" fill="rgba(255,255,255,0.22)" />
  </g>
);

const RoundTable = ({ x, y, r = 24, candle = true }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={5} y={r * 0.6 + 8} rx={r + 4} ry={r * 0.45} />
    <path d={`M0 0V${r * 0.7}`} stroke={OUT} strokeWidth="5" />
    <ellipse cx="0" cy={r * 0.7 + 2} rx={r * 0.5} ry={r * 0.2} fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
    <ellipse cx="0" cy="3" rx={r} ry={r * 0.55} fill="#6e3a12" stroke={OUT} strokeWidth="2.2" />
    <ellipse cx="0" cy="0" rx={r} ry={r * 0.55} fill="url(#cx-wood-top)" stroke={OUT} strokeWidth="2.2" />
    <ellipse cx="0" cy="0" rx={r * 0.62} ry={r * 0.32} fill="none" stroke="#f0c27c" strokeWidth="1" opacity="0.55" />
    {candle && <Candle x={0} y={-2} />}
  </g>
);

const Pedestal = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={5} y={24} rx={24} ry={8} />
    <path d="M-16 24H16L12 4H-12Z" fill="#6b5a4a" stroke={OUT} strokeWidth="2.2" />
    <path d="M-14 8H14M-15 16H15" stroke={OUT} strokeWidth="1" opacity="0.5" />
    <rect x="-18" y="-4" width="36" height="10" rx="2" fill="#9a8672" stroke={OUT} strokeWidth="2.2" />
    <path d="M0 -34 L10 -18 L0 -4 L-10 -18Z" fill="#ffe08a" stroke={OUT} strokeWidth="2" />
    <path d="M0 -34 L0 -4M-10 -18H10" stroke="#fff6cf" strokeWidth="1" opacity="0.8" />
  </g>
);

const Globe = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={4} y={20} rx={16} ry={6} />
    <path d="M-10 22L0 12L10 22Z" fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
    <circle cx="0" cy="-2" r="15" fill="#4b86b4" stroke={OUT} strokeWidth="2.2" />
    <path d="M-9 -8Q-2 -14 4 -8Q0 -2 -6 -1Q-12 -2 -9 -8Z M3 3Q10 0 12 6Q8 11 3 8Z" fill="#6aa15a" stroke={OUT} strokeWidth="1" />
    <path d="M-14 -2A15 15 0 0 0 14 -2" fill="none" stroke="#c98a45" strokeWidth="2" />
  </g>
);

const Bench = ({ x, y, w = 90 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={w / 2 + 3} y={22} rx={w / 2 + 3} ry={6} />
    <rect y="0" width={w} height="12" rx="3" fill="url(#cx-wood-top)" stroke={OUT} strokeWidth="2.2" />
    <rect y="12" width={w} height="6" fill="#6e3a12" stroke={OUT} strokeWidth="2" />
    <path d={`M8 18V26M${w - 8} 18V26`} stroke={OUT} strokeWidth="4" />
    <rect x="3" y="-14" width={w - 6} height="12" rx="3" fill="#7d4118" stroke={OUT} strokeWidth="2.2" />
  </g>
);

const Shelf = ({ x, y, w = 110 }) => (
  <g transform={`translate(${x} ${y})`}>
    <Shadow x={w / 2 + 3} y={34} rx={w / 2 + 3} ry={6} />
    <rect width={w} height="30" fill="#4a230a" stroke={OUT} strokeWidth="2.2" />
    <rect x="3" y="3" width={w - 6} height="11" fill="#2c1507" />
    <rect x="3" y="17" width={w - 6} height="10" fill="#2c1507" />
    {Array.from({ length: Math.floor((w - 12) / 14) }).map((_, i) => (
      <g key={i}>
        <rect x={6 + i * 14} y="5" width="9" height="9" rx="2" fill={['#c4572f', '#d8a23a', '#6b8f5a', '#7a5ca8'][i % 4]} stroke={OUT} strokeWidth="1" />
        <rect x={7 + i * 14} y="19" width="11" height="8" fill={['#e7d7b0', '#9fb5c4', '#c9a071'][i % 3]} stroke={OUT} strokeWidth="1" />
      </g>
    ))}
  </g>
);

const Torch = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-3" y="-4" width="6" height="22" fill="#4a230a" stroke={OUT} strokeWidth="1.8" />
    <path d="M-7 -4H7L5 -10H-5Z" fill="#6b6b6b" stroke={OUT} strokeWidth="1.8" />
    <path d="M0 -10Q-9 -20 0 -34Q9 -20 0 -10Z" fill="#ff9a2e" stroke={OUT} strokeWidth="1.4" />
    <path d="M0 -12Q-4 -20 0 -27Q4 -20 0 -12Z" fill="#ffe08a" />
  </g>
);

const WallSconce = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-7" y="0" width="14" height="5" rx="1.5" fill="#6e5a3a" stroke={OUT} strokeWidth="1.6" />
    <path d="M-5 0L-6 -9H6L5 0Z" fill="#fde7a0" stroke={OUT} strokeWidth="1.6" />
    <path d="M0 -9Q-4 -15 0 -21Q4 -15 0 -9Z" fill="#ffc94d" stroke="#d97706" strokeWidth="0.8" />
  </g>
);

const Frame = ({ x, y, w = 30, h = 22, hue = '#6aa15a' }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} fill="#6e3a12" stroke={OUT} strokeWidth="1.8" />
    <rect x="3" y="3" width={w - 6} height={h - 6} fill="#cfe4ee" />
    <path d={`M3 ${h - 3}L${w * 0.4} ${h * 0.45}L${w * 0.65} ${h * 0.7}L${w - 3} ${h * 0.35}V${h - 3}Z`} fill={hue} />
  </g>
);

// Wooden door frame at an opening: posts on both sides + brass threshold
const DoorFrame = ({ x, y, w, h, vertical = false }) => (
  <g>
    {vertical ? (
      <>
        <rect x={x - 3} y={y - 8} width={w + 6} height="9" rx="2" fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
        <rect x={x - 3} y={y + h - 1} width={w + 6} height="9" rx="2" fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
        <rect x={x + w / 2 - 1.5} y={y + 4} width="3" height={h - 8} fill="#d8b04a" opacity="0.6" />
      </>
    ) : (
      <>
        <rect x={x - 8} y={y - 3} width="9" height={h + 6} rx="2" fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
        <rect x={x + w - 1} y={y - 3} width="9" height={h + 6} rx="2" fill="#5b2d0f" stroke={OUT} strokeWidth="2" />
        <rect x={x + 4} y={y + h / 2 - 1.5} width={w - 8} height="3" fill="#d8b04a" opacity="0.6" />
      </>
    )}
  </g>
);

// Volumetric walls ---------------------------------------------------------------------------------

const WallCap = ({ r }) => {
  const [x, y, w, h] = r;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x={x + 2} y={y + 2} width={Math.max(0, w - 4)} height="3" fill="rgba(255, 240, 200, 0.55)" />
      <rect x={x + 2} y={y + h - 5} width={Math.max(0, w - 4)} height="3" fill="rgba(60, 28, 8, 0.4)" />
    </g>
  );
};

const WallBand = ({ r }) => {
  const [x, y, w, h] = r;
  const cap = 14;
  return (
    <g>
      <rect x={x} y={y + cap - 2} width={w} height={h - cap + 2} fill="url(#cx-wainscot)" stroke={OUT} strokeWidth="2.4" />
      <rect x={x} y={y + cap - 2} width={w} height={h - cap + 2} fill="url(#cx-wall-face)" />
      <rect x={x} y={y + h - 8} width={w} height="6" fill="#4a2409" stroke={OUT} strokeWidth="1.6" />
      <rect x={x} y={y} width={w} height={cap} fill="url(#cx-wall-cap)" stroke={OUT} strokeWidth="2.4" strokeLinejoin="round" />
      <rect x={x + 2} y={y + 2} width={Math.max(0, w - 4)} height="3" fill="rgba(255, 240, 200, 0.55)" />
    </g>
  );
};

// ------------------------------------------------------------------------------------------------

export function ComplexArchitectureSVG() {
  return (
    <svg
      className="complex-architecture-svg"
      width={W}
      height={H}
      viewBox={`${-PAD} ${-PAD} ${W} ${H}`}
      style={{ position: 'absolute', left: -PAD, top: -PAD, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Defs />

      {/* 1. The void */}
      <rect x={-PAD} y={-PAD} width={W} height={H} fill={VOID} />

      {/* 2. Floors with baked edge occlusion */}
      {FLOORS.map(f => (
        <g key={f.id}>
          <rect x={f.x} y={f.y} width={f.w} height={f.h} fill={f.fill} />
          <g clipPath={`url(#cx-clip-${f.id})`}>
            <rect
              x={f.x} y={f.y} width={f.w} height={f.h}
              fill="none" stroke="rgba(30, 15, 10, 0.55)" strokeWidth="30" filter="url(#cx-edge-blur)"
            />
          </g>
        </g>
      ))}

      {/* 3. Wall cast shadows (heavy dark plum, offset downwards) */}
      <g fill={SHADOW} filter="url(#cx-soft-shadow)">
        {[...BANDS, ...CAPS].map((r, i) => (
          <rect key={i} x={r[0] + 2} y={r[1] + r[3] - 6} width={r[2]} height={Math.min(22, r[3] + 8)} />
        ))}
      </g>

      {/* 4. Annex floor dressing (rugs under props) */}
      {/* Corridor runner + door mats */}
      <Rug x={1010} y={322} w={470} h={36} c1="#7a2420" c2="#e7c27a" />
      <Rug x={1100} y={160} w={290} h={78} c1="#2f4a63" c2="#e7c27a" />
      <Rug x={1090} y={456} w={250} h={36} c1="#6b2630" c2="#e7c27a" />
      <Rug x={1555} y={296} w={100} h={86} c1="#4b2a63" c2="#f0d27a" round />
      <Rug x={150 - 36} y={560} w={72} h={120} c1="#7a2420" c2="#e7c27a" />
      <Rug x={110} y={800} w={190} h={64} c1="#5a3a22" c2="#d8b04a" />
      {/* Hall: carpet runner leading to the east door */}
      <Rug x={700} y={332} w={250} h={34} c1="#7a2420" c2="#e7c27a" />

      {/* 5. Walls: bands (cap + face) then caps */}
      {BANDS.map((r, i) => <WallBand key={`b${i}`} r={r} />)}
      {CAPS.map((r, i) => <WallCap key={`c${i}`} r={r} />)}

      {/* Door frames at every opening */}
      <DoorFrame x={960} y={296} w={26} h={88} vertical={false} />
      <DoorFrame x={1195} y={262} w={80} h={38} vertical />
      <DoorFrame x={1325} y={380} w={80} h={38} vertical />
      <DoorFrame x={1500} y={310} w={30} h={60} />
      <DoorFrame x={100} y={520} w={100} h={26} vertical />
      <DoorFrame x={100} y={700} w={100} h={32} vertical />

      {/* Pictures + sconces on the visible wall faces */}
      <Frame x={1030} y={272} hue="#6aa15a" />
      <Frame x={1100} y={272} w={26} h={20} hue="#c9a071" />
      <Frame x={1300} y={272} w={34} h={22} hue="#7aa5c4" />
      <Frame x={1440} y={272} w={26} h={20} hue="#d98c4a" />
      <WallSconce x={1160} y={280} />
      <WallSconce x={1480} y={282} />
      <Frame x={1070} y={390} w={34} h={22} hue="#c9a071" />
      <Frame x={1235} y={390} w={28} h={20} hue="#6aa15a" />
      <WallSconce x={1160} y={398} />
      <WallSconce x={1450} y={398} />
      <WallSconce x={60} y={712} />
      <WallSconce x={250} y={712} />
      <WallSconce x={380} y={712} />

      {/* 6. HALL dressing along the (non-walkable) edge strips */}
      <Barrel x={22} y={318} s={0.9} />
      <Barrel x={24} y={364} s={0.9} />
      <Crate x={6} y={452} w={34} />
      <Sack x={26} y={500} />
      <Bench x={236} y={484} w={110} />
      <Shelf x={600} y={484} w={120} />
      <Plant x={750} y={500} s={0.9} />
      <FloorLamp x={820} y={502} />
      <Crate x={868} y={470} w={30} h={24} />
      <Barrel x={928} y={486} s={0.85} />
      <Plant x={938} y={420} s={0.95} />
      <FloorLamp x={934} y={176} />
      <FloorLamp x={30} y={176} />

      {/* NORTH ARCHIVE (nested reading room) */}
      <Bookcase x={1066} y={122} w={118} h={44} />
      <Bookcase x={1190} y={122} w={118} h={44} />
      <Bookcase x={1314} y={122} w={110} h={44} />
      <Globe x={1086} y={206} />
      <RoundTable x={1245} y={200} r={26} />
      <Stool x={1215} y={226} />
      <Stool x={1276} y={226} />
      <Crate x={1384} y={196} w={30} h={24} tint="#b57a38" />
      <FloorLamp x={1424} y={176} />
      <Plant x={1070} y={168} s={0.7} />

      {/* CORRIDOR dressing */}
      <Plant x={1010} y={336} s={0.6} />
      <Bench x={1470} y={304} w={26} />
      <Barrel x={1478} y={354} s={0.5} />

      {/* SOUTH PARLOUR (tasting room: counter + tables) */}
      <Counter x={1062} y={512} w={230} h={44} />
      <Stool x={1086} y={506} />
      <Stool x={1136} y={506} />
      <Stool x={1186} y={506} />
      <Stool x={1236} y={506} />
      <WineRack x={1312} y={514} w={118} h={42} />
      <RoundTable x={1376} y={466} r={24} />
      <RoundTable x={1115} y={470} r={22} />
      <Plant x={1424} y={436} s={0.65} />

      {/* VAULT ALCOVE */}
      <Pedestal x={1605} y={340} />
      <Candle x={1560} y={300} />
      <Candle x={1650} y={300} />
      <Candle x={1560} y={396} />
      <Candle x={1650} y={396} />
      <Plant x={1546} y={380} s={0.55} />

      {/* STAIRS corridor torches */}
      <Torch x={88} y={600} />
      <Torch x={212} y={640} />

      {/* CELLAR */}
      <Barrel x={64} y={760} />
      <Barrel x={100} y={768} />
      <Barrel x={64} y={800} s={1.05} />
      <Barrel x={348} y={760} />
      <Barrel x={388} y={768} s={1.05} />
      <WineRack x={160} y={738} w={140} h={50} />
      <Crate x={326} y={826} w={36} h={28} />
      <Crate x={370} y={834} w={30} h={26} tint="#b57a38" />
      <Sack x={72} y={880} />
      <Sack x={104} y={884} color="#cdb589" />
      <Torch x={44} y={820} />
      <Torch x={414} y={820} />
      <Stool x={330} y={888} />
    </svg>
  );
}

// Warm pools of lamplight (screen + soft-light) that lift floor contrast under fireplaces and lamps
const POOLS = [
  { x: 530, y: 175, rx: 250, ry: 170, o: 0.9 },   // grand hearth
  { x: 120, y: 215, rx: 150, ry: 100, o: 0.55 },  // store counter
  { x: 934, y: 215, rx: 110, ry: 130, o: 0.55 },  // hall lamp
  { x: 30, y: 215, rx: 90, ry: 110, o: 0.5 },
  { x: 820, y: 470, rx: 120, ry: 80, o: 0.5 },
  { x: 1160, y: 330, rx: 120, ry: 55, o: 0.6 },   // corridor sconces
  { x: 1450, y: 336, rx: 110, ry: 55, o: 0.6 },
  { x: 1245, y: 200, rx: 180, ry: 90, o: 0.7 },   // archive candle table
  { x: 1424, y: 190, rx: 90, ry: 80, o: 0.5 },
  { x: 1160, y: 480, rx: 130, ry: 50, o: 0.6 },   // parlour
  { x: 1376, y: 466, rx: 90, ry: 55, o: 0.6 },
  { x: 1605, y: 340, rx: 120, ry: 100, o: 0.95 }, // crystal pedestal
  { x: 150, y: 620, rx: 90, ry: 90, o: 0.55 },    // stairs torches
  { x: 44, y: 820, rx: 110, ry: 90, o: 0.65 },    // cellar torches
  { x: 414, y: 820, rx: 110, ry: 90, o: 0.65 }
];

export function ComplexLightingSVG() {
  return (
    <svg
      className="complex-lighting-svg"
      width={W}
      height={H}
      viewBox={`${-PAD} ${-PAD} ${W} ${H}`}
      style={{ position: 'absolute', left: -PAD, top: -PAD, zIndex: 28, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="cx-lamp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="rgba(255, 205, 110, 0.85)" />
          <stop offset="0.45" stopColor="rgba(255, 170, 70, 0.38)" />
          <stop offset="1" stopColor="rgba(255, 150, 50, 0)" />
        </radialGradient>
      </defs>
      {POOLS.map((p, i) => (
        <g key={i} className="complex-light-pool" style={{ animationDelay: `${(i % 5) * 0.37}s` }}>
          <ellipse cx={p.x} cy={p.y} rx={p.rx} ry={p.ry} fill="url(#cx-lamp-glow)" opacity={p.o} style={{ mixBlendMode: 'soft-light' }} />
          <ellipse cx={p.x} cy={p.y} rx={p.rx * 0.8} ry={p.ry * 0.8} fill="url(#cx-lamp-glow)" opacity={p.o * 0.35} style={{ mixBlendMode: 'screen' }} />
        </g>
      ))}
    </svg>
  );
}
