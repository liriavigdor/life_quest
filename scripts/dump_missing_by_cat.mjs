import fs from 'fs';

const missing = JSON.parse(fs.readFileSync('scripts/missing_items.json', 'utf8'));

const byCat = {};
missing.forEach(it => {
  const cat = it.cat || 'other';
  byCat[cat] = byCat[cat] || [];
  byCat[cat].push({ id: it.id, name: it.name });
});

fs.writeFileSync('scripts/missing_by_cat.json', JSON.stringify(byCat, null, 2), 'utf8');
console.log('Saved missing_by_cat.json');
