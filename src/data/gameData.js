// Buildings configuration & categories
export const CATEGORIES = {
  HEALTH: {
    id: 'HEALTH',
    name: 'בריאות וכושר',
    color: '#ef4444',
    lightColor: '#fee2e2',
    accentColor: '#b91c1c',
    icon: 'Activity',
    buildingId: 'barracks',
    description: 'אימונים, שינה, תזונה ומים'
  },
  MIND: {
    id: 'MIND',
    name: 'למידה והתפתחות',
    color: '#3b82f6',
    lightColor: '#dbeafe',
    accentColor: '#1d4ed8',
    icon: 'BookOpen',
    buildingId: 'wizardTower',
    description: 'קריאה, קורסים, פיתוח מיומנויות'
  },
  WEALTH: {
    id: 'WEALTH',
    name: 'קריירה וכספים',
    color: '#eab308',
    lightColor: '#fef9c3',
    accentColor: '#a16207',
    icon: 'Coins',
    buildingId: 'goldMine',
    description: 'עבודה, חסכונות, השקעות ותקציב'
  },
  CREATIVE: {
    id: 'CREATIVE',
    name: 'פרויקטים ויצירה',
    color: '#a855f7',
    lightColor: '#f3e8ff',
    accentColor: '#7e22ce',
    icon: 'Hammer',
    buildingId: 'forge',
    description: 'קוד, כתיבה, אמנות ופרויקטים אישיים'
  },
  GENERAL: {
    id: 'GENERAL',
    name: 'מרכז החיים (כללי)',
    color: '#10b981',
    lightColor: '#d1fae5',
    accentColor: '#047857',
    icon: 'Shield',
    buildingId: 'townHall',
    description: 'סדר יום, מטרות על והרגלים מרכזיים'
  }
};

export const BUILDINGS_META = {
  townHall: {
    id: 'townHall',
    name: 'בית העירייה (Town Hall)',
    category: 'GENERAL',
    description: 'לב הכפר שלך. רמתו קובעת את התפתחות כלל הממלכה והרמה הכוללת של חייך.',
    gridPos: { x: 2, y: 2 },
    size: { w: 2, h: 2 },
    maxLevel: 10,
    baseCost: { gold: 100, xp: 50 },
    costMultiplier: 1.6,
    icon: 'Castle'
  },
  barracks: {
    id: 'barracks',
    name: 'מבצר הלוחמים (כושר ובריאות)',
    category: 'HEALTH',
    description: 'מחזק את הגוף, המשמעת והאנרגיה היומית שלך.',
    gridPos: { x: 0, y: 1 },
    size: { w: 1, h: 1 },
    maxLevel: 10,
    baseCost: { gold: 50, xp: 30 },
    costMultiplier: 1.5,
    icon: 'Dumbbell'
  },
  wizardTower: {
    id: 'wizardTower',
    name: 'מגדל החכמה (למידה והתפתחות)',
    category: 'MIND',
    description: 'מקור הידע, הקריאה וההבנה העמוקה של העולם.',
    gridPos: { x: 4, y: 1 },
    size: { w: 1, h: 1 },
    maxLevel: 10,
    baseCost: { gold: 50, xp: 30 },
    costMultiplier: 1.5,
    icon: 'GraduationCap'
  },
  goldMine: {
    id: 'goldMine',
    name: 'מכרה האוצר (קריירה וכספים)',
    category: 'WEALTH',
    description: 'מייצר שפע כלכלי, קידום בעבודה ויציבות פיננסית.',
    gridPos: { x: 1, y: 4 },
    size: { w: 1, h: 1 },
    maxLevel: 10,
    baseCost: { gold: 60, xp: 35 },
    costMultiplier: 1.5,
    icon: 'Coins'
  },
  forge: {
    id: 'forge',
    name: 'סדנת הנפח (פרויקטים ויצירה)',
    category: 'CREATIVE',
    description: 'מקום היצירה, בניית פרויקטים ומימוש רעיונות שאפתניים.',
    gridPos: { x: 4, y: 4 },
    size: { w: 1, h: 1 },
    maxLevel: 10,
    baseCost: { gold: 50, xp: 30 },
    costMultiplier: 1.5,
    icon: 'Flame'
  }
};

export const INITIAL_QUESTS = [
  {
    id: 'q1',
    title: 'שתיית 2 ליטר מים ואימון קצר',
    category: 'HEALTH',
    xpReward: 35,
    goldReward: 25,
    completed: false,
    frequency: 'daily',
    streak: 3
  },
  {
    id: 'q2',
    title: 'קריאת פרק בספר מקצועי / התפתחות',
    category: 'MIND',
    xpReward: 40,
    goldReward: 30,
    completed: false,
    frequency: 'daily',
    streak: 5
  },
  {
    id: 'q3',
    title: 'מעקב הוצאות שבועי וחיסכון',
    category: 'WEALTH',
    xpReward: 50,
    goldReward: 40,
    completed: false,
    frequency: 'weekly',
    streak: 1
  },
  {
    id: 'q4',
    title: 'התקדמות בפרויקט אישי (קוד / יצירה)',
    category: 'CREATIVE',
    xpReward: 45,
    goldReward: 35,
    completed: false,
    frequency: 'daily',
    streak: 2
  },
  {
    id: 'q5',
    title: 'תכנון מטרות שבועיות ולו״ז',
    category: 'GENERAL',
    xpReward: 60,
    goldReward: 50,
    completed: false,
    frequency: 'weekly',
    streak: 4
  }
];

export const INITIAL_VILLAGE = {
  resources: {
    gold: 150,
    gems: 25,
    xp: 60,
    level: 1
  },
  buildings: {
    townHall: { level: 1 },
    barracks: { level: 1 },
    wizardTower: { level: 1 },
    goldMine: { level: 1 },
    forge: { level: 1 }
  }
};
