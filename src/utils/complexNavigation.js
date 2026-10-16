// Geometry for the "ant-farm" institution complex.
// All coordinates are in the complex's origin space (top-left of the main hall = 0,0).
// Pure functions only: no React, no game state.

export const COMPLEX_PAD = 120;       // void margin drawn around the architecture (left / top)
export const COMPLEX_WORLD_W = 1900;  // world spans x: -120 .. 1780
export const COMPLEX_WORLD_H = 1180;  // world spans y: -120 .. 1060
const CAMERA_VOID_MARGIN = 60;        // how much black void the camera may show past the outer walls

// Rects are [x1, y1, x2, y2] in foot-position space (where the villager may stand).
export const COMPLEX_ZONES = [
  { id: 'hall', rects: [[50, 140, 910, 480]] },
  {
    id: 'corridor',
    rects: [
      [900, 316, 1000, 364],   // east door out of the hall
      [995, 316, 1490, 364],   // long side corridor
      [1210, 246, 1260, 330],  // door to the north archive
      [1340, 350, 1390, 444],  // door to the south parlour
      [1488, 322, 1545, 358]   // door to the vault alcove
    ]
  },
  { id: 'north', rects: [[1065, 150, 1425, 248]] },
  { id: 'south', rects: [[1065, 440, 1425, 496]] },
  { id: 'alcove', rects: [[1545, 285, 1665, 400]] },
  { id: 'stairs', rects: [[115, 470, 185, 750]] },
  { id: 'cellar', rects: [[55, 745, 415, 905]] }
];

// Door connections: waypoints that walk from zone `a` into zone `b` (reverse for b -> a).
const EDGES = [
  ['hall', 'corridor', [[905, 340], [1000, 340]]],
  ['corridor', 'north', [[1235, 335], [1235, 262], [1235, 236]]],
  ['corridor', 'south', [[1365, 340], [1365, 420], [1365, 455]]],
  ['corridor', 'alcove', [[1470, 340], [1560, 340]]],
  ['hall', 'stairs', [[150, 470], [150, 505]]],
  ['stairs', 'cellar', [[150, 725], [150, 760]]]
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
  return best || { x, y };
}

/** Apply a step with wall sliding: full move, then x-only, then y-only, else stay. */
export function resolveMove(prev, dx, dy) {
  const nx = prev.x + dx;
  const ny = prev.y + dy;
  if (isWalkable(nx, ny)) return { x: nx, y: ny };
  if (dx !== 0 && isWalkable(nx, prev.y)) return { x: nx, y: prev.y };
  if (dy !== 0 && isWalkable(prev.x, ny)) return { x: prev.x, y: ny };
  return { x: prev.x, y: prev.y };
}

/** Ordered waypoints (ending at `to`) that route through door openings between zones. */
export function buildRoute(from, to) {
  const start = pointZone(from.x, from.y);
  const goal = pointZone(to.x, to.y);
  if (!start || !goal || start === goal) return [to];

  // BFS over the zone graph
  const prev = { [start]: null };
  const queue = [start];
  while (queue.length) {
    const cur = queue.shift();
    if (cur === goal) break;
    EDGES.forEach(([a, b]) => {
      const next = cur === a ? b : (cur === b ? a : null);
      if (next && !(next in prev)) {
        prev[next] = cur;
        queue.push(next);
      }
    });
  }
  if (!(goal in prev)) return [to];

  const zonePath = [];
  for (let z = goal; z; z = prev[z]) zonePath.unshift(z);

  const route = [];
  for (let i = 0; i < zonePath.length - 1; i++) {
    const a = zonePath[i];
    const b = zonePath[i + 1];
    const edge = EDGES.find(([ea, eb]) => (ea === a && eb === b) || (ea === b && eb === a));
    if (!edge) continue;
    const pts = edge[0] === a ? edge[2] : [...edge[2]].reverse();
    pts.forEach(([px, py]) => route.push({ x: px, y: py }));
  }
  route.push(to);
  return route;
}

/** Top-left of the camera window (origin space) that keeps the player centred without exposing the void. */
export function computeCamera(player, viewW, viewH, zoom = 1.35) {
  const effW = viewW / zoom;
  const effH = viewH / zoom;
  const minX = -30;
  const maxX = Math.max(minX, COMPLEX_WORLD_W - COMPLEX_PAD - effW + 30);
  const minY = -30;
  const maxY = Math.max(minY, COMPLEX_WORLD_H - COMPLEX_PAD - effH + 30);
  const wantX = player.x - effW / 2;
  const wantY = player.y - effH / 2;
  const clamp = (v, lo, hi) => (hi < lo ? (lo + hi) / 2 : Math.max(lo, Math.min(hi, v)));
  return { x: clamp(wantX, minX, maxX), y: clamp(wantY, minY, maxY) };
}
