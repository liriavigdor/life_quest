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
  Layers
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { 
  VectorAnchorToken,
  VECTOR_ANCHOR_TOKENS
} from './stardewArt/StardewVectorAssets';
import { BizarreStackingEngine, generatePegKeyword } from './stardewArt/BizarreStackingEngine';
import { BizarreStackingModal } from './stardewArt/BizarreStackingModal';
import { ComplexArchitectureSVG, ComplexLightingSVG } from './stardewArt/ComplexArchitecture';
import { DepositModal } from './DepositModal';
import { MemoryHierarchyTreeModal } from './MemoryHierarchyTreeModal';
import { ActiveRecallLocker } from './ActiveRecallLocker';
import { ActiveRecallSingle } from './ActiveRecallSingle';
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
  const [playerPos, setPlayerPos] = useState({ x: 595, y: 510 });
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
  const [isHierarchyTreeOpen, setIsHierarchyTreeOpen] = useState(false);
  const [modalTargetRoom, setModalTargetRoom] = useState(null);
  const [promptChamber, setPromptChamber] = useState(null);
  const [storedDeposits, setStoredDeposits] = useState(() => getStoredDeposits());
  const [inspectingLockerData, setInspectingLockerData] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setStoredDeposits(getStoredDeposits());
    window.addEventListener('lifequest_deposits_updated', handleUpdate);
    return () => window.removeEventListener('lifequest_deposits_updated', handleUpdate);
  }, []);

  // Track current chamber based on player position in the multi-chamber burrow
  const currentChamber = useMemo(() => {
    return getChamberForPosition(playerPos.x, playerPos.y);
  }, [playerPos.x, playerPos.y]);

  const lastChamberRef = useRef(null);
  useEffect(() => {
    if (currentChamber && currentChamber.id !== lastChamberRef.current) {
      lastChamberRef.current = currentChamber.id;
      setPromptChamber(currentChamber);
    }
  }, [currentChamber]);

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

  // Click-to-Move with precise coordinate mapping & Stardew-style glowing pulse ring
  const handleFloorClick = (e) => {
    if (editingLocusKey || isAddingCustomAnchor) return;
    if (!worldRef.current) return;

    const rect = worldRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const clickX = (e.clientX - rect.left) / (rect.width / COMPLEX_WORLD_W);
    const clickY = (e.clientY - rect.top) / (rect.height / COMPLEX_WORLD_H);

    const target = snapToWalkable(clickX, clickY);
    const curPos = playerPosRef.current;
    const route = buildRoute(curPos, target);

    if (route && route.length > 0) {
      playerTargetRef.current = route[0];
      routeRef.current = route.slice(1);
      destinationMarkerRef.current = {
        x: target.x,
        y: target.y,
        createdAt: performance.now(),
        active: true
      };
      sounds.playTap?.();
    }
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

          const next = resolveMove(curPos, vx, vy);

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

          const next = resolveMove(curPos, vx, vy);

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

      // Throttle React state updates to ~10Hz (every 100ms) for UI station proximity badges
      throttleTimer += dt;
      if (throttleTimer >= 0.09) {
        throttleTimer = 0;
        const p = playerPosRef.current;
        setPlayerPos({ x: Math.round(p.x), y: Math.round(p.y) });
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

  const nearestStation = useMemo(() => {
    let nearest = null;
    let minDist = 75;

    Object.entries(STATIONS).forEach(([key, loc]) => {
      const dist = Math.hypot(playerPos.x - loc.x, playerPos.y - loc.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = { key, ...loc, dist };
      }
    });

    return nearest;
  }, [playerPos]);

  const checkProximityInteraction = () => {
    // 1. Check if near any physical locker furniture with deposits
    const lockerPositions = {
      entry_foyer: { x: 520, y: 480, name: 'חדר כניסה (מבואה נייטרלית)' },
      left_store: { x: 233, y: 235, name: 'חדר דחוף (אגף שמאל)' },
      main_hall: { x: 630, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
      right_sanctuary: { x: 998, y: 305, name: 'חדר שגרה (היכל השלווה)' }
    };

    for (const [roomId, pos] of Object.entries(lockerPositions)) {
      const roomDeposits = storedDeposits.filter(d => d.roomId === roomId);
      if (roomDeposits.length > 0) {
        const dist = Math.hypot(playerPos.x - pos.x, playerPos.y - pos.y);
        if (dist < 140) {
          sounds.playTap?.();
          setInspectingLockerData({
            roomId,
            roomName: pos.name,
            deposits: roomDeposits
          });
          return;
        }
      }
    }

    if (!nearestStation) return;
    if (nearestStation.key === 'exit_door') {
      onClose();
    } else {
      openLocusEditor(nearestStation.locusKey);
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
      x: playerPos.x,
      y: playerPos.y,
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
      {/* 1. Elevated Stardew Top HUD Bar */}
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
            <div className="room-title-with-cipher">
              <span className="room-indicator-title">
                {isGym ? 'היכל הכושר והאימון (Gym)' : (building?.customName || catalogItem?.name || 'מחלקת לוגיסטיקה — כפר הצבא')}
              </span>
              <span className="room-cipher-badge">🗝️ צופן מחלקה: "אבק" • צופן כפר: "יער"</span>
            </div>
            <div className="urgency-room-pills">
              <span className="urg-pill red-pill">🔴 דחוף</span>
              <span className="urg-pill yellow-pill">🟡 בטיפול</span>
              <span className="urg-pill green-pill">🟢 שגרה</span>
            </div>
          </div>
        </div>

        {/* Center: Key Method & Memory Tree Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className="stardew-mode-switch-btn deposit-key-action-btn"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '7px 16px',
              borderRadius: '20px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.86rem'
            }}
            onClick={() => {
              sounds.playTap?.();
              setModalTargetRoom(currentChamber || HOUSE_CHAMBERS[0]);
              setIsDepositModalOpen(true);
            }}
            title="מה אתה מפקיד היום? — שיטת המפתחות"
          >
            <Key size={15} />
            <span>מה אתה מפקיד היום? 🗝️</span>
          </button>

          <button 
            className="stardew-mode-switch-btn tree-view-btn"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 'bold',
              padding: '7px 16px',
              borderRadius: '20px',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '0.86rem'
            }}
            onClick={() => {
              sounds.playTap?.();
              setIsHierarchyTreeOpen(true);
            }}
            title="עץ בינארי רב אפשרויות — כל ההיררכיה של ארמון הזיכרון"
          >
            <GitBranch size={15} />
            <span>עץ הזיכרון 🌳</span>
          </button>

          <button 
            className="stardew-mode-switch-btn peg-bonus-btn"
            style={{
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              color: '#fef08a',
              fontWeight: 'bold',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
            onClick={() => setIsStackingModalOpen(true)}
            title="פתח חלון ליצירת דמות זיכרון מרשימה"
          >
            <Sparkles size={14} color="#f59e0b" />
            <span>
              {activePeg.word ? `דמות: "${activePeg.word}" ⚡` : 'דמות זיכרון ⚡'}
            </span>
          </button>
        </div>

        <div className="stardew-hud-right">
          {onSwitchToCabin && (
            <button 
              className="stardew-mode-switch-btn"
              onClick={onSwitchToCabin}
              title="עבור אל בקתת החווה"
              style={{ fontSize: '0.8rem', background: 'rgba(30, 41, 59, 0.6)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            >
              <span>🏡 בקתת החווה</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Room Entrance Deposit Question Prompt */}
      {promptChamber && (
        <div className="room-deposit-prompt-bar glass-card animate-slide-down" onClick={e => e.stopPropagation()}>
          <div className="prompt-room-meta">
            <span className="prompt-room-icon">{promptChamber.emoji}</span>
            <div className="prompt-room-text">
              <span className="prompt-question">🚪 נכנסת אל <strong>{promptChamber.name}</strong> • מה אתה מפקיד היום?</span>
              <span className="prompt-ciphers">צופן בית: <strong>"אבק"</strong> • צופן כפר: <strong>"יער"</strong></span>
            </div>
          </div>
          <div className="prompt-actions">
            <button 
              className="prompt-deposit-btn"
              onClick={() => {
                sounds.playTap?.();
                setModalTargetRoom(promptChamber);
                setIsDepositModalOpen(true);
                setPromptChamber(null);
              }}
            >
              <Key size={15} />
              <span>🗝️ הפקדת מידע בחדר</span>
            </button>
            <button 
              className="prompt-dismiss-btn"
              onClick={() => setPromptChamber(null)}
              title="סגור הודעה"
            >
              ✕
            </button>
          </div>
        </div>
      )}

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

        {/* --- IN-ROOM AUTHENTIC PHYSICAL WOODEN LOCKER FURNITURE --- */}
        {Object.entries({
          entry_foyer: { x: 505, y: 490, name: 'חדר כניסה (מבואה נייטרלית)' },
          left_store: { x: 195, y: 190, name: 'חדר דחוף (אגף שמאל)' },
          main_hall: { x: 595, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
          right_sanctuary: { x: 960, y: 260, name: 'חדר שגרה (היכל השלווה)' }
        }).map(([roomId, pos]) => {
          const roomDeposits = storedDeposits.filter(d => d.roomId === roomId);
          if (roomDeposits.length === 0) return null;

          const distToPlayer = Math.hypot(playerPos.x - pos.x, playerPos.y - pos.y);
          const isNear = distToPlayer < 140;

          return (
            <div 
              key={roomId} 
              className="in-room-physical-locker-anchor"
              style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 26 }}
            >
              {/* Isometric Physical Wooden Locker Furniture Piece */}
              <div 
                className="physical-locker-furniture-piece"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap?.();
                  setInspectingLockerData({
                    roomId,
                    roomName: pos.name,
                    deposits: roomDeposits
                  });
                }}
                title={`לחץ לבדיקת ארונית המגירות (${roomDeposits.length} הפקדות)`}
              >
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

                {/* Elegant Brass Nameplate & Count Tag */}
                <div className="furniture-brass-tag">
                  <span className="tag-lock-icon">🗄️</span>
                  <span className="tag-title">{roomDeposits.length} הפקדות</span>
                </div>
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

        {/* Dynamic Warm Ambient Lamplight Pools */}
        <ComplexLightingSVG />

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
                  <span className="dialog-sub">מיקום הדמות: ({Math.round(playerPos.x)}, {Math.round(playerPos.y)})</span>
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
            <div className="inspection-modal-header">
              <div className="inspection-header-title">
                <span className="inspection-badge-icon">🗄️</span>
                <div>
                  <h3>ארונית המגירות הפיזית • {inspectingLockerData.roomName || 'חדר'}</h3>
                  <span className="inspection-sub">הדמות שלך מתאמנת ב-Active Recall על הלוקר הפיזי! משוך והזז מגירות 🧠</span>
                </div>
              </div>
              <button 
                type="button"
                className="key-modal-close" 
                onClick={() => setInspectingLockerData(null)}
                title="סגור (Esc)"
              >
                <X size={18} />
              </button>
            </div>

            <div className="inspection-modal-body">
              {inspectingLockerData.deposits.map(dep => (
                dep.type === 'list' ? (
                  <ActiveRecallLocker
                    key={dep.id}
                    depositId={dep.id}
                    items={dep.items || []}
                    criterion={dep.criterion}
                    associationWord={dep.associationWord}
                    villageCipher={dep.villageCipher}
                    houseCipher={dep.houseCipher}
                    showCharacterAvatar={true}
                  />
                ) : (
                  <ActiveRecallSingle
                    key={dep.id}
                    itemName={dep.itemName}
                    associationWord={dep.associationWord}
                    villageCipher={dep.villageCipher}
                    houseCipher={dep.houseCipher}
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
        room={modalTargetRoom || currentChamber || HOUSE_CHAMBERS[0]}
        onDepositSaved={(newDeposit) => {
          showToast(newDeposit.type === 'single' ? 'פריט הופקד בהצלחה! 🗝️' : 'ארונית לוקר ממוספרת נוצרה! 🗄️');
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
    </div>
  );
}
