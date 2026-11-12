import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets_164');
const UA = 'LifeQuestCuratorBot/4.3 (https://lifequest.local; admin@lifequest.local)';

async function run() {
  // Fetch a colorful Donald Duck photo from Commons
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20%22Donald%20Duck%22%20Disney&gsrnamespace=6&gsrlimit=15&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  pages.sort((a, b) => (a.index || 99) - (b.index || 99));
  for (const p of pages) {
    const t = p.title.toLowerCase();
    if (t.includes('donald duck') && !t.includes('fifer') && !t.includes('logo') && !t.includes('star')) {
      const src = p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url;
      if (src) {
        const r = await fetch(src, { headers: { 'User-Agent': UA } });
        if (r.ok) {
          fs.writeFileSync(path.join(OUT_DIR, 'donald_color.jpg'), Buffer.from(await r.arrayBuffer()));
          console.log('Picked Donald Duck:', p.title);
          break;
        }
      }
    }
  }

  // Render Donald Duck + Bomb (with bright warm background so black bomb pops!) + Broom (from item_358_מטאטא_ומגרוד.jpg or clean broom)
  const donaldUrl = 'file:///' + path.join(OUT_DIR, 'donald_color.jpg').replace(/\\/g, '/');
  const bombUrl = 'file:///' + path.join(OUT_DIR, 'orig_6_fix', 'authentic_item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת.jpg').replace(/\\/g, '/');

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { width: 1120px; height: 340px; overflow: hidden; background: #0f172a; }
    .grid { display: grid; grid-template-columns: repeat(2, 560px); grid-auto-rows: 340px; }
    .cell { position: relative; width: 560px; height: 340px; overflow: hidden; background: #1e293b; display: flex; align-items: center; justify-content: center; }
    .bg { position: absolute; inset: -20px; width: calc(100% + 40px); height: calc(100% + 40px); object-fit: cover; filter: blur(18px) brightness(0.45); z-index: 1; }
    .fg { position: relative; z-index: 3; max-width: 90%; max-height: 90%; width: auto; height: 90%; object-fit: contain; }
    .bomb-cell { background: radial-gradient(circle, #fef3c7 0%, #f59e0b 65%, #78350f 100%); }
  </style></head><body><div class="grid">
    <div class="cell"><img class="bg" src="${donaldUrl}" /><img class="fg" src="${donaldUrl}" /></div>
    <div class="cell bomb-cell"><img class="fg" src="${bombUrl}" /></div>
  </div></body></html>`;

  const htmlPath = path.join(OUT_DIR, 'reframe_2.html');
  const pngPath = path.join(OUT_DIR, 'reframe_2.png');
  fs.writeFileSync(htmlPath, html, 'utf8');
  const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=1120,340 --screenshot="${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`, { stdio: 'ignore' });
  console.log('Rendered reframe_2.png');
}

run();

