import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

// Group by category and print id and name
const grouped = {};
items.forEach(it => {
  const c = it.category || 'Other';
  if (!grouped[c]) grouped[c] = [];
  grouped[c].push({ id: it.id, name: it.name, file: it.imageUrl });
});

for (const [cat, list] of Object.entries(grouped)) {
  console.log(`\n=== CATEGORY: ${cat} (${list.length} items) ===`);
  list.forEach(i => console.log(`  ${i.id}: "${i.name}" -> ${i.file}`));
}

