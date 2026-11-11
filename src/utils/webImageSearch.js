/**
 * LifeQuest Web Image Search Engine
 * 
 * מבצע חיפוש תמונות רשת פופולריות וישירות בעברית (Open Web / Search Engines)
 * במקום תרגומים עיוורים לאנגלית או מאגרים מרוחקים כמו ויקימדיה.
 */

import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool.js';

// Cache in-memory for fast instant re-use
const SEARCH_CACHE = new Map();

/**
 * מציאת תמונה פופולרית ברשת לפי ביטוי חיפוש בעברית
 * מחזיר עד 5 תוצאות מדורגות
 */
export async function searchPopularWebImages(query, limit = 5, englishQuery = '') {
  if (!query || typeof query !== 'string') return [];
  const cleanQ = query.trim();
  const cleanEn = (englishQuery || '').trim();

  // שער ברזל הרמטי:
  // איסור מוחלט על פנייה לרשת ללא שאילתת צילום קונקרטית ומאומתת באנגלית!
  // שאילתות עבריות במאגרי מדיה בינלאומיים (כמו Commons) מניבות דגימות מינרלים, סלעים או סריקות ארכיון מוזרות.
  if (!cleanEn || cleanEn.length < 3 || /[\u0590-\u05FF]/.test(cleanEn)) {
    return [];
  }

  // סינון ביטויי fallback ושאילתות גנריות
  const isBannedFallback = /חלופה|עוגן|דמות מומחה|פעולה|fallback|alternative/i.test(cleanQ) ||
                           /fallback|alternative|undefined|null/i.test(cleanEn);
  if (isBannedFallback) {
    return [];
  }

  // איסור מוחלט על חיפוש ביטויי משימה גולמיים
  const isRawTaskRegex = /^(ללכת|לקנות|להחזיר|לרכוש|לקחת|לשחק|לעשות|לסדר|לנקות|לצאת|לרדת|לטייל)\b/i;
  if (isRawTaskRegex.test(cleanQ) && cleanEn.length < 4) {
    return [];
  }

  const cacheKey = `${cleanQ}__${cleanEn}`;
  if (SEARCH_CACHE.has(cacheKey)) {
    return SEARCH_CACHE.get(cacheKey);
  }

  let images = [];

  // 1. Try local dev-server endpoint /api/search-image with validated English query
  try {
    const params = new URLSearchParams();
    params.set('q', cleanQ);
    params.set('en', cleanEn);
    const res = await fetch(`/api/search-image?${params.toString()}`, {
      signal: AbortSignal.timeout(6000)
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results) && data.results.length > 0) {
        images = data.results
          .map(r => r.image || r.thumbnail)
          .filter(u => u && typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')))
          .slice(0, limit);
      }
    }
  } catch (_) {}

  // 2. Direct client-side Wikimedia Commons fallback (ONLY with verified cleanEn!)
  if (images.length === 0 && cleanEn) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanEn)}&gsrnamespace=6&gsrlimit=6&prop=pageimages&pithumbsize=800&format=json&origin=*`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const urls = Object.values(pages)
            .map(p => p.thumbnail?.source)
            .filter(u => u && !u.includes('.svg') && !u.includes('.pdf') && !u.includes('.webm'));
          if (urls.length > 0) {
            images = urls.slice(0, limit);
          }
        }
      }
    } catch (_) {}
  }

  if (images.length > 0) {
    SEARCH_CACHE.set(cacheKey, images);
  }

  return images;
}

/**
 * מחזיר את התמונה המובילה
 */
export async function searchTopPopularWebImage(query) {
  const list = await searchPopularWebImages(query, 1);
  return list[0] || null;
}

export default {
  searchPopularWebImages,
  searchTopPopularWebImage
};
