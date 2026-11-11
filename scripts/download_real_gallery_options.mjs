import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/staged_images/options');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const ITEMS = [
  { id: 'batman', query: 'Batman DC Comics' },
  { id: 'superman', query: 'Superman DC' }, // Already done, but good to have
  { id: 'spiderman', query: 'Spider-Man Marvel' },
  { id: 'super_mario', query: 'Super Mario Nintendo' },
  { id: 'pikachu', query: 'Pikachu Pokemon' },
  { id: 'homer_simpson', query: 'Homer Simpson' },
  { id: 'shrek', query: 'Shrek DreamWorks' },
  { id: 'yoda', query: 'Yoda Star Wars' },
  { id: 'the_joker', query: 'Joker Batman DC' },
  { id: 'sherlock_holmes', query: 'Sherlock Holmes' },
  { id: 'gandalf', query: 'Gandalf Lord of the Rings' },
  { id: 'gollum', query: 'Gollum Lord of the Rings' },
  { id: 'frankenstein_monster', query: 'Frankenstein monster Boris Karloff' },
  { id: 'michael_jordan', query: 'Michael Jordan Chicago Bulls' },
  { id: 'bill_gates', query: 'Bill Gates portrait' },
  { id: 'charlie_chaplin', query: 'Charlie Chaplin' },
  { id: 'cleopatra', query: 'Cleopatra Queen of Egypt painting' },
  { id: 'freddie_mercury', query: 'Freddie Mercury Queen' },
  { id: 'usain_bolt', query: 'Usain Bolt' },
  { id: 'winston_churchill', query: 'Winston Churchill portrait' },
  { id: 'statue_of_liberty', query: 'Statue of Liberty New York' },
  { id: 'the_scream', query: 'The Scream Edvard Munch' },
  { id: 'titanic', query: 'RMS Titanic ship' },
  { id: 'colosseum', query: 'Colosseum Rome' },
  { id: 'taj_mahal', query: 'Taj Mahal' },
  { id: 'compass', query: 'Antique brass nautical compass' },
  { id: 'treasure_chest', query: 'Pirate treasure chest gold' },
  { id: 'trojan_horse', query: 'Trojan horse sculpture Troy' },
  { id: 'shield', query: 'Medieval knight shield' },
  { id: 'newtons_cradle', query: "Newton's cradle steel balls" }
];

async function fetchGalleryImages(query) {
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
    console.warn(`Error searching gallery for "${query}":`, err.message);
    return [];
  }
}

async function tryDownloadUrl(url, dest) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) return false;
    fs.writeFileSync(dest, buf);
    return buf.length;
  } catch {
    return false;
  }
}

async function run() {
  console.log(`Starting real gallery download for ${ITEMS.length} items...`);

  for (let i = 0; i < ITEMS.length; i++) {
    const item = ITEMS[i];
    console.log(`\n[${i + 1}/${ITEMS.length}] Downloading gallery images for ${item.id} ("${item.query}")...`);

    // For superman, options 1, 2, 3 were just curated perfectly! Skip unless opt1 is missing
    if (item.id === 'superman') {
      console.log(`✓ superman already updated with iconic gallery images!`);
      continue;
    }

    const results = await fetchGalleryImages(item.query);
    if (!results.length) {
      console.warn(`! No results for ${item.query}`);
      continue;
    }

    let savedCount = 0;
    // Iterate through top gallery results and get 3 distinct successful downloads
    for (let rIdx = 0; rIdx < results.length && savedCount < 3; rIdx++) {
      const r = results[rIdx];
      const optIdx = savedCount + 1;
      const dest = path.join(targetDir, `${item.id}_opt${optIdx}.jpg`);

      // Try original image first, fallback to high-speed thumbnail
      const candidates = [r.image, r.thumbnail].filter(Boolean);
      let downloaded = false;

      for (const url of candidates) {
        const size = await tryDownloadUrl(url, dest);
        if (size) {
          console.log(`  ✓ Saved option ${optIdx} (${size} B) from: ${r.title?.slice(0, 50)}`);
          savedCount++;
          downloaded = true;
          break;
        }
      }
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\nAll gallery downloads completed successfully!');
}

run();
