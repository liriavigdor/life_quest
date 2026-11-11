import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const manifest = JSON.parse(fs.readFileSync('public/data/ai_curated_manifest.json', 'utf8'));

// Find all items whose image was not JPEG/PNG (i.e. WEBP, AVIF, GIF)
const nonJpgItems = [];
manifest.forEach((x, idx) => {
  const b = fs.readFileSync('public' + x.imageUrl);
  const isJpg = b[0] === 0xFF && b[1] === 0xD8;
  const isPng = b[0] === 0x89 && b[1] === 0x50;
  if (!isJpg && !isPng) {
    nonJpgItems.push({ ...x, globalIdx: idx + 1 });
  }
});

console.log(`Found ${nonJpgItems.length} WebP/AVIF/GIF items to render via Edge.`);

const perSheet = 25;
const sheets = Math.ceil(nonJpgItems.length / perSheet);
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

for (let s = 0; s < sheets; s++) {
  const slice = nonJpgItems.slice(s * perSheet, (s + 1) * perSheet);
  const cardsHtml = slice.map(item => {
    const fileUrl = 'file:///' + path.resolve('public' + item.imageUrl).replace(/\\/g, '/');
    return `
      <div class="card">
        <img src="${fileUrl}" />
        <div class="title">#${item.globalIdx} ${item.name}</div>
        <div class="sub">${item.id.slice(0, 28)}</div>
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
  <html dir="rtl">
  <head>
    <meta charset="utf-8" />
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: #0f172a; font-family: Arial, sans-serif; width: 1300px; height: 1050px; overflow: hidden; padding: 6px; }
      .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
      .card { background: #1e293b; border: 2px solid #475569; border-radius: 8px; overflow: hidden; height: 200px; }
      .card img { width: 100%; height: 150px; object-fit: cover; display: block; background: #000; }
      .title { color: #fff; font-weight: bold; font-size: 14px; padding: 4px 6px 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sub { color: #94a3b8; font-family: Consolas, monospace; font-size: 10px; padding: 0 6px; direction: ltr; text-align: left; }
    </style>
  </head>
  <body>
    <div class="grid">${cardsHtml}</div>
  </body>
  </html>`;

  const htmlPath = path.resolve(`scripts/sheets/webp_sheet_${s + 1}.html`);
  const pngPath = path.resolve(`scripts/sheets/webp_sheet_${s + 1}.png`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  execFileSync(edgePath, [
    '--headless',
    '--disable-gpu',
    `--screenshot=${pngPath}`,
    '--window-size=1300,1050',
    `file:///${htmlPath.replace(/\\/g, '/')}`
  ]);
  console.log(`Rendered ${pngPath}`);
}

