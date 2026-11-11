import fs from 'node:fs';
import path from 'node:path';

const MANIFEST_PATH = path.resolve('public/data/authentic_replacements_manifest.json');
const STAGED_POOL_FILE = path.resolve('src/data/stagedImagesPool.js');
const USER_CURATION_FILE = path.resolve('public/data/user_curation_state.json');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
console.log(`Applying ${Object.keys(manifest).length} authentic replacements...`);

// 1. Update src/data/stagedImagesPool.js
let poolCode = fs.readFileSync(STAGED_POOL_FILE, 'utf8');

let replacedInPool = 0;
for (const [id, entry] of Object.entries(manifest)) {
  const newUrl = entry.newImageUrl;
  
  // Find item by "id": "id"
  const regex = new RegExp(`("id":\\s*"${id}"[\\s\\S]*?"imageUrl":\\s*")[^"]+(")`, 'g');
  if (regex.test(poolCode)) {
    poolCode = poolCode.replace(regex, `$1${newUrl}$2`);
    console.log(`  Updated pool item [${id}] -> ${newUrl}`);
    replacedInPool++;
  } else {
    // If id was formatted with item number or slightly different key
    const altRegex = new RegExp(`("imageUrl":\\s*")[^"]*?${id}[^"]*?(")`, 'g');
    if (altRegex.test(poolCode)) {
      poolCode = poolCode.replace(altRegex, `$1${newUrl}$2`);
      console.log(`  Updated pool item via alt match [${id}] -> ${newUrl}`);
      replacedInPool++;
    }
  }
}

fs.writeFileSync(STAGED_POOL_FILE, poolCode, 'utf8');
console.log(`Pool file updated with ${replacedInPool} replaced image URLs.`);

// 2. Also update user_curation_state.json so the flagged bad map references the new image or clears flag
const curationData = JSON.parse(fs.readFileSync(USER_CURATION_FILE, 'utf8'));
if (curationData.flaggedBadMap) {
  for (const [id, entry] of Object.entries(manifest)) {
    if (curationData.flaggedBadMap[id]) {
      curationData.flaggedBadMap[id].replacedImageUrl = entry.newImageUrl;
      curationData.flaggedBadMap[id].status = 'replaced_with_authentic';
    }
  }
}
fs.writeFileSync(USER_CURATION_FILE, JSON.stringify(curationData, null, 2), 'utf8');
console.log('user_curation_state.json updated with replaced_with_authentic status.');

