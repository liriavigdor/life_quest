import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.1 (https://lifequest.local; admin@lifequest.local)';

const ITEMS_24 = [
  { file: 'item_151_נורה_דולקת__מסמלת.jpg', q: 'light bulb glowing' },
  { file: 'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg', q: 'money bag dollar' },
  { file: 'item_206_ספינת_פיראטים.jpg', q: 'Galleon Neptune' },
  { file: 'item_280_עלה_מייפל.jpg', q: 'maple leaf red' },
  { file: 'item_292_כוכב_ים.jpg', q: 'Asterias rubens' },
  { file: 'item_308_מחבט_בייסבול.jpg', q: 'baseball bat' },
  { file: 'item_316_חץ_ולוח_מטרה.jpg', q: 'archery target' },
  { file: 'item_320_נעלי_פקקים.jpg', q: 'football boot' },
  { file: 'item_333_רשת_כדורגל_נטויה.jpg', q: 'football goal' },
  { file: 'item_344_דוכן_פופקורן_קולנוע.jpg', q: 'popcorn bowl' },
  { file: 'item_348_משחק_טטריס.jpg', q: 'Tetris game' },
  { file: 'item_351_פטיש_מסמרים_קלאסי.jpg', q: 'claw hammer' },
  { file: 'item_358_מטאטא_ומגרוד.jpg', q: 'broom dustpan' },
  { file: 'item_362_פחית_שימורים_חצי_פתוחה.jpg', q: 'open tin can' },
  { file: 'item_396_ארגז_כלים_אדום.jpg', q: 'red toolbox' },
  { file: 'item_411_הארי_פוטר.jpg', q: 'Harry Potter wand' },
  { file: 'item_412_שרלוק_הולמס.jpg', q: 'Sherlock Holmes statue' },
  { file: 'item_414_לגו.jpg', q: 'Lego bricks' },
  { file: 'item_428_קביים.jpg', q: 'crutches medical' },
  { file: 'item_459_יונה_לבנה_עם_עלה_זית.jpg', q: 'white dove' },
  { file: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', q: 'Radioactive symbol' },
  { file: 'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg', q: 'Wifi icon' },
  { file: 'authentic_barbie_doll.jpg', q: 'Barbie doll' },
  { file: 'authentic_sonic_the_hedgehog.jpg', q: 'Sonic Hedgehog cosplay' }
];

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap|drawing%20${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url|dimensions&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = (p.title || '').toLowerCase();
    if (
      (t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.svg')) &&
      !t.includes('map') &&
      !t.includes('collage') &&
      !t.includes('patent') &&
      !t.includes('sole') &&
      !t.includes('logo')
    ) {
      const info = p.imageinfo?.[0];
      const src = info?.thumburl || info?.url;
      if (src) return { src, title: p.title };
    }
  }
  return null;
}

async function run() {
  for (let i = 0; i < ITEMS_24.length; i++) {
    const item = ITEMS_24[i];
    const found = await searchCommons(item.q);
    if (!found) {
      console.log(`[${i + 1}/${ITEMS_24.length}] MISS: ${item.file}`);
      continue;
    }
    try {
      const res = await fetch(found.src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 1500) {
          fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
          console.log(`[${i + 1}/${ITEMS_24.length}] OK: ${item.file} <- ${found.title}`);
        }
      }
    } catch (e) {
      console.log(`[${i + 1}/${ITEMS_24.length}] ERR: ${item.file}`);
    }
    await new Promise(r => setTimeout(r, 150));
  }
}

run();

