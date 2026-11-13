import fs from 'fs';
import { validateBranches } from './branch_validator.mjs';

// Curated pristine replacements for any anchors that had issues
const PRISTINE_OVERRIDE_MAP = {
  // Characters & Icons
  'spongebob': {
    title: 'בובספוג',
    keywords: ['בועות', 'קרצוף', 'קרקעית', 'חיוך']
  },
  'chess_knight_piece': {
    title: 'חייל שחמט',
    keywords: ['פרש', 'לוח', 'טקטיקה', 'אסטרטגיה']
  },
  'hamsa_hand_amulet': {
    title: 'קמע חמסה',
    keywords: ['מזל', 'עין', 'ברכה', 'קיר']
  },
  'item_159_ענן_מילים_מחשבה__בועה_חלקה_או_מסולסלת___מסמלת': {
    title: 'בועת מחשבה',
    keywords: ['בועה', 'רעיון', 'דיבור', 'קומיקס']
  },
  'item_160_לב_אדום_סימטרי__שבור_בחצי___מסמל': {
    title: 'לב שבור',
    keywords: ['אהבה', 'פרידה', 'כאב', 'רגש']
  },
  'item_162_כובע_בוגר_אוניברסיטה__מרובע_עם_גדיל___מסמל': {
    title: 'כובע בוגר אוניברסיטה',
    keywords: ['תואר', 'גלימה', 'טקס', 'סיום']
  },
  'item_166_שעון_חול__חצי_מלא___מסמל': {
    title: 'שעון חול',
    keywords: ['זמן', 'דקות', 'גרגרים', 'מדד']
  },
  'item_167_שטיח_אדום_ארוך__מסמל': {
    title: 'שטיח אדום',
    keywords: ['פרמיירה', 'כוכבים', 'טקס', 'יוקרה']
  },
  'item_169_גביע_זהב_עם_ידיות__מסמל': {
    title: 'גביע זהב',
    keywords: ['מקום', 'זכייה', 'אליפות', 'ניצחון']
  },
  'item_174_שלט_עצור__מתומן_אדום___מסמל': {
    title: 'שלט עצור',
    keywords: ['תמרור', 'בלימה', 'צומת', 'סכנה']
  },
  'item_176_סימן_שאלה_ענק__מעל_ראש_קטן___מסמל': {
    title: 'סימן שאלה',
    keywords: ['ספק', 'תעלומה', 'בלבול', 'תהייה']
  },
  'item_180_כתר_זהב_עם_יהלומים__מסמל': {
    title: 'כתר מלוכה עם יהלומים',
    keywords: ['מלך', 'מלכה', 'ארמון', 'שלטון']
  },
  'item_191_עגלת_קניות_מסורתית__מסמלת': {
    title: 'עגלת קניות',
    keywords: ['סופר', 'סופרמרקט', 'מדפים', 'מצרכים']
  },
  'item_192_פח_אשפה_עם_מכסה_חצי_פתוח__מסמל': {
    title: 'פח אשפה',
    keywords: ['זבל', 'פסולת', 'מיחזור', 'ניקיון']
  },
  'item_194_כדור_בדולח_על_מפה_כהה__מסמל': {
    title: 'כדור בדולח לחיזוי',
    keywords: ['עתיד', 'כישוף', 'נבואה', 'קוסמת']
  },
  'item_196_מטאטא_זרדים_ישן__מסמל': {
    title: 'מטאטא זרדים',
    keywords: ['טאטוא', 'מכשפה', 'אבק', 'יעה']
  },
  'sonic_the_hedgehog': {
    title: 'סוניק הקיפוד',
    keywords: ['מהירות', 'תספורת', 'מספרה', 'טבעות']
  },
  'item_286_סופת_טורנדו': {
    title: 'סופת טורנדו',
    keywords: ['סופה', 'מערבולת', 'רוח', 'משפך']
  },
  'nerd_geek_glasses': {
    title: 'משקפי ראייה',
    keywords: ['מסגרת', 'עדשות', 'קריאה', 'אופטיקה']
  },
  'pac_man': {
    title: 'פאקמן',
    keywords: ['מבוך', 'גרגרנות', 'רטרו', 'נקודות']
  },
  'r2_d2': {
    title: 'רובוט R2D2',
    keywords: ['חלל', 'חיישן', 'בינה', 'מתכת']
  },
  'donald_duck': {
    title: 'דונלד דאק',
    keywords: ['מלח', 'נוצות', 'רוגז', 'ספינה']
  },
  'tom_and_jerry': {
    title: 'טום וג\'רי',
    keywords: ['מרדף', 'חתול', 'עכבר', 'מלכודת']
  },
  'popeye': {
    title: 'פופאי',
    keywords: ['תרד', 'מקטרת', 'עוגן', 'שרירים']
  },
  'the_grinch': {
    title: 'הגרינץ\'',
    keywords: ['ירוק', 'ערמומי', 'הר', 'חיוך']
  },
  'shrek': {
    title: 'שרק',
    keywords: ['ביצה', 'חמור', 'עוג', 'ירוק']
  },
  'hiking_trail_hiker': {
    title: 'תרמילאי',
    keywords: ['שביל', 'הרים', 'מקלות', 'שקיעה']
  },
  'statue_of_liberty': {
    title: 'פסל החירות',
    keywords: ['לפיד', 'אמריקה', 'נמל', 'כתר']
  },
  'the_thinker': {
    title: 'האדם החושב',
    keywords: ['החלטה', 'ייעוץ', 'פסל', 'מחשבה']
  },
  'moai_easter_island': {
    title: 'פסלי מואי באי הפסחא',
    keywords: ['טיקי', 'אבן', 'וולקנו', 'בזלת']
  },

  // Landmarks
  'fresh_bread_loaf': {
    title: 'כיכר לחם כפרי',
    keywords: ['מאפייה', 'שמרים', 'כריך', 'טוסט']
  },
  'great_wall_china': {
    title: 'החומה הגדולה',
    keywords: ['סין', 'הגנה', 'אבנים', 'מבצר']
  },
  'leaning_tower_pisa': {
    title: 'מגדל פיזה הנוטה',
    keywords: ['שיפוע', 'שיש', 'איטליה', 'פעמון']
  },
  'christ_the_redeemer': {
    title: 'פסל הגואל בריו',
    keywords: ['זרועות', 'ברזיל', 'פסגה', 'עננים']
  },
  'golden_gate_bridge': {
    title: 'גשר הזהב בסן פרנסיסקו',
    keywords: ['ערפל', 'כתום', 'כבלים', 'מפרץ']
  },
  'azrieli_towers': {
    title: 'מגדלי עזריאלי',
    keywords: ['משולש', 'קניון', 'רכבת', 'תצפית']
  },
  'saint_basil_cathedral': {
    title: 'כנסיית וסילי הקדוש',
    keywords: ['בצל', 'כיפה', 'צבעוני', 'מוסקבה']
  },
  'neuschwanstein_castle': {
    title: 'טירת נוישוונשטיין',
    keywords: ['צריחים', 'אגדות', 'בוואריה', 'יער']
  },
  'chichen_itza_pyramid': {
    title: 'פירמידת המאיה בצ\'יצ\'ן איצה',
    keywords: ['מדרגות', 'נחש', 'שמש', 'עתיק']
  },
  'western_wall': {
    title: 'הכותל המערבי בירושלים',
    keywords: ['פתקים', 'חריצים', 'אבנים', 'תפילה']
  },
  'igloo_ice_dome': {
    title: 'איגלו אסקימואי',
    keywords: ['קרח', 'קוטב', 'שלג', 'כפור']
  },
  'teepee_tent': {
    title: 'אוהל טיפי אינדיאני',
    keywords: ['נוצות', 'עשן', 'עור', 'שבט']
  },
  'military_cemetery': {
    title: 'בית עלמין צבאי',
    keywords: ['מצבות', 'דומיה', 'פרחים', 'זיכרון']
  },
  'concrete_bunker': {
    title: 'בונקר מבוצר',
    keywords: ['מחסה', 'מיגון', 'עובי', 'חרך']
  },
  'native_totem_pole': {
    title: 'טוטם מגולף',
    keywords: ['גילוף', 'כנפיים', 'שבט', 'צבע']
  },
  'russian_matryoshka': {
    title: 'בובת מטריושקה מעץ',
    keywords: ['שכבות', 'בובה', 'בטן', 'ציור']
  },
  'japanese_folding_fan': {
    title: 'מניפת משי מסורתית',
    keywords: ['רוח', 'משי', 'ריקוד', 'קפלים']
  },
  'chinese_pagoda': {
    title: 'פגודה אסייתית מסורתית',
    keywords: ['גגות', 'מקדש', 'פעמונים', 'קומות']
  },
  'neon_motel_sign': {
    title: 'שלט ניאון וינטג\'',
    keywords: ['זוהר', 'לילה', 'כביש', 'הבהוב']
  },

  // Everyday & Items
  'asian_noodles_bowl': {
    title: 'קערת איטריות',
    imageUrl: '/staged_images/pool/asian_noodles_bowl.jpg',
    keywords: ['מרק', 'ראמן', 'פסטה', 'מקלות']
  },
  'classic_cartoon_bomb': {
    title: 'פצצה',
    imageUrl: '/staged_images/pool/classic_cartoon_bomb.png',
    keywords: ['דדליין', 'דחוף', 'חירום', 'אזהרה']
  },
  'item_153_פצצה_שחורה_עגולה_עם_פתיל_בוער__מסמלת': {
    title: 'מגדלור בים סוער',
    imageUrl: '/staged_images/pool/lighthouse_stormy_sea.jpg',
    keywords: ['אלומה', 'ספינה', 'חוף', 'ניווט']
  },
  'farm_sheep': {
    title: 'כבשה צמרירית',
    keywords: ['עדר', 'רועה', 'מרעה', 'חלב']
  },
  'item_164_חץ_שלוח_פוגע_בול_במרכז_המטרה__מסמל': {
    title: 'חץ בלב המטרה',
    keywords: ['יעד', 'מכירות', 'הצלחה', 'קליעה']
  },
  'item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל': {
    title: 'מד חום כספית',
    keywords: ['טמפרטורה', 'כספית', 'חום', 'אש']
  },
  'item_168_קוביות_משחק__עם_הנקודות_1_6___מסמלות': {
    title: 'קוביות שש-בש',
    keywords: ['הימור', 'מזל', 'שולחן', 'נקודות']
  },
  'item_171_שריר_זרוע_נפוח_ומכופף__אמוג_י_שריר___מסמל': {
    title: 'שריר זרוע מנופח',
    keywords: ['משקולות', 'כוח', 'אימון', 'עוצמה']
  },
  'item_177_סימן_קריאה_בתוך_משולש_צהוב__מסמל': {
    title: 'סימן קריאה באזהרה',
    keywords: ['זהירות', 'סכנה', 'דחוף', 'דריכות']
  },
  'item_178_גולגולת_עם_שתי_עצמות_מוצלבות__מסמלת': {
    title: 'גולגולת ועצמות מוצלבות',
    keywords: ['רעל', 'פיראטים', 'מוות', 'סכנה']
  },
  'item_183_עלה_תלתן_בעל_ארבעה_עלים__מסמל': {
    title: 'תלתן ארבעה עלים',
    keywords: ['מזל', 'ירוק', 'הגרלה', 'נדיר']
  },
  'item_184_מלאך_קטן_עם_חץ_וקשת__קופידון___מסמל': {
    title: 'קופידון מלאך האהבה',
    keywords: ['רומנטיקה', 'חיצים', 'לבבות', 'התאהבות']
  },
  'item_185_מלאך_שטן_קטן_על_הכתף__עם_קלשון___מסמל': {
    title: 'מלאך ושטן על הכתף',
    keywords: ['מצפון', 'דילמה', 'פיתוי', 'מוסר']
  },
  'item_186_טביעת_אצבע_שחורה__דיו___מסמלת': {
    title: 'טביעת אצבע שחורה',
    keywords: ['בילוש', 'ראיות', 'זיהוי', 'חקירה']
  },
  'item_187_עקבות_רגליים_בחול__מסמלות': {
    title: 'עקבות בחול הים',
    keywords: ['צעדים', 'חוף', 'הליכה', 'שבילים']
  },
  'item_188_שבב_אלקטרוני__צ_יפ_ירוק_עם_פסי_זהב___מסמל': {
    title: 'שבב אלקטרוני (צ\'יפ)',
    keywords: ['מעבד', 'סיליקון', 'מעגל', 'מחשוב']
  },
  'item_189_פאזל__חתיכה_אחת_חסרה___מסמלת': {
    title: 'פאזל עם חתיכה חסרה',
    keywords: ['פתרון', 'הרכבה', 'משחק', 'חשיבה']
  },
  'item_190_סיכת_נעץ_משרדית__אדומה___מסמלת': {
    title: 'נעץ משרדי אדום',
    keywords: ['מודעות', 'פתק', 'תזכורת', 'לוח']
  },
  'item_215_כבאית_אדומה': {
    title: 'כבאית אש',
    keywords: ['אש', 'זרנוק', 'סולם', 'חילוץ']
  },
  'item_228_סקייטבורד': {
    title: 'סקייטבורד רחוב',
    keywords: ['גלגלים', 'מעקה', 'קפיצה', 'רמפה']
  },
  'item_229_רולרבליידס': {
    title: 'רולרבליידס מהיר',
    keywords: ['החלקה', 'גלגליות', 'שבילים', 'קסדה']
  },
  'item_238_קייאק': {
    title: 'קייאק נהרות',
    keywords: ['משוט', 'זרם', 'חתירה', 'אגם']
  },
  'item_247_משאית_סמי_טריילר_אמריקאית': {
    title: 'משאית הובלה',
    keywords: ['מובילים', 'ארגזים', 'דירה', 'שינוע']
  },
  'item_270_קנגורו': {
    title: 'קנגורו אוסטרלי',
    keywords: ['כיס', 'קפיצות', 'אוסטרליה', 'ערבות']
  },
  'item_301_כדורגל_קלאסי': {
    title: 'כדורגל קלאסי',
    keywords: ['דשא', 'מגרש', 'אימון', 'שער']
  },
  'item_303_כדור_טניס': {
    title: 'כדור טניס צהוב',
    keywords: ['רשת', 'הגשה', 'משטח', 'אימון']
  },
  'item_304_מחבט_טניס': {
    title: 'מחבט טניס',
    keywords: ['גידים', 'הנפה', 'רשת', 'משחק']
  },
  'item_305_כדור_פוטבול_אמריקאי': {
    title: 'כדור פוטבול',
    keywords: ['תפיסה', 'שריון', 'טאצדאון', 'אימון']
  },
  'item_308_מחבט_בייסבול': {
    title: 'מחבט בייסבול',
    keywords: ['חבטה', 'עץ', 'בסיס', 'הגשה']
  },
  'item_309_כדור_נוצה': {
    title: 'נוצת בדמינטון',
    keywords: ['מעופף', 'נוצות', 'רשת', 'חבטה']
  },
  'item_310_זוג_כפפות_אגרוף': {
    title: 'כפפות אגרוף אדומות',
    keywords: ['זירה', 'נוקאאוט', 'חבטה', 'שק']
  },
  'item_311_הטבעות_האולימפיות__חמש_טבעות_צבעוניות_שלובות': {
    title: 'טבעות אולימפיות',
    keywords: ['מדליה', 'אליפות', 'גביע', 'תחרות']
  },
  'item_314_גלשן_גלים': {
    title: 'גלשן גלים',
    keywords: ['גלישה', 'ים', 'גלים', 'סנפיר']
  },
  'item_317_משרוקית_שופט': {
    title: 'משרוקית שיפוט',
    keywords: ['צפצוף', 'שיפוט', 'עבירה', 'הפסקה']
  },
  'item_318_כרטיס_אדום_וצהוב': {
    title: 'כרטיס אדום וצהוב',
    keywords: ['הרחקה', 'עבירה', 'אזהרה', 'שיפוט']
  },
  'item_319_חליפת_קראטה_ג_ודו': {
    title: 'חליפת ג\'ודו וקראטה',
    keywords: ['חגורה', 'מזרן', 'קרב', 'הטלה']
  },
  'item_320_נעלי_פקקים': {
    title: 'נעלי פקקים למגרש',
    keywords: ['דשא', 'מסירה', 'ריצה', 'שרוכים']
  },
  'item_331_משקפת_שחייה_ומצוף_זרוע': {
    title: 'משקפת שחייה ומצוף',
    keywords: ['בריכה', 'כלור', 'צלילה', 'מים']
  },
  'item_333_רשת_כדורגל_נטויה': {
    title: 'שער ורשת כדורגל',
    keywords: ['קורות', 'בעיטה', 'רשת', 'מגרש']
  },
  'item_342_פריזבי': {
    title: 'צלחת פריזבי',
    keywords: ['תעופה', 'חוף', 'זריקה', 'מסירה']
  },
  'item_364_נר_דולק_נוטף_שעווה': {
    title: 'נר דולק בשעווה',
    keywords: ['להבה', 'שעווה', 'חושך', 'אור']
  },
  'item_408_הלוגו_של_נייק__swoosh_': {
    title: 'לוגו סווש נייקי',
    keywords: ['סניקרס', 'מותג', 'אימון', 'ריצה']
  },
  'item_416_פטיש_שופטים': {
    title: 'פטיש שופטים',
    keywords: ['פסק-דין', 'הרשעה', 'דיון', 'בית-משפט']
  },
  'item_422_כרטיס_אדום': {
    title: 'כרטיס הרחקה',
    keywords: ['הרחקה', 'עבירה', 'שיפוט', 'הפסקה']
  },
  'item_468_מייקל_ג_ורדן__צללית_ה_jumpman_': {
    title: 'מייקל ג\'ורדן ג\'מפמן',
    keywords: ['כדור', 'אדום', 'אימון', 'סל']
  },
  'item_470_מדליית_זהב': {
    title: 'מדליית זהב אולימפית',
    keywords: ['ניצחון', 'גביע', 'פודיום', 'הישג']
  },
  'item_473_כדור_טניס_ירוק_זוהר': {
    title: 'כדור טניס זוהר',
    keywords: ['רשת', 'משטח', 'אימון', 'חבטה']
  },
  'item_475_חגורה_שחורה_באומנויות_לחימה': {
    title: 'חגורה שחורה באמנויות לחימה',
    keywords: ['דאן', 'מאסטר', 'מזרן', 'קרב']
  }
};

// 1. Update public/data/user_curation_state.json
const statePath = 'public/data/user_curation_state.json';
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const localEdits = state.localEdits || {};

// Clean up dirty edits in localEdits
for (const [id, ovr] of Object.entries(PRISTINE_OVERRIDE_MAP)) {
  if (localEdits[id]) {
    localEdits[id] = {
      ...localEdits[id],
      title: ovr.title,
      keywords: [...ovr.keywords]
    };
    if (ovr.imageUrl) localEdits[id].imageUrl = ovr.imageUrl;
  }
}

// Purge any remaining localEdits that contain root overlaps or multi-word
for (const [id, edit] of Object.entries(localEdits)) {
  const itemTitle = edit.title || '';
  const overlaps = validateBranches(itemTitle, edit.keywords || []);
  if (overlaps.length > 0) {
    const badSet = new Set(overlaps.map(o => o.branch));
    edit.keywords = edit.keywords.filter(k => !badSet.has(k) && !k.includes(' '));
  }
  edit.keywords = (edit.keywords || []).filter(k => !k.includes(' ')).slice(0, 4);
}

state.localEdits = localEdits;
fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
console.log('user_curation_state.json cleaned.');

// 2. Load and sanitize CURATED_USER_REPOSITORY_SEED
const seedPath = 'src/data/curatedUserRepositorySeed.js';
let seedModule = await import('../src/data/curatedUserRepositorySeed.js');
let seedItems = [...seedModule.CURATED_USER_REPOSITORY_SEED];

for (const item of seedItems) {
  if (PRISTINE_OVERRIDE_MAP[item.id]) {
    const p = PRISTINE_OVERRIDE_MAP[item.id];
    item.title = p.title;
    item.name = p.title;
    item.keywords = [...p.keywords];
    item.association = p.keywords.join(', ');
    if (p.imageUrl) item.imageUrl = p.imageUrl;
  }

  // Automatic cleanup
  const overlaps = validateBranches(item.title, item.keywords || []);
  if (overlaps.length > 0) {
    const badSet = new Set(overlaps.map(o => o.branch));
    item.keywords = item.keywords.filter(k => !badSet.has(k) && !k.includes(' '));
  }
  item.keywords = item.keywords.filter(k => !k.includes(' ') && !['ספורט', 'גול', 'שבת', 'לנקות'].includes(k)).slice(0, 4);
  item.association = item.keywords.join(', ');
}

const seedContent = `export const CURATED_USER_REPOSITORY_SEED = ${JSON.stringify(seedItems, null, 2)};\n`;
fs.writeFileSync(seedPath, seedContent, 'utf8');
console.log('curatedUserRepositorySeed.js updated.');

// 3. Update AUDITED_VERIFIED_POOL in auditedImagesPool.js
const auditPath = 'src/data/auditedImagesPool.js';
const auditModule = await import('../src/data/auditedImagesPool.js');
let verifiedPool = [...auditModule.AUDITED_VERIFIED_POOL];

for (const item of verifiedPool) {
  if (PRISTINE_OVERRIDE_MAP[item.id]) {
    const p = PRISTINE_OVERRIDE_MAP[item.id];
    item.title = p.title;
    item.name = p.title;
    item.keywords = [...p.keywords];
    item.associations = [...p.keywords];
    item.association = p.keywords.join(', ');
    if (p.imageUrl) item.imageUrl = p.imageUrl;
  }

  const overlaps = validateBranches(item.title, item.keywords || []);
  if (overlaps.length > 0) {
    const badSet = new Set(overlaps.map(o => o.branch));
    item.keywords = item.keywords.filter(k => !badSet.has(k) && !k.includes(' '));
  }
  item.keywords = item.keywords.filter(k => !k.includes(' ') && !['ספורט', 'גול', 'שבת', 'לנקות'].includes(k)).slice(0, 4);
  item.associations = [...item.keywords];
  item.association = item.keywords.join(', ');
}

const auditContent = `export const AUDITED_REJECTED_POOL = ${JSON.stringify(auditModule.AUDITED_REJECTED_POOL, null, 2)};\n\nexport const AUDITED_REPLACED_LOG = ${JSON.stringify(auditModule.AUDITED_REPLACED_LOG, null, 2)};\n\nexport const AUDITED_VERIFIED_POOL = ${JSON.stringify(verifiedPool, null, 2)};\n`;
fs.writeFileSync(auditPath, auditContent, 'utf8');
console.log('auditedImagesPool.js updated.');

// 4. Update STAGED_IMAGES_POOL in stagedImagesPool.js
const stagedPath = 'src/data/stagedImagesPool.js';
const stagedModule = await import('../src/data/stagedImagesPool.js');
let stagedPool = [...stagedModule.STAGED_IMAGES_POOL];

for (const item of stagedPool) {
  if (PRISTINE_OVERRIDE_MAP[item.id]) {
    const p = PRISTINE_OVERRIDE_MAP[item.id];
    item.title = p.title;
    item.name = p.title;
    item.suggestedName = p.title;
    item.keywords = [...p.keywords];
    item.associations = [...p.keywords];
    item.everyday_associations = [...p.keywords];
    item.association = p.keywords.join(', ');
    if (p.imageUrl) item.imageUrl = p.imageUrl;
  }

  const currentKw = item.keywords || item.associations || [];
  const overlaps = validateBranches(item.title || item.suggestedName || '', currentKw);
  if (overlaps.length > 0) {
    const badSet = new Set(overlaps.map(o => o.branch));
    const filtered = currentKw.filter(k => !badSet.has(k) && !k.includes(' '));
    item.keywords = filtered.slice(0, 4);
    item.associations = [...item.keywords];
    item.everyday_associations = [...item.keywords];
  }
}

const stagedContent = `export const STAGED_IMAGES_POOL = ${JSON.stringify(stagedPool, null, 2)};\n`;
fs.writeFileSync(stagedPath, stagedContent, 'utf8');
console.log('stagedImagesPool.js updated.');
