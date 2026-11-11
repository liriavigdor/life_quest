import fs from 'node:fs';
const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));
const nat = items.filter(i => (i.category || '').includes('251') || (i.category || '').includes('300'));
console.log(`Nature count: ${nat.length}`);
nat.forEach(n => console.log(`${n.id}: "${n.name}"`));

