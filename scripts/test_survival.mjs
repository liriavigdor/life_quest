import fs from 'fs';

const matchedUserItems = JSON.parse(fs.readFileSync('scripts/matched_user_items.json', 'utf8'));
const missingUserItems = JSON.parse(fs.readFileSync('scripts/missing_user_items.json', 'utf8'));
const arsenalToDelete = JSON.parse(fs.readFileSync('scripts/arsenal_items_to_delete.json', 'utf8'));
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

console.log(`Matched (already in repository): ${matchedUserItems.length}`);
console.log(`Missing (to be added to reach 500): ${missingUserItems.length}`);
console.log(`Current items to delete (not in user 500): ${arsenalToDelete.length}`);

// Let's verify how many current arsenal items survive
const survivingArsenal = currentArsenal.filter(a => {
  return matchedUserItems.some(m => m.matchedArsenalId === a.id);
});

console.log(`Surviving arsenal items: ${survivingArsenal.length}`);

// Print category breakdown of surviving items
const survivingByCat = {};
survivingArsenal.forEach(it => {
  const c = it.theme_he || it.category;
  survivingByCat[c] = (survivingByCat[c] || 0) + 1;
});
console.log('Surviving items by category:', survivingByCat);
