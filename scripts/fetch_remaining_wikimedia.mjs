import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const MANIFEST_PATH = path.resolve('public/data/authentic_replacements_manifest.json');

const REMAINING_ITEMS = [
  { id: 'michael_jordan', title: 'מייקל ג\'ורדן', query: 'Michael Jordan basketball Bulls' },
  { id: 'spiderman', title: 'ספיידרמן', query: 'Spider-Man costume cosplay' },
  { id: 'super_mario', title: 'סופר מריו', query: 'Super Mario statue Nintendo' },
  { id: 'treasure_chest', title: 'תיבת אוצר', query: 'treasure chest wooden coins' },
  { id: 'barbie_doll', title: 'ברבי', query: 'Barbie doll display' },
  { id: 'dracula', title: 'דרקולה', query: 'Bela Lugosi Dracula vampire' },
  { id: 'pinocchio', title: 'פינוקיו', query: 'Pinocchio wooden puppet' },
  { id: 'peter_pan', title: 'פיטר פן', query: 'Peter Pan statue Kensington' },
  { id: 'scooby_doo', title: 'סקובי דו', query: 'Scooby-Doo Great Dane costume' },
  { id: 'captain_america', title: 'קפטן אמריקה', query: 'Captain America shield cosplay' },
  { id: 'bilbo_baggins', title: 'בילבו בגינס', query: 'Hobbiton Shire house Bilbo' },
  { id: 'the_white_house', title: 'הבית הלבן', query: 'White House South Lawn Washington' },
  { id: 'coastal_lighthouse', title: 'מגדלור', query: 'coastal lighthouse ocean waves' },
  { id: 'classic_red_barn', title: 'אסם אמריקאי קלאסי', query: 'classic red barn farm' },
  { id: 'item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת', title: 'פצצה שחורה עם פתיל בוער', query: 'iron cannonball explosive bomb' },
  { id: 'item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל', title: 'מד חום כספית', query: 'mercury glass thermometer medical' },
  { id: 'item_172_מנעול_סגור__ומפתח_בצד___מסמל', title: 'מנעול סגור ומפתח', query: 'brass padlock key antique' },
  { id: 'item_183_עלה_תלתן_בעל_ארבעה_עלים__מסמל', title: 'תלתן ארבעה עלים', query: 'four-leaf clover real macro' },
  { id: 'item_193_סרט_מודעות_ארוך_קשור_בלולאה__ורוד_צהוב___מסמל', title: 'סרט מודעות', query: 'pink ribbon awareness symbol' }
];

async function getWikimediaImages(query) {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&origin=*`;
    const sRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'LifeQuestEducational/2.0' }
    });
    if (!sRes.ok) return [];
    const sData = await sRes.json();
    const hits = (sData.query?.search || [])
      .filter(h => !h.title.endsWith('.svg') && !h.title.endsWith('.pdf') && !h.title.endsWith('.webm') && !h.title.endsWith('.tif'))
      .slice(0, 4);

    if (hits.length === 0) return [];

    const urls = [];
    for (const hit of hits) {
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(hit.title)}&prop=imageinfo&iiprop=url&iiurlwidth=1000&format=json&origin=*`;
      const iRes = await fetch(infoUrl, {
        headers: { 'User-Agent': 'LifeQuestEducational/2.0' }
      });
      if (iRes.ok) {
        const iData = await iRes.json();
        const pages = Object.values(iData.query?.pages || {});
        const imgInfo = pages[0]?.imageinfo?.[0];
        const directUrl = imgInfo?.thumburl || imgInfo?.url;
        if (directUrl) urls.push(directUrl);
      }
    }
    return urls;
  } catch (err) {
    console.warn(`Wikimedia query error for "${query}":`, err.message);
    return [];
  }
}

async function downloadAndSaveImage(imageUrl, destPath) {
  try {
    const res = await fetch(imageUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 15000) return false;
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log(`🚀 Acquiring remaining ${REMAINING_ITEMS.length} authentic photos via Wikimedia Commons API...`);
  
  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (_) {}
  }

  let successCount = 0;

  for (const item of REMAINING_ITEMS) {
    console.log(`\n🔍 Searching: [${item.id}] "${item.title}" with query "${item.query}"...`);
    const urls = await getWikimediaImages(item.query);
    console.log(`  Found ${urls.length} candidate URLs.`);

    const destFileName = `authentic_${item.id}.jpg`;
    const destPath = path.join(POOL_DIR, destFileName);
    const localUrl = `/staged_images/pool/${destFileName}`;

    let downloaded = false;
    for (const u of urls) {
      console.log(`  Attempting download: ${u.slice(0, 75)}...`);
      downloaded = await downloadAndSaveImage(u, destPath);
      if (downloaded) {
        console.log(`  ✅ Successfully saved to ${destFileName} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
        manifest[item.id] = {
          id: item.id,
          title: item.title,
          newImageUrl: localUrl,
          destFileName
        };
        successCount++;
        break;
      }
    }

    if (!downloaded) {
      console.warn(`  ❌ Failed for ${item.id}`);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n🎉 Total authentic replacements saved in manifest: ${Object.keys(manifest).length}`);
}

run().catch(console.error);

