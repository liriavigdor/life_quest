// Story Parser & Semantic Analyzer for LifeQuest
// Analyzes user story text (Hebrew/English) into a cohesive multi-layered visual scene:
// Terrain, Weather, Primary Subject, Companion Props, Colors, and AI Generation Prompts.

const HEBREW_SEMANTIC_LEXICON = {
  // Animals & Creatures
  'חתול': { en: 'cat', category: 'creature', emoji: '🐱', color: '#f59e0b', defaultCompanion: 'umbrella' },
  'חתלתול': { en: 'kitten', category: 'creature', emoji: '🐱', color: '#f59e0b', defaultCompanion: 'umbrella' },
  'חתולים': { en: 'cat', category: 'creature', emoji: '🐱', color: '#f59e0b', defaultCompanion: 'umbrella' },
  'כלב': { en: 'dog', category: 'creature', emoji: '🐶', color: '#d97706', defaultCompanion: 'bone' },
  'גור': { en: 'puppy', category: 'creature', emoji: '🐶', color: '#d97706', defaultCompanion: 'ball' },
  'כלבים': { en: 'dog', category: 'creature', emoji: '🐶', color: '#d97706', defaultCompanion: 'bone' },
  'ציפור': { en: 'bird', category: 'creature', emoji: '🐦', color: '#38bdf8', defaultCompanion: 'nest' },
  'יונה': { en: 'dove', category: 'creature', emoji: '🕊️', color: '#f8fafc', defaultCompanion: 'branch' },
  'נשר': { en: 'eagle', category: 'creature', emoji: '🦅', color: '#78350f', defaultCompanion: 'mountain' },
  'סוס': { en: 'horse', category: 'creature', emoji: '🐴', color: '#92400e', defaultCompanion: 'horseshoe' },
  'דרקון': { en: 'dragon', category: 'creature', emoji: '🐉', color: '#ef4444', defaultCompanion: 'flame' },
  'דג': { en: 'fish', category: 'creature', emoji: '🐟', color: '#06b6d4', defaultCompanion: 'bubbles' },
  'דגים': { en: 'fish', category: 'creature', emoji: '🐟', color: '#06b6d4', defaultCompanion: 'coral' },
  'לוויתן': { en: 'whale', category: 'creature', emoji: '🐋', color: '#0284c7', defaultCompanion: 'wave' },
  'דולפין': { en: 'dolphin', category: 'creature', emoji: '🐬', color: '#38bdf8', defaultCompanion: 'wave' },
  'פרפר': { en: 'butterfly', category: 'creature', emoji: '🦋', color: '#ec4899', defaultCompanion: 'flower' },
  'דבורה': { en: 'bee', category: 'creature', emoji: '🐝', color: '#facc15', defaultCompanion: 'honey' },
  'אריה': { en: 'lion', category: 'creature', emoji: '🦁', color: '#eab308', defaultCompanion: 'crown' },
  'דוב': { en: 'bear', category: 'creature', emoji: '🐻', color: '#78350f', defaultCompanion: 'honey' },
  'זאב': { en: 'wolf', category: 'creature', emoji: '🐺', color: '#94a3b8', defaultCompanion: 'moon' },
  'צב': { en: 'turtle', category: 'creature', emoji: '🐢', color: '#22c55e', defaultCompanion: 'shell' },
  'ארנב': { en: 'rabbit', category: 'creature', emoji: '🐰', color: '#fbcfe8', defaultCompanion: 'carrot' },
  'שועל': { en: 'fox', category: 'creature', emoji: '🦊', color: '#ea580c', defaultCompanion: 'berries' },
  'פיל': { en: 'elephant', category: 'creature', emoji: '🐘', color: '#94a3b8', defaultCompanion: 'peanut' },
  'ינשוף': { en: 'owl', category: 'creature', emoji: '🦉', color: '#a16207', defaultCompanion: 'moon' },

  // Objects, Tools & Artifacts
  'ספר': { en: 'book', category: 'artifact', emoji: '📖', color: '#3b82f6', defaultCompanion: 'candle' },
  'ספרים': { en: 'books', category: 'artifact', emoji: '📚', color: '#3b82f6', defaultCompanion: 'glasses' },
  'מכתב': { en: 'letter', category: 'artifact', emoji: '✉️', color: '#f59e0b', defaultCompanion: 'feather' },
  'יומן': { en: 'journal', category: 'artifact', emoji: '📓', color: '#8b5cf6', defaultCompanion: 'quill' },
  'חרב': { en: 'sword', category: 'artifact', emoji: '⚔️', color: '#cbd5e1', defaultCompanion: 'shield' },
  'מגן': { en: 'shield', category: 'artifact', emoji: '🛡️', color: '#3b82f6', defaultCompanion: 'sword' },
  'קשת': { en: 'bow', category: 'artifact', emoji: '🏹', color: '#d97706', defaultCompanion: 'arrow' },
  'חץ': { en: 'arrow', category: 'artifact', emoji: '🎯', color: '#ef4444', defaultCompanion: 'target' },
  'מפתח': { en: 'key', category: 'artifact', emoji: '🗝️', color: '#eab308', defaultCompanion: 'lock' },
  'מנעול': { en: 'lock', category: 'artifact', emoji: '🔒', color: '#64748b', defaultCompanion: 'key' },
  'כספת': { en: 'chest', category: 'artifact', emoji: '📦', color: '#b45309', defaultCompanion: 'gem' },
  'תיבה': { en: 'chest', category: 'artifact', emoji: '🧰', color: '#92400e', defaultCompanion: 'gold' },
  'שעון': { en: 'clock', category: 'artifact', emoji: '⏰', color: '#06b6d4', defaultCompanion: 'gear' },
  'שעון-חול': { en: 'hourglass', category: 'artifact', emoji: '⏳', color: '#f59e0b', defaultCompanion: 'sand' },
  'מצפן': { en: 'compass', category: 'artifact', emoji: '🧭', color: '#10b981', defaultCompanion: 'map' },
  'מנורה': { en: 'lamp', category: 'artifact', emoji: '🏮', color: '#facc15', defaultCompanion: 'light' },
  'פנס': { en: 'lantern', category: 'artifact', emoji: '🔦', color: '#fde047', defaultCompanion: 'stars' },
  'נר': { en: 'candle', category: 'artifact', emoji: '🕯️', color: '#f59e0b', defaultCompanion: 'book' },
  'לפיד': { en: 'torch', category: 'artifact', emoji: '🔥', color: '#ef4444', defaultCompanion: 'flame' },
  'גיטרה': { en: 'guitar', category: 'artifact', emoji: '🎸', color: '#f97316', defaultCompanion: 'music-note' },
  'כינור': { en: 'violin', category: 'artifact', emoji: '🎻', color: '#b45309', defaultCompanion: 'music' },
  'פסנתר': { en: 'piano', category: 'artifact', emoji: '🎹', color: '#1e293b', defaultCompanion: 'music' },
  'מוזיקה': { en: 'music', category: 'artifact', emoji: '🎶', color: '#8b5cf6', defaultCompanion: 'notes' },
  'כתר': { en: 'crown', category: 'artifact', emoji: '👑', color: '#facc15', defaultCompanion: 'gem' },
  'טבעת': { en: 'ring', category: 'artifact', emoji: '💍', color: '#38bdf8', defaultCompanion: 'sparkles' },
  'יהלום': { en: 'diamond', category: 'artifact', emoji: '💎', color: '#38bdf8', defaultCompanion: 'sparkles' },
  'קריסטל': { en: 'crystal', category: 'artifact', emoji: '🔮', color: '#a855f7', defaultCompanion: 'runes' },
  'גביע': { en: 'trophy', category: 'artifact', emoji: '🏆', color: '#eab308', defaultCompanion: 'medal' },
  'מדליה': { en: 'medal', category: 'artifact', emoji: '🥇', color: '#f59e0b', defaultCompanion: 'trophy' },
  'משקפיים': { en: 'glasses', category: 'artifact', emoji: '👓', color: '#0284c7', defaultCompanion: 'book' },
  'טלסקופ': { en: 'telescope', category: 'artifact', emoji: '🔭', color: '#6366f1', defaultCompanion: 'stars' },
  'מצלמה': { en: 'camera', category: 'artifact', emoji: '📷', color: '#64748b', defaultCompanion: 'photo' },
  'מפה': { en: 'map', category: 'artifact', emoji: '🗺️', color: '#d97706', defaultCompanion: 'compass' },
  'זהב': { en: 'gold', category: 'artifact', emoji: '💰', color: '#facc15', defaultCompanion: 'chest' },
  'נעליים': { en: 'running-shoes', category: 'artifact', emoji: '👟', color: '#ef4444', defaultCompanion: 'medal' },
  'מטרייה': { en: 'umbrella', category: 'artifact', emoji: '☂️', color: '#ec4899', defaultCompanion: 'rain' },
  'אוהל': { en: 'tent', category: 'artifact', emoji: '⛺', color: '#10b981', defaultCompanion: 'bonfire' },

  // Transport & Vehicles
  'ספינה': { en: 'sailing-ship', category: 'vehicle', emoji: '🚢', color: '#0284c7', defaultCompanion: 'ocean' },
  'סירה': { en: 'boat', category: 'vehicle', emoji: '⛵', color: '#38bdf8', defaultCompanion: 'waves' },
  'אופניים': { en: 'bicycle', category: 'vehicle', emoji: '🚲', color: '#10b981', defaultCompanion: 'road' },
  'קורקינט': { en: 'scooter', category: 'vehicle', emoji: '🛴', color: '#f59e0b', defaultCompanion: 'road' },
  'מכונית': { en: 'car', category: 'vehicle', emoji: '🚗', color: '#ef4444', defaultCompanion: 'road' },
  'רכבת': { en: 'train', category: 'vehicle', emoji: '🚂', color: '#475569', defaultCompanion: 'tracks' },
  'מטוס': { en: 'airplane', category: 'vehicle', emoji: '✈️', color: '#38bdf8', defaultCompanion: 'clouds' },
  'חללית': { en: 'rocket', category: 'vehicle', emoji: '🚀', color: '#8b5cf6', defaultCompanion: 'stars' },

  // Nature, Biomes & Weather
  'הר': { en: 'mountain', category: 'nature', emoji: '⛰️', color: '#64748b' },
  'שלג': { en: 'snow', category: 'weather', emoji: '❄️', color: '#bae6fd' },
  'קרח': { en: 'ice', category: 'weather', emoji: '🧊', color: '#7dd3fc' },
  'יער': { en: 'forest', category: 'nature', emoji: '🌲', color: '#15803d' },
  'עץ': { en: 'tree', category: 'nature', emoji: '🌳', color: '#16a34a' },
  'פרח': { en: 'flower', category: 'nature', emoji: '🌸', color: '#f472b6' },
  'ים': { en: 'ocean', category: 'nature', emoji: '🌊', color: '#0284c7' },
  'אוקיינוס': { en: 'ocean', category: 'nature', emoji: '🌊', color: '#0369a1' },
  'גשם': { en: 'rain', category: 'weather', emoji: '🌧️', color: '#38bdf8' },
  'סערה': { en: 'storm', category: 'weather', emoji: '⛈️', color: '#475569' },
  'שמש': { en: 'sun', category: 'weather', emoji: '☀️', color: '#facc15' },
  'ירח': { en: 'moon', category: 'weather', emoji: '🌙', color: '#e2e8f0' },
  'כוכב': { en: 'star', category: 'weather', emoji: '⭐', color: '#fde047' },
  'כוכבים': { en: 'stars', category: 'weather', emoji: '✨', color: '#fef08a' },
  'לילה': { en: 'night', category: 'weather', emoji: '🌌', color: '#6366f1' },
  'אש': { en: 'fire', category: 'weather', emoji: '🔥', color: '#ef4444' },
  'להבה': { en: 'flame', category: 'weather', emoji: '🔥', color: '#f97316' },

  // Food & Beverage
  'פיצה': { en: 'pizza', category: 'food', emoji: '🍕', color: '#f97316' },
  'קפה': { en: 'coffee', category: 'food', emoji: '☕', color: '#78350f' },
  'תה': { en: 'tea', category: 'food', emoji: '🍵', color: '#16a34a' },
  'עוגה': { en: 'cake', category: 'food', emoji: '🍰', color: '#f43f5e' },
  'תפוח': { en: 'apple', category: 'food', emoji: '🍎', color: '#ef4444' },

  // Concepts & Actions
  'ניצחון': { en: 'victory', category: 'concept', emoji: '🏆', color: '#f59e0b' },
  'אהבה': { en: 'heart', category: 'concept', emoji: '❤️', color: '#ef4444' },
  'ריצה': { en: 'running', category: 'action', emoji: '🏃', color: '#ef4444' }
};

const STOPWORDS_HE = new Set([
  'את', 'על', 'אל', 'עם', 'של', 'זה', 'זו', 'אלה', 'אלו', 'בתוך', 'מתוך',
  'כי', 'אם', 'גם', 'רק', 'אבל', 'אך', 'כדי', 'כל', 'כמו', 'שלי', 'שלך',
  'שלו', 'שלה', 'שלנו', 'היה', 'היתה', 'היו', 'הוא', 'היא', 'הם', 'הן',
  'אני', 'אתה', 'את', 'אנחנו', 'אתם', 'אתן', 'לי', 'לו', 'לה', 'לנו',
  'בו', 'בה', 'בם', 'מאוד', 'יותר', 'הכי', 'שם', 'פה', 'כאן', 'אז', 'עוד',
  'לא', 'כן', 'מה', 'מי', 'איך', 'מתי', 'איפה', 'למה', 'מדוע', 'אחר', 'אחת'
]);

export function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function normalizeHebrewWord(rawWord) {
  let word = rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'״׳]/g, '').trim();
  if (word.length <= 1) return word;

  if (HEBREW_SEMANTIC_LEXICON[word]) return word;

  const prefixes = ['ה', 'ו', 'ב', 'ל', 'מ', 'ש', 'כ'];
  for (const p of prefixes) {
    if (word.startsWith(p) && word.length > 2) {
      const stripped = word.slice(1);
      if (HEBREW_SEMANTIC_LEXICON[stripped]) return stripped;
      for (const p2 of prefixes) {
        if (stripped.startsWith(p2) && stripped.length > 2) {
          const doubleStripped = stripped.slice(1);
          if (HEBREW_SEMANTIC_LEXICON[doubleStripped]) return doubleStripped;
        }
      }
    }
  }

  return word;
}

// Detects the physical terrain/ground slab of the diorama
function detectTerrain(text) {
  const t = text.toLowerCase();
  if (t.includes('שלג') || t.includes('קרח') || (t.includes('הר') && (t.includes('מושלג') || t.includes('לבן')))) {
    return 'snow_mountain';
  }
  if (t.includes('ים') || t.includes('אוקיינוס') || t.includes('ספינה') || t.includes('סירה') || t.includes('חוף') || t.includes('מפרש')) {
    return 'ocean_waves';
  }
  if (t.includes('גשם') || t.includes('שלולית') || t.includes('סערה') || t.includes('רטוב')) {
    return 'rainy_puddles';
  }
  if (t.includes('לילה') || t.includes('כוכב') || t.includes('חלל') || t.includes('ירח') || t.includes('קסם')) {
    return 'starry_celestial';
  }
  if (t.includes('מירוץ') || t.includes('ריצה') || t.includes('גביע') || t.includes('אצטדיון') || t.includes('שיא')) {
    return 'victory_podium';
  }
  if (t.includes('יער') || t.includes('עץ') || t.includes('פרח') || t.includes('טבע') || t.includes('גינה') || t.includes('דשא')) {
    return 'lush_forest';
  }
  return 'ancient_sanctuary';
}

// Detects the environmental weather layer
function detectWeather(text) {
  const t = text.toLowerCase();
  if (t.includes('גשם') || t.includes('סערה') || t.includes('טיפות')) return 'rain_storm';
  if (t.includes('שלג') || t.includes('מושלג') || t.includes('פתית')) return 'snow_flurry';
  if (t.includes('לילה') || t.includes('כוכב') || t.includes('ירח')) return 'starry_night';
  if (t.includes('אש') || t.includes('להבה') || t.includes('מדורה') || t.includes('שרפה')) return 'fire_embers';
  if (t.includes('פרח') || t.includes('אביב') || t.includes('ורד')) return 'falling_petals';
  return 'sunlit_sparks';
}

// Builds a prompt for generative AI (Pollinations / Flux / SD)
function buildAiScenePrompt(text, entities, terrain, weather) {
  const entityWords = entities.map(e => e.en).filter(Boolean);
  const entitiesStr = entityWords.length > 0 ? entityWords.join(', ') : 'magical cozy memory';
  
  return `isometric pixel art diorama, ${entitiesStr}, in ${terrain.replace('_', ' ')} with ${weather.replace('_', ' ')}, cozy Stardew Valley video game style, 16-bit cute aesthetic, rich colors, highly detailed game sprite, clean isolated background`;
}

export function parseUserStory(text) {
  if (!text || typeof text !== 'string') return null;

  const seed = hashString(text);
  const words = text.split(/\s+/);
  const identifiedEntities = [];
  const seenEnglish = new Set();

  for (const rawWord of words) {
    const clean = rawWord.replace(/[.,/#!$%^&*;:{}=\-_`~()?"'״׳]/g, '').trim();
    if (!clean || STOPWORDS_HE.has(clean)) continue;

    const normalized = normalizeHebrewWord(clean);
    const lexiconMatch = HEBREW_SEMANTIC_LEXICON[normalized];

    if (lexiconMatch && !seenEnglish.has(lexiconMatch.en)) {
      seenEnglish.add(lexiconMatch.en);
      identifiedEntities.push({
        raw: clean,
        name: normalized,
        en: lexiconMatch.en,
        category: lexiconMatch.category,
        emoji: lexiconMatch.emoji,
        color: lexiconMatch.color,
        defaultCompanion: lexiconMatch.defaultCompanion
      });
    }
  }

  // English fallback
  if (identifiedEntities.length === 0) {
    for (const w of words) {
      const enWord = w.toLowerCase().replace(/[^a-z]/g, '');
      if (enWord.length > 2 && !['the', 'and', 'with', 'for', 'was', 'were', 'that'].includes(enWord)) {
        identifiedEntities.push({
          raw: w,
          name: enWord,
          en: enWord,
          category: 'artifact',
          emoji: '✨',
          color: '#f59e0b'
        });
        if (identifiedEntities.length >= 3) break;
      }
    }
  }

  const terrain = detectTerrain(text);
  const weather = detectWeather(text);

  const primaryEntity = identifiedEntities[0] || {
    raw: 'זיכרון',
    name: 'זיכרון',
    en: 'sparkles',
    category: 'artifact',
    emoji: '✨',
    color: '#f59e0b'
  };

  const secondaryEntity = identifiedEntities[1] || (primaryEntity.defaultCompanion ? {
    raw: primaryEntity.defaultCompanion,
    name: primaryEntity.defaultCompanion,
    en: primaryEntity.defaultCompanion,
    emoji: primaryEntity.defaultCompanion === 'umbrella' ? '☂️' : '✨',
    color: '#ec4899'
  } : null);

  const aiPrompt = buildAiScenePrompt(text, identifiedEntities, terrain, weather);
  const aiImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(aiPrompt)}?width=256&height=256&nologo=true&seed=${seed}`;

  let title = 'אנדרטת סיפור חי';
  if (identifiedEntities.length >= 2) {
    title = `${identifiedEntities[0].name} ו${identifiedEntities[1].name}`;
  } else if (identifiedEntities.length === 1) {
    title = `עוגן ${identifiedEntities[0].name}`;
  }

  return {
    seed,
    originalText: text,
    title,
    terrain,
    weather,
    primaryEntity,
    secondaryEntity,
    allEntities: identifiedEntities,
    aiPrompt,
    aiImageUrl,
    suggestedColor: primaryEntity.color || '#f59e0b'
  };
}

export async function searchOnlineIconAssets(keyword, color = '#f59e0b', limit = 8) {
  if (!keyword) return [];

  const cleanKey = encodeURIComponent(keyword.trim().toLowerCase());
  const url = `https://api.iconify.design/search?query=${cleanKey}&limit=${limit}`;

  try {
    const res = await fetch(url, { method: 'GET', headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`Iconify search error ${res.status}`);
    const data = await res.json();

    if (!data || !Array.isArray(data.icons) || data.icons.length === 0) {
      return [];
    }

    const encodedCol = encodeURIComponent(color);
    return data.icons.map(iconId => {
      const [prefix, name] = iconId.split(':');
      return {
        id: iconId,
        prefix,
        name,
        // Pass color so the SVG is rendered in vibrant color, NOT black!
        svgUrl: `https://api.iconify.design/${prefix}/${name}.svg?color=${encodedCol}`
      };
    });
  } catch (err) {
    console.warn('Online icon search warning:', err.message);
    return [];
  }
}
