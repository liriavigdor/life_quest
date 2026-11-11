import { sportsCuration } from './curation_data/cat_sports.js';
import { validateBranches } from './branch_validator.mjs';

let errors = 0;
const keys = Object.keys(sportsCuration);
console.log(`Validating ${keys.length} sports items...`);

for (const [id, data] of Object.entries(sportsCuration)) {
  const invalid = validateBranches(data.name, data.branches);
  if (invalid.length > 0) {
    errors++;
    console.error(`ERROR in ${id} ("${data.name}"):`, invalid);
  }
}

if (errors === 0) {
  console.log(`ALL ${keys.length} sports items passed strict branch isolation!`);
} else {
  console.log(`Found ${errors} errors in sports!`);
}

