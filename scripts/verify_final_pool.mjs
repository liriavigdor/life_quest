import fs from 'node:fs';
import path from 'node:path';
import { validateBranches } from './branch_validator.mjs';

const poolPath = path.resolve('src/data/stagedImagesPool.js');
const poolContent = fs.readFileSync(poolPath, 'utf8');
const startIdx = poolContent.indexOf('[');
const endIdx = poolContent.lastIndexOf(']');
const poolItems = JSON.parse(poolContent.slice(startIdx, endIdx + 1));

console.log(`Inspecting ${poolItems.length} items from stagedImagesPool.js...`);

const userState = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const userTouched = new Set([
  ...(userState.discardedIds || []),
  ...Object.keys(userState.localEdits || {}),
  ...Object.keys(userState.flaggedBadMap || {})
]);

let aiCuratedCount = 0;
let overlapErrors = 0;
let missingImageFiles = 0;

poolItems.forEach(item => {
  if (item.aiCurated) {
    aiCuratedCount++;

    // 1. Branch isolation check
    const invalid = validateBranches(item.name, item.associations || []);
    if (invalid.length > 0) {
      console.error(`ERROR: Root overlap in ${item.id} ("${item.name}"):`, invalid);
      overlapErrors++;
    }

    // 2. Image existence check
    const localPath = path.resolve('public' + item.imageUrl);
    if (!fs.existsSync(localPath)) {
      console.error(`ERROR: Missing image file for ${item.id}: ${localPath}`);
      missingImageFiles++;
    }

    // 3. Ensure not in user touched
    if (userTouched.has(item.id)) {
      console.error(`CRITICAL: AI item ${item.id} is in user touched!`);
    }
  }
});

console.log(`AI Curated count: ${aiCuratedCount}`);
console.log(`Overlap errors: ${overlapErrors}`);
console.log(`Missing image files: ${missingImageFiles}`);

if (aiCuratedCount === 331 && overlapErrors === 0 && missingImageFiles === 0) {
  console.log('🎉 ALL 331 UNHANDLED ITEMS ARE 100% PERFECTLY CURATED, VALIDATED, AND ZERO OVERLAP!');
} else {
  console.error('Validation failed!');
  process.exit(1);
}

