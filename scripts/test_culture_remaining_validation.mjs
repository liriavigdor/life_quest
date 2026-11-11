import { cultureRemainingCuration } from './curation_data/cat_culture_remaining.js';
import { validateBranches } from './branch_validator.mjs';

let errors = 0;
const keys = Object.keys(cultureRemainingCuration);
console.log(`Validating ${keys.length} culture & remaining items...`);

for (const [id, data] of Object.entries(cultureRemainingCuration)) {
  const invalid = validateBranches(data.name, data.branches);
  if (invalid.length > 0) {
    errors++;
    console.error(`ERROR in ${id} ("${data.name}"):`, invalid);
  }
}

if (errors === 0) {
  console.log(`ALL ${keys.length} culture & remaining items passed strict branch isolation!`);
} else {
  console.log(`Found ${errors} errors in culture & remaining!`);
}

