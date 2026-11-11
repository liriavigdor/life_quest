import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.0 (https://lifequest.local; admin@lifequest.local)';

// For each of the 38 items that had a wrong subject, specify a targeted Commons search query
// and filter out maps, diagrams, collages, engravings, or B&W drawings where appropriate.
const FIXES_38 = [
  { file: 'star_of_david.jpg', query: 'Star of David synagogue stained glass OR gold Magen David' },
  { file: 'item_151_נורה_דולקת__מסמלת.jpg', query: 'Glowing light bulb filament yellow dark' },
  { file: 'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg', query: 'Money bag dollar burlap sack coins' },
  { file: 'item_201_לימוזינה_שחורה_ארוכה.jpg', query: 'Lincoln Town Car stretch limousine black' },
  { file: 'item_206_ספינת_פיראטים.jpg', query: 'Galleon Neptune Genoa pirate ship replica' },
  { file: 'item_225_רכבת_קליע_יפנית.jpg', query: 'Shinkansen N700 train Mount Fuji OR Shinkansen 500 series' },
  { file: 'item_280_עלה_מייפל.jpg', query: 'Red autumn maple leaf single' },
  { file: 'item_288_מדבר_חול.jpg', query: 'Sahara desert sand dunes Erg Chebbi' },
  { file: 'item_292_כוכב_ים.jpg', query: 'Starfish on beach sand single' },
  { file: 'item_308_מחבט_בייסבול.jpg', query: 'Louisville Slugger wooden baseball bat ball' },
  { file: 'item_316_חץ_ולוח_מטרה.jpg', query: 'Archery target arrows bullseye close up' },
  { file: 'item_320_נעלי_פקקים.jpg', query: 'Adidas Predator football boot grass' },
  { file: 'item_331_משקפת_שחייה_ומצוף_זרוע.jpg', query: 'Swimmer wearing swimming goggles pool' },
  { file: 'item_333_רשת_כדורגל_נטויה.jpg', query: 'Soccer goal net pitch stadium' },
  { file: 'item_344_דוכן_פופקורן_קולנוע.jpg', query: 'Popped popcorn bowl bucket movie' },
  { file: 'item_348_משחק_טטריס.jpg', query: 'Tetris game blocks screen' },
  { file: 'item_351_פטיש_מסמרים_קלאסי.jpg', query: 'Claw hammer on wood workbench' },
  { file: 'item_358_מטאטא_ומגרוד.jpg', query: 'Push broom and dustpan floor' },
  { file: 'item_362_פחית_שימורים_חצי_פתוחה.jpg', query: 'Opened tin can lid food' },
  { file: 'item_372_מראת_יד_עגולה.jpg', query: 'Silver hand mirror dressing table' },
  { file: 'item_396_ארגז_כלים_אדום.jpg', query: 'Red metal toolbox open tools' },
  { file: 'item_409_הפחיות_של_קוקה_קולה.jpg', query: 'Coca-Cola red can 330ml' },
  { file: 'item_411_הארי_פוטר.jpg', query: 'Harry Potter glasses wand book' },
  { file: 'item_412_שרלוק_הולמס.jpg', query: 'Sherlock Holmes statue London deerstalker pipe' },
  { file: 'item_414_לגו.jpg', query: 'Lego bricks colorful pile plastic' },
  { file: 'item_428_קביים.jpg', query: 'Forearm crutches pair medical' },
  { file: 'item_445_הבית_הלבן.jpg', query: 'White House north facade Washington' },
  { file: 'item_459_יונה_לבנה_עם_עלה_זית.jpg', query: 'White dove bird in flight blue sky' },
  { file: 'item_465_קרחון__iceberg_.jpg', query: 'Iceberg in Antarctica blue ocean' },
  { file: 'item_470_מדליית_זהב.jpg', query: 'Olympic gold medal ribbon' },
  { file: 'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg', query: 'Star of Life Rod of Asclepius ambulance symbol' },
  { file: 'item_480_פרש_הברונזה___אביר_על_סוס_לבן.jpg', query: 'Bronze Horseman Saint Petersburg statue' },
  { file: 'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg', query: 'Rutherford atom model orbits' },
  { file: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', query: 'Radioactive warning symbol sign yellow triangle' },
  { file: 'item_492_צלחת_לוויין.jpg', query: 'Satellite dish antenna television roof' },
  { file: 'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg', query: 'Wifi icon symbol wireless sign' },
  { file: 'authentic_barbie_doll.jpg', query: 'Barbie doll fashion blond' },
  { file: 'authentic_sonic_the_hedgehog.jpg', query: 'Sonic the Hedgehog statue Sega' },
  { file: 'authentic_super_mario.jpg', query: 'Super Mario statue Nintendo' }
];

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|dimensions&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  // Sort by index
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = (p.title || '').toLowerCase();
    if (
      (t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.svg')) &&
      !t.includes('map') &&
      !t.includes('diagram') &&
      !t.includes('collage') &&
      !t.includes('montage') &&
      !t.includes('patent')
    ) {
      const info = p.imageinfo?.[0];
      const src = info?.thumburl || info?.url;
      if (src) return { src, title: p.title, width: info?.width, height: info?.height };
    }
  }
  return null;
}

async function run() {
  for (let i = 0; i < FIXES_38.length; i++) {
    const item = FIXES_38[i];
    const found = await searchCommons(item.query);
    if (!found) {
      console.log(`[${i + 1}/${FIXES_38.length}] MISS: ${item.file}`);
      continue;
    }
    try {
      const res = await fetch(found.src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000) {
          fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
          console.log(`[${i + 1}/${FIXES_38.length}] OK: ${item.file} <- ${found.title}`);
        }
      }
    } catch (e) {
      console.log(`[${i + 1}/${FIXES_38.length}] ERR: ${item.file} (${e.message})`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
}

run();

