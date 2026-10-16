// Multi-Village Biomes & World Realm System for Life Quest
// Topographical & environmental variations stimulate memory recall (Method of Loci / Mind Palace)

export const BIOMES = {
  HILLS: 'hills',
  FOREST: 'forest',
  DESERT: 'desert'
};

export const VILLAGE_PRESETS = [
  {
    id: 'hills',
    biome: BIOMES.HILLS,
    defaultName: 'גבעות התקווה',
    icon: '🌾',
    badge: 'גבעות מוריקות',
    tagline: 'גבעות מוריקות, מרחבי אחו צלולים ומשב רוח רענן',
    description: 'סביבה ירוקה, פתוחה ומלאת שמש. מעולה לעיגון זיכרונות של צמיחה אישית, התחלות חדשות, בריאות ואופטימיות.',
    memoryFocus: 'עוגן לזיכרונות של צמיחה, התחדשות, תנועה והתחלות חדשות',
    scienceTip: 'גווני ירוק ואור פתוח מעוררים תחושת מרחב ומפחיתים סטרס, ומסייעים בקידוד זיכרונות הקשורים בלמידה ובריאות.',
    themeColor: '#22c55e',
    accentBg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.1))',
    terrainColors: {
      day: {
        grass1: '#64af32',
        grass2: '#5aa32a',
        grass3: '#509623',
        grassHi: '#6ebc37',
        flower: '#f472b6'
      },
      sunset: {
        grass1: '#65961d',
        grass2: '#598918',
        grass3: '#4d7515',
        grassHi: '#c2850c',
        flower: '#fef08a'
      },
      night: {
        grass1: '#1c4217',
        grass2: '#163812',
        grass3: '#112c0e',
        grassHi: '#24521d',
        flower: '#a855f7'
      }
    },
    horizonType: 'hills_lake',
    particleType: 'dandelion',
    starterObjects: [
      { gx: 10, gy: 10, type: 'reading_bench', dedicatedTo: 'רגע שקט של בוקר עם כוס קפה', memory: 'רגע שקט של בוקר עם כוס קפה', date: '10/10/2026' },
      { gx: 10, gy: 11, type: 'oak_tree', dedicatedTo: 'ספר שעורר בי השראה', memory: 'ספר שעורר בי השראה', date: '11/10/2026' },
      { gx: 12, gy: 10, type: 'flower_garden', dedicatedTo: 'שנת לילה עמוקה ומנוחה', memory: 'שנת לילה עמוקה ומנוחה', date: '11/10/2026' },
      { gx: 9, gy: 12, type: 'bush', dedicatedTo: 'הליכה נעימה בשקיעה', memory: 'הליכה נעימה בשקיעה', date: '12/10/2026' },
      { gx: 8, gy: 11, type: 'tea_table', dedicatedTo: 'פינת תה כפרית להפוגה חמימה', memory: 'פינת תה כפרית להפוגה חמימה', date: '12/10/2026' },
      { gx: 13, gy: 11, type: 'bonfire', dedicatedTo: 'מדורה של חום וחיבור אמיתי', memory: 'מדורה של חום וחיבור אמיתי', date: '13/10/2026' },
      { gx: 11, gy: 13, type: 'river_tile', dedicatedTo: 'פלג מים לשחרור וזרימה', memory: 'פלג מים לשחרור וזרימה', date: '13/10/2026' },
      { gx: 12, gy: 13, type: 'river_tile', dedicatedTo: 'מים צלולים לשחייה ורעננות', memory: 'מים צלולים לשחייה ורעננות', date: '13/10/2026' }
    ]
  },
  {
    id: 'forest',
    biome: BIOMES.FOREST,
    defaultName: 'יער הלחשים העתיק',
    icon: '🌲',
    badge: 'יער עבות וטחב',
    tagline: 'שטיח טחב עמוק, צמרות אלונים ואור מסתורי בין הענפים',
    description: 'סביבת יער מכושפת ומרגיעה עם ניחוח אורנים וצליל פכפוך פלג מים. אידיאלית לזיכרונות של עומק רגשי, שקט נפשי והתבוננות.',
    memoryFocus: 'עוגן לזיכרונות של התבוננות פנימית, שקט, תובנות עמוקות וספרים אהובים',
    scienceTip: 'סביבה יערנית צפופה (שטיחי טחב וצבעי אזמרגד כהים) יוצרת תחושת מוגנות ומפעילה את מערכת הזיכרון הרפלקטיבית.',
    themeColor: '#059669',
    accentBg: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(6, 78, 59, 0.15))',
    terrainColors: {
      day: {
        grass1: '#2f6029',
        grass2: '#265121',
        grass3: '#1e421a',
        grassHi: '#3c7935',
        flower: '#67e8f9'
      },
      sunset: {
        grass1: '#3d5220',
        grass2: '#33441a',
        grass3: '#293714',
        grassHi: '#857519',
        flower: '#fde047'
      },
      night: {
        grass1: '#122e1b',
        grass2: '#0e2415',
        grass3: '#091b10',
        grassHi: '#1c4428',
        flower: '#a78bfa'
      }
    },
    horizonType: 'dense_forest_mist',
    particleType: 'firefly_spores',
    starterObjects: [
      { gx: 10, gy: 10, type: 'reading_bench', dedicatedTo: 'שקט מוחלט והקשבה לרחשי היער', memory: 'שקט מוחלט והקשבה לרחשי היער', date: '14/10/2026' },
      { gx: 10, gy: 11, type: 'oak_tree', dedicatedTo: 'אלון עתיק שמזכיר יציבות וסבלנות', memory: 'אלון עתיק שמזכיר יציבות וסבלנות', date: '14/10/2026' },
      { gx: 11, gy: 10, type: 'tea_table', dedicatedTo: 'ספל תה צמחים חם מול שטיח הטחב', memory: 'ספל תה צמחים חם מול שטיח הטחב', date: '14/10/2026' },
      { gx: 12, gy: 11, type: 'bonfire', dedicatedTo: 'מדורה קטנה שמפיגה את צינת היער', memory: 'מדורה קטנה שמפיגה את צינת היער', date: '15/10/2026' },
      { gx: 12, gy: 12, type: 'river_tile', dedicatedTo: 'פלג מים זך שמנקה את המחשבות', memory: 'פלג מים זך שמנקה את המחשבות', date: '15/10/2026' },
      { gx: 13, gy: 12, type: 'river_tile', dedicatedTo: 'חלוקי נחל וצליל מים זורמים', memory: 'חלוקי נחל וצליל מים זורמים', date: '15/10/2026' },
      { gx: 9, gy: 11, type: 'bush', dedicatedTo: 'שיחי פטל יער מתוקים', memory: 'שיחי פטל יער מתוקים', date: '15/10/2026' }
    ]
  },
  {
    id: 'desert',
    biome: BIOMES.DESERT,
    defaultName: 'נווה המדבר המוזהב',
    icon: '🏜️',
    badge: 'חולות זהב ונווה מדבר',
    tagline: 'דיונות חול חמימות סביב מעיין מים קריר ועצי תמר',
    description: 'סביבה מדברית זהובה עם אואזיס שוקק חיים, צל דקלים ולילות מדבר זרועי כוכבים. מתאימה לחגיגת הישגים, חוסן נפשי וחום אנושי.',
    memoryFocus: 'עוגן לזיכרונות של חוסן, התגברות על אתגרים, הצלחות, חמימות וחיבור',
    scienceTip: 'גווני טרקוטה, חרס וזהב מדברי מפעילים אסוציאציות של חום והישג, ומעניקים עוגן חזק במיוחד לזיכרונות של ניצחון אישי.',
    themeColor: '#f59e0b',
    accentBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.15))',
    terrainColors: {
      day: {
        grass1: '#dfaa6a',
        grass2: '#d39d5b',
        grass3: '#c78f4d',
        grassHi: '#ecc286',
        flower: '#ef4444'
      },
      sunset: {
        grass1: '#c8864b',
        grass2: '#bc793e',
        grass3: '#b06d33',
        grassHi: '#e09e5b',
        flower: '#facc15'
      },
      night: {
        grass1: '#372a24',
        grass2: '#2f231d',
        grass3: '#261c16',
        grassHi: '#4d3b32',
        flower: '#38bdf8'
      }
    },
    horizonType: 'desert_dunes_canyon',
    particleType: 'golden_sand_dust',
    starterObjects: [
      { gx: 11, gy: 11, type: 'river_tile', dedicatedTo: 'מעיין נווה מדבר צלול ומרווה', memory: 'מעיין נווה מדבר צלול ומרווה', date: '15/10/2026' },
      { gx: 12, gy: 11, type: 'river_tile', dedicatedTo: 'מי אואזיס קרירים בלב הישימון', memory: 'מי אואזיס קרירים בלב הישימון', date: '15/10/2026' },
      { gx: 10, gy: 11, type: 'reading_bench', dedicatedTo: 'סככת צל חמימה ומנוחה מהחום', memory: 'סככת צל חמימה ומנוחה מהחום', date: '15/10/2026' },
      { gx: 10, gy: 10, type: 'tea_table', dedicatedTo: 'מגש תה נענע מדברי מתוק וחם', memory: 'מגש תה נענע מדברי מתוק וחם', date: '15/10/2026' },
      { gx: 13, gy: 10, type: 'bonfire', dedicatedTo: 'מדורה מדברית תחת שמיים מלאי כוכבים', memory: 'מדורה מדברית תחת שמיים מלאי כוכבים', date: '15/10/2026' },
      { gx: 9, gy: 12, type: 'flower_garden', dedicatedTo: 'גן סוקולנטים ופרחי מדבר עמידים', memory: 'גן סוקולנטים ופרחי מדבר עמידים', date: '15/10/2026' }
    ]
  }
];

export const STORAGE_KEY_VILLAGES_REGISTRY = 'lifequest_villages_registry_v2';
export const STORAGE_KEY_ACTIVE_VILLAGE = 'lifequest_active_village_v2';

// Helper to initialize or retrieve the villages registry
export function loadVillagesRegistry(existingPlacedObjects = null, existingExpansionTier = 2, existingCultivated = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VILLAGES_REGISTRY);
    let registry = raw ? JSON.parse(raw) : null;

    if (!registry || typeof registry !== 'object') {
      registry = {};
    }

    // Ensure all 3 biomes exist in registry
    VILLAGE_PRESETS.forEach(preset => {
      if (!registry[preset.id]) {
        // If it's hills and player already had objects in older save, migrate them!
        const initialObjs = (preset.id === 'hills' && Array.isArray(existingPlacedObjects) && existingPlacedObjects.length > 0)
          ? existingPlacedObjects
          : preset.starterObjects;

        const initialTier = (preset.id === 'hills' && existingExpansionTier) ? existingExpansionTier : 1;
        const initialCultivated = (preset.id === 'hills' && Array.isArray(existingCultivated)) ? existingCultivated : [];

        registry[preset.id] = {
          id: preset.id,
          name: preset.defaultName,
          biome: preset.biome,
          placedObjects: initialObjs,
          expansionTier: initialTier,
          cultivatedPlots: initialCultivated,
          lastVisited: new Date().toISOString()
        };
      }
    });

    localStorage.setItem(STORAGE_KEY_VILLAGES_REGISTRY, JSON.stringify(registry));
    return registry;
  } catch (err) {
    console.error('Failed to load villages registry:', err);
    // Fallback minimal registry
    const fallback = {};
    VILLAGE_PRESETS.forEach(p => {
      fallback[p.id] = {
        id: p.id,
        name: p.defaultName,
        biome: p.biome,
        placedObjects: p.starterObjects,
        expansionTier: 1,
        cultivatedPlots: [],
        lastVisited: new Date().toISOString()
      };
    });
    return fallback;
  }
}

export function saveVillagesRegistry(registry) {
  try {
    localStorage.setItem(STORAGE_KEY_VILLAGES_REGISTRY, JSON.stringify(registry));
  } catch (err) {
    console.error('Failed to save villages registry:', err);
  }
}
