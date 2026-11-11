import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const MANIFEST_PATH = path.resolve('public/data/authentic_replacements_manifest.json');

const USER_AGENT = 'LifeQuestMnemonicCurator/1.0 (educational research; contact: dev@lifequest.local)';

const TARGETS = [
  { id: 'the_white_house', title: 'הבית הלבן', terms: ['White House Washington', 'White House South Lawn'] },
  { id: 'coastal_lighthouse', title: 'מגדלור', terms: ['coastal lighthouse', 'lighthouse sea waves', 'Split Point Lighthouse'] },
  { id: 'classic_red_barn', title: 'אסם אמריקאי קלאסי', terms: ['red barn Vermont', 'red wooden barn farm', 'American red barn'] },
  { id: 'barbie_doll', title: 'ברבי', terms: ['Barbie doll', 'Barbie fashion doll vintage'] },
  { id: 'dracula', title: 'דרקולה', terms: ['Bela Lugosi Dracula', 'Dracula vampire film still', 'Bela Lugosi 1931'] },
  { id: 'pinocchio', title: 'פינוקיו', terms: ['Pinocchio puppet wooden', 'Pinocchio marionette', 'Pinocchio statue'] },
  { id: 'peter_pan', title: 'פיטר פן', terms: ['Peter Pan statue', 'Peter Pan theater play', 'Peter Pan Kensington'] },
  { id: 'scooby_doo', title: 'סקובי דו', terms: ['Scooby Doo statue', 'Mystery Machine van', 'Scooby Doo cosplay'] },
  { id: 'captain_america', title: 'קפטן אמריקה', terms: ['Captain America cosplay', 'Captain America shield Marvel', 'Captain America statue'] },
  { id: 'bilbo_baggins', title: 'בילבו בגינס', terms: ['Hobbiton hole Shire', 'Hobbit Bag End', 'Hobbit Shire house'] },
  { id: 'super_mario', title: 'סופר מריו', terms: ['Super Mario statue Nintendo', 'Super Mario figure display', 'Super Mario cosplay'] },
  { id: 'treasure_chest', title: 'תיבת אוצר', terms: ['treasure chest wooden', 'antique wooden chest coins', 'pirate chest'] },
  { id: 'item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת', title: 'פצצה שחורה עם פתיל בוער', terms: ['cannonball iron', 'mortar bomb antique iron', 'cannon ball naval'] },
  { id: 'item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל', title: 'מד חום כספית', terms: ['mercury clinical thermometer', 'medical glass thermometer', 'mercury thermometer'] },
  { id: 'item_172_מנעול_סגור__ומפתח_בצד___מסמל', title: 'מנעול סגור ומפתח', terms: ['brass padlock key', 'antique padlock with key', 'padlock key lock'] },
  { id: 'item_183_עלה_תלתן_בעל_ארבעה_עלים__מסמל', title: 'תלתן ארבעה עלים', terms: ['four-leaf clover nature', 'four leaf clover green macro', 'Trifolium repens four-leaf'] },
  { id: 'item_193_סרט_מודעות_ארוך_קשור_בלולאה__ורוד_צהוב___מסמל', title: 'סרט מודעות', terms: ['pink ribbon awareness', 'yellow ribbon awareness', 'awareness ribbon loop'] }
];

async function searchWikimediaFile(term) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(term)}&srnamespace=6&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    const hits = (data.query?.search || [])
      .map(h => h.title)
      .filter(t => !t.endsWith('.svg') && !t.endsWith('.pdf') && !t.endsWith('.webm') && !t.endsWith('.tif') && !t.endsWith('.ogg'));
    return hits;
  } catch (err) {
    console.warn(`Search error for ${term}:`, err.message);
    return [];
  }
}

async function getDirectImageUrl(fileTitle) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const info = pages[0]?.imageinfo?.[0];
    return info?.thumburl || info?.url || null;
  } catch {
    return null;
  }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 15000) return false;
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  console.log('🚀 Fetching authentic photography via Wikimedia API with verified User-Agent...');
  fs.mkdirSync(POOL_DIR, { recursive: true });

  let manifest = {};
  if (fs.existsSync(MANIFEST_PATH)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    } catch (_) {}
  }

  for (const target of TARGETS) {
    console.log(`\n🔍 Item: [${target.id}] "${target.title}"`);
    let foundUrl = null;

    for (const term of target.terms) {
      console.log(`  Searching term: "${term}"...`);
      const fileTitles = await searchWikimediaFile(term);
      console.log(`  Found ${fileTitles.length} matching files.`);
      
      for (const title of fileTitles.slice(0, 3)) {
        const directUrl = await getDirectImageUrl(title);
        if (directUrl) {
          console.log(`    Trying direct URL: ${directUrl.slice(0, 70)}...`);
          const destFileName = `authentic_${target.id}.jpg`;
          const destPath = path.join(POOL_DIR, destFileName);
          const ok = await downloadImage(directUrl, destPath);
          if (ok) {
            console.log(`    ✅ Successfully downloaded authentic photo! (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
            manifest[target.id] = {
              id: target.id,
              title: target.title,
              newImageUrl: `/staged_images/pool/${destFileName}`,
              destFileName
            };
            foundUrl = directUrl;
            break;
          }
        }
      }
      if (foundUrl) break;
      await new Promise(r => setTimeout(r, 600));
    }

    if (!foundUrl) {
      console.warn(`  ❌ No authentic image acquired for ${target.id}`);
    }

    await new Promise(r => setTimeout(r, 800));
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\n🎉 Final Manifest Updated: ${Object.keys(manifest).length} items now have authentic photography.`);
}

main().catch(console.error);

