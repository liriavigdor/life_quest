import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.7 (https://lifequest.local; admin@lifequest.local)';

async function getArticleImages(articleTitle) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=images&imlimit=30&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return (pages[0]?.images || []).map(i => i.title);
}

async function downloadFileTitle(fileTitle, destFile) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const src = pages[0]?.imageinfo?.[0]?.thumburl || pages[0]?.imageinfo?.[0]?.url;
  if (!src) return false;
  const imgRes = await fetch(src, { headers: { 'User-Agent': UA } });
  if (!imgRes.ok) return false;
  const buf = Buffer.from(await imgRes.arrayBuffer());
  if (buf.length > 2000) {
    fs.writeFileSync(path.join(POOL_DIR, destFile), buf);
    console.log(`Saved ${destFile} <- ${fileTitle}`);
    return true;
  }
  return false;
}

async function run() {
  const mapleImgs = await getArticleImages('Maple');
  console.log('Maple:', mapleImgs);
  for (const t of mapleImgs) {
    if (t.toLowerCase().includes('leaf') && t.toLowerCase().endsWith('.jpg')) {
      if (await downloadFileTitle(t, 'item_280_עלה_מייפל.jpg')) break;
    }
  }

  const cokeImgs = await getArticleImages('Coca-Cola');
  console.log('Coca-Cola:', cokeImgs);
  for (const t of cokeImgs) {
    const tl = t.toLowerCase();
    if ((tl.includes('can') || tl.includes('bottle') || tl.includes('coca-cola')) && tl.endsWith('.jpg') && !tl.includes('museum') && !tl.includes('pemberton')) {
      if (await downloadFileTitle(t, 'item_409_הפחיות_של_קוקה_קולה.jpg')) break;
    }
  }
}

run();

