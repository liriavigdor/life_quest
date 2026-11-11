import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

async function fetchImageFromWiki(query, lang = 'he') {
  const host = lang === 'he' ? 'he.wikipedia.org' : 'en.wikipedia.org';
  // 1. Direct title search
  try {
    const url = `https://${host}/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&format=json&pithumbsize=600`;
    const res = await fetch(url, { headers: { 'User-Agent': 'LifeQuestCatalog/1.0 (contact@lifequest.app)' } });
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        for (const pid in pages) {
          if (pages[pid].thumbnail?.source) {
            return pages[pid].thumbnail.source;
          }
        }
      }
    }
  } catch (_) {}

  // 2. Generator search
  try {
    const searchUrl = `https://${host}/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=600`;
    const res = await fetch(searchUrl, { headers: { 'User-Agent': 'LifeQuestCatalog/1.0 (contact@lifequest.app)' } });
    if (res.ok) {
      const data = await res.json();
      const pages = data.query?.pages;
      if (pages) {
        for (const pid in pages) {
          if (pages[pid].thumbnail?.source) {
            return pages[pid].thumbnail.source;
          }
        }
      }
    }
  } catch (_) {}

  return null;
}

async function runFullDownload() {
  const poolFiles = new Set(fs.readdirSync('public/staged_images/pool'));
  const missing = arsenal.filter(item => {
    const filename = item.imageUrl.replace('/staged_images/pool/', '');
    return !poolFiles.has(filename);
  });

  console.log(`Remaining items needing image download: ${missing.length}`);

  let downloaded = 0;
  for (let i = 0; i < missing.length; i++) {
    const item = missing[i];
    const filename = item.imageUrl.replace('/staged_images/pool/', '');
    const dest = `public/staged_images/pool/${filename}`;
    
    const cleanName = item.name_he.replace(/\(.*?\)/g, '').trim();
    const enSlug = item.id.replace(/_/g, ' ');
    
    // Try Hebrew Wiki first
    let imgUrl = await fetchImageFromWiki(cleanName, 'he');
    // If not found, try English Wiki with clean slug / search query
    if (!imgUrl) {
      imgUrl = await fetchImageFromWiki(enSlug, 'en');
    }
    
    if (imgUrl) {
      try {
        const imgRes = await fetch(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (imgRes.ok) {
          const buffer = await imgRes.arrayBuffer();
          fs.writeFileSync(dest, Buffer.from(buffer));
          console.log(`[${i + 1}/${missing.length}] (${item.num}) -> Saved ${filename} (${buffer.byteLength} B)`);
          downloaded++;
        }
      } catch (err) {
        console.error(`Error saving ${filename}:`, err.message);
      }
    } else {
      console.log(`[${i + 1}/${missing.length}] (${item.num}) -> No image found for ${cleanName} / ${enSlug}`);
    }
    
    await new Promise(r => setTimeout(r, 120));
  }
  
  console.log(`=============================================`);
  console.log(`Download finished! Downloaded ${downloaded}/${missing.length} new images.`);
  console.log(`=============================================`);
}

runFullDownload();
