// Geometry & Navigation Engine for the Grand Farmstead Barn Complex (6 Elevated Animal Chambers)
// Expanded World: 1360 x 820
// Central Cobblestone Promenade (x: 560 - 800) + 28px Aisle Gaps between Stalls

export const FARM_WORLD_W = 1360;
export const FARM_WORLD_H = 820;

export const FARM_ZONES = [
  // 1. Central Promenade & Entrance Stoop
  {
    id: 'central_promenade',
    rects: [
      [560, 90, 800, 740],   // 240px wide promenade
      [590, 50, 770, 90],    // Granary loft alcove at north
      [620, 740, 740, 784]   // Exit stoop to village farmyard
    ],
    cuts: [
      { x1: 560, y1: 700, x2: 610, y2: 740, check: (x, y) => (y - 700) > (x - 560) * 0.8 },
      { x1: 750, y1: 740, x2: 800, y2: 700, check: (x, y) => (y - 700) > (800 - x) * 0.8 }
    ]
  },

  // Aisle Walkways (between vertically stacked stalls)
  {
    id: 'west_aisle_1',
    rects: [[100, 280, 560, 310]]  // Between Cow and Sheep
  },
  {
    id: 'west_aisle_2',
    rects: [[100, 500, 560, 530]]  // Between Sheep and Pig
  },
  {
    id: 'east_aisle_1',
    rects: [[800, 280, 1260, 310]] // Between Horse and Poultry
  },
  {
    id: 'east_aisle_2',
    rects: [[800, 500, 1260, 530]] // Between Poultry and Duck
  },

  // 2. NW Stall: רפת הפרה (Bessie - Lush Green Pasture)
  {
    id: 'cow_stall',
    rects: [
      [100, 90, 560, 280]
    ],
    cuts: [
      { x1: 100, y1: 90, x2: 140, y2: 130, check: (x, y) => (130 - y) > (x - 100) }
    ]
  },

  // 3. Mid-W Stall: דיר הכבשה (Wooly - Clover Meadow & Wool)
  {
    id: 'sheep_pen',
    rects: [
      [100, 310, 560, 500]
    ],
    cuts: []
  },

  // 4. SW Stall: דיר החזיר (Truffles - Mud Wallow & Apples)
  {
    id: 'pig_pen',
    rects: [
      [100, 530, 560, 740]
    ],
    cuts: [
      { x1: 100, y1: 700, x2: 140, y2: 740, check: (x, y) => (y - 700) > (x - 100) }
    ]
  },

  // 5. NE Stall: אורוות הסוס (Thunder - Packed Earth & Carrots)
  {
    id: 'horse_stable',
    rects: [
      [800, 90, 1260, 280]
    ],
    cuts: [
      { x1: 1220, y1: 130, x2: 1260, y2: 90, check: (x, y) => (130 - y) > (1260 - x) }
    ]
  },

  // 6. Mid-E Stall: לול התרנגולות (Clucky - Bright Golden Straw)
  {
    id: 'poultry_coop',
    rects: [
      [800, 310, 1260, 500]
    ],
    cuts: []
  },

  // 7. SE Stall: בריכת הברווזים (Ducky & Goose - Cyan Freshwater Pond)
  {
    id: 'duck_pond',
    rects: [
      [800, 530, 1260, 740]
    ],
    cuts: [
      { x1: 1220, y1: 740, x2: 1260, y2: 700, check: (x, y) => (y - 700) > (1260 - x) }
    ]
  }
];

export function isFarmWalkable(x, y) {
  for (const zone of FARM_ZONES) {
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

export function snapToFarmWalkable(targetX, targetY) {
  if (isFarmWalkable(targetX, targetY)) {
    return { x: targetX, y: targetY };
  }
  let best = { x: 680, y: 700 };
  let minD = Infinity;
  for (let r = 8; r <= 200; r += 8) {
    const steps = Math.max(12, Math.floor(r * 0.7));
    for (let i = 0; i < steps; i++) {
      const angle = (i / steps) * Math.PI * 2;
      const testX = Math.round(targetX + Math.cos(angle) * r);
      const testY = Math.round(targetY + Math.sin(angle) * r);
      if (isFarmWalkable(testX, testY)) {
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

export function resolveFarmMove(pos, vx, vy) {
  const newX = pos.x + vx;
  const newY = pos.y + vy;

  if (isFarmWalkable(newX, newY)) {
    return { x: newX, y: newY };
  }
  if (isFarmWalkable(newX, pos.y)) {
    return { x: newX, y: pos.y };
  }
  if (isFarmWalkable(pos.x, newY)) {
    return { x: pos.x, y: newY };
  }
  return pos;
}
