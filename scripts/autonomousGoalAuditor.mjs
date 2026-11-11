import fs from 'fs';
import { processTaskListWithSynergy, extractTaskBranchKeyword, MNEMONIC_ANCHOR_CATALOG } from '../src/utils/mnemonicPipelineOrchestrator.js';

const TEST_LISTS = [
  {
    id: 1,
    name: 'מטלות בית ותחזוקה (House & Maintenance)',
    items: [
      'לנקות את הפילטר של המזגן',
      'להחליף נורה שרופה בסלון',
      'לתקן ברז דולף במטבח',
      'לצבוע את הקיר בחדר שינה',
      'לשאוב אבק מתחת למיטה'
    ]
  },
  {
    id: 2,
    name: 'ישויות, חיות מחמד וחברים (Named Entities, Pets, Friends)',
    items: [
      'להוריד את רקס לסיבוב',
      'לטייל עם שוקו בפארק',
      'לקנות עצם לטריקסי',
      'לפגוש את איתן לקפה',
      'להתקשר לנועה בערב'
    ]
  },
  {
    id: 3,
    name: 'קניות וסידורים יומיומיים (Shopping & Errands)',
    items: [
      'לקנות לחם מחמצת במאפייה',
      'לקחת חבילה מסניף הדואר',
      'לקנות שישיית מים מינרליים',
      'למסור חליפה לניקוי יבש',
      'לקנות מגן מסך חדש לאייפון'
    ]
  },
  {
    id: 4,
    name: 'משרד, עבודה ולימודים (Office, Work & Study)',
    items: [
      'להכין מצגת לפגישת הנהלה',
      'לשלוח דוח אקסל חודשי',
      'להדפיס מסמכים חתומים',
      'ללמוד למבחן בכלכלה',
      'לחדש את הדרכון במשרד הפנים'
    ]
  },
  {
    id: 5,
    name: 'רפואה ובריאות (Health & Medical)',
    items: [
      'למדוד חום עם מדחום',
      'לקבוע תור לרופא שיניים',
      'לקנות פלסטרים ופולידין בבית מרקחת',
      'לבלוע כדור נגד כאב ראש',
      'לעשות בדיקת דם בצום'
    ]
  },
  {
    id: 6,
    name: 'ספורט, כושר ופעילות גופנית (Sports & Fitness)',
    items: [
      'ללכת לאימון שחייה בבריכה',
      'לרוץ חצי שעה בפארק',
      'להרים משקולות בחדר כושר',
      'לעלות על קיר טיפוס',
      'לשחק כדורסל עם החבר\'ה'
    ]
  },
  {
    id: 7,
    name: 'בישול ואוכל (Cooking & Food)',
    items: [
      'לאכול גלידה וניל בגביע',
      'לאפות עוגת שוקולד יום הולדת',
      'לטגן חביתה עם בצל ופטריות',
      'להכין סיר מרק עוף חם',
      'להזמין פיצה משפחתית עם זיתים'
    ]
  },
  {
    id: 8,
    name: 'פנאי, משחקים ובידור (Gaming & Pop Culture)',
    items: [
      'לשחק בטורניר בייבלייד עם הילד',
      'לראות סרט בקולנוע עם פופקורן',
      'לשחק שחמט נגד המחשב',
      'להוריד משחק חדש בסוני פלייסטיישן',
      'לשיר קריוקי עם מיקרופון'
    ]
  },
  {
    id: 9,
    name: 'רכב ותחבורה (Automotive & Transport)',
    items: [
      'לשטוף את הרכב במכונה',
      'למלא אוויר בגלגלים',
      'לתדלק דלק 95 בתחנה',
      'להטעין את הרב-קו לנסיעה ברכבת',
      'לתקן פנצ\'ר באופניים'
    ]
  },
  {
    id: 10,
    name: 'טיולים וטבע (Outdoors & Nature)',
    items: [
      'לגלוש גלים בחוף הים',
      'להקים אוהל בקמפינג ביער',
      'לטפס על הר שלג עם מקלות הליכה',
      'להדליק מדורה ולקלות מרשמלו',
      'לצלם שקיעה בטיילת'
    ]
  },
  {
    id: 11,
    name: 'ביגוד והנעלה (Clothing & Shoes)',
    items: [
      'למדוד מכנסי ג\'ינס בחנות',
      'לקשור שרוכים בנעלי ספורט',
      'ללבוש מעיל חורף חם',
      'לחבוש כובע צמר לבסיס',
      'לקפל חולצות בארון'
    ]
  },
  {
    id: 12,
    name: 'טכנולוגיה וגאדג\'טים (Tech & Electronics)',
    items: [
      'להטעין את הסוללה של הלפטופ',
      'לחבר אוזניות אלחוטיות לבלוטות\'',
      'להחליף שלט לטלוויזיה בסלון',
      'לגבות תמונות לענן במחשב',
      'לקנות עכבר ארגונומי למשרד'
    ]
  },
  {
    id: 13,
    name: 'פיננסים ותשלומים (Finance & Bureaucracy)',
    items: [
      'לשלם חשבון ארנונה באתר',
      'למשוך מזומן מהכספומט בבנק',
      'להפקיד צ\'ק באפליקציה',
      'לבדוק חיובים בכרטיס אשראי',
      'להעביר כסף בביט לחבר'
    ]
  },
  {
    id: 14,
    name: 'גינה, צמחים וסביבה (Garden & Nature)',
    items: [
      'להשקות את העציצים במרפסת',
      'לגזום את ענפי השיח בגינה',
      'לשתול פקעות של רקפות באדנית',
      'לגרוף עלים יבשים בחצר',
      'לקטוף לימונים מהעץ'
    ]
  },
  {
    id: 15,
    name: 'אירועים, חגיגות ומפגשים (Events & Social)',
    items: [
      'לקנות בלונים צבעוניים למסיבה',
      'לעטוף מתנה בנייר אריזה וסרט',
      'להדליק נרות שבת בפמוטים',
      'להרים כוסית יין אדום לחיים',
      'להזמין שולחן במסעדה לערב'
    ]
  }
];

function checkImageQuality(station, itemText) {
  const issues = [];
  const imgUrl = station.imageUrl || '';
  const anchor = station.associationWord || '';
  const concept = station.coreConcept || '';

  // 1. Is there an image at all?
  if (!imgUrl) {
    issues.push('Missing imageUrl');
  }

  // 2. If it is local, does it exist on disk?
  if (imgUrl.startsWith('/staged_images/pool/')) {
    const diskPath = 'public' + imgUrl;
    if (!fs.existsSync(diskPath)) {
      issues.push(`Broken local path on disk: ${imgUrl}`);
    }
  }

  // 3. Known antipattern checks
  if (/מכנסיים|מכנס/i.test(itemText) && /צ['"]?ארלי צפלין|צ'פלין/i.test(anchor)) {
    issues.push('Antipattern: Pants mapped to Charlie Chaplin');
  }
  if (/גלידה/i.test(itemText) && /ווילי וונקה|שוקולד/i.test(anchor)) {
    issues.push('Antipattern: Ice cream mapped to chocolate / Willy Wonka');
  }
  if (/מגן מסך/i.test(itemText) && /מרי פופינס|ילדה|גן ילדים/i.test(anchor)) {
    issues.push('Antipattern: Screen protector mapped to Mary Poppins');
  }
  if (/שוקו/i.test(itemText) && /כלב|דלמטי/i.test(anchor)) {
    issues.push('Antipattern: Shoko assumed to be a dog instead of drink / cocoa');
  }

  return {
    isGood: issues.length === 0,
    issues
  };
}

async function runAudit() {
  console.log('================================================================');
  console.log('🚀 STARTING AUTONOMOUS 15-LIST QUALITY & MNEMONIC ACCURACY AUDIT');
  console.log('================================================================\n');

  let totalItemsAudited = 0;
  let totalGood = 0;
  let totalIssues = 0;
  const failureLog = [];

  for (const list of TEST_LISTS) {
    console.log(`\n📋 [רשימה ${list.id}/15] ${list.name}`);
    console.log('----------------------------------------------------------------');

    const result = await processTaskListWithSynergy(list.items);
    const stations = result.stations || [];

    for (let i = 0; i < list.items.length; i++) {
      totalItemsAudited++;
      const itemText = list.items[i];
      const station = stations[i] || {};
      const evalRes = checkImageQuality(station, itemText);

      if (evalRes.isGood) {
        totalGood++;
        console.log(`  ✅ פריט ${i + 1}: "${itemText}" ➔ עוגן: [${station.associationWord}] | סוג: ${station.imageUrl?.startsWith('data:') ? 'SVG Fallback' : (station.imageUrl?.startsWith('http') ? '🌐 Web Photo' : '💾 Local Pool')}`);
      } else {
        totalIssues++;
        console.log(`  ❌ פריט ${i + 1}: "${itemText}" ➔ כשל: ${evalRes.issues.join(', ')}`);
        failureLog.push({
          listId: list.id,
          listName: list.name,
          item: itemText,
          station,
          issues: evalRes.issues
        });
      }
    }

    console.log(`  📖 סיפור מסע: "${result.grandFinaleStory}"`);
  }

  console.log('\n================================================================');
  console.log(`🏁 AUDIT COMPLETE: ${totalGood}/${totalItemsAudited} Items Passed (Issues: ${totalIssues})`);
  console.log('================================================================');

  if (failureLog.length > 0) {
    console.log('\n⚠️ FAILURES TO FIX:');
    console.log(JSON.stringify(failureLog, null, 2));
  }

  return { totalItemsAudited, totalGood, totalIssues, failureLog };
}

runAudit();

