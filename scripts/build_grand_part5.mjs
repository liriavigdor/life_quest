import fs from 'fs';
import path from 'path';

const catalogDir = './scripts/catalog_1000';
const existingFiles = fs.readdirSync(catalogDir).filter(f => f.endsWith('.json'));
const existingIds = new Set();
for (const f of existingFiles) {
  const arr = JSON.parse(fs.readFileSync(path.join(catalogDir, f), 'utf8'));
  for (const item of arr) {
    existingIds.add(item.id);
  }
}

console.log(`Current existing IDs before Part 5: ${existingIds.size}`);

const candidates = [
  {
    id: "lighthouse_of_alexandria_pharos",
    name_he: "המגדלור של אלכסנדריה (פארוס)",
    search_query: "Lighthouse of Alexandria Pharos ancient wonder illustration majestic",
    category: "landmarks_wonders",
    everyday_associations: ["פנס רחוב או מנורת לילה", "בדיקת מצוף במיכל הדחה", "נסיעה זהירה בחושך", "איתות במכונית", "פנס ראש לריצה"]
  },
  {
    id: "colossus_of_rhodes_ancient",
    name_he: "הקולוסוס מרודוס (פסל הענק)",
    search_query: "Colossus of Rhodes ancient bronze statue harbor entrance illustration",
    category: "landmarks_wonders",
    everyday_associations: ["מעבר בכניסה לחניון", "מתיחות שרירים לאחר ריצה", "נעל גבוהה לחורף", "בדיקת שער כניסה", "פיסול וקרמיקה"]
  },
  {
    id: "hanging_gardens_of_babylon",
    name_he: "הגנים התלויים של בבל",
    search_query: "Hanging Gardens of Babylon terraced lush plants wonder illustration",
    category: "landmarks_wonders",
    everyday_associations: ["השקיית גינת מרפסת", "אדניות ועציצים תלויים", "שתילת נענע ובזיליקום", "גיזום ענפים יבשים", "דשן נוזלי לצמחים"]
  },
  {
    id: "terracotta_army_xian",
    name_he: "צבא הטרקוטה של שי-אן",
    search_query: "Terracotta Army warriors Xian China excavation pit figures rows",
    category: "landmarks_wonders",
    everyday_associations: ["עמידה בתור מסודר", "עציץ חרס לגינה", "מדים מגוהצים", "אימון משמעת עצמית", "סידור נעליים בארון"]
  },
  {
    id: "easter_island_moai_statues",
    name_he: "פסלי המואי באיי הפסחא",
    search_query: "Moai statues Easter Island Rapa Nui Ahu Tongariki stone faces",
    category: "landmarks_wonders",
    everyday_associations: ["קרם שיזוף ופנים", "גילוח בבוקר", "סלע נוי לחצר", "פנים רציניות בפגישה", "מבט מהחלון אל השקיעה"]
  },
  {
    id: "rosetta_stone_british_museum",
    name_he: "אבן רוזטה המפורסמת",
    search_query: "Rosetta Stone granodiorite slab hieroglyphics British Museum",
    category: "history_figures",
    everyday_associations: ["תרגום טקסט בגוגל טרנסלייט", "לימוד שפה זרה", "מילון עברי אנגלי", "חתימה על חוזה מסובך", "קריאת מדריך למשתמש"]
  },
  {
    id: "dead_sea_scrolls_jar",
    name_he: "מגילות ים המלח וכד החרס",
    search_query: "Dead Sea Scrolls Qumran clay jar parchment Hebrew historic Shrine of the Book",
    category: "history_figures",
    everyday_associations: ["צנצנת שימורים במזווה", "שמירת מסמכים ישנים בקלסר", "קרם לחות ממינרלים של ים המלח", "קריאת מגילה בחג", "סידור ארכיון ביתי"]
  },
  {
    id: "acropolis_parthenon_athens",
    name_he: "האקרופוליס והפרתנון באתונה",
    search_query: "Acropolis Athens Parthenon marble columns hilltop clear sky Greece",
    category: "landmarks_wonders",
    everyday_associations: ["סלט יווני עם גבינת פטה", "שמן זית כתית טהור", "עמודי תמיכה בבניין", "שיפוץ סלון בשיש", "טיול רגלי בעלייה"]
  },
  {
    id: "alhambra_palace_granada",
    name_he: "ארמון אלהמברה בגרנדה",
    search_query: "Alhambra Granada Spain Court of the Lions intricate Moorish architecture",
    category: "landmarks_wonders",
    everyday_associations: ["מזרקת מים בחצר", "ריצוף פסיפס באמבטיה", "שתיית מיץ תפוזים טבעי", "חופשה באנדלוסיה", "סורגים מעוצבים לחלון"]
  },
  {
    id: "angkor_wat_cambodia",
    name_he: "מקדש אנגקור ואט בקמבודיה",
    search_query: "Angkor Wat temple reflection lotus pond sunrise Cambodia stone towers",
    category: "landmarks_wonders",
    everyday_associations: ["השכמה מוקדמת לזריחה", "מדיטציה ונשימות", "פרח לוטוס ריחני", "שטיפת אבנים בחצר", "חולצה נושמת לקיץ"]
  },
  {
    id: "chichen_itza_pyramid",
    name_he: "פירמידת צ'יצ'ן איצה (מקסיקו)",
    search_query: "Chichen Itza El Castillo pyramid Mayan stepped temple Yucatan Mexico",
    category: "landmarks_wonders",
    everyday_associations: ["מדרגות בבניין ללא מעלית", "אכילת טאקו וגוואקמולי", "כובע קש רחב שוליים", "חישוב ימי החודש בלוח שנה", "צל בשעות חמות"]
  },
  {
    id: "stradivarius_violin_classic",
    name_he: "כינור סטרדיוואריוס עתיק",
    search_query: "Stradivarius violin antique varnished wood classical instrument",
    category: "arts_creators",
    everyday_associations: ["כוונון כלי מיתר", "האזנה לרדיו מוזיקה קלאסית", "פוליש לרהיטי עץ", "נרתיק מגן לכינור", "שיעור נגינה פרטי"]
  },
  {
    id: "fender_stratocaster_guitar",
    name_he: "גיטרה חשמלית פנדר סטראטוקסטר",
    search_query: "Fender Stratocaster Sunburst electric guitar maple neck classic",
    category: "arts_creators",
    everyday_associations: ["מגבר וכבל חשמל", "מפרט לגיטרה", "רצועת כתף לגיטרה", "אימון נגינה בחדר", "אוזניות אולפן"]
  },
  {
    id: "steinway_grand_piano",
    name_he: "פסנתר כנף סטיינווי שחור",
    search_query: "Steinway & Sons grand piano black polished lacquer lid open concert",
    category: "arts_creators",
    everyday_associations: ["ניקוי קלידים באלכווהול", "כיוון פסנתר", "מפית תחרה על רהיט", "ישיבה זקופה על כיסא", "קונצרט ערב חגיגי"]
  },
  {
    id: "french_croissant_cafe",
    name_he: "קרואסון חמאה צרפתי וקפה",
    search_query: "flaky golden butter croissant with cup of espresso cafe morning breakfast",
    category: "iconic_objects",
    everyday_associations: ["קפה ומאפה במאפייה", "קניית חמאה בסופר", "חימום טוסטר אובן", "ארוחת בוקר בבית קפה", "ניקוי פירורים מהשולחן"]
  },
  {
    id: "margherita_pizza_woodfire",
    name_he: "פיצה מרגריטה בתנור לבנים",
    search_query: "authentic Neapolitan pizza Margherita basil mozzarella wood fired crust",
    category: "iconic_objects",
    everyday_associations: ["הזמנת פיצה משפחתית", "גבינת מוצרלה ועגבניות", "עלי בזיליקום טריים", "קרטון פיצה למיחזור", "חיתוך עם גלגלת פיצה"]
  },
  {
    id: "origami_paper_crane",
    name_he: "עגור אוריגמי מקופל מנייר",
    search_query: "colorful paper origami crane Japanese folded washi paper closeup",
    category: "arts_creators",
    everyday_associations: ["קיפול כביסה בארון", "נייר מכתבים מעוצב", "עבודת יצירה עם הילדים", "קיפול מפיות לשולחן שבת", "משלוח דואר בדואר"]
  },
  {
    id: "matryoshka_nesting_dolls",
    name_he: "בובות מטריושקה (בבושקה) מעץ",
    search_query: "Russian Matryoshka nesting dolls wooden painted set open lined up",
    category: "arts_creators",
    everyday_associations: ["קופסאות אחסון אחת בתוך השנייה", "ארגון מקרר בקופסאות", "סדר פנימי וחיצוני", "צעצועי עץ לילדים", "מתנה ייחודית מנסיעה"]
  },
  {
    id: "venetian_carnival_mask",
    name_he: "מסכה ונציאנית מוזהבת",
    search_query: "Venetian carnival mask gold leaf feathers porcelain Venice Italy",
    category: "arts_creators",
    everyday_associations: ["תחפושת לפורים", "מסיבת מסכות", "קשירת סרט לשיער", "נצנצים ואיפור ערב", "מסגרת מראה מוזהבת"]
  },
  {
    id: "irish_shamrock_clover",
    name_he: "תלתן אירי ירוק (שמרוק)",
    search_query: "green Irish Shamrock three leaf clover St Patrick dew drops macro",
    category: "nature_wildlife",
    everyday_associations: ["מציאת מזל טוב", "חולצה ירוקה לאירוע", "שתיית שייק ירוק בריא", "טיול בפארק הירקון", "דשא סינתטי או טבעי בחצר"]
  },
  {
    id: "swiss_cheese_fondue_pot",
    name_he: "סיר פונדו גבינה שוויצרי",
    search_query: "Swiss cheese fondue pot caquelon bubbling bread cubes dipped fork",
    category: "iconic_objects",
    everyday_associations: ["ארוחת ערב חורפית", "קניית לחם כפרי ומחמצת", "מזלגות ארוכים לאירוח", "גבינה צהובה מותכת", "שטיפת סיר עם מים חמים"]
  },
  {
    id: "moroccan_tagine_pot",
    name_he: "סיר טאג'ין מרוקאי מחרס",
    search_query: "authentic Moroccan tagine ceramic clay pot steam couscous spices",
    category: "iconic_objects",
    everyday_associations: ["תבשיל קדירה לשבת", "קוסקוס וירקות", "תבלין כמון וכורכום", "כפפות בד לסיר חם", "סיר בישול איטי"]
  },
  {
    id: "japanese_tea_ceremony_matcha",
    name_he: "קערת מאצ'ה ומקציף במבוק (צ'אסן)",
    search_query: "Japanese Matcha green tea bowl chasen bamboo whisk tea ceremony",
    category: "iconic_objects",
    everyday_associations: ["שתיית תה ירוק בריא", "הקצפת חלב לקפוצ'ינו", "רגיעה של אחרי הצהריים", "קניית אבקת חלבון או מאצ'ה", "ספל חרס מעוצב"]
  },
  {
    id: "mexican_sombrero_hat",
    name_he: "סומבררו מקסיקני רחב שוליים",
    search_query: "authentic Mexican Sombrero embroidered wide brim festive hat",
    category: "iconic_objects",
    everyday_associations: ["הגנה מקרינת שמש חזקה", "מסיבת קיץ בחצר", "תבלין צ'ילי חריף", "משקפי שמש כהים", "חטיף נאצ'וס וסלסה"]
  },
  {
    id: "scotland_bagpipes_kilt",
    name_he: "חמת חלילים סקוטית וחצאית משבצות",
    search_query: "Scottish Highland bagpiper playing bagpipes traditional tartan kilt",
    category: "arts_creators",
    everyday_associations: ["צעיף משבצות לחורף", "נשיפה לתוך בלון", "בדיקת תפקודי ריאות", "גרבי צמר ארוכים", "מצעד או תהלוכה חגיגית"]
  },
  {
    id: "hawaiian_flower_lei",
    name_he: "שרשרת פרחים הוואית (ליי)",
    search_query: "Hawaiian floral lei plumeria orchid colorful welcome garland",
    category: "nature_wildlife",
    everyday_associations: ["קבלת פנים חמה לאורח", "חולצה פרחונית לקיץ", "בושם עם ריח פרחוני", "חופשה על חוף הים", "זר פרחים לראש"]
  },
  {
    id: "vintage_red_fire_hydrant",
    name_he: "ברז כיבוי אש עירוני אדום",
    search_query: "classic red cast iron street fire hydrant sidewalk city",
    category: "iconic_objects",
    everyday_associations: ["איסור חנייה ליד ברז כיבוי", "בדיקת לחץ מים בצנרת", "צינור גינה להשקיה", "מטף כיבוי אש בבניין", "שתיית מים לאחר ריצה"]
  },
  {
    id: "retro_jukebox_wurlitzer",
    name_he: "ג'וקבוקס רטרו (מכונת תקליטים)",
    search_query: "vintage Wurlitzer jukebox glowing neon lights bubbles 1950s diner",
    category: "iconic_objects",
    everyday_associations: ["מטבעות של עשרה שקלים", "בחירת שיר בפלייליסט", "תאורת לד צבעונית בחדר", "ארוחה בדיינר אמריקאי", "המבורגר וצ'יפס"]
  },
  {
    id: "vintage_pinball_machine",
    name_he: "מכונת פינבול (משחקי וידאו רטרו)",
    search_query: "classic vintage pinball machine flashing lights playfield silver ball",
    category: "iconic_objects",
    everyday_associations: ["כדורי מתכת מגנטיים", "משחק קופסה לכל המשפחה", "רפלקסים מהירים בנהיגה", "הפסקה להתרעננות ממסך", "תחרות משפחתית ידידותית"]
  },
  {
    id: "antique_wooden_cuckoo_clock",
    name_he: "שעון קוקייה שוויצרי מעץ מגולף",
    search_query: "Black Forest German cuckoo clock carved wood pendulum weights",
    category: "iconic_objects",
    everyday_associations: ["שעון מעורר שמצלצל בזמן", "קול ציוץ ציפורים בבוקר", "תליית תמונה כבדה על דיבל", "בדיקת משקולות במטבח", "מתיחת קפיץ השעון"]
  }
];

const newItems = [];
for (const cand of candidates) {
  if (!existingIds.has(cand.id)) {
    newItems.push(cand);
    existingIds.add(cand.id);
  } else {
    console.log(`Skipping duplicate ID: ${cand.id}`);
  }
}

console.log(`Adding ${newItems.length} new items in grand_expansion_part5.json`);
fs.writeFileSync(path.join(catalogDir, 'grand_expansion_part5.json'), JSON.stringify(newItems, null, 2), 'utf8');

console.log(`FINAL TOTAL UNIQUE ITEMS: ${existingIds.size}`);
