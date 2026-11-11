import { vehiclesCuration } from './curation_data/cat_vehicles.js';
import { natureCuration } from './curation_data/cat_nature.js';
import { sportsCuration } from './curation_data/cat_sports.js';
import { toolsCuration } from './curation_data/cat_tools.js';
import { cultureRemainingCuration } from './curation_data/cat_culture_remaining.js';
import { validateBranches } from './branch_validator.mjs';

const all = {
  ...vehiclesCuration,
  ...natureCuration,
  ...sportsCuration,
  ...toolsCuration,
  ...cultureRemainingCuration,
};

let errors = 0;
for (const [id, entry] of Object.entries(all)) {
  const inv = validateBranches(entry.name, entry.branches);
  if (inv.length > 0) {
    console.log(`OVERLAP [${id}] (${entry.name}):`, inv);
    errors++;
  }
  for (const b of entry.branches) {
    const words = b.trim().split(/\s+/);
    if (words.length > 2) {
      console.log(`LONG BRANCH [${id}] (${entry.name}): "${b}"`);
      errors++;
    }
  }
}
console.log(`Checked ${Object.keys(all).length} items. Total errors: ${errors}`);

