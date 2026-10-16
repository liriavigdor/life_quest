import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, 
  Sun, 
  Sparkles, 
  DoorOpen, 
  Coffee, 
  Gift, 
  ShoppingBag, 
  BookOpen, 
  Coins, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  Store, 
  Award, 
  Compass, 
  Layers,
  MapPin,
  Gem
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';

// Rich Visual Icon Catalog for Memory Palace Anchoring
const VISUAL_ICONS = [
  '🔑', '🪪', '📱', '💼', '🚗', '🏠', '☕', '💎', '📜', '🎨', 
  '🎸', '📚', '🏆', '🧭', '🍎', '🛡️', '⚔️', '🍞', '📦', '🪴', 
  '🧸', '🪞', '🔦', '🧩', '⏰', '🌿', '🌾', '🌊', '☀️', '🌙', 
  '🌟', '🎯', '🧺', '🕯️', '🫖', '🍾', '🥕', '🫙', '🧪', '🧀'
];

export function StardewInstitutionComplex({
  building,
  catalogItem,
  onClose,
  seeds = 0,
  onEarnSeeds,
  villagerLook = {},
  currentOutfit = 'autumn_sweater',
  villageResources = { veggies: 8, harvest: 5, crystals: 2 },
  onSwitchToCabin
}) {
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

    return {
      // Fixed Architectural Loci in the Building (Clean slate)
      fixedLoci: {
        shop_counter: { id: 'shop_counter', name: 'דלפק החנות', icon: '🛍️', title: '', note: '' },
        shelf_top: { id: 'shelf_top', name: 'מדף עליון בחנות', icon: '🍞', title: '', note: '' },
        shelf_bottom: { id: 'shelf_bottom', name: 'מדף תחתון בחנות', icon: '🍾', title: '', note: '' },
        produce_bin: { id: 'produce_bin', name: 'ארגז תוצרת', icon: '🥕', title: '', note: '' },
        notice_board: { id: 'notice_board', name: 'לוח מודעות ורשימות', icon: '📌', title: 'לוח משימות', items: [] },
        grand_hearth: { id: 'grand_hearth', name: 'אח האבן המרכזית', icon: '🔥', title: '', note: '' },
        community_carpet: { id: 'community_carpet', name: 'השטיח העגול בסלון', icon: '🛋️', title: '', note: '' },
        tea_table: { id: 'tea_table', name: 'שולחן המפגש', icon: '☕', title: '', note: '' },
        golden_altar: { id: 'golden_altar', name: 'מזבח הזהב והקריסטל', icon: '✨', title: '', note: '' },
        shrine_benches: { id: 'shrine_benches', name: 'ספסלי הקטיפה בהיכל', icon: '🕯️', title: '', note: '' }
      },
      // Custom placed user anchors anywhere on the floor
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
  const [editingLocusKey, setEditingLocusKey] = useState(null); // string key or null
  const [locusFormIcon, setLocusFormIcon] = useState('📌');
  const [locusFormTitle, setLocusFormTitle] = useState('');
  const [locusFormNote, setLocusFormNote] = useState('');

  // Notice board new item
  const [newBoardItem, setNewBoardItem] = useState('');

  // Custom Anchor Modal
  const [isAddingCustomAnchor, setIsAddingCustomAnchor] = useState(false);
  const [customFormIcon, setCustomFormIcon] = useState('📌');
  const [customFormTitle, setCustomFormTitle] = useState('');
  const [customFormNote, setCustomFormNote] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  // --- Player Positioning & Real-time Canvas Rendering ---
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 460 });
  const [isPlayerWalking, setIsPlayerWalking] = useState(false);
  const [playerFacingLeft, setPlayerFacingLeft] = useState(false);
  const playerTargetRef = useRef(null);
  const animationFrameRef = useRef(null);
  const canvasRef = useRef(null);

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

      setPlayerPos(prev => {
        const nextX = Math.max(50, Math.min(910, prev.x + dx));
        const nextY = Math.max(140, Math.min(480, prev.y + dy));

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

  // Click-to-Move
  const handleFloorClick = (e) => {
    if (editingLocusKey || isAddingCustomAnchor) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetX = Math.max(50, Math.min(910, clickX));
    const targetY = Math.max(140, Math.min(480, clickY));

    setPlayerFacingLeft(targetX < playerPos.x);
    playerTargetRef.current = { x: targetX, y: targetY };
    setIsPlayerWalking(true);
  };

  // Continuous loop for character motion and canvas drawing
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      if (playerTargetRef.current) {
        setPlayerPos(curr => {
          const target = playerTargetRef.current;
          if (!target) return curr;

          const dx = target.x - curr.x;
          const dy = target.y - curr.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 4) {
            playerTargetRef.current = null;
            setIsPlayerWalking(false);

            if (curr.x >= 470 && curr.x <= 530 && curr.y >= 475) {
              showToast('יציאה לכפר 🍃');
              setTimeout(() => onClose(), 180);
            }

            return { x: target.x, y: target.y };
          }

          const speed = 210;
          const moveDist = Math.min(dist, speed * dt);
          const nextX = curr.x + (dx / dist) * moveDist;
          const nextY = curr.y + (dy / dist) * moveDist;

          setPlayerFacingLeft(dx < 0);
          return { x: nextX, y: nextY };
        });
      }

      // Draw Villager
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawCompleteVillager(ctx, {
          cx: playerPos.x,
          cy: playerPos.y,
          scale: 0.95,
          outfit: currentOutfit,
          facingLeft: playerFacingLeft,
          isWalking: isPlayerWalking,
          walkCycle: (time * 0.01) % (Math.PI * 2),
          look: villagerLook,
          timestamp: time
        });
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [playerPos, playerFacingLeft, isPlayerWalking, currentOutfit, villagerLook, onClose]);

  // Physical landmarks / loci positions
  const STATIONS = {
    // Left Wing (Store)
    shop_counter: { x: 130, y: 220, name: 'דלפק החנות', locusKey: 'shop_counter' },
    shelf_top: { x: 235, y: 240, name: 'מדף עליון בחנות', locusKey: 'shelf_top' },
    shelf_bottom: { x: 235, y: 340, name: 'מדף תחתון בחנות', locusKey: 'shelf_bottom' },
    produce_bin: { x: 100, y: 410, name: 'ארגז תוצרת', locusKey: 'produce_bin' },
    notice_board: { x: 275, y: 150, name: 'לוח מודעות ורשימות', locusKey: 'notice_board' },
    // Center Wing (Hearth Salon)
    grand_hearth: { x: 505, y: 155, name: 'אח האבן המרכזית', locusKey: 'grand_hearth' },
    community_carpet: { x: 510, y: 330, name: 'השטיח העגול בסלון', locusKey: 'community_carpet' },
    tea_table: { x: 495, y: 375, name: 'שולחן המפגש', locusKey: 'tea_table' },
    // Right Wing (Shrine Sanctuary)
    golden_altar: { x: 840, y: 160, name: 'מזבח הזהב והקריסטל', locusKey: 'golden_altar' },
    shrine_benches: { x: 840, y: 280, name: 'ספסלי הקטיפה בהיכל', locusKey: 'shrine_benches' },
    // Exit
    exit_door: { x: 500, y: 495, name: 'יציאה לכפר', locusKey: null }
  };

  // Find nearest locus
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

  // Open Locus Editor for any landmark
  const openLocusEditor = (locusKey) => {
    sounds.playTap();
    const current = lociData.fixedLoci[locusKey];
    if (current) {
      setLocusFormIcon(current.icon || '📌');
      setLocusFormTitle(current.title || '');
      setLocusFormNote(current.note || '');
      setEditingLocusKey(locusKey);
    }
  };

  // Save changes to a fixed locus
  const handleSaveLocus = (e) => {
    e?.preventDefault();
    if (!editingLocusKey) return;
    sounds.playTap();

    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          icon: locusFormIcon,
          title: locusFormTitle.trim(),
          note: locusFormNote.trim()
        }
      }
    }));

    setEditingLocusKey(null);
    showToast('עוגן ויזואלי עודכן בהצלחה ✓');
  };

  // Clear a locus
  const handleClearLocus = () => {
    if (!editingLocusKey) return;
    sounds.playTap();
    setLociData(prev => ({
      ...prev,
      fixedLoci: {
        ...prev.fixedLoci,
        [editingLocusKey]: {
          ...prev.fixedLoci[editingLocusKey],
          title: '',
          note: ''
        }
      }
    }));
    setEditingLocusKey(null);
    showToast('העוגן פונה מהמיקום ✓');
  };

  // Notice board item toggle
  const handleToggleBoardItem = (idx) => {
    sounds.playTap();
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

  // Notice board add item
  const handleAddBoardItem = (e) => {
    e?.preventDefault();
    if (!newBoardItem.trim()) return;
    sounds.playTap();
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

  // Add custom anchor anywhere on floor
  const handleAddCustomAnchor = (e) => {
    e?.preventDefault();
    if (!customFormTitle.trim()) return;
    sounds.playTap();
    const newA = {
      id: Date.now().toString(),
      x: playerPos.x,
      y: playerPos.y,
      icon: customFormIcon,
      title: customFormTitle.trim(),
      note: customFormNote.trim()
    };
    setLociData(prev => ({
      ...prev,
      customAnchors: [...prev.customAnchors, newA]
    }));
    setCustomFormTitle('');
    setCustomFormNote('');
    setIsAddingCustomAnchor(false);
    showToast('עוגן ויזואלי חדש הוצב בחדר 📌');
  };

  const handleRemoveCustomAnchor = (id) => {
    sounds.playTap();
    setLociData(prev => ({
      ...prev,
      customAnchors: prev.customAnchors.filter(a => a.id !== id)
    }));
    showToast('העוגן הוסר ✓');
  };

  return (
    <div className="stardew-void-viewport" onClick={() => {
      setEditingLocusKey(null);
      setIsAddingCustomAnchor(false);
    }}>
      {/* 1. Stardew Top HUD Bar */}
      <header className="stardew-top-hud" onClick={e => e.stopPropagation()}>
        <div className="stardew-hud-left">
          <button 
            className="stardew-exit-pill-btn" 
            onClick={onClose}
            title="יציאה חזרה לחצר הכפר (Esc)"
          >
            <DoorOpen size={16} />
            <span>יציאה אל הכפר</span>
          </button>
          
          <div className="stardew-room-indicator">
            <span className="room-cottage-icon">🏛️</span>
            <span className="room-indicator-title">מתחם מוסדות הכפר</span>
          </div>

          {onSwitchToCabin && (
            <button 
              className="stardew-mode-switch-btn"
              onClick={onSwitchToCabin}
              title="עבור אל בקתת החווה והמשכן האישי"
            >
              <span>🏡 עבור לבקתת החווה</span>
            </button>
          )}
        </div>

        {/* Center: Quick Action Belt */}
        <div className="stardew-toolbelt-strip">
          <div className="toolbelt-slot active" title="דלפק החנות" onClick={() => openLocusEditor('shop_counter')}>
            <span>🛍️</span>
          </div>
          <div className="toolbelt-slot" title="מדף עליון" onClick={() => openLocusEditor('shelf_top')}>
            <span>🍞</span>
          </div>
          <div className="toolbelt-slot" title="מדף תחתון" onClick={() => openLocusEditor('shelf_bottom')}>
            <span>🍾</span>
          </div>
          <div className="toolbelt-slot" title="אח האבן" onClick={() => openLocusEditor('grand_hearth')}>
            <span>🔥</span>
          </div>
          <div className="toolbelt-slot" title="מזבח הזהב" onClick={() => openLocusEditor('golden_altar')}>
            <span>✨</span>
          </div>
          <div className="toolbelt-slot" title="לוח מודעות" onClick={() => openLocusEditor('notice_board')}>
            <span>📌</span>
          </div>
          <div className="toolbelt-slot" title="הוסף עוגן אישי ברצפה" onClick={() => setIsAddingCustomAnchor(true)}>
            <span>📍</span>
          </div>
        </div>

        {/* Right: Currency & Clock */}
        <div className="stardew-hud-right">
          <div className="stardew-currency-box" title="זרעים">
            <span className="gold-coin-badge">🟡</span>
            <span className="gold-amount">{seeds.toLocaleString()} G</span>
          </div>

          <div className="stardew-clock-frame">
            <div className="clock-date-row">
              <span className="clock-sun-icon">☀️</span>
              <span className="clock-day-label">יום ג' • 2</span>
            </div>
            <div className="clock-time-val">12:50 pm</div>
          </div>

          <div className="stardew-energy-bar" title="אנרגיה (270/270 E)">
            <div className="energy-meter-fill"></div>
            <span className="energy-letter">E</span>
          </div>
        </div>
      </header>

      {/* 2. Floating Notification Toast */}
      {toastMessage && (
        <div className="stardew-toast-banner animate-bounce-gentle" onClick={e => e.stopPropagation()}>
          <Sparkles size={16} className="text-amber" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. The Grand Multi-Wing Stardew Institution Complex Stage */}
      <div 
        className="stardew-complex-stage"
        onClick={e => {
          e.stopPropagation();
          handleFloorClick(e);
        }}
      >
        {/* =========================================================
            LAYER 1: BACK TIMBER WALLS & ARCHITECTURAL WAINSCOTING
            ========================================================= */}
        <div className="complex-back-wall-structure">
          <div className="wall-crown-molding"></div>
          <div className="wall-wainscot-panels"></div>

          {/* Left Wing: Store Shelves & Notice Board */}
          <div className="store-wall-zone">
            <div className="store-wall-shelves-backdrop">
              <div className="shelf-tier s-1">
                <span className="jar">🫙</span>
                <span className="bottle">🍾</span>
                <span className="jar">🍯</span>
                <span className="box">📦</span>
                <span className="bread">🥖</span>
              </div>
              <div className="shelf-tier s-2">
                <span className="seeds-pack">🌾</span>
                <span className="seeds-pack">🥕</span>
                <span className="jar">🫙</span>
                <span className="potion">🧪</span>
                <span className="jam">🍓</span>
              </div>
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
              <div className="board-pin">📌</div>
              <div className="board-sticky-note n1">
                {lociData.fixedLoci.notice_board?.title || 'לוח רשימות'}
              </div>
            </div>
          </div>

          {/* Center Wing: Grand Brick Hearth & Mantelpiece */}
          <div className="hearth-wall-zone">
            <div 
              className="grand-brick-chimney-complex"
              onClick={e => {
                e.stopPropagation();
                openLocusEditor('grand_hearth');
              }}
              title="אח האבן המרכזית — לחץ לעריכת עוגן"
            >
              <div className="brick-flue-stack">
                <div className="chimney-relief-bricks"></div>
              </div>
              <div className="chimney-carved-mantel">
                <span className="mantel-clock">🕰️</span>
                <span className="mantel-candle">🕯️</span>
              </div>
              <div className="chimney-open-firebox">
                <div className="fire-embers-bed">🪵</div>
                <div className="fire-dancing-flames">
                  <span className="flame-spark f1">🔥</span>
                  <span className="flame-spark f2">✨</span>
                  <span className="flame-spark f3">🔥</span>
                </div>
              </div>
              <div className="hearth-ambient-light"></div>
            </div>

            {/* Wall Portraits */}
            <div className="hearth-wall-portraits">
              <div className="mini-framed-picture p1">🌄</div>
              <div className="mini-framed-picture p2">🌻</div>
              <div className="mini-framed-picture p3">🌲</div>
            </div>
          </div>

          {/* Right Wing: Sacred Golden Altar */}
          <div className="shrine-wall-zone">
            <div 
              className="golden-altar-monument"
              onClick={e => {
                e.stopPropagation();
                openLocusEditor('golden_altar');
              }}
              title="מזבח הזהב והקריסטל — לחץ לעריכת עוגן"
            >
              <div className="altar-canopy-arch"></div>
              <div className="altar-golden-chest">
                <span className="altar-relic-gem">
                  {lociData.fixedLoci.golden_altar?.title ? lociData.fixedLoci.golden_altar.icon : '🌟'}
                </span>
                <div className="altar-sacred-glow"></div>
              </div>
              <div className="altar-golden-pillars">
                <span className="pillar left">🏛️</span>
                <span className="pillar right">🏛️</span>
              </div>
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
            <div className="carpet-fringe-border"></div>
            <div className="carpet-inner-medallion">
              <span className="medallion-icon">
                {lociData.fixedLoci.community_carpet?.title ? lociData.fixedLoci.community_carpet.icon : '🌿'}
              </span>
            </div>
          </div>

          {/* Store Welcome Rug */}
          <div className="store-welcome-mat">
            <span>חנות האספקה 🌾</span>
          </div>

          {/* Shrine Sacred Runner */}
          <div className="shrine-carpet-runner"></div>
        </div>

        {/* =========================================================
            LAYER 3: 2.5D FURNITURE & VISUAL LOCI BADGES
            ========================================================= */}

        {/* --- ZONE A: STORE WING --- */}
        {/* Store Counter with Clerk */}
        <div 
          className="furniture-store-counter"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shop_counter');
          }}
          title="דלפק החנות — לחץ לעריכת עוגן"
        >
          <div className="counter-clerk-npc">
            <span className="clerk-sprite">👩‍💼</span>
            <span className="clerk-tag">דלפק כניסה</span>
          </div>
          <div className="counter-wooden-bar">
            <div className="counter-top-props">
              <span className="register-machine">📟</span>
              <span className="brass-scale">⚖️</span>
              <span className="ledger-book">📖</span>
            </div>
          </div>
          {lociData.fixedLoci.shop_counter?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.shop_counter.icon}</span>
              <small>{lociData.fixedLoci.shop_counter.title}</small>
            </div>
          )}
        </div>

        {/* Center Display Shelving Racks */}
        <div 
          className="store-center-aisle-shelf shelf-top"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shelf_top');
          }}
          title="מדף עליון — לחץ לעריכת עוגן"
        >
          <div className="aisle-wooden-framework">
            <div className="aisle-row">
              <span>🥫</span>
              <span>🫙</span>
              <span>🍞</span>
              <span>🫒</span>
              <span>🧀</span>
              <span>🍯</span>
            </div>
          </div>
          {lociData.fixedLoci.shelf_top?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.shelf_top.icon}</span>
              <small>{lociData.fixedLoci.shelf_top.title}</small>
            </div>
          )}
        </div>

        <div 
          className="store-center-aisle-shelf shelf-bottom"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shelf_bottom');
          }}
          title="מדף תחתון — לחץ לעריכת עוגן"
        >
          <div className="aisle-wooden-framework">
            <div className="aisle-row">
              <span>🍾</span>
              <span>🫙</span>
              <span>🥖</span>
              <span>🧂</span>
              <span>🍵</span>
              <span>🍶</span>
            </div>
          </div>
          {lociData.fixedLoci.shelf_bottom?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.shelf_bottom.icon}</span>
              <small>{lociData.fixedLoci.shelf_bottom.title}</small>
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
          <div className="produce-bin">🥕</div>
          <div className="produce-bin">🍎</div>
          <div className="produce-bin">🥔</div>
          {lociData.fixedLoci.produce_bin?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.produce_bin.icon}</span>
              <small>{lociData.fixedLoci.produce_bin.title}</small>
            </div>
          )}
        </div>

        {/* --- ZONE B: HEARTH SALON --- */}
        <div className="salon-potted-ficus left">🪴</div>
        <div className="salon-potted-ficus right">🌴</div>

        {/* Hearth Visual Locus Tag */}
        {lociData.fixedLoci.grand_hearth?.title && (
          <div className="locus-visual-tag hearth-tag">
            <span>{lociData.fixedLoci.grand_hearth.icon}</span>
            <small>{lociData.fixedLoci.grand_hearth.title}</small>
          </div>
        )}

        {/* Central Carpet Visual Locus Tag */}
        {lociData.fixedLoci.community_carpet?.title && (
          <div className="locus-visual-tag carpet-tag">
            <span>{lociData.fixedLoci.community_carpet.icon}</span>
            <small>{lociData.fixedLoci.community_carpet.title}</small>
          </div>
        )}

        {/* Decorative NPCs in Salon */}
        <div className="npc-villager-sprite caroline-npc" title="דמות בכפר (קרוליין)">
          <div className="npc-avatar">👩‍🌾</div>
          <span className="npc-label">קרוליין</span>
        </div>

        <div className="npc-villager-sprite abigail-npc" title="דמות בכפר (אביגיל)">
          <div className="npc-avatar">🧝‍♀️</div>
          <span className="npc-label">אביגיל</span>
        </div>

        <div className="salon-cushion-stool s1">🛋️</div>
        <div className="salon-cushion-stool s2">🛋️</div>

        {/* Tea Table */}
        <div 
          className="salon-tea-station"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('tea_table');
          }}
          title="שולחן המפגש — לחץ לעריכת עוגן"
        >
          <span>🫖 ☕</span>
          {lociData.fixedLoci.tea_table?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.tea_table.icon}</span>
              <small>{lociData.fixedLoci.tea_table.title}</small>
            </div>
          )}
        </div>

        {/* --- ZONE C: SHRINE SANCTUARY --- */}
        {/* Shrine Altar Tag */}
        {lociData.fixedLoci.golden_altar?.title && (
          <div className="locus-visual-tag altar-tag">
            <span>{lociData.fixedLoci.golden_altar.icon}</span>
            <small>{lociData.fixedLoci.golden_altar.title}</small>
          </div>
        )}

        {/* Blue Velvet Benches */}
        <div 
          className="shrine-blue-benches-complex"
          onClick={e => {
            e.stopPropagation();
            openLocusEditor('shrine_benches');
          }}
          title="ספסלי ההיכל — לחץ לעריכת עוגן"
        >
          <div className="bench-row">
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
          </div>
          <div className="bench-row">
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
            <span className="blue-velvet-cushion">🟦</span>
          </div>
          {lociData.fixedLoci.shrine_benches?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.shrine_benches.icon}</span>
              <small>{lociData.fixedLoci.shrine_benches.title}</small>
            </div>
          )}
        </div>

        <div className="shrine-candle-holder">🕯️</div>

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
              <span>{anchor.icon}</span>
            </div>
            <span className="anchor-title-chip">{anchor.title}</span>
          </div>
        ))}

        {/* Canvas for Character Motion */}
        <canvas 
          ref={canvasRef} 
          width={960} 
          height={520} 
          className="complex-player-canvas"
        />

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

      {/* 4. Controls Footer Bar */}
      <footer className="stardew-controls-hint">
        <span>🎮 תנועה: חיצים / WASD / לחיצה בעכבר</span>
        <span>• עריכת עוגן: לחץ על כל חפץ או מקש רווח בקרבתו</span>
        <span>• הוספת עוגן ברצפה: סמל 📍 בסרגל העליון</span>
      </footer>

      {/* =========================================================
          CLEAN VISUAL LOCUS EDITOR MODAL (NO PREACHY TEXTS)
          ========================================================= */}
      {editingLocusKey && (
        <div className="anchor-modal-backdrop" onClick={() => setEditingLocusKey(null)}>
          <div className="anchor-dialog-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-wrap">
                <span className="text-3xl">{locusFormIcon}</span>
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
                <div className="clean-items-list">
                  {(lociData.fixedLoci.notice_board?.items || []).map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className={`clean-item-row ${item.completed ? 'is-done' : ''}`}
                      onClick={() => handleToggleBoardItem(idx)}
                    >
                      <div className="item-chk">
                        {item.completed && <Check size={14} className="text-emerald" />}
                      </div>
                      <span className="item-txt">{item.text}</span>
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
              </div>
            ) : (
              /* Standard Clean Locus Form */
              <form onSubmit={handleSaveLocus} className="clean-locus-form">
                <label>בחר סמל ויזואלי ברור:</label>
                <div className="emoji-picker-strip">
                  {VISUAL_ICONS.map(icon => (
                    <button 
                      key={icon} 
                      type="button" 
                      className={`emoji-btn ${locusFormIcon === icon ? 'selected' : ''}`}
                      onClick={() => setLocusFormIcon(icon)}
                    >
                      {icon}
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
                <span className="text-3xl">{customFormIcon}</span>
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
              <div className="emoji-picker-strip">
                {VISUAL_ICONS.map(icon => (
                  <button 
                    key={icon} 
                    type="button" 
                    className={`emoji-btn ${customFormIcon === icon ? 'selected' : ''}`}
                    onClick={() => setCustomFormIcon(icon)}
                  >
                    {icon}
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
    </div>
  );
}
