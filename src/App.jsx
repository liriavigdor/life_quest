import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BUILD_CATALOG, BUILD_CATEGORIES, INITIAL_INTENTIONS, WARM_AFFIRMATIONS } from './data/catalog';
import { OUTFITS, ACTIVITIES, VILLAGER_THOUGHTS, DEFAULT_VILLAGER_LOOK } from './data/wardrobe';
import { WardrobeModal } from './components/WardrobeModal';
import { InspectedMemoryCard } from './components/InspectedMemoryCard';
import { BuildingInteriorModal } from './components/BuildingInteriorModal';
import { VillageInstitutionsModal } from './components/VillageInstitutionsModal';
import { drawCompleteVillager } from './utils/villagerRenderer';
import { drawAnimal } from './utils/animalRenderer';
import { drawParchmentBadge, stepBadgeReveal } from './utils/badgeRenderer';
import { loadSavedAnimals, saveAnimals, createAnimal, updateAnimalsSimulation } from './utils/animalSimulation';
import { PlayerController, drawDestinationIndicator } from './utils/playerController';
import { sounds } from './utils/sound';
import {
  Wheat,
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
  Hammer,
  Trash2,
  Search,
  RefreshCw,
  Brain,
  Tag,
  DoorOpen,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Compass,
  MapPin,
  Layers,
  GitBranch
} from 'lucide-react';
import { EXPANSION_TIERS, PLOT_CULTIVATION_COST, CULTIVATION_QUOTES } from './data/expansion';
import {
  BIOMES,
  VILLAGE_PRESETS,
  STORAGE_KEY_VILLAGES_REGISTRY,
  STORAGE_KEY_ACTIVE_VILLAGE,
  loadVillagesRegistry,
  saveVillagesRegistry
} from './data/villages';
import { VILLAGE_TEMPLATES } from './data/villageTemplates';
import { WorldRealmMapModal } from './components/WorldRealmMapModal';
import { VillageTemplatesModal } from './components/VillageTemplatesModal';
import { CognitiveSurveyModal } from './components/CognitiveSurveyModal';
import { StoryToMonumentModal } from './components/StoryToMonumentModal';
import { MemoryHierarchyTreeModal } from './components/MemoryHierarchyTreeModal';
import { drawStoryDiorama } from './utils/storyDioramaRenderer';
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
const GRID_ORIGIN_Y_RATIO = 0.065;

// Calculate optimal camera zoom and pan to fit the active village beautifully on any screen size,
// with dedicated mobile landscape optimization (Clash of Clans style)
function getOptimalCameraFit(w, h, placedList = [], cultivatedList = []) {
  let minGx = 8, maxGx = 17, minGy = 8, maxGy = 17;

  if (placedList && placedList.length > 0) {
    placedList.forEach(o => {
      if (typeof o.gx === 'number' && typeof o.gy === 'number') {
        minGx = Math.min(minGx, o.gx);
        maxGx = Math.max(maxGx, o.gx);
        minGy = Math.min(minGy, o.gy);
        maxGy = Math.max(maxGy, o.gy);
      }
    });
  }

  if (cultivatedList && cultivatedList.length > 0) {
    cultivatedList.forEach(p => {
      if (typeof p.gx === 'number' && typeof p.gy === 'number') {
        minGx = Math.min(minGx, p.gx);
        maxGx = Math.max(maxGx, p.gx);
        minGy = Math.min(minGy, p.gy);
        maxGy = Math.max(maxGy, p.gy);
      }
    });
  }

  // Margin around active plots
  minGx = Math.max(0, minGx - 1);
  maxGx = Math.min(GRID_SIZE - 1, maxGx + 1);
  minGy = Math.max(0, minGy - 1);
  maxGy = Math.min(GRID_SIZE - 1, maxGy + 1);

  const centerGx = (minGx + maxGx) / 2;
  const centerGy = (minGy + maxGy) / 2;

  const spanGx = maxGx - minGx + 1;
  const spanGy = maxGy - minGy + 1;
  const isoSpanW = (spanGx + spanGy) * (TILE_W / 2);
  const isoSpanH = (spanGx + spanGy) * (TILE_H / 2) + 95; // Account for 2.5D building/tree heights

  // Distinguish display modes
  const isLandscape = w > h;
  const isMobileLandscape = isLandscape && h < 560;
  const isMobilePortrait = !isLandscape && w < 540;

  let optimalZoom;
  let targetScreenY;

  if (isMobileLandscape) {
    // Clash of Clans Mobile Landscape Mode:
    // Screen is wide (e.g. 740-950px) but short (320-430px).
    // Height is the primary constraint. We frame both width & height comfortably!
    const availableH = h - 45; // Small margin for top/bottom HUD
    const availableW = w - 140; // Margin for side dock
    const zoomByH = availableH / Math.max(370, isoSpanH);
    const zoomByW = availableW / Math.max(540, isoSpanW);
    optimalZoom = Math.min(0.85, Math.max(0.36, Math.min(zoomByH, zoomByW)));
    // Dead center vertically on landscape screens
    targetScreenY = h * 0.52;
  } else if (isMobilePortrait) {
    const targetW = Math.max(520, isoSpanW);
    optimalZoom = Math.min(0.85, Math.max(0.36, (w - 20) / targetW));
    targetScreenY = h * 0.46;
  } else {
    // Desktop / Large screen
    const targetW = Math.max(680, isoSpanW);
    const targetH = Math.max(460, isoSpanH);
    const zoomW = (w - 100) / targetW;
    const zoomH = (h - 90) / targetH;
    optimalZoom = Math.min(1.2, Math.max(0.40, Math.min(zoomW, zoomH)));
    targetScreenY = h * 0.49;
  }

  // Center in world coordinates relative to origin
  const centerWorldX = (centerGx - centerGy) * (TILE_W / 2);
  const centerWorldY = (centerGx + centerGy) * (TILE_H / 2);

  const panX = Math.round(-centerWorldX * optimalZoom);
  const panY = Math.round(targetScreenY - (h * GRID_ORIGIN_Y_RATIO) - (centerWorldY * optimalZoom));

  return {
    zoom: Number(optimalZoom.toFixed(2)),
    pan: { x: panX, y: panY }
  };
}

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
    try {
      const activeVid = localStorage.getItem(STORAGE_KEY_ACTIVE_VILLAGE) || 'military';
      const rawReg = localStorage.getItem(STORAGE_KEY_VILLAGES_REGISTRY);
      if (rawReg) {
        const parsedReg = JSON.parse(rawReg);
        if (parsedReg && parsedReg[activeVid] && Array.isArray(parsedReg[activeVid].placedObjects) && parsedReg[activeVid].placedObjects.length > 0) {
          return parsedReg[activeVid].placedObjects;
        }
      }
      const initialPreset = VILLAGE_PRESETS.find(p => p.id === activeVid) || VILLAGE_PRESETS[0];
      return initialPreset.starterObjects;
    } catch {
      return VILLAGE_PRESETS[0].starterObjects;
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
  const [showPathsPalette, setShowPathsPalette] = useState(false);
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

  // Multi-Village & Biomes World Realm State (Method of Loci / Memory Sanctuaries)
  const [currentVillageId, setCurrentVillageId] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_VILLAGE) || 'military';
    } catch {
      return 'military';
    }
  });
  const currentVillageIdRef = useRef(currentVillageId);
  useEffect(() => { currentVillageIdRef.current = currentVillageId; }, [currentVillageId]);

  const [villagesRegistry, setVillagesRegistry] = useState(() => {
    return loadVillagesRegistry(null, 2, []);
  });

  const [showRealmMap, setShowRealmMap] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [showHierarchyTree, setShowHierarchyTree] = useState(false);
  const [travelingNotice, setTravelingNotice] = useState(null);

  // Keep active village data in sync with villagesRegistry
  useEffect(() => {
    setVillagesRegistry(prev => {
      if (!prev || !prev[currentVillageId]) return prev;
      const updated = {
        ...prev,
        [currentVillageId]: {
          ...prev[currentVillageId],
          placedObjects,
          expansionTier,
          cultivatedPlots,
          lastVisited: new Date().toISOString()
        }
      };
      saveVillagesRegistry(updated);
      return updated;
    });
  }, [placedObjects, expansionTier, cultivatedPlots, currentVillageId]);

  // Responsive camera zoom & pan state
  const [cameraZoom, setCameraZoom] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return getOptimalCameraFit(window.innerWidth, window.innerHeight).zoom;
  });
  const cameraZoomRef = useRef(cameraZoom);
  useEffect(() => {
    cameraZoomRef.current = cameraZoom;
  }, [cameraZoom]);

  const [cameraPan, setCameraPan] = useState(() => {
    if (typeof window === 'undefined') return { x: 0, y: 0 };
    return getOptimalCameraFit(window.innerWidth, window.innerHeight).pan;
  });
  const cameraPanRef = useRef(cameraPan);
  useEffect(() => {
    cameraPanRef.current = cameraPan;
  }, [cameraPan]);

  const hasUserPannedOrZoomedRef = useRef(false);
  const pinchRef = useRef(null);

  // Mobile Landscape Detection & Orientation Helper (Clash of Clans style)
  const lastOrientationRef = useRef(
    typeof window !== 'undefined' ? (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait') : 'landscape'
  );
  const [isMobilePortrait, setIsMobilePortrait] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerHeight > window.innerWidth && window.innerWidth < 640;
  });
  const [dismissedOrientationPrompt, setDismissedOrientationPrompt] = useState(false);

  // Fullscreen / Landscape toggle
  const handleToggleFullscreen = async () => {
    sounds.playTap();
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        if (screen.orientation && screen.orientation.lock) {
          try {
            await screen.orientation.lock('landscape');
          } catch (e) {
            console.log('Orientation lock unavailable', e);
          }
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (e) {
      console.log('Fullscreen error', e);
    }
  };

  // Reset & Center view to perfectly frame the village
  const handleFitToScreen = () => {
    sounds.playTap();
    const fit = getOptimalCameraFit(
      window.innerWidth,
      window.innerHeight,
      placedObjectsRef.current,
      cultivatedPlotsRef.current
    );
    setCameraZoom(fit.zoom);
    setCameraPan(fit.pan);
    cameraZoomRef.current = fit.zoom;
    cameraPanRef.current = fit.pan;
    hasUserPannedOrZoomedRef.current = false;
    const v = animEntitiesRef.current?.villager;
    if (v) {
      v.emote = '🧭';
      v.emoteTimer = 90;
      v.hopVy = -4.5;
    }
  };

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

  // Living Autonomous Animals State
  const [animals, setAnimals] = useState(loadSavedAnimals);
  const animalsRef = useRef(animals);
  useEffect(() => {
    animalsRef.current = animals;
    saveAnimals(animals);
  }, [animals]);

  // Mind Map Associative Tags Overlay
  const [showMindMapTags, setShowMindMapTags] = useState(true);
  const showMindMapTagsRef = useRef(showMindMapTags);
  useEffect(() => {
    showMindMapTagsRef.current = showMindMapTags;
  }, [showMindMapTags]);

  // Multi-dimensional Interior Building State
  const [interiorBuilding, setInteriorBuilding] = useState(null);

  // Gentle Daily Village Care Ritual State (מים לצמחים ואוכל לחיות)
  const todayStrDate = useMemo(() => new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' }), []);
  const [lastVillageCareDate, setLastVillageCareDate] = useState(() => localStorage.getItem('lifequest_village_care_date') || '');
  const isVillageCaredToday = lastVillageCareDate === todayStrDate;

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

  // Active Player Movement Controller (WASD, Arrows, Click-to-Move, Pathfinding)
  const playerControllerRef = useRef(null);
  if (!playerControllerRef.current) {
    playerControllerRef.current = new PlayerController({
      get current() {
        return animEntitiesRef.current?.villager;
      }
    }, {
      getPlacedObjects: () => placedObjectsRef.current,
      getAnimals: () => animalsRef.current || [],
      onProximityInteract: (interactable) => {
        if (interactable.type === 'building') {
          const catItem = BUILD_CATALOG.find(c => c.renderType === interactable.target.type || c.id === interactable.target.type);
          sounds.playTap();
          setInteriorBuilding({ building: interactable.target, catalogItem: catItem });
          setInspectedObject(null);
        } else if (interactable.type === 'animal') {
          sounds.playTap();
          const v = animEntitiesRef.current?.villager;
          if (v) {
            v.hopVy = -5.5;
            v.emote = '❤️';
            v.emoteTimer = 110;
          }
          const animal = interactable.target;
          if (animal) {
            animal.hopVy = -6.0;
            animal.emote = '❤️';
            animal.emoteTimer = 120;
          }
        }
      }
    });
  }

  useEffect(() => {
    const controller = playerControllerRef.current;
    if (controller) {
      controller.attachListeners();
      return () => controller.detachListeners();
    }
  }, []);

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
    if (dist > 18.5) return false;

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

      const currentOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
      const orientationChanged = currentOrientation !== lastOrientationRef.current;
      lastOrientationRef.current = currentOrientation;

      setIsMobilePortrait(window.innerHeight > window.innerWidth && window.innerWidth < 640);

      // Auto-adapt camera framing on resize or screen rotation!
      // If the orientation changed (e.g. phone turned to landscape), ALWAYS re-fit perfectly!
      if (orientationChanged || !hasUserPannedOrZoomedRef.current) {
        hasUserPannedOrZoomedRef.current = false;
        const fit = getOptimalCameraFit(
          window.innerWidth,
          window.innerHeight,
          placedObjectsRef.current,
          cultivatedPlotsRef.current
        );
        setCameraZoom(fit.zoom);
        setCameraPan(fit.pan);
        cameraZoomRef.current = fit.zoom;
        cameraPanRef.current = fit.pan;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    const onOrient = () => {
      setTimeout(resize, 80);
      setTimeout(resize, 260);
    };
    window.addEventListener('orientationchange', onOrient);

    // Desktop smooth mouse wheel zooming
    const handleCanvasWheel = (e) => {
      e.preventDefault();
      hasUserPannedOrZoomedRef.current = true;
      const factor = e.deltaY < 0 ? 1.08 : 0.92;
      setCameraZoom(prev => {
        const nextZoom = Math.min(1.7, Math.max(0.35, Number((prev * factor).toFixed(3))));
        cameraZoomRef.current = nextZoom;
        return nextZoom;
      });
    };
    canvas.addEventListener('wheel', handleCanvasWheel, { passive: false });

    const { butterflies, birds, fireflies, cloudShadows } = animEntitiesRef.current;

    // Warm wholesome grass palette
    const GRASS_1 = '#64af32'; // Fresh meadow green
    const GRASS_2 = '#5aa32a'; // Alternating soft checker
    const GRASS_3 = '#509623'; // Earthy shade
    const GRASS_HIGHLIGHT = '#6ebc37'; // Golden hour sun highlight

    const getOrigin = (w, h) => ({
      x: w / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0),
      y: h * GRID_ORIGIN_Y_RATIO + (cameraPanRef.current ? cameraPanRef.current.y : 0)
    });

    const toScreen = (gx, gy, ox, oy) => ({
      x: ox + (gx - gy) * (TILE_W / 2),
      y: oy + (gx + gy) * (TILE_H / 2)
    });

    // Ground-shadow lookup (visual only): flat ground pieces never get a shadow; radius is per-type footprint
    const FLAT_GROUND_TYPES = new Set([
      'river_tile', 'water_lily_pond', 'wooden_bridge', 'stone_bridge', 'cobblestone_road', 'stone_path',
      'dirt_trail', 'wood_path', 'brick_path', 'picnic_blanket', 'flower_garden', 'veggie_garden'
    ]);
    const SHADOW_RADIUS = {
      oak_tree: 26, pine_tree: 22, cypress_tree: 18, fruit_tree: 24, sakura_tree: 26, willow_tree: 28,
      bush: 15, custom_totem: 16, story_monument: 22, animal_coop: 32, library: 34, wooden_cabin: 34, greenhouse: 32, bakery: 32,
      farm: 34, crystal_mine: 30, windmill: 30, art_studio: 32, cozy_tent: 26, fountain: 26, wishing_well: 20,
      reading_bench: 18, bonfire: 14, lantern_post: 9, tea_table: 16, stone_wall: 16, wooden_fence: 16,
      floral_arch: 18, hammock: 24, sunflower_patch: 16, glow_mushrooms: 10
    };
    const hexToRgba = (hex, a) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
    };

    // Optional trailing args (visual only): seed = deterministic per-tile hash, featherBase = underlying
    // grass color so highlight tiles (dirt / meadow patches) melt softly into their neighbours.
    const drawTile = (sx, sy, color, isHovered, isBuildable, seed, featherBase) => {
      // Seam softening: the painted diamond overdraws its neighbours by ~0.5px so no hairlines show through
      const ex = 1.0, ey = 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy - ey);
      ctx.lineTo(sx + TILE_W / 2 + ex, sy + TILE_H / 2);
      ctx.lineTo(sx, sy + TILE_H + ey);
      ctx.lineTo(sx - TILE_W / 2 - ex, sy + TILE_H / 2);
      ctx.closePath();

      if (featherBase) {
        // Feathered patch: base grass + radial fade of the patch colour (fades to the SAME hue at alpha 0,
        // so there is no muddy dark halo), clipped to the diamond. Dense core = pool of sunlight.
        ctx.fillStyle = featherBase;
        ctx.fill();
        ctx.save();
        ctx.clip();
        const fcx = sx, fcy = sy + TILE_H / 2;
        const feather = ctx.createRadialGradient(fcx, fcy, 1, fcx, fcy, TILE_W * 0.55);
        feather.addColorStop(0, color);
        feather.addColorStop(0.55, color);
        feather.addColorStop(1, hexToRgba(color, 0));
        ctx.fillStyle = feather;
        ctx.fillRect(sx - TILE_W / 2 - 2, sy - 1, TILE_W + 4, TILE_H + 2);
        ctx.restore();
      } else {
        ctx.fillStyle = color;
        ctx.fill();
      }

      if (seed !== undefined) {
        // Seeded jitter: gentle cream / plum-brown tonal wash (max ~7% alpha) breaks the checkerboard
        let h = (Math.imul(seed ^ 0x9e3779b9, 1664525) + 1013904223) >>> 0;
        const r1 = h / 4294967296;
        const a = Math.abs(r1 - 0.5) * 0.14;
        ctx.fillStyle = r1 < 0.5 ? `rgba(42, 24, 16, ${a})` : `rgba(255, 244, 214, ${a})`;
        ctx.fill();

        // Tiny hand-drawn grass blades (single batched path per tile)
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
          const bx = sx + ((h & 0xff) / 255 - 0.5) * TILE_W * 0.5;
          h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
          const by = sy + TILE_H * 0.3 + ((h & 0xff) / 255) * TILE_H * 0.4;
          ctx.moveTo(bx - 1.2, by);
          ctx.lineTo(bx, by - 3.2);
          ctx.lineTo(bx + 1.2, by);
        }
        ctx.fillStyle = r1 < 0.5 ? 'rgba(255, 244, 214, 0.16)' : 'rgba(42, 24, 16, 0.14)';
        ctx.fill();
      }

      // Only stroke and highlight when tile is hovered or active (eliminates 34,500+ heavy stroke calls/sec)
      if (isHovered) {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + TILE_W / 2, sy + TILE_H / 2);
        ctx.lineTo(sx, sy + TILE_H);
        ctx.lineTo(sx - TILE_W / 2, sy + TILE_H / 2);
        ctx.closePath();
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

      // Soft ground contact shadow (ambient occlusion) so objects sit on the grass instead of floating
      if (typeof type === 'string' && !FLAT_GROUND_TYPES.has(type) && !type.startsWith('animal_')) {
        const shadowR = SHADOW_RADIUS[type] || 16;
        ctx.save();
        ctx.translate(cx, cy + 3);
        ctx.scale(1, 0.5);
        const sg = ctx.createRadialGradient(0, 0, shadowR * 0.15, 0, 0, shadowR);
        sg.addColorStop(0, 'rgba(45, 31, 24, 0.3)');
        sg.addColorStop(0.6, 'rgba(45, 31, 24, 0.18)');
        sg.addColorStop(1, 'rgba(45, 31, 24, 0)');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(0, 0, shadowR, 0, Math.PI * 2);
        ctx.fill();
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

        case 'cypress_tree': {
          ctx.save();
          // Elongated Mediterranean ground shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx + 4, cy + 8, 14, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#451a03';
          ctx.fillRect(cx - 2.5, cy - 8, 5, 15);

          // Flame-shaped tall Cypress silhouette
          // Shadow side (East)
          ctx.fillStyle = '#064e3b';
          ctx.beginPath();
          ctx.moveTo(cx, cy + 2);
          ctx.quadraticCurveTo(cx + 10, cy - 25, cx, cy - 58);
          ctx.lineTo(cx, cy + 2);
          ctx.fill();

          // Lit side (West)
          const cypressGrad = ctx.createLinearGradient(cx - 10, cy - 30, cx + 5, cy);
          cypressGrad.addColorStop(0, '#047857');
          cypressGrad.addColorStop(0.6, '#059669');
          cypressGrad.addColorStop(1, '#065f46');
          ctx.fillStyle = cypressGrad;
          ctx.beginPath();
          ctx.moveTo(cx, cy + 2);
          ctx.quadraticCurveTo(cx - 10, cy - 25, cx, cy - 58);
          ctx.lineTo(cx, cy + 2);
          ctx.fill();

          // Feathery foliage textures
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(cx - 7, cy - 18);
          ctx.quadraticCurveTo(cx - 9, cy - 26, cx - 2, cy - 38);
          ctx.stroke();

          // Sunlit golden tip highlight
          ctx.fillStyle = '#34d399';
          ctx.beginPath();
          ctx.ellipse(cx - 1, cy - 52, 2.5, 6, -0.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        case 'fruit_tree': {
          ctx.save();
          // Soft shadow
          ctx.fillStyle = 'rgba(15, 35, 10, 0.32)';
          ctx.beginPath();
          ctx.ellipse(cx + 6, cy + 8, 22, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          // Trunk
          ctx.fillStyle = '#5c2c16';
          ctx.fillRect(cx - 3, cy - 14, 6, 20);

          // Lush rounded foliage
          const fruitTreeGrad = ctx.createLinearGradient(cx - 20, cy - 45, cx + 20, cy);
          fruitTreeGrad.addColorStop(0, '#15803d');
          fruitTreeGrad.addColorStop(1, '#166534');
          ctx.fillStyle = fruitTreeGrad;
          ctx.beginPath();
          ctx.arc(cx - 7, cy - 24, 16, 0, Math.PI * 2);
          ctx.arc(cx + 7, cy - 24, 16, 0, Math.PI * 2);
          ctx.arc(cx, cy - 34, 17, 0, Math.PI * 2);
          ctx.fill();

          // Ripe golden lemons / fruits
          const fruits = [
            [-8, -20], [5, -28], [-2, -32], [9, -18], [-9, -30], [2, -22]
          ];
          fruits.forEach(([fx, fy]) => {
            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(cx + fx, cy + fy, 2.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx + fx - 0.7, cy + fy - 0.7, 0.8, 0, Math.PI * 2);
            ctx.fill();
          });

          ctx.restore();
          break;
        }

        case 'custom_totem': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 6, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Carved stone pedestal
          const pedGrad = ctx.createLinearGradient(cx - 10, cy - 14, cx + 10, cy + 5);
          pedGrad.addColorStop(0, '#94a3b8');
          pedGrad.addColorStop(0.5, '#64748b');
          pedGrad.addColorStop(1, '#475569');
          ctx.fillStyle = pedGrad;
          // Base
          ctx.beginPath();
          ctx.roundRect(cx - 11, cy + 1, 22, 6, 3);
          ctx.fill();
          // Pillar shaft
          ctx.beginPath();
          ctx.roundRect(cx - 7, cy - 10, 14, 12, 2);
          ctx.fill();
          // Capital / Top plate
          ctx.beginPath();
          ctx.roundRect(cx - 9, cy - 14, 18, 5, 2);
          ctx.fill();

          // Small moss/vines on stone
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(cx - 6, cy + 2, 2, 0, Math.PI * 2);
          ctx.arc(cx + 5, cy - 4, 1.8, 0, Math.PI * 2);
          ctx.fill();

          // Floating bobbing custom symbol/emoji
          const chosenSymbol = objData?.customEmoji || '🍭';
          const bobY = Math.sin(Date.now() * 0.003 + (cx % 10)) * 3;
          
          // Soft golden/magic aura under floating symbol
          ctx.fillStyle = 'rgba(253, 230, 138, 0.45)';
          ctx.beginPath();
          ctx.ellipse(cx, cy - 18 + bobY, 12, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '22px system-ui, -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(chosenSymbol, cx, cy - 25 + bobY);

          ctx.restore();
          break;
        }

        case 'story_monument': {
          drawStoryDiorama(ctx, cx, cy, objData, Date.now());
          break;
        }

        case 'animal_coop': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(20, 20, 10, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 8, 28, 14, 0, 0, Math.PI * 2);
          ctx.fill();

          // Wooden Coop Walls
          ctx.fillStyle = '#b45309';
          ctx.fillRect(cx - 18, cy - 16, 36, 22);

          // Wooden horizontal slats
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1;
          for (let y = cy - 12; y <= cy + 4; y += 4) {
            ctx.beginPath();
            ctx.moveTo(cx - 18, y);
            ctx.lineTo(cx + 18, y);
            ctx.stroke();
          }

          // Little arched doorway
          ctx.fillStyle = '#451a03';
          ctx.beginPath();
          ctx.roundRect(cx - 6, cy - 5, 12, 11, [6, 6, 0, 0]);
          ctx.fill();

          // Little wooden ramp
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.moveTo(cx - 4, cy + 6);
          ctx.lineTo(cx - 8, cy + 13);
          ctx.lineTo(cx + 8, cy + 13);
          ctx.lineTo(cx + 4, cy + 6);
          ctx.closePath();
          ctx.fill();

          // Cedar red pitched roof
          const roofGrad = ctx.createLinearGradient(cx - 22, cy - 30, cx + 22, cy - 14);
          roofGrad.addColorStop(0, '#dc2626');
          roofGrad.addColorStop(1, '#991b1b');
          ctx.fillStyle = roofGrad;
          ctx.beginPath();
          ctx.moveTo(cx - 22, cy - 14);
          ctx.lineTo(cx, cy - 30);
          ctx.lineTo(cx + 22, cy - 14);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Chicken silhouette on top of roof
          ctx.fillStyle = '#fbbf24';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🐔', cx, cy - 32);

          // Little fence on side
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(cx + 18, cy + 4);
          ctx.lineTo(cx + 26, cy + 4);
          ctx.moveTo(cx + 22, cy);
          ctx.lineTo(cx + 22, cy + 8);
          ctx.stroke();

          ctx.restore();
          break;
        }

        case 'library': {
          ctx.save();
          // Ground shadow
          ctx.fillStyle = 'rgba(15, 20, 30, 0.38)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 10, 30, 15, 0, 0, Math.PI * 2);
          ctx.fill();

          // Stone and dark cedar walls
          ctx.fillStyle = '#475569';
          ctx.fillRect(cx - 20, cy - 20, 40, 26);

          // Arched stained glass window glowing warm
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.roundRect(cx - 7, cy - 14, 14, 16, [7, 7, 0, 0]);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.2;
          ctx.stroke();
          // Window grid
          ctx.beginPath();
          ctx.moveTo(cx, cy - 14);
          ctx.lineTo(cx, cy + 2);
          ctx.moveTo(cx - 7, cy - 6);
          ctx.lineTo(cx + 7, cy - 6);
          ctx.stroke();

          // Grand pitched slate roof
          const libRoof = ctx.createLinearGradient(cx - 24, cy - 36, cx + 24, cy - 18);
          libRoof.addColorStop(0, '#3b82f6');
          libRoof.addColorStop(1, '#1e3a8a');
          ctx.fillStyle = libRoof;
          ctx.beginPath();
          ctx.moveTo(cx - 24, cy - 18);
          ctx.lineTo(cx, cy - 36);
          ctx.lineTo(cx + 24, cy - 18);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#1e40af';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Book spire icon
          ctx.fillStyle = '#fef08a';
          ctx.font = '14px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('📚', cx, cy - 38);

          ctx.restore();
          break;
        }

        case 'animal_chicken':
        case 'animal_cat':
        case 'animal_dog':
        case 'animal_sheep':
        case 'animal_duck':
        case 'animal_rabbit': {
          const aType = type.replace('animal_', '');
          drawAnimal(ctx, { 
            type: aType, 
            state: 'idle', 
            facingLeft: false, 
            walkCycle: 0, 
            hopY: 0, 
            name: objData?.customName 
          }, { x: cx, y: cy }, { isHovered: !!isInspected, showTag: false });
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

        case 'cobblestone_road': {
          ctx.save();
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];
          const isPathType = (t) => ['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'bridge', 'wooden_bridge'].includes(t);
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && isPathType(o.type));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && isPathType(o.type));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && isPathType(o.type));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && isPathType(o.type));

          // Base connector ribbons for continuous road underlay
          const drawRoadConnector = (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => {
            ctx.fillStyle = '#26221f';
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.lineTo(p3x, p3y);
            ctx.lineTo(p4x, p4y);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#44403c';
            ctx.beginPath();
            ctx.moveTo(p1x * 0.9 + cx * 0.1, p1y * 0.9 + cy * 0.1);
            ctx.lineTo(p2x * 0.9 + cx * 0.1, p2y * 0.9 + cy * 0.1);
            ctx.lineTo(p3x * 0.9 + cx * 0.1, p3y * 0.9 + cy * 0.1);
            ctx.lineTo(p4x * 0.9 + cx * 0.1, p4y * 0.9 + cy * 0.1);
            ctx.closePath();
            ctx.fill();
          };

          if (hasEast) drawRoadConnector(cx - 6, cy + 3, cx + 6, cy - 3, cx + 23, cy + 5.5, cx + 11, cy + 11.5);
          if (hasWest) drawRoadConnector(cx + 6, cy - 3, cx - 6, cy + 3, cx - 11, cy - 11.5, cx - 23, cy - 5.5);
          if (hasSouth) drawRoadConnector(cx - 6, cy - 3, cx + 6, cy + 3, cx - 11, cy + 11.5, cx - 23, cy + 5.5);
          if (hasNorth) drawRoadConnector(cx + 6, cy + 3, cx - 6, cy - 3, cx + 23, cy - 5.5, cx + 11, cy - 11.5);

          // Pass 1: Foundation base mortar bed (slightly recessed diamond with feathered edges)
          ctx.fillStyle = '#26221f';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 16.5);
          ctx.lineTo(cx + 33.5, cy);
          ctx.lineTo(cx, cy + 16.5);
          ctx.lineTo(cx - 33.5, cy);
          ctx.closePath();
          ctx.fill();

          // Pass 2: Base gravel underlay
          ctx.fillStyle = '#44403c';
          ctx.beginPath();
          ctx.moveTo(cx, cy - 14.5);
          ctx.lineTo(cx + 30.5, cy);
          ctx.lineTo(cx, cy + 14.5);
          ctx.lineTo(cx - 30.5, cy);
          ctx.closePath();
          ctx.fill();

          // Pass 3: Interlocking hand-hewn river cobblestones
          const cobbles = [
            { cx: 0, cy: 0, rx: 7, ry: 4, col: '#78716c', light: '#a8a29e' },
            { cx: -12, cy: -3, rx: 5.5, ry: 3.3, col: '#64748b', light: '#94a3b8' },
            { cx: 12, cy: 3, rx: 6, ry: 3.5, col: '#6b7280', light: '#9ca3af' },
            { cx: 0, cy: -8.5, rx: 6.5, ry: 3.4, col: '#57534e', light: '#854d0e' },
            { cx: -13, cy: -7.5, rx: 4.8, ry: 2.8, col: '#71717a', light: '#a1a1aa' },
            { cx: 13, cy: -5, rx: 5.2, ry: 3, col: '#78716c', light: '#a8a29e' },
            { cx: 0, cy: 8.5, rx: 6.5, ry: 3.4, col: '#64748b', light: '#94a3b8' },
            { cx: -13, cy: 5, rx: 5.4, ry: 3.1, col: '#57534e', light: '#78716c' },
            { cx: 13, cy: 8, rx: 5, ry: 2.9, col: '#71717a', light: '#a1a1aa' },
            { cx: -23, cy: 0, rx: 4.2, ry: 2.6, col: '#64748b', light: '#94a3b8' },
            { cx: 23, cy: 0, rx: 4.2, ry: 2.6, col: '#78716c', light: '#a8a29e' },
            { cx: 0, cy: -13, rx: 3.8, ry: 2.2, col: '#6b7280', light: '#9ca3af' },
            { cx: 0, cy: 13, rx: 3.8, ry: 2.2, col: '#57534e', light: '#78716c' },
          ];

          // Dynamic connector stones extending across edges to neighbors
          if (hasEast) {
            cobbles.push({ cx: 17, cy: 8.5, rx: 5.5, ry: 3.2, col: '#78716c', light: '#a8a29e' });
            cobbles.push({ cx: 25, cy: 12, rx: 4.2, ry: 2.5, col: '#64748b', light: '#94a3b8' });
          }
          if (hasWest) {
            cobbles.push({ cx: -17, cy: -8.5, rx: 5.5, ry: 3.2, col: '#6b7280', light: '#9ca3af' });
            cobbles.push({ cx: -25, cy: -12, rx: 4.2, ry: 2.5, col: '#57534e', light: '#78716c' });
          }
          if (hasSouth) {
            cobbles.push({ cx: -17, cy: 8.5, rx: 5.5, ry: 3.2, col: '#71717a', light: '#a1a1aa' });
            cobbles.push({ cx: -25, cy: 12, rx: 4.2, ry: 2.5, col: '#64748b', light: '#94a3b8' });
          }
          if (hasNorth) {
            cobbles.push({ cx: 17, cy: -8.5, rx: 5.5, ry: 3.2, col: '#57534e', light: '#854d0e' });
            cobbles.push({ cx: 25, cy: -12, rx: 4.2, ry: 2.5, col: '#78716c', light: '#a8a29e' });
          }

          cobbles.forEach(c => {
            const sx = cx + c.cx;
            const sy = cy + c.cy;
            // Contact shadow
            ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
            ctx.beginPath();
            ctx.ellipse(sx, sy + 1.2, c.rx, c.ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cobblestone core
            ctx.fillStyle = c.col;
            ctx.beginPath();
            ctx.ellipse(sx, sy, c.rx, c.ry, 0, 0, Math.PI * 2);
            ctx.fill();

            // Sunlit beveled rim
            ctx.strokeStyle = c.light;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.ellipse(sx - 0.4, sy - 0.5, c.rx * 0.78, c.ry * 0.75, 0, Math.PI * 0.75, Math.PI * 1.85);
            ctx.stroke();

            // Bottom shadow facet
            ctx.strokeStyle = 'rgba(28, 25, 23, 0.55)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.ellipse(sx + 0.3, sy + 0.4, c.rx * 0.82, c.ry * 0.8, 0, 0, Math.PI * 0.85);
            ctx.stroke();
          });

          // Crevice moss & wildflower
          ctx.fillStyle = '#84cc16';
          ctx.fillRect(cx - 5, cy + 2.5, 1.4, 2);
          ctx.fillRect(cx + 6, cy - 4.5, 1.8, 1.5);
          ctx.fillRect(cx - 18, cy + 1, 1.5, 1.8);
          // Tiny white chamomile daisy
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 4.5, cy + 1.8, 0.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(cx - 4.8, cy + 1.5, 0.6, 0.6);

          ctx.restore();
          break;
        }

        case 'stone_path': {
          ctx.save();
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];
          const isPathType = (t) => ['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'bridge', 'wooden_bridge'].includes(t);
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && isPathType(o.type));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && isPathType(o.type));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && isPathType(o.type));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && isPathType(o.type));

          // Flagstone stepping stones with natural variation, beveled edges and grass tufts
          const stones = [
            { x: cx - 12, y: cy - 2, rx: 7.5, ry: 4.5, baseCol: '#cbd5e1', lightCol: '#f1f5f9' },
            { x: cx + 9, y: cy - 4, rx: 8.5, ry: 5.2, baseCol: '#94a3b8', lightCol: '#e2e8f0' },
            { x: cx - 2, y: cy + 4, rx: 9.5, ry: 5.5, baseCol: '#64748b', lightCol: '#cbd5e1' }
          ];

          // Seamless stepping stones towards neighbors
          if (hasEast) stones.push({ x: cx + 17, y: cy + 7, rx: 7.8, ry: 4.8, baseCol: '#94a3b8', lightCol: '#f1f5f9' });
          if (hasWest) stones.push({ x: cx - 17, y: cy - 7, rx: 7.5, ry: 4.5, baseCol: '#64748b', lightCol: '#cbd5e1' });
          if (hasSouth) stones.push({ x: cx - 17, y: cy + 7, rx: 7.8, ry: 4.8, baseCol: '#cbd5e1', lightCol: '#f1f5f9' });
          if (hasNorth) stones.push({ x: cx + 17, y: cy - 7, rx: 7.5, ry: 4.5, baseCol: '#94a3b8', lightCol: '#e2e8f0' });

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

        case 'dirt_trail': {
          ctx.save();
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];
          const isPathType = (t) => ['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'bridge', 'wooden_bridge'].includes(t);
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && isPathType(o.type));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && isPathType(o.type));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && isPathType(o.type));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && isPathType(o.type));
          const isConnected = hasEast || hasWest || hasSouth || hasNorth;

          // Natural earthy soil palette (warm, handcrafted, authentic road texture)
          const soilBase = '#42220c';      // Deep damp ground underlay
          const soilMain = '#72431a';      // Warm packed loam
          const soilTread = '#965e2c';     // Sun-warmed center tread
          const soilHighlight = '#b07742'; // Wheel / foot rut highlight

          // Vector offsets for East-West corridor (runs along (+17, +8.5), perpendicular is (-2, +1))
          const ew_p = { x: -6.5, y: 3.25 };
          const ew_n = { x: 6.5, y: -3.25 };

          // Vector offsets for South-North corridor (runs along (-17, +8.5), perpendicular is (+2, +1))
          const sn_p = { x: 6.5, y: 3.25 };
          const sn_n = { x: -6.5, y: -3.25 };

          // Helper to draw a rich textured earthen corridor between two points
          const drawEarthStrip = (x1, y1, x2, y2, off_p, off_n) => {
            // Layer 1: Dark damp earth base
            ctx.fillStyle = soilBase;
            ctx.beginPath();
            ctx.moveTo(x1 + off_p.x * 1.15, y1 + off_p.y * 1.15);
            ctx.lineTo(x2 + off_p.x * 1.15, y2 + off_p.y * 1.15);
            ctx.lineTo(x2 + off_n.x * 1.15, y2 + off_n.y * 1.15);
            ctx.lineTo(x1 + off_n.x * 1.15, y1 + off_n.y * 1.15);
            ctx.closePath();
            ctx.fill();

            // Layer 2: Main packed dirt loam
            ctx.fillStyle = soilMain;
            ctx.beginPath();
            ctx.moveTo(x1 + off_p.x, y1 + off_p.y);
            ctx.lineTo(x2 + off_p.x, y2 + off_p.y);
            ctx.lineTo(x2 + off_n.x, y2 + off_n.y);
            ctx.lineTo(x1 + off_n.x, y1 + off_n.y);
            ctx.closePath();
            ctx.fill();

            // Layer 3: Sunlit center rut / foot trodden path line
            ctx.strokeStyle = soilTread;
            ctx.lineWidth = 3.2;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();

            // Double cart wheel / foot tracks along corridor
            ctx.strokeStyle = soilHighlight;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(x1 + off_p.x * 0.45, y1 + off_p.y * 0.45);
            ctx.lineTo(x2 + off_p.x * 0.45, y2 + off_p.y * 0.45);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x1 + off_n.x * 0.45, y1 + off_n.y * 0.45);
            ctx.lineTo(x2 + off_n.x * 0.45, y2 + off_n.y * 0.45);
            ctx.stroke();
          };

          if (isConnected) {
            // Draw all connecting corridors from center (cx, cy) to edge boundaries
            if (hasEast) drawEarthStrip(cx, cy, cx + 17, cy + 8.5, ew_p, ew_n);
            if (hasWest) drawEarthStrip(cx - 17, cy - 8.5, cx, cy, ew_p, ew_n);
            if (hasSouth) drawEarthStrip(cx, cy, cx - 17, cy + 8.5, sn_p, sn_n);
            if (hasNorth) drawEarthStrip(cx + 17, cy - 8.5, cx, cy, sn_p, sn_n);

            // Center junction blend: smooth compact diamond hub connecting the corridors seamlessly
            ctx.fillStyle = soilBase;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 7.5);
            ctx.lineTo(cx + 8.5, cy);
            ctx.lineTo(cx, cy + 7.5);
            ctx.lineTo(cx - 8.5, cy);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = soilMain;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 6.2);
            ctx.lineTo(cx + 7.2, cy);
            ctx.lineTo(cx, cy + 6.2);
            ctx.lineTo(cx - 7.2, cy);
            ctx.closePath();
            ctx.fill();

            // Center wear highlight
            ctx.fillStyle = soilTread;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 4.5, 2.4, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Standalone path: Natural organic diamond clearing following the isometric angle (NOT a circle/pancake!)
            ctx.fillStyle = soilBase;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 9);
            ctx.lineTo(cx + 16, cy);
            ctx.lineTo(cx, cy + 9);
            ctx.lineTo(cx - 16, cy);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = soilMain;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 7.5);
            ctx.lineTo(cx + 13.5, cy);
            ctx.lineTo(cx, cy + 7.5);
            ctx.lineTo(cx - 13.5, cy);
            ctx.closePath();
            ctx.fill();

            // Worn center tread oval
            ctx.fillStyle = soilTread;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 8, 3.8, 0, 0, Math.PI * 2);
            ctx.fill();

            // Footpath rut track
            ctx.strokeStyle = soilHighlight;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx - 6, cy - 1);
            ctx.lineTo(cx + 6, cy + 1);
            ctx.stroke();
          }

          // Embedded fine rustic gravel pebbles (small, non-obtrusive, natural ground grain)
          const pebbles = [
            { x: cx - 4, y: cy - 2, rx: 1.4, ry: 0.9, col: '#a8a29e' },
            { x: cx + 5, y: cy + 1.5, rx: 1.6, ry: 1.0, col: '#78716c' },
            { x: cx - 2, y: cy + 3.2, rx: 1.2, ry: 0.8, col: '#94a3b8' }
          ];
          pebbles.forEach(pb => {
            ctx.fillStyle = 'rgba(15, 10, 5, 0.45)';
            ctx.beginPath();
            ctx.ellipse(pb.x, pb.y + 0.6, pb.rx, pb.ry, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = pb.col;
            ctx.beginPath();
            ctx.ellipse(pb.x, pb.y, pb.rx, pb.ry, 0, 0, Math.PI * 2);
            ctx.fill();
          });

          // Soft organic verge wild grass blades (softly blending into meadow)
          ctx.fillStyle = '#65a30d';
          ctx.fillRect(cx - 8, cy - 4, 1.1, 2.2);
          ctx.fillRect(cx + 7, cy + 3, 1.1, 2.0);

          ctx.restore();
          break;
        }

        case 'stone_wall': {
          ctx.save();
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];

          // Check adjacent stone walls for seamless modular fortress connections
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && (o.type === 'stone_wall' || o.type.includes('wall')));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && (o.type === 'stone_wall' || o.type.includes('wall')));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && (o.type === 'stone_wall' || o.type.includes('wall')));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && (o.type === 'stone_wall' || o.type.includes('wall')));
          const isConnected = hasEast || hasWest || hasSouth || hasNorth;

          // Wall dimensions
          const wallH = 11; // low fortress rampart height
          const isStraightEW = hasEast && hasWest && !hasSouth && !hasNorth;
          const isStraightSN = hasSouth && hasNorth && !hasEast && !hasWest;
          const isStraightContinuous = isStraightEW || isStraightSN;

          // Contact ground shadow
          ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2.5, 13, 5.5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Offsets for East-West curtain (slope 0.5, perpendicular is (-2, +1))
          const ew_p = { x: -3.2, y: 1.6 };  // front-left face (sunlit)
          const ew_n = { x: 3.2, y: -1.6 }; // back-right face

          // Offsets for South-North curtain (slope -0.5, perpendicular is (+2, +1))
          const sn_p = { x: 3.2, y: 1.6 };   // front-right face (shadow)
          const sn_n = { x: -3.2, y: -1.6 }; // back-left face

          // Draw an East-West rampart curtain segment between two points
          const drawEWCurtain = (x1, y1, x2, y2) => {
            // Front Sunlit Face
            const fGrad = ctx.createLinearGradient(x1 + ew_p.x, y1 + ew_p.y - wallH, x2 + ew_p.x, y2 + ew_p.y);
            fGrad.addColorStop(0, '#94a3b8');
            fGrad.addColorStop(0.5, '#64748b');
            fGrad.addColorStop(1, '#475569');
            ctx.fillStyle = fGrad;
            ctx.beginPath();
            ctx.moveTo(x1 + ew_p.x, y1 + ew_p.y);
            ctx.lineTo(x2 + ew_p.x, y2 + ew_p.y);
            ctx.lineTo(x2 + ew_p.x, y2 + ew_p.y - wallH);
            ctx.lineTo(x1 + ew_p.x, y1 + ew_p.y - wallH);
            ctx.closePath();
            ctx.fill();

            // Horizontal Ashlar mortar groove
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x1 + ew_p.x, y1 + ew_p.y - wallH * 0.5);
            ctx.lineTo(x2 + ew_p.x, y2 + ew_p.y - wallH * 0.5);
            ctx.stroke();

            // Top Walkway Capstone Quad
            const topGrad = ctx.createLinearGradient(x1 + ew_p.x, y1 + ew_p.y - wallH, x2 + ew_n.x, y2 + ew_n.y - wallH);
            topGrad.addColorStop(0, '#f8fafc');
            topGrad.addColorStop(0.5, '#e2e8f0');
            topGrad.addColorStop(1, '#cbd5e1');
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.moveTo(x1 + ew_p.x, y1 + ew_p.y - wallH);
            ctx.lineTo(x2 + ew_p.x, y2 + ew_p.y - wallH);
            ctx.lineTo(x2 + ew_n.x, y2 + ew_n.y - wallH);
            ctx.lineTo(x1 + ew_n.x, y1 + ew_n.y - wallH);
            ctx.closePath();
            ctx.fill();

            // Sunlit rim keylight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x1 + ew_p.x, y1 + ew_p.y - wallH);
            ctx.lineTo(x2 + ew_p.x, y2 + ew_p.y - wallH);
            ctx.stroke();

            // Parapet merlon along front rim (at midpoint)
            const mx = (x1 + x2) / 2 + ew_p.x;
            const my = (y1 + y2) / 2 + ew_p.y - wallH - 2.2;
            ctx.fillStyle = '#64748b';
            ctx.fillRect(mx - 1.4, my, 2.8, 2.2);
            ctx.fillStyle = '#f1f5f9';
            ctx.fillRect(mx - 1.4, my, 2.8, 0.7);
            ctx.fillStyle = '#334155';
            ctx.fillRect(mx + 1.4 - 0.7, my, 0.7, 2.2);
          };

          // Draw a South-North rampart curtain segment between two points
          const drawSNCurtain = (x1, y1, x2, y2) => {
            // Front Shadow Face
            const fGrad = ctx.createLinearGradient(x1 + sn_p.x, y1 + sn_p.y - wallH, x2 + sn_p.x, y2 + sn_p.y);
            fGrad.addColorStop(0, '#475569');
            fGrad.addColorStop(0.5, '#334155');
            fGrad.addColorStop(1, '#1e293b');
            ctx.fillStyle = fGrad;
            ctx.beginPath();
            ctx.moveTo(x1 + sn_p.x, y1 + sn_p.y);
            ctx.lineTo(x2 + sn_p.x, y2 + sn_p.y);
            ctx.lineTo(x2 + sn_p.x, y2 + sn_p.y - wallH);
            ctx.lineTo(x1 + sn_p.x, y1 + sn_p.y - wallH);
            ctx.closePath();
            ctx.fill();

            // Horizontal Ashlar mortar groove
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(x1 + sn_p.x, y1 + sn_p.y - wallH * 0.5);
            ctx.lineTo(x2 + sn_p.x, y2 + sn_p.y - wallH * 0.5);
            ctx.stroke();

            // Top Walkway Capstone Quad
            const topGrad = ctx.createLinearGradient(x1 + sn_n.x, y1 + sn_n.y - wallH, x2 + sn_p.x, y2 + sn_p.y - wallH);
            topGrad.addColorStop(0, '#f1f5f9');
            topGrad.addColorStop(0.5, '#cbd5e1');
            topGrad.addColorStop(1, '#94a3b8');
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.moveTo(x1 + sn_p.x, y1 + sn_p.y - wallH);
            ctx.lineTo(x2 + sn_p.x, y2 + sn_p.y - wallH);
            ctx.lineTo(x2 + sn_n.x, y2 + sn_n.y - wallH);
            ctx.lineTo(x1 + sn_n.x, y1 + sn_n.y - wallH);
            ctx.closePath();
            ctx.fill();

            // Parapet merlon along front rim (at midpoint)
            const mx = (x1 + x2) / 2 + sn_p.x;
            const my = (y1 + y2) / 2 + sn_p.y - wallH - 2.2;
            ctx.fillStyle = '#475569';
            ctx.fillRect(mx - 1.4, my, 2.8, 2.2);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(mx - 1.4, my, 2.8, 0.7);
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(mx + 1.4 - 0.7, my, 0.7, 2.2);
          };

          // Draw the connecting curtains
          if (hasEast) drawEWCurtain(cx, cy, cx + 17, cy + 8.5);
          if (hasWest) drawEWCurtain(cx - 17, cy - 8.5, cx, cy);
          if (hasSouth) drawSNCurtain(cx, cy, cx - 17, cy + 8.5);
          if (hasNorth) drawSNCurtain(cx + 17, cy - 8.5, cx, cy);

          // Draw Center Turret Bastion if NOT a continuous straight line
          // (At corners, T-junctions, cross-junctions, end-posts, and standalone walls)
          if (!isStraightContinuous) {
            const bH = wallH + 1.2;
            const bw = 5.2; // half width
            const bd = 2.6; // half depth

            // Bastion Left Face
            ctx.fillStyle = '#64748b';
            ctx.beginPath();
            ctx.moveTo(cx - bw, cy);
            ctx.lineTo(cx, cy + bd);
            ctx.lineTo(cx, cy + bd - bH);
            ctx.lineTo(cx - bw, cy - bH);
            ctx.closePath();
            ctx.fill();

            // Bastion Right Face
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(cx, cy + bd);
            ctx.lineTo(cx + bw, cy);
            ctx.lineTo(cx + bw, cy - bH);
            ctx.lineTo(cx, cy + bd - bH);
            ctx.closePath();
            ctx.fill();

            // Bastion Top Capstone
            ctx.fillStyle = '#f1f5f9';
            ctx.beginPath();
            ctx.moveTo(cx, cy - bd - bH);
            ctx.lineTo(cx + bw, cy - bH);
            ctx.lineTo(cx, cy + bd - bH);
            ctx.lineTo(cx - bw, cy - bH);
            ctx.closePath();
            ctx.fill();

            // Sunlit rim
            ctx.strokeStyle = 'rgba(255,255,255,0.85)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Bastion Merlons (scaled corner battlements)
            const bMerlons = [
              { x: cx - bw, y: cy - bH - 2.2, w: 2.2, h: 2.2 },
              { x: cx + bw - 2.2, y: cy - bH - 2.2, w: 2.2, h: 2.2 },
              { x: cx - 1.1, y: cy + bd - bH - 2.2, w: 2.2, h: 2.2 }
            ];
            bMerlons.forEach(m => {
              ctx.fillStyle = '#64748b';
              ctx.fillRect(m.x, m.y, m.w, m.h);
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(m.x, m.y, m.w, 0.7);
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(m.x + m.w - 0.7, m.y, 0.7, m.h);
            });

            // Ivy / creeping moss at bastion base
            ctx.fillStyle = '#4d7c0f';
            ctx.beginPath();
            ctx.arc(cx - 3, cy + 1.2, 1.3, 0, Math.PI * 2);
            ctx.arc(cx + 2.5, cy + 1.8, 1.1, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // For continuous straight wall, seal the top walkway across the center hub
            const topGrad = ctx.createLinearGradient(cx - 3, cy - wallH, cx + 3, cy - wallH);
            topGrad.addColorStop(0, '#f1f5f9');
            topGrad.addColorStop(1, '#cbd5e1');
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 2.5 - wallH);
            ctx.lineTo(cx + 4.5, cy - wallH);
            ctx.lineTo(cx, cy + 2.5 - wallH);
            ctx.lineTo(cx - 4.5, cy - wallH);
            ctx.closePath();
            ctx.fill();
          }

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
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];
          const isPathType = (t) => ['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'bridge', 'wooden_bridge'].includes(t);
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && isPathType(o.type));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && isPathType(o.type));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && isPathType(o.type));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && isPathType(o.type));

          // Helper to draw connecting wooden boardwalk deck
          const drawWoodConnector = (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => {
            ctx.fillStyle = '#78350f';
            ctx.beginPath();
            ctx.moveTo(p1x, p1y + 1);
            ctx.lineTo(p2x, p2y + 1);
            ctx.lineTo(p3x, p3y + 1);
            ctx.lineTo(p4x, p4y + 1);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.lineTo(p3x, p3y);
            ctx.lineTo(p4x, p4y);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo((p1x + p4x) / 2, (p1y + p4y) / 2);
            ctx.lineTo((p2x + p3x) / 2, (p2y + p3y) / 2);
            ctx.stroke();
          };

          if (hasEast) drawWoodConnector(cx - 7, cy + 3.5, cx + 7, cy - 3.5, cx + 24, cy + 5, cx + 10, cy + 12);
          if (hasWest) drawWoodConnector(cx + 7, cy - 3.5, cx - 7, cy + 3.5, cx - 10, cy - 12, cx - 24, cy - 5);
          if (hasSouth) drawWoodConnector(cx - 7, cy - 3.5, cx + 7, cy + 3.5, cx - 10, cy + 12, cx - 24, cy + 5);
          if (hasNorth) drawWoodConnector(cx + 7, cy + 3.5, cx - 7, cy - 3.5, cx + 24, cy - 5, cx + 10, cy - 12);

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
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];
          const isPathType = (t) => ['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'bridge', 'wooden_bridge'].includes(t);
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && isPathType(o.type));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && isPathType(o.type));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && isPathType(o.type));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && isPathType(o.type));

          // Helper to draw connecting terracotta brick strip
          const drawBrickConnector = (p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) => {
            ctx.fillStyle = '#7f1d1d';
            ctx.beginPath();
            ctx.moveTo(p1x, p1y + 1);
            ctx.lineTo(p2x, p2y + 1);
            ctx.lineTo(p3x, p3y + 1);
            ctx.lineTo(p4x, p4y + 1);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = '#b91c1c';
            ctx.beginPath();
            ctx.moveTo(p1x, p1y);
            ctx.lineTo(p2x, p2y);
            ctx.lineTo(p3x, p3y);
            ctx.lineTo(p4x, p4y);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo((p1x + p4x) / 2, (p1y + p4y) / 2);
            ctx.lineTo((p2x + p3x) / 2, (p2y + p3y) / 2);
            ctx.stroke();
          };

          if (hasEast) drawBrickConnector(cx - 7, cy + 3.5, cx + 7, cy - 3.5, cx + 24, cy + 5, cx + 10, cy + 12);
          if (hasWest) drawBrickConnector(cx + 7, cy - 3.5, cx - 7, cy + 3.5, cx - 10, cy - 12, cx - 24, cy - 5);
          if (hasSouth) drawBrickConnector(cx - 7, cy - 3.5, cx + 7, cy + 3.5, cx - 10, cy + 12, cx - 24, cy + 5);
          if (hasNorth) drawBrickConnector(cx + 7, cy + 3.5, cx - 7, cy - 3.5, cx + 24, cy - 5, cx + 10, cy - 12);

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
          const ogx = objData.gx;
          const ogy = objData.gy;
          const objs = placedObjectsRef.current || [];

          // Check adjacent wooden fences for seamless modular ranch / palisade connections
          const hasEast = ogx !== undefined && objs.some(o => o.gx === ogx + 1 && o.gy === ogy && (o.type === 'wooden_fence' || o.type === 'fence'));
          const hasWest = ogx !== undefined && objs.some(o => o.gx === ogx - 1 && o.gy === ogy && (o.type === 'wooden_fence' || o.type === 'fence'));
          const hasSouth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy + 1 && (o.type === 'wooden_fence' || o.type === 'fence'));
          const hasNorth = ogy !== undefined && objs.some(o => o.gx === ogx && o.gy === ogy - 1 && (o.type === 'wooden_fence' || o.type === 'fence'));
          const isConnected = hasEast || hasWest || hasSouth || hasNorth;

          // Scaled down contact ground shadow
          ctx.fillStyle = 'rgba(15, 30, 10, 0.3)';
          ctx.beginPath();
          ctx.ellipse(cx, cy + 2.5, 12, 4.8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Helper to draw isometric wooden rails between two points
          const drawRail = (x1, y1, x2, y2) => {
            // Upper rail
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 6.5);
            ctx.lineTo(x2, y2 - 6.5);
            ctx.stroke();
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 6.8);
            ctx.lineTo(x2, y2 - 6.8);
            ctx.stroke();

            // Lower rail
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 2.5);
            ctx.lineTo(x2, y2 - 2.5);
            ctx.stroke();
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(x1, y1 - 2.8);
            ctx.lineTo(x2, y2 - 2.8);
            ctx.stroke();
          };

          // Draw connecting rails to neighbors
          if (hasEast) drawRail(cx, cy, cx + 17, cy + 8.5);
          if (hasWest) drawRail(cx - 17, cy - 8.5, cx, cy);
          if (hasSouth) drawRail(cx, cy, cx - 17, cy + 8.5);
          if (hasNorth) drawRail(cx + 17, cy - 8.5, cx, cy);

          // If standalone fence (no neighbors), show classic double-rail segment with pickets
          if (!isConnected) {
            drawRail(cx - 11, cy - 2.5, cx + 11, cy + 2.5);
            // Flanking pickets
            [-6, 6].forEach(px => {
              const py = cy + (px * 2.5 / 11);
              ctx.fillStyle = '#78350f';
              ctx.fillRect(cx + px - 1.1, py - 8.5, 2.2, 9);
              ctx.fillStyle = '#d97706';
              ctx.fillRect(cx + px - 1.1, py - 8.5, 1.2, 9);
              ctx.beginPath();
              ctx.moveTo(cx + px - 1.1, py - 8.5);
              ctx.lineTo(cx + px, py - 10.2);
              ctx.lineTo(cx + px + 1.1, py - 8.5);
              ctx.closePath();
              ctx.fill();
            });
          }

          // Central Sturdy Carved Timber Post (low, proportionate height 9.5, width 3.4)
          const postW = 3.4;
          const postH = 9.5;
          // Shadow facet (East)
          ctx.fillStyle = '#451a03';
          ctx.fillRect(cx - postW / 2, cy - postH, postW, postH + 2.5);
          // Sunlit facet (West)
          ctx.fillStyle = '#b45309';
          ctx.fillRect(cx - postW / 2, cy - postH, postW * 0.55, postH + 2.5);
          
          // Pyramidal Carved Post Cap
          ctx.beginPath();
          ctx.moveTo(cx - postW / 2, cy - postH);
          ctx.lineTo(cx, cy - postH - 2.8);
          ctx.lineTo(cx + postW / 2, cy - postH);
          ctx.closePath();
          ctx.fillStyle = '#d97706';
          ctx.fill();
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 0.6;
          ctx.stroke();

          // Iron Reinforcement Bracket & Studs
          ctx.fillStyle = '#334155';
          ctx.fillRect(cx - postW / 2 - 0.4, cy - 5, postW + 0.8, 1.6);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(cx - 0.6, cy - 4.7, 1.0, 0.9);

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

      // 1. Dynamic contiguous island border scenery showing neighboring village outskirts
      const activeVid = currentVillageIdRef.current || 'military';

      // Helper for Ocean Waves wrapping the isolated island
      // Draw ocean waves helper for island coastal shores (GPU-friendly single-pass path)
      const drawOceanWaves = (startX, startY, width, height) => {
        ctx.save();
        const oceanGrad = ctx.createLinearGradient(startX, startY, startX, startY + height);
        oceanGrad.addColorStop(0, isNight ? '#041220' : (isSunset ? '#1a2e45' : '#0369a1'));
        oceanGrad.addColorStop(1, isNight ? '#020b14' : (isSunset ? '#0e1e30' : '#02456b'));
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(startX, startY, width, height);

        // Coastal beach sand strip
        ctx.fillStyle = isNight ? '#78716c' : (isSunset ? '#d97706' : '#fde68a');
        ctx.fillRect(startX, startY, width, 4);

        // Silky smooth wave lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.2;
        const wavePhase = (Date.now() / 900) % (Math.PI * 2);
        const y1 = startY + 14;
        const y2 = startY + 28;
        if (y1 < startY + height) {
          ctx.beginPath();
          ctx.moveTo(startX, y1);
          for (let wx = startX; wx < startX + width; wx += 40) {
            ctx.quadraticCurveTo(wx + 12, y1 + Math.sin(wavePhase + wx * 0.04) * 2.2, wx + 24, y1);
          }
          ctx.stroke();
        }
        if (y2 < startY + height) {
          ctx.beginPath();
          ctx.moveTo(startX, y2);
          for (let wx = startX + 15; wx < startX + width; wx += 40) {
            ctx.quadraticCurveTo(wx + 12, y2 + Math.cos(wavePhase + wx * 0.04) * 2.2, wx + 24, y2);
          }
          ctx.stroke();
        }
        ctx.restore();
      };

      // Helper for Modern Business Slate Pavements & Lampposts on the border
      const drawBusinessOutskirts = (bx, by, s = 1.0) => {
        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(s, s);

        // Slate paving block
        ctx.fillStyle = isNight ? '#1e293b' : '#475569';
        ctx.fillRect(-22, -4, 44, 18);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1;
        ctx.strokeRect(-22, -4, 44, 18);

        // Modern geometric stone post
        ctx.fillStyle = isNight ? '#334155' : '#cbd5e1';
        ctx.fillRect(-6, -26, 12, 22);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(-4, -30, 8, 4);

        // Glowing lamp glow
        const lampAura = ctx.createRadialGradient(0, -28, 1, 0, -28, 16);
        lampAura.addColorStop(0, 'rgba(251, 191, 36, 0.6)');
        lampAura.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = lampAura;
        ctx.beginPath();
        ctx.arc(0, -28, 16, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Helper for Pastoral Sanctuary River & Cottage Outskirts on the border
      const drawSanctuaryOutskirts = (sx, sy, s = 1.0) => {
        ctx.save();
        ctx.translate(sx, sy);
        ctx.scale(s, s);

        // Lush green grass patch
        ctx.fillStyle = isNight ? '#064e3b' : (isSunset ? '#65a30d' : '#84cc16');
        ctx.beginPath();
        ctx.ellipse(0, 4, 30, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        // Little red cottage roof
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(-16, -10);
        ctx.lineTo(0, -26);
        ctx.lineTo(16, -10);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fed7aa';
        ctx.fillRect(-12, -10, 24, 14);

        // Cottage Chimney & smoke puff
        ctx.fillStyle = '#78716c';
        ctx.fillRect(4, -28, 4, 8);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(6, -34, 3, 0, Math.PI * 2);
        ctx.arc(8, -40, 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      };

      // Helper for Military Rampart & Watchtower Outskirts on the border
      const drawMilitaryOutskirts = (mx, my, s = 1.0) => {
        ctx.save();
        ctx.translate(mx, my);
        ctx.scale(s, s);

        // Stone rampart wall
        ctx.fillStyle = isNight ? '#18181b' : '#3f3f46';
        ctx.fillRect(-22, -12, 44, 20);
        ctx.fillStyle = isNight ? '#27272a' : '#52525b';
        ctx.fillRect(-18, -18, 10, 6);
        ctx.fillRect(8, -18, 10, 6);

        // Watchtower silhouette
        ctx.fillStyle = '#27272a';
        ctx.fillRect(-8, -38, 16, 26);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(0, -46, 12, 7); // Red military flag
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.lineTo(0, -48);
        ctx.stroke();

        ctx.restore();
      };

      // Draw border scenery depending on activeVid
      if (activeVid === 'military') {
        // RIGHT MARGIN: The start of Business Village (כפר היזמות)!
        const rightRidgeGrad = ctx.createLinearGradient(w - 110, 0, w, 0);
        rightRidgeGrad.addColorStop(0, 'rgba(71, 85, 105, 0)');
        rightRidgeGrad.addColorStop(1, isNight ? 'rgba(30, 41, 59, 0.7)' : 'rgba(71, 85, 105, 0.45)');
        ctx.fillStyle = rightRidgeGrad;
        ctx.fillRect(w - 110, 0, 110, h);

        // Business outskirts landmarks
        drawBusinessOutskirts(w - 35, h * 0.32, 1.15);
        drawBusinessOutskirts(w - 75, h * 0.48, 1.1);
        drawBusinessOutskirts(w - 30, h * 0.65, 1.2);
        drawBusinessOutskirts(w - 70, h * 0.82, 1.15);

        // BOTTOM MARGIN: The start of Sanctuary Village (כפר החיים)!
        const bottomRidgeGrad = ctx.createLinearGradient(0, h - 90, 0, h);
        bottomRidgeGrad.addColorStop(0, 'rgba(101, 163, 13, 0)');
        bottomRidgeGrad.addColorStop(1, isNight ? 'rgba(20, 83, 45, 0.7)' : 'rgba(101, 163, 13, 0.45)');
        ctx.fillStyle = bottomRidgeGrad;
        ctx.fillRect(0, h - 90, w, 90);

        // Flowing river strip along bottom
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(0, h - 22);
        ctx.bezierCurveTo(w * 0.3, h - 35, w * 0.7, h - 12, w, h - 25);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Sanctuary cottages & oaks peeking through
        drawSanctuaryOutskirts(w * 0.22, h - 45, 1.1);
        drawSanctuaryOutskirts(w * 0.65, h - 50, 1.15);
        drawEdgeOak(w * 0.42, h - 35, 1.2);
        drawEdgeOak(w * 0.84, h - 38, 1.1);

      } else if (activeVid === 'business') {
        // LEFT MARGIN: The start of Military Village (כפר הצבא)!
        const leftRidgeGrad = ctx.createLinearGradient(0, 0, 110, 0);
        leftRidgeGrad.addColorStop(1, 'rgba(20, 83, 45, 0)');
        leftRidgeGrad.addColorStop(0, isNight ? 'rgba(5, 46, 22, 0.7)' : 'rgba(20, 83, 45, 0.5)');
        ctx.fillStyle = leftRidgeGrad;
        ctx.fillRect(0, 0, 110, h);

        drawMilitaryOutskirts(40, h * 0.35, 1.15);
        drawEdgePine(55, h * 0.52, 1.2, true);
        drawMilitaryOutskirts(45, h * 0.70, 1.2);
        drawEdgePine(60, h * 0.86, 1.3, true);

        // BOTTOM MARGIN: Sanctuary Village!
        const bottomRidgeGrad = ctx.createLinearGradient(0, h - 90, 0, h);
        bottomRidgeGrad.addColorStop(0, 'rgba(101, 163, 13, 0)');
        bottomRidgeGrad.addColorStop(1, isNight ? 'rgba(20, 83, 45, 0.7)' : 'rgba(101, 163, 13, 0.45)');
        ctx.fillStyle = bottomRidgeGrad;
        ctx.fillRect(0, h - 90, w, 90);

        drawSanctuaryOutskirts(w * 0.35, h - 45, 1.1);
        drawSanctuaryOutskirts(w * 0.75, h - 48, 1.15);
        drawEdgeOak(w * 0.55, h - 35, 1.2);

        // RIGHT MARGIN: Ocean!
        drawOceanWaves(w - 55, h * 0.25, 55, h * 0.75);

      } else {
        // activeVid === 'sanctuary'
        // TOP-LEFT MARGIN: Up towards Military Village!
        const tlGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 220);
        tlGrad.addColorStop(0, isNight ? 'rgba(5, 46, 22, 0.75)' : 'rgba(20, 83, 45, 0.5)');
        tlGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = tlGrad;
        ctx.fillRect(0, 0, 220, 220);

        drawEdgePine(60, 90, 1.2, true);
        drawMilitaryOutskirts(75, 140, 1.05);

        // TOP-RIGHT MARGIN: Up towards Business Village!
        const trGrad = ctx.createRadialGradient(w, 0, 10, w, 0, 220);
        trGrad.addColorStop(0, isNight ? 'rgba(30, 41, 59, 0.75)' : 'rgba(71, 85, 105, 0.5)');
        trGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = trGrad;
        ctx.fillRect(w - 220, 0, 220, 220);

        drawBusinessOutskirts(w - 75, 100, 1.1);
        drawBusinessOutskirts(w - 120, 150, 1.05);

        // BOTTOM MARGIN: Ocean estuary!
        drawOceanWaves(0, h - 50, w, 50);
      }

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
        isWalking: v.isWalking !== undefined ? v.isWalking : v.progress < 1,
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
      const zoom = cameraZoomRef.current || 1;
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
        // Soft glowing twilight dusk sky: dusky violet -> soft rose -> warm peach -> golden sunset glow
        skyGrad.addColorStop(0, '#311442');
        skyGrad.addColorStop(0.28, '#882d62');
        skyGrad.addColorStop(0.55, '#ea580c');
        skyGrad.addColorStop(0.82, '#fba05a');
        skyGrad.addColorStop(1, '#fde68a'); // Soft warm sunset horizon light
      } else {
        // Bright peaceful afternoon
        skyGrad.addColorStop(0, '#38bdf8');
        skyGrad.addColorStop(0.5, '#7dd3fc');
        skyGrad.addColorStop(0.8, '#bae6fd');
        skyGrad.addColorStop(1, '#5aa32a');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Distant Sun, Moon & Sky Highlights
      if (isSunset) {
        const sunX = width * 0.20;
        const sunY = height * 0.06;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, 150);
        sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
        sunGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.7)');
        sunGrad.addColorStop(0.5, 'rgba(217, 70, 239, 0.35)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 150, 0, Math.PI * 2);
        ctx.fill();

        // Sunset Orb
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 22, 0, Math.PI * 2);
        ctx.fill();
      } else if (isNight) {
        // Gentle crescent moon & stars
        const moonX = width * 0.22;
        const moonY = height * 0.055;
        ctx.fillStyle = 'rgba(254, 243, 199, 0.15)';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.arc(moonX, moonY, 15, 0, Math.PI * 2);
        ctx.fill();

        // Star twinkle
        ctx.fillStyle = '#ffffff';
        [
          [0.1, 0.035], [0.18, 0.02], [0.32, 0.04], [0.45, 0.025], [0.65, 0.045], [0.8, 0.025]
        ].forEach(([px, py]) => {
          ctx.beginPath();
          ctx.arc(width * px, height * py, 1.2, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Bright peaceful afternoon Sun
        const sunX = width * 0.18;
        const sunY = height * 0.05;
        const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 95);
        sunGrad.addColorStop(0, 'rgba(255, 255, 245, 0.95)');
        sunGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.55)');
        sunGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 95, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. WESTERN HORIZON, COASTAL WATER & ROLLING HILLS (Harmonious Organic Backdrop)
      // Soft atmospheric rolling ridge behind and beneath the meadow
      const hillGrad = ctx.createLinearGradient(0, height * 0.06, 0, height * 0.45);
      if (isNight) {
        hillGrad.addColorStop(0, '#0c1a2e');
        hillGrad.addColorStop(0.35, '#0f291e');
        hillGrad.addColorStop(1, '#163812');
      } else if (isSunset) {
        // Gentle soft reddish-pinkish-orange (ורוד אדמדם כתמתם עדין) sun-kissed hill slopes
        hillGrad.addColorStop(0, '#fb7185');    // Soft gentle rose pink / blush
        hillGrad.addColorStop(0.32, '#fb923c'); // Warm soft reddish-apricot orange
        hillGrad.addColorStop(0.68, '#7ea622'); // Soft sunlit golden-olive hillside
        hillGrad.addColorStop(1, '#598918');    // Seamless transition to meadow grass2
      } else {
        hillGrad.addColorStop(0, '#0284c7');
        hillGrad.addColorStop(0.35, '#0d9488');
        hillGrad.addColorStop(1, '#5aa32a'); // Exactly matches daytime grass2 (#5aa32a)!
      }

      // Distant rolling mountain silhouette (Soft Bézier curve across full width)
      ctx.fillStyle = hillGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.095);
      ctx.bezierCurveTo(width * 0.25, height * 0.06, width * 0.55, height * 0.125, width, height * 0.085);
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fill();

      // Gentle mountain haze / sunset mist band (soft warm peach-golden mist)
      const mistGrad = ctx.createLinearGradient(0, height * 0.07, 0, height * 0.15);
      mistGrad.addColorStop(0, isSunset ? 'rgba(254, 215, 170, 0.32)' : 'rgba(255, 255, 255, 0.25)');
      mistGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, height * 0.06, width, height * 0.09);

      // Distant tranquil lake shimmer on the horizon (nestled gently in the valley hills)
      const lakeGrad = ctx.createLinearGradient(0, height * 0.09, width * 0.22, height * 0.13);
      if (isNight) {
        lakeGrad.addColorStop(0, 'rgba(2, 132, 199, 0.45)');
        lakeGrad.addColorStop(1, 'rgba(3, 43, 67, 0.2)');
      } else if (isSunset) {
        lakeGrad.addColorStop(0, 'rgba(251, 146, 60, 0.45)');
        lakeGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.25)');
        lakeGrad.addColorStop(1, 'rgba(14, 165, 233, 0.18)');
      } else {
        lakeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        lakeGrad.addColorStop(1, 'rgba(2, 132, 199, 0.25)');
      }
      ctx.fillStyle = lakeGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.098);
      ctx.bezierCurveTo(width * 0.08, height * 0.09, width * 0.16, height * 0.11, width * 0.22, height * 0.125);
      ctx.bezierCurveTo(width * 0.14, height * 0.135, width * 0.06, height * 0.13, 0, height * 0.125);
      ctx.closePath();
      ctx.fill();

      // Active village preset and biome configuration
      const activeVid = currentVillageIdRef.current;
      const activeVillageData = villagesRegistry[activeVid];
      const targetBiome = activeVillageData?.biome || 'forest';
      const activePreset = VILLAGE_PRESETS.find(p => p.id === activeVid)
        || VILLAGE_PRESETS.find(p => p.biome === targetBiome)
        || VILLAGE_PRESETS[0];
      const isDesert = activePreset.biome === 'desert';
      const isForest = activePreset.biome === 'forest';

      // 3. LAYERED NATURAL HORIZON (Biome-tailored: Sandstone Mesa / Mystic Pine Ridge / Rolling Green Hills)
      if (isDesert) {
        // Sandstone Desert Mesa & Golden Dunes Ridge
        const canyonGrad = ctx.createLinearGradient(0, height * 0.07, 0, height * 0.18);
        canyonGrad.addColorStop(0, isNight ? '#261b15' : (isSunset ? '#9a3412' : '#c2410c'));
        canyonGrad.addColorStop(1, isNight ? '#3b281f' : (isSunset ? '#ea580c' : '#d97706'));
        ctx.fillStyle = canyonGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.11);
        ctx.bezierCurveTo(width * 0.25, height * 0.08, width * 0.5, height * 0.12, width * 0.75, height * 0.09);
        ctx.lineTo(width, height * 0.11);
        ctx.lineTo(width, height * 0.18);
        ctx.lineTo(0, height * 0.18);
        ctx.closePath();
        ctx.fill();
      } else if (isForest) {
        // Towering Mystic Pine & Fir Ridge
        const ridgeGrad = ctx.createLinearGradient(0, height * 0.07, 0, height * 0.18);
        ridgeGrad.addColorStop(0, isNight ? '#03170b' : (isSunset ? '#193306' : '#064e3b'));
        ridgeGrad.addColorStop(1, isNight ? '#062d14' : (isSunset ? '#365314' : '#047857'));
        ctx.fillStyle = ridgeGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.10);
        ctx.bezierCurveTo(width * 0.3, height * 0.07, width * 0.65, height * 0.12, width, height * 0.08);
        ctx.lineTo(width, height * 0.18);
        ctx.lineTo(0, height * 0.18);
        ctx.closePath();
        ctx.fill();
      } else {
        // Gentle Rolling Green Hills
        const ridgeGrad = ctx.createLinearGradient(0, height * 0.08, 0, height * 0.18);
        ridgeGrad.addColorStop(0, isNight ? '#052210' : (isSunset ? '#365314' : '#14532d'));
        ridgeGrad.addColorStop(1, isNight ? '#0b3518' : (isSunset ? '#4d7515' : '#16a34a'));
        ctx.fillStyle = ridgeGrad;
        ctx.beginPath();
        ctx.moveTo(0, height * 0.115);
        ctx.bezierCurveTo(width * 0.35, height * 0.08, width * 0.7, height * 0.13, width, height * 0.10);
        ctx.lineTo(width, height * 0.18);
        ctx.lineTo(0, height * 0.18);
        ctx.closePath();
        ctx.fill();
      }

      // 4. EXPANSIVE MEADOW CLEARING & CULTIVABLE FRONTIER TILES
      ctx.save();
      ctx.translate(origin.x, origin.y);
      ctx.scale(zoom, zoom);
      ctx.translate(-origin.x, -origin.y);

      const currentTier = expansionTierRef.current;
      const isCultivating = isCultivatingModeRef.current;

      // Biome-specific ground palette tailored to time of day
      const terrainSet = activePreset.terrainColors[tod] || activePreset.terrainColors.day;
      let grass1 = terrainSet.grass1;
      let grass2 = terrainSet.grass2;
      let grass3 = terrainSet.grass3;
      let grassHi = terrainSet.grassHi;
      const flowerColor = terrainSet.flower;

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

            drawTile(
              sx, sy, color, isHovered, (currentBuildItem || movingObjectRef.current) && !isOccupied,
              ((gx * 73856093) ^ (gy * 19349663)) >>> 0,
              tile.colorType === 3 ? grass1 : undefined
            );

            if (tile.isWildflower) {
              ctx.fillStyle = flowerColor || (isSunset ? '#fef08a' : '#f472b6');
              ctx.beginPath();
              ctx.arc(sx + 3, sy + TILE_H / 2 - 2, 2.2, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      // 4.5 CLICK DESTINATION RUNE (Stardew-style golden pulsing ring on ground)
      if (playerControllerRef.current?.destinationMarker) {
        drawDestinationIndicator(ctx, playerControllerRef.current.destinationMarker, toScreen, origin, zoom, TILE_W, TILE_H);
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
          if (v.activity === 'picking_fruit' && v.activityTimer === 120) {
            sounds.playChomp();
            v.emote = '🍎';
            v.emoteTimer = 90;
          }

          v.activityTimer--;
          if (v.activityTimer <= 0) {
            v.activity = null;
            v.idleTimer = 40 + Math.floor(Math.random() * 50); // ~0.7-1.5s idle before next movement
            v.emote = '✨';
            v.emoteTimer = 80;
          }
        }

        // Controlled Player Movement Engine (WASD & Click-to-Move, 60 FPS silky smooth)
        if (playerControllerRef.current) {
          playerControllerRef.current.update(dt, {
            checkClearing,
            placedObjects: currentPlaced,
            gridSize: GRID_SIZE
          });
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
          x: origin.x + (vPos.x - origin.x) * zoom,
          y: origin.y + (vPos.y + TILE_H / 2 - origin.y) * zoom
        };
      }

      // Update autonomous animals simulation
      if (animalsRef.current && animalsRef.current.length > 0) {
        updateAnimalsSimulation(animalsRef.current, dt, checkClearing, currentPlaced, GRID_SIZE);
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

      // Add living animals to depth-sorted render list
      if (animalsRef.current && animalsRef.current.length > 0) {
        animalsRef.current.forEach(animal => {
          renderEntities.push({
            kind: 'animal',
            depth: animal.currGx + animal.currGy + 0.08,
            animal
          });
        });
      }

      renderEntities.sort((a, b) => a.depth - b.depth);

      const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
      const animTime = Date.now() * 0.003;
      const BADGE_PROXIMITY_TILES = 2.5; // villager distance (in tiles) that reveals a name badge

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

          // Associative Mind Map Badge floating above object (visual only):
          // hidden by default; revealed on mouse hover, villager proximity, or while inspected.
          if (showMindMapTagsRef.current && item.obj.customName) {
            const isHoveredObj = !!currentHovered && currentHovered.gx === item.obj.gx && currentHovered.gy === item.obj.gy;
            const nearVillager = !!v && Math.hypot(v.currGx - item.obj.gx, v.currGy - item.obj.gy) < BADGE_PROXIMITY_TILES;
            const reveal = stepBadgeReveal(`o:${item.obj.gx},${item.obj.gy}`, isHoveredObj || nearVillager || isInspected);
            if (reveal > 0.01) {
              const nameText = item.obj.customEmoji ? `${item.obj.customEmoji} ${item.obj.customName}` : item.obj.customName;
              drawParchmentBadge(ctx, {
                x: sx,
                tipY: sy - 6,
                text: nameText,
                cared: item.obj.lastCaredDate === todayStr,
                reveal,
                key: `o:${item.obj.gx},${item.obj.gy}`
              });
            }
          }
        } else if (item.kind === 'animal') {
          const { x: sx, y: sy } = toScreen(item.animal.currGx, item.animal.currGy, origin.x, origin.y);
          item.animal.screenPos = {
            x: origin.x + (sx - origin.x) * zoom,
            y: origin.y + (sy + TILE_H / 2 - origin.y) * zoom
          };
          // Name tag is hidden by default; reveal on hover over the animal's tile or villager proximity
          const animalHovered = !!currentHovered &&
            currentHovered.gx === Math.round(item.animal.currGx) && currentHovered.gy === Math.round(item.animal.currGy);
          const animalNear = !!v && Math.hypot(v.currGx - item.animal.currGx, v.currGy - item.animal.currGy) < BADGE_PROXIMITY_TILES;
          const animalReveal = stepBadgeReveal(`a:${item.animal.id || item.animal.name}`, animalHovered || animalNear);
          drawAnimal(ctx, item.animal, { x: sx, y: sy + TILE_H / 2 }, {
            isSunset,
            isNight,
            showTag: showMindMapTagsRef.current,
            tagReveal: animalReveal,
            isHovered: currentHovered?.gx === item.animal.gx && currentHovered?.gy === item.animal.gy,
            todayStr
          });
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

      ctx.restore();

      // 5. SCREEN-EDGE BORDER TREES (Natural scenic framing on right and bottom edges, scaled on wider screens)
      if (width >= 640) {
        drawScreenEdgeForest(width, height, isSunset, isNight);
      }

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
        const sunsetVignette = ctx.createRadialGradient(width * 0.25, height * 0.25, 100, width * 0.5, height * 0.5, width * 0.85);
        sunsetVignette.addColorStop(0, 'rgba(251, 146, 60, 0.05)');
        sunsetVignette.addColorStop(0.5, 'rgba(253, 164, 175, 0.03)');
        sunsetVignette.addColorStop(1, 'rgba(120, 53, 15, 0.07)');
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
      window.removeEventListener('orientationchange', onOrient);
      canvas.removeEventListener('wheel', handleCanvasWheel);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Convert screen mouse coordinates to tile coordinates
  const getTileCoordsFromEvent = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? (e.touches[0] ? e.touches[0].clientX : e.changedTouches?.[0]?.clientX) : e.clientX;
    const clientY = e.touches ? (e.touches[0] ? e.touches[0].clientY : e.changedTouches?.[0]?.clientY) : e.clientY;
    if (clientX === undefined || clientY === undefined) return null;
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const zoom = cameraZoomRef.current || 1;
    const originX = canvas.width / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0);
    const originY = canvas.height * GRID_ORIGIN_Y_RATIO + (cameraPanRef.current ? cameraPanRef.current.y : 0);

    const relX = (mouseX - originX) / zoom;
    const relY = (mouseY - originY) / zoom;

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

    const zoom = cameraZoomRef.current || 1;
    const originX = canvas.width / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0);
    const originY = canvas.height * GRID_ORIGIN_Y_RATIO + (cameraPanRef.current ? cameraPanRef.current.y : 0);

    // Convert screen coordinates to world coordinates
    const worldMouseX = originX + (mouseX - originX) / zoom;
    const worldMouseY = originY + (mouseY - originY) / zoom;

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
      const inX = Math.abs(worldMouseX - cx) <= halfWidth;
      const inY = worldMouseY >= (cy - topOffset) && worldMouseY < cy;

      if (inX && inY) {
        return obj;
      }
    }

    return null;
  };

  // Cultivate single frontier plot (Free & unrestricted)
  const handleCultivatePlot = (gx, gy) => {
    sounds.playCultivate();

    const newPlot = { gx, gy, cultivatedAt: Date.now() };
    setCultivatedPlots(prev => [...prev, newPlot]);
    setFrontierInspectTile(null);

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.8;
      v.emote = '🌱';
      v.emoteTimer = 130;
      const quote = CULTIVATION_QUOTES[Math.floor(Math.random() * CULTIVATION_QUOTES.length)];
      v.bubble = { text: quote, timer: 300 };
    }
  };

  // Upgrade Territory Tier (Free & unrestricted)
  const handleUpgradeTier = (targetTier) => {
    sounds.playTerritoryExpand();
    setExpansionTier(targetTier);

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

  // Batch Cultivate (Free & unrestricted)
  const handleBatchCultivate = (count) => {
    sounds.playTerritoryExpand();

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

  // Switch Active Village / Biome Realm (Method of Loci travel)
  const handleSwitchVillage = (targetVillageId) => {
    if (targetVillageId === currentVillageId) return;
    const targetVillage = villagesRegistry[targetVillageId] || VILLAGE_PRESETS.find(p => p.id === targetVillageId);
    if (!targetVillage) return;

    sounds.playChime();
    const destName = targetVillage.name || targetVillage.defaultName;
    setTravelingNotice(`יוצא למסע אל ${destName}... 🧭✨`);

    // 1. Persist current village data
    const updatedRegistry = {
      ...villagesRegistry,
      [currentVillageId]: {
        ...villagesRegistry[currentVillageId],
        placedObjects,
        expansionTier,
        cultivatedPlots,
        lastVisited: new Date().toISOString()
      }
    };
    setVillagesRegistry(updatedRegistry);
    saveVillagesRegistry(updatedRegistry);

    // 2. Switch active village ID
    setCurrentVillageId(targetVillageId);
    currentVillageIdRef.current = targetVillageId;
    localStorage.setItem(STORAGE_KEY_ACTIVE_VILLAGE, targetVillageId);

    // 3. Load target village data
    const newObjs = targetVillage.placedObjects || targetVillage.starterObjects || [];
    const newTier = targetVillage.expansionTier || 1;
    const newCultivated = targetVillage.cultivatedPlots || [];

    setPlacedObjects(newObjs);
    placedObjectsRef.current = newObjs;
    setExpansionTier(newTier);
    expansionTierRef.current = newTier;
    setCultivatedPlots(newCultivated);
    cultivatedPlotsRef.current = newCultivated;

    // 4. Update grid cache and border scenery
    tileGridCacheRef.current = computeTileGrid(newTier, newCultivated, newObjs);
    borderSceneryRef.current = computeBorderScenery(newTier, newCultivated, newObjs);

    // 5. Re-fit camera
    handleFitToScreen();

    // 6. Villager celebration upon arrival (fully reset to integer grid coordinates)
    const v = animEntitiesRef.current?.villager;
    if (v) {
      v.gx = 11;
      v.gy = 11;
      v.currGx = 11;
      v.currGy = 11;
      v.startGx = 11;
      v.startGy = 11;
      v.targetGx = 11;
      v.targetGy = 11;
      v.progress = 1;
      v.activity = null;
      v.activityTarget = null;
      v.idleTimer = 30;
      v.hopVy = -7.5;
      v.emote = targetVillage.icon || '🏰';
      v.emoteTimer = 180;
      v.bubble = {
        text: `ברוך הבא אל ${destName}! נוף חדש, צבעים חדשים וזיכרונות חדשים! ✨`,
        timer: 360
      };
    }

    setTimeout(() => {
      setTravelingNotice(null);
    }, 1100);
  };

  // Apply Compiled Cognitive Survey Blueprint to Realm
  const handleApplyBlueprint = (blueprint) => {
    if (!blueprint || !blueprint.villages || blueprint.villages.length === 0) return;

    sounds.playChime();
    setTravelingNotice(`מכונן את ארץ הזכרונות המותאמת שלך... 🧠✨`);

    // 1. Build updated registry including the new customized villages
    const updatedRegistry = { ...villagesRegistry };
    blueprint.villages.forEach(v => {
      updatedRegistry[v.id] = {
        id: v.id,
        name: v.name,
        biome: v.biome,
        icon: v.icon,
        badge: v.badge,
        color: v.color,
        description: v.description,
        placedObjects: v.placedObjects,
        expansionTier: v.expansionTier || 1,
        cultivatedPlots: v.cultivatedPlots || [],
        spatialRecipe: v.spatialRecipe,
        lastVisited: new Date().toISOString()
      };
    });

    setVillagesRegistry(updatedRegistry);
    saveVillagesRegistry(updatedRegistry);

    // 2. Automatically switch to the first generated village!
    const firstVillage = blueprint.villages[0];
    setCurrentVillageId(firstVillage.id);
    currentVillageIdRef.current = firstVillage.id;
    localStorage.setItem(STORAGE_KEY_ACTIVE_VILLAGE, firstVillage.id);

    setPlacedObjects(firstVillage.placedObjects);
    placedObjectsRef.current = firstVillage.placedObjects;
    setExpansionTier(1);
    expansionTierRef.current = 1;
    setCultivatedPlots([]);
    cultivatedPlotsRef.current = [];

    tileGridCacheRef.current = computeTileGrid(1, [], firstVillage.placedObjects);
    borderSceneryRef.current = computeBorderScenery(1, [], firstVillage.placedObjects);

    handleFitToScreen();

    // 3. Emote celebration (fully reset to integer grid coordinates)
    const v = animEntitiesRef.current?.villager;
    if (v) {
      v.gx = 12;
      v.gy = 12;
      v.currGx = 12;
      v.currGy = 12;
      v.startGx = 12;
      v.startGy = 12;
      v.targetGx = 12;
      v.targetGy = 12;
      v.progress = 1;
      v.activity = null;
      v.activityTarget = null;
      v.idleTimer = 30;
      v.hopVy = -8;
      v.emote = firstVillage.icon || '✨';
      v.emoteTimer = 220;
      v.bubble = {
        text: `ברוך הבא אל ${firstVillage.name}! הכפר נבנה במיוחד עבורך 🗺️✨`,
        timer: 320
      };
    }

    setTimeout(() => {
      setTravelingNotice(null);
    }, 1200);
  };

  const handleRenameVillage = (villageId, newName) => {
    setVillagesRegistry(prev => {
      const updated = {
        ...prev,
        [villageId]: {
          ...prev[villageId],
          name: newName
        }
      };
      saveVillagesRegistry(updated);
      return updated;
    });
  };

  // Apply Village Framework / Template or Clean Slate
  const handleApplyVillageTemplate = (template) => {
    if (!template) return;
    const newObjs = (template.items || []).map(item => ({ ...item }));
    setPlacedObjects(newObjs);
    placedObjectsRef.current = newObjs;

    // Update village in registry
    setVillagesRegistry(prev => {
      const updated = {
        ...prev,
        [currentVillageId]: {
          ...prev[currentVillageId],
          placedObjects: newObjs,
          lastVisited: new Date().toISOString()
        }
      };
      saveVillagesRegistry(updated);
      return updated;
    });

    // Recompute grid cache and border scenery
    tileGridCacheRef.current = computeTileGrid(expansionTier, cultivatedPlots, newObjs);
    borderSceneryRef.current = computeBorderScenery(expansionTier, cultivatedPlots, newObjs);

    // Villager celebration
    const v = animEntitiesRef.current?.villager;
    if (v) {
      v.currGx = 11;
      v.currGy = 11;
      v.targetGx = 11;
      v.targetGy = 11;
      v.hopVy = -8.0;
      v.emote = template.icon || '🏛️';
      v.emoteTimer = 220;
      v.bubble = {
        text: template.id === 'blank'
          ? 'דף חלק ונקי! כעת יש לנו חופש מוחלט לבנות את הכפר מחדש שלב אחר שלב 🌱✨'
          : `תבנית "${template.name}" הוחלה בהצלחה! בוא נטמיע בה את הזיכרונות והכוונות שלנו! 🏛️✨`,
        timer: 360
      };
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

  // Remove placed object (Free clearing)
  const handleRemoveObject = (obj) => {
    if (!obj) return;
    sounds.playTap();
    setPlacedObjects(prev => prev.filter(o => !(o.gx === obj.gx && o.gy === obj.gy)));
    if (obj.animalId) {
      setAnimals(prev => prev.filter(a => a.id !== obj.animalId));
    }
    setAnimals(prev => prev.filter(a => !(a.gx === obj.gx && a.gy === obj.gy && a.type === obj.type?.replace('animal_', ''))));
    setInspectedObject(null);
    setMovingObject(null);

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.bubble = { text: 'הפריט הוסר והמשבצת פונתה בהצלחה! 🧹', timer: 260 };
      v.emote = '🧹';
      v.emoteTimer = 110;
    }
  };

  // Add 100 free inspiration seeds for unhindered creation
  const handleAddInspirationSeeds = () => {
    sounds.playNourish();
    setSeeds(s => s + 100);
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

  // Update commemorated memory, custom name, custom emoji and date for an object or animal
  const handleUpdateObjectMemory = (gx, gy, newMemory, newDate, newCustomName, animalId, newCustomEmoji) => {
    sounds.playNourish();

    // 1. Update placed static objects (if matched by tile)
    setPlacedObjects(prev => prev.map(o => {
      if (o.gx === gx && o.gy === gy) {
        return {
          ...o,
          memory: newMemory,
          dedicatedTo: newMemory,
          date: newDate,
          customName: newCustomName !== undefined ? newCustomName : o.customName,
          customEmoji: newCustomEmoji !== undefined ? newCustomEmoji : o.customEmoji
        };
      }
      return o;
    }));

    // 2. Update animals by unique animalId (or fallback to gx, gy)
    if (animalsRef.current && animalsRef.current.length > 0) {
      animalsRef.current = animalsRef.current.map(a => {
        const isTarget = animalId ? (a.id === animalId) : (a.gx === gx && a.gy === gy);
        if (isTarget) {
          return {
            ...a,
            name: newCustomName !== undefined ? newCustomName : a.name,
            customNote: newMemory !== undefined ? newMemory : a.customNote,
            customEmoji: newCustomEmoji !== undefined ? newCustomEmoji : a.customEmoji
          };
        }
        return a;
      });
      saveAnimals(animalsRef.current);
      setAnimals([...animalsRef.current]);
    }

    setInspectedObject(prev => prev ? {
      ...prev,
      memory: newMemory,
      dedicatedTo: newMemory,
      date: newDate,
      customName: newCustomName !== undefined ? newCustomName : prev.customName,
      customEmoji: newCustomEmoji !== undefined ? newCustomEmoji : prev.customEmoji
    } : null);

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -4.5;
      v.bubble = { text: 'העוגן והאסוציאציה נשמרו בפינה זו באהבה! 💭✨', timer: 260 };
      v.emote = '💖';
      v.emoteTimer = 110;
    }
  };

  // Active Recall & Daily Care Routine (חזרתיות ותרגול הזיכרון)
  const handleNourishRecall = (obj) => {
    sounds.playNourish();
    const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });

    // 1. If it's an animal
    if (obj.animalId || obj.isAnimal) {
      if (animalsRef.current) {
        animalsRef.current = animalsRef.current.map(a => {
          if (a.id === obj.animalId || (a.gx === obj.gx && a.gy === obj.gy)) {
            return {
              ...a,
              lastCaredDate: todayStr,
              completed: true
            };
          }
          return a;
        });
        saveAnimals(animalsRef.current);
        setAnimals([...animalsRef.current]);
      }
    } else {
      // 2. If it's a placed object
      setPlacedObjects(prev => prev.map(o => {
        if (o.gx === obj.gx && o.gy === obj.gy) {
          return {
            ...o,
            lastCaredDate: todayStr
          };
        }
        return o;
      }));
    }

    // Update current inspected object
    setInspectedObject(prev => prev ? {
      ...prev,
      lastCaredDate: todayStr,
      completed: true
    } : null);

    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.0;
      const targetName = obj.customName || 'העוגן';
      v.bubble = { 
        text: `מעולה! הזיכרון של "${targetName}" חודד וטופח היום בהצלחה! 🌟`, 
        timer: 300 
      };
      v.emote = '✨';
      v.emoteTimer = 130;
    }
  };

  // Gentle Daily Village Care Ritual (מים לצמחים ואוכל לחיות בנחת)
  const handleDailyVillageCare = () => {
    sounds.playNourish();
    const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });

    setLastVillageCareDate(todayStr);
    localStorage.setItem('lifequest_village_care_date', todayStr);

    // 1. Mark all placed objects as cared today
    setPlacedObjects(prev => prev.map(o => ({
      ...o,
      lastCaredDate: todayStr
    })));

    // 2. Mark all animals as cared today
    if (animalsRef.current && animalsRef.current.length > 0) {
      animalsRef.current = animalsRef.current.map(a => ({
        ...a,
        lastCaredDate: todayStr,
        completed: true
      }));
      saveAnimals(animalsRef.current);
      setAnimals([...animalsRef.current]);
    }

    // 3. Update inspected object if open
    setInspectedObject(prev => prev ? {
      ...prev,
      lastCaredDate: todayStr,
      completed: true
    } : null);

    // 4. Cheerful, relaxing villager animation
    const v = animEntitiesRef.current.villager;
    if (v) {
      v.hopVy = -5.0;
      v.bubble = { 
        text: 'השקית את הצמחים ונתת אוכל לחיות! 🌿💧 כל הכפר רגוע ושבע.', 
        timer: 320 
      };
      v.emote = '💖';
      v.emoteTimer = 140;
    }
  };

  // Pick fruit from fruit tree or bush
  const handlePickFruit = (obj) => {
    sounds.playNourish();
    setFruitsEaten(f => f + 1);
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

    const zoom = cameraZoomRef.current || 1;
    const dx = (placedObj.gx - placedObj.gy) * (TILE_W / 2);
    const dy = (placedObj.gx + placedObj.gy) * (TILE_H / 2);

    hasUserPannedOrZoomedRef.current = true;
    setCameraPan({
      x: Math.round(-dx * zoom),
      y: Math.round(canvas.height * 0.44 - canvas.height * GRID_ORIGIN_Y_RATIO - dy * zoom)
    });

    setInspectedObject(placedObj);
  };


  // Mouse / Touch Down: Initiate click, item drag, or world pan/zoom
  const handlePointerDown = (e) => {
    // Multi-touch pinch start
    if (e.touches && e.touches.length >= 2) {
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      const midX = (p1.clientX + p2.clientX) / 2;
      const midY = (p1.clientY + p2.clientY) / 2;
      pinchRef.current = {
        startDist: dist,
        startZoom: cameraZoomRef.current,
        lastMidX: midX,
        lastMidY: midY
      };
      pointerDownInfoRef.current = null;
      return;
    }

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

      const zoom = cameraZoomRef.current || 1;
      const originX = (canvas ? canvas.width / 2 : 0) + (cameraPanRef.current?.x || 0);
      const originY = (canvas ? canvas.height * GRID_ORIGIN_Y_RATIO : 0) + (cameraPanRef.current?.y || 0);

      // Compare in world space
      const worldClickX = originX + (clickScreenX - originX) / zoom;
      const worldClickY = originY + (clickScreenY - originY) / zoom;
      const vWorldX = originX + (v.currGx - v.currGy) * (TILE_W / 2);
      const vWorldY = originY + (v.currGx + v.currGy) * (TILE_H / 2) + TILE_H / 2;

      const dist = Math.hypot(worldClickX - vWorldX, worldClickY - (vWorldY - 18));
      const gridDist = Math.hypot(gx - v.currGx, gy - v.currGy);
      if (dist < 34 || gridDist < 0.95) {
        sounds.playTap();
        v.hopVy = -6.5;
        v.hopY = -1;
        v.emote = '👗';
        v.emoteTimer = 130;
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

    const currentBuildItem = selectedBuildItemRef.current;
    const isModularBuild = currentBuildItem && (
      currentBuildItem.isModular || 
      ['stone_wall', 'wooden_fence', 'cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'fence'].includes(currentBuildItem.renderType)
    );

    let placedOnDownGx = null;
    let placedOnDownGy = null;

    // Instant placement on initial click/touch for paths & walls (makes drag-to-pave feel ultra-responsive)
    if (isModularBuild && !itemOnTile && inClearing && !isDemolishModeRef.current) {
      placedOnDownGx = gx;
      placedOnDownGy = gy;
      const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
      const memoryText = `רגע של ${currentBuildItem.tag}`;
      const newObj = {
        gx,
        gy,
        type: currentBuildItem.renderType,
        dedicatedTo: memoryText,
        memory: memoryText,
        date: todayStr,
        createdAt: Date.now(),
        customName: ''
      };
      setPlacedObjects(prev => [...prev, newObj]);
      sounds.playPlant();
    }

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
      lastPlacedGx: placedOnDownGx,
      lastPlacedGy: placedOnDownGy,
      item: itemOnTile
    };
  };

  // Mouse / Touch Move: Update hover tile, pan world, or drag item
  const handlePointerMove = (e) => {
    // Multi-touch pinch move
    if (e.touches && e.touches.length >= 2 && pinchRef.current) {
      const p1 = e.touches[0];
      const p2 = e.touches[1];
      const dist = Math.hypot(p1.clientX - p2.clientX, p1.clientY - p2.clientY);
      const midX = (p1.clientX + p2.clientX) / 2;
      const midY = (p1.clientY + p2.clientY) / 2;

      hasUserPannedOrZoomedRef.current = true;

      // Zoom
      const scaleFactor = dist / pinchRef.current.startDist;
      const newZoom = Math.min(1.7, Math.max(0.35, Number((pinchRef.current.startZoom * scaleFactor).toFixed(3))));
      setCameraZoom(newZoom);
      cameraZoomRef.current = newZoom;

      // Two-finger pan
      const dMidX = midX - pinchRef.current.lastMidX;
      const dMidY = midY - pinchRef.current.lastMidY;
      setCameraPan(prev => {
        const next = { x: prev.x + dMidX, y: prev.y + dMidY };
        cameraPanRef.current = next;
        return next;
      });
      pinchRef.current.lastMidX = midX;
      pinchRef.current.lastMidY = midY;
      return;
    }

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
      const zoom = cameraZoomRef.current || 1;
      const originX = canvas.width / 2 + (cameraPanRef.current ? cameraPanRef.current.x : 0);
      const originY = canvas.height * GRID_ORIGIN_Y_RATIO + (cameraPanRef.current ? cameraPanRef.current.y : 0);
      const worldClickX = originX + (clientX - rect.left - originX) / zoom;
      const worldClickY = originY + (clientY - rect.top - originY) / zoom;
      const vWorldX = originX + (v?.currGx - v?.currGy) * (TILE_W / 2);
      const vWorldY = originY + (v?.currGx + v?.currGy) * (TILE_H / 2) + TILE_H / 2;

      const isOverVillager = v && (
        Math.hypot(worldClickX - vWorldX, worldClickY - (vWorldY - 18)) < 34 ||
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
      const currentBuildItem = selectedBuildItemRef.current;
      const isModularBuild = currentBuildItem && (
        currentBuildItem.isModular || 
        ['stone_wall', 'wooden_fence', 'cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'fence'].includes(currentBuildItem.renderType)
      );

      // Support smooth drag-painting for modular items (walls, fences, paths)
      if (isModularBuild && (inClearing || checkClearing(gx, gy))) {
        if (downInfo.lastPlacedGx !== gx || downInfo.lastPlacedGy !== gy) {
          const isOccupied = placedObjectsRef.current.some(o => o.gx === gx && o.gy === gy);
          if (!isOccupied) {
            downInfo.hasMoved = true;
            downInfo.lastPlacedGx = gx;
            downInfo.lastPlacedGy = gy;
            const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const memoryText = `רגע של ${currentBuildItem.tag}`;
            const newObj = {
              gx,
              gy,
              type: currentBuildItem.renderType,
              dedicatedTo: memoryText,
              memory: memoryText,
              date: todayStr,
              createdAt: Date.now(),
              customName: ''
            };
            setPlacedObjects(prev => [...prev, newObj]);
            sounds.playPlant();
          }
        }
      }

      const totalDist = Math.hypot(clientX - downInfo.startX, clientY - downInfo.startY);

      if (totalDist > 6) {
        downInfo.hasMoved = true;

        // Instant Direct Drag & Drop: Pick up item immediately upon moving pointer
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
        } else if (!activeDragRef.current && !selectedBuildItemRef.current && !isDemolishModeRef.current && !isModularBuild) {
          // Smooth Ground Panning: Move camera across sanctuary
          const dx = clientX - downInfo.lastX;
          const dy = clientY - downInfo.lastY;
          downInfo.lastX = clientX;
          downInfo.lastY = clientY;
          hasUserPannedOrZoomedRef.current = true;
          setCameraPan(prev => {
            const next = { x: prev.x + dx, y: prev.y + dy };
            cameraPanRef.current = next;
            return next;
          });
          if (canvas) {
            canvas.style.cursor = 'grabbing';
          }
        }
      }
    }
  };

  // Mouse / Touch Up: Complete drag-and-drop OR trigger click / move / build
  const handlePointerUp = () => {
    pinchRef.current = null;
    const downInfo = pointerDownInfoRef.current;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'default';
    }

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

    // Pointer moved without dragging an item: was a camera pan or modular drag!
    if (downInfo && downInfo.hasMoved && !downInfo.item) {
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

        // Building Mode: Place item from catalog (Free & unrestricted)
        if (selectedBuildItem) {
          if (existing) {
            sounds.playTap();
            alert('משבצת זו כבר תפוסה על ידי פריט אחר.');
          } else {
            sounds.playPlant();
            const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
            const memoryText = `רגע של ${selectedBuildItem.tag}`;
            const newObj = {
              gx,
              gy,
              type: selectedBuildItem.renderType,
              dedicatedTo: memoryText,
              memory: memoryText,
              date: todayStr,
              createdAt: Date.now(),
              customName: selectedBuildItem.isAnimal ? selectedBuildItem.name : ''
            };
            const isModular = selectedBuildItem.isModular || [
              'stone_wall', 'wooden_fence', 'cobblestone_road', 
              'stone_path', 'wood_path', 'brick_path', 'dirt_trail', 'fence'
            ].includes(selectedBuildItem.renderType);

            // If placing a living animal from catalog, spawn into autonomous animals list!
            if (selectedBuildItem.isAnimal) {
              const newAnimal = createAnimal(selectedBuildItem.animalType, gx, gy, selectedBuildItem.name);
              animalsRef.current = [...(animalsRef.current || []), newAnimal];
              saveAnimals(animalsRef.current);
              setAnimals([...animalsRef.current]);
              setFrontierInspectTile(null);
              setInspectedObject({
                gx: newAnimal.gx,
                gy: newAnimal.gy,
                type: `animal_${newAnimal.type}`,
                customName: newAnimal.name,
                memory: newAnimal.customNote || 'חיה כפרית שלווה',
                date: todayStr,
                isAnimal: true,
                animalId: newAnimal.id
              });
            } else {
              setPlacedObjects(prev => [...prev, newObj]);
              setFrontierInspectTile(null);
              // For modular walls and paths, DO NOT pop up inspect modal so user can build stacks freely!
              if (!isModular) {
                setInspectedObject(newObj);
              }
            }

            // If placing animal coop, also spawn an initial happy chicken nearby!
            if (selectedBuildItem.renderType === 'animal_coop') {
              const coopChick = createAnimal('chicken', Math.min(GRID_SIZE - 2, gx + 1), gy, 'תרנגולת כפרית', 'דסקית, חוגר, ארנק...', { gx, gy });
              animalsRef.current = [...(animalsRef.current || []), coopChick];
              saveAnimals(animalsRef.current);
              setAnimals([...animalsRef.current]);
            }

            // For modular items (walls, fences, paths), keep tool selected so user can place in stacks!
            if (!continuousBuild && !isModular) {
              setSelectedBuildItem(null);
            }
          }
          pointerDownInfoRef.current = null;
          return;
        }

        // Check if an animal was clicked near this tile
        const clickedAnimal = animalsRef.current?.find(a => 
          (Math.abs(a.currGx - gx) < 0.85 && Math.abs(a.currGy - gy) < 0.85) ||
          (a.gx === gx && a.gy === gy)
        );

        if (clickedAnimal) {
          const onReachAnimal = () => {
            sounds.playTap();
            setInspectedObject({
              gx: clickedAnimal.gx,
              gy: clickedAnimal.gy,
              type: `animal_${clickedAnimal.type}`,
              customName: clickedAnimal.name,
              customEmoji: clickedAnimal.customEmoji || '',
              memory: clickedAnimal.customNote || 'חיה כפרית שלווה',
              date: new Date().toLocaleDateString('he-IL'),
              isAnimal: true,
              animalId: clickedAnimal.id,
              lastCaredDate: clickedAnimal.lastCaredDate || null
            });
            setMovingObject(null);
          };
          playerControllerRef.current?.moveTo(gx, gy, { checkClearing, placedObjects, gridSize: GRID_SIZE }, onReachAnimal);
        } else if (existing) {
          const onReachBuilding = () => {
            sounds.playTap();
            setInspectedObject(existing);
            setMovingObject(null);
          };
          playerControllerRef.current?.moveTo(gx, gy, { checkClearing, placedObjects, gridSize: GRID_SIZE }, onReachBuilding);
        } else {
          setMovingObject(null);
          setInspectedObject(null);
          playerControllerRef.current?.moveTo(gx, gy, { checkClearing, placedObjects, gridSize: GRID_SIZE });
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

  const handlePlaceStoryMonument = (monumentData) => {
    let targetGx = 13, targetGy = 13;
    const occupied = new Set(placedObjects.map(o => `${o.gx},${o.gy}`));
    
    // Check if player's tile or neighbor is free
    const v = animEntitiesRef.current?.villager;
    const baseGx = v ? Math.round(v.currGx) : 13;
    const baseGy = v ? Math.round(v.currGy) : 13;

    let found = false;
    for (let r = 0; r < 12; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dy = -r; dy <= r; dy++) {
          if (r > 0 && Math.abs(dx) !== r && Math.abs(dy) !== r) continue;
          const gx = baseGx + dx;
          const gy = baseGy + dy;
          if (gx >= 1 && gx < GRID_SIZE - 1 && gy >= 1 && gy < GRID_SIZE - 1) {
            if (checkClearing(gx, gy) && !occupied.has(`${gx},${gy}`)) {
              targetGx = gx;
              targetGy = gy;
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }
      if (found) break;
    }

    const newObj = {
      ...monumentData,
      gx: targetGx,
      gy: targetGy,
      createdAt: Date.now()
    };

    setPlacedObjects(prev => [...prev, newObj]);
    sounds.playLevelUp?.();

    if (v) {
      v.emote = '📖';
      v.emoteTimer = 140;
      v.bubble = { text: `אנדרטת "${newObj.title}" הוצבה בהצלחה בכפר! ✨`, timer: 280 };
    }

    setInspectedObject(newObj);
  };

  return (
    <div className="wholesome-sanctuary-root">
      {/* Top-Left Floating Village Realm Pill Badge */}
      <button
        className="village-realm-pill-hud glass-card"
        onClick={() => {
          sounds.playTap();
          setShowRealmMap(true);
        }}
        title="מפת הממלכה והעולמות 🗺️ — לחץ להחלפת כפר ונוף"
      >
        <span className="realm-hud-icon">
          {VILLAGE_PRESETS.find(p => p.id === currentVillageId)?.icon || '🌾'}
        </span>
        <div className="realm-hud-info">
          <span className="realm-hud-name">
            {villagesRegistry[currentVillageId]?.name || VILLAGE_PRESETS.find(p => p.id === currentVillageId)?.defaultName || 'הכפר שלי'}
          </span>
          <span className="realm-hud-badge">
            {VILLAGE_PRESETS.find(p => p.id === currentVillageId)?.badge || 'גבעות'}
          </span>
        </div>
        <Compass size={14} className="realm-hud-compass" />
      </button>

      {/* Interactive Contiguous Island Border Gateways (1-click travel on village borders) */}
      <div className="island-border-gateways-container">
        {currentVillageId === 'military' && (
          <>
            <button
              className="border-gateway-pill border-gateway-right glass-card"
              onClick={() => handleSwitchVillage('business')}
              title="מעבר שער הגבול המזרחי אל כפר היזמות והעסק 🏛️"
            >
              <span className="gateway-name">כפר היזמות והעסק 🏛️</span>
              <span className="gateway-arrow">➡️</span>
            </button>
            <button
              className="border-gateway-pill border-gateway-bottom glass-card"
              onClick={() => handleSwitchVillage('sanctuary')}
              title="שביל הירידה הדרומי אל עמק כפר החיים והשגרה 🏡"
            >
              <span className="gateway-name">כפר חיים ושגרה 🏡</span>
              <span className="gateway-arrow">⬇️</span>
            </button>
          </>
        )}

        {currentVillageId === 'business' && (
          <>
            <button
              className="border-gateway-pill border-gateway-left glass-card"
              onClick={() => handleSwitchVillage('military')}
              title="מעבר שער הגבול המערבי אל יער כפר הצבא 🪖"
            >
              <span className="gateway-arrow">⬅️</span>
              <span className="gateway-name">יער כפר הצבא והביטחון 🪖</span>
            </button>
            <button
              className="border-gateway-pill border-gateway-bottom glass-card"
              onClick={() => handleSwitchVillage('sanctuary')}
              title="שביל הירידה הדרומי אל עמק כפר החיים והשגרה 🏡"
            >
              <span className="gateway-name">כפר חיים ושגרה 🏡</span>
              <span className="gateway-arrow">⬇️</span>
            </button>
          </>
        )}

        {currentVillageId === 'sanctuary' && (
          <>
            <button
              className="border-gateway-pill border-gateway-top-left glass-card"
              onClick={() => handleSwitchVillage('military')}
              title="שביל העלייה הצפון-מערבי אל יער כפר הצבא 🪖"
            >
              <span className="gateway-arrow">↖️</span>
              <span className="gateway-name">אל יער כפר הצבא 🪖</span>
            </button>
            <button
              className="border-gateway-pill border-gateway-top-right glass-card"
              onClick={() => handleSwitchVillage('business')}
              title="דרך העלייה הצפון-מזרחית אל כפר היזמות והעסק 💼"
            >
              <span className="gateway-name">אל כפר היזמות והעסק 💼</span>
              <span className="gateway-arrow">↗️</span>
            </button>
          </>
        )}
      </div>

      {/* Cinematic Realm Travel Overlay */}
      {travelingNotice && (
        <div className="realm-travel-overlay">
          <div className="realm-travel-card glass-card">
            <Compass size={44} className="travel-spinner-icon" />
            <h3>{travelingNotice}</h3>
            <p>מעביר את הנוף, הצבעים, הצלילים והזיכרונות...</p>
          </div>
        </div>
      )}

      {/* Sleek Right-Side Floating Control Dock (Clean & Minimal: Build, Day Mode, Sound) */}
      <aside className="sanctuary-side-dock" aria-label="תפריט שליטה ראשי">
        {/* 1. Core Building & Creation Control */}
        <button
          className={`dock-btn build-dock-btn ${showPlantingDrawer ? 'active' : ''}`}
          onClick={() => {
            sounds.playTap();
            setShowPlantingDrawer(!showPlantingDrawer);
            setShowPathsPalette(false);
          }}
          title="בנייה ויצירה 🛠️"
        >
          <Hammer size={20} className="text-amber" />
          <span className="dock-btn-label">בנייה</span>
        </button>

        {/* 2. Mood & Landscape Switcher (Day / Sunset / Night) */}
        <div className="dock-tod-group" title="שינוי מוד ואווירה בנוף">
          <button
            className={`dock-tod-btn ${timeOfDay === 'day' ? 'active' : ''}`}
            onClick={() => { sounds.playTap(); setTimeOfDay('day'); }}
            title="שעות יום ☀️"
          >
            <Sun size={16} />
          </button>
          <button
            className={`dock-tod-btn ${timeOfDay === 'sunset' ? 'active' : ''}`}
            onClick={() => { sounds.playTap(); setTimeOfDay('sunset'); }}
            title="שעת שקיעה 🌅"
          >
            <Sunset size={16} />
          </button>
          <button
            className={`dock-tod-btn ${timeOfDay === 'night' ? 'active' : ''}`}
            onClick={() => { sounds.playTap(); setTimeOfDay('night'); }}
            title="לילה זרוע כוכבים 🌙"
          >
            <Moon size={16} />
          </button>
        </div>

        {/* 3. Multi-Branch Memory Hierarchy Tree Explorer */}
        <button
          className={`dock-btn tree-dock-btn ${showHierarchyTree ? 'active' : ''}`}
          onClick={() => {
            sounds.playTap();
            setShowHierarchyTree(true);
          }}
          title="עץ בינארי רב אפשרויות — ארמון הזיכרון (שיטת המפתחות) 🌳"
        >
          <GitBranch size={20} className="text-emerald" />
          <span className="dock-btn-label">עץ מידע</span>
        </button>

        {/* 4. Sound Ambience Toggle */}
        <button
          className={`dock-btn sound-dock-btn ${soundMuted ? 'muted' : ''}`}
          onClick={toggleSound}
          title={soundMuted ? 'השמע צלילי טבע' : 'השתק צלילים'}
        >
          {soundMuted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          <span className="dock-btn-label">{soundMuted ? 'מושתק' : 'סאונד'}</span>
        </button>
      </aside>

      {/* Floating Dedicated Paths & Roads Paving Palette */}
      {showPathsPalette && (
        <div className="wholesome-paths-palette glass-card" role="toolbar" aria-label="סרגל סלילת שבילים">
          <div className="paths-palette-head">
            <div className="paths-palette-title">
              <span className="palette-icon">🛤️</span>
              <div>
                <strong>סלילת שבילים וחיבור מקומות</strong>
                <span className="palette-sub">לחץ או גרור ברצף עם העכבר/אצבע לסלילת נתיב רציף ומחבר</span>
              </div>
            </div>
            <button
              className="close-mini-btn"
              onClick={() => {
                sounds.playTap();
                setShowPathsPalette(false);
                setSelectedBuildItem(null);
              }}
              title="סגור סרגל שבילים"
            >
              <X size={16} />
            </button>
          </div>

          <div className="paths-palette-items">
            {[
              { id: 'dirt_trail', name: 'שביל עפר', emoji: '🍂', desc: 'אדמה כפרית טבעית' },
              { id: 'cobblestone_road', name: 'שביל אבן', emoji: '🛤️', desc: 'ריצוף אבנים רחב ורציף' },
              { id: 'stone_path', name: 'אבני מדרך', emoji: '🪨', desc: 'אבני מדרך טבעיות' },
              { id: 'wood_path', name: 'שביל עץ', emoji: '🪵', desc: 'לוחות עץ כפריים' },
              { id: 'brick_path', name: 'שביל לבנים', emoji: '🧱', desc: 'ריצוף לבנים אדומות' },
              { id: 'wooden_fence', name: 'גדר נמוכה', emoji: '🪵', desc: 'גדר עץ קומפקטית' },
              { id: 'stone_wall', name: 'חומת אבן', emoji: '🧱', desc: 'חומת מבצר קטנה' }
            ].map(p => {
              const catalogItem = BUILD_CATALOG.find(c => c.renderType === p.id);
              const isActive = !isDemolishMode && selectedBuildItem?.renderType === p.id;

              return (
                <button
                  key={p.id}
                  className={`path-palette-pill ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    sounds.playTap();
                    setIsDemolishMode(false);
                    setMovingObject(null);
                    setContinuousBuild(true);
                    if (catalogItem) {
                      setSelectedBuildItem(catalogItem);
                    }
                  }}
                  title={`${p.name} — ${p.desc}`}
                >
                  <span className="path-pill-emoji">{p.emoji}</span>
                  <span className="path-pill-name">{p.name}</span>
                </button>
              );
            })}

            {/* Path Eraser / Demolish Mode */}
            <button
              className={`path-palette-pill path-eraser-pill ${isDemolishMode ? 'active' : ''}`}
              onClick={() => {
                sounds.playTap();
                setIsDemolishMode(!isDemolishMode);
                if (!isDemolishMode) {
                  setSelectedBuildItem(null);
                }
              }}
              title="מחיקת שביל — לחץ על משבצת שביל לפינוי והחזרתה לדשא"
            >
              <Trash2 size={14} />
              <span className="path-pill-name">מחק 🧹</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Cultivate / Add Tiles Mode Banner */}
      {isCultivatingMode && (
        <div className="wholesome-cultivate-banner">
          <span>🌱 מצב הרחבת שטח פעיל: לחץ על החלקות המהבהבות בגבול הכפר להוספת משבצות חדשות</span>
          <button
            className="cancel-cultivate-pill"
            onClick={() => setIsCultivatingMode(false)}
          >
            סיום ✕
          </button>
        </div>
      )}

      {/* Floating Building Mode Banner */}
      {selectedBuildItem && !showPathsPalette && (
        <div className="wholesome-plant-banner">
          <span>
            🛠️ בונה כעת: <strong>{selectedBuildItem.name}</strong>{' '}
            {['cobblestone_road', 'stone_path', 'wood_path', 'brick_path', 'dirt_trail'].includes(selectedBuildItem.renderType)
              ? '🛤️ (סלילת שבילים — לחץ או גרור עם העכבר/אצבע לסלילת דרך רציפה וחלקה)'
              : (selectedBuildItem.isModular || ['stone_wall', 'wooden_fence', 'fence'].includes(selectedBuildItem.renderType)
                ? '🧱 (בנייה חופשית בערמות — לחץ על משבצות או גרור עם העכבר להנחה רציפה)'
                : (continuousBuild ? '🌿 (בנייה רציפה פעילה 🔁)' : ''))}
            {' '}— לחץ על משבצת בדשא להנחה
          </span>
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
          style={{ cursor: draggingObject ? 'grabbing' : isCultivatingMode ? 'crosshair' : 'default' }}
        />

        {/* Floating Zoom & Screen Adaptation Controls HUD */}
        <div className="sanctuary-zoom-hud" aria-label="בקרי תצוגה והתאמה למסך">
          <button
            className="zoom-hud-btn"
            onClick={() => {
              sounds.playTap();
              hasUserPannedOrZoomedRef.current = true;
              setCameraZoom(z => {
                const next = Math.min(1.7, Number((z * 1.15).toFixed(2)));
                cameraZoomRef.current = next;
                return next;
              });
            }}
            title="התקרב (+)"
            aria-label="התקרב"
          >
            <ZoomIn size={17} />
          </button>

          <button
            className="zoom-hud-btn zoom-fit-btn"
            onClick={handleFitToScreen}
            title="התאם למסך ומרכז כפר 🎯"
            aria-label="התאם למסך ומרכז כפר"
          >
            <Maximize2 size={16} />
            <span className="zoom-percentage-label">{Math.round(cameraZoom * 100)}%</span>
          </button>

          <button
            className="zoom-hud-btn"
            onClick={() => {
              sounds.playTap();
              hasUserPannedOrZoomedRef.current = true;
              setCameraZoom(z => {
                const next = Math.max(0.35, Number((z / 1.15).toFixed(2)));
                cameraZoomRef.current = next;
                return next;
              });
            }}
            title="התרחק (-)"
            aria-label="התרחק"
          >
            <ZoomOut size={17} />
          </button>

          <button
            className="zoom-hud-btn zoom-fullscreen-btn"
            onClick={handleToggleFullscreen}
            title="מסך מלא לרוחב (כמו Clash of Clans) 📲"
            aria-label="מסך מלא לרוחב"
          >
            <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>📲</span>
          </button>
        </div>
      </main>

      {/* Clash of Clans Mobile Landscape Orientation Guide Overlay */}
      {isMobilePortrait && !dismissedOrientationPrompt && (
        <div className="mobile-landscape-prompt-overlay" onClick={() => setDismissedOrientationPrompt(true)}>
          <div className="landscape-prompt-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="rotate-phone-animation">
              <span className="phone-icon-animated">📱</span>
              <span className="rotate-arrow">⤹</span>
              <span className="phone-icon-landscape">📲</span>
            </div>
            <h3 className="landscape-prompt-title">מומלץ לשחק לרוחב 🏰🌾</h3>
            <p className="landscape-prompt-desc">
              כדי לראות את כל הכפר במלוא הדרו (כמו ב-Clash of Clans),
              סובב את המכשיר למצב שוכב (Landscape)
            </p>
            <div className="landscape-prompt-actions">
              <button
                className="enter-fullscreen-btn"
                onClick={async () => {
                  await handleToggleFullscreen();
                  setDismissedOrientationPrompt(true);
                }}
              >
                <span>מעבר למסך מלא לרוחב 📲</span>
              </button>
              <button
                className="continue-portrait-btn"
                onClick={() => {
                  sounds.playTap();
                  setDismissedOrientationPrompt(true);
                }}
              >
                המשך לאורך בינתיים
              </button>
            </div>
          </div>
        </div>
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
                className="tool-toggle-btn institutions-btn"
                onClick={() => {
                  sounds.playTap();
                  setShowInstitutionsModal(true);
                  setShowPlantingDrawer(false);
                }}
                title="מוסדות הכפר ועוגני הזיכרון 🌾"
              >
                <Wheat size={13} className="text-amber" />
                <span>מוסדות 🌾</span>
              </button>

              <button
                className={`tool-toggle-btn paths-btn ${showPathsPalette ? 'active' : ''}`}
                onClick={() => {
                  sounds.playTap();
                  setShowPathsPalette(true);
                  setShowPlantingDrawer(false);
                  setIsDemolishMode(false);
                  setMovingObject(null);
                  const trailItem = BUILD_CATALOG.find(c => c.renderType === 'dirt_trail') || BUILD_CATALOG.find(c => c.renderType === 'cobblestone_road');
                  if (trailItem) {
                    setSelectedBuildItem(trailItem);
                    setContinuousBuild(true);
                  }
                }}
                title="סרגל סלילת שבילים וגבולות 🛤️"
              >
                <span>שבילים 🛤️</span>
              </button>

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
                className="tool-toggle-btn templates-btn"
                onClick={() => {
                  sounds.playTap();
                  setShowTemplatesModal(true);
                  setShowPlantingDrawer(false);
                }}
                title="תבניות כפר — בחר מסגרת מאורגנת או התחל מאפס"
              >
                <Layers size={13} />
                <span>תבניות 🏛️</span>
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
                title="מצב פינוי — לחץ על פריטים בלוח להסרתם ופינוי המשבצת"
              >
                <Trash2 size={13} />
                <span>פינוי 🧹</span>
              </button>
            </div>
          </div>

          {/* Catalog Items Grid */}
          <div className="wholesome-catalog-stack">
            {selectedBuildCategory === 'מוסדות הכפר' && (
              <div className="build-spotlight-bar institutions-spotlight">
                <div className="spotlight-text">
                  <Wheat size={18} className="text-amber" />
                  <div>
                    <strong>מוסדות הכפר וארמונות הזיכרון 🌾</strong>
                    <p>מבנים מרכזיים בעלי חללים פנימיים לקידוד עוגני זיכרון, שגרה ומחשבות.</p>
                  </div>
                </div>
                <button
                  className="spotlight-open-btn"
                  onClick={() => {
                    sounds.playTap();
                    setShowInstitutionsModal(true);
                    setShowPlantingDrawer(false);
                  }}
                >
                  פתח לוח מוסדות מפורט 🌾
                </button>
              </div>
            )}

            {selectedBuildCategory === 'שבילים וגבולות' && (
              <div className="build-spotlight-bar paths-spotlight">
                <div className="spotlight-text">
                  <span style={{ fontSize: '18px' }}>🛤️</span>
                  <div>
                    <strong>סלילת שבילים, ריצוף וגדרות</strong>
                    <p>חיבור בין חלקי הכפר. ניתן לבחור סוג שביל ולגרור ברצף על הלוח!</p>
                  </div>
                </div>
                <button
                  className="spotlight-open-btn"
                  onClick={() => {
                    sounds.playTap();
                    setShowPathsPalette(true);
                    setShowPlantingDrawer(false);
                    setIsDemolishMode(false);
                    setMovingObject(null);
                    const trailItem = BUILD_CATALOG.find(c => c.renderType === 'dirt_trail') || BUILD_CATALOG.find(c => c.renderType === 'cobblestone_road');
                    if (trailItem) {
                      setSelectedBuildItem(trailItem);
                      setContinuousBuild(true);
                    }
                  }}
                >
                  סרגל סלילה מהירה 🛤️
                </button>
              </div>
            )}

            {BUILD_CATALOG
              .filter(item => {
                if (selectedBuildCategory !== 'הכל') {
                  if (selectedBuildCategory === 'מוסדות הכפר') {
                    const institutionTypes = ['wooden_cabin', 'animal_coop', 'gym', 'library', 'bakery', 'greenhouse', 'farm', 'art_studio', 'veggie_garden', 'windmill', 'community_center'];
                    if (!institutionTypes.includes(item.renderType) && item.category !== 'מוסדות הכפר') return false;
                  } else if (item.category !== selectedBuildCategory) {
                    return false;
                  }
                }
                if (buildSearchQuery.trim()) {
                  const q = buildSearchQuery.toLowerCase();
                  return item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
                }
                return true;
              })
              .map(item => {
                const isSelected = selectedBuildItem?.id === item.id;

                return (
                  <div
                    key={item.id}
                    className={`wholesome-card ${isSelected ? 'selected' : ''}`}
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
                      {item.completed && <span className="nourished-badge">טופח באהבה ✨</span>}
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
          onNourishRecall={handleNourishRecall}
          onEnterInterior={(obj, catItem) => {
            sounds.playTap();
            setInteriorBuilding({ building: obj, catalogItem: catItem });
            setInspectedObject(null);
          }}
        />
      )}

      {/* Building Interior Modal (Multi-Dimensional Depth) */}
      {interiorBuilding && (
        <BuildingInteriorModal
          building={interiorBuilding.building}
          catalogItem={interiorBuilding.catalogItem}
          onClose={() => setInteriorBuilding(null)}
          animals={animals}
          onUpdateAnimal={(animalId, updates) => {
            setAnimals(prev => prev.map(a => a.id === animalId ? { ...a, ...updates } : a));
          }}
          onAddAnimalToBuilding={(type, gx, gy, name) => {
            const newAnim = createAnimal(type, gx, gy, name, '', { gx, gy });
            setAnimals(prev => [...prev, newAnim]);
          }}
          onEarnSeeds={(amount) => {
            setSeeds(s => s + amount);
          }}
          seeds={seeds}
          villagerLook={villagerLook}
          currentOutfit={currentOutfit}
        />
      )}

      {/* Village Institutions & Spatial Memory Palaces Modal */}
      {showInstitutionsModal && (
        <VillageInstitutionsModal
          isOpen={showInstitutionsModal}
          onClose={() => setShowInstitutionsModal(false)}
          placedObjects={placedObjects}
          onFocusInstitution={handleFocusInstitution}
          onEnterInterior={(placedObj, inst) => {
            sounds.playTap();
            setShowInstitutionsModal(false);
            const targetType = placedObj?.type || inst?.id || 'wooden_cabin';
            const catItem = BUILD_CATALOG.find(c => c.renderType === targetType) || {
              id: targetType,
              name: inst?.name || placedObj?.customName || 'מבנה כפר',
              emoji: inst?.emoji || '🏡'
            };
            setInteriorBuilding({ 
              building: placedObj || { gx: 5, gy: 5, type: targetType, customName: inst?.name }, 
              catalogItem: catItem 
            });
          }}
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
            </div>

            {/* Direct manual adding mode trigger */}
            <div className="expansion-mode-callout">
              <div className="callout-text">
                <strong>רוצה להוסיף חלקות בודדות במפה?</strong>
                <span>הפעל את מצב הרחבת שטח ולחץ ישירות על גבולות הכפר (הכשרה חופשית ללא עלות)</span>
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
                          className="upgrade-tier-btn"
                          onClick={() => handleUpgradeTier(t.tier)}
                        >
                          <Sparkles size={14} />
                          <span>שדרוג נחלה ✨</span>
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
                onClick={() => handleBatchCultivate(5)}
                title="הכשר 5 חלקות סמוכות בבת אחת"
              >
                <span>הכשרת 5 חלקות 🌾</span>
              </button>
              <button
                className="batch-btn"
                onClick={() => handleBatchCultivate(10)}
                title="הכשר 10 חלקות סמוכות בבת אחת"
              >
                <span>הכשרת 10 חלקות ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* World Realm Map Modal (Method of Loci & Multi-Village Sanctuary) */}
      <WorldRealmMapModal
        isOpen={showRealmMap}
        onClose={() => setShowRealmMap(false)}
        currentVillageId={currentVillageId}
        villagesRegistry={villagesRegistry}
        onSelectVillage={handleSwitchVillage}
        onRenameVillage={handleRenameVillage}
        onOpenSurvey={() => setShowSurveyModal(true)}
      />

      {/* Village Frameworks & Logical Templates Modal */}
      <VillageTemplatesModal
        isOpen={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        currentPlacedObjects={placedObjects}
        onApplyTemplate={handleApplyVillageTemplate}
      />

      {/* Cognitive Survey Profiling Modal */}
      <CognitiveSurveyModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        onApplyBlueprint={handleApplyBlueprint}
      />

      {/* Story to Living Monument Generator Modal */}
      <StoryToMonumentModal
        isOpen={showStoryModal}
        onClose={() => setShowStoryModal(false)}
        onPlaceMonument={handlePlaceStoryMonument}
      />

      {/* Binary Multi-Branch Memory Hierarchy Tree Explorer (שיטת המפתחות) */}
      <MemoryHierarchyTreeModal
        isOpen={showHierarchyTree}
        onClose={() => setShowHierarchyTree(false)}
      />
    </div>
  );
}
