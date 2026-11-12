import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { AUDITED_VERIFIED_POOL } from '../src/data/auditedImagesPool.js';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const OUT_DIR = path.resolve('scripts/sheets_164');
fs.mkdirSync(OUT_DIR, { recursive: true });

const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const discarded = new Set(state.discardedIds || []);
const stagedMap = new Map(STAGED_IMAGES_POOL.map(x => [x.id, x]));

// Collect all unique items from AUDITED_VERIFIED_POOL + all non-discarded userTouched items from STAGED_IMAGES_POOL
const itemsToInspect = [];
const seenIds = new Set();

for (const item of AUDITED_VERIFIED_POOL) {
  seenIds.add(item.id);
  const staged = stagedMap.get(item.id);
  itemsToInspect.push({
    id: item.id,
    name: item.name,
    auditedUrl: item.imageUrl,
    stagedUrl: staged ? staged.imageUrl : item.imageUrl,
    branches: item.branches || [],
    isDiscarded: discarded.has(item.id)
  });
}

for (const item of STAGED_IMAGES_POOL) {
  if (!seenIds.has(item.id) && !item.aiCurated && !discarded.has(item.id)) {
    seenIds.add(item.id);
    itemsToInspect.push({
      id: item.id,
      name: item.name,
      auditedUrl: item.imageUrl,
      stagedUrl: item.imageUrl,
      branches: item.associations || [],
      isDiscarded: false
    });
  }
}

console.log(`Total items to visually inspect: ${itemsToInspect.length}`);
fs.writeFileSync(path.join(OUT_DIR, 'items_164_manifest.json'), JSON.stringify(itemsToInspect, null, 2));

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const perSheet = 25;
const numSheets = Math.ceil(itemsToInspect.length / perSheet);

for (let s = 0; s < numSheets; s++) {
  const chunk = itemsToInspect.slice(s * perSheet, (s + 1) * perSheet);
  const cards = chunk.map((it, idx) => {
    // Use stagedUrl so we see the current file in STAGED_IMAGES_POOL
    const relPath = it.stagedUrl.startsWith('/') ? it.stagedUrl.slice(1) : it.stagedUrl;
    const absPath = 'file:///' + path.resolve('public', relPath).replace(/\\/g, '/');
    const badge = it.isDiscarded ? '[TRASH] ' : '';
    return `
      <div class="card" style="${it.isDiscarded ? 'opacity:0.55;border-color:#ef4444;' : ''}">
        <div class="img-wrap">
          <img src="${absPath}" />
        </div>
        <div class="label">[${s * perSheet + idx}] ${badge}${it.id} | ${it.name}</div>
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
      .label { color: #f8fafc; font-size: 11px; padding: 4px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 22px; direction: rtl; }
    </style>
  </head>
  <body>${cards}</body>
  </html>`;

  const htmlPath = path.join(OUT_DIR, `aud_${s + 1}.html`);
  const pngPath = path.join(OUT_DIR, `aud_${s + 1}.png`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  execSync(`"${EDGE}" --headless --disable-gpu --window-size=1480,1080 --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
  console.log(`Rendered aud_${s + 1}.png`);
}

