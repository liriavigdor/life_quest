import fs from 'fs';

const kept = JSON.parse(fs.readFileSync('./scripts/catalog_kept_items.json', 'utf8'));
const keptIds = new Set(kept.map(k => k.id));

const buildFiles = [
  'build_catalog_cinema_heroes.mjs',
  'build_catalog_gaming_myth_sports.mjs',
  'build_catalog_history.mjs',
  'build_catalog_landmarks_objects_nature.mjs',
  'build_catalog_science_arts.mjs',
  'build_catalog_expansion.mjs',
  'build_grand_300.mjs',
  'build_grand_part2.mjs',
  'build_grand_part3.mjs',
  'build_grand_part5.mjs'
];

let foundOriginal = 0;
const originalMap = new Map();

for (const bf of buildFiles) {
  if (!fs.existsSync('./scripts/' + bf)) continue;
  const content = fs.readFileSync('./scripts/' + bf, 'utf8');
  const regex = /makeItem\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*,\s*(\[[^\]]*\])/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    const query = match[3];
    const cat = match[4];
    let kws = [];
    try {
      kws = JSON.parse(match[5].replace(/'/g, '"'));
    } catch (_) {
      try {
        kws = eval(match[5]);
      } catch (_) {}
    }
    if (keptIds.has(id)) {
      foundOriginal++;
      originalMap.set(id, { name, query, cat, kws });
    }
  }
}

console.log('Total kept items found with original phrases:', foundOriginal, 'out of', kept.length);
