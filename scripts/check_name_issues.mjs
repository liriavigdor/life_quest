import fs from 'node:fs';

const items = JSON.parse(fs.readFileSync('scripts/unhandled_332_items.json', 'utf8'));

const nameIssues = [];

items.forEach(it => {
  const n = it.name;
  if (n.includes('/') || n.endsWith(' ניו') || n.endsWith(' סמי') || n.endsWith(' פני') || n.endsWith('_') || n.includes('__') || n.length < 3) {
    nameIssues.push({ id: it.id, currentName: n });
  }
});

console.log(`Found ${nameIssues.length} items with name issues:`);
console.log(nameIssues);

