import fs from 'fs';
import https from 'https';
import path from 'path';

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 LifeQuest/1.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      const stream = fs.createWriteStream(destPath);
      res.pipe(stream);
      stream.on('finish', () => {
        stream.close();
        resolve(fs.statSync(destPath).size);
      });
      stream.on('error', reject);
    }).on('error', reject);
  });
}

const targets = [
  {
    name: 'pieces_dark_chocolate_bar.jpg',
    url: 'https://img.freepik.com/premium-photo/pieces-dark-chocolate-bar-with-chocolate-strips-crumbs-beige-background_124507-16509.jpg?w=2000'
  },
  {
    name: 'car_wash_bucket_sponge.jpg',
    url: 'https://www.slashgear.com/img/gallery/5-car-cleaning-tools-you-should-have-in-your-garage/bucket-sponges-rags-and-soap-1677876823.jpg'
  },
  {
    name: 'chrome_car_hood_emblem.jpg',
    url: 'https://images.pexels.com/photos/36102359/pexels-photo-36102359/free-photo-of-vintage-ford-car-emblem-with-chrome-hood-ornament.jpeg?auto=compress&w=1260&h=750&dpr=1'
  },
  {
    name: 'military_dress_uniform.jpg',
    url: 'https://d1ldvf68ux039x.cloudfront.net/thumbs/photos/1709/3766433/2000w_q95.jpg'
  }
];

const poolDir = path.resolve('public', 'staged_images', 'pool');
for (const t of targets) {
  const dest = path.join(poolDir, t.name);
  try {
    console.log(`Downloading ${t.name}...`);
    const size = await downloadFile(t.url, dest);
    console.log(`Saved ${t.name} (${size} bytes)`);
  } catch (err) {
    console.warn(`Failed ${t.name}:`, err.message);
  }
}

