import fs from 'node:fs';
const s = JSON.parse(fs.readFileSync('scripts/sports_50.json', 'utf8'));
console.log(s.map(x => x.id + ': ' + x.name).join('\n'));

