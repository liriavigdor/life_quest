import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/4.0 (https://lifequest.local; admin@lifequest.local)';

// 1. Direct copies from clean images we already verified in pool
const COPIES = [
  ['item_446_מגדל_פיזה_הנוטה.jpg', 'leaning_tower_of_pisa.jpg'],
  ['item_447_פסל_ישו_הגואל_בריו.jpg', 'christ_the_redeemer_rio.jpg'],
  ['item_445_הבית_הלבן.jpg', 'authentic_the_white_house.jpg'],
  ['item_441_פסל_החושב__רודן_.jpg', 'the_thinker_rodin_statue.jpg'],
  ['item_459_יונה_לבנה_עם_עלה_זית.jpg', 'item_175_יונה_לבנה_עם_ענף_זית_בפה__מסמלת.jpg'],
  ['item_493_גולגולת_ושתי_עצמות_מוצלבות.jpg', 'item_178_גולגולת_עם_שתי_עצמות_מוצלבות__מסמלת.jpg']
];

for (const [src, dst] of COPIES) {
  const s = path.join(POOL_DIR, src);
  const d = path.join(POOL_DIR, dst);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, d);
    console.log(`Copied clean ${src} -> ${dst}`);
  }
}

// 2. Fetch remaining 23 from English Wikipedia lead images or Wikimedia Commons
const FETCHES = [
  { file: 'winnie_the_pooh_honey.jpg', wiki: 'Winnie-the-Pooh', commons: 'Winnie the Pooh bear' },
  { file: 'spongebob.jpg', wiki: '', commons: 'SpongeBob SquarePants statue OR SpongeBob mascot' },
  { file: 'donald_duck_sailor.jpg', wiki: 'Donald Duck', commons: 'Donald Duck statue Disney' },
  { file: 'authentic_scooby_doo.jpg', wiki: '', commons: 'Scooby-Doo Mystery Machine OR Scooby-Doo character' },
  { file: 'authentic_captain_america.jpg', wiki: '', commons: 'Captain America shield cosplay' },
  { file: 'pyramids_of_giza_egypt.jpg', wiki: 'Giza pyramid complex', commons: 'All Gizah Pyramids' },
  { file: 'neon_motel_sign.jpg', wiki: 'Motel', commons: 'Neon motel sign night' },
  { file: 'tutankhamun.jpg', wiki: 'Mask of Tutankhamun', commons: 'Tutankhamun mask gold' },
  { file: 'chess_knight_piece.jpg', wiki: 'Knight (chess)', commons: 'Chess knight piece wooden' },
  { file: 'golden_menorah_seven.jpg', wiki: 'Menorah (Temple)', commons: 'Temple Menorah golden Jerusalem' },
  { file: 'item_162_כובע_בוגר_אוניברסיטה__מרובע_עם_גדיל___מסמל.jpg', wiki: 'Square academic cap', commons: 'Graduation mortarboard cap' },
  { file: 'item_164_חץ_שלוח_פוגע_בול_במרכז_המטרה__מסמל.jpg', wiki: 'Bullseye (target)', commons: 'Archery target arrow bullseye' },
  { file: 'item_167_שטיח_אדום_ארוך__מסמל.jpg', wiki: 'Red carpet', commons: 'Red carpet event VIP' },
  { file: 'item_179_מטוס_נייר_מקופל__מסמל.jpg', wiki: 'Paper plane', commons: 'Paper airplane white folded' },
  { file: 'item_188_שבב_אלקטרוני__צ_יפ_ירוק_עם_פסי_זהב___מסמל.jpg', wiki: 'Integrated circuit', commons: 'Microchip circuit board close up' },
  { file: 'authentic_pinocchio.jpg', wiki: 'Pinocchio', commons: 'Pinocchio wooden puppet Italy' },
  { file: 'minions.jpg', wiki: 'Minions (Despicable Me)', commons: 'Minions Universal Studios' },
  { file: 'kremlin_red_square_moscow.jpg', wiki: "Saint Basil's Cathedral", commons: 'Saint Basils Cathedral Moscow' },
  { file: 'chichen_itza_pyramid.jpg', wiki: 'El Castillo, Chichen Itza', commons: 'Chichen Itza El Castillo pyramid' },
  { file: 'western_wall_jerusalem.jpg', wiki: 'Western Wall', commons: 'Western Wall Jerusalem Kotel' },
  { file: 'item_196_מטאטא_זרדים_ישן__מסמל.jpg', wiki: 'Besom', commons: 'Besom birch twig broom' },
  { file: 'item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן__מסמל.jpg', wiki: 'Top hat', commons: 'Black top hat silk' }
];

async function getWikiLead(title) {
  if (!title) return null;
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=900&redirects=1&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const src = pages[0]?.thumbnail?.source;
    if (src && !src.includes('.svg') && !src.includes('.pdf')) return src;
  } catch (_) {}
  return null;
}

async function getCommons(q) {
  if (!q) return null;
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    pages.sort((a, b) => (a.index || 99) - (b.index || 99));
    for (const p of pages) {
      const t = (p.title || '').toLowerCase();
      if (!t.includes('logo') && !t.includes('map')) {
        const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
        if (src) return src;
      }
    }
  } catch (_) {}
  return null;
}

async function run() {
  for (const item of FETCHES) {
    let src = await getWikiLead(item.wiki);
    if (!src) src = await getCommons(item.commons);
    if (src) {
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 2000) {
          fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
          console.log(`OK: ${item.file}`);
          continue;
        }
      }
    }
    console.log(`MISS: ${item.file}`);
  }
}

run();

