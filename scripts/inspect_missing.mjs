import fs from 'fs';

const missing = JSON.parse(fs.readFileSync('scripts/missing_items.json', 'utf8'));
console.log('Total missing:', missing.length);

// Print grouped by category
const byCat = {};
missing.forEach(it => {
  const cat = it.cat || 'other';
  byCat[cat] = byCat[cat] || [];
  byCat[cat].push({ id: it.id, name: it.name });
});

for (const [cat, list] of Object.entries(byCat)) {
  console.log(`\n=== Category: ${cat} (${list.length} items) ===`);
  list.slice(0, 5).forEach(i => console.log(`  ${i.id}: ${i.name}`));
}

