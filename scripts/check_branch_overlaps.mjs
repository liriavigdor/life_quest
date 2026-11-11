import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));
let count = 0;
const overlappingItems = [];

items.forEach(item => {
  const rootWords = item.name.split(/[\s\-_\/\"'’`]+/).filter(w => w.length > 1);
  const branches = item.currentAssociations || [];
  const overlaps = branches.filter(b => {
    const cleanB = b.replace('#', '').trim();
    return cleanB === item.name || rootWords.some(rw => cleanB === rw);
  });
  if (overlaps.length > 0) {
    count++;
    overlappingItems.push({ id: item.id, name: item.name, overlaps });
  }
});

console.log(`Items with root words in branches: ${count} / ${items.length}`);
console.log('Sample 10 items:');
console.log(overlappingItems.slice(0, 10));

