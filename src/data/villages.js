// Multi-Village Biomes & World Realm System for Life Quest
// STRICTLY 3 Core Villages: Military, Business, Sanctuary

export const BIOMES = {
  FOREST: 'forest',
  MODERN: 'modern',
  PASTORAL: 'pastoral'
};

export const VILLAGE_PRESETS = [
  // 1. צבא וביטחון (יער עבות ירוק, ארגון ומשמעת)
  {
    id: 'military',
    biome: 'forest',
    defaultName: 'צבא — מחנה פלוגה מאורגן',
    icon: '🪖',
    badge: 'משמעת וסדר • יער עבות',
    climateName: 'אקלים מיוער ומוגן',
    climateTemp: '16°C • גשום וקריר',
    tagline: 'יער אלונים עבות ומוגן עם רחבת מסדרים מיושרת ושבילי חצץ',
    description: 'מחנה צבאי מאורגן, מיושר וממושמע בלב יער ירוק. רחבת מסדרים מרובעת סביב מפקדת הפלוגה, שורות שיחים בסימטריה ותורן מסדרים.',
    memoryFocus: 'עוגן לפקודות, משימות, כשירות, משמעת יומיומית ותפקיד צבאי',
    scienceTip: 'ארגון סימטרי וצבע ירוק-זית ביומת יער מורידים סטרס מבצעי ומאפשרים שליפה מהירה של משימות בסקירה אחת.',
    themeColor: '#65a30d',
    accentBg: 'linear-gradient(135deg, rgba(101, 163, 13, 0.25), rgba(77, 124, 15, 0.15))',
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
      { gx: 12, gy: 12, type: 'animal_coop', customName: 'מפקדת הפלוגה והתדריכים', customEmoji: '🪖', dedicatedTo: 'מפקדת הפלוגה — מוקד פיקוד ומוכנות' },
      { gx: 12, gy: 9, type: 'bonfire', customName: 'לפיד המסדרים ותורן הדגל', customEmoji: '🚩', dedicatedTo: 'נקודת כינוס ומסדרים' },
      { gx: 11, gy: 12, type: 'cobblestone_road', dedicatedTo: 'רחבת מסדרים מיושרת' },
      { gx: 13, gy: 12, type: 'cobblestone_road', dedicatedTo: 'רחבת מסדרים מיושרת' },
      { gx: 12, gy: 11, type: 'cobblestone_road', dedicatedTo: 'רחבת מסדרים מיושרת' },
      { gx: 12, gy: 13, type: 'cobblestone_road', dedicatedTo: 'רחבת מסדרים מיושרת' },
      { gx: 10, gy: 12, type: 'cobblestone_road' },
      { gx: 14, gy: 12, type: 'cobblestone_road' },
      { gx: 12, gy: 10, type: 'cobblestone_road' },
      { gx: 12, gy: 14, type: 'cobblestone_road' },
      { gx: 10, gy: 10, type: 'bush' },
      { gx: 14, gy: 10, type: 'bush' },
      { gx: 10, gy: 14, type: 'bush' },
      { gx: 14, gy: 14, type: 'bush' },
      { gx: 9, gy: 12, type: 'stone_wall' },
      { gx: 15, gy: 12, type: 'stone_wall' },
      { gx: 10, gy: 11, type: 'reading_bench', customName: 'עמדת תדריכים ופקודות', customEmoji: '📋', dedicatedTo: 'פקודת יום ומשימות שוטפות' }
    ]
  },

  // 2. עסק ויזמות (מודרניות, סדר, קווים נקיים)
  {
    id: 'business',
    biome: 'hills',
    defaultName: 'יזמות — מתחם מודרני ונקי',
    icon: '💼',
    badge: 'מודרניות וסדר • שדרת שיש',
    climateName: 'אקלים בהיר וממוזג',
    climateTemp: '22°C • שמשי ומואר',
    tagline: 'קווים גיאומטריים נקיים, רחבה מרוצפת ושדרת פרויקטים וסחר',
    description: 'מרכז עסקים מודרני, מסודר ונקי מכל הסחות דעת. שדרת פרויקטים תכנונית, שולחנות עבודה ומרחב פיתוח ברור.',
    memoryFocus: 'עוגן ליעדים עסקיים, לקוחות, תזרים, פרויקטים ומנועי צמיחה',
    scienceTip: 'קווים נקיים ומשטחי שיש/לבנים מייצרים בהירות לוגית ומפחיתים עומס קוגניטיבי סביב החלטות פיננסיות.',
    themeColor: '#d97706',
    accentBg: 'linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(180, 83, 9, 0.15))',
    terrainColors: {
      day: {
        grass1: '#64748b',
        grass2: '#475569',
        grass3: '#334155',
        grassHi: '#94a3b8',
        flower: '#facc15'
      },
      sunset: {
        grass1: '#6366f1',
        grass2: '#4f46e5',
        grass3: '#4338ca',
        grassHi: '#a5b4fc',
        flower: '#fbbf24'
      },
      night: {
        grass1: '#1e1b4b',
        grass2: '#17143a',
        grass3: '#0f0e26',
        grassHi: '#312e81',
        flower: '#38bdf8'
      }
    },
    horizonType: 'hills_lake',
    particleType: 'dandelion',
    starterObjects: [
      { gx: 12, gy: 12, type: 'bakery', customName: 'מרכז היזמות וחדר המצב', customEmoji: '💼', dedicatedTo: 'מוקד היזמות והפרויקטים' },
      { gx: 11, gy: 12, type: 'brick_path', dedicatedTo: 'שדרת יזמות מרוצפת' },
      { gx: 13, gy: 12, type: 'brick_path', dedicatedTo: 'שדרת יזמות מרוצפת' },
      { gx: 12, gy: 11, type: 'brick_path', dedicatedTo: 'שדרת יזמות מרוצפת' },
      { gx: 12, gy: 13, type: 'brick_path', dedicatedTo: 'שדרת יזמות מרוצפת' },
      { gx: 11, gy: 11, type: 'brick_path' },
      { gx: 13, gy: 11, type: 'brick_path' },
      { gx: 11, gy: 13, type: 'brick_path' },
      { gx: 13, gy: 13, type: 'brick_path' },
      { gx: 14, gy: 12, type: 'tea_table', customName: 'שולחן תכנון פיננסי ואסטרטגיה', customEmoji: '📊', dedicatedTo: 'יעדי הכנסה ותזרים' },
      { gx: 10, gy: 12, type: 'reading_bench', customName: 'עמדת קשרי לקוחות', customEmoji: '🤝', dedicatedTo: 'שותפויות ולקוחות מפתח' },
      { gx: 12, gy: 15, type: 'bonfire', customName: 'מגדלור יעדים והישגים', customEmoji: '💡', dedicatedTo: 'יעד-על שנתי' }
    ]
  },

  // 3. חיים אישיים (שלווה, רוגע, כפרי פסטורלי)
  {
    id: 'sanctuary',
    biome: 'hills',
    defaultName: 'חיים — נחלה כפרית שלווה',
    icon: '🏡',
    badge: 'שלווה ורוגע • פסטורלי',
    climateName: 'אקלים כפרי ונעים',
    climateTemp: '20°C • משב רוח צלול',
    tagline: 'גבעות ירוקות, פלג מים צלול, עצי אלון ושלווה כפרית',
    description: 'מרחב אישי רגוע, פסטורלי ואינטימי. פלג מים מפכפך, שבילי אדמה מתפתלים, עצי אלון מצלים וספסלי הפוגה.',
    memoryFocus: 'עוגן לשקט נפשי, בריאות, שנת לילה, הרגלי בוקר וזמן משפחה',
    scienceTip: 'צליל פלג מים, עצי אלון ונוף כפרי פתוח מפעילים את מערכת המנוחה הפאראסימפתטית ומעודדים שקט פנימי.',
    themeColor: '#10b981',
    accentBg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))',
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
      { gx: 12, gy: 12, type: 'greenhouse', customName: 'בקתת השלווה והבוטניקה', customEmoji: '🏡', dedicatedTo: 'מרכז הבית והשקט הנפשי' },
      { gx: 11, gy: 13, type: 'river_tile', dedicatedTo: 'פלג מים זך לשלווה וזרימה' },
      { gx: 12, gy: 13, type: 'river_tile', dedicatedTo: 'מי פלג צלולים' },
      { gx: 13, gy: 13, type: 'river_tile', dedicatedTo: 'רחש מים מרגיע' },
      { gx: 10, gy: 11, type: 'dirt_trail' },
      { gx: 11, gy: 11, type: 'dirt_trail' },
      { gx: 12, gy: 11, type: 'dirt_trail' },
      { gx: 10, gy: 12, type: 'oak_tree', dedicatedTo: 'אלון ירוק ומוצל להפוגה' },
      { gx: 14, gy: 11, type: 'reading_bench', customName: 'ספסל הבוקר והקפה', customEmoji: '☕', dedicatedTo: 'רגע שקט של בוקר לעצמי' },
      { gx: 9, gy: 13, type: 'flower_garden', dedicatedTo: 'גינת פרחי בר להרגעת המחשבות' },
      { gx: 13, gy: 10, type: 'tea_table', customName: 'פינת תה כפרית', customEmoji: '🫖', dedicatedTo: 'הפוגת אחר צהריים חמימה' }
    ]
  }
];

// Pure v4 storage keys ensuring strictly 3 villages
export const STORAGE_KEY_VILLAGES_REGISTRY = 'lifequest_catan_villages_v4';
export const STORAGE_KEY_ACTIVE_VILLAGE = 'lifequest_catan_active_v4';

// Helper to strictly maintain the 3 user-chosen villages
export function loadVillagesRegistry() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VILLAGES_REGISTRY);
    let registry = raw ? JSON.parse(raw) : null;

    if (!registry || typeof registry !== 'object') {
      registry = {};
    }

    // Strictly ensure only the 3 villages exist
    const allowedIds = ['military', 'business', 'sanctuary'];
    
    // Purge any foreign/old IDs
    Object.keys(registry).forEach(key => {
      if (!allowedIds.includes(key)) {
        delete registry[key];
      }
    });

    // Populate each of the 3 villages
    VILLAGE_PRESETS.forEach(preset => {
      if (!registry[preset.id]) {
        registry[preset.id] = {
          id: preset.id,
          name: preset.defaultName,
          biome: preset.biome,
          icon: preset.icon,
          badge: preset.badge,
          color: preset.themeColor,
          climateName: preset.climateName,
          climateTemp: preset.climateTemp,
          tagline: preset.tagline,
          description: preset.description,
          memoryFocus: preset.memoryFocus,
          scienceTip: preset.scienceTip,
          placedObjects: preset.starterObjects,
          expansionTier: 1,
          cultivatedPlots: [],
          lastVisited: new Date().toISOString()
        };
      }
    });

    localStorage.setItem(STORAGE_KEY_VILLAGES_REGISTRY, JSON.stringify(registry));
    return registry;
  } catch (err) {
    console.error('Failed to load villages registry:', err);
    const fallback = {};
    VILLAGE_PRESETS.forEach(p => {
      fallback[p.id] = {
        id: p.id,
        name: p.defaultName,
        biome: p.biome,
        icon: p.icon,
        badge: p.badge,
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
