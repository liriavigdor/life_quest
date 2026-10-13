import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { BUILD_CATALOG, BUILD_CATEGORIES, INITIAL_INTENTIONS, WARM_AFFIRMATIONS } from './data/catalog';
import { OUTFITS, ACTIVITIES, VILLAGER_THOUGHTS, DEFAULT_VILLAGER_LOOK } from './data/wardrobe';
import { WardrobeModal } from './components/WardrobeModal';
import { InspectedMemoryCard } from './components/InspectedMemoryCard';
import { drawCompleteVillager } from './utils/villagerRenderer';
import { sounds } from './utils/sound';
import {
  Sprout,
  Sparkles,
  CheckCircle2,
  Plus,
  X,
  Volume2,
  VolumeX,
  BookHeart,
  Sunset,
  Sun,
  Moon,
  RotateCcw,
  Hammer,
  Trash2,
  Search,
  RefreshCw
} from 'lucide-react';
import { EXPANSION_TIERS, PLOT_CULTIVATION_COST, CULTIVATION_QUOTES } from './data/expansion';
import './App.css';

const STORAGE_KEY_PLACED = 'lifequest_cozy_objects_v3';
const STORAGE_KEY_INTENTIONS = 'lifequest_cozy_intentions_v3';
const STORAGE_KEY_SEEDS = 'lifequest_cozy_seeds_v3';
const STORAGE_KEY_JOURNAL = 'lifequest_cozy_journal_v3';
const STORAGE_KEY_OUTFIT = 'lifequest_cozy_outfit_v3';
const STORAGE_KEY_FRUITS = 'lifequest_cozy_fruits_v3';
const STORAGE_KEY_LOOK = 'lifequest_cozy_look_v3';
const STORAGE_KEY_EXPANSION_TIER = 'lifequest_cozy_expansion_tier_v1';
const STORAGE_KEY_CULTIVATED_TILES = 'lifequest_cozy_cultivated_tiles_v1';
const STORAGE_KEY_INSTITUTION_RESOURCES = 'lifequest_cozy_institution_resources_v1';

// 26x26 Isometric grid for expansive sanctuary village
const GRID_SIZE = 26;
const TILE_W = 68;
const TILE_H = 34;

export default function App() {
  const canvasRef = useRef(null);

  // Growth Seeds (זרעי כוונה וטיפוח)
  const [seeds, setSeeds] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY_SEEDS);
      return s ? parseInt(s, 10) : 60;
    } catch {
      return 60;
    }
  });

  // Fruits Picked and Eaten (פירות שנקטפו ונאכלו מהעץ)
  const [fruitsEaten, setFruitsEaten] = useState(() => {
    try {
      const f = localStorage.getItem(STORAGE_KEY_FRUITS);
      return f ? parseInt(f, 10) : 0;
    } catch {
      return 0;
    }
  });
  const fruitsEatenRef = useRef(fruitsEaten);
  useEffect(() => {
    fruitsEatenRef.current = fruitsEaten;
    localStorage.setItem(STORAGE_KEY_FRUITS, fruitsEaten.toString());
  }, [fruitsEaten]);

  const [intentions, setIntentions] = useState(() => {
    try {
      const i = localStorage.getItem(STORAGE_KEY_INTENTIONS);
      return i ? JSON.parse(i) : INITIAL_INTENTIONS;
    } catch {
      return INITIAL_INTENTIONS;
    }
  });

  const [placedObjects, setPlacedObjects] = useState(() => {
    const starterSanctuary = [
      { gx: 10, gy: 10, type: 'reading_bench', dedicatedTo: 'רגע שקט של בוקר עם כוס קפה', memory: 'רגע שקט של בוקר עם כוס קפה', date: '10/10/2026' },
      { gx: 10, gy: 11, type: 'oak_tree', dedicatedTo: 'ספר שעורר בי השראה', memory: 'ספר שעורר בי השראה', date: '11/10/2026' },
      { gx: 12, gy: 10, type: 'flower_garden', dedicatedTo: 'שנת לילה עמוקה ומנוחה', memory: 'שנת לילה עמוקה ומנוחה', date: '11/10/2026' },
      { gx: 9, gy: 12, type: 'bush', dedicatedTo: 'הליכה נעימה בשקיעה', memory: 'הליכה נעימה בשקיעה', date: '12/10/2026' },
      { gx: 8, gy: 11, type: 'tea_table', dedicatedTo: 'פינת תה כפרית להפוגה חמימה', memory: 'פינת תה כפרית להפוגה חמימה', date: '12/10/2026' },
      { gx: 13, gy: 11, type: 'bonfire', dedicatedTo: 'מדורה של חום וחיבור אמיתי', memory: 'מדורה של חום וחיבור אמיתי', date: '13/10/2026' },
      { gx: 11, gy: 13, type: 'river_tile', dedicatedTo: 'פלג מים לשחרור וזרימה', memory: 'פלג מים לשחרור וזרימה', date: '13/10/2026' },
      { gx: 12, gy: 13, type: 'river_tile', dedicatedTo: 'מים צלולים לשחייה ורעננות', memory: 'מים צלולים לשחייה ורעננות', date: '13/10/2026' }
    ];

    try {
      const obj = localStorage.getItem(STORAGE_KEY_PLACED);
      if (obj) {
        const parsed = JSON.parse(obj);
        if (Array.isArray(parsed)) {
          let list = parsed;
          // If old starter save with only 4 items, enrich with water, tea table and bonfire
          if (list.length <= 4 && !list.some(o => o.type === 'river_tile')) {
            list = [...list, starterSanctuary[4], starterSanctuary[5], starterSanctuary[6], starterSanctuary[7]];
          }
          return list.map((item, idx) => {
            let memory = item.memory || item.dedicatedTo || 'רגע של שלווה והודיה';
            let date = item.date;
            if (!date) {
              const match = memory.match(/\(([^)]+)\)$/);
              if (match) {
                date = match[1];
                memory = memory.replace(/\s*\([^)]+\)$/, '').trim();
              } else {
                date = `${10 + (idx % 4)}/10/2026`;
              }
            }
            return {
              ...item,
              memory,
              dedicatedTo: memory,
              date
            };
          });
        }
        return starterSanctuary;
      }
      return starterSanctuary;
    } catch {
      return starterSanctuary;
    }
  });

  // Wardrobe & Outfits State
  const [currentOutfit, setCurrentOutfit] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_OUTFIT) || 'autumn_sweater';
    } catch {
      return 'autumn_sweater';
    }
  });
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [wardrobeInitialTab, setWardrobeInitialTab] = useState('wardrobe');
  const [showSideCharacterView, setShowSideCharacterView] = useState(true);

  // Villager Custom Appearance (צבע עור, שיער, משקפיים, כובעים, אקססוריז)
  const [villagerLook, setVillagerLook] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOOK);
      return saved ? JSON.parse(saved) : DEFAULT_VILLAGER_LOOK;
    } catch {
      return DEFAULT_VILLAGER_LOOK;
    }
  });
  const villagerLookRef = useRef(villagerLook);
  useEffect(() => {
    villagerLookRef.current = villagerLook;
    localStorage.setItem(STORAGE_KEY_LOOK, JSON.stringify(villagerLook));
  }, [villagerLook]);

  const [villagerLiveStatus, setVillagerLiveStatus] = useState({
    inWater: false,
    activity: null,
    activityLabel: 'מטייל בנחת בכפר 🍃'
  });

  // UI state
  const [selectedBuildItem, setSelectedBuildItem] = useState(null);
  const [selectedBuildCategory, setSelectedBuildCategory] = useState('הכל');
  const [buildSearchQuery, setBuildSearchQuery] = useState('');
  const [continuousBuild, setContinuousBuild] = useState(false);
  const [isDemolishMode, setIsDemolishMode] = useState(false);
  const [movingObject, setMovingObject] = useState(null);
  const [isMoveToolActive, setIsMoveToolActive] = useState(false);
  const [inspectedObject, setInspectedObject] = useState(null); // Click on tree/bench to view personal memory
  const [draggingObject, setDraggingObject] = useState(null); // Object being moved via drag
  const activeDragRef = useRef(null);
  const isMoveToolActiveRef = useRef(false);
  const [showSanctuaryJournal, setShowSanctuaryJournal] = useState(false);
  const [showPlantingDrawer, setShowPlantingDrawer] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);
  const [newIntentionText, setNewIntentionText] = useState('');
  const [newIntentionCategory, setNewIntentionCategory] = useState('מנוחה ונפש');
  const [activeAffirmation, setActiveAffirmation] = useState(WARM_AFFIRMATIONS[0]);

  // Time of Day: 'day' | 'sunset' | 'night'
  const [timeOfDay, setTimeOfDay] = useState(() => {
    const hour = new Date().getHours();
    if (hour >= 18 && hour < 21) return 'sunset';
    if (hour >= 21 || hour < 6) return 'night';
    return 'sunset'; // Default to a gorgeous warm cozy sunset clearing
  });

  // Village Territory Expansion & Land Cultivation state
  const [expansionTier, setExpansionTier] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANSION_TIER);
      return saved ? parseInt(saved, 10) : 1;
    } catch {
      return 1;
    }
  });

  const [cultivatedPlots, setCultivatedPlots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CULTIVATED_TILES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showExpansionModal, setShowExpansionModal] = useState(false);
  const [isCultivatingMode, setIsCultivatingMode] = useState(false);
  const [frontierInspectTile, setFrontierInspectTile] = useState(null);
  const [cameraPan, setCameraPan] = useState({ x: 0, y: 0 });

  // Village Institutions Resources State
  const [villageResources, setVillageResources] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_INSTITUTION_RESOURCES);
      return saved ? JSON.parse(saved) : { veggies: 8, harvest: 5, crystals: 2 };
    } catch {
      return { veggies: 8, harvest: 5, crystals: 2 };
    }
  });

  const [showInstitutionsModal, setShowInstitutionsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INSTITUTION_RESOURCES, JSON.stringify(villageResources));
  }, [villageResources]);

  // Keep refs for the continuous canvas render loop so moving mouse or changing selections never restarts/pauses animation
  const hoveredTileRef = useRef(null);
  const placedObjectsRef = useRef(placedObjects);
  const selectedBuildItemRef = useRef(selectedBuildItem);
  const inspectedObjectRef = useRef(inspectedObject);
  const draggingObjectRef = useRef(draggingObject);
  const movingObjectRef = useRef(movingObject);
  const isDemolishModeRef = useRef(isDemolishMode);
  const timeOfDayRef = useRef(timeOfDay);
  const currentOutfitRef = useRef(currentOutfit);
  const expansionTierRef = useRef(expansionTier);
  const cultivatedPlotsRef = useRef(cultivatedPlots);
  const isCultivatingModeRef = useRef(isCultivatingMode);
  const cameraPanRef = useRef(cameraPan);

  useEffect(() => {
    isMoveToolActiveRef.current = isMoveToolActive;
  }, [isMoveToolActive]);

  useEffect(() => {
    movingObjectRef.current = movingObject;
  }, [movingObject]);

  useEffect(() => {
    isDemolishModeRef.current = isDemolishMode;
  }, [isDemolishMode]);

  useEffect(() => {
    expansionTierRef.current = expansionTier;
    localStorage.setItem(STORAGE_KEY_EXPANSION_TIER, expansionTier.toString());
  }, [expansionTier]);

  useEffect(() => {
    cultivatedPlotsRef.current = cultivatedPlots;
    localStorage.setItem(STORAGE_KEY_CULTIVATED_TILES, JSON.stringify(cultivatedPlots));
  }, [cultivatedPlots]);

  useEffect(() => {
    isCultivatingModeRef.current = isCultivatingMode;
  }, [isCultivatingMode]);

  useEffect(() => {
    cameraPanRef.current = cameraPan;
  }, [cameraPan]);

  // Pointer down info ref
  const pointerDownInfoRef = useRef(null);

  useEffect(() => { placedObjectsRef.current = placedObjects; }, [placedObjects]);
  useEffect(() => { selectedBuildItemRef.current = selectedBuildItem; }, [selectedBuildItem]);
  useEffect(() => { inspectedObjectRef.current = inspectedObject; }, [inspectedObject]);
  useEffect(() => { draggingObjectRef.current = draggingObject; }, [draggingObject]);
  useEffect(() => {
    currentOutfitRef.current = currentOutfit;
    localStorage.setItem(STORAGE_KEY_OUTFIT, currentOutfit);
  }, [currentOutfit]);
  useEffect(() => {
    timeOfDayRef.current = timeOfDay;
    if (!soundMuted) {
      sounds.startAmbience(timeOfDay);
    }
  }, [timeOfDay, soundMuted]);

  // Rotate warm reflection every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAffirmation(prev => {
        const nextIdx = (WARM_AFFIRMATIONS.indexOf(prev) + 1) % WARM_AFFIRMATIONS.length;
        return WARM_AFFIRMATIONS[nextIdx];
      });
    }, 45000);
    return () => clearInterval(timer);
  }, []);


  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SEEDS, seeds.toString());
  }, [seeds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_INTENTIONS, JSON.stringify(intentions));
  }, [intentions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PLACED, JSON.stringify(placedObjects));
  }, [placedObjects]);

  const toggleSound = () => {
    const next = !soundMuted;
    setSoundMuted(next);
    sounds.muted = next;
    if (next) {
      sounds.stopAmbience();
    } else {
      sounds.playTap();
      sounds.startAmbience(timeOfDay);
    }
  };

  // Persistent bird, butterfly, fireflies, clouds state across renders
  const animEntitiesRef = useRef({
    butterflies: [
      { x: 300, y: 250, vx: 0.7, vy: -0.3, phase: 0, color: '#fbcfe8' },
      { x: 550, y: 380, vx: -0.5, vy: 0.4, phase: 1.5, color: '#fef08a' },
      { x: 750, y: 280, vx: 0.6, vy: 0.2, phase: 3.1, color: '#bae6fd' }
    ],
    birds: [],
    fireflies: Array.from({ length: 28 }, (_, i) => ({
      x: 150 + Math.random() * 900,
      y: 100 + Math.random() * 600,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.03 + Math.random() * 0.04,
      baseRadius: 1.8 + Math.random() * 1.6
    })),
    cloudShadows: [
      { x: 140, y: 180, rx: 190, ry: 90, speed: 0.25 },
      { x: 700, y: 320, rx: 240, ry: 110, speed: 0.22 },
      { x: 1250, y: 160, rx: 200, ry: 95, speed: 0.24 }
    ],
    villager: {
      gx: 11,
      gy: 11,
      currGx: 11,
      currGy: 11,
      startGx: 11,
      startGy: 11,
      targetGx: 11,
      targetGy: 11,
      progress: 1,
      speed: 0.011,
      idleTimer: 60,
      facingLeft: false,
      walkCycle: 0,
      hopY: 0,
      hopVy: 0,
      screenPos: { x: 0, y: 0 },
      inWater: false,
      wasInWater: false,
      outfit: 'autumn_sweater',
      activity: null,
      activityTimer: 0,
      activityTarget: null,
      thoughtTimer: 550,
      bubble: {
        text: 'שלום! איזה כיף לטייל בכפר 🌸',
        timer: 240
      },
      emote: '✨',
      emoteTimer: 130
    }
  });

  // Helper to determine if a tile is part of the cleared / cultivated meadow
  const isTileClearedHelper = (gx, gy, tier, cultivatedList, placedList) => {
    // 1. Any specifically cultivated plot added by the player
    if (cultivatedList && cultivatedList.some(p => p.gx === gx && p.gy === gy)) {
      return true;
    }
    // 2. Any tile containing an existing placed object (safeguard so all player creations remain planted)
    if (placedList && placedList.some(o => o.gx === gx && o.gy === gy)) {
      return true;
    }
    // 3. Intimate clearing glade radius
    const tierData = EXPANSION_TIERS.find(t => t.tier === tier) || EXPANSION_TIERS[0];
    const baseRadius = tierData.radius; // Tier 1: 8.5
    const dx = gx - 11;
    const dy = gy - 11;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);
    const wobble = Math.sin(angle * 3) * 1.5 + Math.cos(angle * 5) * 1.0;
    return dist <= (baseRadius + wobble);
  };

  // Helper to determine if a tile is an uncultivated frontier plot bordering cleared land
  const isCultivableFrontierHelper = (gx, gy, tier, cultivatedList, placedList) => {
    if (isTileClearedHelper(gx, gy, tier, cultivatedList, placedList)) return false;
    if (gx < 1 || gx >= GRID_SIZE - 1 || gy < 1 || gy >= GRID_SIZE - 1) return false;
    const dx = gx - 11;
    const dy = gy - 11;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 16.0) return false;

    const neighbors = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [1, 1], [-1, 1], [1, -1]
    ];
    return neighbors.some(([ox, oy]) => isTileClearedHelper(gx + ox, gy + oy, tier, cultivatedList, placedList));
  };

  // High-performance precomputed tile grid cache (avoids 6000+ trig calculations per frame)
  const tileGridCacheRef = useRef(null);
  const computeTileGrid = (tier, cultivated, placed) => {
    const grid = [];
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      const row = [];
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const inClearing = isTileClearedHelper(gx, gy, tier, cultivated, placed);
        const isFrontier = !inClearing && isCultivableFrontierHelper(gx, gy, tier, cultivated, placed);
        const isCultivated = cultivated ? cultivated.some(p => p.gx === gx && p.gy === gy) : false;
        const isWildflower = (gx * 17 + gy * 23) % 9 === 0;

        let colorType = 0;
        if ((gx * 7 + gy * 13) % 11 === 0) colorType = 2;
        else if ((gx * 11 + gy * 5) % 13 === 0) colorType = 3;
        else colorType = ((gx + gy) % 2 === 0) ? 0 : 1;

        row.push({
          gx,
          gy,
          inClearing,
          isFrontier,
          isCultivated,
          isWildflower,
          colorType
        });
      }
      grid.push(row);
    }
    return grid;
  };

  // Helper to compute natural borders of trees and rocks along the bottom (east) and right (north) of the clearing
  const computeBorderScenery = (tier, cultivated, placed) => {
    const scenery = [];
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        const inCleared = isTileClearedHelper(gx, gy, tier, cultivated, placed);
        if (inCleared) continue;

        // Find distance to cleared land
        let minDist = 999;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && isTileClearedHelper(nx, ny, tier, cultivated, placed)) {
              const d = Math.hypot(dx, dy);
              if (d < minDist) minDist = d;
            }
          }
        }

        // Must border the clearing rim (between 0.8 and 2.8 tiles away)
        if (minDist > 2.8 || minDist < 0.8) continue;

        // Screen offsets relative to center (11, 11)
        const screenDx = (gx - gy) * (TILE_W / 2);
        const screenDy = (gx + gy - 22) * (TILE_H / 2);

        // 1. Right side of the clearing rim
        const isRightSide = screenDx >= 45 && screenDy >= -180 && screenDy <= 200;

        // 2. Bottom of the clearing rim
        const isBottomSide = screenDy >= 80 && Math.abs(screenDx) <= 240;

        if (!isRightSide && !isBottomSide) continue;

        const hash = (gx * 37 + gy * 53) % 100;
        if (hash < 76) {
          let itemType = 'pine';
          if (hash % 6 === 0) {
            itemType = 'rock';
          } else if (hash % 6 === 1) {
            itemType = 'boulder_moss';
          } else if (hash % 6 === 2) {
            itemType = 'fir_tall';
          } else if (hash % 6 === 3) {
            itemType = 'leafy_tree';
          } else {
            itemType = 'pine';
          }

          const scale = 0.88 + ((gx * 11 + gy * 17) % 28) / 100;
          const offsetX = ((gx * 7 + gy * 13) % 9) - 4;
          const offsetY = ((gx * 11 + gy * 3) % 7) - 3;

          scenery.push({
            gx,
            gy,
            itemType,
            side: isBottomSide ? 'bottom' : 'right',
            scale,
            offsetX,
            offsetY,
            id: `border_${gx}_${gy}`
          });
        }
      }
    }
    return scenery;
  };

  const borderSceneryRef = useRef(null);
  if (!borderSceneryRef.current) {
    borderSceneryRef.current = computeBorderScenery(expansionTier, cultivatedPlots, placedObjects);
  }

  if (!tileGridCacheRef.current) {
    tileGridCacheRef.current = computeTileGrid(expansionTier, cultivatedPlots, placedObjects);
  }

  useEffect(() => {
    tileGridCacheRef.current = computeTileGrid(expansionTier, cultivatedPlots, placedObjects);
    borderSceneryRef.current = computeBorderScenery(expansionTier, cultivatedPlots, placedObjects);
  }, [expansionTier, cultivatedPlots, placedObjects]);

  // Helper to determine if a tile is part of the organic forest clearing or cultivated land
  const checkClearing = (gx, gy) => {
    if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return false;
    return tileGridCacheRef.current?.[gy]?.[gx]?.inClearing ?? isTileClearedHelper(gx, gy, expansionTierRef.current, cultivatedPlotsRef.current, placedObjectsRef.current);
  };

  // Check if a tile is a frontier plot bordering cleared land
  const checkFrontier = (gx, gy) => {
    if (gx < 0 || gx >= GRID_SIZE || gy < 0 || gy >= GRID_SIZE) return false;
    return tileGridCacheRef.current?.[gy]?.[gx]?.isFrontier ?? isCultivableFrontierHelper(gx, gy, expansionTierRef.current, cultivatedPlotsRef.current, placedObjectsRef.current);
  };

  // Canvas render engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const { butterflies, birds, fireflies, cloudShadows } = animEntitiesRef.current;

    // Warm wholesome grass palette
    const GRASS_1 = '#64af32'; // Fresh meadow green
    const GRASS_2 = '#5aa32a'; // Alternating soft checker
    const GRASS_3 = '#509623'; // Earthy shade
    const GRASS_HIGHLIGHT = '#6ebc37'; // Golden hour sun highlight

    const getOrigin = (w, h) => ({
      x: w / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0),
      y: h * 0.17 + (cameraPanRef.current ? cameraPanRef.current.y : 0)
    });

    const toScreen = (gx, gy, ox, oy) => ({
      x: ox + (gx - gy) * (TILE_W / 2),
      y: oy + (gx + gy) * (TILE_H / 2)
    });

    const drawTile = (sx, sy, color, isHovered, isBuildable) => {
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
      ctx.lineTo(sx, sy + TILE_H);
      ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
      ctx.closePath();

      ctx.fillStyle = color;
      ctx.fill();

      // Only stroke and highlight when tile is hovered or active (eliminates 34,500+ heavy stroke calls/sec)
      if (isHovered) {
        ctx.strokeStyle = isBuildable ? '#fde047' : '#f87171';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = isBuildable ? 'rgba(254, 240, 138, 0.3)' : 'rgba(239, 68, 68, 0.2)';
        ctx.fill();
      }
    };

    // Wholesome object drawing (warm, handcrafted, calming aesthetics)
    const drawItem = (type, sx, sy, isInspected, objData = {}) => {
      const cx = sx;
      const cy = sy + TILE_H / 2;

      // Glow circle when clicked to reminisce
      if (isInspected) {
        ctx.save();
        ctx.fillStyle = 'rgba(253, 230, 138, 0.35)';
        ctx.beginPath();
        ctx.ellipse(cx, cy + 4, 26, 13, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();
      }

      switch (type) {
        case 'river_tile': {
          // Flowing isometric river tile with layered translucent depth and banks
          ctx.save();
          // Riverbed base
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
          ctx.lineTo(sx, sy + TILE_H);
          ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
          ctx.closePath();
          const bedGrad = ctx.createLinearGradient(sx - TILE_W / 2, sy, sx + TILE_W / 2, sy + TILE_H);
          bedGrad.addColorStop(0, '#0369a1');
          bedGrad.addColorStop(0.5, '#0284c7');
          bedGrad.addColorStop(1, '#075985');
          ctx.fillStyle = bedGrad;
          ctx.fill();

          // River banks (soft natural mud / pebble shorelines)
          ctx.fillStyle = '#452b14';
          ctx.beginPath();
          ctx.moveTo(sx - TILE_W / 2, sy + TILE_H / 2);
          ctx.quadraticCurveTo(sx - 12, sy + 6, sx, sy);
          ctx.lineTo(sx - TILE_W / 2 + 5, sy + TILE_H / 2 - 2);
          ctx.closePath();
          ctx.fill();

          // Water body with subtle turquoise transparency
          const waterGrad = ctx.createLinearGradient(sx, sy, sx, sy + TILE_H);
          waterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
          waterGrad.addColorStop(0.6, 'rgba(14, 165, 233, 0.9)');
          waterGrad.addColorStop(1, 'rgba(2, 132, 199, 0.95)');
          ctx.fillStyle = waterGrad;
          ctx.beginPath();
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx + TILE_W / 2 - 2, sy + TILE_H / 2);
          ctx.lineTo(sx, sy + TILE_H - 2);
          ctx.lineTo(sx - TILE_W / 2 + 2, sy + TILE_H / 2);
          ctx.closePath();
          ctx.fill();

          // Flowing animated water caustics / gentle river ripples
          const wavePhase = (Date.now() * 0.0022);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';

          // Ripple 1
          const w1 = Math.sin(wavePhase) * 3;
          ctx.beginPath();
          ctx.moveTo(cx - 18, cy - 4 + w1);
          ctx.bezierCurveTo(cx - 8, cy - 8 + w1, cx + 4, cy - 2 + w1, cx + 16, cy - 5 + w1);
          ctx.stroke();

          // Ripple 2
          const w2 = Math.cos(wavePhase * 1.2) * 2.5;
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.55)';
          ctx.beginPath();
          ctx.moveTo(cx - 12, cy + 4 + w2);
          ctx.bezierCurveTo(cx - 2, cy + 1 + w2, cx + 8, cy + 6 + w2, cx + 18, cy + 3 + w2);
          ctx.stroke();

          // Smooth colored river pebbles along shore
          const pebbles = [
            { x: cx - 20, y: cy + 3, rx: 4, ry: 2.5, col: '#cbd5e1' },
            { x: cx - 14, y: cy + 8, rx: 3, ry: 2, col: '#94a3b8' },
            { x: cx + 18, y: cy - 4, rx: 3.5, ry: 2.2, col: '#e2e8f0' },
            { x: cx + 12, y: cy - 8, rx: 4.2, ry: 2.6, col: '#64748b' }
          ];
          pebbles.forEach(p => {
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 1, p.rx, p.ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = p.col;
            ctx.beginPath();
            ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
            ctx.fill();
            // Tiny highlight on pebble
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.beginPath();
            ctx.arc(p.x - 1, p.y - 0.8, 1, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
          break;
        }

        case 'wooden_bridge': {
          ctx.save();
          // 1. Water flowing underneath
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
          ctx.lineTo(sx, sy + TILE_H);
          ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
          ctx.closePath();
          ctx.fillStyle = '#0284c7';
          ctx.fill();

          // 2. Soft cast shadow of bridge onto the water
          ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 24, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // 3. Arched wooden support trusses (underside in shadow)
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.moveTo(cx - 22, cy + 2);
          ctx.quadraticCurveTo(cx, cy - 2, cx + 22, cy + 2);
          ctx.lineTo(cx + 22, cy + 7);
          ctx.quadraticCurveTo(cx, cy + 3, cx - 22, cy + 7);
          ctx.closePath();
          ctx.fill();

          // 4. Curved bridge deck with planking
          const deckGrad = ctx.createLinearGradient(cx - 22, cy - 8, cx + 22, cy + 8);
          deckGrad.addColorStop(0, '#b45309');
          deckGrad.addColorStop(0.5, '#d97706');
          deckGrad.addColorStop(1, '#92400e');
          ctx.fillStyle = deckGrad;

          ctx.beginPath();
          ctx.moveTo(cx - 22, cy - 8);
          ctx.quadraticCurveTo(cx, cy - 14, cx + 22, cy - 8);
          ctx.lineTo(cx + 22, cy + 5);
          ctx.quadraticCurveTo(cx, cy - 1, cx - 22, cy + 5);
          ctx.closePath();
          ctx.fill();

          // Wooden plank individual slats with bevel highlight
          for (let i = -18; i <= 18; i += 5) {
            ctx.strokeStyle = 'rgba(69, 26, 3, 0.8)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(cx + i, cy - 10 + (Math.abs(i) * 0.15));
            ctx.lineTo(cx + i, cy + 3 + (Math.abs(i) * 0.15));
            ctx.stroke();

            // Slat sunlit edge highlight
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(cx + i + 1, cy - 10 + (Math.abs(i) * 0.15));
            ctx.lineTo(cx + i + 1, cy + 3 + (Math.abs(i) * 0.15));
            ctx.stroke();
          }

          // 5. Handrails with timber posts and rope/rail
          const posts = [-19, -8, 6, 19];
          posts.forEach(px => {
            // Shadow behind post
            ctx.fillStyle = '#451a03';
            ctx.fillRect(cx + px - 1, cy - 16, 2.5, 9);
            // Post cap
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.arc(cx + px, cy - 16, 1.8, 0, Math.PI * 2);
            ctx.fill();
          });

          // Handrail beam
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 2.4;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx - 20, cy - 14);
          ctx.quadraticCurveTo(cx, cy - 19, cx + 20, cy - 14);
          ctx.stroke();

          // Handrail top sun highlight
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 19, cy - 15);
          ctx.quadraticCurveTo(cx, cy - 20, cx + 19, cy - 15);
          ctx.stroke();

          // River plants / reeds by bridge foot
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy + 3);
          ctx.quadraticCurveTo(cx - 27, cy - 6, cx - 23, cy - 11);
          ctx.quadraticCurveTo(cx - 22, cy - 4, cx - 21, cy + 4);
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'water_lily_pond': {
          ctx.save();
          // Soft ground ambient shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 5, 24, 12, 0, 0, Math.PI * 2);
          ctx.fill();

          // Organic mossy stone rim
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Stones along the rim with moss
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const rx = cx + Math.cos(a) * 20;
            const ry = cy + 2 + Math.sin(a) * 9.5;
            ctx.fillStyle = (a % (Math.PI / 2) === 0) ? '#64748b' : '#334155';
            ctx.beginPath();
            ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
            ctx.fill();
            // Moss fleck
            if (a % 1 < 0.5) {
              ctx.fillStyle = '#65a30d';
              ctx.beginPath();
              ctx.arc(rx, ry - 1, 1.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Shimmering deep pond water gradient
          const pondGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 18);
          pondGrad.addColorStop(0, '#38bdf8');
          pondGrad.addColorStop(0.5, '#0284c7');
          pondGrad.addColorStop(1, '#0f3a5d');
          ctx.fillStyle = pondGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 1, 18, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Lily pads (עלי נופר) with soft shadows and organic notch
          const pads = [
            { x: cx - 8, y: cy - 1, r: 5.5, rot: 0.4 },
            { x: cx + 7, y: cy + 2, r: 4.8, rot: 2.1 },
            { x: cx - 1, y: cy + 4, r: 4.2, rot: 4.2 }
          ];

          pads.forEach(p => {
            // Shadow under pad
            ctx.fillStyle = 'rgba(2, 44, 70, 0.5)';
            ctx.beginPath();
            ctx.ellipse(p.x, p.y + 1, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();

            // Rich green leaf with radiant tone
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, p.rot, p.rot + Math.PI * 1.82);
            ctx.lineTo(p.x, p.y);
            ctx.closePath();
            ctx.fill();

            // Leaf radial rib
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 0.6, p.rot + 0.3, p.rot + Math.PI * 1.5);
            ctx.stroke();
          });

          // Blooming Water Lily Flower (layered lotus petals with gentle glow)
          const fx = cx - 8, fy = cy - 2;
          ctx.fillStyle = '#f43f5e'; // Deep pink outer petal
          ctx.beginPath();
          ctx.ellipse(fx, fy, 4, 3, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fbcfe8'; // Soft pink inner petal
          ctx.beginPath();
          ctx.ellipse(fx, fy - 1, 3, 2.4, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fef08a'; // Golden pistil center
          ctx.beginPath();
          ctx.arc(fx, fy - 1, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Secondary blooming lotus bud
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(cx + 7, cy + 1, 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 6.5, cy + 0.6, 1.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'flower_garden': {
          ctx.save();
          // Soil mound with soft contact shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.28)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Rich dark garden loam
          const soilGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 19);
          soilGrad.addColorStop(0, '#59320e');
          soilGrad.addColorStop(0.8, '#3d2008');
          soilGrad.addColorStop(1, '#271403');
          ctx.fillStyle = soilGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 1, 19, 9.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Green stems and leafy groundcover
          ctx.fillStyle = '#15803d';
          for (let i = -12; i <= 12; i += 6) {
            ctx.beginPath();
            ctx.ellipse(cx + i, cy + (Math.sin(i) * 2), 4, 2, 0.3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Diverse, layered cozy flowers (lavender, daisy, rosebud, marigold)
          const flowers = [
            { x: cx - 10, y: cy - 4, pCol: '#f43f5e', cCol: '#fef08a', petals: 5, r: 4 },
            { x: cx - 2, y: cy - 7, pCol: '#fbbf24', cCol: '#78350f', petals: 6, r: 4.5 },
            { x: cx + 8, y: cy - 4, pCol: '#a855f7', cCol: '#fde047', petals: 5, r: 4 },
            { x: cx - 6, y: cy + 2, pCol: '#38bdf8', cCol: '#ffffff', petals: 5, r: 3.8 },
            { x: cx + 5, y: cy + 2, pCol: '#f472b6', cCol: '#fef08a', petals: 5, r: 4.2 }
          ];

          flowers.forEach(f => {
            // Petals around center
            ctx.fillStyle = f.pCol;
            for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / f.petals) {
              const px = f.x + Math.cos(a) * (f.r * 0.6);
              const py = f.y + Math.sin(a) * (f.r * 0.6);
              ctx.beginPath();
              ctx.arc(px, py, f.r * 0.45, 0, Math.PI * 2);
              ctx.fill();
            }
            // Flower Center
            ctx.fillStyle = f.cCol;
            ctx.beginPath();
            ctx.arc(f.x, f.y, f.r * 0.35, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
          break;
        }

        case 'bush': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 20, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Multi-layer foliage with ambient occlusion and highlight
          // Back deep shadow leaves
          ctx.fillStyle = '#14532d';
          ctx.beginPath();
          ctx.arc(cx - 8, cy - 6, 12, 0, Math.PI * 2);
          ctx.arc(cx + 9, cy - 7, 13, 0, Math.PI * 2);
          ctx.arc(cx, cy - 14, 14, 0, Math.PI * 2);
          ctx.fill();

          // Midtone warm green lobes
          ctx.fillStyle = '#16a34a';
          ctx.beginPath();
          ctx.arc(cx - 5, cy - 8, 11, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy - 9, 11.5, 0, Math.PI * 2);
          ctx.arc(cx, cy - 16, 12, 0, Math.PI * 2);
          ctx.fill();

          // Top sun-kissed leafy highlights
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 18, 7.5, 0, Math.PI * 2);
          ctx.arc(cx + 4, cy - 12, 6.5, 0, Math.PI * 2);
          ctx.fill();

          // Juicy glowing berries
          const berries = [
            { x: cx - 7, y: cy - 13 },
            { x: cx + 7, y: cy - 15 },
            { x: cx + 2, y: cy - 6 },
            { x: cx - 4, y: cy - 4 }
          ];
          berries.forEach(b => {
            ctx.fillStyle = '#e11d48';
            ctx.beginPath();
            ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            // Tiny gloss specular dot
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(b.x - 0.7, b.y - 0.7, 0.8, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
          break;
        }

        case 'oak_tree': {
          ctx.save();
          // 1. Soft natural ground shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx + 8, cy + 9, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // 2. Trunk with organic curve, bark grain & roots
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          // Root flaring
          ctx.moveTo(cx - 8, cy + 6);
          ctx.quadraticCurveTo(cx - 3, cy - 5, cx - 3, cy - 26);
          ctx.lineTo(cx + 3, cy - 26);
          ctx.quadraticCurveTo(cx + 3, cy - 5, cx + 8, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Trunk sunlit left edge
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.moveTo(cx - 7, cy + 5);
          ctx.quadraticCurveTo(cx - 3, cy - 5, cx - 2, cy - 26);
          ctx.lineTo(cx, cy - 26);
          ctx.quadraticCurveTo(cx - 1, cy - 5, cx - 3, cy + 5);
          ctx.closePath();
          ctx.fill();

          // Bark striations
          ctx.strokeStyle = '#270e02';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(cx + 1, cy - 6);
          ctx.lineTo(cx + 2, cy + 3);
          ctx.stroke();

          // 3. Volumetric Canopied Foliage (Deep Shadow -> Midtone -> Golden Highlights)
          // Layer A: Dark Under-Canopy
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.arc(cx - 13, cy - 30, 16, 0, Math.PI * 2);
          ctx.arc(cx + 13, cy - 30, 16, 0, Math.PI * 2);
          ctx.arc(cx, cy - 44, 18, 0, Math.PI * 2);
          ctx.fill();

          // Layer B: Mid-Tone Lush Leaves
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(cx - 8, cy - 35, 15, 0, Math.PI * 2);
          ctx.arc(cx + 9, cy - 34, 15, 0, Math.PI * 2);
          ctx.arc(cx, cy - 48, 16, 0, Math.PI * 2);
          ctx.fill();

          // Layer C: Golden-Green Canopy Highlights
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(cx - 5, cy - 42, 12, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy - 40, 11, 0, Math.PI * 2);
          ctx.arc(cx, cy - 53, 12, 0, Math.PI * 2);
          ctx.fill();

          // Layer D: Sunlit Rim Glint
          ctx.fillStyle = '#86efac';
          ctx.beginPath();
          ctx.arc(cx - 4, cy - 55, 6, 0, Math.PI * 2);
          ctx.arc(cx - 8, cy - 43, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Little red apples or glowing forest blossom
          const apples = [
            { x: cx - 11, y: cy - 31 },
            { x: cx + 12, y: cy - 29 },
            { x: cx + 1, y: cy - 38 }
          ];
          apples.forEach(a => {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(a.x, a.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(a.x - 0.7, a.y - 0.7, 0.8, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
          break;
        }

        case 'pine_tree': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx + 6, cy + 8, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#451a03';
          ctx.fillRect(cx - 3, cy - 16, 6, 22);

          // Tiered curved evergreen boughs with scalloped edges
          const drawPineBough = (baseY, coneW, coneH, darkCol, midCol, lightCol) => {
            // Shadow under-tier
            ctx.fillStyle = darkCol;
            ctx.beginPath();
            ctx.moveTo(cx - coneW, baseY);
            ctx.quadraticCurveTo(cx, baseY + 4, cx + coneW, baseY);
            ctx.lineTo(cx, baseY - coneH);
            ctx.closePath();
            ctx.fill();

            // Lit face
            ctx.fillStyle = midCol;
            ctx.beginPath();
            ctx.moveTo(cx - coneW, baseY);
            ctx.quadraticCurveTo(cx - coneW * 0.5, baseY + 2, cx, baseY);
            ctx.lineTo(cx, baseY - coneH);
            ctx.closePath();
            ctx.fill();

            // Edge frosted needle highlights
            ctx.strokeStyle = lightCol;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - coneW + 2, baseY - 1);
            ctx.lineTo(cx, baseY - coneH);
            ctx.stroke();
          };

          drawPineBough(cy - 7, 22, 22, '#064e3b', '#047857', '#34d399');
          drawPineBough(cy - 20, 17, 21, '#064e3b', '#059669', '#6ee7b7');
          drawPineBough(cy - 33, 12, 22, '#047857', '#10b981', '#a7f3d0');
          ctx.restore();
          break;
        }

        case 'reading_bench': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(0,0,0,0.28)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 18, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Ornate wrought-iron bench legs
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          // Left leg
          ctx.beginPath();
          ctx.moveTo(cx - 13, cy + 5);
          ctx.quadraticCurveTo(cx - 15, cy - 2, cx - 13, cy - 6);
          ctx.stroke();
          // Right leg
          ctx.beginPath();
          ctx.moveTo(cx + 11, cy + 5);
          ctx.quadraticCurveTo(cx + 13, cy - 2, cx + 11, cy - 6);
          ctx.stroke();

          // Wooden bench slats (Warm polished cedar planks)
          const benchGrad = ctx.createLinearGradient(cx - 15, cy - 8, cx + 15, cy + 4);
          benchGrad.addColorStop(0, '#d97706');
          benchGrad.addColorStop(1, '#92400e');

          // Seat Slats
          ctx.fillStyle = benchGrad;
          ctx.beginPath();
          ctx.roundRect(cx - 15, cy - 6, 30, 6, 2);
          ctx.fill();
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Backrest Slats
          ctx.fillStyle = benchGrad;
          ctx.beginPath();
          ctx.roundRect(cx - 15, cy - 14, 30, 5, 2);
          ctx.fill();
          ctx.stroke();

          // Slat division lines
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(cx - 14, cy - 5);
          ctx.lineTo(cx + 14, cy - 5);
          ctx.moveTo(cx - 14, cy - 13);
          ctx.lineTo(cx + 14, cy - 13);
          ctx.stroke();

          // Cozy red tartan cushion & open journal on the bench
          // Cushion
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.roundRect(cx - 10, cy - 8, 9, 5, 2);
          ctx.fill();
          ctx.fillStyle = '#fca5a5';
          ctx.fillRect(cx - 6, cy - 8, 1, 5);

          // Open Journal / Book
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.moveTo(cx + 3, cy - 8);
          ctx.lineTo(cx + 7, cy - 6);
          ctx.lineTo(cx + 11, cy - 8);
          ctx.lineTo(cx + 11, cy - 5);
          ctx.lineTo(cx + 7, cy - 3);
          ctx.lineTo(cx + 3, cy - 5);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.restore();
          break;
        }

        case 'stone_path': {
          ctx.save();
          // Flagstone stepping stones with natural variation, beveled edges and grass tufts
          const stones = [
            { x: cx - 12, y: cy - 2, rx: 7.5, ry: 4.5, baseCol: '#cbd5e1', lightCol: '#f1f5f9' },
            { x: cx + 9, y: cy - 4, rx: 8.5, ry: 5.2, baseCol: '#94a3b8', lightCol: '#e2e8f0' },
            { x: cx - 2, y: cy + 4, rx: 9.5, ry: 5.5, baseCol: '#64748b', lightCol: '#cbd5e1' }
          ];

          stones.forEach(s => {
            // Shadow beneath stone
            ctx.fillStyle = 'rgba(0,0,0,0.22)';
            ctx.beginPath();
            ctx.ellipse(s.x, s.y + 2, s.rx, s.ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Main Flagstone
            ctx.fillStyle = s.baseCol;
            ctx.beginPath();
            ctx.ellipse(s.x, s.y, s.rx, s.ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Top Sunlit Bevel
            ctx.strokeStyle = s.lightCol;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(s.x - 0.5, s.y - 0.5, s.rx * 0.8, s.ry * 0.75, 0, Math.PI * 0.8, Math.PI * 1.9);
            ctx.stroke();

            // Tiny moss blade on stone joint
            ctx.fillStyle = '#84cc16';
            ctx.fillRect(s.x - 2, s.y + 1, 1.2, 2.5);
          });
          ctx.restore();
          break;
        }

        case 'bonfire': {
          ctx.save();
          // Ground scorch & warm ember glow circle
          const fireGlow = 22 + Math.sin(Date.now() * 0.007) * 4;
          const emberGrad = ctx.createRadialGradient(cx, cy + 2, 2, cx, cy + 2, fireGlow);
          emberGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
          emberGrad.addColorStop(0.5, 'rgba(234, 88, 12, 0.25)');
          emberGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = emberGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, fireGlow, fireGlow * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();

          // Riverstone circle surrounding the hearth
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4.5) {
            const rx = cx + Math.cos(a) * 13;
            const ry = cy + 4 + Math.sin(a) * 6.5;
            ctx.fillStyle = '#1e293b';
            ctx.beginPath();
            ctx.arc(rx, ry + 1, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.arc(rx, ry, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Crossing birch logs
          ctx.fillStyle = '#78350f';
          ctx.save();
          ctx.translate(cx, cy);
          ctx.rotate(-0.4);
          ctx.fillRect(-10, -2, 20, 4);
          ctx.rotate(0.8);
          ctx.fillRect(-10, -2, 20, 4);
          ctx.restore();

          // Multi-layer flickering flame
          const flameTime = Date.now() * 0.009;
          const fH1 = 12 + Math.sin(flameTime) * 3;
          const fH2 = 8 + Math.cos(flameTime * 1.3) * 2;

          // Outer flame (warm crimson-orange)
          ctx.fillStyle = '#ea580c';
          ctx.beginPath();
          ctx.moveTo(cx - 7, cy + 1);
          ctx.quadraticCurveTo(cx - 8, cy - fH1 * 0.6, cx, cy - fH1);
          ctx.quadraticCurveTo(cx + 8, cy - fH1 * 0.6, cx + 7, cy + 1);
          ctx.closePath();
          ctx.fill();

          // Inner flame (bright golden yellow)
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy);
          ctx.quadraticCurveTo(cx - 5, cy - fH2 * 0.6, cx, cy - fH2);
          ctx.quadraticCurveTo(cx + 5, cy - fH2 * 0.6, cx + 4, cy);
          ctx.closePath();
          ctx.fill();

          // Fire sparks / floating embers
          const sparkOffset1 = (flameTime * 10) % 18;
          const sparkOffset2 = ((flameTime + 1) * 9) % 22;
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(cx - 2 + Math.sin(sparkOffset1) * 3, cy - fH1 - sparkOffset1 * 0.5, 1.2, 0, Math.PI * 2);
          ctx.arc(cx + 3 + Math.cos(sparkOffset2) * 3, cy - fH1 - sparkOffset2 * 0.6, 1, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'wooden_cabin': {
          ctx.save();
          // 1. Contact ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.42)';
          ctx.beginPath();
          ctx.ellipse(cx + 6, cy + 12, 40, 18, 0, 0, Math.PI * 2);
          ctx.fill();

          // 2. Stone Foundation Plinth
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(cx - 25, cy + 4);
          ctx.lineTo(cx, cy + 16);
          ctx.lineTo(cx + 25, cy + 4);
          ctx.lineTo(cx + 25, cy);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 25, cy);
          ctx.closePath();
          ctx.fill();

          // 3. Handcrafted Log / Timber Walls (Left lit, Right shaded)
          // Left Wall (Golden Pine / Cedar Logs)
          const wallLit = ctx.createLinearGradient(cx - 24, cy, cx, cy);
          wallLit.addColorStop(0, '#b45309');
          wallLit.addColorStop(1, '#d97706');
          ctx.fillStyle = wallLit;
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy + 1);
          ctx.lineTo(cx, cy + 13);
          ctx.lineTo(cx, cy - 25);
          ctx.lineTo(cx - 24, cy - 37);
          ctx.closePath();
          ctx.fill();

          // Right Wall (Shadowed Timber)
          const wallShadow = ctx.createLinearGradient(cx, cy, cx + 24, cy);
          wallShadow.addColorStop(0, '#78350f');
          wallShadow.addColorStop(1, '#451a03');
          ctx.fillStyle = wallShadow;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 13);
          ctx.lineTo(cx + 24, cy + 1);
          ctx.lineTo(cx + 24, cy - 37);
          ctx.lineTo(cx, cy - 25);
          ctx.closePath();
          ctx.fill();

          // Horizontal Log Mortar lines
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1;
          for (let yOffset = -20; yOffset <= 8; yOffset += 6) {
            ctx.beginPath();
            ctx.moveTo(cx - 24, cy + yOffset - 12);
            ctx.lineTo(cx, cy + yOffset);
            ctx.lineTo(cx + 24, cy + yOffset - 12);
            ctx.stroke();
          }

          // Center Corner Timber Bevel Highlight
          ctx.strokeStyle = '#fde68a';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 13);
          ctx.lineTo(cx, cy - 25);
          ctx.stroke();

          // 4. Arched Oak Door with Warm Welcome
          ctx.fillStyle = '#270e02';
          ctx.beginPath();
          ctx.moveTo(cx - 8, cy + 1);
          ctx.lineTo(cx, cy + 5);
          ctx.lineTo(cx, cy - 13);
          ctx.lineTo(cx - 8, cy - 17);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.moveTo(cx - 7, cy);
          ctx.lineTo(cx - 1, cy + 3);
          ctx.lineTo(cx - 1, cy - 12);
          ctx.lineTo(cx - 7, cy - 15);
          ctx.closePath();
          ctx.fill();
          // Brass doorknob
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 4, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // 5. Glowing Leaded Glass Window with Window Box & Flowers
          // Window Frame
          ctx.fillStyle = '#1e1b4b';
          ctx.fillRect(cx + 8, cy - 15, 11, 11);
          // Warm Hearth Glow from inside
          const windowGlow = ctx.createRadialGradient(cx + 13, cy - 10, 1, cx + 13, cy - 10, 7);
          windowGlow.addColorStop(0, '#fef08a');
          windowGlow.addColorStop(0.7, '#f59e0b');
          windowGlow.addColorStop(1, '#b45309');
          ctx.fillStyle = windowGlow;
          ctx.fillRect(cx + 9, cy - 14, 9, 9);
          // Window Mullion Cross
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx + 13.5, cy - 14);
          ctx.lineTo(cx + 13.5, cy - 5);
          ctx.moveTo(cx + 9, cy - 9.5);
          ctx.lineTo(cx + 18, cy - 9.5);
          ctx.stroke();

          // Window Flower Box under window
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx + 8, cy - 4, 11, 3.5);
          // Tiny pink and yellow flowers in box
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(cx + 10, cy - 4.5, 1.5, 0, Math.PI * 2);
          ctx.arc(cx + 14, cy - 4.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx + 17, cy - 4.5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // 6. Whimsical Curved Gabled Roof (Bézier Overhang & Shingles)
          // Roof Eaves Underside Shadow
          ctx.fillStyle = '#1c1917';
          ctx.beginPath();
          ctx.moveTo(cx - 32, cy - 22);
          ctx.lineTo(cx, cy - 6);
          ctx.lineTo(cx + 32, cy - 22);
          ctx.lineTo(cx, cy - 12);
          ctx.closePath();
          ctx.fill();

          // Left Sunlit Roof Pitch
          const roofLeftGrad = ctx.createLinearGradient(cx - 34, cy - 26, cx, cy - 52);
          roofLeftGrad.addColorStop(0, '#ef4444');
          roofLeftGrad.addColorStop(0.6, '#dc2626');
          roofLeftGrad.addColorStop(1, '#b91c1c');
          ctx.fillStyle = roofLeftGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.quadraticCurveTo(cx - 16, cy - 46, cx - 34, cy - 24);
          ctx.quadraticCurveTo(cx - 16, cy - 13, cx, cy - 4);
          ctx.closePath();
          ctx.fill();

          // Right Shaded Roof Pitch
          const roofRightGrad = ctx.createLinearGradient(cx, cy - 52, cx + 34, cy - 26);
          roofRightGrad.addColorStop(0, '#991b1b');
          roofRightGrad.addColorStop(0.7, '#7f1d1d');
          roofRightGrad.addColorStop(1, '#450a0a');
          ctx.fillStyle = roofRightGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.quadraticCurveTo(cx + 16, cy - 46, cx + 34, cy - 24);
          ctx.quadraticCurveTo(cx + 16, cy - 13, cx, cy - 4);
          ctx.closePath();
          ctx.fill();

          // Roof Shingle Overlap Highlights
          ctx.strokeStyle = 'rgba(254, 202, 202, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 40);
          ctx.quadraticCurveTo(cx - 12, cy - 35, cx - 24, cy - 19);
          ctx.moveTo(cx, cy - 24);
          ctx.quadraticCurveTo(cx - 8, cy - 20, cx - 16, cy - 10);
          ctx.stroke();

          // Roof Spine Peak Ridge
          ctx.strokeStyle = '#fee2e2';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.lineTo(cx, cy - 4);
          ctx.stroke();

          // 7. Stone Chimney with Curling Translucent Smoke
          // Chimney Stone Base
          ctx.fillStyle = '#475569';
          ctx.fillRect(cx - 16, cy - 58, 8, 18);
          ctx.fillStyle = '#64748b';
          ctx.fillRect(cx - 16, cy - 58, 4, 18); // Lit face of chimney
          // Chimney Cap
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - 18, cy - 60, 12, 3);

          // Animated smoke puffs drifting upwards
          const smokeTime = Date.now() * 0.003;
          for (let s = 0; s < 3; s++) {
            const sPhase = (smokeTime + s * 1.2) % 3.6;
            const sY = cy - 64 - sPhase * 9;
            const sX = cx - 12 + Math.sin(sPhase * 1.5) * 4 + sPhase * 2;
            const sR = 3.5 + sPhase * 2.2;
            const sAlpha = Math.max(0, 0.55 - sPhase * 0.14);
            ctx.fillStyle = `rgba(241, 245, 249, ${sAlpha})`;
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
          break;
        }

        case 'fountain': {
          ctx.save();
          // Contact shadow & wet ground ring
          ctx.fillStyle = 'rgba(15, 30, 15, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Tier 1: Lower carved flagstone basin (isometric stone rim with moss)
          const stoneRimGrad = ctx.createLinearGradient(cx - 24, cy, cx + 24, cy);
          stoneRimGrad.addColorStop(0, '#64748b');
          stoneRimGrad.addColorStop(0.5, '#475569');
          stoneRimGrad.addColorStop(1, '#334155');
          ctx.fillStyle = stoneRimGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 3, 23, 11.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Pool water in lower basin with cyan-turquoise gradient & ripples
          const basinWaterGrad = ctx.createRadialGradient(cx, cy + 2, 2, cx, cy + 2, 19);
          basinWaterGrad.addColorStop(0, '#7dd3fc');
          basinWaterGrad.addColorStop(0.6, '#0284c7');
          basinWaterGrad.addColorStop(1, '#0c4a6e');
          ctx.fillStyle = basinWaterGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2, 18, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Subtle ripple circles
          const rippleTime = (Date.now() * 0.002) % 1;
          ctx.strokeStyle = `rgba(224, 242, 254, ${1 - rippleTime})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2, 8 + rippleTime * 9, (8 + rippleTime * 9) * 0.5, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Center Carved Stone Pedestal Column
          const pedGrad = ctx.createLinearGradient(cx - 5, cy, cx + 5, cy);
          pedGrad.addColorStop(0, '#94a3b8');
          pedGrad.addColorStop(1, '#475569');
          ctx.fillStyle = pedGrad;
          ctx.beginPath();
          ctx.moveTo(cx - 5, cy + 3);
          ctx.quadraticCurveTo(cx - 3, cy - 6, cx - 4, cy - 16);
          ctx.lineTo(cx + 4, cy - 16);
          ctx.quadraticCurveTo(cx + 3, cy - 6, cx + 5, cy + 3);
          ctx.closePath();
          ctx.fill();

          // Tier 2: Upper Birdbath / Scalloped Basin
          ctx.fillStyle = '#64748b';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 15, 12, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 16, 9.5, 4.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Water Spout Jet (dynamic curved spraying arches)
          const sprayPhase = Date.now() * 0.006;
          const spH = 10 + Math.sin(sprayPhase) * 2;

          // Jet core
          ctx.fillStyle = '#f0f9ff';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 18 - spH * 0.6, 2.5, spH * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cascading water droplets falling into lower pool
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
          ctx.lineWidth = 1.4;
          // Left stream
          ctx.beginPath();
          ctx.moveTo(cx, cy - 18 - spH * 0.8);
          ctx.quadraticCurveTo(cx - 8, cy - 18, cx - 11, cy - 1);
          ctx.stroke();
          // Right stream
          ctx.beginPath();
          ctx.moveTo(cx, cy - 18 - spH * 0.8);
          ctx.quadraticCurveTo(cx + 8, cy - 18, cx + 11, cy - 1);
          ctx.stroke();

          // Splash glints in pool
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 10, cy - 1, 1.4, 0, Math.PI * 2);
          ctx.arc(cx + 10, cy - 1, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'greenhouse': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.38)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 9, 30, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          // Victorian whitewashed brick / timber low foundation
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(cx - 20, cy + 3);
          ctx.lineTo(cx, cy + 13);
          ctx.lineTo(cx + 20, cy + 3);
          ctx.lineTo(cx + 20, cy - 4);
          ctx.lineTo(cx, cy + 6);
          ctx.lineTo(cx - 20, cy - 4);
          ctx.closePath();
          ctx.fill();

          // Shadowed brick side
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(cx, cy + 13);
          ctx.lineTo(cx + 20, cy + 3);
          ctx.lineTo(cx + 20, cy - 4);
          ctx.lineTo(cx, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Glass walls with botanical warmth & lush internal jungle
          const interiorGrad = ctx.createLinearGradient(cx - 18, cy - 15, cx + 18, cy + 5);
          interiorGrad.addColorStop(0, 'rgba(167, 243, 208, 0.85)');
          interiorGrad.addColorStop(0.6, 'rgba(52, 211, 153, 0.9)');
          interiorGrad.addColorStop(1, 'rgba(16, 185, 129, 0.85)');
          ctx.fillStyle = interiorGrad;
          ctx.beginPath();
          ctx.moveTo(cx - 19, cy - 4);
          ctx.lineTo(cx, cy + 6);
          ctx.lineTo(cx + 19, cy - 4);
          ctx.lineTo(cx + 19, cy - 20);
          ctx.lineTo(cx, cy - 10);
          ctx.lineTo(cx - 19, cy - 20);
          ctx.closePath();
          ctx.fill();

          // Terra-cotta pots with lush ferns & monstera visible inside
          ctx.fillStyle = '#c2410c'; // Clay pots
          ctx.fillRect(cx - 13, cy - 6, 6, 5);
          ctx.fillRect(cx + 4, cy - 3, 7, 6);

          // Potted plants leafy canopies
          ctx.fillStyle = '#065f46';
          ctx.beginPath();
          ctx.arc(cx - 10, cy - 9, 6.5, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy - 6, 7.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(cx - 9, cy - 11, 4.5, 0, Math.PI * 2);
          ctx.arc(cx + 9, cy - 8, 5, 0, Math.PI * 2);
          ctx.fill();

          // Curved Glass Mansard / Gable Roof (Transparent Cyan Glass + White Glazing Bars)
          const glassRoofGrad = ctx.createLinearGradient(cx - 24, cy - 38, cx + 24, cy);
          glassRoofGrad.addColorStop(0, 'rgba(224, 242, 254, 0.7)');
          glassRoofGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.6)');
          glassRoofGrad.addColorStop(1, 'rgba(125, 211, 252, 0.5)');
          ctx.fillStyle = glassRoofGrad;

          ctx.beginPath();
          ctx.moveTo(cx, cy - 38);
          ctx.lineTo(cx + 22, cy - 18);
          ctx.lineTo(cx, cy - 2);
          ctx.lineTo(cx - 22, cy - 18);
          ctx.closePath();
          ctx.fill();

          // White Victorian Glazing Bars & Mullions
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          // Roof Ridge Spine
          ctx.beginPath();
          ctx.moveTo(cx, cy - 38);
          ctx.lineTo(cx, cy - 2);
          ctx.stroke();

          // Glass Diagonal Light Reflections
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 14, cy - 22);
          ctx.lineTo(cx - 6, cy - 12);
          ctx.moveTo(cx + 6, cy - 26);
          ctx.lineTo(cx + 14, cy - 16);
          ctx.stroke();
          ctx.restore();
          break;
        }

        case 'tea_table': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(0,0,0,0.25)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 5, 20, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Two rustic wooden stump stools with tree rings
          const stools = [
            { x: cx - 13, y: cy - 2 },
            { x: cx + 13, y: cy - 2 }
          ];
          stools.forEach(st => {
            // Shadow behind stool
            ctx.fillStyle = '#451a03';
            ctx.fillRect(st.x - 3.5, st.y - 2, 7, 7);
            // Stool top cushion / wood ring
            ctx.fillStyle = '#92400e';
            ctx.beginPath();
            ctx.ellipse(st.x, st.y - 3, 5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.ellipse(st.x, st.y - 3.5, 3.5, 2, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          // Round Cedar Wood Table with checked tablecloth
          // Table pedestal leg
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx - 2.5, cy - 4, 5, 8);

          // Table top surface
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 4, 15, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Checkered cozy cloth runner (ivory with gold border)
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 5, 12, 6, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Fine Porcelain Teapot (Ceramic floral art)
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 10, 4, 0, Math.PI * 2);
          ctx.fill();
          // Teapot gold lid & spout
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 13.5, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#9f1239';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - 7, cy - 10);
          ctx.quadraticCurveTo(cx - 9, cy - 11, cx - 8, cy - 8);
          ctx.stroke();

          // Twin matching ceramic teacups
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 4, cy - 7, 2.4, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy - 5, 2.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#78350f'; // Herbal tea surface
          ctx.beginPath();
          ctx.arc(cx + 4, cy - 7, 1.6, 0, Math.PI * 2);
          ctx.arc(cx + 8, cy - 5, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Animated fragrant steam swirling upwards
          const steamTime = Date.now() * 0.0035;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 3, cy - 14);
          ctx.bezierCurveTo(
            cx - 6 + Math.sin(steamTime) * 3,
            cy - 19,
            cx + Math.cos(steamTime) * 3,
            cy - 24,
            cx - 2,
            cy - 29
          );
          ctx.stroke();
          ctx.restore();
          break;
        }

        case 'cozy_tent': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 9, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Warm Bell / Ridge Canvas Tent
          // Right shaded canvas face
          const tentRightGrad = ctx.createLinearGradient(cx, cy - 35, cx + 22, cy + 3);
          tentRightGrad.addColorStop(0, '#f59e0b');
          tentRightGrad.addColorStop(0.5, '#d97706');
          tentRightGrad.addColorStop(1, '#b45309');
          ctx.fillStyle = tentRightGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 35);
          ctx.lineTo(cx + 22, cy + 3);
          ctx.lineTo(cx, cy + 10);
          ctx.closePath();
          ctx.fill();

          // Left lit canvas face (warm cream/apricot)
          const tentLeftGrad = ctx.createLinearGradient(cx - 22, cy + 3, cx, cy - 35);
          tentLeftGrad.addColorStop(0, '#fef3c7');
          tentLeftGrad.addColorStop(0.7, '#fde68a');
          tentLeftGrad.addColorStop(1, '#fcd34d');
          ctx.fillStyle = tentLeftGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 35);
          ctx.lineTo(cx, cy + 10);
          ctx.lineTo(cx - 22, cy + 3);
          ctx.closePath();
          ctx.fill();

          // Front welcoming flap opening
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 28);
          ctx.lineTo(cx + 9, cy + 6);
          ctx.lineTo(cx - 9, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Interior warm glow with fluffy sleeping pillow
          const tentGlow = ctx.createRadialGradient(cx, cy + 1, 1, cx, cy + 1, 9);
          tentGlow.addColorStop(0, '#fef08a');
          tentGlow.addColorStop(0.8, '#f59e0b');
          tentGlow.addColorStop(1, '#78350f');
          ctx.fillStyle = tentGlow;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 3, 7, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Cozy woven cushion inside
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 3.5, 4.5, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Crossed Wooden Support Poles at apex
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(cx - 6, cy - 39);
          ctx.lineTo(cx + 4, cy - 28);
          ctx.moveTo(cx + 6, cy - 39);
          ctx.lineTo(cx - 4, cy - 28);
          ctx.stroke();

          // Tiny fairy pennant banner fluttering from tent pole
          const bannerWave = Math.sin(Date.now() * 0.005) * 2;
          ctx.fillStyle = '#ec4899';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 40);
          ctx.quadraticCurveTo(cx + 6, cy - 38 + bannerWave, cx + 11, cy - 36 + bannerWave);
          ctx.lineTo(cx, cy - 33);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'lantern_post': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(0,0,0,0.26)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 12, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wrought-iron beveled base
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy + 3);
          ctx.lineTo(cx + 4, cy + 3);
          ctx.lineTo(cx + 2, cy - 2);
          ctx.lineTo(cx - 2, cy - 2);
          ctx.closePath();
          ctx.fill();

          // Lamp post shaft with decorative mid-ring
          const postGrad = ctx.createLinearGradient(cx - 2, cy, cx + 2, cy);
          postGrad.addColorStop(0, '#64748b');
          postGrad.addColorStop(0.5, '#334155');
          postGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = postGrad;
          ctx.fillRect(cx - 2, cy - 30, 4, 28);
          // Ring collar
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(cx - 3, cy - 16, 6, 2.5);

          // Curved swan-neck lantern bracket
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 30);
          ctx.quadraticCurveTo(cx + 6, cy - 38, cx, cy - 42);
          ctx.stroke();

          // Warm luminous lantern halo (gentle breathing ambient light)
          const haloPulse = 22 + Math.sin(Date.now() * 0.005) * 3;
          const lampGlow = ctx.createRadialGradient(cx, cy - 34, 2, cx, cy - 34, haloPulse);
          lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
          lampGlow.addColorStop(0.4, 'rgba(251, 191, 36, 0.3)');
          lampGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = lampGlow;
          ctx.beginPath();
          ctx.arc(cx, cy - 34, haloPulse, 0, Math.PI * 2);
          ctx.fill();

          // Glass bevel hexagonal lantern housing
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(cx - 5, cy - 30);
          ctx.lineTo(cx + 5, cy - 30);
          ctx.lineTo(cx + 6, cy - 38);
          ctx.lineTo(cx - 6, cy - 38);
          ctx.closePath();
          ctx.fill();

          // Lantern iron roof cap
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 44);
          ctx.lineTo(cx + 7, cy - 38);
          ctx.lineTo(cx - 7, cy - 38);
          ctx.closePath();
          ctx.fill();
          // Gilded apex finial
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(cx, cy - 44, 1.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'wishing_well': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.38)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Round Ashlar Stone Cylinder Well
          const wellWallGrad = ctx.createLinearGradient(cx - 16, cy, cx + 16, cy);
          wellWallGrad.addColorStop(0, '#94a3b8');
          wellWallGrad.addColorStop(0.5, '#64748b');
          wellWallGrad.addColorStop(1, '#334155');
          ctx.fillStyle = wellWallGrad;
          ctx.beginPath();
          ctx.moveTo(cx - 15, cy - 8);
          ctx.lineTo(cx - 15, cy + 4);
          ctx.ellipse(cx, cy + 4, 15, 7.5, 0, 0, Math.PI);
          ctx.lineTo(cx + 15, cy - 8);
          ctx.closePath();
          ctx.fill();

          // Stone block relief lines
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Well Top Opening with Deep Clear Water
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 8, 15, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Crystal clear reflective water depth
          const wellWaterGrad = ctx.createRadialGradient(cx, cy - 8, 1, cx, cy - 8, 11);
          wellWaterGrad.addColorStop(0, '#38bdf8');
          wellWaterGrad.addColorStop(0.6, '#0284c7');
          wellWaterGrad.addColorStop(1, '#0c4a6e');
          ctx.fillStyle = wellWaterGrad;
          ctx.beginPath();
          ctx.ellipse(cx, cy - 7, 11, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Heavy Timber Side Posts
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx - 12, cy - 28, 3.5, 22);
          ctx.fillRect(cx + 8.5, cy - 28, 3.5, 22);

          // Roof Structure (Sunlit gabled tile pitch)
          // Shadow under eaves
          ctx.fillStyle = '#270e02';
          ctx.beginPath();
          ctx.moveTo(cx - 16, cy - 24);
          ctx.lineTo(cx, cy - 18);
          ctx.lineTo(cx + 16, cy - 24);
          ctx.lineTo(cx, cy - 30);
          ctx.closePath();
          ctx.fill();

          // Left roof pitch
          ctx.fillStyle = '#dc2626';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 38);
          ctx.lineTo(cx, cy - 18);
          ctx.lineTo(cx - 16, cy - 24);
          ctx.closePath();
          ctx.fill();

          // Right roof pitch
          ctx.fillStyle = '#991b1b';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 38);
          ctx.lineTo(cx + 16, cy - 24);
          ctx.lineTo(cx, cy - 18);
          ctx.closePath();
          ctx.fill();

          // Shingle ridge highlight
          ctx.strokeStyle = '#fee2e2';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 38);
          ctx.lineTo(cx, cy - 18);
          ctx.stroke();

          // Winch Spindle, Rope & Little Wooden Bucket
          ctx.fillStyle = '#d97706';
          ctx.fillRect(cx - 9, cy - 26, 18, 3.5); // Spindle
          // Rope coil
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(cx - 2, cy - 26, 4, 3.5);
          // Hanging rope line
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 23);
          ctx.lineTo(cx, cy - 13);
          ctx.stroke();

          // Wooden bucket
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.moveTo(cx - 3.5, cy - 13);
          ctx.lineTo(cx + 3.5, cy - 13);
          ctx.lineTo(cx + 2.5, cy - 8);
          ctx.lineTo(cx - 2.5, cy - 8);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          break;
        }

        case 'veggie_garden': {
          ctx.save();
          const lvl = objData?.level || 1;
          const produce = objData?.readyProduce || 0;

          // Ground contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Base Loamy Soil Bed (Isometric diamond)
          ctx.fillStyle = '#3e2723';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 12);
          ctx.lineTo(cx + 26, cy + 1);
          ctx.lineTo(cx, cy + 14);
          ctx.lineTo(cx - 26, cy + 1);
          ctx.closePath();
          ctx.fill();

          // Top Rich Tilled Soil Face
          ctx.fillStyle = '#4e342e';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 10);
          ctx.lineTo(cx + 24, cy + 1);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 24, cy + 1);
          ctx.closePath();
          ctx.fill();

          // Furrows / Tilled soil trenches
          ctx.strokeStyle = '#271711';
          ctx.lineWidth = 1;
          for (let f = -14; f <= 14; f += 7) {
            ctx.beginPath();
            ctx.moveTo(cx + f - 6, cy - 3 + f * 0.3);
            ctx.lineTo(cx + f + 6, cy + 3 + f * 0.3);
            ctx.stroke();
          }

          if (lvl === 1) {
            // Level 1: Rustic logs border, young carrot tops, and happy little scarecrow
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2.2;
            ctx.strokeRect(cx - 22, cy - 8, 44, 16);

            // Carrot crops
            const carrots = [
              { x: -14, y: 0 }, { x: -6, y: -4 }, { x: 2, y: -7 },
              { x: -8, y: 3 }, { x: 0, y: 0 }, { x: 8, y: -3 },
              { x: -2, y: 6 }, { x: 6, y: 3 }, { x: 14, y: 0 }
            ];
            carrots.forEach(c => {
              ctx.fillStyle = '#ea580c';
              ctx.beginPath();
              ctx.ellipse(cx + c.x, cy + c.y, 2.2, 1.4, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(cx + c.x - 1, cy + c.y - 3, 2.5, 0, Math.PI * 2);
              ctx.arc(cx + c.x + 1, cy + c.y - 4, 2.2, 0, Math.PI * 2);
              ctx.arc(cx + c.x, cy + c.y - 5, 2, 0, Math.PI * 2);
              ctx.fill();
            });

            // Friendly Little Scarecrow on the left
            const scX = cx - 18;
            const scY = cy - 2;
            ctx.fillStyle = '#78350f';
            ctx.fillRect(scX - 1, scY - 18, 2, 20);
            ctx.fillRect(scX - 7, scY - 13, 14, 1.8);
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.moveTo(scX, scY - 14);
            ctx.lineTo(scX + 4, scY - 6);
            ctx.lineTo(scX - 4, scY - 6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.ellipse(scX, scY - 16, 4.5, 2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(scX - 2, scY - 19, 4, 3);
          } else if (lvl === 2) {
            // Level 2: Fenced garden, stone irrigation ditch, tomatoes on stakes & lettuce
            ctx.fillStyle = '#92400e';
            for (let px = -22; px <= 22; px += 8) {
              ctx.fillRect(cx + px, cy - 12 + (px > 0 ? px * 0.2 : -px * 0.2), 2, 6);
            }

            // Stone irrigation flume down center with shimmering water
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.ellipse(cx, cy + 2, 18, 2.5, 0, 0, Math.PI * 2);
            ctx.fill();

            // Row 1: Orange Carrots
            [-12, -4, 4].forEach(x => {
              ctx.fillStyle = '#ea580c';
              ctx.beginPath();
              ctx.ellipse(cx + x, cy + 6, 2.8, 1.8, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#16a34a';
              ctx.beginPath();
              ctx.arc(cx + x, cy + 3, 3, 0, Math.PI * 2);
              ctx.fill();
            });

            // Row 2: Climbing Tomatoes on Stakes
            [-10, 0, 10].forEach(tx => {
              ctx.fillStyle = '#78350f';
              ctx.fillRect(cx + tx - 0.8, cy - 14, 1.6, 14);
              ctx.fillStyle = '#ef4444';
              ctx.beginPath();
              ctx.arc(cx + tx - 2, cy - 8, 3, 0, Math.PI * 2);
              ctx.arc(cx + tx + 2, cy - 5, 2.8, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#22c55e';
              ctx.beginPath();
              ctx.arc(cx + tx, cy - 11, 2, 0, Math.PI * 2);
              ctx.fill();
            });

            // Row 3: Lettuce heads
            [-14, -6, 2, 10].forEach(lx => {
              ctx.fillStyle = '#84cc16';
              ctx.beginPath();
              ctx.arc(cx + lx, cy - 6, 3.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#65a30d';
              ctx.beginPath();
              ctx.arc(cx + lx, cy - 6, 1.8, 0, Math.PI * 2);
              ctx.fill();
            });

            // Blue Watering can
            ctx.fillStyle = '#0284c7';
            ctx.beginPath();
            ctx.roundRect(cx + 16, cy + 3, 6, 5, 1.5);
            ctx.fill();
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx + 19, cy + 3);
            ctx.lineTo(cx + 24, cy + 1);
            ctx.stroke();
          } else {
            // Level 3: Organic Farmstead, Pergola Trellis, Giant Pumpkins, Bushel Baskets
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(cx, cy - 13);
            ctx.lineTo(cx + 28, cy + 1);
            ctx.lineTo(cx, cy + 15);
            ctx.lineTo(cx - 28, cy + 1);
            ctx.closePath();
            ctx.stroke();

            // Wooden Pergola / Arbor overhead
            ctx.fillStyle = '#78350f';
            ctx.fillRect(cx - 20, cy - 24, 3, 24);
            ctx.fillRect(cx + 17, cy - 24, 3, 24);
            ctx.fillRect(cx - 22, cy - 26, 44, 3);
            // Grapevines on arbor
            ctx.fillStyle = '#15803d';
            for (let gx = -18; gx <= 18; gx += 6) {
              ctx.beginPath();
              ctx.arc(cx + gx, cy - 25, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }
            // Hanging purple grape cluster
            ctx.fillStyle = '#9333ea';
            ctx.beginPath();
            ctx.arc(cx - 8, cy - 21, 2.2, 0, Math.PI * 2);
            ctx.arc(cx - 6, cy - 21, 2.2, 0, Math.PI * 2);
            ctx.arc(cx - 7, cy - 19, 2, 0, Math.PI * 2);
            ctx.fill();

            // Hanging warm lantern from arbor post
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(cx + 18, cy - 18, 3, 0, Math.PI * 2);
            ctx.fill();

            // Giant Golden Pumpkins on straw
            const pumpkins = [
              { x: -10, y: 3, r: 6.5 },
              { x: 2, y: 6, r: 7.5 },
              { x: 12, y: 1, r: 5.5 }
            ];
            pumpkins.forEach(pk => {
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.ellipse(cx + pk.x, cy + pk.y + 2, pk.r * 1.3, pk.r * 0.6, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#ea580c';
              ctx.beginPath();
              ctx.arc(cx + pk.x, cy + pk.y, pk.r, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#f97316';
              ctx.beginPath();
              ctx.ellipse(cx + pk.x, cy + pk.y, pk.r * 0.6, pk.r, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#15803d';
              ctx.fillRect(cx + pk.x - 0.8, cy + pk.y - pk.r - 2, 1.6, 3);
            });

            // Bushel Basket overflowing with carrots and tomatoes
            ctx.fillStyle = '#a16207';
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy);
            ctx.lineTo(cx - 13, cy);
            ctx.lineTo(cx - 14, cy + 6);
            ctx.lineTo(cx - 19, cy + 6);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(cx - 17, cy, 2.5, 0, Math.PI * 2);
            ctx.arc(cx - 14, cy - 1, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Floating Produce Harvest Badge paused per user direction to focus on building
          ctx.restore();
          break;
        }

        case 'farm': {
          ctx.save();
          const lvl = objData?.level || 1;
          const produce = objData?.readyProduce || 0;

          // Soft ground contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.38)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 8, 32, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          if (lvl === 1) {
            // Level 1: Cozy red rustic barn and hay bales
            // Barn Walls
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy - 6);
            ctx.lineTo(cx, cy + 6);
            ctx.lineTo(cx, cy - 24);
            ctx.lineTo(cx - 20, cy - 36);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#991b1b';
            ctx.beginPath();
            ctx.moveTo(cx, cy + 6);
            ctx.lineTo(cx + 20, cy - 6);
            ctx.lineTo(cx + 20, cy - 36);
            ctx.lineTo(cx, cy - 24);
            ctx.closePath();
            ctx.fill();

            // White wooden cross-timbers on door
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(cx - 12, cy - 14, 8, 12);
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy - 14);
            ctx.lineTo(cx - 4, cy - 2);
            ctx.moveTo(cx - 4, cy - 14);
            ctx.lineTo(cx - 12, cy - 2);
            ctx.stroke();

            // Thatched straw roof with overhang eaves
            ctx.fillStyle = '#d97706';
            ctx.beginPath();
            ctx.moveTo(cx, cy - 44);
            ctx.lineTo(cx + 24, cy - 32);
            ctx.lineTo(cx, cy - 20);
            ctx.lineTo(cx - 24, cy - 32);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.moveTo(cx, cy - 44);
            ctx.lineTo(cx, cy - 20);
            ctx.lineTo(cx - 24, cy - 32);
            ctx.closePath();
            ctx.fill();

            // Golden Hay bales stacked outside
            const hayBales = [
              { x: 12, y: 3 }, { x: 18, y: -1 }, { x: 15, y: -5 }
            ];
            hayBales.forEach(h => {
              ctx.fillStyle = '#fef08a';
              ctx.beginPath();
              ctx.roundRect(cx + h.x - 4, cy + h.y - 3, 8, 6, 2);
              ctx.fill();
              ctx.strokeStyle = '#ca8a04';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            });
          } else if (lvl === 2) {
            // Level 2: Active flour mill with rotating wooden windmill sails
            // Stone silo on left
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(cx - 22, cy);
            ctx.lineTo(cx - 12, cy + 6);
            ctx.lineTo(cx - 12, cy - 26);
            ctx.lineTo(cx - 22, cy - 32);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(cx - 17, cy - 40);
            ctx.lineTo(cx - 11, cy - 26);
            ctx.lineTo(cx - 23, cy - 32);
            ctx.closePath();
            ctx.fill();

            // Main Mill House Body
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy + 4);
            ctx.lineTo(cx + 16, cy - 10);
            ctx.lineTo(cx + 16, cy - 38);
            ctx.lineTo(cx - 12, cy - 24);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.moveTo(cx + 2, cy - 48);
            ctx.lineTo(cx + 18, cy - 38);
            ctx.lineTo(cx - 14, cy - 24);
            ctx.closePath();
            ctx.fill();

            // Chimney with gentle puffs of white smoke
            ctx.fillStyle = '#475569';
            ctx.fillRect(cx + 8, cy - 46, 4, 10);
            const sPhase = (Date.now() / 600) % (Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.beginPath();
            ctx.arc(cx + 10 + Math.sin(sPhase) * 2, cy - 48 - (sPhase * 3), 2.5, 0, Math.PI * 2);
            ctx.arc(cx + 11 + Math.sin(sPhase + 1) * 3, cy - 54 - (sPhase * 4), 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Rotating 4-bladed windmill sail on the mill gable
            const sailCenter = { x: cx + 2, y: cy - 28 };
            const rotAngle = (Date.now() / 1400);
            ctx.save();
            ctx.translate(sailCenter.x, sailCenter.y);
            ctx.rotate(rotAngle);

            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.fillStyle = '#78350f';
              ctx.fillRect(-1, 0, 2, 22);
              ctx.fillStyle = 'rgba(254, 243, 199, 0.88)';
              ctx.fillRect(1, 4, 6, 16);
              ctx.strokeStyle = '#92400e';
              ctx.lineWidth = 0.6;
              ctx.strokeRect(1, 4, 6, 16);
            }
            ctx.restore();

            // White flour sacks on wooden pallet
            ctx.fillStyle = '#f8fafc';
            ctx.beginPath();
            ctx.ellipse(cx - 2, cy + 6, 4, 3, 0, 0, Math.PI * 2);
            ctx.ellipse(cx + 3, cy + 5, 4.5, 3, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Level 3: Grand Octagonal Stone Dutch Windmill & Manor
            const towerBase = cy + 2;
            const towerTop = cy - 42;
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(cx - 18, towerBase - 6);
            ctx.lineTo(cx, towerBase + 6);
            ctx.lineTo(cx + 18, towerBase - 6);
            ctx.lineTo(cx + 12, towerTop);
            ctx.lineTo(cx - 12, towerTop);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(cx - 18, towerBase - 6);
            ctx.lineTo(cx, towerBase + 6);
            ctx.lineTo(cx, towerTop + 2);
            ctx.lineTo(cx - 12, towerTop);
            ctx.closePath();
            ctx.fill();

            // Conical copper-green cupola cap
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.moveTo(cx, towerTop - 14);
            ctx.lineTo(cx + 14, towerTop);
            ctx.lineTo(cx - 14, towerTop);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(cx, towerTop - 14, 2, 0, Math.PI * 2);
            ctx.fill();

            // Grand 4-bladed Lattice Sails
            const rotAngle = (Date.now() / 1200);
            ctx.save();
            ctx.translate(cx, towerTop - 2);
            ctx.rotate(rotAngle);
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
            ctx.fill();

            for (let i = 0; i < 4; i++) {
              ctx.rotate(Math.PI / 2);
              ctx.fillStyle = '#78350f';
              ctx.fillRect(-1.2, 0, 2.4, 28);
              ctx.fillStyle = 'rgba(255, 251, 235, 0.9)';
              ctx.fillRect(1.5, 5, 8, 21);
              ctx.strokeStyle = '#b45309';
              ctx.lineWidth = 0.7;
              ctx.strokeRect(1.5, 5, 8, 21);
            }
            ctx.restore();

            // Warm Glowing Windows in tower
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.roundRect(cx - 4, cy - 20, 8, 6, 2);
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Harvest wagon with wooden wheels & golden wheat sheaves
            ctx.fillStyle = '#92400e';
            ctx.fillRect(cx - 24, cy, 14, 6);
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cx - 22, cy + 6, 3.5, 0, Math.PI * 2);
            ctx.arc(cx - 12, cy + 6, 3.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(cx - 17, cy - 2, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Floating Harvest Produce Badge paused per user direction to focus on building
          ctx.restore();
          break;
        }

        case 'crystal_mine': {
          ctx.save();
          const lvl = objData?.level || 1;
          const produce = objData?.readyProduce || 0;

          // Rocky contact shadow
          ctx.fillStyle = 'rgba(10, 20, 15, 0.42)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 8, 30, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          // Mountain Rock Mound base
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(cx - 26, cy + 4);
          ctx.lineTo(cx - 18, cy - 24);
          ctx.lineTo(cx, cy - 36);
          ctx.lineTo(cx + 20, cy - 24);
          ctx.lineTo(cx + 26, cy + 4);
          ctx.lineTo(cx, cy + 12);
          ctx.closePath();
          ctx.fill();

          // Sunlit rock facet on left
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.moveTo(cx - 26, cy + 4);
          ctx.lineTo(cx - 18, cy - 24);
          ctx.lineTo(cx, cy - 36);
          ctx.lineTo(cx, cy + 12);
          ctx.closePath();
          ctx.fill();

          // Dark Cavern Mine Shaft Entrance
          ctx.fillStyle = '#020617';
          ctx.beginPath();
          ctx.moveTo(cx - 12, cy + 6);
          ctx.lineTo(cx - 12, cy - 14);
          ctx.quadraticCurveTo(cx, cy - 22, cx + 12, cy - 14);
          ctx.lineTo(cx + 12, cy + 6);
          ctx.closePath();
          ctx.fill();

          if (lvl === 1) {
            // Level 1: Heavy Timber Frame Portal, Hanging Lantern, and Ruby Crystals
            ctx.fillStyle = '#78350f';
            ctx.fillRect(cx - 13, cy - 16, 3, 20);
            ctx.fillRect(cx + 10, cy - 16, 3, 20);
            ctx.fillRect(cx - 15, cy - 19, 30, 3.5);

            // Hanging Oil Lantern
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(cx, cy - 12, 3, 0, Math.PI * 2);
            ctx.fill();

            // Raw sparkling crystal chunks in ore pile on right
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(cx + 15, cy + 2);
            ctx.lineTo(cx + 18, cy - 3);
            ctx.lineTo(cx + 21, cy + 3);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(cx + 18, cy + 5);
            ctx.lineTo(cx + 21, cy + 1);
            ctx.lineTo(cx + 23, cy + 6);
            ctx.closePath();
            ctx.fill();

            // Iron pickaxe leaning against post
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(cx - 14, cy + 7);
            ctx.lineTo(cx - 7, cy - 6);
            ctx.stroke();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(cx - 7, cy - 6, 3.5, Math.PI, Math.PI * 2);
            ctx.fill();
          } else if (lvl === 2) {
            // Level 2: Iron reinforced portal, mine rail tracks & loaded ore cart
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(cx - 14, cy - 18, 3.5, 24);
            ctx.fillRect(cx + 10.5, cy - 18, 3.5, 24);
            ctx.fillRect(cx - 16, cy - 21, 32, 4);
            ctx.fillStyle = '#e2e8f0';
            for (let rx = -12; rx <= 12; rx += 6) {
              ctx.beginPath();
              ctx.arc(cx + rx, cy - 19, 1, 0, Math.PI * 2);
              ctx.fill();
            }

            // Wooden mine rail tracks coming out of cave
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy - 8);
            ctx.lineTo(cx - 14, cy + 12);
            ctx.moveTo(cx + 6, cy - 8);
            ctx.lineTo(cx - 2, cy + 12);
            ctx.stroke();
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 1.2;
            for (let t = -4; t <= 10; t += 4) {
              ctx.beginPath();
              ctx.moveTo(cx - 6 + t * 0.8 - 4, cy + t);
              ctx.lineTo(cx - 6 + t * 0.8 + 4, cy + t);
              ctx.stroke();
            }

            // Metal Mine Cart filled with glowing crystals
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.roundRect(cx - 18, cy + 1, 14, 8, 2);
            ctx.fill();
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Wheels
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(cx - 15, cy + 9, 2.5, 0, Math.PI * 2);
            ctx.arc(cx - 7, cy + 9, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Glowing crystals inside cart
            ctx.fillStyle = '#c084fc';
            ctx.beginPath();
            ctx.moveTo(cx - 16, cy + 2);
            ctx.lineTo(cx - 13, cy - 3);
            ctx.lineTo(cx - 11, cy + 2);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.moveTo(cx - 12, cy + 2);
            ctx.lineTo(cx - 9, cy - 4);
            ctx.lineTo(cx - 6, cy + 2);
            ctx.closePath();
            ctx.fill();
          } else {
            // Level 3: Grand Dwarven Stone Gateway, Pulsing Geodes, Elevator Hoist
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(cx - 16, cy + 6);
            ctx.lineTo(cx - 16, cy - 24);
            ctx.quadraticCurveTo(cx, cy - 32, cx + 16, cy - 24);
            ctx.lineTo(cx + 16, cy + 6);
            ctx.closePath();
            ctx.stroke();

            // Elevator Hoist Tower on top of cave
            ctx.fillStyle = '#78350f';
            ctx.fillRect(cx - 8, cy - 42, 2.5, 14);
            ctx.fillRect(cx + 5.5, cy - 42, 2.5, 14);
            ctx.fillRect(cx - 10, cy - 44, 20, 3);
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(cx, cy - 38, 4, 0, Math.PI * 2);
            ctx.stroke();

            // Massive Prismatic Geodes flanking the portal (Emissive Pulsing Glow)
            const cGlow = Math.sin(Date.now() / 280) * 0.2 + 0.8;
            ctx.fillStyle = `rgba(192, 132, 252, ${cGlow})`;
            ctx.beginPath();
            ctx.moveTo(cx - 20, cy + 4);
            ctx.lineTo(cx - 16, cy - 8);
            ctx.lineTo(cx - 12, cy + 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = `rgba(236, 72, 153, ${cGlow})`;
            ctx.beginPath();
            ctx.moveTo(cx - 23, cy + 4);
            ctx.lineTo(cx - 20, cy - 3);
            ctx.lineTo(cx - 17, cy + 4);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = `rgba(56, 189, 248, ${cGlow})`;
            ctx.beginPath();
            ctx.moveTo(cx + 12, cy + 4);
            ctx.lineTo(cx + 16, cy - 10);
            ctx.lineTo(cx + 20, cy + 4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = `rgba(52, 211, 153, ${cGlow})`;
            ctx.beginPath();
            ctx.moveTo(cx + 17, cy + 4);
            ctx.lineTo(cx + 21, cy - 4);
            ctx.lineTo(cx + 25, cy + 4);
            ctx.closePath();
            ctx.fill();

            // Gold nuggets & diamond cart
            ctx.fillStyle = '#f59e0b';
            ctx.beginPath();
            ctx.arc(cx - 4, cy + 3, 3, 0, Math.PI * 2);
            ctx.arc(cx + 3, cy + 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Floating Crystal Produce Harvest Badge paused per user direction to focus on building
          ctx.restore();
          break;
        }

        case 'bakery': {
          ctx.save();
          // Contact ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.42)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 12, 38, 18, 0, 0, Math.PI * 2);
          ctx.fill();

          // Foundation stone plinth
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(cx - 26, cy + 4);
          ctx.lineTo(cx, cy + 16);
          ctx.lineTo(cx + 26, cy + 4);
          ctx.lineTo(cx + 26, cy);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 26, cy);
          ctx.closePath();
          ctx.fill();

          // Warm bakery walls: Left lit cream stucco, Right warm shaded terracotta
          const bLit = ctx.createLinearGradient(cx - 25, cy, cx, cy);
          bLit.addColorStop(0, '#fef3c7');
          bLit.addColorStop(1, '#fde68a');
          ctx.fillStyle = bLit;
          ctx.beginPath();
          ctx.moveTo(cx - 25, cy + 1);
          ctx.lineTo(cx, cy + 13);
          ctx.lineTo(cx, cy - 25);
          ctx.lineTo(cx - 25, cy - 37);
          ctx.closePath();
          ctx.fill();

          const bShadow = ctx.createLinearGradient(cx, cy, cx + 25, cy);
          bShadow.addColorStop(0, '#fed7aa');
          bShadow.addColorStop(1, '#ea580c');
          ctx.fillStyle = bShadow;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 13);
          ctx.lineTo(cx + 25, cy + 1);
          ctx.lineTo(cx + 25, cy - 37);
          ctx.lineTo(cx, cy - 25);
          ctx.closePath();
          ctx.fill();

          // Bakery door with arched wooden frame
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx - 8, cy - 14, 7, 18);
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 5, 1.2, 0, Math.PI * 2);
          ctx.fill();

          // Front bakery display counter with striped awning
          // Window with warm orange bakehouse glow
          const bakeGlow = ctx.createRadialGradient(cx + 12, cy - 8, 1, cx + 12, cy - 8, 8);
          bakeGlow.addColorStop(0, '#fef08a');
          bakeGlow.addColorStop(0.7, '#f97316');
          bakeGlow.addColorStop(1, '#c2410c');
          ctx.fillStyle = bakeGlow;
          ctx.fillRect(cx + 7, cy - 14, 12, 10);

          // Striped awning (red & white scallops)
          for (let ai = 0; ai < 4; ai++) {
            ctx.fillStyle = ai % 2 === 0 ? '#ef4444' : '#ffffff';
            ctx.beginPath();
            ctx.moveTo(cx + 6 + ai * 3.5, cy - 16);
            ctx.lineTo(cx + 9.5 + ai * 3.5, cy - 16);
            ctx.lineTo(cx + 9.5 + ai * 3.5, cy - 11);
            ctx.lineTo(cx + 6 + ai * 3.5, cy - 11);
            ctx.closePath();
            ctx.fill();
          }

          // Fresh baguettes & croissants in wooden bread box
          ctx.fillStyle = '#92400e';
          ctx.fillRect(cx + 6, cy - 4, 14, 4);
          ctx.fillStyle = '#d97706';
          // 2 Baguettes
          ctx.beginPath();
          ctx.ellipse(cx + 10, cy - 5, 3.5, 1.4, -0.4, 0, Math.PI * 2);
          ctx.ellipse(cx + 15, cy - 5, 3, 1.4, -0.3, 0, Math.PI * 2);
          ctx.fill();

          // Roof: Steep curved terracotta shingles
          const bRoofLeft = ctx.createLinearGradient(cx - 34, cy - 26, cx, cy - 52);
          bRoofLeft.addColorStop(0, '#f97316');
          bRoofLeft.addColorStop(0.6, '#ea580c');
          bRoofLeft.addColorStop(1, '#c2410c');
          ctx.fillStyle = bRoofLeft;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.quadraticCurveTo(cx - 16, cy - 46, cx - 34, cy - 24);
          ctx.quadraticCurveTo(cx - 16, cy - 13, cx, cy - 4);
          ctx.closePath();
          ctx.fill();

          const bRoofRight = ctx.createLinearGradient(cx, cy - 52, cx + 34, cy - 26);
          bRoofRight.addColorStop(0, '#c2410c');
          bRoofRight.addColorStop(0.7, '#9a3412');
          bRoofRight.addColorStop(1, '#7c2d12');
          ctx.fillStyle = bRoofRight;
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.quadraticCurveTo(cx + 16, cy - 46, cx + 34, cy - 24);
          ctx.quadraticCurveTo(cx + 16, cy - 13, cx, cy - 4);
          ctx.closePath();
          ctx.fill();

          // Chimney with bread baking smoke
          ctx.fillStyle = '#64748b';
          ctx.fillRect(cx - 16, cy - 58, 8, 16);
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - 18, cy - 60, 12, 3);

          const bSmokeTime = Date.now() * 0.0035;
          for (let s = 0; s < 3; s++) {
            const sPhase = (bSmokeTime + s * 1.3) % 3.6;
            const sY = cy - 64 - sPhase * 9;
            const sX = cx - 12 + Math.sin(sPhase * 1.6) * 4 + sPhase * 2;
            const sR = 3.2 + sPhase * 2.2;
            const sAlpha = Math.max(0, 0.5 - sPhase * 0.13);
            ctx.fillStyle = `rgba(254, 243, 199, ${sAlpha})`;
            ctx.beginPath();
            ctx.arc(sX, sY, sR, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          break;
        }

        case 'windmill': {
          ctx.save();
          // Contact ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.4)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 10, 36, 17, 0, 0, Math.PI * 2);
          ctx.fill();

          // Octagonal tapering stone windmill tower
          // Lit left flank
          const wmWallLit = ctx.createLinearGradient(cx - 20, cy, cx, cy);
          wmWallLit.addColorStop(0, '#cbd5e1');
          wmWallLit.addColorStop(1, '#f1f5f9');
          ctx.fillStyle = wmWallLit;
          ctx.beginPath();
          ctx.moveTo(cx - 18, cy + 6);
          ctx.lineTo(cx, cy + 14);
          ctx.lineTo(cx, cy - 36);
          ctx.lineTo(cx - 13, cy - 32);
          ctx.closePath();
          ctx.fill();

          // Shaded right flank
          const wmWallDark = ctx.createLinearGradient(cx, cy, cx + 20, cy);
          wmWallDark.addColorStop(0, '#94a3b8');
          wmWallDark.addColorStop(1, '#64748b');
          ctx.fillStyle = wmWallDark;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 14);
          ctx.lineTo(cx + 18, cy + 6);
          ctx.lineTo(cx + 13, cy - 32);
          ctx.lineTo(cx, cy - 36);
          ctx.closePath();
          ctx.fill();

          // Door & base detail
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(cx - 7, cy + 4, 3, Math.PI, 0);
          ctx.rect(cx - 10, cy + 4, 6, 8);
          ctx.fill();

          // Thatched / timber conical cap
          ctx.fillStyle = '#78350f';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 48);
          ctx.lineTo(cx + 15, cy - 32);
          ctx.lineTo(cx - 15, cy - 32);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#92400e';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 48);
          ctx.lineTo(cx + 15, cy - 32);
          ctx.lineTo(cx - 15, cy - 32);
          ctx.closePath();
          ctx.fill();

          // Rotating 4 windmill sails (smooth animation!)
          const hubX = cx;
          const hubY = cy - 38;
          const sailAngle = Date.now() * 0.0012;

          ctx.save();
          ctx.translate(hubX, hubY);
          ctx.rotate(sailAngle);

          // Central axle hub
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();

          for (let b = 0; b < 4; b++) {
            ctx.save();
            ctx.rotate((b * Math.PI) / 2);

            // Wood beam
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-1.5, 0, 3, 34);

            // Canvas sail lattice
            ctx.fillStyle = 'rgba(254, 252, 232, 0.85)';
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.rect(1.5, 8, 9, 24);
            ctx.fill();
            ctx.stroke();

            // Lattice cross lines
            for (let li = 14; li < 32; li += 6) {
              ctx.beginPath();
              ctx.moveTo(1.5, li);
              ctx.lineTo(10.5, li);
              ctx.stroke();
            }

            ctx.restore();
          }

          // Hub brass cap
          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();

          // Sack of wheat leaning against mill
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.ellipse(cx + 12, cy + 8, 4.5, 5.5, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(cx + 13, cy + 4, 1.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        case 'art_studio': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.4)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 12, 38, 17, 0, 0, Math.PI * 2);
          ctx.fill();

          // Studio Timber Cabin with stone base
          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.moveTo(cx - 25, cy + 4);
          ctx.lineTo(cx, cy + 16);
          ctx.lineTo(cx + 25, cy + 4);
          ctx.lineTo(cx + 25, cy);
          ctx.lineTo(cx, cy + 12);
          ctx.lineTo(cx - 25, cy);
          ctx.closePath();
          ctx.fill();

          // Left Wall (warm cedar timber)
          const asLit = ctx.createLinearGradient(cx - 24, cy, cx, cy);
          asLit.addColorStop(0, '#c2410c');
          asLit.addColorStop(1, '#ea580c');
          ctx.fillStyle = asLit;
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy + 1);
          ctx.lineTo(cx, cy + 13);
          ctx.lineTo(cx, cy - 25);
          ctx.lineTo(cx - 24, cy - 37);
          ctx.closePath();
          ctx.fill();

          // Right Wall with Panoramic Glass Window
          ctx.fillStyle = '#7c2d12';
          ctx.beginPath();
          ctx.moveTo(cx, cy + 13);
          ctx.lineTo(cx + 24, cy + 1);
          ctx.lineTo(cx + 24, cy - 37);
          ctx.lineTo(cx, cy - 25);
          ctx.closePath();
          ctx.fill();

          // Panoramic studio window with golden easel light
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(cx + 6, cy - 14, 13, 10);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx + 6, cy - 14, 13, 10);
          ctx.beginPath();
          ctx.moveTo(cx + 12.5, cy - 14);
          ctx.lineTo(cx + 12.5, cy - 4);
          ctx.stroke();

          // Roof with Glass Skylight
          ctx.fillStyle = '#0f766e';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 54);
          ctx.lineTo(cx + 32, cy - 22);
          ctx.lineTo(cx, cy - 6);
          ctx.lineTo(cx - 32, cy - 22);
          ctx.closePath();
          ctx.fill();

          // Skylight glass on left roof
          ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
          ctx.beginPath();
          ctx.moveTo(cx - 6, cy - 42);
          ctx.lineTo(cx - 20, cy - 28);
          ctx.lineTo(cx - 10, cy - 22);
          ctx.lineTo(cx + 2, cy - 35);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Artist Easel on the front left terrace
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          // Tripod legs
          ctx.moveTo(cx - 14, cy + 11);
          ctx.lineTo(cx - 8, cy - 4);
          ctx.moveTo(cx - 6, cy + 11);
          ctx.lineTo(cx - 8, cy - 4);
          ctx.stroke();

          // Canvas on easel (sunset painting!)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx - 12, cy - 3, 9, 8);
          ctx.fillStyle = '#f97316';
          ctx.fillRect(cx - 11, cy - 2, 7, 3);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(cx - 11, cy + 1, 7, 3);

          // Painter's palette
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.ellipse(cx - 2, cy + 9, 3.5, 2.5, 0.3, 0, Math.PI * 2);
          ctx.fill();
          // Paint dabs
          const dabs = ['#ef4444', '#3b82f6', '#eab308'];
          dabs.forEach((dc, di) => {
            ctx.fillStyle = dc;
            ctx.beginPath();
            ctx.arc(cx - 3 + di * 1.8, cy + 8.5, 0.8, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'sakura_tree': {
          ctx.save();
          // Ground contact shadow with fallen pink blossom petals
          ctx.fillStyle = 'rgba(15, 30, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 8, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Scattered fallen pink petals on the ground
          const fallenPetals = [
            { x: -14, y: 5 }, { x: -6, y: 9 }, { x: 8, y: 7 }, { x: 16, y: 4 }, { x: 0, y: 11 }
          ];
          ctx.fillStyle = '#f472b6';
          fallenPetals.forEach(fp => {
            ctx.beginPath();
            ctx.ellipse(cx + fp.x, cy + fp.y, 2, 1.2, 0.4, 0, Math.PI * 2);
            ctx.fill();
          });

          // Elegant dark cherry trunk & gnarled branches
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy + 6);
          ctx.quadraticCurveTo(cx - 1, cy - 6, cx - 3, cy - 18);
          ctx.quadraticCurveTo(cx + 2, cy - 6, cx + 4, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Outreaching branches
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(cx - 2, cy - 14);
          ctx.quadraticCurveTo(cx - 12, cy - 22, cx - 18, cy - 26);
          ctx.moveTo(cx, cy - 14);
          ctx.quadraticCurveTo(cx + 10, cy - 20, cx + 18, cy - 24);
          ctx.stroke();

          // 3-Tier Billowy Blossom Canopy (Dreamy Pink Puffs)
          // 1. Back shadow blossom tier
          ctx.fillStyle = '#db2777';
          ctx.beginPath();
          ctx.arc(cx - 15, cy - 28, 14, 0, Math.PI * 2);
          ctx.arc(cx + 15, cy - 26, 15, 0, Math.PI * 2);
          ctx.arc(cx, cy - 38, 16, 0, Math.PI * 2);
          ctx.fill();

          // 2. Mid vibrant soft pink blossom tier
          ctx.fillStyle = '#f472b6';
          ctx.beginPath();
          ctx.arc(cx - 14, cy - 30, 13, 0, Math.PI * 2);
          ctx.arc(cx + 14, cy - 28, 14, 0, Math.PI * 2);
          ctx.arc(cx, cy - 40, 15, 0, Math.PI * 2);
          ctx.arc(cx - 6, cy - 36, 14, 0, Math.PI * 2);
          ctx.arc(cx + 6, cy - 34, 13, 0, Math.PI * 2);
          ctx.fill();

          // 3. Highlight top pastel blossom puff
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.arc(cx - 10, cy - 34, 9, 0, Math.PI * 2);
          ctx.arc(cx + 10, cy - 32, 10, 0, Math.PI * 2);
          ctx.arc(cx, cy - 44, 11, 0, Math.PI * 2);
          ctx.arc(cx - 2, cy - 40, 8, 0, Math.PI * 2);
          ctx.fill();

          // Sunlit edge highlights
          ctx.fillStyle = '#fdf2f8';
          ctx.beginPath();
          ctx.arc(cx - 4, cy - 46, 5, 0, Math.PI * 2);
          ctx.arc(cx - 12, cy - 37, 4, 0, Math.PI * 2);
          ctx.fill();

          // Animated falling blossom petals drifting in the breeze
          const pTime = Date.now() * 0.0022;
          for (let pi = 0; pi < 4; pi++) {
            const pPhase = (pTime + pi * 1.5) % 4.0;
            const pX = cx - 18 + Math.sin(pPhase * 2 + pi) * 12 + pPhase * 6;
            const pY = cy - 42 + pPhase * 13;
            const pAlpha = Math.max(0, 0.85 - pPhase * 0.18);
            ctx.fillStyle = `rgba(244, 114, 182, ${pAlpha})`;
            ctx.beginPath();
            ctx.ellipse(pX, pY, 2.4, 1.3, pPhase * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          break;
        }

        case 'willow_tree': {
          ctx.save();
          // Ground contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 8, 28, 14, 0, 0, Math.PI * 2);
          ctx.fill();

          // Willow trunk
          ctx.fillStyle = '#522e11';
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy + 6);
          ctx.quadraticCurveTo(cx - 6, cy - 8, cx - 2, cy - 20);
          ctx.quadraticCurveTo(cx + 5, cy - 6, cx + 5, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Crown dome
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(cx, cy - 26, 17, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 29, 14, 0, Math.PI * 2);
          ctx.fill();

          // Long weeping vines cascading down
          const wind = Math.sin(Date.now() * 0.0018);
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          const vines = [-18, -12, -6, 0, 6, 12, 18];
          vines.forEach((vx, vi) => {
            const sway = wind * (2 + vi * 0.4);
            ctx.strokeStyle = vi % 2 === 0 ? '#65a30d' : '#84cc16';
            ctx.beginPath();
            ctx.moveTo(cx + vx, cy - 24);
            ctx.quadraticCurveTo(cx + vx + sway * 1.2, cy - 8, cx + vx + sway * 0.8, cy + 4);
            ctx.stroke();

            // Leaf tips
            ctx.fillStyle = '#a3e635';
            ctx.beginPath();
            ctx.arc(cx + vx + sway * 0.8, cy + 4, 1.6, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'sunflower_patch': {
          ctx.save();
          // Contact soil mound
          ctx.fillStyle = 'rgba(15, 30, 10, 0.28)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 5, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#452b14';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2, 19, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // 5 Sunflowers of different heights
          const sunflowers = [
            { x: -10, y: 0, h: 22, r: 6 },
            { x: -3, y: -3, h: 28, r: 7.5 },
            { x: 5, y: 1, h: 24, r: 6.5 },
            { x: 12, y: -2, h: 20, r: 5.5 },
            { x: 2, y: 4, h: 17, r: 5 }
          ];

          sunflowers.forEach(sf => {
            const headX = cx + sf.x;
            const headY = cy + sf.y - sf.h;

            // Green stalk
            ctx.strokeStyle = '#15803d';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(cx + sf.x, cy + sf.y);
            ctx.quadraticCurveTo(cx + sf.x - 2, cy + sf.y - sf.h * 0.5, headX, headY);
            ctx.stroke();

            // Broad leaves
            ctx.fillStyle = '#16a34a';
            ctx.beginPath();
            ctx.ellipse(cx + sf.x - 4, cy + sf.y - sf.h * 0.4, 4.5, 2, -0.4, 0, Math.PI * 2);
            ctx.ellipse(cx + sf.x + 4, cy + sf.y - sf.h * 0.6, 4, 1.8, 0.4, 0, Math.PI * 2);
            ctx.fill();

            // Radiating golden petals
            ctx.fillStyle = '#fde047';
            const numPetals = 10;
            for (let a = 0; a < Math.PI * 2; a += (Math.PI * 2) / numPetals) {
              const px = headX + Math.cos(a) * sf.r;
              const py = headY + Math.sin(a) * sf.r;
              ctx.beginPath();
              ctx.ellipse(px, py, sf.r * 0.45, sf.r * 0.25, a, 0, Math.PI * 2);
              ctx.fill();
            }

            // Brown seed center
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.arc(headX, headY, sf.r * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.arc(headX, headY, sf.r * 0.28, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'glow_mushrooms': {
          ctx.save();
          // Mossy stone base
          ctx.fillStyle = 'rgba(15, 30, 10, 0.3)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 20, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#334155';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 1, 16, 7.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.ellipse(cx - 3, cy, 12, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Bioluminescent aura
          const pulse = 0.45 + Math.sin(Date.now() * 0.003) * 0.25;
          const aura = ctx.createRadialGradient(cx, cy - 6, 1, cx, cy - 6, 22);
          aura.addColorStop(0, `rgba(56, 189, 248, ${pulse * 0.4})`);
          aura.addColorStop(0.6, `rgba(168, 85, 247, ${pulse * 0.25})`);
          aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = aura;
          ctx.beginPath();
          ctx.ellipse(cx, cy - 2, 28, 14, 0, 0, Math.PI * 2);
          ctx.fill();

          // 4 Glowing mushrooms
          const shrooms = [
            { x: -6, y: -2, h: 14, r: 6.5, col: '#38bdf8' },
            { x: 3, y: -5, h: 18, r: 8, col: '#c084fc' },
            { x: 8, y: 0, h: 11, r: 5, col: '#38bdf8' },
            { x: -1, y: 3, h: 9, r: 4.5, col: '#818cf8' }
          ];

          shrooms.forEach(sh => {
            const shX = cx + sh.x;
            const shY = cy + sh.y;

            // Pale stalk
            ctx.fillStyle = '#e0e7ff';
            ctx.fillRect(shX - 1.2, shY - sh.h, 2.4, sh.h);

            // Glowing Cap
            ctx.fillStyle = sh.col;
            ctx.beginPath();
            ctx.arc(shX, shY - sh.h, sh.r, Math.PI, 0);
            ctx.closePath();
            ctx.fill();

            // Glow dots
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(shX, shY - sh.h - sh.r * 0.4, 1.2, 0, Math.PI * 2);
            ctx.arc(shX - sh.r * 0.4, shY - sh.h - sh.r * 0.2, 1, 0, Math.PI * 2);
            ctx.arc(shX + sh.r * 0.4, shY - sh.h - sh.r * 0.2, 1, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'stone_bridge': {
          ctx.save();
          // River stream underneath bridge
          const sbWater = ctx.createLinearGradient(cx - 24, cy, cx + 24, cy);
          sbWater.addColorStop(0, '#0284c7');
          sbWater.addColorStop(0.5, '#38bdf8');
          sbWater.addColorStop(1, '#0284c7');
          ctx.fillStyle = sbWater;
          ctx.beginPath();
          ctx.ellipse(cx, cy + 4, 24, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Stone arch bridge body
          const sBridge = ctx.createLinearGradient(cx - 24, cy - 10, cx + 24, cy + 10);
          sBridge.addColorStop(0, '#cbd5e1');
          sBridge.addColorStop(0.5, '#94a3b8');
          sBridge.addColorStop(1, '#64748b');
          ctx.fillStyle = sBridge;

          ctx.beginPath();
          ctx.moveTo(cx - 22, cy - 8);
          ctx.quadraticCurveTo(cx, cy - 14, cx + 22, cy - 8);
          ctx.lineTo(cx + 22, cy + 6);
          ctx.quadraticCurveTo(cx, cy - 1, cx - 22, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Arch hole cutout under bridge
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(cx, cy + 3, 10, Math.PI, 0);
          ctx.fill();

          // Stone balustrade with relief pillars
          ctx.fillStyle = '#475569';
          for (let sp = -18; sp <= 18; sp += 6) {
            ctx.fillRect(cx + sp - 1, cy - 15 + Math.abs(sp) * 0.1, 2.2, 6);
          }
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(cx - 20, cy - 15);
          ctx.quadraticCurveTo(cx, cy - 19, cx + 20, cy - 15);
          ctx.stroke();

          // Ivy leaves climbing up the stonework
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(cx - 16, cy + 2, 2.2, 0, Math.PI * 2);
          ctx.arc(cx - 18, cy - 2, 2.5, 0, Math.PI * 2);
          ctx.arc(cx - 14, cy - 5, 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        case 'wood_path': {
          ctx.save();
          // Timber boardwalk slats across isometric tile
          const wTileGrad = ctx.createLinearGradient(sx - TILE_W / 2, sy, sx + TILE_W / 2, sy + TILE_H);
          wTileGrad.addColorStop(0, '#b45309');
          wTileGrad.addColorStop(0.5, '#d97706');
          wTileGrad.addColorStop(1, '#92400e');

          ctx.fillStyle = wTileGrad;
          ctx.beginPath();
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx + TILE_W / 2 - 2, sy + TILE_H / 2);
          ctx.lineTo(sx, sy + TILE_H - 2);
          ctx.lineTo(sx - TILE_W / 2 + 2, sy + TILE_H / 2);
          ctx.closePath();
          ctx.fill();

          // Planks division lines & nail accents
          ctx.strokeStyle = 'rgba(69, 26, 3, 0.85)';
          ctx.lineWidth = 1.2;
          for (let o = -16; o <= 16; o += 7) {
            ctx.beginPath();
            ctx.moveTo(cx + o - 8, cy - 4 + o * 0.35);
            ctx.lineTo(cx + o + 8, cy + 4 + o * 0.35);
            ctx.stroke();

            // Nail head
            ctx.fillStyle = '#451a03';
            ctx.beginPath();
            ctx.arc(cx + o - 6, cy - 3 + o * 0.35, 0.9, 0, Math.PI * 2);
            ctx.arc(cx + o + 6, cy + 3 + o * 0.35, 0.9, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
          break;
        }

        case 'brick_path': {
          ctx.save();
          // Red terracotta cobblestones / herringbone bricks
          const bpGrad = ctx.createLinearGradient(sx - TILE_W / 2, sy, sx + TILE_W / 2, sy + TILE_H);
          bpGrad.addColorStop(0, '#dc2626');
          bpGrad.addColorStop(0.5, '#b91c1c');
          bpGrad.addColorStop(1, '#991b1b');

          ctx.fillStyle = bpGrad;
          ctx.beginPath();
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx + TILE_W / 2 - 2, sy + TILE_H / 2);
          ctx.lineTo(sx, sy + TILE_H - 2);
          ctx.lineTo(sx - TILE_W / 2 + 2, sy + TILE_H / 2);
          ctx.closePath();
          ctx.fill();

          // Sandy mortar grid
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
          ctx.lineWidth = 1;
          for (let bi = -14; bi <= 14; bi += 6) {
            ctx.beginPath();
            ctx.moveTo(cx + bi - 7, cy - 3 + bi * 0.3);
            ctx.lineTo(cx + bi + 7, cy + 3 + bi * 0.3);
            ctx.stroke();
          }

          ctx.restore();
          break;
        }

        case 'wooden_fence': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.28)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 5, 20, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Two round corner posts
          const fPosts = [-14, 14];
          fPosts.forEach(fx => {
            ctx.fillStyle = '#451a03';
            ctx.fillRect(cx + fx - 2, cy - 14, 4, 18);
            ctx.fillStyle = '#b45309';
            ctx.fillRect(cx + fx - 2, cy - 14, 2.5, 18);
            // Post pointed cap
            ctx.beginPath();
            ctx.moveTo(cx + fx - 2, cy - 14);
            ctx.lineTo(cx + fx, cy - 17);
            ctx.lineTo(cx + fx + 2, cy - 14);
            ctx.closePath();
            ctx.fill();
          });

          // Horizontal rails
          ctx.fillStyle = '#92400e';
          ctx.fillRect(cx - 15, cy - 10, 30, 2.5);
          ctx.fillRect(cx - 15, cy - 3, 30, 2.5);

          // Pickets
          [-6, 0, 6].forEach(px => {
            ctx.fillStyle = '#78350f';
            ctx.fillRect(cx + px - 1.5, cy - 13, 3, 16);
            ctx.fillStyle = '#d97706';
            ctx.fillRect(cx + px - 1.5, cy - 13, 1.8, 16);
            ctx.beginPath();
            ctx.moveTo(cx + px - 1.5, cy - 13);
            ctx.lineTo(cx + px, cy - 15.5);
            ctx.lineTo(cx + px + 1.5, cy - 13);
            ctx.closePath();
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'floral_arch': {
          ctx.save();
          // Contact shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 24, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wooden arched trellis structure
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - 14, cy + 4);
          ctx.lineTo(cx - 14, cy - 18);
          ctx.quadraticCurveTo(cx, cy - 32, cx + 14, cy - 18);
          ctx.lineTo(cx + 14, cy + 4);
          ctx.stroke();

          // Trellis cross rungs
          ctx.lineWidth = 1.2;
          for (let ry = -14; ry <= 0; ry += 5) {
            ctx.beginPath();
            ctx.moveTo(cx - 15.5, cy + ry);
            ctx.lineTo(cx - 12.5, cy + ry);
            ctx.moveTo(cx + 12.5, cy + ry);
            ctx.lineTo(cx + 15.5, cy + ry);
            ctx.stroke();
          }

          // Dense climbing foliage leaves
          ctx.fillStyle = '#15803d';
          for (let a = 0; a <= Math.PI; a += Math.PI / 10) {
            const lx = cx - Math.cos(a) * 14;
            const ly = cy - 18 - Math.sin(a) * 12;
            ctx.beginPath();
            ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Blooming Roses (crimson & soft pink)
          const roses = [
            { x: -14, y: cy - 4, col: '#f43f5e' },
            { x: -14, y: cy - 12, col: '#f472b6' },
            { x: -11, y: cy - 22, col: '#f43f5e' },
            { x: -4, y: cy - 28, col: '#fbcfe8' },
            { x: 4, y: cy - 28, col: '#f43f5e' },
            { x: 11, y: cy - 22, col: '#f472b6' },
            { x: 14, y: cy - 12, col: '#f43f5e' },
            { x: 14, y: cy - 4, col: '#fbcfe8' }
          ];

          roses.forEach(r => {
            ctx.fillStyle = r.col;
            ctx.beginPath();
            ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(r.x - 0.5, r.y - 0.5, 1, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'picnic_blanket': {
          ctx.save();
          // Soft ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx + 2, cy + 6, 26, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Red and white checkered picnic blanket
          ctx.save();
          ctx.translate(cx, cy + 2);
          // Diamond blanket base
          ctx.beginPath();
          ctx.moveTo(0, -11);
          ctx.lineTo(22, 0);
          ctx.lineTo(0, 11);
          ctx.lineTo(-22, 0);
          ctx.closePath();
          ctx.fillStyle = '#fee2e2';
          ctx.fill();

          // Checkered red pattern
          ctx.clip();
          ctx.fillStyle = '#ef4444';
          for (let gx = -24; gx <= 24; gx += 7) {
            for (let gy = -14; gy <= 14; gy += 5) {
              if ((Math.abs(gx) / 7 + Math.abs(gy) / 5) % 2 === 0) {
                ctx.fillRect(gx, gy, 7, 5);
              }
            }
          }
          ctx.restore();

          // Wicker picnic basket
          ctx.fillStyle = '#a16207';
          ctx.fillRect(cx - 12, cy - 3, 9, 7);
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(cx - 12, cy - 3, 9, 3); // Lid
          // Apples in basket
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(cx - 8, cy - 4, 1.8, 0, Math.PI * 2);
          ctx.arc(cx - 5, cy - 4, 1.6, 0, Math.PI * 2);
          ctx.fill();

          // Tea pot & cups on wooden tray
          ctx.fillStyle = '#78350f';
          ctx.fillRect(cx + 4, cy - 1, 10, 6);
          ctx.fillStyle = '#f8fafc';
          // Teapot
          ctx.beginPath();
          ctx.arc(cx + 7, cy + 1, 2.5, 0, Math.PI * 2);
          ctx.fill();
          // Cup
          ctx.beginPath();
          ctx.arc(cx + 12, cy + 2, 1.4, 0, Math.PI * 2);
          ctx.fill();

          // Plush cushions
          ctx.fillStyle = '#a7f3d0';
          ctx.beginPath();
          ctx.ellipse(cx - 2, cy - 4, 4.5, 2.5, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fbcfe8';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy - 4, 4, 2.2, -0.3, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        case 'hammock': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.3)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 8, 26, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Two sturdy timber posts
          [-16, 16].forEach(hx => {
            ctx.fillStyle = '#451a03';
            ctx.fillRect(cx + hx - 2, cy - 14, 4, 18);
            ctx.fillStyle = '#92400e';
            ctx.fillRect(cx + hx - 2, cy - 14, 2, 18);
          });

          // Ropes & canvas hammock hanging in a gentle U-curve
          ctx.strokeStyle = '#ca8a04';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(cx - 16, cy - 10);
          ctx.lineTo(cx - 12, cy - 4);
          ctx.moveTo(cx + 16, cy - 10);
          ctx.lineTo(cx + 12, cy - 4);
          ctx.stroke();

          // Canvas hammock scoop
          const hSway = Math.sin(Date.now() * 0.002) * 1.2;
          const hGrad = ctx.createLinearGradient(cx - 12, cy - 4, cx + 12, cy + 2);
          hGrad.addColorStop(0, '#0284c7');
          hGrad.addColorStop(0.5, '#38bdf8');
          hGrad.addColorStop(1, '#0284c7');
          ctx.fillStyle = hGrad;

          ctx.beginPath();
          ctx.moveTo(cx - 12, cy - 4);
          ctx.quadraticCurveTo(cx + hSway, cy + 8, cx + 12, cy - 4);
          ctx.quadraticCurveTo(cx + hSway, cy + 3, cx - 12, cy - 4);
          ctx.closePath();
          ctx.fill();

          // Soft cream pillow inside hammock
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.ellipse(cx - 6 + hSway * 0.5, cy + 1, 3.5, 2, -0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        default:
          break;
      }
    };

    // Draw peaceful swallows soaring in the sky (majestic, clear silhouette)
    const drawBird = (b) => {
      const angle = Math.atan2(b.vy, b.vx);
      const flap = Math.sin(b.wingPhase);

      // Shadow on ground
      ctx.save();
      ctx.translate(b.x + b.height * 0.35, b.y + b.height);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgba(15, 45, 10, 0.22)';
      ctx.beginPath();
      const sW = b.size * 0.85;
      const sFlap = flap * (b.size * 0.45);
      ctx.moveTo(sW, 0);
      ctx.lineTo(0, -sW * 0.65 - sFlap);
      ctx.lineTo(-sW * 0.35, 0);
      ctx.lineTo(0, sW * 0.65 + sFlap);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Bird in flight
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(angle);

      const bW = b.size;
      const wingSpan = bW * 0.95;
      const wingTipY = wingSpan * (0.8 + flap * 0.45);

      // Bird body
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, 0, bW * 0.55, bW * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wings with soft contrast
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;

      // Left wing
      ctx.beginPath();
      ctx.moveTo(bW * 0.2, 0);
      ctx.lineTo(-bW * 0.15, -wingTipY);
      ctx.lineTo(-bW * 0.4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right wing
      ctx.beginPath();
      ctx.moveTo(bW * 0.2, 0);
      ctx.lineTo(-bW * 0.15, wingTipY);
      ctx.lineTo(-bW * 0.4, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(bW * 0.55, -1.8);
      ctx.lineTo(bW * 0.8, 0);
      ctx.lineTo(bW * 0.55, 1.8);
      ctx.fill();

      // Swallow tail fork
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(-bW * 0.4, 0);
      ctx.lineTo(-bW * 0.7, -3.5);
      ctx.lineTo(-bW * 0.55, 0);
      ctx.lineTo(-bW * 0.7, 3.5);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // Fluttering whimsical butterfly (delicate, petite, natural scale ~7-8px wingspan)
    const drawButterfly = (bf) => {
      ctx.save();
      ctx.translate(bf.x, bf.y);
      const flap = Math.cos(bf.phase * 5.2);
      const wingScale = Math.max(0.18, Math.abs(flap));

      // Soft tiny ground shadow
      ctx.fillStyle = 'rgba(15, 45, 10, 0.12)';
      ctx.beginPath();
      ctx.ellipse(1, 4, 1.8 * wingScale, 1, 0, 0, Math.PI * 2);
      ctx.fill();

      // Wing fill
      ctx.fillStyle = bf.color || '#fef08a';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.lineWidth = 0.5;

      // Left forewing
      ctx.beginPath();
      ctx.ellipse(-2.0 * wingScale, -1.2, 2.4 * wingScale, 2.0, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right forewing
      ctx.beginPath();
      ctx.ellipse(2.0 * wingScale, -1.2, 2.4 * wingScale, 2.0, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Left hindwing
      ctx.beginPath();
      ctx.ellipse(-1.4 * wingScale, 0.8, 1.6 * wingScale, 1.4, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Right hindwing
      ctx.beginPath();
      ctx.ellipse(1.4 * wingScale, 0.8, 1.6 * wingScale, 1.4, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Petite body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 0.5, 1.6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Tiny antennae
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 0.4;
      ctx.beginPath();
      ctx.moveTo(-0.25, -1.6);
      ctx.lineTo(-1.1, -2.8);
      ctx.moveTo(0.25, -1.6);
      ctx.lineTo(1.1, -2.8);
      ctx.stroke();

      ctx.restore();
    };

    // Soft glowing firefly / grass cricket sparkle
    const drawFirefly = (f, isNight, isSunset) => {
      const alpha = 0.35 + 0.65 * (Math.sin(f.phase) * 0.5 + 0.5);
      const intensity = isNight ? alpha : (isSunset ? alpha * 0.8 : alpha * 0.45);
      if (intensity < 0.05) return;

      ctx.save();
      ctx.globalAlpha = intensity;

      // Glow halo
      ctx.fillStyle = isNight ? 'rgba(253, 224, 71, 0.3)' : 'rgba(254, 240, 138, 0.2)';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.baseRadius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Core light
      ctx.fillStyle = isNight ? '#fef08a' : '#fde047';
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.baseRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Natural perimeter border scenery (trees and rocks) framing bottom and right of village
    const drawBorderScenery = (sx, sy, item, isSunset, isNight) => {
      const cx = sx + (item.offsetX || 0);
      const cy = sy + TILE_H / 2 + (item.offsetY || 0);
      const scale = item.scale || 1;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // Contact ground shadow
      ctx.fillStyle = isNight ? 'rgba(0, 0, 0, 0.42)' : (isSunset ? 'rgba(35, 20, 5, 0.32)' : 'rgba(12, 32, 10, 0.28)');
      ctx.beginPath();
      ctx.ellipse(3, 6, 18, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      if (item.itemType === 'rock' || item.itemType === 'boulder_moss') {
        // Natural faceted boulder
        const isMossy = item.itemType === 'boulder_moss';

        // Base polygon
        ctx.fillStyle = isNight ? '#1e293b' : '#334155';
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.lineTo(-13, -11);
        ctx.lineTo(-2, -18);
        ctx.lineTo(13, -12);
        ctx.lineTo(17, 2);
        ctx.lineTo(2, 7);
        ctx.closePath();
        ctx.fill();

        // Left lit face
        ctx.fillStyle = isNight ? '#334155' : (isSunset ? '#78716c' : '#64748b');
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.lineTo(-13, -11);
        ctx.lineTo(-2, -18);
        ctx.lineTo(0, -2);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fill();

        // Top ridge highlight
        ctx.strokeStyle = isNight ? '#475569' : (isSunset ? '#fbbf24' : '#94a3b8');
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-13, -11);
        ctx.lineTo(-2, -18);
        ctx.lineTo(13, -12);
        ctx.stroke();

        if (isMossy) {
          // Lush velvety moss crown
          ctx.fillStyle = isNight ? '#064e3b' : (isSunset ? '#ca8a04' : '#4d7c0f');
          ctx.beginPath();
          ctx.moveTo(-10, -11);
          ctx.quadraticCurveTo(-2, -21, 10, -12);
          ctx.quadraticCurveTo(4, -14, -2, -13);
          ctx.quadraticCurveTo(-7, -12, -10, -11);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = isNight ? '#047857' : (isSunset ? '#fde047' : '#84cc16');
          ctx.beginPath();
          ctx.arc(-2, -16, 2.2, 0, Math.PI * 2);
          ctx.arc(4, -14, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Tiny wildflower tuft at rock base
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(10, 4, 1.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (item.itemType === 'leafy_tree') {
        // Lush forest tree (oak / beech style)
        // Trunk
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(-4, 4);
        ctx.lineTo(-3, -14);
        ctx.lineTo(3, -14);
        ctx.lineTo(5, 4);
        ctx.closePath();
        ctx.fill();

        // Foliage lobes
        const fDark = isNight ? '#022c22' : (isSunset ? '#3f6212' : '#15803d');
        const fMid = isNight ? '#064e3b' : (isSunset ? '#65a30d' : '#16a34a');
        const fLit = isNight ? '#047857' : (isSunset ? '#facc15' : '#4ade80');

        // Lower back lobe
        ctx.fillStyle = fDark;
        ctx.beginPath();
        ctx.arc(0, -18, 16, 0, Math.PI * 2);
        ctx.fill();

        // Left lit lobe
        ctx.fillStyle = fMid;
        ctx.beginPath();
        ctx.arc(-5, -21, 13, 0, Math.PI * 2);
        ctx.fill();

        // Right lobe
        ctx.fillStyle = fDark;
        ctx.beginPath();
        ctx.arc(6, -19, 11, 0, Math.PI * 2);
        ctx.fill();

        // Top crown sunlit highlight
        ctx.fillStyle = fLit;
        ctx.beginPath();
        ctx.arc(-2, -26, 9, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Evergreen pine / Nordic fir
        const isTall = item.itemType === 'fir_tall';

        // Trunk
        ctx.fillStyle = '#3e200c';
        ctx.fillRect(-3, -14, 6, 18);

        const drawTier = (baseY, coneW, coneH, darkCol, midCol, lightCol) => {
          ctx.fillStyle = darkCol;
          ctx.beginPath();
          ctx.moveTo(-coneW, baseY);
          ctx.quadraticCurveTo(0, baseY + 3.5, coneW, baseY);
          ctx.lineTo(0, baseY - coneH);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = midCol;
          ctx.beginPath();
          ctx.moveTo(-coneW, baseY);
          ctx.quadraticCurveTo(-coneW * 0.4, baseY + 1.8, 0, baseY);
          ctx.lineTo(0, baseY - coneH);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = lightCol;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(-coneW + 2, baseY - 1);
          ctx.lineTo(0, baseY - coneH);
          ctx.stroke();
        };

        if (isNight) {
          drawTier(-6, 20, 20, '#022c22', '#064e3b', '#047857');
          drawTier(-17, 16, 19, '#022c22', '#065f46', '#059669');
          drawTier(-28, 11, 19, '#064e3b', '#047857', '#10b981');
          if (isTall) drawTier(-38, 7, 16, '#065f46', '#059669', '#34d399');
        } else if (isSunset) {
          drawTier(-6, 20, 20, '#064e3b', '#115e59', '#ca8a04');
          drawTier(-17, 16, 19, '#047857', '#0d9488', '#eab308');
          drawTier(-28, 11, 19, '#0f766e', '#14b8a6', '#fde047');
          if (isTall) drawTier(-38, 7, 16, '#115e59', '#0d9488', '#fef08a');
        } else {
          drawTier(-6, 20, 20, '#064e3b', '#047857', '#34d399');
          drawTier(-17, 16, 19, '#064e3b', '#059669', '#6ee7b7');
          drawTier(-28, 11, 19, '#047857', '#10b981', '#a7f3d0');
          if (isTall) drawTier(-38, 7, 16, '#059669', '#10b981', '#d1fae5');
        }
      }

      ctx.restore();
    };

    // Natural lush forest border directly on the screen's right and bottom edges
    const drawScreenEdgeForest = (w, h, isSunset, isNight) => {
      ctx.save();

      const pineDark = isNight ? '#022c22' : (isSunset ? '#064e3b' : '#064e3b');
      const pineMid  = isNight ? '#064e3b' : (isSunset ? '#115e59' : '#059669');
      const pineLit  = isNight ? '#059669' : (isSunset ? '#eab308' : '#34d399');

      const oakDark  = isNight ? '#022c22' : (isSunset ? '#3f6212' : '#15803d');
      const oakMid   = isNight ? '#064e3b' : (isSunset ? '#65a30d' : '#16a34a');
      const oakLit   = isNight ? '#047857' : (isSunset ? '#facc15' : '#4ade80');

      const shadowCol = isNight ? 'rgba(0, 0, 0, 0.45)' : (isSunset ? 'rgba(40, 20, 5, 0.35)' : 'rgba(15, 35, 10, 0.28)');

      const drawEdgePine = (x, y, s = 1.0, isTall = false) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s, s);

        ctx.fillStyle = shadowCol;
        ctx.beginPath();
        ctx.ellipse(2, 6, 20, 9, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3e200c';
        ctx.fillRect(-3, -16, 6, 20);

        const drawTier = (baseY, coneW, coneH) => {
          ctx.fillStyle = pineDark;
          ctx.beginPath();
          ctx.moveTo(-coneW, baseY);
          ctx.quadraticCurveTo(0, baseY + 4, coneW, baseY);
          ctx.lineTo(0, baseY - coneH);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = pineMid;
          ctx.beginPath();
          ctx.moveTo(-coneW, baseY);
          ctx.quadraticCurveTo(-coneW * 0.4, baseY + 2, 0, baseY);
          ctx.lineTo(0, baseY - coneH);
          ctx.closePath();
          ctx.fill();

          ctx.strokeStyle = pineLit;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-coneW + 2, baseY - 1);
          ctx.lineTo(0, baseY - coneH);
          ctx.stroke();
        };

        drawTier(-6, 22, 22);
        drawTier(-18, 18, 21);
        drawTier(-30, 13, 21);
        if (isTall) drawTier(-42, 8, 18);

        ctx.restore();
      };

      const drawEdgeOak = (x, y, s = 1.0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s, s);

        ctx.fillStyle = shadowCol;
        ctx.beginPath();
        ctx.ellipse(3, 7, 24, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.moveTo(-5, 6);
        ctx.lineTo(-4, -16);
        ctx.lineTo(4, -16);
        ctx.lineTo(6, 6);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = oakDark;
        ctx.beginPath();
        ctx.arc(0, -22, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = oakMid;
        ctx.beginPath();
        ctx.arc(-7, -26, 16, 0, Math.PI * 2);
        ctx.arc(8, -23, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = oakLit;
        ctx.beginPath();
        ctx.arc(-3, -33, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      const drawEdgeBush = (x, y, s = 1.0, flowerColor = '#f472b6') => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s, s);

        ctx.fillStyle = shadowCol;
        ctx.beginPath();
        ctx.ellipse(0, 4, 16, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = oakDark;
        ctx.beginPath();
        ctx.arc(0, -8, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = oakMid;
        ctx.beginPath();
        ctx.arc(-4, -10, 11, 0, Math.PI * 2);
        ctx.arc(4, -9, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = flowerColor;
        ctx.beginPath();
        ctx.arc(-6, -12, 2.2, 0, Math.PI * 2);
        ctx.arc(3, -14, 2, 0, Math.PI * 2);
        ctx.arc(7, -8, 2.2, 0, Math.PI * 2);
        ctx.arc(-2, -6, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      const drawEdgeRock = (x, y, s = 1.0) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(s, s);

        ctx.fillStyle = shadowCol;
        ctx.beginPath();
        ctx.ellipse(0, 4, 16, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isNight ? '#1e293b' : '#334155';
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.lineTo(-13, -11);
        ctx.lineTo(-2, -18);
        ctx.lineTo(13, -12);
        ctx.lineTo(17, 2);
        ctx.lineTo(2, 7);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = isNight ? '#334155' : (isSunset ? '#78716c' : '#64748b');
        ctx.beginPath();
        ctx.moveTo(-16, 2);
        ctx.lineTo(-13, -11);
        ctx.lineTo(-2, -18);
        ctx.lineTo(0, -2);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      };

      // 1. RIGHT SCREEN EDGE: Vertical woodland border cascading down the right margin
      const rx = w;
      const rightTrees = [
        { x: rx - 20,  y: h * 0.28, type: 'pine', s: 1.1, tall: true },
        { x: rx - 65,  y: h * 0.34, type: 'oak',  s: 1.05 },
        { x: rx - 28,  y: h * 0.42, type: 'pine', s: 1.25, tall: true },
        { x: rx - 90,  y: h * 0.48, type: 'bush', s: 1.2, flower: '#fef08a' },
        { x: rx - 45,  y: h * 0.55, type: 'oak',  s: 1.3 },
        { x: rx - 95,  y: h * 0.62, type: 'rock', s: 1.1 },
        { x: rx - 25,  y: h * 0.68, type: 'pine', s: 1.35, tall: true },
        { x: rx - 75,  y: h * 0.76, type: 'oak',  s: 1.25 },
        { x: rx - 35,  y: h * 0.85, type: 'pine', s: 1.4, tall: true },
        { x: rx - 85,  y: h * 0.92, type: 'bush', s: 1.3, flower: '#f472b6' }
      ];

      // 2. BOTTOM SCREEN EDGE: Horizontal treeline & meadow ridge framing the bottom margin
      const by = h;
      const bottomTrees = [
        { x: w * 0.04, y: by - 16, type: 'pine', s: 1.25, tall: true },
        { x: w * 0.11, y: by - 28, type: 'oak',  s: 1.1 },
        { x: w * 0.18, y: by - 10, type: 'bush', s: 1.2, flower: '#f472b6' },
        { x: w * 0.25, y: by - 22, type: 'rock', s: 1.1 },
        { x: w * 0.33, y: by - 14, type: 'pine', s: 1.15 },
        { x: w * 0.42, y: by - 30, type: 'oak',  s: 1.2 },
        { x: w * 0.50, y: by - 12, type: 'bush', s: 1.15, flower: '#fef08a' },
        { x: w * 0.59, y: by - 24, type: 'pine', s: 1.2, tall: true },
        { x: w * 0.68, y: by - 16, type: 'rock', s: 1.15 },
        { x: w * 0.77, y: by - 28, type: 'oak',  s: 1.3 },
        { x: w * 0.86, y: by - 14, type: 'pine', s: 1.3, tall: true },
        { x: w * 0.94, y: by - 22, type: 'oak',  s: 1.35 }
      ];

      // Atmospheric edge soft shade
      const bottomRidgeGrad = ctx.createLinearGradient(0, h - 65, 0, h);
      if (isNight) {
        bottomRidgeGrad.addColorStop(0, 'rgba(10, 30, 15, 0)');
        bottomRidgeGrad.addColorStop(1, 'rgba(6, 20, 10, 0.45)');
      } else if (isSunset) {
        bottomRidgeGrad.addColorStop(0, 'rgba(50, 25, 5, 0)');
        bottomRidgeGrad.addColorStop(1, 'rgba(40, 20, 5, 0.22)');
      } else {
        bottomRidgeGrad.addColorStop(0, 'rgba(20, 50, 10, 0)');
        bottomRidgeGrad.addColorStop(1, 'rgba(15, 40, 10, 0.18)');
      }
      ctx.fillStyle = bottomRidgeGrad;
      ctx.fillRect(0, h - 65, w, 65);

      const rightRidgeGrad = ctx.createLinearGradient(w - 80, 0, w, 0);
      if (isNight) {
        rightRidgeGrad.addColorStop(0, 'rgba(10, 30, 15, 0)');
        rightRidgeGrad.addColorStop(1, 'rgba(6, 20, 10, 0.4)');
      } else if (isSunset) {
        rightRidgeGrad.addColorStop(0, 'rgba(50, 25, 5, 0)');
        rightRidgeGrad.addColorStop(1, 'rgba(40, 20, 5, 0.2)');
      } else {
        rightRidgeGrad.addColorStop(0, 'rgba(20, 50, 10, 0)');
        rightRidgeGrad.addColorStop(1, 'rgba(15, 40, 10, 0.15)');
      }
      ctx.fillStyle = rightRidgeGrad;
      ctx.fillRect(w - 80, h * 0.25, 80, h * 0.75);

      rightTrees.forEach(t => {
        if (t.type === 'pine') drawEdgePine(t.x, t.y, t.s, t.tall);
        else if (t.type === 'oak') drawEdgeOak(t.x, t.y, t.s);
        else if (t.type === 'bush') drawEdgeBush(t.x, t.y, t.s, t.flower);
        else if (t.type === 'rock') drawEdgeRock(t.x, t.y, t.s);
      });

      bottomTrees.forEach(t => {
        if (t.type === 'pine') drawEdgePine(t.x, t.y, t.s, t.tall);
        else if (t.type === 'oak') drawEdgeOak(t.x, t.y, t.s);
        else if (t.type === 'bush') drawEdgeBush(t.x, t.y, t.s, t.flower);
        else if (t.type === 'rock') drawEdgeRock(t.x, t.y, t.s);
      });

      ctx.restore();
    };

    // Cute cozy isometric villager with custom wardrobe, swimming, activities & styling
    const drawVillager = (v, origin, isSunset, isNight) => {
      const { x: sx, y: sy } = toScreen(v.currGx, v.currGy, origin.x, origin.y);
      const groundX = sx;
      const groundY = sy + TILE_H / 2;

      // Draw character using the complete customized renderer
      drawCompleteVillager(ctx, {
        cx: groundX,
        cy: groundY,
        scale: 1,
        outfit: v.outfit || currentOutfitRef.current || 'autumn_sweater',
        inWater: v.inWater,
        activity: v.activity,
        activityTimer: v.activityTimer,
        facingLeft: v.facingLeft,
        isWalking: v.progress < 1,
        walkCycle: v.walkCycle,
        hopY: v.hopY,
        isNight,
        isSunset,
        look: villagerLookRef.current,
        timestamp: Date.now()
      });

      const isSitting = v.activity === 'drinking_tea' || v.activity === 'bonfire_warming' || v.activity === 'reading_book';
      const charY = v.inWater ? groundY + 2 : (isSitting ? groundY + 3 : groundY + v.hopY - 1);

      // 9. Floating Emote
      if (v.emote && v.emoteTimer > 0) {
        ctx.save();
        const emoteProgress = (140 - v.emoteTimer) / 140;
        const emoteFloatY = charY - 33 - emoteProgress * 8;
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const scale = 1 + Math.sin(Date.now() * 0.01) * 0.15;
        ctx.translate(groundX, emoteFloatY);
        ctx.scale(scale, scale);
        ctx.fillText(v.emote, 0, 0);
        ctx.restore();
      }
    };

    let lastFrameTime = performance.now();
    let smoothedDt = 1 / 60; // Stable 60 FPS baseline

    const render = (currentTime = performance.now()) => {
      const rawDt = (currentTime - lastFrameTime) / 1000;
      lastFrameTime = currentTime;
      // Exponential moving average filter: smooths out VSync timing jitter and browser micro-spikes
      if (rawDt > 0.005 && rawDt < 0.1) {
        smoothedDt = smoothedDt * 0.8 + rawDt * 0.2;
      }
      const dt = smoothedDt;

      const width = canvas.width;
      const height = canvas.height;
      const origin = getOrigin(width, height);

      const tod = timeOfDayRef.current;
      const isNight = tod === 'night';
      const isSunset = tod === 'sunset';

      // 1. SKY & DISTANT HORIZON (West Sea / Sunset)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isNight) {
        skyGrad.addColorStop(0, '#090d16');
        skyGrad.addColorStop(0.4, '#0f172a');
        skyGrad.addColorStop(0.7, '#1e1b4b');
        skyGrad.addColorStop(1, '#064e3b');
      } else if (isSunset) {
        skyGrad.addColorStop(0, '#4a154b'); // Deep violet dusk
        skyGrad.addColorStop(0.25, '#c026d3'); // Magenta
        skyGrad.addColorStop(0.5, '#f97316'); // Warm glowing orange
        skyGrad.addColorStop(0.75, '#fde047'); // Golden sunset horizon
        skyGrad.addColorStop(1, '#2e5b15'); // Forest transition
      } else {
        // Bright peaceful afternoon
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.5, '#7dd3fc');
        skyGrad.addColorStop(0.8, '#bae6fd');
        skyGrad.addColorStop(1, '#5aa32a');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Sunset Sun & Sky Highlights
      if (isSunset) {
        const sunX = width * 0.22;
        const sunY = height * 0.24;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 260);
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        sunGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.7)');
        sunGrad.addColorStop(0.5, 'rgba(217, 70, 239, 0.35)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 260, 0, Math.PI * 2);
        ctx.fill();

        // Sunset Orb
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fill();
      } else if (isNight) {
        // Gentle crescent moon & stars
        const moonX = width * 0.24;
        const moonY = height * 0.18;
        ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 20, 0, Math.PI * 2);
        ctx.fill();

        // Star twinkle
        ctx.fillStyle = '#ffffff';
        [
          [0.1, 0.12], [0.18, 0.08], [0.32, 0.15], [0.45, 0.09], [0.65, 0.14], [0.8, 0.1]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(width * px, height * py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 2. WESTERN HORIZON, COASTAL WATER & ROLLING HILLS (Harmonious Organic Backdrop)
      // Soft atmospheric rolling ridge behind and beneath the meadow
      const hillGrad = ctx.createLinearGradient(0, height * 0.22, 0, height * 0.72);
      if (isNight) {
        hillGrad.addColorStop(0, '#0c1a2e');
        hillGrad.addColorStop(0.35, '#0f291e');
        hillGrad.addColorStop(1, '#163812');
      } else if (isSunset) {
        hillGrad.addColorStop(0, '#831843'); // Dusky plum hill
        hillGrad.addColorStop(0.32, '#9a3412'); // Amber slopes
        hillGrad.addColorStop(0.68, '#65961d'); // Warm hillside green
        hillGrad.addColorStop(1, '#598918'); // Exactly matches sunset grass2 (#598918)!
      } else {
        hillGrad.addColorStop(0, '#0284c7');
        hillGrad.addColorStop(0.35, '#0d9488');
        hillGrad.addColorStop(1, '#5aa32a'); // Exactly matches daytime grass2 (#5aa32a)!
      }

      // Distant rolling mountain silhouette (Soft Bézier curve across full width)
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.28);
      ctx.bezierCurveTo(width * 0.25, height * 0.22, width * 0.55, height * 0.35, width, height * 0.26);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Gentle mountain haze / sunset mist band
      const mistGrad = ctx.createLinearGradient(0, height * 0.24, 0, height * 0.42);
      mistGrad.addColorStop(0, isSunset ? 'rgba(253, 230, 138, 0.35)' : 'rgba(255, 255, 255, 0.25)');
      mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.22, width, height * 0.2);

      // Distant tranquil lake shimmer on the horizon (nestled gently in the valley hills)
      const lakeGrad = ctx.createLinearGradient(0, height * 0.28, width * 0.22, height * 0.36);
      if (isNight) {
        lakeGrad.addColorStop(0, 'rgba(2, 132, 199, 0.45)');
        lakeGrad.addColorStop(1, 'rgba(3, 43, 67, 0.2)');
      } else if (isSunset) {
        lakeGrad.addColorStop(0, 'rgba(249, 115, 22, 0.55)');
        lakeGrad.addColorStop(0.5, 'rgba(217, 70, 239, 0.3)');
        lakeGrad.addColorStop(1, 'rgba(2, 132, 199, 0.2)');
      } else {
        lakeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        lakeGrad.addColorStop(1, 'rgba(2, 132, 199, 0.25)');
      }
      ctx.fillStyle = lakeGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.29);
      ctx.bezierCurveTo(width * 0.08, height * 0.28, width * 0.16, height * 0.32, width * 0.22, height * 0.35);
      ctx.bezierCurveTo(width * 0.14, height * 0.37, width * 0.06, height * 0.36, 0, height * 0.35);
      ctx.closePath();
      ctx.fill();

      // 3. LAYERED NATURAL FOREST (Serene Woodland Horizon Silhouette)
      const ridgeGrad = ctx.createLinearGradient(0, height * 0.24, 0, height * 0.44);
      ridgeGrad.addColorStop(0, isNight ? '#052210' : (isSunset ? '#2c4a09' : '#14532d'));
      ridgeGrad.addColorStop(1, isNight ? '#0b3518' : (isSunset ? '#4d7515' : '#16a34a'));
      ctx.fillStyle = ridgeGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.33);
      ctx.bezierCurveTo(width * 0.35, height * 0.26, width * 0.7, height * 0.36, width, height * 0.29);
      ctx.lineTo(width, height * 0.48);
      ctx.lineTo(0, height * 0.48);
      ctx.closePath();
      ctx.fill();

      // 4. EXPANSIVE MEADOW CLEARING & CULTIVABLE FRONTIER TILES
      const currentTier = expansionTierRef.current;
      const isCultivating = isCultivatingModeRef.current;

      // Meadow palette tailored to time of day
      let grass1 = '#64af32';
      let grass2 = '#5aa32a';
      let grass3 = '#509623';
      let grassHi = '#6ebc37';

      if (isSunset) {
        grass1 = '#65961d';
        grass2 = '#598918';
        grass3 = '#4d7515';
        grassHi = '#c2850c'; // Golden hour amber kiss
      } else if (isNight) {
        grass1 = '#1c4217';
        grass2 = '#163812';
        grass3 = '#112c0e';
        grassHi = '#24521d';
      }

      // Render Meadow & Frontier Tiles via High-Speed Cache (0 math per frame)
      const currentHovered = hoveredTileRef.current;
      const currentPlaced = placedObjectsRef.current;
      const currentBuildItem = selectedBuildItemRef.current;
      const currentInspected = inspectedObjectRef.current;
      const gridCache = tileGridCacheRef.current;

      if (gridCache) {
        // High-speed O(1) occupancy lookup set (eliminates 11,000+ array scans per frame)
        const occupiedSet = new Set(currentPlaced.map(o => (o.gx << 8) | o.gy));

        for (let gy = 0; gy < GRID_SIZE; gy++) {
          for (let gx = 0; gx < GRID_SIZE; gx++) {
            const tile = gridCache[gy][gx];
            const inClearing = tile.inClearing;
            const isFrontier = tile.isFrontier;
            const { x: sx, y: sy } = toScreen(gx, gy, origin.x, origin.y);
            const isHovered = currentHovered && currentHovered.gx === gx && currentHovered.gy === gy;

            if (!inClearing) {
              // 1. Cultivable Frontier Plots (אדמת בור / חלקה פראית לעיבוד)
              if (isFrontier) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(sx, sy);
                ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
                ctx.lineTo(sx, sy + TILE_H);
                ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
                ctx.closePath();

                if (isCultivating || isHovered) {
                  const pulse = Math.sin(Date.now() / 240) * 0.15 + 0.85;
                  ctx.fillStyle = isHovered
                    ? 'rgba(254, 240, 138, 0.45)'
                    : `rgba(163, 230, 53, ${0.22 * pulse})`;
                  ctx.fill();

                  ctx.strokeStyle = isHovered ? '#fef08a' : 'rgba(234, 179, 8, 0.75)';
                  ctx.lineWidth = isHovered ? 2.5 : 1.5;
                  ctx.setLineDash([4, 3]);
                  ctx.stroke();
                  ctx.setLineDash([]);

                  ctx.font = 'bold 12px "Segoe UI Emoji", sans-serif';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText(isHovered ? '➕' : '🌱', sx, sy + TILE_H / 2);
                }
                ctx.restore();
              }
              continue;
            }

            // 2. Cleared Meadow Tiles
            let color = grass1;
            if (tile.colorType === 1) color = grass2;
            else if (tile.colorType === 2) color = grass3;
            else if (tile.colorType === 3) color = grassHi;

            const isOccupied = occupiedSet.has((gx << 8) | gy);

            drawTile(sx, sy, color, isHovered, (currentBuildItem || movingObjectRef.current) && !isOccupied);

            if (tile.isCultivated) {
              ctx.fillStyle = 'rgba(253, 224, 71, 0.5)';
              ctx.beginPath();
              ctx.arc(sx, sy + TILE_H / 2, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }

            if (tile.isWildflower) {
              ctx.fillStyle = isSunset ? '#fef08a' : '#f472b6';
              ctx.beginPath();
              ctx.arc(sx + 3, sy + TILE_H / 2 - 2, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 5. PLACED COZY SANCTUARY ITEMS & VILLAGER (Unified Depth Sorted)
      const currentDragging = draggingObjectRef.current;
      const v = animEntitiesRef.current.villager;

      // Update Villager wandering, swimming, activities and physics
      if (v) {
        // Sync outfit from ref if not in water
        v.outfit = currentOutfitRef.current;

        // Water detection: check if villager is on river_tile or water_lily_pond
        const currentWaterObj = currentPlaced.find(o =>
          (o.type === 'river_tile' || o.type === 'water_lily_pond') &&
          Math.abs(v.currGx - o.gx) < 0.75 &&
          Math.abs(v.currGy - o.gy) < 0.75
        );
        const inWaterNow = Boolean(currentWaterObj);

        if (inWaterNow && !v.inWater) {
          v.inWater = true;
          sounds.playSplash();
          const quotes = VILLAGER_THOUGHTS.entering_water;
          v.bubble = {
            text: quotes[Math.floor(Math.random() * quotes.length)],
            timer: 280
          };
          v.emote = '🩱';
          v.emoteTimer = 140;
        } else if (!inWaterNow && v.inWater) {
          v.inWater = false;
          sounds.playTap();
          const quotes = VILLAGER_THOUGHTS.leaving_water;
          v.bubble = {
            text: quotes[Math.floor(Math.random() * quotes.length)],
            timer: 260
          };
          v.emote = '✨';
          v.emoteTimer = 120;
        }

        // Hop physics
        if (v.hopY < 0 || v.hopVy !== 0) {
          v.hopY += v.hopVy;
          v.hopVy += 0.7;
          if (v.hopY >= 0) {
            v.hopY = 0;
            v.hopVy = 0;
          }
        }

        // Emote timer
        if (v.emoteTimer > 0) {
          v.emoteTimer--;
          if (v.emoteTimer <= 0) v.emote = null;
        }

        // Active Activity Timer countdown
        if (v.activity) {
          if (v.activity === 'picking_fruit' && v.activityTimer === 250) {
            sounds.playChomp();
            v.emote = '🍎';
            v.emoteTimer = 130;
          }

          v.activityTimer--;
          if (v.activityTimer <= 0) {
            v.activity = null;
            v.idleTimer = 80 + Math.floor(Math.random() * 100);
            v.emote = '✨';
            v.emoteTimer = 110;
          }
        }

        // Constant calm walking speed (~0.72 tiles per second => ~1.39s per tile across all directions and distances)
        const SPEED_TILES_PER_SEC = 0.72;

        if (v.progress < 1) {
          const dx = v.targetGx - v.startGx;
          const dy = v.targetGy - v.startGy;
          const gridDist = Math.hypot(dx, dy);

          // Time in seconds strictly proportional to grid distance
          const durationSec = gridDist > 0 ? gridDist / SPEED_TILES_PER_SEC : 0.001;
          const dProg = dt / durationSec;
          v.progress = Math.min(1, v.progress + dProg);
          v.walkCycle += (Math.PI * 2) * SPEED_TILES_PER_SEC * dt;

          v.currGx = v.startGx + dx * v.progress;
          v.currGy = v.startGy + dy * v.progress;

          if (v.progress >= 1) {
            v.progress = 1;
            v.gx = v.targetGx;
            v.gy = v.targetGy;
            v.currGx = v.targetGx;
            v.currGy = v.targetGy;

            if (v.activityTarget) {
              // Reached destination! Enjoy the spot!
              v.activity = v.activityTarget.type;
              v.activityTimer = 420 + Math.floor(Math.random() * 220); // ~7-11 seconds
              v.hopVy = -4.2;

              // Face the visited item
              const itemScreenX = (v.activityTarget.gx - v.activityTarget.gy) * 34;
              const vScreenX = (v.currGx - v.currGy) * 34;
              if (itemScreenX < vScreenX) v.facingLeft = true;
              else if (itemScreenX > vScreenX) v.facingLeft = false;

              const actList = VILLAGER_THOUGHTS[v.activity] || VILLAGER_THOUGHTS.strolling;
              v.bubble = {
                text: actList[Math.floor(Math.random() * actList.length)],
                timer: 320
              };
              v.emote = v.activity === 'drinking_tea' ? '🍵' :
                (v.activity === 'gardening' ? '🌱' :
                  (v.activity === 'bonfire_warming' ? '🔥' :
                    (v.activity === 'swimming' ? '🌊' :
                      (v.activity === 'picking_fruit' ? '🍎' :
                        (v.activity === 'tending_crops' ? '🥕' :
                          (v.activity === 'farming_wheat' ? '🌾' :
                            (v.activity === 'mining_gems' ? '💎' : '📖')))))));
              v.emoteTimer = 140;
              v.activityTarget = null;
              v.idleTimer = 0;
            } else if (!v.activity) {
              // Idle pause between wander steps
              v.idleTimer = 70 + Math.floor(Math.random() * 130);
              if (Math.random() < 0.35) {
                const emotes = ['❤️', '🎵', '🌱', '✨', '☕', '🌸', '🍎'];
                v.emote = emotes[Math.floor(Math.random() * emotes.length)];
                v.emoteTimer = 110;
              }
            }
          }
        } else if (!v.activity) {
          v.idleTimer--;
          if (v.idleTimer <= 0) {
            if (v.activityTarget) {
              // Launch route to assigned activity target
              const startGx = v.currGx;
              const startGy = v.currGy;
              const dx = v.activityTarget.gx - startGx;
              const dy = v.activityTarget.gy - startGy;
              const dist = Math.hypot(dx, dy);
              let destGx = v.activityTarget.gx;
              let destGy = v.activityTarget.gy;
              if (dist > 0.85) {
                destGx = v.activityTarget.gx - (dx / dist) * 0.8;
                destGy = v.activityTarget.gy - (dy / dist) * 0.8;
              }
              v.startGx = startGx;
              v.startGy = startGy;
              v.targetGx = destGx;
              v.targetGy = destGy;
              v.progress = 0;
              const dScreenX = (destGx - destGy) - (startGx - startGy);
              if (dScreenX < 0) v.facingLeft = true;
              else if (dScreenX > 0) v.facingLeft = false;
            } else {
              // Autonomous behavior: chance to choose an interesting spot in the village!
              const roll = Math.random();
              const waterTiles = currentPlaced.filter(o => o.type === 'river_tile' || o.type === 'water_lily_pond');
              const teaTiles = currentPlaced.filter(o => o.type === 'tea_table');
              const gardenTiles = currentPlaced.filter(o => o.type === 'flower_garden' || o.type === 'greenhouse');
              const fireTiles = currentPlaced.filter(o => o.type === 'bonfire');
              const benchTiles = currentPlaced.filter(o => o.type === 'reading_bench');
              const treeTiles = currentPlaced.filter(o => o.type === 'oak_tree' || o.type === 'bush');

              let pickedTarget = null;
              if (roll < 0.10 && waterTiles.length > 0) {
                const w = waterTiles[Math.floor(Math.random() * waterTiles.length)];
                pickedTarget = { gx: w.gx, gy: w.gy, type: 'swimming' };
              } else if (roll < 0.20 && teaTiles.length > 0) {
                const t = teaTiles[Math.floor(Math.random() * teaTiles.length)];
                pickedTarget = { gx: t.gx, gy: t.gy, type: 'drinking_tea' };
              } else if (roll < 0.30 && gardenTiles.length > 0) {
                const g = gardenTiles[Math.floor(Math.random() * gardenTiles.length)];
                pickedTarget = { gx: g.gx, gy: g.gy, type: 'gardening' };
              } else if (roll < 0.38 && fireTiles.length > 0) {
                const f = fireTiles[Math.floor(Math.random() * fireTiles.length)];
                pickedTarget = { gx: f.gx, gy: f.gy, type: 'bonfire_warming' };
              } else if (roll < 0.46 && benchTiles.length > 0) {
                const b = benchTiles[Math.floor(Math.random() * benchTiles.length)];
                pickedTarget = { gx: b.gx, gy: b.gy, type: 'reading_book' };
              } else if (roll < 0.56 && treeTiles.length > 0) {
                const tr = treeTiles[Math.floor(Math.random() * treeTiles.length)];
                pickedTarget = { gx: tr.gx, gy: tr.gy, type: 'picking_fruit' };
              }

              if (pickedTarget) {
                const startGx = v.currGx;
                const startGy = v.currGy;
                const dx = pickedTarget.gx - startGx;
                const dy = pickedTarget.gy - startGy;
                const dist = Math.hypot(dx, dy);
                let destGx = pickedTarget.gx;
                let destGy = pickedTarget.gy;
                if (dist > 0.85) {
                  destGx = pickedTarget.gx - (dx / dist) * 0.8;
                  destGy = pickedTarget.gy - (dy / dist) * 0.8;
                }
                v.startGx = startGx;
                v.startGy = startGy;
                v.targetGx = destGx;
                v.targetGy = destGy;
                v.progress = 0;
                v.activityTarget = pickedTarget;
                const dScreenX = (destGx - destGy) - (startGx - startGy);
                if (dScreenX < 0) v.facingLeft = true;
                else if (dScreenX > 0) v.facingLeft = false;
              } else {
                // Free wandering: 1 step to adjacent cleared tile
                const deltas = [
                  [-1, 0], [1, 0], [0, -1], [0, 1],
                  [-1, -1], [1, 1], [-1, 1], [1, -1]
                ];
                deltas.sort(() => Math.random() - 0.5);
                let chosen = null;
                for (const [dx, dy] of deltas) {
                  const nx = v.gx + dx;
                  const ny = v.gy + dy;
                  if (nx >= 3 && nx < GRID_SIZE - 3 && ny >= 3 && ny < GRID_SIZE - 3 && checkClearing(nx, ny)) {
                    chosen = { nx, ny };
                    break;
                  }
                }
                if (chosen) {
                  v.startGx = v.gx;
                  v.startGy = v.gy;
                  v.targetGx = chosen.nx;
                  v.targetGy = chosen.ny;
                  v.progress = 0;
                  const dScreenX = (chosen.nx - chosen.ny) - (v.gx - v.gy);
                  if (dScreenX < 0) v.facingLeft = true;
                  else if (dScreenX > 0) v.facingLeft = false;
                } else {
                  v.idleTimer = 60;
                }
              }
            }
          }
        }

        // Sync to React status only when state actually changes (avoids constant re-renders)
        let actLabel = 'מטייל בנחת בכפר 🍃';
        if (v.inWater) actLabel = 'שוחה במים (בגד ים) 🌊';
        else if (v.activity === 'drinking_tea') actLabel = 'שותה תה בפינת התה 🍵';
        else if (v.activity === 'gardening') actLabel = 'מטפח ומשקה את הגינה 🌱';
        else if (v.activity === 'bonfire_warming') actLabel = 'מתחמם ליד המדורה 🔥';
        else if (v.activity === 'reading_book') actLabel = 'קורא ספר בספסל 📖';
        else if (v.activity === 'picking_fruit') actLabel = 'קוטף ואוכל פרי מהעץ 🍎';
        else if (v.activityTarget) actLabel = 'צועד לפעילות בכפר 🏃‍♂️';

        if (v.lastReportedLabel !== actLabel || v.lastReportedInWater !== v.inWater || v.lastReportedActivity !== v.activity) {
          v.lastReportedLabel = actLabel;
          v.lastReportedInWater = v.inWater;
          v.lastReportedActivity = v.activity;
          setVillagerLiveStatus({
            inWater: v.inWater,
            activity: v.activity,
            activityLabel: actLabel,
            fruitsEaten: fruitsEatenRef.current
          });
        }

        // Cache screen position for interaction
        const vPos = toScreen(v.currGx, v.currGy, origin.x, origin.y);
        v.screenPos = {
          x: vPos.x,
          y: vPos.y + TILE_H / 2
        };
      }

      // Build unified render list sorted by isometric depth (gx + gy)
      const renderEntities = [];
      const activeDrag = activeDragRef.current || currentDragging;

      // Add natural border scenery (trees and rocks) along bottom (east) and right (north) borders
      if (borderSceneryRef.current && borderSceneryRef.current.length > 0) {
        borderSceneryRef.current.forEach(item => {
          renderEntities.push({
            kind: 'border_scenery',
            depth: item.gx + item.gy + 0.15,
            item
          });
        });
      }

      currentPlaced.forEach(obj => {
        if (activeDrag && activeDrag.originGx === obj.gx && activeDrag.originGy === obj.gy) {
          return;
        }
        renderEntities.push({
          kind: 'object',
          depth: obj.gx + obj.gy,
          obj
        });
      });

      if (v) {
        renderEntities.push({
          kind: 'villager',
          depth: v.currGx + v.currGy + 0.1,
          villager: v
        });
      }

      renderEntities.sort((a, b) => a.depth - b.depth);

      renderEntities.forEach(item => {
        if (item.kind === 'border_scenery') {
          const { x: sx, y: sy } = toScreen(item.item.gx, item.item.gy, origin.x, origin.y);
          drawBorderScenery(sx, sy, item.item, isSunset, isNight);
        } else if (item.kind === 'object') {
          const { x: sx, y: sy } = toScreen(item.obj.gx, item.obj.gy, origin.x, origin.y);
          const isInspected = currentInspected?.gx === item.obj.gx && currentInspected?.gy === item.obj.gy;
          const isSelectedMove = movingObjectRef.current?.gx === item.obj.gx && movingObjectRef.current?.gy === item.obj.gy;

          // If item is currently selected for moving, draw an active glowing ring under it
          if (isSelectedMove) {
            ctx.save();
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.ellipse(sx, sy + TILE_H / 2, 26, 13, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
          }

          drawItem(item.obj.type, sx, sy, isInspected || isSelectedMove, item.obj);
        } else if (item.kind === 'villager') {
          drawVillager(item.villager, origin, isSunset, isNight);
        }
      });

      // Dragging Object Levitation Animation & Target Highlight
      if (activeDrag && currentHovered && checkClearing(currentHovered.gx, currentHovered.gy)) {
        const { x: tsx, y: tsy } = toScreen(currentHovered.gx, currentHovered.gy, origin.x, origin.y);
        const targetOccupied = currentPlaced.some(o =>
          o.gx === currentHovered.gx &&
          o.gy === currentHovered.gy &&
          !(o.gx === activeDrag.originGx && o.gy === activeDrag.originGy)
        );

        // Ground Target Ring (Green if free, Red if occupied)
        ctx.save();
        ctx.strokeStyle = targetOccupied ? '#f87171' : '#34d399';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.ellipse(tsx, tsy + TILE_H / 2, 28, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Soft ground shadow of the lifted object
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(tsx, tsy + TILE_H / 2 + 6, 22, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Lifted floating object (floats 14px above tile with aura)
        ctx.save();
        ctx.translate(0, -14);
        ctx.shadowColor = targetOccupied ? '#ef4444' : '#10b981';
        ctx.shadowBlur = 12;
        drawItem(activeDrag.item.type, tsx, tsy, true, activeDrag.item);
        ctx.restore();
        ctx.restore();
      }

      // Ghost preview when planting or moving
      const previewItem = currentBuildItem || (movingObjectRef.current ? BUILD_CATALOG.find(c => c.renderType === movingObjectRef.current.type) : null);
      if (previewItem && currentHovered && checkClearing(currentHovered.gx, currentHovered.gy)) {
        const isOccupied = currentPlaced.some(o =>
          o.gx === currentHovered.gx &&
          o.gy === currentHovered.gy &&
          !(movingObjectRef.current && o.gx === movingObjectRef.current.gx && o.gy === movingObjectRef.current.gy)
        );
        if (!isOccupied) {
          const { x: sx, y: sy } = toScreen(currentHovered.gx, currentHovered.gy, origin.x, origin.y);
          ctx.save();
          ctx.globalAlpha = 0.72;
          drawItem(previewItem.renderType, sx, sy, false, { level: 1 });
          ctx.restore();
        }
      }

      // 5. SCREEN-EDGE BORDER TREES (Natural scenic framing on right and bottom edges)
      drawScreenEdgeForest(width, height, isSunset, isNight);

      // 6. NATURE CREATURES (Fluttering Butterflies, Glowing Crickets/Fireflies)

      // B. Fluttering colorful butterflies over the meadow
      butterflies.forEach(bf => {
        bf.phase += 0.08;
        bf.x += bf.vx + Math.sin(bf.phase) * 0.9;
        bf.y += bf.vy + Math.cos(bf.phase * 0.7) * 0.7;
        if (bf.x < -40) bf.x = width + 40;
        if (bf.x > width + 40) bf.x = -40;
        if (bf.y < height * 0.15) bf.y = height * 0.75;
        if (bf.y > height * 0.85) bf.y = height * 0.25;
        drawButterfly(bf);
      });

      // C. Crickets / Fireflies dancing over the grass (magical at sunset & night)
      fireflies.forEach(f => {
        f.phase += f.pulseSpeed;
        f.x += f.vx + Math.sin(f.phase) * 0.4;
        f.y += f.vy + Math.cos(f.phase * 0.8) * 0.35;
        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < height * 0.18) f.y = height * 0.82;
        if (f.y > height * 0.85) f.y = height * 0.22;
        drawFirefly(f, isNight, isSunset);
      });

      // Atmosphere tint (clean & lightweight)
      if (isSunset) {
        ctx.save();
        const sunsetVignette = ctx.createRadialGradient(width * 0.25, height * 0.25, 100, width * 0.5, height * 0.5, width * 0.8);
        sunsetVignette.addColorStop(0, 'rgba(251, 146, 60, 0.12)');
        sunsetVignette.addColorStop(0.5, 'rgba(244, 63, 94, 0.05)');
        sunsetVignette.addColorStop(1, 'rgba(49, 14, 65, 0.22)');
        ctx.fillStyle = sunsetVignette;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      } else if (isNight) {
        ctx.save();
        const nightVignette = ctx.createRadialGradient(width * 0.5, height * 0.5, 200, width * 0.5, height * 0.5, width * 0.9);
        nightVignette.addColorStop(0, 'rgba(15, 23, 42, 0.20)');
        nightVignette.addColorStop(1, 'rgba(2, 6, 23, 0.55)');
        ctx.fillStyle = nightVignette;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Convert screen mouse coordinates to tile coordinates
  const getTileCoordsFromEvent = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const originX = canvas.width / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0);
    const originY = canvas.height * 0.17 + (cameraPanRef.current ? cameraPanRef.current.y : 0);

    const relX = mouseX - originX;
    const relY = mouseY - originY;

    const gx = Math.floor((relY / (TILE_H / 2) + relX / (TILE_W / 2)) / 2);
    const gy = Math.floor((relY / (TILE_H / 2) - relX / (TILE_W / 2)) / 2);

    return { gx, gy, clientX, clientY };
  };

  // Smart object hit detection: exact tile takes precedence, tall objects tested only on empty tiles
  const findPlacedObjectAtPos = (clientX, clientY, gx, gy) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const placed = placedObjectsRef.current || [];

    // 1. Direct hit: If there is an object directly on the clicked tile, it takes absolute precedence!
    const directHit = placed.find(o => o.gx === gx && o.gy === gy);
    if (directHit) {
      return directHit;
    }

    // 2. Only if the clicked tile is empty: check if user clicked on the upper canopy/roof of a tall object
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const originX = canvas.width / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0);
    const originY = canvas.height * 0.17 + (cameraPanRef.current ? cameraPanRef.current.y : 0);

    // Filter to tall objects only (trees, buildings) sorted front-to-back
    const tallObjects = placed
      .filter(o =>
        o.type.includes('tree') ||
        o.type === 'cherry_blossom' ||
        o.type === 'willow' ||
        o.type === 'sakura_tree' ||
        o.type === 'wooden_cabin' ||
        o.type === 'bakery' ||
        o.type === 'windmill' ||
        o.type === 'crystal_mine' ||
        o.type === 'farm' ||
        o.type === 'greenhouse' ||
        o.type === 'art_studio'
      )
      .sort((a, b) => (b.gx + b.gy) - (a.gx + a.gy));

    for (const obj of tallObjects) {
      const sx = originX + (obj.gx - obj.gy) * (TILE_W / 2);
      const sy = originY + (obj.gx + obj.gy) * (TILE_H / 2);
      const cx = sx;
      const cy = sy + TILE_H / 2;

      let topOffset = 65;
      let halfWidth = 30;
      if (obj.type.includes('tree') || obj.type === 'sakura_tree') {
        topOffset = 75;
        halfWidth = 32;
      }

      // Check within tall canopy bounds (above the tile base)
      const inX = Math.abs(mouseX - cx) <= halfWidth;
      const inY = mouseY >= (cy - topOffset) && mouseY < cy;

      if (inX && inY) {
        return obj;
      }
    }

    return null;
  };

  // Cultivate single frontier plot
  const handleCultivatePlot = (gx, gy) => {
    if (seeds < PLOT_CULTIVATION_COST) {
      sounds.playTap();
      alert(`נדרשים ${PLOT_CULTIVATION_COST} זרעי טיפוח כדי להכשיר חלקה זו. השלם כוונות ביומן כדי לצבור זרעים!`);
      return;
    }

    sounds.playCultivate();
    setSeeds(s => s - PLOT_CULTIVATION_COST);

    const newPlot = { gx, gy, cultivatedAt: Date.now() };
    setCultivatedPlots(prev => [...prev, newPlot]);
    setFrontierInspectTile(null);

    const canvas = canvasRef.current;
    if (canvas) {
      const origin = {
        x: canvas.width / 2 + cameraPan.x,
        y: canvas.height * 0.17 + cameraPan.y
      };
      const screenPos = {
        x: origin.x + (gx - gy) * (TILE_W / 2),
        y: origin.y + (gx + gy) * (TILE_H / 2)
      };
      const rect = canvas.getBoundingClientRect();
      confetti({
        particleCount: 26,
        spread: 45,
        origin: {
          x: Math.max(0, Math.min(1, (screenPos.x + rect.left) / window.innerWidth)),
          y: Math.max(0, Math.min(1, (screenPos.y + rect.top) / window.innerHeight))
        },
        colors: ['#a3e635', '#fde047', '#34d399', '#ca8a04']
      });
    }

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.8;
      v.emote = '🌱';
      v.emoteTimer = 130;
      const quote = CULTIVATION_QUOTES[Math.floor(Math.random() * CULTIVATION_QUOTES.length)];
      v.bubble = { text: quote, timer: 300 };
    }
  };

  // Upgrade Territory Tier
  const handleUpgradeTier = (targetTier, cost) => {
    if (seeds < cost) {
      sounds.playTap();
      alert(`נדרשים ${cost} זרעי טיפוח לשדרוג נחלה זו.`);
      return;
    }

    sounds.playTerritoryExpand();
    setSeeds(s => s - cost);
    setExpansionTier(targetTier);

    confetti({
      particleCount: 75,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#f472b6', '#34d399', '#fde047', '#60a5fa', '#a855f7']
    });

    const tierName = EXPANSION_TIERS.find(t => t.tier === targetTier)?.name || '';
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -7.5;
      v.emote = '🏰';
      v.emoteTimer = 180;
      v.bubble = {
        text: `הנחלה שודרגה ל${tierName}! שטח הכפר התרחב ויש לנו מרחב עצום לפרוח! 🌿✨`,
        timer: 360
      };
    }
  };

  // Batch Cultivate
  const handleBatchCultivate = (count, cost) => {
    if (seeds < cost) return;
    sounds.playTerritoryExpand();
    setSeeds(s => s - cost);

    const newPlots = [];
    for (let gy = 0; gy < GRID_SIZE; gy++) {
      for (let gx = 0; gx < GRID_SIZE; gx++) {
        if (newPlots.length >= count) break;
        if (isCultivableFrontierHelper(gx, gy, expansionTier, [...cultivatedPlots, ...newPlots])) {
          newPlots.push({ gx, gy, cultivatedAt: Date.now() });
        }
      }
    }

    if (newPlots.length > 0) {
      setCultivatedPlots(prev => [...prev, ...newPlots]);
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fde047', '#a3e635']
      });
      const v = animEntitiesRef.current.villager;
      if (v) {
        v.hopVy = -6.0;
        v.emote = '🌾';
        v.emoteTimer = 150;
        v.bubble = {
          text: `הכשרנו בהצלחה ${newPlots.length} חלקות אדמה חדשות בכפר! 🌱✨`,
          timer: 320
        };
      }
    }
  };

  // Build institution from modal
  const handleBuildInstitution = (inst) => {
    const catalogItem = BUILD_CATALOG.find(c => c.renderType === inst.id);
    if (catalogItem) {
      sounds.playTap();
      setSelectedBuildItem(catalogItem);
      setShowInstitutionsModal(false);
    }
  };

  // Upgrade institution to next level
  const handleUpgradeInstitution = (placedObj, nextLevelData) => {
    const cost = nextLevelData.upgradeCost;
    if (!cost) return;

    // Deduct costs
    if (cost.seeds) setSeeds(s => Math.max(0, s - cost.seeds));
    if (cost.veggies || cost.harvest || cost.crystals) {
      setVillageResources(prev => ({
        veggies: Math.max(0, (prev.veggies || 0) - (cost.veggies || 0)),
        harvest: Math.max(0, (prev.harvest || 0) - (cost.harvest || 0)),
        crystals: Math.max(0, (prev.crystals || 0) - (cost.crystals || 0))
      }));
    }

    // Play building upgrade fanfare sound
    sounds.playBuildingUpgrade();
    confetti({
      particleCount: 55,
      spread: 70,
      origin: { y: 0.55 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#fde047']
    });

    // Update placed object level
    setPlacedObjects(prev => prev.map(o => {
      if (o.gx === placedObj.gx && o.gy === placedObj.gy) {
        return { ...o, level: nextLevelData.level };
      }
      return o;
    }));

    // Villager celebration
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -6.8;
      v.emote = '⭐';
      v.emoteTimer = 160;
      v.bubble = {
        text: `איזה שדרוג מפואר! ${nextLevelData.title} עומד גאה בכפר שלנו! 🏰✨`,
        timer: 340
      };
    }
  };

  // Collect produce from an institution
  const handleCollectProduce = (placedObj) => {
    const config = INSTITUTIONS_CONFIG[placedObj.type];
    if (!config) return;

    const amount = placedObj.readyProduce || 0;
    if (amount <= 0) return;

    sounds.playHarvest();
    setVillageResources(prev => ({
      ...prev,
      [config.resourceKey]: (prev[config.resourceKey] || 0) + amount
    }));

    setPlacedObjects(prev => prev.map(o => {
      if (o.gx === placedObj.gx && o.gy === placedObj.gy) {
        return { ...o, readyProduce: 0 };
      }
      return o;
    }));

    // Harvesting confetti
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.65 },
      colors: ['#34d399', '#fde047', '#f472b6', '#38bdf8']
    });

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.0;
      v.emote = config.resourceIcon;
      v.emoteTimer = 130;
      v.bubble = {
        text: `קצרנו בהצלחה ${amount} ${config.resourceName}! המזווה של הכפר מתמלא בשפע! ${config.resourceIcon}✨`,
        timer: 300
      };
    }
  };

  // Remove placed object with seed refund
  const handleRemoveObject = (obj) => {
    if (!obj) return;
    const catItem = BUILD_CATALOG.find(c => c.renderType === obj.type);
    const refund = catItem?.costSeeds || 10;
    sounds.playTap();
    setSeeds(s => s + refund);
    setPlacedObjects(prev => prev.filter(o => !(o.gx === obj.gx && o.gy === obj.gy)));
    setInspectedObject(null);
    setMovingObject(null);

    confetti({
      particleCount: 18,
      spread: 40,
      origin: { y: 0.65 },
      colors: ['#a7f3d0', '#6ee7b7', '#fde047']
    });

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.bubble = { text: `הפריט הוסר מהכפר וקיבלנו חזרה ${refund} זרעי טיפוח! 🧹🌱`, timer: 260 };
      v.emote = '🧹';
      v.emoteTimer = 110;
    }
  };

  // Add 100 free inspiration seeds for unhindered creation
  const handleAddInspirationSeeds = () => {
    sounds.playNourish();
    setSeeds(s => s + 100);
    confetti({
      particleCount: 40,
      spread: 65,
      origin: { y: 0.5 },
      colors: ['#34d399', '#fde047', '#60a5fa', '#f472b6']
    });
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.8;
      v.bubble = { text: 'קיבלת 100 זרעי השראה לבנייה ויצירה חופשית! ✨🌿', timer: 280 };
      v.emote = '✨';
      v.emoteTimer = 140;
    }
  };

  // Direct villager to visit placed object (calm, continuous stroll)
  const handleDirectVillagerToItem = (item) => {
    const v = animEntitiesRef.current.villager;
    if (!v) return;

    sounds.playTap();

    // Map item type to cozy activity if applicable
    let actType = 'strolling';
    if (item.type === 'tea_table') actType = 'drinking_tea';
    else if (item.type === 'reading_bench') actType = 'reading_book';
    else if (item.type === 'bonfire') actType = 'bonfire_warming';
    else if (item.type === 'flower_garden' || item.type === 'greenhouse') actType = 'gardening';
    else if (item.type === 'river_tile' || item.type === 'water_lily_pond') actType = 'swimming';
    else if (item.type === 'veggie_garden') actType = 'tending_crops';
    else if (item.type === 'farm') actType = 'farming_wheat';
    else if (item.type === 'crystal_mine') actType = 'mining_gems';
    else if (item.type === 'oak_tree' || item.type === 'bush') actType = 'picking_fruit';

    const startGx = v.currGx;
    const startGy = v.currGy;
    const dx = item.gx - startGx;
    const dy = item.gy - startGy;
    const dist = Math.hypot(dx, dy);

    let destGx = item.gx;
    let destGy = item.gy;
    if (dist > 0.85) {
      // Gently stop in front / beside the object so character doesn't overlap the object sprite
      destGx = item.gx - (dx / dist) * 0.8;
      destGy = item.gy - (dy / dist) * 0.8;
    }

    v.startGx = startGx;
    v.startGy = startGy;
    v.targetGx = destGx;
    v.targetGy = destGy;
    v.progress = 0;
    v.activityTarget = { gx: item.gx, gy: item.gy, type: actType };
    v.activity = null;
    v.idleTimer = 0;
    v.hopVy = -3.5;

    const dScreenX = (destGx - destGy) - (startGx - startGy);
    if (dScreenX < 0) v.facingLeft = true;
    else if (dScreenX > 0) v.facingLeft = false;

    const itemName = BUILD_CATALOG.find(c => c.renderType === item.type)?.name || 'פינה זו';
    v.bubble = { text: `יוצא לטייל בנחת ל${itemName}... 🌿🍃`, timer: 280 };
    v.emote = '🚶‍♂️';
    v.emoteTimer = 120;
  };

  // Update commemorated memory and date for an object
  const handleUpdateObjectMemory = (gx, gy, newMemory, newDate) => {
    sounds.playNourish();
    setPlacedObjects(prev => prev.map(o => {
      if (o.gx === gx && o.gy === gy) {
        return {
          ...o,
          memory: newMemory,
          dedicatedTo: newMemory,
          date: newDate
        };
      }
      return o;
    }));
    setInspectedObject(prev => prev ? {
      ...prev,
      memory: newMemory,
      dedicatedTo: newMemory,
      date: newDate
    } : null);

    confetti({
      particleCount: 22,
      spread: 45,
      origin: { y: 0.65 },
      colors: ['#34d399', '#fde047', '#60a5fa']
    });

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -4.5;
      v.bubble = { text: 'הזיכרון נשמר והונצח בפינה זו באהבה! 💭✨', timer: 260 };
      v.emote = '💖';
      v.emoteTimer = 110;
    }
  };

  // Pick fruit from fruit tree or bush
  const handlePickFruit = (obj) => {
    sounds.playNourish();
    setFruitsEaten(f => f + 1);
    confetti({
      particleCount: 20,
      spread: 45,
      origin: { y: 0.6 },
      colors: ['#ef4444', '#f87171', '#fde047']
    });
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.0;
      v.bubble = { text: 'יאמי! פרי עסיסי ומתוק הישר מהעץ! 🍎✨', timer: 260 };
      v.emote = '🍎';
      v.emoteTimer = 120;
    }
  };

  // Switch to click-to-move tool from memory card
  const handleStartMoveObject = (obj) => {
    sounds.playTap();
    setMovingObject(obj);
    setIsMoveToolActive(true);
    setInspectedObject(null);
  };

  // Send villager to work at institution
  const handleSendVillagerToWork = (instType) => {
    let act = 'strolling';
    if (instType === 'veggie_garden') act = 'tending_crops';
    else if (instType === 'farm') act = 'farming_wheat';
    else if (instType === 'crystal_mine') act = 'mining_gems';
    handleDirectVillager(act);
    setShowInstitutionsModal(false);
  };

  // Focus camera on institution
  const handleFocusInstitution = (placedObj) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    sounds.playTap();
    setShowInstitutionsModal(false);

    const dx = (placedObj.gx - placedObj.gy) * (TILE_W / 2);
    const dy = (placedObj.gx + placedObj.gy) * (TILE_H / 2);

    setCameraPan({
      x: -dx,
      y: -dy + (canvas.height * 0.15)
    });

    setInspectedObject(placedObj);
  };


  // Mouse / Touch Down: Initiate click, long-press drag, or camera pan
  const handlePointerDown = (e) => {
    const coords = getTileCoordsFromEvent(e);
    if (!coords) return;
    const { gx, gy, clientX, clientY } = coords;

    // Check if clicked directly on the player villager character!
    const v = animEntitiesRef.current.villager;
    if (v) {
      const canvas = canvasRef.current;
      const rect = canvas ? canvas.getBoundingClientRect() : { left: 0, top: 0 };
      const clickScreenX = clientX - rect.left;
      const clickScreenY = clientY - rect.top;
      const vScreen = v.screenPos || {
        x: (canvas ? canvas.width / 2 : 0) + (cameraPanRef.current?.x || 0) + (v.currGx - v.currGy) * (TILE_W / 2),
        y: (canvas ? canvas.height * 0.17 : 0) + (cameraPanRef.current?.y || 0) + (v.currGx + v.currGy) * (TILE_H / 2) + TILE_H / 2
      };
      const dist = Math.hypot(clickScreenX - vScreen.x, clickScreenY - (vScreen.y - 18));
      const gridDist = Math.hypot(gx - v.currGx, gy - v.currGy);
      if (dist < 34 || gridDist < 0.95) {
        sounds.playTap();
        v.hopVy = -6.5;
        v.hopY = -1;
        v.emote = '👗';
        v.emoteTimer = 130;
        confetti({
          particleCount: 22,
          spread: 45,
          origin: {
            x: clientX / window.innerWidth,
            y: (clientY - 20) / window.innerHeight
          },
          colors: ['#f472b6', '#fde047', '#6ee7b7']
        });
        setWardrobeInitialTab('wardrobe');
        setShowWardrobe(true);
        pointerDownInfoRef.current = null;
        return;
      }
    }

    const inClearing = checkClearing(gx, gy);
    const isFrontier = !inClearing && checkFrontier(gx, gy);

    // Smart hit detection: check if an object is clicked (including vertical bounds & isometric silhouette)
    const itemOnTile = findPlacedObjectAtPos(clientX, clientY, gx, gy);

    pointerDownInfoRef.current = {
      gx: itemOnTile ? itemOnTile.gx : gx,
      gy: itemOnTile ? itemOnTile.gy : gy,
      clickGx: gx,
      clickGy: gy,
      inClearing,
      isFrontier,
      startX: clientX,
      startY: clientY,
      lastX: clientX,
      lastY: clientY,
      hasMoved: false,
      item: itemOnTile
    };
  };

  // Mouse / Touch Move: Update hover tile, instant drag, or pan camera (0 React re-renders during move)
  const handlePointerMove = (e) => {
    const coords = getTileCoordsFromEvent(e);
    if (!coords) return;
    const { gx, gy, clientX, clientY } = coords;

    const inClearing = checkClearing(gx, gy);
    const isFrontier = !inClearing && checkFrontier(gx, gy);

    // Update hovered tile directly into ref so canvas paints at 60 FPS without React re-render
    if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE && (inClearing || isFrontier)) {
      hoveredTileRef.current = { gx, gy, isFrontier };
    } else {
      hoveredTileRef.current = null;
    }

    // Cursor appearance
    const canvas = canvasRef.current;
    if (canvas && !activeDragRef.current) {
      const v = animEntitiesRef.current.villager;
      const rect = canvas.getBoundingClientRect();
      const isOverVillager = v && (
        (v.screenPos && Math.hypot(clientX - rect.left - v.screenPos.x, clientY - rect.top - (v.screenPos.y - 18)) < 34) ||
        Math.hypot(gx - v.currGx, gy - v.currGy) < 0.95
      );

      const hoveredObj = findPlacedObjectAtPos(clientX, clientY, gx, gy);

      if (isOverVillager) {
        canvas.style.cursor = 'pointer';
        canvas.title = 'לחץ על הדמות לפתיחת ארון הבגדים והסטיילינג 👗';
      } else if (movingObjectRef.current) {
        canvas.style.cursor = 'move';
        canvas.title = 'לחץ על משבצת פנויה להנחת הפריט';
      } else if (isDemolishModeRef.current) {
        canvas.style.cursor = 'not-allowed';
        canvas.title = 'לחץ להסרת הפריט ופינוי המשבצת 🧹';
      } else if (hoveredObj && !selectedBuildItemRef.current) {
        canvas.style.cursor = 'grab';
        canvas.title = 'לחץ לצפייה בזיכרון והתאריך 💭 | גרור להזזה ממקום למקום ✋';
      } else {
        canvas.style.cursor = 'default';
        canvas.title = '';
      }
    }

    const downInfo = pointerDownInfoRef.current;
    if (downInfo) {
      const totalDist = Math.hypot(clientX - downInfo.startX, clientY - downInfo.startY);

      if (totalDist > 5) {
        downInfo.hasMoved = true;

        // Instant Direct Drag & Drop: Pick up item immediately upon moving mouse
        if (downInfo.item && !activeDragRef.current && !isDemolishModeRef.current && !selectedBuildItemRef.current) {
          activeDragRef.current = {
            item: downInfo.item,
            originGx: downInfo.item.gx,
            originGy: downInfo.item.gy
          };
          draggingObjectRef.current = activeDragRef.current;
          setDraggingObject(activeDragRef.current);
          setInspectedObject(null);
          sounds.playTap();
          if (canvas) {
            canvas.style.cursor = 'grabbing';
          }
        } else if (!downInfo.item && !activeDragRef.current) {
          // Butter-smooth camera pan directly in ref
          const deltaX = clientX - downInfo.lastX;
          const deltaY = clientY - downInfo.lastY;
          if (cameraPanRef.current) {
            cameraPanRef.current = {
              x: cameraPanRef.current.x + deltaX,
              y: cameraPanRef.current.y + deltaY
            };
          }
          downInfo.lastX = clientX;
          downInfo.lastY = clientY;
        }
      }
    }
  };

  // Mouse / Touch Up: Complete drag-and-drop OR trigger click / move / build
  const handlePointerUp = () => {
    const downInfo = pointerDownInfoRef.current;

    // A. Drop active dragging item
    if (activeDragRef.current) {
      const activeDrag = activeDragRef.current;
      const target = hoveredTileRef.current;

      if (target && checkClearing(target.gx, target.gy)) {
        const isOccupied = placedObjects.some(o =>
          o.gx === target.gx &&
          o.gy === target.gy &&
          !(o.gx === activeDrag.originGx && o.gy === activeDrag.originGy)
        );

        if (!isOccupied) {
          sounds.playPlant();
          let movedItem = null;
          setPlacedObjects(prev => prev.map(o => {
            if (o.gx === activeDrag.originGx && o.gy === activeDrag.originGy) {
              movedItem = { ...o, gx: target.gx, gy: target.gy };
              return movedItem;
            }
            return o;
          }));
          confetti({
            particleCount: 22,
            spread: 45,
            origin: { y: 0.65 }
          });
          const v = animEntitiesRef.current.villager;
          if (v) {
            v.emote = '🏡';
            v.emoteTimer = 110;
          }
        } else {
          sounds.playTap();
        }
      } else {
        sounds.playTap();
      }

      activeDragRef.current = null;
      draggingObjectRef.current = null;
      setDraggingObject(null);
      pointerDownInfoRef.current = null;
      return;
    }

    // Sync camera pan state once when drag pan ends
    if (downInfo && downInfo.hasMoved && !downInfo.item) {
      if (cameraPanRef.current) {
        setCameraPan({ ...cameraPanRef.current });
      }
      pointerDownInfoRef.current = null;
      return;
    }

    // B. Single Click (no move)
    if (downInfo && !downInfo.hasMoved) {
      const gx = downInfo.clickGx ?? downInfo.gx;
      const gy = downInfo.clickGy ?? downInfo.gy;
      const existing = downInfo.item || placedObjects.find(o => o.gx === gx && o.gy === gy);

      // Frontier Plot Click (Expanding / Cultivating Land)
      const isFrontier = checkFrontier(gx, gy);
      if (isFrontier && !existing) {
        if (selectedBuildItem && selectedBuildItem.renderType === 'cultivated_plot_tile') {
          handleCultivatePlot(gx, gy);
          if (!continuousBuild) setSelectedBuildItem(null);
          pointerDownInfoRef.current = null;
          return;
        }

        if (isCultivatingMode || (!selectedBuildItem && !movingObject && !isDemolishMode)) {
          handleCultivatePlot(gx, gy);
          pointerDownInfoRef.current = null;
          return;
        }

        if (selectedBuildItem) {
          const totalCost = selectedBuildItem.costSeeds + PLOT_CULTIVATION_COST;
          if (seeds < totalCost) {
            sounds.playTap();
            alert(`חלקה זו עדיין פראית. נדרשים ${PLOT_CULTIVATION_COST} זרעים להכשרת המשבצת ועוד ${selectedBuildItem.costSeeds} לבנייה (סה"כ ${totalCost} זרעים). השלם כוונות ביומן או לחץ "+100 ✨"!`);
            pointerDownInfoRef.current = null;
            return;
          }
          // Cultivate frontier plot and place item
          handleCultivatePlot(gx, gy);
        }
      }

      // Meadow Tile or Object Click:
      if (existing || checkClearing(gx, gy)) {
        // Demolish Mode
        if (isDemolishMode) {
          if (existing) {
            handleRemoveObject(existing);
          } else {
            sounds.playTap();
          }
          pointerDownInfoRef.current = null;
          return;
        }

        // Relocating Active Moving Object: Clicking destination
        if (movingObject) {
          if (!existing || (existing.gx === movingObject.gx && existing.gy === movingObject.gy)) {
            if (existing && existing.gx === movingObject.gx && existing.gy === movingObject.gy) {
              // Clicked same item again -> cancel move
              sounds.playTap();
              setMovingObject(null);
            } else {
              sounds.playPlant();
              setPlacedObjects(prev => prev.map(o => (o.gx === movingObject.gx && o.gy === movingObject.gy) ? { ...o, gx, gy } : o));
              setMovingObject(null);
              setIsMoveToolActive(false);
              confetti({
                particleCount: 24,
                spread: 45,
                origin: { y: 0.65 }
              });
              const v = animEntitiesRef.current.villager;
              if (v) {
                v.emote = '🏡';
                v.emoteTimer = 110;
              }
            }
          } else {
            // Clicked another building -> switch moving to that one!
            sounds.playTap();
            setMovingObject(existing);
          }
          pointerDownInfoRef.current = null;
          return;
        }

        // Building Mode: Place item from catalog
        if (selectedBuildItem) {
          if (existing) {
            sounds.playTap();
            alert('משבצת זו כבר תפוסה על ידי פריט אחר.');
          } else if (seeds < selectedBuildItem.costSeeds) {
            sounds.playTap();
            alert('עוד לא נצברו מספיק זרעי טיפוח. לחץ על "+100 ✨" בסרגל העליון כדי לקבל זרעים חופשיים!');
          } else {
            sounds.playPlant();
            setSeeds(prev => Math.max(0, prev - selectedBuildItem.costSeeds));
            const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const memoryText = `רגע של ${selectedBuildItem.tag}`;
            const newObj = {
              gx,
              gy,
              type: selectedBuildItem.renderType,
              dedicatedTo: memoryText,
              memory: memoryText,
              date: todayStr,
              createdAt: Date.now()
            };
            setPlacedObjects(prev => [...prev, newObj]);
            setFrontierInspectTile(null);
            setInspectedObject(newObj);

            confetti({
              particleCount: 25,
              spread: 45,
              origin: { y: 0.65 }
            });

            if (!continuousBuild) {
              setSelectedBuildItem(null);
            }
          }
          pointerDownInfoRef.current = null;
          return;
        }

        // Direct clicking on any existing building:
        // OPEN MEMORY AND DATE!
        if (existing) {
          sounds.playTap();
          setInspectedObject(existing);
          setMovingObject(null);
        } else {
          setMovingObject(null);
          setInspectedObject(null);
        }
      }
    }

    pointerDownInfoRef.current = null;
  };

  // Fulfilling an authentic daily intention (Self-nourishment)
  const handleToggleIntention = (intentionId) => {
    setIntentions(prev => prev.map(item => {
      if (item.id === intentionId) {
        const nextState = !item.completed;
        if (nextState) {
          sounds.playNourish();
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.55 },
            colors: ['#f472b6', '#34d399', '#fde047', '#60a5fa']
          });
          setSeeds(s => s + item.seedsEarned);
        } else {
          setSeeds(s => Math.max(0, s - item.seedsEarned));
        }
        return { ...item, completed: nextState };
      }
      return item;
    }));
  };

  // Add custom wholesome intention
  const handleAddIntention = (e) => {
    e.preventDefault();
    if (!newIntentionText.trim()) return;

    const newIntention = {
      id: `i_${Date.now()}`,
      text: newIntentionText.trim(),
      category: newIntentionCategory,
      seedsEarned: 20,
      completed: false,
      note: 'רגע שנבחר מהלב'
    };

    setIntentions(prev => [newIntention, ...prev]);
    setNewIntentionText('');
    sounds.playTap();
  };

  // Handle changing clothes from Wardrobe Modal
  const handleSelectOutfit = (outfitId) => {
    sounds.playTap();
    setCurrentOutfit(outfitId);
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.outfit = outfitId;
      v.hopVy = -5.5;
      v.hopY = -1;
      const outfitQuotes = VILLAGER_THOUGHTS.outfit_change;
      v.bubble = {
        text: outfitQuotes[Math.floor(Math.random() * outfitQuotes.length)],
        timer: 300
      };
      v.emote = '✨';
      v.emoteTimer = 130;
    }
    confetti({
      particleCount: 22,
      spread: 45,
      origin: { y: 0.6 }
    });
  };

  // Handle direct request to perform an activity
  const handleDirectVillager = (activityId) => {
    const v = animEntitiesRef.current.villager;
    if (!v) return;

    sounds.playTap();
    const waterObjs = placedObjects.filter(o => o.type === 'river_tile' || o.type === 'water_lily_pond');
    const teaObjs = placedObjects.filter(o => o.type === 'tea_table');
    const gardenObjs = placedObjects.filter(o => o.type === 'flower_garden' || o.type === 'greenhouse' || o.type === 'bush');
    const fireObjs = placedObjects.filter(o => o.type === 'bonfire');
    const benchObjs = placedObjects.filter(o => o.type === 'reading_bench');

    let targetObj = null;
    let feedback = '';

    if (activityId === 'swimming') {
      if (waterObjs.length > 0) {
        targetObj = waterObjs[Math.floor(Math.random() * waterObjs.length)];
        feedback = 'הולך לטבול במים! שמתי את בגד הים וברווזון 🩱🌊';
      } else {
        v.bubble = { text: 'אין עדיין מים בכפר! הנח פלג מים בטיפוח הכפר כדי שאוכל לשחות 🌊', timer: 320 };
        v.emote = '🌊';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'drinking_tea') {
      if (teaObjs.length > 0) {
        targetObj = teaObjs[Math.floor(Math.random() * teaObjs.length)];
        feedback = 'הולך לפינת התה להכין כוס חמה ומהבילה 🍵';
      } else {
        v.bubble = { text: 'הנח פינת תה בכפר כדי שנוכל לשבת לשתות תה בנחת 🍵', timer: 320 };
        v.emote = '🍵';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'gardening') {
      if (gardenObjs.length > 0) {
        targetObj = gardenObjs[Math.floor(Math.random() * gardenObjs.length)];
        feedback = 'יוצא לגנן ולהשקות את הצמחים במשפך הגינה! 🌱';
      } else {
        feedback = 'יוצא לטפח את עשבי הבר של הכפר 🌱';
      }
    } else if (activityId === 'bonfire_warming') {
      if (fireObjs.length > 0) {
        targetObj = fireObjs[Math.floor(Math.random() * fireObjs.length)];
        feedback = 'הולך להתחמם ליד המדורה הנעימה 🔥';
      } else {
        v.bubble = { text: 'הנח מדורה בכפר כדי שנוכל להתחמם לצידה 🔥', timer: 320 };
        v.emote = '🔥';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'reading_book') {
      if (benchObjs.length > 0) {
        targetObj = benchObjs[Math.floor(Math.random() * benchObjs.length)];
        feedback = 'הולך לספסל לשקוע בספר טוב 📖';
      } else {
        feedback = 'הולך למצוא פינה שקטה לקרוא ספר 📖';
      }
    } else if (activityId === 'picking_fruit') {
      const treeObjs = placedObjects.filter(o => o.type === 'oak_tree' || o.type === 'bush');
      if (treeObjs.length > 0) {
        targetObj = treeObjs[Math.floor(Math.random() * treeObjs.length)];
        feedback = 'הולך לעץ האלון לקטוף תפוח אדום ועסיסי! 🍎✨';
      } else {
        v.bubble = { text: 'הנח עץ אלון או שיח בכפר כדי שאוכל לקטוף פירות טריים 🌳', timer: 320 };
        v.emote = '🌳';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'tending_crops') {
      const veggieObjs = placedObjects.filter(o => o.type === 'veggie_garden');
      if (veggieObjs.length > 0) {
        targetObj = veggieObjs[Math.floor(Math.random() * veggieObjs.length)];
        feedback = 'יוצא לערוגות הירק להשקות, לטפח ולנכש עשבים! 🥕🌱';
      } else {
        v.bubble = { text: 'הקם גינת ירק בכפר כדי שאוכל לעבוד בערוגות! 🥕', timer: 320 };
        v.emote = '🥕';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'farming_wheat') {
      const farmObjs = placedObjects.filter(o => o.type === 'farm');
      if (farmObjs.length > 0) {
        targetObj = farmObjs[Math.floor(Math.random() * farmObjs.length)];
        feedback = 'יוצא לחווה ולטחנת הרוח לערום חציר ולטחון קמח זהוב! 🌾🥖';
      } else {
        v.bubble = { text: 'בנה חוות תבואה בכפר כדי שאוכל לעבוד בשדות ובטחנת הרוח! 🌾', timer: 320 };
        v.emote = '🌾';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else if (activityId === 'mining_gems') {
      const mineObjs = placedObjects.filter(o => o.type === 'crystal_mine');
      if (mineObjs.length > 0) {
        targetObj = mineObjs[Math.floor(Math.random() * mineObjs.length)];
        feedback = 'שם קסדת כורים ויוצא לפיר המכרה לחצוב גבישי קריסטל זוהרים! 💎⛏️';
      } else {
        v.bubble = { text: 'בנה מכרה קריסטלים בכפר כדי שאוכל לחצוב אבני חן! 💎', timer: 320 };
        v.emote = '💎';
        v.emoteTimer = 130;
        setShowWardrobe(false);
        return;
      }
    } else {
      feedback = 'יוצא לטיול חופשי בין עצי הכפר והשבילים 🍃';
    }

    if (targetObj) {
      const startGx = v.currGx;
      const startGy = v.currGy;
      const dx = targetObj.gx - startGx;
      const dy = targetObj.gy - startGy;
      const dist = Math.hypot(dx, dy);

      let destGx = targetObj.gx;
      let destGy = targetObj.gy;
      if (dist > 0.85) {
        destGx = targetObj.gx - (dx / dist) * 0.8;
        destGy = targetObj.gy - (dy / dist) * 0.8;
      }

      v.startGx = startGx;
      v.startGy = startGy;
      v.targetGx = destGx;
      v.targetGy = destGy;
      v.progress = 0;
      v.activityTarget = { gx: targetObj.gx, gy: targetObj.gy, type: activityId };
      v.activity = null;
      v.idleTimer = 0;

      const dScreenX = (destGx - destGy) - (startGx - startGy);
      if (dScreenX < 0) v.facingLeft = true;
      else if (dScreenX > 0) v.facingLeft = false;
    } else {
      v.activity = null;
      v.activityTarget = null;
      v.idleTimer = 0;
    }

    v.hopVy = -5.5;
    v.bubble = { text: feedback, timer: 300 };
    v.emote = '✨';
    v.emoteTimer = 130;

    setShowWardrobe(false);
  };


  return (
    <div className="wholesome-sanctuary-root">
      {/* Top Intimate HUD */}
      <header className="sanctuary-header">
        <div className="header-left">
          <div className="seeds-badge" title="זרעי טיפוח שנצברו מרגעים של דאגה עצמית">
            <Sprout size={20} className="sprout-icon" />
            <div className="seeds-text-wrap">
              <span className="seeds-count">{seeds}</span>
              <span className="seeds-title">זרעי טיפוח</span>
            </div>
            <button
              className="quick-seeds-pill"
              onClick={(e) => { e.stopPropagation(); handleAddInspirationSeeds(); }}
              title="קבל 100 זרעי השראה לבנייה ויצירה חופשית"
            >
              +100 ✨
            </button>
          </div>
        </div>

        <div className="header-right">
          {/* Time of Day Mood Switcher */}
          <div className="tod-switcher-pill" title="זמן ביממה">
            <button
              className={`tod-btn ${timeOfDay === 'day' ? 'active' : ''}`}
              onClick={() => { sounds.playTap(); setTimeOfDay('day'); }}
              title="שעות יום"
            >
              <Sun size={15} />
            </button>
            <button
              className={`tod-btn ${timeOfDay === 'sunset' ? 'active' : ''}`}
              onClick={() => { sounds.playTap(); setTimeOfDay('sunset'); }}
              title="שעת שקיעה רומנטית"
            >
              <Sunset size={15} />
            </button>
            <button
              className={`tod-btn ${timeOfDay === 'night' ? 'active' : ''}`}
              onClick={() => { sounds.playTap(); setTimeOfDay('night'); }}
              title="לילה זרוע כוכבים וגחליליות"
            >
              <Moon size={15} />
            </button>
          </div>

          <button
            className="calm-icon-btn"
            onClick={toggleSound}
            title={soundMuted ? 'השמע צלילי טבע' : 'השתק'}
          >
            {soundMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>

          {/* Core Building & Creation Control */}
          <button
            className={`sanctuary-btn build-nav-btn ${showPlantingDrawer ? 'active' : ''}`}
            onClick={() => {
              sounds.playTap();
              setShowPlantingDrawer(!showPlantingDrawer);
            }}
            title="מרכז הבנייה והיצירה — בחר מבנים, עצים, שבילים וגשרים להקמה"
          >
            <Hammer size={17} className="text-amber" />
            <span className="build-nav-label">בנייה ויצירה 🛠️</span>
          </button>

          {/* Territory Expansion Control */}
          <button
            className={`sanctuary-btn expand-nav-btn ${isCultivatingMode ? 'active' : ''}`}
            onClick={() => {
              sounds.playTap();
              setIsCultivatingMode(!isCultivatingMode);
              if (!isCultivatingMode) {
                setSelectedBuildItem(null);
                setMovingObject(null);
                setIsDemolishMode(false);
              }
            }}
            title="הרחבת שטח הכפר — הוסף משבצות חדשות (Tiles) לקצוות הכפר"
          >
            <Sprout size={17} className="text-emerald" />
            <span className="expand-nav-label">הרחבת שטח 🌱</span>
          </button>

          <button
            className="sanctuary-btn journal-nav-btn"
            onClick={() => {
              sounds.playTap();
              setShowSanctuaryJournal(true);
            }}
            title="יומן הכוונות שלי"
          >
            <BookHeart size={17} />
            <span>יומן כוונות</span>
          </button>
        </div>
      </header>

      {/* Floating Cultivate / Add Tiles Mode Banner */}
      {isCultivatingMode && (
        <div className="wholesome-cultivate-banner">
          <span>🌱 מצב הרחבת שטח פעיל: לחץ על החלקות המהבהבות בגבול הכפר להוספת Tile חדש (עלות: {PLOT_CULTIVATION_COST} זרעים)</span>
          <button
            className="cancel-cultivate-pill"
            onClick={() => setIsCultivatingMode(false)}
          >
            סיום ✕
          </button>
        </div>
      )}

      {/* Floating Building Mode Banner */}
      {selectedBuildItem && (
        <div className="wholesome-plant-banner">
          <span>🛠️ בונה כעת: <strong>{selectedBuildItem.name}</strong> 🌿 {continuousBuild ? '(בנייה רציפה פעילה 🔁)' : ''} — לחץ על משבצת בדשא להנחה</span>
          <button
            className="cancel-plant-pill"
            onClick={() => setSelectedBuildItem(null)}
          >
            סיום ✕
          </button>
        </div>
      )}

      {/* Floating Moving Object Banner (Placing item) */}
      {movingObject && (
        <div className="wholesome-move-banner">
          <span>🔄 מעביר את: <strong>{BUILD_CATALOG.find(c => c.renderType === movingObject.type)?.name || 'פריט'}</strong> — לחץ על משבצת פנויה להנחה (או עליו שוב לביטול)</span>
          <button
            className="cancel-move-pill"
            onClick={() => { setMovingObject(null); setIsMoveToolActive(false); }}
          >
            ביטול העברה ✕
          </button>
        </div>
      )}

      {/* Floating Demolish Mode Banner */}
      {isDemolishMode && (
        <div className="wholesome-demolish-banner">
          <span>🧹 מצב פינוי והסרה פעיל: לחץ על כל פריט להסרתו וקבלת הזרעים חזרה</span>
          <button
            className="cancel-demolish-pill"
            onClick={() => setIsDemolishMode(false)}
          >
            סיום פינוי ✕
          </button>
        </div>
      )}

      {/* Main Sanctuary Meadow Canvas */}
      <main className="sanctuary-canvas-container">
        <canvas
          ref={canvasRef}
          className="sanctuary-canvas"
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          style={{ cursor: draggingObject ? 'grabbing' : isCultivatingMode ? 'crosshair' : 'pointer' }}
        />
      </main>

      {/* Recenter Camera Button (Shown if camera is panned) */}
      {(cameraPan.x !== 0 || cameraPan.y !== 0) && (
        <button
          className="recenter-cam-btn"
          onClick={() => { sounds.playTap(); setCameraPan({ x: 0, y: 0 }); }}
          title="מרכז את התצוגה למרכז הכפר"
        >
          <RotateCcw size={14} />
          <span>מרכז מבט</span>
        </button>
      )}


      {/* Rich Building & Creation Center Studio */}
      {showPlantingDrawer && (
        <aside className="wholesome-drawer build-center-drawer glass-card">
          <div className="drawer-head">
            <div className="drawer-title-row">
              <Hammer size={22} className="text-amber" />
              <div>
                <h3>מרכז הבנייה והיצירה</h3>
                <span className="build-subtitle">בחר מבנה, עץ, שביל או פינה שלווה לעיצוב הכפר</span>
              </div>
            </div>
            <button className="close-mini-btn" onClick={() => setShowPlantingDrawer(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Seeds balance & Creative Inspiration Boost */}
          <div className="build-seeds-bar">
            <div className="build-seeds-val">
              <Sprout size={16} className="text-emerald" />
              <span>יתרת זרעים: <strong>{seeds}</strong> 🌱</span>
            </div>
            <button
              className="inspiration-seeds-btn"
              onClick={handleAddInspirationSeeds}
              title="הענק לעצמך 100 זרעי השראה לבנייה ויצירה חופשית"
            >
              <Sparkles size={14} />
              <span>+100 זרעי השראה ✨</span>
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="build-category-tabs">
            {BUILD_CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`build-cat-tab ${selectedBuildCategory === cat ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setSelectedBuildCategory(cat);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Tool Bar */}
          <div className="build-tools-bar">
            <div className="build-search-wrap">
              <Search size={14} className="search-icon" />
              <input
                type="text"
                placeholder="חפש פריט לפי שם או סגנון..."
                value={buildSearchQuery}
                onChange={e => setBuildSearchQuery(e.target.value)}
                className="build-search-input"
              />
              {buildSearchQuery && (
                <button className="clear-search-btn" onClick={() => setBuildSearchQuery('')}>✕</button>
              )}
            </div>

            <div className="build-mode-toggles">
              <button
                className={`tool-toggle-btn expand-btn ${isCultivatingMode ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setIsCultivatingMode(!isCultivatingMode);
                  if (!isCultivatingMode) {
                    setSelectedBuildItem(null);
                    setShowPlantingDrawer(false);
                  }
                }}
                title="הוספת חלקות (Tiles) — לחץ על גבולות הכפר להרחבת השטח"
              >
                <Sprout size={13} />
                <span>הוסף Tiles 🌱</span>
              </button>

              <button
                className="tool-toggle-btn tier-btn"
                onClick={() => {
                  sounds.playTap();
                  setShowExpansionModal(true);
                  setShowPlantingDrawer(false);
                }}
                title="שדרוג נחלה — פתח את תפריט דרגות שטח הכפר"
              >
                <span>שדרוג נחלה 🏰</span>
              </button>

              <button
                className={`tool-toggle-btn ${continuousBuild ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setContinuousBuild(!continuousBuild);
                }}
                title="הנחה רציפה — מאפשרת לשתול שבילים או עצים ברצף ללא סגירה"
              >
                <RefreshCw size={13} />
                <span>רציף {continuousBuild ? '✓' : ''}</span>
              </button>

              <button
                className={`tool-toggle-btn demolish-btn ${isDemolishMode ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setIsDemolishMode(!isDemolishMode);
                  if (!isDemolishMode) setSelectedBuildItem(null);
                }}
                title="מצב פינוי — לחץ על פריטים בלוח להסרתם וקבלת הזרעים חזרה"
              >
                <Trash2 size={13} />
                <span>פינוי 🧹</span>
              </button>
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div className="wholesome-catalog-stack">
            {BUILD_CATALOG
              .filter(item => {
                if (selectedBuildCategory !== 'הכל' && item.category !== selectedBuildCategory) return false;
                if (buildSearchQuery.trim()) {
                  const q = buildSearchQuery.toLowerCase();
                  return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
                }
                return true;
              })
              .map(item => {
                const isSelected = selectedBuildItem?.id === item.id;
                const canAfford = seeds >= item.costSeeds;

                return (
                  <div
                    key={item.id}
                    className={`wholesome-card ${isSelected ? 'selected' : ''} ${!canAfford ? 'needs-nourish' : ''}`}
                    onClick={() => {
                      sounds.playTap();
                      setSelectedBuildItem(item);
                      setIsDemolishMode(false);
                      setMovingObject(null);
                      if (!continuousBuild) {
                        setShowPlantingDrawer(false);
                      }
                    }}
                  >
                    <div className="card-top-row">
                      <span className="card-emoji-title">
                        <span className="emoji-icon">{item.emoji}</span>
                        <strong className="card-name">{item.name}</strong>
                      </span>
                      <span className="seed-cost-pill">{item.costSeeds} זרעים</span>
                    </div>
                    <div className="card-cat-badge">{item.category} • {item.tag}</div>
                    <p className="card-desc">{item.desc}</p>
                    <div className="card-bottom-row">
                      <span className="reflection-prompt">💡 {item.reflectionPrompt}</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </aside>
      )}

      {/* Intimate Intentions Journal Modal */}
      {showSanctuaryJournal && (
        <div className="journal-backdrop" onClick={() => setShowSanctuaryJournal(false)}>
          <div className="journal-modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="journal-header">
              <div className="journal-title-wrap">
                <BookHeart size={26} className="text-rose" />
                <div>
                  <h2>יומן הכוונות והרגעים שלי</h2>
                  <span className="journal-sub">מרחב אישי להקשבה פנימית וטיפוח עצמי בקצב שלך</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setShowSanctuaryJournal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* List of gentle intentions */}
            <div className="intentions-list">
              {intentions.map(item => (
                <div
                  key={item.id}
                  className={`intention-item ${item.completed ? 'embraced' : ''}`}
                  onClick={() => handleToggleIntention(item.id)}
                >
                  <div className={`gentle-check ${item.completed ? 'checked' : ''}`}>
                    {item.completed && <CheckCircle2 size={20} />}
                  </div>
                  <div className="intention-text-box">
                    <div className="intention-top">
                      <span className="intention-label">{item.text}</span>
                      <span className="cat-chip">{item.category}</span>
                    </div>
                    <div className="intention-meta">
                      <span className="seeds-earned-text">+{item.seedsEarned} זרעי טיפוח</span>
                      {item.completed && <span className="nourished-badge">טופח באהבה 🌱</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add new personal intention */}
            <form onSubmit={handleAddIntention} className="add-intention-form">
              <input
                type="text"
                placeholder="איזו כוונה טובה או רגע תרצה להעניק לעצמך היום?..."
                value={newIntentionText}
                onChange={e => setNewIntentionText(e.target.value)}
                className="intention-input"
              />
              <select
                value={newIntentionCategory}
                onChange={e => setNewIntentionCategory(e.target.value)}
                className="intention-category-select"
              >
                <option value="מנוחה ונפש">מנוחה ונפש</option>
                <option value="הרגלים קטנים">הרגלים קטנים</option>
                <option value="למידה וסקרנות">למידה וסקרנות</option>
                <option value="תנועה ובריאות">תנועה ובריאות</option>
                <option value="קשרים אנושיים">קשרים אנושיים</option>
                <option value="הגשמה אישית">הגשמה אישית</option>
              </select>
              <button type="submit" className="add-intention-btn">
                <Plus size={18} />
                <span>הוסף כוונה</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Wardrobe, Styling & Activities Modal (Opened when clicking the villager character) */}
      <WardrobeModal
        isOpen={showWardrobe}
        onClose={() => setShowWardrobe(false)}
        currentOutfit={currentOutfit}
        onSelectOutfit={handleSelectOutfit}
        onSelectActivity={handleDirectVillager}
        villagerStatus={villagerLiveStatus}
        villagerLook={villagerLook}
        onUpdateVillagerLook={setVillagerLook}
        initialTab={wardrobeInitialTab}
        hasWaterTile={placedObjects.some(o => o.type === 'river_tile' || o.type === 'water_lily_pond')}
        hasTeaTile={placedObjects.some(o => o.type === 'tea_table')}
        hasBonfireTile={placedObjects.some(o => o.type === 'bonfire')}
        hasTreeTile={placedObjects.some(o => o.type === 'oak_tree' || o.type === 'bush')}
      />

      {/* Inspected Object Memory Card Modal */}
      {inspectedObject && !movingObject && !draggingObject && (
        <InspectedMemoryCard
          object={inspectedObject}
          onClose={() => setInspectedObject(null)}
          onUpdateMemory={handleUpdateObjectMemory}
          onRemove={handleRemoveObject}
          onVisit={handleDirectVillagerToItem}
        />
      )}

      {/* Village Territory Expansion & Land Cultivation Modal */}
      {showExpansionModal && (
        <div className="journal-backdrop expansion-backdrop" onClick={() => setShowExpansionModal(false)}>
          <div className="expansion-modal glass-card" onClick={e => e.stopPropagation()}>
            <div className="expansion-header">
              <div className="expansion-title-wrap">
                <Sprout size={26} className="text-emerald" />
                <div>
                  <h2>הרחבת שטח וגבולות הכפר</h2>
                  <span className="expansion-sub">הגדל את שטח הכפר, הכשר חלקות אדמה חדשות ובנה עולם שליו ורחב ידיים</span>
                </div>
              </div>
              <button className="close-mini-btn" onClick={() => setShowExpansionModal(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Quick Actions & Stats Banner */}
            <div className="expansion-quick-bar">
              <div className="expansion-stat-pill">
                <span className="stat-label">דרגת נחלה נוכחית:</span>
                <strong className="stat-val">{EXPANSION_TIERS.find(t => t.tier === expansionTier)?.name || 'קרחת יער שלווה'} ({expansionTier}/4)</strong>
              </div>
              <div className="expansion-stat-pill">
                <span className="stat-label">חלקות שהוכשרו:</span>
                <strong className="stat-val">{cultivatedPlots.length} משבצות 🌱</strong>
              </div>
              <div className="expansion-stat-pill">
                <span className="stat-label">יתרת זרעים:</span>
                <strong className="stat-val">{seeds} זרעים</strong>
              </div>
            </div>

            {/* Direct manual adding mode trigger */}
            <div className="expansion-mode-callout">
              <div className="callout-text">
                <strong>רוצה להוסיף חלקות בודדות במפה?</strong>
                <span>הפעל את מצב הרחבת שטח ולחץ ישירות על גבולות הכפר (10 זרעים לחלקה)</span>
              </div>
              <button
                className={`callout-action-btn ${isCultivatingMode ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setIsCultivatingMode(true);
                  setShowExpansionModal(false);
                  setShowPlantingDrawer(false);
                }}
              >
                <Plus size={16} />
                <span>הוספת Tiles על המפה 🌱</span>
              </button>
            </div>

            {/* Tiers List */}
            <div className="expansion-tiers-list">
              <h4 className="tiers-title">דרגות נחלה ושדרוג שטח:</h4>
              {EXPANSION_TIERS.map(t => {
                const isCurrent = t.tier === expansionTier;
                const isUnlocked = t.tier <= expansionTier;
                const canAfford = seeds >= t.costSeeds;

                return (
                  <div
                    key={t.tier}
                    className={`expansion-tier-card ${isCurrent ? 'current-tier' : ''} ${isUnlocked ? 'unlocked' : ''}`}
                  >
                    <div className="tier-badge-col">
                      <span className="tier-emoji">{t.badge}</span>
                      <span className="tier-num">דרגה {t.tier}</span>
                    </div>

                    <div className="tier-info-col">
                      <div className="tier-top-row">
                        <strong className="tier-name">{t.name}</strong>
                        <span className="tier-tag">{t.tag}</span>
                      </div>
                      <p className="tier-desc">{t.desc}</p>
                    </div>

                    <div className="tier-action-col">
                      {isCurrent ? (
                        <div className="current-badge-pill">נחלה נוכחית ✓</div>
                      ) : isUnlocked ? (
                        <div className="unlocked-badge-pill">הושלם ✓</div>
                      ) : (
                        <button
                          className={`upgrade-tier-btn ${!canAfford ? 'disabled' : ''}`}
                          onClick={() => handleUpgradeTier(t.tier, t.costSeeds)}
                          disabled={!canAfford}
                        >
                          <Sparkles size={14} />
                          <span>שדרוג ({t.costSeeds} זרעים)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Batch Expansion Tool */}
            <div className="batch-cultivate-row">
              <span className="batch-label">הכשרה מהירה:</span>
              <button
                className="batch-btn"
                onClick={() => handleBatchCultivate(5, 45)}
                disabled={seeds < 45}
                title="הכשר 5 חלקות סמוכות בבת אחת (חסכון של 5 זרעים!)"
              >
                <span>הכשרת 5 חלקות 🌾 (45 זרעים)</span>
              </button>
              <button
                className="batch-btn"
                onClick={() => handleBatchCultivate(10, 85)}
                disabled={seeds < 85}
                title="הכשר 10 חלקות סמוכות בבת אחת (חסכון של 15 זרעים!)"
              >
                <span>הכשרת 10 חלקות ✨ (85 זרעים)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
