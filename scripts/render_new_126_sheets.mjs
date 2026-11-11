import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const POOL_DIR = path.resolve('public/staged_images/pool');
const OUT_DIR = path.resolve('scripts/sheets');
fs.mkdirSync(OUT_DIR, { recursive: true });

// Load all 128 replaced files + portrait files to check their 280x170 card crop
const filesToCheck = [
  'mickey_mouse.jpg', 'statue_of_liberty_ny.jpg', 'cave_painting_bison.jpg', 'star_of_david.jpg',
  'item_151_נורה_דולקת__מסמלת.jpg', 'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg', 'item_163_מאזני_צדק__שתי_כפות_מאוזנות___מסמלות.jpg', 'item_173_גלולת_תרופה__חצי_אדום_חצי_לבן___מסמלת.jpg',
  'item_201_לימוזינה_שחורה_ארוכה.jpg', 'item_202_מונית_צהובה_ניו_יורקית.jpg', 'item_204_רכבת_קיטור_ישנה.jpg', 'item_206_ספינת_פיראטים.jpg',
  'item_209_גונדולה_ונציאנית.jpg', 'item_212_צוללת_צהובה.jpg', 'item_217_כרכרת_סוסים_מלכותית.jpg', 'item_219_קטנוע_וספה_איטלקי.jpg',
  'item_220_ספינת_טיטאניק.jpg', 'item_223_קורקינט_פשוט_לילדים.jpg', 'item_225_רכבת_קליע_יפנית.jpg', 'item_226_הליקופטר_צבאי.jpg',
  'item_227_רכב_שטח_מפלצתי.jpg', 'item_230_רכב_שלג.jpg', 'item_231_מפרשית___יאכטה_לבנה.jpg', 'item_232_רכב_גולף_קטן.jpg',
  'item_248_רכב_קמפינג.jpg', 'item_249_רכב_גופה.jpg', 'item_250_עגלת_תינוק_קלאסית.jpg', 'item_251_קקטוס_סאגוארו.jpg',
  'item_260_קרחון_בלב_ים.jpg', 'item_262_מכתש_ברק___פגיעת_ברק.jpg', 'item_266_סוס_דוהרת_ברוח.jpg', 'item_278_פרח_חמנייה.jpg',
  'item_279_ורד_אדום.jpg', 'item_280_עלה_מייפל.jpg', 'item_287_צונאמי.jpg', 'item_288_מדבר_חול.jpg',
  'item_290_ביצה.jpg', 'item_292_כוכב_ים.jpg', 'item_293_סרטן.jpg', 'item_294_תמנון.jpg',
  'item_295_זיקית_על_ענף.jpg', 'item_297_עקרב.jpg', 'item_300_שפירית.jpg', 'item_301_כדורגל_קלאסי.jpg',
  'item_302_כדורסל.jpg', 'item_307_כדור_ביליארד.jpg', 'item_308_מחבט_בייסבול.jpg', 'item_310_זוג_כפפות_אגרוף.jpg',
  'item_311_הטבעות_האולימפיות__חמש_טבעות_צבעוניות_שלובות.jpg', 'item_315_משקולת_ברזל_קלאסית.jpg', 'item_316_חץ_ולוח_מטרה.jpg', 'item_317_משרוקית_שופט.jpg',
  'item_318_כרטיס_אדום_וצהוב.jpg', 'item_320_נעלי_פקקים.jpg', 'item_322_רולטה_קזינו.jpg', 'item_324_ז_יטונים_של_קזינו.jpg',
  'item_325_קובייה_הונגרית.jpg', 'item_326_חייל_שחמט.jpg', 'item_328_חתיכת_פאזל_קלאסית.jpg', 'item_329_יו_יו.jpg',
  'item_331_משקפת_שחייה_ומצוף_זרוע.jpg', 'item_333_רשת_כדורגל_נטויה.jpg', 'item_334_פודטראק.jpg', 'item_338_מדורה_עם_שיפודי_מרשמלו.jpg',
  'item_339_מצנח_רחיפה.jpg', 'item_344_דוכן_פופקורן_קולנוע.jpg', 'item_348_משחק_טטריס.jpg', 'item_349_מגלשת_מים_ענקית.jpg',
  'item_350_מצנח_פתוח_בשמיים.jpg', 'item_351_פטיש_מסמרים_קלאסי.jpg', 'item_355_מטרייה_שחורה_פתוחה.jpg', 'item_356_מפתח_שוודי.jpg',
  'item_358_מטאטא_ומגרוד.jpg', 'item_359_סולם_מתקפל.jpg', 'item_362_פחית_שימורים_חצי_פתוחה.jpg', 'item_363_בקבוק_ייין_ופותחן_חולץ_פקקים.jpg',
  'item_364_נר_דולק_נוטף_שעווה.jpg', 'item_365_פנס_כיס_דולק.jpg', 'item_368_מברשת_שיניים_ומשחה.jpg', 'item_372_מראת_יד_עגולה.jpg',
  'item_375_קולב_בגדים.jpg', 'item_376_מגהץ_אדים.jpg', 'item_378_מחט_וחוט.jpg', 'item_381_סרט_מדידה_צהוב.jpg',
  'item_382_פנקס_רשימות_ספירלה.jpg', 'item_383_עט_כדורי_פשוט.jpg', 'item_385_מחדד_מתכת_קטן.jpg', 'item_389_סל_כביסה_פלסטיק.jpg',
  'item_391_מזלג_גינה.jpg', 'item_393_מריצה.jpg', 'item_394_עציץ_חרס_חום.jpg', 'item_396_ארגז_כלים_אדום.jpg',
  'item_405_שרק.jpg', 'item_408_הלוגו_של_נייק__swoosh_.jpg', 'item_409_הפחיות_של_קוקה_קולה.jpg', 'item_411_הארי_פוטר.jpg',
  'item_412_שרלוק_הולמס.jpg', 'item_414_לגו.jpg', 'item_415_הסימפסונים.jpg', 'item_422_כרטיס_אדום.jpg',
  'item_423_משקולת_ברזל__dumbbell_.jpg', 'item_425_קופת_חיסכון_בצורת_חזיר.jpg', 'item_428_קביים.jpg', 'item_442_פסל_דוד__מיכלאנג_לו_.jpg',
  'item_443_הקוליסאום.jpg', 'item_445_הבית_הלבן.jpg', 'item_447_פסל_ישו_הגואל_בריו.jpg', 'item_453_ברק_בשמיים.jpg',
  'item_459_יונה_לבנה_עם_עלה_זית.jpg', 'item_460_ינשוף.jpg', 'item_465_קרחון__iceberg_.jpg', 'item_470_מדליית_זהב.jpg',
  'item_476_שחמט__כלי_המלך_או_הרץ_.jpg', 'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg', 'item_480_פרש_הברונזה___אביר_על_סוס_לבן.jpg', 'item_481_הצלב_הנוצרי.jpg',
  'item_484_בודהה_מחייך.jpg', 'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg', 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', 'item_490_טביעת_אצבע_שחורה.jpg',
  'item_492_צלחת_לוויין.jpg', 'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg', 'alexander_graham_bell.jpg',
  'authentic_barbie_doll.jpg', 'authentic_sonic_the_hedgehog.jpg', 'authentic_super_mario.jpg'
];

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const perSheet = 25;
const numSheets = Math.ceil(filesToCheck.length / perSheet);

for (let s = 0; s < numSheets; s++) {
  const chunk = filesToCheck.slice(s * perSheet, (s + 1) * perSheet);
  const cards = chunk.map((file, idx) => {
    const absPath = 'file:///' + path.join(POOL_DIR, file).replace(/\\/g, '/');
    return `
      <div class="card">
        <div class="img-wrap">
          <img src="${absPath}" />
        </div>
        <div class="label">[${s * perSheet + idx}] ${file}</div>
      </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <style>
      body { margin: 0; padding: 10px; background: #0f172a; font-family: Arial, sans-serif; display: grid; grid-template-columns: repeat(5, 280px); gap: 10px; }
      .card { background: #1e293b; border: 1px solid #334155; border-radius: 6px; overflow: hidden; }
      .img-wrap { width: 280px; height: 170px; overflow: hidden; background: #000; }
      .img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .label { color: #f8fafc; font-size: 11px; padding: 4px 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 22px; }
    </style>
  </head>
  <body>${cards}</body>
  </html>`;

  const htmlPath = path.join(OUT_DIR, `verify_${s + 1}.html`);
  const pngPath = path.join(OUT_DIR, `verify_${s + 1}.png`);
  fs.writeFileSync(htmlPath, html, 'utf8');

  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  execSync(`"${EDGE}" --headless --disable-gpu --window-size=1480,1080 --screenshot="${pngPath}" "${fileUrl}"`, { stdio: 'ignore' });
  console.log(`Rendered verify_${s + 1}.png`);
}

