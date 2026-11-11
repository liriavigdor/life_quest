import fs from 'fs';

const UNIVERSAL_ICONS = [
  // ==========================================
  // 1. אגדות ספורט ועוצמה פיזית 🥊⚽🏀
  // ==========================================
  {
    id: 'mike_tyson',
    name: 'מייק טייסון',
    nickname: 'טייסון',
    englishName: 'Mike Tyson',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '🥊',
    themeColor: '#7f1d1d',
    accentColor: '#f87171',
    badge: 'אגרוף ונוקאאוט אימתני',
    associations: [
      'אגרוף', 'חזק', 'מסוכן', 'עוצמה', 'נוקאאוט', 'זירה', 'שרירים', 'כפפות',
      'קרב', 'אלוף עולם', 'קעקוע', 'אפרקאט', 'מגן שיניים', 'זעם', 'חבטה'
    ],
    iconicProp: 'כפפות איגרוף עור שחורות וקעקוע פנים שבטי',
    catchphrase: '"Everyone has a plan until they get punched in the mouth!"',
    bizarreActions: [
      'מנחית אגרוף ימני מוחץ ומפיל לקרשים',
      'חובט בעוצמת נוקאאוט אימתנית אל תוך',
      'שואג בזירה עם חגורת אלוף עולם זהב סביב',
      'שובר שק אגרוף כבד בידיים חשופות ליד'
    ],
    guidedImagery: (item) => `מייק טייסון, עם קעקוע פנים מאיים וכפפות עור שחורות, חובט באגרוף אימתני שמרעיד את הזירה ומנחית נוקאאוט מוחץ על ${item}!`,
    synthesisSnippet: (item) => `טייסון הנחית אגרוף נוקאאוט עוצמתי על ה-${item}`
  },
  {
    id: 'muhammad_ali',
    name: 'מוחמד עלי',
    nickname: 'עלי',
    englishName: 'Muhammad Ali',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '🦋',
    themeColor: '#1e3a8a',
    accentColor: '#60a5fa',
    badge: 'מרחף כמו פרפר עוקץ כדבורה',
    associations: [
      'פרפר', 'דבורה', 'הגדול מכולם', 'אגדה', 'זריזות', 'אגרוף', 'ריחוף',
      'אלוף', 'עקיצה', 'ביטחון', 'חבלים', 'מהירות', 'תנועה'
    ],
    iconicProp: 'חלוק איגרוף סאטן לבן עם אותיות זהב THE GREATEST',
    catchphrase: '"Float like a butterfly, sting like a bee!"',
    bizarreActions: [
      'מרחף כמו פרפר ועוקץ כמו דבורה לתוך',
      'מתחמק בסדרת תנועות ראש מהירות מ-',
      'מכריז בקול רם שהוא הגדול מכולם מעל',
      'קופץ על חבלי הזירה ומנופף ביד אל'
    ],
    guidedImagery: (item) => `מוחמד עלי בחלוק סאטן לבן מרחף על רגליו כמו פרפר ורוקד בזירה. לפתע הוא עוקץ כדבורה ומעיף באוויר ${item}!`,
    synthesisSnippet: (item) => `מוחמד עלי ריחף כמו פרפר ועקץ את ה-${item}`
  },
  {
    id: 'michael_phelps',
    name: 'מייקל פלפס',
    nickname: 'פלפס',
    englishName: 'Michael Phelps',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '🥇',
    themeColor: '#0369a1',
    accentColor: '#38bdf8',
    badge: '28 מדליות זהב ושיאי עולם',
    associations: [
      'הצטיינות', 'אלוף', 'בריכה', 'מים', 'שחייה', 'מדליות', 'שיא', 'זהב',
      'מהיר', 'אולימפיאדה', 'משקפת', 'שרירים', 'כושר', 'סגנון פרפר', 'נצחון'
    ],
    iconicProp: '28 מדליות זהב אולימפיות על הצוואר ומשקפת שחייה מקצועית',
    catchphrase: '"You can\'t put a limit on anything. The more you dream, the farther you get."',
    bizarreActions: [
      'מזנק ראש לבריכה אולימפית ודוחף קדימה',
      'עונד ערימת 28 מדליות זהב יחד עם',
      'שוחה בסגנון פרפר סוער שיוצר גלי ענק סביב',
      'שובר שיא עולם חדש בעזרת'
    ],
    guidedImagery: (item) => `מייקל פלפס, עטור 28 מדליות זהב כבדות ומשקפת שחייה, מזנק ראש לבריכה אולימפית ודוחף קדימה ${item} במהירות שיא!`,
    synthesisSnippet: (item) => `מייקל פלפס שחה כמו כריש עם 28 מדליות והרים את ה-${item}`
  },
  {
    id: 'cristiano_ronaldo',
    name: 'כריסטיאנו רונאלדו',
    nickname: 'רונאלדו',
    englishName: 'Cristiano Ronaldo',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '⚽',
    themeColor: '#b91c1c',
    accentColor: '#f59e0b',
    badge: 'חולצה מספר 7 ו-Siuuu',
    associations: [
      'חולצה', 'כדורגל', 'שרירים', 'אימון', 'שער', 'סיו', 'siuuu', 'ספורט',
      'פרארי', 'אתלט', 'בעיטה', 'גולים', 'ריבועים בבטן', 'קפיצה', 'כושר'
    ],
    iconicProp: 'חולצת כדורגל מספר 7 אדומה וכדורגל זהב',
    catchphrase: '"SIUUUU! Hard work beats talent when talent doesn\'t work hard."',
    bizarreActions: [
      'קורע מעליו את החולצה, קופץ באוויר וצועק SIUUUU מעל',
      'בועט בעיטת פצצה אדירה לחיבורים הישר לתוך',
      'נוהג בפרארי אדומה ומחליף חולצה נקייה לצד',
      'מבצע 1,000 כפיפות בטן ומאזן על החזה'
    ],
    guidedImagery: (item) => `כריסטיאנו רונאלדו קורע מעליו את החולצה, קופץ סיבוב 180 מעלות באוויר ושואג 'SIUUUU!' כשהוא בועט פצצה לחיבורים ומעיף ${item}!`,
    synthesisSnippet: (item) => `רונאלדו קרע את החולצה ושאג SIUUU מעל ה-${item}`
  },
  {
    id: 'leo_messi',
    name: 'ליאו מסי',
    nickname: 'מסי',
    englishName: 'Lionel Messi',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '🏆',
    themeColor: '#0284c7',
    accentColor: '#fbbf24',
    badge: 'גביע העולם ודריבל גאוני',
    associations: [
      'כדורגל', 'קסם', 'ארגנטינה', 'זריזות', 'דריבל', 'גביע העולם', 'מונדיאל',
      'אלוף', 'קטן', 'גאון כדורגל', 'רגל שמאל', 'מסירה', 'גול', 'גביע'
    ],
    iconicProp: 'גביע העולם המוזהב וחולצת פסים תכלת-לבן',
    catchphrase: '"You have to fight to reach your dream. You have to sacrifice and work hard for it."',
    bizarreActions: [
      'מכדרר בסלאלום בין חמישה שחקנים ומקפיץ',
      'מחבק באהבה את גביע העולם המוזהב יחד עם',
      'מסובב כדור חופשי מושלם ברגל שמאל לתוך',
      'מאיץ במהירות ברק קדימה עם'
    ],
    guidedImagery: (item) => `ליאו מסי מנשק את גביע העולם המוזהב. ברגל שמאל הקסומה שלו הוא מקפיץ בעדינות מושלמת ${item} זוהר ישר מעל השוער לתוך השער!`,
    synthesisSnippet: (item) => `מסי הקפיץ ברגל שמאל את ה-${item} אל תוך גביע העולם`
  },
  {
    id: 'michael_jordan',
    name: 'מייקל ג\'ורדן',
    nickname: 'ג\'ורדן',
    englishName: 'Michael Jordan',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '🏀',
    themeColor: '#dc2626',
    accentColor: '#18181b',
    badge: 'הטבעה מקו העונשין ו-23',
    associations: [
      'כדורסל', 'מספר 23', 'דאנק', 'הטבעה', 'לשון', 'נעליים', 'אייר ג\'ורדן',
      'אגדה', 'ריחוף', 'טבעת אליפות', 'ווינר', 'תחרותי', 'סל', 'סניקרס'
    ],
    iconicProp: 'נעלי Air Jordan אדומות וגופיית שיקגו בולס 23',
    catchphrase: '"I can accept failure, but I can\'t accept not trying."',
    bizarreActions: [
      'מרחף באוויר מקו העונשין, מוציא לשון ומטביע',
      'נועל נעלי אייר ג\'ורדן אדומות וקופץ מעל',
      'עונד שש טבעות אליפות זהב ומסובב על האצבע',
      'קולע סל ניצחון בשנייה האחרונה דרך'
    ],
    guidedImagery: (item) => `מייקל ג'ורדן בגופייה 23 מרחף באוויר מקו העונשין, מוציא לשון ארוכה ומטביע דאנק מפלצתי שמנפץ לוח זכוכית מעל ${item}!`,
    synthesisSnippet: (item) => `מייקל ג'ורדן הוציא לשון והטביע דאנק אדיר על ה-${item}`
  },
  {
    id: 'usain_bolt',
    name: 'יוסיין בולט',
    nickname: 'בולט',
    englishName: 'Usain Bolt',
    category: 'sports',
    categoryLabel: 'ספורט ועוצמה',
    emoji: '⚡',
    themeColor: '#ca8a04',
    accentColor: '#16a34a',
    badge: 'מהירות שיא ותנועת חץ הברק',
    associations: [
      'מהירות', 'ברק', 'ריצה', 'ספרינט', 'ג\'מייקה', '100 מטר', 'שיא עולם',
      'תנועת חץ', 'נעלי זהב', 'רוח', 'אצן', 'מסלול', 'חיוך', 'מדליית זהב'
    ],
    iconicProp: 'נעלי ספרינט מוזהבות ותנועת חץ הברק בידיים',
    catchphrase: '"I don\'t think limits. Forever fastest!"',
    bizarreActions: [
      'טס בריצת ספרינט של 44 קמ"ש ועוקף ברוח סערה את',
      'נעמד בתנוחת חץ הברק המפורסמת ומצביע לעבר',
      'חוצה את קו הסיום ומניף מדליית זהב יחד עם',
      'משאיר שובל עשן על מסלול הריצה מאחורי'
    ],
    guidedImagery: (item) => `יוסיין בולט פותח מבערים בריצת 100 מטר במהירות על-קולית. הוא חוצה את קו הסיום, עושה את תנוחת חץ הברק ומאזן על החזה ${item}!`,
    synthesisSnippet: (item) => `יוסיין בולט טס בספרינט עולמי והניף את חץ הברק מעל ה-${item}`
  },

  // ==========================================
  // 2. אנימציה, קומיקס וגיימינג 🍄
  // ==========================================
  {
    id: 'mickey_mouse',
    name: 'מיקי מאוס',
    nickname: 'מיקי',
    englishName: 'Mickey Mouse',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🐭',
    themeColor: '#dc2626',
    accentColor: '#f87171',
    badge: 'קסם, דיסני ואוזניים שחורות',
    associations: [
      'מצויר', 'חמוד', 'עכבר', 'דיסני', 'קסם', 'כפפות לבנות', 'אוזניים שחורות',
      'פארק שעשועים', 'נוסטלגיה', 'שריקה', 'טירה', 'קלאסיקה', 'מכנסיים אדומים'
    ],
    iconicProp: 'אוזניים שחורות עגולות וכפפות קסם לבנות',
    catchphrase: '"Hot dog! Meeska, Mooska, Mickey Mouse!"',
    bizarreActions: [
      'שורק במרץ ומנופף בכפפה לבנה ענקית מעל',
      'מוציא מתוך הכובע המכושף של דיסני',
      'רוקד בנעליים צהובות ענקיות מסביב ל-',
      'מפזר אבקת פיות נוצצת שמרחפת מעל'
    ],
    guidedImagery: (item) => `מיקי מאוס באוזניים שחורות עגולות וכפפות לבנות שורק במרץ! הוא שולף מתוך טירת דיסני ${item} עטוף בסרטים נוצצים וזיקוקים צבעוניים!`,
    synthesisSnippet: (item) => `מיקי מאוס שרק ופיזר אבקת קסם מעל ה-${item}`
  },
  {
    id: 'spongebob',
    name: 'בובספוג מכנסמרובע',
    nickname: 'בובספוג',
    englishName: 'SpongeBob SquarePants',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🧽',
    themeColor: '#eab308',
    accentColor: '#facc15',
    badge: 'קציצת סרטן ותמימות',
    associations: [
      'ספוג', 'צהוב', 'אוקיינוס', 'המבורגר', 'קציצת סרטן', 'צחוק', 'תמימות',
      'מדוזה', 'בועות', 'חיוך', 'ביקיני בוטום', 'שף', 'מרית', 'מכנסיים מרובעים'
    ],
    iconicProp: 'מרית בישול מוזהבת וקציצת סרטן עסיסית',
    catchphrase: '"I\'m ready! I\'m ready! A-ha-ha-ha!"',
    bizarreActions: [
      'צולה על מחבת רותחת במקום קציצת סרטן',
      'צוחק בצחוק מתגלגל ונושף בועות מתוך',
      'צד מדוזות ורודות באמצעות',
      'סופג את כל המים בקרקעית הים סביב'
    ],
    guidedImagery: (item) => `בובספוג הצהוב צועק 'אני מוכן!' וצוחק את הצחוק המתגלגל שלו. הוא תופס מרית נירוסטה וצולה על הגריל הרותח ${item} במקום קציצת סרטן!`,
    synthesisSnippet: (item) => `בובספוג צלה על מחבת רותחת את ה-${item}`
  },
  {
    id: 'super_mario',
    name: 'סופר מריו',
    nickname: 'מריו',
    englishName: 'Super Mario',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🍄',
    themeColor: '#ef4444',
    accentColor: '#f87171',
    badge: 'פטריות, צינורות וקפיצות',
    associations: [
      'אינסטלטור', 'שפם', 'כובע אדום', 'פטריות', 'צינורות', 'קפיצה', 'מטבעות',
      'גיימינג', 'נסיכה', 'צבים', 'כוכב', 'נינטנדו', 'סרבל כחול'
    ],
    iconicProp: 'פטריית קסם אדומה מנוקדת וכובע אדום עם M',
    catchphrase: '"It\'s-a me, Mario! Yahoo!"',
    bizarreActions: [
      'קופץ באגרוף מורם ושובר בלוק לבנים שממנו עף',
      'אוכל פטריית קסם וגדל לפי עשר ליד',
      'צולל לתוך צינור ביוב ירוק כשהוא מחזיק',
      'רוכב על יושי הדינוזאור ובולע בלשון'
    ],
    guidedImagery: (item) => `סופר מריו בסרבל כחול ושפם שחור קופץ באוויר וצועק 'Yahoo!'. האגרוף שלו מרסק בלוק לבנים מוזהב, ומתוכו מתעופף ${item} נוצץ!`,
    synthesisSnippet: (item) => `סופר מריו קפץ באגרוף ושבר בלוק שהעיף את ה-${item}`
  },
  {
    id: 'pikachu',
    name: 'פיקאצ\'ו',
    nickname: 'פיקאצ\'ו',
    englishName: 'Pikachu',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '⚡',
    themeColor: '#eab308',
    accentColor: '#fde047',
    badge: 'מכת ברק צהובה ופוקימון',
    associations: [
      'חשמל', 'צהוב', 'פוקימון', 'ברק', 'חמוד', 'אנימה', 'זנב', 'כדור',
      'פוקדור', 'אגדי', 'קרב', 'אלקטרוני', 'לחיים אדומות', 'ניצוצות'
    ],
    iconicProp: 'זנב ברק צהוב ולחיים אדומות פולטות ניצוצות',
    catchphrase: '"Pika-Pika... PIKACHUUUU!"',
    bizarreActions: [
      'יורה מכת ברק של 100,000 וולט ומחשמל את',
      'מזנק מתוך פוקדור אדום-לבן ונוחת על',
      'טוען באנרגיה חשמלית זוהרת את',
      'מכשכש בזנב הברק שלו ומרסק'
    ],
    guidedImagery: (item) => `הלחיים האדומות של פיקאצ'ו מתמלאות בניצוצות חשמל! הוא שואג 'פיקה-צ'וווו!' ומשגר מכת ברק מחשמלת של 100,000 וולט ישר לתוך ${item}!`,
    synthesisSnippet: (item) => `פיקאצ'ו שיגר מכת ברק מחשמלת לתוך ה-${item}`
  },
  {
    id: 'batman',
    name: 'באטמן',
    nickname: 'באטמן',
    englishName: 'Batman',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🦇',
    themeColor: '#09090b',
    accentColor: '#71717a',
    badge: 'האביר האפל ובאטרנג',
    associations: [
      'עטלף', 'שחור', 'גלימה', 'מסכה', 'גותהאם', 'בלש', 'מיליארדר', 'צדק',
      'לילה', 'רכב עטלף', 'מערה', 'באטמוביל', 'גיבור על', 'צללים'
    ],
    iconicProp: 'גלימת עטלף שחורה ובאטרנג מתכת חד',
    catchphrase: '"I am vengeance. I am the night. I am Batman!"',
    bizarreActions: [
      'צונח מגג גורד שחקים בגלימה שחורה על',
      'שולף בומראנג עטלף שחור ומשפד',
      'מפעיל את מנוע הטורבו של הבאטמוביל כדי לדרוס',
      'מזנק מתוך הצללים של הלילה ואוחז'
    ],
    guidedImagery: (item) => `סמל העטלף מוקרן על ענני הלילה. באטמן צונח מגג גורד שחקים כשגלימתו מתנפנפת, ונוחת בעוצמה כשבידו באטרנג חד הנעוץ ב-${item}!`,
    synthesisSnippet: (item) => `באטמן צנח מבין הצללים ונעץ את הבאטרנג ב-${item}`
  },
  {
    id: 'spiderman',
    name: 'ספיידרמן',
    nickname: 'ספיידרמן',
    englishName: 'Spider-Man',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🕷️',
    themeColor: '#b91c1c',
    accentColor: '#2563eb',
    badge: 'קורי עכביש ואקרובטיקה',
    associations: [
      'עכביש', 'קורים', 'טיפוס', 'אדום כחול', 'ניו יורק', 'גמישות', 'גיבור על',
      'מסיכה', 'קפיצה', 'חוש עכביש', 'פיטר פארקר', 'קירות', 'רשת'
    ],
    iconicProp: 'יורה קורים מפרק כף היד ומסכה אדומה',
    catchphrase: '"With great power comes great responsibility!"',
    bizarreActions: [
      'יורה סילון קורים דביק ועוטף לחלוטין את',
      'מתנדנד הפוך מהתקרה ומושיט יד אל',
      'מטפס בריצה על קיר זכוכית חלק תוך נשיאת',
      'מרגיש עקצוץ של חוש עכביש שמתריע על'
    ],
    guidedImagery: (item) => `ספיידרמן תלוי הפוך מקור עכביש בין שני גורדי שחקים. הוא יורה בתנועת שתי אצבעות רשת קורים דביקה ולופת איתה במהירות שיא ${item}!`,
    synthesisSnippet: (item) => `ספיידרמן ירה קורי עכביש ולכד את ה-${item}`
  },
  {
    id: 'homer_simpson',
    name: 'הומר סימפסון',
    nickname: 'הומר',
    englishName: 'Homer Simpson',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🍩',
    themeColor: '#eab308',
    accentColor: '#38bdf8',
    badge: 'דונאטס וספה',
    associations: [
      'דונאטס', 'בירה', 'שמן', 'צהוב', 'עצלן', 'טלוויזיה', 'כורסה',
      'טיפש', 'צחוק', 'ספה', 'ספרינגפילד', 'קרחת', 'אוכל', 'חטיפים'
    ],
    iconicProp: 'דונאט ורוד עם סוכריות צבעוניות ופחית בירה',
    catchphrase: '"D\'oh! Mmm... donuts!"',
    bizarreActions: [
      'צועק D\'oh! ותופס את הראש כשהוא רואה',
      'בולע בשלמותו כאילו היה דונאט ורוד',
      'שוכב על הספה ושותה בירה כשהוא מניח על הבטן',
      'נרדם מול הטלוויזיה ומפיל מהיד'
    ],
    guidedImagery: (item) => `הומר סימפסון הצהוב עם כרס ענקית צועק 'D'oh!'. הוא פותח לוע ענק ובולע ${item} שלם במחשבה שזה דונאט ורוד עם סוכריות!`,
    synthesisSnippet: (item) => `הומר סימפסון בלע בשלמות את ה-${item} וצעק D'oh!`
  },
  {
    id: 'darth_vader',
    name: 'דארת\' ויידר',
    nickname: 'ויידר',
    englishName: 'Darth Vader',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '⚔️',
    themeColor: '#18181b',
    accentColor: '#dc2626',
    badge: 'חרב אור אדומה ונשימות כבדות',
    associations: [
      'מלחמת הכוכבים', 'קסדה שחורה', 'חרב אור אדומה', 'נשימות', 'כוח', 'נבל',
      'גלקסיה', 'אימפריה', 'אבא', 'חללית', 'גלימה שחורה', 'כוכב המוות'
    ],
    iconicProp: 'חרב אור לייזר אדומה וקסדה שחורה מבריקה',
    catchphrase: '"I am your father! You don\'t know the power of the dark side."',
    bizarreActions: [
      'מרים בכוח המחשבה הטלקינטי של ה-Force את',
      'מדליק חרב אור אדומה ששורפת ומבתרת לחצי',
      'נושם נשימות כבדות ומכריז שהוא האבא של',
      'צועד בגלימה שחורה מתנפנפת ומוחץ ביד אחת'
    ],
    guidedImagery: (item) => `קול נשימות מכניות כבדות מהדהד בחושך. לפתע נדלקת חרב אור אדומה ומסנוורת! דארת' ויידר מושיט יד שחורה ומרים בכוח המחשבה ${item} מרחף!`,
    synthesisSnippet: (item) => `דארת' ויידר הניף חרב אור אדומה והרים ב-Force את ה-${item}`
  },
  {
    id: 'harry_potter',
    name: 'הארי פוטר',
    nickname: 'הארי פוטר',
    englishName: 'Harry Potter',
    category: 'cartoons_gaming',
    categoryLabel: 'אנימציה וגיימינג',
    emoji: '🪄',
    themeColor: '#7f1d1d',
    accentColor: '#fbbf24',
    badge: 'שרביט קסמים ומשקפיים עגולים',
    associations: [
      'קסם', 'שרביט', 'משקפיים עגולים', 'צלקת ברק', 'הוגוורטס', 'כישוף',
      'מטאטא', 'ינשוף', 'גלימה', 'שיקוי', 'לחש', 'אברקדברה', 'ווינגארדיום'
    ],
    iconicProp: 'שרביט עץ קסום ומשקפי ראייה עגולים עם צלקת ברק',
    catchphrase: '"Expecto Patronum! Wingardium Leviosa!"',
    bizarreActions: [
      'מנופף בשרביט קסמים וצועק Wingardium Leviosa מעל',
      'מרחף על מטאטא מעופף ותופס סניץ\' מוזהב ליד',
      'מטיל לחש הגנה Expecto Patronum ומאיר בקרן כסופה',
      'חובש את מצנפת המיון ומגלה בתוכה'
    ],
    guidedImagery: (item) => `הארי פוטר במשקפיים עגולים וצלקת ברק על המצח שולף שרביט עץ! הוא מנופף בו וצועק 'Wingardium Leviosa!' כשהוא גורם ל-${item} לרחף באוויר באור כסוף!`,
    synthesisSnippet: (item) => `הארי פוטר נופף בשרביט והרים בקסם את ה-${item}`
  },

  // ==========================================
  // 3. קולנוע, מסך ותרבות עולמית 🎬
  // ==========================================
  {
    id: 'charlie_chaplin',
    name: 'צ\'ארלי צ\'פלין',
    nickname: 'צ\'פלין',
    englishName: 'Charlie Chaplin',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🎩',
    themeColor: '#1c1917',
    accentColor: '#78716c',
    badge: 'סרט אילם, שפם ומקל הליכה',
    associations: [
      'קולנוע אילם', 'שפם', 'מקל הליכה', 'מגבעת', 'הליכה מצחיקה', 'שחור לבן',
      'קומדיה', 'נעליים ענקיות', 'תמימות', 'מקל', 'מכנסיים רחבים', 'נוסטלגיה'
    ],
    iconicProp: 'מקל הליכה מבמבוק מתעקל ומגבעת שחורה קטנה',
    catchphrase: '"A day without laughter is a day wasted."',
    bizarreActions: [
      'הולך בהליכת ברווז מצחיקה ומסובב את מקל ההליכה סביב',
      'מוריד את המגבעת בקידה מנומסת ומוציא מתוכה',
      'מחליק על קליפת בננה בקומדיית סלאפסטיק מעל',
      'מאזן על קצה הנעל הענקית שלו'
    ],
    guidedImagery: (item) => `המסך הופך לשחור-לבן קלאסי. צ'ארלי צ'פלין בשפם קטנטן ומגבעת שחורה הולך בהליכת ברווז מצחיקה, מסובב מקל הליכה ומאזן על ראשו ${item}!`,
    synthesisSnippet: (item) => `צ'פלין הלך הליכת ברווז אילמת וסובב מקל הליכה סביב ה-${item}`
  },
  {
    id: 'rowan_atkinson',
    name: 'מיסטר בין',
    nickname: 'מיסטר בין',
    englishName: 'Mr. Bean',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🧸',
    themeColor: '#15803d',
    accentColor: '#86efac',
    badge: 'פרצופים מצחיקים ודובי חום',
    associations: [
      'מיסטר בין', 'מכונית מיני', 'דובי', 'פרצופים', 'קומדיה', 'מגושם',
      'עניבה אדומה', 'שקט', 'פאשלות', 'אנגלי', 'הומור', 'צחוק', 'תמימות'
    ],
    iconicProp: 'דובי צמר חום (Teddy) ומכונית מיני ירוקה עם מנעול',
    catchphrase: '"Bean! Mmm... Teddy!"',
    bizarreActions: [
      'מעוות את הפרצוף בצורה גרוטסקית ודוחף לכיס של הדובי',
      'נועל את מכונית המיני הירוקה שלו עם מנעול תלייה סביב',
      'נתקע עם הראש בתוך תרנגול הודו ענקי יחד עם',
      'מועד במגושמות קומית ומפיל'
    ],
    guidedImagery: (item) => `מיסטר בין בחליפת טוויד ועניבה אדומה מעוות את פניו בפרצוף גרוטסקי מצחיק. הוא מחבק את הדובי החום שלו, מועד ומפיל במגושמות קומית ${item}!`,
    synthesisSnippet: (item) => `מיסטר בין עשה פרצוף מצחיק והפיל את ה-${item}`
  },
  {
    id: 'gordon_ramsay',
    name: 'גורדון רמזי',
    nickname: 'גורדון רמזי',
    englishName: 'Gordon Ramsay',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🍳',
    themeColor: '#b91c1c',
    accentColor: '#f97316',
    badge: 'צעקות, מחבתות וכוכבי מישלן',
    associations: [
      'שף', 'צעקות', 'סכין שף', 'מטבח', 'בישול', 'רותח', 'מסעדה',
      'עלבונות', 'סטייק', 'מחבת', 'כוכבי מישלן', 'לחץ', 'בשר', 'מלח'
    ],
    iconicProp: 'סכין שף חדה, סינר לבן ומחבת ברזל רותחת',
    catchphrase: '"It\'s RAW! You donkey! Wake up!"',
    bizarreActions: [
      'דופק באגרוף על השולחן וצועק IT\'S RAW! על',
      'מדביק שתי פרוסות לחם לצד הראש וצועק אידיוט סנדוויץ\' יחד עם',
      'מטיח במחבת ברזל יצוקה רותחת וצולה בשמן עמוק',
      'טועם בביקורתיות קטלנית ומשליך לפח'
    ],
    guidedImagery: (item) => `גורדון רמזי מאדים מזעם במטבח! הוא דופק במחבת ברזל רותחת, צועק 'IT'S RAW! YOU DONKEY!' ומשליך בזעם לתוך מחבת בוערת ${item}!`,
    synthesisSnippet: (item) => `גורדון רמזי צעק It's RAW והטיח במחבת את ה-${item}`
  },
  {
    id: 'arnold_schwarzenegger',
    name: 'ארנולד שוורצנגר',
    nickname: 'שוורצנגר',
    englishName: 'Arnold Schwarzenegger',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🤖',
    themeColor: '#374151',
    accentColor: '#ef4444',
    badge: 'טרמינטור, שרירים ואסטה לה ויסטה',
    associations: [
      'טרמינטור', 'שרירים', 'אסטה לה ויסטה', 'משקפי שמש', 'רובה', 'מבטא',
      'פיתוח גוף', 'אקשן', 'עין אדומה', 'אופנוע', 'ברזל', 'עוצמה', 'משקולות'
    ],
    iconicProp: 'עין קיבורג אדומה מהבהבת ורובה שוטגאן כבד',
    catchphrase: '"Hasta la vista, baby! I\'ll be back!"',
    bizarreActions: [
      'מרכיב משקפי שמש, פותח עין אדומה ולוחש אסטה לה ויסטה ל-',
      'מכופף מוט ברזל עבה בידיים חשופות סביב',
      'רוכב על אופנוע הארלי כבד וטוען ביד אחת',
      'מרים משקולת ברזל עצומה ומאזן מעל'
    ],
    guidedImagery: (item) => `ארנולד שוורצנגר במעיל עור שחור ועין אדומה רובוטית מרכיב משקפי שמש כהים, אומר בקול מתכתי 'Hasta la vista, baby' ומרים בכוח שריריו ${item}!`,
    synthesisSnippet: (item) => `שוורצנגר אמר Hasta la vista baby וטען את ה-${item}`
  },
  {
    id: 'leonardo_dicaprio',
    name: 'ליאונרדו דיקפריו',
    nickname: 'דיקפריו',
    englishName: 'Leonardo DiCaprio',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🥂',
    themeColor: '#0f172a',
    accentColor: '#eab308',
    badge: 'כוס שמפניה ואוסקר',
    associations: [
      'טיטאניק', 'אוסקר', 'זאב מוול סטריט', 'הוליווד', 'שמפניה', 'ספינה',
      'משחק', 'כסף', 'חליפה יוקרתית', 'טוקסידו', 'מסיבה', 'הרמת כוסית'
    ],
    iconicProp: 'כוס שמפניה קריסטל מורמת בחיוך וטוקסידו יוקרתי',
    catchphrase: '"Cheers! I\'m the king of the world!"',
    bizarreActions: [
      'מרים כוס שמפניה נוצצת בחיוך של גטסבי ומשיק אל',
      'עומד בחרטום הטיטאניק וצועק שהוא מלך העולם ליד',
      'מנופף בפסלון אוסקר מוזהב ומחבק בגאווה',
      'יושב ביאכטת פאר וסופר ערימת שטרות ליד'
    ],
    guidedImagery: (item) => `ליאונרדו דיקפריו בטוקסידו שחור מושלם מרים כוס שמפניה קריסטל בחיוך שובה לב כמו בגטסבי הגדול. זיקוקין מתפוצצים כשהוא משיק כוסית אל ${item}!`,
    synthesisSnippet: (item) => `דיקפריו הרים כוסית שמפניה נוצצת לכבוד ה-${item}`
  },
  {
    id: 'sherlock_holmes',
    name: 'שרלוק הולמס',
    nickname: 'שרלוק',
    englishName: 'Sherlock Holmes',
    category: 'cinema_tv',
    categoryLabel: 'קולנוע ומסך',
    emoji: '🔍',
    themeColor: '#451a03',
    accentColor: '#d97706',
    badge: 'זכוכית מגדלת ומקטרת בלשים',
    associations: [
      'בלש', 'זכוכית מגדלת', 'מקטרת', 'תעלומה', 'גאון', 'פשע', 'חקירה',
      'לונדון', 'טביעת אצבע', 'היסק', 'כובע ציידים', 'רמז', 'מסתורין'
    ],
    iconicProp: 'זכוכית מגדלת ענקית עם מסגרת פליז ומקטרת עשן',
    catchphrase: '"Elementary, my dear Watson! The game is afoot."',
    bizarreActions: [
      'מביט דרך זכוכית מגדלת ענקית ובוחן טביעות אצבע על',
      'מעשן מקטרת עץ ומסיק מסקנה גאונית על המקור של',
      'מאתר רמז סודי בלתי נראה בעזרת',
      'פותר תעלומת פשע בלתי אפשרית ומציג'
    ],
    guidedImagery: (item) => `ערפל לונדוני כבד מתפזר. שרלוק הולמס בכובע בלשים מקרב זכוכית מגדלת ענקית לעינו, פולט עשן מקטרת ואומר 'Elementary!' כשהוא חוקר ${item}!`,
    synthesisSnippet: (item) => `שרלוק הולמס בחן בזכוכית מגדלת ופתר את תעלומת ה-${item}`
  },

  // ==========================================
  // 4. מוזיקה ובמה 🎸
  // ==========================================
  {
    id: 'elvis_presley',
    name: 'אלביס פרסלי',
    nickname: 'אלביס',
    englishName: 'Elvis Presley',
    category: 'music',
    categoryLabel: 'מוזיקה ובמה',
    emoji: '🕺',
    themeColor: '#7e22ce',
    accentColor: '#facc15',
    badge: 'שירה, רוקנרול ווגאס',
    associations: [
      'שירה', 'זמר', 'מוזיקה', 'רוקנרול', 'מיקרופון', 'וגאס', 'בלורית', 'מלך',
      'פאות לחיים', 'גיטרה', 'אגן', 'שמלות נוצצות', 'מלך הרוק', 'קול'
    ],
    iconicProp: 'חליפת וגאס לבנה עם יהלומים ומיקרופון זהב',
    catchphrase: '"Thank you, thank you very much! Elvis has left the building!"',
    bizarreActions: [
      'מנענע את האגן בקצב רוקנרול ומעיף את',
      'שר לתוך מיקרופון זהב נוצץ ומקדיש שיר ל-',
      'מסרק את הבלורית השחורה שלו בעזרת',
      'עולה לבמה בווגאס בחליפת נצנצים לבנה ומחזיק'
    ],
    guidedImagery: (item) => `אלביס פרסלי בחליפת נצנצים לבנה מנענע את האגן בקצב רוקנרול סוער, שר בקול קטיפה ומחבק מיקרופון זהב המחובר ל-${item}!`,
    synthesisSnippet: (item) => `אלביס פרסלי נענע את האגן ושר למיקרופון זהב על ה-${item}`
  },
  {
    id: 'michael_jackson',
    name: 'מייקל ג\'קסון',
    nickname: 'מייקל ג\'קסון',
    englishName: 'Michael Jackson',
    category: 'music',
    categoryLabel: 'מוזיקה ובמה',
    emoji: '🧤',
    themeColor: '#09090b',
    accentColor: '#e4e4e7',
    badge: 'מונווק וכפפת יהלומים',
    associations: [
      'מלך הפופ', 'מונווק', 'כפפה לבנה', 'ריקוד', 'כובע שחור', 'שירה',
      'שבירת כוח המשיכה', 'קול גבוה', 'פופ', 'בילי ג\'ין', 'נצנצים', 'הי הי'
    ],
    iconicProp: 'כפפת יהלומים בודדת ביד ימין וכובע פדורה שחור',
    catchphrase: '"Hee-Hee! Shamone! Smooth Criminal!"',
    bizarreActions: [
      'עושה הליכת ירח (Moonwalk) אחורנית תוך כדי גרירת',
      'עומד על קצות האצבעות, צועק Hee-Hee ומפיל',
      'רוכן קדימה בזווית 45 מעלות כנגד כוח המשיכה לצד',
      'זורק את כובע הפדורה השחור שלו ישירות על'
    ],
    guidedImagery: (item) => `מייקל ג'קסון עושה הליכת ירח (Moonwalk) אחורנית בכפפת יהלומים נוצצת, צועק 'Hee-Hee!' ורוכן בזווית 45 מעלות מעל ${item}!`,
    synthesisSnippet: (item) => `מייקל ג'קסון עשה הליכת ירח וצעק Hee-Hee מול ה-${item}`
  },
  {
    id: 'freddie_mercury',
    name: 'פרדי מרקורי',
    nickname: 'פרדי מרקורי',
    englishName: 'Freddie Mercury',
    category: 'music',
    categoryLabel: 'מוזיקה ובמה',
    emoji: '👑',
    themeColor: '#ea580c',
    accentColor: '#facc15',
    badge: 'שפם, אופרה ורוק',
    associations: [
      'רוק', 'קווין', 'שפם', 'פסנתר', 'רפסודיה בוהמית', 'אופרה', 'זמר',
      'הופעה', 'כריזמה', 'מיקרופון חצוי', 'עוצמה', 'כתר', 'גלימה', 'וומבלי'
    ],
    iconicProp: 'מעמד מיקרופון חצוי ביד, שפם עבה וגופייה לבנה',
    catchphrase: '"Ay-Oh! We are the champions, my friends!"',
    bizarreActions: [
      'עומד מול 100,000 צופים באצטדיון וומבלי ושואג Ay-Oh עם',
      'מנגן על פסנתר כנף את רפסודיה בוהמית ומרסק לתוכו',
      'עוטה כתר מלכותי וגלימת קטיפה אדומה ומנשק',
      'מרים את חצי המיקרופון באוויר ומנפץ'
    ],
    guidedImagery: (item) => `פרדי מרקורי עם שפם עבה וגופייה לבנה מניף חצי עמוד מיקרופון באוויר מול אצטדיון שלם, צועק 'Ay-Oh!' ומנגן על פסנתר קלאסי שמעליו רוקד ${item}!`,
    synthesisSnippet: (item) => `פרדי מרקורי שאג בוומבלי וניגן על פסנתר מעל ה-${item}`
  },
  {
    id: 'beethoven',
    name: 'בטהובן',
    nickname: 'בטהובן',
    englishName: 'Ludwig van Beethoven',
    category: 'music',
    categoryLabel: 'מוזיקה ובמה',
    emoji: '🎼',
    themeColor: '#334155',
    accentColor: '#94a3b8',
    badge: 'סימפוניות ופסנתר קלאסי',
    associations: [
      'מוזיקה קלאסית', 'פסנתר', 'סימפוניה', 'חירש', 'מנצח', 'גאון',
      'תווים', 'יצירה', 'אופוס', 'קומפוזיטור', 'תזמורת', 'כינור'
    ],
    iconicProp: 'פסנתר כנף שחור ושרביט ניצוח של תזמורת פילהרמונית',
    catchphrase: '"Music is a higher revelation than all wisdom and philosophy."',
    bizarreActions: [
      'מכה בקלידי הפסנתר בטירוף גאוני ומשמיע את טה-טה-טה-טאם על',
      'מנצח בתנועות ידיים סוערות על תזמורת שלמה שמקיפה',
      'קורע דפי תווים מוזהבים ומרכיב מתוכם',
      'מצמיד את האוזן לרצפה כדי לחוש בוויברציות של'
    ],
    guidedImagery: (item) => `בטהובן עם רעמת שיער סוערת מכה בעוצמה בקלידי פסנתר כנף ומשמיע את הסימפוניה החמישית, כשמתוך הפסנתר מתפרץ ${item} עטוף בתווי זהב!`,
    synthesisSnippet: (item) => `בטהובן ניגן את הסימפוניה החמישית וניצח מעל ה-${item}`
  },
  {
    id: 'bob_marley',
    name: 'בוב מארלי',
    nickname: 'בוב מארלי',
    englishName: 'Bob Marley',
    category: 'music',
    categoryLabel: 'מוזיקה ובמה',
    emoji: '🌿',
    themeColor: '#15803d',
    accentColor: '#eab308',
    badge: 'ראסטות, שלום ורגאיי',
    associations: [
      'רגאיי', 'ראסטות', 'שלום', 'אהבה', 'גיטרה אקוסטית', 'ג\'מייקה', 'חיוך',
      'חופש', 'ירוק צהוב אדום', 'מוזיקה', 'שמש', 'שלווה', 'נוסטלגיה'
    ],
    iconicProp: 'גיטרה אקוסטית מעץ וראסטות ארוכות עטופות בכומתה צבעונית',
    catchphrase: '"One love, one heart! Let\'s get together and feel all right."',
    bizarreActions: [
      'מנענע את הראסטות הארוכות שלו ופורט על גיטרה ל-',
      'שר בלדת שלום מחייכת ומחבק בחום',
      'יושב תחת עץ דקל טרופי ורוקם כומתת צמר עבור',
      'מדליק צלילי רגאיי מרגיעים שמרפאים את'
    ],
    guidedImagery: (item) => `בוב מארלי עם ראסטות מתנפנפות פורט על גיטרה אקוסטית מול שקיעה טרופית, שר 'One Love' בחיוך קורן ומניח על החול ${item} עטוף בשלווה!`,
    synthesisSnippet: (item) => `בוב מארלי פרט על גיטרה ושר שיר שלום על ה-${item}`
  },

  // ==========================================
  // 5. הייטק, מדע והמצאות 🚀⚛️
  // ==========================================
  {
    id: 'albert_einstein',
    name: 'אלברט איינשטיין',
    nickname: 'איינשטיין',
    englishName: 'Albert Einstein',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '⚛️',
    themeColor: '#4f46e5',
    accentColor: '#818cf8',
    badge: 'גאונות ויחסות',
    associations: [
      'מדע', 'פיזיקה', 'גאון', 'שיער פרוע', 'תורת היחסות', 'לשון', 'חלל', 'זמן',
      'אנרגיה', 'אטום', 'לוח גיר', 'נוסחה', 'מחקר', 'שפם', 'חוכמה', 'מתמטיקה'
    ],
    iconicProp: 'לוח גיר ענק מלא נוסחאות ולשון בחוץ',
    catchphrase: '"E=mc²! Imagination is more important than knowledge."',
    bizarreActions: [
      'מוציא לשון מול המצלמות ומאזן על קצה האף',
      'כותב בגיר לבן נוסחת יחסות מורכבת על גבי',
      'מכופף את מרחב הזמן והחלל סביב',
      'מחשב את מסת האנרגיה המדויקת של'
    ],
    guidedImagery: (item) => `אלברט איינשטיין עם שיער לבן פרוע מוציא לשון מולך! הוא תופס גיר ורושם בטירוף על לוח ענק E=mc² כשבמרכז הנוסחה מתנוסס ${item}!`,
    synthesisSnippet: (item) => `איינשטיין הוציא לשון וחישב את הנוסחה של ה-${item}`
  },
  {
    id: 'isaac_newton',
    name: 'אייזק ניוטון',
    nickname: 'ניוטון',
    englishName: 'Isaac Newton',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '🍎',
    themeColor: '#166534',
    accentColor: '#4ade80',
    badge: 'תפוח וכוח המשיכה',
    associations: [
      'תפוח', 'כוח משיכה', 'עץ', 'פיזיקה', 'כבידה', 'חוקי התנועה',
      'מדען', 'מתמטיקה', 'גילוי', 'פריסקופ', 'מנסרה', 'אור', 'טלסקופ'
    ],
    iconicProp: 'תפוח עץ אדום שנופל מהענף וטלסקופ מראות עתיק',
    catchphrase: '"If I have seen further, it is by standing on the shoulders of giants."',
    bizarreActions: [
      'יושב תחת עץ תפוחים וחובט בראשו תפוח שנופל על',
      'מנסח את חוק הכבידה העולמי באמצעות',
      'מפרק אלומת אור שמש דרך מנסרת זכוכית לעבר',
      'מחשב את מסלול התנועה של'
    ],
    guidedImagery: (item) => `אייזק ניוטון יושב תחת עץ תפוחים עתיק. לפתע נופל תפוח אדום הישר על ראשו, והוא קופץ ומכריז על גילוי כוח המשיכה כשהוא מרים ${item}!`,
    synthesisSnippet: (item) => `ניוטון גילה את כוח המשיכה כשתפוח נפל מעל ה-${item}`
  },
  {
    id: 'steve_jobs',
    name: 'סטיב ג\'ובס',
    nickname: 'ג\'ובס',
    englishName: 'Steve Jobs',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '🍏',
    themeColor: '#18181b',
    accentColor: '#a1a1aa',
    badge: 'חזון, עיצוב ואייפון',
    associations: [
      'טלפון', 'אייפון', 'מחשב', 'אפל', 'מינימליזם', 'שחור', 'גולף', 'מצגת',
      'חדשנות', 'עיצוב', 'מקינטוש', 'זכוכית', 'טאבלט', 'חזון', 'אייפד'
    ],
    iconicProp: 'אייפון שחור דקיק וחולצת גולף שחורה',
    catchphrase: '"One more thing... It just works!"',
    bizarreActions: [
      'שולף בדרמטיות מכיס הג\'ינס הקטן',
      'מציג על במת אפל החשוכה מול מיליונים',
      'מלטש בזכוכית מחוסמת ובאלומיניום שחור',
      'מודיע שזה המוצר שישנה את האנושות'
    ],
    guidedImagery: (item) => `סטיב ג'ובס בחולצת גולף שחורה לוחש על הבמה 'One more thing...'. הוא מכניס יד לכיס הקטן ושולף ${item} מלוטש מזכוכית נוצצת!`,
    synthesisSnippet: (item) => `סטיב ג'ובס שלף בדרמטיות את ה-${item} והציג אותו כאייפון הבא`
  },
  {
    id: 'elon_musk',
    name: 'אילון מאסק',
    nickname: 'מאסק',
    englishName: 'Elon Musk',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '🚀',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    badge: 'טסלה, רקטות ומאדים',
    associations: [
      'גאון', 'חדשנות', 'טכנולוגיה', 'פורץ דרך', 'טסלה', 'מגלומן', 'חלל', 'רקטה',
      'מאדים', 'עשיר', 'סייברטראק', 'טוויטר', 'אקס', 'בינה מלאכותית', 'סוללה'
    ],
    iconicProp: 'דגם רקטת ספייס-אקס וסייברטראק מנירוסטה',
    catchphrase: '"Next stop: Mars! To infinity and beyond!"',
    bizarreActions: [
      'משגר לחלל בתוך טיל ספייס-אקס',
      'נוהג בסייברטראק מנירוסטה ודורס',
      'מרכיב שבב מוח נויראלי לתוך',
      'מצייץ בטוויטר שרכש מיליארד יחידות של'
    ],
    guidedImagery: (item) => `אילון מאסק במעיל עור על כן שיגור רקטות צועק 'שגר למאדים!' ומשגר לחלל ${item} על גבי טיל ענק של ספייס אקס!`,
    synthesisSnippet: (item) => `אילון מאסק שיגר למאדים את ה-${item}`
  },
  {
    id: 'nikola_tesla',
    name: 'ניקולה טסלה',
    nickname: 'טסלה',
    englishName: 'Nikola Tesla',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '⚡',
    themeColor: '#7c3aed',
    accentColor: '#a78bfa',
    badge: 'ברקים וזרם חילופין',
    associations: [
      'חשמל', 'זרם חילופין', 'ברקים', 'מגנט', 'מדען', 'המצאה', 'יונים',
      'אלחוטי', 'מתח גבוה', 'עתידנות', 'אנרגיה', 'סליל טסלה'
    ],
    iconicProp: 'סליל חשמלי שפולט ניצוצות כחולים',
    catchphrase: '"If you want to find the secrets of the universe, think in energy, frequency and vibration."',
    bizarreActions: [
      'מחשמל בזרם חילופין של מיליון וולט את',
      'מכוון סליל ברקים כחול ומדליק',
      'שולח אותות רדיו אלחוטיים מסתוריים ל-',
      'מאזן באוויר באמצעות שדה מגנטי עוצמתי'
    ],
    guidedImagery: (item) => `ברקים כחולים מתפצלים מסליל מתכת ענקי! ניקולה טסלה עומד בלי למצמץ בתוך סופת הניצוצות, ומחזיק בידו ${item} שנטען במתח חשמלי!`,
    synthesisSnippet: (item) => `טסלה חישמל במיליון וולט את ה-${item}`
  },
  {
    id: 'bill_gates',
    name: 'ביל גייטס',
    nickname: 'גייטס',
    englishName: 'Bill Gates',
    category: 'tech_science',
    categoryLabel: 'הייטק ומדע',
    emoji: '💻',
    themeColor: '#0284c7',
    accentColor: '#38bdf8',
    badge: 'תוכנה וחלונות Windows',
    associations: [
      'מיקרוסופט', 'חלונות', 'מחשב', 'תוכנה', 'משקפיים', 'פילנתרופיה', 'חיסונים',
      'קוד', 'עשיר', 'חנון', 'מקלדת', 'וינדוס', 'אופיס', 'עכבר מחשב', 'מסך'
    ],
    iconicProp: 'מחשב נייד ישן עם לוגו Windows ומשקפי ראייה',
    catchphrase: '"A computer on every desk and in every home!"',
    bizarreActions: [
      'מתקין גרסת Windows חדשה בתוך',
      'קופץ מעל כיסא משרדי תוך כדי שהוא מאזן',
      'תורם מיליארד דולר למחקר עבור',
      'מקליד קוד תוכנה מהיר שמפעיל'
    ],
    guidedImagery: (item) => `ביל גייטס במשקפיים עגולים פותח לפטופ ישן, וצליל הפתיחה הקלאסי של Windows משמיע פיצוץ שמתוכו נפלט ${item} זוהר!`,
    synthesisSnippet: (item) => `ביל גייטס התקין Windows על גבי ה-${item}`
  },

  // ==========================================
  // 6. ארכיטיפים היסטוריים מוסכמים 🏛️
  // ==========================================
  {
    id: 'cleopatra',
    name: 'קליאופטרה',
    nickname: 'קליאופטרה',
    englishName: 'Cleopatra',
    category: 'history',
    categoryLabel: 'היסטוריה ומיתולוגיה',
    emoji: '👑',
    themeColor: '#b45309',
    accentColor: '#facc15',
    badge: 'פירמידות, זהב ונחשי קוברה',
    associations: [
      'מצרים', 'פירמידות', 'זהב', 'כתר', 'נחש', 'יופי', 'נילוס', 'מלכה',
      'איפור', 'מלכותיות', 'מסתורין', 'פרעה', 'מדבר', 'אוצרות'
    ],
    iconicProp: 'כתר נחש קוברה מוזהב וספינת פאר מלכותית על הנילוס',
    catchphrase: '"I will not be triumphed over! Queen of the Nile."',
    bizarreActions: [
      'יושבת על כס מלכות מזהב מול הפירמידות ומצווה להביא',
      'מלטפת נחש קוברה מלכותי שמתפתל סביב',
      'שטה בספינת פאר בנהר הנילוס ומפזרת תכשיטי זהב על',
      'טובלת באמבט חלב אתונות יוקרתי יחד עם'
    ],
    guidedImagery: (item) => `קליאופטרה מלכת מצרים יושבת על כס זהב מול הפירמידות. כתר נחש קוברה מתנוסס על ראשה והיא מושיטה זרוע עמוסת צמידי זהב כדי ללטף ${item}!`,
    synthesisSnippet: (item) => `קליאופטרה הרימה את כתר הקוברה המוזהב מעל ה-${item}`
  }
];

// Generate JS file with rich helpers and exports
const fileContent = `/**
 * LifeQuest Celebrity & Pop-Culture Consensus Mnemonic Catalog
 * מאגר ענק, קונצנזואלי לחלוטין וללא שום פוליטיקה או קוטביות.
 * כולל אגדות ספורט, מדענים עולמיים, אייקוני קולנוע, מוזיקה ואנימציה.
 */

export const CELEBRITY_CATEGORIES = [
  { id: 'all', label: 'כל הדמויות 🌟', icon: '🌟' },
  { id: 'sports', label: 'ספורט ועוצמה 🥊', icon: '🥊' },
  { id: 'cartoons_gaming', label: 'אנימציה וגיימינג 🍄', icon: '🍄' },
  { id: 'cinema_tv', label: 'קולנוע ומסך 🎬', icon: '🎬' },
  { id: 'music', label: 'מוזיקה ובמה 🎸', icon: '🎸' },
  { id: 'tech_science', label: 'הייטק ומדע 🚀', icon: '🚀' },
  { id: 'history', label: 'היסטוריה ומיתולוגיה 🏛️', icon: '🏛️' }
];

export const CELEBRITIES = ${JSON.stringify(UNIVERSAL_ICONS, null, 2)};

// Attach canonical catalog portrait photo from public/celebrities/
CELEBRITIES.forEach((c) => {
  if (!c.imageUrl) {
    c.imageUrl = \`/celebrities/\${c.id}.jpg\`;
  }
});

/**
 * Returns a character by its unique ID
 */
export function getCelebrityById(id) {
  if (!id) return null;
  return CELEBRITIES.find((c) => c.id === id) || CELEBRITIES[0];
}

/**
 * Returns all celebrities filtered by category
 */
export function getCelebritiesByCategory(category = 'all') {
  if (!category || category === 'all') return CELEBRITIES;
  return CELEBRITIES.filter((c) => c.category === category);
}

/**
 * Finds the best matching celebrity for a given text based on association tags
 */
export function findCelebrityByAssociation(text = '') {
  if (!text) return null;
  const clean = text.trim().toLowerCase();

  // 1. Direct name match
  for (const celeb of CELEBRITIES) {
    if (clean.includes(celeb.name.toLowerCase()) || (celeb.englishName && clean.includes(celeb.englishName.toLowerCase()))) {
      return celeb;
    }
  }

  // 2. Exact word or tag match
  const words = clean.split(/[\s,.-]+/);
  for (const celeb of CELEBRITIES) {
    for (const tag of celeb.associations) {
      const lowerTag = tag.toLowerCase();
      if (clean === lowerTag || words.includes(lowerTag)) {
        return celeb;
      }
    }
  }

  // 3. Meaningful substring match (minimum 4 characters on both sides)
  if (clean.length >= 4) {
    for (const celeb of CELEBRITIES) {
      for (const tag of celeb.associations) {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.length >= 4 && (clean.includes(lowerTag) || lowerTag.includes(clean))) {
          return celeb;
        }
      }
    }
  }

  return null;
}
`;

fs.writeFileSync('src/data/celebrityMnemonicCatalog.js', fileContent, 'utf8');
console.log(`Generated consensus catalog with ${UNIVERSAL_ICONS.length} non-controversial icons!`);
