import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CLEAN_NAME_MAP } from './clean_canonical_maps.mjs';
import { getCuratedAssociations } from './curated_associations_map.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../public/data/masterMnemonicArsenal1000.json');
const jsPath = path.resolve(__dirname, '../src/data/masterMnemonicArsenal1000.js');
const poolJsPath = path.resolve(__dirname, '../src/data/stagedImagesPool.js');

const arsenal = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log(`Processing ${arsenal.length} items for complete curation & sync...`);

const updatedArsenal = arsenal.map(item => {
  let cleanName = item.name_he;
  let cleanDesc = item.desc_he || '';

  // 1. Check if item has explicit curated clean name/desc
  if (CLEAN_NAME_MAP[item.num]) {
    cleanName = CLEAN_NAME_MAP[item.num].name;
    cleanDesc = CLEAN_NAME_MAP[item.num].desc;
  } else {
    // 2. Automated cleaning of trailing (מסמל, (מסמלת, :, -, etc.
    cleanName = cleanName
      .replace(/\s*\(מסמל[ת]?.*$/, '')
      .replace(/:\s*$/, '')
      .replace(/\s*–.*$/, '')
      .replace(/\s*-.*$/, '')
      .trim();
    
    // Remove unmatched opening/closing parenthesis at end
    if (cleanName.endsWith('(') || cleanName.endsWith(')')) {
      const openCount = (cleanName.match(/\(/g) || []).length;
      const closeCount = (cleanName.match(/\)/g) || []).length;
      if (openCount > closeCount) cleanName = cleanName.replace(/\($/, '').trim();
      if (closeCount > openCount) cleanName = cleanName.replace(/\)$/, '').trim();
    }

    if (cleanDesc) {
      cleanDesc = cleanDesc.replace(/\)$/, '').replace(/:\s*$/, '').trim();
    }
  }

  // 3. Associations: 2 to 4 everyday words, zero filler, quality over quantity
  const assocs = getCuratedAssociations({
    ...item,
    name_he: cleanName
  });

  return {
    ...item,
    name_he: cleanName,
    suggestedName: cleanName,
    desc_he: cleanDesc,
    search_query: cleanName,
    everyday_associations: assocs
  };
});

// Validation checks
let badWordsCount = 0;
let lengthErrorCount = 0;
updatedArsenal.forEach(item => {
  if (item.everyday_associations.length < 2 || item.everyday_associations.length > 5) {
    lengthErrorCount++;
  }
  item.everyday_associations.forEach(w => {
    if (w.includes(' ') || w.length < 2) badWordsCount++;
  });
});

console.log(`Validation results:`);
console.log(`- Items with invalid word counts (<2 or >5): ${lengthErrorCount}`);
console.log(`- Invalid words (spaces or length < 2): ${badWordsCount}`);

if (badWordsCount === 0 && lengthErrorCount === 0) {
  // Save to public/data/masterMnemonicArsenal1000.json
  fs.writeFileSync(jsonPath, JSON.stringify(updatedArsenal, null, 2), 'utf8');
  console.log(`✓ Saved ${jsonPath}`);

  // Save to src/data/masterMnemonicArsenal1000.js
  const jsContent = `// Auto-generated Master Mnemonic Arsenal (500 Canonical Items)\nexport const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(updatedArsenal, null, 2)};\n\nexport default MASTER_MNEMONIC_ARSENAL;\n`;
  fs.writeFileSync(jsPath, jsContent, 'utf8');
  console.log(`✓ Saved ${jsPath}`);

  // Sync with src/data/stagedImagesPool.js
  const poolItems = updatedArsenal.map(item => ({
    id: item.id,
    num: item.num,
    name: item.name_he,
    category: item.category,
    theme: item.theme,
    theme_he: item.theme_he,
    imageUrl: item.imageUrl,
    associations: item.everyday_associations,
    is_basic: item.is_basic || false
  }));

  const poolJsContent = `// Auto-generated Staged Images Pool (Synchronized with 500 Canonical Items)\nexport const STAGED_IMAGES_POOL = ${JSON.stringify(poolItems, null, 2)};\n\nexport default STAGED_IMAGES_POOL;\n`;
  fs.writeFileSync(poolJsPath, poolJsContent, 'utf8');
  console.log(`✓ Saved ${poolJsPath}`);

  console.log('🎉 Successfully applied comprehensive catalog curation!');
} else {
  console.error('❌ Validation failed! Did not overwrite production files.');
}
