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
        grass1: '#6a9434',
        grass2: '#628c30',
        grass3: '#58802b',
        grassHi: '#8fb344',
        flower: '#67e8f9'
      },
      sunset: {
        grass1: '#7a9230',
        grass2: '#718a2c',
        grass3: '#667d27',
        grassHi: '#DE7A22',
        flower: '#fde047'
      },
      night: {
        grass1: '#27401f',
        grass2: '#223819',
        grass3: '#1d2f16',
        grassHi: '#35542a',
        flower: '#a78bfa'
      }
    },
    horizonType: 'dense_forest_mist',
    particleType: 'firefly_spores',
    starterObjects: [
      // 1. מבנים ראשיים ומסלול הזיכרון (5 מבנים שונים)
      // מבנה 1 (ראשי): מפקדת הפיקוד והתדריכים בלב המבצר הפנימי
      { gx: 12, gy: 9, type: 'wooden_cabin', customName: 'מפקדת הפיקוד והתדריכים', customEmoji: '🪖', dedicatedTo: '1. מוקד פקודות היום, תכנון מבצעי ועוגן ראשי' },
      
      // מבנה 2: ספריית המודיעין והמפות (באגף המערבי)
      { gx: 8, gy: 12, type: 'library', customName: 'ספריית המודיעין והתחקירים', customEmoji: '📚', dedicatedTo: '2. ספריית מודיעין, מפות שטח ותובנות קרב' },

      // מבנה 3: מאפיית השדה ומטבח הפלוגה (באגף הדרום-מערבי)
      { gx: 9, gy: 16, type: 'bakery', customName: 'מאפיית השדה ומטבח הפלוגה', customEmoji: '🥖', dedicatedTo: '3. הזנה, אנרגיה יומית ומטבח הפלוגה' },

      // מבנה 4: היכל הכושר והאימון המבצעי (באגף הדרום-מזרחי)
      { gx: 15, gy: 16, type: 'gym', customName: 'היכל הכושר והכשירות המבצעית', customEmoji: '🏋️', dedicatedTo: '4. משמעת גופנית, אימוני כוח וחוסן לוחמים' },

      // מבנה 5: חממת הרפואה וצמחי המרפא (באגף המזרחי מול הנהר)
      { gx: 16, gy: 12, type: 'greenhouse', customName: 'חממת הרפואה וצמחי המרפא', customEmoji: '🪴', dedicatedTo: '5. התאוששות, בריאות, רפואה ורוגע מנטלי' },

      // חוות התבואה ואסם המשק (באגף המערבי ליד השביל)
      { gx: 8, gy: 14, type: 'farm', customName: 'חוות התבואה ואסם המשק', customEmoji: '🌾', dedicatedTo: 'חוות משק כפרית, בעלי חיים וניהול פרויקטים' },

      // 2. השביל הרציף (מתחיל במפקדה הראשית, ועובר פעם אחת בדיוק בכל מבנה אחר)
      // יציאה ממבנה 1 ומעבר דרך שער החומה הפנימית:
      { gx: 11, gy: 10, type: 'cobblestone_road' },
      { gx: 12, gy: 10, type: 'cobblestone_road', dedicatedTo: 'נתיב מסדר הבוקר — יציאה מהמפקדה' },
      { gx: 13, gy: 10, type: 'cobblestone_road' },
      { gx: 12, gy: 11, type: 'cobblestone_road', dedicatedTo: 'שער המבצר הפנימי — מעבר מבוקר יחיד' },
      { gx: 12, gy: 12, type: 'cobblestone_road' },
      // פנייה מערבה אל מבנה 2 (ספריית המודיעין):
      { gx: 11, gy: 12, type: 'cobblestone_road' },
      { gx: 10, gy: 12, type: 'cobblestone_road' },
      { gx: 9, gy: 12, type: 'cobblestone_road', dedicatedTo: 'גישה לספריית המודיעין' },
      // המשך דרומה אל מבנה 3 (מאפיית השדה):
      { gx: 9, gy: 13, type: 'cobblestone_road' },
      { gx: 9, gy: 14, type: 'cobblestone_road' },
      { gx: 9, gy: 15, type: 'cobblestone_road', dedicatedTo: 'שביל חדר האוכל ומטבח השדה' },
      // חצייה מזרחה אל מבנה 4 (היכל הכושר):
      { gx: 10, gy: 15, type: 'cobblestone_road' },
      { gx: 11, gy: 15, type: 'cobblestone_road' },
      { gx: 12, gy: 15, type: 'cobblestone_road', dedicatedTo: 'רחבת ציר המבצר' },
      { gx: 13, gy: 15, type: 'cobblestone_road' },
      { gx: 14, gy: 15, type: 'cobblestone_road' },
      { gx: 15, gy: 15, type: 'cobblestone_road', dedicatedTo: 'מבואת מתחם הכושר והאימונים' },
      // פנייה מזרחה וחציית הנהר אל מבנה 5 (חממת הרפואה):
      { gx: 16, gy: 15, type: 'cobblestone_road' },
      { gx: 16, gy: 14, type: 'wooden_bridge', dedicatedTo: 'גשר פלג המים המזרחי' },
      { gx: 16, gy: 13, type: 'cobblestone_road', dedicatedTo: 'נתיב המרפאה וצמחי המרפא' },

      // שביל גישה לשער החיצוני הראשי בדרום (מעבר יחיד החוצה)
      { gx: 12, gy: 16, type: 'cobblestone_road' },
      { gx: 12, gy: 17, type: 'cobblestone_road' },
      { gx: 12, gy: 18, type: 'cobblestone_road', dedicatedTo: 'שער המבצר החיצוני — שער כניסה ויציאה יחיד' },

      // 3. שכבת חומה פנימית (Inner Wall - הגנה הרמטית על מפקדת הפיקוד עם מעבר אחד ב-(12,11))
      { gx: 10, gy: 7, type: 'stone_wall' },
      { gx: 11, gy: 7, type: 'stone_wall' },
      { gx: 12, gy: 7, type: 'stone_wall' },
      { gx: 13, gy: 7, type: 'stone_wall' },
      { gx: 14, gy: 7, type: 'stone_wall' },
      { gx: 10, gy: 8, type: 'stone_wall' },
      { gx: 10, gy: 9, type: 'stone_wall' },
      { gx: 10, gy: 10, type: 'stone_wall' },
      { gx: 10, gy: 11, type: 'stone_wall' },
      { gx: 14, gy: 8, type: 'stone_wall' },
      { gx: 14, gy: 9, type: 'stone_wall' },
      { gx: 14, gy: 10, type: 'stone_wall' },
      { gx: 14, gy: 11, type: 'stone_wall' },
      { gx: 11, gy: 11, type: 'stone_wall' },
      // (12, 11) הוא השער הפנימי המבוקר היחיד - דרכו עובר השביל
      { gx: 13, gy: 11, type: 'stone_wall' },

      // 4. שכבת חומה חיצונית (Outer Wall - חומת מגן מקיפה סביב כל המחנה, שער יחיד ב-(12,18))
      // חומה צפונית
      { gx: 7, gy: 6, type: 'stone_wall' },
      { gx: 8, gy: 6, type: 'stone_wall' },
      { gx: 9, gy: 6, type: 'stone_wall' },
      { gx: 10, gy: 6, type: 'stone_wall' },
      { gx: 11, gy: 6, type: 'stone_wall' },
      { gx: 12, gy: 6, type: 'stone_wall' },
      { gx: 13, gy: 6, type: 'stone_wall' },
      { gx: 14, gy: 6, type: 'stone_wall' },
      { gx: 15, gy: 6, type: 'stone_wall' },
      { gx: 16, gy: 6, type: 'stone_wall' },
      { gx: 17, gy: 6, type: 'stone_wall' },
      { gx: 18, gy: 6, type: 'stone_wall' },
      // חומה מערבית
      { gx: 7, gy: 7, type: 'stone_wall' },
      { gx: 7, gy: 8, type: 'stone_wall' },
      { gx: 7, gy: 9, type: 'stone_wall' },
      { gx: 7, gy: 10, type: 'stone_wall' },
      { gx: 7, gy: 11, type: 'stone_wall' },
      { gx: 7, gy: 12, type: 'stone_wall' },
      { gx: 7, gy: 13, type: 'stone_wall' },
      { gx: 7, gy: 14, type: 'stone_wall' },
      { gx: 7, gy: 15, type: 'stone_wall' },
      { gx: 7, gy: 16, type: 'stone_wall' },
      { gx: 7, gy: 17, type: 'stone_wall' },
      // חומה מזרחית
      { gx: 18, gy: 7, type: 'stone_wall' },
      { gx: 18, gy: 8, type: 'stone_wall' },
      { gx: 18, gy: 9, type: 'stone_wall' },
      { gx: 18, gy: 10, type: 'stone_wall' },
      { gx: 18, gy: 11, type: 'stone_wall' },
      { gx: 18, gy: 12, type: 'stone_wall' },
      { gx: 18, gy: 13, type: 'stone_wall' },
      { gx: 18, gy: 14, type: 'stone_wall' },
      { gx: 18, gy: 15, type: 'stone_wall' },
      { gx: 18, gy: 16, type: 'stone_wall' },
      { gx: 18, gy: 17, type: 'stone_wall' },
      // חומה דרומית (שער יחיד ב-(12,18))
      { gx: 7, gy: 18, type: 'stone_wall' },
      { gx: 8, gy: 18, type: 'stone_wall' },
      { gx: 9, gy: 18, type: 'stone_wall' },
      { gx: 10, gy: 18, type: 'stone_wall' },
      { gx: 11, gy: 18, type: 'stone_wall' },
      // (12, 18) שער חיצוני יחיד
      { gx: 13, gy: 18, type: 'stone_wall' },
      { gx: 14, gy: 18, type: 'stone_wall' },
      { gx: 15, gy: 18, type: 'stone_wall' },
      { gx: 16, gy: 18, type: 'stone_wall' },
      { gx: 17, gy: 18, type: 'stone_wall' },
      { gx: 18, gy: 18, type: 'stone_wall' },

      // 5. נהרות ופלגי מים (קצת נהרות פה ושם + בריכה)
      { gx: 17, gy: 13, type: 'river_tile', dedicatedTo: 'פלג מים מטהר שזורם באגף המזרחי' },
      { gx: 17, gy: 14, type: 'river_tile', dedicatedTo: 'מי פלג חיים תחת גשר העץ' },
      { gx: 17, gy: 15, type: 'river_tile' },
      { gx: 17, gy: 16, type: 'river_tile' },
      { gx: 17, gy: 12, type: 'water_lily_pond', dedicatedTo: 'בריכת נימפיאות שלווה לרפואה ושקט' },

      // 6. גינות ירק, פרחי כבוד ועוגני אווירה
      { gx: 16, gy: 11, type: 'veggie_garden', dedicatedTo: 'ערוגות תבלין וצמחי מרפא ליד המרפאה' },
      { gx: 15, gy: 11, type: 'veggie_garden', dedicatedTo: 'ערוגות ירק וחיזוק חיסוני' },
      { gx: 9, gy: 8, type: 'flower_garden', dedicatedTo: 'גן פרחי הניצחון והדגלים' },
      { gx: 15, gy: 8, type: 'flower_garden', dedicatedTo: 'גן כבוד וזיכרון מזרחי' },

      // 7. עוגני פיקוד, אלונים ושיחים
      { gx: 11, gy: 9, type: 'reading_bench' },
      { gx: 13, gy: 9, type: 'bonfire' },
      { gx: 8, gy: 11, type: 'reading_bench' },
      { gx: 8, gy: 8, type: 'oak_tree' },
      { gx: 16, gy: 8, type: 'oak_tree' },
      { gx: 8, gy: 17, type: 'bush' },
      { gx: 17, gy: 17, type: 'bush' }
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
        grass1: '#8aac45',
        grass2: '#82a441',
        grass3: '#779a3b',
        grassHi: '#b4cc62',
        flower: '#facc15'
      },
      sunset: {
        grass1: '#9aa443',
        grass2: '#919b3d',
        grass3: '#859035',
        grassHi: '#E29548',
        flower: '#fbbf24'
      },
      night: {
        grass1: '#2f3f27',
        grass2: '#293722',
        grass3: '#232f1d',
        grassHi: '#3e5231',
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
        grass1: '#7aa63a',
        grass2: '#729e36',
        grass3: '#669030',
        grassHi: '#a4c752',
        flower: '#f472b6'
      },
      sunset: {
        grass1: '#88a336',
        grass2: '#7f9a31',
        grass3: '#738c2b',
        grassHi: '#E29548',
        flower: '#fef08a'
      },
      night: {
        grass1: '#2a4421',
        grass2: '#243b1c',
        grass3: '#1f3217',
        grassHi: '#385a2b',
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

// Pure v5 storage keys ensuring strictly 3 villages
export const STORAGE_KEY_VILLAGES_REGISTRY = 'lifequest_catan_villages_v5';
export const STORAGE_KEY_ACTIVE_VILLAGE = 'lifequest_catan_active_v5';

// Cognitive Progression Stations along the Mental Walk
export const VILLAGE_STATIONS = {
  military: [
    { stage: 1, type: 'wooden_cabin', name: 'מפקדת הפיקוד והתדריכים', emoji: '🪖', defaultMemory: '1. מוקד פקודות היום, תכנון מבצעי ועוגן ראשי', gx: 12, gy: 9 },
    { stage: 2, type: 'library', name: 'ספריית המודיעין והתחקירים', emoji: '📚', defaultMemory: '2. ספריית מודיעין, מפות שטח ותובנות קרב', gx: 8, gy: 12 },
    { stage: 3, type: 'bakery', name: 'מאפיית השדה ומטבח הפלוגה', emoji: '🥖', defaultMemory: '3. הזנה, אנרגיה יומית ומטבח הפלוגה', gx: 9, gy: 16 },
    { stage: 4, type: 'gym', name: 'היכל הכושר והכשירות המבצעית', emoji: '🏋️', defaultMemory: '4. משמעת גופנית, אימוני כוח וחוסן לוחמים', gx: 15, gy: 16 },
    { stage: 5, type: 'greenhouse', name: 'חממת הרפואה וצמחי המרפא', emoji: '🪴', defaultMemory: '5. התאוששות, בריאות, רפואה ורוגע מנטלי', gx: 16, gy: 12 }
  ],
  business: [
    { stage: 1, type: 'wooden_cabin', name: 'משרד ההנהלה והיזמות', emoji: '🏛️', defaultMemory: '1. חזון העסק, החלטות אסטרטגיות ועוגן ראשי', gx: 12, gy: 9 },
    { stage: 2, type: 'library', name: 'ארכיון הפיננסים והחוזים', emoji: '📊', defaultMemory: '2. דוחות כספיים, הסכמים ומדדי צמיחה', gx: 8, gy: 12 },
    { stage: 3, type: 'bakery', name: 'טרקלין הפגישות והסגירות', emoji: '☕', defaultMemory: '3. פגישות נטוורקינג, לקוחות וקשרים', gx: 9, gy: 16 },
    { stage: 4, type: 'gym', name: 'סדנת החדשנות והמוצרים', emoji: '💡', defaultMemory: '4. פיתוח מוצרים, בדיקות שוק ויוזמות חדשות', gx: 15, gy: 16 },
    { stage: 5, type: 'greenhouse', name: 'גינת השקט והאיזון', emoji: '🌿', defaultMemory: '5. איזון בין עבודה לחיים ושקט פנימי', gx: 16, gy: 12 }
  ],
  sanctuary: [
    { stage: 1, type: 'wooden_cabin', name: 'בקתת השלווה והמשכן האישי', emoji: '🏡', defaultMemory: '1. משכן אישי, עוגני שגרה ושקט פנימי', gx: 12, gy: 9 },
    { stage: 2, type: 'library', name: 'חדר המחשבות וההשראה', emoji: '📖', defaultMemory: '2. תובנות, קריאה והתפתחות אישית', gx: 8, gy: 12 },
    { stage: 3, type: 'bakery', name: 'מטבח הניחוחות והטעמים', emoji: '🍲', defaultMemory: '3. תזונה מודעת, רגעי חמימות ושיתוף', gx: 9, gy: 16 },
    { stage: 4, type: 'gym', name: 'מרחב התנועה והגוף', emoji: '🧘', defaultMemory: '4. נשימה, יוגה, שחרור מתחים ותנועה', gx: 15, gy: 16 },
    { stage: 5, type: 'greenhouse', name: 'חממת הנשמה והפרחים', emoji: '🌸', defaultMemory: '5. טיפוח עדין, הכרת תודה ורוגע עמוק', gx: 16, gy: 12 }
  ]
};

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
          progressionStage: 1,
          interiorUnlocked: false,
          cultivatedPlots: [],
          lastVisited: new Date().toISOString()
        };
      } else {
        // Guarantee progression fields exist
        if (typeof registry[preset.id].progressionStage !== 'number') {
          registry[preset.id].progressionStage = 1;
        }
        if (typeof registry[preset.id].interiorUnlocked !== 'boolean') {
          registry[preset.id].interiorUnlocked = false;
        }
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
        progressionStage: 1,
        interiorUnlocked: false,
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
