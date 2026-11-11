/**
 * User Mnemonic Image Repository
 * 
 * מאגר תמונות ואסוציאציות שיתופי בזמן אמת (Firebase Firestore)
 * עם גיבוי מקומי מלא (IndexedDB) לפעולה מהירה ועמידות במצב Offline.
 * כולל מנגנון מניעת כפילויות ("כדי לא למחזר"), סנכרון חי וזיהוי תורם/מעלה.
 */

import { db, isFirebaseConfigured } from '../firebase.js';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { MASTER_MNEMONIC_ARSENAL } from '../data/masterMnemonicArsenal1000.js';
import { STAGED_TRIPLET_POOL } from '../data/stagedTripletPool.js';
import { getAssociativeLeapBridges } from './associativeLeapGraph.js';

const DB_NAME = 'lifequest_user_mnemonic_db_v1';
const STORE_NAME = 'user_images';
const DB_VERSION = 1;
const FIRESTORE_COLLECTION = 'user_mnemonic_images';

// Global canonical map for few, ultra-accurate everyday single-word associations
const CANONICAL_KEYWORDS_MAP = new Map();

function toCanonicalKey(str) {
  if (!str) return '';
  return String(str)
    .trim()
    .toLowerCase()
    .replace(/[״"'`()\[\]{}.,:;!?\-–—\/\s]+/g, '')
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ץ/g, 'צ')
    .replace(/ף/g, 'פ')
    .replace(/ך/g, 'כ');
}

// Build canonical lookup from STAGED_TRIPLET_POOL
if (Array.isArray(STAGED_TRIPLET_POOL)) {
  for (const item of STAGED_TRIPLET_POOL) {
    if (item.curatedEverydayKeywords && item.curatedEverydayKeywords.length > 0) {
      const clean = item.curatedEverydayKeywords.map(k => String(k).trim()).filter(k => k && !k.includes(' ')).slice(0, 4);
      if (item.id) CANONICAL_KEYWORDS_MAP.set(toCanonicalKey(item.id), clean);
      if (item.suggestedName) CANONICAL_KEYWORDS_MAP.set(toCanonicalKey(item.suggestedName), clean);
    }
  }
}

// Build canonical lookup from MASTER_MNEMONIC_ARSENAL
if (Array.isArray(MASTER_MNEMONIC_ARSENAL)) {
  for (const item of MASTER_MNEMONIC_ARSENAL) {
    if (item.everyday_associations && item.everyday_associations.length > 0) {
      const clean = item.everyday_associations.map(k => String(k).trim()).filter(k => k && !k.includes(' ')).slice(0, 4);
      if (item.id) CANONICAL_KEYWORDS_MAP.set(toCanonicalKey(item.id), clean);
      if (item.suggestedName) CANONICAL_KEYWORDS_MAP.set(toCanonicalKey(item.suggestedName), clean);
      if (item.name_he) CANONICAL_KEYWORDS_MAP.set(toCanonicalKey(item.name_he), clean);
    }
  }
}

// User-mandated strict anchor: Michael Jordan MUST be ['כדור', 'אדום', 'אימון']
const JORDAN_CANONICAL = ['כדור', 'אדום', 'אימון'];
CANONICAL_KEYWORDS_MAP.set('michaeljordan', JORDAN_CANONICAL);
CANONICAL_KEYWORDS_MAP.set(toCanonicalKey("מייקל ג'ורדן"), JORDAN_CANONICAL);
CANONICAL_KEYWORDS_MAP.set(toCanonicalKey('מייקל גורדן'), JORDAN_CANONICAL);

// מאגר ענפים מפורש, עשיר ומדויק לכל העוגנים במאגר המשתמש (ללא קיצוצי אותיות, ללא שמות פרטיים וללא פעלים ארעיים!)
export const EXPLICIT_REPOSITORY_ANCHOR_BRANCHES = [
  {
    match: ['רובין', 'robin_hood', 'עזרה'],
    title: 'רובין הוד',
    imageUrl: '/staged_images/pool/robin_hood_bow_arrow.jpg',
    keywords: ['עזרה', 'קשת', 'חץ', 'יער שרווד', 'צדק', 'לוחם'],
    caption: 'רובין הוד חמוש בקשת וחצים ביער שרווד מסייע לנזקקים!'
  },
  {
    match: ['סאנדיי', 'גלידה', 'ice_cream_sundae', 'approved_1794388680439'],
    title: 'קערת סאנדיי גלידה עם קצפת ודובדבן 🍨🍒',
    imageUrl: '/staged_images/pool/approved_1794388680281.jpg',
    keywords: ['גלידה', 'סאנדיי', 'קצפת', 'דובדבן', 'קינוח', 'מתוק'],
    caption: 'מנת גלידה חגיגית עם הר קצפת ודובדבן אדום בראשו!'
  },
  {
    match: ['ספיידרמן', 'spider_man'],
    title: 'ספיידרמן מטפס בזריזות על קיר גורד שחקים 🕷️🏙️',
    imageUrl: '/staged_images/pool/spider_man.jpg',
    keywords: ['טיפוס', 'ספיידרמן', 'עכביש', 'קיר', 'גורד שחקים', 'קורים'],
    caption: 'איש העכביש מטפס על קירות אנכיים בקלות ובזריזות מדהימה!'
  },
  {
    match: ['אריה', 'שאגה', 'item_458_אריה'],
    title: 'אריה שואג',
    imageUrl: '/staged_images/pool/item_458_אריה.jpg',
    keywords: ['אריה', 'אומץ', 'שאגה', 'ספארי', 'טורף', 'מלך החיות'],
    caption: 'אריה שואג במלוא העוצמה ומפגין אומץ ומנהיגות!'
  },
  {
    match: ['מרקיורי', 'מרקורי', 'קריוקי', 'freddie_mercury'],
    title: 'פרדי מרקיורי שר בהתלהבות למיקרופון באצטדיון 🎤👑',
    imageUrl: '/staged_images/pool/queen_freddie_mercury_wembley.jpg',
    keywords: ['קריוקי', 'פרדי מרקיורי', 'מיקרופון', 'שירה', 'הופעה', 'אצטדיון'],
    caption: 'פרדי מרקיורי מרעיד את האצטדיון בשירה עוצמתית לתוך המיקרופון!'
  },
  {
    match: ['פיקאצ', 'pikachu', 'פוקימון'],
    title: 'פיקאצ\'ו פולט מכת ברק וניצוצות חשמל ⚡🐭',
    imageUrl: '/staged_images/pool/pikachu_electric_mouse.jpg',
    keywords: ['אנימה', 'פיקאצ\'ו', 'ברק', 'חשמל', 'פוקימון', 'טעינה'],
    caption: 'פיקאצ\'ו האגדי טוען 100,000 וולט ומחשמל את כנס האנימה!'
  },
  {
    match: ['טייפון', 'בייבלייד', 'סופה', 'approved_1794324419053'],
    title: 'טייפון',
    imageUrl: '/staged_images/pool/approved_1794324418922.jpg',
    keywords: ['בייבלייד', 'טייפון', 'סופה', 'מערבולת', 'סערה', 'סיבוב'],
    caption: 'מערבולת רוח עוצמתית המדמה את סיבוב הלהבים והזירה!'
  },
  {
    match: ['סאגוארו', 'קקטוס', 'מדחום', 'item_251'],
    title: 'קקטוס סאגוארו',
    imageUrl: '/staged_images/pool/item_251_קקטוס_סאגוארו.jpg',
    keywords: ['מדחום', 'קקטוס', 'חום', 'מדבר', 'שרב', 'שמש'],
    caption: 'קקטוס סאגוארו ענק עומד בשיא החום המדברי ומזכיר מדחום לוהט!'
  },
  {
    match: ['מסי', 'ליאו', 'messi'],
    title: 'ליאו מסי מניף את גביע העולם 🏆🇦🇷',
    imageUrl: '/staged_images/pool/lionel_messi_world_cup.jpg',
    keywords: ['כדורגל', 'ליאו מסי', 'גביע', 'מונדיאל', 'אליפות', 'מגרש'],
    caption: 'ליאו מסי מניף את גביע העולם המוזהב באושר עילאי ומזכיר משחק כדורגל!'
  },
  {
    match: ['פלפס', 'phelps', 'שחייה', 'שחיה'],
    title: 'מייקל פלפס עם 28 מדליות זהב אולימפיות 🏊🥇',
    imageUrl: '/staged_images/pool/michael_phelps_medals.jpg',
    keywords: ['שחייה', 'מייקל פלפס', 'בריכה', 'מדליה', 'אולימפיאדה', 'מים'],
    caption: 'מייקל פלפס, השחיין הגדול בהיסטוריה, עטור מדליות זהב מזנק לבריכה!'
  },
  {
    match: ['בובספוג', 'spongebob'],
    title: 'בובספוג',
    imageUrl: '/staged_images/pool/spongebob.jpg',
    keywords: ['סדר', 'ניקיון', 'בובספוג', 'ספוג', 'בועות', 'קרצוף'],
    caption: 'בובספוג מכנסמרובע הוא ספוג ניקיון חרוץ שמבריק ומסדר את כל החדר!'
  },
  {
    match: ['ג\'ינס', 'גינס', 'מכנסיים', 'מכנס', 'jeans'],
    title: 'מכנסי ג\'ינס מקופלים',
    imageUrl: '/staged_images/pool/classic_blue_denim_jeans.jpg',
    keywords: ['מכנסיים', 'ג\'ינס', 'דנים', 'בגדים', 'כיסים', 'חגורה'],
    caption: 'מכנסי ג\'ינס דנים כחולים מקופלים ומגוהצים בצורה מושלמת!'
  },
  {
    match: ['כדורגל על דשא', 'כדורגל קלאסי', 'soccer'],
    title: 'כדורגל קלאסי על דשא',
    imageUrl: '/staged_images/pool/item_301_כדורגל_קלאסי.jpg',
    keywords: ['כדורגל', 'דשא', 'מגרש', 'אימון', 'שער', 'ספורט'],
    caption: 'כדורגל עור קלאסי בשחור-לבן מונח על דשא ירוק ורענן!'
  },
  {
    match: ['וונקה', 'wonka', 'שוקולד', 'chocolate'],
    title: 'חפיסת שוקולד מריר פרימיום',
    imageUrl: '/staged_images/pool/pieces_dark_chocolate_bar.jpg',
    keywords: ['שוקולד', 'קקאו', 'חפיסה', 'קוביות', 'מתוק', 'ממתק'],
    caption: 'חפיסת שוקולד מריר שבורה לקוביות עשירות עם פולי קקאו טבעיים!'
  },
  {
    match: ['לחם', 'bread'],
    title: 'כיכר לחם כפרי חם וטרי',
    imageUrl: '/staged_images/pool/fresh_bread_loaf.jpg',
    keywords: ['לחם', 'מאפייה', 'כיכר', 'שמרים', 'כריך', 'טוסט'],
    caption: 'כיכר לחם מחמצת פריכה וזהובה שיצאה זה עתה מתנור האבן!'
  },
  {
    match: ['לנקות את הרכב', 'שטיפת רכב', 'ניקיון רכב'],
    title: 'שטיפת רכב עם דלי קצף וספוג',
    imageUrl: '/staged_images/pool/car_wash_bucket_sponge.jpg',
    keywords: ['ניקיון רכב', 'שטיפה', 'ספוג', 'קצף', 'דלי', 'ברק'],
    caption: 'דלי מים עם קצף סבון עשיר וספוג רך ממרקים את הרכב לברק מושלם!'
  },
  {
    match: ['הסמל של הרכב', 'סמל רכב', 'סמל הרכב'],
    title: 'סמל רכב כרום מבריק',
    imageUrl: '/staged_images/pool/chrome_car_hood_emblem.jpg',
    keywords: ['סמל רכב', 'תיקון', 'כרום', 'מכסה מנוע', 'מוסך', 'רכב'],
    caption: 'סמל רכב קלאסי מצופה כרום מלוטש ומבריק המותקן בחזית מכסה המנוע!'
  },
  {
    match: ['מדי צבא', 'מדים', 'military_uniform'],
    title: 'חייל במדי צבא ייצוגיים',
    imageUrl: '/staged_images/pool/military_dress_uniform.jpg',
    keywords: ['מדי צבא', 'מדים', 'חייל', 'צבא', 'בסיס', 'כומתה'],
    caption: 'חייל במדי צבא מגוהצים וייצוגיים עם כומתה על הכתף!'
  }
];

export function sanitizeUserRecord(record) {
  if (!record) return false;
  let changed = false;

  const title = (record.title || record.name || '').trim();
  const titleKey = toCanonicalKey(title);
  const idKey = toCanonicalKey(record.id);
  const imgUrl = (record.imageUrl || '').toLowerCase();

  // 1. בדיקת התאמה מפורשת לעוגנים המדויקים במאגר
  for (const entry of EXPLICIT_REPOSITORY_ANCHOR_BRANCHES) {
    const isMatched = entry.match.some(m => {
      const mKey = toCanonicalKey(m);
      return titleKey.includes(mKey) || idKey.includes(mKey) || imgUrl.includes(mKey);
    });

    if (isMatched) {
      if (JSON.stringify(record.keywords) !== JSON.stringify(entry.keywords)) {
        record.keywords = [...entry.keywords];
        changed = true;
      }
      if (entry.title && record.title !== entry.title && !record.title?.includes(entry.title)) {
        record.title = entry.title;
        changed = true;
      }
      if (entry.imageUrl && record.imageUrl !== entry.imageUrl && (imgUrl.includes('formula') || imgUrl.includes('fresco') || imgUrl.includes('wonka') || !record.imageUrl)) {
        record.imageUrl = entry.imageUrl;
        changed = true;
      }
      if (entry.caption && (!record.caption || record.caption.includes('לנסיעה'))) {
        record.caption = entry.caption;
        changed = true;
      }
      return changed;
    }
  }

  // 2. סינון כללי עבור תמונות שאינן במאגר המפורש:
  // איסור מוחלט על שמות פרטיים של חברים, פעלים ארעיים, ותגיות חתוכות באותיות סופיות!
  const BANNED_PERSON_AND_VERBS = new Set([
    'אמיר', 'יהושוע', 'יהושע', 'אמיתי', 'יוסי', 'דני', 'רונה', 'שרה',
    'יום', 'ביום', 'רביעי', 'חמישי', 'שלישי', 'שני', 'ראשון', 'שישי', 'שבת',
    'להחזיר', 'החזיר', 'להביא', 'הביא', 'לקנות', 'קנה', 'קנות', 'לרכוש', 'רכש', 'רכוש',
    'לקחת', 'לקח', 'למסור', 'לסדר', 'לנקות', 'לשטוף', 'לכנס', 'כנס', 'השתתף', 'להשתתף',
    'בטורניר', 'טורניר', 'לצבור', 'צבור', 'לשחות', 'שחות', 'לשחק', 'שחק', 'לטפס', 'טפס',
    'ייבלייד', 'וקולד', 'דורגל', 'ובספוג', 'ואג', 'חקימ', 'שחקימ'
  ]);

  const rawList = Array.isArray(record.keywords) ? record.keywords : [];
  const cleanList = [];
  for (const raw of rawList) {
    const str = String(raw).trim();
    if (!str || str.length < 2) continue;
    if (BANNED_PERSON_AND_VERBS.has(str)) continue;
    // שלילת אותיות סופיות שחובלו למדיאליות (כמו רובינ, מיקרופונ, עולמ)
    if (/[מנצפכ]$/.test(str)) continue;

    if (!cleanList.includes(str) && cleanList.length < 6) {
      cleanList.push(str);
    }
  }

  if (cleanList.length > 0 && JSON.stringify(cleanList) !== JSON.stringify(record.keywords)) {
    record.keywords = cleanList;
    changed = true;
  }

  return changed;
}

// Synchronous in-memory cache for ultra-fast rendering & keyword lookups
let cachedUserImages = [];
let isDbInitialized = false;
let isFirestoreListening = false;
let cloudSyncStatus = 'offline'; // 'offline' | 'connecting' | 'online' | 'error'
let cloudSyncError = null;
const listeners = new Set();
const statusListeners = new Set();

/**
 * Open local IndexedDB database
 */
function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const dbInstance = e.target.result;
      if (!dbInstance.objectStoreNames.contains(STORE_NAME)) {
        const store = dbInstance.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
        store.createIndex('title', 'title', { unique: false });
      }
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => {
      console.warn('IndexedDB open error:', e);
      resolve(null);
    };
  });
}

/**
 * Optimize / resize image using offscreen canvas to keep storage lightweight and fast
 */
export async function optimizeImage(dataUrlOrFile, maxWidth = 800, maxHeight = 800, quality = 0.80) {
  return new Promise((resolve) => {
    let srcUrl = '';
    let shouldRevoke = false;

    if (typeof dataUrlOrFile === 'string') {
      srcUrl = dataUrlOrFile;
    } else if (dataUrlOrFile instanceof Blob || dataUrlOrFile instanceof File) {
      srcUrl = URL.createObjectURL(dataUrlOrFile);
      shouldRevoke = true;
    } else {
      resolve('');
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width / maxWidth > height / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      try {
        const optimized = canvas.toDataURL('image/jpeg', quality);
        if (shouldRevoke) URL.revokeObjectURL(srcUrl);
        resolve(optimized);
      } catch (err) {
        console.warn('Canvas export error:', err);
        if (shouldRevoke) URL.revokeObjectURL(srcUrl);
        resolve(srcUrl);
      }
    };

    img.onerror = () => {
      if (shouldRevoke) URL.revokeObjectURL(srcUrl);
      resolve(typeof dataUrlOrFile === 'string' ? dataUrlOrFile : '');
    };

    img.src = srcUrl;
  });
}

/**
 * Save images array to local IndexedDB
 */
async function persistAllToIndexedDB(items) {
  try {
    const localDb = await openDB();
    if (!localDb) {
      localStorage.setItem('lifequest_user_images_fallback', JSON.stringify(items));
      return;
    }
    const tx = localDb.transaction([STORE_NAME], 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.clear();
    for (const item of items) {
      store.put(item);
    }
  } catch (err) {
    console.warn('Failed to bulk persist to IndexedDB:', err);
  }
}

/**
 * Setup Realtime Cloud Sync with Firestore
 */
function setupFirestoreRealtimeSync() {
  if (isFirestoreListening || !isFirebaseConfigured || !db) return;
  isFirestoreListening = true;
  cloudSyncStatus = 'connecting';
  notifyStatusListeners();

  try {
    const colRef = collection(db, FIRESTORE_COLLECTION);
    onSnapshot(colRef, async (snapshot) => {
      cloudSyncStatus = 'online';
      cloudSyncError = null;
      notifyStatusListeners();

      const cloudItems = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudItems.push({
          id: docSnap.id,
          ...data
        });
      });

      // Sort descending by createdAt
      cloudItems.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      // If cloud is empty but we have local images, auto-sync local ones to cloud!
      if (cloudItems.length === 0 && cachedUserImages.length > 0) {
        console.info('Auto-migrating local images to cloud Firestore...');
        for (const item of cachedUserImages) {
          try {
            await setDoc(doc(db, FIRESTORE_COLLECTION, item.id), item);
          } catch (e) {
            console.warn('Error syncing existing local image to cloud:', e);
          }
        }
        return;
      }

      // Run automatic sanitization so bloated tags are cleaned in both local cache and Firestore
      let anyCloudSanitized = false;
      for (const item of cloudItems) {
        if (sanitizeUserRecord(item)) {
          anyCloudSanitized = true;
          try {
            setDoc(doc(db, FIRESTORE_COLLECTION, item.id), item).catch(() => {});
          } catch (_) {}
        }
      }

      cachedUserImages = cloudItems;
      persistAllToIndexedDB(cloudItems);
      notifyListeners();
    }, (err) => {
      console.warn('Firestore realtime sync error:', err);
      cloudSyncStatus = 'error';
      cloudSyncError = err.message;
      notifyStatusListeners();
    });
  } catch (err) {
    console.warn('Error initializing Firestore listener:', err);
    cloudSyncStatus = 'error';
    cloudSyncError = err.message;
    notifyStatusListeners();
  }
}

/**
 * Initialize repository from IndexedDB into synchronous cache, then connect Firestore
 */
export async function initUserImageRepository() {
  if (isDbInitialized) return cachedUserImages;

  try {
    const localDb = await openDB();
    if (localDb) {
      await new Promise((resolve) => {
        const transaction = localDb.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = (e) => {
          const results = e.target.result || [];
          results.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

          // Run automatic sanitization across stored records
          let anyLocalSanitized = false;
          for (const item of results) {
            if (sanitizeUserRecord(item)) {
              anyLocalSanitized = true;
            }
          }

          if (anyLocalSanitized) {
            persistAllToIndexedDB(results);
            if (isFirebaseConfigured && db) {
              for (const item of results) {
                try {
                  setDoc(doc(db, FIRESTORE_COLLECTION, item.id), item).catch(() => {});
                } catch (_) {}
              }
            }
          }

          cachedUserImages = results;
          isDbInitialized = true;
          notifyListeners();
          resolve(cachedUserImages);
        };

        request.onerror = () => {
          cachedUserImages = [];
          isDbInitialized = true;
          resolve([]);
        };
      });
    } else {
      const raw = localStorage.getItem('lifequest_user_images_fallback');
      cachedUserImages = raw ? JSON.parse(raw) : [];
      isDbInitialized = true;
      notifyListeners();
    }
  } catch (err) {
    console.error('initUserImageRepository error:', err);
    cachedUserImages = [];
    isDbInitialized = true;
  }

  // Connect cloud realtime sync
  if (isFirebaseConfigured && db) {
    setupFirestoreRealtimeSync();
  } else {
    cloudSyncStatus = 'offline';
    notifyStatusListeners();
  }

  return cachedUserImages;
}

// Automatically initiate load when script is imported in browser
if (typeof window !== 'undefined') {
  initUserImageRepository();
}

/**
 * Synchronous getter for current user images
 */
export function getUserImagesSync() {
  return [...cachedUserImages];
}

/**
 * Get cloud sync status
 */
export function getCloudSyncStatus() {
  return {
    status: cloudSyncStatus,
    isConfigured: isFirebaseConfigured,
    error: cloudSyncError,
    count: cachedUserImages.length
  };
}

/**
 * Save or update user image (saves locally AND syncs to Firebase Firestore)
 */
export async function saveUserImage({
  id = null,
  title = '',
  imageUrl = '',
  keywords = [],
  associatedTasks = [],
  caption = '',
  domain = 'general',
  uploaderName = '',
  source = 'user_uploaded',
  isUserApproved = false,
  qualityScore = 95,
  emoji = '⭐'
}) {
  const cleanTitle = (title || '').trim();
  if (!cleanTitle && !imageUrl) {
    throw new Error('יש לספק כותרת או תמונה');
  }

  // Check if an identical imageUrl or identical title already exists in repository to merge instead of duplicating
  const existingMatch = cachedUserImages.find(i => 
    (id && i.id === id) ||
    (imageUrl && i.imageUrl === imageUrl && !imageUrl.startsWith('data:image/svg')) ||
    (cleanTitle && i.title && toCanonicalKey(i.title) === toCanonicalKey(cleanTitle))
  );

  // Parse keywords: ensure array of clean trimmed strings, merged with existing if updating
  let parsedKeywords = [];
  if (Array.isArray(keywords)) {
    parsedKeywords = keywords.map(k => String(k).trim()).filter(Boolean);
  } else if (typeof keywords === 'string') {
    parsedKeywords = keywords
      .split(/[,;\n]+/)
      .map(k => k.trim())
      .filter(Boolean);
  }
  if (existingMatch && Array.isArray(existingMatch.keywords)) {
    for (const ek of existingMatch.keywords) {
      if (ek && !parsedKeywords.includes(ek)) parsedKeywords.push(ek);
    }
  }

  // Merge associated full task phrases (e.g. "לקנות שוקולית", "שיעור נהיגה מחר ב10")
  const mergedTasks = Array.from(new Set([
    ...(Array.isArray(associatedTasks) ? associatedTasks.map(t => String(t).trim()).filter(Boolean) : []),
    ...(Array.isArray(existingMatch?.associatedTasks) ? existingMatch.associatedTasks : [])
  ]));

  const maxWords = (isUserApproved || existingMatch?.isUserApproved || source === 'user_positive_feedback' || source === 'user_liked_web') ? 6 : 4;

  // Clean keywords: extract significant tokens from multi-word phrases so stop words don't crowd out real anchors
  const cleanList = [];
  for (const raw of parsedKeywords) {
    const str = String(raw).trim();
    if (!str) continue;
    if (toCanonicalKey(str) === toCanonicalKey(cleanTitle)) continue;
    if (str.includes(' ')) {
      const sigParts = extractSignificantTokens(str).filter(p => p.length > 1 && !p.includes('-') && !/^\d+$/.test(p));
      for (const p of sigParts) {
        if (toCanonicalKey(p) === toCanonicalKey(cleanTitle)) continue;
        if (!cleanList.includes(p) && cleanList.length < maxWords) {
          cleanList.push(p);
        }
      }
    } else {
      if (!cleanList.includes(str) && cleanList.length < maxWords) {
        cleanList.push(str);
      }
    }
  }
  parsedKeywords = cleanList.slice(0, maxWords);

  // Optimize image if it's a huge base64 or blob (target lean ~800px / 80% quality)
  let finalImageUrl = imageUrl || existingMatch?.imageUrl || '';
  if (finalImageUrl && finalImageUrl.startsWith('data:image') && finalImageUrl.length > 300000) {
    try {
      finalImageUrl = await optimizeImage(finalImageUrl, 800, 800, 0.80);
    } catch (_) {}
  }

  const imageId = existingMatch?.id || id || `user_img_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = Date.now();
  const savedContributor = (uploaderName || existingMatch?.uploaderName || (typeof localStorage !== 'undefined' ? localStorage.getItem('lifequest_contributor_name') : '') || 'משתמש').trim();

  const record = {
    id: imageId,
    title: cleanTitle || existingMatch?.title || 'תמונה ללא שם',
    name: cleanTitle || existingMatch?.name || 'תמונה ללא שם', // for backward compatibility with catalog
    imageUrl: finalImageUrl,
    keywords: parsedKeywords,
    associatedTasks: mergedTasks,
    caption: (caption || existingMatch?.caption || '').trim(),
    domain: domain || existingMatch?.domain || 'general',
    type: 'user_uploaded',
    source: source || existingMatch?.source || 'user_uploaded',
    isUserApproved: Boolean(isUserApproved || existingMatch?.isUserApproved || source === 'user_positive_feedback' || source === 'user_liked_web'),
    qualityScore: Math.max(qualityScore || 95, existingMatch?.qualityScore || 0),
    emoji: emoji || existingMatch?.emoji || '⭐',
    uploaderName: savedContributor,
    updatedAt: now,
    createdAt: existingMatch?.createdAt || now
  };

  sanitizeUserRecord(record);

  // Update in-memory cache immediately
  const existingIdx = cachedUserImages.findIndex(i => i.id === imageId);
  if (existingIdx >= 0) {
    cachedUserImages[existingIdx] = record;
  } else {
    cachedUserImages.unshift(record);
  }

  // 1. Save to local IndexedDB
  try {
    const localDb = await openDB();
    if (localDb) {
      await new Promise((resolve, reject) => {
        const tx = localDb.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e);
      });
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lifequest_user_images_fallback', JSON.stringify(cachedUserImages));
    }
  } catch (err) {
    console.warn('Error persisting user image locally:', err);
  }

  notifyListeners();

  // 2. Sync to Firebase Firestore cloud database
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, FIRESTORE_COLLECTION, imageId), record);
    } catch (err) {
      console.warn('Error saving to cloud Firestore:', err);
    }
  }

  return record;
}

/**
 * Approve an image after positive user feedback (👍 אהבתי!)
 * 1. Promotes remote/web images to local permanent pool via /api/approve-image (when dev server is running)
 * 2. Saves/merges the image and its task associations into User Image Repository (IndexedDB + Firestore)
 */
export async function approveAndSaveMnemonicImage({
  itemTitle = '',
  associationWord = '',
  coreConcept = '',
  imageUrl = '',
  explanation = '',
  emoji = '⭐',
  domain = 'associative'
}) {
  if (!imageUrl || imageUrl.startsWith('data:image/svg')) return null;

  const cleanTask = String(itemTitle || '').trim();
  const cleanAnchor = String(associationWord || cleanTask || '').trim();
  const cleanConcept = String(coreConcept || '').trim();

  // Extract clean single-word tokens for repository indexing
  const sigTokens = [
    ...extractSignificantTokens(cleanTask),
    ...extractSignificantTokens(cleanAnchor),
    ...(cleanConcept ? extractSignificantTokens(cleanConcept) : [])
  ].filter(Boolean);

  let finalLocalOrRemoteUrl = imageUrl;

  // Attempt to promote to permanent local pool (/staged_images/pool/ + stagedImagesPool.js) via dev server middleware
  try {
    const res = await fetch('/api/approve-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemTitle: cleanTask,
        associationWord: cleanAnchor,
        coreConcept: cleanConcept,
        imageUrl,
        keywords: sigTokens,
        explanation,
        emoji
      })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.localImageUrl) {
        finalLocalOrRemoteUrl = data.localImageUrl;
      }
    }
  } catch (_) {
    // Dev server endpoint not active (e.g. static build), continue with IndexedDB + Firestore persistence
  }

  const savedRecord = await saveUserImage({
    title: cleanAnchor || cleanTask,
    imageUrl: finalLocalOrRemoteUrl,
    keywords: [cleanTask, cleanAnchor, cleanConcept, ...sigTokens].filter(Boolean),
    associatedTasks: [cleanTask, cleanAnchor].filter(Boolean),
    caption: explanation || (cleanTask !== cleanAnchor ? `${cleanTask} ➔ ${cleanAnchor}` : cleanAnchor),
    domain,
    source: 'user_positive_feedback',
    isUserApproved: true,
    qualityScore: 100,
    emoji
  });

  return savedRecord;
}

/**
 * Delete a user image (locally and from cloud)
 */
export async function deleteUserImage(id) {
  if (!id) return;

  cachedUserImages = cachedUserImages.filter(i => i.id !== id);

  try {
    const localDb = await openDB();
    if (localDb) {
      await new Promise((resolve, reject) => {
        const tx = localDb.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e);
      });
    } else {
      localStorage.setItem('lifequest_user_images_fallback', JSON.stringify(cachedUserImages));
    }
  } catch (err) {
    console.warn('Error deleting user image from local DB:', err);
  }

  notifyListeners();

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
    } catch (err) {
      console.warn('Error deleting from cloud Firestore:', err);
    }
  }
}

const DISLIKED_ASSOCIATIONS_KEY = 'lifequest_disliked_associations_v2';
const memoryDislikedAssociations = new Set();

export function getDislikedAssociations() {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(DISLIKED_ASSOCIATIONS_KEY);
      if (saved) return new Set(JSON.parse(saved));
    }
  } catch (_) {}
  return memoryDislikedAssociations;
}

/**
 * בדיקה האם קישור ספציפי בין משימה/נושא לבין תמונה נפסל בעבר על ידי המשתמש.
 * דגש חשוב: הדיסלייק הוא על הקישור (ההקשר), לא על התמונה עצמה!
 * יוסיין בולט יכול להיפסל עבור "נעליים", אך להישאר מועמד מושלם עבור "אימון ריצה".
 */
export function isAssociationDisliked(taskOrConcept, url) {
  if (!taskOrConcept || !url) return false;
  const set = getDislikedAssociations();
  const cTask = toCanonicalKey(taskOrConcept);
  if (!cTask) return false;

  if (set.has(`${cTask}::${url}`)) return true;

  // בדיקת מילים משמעותיות בתוך המשפט (למשל "נעליים" מתוך "לקנות נעליים חדשות")
  const tokens = String(taskOrConcept).split(/[\s,.;:!?\-–—]+/).map(toCanonicalKey).filter(t => t.length >= 3);
  for (const tok of tokens) {
    if (set.has(`${tok}::${url}`)) return true;
  }
  return false;
}

// פונקציית תאימות: אם לא סופק הקשר, לא פוסלים גורפת את התמונה!
export function isImageDisliked(url, taskOrConcept = null) {
  if (!url) return false;
  if (!taskOrConcept) return false; // לעולם לא פוסלים תמונה גלובלית ללא הקשר
  return isAssociationDisliked(taskOrConcept, url);
}

/**
 * פסילת קישור אסוציאטיבי בעקבות דיסלייק (👎)
 * 1. שומר את צמד הנושא+התמונה ברשימת הקישורים הפסולים (הקשר בלבד).
 * 2. מסיר את התמונה מהמאגר המקומי אך ורק אם היא שויכה ספציפית למשימה זו.
 */
export async function dislikeAndRemoveMnemonicImage(imageUrl, taskText = '', associationWord = '') {
  if (!imageUrl) return;

  try {
    const set = getDislikedAssociations();
    if (taskText) {
      set.add(`${toCanonicalKey(taskText)}::${imageUrl}`);
      // חילוץ מילים מרכזיות (למשל "נעליים", "שוקולד", "כדורגל")
      const tokens = String(taskText).split(/[\s,.;:!?\-–—]+/).map(toCanonicalKey).filter(t => t.length >= 3);
      for (const tok of tokens) {
        set.add(`${tok}::${imageUrl}`);
      }
    }
    if (associationWord) {
      set.add(`${toCanonicalKey(associationWord)}::${imageUrl}`);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(DISLIKED_ASSOCIATIONS_KEY, JSON.stringify(Array.from(set)));
    }
  } catch (_) {}

  // הסרה מלאה מהמאגר המקומי ומהזיכרון המשותף של כל מופע של התמונה שנפסלה
  const normTask = toCanonicalKey(taskText);
  const matchingRecords = cachedUserImages.filter(i => 
    i.imageUrl === imageUrl && (
      !taskText ||
      toCanonicalKey(i.title) === normTask ||
      (Array.isArray(i.associatedTasks) && i.associatedTasks.some(t => toCanonicalKey(t) === normTask)) ||
      (Array.isArray(i.keywords) && i.keywords.some(k => toCanonicalKey(k) === normTask))
    )
  );
  for (const rec of matchingRecords) {
    if (rec.id) {
      await deleteUserImage(rec.id);
    }
  }
}

/**
 * Clear all user images
 */
export async function clearAllUserImages() {
  const idsToDelete = cachedUserImages.map(i => i.id);
  cachedUserImages = [];

  try {
    const localDb = await openDB();
    if (localDb) {
      await new Promise((resolve, reject) => {
        const tx = localDb.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = (e) => reject(e);
      });
    }
    localStorage.removeItem('lifequest_user_images_fallback');
  } catch (err) {
    console.warn('Error clearing user images local DB:', err);
  }

  notifyListeners();

  if (isFirebaseConfigured && db) {
    for (const id of idsToDelete) {
      try {
        await deleteDoc(doc(db, FIRESTORE_COLLECTION, id));
      } catch (e) {
        console.warn('Error deleting cloud doc:', e);
      }
    }
  }
}

/**
 * Duplicate Prevention Engine ("כדי לא למחזר"):
 * Checks if a candidate title or list of keywords already exists in the repository.
 * Returns array of matches with matched keywords and the existing item.
 */
export function checkDuplicateAssociations(candidateTitle = '', candidateKeywords = '', excludeId = null) {
  const termsToCheck = [];
  
  if (candidateTitle && candidateTitle.trim()) {
    termsToCheck.push(candidateTitle.trim().toLowerCase());
  }

  let words = [];
  if (Array.isArray(candidateKeywords)) {
    words = candidateKeywords;
  } else if (typeof candidateKeywords === 'string') {
    words = candidateKeywords.split(/[,;\n]+/);
  }

  words.forEach(w => {
    const clean = String(w).trim().toLowerCase();
    if (clean && !termsToCheck.includes(clean)) {
      termsToCheck.push(clean);
    }
  });

  if (termsToCheck.length === 0) return [];

  const duplicates = [];
  const prefixes = ['ה', 'ו', 'ב', 'ל', 'כ', 'מ', 'ש'];

  for (const item of cachedUserImages) {
    if (excludeId && item.id === excludeId) continue;

    const itemTitle = (item.title || '').trim().toLowerCase();
    const itemKeywords = (item.keywords || []).map(k => String(k).trim().toLowerCase());
    const allItemTerms = [itemTitle, ...itemKeywords].filter(Boolean);

    for (const candidate of termsToCheck) {
      let isMatch = false;

      // Exact match
      if (allItemTerms.includes(candidate)) {
        isMatch = true;
      } else {
        // Prefix match (e.g. "השמש" vs "שמש")
        for (const target of allItemTerms) {
          for (const p of prefixes) {
            if (candidate === p + target || target === p + candidate) {
              isMatch = true;
              break;
            }
          }
          if (isMatch) break;
        }
      }

      if (isMatch) {
        if (!duplicates.some(d => d.item.id === item.id)) {
          duplicates.push({
            item,
            matchedWord: candidate
          });
        }
        break;
      }
    }
  }

  return duplicates;
}

/**
 * Subscribe to repository updates
 */
export function subscribeToUserImages(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Subscribe to cloud sync status updates
 */
export function subscribeToCloudStatus(callback) {
  statusListeners.add(callback);
  callback(getCloudSyncStatus());
  return () => statusListeners.delete(callback);
}

function notifyListeners() {
  const snapshot = [...cachedUserImages];
  listeners.forEach(cb => {
    try {
      cb(snapshot);
    } catch (e) {
      console.error(e);
    }
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('lifequest-user-images-changed', { detail: snapshot }));
  }
}

function notifyStatusListeners() {
  const status = getCloudSyncStatus();
  statusListeners.forEach(cb => {
    try {
      cb(status);
    } catch (e) {
      console.error(e);
    }
  });
}

function normalizeHebrewLetters(str) {
  if (!str) return '';
  return str
    .replace(/[״"'`()\[\]{}.,:;!?\-–—\/\\]+/g, '')
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ץ/g, 'צ')
    .replace(/ף/g, 'פ')
    .replace(/ך/g, 'כ');
}

/**
 * Intelligent morphological and semantic Hebrew word matcher.
 * Matches exact words, prefixes (ה, ב, ל, כ, מ, ש, ו), constructs (דמעת <-> דמעה),
/**
 * Common Hebrew stop words that should NEVER match alone in multi-word queries
 */
export const HEBREW_STOP_WORDS = new Set([
  'של', 'את', 'עם', 'על', 'אל', 'כל', 'זה', 'זו', 'אלה', 'אלו', 'רק', 'עוד', 'יותר', 'כדי', 'כמו',
  'לפני', 'אחרי', 'תוך', 'בתוך', 'ליד', 'בין', 'תחת', 'מעל', 'מול', 'הרבה', 'קצת', 'שם', 'פה', 'כאן',
  'היה', 'יהיה', 'היו', 'יש', 'אין', 'שוב', 'גם', 'איך', 'כי', 'אם', 'אבל', 'אך', 'או', 'עד', 'מתי',
  'למה', 'איפה', 'מי', 'מה', 'לעשות', 'ללכת', 'לנסוע', 'לבוא', 'לקחת', 'לתת', 'לראות', 'לשמוע'
].map(normalizeHebrewLetters));

/**
 * Generic container nouns that should NEVER match on their own if the query has other words
 */
export const HEBREW_GENERIC_CONTAINER_NOUNS = new Set([
  'בית', 'איש', 'אשה', 'אישה', 'מקום', 'דבר', 'דברים', 'חדר', 'יום', 'מבנה'
]);

/**
 * Compound terms (סמיכות וביטויים מורכבים) with their semantic concept expansions
 */
export const HEBREW_COMPOUNDS_MAP = [
  { phrase: 'בית חולים', expansion: ['בית חולים', 'מרפאה', 'רופא', 'סטטוסקופ'] },
  { phrase: 'בתי חולים', expansion: ['בית חולים', 'מרפאה', 'רופא', 'סטטוסקופ'] },
  { phrase: 'קופת חולים', expansion: ['קופת חולים', 'מרפאה', 'רופא', 'סטטוסקופ'] },
  { phrase: 'רופא שיניים', expansion: ['שיניים', 'שיננית', 'דרקולה'] },
  { phrase: 'רופאת שיניים', expansion: ['שיניים', 'שיננית', 'דרקולה'] },
  { phrase: 'בדיקת דם', expansion: ['דם', 'בדיקה', 'מחט', 'מעבדה'] },
  { phrase: 'תחנת דלק', expansion: ['דלק', 'מכונית', 'משאבה'] },
  { phrase: 'חדר כושר', expansion: ['משקולת', 'אימון', 'כושר', 'ספורט'] },
  { phrase: 'בית ספר', expansion: ['ספר', 'מחברת', 'לימודים', 'מורה'] },
  { phrase: 'בית מרקחת', expansion: ['תרופות', 'כדורים', 'מרפאה', 'בית חולים'] },
  { phrase: 'תחנת משטרה', expansion: ['משטרה', 'שוטר', 'ניידת'] },
  { phrase: 'מכבי אש', expansion: ['אש', 'כבאית'] },
  { phrase: 'לוחמי אש', expansion: ['אש', 'כבאית'] },
  { phrase: 'חשבון חשמל', expansion: ['חשבון', 'כסף', 'תשלום'] },
  { phrase: 'חשבון מים', expansion: ['חשבון', 'כסף', 'תשלום'] },
  { phrase: 'חשבון גז', expansion: ['חשבון', 'כסף', 'תשלום'] },
  { phrase: 'חשבון בנק', expansion: ['חשבון', 'כסף', 'בנק'] },
  { phrase: 'כרטיס אשראי', expansion: ['כסף', 'תשלום', 'ארנק'] },
  { phrase: 'קניות בסופר', expansion: ['סופר', 'עגלת קניות', 'קניות'] },
];

/**
 * Special plural mapping where trimming ים causes semantic distortion
 */
const SPECIAL_PLURAL_STEM_MAP = {
  'חולימ': ['חולה'],
  'חולות': ['חולה'],
  'מורימ': ['מורה'],
  'מורות': ['מורה'],
  'שונימ': ['שונה'],
  'שונות': ['שונה'],
  'רוצימ': ['רוצה'],
  'רוצות': ['רוצה'],
  'בונימ': ['בונה'],
  'בונות': ['בונה']
};

/**
 * Check if a text phrase contains a Hebrew compound phrase, accounting for prefixes and definite articles
 * (e.g. "לבית החולים" matches "בית חולים", "ברופא השיניים" matches "רופא שיניים")
 */
export function containsCompoundPhrase(text = '', compoundPhrase = '') {
  if (!text || !compoundPhrase) return false;
  const compWords = compoundPhrase.trim().split(/\s+/).map(normalizeHebrewLetters);
  if (compWords.length === 0) return false;
  const textWords = text.trim().split(/[,\s+./\-]+/).map(normalizeHebrewLetters).filter(Boolean);
  if (textWords.length < compWords.length) return false;

  for (let i = 0; i <= textWords.length - compWords.length; i++) {
    let match = true;
    for (let j = 0; j < compWords.length; j++) {
      const cw = compWords[j];
      let tw = textWords[i + j];
      while (tw.length > cw.length && ['ל', 'ב', 'מ', 'ה', 'ו'].includes(tw[0])) {
        tw = tw.slice(1);
      }
      if (tw !== cw) {
        match = false;
        break;
      }
    }
    if (match) return true;
  }
  return false;
}

/**
 * Extract significant words/tokens from a search query, stripping stop words and generic container nouns
 * (שומר על מילים שלמות בעברית, ללא קיצוץ אותיות שורש כמו כ' או ש', וללא שמות פרטיים או פעלים ארעיים!)
 */
export function extractSignificantTokens(phrase = '') {
  if (!phrase) return [];
  const raw = String(phrase).trim();
  
  const BANNED_PERSON_AND_VERBS = new Set([
    'אמיר', 'יהושוע', 'יהושע', 'אמיתי', 'יוסי', 'דני', 'רונה', 'שרה', 'אברהם',
    'יום', 'ביום', 'רביעי', 'חמישי', 'שלישי', 'שני', 'ראשון', 'שישי', 'שבת',
    'להחזיר', 'החזיר', 'להביא', 'הביא', 'לקנות', 'קנה', 'קנות', 'לרכוש', 'רכש', 'רכוש',
    'לקחת', 'לקח', 'למסור', 'מסר', 'לסדר', 'סידר', 'לנקות', 'ניקה', 'לשטוף', 'שטף',
    'לכנס', 'כנס', 'השתתף', 'להשתתף', 'בטורניר', 'טורניר', 'לצבור', 'צבר', 'צבור', 'לשחות', 'שחה', 'שחות',
    'לשחק', 'שיחק', 'שחק', 'לטפס', 'טיפס', 'טפס', 'לנסוע', 'נסע', 'לטייל', 'טייל', 'לרדת', 'ירד',
    'לצאת', 'יצא', 'להזמין', 'הזמין', 'לבדוק', 'בדק', 'לתת', 'נתן', 'לעזור', 'עזר'
  ]);

  const rawTokens = raw.split(/[,\s+./\-–—!?()[\]{}'"]+/).filter(w => w.length > 1);
  const result = [];

  // Check compound terms first (accounting for prefixes like לבית החולים)
  for (const cmp of HEBREW_COMPOUNDS_MAP) {
    if (containsCompoundPhrase(raw, cmp.phrase)) {
      for (const exp of cmp.expansion) {
        if (!result.includes(exp)) result.push(exp);
      }
    }
  }

  for (const tok of rawTokens) {
    const cleanTok = tok.trim();
    if (!cleanTok || cleanTok.length < 2) continue;
    if (BANNED_PERSON_AND_VERBS.has(cleanTok)) continue;
    if (HEBREW_STOP_WORDS.has(cleanTok)) continue;

    // Remove single 'ה' or 'ו' prefix ONLY if word is long enough and not a root letter
    let base = cleanTok;
    if ((cleanTok.startsWith('ה') || cleanTok.startsWith('ו')) && cleanTok.length >= 4) {
      const stripped = cleanTok.slice(1);
      if (!BANNED_PERSON_AND_VERBS.has(stripped) && !HEBREW_STOP_WORDS.has(stripped)) {
        base = stripped;
      }
    }
    // לעולם לא לקצוץ אותיות כ', ש', ב', מ', ל' משורש מילה (כמו כדורגל, שוקולד, בייבלייד, מגן, ליאו)!

    if (BANNED_PERSON_AND_VERBS.has(base) || HEBREW_STOP_WORDS.has(base)) continue;
    if (HEBREW_GENERIC_CONTAINER_NOUNS.has(base)) continue;

    if (!result.includes(base)) result.push(base);
  }

  return result.length > 0 ? result : rawTokens.filter(t => !BANNED_PERSON_AND_VERBS.has(t));
}

/**
 * Intelligent morphological and semantic Hebrew word matcher.
 * Matches exact words, prefixes (ה, ב, ל, כ, מ, ש, ו), constructs (דמעת <-> דמעה),
 * plurals (דמעות <-> דמעה, מרקים <-> מרק, טלפונים <-> טלפון), with full protection
 * against false collisions (e.g. חולים vs חול, or לבית החולים vs בית האופרה).
 */
export function hebrewWordMatches(searchWord = '', targetText = '') {
  if (!searchWord || !targetText) return false;
  
  const rawSearch = String(searchWord).trim().toLowerCase();
  const rawTarget = String(targetText).trim().toLowerCase();
  if (!rawSearch) return false;

  const normSearch = normalizeHebrewLetters(rawSearch);
  const normTarget = normalizeHebrewLetters(rawTarget);

  if (normSearch === normTarget) return true;

  // Strict guard: 'חול' (sand) and 'חולים' (patients) NEVER match!
  if ((normSearch === 'חול' && (normTarget === 'חולימ' || normTarget === 'חולים')) ||
      ((normSearch === 'חולימ' || normSearch === 'חולים') && normTarget === 'חול')) {
    return false;
  }

  // Check if one exact phrase contains the other (e.g. "בית חולים" in "לנסוע לבית חולים")
  if (normSearch.length >= 6 && normTarget.length >= 6) {
    if (normTarget.includes(normSearch) || normSearch.includes(normTarget)) {
      return true;
    }
  }

  // If search phrase contains multiple words:
  // ONLY allow match if the head noun (first significant token) matches, or full phrase contains target.
  // NEVER allow secondary adjectives like "זהב", "ירוקה", "עתיקה", "נוצץ" to hijack matches!
  if (rawSearch.includes(' ')) {
    const sigTokens = extractSignificantTokens(rawSearch);
    if (sigTokens.length > 0) {
      const headNoun = sigTokens[0];
      if (headNoun && !headNoun.includes(' ') && hebrewWordMatches(headNoun, rawTarget)) {
        return true;
      }
    }
    return false;
  }

  // If target has multiple words, prevent matching if the only match is a generic container noun (e.g. "בית")
  if (rawTarget.includes(' ')) {
    const targetNormTokens = rawTarget.split(/[,\s+./\-]+/).map(normalizeHebrewLetters).filter(Boolean);
    const searchBase = normSearch.startsWith('ל') && normSearch.length >= 4 ? normSearch.slice(1) : normSearch;
    if (HEBREW_GENERIC_CONTAINER_NOUNS.has(searchBase)) {
      // "בית" matching "בית האופרה של סידני" is NOT allowed unless exact full title!
      return false;
    }
  }

  const targetTokens = rawTarget.split(/[,\s+./]+/).filter(Boolean);

  // Common practical everyday root pairings (e.g. מספרה <-> תספורת, לתקן <-> תיקון, שיננית <-> שיניים)
  const rootEquivalents = [
    ['מספרה', 'תספורת'],
    ['מספרה', 'ספר'],
    ['תספורת', 'ספר'],
    ['לתקן', 'תיקון'],
    ['לתקן', 'תיקונים'],
    ['שיננית', 'שיניים'],
    ['רופא', 'מרפאה'],
    ['רופא', 'רפואה'],
    ['מכונית', 'רכב'],
    ['אוטו', 'רכב'],
    ['לצלוע', 'מרפאה'],
    ['צליעה', 'מרפאה']
  ];
  for (const [w1, w2] of rootEquivalents) {
    const n1 = normalizeHebrewLetters(w1);
    const n2 = normalizeHebrewLetters(w2);
    if (normSearch === n1 && targetTokens.some(t => normalizeHebrewLetters(t) === n2)) return true;
    if (normSearch === n2 && targetTokens.some(t => normalizeHebrewLetters(t) === n1)) return true;
  }

  // Search prefixes
  const searchPrefixes = ['וה', 'שב', 'של', 'מה', 'וכ', 'וב', 'ול', 'ה', 'ו', 'ב', 'ל', 'כ', 'ש'];

  // Search variants (in normalized form)
  const searchVariants = new Set([normSearch]);
  
  for (const p of searchPrefixes) {
    const normP = normalizeHebrewLetters(p);
    if (normSearch.startsWith(normP) && normSearch.length - normP.length >= 3) {
      searchVariants.add(normSearch.slice(normP.length));
    }
  }

  // Construct ending ה <-> ת (דמעה <-> דמעת)
  if (normSearch.endsWith('ה') && normSearch.length >= 3) {
    searchVariants.add(normSearch.slice(0, -1) + 'ת');
    searchVariants.add(normSearch.slice(0, -1) + 'ות');
  }
  if (normSearch.endsWith('ת') && normSearch.length >= 3) {
    searchVariants.add(normSearch.slice(0, -1) + 'ה');
    searchVariants.add(normSearch.slice(0, -1) + 'ות');
  }
  if (normSearch.endsWith('ות') && normSearch.length >= 4) {
    if (SPECIAL_PLURAL_STEM_MAP[normSearch]) {
      for (const s of SPECIAL_PLURAL_STEM_MAP[normSearch]) searchVariants.add(s);
    } else {
      searchVariants.add(normSearch.slice(0, -2) + 'ה');
      searchVariants.add(normSearch.slice(0, -2) + 'ת');
      searchVariants.add(normSearch.slice(0, -2));
    }
  }
  if (normSearch.endsWith('ימ') && normSearch.length >= 4) { // ים normalized is ימ
    if (SPECIAL_PLURAL_STEM_MAP[normSearch]) {
      for (const s of SPECIAL_PLURAL_STEM_MAP[normSearch]) searchVariants.add(s);
    } else {
      searchVariants.add(normSearch.slice(0, -2));
    }
  }

  // Check each token in target
  for (const rawToken of targetTokens) {
    const normToken = normalizeHebrewLetters(rawToken);
    if (!normToken) continue;

    if (searchVariants.has(normToken)) return true;

    // Prefixes on target token: ONLY definite article 'ה' or conjunction 'ו'
    const targetAllowedPrefixes = ['וה', 'ה', 'ו'];
    for (const p of targetAllowedPrefixes) {
      const normP = normalizeHebrewLetters(p);
      if (normToken.startsWith(normP) && normToken.length - normP.length >= 3) {
        const stripped = normToken.slice(normP.length);
        if (searchVariants.has(stripped)) return true;
      }
    }

    // Morphology on target token
    if (normToken.endsWith('ת') && normToken.length >= 3) {
      if (searchVariants.has(normToken.slice(0, -1) + 'ה')) return true;
    }
    if (normToken.endsWith('ות') && normToken.length >= 4) {
      if (SPECIAL_PLURAL_STEM_MAP[normToken]) {
        if (SPECIAL_PLURAL_STEM_MAP[normToken].some(s => searchVariants.has(s))) return true;
      } else {
        if (searchVariants.has(normToken.slice(0, -2) + 'ה')) return true;
        if (searchVariants.has(normToken.slice(0, -2) + 'ת')) return true;
        if (searchVariants.has(normToken.slice(0, -2))) return true;
      }
    }
    if (normToken.endsWith('ימ') && normToken.length >= 4) {
      if (SPECIAL_PLURAL_STEM_MAP[normToken]) {
        if (SPECIAL_PLURAL_STEM_MAP[normToken].some(s => searchVariants.has(s))) return true;
      } else {
        if (searchVariants.has(normToken.slice(0, -2))) return true;
      }
    }

    // Stem / Plural match (e.g. משקפיים <-> משקפי, פטריות <-> פטריה, כדורסל <-> כדור)
    // Guard against false matches between different words: require length difference <= 3
    if (normSearch.length >= 4 && normToken.length >= 4) {
      const lenDiff = Math.abs(normToken.length - normSearch.length);
      if (lenDiff <= 3 && (normToken.startsWith(normSearch) || normSearch.startsWith(normToken))) {
        // Disallow חול / חולים collision in stem matching
        if ((normSearch === 'חול' && normToken.startsWith('חולי')) ||
            (normToken === 'חול' && normSearch.startsWith('חולי'))) {
          continue;
        }
        return true;
      }
    }
  }

  return false;
}

/**
 * Search user repository for an image matching a keyword or association
 * Return item or null
 */
export function findUserImageByKeyword(word = '') {
  if (!word || !cachedUserImages.length) return null;
  const clean = String(word).trim().toLowerCase();

  // Order user images so positively-approved images (isUserApproved) take highest priority
  const ordered = [...cachedUserImages].sort((a, b) => (b.isUserApproved ? 1 : 0) - (a.isUserApproved ? 1 : 0));

  // 1. Exact title or associated task match (highest certainty)
  for (const item of ordered) {
    if (item.title && item.title.trim().toLowerCase() === clean) {
      return item;
    }
    if (Array.isArray(item.associatedTasks) && item.associatedTasks.some(t => String(t).trim().toLowerCase() === clean)) {
      return item;
    }
  }

  // 2. High-precision semantic & morphological Hebrew match across titles and associatedTasks ONLY
  for (const item of ordered) {
    if (item.title && hebrewWordMatches(clean, item.title)) {
      return item;
    }
    if (Array.isArray(item.associatedTasks)) {
      for (const task of item.associatedTasks) {
        if (hebrewWordMatches(clean, task)) {
          return item;
        }
      }
    }
  }

  // 3. User-approved custom items only: check primary keywords with strict equality
  for (const item of ordered) {
    if (item.isUserApproved && Array.isArray(item.keywords)) {
      for (const kw of item.keywords) {
        const cleanKw = String(kw).trim().toLowerCase();
        if (cleanKw === clean || (clean.length >= 4 && cleanKw.length >= 4 && hebrewWordMatches(clean, cleanKw))) {
          return item;
        }
      }
    }
  }

  // Leaps and random character associations are permanently disabled to avoid
  // irrelevant pop-culture figures (Steve Jobs, Gollum, Yoda) hijacking tasks!
  return null;
}



