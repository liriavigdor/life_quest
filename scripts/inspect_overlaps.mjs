import fs from 'fs';
import { validateBranches } from './branch_validator.mjs';

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const localEdits = state.localEdits || {};
const { CURATED_USER_REPOSITORY_SEED } = await import('../src/data/curatedUserRepositorySeed.js');

const overlapItems = [];

for (const item of CURATED_USER_REPOSITORY_SEED) {
  const edit = localEdits[item.id] || {};
  const title = edit.title || item.title || item.name;
  const branches = edit.keywords || item.keywords || [];

  const overlaps = validateBranches(title, branches);
  if (overlaps.length > 0) {
    overlapItems.push({
      id: item.id,
      title,
      branches,
      overlaps: overlaps.map(o => o.branch)
    });
  }
}

console.log(`Found ${overlapItems.length} items with root overlaps:`);
for (const it of overlapItems) {
  console.log(`- ID: ${it.id.padEnd(35)} | Title: "${it.title}"`);
  console.log(`  Current branches: ${JSON.stringify(it.branches)}`);
  console.log(`  Overlapping words: ${JSON.stringify(it.overlaps)}`);
}

