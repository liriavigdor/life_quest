import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

// Write a clean list of id, name, category to scripts/unhandled_332_manifest.json
const manifest = items.map(it => ({
  id: it.id,
  originalName: it.name,
  category: it.category || 'General',
  imageUrl: it.imageUrl
}));

fs.writeFileSync('scripts/unhandled_332_manifest.json', JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Manifest created with ${manifest.length} items.`);

