import fs from 'node:fs';
import path from 'node:path';
import { AUDITED_VERIFIED_POOL } from '../src/data/auditedImagesPool.js';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const discarded = new Set(state.discardedIds || []);
const flagged = state.flaggedBadMap || {};
const localEdits = state.localEdits || {};
const userTouched = new Set([...discarded, ...Object.keys(flagged), ...Object.keys(localEdits)]);

const stagedMap = new Map(STAGED_IMAGES_POOL.map(x => [x.id, x]));

console.log(`Total in AUDITED_VERIFIED_POOL: ${AUDITED_VERIFIED_POOL.length}`);

let inDiscarded = 0;
let inFlagged = 0;
let inLocalEdits = 0;
let inAiCurated331 = 0;
let notInStaged = 0;
let urlDiffersFromStaged = 0;

for (const item of AUDITED_VERIFIED_POOL) {
  const staged = stagedMap.get(item.id);
  if (!staged) notInStaged++;
  else if (staged.imageUrl !== item.imageUrl) {
    urlDiffersFromStaged++;
    console.log(`URL DIFF [${item.id}]: audited=${item.imageUrl} vs staged=${staged.imageUrl}`);
  }
  if (discarded.has(item.id)) inDiscarded++;
  if (flagged[item.id]) inFlagged++;
  if (localEdits[item.id]) inLocalEdits++;
  if (!userTouched.has(item.id)) inAiCurated331++;
}

console.log({
  inDiscarded,
  inFlagged,
  inLocalEdits,
  inAiCurated331,
  notInStaged,
  urlDiffersFromStaged
});

