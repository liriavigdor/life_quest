import fs from 'fs';

// 1. user_curation_state.json
const stateFile = 'public/data/user_curation_state.json';
const state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
state.localEdits = state.localEdits || {};
state.localEdits['classic_cartoon_bomb'] = {
  title: 'פצצה',
  imageUrl: '/staged_images/pool/classic_cartoon_bomb.png',
  keywords: ['דדליין', 'דחוף', 'חירום', 'אזהרה'],
  caption: 'פצצה שחורה עם פתיל בוער וניצוצות הממחישה דדליין בוער ומשימות דחופות!',
  isModified: true
};
fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');

// 2. Add to curatedUserRepositorySeed.js
const seedFile = 'src/data/curatedUserRepositorySeed.js';
let seedContent = fs.readFileSync(seedFile, 'utf8');
if (!seedContent.includes('classic_cartoon_bomb')) {
  const newRecord = `  {
    "id": "classic_cartoon_bomb",
    "name": "פצצה",
    "title": "פצצה",
    "imageUrl": "/staged_images/pool/classic_cartoon_bomb.png",
    "keywords": [
      "דדליין",
      "דחוף",
      "חירום",
      "אזהרה"
    ],
    "association": "דדליין, דחוף, חירום, אזהרה",
    "caption": "פצצה שחורה עם פתיל בוער וניצוצות הממחישה דדליין בוער ומשימות דחופות!",
    "domain": "daily_life",
    "category": "🧠 4. קלישאות ויזואליות, רעיונות ומושגים (151–200)",
    "uploaderName": "חן + AI",
    "isUserApproved": true,
    "isCuratedSeed": true,
    "createdAt": ${Date.now()}
  },\n`;
  const insertMarker = 'export const CURATED_USER_REPOSITORY_SEED = [\n';
  const insertIdx = seedContent.indexOf(insertMarker) + insertMarker.length;
  seedContent = seedContent.slice(0, insertIdx) + newRecord + seedContent.slice(insertIdx);
  fs.writeFileSync(seedFile, seedContent, 'utf8');
}

// 3. Add to auditedImagesPool.js
const audFile = 'src/data/auditedImagesPool.js';
let audContent = fs.readFileSync(audFile, 'utf8');
if (!audContent.includes('classic_cartoon_bomb')) {
  const newAud = `  {
    "id": "classic_cartoon_bomb",
    "name": "פצצה",
    "title": "פצצה",
    "imageUrl": "/staged_images/pool/classic_cartoon_bomb.png",
    "branches": ["דדליין", "דחוף", "חירום", "אזהרה"],
    "keywords": ["דדליין", "דחוף", "חירום", "אזהרה"],
    "caption": "פצצה שחורה עם פתיל בוער וניצוצות הממחישה דדליין בוער ומשימות דחופות!",
    "category": "🧠 4. קלישאות ויזואליות, רעיונות ומושגים (151–200)",
    "isVerified": true
  },\n`;
  const insMarker = 'export const AUDITED_VERIFIED_POOL = [\n';
  const ins = audContent.indexOf(insMarker) + insMarker.length;
  audContent = audContent.slice(0, ins) + newAud + audContent.slice(ins);
  fs.writeFileSync(audFile, audContent, 'utf8');
}

console.log('Classic Bomb added to all pools successfully!');

