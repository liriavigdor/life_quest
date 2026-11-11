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

const unhandled = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

let missingFiles = 0;
unhandled.forEach(u => {
  let imgUrl = u.imageUrl;
  if (u.id === 'nerd_geek_glasses') imgUrl = '/staged_images/pool/nerd_geek_glasses.jpg';
  if (u.id === 'handshake_deal') imgUrl = '/staged_images/pool/handshake_deal.jpg';

  const fullPath = path.resolve('public' + imgUrl);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing file for ${u.id}: ${fullPath}`);
    missingFiles++;
  } else {
    const stat = fs.statSync(fullPath);
    if (stat.size < 5000) {
      console.warn(`Small file for ${u.id}: ${stat.size} bytes`);
    }
  }
});

console.log(`Missing image files: ${missingFiles} / ${unhandled.length}`);

