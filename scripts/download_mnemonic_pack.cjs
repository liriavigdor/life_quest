const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../public/mnemonic_assets/downloaded_pool');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed ${url} status ${res.statusCode}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ url, dest, size: fs.statSync(dest).size }));
      });
    });
    req.on('error', reject);
    req.setTimeout(12000, () => {
      req.destroy();
      reject(new Error(`Timeout ${url}`));
    });
  });
}

async function main() {
  console.log('--- 1. Fetching Top Iconic Memes from Imgflip API ---');
  const memesRes = await new Promise((res, rej) => {
    https.get('https://api.imgflip.com/get_memes', (r) => {
      let d = '';
      r.on('data', c => d += c);
      r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });

  const downloaded = [];

  if (memesRes && memesRes.success) {
    const topMemes = memesRes.data.memes.slice(0, 35);
    for (const meme of topMemes) {
      const cleanName = 'meme_' + meme.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
      const ext = path.extname(meme.url) || '.jpg';
      const dest = path.join(targetDir, cleanName + ext);

      try {
        const result = await downloadFile(meme.url, dest);
        console.log(`[MEME] Downloaded: ${cleanName} (${result.size} bytes)`);
        downloaded.push({
          id: cleanName,
          title: meme.name,
          category: 'memes',
          path: `/mnemonic_assets/downloaded_pool/${cleanName}${ext}`,
          file: cleanName + ext
        });
      } catch (err) {
        console.error(`[MEME FAIL] ${meme.name}: ${err.message}`);
      }
    }
  }

  // 2. Curated iconic public domain & cultural scenes
  console.log('\n--- 2. Fetching Famous Scenes & Cultural Landmarks ---');
  const culturalAssets = [
    {
      name: 'mona_lisa_davinci',
      title: 'מונה ליזה (לאונרדו דה וינצ׳י)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/687px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg'
    },
    {
      name: 'van_gogh_starry_night',
      title: 'ליל כוכבים (ואן גוך)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/757px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg'
    },
    {
      name: 'neil_armstrong_moon_landing',
      title: 'נחיתה על הירח (ניל ארמסטרונג)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Aldrin_Apollo_11_original.jpg/600px-Aldrin_Apollo_11_original.jpg'
    },
    {
      name: 'statue_of_liberty',
      title: 'פסל החירות (ניו יורק)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/600px-Statue_of_Liberty_7.jpg'
    },
    {
      name: 'eiffel_tower_paris',
      title: 'מגדל אייפל (פריז)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/600px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg'
    },
    {
      name: 'pyramids_giza',
      title: 'הפירמידות הגדולות (גיזה)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/600px-Kheops-Pyramid.jpg'
    },
    {
      name: 'the_scream_edvard_munch',
      title: 'הצעקה (אדוורד מונק)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/600px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg'
    },
    {
      name: 'great_wave_kanagawa',
      title: 'הגל הגדול בסמוך לקאנאגאווה',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/600px-Great_Wave_off_Kanagawa2.jpg'
    },
    {
      name: 'taj_mahal',
      title: 'טאג׳ מאהל (הודו)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit3.jpg/600px-Taj_Mahal%2C_Agra%2C_India_edit3.jpg'
    },
    {
      name: 'colosseum_rome',
      title: 'הקולוסיאום (רומא)',
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/600px-Colosseo_2020.jpg'
    }
  ];

  for (const item of culturalAssets) {
    const dest = path.join(targetDir, item.name + '.jpg');
    try {
      const res = await downloadFile(item.url, dest);
      console.log(`[LANDMARK] Downloaded: ${item.name} (${res.size} bytes)`);
      downloaded.push({
        id: item.name,
        title: item.title,
        category: 'landmarks',
        path: `/mnemonic_assets/downloaded_pool/${item.name}.jpg`,
        file: item.name + '.jpg'
      });
    } catch (err) {
      console.error(`[FAIL] ${item.name}: ${err.message}`);
    }
  }

  // Save manifest
  const manifestPath = path.join(targetDir, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(downloaded, null, 2));
  console.log(`\n🎉 Completed! Total downloaded: ${downloaded.length} images.`);
  console.log(`Manifest saved at: ${manifestPath}`);
}

main().catch(console.error);
