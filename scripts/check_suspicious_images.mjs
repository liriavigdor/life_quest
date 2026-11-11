import fs from 'node:fs';
import path from 'node:path';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

const suspicious = [];
items.forEach(it => {
  let filePath = path.resolve('public' + it.imageUrl);
  if (!fs.existsSync(filePath)) {
    suspicious.push({ id: it.id, name: it.name, reason: 'File does not exist' });
  } else {
    const stat = fs.statSync(filePath);
    if (stat.size < 15000) {
      suspicious.push({ id: it.id, name: it.name, reason: `Tiny file size: ${stat.size} bytes` });
    }
  }
});

console.log(`Found ${suspicious.length} suspicious image files:`);
console.log(suspicious);

