import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('./public/data/masterMnemonicArsenal1000.json', 'utf8'));

// Read existing staged pool to keep existing custom images/file sizes if available
let existingStaged = [];
try {
  const content = fs.readFileSync('./src/data/stagedImagesPool.js', 'utf8');
  const jsonMatch = content.match(/export const STAGED_IMAGES_POOL = (\[[\s\S]*?\]);/);
  if (jsonMatch) {
    existingStaged = JSON.parse(jsonMatch[1]);
  }
} catch (e) {
  console.log('Could not parse existing stagedImagesPool:', e.message);
}

const existingMap = new Map(existingStaged.map(i => [i.id, i]));

const fullPool = [];

// First, push existing staged images (ensures user doesn't lose current order or file paths)
for (const item of existingStaged) {
  // If in arsenal, enrich with everyday associations
  const fromArsenal = arsenal.find(a => a.id === item.id);
  fullPool.push({
    ...item,
    everyday_associations: fromArsenal ? fromArsenal.everyday_associations : (item.everydayKeywords || [])
  });
}

const existingIds = new Set(fullPool.map(i => i.id));

// Now append all remaining arsenal items
for (const item of arsenal) {
  if (existingIds.has(item.id)) continue;
  existingIds.add(item.id);

  // Check if image exists in /staged_images/ or /staged_images/pool/
  let imgPath = `/staged_images/pool/${item.id}.jpg`;
  if (fs.existsSync(`./public/staged_images/${item.id}.jpg`)) {
    imgPath = `/staged_images/${item.id}.jpg`;
  }

  let fileSize = 50000;
  const localFile = `./public${imgPath}`;
  if (fs.existsSync(localFile)) {
    try {
      fileSize = fs.statSync(localFile).size;
    } catch (_) {}
  }

  fullPool.push({
    id: item.id,
    suggestedName: item.name_he,
    topic: item.category,
    imageUrl: imgPath,
    fileSize: fileSize,
    everyday_associations: item.everyday_associations
  });
}

console.log(`Generated full STAGED_IMAGES_POOL with ${fullPool.length} items!`);

const outputContent = `// STAGED IMAGES POOL (1,000+ MASTER ARSENAL INTEGRATION)
// Total items: ${fullPool.length}

export const STAGED_IMAGES_POOL = ${JSON.stringify(fullPool, null, 2)};

export default STAGED_IMAGES_POOL;
`;

fs.writeFileSync('./src/data/stagedImagesPool.js', outputContent, 'utf8');
console.log('Successfully written to src/data/stagedImagesPool.js');
