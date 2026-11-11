/**
 * Hebrew Root & Morphological Mnemonic Pipeline Engine
 * 
 * תורת 5 השלבים למיצוי שורשים ועוגנים מנמוניים:
 * שלב 1: קבלת המילה ("באשמתי")
 * שלב 2: פירוק לשורש ולגרעין מושגי (א.ש.מ ➔ אשם/אשמה)
 * שלב 3: הרצת אסוציאציות מוחשיות (בית משפט, אסיר, פשע, אצבע מופנית)
 * שלב 4: מציאת תמונות רלוונטיות של האסוציאציות ברשת ובמאגר
 * שלב 5: הצגת עוגן מוביל + מעבר מיידי למועמד הבא בתור אם המשתמש לא מרוצה
 */

// מאגר אסוציאציות מוחשיות, תמונות והסברים מנומקים לפי שורשים/מושגים
export const ROOT_CONCEPT_ASSOCIATIONS_MAP = {
  // שורש א.ש.מ (באשמתי, אשם, אשמה, אשמים)
  'אשם': {
    root: 'א.ש.מ',
    concept: 'אשם',
    candidates: [
      {
        id: 'guilty_prisoner_mugshot',
        name: 'אסיר מודה באשמה (GUILTY)',
        anchorWord: 'אסיר',
        imageUrl: '/staged_images/pool/guilty_prisoner_mugshot.png',
        explanation: 'אסיר במדי כלא כתומים אוחז בשלט GUILTY ומודה בפה מלא: "באשמתי!" — עוגן מוחשי וחד-משמעי של לקיחת אחריות ועונש.',
        emoji: '🚨'
      },
      {
        id: 'judge_gavel_guilty',
        name: 'פטיש שופטים ופסק דין אשם',
        anchorWord: 'בית משפט',
        imageUrl: '/staged_images/pool/judge_gavel_guilty.png',
        explanation: 'פטיש השופטים מכה על הבמה ופוסק GUILTY (אשם!) בבית המשפט — המראה והצליל של הכרעת הדין חורטים את "באשמתי".',
        emoji: '⚖️'
      },
      {
        id: 'pointing_finger_accusation',
        name: 'אצבע מופנית מאשימה',
        anchorWord: 'אצבע מופנית',
        imageUrl: '/staged_images/pool/pointing_finger_accusation.png',
        explanation: 'אצבע מופנית ישר אל תוך העיניים ומסמנת: "זה באשמתך!" — חוויה רגשית מוחשית ומטלטלת שהמוח לא יכול לשכוח.',
        emoji: '👉'
      }
    ]
  },

  // שורש ט.ע.ה (בטעותי, טעיתי, טעות, מוטעה)
  'טעות': {
    root: 'ט.ע.ה',
    concept: 'טעות',
    candidates: [
      {
        id: 'wrong_way_sign',
        name: 'תמרור אין כניסה ופניית פרסה',
        anchorWord: 'תמרור אין כניסה',
        imageUrl: '/staged_images/pool/compass.jpg',
        explanation: 'נהג שנכנס בטעות באין כניסה וצריך לבצע פניית פרסה בהולה — ממחיש מיד "טעות" ושיבוש כיוון!',
        emoji: '🚫'
      },
      {
        id: 'pencil_eraser',
        name: 'מחק ענקי שמוחק שגיאה',
        anchorWord: 'מחק',
        imageUrl: '/staged_images/pool/hourglass.jpg',
        explanation: 'מחק גומי שמשפשף את הדף ומוחק טעות כתיב גדולה עד שנוצרים פירורים!',
        emoji: '✏️'
      }
    ]
  },

  // שורש ד.ו.ר (דור, דורות, בדורותינו, מדור לדור)
  'דור': {
    root: 'ד.ו.ר',
    concept: 'דור',
    candidates: [
      {
        id: 'family_generations_tree',
        name: 'עץ שושלת דורות (סבא, אבא, נכד)',
        anchorWord: 'עץ שושלת דורות',
        imageUrl: '/staged_images/pool/mona_lisa.jpg',
        explanation: 'סבא ישיש, אבא וילד קטן אוחזים ידיים יחד ומעבירים את לפיד המסורת מדור לדור!',
        emoji: '🌳'
      },
      {
        id: 'tribal_bonfire_council',
        name: 'מדורה שבטית ומסורת עתיקה',
        anchorWord: 'מדורת שבט',
        imageUrl: '/staged_images/pool/teepee_tent.jpg',
        explanation: 'זקני השבט מספרים סיפורים היסטוריים סביב המדורה שעוברים כבר עשרה דורות ברציפות!',
        emoji: '🔥'
      }
    ]
  },

  // שורש ר.א.ה (וראיתי, כשראיתי, ראייה, מראה)
  'ראייה': {
    root: 'ר.א.ה',
    concept: 'ראייה',
    candidates: [
      {
        id: 'telescope_astronomer',
        name: 'טלסקופ כוכבים ענקי',
        anchorWord: 'טלסקופ',
        imageUrl: '/staged_images/pool/moon_landing.jpg',
        explanation: 'מביטים דרך עדשת טלסקופ ענקית ורואים מכתש ברור על הירח — קיבוע מושלם של הפעולה "ראיתי"!',
        emoji: '🔭'
      },
      {
        id: 'detective_magnifier',
        name: 'זכוכית מגדלת של שרלוק הולמס',
        anchorWord: 'זכוכית מגדלת',
        imageUrl: '/staged_images/sherlock_holmes.jpg',
        explanation: 'שרלוק הולמס מקרב זכוכית מגדלת לעין ורואה כל פרט קטן ונסתר!',
        emoji: '🔍'
      }
    ]
  },

  // שורש ש.מ.ע (שמעתי, כששמעתי, שמיעה)
  'שמיעה': {
    root: 'ש.מ.ע',
    concept: 'שמיעה',
    candidates: [
      {
        id: 'studio_headphones',
        name: 'אוזניות אולפן ענקיות',
        anchorWord: 'אוזניות',
        imageUrl: '/staged_images/pool/bob_marley.jpg',
        explanation: 'אוזניות אולפן גדולות מונחות על האוזניים ומנגנות מוזיקה בעוצמה — עוגן ישיר לפעולת השמיעה!',
        emoji: '🎧'
      }
    ]
  },

  // שורש ז.כ.ר / ש.כ.ח (שכחתי, זיכרון)
  'שכחה': {
    root: 'ש.כ.ח',
    concept: 'שכחה',
    candidates: [
      {
        id: 'finger_reminder_knot',
        name: 'חוט אדום קשור סביב האצבע',
        anchorWord: 'קשר באצבע',
        imageUrl: '/staged_images/pool/hourglass.jpg',
        explanation: 'חוט צמר אדום שנקשר סביב האצבע כדי להזכיר משהו דחוף שנשכח מהראש!',
        emoji: '🎗️'
      }
    ]
  },

  // שורש ל.ח.מ (לחימה, להילחם, קרב)
  'לחימה': {
    root: 'ל.ח.מ',
    concept: 'לחימה',
    candidates: [
      {
        id: 'combat_fight_arena',
        name: 'זירת אומנויות לחימה',
        anchorWord: 'זירת לחימה',
        imageUrl: '/staged_images/pool/combat_fight_arena.jpg',
        explanation: 'שני לוחמי קראטה בזירת קרב מתוחה עם מגנים וחגורות — עוגן מוחשי וסוער לפעולת הלחימה!',
        emoji: '🥋'
      },
      {
        id: 'boxing_gloves_fight',
        name: 'כפפות אגרוף אדומות',
        anchorWord: 'כפפות אגרוף',
        imageUrl: '/staged_images/pool/item_310_זוג_כפפות_אגרוף.jpg',
        explanation: 'כפפות איגרוף מעור אדום מונפות באוויר — סמל עולמי מובהק ללחימה ונוק-אאוט!',
        emoji: '🥊'
      },
      {
        id: 'gladiator_sword',
        name: 'חרב ומגן של גלדיאטור',
        anchorWord: 'חרב לוחם',
        imageUrl: '/staged_images/sword.jpg',
        explanation: 'חרב פלדה חדה ומגן עמיד של לוחם בשדה הקרב — עוגן פיזי חד ומובהק ללחימה!',
        emoji: '⚔️'
      }
    ]
  },

  // שורש ל.ח.ם (לחם, מאפה, חלה)
  'לחם': {
    root: 'ל.ח.מ',
    concept: 'לחם',
    candidates: [
      {
        id: 'fresh_bread_loaf',
        name: 'כיכר לחם פריכה וטרייה',
        anchorWord: 'כיכר לחם',
        imageUrl: '/staged_images/pool/fresh_bread_loaf.jpg',
        explanation: 'כיכר לחם פריכה וטרייה עם קרום שחום וסדוק שיצאה הרגע מהתנור במאפייה — עוגן חושי עשיר בריח וטעם!',
        emoji: '🍞'
      },
      {
        id: 'french_croissant_bread',
        name: 'קרואסון חמאה פריך',
        anchorWord: 'מאפה',
        imageUrl: '/staged_images/pool/french_croissant_cafe.jpg',
        explanation: 'קרואסון חמאה חם וטרי שמפזר פירורים פריכים בכל נגיסה!',
        emoji: '🥐'
      }
    ]
  },

  // שורש ח.ל.ל (חליל, נגינה)
  'חליל': {
    root: 'ח.ל.ל',
    concept: 'חליל',
    candidates: [
      {
        id: 'silver_flute_instrument',
        name: 'חליל צד מכסף מבריק',
        anchorWord: 'חליל צד',
        imageUrl: '/staged_images/pool/silver_flute.jpg',
        explanation: 'חליל צד כסוף ונוצץ עם מנגנון מפתחות מתכת שמפיק צלילים שמימיים — עוגן מוזיקלי מדויק ויוקרתי!',
        emoji: '🪈'
      },
      {
        id: 'wooden_flute_instrument',
        name: 'חליל עץ קלאסי',
        anchorWord: 'חליל עץ',
        imageUrl: '/staged_images/pool/wooden_flute.jpg',
        explanation: 'חליל עץ אותנטי עם נקבי פריטה שמנגן צלילי רועים ורוגע!',
        emoji: '🎶'
      }
    ]
  },

  // שורש ט.י.ל (לטייל, טיול, מסע)
  'טיול': {
    root: 'ט.י.ל',
    concept: 'טיול',
    candidates: [
      {
        id: 'hiking_trail_hiker',
        name: 'תרמילאי עם תיק גב על שביל הרים',
        anchorWord: 'תרמילאי',
        imageUrl: '/staged_images/pool/hiking_trail_hiker.jpg',
        explanation: 'מטייל עם תרמיל גב ענק ומקל הליכה פוסע בשביל הרים ירוק מול פסגות מושלגות — עוגן מושלם ל"לטייל"!',
        emoji: '🎒'
      },
      {
        id: 'brass_compass_map',
        name: 'מצפן פליז ומפת שבילים',
        anchorWord: 'מצפן ניווט',
        imageUrl: '/staged_images/pool/brass_marine_compass.jpg',
        explanation: 'מצפן כיס מבריק שנפתח על גבי מפת טיולים כדי למצוא את המסלול הנכון בשטח!',
        emoji: '🧭'
      }
    ]
  },

  // שורש צ.ל.צ.ל (לצלצל, צלצול, טלפון)
  'צלצול': {
    root: 'צ.ל.צ.ל',
    concept: 'צלצול',
    candidates: [
      {
        id: 'vintage_ringing_phone',
        name: 'טלפון חוגה אדום מצלצל',
        anchorWord: 'טלפון חוגה',
        imageUrl: '/staged_images/pool/vintage_ringing_phone.jpg',
        explanation: 'טלפון חוגה אדום ועתיק שמצלצל בקול פעמונים מתכתי מהדהד — עוגן קולי וחזותי בלתי נשכח לפעולה "לצלצל"!',
        emoji: '☎️'
      },
      {
        id: 'rotary_phone_receiver',
        name: 'שפופרת טלפון קלאסית',
        anchorWord: 'שפופרת טלפון',
        imageUrl: '/staged_images/pool/item_427_רסיבר___טלפון_חוגה_ישן.jpg',
        explanation: 'שפופרת טלפון כבדה שמרימים מהתושבת כדי לחייג ולצלצל למספר דחוף!',
        emoji: '📞'
      }
    ]
  },

  // שורש ס.ד.ר / נ.ק.ה (לסדר את החדר, לסדר, ניקיון, לנקות)
  'סדר_וניקיון': {
    root: 'ס.ד.ר',
    concept: 'סדר וניקיון',
    candidates: [
      {
        id: 'cinderella_cleaning',
        name: 'סינדרלה מסדרת ומנקה את החדר',
        anchorWord: 'סינדרלה',
        imageUrl: '/staged_images/pool/cinderella.jpg',
        explanation: 'סינדרלה מסדרת ומבריקה את החדר מבוקר עד ערב עד שכל פינה נוצצת — עוגן קלאסי ובלתי נשכח לסידור החדר!',
        emoji: '🧹'
      },
      {
        id: 'spongebob_cleaning',
        name: 'בובספוג מקרצף ומסדר',
        anchorWord: 'בובספוג',
        imageUrl: '/staged_images/pool/spongebob.jpg',
        explanation: 'בובספוג מכנסמרובע הוא ספוג ניקיון חרוץ שמבריק ומסדר את כל החדר בהתלהבות!',
        emoji: '🧽'
      },
      {
        id: 'flying_carpet_room',
        name: 'שטיח מעופף מסודר בחדר',
        anchorWord: 'שטיח מעופף',
        imageUrl: '/staged_images/pool/flying_carpet_aladdin.jpg',
        explanation: 'השטיח המעופף של אלאדין מתיישר ומסתדר מעצמו במרכז החדר!',
        emoji: '🪄'
      }
    ]
  },

  // שורש ש.ו.ק.ו / מ.ת.ק (לקנות שוקולית, שוקולית, שוקו, מילקשייק)
  'שוקולית': {
    root: 'ש.ו.ק.ו',
    concept: 'שוקולית ושוקו',
    candidates: [
      {
        id: 'mia_wallace_milkshake',
        name: 'כוס שוקו ומילקשייק ענקית',
        anchorWord: 'שוקו חם',
        imageUrl: '/staged_images/pool/mia_wallace_milkshake.jpg',
        explanation: 'כוס שוקו ומילקשייק שוקולית עשירה עם קשית שמזכירה מיד לקנות שוקולית!',
        emoji: '🍫'
      },
      {
        id: 'winnie_the_pooh_sweet',
        name: 'פו הדב עם צנצנת מתוקה',
        anchorWord: 'פו הדב',
        imageUrl: '/staged_images/pool/winnie_the_pooh_honey.jpg',
        explanation: 'פו הדב מחבק צנצנת מתוקה ומפנקת במטבח — עוגן חם ומתוק לקניית שוקולית!',
        emoji: '🍯'
      },
      {
        id: 'homer_simpson_donut',
        name: 'הומר סימפסון וקינוח מתוק',
        anchorWord: 'הומר סימפסון',
        imageUrl: '/staged_images/pool/homer_simpson.jpg',
        explanation: 'הומר סימפסון לא מוותר על הקינוח המתוק והשוקו שלו בסופר!',
        emoji: '🍩'
      }
    ]
  },

  // שורש נ.ה.ג (שיעור נהיגה, נהיגה, לנהוג, טסט, רכב)
  'נהיגה': {
    root: 'נ.ה.ג',
    concept: 'נהיגה ורכב',
    candidates: [
      {
        id: 'michael_schumacher_ferrari',
        name: 'מיכאל שומאכר בשיעור נהיגה בפרארי',
        anchorWord: 'שומאכר בפרארי',
        imageUrl: '/staged_images/pool/michael_schumacher_ferrari.jpg',
        explanation: 'אלוף העולם מיכאל שומאכר מעביר שיעור נהיגה מדויק על ההגה של פרארי אדומה!',
        emoji: '🏎️'
      },
      {
        id: 'ferrari_250_gto_red',
        name: 'פרארי אדומה מוכנה לנהיגה',
        anchorWord: 'פרארי אדומה',
        imageUrl: '/staged_images/pool/ferrari_250_gto_red.jpg',
        explanation: 'פרארי אדומה ונוצצת ממתינה לשיעור הנהיגה בשעה היעודה!',
        emoji: '🚗'
      },
      {
        id: 'hot_wheels_red_car',
        name: 'מכונית מרוץ לוהטת על המסלול',
        anchorWord: 'מכונית מרוץ',
        imageUrl: '/staged_images/pool/hot_wheels_red_car.jpg',
        explanation: 'מכונית ספורט מהירה שדוהרת על הכביש בשיעור נהיגה בלתי נשכח!',
        emoji: '🏁'
      }
    ]
  }
};

/**
 * מילון שורשים ונטיות עבריות מהיר
 */
const KNOWN_WORD_TO_CONCEPT_MAP = {
  // א.ש.מ
  'באשמתי': 'אשם',
  'אשמתי': 'אשם',
  'באשמתך': 'אשם',
  'אשמתך': 'אשם',
  'באשמתנו': 'אשם',
  'אשמתנו': 'אשם',
  'באשמת': 'אשם',
  'אשם': 'אשם',
  'אשמה': 'אשם',
  'אשמים': 'אשם',
  'אשמות': 'אשם',
  'להאשים': 'אשם',
  'מאשים': 'אשם',
  'האשמה': 'אשם',
  'האשמות': 'אשם',

  // ט.ע.ה
  'בטעותי': 'טעות',
  'טעותי': 'טעות',
  'טעיתי': 'טעות',
  'בטעות': 'טעות',
  'טעות': 'טעות',
  'טעויות': 'טעות',
  'הטעיה': 'טעות',

  // ד.ו.ר
  'דור': 'דור',
  'הדור': 'דור',
  'דורות': 'דור',
  'בדורותינו': 'דור',
  'לדורות': 'דור',
  'מדורה': 'דור', // בהקשר סיפורי דורות אם רלוונטי

  // ר.א.ה
  'ראיתי': 'ראייה',
  'כשראיתי': 'ראייה',
  'וראיתי': 'ראייה',
  'לראות': 'ראייה',
  'ראייה': 'ראייה',
  'מראה': 'ראייה',

  // ש.מ.ע
  'שמעתי': 'שמיעה',
  'כששמעתי': 'שמיעה',
  'לשמוע': 'שמיעה',
  'שמיעה': 'שמיעה',

  // ל.ח.מ (לחימה)
  'לחימה': 'לחימה',
  'בלחימה': 'לחימה',
  'הלחימה': 'לחימה',
  'להילחם': 'לחימה',
  'לוחם': 'לחימה',
  'לוחמים': 'לחימה',
  'קרב': 'לחימה',

  // ל.ח.מ (לחם)
  'לחם': 'לחם',
  'הלחם': 'לחם',
  'בלחם': 'לחם',
  'לחמים': 'לחם',
  'חלה': 'לחם',
  'חלות': 'לחם',

  // ח.ל.ל (חליל)
  'חליל': 'חליל',
  'החליל': 'חליל',
  'בחליל': 'חליל',
  'חלילים': 'חליל',
  'חלילן': 'חליל',

  // ט.י.ל (לטייל)
  'לטייל': 'טיול',
  'טיול': 'טיול',
  'הטיול': 'טיול',
  'בטיול': 'טיול',
  'מטייל': 'טיול',
  'טיילתי': 'טיול',
  'תרמילאי': 'טיול',

  // צ.ל.צ.ל (לצלצל)
  'לצלצל': 'צלצול',
  'צלצול': 'צלצול',
  'הצלצול': 'צלצול',
  'בצלצול': 'צלצול',
  'צלצלתי': 'צלצול',
  'חיוג': 'צלצול',
  'טלפון': 'צלצול',

  // ס.ד.ר / נ.ק.ה
  'לסדר': 'סדר_וניקיון',
  'סידור': 'סדר_וניקיון',
  'לנקות': 'סדר_וניקיון',
  'ניקיון': 'סדר_וניקיון',
  'נקי': 'סדר_וניקיון',
  'לסדר את החדר': 'סדר_וניקיון',

  // ש.ו.ק.ו
  'שוקולית': 'שוקולית',
  'שוקו': 'שוקולית',
  'לקנות שוקולית': 'שוקולית',

  // נ.ה.ג
  'נהיגה': 'נהיגה',
  'לנהוג': 'נהיגה',
  'שיעור נהיגה': 'נהיגה',
  'טסט': 'נהיגה'
};

/**
 * שלב 2: פירוק מורפולוגי של המילה או המשפט לשורש ולגרעין מושגי (Lemma & Root)
 */
export function extractHebrewRootAndLemma(rawWord = '') {
  if (!rawWord) return null;
  const word = String(rawWord).trim().toLowerCase();

  // 1. בדיקה במילון ישיר
  if (KNOWN_WORD_TO_CONCEPT_MAP[word]) {
    const concept = KNOWN_WORD_TO_CONCEPT_MAP[word];
    const data = ROOT_CONCEPT_ASSOCIATIONS_MAP[concept];
    return {
      originalWord: word,
      root: data?.root || '',
      conceptKey: concept,
      lemma: concept,
      matched: true
    };
  }

  // 1b. אם הביטוי כולל מספר מילים (למשל "שיעור נהיגה מחר ב10" או "לקנות שוקולית"), נבדוק תת-ביטויים ומילים משמעותיות
  if (word.includes(' ')) {
    for (const [phraseKey, concept] of Object.entries(KNOWN_WORD_TO_CONCEPT_MAP)) {
      if (phraseKey.length >= 3 && word.includes(phraseKey)) {
        const data = ROOT_CONCEPT_ASSOCIATIONS_MAP[concept];
        return {
          originalWord: word,
          root: data?.root || '',
          conceptKey: concept,
          lemma: concept,
          matched: true
        };
      }
    }
    const tokens = word.split(/[,\s+./\-]+/).filter(t => t.length >= 3 && !/^\d+$/.test(t));
    for (const tok of tokens) {
      const subAnalysis = extractHebrewRootAndLemma(tok);
      if (subAnalysis && subAnalysis.matched) {
        return {
          ...subAnalysis,
          originalWord: word
        };
      }
    }
  }

  // 2. הפשטת קידומות מש"ה וכל"ב + חיבוריות (וכש, וב, וכ, ול, ומ, כש, בש, מש, שה, וה, ב, כ, ל, מ, ש, ה)
  const prefixes = ['וכש', 'כש', 'וב', 'וכ', 'ול', 'ומ', 'בש', 'מש', 'שה', 'וה', 'שב', 'של', 'מה', 'ה', 'ו', 'ב', 'כ', 'ל', 'מ', 'ש'];
  let strippedPrefix = word;

  for (const p of prefixes) {
    if (word.startsWith(p) && word.length - p.length >= 3) {
      const candidate = word.slice(p.length);
      if (KNOWN_WORD_TO_CONCEPT_MAP[candidate]) {
        const concept = KNOWN_WORD_TO_CONCEPT_MAP[candidate];
        return {
          originalWord: word,
          root: ROOT_CONCEPT_ASSOCIATIONS_MAP[concept]?.root || '',
          conceptKey: concept,
          lemma: concept,
          matched: true
        };
      }
      strippedPrefix = candidate;
      break;
    }
  }

  // 3. הפשטת סיומות נטייה, גוף ושייכות (י, תי, נו, תם, תן, ך, ו, ה, יהם, יהן, ינו, ות, ים)
  const suffixes = ['יהם', 'יהן', 'ינו', 'תם', 'תן', 'תי', 'נו', 'ות', 'ים', 'ת', 'י', 'ך', 'ה', 'ו'];
  let stem = strippedPrefix;

  for (const s of suffixes) {
    if (stem.endsWith(s) && stem.length - s.length >= 3) {
      const candidate = stem.slice(0, -s.length);
      if (KNOWN_WORD_TO_CONCEPT_MAP[candidate]) {
        const concept = KNOWN_WORD_TO_CONCEPT_MAP[candidate];
        return {
          originalWord: word,
          root: ROOT_CONCEPT_ASSOCIATIONS_MAP[concept]?.root || '',
          conceptKey: concept,
          lemma: concept,
          matched: true
        };
      }
      break;
    }
  }

  // 4. בדיקת דפוס א.ש.מ ישיר
  if (/^.*אשמ.*$/.test(word)) {
    return {
      originalWord: word,
      root: 'א.ש.מ',
      conceptKey: 'אשם',
      lemma: 'אשם',
      matched: true
    };
  }

  return {
    originalWord: word,
    root: '',
    conceptKey: word,
    lemma: word,
    matched: false
  };
}

/**
 * שלב 3 + 4 + 5: שליפת עוגנים ואסוציאציות חזותיות מרובות עם מנגנון מעבר לבא בתור (Rotation)
 */
export function getRootMnemonicCandidates(word = '') {
  const analysis = extractHebrewRootAndLemma(word);
  if (!analysis || !analysis.conceptKey) return [];

  const entry = ROOT_CONCEPT_ASSOCIATIONS_MAP[analysis.conceptKey];
  if (!entry || !Array.isArray(entry.candidates)) return [];

  return entry.candidates.map(c => ({
    ...c,
    sourceWord: word,
    root: entry.root,
    concept: entry.concept
  }));
}

/**
 * קבלת עוגן ספציפי לפי אינדקס (שלב 5: אם הלקוח לא מרוצה עוברים לבאה בתור)
 */
export function getMnemonicCandidateAtIndex(word = '', index = 0) {
  const candidates = getRootMnemonicCandidates(word);
  if (!candidates.length) return null;

  const safeIndex = Math.abs(index) % candidates.length;
  const chosen = candidates[safeIndex];

  return {
    ...chosen,
    totalCandidates: candidates.length,
    currentIndex: safeIndex,
    hasNext: candidates.length > 1,
    nextIndex: (safeIndex + 1) % candidates.length
  };
}

export default {
  extractHebrewRootAndLemma,
  getRootMnemonicCandidates,
  getMnemonicCandidateAtIndex,
  ROOT_CONCEPT_ASSOCIATIONS_MAP
};
