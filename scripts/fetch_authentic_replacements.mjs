import fs from 'node:fs';
import path from 'node:path';

const CURATION_PATH = path.resolve('public/data/user_curation_state.json');
const POOL_DIR = path.resolve('public/staged_images/pool');
const STAGED_POOL_FILE = path.resolve('src/data/stagedImagesPool.js');

// Accurate search queries tailored for authentic, non-clipart, non-illustration photography
const SEARCH_TARGETS = {
  sonic_the_hedgehog: {
    query: 'Sonic the Hedgehog 2020 film movie still',
    fallback: 'Sonic the Hedgehog real life mascot costume'
  },
  barbie_doll: {
    query: 'classic vintage Barbie doll pink dress toy photography',
    fallback: 'Barbie doll collector edition portrait photo'
  },
  dracula: {
    query: 'Bela Lugosi Dracula 1931 universal pictures classic film still',
    fallback: 'Count Dracula cape vintage black white film portrait'
  },
  pinocchio: {
    query: 'vintage wooden Pinocchio puppet marionette string toy photo',
    fallback: 'Pinocchio real wooden carved puppet photograph'
  },
  peter_pan: {
    query: 'Peter Pan live action 2003 movie film still Jeremy Sumpter',
    fallback: 'Peter Pan green tunic theater costume stage photo'
  },
  scooby_doo: {
    query: 'Scooby-Doo 2002 live action film movie still Great Dane',
    fallback: 'Scooby Doo movie Mystery Machine live action photo'
  },
  captain_america: {
    query: 'Captain America Chris Evans Avengers Endgame shield movie still',
    fallback: 'Captain America Steve Rogers Marvel Cinematic Universe still'
  },
  bilbo_baggins: {
    query: 'Martin Freeman Bilbo Baggins The Hobbit gold ring film still',
    fallback: 'Bilbo Baggins Hobbit movie high resolution photo'
  },
  the_white_house: {
    query: 'White House South Lawn Washington DC sunny architecture photography',
    fallback: 'The White House building Washington DC exterior photo'
  },
  coastal_lighthouse: {
    query: 'coastal lighthouse rocky shore sea ocean waves photography',
    fallback: 'Peggys Cove lighthouse dramatic ocean landscape photo'
  },
  classic_red_barn: {
    query: 'classic red wooden barn green pasture American countryside photography',
    fallback: 'traditional Vermont red barn farm landscape photo'
  },
  item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת: {
    query: 'round iron cannonball bomb lit burning fuse prop photo',
    fallback: 'antique round pirate bomb burning wick close up photo'
  },
  item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל: {
    query: 'vintage mercury clinical glass thermometer fever photography',
    fallback: 'glass medical thermometer high temperature measurement photo'
  },
  item_172_מנעול_סגור__ומפתח_בצד___מסמל: {
    query: 'heavy antique brass padlock with brass key macro photo',
    fallback: 'vintage iron padlock and key on rustic wood photography'
  },
  item_183_עלה_תלתן_בעל_ארבעה_עלים__מסמל: {
    query: 'real four leaf clover macro nature photography in grass',
    fallback: 'genuine four leaf clover green close up macro photo'
  },
  item_193_סרט_מודעות_ארוך_קשור_בלולאה__ורוד_צהוב___מסמל: {
    query: 'pink awareness ribbon satin loop macro photography',
    fallback: 'yellow satin awareness ribbon bow close up photo'
  },
  bill_gates: {
    query: 'Bill Gates portrait photography smiling high resolution',
    fallback: 'Bill Gates keynote speech speaking portrait photo'
  },
  charlie_chaplin: {
    query: 'Charlie Chaplin The Tramp bowler hat cane vintage portrait photo',
    fallback: 'Charlie Chaplin classic black and white film still'
  },
  colosseum: {
    query: 'Colosseum Rome Italy sunny exterior architecture photography',
    fallback: 'Roman Colosseum amphitheatre wide landscape photo'
  },
  compass: {
    query: 'antique brass nautical compass maritime vintage wood photography',
    fallback: 'vintage pocket brass compass direction navigation photo'
  },
  freddie_mercury: {
    query: 'Freddie Mercury Wembley Stadium 1986 yellow jacket concert photo',
    fallback: 'Freddie Mercury Queen Live Aid 1985 singing microphone photo'
  },
  gollum: {
    query: 'Gollum Lord of the Rings movie still crouching cave photo',
    fallback: 'Gollum Smeagol Lord of the Rings high resolution still'
  },
  michael_jordan: {
    query: 'Michael Jordan Chicago Bulls red jersey dunking basketball action photo',
    fallback: 'Michael Jordan 23 Bulls slam dunk legendary photo'
  },
  spiderman: {
    query: 'Spider-Man live action movie still climbing glass skyscraper wall',
    fallback: 'Spider-Man movie suit Peter Parker high resolution photo'
  },
  super_mario: {
    query: 'Super Mario high quality collectible statue figure photography',
    fallback: 'Super Mario Bros Nintendo World real attraction photo'
  },
  treasure_chest: {
    query: 'wooden pirate treasure chest open overflowing gold coins prop photo',
    fallback: 'vintage wooden treasure chest gold jewelry photography'
  }
};

async function searchDuckDuckGoImages(targetQ) {
  try {
    const tokenRes = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(targetQ), {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(4000)
    });
    const text = await tokenRes.text();
    const vqdMatch = text.match(/vqd=([0-9-]+)/);
    if (!vqdMatch) return [];

    const imgRes = await fetch(
      'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(targetQ) + '&vqd=' + vqdMatch[1],
      {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://duckduckgo.com/'
        },
        signal: AbortSignal.timeout(4000)
      }
    );
    if (!imgRes.ok) return [];
    const data = await imgRes.json();
    if (!Array.isArray(data.results)) return [];

    return data.results
      .map(r => r.image)
      .filter(u => u && typeof u === 'string' && u.startsWith('http') && !u.includes('.svg') && !u.includes('.gif'));
  } catch (err) {
    return [];
  }
}

async function searchWikimediaCommons(cleanEn) {
  try {
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanEn)}&gsrnamespace=6&gsrlimit=8&prop=pageimages&pithumbsize=1000&format=json`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { 'User-Agent': 'LifeQuestMnemonicCurator/2.0' },
      signal: AbortSignal.timeout(5000)
    });
    if (!wikiRes.ok) return [];
    const data = await wikiRes.json();
    const pages = data.query?.pages;
    if (!pages) return [];
    return Object.values(pages)
      .map(p => p.thumbnail?.source)
      .filter(u => u && !u.includes('.svg') && !u.includes('.pdf') && !u.includes('.webm') && !u.includes('.tif'));
  } catch {
    return [];
  }
}

async function downloadAndSaveImage(imageUrl, destPath) {
  try {
    const res = await fetch(imageUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      signal: AbortSignal.timeout(7000)
    });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    if (buffer.length < 15000) return false; // Reject tiny or broken images
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch {
    return false;
  }
}

async function run() {
  console.log('🚀 Starting authentic image replacement pipeline for flagged items...');
  fs.mkdirSync(POOL_DIR, { recursive: true });

  const rawCuration = JSON.parse(fs.readFileSync(CURATION_PATH, 'utf8'));
  const flagged = rawCuration.flaggedBadMap || {};
  const flaggedKeys = Object.keys(flagged);
  console.log(`Found ${flaggedKeys.length} flagged items to acquire authentic photos for.`);

  const successfulReplacements = {};

  for (const id of flaggedKeys) {
    const item = flagged[id];
    const targetConfig = SEARCH_TARGETS[id];
    const title = item.title || item.name || id;
    console.log(`\n🔍 Searching authentic photo for: [${id}] "${title}"`);

    const query = targetConfig?.query || `${title} authentic photo`;
    const fallbackQ = targetConfig?.fallback;

    let candidateUrls = await searchDuckDuckGoImages(query);
    if (candidateUrls.length === 0 && fallbackQ) {
      console.log(`  Trying fallback query: "${fallbackQ}"`);
      candidateUrls = await searchDuckDuckGoImages(fallbackQ);
    }
    if (candidateUrls.length === 0) {
      console.log(`  Trying Wikimedia Commons for: "${query}"`);
      candidateUrls = await searchWikimediaCommons(query);
    }

    console.log(`  Found ${candidateUrls.length} candidate URLs.`);

    const destFileName = `authentic_${id}.jpg`;
    const destPath = path.join(POOL_DIR, destFileName);
    const localUrl = `/staged_images/pool/${destFileName}`;

    let downloaded = false;
    for (const candUrl of candidateUrls.slice(0, 5)) {
      console.log(`  Attempting download from: ${candUrl.slice(0, 75)}...`);
      downloaded = await downloadAndSaveImage(candUrl, destPath);
      if (downloaded) {
        console.log(`  ✅ Successfully saved authentic photo to ${destFileName} (${(fs.statSync(destPath).size / 1024).toFixed(1)} KB)`);
        successfulReplacements[id] = {
          id,
          title,
          oldImageUrl: item.imageUrl,
          newImageUrl: localUrl,
          destFileName
        };
        break;
      }
    }

    if (!downloaded) {
      console.warn(`  ❌ Failed to download a valid authentic photo for ${id}`);
    }

    // Gentle delay between searches
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\n🎉 Acquisition complete: ${Object.keys(successfulReplacements).length}/${flaggedKeys.length} replaced.`);

  // Write replacement manifest
  const manifestPath = path.resolve('public/data/authentic_replacements_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(successfulReplacements, null, 2), 'utf8');
  console.log(`Saved manifest to ${manifestPath}`);
}

run().catch(console.error);

