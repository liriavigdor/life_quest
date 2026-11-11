import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

// Print list of all 332 items: id, name, category, image
const summary = items.map((it, idx) => ({
  idx: idx + 1,
  id: it.id,
  name: it.name,
  category: it.category,
  imageUrl: it.imageUrl
}));

fs.writeFileSync('scripts/unhandled_332_summary.json', JSON.stringify(summary, null, 2), 'utf8');
console.log(`Summary written for ${summary.length} items.`);

