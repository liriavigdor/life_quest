// Key Method (שיטת המפתחות והארמון המנטלי)
// Hierarchical Physical Anchoring:
// Village (כפר) -> House (בית) -> Room (חדר) -> Deposit (פריט בודד / ארונית לוקר ממוספרת)

export const STORAGE_KEY_KEY_METHOD = 'lifequest_key_method_deposits_v1';

// Default World Villages & Ciphers (Top row: 🌲 ברוש, 🐑 כבשה, 🏠 בית)
export const DEFAULT_VILLAGES = [
  { id: 'forest', cipher: 'יער', shortName: 'ברוש', name: 'ברוש', icon: '🌲', badge: 'ברוש' },
  { id: 'village', cipher: 'כפר', shortName: 'כבשה', name: 'כבשה', icon: '🐑', badge: 'כבשה' },
  { id: 'city', cipher: 'עיר', shortName: 'בית', name: 'בית', icon: '🏠', badge: 'בית' }
];

// Default Houses & Ciphers per Village (Single words)
export const DEFAULT_HOUSES = {
  forest: [
    { id: 'dust', cipher: 'אבק', shortName: 'אבק', name: 'אבק', icon: '📦', defaultUrgency: 'urgent' },
    { id: 'iron', cipher: 'ברזל', shortName: 'ברזל', name: 'ברזל', icon: '⚔️', defaultUrgency: 'urgent' }
  ],
  village: [
    { id: 'bread', cipher: 'לחם', shortName: 'לחם', name: 'לחם', icon: '🥖', defaultUrgency: 'routine' },
    { id: 'tea', cipher: 'תה', shortName: 'תה', name: 'תה', icon: '🍵', defaultUrgency: 'routine' }
  ],
  city: [
    { id: 'coin', cipher: 'מטבע', shortName: 'מטבע', name: 'מטבע', icon: '🪙', defaultUrgency: 'in_progress' },
    { id: 'scroll', cipher: 'ספר', shortName: 'ספר', name: 'ספר', icon: '📖', defaultUrgency: 'in_progress' }
  ]
};

import { LOCI_WORK_PRACTICE_ITEMS } from '../data/lociPracticeData';

// Chambers / Rooms in the House Floorplan (Exact 5 rooms: 🚪 כניסה, 🔴 דחוף, 🟡 בטיפול, 🟢 שגרה, 🏆 שלווה דרומית)
export const HOUSE_CHAMBERS = [
  {
    id: 'entry_foyer',
    name: 'כניסה',
    shortName: 'כניסה',
    subtitle: 'מבואה נייטרלית',
    urgency: 'neutral',
    emoji: '🚪',
    color: '#94a3b8',
    bgBadge: 'rgba(148, 163, 184, 0.15)',
    bounds: { x1: 420, y1: 420, x2: 780, y2: 600 }
  },
  {
    id: 'left_store',
    name: 'דחוף',
    shortName: 'דחוף',
    subtitle: 'אגף שמאל',
    urgency: 'urgent',
    emoji: '🔴',
    color: '#ef4444',
    bgBadge: 'rgba(239, 68, 68, 0.15)',
    bounds: { x1: 40, y1: 90, x2: 420, y2: 420 }
  },
  {
    id: 'main_hall',
    name: 'בטיפול',
    shortName: 'בטיפול',
    subtitle: 'האולם המרכזי',
    urgency: 'in_progress',
    emoji: '🟡',
    color: '#f59e0b',
    bgBadge: 'rgba(245, 158, 11, 0.15)',
    bounds: { x1: 420, y1: 40, x2: 780, y2: 420 }
  },
  {
    id: 'right_sanctuary',
    name: 'שגרה',
    shortName: 'שגרה',
    subtitle: 'היכל השלווה',
    urgency: 'routine',
    emoji: '🟢',
    color: '#10b981',
    bgBadge: 'rgba(16, 185, 129, 0.15)',
    bounds: { x1: 780, y1: 170, x2: 1210, y2: 360 }
  },
  {
    id: 'right_south',
    name: 'שלווה דרומית',
    shortName: 'דרום',
    subtitle: 'היכל השלווה הדרומי',
    urgency: 'routine',
    emoji: '🏆',
    color: '#8b5cf6',
    bgBadge: 'rgba(139, 92, 246, 0.15)',
    bounds: { x1: 820, y1: 360, x2: 1210, y2: 600 }
  }
];

// Fixed furniture positions for memory locus discovery (Stardew Valley strategy)
export const LOCKER_POSITIONS = {
  entry_foyer: { x: 505, y: 490, name: 'חדר כניסה (מבואה נייטרלית)' },
  left_store: { x: 195, y: 190, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 595, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
  right_sanctuary: { x: 960, y: 260, name: 'חדר שגרה (היכל השלווה)' },
  right_south: { x: 940, y: 490, name: 'חדר שלווה דרומי' }
};

export const WALL_PHOTO_POSITIONS = {
  left_store: { x: 272, y: 122, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 532, y: 80, name: 'חדר בטיפול (האולם המרכזי)' },
  entry_foyer: { x: 686, y: 392, name: 'חדר כניסה (מבואה נייטרלית)' },
  right_sanctuary: { x: 995, y: 142, name: 'חדר שגרה (היכל השלווה)' },
  right_south: { x: 1080, y: 392, name: 'חדר השלווה הדרומי' }
};

export const CHEST_POSITIONS = {
  entry_foyer: { x: 675, y: 495, name: 'חדר כניסה (מבואה נייטרלית)' },
  left_store: { x: 300, y: 240, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 495, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
  right_sanctuary: { x: 1040, y: 260, name: 'חדר שגרה (היכל השלווה)' },
  right_south: { x: 1040, y: 480, name: 'חדר שלווה דרומי (כספת האמן)' }
};

export const RADIO_POSITIONS = {
  entry_foyer: { x: 440, y: 535, name: 'חדר כניסה (מבואה נייטרלית)' },
  left_store: { x: 100, y: 240, name: 'חדר דחוף (אגף שמאל)' },
  main_hall: { x: 730, y: 220, name: 'חדר בטיפול (האולם המרכזי)' },
  right_sanctuary: { x: 860, y: 390, name: 'חדר שגרה (היכל השלווה)' }
};

// Preset bizarre and hilarious sorting questions for List deposits (Method of Loci / Emotion Tagging)
export const SORTING_BENCHMARKS = [
  {
    id: 'mouth_first',
    label: 'את מה היית דוחף לפה קודם? 👄',
    question: 'את מה היית דוחף לפה קודם?',
    associationWord: 'בלוע',
    hint: 'מיינו מהפריט שהכי אפשר לדחוף לפה ולבלוע ראשון, ועד לפריט שבחיים לא הייתם נוגעים בו עם הלשון!',
    icon: '👄'
  },
  {
    id: 'zombie_weapon',
    label: 'במה היית מכה זומבי שמתקרב? 🧟',
    question: 'במה היית מכה זומבי שמתקרב?',
    associationWord: 'חבוט',
    hint: 'מיינו מהפריט הכי קטלני ויעיל לריסוק ראש זומבי ועד לפריט הכי חסר תועלת',
    icon: '🧟'
  },
  {
    id: 'politician_throw',
    label: 'מה תזרוק קודם על פוליטיקאי מושחת? 🍅',
    question: 'מה תזרוק קודם על פוליטיקאי מושחת?',
    associationWord: 'מושלך',
    hint: 'מיינו מהפריט שהכי כיף ומשפיל להשליך עליו ועד לפריט שהיית שומר לעצמך',
    icon: '🍅'
  },
  {
    id: 'underpants_hide',
    label: 'איזה פריט תחביא בתחתונים של האויב? 🩲',
    question: 'איזה פריט תחביא בתחתונים של האויב?',
    associationWord: 'עוקץ',
    hint: 'מיינו ממה שהכי יגרום לו לצרוח ולהתפתל מאימה ועד למה שלא ירגיש',
    icon: '🩲'
  },
  {
    id: 'ten_floors_drop',
    label: 'מה ישרוד נפילה מקומה עשירית? 🏢',
    question: 'מה ישרוד נפילה מקומה עשירית?',
    associationWord: 'מרוסק',
    hint: 'מיינו מהפריט שיתרסק לאלפי רסיסים ראשון ועד לפריט שישרוד פגיעה במדרכה',
    icon: '🏢'
  },
  {
    id: 'fragility',
    label: 'שבירות — מי הכי שביר? 💥',
    question: 'מי הכי שביר?',
    associationWord: 'שבור',
    hint: 'מיינו מהפריט שמתנפץ ראשון לעמיד ביותר',
    icon: '💥'
  },
  {
    id: 'custom',
    label: 'שאלה ביזארית מותאמת אישית... 🎭',
    question: 'שאלה ביזארית אישית',
    associationWord: '',
    hint: 'המצא שאלה ביזארית ומצחיקה שתקפיץ לך את המוח לזיכרון בלתי נשכח!',
    icon: '🎭'
  }
];

/**
 * Generates the strict physical verbal chain according to the Key Method:
 * הכפר (יער) ← הבית (אבק) ← מילת אסוציאציה (למשל "בלוע" או מילה שבחר)
 */
export function formatPhysicalChain(villageCipher, houseCipher, associationWord) {
  const v = villageCipher?.trim() || 'יער';
  const h = houseCipher?.trim() || 'אבק';
  const a = associationWord?.trim() || 'עוגן';
  return `הכפר (${v}) ← הבית (${h}) ← ${a}`;
}

/**
 * Load all stored deposits from localStorage
 */
export function getStoredDeposits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_KEY_METHOD);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-upgrade legacy seed deposit if it still contains the old fragility question
        let modified = false;

        // Ensure 5 Loci Practice Photos for House "עבודה" exist
        const defaultLociPhotos = LOCI_WORK_PRACTICE_ITEMS.map(item => ({
          id: item.id,
          createdAt: Date.now() - 3600000,
          villageCipher: 'יער',
          villageName: 'כפר עבודה וצמיחה',
          villageId: 'forest',
          houseCipher: 'עבודה',
          houseName: 'בית עבודה',
          houseId: 'work',
          roomId: item.roomId,
          roomName: item.roomName,
          type: 'photo',
          title: item.title,
          emoji: item.emoji,
          story: item.story,
          imageUrl: item.imageUrl,
          associationWord: item.associationWord,
          order: item.order,
          physicalChain: `הכפר (יער) ← הבית (עבודה) ← ${item.title}`
        }));

        defaultLociPhotos.forEach(p => {
          if (!parsed.some(d => d.id === p.id || (d.roomId === p.roomId && d.type === 'photo'))) {
            parsed.push(p);
            modified = true;
          }
        });

        const upgraded = parsed.map(d => {
          if (d.id === 'seed-deposit-2' && (d.criterion === 'מי הכי שביר?' || d.associationWord === 'שבור')) {
            modified = true;
            return {
              ...d,
              criterion: 'את מה היית דוחף לפה קודם?',
              associationWord: 'בלוע',
              physicalChain: 'הכפר (יער) ← הבית (אבק) ← בלוע',
              lockerTitle: 'לוקר ציוד ממוין ("את מה היית דוחף לפה קודם?")',
              items: [
                { id: 'item-1', rank: 1, text: 'בקבוק מים צלול (נלגם ראשון בהנאה)' },
                { id: 'item-2', rank: 2, text: 'משקפי שמש (בקושי רב נכנס לפה)' },
                { id: 'item-3', rank: 3, text: 'טלפון נייד (מסוכן ומגעיל)' },
                { id: 'item-4', rank: 4, text: 'משקולת ברזל (ינפץ את השיניים!)' }
              ]
            };
          }
          return d;
        });

        if (modified) {
          try {
            localStorage.setItem(STORAGE_KEY_KEY_METHOD, JSON.stringify(upgraded));
          } catch (e) { /* ignore */ }
        }
        return upgraded;
      }
    }
  } catch (e) {
    console.error('Error loading deposits:', e);
  }

  // Initial seed deposit if empty so user immediately sees how it works
  const defaultLociPhotos = LOCI_WORK_PRACTICE_ITEMS.map(item => ({
    id: item.id,
    createdAt: Date.now() - 3600000,
    villageCipher: 'יער',
    villageName: 'כפר עבודה וצמיחה',
    villageId: 'forest',
    houseCipher: 'עבודה',
    houseName: 'בית עבודה',
    houseId: 'work',
    roomId: item.roomId,
    roomName: item.roomName,
    type: 'photo',
    title: item.title,
    emoji: item.emoji,
    story: item.story,
    imageUrl: item.imageUrl,
    associationWord: item.associationWord,
    order: item.order,
    physicalChain: `הכפר (יער) ← הבית (עבודה) ← ${item.title}`
  }));

  const initialSeed = [
    ...defaultLociPhotos,
    {
      id: 'seed-deposit-1',
      createdAt: Date.now() - 3600000,
      villageCipher: 'יער',
      villageName: 'כפר יער הצבא והביטחון',
      villageId: 'forest',
      houseCipher: 'אבק',
      houseName: 'מחלקת לוגיסטיקה וציוד',
      houseId: 'dust',
      roomId: 'left_store',
      roomName: 'חדר דחוף (אגף שמאל)',
      type: 'single',
      itemName: 'מפתחות הרכב והרחפן',
      associationWord: 'מנעול',
      physicalChain: 'הכפר (יער) ← הבית (אבק) ← מנעול'
    },
    {
      id: 'seed-deposit-2',
      createdAt: Date.now() - 1800000,
      villageCipher: 'יער',
      villageName: 'כפר יער הצבא והביטחון',
      villageId: 'forest',
      houseCipher: 'אבק',
      houseName: 'מחלקת לוגיסטיקה וציוד',
      houseId: 'dust',
      roomId: 'main_hall',
      roomName: 'חדר בטיפול (האולם המרכזי)',
      type: 'list',
      criterion: 'את מה היית דוחף לפה קודם?',
      associationWord: 'בלוע',
      physicalChain: 'הכפר (יער) ← הבית (אבק) ← בלוע',
      lockerTitle: 'לוקר ציוד ממוין ("את מה היית דוחף לפה קודם?")',
      items: [
        { id: 'item-1', rank: 1, text: 'בקבוק מים צלול (נלגם ראשון בהנאה)' },
        { id: 'item-2', rank: 2, text: 'משקפי שמש (בקושי רב נכנס לפה)' },
        { id: 'item-3', rank: 3, text: 'טלפון נייד (מסוכן ומגעיל)' },
        { id: 'item-4', rank: 4, text: 'משקולת ברזל (ינפץ את השיניים!)' }
      ]
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY_KEY_METHOD, JSON.stringify(initialSeed));
  } catch (e) {
    // ignore
  }

  return initialSeed;
}

/**
 * Save or update a deposit
 */
export function saveDeposit(deposit) {
  const all = getStoredDeposits();
  const existingIdx = all.findIndex(d => d.id === deposit.id);

  let updated;
  if (existingIdx >= 0) {
    updated = [...all];
    updated[existingIdx] = { ...deposit, updatedAt: Date.now() };
  } else {
    updated = [
      {
        ...deposit,
        id: deposit.id || `dep_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: deposit.createdAt || Date.now()
      },
      ...all
    ];
  }

  try {
    localStorage.setItem(STORAGE_KEY_KEY_METHOD, JSON.stringify(updated));
    // Dispatch custom window event so all open views sync in real time
    window.dispatchEvent(new CustomEvent('lifequest_deposits_updated', { detail: updated }));
  } catch (e) {
    console.error('Error saving deposit:', e);
  }

  return updated;
}

/**
 * Delete a deposit
 */
export function deleteDeposit(id) {
  const all = getStoredDeposits();
  const updated = all.filter(d => d.id !== id);

  try {
    localStorage.setItem(STORAGE_KEY_KEY_METHOD, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('lifequest_deposits_updated', { detail: updated }));
  } catch (e) {
    console.error('Error deleting deposit:', e);
  }

  return updated;
}

/**
 * Detect which chamber of the burrow house the player is currently standing in
 */
export function getChamberForPosition(x, y) {
  for (const chamber of HOUSE_CHAMBERS) {
    const { x1, y1, x2, y2 } = chamber.bounds;
    if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
      return chamber;
    }
  }
  return null;
}

/**
 * Builds the comprehensive hierarchical memory tree:
 * Level 1: Villages (יער, כפר, עיר)
 * Level 2: Houses (אבק, ברזל, לחם, תה, מטבע, ספר)
 * Level 3: Rooms / Chambers (חדר דחוף, חדר בטיפול, חדר שגרה, וכו')
 * Level 4: Deposits & Anchors (Single items + Numbered Lockers)
 */
export function buildHierarchyTree(deposits = []) {
  // Ensure we cover all 3 primary villages requested: יער, כפר, עיר
  const villagesMap = {};

  DEFAULT_VILLAGES.forEach(v => {
    villagesMap[v.cipher] = {
      id: v.id,
      cipher: v.cipher,
      name: v.name,
      icon: v.icon,
      badge: v.badge,
      houses: {}
    };

    const houses = DEFAULT_HOUSES[v.id] || [];
    houses.forEach(h => {
      villagesMap[v.cipher].houses[h.cipher] = {
        id: h.id,
        cipher: h.cipher,
        name: h.name,
        icon: h.icon,
        rooms: {}
      };

      HOUSE_CHAMBERS.forEach(r => {
        villagesMap[v.cipher].houses[h.cipher].rooms[r.id] = {
          id: r.id,
          name: r.name,
          subtitle: r.subtitle,
          emoji: r.emoji,
          color: r.color,
          urgency: r.urgency,
          deposits: []
        };
      });
    });
  });

  // Populate deposits into their corresponding branches
  deposits.forEach(dep => {
    const vCipher = dep.villageCipher?.trim() || 'יער';
    const hCipher = dep.houseCipher?.trim() || 'אבק';
    const rId = dep.roomId || 'main_hall';

    // If village doesn't exist, create dynamically
    if (!villagesMap[vCipher]) {
      villagesMap[vCipher] = {
        id: `v_${vCipher}`,
        cipher: vCipher,
        name: dep.villageName || `כפר ${vCipher}`,
        icon: '🌲',
        badge: 'כפר מותאם',
        houses: {}
      };
    }

    // If house doesn't exist, create dynamically
    if (!villagesMap[vCipher].houses[hCipher]) {
      villagesMap[vCipher].houses[hCipher] = {
        id: `h_${hCipher}`,
        cipher: hCipher,
        name: dep.houseName || `בית ${hCipher}`,
        icon: '🏠',
        rooms: {}
      };
    }

    // If room doesn't exist, create
    if (!villagesMap[vCipher].houses[hCipher].rooms[rId]) {
      const chamberDef = HOUSE_CHAMBERS.find(c => c.id === rId);
      villagesMap[vCipher].houses[hCipher].rooms[rId] = {
        id: rId,
        name: dep.roomName || chamberDef?.name || `חדר (${rId})`,
        subtitle: chamberDef?.subtitle || '',
        emoji: chamberDef?.emoji || '🚪',
        color: chamberDef?.color || '#cbd5e1',
        urgency: chamberDef?.urgency || 'routine',
        deposits: []
      };
    }

    villagesMap[vCipher].houses[hCipher].rooms[rId].deposits.push(dep);
  });

  return Object.values(villagesMap).map(v => ({
    ...v,
    houses: Object.values(v.houses).map(h => ({
      ...h,
      rooms: Object.values(h.rooms).map(r => ({
        ...r
      }))
    }))
  }));
}
