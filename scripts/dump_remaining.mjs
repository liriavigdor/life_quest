import fs from 'node:fs';

const rem = JSON.parse(fs.readFileSync('scripts/remaining_items.json', 'utf8'));
console.log(`Total remaining items: ${rem.length}`);

const grouped = {};
rem.forEach(item => {
  const cat = item.cat || 'Unknown';
  if (!grouped[cat]) grouped[cat] = [];
  grouped[cat].push(item);
});

for (const [cat, list] of Object.entries(grouped)) {
  console.log(`\n--- ${cat} (${list.length} items) ---`);
  list.forEach(i => console.log(`  ${i.id}: "${i.name}"`));
}

