// Geometry & Navigation Engine for the Grand Botanical Conservatory (Garden Complex)
// Strict collision margins preventing wall/void clipping.

export const GARDEN_WORLD_W = 1100;
export const GARDEN_WORLD_H = 660;

export const GARDEN_ZONES = [
  // 1. Entrance & South Wildflower Sanctuary
  {
    id: 'south_sanctuary',
    rects: [
      [360, 420, 740, 550],  // South flower beds & conservatory path
      [500, 550, 600, 584]   // Exit stoop to village
    ],
    cuts: [
      { x1: 360, y1: 520, x2: 390, y2: 550, check: (x, y) => (y - 520) > (x - 360) },
      { x1: 710, y1: 550, x2: 740, y2: 520, check: (x, y) => (y - 520) > (740 - x) }
    ]
  },

  // 2. Central Palm & Fountain Atrium
  {
    id: 'central_atrium',
    rects: [
      [380, 200, 720, 440],  // Central tiled aisle & fountain crossing
      [300, 290, 380, 370],  // West passageway arch to Germination Nursery
      [720, 290, 800, 370]   // East passageway arch to Herb Sanctuary
    ],
    cuts: []
  },

  // 3. West Wing - Germination Bench & Seed Nursery
  {
    id: 'west_nursery',
    rects: [
      [120, 220, 380, 440],  // Sprouting bench & peat pots wing
      [120, 160, 260, 220]   // Botanical library & cloche alcove
    ],
    cuts: [
      { x1: 120, y1: 410, x2: 150, y2: 440, check: (x, y) => (y - 410) > (x - 120) }
    ]
  },

  // 4. East Wing - Aromatic Herbs & Healing Trellis
  {
    id: 'east_herbs',
    rects: [
      [720, 220, 980, 440],  // Raised herb planters & tea drying bench
      [840, 160, 980, 220]   // Sunlight drying balcony nook
    ],
    cuts: [
      { x1: 950, y1: 440, x2: 980, y2: 410, check: (x, y) => (y - 410) > (980 - x) }
    ]
  },

  // 5. North Wing - Deep Root Vegetable Raised Beds
  {
    id: 'north_root_beds',
    rects: [
      [340, 110, 760, 220]   // Deep raised loamy vegetable beds
    ],
    cuts: [
      { x1: 340, y1: 110, x2: 370, y2: 140, check: (x, y) => (140 - y) > (x - 340) },
      { x1: 730, y1: 140, x2: 760, y2: 110, check: (x, y) => (140 - y) > (760 - x) }
    ]
  }
];

export function isGardenWalkable(x, y) {
  for (const zone of GARDEN_ZONES) {
    for (const [rx1, ry1, rx2, ry2] of zone.rects) {
      if (x >= rx1 && x <= rx2 && y >= ry1 && y <= ry2) {
        if (zone.cuts) {
          let cutBlocked = false;
          for (const cut of zone.cuts) {
            if (x >= cut.x1 && x <= cut.x2 && y >= Math.min(cut.y1, cut.y2) && y <= Math.max(cut.y1, cut.y2)) {
              if (cut.check(x, y)) {
                cutBlocked = true;
                break;
              }
            }
          }
          if (cutBlocked) continue;
        }
        return true;
      }
    }
  }
  return false;
}

export function snapToGardenWalkable(targetX, targetY) {
  if (isGardenWalkable(targetX, targetY)) {
    return { x: targetX, y: targetY };
  }
  let best = { x: 550, y: 460 };
  let minD = Infinity;
  for (let r = 8; r <= 140; r += 8) {
    const steps = Math.max(12, Math.floor(r * 0.7));
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const testX = Math.round(targetX + Math.cos(angle) * r);
      const testY = Math.round(targetY + Math.sin(angle) * r);
      if (isGardenWalkable(testX, testY)) {
        const d = Math.hypot(testX - targetX, testY - targetY);
        if (d < minD) {
          minD = d;
          best = { x: testX, y: testY };
        }
      }
    }
    if (minD < Infinity) break;
  }
  return best;
}

export function resolveGardenMove(pos, vx, vy) {
  const newX = pos.x + vx;
  const newY = pos.y + vy;

  if (isGardenWalkable(newX, newY)) {
    return { x: newX, y: newY };
  }
  if (isGardenWalkable(newX, pos.y)) {
    return { x: newX, y: pos.y };
  }
  if (isGardenWalkable(pos.x, newY)) {
    return { x: pos.x, y: newY };
  }
  return pos;
}
