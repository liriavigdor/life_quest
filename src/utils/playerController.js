/**
 * Player Controller & Pathfinding Engine for Life Quest
 * Inspired by Stardew Valley & Classic RPGs:
 * - Direct responsive keyboard controls (WASD / Arrows)
 * - Click / Tap to Move with A* pathfinding and obstacle avoidance
 * - Smart walk-to-interact for buildings, animals, and items
 * - Golden destination rune / ripple feedback
 * - High performance (zero heavy loops per frame)
 */

import { sounds } from './sound';

// Non-walkable categories/types
export const WALKABLE_SURFACES = new Set([
  'cobblestone_road',
  'stone_path',
  'wood_path',
  'brick_path',
  'dirt_trail',
  'wooden_bridge',
  'stepping_stones',
  'flower_carpet',
  'cultivated_plot_tile'
]);

/**
 * Checks whether a tile (gx, gy) can be walked on by the player character.
 */
export function isTileWalkable(gx, gy, { checkClearing, placedObjects = [], gridSize = 32 }) {
  // Must be within grid bounds
  if (gx < 2 || gx >= gridSize - 2 || gy < 2 || gy >= gridSize - 2) {
    return false;
  }

  // Must be in unlocked/cultivated clearing
  if (checkClearing && !checkClearing(gx, gy)) {
    return false;
  }

  // Check placed objects at this tile
  const obj = placedObjects.find(o => o.gx === gx && o.gy === gy);
  if (!obj) {
    // Empty grass tile inside clearing is always walkable!
    return true;
  }

  // Paths and bridges are walkable
  if (WALKABLE_SURFACES.has(obj.type) || obj.type?.includes('path') || obj.type?.includes('road') || obj.type?.includes('bridge')) {
    return true;
  }

  // Swimming is allowed in river tiles or ponds
  if (obj.type === 'river_tile' || obj.type === 'water_lily_pond') {
    return true;
  }

  // Large buildings, walls, trees, fences, boulders are solid obstacles
  return false;
}

/**
 * Lightweight A* Pathfinding for bounded 2D Isometric Grids.
 * Returns array of {gx, gy} points from start to goal (excluding start).
 */
export function findPath(start, goal, isWalkableFn, gridSize = 32) {
  if (start.gx === goal.gx && start.gy === goal.gy) return [];

  // Manhattan heuristic
  const h = (a, b) => Math.abs(a.gx - b.gx) + Math.abs(a.gy - b.gy);

  const key = (gx, gy) => `${gx},${gy}`;
  const startKey = key(start.gx, start.gy);
  const goalKey = key(goal.gx, goal.gy);

  // If goal tile is solid (e.g. user clicked a house), find the closest walkable neighbor!
  let targetGoal = goal;
  if (!isWalkableFn(goal.gx, goal.gy)) {
    const neighbors = [
      { gx: goal.gx, gy: goal.gy + 1 }, // South
      { gx: goal.gx + 1, gy: goal.gy }, // East
      { gx: goal.gx - 1, gy: goal.gy }, // West
      { gx: goal.gx, gy: goal.gy - 1 }, // North
      { gx: goal.gx + 1, gy: goal.gy + 1 },
      { gx: goal.gx - 1, gy: goal.gy - 1 }
    ].filter(n => isWalkableFn(n.gx, n.gy));

    if (neighbors.length === 0) return [];
    // Pick neighbor closest to start
    neighbors.sort((a, b) => h(start, a) - h(start, b));
    targetGoal = neighbors[0];
  }

  const openSet = [{ ...start, f: h(start, targetGoal), g: 0 }];
  const cameFrom = new Map();
  const gScore = new Map();
  gScore.set(startKey, 0);

  const closedSet = new Set();
  let iterations = 0;
  const maxIterations = 350; // Safety guard for instant calculation (<0.5ms)

  // 8-directional movement deltas
  const deltas = [
    { dx: 0, dy: 1, cost: 1 },
    { dx: 1, dy: 0, cost: 1 },
    { dx: 0, dy: -1, cost: 1 },
    { dx: -1, dy: 0, cost: 1 },
    { dx: 1, dy: 1, cost: 1.41 },
    { dx: -1, dy: -1, cost: 1.41 },
    { dx: 1, dy: -1, cost: 1.41 },
    { dx: -1, dy: 1, cost: 1.41 }
  ];

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const currKey = key(current.gx, current.gy);

    if (current.gx === targetGoal.gx && current.gy === targetGoal.gy) {
      // Reconstruct path
      const path = [];
      let tempKey = currKey;
      while (cameFrom.has(tempKey)) {
        const prev = cameFrom.get(tempKey);
        const [gx, gy] = tempKey.split(',').map(Number);
        path.unshift({ gx, gy });
        tempKey = key(prev.gx, prev.gy);
      }
      return path;
    }

    closedSet.add(currKey);

    for (const { dx, dy, cost } of deltas) {
      const nx = current.gx + dx;
      const ny = current.gy + dy;
      const nKey = key(nx, ny);

      if (closedSet.has(nKey)) continue;
      if (!isWalkableFn(nx, ny)) continue;

      // Diagonal corner cutting check: don't squeeze through two blocked orthogonals
      if (dx !== 0 && dy !== 0) {
        if (!isWalkableFn(current.gx + dx, current.gy) && !isWalkableFn(current.gx, current.gy + dy)) {
          continue;
        }
      }

      const tentativeG = gScore.get(currKey) + cost;

      if (!gScore.has(nKey) || tentativeG < gScore.get(nKey)) {
        cameFrom.set(nKey, current);
        gScore.set(nKey, tentativeG);
        const f = tentativeG + h({ gx: nx, gy: ny }, targetGoal);

        const existingOpen = openSet.find(n => n.gx === nx && n.gy === ny);
        if (!existingOpen) {
          openSet.push({ gx: nx, gy: ny, f, g: tentativeG });
        } else if (tentativeG < existingOpen.g) {
          existingOpen.g = tentativeG;
          existingOpen.f = f;
        }
      }
    }
  }

  return [];
}

/**
 * Click Destination Visual Indicator (Stardew-style glowing ring on ground)
 */
export function drawDestinationIndicator(ctx, indicator, toScreen, origin, zoom = 1, TILE_W = 68, TILE_H = 34) {
  if (!indicator || !indicator.active) return;

  const now = Date.now();
  const elapsed = (now - indicator.createdAt) / 1000;
  if (elapsed > 1.8) {
    indicator.active = false;
    return;
  }

  const { x: sx, y: sy } = toScreen(indicator.gx, indicator.gy, origin.x, origin.y);
  const cx = origin.x + (sx - origin.x) * zoom;
  const cy = origin.y + (sy + TILE_H / 2 - origin.y) * zoom;

  ctx.save();
  ctx.translate(cx, cy);

  const alpha = Math.max(0, 1 - elapsed / 1.8);
  const pulse = Math.sin(elapsed * 10) * 0.15;
  const rx = (TILE_W * 0.38 + pulse * 4) * zoom;
  const ry = (TILE_H * 0.38 + pulse * 2) * zoom;

  // Outer glowing pulse ring
  ctx.beginPath();
  ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(250, 204, 21, ${alpha * 0.85})`;
  ctx.lineWidth = 2.4 * zoom;
  ctx.setLineDash([4 * zoom, 3 * zoom]);
  ctx.lineDashOffset = -elapsed * 20;
  ctx.stroke();

  // Inner soft golden highlight
  ctx.beginPath();
  ctx.ellipse(0, 0, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(253, 224, 71, ${alpha * 0.28})`;
  ctx.fill();

  // Gentle center golden sparkle
  ctx.beginPath();
  ctx.arc(0, 0, 2.8 * zoom, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.95})`;
  ctx.fill();

  ctx.restore();
}

/**
 * Creates and initializes the active Player Controller.
 */
export class PlayerController {
  constructor(villagerRef, options = {}) {
    this.villagerRef = villagerRef;
    this.options = options;
    this.path = [];
    this.destinationMarker = null;
    this.pendingAction = null;
    this.heldKeys = new Set();
    this.walkSpeed = 3.3; // Agile, fluid Stardew pace (tiles/sec)
    this.isManualMoving = false;

    this.onKeyDown = this.handleKeyDown.bind(this);
    this.onKeyUp = this.handleKeyUp.bind(this);
  }

  attachListeners() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  detachListeners() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  isTypingInInput() {
    const active = document.activeElement;
    if (!active) return false;
    const tag = active.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || active.isContentEditable;
  }

  handleKeyDown(e) {
    if (this.isTypingInInput()) return;

    if (e.code === 'Space' || e.code === 'Enter') {
      if (this.options.onProximityInteract) {
        const placed = this.options.getPlacedObjects ? this.options.getPlacedObjects() : [];
        const animals = this.options.getAnimals ? this.options.getAnimals() : [];
        const interactable = this.getNearbyInteractable(placed, animals);
        if (interactable) {
          e.preventDefault();
          this.options.onProximityInteract(interactable);
          return;
        }
      }
    }

    const validKeys = [
      'KeyW', 'KeyS', 'KeyA', 'KeyD',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ];

    if (validKeys.includes(e.code)) {
      e.preventDefault();
      this.heldKeys.add(e.code);
      this.path = []; // Cancel any click path on keyboard override
      this.destinationMarker = null;
    }
  }

  handleKeyUp(e) {
    this.heldKeys.delete(e.code);
  }

  /**
   * Sets a destination waypoint using Click / Tap to move.
   */
  moveTo(targetGx, targetGy, { checkClearing, placedObjects, gridSize }, pendingAction = null) {
    const v = this.villagerRef.current;
    if (!v) return false;

    const start = { gx: Math.round(v.currGx), gy: Math.round(v.currGy) };
    const isWalkableFn = (gx, gy) => isTileWalkable(gx, gy, { checkClearing, placedObjects, gridSize });

    const computedPath = findPath(start, { gx: targetGx, gy: targetGy }, isWalkableFn, gridSize);
    if (computedPath.length > 0) {
      this.path = computedPath;
      this.pendingAction = pendingAction;
      this.destinationMarker = {
        gx: targetGx,
        gy: targetGy,
        createdAt: Date.now(),
        active: true
      };
      sounds.playTap();
      return true;
    } else {
      // If clicking directly on adjacent building, trigger action immediately
      const dist = Math.hypot(start.gx - targetGx, start.gy - targetGy);
      if (dist <= 1.5 && pendingAction) {
        pendingAction();
        return true;
      }
    }
    return false;
  }

  /**
   * Main Per-Frame Update (Continuous sub-frame time chaining, zero freeze at tile boundaries, 60fps).
   */
  update(dt, { checkClearing, placedObjects, gridSize, onReachAction }) {
    const v = this.villagerRef.current;
    if (!v) return;

    const isWalkableFn = (gx, gy) => isTileWalkable(gx, gy, { checkClearing, placedObjects, gridSize });

    let remainingDt = Math.min(0.08, dt); // Protect against background tab spikes
    let safetyLoop = 0;

    const hasActiveKey = this.heldKeys.size > 0 && !this.isTypingInInput();
    const hasPath = this.path.length > 0;
    const isMovingRequested = (v.progress < 1) || hasActiveKey || hasPath;
    v.isWalking = isMovingRequested;

    while (remainingDt > 0.0001 && safetyLoop < 4) {
      safetyLoop++;

      // 1. Advance along current tile segment
      if (v.progress < 1) {
        const dx = v.targetGx - v.startGx;
        const dy = v.targetGy - v.startGy;
        const gridDist = Math.hypot(dx, dy) || 1;
        const duration = gridDist / this.walkSpeed;
        const stepProg = remainingDt / duration;

        if (v.progress + stepProg < 0.999) {
          // Still in this tile segment
          v.progress += stepProg;
          v.currGx = v.startGx + dx * v.progress;
          v.currGy = v.startGy + dy * v.progress;
          v.walkCycle += Math.PI * 2 * this.walkSpeed * remainingDt;
          v.hopY = 0;
          remainingDt = 0;
          break;
        } else {
          // Arrived at tile boundary: consume exact time to reach 1.0 and roll remainder into next step
          const timeUsed = (1 - v.progress) * duration;
          remainingDt = Math.max(0, remainingDt - timeUsed);
          v.walkCycle += Math.PI * 2 * this.walkSpeed * timeUsed;
          v.progress = 1;
          v.gx = v.targetGx;
          v.gy = v.targetGy;
          v.currGx = v.targetGx;
          v.currGy = v.targetGy;
          v.hopY = 0;
        }
      }

      // 2. We are at integer tile (v.progress === 1). Check if next step exists immediately!
      let nextTarget = null;

      if (this.path.length > 0) {
        nextTarget = this.path.shift();
        if (this.path.length === 0) {
          if (this.destinationMarker) this.destinationMarker.active = false;
          if (this.pendingAction) {
            const act = this.pendingAction;
            this.pendingAction = null;
            act();
          }
        }
      } else if (this.heldKeys.size > 0 && !this.isTypingInInput()) {
        let kdx = 0;
        let kdy = 0;

        if (this.heldKeys.has('KeyW') || this.heldKeys.has('ArrowUp')) kdx -= 1;
        if (this.heldKeys.has('KeyS') || this.heldKeys.has('ArrowDown')) kdx += 1;
        if (this.heldKeys.has('KeyA') || this.heldKeys.has('ArrowLeft')) kdy += 1;
        if (this.heldKeys.has('KeyD') || this.heldKeys.has('ArrowRight')) kdy -= 1;

        kdx = Math.sign(kdx);
        kdy = Math.sign(kdy);

        if (kdx !== 0 || kdy !== 0) {
          const testGx = v.gx + kdx;
          const testGy = v.gy + kdy;
          if (isWalkableFn(testGx, testGy)) {
            nextTarget = { gx: testGx, gy: testGy };
          } else {
            // Smooth sliding if diagonal is blocked
            if (kdx !== 0 && kdy !== 0) {
              if (isWalkableFn(v.gx + kdx, v.gy)) {
                nextTarget = { gx: v.gx + kdx, gy: v.gy };
              } else if (isWalkableFn(v.gx, v.gy + kdy)) {
                nextTarget = { gx: v.gx, gy: v.gy + kdy };
              }
            }
          }
        }
      }

      if (nextTarget) {
        // Immediately start next tile step without 1-frame pause!
        const dScreenX = (nextTarget.gx - nextTarget.gy) - (v.gx - v.gy);
        if (dScreenX < 0) v.facingLeft = true;
        else if (dScreenX > 0) v.facingLeft = false;

        v.startGx = v.gx;
        v.startGy = v.gy;
        v.targetGx = nextTarget.gx;
        v.targetGy = nextTarget.gy;
        v.progress = 0;
        v.isWalking = true;
      } else {
        // Movement complete, character at rest
        v.isWalking = false;
        v.hopY = 0;
        break;
      }
    }
  }

  /**
   * Checks for adjacent interactive objects (buildings, animals).
   */
  getNearbyInteractable(placedObjects = [], animals = []) {
    const v = this.villagerRef.current;
    if (!v) return null;

    const currGx = Math.round(v.currGx);
    const currGy = Math.round(v.currGy);

    // Check adjacent buildings
    for (const obj of placedObjects) {
      if (obj.hasInterior || obj.category === 'מבנים ובתים' || obj.type?.includes('coop') || obj.type?.includes('cabin') || obj.type?.includes('library') || obj.type?.includes('bakery')) {
        const d = Math.hypot(obj.gx - currGx, obj.gy - currGy);
        if (d <= 1.45) {
          return {
            type: 'building',
            target: obj,
            prompt: `היכנס אל ${obj.customName || obj.name || 'המבנה'} 🚪`,
            actionName: 'enter'
          };
        }
      }
    }

    // Check adjacent animals
    for (const a of animals) {
      const d = Math.hypot(a.currGx - currGx, a.currGy - currGy);
      if (d <= 1.4) {
        return {
          type: 'animal',
          target: a,
          prompt: `לטף את ${a.name || 'חיית הכפר'} ❤️`,
          actionName: 'pet'
        };
      }
    }

    return null;
  }
}
