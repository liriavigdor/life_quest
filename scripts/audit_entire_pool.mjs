import fs from 'fs';
import { validateBranches } from './branch_validator.mjs';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const localEdits = state.localEdits || {};
const { CURATED_USER_REPOSITORY_SEED } = await import('../src/data/curatedUserRepositorySeed.js');

console.log(`Total items in CURATED_USER_REPOSITORY_SEED: ${CURATED_USER_REPOSITORY_SEED.length}`);

const overlapIssues = [];
const suspiciousTagIssues = [];
const multiWordBranches = [];
const tooFewBranches = [];

const SUSPICIOUS_WORDS = new Set([
  'יום', 'ביום', 'רביעי', 'חמישי', 'שלישי', 'שני', 'ראשון', 'שישי', 'שבת',
  'להחזיר', 'לקנות', 'לקחת', 'למסור', 'לסדר', 'לנקות', 'לשטוף', 'לשחק',
  'כדורגל', 'ספורט', 'גול' // we check who has these
]);

for (const item of CURATED_USER_REPOSITORY_SEED) {
  const edit = localEdits[item.id] || {};
  const title = edit.title || item.title || item.name;
  const branches = edit.keywords || item.keywords || [];

  // 1. Root overlap
  const overlaps = validateBranches(title, branches);
  if (overlaps.length > 0) {
    overlapIssues.push({ id: item.id, title, overlaps: overlaps.map(o => o.branch) });
  }

  // 2. Multi-word branches (rule is single word!)
  const multi = branches.filter(b => b.trim().includes(' '));
  if (multi.length > 0) {
    multiWordBranches.push({ id: item.id, title, multi });
  }

  // 3. Suspicious words
  for (const b of branches) {
    const cleanB = b.trim();
    if (SUSPICIOUS_WORDS.has(cleanB)) {
      // Check if legitimate (e.g. soccer ball or referee or messi having כדורגל is legitimate, but gollum or random items having כדורגל is not)
      suspiciousTagIssues.push({ id: item.id, title, word: cleanB });
    }
  }

  // 4. Too few branches (< 2)
  if (branches.length < 2) {
    tooFewBranches.push({ id: item.id, title, count: branches.length });
  }
}

console.log(`\n=== 1. Root Overlap Issues (${overlapIssues.length}) ===`);
for (const o of overlapIssues.slice(0, 20)) {
  console.log(`  ${o.id.padEnd(35)} | "${o.title}" has root in branch: ${JSON.stringify(o.overlaps)}`);
}
if (overlapIssues.length > 20) {
  console.log(`  ... and ${overlapIssues.length - 20} more.`);
}

console.log(`\n=== 2. Multi-Word Branches (${multiWordBranches.length}) ===`);
for (const m of multiWordBranches.slice(0, 15)) {
  console.log(`  ${m.id.padEnd(35)} | "${m.title}": ${JSON.stringify(m.multi)}`);
}

console.log(`\n=== 3. Suspicious / Leaked Tags (${suspiciousTagIssues.length}) ===`);
for (const s of suspiciousTagIssues) {
  console.log(`  ${s.id.padEnd(35)} | "${s.title}": "${s.word}"`);
}

console.log(`\n=== 4. Too Few Branches (${tooFewBranches.length}) ===`);
for (const t of tooFewBranches) {
  console.log(`  ${t.id.padEnd(35)} | "${t.title}" has only ${t.count} branches`);
}

