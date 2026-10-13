// Configuration & Tiers for Village Territory Expansion and Land Cultivation

export const EXPANSION_TIERS = [
  {
    tier: 1,
    name: 'קרחת יער שלווה',
    englishName: 'Intimate Glade',
    levelTitle: 'דרגת נחלה 1',
    tag: 'מרחב ראשוני ואינטימי',
    desc: 'השטח הבסיסי והשלו של הכפר. פינה פסטורלית בלב היער, מושלמת לרגעים אישיים ושקט פנימי.',
    radius: 8.5,
    costSeeds: 0,
    badge: '🌱',
    color: '#10b981'
  },
  {
    tier: 2,
    name: 'נחלה כפרית מורחבת',
    englishName: 'Expanded Homestead',
    levelTitle: 'דרגת נחלה 2',
    tag: 'הרחבת שטח מורגשת',
    desc: 'פינוי עצי הספר והרחבת השמורה. פותח עשרות חלקות חדשות לשתילת עצים, ערוגות פרחים ומזרקות מים.',
    radius: 10.2,
    costSeeds: 40,
    badge: '🌾',
    color: '#eab308'
  },
  {
    tier: 3,
    name: 'כפר משגשג ומוריק',
    englishName: 'Thriving Meadow Village',
    levelTitle: 'דרגת נחלה 3',
    tag: 'מרחב רחב ידיים',
    desc: 'הרחבה מקיפה של היער הירוק. מרחב שופע ועשיר לנחלים זורמים, בקתות יצירה, פינות תה וחממות.',
    radius: 11.8,
    costSeeds: 75,
    badge: '🏡',
    color: '#8b5cf6'
  },
  {
    tier: 4,
    name: 'עמק השלווה המלכותי',
    englishName: 'Grand Sanctuary Valley',
    levelTitle: 'דרגת נחלה 4',
    tag: 'השמורה במלוא תפארתה',
    desc: 'השטח הגדול ביותר בעמק. נוף פתוח ועצום עם שבילי טבע, בריכות נימפאה ומרחב אינסופי לנשימה ורוגע.',
    radius: 13.5,
    costSeeds: 110,
    badge: '✨',
    color: '#ec4899'
  }
];

export const PLOT_CULTIVATION_COST = 10; // Seeds required to cultivate a single wild plot

export const CULTIVATION_QUOTES = [
  'איזה יופי! אדמה פראית זו הוכשרה באהבה והפכה לקרקע פורחת 🌱',
  'הכפר שלנו ממשיך לצמוח ולהתרחב, בדיוק בקצב הנכון ✨',
  'פינה חדשה נוצרה בכפר! כעת אפשר להציב כאן עץ, ספסל או פלג מים 🌸',
  'כל חלקה מעובדת היא עדות לרגע שבו בחרת להשקיע בעצמך ובמרחב שלך 💛',
  'האוויר כאן בין השטחים החדשים פשוט מחיה את הנפש 🍃'
];
