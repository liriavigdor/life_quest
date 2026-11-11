import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

console.log('Total in arsenal:', arsenal.length);

// Let's find capri_faraglioni_rocks
const capriIdx = arsenal.findIndex(x => x.id === 'capri_faraglioni_rocks');
console.log('capri_faraglioni_rocks index:', capriIdx, '1-based:', capriIdx + 1);

// What is around 80?
console.log('Item 80 (1-based, index 79):', arsenal[79]?.id, arsenal[79]?.name_he);
console.log('Item 96 (1-based, index 95):', arsenal[95]?.id, arsenal[95]?.name_he);
console.log('Item 99 (1-based, index 98):', arsenal[98]?.id, arsenal[98]?.name_he);

// Print items 75 to 105
for (let i = 74; i <= 104 && i < arsenal.length; i++) {
  console.log(`${i + 1}: ${arsenal[i].id} (${arsenal[i].name_he})`);
}
