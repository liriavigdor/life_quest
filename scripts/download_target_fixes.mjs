import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

const POOL_DIR = path.resolve('public/staged_images/pool');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'LifeQuestMnemonicCurator/1.0 (educational research; contact: dev@lifequest.local)'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, {
      headers: {
        'User-Agent': 'LifeQuestMnemonicCurator/1.0 (educational research; contact: dev@lifequest.local)'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(true));
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function searchAndDownload(query, filename) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json&srlimit=5`;
  const sData = await fetchJson(searchUrl);
  const results = sData?.query?.search || [];
  if (!results.length) {
    console.log(`No results for "${query}"`);
    return false;
  }

  // pick first photo result (prefer .jpg)
  const choice = results.find(r => r.title.toLowerCase().endsWith('.jpg') || r.title.toLowerCase().endsWith('.jpeg')) || results[0];
  console.log(`Found "${choice.title}" for query "${query}"`);

  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(choice.title)}&prop=imageinfo&iiprop=url&iiurlwidth=1200&format=json`;
  const iData = await fetchJson(infoUrl);
  const pages = iData?.query?.pages || {};
  const firstPage = Object.values(pages)[0];
  const imgInfo = firstPage?.imageinfo?.[0];
  const dlUrl = imgInfo?.thumburl || imgInfo?.url;

  if (!dlUrl) {
    console.log(`Could not get url for ${choice.title}`);
    return false;
  }

  const dest = path.join(POOL_DIR, filename);
  await downloadImage(dlUrl, dest);
  const stats = fs.statSync(dest);
  console.log(`Successfully downloaded ${filename} (${stats.size} bytes) from ${dlUrl}`);
  return true;
}

async function run() {
  const targets = [
    { query: "Boeing 747 in flight Lufthansa", filename: "item_208_מטוס_ג_מבו.jpg" },
    { query: "hot air balloon Cappadocia flight colorful", filename: "item_211_כדור_פורח_צבעוני.jpg" },
    { query: "Atlantis submarine yellow tourist", filename: "item_212_צוללת_צהובה.jpg" },
    { query: "Green emergency exit sign running man", filename: "item_500_שלדג.jpg" }
  ];

  for (const t of targets) {
    await searchAndDownload(t.query, t.filename);
    await new Promise(r => setTimeout(r, 800));
  }
}

run();

