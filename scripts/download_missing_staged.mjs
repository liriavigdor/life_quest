import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../public/staged_images');

// Targeted high-quality Commons search queries for the remaining characters & symbols
const MISSING_TARGETS = [
  { id: 'batman', query: 'Batman statue OR cosplay', name: 'באטמן', topic: 'fictional' },
  { id: 'superman', query: 'Superman statue OR cosplay', name: 'סופרמן', topic: 'fictional' },
  { id: 'spiderman', query: 'Spider-Man cosplay OR statue', name: 'ספיידרמן', topic: 'fictional' },
  { id: 'darth_vader', query: 'Darth Vader costume OR statue', name: 'דארת\' ויידר', topic: 'fictional' },
  { id: 'the_joker', query: 'Joker cosplay OR costume', name: 'הג\'וקר', topic: 'fictional' },
  { id: 'super_mario', query: 'Super Mario statue OR figure', name: 'סופר מריו', topic: 'fictional' },
  { id: 'pikachu', query: 'Pikachu statue OR figure OR mascot', name: 'פיקאצ\'ו', topic: 'fictional' },
  { id: 'homer_simpson', query: 'Homer Simpson statue OR figure', name: 'הומר סימפסון', topic: 'fictional' },
  { id: 'shrek', query: 'Shrek figure OR statue', name: 'שרק', topic: 'fictional' },
  { id: 'yoda', query: 'Yoda figure OR statue', name: 'יודה', topic: 'fictional' },
  { id: 'frankenstein_monster', query: 'Frankenstein monster statue OR illustration', name: 'המפלצת של פרנקנשטיין', topic: 'fictional' },
  { id: 'gandalf', query: 'Gandalf figure OR cosplay', name: 'גנדלף', topic: 'fictional' },
  { id: 'skull', query: 'Human skull front', name: 'גולגולת אדם', topic: 'associative' },
  { id: 'sword', query: 'Medieval sword weapon', name: 'חרב אבירים', topic: 'associative' },
  { id: 'newtons_cradle', query: 'Newton\'s cradle in action', name: 'מטוטלת ניוטון', topic: 'associative' }
];

async function searchCommons(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LifeQuestApp/2.0' } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;
  for (const page of Object.values(pages)) {
    if (page.thumbnail?.source) {
      return page.thumbnail.source;
    }
  }
  return null;
}

async function run() {
  console.log(`Fetching remaining ${MISSING_TARGETS.length} iconic figures via Wikimedia Commons...`);
  for (const item of MISSING_TARGETS) {
    const dest = path.join(targetDir, `${item.id}.jpg`);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) {
      console.log(`✓ Exists: ${item.id}`);
      continue;
    }
    try {
      console.log(`Searching Commons for: ${item.name} (${item.query})...`);
      const imgUrl = await searchCommons(item.query);
      if (imgUrl) {
        const res = await fetch(imgUrl, { headers: { 'User-Agent': 'LifeQuestApp/2.0' } });
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 1000) {
          fs.writeFileSync(dest, buf);
          console.log(`✓ Downloaded ${item.id} (${buf.length} B)`);
        }
      } else {
        console.warn(`! Not found on Commons: ${item.query}`);
      }
    } catch (e) {
      console.error(`Error for ${item.id}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 250));
  }

  // Re-read entire public/staged_images and rebuild manifest
  const files = fs.readdirSync(targetDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Rebuilding manifest with all ${files.length} images...`);

  // Map known IDs to friendly Hebrew names and topics
  const ALL_REF = [
    { id: 'albert_einstein', name: 'אלברט איינשטיין', topic: 'celebrities' },
    { id: 'steve_jobs', name: 'סטיב ג\'ובס', topic: 'celebrities' },
    { id: 'elon_musk', name: 'אילון מאסק', topic: 'celebrities' },
    { id: 'michael_jordan', name: 'מייקל ג\'ורדן', topic: 'celebrities' },
    { id: 'lionel_messi', name: 'ליאו מסי', topic: 'celebrities' },
    { id: 'cristiano_ronaldo', name: 'כריסטיאנו רונאלדו', topic: 'celebrities' },
    { id: 'mike_tyson', name: 'מייק טייסון', topic: 'celebrities' },
    { id: 'muhammad_ali', name: 'מוחמד עלי', topic: 'celebrities' },
    { id: 'michael_jackson', name: 'מייקל ג\'קסון', topic: 'celebrities' },
    { id: 'elvis_presley', name: 'אלביס פרסלי', topic: 'celebrities' },
    { id: 'freddie_mercury', name: 'פרדי מרקורי', topic: 'celebrities' },
    { id: 'charlie_chaplin', name: 'צ\'ארלי צ\'פלין', topic: 'celebrities' },
    { id: 'marilyn_monroe', name: 'מרילין מונרו', topic: 'celebrities' },
    { id: 'leonardo_dicaprio', name: 'לאונרדו דיקפריו', topic: 'celebrities' },
    { id: 'arnold_schwarzenegger', name: 'ארנולד שוורצנגר', topic: 'celebrities' },
    { id: 'usain_bolt', name: 'יוסיין בולט', topic: 'celebrities' },
    { id: 'bill_gates', name: 'ביל גייטס', topic: 'celebrities' },
    { id: 'mark_zuckerberg', name: 'מארק צוקרברג', topic: 'celebrities' },
    { id: 'donald_trump', name: 'דונלד טראמפ', topic: 'celebrities' },
    { id: 'barack_obama', name: 'ברק אובמה', topic: 'celebrities' },
    { id: 'winston_churchill', name: 'וינסטון צ\'רצ\'יל', topic: 'celebrities' },
    { id: 'cleopatra', name: 'קליאופטרה', topic: 'celebrities' },
    { id: 'bob_marley', name: 'בוב מארלי', topic: 'celebrities' },
    { id: 'gordon_ramsay', name: 'גורדון רמזי', topic: 'celebrities' },
    { id: 'gal_gadot', name: 'גל גדות', topic: 'celebrities' },
    { id: 'batman', name: 'באטמן', topic: 'fictional' },
    { id: 'superman', name: 'סופרמן', topic: 'fictional' },
    { id: 'spiderman', name: 'ספיידרמן', topic: 'fictional' },
    { id: 'darth_vader', name: 'דארת\' ויידר', topic: 'fictional' },
    { id: 'the_joker', name: 'הג\'וקר', topic: 'fictional' },
    { id: 'super_mario', name: 'סופר מריו', topic: 'fictional' },
    { id: 'pikachu', name: 'פיקאצ\'ו', topic: 'fictional' },
    { id: 'spongebob', name: 'בובספוג', topic: 'fictional' },
    { id: 'homer_simpson', name: 'הומר סימפסון', topic: 'fictional' },
    { id: 'mickey_mouse', name: 'מיקי מאוס', topic: 'fictional' },
    { id: 'shrek', name: 'שרק', topic: 'fictional' },
    { id: 'yoda', name: 'יודה', topic: 'fictional' },
    { id: 'godzilla', name: 'גודזילה', topic: 'fictional' },
    { id: 'frankenstein_monster', name: 'המפלצת של פרנקנשטיין', topic: 'fictional' },
    { id: 'count_dracula', name: 'הרוזן דרקולה', topic: 'fictional' },
    { id: 'king_kong', name: 'קינג קונג', topic: 'fictional' },
    { id: 'sherlock_holmes', name: 'שרלוק הולמס', topic: 'fictional' },
    { id: 'gandalf', name: 'גנדלף', topic: 'fictional' },
    { id: 'gollum', name: 'גולום', topic: 'fictional' },
    { id: 'mona_lisa', name: 'מונה ליזה', topic: 'associative' },
    { id: 'starry_night', name: 'ליל כוכבים (ואן גוך)', topic: 'associative' },
    { id: 'the_scream', name: 'הצעקה (אדוורד מונק)', topic: 'associative' },
    { id: 'statue_of_liberty', name: 'פסל החירות', topic: 'associative' },
    { id: 'eiffel_tower', name: 'מגדל אייפל', topic: 'associative' },
    { id: 'pyramids_of_giza', name: 'הפירמידות בגיזה', topic: 'associative' },
    { id: 'colosseum', name: 'הקולוסיאום', topic: 'associative' },
    { id: 'taj_mahal', name: 'הטאג\' מהאל', topic: 'associative' },
    { id: 'moon_landing', name: 'נחיתה על הירח (אפולו 11)', topic: 'associative' },
    { id: 'titanic', name: 'הטיטאניק', topic: 'associative' },
    { id: 'blue_marble_earth', name: 'כדור הארץ מהחלל (Blue Marble)', topic: 'associative' },
    { id: 'hourglass', name: 'שעון חול', topic: 'associative' },
    { id: 'treasure_chest', name: 'תיבת אוצר', topic: 'associative' },
    { id: 'crown_jewels', name: 'כתר מלוכה', topic: 'associative' },
    { id: 'trojan_horse', name: 'סוס טרויאני', topic: 'associative' },
    { id: 'skull', name: 'גולגולת אדם', topic: 'associative' },
    { id: 'compass', name: 'מצפן עתיק', topic: 'associative' },
    { id: 'anchor', name: 'עוגן ספינה', topic: 'associative' },
    { id: 'sword', name: 'חרב אבירים', topic: 'associative' },
    { id: 'shield', name: 'מגן אבירים', topic: 'associative' },
    { id: 'newtons_cradle', name: 'מטוטלת ניוטון', topic: 'associative' }
  ];

  const fullManifest = files.map(file => {
    const id = file.replace(/\.[^/.]+$/, '');
    const ref = ALL_REF.find(r => r.id === id);
    const size = fs.statSync(path.join(targetDir, file)).size;
    return {
      id,
      suggestedName: ref ? ref.name : id.replace(/_/g, ' '),
      topic: ref ? ref.topic : 'general',
      imageUrl: `/staged_images/${file}`,
      fileSize: size
    };
  });

  const manifestPath = path.resolve(__dirname, '../src/data/stagedImagesPool.js');
  fs.writeFileSync(manifestPath, `export const STAGED_IMAGES_POOL = ${JSON.stringify(fullManifest, null, 2)};\n`, 'utf8');
  console.log(`Updated manifest with ${fullManifest.length} total staged images!`);
}

run();
