import fs from 'fs';

import { COMPLETE_CURATED_MAP } from './build_complete_curated_map.mjs';

const kept = JSON.parse(fs.readFileSync('scripts/catalog_kept_items.json', 'utf8'));
const mapKeys = new Set(Object.keys(COMPLETE_CURATED_MAP));

const missing = kept.filter(it => !mapKeys.has(it.id));
console.log('Total kept:', kept.length);
console.log('In map:', mapKeys.size);
console.log('Missing count:', missing.length);

fs.writeFileSync('scripts/missing_items.json', JSON.stringify(missing, null, 2), 'utf8');

