import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestMnemonicCurator/2.0 (https://lifequest.local; contact@lifequest.local)';

const NINE = [
  { id: 'item_333', file: 'item_333_רשת_כדורגל_נטויה.jpg', wiki: 'Goal (sports)', commons: 'soccer goal net' },
  { id: 'item_372', file: 'item_372_מראת_יד_עגולה.jpg', wiki: 'Mirror', commons: 'hand mirror' },
  { id: 'item_408', file: 'item_408_הלוגו_של_נייק__swoosh_.jpg', wiki: 'Air Force 1 (shoe)', commons: 'Nike sneaker shoe' },
  { id: 'item_414', file: 'item_414_לגו.jpg', wiki: 'Lego minifigure', commons: 'Lego bricks' },
  { id: 'item_423', file: 'item_423_משקולת_ברזל__dumbbell_.jpg', wiki: 'Dumbbell', commons: 'dumbbell gym' },
  { id: 'item_488', file: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', wiki: 'Radioactive waste', commons: 'radiation warning sign' },
  { id: 'barbie_doll', file: 'authentic_barbie_doll.jpg', wiki: 'Fashion doll', commons: 'Barbie doll' },
  { id: 'sonic_the_hedgehog', file: 'authentic_sonic_the_hedgehog.jpg', wiki: 'Sonic the Hedgehog (character)', commons: 'Sonic cosplayer' },
  { id: 'super_mario', file: 'authentic_super_mario.jpg', wiki: 'Mario', commons: 'Mario Nintendo cosplay' }
];

async function fetchOne(item) {
  for (const w of [item.wiki, item.commons]) {
    if (!w) continue;
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(w)}&prop=pageimages&pithumbsize=900&redirects=1&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const src = pages[0]?.thumbnail?.source;
    if (src) {
      const r2 = await fetch(src, { headers: { 'User-Agent': UA } });
      if (r2.ok) {
        const buf = Buffer.from(await r2.arrayBuffer());
        fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
        console.log(`✅ ${item.id} from en.wiki (${w}) -> ${buf.length}B`);
        return;
      }
    }
  }
  // fallback search on en.wikipedia
  const sUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(item.commons)}&gsrlimit=5&prop=pageimages&pithumbsize=900&format=json`;
  const res = await fetch(sUrl, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  for (const p of pages) {
    if (p.thumbnail?.source) {
      const r2 = await fetch(p.thumbnail.source, { headers: { 'User-Agent': UA } });
      if (r2.ok) {
        const buf = Buffer.from(await r2.arrayBuffer());
        fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
        console.log(`✅ ${item.id} from search (${p.title}) -> ${buf.length}B`);
        return;
      }
    }
  }
  console.log(`❌ Failed ${item.id}`);
}

async function run() {
  for (const item of NINE) {
    await fetchOne(item);
  }
}
run();

