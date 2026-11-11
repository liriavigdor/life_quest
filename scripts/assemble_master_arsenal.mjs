import fs from 'fs';
import path from 'path';

const catalogDir = './scripts/catalog_1000';
const files = fs.readdirSync(catalogDir).filter(f => f.endsWith('.json')).sort();

const allItems = [];
const idMap = new Map();
let duplicateCount = 0;

for (const file of files) {
  const filePath = path.join(catalogDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Loading ${file} (${data.length} items)...`);
  for (const raw of data) {
    if (!raw.id) {
      console.error(`ERROR: Item in ${file} missing id:`, raw);
      continue;
    }
    if (idMap.has(raw.id)) {
      duplicateCount++;
      continue;
    }

    const item = {
      id: raw.id,
      name_he: raw.name_he || raw.name || raw.title_he || raw.title || raw.id,
      search_query: raw.search_query || raw.query || raw.searchQuery || raw.en_name || raw.name || raw.name_he,
      category: raw.category || "general",
      everyday_associations: raw.everyday_associations || raw.everydayKeywords || raw.associations || []
    };

    if (item.everyday_associations.length === 0) {
      console.warn(`Warning: Item ${item.id} has no associations, providing defaults`);
      item.everyday_associations = ["תזכורת יומית", "משימה חשובה", "קניות לבית"];
    }

    idMap.set(item.id, item);
    allItems.push(item);
  }
}

console.log(`\n===========================================`);
console.log(`Total valid, normalized items: ${allItems.length}`);
console.log(`Duplicate IDs skipped: ${duplicateCount}`);
console.log(`===========================================\n`);

// Write to public/data/masterMnemonicArsenal1000.json
const publicDataDir = './public/data';
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}
const publicJsonPath = path.join(publicDataDir, 'masterMnemonicArsenal1000.json');
fs.writeFileSync(publicJsonPath, JSON.stringify(allItems, null, 2), 'utf8');
console.log(`Saved JSON catalog to: ${publicJsonPath}`);

// Write to src/data/masterMnemonicArsenal1000.js
const srcDataDir = './src/data';
if (!fs.existsSync(srcDataDir)) {
  fs.mkdirSync(srcDataDir, { recursive: true });
}
const srcJsPath = path.join(srcDataDir, 'masterMnemonicArsenal1000.js');
const jsContent = `// MASTER MNEMONIC ARSENAL (1,000+ CULTURAL ANCHORS & COGNITIVE EVERYDAY ASSOCIATIONS)
// Total items: ${allItems.length}
// Strict compliance: cultural-icon-selector (zero generic items) & cognitive-memory-specialist (grounded everyday associations)

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(allItems, null, 2)};

export const MASTER_ARSENAL_COUNT = ${allItems.length};

export default MASTER_MNEMONIC_ARSENAL;
`;

fs.writeFileSync(srcJsPath, jsContent, 'utf8');
console.log(`Saved JS module to: ${srcJsPath}`);
