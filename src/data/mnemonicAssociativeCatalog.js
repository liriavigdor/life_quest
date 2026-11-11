/**
 * LifeQuest Mnemonic Associative Catalog
 * 
 * מאגר תמונות ואסוציאציות בניהול ידני מלא של המשתמש.
 * כל התמונות המובנות הקודמות נמחקו לבקשת המשתמש.
 * המאגר ניזון בלעדית מתמונות שהמשתמש מעלה ידנית ומגדיר להן אסוציאציות.
 * אם אין תמונה שהמשתמש העלה עבור מילה - לא ממציאים תמונה שגויה!
 */

import { 
  getUserImagesSync, 
  findUserImageByKeyword as searchUserImages, 
  hebrewWordMatches,
  extractSignificantTokens,
  containsCompoundPhrase,
  HEBREW_COMPOUNDS_MAP,
  initUserImageRepository 
} from '../utils/userImageRepository.js';
import { MASTER_MNEMONIC_ARSENAL } from './masterMnemonicArsenal1000.js';
import { STAGED_IMAGES_POOL } from './stagedImagesPool.js';
import { getAssociativeLeapBridges } from '../utils/associativeLeapGraph.js';

// Initialize on load
if (typeof window !== 'undefined') {
  initUserImageRepository();
}

export const THEMATIC_DOMAINS = [
  { id: 'all', label: 'כל התמונות 🌟', icon: '🌟' },
  { id: 'celebrities', label: 'סלבס ואישים מפורסמים ⭐', icon: '⭐' },
  { id: 'fictional', label: 'דמויות בדיוניות 🦸', icon: '🦸' },
  { id: 'associative', label: 'תמונות אסוציאטיביות 🔮', icon: '🔮' },
  { id: 'objects', label: 'חפצים ועוגנים 📦', icon: '📦' },
  { id: 'places', label: 'מקומות ומבנים 🏛️', icon: '🏛️' },
  { id: 'people', label: 'אנשים 👤', icon: '👤' },
  { id: 'memes', label: 'ממים ובידור 🎭', icon: '🎭' },
  { id: 'general', label: 'כללי 📌', icon: '📌' }
];

/**
 * דינמי: מחזיר את כל התמונות שהמשתמש העלה ידנית
 */
export const MNEMONIC_CATALOG = new Proxy([], {
  get(target, prop) {
    const list = getUserImagesSync();
    if (prop === 'length') return list.length;
    if (prop === 'filter') return list.filter.bind(list);
    if (prop === 'map') return list.map.bind(list);
    if (prop === 'find') return list.find.bind(list);
    if (prop === 'some') return list.some.bind(list);
    if (prop === 'forEach') return list.forEach.bind(list);
    if (prop === 'slice') return list.slice.bind(list);
    if (prop === 'reduce') return list.reduce.bind(list);
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    if (!isNaN(prop)) return list[prop];
    return list[prop];
  }
});

/**
 * Calculate match confidence score (0 to 100) between query and candidate item
 */
export function calculateMatchScore(query = '', item = {}) {
  if (!query || !item) return 0;
  const cleanQuery = String(query).trim().toLowerCase();
  const itemName = String(item.name_he || item.name || item.title || '').trim().toLowerCase();
  const suggestedName = String(item.suggestedName || '').trim().toLowerCase();
  const bonus = item.isUserApproved ? 4 : 0;

  // 1. Exact full match on name or associatedTasks
  if (cleanQuery === itemName || (suggestedName && cleanQuery === suggestedName)) return 100;
  if (Array.isArray(item.associatedTasks) && item.associatedTasks.some(t => String(t).trim().toLowerCase() === cleanQuery)) {
    return 100;
  }

  const kws = Array.from(new Set([
    ...(Array.isArray(item.everyday_associations) ? item.everyday_associations : []),
    ...(Array.isArray(item.keywords) ? item.keywords : []),
    ...(Array.isArray(item.associations) ? item.associations : [])
  ]));

  // 2. Exact match on any keyword
  for (const kw of kws) {
    const cleanKw = String(kw).trim().toLowerCase();
    if (cleanQuery === cleanKw) return Math.min(100, 95 + bonus);
  }

  // 2b. Morphological match on associatedTasks
  if (Array.isArray(item.associatedTasks)) {
    for (const task of item.associatedTasks) {
      if (hebrewWordMatches(cleanQuery, task)) {
        return Math.min(100, 94 + bonus);
      }
    }
  }

  // 3. Exact compound phrase match
  for (const cmp of HEBREW_COMPOUNDS_MAP) {
    if (containsCompoundPhrase(cleanQuery, cmp.phrase)) {
      if (itemName === cmp.phrase) return 98;
      for (const kw of kws) {
        if (String(kw).trim().toLowerCase() === cmp.phrase) return Math.min(100, 95 + bonus);
      }
    }
  }

  // 4. Significant tokens & compound terms match
  const sigTokens = extractSignificantTokens(cleanQuery);
  for (const token of sigTokens) {
    if (/רופא\s*שיניים|טיפול\s*שיניים|שיננית/.test(cleanQuery) && /גלגל\s*שיניים/.test(itemName)) continue;
    if (/פגישה|מפגש/.test(cleanQuery) && /ביג\s*בן/.test(itemName)) continue;
    if (cleanQuery === 'יד' && /מראת|ידית/.test(itemName)) continue;
    if (cleanQuery.length <= 3 && itemName.includes(' ') && !itemName.startsWith(cleanQuery)) continue;
    
    // Strict match on the item's actual name
    if (hebrewWordMatches(token, itemName) || (suggestedName && hebrewWordMatches(token, suggestedName))) {
      return Math.min(100, 85 + bonus);
    }

    // Match on secondary keywords: ONLY for user's own approved/uploaded items!
    // Never allow a catalog figure (e.g. The Joker, Yoda) to hijack an everyday object (speaker, beret) just because of a shared background keyword!
    if (item.isUserApproved || item.source === 'user_uploaded') {
      for (const kw of kws) {
        if (hebrewWordMatches(token, kw)) {
          return Math.min(100, 80 + bonus);
        }
      }
    }
  }

  // 5. Multi-hop associative leap match
  const bridges = getAssociativeLeapBridges(cleanQuery);
  if (bridges.length > 0) {
    for (const bridge of bridges) {
      if (hebrewWordMatches(bridge, itemName)) return Math.min(100, 65 + bonus);
      for (const kw of kws) {
        if (hebrewWordMatches(bridge, kw)) return Math.min(100, 60 + bonus);
      }
    }
  }

  return 0;
}

/**
 * Intelligent scored mnemonic asset search:
 * 1. User repository priority (especially positively-rated isUserApproved images)
 * 2. Staged Images Pool & Master Arsenal with scoring threshold >= 60
 * 3. Rejects low-confidence spurious matches to prevent bizarre associations
 */
export function findMnemonicAssetByKeyword(word = '') {
  if (!word) return null;
  const clean = String(word).trim().toLowerCase();

  // 1. User repository priority
  const userList = getUserImagesSync();
  let bestUserMatch = null;
  let bestUserScore = 0;
  for (const item of userList) {
    const score = calculateMatchScore(clean, item);
    if (score > bestUserScore) {
      bestUserScore = score;
      bestUserMatch = item;
    }
  }
  if (bestUserMatch && bestUserScore >= 60) {
    return {
      ...bestUserMatch,
      matchScore: bestUserScore
    };
  }

  // 2. Staged Images Pool (includes curated & promoted pool items)
  let bestPoolMatch = null;
  let bestPoolScore = 0;
  if (Array.isArray(STAGED_IMAGES_POOL)) {
    for (const item of STAGED_IMAGES_POOL) {
      const score = calculateMatchScore(clean, item);
      if (score > bestPoolScore) {
        bestPoolScore = score;
        bestPoolMatch = item;
      }
    }
  }

  // 3. Master Arsenal with confidence thresholding
  let bestArsenalMatch = null;
  let bestArsenalScore = 0;
  for (const item of MASTER_MNEMONIC_ARSENAL) {
    const score = calculateMatchScore(clean, item);
    if (score > bestArsenalScore) {
      bestArsenalScore = score;
      bestArsenalMatch = item;
    }
  }

  if (bestPoolMatch && bestPoolScore >= bestArsenalScore && bestPoolScore >= 60) {
    return {
      id: bestPoolMatch.id,
      name: bestPoolMatch.suggestedName || bestPoolMatch.name_he || bestPoolMatch.name,
      title: bestPoolMatch.suggestedName || bestPoolMatch.name_he || bestPoolMatch.name,
      imageUrl: bestPoolMatch.imageUrl,
      type: bestPoolMatch.category || 'associative',
      role: bestPoolMatch.category || 'associative',
      keywords: bestPoolMatch.everyday_associations || bestPoolMatch.associations || [],
      caption: bestPoolMatch.name_he || bestPoolMatch.name,
      emoji: '⭐',
      matchScore: bestPoolScore
    };
  }

  if (bestArsenalMatch && bestArsenalScore >= 60) {
    return {
      id: bestArsenalMatch.id,
      name: bestArsenalMatch.name_he,
      title: bestArsenalMatch.name_he,
      imageUrl: bestArsenalMatch.imageUrl || `/staged_images/pool/${bestArsenalMatch.id}.jpg`,
      type: bestArsenalMatch.category || 'associative',
      role: bestArsenalMatch.category || 'associative',
      keywords: bestArsenalMatch.everyday_associations || [],
      caption: bestArsenalMatch.name_he,
      emoji: '⭐',
      matchScore: bestArsenalScore
    };
  }

  return null;
}

/**
 * שליפת תמונה לפי ID
 */
export function getMnemonicCardById(id) {
  if (!id) return null;
  const userCard = getUserImagesSync().find(c => c.id === id);
  if (userCard) return userCard;

  const arsenalCard = MASTER_MNEMONIC_ARSENAL.find(c => c.id === id);
  if (arsenalCard) {
    return {
      id: arsenalCard.id,
      name: arsenalCard.name_he,
      title: arsenalCard.name_he,
      imageUrl: `/staged_images/pool/${arsenalCard.id}.jpg`,
      type: arsenalCard.category || 'associative',
      role: arsenalCard.category || 'associative',
      keywords: arsenalCard.everyday_associations || [],
      caption: arsenalCard.name_he,
      emoji: '⭐'
    };
  }
  return null;
}

