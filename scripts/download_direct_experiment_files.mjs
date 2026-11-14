import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/staged_images/experiments');
const USER_AGENT = 'LifeQuestExperiments/2.0 (https://lifequest.local; exp2@lifequest.local)';

const DIRECT_FILES = [
  // Kettle
  { file: 'File:Yellow kettle with boiling water on stovetop.jpeg', dest: 'kettle_b_action.jpg' },
  { file: 'File:Tea Kettle Icon.png', dest: 'kettle_c_3d.jpg' },
  { file: 'File:Kettle Steam - 1289.jpg', dest: 'kettle_d_glowing.jpg' },

  // Toaster
  { file: 'File:Toaster-in-Betrieb.jpg', dest: 'toaster_b_action.jpg' },
  { file: 'File:Toaster.png', dest: 'toaster_c_3d.jpg' },
  { file: 'File:Toaster with filament glowing.JPG', dest: 'toaster_d_glowing.jpg' },

  // Radar
  { file: 'File:Radar Racon O.jpg', dest: 'radar_b_action.jpg' },
  { file: 'File:Radar symbol.png', dest: 'radar_c_3d.jpg' },

  // Scanner
  { file: 'File:DIY Cardboard Album scanner-Light Box-02.jpg', dest: 'scanner_b_action.jpg' },
  { file: 'File:Icon Scanner.png', dest: 'scanner_c_3d.jpg' }
];

async function fetchCommonsFile(filename, destFilename) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url|size&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return false;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    const info = page?.imageinfo?.[0];
    const dlUrl = info?.thumburl || info?.url;
    if (dlUrl) {
      const imgRes = await fetch(dlUrl, { headers: { 'User-Agent': USER_AGENT } });
      if (imgRes.ok) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        if (buf.length > 2000) {
          fs.writeFileSync(path.join(TARGET_DIR, destFilename), buf);
          console.log(`[OK] ${destFilename} (${(buf.length/1024).toFixed(1)} KB)`);
          return true;
        }
      }
    }
  } catch (err) {
    console.error(`Error fetching ${filename}:`, err.message);
  }
  return false;
}

async function main() {
  for (const item of DIRECT_FILES) {
    const destPath = path.join(TARGET_DIR, item.dest);
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 4000) {
      console.log(`[Cached] ${item.dest}`);
      continue;
    }
    process.stdout.write(`Fetching ${item.dest}... `);
    const ok = await fetchCommonsFile(item.file, item.dest);
    if (!ok) console.log('Failed');
    await new Promise(r => setTimeout(r, 120));
  }
}

main().catch(console.error);

