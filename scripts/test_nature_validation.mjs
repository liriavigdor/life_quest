import { natureCuration } from './curation_data/cat_nature.js';
import { validateBranches } from './branch_validator.mjs';

let errors = 0;
const keys = Object.keys(natureCuration);
console.log(`Validating ${keys.length} nature items...`);

for (const [id, data] of Object.entries(natureCuration)) {
  const invalid = validateBranches(data.name, data.branches);
  if (invalid.length > 0) {
    errors++;
    console.error(`ERROR in ${id} ("${data.name}"):`, invalid);
  }
}

if (errors === 0) {
  console.log(`ALL ${keys.length} nature items passed strict branch isolation!`);
} else {
  console.log(`Found ${errors} errors in nature!`);
}

