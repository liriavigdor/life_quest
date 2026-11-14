import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/staged_images/experiments');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

const USER_AGENT = 'LifeQuestExperiments/1.0 (https://lifequest.local; exp@lifequest.local)';

// Copy the user's uploaded radar image as Option D for radar
const userRadarSrc = 'C:/Users/Chen/.gemini/antigravity/brain/6a1f6eb1-ed42-4a1b-b036-24e411f2d42f/.user_uploaded/media_1794654691618_1b8121d0.jpg';
if (fs.existsSync(userRadarSrc)) {
  fs.copyFileSync(userRadarSrc, path.join(TARGET_DIR, 'radar_d_glowing.jpg'));
}

export const EXPERIMENT_DATA = [
  {
    id: 'exp_radar',
    title: 'מסך מכ"ם',
    description: 'בחינת רמות תאורה, פעולה והפשטה חזותית מול מוצג מוזיאוני כבוי',
    options: [
      {
        id: 'opt_radar_a',
        styleName: 'גישה א: אנציקלופדית דוממת',
        tag: 'מוזיאון כבוי',
        searchQuery: 'ASR-7 PPI CRT Display Front View',
        wiki: 'Radar display',
        filename: 'radar_a_encyclopedia.jpg',
        description: 'שפופרת צהובה כבויה מארכיון מוזיאון עם תווית נייר של מלאי'
      },
      {
        id: 'opt_radar_b',
        styleName: 'גישה ב: צילום עמדה קרבית',
        tag: 'צילום עמדת פיקוד',
        searchQuery: 'naval warship radar console screen bridge',
        commons: 'File:USS George Washington (CVN 73) radar display.jpg',
        filename: 'radar_b_action.jpg',
        description: 'עמדת מכ"ם פעילה על גשר אוניית מלחמה בתאורת לילה אדומה/כחולה'
      },
      {
        id: 'opt_radar_c',
        styleName: 'גישה ג: אנימציה ותלת-ממד (3D Stylized)',
        tag: 'רנדר אנימציה 3D',
        searchQuery: 'radar screen display 3d render isolated green',
        commons: 'File:Radar display icon 3d.png',
        filename: 'radar_c_3d.jpg',
        description: 'איקונין תלת-ממדי מלוטש, צבעוני, צללית נקייה בסגנון ממשק גיימינג'
      },
      {
        id: 'opt_radar_d',
        styleName: 'גישה ד: זרחני ומדויק (Neon Sweep)',
        tag: 'קרן סריקה זרחנית בחושך',
        searchQuery: 'green radar sweep neon display',
        filename: 'radar_d_glowing.jpg',
        description: 'מסך שחור מוחלט, קרן סריקה ירוקה-ניאון, טבעות טווח וקווי גריד חיים'
      }
    ]
  },
  {
    id: 'exp_kettle',
    title: 'קומקום שורק',
    description: 'בחינת ההבדל בין כלי נירוסטה יבש לבין סילון קיטור רותח ואנימציה',
    options: [
      {
        id: 'opt_kettle_a',
        styleName: 'גישה א: אנציקלופדית דוממת',
        tag: 'חפץ דומם וכבוי',
        wiki: 'Whistling kettle',
        filename: 'kettle_a_encyclopedia.jpg',
        description: 'קומקום נירוסטה סטנדרטי עומד כבוי על שיש (צילום מוצר)'
      },
      {
        id: 'opt_kettle_b',
        styleName: 'גישה ב: צילום בשיא הפעולה (Active Steam)',
        tag: 'סילון קיטור ואש',
        searchQuery: 'kettle boiling water steam rising stove gas flame',
        commons: 'File:Boiling kettle with steam.jpg',
        filename: 'kettle_b_action.jpg',
        description: 'קומקום רותח על להבת גז כחולה עם סילון קיטור לבן ודחוס פורץ מהפיה'
      },
      {
        id: 'opt_kettle_c',
        styleName: 'גישה ג: אנימציה ותלת-ממד (Stylized 3D / Pixar)',
        tag: 'דמות אנימציה 3D',
        searchQuery: 'whistling tea kettle cute 3d cartoon render steam',
        commons: 'File:Teapot cartoon 3d render steam.png',
        filename: 'kettle_c_3d.jpg',
        description: 'רנדר תלת-ממד אדום-מבריק מונפש, עם פחפוח קיטור לבן מצויר וצללית שובבה'
      },
      {
        id: 'opt_kettle_d',
        styleName: 'גישה ד: צללית ותאורה דרמטית (Dramatic Backlit)',
        tag: 'תאורת שוליים וזוהר',
        searchQuery: 'kettle boiling steam dark background dramatic lighting',
        commons: 'File:Teapot boiling steam black background.jpg',
        filename: 'kettle_d_glowing.jpg',
        description: 'רקע שחור עמוק, תאורת קנט דרמטית שמבליטה את ענני הקיטור הלבנים הבוהקים'
      }
    ]
  },
  {
    id: 'exp_toaster',
    title: 'טוסטר קופץ',
    description: 'בחינת ההבדל בין קופסת מתכת סגורה לבין טוסטים קופצים באוויר',
    options: [
      {
        id: 'opt_toaster_a',
        styleName: 'גישה א: אנציקלופדית דוממת',
        tag: 'חפץ סגור וכבוי',
        wiki: 'Toaster',
        filename: 'toaster_a_encyclopedia.jpg',
        description: 'טוסטר כסוף רגיל מצולם מזווית טכנית, לחם יושב בפנים ללא תנועה'
      },
      {
        id: 'opt_toaster_b',
        styleName: 'גישה ב: צילום בשיא הפעולה (Jumping Toast)',
        tag: 'טוסט קופץ באוויר',
        searchQuery: 'toast popping out of toaster flying midair crumbs action',
        commons: 'File:Toast jumping out of toaster.jpg',
        filename: 'toaster_b_action.jpg',
        description: 'צילום מהירות גבוהה של טוסטים זהובים ופריכים עפים באוויר מעל הטוסטר'
      },
      {
        id: 'opt_toaster_c',
        styleName: 'גישה ג: אנימציה ותלת-ממד (Stylized 3D)',
        tag: 'איקונין 3D מלוטש',
        searchQuery: 'cute retro toaster 3d render toast popping isolated',
        commons: 'File:3D Toaster bread pop cartoon.png',
        filename: 'toaster_c_3d.jpg',
        description: 'טוסטר רטרו מעוגל צבעוני בסגנון צעצוע 3D, עם טוסט זהוב שמציץ בשמחה'
      },
      {
        id: 'opt_toaster_d',
        styleName: 'גישה ד: חוטים לוהטים וזוהר (Glowing Heating Coils)',
        tag: 'גופי חימום לוהטים באדום',
        searchQuery: 'toaster glowing red hot coils inside dark close up',
        commons: 'File:Toaster glowing coils red hot.jpg',
        filename: 'toaster_d_glowing.jpg',
        description: 'תקריב דרמטי אל תוך הטוסטר: גופי החימום זוהרים באדום-כתום לוהט בחשיכה'
      }
    ]
  },
  {
    id: 'exp_scanner',
    title: 'סורק מסמכים',
    description: 'בחינת ההבדל בין מכשיר פלסטיק שטוח סגור לבין קרן אור חיה של סריקה',
    options: [
      {
        id: 'opt_scanner_a',
        styleName: 'גישה א: אנציקלופדית דוממת',
        tag: 'קופסת פלסטיק סגורה',
        wiki: 'Image scanner',
        filename: 'scanner_a_encyclopedia.jpg',
        description: 'סורק שולחני רגיל מכוסה במכסה פלסטיק, ללא פעולה'
      },
      {
        id: 'opt_scanner_b',
        styleName: 'גישה ב: צילום בשיא הפעולה (Active Scan Light)',
        tag: 'פס אור סורק זכוכית',
        searchQuery: 'document scanner light bar scanning paper glass office action',
        commons: 'File:Scanner light bar moving over paper.jpg',
        filename: 'scanner_b_action.jpg',
        description: 'סורק פתוח בזמן פעולה: פס אור כחול-לבן בוהק נע מתחת למסמך על גבי הזכוכית'
      },
      {
        id: 'opt_scanner_c',
        styleName: 'גישה ג: אנימציה ותלת-ממד (3D Stylized)',
        tag: 'אנימציית משרד 3D',
        searchQuery: 'office document scanner 3d icon render paper feed',
        commons: 'File:Document scanner 3d icon render.png',
        filename: 'scanner_c_3d.jpg',
        description: 'מודל תלת-ממדי מסוגנן של סורק עתידני קומפקטי פולט דפים'
      },
      {
        id: 'opt_scanner_d',
        styleName: 'גישה ד: סריקת לייזר הייטק (Cyber Laser Scan)',
        tag: 'קרן לייזר ודיגיטציה',
        searchQuery: 'laser scanning beam document digitalization tech neon blue',
        commons: 'File:Laser document scanning line beam.jpg',
        filename: 'scanner_d_glowing.jpg',
        description: 'קרן לייזר כחולה-ציאן זוהרת המעבירה גריד של נתונים דיגיטליים על גבי הדף'
      }
    ]
  }
];

async function fetchWikiImage(wikiTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&pithumbsize=800&redirects=1&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return null;
    const data = await res.json();
    const page = Object.values(data.query?.pages || {})[0];
    const src = page?.thumbnail?.source;
    if (src && !src.toLowerCase().includes('.svg')) {
      const imgRes = await fetch(src, { headers: { 'User-Agent': USER_AGENT } });
      if (imgRes.ok) return Buffer.from(await imgRes.arrayBuffer());
    }
  } catch (_) {}
  return null;
}

async function fetchCommonsImage(query) {
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
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
        if (imgRes.ok) return Buffer.from(await imgRes.arrayBuffer());
      }
    }
  } catch (_) {}
  return null;
}

async function downloadExperiments() {
  console.log('=== DOWNLOADING MULTI-STYLE EXPERIMENT ASSETS ===');

  for (const exp of EXPERIMENT_DATA) {
    console.log(`\nConcept: "${exp.title}"`);

    for (const opt of exp.options) {
      const targetPath = path.join(TARGET_DIR, opt.filename);
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 5000) {
        console.log(`  [OK - cached] ${opt.styleName} -> ${opt.filename}`);
        continue;
      }

      process.stdout.write(`  Fetching ${opt.styleName}... `);
      let buf = null;
      if (opt.wiki) buf = await fetchWikiImage(opt.wiki);
      if (!buf && opt.searchQuery) buf = await fetchCommonsImage(opt.searchQuery);
      if (!buf && opt.commons) buf = await fetchCommonsImage(opt.commons);

      if (buf && buf.length > 3000) {
        fs.writeFileSync(targetPath, buf);
        console.log(`OK! (${(buf.length/1024).toFixed(1)} KB)`);
      } else {
        console.log('Fallback needed');
      }
      await new Promise(r => setTimeout(r, 100));
    }
  }

  console.log('\nAll experiment assets downloaded to public/staged_images/experiments/');
}

downloadExperiments().catch(console.error);

