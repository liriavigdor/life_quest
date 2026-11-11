import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets');
const UA = 'LifeQuestCuratorBot/3.5 (https://lifequest.local; admin@lifequest.local)';

async function fixBarbie() {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=File:MattelBarbieno1br.jpg&prop=imageinfo&iiprop=url&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const src = pages[0]?.imageinfo?.[0]?.url;
  if (src) {
    const imgRes = await fetch(src, { headers: { 'User-Agent': UA } });
    if (imgRes.ok) {
      const buf = Buffer.from(await imgRes.arrayBuffer());
      fs.writeFileSync(path.join(POOL_DIR, 'authentic_barbie_doll.jpg'), buf);
      console.log('Downloaded MattelBarbieno1br.jpg');
    }
  }
}

const files39 = [
  'star_of_david.jpg',
  'item_151_נורה_דולקת__מסמלת.jpg',
  'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg',
  'item_201_לימוזינה_שחורה_ארוכה.jpg',
  'item_206_ספינת_פיראטים.jpg',
  'item_225_רכבת_קליע_יפנית.jpg',
  'item_280_עלה_מייפל.jpg',
  'item_288_מדבר_חול.jpg',
  'item_292_כוכב_ים.jpg',
  'item_308_מחבט_בייסבול.jpg',
  'item_316_חץ_ולוח_מטרה.jpg',
  'item_320_נעלי_פקקים.jpg',
  'item_331_משקפת_שחייה_ומצוף_זרוע.jpg',
  'item_333_רשת_כדורגל_נטויה.jpg',
  'item_344_דוכן_פופקורן_קולנוע.jpg',
  'item_348_משחק_טטריס.jpg',
  'item_351_פטיש_מסמרים_קלאסי.jpg',
  'item_358_מטאטא_ומגרוד.jpg',
  'item_362_פחית_שימורים_חצי_פתוחה.jpg',
  'item_372_מראת_יד_עגולה.jpg',
  'item_396_ארגז_כלים_אדום.jpg',
  'item_409_הפחיות_של_קוקה_קולה.jpg',
  'item_411_הארי_פוטר.jpg',
  'item_412_שרלוק_הולמס.jpg',
  'item_414_לגו.jpg',
  'item_428_קביים.jpg',
  'item_445_הבית_הלבן.jpg',
  'item_459_יונה_לבנה_עם_עלה_זית.jpg',
  'item_465_קרחון__iceberg_.jpg',
  'item_470_מדליית_זהב.jpg',
  'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg',
  'item_480_פרש_הברונזה___אביר_על_סוס_לבן.jpg',
  'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg',
  'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg',
  'item_492_צלחת_לוויין.jpg',
  'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg',
  'authentic_barbie_doll.jpg',
  'authentic_sonic_the_hedgehog.jpg',
  'authentic_super_mario.jpg'
];

async function run() {
  await fixBarbie();
  const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const cards = files39.map((file, idx) => {
    const absPath = 'file:///' + path.join(POOL_DIR, file).replace(/\\/g, '/');
    return `
      <div class="card">
        <div class="img-wrap">
          <img src="${absPath}" />
        </div>
        <div class="label">[${idx}] ${file}</div>
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; padding: 10px; background: #0f172a; font-family: Arial, sans-serif; display: grid; grid-template-columns: repeat(5, 280px); gap: 10px; }
      .card { background: #1e293b; border: 1px solid #334155; border-radius: 6px; overflow: hidden; }
      .img-wrap { width: 280px; height: 170px; overflow: hidden; background: #000; }
      .img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .label { color: #f8fafc; font-size: 11px; padding: 4px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 22px; }
    </style>
  </head>
  <body>${cards}</body>
  </html>`;

  const htmlPath = path.join(OUT_DIR, 'check_39.html');
  const pngPath = path.join(OUT_DIR, 'check_39.png');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  execSync(`"${EDGE}" --headless --disable-gpu --window-size=1480,1680 --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
  console.log('Rendered check_39.png');
}

run();

