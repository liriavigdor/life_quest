import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/staged_images/archetypes');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const USER_AGENT = 'LifeQuestArchetypes/1.0 (https://lifequest.local; archetypes@lifequest.local)';

// 40 Undeniable, Culturally Resonant Visual Archetypes
export const ARCHETYPE_ITEMS = [
  { id: 'arch_swiss_army_knife', nameEn: 'Swiss Army knife', wiki: 'Swiss Army knife', hint: 'סכין שוויצרית רב-תכליתית' },
  { id: 'arch_hourglass', nameEn: 'Hourglass', wiki: 'Hourglass', hint: 'שעון חול עתיק' },
  { id: 'arch_pocket_watch', nameEn: 'Pocket watch', wiki: 'Pocket watch', hint: 'שעון כיס עם שרשרת' },
  { id: 'arch_compass', nameEn: 'Compass', wiki: 'Compass (navigation)', hint: 'מצפן ניווט ממתכת' },
  { id: 'arch_magnifying_glass', nameEn: 'Magnifying glass', wiki: 'Magnifying glass', hint: 'זכוכית מגדלת עגולה' },
  { id: 'arch_gramophone', nameEn: 'Gramophone', wiki: 'Phonograph', hint: 'גרמופון עם שופר פליז' },
  { id: 'arch_typewriter', nameEn: 'Typewriter', wiki: 'Typewriter', hint: 'מכונת כתיבה מכנית' },
  { id: 'arch_rotary_phone', nameEn: 'Rotary phone', wiki: 'Rotary dial', hint: 'טלפון חוגה קלאסי' },
  { id: 'arch_safety_pin', nameEn: 'Safety pin', wiki: 'Safety pin', hint: 'סיכת ביטחון' },
  { id: 'arch_zippo', nameEn: 'Zippo lighter', wiki: 'Zippo', hint: 'מצית זיפו ממתכת' },
  { id: 'arch_padlock', nameEn: 'Padlock', wiki: 'Padlock', hint: 'מנעול תלייה מברזל' },
  { id: 'arch_anvil', nameEn: 'Anvil', wiki: 'Anvil', hint: 'סדן נפחים כבד' },
  { id: 'arch_claw_hammer', nameEn: 'Claw hammer', wiki: 'Claw hammer', hint: 'פטיש טפסרים' },
  { id: 'arch_sledgehammer', nameEn: 'Sledgehammer', wiki: 'Sledgehammer', hint: 'פטיש 5 קילו / קורנס' },
  { id: 'arch_handsaw', nameEn: 'Handsaw', wiki: 'Hand saw', hint: 'מסור יד לנגרות' },
  { id: 'arch_pipe_wrench', nameEn: 'Pipe wrench', wiki: 'Pipe wrench', hint: 'מפתח צינורות שוודי' },
  { id: 'arch_blowtorch', nameEn: 'Blowtorch', wiki: 'Blowtorch', hint: 'מבער גז / ברנר' },
  { id: 'arch_stethoscope', nameEn: 'Stethoscope', wiki: 'Stethoscope', hint: 'סטטוסקופ רפואי' },
  { id: 'arch_syringe', nameEn: 'Syringe', wiki: 'Syringe', hint: 'מזרק רפואי' },
  { id: 'arch_tuning_fork', nameEn: 'Tuning fork', wiki: 'Tuning fork', hint: 'קולן מתכת' },
  { id: 'arch_metronome', nameEn: 'Metronome', wiki: 'Metronome', hint: 'מטרונום מכני' },
  { id: 'arch_prism', nameEn: 'Prism', wiki: 'Prism', hint: 'מנסרה אופטית שוברת אור' },
  { id: 'arch_newtons_cradle', nameEn: 'Newton\'s cradle', wiki: 'Newton\'s cradle', hint: 'מטוטלת כדורי ניוטון' },
  { id: 'arch_megaphone', nameEn: 'Megaphone', wiki: 'Megaphone', hint: 'מגפון כריזה ידני' },
  { id: 'arch_film_reel', nameEn: 'Film reel', wiki: 'Film reel', hint: 'גלגל סרט קולנוע' },
  { id: 'arch_cassette_tape', nameEn: 'Cassette tape', wiki: 'Cassette tape', hint: 'קלטת שמע קומפקטית' },
  { id: 'arch_binoculars', nameEn: 'Binoculars', wiki: 'Binoculars', hint: 'משקפת שדה שחורה' },
  { id: 'arch_spyglass', nameEn: 'Spyglass', wiki: 'Monocular', hint: 'טלסקופ ימי נשלף' },
  { id: 'arch_corkscrew', nameEn: 'Corkscrew', wiki: 'Corkscrew', hint: 'פותחן בקבוקי יין' },
  { id: 'arch_mortar_pestle', nameEn: 'Mortar and pestle', wiki: 'Mortar and pestle', hint: 'מכתש ועלי מאבן' },
  { id: 'arch_chef_knife', nameEn: 'Chef\'s knife', wiki: 'Chef\'s knife', hint: 'סכין שף גדולה' },
  { id: 'arch_cast_iron_skillet', nameEn: 'Cast iron skillet', wiki: 'Cast-iron cookware', hint: 'מחבת ברזל יצוקה' },
  { id: 'arch_tetsubin_teapot', nameEn: 'Teapot', wiki: 'Teapot', hint: 'קומקום תה מברזל' },
  { id: 'arch_lifebuoy', nameEn: 'Lifebuoy', wiki: 'Lifebuoy', hint: 'גלגל הצלה ימי' },
  { id: 'arch_anchor', nameEn: 'Anchor', wiki: 'Anchor', hint: 'עוגן ספינה כבד' },
  { id: 'arch_traffic_cone', nameEn: 'Traffic cone', wiki: 'Traffic cone', hint: 'קונוס תנועה כתום' },
  { id: 'arch_fire_extinguisher', nameEn: 'Fire extinguisher', wiki: 'Fire extinguisher', hint: 'מטפה כיבוי אש אדום' },
  { id: 'arch_handcuffs', nameEn: 'Handcuffs', wiki: 'Handcuffs', hint: 'אזיקי פלדה למעצר' },
  { id: 'arch_gas_mask', nameEn: 'Gas mask', wiki: 'Gas mask', hint: 'מסכת אב"כ צבאית' },
  { id: 'arch_welding_mask', nameEn: 'Welding helmet', wiki: 'Welding helmet', hint: 'מסכת ריתוך מגינה' }
];

async function fetchWikiImage(wikiTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&pithumbsize=900&redirects=1&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    const src = page?.thumbnail?.source;
    if (src && !src.toLowerCase().includes('.svg')) {
      const imgRes = await fetch(src, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(12000)
      });
      if (imgRes.ok) {
        return {
          buffer: Buffer.from(await imgRes.arrayBuffer()),
          pageTitle: page.title,
          url: src
        };
      }
    }
  } catch (_) {}
  return null;
}

async function fetchCommonsFallback(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=900&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      const dlUrl = info?.thumburl || info?.url;
      const mime = (info?.mime || '').toLowerCase();
      if (dlUrl && (mime.includes('jpeg') || mime.includes('png') || mime.includes('webp'))) {
        const imgRes = await fetch(dlUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (imgRes.ok) {
          return {
            buffer: Buffer.from(await imgRes.arrayBuffer()),
            pageTitle: p.title,
            url: dlUrl
          };
        }
      }
    }
  } catch (_) {}
  return null;
}

export async function downloadAllArchetypes() {
  console.log(`=== DOWNLOADING 40 HIGH-IMPACT CULTURAL ARCHETYPES ===`);
  const results = [];

  for (let i = 0; i < ARCHETYPE_ITEMS.length; i++) {
    const item = ARCHETYPE_ITEMS[i];
    process.stdout.write(`[${i+1}/${ARCHETYPE_ITEMS.length}] "${item.nameEn}" (${item.hint})... `);

    let res = await fetchWikiImage(item.wiki);
    if (!res) {
      res = await fetchCommonsFallback(`${item.nameEn} isolated`);
    }
    if (!res) {
      res = await fetchCommonsFallback(item.nameEn);
    }

    if (res && res.buffer.length >= 5000) {
      const filename = `${item.id}.jpg`;
      const filepath = path.join(TARGET_DIR, filename);
      fs.writeFileSync(filepath, res.buffer);
      console.log(`OK! (${(res.buffer.length/1024).toFixed(1)} KB, from "${res.pageTitle}")`);
      results.push({
        ...item,
        imageUrl: `/staged_images/archetypes/${filename}`,
        fileSizeKb: (res.buffer.length/1024).toFixed(1)
      });
    } else {
      console.log(`FAILED!`);
    }

    await new Promise(r => setTimeout(r, 120));
  }

  // Generate Review Desk HTML
  generateReviewDeskHtml(results);
  return results;
}

function generateReviewDeskHtml(items) {
  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>שולחן תיוק ארכיטיפים - שלב 2 (הגדרת שורשים)</title>
  <style>
    :root {
      --bg: #090d16;
      --card-bg: #111827;
      --border: #1f2937;
      --primary: #3b82f6;
      --success: #10b981;
      --danger: #ef4444;
      --text: #f3f4f6;
      --muted: #9ca3af;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: var(--bg);
      color: var(--text);
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 24px;
      line-height: 1.5;
    }
    .header {
      max-width: 1400px;
      margin: 0 auto 24px;
      background: #1e293b;
      padding: 20px 28px;
      border-radius: 14px;
      border: 1px solid #334155;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }
    .title h1 { font-size: 22px; font-weight: 800; color: #60a5fa; }
    .title p { font-size: 14px; color: var(--muted); margin-top: 4px; }
    .stats {
      display: flex;
      gap: 12px;
      font-weight: 700;
    }
    .badge {
      padding: 6px 14px;
      border-radius: 999px;
      font-size: 13px;
      background: #0f172a;
      border: 1px solid #334155;
    }
    .badge-approved { background: rgba(16, 185, 129, 0.2); color: #34d399; border-color: #059669; }
    .badge-rejected { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: #dc2626; }
    .badge-pending { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border-color: #2563eb; }
    
    .actions {
      display: flex;
      gap: 10px;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-export { background: var(--success); color: #fff; }
    .btn-export:hover { filter: brightness(1.1); transform: translateY(-1px); }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, border-color 0.2s;
    }
    .card:hover { border-color: #3b82f6; }
    .card.approved { border-color: #10b981; box-shadow: 0 0 16px rgba(16, 185, 129, 0.2); }
    .card.rejected { border-color: #ef4444; opacity: 0.35; filter: grayscale(80%); }

    .img-wrap {
      width: 100%;
      height: 240px;
      background: #000;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #0b0f19;
    }
    .img-tag {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.75);
      backdrop-filter: blur(4px);
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      color: #93c5fd;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      flex: 1;
    }
    .concept-en {
      font-size: 13px;
      color: var(--muted);
      font-weight: 600;
    }
    .root-input-wrap {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .root-input-wrap label {
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
    }
    .root-input {
      background: #0f172a;
      border: 1px solid #334155;
      padding: 10px 12px;
      border-radius: 8px;
      color: #fff;
      font-size: 15px;
      font-weight: 700;
      outline: none;
      transition: border-color 0.2s;
    }
    .root-input:focus { border-color: var(--primary); }
    
    .card-btns {
      display: flex;
      gap: 8px;
      margin-top: auto;
    }
    .btn-approve {
      flex: 2;
      background: #065f46;
      color: #6ee7b7;
      border: 1px solid #059669;
      padding: 9px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-approve:hover { background: #047857; color: #fff; }
    .btn-reject {
      flex: 1;
      background: #450a0a;
      color: #fca5a5;
      border: 1px solid #991b1b;
      padding: 9px;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
    }
    .btn-reject:hover { background: #7f1d1d; color: #fff; }
  </style>
</head>
<body>

  <div class="header">
    <div class="title">
      <h1>⚡ שולחן תיוק ארכיטיפים (שלב 2: הגדרת שורשים)</h1>
      <p>התמונות נבחרו בקפידה לפי ארכיטיפ תרבותי מובהק. הגדר לכל תמונה את השורש המדויק שהיא מעוררת בך, ואז שלח אליי ליצירת ענפים עשירים!</p>
    </div>
    <div class="stats">
      <span class="badge badge-pending" id="stat-total">סה"כ: ${items.length}</span>
      <span class="badge badge-approved" id="stat-approved">אושרו: 0</span>
      <span class="badge badge-rejected" id="stat-rejected">נפסלו: 0</span>
    </div>
    <div class="actions">
      <button class="btn btn-export" onclick="exportApproved()">💾 סיים והעתק שורשים לשלב 3</button>
    </div>
  </div>

  <div class="grid" id="grid">
    ${items.map((item, idx) => `
      <div class="card" id="card-${item.id}" data-id="${item.id}">
        <div class="img-wrap">
          <img src="${item.imageUrl}" alt="${item.nameEn}" loading="lazy" />
          <span class="img-tag">#${idx+1}</span>
        </div>
        <div class="card-body">
          <div class="concept-en">🏛️ ${item.nameEn} • ${item.fileSizeKb} KB</div>
          <div class="root-input-wrap">
            <label for="input-${item.id}">הגדר שורש בעברית:</label>
            <input 
              type="text" 
              id="input-${item.id}" 
              class="root-input" 
              value="${item.hint}" 
              placeholder="הקלד שורש אסוציאטיבי..." 
              onkeydown="handleKey(event, '${item.id}')"
            />
          </div>
          <div class="card-btns">
            <button class="btn-approve" onclick="approveItem('${item.id}')">✅ אשר שורש (Enter)</button>
            <button class="btn-reject" onclick="rejectItem('${item.id}')">❌ פסול</button>
          </div>
        </div>
      </div>
    `).join('\n')}
  </div>

  <script>
    const state = {
      approved: {},
      rejected: {}
    };

    function updateStats() {
      document.getElementById('stat-approved').textContent = 'אושרו: ' + Object.keys(state.approved).length;
      document.getElementById('stat-rejected').textContent = 'נפסלו: ' + Object.keys(state.rejected).length;
    }

    function approveItem(id) {
      const input = document.getElementById('input-' + id);
      const val = input.value.trim();
      if (!val) {
        alert('אנא הקלד שורש בעברית לפני האישור');
        input.focus();
        return;
      }
      delete state.rejected[id];
      state.approved[id] = val;
      const card = document.getElementById('card-' + id);
      card.classList.remove('rejected');
      card.classList.add('approved');
      updateStats();
    }

    function rejectItem(id) {
      delete state.approved[id];
      state.rejected[id] = true;
      const card = document.getElementById('card-' + id);
      card.classList.remove('approved');
      card.classList.add('rejected');
      updateStats();
    }

    function handleKey(e, id) {
      if (e.key === 'Enter') {
        e.preventDefault();
        approveItem(id);
      }
    }

    function exportApproved() {
      const approvedList = Object.entries(state.approved).map(([id, rootTitle]) => ({
        id,
        rootTitle,
        imageUrl: document.querySelector('#card-' + id + ' img').src
      }));

      if (approvedList.length === 0) {
        alert('טרם אישרת פריטים! אשר לפחות פריט אחד.');
        return;
      }

      const json = JSON.stringify(approvedList, null, 2);
      navigator.clipboard.writeText(json).then(() => {
        alert('מעולה! הועתקו ללוח ' + approvedList.length + ' שורשים מאושרים.\\nכעת הדבק בצ\'אט כדי שאיצור עבורם מיד את הענפים!');
      });
      console.log('Approved Archetypes:', approvedList);
    }
  </script>
</body>
</html>`;

  fs.writeFileSync(path.resolve('public/archetype_review_desk.html'), html, 'utf8');
  console.log(`\nGenerated Desk: ${path.resolve('public/archetype_review_desk.html')}`);
}

if (process.argv[1] && process.argv[1].endsWith('download_archetype_batch.mjs')) {
  downloadAllArchetypes().catch(console.error);
}

