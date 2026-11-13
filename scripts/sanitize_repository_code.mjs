import fs from 'fs';

let code = fs.readFileSync('src/utils/userImageRepository.js', 'utf8');

// 1. Remove the empty EXPLICIT_REPOSITORY_ANCHOR_BRANCHES loop inside sanitizeUserRecord
const loopPattern = /for\s*\(\s*const\s+entry\s+of\s+EXPLICIT_REPOSITORY_ANCHOR_BRANCHES\s*\)\s*\{[\s\S]*?return\s+changed;\s*\n\s*\}/;
code = code.replace(loopPattern, '// EXPLICIT_REPOSITORY_ANCHOR_BRANCHES was deprecated and emptied');

// 2. Enhance raw keyword cleanup in sanitizeUserRecord
const targetBlock = `  const rawList = Array.isArray(record.keywords) ? record.keywords : [];
  const cleanList = [];
  for (const raw of rawList) {
    const str = String(raw).trim();
    if (!str || str.length < 2) continue;
    if (BANNED_PERSON_AND_VERBS.has(str)) continue;

    if (!cleanList.includes(str) && cleanList.length < 8) {
      cleanList.push(str);
    }
  }`;

const replacementBlock = `  const titleWords = new Set(
    title.toLowerCase().replace(/[()\\/\\"'’\`\\-]/g, ' ').split(/\\s+/).filter(w => w.length > 1)
  );

  const rawList = Array.isArray(record.keywords) ? record.keywords : [];
  const cleanList = [];
  for (const raw of rawList) {
    const str = String(raw).trim();
    if (!str || str.length < 2 || str.includes(' ')) continue;
    if (BANNED_PERSON_AND_VERBS.has(str)) continue;
    if (titleWords.has(str.toLowerCase())) continue;

    if (!cleanList.includes(str) && cleanList.length < 4) {
      cleanList.push(str);
    }
  }`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, replacementBlock);
  console.log('Replaced target block in sanitizeUserRecord successfully');
} else {
  console.log('Target block not found verbatim, checking normalized whitespace...');
  // Normalized replacement
  const normCode = code.replace(/\r\n/g, '\n');
  const normTarget = targetBlock.replace(/\r\n/g, '\n');
  if (normCode.includes(normTarget)) {
    code = normCode.replace(normTarget, replacementBlock);
    console.log('Replaced normalized target block successfully');
  } else {
    console.warn('Could not match targetBlock');
  }
}

fs.writeFileSync('src/utils/userImageRepository.js', code, 'utf8');
console.log('userImageRepository.js updated.');

