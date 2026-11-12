import fs from 'node:fs';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';
import { AUDITED_VERIFIED_POOL } from '../src/data/auditedImagesPool.js';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const discarded = new Set(state.discardedIds || []);
const flagged = state.flaggedBadMap || {};
const localEdits = state.localEdits || {};

console.log('--- FLAGGED BAD MAP (26 items) ---');
for (const [id, info] of Object.entries(flagged)) {
  const inStaged = STAGED_IMAGES_POOL.find(x => x.id === id);
  const inDiscarded = discarded.has(id);
  const inEdits = Boolean(localEdits[id]);
  console.log(`${id} | title="${info.title}" | reason="${info.reason}" | stagedUrl=${inStaged?.imageUrl} | discarded=${inDiscarded} | edited=${inEdits}`);
}

