import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.6 (https://lifequest.local; admin@lifequest.local)';

const TARGETS = [
  { file: 'star_of_david.jpg', exact: 'File:Star of David.svg', search: '' },
  { file: 'item_151_נורה_דולקת__מסמלת.jpg', exact: 'File:Gluehlampe 01 KMJ.jpg', search: 'Incandescent light bulb jpg' },
  { file: 'item_201_לימוזינה_שחורה_ארוכה.jpg', exact: '', search: 'Stretch limousine black wedding OR Lincoln Town Car limousine white' },
  { file: 'item_206_ספינת_פיראטים.jpg', exact: 'File:Galleon Neptune.JPG', search: 'Galleon Neptune Genoa ship' },
  { file: 'item_280_עלה_מייפל.jpg', exact: '', search: 'Sugar maple leaf autumn red single' },
  { file: 'item_316_חץ_ולוח_מטרה.jpg', exact: '', search: 'Archery target arrows bullseye' },
  { file: 'item_409_הפחיות_של_קוקה_קולה.jpg', exact: '', search: 'Coca-Cola can red classic' },
  { file: 'item_492_צלחת_לוויין.jpg', exact: 'File:Astra satellite dish.jpg', search: 'Ku band satellite dish antenna' },
  { file: 'authentic_super_mario.jpg', exact: '', search: 'Super Mario cosplay costume OR Mario figure Nintendo' }
];

async function getByExact(title) {
  if (!title) return null;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages[0]?.imageinfo?.[0]?.thumburl || pages[0]?.imageinfo?.[0]?.url || null;
}

async function getBySearch(q, skipWords = []) {
  if (!q) return null;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = (p.title || '').toLowerCase();
    if (skipWords.some(w => t.includes(w))) continue;
    const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    if (src) return { src, title: p.title };
  }
  return null;
}

async function run() {
  for (const item of TARGETS) {
    let src = await getByExact(item.exact);
    let label = item.exact;
    if (!src) {
      const found = await getBySearch(item.search, ['china', 'scioto', 'kennedy', '06.jpg', 'kungsbacka', 'truck']);
      if (found) {
        src = found.src;
        label = found.title;
      }
    }
    if (src) {
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
        console.log(`OK: ${item.file} <- ${label}`);
      }
    } else {
      console.log(`MISS: ${item.file}`);
    }
  }
}

run();

