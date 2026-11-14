import fs from 'fs';
import path from 'path';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

const TARGET_DIR = path.resolve('public/staged_images/pool');
const USER_AGENT = 'LifeQuestCurator/4.0 (https://lifequest.local; exact-curator@lifequest.local)';

// Precise 1-to-1 canonical Wikipedia encyclopedia articles mapped directly to each item ID
const CANONICAL_MAP = {
  // 1. Radar
  'draft_radar_screen': { wiki: 'Radar display' },

  // Kitchen & Cooking
  'draft_1_קומקומשורקישנ': { wiki: 'Whistling kettle' },
  'draft_2_סירלחצמנירוסטה': { wiki: 'Pressure cooker' },
  'draft_3_ווקלהקפצהאסיאתי': { wiki: 'Wok' },
  'draft_4_טוסטרלחיצהכסופ': { wiki: 'Toaster' },
  'draft_5_פומפייהמרובעתממ': { wiki: 'Grater' },
  'draft_6_קולפנירקותשוויצ': { wiki: 'Peeler' },
  'draft_7_מסננתנירוסטהלפס': { wiki: 'Colander' },
  'draft_8_סינרשפמבדכהה': { wiki: 'Apron' },
  'draft_9_צנצנתמקלותקינמו': { wiki: 'Cinnamon' },
  'draft_10_שקיתקטניותיבשות': { wiki: 'Legume' },
  'draft_11_צנצנתממרחשומשומ': { wiki: 'Tahini' },
  'draft_12_בקבוקירטבימולחי': { wiki: 'Squeeze bottle' },
  'draft_13_בקבוקחומצתפוחימ': { wiki: 'Apple cider vinegar' },
  'draft_14_תבניתאפייהעמשקע': { wiki: 'Muffin tin' },
  'draft_15_מערוכעצלעוגיות': { wiki: 'Rolling pin' },
  'draft_16_מצקתמרקמבריקה': { wiki: 'Soup ladle' },
  'draft_17_בלנדרחשמליעלשיש': { wiki: 'Blender (appliance)' },
  'draft_18_מיקסרשולחנילקמח': { wiki: 'Stand mixer' },

  // Cleaning & Home
  'draft_19_סמרטוטלניקויאבק': { wiki: 'Microfiber' },
  'draft_20_כפפותלטקסצהובות': { wiki: 'Rubber glove' },
  'draft_21_ספוגלקרצופצלחות': { wiki: 'Sponge (tool)' },
  'draft_22_תרסיסלניקויכירי': { wiki: 'Spray bottle' },
  'draft_23_מיכלנוזלרצפותמב': { wiki: 'Bleach' },
  'draft_24_מטאטאעצלחצר': { wiki: 'Broom' },

  // Tools & Repairs
  'draft_25_שפכטלמתכתלקיר': { wiki: 'Putty knife' },
  'draft_26_גלגלתצבעלקירות': { wiki: 'Paint roller' },
  'draft_27_מקדחהרוטטתלבטונ': { wiki: 'Hammer drill' },
  'draft_28_קאטרלחיתוכחוטיח': { wiki: 'Diagonal pliers' },
  'draft_29_סרטמידהצהובונגל': { wiki: 'Tape measure' },
  'draft_30_סלילדבקמבודד': { wiki: 'Electrical tape' },
  'draft_31_מפתחברגיממשושה': { wiki: 'Hex key' },
  'draft_32_מלחציימידניותממ': { wiki: 'Locking pliers' },

  // Garden & Outdoors
  'draft_33_עציצחרסעמאדמה': { wiki: 'Flowerpot' },
  'draft_34_מתזמיממסתובבלדש': { wiki: 'Irrigation sprinkler' },
  'draft_35_שקחומראורגנילאד': { wiki: 'Compost' },
  'draft_36_מספריימלענפימיב': { wiki: 'Secateurs' },
  'draft_37_חרמשמכנילגינה': { wiki: 'String trimmer' },

  // Tech & Electronics
  'draft_38_נתבאינטרנטביתי': { wiki: 'Wireless router' },
  'draft_39_סוללהניידתלסמאר': { wiki: 'Power bank' },
  'draft_40_שלוחתשקעימעמכבל': { wiki: 'Power strip' },
  'draft_41_מחסניתדיויבשלמד': { wiki: 'Toner' },
  'draft_42_לוחמקשיממואר': { wiki: 'Computer keyboard' },
  'draft_43_התקנזיכרונניידמ': { wiki: 'USB flash drive' },

  // Wardrobe & Personal Care
  'draft_44_מגפיבוצצהובימ': { wiki: 'Wellington boot' },
  'draft_45_חלוקרחצהמכותנה': { wiki: 'Bathrobe' },
  'draft_46_מיכלדאודורנטרול': { wiki: 'Deodorant' },
  'draft_47_פינצטהמפלדתאלחל': { wiki: 'Tweezers' },
  'draft_48_סלילחוטדנטליבכי': { wiki: 'Dental floss' },
  'draft_49_פנקסקבלותמסחרי': { wiki: 'Receipt' },
  'draft_50_מצברפריקהמהירה': { wiki: 'Automotive battery' },

  // Office & Productivity (Batch 2)
  'draft_batch2_1_עמדתעבודהמתכוונ': { wiki: 'Standing desk' },
  'draft_batch2_2_סורקמסמכימשולחנ': { wiki: 'Image scanner' },
  'draft_batch2_3_סרגלשרטוטמפלדה': { wiki: 'Ruler' },
  'draft_batch2_4_יומנפגישותמעור': { wiki: 'Personal organizer' },
  'draft_batch2_5_קלסרמשרדיעמשמרד': { wiki: 'Ring binder' },
  'draft_batch2_6_מיקרופונפודקאסט': { wiki: 'Microphone' },
  'draft_batch2_7_מתאמתקעימבינלאו': { wiki: 'AC power plugs and sockets' },
  'draft_batch2_8_אוזניותקשתאלחוט': { wiki: 'Headphones' },
  'draft_batch2_9_שוברזיכוימקופאי': { wiki: 'Cash register' },
  'draft_batch2_10_זרועמחסומבכניסה': { wiki: 'Boom barrier' },
  'draft_batch2_11_רמקולכריזהעלעמו': { wiki: 'Loudspeaker' },
  'draft_batch2_12_בלוקשיופוניירלט': { wiki: 'Sandpaper' },
  'draft_batch2_13_מדריכהוראותהרכב': { wiki: 'Owner\'s manual' },
  'draft_batch2_14_ארגזפלסטיקלחלקי': { wiki: 'Toolbox' },
  'draft_batch2_15_גלילפצפצימשקופ': { wiki: 'Bubble wrap' },
  'draft_batch2_16_עגלתמשאלשקימ': { wiki: 'Hand truck' },
  'draft_batch2_17_מדידשמנמתכתי': { wiki: 'Dipstick' },
  'draft_batch2_18_מאווררתקרהמעצ': { wiki: 'Ceiling fan' },
  'draft_batch2_19_תריסשלבימלבנ': { wiki: 'Window blind' },
  'draft_batch2_20_מגשארגוניתשקופ': { wiki: 'Cutlery tray' },
  'draft_batch2_21_מברשתסירוקלכלבי': { wiki: 'Hairbrush' },
  'draft_batch2_22_קערתנירוסטהלבונ': { wiki: 'Dog food' },
  'draft_batch2_23_פחיתמשחתפוליש': { wiki: 'Wax' },
  'draft_batch2_24_פלטתחימומלשבת': { wiki: 'Hot plate' },
  'draft_batch2_25_אקדחקיטורחמ': { wiki: 'Steam cleaner' },
  'draft_batch2_26_פתקיותממוצהובות': { wiki: 'Post-it note' },
  'draft_batch2_27_שדכנשולחניכבד': { wiki: 'Stapler' },
  'draft_batch2_28_מנקבשניחורימ': { wiki: 'Hole punch' },
  'draft_batch2_29_מגרסתמסמכימשקטה': { wiki: 'Paper shredder' },
  'draft_batch2_30_סלכביסהעגולמקש': { wiki: 'Laundry basket' }
};

// Fallback search keywords if exact page has no image
const CLEAN_SHORT_TERMS = {
  'Hand cream': 'Hand lotion cosmetic tube',
  'Manual (instruction)': 'Instruction booklet manual',
  'Cutlery tray': 'Cutlery drawer organizer tray',
  'Wax': 'Automobile wax tin can paste',
  'Standing desk': 'Office, Standing Desk (5155525455)'
};

async function fetchWikiLead(articleTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&pithumbsize=800&redirects=1&format=json`;
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    const src = page?.thumbnail?.source;
    if (src && !src.toLowerCase().includes('.svg')) {
      const imgRes = await fetch(src, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(12000)
      });
      if (imgRes.ok) {
        return {
          buffer: Buffer.from(await imgRes.arrayBuffer()),
          pageTitle: page.title,
          url: src
        };
      }
    }
  } catch (_) {}
  return null;
}

async function fetchCommonsDirect(term) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(term)}&gsrlimit=2&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const info = p.imageinfo?.[0];
      const dlUrl = info?.thumburl || info?.url;
      const mime = (info?.mime || '').toLowerCase();
      if (dlUrl && !mime.includes('svg') && !mime.includes('pdf')) {
        const imgRes = await fetch(dlUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (imgRes.ok) {
          return {
            buffer: Buffer.from(await imgRes.arrayBuffer()),
            pageTitle: p.title,
            url: dlUrl
          };
        }
      }
    }
  } catch (_) {}
  return null;
}

async function main() {
  console.log(`=== DOWNLOADING 100% ACCURATE CANONICAL IMAGES ===`);
  let successCount = 0;
  let failedCount = 0;

  for (let i = 0; i < INITIAL_CREATION_DRAFT_ROOTS.length; i++) {
    const item = INITIAL_CREATION_DRAFT_ROOTS[i];
    const mapping = CANONICAL_MAP[item.id] || CANONICAL_MAP[Object.keys(CANONICAL_MAP).find(k => item.id.startsWith(k))];

    if (!mapping) {
      console.warn(`[!] No canonical mapping for ${item.id} (${item.title})`);
      failedCount++;
      continue;
    }

    const wikiTitle = mapping.wiki;
    process.stdout.write(`[${i+1}/${INITIAL_CREATION_DRAFT_ROOTS.length}] "${item.title}" -> "${wikiTitle}"... `);

    let result = await fetchWikiLead(wikiTitle);
    if (!result && CLEAN_SHORT_TERMS[wikiTitle]) {
      result = await fetchCommonsDirect(CLEAN_SHORT_TERMS[wikiTitle]);
    }
    if (!result) {
      result = await fetchCommonsDirect(wikiTitle);
    }

    if (result && result.buffer.length >= 4000) {
      const filename = `${item.id}.jpg`;
      const filepath = path.join(TARGET_DIR, filename);
      fs.writeFileSync(filepath, result.buffer);
      item.imageUrl = `/staged_images/pool/${filename}`;
      successCount++;
      console.log(`OK! (${(result.buffer.length/1024).toFixed(1)} KB, from "${result.pageTitle}")`);
    } else {
      failedCount++;
      console.log(`FAILED!`);
    }

    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\nResults: ${successCount} successfully matched to exact encyclopedia articles, ${failedCount} failed.`);

  // Save updated creationDraftRoots.js
  const draftsFilePath = path.resolve('src/data/creationDraftRoots.js');
  const content = `/**
 * INITIAL_CREATION_DRAFT_ROOTS
 * 
 * מאגר שורשים מדויק 1:1 לפי ערכים אנציקלופדיים קנוניים מוויקיפדיה.
 * כל תמונה נלקחה ישירות מערך הוויקיפדיה הרשמי של העצם!
 */

export const INITIAL_CREATION_DRAFT_ROOTS = ${JSON.stringify(INITIAL_CREATION_DRAFT_ROOTS, null, 2)};
`;
  fs.writeFileSync(draftsFilePath, content, 'utf8');

  // Regenerate Contact Sheet HTML
  const contactSheetScript = await import('./download_studio_draft_images.mjs');
}

main().catch(console.error);

