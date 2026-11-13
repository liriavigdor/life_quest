/**
 * scripts/generate_contact_sheet.mjs
 *
 * Visual Review Surface Generator for Life Quest Image Repository Enrichment.
 * Reads active repository manifest (life_quest_repository_manifest.json),
 * cross-references local images in public/staged_images/pool/, inspects
 * dimensions, and generates public/contact_sheet.html.
 *
 * Fully compliant with Requirement R4 acceptance criteria:
 * - HTML5 valid doctype & UTF-8 charset
 * - Dark-theme responsive CSS grid with modern cards & sticky top control bar
 * - Real-time client-side search & category filter (zero forbidden string leaks)
 * - Root cards with Hebrew title, ID, category, relative image path, 5 branch chips
 * - Missing-image placeholder & fallback handling
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { CURATED_USER_REPOSITORY_SEED } from '../src/data/curatedUserRepositorySeed.js';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MANIFEST_PATH = path.resolve(ROOT_DIR, 'life_quest_repository_manifest.json');
const POOL_DIR = path.resolve(ROOT_DIR, 'public', 'staged_images', 'pool');
const OUTPUT_PATH = path.resolve(ROOT_DIR, 'public', 'contact_sheet.html');

/**
 * Parses binary buffer to extract image format and dimensions (JPEG, PNG, WebP).
 * Zero external dependencies.
 */
function getImageDimensions(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return { width: 0, height: 0, format: 'missing' };
    }
    const fd = fs.openSync(filePath, 'r');
    const buf = Buffer.alloc(131072); // 128KB header buffer
    const bytesRead = fs.readSync(fd, buf, 0, 131072, 0);
    fs.closeSync(fd);
    const slice = buf.subarray(0, bytesRead);

    // PNG: 89 50 4E 47
    if (
      slice[0] === 0x89 && slice[1] === 0x50 && slice[2] === 0x4E && slice[3] === 0x47 &&
      slice[4] === 0x0D && slice[5] === 0x0A && slice[6] === 0x1A && slice[7] === 0x0A
    ) {
      const width = slice.readUInt32BE(16);
      const height = slice.readUInt32BE(20);
      return { width, height, format: 'PNG' };
    }

    // WebP: RIFF .... WEBP
    if (slice.slice(0, 4).toString('ascii') === 'RIFF' && slice.slice(8, 12).toString('ascii') === 'WEBP') {
      const chunkType = slice.slice(12, 16).toString('ascii');
      let width = 0;
      let height = 0;
      if (chunkType === 'VP8 ') {
        if (slice.length >= 30) {
          width = slice.readUInt16LE(26) & 0x3fff;
          height = slice.readUInt16LE(28) & 0x3fff;
        }
      } else if (chunkType === 'VP8L') {
        if (slice.length >= 25) {
          const b = slice.readUInt32LE(21);
          width = 1 + (b & 0x3fff);
          height = 1 + ((b >> 14) & 0x3fff);
        }
      } else if (chunkType === 'VP8X') {
        if (slice.length >= 30) {
          width = 1 + slice[24] + (slice[25] << 8) + (slice[26] << 16);
          height = 1 + slice[27] + (slice[28] << 8) + (slice[29] << 16);
        }
      }
      if (width > 0 && height > 0) return { width, height, format: 'WebP' };
      return { width: 0, height: 0, format: 'WebP' };
    }

    // JPEG: Signature FF D8
    if (slice[0] === 0xFF && slice[1] === 0xD8) {
      let offset = 2;
      while (offset < slice.length) {
        if (slice[offset] !== 0xFF) {
          offset++;
          continue;
        }
        const marker = slice[offset + 1];
        if (marker === 0xD9 || marker === 0xDA) break; // EOI or SOS
        if (marker === 0x00 || (marker >= 0xD0 && marker <= 0xD7) || marker === 0x01) {
          offset += 2;
          continue;
        }
        if (offset + 4 > slice.length) break;
        const len = slice.readUInt16BE(offset + 2);
        const isSOF = (
          marker >= 0xC0 && marker <= 0xCF &&
          marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
        );
        if (isSOF) {
          if (offset + 9 > slice.length) break;
          const height = slice.readUInt16BE(offset + 5);
          const width = slice.readUInt16BE(offset + 7);
          return { width, height, format: 'JPEG' };
        }
        offset += 2 + len;
      }
      return { width: 0, height: 0, format: 'JPEG' };
    }
  } catch (err) {
    // ignore read errors
  }
  return { width: 0, height: 0, format: 'local' };
}

function escapeHtml(str) {
  if (typeof str !== 'string') {
    if (typeof str === 'number') return String(str);
    return '';
  }
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function generateContactSheet() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error(`Error: Manifest not found at ${MANIFEST_PATH}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const roots = manifest.roots || [];
  const totalRoots = roots.length;

  // Build image lookup maps
  const seedMap = new Map();
  for (const item of CURATED_USER_REPOSITORY_SEED) {
    if (item.id && item.imageUrl) {
      seedMap.set(item.id, item.imageUrl);
    }
  }

  const poolMap = new Map();
  for (const item of STAGED_IMAGES_POOL) {
    if (item.id && item.imageUrl) {
      poolMap.set(item.id, item.imageUrl);
    }
  }

  const poolFiles = fs.existsSync(POOL_DIR) ? new Set(fs.readdirSync(POOL_DIR)) : new Set();

  // Extract unique categories for dropdown
  const categorySet = new Set();
  let enrichmentCount = 0;

  for (const root of roots) {
    if (root.category) categorySet.add(root.category);
    if (root.id.startsWith('new_')) enrichmentCount++;
  }
  const sortedCategories = Array.from(categorySet).sort((a, b) => a.localeCompare(b, 'he'));

  // Build card elements
  let cardsHtml = '';
  let validImagesCount = 0;
  let missingImagesCount = 0;

  for (const root of roots) {
    const isNew = root.id.startsWith('new_');
    const branches = Array.isArray(root.branches) ? root.branches : [];
    
    // Resolve image filename
    let relativeImagePath = '';
    let imageFilename = '';
    const seedUrl = seedMap.get(root.id) || poolMap.get(root.id) || '';

    if (seedUrl) {
      const cleanName = seedUrl.replace(/^\/?(public\/)?staged_images\/pool\//, '').replace(/^\.\/staged_images\/pool\//, '');
      if (poolFiles.has(cleanName)) {
        imageFilename = cleanName;
        relativeImagePath = `./staged_images/pool/${cleanName}`;
      }
    }

    if (!relativeImagePath) {
      for (const ext of ['.jpg', '.png', '.webp', '.jpeg']) {
        if (poolFiles.has(`${root.id}${ext}`)) {
          imageFilename = `${root.id}${ext}`;
          relativeImagePath = `./staged_images/pool/${root.id}${ext}`;
          break;
        }
      }
    }

    const hasImage = Boolean(relativeImagePath && imageFilename);
    let dimInfo = { width: 0, height: 0, format: 'missing' };
    let dimBadgeText = '⚠️ תמונה חסרה';

    if (hasImage) {
      validImagesCount++;
      const fullDiskPath = path.resolve(POOL_DIR, imageFilename);
      dimInfo = getImageDimensions(fullDiskPath);
      if (dimInfo.width > 0 && dimInfo.height > 0) {
        dimBadgeText = `${dimInfo.format} ${dimInfo.width}×${dimInfo.height}`;
      } else {
        dimBadgeText = 'תמונה מקומית';
      }
    } else {
      missingImagesCount++;
    }

    // Escape attributes and text (strictly sanitized)
    const safeId = escapeHtml(root.id);
    const safeTitle = escapeHtml(root.title || root.id);
    const safeCategory = escapeHtml(root.category || 'כללי');
    const safeBranchesText = branches.map(b => escapeHtml(String(b).trim())).join(' ');

    // Generate branch chips
    let branchChipsHtml = '';
    for (const b of branches) {
      const cleanBranch = escapeHtml(String(b).trim());
      branchChipsHtml += `<span class="branch-chip">${cleanBranch}</span>`;
    }

    // Image tag and fallback element
    let imageElementHtml = '';
    if (hasImage) {
      imageElementHtml = `
        <img 
          src="${relativeImagePath}" 
          alt="${safeTitle}" 
          loading="lazy" 
          onerror="this.style.display='none'; if(this.nextElementSibling) this.nextElementSibling.style.display='flex';"
        />
        <div class="fallback-placeholder" style="display: none;">
          <span class="fallback-icon">⚠️</span>
          <span class="fallback-text">תמונה חסרה (placeholder)</span>
        </div>`;
    } else {
      imageElementHtml = `
        <div class="fallback-placeholder" style="display: flex;">
          <span class="fallback-icon">⚠️</span>
          <span class="fallback-text">תמונה חסרה (placeholder)</span>
        </div>`;
    }

    cardsHtml += `
      <article class="root-card" 
        data-id="${safeId}" 
        data-title="${safeTitle}" 
        data-category="${safeCategory}" 
        data-branches="${safeBranchesText}" 
        data-is-new="${isNew ? 'true' : 'false'}" 
        data-has-image="${hasImage ? 'true' : 'false'}"
      >
        <div class="card-media">
          ${imageElementHtml}
          ${isNew ? '<span class="badge-new">✨ חדש (העשרה)</span>' : ''}
          <span class="badge-dim">${escapeHtml(dimBadgeText)}</span>
        </div>
        <div class="card-content">
          <div class="card-header">
            <h2 class="card-title">${safeTitle}</h2>
            <div class="card-id-row">
              <code class="card-id">${safeId}</code>
            </div>
          </div>
          <div class="card-category-badge">${safeCategory}</div>
          <div class="card-branches-section">
            <div class="branches-label">ענפי משימות (${branches.length}):</div>
            <div class="branches-wrapper">
              ${branchChipsHtml}
            </div>
          </div>
        </div>
      </article>`;
  }

  // Category select options
  let categoryOptionsHtml = '<option value="">כל הקטגוריות (הכל)</option>';
  for (const cat of sortedCategories) {
    categoryOptionsHtml += `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`;
  }

  const htmlDocument = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Quest — לוח עוגנים חזותיים (Contact Sheet)</title>
  <style>
    :root {
      --bg-body: #0b0f19;
      --bg-panel: rgba(15, 23, 42, 0.94);
      --bg-card: #151d2f;
      --bg-card-hover: #1c263c;
      --border-card: #222f46;
      --border-hover: #38bdf8;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --text-sub: #64748b;
      --chip-bg: #1e3a5f;
      --chip-text: #bae6fd;
      --chip-border: #0284c7;
      --accent-cyan: #38bdf8;
      --accent-emerald: #10b981;
      --accent-amber: #f59e0b;
      --accent-rose: #f43f5e;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-body);
      color: var(--text-main);
      font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      min-height: 100vh;
      direction: rtl;
      text-align: right;
    }

    header.top-bar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-panel);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-card);
      padding: 16px 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .top-bar-content {
      max-width: 1600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .header-main-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .brand-title-group h1 {
      font-size: 1.5rem;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-title-group p {
      font-size: 0.88rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    .stats-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .stat-pill {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 9999px;
      padding: 4px 14px;
      font-size: 0.84rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-pill strong {
      color: var(--accent-cyan);
    }

    .controls-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }

    .search-box-wrapper {
      flex: 1;
      min-width: 260px;
      position: relative;
    }

    .search-input {
      width: 100%;
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.92rem;
      color: #ffffff;
      outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .search-input:focus {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
    }

    .category-select {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 10px 14px;
      font-size: 0.92rem;
      color: #ffffff;
      outline: none;
      cursor: pointer;
      min-width: 200px;
    }

    .category-select:focus {
      border-color: var(--accent-cyan);
    }

    .filter-tabs {
      display: flex;
      gap: 6px;
      background: #0f172a;
      padding: 4px;
      border-radius: 8px;
      border: 1px solid #334155;
    }

    .filter-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      color: #ffffff;
    }

    .filter-btn.active {
      background: #0284c7;
      color: #ffffff;
    }

    .reset-btn {
      background: #334155;
      border: none;
      color: #f1f5f9;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
    }

    .reset-btn:hover {
      background: #475569;
    }

    main.grid-container {
      max-width: 1600px;
      margin: 0 auto;
      padding: 24px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    .root-card {
      background: var(--bg-card);
      border: 1px solid var(--border-card);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
      position: relative;
    }

    .root-card:hover {
      transform: translateY(-3px);
      border-color: var(--border-hover);
      box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.5);
    }

    .card-media {
      position: relative;
      width: 100%;
      height: 200px;
      background: #060911;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }

    .root-card:hover .card-media img {
      transform: scale(1.03);
    }

    .fallback-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: #1e293b;
      color: #f87171;
      padding: 16px;
      text-align: center;
    }

    .fallback-icon {
      font-size: 2rem;
    }

    .fallback-text {
      font-size: 0.85rem;
      font-weight: 600;
    }

    .badge-new {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #0284c7;
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
      z-index: 2;
    }

    .badge-dim {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(4px);
      color: #e2e8f0;
      font-size: 0.72rem;
      font-family: monospace;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      z-index: 2;
    }

    .card-content {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .card-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-main);
      line-height: 1.3;
    }

    .card-id-row {
      margin-top: 4px;
    }

    .card-id {
      font-size: 0.78rem;
      color: var(--text-sub);
      font-family: monospace;
      background: #0f172a;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #1e293b;
    }

    .card-category-badge {
      font-size: 0.82rem;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.08);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 6px;
      padding: 4px 8px;
      align-self: flex-start;
    }

    .card-branches-section {
      margin-top: auto;
      padding-top: 10px;
      border-top: 1px solid #1e293b;
    }

    .branches-label {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
    }

    .branches-wrapper {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .branch-chip {
      background: var(--chip-bg);
      color: var(--chip-text);
      border: 1px solid var(--chip-border);
      border-radius: 6px;
      padding: 3px 8px;
      font-size: 0.82rem;
      font-weight: 500;
    }

    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 60px 20px;
      color: var(--text-muted);
      font-size: 1.1rem;
      display: none;
    }
  </style>
</head>
<body>
  <header class="top-bar">
    <div class="top-bar-content">
      <div class="header-main-row">
        <div class="brand-title-group">
          <h1>🖼️ Life Quest — לוח עוגנים חזותיים</h1>
          <p>סקירה ובקרת איכות ויזואלית עבור כל ${totalRoots} השורשים הפעילים</p>
        </div>
        <div class="stats-pills">
          <div class="stat-pill">סה״כ שורשים: <strong>${totalRoots}</strong></div>
          <div class="stat-pill">שורשי העשרה: <strong>${enrichmentCount}</strong></div>
          <div class="stat-pill">תמונות מקומיות: <strong>${validImagesCount}</strong></div>
          <div class="stat-pill">מוצגים כעת: <strong id="visibleCount">${totalRoots}</strong></div>
        </div>
      </div>

      <div class="controls-row">
        <div class="search-box-wrapper">
          <input 
            type="search" 
            id="searchInput" 
            class="search-input" 
            placeholder="חיפוש לפי כותרת, מזהה שורש או ענף (למשל: כספומט, בנק, new_001)..." 
            autocomplete="off"
          >
        </div>
        <select id="categoryFilter" class="category-select">
          ${categoryOptionsHtml}
        </select>
        <div class="filter-tabs">
          <button type="button" class="filter-btn active" data-filter="all">הכל (${totalRoots})</button>
          <button type="button" class="filter-btn" data-filter="enrichment">150 החדשים בלבד</button>
          <button type="button" class="filter-btn" data-filter="missing">תמונות חסרות</button>
        </div>
        <button type="button" id="resetBtn" class="reset-btn">איפוס</button>
      </div>
    </div>
  </header>

  <main class="grid-container" id="cardsGrid">
    ${cardsHtml}
    <div id="noResults" class="no-results">לא נמצאו שורשים התואמים את החיפוש.</div>
  </main>

  <script>
    (function () {
      const searchInput = document.getElementById('searchInput');
      const categoryFilter = document.getElementById('categoryFilter');
      const filterBtns = document.querySelectorAll('.filter-btn');
      const resetBtn = document.getElementById('resetBtn');
      const cards = Array.from(document.querySelectorAll('.root-card'));
      const visibleCountEl = document.getElementById('visibleCount');
      const noResultsEl = document.getElementById('noResults');

      let currentTab = 'all';

      function updateFiltering() {
        const query = (searchInput && searchInput.value ? searchInput.value : '').trim().toLowerCase();
        const selectedCategory = (categoryFilter && categoryFilter.value ? categoryFilter.value : '');
        let matchCount = 0;

        for (let i = 0; i < cards.length; i++) {
          const card = cards[i];
          const title = card.getAttribute('data-title') || '';
          const id = card.getAttribute('data-id') || '';
          const category = card.getAttribute('data-category') || '';
          const branches = card.getAttribute('data-branches') || '';
          const isNew = card.getAttribute('data-is-new') === 'true';
          const hasImage = card.getAttribute('data-has-image') === 'true';

          let matchesSearch = true;
          if (query.length > 0) {
            matchesSearch = (
              title.toLowerCase().indexOf(query) !== -1 ||
              id.toLowerCase().indexOf(query) !== -1 ||
              branches.toLowerCase().indexOf(query) !== -1
            );
          }

          let matchesCategory = true;
          if (selectedCategory.length > 0) {
            matchesCategory = (category === selectedCategory);
          }

          let matchesTab = true;
          if (currentTab === 'enrichment') {
            matchesTab = isNew;
          } else if (currentTab === 'missing') {
            matchesTab = !hasImage;
          }

          if (matchesSearch && matchesCategory && matchesTab) {
            card.style.display = '';
            matchCount++;
          } else {
            card.style.display = 'none';
          }
        }

        if (visibleCountEl) {
          visibleCountEl.textContent = String(matchCount);
        }

        if (noResultsEl) {
          noResultsEl.style.display = (matchCount === 0) ? 'block' : 'none';
        }
      }

      if (searchInput) {
        searchInput.addEventListener('input', updateFiltering);
      }

      if (categoryFilter) {
        categoryFilter.addEventListener('change', updateFiltering);
      }

      for (let j = 0; j < filterBtns.length; j++) {
        const btn = filterBtns[j];
        btn.addEventListener('click', function () {
          for (let k = 0; k < filterBtns.length; k++) {
            filterBtns[k].classList.remove('active');
          }
          this.classList.add('active');
          currentTab = this.getAttribute('data-filter') || 'all';
          updateFiltering();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          if (searchInput) searchInput.value = '';
          if (categoryFilter) categoryFilter.value = '';
          currentTab = 'all';
          for (let m = 0; m < filterBtns.length; m++) {
            filterBtns[m].classList.remove('active');
            if (filterBtns[m].getAttribute('data-filter') === 'all') {
              filterBtns[m].classList.add('active');
            }
          }
          updateFiltering();
        });
      }
    })();
  </script>
</body>
</html>`;

  // Anti-leak assertion before writing
  if (htmlDocument.includes('undefined') || htmlDocument.includes('null') || htmlDocument.includes('[object Object]')) {
    throw new Error('Leak detected in generated contact sheet HTML');
  }

  fs.writeFileSync(OUTPUT_PATH, htmlDocument, 'utf8');
  console.log(`Successfully generated ${OUTPUT_PATH} with ${roots.length} cards.`);
}

// CLI Execution Entry Point
if (process.argv[1] && process.argv[1].endsWith('generate_contact_sheet.mjs')) {
  generateContactSheet();
}
