import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets_164');
const UA = 'LifeQuestCuratorBot/4.1 (https://lifequest.local; admin@lifequest.local)';

async function fetchDonaldDuck() {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20Donald%20Duck%20Disneyland&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
    if (src) {
      const imgRes = await fetch(src, { headers: { 'User-Agent': UA } });
      if (imgRes.ok) {
        fs.writeFileSync(path.join(POOL_DIR, 'donald_duck_sailor.jpg'), Buffer.from(await imgRes.arrayBuffer()));
        console.log('Downloaded Donald Duck:', p.title);
        return;
      }
    }
  }
}

// All 42 replaced + portrait files from the first batch to reframe/verify at 560x340
const FIRST_BATCH_TO_REFRAME = [
  'homer_simpson.jpg',
  'winnie_the_pooh_honey.jpg',
  'spongebob.jpg',
  'authentic_dracula.jpg',
  'hulk_bruce_banner.jpg',
  'donald_duck_sailor.jpg',
  'authentic_scooby_doo.jpg',
  'authentic_captain_america.jpg',
  'wolverine_logan.jpg',
  'ronald_mcdonald.jpg',
  'pyramids_of_giza_egypt.jpg',
  'leaning_tower_of_pisa.jpg',
  'big_ben_london.jpg',
  'azrieli_towers.jpg',
  'chinese_pagoda.jpg',
  'neon_motel_sign.jpg',
  'tutankhamun.jpg',
  'native_totem_pole.jpg',
  'matryoshka_nesting_dolls.jpg',
  'chess_knight_piece.jpg',
  'golden_menorah_seven.jpg',
  'hamsa_hand_amulet.jpg',
  'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg',
  'item_156_מפתח_מכני_גדול__מסמל.jpg',
  'item_162_כובע_בוגר_אוניברסיטה__מרובע_עם_גדיל___מסמל.jpg',
  'item_164_חץ_שלוח_פוגע_בול_במרכז_המטרה__מסמל.jpg',
  'item_166_שעון_חול__חצי_מלא___מסמל.jpg',
  'item_167_שטיח_אדום_ארוך__מסמל.jpg',
  'item_169_גביע_זהב_עם_ידיות__מסמל.jpg',
  'item_179_מטוס_נייר_מקופל__מסמל.jpg',
  'item_188_שבב_אלקטרוני__צ_יפ_ירוק_עם_פסי_זהב___מסמל.jpg',
  'item_190_סיכת_נעץ_משרדית__אדומה___מסמלת.jpg',
  'authentic_pinocchio.jpg',
  'authentic_peter_pan.jpg',
  'minions.jpg',
  'the_grinch.jpg',
  'kremlin_red_square_moscow.jpg',
  'chichen_itza_pyramid.jpg',
  'western_wall_jerusalem.jpg',
  'item_155_זכוכית_מגדלת__מסמלת.jpg',
  'item_184_מלאך_קטן_עם_חץ_וקשת__קופידון___מסמל.jpg',
  'item_196_מטאטא_זרדים_ישן__מסמל.jpg',
  'item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן__מסמל.jpg'
];

async function run() {
  await fetchDonaldDuck();

  const tmpOrigDir = path.join(OUT_DIR, 'orig_43');
  fs.mkdirSync(tmpOrigDir, { recursive: true });
  for (const f of FIRST_BATCH_TO_REFRAME) {
    if (fs.existsSync(path.join(POOL_DIR, f))) {
      fs.copyFileSync(path.join(POOL_DIR, f), path.join(tmpOrigDir, f));
    }
  }

  const W = 560;
  const H = 340;
  const COLS = 5;
  const ROWS = Math.ceil(FIRST_BATCH_TO_REFRAME.length / COLS);
  const totalW = COLS * W;
  const totalH = ROWS * H;

  const cells = FIRST_BATCH_TO_REFRAME.map(f => {
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
  <body><div class="grid">${cells}</div></body>
  </html>`;

  const htmlPath = path.join(OUT_DIR, 'reframe_43.html');
  const pngPath = path.join(OUT_DIR, 'reframe_43.png');
  fs.writeFileSync(htmlPath, html, 'utf8');
  fs.writeFileSync(path.join(OUT_DIR, 'reframe_43_list.json'), JSON.stringify(FIRST_BATCH_TO_REFRAME, null, 2));

  const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=${totalW},${totalH} --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
  console.log('Rendered reframe_43.png');
}

run();

