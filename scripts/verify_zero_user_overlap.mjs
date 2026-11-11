import fs from 'node:fs';
import { vehiclesCuration } from './curation_data/cat_vehicles.js';
import { natureCuration } from './curation_data/cat_nature.js';
import { sportsCuration } from './curation_data/cat_sports.js';
import { toolsCuration } from './curation_data/cat_tools.js';
import { cultureRemainingCuration } from './curation_data/cat_culture_remaining.js';

const allCurated = {
  ...vehiclesCuration,
  ...natureCuration,
  ...sportsCuration,
  ...toolsCuration,
  ...cultureRemainingCuration
};

const curatedKeys = Object.keys(allCurated);
console.log(`Total curated items in dictionaries: ${curatedKeys.length}`);

// Load user curation state
const userState = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const userTouched = new Set([
  ...(userState.discardedIds || []),
  ...Object.keys(userState.localEdits || {}),
  ...Object.keys(userState.flaggedBadMap || {})
]);

console.log(`Total user-touched items: ${userTouched.size}`);

const overlaps = curatedKeys.filter(id => userTouched.has(id));
console.log(`Overlaps with user-touched items: ${overlaps.length}`);
if (overlaps.length > 0) {
  console.error('CRITICAL ERROR: Curated list touches user items:', overlaps);
  process.exit(1);
} else {
  console.log('PERFECT: ZERO overlap with user-handled items! User work is 100% protected.');
}

// Also verify that all 332 items from unhandled_332_items.json are covered
const unhandled = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));
const missing = unhandled.filter(u => !allCurated[u.id]);
console.log(`Missing unhandled items: ${missing.length}`);
if (missing.length > 0) {
  console.error('Missing items:', missing.map(m => m.id));
  process.exit(1);
} else {
  console.log('PERFECT: ALL 332 unhandled items are 100% covered!');
}

