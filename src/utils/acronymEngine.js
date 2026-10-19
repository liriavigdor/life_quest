// Hebrew Acronym (ראשי תיבות) Engine & Mnemonic Generator for Life Quest
// Extracts initials, tests permutations and multi-word partitions against meaningful Hebrew words,
// and produces real, memorable Hebrew words and phrases (e.g. "מופקד רע", "שכ״ח", "מחד״ד").

// Curated Lexicon of memorable, concrete Hebrew words (2 to 6 letters)
const HEBREW_WORD_LEXICON = new Set([
  // 2 letters
  'אב', 'אח', 'אם', 'אף', 'אש', 'בד', 'בו', 'בר', 'בת', 'גג', 'גד', 'גל', 'גם', 'גר', 'גת',
  'דב', 'דג', 'דד', 'דם', 'דף', 'דר', 'הד', 'הו', 'הם', 'הר', 'זב', 'זה', 'זר', 'חג', 'חד',
  'חי', 'חן', 'חם', 'חר', 'חץ', 'טל', 'ים', 'יד', 'יום', 'יש', 'כד', 'כי', 'כל', 'כף', 'כת',
  'לב', 'לו', 'לי', 'לך', 'לף', 'מד', 'מה', 'מו', 'מי', 'מן', 'מס', 'מר', 'מת', 'נא', 'נו',
  'נר', 'סל', 'סם', 'סף', 'עד', 'עז', 'עי', 'על', 'עם', 'עץ', 'ער', 'עת', 'פה', 'פו', 'פח',
  'פי', 'פך', 'פל', 'פן', 'פס', 'פר', 'פת', 'צב', 'צו', 'צד', 'צל', 'צר', 'קד', 'קו', 'קל',
  'קן', 'קף', 'קר', 'קש', 'רב', 'רג', 'רד', 'רו', 'רז', 'רי', 'רך', 'רם', 'רע', 'רף', 'רק',
  'רש', 'שד', 'שו', 'שי', 'שם', 'שן', 'שר', 'שת', 'תג', 'תו', 'תם', 'תף',

  // 3 letters
  'אבן', 'אגם', 'אגוז', 'אדם', 'אדר', 'אהל', 'אוהל', 'אור', 'אויר', 'איל', 'איש', 'אלף', 'אמת',
  'אנך', 'ארז', 'ארון', 'ארץ', 'אשד', 'אשל', 'בגד', 'באר', 'בהר', 'בוץ', 'בור', 'בזק', 'בטל',
  'בית', 'בכר', 'בלם', 'במה', 'בנה', 'בקר', 'ברק', 'ברזל', 'בשם', 'גבר', 'גדר', 'גוז', 'גומ',
  'גור', 'גזע', 'גזר', 'גיל', 'גלם', 'גמל', 'גפן', 'גרב', 'גרם', 'גרעין', 'גשר', 'דבש', 'דגל',
  'דוב', 'דוד', 'דלת', 'דמע', 'דפוס', 'דפק', 'דרך', 'הבל', 'הוד', 'הלך', 'הלם', 'התר', 'זהב',
  'זוג', 'זית', 'זמן', 'זמר', 'זרם', 'זרע', 'זכר', 'חבל', 'חבר', 'חגב', 'חדר', 'חדש', 'חוב', 'חוט', 'חוף',
  'חוק', 'חור', 'חזה', 'חזק', 'חיה', 'חיל', 'חיטה', 'חכם', 'חלב', 'חלח', 'חלם', 'חלון', 'חלק',
  'חמד', 'חמר', 'חמש', 'חמת', 'חצב', 'חצר', 'חרב', 'חרט', 'חרק', 'חרש', 'חשב', 'חשך', 'חתם',
  'חתול', 'טבח', 'טבע', 'טוב', 'טור', 'טיח', 'טיס', 'טלף', 'טעם', 'טפה', 'טפר', 'טרף', 'יובל',
  'יונה', 'יומן', 'יורה', 'ילד', 'יער', 'יצא', 'יקר', 'ירח', 'ירק', 'יתד', 'כבד', 'כוכב', 'כובע',
  'כותל', 'כחול', 'כיס', 'כלב', 'כלי', 'כסף', 'כפר', 'כרם', 'כתב', 'כתר', 'כוח', 'לבן', 'להב', 'לוג',
  'לוח', 'לוט', 'לחם', 'ליל', 'לימון', 'ליש', 'למד', 'לפיד', 'לקח', 'לשון', 'מאזן', 'מבצר', 'מגדל',
  'מגן', 'מדף', 'מדע', 'מזון', 'מזל', 'מזלג', 'מחט', 'מחל', 'מחר', 'מטוס', 'מטר', 'מטרייה', 'מיץ',
  'מילון', 'מים', 'מלך', 'מלפפון', 'מנעול', 'מסמר', 'מסך', 'מעגל', 'מעיין', 'מפה', 'מפתח', 'מצפן',
  'מרכז', 'מרק', 'משא', 'משב', 'משוט', 'משפט', 'מתן', 'מתקן', 'נבט', 'נגב', 'נגר', 'נדב', 'נהר',
  'נווה', 'נוצה', 'נחל', 'נחש', 'נייר', 'נמר', 'נעל', 'נפש', 'נצב', 'נקב', 'נרד', 'נשר', 'סביב',
  'סגל', 'סדן', 'סוס', 'סוכה', 'סוף', 'סולם', 'סיד', 'סיפור', 'סיר', 'סכין', 'סלע', 'סמל', 'סנטר',
  'ספר', 'סרט', 'סתיו', 'עבד', 'עוגב', 'עוגה', 'עוז', 'עולם', 'עוף', 'עור', 'עורב', 'עזב', 'עזר',
  'עין', 'עיר', 'ענן', 'עפר', 'עץ', 'עצב', 'עקב', 'ערב', 'ערוץ', 'ערסל', 'עשב', 'עשן', 'עתיד',
  'פאר', 'פטיש', 'פטרייה', 'פיל', 'פינה', 'פלא', 'פלג', 'פנס', 'פעמון', 'פצע', 'פקיד', 'פרד', 'פרח',
  'פרי', 'פרק', 'פרפר', 'פשר', 'פתח', 'פתיל', 'צבא', 'צבע', 'צבי', 'צדף', 'צוהר', 'צומת', 'צוק',
  'ציור', 'ציפור', 'צלחת', 'צמח', 'צמר', 'צפור', 'צרור', 'קבר', 'קדוש', 'קול', 'קומץ', 'קוף', 'קוץ',
  'קורה', 'קיטור', 'קיץ', 'קיר', 'קלף', 'קמח', 'קנה', 'קערה', 'קצב', 'קרב', 'קרח', 'קרן', 'קשת',
  'ראש', 'רגל', 'רוח', 'רומח', 'רוק', 'רחוב', 'רחם', 'רכב', 'רכס', 'רמז', 'רעף', 'רעם', 'רענן',
  'רצפה', 'רקמה', 'רשת', 'שאון', 'שבר', 'שבת', 'שדה', 'שופר', 'שור', 'שולחן', 'שועל', 'שזף', 'שחף',
  'שחר', 'שיר', 'שלב', 'שלום', 'שלט', 'שליח', 'שלם', 'שמן', 'שמש', 'שנה', 'שעון', 'שער', 'שפה',
  'שפן', 'שקנאי', 'שקר', 'שרביט', 'שרף', 'שתיל', 'שכח', 'שמח', 'שמר', 'סדר', 'תאנה', 'תבור', 'תבשיל', 'תגלית', 'תדהר', 'תהום',
  'תומר', 'תור', 'תושב', 'תזונה', 'תיבה', 'תיק', 'תלתל', 'תמוז', 'תמונה', 'תמר', 'תנור', 'תפוח',
  'תפילה', 'תקווה', 'תקליט', 'תרגיל', 'תרמיל', 'תרנגול', 'תשבץ', 'תשוקה', 'תשורה',
  'בשר', 'דמע', 'ברק', 'רעם', 'שלג', 'ברד', 'חום', 'קור', 'עשב', 'שבל', 'קשש', 'עשש', 'גבע', 'סלע', 'חול', 'בוץ',
  'צלי', 'קפה', 'תהי', 'מיצ', 'גבן', 'חמא', 'ביצ', 'סלט', 'בצל', 'שום', 'חסה', 'סלק', 'גזר', 'דלעת', 'קיש',

  // 4 letters
  'אבטח', 'בטוח', 'אבטחה', 'אלפא', 'ארנב', 'אשכול', 'אשפה', 'בטחה', 'בלוט', 'בלון', 'בננה', 'בקרת', 'ברכה', 'גבורה', 'גולף',
  'גפרור', 'דוגמה', 'דובדבן', 'דיוקן', 'הברקה', 'הנהלה', 'הצלחה', 'השראה', 'וילון', 'ורד', 'זריחה',
  'חגורה', 'חולצה', 'חצוצרה', 'חרמון', 'חרצית', 'יהלום', 'ירדן', 'כרכרה', 'לבנה', 'לביבה', 'מגילה',
  'מדורה', 'מופת', 'מחברת', 'מחדד', 'מדריך', 'מחנה', 'מפקד', 'מחסן', 'משלט', 'מסדר', 'משמר', 'מוקד',
  'מחשב', 'מזכרת', 'מטבע', 'מנהיג', 'מנורה', 'מעיל', 'מפקדה', 'מרכבה', 'משמרת', 'משקפת', 'משאית',
  'מונע', 'נוסע', 'פועל', 'נובע', 'נוגע', 'קובע', 'בונה', 'רואה', 'שומע', 'הולך', 'לוקח', 'נותן',
  'עומד', 'יושב', 'צומח', 'זורח', 'פותח', 'סוגר', 'זוכר', 'כותב', 'קורא', 'אוהב', 'רוכב', 'שומר',
  'מוכן', 'מוגן', 'מוצג', 'מושל', 'נוצר', 'יוצר', 'עובר', 'חוזר', 'לוחם', 'דוהר', 'קופץ', 'שוחה',
  'נושם', 'נושף', 'לוחש', 'טוען', 'יועץ', 'שופט', 'עוטף', 'רוקד', 'חוגג', 'מוקף', 'מודד',
  'מרפא', 'רופא', 'מבצע', 'מוביל', 'מרחב', 'מדבר', 'מקור', 'מומחה', 'מזרח', 'מערב', 'מטען', 'בקבוק', 'עוגיה',
  'רצפה', 'חבישה', 'טיפול', 'תרופה', 'עוצמה', 'שלווה', 'ניצחון', 'תהילה', 'יושרה', 'אמונה', 'אהבה',
  'נחשול', 'נפטון', 'נקודה', 'סביון', 'סמטה', 'עגבניה', 'עוגוג', 'עופרת', 'עקרב', 'עששית', 'פגיון',
  'פטיפון', 'פנסים', 'פסנתר', 'פיקוד', 'צדקה', 'צלצול', 'צמיד', 'קומקום', 'קערות', 'קרמבו', 'רקיע',
  'שאגת', 'שמחה', 'שריקה', 'תוצרת', 'תורן', 'תלמיד', 'תפוז', 'תרמיל',
  'אבטיח', 'אגרוף', 'אוצר', 'אומן', 'אוהל', 'אילן', 'אומץ', 'אופק', 'אורח', 'איטי', 'איטר',
  'אכזב', 'אלים', 'אלמן', 'אלתר', 'אמון', 'אמיץ', 'אמיר', 'אמנם', 'אסוך', 'אסור', 'אסיר', 'אספה',
  'אפוד', 'אפוף', 'אפרוח', 'אצבע', 'אציל', 'אצטבה', 'אקלים', 'ארבה', 'ארגז', 'ארמון', 'אשמדאי',
  'בדיל', 'בדוק', 'בהיר', 'בהלה', 'בהמה', 'בוהן', 'בוחן', 'בוטן', 'בוקר', 'בושת', 'בזבוז', 'בזיונ',
  'בחור', 'בחינה', 'בחירה', 'בטוח', 'ביוב', 'ביצה', 'ביקתה', 'בלאי', 'בלדר', 'בלבול', 'בליטה',
  'במבה', 'במאי', 'במקור', 'בנאי', 'בסיס', 'בעבע', 'בעיה', 'בעירה', 'בעלים', 'בציר', 'בקעה', 'ברור',
  'בריח', 'ברית', 'ברנש', 'ברקת', 'בשורת', 'בתול', 'גאוה', 'גבאי', 'גבות', 'גביה', 'גביע', 'גביש',
  'גדוש', 'גדעון', 'גודל', 'גוזל', 'גולש', 'גומץ', 'גופיה', 'גזבר', 'גזילה', 'גחלת', 'גיבור', 'גידול',
  'גיוס', 'גילוח', 'גימוד', 'גימור', 'גינה', 'גיסא', 'גירוי', 'גלגל', 'גלוב', 'גלוי', 'גלוש', 'גלידה',
  'גליל', 'גלימה', 'גמיש', 'גמלון', 'גנוב', 'גנוז', 'גננת', 'געשון', 'גפרת', 'גרוט', 'גרוש', 'גרזן',
  'גריל', 'גרעין', 'גרפי', 'גרשון', 'גשום', 'גשמי', 'דאגה', 'דאיה', 'דביק', 'דבור', 'דביר', 'דגם',
  'דובב', 'דווקא', 'דוכן', 'דומם', 'דונג', 'דופק', 'דחוס', 'דחיק', 'דחליל', 'דחפור', 'דיבוב', 'דייג',
  'דייר', 'דיסה', 'דיסק', 'דירה', 'דליק', 'דממה', 'דמיון', 'דמעות', 'דעיכה', 'דפוק', 'דפנה', 'דקירה',
  'דרור', 'דריכה', 'דרכון', 'דרמה', 'הבנה', 'הבער', 'הברח', 'הגדה', 'הגנה', 'הדבר', 'הדלף', 'הדסה',
  'הדרג', 'הדרת', 'הודו', 'הובל', 'הוזה', 'הוכה', 'הולם', 'הומה', 'הומור', 'הופך', 'הופעה', 'הוצא',
  'הוקם', 'הוקר', 'הורו', 'הורם', 'הורש', 'הזנה', 'הזעה', 'הזקה', 'הזקן', 'החבא', 'החזר', 'החלש',
  'החלט', 'החלם', 'החנה', 'החפץ', 'החקר', 'החרם', 'החרף', 'החשך', 'הטבה', 'הטיל', 'הטעמה', 'הטרדה',
  'היכר', 'הימם', 'היסס', 'היקף', 'הישג', 'היתר', 'הכנה', 'הכאה', 'הכבד', 'הכרה', 'הכשל', 'הכתב',
  'הלבש', 'הלום', 'הליכה', 'הליק', 'הלכה', 'הללם', 'הלצה', 'המחז', 'המיה', 'המלט', 'המתק', 'הנאה',
  'הנחה', 'הנצה', 'הנשם', 'הסבר', 'הסכם', 'הספק', 'הסתר', 'הפגז', 'הפחד', 'הפטר', 'הפיל', 'הפלק',
  'הפעם', 'הפרד', 'הפרש', 'הצבע', 'הצלה', 'הצפה', 'הצמד', 'הצנע', 'הצרך', 'הקפה', 'הקדש', 'הקלט',
  'הקמה', 'הקנה', 'הקפא', 'הקרב', 'הקרן', 'הראה', 'הרגל', 'הרגה', 'הרדם', 'הרסן', 'הרעב', 'הרעש',
  'הרקה', 'השבע', 'השגח', 'השמד', 'השמע', 'השפל', 'השקע', 'השקט', 'השרץ', 'התמד', 'התנא', 'התקף',
  'ואדי', 'ואזה', 'וויד', 'וידא', 'וירוס', 'ויתור', 'ותיק', 'זאבה', 'זבובי', 'זגוג', 'זדון', 'זהוב',
  'זהיר', 'זהות', 'זהרה', 'זוחל', 'זוטא', 'זוטר', 'זוכך', 'זולת', 'זומם', 'זועם', 'זופת', 'זוקף',
  'זורם', 'זורע', 'זחלן', 'זיגזג', 'זיוד', 'זינוק', 'זירוז', 'זכות', 'זכוכ', 'זכור', 'זמיר', 'זמני',
  'זעיר', 'זעקת', 'זפתה', 'זקוף', 'זקוק', 'זקיף', 'זקנק', 'זרבו', 'זרחן', 'זריז', 'זרקת', 'חבוב',
  'חבוק', 'חבול', 'חביב', 'חבית', 'חבלה', 'חבצלת', 'חברות', 'חבור', 'חגיג', 'חגלה', 'חגור', 'חדיש',
  'חדקה', 'חדוה', 'חודש', 'חוחית', 'חומץ', 'חומת', 'חופש', 'חוצב', 'חוצץ', 'חוקר', 'חורש', 'חושב',
  'חושך', 'חושק', 'חותם', 'חזאי', 'חזות', 'חזיר', 'חזקה', 'חטוב', 'חטוט', 'חטיף', 'חטוף', 'חטטן',
  'חיוך', 'חיות', 'חיוג', 'חיוב', 'חידק', 'חידה', 'חיזק', 'חיטט', 'חיסל', 'חיפו', 'חישב', 'חיתל',
  'חכימא', 'חככה', 'חלאה', 'חלוץ', 'חלום', 'חלוק', 'חלקה', 'חליל', 'חליפה', 'חלקי', 'חמאה', 'חמוד',
  'חמוץ', 'חמסה', 'חמסי', 'חמקת', 'חמרה', 'חמשה', 'חמשוש', 'חנפה', 'חנקן', 'חסיד', 'חסין', 'חסכן',
  'חסלת', 'חספת', 'חסרת', 'חפוד', 'חפוי', 'חפוף', 'חפיץ', 'חפירה', 'חפצה', 'חפצן', 'חצבץ', 'חציר',
  'חצופה', 'חצרון', 'חרבה', 'חרגול', 'חרדת', 'חרוז', 'חרוט', 'חרוץ', 'חרוש', 'חרטה', 'חרפה', 'חרצוב',
  'חרשת', 'חרתול', 'חשוב', 'חשוד', 'חשוף', 'חשמל', 'חשקן', 'חתול', 'חתום', 'חתיר', 'חתפה', 'חתרן',

  // 5 letters
  'מופקד', 'מדריכה', 'משמעת', 'מצטיין', 'משותף', 'תחבורה', 'מחשבה', 'תקשורת', 'הצלחה', 'הנהגה',
  'ביטחון', 'פלוגה', 'מחלקה', 'חטיבה', 'גדוד', 'פקודה', 'מסלול', 'משקפיים', 'שמירה', 'תורנות',
  'אלופה', 'חשיבה', 'זיכרון', 'כוכבים', 'מנצח', 'מנצחת', 'רכבת', 'ממשלה', 'היסטוריה', 'מחשבים', 'מחברות', 'משפחה',
  'בריאות', 'סבלנות', 'מנהיגות', 'התמדה', 'יצירתי', 'רגישות', 'סקרנות', 'הקשבה', 'משמעות', 'שאיפה', 'הגשמה', 'התפתחות'
]);

// Final Hebrew letter to regular letter map
const FINAL_TO_MEDIAL = {
  'ך': 'כ',
  'ם': 'מ',
  'ן': 'נ',
  'ף': 'פ',
  'ץ': 'צ'
};

// Clean and extract the first significant Hebrew letter from an item text
export function extractInitialLetter(itemText) {
  if (!itemText || typeof itemText !== 'string') return '';
  // Strip emojis, leading quotes, bullets, numbers, hyphens
  const cleaned = itemText.replace(/^[0-9.\-•#\s"'״׳«»\(\)\[\]{}]+/g, '').trim();
  if (!cleaned) return '';

  // Find first Hebrew character
  const match = cleaned.match(/[\u0590-\u05FF]/);
  if (!match) return '';

  let letter = match[0];
  // Convert final letter if it occurs as the first letter
  if (FINAL_TO_MEDIAL[letter]) {
    letter = FINAL_TO_MEDIAL[letter];
  }
  return letter;
}

// Format an acronym with Hebrew gershayim (״) before the last letter
export function formatAcronymString(letters) {
  if (!letters || letters.length === 0) return '';
  if (letters.length === 1) return letters[0] + '׳';
  const head = letters.slice(0, -1).join('');
  const last = letters[letters.length - 1];
  return `${head}״${last}`;
}

// Helper to check if a word can be formed from available letter counts
function canFormWord(word, counts) {
  const needed = {};
  for (const ch of word) {
    needed[ch] = (needed[ch] || 0) + 1;
    if (needed[ch] > (counts[ch] || 0)) return false;
  }
  return true;
}

// Subtract word letters from counts
function subtractWord(word, counts) {
  const res = { ...counts };
  for (const ch of word) {
    res[ch] = (res[ch] || 0) - 1;
    if (res[ch] <= 0) delete res[ch];
  }
  return res;
}

/**
 * Smart Combinatorial & Phrase Solver:
 * Finds the best single word or multi-word phrase from a pool of letters.
 */
function findBestAcronymSolution(itemPairs) {
  const n = itemPairs.length;
  const originalLetters = itemPairs.map(p => p.letter);
  const origStr = originalLetters.join('');
  const reverseStr = originalLetters.slice().reverse().join('');

  // Target letter counts
  const targetCounts = {};
  for (const p of itemPairs) {
    targetCounts[p.letter] = (targetCounts[p.letter] || 0) + 1;
  }

  // Filter candidates from lexicon that can be formed from targetCounts
  const candidates = [];
  for (const word of HEBREW_WORD_LEXICON) {
    if (word.length >= 2 && word.length <= n && canFormWord(word, targetCounts)) {
      candidates.push(word);
    }
  }

  // Sort candidates by length descending
  candidates.sort((a, b) => b.length - a.length);

  // 1. Single Word exact matches (length == n)
  const singleMatches = candidates.filter(w => w.length === n);
  if (singleMatches.length > 0) {
    singleMatches.sort((a, b) => {
      if (a === origStr) return -1;
      if (b === origStr) return 1;
      if (a === reverseStr) return -1;
      if (b === reverseStr) return 1;
      if (a[0] === originalLetters[0]) return -1;
      if (b[0] === originalLetters[0]) return 1;
      return 0;
    });

    const chosen = singleMatches[0];
    return {
      type: 'single_word',
      words: [chosen],
      isRealWord: true,
      isChronological: chosen === origStr,
      isReverse: chosen === reverseStr
    };
  }

  // 2. Mnemonic Pattern Detection: Repeated Letter Stacking (מכפילי אותיות / אותיות זהות)
  // Identifies striking cognitive patterns like "3 ממים + אבטח" ("ממ״מ אבט״ח")
  const repeatedPatternMatches = [];
  for (const [ch, count] of Object.entries(targetCounts)) {
    if (count >= 2) {
      const remAfterRepeats = { ...targetCounts };
      delete remAfterRepeats[ch];
      const remLen = n - count;

      if (remLen === 0) {
        // All items start with the same letter (Alliteration: e.g. 4 מ's)
        repeatedPatternMatches.push({
          type: 'alliteration',
          repLetter: ch,
          repCount: count,
          wordPart: '',
          words: [ch.repeat(count)],
          score: 110,
          isRealWord: true,
          isPattern: true
        });
      } else if (remLen >= 2) {
        // Can remaining letters form a single Hebrew word? (e.g. "אבטח")
        const remSingleWords = candidates.filter(w => w.length === remLen && canFormWord(w, remAfterRepeats));
        for (const w of remSingleWords) {
          repeatedPatternMatches.push({
            type: 'repeated_multiplier',
            repLetter: ch,
            repCount: count,
            wordPart: w,
            words: [ch.repeat(count), w],
            score: (count >= 3 ? 105 : 85) + (w.length >= 3 ? 5 : 0),
            isRealWord: true,
            isPattern: true
          });
        }

        // Can remaining letters form a 2-word phrase? (for n >= 6)
        if (remLen >= 4 && repeatedPatternMatches.length === 0) {
          for (let i = 0; i < candidates.length; i++) {
            const w1 = candidates[i];
            if (w1.length < 2 || w1.length > remLen - 2) continue;
            if (!canFormWord(w1, remAfterRepeats)) continue;
            const rem2 = subtractWord(w1, remAfterRepeats);
            for (let j = 0; j < candidates.length; j++) {
              const w2 = candidates[j];
              if (w2.length !== remLen - w1.length) continue;
              if (canFormWord(w2, rem2)) {
                repeatedPatternMatches.push({
                  type: 'repeated_multiplier',
                  repLetter: ch,
                  repCount: count,
                  wordPart: `${w1} ${w2}`,
                  words: [ch.repeat(count), w1, w2],
                  score: (count >= 3 ? 95 : 75),
                  isRealWord: true,
                  isPattern: true
                });
              }
            }
          }
        }
      }
    }
  }

  // If a high-confidence repeated multiplier pattern was found (e.g. 3+ repeats or 2-repeats),
  // sort by score and check if it outranks or provides an ideal mnemonic
  repeatedPatternMatches.sort((a, b) => b.score - a.score);

  // If we have a 3+ letter multiplier (e.g. 3 מ's + אבטח), it has supreme cognitive saliency
  if (repeatedPatternMatches.length > 0 && repeatedPatternMatches[0].repCount >= 3) {
    return repeatedPatternMatches[0];
  }

  // 3. Two Words exact matches (w1.length + w2.length == n)
  // Example: "עקב" (3) + "מרפא" (4) = 7
  const pairMatches = [];
  for (let i = 0; i < candidates.length; i++) {
    const w1 = candidates[i];
    if (w1.length < 2 || w1.length > n - 2) continue;
    const remCounts = subtractWord(w1, targetCounts);

    for (let j = 0; j < candidates.length; j++) {
      const w2 = candidates[j];
      if (w2.length !== n - w1.length) continue;
      if (canFormWord(w2, remCounts)) {
        pairMatches.push([w1, w2]);
      }
    }
  }

  if (pairMatches.length > 0) {
    const scorePair = (pair) => {
      const fullStr = pair.join('');
      let score = 0;
      let lastIdx = -1;
      for (const ch of fullStr) {
        const idx = originalLetters.indexOf(ch, lastIdx + 1);
        if (idx > lastIdx) {
          score += 2;
          lastIdx = idx;
        }
      }
      if (pair[0][0] === originalLetters[0]) score += 5;
      return score;
    };

    pairMatches.sort((pairA, pairB) => {
      const diff = scorePair(pairB) - scorePair(pairA);
      if (diff !== 0) return diff;
      return pairB[0].length - pairA[0].length;
    });

    return {
      type: 'phrase',
      words: pairMatches[0],
      isRealWord: true
    };
  }

  // If no 2-word phrase matched, return any 2-repeat pattern (e.g. "2מ׳ אבטח")
  if (repeatedPatternMatches.length > 0) {
    return repeatedPatternMatches[0];
  }

  // 4. Three Words exact matches (for n >= 6)
  if (n >= 6) {
    for (let i = 0; i < candidates.length; i++) {
      const w1 = candidates[i];
      if (w1.length < 2 || w1.length > n - 4) continue;
      const rem1 = subtractWord(w1, targetCounts);

      for (let j = 0; j < candidates.length; j++) {
        const w2 = candidates[j];
        if (w2.length < 2 || w2.length > n - w1.length - 2) continue;
        if (!canFormWord(w2, rem1)) continue;
        const rem2 = subtractWord(w2, rem1);

        for (let k = 0; k < candidates.length; k++) {
          const w3 = candidates[k];
          if (w3.length !== n - w1.length - w2.length) continue;
          if (canFormWord(w3, rem2)) {
            return {
              type: 'phrase',
              words: [w1, w2, w3],
              isRealWord: true
            };
          }
        }
      }
    }
  }

  // 5. Fallback if no exact partition found:
  return {
    type: 'fallback',
    words: [origStr],
    isRealWord: false
  };
}

/**
 * Smart Acronym Analyzer:
 * Analyzes items and finds real Hebrew words or multi-word phrases (e.g. "מופקד רע", "שכ״ח").
 */
export function analyzeAcronym(items) {
  if (!Array.isArray(items) || items.length < 2) {
    return null;
  }

  // 1. Extract valid items and their initial letters
  const itemPairs = [];
  for (const it of items) {
    const text = typeof it === 'string' ? it.trim() : (it?.name || it?.title || '');
    if (!text) continue;
    const letter = extractInitialLetter(text);
    if (letter) {
      itemPairs.push({ letter, item: text });
    }
  }

  if (itemPairs.length < 2) {
    return null;
  }

  const n = itemPairs.length;
  const originalLetters = itemPairs.map(p => p.letter);
  const originalAcronym = formatAcronymString(originalLetters);

  // 2. Find best solution (single word, phrase, or fallback)
  const solution = findBestAcronymSolution(itemPairs);

  // 3. Map letters to items
  const pool = itemPairs.map((p, idx) => ({ ...p, originalIdx: idx, used: false }));
  const orderedItems = [];

  for (let wIdx = 0; wIdx < solution.words.length; wIdx++) {
    const word = solution.words[wIdx];
    for (let cIdx = 0; cIdx < word.length; cIdx++) {
      const ch = word[cIdx];
      const found = pool.find(p => !p.used && p.letter === ch);
      if (found) {
        found.used = true;
        orderedItems.push({
          letter: ch,
          item: found.item,
          wordIndex: wIdx,
          wordName: word,
          isWordStart: cIdx === 0,
          isWordEnd: cIdx === word.length - 1
        });
      }
    }
  }

  // Append any unused items (for fallback)
  for (const p of pool) {
    if (!p.used) {
      orderedItems.push({
        letter: p.letter,
        item: p.item,
        wordIndex: solution.words.length,
        wordName: '',
        isWordStart: false,
        isWordEnd: false
      });
    }
  }

  // 4. Construct Acronym Text & Explanation
  let bestAcronym = '';
  let matchedWord = '';

  if (solution.isRealWord) {
    if (solution.type === 'repeated_multiplier') {
      const k = solution.repCount;
      const ch = solution.repLetter;
      const wordPart = solution.wordPart; // e.g. "אבטח"
      const repAcr = formatAcronymString(ch.repeat(k).split('')); // e.g. "ממ״מ" or "מ״מ"
      const wordAcr = wordPart.includes(' ')
        ? wordPart.split(' ').map(w => formatAcronymString(w.split(''))).join(' ')
        : formatAcronymString(wordPart.split(''));

      bestAcronym = `${repAcr} ${wordAcr}`; // "ממ״מ אבט״ח"
      matchedWord = `${k}${ch}׳ ${wordPart}`; // "3מ׳ אבטח"
    } else if (solution.type === 'alliteration') {
      const k = solution.repCount;
      const ch = solution.repLetter;
      bestAcronym = formatAcronymString(ch.repeat(k).split(''));
      matchedWord = `${k} פריטים ב-${ch}׳`;
    } else {
      matchedWord = solution.words.join(' ');
      bestAcronym = solution.words.map(w => formatAcronymString(w.split(''))).join(' ');
    }
  } else {
    bestAcronym = formatAcronymString(originalLetters);
    matchedWord = null;
  }

  let meaningfulExplanation = '';
  if (solution.isRealWord) {
    if (solution.type === 'repeated_multiplier') {
      meaningfulExplanation = `זוהתה חוקיות זיכרון קליטה: "${solution.repCount}${solution.repLetter}׳ ${solution.wordPart}" (${bestAcronym}) — ${solution.repCount} מילים שמתחילות ב-${solution.repLetter}׳ יחד עם המילה "${solution.wordPart}"!`;
    } else if (solution.type === 'alliteration') {
      meaningfulExplanation = `חוקיות אליטרציה מושלמת: כל ${solution.repCount} הפריטים מתחילים באות ${solution.repLetter}׳ (${bestAcronym})!`;
    } else if (solution.words.length === 1) {
      if (solution.isChronological) {
        meaningfulExplanation = `נמצאה מילה עברית מושלמת: "${matchedWord}" (${bestAcronym}) ישירות לפי סדר הפריטים!`;
      } else if (solution.isReverse) {
        meaningfulExplanation = `נמצאה מילה עברית מושלמת: "${matchedWord}" (${bestAcronym}) בסידור הפוך שמחבר את הפריטים!`;
      } else {
        meaningfulExplanation = `נמצאה מילה עברית מושלמת: "${matchedWord}" (${bestAcronym}) באנגרמה טבעית!`;
      }
    } else {
      meaningfulExplanation = `זוהה ביטוי עברי מושלם: "${matchedWord}" (${bestAcronym}) המרכיב את כל ${n} הפריטים!`;
    }
  } else {
    meaningfulExplanation = `ראשי התיבות חוברו לפי אות ראשונה של כל פריט (${bestAcronym}).`;
  }

  return {
    originalAcronym,
    bestAcronym,
    matchedWord,
    isRealWord: solution.isRealWord,
    words: solution.words,
    isPhrase: solution.words.length > 1,
    meaningfulExplanation,
    orderedItems
  };
}
