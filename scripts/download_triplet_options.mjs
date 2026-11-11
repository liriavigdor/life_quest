import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/staged_images/options');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 30 remaining items with targeted search terms and curated everyday associations
const REMAINING_ITEMS = [
  {
    id: 'batman',
    name: 'באטמן',
    topic: 'fictional',
    searchTerms: ['Batman figure', 'Batman statue', 'Batman DC Comics'],
    curatedKeywords: ['מפתחות של הרכב', 'לנעול את האוטו', 'מוסך וטיפול שנתי', 'לבדוק תריסים בלילה', 'פנס חירום', 'חושך', 'שחור', 'מערה', 'עטלף']
  },
  {
    id: 'superman',
    name: 'סופרמן',
    topic: 'fictional',
    searchTerms: ['Superman statue', 'Superman figure', 'Superman DC'],
    curatedKeywords: ['בדיקת דם ורופא', 'להגן על הבית', 'לנעול את הדלת', 'עזרה לשכן', 'בגדי כביסה', 'גלימה אדומה', 'חזק', 'לעוף']
  },
  {
    id: 'spiderman',
    name: 'ספיידרמן',
    topic: 'fictional',
    searchTerms: ['Spider-Man statue', 'Spider-Man figure', 'Spider-Man Marvel'],
    curatedKeywords: ['תיק גב לדרך', 'להיזהר בדרכים', 'גמישות וכושר', 'עזרה למשפחה', 'עכביש', 'רשת', 'קפיצה', 'אדום וכחול']
  },
  {
    id: 'super_mario',
    name: 'סופר מריו',
    topic: 'fictional',
    searchTerms: ['Super Mario statue', 'Mario Nintendo statue', 'Super Mario figure'],
    curatedKeywords: ['אינסטלציה ותיקון ברז', 'קניות פטריות וירקות', 'קפיצה למכולת', 'כובע אדום', 'שפם', 'סרבל כחול', 'צינור']
  },
  {
    id: 'pikachu',
    name: 'פיקאצ\'ו',
    topic: 'fictional',
    searchTerms: ['Pikachu statue', 'Pikachu Pokemon mascot', 'Pikachu figure'],
    curatedKeywords: ['להטעין סוללות', 'חשבון חשמל', 'מטען לטלפון', 'סוללה ניידת', 'חשמל', 'צהוב', 'ברק', 'חמוד']
  },
  {
    id: 'homer_simpson',
    name: 'הומר סימפסון',
    topic: 'fictional',
    searchTerms: ['Homer Simpson figure', 'Homer Simpson statue', 'Homer Simpson sculpture'],
    curatedKeywords: ['קניות בסופר', 'לקנות דונאטס ולחם', 'לנוח בספה', 'לשלם חשבונות', 'צהוב', 'טלוויזיה', 'עבודה']
  },
  {
    id: 'shrek',
    name: 'שרק',
    topic: 'fictional',
    searchTerms: ['Shrek figure', 'Shrek statue', 'Shrek DreamWorks'],
    curatedKeywords: ['לטפל בגינה', 'להוריד זבל', 'מקלחת חמה', 'לנקות נעליים', 'ירוק', 'ביצה', 'ענק', 'חמור']
  },
  {
    id: 'yoda',
    name: 'יודה',
    topic: 'fictional',
    searchTerms: ['Yoda statue', 'Yoda figure Star Wars', 'Yoda sculpture'],
    curatedKeywords: ['שיעור ולימודים', 'מדיטציה ורוגע', 'להקשיב בסבלנות', 'ירוק', 'חוכמה', 'זקן', 'אוזניים']
  },
  {
    id: 'the_joker',
    name: 'הג\'וקר',
    topic: 'fictional',
    searchTerms: ['Joker statue', 'Joker figure Batman', 'Joker costume'],
    curatedKeywords: ['בדיקת שיניים ורופא', 'חיוך למרות הקושי', 'כרטיס לסטנדאפ', 'איפור', 'ירוק וסגול', 'צחוק', 'קלף']
  },
  {
    id: 'sherlock_holmes',
    name: 'שרלוק הולמס',
    topic: 'fictional',
    searchTerms: ['Sherlock Holmes statue', 'Sherlock Holmes museum', 'Sherlock Holmes sculpture'],
    curatedKeywords: ['איפה המפתחות?', 'למצוא חפץ שאבד', 'לקרוא חוזה משפטי', 'כובע בלש', 'זכוכית מגדלת', 'מקטרת']
  },
  {
    id: 'gandalf',
    name: 'גנדלף',
    topic: 'fictional',
    searchTerms: ['Gandalf statue', 'Gandalf figure', 'Gandalf sculpture'],
    curatedKeywords: ['טיול ברגל', 'מקל הליכה', 'עצה מאדם חכם', 'סבלנות', 'זקן לבן', 'גלימה אפורה', 'כובע מחודד']
  },
  {
    id: 'gollum',
    name: 'גולום',
    topic: 'fictional',
    searchTerms: ['Gollum statue', 'Gollum sculpture', 'Gollum figure'],
    curatedKeywords: ['לא לאבד את הטבעת!', 'לשמור על חפצים יקרים', 'ארנק וכרטיס אשראי', 'מערה', 'עיניים גדולות']
  },
  {
    id: 'frankenstein_monster',
    name: 'המפלצת של פרנקנשטיין',
    topic: 'fictional',
    searchTerms: ['Frankenstein monster statue', 'Frankenstein illustration', 'Boris Karloff Frankenstein'],
    curatedKeywords: ['תור לרופא מומחה', 'לקחת תרופות', 'לתקן מכשיר מקולקל', 'ברגים', 'גבוה', 'ירוק']
  },
  {
    id: 'michael_jordan',
    name: 'מייקל ג\'ורדן',
    topic: 'celebrities',
    searchTerms: ['Michael Jordan 1998', 'Michael Jordan statue Chicago', 'Michael Jordan basketball'],
    curatedKeywords: ['אימון כושר', 'נעלי ספורט', 'לשתות מים', 'משחק כדורסל', 'מספר 23', 'קפיצה לגובה']
  },
  {
    id: 'bill_gates',
    name: 'ביל גייטס',
    topic: 'celebrities',
    searchTerms: ['Bill Gates portrait', 'Bill Gates 2018', 'Bill Gates 2021'],
    curatedKeywords: ['לשלם מיסים', 'לעדכן תוכנה', 'מחשב נייד', 'לקרוא ספר', 'משקפיים', 'הייטק']
  },
  {
    id: 'charlie_chaplin',
    name: 'צ\'ארלי צ\'פלין',
    topic: 'celebrities',
    searchTerms: ['Charlie Chaplin portrait', 'Charlie Chaplin statue', 'Charlie Chaplin film'],
    curatedKeywords: ['מטרייה ביציאה', 'נעליים נוחות', 'הצגת קולנוע', 'שפם קטן', 'מקל הליכה', 'מגבעת']
  },
  {
    id: 'cleopatra',
    name: 'קליאופטרה',
    topic: 'celebrities',
    searchTerms: ['Cleopatra bust', 'Cleopatra painting', 'Cleopatra sculpture'],
    curatedKeywords: ['תור לרופא עור / ספא', 'תכשיט יקר', 'טיפוח עצמי', 'מצרים', 'נחש', 'מלכה']
  },
  {
    id: 'freddie_mercury',
    name: 'פרדי מרקורי',
    topic: 'celebrities',
    searchTerms: ['Freddie Mercury statue Montreux', 'Freddie Mercury 1986', 'Freddie Mercury live'],
    curatedKeywords: ['כרטיס להופעה', 'לחגוג הצלחה', 'שירה ומוזיקה', 'שפם', 'חליפה לבנה', 'מיקרופון']
  },
  {
    id: 'usain_bolt',
    name: 'יוסיין בולט',
    topic: 'celebrities',
    searchTerms: ['Usain Bolt celebration', 'Usain Bolt Rio', 'Usain Bolt Berlin'],
    curatedKeywords: ['למהר לפגישה', 'לא לאחר!', 'ריצה מהירה', 'אימון ספרינט', 'נעלי ריצה', 'מדליית זהב']
  },
  {
    id: 'winston_churchill',
    name: 'וינסטון צ\'רצ\'יל',
    topic: 'celebrities',
    searchTerms: ['Winston Churchill portrait', 'Winston Churchill 1941', 'Winston Churchill statue'],
    curatedKeywords: ['סבלנות במשימה', 'להתמיד ולא להישבר', 'כוס תה חם', 'מכתב לשלוח', 'סיגר', 'עניבת פרפר']
  },
  {
    id: 'statue_of_liberty',
    name: 'פסל החירות',
    topic: 'associative',
    searchTerms: ['Statue of Liberty New York', 'Statue of Liberty torch', 'Statue of Liberty close'],
    curatedKeywords: ['חידוש דרכון', 'כרטיסי טיסה', 'יציאה לחופשה', 'יום חופש', 'לפיד', 'ניו יורק', 'פסל ירוק']
  },
  {
    id: 'the_scream',
    name: 'הצעקה (אדוורד מונק)',
    topic: 'associative',
    searchTerms: ['The Scream Munch', 'Edvard Munch The Scream', 'The Scream 1893'],
    curatedKeywords: ['תור דחוף לרופא', 'לא להילחץ!', 'להרגיע לחצים', 'לשלם דוח וקנס', 'צעקה', 'שמיים כתומים', 'גשר']
  },
  {
    id: 'titanic',
    name: 'הטיטאניק',
    topic: 'associative',
    searchTerms: ['Titanic sea trials', 'RMS Titanic departure', 'Titanic historical ship'],
    curatedKeywords: ['להיזהר מהוצאה גדולה', 'ביטוח רכב ודירה', 'כרטיס שיט', 'ספינה ענקית', 'קרחון', 'אוקיינוס']
  },
  {
    id: 'colosseum',
    name: 'הקולוסיאום',
    topic: 'associative',
    searchTerms: ['Colosseum Rome exterior', 'Colosseum Italy sunset', 'Colosseum architecture'],
    curatedKeywords: ['כרטיסים למשחק ספורט', 'הופעה באצטדיון', 'אימון אינטנסיבי', 'רומא', 'אבנים', 'עתיק']
  },
  {
    id: 'taj_mahal',
    name: 'הטאג\' מהאל',
    topic: 'associative',
    searchTerms: ['Taj Mahal front', 'Taj Mahal reflections', 'Taj Mahal dome'],
    curatedKeywords: ['יום נישואין', 'מתנה רומנטית', 'פרחים לקנות', 'ארוחה חגיגית', 'שיש לבן', 'הודו', 'כיפה']
  },
  {
    id: 'compass',
    name: 'מצפן עתיק',
    topic: 'associative',
    searchTerms: ['Antique compass', 'Vintage brass compass', 'Navigation compass'],
    curatedKeywords: ['וויז וניווט בדרכים', 'למצוא כתובת', 'הכוונה וייעוץ', 'טיול בשבת', 'מחט מגנטית', 'צפון']
  },
  {
    id: 'treasure_chest',
    name: 'תיבת אוצר',
    topic: 'associative',
    searchTerms: ['Pirate treasure chest', 'Wooden treasure chest gold', 'Open treasure chest'],
    curatedKeywords: ['להוציא כסף בכספומט', 'לחסוך כסף', 'ארנק וכרטיס אשראי', 'חשבון בנק', 'מטבעות זהב', 'מנעול']
  },
  {
    id: 'trojan_horse',
    name: 'סוס טרויאני',
    topic: 'associative',
    searchTerms: ['Trojan horse Troy Turkey', 'Trojan Horse model', 'Trojan horse sculpture'],
    curatedKeywords: ['להיזהר מהודעת פישינג', 'לשנות סיסמה', 'חבילה לאסוף מהדואר', 'סוס עץ', 'יוון']
  },
  {
    id: 'shield',
    name: 'מגן אבירים',
    topic: 'associative',
    searchTerms: ['Medieval shield heraldic', 'Knight shield metal', 'Ancient round shield'],
    curatedKeywords: ['ביטוח בריאות', 'מנעול חדש לדלת', 'קסדה לאופניים', 'אבטחת מידע', 'מגן ברזל', 'הגנה']
  },
  {
    id: 'newtons_cradle',
    name: 'מטוטלת ניוטון',
    topic: 'associative',
    searchTerms: ['Newton\'s cradle in action', 'Newton cradle steel balls', 'Newton\'s cradle desk'],
    curatedKeywords: ['סדר יום קבוע', 'הרגלים טובים', 'שעון מעורר בבוקר', 'כדורי מתכת', 'תנועה']
  }
];

async function searchCommonsImages(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=6&prop=pageimages&pithumbsize=800&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'LifeQuestApp/2.0' } });
  if (!res.ok) return [];
  const data = await res.json();
  const pages = Object.values(data.query?.pages || {});
  return pages.map(p => p.thumbnail?.source).filter(Boolean);
}

async function downloadFile(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': 'LifeQuestApp/2.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1000) throw new Error('File too small');
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function run() {
  console.log(`Starting 3-option downloader for ${REMAINING_ITEMS.length} items...`);
  const finalTriplets = [];

  for (let i = 0; i < REMAINING_ITEMS.length; i++) {
    const item = REMAINING_ITEMS[i];
    console.log(`\n[${i+1}/${REMAINING_ITEMS.length}] Processing ${item.name} (${item.id})...`);

    const imageOptions = [];
    const existingFile = path.resolve(__dirname, `../public/staged_images/${item.id}.jpg`);

    // Check if we already have option 1, 2, 3
    for (let optIdx = 1; optIdx <= 3; optIdx++) {
      const dest = path.join(targetDir, `${item.id}_opt${optIdx}.jpg`);
      const webUrl = `/staged_images/options/${item.id}_opt${optIdx}.jpg`;

      if (fs.existsSync(dest) && fs.statSync(dest).size > 1500) {
        imageOptions.push(webUrl);
      }
    }

    // If options are missing, fetch distinct image URLs
    if (imageOptions.length < 3) {
      const candidateUrls = new Set();

      // Gather candidate URLs from search terms
      for (const term of item.searchTerms) {
        if (candidateUrls.size >= 5) break;
        try {
          const results = await searchCommonsImages(term);
          results.forEach(u => candidateUrls.add(u));
        } catch (e) {
          console.warn(`Commons query failed for ${term}:`, e.message);
        }
        await new Promise(r => setTimeout(r, 150));
      }

      const urlList = Array.from(candidateUrls);
      let optIndex = imageOptions.length + 1;

      for (const imgUrl of urlList) {
        if (optIndex > 3) break;
        const dest = path.join(targetDir, `${item.id}_opt${optIndex}.jpg`);
        const webUrl = `/staged_images/options/${item.id}_opt${optIndex}.jpg`;

        try {
          const size = await downloadFile(imgUrl, dest);
          console.log(`✓ Saved option ${optIndex} for ${item.id} (${size} B)`);
          imageOptions.push(webUrl);
          optIndex++;
        } catch (err) {
          console.warn(`! Failed option ${optIndex} for ${item.id}:`, err.message);
        }
      }

      // If still fewer than 3, fallback using existing staged file or duplicate
      while (imageOptions.length < 3) {
        const nextIdx = imageOptions.length + 1;
        const dest = path.join(targetDir, `${item.id}_opt${nextIdx}.jpg`);
        const webUrl = `/staged_images/options/${item.id}_opt${nextIdx}.jpg`;

        if (fs.existsSync(existingFile) && fs.statSync(existingFile).size > 1500) {
          fs.copyFileSync(existingFile, dest);
          imageOptions.push(webUrl);
          console.log(`✓ Used existing image for option ${nextIdx} for ${item.id}`);
        } else if (imageOptions.length > 0) {
          imageOptions.push(imageOptions[0]);
        } else {
          break;
        }
      }
    }

    finalTriplets.push({
      id: item.id,
      suggestedName: item.name,
      topic: item.topic,
      curatedEverydayKeywords: item.curatedKeywords,
      imageOptions: imageOptions
    });
  }

  // Save the new triplet manifest
  const manifestPath = path.resolve(__dirname, '../src/data/stagedTripletPool.js');
  const code = `/**
 * Curated Staged Triplet Pool
 * כל פריט כולל 3 אופציות תמונה לבחירת המשתמש, ואסוציאציות יומיומיות מועילות מוכנות מראש.
 */

export const STAGED_TRIPLET_POOL = ${JSON.stringify(finalTriplets, null, 2)};
`;
  fs.writeFileSync(manifestPath, code, 'utf8');
  console.log(`\nDONE! Created staged triplet pool with ${finalTriplets.length} items at ${manifestPath}`);
}

run();
