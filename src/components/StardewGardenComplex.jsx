import React, { useState, useEffect, useRef } from 'react';
import { 
  Sprout, 
  Droplets, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  RotateCcw, 
  Flower2, 
  Carrot, 
  Sun,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { GardenArchitectureSVG, GARDEN_W, GARDEN_H } from './stardewArt/GardenArchitecture';
import { 
  resolveGardenMove, 
  snapToGardenWalkable, 
  isGardenWalkable 
} from '../utils/gardenNavigation';

export function StardewGardenComplex({
  building,
  catalogItem,
  onClose,
  villagerLook = {},
  currentOutfit = 'autumn_sweater',
  onEarnSeeds
}) {
  const storageKey = `lifequest_garden_complex_data_${building?.gx || 0}_${building?.gy || 0}`;

  // Persistent Garden State
  const [gardenData, setGardenData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      waterCanLevel: 100, // 0 - 100
      totalHarvests: 4,
      sproutingTray: [
        { id: 'sprout_1', name: 'נבט בזיליקום', note: 'רעיון לשיפור שגרת בוקר', stage: 2, type: 'herb' },
        { id: 'sprout_2', name: 'זרע גזר מתוק', note: 'לזכור לשתות מים', stage: 1, type: 'root' }
      ],
      plots: {
        root_1: { id: 'root_1', name: 'ערוגת גזרים כתומים', crop: 'גזר מתוק', memory: 'תזונה בריאה וארוחת בוקר', stage: 3, readyToHarvest: true, type: 'root' },
        root_2: { id: 'root_2', name: 'ערוגת צנוניות בר', crop: 'צנונית בר', memory: 'לצאת להליכה קצרה בערב', stage: 2, readyToHarvest: false, type: 'root' },
        root_3: { id: 'root_3', name: 'ערוגת סלק אדום', crop: null, memory: '', stage: 0, readyToHarvest: false, type: 'root' },
        herb_1: { id: 'herb_1', name: 'אדנית רוזמרין מרפא', crop: 'רוזמרין', memory: 'נשימות עמוקות לפני פגישה', stage: 3, readyToHarvest: true, type: 'herb' },
        herb_2: { id: 'herb_2', name: 'אדנית מנטה מרעננת', crop: 'מנטה', memory: 'שיחה טובה עם חבר', stage: 2, readyToHarvest: false, type: 'herb' },
        herb_3: { id: 'herb_3', name: 'אדנית לבנדר מרגיע', crop: null, memory: '', stage: 0, readyToHarvest: false, type: 'herb' },
        flower_1: { id: 'flower_1', name: 'ערוגת חמניות שמש', crop: 'חמנית זהב', memory: 'הכרת תודה על רגע של שקט', stage: 3, readyToHarvest: true, type: 'flower' },
        flower_2: { id: 'flower_2', name: 'ערוגת סחלבים זוהרים', crop: 'סחלב סגול', memory: 'הברקה יצירתית לפרויקט', stage: 1, readyToHarvest: false, type: 'flower' }
      }
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(gardenData));
    } catch (e) {
      console.error(e);
    }
  }, [gardenData, storageKey]);

  // Modal States
  const [activePlot, setActivePlot] = useState(null);
  const [isSproutingModalOpen, setIsSproutingModalOpen] = useState(false);
  const [newSeedName, setNewSeedName] = useState('');
  const [newSeedMemory, setNewSeedMemory] = useState('');
  const [newSeedType, setNewSeedType] = useState('root');

  // Floating Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Avatar Physics & Navigation
  const canvasRef = useRef(null);
  const playerPosRef = useRef({ x: 550, y: 520 }); // Starts near entrance stoop
  const playerTargetRef = useRef(null);
  const facingLeftRef = useRef(false);
  const isWalkingRef = useRef(false);
  const walkCycleRef = useRef(0);
  const heldKeysRef = useRef(new Set());
  const destinationMarkerRef = useRef({ active: false, x: 0, y: 0, createdAt: 0 });

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        heldKeysRef.current.add(e.code);
        playerTargetRef.current = null;
        destinationMarkerRef.current.active = false;
      }
      if (e.code === 'Escape') {
        if (activePlot) setActivePlot(null);
        else if (isSproutingModalOpen) setIsSproutingModalOpen(false);
        else onClose();
      }
    };

    const handleKeyUp = (e) => {
      heldKeysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activePlot, isSproutingModalOpen, onClose]);

  // Click-to-move Canvas
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = GARDEN_W / rect.width;
    const scaleY = GARDEN_H / rect.height;
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;

    const snapped = snapToGardenWalkable(rawX, rawY);
    playerTargetRef.current = snapped;
    destinationMarkerRef.current = {
      active: true,
      x: snapped.x,
      y: snapped.y,
      createdAt: performance.now()
    };
  };

  // Main 60fps Animation Loop
  useEffect(() => {
    let isCancelled = false;
    let lastTime = performance.now();

    const loop = (time) => {
      if (isCancelled) return;
      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(0.04, Math.max(0.001, rawDt));

      const curPos = playerPosRef.current;
      const heldKeys = heldKeysRef.current;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      const walkSpeed = 230;

      // 1. Keyboard
      if (heldKeys.size > 0 && !isTyping) {
        let kdx = 0;
        let kdy = 0;
        if (heldKeys.has('KeyW') || heldKeys.has('ArrowUp')) kdy -= 1;
        if (heldKeys.has('KeyS') || heldKeys.has('ArrowDown')) kdy += 1;
        if (heldKeys.has('KeyA') || heldKeys.has('ArrowLeft')) kdx -= 1;
        if (heldKeys.has('KeyD') || heldKeys.has('ArrowRight')) kdx += 1;

        if (kdx !== 0 || kdy !== 0) {
          const len = Math.hypot(kdx, kdy);
          const vx = (kdx / len) * walkSpeed * dt;
          const vy = (kdy / len) * walkSpeed * dt;
          const next = resolveGardenMove(curPos, vx, vy);

          if (kdx < 0) facingLeftRef.current = true;
          else if (kdx > 0) facingLeftRef.current = false;

          playerPosRef.current = next;
          isWalkingRef.current = true;
          walkCycleRef.current += Math.PI * 2 * 3.4 * dt;

          // Village Exit Check
          if (next.x >= 490 && next.x <= 610 && next.y >= 554) {
            showToast('יציאה לכפר 🍃');
            setTimeout(() => onClose(), 180);
          }
        } else {
          isWalkingRef.current = false;
        }
      }
      // 2. Click to move
      else if (playerTargetRef.current) {
        const target = playerTargetRef.current;
        const dx = target.x - curPos.x;
        const dy = target.y - curPos.y;
        const dist = Math.hypot(dx, dy);

        if (dist <= 6) {
          playerPosRef.current = { x: target.x, y: target.y };
          playerTargetRef.current = null;
          isWalkingRef.current = false;
          destinationMarkerRef.current.active = false;
          if (target.x >= 490 && target.x <= 610 && target.y >= 554) {
            showToast('יציאה לכפר 🍃');
            setTimeout(() => onClose(), 180);
          }
        } else {
          const stepDist = Math.min(dist, walkSpeed * dt);
          const vx = (dx / dist) * stepDist;
          const vy = (dy / dist) * stepDist;
          const next = resolveGardenMove(curPos, vx, vy);

          if (dx < 0) facingLeftRef.current = true;
          else if (dx > 0) facingLeftRef.current = false;

          playerPosRef.current = next;
          isWalkingRef.current = true;
          walkCycleRef.current += Math.PI * 2 * 3.4 * dt;
        }
      } else {
        isWalkingRef.current = false;
      }

      // 3. Canvas Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Marker
        const marker = destinationMarkerRef.current;
        if (marker && marker.active) {
          const elapsed = (time - marker.createdAt) / 1000;
          if (elapsed < 2.0) {
            const alpha = Math.max(0, 1 - elapsed / 2.0);
            ctx.save();
            ctx.translate(marker.x, marker.y);
            ctx.beginPath();
            ctx.ellipse(0, 0, 16, 8, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
          } else {
            marker.active = false;
          }
        }

        // Draw Player Character
        const p = playerPosRef.current;
        drawCompleteVillager(ctx, {
          cx: p.x,
          cy: p.y,
          scale: 1.7,
          outfit: currentOutfit,
          look: villagerLook,
          facingLeft: facingLeftRef.current,
          isMoving: isWalkingRef.current,
          walkCycle: walkCycleRef.current
        });
      }

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [currentOutfit, onClose, villagerLook]);

  // Actions
  const handleWaterAll = () => {
    sounds.playTap();
    setGardenData(prev => {
      const updatedPlots = { ...prev.plots };
      Object.keys(updatedPlots).forEach(k => {
        if (updatedPlots[k].crop && updatedPlots[k].stage < 3) {
          updatedPlots[k] = {
            ...updatedPlots[k],
            stage: updatedPlots[k].stage + 1,
            readyToHarvest: updatedPlots[k].stage + 1 >= 3
          };
        }
      });
      return {
        ...prev,
        waterCanLevel: Math.max(0, prev.waterCanLevel - 20),
        plots: updatedPlots
      };
    });
    showToast('השקית את כל הערוגות במים חיים! 🌱💧');
    if (onEarnSeeds) onEarnSeeds(5);
  };

  const handleHarvestCrop = (plotId) => {
    sounds.playTap();
    confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    setGardenData(prev => ({
      ...prev,
      totalHarvests: prev.totalHarvests + 1,
      plots: {
        ...prev.plots,
        [plotId]: {
          ...prev.plots[plotId],
          crop: null,
          memory: '',
          stage: 0,
          readyToHarvest: false
        }
      }
    }));
    setActivePlot(null);
    showToast('קצרת את היבול בהצלחה! הערוגה פונתה לזריעה הבאה 🌾✨');
    if (onEarnSeeds) onEarnSeeds(15);
  };

  const handlePlantSeed = (plotId, seed) => {
    sounds.playTap();
    setGardenData(prev => ({
      ...prev,
      plots: {
        ...prev.plots,
        [plotId]: {
          ...prev.plots[plotId],
          crop: seed.name,
          memory: seed.note || 'זיכרון אסוציאטיבי בערוגה',
          stage: 1,
          readyToHarvest: false
        }
      },
      sproutingTray: prev.sproutingTray.filter(s => s.id !== seed.id)
    }));
    setActivePlot(null);
    showToast(`שתלת את ה-${seed.name} בערוגה! 🌱`);
  };

  const handleCreateSprout = (e) => {
    e.preventDefault();
    if (!newSeedName.trim()) return;
    sounds.playTap();
    const newSprout = {
      id: `sprout_${Date.now()}`,
      name: newSeedName.trim(),
      note: newSeedMemory.trim(),
      type: newSeedType,
      stage: 1
    };
    setGardenData(prev => ({
      ...prev,
      sproutingTray: [...prev.sproutingTray, newSprout]
    }));
    setNewSeedName('');
    setNewSeedMemory('');
    setIsSproutingModalOpen(false);
    showToast('הנבטת זרע חדש במשתלת הבוטניקה! 🌱✨');
  };

  return (
    <div className="stardew-complex-overlay" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#060806',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Viewport Stage */}
      <div style={{
        position: 'relative',
        width: `${GARDEN_W}px`,
        height: `${GARDEN_H}px`,
        maxWidth: '96vw',
        maxHeight: '94vh',
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Architectural Layer */}
        <GardenArchitectureSVG />

        {/* Interactive Overlay Points */}
        {/* 1. Sprouting Nursery Bench (West Wing) */}
        <div 
          onClick={() => { sounds.playTap(); setIsSproutingModalOpen(true); }}
          style={{
            position: 'absolute',
            left: '160px',
            top: '250px',
            width: '180px',
            height: '60px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '6px',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1.5px dashed rgba(74, 222, 128, 0.5)',
            color: '#bbf7d0',
            fontWeight: 'bold',
            fontSize: '0.85rem'
          }}
          title="שולחן הנבטה ומעבדת זרעים"
        >
          <Sprout size={18} className="animate-bounce" />
          <span>משתלת הנבטה ({gardenData.sproutingTray.length})</span>
        </div>

        {/* 2. Interactive Raised Plots */}
        {/* Root Plots (North) */}
        {[
          { id: 'root_1', x: 375, y: 135 },
          { id: 'root_2', x: 510, y: 135 },
          { id: 'root_3', x: 645, y: 135 }
        ].map(p => {
          const plot = gardenData.plots[p.id];
          return (
            <div
              key={p.id}
              onClick={() => { sounds.playTap(); setActivePlot(plot); }}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: '80px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              title={plot.name}
            >
              {plot.crop ? (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.3rem' }}>
                    {plot.stage === 1 ? '🌱' : plot.stage === 2 ? '🌿' : '🥕'}
                  </span>
                  {plot.readyToHarvest && (
                    <span style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      background: '#15803d',
                      color: '#fef08a',
                      padding: '1px 4px',
                      borderRadius: '4px',
                      fontWeight: 'bold'
                    }}>לקצור!</span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#a16207', fontWeight: 'bold' }}>+ פנוי</span>
              )}
            </div>
          );
        })}

        {/* Herb Plots (East) */}
        {[
          { id: 'herb_1', x: 770, y: 250 },
          { id: 'herb_2', x: 835, y: 250 },
          { id: 'herb_3', x: 900, y: 250 }
        ].map(p => {
          const plot = gardenData.plots[p.id];
          return (
            <div
              key={p.id}
              onClick={() => { sounds.playTap(); setActivePlot(plot); }}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: '50px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }}
              title={plot.name}
            >
              {plot.crop ? (
                <div style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: '1.3rem' }}>
                    {plot.stage === 1 ? '🌱' : plot.stage === 2 ? '🌿' : '🍃'}
                  </span>
                  {plot.readyToHarvest && (
                    <span style={{
                      display: 'block',
                      fontSize: '0.65rem',
                      background: '#15803d',
                      color: '#fef08a',
                      padding: '1px 3px',
                      borderRadius: '4px'
                    }}>קצור</span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 'bold' }}>+ שתול</span>
              )}
            </div>
          );
        })}

        {/* Flower Plots (South) */}
        {[
          { id: 'flower_1', x: 420, y: 460 },
          { id: 'flower_2', x: 610, y: 460 }
        ].map(p => {
          const plot = gardenData.plots[p.id];
          return (
            <div
              key={p.id}
              onClick={() => { sounds.playTap(); setActivePlot(plot); }}
              style={{
                position: 'absolute',
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: '100px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                zIndex: 10
              }}
              title={plot.name}
            >
              {plot.crop ? (
                <>
                  <span style={{ fontSize: '1.4rem' }}>
                    {plot.stage === 1 ? '🌱' : plot.stage === 2 ? '🌿' : '🌻'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 'bold' }}>{plot.crop}</span>
                </>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 'bold' }}>+ ערוגת פרחים</span>
              )}
            </div>
          );
        })}

        {/* 3. Central Fountain Water Action */}
        <div 
          onClick={handleWaterAll}
          style={{
            position: 'absolute',
            left: '510px',
            top: '290px',
            width: '80px',
            height: '45px',
            cursor: 'pointer',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            color: '#cffafe',
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }}
          title="השקה את כל הערוגות במים חיים"
        >
          <Droplets size={22} className="text-cyan-300 animate-pulse" />
          <span>השקיה 💧</span>
        </div>

        {/* Physics Canvas */}
        <canvas 
          ref={canvasRef}
          width={GARDEN_W}
          height={GARDEN_H}
          onClick={handleCanvasClick}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            cursor: 'crosshair',
            zIndex: 20
          }}
        />

        {/* HUD Top Bar */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          right: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 30,
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'rgba(15, 23, 15, 0.85)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '10px',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#bbf7d0',
            fontWeight: 'bold',
            pointerEvents: 'auto'
          }}>
            <Sprout className="text-green-400" size={20} />
            <span>חממת הבוטניקה וגן הערוגות</span>
            <span style={{ fontSize: '0.8rem', color: '#86efac' }}>| יבולים שנקצרו: {gardenData.totalHarvests}</span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.25)',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              pointerEvents: 'auto'
            }}
          >
            ✕ יציאה לכפר
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(20, 40, 20, 0.95)',
            border: '1px solid #4ade80',
            color: '#f0fdf4',
            padding: '8px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '0.95rem',
            zIndex: 40,
            boxShadow: '0 8px 20px rgba(0,0,0,0.6)'
          }}>
            {toastMessage}
          </div>
        )}

        {/* MODAL 1: Sprouting Table & Germination Lab */}
        {isSproutingModalOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }} onClick={() => setIsSproutingModalOpen(false)}>
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                width: '460px',
                background: '#131e13',
                border: '2px solid #22c55e',
                borderRadius: '12px',
                padding: '20px',
                color: '#f0fdf4'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sprout className="text-green-400" />
                  משתלת הנבטת זרעים ומחשבות
                </h3>
                <button onClick={() => setIsSproutingModalOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>✕</button>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#86efac', marginBottom: '14px' }}>
                כאן מנביטים רעיונות אסוציאטיביים, משימות יומיות ותובנות חולפות. כשהזרע ינבט, ניתן לשתול אותו בערוגה!
              </p>

              <form onSubmit={handleCreateSprout} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input 
                  type="text"
                  placeholder="שם הצמח / הרעיון (למשל: נבט תזכורת שיחה)..."
                  value={newSeedName}
                  onChange={e => setNewSeedName(e.target.value)}
                  style={{
                    background: '#091009',
                    border: '1px solid #16a34a',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: '#fff',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <textarea 
                  placeholder="הזיכרון האסוציאטיבי / הפתק החולף..."
                  value={newSeedMemory}
                  onChange={e => setNewSeedMemory(e.target.value)}
                  rows={3}
                  style={{
                    background: '#091009',
                    border: '1px solid #16a34a',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    color: '#fff',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', margin: '4px 0' }}>
                  {[
                    { id: 'root', label: 'ירק שורש (משימה ארצית)', icon: '🥕' },
                    { id: 'herb', label: 'צמח מרפא (רוגע והרגל)', icon: '🌿' },
                    { id: 'flower', label: 'פרח בר (הברקה)', icon: '🌸' }
                  ].map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setNewSeedType(t.id)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: newSeedType === t.id ? '#15803d' : '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(to right, #16a34a, #15803d)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '6px'
                  }}
                >
                  הנבט זרע בצלחת הפטרי 🌱
                </button>
              </form>

              {/* Ready Sprouting Tray */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '0.9rem', color: '#bbf7d0', marginBottom: '8px' }}>נבטים מוכנים לשתילה בערוגות:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                  {gardenData.sproutingTray.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', padding: '10px' }}>אין כרגע נבטים במגש.</div>
                  ) : (
                    gardenData.sproutingTray.map(sprout => (
                      <div key={sprout.id} style={{
                        background: '#0a120a',
                        border: '1px solid #14532d',
                        borderRadius: '6px',
                        padding: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: 'bold', color: '#86efac' }}>{sprout.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{sprout.note}</div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#fef08a' }}>לחץ על ערוגה לשתילה 👈</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: Active Plot Inspector */}
        {activePlot && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }} onClick={() => setActivePlot(null)}>
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                width: '420px',
                background: '#131e13',
                border: '2px solid #eab308',
                borderRadius: '12px',
                padding: '20px',
                color: '#f0fdf4'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0 }}>{activePlot.name}</h3>
                <button onClick={() => setActivePlot(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>✕</button>
              </div>

              {activePlot.crop ? (
                <div>
                  <div style={{
                    background: '#0a120a',
                    padding: '14px',
                    borderRadius: '8px',
                    border: '1px solid #166534',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#86efac', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{activePlot.stage === 3 ? '🥕' : '🌿'}</span>
                      {activePlot.crop} (שלב צמיחה {activePlot.stage}/3)
                    </div>
                    <p style={{ marginTop: '8px', color: '#e2e8f0', fontSize: '0.9rem' }}>
                      "{activePlot.memory}"
                    </p>
                  </div>

                  {activePlot.readyToHarvest ? (
                    <button
                      onClick={() => handleHarvestCrop(activePlot.id)}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(to right, #eab308, #ca8a04)',
                        color: '#422006',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer'
                      }}
                    >
                      🌾 קצור יבול ופנה ערוגה לזריעה הבאה! (+15 זרעים)
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', color: '#86efac', fontSize: '0.85rem' }}>
                      הצמח עודנו גדל! השקה במים חיים כדי להבשיל אותו.
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <p style={{ color: '#86efac', fontSize: '0.9rem', marginBottom: '12px' }}>
                    הערוגה הזו פנויה לזריעה! בחר נבט ממשתלת ההנבטה:
                  </p>
                  {gardenData.sproutingTray.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '16px' }}>
                      <p style={{ color: '#9ca3af', fontSize: '0.85rem' }}>אין נבטים מוכנים.</p>
                      <button
                        onClick={() => { setActivePlot(null); setIsSproutingModalOpen(true); }}
                        style={{
                          background: '#15803d',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        עבור למשתלה להנבטת זרע 🌱
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {gardenData.sproutingTray.map(seed => (
                        <div 
                          key={seed.id}
                          onClick={() => handlePlantSeed(activePlot.id, seed)}
                          style={{
                            background: '#0a120a',
                            border: '1px solid #16a34a',
                            padding: '10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 'bold', color: '#86efac' }}>🌱 {seed.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{seed.note}</div>
                          </div>
                          <span style={{ fontSize: '0.8rem', color: '#fef08a' }}>שתול עכשיו 👈</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
