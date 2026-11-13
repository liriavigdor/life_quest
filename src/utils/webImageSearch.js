/**
 * LifeQuest Web Image Search Engine
 * 
 * מבצע חיפוש תמונות רשת פופולריות וישירות בעברית (Open Web / Search Engines)
 * במקום תרגומים עיוורים לאנגלית או מאגרים מרוחקים כמו ויקימדיה.
 */

import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool.js';

// Cache in-memory for fast instant re-use
const SEARCH_CACHE = new Map();

function distillEnglishQuery(rawEn = '') {
  return String(rawEn || '')
    .replace(/\b(photography|photograph|photo|iconic|portrait|classic|vintage|picture|image|high quality|hd|wallpaper|stock|background|isolated)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * מציאת תמונה פופולרית ברשת לפי ביטוי חיפוש בעברית
 * מחזיר עד 5 תוצאות מדורגות
 */
export async function searchPopularWebImages(query, limit = 5, englishQuery = '') {
  if (!query || typeof query !== 'string') return [];
  const cleanQ = query.trim();
  const rawEn = (englishQuery || '').trim();
  const cleanEn = distillEnglishQuery(rawEn) || rawEn;

  // שער ברזל הרמטי:
  // איסור מוחלט על פנייה לרשת ללא שאילתת צילום קונקרטית ומאומתת באנגלית!
  if (!cleanEn || cleanEn.length < 2 || /[\u0590-\u05FF]/.test(cleanEn)) {
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

  const cacheKey = `${cleanQ}__${cleanEn.toLowerCase()}`;
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
      signal: AbortSignal.timeout(7500)
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

  // 2. Client-side Wikipedia Article Lead Photo fallback (תמונת הערך הראשית מויקיפדיה האנגלית והעברית)
  if (images.length === 0 && cleanEn) {
    const fetchWikiLeadPhotos = async (lang, term) => {
      if (!term || term.length < 2) return [];
      try {
        const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=4&prop=pageimages&piprop=thumbnail&pithumbsize=960&format=json&origin=*`;
        const r = await fetch(apiUrl, { signal: AbortSignal.timeout(3500) });
        if (!r.ok) return [];
        const d = await r.json();
        const pages = d.query?.pages ? Object.values(d.query.pages) : [];
        pages.sort((a, b) => (a.index || 99) - (b.index || 99));
        const found = [];
        for (const p of pages) {
          const thumb = p.thumbnail;
          const src = thumb?.source;
          if (!src || !src.includes('/wikipedia/commons/')) continue;
          const tLow = `${p.title || ''} ${src}`.toLowerCase();
          if (/\.svg|\.gif|\.tif|\.pdf|\.djvu|disambig|question_book|icon|logo|flag_of|coat_of_arms|map_of|locator|blank|signature|stamp|book|album/i.test(tLow)) continue;
          const w = Number(thumb.width) || 0;
          const h = Number(thumb.height) || 0;
          if (w < 300 || h < 200) continue;
          const ratio = (w > 0 && h > 0) ? (w / h) : 1.0;
          if (ratio < 0.65 || ratio > 2.4) continue;
          found.push(src);
        }
        return found;
      } catch (_) {
        return [];
      }
    };

    try {
      const words = cleanEn.split(/\s+/).filter(Boolean);
      const searchTerms = [
        words.slice(0, 2).join(' '),
        words[0]
      ].filter(t => t && t.length >= 2);

      const promises = [];
      for (const t of searchTerms) {
        promises.push(fetchWikiLeadPhotos('en', t));
      }
      if (/[\u0590-\u05FF]/.test(cleanQ)) {
        promises.push(fetchWikiLeadPhotos('he', cleanQ));
      }

      const results = await Promise.all(promises);
      const combined = [...new Set(results.flat())];
      if (combined.length > 0) {
        images = combined.slice(0, limit);
      }
    } catch (_) {}
  }

  // 3. Direct client-side Wikimedia Commons fallback (ONLY with verified cleanEn, excluding DJVU/book scans & vertical crops!)
  if (images.length === 0 && cleanEn) {
    try {
      const safeWikiQ = `${cleanEn} -filetype:djvu -filetype:pdf -filetype:tif -filetype:svg -intitle:djvu -intitle:book -intitle:volume -intitle:map`;
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(safeWikiQ)}&gsrnamespace=6&gsrlimit=12&prop=pageimages&pithumbsize=960&format=json&origin=*`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      if (res.ok) {
        const data = await res.json();
        const pages = data.query?.pages;
        if (pages) {
          const urls = Object.values(pages)
            .filter(p => {
              const t = (p.title || '').toLowerCase();
              const w = Number(p.thumbnail?.width) || 0;
              const h = Number(p.thumbnail?.height) || 0;
              const ratio = (w > 0 && h > 0) ? (w / h) : 1.4;
              return (
                w >= 420 &&
                ratio >= 1.05 && ratio <= 2.25 &&
                !/\.djvu|\.pdf|\.tif|\.svg|\.webm|book|volume|page_|ia_|library|archive|scan|catalog|treatise|diagram|map|plaque|gravestone|herbarium/.test(t)
              );
            })
            .map(p => p.thumbnail?.source)
            .filter(u => {
              if (!u) return false;
              const low = u.toLowerCase();
              return !/\.djvu|\.pdf|\.tif|\.svg|\.webm|page1-|ia_|scan|book/.test(low);
            });
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
