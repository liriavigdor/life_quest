// Logical Village Frameworks & Starter Templates for Life Quest
// Eliminates friction / "Blank Canvas Syndrome" and provides structured cognitive memory layouts

export const VILLAGE_TEMPLATES = [
  {
    id: 'plaza',
    name: 'כיכר המרכז וצירי השבילים',
    englishName: 'The Crossroads Plaza',
    icon: '🏛️',
    badge: 'מבנה לוגי רדיאלי',
    tagline: 'כיכר מפגש מרכזית עם שבילים מרוצפים הנפרשים ל-4 רבעים ייעודיים',
    description: 'מבנה קלאסי ומאורגן במיוחד. כיכר התכנסות מרכזית עם ציר שבילים ראשי המוביל לארבעה רובעים מוגדרים: למידה, מנוחה, טבע וחום אנושי. אידיאלי לסדר מנטלי וניווט קל בין זיכרונות.',
    cognitiveFocus: 'חלוקה רדיאלית ברורה מפחיתה עומס קוגניטיבי ומאפשרת לקשר זיכרונות לפי 4 תחומי חיים עיקריים.',
    zones: [
      '🏛️ כיכר מרכזית: פינת תה ומפגש בלב הכפר',
      '📚 רובע צפון: עץ אלון עתיק וספסל קריאה לתובנות ולמידה',
      '🌊 רובע מזרח: פלג מים חיים לרעננות וזרימה',
      '🔥 רובע דרום: מדורת חום וחיבור אנושי',
      '🌸 רובע מערב: גן פרחים וצמיחה'
    ],
    items: [
      // Central Hub
      { gx: 11, gy: 11, type: 'tea_table', memory: 'זמן איכות, הקשבה וחום אנושי', dedicatedTo: 'זמן איכות, הקשבה וחום אנושי', date: '10/10/2026' },
      
      // Crossroads Cobblestone Paths
      { gx: 11, gy: 10, type: 'cobblestone_road', memory: 'נתיב החוכמה והלמידה', dedicatedTo: 'נתיב החוכמה והלמידה', date: '10/10/2026' },
      { gx: 11, gy: 9,  type: 'cobblestone_road', memory: 'נתיב החוכמה והלמידה', dedicatedTo: 'נתיב החוכמה והלמידה', date: '10/10/2026' },
      { gx: 11, gy: 12, type: 'cobblestone_road', memory: 'נתיב החום והחיבור', dedicatedTo: 'נתיב החום והחיבור', date: '10/10/2026' },
      { gx: 11, gy: 13, type: 'cobblestone_road', memory: 'נתיב החום והחיבור', dedicatedTo: 'נתיב החום והחיבור', date: '10/10/2026' },
      { gx: 12, gy: 11, type: 'cobblestone_road', memory: 'נתיב המים והשחרור', dedicatedTo: 'נתיב המים והשחרור', date: '10/10/2026' },
      { gx: 13, gy: 11, type: 'cobblestone_road', memory: 'נתיב המים והשחרור', dedicatedTo: 'נתיב המים והשחרור', date: '10/10/2026' },
      { gx: 10, gy: 11, type: 'cobblestone_road', memory: 'נתיב הטבע והצמיחה', dedicatedTo: 'נתיב הטבע והצמיחה', date: '10/10/2026' },
      { gx: 9,  gy: 11, type: 'cobblestone_road', memory: 'נתיב הטבע והצמיחה', dedicatedTo: 'נתיב הטבע והצמיחה', date: '10/10/2026' },

      // North Zone: Wisdom & Sanctuary
      { gx: 10, gy: 9,  type: 'reading_bench', memory: 'רגע של קריאה והשראה שקטה', dedicatedTo: 'רגע של קריאה והשראה שקטה', date: '11/10/2026' },
      { gx: 12, gy: 9,  type: 'oak_tree',      memory: 'יציבות, סבלנות ושורשים עמוקים', dedicatedTo: 'יציבות, סבלנות ושורשים עמוקים', date: '11/10/2026' },

      // East Zone: Water & Clarity
      { gx: 13, gy: 10, type: 'river_tile',    memory: 'מים צלולים לשחרור לחצים וזרימה', dedicatedTo: 'מים צלולים לשחרור לחצים וזרימה', date: '12/10/2026' },
      { gx: 14, gy: 10, type: 'river_tile',    memory: 'נחל מפכה שמטהר את הראש', dedicatedTo: 'נחל מפכה שמטהר את הראש', date: '12/10/2026' },
      { gx: 14, gy: 11, type: 'water_lily_pond', memory: 'שלוות נפש כמו בריכת נימפיאות', dedicatedTo: 'שלוות נפש כמו בריכת נימפיאות', date: '12/10/2026' },

      // South Zone: Warmth & Celebration
      { gx: 11, gy: 14, type: 'bonfire',       memory: 'מדורה של תשוקה, חום ויצירתיות', dedicatedTo: 'מדורה של תשוקה, חום ויצירתיות', date: '13/10/2026' },
      { gx: 10, gy: 13, type: 'reading_bench', memory: 'שיחה חמה ועמוקה אל תוך הלילה', dedicatedTo: 'שיחה חמה ועמוקה אל תוך הלילה', date: '13/10/2026' },

      // West Zone: Nature & Bloom
      { gx: 9,  gy: 10, type: 'flower_garden', memory: 'פריחה אישית וטיפוח מטרות', dedicatedTo: 'פריחה אישית וטיפוח מטרות', date: '14/10/2026' },
      { gx: 8,  gy: 11, type: 'bush',          memory: 'הליכה נעימה בטבע עם אוויר צח', dedicatedTo: 'הליכה נעימה בטבע עם אוויר צח', date: '14/10/2026' }
    ]
  },
  {
    id: 'riverside',
    name: 'חוות המעיינות והזרימה',
    englishName: 'The Riverside Homestead',
    icon: '🌊',
    badge: 'מבנה טבעי אקולוגי',
    tagline: 'נחל זורם באלכסון עם שבילי עפר, חיות משק, בריכת נימפיאות וגשרי עץ',
    description: 'מבנה פסטורלי וזורם במיוחד. פלג מים חיים חוצה את השמורה ויוצר שני גדות חיים: גדת החווה והיצירה מצד אחד, וגדת ההתבוננות והשלווה מהצד השני.',
    cognitiveFocus: 'נוכחות מתמדת של מים זורמים ובעלי חיים מגבירה חיבור רגשי ואמפתיה, ומסייעת בעיבוד זיכרונות רגשיים.',
    zones: [
      '🌊 ציר הנחל: פלג מים טבעי החוצה את הכפר',
      '🐔 גדת החווה: לול תרנגולות, גדר עץ וערוגת ירקות',
      '🪵 גשר עץ: מעבר מחבר בין שתי גדות הנחל',
      '🪷 בריכת נימפאה: פינת מדיטציה ומים שקטים',
      '☕ פינת תה וספסל: צפייה בשקיעה על פני המים'
    ],
    items: [
      // Diagonal River Stream
      { gx: 9,  gy: 13, type: 'river_tile', memory: 'זרימה קדימה ללא הצמדות לעבר', dedicatedTo: 'זרימה קדימה ללא הצמדות לעבר', date: '10/10/2026' },
      { gx: 10, gy: 12, type: 'river_tile', memory: 'רעננות המים ונשימה עמוקה', dedicatedTo: 'רעננות המים ונשימה עמוקה', date: '10/10/2026' },
      { gx: 11, gy: 11, type: 'wooden_bridge', memory: 'גשר של סליחה וחיבור מחדש', dedicatedTo: 'גשר של סליחה וחיבור מחדש', date: '11/10/2026' },
      { gx: 12, gy: 10, type: 'river_tile', memory: 'מים מפכים המרגיעים את הגוף', dedicatedTo: 'מים מפכים המרגיעים את הגוף', date: '11/10/2026' },
      { gx: 13, gy: 9,  type: 'river_tile', memory: 'שחרור דאגות במורד הזרם', dedicatedTo: 'שחרור דאגות במורד הזרם', date: '11/10/2026' },
      { gx: 10, gy: 13, type: 'water_lily_pond', memory: 'בריכת נימפיאות שלווה לרגיעה מוחלטת', dedicatedTo: 'בריכת נימפיאות שלווה לרגיעה מוחלטת', date: '12/10/2026' },

      // Organic Dirt Trails
      { gx: 10, gy: 10, type: 'dirt_trail', memory: 'שביל הבוקר לחווה', dedicatedTo: 'שביל הבוקר לחווה', date: '12/10/2026' },
      { gx: 11, gy: 10, type: 'dirt_trail', memory: 'מעבר הגשר הכפרי', dedicatedTo: 'מעבר הגשר הכפרי', date: '12/10/2026' },
      { gx: 11, gy: 12, type: 'dirt_trail', memory: 'שביל הנחל הדרומי', dedicatedTo: 'שביל הנחל הדרומי', date: '12/10/2026' },
      { gx: 12, gy: 12, type: 'dirt_trail', memory: 'שביל הנחל הדרומי', dedicatedTo: 'שביל הנחל הדרומי', date: '12/10/2026' },

      // Left Bank: Homestead & Farm Life
      { gx: 8,  gy: 11, type: 'chicken_coop', memory: 'פשטות, טיפול בבעלי חיים ושמחה קטנה', dedicatedTo: 'פשטות, טיפול בבעלי חיים ושמחה קטנה', date: '13/10/2026' },
      { gx: 9,  gy: 10, type: 'veggie_garden', memory: 'תזונה בריאה וחיבור לאדמה', dedicatedTo: 'תזונה בריאה וחיבור לאדמה', date: '13/10/2026' },
      { gx: 8,  gy: 10, type: 'wooden_fence', memory: 'גבולות בריאים ושמירה על עצמי', dedicatedTo: 'גבולות בריאים ושמירה על עצמי', date: '13/10/2026' },
      { gx: 8,  gy: 12, type: 'wooden_fence', memory: 'גבולות בריאים ושמירה על עצמי', dedicatedTo: 'גבולות בריאים ושמירה על עצמי', date: '13/10/2026' },

      // Right Bank: Contemplation & Tea
      { gx: 12, gy: 13, type: 'reading_bench', memory: 'הקשבה לרחש המים בשעת בין ערביים', dedicatedTo: 'הקשבה לרחש המים בשעת בין ערביים', date: '14/10/2026' },
      { gx: 13, gy: 12, type: 'tea_table',     memory: 'תה נענע חם מול הנהר', dedicatedTo: 'תה נענע חם מול הנהר', date: '14/10/2026' },
      { gx: 13, gy: 11, type: 'oak_tree',      memory: 'אלון חסון שמצל על פינת התה', dedicatedTo: 'אלון חסון שמצל על פינת התה', date: '14/10/2026' }
    ]
  },
  {
    id: 'fortress',
    name: 'מבצר ההישגים והגבולות',
    englishName: 'The Citadel of Milestones',
    icon: '🏰',
    badge: 'מבנה מבוצר ומובנה',
    tagline: 'חומות אבן עם צריחים, שבילי אבן מרוצפים, מדורת ניצחון וסדר מוגן',
    description: 'מבנה מבוצר ומעצים. חומות אבן מחוברות עם שיני חומה יוצרות מתחם בטוח ומוגן שבו כל מבנה מייצג הישג אישי, חוסן נפשי והתגברות על אתגרים.',
    cognitiveFocus: 'מבנה מבוצר מחזק תחושת ביטחון, מסוגלות עצמית ומשמעת, ומהווה עוגן אידיאלי ליעדים שהושגו.',
    zones: [
      '🧱 חומת מבצר היקפית: חיבור חומות וצריחי שמירה',
      '🛤️ רחבת אבן מרכזית: שבילי אבן רציפים לחצר הפנימית',
      '🔥 לפיד הניצחון: מדורת הישגים מרכזית',
      '📖 אגף התוכניות: ספסל תכנון והתבוננות אסטרטגית',
      '🌳 עץ השמורה: סמל לכוח שעמד במבחן הזמן'
    ],
    items: [
      // Connected Stone Perimeter Ramparts (West Wall)
      { gx: 9,  gy: 9,  type: 'stone_wall', memory: 'הגבולות האישיים שלי שאני שומר עליהם', dedicatedTo: 'הגבולות האישיים שלי שאני שומר עליהם', date: '10/10/2026' },
      { gx: 9,  gy: 10, type: 'stone_wall', memory: 'חוסן פנימי מול לחצים', dedicatedTo: 'חוסן פנימי מול לחצים', date: '10/10/2026' },
      { gx: 9,  gy: 11, type: 'stone_wall', memory: 'הגנה על השקט הנפשי שלי', dedicatedTo: 'הגנה על השקט הנפשי שלי', date: '10/10/2026' },
      { gx: 9,  gy: 12, type: 'stone_wall', memory: 'ביטחון ועמידה איתנה', dedicatedTo: 'ביטחון ועמידה איתנה', date: '10/10/2026' },

      // North Wall
      { gx: 10, gy: 9,  type: 'stone_wall', memory: 'עמידה במטרות שהצבתי לעצמי', dedicatedTo: 'עמידה במטרות שהצבתי לעצמי', date: '11/10/2026' },
      { gx: 11, gy: 9,  type: 'stone_wall', memory: 'משמעת עצמית מתוך אהבה', dedicatedTo: 'משמעת עצמית מתוך אהבה', date: '11/10/2026' },
      { gx: 12, gy: 9,  type: 'stone_wall', memory: 'התגברות על מכשול משמעותי', dedicatedTo: 'התגברות על מכשול משמעותי', date: '11/10/2026' },
      { gx: 13, gy: 9,  type: 'stone_wall', memory: 'צריח השמירה על הערכים שלי', dedicatedTo: 'צריח השמירה על הערכים שלי', date: '11/10/2026' },

      // East Wall
      { gx: 13, gy: 10, type: 'stone_wall', memory: 'התמדה לאורך זמן', dedicatedTo: 'התמדה לאורך זמן', date: '12/10/2026' },
      { gx: 13, gy: 11, type: 'stone_wall', memory: 'הישג מקצועי או אישי חשוב', dedicatedTo: 'הישג מקצועי או אישי חשוב', date: '12/10/2026' },
      { gx: 13, gy: 12, type: 'stone_wall', memory: 'כוח רצון ונחישות', dedicatedTo: 'כוח רצון ונחישות', date: '12/10/2026' },

      // Stone Path Courtyard
      { gx: 11, gy: 10, type: 'stone_path', memory: 'שביל הכניסה למבצר', dedicatedTo: 'שביל הכניסה למבצר', date: '12/10/2026' },
      { gx: 11, gy: 11, type: 'stone_path', memory: 'שביל הכניסה למבצר', dedicatedTo: 'שביל הכניסה למבצר', date: '12/10/2026' },
      { gx: 11, gy: 12, type: 'stone_path', memory: 'שביל הכניסה למבצר', dedicatedTo: 'שביל הכניסה למבצר', date: '12/10/2026' },
      { gx: 11, gy: 13, type: 'stone_path', memory: 'שער המבצר הפתוח', dedicatedTo: 'שער המבצר הפתוח', date: '12/10/2026' },

      // Citadel Courtyard Amenities
      { gx: 10, gy: 11, type: 'bonfire',       memory: 'מדורת הניצחון על ספקות עצמיים', dedicatedTo: 'מדורת הניצחון על ספקות עצמיים', date: '13/10/2026' },
      { gx: 12, gy: 11, type: 'reading_bench', memory: 'ספסל תכנון מטרות ויעדים חדשים', dedicatedTo: 'ספסל תכנון מטרות ויעדים חדשים', date: '13/10/2026' },
      { gx: 12, gy: 12, type: 'oak_tree',      memory: 'עץ הניצחון שממשיך לפרוח', dedicatedTo: 'עץ הניצחון שממשיך לפרוח', date: '14/10/2026' }
    ]
  },
  {
    id: 'zen',
    name: 'גן הזן והמדיטציה',
    englishName: 'The Zen Mindfulness Garden',
    icon: '🧘',
    badge: 'הרמוניה ורוגע פנימי',
    tagline: 'אבני מדרך טבעיות, ביתן תה שליו, בריכת שקט וערוגות פרחים בהרמוניה',
    description: 'מבנה מינימליסטי והרמוני. אבני מדרך עדינות מובילות דרך פינות שקטות של חקירה פנימית, צמחי מרפא, פינת תה עדינה ובריכת שקט המשקפת את השמיים.',
    cognitiveFocus: 'מרחב מרווח עם מעט גירויים ויזואליים חדים מעודד מצב תודעה רגוע (Alpha Waves) המקל על הטמעת זיכרונות של הודיה.',
    zones: [
      '🪨 אבני מדרך מעוקלות: נתיב הליכה מודעת (Mindful Walking)',
      '🍵 ביתן תה יפני: רגע של שקט והודיה על מה שיש',
      '🪷 בריכת השקט: השתקפות השמיים ללא תנועה',
      '🌸 גן פריחה עדין: טיפוח שלווה ורוך פנימי',
      '🌳 עץ הבודהי / בונסאי: שקט פנימי עמוק'
    ],
    items: [
      // Mindful Stepping Stone Path
      { gx: 10, gy: 10, type: 'stone_path', memory: 'צעד ראשון של נשימה והרפיה', dedicatedTo: 'צעד ראשון של נשימה והרפיה', date: '10/10/2026' },
      { gx: 10, gy: 11, type: 'stone_path', memory: 'הליכה קשובה בהווה', dedicatedTo: 'הליכה קשובה בהווה', date: '10/10/2026' },
      { gx: 11, gy: 12, type: 'stone_path', memory: 'שחרור שיפוטיות וביקורת עצמית', dedicatedTo: 'שחרור שיפוטיות וביקורת עצמית', date: '11/10/2026' },
      { gx: 12, gy: 12, type: 'stone_path', memory: 'נתיב הקבלה והחמלה', dedicatedTo: 'נתיב הקבלה והחמלה', date: '11/10/2026' },
      { gx: 13, gy: 11, type: 'stone_path', memory: 'סיום הליכת המדיטציה בשלווה', dedicatedTo: 'סיום הליכת המדיטציה בשלווה', date: '11/10/2026' },

      // Centerpiece: Tea & Reflection Pool
      { gx: 11, gy: 11, type: 'tea_table',     memory: 'ספל תה חם בנוכחות מלאה', dedicatedTo: 'ספל תה חם בנוכחות מלאה', date: '12/10/2026' },
      { gx: 12, gy: 11, type: 'water_lily_pond', memory: 'בריכת מים שקטים המשקפת את השמיים', dedicatedTo: 'בריכת מים שקטים המשקפת את השמיים', date: '12/10/2026' },
      { gx: 11, gy: 10, type: 'flower_garden', memory: 'יופיים של הדברים הקטנים בחיים', dedicatedTo: 'יופיים של הדברים הקטנים בחיים', date: '13/10/2026' },
      { gx: 10, gy: 12, type: 'reading_bench', memory: 'ישיבה שקטה ללא צורך לעשות דבר', dedicatedTo: 'ישיבה שקטה ללא צורך לעשות דבר', date: '13/10/2026' },
      { gx: 9,  gy: 11, type: 'bush',          memory: 'שיח ירוק המסמל התחדשות פשוטה', dedicatedTo: 'שיח ירוק המסמל התחדשות פשוטה', date: '14/10/2026' },
      { gx: 13, gy: 12, type: 'bush',          memory: 'איזון והרמוניה', dedicatedTo: 'איזון והרמוניה', date: '14/10/2026' },
      { gx: 9,  gy: 9,  type: 'oak_tree',      memory: 'העץ העתיק של השקט הפנימי', dedicatedTo: 'העץ העתיק של השקט הפנימי', date: '14/10/2026' }
    ]
  },
  {
    id: 'blank',
    name: 'לוח חלק — התחלה מאפס',
    englishName: 'Clean Slate / Blank Canvas',
    icon: '🍃',
    badge: 'חופש יצירה מלא',
    tagline: 'קרחת יער פתוחה ונקייה לחלוטין, מוכנה לבנייה אישית שלב אחר שלב',
    description: 'אופציה לשחקנים שאוהבים לבנות הכל מאפס. מנקה את כל המבנים והשבילים ומשאיר משטח דשא ירוק, בתולי ורחב ידיים, כך שתוכל להציב כל פריט בדיוק במקום שמתאים לך.',
    cognitiveFocus: 'מרחב פתוח לחלוטין ללא מסגרת קבועה מתאים לרגעים שבהם רוצים דף חדש ופתיחת מרחב ללא שום משקעים קודמים.',
    zones: [
      '🌱 דשא בתולי פתוח לכל כיוון',
      '🛠️ חופש מוחלט להנחת מבנים, שבילים ועצים',
      '✨ בנייה עצמאית בקצב האישי שלך'
    ],
    items: []
  }
];
