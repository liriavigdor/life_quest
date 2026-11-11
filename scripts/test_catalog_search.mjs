import { findMnemonicAssetByKeyword } from '../src/data/mnemonicAssociativeCatalog.js';

const testWords = ['דמעה', 'מרק', 'שף', 'כובע', 'חליפה', 'משקפיים', 'טלפון', 'מפתחות'];

console.log('Testing associative word matches:');
for (const word of testWords) {
  const result = findMnemonicAssetByKeyword(word);
  if (result) {
    console.log(`✓ "${word}" -> ${result.id} ("${result.name}") [${result.imageUrl}]`);
  } else {
    console.log(`❌ "${word}" -> NOT FOUND`);
  }
}
