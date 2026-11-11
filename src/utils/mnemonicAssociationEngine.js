/**
 * LifeQuest Cognitive Mnemonic Association Engine (תורת ארמון הזיכרון והאסוציאציות)
 * 
 * חוקי הברזל הקוגניטיביים של המערכת:
 * 1. לעולם לא מציגים את החפץ עצמו! (לא תמונת נעליים לנעליים, לא תמונת מכנסיים למכנסיים)
 * 2. לכל משימה/פריט מופקות 5 אסוציאציות דינמיות, חושיות ומובהקות (דמויות, סצנות פעולה, מקצועות, דמויות תרבות)
 * 3. מהירות עליונה: מועמד מס' 1 מוקרן מיד (0ms) עם תמונה אמיתית איכותית.
 * 4. מועמדים 2–5 מוכנים ברקע למעבר מיידי בלחיצה על "החלף עוגן 👎".
 * 5. תמונות שסומנו בדיסלייק נמחקות מהמאגר ונכנסות לרשימה שחורה לתמיד.
 */

import { isAssociationDisliked, isImageDisliked } from './userImageRepository.js';

// פירוק משפטים ומשימות בעברית לגרעין המושגי המרכזי
export function extractTaskEssence(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';
  let clean = rawText.trim().replace(/[.,!?:;]+/g, ' ');

  // סילוק פועלי פעולה ומילות הוראה שכיחות
  const actionPrefixes = [
    /^להחזיר\s+את\s+ה?/, /^להחזיר\s+ל[^\s]+\s+את\s+ה?/, /^להחזיר\s+/,
    /^לקנות\s+את\s+ה?/, /^לקנות\s+/,
    /^לרכוש\s+את\s+ה?/, /^לרכוש\s+/,
    /^לקחת\s+את\s+ה?/, /^לקחת\s+/,
    /^ללכת\s+ל?/, /^ללכת\s+אל\s+ה?/,
    /^לשחק\s+/,
    /^לנסוע\s+ל?/, /^לנסוע\s+אל\s+ה?/,
    /^לפגוש\s+את\s+/, /^לפגוש\s+/,
    /^להכין\s+את\s+ה?/, /^להכין\s+/,
    /^לסדר\s+את\s+ה?/, /^לסדר\s+/,
    /^לשטוף\s+את\s+ה?/, /^לשטוף\s+/,
    /^לשלם\s+על\s+ה?/, /^לשלם\s+את\s+ה?/, /^לשלם\s+/,
    /^להביא\s+את\s+ה?/, /^להביא\s+/,
    /^לנקות\s+את\s+ה?/, /^לנקות\s+/,
    /^לטפל\s+ב?/,
    /^לשלוח\s+את\s+ה?/, /^לשלוח\s+/,
    /^לאפות\s+את\s+ה?/, /^לאפות\s+/,
    /^לבשל\s+את\s+ה?/, /^לבשל\s+/,
    /^לקרוא\s+את\s+ה?/, /^לקרוא\s+/,
    /^ללמוד\s+/,
    /^לראות\s+את\s+ה?/, /^לראות\s+/,
    /^לבדוק\s+את\s+ה?/, /^לבדוק\s+/
  ];

  for (const rx of actionPrefixes) {
    if (rx.test(clean)) {
      clean = clean.replace(rx, '').trim();
      break;
    }
  }

  // סילוק תוספות זמן, אנשים ותיאורים
  clean = clean
    .replace(/\s+(ברביעי|בחמישי|בשני|בשלישי|בראשון|בשישי|בשבת|מחר|היום|אתמול)\b/g, '')
    .replace(/\s+(ב10|ב-10|ב9|ב8|בצהריים|בבוקר|בערב)\b/g, '')
    .replace(/\s+(חדשות|חדש|חדשים|טרי|יפה|טוב)\b/g, '')
    .replace(/\s+עם\s+[^\s]+/g, '')
    .trim();

  return clean || rawText.trim();
}

/**
 * מאגר תורת הזיכרון (Loci Mnemonic Arsenal)
 * כל גרעין מושגי מקושר ל-5 דמויות / סצנות פעולה חיות, חושיות ואקטיביות
 * עם תמונות פוטוגרפיות איכותיות ואמינות (Wikimedia Commons CDN)
 */
export const CORE_MNEMONIC_ASSOCIATIONS = {
  // מכנסיים / בגדים
  'מכנסיים': {
    concept: 'מכנסיים',
    associations: [
      {
        anchorName: 'צ\'רלי צ\'פלין במכנסי השק הענקיים 🎩🦯',
        searchQuery: 'צ\'רלי צ\'פלין מכנסיים',
        englishQuery: 'charlie chaplin tramp baggy trousers',
        emoji: '🎩',
        explanation: 'צ\'רלי צ\'פלין במכנסי השק הענקיים המפורסמים בהיסטוריה שמחליקים לו בכל צעד — תמונה בלתי נשכחת שמזכירה להחזיר את המכנסיים!',
        imageUrl: '/staged_images/pool/charlie_chaplin_tramp.jpg'
      },
      {
        anchorName: 'קאובוי ג\'ון מרסטון עם שלייקס מעור 🤠',
        searchQuery: 'קאובוי שלייקס',
        englishQuery: 'cowboy suspenders leather vest',
        emoji: '🤠',
        explanation: 'קאובוי קשוח עם שלייקס עור ומכנסי רכיבה בבר במערב הפרוע!',
        imageUrl: '/staged_images/pool/john_marston_cowboy.jpg'
      },
      {
        anchorName: 'דוקטור סטריינג\' פותח גלימת קסמים 🧙‍♂️✨',
        searchQuery: 'דוקטור סטריינג קסם',
        englishQuery: 'doctor strange magic cloak',
        emoji: '🧙‍♂️',
        explanation: 'דוקטור סטריינג\' פותח גלימת קסמים מסתורית שממחישה את הקסם של החזרת המכנסיים!',
        imageUrl: '/staged_images/pool/doctor_strange_magic.jpg'
      },
      {
        anchorName: 'וודי הקאובוי עם חגורת אקדחים ושלייקס 🤠⭐',
        searchQuery: 'וודי קאובוי צעצוע',
        englishQuery: 'woody cowboy belt boots',
        emoji: '🤠',
        explanation: 'וודי הקאובוי עם חגורת העור והשלייקס מוכן להרפתקה הבאה!',
        imageUrl: '/staged_images/pool/woody_cowboy_toystory.jpg'
      },
      {
        anchorName: 'פניוויז הליצן במכנסיים תפוחים 🎈🤡',
        searchQuery: 'ליצן בלון מכנסיים',
        englishQuery: 'clown balloon costume',
        emoji: '🤡',
        explanation: 'ליצן בתחפושת ענקית עם מכנסיים תפוחים ובלון זוהר!',
        imageUrl: '/staged_images/pool/pennywise_clown_balloon.jpg'
      }
    ]
  },

  // נעליים
  'נעליים': {
    concept: 'נעליים',
    associations: [
      {
        anchorName: 'וינסנט וגה רוקד ומחליק בנעליים בטוויסט 🕺👞',
        searchQuery: 'ריקוד נעליים טוויסט',
        englishQuery: 'vincent vega dance shoes floor',
        emoji: '👞',
        explanation: 'וינסנט וגה מבצע את ריקוד הטוויסט המפורסם ומחליק בנעלי העור שלו על הרחבה — לעולם לא תשכח לקנות נעליים חדשות!',
        imageUrl: '/staged_images/pool/vincent_vega_dance.jpg'
      },
      {
        anchorName: 'יוסיין בולט מזנק בנעלי הריצה המוזהבות ⚡🏃',
        searchQuery: 'יוסיין בולט נעלי ריצה',
        englishQuery: 'usain bolt running shoes lightning pose',
        emoji: '⚡',
        explanation: 'האיש המהיר בעולם בנעלי ריצה מוזהבות מציג את תנועת הברק המפורסמת!',
        imageUrl: '/staged_images/pool/usain_bolt_lightning_pose.jpg'
      },
      {
        anchorName: 'החתול במגפיים נועל מגפי עור ענקיות 👢🐱',
        searchQuery: 'החתול במגפיים',
        englishQuery: 'puss in boots leather boots',
        emoji: '👢',
        explanation: 'החתול במגפיים המפורסם צועד בגאווה במגפי העור הגדולות שלו!',
        imageUrl: '/staged_images/pool/puss_in_boots_eyes.jpg'
      },
      {
        anchorName: 'מייקל ג\'ורדן מתעופף בנעלי אייר ג\'ורדן 🏀🔴',
        searchQuery: 'מייקל גורדן נעליים סל',
        englishQuery: 'michael jordan flying air sneakers slam dunk',
        emoji: '🏀',
        explanation: 'מייקל ג\'ורדן מתעופף באוויר בנעלי האייר האגדיות שלו להטבעה מרהיבה!',
        imageUrl: '/staged_images/pool/michael_jordan_slam_dunk.jpg'
      },
      {
        anchorName: 'רוג\'ר פדרר מחליק בנעלי טניס על הדשא 🎾🌱',
        searchQuery: 'רוגר פדרר טניס נעליים',
        englishQuery: 'roger federer grass tennis shoes wimbledon',
        emoji: '🎾',
        explanation: 'רוג\'ר פדרר בנעלי טניס לבנות מושלמות מחליק על משטח הדשא הירוק!',
        imageUrl: '/staged_images/pool/roger_federer_wimbledon.jpg'
      }
    ]
  },

  // שוקולד / ממתקים
  'שוקולד': {
    concept: 'שוקולד',
    associations: [
      {
        anchorName: 'ווילי וונקה בפתח מפעל השוקולד 🎩🍫',
        searchQuery: 'ווילי וונקה מפעל שוקולד',
        englishQuery: 'willy wonka chocolate factory top hat',
        emoji: '🎩',
        explanation: 'ווילי וונקה בכובע צילינדר ומעיל סגול מזמין אותך למפעל השוקולד האגדי — לעולם לא תשכח לקנות שוקולד!',
        imageUrl: '/staged_images/pool/willy_wonka_chocolate.jpg'
      },
      {
        anchorName: 'ווילי וונקה המקורי מחזיק שוקולד מוזהב 🍫✨',
        searchQuery: 'ווילי וונקה שוקולד זהב',
        englishQuery: 'willy wonka golden ticket chocolate bar gene wilder',
        emoji: '🍫',
        explanation: 'ווילי וונקה חושף את כרטיס הזהב הנוצץ בתוך לוח שוקולד ענק!',
        imageUrl: '/staged_images/pool/willy_wonka_gene_wilder.jpg'
      },
      {
        anchorName: 'קוקי מונסטר בטירוף של מתוקים 🍪💙',
        searchQuery: 'קוקי מונסטר מתוקים עוגיות',
        englishQuery: 'cookie monster eating sweets',
        emoji: '🍪',
        explanation: 'מפלצת העוגיות הכחולה זוללת מתוקים בהתלהבות מדבקת שאי אפשר לשכוח!',
        imageUrl: '/staged_images/pool/cookie_monster_sesame.jpg'
      },
      {
        anchorName: 'שף רמי (רטטוי) מכין קינוח שוקולד גורמה 👨‍🍳🐭',
        searchQuery: 'שף רטטוי קינוח',
        englishQuery: 'remy ratatouille chef gourmet dessert',
        emoji: '👨‍🍳',
        explanation: 'השף המוכשר רמי בכובע טבחים יוצק קינוח שוקולד מופלא ומעוצב!',
        imageUrl: '/staged_images/pool/remy_ratatouille_chef.jpg'
      },
      {
        anchorName: 'פדינגטון הדב זולל ריבה מתוקה 🐻🍯',
        searchQuery: 'פדינגטון הדב ריבה',
        englishQuery: 'paddington bear sweet marmalade jar',
        emoji: '🐻',
        explanation: 'פדינגטון הדב החמוד שולף כריך ריבה מתוקה מתוך כובעו האדום!',
        imageUrl: '/staged_images/pool/paddington_bear_marmalade.jpg'
      }
    ]
  },

  // ילדה / גן ילדים
  'ילדה': {
    concept: 'ילדה מהגן',
    associations: [
      {
        anchorName: 'מרי פופינס מרחפת עם מטרייה לאסוף את הילדה ☂️✨',
        searchQuery: 'מרי פופינס מטריה ילדים',
        englishQuery: 'mary poppins flying umbrella magical nanny',
        emoji: '☂️',
        explanation: 'מרי פופינס מרחפת מן השמיים עם מטרייה פתוחה בדיוק כדי לאסוף את הילדה מהגן בזמן!',
        imageUrl: '/staged_images/pool/mary_poppins_umbrella.jpg'
      },
      {
        anchorName: 'פדינגטון הדב מחכה עם מזוודה ליד שער הגן 🐻🧳',
        searchQuery: 'פדינגטון הדב מזוודה ילד',
        englishQuery: 'paddington bear suitcase red hat school',
        emoji: '🐻',
        explanation: 'פדינגטון הדב החמוד עם מגפיו ומזוודתו הקטנה מחכה בסבלנות ליד שער הגן!',
        imageUrl: '/staged_images/pool/paddington_bear_marmalade.jpg'
      },
      {
        anchorName: 'הנסיכה אנה עם גלימה סגולה בדרך לממלכה ❄️👸',
        searchQuery: 'הנסיכה אנה גלימה',
        englishQuery: 'princess anna cape frozen adventure',
        emoji: '❄️',
        explanation: 'הנסיכה אנה השמחה והאמיצה צועדת במרץ עם גלימת החורף שלה!',
        imageUrl: '/staged_images/pool/anna_frozen_cape.jpg'
      },
      {
        anchorName: 'אלאדין טס על מרבד הקסמים 🧞‍♂️✨',
        searchQuery: 'אלאדין מרבד קסמים טיסה',
        englishQuery: 'aladdin magic carpet flying fantasy',
        emoji: '🧞‍♂️',
        explanation: 'אלאדין טס על שטיח מעופף שמגיע במהירות לכל יעד של הילדים!',
        imageUrl: '/staged_images/pool/aladdin_prince_ali.jpg'
      },
      {
        anchorName: 'מנורת הקסמים המוזהבת של אלאדין 🪔',
        searchQuery: 'מנורת קסמים מוזהבת',
        englishQuery: 'aladdin golden magic lamp genie',
        emoji: '🪔',
        explanation: 'מנורת קסמים מוזהבת שמתוכה יוצא ענן קסום שמגשים כל משאלה!',
        imageUrl: '/staged_images/pool/aladdin_magic_lamp_gold.jpg'
      }
    ]
  },

  // כדורגל
  'כדורגל': {
    concept: 'כדורגל',
    associations: [
      {
        anchorName: 'ליאו מסי מניף את גביע העולם 🏆🇦🇷',
        searchQuery: 'מסי גביע העולם הנפה',
        englishQuery: 'lionel messi world cup trophy celebration',
        emoji: '🏆',
        explanation: 'ליאו מסי מניף את גביע העולם המוזהב באושר עילאי ומזכיר את משחק הכדורגל!',
        imageUrl: '/staged_images/pool/lionel_messi_world_cup.jpg'
      },
      {
        anchorName: 'כריסטיאנו רונאלדו בחגיגת ה-SIUUU המפורסמת ⚡⚪',
        searchQuery: 'רונאלדו חגיגת שער סיו',
        englishQuery: 'cristiano ronaldo siu goal celebration jump',
        emoji: '⚡',
        explanation: 'כריסטיאנו רונאלדו מזנק באוויר בחגיגת ה-SIU המסורתית שלו מול אצטדיון רועש!',
        imageUrl: '/staged_images/pool/cristiano_ronaldo_siu.jpg'
      },
      {
        anchorName: 'ג\'אנלואיג\'י בופון מזנק בטירוף לחיבורים 🧤⚽',
        searchQuery: 'בופון שוער כדורגל זינוק',
        englishQuery: 'gianluigi buffon goalkeeper save diving soccer',
        emoji: '🧤',
        explanation: 'השוער האגדי בופון מתעופף באוויר והודף כדור מקו השער באצטדיון גועש — תמונה שמחשמלת את המוח לשחק כדורגל!',
        imageUrl: '/staged_images/pool/gianluigi_buffon_keeper.jpg'
      },
      {
        anchorName: 'דייוויד בקהאם מסובב בעיטה חופשית לחיבורים 🎯⚽',
        searchQuery: 'דייוויד בקהאם בעיטה חופשית',
        englishQuery: 'david beckham free kick curve ball',
        emoji: '🎯',
        explanation: 'דייוויד בקהאם בועט כדור מסובב אגדי שנעצר רק בתוך רשת החיבורים!',
        imageUrl: '/staged_images/pool/david_beckham_freekick.jpg'
      },
      {
        anchorName: 'אנדרס אינייסטה חוגג שער ניצחון דרמטי 🇪🇸💥',
        searchQuery: 'אינייסטה שער ניצחון מונדיאל',
        englishQuery: 'andres iniesta world cup winning goal celebration',
        emoji: '🇪🇸',
        explanation: 'אינייסטה קורע את החולצה ורץ באקסטזה לאחר שער ניצחון בלתי נשכח בדקה ה-116!',
        imageUrl: '/staged_images/pool/andres_iniesta_goal.jpg'
      }
    ]
  },

  // שחייה / בריכה / ים
  'שחייה': {
    concept: 'שחייה ובריכה',
    associations: [
      {
        anchorName: 'מייקל פלפס עם 28 מדליות זהב אולימפיות 🏊🥇',
        searchQuery: 'מייקל פלפס מדליות שחייה',
        englishQuery: 'michael phelps olympic gold medals swimming',
        emoji: '🏊',
        explanation: 'מייקל פלפס, השחיין הגדול בהיסטוריה, עטור מדליות זהב מזנק לבריכה!',
        imageUrl: '/staged_images/pool/michael_phelps_medals.jpg'
      },
      {
        anchorName: 'דוב קוטב שוחה במי הקרח הארקטיים 🐻‍❄️🧊',
        searchQuery: 'דוב קוטב שוחה קרח',
        englishQuery: 'polar bear swimming arctic blue ice ocean',
        emoji: '🐻‍❄️',
        explanation: 'דוב קוטב ענק גולש ושוחה במים הצלולים והמרעננים של הקוטב!',
        imageUrl: '/staged_images/pool/polar_bear_arctic_ice.jpg'
      },
      {
        anchorName: 'נמו הדג השובב שוחה בשונית האלמוגים 🐠',
        searchQuery: 'נמו דג שונית אלמוגים',
        englishQuery: 'nemo clownfish swimming coral reef',
        emoji: '🐠',
        explanation: 'נמו הדג הכתום שוחה במהירות בין האלמוגים הצבעוניים במצולות!',
        imageUrl: '/staged_images/pool/nemo_clownfish_lucky.jpg'
      },
      {
        anchorName: 'מרלין הדג יוצא למסע שחייה במעמקים 🐡',
        searchQuery: 'מרלין דג שחייה ים',
        englishQuery: 'marlin clownfish swimming ocean blue',
        emoji: '🐡',
        explanation: 'מרלין הדג שוחה במלוא המרץ לאורך זרם המים החם באוקיינוס!',
        imageUrl: '/staged_images/pool/marlin_clownfish_dad.jpg'
      },
      {
        anchorName: 'דוב קוטב לבן מביט במים הקפואים ❄️',
        searchQuery: 'דוב קוטב שלג ים',
        englishQuery: 'polar bear arctic snow water',
        emoji: '❄️',
        explanation: 'דוב קוטב עומד על גוש קרח וצופה במים המנצנצים!',
        imageUrl: '/staged_images/pool/polar_bear_arctic_snow.jpg'
      }
    ]
  },

  // דיג / דג
  'דיג': {
    concept: 'דיג ודגים',
    associations: [
      {
        anchorName: 'דוב גריזלי צד סלמון במפל שוצף 🐻🐟',
        searchQuery: 'דוב גריזלי סלמון מפל',
        englishQuery: 'grizzly bear catching salmon waterfall alaska river',
        emoji: '🐻',
        explanation: 'דוב גריזלי ענקי עומד בראש מפל שוצף ולוכד סלמון כסוף שקופץ ישר לתוך הלוע!',
        imageUrl: '/staged_images/pool/grizzly_bear_salmon.jpg'
      },
      {
        anchorName: 'דוב קוטב צד על הקרח הארקטי 🐻‍❄️',
        searchQuery: 'דוב קוטב ציד שלג',
        englishQuery: 'polar bear hunting ice arctic winter',
        emoji: '🐻‍❄️',
        explanation: 'דוב קוטב לבן פוסע על הקרח וצופה בצלליות הדגים במים הצלולים!',
        imageUrl: '/staged_images/pool/polar_bear_arctic_snow.jpg'
      },
      {
        anchorName: 'נמו הדג השובב חומק מקרס הדיג 🐠',
        searchQuery: 'נמו דג שונית ים',
        englishQuery: 'nemo clownfish lucky fin coral ocean',
        emoji: '🐠',
        explanation: 'דג שונית כתום זריז חומק בקלילות מכל מלכודת דיג במעמקים!',
        imageUrl: '/staged_images/pool/nemo_clownfish_lucky.jpg'
      },
      {
        anchorName: 'מנורת קסמים מוזהבת שנמשתה בחכת הדיג 🪔✨',
        searchQuery: 'מנורת קסמים חכה אגם',
        englishQuery: 'aladdin magic lamp golden treasure sea',
        emoji: '🪔',
        explanation: 'במקום דג רגיל — החכה העלתה מקרקעית האגם מנורת קסמים עתיקה מזהב טהור!',
        imageUrl: '/staged_images/pool/aladdin_magic_lamp_gold.jpg'
      },
      {
        anchorName: 'מייקל פלפס שוחה במהירות שיא כמו כריש 🏊',
        searchQuery: 'מייקל פלפס מדליות בריכה',
        englishQuery: 'michael phelps swimming champion gold',
        emoji: '🏊',
        explanation: 'מייקל פלפס טס במים כמו דג סלמון אולימפי!',
        imageUrl: '/staged_images/pool/michael_phelps_medals.jpg'
      }
    ]
  }
};

// מיפוי מילים נרדפות והטיות לגרעין המושגי
const SYNONYM_TO_CONCEPT = {
  'מכנסיים': 'מכנסיים',
  'מכנס': 'מכנסיים',
  'מכנסי': 'מכנסיים',
  'בגדים': 'מכנסיים',
  'ג\'ינס': 'מכנסיים',
  'חולצה': 'מכנסיים',

  'נעליים': 'נעליים',
  'נעל': 'נעליים',
  'נעלי': 'נעליים',
  'סניקרס': 'נעליים',
  'מגפיים': 'נעליים',

  'שוקולד': 'שוקולד',
  'שוקולית': 'שוקולד',
  'ממתקים': 'שוקולד',
  'ממתק': 'שוקולד',
  'עוגה': 'שוקולד',

  'ילדה': 'ילדה',
  'גן': 'ילדה',
  'ילד': 'ילדה',
  'ילדים': 'ילדה',
  'פעוט': 'ילדה',
  'תינוק': 'ילדה',
  'בית ספר': 'ילדה',

  'כדורגל': 'כדורגל',
  'כדור': 'כדורגל',
  'משחק': 'כדורגל',
  'אימון': 'כדורגל',
  'ספורט': 'כדורגל',

  'לשחות': 'שחייה',
  'שחייה': 'שחייה',
  'בריכה': 'שחייה',
  'ים': 'שחייה',
  'מים': 'שחייה',

  'לדוג': 'דיג',
  'דיג': 'דיג',
  'דג': 'דיג',
  'דגים': 'דיג',
  'חכה': 'דיג'
};

/**
 * יצירת 5 אסוציאציות מנמוניות עבור משימה או ביטוי כלשהו
 */
export function get5MnemonicAssociationsForTask(rawTaskText = '') {
  const essence = extractTaskEssence(rawTaskText);
  const fullText = `${rawTaskText} ${essence}`.trim().toLowerCase();

  let matchedConceptKey = null;

  // 1. בדיקת ביטויים רב-מיליים מובהקים קודם (כמו "בית ספר")
  for (const [syn, concept] of Object.entries(SYNONYM_TO_CONCEPT)) {
    if (syn.includes(' ') && fullText.includes(syn)) {
      matchedConceptKey = concept;
      break;
    }
  }

  // 2. בדיקת התאמת מילים שלמות בלבד (Token Match) — למניעת התנגשויות תת-מחרוזת הרסניות (כמו "גן" בתוך "עוגן")
  if (!matchedConceptKey) {
    const tokens = `${rawTaskText} ${essence}`
      .toLowerCase()
      .split(/[\s,.;:!?\-–—]+/)
      .filter(Boolean);

    for (const token of tokens) {
      // התאמה ישירה של המילה השלמה בלבד (ללא גזירת אותיות שורש שעלולה להפוך "מגן" ל-"גן"!)
      if (SYNONYM_TO_CONCEPT[token]) {
        matchedConceptKey = SYNONYM_TO_CONCEPT[token];
        break;
      }
    }
  }

  let candidates = [];
  if (matchedConceptKey && CORE_MNEMONIC_ASSOCIATIONS[matchedConceptKey]) {
    candidates = CORE_MNEMONIC_ASSOCIATIONS[matchedConceptKey].associations.map((a, idx) => ({
      anchorName: a.anchorName,
      searchQuery: a.searchQuery,
      englishQuery: a.englishQuery,
      emoji: a.emoji,
      explanation: a.explanation,
      imageUrl: a.imageUrl,
      fromPool: true,
      isUserApproved: false
    }));
  }

  // סינון תמונות שסומנו בעבר בדיסלייק (👎) ספציפית בהקשר למשימה זו (לא פסילה גלובלית!)
  if (candidates.length > 0) {
    const nonDisliked = candidates.filter(c => 
      !isAssociationDisliked(rawTaskText, c.imageUrl) && 
      !isAssociationDisliked(essence, c.imageUrl) &&
      !isAssociationDisliked(matchedConceptKey, c.imageUrl)
    );
    if (nonDisliked.length > 0) {
      candidates = nonDisliked;
    }
  }

  // חוק ברזל: אם אין מועמדים מאושרים ומדויקים – לא ממציאים דמויות גנריות (בלי שפים, בלי קוסמים)!
  // מחזירים מערך ריק כדי שהמערכת תדע לחפש ישירות או להציג כרטיס נקי בלבד.
  return candidates;
}

export default {
  extractTaskEssence,
  CORE_MNEMONIC_ASSOCIATIONS,
  get5MnemonicAssociationsForTask
};

