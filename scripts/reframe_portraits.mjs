import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets');
fs.mkdirSync(OUT_DIR, { recursive: true });
const UA = 'LifeQuestCuratorBot/3.8 (https://lifequest.local; admin@lifequest.local)';

async function downloadCoke() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent('File:6 Coca-Cola bottles.jpg')}&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const src = pages[0]?.imageinfo?.[0]?.thumburl || pages[0]?.imageinfo?.[0]?.url;
  if (src) {
    const imgRes = await fetch(src, { headers: { 'User-Agent': UA } });
    if (imgRes.ok) {
      fs.writeFileSync(path.join(POOL_DIR, 'item_409_הפחיות_של_קוקה_קולה.jpg'), Buffer.from(await imgRes.arrayBuffer()));
      console.log('Updated Coca-Cola image');
    }
  }
}

export const PORTRAIT_FILES = [
  'statue_of_liberty_ny.jpg',
  'star_of_david.jpg',
  'item_151_נורה_דולקת__מסמלת.jpg',
  'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg',
  'item_351_פטיש_מסמרים_קלאסי.jpg',
  'item_364_נר_דולק_נוטף_שעווה.jpg',
  'item_396_ארגז_כלים_אדום.jpg',
  'item_409_הפחיות_של_קוקה_קולה.jpg',
  'item_412_שרלוק_הולמס.jpg',
  'item_442_פסל_דוד__מיכלאנג_לו_.jpg',
  'item_447_פסל_ישו_הגואל_בריו.jpg',
  'item_470_מדליית_זהב.jpg',
  'item_476_שחמט__כלי_המלך_או_הרץ_.jpg',
  'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg',
  'item_484_בודהה_מחייך.jpg',
  'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg',
  'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg',
  'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg',
  'authentic_barbie_doll.jpg',
  'authentic_sonic_the_hedgehog.jpg',
  'authentic_super_mario.jpg',
  'spider_man.jpg',
  'batman.jpg',
  'superman.jpg',
  'iron_man.jpg',
  'the_joker.jpg',
  'robin_hood.jpg',
  'cinderella.jpg',
  'harry_potter.jpg',
  'terminator.jpg',
  'gandalf.jpg',
  'robocop.jpg',
  'predator.jpg',
  'degas_little_ballerina.jpg',
  'native_dreamcatcher.jpg',
  'item_255_אריה.jpg',
  'item_257_ג_ירפה.jpg',
  'item_263_פינגווין_קיסרי.jpg',
  'item_268_ינשוף_על_ענף.jpg',
  'item_269_נשר_דואה.jpg',
  'item_270_קנגורו.jpg',
  'item_271_גמל_דו_דבשתי.jpg',
  'item_296_נחש_קוברה.jpg',
  'item_343_חליפת_חלל.jpg',
  'item_367_מצית_זיפו.jpg',
  'item_401_דארת__ויידר.jpg',
  'item_402_באטמן.jpg',
  'item_403_סופרמן.jpg',
  'item_406_הלו_קיטי.jpg',
  'item_410_מרלין_מונרו.jpg',
  'item_435_חליפת_חלל.jpg',
  'item_441_פסל_החושב__רודן_.jpg',
  'item_485_מלאך_המוות__grim_reaper_.jpg',
  'item_491_רובוט_מתכתי__קופסתי_עם_עיניים_מאירות_.jpg',
  'item_495_איש_קו_על_כיסא_גלגלים.jpg'
];

async function run() {
  await downloadCoke();

  // Copy originals to a temp folder so Edge can read them cleanly
  const tmpOrigDir = path.join(OUT_DIR, 'orig_portraits');
  fs.mkdirSync(tmpOrigDir, { recursive: true });
  for (const f of PORTRAIT_FILES) {
    const src = path.join(POOL_DIR, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tmpOrigDir, f));
    }
  }

  const W = 560;
  const H = 340;
  const COLS = 5;
  const ROWS = Math.ceil(PORTRAIT_FILES.length / COLS);
  const totalW = COLS * W;
  const totalH = ROWS * H;

  const cells = PORTRAIT_FILES.map(f => {
    const url = 'file:///' + path.join(tmpOrigDir, f).replace(/\\/g, '/');
    return `
      <div class="cell">
        <img class="bg" src="${url}" />
        <div class="dim"></div>
        <img class="fg" src="${url}" />
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { width: ${totalW}px; height: ${totalH}px; overflow: hidden; background: #0f172a; }
      .grid { display: grid; grid-template-columns: repeat(${COLS}, ${W}px); grid-auto-rows: ${H}px; width: ${totalW}px; height: ${totalH}px; }
      .cell { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #1e293b; display: flex; align-items: center; justify-content: center; }
      .bg { position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px); object-fit: cover; filter: blur(18px) brightness(0.45); z-index: 1; }
      .dim { position: absolute; inset: 0; background: radial-gradient(circle, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.55) 100%); z-index: 2; }
      .fg { position: relative; z-index: 3; max-width: 92%; max-height: 92%; width: auto; height: 92%; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
    </style>
  </head>
  <body>
    <div class="grid">${cells}</div>
  </body>
  </html>`;

  const htmlPath = path.join(OUT_DIR, 'reframe_grid.html');
  const pngPath = path.join(OUT_DIR, 'reframe_grid.png');
  fs.writeFileSync(htmlPath, html, 'utf8');

  const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=${totalW},${totalH} --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
  console.log('Rendered master reframe_grid.png');
}

run();

