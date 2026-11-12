import fs from 'node:fs';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';
import { AUDITED_VERIFIED_POOL } from '../src/data/auditedImagesPool.js';
import { validateBranches } from './branch_validator.mjs';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const discarded = new Set(state.discardedIds || []);
const localEdits = state.localEdits || {};
const auditedMap = new Map(AUDITED_VERIFIED_POOL.map(x => [x.id, x]));

const firstBatchActive = STAGED_IMAGES_POOL.filter(x => !x.aiCurated && !discarded.has(x.id));
console.log(`Active non-discarded items in first batch: ${firstBatchActive.length}`);

for (const item of firstBatchActive) {
  const edit = localEdits[item.id] || {};
  const aud = auditedMap.get(item.id);
  const title = edit.title || item.suggestedName || item.name_he || item.name;
  const branches = edit.keywords || aud?.branches || item.everyday_associations || item.associations || [];
  const overlaps = validateBranches(title, branches);
  console.log(`${item.id.padEnd(36)} | ${title.padEnd(22)} | edited=${Boolean(edit.isModified)} | branches=${JSON.stringify(branches)} | overlaps=${overlaps.length}`);
}

