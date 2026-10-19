import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Sparkles, 
  Wheat, 
  Check, 
  Plus, 
  X, 
  Trash2, 
  Sun, 
  Smile, 
  Award,
  Milk,
  Feather,
  Apple,
  Scale
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { drawCompleteVillager } from '../utils/villagerRenderer';
import { FarmArchitectureSVG, FARM_W, FARM_H } from './stardewArt/FarmArchitecture';
import { 
  resolveFarmMove, 
  snapToFarmWalkable, 
  isFarmWalkable 
} from '../utils/farmNavigation';
import { drawVectorAnimal } from '../utils/farmAnimalRenderer';

export function StardewFarmComplex({
  building,
  catalogItem,
  onClose,
  villagerLook = {},
  currentOutfit = 'autumn_sweater',
  onEarnSeeds
}) {
  const storageKey = `lifequest_farm_complex_data_v3_${building?.gx || 0}_${building?.gy || 0}`;

  // Asymmetric Animal Coordinates & Mnemonic Data (Built under Cognitive Memory Specialist)
  const DEFAULT_ANIMALS = {
    cow: {
      id: 'cow',
      name: 'בסי (פרת השפע)',
      homeTitle: 'רפת הדשא הירוק וכדי החלב',
      x: 280,
      y: 210,
      happiness: 95,
      readyToHarvest: true,
      produceType: 'כד חלב כפרי טרי 🥛',
      projectGoal: 'פרויקט צמיחה אישית ויציבות כלכלית',
      lastFed: Date.now()
    },
    sheep: {
      id: 'sheep',
      name: 'צמרונת (הכבשה הרכה)',
      homeTitle: 'דיר התלתן וסלי הצמר',
      x: 420,
      y: 430,
      happiness: 90,
      readyToHarvest: true,
      produceType: 'גליל צמר מסולסל חם 🧶',
      projectGoal: 'טיפוח סביבה רגועה ויצירתית בבית',
      lastFed: Date.now()
    },
    pig: {
      id: 'pig',
      name: 'טראפלס (חזרזיר הבוץ)',
      homeTitle: 'בריכת הבוץ וערימת התפוחים האדומים',
      x: 230,
      y: 650,
      happiness: 92,
      readyToHarvest: true,
      produceType: 'תפוח קריספי ופטריית כמהין 🍎🍄',
      projectGoal: 'התמדה בארוחות מזינות והנאה מהחיים',
      lastFed: Date.now()
    },
    horse: {
      id: 'horse',
      name: 'ברק (סוס המומנטום)',
      homeTitle: 'אורוות האדמה וערימת הגזרים',
      x: 1060,
      y: 190,
      happiness: 100,
      readyToHarvest: true,
      produceType: 'פרסת מזל מבריקה 🧲',
      projectGoal: 'שבירת שיא אישי בריצה וכושר',
      lastFed: Date.now()
    },
    poultry: {
      id: 'poultry',
      name: 'קלאקי והאפרוחים',
      homeTitle: 'לול הקש הזהוב וקני ההטלה',
      x: 920,
      y: 435,
      happiness: 88,
      readyToHarvest: true,
      produceType: 'ביצת זהב של בוקר 🥚✨',
      projectGoal: 'שגרת קימה מוקדמת וקריאת ספר',
      lastFed: Date.now()
    },
    duck: {
      id: 'duck',
      name: 'דאקי והאווזים',
      homeTitle: 'בריכת המים הצלולה והנופרים',
      x: 1090,
      y: 660,
      happiness: 94,
      readyToHarvest: true,
      produceType: 'נוצת אגם מנצנצת 🪶',
      projectGoal: 'תרגול מדיטציה ונשימה על שפת המים',
      lastFed: Date.now()
    }
  };

  // Distinct Species-Tailored Harvest Badges (Breaking Visual Monotony)
  const HARVEST_BADGES = {
    cow: { text: 'לחלוב 🥛', bg: 'rgba(56, 189, 248, 0.95)', border: '#bae6fd', color: '#0c4a6e', yOff: -44 },
    sheep: { text: 'לגזוז 🧶', bg: 'rgba(192, 132, 252, 0.95)', border: '#f3e8ff', color: '#581c87', yOff: -38 },
    pig: { text: 'לאסוף 🍎', bg: 'rgba(239, 68, 68, 0.95)', border: '#fee2e2', color: '#7f1d1d', yOff: -34 },
    horse: { text: 'להבריש 🧲', bg: 'rgba(245, 158, 11, 0.95)', border: '#fef3c7', color: '#78350f', yOff: -48 },
    poultry: { text: 'ללקט 🥚', bg: 'rgba(250, 204, 21, 0.95)', border: '#fef9c3', color: '#713f12', yOff: -36 },
    duck: { text: 'לאסוף 🪶', bg: 'rgba(20, 184, 166, 0.95)', border: '#ccfbf1', color: '#134e4a', yOff: -36 }
  };

  // Method of Loci: 6 Gateway Transition Anchors on Promenade Curbs
  const GATEWAY_WAYPOINTS = [
    {
      id: 'cow_urn',
      name: 'כד חלב ופרחי בר',
      hint: 'עוגן מעבר #5: כד חלב עמוס פרחי בר 🏺🌸 • שער כניסה לרפת הפרות (בסי)',
      x: 520, y: 145, w: 38, h: 46
    },
    {
      id: 'horse_horseshoe',
      name: 'פרסת זהב מקושתת',
      hint: 'עוגן מעבר #6: פרסת זהב מעל השער 🧲✨ • שער כניסה לאורוות הסוסים (ברק)',
      x: 805, y: 145, w: 38, h: 46
    },
    {
      id: 'sheep_pitchfork',
      name: 'קלשון פלדה',
      hint: 'עוגן מעבר #3: קלשון איכרים מפלדה 🌾 • שער כניסה לדיר הכבשים (צמרונת)',
      x: 520, y: 360, w: 36, h: 56
    },
    {
      id: 'poultry_scale',
      name: 'מאזני פליז ושולחן שקילה',
      hint: 'עוגן מעבר #4: מאזני תבואה ושולחן שקילה ⚖️ • שער כניסה ללול התרנגולות (קלאקי)',
      x: 805, y: 375, w: 46, h: 44
    },
    {
      id: 'pig_lantern',
      name: 'עששית בוערת על חבית אלון',
      hint: 'עוגן מעבר #1: עששית דולקת על חבית 🏮 • שער כניסה לדיר החזיר (טראפלס)',
      x: 518, y: 595, w: 40, h: 50
    },
    {
      id: 'duck_bell',
      name: 'פעמון ספינה מפליז',
      hint: 'עוגן מעבר #2: פעמון ספינה מפליז 🔔 • שער כניסה לבריכת הברווזים (דאקי)',
      x: 806, y: 600, w: 36, h: 48
    }
  ];

  // Persistent Farm State with Automatic Symmetrical-to-Asymmetric Migration
  const [farmData, setFarmData] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.animals) {
          // Detect and migrate any stale symmetrical coordinates (x: 300 or x: 1020)
          for (const key of Object.keys(DEFAULT_ANIMALS)) {
            if (!parsed.animals[key]) {
              parsed.animals[key] = { ...DEFAULT_ANIMALS[key] };
            } else if (parsed.animals[key].x === 300 || parsed.animals[key].x === 1020) {
              parsed.animals[key].x = DEFAULT_ANIMALS[key].x;
              parsed.animals[key].y = DEFAULT_ANIMALS[key].y;
            }
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return {
      granaryProduce: {
        milkBottles: 4,
        woolSpools: 3,
        crispApples: 6,
        luckyHorseshoes: 2,
        goldenEggs: 7,
        duckFeathers: 3
      },
      animals: DEFAULT_ANIMALS
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(farmData));
    } catch (e) {
      console.error(e);
    }
  }, [farmData, storageKey]);

  // Modal & Inspector States
  const [activeAnimal, setActiveAnimal] = useState(null);
  const [isGranaryOpen, setIsGranaryOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState('');
  const [nearbyAnimalId, setNearbyAnimalId] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Avatar Physics & Navigation
  const canvasRef = useRef(null);
  const playerPosRef = useRef({ x: 680, y: 700 }); // Starts on the central promenade near entrance stoop
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
      if (e.code === 'KeyE') {
        if (nearbyAnimalId && farmData.animals[nearbyAnimalId]) {
          const a = farmData.animals[nearbyAnimalId];
          sounds.playTap();
          setActiveAnimal(a);
          setEditingGoal(a.projectGoal);
        }
      }
      if (e.code === 'Escape') {
        if (activeAnimal) setActiveAnimal(null);
        else if (isGranaryOpen) setIsGranaryOpen(false);
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
  }, [activeAnimal, isGranaryOpen, nearbyAnimalId, farmData.animals, onClose]);

  // Click-to-move Canvas
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = FARM_W / rect.width;
    const scaleY = FARM_H / rect.height;
    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;

    // Check if clicked directly on an animal
    for (const [id, a] of Object.entries(farmData.animals)) {
      if (Math.hypot(rawX - a.x, rawY - a.y) < 55) {
        sounds.playTap();
        setActiveAnimal(a);
        setEditingGoal(a.projectGoal);
        return;
      }
    }

    const snapped = snapToFarmWalkable(rawX, rawY);
    playerTargetRef.current = snapped;
    destinationMarkerRef.current = {
      active: true,
      x: snapped.x,
      y: snapped.y,
      createdAt: performance.now()
    };
  };

  // Main 60fps Animation Loop with Canvas Vector Animals & Dust Motes
  useEffect(() => {
    let isCancelled = false;
    let lastTime = performance.now();
    let animClock = 0;

    // Ambient Dust Motes in the Loft Sunlight Shaft
    const dustMotes = Array.from({ length: 24 }, () => ({
      x: 600 + Math.random() * 160,
      y: 80 + Math.random() * 260,
      speedY: 0.15 + Math.random() * 0.25,
      swayOffset: Math.random() * Math.PI * 2,
      size: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.4
    }));

    const loop = (time) => {
      if (isCancelled) return;
      const rawDt = (time - lastTime) / 1000;
      lastTime = time;
      const dt = Math.min(0.04, Math.max(0.001, rawDt));
      animClock += dt;

      const curPos = playerPosRef.current;
      const heldKeys = heldKeysRef.current;
      const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);
      const walkSpeed = 240;

      // 1. Keyboard Navigation
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
          const next = resolveFarmMove(curPos, vx, vy);

          if (kdx < 0) facingLeftRef.current = true;
          else if (kdx > 0) facingLeftRef.current = false;

          playerPosRef.current = next;
          isWalkingRef.current = true;
          walkCycleRef.current += Math.PI * 2 * 3.4 * dt;

          // Village Exit Check (South Stoop)
          if (next.x >= 610 && next.x <= 750 && next.y >= 745) {
            showToast('יציאה לחצר הכפר 🍃');
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
          if (target.x >= 610 && target.x <= 750 && target.y >= 745) {
            showToast('יציאה לחצר הכפר 🍃');
            setTimeout(() => onClose(), 180);
          }
        } else {
          const stepDist = Math.min(dist, walkSpeed * dt);
          const vx = (dx / dist) * stepDist;
          const vy = (dy / dist) * stepDist;
          const next = resolveFarmMove(curPos, vx, vy);

          if (dx < 0) facingLeftRef.current = true;
          else if (dx > 0) facingLeftRef.current = false;

          playerPosRef.current = next;
          isWalkingRef.current = true;
          walkCycleRef.current += Math.PI * 2 * 3.4 * dt;
        }
      } else {
        isWalkingRef.current = false;
      }

      // Check Proximity to Animals
      let closest = null;
      let minD = 120;
      for (const [id, a] of Object.entries(farmData.animals)) {
        const d = Math.hypot(curPos.x - a.x, curPos.y - a.y);
        if (d < minD) {
          minD = d;
          closest = id;
        }
      }
      if (closest !== nearbyAnimalId) {
        setNearbyAnimalId(closest);
      }

      // 3. Canvas Render
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // A. Draw 6 Vector Canvas Animals (Pure Vector pixel-art, NO EMOJI!)
        for (const [id, a] of Object.entries(farmData.animals)) {
          const isFacingLeft = 
            id === 'sheep' ? true :
            id === 'pig' ? false :
            id === 'cow' ? false :
            id === 'horse' ? false :
            id === 'poultry' ? true :
            id === 'duck' ? true : false;

          drawVectorAnimal(ctx, id, {
            x: a.x,
            y: a.y,
            facingLeft: isFacingLeft,
            happiness: a.happiness,
            animTime: animClock
          });

          // Floating Bouncing Species-Tailored Harvest Badge (Breaking Visual Monotony)
          if (a.readyToHarvest) {
            const badge = HARVEST_BADGES[id] || { text: 'לקצור ✨', bg: 'rgba(234, 179, 8, 0.95)', border: '#fef08a', color: '#422006', yOff: -38 };
            const bob = Math.sin(animClock * 3 + a.x) * 4;
            ctx.save();
            ctx.translate(a.x, a.y + badge.yOff + bob);

            // Subtle drop shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
            ctx.shadowBlur = 6;
            ctx.shadowOffsetY = 3;

            // Species specific glowing pill background
            ctx.fillStyle = badge.bg;
            ctx.strokeStyle = badge.border;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.roundRect(-30, -11, 60, 22, 11);
            ctx.fill();
            ctx.stroke();

            // Crisp typography without shadow
            ctx.shadowColor = 'transparent';
            ctx.fillStyle = badge.color;
            ctx.font = 'bold 11px "Rubik", "Segoe UI", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(badge.text, 0, 1);
            ctx.restore();
          }
        }

        // B. Destination Marker
        const marker = destinationMarkerRef.current;
        if (marker && marker.active) {
          const elapsed = (time - marker.createdAt) / 1000;
          if (elapsed < 2.0) {
            const alpha = Math.max(0, 1 - elapsed / 2.0);
            ctx.save();
            ctx.translate(marker.x, marker.y);
            ctx.beginPath();
            ctx.ellipse(0, 0, 18, 9, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(234, 179, 8, ${alpha})`;
            ctx.lineWidth = 2.2;
            ctx.stroke();
            ctx.restore();
          } else {
            marker.active = false;
          }
        }

        // C. Draw Player Character
        const p = playerPosRef.current;
        drawCompleteVillager(ctx, {
          cx: p.x,
          cy: p.y,
          scale: 1.78,
          outfit: currentOutfit,
          look: villagerLook,
          facingLeft: facingLeftRef.current,
          isMoving: isWalkingRef.current,
          walkCycle: walkCycleRef.current
        });

        // D. Ambient Floating Dust Motes in Sunbeam
        ctx.save();
        for (const m of dustMotes) {
          m.y -= m.speedY;
          if (m.y < 70) m.y = 320;
          const swayX = Math.sin(animClock * 1.5 + m.swayOffset) * 8;
          ctx.beginPath();
          ctx.arc(m.x + swayX, m.y, m.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(254, 240, 138, ${m.alpha})`;
          ctx.fill();
        }
        ctx.restore();
      }

      requestAnimationFrame(loop);
    };

    const animId = requestAnimationFrame(loop);
    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
    };
  }, [currentOutfit, onClose, villagerLook, farmData.animals, nearbyAnimalId]);

  // Animal Interaction Handlers
  const handlePetAnimal = (animalId) => {
    sounds.playTap();
    setFarmData(prev => ({
      ...prev,
      animals: {
        ...prev.animals,
        [animalId]: {
          ...prev.animals[animalId],
          happiness: Math.min(100, prev.animals[animalId].happiness + 10)
        }
      }
    }));
    showToast(`ליטפת את ${farmData.animals[animalId].name}! לבבות חמים עולים באוויר ❤️✨`);
  };

  const handleFeedAnimal = (animalId) => {
    sounds.playTap();
    setFarmData(prev => ({
      ...prev,
      animals: {
        ...prev.animals,
        [animalId]: {
          ...prev.animals[animalId],
          happiness: 100,
          readyToHarvest: true,
          lastFed: Date.now()
        }
      }
    }));
    showToast(`האכלת את ${farmData.animals[animalId].name}! שביעות רצון מלאה 🌾✨`);
  };

  const handleCollectProduce = (animalId) => {
    sounds.playTap();
    confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
    const animal = farmData.animals[animalId];
    
    setFarmData(prev => {
      const g = { ...prev.granaryProduce };
      if (animalId === 'cow') g.milkBottles += 1;
      else if (animalId === 'sheep') g.woolSpools += 1;
      else if (animalId === 'pig') g.crispApples += 1;
      else if (animalId === 'horse') g.luckyHorseshoes += 1;
      else if (animalId === 'poultry') g.goldenEggs += 1;
      else if (animalId === 'duck') g.duckFeathers += 1;

      return {
        ...prev,
        granaryProduce: g,
        animals: {
          ...prev.animals,
          [animalId]: {
            ...prev.animals[animalId],
            readyToHarvest: false
          }
        }
      };
    });

    showToast(`אספת בהצלחה: ${animal.produceType}! התוצרת נשמרה באסם 🌾✨`);
    if (onEarnSeeds) onEarnSeeds(20);
    setActiveAnimal(null);
  };

  const handleSaveGoal = (animalId) => {
    sounds.playTap();
    setFarmData(prev => ({
      ...prev,
      animals: {
        ...prev.animals,
        [animalId]: {
          ...prev.animals[animalId],
          projectGoal: editingGoal.trim() || prev.animals[animalId].projectGoal
        }
      }
    }));
    showToast('היעד עודכן ונשמר עבור התא! 🎯');
    setActiveAnimal(null);
  };

  return (
    <div className="stardew-complex-overlay" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#050302',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none'
    }}>
      {/* Viewport Stage (Expanded 1360 x 820 Full-Screen Canvas) */}
      <div style={{
        position: 'relative',
        width: `${FARM_W}px`,
        height: `${FARM_H}px`,
        maxWidth: '98vw',
        maxHeight: '97vh',
        boxShadow: '0 25px 65px -15px rgba(0, 0, 0, 0.95)',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Architectural Layer */}
        <FarmArchitectureSVG />

        {/* PROXIMITY PARCHMENT NAME TAG (Appears gracefully when avatar is near an animal) */}
        {nearbyAnimalId && farmData.animals[nearbyAnimalId] && (
          <div style={{
            position: 'absolute',
            left: `${farmData.animals[nearbyAnimalId].x - 90}px`,
            top: `${farmData.animals[nearbyAnimalId].y - 85}px`,
            width: '180px',
            background: 'linear-gradient(to bottom, #fef3c7, #fde68a)',
            border: '2px solid #b45309',
            borderRadius: '8px',
            padding: '4px 8px',
            textAlign: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            zIndex: 25,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{ fontWeight: 'bold', color: '#78350f', fontSize: '0.85rem' }}>
              {farmData.animals[nearbyAnimalId].name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#92400e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {farmData.animals[nearbyAnimalId].projectGoal}
            </div>
            <div style={{ fontSize: '0.65rem', color: '#b45309', marginTop: '2px', fontWeight: 'bold' }}>
              לחץ [E] או הקש לאינטראקציה 👈
            </div>
          </div>
        )}

        {/* METHOD OF LOCI: 6 INTERACTIVE GATEWAY TRANSITION ANCHORS */}
        {GATEWAY_WAYPOINTS.map(wp => (
          <div
            key={wp.id}
            onClick={() => {
              sounds.playTap();
              showToast(wp.hint);
            }}
            style={{
              position: 'absolute',
              left: `${wp.x}px`,
              top: `${wp.y}px`,
              width: `${wp.w}px`,
              height: `${wp.h}px`,
              cursor: 'pointer',
              zIndex: 22,
              borderRadius: '6px'
            }}
            title={wp.hint}
          />
        ))}

        {/* NORTH GRANARY CLIMAX SHRINE (פסגת מסלול ארמון הזיכרון) */}
        <div
          onClick={() => { 
            sounds.playLevelUp?.() || sounds.playTap(); 
            setIsGranaryOpen(true); 
          }}
          style={{
            position: 'absolute',
            left: '585px',
            top: '46px',
            width: '190px',
            height: '42px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            background: 'linear-gradient(180deg, rgba(180, 83, 9, 0.92) 0%, rgba(120, 53, 15, 0.98) 100%)',
            border: '2px solid #facc15',
            borderRadius: '12px',
            boxShadow: '0 0 22px rgba(245, 158, 11, 0.65), inset 0 1px 0 rgba(254, 240, 138, 0.5)',
            color: '#fef3c7',
            fontWeight: 'bold',
            fontSize: '0.92rem',
            zIndex: 25,
            transition: 'transform 0.15s ease, box-shadow 0.15s ease'
          }}
          title="פסגת ארמון הזיכרון: מקדש שפע האסם המרכזי"
        >
          <Sparkles size={16} className="text-yellow-300" />
          <span>אסם התוצרת המלכותי 🌾</span>
        </div>

        {/* Physics & Vector Canvas Layer */}
        <canvas 
          ref={canvasRef}
          width={FARM_W}
          height={FARM_H}
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

        {/* HUD Top Bar (Slim Wood & Brass Plank) */}
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
            background: 'rgba(28, 15, 7, 0.94)',
            border: '1.5px solid rgba(245, 158, 11, 0.45)',
            borderRadius: '12px',
            padding: '8px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            color: '#fef3c7',
            fontWeight: 'bold',
            pointerEvents: 'auto',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
          }}>
            <Wheat className="text-amber-400" size={22} />
            <span style={{ fontSize: '1.1rem' }}>חוות ששת המשקים והאסם המרכזי</span>
            <span style={{ fontSize: '0.85rem', color: '#fde68a' }}>
              🥛 {farmData.granaryProduce.milkBottles} | 🧶 {farmData.granaryProduce.woolSpools} | 🍎 {farmData.granaryProduce.crispApples} | 🧲 {farmData.granaryProduce.luckyHorseshoes} | 🥚 {farmData.granaryProduce.goldenEggs} | 🪶 {farmData.granaryProduce.duckFeathers}
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.28)',
              border: '1.5px solid rgba(239, 68, 68, 0.5)',
              color: '#fca5a5',
              padding: '8px 18px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              pointerEvents: 'auto',
              fontSize: '0.95rem'
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
            background: 'rgba(40, 20, 10, 0.96)',
            border: '1.5px solid #f59e0b',
            color: '#fffbeb',
            padding: '10px 24px',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '1rem',
            zIndex: 40,
            boxShadow: '0 10px 25px rgba(0,0,0,0.7)'
          }}>
            {toastMessage}
          </div>
        )}

        {/* MODAL 1: Animal Home & Project Inspector */}
        {activeAnimal && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }} onClick={() => setActiveAnimal(null)}>
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                width: '460px',
                background: '#1e1107',
                border: '2px solid #d97706',
                borderRadius: '14px',
                padding: '24px',
                color: '#fffbeb',
                boxShadow: '0 20px 40px rgba(0,0,0,0.85)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#fef08a' }}>{activeAnimal.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#fde68a' }}>{activeAnimal.homeTitle}</div>
                </div>
                <button onClick={() => setActiveAnimal(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              {/* Happiness meter */}
              <div style={{ marginBottom: '14px', background: '#120803', padding: '12px', borderRadius: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                  <span>מדד רווחה ושמחת חיים:</span>
                  <span style={{ color: '#facc15', fontWeight: 'bold' }}>{activeAnimal.happiness}% ❤️</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#3b2211', borderRadius: '5px', overflow: 'hidden' }}>
                  <div style={{ width: `${activeAnimal.happiness}%`, height: '100%', background: 'linear-gradient(to right, #eab308, #22c55e)' }} />
                </div>
              </div>

              {/* Connected Goal / Working Memory */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '0.9rem', color: '#fde68a', display: 'block', marginBottom: '6px' }}>
                  🎯 פרויקט / יעד תהליכי המקושר לתא זה:
                </label>
                <input 
                  type="text"
                  value={editingGoal}
                  onChange={e => setEditingGoal(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#120803',
                    border: '1.5px solid #78350f',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    color: '#fff',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Actions Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <button
                  onClick={() => handlePetAnimal(activeAnimal.id)}
                  style={{
                    padding: '12px',
                    background: '#451a03',
                    border: '1.5px solid #b45309',
                    borderRadius: '8px',
                    color: '#fef08a',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                  }}
                >
                  <Heart size={18} className="text-red-400" />
                  <span>לטף באהבה</span>
                </button>

                <button
                  onClick={() => handleFeedAnimal(activeAnimal.id)}
                  style={{
                    padding: '12px',
                    background: '#451a03',
                    border: '1.5px solid #b45309',
                    borderRadius: '8px',
                    color: '#fef08a',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.95rem'
                  }}
                >
                  <Wheat size={18} className="text-yellow-400" />
                  <span>האכל במזון טרי</span>
                </button>
              </div>

              {/* Collect Produce Button */}
              {activeAnimal.readyToHarvest ? (
                <button
                  onClick={() => handleCollectProduce(activeAnimal.id)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(to right, #d97706, #b45309)',
                    color: '#fff',
                    border: 'none',
                    padding: '14px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    boxShadow: '0 4px 15px rgba(217, 119, 6, 0.4)'
                  }}
                >
                  ✨ אסוף תוצרת: {activeAnimal.produceType} (+20 זרעים)
                </button>
              ) : (
                <div style={{ textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', padding: '8px' }}>
                  התוצרת תהיה מוכנה בקרוב לאחר האכלה וזמן מנוחה.
                </div>
              )}

              <button
                onClick={() => handleSaveGoal(activeAnimal.id)}
                style={{
                  width: '100%',
                  background: '#1c1917',
                  border: '1px solid #44403c',
                  color: '#e7e5e4',
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                שמור יעד וסגור תא
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: Granary Silo & Storage Loft */}
        {isGranaryOpen && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }} onClick={() => setIsGranaryOpen(false)}>
            <div 
              onClick={e => e.stopPropagation()}
              style={{
                width: '500px',
                background: '#1e1107',
                border: '2px solid #ca8a04',
                borderRadius: '14px',
                padding: '24px',
                color: '#fffbeb',
                boxShadow: '0 20px 40px rgba(0,0,0,0.85)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.25rem', color: '#fde68a' }}>
                  <Wheat className="text-amber-400" />
                  ממגורת האסם ומחסן התוצרת הכפרי
                </h3>
                <button onClick={() => setIsGranaryOpen(false)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <p style={{ fontSize: '0.9rem', color: '#fde68a', marginBottom: '16px' }}>
                כל התוצרת שנאספה מששת תאי החיות במשק נאגרת כאן כסמל לפירות העבודה והפרויקטים שהתקדמו:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🥛</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.milkBottles}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>כדי חלב</div>
                </div>

                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🧶</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.woolSpools}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>גלילי צמר</div>
                </div>

                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🍎</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.crispApples}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>תפוחי בוץ</div>
                </div>

                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🧲</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.luckyHorseshoes}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>פרסות מזל</div>
                </div>

                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🥚✨</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.goldenEggs}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ביצי זהב</div>
                </div>

                <div style={{ background: '#120803', padding: '12px 8px', borderRadius: '8px', border: '1px solid #78350f', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem' }}>🪶</div>
                  <div style={{ fontWeight: 'bold', color: '#fef08a', fontSize: '0.95rem' }}>{farmData.granaryProduce.duckFeathers}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>נוצות אגם</div>
                </div>
              </div>

              <button
                onClick={() => setIsGranaryOpen(false)}
                style={{
                  width: '100%',
                  marginTop: '18px',
                  background: '#78350f',
                  color: '#fff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '0.95rem'
                }}
              >
                סגור ממגורה
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
