import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  DoorOpen, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  Brain,
  Compass
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { 
  GrandHearthSVG, 
  RetroTvSVG, 
  TeaTableSVG, 
  CozyBedSVG, 
  PottedPlantSVG, 
  GiftParcelSVG,
  VectorAnchorToken,
  VECTOR_ANCHOR_TOKENS
} from './stardewArt/StardewVectorAssets';

export function StardewFarmhouseInterior({
  building,
  catalogItem,
  onClose,
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
        fireplace: { id: 'fireplace', name: 'אח מבוערת', icon: 'star', title: '', note: '', lastCultivated: null },
        bed: { id: 'bed', name: 'מיטה כפרית', icon: 'shield', title: '', note: '', lastCultivated: null },
        table: { id: 'table', name: 'שולחן עבודה', icon: 'coffee', title: '', note: '', lastCultivated: null },
        tv: { id: 'tv', name: 'טלוויזיה נוסטלגית', icon: 'clock', title: '', note: '', lastCultivated: null },
        picture: { id: 'picture', name: 'תמונה תלויה', icon: 'scroll', title: '', note: '', lastCultivated: null },
        plant: { id: 'plant', name: 'עציץ ירוק', icon: 'wheat', title: '', note: '', lastCultivated: null },
        gift: { id: 'gift', name: 'תיבת חבילה', icon: 'gem', title: '', note: '', lastCultivated: null }
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
  const [locusFormIcon, setLocusFormIcon] = useState('key');
  const [locusFormTitle, setLocusFormTitle] = useState('');
  const [locusFormNote, setLocusFormNote] = useState('');

  // Custom Anchor Modal State
  const [isAddingCustomAnchor, setIsAddingCustomAnchor] = useState(false);
  const [customFormIcon, setCustomFormIcon] = useState('key');
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
    tv: { x: 120, y: 190, name: 'טלוויזיה נוסטלגית', locusKey: 'tv' },
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
      note: customFormNote.trim(),
      lastCultivated: new Date().toISOString().split('T')[0]
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

  const activeCount = Object.values(lociData.fixedLoci).filter(l => l.title?.trim()).length + lociData.customAnchors.length;

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

        {/* Center: Toolbelt Quick Slots (Vector Tokens) */}
        <div className="stardew-toolbelt-strip">
          <div className="toolbelt-slot active" title="אח מבוערת" onClick={() => openLocusEditor('fireplace')}>
            <VectorAnchorToken icon="star" size={24} />
          </div>
          <div className="toolbelt-slot" title="מיטה" onClick={() => openLocusEditor('bed')}>
            <VectorAnchorToken icon="shield" size={24} />
          </div>
          <div className="toolbelt-slot" title="שולחן" onClick={() => openLocusEditor('table')}>
            <VectorAnchorToken icon="coffee" size={24} />
          </div>
          <div className="toolbelt-slot" title="טלוויזיה" onClick={() => openLocusEditor('tv')}>
            <VectorAnchorToken icon="clock" size={24} />
          </div>
          <div className="toolbelt-slot" title="עציץ" onClick={() => openLocusEditor('plant')}>
            <VectorAnchorToken icon="wheat" size={24} />
          </div>
          <div className="toolbelt-slot" title="תמונה" onClick={() => openLocusEditor('picture')}>
            <VectorAnchorToken icon="scroll" size={24} />
          </div>
          <div className="toolbelt-slot" title="תיבת חבילה" onClick={() => openLocusEditor('gift')}>
            <VectorAnchorToken icon="gem" size={24} />
          </div>
          <div className="toolbelt-slot" title="הוסף עוגן ברצפה" onClick={() => setIsAddingCustomAnchor(true)}>
            <VectorAnchorToken icon="compass" size={24} />
          </div>
        </div>

        {/* Right: Anchors Count & Memory Cultivation Status */}
        <div className="stardew-hud-right">
          <div className="stardew-currency-box memory-counter-box" title="עוגנים פעילים בחלל זה">
            <Brain size={16} className="text-amber" />
            <span className="gold-amount">{activeCount} עוגנים</span>
          </div>

          <div className="stardew-clock-frame">
            <div className="clock-date-row">
              <span className="clock-sun-icon">☀️</span>
              <span className="clock-day-label">משכן אישי</span>
            </div>
            <div className="clock-time-val">רענון יומי</div>
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
              <VectorAnchorToken icon={lociData.fixedLoci.picture?.title ? lociData.fixedLoci.picture.icon : 'scroll'} size={26} />
            </div>
            {lociData.fixedLoci.picture?.title && (
              <div className="locus-visual-tag">
                <VectorAnchorToken icon={lociData.fixedLoci.picture.icon} size={20} />
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
            <GrandHearthSVG />
            {lociData.fixedLoci.fireplace?.title && (
              <div className="locus-visual-tag hearth-tag">
                <VectorAnchorToken icon={lociData.fixedLoci.fireplace.icon} size={20} />
                <small>{lociData.fixedLoci.fireplace.title}</small>
              </div>
            )}
          </div>
        </div>

        {/* Walls */}
        <div className="farmhouse-left-wall"></div>
        <div className="farmhouse-right-wall"></div>

        {/* === FURNITURE & ANCHOR STATIONS (VECTOR CRAFTED) === */}

        {/* Retro CRT TV (Left Side) */}
        <div 
          className="furniture-retro-tv"
          style={{ left: `${OBJECT_LOCATIONS.tv.x - 30}px`, top: `${OBJECT_LOCATIONS.tv.y - 45}px` }}
          onClick={(e) => {
            e.stopPropagation();
            openLocusEditor('tv');
          }}
          title="טלוויזיה נוסטלגית — לחץ לעריכת עוגן"
        >
          <RetroTvSVG />
          {lociData.fixedLoci.tv?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.tv.icon} size={20} />
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
          <TeaTableSVG />
          {lociData.fixedLoci.table?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.table.icon} size={20} />
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
          <PottedPlantSVG />
          {lociData.fixedLoci.plant?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.plant.icon} size={20} />
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
          <GiftParcelSVG />
          {lociData.fixedLoci.gift?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.gift.icon} size={20} />
              <small>{lociData.fixedLoci.gift.title}</small>
            </div>
          )}
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
          <CozyBedSVG />
          {lociData.fixedLoci.bed?.title && (
            <div className="locus-visual-tag">
              <VectorAnchorToken icon={lociData.fixedLoci.bed.icon} size={20} />
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
              <VectorAnchorToken icon={anchor.icon} size={20} />
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
        <span>• הוספת עוגן ברצפה: סמל מצפן בסרגל העליון</span>
      </footer>

      {/* =========================================================================
          CLEAN VECTOR LOCUS EDITOR MODAL
          ========================================================================= */}
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
                  <span className="dialog-sub">משבצת עוגן ויזואלי בחדר</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setEditingLocusKey(null)}>
                <X size={18} />
              </button>
            </div>

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
                    title="רענן עוגן זה בזיכרון (חזרתיות פעילה)"
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
    </div>
  );
}
