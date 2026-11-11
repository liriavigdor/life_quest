import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets');

const tallList = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'tall_unhandled.json'), 'utf8'));
const filesToReframe = tallList
  .filter(x => x.ratio < 0.88 || x.file === 'eiffel_tower_paris.jpg' || x.file === 'pikachu_electric_mouse.jpg')
  .map(x => x.file);

console.log(`Reframing ${filesToReframe.length} vertical images:`, filesToReframe);

const tmpOrigDir = path.join(OUT_DIR, 'orig_38');
fs.mkdirSync(tmpOrigDir, { recursive: true });
for (const f of filesToReframe) {
  fs.copyFileSync(path.join(POOL_DIR, f), path.join(tmpOrigDir, f));
}

const W = 560;
const H = 340;
const COLS = 5;
const ROWS = Math.ceil(filesToReframe.length / COLS);
const totalW = COLS * W;
const totalH = ROWS * H;

const cells = filesToReframe.map(f => {
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

const htmlPath = path.join(OUT_DIR, 'reframe_38.html');
const pngPath = path.join(OUT_DIR, 'reframe_38.png');
fs.writeFileSync(htmlPath, html, 'utf8');
fs.writeFileSync(path.join(OUT_DIR, 'reframe_38_list.json'), JSON.stringify(filesToReframe, null, 2), 'utf8');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
execSync(`"${EDGE}" --headless --disable-gpu --hide-scrollbars --window-size=${totalW},${totalH} --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
console.log('Rendered reframe_38.png');

