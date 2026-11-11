import { toolsCuration } from './curation_data/cat_tools.js';
import { validateBranches } from './branch_validator.mjs';

let errors = 0;
const keys = Object.keys(toolsCuration);
console.log(`Validating ${keys.length} tools items...`);

for (const [id, data] of Object.entries(toolsCuration)) {
  const invalid = validateBranches(data.name, data.branches);
  if (invalid.length > 0) {
    errors++;
    console.error(`ERROR in ${id} ("${data.name}"):`, invalid);
  }
}

if (errors === 0) {
  console.log(`ALL ${keys.length} tools items passed strict branch isolation!`);
} else {
  console.log(`Found ${errors} errors in tools!`);
}

