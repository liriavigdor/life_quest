import fs from 'fs';

const txt = fs.readFileSync('src/data/celebrityMnemonicCatalog.js', 'utf8');
const matches = [...txt.matchAll(/id:\s*['"]([a-zA-Z0-9_]+)['"]/g)].map(m => m[1]);
console.log('Found IDs:', matches);
