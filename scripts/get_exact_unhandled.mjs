import fs from 'node:fs';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const touched = new Set([
  ...(state.discardedIds || []),
  ...Object.keys(state.localEdits || {}),
  ...Object.keys(state.flaggedBadMap || {})
]);
console.log('Total unique user-touched IDs:', touched.size);

// Read stagedImagesPool.js
const poolRaw = fs.readFileSync('src/data/stagedImagesPool.js', 'utf8');
const idMatches = [...poolRaw.matchAll(/"id":\s*"([^"]+)"/g)].map(m => m[1]);
console.log('Total pool items:', idMatches.length);

const unhandled = idMatches.filter(id => !touched.has(id));
console.log('Exact unhandled count:', unhandled.length);

fs.writeFileSync('scripts/exact_unhandled_ids.json', JSON.stringify(unhandled, null, 2), 'utf8');

