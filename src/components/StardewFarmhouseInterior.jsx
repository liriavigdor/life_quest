import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Flame, 
  DoorOpen, 
  Coffee, 
  Gift, 
  Sparkles, 
  Tv, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  Edit3, 
  Image as ImageIcon,
  Droplets,
  Bed as BedIcon
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';

// Visual Icon Catalog for Spatial Memory Anchoring
const VISUAL_ICONS = [
  '🔑', '🪪', '📱', '💼', '🚗', '🏠', '☕', '💎', '📜', '🎨', 
  '🎸', '📚', '🏆', '🧭', '🍎', '🛡️', '⚔️', '🍞', '📦', '🪴', 
  '🧸', '🪞', '🔦', '🧩', '⏰', '🌿', '🌾', '🌊', '☀️', '🌙', 
  '🌟', '🎯', '🧺', '🕯️', '🫖', '🍾', '🥕', '🫙', '🧪', '🧀'
];

export function StardewFarmhouseInterior({
  building,
  catalogItem,
  onClose,
  seeds = 0,
  onEarnSeeds,
  villagerLook = {},
  currentOutfit = 'autumn_sweater',
  onSwitchToComplex
}) {
  // Storage key for this interior space
  const storageKey = `lifequest_stardew_farmhouse_loci_${building?.gx || 0}_${building?.gy || 0}`;

  // Clean loci data - blank canvas for user's visual memory palace
  const [lociData, setLociData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return {
      roomName: building?.customName || catalogItem?.name || 'בקתת החווה והמשכן האישי',
      fixedLoci: {
        fireplace: { id: 'fireplace', name: 'אח מבוערת', icon: '🔥', title: '', note: '' },
        bed: { id: 'bed', name: 'מיטה כפרית', icon: '🛏️', title: '', note: '' },
        table: { id: 'table', name: 'שולחן עץ', icon: '☕', title: '', note: '' },
        tv: { id: 'tv', name: 'טלוויזיה', icon: '📺', title: '', note: '' },
        picture: { id: 'picture', name: 'תמונה תלויה', icon: '🖼️', title: '', note: '' },
        plant: { id: 'plant', name: 'עציץ ירוק', icon: '🪴', title: '', note: '' },
        gift: { id: 'gift', name: 'תיבת חבילה', icon: '🎁', title: '', note: '' }
      },
      customAnchors: []
    };
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(lociData));
    } catch (e) {
      console.error(e);
    }
  }, [lociData, storageKey]);

  // Locus Editor Modal State
  const [editingLocusKey, setEditingLocusKey] = useState(null);
  const [locusFormIcon, setLocusFormIcon] = useState('📌');
  const [locusFormTitle, setLocusFormTitle] = useState('');
  const [locusFormNote, setLocusFormNote] = useState('');

  // Custom Anchor Modal State
  const [isAddingCustomAnchor, setIsAddingCustomAnchor] = useState(false);
  const [customFormIcon, setCustomFormIcon] = useState('📌');
  const [customFormTitle, setCustomFormTitle] = useState('');
  const [customFormNote, setCustomFormNote] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2200);
  };

  // Player Character Movement & Canvas
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 380 });
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
      const step = 15;

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
        const nextX = Math.max(70, Math.min(570, prev.x + dx));
        const nextY = Math.max(120, Math.min(430, prev.y + dy));

        if (nextX >= 270 && nextX <= 330 && nextY >= 420) {
          showToast('יציאה לכפר 🍃');
          setTimeout(() => onClose(), 200);
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

    const targetX = Math.max(70, Math.min(570, clickX));
    const targetY = Math.max(120, Math.min(420, clickY));

    setPlayerFacingLeft(targetX < playerPos.x);
    playerTargetRef.current = { x: targetX, y: targetY };
    setIsPlayerWalking(true);
  };

  // Continuous animation loop
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

            if (curr.x >= 270 && curr.x <= 330 && curr.y >= 415) {
              showToast('יציאה לכפר 🍃');
              setTimeout(() => onClose(), 200);
            }

            return { x: target.x, y: target.y };
          }

          const speed = 195;
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
          scale: 0.92,
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

  // Object Proximity Coordinates
  const OBJECT_LOCATIONS = {
    fireplace: { x: 490, y: 150, name: 'אח מבוערת', locusKey: 'fireplace' },
    bed: { x: 500, y: 350, name: 'מיטה כפרית', locusKey: 'bed' },
    table: { x: 310, y: 220, name: 'שולחן עץ', locusKey: 'table' },
    tv: { x: 120, y: 190, name: 'טלוויזיה', locusKey: 'tv' },
    plant: { x: 100, y: 390, name: 'עציץ ירוק', locusKey: 'plant' },
    gift: { x: 230, y: 290, name: 'תיבת חבילה', locusKey: 'gift' },
    picture: { x: 375, y: 130, name: 'תמונה תלויה', locusKey: 'picture' },
    door: { x: 300, y: 430, name: 'יציאה לכפר', locusKey: null }
  };

  const nearestObject = useMemo(() => {
    let nearest = null;
    let minDist = 75;

    Object.entries(OBJECT_LOCATIONS).forEach(([key, loc]) => {
      const dist = Math.hypot(playerPos.x - loc.x, playerPos.y - loc.y);
      if (dist < minDist) {
        minDist = dist;
        nearest = { key, ...loc, dist };
      }
    });

    return nearest;
  }, [playerPos]);

  const checkProximityInteraction = () => {
    if (!nearestObject) return;
    if (nearestObject.key === 'door') {
      onClose();
    } else {
      openLocusEditor(nearestObject.locusKey);
    }
  };

  const openLocusEditor = (locusKey) => {
    sounds.playTap?.();
    const current = lociData.fixedLoci[locusKey];
    if (current) {
      setLocusFormIcon(current.icon || '📌');
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
          note: locusFormNote.trim()
        }
      }
    }));

    setEditingLocusKey(null);
    showToast('עוגן ויזואלי עודכן בהצלחה ✓');
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
          note: ''
        }
      }
    }));
    setEditingLocusKey(null);
    showToast('העוגן פונה מהמיקום ✓');
  };

  const handleAddCustomAnchor = (e) => {
    e?.preventDefault();
    if (!customFormTitle.trim()) return;
    sounds.playTap?.();

    const newAnchor = {
      id: Date.now().toString(),
      x: playerPos.x,
      y: playerPos.y,
      icon: customFormIcon,
      title: customFormTitle.trim(),
      note: customFormNote.trim()
    };

    setLociData(prev => ({
      ...prev,
      customAnchors: [...prev.customAnchors, newAnchor]
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

  return (
    <div className="stardew-void-viewport" onClick={() => {
      setEditingLocusKey(null);
      setIsAddingCustomAnchor(false);
    }}>
      {/* 1. Stardew Retro HUD Bar (Top of Screen) */}
      <header className="stardew-top-hud" onClick={e => e.stopPropagation()}>
        <div className="stardew-hud-left">
          <button 
            className="stardew-exit-pill-btn" 
            onClick={onClose}
            title="יציאה לחצר הכפר (Esc)"
          >
            <DoorOpen size={16} />
            <span>יציאה לכפר</span>
          </button>
          
          <div className="stardew-room-indicator">
            <span className="room-cottage-icon">🏡</span>
            <span className="room-indicator-title">{lociData.roomName}</span>
          </div>

          {onSwitchToComplex && (
            <button 
              className="stardew-mode-switch-btn"
              onClick={onSwitchToComplex}
              title="עבור אל מתחם מוסדות הכפר והקהילה"
            >
              <span>🏛️ עבור למתחם מוסדות הכפר</span>
            </button>
          )}
        </div>

        {/* Center: Toolbelt Quick Slots */}
        <div className="stardew-toolbelt-strip">
          <div className="toolbelt-slot active" title="אח מבוערת" onClick={() => openLocusEditor('fireplace')}>
            <span>🔥</span>
          </div>
          <div className="toolbelt-slot" title="מיטה" onClick={() => openLocusEditor('bed')}>
            <span>🛏️</span>
          </div>
          <div className="toolbelt-slot" title="שולחן" onClick={() => openLocusEditor('table')}>
            <span>☕</span>
          </div>
          <div className="toolbelt-slot" title="טלוויזיה" onClick={() => openLocusEditor('tv')}>
            <span>📺</span>
          </div>
          <div className="toolbelt-slot" title="עציץ" onClick={() => openLocusEditor('plant')}>
            <span>🪴</span>
          </div>
          <div className="toolbelt-slot" title="תמונה" onClick={() => openLocusEditor('picture')}>
            <span>🖼️</span>
          </div>
          <div className="toolbelt-slot" title="תיבת חבילה" onClick={() => openLocusEditor('gift')}>
            <span>🎁</span>
          </div>
          <div className="toolbelt-slot" title="הוסף עוגן ברצפה" onClick={() => setIsAddingCustomAnchor(true)}>
            <span>📍</span>
          </div>
        </div>

        {/* Right: Currency & Clock HUD */}
        <div className="stardew-hud-right">
          <div className="stardew-currency-box" title="זרעים">
            <span className="gold-coin-badge">🟡</span>
            <span className="gold-amount">{seeds.toLocaleString()} G</span>
          </div>

          <div className="stardew-clock-frame">
            <div className="clock-date-row">
              <span className="clock-sun-icon">☀️</span>
              <span className="clock-day-label">יום ב' • 1</span>
            </div>
            <div className="clock-time-val">06:10 am</div>
          </div>

          <div className="stardew-energy-bar" title="מד אנרגיה (270/270 E)">
            <div className="energy-meter-fill"></div>
            <span className="energy-letter">E</span>
          </div>
        </div>
      </header>

      {/* 2. Toast Banner */}
      {toastMessage && (
        <div className="stardew-toast-banner animate-bounce-gentle" onClick={e => e.stopPropagation()}>
          <Sparkles size={16} className="text-amber" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. The Central Warm Stardew Farmhouse Room */}
      <div 
        className="stardew-farmhouse-stage" 
        onClick={e => {
          e.stopPropagation();
          handleFloorClick(e);
        }}
      >
        {/* === ROOM ARCHITECTURE === */}
        <div className="farmhouse-back-wall">
          <div className="wall-timber-beam"></div>
          <div className="wall-horizontal-stripes"></div>

          {/* Arched Window with Sunbeam */}
          <div className="room-window-complex" title="חלון בוקר כפרי">
            <div className="window-frame">
              <div className="window-pane top-left"></div>
              <div className="window-pane top-right"></div>
              <div className="window-pane bottom-left"></div>
              <div className="window-pane bottom-right"></div>
            </div>
          </div>

          <div className="sunbeam-light-cast"></div>

          {/* Framed Wall Painting */}
          <div 
            className="room-wall-painting"
            onClick={(e) => {
              e.stopPropagation();
              openLocusEditor('picture');
            }}
            title="תמונה תלויה — לחץ לעריכת עוגן"
          >
            <div className="painting-canvas">
              <span className="painting-landscape">
                {lociData.fixedLoci.picture?.title ? lociData.fixedLoci.picture.icon : '🏔️'}
              </span>
            </div>
            {lociData.fixedLoci.picture?.title && (
              <div className="locus-visual-tag">
                <span>{lociData.fixedLoci.picture.icon}</span>
                <small>{lociData.fixedLoci.picture.title}</small>
              </div>
            )}
          </div>

          {/* Glowing Brick Fireplace & Chimney */}
          <div 
            className="room-brick-fireplace"
            onClick={(e) => {
              e.stopPropagation();
              openLocusEditor('fireplace');
            }}
            title="אח מבוערת — לחץ לעריכת עוגן"
          >
            <div className="chimney-brick-stack"></div>
            <div className="fireplace-mantel"></div>
            <div className="fireplace-hearth-arch">
              <div className="fire-logs">🪵</div>
              <div className="fire-animated-flames">
                <span className="flame-spark f-1">🔥</span>
                <span className="flame-spark f-2">✨</span>
                <span className="flame-spark f-3">🔥</span>
              </div>
            </div>
            <div className="hearth-radial-glow"></div>
            {lociData.fixedLoci.fireplace?.title && (
              <div className="locus-visual-tag hearth-tag">
                <span>{lociData.fixedLoci.fireplace.icon}</span>
                <small>{lociData.fixedLoci.fireplace.title}</small>
              </div>
            )}
          </div>
        </div>

        {/* Walls */}
        <div className="farmhouse-left-wall"></div>
        <div className="farmhouse-right-wall"></div>

        {/* === FURNITURE & ANCHOR STATIONS === */}

        {/* Retro CRT TV (Left Side) */}
        <div 
          className="furniture-retro-tv"
          style={{ left: `${OBJECT_LOCATIONS.tv.x - 30}px`, top: `${OBJECT_LOCATIONS.tv.y - 45}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('tv');
          }}
          title="טלוויזיה — לחץ לעריכת עוגן"
        >
          <div className="tv-rabbit-ears"></div>
          <div className="tv-cabinet screen-on">
            <div className="tv-glass-screen">
              <div className="tv-scanlines">
                <span className="tv-pixel-icon">
                  {lociData.fixedLoci.tv?.title ? lociData.fixedLoci.tv.icon : '📺'}
                </span>
              </div>
            </div>
            <div className="tv-knobs-panel">
              <span className="tv-knob"></span>
              <span className="tv-knob"></span>
            </div>
          </div>
          <div className="tv-wooden-stand"></div>
          {lociData.fixedLoci.tv?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.tv.icon}</span>
              <small>{lociData.fixedLoci.tv.title}</small>
            </div>
          )}
        </div>

        {/* Table & Chair (Center-Left) */}
        <div 
          className="furniture-table-set"
          style={{ left: `${OBJECT_LOCATIONS.table.x - 40}px`, top: `${OBJECT_LOCATIONS.table.y - 40}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('table');
          }}
          title="שולחן עץ — לחץ לעריכת עוגן"
        >
          <div className="table-wooden-chair">
            <div className="chair-backrest"></div>
            <div className="chair-seat"></div>
            <div className="chair-legs"></div>
          </div>

          <div className="table-wooden-desk">
            <div className="table-steaming-mug">
              <div className="steam-curl s1"></div>
              <div className="steam-curl s2"></div>
              <span className="mug-emoji">
                {lociData.fixedLoci.table?.title ? lociData.fixedLoci.table.icon : '☕'}
              </span>
            </div>
          </div>
          {lociData.fixedLoci.table?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.table.icon}</span>
              <small>{lociData.fixedLoci.table.title}</small>
            </div>
          )}
        </div>

        {/* Potted Houseplant (Bottom-Left) */}
        <div 
          className="furniture-potted-plant"
          style={{ left: `${OBJECT_LOCATIONS.plant.x - 20}px`, top: `${OBJECT_LOCATIONS.plant.y - 30}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('plant');
          }}
          title="עציץ ירוק — לחץ לעריכת עוגן"
        >
          <div className="plant-greenery">🌿</div>
          <div className="plant-terracotta-pot">🪴</div>
          {lociData.fixedLoci.plant?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.plant.icon}</span>
              <small>{lociData.fixedLoci.plant.title}</small>
            </div>
          )}
        </div>

        {/* Wrapped Gift Box / Parcel (Center) */}
        <div 
          className="furniture-gift-parcel"
          style={{ left: `${OBJECT_LOCATIONS.gift.x - 20}px`, top: `${OBJECT_LOCATIONS.gift.y - 20}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('gift');
          }}
          title="תיבת חבילה — לחץ לעריכת עוגן"
        >
          <div className="gift-box-wrap">
            <span className="gift-emoji">
              {lociData.fixedLoci.gift?.title ? lociData.fixedLoci.gift.icon : '🎁'}
            </span>
          </div>
          {lociData.fixedLoci.gift?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.gift.icon}</span>
              <small>{lociData.fixedLoci.gift.title}</small>
            </div>
          )}
        </div>

        {/* Woven Patterned Rug in front of Bed */}
        <div 
          className="furniture-woven-rug"
          style={{ left: `${OBJECT_LOCATIONS.bed.x - 110}px`, top: `${OBJECT_LOCATIONS.bed.y - 20}px` }}
        >
          <div className="rug-diamond"></div>
        </div>

        {/* The Cozy Bed (Bottom-Right) */}
        <div 
          className="furniture-cozy-bed"
          style={{ left: `${OBJECT_LOCATIONS.bed.x - 35}px`, top: `${OBJECT_LOCATIONS.bed.y - 60}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('bed');
          }}
          title="מיטה כפרית — לחץ לעריכת עוגן"
        >
          <div className="bed-headboard"></div>
          <div className="bed-mattress">
            <div className="bed-plush-pillow"></div>
            <div className="bed-red-quilt"></div>
          </div>
          {lociData.fixedLoci.bed?.title && (
            <div className="locus-visual-tag">
              <span>{lociData.fixedLoci.bed.icon}</span>
              <small>{lociData.fixedLoci.bed.title}</small>
            </div>
          )}
        </div>

        {/* Custom Floor Placed Anchors */}
        {lociData.customAnchors.map((anchor) => (
          <div 
            key={anchor.id}
            className="room-placed-anchor"
            style={{ left: `${anchor.x - 16}px`, top: `${anchor.y - 16}px` }}
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveCustomAnchor(anchor.id);
            }}
            title={`${anchor.title}: ${anchor.note} (לחץ להסרה)`}
          >
            <div className="anchor-pin-head">
              <span className="anchor-icon">{anchor.icon}</span>
            </div>
            <span className="anchor-label-tag">{anchor.title}</span>
          </div>
        ))}

        {/* Villager Canvas */}
        <canvas 
          ref={canvasRef} 
          width={640} 
          height={460} 
          className="farmhouse-player-canvas"
        />

        {/* Proximity Interaction Bubble */}
        {nearestObject && (
          <div 
            className="stardew-proximity-bubble"
            style={{ left: `${nearestObject.x}px`, top: `${nearestObject.y - 50}px` }}
            onClick={(e) => {
              e.stopPropagation();
              checkProximityInteraction();
            }}
          >
            <span className="bubble-icon">📌</span>
            <span className="bubble-text">{nearestObject.name}</span>
            <span className="bubble-key-hint">[רווח לעריכה]</span>
          </div>
        )}

        {/* Doorway Notch */}
        <div 
          className="farmhouse-doorway-notch"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          title="יציאה לחצר הכפר"
        >
          <div className="doorway-doormat">
            <span>יציאה לכפר 🍃</span>
          </div>
        </div>
      </div>

      {/* 4. Controls Footer Hint */}
      <footer className="stardew-controls-hint">
        <span>🎮 תנועה: חיצים / WASD / לחיצה בעכבר</span>
        <span>• עריכת עוגן: לחץ על כל רהיט או מקש רווח בקרבתו</span>
        <span>• הוספת עוגן ברצפה: סמל 📍 בסרגל העליון</span>
      </footer>

      {/* =========================================================================
          CLEAN VISUAL LOCUS EDITOR MODAL (NO PREACHY TEXTS)
          ========================================================================= */}
      {editingLocusKey && (
        <div className="anchor-modal-backdrop" onClick={() => setEditingLocusKey(null)}>
          <div className="anchor-dialog-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-wrap">
                <span className="text-3xl">{locusFormIcon}</span>
                <div>
                  <h3>{lociData.fixedLoci[editingLocusKey]?.name}</h3>
                  <span className="dialog-sub">משבצת עוגן ויזואלי בחדר</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setEditingLocusKey(null)}>
                <X size={18} />
              </button>
            </div>

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
