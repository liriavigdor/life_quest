// Village Institutions Configuration, Levels & Production Data

export const INSTITUTIONS_CONFIG = {
  veggie_garden: {
    id: 'veggie_garden',
    name: 'גינת ירק וערוגות גידול',
    englishName: 'Vegetable Garden',
    icon: 'Carrot',
    category: 'חקלאות ותזונה',
    tag: 'ירקות טריים',
    resourceKey: 'veggies',
    resourceName: 'ירקות טריים',
    resourceIcon: '🥕',
    emoji: '🥕',
    desc: 'ערוגות אדמה פורחות ומטופחות המניבות גזרים, עגבניות, חסה ודלעות להזנת אנשי הכפר.',
    reflectionPrompt: 'איזה הרגל מזין או ארוחה טובה הענקת לגוף שלך היום?',
    baseCost: { seeds: 20 },
    levels: [
      {
        level: 1,
        title: 'ערוגות ראשוניות ודחליל חביב',
        subtitle: 'חלקת ירק בסיסית',
        desc: 'תלמי אדמה תחוחה עם גזרים צעירים, גבולות בולי עץ ודחליל קש קטן ושמח ששומר על השתילים.',
        productionRate: 2, // produce per harvest cycle
        maxCapacity: 5,
        upgradeCost: { seeds: 35 },
        features: ['גידול גזרים טריים', 'דחליל עץ שומר', 'תפוקה: 2 ירקות למחזור']
      },
      {
        level: 2,
        title: 'גינת ירק שופעת עם השקיה',
        subtitle: 'ערוגות מגודרות ומפותחות',
        desc: 'גדר עץ פסטורלית, תעלות השקיה מאבן צלולה, עגבניות אדומות על מקלות טיפוס וראשי חסה פריכים.',
        productionRate: 4,
        maxCapacity: 10,
        upgradeCost: { seeds: 65, veggies: 8 },
        features: ['ערוגות עגבניות וגזרים', 'תעלות השקיה מאבן', 'משפך גינה לאיש הכפר', 'תפוקה: 4 ירקות למחזור']
      },
      {
        level: 3,
        title: 'מתחם חקלאי אורגני ודלעות ענק',
        subtitle: 'אחוזת גננות מלכותית',
        desc: 'סוכת גפנים פורחת, דלעות ענקיות מזהיבות בשמש, סלי ירקות גדושים ומנורת לילה מאירה מעל השער.',
        productionRate: 7,
        maxCapacity: 20,
        upgradeCost: null, // Max level
        features: ['סוכת דלעות וגפנים', 'סלי קציר גדושים', 'פנס לילה מאיר', 'תפוקה מרבית: 7 ירקות למחזור']
      }
    ]
  },

  farm: {
    id: 'farm',
    name: 'חוות תבואה וטחנת רוח כפרית',
    englishName: 'Cozy Windmill Farmstead',
    icon: 'Wheat',
    category: 'ייצור ומלאכה',
    tag: 'תבואה וקמח',
    resourceKey: 'harvest',
    resourceName: 'תבואה וקמח',
    resourceIcon: '🌾',
    emoji: '🌾',
    desc: 'חוות איכרים חמימה עם ערימות חציר, שדות חיטה זהובים וטחנת רוח המייצרת קמח טרי ומזין.',
    reflectionPrompt: 'איזה תהליך או פרויקט שהשקעת בו לאחרונה מתחיל להניב פירות?',
    baseCost: { seeds: 30 },
    levels: [
      {
        level: 1,
        title: 'אסם כפרי וחבילות חציר',
        subtitle: 'אסם עץ חמים',
        desc: 'אסם עץ צבוע באדום כפרי עם גג קש זהוב, דלתות ברזל מסורתיות וחבילות חציר קשורות בחבל.',
        productionRate: 2,
        maxCapacity: 5,
        upgradeCost: { seeds: 45, veggies: 4 },
        features: ['אסם עץ אדום', 'ערימות חציר זהובות', 'תפוקה: 2 שקי תבואה למחזור']
      },
      {
        level: 2,
        title: 'חוות תבואה עם טחנת קמח פעילה',
        subtitle: 'טחנת קמח וממגורה',
        desc: 'כנפי טחנת רוח מסתובבות ברוח, ממגורת אבן שומרת על הגרעינים ושקי קמח לבן מונחים על משטחי עץ.',
        productionRate: 5,
        maxCapacity: 12,
        upgradeCost: { seeds: 80, harvest: 10 },
        features: ['כנפי טחנה מסתובבות', 'שקי קמח טריים', 'שבשבת רוח תרנגול', 'תפוקה: 5 שקי תבואה למחזור']
      },
      {
        level: 3,
        title: 'אחוזת איכרים שופעת וממגורת זהב',
        subtitle: 'טחנת רוח הולנדית מפוארת',
        desc: 'טחנת רוח מתומנת מאבן עתיקה, חלונות מוארים באור נרות, עגלת תבואה עמוסה במחיצות חיטה וגג נחושת ירוק.',
        productionRate: 8,
        maxCapacity: 25,
        upgradeCost: null,
        features: ['טחנת רוח ענקית מפוארת', 'עגלת חיטה רתומה', 'ארובה מעלת עשן', 'תפוקה מרבית: 8 שקי תבואה למחזור']
      }
    ]
  },

  crystal_mine: {
    id: 'crystal_mine',
    name: 'מכרה קריסטלים ואבני חן',
    englishName: 'Luminous Crystal Mine',
    icon: 'Gem',
    category: 'משאבי עומק ועושר',
    tag: 'קריסטלים זוהרים',
    resourceKey: 'crystals',
    resourceName: 'קריסטלים זוהרים',
    resourceIcon: '💎',
    emoji: '💎',
    desc: 'פיר כרייה בעומק ההר המפיק גבישי קריסטל זוהרים, אבני חן יקרות ערך ומחצבים נדירים לשדרוגים.',
    reflectionPrompt: 'איזה חוזק פנימי עמוק גילית בעצמך בתקופה האחרונה?',
    baseCost: { seeds: 40, harvest: 4 },
    levels: [
      {
        level: 1,
        title: 'פיר כרייה ראשוני ופנס עץ',
        subtitle: 'פיר כרייה תומך',
        desc: 'פתח מנהרה חצוב בסלע הנתמך בקורות עץ גסות, עם פנס נפט מאיר וערימת עפר עם שברי קריסטל נוצצים.',
        productionRate: 1,
        maxCapacity: 4,
        upgradeCost: { seeds: 55, harvest: 8 },
        features: ['פיר כניסה עמוק', 'פנס נפט תלוי', 'מכוש כורים נשען', 'תפוקה: 1 קריסטל למחזור']
      },
      {
        level: 2,
        title: 'מכרה עמוק עם מסילה ועגלת כורים',
        subtitle: 'תשתית כרייה מחוזקת',
        desc: 'מסילת ברזל היוצאת מתוך המערה עם עגלת כורים עמוסה בקריסטלים זוהרים בסגול וטורקיז וחישוקי פלדה.',
        productionRate: 3,
        maxCapacity: 8,
        upgradeCost: { seeds: 90, crystals: 6, harvest: 12 },
        features: ['מסילת עגלות כורים', 'עגלה מלאה בגבישים זוהרים', 'תמיכות ברזל מחוזקות', 'תפוקה: 3 קריסטלים למחזור']
      },
      {
        level: 3,
        title: 'קומפלקס כרייה מלכותי וגאודות ענק',
        subtitle: 'מערת הבדולח הקסומה',
        desc: 'שער אבן גמדי מגולף עם רונות עתיקות, גבישי ענק פועמים באור קסום, מעלית גלגלת עמוקה ועגלות מלאות יהלומים.',
        productionRate: 6,
        maxCapacity: 18,
        upgradeCost: null,
        features: ['שער אבן גמדי מפואר', 'גאודות קריסטל פועמות באור', 'מעלית גלגלת עמוקה', 'תפוקה מרבית: 6 קריסטלים למחזור']
      }
    ]
  }
};
