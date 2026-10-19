// Loci Practice Data for House "עבודה" (Work)
// 5 Stations planted across the 5 rooms of the house for cumulative active recall practice

const makeSvgDataUrl = (svgContent) => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

export const SUNGLASSES_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="bg1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="lens" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="50%" stop-color="#312e81"/>
      <stop offset="100%" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" rx="16" fill="url(#bg1)"/>
  <circle cx="160" cy="100" r="90" fill="#fbbf24" opacity="0.08"/>
  <path d="M50,85 Q95,73 140,83 Q160,77 180,83 Q225,73 270,85" fill="none" stroke="url(#gold)" stroke-width="7" stroke-linecap="round"/>
  <rect x="52" y="85" width="90" height="70" rx="24" fill="url(#lens)" stroke="url(#gold)" stroke-width="5"/>
  <path d="M64,93 Q100,100 130,125" stroke="#a5b4fc" stroke-width="3.5" fill="none" opacity="0.7" stroke-linecap="round"/>
  <rect x="178" y="85" width="90" height="70" rx="24" fill="url(#lens)" stroke="url(#gold)" stroke-width="5"/>
  <path d="M190,93 Q226,100 256,125" stroke="#a5b4fc" stroke-width="3.5" fill="none" opacity="0.7" stroke-linecap="round"/>
  <path d="M50,87 Q35,80 24,97" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round"/>
  <path d="M270,87 Q285,80 296,97" fill="none" stroke="url(#gold)" stroke-width="5" stroke-linecap="round"/>
  <rect x="75" y="172" width="170" height="32" rx="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="160" y="193" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#78350f" text-anchor="middle">1. משקפי שמש 🕶️</text>
</svg>`;

export const PHONE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="bg2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="phoneBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0369a1"/>
      <stop offset="100%" stop-color="#075985"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" rx="16" fill="url(#bg2)"/>
  <circle cx="160" cy="95" r="90" fill="#38bdf8" opacity="0.08"/>
  <rect x="115" y="22" width="90" height="142" rx="16" fill="url(#phoneBody)" stroke="#94a3b8" stroke-width="3"/>
  <rect x="122" y="32" width="76" height="122" rx="10" fill="url(#screen)"/>
  <rect x="145" y="26" width="30" height="4" rx="2" fill="#0f172a"/>
  <rect x="130" y="45" width="16" height="16" rx="4" fill="#38bdf8"/>
  <rect x="152" y="45" width="16" height="16" rx="4" fill="#4ade80"/>
  <rect x="174" y="45" width="16" height="16" rx="4" fill="#facc15"/>
  <rect x="130" y="68" width="16" height="16" rx="4" fill="#f43f5e"/>
  <rect x="152" y="68" width="16" height="16" rx="4" fill="#a855f7"/>
  <rect x="174" y="68" width="16" height="16" rx="4" fill="#fb923c"/>
  <circle cx="160" cy="120" r="14" fill="#22c55e" opacity="0.95"/>
  <path d="M154,120 Q160,114 166,120" stroke="#ffffff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <rect x="90" y="172" width="140" height="32" rx="16" fill="#e0f2fe" stroke="#0284c7" stroke-width="2"/>
  <text x="160" y="193" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#0369a1" text-anchor="middle">2. טלפון נייד 📱</text>
</svg>`;

export const SHIRT_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="bg3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="shirtGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="hanger" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#d97706"/>
      <stop offset="100%" stop-color="#92400e"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" rx="16" fill="url(#bg3)"/>
  <circle cx="160" cy="95" r="90" fill="#38bdf8" opacity="0.08"/>
  <path d="M160,30 Q160,20 170,20 Q178,20 174,33 L160,40" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
  <path d="M105,60 L160,40 L215,60 Z" fill="url(#hanger)"/>
  <path d="M125,53 L90,80 L112,105 L126,93 L126,155 L194,155 L194,93 L208,105 L230,80 L195,53 Q160,65 125,53 Z" fill="url(#shirtGrad)" stroke="#bae6fd" stroke-width="2"/>
  <path d="M142,56 L160,77 L178,56" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="168" y="90" width="18" height="20" rx="3" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5"/>
  <circle cx="85" cy="45" r="3" fill="#fde047"/>
  <circle cx="235" cy="50" r="3.5" fill="#fde047"/>
  <rect x="75" y="172" width="170" height="32" rx="16" fill="#fef3c7" stroke="#f59e0b" stroke-width="2"/>
  <text x="160" y="193" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#92400e" text-anchor="middle">3. חולצה להחלפה 👕</text>
</svg>`;

export const WATER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="bottleBody" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#22d3ee"/>
      <stop offset="100%" stop-color="#0891b2"/>
    </linearGradient>
    <linearGradient id="cap" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#475569"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" rx="16" fill="url(#bg4)"/>
  <circle cx="160" cy="95" r="90" fill="#22d3ee" opacity="0.08"/>
  <rect x="148" y="20" width="24" height="14" rx="4" fill="url(#cap)" stroke="#94a3b8" stroke-width="2"/>
  <rect x="144" y="34" width="32" height="6" rx="2" fill="#0e7490"/>
  <path d="M148,40 L142,60 Q130,75 130,100 L130,145 Q130,160 145,160 L175,160 Q190,160 190,145 L190,100 Q190,75 178,60 L172,40 Z" fill="url(#bottleBody)" stroke="#a5f3fc" stroke-width="2.5"/>
  <path d="M132,95 Q145,90 160,95 Q175,100 188,95 L188,147 Q188,158 175,158 L145,158 Q132,158 132,147 Z" fill="#0891b2" opacity="0.55"/>
  <path d="M138,75 L138,140" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" opacity="0.6"/>
  <circle cx="118" cy="80" r="3.5" fill="#67e8f9" opacity="0.8"/>
  <circle cx="204" cy="110" r="4.5" fill="#67e8f9" opacity="0.8"/>
  <rect x="85" y="172" width="150" height="32" rx="16" fill="#cffafe" stroke="#0891b2" stroke-width="2"/>
  <text x="160" y="193" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#155e75" text-anchor="middle">4. בקבוק מים 💧</text>
</svg>`;

export const CAR_KEYS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220" width="320" height="220">
  <defs>
    <linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="fob" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e2e8f0"/>
      <stop offset="50%" stop-color="#94a3b8"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
  </defs>
  <rect width="320" height="220" rx="16" fill="url(#bg5)"/>
  <circle cx="160" cy="95" r="90" fill="#f59e0b" opacity="0.08"/>
  <circle cx="160" cy="45" r="22" fill="none" stroke="url(#metal)" stroke-width="5"/>
  <circle cx="160" cy="45" r="18" fill="none" stroke="#475569" stroke-width="1.5"/>
  <path d="M142,60 L120,130 L126,133 L122,143 L129,145 L125,155 L134,157 L150,105 L146,65" fill="url(#metal)" stroke="#334155" stroke-width="1.5"/>
  <rect x="160" y="60" width="48" height="92" rx="16" fill="url(#fob)" stroke="#94a3b8" stroke-width="2.5"/>
  <circle cx="184" cy="80" r="7" fill="#dc2626"/>
  <circle cx="184" cy="102" r="7" fill="#16a34a"/>
  <rect x="177" y="120" width="14" height="9" rx="2" fill="#ca8a04"/>
  <path d="M180,80 L188,80" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <polygon points="105,95 110,105 120,110 110,115 105,125 100,115 90,110 100,105" fill="#fbbf24"/>
  <rect x="75" y="172" width="170" height="32" rx="16" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>
  <text x="160" y="193" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="bold" fill="#78350f" text-anchor="middle">5. מפתחות לאוטו 🔑</text>
</svg>`;

export const SUNGLASSES_DATA_URL = makeSvgDataUrl(SUNGLASSES_SVG);
export const PHONE_DATA_URL = makeSvgDataUrl(PHONE_SVG);
export const SHIRT_DATA_URL = makeSvgDataUrl(SHIRT_SVG);
export const WATER_DATA_URL = makeSvgDataUrl(WATER_SVG);
export const CAR_KEYS_DATA_URL = makeSvgDataUrl(CAR_KEYS_SVG);

export const LOCI_WORK_PRACTICE_ITEMS = [
  {
    id: 'loci-work-1',
    order: 1,
    roomId: 'entry_foyer',
    roomName: 'חדר הכניסה (מבואה נייטרלית)',
    roomShortName: 'כניסה',
    title: 'משקפי שמש',
    emoji: '🕶️',
    associationWord: 'משקפיים',
    story: 'משקפי שמש מוזהבים ונוצצים מונחים על המעמד בכניסה — כדי להגן על העיניים ברגע שיוצאים מהבית!',
    memoryAnchor: 'עוגן 1: משקפי שמש בכניסה',
    hint: 'בכניסה לבית, מה שמנו על המעמד כדי שלא נסתנוור מהשמש כשנצא?',
    imageUrl: SUNGLASSES_DATA_URL
  },
  {
    id: 'loci-work-2',
    order: 2,
    roomId: 'main_hall',
    roomName: 'האולם המרכזי (בטיפול)',
    roomShortName: 'אולם מרכזי',
    title: 'טלפון',
    emoji: '📱',
    associationWord: 'טלפון',
    story: 'טלפון נייד חכם זוהר במרכז השולחן באולם — תמיד מחובר לשיחות, הודעות ומשימות היום!',
    memoryAnchor: 'עוגן 2: טלפון נייד באולם',
    hint: 'על השולחן במרכז האולם, איזה מכשיר זוהר ורוטט כדי לתקשר עם כולם?',
    imageUrl: PHONE_DATA_URL
  },
  {
    id: 'loci-work-3',
    order: 3,
    roomId: 'left_store',
    roomName: 'אגף שמאל (דחוף)',
    roomShortName: 'אגף שמאל',
    title: 'חולצה להחלפה',
    emoji: '👕',
    associationWord: 'חולצה',
    story: 'חולצה נקייה להחלפה תלויה על קולב העץ באגף שמאל — להתרעננות מושלמת אחרי יום עבודה!',
    memoryAnchor: 'עוגן 3: חולצה להחלפה באגף שמאל',
    hint: 'באגף שמאל, מה תלוי על הקולב מוכן כדי להתרענן ולהחליף בגדים?',
    imageUrl: SHIRT_DATA_URL
  },
  {
    id: 'loci-work-4',
    order: 4,
    roomId: 'right_sanctuary',
    roomName: 'היכל השלווה (שגרה צפון)',
    roomShortName: 'היכל שלווה',
    title: 'בקבוק מים',
    emoji: '💧',
    associationWord: 'מים',
    story: 'בקבוק מים צלולים וקרים עומד על מדף השלווה — שותים לגימה מרעננת ומרווים את הגוף!',
    memoryAnchor: 'עוגן 4: בקבוק מים בהיכל השלווה',
    hint: 'בהיכל השלווה, מה עומד קריר וצלול כדי להרוות את הצמא?',
    imageUrl: WATER_DATA_URL
  },
  {
    id: 'loci-work-5',
    order: 5,
    roomId: 'right_south',
    roomName: 'היכל השלווה הדרומי (ארכיון)',
    roomShortName: 'חדר דרומי',
    title: 'מפתחות לאוטו',
    emoji: '🔑',
    associationWord: 'מפתחות',
    story: 'צרור מפתחות לרכב עם שלט חכם תלויים על וו מוזהב בחדר הדרומי — המפתחות שפותחים את האוטו לנסיעה חזרה הביתה!',
    memoryAnchor: 'עוגן 5: מפתחות לאוטו בחדר הדרומי',
    hint: 'בחדר הדרומי, מה תלוי על הוו ופותח את האוטו כשחוזרים הביתה?',
    imageUrl: CAR_KEYS_DATA_URL
  }
];

export const LOCI_DOOR_STAGES = {
  door_c3: {
    doorId: 'door_c3',
    doorName: 'דלת האולם המרכזי',
    targetRoom: 'main_hall',
    stageNumber: 1,
    title: 'מנעול חדר הכניסה 🔒',
    targetRoomName: 'האולם המרכזי',
    requiredItemOrders: [1],
    unlockedMessage: 'נפלא! זכרת את משקפי השמש בכניסה! דלת האולם המרכזי נפתחה והחדר הואר במלואו 💡'
  },
  door_c1: {
    doorId: 'door_c1',
    doorName: 'דלת אגף שמאל (דחוף)',
    targetRoom: 'left_store',
    stageNumber: 2,
    title: 'מנעול האולם המרכזי 🔒',
    targetRoomName: 'אגף שמאל',
    requiredItemOrders: [1, 2],
    unlockedMessage: 'מצוין! זכרת את משקפי השמש (1) ואת הטלפון (2)! אגף שמאל נפתח והואר 💡'
  },
  door_c2: {
    doorId: 'door_c2',
    doorName: 'דלת היכל השלווה (צפון)',
    targetRoom: 'right_sanctuary',
    stageNumber: 3,
    title: 'מנעול אגף שמאל 🔒',
    targetRoomName: 'היכל השלווה',
    requiredItemOrders: [1, 2, 3],
    unlockedMessage: 'אלופים! שרשרת 3 התחנות אומתה: משקפי שמש (1) ← טלפון (2) ← חולצה להחלפה (3)! היכל השלווה הואר 💡'
  },
  door_east_south: {
    doorId: 'door_east_south',
    doorName: 'דלת החדר הדרומי',
    targetRoom: 'right_south',
    stageNumber: 4,
    title: 'מנעול היכל השלווה 🔒',
    targetRoomName: 'החדר הדרומי',
    requiredItemOrders: [1, 2, 3, 4],
    unlockedMessage: 'מדהים! שרשרת 4 התחנות מושלמת: משקפיים (1) ← טלפון (2) ← חולצה (3) ← בקבוק מים (4)! החדר הדרומי נפתח 💡'
  },
  vault_master: {
    doorId: 'vault_master',
    doorName: 'כספת אמן ארמון הזיכרון 🏆',
    targetRoom: 'vault',
    stageNumber: 5,
    title: 'מבחן אמן ארמון הזיכרון (Loci Master)',
    targetRoomName: 'אוצר הזיכרון',
    requiredItemOrders: [1, 2, 3, 4, 5],
    unlockedMessage: 'גאונות! שלטתם בכל 5 תחנות ארמון הזיכרון ברצף מושלם! קיבלתם את גביע אמן הזיכרון 🏆✨'
  }
};
