import fs from 'node:fs';
const t = JSON.parse(fs.readFileSync('scripts/tools_50.json', 'utf8'));
console.log(t.map(x => x.id + ': ' + x.name).join('\n'));

