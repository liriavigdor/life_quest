import fs from 'fs';
import path from 'path';
import { CURATED_USER_REPOSITORY_SEED, DISCARDED_STAGED_IDS } from '../src/data/curatedUserRepositorySeed.js';

const HIGH_YIELD_APPROVED_ANCHORS = [
  {
    id: 'approved_madonna',
    name: 'מדונה',
    title: 'מדונה',
    imageUrl: '/staged_images/pool/ingested_מדונה_1795114430899.jpg',
    keywords: ['הופעה', 'זמרת', 'קונצרט', 'כרטיסים', 'מוזיקה', 'שיר', 'במה'],
    association: 'הופעה, זמרת, קונצרט, כרטיסים, מוזיקה',
    domain: 'daily_life',
    category: '🎤 תרבות ובמה',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_dumbledore',
    name: 'דמבלדור',
    title: 'דמבלדור',
    imageUrl: '/staged_images/pool/ingested_דמבלדור_1795105436530.jpg',
    keywords: ['קסם', 'שרביט', 'הארי פוטר', 'חכמה', 'מבחן', 'לימודים'],
    association: 'קסם, שרביט, הארי פוטר, חכמה, מבחן',
    domain: 'daily_life',
    category: '🧙‍♂️ מיתולוגיה ופנטזיה',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_james_bond',
    name: "ג'יימס בונד",
    title: "ג'יימס בונד",
    imageUrl: '/staged_images/pool/ingested_ג_יימס_בונד_1795105206128.jpg',
    keywords: ['ריגול', 'סודי', 'חליפה', 'מבצע', 'דרכון', 'סוכן'],
    association: 'ריגול, סודי, חליפה, מבצע, דרכון',
    domain: 'daily_life',
    category: '🕵️ דמויות וקולנוע',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_rabbit_speed',
    name: 'ארנב',
    title: 'ארנב',
    imageUrl: '/staged_images/pool/ingested_ארנב_1795103326144.jpg',
    keywords: ['להכפיל', 'מהירות', 'ריבוי', 'ריצה', 'זריזות', 'טבע'],
    association: 'להכפיל, מהירות, ריבוי, ריצה',
    domain: 'daily_life',
    category: '🐰 טבע וחיות',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_gift_box_ribbon',
    name: 'קופסת מתנה מהודרת',
    title: 'קופסת מתנה',
    imageUrl: '/staged_images/pool/ingested_קופסת_מתנה_1795105240605.jpg',
    keywords: ['מתנה', 'יום הולדת', 'הפתעה', 'סרט', 'אירוע', 'חגיגה'],
    association: 'מתנה, יום הולדת, הפתעה, סרט',
    domain: 'daily_life',
    category: '🎁 אירועים ושמחות',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_giant_stadium',
    name: 'אצטדיון ענק',
    title: 'אצטדיון ענק',
    imageUrl: '/staged_images/pool/ingested_אצטדיון_ענק_1795114447989.jpg',
    keywords: ['הופעה', 'משחק', 'כדורגל', 'קהל', 'כרטיסים', 'אירוע'],
    association: 'הופעה, משחק, כדורגל, קהל, כרטיסים',
    domain: 'daily_life',
    category: '🏟️ אצטדיונים וספורט',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_drumsticks_percussion',
    name: 'מקלות תיפוף',
    title: 'מקלות תיפוף',
    imageUrl: '/staged_images/pool/ingested_מקלות_תיפוף_1795114494207.jpg',
    keywords: ['קצב', 'תופים', 'הופעה', 'מוזיקה', 'אימון', 'להקה'],
    association: 'קצב, תופים, הופעה, מוזיקה, אימון',
    domain: 'daily_life',
    category: '🥁 כלי נגינה',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_green_cap_diesel',
    name: 'פקק ירוק',
    title: 'פקק ירוק',
    imageUrl: '/staged_images/pool/ingested_פקק_ירוק_1795108459543.jpg',
    keywords: ['סולר', 'דלק', 'תדלוק', 'משאבה', 'רכב'],
    association: 'סולר, דלק, תדלוק, משאבה',
    domain: 'daily_life',
    category: '⛽ תחבורה ודלק',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_safety_vest_glow',
    name: 'אפוד זוהר',
    title: 'אפוד זוהר',
    imageUrl: '/staged_images/pool/ingested_אפוד_זוהר_1795095372072.jpg',
    keywords: ['טסט', 'רכב', 'בטיחות', 'בדיקה', 'בלמים', 'זהירות'],
    association: 'טסט, רכב, בטיחות, בדיקה',
    domain: 'daily_life',
    category: '🦺 בטיחות ורכב',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  },
  {
    id: 'approved_helium_balloon',
    name: 'בלון הליום',
    title: 'בלון הליום',
    imageUrl: '/staged_images/pool/ingested_בלון_הליום_1795093244236.jpg',
    keywords: ['יום הולדת', 'חגיגה', 'מתנה', 'מסיבה', 'ילדים'],
    association: 'יום הולדת, חגיגה, מתנה, מסיבה',
    domain: 'daily_life',
    category: '🎈 אירועים',
    isUserApproved: true,
    isCuratedSeed: true,
    createdAt: Date.now()
  }
];

const existingKeys = new Set(CURATED_USER_REPOSITORY_SEED.map(i => i.title));
const existingUrls = new Set(CURATED_USER_REPOSITORY_SEED.map(i => i.imageUrl));

const toAdd = HIGH_YIELD_APPROVED_ANCHORS.filter(item => {
  return !existingKeys.has(item.title) && !existingUrls.has(item.imageUrl);
});

console.log(`Found ${toAdd.length} high-yield anchors to add to seed.`);

const updatedSeed = [...toAdd, ...CURATED_USER_REPOSITORY_SEED];

const seedFileContent = `export const CURATED_USER_REPOSITORY_SEED = ${JSON.stringify(updatedSeed, null, 2)};

export const DISCARDED_STAGED_IDS = ${JSON.stringify(DISCARDED_STAGED_IDS || [], null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/curatedUserRepositorySeed.js'), seedFileContent, 'utf8');
console.log(`Successfully updated curatedUserRepositorySeed.js! Total items: ${updatedSeed.length}`);
