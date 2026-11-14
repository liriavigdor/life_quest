import { CURATED_USER_REPOSITORY_SEED } from '../src/data/curatedUserRepositorySeed.js';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

const normalize = (s) => (s || '').trim().toLowerCase()
  .replace(/[״"'`()\[\]{}.,:;!?\-–—\/\s]+/g, '')
  .replace(/ם/g, 'מ').replace(/ן/g, 'נ').replace(/ץ/g, 'צ').replace(/ף/g, 'פ').replace(/ך/g, 'כ');

const existingRootMap = new Map();
for (const s of CURATED_USER_REPOSITORY_SEED) {
  const k = normalize(s.title);
  if (k) existingRootMap.set(k, s);
}

const collisions = [];
for (const draft of INITIAL_CREATION_DRAFT_ROOTS) {
  const k = normalize(draft.title);
  if (existingRootMap.has(k)) {
    collisions.push({
      draftId: draft.id,
      draftTitle: draft.title,
      existingId: existingRootMap.get(k).id,
      existingTitle: existingRootMap.get(k).title,
      existingKeywords: existingRootMap.get(k).keywords
    });
  }
}

console.log('Total drafts:', INITIAL_CREATION_DRAFT_ROOTS.length);
console.log('Collisions found with existing repository:', collisions.length);
console.log(JSON.stringify(collisions, null, 2));

