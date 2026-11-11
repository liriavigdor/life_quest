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

console.log(`Current existing IDs before Part 4: ${existingIds.size}`);

const candidates = [
  // Iconic Vehicles & Exploration
  {
    id: "orient_express_train",
    name_he: "רכבת האוריינט אקספרס",
    search_query: "Orient Express vintage train luxury steam locomotive",
    category: "vehicles_wonders",
    everyday_associations: ["נסיעה ברכבת", "כרטיס נסיעה", "חופשה שנתית", "ארוחה חגיגית", "מזוודה ותיק דרכים"]
  },
  {
    id: "boeing_747_jumbo",
    name_he: "בואינג 747 ג'מבו ג'ט",
    search_query: "Boeing 747 jumbo jet commercial airliner iconic",
    category: "vehicles_wonders",
    everyday_associations: ["הזמנת כרטיסי טיסה", "בדיקת דרכון בתוקף", "ביטוח נסיעות לחו\"ל", "משקל מזוודה", "איסוף מהשדה"]
  },
  {
    id: "concorde_supersonic",
    name_he: "מטוס הקונקורד העל-קולי",
    search_query: "Concorde supersonic airliner flight nose droop iconic",
    category: "vehicles_wonders",
    everyday_associations: ["לוח זמנים צפוף", "דדליין דחוף", "הגעה מהירה לפגישה", "פגישת עסקים", "דיוק בשעות"]
  },
  {
    id: "london_double_decker_bus",
    name_he: "אוטובוס קומותיים לונדוני אדום",
    search_query: "London double decker red bus Routemaster iconic",
    category: "vehicles_wonders",
    everyday_associations: ["טעינת רב קו", "נסיעה באוטובוס", "מטריה לגשם", "תה חם", "מעיל חורף"]
  },
  {
    id: "vespa_scooter_classic",
    name_he: "קטנוע וספה קלאסי",
    search_query: "classic Vespa scooter vintage Italian pastel",
    category: "vehicles_wonders",
    everyday_associations: ["קסדת אופנוע", "קפה אספרסו בבוקר", "תדלוק קטנוע", "מפתחות לרכב", "טיפול תקופתי"]
  },
  {
    id: "curiosity_mars_rover",
    name_he: "רכב החלל קיוריוסיטי במאדים",
    search_query: "Curiosity Mars rover NASA selfie surface",
    category: "vehicles_wonders",
    everyday_associations: ["בדיקת מזג אוויר", "טעינת סוללות", "צילום מסמכים", "איסוף דואר", "משימת מחקר"]
  },
  {
    id: "hubble_space_telescope",
    name_he: "טלסקופ החלל האבל",
    search_query: "Hubble space telescope in Earth orbit NASA",
    category: "science_inventions",
    everyday_associations: ["בדיקת ראייה ומשקפיים", "ניקוי חלונות", "מבט לעתיד", "תכנון שנתי", "סקר שוק"]
  },
  {
    id: "sputnik_first_satellite",
    name_he: "הלוויין ספוטניק 1",
    search_query: "Sputnik 1 first satellite silver sphere antennas",
    category: "science_inventions",
    everyday_associations: ["קליטת קו סלולרי", "ראוטר ואינטרנט", "אנטנת טלוויזיה", "שיחת טלפון", "הודעת סמס"]
  },
  {
    id: "gutenberg_printing_press",
    name_he: "מכבש הדפוס של גוטנברג",
    search_query: "Gutenberg printing press wooden historical machine",
    category: "science_inventions",
    everyday_associations: ["הדפסת דפים וטפסים", "דיו למדפסת", "קניית ספר", "דפי חשבון", "חתימה על חוזה"]
  },
  {
    id: "polaroid_onestep_camera",
    name_he: "מצלמת פולארויד קלאסית",
    search_query: "vintage Polaroid OneStep rainbow land camera white",
    category: "science_inventions",
    everyday_associations: ["תמונת פספורט", "גיבוי תמונות בטלפון", "הדפסת אלבום", "תליית תמונה על מקרר", "מצלמת אבטחה"]
  },
  {
    id: "game_boy_classic",
    name_he: "נינטנדו גיים בוי קלאסי אפור",
    search_query: "Nintendo original Game Boy classic grey DMG-01",
    category: "science_inventions",
    everyday_associations: ["סוללות אצבע AA", "הפסקה ומנוחה", "טעינת מכשירים", "משחק קופסה", "שעון מעורר"]
  },
  {
    id: "sony_walkman_tps_l2",
    name_he: "סוני ווקמן קלטות ראשון",
    search_query: "Sony Walkman TPS-L2 blue silver vintage cassette player",
    category: "science_inventions",
    everyday_associations: ["אוזניות לריצה", "האזנה לפודקאסט", "קלטת וידאו ישנה", "מוזיקה בפקק", "חוט טעינה"]
  },
  {
    id: "swiss_army_knife_victorinox",
    name_he: "אולר שוויצרי ויקטורינוקס אדום",
    search_query: "Victorinox Swiss Army knife red multi tool open blades",
    category: "iconic_objects",
    everyday_associations: ["מברג ופטיש", "פותחן שימורים", "תיקון תקלה בבית", "מספריים לציפורניים", "קיצוץ חוטים"]
  },
  {
    id: "rubiks_cube_solved",
    name_he: "קובייה הונגרית רוביק",
    search_query: "Rubik's cube official original colorful puzzle",
    category: "iconic_objects",
    everyday_associations: ["פתרון בעיה מורכבת", "ארגון מגירות", "סידור הארון", "תרגילי חשיבה", "מיון מסמכים"]
  },
  {
    id: "classic_hourglass_sand",
    name_he: "שעון חול מזכוכית ועץ",
    search_query: "antique wooden hourglass sand glass timer trickling",
    category: "iconic_objects",
    everyday_associations: ["טיימר לבישול ביצים", "ניהול זמן עבודה", "פגישה מוגבלת בזמן", "חנייה בכחול לבן", "זמן מנוחה"]
  },
  {
    id: "brass_marine_compass",
    name_he: "מצפן ניווט מנחושת",
    search_query: "antique brass pocket compass navigation vintage",
    category: "iconic_objects",
    everyday_associations: ["ניווט בוויז Waze", "בדיקת כיוונים", "טיול שבת בשטח", "מפת שבילים", "יעד לנסיעה"]
  },
  {
    id: "stethoscope_medical",
    name_he: "סטטוסקופ רפואי קלאסי",
    search_query: "medical stethoscope black and stainless steel clinic",
    category: "iconic_objects",
    everyday_associations: ["בדיקת לחץ דם", "תור לרופא משפחה", "חידוש מרשם לתרופות", "דופק באימון", "קופת חולים"]
  },
  {
    id: "gramophone_phonograph_horn",
    name_he: "גרמופון עתיק עם שופר פליז",
    search_query: "vintage phonograph brass horn gramophone record player",
    category: "iconic_objects",
    everyday_associations: ["שמיעת תקליט מוזיקה", "ווליום ברמקול", "הקלטה קולית", "מערכת שמע ברכב", "סוללת רמקול"]
  },

  // World Landmarks & Architectural Marvels
  {
    id: "golden_gate_bridge_sf",
    name_he: "גשר שער הזהב סן פרנסיסקו",
    search_query: "Golden Gate Bridge San Francisco red iconic fog",
    category: "landmarks_wonders",
    everyday_associations: ["תשלום אגרת כביש 6", "מעבר בגשר", "ערפל בכביש", "צביעת קירות בבית", "דמי מנוי חודשיים"]
  },
  {
    id: "mount_rushmore_monument",
    name_he: "הר ראשמור - פני הנשיאים",
    search_query: "Mount Rushmore National Memorial presidents granite faces",
    category: "landmarks_wonders",
    everyday_associations: ["גילוח הבוקר", "תמונת תעודת זהות", "פגישה עם ההנהלה", "כובע שמש", "חופשה משפחתית"]
  },
  {
    id: "leaning_tower_of_pisa",
    name_he: "המגדל הנטוי של פיזה",
    search_query: "Leaning Tower of Pisa Italy tilt architecture sunny",
    category: "landmarks_wonders",
    everyday_associations: ["יישור תמונה עקומה על הקיר", "בדיקת פלס לבנייה", "פיצה משפחתית לארוחת ערב", "מדרגות בבניין", "תיקון מדף שקוע"]
  },
  {
    id: "christ_the_redeemer_rio",
    name_he: "פסל ישו הגואל בריו דה ז'ניירו",
    search_query: "Christ the Redeemer Rio de Janeiro Corcovado statue aerial",
    category: "landmarks_wonders",
    everyday_associations: ["חיבוק חם לילדים", "מתיחות בוקר", "נוף ממרפסת הבית", "קרם הגנה מהשמש", "סוודר לרוח"]
  },
  {
    id: "stonehenge_england",
    name_he: "מונומנט האבנים סטונהנג'",
    search_query: "Stonehenge prehistoric stone circle Wiltshire England",
    category: "landmarks_wonders",
    everyday_associations: ["שיפוץ וריצוף הגינה", "הרמת משאות כבדים", "שעון שמש", "נסיעה בשטח", "סוללות פנס"]
  },
  {
    id: "big_ben_clock_tower",
    name_he: "מגדל השעון ביג בן בלונדון",
    search_query: "Big Ben Elizabeth Tower London Palace of Westminster clock",
    category: "landmarks_wonders",
    everyday_associations: ["כיוון שעון מעורר", "שעת תה של ארבע", "סנכרון יומן פגישות", "בדיקת שעון יד", "איחור לרכבת"]
  },
  {
    id: "arc_de_triomphe_paris",
    name_he: "שער הניצחון בפריז",
    search_query: "Arc de Triomphe Paris Champs-Elysees monument daytime",
    category: "landmarks_wonders",
    everyday_associations: ["מעבר בכיכר עמוסה", "חנייה מקבילה", "חגיגת יום הולדת", "קניית בגדים", "קפה ומאפה"]
  },
  {
    id: "sydney_opera_house",
    name_he: "בית האופרה של סידני",
    search_query: "Sydney Opera House harbor sails iconic white architecture",
    category: "landmarks_wonders",
    everyday_associations: ["קניית כרטיסים להופעה", "מפרשים והפלגה", "בגדי ערב חגיגיים", "שטיפת רצפות", "בדיקת מזגן"]
  },
  {
    id: "burj_khalifa_dubai",
    name_he: "בורג' ח'ליפה דובאי",
    search_query: "Burj Khalifa Dubai tallest building skyscraper exterior",
    category: "landmarks_wonders",
    everyday_associations: ["עלייה במעלית לקומה גבוהה", "חשבון ועד בית", "נוף פנורמי", "בדיקת גובה", "חלונות זכוכית"]
  },
  {
    id: "mount_everest_summit",
    name_he: "פסגת הר האוורסט המושלגת",
    search_query: "Mount Everest summit Himalayas snowy mountain peak",
    category: "landmarks_wonders",
    everyday_associations: ["מעיל פוך מחמם", "מגפי שלג וטיולים", "בלון חמצן ומשאף", "שתיית תרמוס חם", "אימון מדרגות"]
  },
  {
    id: "petra_treasury_jordan",
    name_he: "אל-ח'זנה (האוצר) בפטרה",
    search_query: "Petra Al-Khazneh Treasury carved rock facade Jordan",
    category: "landmarks_wonders",
    everyday_associations: ["כספת ביתית", "חיסכון בקופת גמל", "הליכה עם נעלי ספורט", "בקבוק מים מינרליים", "קרם לחות"]
  },
  {
    id: "louvre_pyramid_paris",
    name_he: "פירמידת הזכוכית של הלובר",
    search_query: "Louvre Pyramid glass courtyard Paris museum daytime",
    category: "landmarks_wonders",
    everyday_associations: ["ניקוי שמשות ומראות", "כרטיס סטודנט להנחות", "תערוכת אמנות", "משקפי שמש", "מדריך שמע"]
  },
  {
    id: "hollywood_sign_la",
    name_he: "שלט הוליווד בלוס אנג'לס",
    search_query: "Hollywood sign hillside Los Angeles sunny clear sky",
    category: "landmarks_wonders",
    everyday_associations: ["צפייה בסרט ערב", "מנוי לנטפליקס", "פופקורן במיקרוגל", "מצלמת וידאו", "איפור וטיפוח"]
  },
  {
    id: "niagara_falls_waterfall",
    name_he: "מפלי הניאגרה השוצפים",
    search_query: "Niagara Falls Horseshoe Falls rushing water mist",
    category: "landmarks_wonders",
    everyday_associations: ["סגירת ברז מטפטף", "חשבון מים לתשלום", "מקלחת מרעננת", "מעיל גשם ניילון", "שטיפת כלים"]
  },
  {
    id: "tower_bridge_london",
    name_he: "גשר מצודת לונדון (טאוור ברידג')",
    search_query: "Tower Bridge London open bascule Thames river",
    category: "landmarks_wonders",
    everyday_associations: ["מעבר במחסום חניון", "פתיחת שער חשמלי", "מפתח לתיבת דואר", "מנעול אופניים", "פגישת צוות"]
  },

  // Cinema, Animation & Beloved Characters
  {
    id: "willy_wonka_gene_wilder",
    name_he: "ווילי וונקה (מפעל השוקולד)",
    search_query: "Gene Wilder Willy Wonka purple coat top hat chocolate factory",
    category: "cinema_characters",
    everyday_associations: ["חפיסת שוקולד מריר", "קניית ממתקים לילדים", "כרטיס הגרלה", "בדיקת שיניים אצל רופא", "כובע צילינדר"]
  },
  {
    id: "mary_poppins_umbrella",
    name_he: "מרי פופינס עם המטריה",
    search_query: "Julie Andrews Mary Poppins parrot umbrella carpet bag flying",
    category: "cinema_characters",
    everyday_associations: ["מטריה ביום גשום", "סדר וניקיון בחדר", "תיק קניות עמוס", "שמרטפית לילדים", "כפית תרופה או סירופ"]
  },
  {
    id: "the_mask_jim_carrey",
    name_he: "המסיכה (ג'ים קארי)",
    search_query: "Jim Carrey The Mask yellow zoot suit green face iconic",
    category: "cinema_characters",
    everyday_associations: ["חליפה צהובה", "קניית מסכת פנים", "מסיבת פורים", "צחצוח שיניים בהיר", "משיכת מזומן מכספומט"]
  },
  {
    id: "inspector_gadget_trenchcoat",
    name_he: "המפקח גאדג'ט",
    search_query: "Inspector Gadget trenchcoat helicopter hat magnifying glass cartoon",
    category: "gaming_animation",
    everyday_associations: ["מפתח שוודי רב שימושי", "חיפוש מפתחות שנעלמו", "זכוכית מגדלת", "מטען נייד לטלפון", "כובע מצחייה"]
  },
  {
    id: "popeye_sailor_spinach",
    name_he: "פופאי המלח עם תרד",
    search_query: "Popeye the Sailor Man eating can of spinach cartoon classic",
    category: "gaming_animation",
    everyday_associations: ["קניית תרד ועלים ירוקים", "שימורים במזווה", "אימון כוח ושרירים", "צינור להשקיית גינה", "בדיקת ברזל בדם"]
  },
  {
    id: "bugs_bunny_carrot",
    name_he: "באגס באני עם גזר",
    search_query: "Bugs Bunny chewing carrot iconic Looney Tunes",
    category: "gaming_animation",
    everyday_associations: ["קניית גזר בסופר", "ביקור אצל רופא שיניים", "קשב בריכוז", "קליפות לפח האורגני", "חטיף בריאות"]
  },
  {
    id: "daffy_duck_looney",
    name_he: "דאפי דאק הברווז",
    search_query: "Daffy Duck classic Looney Tunes arms crossed angry comic",
    category: "gaming_animation",
    everyday_associations: ["בדיקת רשימת קניות", "ויכוח על חשבון", "נעלי בית נוחות", "תור בסניף דואר", "מטרייה שנשברה"]
  },
  {
    id: "scooby_doo_snack",
    name_he: "סקובי דו וחטיף סקובי",
    search_query: "Scooby Doo cartoon dog smiling mystery machine dog collar",
    category: "gaming_animation",
    everyday_associations: ["אוכל לכלב", "רצועת טיול לכלב", "חטיף אחר הצהריים", "נעילת דלת בלילה", "פנס לחושך"]
  },
  {
    id: "pink_panther_classic",
    name_he: "הפנתר הוורוד",
    search_query: "The Pink Panther cartoon character sleek walking classic",
    category: "gaming_animation",
    everyday_associations: ["צבע ורוד לחדר", "צעדים חרישיים בבית", "זכוכית מגדלת לבדיקה", "סיגריה אלקטרונית או מניעת עישון", "שטיח לסלון"]
  },
  {
    id: "garfield_lasagna_cat",
    name_he: "גרפילד החתול ולזניה",
    search_query: "Garfield fat orange cat eating lasagna Monday cartoon",
    category: "gaming_animation",
    everyday_associations: ["אפיית לזניה בתנור", "שינה עד מאוחר בבוקר", "אוכל לחתולים", "חול לחתול", "עייפות של יום ראשון"]
  },
  {
    id: "snoopy_doghouse_peanuts",
    name_he: "סנופי ישן על גג המלונה",
    search_query: "Snoopy sleeping on top of red doghouse Peanuts Charlie Brown",
    category: "gaming_animation",
    everyday_associations: ["שנת צהריים בסופ\"ש", "כרית שינה אורתופדית", "מכונת כתיבה", "טיול בוקר עם הכלב", "ספר קריאה לפני שינה"]
  },
  {
    id: "tintin_and_snowy",
    name_he: "טינטין ושלגי הכלב",
    search_query: "Tintin and Snowy Herge cartoon reporter trenchcoat walking",
    category: "gaming_animation",
    everyday_associations: ["פנקס ועט לרישום", "קריאת עיתון בוקר", "מעיל רוח לגשם", "חידוש רישיון נהיגה", "מזוודת עלייה למטוס"]
  },
  {
    id: "asterix_and_obelix",
    name_he: "אסטריקס ואובליקס",
    search_query: "Asterix and Obelix with potion cauldron village comic",
    category: "gaming_animation",
    everyday_associations: ["סיר מרק חם", "משלוח ירקות כבד", "ויטמינים וחיזוק הגוף", "קניית בשר לקדירה", "אימון משקולות"]
  },
  {
    id: "robin_hood_bow_arrow",
    name_he: "רובין הוד עם חץ וקשת",
    search_query: "Robin Hood green archer bow and arrow Sherwood forest classic",
    category: "mythology_folklore",
    everyday_associations: ["קליעה למטרה ביעדים", "תרומה לקהילה", "הפקדת כספים בחשבון", "כובע עם נוצה", "שקיות בד רב פעמיות"]
  },
  {
    id: "king_kong_empire_state",
    name_he: "קינג קונג על האמפייר סטייט",
    search_query: "King Kong climbing Empire State Building classic cinema black white",
    category: "cinema_characters",
    everyday_associations: ["עלייה לגג הבניין", "בדיקת דוד שמש", "אימון טיפוס קירות", "החלפת נורה גבוהה", "אשכול בננות"]
  },
  {
    id: "godzilla_monster_roar",
    name_he: "גודזילה מפלצת הענק",
    search_query: "Godzilla monster roaring atomic breath cinema classic",
    category: "cinema_characters",
    everyday_associations: ["פינוי גזם כבד", "רעש שיפוצים בשכונה", "מדחום לבדיקת חום", "כיבוי אש ומטף", "סיר לחץ במטבח"]
  },
  {
    id: "walle_robot_plant",
    name_he: "וול-אי (WALL-E) הרובוט עם העציץ",
    search_query: "WALL-E Pixar robot holding small green plant in shoe",
    category: "gaming_animation",
    everyday_associations: ["השקיית עציצים בבית", "מיחזור בקבוקים וקרטון", "דחיסת פח אשפה", "סוללה סולארית", "ניקוי אבק מהמדפים"]
  },
  {
    id: "remy_ratatouille_chef",
    name_he: "רמי העכבר השף (רטטוי)",
    search_query: "Remy rat chef under chef hat holding wooden spoon Ratatouille",
    category: "gaming_animation",
    everyday_associations: ["בישול ארוחת ערב", "כובע שף וסינר", "תבלינים במטבח", "קניית גבינות מיוחדות", "שטיפת פירות וירקות"]
  },
  {
    id: "buzz_lightyear_space",
    name_he: "באז שנות-אור (צעצוע של סיפור)",
    search_query: "Buzz Lightyear Toy Story astronaut wings deployed action figure",
    category: "gaming_animation",
    everyday_associations: ["החלפת סוללות לצעצוע", "מנורת לילה לילדים", "קפיצה על טרמפולינה", "מדבקות זוהרות בחושך", "קסדת אופניים לילד"]
  },
  {
    id: "woody_cowboy_toystory",
    name_he: "וודי השריף הקאובוי",
    search_query: "Woody sheriff Toy Story cowboy hat pull string Pixar",
    category: "gaming_animation",
    everyday_associations: ["מגפי עבודה מעור", "כובע בוקרים לשמש", "בדיקת מנעול הדלת", "תפירת כפתור שנשר", "משחק עם הילדים"]
  },
  {
    id: "winnie_the_pooh_honey",
    name_he: "פו הדב וצנצנת הדבש",
    search_query: "Winnie the Pooh bear red shirt eating honey jar Disney",
    category: "gaming_animation",
    everyday_associations: ["צנצנת דבש במזווה", "תה עם לימון", "חולצה אדומה בכביסה", "מריחת ריבה על טוסט", "גרביים חמים לחורף"]
  },
  {
    id: "paddington_bear_marmalade",
    name_he: "הדב פדינגטון וכריך מרמלדה",
    search_query: "Paddington Bear blue duffle coat red hat marmalade sandwich suitcase",
    category: "cinema_characters",
    everyday_associations: ["כריך ארוחת עשר לבית ספר", "מעיל דובון כחול", "מגפי גומי שלוליות", "צנצנת ריבת תפוזים", "תווית זיהוי על תיק"]
  },
  {
    id: "kermit_the_frog_banjo",
    name_he: "קרמיט הצפרדע והבנג'ו",
    search_query: "Kermit the Frog playing banjo Muppets smiling green",
    category: "cinema_characters",
    everyday_associations: ["כיוון כלי נגינה", "שתיית תה צמחים", "בדיקת חשבון ירוק במייל", "השקיית צמחי מרפסת", "צפרדע צעצוע לאמבטיה"]
  },
  {
    id: "cookie_monster_sesame",
    name_he: "עוגיפלצת (רחוב סומסום)",
    search_query: "Cookie Monster blue furry eating chocolate chip cookies Sesame Street",
    category: "cinema_characters",
    everyday_associations: ["עוגיות שוקולד צ'יפס", "קופסת עוגיות במטבח", "קניית חלב במכולת", "ניקוי פירורים עם שואב", "חטיף מתוק בערב"]
  },

  // Historic Figures & Cultural Icons
  {
    id: "joan_of_arc_armor",
    name_he: "ז'אן ד'ארק בשריון ודגל",
    search_query: "Joan of Arc in silver plate armor holding banner sword historical painting",
    category: "history_figures",
    everyday_associations: ["עמידה באתגר קשה", "הובלת פרויקט בעבודה", "הגנה עצמית", "דגל ליום העצמאות", "אומץ לב במשא ומתן"]
  },
  {
    id: "marco_polo_explorer",
    name_he: "מרקו פולו מגלה הארצות",
    search_query: "Marco Polo explorer portrait historic Silk Road Venetian merchant",
    category: "history_figures",
    everyday_associations: ["הזמנת תבלינים ומצרכים", "מסלול נסיעה חדש", "המרת מטבע חוץ", "מפת עולם לחדר", "יומן מסע אישי"]
  },
  {
    id: "wright_brothers_first_flight",
    name_he: "האחים רייט בטיסה הראשונה",
    search_query: "Wright brothers first flight Kitty Hawk 1903 historic photo glider",
    category: "history_figures",
    everyday_associations: ["הנעת רכב בבוקר", "הרכבת רהיט מאיקאה", "תיקון אופניים", "ניסוי ראשוני של רעיון", "רוח חזקה בחלון"]
  },
  {
    id: "florence_nightingale_lamp",
    name_he: "פלורנס נייטינגייל עם מנורת הלילה",
    search_query: "Florence Nightingale lady with the lamp nurse hospital historic painting",
    category: "history_figures",
    everyday_associations: ["מדחום ובדיקת חום", "כדור נגד כאב ראש", "חבישת פצע ופלסטר", "מנורת קריאה בלילה", "חידוש ערכת עזרה ראשונה"]
  },
  {
    id: "king_tut_golden_mask",
    name_he: "מסכת הזהב של תות ענח' אמון",
    search_query: "King Tutankhamun golden burial mask Egyptian museum Cairo",
    category: "history_figures",
    everyday_associations: ["תכשיטי זהב בקופסה", "כספת ביתית", "משקפי שמש מוזהבים", "טיול במוזיאון", "איפור עיניים (אייליינר)"]
  },
  {
    id: "confucius_ancient_sage",
    name_he: "קונפוציוס הפילוסוף הסיני",
    search_query: "Confucius philosopher traditional Chinese robes painting historic",
    category: "history_figures",
    everyday_associations: ["כבוד להורים ולמשפחה", "ספר פילוסופיה וחוכמה", "שתיית תה ירוק", "חינוך וערכים לילדים", "שיחת ייעוץ אישית"]
  },
  {
    id: "sun_tzu_art_of_war",
    name_he: "סון דזה (אמנות המלחמה)",
    search_query: "Sun Tzu general The Art of War ancient Chinese strategist scroll",
    category: "history_figures",
    everyday_associations: ["תכנון אסטרטגי לשבוע", "משא ומתן על מחיר", "משחק שחמט", "סבלנות ואיפוק", "קריאת חוזה לפני חתימה"]
  },
  {
    id: "archimedes_in_bathtub",
    name_he: "ארכימדס באמבטיה ('אאוריקה!')",
    search_query: "Archimedes Eureka in bathtub water displacement historic illustration",
    category: "history_figures",
    everyday_associations: ["מילוי מים באמבטיה", "שקילת פירות במשקל", "פתרון פתאומי לבעיה", "סבון רחצה ריחני", "מדידת גובה הילדים"]
  },
  {
    id: "pythagoras_geometry",
    name_he: "פיתגורס ומשולש ישר זווית",
    search_query: "Pythagoras ancient Greek philosopher geometry right triangle marble bust",
    category: "history_figures",
    everyday_associations: ["מדידת מידות בסרט מדידה", "חישוב גודל שטיח לחדר", "זווית מדף לתלייה", "שיעורי בית בחשבון", "ציוד כתיבה וסרגל"]
  },
  {
    id: "harriet_tubman_underground",
    name_he: "הארייט טאבמן (רכבת המחתרת)",
    search_query: "Harriet Tubman portrait Underground Railroad abolitionist lantern historic",
    category: "history_figures",
    everyday_associations: ["פנס יד לשעת חירום", "עזרה לשכן במצוקה", "יציאה למסלול הליכה בלילה", "מפתח לבית בטוח", "מצפן וכוכב הצפון"]
  },

  // Distinct Wildlife & Nature Anchors
  {
    id: "giant_panda_bamboo",
    name_he: "פנדה ענקית לועסת במבוק",
    search_query: "Giant Panda sitting eating green bamboo shoots cute closeup",
    category: "nature_wildlife",
    everyday_associations: ["קניית במבוק לנוי", "חטיף בריא של ירקות", "שנת צהריים מרעננת", "בובת פרווה לילדים", "קערת סלט גדולה"]
  },
  {
    id: "bald_eagle_soaring",
    name_he: "עיטם לבן-ראש (נשר אמריקאי)",
    search_query: "Bald Eagle flying wings spread intense eyes majestic closeup",
    category: "nature_wildlife",
    everyday_associations: ["בדיקת ראייה ומשקפי שמש", "משקפת לצפרות", "חידוש דרכון אמריקאי", "מבט רחב על פרויקט", "טיסה בשמי הארץ"]
  },
  {
    id: "emperor_penguin_ice",
    name_he: "פינגווין קיסרי על קרחון",
    search_query: "Emperor Penguin standing on Antarctic ice shelf snowy cold",
    category: "nature_wildlife",
    everyday_associations: ["הפשרת מקפיא ומקרר", "קרח למשקאות", "מעיל חרמונית חם", "הליכה זהירה על משטח רטוב", "דגים טריים לשבת"]
  },
  {
    id: "blue_whale_tail_ocean",
    name_he: "לווייתן כחול מרים זנב בים",
    search_query: "Blue Whale fluke tail breach ocean water splash majestic",
    category: "nature_wildlife",
    everyday_associations: ["שחייה בבריכה או בים", "שתיית בקבוק מים גדול", "קרם הגנה עמיד במים", "משקפת צלילה ושנורקל", "מגבת חוף גדולה"]
  },
  {
    id: "african_lion_male_mane",
    name_he: "אריה אפריקאי זכר עם רעמה",
    search_query: "male African Lion magnificent full golden mane portrait safari",
    category: "nature_wildlife",
    everyday_associations: ["תספורת במספרה", "שמפו ומרכך לשיער", "שמירה על הבית", "אימון שאגה וביטחון עצמי", "בשר לצלי"]
  },
  {
    id: "silverback_gorilla_mountain",
    name_he: "גורילת הרים כסופת-גב",
    search_query: "Mountain Gorilla silverback powerful portrait green jungle Rwanda",
    category: "nature_wildlife",
    everyday_associations: ["הרמת קניות כבדות", "אימון כושר אינטנסיבי", "אכילת פירות וירקות", "הגנה על המשפחה", "חולצת טישירט גדולה"]
  },
  {
    id: "polar_bear_arctic_snow",
    name_he: "דוב קוטב לבן בשלג",
    search_query: "Polar Bear walking Arctic snow ice closeup wildlife majestic",
    category: "nature_wildlife",
    everyday_associations: ["כפפות שלג מחממות", "שמיכת פוך עבה", "גלידה וניל בקינוח", "טמפרטורת מזגן בקיץ", "מקלחת קרה להתרעננות"]
  },
  {
    id: "great_white_shark_breach",
    name_he: "עמלץ לבן (כריש ענק)",
    search_query: "Great White Shark breaching out of ocean water jaws wide",
    category: "nature_wildlife",
    everyday_associations: ["בדיקת שיניים תקופתית", "חוט דנטלי", "זהירות בכניסה למים עמוקים", "סנפירים לשחייה", "צפייה בסרט מותח"]
  },
  {
    id: "chameleon_color_branch",
    name_he: "זיקית צבעונית על ענף",
    search_query: "colorful Panther Chameleon vibrant colors on branch macro",
    category: "nature_wildlife",
    everyday_associations: ["החלפת בגדים לקראת אירוע", "התאמת צבעים בבית", "צבע לקירות", "משקפי ראייה מולטיפוקל", "סבלנות בהמתנה"]
  },
  {
    id: "cheetah_sprint_savanna",
    name_he: "ברדלס (צ'יטה) בריצה מהירה",
    search_query: "Cheetah running sprint fast African savanna dust action wildlife",
    category: "nature_wildlife",
    everyday_associations: ["ריצה לתפוס אוטובוס", "נעלי ריצה חדשות", "אימון אירובי קצר", "שעון דופק וזמנים", "שתיית משקה איזוטוני"]
  },
  {
    id: "kangaroo_joey_pouch",
    name_he: "קנגורו עם גור בכיס",
    search_query: "Red Kangaroo mother with cute joey in pouch Australia outback",
    category: "nature_wildlife",
    everyday_associations: ["מנשא לתינוק", "תיק פאוץ' למפתחות וארנק", "קפיצות בדילגית", "קניות למחלקת תינוקות", "קרם החתלה וחיתולים"]
  },
  {
    id: "peacock_feathers_fan",
    name_he: "טווס פורש זנב צבעוני",
    search_query: "male Peacock displaying iridescent colorful feather train fan full",
    category: "nature_wildlife",
    everyday_associations: ["מניפה לימי קיץ חמים", "בגד חגיגי לאירוע", "צילום סלפי לסטטוס", "התארגנות וגיהוץ חולצה", "סידור מצעים צבעוניים"]
  },
  {
    id: "red_fox_snow_portrait",
    name_he: "שועל מצוי אדום בשלג",
    search_query: "Red Fox in white snow winter fur fluffy tail closeup wildlife",
    category: "nature_wildlife",
    everyday_associations: ["צעיף צמר חם", "גרביים עבים לבית", "פיקחות בבדיקת מחירים", "סגירת לול התרנגולות או החצר", "מעיל חורפי"]
  },
  {
    id: "snowy_owl_white_feathers",
    name_he: "אוח השלג (ינשוף לבן צחור)",
    search_query: "Snowy Owl yellow eyes white plumage perched close up majestic",
    category: "nature_wildlife",
    everyday_associations: ["משקפי קריאה בלילה", "קריאת ספר בסלון", "שקט ושלווה בבית", "מנורת שולחן חסכונית", "לימודים למבחן"]
  },
  {
    id: "orca_killer_whale_leap",
    name_he: "לווייתן קטלן (אורקה) קופץ",
    search_query: "Orca killer whale breaching ocean splash black and white beautiful",
    category: "nature_wildlife",
    everyday_associations: ["חליפת שחייה", "שטיפת רכב בשטיפה", "משקפי שמש שחור לבן", "חטיף דגים מעושנים", "תכנון סופ\"ש בחוף"]
  },
  {
    id: "sea_turtle_coral_reef",
    name_he: "צב ים ירוק בשונית אלמוגים",
    search_query: "Green Sea Turtle swimming underwater coral reef tropical ocean",
    category: "nature_wildlife",
    everyday_associations: ["נסיעה נינוחה בנתיב ימני", "סבלנות בתור בסופר", "קרם ידיים יבשות", "שנורקל וצלילה באילת", "קערת פירות טרופיים"]
  },
  {
    id: "koala_eucalyptus_tree",
    name_he: "קואלה חמודה על עץ אקליפטוס",
    search_query: "Koala bear resting on eucalyptus branch sleeping cute Australia",
    category: "nature_wildlife",
    everyday_associations: ["שמן אקליפטוס למכשיר אדים", "שנת צהריים מרגיעה", "חיבוק עם כרית", "טיפות אף לצינון", "תה צמחים חם"]
  },
  {
    id: "flamingo_pink_flock",
    name_he: "פלמינגו ורוד עומד על רגל אחת",
    search_query: "pink Flamingo standing on one leg reflection water closeup",
    category: "nature_wildlife",
    everyday_associations: ["תרגילי שיווי משקל ויוגה", "נעילת נעל על רגל אחת", "בגד ים ורוד", "גלידת תות מרעננת", "קרם רגליים ופדיקור"]
  },
  {
    id: "giraffe_tall_acacia",
    name_he: "ג'ירפה גבוהה אוכלת מעץ",
    search_query: "tall Giraffe eating from acacia tree African savannah portrait",
    category: "nature_wildlife",
    everyday_associations: ["סולם להחלפת נורה", "ניקוי חלק עליון של הארון", "בדיקת גובה במרפאה", "צווארון לחולצה", "תליית וילונות בסלון"]
  },
  {
    id: "zebra_stripes_herd",
    name_he: "זברה עם פסי שחור-לבן",
    search_query: "Zebra striped pattern closeup portrait Serengeti wildlife",
    category: "nature_wildlife",
    everyday_associations: ["חציית מעבר חצייה", "גיהוץ חולצת פסים", "חנייה בין שני פסים", "מחברת שורות ללימודים", "ברקוד על מוצר"]
  },
  {
    id: "hippopotamus_water_pool",
    name_he: "היפופוטם במים פוער פה",
    search_query: "Hippopotamus mouth open yawning water river safari wildlife",
    category: "nature_wildlife",
    everyday_associations: ["פיהוק של בוקר", "בדיקת שיניים אצל שיננית", "טבילה בג'קוזי", "קרם הגנה חזק", "שתיית מים מרובה"]
  },
  {
    id: "sloth_hanging_branch",
    name_he: "עצלן תלת-אצבעי תלוי על ענף",
    search_query: "Three-toed Sloth hanging from tree branch smiling slow cute Costa Rica",
    category: "nature_wildlife",
    everyday_associations: ["מנוחה עצלה במיטה", "יום שבת רגוע בלי טלפונים", "מתיחות איטיות", "קפה של בוקר ללא לחץ", "קריאת עיתון סוף שבוע"]
  },

  // Space Exploration & Modern Marvels
  {
    id: "saturn_v_rocket_launch",
    name_he: "משגר הירח סטורן 5",
    search_query: "Saturn V rocket launch Apollo 11 smoke flames Cape Canaveral",
    category: "vehicles_wonders",
    everyday_associations: ["ספירה לאחור להשקה", "מילוי דלק מלא ברכב", "חימום מנוע בבוקר", "פתיחת עסק חדש", "שאיבת אבק בעוצמה"]
  },
  {
    id: "apollo_11_lunar_module",
    name_he: "רכב הנחיתה על הירח (אפולו 11)",
    search_query: "Apollo 11 Lunar Module Eagle surface of moon gold foil",
    category: "vehicles_wonders",
    everyday_associations: ["נייר כסף לאפייה בתנור", "נחיתה רכה מחופשה", "נעלי בית עבות", "בדיקת גלאי עשן", "צעד קטן ראשון בפרויקט"]
  },
  {
    id: "space_shuttle_discovery",
    name_he: "מעבורת החלל דיסקברי",
    search_query: "Space Shuttle Discovery landing runway orbiter parachute NASA",
    category: "vehicles_wonders",
    everyday_associations: ["נחיתת מטוס בנתב\"ג", "חניית הרכב בחניון", "קרם להגנת חום", "בדיקת לחץ אוויר בצמיגים", "מזוודת עלייה למטוס"]
  },
  {
    id: "iss_space_station",
    name_he: "תחנת החלל הבינלאומית (ISS)",
    search_query: "International Space Station ISS orbit Earth solar arrays NASA",
    category: "vehicles_wonders",
    everyday_associations: ["פאנלים סולאריים על הגג", "טעינת טלפונים ומחשבים", "אימון יומי בחדר כושר", "שיחת וידאו בזום", "סינון מים במטבח"]
  },
  {
    id: "james_webb_telescope",
    name_he: "טלסקופ החלל ג'יימס וב",
    search_query: "James Webb Space Telescope JWST gold honeycomb mirrors space",
    category: "science_inventions",
    everyday_associations: ["ניקוי מראת האמבטיה", "עדשות משקפיים חדשות", "משושי חלת דבש", "חיפוש עמוק בגוגל", "רכישת טלוויזיה חכמה"]
  },
  {
    id: "large_hadron_collider_cern",
    name_he: "מאיץ החלקיקים בסרן (CERN)",
    search_query: "Large Hadron Collider CERN LHC tunnel magnets particle physics",
    category: "science_inventions",
    everyday_associations: ["נסיעה במנהרת הכרמל", "מגנטים על המקרר", "בדיקת מתח חשמל ביתי", "חשבון חשמל חודשי", "חיישני רוורס ברכב"]
  },
  {
    id: "tesla_cybertruck_stainless",
    name_he: "טסלה סייברטראק מפלדת אל-חלד",
    search_query: "Tesla Cybertruck stainless steel futuristic pickup driving road",
    category: "vehicles_wonders",
    everyday_associations: ["טעינת רכב חשמלי בעמדה", "ניקוי משטחי נירוסטה במטבח", "מפתח חכם לרכב בטלפון", "הובלת קניות כבדות", "בדיקת שריטות ברכב"]
  },
  {
    id: "ferrari_testarossa_red",
    name_he: "פרארי טסטרוסה אדומה קלאסית",
    search_query: "Ferrari Testarossa red side strakes 1980s sports car classic",
    category: "vehicles_wonders",
    everyday_associations: ["שטיפת רכב בסופ\"ש", "החלפת שמן מנוע", "נהיגה זהירה בכביש מהיר", "משקפי שמש יוקרתיים", "חידוש ביטוח מקיף"]
  },
  {
    id: "lamborghini_countach_lp400",
    name_he: "למבורגיני קונטאש דלתות כנף",
    search_query: "Lamborghini Countach LP400 classic scissor doors open white sports car",
    category: "vehicles_wonders",
    everyday_associations: ["פתיחת דלתות רכב בזהירות", "כניסה לחניון תת קרקעי", "כיוון מראות צד", "שאיבת אבק לריפודי הרכב", "כרטיס תדלוק"]
  },
  {
    id: "delorean_dmc12_gullwing",
    name_he: "מכונית דלוריאן דלתות שחף",
    search_query: "DeLorean DMC-12 stainless steel gullwing doors open classic",
    category: "vehicles_wonders",
    everyday_associations: ["תזכורת ביומן לשבוע הבא", "שעון קיר בסלון", "שלט רחוק לשער חשמלי", "מטען מצברים לרכב", "בדיקת טסט שנתי"]
  },
  {
    id: "yellow_cab_nyc_checker",
    name_he: "מונית צהובה ניו יורקית (צ'קר)",
    search_query: "vintage yellow cab NYC Checker taxi cab classic Manhattan",
    category: "vehicles_wonders",
    everyday_associations: ["הזמנת מונית באפליקציה", "טיפ למלצר או נהג", "פתיחת מטריה ברחוב", "עצירה ברמזור אדום", "קבלה לחשבון הוצאות"]
  },
  {
    id: "beetle_volkswagen_vintage",
    name_he: "חיפושית פולקסווגן וינטג'",
    search_query: "classic vintage Volkswagen Beetle Bug pastel color cute car",
    category: "vehicles_wonders",
    everyday_associations: ["בדיקת מים בווישרים", "ריחן לרכב", "טיול שבת רגוע", "קניית חלק חילוף", "שיר ברדיו בזמן נסיעה"]
  },

  // Cultural Artifacts & Everyday Masterpieces
  {
    id: "mona_lisa_louvre",
    name_he: "המונה ליזה (לאונרדו דה וינצ'י)",
    search_query: "Mona Lisa Leonardo da Vinci portrait masterpiece Louvre Paris",
    category: "arts_creators",
    everyday_associations: ["חיוך לראי בבוקר", "תליית תמונה בסלון", "מסגור תעודה מקצועית", "שמירה על סוד אישי", "סיור בגלריה לאמנות"]
  },
  {
    id: "van_gogh_sunflowers",
    name_he: "החמניות של ואן גוך",
    search_query: "Vincent van Gogh Sunflowers oil painting vibrant yellow vase",
    category: "arts_creators",
    everyday_associations: ["זר פרחים לשבת", "קניית פיצוחים לסרט", "אגרטל מים על השולחן", "שמן חמניות לבישול", "ווילון צהוב מאיר"]
  },
  {
    id: "the_scream_edvard_munch",
    name_he: "הצעקה (אדוורד מונק)",
    search_query: "The Scream Edvard Munch iconic expressionist painting bridge",
    category: "arts_creators",
    everyday_associations: ["כאב ראש פתאומי", "לחץ בעבודה לפני דדליין", "אטמי אוזניים לרעש", "נשימה עמוקה להרגעה", "כוס מים צוננים"]
  },
  {
    id: "the_thinker_rodin_bronze",
    name_he: "האדם החושב (אוגוסט רודן)",
    search_query: "The Thinker Auguste Rodin bronze sculpture seated chin on hand",
    category: "arts_creators",
    everyday_associations: ["החלטה חשובה בקנייה", "שתיקה של חשיבה", "ישיבה על כורסה נוחה", "כתיבת רשימת משימות", "שיעורי בית ומחקר"]
  },
  {
    id: "michelangelo_david_statue",
    name_he: "פסל דוד של מיכלאנג'לו",
    search_query: "Michelangelo David marble statue Galleria dell'Accademia Florence",
    category: "arts_creators",
    everyday_associations: ["אימון כושר בחדר כושר", "משקל גוף בבוקר", "קניית חולצת ספורט", "אבן קטנה בנעל", "שיקוף במראה גדולה"]
  },
  {
    id: "venus_de_milo_marble",
    name_he: "ונוס ממילו (פסל שיש)",
    search_query: "Venus de Milo marble sculpture ancient Greek Louvre Paris",
    category: "arts_creators",
    everyday_associations: ["קרם גוף וטיפוח", "שמלת ערב אלגנטית", "שבירת כוס או צלחת", "תכשיט צוואר עדין", "סידור פינת איפור"]
  },
  {
    id: "great_wave_off_kanagawa",
    name_he: "הגל הגדול בסמוך לקאנאגאווה (הוקוסאי)",
    search_query: "The Great Wave off Kanagawa Hokusai woodblock print iconic crest",
    category: "arts_creators",
    everyday_associations: ["גלישת גלים בים", "מגבת ים וקרם שמש", "ייבוש שיער בפן", "סערת גשם בחלון", "משלוח סושי לארוחה"]
  },
  {
    id: "gustav_klimt_the_kiss",
    name_he: "הנשיקה (גוסטב קלימט)",
    search_query: "The Kiss Gustav Klimt golden oil painting embrace masterpiece",
    category: "arts_creators",
    everyday_associations: ["חיבוק ונשיקה לבן/בת הזוג", "שמיכת חורף עוטפת", "עגילי זהב", "קניית מתנה ליום נישואין", "פרחי בר באגרטל"]
  },
  {
    id: "salvador_dali_melting_clocks",
    name_he: "השעונים הנמסים (דאלי)",
    search_query: "The Persistence of Memory Salvador Dali melting clocks surrealism",
    category: "arts_creators",
    everyday_associations: ["התכת גבינה בטוסט", "שעון חם בשמש", "שכחה לכבות מזגן", "מנוחה ארוכה בשבת", "כיוון שעון מעורר מחדש"]
  },
  {
    id: "girl_with_pearl_earring",
    name_he: "נערה עם עגיל פנינה (ורמיר)",
    search_query: "Girl with a Pearl Earring Johannes Vermeer blue turban portrait",
    category: "arts_creators",
    everyday_associations: ["ענידת עגילים לפני יציאה", "טורבן או מגבת שיער", "מריחת שפתון או וזלין", "מבט מהיר במראה", "מטפחת צוואר"]
  },
  {
    id: "banksy_balloon_girl",
    name_he: "ילדה עם בלון אדום (בנקסי)",
    search_query: "Banksy Girl with Balloon stencil red heart balloon street art",
    category: "arts_creators",
    everyday_associations: ["קניית בלון הליום ליום הולדת", "איחולים וברכות לחג", "קופסת מתנה עטופה", "תסרוקת קוקו לילדה", "תליית שלט על הדלת"]
  },
  {
    id: "the_beatles_abbey_road_crossing",
    name_he: "הביטלס במעבר החצייה של אבי רוד",
    search_query: "The Beatles Abbey Road album cover crossing zebra walk iconic",
    category: "arts_creators",
    everyday_associations: ["חציית כביש בזהירות", "הליכה יחף בבית", "האזנה לפלייליסט ישן", "פגישה עם ארבעה חברים", "נעלי הליכה נוחות"]
  },
  {
    id: "elvis_presley_white_jumpsuit",
    name_he: "אלביס פרסלי בחליפה הלבנה",
    search_query: "Elvis Presley white peacock jumpsuit cape concert microphone",
    category: "arts_creators",
    everyday_associations: ["מיקרופון לקריוקי", "ג'ל לשיער ומסרק", "גיהוץ חולצה לבנה", "משקפי טייסים מוזהבים", "אימון שירה במכונית"]
  },
  {
    id: "michael_jackson_moonwalk",
    name_he: "מייקל ג'קסון - כפפה לבנה וירח",
    search_query: "Michael Jackson Billie Jean fedora black sequin jacket white glove",
    category: "arts_creators",
    everyday_associations: ["כפפות ניקיון לבנות", "הברקת רצפת פרקט", "כובע שחור", "גרביים לבנים חדשים", "הליכה לאחור בזהירות"]
  },
  {
    id: "queen_freddie_mercury_wembley",
    name_he: "פרדי מרקיורי בוומבלי 1986",
    search_query: "Freddie Mercury Queen yellow jacket Wembley 1986 microphone fist up",
    category: "arts_creators",
    everyday_associations: ["מעיל צהוב זוהר לגשם", "טיפול בשפם וגילוח", "שתיית תה חם לגרון", "שירה בקול רם במקלחת", "כרטיסים למשחק כדורגל"]
  },
  {
    id: "bob_marley_dreadlocks",
    name_he: "בוב מארלי עם גיטרה אקוסטית",
    search_query: "Bob Marley smiling dreadlocks acoustic guitar roots reggae",
    category: "arts_creators",
    everyday_associations: ["שמפו לשיער מתולתל", "החלפת מיתר בגיטרה", "כובע צמר סרוג", "קפה של בוקר במרפסת", "נר ריחני בחדר"]
  },
  {
    id: "frida_kahlo_unibrow_flowers",
    name_he: "פרידה קאלו ופרחים בשיער",
    search_query: "Frida Kahlo iconic self-portrait flowers in hair vibrant dress",
    category: "arts_creators",
    everyday_associations: ["פינצטה לעיצוב גבות", "סיכת פרח לשיער", "שמלה רקומה צבעונית", "קופסת צבעי מים ומכחול", "עציצי גרניום במרפסת"]
  },
  {
    id: "salvador_dali_mustache_portrait",
    name_he: "סלבדור דאלי והשפם המחודד",
    search_query: "Salvador Dali portrait iconic pointed mustache wide eyes",
    category: "arts_creators",
    everyday_associations: ["שעווה לשפם וזקן", "עיניים פקוחות בהפתעה", "מקל הליכה מהודר", "ביצי משק טריות", "רעיון יצירתי לארוחה"]
  },
  {
    id: "pablo_picasso_striped_shirt",
    name_he: "פבלו פיקאסו בחולצת הפסים",
    search_query: "Pablo Picasso Breton striped shirt studio paintbrush portrait",
    category: "arts_creators",
    everyday_associations: ["חולצת פסים כחול לבן", "קניית בדים לתפירה", "מכחול וצבע קיר", "קדרות וקרמיקה למטבח", "מגש פירות צבעוני"]
  },
  {
    id: "andy_warhol_campbell_soup",
    name_he: "אנדי וורהול ומרק קמפבל",
    search_query: "Andy Warhol Campbell's soup can silkscreen red white iconic",
    category: "arts_creators",
    everyday_associations: ["פחית מרק עגבניות", "פותחן שימורים ידני", "משקפי ראייה עגולים", "פאה או צבע שיער כסוף", "עגלת קניות בסופרמרקט"]
  }
];

const newItems = [];
for (const cand of candidates) {
  if (!existingIds.has(cand.id)) {
    newItems.push(cand);
    existingIds.add(cand.id);
  } else {
    console.log(`Skipping already existing ID: ${cand.id}`);
  }
}

console.log(`Adding ${newItems.length} new items in grand_expansion_part4.json`);
fs.writeFileSync(path.join(catalogDir, 'grand_expansion_part4.json'), JSON.stringify(newItems, null, 2), 'utf8');

console.log(`Total items now: ${existingIds.size}`);
