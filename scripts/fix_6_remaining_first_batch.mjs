import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets_164');
const UA = 'LifeQuestCuratorBot/4.2 (https://lifequest.local; admin@lifequest.local)';

// 1. Copy clean graduation caps from item_436
fs.copyFileSync(
  path.join(POOL_DIR, 'item_436_כובע_בוגרים__שוליים_מרובעים_וגדיל_.jpg'),
  path.join(POOL_DIR, 'item_162_כובע_בוגר_אוניברסיטה__מרובע_עם_גדיל___מסמל.jpg')
);

const ITEMS_5 = [
  { file: 'donald_duck_sailor.jpg', wiki: '', q: 'Donald Duck statue OR Donald Duck character meet' },
  { file: 'leaning_tower_of_pisa.jpg', wiki: 'Leaning Tower of Pisa', q: 'Leaning Tower of Pisa Italy' },
  { file: 'neon_motel_sign.jpg', wiki: '', q: 'Motel neon sign vintage' },
  { file: 'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg', wiki: '', q: 'Bomb fuse icon OR cartoon bomb black' },
  { file: 'item_196_מטאטא_זרדים_ישן__מסמל.jpg', wiki: '', q: 'Birch besom broom twig' }
];

async function getWikiLead(title) {
  if (!title) return null;
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=900&redirects=1&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages[0]?.thumbnail?.source || null;
}

async function getCommons(q) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = (p.title || '').toLowerCase();
    if (
      (t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png') || t.endsWith('.svg')) &&
      !t.includes('fifer') &&
      !t.includes('painting') &&
      !t.includes('coast')
    ) {
      const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
      if (src) return { src, title: p.title };
    }
  }
  return null;
}

async function run() {
  for (const it of ITEMS_5) {
    let src = await getWikiLead(it.wiki);
    let label = it.wiki;
    if (!src) {
      const found = await getCommons(it.q);
      if (found) {
        src = found.src;
        label = found.title;
      }
    }
    if (src) {
      const res = await fetch(src, { headers: { 'User-Agent': UA } });
      if (res.ok) {
        fs.writeFileSync(path.join(POOL_DIR, it.file), Buffer.from(await res.arrayBuffer()));
        console.log(`OK: ${it.file} <- ${label}`);
      }
    }
  }

  // Also copy clean Leaning Tower of Pisa to item_446_מגדל_פיזה_הנוטה.jpg
  fs.copyFileSync(
    path.join(POOL_DIR, 'leaning_tower_of_pisa.jpg'),
    path.join(POOL_DIR, 'item_446_מגדל_פיזה_הנוטה.jpg')
  );

  // Reframe these 6 files onto 560x340 via Edge
  const files6 = [
    'donald_duck_sailor.jpg',
    'leaning_tower_of_pisa.jpg',
    'item_446_מגדל_פיזה_הנוטה.jpg',
    'neon_motel_sign.jpg',
    'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg',
    'item_196_מטאטא_זרדים_ישן__מסמל.jpg'
  ];

  const tmpDir = path.join(OUT_DIR, 'orig_6_fix');
  fs.mkdirSync(tmpDir, { recursive: true });
  for (const f of files6) {
    fs.copyFileSync(path.join(POOL_DIR, f), path.join(tmpDir, f));
  }

  const W = 560, H = 340, COLS = 3, ROWS = 2;
  const cells = files6.map(f => {
    const url = 'file:///' + path.join(tmpDir, f).replace(/\\/g, '/');
    return `<div class="cell"><img class="bg" src="${url}" /><div class="dim"></div><img class="fg" src="${url}" /></div>`;
  }).join('\n');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: ${COLS * W}px; height: ${ROWS * H}px; overflow: hidden; background: #0f172a; }
    .grid { display: grid; grid-template-columns: repeat(${COLS}, ${W}px); grid-auto-rows: ${H}px; }
    .cell { position: relative; width: ${W}px; height: ${H}px; overflow: hidden; background: #1e293b; display: flex; align-items: center; justify-content: center; }
    .bg { position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px); object-fit: cover; filter: blur(18px) brightness(0.45); z-index: 1; }
    .dim { position: absolute; inset: 0; background: radial-gradient(circle, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.55) 100%); z-index: 2; }
    .fg { position: relative; z-index: 3; max-width: 92%; max-height: 92%; width: auto; height: 92%; object-fit: contain; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5)); }
  </style></head><body><div class="grid">${cells}</div></body></html>`;

  const htmlPath = path.join(OUT_DIR, 'reframe_6_fix.html');
  const pngPath = path.join(OUT_DIR, 'reframe_6_fix.png');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=${COLS * W},${ROWS * H} --screenshot="${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`, { stdio: 'ignore' });
  console.log('Rendered reframe_6_fix.png');
}

run();

