import { vehiclesCuration } from './curation_data/cat_vehicles.js';
import { validateBranches } from './branch_validator.mjs';

let errors = 0;
const keys = Object.keys(vehiclesCuration);
console.log(`Validating ${keys.length} vehicle items...`);

for (const [id, data] of Object.entries(vehiclesCuration)) {
  const invalid = validateBranches(data.name, data.branches);
  if (invalid.length > 0) {
    errors++;
    console.error(`ERROR in ${id} ("${data.name}"):`, invalid);
  }
}

if (errors === 0) {
  console.log(`ALL ${keys.length} vehicles passed strict branch isolation!`);
} else {
  console.log(`Found ${errors} errors in vehicles!`);
}

