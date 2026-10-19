import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  DoorOpen, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  Brain, 
  Compass,
  RotateCcw,
  Key,
  GitBranch,
  Layers,
  Dices,
  Lock,
  Unlock,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { 
  VectorAnchorToken,
  VECTOR_ANCHOR_TOKENS
} from './stardewArt/StardewVectorAssets';
import { BizarreStackingEngine, generatePegKeyword } from './stardewArt/BizarreStackingEngine';
import { BizarreStackingModal } from './stardewArt/BizarreStackingModal';
import { ComplexArchitectureSVG, ComplexLightingSVG } from './stardewArt/ComplexArchitecture';
import { StardewDoorsLayer, INTERIOR_DOORS_CONFIG } from './stardewArt/StardewDoors';
import { VillageQuickQuizModal } from './VillageQuickQuizModal';
import { DepositModal } from './DepositModal';
import { PhotoFrameModal } from './PhotoFrameModal';
import { MemoryHierarchyTreeModal } from './MemoryHierarchyTreeModal';
import { ActiveRecallLocker } from './ActiveRecallLocker';
import { ActiveRecallSingle } from './ActiveRecallSingle';
import { BizarreSortChallengeModal } from './BizarreSortChallengeModal';
import { 
  getChamberForPosition, 
  HOUSE_CHAMBERS, 
  getStoredDeposits 
} from '../utils/keyMethodStorage';
import {
  COMPLEX_PAD,
  COMPLEX_WORLD_W,
  COMPLEX_WORLD_H,
  resolveMove,
  snapToWalkable,
  buildRoute,
  computeCamera
} from '../utils/complexNavigation';

// Fixed furniture positions for memory locus discovery (Stardew Valley strategy)
export const LOCKER_POSITIONS = {
  entry_foyer: { x: 505, y: 490, name: 'חדר כניסה (מבואה נייטרלית)' },
  left_store: { x: 195, y: 190, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 595, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
  right_sanctuary: { x: 960, y: 260, name: 'חדר שגרה (היכל השלווה)' }
};

export const WALL_PHOTO_POSITIONS = {
  left_store: { x: 280, y: 88, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 605, y: 56, name: 'חדר בטיפול (האולם המרכזי)' },
  entry_foyer: { x: 600, y: 350, name: 'חדר כניסה (מבואה נייטרלית)' },
  right_sanctuary: { x: 1005, y: 105, name: 'חדר שגרה (היכל השלווה)' }
};

// Helper to detect if coordinates are resting on a thick woven Area Rug
const isOnAreaRug = (x, y) => {
  // The architectural shell is intentionally empty: no rugs exist.
  return false;
};

export function StardewInstitutionComplex({
  building,
  catalogItem,
  onClose,
  villagerLook = {},
  currentOutfit = 'autumn_sweater',
  onSwitchToCabin
}) {
  const isGym = building?.type === 'gym' || catalogItem?.id === 'gym' || catalogItem?.renderType === 'gym' || building?.id === 'gym';

  // Persistent storage key
  const storageKey = `lifequest_institution_complex_loci_${building?.gx || 0}_${building?.gy || 0}`;

  // Clean loci state - empty by default for the user to edit their own visual anchors
  const [lociData, setLociData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    const initialGymItems = [
      { id: '1', text: 'טלפון', completed: false },
      { id: '2', text: 'משקפי שמש', completed: false },
      { id: '3', text: 'חולצה להחלפה', completed: false },
      { id: '4', text: 'בקבוק מים', completed: false },
      { id: '5', text: 'משקולת', completed: false },
      { id: '6', text: 'תיק אימון', completed: false }
    ];

    return {
      fixedLoci: {
        shop_counter: { id: 'shop_counter', name: isGym ? 'דלפק הציוד והקבלה' : 'דלפק החנות והקופה', icon: isGym ? 'dumbbell' : 'scroll', title: '', note: '', lastCultivated: null },
        shelf_top: { id: 'shelf_top', name: isGym ? 'לוקר עליון ומדף ציוד' : 'מדף עליון בחנות', icon: isGym ? 'backpack' : 'potion', title: '', note: '', lastCultivated: null },
        shelf_bottom: { id: 'shelf_bottom', name: isGym ? 'מדף משקולות תחתון' : 'מדף תחתון בחנות', icon: isGym ? 'dumbbell' : 'bread', title: '', note: '', lastCultivated: null },
        produce_bin: { id: 'produce_bin', name: isGym ? 'ארגז כדורי כוח ומגבות' : 'ארגז תוצרת טרייה', icon: isGym ? 'shield' : 'wheat', title: '', note: '', lastCultivated: null },
        notice_board: { 
          id: 'notice_board', 
          name: isGym ? 'לוח תוכניות ורשימת אימון' : 'לוח מודעות ומגדל זיכרון', 
          icon: 'book', 
          title: isGym ? 'ציוד אימון (אבא)' : 'רשימת אימון (אבא)', 
          items: initialGymItems
        },
        grand_hearth: { id: 'grand_hearth', name: isGym ? 'אח החימום וההתאוששות' : 'אח האבן המרכזית', icon: 'star', title: '', note: '', lastCultivated: null },
        community_carpet: { id: 'community_carpet', name: isGym ? 'משטח המתיחות והתרגילים' : 'השטיח העגול בסלון', icon: 'compass', title: '', note: '', lastCultivated: null },
        tea_table: { id: 'tea_table', name: isGym ? 'שולחן תה התאוששות וחלבון' : 'שולחן המפגש והתה', icon: 'coffee', title: '', note: '', lastCultivated: null },
        golden_altar: { id: 'golden_altar', name: isGym ? 'במת הניצחונות והמדליות' : 'מזבח הזהב והקריסטל', icon: 'gem', title: '', note: '', lastCultivated: null },
        shrine_benches: { id: 'shrine_benches', name: isGym ? 'ספסלי מנוחה ונשימה' : 'ספסלי הקטיפה בהיכל', icon: 'shield', title: '', note: '', lastCultivated: null }
      },
      bizarreStackConfig: {
        activePresetId: isGym ? 'gym_dad' : 'gym_dad',
        activeTitle: isGym ? 'ציוד אימון כושר של אבא 🏋️' : 'רשימת מגדל זיכרון אישי',
        items: initialGymItems,
        targetLocus: 'shelf_top'
      },
      customAnchors: []
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(lociData));
    } catch (e) {
      console.error(e);
    }
  }, [lociData, storageKey]);

  // Active Locus Editor Modal
  const [editingLocusKey, setEditingLocusKey] = useState(null);
  const [locusFormIcon, setLocusFormIcon] = useState('key');
  const [locusFormTitle, setLocusFormTitle] = useState('');
  const [locusFormNote, setLocusFormNote] = useState('');
  const [locusFormUrgency, setLocusFormUrgency] = useState('yellow');
  const [locusFormBizarreStory, setLocusFormBizarreStory] = useState('');

  // Custom Bizarre Stacking Manager Modal
  const [isStackingModalOpen, setIsStackingModalOpen] = useState(false);

  const handleUpdateStackConfig = (newCfg) => {
    setLociData(prev => ({
      ...prev,
      bizarreStackConfig: {
        ...(prev.bizarreStackConfig || {}),
        ...newCfg
      }
    }));
    showToast('מגדל הזיכרון עודכן בהצלחה! ⚡');
  };

  // Notice board new item
  const [newBoardItem, setNewBoardItem] = useState('');

  // Custom Anchor Modal
  const [isAddingCustomAnchor, setIsAddingCustomAnchor] = useState(false);
  const [customFormIcon, setCustomFormIcon] = useState('key');
  const [customFormTitle, setCustomFormTitle] = useState('');
  const [customFormNote, setCustomFormNote] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  // Player Positioning & Real-time Canvas Rendering
  const playerPosRef = useRef({ x: 595, y: 510 });
  const isWalkingRef = useRef(false);
  const facingLeftRef = useRef(false);
  const walkCycleRef = useRef(0);
  const heldKeysRef = useRef(new Set());
  const destinationMarkerRef = useRef(null);
  const playerTargetRef = useRef(null);
  const routeRef = useRef([]);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

  const villagerLookRef = useRef(villagerLook);
  useEffect(() => { villagerLookRef.current = villagerLook; }, [villagerLook]);

  const currentOutfitRef = useRef(currentOutfit);
  useEffect(() => { currentOutfitRef.current = currentOutfit; }, [currentOutfit]);

  // Key Method State (שיטת המפתחות)
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [selectedWallPhotoRoom, setSelectedWallPhotoRoom] = useState(null);
  const [isHierarchyTreeOpen, setIsHierarchyTreeOpen] = useState(false);
  const [modalTargetRoom, setModalTargetRoom] = useState(null);
  const [storedDeposits, setStoredDeposits] = useState(() => getStoredDeposits());
  const [inspectingLockerData, setInspectingLockerData] = useState(null);
  const [isRoomChallengeOpen, setIsRoomChallengeOpen] = useState(false);

  // Stardew Valley Proximity Discovery State:
  // Contents of lockers and wall frames remain concealed until the player approaches!
  const [nearObjectId, setNearObjectId] = useState(null);
  const nearObjectIdRef = useRef(null);
  const [hoveredObjectId, setHoveredObjectId] = useState(null);

  const roomItemsForChallenge = useMemo(() => {
    if (!inspectingLockerData?.deposits) return [];
    const list = [];
    inspectingLockerData.deposits.forEach(d => {
      if (d.type === 'list' && Array.isArray(d.items)) {
        d.items.forEach(it => list.push(it));
      } else if (d.itemName) {
        list.push({ id: d.id, name: d.itemName });
      }
    });
    return list;
  }, [inspectingLockerData]);

  useEffect(() => {
    const handleUpdate = () => setStoredDeposits(getStoredDeposits());
    window.addEventListener('lifequest_deposits_updated', handleUpdate);
    return () => window.removeEventListener('lifequest_deposits_updated', handleUpdate);
  }, []);

  // Controlled Cognitive Interior Progression:
  // Starts with only Room 1 (entry_foyer) unlocked and 100% lit.
  // All other rooms are dimmed by 65% behind physical closed 2.5D wooden doors.
  // Mastering Room 1 unlocks door_c3, lifts the darkness veil, and illuminates the Grand Hall.
  const interiorMasteryKey = `lifequest_interior_mastery_${building?.id || 'main'}`;
  const [interiorMastery, setInteriorMastery] = useState(() => {
    try {
      const saved = localStorage.getItem(interiorMasteryKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      unlockedRooms: ['entry_foyer'],
      masteredRooms: [],
      doors: {
        door_c3: true,
        door_c1: true,
        door_c2: true,
        door_east_south: true
      }
    };
  });

  const doorsRef = useRef(interiorMastery.doors);
  useEffect(() => {
    doorsRef.current = interiorMastery.doors;
    try {
      localStorage.setItem(interiorMasteryKey, JSON.stringify(interiorMastery));
    } catch (e) {
      console.error(e);
    }
  }, [interiorMastery, interiorMasteryKey]);

  // Active quiz state for unlocking doors via fast Active Recall Check
  const [activeQuizDoor, setActiveQuizDoor] = useState(null);

  const handleDoorClick = (door, isLocked) => {
    if (!isLocked) {
      showToast(`דלת ${door.toRoomName} פתוחה לרווחה ✨`);
      return;
    }
    setActiveQuizDoor(door);
  };

  const handlePassDoorQuiz = (door) => {
    sounds.playLevelUp?.();
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {}

    setInteriorMastery(prev => {
      const nextDoors = { ...prev.doors, [door.id]: false };
      const nextUnlocked = Array.from(new Set([...prev.unlockedRooms, door.toRoom]));
      const nextMastered = Array.from(new Set([...prev.masteredRooms, door.requiredRoom]));
      return {
        doors: nextDoors,
        unlockedRooms: nextUnlocked,
        masteredRooms: nextMastered
      };
    });

    showToast(`שליטה ב${door.fromRoomName} אומתה! דלת ${door.toRoomName} נפתחה והחדר הואר במלואו 💡`);
    setActiveQuizDoor(null);
  };



  // Full-screen responsive fit scale
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const [fitScale, setFitScale] = useState(1);

  // Dynamically calculate scale to fit the entire structure inside the screen
  useEffect(() => {
    const updateScale = () => {
      if (stageRef.current) {
        const sw = stageRef.current.clientWidth;
        const sh = stageRef.current.clientHeight;
        if (sw > 0 && sh > 0) {
          const scale = Math.min((sw - 16) / COMPLEX_WORLD_W, (sh - 16) / COMPLEX_WORLD_H);
          setFitScale(Math.max(0.35, scale));
        }
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    const ro = new ResizeObserver(updateScale);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => {
      window.removeEventListener('resize', updateScale);
      ro.disconnect();
    };
  }, []);

  // Keyboard navigation event listeners
  useEffect(() => {
    const validKeys = new Set([
      'KeyW', 'KeyS', 'KeyA', 'KeyD',
      'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'
    ]);

    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        checkProximityInteraction();
        return;
      }

      if (e.code === 'Escape') {
        if (editingLocusKey || isAddingCustomAnchor) {
          setEditingLocusKey(null);
          setIsAddingCustomAnchor(false);
        } else {
          onClose();
        }
        return;
      }

      if (validKeys.has(e.code)) {
        e.preventDefault();
        heldKeysRef.current.add(e.code);
        // Manual keyboard cancels mouse click routing immediately
        playerTargetRef.current = null;
        routeRef.current = [];
        if (destinationMarkerRef.current) {
          destinationMarkerRef.current.active = false;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (validKeys.has(e.code)) {
        heldKeysRef.current.delete(e.code);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editingLocusKey, isAddingCustomAnchor, onClose]);

  // Active navigation only: Click-to-move disabled by design (WASD / Arrow keys navigation)
  const handleFloorClick = (e) => {
    // Active navigation only - clicks on floor do not move the character
    return;
  };

  // Continuous 60fps Autonomous Physics & Canvas Rendering Engine
  useEffect(() => {
    let isCancelled = false;
    let lastTime = performance.now();
    let throttleTimer = 0;

    const loop = (time) => {
      if (isCancelled) return;

      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(0.06, Math.max(0.001, rawDt));

      const curPos = playerPosRef.current;
      const heldKeys = heldKeysRef.current;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      const walkSpeed = 235; // Agile, fluid Stardew pace (px/sec)

      // 1. KEYBOARD NAVIGATION
      if (heldKeys.size > 0 && !isTyping) {
        let kdx = 0;
        let kdy = 0;

        if (heldKeys.has('KeyW') || heldKeys.has('ArrowUp')) kdy -= 1;
        if (heldKeys.has('KeyS') || heldKeys.has('ArrowDown')) kdy += 1;
        if (heldKeys.has('KeyA') || heldKeys.has('ArrowLeft')) kdx -= 1;
        if (heldKeys.has('KeyD') || heldKeys.has('ArrowRight')) kdx += 1;

        if (kdx !== 0 || kdy !== 0) {
          const len = Math.hypot(kdx, kdy);
          const stepDist = walkSpeed * dt;
          const vx = (kdx / len) * stepDist;
          const vy = (kdy / len) * stepDist;

          const next = resolveMove(curPos, vx, vy, doorsRef.current);

          if (kdx < 0) facingLeftRef.current = true;
          else if (kdx > 0) facingLeftRef.current = false;

          playerPosRef.current = next;
          isWalkingRef.current = (next.x !== curPos.x || next.y !== curPos.y);
          walkCycleRef.current += Math.PI * 2 * 3.4 * dt;

          // Village exit check
          if (next.x >= 550 && next.x <= 640 && next.y >= 570) {
            showToast('יציאה לכפר 🍃');
            setTimeout(() => onClose(), 160);
          }
        } else {
          isWalkingRef.current = false;
        }
      } 
      // 2. CLICK-TO-MOVE PATHFINDING
      else if (playerTargetRef.current) {
        const target = playerTargetRef.current;
        const dx = target.x - curPos.x;
        const dy = target.y - curPos.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= 6) {
          playerPosRef.current = { x: target.x, y: target.y };
          if (routeRef.current.length > 0) {
            playerTargetRef.current = routeRef.current.shift();
          } else {
            playerTargetRef.current = null;
            isWalkingRef.current = false;
            if (destinationMarkerRef.current) {
              destinationMarkerRef.current.active = false;
            }
            if (target.x >= 550 && target.x <= 640 && target.y >= 570) {
              showToast('יציאה לכפר 🍃');
              setTimeout(() => onClose(), 160);
            }
          }
        } else {
          const stepDist = Math.min(dist, walkSpeed * dt);
          const vx = (dx / dist) * stepDist;
          const vy = (dy / dist) * stepDist;

          const next = resolveMove(curPos, vx, vy, doorsRef.current);

          if (dx < 0) facingLeftRef.current = true;
          else if (dx > 0) facingLeftRef.current = false;

          if (next.x === curPos.x && next.y === curPos.y) {
            if (routeRef.current.length > 0) {
              playerTargetRef.current = routeRef.current.shift();
            } else {
              playerTargetRef.current = null;
              isWalkingRef.current = false;
              if (destinationMarkerRef.current) {
                destinationMarkerRef.current.active = false;
              }
            }
          } else {
            playerPosRef.current = next;
            isWalkingRef.current = true;
            walkCycleRef.current += Math.PI * 2 * 3.4 * dt;
          }
        }
      } else {
        isWalkingRef.current = false;
      }

      // 2.5 STARDEW PROXIMITY DISCOVERY:
      // Furniture pieces conceal lists & photos until the player approaches nearby!
      const px = playerPosRef.current.x;
      const py = playerPosRef.current.y;
      let closestNear = null;
      let minD = 125;

      for (const [roomId, pos] of Object.entries(LOCKER_POSITIONS)) {
        const d = Math.hypot(px - (pos.x + 38), py - (pos.y + 45));
        if (d < minD) {
          minD = d;
          closestNear = `locker_${roomId}`;
        }
      }

      for (const [roomId, pos] of Object.entries(WALL_PHOTO_POSITIONS)) {
        const d = Math.hypot(px - pos.x, py - (pos.y + 70));
        if (d < minD) {
          minD = d;
          closestNear = `photo_${roomId}`;
        }
      }

      if (closestNear !== nearObjectIdRef.current) {
        nearObjectIdRef.current = closestNear;
        setNearObjectId(closestNear);
      }

      // 3. CANVAS DRAWING (Guaranteed single draw per frame, zero ghosts)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A. Draw Destination Marker
        const marker = destinationMarkerRef.current;
        if (marker && marker.active) {
          const elapsed = (time - marker.createdAt) / 1000;
          if (elapsed < 2.0) {
            const alpha = Math.max(0, 1 - elapsed / 2.0);
            const pulse = Math.sin(elapsed * 9) * 2.5;
            ctx.save();
            ctx.translate(marker.x, marker.y);

            // Pulsing golden ring
            ctx.beginPath();
            ctx.ellipse(0, 0, 18 + pulse, 9 + pulse * 0.5, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(250, 204, 21, ${alpha * 0.85})`;
            ctx.lineWidth = 2.2;
            ctx.setLineDash([4, 3]);
            ctx.lineDashOffset = -elapsed * 18;
            ctx.stroke();

            // Inner soft glow
            ctx.beginPath();
            ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(253, 224, 71, ${alpha * 0.3})`;
            ctx.fill();

            // Center spark
            ctx.beginPath();
            ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
            ctx.fill();

            ctx.restore();
          } else {
            marker.active = false;
          }
        }

        // B. Draw Player Character
        const p = playerPosRef.current;
        drawCompleteVillager(ctx, {
          cx: p.x,
          cy: p.y,
          scale: 1.72,
          outfit: currentOutfitRef.current,
          facingLeft: facingLeftRef.current,
          isWalking: isWalkingRef.current,
          walkCycle: walkCycleRef.current % (Math.PI * 2),
          look: villagerLookRef.current,
          timestamp: time,
          onRug: false
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      isCancelled = true;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [onClose]);

  // Physical stations / loci inside the 4 chambers
  const STATIONS = {
    shop_counter: { x: 140, y: 340, name: 'דלפק החנות', locusKey: 'shop_counter' },
    shelf_top: { x: 250, y: 220, name: 'מדף עליון בחנות', locusKey: 'shelf_top' },
    shelf_bottom: { x: 250, y: 320, name: 'מדף תחתון בחנות', locusKey: 'shelf_bottom' },
    produce_bin: { x: 100, y: 520, name: 'ארגז תוצרת', locusKey: 'produce_bin' },
    notice_board: { x: 340, y: 200, name: 'לוח מודעות ורשימות', locusKey: 'notice_board' },
    grand_hearth: { x: 630, y: 110, name: 'אח האבן המרכזית', locusKey: 'grand_hearth' },
    community_carpet: { x: 630, y: 240, name: 'השטיח העגול בסלון', locusKey: 'community_carpet' },
    tea_table: { x: 630, y: 310, name: 'שולחן המפגש', locusKey: 'tea_table' },
    golden_altar: { x: 1000, y: 200, name: 'מזבח הזהב והקריסטל', locusKey: 'golden_altar' },
    shrine_benches: { x: 1000, y: 420, name: 'ספסלי הקטיפה בהיכל', locusKey: 'shrine_benches' },
    exit_door: { x: 630, y: 615, name: 'יציאה לכפר', locusKey: null }
  };

  const getNearestStation = () => {
    let nearest = null;
    let minDist = 75;
    const p = playerPosRef.current;

    Object.entries(STATIONS).forEach(([key, loc]) => {
      const dist = Math.hypot(p.x - loc.x, p.y - loc.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = { key, ...loc, dist };
      }
    });

    return nearest;
  };

  const checkProximityInteraction = () => {
    const near = nearObjectIdRef.current;
    if (near) {
      if (near.startsWith('locker_')) {
        const roomId = near.replace('locker_', '');
        const pos = LOCKER_POSITIONS[roomId];
        const roomDeposits = storedDeposits.filter(d => d.roomId === roomId && d.type !== 'photo');
        sounds.playTap?.();
        if (roomDeposits.length > 0) {
          setInspectingLockerData({
            roomId,
            roomName: pos?.name || 'ארונית רשימות',
            deposits: roomDeposits
          });
        } else {
          setModalTargetRoom({ id: roomId, name: pos?.name || 'ארונית רשימות' });
          setIsDepositModalOpen(true);
        }
        return;
      }

      if (near.startsWith('photo_')) {
        const roomId = near.replace('photo_', '');
        const pos = WALL_PHOTO_POSITIONS[roomId];
        sounds.playTap?.();
        setSelectedWallPhotoRoom({ id: roomId, name: pos?.name || 'תמונה על הקיר' });
        setIsPhotoModalOpen(true);
        return;
      }
    }

    const nearest = getNearestStation();
    if (!nearest) return;
    if (nearest.key === 'exit_door') {
      onClose();
    } else {
      openLocusEditor(nearest.locusKey);
    }
  };

  const openLocusEditor = (locusKey) => {
    sounds.playTap?.();
    const current = lociData.fixedLoci[locusKey];
    if (current) {
      setLocusFormIcon(current.icon || 'key');
      setLocusFormTitle(current.title || '');
      setLocusFormNote(current.note || '');
      setLocusFormUrgency(current.urgency || (locusKey === 'shelf_top' || locusKey === 'shop_counter' ? 'red' : (locusKey === 'grand_hearth' || locusKey === 'community_carpet' ? 'yellow' : 'green')));
      setLocusFormBizarreStory(current.bizarreStory || (locusKey === 'shelf_top' ? (lociData.bizarreStory || 'משקפי השמש נפלו לתוך האבק ופתאום הטלפון צעק מתוך המגף...') : ''));
      setEditingLocusKey(locusKey);
    }
  };

  const handleSaveLocus = (e) => {
    e?.preventDefault();
    if (!editingLocusKey) return;
    sounds.playTap?.();

    setLociData(prev => ({
      ...prev,
      bizarreStory: (editingLocusKey === 'shelf_top' && locusFormBizarreStory.trim()) ? locusFormBizarreStory.trim() : (prev.bizarreStory || ''),
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          icon: locusFormIcon,
          title: locusFormTitle.trim(),
          note: locusFormNote.trim(),
          urgency: locusFormUrgency,
          bizarreStory: locusFormBizarreStory.trim(),
          lastCultivated: new Date().toISOString().split('T')[0]
        }
      }
    }));

    setEditingLocusKey(null);
    showToast('עוגן ויזואלי וסיפור עודכנו בהצלחה ✓');
  };

  const handleCultivateLocus = () => {
    if (!editingLocusKey) return;
    sounds.playTap?.();
    const today = new Date().toISOString().split('T')[0];
    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          lastCultivated: today
        }
      }
    }));
    showToast('עוגן זה רוענן בזיכרון (חזרתיות פעילה) 🧠✨');
  };

  const handleClearLocus = () => {
    if (!editingLocusKey) return;
    sounds.playTap?.();
    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          title: '',
          note: '',
          lastCultivated: null
        }
      }
    }));
    setEditingLocusKey(null);
    showToast('העוגן פונה מהמיקום ✓');
  };

  const handleToggleBoardItem = (idx) => {
    sounds.playTap?.();
    setLociData(prev => {
      const items = [...(prev.fixedLoci.notice_board?.items || [])];
      if (items[idx]) {
        items[idx].completed = !items[idx].completed;
      }
      return {
        ...prev,
        fixedLoci: {
          ...prev.fixedLoci,
          notice_board: {
            ...prev.fixedLoci.notice_board,
            items
          }
        }
      };
    });
  };

  const handleAddBoardItem = (e) => {
    e?.preventDefault();
    if (!newBoardItem.trim()) return;
    sounds.playTap?.();
    setLociData(prev => {
      const items = [...(prev.fixedLoci.notice_board?.items || [])];
      items.push({ id: Date.now().toString(), text: newBoardItem.trim(), completed: false });
      return {
        ...prev,
        fixedLoci: {
          ...prev.fixedLoci,
          notice_board: {
            ...prev.fixedLoci.notice_board,
            items
          }
        }
      };
    });
    setNewBoardItem('');
  };

  const handleRemoveBoardItem = (idx) => {
    sounds.playTap?.();
    setLociData(prev => {
      const items = (prev.fixedLoci.notice_board?.items || []).filter((_, i) => i !== idx);
      return {
        ...prev,
        fixedLoci: {
          ...prev.fixedLoci,
          notice_board: {
            ...prev.fixedLoci.notice_board,
            items
          }
        }
      };
    });
  };

  const handleClearBoardItems = () => {
    sounds.playTap?.();
    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        notice_board: {
          ...prev.fixedLoci.notice_board,
          items: []
        }
      }
    }));
    showToast('לוח הפריטים נוקה ✓');
  };

  const handleLoadGymPreset = () => {
    sounds.playTap?.();
    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        notice_board: {
          ...prev.fixedLoci.notice_board,
          title: 'רשימת אימון (כושר)',
          items: [
            { id: '1', text: 'טלפון', completed: false },
            { id: '2', text: 'משקפי שמש', completed: false },
            { id: '3', text: 'חולצה להחלפה', completed: false },
            { id: '4', text: 'בקבוק מים', completed: false }
          ]
        }
      }
    }));
    showToast('רשימת האימון נטענה אל מגדל הזיכרון! 🏋️');
  };

  const handleAddCustomAnchor = (e) => {
    e?.preventDefault();
    if (!customFormTitle.trim()) return;
    sounds.playTap?.();
    const newA = {
      id: Date.now().toString(),
      x: Math.round(playerPosRef.current.x),
      y: Math.round(playerPosRef.current.y),
      icon: customFormIcon,
      title: customFormTitle.trim(),
      note: customFormNote.trim(),
      lastCultivated: new Date().toISOString().split('T')[0]
    };
    setLociData(prev => ({
      ...prev,
      customAnchors: [...prev.customAnchors, newA]
    }));
    setCustomFormTitle('');
    setCustomFormNote('');
    setIsAddingCustomAnchor(false);
    showToast('עוגן ויזואלי חדש הוצב ברצפה 📌');
  };

  const handleRemoveCustomAnchor = (id) => {
    sounds.playTap?.();
    setLociData(prev => ({
      ...prev,
      customAnchors: prev.customAnchors.filter(a => a.id !== id)
    }));
    showToast('העוגן הוסר ✓');
  };

  // Active anchors count
  const activeCount = Object.values(lociData.fixedLoci).filter(l => l.title?.trim()).length + lociData.customAnchors.length;

  const activeStackItems = (lociData.bizarreStackConfig?.items || []).filter(item => !item.completed);
  const activePeg = generatePegKeyword(activeStackItems);



  return (
    <div className="stardew-void-viewport" onClick={() => {
      setEditingLocusKey(null);
      setIsAddingCustomAnchor(false);
    }}>
      {/* 1. Minimal Stardew Top HUD Bar — Zero Gratuitous Stimuli */}
      <header className="stardew-top-hud" onClick={e => e.stopPropagation()}>
        <div className="stardew-hud-left" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button 
            className="stardew-exit-pill-btn" 
            onClick={onClose}
            title="יציאה חזרה לחצר הכפר (Esc)"
          >
            <DoorOpen size={16} />
            <span>יציאה אל הכפר 🍃</span>
          </button>
          
          <div className="stardew-room-indicator">
            <span className="room-cottage-icon">{isGym ? '🏋️' : '🏛️'}</span>
            <span className="room-indicator-title">
              {isGym ? 'היכל הכושר והאימון' : (building?.customName || catalogItem?.name || 'מתחם הבית')}
            </span>
          </div>

          {/* Controlled Cognitive Interior Progression HUD badge */}
          <div className="interior-mastery-hud-pill" title="התקדמות קוגניטיבית מבוקרת בחלל הבית">
            <Lock size={13} className="text-amber" />
            <span>חדרים מוארים: {interiorMastery.unlockedRooms.length}/4</span>
          </div>
        </div>
      </header>


      {/* 3. Floating Notification Toast */}
      {toastMessage && (
        <div className="stardew-toast-banner animate-bounce-gentle" onClick={e => e.stopPropagation()}>
          <Sparkles size={16} className="text-amber" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. The Grand Multi-Chamber Burrow Complex Stage (Vector-Crafted!) */}
      <div 
        ref={stageRef}
        className="stardew-complex-stage"
        onClick={e => {
          e.stopPropagation();
          handleFloorClick(e);
        }}
      >
        <div 
          ref={worldRef} 
          className="complex-structure-frame"
          style={{ transform: `scale(${fitScale})` }}
        >
          <ComplexArchitectureSVG />


        {/* --- PLACED CUSTOM USER ANCHORS --- */}
        {lociData.customAnchors.map((anchor) => (
          <div 
            key={anchor.id}
            className="complex-placed-anchor"
            style={{ left: `${anchor.x - 16}px`, top: `${anchor.y - 16}px` }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveCustomAnchor(anchor.id);
            }}
            title={`${anchor.title}: ${anchor.note} (לחץ להסרה)`}
          >
            <div className="anchor-icon-circle">
              <VectorAnchorToken icon={anchor.icon} size={20} />
            </div>
            <span className="anchor-title-chip">{anchor.title}</span>
          </div>
        ))}

        {/* --- IN-ROOM AUTHENTIC PHYSICAL WOODEN LOCKER FURNITURE (DEDICATED FOR LISTS) --- */}
        {Object.entries(LOCKER_POSITIONS).map(([roomId, pos]) => {
          const roomDeposits = storedDeposits.filter(d => d.roomId === roomId && d.type !== 'photo');
          const hasDeposits = roomDeposits.length > 0;
          const latestDeposit = roomDeposits[roomDeposits.length - 1];
          const anchorEmoji = latestDeposit?.visualAnchor?.emoji || '🗄️';
          const anchorLabel = latestDeposit?.visualAnchor?.label || (hasDeposits ? `${roomDeposits.length} רשימות` : 'ארונית רשימות ריקה');
          const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
          const needsPractice = hasDeposits && roomDeposits.some(d => d.lastPracticed !== todayStr);
          const isNear = nearObjectId === `locker_${roomId}` || hoveredObjectId === `locker_${roomId}`;

          return (
            <div 
              key={roomId} 
              className="in-room-physical-locker-anchor"
              style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 26 }}
              onMouseEnter={() => setHoveredObjectId(`locker_${roomId}`)}
              onMouseLeave={() => setHoveredObjectId(null)}
            >
              {/* Proximity Interaction Prompt (Spacebar) */}
              {isNear && (
                <div 
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '-42px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.94)',
                    border: '1.5px solid #f59e0b',
                    borderRadius: '20px',
                    padding: '3px 10px',
                    whiteSpace: 'nowrap',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#fef08a',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    zIndex: 40,
                    pointerEvents: 'none'
                  }}
                >
                  <span style={{ background: '#78350f', padding: '1px 5px', borderRadius: '4px', fontSize: '0.68rem', color: '#fff' }}>רווח</span>
                  <span>{hasDeposits ? 'בדוק רשימה 📜' : 'הפקד רשימה ➕'}</span>
                </div>
              )}

              {/* Isometric Physical Wooden Locker Furniture Piece */}
              <div 
                className="physical-locker-furniture-piece"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap?.();
                  if (hasDeposits) {
                    setInspectingLockerData({
                      roomId,
                      roomName: pos.name,
                      deposits: roomDeposits
                    });
                  } else {
                    setModalTargetRoom({ id: roomId, name: pos.name });
                    setIsDepositModalOpen(true);
                  }
                }}
                title={hasDeposits ? `ארונית רשימות ${anchorEmoji} (${anchorLabel}) — לחץ לבדיקה` : `ארונית רשימות ריקה — לחץ להפקדת רשימה ודירוג`}
              >
                {/* Visual Anchor Token perched atop the locker - Revealed ONLY when approaching! */}
                {hasDeposits && latestDeposit?.visualAnchor?.emoji && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-16px',
                      left: '50%',
                      transform: isNear ? 'translateX(-50%) scale(1)' : 'translateX(-50%) scale(0.5)',
                      opacity: isNear ? 1 : 0,
                      pointerEvents: isNear ? 'auto' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: 'rgba(20, 15, 30, 0.88)',
                      border: '1.5px solid #f59e0b',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                      zIndex: 10
                    }}
                    title={`עוגן ויזואלי של הארונית: ${anchorLabel}`}
                  >
                    {latestDeposit.visualAnchor.emoji}

                    {/* Subtle floating repetition cue (💧) when review is due */}
                    {needsPractice && isNear && (
                      <div 
                        className="animate-bounce-gentle"
                        style={{
                          position: 'absolute',
                          top: '-18px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.82rem',
                          background: 'rgba(224, 242, 254, 0.95)',
                          border: '1px solid #38bdf8',
                          borderRadius: '50%',
                          width: '18px',
                          height: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(56, 189, 248, 0.6)'
                        }}
                        title="תרגול זיכרון יומי"
                      >
                        💧
                      </div>
                    )}
                  </div>
                )}

                <svg width="76" height="90" viewBox="0 0 76 90" className="locker-furniture-svg">
                  <defs>
                    <radialGradient id={`shadow-${roomId}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#000" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={`oakTop-${roomId}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="40%" stopColor="#d97706" />
                      <stop offset="80%" stopColor="#b45309" />
                      <stop offset="100%" stopColor="#78350f" />
                    </linearGradient>
                    <linearGradient id={`oakSide-${roomId}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3d1d05" />
                      <stop offset="100%" stopColor="#241206" />
                    </linearGradient>
                    <linearGradient id={`oakFace-${roomId}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#854d0e" />
                      <stop offset="40%" stopColor="#713f12" />
                      <stop offset="100%" stopColor="#3d1d05" />
                    </linearGradient>
                    <linearGradient id={`brassGold-${roomId}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="50%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#b45309" />
                    </linearGradient>
                  </defs>

                  {/* 1. Deep Ground Contact Shadow directly under base on floor/rug */}
                  <ellipse cx="38" cy="85" rx="36" ry="7.5" fill={`url(#shadow-${roomId})`} />

                  {/* 2. Plinth Baseboard at Bottom */}
                  <polygon points="8,75 68,75 65,84 11,84" fill="#241206" stroke="#120803" strokeWidth="1.2" />

                  {/* 3. 3D Left-Side Facet (showing physical cabinet depth) */}
                  <polygon points="2,6 10,24 10,78 2,72" fill={`url(#oakSide-${roomId})`} stroke="#1a0b03" strokeWidth="1.2" />
                  <line x1="2" y1="6" x2="10" y2="24" stroke="rgba(254, 240, 138, 0.25)" strokeWidth="0.8" />

                  {/* 4. Main Cabinet Box Front Face */}
                  <rect x="10" y="24" width="58" height="52" rx="2" fill={`url(#oakFace-${roomId})`} stroke="#241206" strokeWidth="1.6" />

                  {/* 5. PRONOUNCED 3/4 PERSPECTIVE TOP LID (18px deep horizontal surface) */}
                  <polygon points="2,6 74,6 68,24 10,24" fill={`url(#oakTop-${roomId})`} stroke="#241206" strokeWidth="1.5" />
                  {/* Sunlight rim */}
                  <line x1="4" y1="7" x2="72" y2="7" stroke="#fef08a" strokeWidth="1.4" opacity="0.85" />
                  <line x1="3" y1="7" x2="10" y2="23" stroke="#fef08a" strokeWidth="1" opacity="0.75" />
                  {/* Front vertical lip of top cornice */}
                  <rect x="10" y="22" width="58" height="3" fill="#92400e" stroke="#241206" strokeWidth="0.8" />
                  <rect x="10" y="25" width="58" height="3" fill="rgba(0,0,0,0.38)" />

                  {/* 6. 4 Tiered Physical Drawers in 3/4 Perspective */}
                  <rect x="15" y="28" width="48" height="9.5" rx="1.5" fill="#542b08" stroke="#241206" strokeWidth="1" />
                  <line x1="16" y1="29" x2="62" y2="29" stroke="rgba(254, 240, 138, 0.2)" strokeWidth="0.8" />
                  <circle cx="39" cy="32.5" r="1.8" fill={`url(#brassGold-${roomId})`} />
                  <line x1="33" y1="32.5" x2="45" y2="32.5" stroke={`url(#brassGold-${roomId})`} strokeWidth="1.4" strokeLinecap="round" />

                  <rect x="15" y="40" width="48" height="9.5" rx="1.5" fill="#542b08" stroke="#241206" strokeWidth="1" />
                  <line x1="16" y1="41" x2="62" y2="41" stroke="rgba(254, 240, 138, 0.2)" strokeWidth="0.8" />
                  <circle cx="39" cy="44.5" r="1.8" fill={`url(#brassGold-${roomId})`} />
                  <line x1="33" y1="44.5" x2="45" y2="44.5" stroke={`url(#brassGold-${roomId})`} strokeWidth="1.4" strokeLinecap="round" />

                  <rect x="15" y="52" width="48" height="9.5" rx="1.5" fill="#542b08" stroke="#241206" strokeWidth="1" />
                  <line x1="16" y1="53" x2="62" y2="53" stroke="rgba(254, 240, 138, 0.2)" strokeWidth="0.8" />
                  <circle cx="39" cy="56.5" r="1.8" fill={`url(#brassGold-${roomId})`} />
                  <line x1="33" y1="56.5" x2="45" y2="56.5" stroke={`url(#brassGold-${roomId})`} strokeWidth="1.4" strokeLinecap="round" />

                  <rect x="15" y="64" width="48" height="9.5" rx="1.5" fill="#542b08" stroke="#241206" strokeWidth="1" />
                  <line x1="16" y1="65" x2="62" y2="65" stroke="rgba(254, 240, 138, 0.2)" strokeWidth="0.8" />
                  <circle cx="39" cy="68.5" r="1.8" fill={`url(#brassGold-${roomId})`} />
                  <line x1="33" y1="68.5" x2="45" y2="68.5" stroke={`url(#brassGold-${roomId})`} strokeWidth="1.4" strokeLinecap="round" />

                  {/* 7. Corner Brass Brackets */}
                  <polygon points="10,24 16,24 10,30" fill={`url(#brassGold-${roomId})`} />
                  <polygon points="68,24 62,24 68,30" fill={`url(#brassGold-${roomId})`} />
                  <polygon points="10,76 16,76 10,70" fill={`url(#brassGold-${roomId})`} />
                  <polygon points="68,76 62,76 68,70" fill={`url(#brassGold-${roomId})`} />

                  {/* 8. Glowing Oil Lantern firmly seated on 3/4 top surface */}
                  <ellipse cx="39" cy="18" rx="8" ry="3" fill="rgba(0,0,0,0.3)" />
                  <circle cx="39" cy="7" r="8" fill="rgba(245, 158, 11, 0.3)" />
                  <rect x="36" y="6" width="6" height="8" rx="1" fill="#fef08a" stroke="#78350f" strokeWidth="0.8" />
                  <path d="M 36 6 Q 39 2 42 6" fill="none" stroke="#78350f" strokeWidth="1.2" />
                  <circle cx="39" cy="10" r="1.6" fill="#f59e0b" />
                </svg>

                {/* Elegant Brass Nameplate & Count Tag - Revealed ONLY when approaching! */}
                <div 
                  className="furniture-brass-tag"
                  style={{
                    opacity: isNear ? 1 : 0,
                    transform: isNear ? 'translateY(0)' : 'translateY(6px)',
                    transition: 'all 0.25s ease',
                    pointerEvents: isNear ? 'auto' : 'none'
                  }}
                >
                  <span className="tag-lock-icon">{anchorEmoji}</span>
                  <span className="tag-title">{hasDeposits ? anchorLabel : 'ארונית ריקה'}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* --- IN-ROOM AUTHENTIC WALL PICTURE FRAMES (FOR REAL USER PHOTOS) --- */}
        {Object.entries(WALL_PHOTO_POSITIONS).map(([roomId, pos]) => {
          const photoDeposit = storedDeposits.find(d => d.roomId === roomId && d.type === 'photo');
          const hasPhoto = !!photoDeposit;
          const isNear = nearObjectId === `photo_${roomId}` || hoveredObjectId === `photo_${roomId}`;

          return (
            <div
              key={`wall-photo-${roomId}`}
              className="in-room-wall-picture-frame"
              style={{
                position: 'absolute',
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                zIndex: 18,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredObjectId(`photo_${roomId}`)}
              onMouseLeave={() => setHoveredObjectId(null)}
              onClick={(e) => {
                e.stopPropagation();
                sounds.playTap?.();
                setSelectedWallPhotoRoom({ id: roomId, name: pos.name });
                setIsPhotoModalOpen(true);
              }}
              title={hasPhoto ? `תמונה על הקיר: "${photoDeposit.title}" — לחץ לצפייה` : `תמונה על הקיר ריקה — לחץ להוספת תמונה אישית`}
            >
              {/* Proximity Interaction Prompt (Spacebar) */}
              {isNear && (
                <div 
                  className="animate-fade-in"
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(15, 23, 42, 0.94)',
                    border: '1.5px solid #f59e0b',
                    borderRadius: '20px',
                    padding: '2px 8px',
                    whiteSpace: 'nowrap',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: '#fef08a',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    zIndex: 40,
                    pointerEvents: 'none'
                  }}
                >
                  <span style={{ background: '#78350f', padding: '1px 4px', borderRadius: '4px', fontSize: '0.65rem', color: '#fff' }}>רווח</span>
                  <span>{hasPhoto ? 'הצג תמונה 🖼️' : 'תלה תמונה ➕'}</span>
                </div>
              )}

              {/* Hanging wire to wall nail */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#1c1917',
                  border: '1px solid #78716c',
                  zIndex: 2
                }}
              />
              <svg 
                width="28" 
                height="12" 
                viewBox="0 0 28 12" 
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1,
                  pointerEvents: 'none'
                }}
              >
                <path d="M 1 12 L 14 2 L 27 12" fill="none" stroke="#78716c" strokeWidth="1.2" strokeLinecap="round" />
              </svg>

              {/* Ornate Frame Body */}
              <div
                className="wall-frame-hover-glow"
                style={{
                  width: '64px',
                  height: '52px',
                  background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #78350f 100%)',
                  borderRadius: '8px',
                  padding: '5px',
                  boxShadow: '0 8px 18px rgba(0, 0, 0, 0.75), inset 0 1px 2px rgba(253, 224, 71, 0.5), inset 0 -1px 2px rgba(0, 0, 0, 0.8)',
                  border: isNear ? '2px solid #f59e0b' : '1.5px solid #b45309',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  transition: 'all 0.2s ease'
                }}
              >
                {hasPhoto ? (
                  <div style={{ width: '100%', height: '100%', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                    {/* Stardew Mysterious Distant Silhouette Canvas */}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #2d1b11 0%, #1a0f0a 100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: isNear ? 0 : 1,
                        transition: 'opacity 0.28s ease',
                        zIndex: 1
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', opacity: 0.65 }}>🌄</span>
                    </div>

                    {/* The User's Real Photo - Reveals smoothly when approaching! */}
                    <img
                      src={photoDeposit.imageUrl}
                      alt={photoDeposit.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                        opacity: isNear ? 1 : 0,
                        transition: 'opacity 0.28s ease',
                        position: 'relative',
                        zIndex: 2
                      }}
                    />
                    {/* Glass glaze highlight */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '50%',
                        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
                        pointerEvents: 'none',
                        zIndex: 3
                      }} 
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: 'radial-gradient(circle, #3e2617 0%, #201209 100%)',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2px',
                      border: isNear ? '1.5px solid #f59e0b' : '1px dashed rgba(245, 158, 11, 0.35)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.1rem', opacity: isNear ? 1 : 0.6 }}>🖼️</span>
                    <span style={{ fontSize: '0.55rem', color: isNear ? '#fef08a' : '#94a3b8', fontWeight: 700 }}>
                      {isNear ? '+ תמונה' : 'קנבס'}
                    </span>
                  </div>
                )}

                {/* Brass Plaque with title underneath if has photo - Revealed ONLY when approaching! */}
                {hasPhoto && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-14px',
                      left: '50%',
                      transform: isNear ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(6px)',
                      opacity: isNear ? 1 : 0,
                      pointerEvents: isNear ? 'auto' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      background: 'linear-gradient(180deg, #fef08a 0%, #ca8a04 100%)',
                      color: '#000000',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      maxWidth: '84px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.6)',
                      border: '0.5px solid #854d0e',
                      zIndex: 10
                    }}
                  >
                    {photoDeposit.title}
                  </div>
                )}
              </div>
            </div>
          );
        })}



        {/* Canvas for Character Motion (Player + Villager NPCs!) */}
        <canvas 
          ref={canvasRef} 
          width={COMPLEX_WORLD_W} 
          height={COMPLEX_WORLD_H} 
          className="complex-player-canvas"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 30
          }}
        />

        {/* Dynamic 2.5D Physical Wooden Doors installed at every interior corridor */}
        <StardewDoorsLayer 
          doorsState={interiorMastery.doors} 
          onDoorClick={handleDoorClick} 
        />

        {/* Dynamic Warm Ambient Lamplight Pools with 65% Darkness Veil over locked chambers */}
        <ComplexLightingSVG unlockedRooms={interiorMastery.unlockedRooms} />

        {/* Bottom Exit Doorway Notch */}
        <div 
          className="complex-doorway-notch"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="מפתן היציאה לחצר הכפר"
        >
          <div className="doorway-welcome-mat">
            <span>יציאה לכפר 🍃</span>
          </div>
        </div>
        </div>
      </div>

      {/* 4. Controls Footer Bar */}
      <footer className="stardew-controls-hint">
        <span>🎮 תנועה: חיצים / WASD / לחיצה בעכבר</span>
        <span>• עריכת עוגן: לחץ על כל חפץ או מקש רווח בקרבתו</span>
        <span>• הוספת עוגן ברצפה: סמל מצפן בסרגל העליון</span>
      </footer>

      {/* =========================================================
          CLEAN VECTOR LOCUS EDITOR MODAL (NO EMOJIS, NO PREACHING)
          ========================================================= */}
      {editingLocusKey && (
        <div className="anchor-modal-backdrop" onClick={() => setEditingLocusKey(null)}>
          <div className="anchor-dialog-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-wrap">
                <div className="dialog-vector-icon-badge">
                  <VectorAnchorToken icon={locusFormIcon} size={28} />
                </div>
                <div>
                  <h3>{lociData.fixedLoci[editingLocusKey]?.name}</h3>
                  <span className="dialog-sub">משבצת עוגן ויזואלי במרחב הזיכרון</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setEditingLocusKey(null)}>
                <X size={18} />
              </button>
            </div>

            {/* If Notice Board: Clean Pinboard with items */}
            {editingLocusKey === 'notice_board' ? (
              <div className="notice-board-clean-editor">
                {/* Mnemonic Engine Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.7), rgba(67, 56, 202, 0.35))',
                  border: '1px solid rgba(129, 140, 248, 0.45)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.82rem',
                  color: '#e0e7ff'
                }}>
                  <Sparkles size={16} style={{ color: '#fbbf24', flexShrink: 0 }} />
                  <span>
                    <strong>מנוע השרשרת האסוציאטיבית פעיל!</strong> הפריטים נערמים עקום זה על גבי זה כמגדל ביזארי מעל מדף החנות כדי לחקוק אותם בזיכרון.
                  </span>
                </div>

                <div className="clean-items-list">
                  {(lociData.fixedLoci.notice_board?.items || []).map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className={`clean-item-row ${item.completed ? 'is-done' : ''}`}
                      onClick={() => handleToggleBoardItem(idx)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <div className="item-chk">
                          {item.completed && <Check size={14} className="text-emerald" />}
                        </div>
                        <span className="item-txt">{item.text}</span>
                      </div>
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveBoardItem(idx);
                        }}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                        title="מחק פריט"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                  {(lociData.fixedLoci.notice_board?.items || []).length === 0 && (
                    <p className="empty-sub">הלוח ריק. הוסף רשומות, מטרות או דברים לזכור למטה.</p>
                  )}
                </div>

                <form onSubmit={handleAddBoardItem} className="add-board-form">
                  <input 
                    type="text" 
                    value={newBoardItem}
                    onChange={e => setNewBoardItem(e.target.value)}
                    placeholder="הוסף פריט / משימה ללוח..."
                    autoFocus
                  />
                  <button type="submit" className="add-sub-btn">
                    <Plus size={16} />
                    <span>הוסף</span>
                  </button>
                </form>

                {/* Preset Actions */}
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleLoadGymPreset}
                    style={{
                      background: 'rgba(245, 158, 11, 0.18)',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      color: '#fef3c7',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>🏋️ טען אימון כושר של אבא</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClearBoardItems}
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#fca5a5',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    נקה הכל
                  </button>
                </div>
              </div>
            ) : (
              /* Standard Clean Vector Locus Form */
              <form onSubmit={handleSaveLocus} className="clean-locus-form">
                <label>בחר סמל ויזואלי ייעודי:</label>
                <div className="vector-token-picker-strip">
                  {VECTOR_ANCHOR_TOKENS.map(token => (
                    <button 
                      key={token.id} 
                      type="button" 
                      className={`token-btn ${locusFormIcon === token.id ? 'selected' : ''}`}
                      onClick={() => setLocusFormIcon(token.id)}
                      title={token.label}
                    >
                      <VectorAnchorToken icon={token.id} size={24} />
                      <span className="token-label">{token.label}</span>
                    </button>
                  ))}
                </div>

                <label>שם הפריט / הדבר שתרצה לזכור במיקום זה:</label>
                <input 
                  type="text" 
                  value={locusFormTitle}
                  onChange={e => setLocusFormTitle(e.target.value)}
                  placeholder="הקלד כאן..."
                  autoFocus
                />

                <label>הערת זיכרון / אסוציאציה (אופציונלי):</label>
                <textarea 
                  value={locusFormNote}
                  onChange={e => setLocusFormNote(e.target.value)}
                  rows={2}
                  placeholder="פירוט חופשי..."
                />

                <label>דחיפות המשימה / העוגן (רמזור צבעים):</label>
                <div className="urgency-selector-row">
                  <button
                    type="button"
                    className={`urgency-choice-btn red-btn ${locusFormUrgency === 'red' ? 'selected' : ''}`}
                    onClick={() => setLocusFormUrgency('red')}
                  >
                    🔴 דחוף / מיידי
                  </button>
                  <button
                    type="button"
                    className={`urgency-choice-btn yellow-btn ${locusFormUrgency === 'yellow' ? 'selected' : ''}`}
                    onClick={() => setLocusFormUrgency('yellow')}
                  >
                    🟡 בטיפול / פעיל
                  </button>
                  <button
                    type="button"
                    className={`urgency-choice-btn green-btn ${locusFormUrgency === 'green' ? 'selected' : ''}`}
                    onClick={() => setLocusFormUrgency('green')}
                  >
                    🟢 שגרה / רגוע
                  </button>
                </div>

                <label>הסיפור ההזוי שמקשר בין הפריטים על המדף (נחשף בהתקרבות):</label>
                <textarea 
                  value={locusFormBizarreStory}
                  onChange={e => setLocusFormBizarreStory(e.target.value)}
                  rows={3}
                  placeholder="כתוב סיפור מצחיק, מוגזם או הזוי שמקשר בין החפצים (נחשף אוטומטית כשהדמות מתקרבת למדף)..."
                />

                <div className="form-action-row">
                  <button type="submit" className="save-locus-btn">
                    <span>שמור עוגן ויזואלי 📌</span>
                  </button>

                  {lociData.fixedLoci[editingLocusKey]?.title && (
                    <button 
                      type="button" 
                      className="cultivate-locus-btn"
                      onClick={handleCultivateLocus}
                      title="רענן עוגן זה בזיכרון (חזרתיות)"
                    >
                      <Brain size={15} />
                      <span>רענן בזיכרון 🧠</span>
                    </button>
                  )}

                  {lociData.fixedLoci[editingLocusKey]?.title && (
                    <button type="button" className="clear-locus-btn" onClick={handleClearLocus}>
                      <Trash2 size={15} />
                      <span>נקה מיקום זה</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 5. Add Custom Floor Anchor Modal */}
      {isAddingCustomAnchor && (
        <div className="anchor-modal-backdrop" onClick={() => setIsAddingCustomAnchor(false)}>
          <div className="anchor-dialog-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-wrap">
                <div className="dialog-vector-icon-badge">
                  <VectorAnchorToken icon={customFormIcon} size={28} />
                </div>
                <div>
                  <h3>הצבת עוגן ויזואלי ברצפת החדר</h3>
                  <span className="dialog-sub">מיקום הדמות: ({Math.round(playerPosRef.current.x)}, {Math.round(playerPosRef.current.y)})</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setIsAddingCustomAnchor(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddCustomAnchor} className="clean-locus-form">
              <label>בחר סמל ויזואלי:</label>
              <div className="vector-token-picker-strip">
                {VECTOR_ANCHOR_TOKENS.map(token => (
                  <button 
                    key={token.id} 
                    type="button" 
                    className={`token-btn ${customFormIcon === token.id ? 'selected' : ''}`}
                    onClick={() => setCustomFormIcon(token.id)}
                    title={token.label}
                  >
                    <VectorAnchorToken icon={token.id} size={24} />
                    <span className="token-label">{token.label}</span>
                  </button>
                ))}
              </div>

              <label>שם הפריט / העוגן:</label>
              <input 
                type="text" 
                value={customFormTitle}
                onChange={e => setCustomFormTitle(e.target.value)}
                placeholder="הקלד כאן..."
                required
                autoFocus
              />

              <label>הערת זיכרון / אסוציאציה:</label>
              <textarea 
                value={customFormNote}
                onChange={e => setCustomFormNote(e.target.value)}
                rows={2}
                placeholder="פירוט חופשי..."
              />

              <button type="submit" className="save-locus-btn">
                <span>הצב עוגן ברצפה 📌</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5.5 PHYSICAL LOCKER & DRAWERS INSPECTION MODAL */}
      {inspectingLockerData && (
        <div 
          className="journal-backdrop physical-locker-backdrop animate-fade-in" 
          onClick={() => setInspectingLockerData(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="physical-locker-inspection-modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="inspection-modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="inspection-header-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>
                  {inspectingLockerData.deposits[inspectingLockerData.deposits.length - 1]?.visualAnchor?.emoji || '🗄️'}
                </span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fef08a', fontWeight: 800 }}>
                    {inspectingLockerData.roomName || 'ארונית הזיכרון'}
                  </h3>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  type="button"
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.5)',
                    color: '#fef08a',
                    padding: '6px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.84rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onClick={() => {
                    sounds.playTap?.();
                    setModalTargetRoom({ id: inspectingLockerData.roomId, name: inspectingLockerData.roomName });
                    setIsDepositModalOpen(true);
                  }}
                  title="הוסף פריט או רשימה חדשה"
                >
                  <Plus size={15} />
                  <span>הוסף פריט</span>
                </button>
                <button 
                  type="button"
                  className="key-modal-close" 
                  onClick={() => setInspectingLockerData(null)}
                  title="סגור (Esc)"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#94a3b8',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="inspection-modal-body" style={{ padding: '20px' }}>
              {inspectingLockerData.deposits.map(dep => (
                dep.type === 'list' ? (
                  <ActiveRecallLocker
                    key={dep.id}
                    depositId={dep.id}
                    items={dep.items || []}
                    criterion={dep.criterion}
                    associationWord={dep.associationWord}
                    visualAnchor={dep.visualAnchor}
                  />
                ) : (
                  <ActiveRecallSingle
                    key={dep.id}
                    itemName={dep.itemName}
                    associationWord={dep.associationWord}
                    visualAnchor={dep.visualAnchor}
                  />
                )
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Custom Lists & Bizarre Stacking Engine Manager Modal */}
      <BizarreStackingModal
        isOpen={isStackingModalOpen}
        onClose={() => setIsStackingModalOpen(false)}
        stackConfig={lociData.bizarreStackConfig}
        onUpdateStackConfig={handleUpdateStackConfig}
        isGym={isGym}
      />

      {/* 7. The Key Method: Deposit Modal ("מה אתה מפקיד היום?") */}
      <DepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        villageCipher="יער"
        villageName="כפר יער הצבא והביטחון"
        houseCipher="אבק"
        houseName={isGym ? "היכל הכושר והאימון" : (building?.customName || "מחלקת לוגיסטיקה וציוד")}
        room={modalTargetRoom || getChamberForPosition(playerPosRef.current.x, playerPosRef.current.y) || HOUSE_CHAMBERS[0]}
        onDepositSaved={(newDeposit) => {
          showToast(newDeposit.type === 'single' ? 'פריט הופקד בהצלחה! 🗝️' : 'ארונית רשימות נוצרה! 🗄️');
        }}
      />

      {/* 7.1 Real User Photo Wall Frame Modal */}
      <PhotoFrameModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        roomId={selectedWallPhotoRoom?.id}
        roomName={selectedWallPhotoRoom?.name}
        existingPhoto={storedDeposits.find(d => d.roomId === selectedWallPhotoRoom?.id && d.type === 'photo')}
        villageCipher="יער"
        houseCipher="אבק"
        onPhotoSaved={(saved) => {
          setStoredDeposits(getStoredDeposits());
          showToast(saved ? 'התמונה נתלתה על הקיר בהצלחה! 🖼️' : 'התמונה הוסרה מהקיר');
        }}
      />

      {/* 8. Binary / Multi-Branch Memory Hierarchy Tree Explorer */}
      <MemoryHierarchyTreeModal
        isOpen={isHierarchyTreeOpen}
        onClose={() => setIsHierarchyTreeOpen(false)}
        onOpenDepositForRoom={(roomMeta) => {
          setIsHierarchyTreeOpen(false);
          setModalTargetRoom(roomMeta.room);
          setIsDepositModalOpen(true);
        }}
      />
      {/* 9. Bizarre Sort Active Recall Challenge Modal */}
      <BizarreSortChallengeModal
        isOpen={isRoomChallengeOpen}
        onClose={() => setIsRoomChallengeOpen(false)}
        items={roomItemsForChallenge}
        depositTitle={`ארונית: ${inspectingLockerData?.roomName || 'חדר'}`}
      />

      {/* 10. Fast Zero-Friction Active Recall Door Check Modal */}
      {activeQuizDoor && (
        <VillageQuickQuizModal
          isOpen={!!activeQuizDoor}
          onClose={() => setActiveQuizDoor(null)}
          targetBuildingName={activeQuizDoor.toRoomName}
          currentMemory={(() => {
            const reqDeps = storedDeposits.filter(d => d.roomId === activeQuizDoor.requiredRoom);
            if (reqDeps.length > 0) {
              const latest = reqDeps[reqDeps.length - 1];
              return latest.visualAnchor?.label || latest.itemName || latest.associationWord || 'עוגן חדר הכניסה: סדר ומיקוד';
            }
            return activeQuizDoor.requiredRoom === 'entry_foyer'
              ? 'עוגן חדר הכניסה: מיקוד וסדר יום'
              : `עוגן ${activeQuizDoor.fromRoomName}`;
          })()}
          stationEmoji="🔒"
          stageNumber={interiorMastery.unlockedRooms.length}
          totalStages={4}
          onPassedQuiz={() => handlePassDoorQuiz(activeQuizDoor)}
        />
      )}
    </div>
  );
}
