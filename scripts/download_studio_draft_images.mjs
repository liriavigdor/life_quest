import fs from 'fs';
import path from 'path';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

const TARGET_DIR = path.resolve('public/staged_images/pool');
const USER_AGENT = 'LifeQuestCurator/3.0 (https://lifequest.local; curator@lifequest.local)';
const THROTTLE_MS = 150;

if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 1. Raster validation & magic byte checking
function verifyRaster(buffer, minSize = 10000, minWidth = 250, minHeight = 250) {
  const size = buffer.length;
  if (size < minSize) return { valid: false, reason: 'Size too small' };

  const headStr = buffer.subarray(0, 256).toString('latin1').toLowerCase();
  if (headStr.includes('<html') || headStr.includes('<!doctype') || headStr.includes('<svg')) {
    return { valid: false, reason: 'HTML or SVG markup' };
  }

  // JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2;
    while (offset < size - 4) {
      if (buffer[offset] !== 0xFF) break;
      const marker = buffer[offset + 1];
      if (marker === 0xD9 || marker === 0xDA) break;
      const len = buffer.readUInt16BE(offset + 2);
      if (len < 2 || offset + 2 + len > size) break;
      // SOF0..SOF2
      if (marker === 0xC0 || marker === 0xC1 || marker === 0xC2) {
        const height = buffer.readUInt16BE(offset + 5);
        const width = buffer.readUInt16BE(offset + 7);
        return {
          valid: width >= minWidth && height >= minHeight,
          format: 'JPEG',
          width,
          height,
          size
        };
      }
      offset += 2 + len;
    }
    return { valid: size >= 15000, format: 'JPEG', width: 400, height: 400, size };
  }

  // PNG
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
    if (size >= 24) {
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return {
        valid: width >= minWidth && height >= minHeight,
        format: 'PNG',
        width,
        height,
        size
      };
    }
  }

  // WebP
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    return { valid: true, format: 'WEBP', width: 400, height: 400, size };
  }

  return { valid: false, reason: 'Unknown format' };
}

// 2. Fetch with retry and user-agent
async function fetchWithRetry(url, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json,image/*,*/*' },
        signal: AbortSignal.timeout(10000)
      });
      if (res.status === 429) {
        await sleep(1500 * (i + 1));
        continue;
      }
      return res;
    } catch (e) {
      if (i === maxRetries) throw e;
      await sleep(1000);
    }
  }
}

// 3. Search Wikipedia & Commons cascade
async function searchAndDownloadImage(query, altQuery) {
  const queries = [query, altQuery].filter(Boolean);

  for (const q of queries) {
    // A: En Wikipedia Search Generator
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=3&prop=pageimages&pithumbsize=800&format=json`;
      const res = await fetchWithRetry(url);
      if (res.ok) {
        const data = await res.json();
        const pages = Object.values(data.query?.pages || {});
        for (const p of pages) {
          const imgUrl = p.thumbnail?.source;
          if (imgUrl && !imgUrl.toLowerCase().includes('.svg') && !imgUrl.toLowerCase().includes('.pdf')) {
            const imgRes = await fetchWithRetry(imgUrl);
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const v = verifyRaster(buf);
              if (v.valid) return { buffer: buf, info: v, source: 'wikipedia_en', url: imgUrl };
            }
          }
        }
      }
    } catch (_) {}

    // B: Wikimedia Commons Media Search
    try {
      const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=4&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
      const res = await fetchWithRetry(commonsUrl);
      if (res.ok) {
        const data = await res.json();
        const pages = Object.values(data.query?.pages || {});
        for (const p of pages) {
          const info = p.imageinfo?.[0];
          const dlUrl = info?.thumburl || info?.url;
          const mime = (info?.mime || '').toLowerCase();
          if (dlUrl && !mime.includes('svg') && !mime.includes('pdf')) {
            const imgRes = await fetchWithRetry(dlUrl);
            if (imgRes.ok) {
              const buf = Buffer.from(await imgRes.arrayBuffer());
              const v = verifyRaster(buf);
              if (v.valid) return { buffer: buf, info: v, source: 'wikimedia_commons', url: dlUrl };
            }
          }
        }
      }
    } catch (_) {}
  }

  return null;
}

async function main() {
  console.log(`Starting automated image downloader for ${INITIAL_CREATION_DRAFT_ROOTS.length} studio draft roots...`);
  console.log(`Target directory: ${TARGET_DIR}`);

  const results = [];
  let downloadedCount = 0;
  let alreadyExistedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < INITIAL_CREATION_DRAFT_ROOTS.length; i++) {
    const item = INITIAL_CREATION_DRAFT_ROOTS[i];
    const filename = `${item.id}.jpg`;
    const filepath = path.join(TARGET_DIR, filename);

    // If file already exists and valid, skip download
    if (fs.existsSync(filepath) && fs.statSync(filepath).size >= 10000) {
      alreadyExistedCount++;
      results.push({
        ...item,
        status: 'cached',
        filename,
        imageUrl: `/staged_images/pool/${filename}`,
        size: fs.statSync(filepath).size
      });
      process.stdout.write(`[${i+1}/${INITIAL_CREATION_DRAFT_ROOTS.length}] Cached: ${item.title}\n`);
      continue;
    }

    process.stdout.write(`[${i+1}/${INITIAL_CREATION_DRAFT_ROOTS.length}] Fetching for "${item.title}" (${item.searchQuery})... `);

    // Generate alternate query from title and keywords
    const altQuery = item.keywords.slice(0, 2).join(' ') + ' tool';
    const acquired = await searchAndDownloadImage(item.searchQuery, altQuery);

    if (acquired) {
      fs.writeFileSync(filepath, acquired.buffer);
      downloadedCount++;
      results.push({
        ...item,
        status: 'downloaded',
        filename,
        imageUrl: `/staged_images/pool/${filename}`,
        size: acquired.buffer.length,
        width: acquired.info.width,
        height: acquired.info.height,
        source: acquired.source
      });
      console.log(`OK! (${(acquired.buffer.length/1024).toFixed(1)} KB, ${acquired.info.width}x${acquired.info.height})`);
    } else {
      failedCount++;
      results.push({
        ...item,
        status: 'failed',
        filename: null,
        imageUrl: null
      });
      console.log(`FAILED! No suitable raster image found.`);
    }

    await sleep(THROTTLE_MS);
  }

  console.log(`\n================ Summary ================`);
  console.log(`Total: ${INITIAL_CREATION_DRAFT_ROOTS.length}`);
  console.log(`Newly Downloaded: ${downloadedCount}`);
  console.log(`Already Present: ${alreadyExistedCount}`);
  console.log(`Failed: ${failedCount}`);

  // Generate Contact Sheet HTML for human review
  generateContactSheet(results);

  // Update creationDraftRoots.js with image paths
  updateCreationDraftsFile(results);
}

function generateContactSheet(items) {
  const contactSheetPath = path.resolve('public/creation_contact_sheet.html');

  const cardsHtml = items.map((item, idx) => {
    const isSuccess = Boolean(item.imageUrl);
    const keywordsHtml = (item.keywords || []).map(k => `<span class="chip">#${k}</span>`).join(' ');

    return `
      <div class="card ${isSuccess ? 'success' : 'failed'}" id="card_${item.id}">
        <div class="card-header">
          <span class="idx">#${idx + 1}</span>
          <span class="category">${item.category || ''}</span>
        </div>
        <div class="img-box">
          ${isSuccess 
            ? `<img src="${item.imageUrl}" alt="${item.title}" loading="lazy" />`
            : `<div class="missing">⚠️ תמונה חסרה</div>`
          }
        </div>
        <div class="content">
          <div class="title">${item.title}</div>
          <div class="chips">${keywordsHtml}</div>
          <div class="meta">${item.searchQuery || ''}</div>
          <div class="actions">
            <button class="btn approve" onclick="markCard('${item.id}', true)">✅ אשר</button>
            <button class="btn reject" onclick="markCard('${item.id}', false)">❌ פסול</button>
            <a href="https://www.google.com/search?tbm=isch&q=${encodeURIComponent(item.searchQuery || item.title)}" target="_blank" class="btn search">🔍 חפש</a>
          </div>
        </div>
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>Contact Sheet - סקירת תמונות שטוייבו אוטומטית (81 פריטים)</title>
  <style>
    body {
      background-color: #0b0f19;
      color: #f8fafc;
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 24px;
    }
    .header {
      background-color: #131c2e;
      border: 1px solid #1e293b;
      border-radius: 14px;
      padding: 20px 28px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    h1 { margin: 0 0 6px 0; font-size: 1.4rem; color: #38bdf8; }
    p { margin: 0; color: #94a3b8; font-size: 0.9rem; }
    .stats {
      display: flex;
      gap: 12px;
    }
    .stat-badge {
      background-color: #1e293b;
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid #334155;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
    }
    .card {
      background-color: #131c2e;
      border: 1px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all 0.15s ease;
    }
    .card.success { border-color: #10b981; }
    .card.failed { border-color: #ef4444; }
    .card.approved { opacity: 0.6; border-color: #059669; }
    .card.rejected { opacity: 0.35; border-color: #dc2626; text-decoration: line-through; }
    .card-header {
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      background-color: #0f172a;
      color: #94a3b8;
    }
    .idx { font-weight: 800; color: #38bdf8; }
    .img-box {
      height: 180px;
      background-color: #060911;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .img-box img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .missing { color: #f87171; font-weight: 700; font-size: 0.85rem; }
    .content {
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      flex: 1;
    }
    .title { font-weight: 800; font-size: 1rem; color: #f8fafc; }
    .chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .chip {
      background-color: #0f172a;
      border: 1px solid #1e293b;
      color: #38bdf8;
      padding: 2px 7px;
      border-radius: 5px;
      font-size: 0.72rem;
      font-weight: 600;
    }
    .meta { font-size: 0.68rem; color: #64748b; direction: ltr; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .actions {
      display: flex;
      gap: 6px;
      margin-top: auto;
      padding-top: 8px;
    }
    .btn {
      flex: 1;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      border: none;
      text-align: center;
      text-decoration: none;
    }
    .btn.approve { background-color: #059669; color: #fff; }
    .btn.reject { background-color: #dc2626; color: #fff; }
    .btn.search { background-color: #1e293b; color: #cbd5e1; border: 1px solid #334155; }
  </style>
  <script>
    function markCard(id, approved) {
      const el = document.getElementById('card_' + id);
      if (!el) return;
      el.classList.remove('approved', 'rejected');
      el.classList.add(approved ? 'approved' : 'rejected');
    }
  </script>
</head>
<body>
  <div class="header">
    <div>
      <h1>📋 לוח בקרת איכות תמונות (Human Review Contact Sheet)</h1>
      <p>כל התמונות הורדו ישירות ברזולוציה גבוהה מ-Wikimedia/Wikipedia ב-0 טוקנים. עין אנושית סורקת ב-30 שניות!</p>
    </div>
    <div class="stats">
      <div class="stat-badge" style="color: #10b981;">הורדו בהצלחה: ${items.filter(i => i.imageUrl).length}</div>
      <div class="stat-badge" style="color: #f87171;">דורשים בדיקה: ${items.filter(i => !i.imageUrl).length}</div>
      <div class="stat-badge" style="color: #38bdf8;">סה״כ: ${items.length}</div>
    </div>
  </div>

  <div class="grid">
    ${cardsHtml}
  </div>
</body>
</html>`;

  fs.writeFileSync(contactSheetPath, html, 'utf8');
  console.log(`\nGenerated Contact Sheet: ${contactSheetPath}`);
}

function updateCreationDraftsFile(items) {
  const draftsFilePath = path.resolve('src/data/creationDraftRoots.js');
  const updatedItems = items.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    keywords: item.keywords,
    searchQuery: item.searchQuery,
    imageUrl: item.imageUrl || null
  }));

  const content = `/**
 * INITIAL_CREATION_DRAFT_ROOTS
 * 
 * מאגר שורשים מורחב לסטודיו היצירה עם נתיבי תמונות שהורדו אוטומטית.
 * סה"כ ${updatedItems.length} עוגנים עם תמונות מקומיות ב-public/staged_images/pool/.
 */

export const INITIAL_CREATION_DRAFT_ROOTS = ${JSON.stringify(updatedItems, null, 2)};
`;

  fs.writeFileSync(draftsFilePath, content, 'utf8');
  console.log(`Updated ${draftsFilePath} with downloaded image paths!`);
}

main().catch(err => {
  console.error('Fatal error in downloader:', err);
  process.exit(1);
});

