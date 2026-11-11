import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestCuratorBot/3.4 (https://lifequest.local; admin@lifequest.local)';

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
  await downloadFileTitle("File:Tony Gwynn's Bat-2.JPG", 'item_308_מחבט_בייסבול.jpg');
  await downloadFileTitle('File:White Doves at the Blue Mosque (5778806606).jpg', 'item_459_יונה_לבנה_עם_עלה_זית.jpg');
  await downloadFileTitle('File:MattelBarbieno1br.jpg', 'authentic_barbie_doll.jpg');
}

run();
