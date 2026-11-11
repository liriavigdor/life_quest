import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets');
const state = JSON.parse(fs.readFileSync('public/data/user_curation_state.json', 'utf8'));
const userTouched = new Set([
  ...(state.discardedIds || []),
  ...Object.keys(state.flaggedBadMap || {}),
  ...Object.keys(state.localEdits || {})
]);

const unhandledFiles = [];
for (const item of STAGED_IMAGES_POOL) {
  if (!userTouched.has(item.id)) {
    unhandledFiles.push(path.basename(item.imageUrl));
  }
}

// Write an HTML page that loads all 331 unhandled images and logs any with naturalWidth / naturalHeight < 1.32
const imgsHtml = unhandledFiles.map((f, i) => {
  const url = 'file:///' + path.join(POOL_DIR, f).replace(/\\/g, '/');
  return `<img id="img_${i}" data-file="${f}" src="${url}" />`;
}).join('\n');

const html = `<!DOCTYPE html>
<html>
<body>
${imgsHtml}
<script>
window.addEventListener('load', () => {
  const tall = [];
  document.querySelectorAll('img').forEach(img => {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (w > 0 && h > 0 && (w / h) < 1.32) {
      tall.push({ file: img.getAttribute('data-file'), w, h, ratio: +(w / h).toFixed(2) });
    }
  });
  document.title = JSON.stringify(tall);
  const pre = document.createElement('pre');
  pre.id = 'out';
  pre.textContent = JSON.stringify(tall, null, 2);
  document.body.innerHTML = '';
  document.body.appendChild(pre);
});
</script>
</body>
</html>`;

const htmlPath = path.join(OUT_DIR, 'check_dims.html');
fs.writeFileSync(htmlPath, html, 'utf8');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
const domOut = execSync(`"${EDGE}" --headless --disable-gpu --dump-dom "${fileUrl}"`, { encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 });
const match = domOut.match(/<pre id="out">([\s\S]*?)<\/pre>/);
if (match) {
  const tallList = JSON.parse(match[1]);
  console.log(`Found ${tallList.length} tall/square unhandled images (ratio < 1.32):`);
  fs.writeFileSync(path.join(OUT_DIR, 'tall_unhandled.json'), JSON.stringify(tallList, null, 2));
  console.log(tallList.map(x => `${x.file} (${x.w}x${x.h}, r=${x.ratio})`).join('\n'));
}

