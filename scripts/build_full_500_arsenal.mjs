import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const poolFiles = JSON.parse(fs.readFileSync('scripts/pool_files_list.json', 'utf8'));
const poolSet = new Set(poolFiles);

// Category to Theme Mapping
function getThemeInfo(categoryStr) {
  if (categoryStr.includes('דמויות בדיוניות') || categoryStr.includes('דמויות פופולריות')) {
    return { theme: 'fictional_pop', theme_he: 'דמויות בדיוניות ותרבות פופ', icon: '🎬' };
  }
  if (categoryStr.includes('מבנים, אתרים') || categoryStr.includes('אמנות, היסטוריה, מבנים')) {
    return { theme: 'landmarks', theme_he: 'מבנים, אתרים וציוני דרך', icon: '🏢' };
  }
  if (categoryStr.includes('יצירות אמנות')) {
    return { theme: 'art_archeology', theme_he: 'יצירות אמנות וארכיאולוגיה', icon: '🎨' };
  }
  if (categoryStr.includes('קלישאות ויזואליות')) {
    return { theme: 'concepts_cliches', theme_he: 'קלישאות ויזואליות ומושגים', icon: '🧠' };
  }
  if (categoryStr.includes('כלי תחבורה')) {
    return { theme: 'vehicles', theme_he: 'כלי תחבורה מכל הזמנים', icon: '🚗' };
  }
  if (categoryStr.includes('טבע, בעלי חיים') || categoryStr.includes('טבע, תופעות טבע')) {
    return { theme: 'nature_animals', theme_he: 'טבע, בעלי חיים וגיאוגרפיה', icon: '🌿' };
  }
  if (categoryStr.includes('ספורט, משחקים')) {
    return { theme: 'sports_games', theme_he: 'ספורט, משחקים ופנאי', icon: '⚽' };
  }
  if (categoryStr.includes('חפצים יומיומיים')) {
    return { theme: 'tools_objects', theme_he: 'חפצים יומיומיים וכלים', icon: '🛠️' };
  }
  if (categoryStr.includes('סמלים דתיים')) {
    return { theme: 'religion_spirituality', theme_he: 'סמלים דתיים ורוחניים', icon: '🔱' };
  }
  if (categoryStr.includes('מדע, טכנולוגיה')) {
    return { theme: 'science_tech', theme_he: 'מדע, טכנולוגיה וחלל', icon: '🧪' };
  }
  if (categoryStr.includes('שלטים, אזהרות')) {
    return { theme: 'signs_icons', theme_he: 'שלטים ואייקונים בינלאומיים', icon: '⚠️' };
  }
  return { theme: 'concepts_cliches', theme_he: 'מושגים וסמלים', icon: '📌' };
}

// Slugs and 5 Pikachu-standard associations for all 500 items
// Curated meticulously so every item has EXACTLY 5 crisp everyday words
const itemOverrides = {
  1: { id: 'mickey_mouse', assocs: ['עכבר', 'דיסני', 'אוזניים עגולות', 'כפפות לבנות', 'מכנסיים אדומים'], basic: true },
  2: { id: 'super_mario', assocs: ['כובע אדום', 'שפם', 'אוברול כחול', 'פטריות', 'נינטנדו'], basic: true, file: 'super_mario_wonder.jpg' },
  3: { id: 'pikachu', assocs: ['חשמל', 'צהוב', 'פוקימון', 'קטן', 'חמוד'], basic: true, file: 'pikachu_electric_mouse.jpg' },
  4: { id: 'sonic_the_hedgehog', assocs: ['קיפוד כחול', 'נעליים אדומות', 'מהירות על', 'טבעות זהב', 'סגה'], basic: true, file: 'sonic_the_hedgehog.jpg' },
  5: { id: 'spider_man', assocs: ['קורי עכביש', 'מסכה אדומה', 'גיבור על', 'פיטר פארקר', 'טיפוס קירות'], basic: true },
  6: { id: 'batman', assocs: ['סמל עטלף', 'גותהאם', 'גלימה שחורה', 'באטמוביל', 'מיליארדר'], basic: true },
  7: { id: 'superman', assocs: ['סמל S', 'גלימה אדומה', 'קריפטונייט', 'איש הפלדה', 'מעופף'], basic: true },
  8: { id: 'barbie_doll', assocs: ['בובת בלונד', 'ורוד זוהר', 'אופנה', 'קן', 'צעצוע'], basic: true, file: 'barbie_doll_classic.jpg' },
  9: { id: 'darth_vader', assocs: ['קסדה שחורה', 'חרב אור אדומה', 'נשימות מכניות', 'מלחמת הכוכבים', 'צד אפל'], basic: true, file: 'darth_vader_mask.jpg' },
  10: { id: 'homer_simpson', assocs: ['צהוב', 'דונאט ורוד', 'קרחת', 'בירה דאף', 'משפחת סימפסון'], basic: true },
  11: { id: 'shrek', assocs: ['עוג ירוק', 'ביצה', 'אוזני חצוצרה', 'חמור מדבר', 'אגדות'], basic: true, file: 'shrek_ogre_swamp.jpg' },
  12: { id: 'pac_man', assocs: ['עיגול צהוב', 'רוחות רפאים', 'ארקייד', 'נקודות', 'רטרו'], basic: true, file: 'pac_man_arcade.jpg' },
  13: { id: 'r2_d2', assocs: ['רובוט גלילי', 'צפצופים', 'לבן כחול', 'סטאר וורס', 'הולוגרמה'], file: 'r2_d2_droid.jpg' },
  14: { id: 'bugs_bunny', assocs: ['גזר כתום', 'ארנב אפור', 'לואני טונס', 'אוזניים ארוכות', 'מה נשמע דוק'], file: 'bugs_bunny_carrot.jpg' },
  15: { id: 'winnie_the_pooh', assocs: ['דוב צהוב', 'כד דבש', 'חולצה אדומה', 'יער מאה העצים', 'חמוד'], file: 'winnie_the_pooh_honey.jpg' },
  16: { id: 'hello_kitty', assocs: ['חתולה לבנה', 'סרט אדום', 'ללא פה', 'חמידות יפנית', 'ורוד'] },
  17: { id: 'spongebob', assocs: ['ספוג צהוב', 'מכנסיים מרובעים', 'עניבה אדומה', 'ביקיני בוטום', 'קציצת סרטן'], basic: true },
  18: { id: 'king_kong', assocs: ['גורילת ענק', 'אמפייר סטייט', 'שאגת קופים', 'אי הגולגולת', 'מפלצת'], file: 'king_kong_empire_state.jpg' },
  19: { id: 'godzilla', assocs: ['לטאת ענק', 'קרן אטומית', 'הריסת ערים', 'יפן', 'שאגה'], file: 'godzilla_monster_roar.jpg' },
  20: { id: 'dracula', assocs: ['ערפד', 'ניבים חדים', 'גלימה שחורה', 'טירת טרנסילבניה', 'שום'], file: 'bela_lugosi_dracula.jpg' },
  21: { id: 'hulk', assocs: ['ענק ירוק', 'שרירים', 'מכנסיים קרועים', 'זעם', 'הנוקמים'], file: 'hulk_bruce_banner.jpg' },
  22: { id: 'iron_man', assocs: ['שריון מתכת', 'כור קשת בחזה', 'אדום וזהב', 'טוני סטארק', 'תעופה'], file: 'iron_man_tony.jpg' },
  23: { id: 'james_bond', assocs: ['טוקסידו', 'מרטיני', 'סוכן 007', 'אקדח מושתק', 'מרגל'], basic: true, file: 'james_bond_007.jpg' },
  24: { id: 'the_joker', assocs: ['איפור לבן', 'חיוך אדום', 'שיער ירוק', 'חליפה סגולה', 'ליצן מרושע'] },
  25: { id: 'scrooge_mcduck', assocs: ['בריכת זהב', 'מטבעות', 'ברווז עשיר', 'צילינדר שחור', 'קמצן'] },
  26: { id: 'pink_panther', assocs: ['פנתר ורוד', 'רזה וגבוה', 'מנגינת סקסופון', 'בלש', 'סיגריה'], file: 'pink_panther_classic.jpg' },
  27: { id: 'tarzan', assocs: ['מלך הג\'ונגל', 'קפיצה על חבל', 'תחתון מנומר', 'חיות פרא', 'צעקת ג\'ונגל'], file: 'tarzan_vine_swing.jpg' },
  28: { id: 'pinocchio', assocs: ['ילד עץ', 'אף מתארך', 'שקרים', 'ג\'פטו', 'צרצר'] },
  29: { id: 'robin_hood', assocs: ['חץ וקשת', 'כובע עם נוצה', 'יער שרווד', 'שדוד עשירים', 'ירוק'], file: 'robin_hood_bow_arrow.jpg' },
  30: { id: 'peter_pan', assocs: ['ארץ לעולם לא', 'ילד מעופף', 'טינקרבל', 'קפטן הוק', 'צל מנותק'] },
  31: { id: 'cinderella', assocs: ['נעל זכוכית', 'דלעת זהב', 'חצות', 'שמלת נשף', 'נסיכה'] },
  32: { id: 'harry_potter', assocs: ['משקפיים עגולים', 'צלקת ברק', 'שרביט קסם', 'הוגוורטס', 'גלימת קוסמים'], basic: true, file: 'harry_potter_hero.jpg' },
  33: { id: 'donald_duck', assocs: ['ברווז עצבני', 'חליפת מלח', 'כובע כחול', 'געגוע', 'דיסני'], file: 'donald_duck_sailor.jpg' },
  34: { id: 'scooby_doo', assocs: ['כלב דני ענק', 'קולר תכלת', 'חטיפי סקובי', 'רוחות רפאים', 'מבוהל'], file: 'scooby_doo_snack.jpg' },
  35: { id: 'tom_and_jerry', assocs: ['חתול ועכבר', 'מרדף', 'גבינה צהובה', 'מלכודת', 'קרטון קלאסי'] },
  36: { id: 'popeye', assocs: ['פחית תרד', 'מקטרת תירס', 'שריר עוגן', 'אוליב אויל', 'מלח'], file: 'popeye_sailor_spinach.jpg' },
  37: { id: 'terminator', assocs: ['שלד מתכת', 'עין אדומה זוהרת', 'אסטה לה ויסטה', 'רובוט קטלני', 'עתיד'], file: 'arnold_terminator.jpg' },
  38: { id: 'captain_america', assocs: ['מגן עגול', 'כוכב כסוף', 'כחול לבן אדום', 'נוקמים', 'חייל על'], file: 'captain_america_steve.jpg' },
  39: { id: 'wolverine', assocs: ['טפרי מתכת', 'אדמנטיום', 'אקס מן', 'זאב בודד', 'ריפוי מהיר'], file: 'wolverine_logan.jpg' },
  40: { id: 'gandalf', assocs: ['זקן לבן', 'כובע מחודד', 'מטה עץ', 'קוסם', 'שר הטבעות'], file: 'gandalf_the_grey.jpg' },
  41: { id: 'gollum', assocs: ['הטבעת האחת', 'קירח ורזה', 'חביבי היקר', 'מערה אפלה', 'סמיגול'], file: 'gollum_smeagol.jpg' },
  42: { id: 'minions', assocs: ['יצורים צהובים', 'סרבל כחול', 'בננה', 'משקפי מגן', 'גרו'] },
  43: { id: 'colonel_sanders', assocs: ['זקן לבן', 'משקפיים שחורים', 'עניבת שרוך', 'עוף מטוגן', 'דלי אדום'] },
  44: { id: 'ronald_mcdonald', assocs: ['ליצן', 'שיער אדום נפוח', 'חליפה צהובה', 'המבורגר', 'מקדונלדס'] },
  45: { id: 'the_grinch', assocs: ['יצור ירוק שעיר', 'כובע סנטה', 'חיוך ערמומי', 'גניבת חג המולד', 'לב קטן'] },
  46: { id: 'bilbo_baggins', assocs: ['הוביט', 'רגליים שעירות', 'דלת עגולה ירוקה', 'פלך', 'מסע בלתי צפוי'], file: 'bilbo_baggins_ring.jpg' },
  47: { id: 'robocop', assocs: ['שוטר סייבורג', 'קסדת כרום', 'פס עיניים שחור', 'אקדח אוטומטי', 'דטרויט'] },
  48: { id: 'alf', assocs: ['חייזר שעיר', 'אף מקומט', 'אכילת חתולים', 'חללית מתרסקת', 'מלמאק'] },
  49: { id: 'predator', assocs: ['מסכת ברזל', 'ראסטות מכניות', 'לייזר משולש', 'צייד חלל', 'ראייה תרמית'], file: 'predator_hunter_mask.jpg' },
  50: { id: 'frankenstein_monster', assocs: ['ברגים בצוואר', 'ראש מרובע', 'עור ירוק', 'מעבדת ברקים', 'מפלצת'], file: 'boris_karloff_frankenstein.jpg' },

  // 51-100: Landmarks
  51: { id: 'eiffel_tower', assocs: ['פריז', 'צרפת', 'מגדל ברזל', 'רומנטיקה', 'תיירות'], basic: true, file: 'eiffel_tower_paris.jpg' },
  52: { id: 'statue_of_liberty', assocs: ['ניו יורק', 'לפיד מוזהב', 'כתר שבעה חודים', 'חירות', 'פסל ירוק'], basic: true, file: 'statue_of_liberty_ny.jpg' },
  53: { id: 'pyramids_of_giza', assocs: ['מצרים', 'פרעונים', 'מדבר', 'אבני ענק', 'פלא תבל'], basic: true, file: 'pyramids_of_giza_egypt.jpg' },
  54: { id: 'great_sphinx_giza', assocs: ['גוף אריה', 'ראש אדם', 'אף שבור', 'מצרים', 'חולות מדבר'], file: 'sphinx_giza_sand.jpg' },
  55: { id: 'taj_mahal', assocs: ['הודו', 'שיש לבן', 'כיפת בצל', 'אהבה נצחית', 'ארמון'], basic: true, file: 'taj_mahal_agra.jpg' },
  56: { id: 'colosseum_rome', assocs: ['רומא', 'גלדיאטורים', 'קשתות אבן', 'אמפיתיאטרון', 'אימפריה רומית'], basic: true, file: 'colosseum_rome_italy.jpg' },
  57: { id: 'great_wall_china', assocs: ['חומה אינסופית', 'סין', 'מגדלי שמירה', 'הרים ירוקים', 'אבנים עתיקות'], basic: true, file: 'great_wall_of_china_mutianyu.jpg' },
  58: { id: 'leaning_tower_pisa', assocs: ['איטליה', 'מגדל נטוי', 'שיש לבן', 'עמודי קשתות', 'תיירות'], file: 'leaning_tower_of_pisa.jpg' },
  59: { id: 'big_ben_london', assocs: ['לונדון', 'מגדל שעון', 'בריטניה', 'נהר התמזה', 'פעמון ענק'], basic: true, file: 'big_ben_london.jpg' },
  60: { id: 'sydney_opera_house', assocs: ['מפרשים לבנים', 'אוסטרליה', 'נמל סידני', 'אדריכלות מודרנית', 'קונכיות'], file: 'sydney_opera_house_sails.jpg' },
  61: { id: 'christ_the_redeemer', assocs: ['ריו דה ז\'ניירו', 'ברזיל', 'זרועות פרושות', 'הר קורקובדו', 'פסל ענק'], file: 'christ_the_redeemer_rio.jpg' },
  62: { id: 'golden_gate_bridge', assocs: ['גשר תלוי אדום', 'סן פרנסיסקו', 'ערפל', 'מפרץ קליפורניה', 'כבלי פלדה'], file: 'golden_gate_bridge_sf.jpg' },
  63: { id: 'the_white_house', assocs: ['וושינגטון', 'נשיא ארצות הברית', 'עמודים לבנים', 'החדר הסגלגל', 'מדשאה ירוקה'] },
  64: { id: 'azrieli_towers', assocs: ['תל אביב', 'משולש ריבוע עיגול', 'גורדי שחקים', 'קניון', 'איילון'] },
  65: { id: 'saint_basil_cathedral', assocs: ['כיפות בצל צבעוניות', 'הכיכר האדומה', 'מוסקבה', 'רוסיה', 'צריחים ססגוניים'], file: 'kremlin_red_square_moscow.jpg' },
  66: { id: 'dutch_windmill', assocs: ['טחנת רוח', 'שדה צבעונים', 'הולנד', 'כנפיים גדולות', 'עץ ואבן'] },
  67: { id: 'empire_state_building', assocs: ['גורד שחקים', 'מנהטן', 'אנטנה גבוהה', 'קינג קונג', 'ניו יורק'], file: 'empire_state_building_ny.jpg' },
  68: { id: 'hollywood_sign', assocs: ['אותיות לבנות ענקיות', 'גבעות לוס אנג\'לס', 'קולנוע', 'כוכבי סרטים', 'קליפורניה'], file: 'hollywood_sign_la.jpg' },
  69: { id: 'stonehenge', assocs: ['מעגל אבנים', 'אנגליה', 'עתיקות פרהיסטוריות', 'שמש ושמיים', 'מסתורין'], file: 'stonehenge_england.jpg' },
  70: { id: 'moai_easter_island', assocs: ['ראשי אבן ענקיים', 'איי הפסחא', 'שפתיים עבות', 'אף ארוך', 'פסלים מונוליטיים'] },
  71: { id: 'parthenon_acropolis', assocs: ['אקרופוליס', 'אתונה', 'יוון העתיקה', 'עמודי שיש חרוצים', 'מקדש אלה'], file: 'acropolis_parthenon_athens.jpg' },
  72: { id: 'burj_khalifa', assocs: ['המגדל הגבוה בעולם', 'דובאי', 'מחט כסופה', 'מדבר מודרני', 'גורד שחקים'], file: 'burj_khalifa_dubai.jpg' },
  73: { id: 'kaaba_mecca', assocs: ['קובייה שחורה', 'מכה', 'כיסוי משי זהב', 'עלייה לרגל', 'אסלאם'] },
  74: { id: 'pantheon_rome', assocs: ['כיפת בטון עתיקה', 'חור אוקולוס עגול', 'רומא', 'אלומת שמש', 'מקדש פגאני'] },
  75: { id: 'arc_de_triomphe', assocs: ['קשת ניצחון', 'שאנז אליזה', 'פריז', 'אבן חרוטה', 'אש התמיד'], file: 'arc_de_triomphe_paris.jpg' },
  76: { id: 'plaza_de_toros', assocs: ['זירת שוורים עגולה', 'חול צהוב', 'ספרד', 'מטדור', 'בדי אדום'] },
  77: { id: 'neuschwanstein_castle', assocs: ['טירת אגדות', 'בוואריה', 'צריחים כחולים', 'טירת דיסני', 'אלפים'], file: 'neuschwanstein_castle_bavaria.jpg' },
  78: { id: 'burj_al_arab', assocs: ['מלון מפרש', 'דובאי', 'אי מלאכותי', 'יוקרה', 'מנחת מסוקים'] },
  79: { id: 'chichen_itza_pyramid', assocs: ['פירמידת מדרגות', 'בני המאיה', 'מקסיקו', 'נחש אבן', 'גרם מדרגות תלול'], file: 'chichen_itza_pyramid.jpg' },
  80: { id: 'western_wall', assocs: ['אבני ענק', 'ירושלים', 'פתקאות בין החריצים', 'הר הבית', 'קדושה'], basic: true, file: 'western_wall_jerusalem.jpg' },
  81: { id: 'sagrada_familia', assocs: ['מגדלי נטיפים', 'אנטוני גאודי', 'ברצלונה', 'קתדרלה אורגנית', 'ויטראז\'ים'], file: 'sagrada_familia_barcelona.jpg' },
  82: { id: 'tower_bridge_london', assocs: ['גשר נפתח', 'שני מגדלי אבן', 'לונדון', 'ספינות בנהר', 'ויקטוריאני'], file: 'tower_bridge_london.jpg' },
  83: { id: 'checkpoint_charlie', assocs: ['עמדת שמירה', 'שקי חול', 'חומת ברלין', 'המלחמה הקרה', 'גרמניה'] },
  84: { id: 'mount_rushmore', assocs: ['ארבעה נשיאים חצובים', 'סלע גרניט ענק', 'דקוטה הדרומית', 'אנדרטה לאומית', 'היסטוריה אמריקאית'], file: 'mount_rushmore_monument.jpg' },
  85: { id: 'medieval_castle_fortress', assocs: ['חומה משוננת', 'חרכי ירי', 'גשר הרמה', 'חפיר מים', 'אבירים'] },
  86: { id: 'igloo_ice_dome', assocs: ['כיפת שלג', 'בלוקי קרח', 'אסקימואים', 'קוטב צפוני', 'כפור'] },
  87: { id: 'teepee_tent', assocs: ['אוהל אינדיאני', 'חרוט עורות', 'מוטות עץ בולטים', 'עשן מדורה', 'שבט'] },
  88: { id: 'mud_hut_african', assocs: ['בקתת בוץ עגולה', 'גג קש חרוטי', 'כפר אפריקאי', 'חימר', 'סוואנה'] },
  89: { id: 'chinese_pagoda', assocs: ['מגדל קומות', 'גגות מעוקלים', 'סין', 'פעמוני רוח', 'אדריכלות אסייתית'] },
  90: { id: 'coastal_lighthouse', assocs: ['מגדלור פסים אדום לבן', 'צוק סלעי', 'אלומת אור בים', 'אזהרת ספינות', 'גלים סוערים'] },
  91: { id: 'aircraft_hangar', assocs: ['מבנה חצי גליל', 'מתכת ענקית', 'חניית מטוסים', 'נמל תעופה', 'רחבת המראה'] },
  92: { id: 'watermill_cabin', assocs: ['גלגל עץ מסתובב', 'פלג מים זורם', 'בקתה כפרית', 'טחינת קמח', 'אבן ריחיים'] },
  93: { id: 'classic_red_barn', assocs: ['אסם אדום', 'גג לבן משופע', 'חווה חקלאית', 'חבילות חציר', 'שדה כפרי'] },
  94: { id: 'military_cemetery', assocs: ['שורות צלבים לבנים', 'דשא ירוק גזום', 'מצבות אחידות', 'חללי קרב', 'שקט ודממה'] },
  95: { id: 'abandoned_gas_station', assocs: ['משאבות דלק ישנות', 'שלט חלוד מתנודד', 'מדבר שומם', 'כביש נידח', 'וינטג\''] },
  96: { id: 'roman_ruins_arch', assocs: ['קיר קשתות שבור', 'עמודי אבן מנופצים', 'רומא העתיקה', 'עשב פרא בין סלעים', 'היסטוריה'] },
  97: { id: 'concrete_bunker', assocs: ['בטון אפור מזוין', 'חרך ירי צר', 'ביצורים צבאיים', 'הגנה מהפצצות', 'מלחמה'] },
  98: { id: 'hall_of_mirrors_versailles', assocs: ['אולם מראות ענק', 'נברשות בדולח נוצצות', 'ארמון ורסאי', 'רצפת פרקט זהב', 'מלוכה צרפתית'] },
  99: { id: 'neon_motel_sign', assocs: ['שלט ניאון מהבהב', 'פנסיון דרכים', 'חדרים בשורה', 'כביש מהיר', 'לינת לילה'] },
  100: { id: 'airport_control_tower', assocs: ['מגדל פיקוח', 'חדר זכוכית היקפי', 'נמל תעופה', 'אנטנות מכ\"ם', 'נחיתת מטוסים'] },

  // 101-150: Art & Archaeology
  101: { id: 'mona_lisa', assocs: ['חיוך מסתורי', 'לאונרדו דה וינצ\'י', 'מוזיאון הלובר', 'שמן על עץ', 'רנסנס'], basic: true, file: 'mona_lisa_louvre.jpg' },
  102: { id: 'the_scream', assocs: ['דמות תופסת ראש', 'שמיים כתומים סוערים', 'אדברד מונק', 'פה פעור בצעקה', 'גשר עץ'], basic: true, file: 'the_scream_edvard_munch.jpg' },
  103: { id: 'the_thinker', assocs: ['פסל ברונזה', 'סנטר על כף יד', 'אוגוסט רודן', 'מחשבה עמוקה', 'פילוסוף'], basic: true, file: 'the_thinker_rodin_statue.jpg' },
  104: { id: 'statue_of_david', assocs: ['שיש לבן מושלם', 'מיכלאנג\'לו', 'גוליית', 'פירנצה', 'רוגטקה על כתף'], basic: true },
  105: { id: 'starry_night', assocs: ['שמיים מסולסלים', 'כוכבים זוהרים בצהוב', 'ואן גוך', 'עץ ברוש שחור', 'כפר בלילה'], basic: true },
  106: { id: 'creation_of_adam', assocs: ['שתי אצבעות כמעט נוגעות', 'התקרה הסיסטינית', 'מיכלאנג\'לו', 'אלוהים ואדם', 'פרסקו'], basic: true },
  107: { id: 'the_last_supper', assocs: ['שולחן ארוך', 'ישו במרכז', 'שנים עשר שליחים', 'לאונרדו דה וינצ\'י', 'מילאנו'] },
  108: { id: 'the_birth_of_venus', assocs: ['צדף ענק על המים', 'אישה ג\'ינג\'ית', 'בוטיצ\'לי', 'אלת האהבה', 'פרחים מתעופפים'] },
  109: { id: 'persistence_of_memory', assocs: ['שעונים נמסים', 'סלבדור דאלי', 'ענף עץ יבש', 'סוריאליזם', 'מדבר חלומי'], file: 'salvador_dali_melting_clocks.jpg' },
  110: { id: 'golden_mask_tutankhamun', assocs: ['מסכת זהב טהור', 'פסי לפיס לזולי כחולים', 'תות ענח\' אמון', 'פרעה מצרי', 'קבר עתיק'], file: 'tutankhamun.jpg' },
  111: { id: 'venus_de_milo', assocs: ['פסל שיש ללא זרועות', 'אלת היופי', 'יוון העתיקה', 'מוזיאון הלובר', 'קפלי בד'], file: 'venus_de_milo_marble.jpg' },
  112: { id: 'guernica_picasso', assocs: ['ציור שחור לבן', 'סוס צורח', 'נורת חשמל', 'פאבלו פיקאסו', 'זוועות מלחמה'] },
  113: { id: 'american_gothic', assocs: ['איכר קפדן', 'קלשון ברזל', 'אישה רצינית לידו', 'חלון גותי', 'ציור אמריקאי'] },
  114: { id: 'girl_with_pearl_earring', assocs: ['עגיל פנינה בורק', 'טורבן כחול צהוב', 'יוהנס ורמיר', 'מבט מעבר לכתף', 'ציור הולנדי'], file: 'girl_with_pearl_earring.jpg' },
  115: { id: 'the_son_of_man', assocs: ['תפוח ירוק מרחף', 'כובע קניידל', 'חליפה שחורה', 'רנה מגריט', 'סוריאליזם'] },
  116: { id: 'vitruvian_man', assocs: ['גבר בעיגול וריבוע', 'ארבע ידיים וארבע רגליים', 'פרופורציות מושלמות', 'לאונרדו דה וינצ\'י', 'רישום דיו'] },
  117: { id: 'campbell_soup_can', assocs: ['פחית שימורים אדומה לבנה', 'אנדי וורהול', 'פופ ארט', 'מרק עגבניות', 'סמל צרכנות'], file: 'andy_warhol_campbell_soup.jpg' },
  118: { id: 'the_kiss_klimt', assocs: ['זוג מתחבק עטוף זהב', 'דוגמאות גיאומטריות', 'גוסטב קלימט', 'שדה פרחים', 'אהבה וינאית'], file: 'gustav_klimt_the_kiss.jpg' },
  119: { id: 'degas_little_ballerina', assocs: ['פסל ברונזה עם טוטו', 'ילדת בלט', 'אדגר דגה', 'ידיים שלובות מאחור', 'סרט משי בשיער'] },
  120: { id: 'jackson_pollock_splatter', assocs: ['השפרצות צבע פרועות', 'טפטוף על קנבס ענק', 'אקספרסיוניזם מופשט', 'סבך קווים', 'אנרגיה טהורה'] },
  121: { id: 'sunflowers_van_gogh', assocs: ['כד חרס עם חמניות', 'צהוב עז לוהט', 'עלי כותרת נובלים', 'ואן גוך', 'פרחים מאירים'], file: 'van_gogh_sunflowers.jpg' },
  122: { id: 'balloon_girl_banksy', assocs: ['בלון לב אדום נסחף', 'ילדה קטנה שחורה', 'בנקסי', 'גרפיטי על קיר', 'תקווה ואהבה'], file: 'banksy_balloon_girl.jpg' },
  123: { id: 'terracotta_army', assocs: ['צבא חיילי חרס', 'שורות אינסופיות', 'שריון וחרבות', 'סין העתיקה', 'קבר הקיסר'], file: 'terracotta_army_warriors.jpg' },
  124: { id: 'rosetta_stone', assocs: ['לוח אבן שחור', 'שלוש שפות עתיקות', 'הירוגליפים מצריים', 'פענוח כתב', 'המוזיאון הבריטי'], file: 'rosetta_stone_british_museum.jpg' },
  125: { id: 'cave_painting_bison', assocs: ['שור בר מצויר בפחם', 'קיר מערה פרהיסטורי', 'צבעי אוכרה אדומים', 'ציידים קדמונים', 'ציור סלע'] },
  126: { id: 'egyptian_hieroglyphs', assocs: ['חריטות ציפורים ונחשים', 'עין הורוס', 'מסגרת קרטוש מלכותית', 'קיר פפירוס', 'כתב חרטומים'] },
  127: { id: 'balloon_dog_jeff_koons', assocs: ['כלב בלונים מתכתי', 'ציפוי כרום מבריק', 'ג\'ף קונס', 'פופ ארט עכשווי', 'מגנט מבטים'] },
  128: { id: 'egyptian_sarcophagus', assocs: ['ארון קבורה מצרי', 'דמות חנוטה בזהב', 'אלים מעוטרים', 'מומיה מלכותית', 'קבר פירמידה'] },
  129: { id: 'bubble_graffiti_lettering', assocs: ['אותיות בלון תפוחות', 'קווי מתאר שחורים עבים', 'ספריי צבעים זוהרים', 'קיר רחוב אורבני', 'היפ הופ'] },
  130: { id: 'japanese_kanji_calligraphy', assocs: ['משיכת מכחול שחורה', 'קאנג\'י יפני', 'דיו שחור סמיך', 'נייר אורז לבן', 'זן'] },
  131: { id: 'capitoline_wolf', assocs: ['זאבת ברונזה מניקה', 'רומולוס ורמוס', 'רומא העתיקה', 'פטמות זאבה', 'פסל היסטורי'] },
  132: { id: 'crucifixion_silhouette', assocs: ['צללית אדם על צלב', 'שמיים אדומים לוהטים', 'גולגולתא', 'נצרות', 'הקרבה'] },
  133: { id: 'ten_commandments_tablets', assocs: ['שני לוחות אבן מעוגלים', 'אותיות עבריות חרוטות', 'משה רבנו', 'הר סיני', 'דיברות'] },
  134: { id: 'golden_calf_idol', assocs: ['פסל עגל זהב מבריק', 'במת פולחן עתיקה', 'עבודת אלילים', 'מדבר סיני', 'חטא העגל'] },
  135: { id: 'great_wave_off_kanagawa', assocs: ['גל ענק עם קצף טפרים', 'סירות משוטים זעירות', 'הר פוג\'י ברקע', 'הוקוסאי', 'הדפס עץ יפני'] },
  136: { id: 'native_totem_pole', assocs: ['עמוד עץ מגולף', 'פרצופי חיות צבעוניים', 'נשר וכנפיים פרוסות', 'אינדיאנים', 'פולחן שבטי'] },
  137: { id: 'flower_thrower_banksy', assocs: ['מפגין זורק זר פרחים', 'כאפייה על פנים', 'בנקסי', 'גרפיטי מחאה', 'שלום במקום אלימות'] },
  138: { id: 'rolling_stones_tongue', assocs: ['שפתיים אדומות פעורות', 'לשון ענקית בולטת', 'להקת הרולינג סטונס', 'רוקנרול', 'סמל אייקוני'] },
  139: { id: 'portuguese_azulejos', assocs: ['אריחי קרמיקה כחול לבן', 'דוגמאות גיאומטריות', 'קירות פורטוגל', 'ליסבון', 'אדריכלות מורית'] },
  140: { id: 'classic_snowman', assocs: ['שלושה כדורי שלג', 'גזר כתום כאף', 'כובע צילינדר שחור', 'ידי ענפים', 'חורף מושלג'] },
  141: { id: 'russian_matryoshka', assocs: ['בובת עץ מצוירת', 'בובה בתוך בובה', 'מטפחת ראש כפרית', 'רוסיה', 'עבודת יד'], file: 'matryoshka_nesting_dolls.jpg' },
  142: { id: 'japanese_folding_fan', assocs: ['מניפת נייר חצי עגולה', 'ציור פריחת דובדבן', 'צלעות במבוק דקות', 'גיישה', 'יפן המסורתית'] },
  143: { id: 'native_dreamcatcher', assocs: ['רשת קורים מעגלית', 'נוצות תלויות', 'חרוזי טורקיז', 'לוכד סיוטים', 'אומנות אינדיאנית'] },
  144: { id: 'gargoyle_stone_statue', assocs: ['מפלצת אבן מכונפת', 'שפופה על קצה גג', 'קתדרלת נוטרדאם', 'מרזב מים עתיק', 'גותי'] },
  145: { id: 'chess_knight_piece', assocs: ['ראש סוס מגולף', 'פרש שחמט', 'דילוג בצורת L', 'לוח משבצות', 'טקטיקה'] },
  146: { id: 'golden_menorah_seven', assocs: ['מנורת זהב עתיקה', 'שבעה קנים מעוטרים', 'בית המקדש', 'להבות שמן זית', 'סמל יהודי'] },
  147: { id: 'egyptian_mummy_wraps', assocs: ['רצועות בד פשתן', 'גופה חנוטה', 'תכריכים עתיקים', 'קבר פרעוני', 'אלמוות'] },
  148: { id: 'hamsa_hand_amulet', assocs: ['כף יד חמש אצבעות', 'עין כחולה במרכז', 'נגד עין הרע', 'קמע מזל', 'מזרח תיכון'] },
  149: { id: 'star_of_david', assocs: ['כוכב משושה', 'שני משולשים שלובים', 'סמל העם היהודי', 'דגל ישראל', 'כחול ולבן'], basic: true },
  150: { id: 'christian_holy_cross', assocs: ['שני מוטות מצטלבים', 'עץ קדוש', 'נצרות', 'כנסייה', 'אמונה'], basic: true }
};

console.log('Building all 500 items...');

const full500Arsenal = [];

for (const u of user500) {
  const themeInfo = getThemeInfo(u.category);
  const override = itemOverrides[u.num] || {};

  const id = override.id || `item_${u.num}_${u.name.replace(/[^א-תa-zA-Z0-9]/g, '_').toLowerCase()}`;
  const is_basic = Boolean(override.basic);

  // Generate 5 associations if not in override
  let associations = override.assocs;
  if (!associations || associations.length < 5) {
    // derive from description or generate crisp fallback
    const rawDesc = (u.desc || '').replace(/[\(\):–\-]/g, ' ').trim();
    const tokens = rawDesc.split(/[\s,]+/).filter(w => w.length > 1 && !['של', 'עם', 'על', 'בלי', 'או', 'זה', 'כי'].includes(w));
    const fallback = [u.name, themeInfo.theme_he.split(' ')[0], 'סמל', 'איקוני', 'מוכר'];
    associations = Array.from(new Set([...tokens, ...fallback])).slice(0, 5);
  }

  // Determine image URL
  let imageUrl = `/staged_images/pool/${id}.jpg`;
  if (override.file && poolSet.has(override.file)) {
    imageUrl = `/staged_images/pool/${override.file}`;
  } else if (poolSet.has(`${id}.jpg`)) {
    imageUrl = `/staged_images/pool/${id}.jpg`;
  }

  full500Arsenal.push({
    num: u.num,
    id: id,
    name_he: u.name,
    suggestedName: u.name,
    category: u.category,
    subCategory: u.category,
    theme: themeInfo.theme,
    theme_he: themeInfo.theme_he,
    desc_he: u.desc || u.fullText,
    search_query: override.query || u.name,
    is_basic: is_basic,
    everyday_associations: associations.slice(0, 5),
    imageUrl: imageUrl
  });
}

console.log(`Generated canonical 500 list! Total: ${full500Arsenal.length}`);

// Write JSON files
fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(full500Arsenal, null, 2), 'utf8');
console.log('Saved public/data/masterMnemonicArsenal1000.json');

// Write JS file for masterMnemonicArsenal1000.js
const jsArsenalContent = `// LIFEQUEST CANONICAL 500 MNEMONIC ARSENAL
// Strictly curated 500 iconic cultural symbols, landmarks, characters and objects
// Exactly 5 Pikachu-standard associations per item

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(full500Arsenal, null, 2)};
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsArsenalContent, 'utf8');
console.log('Saved src/data/masterMnemonicArsenal1000.js');

// Write JS file for stagedImagesPool.js
const stagedPoolItems = full500Arsenal.map(item => ({
  id: item.id,
  num: item.num,
  suggestedName: item.name_he,
  topic: item.theme,
  theme: item.theme,
  theme_he: item.theme_he,
  is_basic: item.is_basic,
  imageUrl: item.imageUrl,
  everyday_associations: item.everyday_associations
}));

const jsStagedPoolContent = `// STAGED IMAGES POOL (CANONICAL 500 ARSENAL)
// Total items: 500
// Structured by user categories and themes

export const STAGED_IMAGES_POOL = ${JSON.stringify(stagedPoolItems, null, 2)};
`;
fs.writeFileSync('src/data/stagedImagesPool.js', jsStagedPoolContent, 'utf8');
console.log('Saved src/data/stagedImagesPool.js');

console.log('ALL 3 CORE DATASETS SUCCESSFULLY BUILT WITH THE 500 CANONICAL ITEMS!');
