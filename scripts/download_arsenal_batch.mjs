import fs from 'fs';
import path from 'path';

const poolDir = './public/staged_images/pool';
if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

const arsenal = JSON.parse(fs.readFileSync('./public/data/masterMnemonicArsenal1000.json', 'utf8'));
console.log(`Master arsenal loaded: ${arsenal.length} items.`);

const progressFile = './scripts/download_progress.json';
let progress = {};
if (fs.existsSync(progressFile)) {
  try {
    progress = JSON.parse(fs.readFileSync(progressFile, 'utf8'));
  } catch (_) {}
}

async function fetchGalleryCandidates(query) {
  try {
    const tokenRes = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(6000)
    });
    const text = await tokenRes.text();
    const vqdMatch = text.match(/vqd=([0-9-]+)/);
    if (!vqdMatch) return [];

    const imgRes = await fetch(
      'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + vqdMatch[1],
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(6000)
      }
    );
    if (!imgRes.ok) return [];
    const data = await imgRes.json();
    return data.results || [];
  } catch (err) {
    return [];
  }
}

async function tryDownloadUrl(url, dest) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) return false;
    // Check if AVIF, skip if so
    if (buf.length > 12 && buf.toString('ascii', 4, 12).includes('ftypavif')) {
      return false;
    }
    fs.writeFileSync(dest, buf);
    return buf.length;
  } catch {
    return false;
  }
}

async function processItem(item, idx, total) {
  const destPath = path.join(poolDir, `${item.id}.jpg`);
  
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
    progress[item.id] = { status: 'cached', size: fs.statSync(destPath).size };
    return true;
  }

  const results = await fetchGalleryCandidates(item.search_query);
  if (!results || results.length === 0) {
    console.log(`[${idx}/${total}] ⚠️ No results for: ${item.id} (${item.search_query})`);
    progress[item.id] = { status: 'no_results' };
    return false;
  }

  // Try top candidates: original image or Bing thumbnail fallback
  for (let i = 0; i < Math.min(5, results.length); i++) {
    const cand = results[i];
    if (cand.image) {
      const ok = await tryDownloadUrl(cand.image, destPath);
      if (ok) {
        progress[item.id] = { status: 'downloaded', size: ok, url: cand.image };
        console.log(`[${idx}/${total}] ✓ ${item.id} (${item.name_he}) -> ${(ok / 1024).toFixed(1)} KB`);
        return true;
      }
    }
    if (cand.thumbnail) {
      const ok = await tryDownloadUrl(cand.thumbnail, destPath);
      if (ok) {
        progress[item.id] = { status: 'downloaded_thumb', size: ok, url: cand.thumbnail };
        console.log(`[${idx}/${total}] ✓ ${item.id} (thumb) (${item.name_he}) -> ${(ok / 1024).toFixed(1)} KB`);
        return true;
      }
    }
  }

  console.log(`[${idx}/${total}] ❌ Failed to download: ${item.id}`);
  progress[item.id] = { status: 'failed' };
  return false;
}

// Concurrency pool runner
async function runConcurrent(items, concurrency = 4) {
  console.log(`Starting concurrent download with ${concurrency} workers across ${items.length} items...`);
  let index = 0;
  let completed = 0;
  let successful = 0;

  async function worker() {
    while (index < items.length) {
      const currentIdx = index++;
      const item = items[currentIdx];
      const ok = await processItem(item, currentIdx + 1, items.length);
      if (ok) successful++;
      completed++;

      if (completed % 10 === 0 || completed === items.length) {
        fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2), 'utf8');
        const percent = Math.round((completed / items.length) * 100);
        console.log(`>>> PROGRESS: ${completed}/${items.length} processed (${percent}%) | Successful: ${successful}`);
      }

      // Small jitter delay
      await new Promise(r => setTimeout(r, 150));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  fs.writeFileSync(progressFile, JSON.stringify(progress, null, 2), 'utf8');
  console.log(`\n===========================================`);
  console.log(`ALL DONE! Completed: ${completed}/${items.length}, Successful: ${successful}`);
  console.log(`===========================================\n`);
}

runConcurrent(arsenal, 4);
