import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/staged_images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. סלבס (אישים מפורסמים)
const CELEBRITIES = [
  { id: 'albert_einstein', wiki: 'Albert_Einstein', name: 'אלברט איינשטיין', topic: 'celebrities' },
  { id: 'steve_jobs', wiki: 'Steve_Jobs', name: 'סטיב ג\'ובס', topic: 'celebrities' },
  { id: 'elon_musk', wiki: 'Elon_Musk', name: 'אילון מאסק', topic: 'celebrities' },
  { id: 'michael_jordan', wiki: 'Michael_Jordan', name: 'מייקל ג\'ורדן', topic: 'celebrities' },
  { id: 'lionel_messi', wiki: 'Lionel_Messi', name: 'ליאו מסי', topic: 'celebrities' },
  { id: 'cristiano_ronaldo', wiki: 'Cristiano_Ronaldo', name: 'כריסטיאנו רונאלדו', topic: 'celebrities' },
  { id: 'mike_tyson', wiki: 'Mike_Tyson', name: 'מייק טייסון', topic: 'celebrities' },
  { id: 'muhammad_ali', wiki: 'Muhammad_Ali', name: 'מוחמד עלי', topic: 'celebrities' },
  { id: 'michael_jackson', wiki: 'Michael_Jackson', name: 'מייקל ג\'קסון', topic: 'celebrities' },
  { id: 'elvis_presley', wiki: 'Elvis_Presley', name: 'אלביס פרסלי', topic: 'celebrities' },
  { id: 'freddie_mercury', wiki: 'Freddie_Mercury', name: 'פרדי מרקורי', topic: 'celebrities' },
  { id: 'charlie_chaplin', wiki: 'Charlie_Chaplin', name: 'צ\'ארלי צ\'פלין', topic: 'celebrities' },
  { id: 'marilyn_monroe', wiki: 'Marilyn_Monroe', name: 'מרילין מונרו', topic: 'celebrities' },
  { id: 'leonardo_dicaprio', wiki: 'Leonardo_DiCaprio', name: 'לאונרדו דיקפריו', topic: 'celebrities' },
  { id: 'arnold_schwarzenegger', wiki: 'Arnold_Schwarzenegger', name: 'ארנולד שוורצנגר', topic: 'celebrities' },
  { id: 'usain_bolt', wiki: 'Usain_Bolt', name: 'יוסיין בולט', topic: 'celebrities' },
  { id: 'bill_gates', wiki: 'Bill_Gates', name: 'ביל גייטס', topic: 'celebrities' },
  { id: 'mark_zuckerberg', wiki: 'Mark_Zuckerberg', name: 'מארק צוקרברג', topic: 'celebrities' },
  { id: 'donald_trump', wiki: 'Donald_Trump', name: 'דונלד טראמפ', topic: 'celebrities' },
  { id: 'barack_obama', wiki: 'Barack_Obama', name: 'ברק אובמה', topic: 'celebrities' },
  { id: 'winston_churchill', wiki: 'Winston_Churchill', name: 'וינסטון צ\'רצ\'יל', topic: 'celebrities' },
  { id: 'cleopatra', wiki: 'Cleopatra', name: 'קליאופטרה', topic: 'celebrities' },
  { id: 'bob_marley', wiki: 'Bob_Marley', name: 'בוב מארלי', topic: 'celebrities' },
  { id: 'gordon_ramsay', wiki: 'Gordon_Ramsay', name: 'גורדון רמזי', topic: 'celebrities' },
  { id: 'gal_gadot', wiki: 'Gal_Gadot', name: 'גל גדות', topic: 'celebrities' }
];

// 2. דמויות בדיוניות מפורסמות
const FICTIONAL = [
  { id: 'batman', wiki: 'Batman', name: 'באטמן', topic: 'fictional' },
  { id: 'superman', wiki: 'Superman', name: 'סופרמן', topic: 'fictional' },
  { id: 'spiderman', wiki: 'Spider-Man', name: 'ספיידרמן', topic: 'fictional' },
  { id: 'darth_vader', wiki: 'Darth_Vader', name: 'דארת\' ויידר', topic: 'fictional' },
  { id: 'the_joker', wiki: 'Joker_(character)', name: 'הג\'וקר', topic: 'fictional' },
  { id: 'super_mario', wiki: 'Mario', name: 'סופר מריו', topic: 'fictional' },
  { id: 'pikachu', wiki: 'Pikachu', name: 'פיקאצ\'ו', topic: 'fictional' },
  { id: 'spongebob', wiki: 'SpongeBob_SquarePants_(character)', name: 'בובספוג', topic: 'fictional' },
  { id: 'homer_simpson', wiki: 'Homer_Simpson', name: 'הומר סימפסון', topic: 'fictional' },
  { id: 'mickey_mouse', wiki: 'Mickey_Mouse', name: 'מיקי מאוס', topic: 'fictional' },
  { id: 'shrek', wiki: 'Shrek_(character)', name: 'שרק', topic: 'fictional' },
  { id: 'yoda', wiki: 'Yoda', name: 'יודה', topic: 'fictional' },
  { id: 'godzilla', wiki: 'Godzilla', name: 'גודזילה', topic: 'fictional' },
  { id: 'frankenstein_monster', wiki: 'Frankenstein%27s_monster', name: 'המפלצת של פרנקנשטיין', topic: 'fictional' },
  { id: 'count_dracula', wiki: 'Count_Dracula', name: 'הרוזן דרקולה', topic: 'fictional' },
  { id: 'king_kong', wiki: 'King_Kong', name: 'קינג קונג', topic: 'fictional' },
  { id: 'sherlock_holmes', wiki: 'Sherlock_Holmes', name: 'שרלוק הולמס', topic: 'fictional' },
  { id: 'gandalf', wiki: 'Gandalf', name: 'גנדלף', topic: 'fictional' },
  { id: 'gollum', wiki: 'Gollum', name: 'גולום', topic: 'fictional' }
];

// 3. תמונות אסוציאטיביות (חפצים, ציורים מפורסמים וסמלים תרבותיים)
const ASSOCIATIVE = [
  { id: 'mona_lisa', wiki: 'Mona_Lisa', name: 'מונה ליזה', topic: 'associative' },
  { id: 'starry_night', wiki: 'The_Starry_Night', name: 'ליל כוכבים (ואן גוך)', topic: 'associative' },
  { id: 'the_scream', wiki: 'The_Scream', name: 'הצעקה (אדוורד מונק)', topic: 'associative' },
  { id: 'statue_of_liberty', wiki: 'Statue_of_Liberty', name: 'פסל החירות', topic: 'associative' },
  { id: 'eiffel_tower', wiki: 'Eiffel_Tower', name: 'מגדל אייפל', topic: 'associative' },
  { id: 'pyramids_of_giza', wiki: 'Giza_pyramid_complex', name: 'הפירמידות בגיזה', topic: 'associative' },
  { id: 'colosseum', wiki: 'Colosseum', name: 'הקולוסיאום', topic: 'associative' },
  { id: 'taj_mahal', wiki: 'Taj_Mahal', name: 'הטאג\' מהאל', topic: 'associative' },
  { id: 'moon_landing', wiki: 'Apollo_11', name: 'נחיתה על הירח (אפולו 11)', topic: 'associative' },
  { id: 'titanic', wiki: 'Titanic', name: 'הטיטאניק', topic: 'associative' },
  { id: 'blue_marble_earth', wiki: 'The_Blue_Marble', name: 'כדור הארץ מהחלל (Blue Marble)', topic: 'associative' },
  { id: 'hourglass', wiki: 'Hourglass', name: 'שעון חול', topic: 'associative' },
  { id: 'treasure_chest', wiki: 'Chest_(furniture)', name: 'תיבת אוצר', topic: 'associative' },
  { id: 'crown_jewels', wiki: 'Crown', name: 'כתר מלוכה', topic: 'associative' },
  { id: 'trojan_horse', wiki: 'Trojan_Horse', name: 'סוס טרויאני', topic: 'associative' },
  { id: 'skull', wiki: 'Human_skull', name: 'גולגולת אדם', topic: 'associative' },
  { id: 'compass', wiki: 'Compass', name: 'מצפן עתיק', topic: 'associative' },
  { id: 'anchor', wiki: 'Anchor', name: 'עוגן ספינה', topic: 'associative' },
  { id: 'sword', wiki: 'Sword', name: 'חרב', topic: 'associative' },
  { id: 'shield', wiki: 'Shield', name: 'מגן', topic: 'associative' },
  { id: 'newtons_cradle', wiki: 'Newton%27s_cradle', name: 'מטוטלת ניוטון', topic: 'associative' }
];

const ALL_ITEMS = [...CELEBRITIES, ...FICTIONAL, ...ASSOCIATIVE];

async function fetchWikiThumbnail(wikiTitle) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=800`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LifeQuestApp/2.0 (mnemonic@lifequest.app; +https://lifequest.app)' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const page = Object.values(data.query?.pages || {})[0];
  return page?.thumbnail?.source || null;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'LifeQuestApp/2.0 (mnemonic@lifequest.app; +https://lifequest.app)' }
  });
  if (!res.ok) throw new Error(`Image HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 500) throw new Error(`File too small: ${buf.length} bytes`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function run() {
  console.log(`Starting download for ${ALL_ITEMS.length} staged images...`);
  const stagedManifest = [];

  for (let i = 0; i < ALL_ITEMS.length; i++) {
    const item = ALL_ITEMS[i];
    const targetFile = path.join(targetDir, `${item.id}.jpg`);
    const webPath = `/staged_images/${item.id}.jpg`;

    let success = false;
    let size = 0;

    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1500) {
      size = fs.statSync(targetFile).size;
      success = true;
      console.log(`[${i+1}/${ALL_ITEMS.length}] Already exists: ${item.id} (${size} B)`);
    } else {
      try {
        console.log(`[${i+1}/${ALL_ITEMS.length}] Fetching wiki info for ${item.name} (${item.wiki})...`);
        const thumbUrl = await fetchWikiThumbnail(item.wiki);
        if (thumbUrl) {
          size = await downloadImage(thumbUrl, targetFile);
          success = true;
          console.log(`✓ Downloaded ${item.id} (${size} B)`);
        } else {
          console.warn(`! No thumbnail for ${item.wiki}`);
        }
      } catch (err) {
        console.error(`X Failed ${item.id}:`, err.message);
      }
    }

    if (success) {
      stagedManifest.push({
        id: item.id,
        suggestedName: item.name,
        topic: item.topic,
        imageUrl: webPath,
        fileSize: size
      });
    }

    // Gentle throttling to respect Wikipedia API limits
    await new Promise(r => setTimeout(r, 200));
  }

  // Write the staged manifest JS file for the client app to consume directly
  const manifestPath = path.resolve(__dirname, '../src/data/stagedImagesPool.js');
  const fileContent = `/**
 * Staged Images Pool for Rapid User Filing & Tagging
 * מאגר תמונות מוכנות להורדה ותיוק מהיר בתוך האפליקציה.
 * המשתמש קובע את השמות, הקטגוריות והאסוציאציות.
 */

export const STAGED_IMAGES_POOL = ${JSON.stringify(stagedManifest, null, 2)};
`;
  fs.writeFileSync(manifestPath, fileContent, 'utf8');
  console.log(`\nDone! Saved manifest with ${stagedManifest.length} images to ${manifestPath}`);
}

run();
