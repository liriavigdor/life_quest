import fs from 'fs';
import { ASSOCS_1_TO_100 } from './single_word_assocs_part1.mjs';
import { ASSOCS_101_TO_200 } from './single_word_assocs_part2.mjs';
import { ASSOCS_201_TO_300 } from './single_word_assocs_part3.mjs';
import { ASSOCS_301_TO_400 } from './single_word_assocs_part4.mjs';
import { ASSOCS_401_TO_500 } from './single_word_assocs_part5.mjs';

const allAssocs = {
  ...ASSOCS_1_TO_100,
  ...ASSOCS_101_TO_200,
  ...ASSOCS_201_TO_300,
  ...ASSOCS_301_TO_400,
  ...ASSOCS_401_TO_500
};

console.log('Total items in merged associations map:', Object.keys(allAssocs).length);

// Validation
const errors = [];
for (let num = 1; num <= 500; num++) {
  const list = allAssocs[num];
  if (!list) {
    errors.push(`Missing item ${num}`);
    continue;
  }
  if (!Array.isArray(list) || list.length !== 5) {
    errors.push(`Item ${num} does not have exactly 5 associations (has ${list ? list.length : 0})`);
    continue;
  }
  for (let i = 0; i < list.length; i++) {
    const word = list[i];
    if (typeof word !== 'string' || word.trim().length === 0) {
      errors.push(`Item ${num} association [${i}] is not a valid string: "${word}"`);
    } else if (word.includes(' ')) {
      errors.push(`Item ${num} association [${i}] contains a space: "${word}"`);
    }
  }
}

if (errors.length > 0) {
  console.error(`Found ${errors.length} validation errors:`);
  console.error(errors.slice(0, 30));
  process.exit(1);
}

console.log('✅ 100% VALIDATION PASSED! All 500 items have EXACTLY 5 single-word associations with ZERO spaces!');

// Update masterMnemonicArsenal1000.json
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

currentArsenal.forEach(item => {
  if (allAssocs[item.num]) {
    item.everyday_associations = allAssocs[item.num];
  }
});

fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(currentArsenal, null, 2), 'utf8');
console.log('Updated public/data/masterMnemonicArsenal1000.json');

// Update src/data/masterMnemonicArsenal1000.js
const jsArsenal = `// LIFEQUEST CANONICAL 500 MNEMONIC ARSENAL
// Strictly curated 500 iconic cultural symbols, landmarks, characters and objects
// EXACTLY 5 single-word associations per item (zero spaces, pure single words)

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(currentArsenal, null, 2)};
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsArsenal, 'utf8');
console.log('Updated src/data/masterMnemonicArsenal1000.js');

// Update src/data/stagedImagesPool.js
const stagedPoolItems = currentArsenal.map(item => ({
  id: item.id,
  num: item.num,
  suggestedName: item.name_he,
  topic: item.theme,
  theme: item.theme,
  theme_he: item.theme_he,
  is_basic: item.is_basic,
  imageUrl: item.imageUrl,
  everyday_associations: item.everyday_associations
}));

const jsStagedPool = `// STAGED IMAGES POOL (CANONICAL 500 ARSENAL)
// Total items: 500
// Structured by user categories and themes
// EXACTLY 5 single-word associations per item

export const STAGED_IMAGES_POOL = ${JSON.stringify(stagedPoolItems, null, 2)};
`;
fs.writeFileSync('src/data/stagedImagesPool.js', jsStagedPool, 'utf8');
console.log('Updated src/data/stagedImagesPool.js');

console.log('ALL FILES UPDATED WITH MAXIMUM PRECISION SINGLE-WORD ASSOCIATIONS!');
