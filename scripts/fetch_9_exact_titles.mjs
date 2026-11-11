import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.2 (https://lifequest.local; admin@lifequest.local)';

// Exact Wikimedia Commons file titles or Wikipedia article image lists
const EXACT_FILES = [
  { file: 'item_280_עלה_מייפל.jpg', commonsTitle: 'File:Acer rubrum 001.jpg', fallbackSearch: 'Acer rubrum autumn leaf jpg' },
  { file: 'item_292_כוכב_ים.jpg', commonsTitle: 'File:Asterias rubens.jpg', fallbackSearch: 'Starfish sand beach jpg' },
  { file: 'item_308_מחבט_בייסבול.jpg', commonsTitle: 'File:Baseball bat and ball.jpg', fallbackSearch: 'Wooden baseball bat grass jpg' },
  { file: 'item_333_רשת_כדורגל_נטויה.jpg', commonsTitle: 'File:Soccer goal.jpg', fallbackSearch: 'Football goal post net grass jpg' },
  { file: 'item_414_לגו.jpg', commonsTitle: 'File:Lego Color Bricks.jpg', fallbackSearch: 'Lego Color Bricks jpg' },
  { file: 'item_428_קביים.jpg', commonsTitle: 'File:Crutches.jpg', fallbackSearch: 'Aluminum crutches pair jpg' },
  { file: 'item_459_יונה_לבנה_עם_עלה_זית.jpg', commonsTitle: 'File:White dove in flight.jpg', fallbackSearch: 'Columba livia white dove flying jpg' },
  { file: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', commonsTitle: 'File:Radiation warning symbol.svg', fallbackSearch: 'Radiation warning symbol svg' },
  { file: 'authentic_barbie_doll.jpg', commonsTitle: '', fallbackSearch: 'Barbie doll pink dress cosplay OR Barbie Mattel toy' }
];

async function getByExactCommonsTitle(title) {
  if (!title) return null;
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const info = pages[0]?.imageinfo?.[0];
  return info?.thumburl || info?.url || null;
}

async function searchCommonsPhoto(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = (p.title || '').toLowerCase();
    if (
      (t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.svg')) &&
      !t.includes('dissection') &&
      !t.includes('ad ') &&
      !t.includes('1920') &&
      !t.includes('1965') &&
      !t.includes('ruth') &&
      !t.includes('charlotte') &&
      !t.includes('icon') &&
      !t.includes('diagram')
    ) {
      const info = p.imageinfo?.[0];
      const src = info?.thumburl || info?.url;
      if (src) return { src, title: p.title };
    }
  }
  return null;
}

async function run() {
  for (const item of EXACT_FILES) {
    let src = await getByExactCommonsTitle(item.commonsTitle);
    let chosenTitle = item.commonsTitle;
    if (!src) {
      const found = await searchCommonsPhoto(item.fallbackSearch);
      if (found) {
        src = found.src;
        chosenTitle = found.title;
      }
    }
    if (src) {
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length > 1500) {
          fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
          console.log(`OK: ${item.file} <- ${chosenTitle}`);
        }
      }
    } else {
      console.log(`MISS: ${item.file}`);
    }
  }
}

run();

