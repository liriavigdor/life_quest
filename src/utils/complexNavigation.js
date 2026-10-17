// Geometry for the asymmetric multi-wing cottage shell (mirrors ComplexArchitecture.jsx).
//   A  NW wing (+ front-jutting nook), W-E corridor C1, central hall B (+ alcove),
//   E connector C2, east wing D (+ partitioned south room), N-S corridor C3, foyer.
// Pillar / half-wall footprints are carved out of the walkable rectangles.
// Pure navigation math: no React, no game state.

export const COMPLEX_PAD = 0;
export const COMPLEX_WORLD_W = 1260;
export const COMPLEX_WORLD_H = 660;

// Walkable floor zones [x1, y1, x2, y2]. Corridors are ~1 tile (32-36px) wide;
// 45° corner cuts are approximated with stepped rectangles.
export const COMPLEX_ZONES = [
  // Foyer (center-bottom, SW/SE corners cut at 45°)
  { id: 'entry_foyer', rects: [[430, 480, 690, 554], [450, 554, 670, 590]] },

  // Central hall + raised alcove + N-S corridor + east connector
  {
    id: 'main_hall',
    rects: [
      [430, 140, 690, 340],
      [524, 112, 596, 140],
      [544, 340, 576, 480],
      [690, 292, 780, 328]
    ]
  },

  // NW wing: deep bed nook + wing (divider wall + post at x 146-168 blocks y < 246),
  // front nook (SW corner cut), W-E corridor
  {
    id: 'left_store',
    rects: [
      [60, 118, 146, 290],
      [168, 170, 280, 290],
      [60, 246, 280, 290],
      [60, 290, 180, 334],
      [84, 334, 180, 370],
      [280, 242, 430, 278]
    ]
  },

  // East wing (nook half-wall + post at x 1034-1058 blocks y < 330), partition doorway,
  // south room (SE corner cut)
  {
    id: 'right_sanctuary',
    rects: [
      [780, 250, 1034, 400],
      [1060, 250, 1180, 400],
      [780, 330, 1180, 400],
      [1048, 400, 1082, 468],
      [900, 468, 1180, 540],
      [900, 540, 1160, 580]
    ]
  },

  // Exit stoop to the village
  { id: 'doorway', rects: [[505, 586, 635, 612]] }
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
  return best || { x: 595, y: 510 };
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

// Circulation hubs (doors, corridor centrelines, room corners). Routes are found
// by line-of-sight over this graph, so click-to-move never cuts through walls.
const HUBS = [
  { x: 570, y: 600 },                                   // exit stoop
  { x: 560, y: 540 }, { x: 560, y: 500 },               // foyer
  { x: 560, y: 440 }, { x: 560, y: 380 },               // N-S corridor
  { x: 560, y: 300 }, { x: 470, y: 260 }, { x: 650, y: 310 }, // hall
  { x: 560, y: 126 },                                   // alcove
  { x: 350, y: 260 }, { x: 300, y: 260 },               // W-E corridor
  { x: 240, y: 262 }, { x: 170, y: 268 },               // NW wing, south of divider
  { x: 110, y: 210 }, { x: 230, y: 210 }, { x: 120, y: 330 },
  { x: 100, y: 150 },                                   // deep bed nook
  { x: 735, y: 310 },                                   // east connector
  { x: 810, y: 300 }, { x: 900, y: 360 }, { x: 1000, y: 290 },
  { x: 1040, y: 365 }, { x: 1065, y: 365 }, { x: 1120, y: 290 }, // east wing
  { x: 1065, y: 430 },                                  // partition doorway
  { x: 1065, y: 500 }, { x: 980, y: 530 }, { x: 1130, y: 530 } // south room
];

const hasLineOfSight = (a, b) => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const steps = Math.max(1, Math.ceil(d / 2));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (!isWalkable(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t)) return false;
  }
  return true;
};

export function buildRoute(from, to) {
  if (hasLineOfSight(from, to)) return [to];

  const nodes = [from, ...HUBS, to];
  const last = nodes.length - 1;
  const dist = new Array(nodes.length).fill(Infinity);
  const prev = new Array(nodes.length).fill(-1);
  const done = new Array(nodes.length).fill(false);
  dist[0] = 0;

  for (let iter = 0; iter < nodes.length; iter++) {
    let u = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!done[i] && (u === -1 || dist[i] < dist[u])) u = i;
    }
    if (u === -1 || dist[u] === Infinity) break;
    done[u] = true;
    if (u === last) break;
    for (let v = 0; v < nodes.length; v++) {
      if (done[v] || v === u) continue;
      const w = Math.hypot(nodes[v].x - nodes[u].x, nodes[v].y - nodes[u].y);
      if (dist[u] + w < dist[v] && hasLineOfSight(nodes[u], nodes[v])) {
        dist[v] = dist[u] + w;
        prev[v] = u;
      }
    }
  }

  if (prev[last] === -1) return [to];
  const path = [];
  for (let n = last; n !== 0; n = prev[n]) path.unshift(nodes[n]);
  return path;
}

export function computeCamera() {
  return { x: 0, y: 0 };
}
