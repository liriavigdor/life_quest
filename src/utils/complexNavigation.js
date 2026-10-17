// Geometry for the authentic Stardew Valley 4-chamber house floorplan.
// 1. Neutral Entrance Foyer (Center-Bottom)
// 2. Urgent Room (Left Wing • 🔴 Red)
// 3. In-Progress Room (Center-Top • 🟡 Yellow)
// 4. Routine Room (Right Wing • 🟢 Green)
// Fits 1260x660 with zero camera scrolling.
// Pure navigation math: no React, no game state.

export const COMPLEX_PAD = 0;
export const COMPLEX_WORLD_W = 1260;
export const COMPLEX_WORLD_H = 660;

// Walkable floor zones for the 4 interconnected chambers
export const COMPLEX_ZONES = [
  // 1. Neutral Entrance Foyer (Center-Bottom)
  { id: 'entry_foyer', rects: [[460, 390, 800, 605]] },

  // 2. Left Store & Registry Chamber (🔴 Red Zone / Urgent)
  { id: 'left_store', rects: [[60, 120, 460, 595]] },

  // 3. Central Grand Hearth Hall (🟡 Yellow Zone / In-Progress)
  { id: 'main_hall', rects: [[360, 60, 900, 395]] },

  // 4. Right Sacred Sanctuary Chamber (🟢 Green Zone / Routine)
  { id: 'right_sanctuary', rects: [[800, 120, 1195, 595]] },

  // Threshold Archways connecting Foyer symmetrically to Left, North, and Right
  { id: 'arch_left', rects: [[430, 440, 480, 545]] },
  { id: 'arch_north', rects: [[560, 370, 700, 410]] },
  { id: 'arch_right', rects: [[780, 440, 830, 545]] },

  // Bottom entrance/exit threshold to village
  { id: 'doorway', rects: [[570, 600, 690, 635]] }
];

const inRect = (x, y, r) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];

export function isWalkable(x, y) {
  return COMPLEX_ZONES.some(z => z.rects.some(r => inRect(x, y, r)));
}

export function pointZone(x, y) {
  for (const z of COMPLEX_ZONES) {
    if (z.rects.some(r => inRect(x, y, r))) return z.id;
  }
  return null;
}

/** Nearest walkable point to (x, y). */
export function snapToWalkable(x, y) {
  if (isWalkable(x, y)) return { x, y };
  let best = null;
  let bestDist = Infinity;
  COMPLEX_ZONES.forEach(z => z.rects.forEach(r => {
    const cx = Math.max(r[0], Math.min(r[2], x));
    const cy = Math.max(r[1], Math.min(r[3], y));
    const d = Math.hypot(cx - x, cy - y);
    if (d < bestDist) {
      bestDist = d;
      best = { x: cx, y: cy };
    }
  }));
  return best || { x: 630, y: 500 };
}

/** Apply a step with wall sliding */
export function resolveMove(prev, dx, dy) {
  const nx = prev.x + dx;
  const ny = prev.y + dy;
  if (isWalkable(nx, ny)) return { x: nx, y: ny };
  if (dx !== 0 && isWalkable(nx, prev.y)) return { x: nx, y: prev.y };
  if (dy !== 0 && isWalkable(prev.x, ny)) return { x: prev.x, y: ny };
  return { x: prev.x, y: prev.y };
}

/** Symmetrical Doorway Waypoints from the Neutral Foyer to all 3 rooms */
const DOOR_WAYPOINTS = {
  // Direct Foyer access
  'entry_foyer-left_store': [{ x: 450, y: 490 }],
  'left_store-entry_foyer': [{ x: 450, y: 490 }],
  'entry_foyer-main_hall': [{ x: 630, y: 390 }],
  'main_hall-entry_foyer': [{ x: 630, y: 390 }],
  'entry_foyer-right_sanctuary': [{ x: 810, y: 490 }],
  'right_sanctuary-entry_foyer': [{ x: 810, y: 490 }],

  // Room to Room routes (transit through the neutral foyer)
  'left_store-main_hall': [{ x: 450, y: 490 }, { x: 630, y: 490 }, { x: 630, y: 390 }],
  'main_hall-left_store': [{ x: 630, y: 390 }, { x: 630, y: 490 }, { x: 450, y: 490 }],
  'right_sanctuary-main_hall': [{ x: 810, y: 490 }, { x: 630, y: 490 }, { x: 630, y: 390 }],
  'main_hall-right_sanctuary': [{ x: 630, y: 390 }, { x: 630, y: 490 }, { x: 810, y: 490 }],
  'left_store-right_sanctuary': [{ x: 450, y: 490 }, { x: 630, y: 490 }, { x: 810, y: 490 }],
  'right_sanctuary-left_store': [{ x: 810, y: 490 }, { x: 630, y: 490 }, { x: 450, y: 490 }]
};

export function buildRoute(from, to) {
  const startZone = pointZone(from.x, from.y);
  const endZone = pointZone(to.x, to.y);

  if (startZone && endZone && startZone !== endZone) {
    const key = `${startZone}-${endZone}`;
    if (DOOR_WAYPOINTS[key]) {
      return [...DOOR_WAYPOINTS[key], to];
    }
  }
  return [to];
}

export function computeCamera() {
  return { x: 0, y: 0 };
}
