export const BUILD_CATEGORIES = [
  'הכל',
  'מוסדות הכפר',
  'שבילים וגבולות',
  'מבנים ובתים',
  'חיות ויצורים',
  'טבע וצמחים',
  'מים וגשרים',
  'פינות ישיבה ואווירה'
];

export const BUILD_CATALOG = [
  // --- מבנים ובתים (Architecture & Cottages) ---
  {
    id: 'animal_coop',
    name: 'לול ומכלאת חיות כפרית',
    category: 'מבנים ובתים',
    tag: 'חום ושגרה',
    desc: 'לול עץ חמים עם גדר קטנה, תאי הטלה ומרחב פתוח לחיות הבית. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה עוגן בוקר או שגרה יומית תרצה לארגן כאן?',
    costSeeds: 0,
    renderType: 'animal_coop',
    hasInterior: true,
    interiorType: 'coop',
    emoji: '🐔'
  },
  {
    id: 'wooden_cabin',
    name: 'בקתת היצירה והחלומות',
    category: 'מבנים ובתים',
    tag: 'יצירה מהלב',
    desc: 'מוקדשת לפרויקט אישי, קוד, כתיבה או ציור שאתה יוצר מאהבה טהורה. ניתן להיכנס פנימה!',
    reflectionPrompt: 'במה יצרת או התקדמת היום בקצב שלך?',
    costSeeds: 0,
    renderType: 'wooden_cabin',
    hasInterior: true,
    interiorType: 'cabin',
    emoji: '🏡'
  },
  {
    id: 'gym',
    name: 'היכל הכושר והאימון',
    category: 'מבנים ובתים',
    tag: 'כושר ועוצמה',
    desc: 'היכל אימונים כפרי רחב ידיים עם משקולות, מתקני כוח ומדף ציוד למגדלי זיכרון אסוציאטיביים. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה ציוד או הרגל אימון תרצה לנצור כאן?',
    costSeeds: 0,
    renderType: 'gym',
    hasInterior: true,
    interiorType: 'complex',
    emoji: '🏋️'
  },
  {
    id: 'library',
    name: 'ספריית מחשבה וידע',
    category: 'מבנים ובתים',
    tag: 'סקרנות וידע',
    desc: 'מבנה עץ ואבן מואר עם כונניות ספרים, נרות ושולחן קריאה. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה תחום דעת, רעיון או ספר תרצה ללמוד ולנצור?',
    costSeeds: 0,
    renderType: 'library',
    hasInterior: true,
    interiorType: 'library',
    emoji: '📚'
  },
  {
    id: 'bakery',
    name: 'מאפיית הבוקר הכפרית',
    category: 'מבנים ובתים',
    tag: 'חום והזנה',
    desc: 'מאפייה חמימה עם גג רעפים, שולחן מאפים וארובה שמפיצה ניחוח לחם טרי. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה פינוק חם ומשמח הענקת לעצמך היום?',
    costSeeds: 0,
    renderType: 'bakery',
    hasInterior: true,
    interiorType: 'bakery',
    emoji: '🥖'
  },
  {
    id: 'greenhouse',
    name: 'חממת זכוכית ובוטניקה',
    category: 'מבנים ובתים',
    tag: 'צמיחה שקטה',
    desc: 'משתלת זכוכית חמימה עם עציצים, צמחי תבלין ושרכים. מקום שבו רעיונות מלבלבים לאט. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה רעיון או תשוקה חדשה היית רוצה לטפח בעדינות?',
    costSeeds: 0,
    renderType: 'greenhouse',
    hasInterior: true,
    interiorType: 'greenhouse',
    emoji: '🪴'
  },
  {
    id: 'farm',
    name: 'חוות תבואה ואסם עץ',
    category: 'מבנים ובתים',
    tag: 'תבואה וקמח',
    desc: 'אסם עץ חמים, שדות חיטה ומבנה כפרי ציורי המעניק תחושת יציבות ושפע. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איזה תהליך שהשקעת בו מתחיל להניב פירות?',
    costSeeds: 0,
    renderType: 'farm',
    hasInterior: true,
    interiorType: 'farm',
    emoji: '🌾'
  },
  {
    id: 'art_studio',
    name: 'סטודיו לאמנות וציור',
    category: 'מבנים ובתים',
    tag: 'ביטוי עצמי',
    desc: 'בית מלאכה מואר עם כני ציור, צבעי מים וחלונות פנורמיים ליער. ניתן להיכנס פנימה!',
    reflectionPrompt: 'איך ביטאת היום את הקול והייחודיות שלך?',
    costSeeds: 0,
    renderType: 'art_studio',
    hasInterior: true,
    interiorType: 'cabin',
    emoji: '🎨'
  },
  {
    id: 'windmill',
    name: 'טחנת רוח ציורית',
    category: 'מבנים ובתים',
    tag: 'זרימה ותנועה',
    desc: 'טחנת רוח כפרית קלאסית עם כנפיים המסתובבות בעדינות ברוח הנעימה.',
    reflectionPrompt: 'באיזה תחום אתה מרגיש שהרוח הטובה בגבך?',
    costSeeds: 0,
    renderType: 'windmill',
    hasInterior: false,
    emoji: '🌾'
  },
  {
    id: 'crystal_mine',
    name: 'מכרה קריסטלים זוהרים',
    category: 'מבנים ובתים',
    tag: 'חוזק פנימי',
    desc: 'פיר מנהרה מאבן עתיקה המנצנץ בגבישי קריסטל תכולים וזוהרים.',
    reflectionPrompt: 'איזה חוזק פנימי עמוק גילית בעצמך לאחרונה?',
    costSeeds: 0,
    renderType: 'crystal_mine',
    hasInterior: false,
    emoji: '💎'
  },
  {
    id: 'blacksmith_cottage',
    name: "בית נגרות הפורץ",
    category: 'מבנים ובתים',
    tag: 'תפסיק את האנטי‑חלקים',
    desc: 'קוטג׳ אסימטרי של נפח כבד עם חדר פורג׳ וכניסה צרה ל‑36 px. ללא רהיטים, רק מבנה.',
    reflectionPrompt: 'איזה מבנה של חזון יוצר לך תחושת בטחון?',
    costSeeds: 0,
    renderType: 'new_cottage_engine',
    hasInterior: true,
    emoji: '🏚️'
  },

  // --- חיות ויצורים (Living Animals) ---
  {
    id: 'animal_chicken',
    name: 'תרנגולת כפרית שמחה',
    category: 'חיות ויצורים',
    tag: 'תנועה וערנות',
    desc: 'תרנגולת חופשיה שמטיילת, מנקרת וקופצת. ניתן לתת לה שם ולשייך לה פריט לזיכרון!',
    reflectionPrompt: 'איזה פריט או תזכורת תרצה לשייך לתרנגולת זו?',
    costSeeds: 0,
    renderType: 'animal_chicken',
    isAnimal: true,
    animalType: 'chicken',
    emoji: '🐔'
  },
  {
    id: 'animal_cat',
    name: 'חתול כפרי מגרגר',
    category: 'חיות ויצורים',
    tag: 'רוגע ונוחות',
    desc: 'חתול שליו שמתהלך על השבילים ורובץ בשמש. מוסיף חום ושלווה לכפר.',
    reflectionPrompt: 'איזה עוגן של רוגע או מנוחה החתול הזה מזכיר לך?',
    costSeeds: 0,
    renderType: 'animal_cat',
    isAnimal: true,
    animalType: 'cat',
    emoji: '🐱'
  },
  {
    id: 'animal_dog',
    name: 'כלבלב כפרי נאמן',
    category: 'חיות ויצורים',
    tag: 'נאמנות ושמחה',
    desc: 'כלבלב חמוד שמכשכש בזנב ומסתובב בחצר בשמחה.',
    reflectionPrompt: 'מה מעורר בך שמחה ונאמנות עצמית היום?',
    costSeeds: 0,
    renderType: 'animal_dog',
    isAnimal: true,
    animalType: 'dog',
    emoji: '🐶'
  },
  {
    id: 'animal_sheep',
    name: 'כבשה צמרירית שלווה',
    category: 'חיות ויצורים',
    tag: 'רוגע ושלום',
    desc: 'כבשה עם צמר רך ועדין שמלחכת עשב בנחת.',
    reflectionPrompt: 'איזה רגע של שלווה פנימית תרצה לנצור?',
    costSeeds: 0,
    renderType: 'animal_sheep',
    isAnimal: true,
    animalType: 'sheep',
    emoji: '🐑'
  },
  {
    id: 'animal_duck',
    name: 'ברווז פלגי מים',
    category: 'חיות ויצורים',
    tag: 'שחייה וקלילות',
    desc: 'ברווז שמתנועע על פלגי המים או מדדה על הדשא.',
    reflectionPrompt: 'איזה מתח או דאגה אתה משחרר לזרום במים?',
    costSeeds: 0,
    renderType: 'animal_duck',
    isAnimal: true,
    animalType: 'duck',
    emoji: '🦆'
  },
  {
    id: 'animal_rabbit',
    name: 'ארנב שדה סקרן',
    category: 'חיות ויצורים',
    tag: 'סקרנות וקלילות',
    desc: 'ארנבון שמקפץ ברוגע ומזיז את אפו בסקרנות בטבע.',
    reflectionPrompt: 'איזה דבר מעניין משך את תשומת ליבך?',
    costSeeds: 0,
    renderType: 'animal_rabbit',
    isAnimal: true,
    animalType: 'rabbit',
    emoji: '🐰'
  },

  // --- טבע וצמחים (Nature & Plants) ---
  {
    id: 'cypress_tree',
    name: 'עץ ברוש ים-תיכוני תמיר',
    category: 'טבע וצמחים',
    tag: 'זקיפות וחוסן',
    desc: 'עץ ברוש זקוף ותמיר עם צמרת צפופה וירוקה. עוגן ויזואלי מושלם לשבילים ואסוציאציות אישיות.',
    reflectionPrompt: 'איזו אסוציאציה אישית הברוש הזה מזכיר לך?',
    costSeeds: 0,
    renderType: 'cypress_tree',
    emoji: '🌲'
  },
  {
    id: 'fruit_tree',
    name: 'עץ פרי ולימונים כפרי',
    category: 'טבע וצמחים',
    tag: 'רעננות והזנה',
    desc: 'עץ פרי כפרי עמוס לימונים זהובים ועלים רעננים.',
    reflectionPrompt: 'איזה דבר טוב או מזין הענקת לעצמך היום?',
    costSeeds: 0,
    renderType: 'fruit_tree',
    emoji: '🍋'
  },
  {
    id: 'sakura_tree',
    name: 'עץ דובדבן פורח (סאקורה)',
    category: 'טבע וצמחים',
    tag: 'יופי והתחדשות',
    desc: 'עץ דובדבן מרהיב בפריחה ורודה עדינה עם עלי כותרת מרחפים בעדינות באוויר.',
    reflectionPrompt: 'איזה דבר עדין ויפה ראית היום שהעלה בך חיוך?',
    costSeeds: 0,
    renderType: 'sakura_tree',
    emoji: '🌸'
  },
  {
    id: 'oak_tree',
    name: 'עץ אלון של סקרנות',
    category: 'טבע וצמחים',
    tag: 'התפתחות אישית',
    desc: 'עץ רחב צמרת שצומח עם כל דף שקראת, פודקאסט מעשיר או הבנה חדשה על העולם.',
    reflectionPrompt: 'מה למדת או גילית לאחרונה שעורר בך עניין?',
    costSeeds: 0,
    renderType: 'oak_tree',
    emoji: '🌳'
  },
  {
    id: 'willow_tree',
    name: 'ערבה בוכייה קסומה',
    category: 'טבע וצמחים',
    tag: 'רוגע וחסות',
    desc: 'עץ ערבה עם ענפים ירוקים משתפלים עד האדמה, מרחב מוצל ומנחם.',
    reflectionPrompt: 'איזה מקום או רגע מאפשר לך להרפות ולהירגע?',
    costSeeds: 0,
    renderType: 'willow_tree',
    emoji: '🍃'
  },
  {
    id: 'pine_tree',
    name: 'ברוש של חוסן ועוצמה',
    category: 'טבע וצמחים',
    tag: 'תנועה טבעית',
    desc: 'מוקדש לפעילות גופנית, מתיחות, יוגה או הליכה נעימה שחיברה אותך לגוף.',
    reflectionPrompt: 'איזו תנועה גרמה לך להרגיש חיוני היום?',
    costSeeds: 0,
    renderType: 'pine_tree',
    emoji: '🌲'
  },
  {
    id: 'sunflower_patch',
    name: 'שדה חמניות שמש',
    category: 'טבע וצמחים',
    tag: 'אופטימיות ואור',
    desc: 'ערוגת חמניות גבוהות וזהובות המפנות את פניהן בחום אל אור השמש.',
    reflectionPrompt: 'מה ממלא אותך באור ובאנרגיה טובה היום?',
    costSeeds: 0,
    renderType: 'sunflower_patch',
    emoji: '🌻'
  },
  {
    id: 'flower_garden',
    name: 'ערוגת פרחי שדה',
    category: 'טבע וצמחים',
    tag: 'רגע של חמלה',
    desc: 'נשתל כשעצרת לנשום, ישנת טוב או הענקת לעצמך מנוחה ללא רגשות אשם.',
    reflectionPrompt: 'איזה רגע של שלווה לקחת לעצמך היום?',
    costSeeds: 0,
    renderType: 'flower_garden',
    hasInterior: true,
    interiorType: 'garden',
    emoji: '🌺'
  },
  {
    id: 'veggie_garden',
    name: 'ערוגות ירק וגזרים',
    category: 'טבע וצמחים',
    tag: 'הזנה ובריאות',
    desc: 'ערוגות אדמה תחוחה וגזרים רעננים המזכירים להזין את הגוף באהבה. ניתן להיכנס לחממת הבוטניקה!',
    reflectionPrompt: 'איזה הרגל מזין או ארוחה טובה הענקת לגוף שלך היום?',
    costSeeds: 0,
    renderType: 'veggie_garden',
    hasInterior: true,
    interiorType: 'garden',
    emoji: '🥕'
  },
  {
    id: 'bush',
    name: 'שיח פטל ופטריות בר',
    category: 'טבע וצמחים',
    tag: 'צעד קטן',
    desc: 'הזנת את הגוף: שתיית מים, תה מנחם או יציאה קצרה לאוויר הפתוח.',
    reflectionPrompt: 'איך דאגת לגוף שלך היום בצעד קטן?',
    costSeeds: 0,
    renderType: 'bush',
    emoji: '🫐'
  },
  {
    id: 'glow_mushrooms',
    name: 'פטריות יער זוהרות',
    category: 'טבע וצמחים',
    tag: 'קסם וסקרנות',
    desc: 'מקבץ פטריות קסומות המאירות באור תכלכל-סגלגל רך ומשרה שלווה בלילה.',
    reflectionPrompt: 'מתי לאחרונה אפשרת לסקרנות או לדמיון שלך להוביל?',
    costSeeds: 0,
    renderType: 'glow_mushrooms',
    emoji: '🍄'
  },

  // --- מים וגשרים (Water & Bridges) ---
  {
    id: 'river_tile',
    name: 'פלג מים זורם',
    category: 'מים וגשרים',
    tag: 'שחרור וזרימה',
    desc: 'פלג מים צלול וקריר עם חלוקי נחל וגלים עדינים. מסמל לדעת לשחרר ולזרום עם החיים.',
    reflectionPrompt: 'איזה מתח הצלחת לשחרר היום ולתת לו לזרום הלאה?',
    costSeeds: 0,
    renderType: 'river_tile',
    emoji: '🌊'
  },
  {
    id: 'water_lily_pond',
    name: 'בריכת נימפאות ושושני מים',
    category: 'מים וגשרים',
    tag: 'טוהר ושקט',
    desc: 'בריכת מים שקטה עם עלי נופר צפים ופרחי נימפאה ורודים המפיצים שלווה.',
    reflectionPrompt: 'איזה רגע של שלווה צלולה חווית לאחרונה?',
    costSeeds: 0,
    renderType: 'water_lily_pond',
    emoji: '🪷'
  },
  {
    id: 'wooden_bridge',
    name: 'גשר עץ מעל המים',
    category: 'מים וגשרים',
    tag: 'גשר מעל קושי',
    desc: 'גשר עץ מקושת שעובר מעל המים. מסמל מעבר של תקופה מאתגרת וחיבור פנימי.',
    reflectionPrompt: 'איזה גשר בנית לאחרונה — כלפי עצמך או כלפי אדם אחר?',
    costSeeds: 0,
    renderType: 'wooden_bridge',
    emoji: '🌉'
  },
  {
    id: 'stone_bridge',
    name: 'גשר אבן עתיק וקשתות',
    category: 'מים וגשרים',
    tag: 'יציבות וחיבור',
    desc: 'גשר קשתות מאבן מסותתת עם מעקה מעוטר וקיסוס מטפס, מקשר בין חלקי הכפר.',
    reflectionPrompt: 'איזה קשר או חיבור אנושי עמוק העניק לך כוח?',
    costSeeds: 0,
    renderType: 'stone_bridge',
    emoji: '🏛️'
  },
  {
    id: 'fountain',
    name: 'מזרקת אבן שקטה',
    category: 'מים וגשרים',
    tag: 'רחש מים מרגיע',
    desc: 'מזרקת אבן טבעית עם צליל פכפוך עדין של מים. מקום להרפות את הכתפיים ולנשום.',
    reflectionPrompt: 'מתי עצרת היום רק כדי לנשום עמוק ולהרפות?',
    costSeeds: 0,
    renderType: 'fountain',
    emoji: '⛲'
  },
  {
    id: 'wishing_well',
    name: 'באר משאלות עתיקה',
    category: 'מים וגשרים',
    tag: 'משאלה אישית',
    desc: 'באר אבן עמוקה עם גג רעפים ומים צלולים. מקום להפקיד בו משאלה כמוסה לעתיד לבוא.',
    reflectionPrompt: 'איזו משאלה קטנה היית רוצה להביע עבור עצמך?',
    costSeeds: 0,
    renderType: 'wishing_well',
    emoji: '🪣'
  },

  // --- שבילים וגבולות (Paths & Fences) ---
  {
    id: 'cultivated_plot_tile',
    name: 'חלקת דשא מעובדת (Tile חדש)',
    category: 'שבילים וגבולות',
    tag: 'הרחבת גבולות',
    desc: 'הוספת משבצת אדמה מעובדת לכפר — מרחיבה את גבולות הכפר ומאפשרת לבנות עליה.',
    reflectionPrompt: 'איזה תחום חדש בחיים בחרת לפתוח ולהרחיב לאחרונה?',
    costSeeds: 0,
    renderType: 'cultivated_plot_tile',
    isModular: true,
    emoji: '🌱'
  },
  {
    id: 'cobblestone_road',
    name: 'שביל אבן מרוצף (Cobblestone Road)',
    category: 'שבילים וגבולות',
    tag: 'סיפור דרך ומעברים',
    desc: 'ריצוף אבנים רחב, שלם ורציף שמתווה דרך ברורה בין עוגני הזיכרון, הבתים והפינות בכפר.',
    reflectionPrompt: 'איזה חיבור או דרך בין דברים תרצה לסלול היום?',
    costSeeds: 0,
    renderType: 'cobblestone_road',
    isModular: true,
    emoji: '🛤️'
  },
  {
    id: 'stone_path',
    name: 'שביל אבני מדרך טבעי',
    category: 'שבילים וגבולות',
    tag: 'בהירות וסדר',
    desc: 'אבני מדרך טבעיות שמתוות מסלול נעים ומסמלות צעדים קטנים שעושים סדר בראש.',
    reflectionPrompt: 'איזה סדר קטן עזר לך להרגיש קלילות ובהירות?',
    costSeeds: 0,
    renderType: 'stone_path',
    isModular: true,
    emoji: '🪨'
  },
  {
    id: 'wood_path',
    name: 'שביל לוחות עץ כפרי',
    category: 'שבילים וגבולות',
    tag: 'דרך בטוחה',
    desc: 'לוחות עץ ארז חמימים עם ברגים ומרווחים עדינים, יוצרים טיילת מזמינה.',
    reflectionPrompt: 'איזה צעד יומיומי פשוט שומר עליך במסלול הנכון?',
    costSeeds: 0,
    renderType: 'wood_path',
    isModular: true,
    emoji: '🪵'
  },
  {
    id: 'brick_path',
    name: 'שביל לבנים אדומות',
    category: 'שבילים וגבולות',
    tag: 'סדר וחיבור',
    desc: 'ריצוף לבנים אדומות קלאסי ומסודר שיוצר מראה כפרי ציורי ומלא אופי.',
    reflectionPrompt: 'מה עוזר לך להרגיש יציבות ובסיס איתן היום?',
    costSeeds: 0,
    renderType: 'brick_path',
    isModular: true,
    emoji: '🧱'
  },
  {
    id: 'dirt_trail',
    name: 'שביל עפר כפרי (Dirt Trail)',
    category: 'שבילים וגבולות',
    tag: 'טבע וחיבור',
    desc: 'שביל אדמה כפרי טבעי עם שוליים רכים ואבני חצץ עדינות. מחבר ברצף ובנוחות בין שדות, פינות מרעה ומבנים.',
    reflectionPrompt: 'איזה נתיב טבעי ונעים מוביל אותך לשקט היום?',
    costSeeds: 0,
    renderType: 'dirt_trail',
    isModular: true,
    emoji: '🍂'
  },
  {
    id: 'stone_wall',
    name: 'חומת אבן מבצר (סגנון קלאש)',
    category: 'שבילים וגבולות',
    tag: 'מבצר ותיחום',
    desc: 'יחידת חומת אבן גזית מסותתת עם כיסוי מודולרי בסגנון Clash of Clans לבנייה בערמות. יוצרת חומות ומכלאות איתנות שבעלי החיים אינם יכולים לחצות!',
    reflectionPrompt: 'איזה גבול איתן וברור בנית כדי לשמור על הרוגע שלך?',
    costSeeds: 0,
    renderType: 'stone_wall',
    isModular: true,
    emoji: '🧱'
  },
  {
    id: 'wooden_fence',
    name: 'גדר עץ כפרית (מכלאה)',
    category: 'שבילים וגבולות',
    tag: 'מכלאה כפרית',
    desc: 'גדר קורות עץ מודולרית איסומטרית לבנייה בערמות. מצוינת לתחימת מכלאות לחיות וחצרות פרטיות (בעלי החיים אינם יכולים לחצות אותה!).',
    reflectionPrompt: 'איזה גבול בריא הצבת היום כדי לשמור על האנרגיה שלך?',
    costSeeds: 0,
    renderType: 'wooden_fence',
    isModular: true,
    emoji: '🪵'
  },
  {
    id: 'floral_arch',
    name: 'שער קשת פרחים מטפסים',
    category: 'שבילים וגבולות',
    tag: 'התחלה חדשה',
    desc: 'קשת עץ אלגנטית שזורה בפרחי ורדים מטפסים, פתח מזמין לכל פינה קסומה בכפר.',
    reflectionPrompt: 'איזו דלת חדשה פתחת או היית רוצה לפתוח עבורך?',
    costSeeds: 0,
    renderType: 'floral_arch',
    emoji: '💐'
  },

  // --- פינות ישיבה ואווירה (Cozy Living & Leisure) ---
  {
    id: 'custom_totem',
    name: 'פסל עוגן חופשי (אימוג\'י וסמל אישי)',
    category: 'פינות ישיבה ואווירה',
    tag: 'אסוציאציה חופשית',
    desc: 'עמוד אבן מעוצב המאפשר לבחור כל סמל או אימוג\'י בעולם (כמו סוכריית ספירלה 🍭, שעון חול ⏳ ועוד) כעוגן אסוציאטיבי אישי!',
    reflectionPrompt: 'איזה סמל אישי ואסוציאציה תרצה להעניק לעוגן הזה?',
    costSeeds: 0,
    renderType: 'custom_totem',
    isCustomTotem: true,
    defaultEmoji: '🍭',
    emoji: '🍭'
  },
  {
    id: 'story_monument',
    name: 'אנדרטת סיפור חי (מחולל מקוון)',
    category: 'פינות ישיבה ואווירה',
    tag: 'בריאת סיפור',
    desc: 'אנדרטה ייחודית הנוצרת ישירות מסיפור חופשי שכתבת, עם נכסים וקטוריים חיים מהרשת (Iconify), בסיס מפוסל והילה מונפשת!',
    reflectionPrompt: 'איזה סיפור או זיכרון תרצה להפיח בו חיים?',
    costSeeds: 0,
    renderType: 'story_monument',
    isStoryMonument: true,
    defaultEmoji: '📖',
    emoji: '📖'
  },
  {
    id: 'reading_bench',
    name: 'ספסל הרהורים מעץ',
    category: 'פינות ישיבה ואווירה',
    tag: 'מרחב מחשבה',
    desc: 'מקום לשבת, להתבונן במחשבות, לקרוא ספר אהוב או לשתות כוס תה בנחת.',
    reflectionPrompt: 'מתי הרגשת לאחרונה בנוכחות מלאה ובשלווה ברגע?',
    costSeeds: 0,
    renderType: 'reading_bench',
    emoji: '🪵'
  },
  {
    id: 'tea_table',
    name: 'פינת תה כפרית ועוגיות',
    category: 'פינות ישיבה ואווירה',
    tag: 'חמימות מנחמת',
    desc: 'שולחן עץ עגול עם קנקן תה מהביל, כוסות ועוגיות. הזמנה ליהנות מרגע קטן של חסד.',
    reflectionPrompt: 'איזה טעם או פינוק קטן ניחם אותך היום?',
    costSeeds: 0,
    renderType: 'tea_table',
    emoji: '🍵'
  },
  {
    id: 'picnic_blanket',
    name: 'פיקניק וכריות בדשא',
    category: 'פינות ישיבה ואווירה',
    tag: 'הפוגה ומנוחה',
    desc: 'שמיכת פיקניק משובצת, סלסילת פירות ומאפים וכריות רכות למנוחה באוויר הפתוח.',
    reflectionPrompt: 'מתי הענקת לעצמך הפסקה אמיתית ורגע של חוסר מעש מבורך?',
    costSeeds: 0,
    renderType: 'picnic_blanket',
    emoji: '🧺'
  },
  {
    id: 'hammock',
    name: 'ערסל צל בין ענפים',
    category: 'פינות ישיבה ואווירה',
    tag: 'שחרור עמוק',
    desc: 'ערסל מפנק המתנדנד בעדינות ברוח הקלילה בין שני עצים מוצלים.',
    reflectionPrompt: 'מה עוזר לך לשחרר את כל המתח מהגוף ומהראש?',
    costSeeds: 0,
    renderType: 'hammock',
    emoji: '🌴'
  },
  {
    id: 'bonfire',
    name: 'מדורה של חום ולב',
    category: 'פינות ישיבה ואווירה',
    tag: 'חיבור אמיתי',
    desc: 'אש עצים מרצדת ומחממת שסביבה אפשר לשבת, לחלוק סיפורים ולהרגיש ביחד.',
    reflectionPrompt: 'למי אמרת תודה או עם מי חלקת רגע חם ומחזק?',
    costSeeds: 0,
    renderType: 'bonfire',
    emoji: '🔥'
  },
  {
    id: 'lantern_post',
    name: 'עמוד פנס חם',
    category: 'פינות ישיבה ואווירה',
    tag: 'אור ותקווה',
    desc: 'פנס רחוב עתיק המפיץ אור צהוב וחם בשעות הערב, שמזכיר שאתה אף פעם לא בחושך.',
    reflectionPrompt: 'איזו מחשבה או אדם האירו לך את היום?',
    costSeeds: 0,
    renderType: 'lantern_post',
    emoji: '🏮'
  },
  {
    id: 'cozy_tent',
    name: 'אוהל קריאה ומחבוא',
    category: 'פינות ישיבה ואווירה',
    tag: 'מרחב מוגן',
    desc: 'אוהל בד אינטימי עם כריות רכות. המקום שלך להסתתר מהעולם כשצריך קצת שקט.',
    reflectionPrompt: 'מה עוזר לך להרגיש הכי בטוח ומוגן כשמציף בחוץ?',
    costSeeds: 0,
    renderType: 'cozy_tent',
    emoji: '⛺'
  }
];

export const INITIAL_INTENTIONS = [
  {
    id: 'i_1',
    text: 'להקשיב לגוף, לשתות מים בנחת ולנשום',
    category: 'שלווה ונפש',
    seedsEarned: 15,
    completed: false,
    note: 'רגע של דאגה עצמית'
  },
  {
    id: 'i_2',
    text: 'לפנות 15 דקות לקריאה בספר או האזנה למוזיקה שקטה',
    category: 'מנוחה ונפש',
    seedsEarned: 20,
    completed: false,
    note: 'הזנת המחשבה בשקט'
  },
  {
    id: 'i_3',
    text: 'לצאת להליכה קצרה באוויר הפתוח ללא טלפון',
    category: 'תנועה ובריאות',
    seedsEarned: 20,
    completed: false,
    note: 'נשימה עמוקה וחיבור לטבע'
  },
  {
    id: 'i_4',
    text: 'לשתות כוס תה חם ולהרפות את הכתפיים',
    category: 'רגעים קטנים',
    seedsEarned: 15,
    completed: false,
    note: 'הפוגה מנחמת'
  },
  {
    id: 'i_5',
    text: 'להגיד לעצמי מילה טובה על הדרך שעשיתי',
    category: 'מקום בטוח',
    seedsEarned: 25,
    completed: false,
    note: 'חמלה עצמית'
  }
];

export const WARM_AFFIRMATIONS = [
  'זהו המרחב הבטוח שלך — כאן אין שיפוט, אין ממהרים, רק צמיחה שקטה.',
  'הכפר שלך גדל בקצב שלך, בדיוק כמו שמתאים לך היום.',
  'כל עץ קטן, ספסל או מזרקה הם עדות לרגע שבו בחרת בטוב עבורך.',
  'מותר לעצור, מותר לנוח, מותר פשוט להיות כאן ועכשיו.',
  'הדברים היפים ביותר בחיים צומחים לאט ובאהבה.'
];
