// Animal Autonomous Simulation & Memory Palace Association Engine

export const STORAGE_KEY_ANIMALS = 'lifequest_cozy_animals_v1';

export const STARTER_ANIMALS = [
  {
    id: 'chick_morning_1',
    type: 'chicken',
    name: 'תרנגולת כפרית',
    customNote: 'עוגן זיכרון אישי או חיית מחמד שלווה',
    completed: false,
    gx: 10,
    gy: 12,
    currGx: 10,
    currGy: 12,
    startGx: 10,
    startGy: 12,
    targetGx: 10,
    targetGy: 12,
    progress: 1,
    facingLeft: false,
    walkCycle: 0,
    hopY: 0,
    state: 'idle',
    idleTimer: 90
  },
  {
    id: 'cat_sun_1',
    type: 'cat',
    name: 'חתול ג\'ינג\'י',
    customNote: 'מגרגר בנחת בשמש',
    completed: false,
    gx: 12,
    gy: 10,
    currGx: 12,
    currGy: 10,
    startGx: 12,
    startGy: 10,
    targetGx: 12,
    targetGy: 10,
    progress: 1,
    facingLeft: true,
    walkCycle: 0,
    hopY: 0,
    state: 'idle',
    idleTimer: 140
  }
];

export function loadSavedAnimals() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ANIMALS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(a => ({
          ...a,
          currGx: a.currGx ?? a.gx,
          currGy: a.currGy ?? a.gy,
          startGx: a.startGx ?? a.gx,
          startGy: a.startGy ?? a.gy,
          targetGx: a.targetGx ?? a.gx,
          targetGy: a.targetGy ?? a.gy,
          progress: a.progress ?? 1,
          walkCycle: 0,
          hopY: 0,
          state: a.state || 'idle',
          idleTimer: a.idleTimer || Math.floor(60 + Math.random() * 120)
        }));
      }
    }
    return STARTER_ANIMALS;
  } catch {
    return STARTER_ANIMALS;
  }
}

export function saveAnimals(animals) {
  try {
    const serialized = animals.map(a => ({
      id: a.id,
      type: a.type,
      name: a.name,
      customNote: a.customNote,
      customEmoji: a.customEmoji || null,
      lastCaredDate: a.lastCaredDate || null,
      completed: a.completed,
      gx: a.gx,
      gy: a.gy,
      attachedBuilding: a.attachedBuilding || null
    }));
    localStorage.setItem(STORAGE_KEY_ANIMALS, JSON.stringify(serialized));
  } catch (err) {
    console.error('Failed to save animals:', err);
  }
}

export function createAnimal(type, gx, gy, name = '', customNote = '', attachedBuilding = null) {
  const defaultNames = {
    chicken: 'תרנגולת',
    cat: 'חתול',
    dog: 'כלבלב',
    sheep: 'כבשה',
    duck: 'ברווז',
    rabbit: 'ארנב'
  };

  return {
    id: `animal_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    type,
    name: name || defaultNames[type] || 'חיה כפרית',
    customNote: customNote || '',
    customEmoji: '',
    lastCaredDate: null,
    completed: false,
    gx,
    gy,
    currGx: gx,
    currGy: gy,
    startGx: gx,
    startGy: gy,
    targetGx: gx,
    targetGy: gy,
    progress: 1,
    facingLeft: Math.random() > 0.5,
    walkCycle: 0,
    hopY: 0,
    state: 'idle',
    idleTimer: Math.floor(60 + Math.random() * 100),
    attachedBuilding
  };
}

export function updateAnimalsSimulation(animals, dt, isTileClearedFn, placedObjects = [], gridSize = 26) {
  animals.forEach(a => {
    // 1. Moving between tiles
    if (a.progress < 1) {
      const speed = (a.type === 'dog' ? 0.016 : (a.type === 'cat' ? 0.012 : (a.type === 'rabbit' ? 0.015 : 0.009))) * (dt / (1 / 60));
      a.progress = Math.min(1, a.progress + speed);
      a.walkCycle = (a.walkCycle + 0.28) % (Math.PI * 2);

      // Smooth grid interpolation
      a.currGx = a.startGx + (a.targetGx - a.startGx) * a.progress;
      a.currGy = a.startGy + (a.targetGy - a.startGy) * a.progress;

      // Rabbit / Chicken Hop
      if (a.type === 'rabbit' || a.type === 'chicken') {
        a.hopY = -Math.abs(Math.sin(a.progress * Math.PI)) * (a.type === 'rabbit' ? 6 : 3.5);
      } else {
        a.hopY = 0;
      }

      if (a.progress >= 1) {
        a.gx = a.targetGx;
        a.gy = a.targetGy;
        a.currGx = a.gx;
        a.currGy = a.gy;
        a.hopY = 0;
        a.state = 'idle';
        a.idleTimer = Math.floor(50 + Math.random() * 140);
      }
    } else {
      // 2. Idle / Pecking / Grazing state
      a.idleTimer = (a.idleTimer || 60) - 1;

      // Special idle actions
      if (a.type === 'chicken' && a.idleTimer > 20 && a.idleTimer < 80) {
        a.state = 'pecking';
      } else {
        a.state = 'idle';
      }

      // Check if animal is on water (swimming duck)
      const onWater = placedObjects.some(o => (o.type === 'river_tile' || o.type === 'water_lily_pond') && o.gx === a.gx && o.gy === a.gy);
      if (a.type === 'duck' && onWater) {
        a.state = 'swimming';
      }

      // Collision check helper: walls and fences block animal movement!
      const isBlockedByWall = (tx, ty) => placedObjects.some(o => 
        o.gx === tx && o.gy === ty && (
          o.type === 'stone_wall' || 
          o.type === 'wooden_fence' || 
          o.type === 'fence' || 
          o.type.includes('wall')
        )
      );

      // If an animal is currently on a wall (e.g. wall was just placed on it), wake up immediately to step off
      if (isBlockedByWall(a.gx, a.gy)) {
        a.idleTimer = 0;
      }

      if (a.idleTimer <= 0) {
        // Pick an adjacent step within cleared land that is NOT blocked by walls/fences
        const deltas = [
          [-1, 0], [1, 0], [0, -1], [0, 1],
          [-1, -1], [1, 1], [-1, 1], [1, -1]
        ].sort(() => Math.random() - 0.5);

        let chosen = null;
        for (const [dx, dy] of deltas) {
          const nx = a.gx + dx;
          const ny = a.gy + dy;
          if (nx >= 1 && nx < gridSize - 1 && ny >= 1 && ny < gridSize - 1) {
            if (isTileClearedFn(nx, ny) && !isBlockedByWall(nx, ny)) {
              // Prevent slipping diagonally through corner seams between two walls/fences
              if (dx !== 0 && dy !== 0) {
                if (isBlockedByWall(a.gx + dx, a.gy) && isBlockedByWall(a.gx, a.gy + dy)) {
                  continue;
                }
              }

              // If attached to a building, prefer staying within 4.5 tiles radius
              if (a.attachedBuilding) {
                const bDist = Math.hypot(nx - a.attachedBuilding.gx, ny - a.attachedBuilding.gy);
                if (bDist > 4.5) continue;
              }
              chosen = { nx, ny };
              break;
            }
          }
        }

        if (chosen) {
          a.startGx = a.gx;
          a.startGy = a.gy;
          a.targetGx = chosen.nx;
          a.targetGy = chosen.ny;
          a.progress = 0;
          const dScreenX = (chosen.nx - chosen.ny) - (a.gx - a.gy);
          if (dScreenX < 0) a.facingLeft = true;
          else if (dScreenX > 0) a.facingLeft = false;
        } else {
          a.idleTimer = Math.floor(60 + Math.random() * 100);
        }
      }
    }
  });
}
