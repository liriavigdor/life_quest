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
  RotateCcw
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { 
  StoreShelvesSVG, 
  StoreCounterSVG, 
  ProduceBinsSVG, 
  GrandHearthSVG, 
  CentralCarpetSVG, 
  ShrineAltarSVG, 
  ShrineBenchesSVG, 
  TeaTableSVG, 
  PottedPlantSVG,
  VectorAnchorToken,
  VECTOR_ANCHOR_TOKENS
} from './stardewArt/StardewVectorAssets';
import { BizarreStackingEngine, generatePegKeyword } from './stardewArt/BizarreStackingEngine';
import { BizarreStackingModal } from './stardewArt/BizarreStackingModal';
import { ComplexArchitectureSVG, ComplexLightingSVG } from './stardewArt/ComplexArchitecture';
import {
  COMPLEX_PAD,
  COMPLEX_WORLD_W,
  COMPLEX_WORLD_H,
  resolveMove,
  snapToWalkable,
  buildRoute,
  computeCamera
} from '../utils/complexNavigation';

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
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 460 });
  const [isPlayerWalking, setIsPlayerWalking] = useState(false);
  const [playerFacingLeft, setPlayerFacingLeft] = useState(false);
  const playerTargetRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

  // Camera / multi-zone navigation (visual layout layer): the stage is a camera window onto a larger world
  const stageRef = useRef(null);
  const worldRef = useRef(null);
  const camRef = useRef({ x: 0, y: 0, ready: false });
  const playerPosRef = useRef({ x: 500, y: 460 });
  const routeRef = useRef([]);
  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      let dx = 0;
      let dy = 0;
      const step = 16;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') dy = -step;
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') dy = step;
      else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx = -step;
        setPlayerFacingLeft(true);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx = step;
        setPlayerFacingLeft(false);
      } else if (e.key === 'Escape') {
        if (editingLocusKey || isAddingCustomAnchor) {
          setEditingLocusKey(null);
          setIsAddingCustomAnchor(false);
        } else {
          onClose();
        }
        return;
      } else if (e.key === ' ' || e.key === 'Enter') {
        checkProximityInteraction();
        return;
      } else {
        return;
      }

      // Any manual key press cancels an in-progress click-to-move route
      playerTargetRef.current = null;
      routeRef.current = [];

      setPlayerPos(prev => {
        // Walls are enforced by the zone map: sliding along walls, passing through door openings
        const { x: nextX, y: nextY } = resolveMove(prev, dx, dy);

        if (nextX >= 470 && nextX <= 530 && nextY >= 475) {
          showToast('יציאה לכפר 🍃');
          setTimeout(() => onClose(), 180);
        }

        return { x: nextX, y: nextY };
      });

      setIsPlayerWalking(true);
    };

    const handleKeyUp = () => {
      setIsPlayerWalking(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editingLocusKey, isAddingCustomAnchor, onClose]);

  // Click-to-Move (camera-aware: converts the click into world coordinates and routes through doorways)
  const handleFloorClick = (e) => {
    if (editingLocusKey || isAddingCustomAnchor) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left + camRef.current.x;
    const clickY = e.clientY - rect.top + camRef.current.y;

    const { x: targetX, y: targetY } = snapToWalkable(clickX, clickY);
    const route = buildRoute(playerPosRef.current, { x: targetX, y: targetY });

    setPlayerFacingLeft(route[0].x < playerPosRef.current.x);
    playerTargetRef.current = route[0];
    routeRef.current = route.slice(1);
    setIsPlayerWalking(true);
  };

  // Continuous loop: Character motion and Canvas Rendering with Native Stardew NPCs!
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (playerTargetRef.current) {
        const curPos = playerPosRef.current;
        const target = playerTargetRef.current;
        const dx = target.x - curPos.x;
        const dy = target.y - curPos.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 4) {
          if (routeRef.current.length > 0) {
            // Reached a doorway waypoint: continue to the next one
            playerTargetRef.current = routeRef.current.shift();
          } else {
            playerTargetRef.current = null;
            setIsPlayerWalking(false);

            if (curPos.x >= 470 && curPos.x <= 530 && curPos.y >= 475) {
              showToast('יציאה לכפר 🍃');
              setTimeout(() => onClose(), 180);
            }
          }
          const arrived = { x: target.x, y: target.y };
          playerPosRef.current = arrived;
          setPlayerPos(arrived);
        } else {
          const speed = 210;
          const moveDist = Math.min(dist, speed * dt);
          const next = resolveMove(curPos, (dx / dist) * moveDist, (dy / dist) * moveDist);

          if (next.x === curPos.x && next.y === curPos.y) {
            // Blocked by a wall: stop instead of pushing forever
            playerTargetRef.current = null;
            routeRef.current = [];
            setIsPlayerWalking(false);
          } else {
            setPlayerFacingLeft(dx < 0);
            playerPosRef.current = next;
            setPlayerPos(next);
          }
        }
      }

      // Draw Characters on Canvas (Player + Animated NPCs!)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Canvas covers the whole world; shift so drawing stays in the hall's origin space
        ctx.setTransform(1, 0, 0, 1, COMPLEX_PAD, COMPLEX_PAD);

        // 1. NPC Pierre behind store counter
        drawCompleteVillager(ctx, {
          cx: 140,
          cy: 185,
          scale: 0.9,
          look: { skinTone: 'light', hairColor: 'auburn', hairStyle: 'slicked', glasses: 'wire_round' },
          outfit: 'blacksmith_apron',
          activity: null,
          facingLeft: false,
          timestamp: time
        });

        // 2. NPC Caroline in the Salon Lounge
        drawCompleteVillager(ctx, {
          cx: 440,
          cy: 285,
          scale: 0.88,
          look: { skinTone: 'fair', hairColor: 'green', hairStyle: 'long_wavy' },
          outfit: 'gardener_dungarees',
          activity: 'drinking_tea',
          facingLeft: false,
          timestamp: time
        });

        // 3. NPC Abigail in the Salon Lounge
        drawCompleteVillager(ctx, {
          cx: 580,
          cy: 285,
          scale: 0.88,
          look: { skinTone: 'fair', hairColor: 'purple', hairStyle: 'short_bob' },
          outfit: 'autumn_sweater',
          activity: null,
          facingLeft: true,
          timestamp: time
        });

        // 4. Main Player Character
        drawCompleteVillager(ctx, {
          cx: playerPosRef.current.x,
          cy: playerPosRef.current.y,
          scale: 0.95,
          outfit: currentOutfit,
          facingLeft: playerFacingLeft,
          isWalking: isPlayerWalking,
          walkCycle: (time * 0.01) % (Math.PI * 2),
          look: villagerLook,
          timestamp: time
        });
      }

      // Smooth camera: glide the world so the villager stays centred (clamped to the outer void margin)
      const stageEl = stageRef.current;
      const worldEl = worldRef.current;
      if (stageEl && worldEl) {
        const want = computeCamera(playerPosRef.current, stageEl.clientWidth, stageEl.clientHeight);
        const cam = camRef.current;
        if (!cam.ready) {
          cam.x = want.x;
          cam.y = want.y;
          cam.ready = true;
        } else {
          const k = Math.min(1, dt * 6);
          cam.x += (want.x - cam.x) * k;
          cam.y += (want.y - cam.y) * k;
        }
        worldEl.style.transform = `translate3d(${-(cam.x + COMPLEX_PAD)}px, ${-(cam.y + COMPLEX_PAD)}px, 0)`;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [playerFacingLeft, isPlayerWalking, currentOutfit, villagerLook, onClose]);

  // Physical stations / loci
  const STATIONS = {
    shop_counter: { x: 130, y: 220, name: 'דלפק החנות', locusKey: 'shop_counter' },
    shelf_top: { x: 235, y: 240, name: 'מדף עליון בחנות', locusKey: 'shelf_top' },
    shelf_bottom: { x: 235, y: 340, name: 'מדף תחתון בחנות', locusKey: 'shelf_bottom' },
    produce_bin: { x: 100, y: 410, name: 'ארגז תוצרת', locusKey: 'produce_bin' },
    notice_board: { x: 275, y: 150, name: 'לוח מודעות ורשימות', locusKey: 'notice_board' },
    grand_hearth: { x: 505, y: 155, name: 'אח האבן המרכזית', locusKey: 'grand_hearth' },
    community_carpet: { x: 510, y: 330, name: 'השטיח העגול בסלון', locusKey: 'community_carpet' },
    tea_table: { x: 495, y: 375, name: 'שולחן המפגש', locusKey: 'tea_table' },
    golden_altar: { x: 840, y: 160, name: 'מזבח הזהב והקריסטל', locusKey: 'golden_altar' },
    shrine_benches: { x: 840, y: 280, name: 'ספסלי הקטיפה בהיכל', locusKey: 'shrine_benches' },
    exit_door: { x: 500, y: 495, name: 'יציאה לכפר', locusKey: null }
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
      setEditingLocusKey(locusKey);
    }
  };

  const handleSaveLocus = (e) => {
    e?.preventDefault();
    if (!editingLocusKey) return;
    sounds.playTap?.();

    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          icon: locusFormIcon,
          title: locusFormTitle.trim(),
          note: locusFormNote.trim(),
          lastCultivated: new Date().toISOString().split('T')[0]
        }
      }
    }));

    setEditingLocusKey(null);
    showToast('עוגן ויזואלי עודכן בהצלחה ✓');
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
      {/* 1. Clean, Minimalist Top HUD Bar */}
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
              {isGym ? 'היכל הכושר והאימון (Gym)' : (building?.customName || catalogItem?.name || 'מתחם מוסדות הכפר')}
            </span>
          </div>
        </div>

        {/* Center: ONE Clean Action Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="stardew-mode-switch-btn"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              border: 'none',
              color: '#000',
              fontWeight: 'bold',
              padding: '7px 20px',
              borderRadius: '20px',
              boxShadow: '0 4px 14px rgba(245, 158, 11, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              cursor: 'pointer'
            }}
            onClick={() => setIsStackingModalOpen(true)}
            title="פתח חלון ליצירת דמות זיכרון מרשימה"
          >
            <Sparkles size={16} color="#000" />
            <span>
              {activePeg.word ? `דמות זיכרון: "${activePeg.word}" ⚡` : 'יצירת דמות זיכרון ⚡'}
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

      {/* 2. Floating Notification Toast */}
      {toastMessage && (
        <div className="stardew-toast-banner animate-bounce-gentle" onClick={e => e.stopPropagation()}>
          <Sparkles size={16} className="text-amber" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. The Grand Multi-Wing Stardew Complex Stage (Vector-Crafted!) */}
      <div 
        ref={stageRef}
        className="stardew-complex-stage"
        onClick={e => {
          e.stopPropagation();
          handleFloorClick(e);
        }}
      >
        <div ref={worldRef} className="complex-world-camera-rig">
          <ComplexArchitectureSVG />
        {/* =========================================================
            LAYER 1: ARCHITECTURAL BACK WALL & ART ASSETS
            ========================================================= */}
        <div className="complex-back-wall-structure">
          <div className="wall-crown-molding"></div>
          <div className="wall-wainscot-panels"></div>

          {/* Left Wing: Store Wall Shelves & Notice Board */}
          <div className="store-wall-zone">
            <div className="store-wall-shelves-backdrop" style={{ position: 'relative' }}>
              <StoreShelvesSVG />

              {/* The Bizarre Stacking Engine overlay (if placed on shelf_top) */}
              {((lociData.bizarreStackConfig?.targetLocus || 'shelf_top') === 'shelf_top') && activeStackItems.length > 0 && (
                <svg 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'visible',
                    pointerEvents: 'none'
                  }}
                  viewBox="0 0 280 140"
                >
                  <g style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={() => setIsStackingModalOpen(true)}>
                    <BizarreStackingEngine
                      items={activeStackItems}
                      baseX={140}
                      baseY={58}
                    />
                    {/* Floating Peg Keyword Pill Badge */}
                    {activePeg.word && (
                      <g transform="translate(140, -14)">
                        <rect x="-42" y="-11" width="84" height="22" rx="11" fill="#09090b" stroke="#f59e0b" strokeWidth="1.5" />
                        <text x="0" y="3.5" fill="#fef08a" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                          {activePeg.emoji} {activePeg.word}
                        </text>
                      </g>
                    )}
                  </g>
                </svg>
              )}
            </div>

            {/* Arched Window with Sunbeam */}
            <div className="store-window-arched" title="חלון החנות">
              <div className="window-glass-shine"></div>
            </div>
            <div className="store-sunbeam-cast"></div>

            {/* Corkboard / Notice Board */}
            <div 
              className="store-corkboard-frame"
              onClick={e => {
                e.stopPropagation();
                openLocusEditor('notice_board');
              }}
              title="לוח מודעות ורשימות — לחץ לעריכה"
            >
              <div className="board-pin">📍</div>
              <div className="board-sticky-note n1">
                {lociData.fixedLoci.notice_board?.title || 'לוח רשימות'}
              </div>
            </div>
          </div>

          {/* Center Wing: Grand Hearth Chimney */}
          <div className="hearth-wall-zone">
            <div 
              className="grand-brick-chimney-complex"
              onClick={e => {
                e.stopPropagation();
                openLocusEditor('grand_hearth');
              }}
              title="אח האבן המרכזית — לחץ לעריכת עוגן"
            >
              <GrandHearthSVG />
            </div>
          </div>

          {/* Right Wing: Sacred Golden Altar & Crystal */}
          <div className="shrine-wall-zone">
            <div 
              className="golden-altar-monument"
              onClick={e => {
                e.stopPropagation();
                openLocusEditor('golden_altar');
              }}
              title="מזבח הזהב והקריסטל — לחץ לעריכת עוגן"
            >
              <ShrineAltarSVG />
            </div>
          </div>
        </div>

        {/* =========================================================
            LAYER 2: FLOOR CARPETS & RUNWAYS
            ========================================================= */}
        <div className="complex-floorboards-canvas">
          {/* Central Circular Carpet */}
          <div 
            className="community-central-carpet"
            onClick={e => {
              e.stopPropagation();
              openLocusEditor('community_carpet');
            }}
            title="השטיח העגול — לחץ לעריכת עוגן"
          >
            <CentralCarpetSVG />
          </div>

          {/* Store Welcome Rug */}
          <div className="store-welcome-mat">
            <span>חנות האספקה</span>
          </div>

          {/* Shrine Sacred Runner */}
          <div className="shrine-carpet-runner"></div>
        </div>

        {/* =========================================================
            LAYER 3: 2.5D VECTOR FURNITURE & VISUAL LOCI
            ========================================================= */}

        {/* --- ZONE A: STORE WING --- */}
        {/* Store Counter with Vector Register, Scale, Ledger */}
        <div 
          className="furniture-store-counter"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shop_counter');
          }}
          title={isGym ? "דלפק הקבלה והציוד — לחץ לעריכה" : "דלפק החנות — לחץ לעריכת עוגן"}
          style={{ position: 'relative' }}
        >
          <div className="clerk-tag-badge">{isGym ? 'מדריך הכושר' : 'פייר (החנווני)'}</div>
          <StoreCounterSVG />

          {/* Stacking Engine on Counter if selected */}
          {((lociData.bizarreStackConfig?.targetLocus) === 'shop_counter') && (
            <svg 
              style={{
                position: 'absolute',
                top: -30,
                left: 30,
                width: 100,
                height: 120,
                overflow: 'visible',
                pointerEvents: 'none'
              }}
              viewBox="0 0 100 100"
            >
              <g style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setIsStackingModalOpen(true); }}>
                <BizarreStackingEngine
                  items={(lociData.bizarreStackConfig?.items || []).filter(item => !item.completed)}
                  baseX={50}
                  baseY={72}
                  stepY={18}
                  itemSize={26}
                  onItemClick={(item, idx) => {
                    sounds.playTap?.();
                    showToast(`חפץ ${idx + 1} במגדל: ${item.text || item}`);
                  }}
                />
              </g>
            </svg>
          )}

          {lociData.fixedLoci.shop_counter?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.shop_counter.icon} size={20} />
              <small>{lociData.fixedLoci.shop_counter.title}</small>
            </div>
          )}
        </div>

        {/* Produce Crates on Floor */}
        <div 
          className="store-produce-bins"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('produce_bin');
          }}
          title="ארגז תוצרת — לחץ לעריכת עוגן"
        >
          <ProduceBinsSVG />
          {lociData.fixedLoci.produce_bin?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.produce_bin.icon} size={20} />
              <small>{lociData.fixedLoci.produce_bin.title}</small>
            </div>
          )}
        </div>

        {/* --- ZONE B: HEARTH SALON --- */}
        <div className="salon-potted-ficus left">
          <PottedPlantSVG />
        </div>
        <div className="salon-potted-ficus right">
          <PottedPlantSVG />
        </div>

        {/* Hearth Visual Locus Tag */}
        {lociData.fixedLoci.grand_hearth?.title && (
          <div className="locus-visual-tag hearth-tag">
            <VectorAnchorToken icon={lociData.fixedLoci.grand_hearth.icon} size={20} />
            <small>{lociData.fixedLoci.grand_hearth.title}</small>
          </div>
        )}

        {/* Central Carpet Visual Locus Tag */}
        {lociData.fixedLoci.community_carpet?.title && (
          <div className="locus-visual-tag carpet-tag">
            <VectorAnchorToken icon={lociData.fixedLoci.community_carpet.icon} size={20} />
            <small>{lociData.fixedLoci.community_carpet.title}</small>
          </div>
        )}

        {/* NPC Labels in Salon (Villagers rendered on Canvas!) */}
        <div className="npc-salon-tag-marker caroline-tag" title="קרוליין יושבת בסלון">
          <span>קרוליין</span>
        </div>
        <div className="npc-salon-tag-marker abigail-tag" title="אביגיל">
          <span>אביגיל</span>
        </div>

        {/* Tea Table */}
        <div 
          className="salon-tea-station"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('tea_table');
          }}
          title={isGym ? "שולחן ההתאוששות — לחץ לעריכה" : "שולחן המפגש — לחץ לעריכת עוגן"}
          style={{ position: 'relative' }}
        >
          <TeaTableSVG />

          {/* Stacking Engine on Tea Table if selected */}
          {((lociData.bizarreStackConfig?.targetLocus) === 'tea_table') && (
            <svg 
              style={{
                position: 'absolute',
                top: -35,
                left: 20,
                width: 100,
                height: 120,
                overflow: 'visible',
                pointerEvents: 'none'
              }}
              viewBox="0 0 100 100"
            >
              <g style={{ pointerEvents: 'auto', cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); setIsStackingModalOpen(true); }}>
                <BizarreStackingEngine
                  items={(lociData.bizarreStackConfig?.items || []).filter(item => !item.completed)}
                  baseX={50}
                  baseY={72}
                  stepY={18}
                  itemSize={26}
                  onItemClick={(item, idx) => {
                    sounds.playTap?.();
                    showToast(`חפץ ${idx + 1} במגדל: ${item.text || item}`);
                  }}
                />
              </g>
            </svg>
          )}

          {lociData.fixedLoci.tea_table?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.tea_table.icon} size={20} />
              <small>{lociData.fixedLoci.tea_table.title}</small>
            </div>
          )}
        </div>

        {/* --- ZONE C: SHRINE SANCTUARY --- */}
        {/* Shrine Altar Tag */}
        {lociData.fixedLoci.golden_altar?.title && (
          <div className="locus-visual-tag altar-tag">
            <VectorAnchorToken icon={lociData.fixedLoci.golden_altar.icon} size={20} />
            <small>{lociData.fixedLoci.golden_altar.title}</small>
          </div>
        )}

        {/* Velvet Benches */}
        <div 
          className="shrine-blue-benches-complex"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shrine_benches');
          }}
          title="ספסלי ההיכל — לחץ לעריכת עוגן"
        >
          <ShrineBenchesSVG />
          {lociData.fixedLoci.shrine_benches?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.shrine_benches.icon} size={20} />
              <small>{lociData.fixedLoci.shrine_benches.title}</small>
            </div>
          )}
        </div>

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

        {/* Canvas for Character Motion (Player + Villager NPCs!) */}
        <canvas 
          ref={canvasRef} 
          width={COMPLEX_WORLD_W} 
          height={COMPLEX_WORLD_H} 
          className="complex-player-canvas"
          style={{
            position: 'absolute',
            left: `${-COMPLEX_PAD}px`,
            top: `${-COMPLEX_PAD}px`,
            width: `${COMPLEX_WORLD_W}px`,
            height: `${COMPLEX_WORLD_H}px`,
            pointerEvents: 'none',
            zIndex: 30
          }}
        />

        {/* Dynamic Warm Ambient Lamplight Pools */}
        <ComplexLightingSVG />

        {/* Proximity Interaction Hint Bubble */}
        {nearestStation && (
          <div 
            className="complex-proximity-bubble"
            style={{ left: `${nearestStation.x}px`, top: `${nearestStation.y - 45}px` }}
            onClick={(e) => {
              e.stopPropagation();
              checkProximityInteraction();
            }}
          >
            <span className="bubble-icon">📌</span>
            <span className="bubble-text">{nearestStation.name}</span>
            <span className="bubble-space-key">[רווח לעריכה]</span>
          </div>
        )}

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

      {/* 6. Custom Lists & Bizarre Stacking Engine Manager Modal */}
      <BizarreStackingModal
        isOpen={isStackingModalOpen}
        onClose={() => setIsStackingModalOpen(false)}
        stackConfig={lociData.bizarreStackConfig}
        onUpdateStackConfig={handleUpdateStackConfig}
        isGym={isGym}
      />
    </div>
  );
}
