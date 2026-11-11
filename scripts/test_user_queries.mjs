import { findMnemonicAssetByKeyword } from '../src/data/mnemonicAssociativeCatalog.js';

const testQueries = [
  'חשמלאי',
  'חשמל',
  'לתקן חשמל',
  'טבעת',
  'טבעות',
  'אינסטלטור',
  'ברז',
  'צינור',
  'שיניים',
  'רופא שיניים',
  'דם',
  'בדיקת דם',
  'תספורת',
  'מספרה',
  'צמיג',
  'פנצ\'ר',
  'קניות',
  'סופר',
  'מנעול',
  'קביים'
];

console.log('Testing everyday user queries against the mnemonic associative catalog:');
console.log('----------------------------------------------------------------------');

for (const q of testQueries) {
  const match = findMnemonicAssetByKeyword(q);
  if (match) {
    console.log(`✅ Query: "${q}" --> Matched: "${match.title}" (Keywords: ${match.keywords.join(', ')})`);
  } else {
    console.log(`❌ Query: "${q}" --> No match found!`);
  }
}
