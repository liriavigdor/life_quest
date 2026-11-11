import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// Range from item 80 (index 79) up to capri_faraglioni_rocks (index 98, item 99)
const startIndex = 79; // Item 80: dead_sea_salt_formations
const capriIdx = arsenal.findIndex(x => x.id === 'capri_faraglioni_rocks');
const endIndex = capriIdx !== -1 ? capriIdx : 95; // inclusive

const itemsToDelete = arsenal.slice(startIndex, endIndex + 1);
const deleteIds = new Set(itemsToDelete.map(it => it.id));

console.log(`Deleting ${itemsToDelete.length} items from ${arsenal[startIndex].name_he} (item ${startIndex + 1}) up to ${arsenal[endIndex].name_he} (item ${endIndex + 1})...`);

let filesDeleted = 0;
itemsToDelete.forEach(it => {
  if (it.imageUrl) {
    const fullPath = `./public${it.imageUrl}`;
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
        filesDeleted++;
      } catch (err) {
        console.error(`Failed to delete ${fullPath}:`, err.message);
      }
    }
  }
});
console.log(`Deleted ${filesDeleted} files from public/`);

// Filter arsenal
const remainingArsenal = arsenal.filter(it => !deleteIds.has(it.id));
console.log(`Remaining items in arsenal: ${remainingArsenal.length}`);

// 1. Update public/data/masterMnemonicArsenal1000.json
fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(remainingArsenal, null, 2), 'utf8');

// 2. Update src/data/masterMnemonicArsenal1000.js
const jsContent = `// MASTER MNEMONIC ARSENAL (CURATED CULTURAL ANCHORS)
// Total items: ${remainingArsenal.length}
// Strict compliance: Pikachu standard (4-5 crisp, quintessential associations per item)

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(remainingArsenal, null, 2)};

export const MASTER_ARSENAL_COUNT = ${remainingArsenal.length};

export default MASTER_MNEMONIC_ARSENAL;
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsContent, 'utf8');

// 3. Update src/data/stagedImagesPool.js
const poolItems = remainingArsenal.map(item => ({
  id: item.id,
  suggestedName: item.name_he,
  topic: item.category,
  imageUrl: item.imageUrl,
  fileSize: item.fileSize,
  everyday_associations: item.everyday_associations
}));

const stagedJsContent = `// STAGED IMAGES POOL (REFINED CULTURAL ARSENAL)
// Total items: ${poolItems.length}

export const STAGED_IMAGES_POOL = ${JSON.stringify(poolItems, null, 2)};

export default STAGED_IMAGES_POOL;
`;
fs.writeFileSync('src/data/stagedImagesPool.js', stagedJsContent, 'utf8');

// 4. Update scripts/catalog_kept_items.json
if (fs.existsSync('scripts/catalog_kept_items.json')) {
  const kept = JSON.parse(fs.readFileSync('scripts/catalog_kept_items.json', 'utf8'));
  const updatedKept = kept.filter(it => !deleteIds.has(it.id));
  fs.writeFileSync('scripts/catalog_kept_items.json', JSON.stringify(updatedKept, null, 2), 'utf8');
}

console.log('Datasets updated successfully!');
