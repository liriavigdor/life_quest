import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UNHANDLED_PATH = path.resolve('scripts/unhandled_332_items.json');

const items = JSON.parse(fs.readFileSync(UNHANDLED_PATH, 'utf8'));

// Identify items that known to have blunders or need authentic photos:
// Especially vehicle items 201-250, nature 251-300, sports 301-350, tools 351-400
console.log(`Auditing ${items.length} unhandled items...`);

// Let's print out the list of items 201 to 250 with their titles
const vehicles = items.filter(i => (i.category || '').includes('250'));
console.log(`Vehicles count: ${vehicles.length}`);
vehicles.forEach(v => {
  console.log(`${v.id} | "${v.name}" | ${v.imageUrl}`);
});

