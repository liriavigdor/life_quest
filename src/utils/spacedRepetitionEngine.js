/**
 * LifeQuest Spaced Repetition System (SRS) & Active Recall Engine
 * 
 * מנוע שינון מרווח ושליפה פעילה מבוסס מדע הזיכרון (SuperMemo SM-2 & עקומת השכחה של הרמן אבינגהאוס).
 * 
 * עקרונות קוגניטיביים:
 * 1. אפקט הבחינה (Testing Effect / Active Recall): שליפה פעילה מתוך המוח מחזקת את הקשרים הסינפטיים פי 4 מקריאה פסיבית.
 * 2. מרווחים אופטימליים (Optimal Intervals): חזרה על המידע בדיוק ברגע שהוא עומד להישכח.
 * 3. קושי רצוי (Desirable Difficulty): הסתרת התשובה והצגת רמזים מדורגים בלבד לפני החשיפה.
 */

const STORAGE_KEY = 'lifequest_srs_records_v1';
const DEFAULT_EASE_FACTOR = 2.5;
const MINIMUM_EASE_FACTOR = 1.3;

/**
 * דירוגי שליפה פעילה סטנדרטיים (Ratings)
 */
export const SRS_RATINGS = {
  AGAIN: 'again', // 1: שכחתי לגמרי - חזרה מיידית / תוך יום
  HARD: 'hard',   // 2: זכרתי בקושי רב / בעזרת רמזים כבדים
  GOOD: 'good',   // 3: זכרתי בהצלחה לאחר מאמץ מחשבתי תקין
  EASY: 'easy'    // 4: שליפה מיידית, חלקה וללא מאמץ
};

/**
 * טעינת כל רשומות ה-SRS השמורות
 */
export function getAllSrsRecords() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to load SRS records:', err);
  }
  return {};
}

/**
 * שמירת רשומות ה-SRS
 */
export function saveAllSrsRecords(records) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch (err) {
    console.warn('Failed to save SRS records:', err);
  }
}

/**
 * יצירת מזהה קנוני עקבי לתחנה / משימה
 */
export function getCanonicalItemKey(item) {
  if (!item) return 'station_unknown';
  const title = (item.title || item.taskTitle || item.name || '').trim().toLowerCase();
  const anchor = (item.associationWord || item.anchorName || '').trim().toLowerCase();
  return `${title}__${anchor}`.replace(/[^\w\u0590-\u05FF]+/g, '_');
}

/**
 * שליפת רשומת הזיכרון של פריט מסוים
 */
export function getItemSrsRecord(item) {
  const key = getCanonicalItemKey(item);
  const all = getAllSrsRecords();
  if (all[key]) return all[key];

  // רשומת ברירת מחדל לפריט חדש
  return {
    key,
    taskTitle: item.title || item.name || '',
    anchorName: item.associationWord || item.anchorName || '',
    repetition: 0,
    intervalDays: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    lastReviewedAt: null,
    nextReviewDue: new Date().toISOString(), // חדש = מוכן לשליפה ראשונית
    history: []
  };
}

/**
 * חישוב חוזק הזיכרון הנוכחי (Retention Score 0-100%) לפי עקומת אבינגהאוס
 * R = e^(-t / S)
 * כאשר:
 * t = הזמן שחלף בימים מאז הבדיקה האחרונה
 * S = יציבות הזיכרון (Stability בימים, נגזרת מ-intervalDays ו-easeFactor)
 */
export function calculateRetentionScore(record) {
  if (!record || !record.lastReviewedAt || record.repetition === 0) {
    return 100; // פריט חדש שזה עתה עוגן נחשב בזיכרון עבודה פעיל
  }

  const now = Date.now();
  const lastRev = new Date(record.lastReviewedAt).getTime();
  const elapsedDays = Math.max(0, (now - lastRev) / (1000 * 60 * 60 * 24));

  // יציבות הזיכרון בימים
  const stabilityDays = Math.max(0.5, record.intervalDays * (record.easeFactor / 2.0));

  // חישוב עקומת הדעיכה האקספוננציאלית
  const retentionFraction = Math.exp(-elapsedDays / stabilityDays);
  const retentionScore = Math.round(retentionFraction * 100);

  return Math.min(100, Math.max(0, retentionScore));
}

/**
 * האם הגיע מועד החזרה עבור הפריט? (Is Review Due)
 */
export function isItemDueForReview(item) {
  const record = getItemSrsRecord(item);
  if (!record.nextReviewDue) return true;
  return new Date(record.nextReviewDue).getTime() <= Date.now();
}

/**
 * עיבוד ביקורת שליפה פעילה ועדכון אלגוריתם SM-2
 * 
 * @param {Object} item פריט המשימה / התחנה בארמון
 * @param {string} rating אחת מתוך SRS_RATINGS: again, hard, good, easy
 * @returns {Object} רשומת ה-SRS המעודכנת
 */
export function processSrsReview(item, rating = SRS_RATINGS.GOOD) {
  const current = getItemSrsRecord(item);
  const now = new Date();

  let nextRepetition = current.repetition;
  let nextIntervalDays = current.intervalDays;
  let nextEase = current.easeFactor;

  switch (rating) {
    case SRS_RATINGS.AGAIN: {
      // שכחתי: איפוס החזרות, חזרה בעוד 10 דקות (מוגדר כ-0.01 ימים)
      nextRepetition = 0;
      nextIntervalDays = 1;
      nextEase = Math.max(MINIMUM_EASE_FACTOR, nextEase - 0.2);
      break;
    }

    case SRS_RATINGS.HARD: {
      // קשה: עלייה מתונה במרווח, ירידה קלה ב-ease
      nextRepetition += 1;
      nextIntervalDays = nextRepetition === 1 ? 1 : Math.max(2, Math.round(nextIntervalDays * 1.2));
      nextEase = Math.max(MINIMUM_EASE_FACTOR, nextEase - 0.15);
      break;
    }

    case SRS_RATINGS.GOOD: {
      // טוב: עלייה סטנדרטית לפי ה-Ease Factor
      nextRepetition += 1;
      if (nextRepetition === 1) {
        nextIntervalDays = 1;
      } else if (nextRepetition === 2) {
        nextIntervalDays = 3;
      } else {
        nextIntervalDays = Math.round(nextIntervalDays * nextEase);
      }
      break;
    }

    case SRS_RATINGS.EASY: {
      // קל במיוחד: קפיצה משמעותית במרווח ועלייה ב-Ease
      nextRepetition += 1;
      if (nextRepetition === 1) {
        nextIntervalDays = 3;
      } else if (nextRepetition === 2) {
        nextIntervalDays = 7;
      } else {
        nextIntervalDays = Math.round(nextIntervalDays * nextEase * 1.35);
      }
      nextEase = Math.min(3.0, nextEase + 0.15);
      break;
    }

    default:
      break;
  }

  // חישוב תאריך היעד הבא
  const nextDueDate = new Date(now.getTime() + (nextIntervalDays * 24 * 60 * 60 * 1000));

  const updatedRecord = {
    ...current,
    repetition: nextRepetition,
    intervalDays: nextIntervalDays,
    easeFactor: Number(nextEase.toFixed(2)),
    lastReviewedAt: now.toISOString(),
    nextReviewDue: nextDueDate.toISOString(),
    history: [
      ...(current.history || []).slice(-20), // שמירת 20 אירועים אחרונים למניעת ניפוח
      {
        timestamp: now.toISOString(),
        rating,
        intervalDays: nextIntervalDays,
        easeFactor: nextEase
      }
    ]
  };

  // שמירה בדיסק / LocalStorage
  const all = getAllSrsRecords();
  all[updatedRecord.key] = updatedRecord;
  saveAllSrsRecords(all);

  return updatedRecord;
}

/**
 * קבלת תווית סטטוס זיכרון ויזואלית לתצוגה
 */
export function getRetentionVisualBadge(item) {
  const record = getItemSrsRecord(item);
  const retention = calculateRetentionScore(record);
  const isDue = isItemDueForReview(item);

  if (isDue && record.repetition > 0) {
    return {
      status: 'due',
      label: 'מועד לשליפה! 🔔',
      color: '#f59e0b',
      glow: '0 0 14px rgba(245, 158, 11, 0.7)',
      borderColor: '#f59e0b',
      retention
    };
  }

  if (retention >= 80) {
    return {
      status: 'mastered',
      label: 'מקובע היטב 🌟',
      color: '#10b981',
      glow: '0 0 12px rgba(16, 185, 129, 0.6)',
      borderColor: '#10b981',
      retention
    };
  }

  if (retention >= 50) {
    return {
      status: 'learning',
      label: 'בתהליך שינון 🌿',
      color: '#3b82f6',
      glow: '0 0 8px rgba(59, 130, 246, 0.4)',
      borderColor: '#3b82f6',
      retention
    };
  }

  return {
    status: 'fading',
    label: 'זקוק לחיזוק ⏳',
    color: '#ef4444',
    glow: '0 0 10px rgba(239, 68, 68, 0.5)',
    borderColor: '#ef4444',
    retention
  };
}
