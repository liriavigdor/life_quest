import fs from 'fs';
import path from 'path';
import { db } from '../src/firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { DISCARDED_STAGED_IDS } from '../src/data/curatedUserRepositorySeed.js';

async function main() {
  const snap = await getDocs(collection(db, 'user_mnemonic_images'));
  const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  const content = `/**
 * Curated User Repository Seed
 * סונכרן ישירות ומלא מול Firestore כולל כל 48 הפריטים והענפים החדשים!
 * סה"כ: ${docs.length} שורשים ייחודיים.
 */

export const CURATED_USER_REPOSITORY_SEED = ${JSON.stringify(docs, null, 2)};

export const DISCARDED_STAGED_IDS = ${JSON.stringify(DISCARDED_STAGED_IDS || [], null, 2)};
`;

  fs.writeFileSync(path.resolve('src/data/curatedUserRepositorySeed.js'), content, 'utf8');
  console.log(`Successfully synced ${docs.length} items from Firestore to curatedUserRepositorySeed.js!`);
}

main().catch(console.error);

