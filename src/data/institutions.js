// Village Memory Palaces & Spatial Institutions Configuration
// Replaces game economy/upgrades with cognitive memory loci, visual anchors, and cultivation (חזרתיות פעילה)

export const INSTITUTIONS_CONFIG = {
  farmhouse: {
    id: 'wooden_cabin',
    name: 'בקתת החווה והמשכן האישי',
    englishName: 'Personal Cabin Memory Sanctuary',
    icon: 'Home',
    category: 'משכן אישי ועוגני שגרה',
    tag: 'ארמון הזיכרון האישי',
    desc: 'משכנו החמים של איש הכפר — ארמון זיכרון מרחבי עם אח אבן, מיטה כפרית, שולחן עבודה, טלוויזיה נוסטלגית, עציץ ותמונת קיר.',
    reflectionPrompt: 'איזה עוגן ויזואלי תרצה למקם בחדר היום?',
    loci: [
      { id: 'fireplace', name: 'אח מבוערת', defaultIcon: 'fire' },
      { id: 'bed', name: 'מיטה כפרית', defaultIcon: 'bed' },
      { id: 'table', name: 'שולחן עבודה', defaultIcon: 'coffee' },
      { id: 'tv', name: 'טלוויזיה נוסטלגית', defaultIcon: 'clock' },
      { id: 'plant', name: 'עציץ ירוק', defaultIcon: 'plant' },
      { id: 'picture', name: 'תמונה תלויה', defaultIcon: 'star' },
      { id: 'gift', name: 'תיבת חבילה', defaultIcon: 'gem' }
    ]
  },

  complex: {
    id: 'community_center',
    name: 'מתחם מוסדות הכפר והקהילה',
    englishName: 'Grand Community Center Complex',
    icon: 'Store',
    category: 'קהילה, מסחר ועוגני ידע',
    tag: 'ארמון הזיכרון הראשי',
    desc: 'מתחם רב-אגפי בהשראת חנות האספקה של פייר, סלון אח האבן המרכזית והיכל המזבח המקודש — מתחם רחב ידיים עם עוגנים ויזואליים עשירים.',
    reflectionPrompt: 'איזה מידע חשוב ברצונך לקודד ויזואלית במוסדות הכפר?',
    loci: [
      { id: 'shop_counter', name: 'דלפק החנות והקופה', defaultIcon: 'scroll' },
      { id: 'shelf_top', name: 'מדף עליון בחנות', defaultIcon: 'potion' },
      { id: 'shelf_bottom', name: 'מדף תחתון בחנות', defaultIcon: 'bread' },
      { id: 'produce_bin', name: 'ארגז תוצרת', defaultIcon: 'wheat' },
      { id: 'notice_board', name: 'לוח מודעות ורשימות', defaultIcon: 'book' },
      { id: 'grand_hearth', name: 'אח האבן המרכזית', defaultIcon: 'fire' },
      { id: 'community_carpet', name: 'שטיח הסלון העגול', defaultIcon: 'compass' },
      { id: 'tea_table', name: 'שולחן המפגש והתה', defaultIcon: 'coffee' },
      { id: 'golden_altar', name: 'מזבח הזהב והקריסטל', defaultIcon: 'gem' },
      { id: 'shrine_benches', name: 'ספסלי הקטיפה בהיכל', defaultIcon: 'shield' }
    ]
  },

  veggie_garden: {
    id: 'veggie_garden',
    name: 'גינת ירק וערוגות הבוטניקה',
    englishName: 'Botanical & Habit Garden',
    icon: 'Carrot',
    category: 'הרגלים, טבע ובריאות',
    tag: 'עוגני צמיחה והרגלים',
    desc: 'ערוגות אדמה פורחות ומטופחות עם תעלות השקיה וסוכת גפנים — מרחב ייעודי לקידוד הרגלי חיים, פעילות גופנית ותזונה.',
    reflectionPrompt: 'איזה הרגל יומיומי מזין את החיים שלך היום?',
    loci: [
      { id: 'plot_1', name: 'ערוגת גזרים', defaultIcon: 'plant' },
      { id: 'plot_2', name: 'ערוגת עגבניות', defaultIcon: 'plant' },
      { id: 'scarecrow', name: 'דחליל השמירה', defaultIcon: 'shield' },
      { id: 'water_basin', name: 'בריכת השקיה', defaultIcon: 'potion' }
    ]
  },

  farm: {
    id: 'farm',
    name: 'חוות תבואה וטחנת רוח כפרית',
    englishName: 'Windmill & Projects Granary',
    icon: 'Wheat',
    category: 'פרויקטים, תהליכים ומטרות',
    tag: 'עוגני פרויקטים ומלאכה',
    desc: 'חוות איכרים עם ערימות חציר, ממגורת תבואה וטחנת רוח כפרית — מרחב לסידור שלבי פרויקטים ארוכי טווח ומטרות מורכבות.',
    reflectionPrompt: 'איזה פרויקט ארוך טווח דורש ממך חזרתיות ומיקוד עקבי?',
    loci: [
      { id: 'barn_loft', name: 'עליית הגג באסם', defaultIcon: 'book' },
      { id: 'hay_bales', name: 'ערימות חציר', defaultIcon: 'wheat' },
      { id: 'mill_wheel', name: 'גלגל הטחנה', defaultIcon: 'compass' },
      { id: 'silo', name: 'ממגורת התבואה', defaultIcon: 'scroll' }
    ]
  },

  crystal_mine: {
    id: 'crystal_mine',
    name: 'מכרה קריסטלים ועומק',
    englishName: 'Luminous Crystal Core',
    icon: 'Gem',
    category: 'עקרונות, חזון וערכים',
    tag: 'עוגני עקרונות ועוצמות',
    desc: 'פיר אבן ומערת קריסטלים זוהרים — מרחב לקידוד עקרונות ברזל, ערכי ליבה בלתי מתפשרים ותובנות חיים עמוקות.',
    reflectionPrompt: 'איזה ערך מוביל אותך בקבלת החלטות?',
    loci: [
      { id: 'crystal_vein', name: 'עורק קריסטל זוהר', defaultIcon: 'gem' },
      { id: 'mine_cart', name: 'עגלת מחצבים', defaultIcon: 'shield' },
      { id: 'carved_arch', name: 'קשת אבן חצובה', defaultIcon: 'star' },
      { id: 'deep_well', name: 'באר המעמקים', defaultIcon: 'compass' }
    ]
  },

  gym: {
    id: 'gym',
    name: 'היכל הכושר והעוצמה (Gym)',
    englishName: 'Gym & Kinetic Fitness Sanctuary',
    icon: 'Dumbbell',
    category: 'כושר, אימונים ומשמעת גופנית',
    tag: 'עוגני אימון ותנועה',
    desc: 'מרחב אימונים כפרי רחב ידיים עם משקולות, מתקני כוח ומדפי ציוד — המקום הייעודי להרכבת מגדלי זיכרון של רשימות אימון, ציוד ספורט והרגלי תנועה.',
    reflectionPrompt: 'איזה אימון או הרגל גופני יטעין אותך באנרגיה היום?',
    loci: [
      { id: 'shelf_top', name: 'מדף עליון / לוקר ציוד (מגדל זיכרון)', defaultIcon: 'backpack' },
      { id: 'shop_counter', name: 'דלפק הציוד והקבלה', defaultIcon: 'dumbbell' },
      { id: 'tea_table', name: 'שולחן התאוששות ותה', defaultIcon: 'coffee' },
      { id: 'notice_board', name: 'לוח תוכניות ורשימת אימון', defaultIcon: 'book' },
      { id: 'grand_hearth', name: 'אח החימום המרכזית', defaultIcon: 'fire' },
      { id: 'golden_altar', name: 'במת הניצחון והמדליות', defaultIcon: 'star' }
    ]
  }
};
