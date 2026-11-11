import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to quickly build an item with grounded everyday mnemonic associations
function makeItem(id, name, query, category, keywords) {
  return {
    id,
    name,
    query,
    category,
    everydayKeywords: keywords
  };
}

// 1. History & Leaders (80 items)
const history_leaders = [
  makeItem('julius_caesar', 'יוליוס קיסר', 'Julius Caesar bust marble', 'history_leaders', ['פגישה חשובה ביומן', 'לנעול את המשרד', 'תספורת במספרה', 'זיתים וסלט', 'סכין גילוח']),
  makeItem('alexander_the_great', 'אלכסנדר מוקדון', 'Alexander the Great mosaic', 'history_leaders', ['אימון רכיבה על אופניים', 'לנסוע בדרך חדשה', 'רכישת מנוי', 'סוסים', 'חרב עתיקה']),
  makeItem('cleopatra_vii', 'קליאופטרה', 'Cleopatra Queen of Egypt painting', 'history_leaders', ['טיפוח עור וקרם פנים', 'תכשיטים בארון', 'ספא ומסאז\'', 'נחש', 'מצרים']),
  makeItem('napoleon_bonaparte', 'נפוליאון בונפרטה', 'Napoleon Bonaparte Jacques-Louis David', 'history_leaders', ['קניות לחם ומאפים', 'מדים לכביסה', 'כובע חורף', 'ספר היסטוריה', 'כרטיס לרכבת']),
  makeItem('winston_churchill_pm', 'וינסטון צ\'רצ\'יל', 'Winston Churchill portrait Yousuf Karsh', 'history_leaders', ['שעת תה ורוגע', 'מכתב דחוף בדואר', 'סבלנות במשימה', 'חליפה רשמית', 'סיגר']),
  makeItem('abraham_lincoln', 'אברהם לינקולן', 'Abraham Lincoln portrait Alexander Gardner', 'history_leaders', ['חתימה על חוזה דירה', 'לקרוא ספר בערב', 'כובע גבוה', 'תעודת זהות', 'עורך דין']),
  makeItem('george_washington', 'ג\'ורג\' וושינגטון', 'George Washington Gilbert Stuart portrait', 'history_leaders', ['שטרות כסף בארנק', 'לשלם ארנונה ומסים', 'פאה לבנה', 'טיול בטבע', 'שיניים בריאות']),
  makeItem('queen_victoria', 'המלכה ויקטוריה', 'Queen Victoria portrait Winterhalter', 'history_leaders', ['סרוויס כוסות תה', 'שמלת ערב', 'ביקור אצל סבתא', 'תכשיטי כסף', 'ניקיון הבית']),
  makeItem('king_solomon', 'שלמה המלך', 'King Solomon judgment painting', 'history_leaders', ['החלטה כלכלית נבונה', 'משפט וצדק', 'בניית בית ושיפוץ', 'טבעת זהב', 'ספר חוכמה']),
  makeItem('king_david', 'דוד המלך', 'King David harp painting', 'history_leaders', ['שיעור נגינה בגיטרה', 'חלוקי נחל', 'ביקור בירושלים', 'מנעול דלת', 'שירה בבוקר']),
  makeItem('ramses_ii', 'רעמסס השני', 'Ramesses II Abu Simbel statue', 'history_leaders', ['קרם הגנה מהשמש', 'משקפי שמש לנהיגה', 'נסיעה למדבר', 'שיפוץ חזית הבית', 'זהב']),
  makeItem('tutankhamun', 'תות ענח\' אמון', 'Tutankhamun gold mask Cairo Museum', 'history_leaders', ['תכשיטים בכספת', 'מסכת פנים', 'מוזיאון בשבת', 'חולצות מוזהבות', 'מומיה']),
  makeItem('marcus_aurelius', 'מרקוס אורליוס', 'Marcus Aurelius bronze equestrian statue', 'history_leaders', ['מדיטציה וכתיבת יומן', 'שקט נפשי', 'ספר פילוסופיה', 'טיול רגלי', 'משמעת בוקר']),
  makeItem('queen_elizabeth_i', 'אליזבת הראשונה', 'Queen Elizabeth I Armada portrait', 'history_leaders', ['פנינים ועגילים', 'שמלה מגוהצת', 'מכתב מלכותי', 'מריחת בושם', 'תה מנחה']),
  makeItem('queen_elizabeth_ii', 'אליזבת השנייה', 'Queen Elizabeth II official portrait', 'history_leaders', ['טיול עם הכלב', 'תיק יד וארנק', 'אירוע משפחתי', 'כובע תואם', 'דואר מלכותי']),
  makeItem('mahatma_gandhi', 'מהטמה גנדי', 'Mahatma Gandhi spinning wheel portrait', 'history_leaders', ['דיאטה וצום בריאותי', 'משקפי ראייה', 'סנדלים נוחים', 'הליכה של 10000 צעדים', 'שלום']),
  makeItem('martin_luther_king', 'מרטין לותר קינג', 'Martin Luther King Jr I Have a Dream', 'history_leaders', ['נאום בישיבת עבודה', 'פגישת צוות', 'עניבה שחורה', 'ספר תפילה', 'עזרה לזולת']),
  makeItem('nelson_mandela', 'נלסון מנדלה', 'Nelson Mandela smiling portrait', 'history_leaders', ['סליחה והתפייסות', 'ביקור חולים', 'חולצה פרחונית', 'תקווה ושמחה', 'חופש']),
  makeItem('franklin_d_roosevelt', 'פרנקלין דלאנו רוזוולט', 'Franklin D. Roosevelt portrait', 'history_leaders', ['האזנה לרדיו ופודקאסט', 'פיזיותרפיה', 'גלגלי כיסא', 'תוכנית חיסכון', 'סיגריה']),
  makeItem('theodore_roosevelt', 'תאודור רוזוולט', 'Theodore Roosevelt portrait Pach Brothers', 'history_leaders', ['טיול בפארק לאומי', 'משקפיים עגולים', 'שפם מטופח', 'אימון אגרוף', 'ציד מציאות']),
  makeItem('joan_of_arc', 'ז\'אן ד\'ארק', 'Joan of Arc painting Jules Bastien-Lepage', 'history_leaders', ['אומץ להתמודד עם קושי', 'שריון מגן', 'תפילה בבוקר', 'דגל מתנופף', 'סוס לבן']),
  makeItem('catherine_the_great', 'יקטרינה הגדולה', 'Catherine the Great portrait Rokotov', 'history_leaders', ['ספריית ספרים עשירה', 'קניית רהיטים יוקרתיים', 'מכתב לחבר בחו\"ל', 'מעיל פרווה', 'ארמון']),
  makeItem('peter_the_great', 'פיוטר הגדול', 'Peter the Great Paul Delaroche portrait', 'history_leaders', ['בניית סירה ונגרות', 'גילוח זקן', 'נסיעה לנמל ים', 'מגפי עור גבוהים', 'סרגל']),
  makeItem('charlemagne', 'קרל הגדול', 'Charlemagne Albrecht Durer portrait', 'history_leaders', ['לימוד שפה זרה', 'כתר מלכות', 'חתימה על מסמך', 'גלימה אדומה', 'חרב מלכות']),
  makeItem('genghis_khan', 'ג\'ינגיס חאן', 'Genghis Khan portrait National Palace Museum', 'history_leaders', ['אוהל קמפינג בשטח', 'רכיבה על סוס', 'קשת וחצים', 'חגורת עור', 'מדורה בלילה']),
  makeItem('cyrus_the_great', 'כורש הגדול', 'Cyrus the Great cylinder British Museum', 'history_leaders', ['היתר בנייה מהעירייה', 'גליל חרס', 'זכויות עובדים', 'הצהרה רשמית', 'שיבה הביתה']),
  makeItem('king_arthur', 'המלך ארתור', 'King Arthur painting Charles Ernest Butler', 'history_leaders', ['שולחן עגול לארוחת ערב', 'שליפת חרב מסלע', 'נאמנות לחברים', 'טירה עתיקה', 'גביע']),
  makeItem('richard_lionheart', 'ריצ\'רד לב הארי', 'Richard the Lionheart statue Westminster', 'history_leaders', ['אומץ לב במבחן', 'מגן אבירים', 'נסיעה ארוכה לחו\"ל', 'סוס קרב', 'גבורה']),
  makeItem('saladin', 'סלאח א-דין', 'Saladin portrait historical illustration', 'history_leaders', ['כבוד לאורחים', 'חלוקת מים וכיבוד', 'שוק תבלינים', 'סוס ערבי', 'חמלה']),
  makeItem('hammurabi', 'חמורבי', 'Code of Hammurabi stele Louvre', 'history_leaders', ['חוקים ותקנות הבית', 'עמוד אבן שחור', 'הסכם עבודה', 'שכר דירה', 'סדר ומשמעת']),
  makeItem('ben_gurion', 'דוד בן גוריון', 'David Ben-Gurion standing on head', 'history_leaders', ['עמידת ראש ויוגה', 'צריף בקיבוץ', 'קריאת ספרים', 'חולצת חאקי', 'הכרזת המדינה']),
  makeItem('golda_meir', 'גולדה מאיר', 'Golda Meir portrait smiling', 'history_leaders', ['נעלי גולדה נוחות', 'קפה במטבחון', 'קופסת סיגריות', 'שיחה עם מנהיגים', 'מרק עוף']),
  makeItem('menachem_begin', 'מנחם בגין', 'Menachem Begin Camp David portrait', 'history_leaders', ['הסכם שלום היסטורי', 'חליפה ועניבה', 'נאום חוצב להבות', 'משקפי ראייה', 'יושרה']),
  makeItem('yitzhak_rabin', 'יצחק רבין', 'Yitzhak Rabin Nobel Peace Prize portrait', 'history_leaders', ['לחיצת יד חגיגית', 'עצרת שלום', 'מדי צבא א' , 'פנקס שחור', 'חתירה למטרה']),
  makeItem('moshe_dayan', 'משה דיין', 'Moshe Dayan eye patch portrait', 'history_leaders', ['רטייה על העין', 'משקפת שדה', 'חפירות ארכיאולוגיה', 'חולצת פסים', 'נועזות']),
  makeItem('shimon_peres', 'שמעון פרס', 'Shimon Peres smiling portrait', 'history_leaders', ['חדשנות והייטק', 'ספר לילה', 'חליפה אלגנטית', 'אופטימיות לעתיד', 'עט נובע']),
  makeItem('zeev_jabotinsky', 'זאב ז\'בוטינסקי', 'Ze\'ev Jabotinsky portrait', 'history_leaders', ['כתיבת שיר ומאמר', 'מסדר חגיגי', 'משקפיים עגולים', 'מדי בית\"ר', 'הדר ונימוס']),
  makeItem('theodor_herzl', 'בנימין זאב הרצל', 'Theodor Herzl balcony Basel portrait', 'history_leaders', ['מרפסת ומעקה', 'זקן שחור ומסודר', 'חלומות ומטרות', 'חליפת ערב', 'קונגרס']),
  makeItem('hannah_szenes', 'חנה סנש', 'Hannah Szenes portrait kibbutz', 'history_leaders', ['מצנח וצניחה', 'כתיבת שיר ביומן', 'גפרור וניצוץ', 'אומץ והקרבה', 'חופי קיסריה']),
  makeItem('eli_cohen', 'אלי כהן', 'Eli Cohen Eliyahu Cohen portrait', 'history_leaders', ['משדר מורס חשאי', 'קפה בדמשק', 'עצי אקליפטוס', 'שמירת סוד', 'מסירות']),
  makeItem('sarah_aaronsohn', 'שרה אהרנסון', 'Sarah Aaronsohn Nili portrait', 'history_leaders', ['יונת דואר', 'תחנת ניסיונות חקלאית', 'אקדח קטן', 'אומץ לב נשי', 'זכרון יעקב']),
  makeItem('joseph_trumpeldor', 'יוסף טרומפלדור', 'Joseph Trumpeldor portrait', 'history_leaders', ['עבודה ביד אחת', 'חריש בשדה', 'שמירה בחוות תל חי', 'חולצה רוסית', 'אומץ מול פחד']),
  makeItem('jfk_president', 'ג\'ון פ. קנדי', 'John F. Kennedy official portrait', 'history_leaders', ['שיגור לחלל וירח', 'נאום בטלוויזיה', 'חליפת יוקרה', 'משקפי רייבאן', 'משפחה עשירה']),
  makeItem('barack_obama', 'ברק אובמה', 'Barack Obama official presidential portrait', 'history_leaders', ['חליפה כחולה', 'נאום השבעה', 'ספר זיכרונות', 'כדורסל בסופ\"ש', 'תקווה ושינוי']),
  makeItem('ronald_reagan', 'רונלד רייגן', 'Ronald Reagan official presidential portrait', 'history_leaders', ['סוכריות ג\'לי בין', 'סרט הוליוודי ישן', 'הפלת החומה', 'חיוך כובש', 'רדיו']),
  makeItem('bill_clinton', 'ביל קלינטון', 'Bill Clinton official presidential portrait', 'history_leaders', ['סקסופון וג\'אז', 'ריצת בוקר וג\'וגינג', 'פגישת פסגה', 'המבורגר בדרך', 'חיוך רחב']),
  makeItem('george_h_w_bush', 'ג\'ורג\' בוש האב', 'George H.W. Bush portrait', 'history_leaders', ['גרביים צבעוניות', 'צניחה חופשית בגיל 90', 'ספינת מלחמה', 'מכתב בכתב יד', 'דיג']),
  makeItem('harry_truman', 'הארי טרומן', 'Harry Truman official portrait', 'history_leaders', ['שלט שולחני האחריות כאן', 'משקפיים דקות', 'קשת בענן', 'עיתון בוקר', 'החלטיות']),
  makeItem('dwight_eisenhower', 'דווייט אייזנהאואר', 'Dwight D. Eisenhower portrait', 'history_leaders', ['מטריצת עדיפויות דחוף וחשוב', 'נסיעה בכביש מהיר', 'כוכבי גנרל', 'גולף', 'תכנון']),
  makeItem('charles_de_gaulle', 'שארל דה גול', 'Charles de Gaulle portrait', 'history_leaders', ['כובע קצין צרפתי', 'גובה מרשים', 'נאום ברדיו לונדון', 'גאווה לאומית', 'בגט']),
  makeItem('otto_von_bismarck', 'אוטו פון ביסמרק', 'Otto von Bismarck pickelhaube helmet', 'history_leaders', ['קסדת שפיץ גרמנית', 'שפם עבות', 'פוליסת ביטוח בריאות', 'רכבת קיטור', 'ברזל']),
  makeItem('clopatra_needle', 'פרעה חופו', 'Khufu pharaoh statue Cairo Museum', 'history_leaders', ['בניית פירמידה ענקית', 'סרגל אדריכלים', 'בלוק אבן ענק', 'סירת שמש', 'חול מדבר']),
  makeItem('akhenaten', 'אחנתון', 'Akhenaten Pharaoh bust portrait', 'history_leaders', ['קרני שמש זהובות', 'שיר מזמור לבוקר', 'עיר חדשה במדבר', 'פסל חרס', 'שינוי הרגלים']),
  makeItem('nefertiti', 'נפרטיטי', 'Nefertiti bust Berlin Neues Museum', 'history_leaders', ['איפור עיניים מושלם', 'כתר כחול גבוה', 'צוואר ברבור', 'שרשרת אבנים יקרות', 'יופי']),
  makeItem('hatshepsut', 'חתשפסות', 'Hatshepsut statue Metropolitan Museum', 'history_leaders', ['משלחת סחר ימי', 'עצי מור ובשמים', 'מקדש סלעים', 'זקן מלכותי טקסי', 'סמכות']),
  makeItem('ashoka_the_great', 'אשוקה הגדול', 'Ashoka pillar lions Sarnath', 'history_leaders', ['עמודי אבן וסמלי אריות', 'גלגל הצדק', 'צמחונות ורחמים', 'נטיעת עצים בדרך', 'באר מים']),
  makeItem('chandragupta_maurya', 'צ\'נדרגופטה מאוריה', 'Chandragupta Maurya illustration', 'history_leaders', ['איחוד ממלכות', 'יועץ חכם לצידך', 'שומרי ראש', 'פיל קרב', 'משמעת']),
  makeItem('salvador_allende', 'אוגוסטו פינושה', 'Simon Bolivar portrait painting', 'history_leaders', ['שחרור לאומי ועצמאות', 'רכיבה על סוס לבן', 'מדים מוזהבים', 'מפה של דרום אמריקה', 'אומץ']),
  makeItem('jose_de_san_martin', 'חוסה דה סן מרטין', 'Jose de San Martin portrait', 'history_leaders', ['חציית רכס הרי האנדים', 'מעיל צמר כבד', 'חרב פרשים', 'שקט וצניעות', 'שחרור']),
  makeItem('sun_yat_sen', 'סון יאט-סן', 'Sun Yat-sen portrait', 'history_leaders', ['חליפת סון סינית', 'מחשבה על העם', 'נסיעה ברכבת', 'ספר פילוסופיה פוליטית', 'מהפכה']),
  makeItem('chiang_kai_shek', 'צ\'יאנג קאי שק', 'Chiang Kai-shek portrait', 'history_leaders', ['מדי גנרל מסודרים', 'נסיעה לטייוואן', 'יומן אישי', 'תה ירוק בכוס חרסינה', 'עקשנות']),
  makeItem('queen_zenobia', 'זנוביה מלכת תדמור', 'Zenobia Queen of Palmyra painting', 'history_leaders', ['רכיבה במדבר הסורי', 'עיר שיירות מסחר', 'שרשראות זהב', 'גאווה מלכותית', 'קשת']),
  makeItem('boudica', 'בודיקה', 'Boudica Queen of Iceni statue London', 'history_leaders', ['מרכבת קרב עם חרבות', 'שיער אדום מתנפנף', 'מרד בצבא הרומי', 'חנית ביד', 'זעקת קרב']),
  makeItem('spartacus_gladiator', 'ספרטקוס', 'Spartacus statue Louvre Denis Foyatier', 'history_leaders', ['שבירת כבלים ושלשלאות', 'אימון גלדיאטורים', 'מגן עור וחרב קצרה', 'אחווה ונאמנות', 'מרד']),
  makeItem('pericles_athens', 'פריקלס', 'Pericles bust British Museum', 'history_leaders', ['קסדה על הראש', 'בניית הפרתנון', 'דמוקרטיה ודיון פתוח', 'נאום הספד מפורסם', 'אתונה']),
  makeItem('solon_athens', 'סולון מאתונה', 'Solon Athenian lawmaker portrait', 'history_leaders', ['מחיקת חובות והלוואות', 'חוקים הוגנים לכולם', 'שקילה במאזניים', 'טבלאות עץ', 'חכמה']),
  makeItem('leonidas_sparta', 'המלך ליאונידס', 'Leonidas Sparta statue Thermopylae', 'history_leaders', ['הגנה על המעבר הצר', 'מגן ספרטני עגול', 'גלימה אדומה', 'משמעת ברזל', '300']),
  makeItem('themistocles', 'תמיסטוקלס', 'Themistocles herm Ostia', 'history_leaders', ['צי ספינות מלחמה', 'קרב ימי בסלמיס', 'תחבולה גאונית', 'משוטים במים', 'חזון']),
  makeItem('hannibal_barca', 'חניבעל ברקה', 'Hannibal Barca bust Naples Museum', 'history_leaders', ['חציית האלפים עם פילים', 'מעיל שלג כבד', 'קרב קאנה הטקטי', 'שבועת נעורים', 'נחישות']),
  makeItem('scipio_africanus', 'סקיפיו אפריקנוס', 'Scipio Africanus bust Capitoline Museum', 'history_leaders', ['ניצחון בקרב זאמה', 'מדי מפקד רומי', 'כתר דפנה', 'כבוד לאויב המובס', 'גאונות']),
  makeItem('augustus_caesar', 'אוגוסטוס קיסר', 'Augustus of Prima Porta statue Vatican', 'history_leaders', ['שקט ושלווה אימפריאלית', 'בנייה בשיש לבן', 'יד מושטת לנאום', 'שריון חזה מעוטר', 'שלום']),
  makeItem('trajan_emperor', 'טראיאנוס', 'Trajan emperor bust Glyptothek', 'history_leaders', ['עמוד טראיאנוס עם תבליטים', 'שוק קניות ענק', 'גשר על הדנובה', 'מדים צבאיים', 'דאגה לעם']),
  makeItem('hadrian_emperor', 'אדריאנוס', 'Hadrian bust British Museum', 'history_leaders', ['חומת אבנים ארוכה', 'זקן פילוסופי קצר', 'כיפת הפנתיאון', 'טיולים ברחבי העולם', 'ארכיטקטורה']),
  makeItem('constantine_the_great', 'קונסטנטינוס הגדול', 'Constantine the Great colossal head Rome', 'history_leaders', ['העברת בירה לקונסטנטינופול', 'סמל הצלב בשמיים', 'פסל שיש ענק', 'חופש דת', 'מטבע זהב']),
  makeItem('justinian_i', 'יוסטיניאנוס הראשון', 'Justinian I mosaic Ravenna San Vitale', 'history_leaders', ['בניית כנסיית איה סופיה', 'ספר חוקי המשפט', 'פסיפס זהב מנצנץ', 'כתר פנינים', 'היסטוריה']),
  makeItem('clovis_i', 'כלוביס הראשון', 'Clovis I king of Franks painting', 'history_leaders', ['טבילה חגיגית במים', 'פרח שושן צרפתי', 'גרזן קרב פרנקי', 'איחוד שבטים', 'שמן קדוש']),
  makeItem('louis_xiv', 'לואי ה-14 מלך השמש', 'Louis XIV Hyacinthe Rigaud portrait', 'history_leaders', ['ארמון ורסאי המפואר', 'פאת תלתלים ענקית', 'נעלי עקב עם סרטים', 'מראות מוזהבות', 'מלך השמש']),
  makeItem('louis_xvi', 'לואי ה-16', 'Louis XVI portrait Duplessis', 'history_leaders', ['שעוני מנגנון ומנעולים', 'חליפת משי צרפתית', 'בריחה בכרכרה', 'מהפכה ברחוב', 'ספר חשבונות']),
  makeItem('marie_antoinette', 'מארי אנטואנט', 'Marie Antoinette portrait Vigee Le Brun', 'history_leaders', ['עוגות קרם ומאפים', 'תסרוקת מגדל גבוהה', 'שמלת קרינולינה תפוחה', 'גינת פרחים כפרית', 'מניפה']),
  makeItem('maximilian_robespierre', 'מקסימיליאן רובספייר', 'Maximilien Robespierre portrait Carnavalet', 'history_leaders', ['משקפי ראייה מרובעים', 'חליפה ירוקה מוקפדת', 'נאום לוהט באסיפה', 'שעון כיס', 'טוהר מידות'])
];

console.log(`History & Leaders ready: ${history_leaders.length} items`);

// Write out the catalog
const catalogPath = path.resolve(__dirname, 'catalog_1000/history_leaders.json');
fs.writeFileSync(catalogPath, JSON.stringify(history_leaders, null, 2));
console.log('Saved to:', catalogPath);
