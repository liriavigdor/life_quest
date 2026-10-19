// Geometry & Navigation Engine for the Asymmetric Multi-Wing Cottage Shell
// Mirrors ComplexArchitecture.jsx with strict collision margins preventing wall/void clipping.
// Pure math: zero React, zero DOM dependencies.

export const COMPLEX_PAD = 0;
export const COMPLEX_WORLD_W = 1260;
export const COMPLEX_WORLD_H = 660;

/**
 * Character Physical Collision Margins:
 * Radius X = 16px (keeps shoulders/arms from penetrating side walls)
 * Padding Top = 10px (keeps head/hat from floating above back walls into ceiling void)
 * Padding Bottom = 14px (keeps feet/shadow from falling off front wooden sills into black void)
 */
export const COMPLEX_ZONES = [
  // 1. Entrance Foyer (Room C / Neutral)
  {
    id: 'entry_foyer',
    rects: [
      [456, 430, 734, 556],       // Main foyer floor
      [734, 520, 764, 556],       // Inset cloak alcove nook
      [575, 420, 615, 430],       // Mouth to N-S tunnel C3 (widened)
      [550, 556, 640, 584]        // Exit doorway stoop to village
    ],
    // Chamfer cut: [x1, y1, x2, y2, type]
    // SW chamfer from (456, 534) to (480, 556):
    cuts: [
      { x1: 456, y1: 532, x2: 482, y2: 556, check: (x, y) => (y - 532) > (x - 456) * 0.92 }
    ]
  },

  // 2. Central Grand Hall (Room B / In-Progress Hearth)
  {
    id: 'main_hall',
    rects: [
      [446, 118, 744, 326],       // Main grand hall floor
      [622, 86, 688, 118],        // Asymmetric off-center hearth alcove
      [575, 326, 615, 420],       // N-S corridor tunnel C3 (56px wide)
      [364, 226, 446, 270],       // W-E corridor tunnel C1 (56px opening)
      [744, 226, 826, 270]        // East connector tunnel C2 (56px opening)
    ],
    cuts: [
      // Grand Hall SW chamfer from (446, 302) to (468, 326)
      { x1: 446, y1: 302, x2: 468, y2: 326, check: (x, y) => (y - 302) > (x - 446) * 1.09 }
    ]
  },

  // 3. Left Wing (Room A / Urgent Wing)
  {
    id: 'left_store',
    rects: [
      [96, 160, 364, 296],        // NW wing main room (A1)
      [96, 100, 174, 160],        // Raised bed nook
      [96, 296, 204, 396],        // Front-jutting nook (A2)
      [364, 226, 380, 270]        // Corridor mouth C1
    ],
    cuts: [
      // Front-jut A2 SW chamfer from (96, 368) to (124, 396)
      { x1: 96, y1: 368, x2: 124, y2: 396, check: (x, y) => (y - 368) > (x - 96) * 1.0 }
    ]
  },

  // 4. East Wing (Room D / Routine Sanctuary)
  {
    id: 'right_sanctuary',
    rects: [
      [826, 180, 1164, 326],      // East wing north room
      [980, 326, 1016, 430],      // Partition doorway tunnel (56px wide)
      [896, 430, 1164, 556],      // East wing south room
      [810, 226, 826, 270]        // East connector C2 mouth
    ],
    cuts: [
      // East south room SE chamfer from (1134, 556) to (1164, 524)
      { x1: 1134, y1: 524, x2: 1164, y2: 556, check: (x, y) => (y - 524) > (1164 - x) * 1.07 }
    ]
  }
];

const inRect = (x, y, r) => x >= r[0] && x <= r[2] && y >= r[1] && y <= r[3];

/**
 * Validates if (x, y) is safely inside the walkable floor boundaries.
 * Enforces locked door barriers between room corridors.
 */
export function isWalkable(x, y, doorsState = {}) {
  // Check locked physical doors blocking corridor transitions:
  // 1. Door C3 (Foyer to Grand Hall)
  if (doorsState.door_c3 !== false) {
    if (x >= 560 && x <= 630 && y >= 340 && y <= 415) {
      return false; // Physical closed wooden door
    }
  }
  // 2. Door C1 (Grand Hall to Left Wing)
  if (doorsState.door_c1 !== false) {
    if (x >= 370 && x <= 430 && y >= 210 && y <= 286) {
      return false;
    }
  }
  // 3. Door C2 (Grand Hall to East Wing North)
  if (doorsState.door_c2 !== false) {
    if (x >= 755 && x <= 815 && y >= 210 && y <= 286) {
      return false;
    }
  }
  // 4. Door East South (East North to East South partition doorway)
  if (doorsState.door_east_south !== false) {
    if (x >= 960 && x <= 1035 && y >= 340 && y <= 415) {
      return false;
    }
  }

  for (const zone of COMPLEX_ZONES) {
    const insideRect = zone.rects.some(r => inRect(x, y, r));
    if (insideRect) {
      if (zone.cuts && zone.cuts.length > 0) {
        for (const cut of zone.cuts) {
          if (x >= cut.x1 && x <= cut.x2 && y >= cut.y1 && y <= cut.y2) {
            if (cut.check(x, y)) return false; // In chamfered corner cut
          }
        }
      }
      return true;
    }
  }
  return false;
}

export function pointZone(x, y) {
  for (const z of COMPLEX_ZONES) {
    if (z.rects.some(r => inRect(x, y, r))) return z.id;
  }
  return null;
}

/**
 * Snaps (x, y) to the nearest safe walkable point.
 */
export function snapToWalkable(x, y, doorsState = {}) {
  if (isWalkable(x, y, doorsState)) return { x, y };

  let best = null;
  let bestDist = Infinity;

  COMPLEX_ZONES.forEach(z => {
    z.rects.forEach(r => {
      const cx = Math.max(r[0], Math.min(r[2], x));
      const cy = Math.max(r[1], Math.min(r[3], y));
      if (isWalkable(cx, cy, doorsState)) {
        const d = Math.hypot(cx - x, cy - y);
        if (d < bestDist) {
          bestDist = d;
          best = { x: cx, y: cy };
        }
      }
    });
  });

  return best || { x: 595, y: 510 };
}

/**
 * Fluid wall sliding physics:
 * If diagonal movement hits a wall or locked door, slides along the surface.
 */
export function resolveMove(prev, dx, dy, doorsState = {}) {
  const nx = prev.x + dx;
  const ny = prev.y + dy;

  // 1. Direct step
  if (isWalkable(nx, ny, doorsState)) {
    return { x: nx, y: ny };
  }

  // 2. Horizontal slide
  if (dx !== 0 && isWalkable(nx, prev.y, doorsState)) {
    return { x: nx, y: prev.y };
  }

  // 3. Vertical slide
  if (dy !== 0 && isWalkable(prev.x, ny, doorsState)) {
    return { x: prev.x, y: ny };
  }

  // 4. Micro sub-step for gentle corner rounding
  if (dx !== 0 && dy !== 0) {
    if (isWalkable(prev.x + dx * 0.5, prev.y, doorsState)) {
      return { x: prev.x + dx * 0.5, y: prev.y };
    }
    if (isWalkable(prev.x, prev.y + dy * 0.5, doorsState)) {
      return { x: prev.x, y: prev.y + dy * 0.5 };
    }
  }

  // 5. Intelligent Corner Gliding & Chamfer Sliders:
  // If moving vertically (dy !== 0) but blocked by a doorway lip, nudge horizontally
  if (dy !== 0 && dx === 0) {
    for (const offset of [2, -2, 4, -4, 6, -6]) {
      if (isWalkable(prev.x + offset, ny, doorsState)) {
        return { x: prev.x + Math.sign(offset) * 1.5, y: ny };
      }
    }
  }

  // If moving horizontally (dx !== 0) but blocked, nudge vertically
  if (dx !== 0 && dy === 0) {
    for (const offset of [2, -2, 4, -4, 6, -6]) {
      if (isWalkable(nx, prev.y + offset, doorsState)) {
        return { x: nx, y: prev.y + Math.sign(offset) * 1.5 };
      }
    }
  }

  return { x: prev.x, y: prev.y };
}

/**
 * Dense Navigation Waypoint Mesh connecting all 4 chambers, corridors, and doorways.
 */
export const NAV_HUBS = [
  // Foyer
  { id: 'foyer_exit', x: 595, y: 575 },
  { id: 'foyer_bottom', x: 595, y: 540 },
  { id: 'foyer_center', x: 595, y: 490 },
  { id: 'foyer_left', x: 500, y: 490 },
  { id: 'foyer_right', x: 690, y: 490 },
  { id: 'foyer_nook', x: 745, y: 540 },
  { id: 'foyer_top', x: 595, y: 440 },

  // Corridor C3 (Foyer <-> Grand Hall)
  { id: 'c3_mid', x: 595, y: 375 },

  // Grand Hall
  { id: 'hall_bottom', x: 595, y: 310 },
  { id: 'hall_center', x: 595, y: 248 },
  { id: 'hall_west', x: 470, y: 248 },
  { id: 'hall_east', x: 720, y: 248 },
  { id: 'hall_nw', x: 470, y: 150 },
  { id: 'hall_ne', x: 720, y: 150 },
  { id: 'hearth_mouth', x: 655, y: 118 },
  { id: 'hearth_top', x: 655, y: 95 },

  // Corridor C1 (Grand Hall <-> Left Wing)
  { id: 'c1_east', x: 440, y: 248 },
  { id: 'c1_mid', x: 405, y: 248 },
  { id: 'c1_west', x: 370, y: 248 },

  // Left Wing (Urgent / Store)
  { id: 'left_center', x: 260, y: 248 },
  { id: 'left_west', x: 135, y: 248 },
  { id: 'left_nook_step', x: 135, y: 160 },
  { id: 'left_bed_nook', x: 135, y: 120 },
  { id: 'left_front_mid', x: 135, y: 310 },
  { id: 'left_front_deep', x: 135, y: 370 },
  { id: 'left_front_east', x: 180, y: 350 },

  // Corridor C2 (Grand Hall <-> East Wing North)
  { id: 'c2_west', x: 750, y: 248 },
  { id: 'c2_mid', x: 785, y: 248 },
  { id: 'c2_east', x: 820, y: 248 },

  // East Wing North (Routine North)
  { id: 'east_n_west', x: 860, y: 248 },
  { id: 'east_n_center', x: 998, y: 248 },
  { id: 'east_n_east', x: 1130, y: 248 },
  { id: 'east_n_ne', x: 1130, y: 195 },
  { id: 'east_n_portal', x: 998, y: 320 },

  // East Wing Partition Doorway Tunnel
  { id: 'east_doorway_mid', x: 998, y: 375 },

  // East Wing South (Routine South)
  { id: 'east_s_portal', x: 998, y: 440 },
  { id: 'east_s_center', x: 998, y: 490 },
  { id: 'east_s_west', x: 920, y: 490 },
  { id: 'east_s_east', x: 1120, y: 490 },
  { id: 'east_s_south', x: 998, y: 540 }
];

/**
 * Dense Line of Sight test:
 * Returns true if straight path between a and b is completely walkable.
 */
export function hasLineOfSight(a, b) {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  if (d < 1) return true;
  const steps = Math.max(2, Math.ceil(d / 4));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const px = a.x + (b.x - a.x) * t;
    const py = a.y + (b.y - a.y) * t;
    if (!isWalkable(px, py)) return false;
  }
  return true;
}

/**
 * Builds an optimal, corner-smoothed route between any two points.
 */
export function buildRoute(from, to) {
  const target = snapToWalkable(to.x, to.y);

  // 1. Direct path if unobstructed
  if (hasLineOfSight(from, target)) {
    return [target];
  }

  // 2. Connect from and to into the waypoint graph
  const nodes = [from, ...NAV_HUBS, target];
  const lastIdx = nodes.length - 1;

  const dist = new Array(nodes.length).fill(Infinity);
  const prev = new Array(nodes.length).fill(-1);
  const visited = new Array(nodes.length).fill(false);
  dist[0] = 0;

  for (let iter = 0; iter < nodes.length; iter++) {
    let u = -1;
    for (let i = 0; i < nodes.length; i++) {
      if (!visited[i] && (u === -1 || dist[i] < dist[u])) {
        u = i;
      }
    }

    if (u === -1 || dist[u] === Infinity) break;
    visited[u] = true;
    if (u === lastIdx) break;

    for (let v = 0; v < nodes.length; v++) {
      if (visited[v] || v === u) continue;

      const directDist = Math.hypot(nodes[v].x - nodes[u].x, nodes[v].y - nodes[u].y);
      // Prune connections longer than 360px to speed up search
      if (directDist > 360) continue;

      if (dist[u] + directDist < dist[v] && hasLineOfSight(nodes[u], nodes[v])) {
        dist[v] = dist[u] + directDist;
        prev[v] = u;
      }
    }
  }

  // If graph could not reach, fallback to target
  if (prev[lastIdx] === -1) {
    return [target];
  }

  // Reconstruct raw path
  const rawPath = [];
  for (let curr = lastIdx; curr !== 0; curr = prev[curr]) {
    rawPath.unshift(nodes[curr]);
  }

  // 3. String-pulling path smoothing (skip redundant waypoints)
  if (rawPath.length <= 1) return rawPath;

  const smoothed = [];
  let currentStart = from;
  let i = 0;

  while (i < rawPath.length) {
    let furthest = i;
    for (let j = rawPath.length - 1; j > i; j--) {
      if (hasLineOfSight(currentStart, rawPath[j])) {
        furthest = j;
        break;
      }
    }
    smoothed.push(rawPath[furthest]);
    currentStart = rawPath[furthest];
    i = furthest + 1;
  }

  return smoothed.length > 0 ? smoothed : [target];
}

export function computeCamera() {
  return { x: 0, y: 0 };
}
