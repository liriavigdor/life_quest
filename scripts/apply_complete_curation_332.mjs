import fs from 'node:fs';
import path from 'node:path';
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

console.log(`Loaded ${Object.keys(allCurated).length} curated items.`);

// Load user curation state to enforce safety boundary
const userState = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const userTouched = new Set([
  ...(userState.discardedIds || []),
  ...Object.keys(userState.localEdits || {}),
  ...Object.keys(userState.flaggedBadMap || {})
]);

console.log(`User-touched items count: ${userTouched.size}`);

// Read stagedImagesPool.js
const poolPath = path.resolve('src/data/stagedImagesPool.js');
const poolContent = fs.readFileSync(poolPath, 'utf8');

// Parse the array exported as STAGED_IMAGES_POOL
// Since it's a JS file with export const STAGED_IMAGES_POOL = [...];
// Let's extract the JSON content
const startIdx = poolContent.indexOf('[');
const endIdx = poolContent.lastIndexOf(']');
if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find STAGED_IMAGES_POOL array in file!');
}

const poolItems = JSON.parse(poolContent.slice(startIdx, endIdx + 1));
console.log(`Total items in STAGED_IMAGES_POOL: ${poolItems.length}`);

let updatedCount = 0;
let untouchedUserCount = 0;

poolItems.forEach(item => {
  if (userTouched.has(item.id)) {
    delete item.aiCurated;
    untouchedUserCount++;
    return; // NEVER touch user-handled items!
  }

  const cur = allCurated[item.id];
  if (cur) {
    item.name = cur.name;
    item.name_he = cur.name;
    item.suggestedName = cur.name;
    item.associations = cur.branches;
    item.everyday_associations = cur.branches;
    item.aiCurated = true;

    // Special image updates for downloaded photos
    if (item.id === 'nerd_geek_glasses') {
      item.imageUrl = '/staged_images/pool/nerd_geek_glasses.jpg';
    } else if (item.id === 'handshake_deal') {
      item.imageUrl = '/staged_images/pool/handshake_deal.jpg';
    } else if (item.id === 'item_208_מטוס_ג_מבו') {
      item.imageUrl = '/staged_images/pool/item_208_מטוס_ג_מבו.jpg';
    } else if (item.id === 'item_211_כדור_פורח_צבעוני') {
      item.imageUrl = '/staged_images/pool/item_211_כדור_פורח_צבעוני.jpg';
    } else if (item.id === 'item_212_צוללת_צהובה') {
      item.imageUrl = '/staged_images/pool/item_212_צוללת_צהובה.jpg';
    } else if (item.id === 'item_500_שלדג') {
      item.imageUrl = '/staged_images/pool/item_500_שלדג.jpg';
    }

    updatedCount++;
  }
});

console.log(`Updated unhandled items: ${updatedCount}`);
console.log(`Safeguarded user items: ${untouchedUserCount}`);

// Write back to src/data/stagedImagesPool.js
const newFileContent = `// Auto-curated & user-protected staged images pool\nexport const STAGED_IMAGES_POOL = ${JSON.stringify(poolItems, null, 2)};\n`;
fs.writeFileSync(poolPath, newFileContent, 'utf8');
console.log(`Successfully wrote ${poolItems.length} items to ${poolPath}!`);

// Also save a manifest of all AI-curated items for reporting
const curatedManifest = poolItems.filter(i => i.aiCurated).map(i => ({
  id: i.id,
  name: i.name,
  category: i.category,
  imageUrl: i.imageUrl,
  branches: i.associations
}));

fs.writeFileSync('public/data/ai_curated_manifest.json', JSON.stringify(curatedManifest, null, 2), 'utf8');
console.log(`Saved AI curated manifest (${curatedManifest.length} items) to public/data/ai_curated_manifest.json`);

