import fs from 'fs';
import path from 'path';
import { ARCHETYPE_ITEMS } from './download_archetype_batch.mjs';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

const existingIds = new Set(INITIAL_CREATION_DRAFT_ROOTS.map(r => r.id));

const newArchetypeRoots = ARCHETYPE_ITEMS.map(item => ({
  id: item.id,
  title: item.hint,
  category: '🏛️ ארכיטיפים תרבותיים',
  keywords: [],
  searchQuery: `${item.nameEn} isolated icon`,
  imageUrl: `/staged_images/archetypes/${item.id}.jpg`
})).filter(item => !existingIds.has(item.id));

const combined = [...newArchetypeRoots, ...INITIAL_CREATION_DRAFT_ROOTS];

const content = `/**
 * INITIAL_CREATION_DRAFT_ROOTS
 * 
 * כולל 40 ארכיטיפים תרבותיים מובהקים + 81 שורשי מטלות יומיומיות.
 * סה"כ: ${combined.length} עוגנים עם תמונות מקומיות מוכנות בתוך האתר!
 */

export const INITIAL_CREATION_DRAFT_ROOTS = ${JSON.stringify(combined, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/creationDraftRoots.js'), content, 'utf8');
console.log(`Successfully injected ${newArchetypeRoots.length} archetype roots! Total: ${combined.length}`);

