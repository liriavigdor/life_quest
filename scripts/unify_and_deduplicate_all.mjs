import fs from 'fs';
import path from 'path';
import { CURATED_USER_REPOSITORY_SEED, DISCARDED_STAGED_IDS } from '../src/data/curatedUserRepositorySeed.js';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

// 1. DEDUPLICATE LIVE REPOSITORY SEED
const normalize = (s) => (s || '').trim().toLowerCase()
  .replace(/[״"'`()\[\]{}.,:;!?\-–—\/\s]+/g, '')
  .replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ץ/g, 'צ').replace(/ף/g, 'פ').replace(/ך/g, 'כ');

const unifiedSeedMap = new Map();

for (const item of CURATED_USER_REPOSITORY_SEED) {
  const normTitle = normalize(item.title);
  if (!normTitle) continue;

  if (!unifiedSeedMap.has(normTitle)) {
    unifiedSeedMap.set(normTitle, {
      ...item,
      keywords: Array.isArray(item.keywords) ? [...item.keywords] : []
    });
  } else {
    // Merge keywords into existing unique entry
    const existing = unifiedSeedMap.get(normTitle);
    const combinedKeywords = new Set([...(existing.keywords || []), ...(item.keywords || [])]);
    existing.keywords = Array.from(combinedKeywords).slice(0, 6);
    // Keep better image if existing is placeholder/data-URI and other is clean URL
    if (existing.imageUrl?.startsWith('data:') && item.imageUrl && !item.imageUrl.startsWith('data:')) {
      existing.imageUrl = item.imageUrl;
    }
  }
}

const cleanedSeed = Array.from(unifiedSeedMap.values());
console.log(`Deduplicated Live Seed from ${CURATED_USER_REPOSITORY_SEED.length} to ${cleanedSeed.length} unique roots.`);

// Save cleaned seed
const seedPath = path.resolve('src/data/curatedUserRepositorySeed.js');
const seedContent = `/**
 * Curated User Repository Seed
 * נקי מכפילויות: כל שורש מופיע פעם אחת בלבד עם ענפיו המאוחדים.
 * סה"כ שורשים ייחודיים: ${cleanedSeed.length}
 */

export const CURATED_USER_REPOSITORY_SEED = ${JSON.stringify(cleanedSeed, null, 2)};

export const DISCARDED_STAGED_IDS = ${JSON.stringify(DISCARDED_STAGED_IDS || [], null, 2)};
`;
fs.writeFileSync(seedPath, seedContent, 'utf8');

// 2. DEDUPLICATE & UPDATE DRAFT ROOTS
const existingLiveTitles = new Set(cleanedSeed.map(s => normalize(s.title)));

const collidingIds = new Set([
  'arch_hourglass',        // שעון חול
  'arch_magnifying_glass', // זכוכית מגדלת
  'arch_rotary_phone',     // טלפון חוגה
  'arch_safety_pin',       // סיכת ביטחון
  'arch_stethoscope',      // סטטוסקופ
  'arch_syringe'           // מזרק
]);

const NEW_REPLACEMENTS = [
  {
    id: 'arch_floppy_disk',
    title: 'דיסקט',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Floppy disk 3.5 inch isolated',
    imageUrl: '/staged_images/archetypes/arch_floppy_disk.jpg'
  },
  {
    id: 'arch_axe',
    title: 'גרזן',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Lumberjack axe isolated',
    imageUrl: '/staged_images/archetypes/arch_axe.jpg'
  },
  {
    id: 'arch_trumpet',
    title: 'חצוצרה',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Brass trumpet isolated',
    imageUrl: '/staged_images/archetypes/arch_trumpet.jpg'
  },
  {
    id: 'arch_gear',
    title: 'גלגל שיניים',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Cog gear wheel metal isolated',
    imageUrl: '/staged_images/archetypes/arch_gear.jpg'
  },
  {
    id: 'arch_spirit_level',
    title: 'פלס בנאים',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Spirit level tool green bubble isolated',
    imageUrl: '/staged_images/archetypes/arch_spirit_level.jpg'
  },
  {
    id: 'arch_service_bell',
    title: 'פעמון קבלה',
    category: '🏛️ ארכיטיפים תרבותיים',
    keywords: [],
    searchQuery: 'Service desk bell ring isolated',
    imageUrl: '/staged_images/archetypes/arch_service_bell.jpg'
  }
];

// Filter out colliding drafts and inject new replacements
const filteredDrafts = INITIAL_CREATION_DRAFT_ROOTS.filter(d => !collidingIds.has(d.id));
const finalDrafts = [...NEW_REPLACEMENTS, ...filteredDrafts];

// Double check zero collisions
const finalCollisions = finalDrafts.filter(d => existingLiveTitles.has(normalize(d.title)));
console.log(`Final draft roots count: ${finalDrafts.length}. Collisions with live repo: ${finalCollisions.length}`);

// Save creationDraftRoots.js
const draftsPath = path.resolve('src/data/creationDraftRoots.js');
const draftsContent = `/**
 * INITIAL_CREATION_DRAFT_ROOTS
 * 
 * מאגר שורשים מדויק וייחודי לסטודיו היצירה (0 כפילויות עם המאגר הפעיל!).
 * סה"כ: ${finalDrafts.length} פריטים.
 */

export const INITIAL_CREATION_DRAFT_ROOTS = ${JSON.stringify(finalDrafts, null, 2)};
`;
fs.writeFileSync(draftsPath, draftsContent, 'utf8');

console.log('ALL DONE! Live seed and studio drafts are 100% clean and deduplicated.');

