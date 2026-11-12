import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets_164');
const UA = 'LifeQuestCuratorBot/4.4 (https://lifequest.local; admin@lifequest.local)';

async function run() {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=Donald_Duck&prop=pageimages&pithumbsize=900&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  const src = pages[0]?.thumbnail?.source;
  if (src) {
    const r = await fetch(src, { headers: { 'User-Agent': UA } });
    if (r.ok) {
      const tmpFile = path.join(OUT_DIR, 'donald_wiki.png');
      fs.writeFileSync(tmpFile, Buffer.from(await r.arrayBuffer()));
      const fileUrl = 'file:///' + tmpFile.replace(/\\/g, '/');
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /><style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { width: 560px; height: 340px; overflow: hidden; background: radial-gradient(circle, #eff6ff 0%, #bfdbfe 65%, #1e3a8a 100%); display: flex; align-items: center; justify-content: center; }
        img { max-width: 90%; max-height: 90%; width: auto; height: 90%; object-fit: contain; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.35)); }
      </style></head><body><img src="${fileUrl}" /></body></html>`;
      const htmlPath = path.join(OUT_DIR, 'donald_reframe.html');
      const pngPath = path.join(POOL_DIR, 'donald_duck_sailor.jpg');
      fs.writeFileSync(htmlPath, html, 'utf8');
      const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
      execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=560,340 --screenshot="${pngPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`, { stdio: 'ignore' });
      console.log('Saved crisp color Donald Duck!');
    }
  }
}

run();

