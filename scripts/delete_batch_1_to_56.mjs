import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// The first 56 items ending with mati_caspi
const itemsToDelete = arsenal.slice(0, 56);
const deleteIds = new Set(itemsToDelete.map(it => it.id));

console.log(`Deleting ${itemsToDelete.length} items from 1 to 56 (up to ${itemsToDelete[55].name_he})...`);

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
console.log(`Successfully deleted ${filesDeleted} image files from public/`);

// Filter the datasets
const remainingArsenal = arsenal.slice(56);
console.log(`Remaining items count: ${remainingArsenal.length}`);

// 1. Update public/data/masterMnemonicArsenal1000.json
fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(remainingArsenal, null, 2), 'utf8');
console.log('Updated public/data/masterMnemonicArsenal1000.json');

// 2. Update src/data/masterMnemonicArsenal1000.js
const jsContent = `// MASTER MNEMONIC ARSENAL (CURATED CULTURAL ANCHORS)
// Total items: ${remainingArsenal.length}
// Strict compliance: Pikachu standard (4-5 crisp, quintessential associations per item)

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(remainingArsenal, null, 2)};

export const MASTER_ARSENAL_COUNT = ${remainingArsenal.length};

export default MASTER_MNEMONIC_ARSENAL;
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsContent, 'utf8');
console.log('Updated src/data/masterMnemonicArsenal1000.js');

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
console.log('Updated src/data/stagedImagesPool.js');

// 4. Update scripts/catalog_kept_items.json
if (fs.existsSync('scripts/catalog_kept_items.json')) {
  const kept = JSON.parse(fs.readFileSync('scripts/catalog_kept_items.json', 'utf8'));
  const updatedKept = kept.filter(it => !deleteIds.has(it.id));
  fs.writeFileSync('scripts/catalog_kept_items.json', JSON.stringify(updatedKept, null, 2), 'utf8');
  console.log(`Updated scripts/catalog_kept_items.json (new count: ${updatedKept.length})`);
}
