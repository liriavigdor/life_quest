import fs from 'node:fs';
import path from 'node:path';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

console.log('Total unhandled:', items.length);

// Let's inspect items 201-250
const vehicles = items.filter(i => (i.category || '').includes('250'));
console.log('Vehicles (201-250):', vehicles.length);

vehicles.forEach(v => {
  const file = path.basename(v.imageUrl);
  console.log(`${v.id} -> root: "${v.name}" -> file: ${file}`);
});

