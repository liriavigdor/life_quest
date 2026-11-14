import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/staged_images/archetypes');
const USER_AGENT = 'LifeQuestArchetypes/1.0 (https://lifequest.local; archetypes@lifequest.local)';

const NEW_SIX = [
  { id: 'arch_floppy_disk', nameEn: 'Floppy disk', wiki: 'Floppy disk', title: 'דיסקט' },
  { id: 'arch_axe', nameEn: 'Axe', wiki: 'Axe', title: 'גרזן' },
  { id: 'arch_trumpet', nameEn: 'Trumpet', wiki: 'Trumpet', title: 'חצוצרה' },
  { id: 'arch_gear', nameEn: 'Gear', wiki: 'Gear', title: 'גלגל שיניים' },
  { id: 'arch_spirit_level', nameEn: 'Spirit level', wiki: 'Spirit level', title: 'פלס בנאים' },
  { id: 'arch_service_bell', nameEn: 'Service bell', wiki: 'Service bell', title: 'פעמון קבלה' }
];

async function fetchWikiLead(wikiTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&pithumbsize=800&redirects=1&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    const src = page?.thumbnail?.source;
    if (src && !src.toLowerCase().includes('.svg')) {
      const imgRes = await fetch(src, { headers: { 'User-Agent': USER_AGENT } });
      if (imgRes.ok) {
        return Buffer.from(await imgRes.arrayBuffer());
      }
    }
  } catch (_) {}
  return null;
}

async function fetchCommonsFallback(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=2&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
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
          return Buffer.from(await imgRes.arrayBuffer());
        }
      }
    }
  } catch (_) {}
  return null;
}

async function main() {
  console.log('Downloading 6 replacement archetypes...');
  for (const item of NEW_SIX) {
    process.stdout.write(`Fetching ${item.title} (${item.nameEn})... `);
    let buf = await fetchWikiLead(item.wiki);
    if (!buf) {
      buf = await fetchCommonsFallback(`${item.nameEn} isolated`);
    }
    if (!buf) {
      buf = await fetchCommonsFallback(item.nameEn);
    }
    if (buf && buf.length > 5000) {
      const filepath = path.join(TARGET_DIR, `${item.id}.jpg`);
      fs.writeFileSync(filepath, buf);
      console.log(`OK! (${(buf.length/1024).toFixed(1)} KB)`);
    } else {
      console.log('FAILED!');
    }
  }
}

main().catch(console.error);

