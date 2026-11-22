/**
 * LifeQuest Mnemonic Synergy Pipeline Orchestrator
 * 
 * מתאם 5 עובדים מתמחים (Specialized Workers / Skills) בסינרגיה מלאה:
 * 
 * 1. מומחה האסוציאציות (Mnemonic Anchor Specialist):
 *    מפיק 5 עוגנים חיים, חושיים ופעילים עבור כל משימה (לעולם לא החפץ עצמו!).
 * 
 * 2. שומר המאגר המקומי (Local Pool Curator):
 *    בודק קודם כל במאגר המקומי ובמאגר המשתמש (Pool-First) לשליפה מיידית ב-0ms.
 * 
 * 3. ארכיטקט חיפוש התמונות (Visual Search Architect):
 *    מתרגם עוגנים חסרים לשאילתות צילום פוטוגרפיות באנגלית ומסנן רעשי רשת/פרסומות.
 * 
 * 4. הסופר הראשי (The Author):
 *    מחבר את 5 העוגנים שנבחרו למשפט מסע עלילתי שלם וקולח לארמון.
 * 
 * 5. מנהל המשוב והלמידה (Contextual Feedback Manager):
 *    משמר הצלחות (👍) כעוגני מאגר קבועים ופוסל חיבורים ספציפיים (👎) לפי הקשר בלבד.
 */

import { searchPopularWebImages } from './webImageSearch.js';
import { getGeminiApiKey } from './geminiLiveEngine.js';
import { ingestImagePermanently, auditImageWithGeminiVision } from './geminiVisionAuditor.js';
import { HEBREW_TO_COMMONS_QUERY_MAP } from './aiMnemonicCurator.js';
import {
  findUserImageByKeyword,
  findBestUserImagesForTask,
  approveAndSaveMnemonicImage,
  dislikeAndRemoveMnemonicImage,
  isAssociationDisliked,
  toCanonicalKey,
  getCuratedArchetypeTitles
} from './userImageRepository.js';
import { generateDynamicFallbackCard } from './deterministicStoryEngine.js';
import { authorWeaveStory, authorWeaveStoryWithGemini } from './theAuthorStoryEngine.js';
import { getHebrewSynonyms } from './hebrewSynonymThesaurus.js';
import { getSafeMorphologicalFamily, extractHebrewWordLemmas } from './hebrewLinguisticsEngine.js';

// ============================================================================
// עובד 1: מאגר אסוציאציות עוגנים מנמוניים (Mnemonic Anchor Specialist)
// ============================================================================
import { MNEMONIC_ANCHOR_CATALOG } from '../data/mnemonicAnchorReserveCatalog.js';
export { MNEMONIC_ANCHOR_CATALOG };

// ============================================================================
// חילוץ ענף המשימה הראשי (Semantic Information Pivot Parser)
// ============================================================================
export function extractTaskBranchKeyword(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';
  // הסרת תגיות מיקום/דחיפות כלליות בסוגריים כדי שלא יחטפו התאמות מאגר (למשל "להזמין שאטל (בית)" -> "שאטל" ולא "רדיאטור"!)
  let clean = rawText
    .replace(/\(\s*(?:בית|בבית|הביתה|עבודה|בעבודה|משרד|במשרד|דחוף|חשוב|מחר|היום)\s*\)/gi, ' ')
    .trim()
    .replace(/[.,!?:;"״׳]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const lowerRaw = clean.toLowerCase();

  // 0. ביטויי שמירה, הקפדה, דאגה, אחריות וניהול: הליבה הסמנטית היא מושא הפעולה (לא הפועל המשני!)
  // למשל: "שומר על הסדר" -> "סדר", "שומר על הבריאות" -> "בריאות", "דואג לילדים" -> "ילדים"
  const maintainMatch = clean.match(/^(?:לשמור|שומר|שומרת|שמירה|להקפיד|מקפיד|מקפידה|הקפדה|לדאוג|דואג|דואגת|אחראי|אחראית|שומרים|מקפידים|דואגים|עושה|לעשות)\s+(?:על\s+(?:ה|זה\s+ש)?|ל(?:ה|זה\s+ש)?|את\s+(?:ה)?|ב)?\s*(.+)$/i);
  if (maintainMatch && maintainMatch[1]) {
    clean = maintainMatch[1].trim();
  }

  // 1. מיפוי פעולות בית, סדר והיגיינה שבהן המהות היא פעולת הניקיון/סדר
  if (/(לנקות|ניקיון|ספונג'?ה?|לשטוף\s+רצפה|לקרצף)/.test(lowerRaw)) return 'ניקיון';
  if (/(?:^|\s)סדר(?:$|\s)|(?:לסדר|סדר\s+ב|סידור)/.test(lowerRaw) || /(?:^|\s)סדר(?:$|\s)/.test(clean)) return 'סדר';
  if (/(כביסה|לכבס|לתלות\s+כביסה|לקפל\s+כביסה)/.test(lowerRaw)) return 'כביסה';
  if (/(מדיח|לשטוף\s+כלים|להדיח\s+כלים)/.test(lowerRaw)) return 'כלים';

  // 2. תורים, בריאות ואנשי מקצוע מובהקים
  if (/(רופא\s+שיניים|שיננית|שיניים|רופא)/.test(lowerRaw)) {
    if (lowerRaw.includes('שיננית') || lowerRaw.includes('שיניים')) return 'שיניים';
    return 'רופא';
  }
  if (/(?:בדיקת\s+דם|בדיקות\s+דם|בדיקת\s+מעבדה)/.test(lowerRaw)) return 'בדיקת דם';
  if (/(?:חיסון|זריקה|להזריק)/.test(lowerRaw)) return 'חיסון';
  if (/(?:אקמול|תרופות?|כדורים?|טיפות\s+עיניים|בית\s+מרקחת|רוקח|סירופ)/.test(lowerRaw)) return 'תרופות';
  if (/(?:בדיקת\s+ראייה|אופטומטריסט|משקפיים|מספר\s+למשקפיים)/.test(lowerRaw)) return 'משקפיים';
  if (/(להסתפר|תספורת|מספרה|ספר)/.test(lowerRaw)) return 'תספורת';
  if (/(אינסטלטור|שרברב|סתימה|נזילה|ברז\s+דולף)/.test(lowerRaw)) return 'אינסטלטור';
  if (/(חשבון\s+חשמל|חשמלאי|קצר\s+בחשמל|חשמל)/.test(lowerRaw)) return 'חשמל';
  if (/(מוסך|טיפול\s+10000|טסט\s+לרכב)/.test(lowerRaw)) return 'מוסך';
  if (/(פנצ'?ר|אופניים)/.test(lowerRaw)) {
    if (lowerRaw.includes('אופניים')) return 'אופניים';
    return 'פנצ\'ר';
  }

  // 2.1. בירוקרטיה, כספים, משפטים ותשלומים
  if (/(?:דוח\s+חניה|דו"ח\s+חניה|קנס|מדחן)/.test(lowerRaw)) return 'דוח חניה';
  if (/(?:דרכון\s+ביומטרי|דרכון|משרד\s+הפנים)/.test(lowerRaw)) return 'דרכון';
  if (/(?:חוזה|שכירות|עורך\s+דין|נוטריון)/.test(lowerRaw)) return 'חוזה';
  if (/(?:צ'?ק|המחאה|פנקס\s+המחאות)/.test(lowerRaw)) return 'המחאה';
  if (/(?:ביטוח|ביטוח\s+מקיף|פוליסה)/.test(lowerRaw)) return 'ביטוח';
  if (/(?:חשבון\s+בנק|הפקדה\s+בבנק|בנק)/.test(lowerRaw)) return 'בנק';

  // 2.2. תחזוקת בית, בעלי חיים ומעבר
  if (/(?:קרטונים|חומרי\s+אריזה|מעבר\s+דירה|אריזה)/.test(lowerRaw)) return 'אריזה';
  if (/(?:אוכל\s+לכלב|שק\s+אוכל|אוכל\s+לחתול)/.test(lowerRaw)) return 'כלב';
  if (/(?:מדף|מדפים|לתלות\s+מדף)/.test(lowerRaw)) return 'מדף';
  if (/(?:סמרטוט|ספונג'?ה|לשטוף\s+רצפה)/.test(lowerRaw)) return 'ניקיון';

  // 2.3. זמן, שעונים ותזמון ("סימני הזמן", "לוח זמנים", "ניהול זמן")
  if (/(?:סימני\s+הזמן|לוח\s+זמנים|ניהול\s+זמן|קוצר\s+זמן|שעון|דדליין)/.test(lowerRaw) || /(?:^|\s)זמן(?:\s|$)/.test(lowerRaw)) {
    return 'זמן';
  }

  // 2.5. פעולות בין-אישיות מול אדם פרטי/חבר יחיד ("להיפגש עם שטדלר" -> "פגישה", "להתקשר לדני" -> "שיחה")
  // אך ורק כשמדובר בשם יחיד של אדם (לא מוסד בן 2+ מילים כמו "ביטוח לאומי" או "קופת חולים"!)
  if (/^(?:להיפגש|פגישה|לפגוש|נפגש|נפגשת|נפגשים)\s+(?:עם|את)\s+\S+$/.test(lowerRaw)) return 'פגישה';
  if (/^(?:להתקשר|לצלצל|לדבר|שיחה)\s+(?:ל|אל\s+|עם\s+)\S+$/.test(lowerRaw)) return 'שיחה';
  if (/^(?:לשלוח\s+הודעה|לסמס)\s+(?:ל|אל\s+)\S+$/.test(lowerRaw)) return 'הודעה';
  if (/^(?:להזכיר|תזכורת)\s+(?:ל|אל\s+)\S+$/.test(lowerRaw)) return 'תזכורת';
  if (/^(?:להזמין|לארח)\s+את\s+\S+$/.test(lowerRaw)) return 'אירוח';
  if (/(?:^|\s)(?:חופשה|חופשות)(?:\s|$)/.test(lowerRaw)) return 'חופשה';
  if (/(?:מילוי|תדלוק)\s+(?:סולר|דלק|בנזין)/.test(lowerRaw)) return 'סולר';

  // 2.6. תרבות, מופעים והופעות (למשל: "להזמין כרטיסים להופעה של עומר אדם" -> "הופעה")
  if (/(?:כרטיסים?\s+ל)?(?:הופעה|קונצרט|מופע|הצגה|פסטיבל)/i.test(lowerRaw)) {
    if (lowerRaw.includes('הצגה')) return 'הצגה';
    if (lowerRaw.includes('קונצרט')) return 'קונצרט';
    return 'הופעה';
  }

  // 2.7. מזגן ומיזוג אוויר
  if (/מזגן/.test(lowerRaw)) return 'מזגן';

  // 2.8. ימי הולדת ומתנות ("לקנות מתנה ליום הולדת של שירה" -> "מתנה")
  if (/(?:מתנה|יום\s+הולדת|יומולדת)/.test(lowerRaw)) {
    if (lowerRaw.includes('מתנה')) return 'מתנה';
    return 'יום הולדת';
  }

  // 2.9. שמיעה/האזנה למוזיקה/שיר/פודקאסט ("לשמוע את השיר של לוקאץ" -> "שיר")
  if (/(?:לשמוע|להאזין|להקשיב).*(?:שיר|מוזיקה|אלבום|פודקאסט)/.test(lowerRaw)) {
    if (lowerRaw.includes('פודקאסט')) return 'פודקאסט';
    if (lowerRaw.includes('שיר')) return 'שיר';
    return 'מוזיקה';
  }

  // 2.10. לימודים, ספרים וספרייה ("להחזיר 3 ספרים לספרייה העירונית" -> "ספרים")
  if (/(?:ספרייה|ספרים|ספר\s+קריאה)/.test(lowerRaw)) return 'ספרים';
  if (/שחמט/.test(lowerRaw)) return 'שחמט';
  if (/(?:פייתון|תכנות|קוד|python)/i.test(lowerRaw)) return 'פייתון';
  if (/(?:כלכלה|מיקרו\s+כלכלה|מאקרו\s+כלכלה)/.test(lowerRaw)) return 'כלכלה';
  if (/(?:סמינריון|מרצה|תזה|עבודה\s+אקדמית)/.test(lowerRaw)) return 'סמינריון';

  // 3. תנועה עם חבר ליעד ("ללכת עם תומר לבריכה" -> "בריכה", "לנסוע עם דני לים" -> "ים")
  const motionWithPersonToPlace = clean.match(/^(?:לצאת|לרדת|לטייל|להסתובב|ללכת|לנסוע|לבוא)\s+עם\s+\S+\s+(?:אל\s+ה?|ל)(.+)$/i);
  if (motionWithPersonToPlace && motionWithPersonToPlace[1]) {
    clean = motionWithPersonToPlace[1].trim();
  } else {
    // תנועה עם ישות/חפץ: "לצאת עם הכלב", "ללכת עם הילד"
    const motionMatch = clean.match(/^(?:לצאת|לרדת|לטייל|להסתובב|ללכת)\s+(?:עם|אל|ל)\s+(.+)$/i);
    if (motionMatch && motionMatch[1]) {
      clean = motionMatch[1];
    }
  }

  // 4. הסרת פועלי פעולה ישירים
  const actionPrefixes = [
    /^(?:לעשות|לבצע|לערוך|להחזיר|להביא|לקחת|לאסוף|לקנות|לרכוש|למסור|לתת|להעביר|להזמין|להוציא|להשתמש\s+ב|לתקן|לשטוף|לנקות|לסדר|להכין|לאכול|לבשל|לאפות|לשחק|לפגוש|לראות|לבדוק|לשלם|למלא|לשלוח|לכתוב|לפתוח|לסגור|להתחיל|לסיים|להתקשר\s+ל?)\s*(?:את\s+ה?|את\s+|ל[^\s]+\s+את\s+ה?|ל[^\s]+\s+את\s+|ל[^\s]+\s+|ה?)?/i,
    /^(?:ללכת|לנסוע|לטוס|לרוץ)\s+(?:ל|אל\s+ה?|אל\s+)?/i
  ];

  for (const rx of actionPrefixes) {
    if (rx.test(clean)) {
      clean = clean.replace(rx, '').trim();
      break;
    }
  }

  // 5. סילוק ביטויי זמן, ימים, תארים ומיקומים כלליים
  clean = clean
    .replace(/\s+(?:ברביעי|בחמישי|בשני|בשלישי|בראשון|בשישי|בשבת|מחר|היום|אתמול|השבוע)\b/gi, '')
    .replace(/\s+(?:ב10|ב-10|ב9|ב-9|ב8|ב-8|בצהריים|בבוקר|בערב|בלילה|בשעה\s+\d+)\b/gi, '')
    .replace(/\s+(?:חדשות|חדש|חדשים|חדשה|טרי|טריים|יפה|טוב)\b/gi, '')
    .replace(/\s+(?:לבסיס|הביתה|לעבודה|למשרד|לגן|לבית\s*ספר|לחדר|לסלון|למטבח|בחוץ|ברחוב|למטה|דחוף)\b/gi, '')
    .trim();

  // 6. סילוק ביטויי כמות פותחים (זוג גרביים ➔ גרביים, שלושה כדורים ➔ כדורים)
  clean = clean.replace(/^(?:זוג|שתי|שני|שלוש|שלושה|ארבע|ארבעה|חמש|חמישה|שש|שישה|שבע|שבעה|שמונה|תשע|תשעה|עשר|עשרה|קילו|חבילת|שקית)\s+/i, '').trim();

  // שמירה מלאה על שלמות המילה והביטוי — איסור מוחלט על גזירת אותיות (הילה ➔ הילה, משקולת יד ➔ משקולת יד)
  return clean;
}

// ============================================================================
// עובד 1: מנוע AI חי בזמן אמת (Gemini Live Dynamic Associations)
// ============================================================================
function isStrongRootMatch(targetName = '', repoItem = null) {
  if (!targetName || !repoItem) return false;
  const rawTarget = String(targetName).trim();
  const rawRepo = String(repoItem.title || repoItem.name || '').trim();
  const tNorm = toCanonicalKey(rawTarget);
  const rNorm = toCanonicalKey(rawRepo);
  if (!tNorm || !rNorm) return false;
  if (tNorm === rNorm) return true;
  // מניעת חטיפה של ביטוי דו-מילתי ע"י מילה בודדת לא קשורה (למשל "כפתור הפעלה" לא יוחלף ב"כפתור" של חולצה!)
  const targetHasSpaces = rawTarget.includes(' ');
  const repoHasSpaces = rawRepo.includes(' ');
  if (targetHasSpaces && !repoHasSpaces) return false;
  if (tNorm.length >= 4 && rNorm.length >= 4) {
    if (rNorm.includes(tNorm) && Math.abs(rNorm.length - tNorm.length) <= 4) return true;
  }
  return false;
}

export async function fetchGeminiLiveAssociations(taskText = '', neededCount = 5, existingAnchors = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10) return null;
  const count = Math.max(1, Math.min(5, Number(neededCount) || 5));
  const existingList = Array.isArray(existingAnchors) ? existingAnchors.filter(Boolean) : [];
  const existingClause = existingList.length > 0
    ? `עוגנים שכבר קיימים במאגר עבור משימה זו (איסור לחזור עליהם!): ${existingList.join(', ')}.`
    : '';

  const cleanTask = String(taskText || '').trim();
  const branchKeyword = extractTaskBranchKeyword(cleanTask);
  const coreClarification = branchKeyword && branchKeyword !== cleanTask
    ? ` (מושא הליבה של המשפט הוא: "${branchKeyword}", אל תתמקד בפעלים משניים כמו שומר/דואג/מקפיד!)`
    : '';

  const prompt = `אתה סוכן מס' 1: מומחה עוגני זיכרון ו"דילוג אסוציאטיבי" (LifeQuest Mnemonic Anchor Specialist).
משימת/מילת המשתמש לשינון: "${cleanTask}"${coreClarification}.
${existingClause}

שלושת חוקי הברזל הקוגניטיביים של LifeQuest להצמדת עוגנים:
1. **התאמה ישירה לפי ענף/שורש במאגר:** העדף עוגנים מובהקים, דמויות מוכרות ומאפיינים קונקרטיים הנמצאים בעולם המוחשי.
2. **מהות משותפת ישירה (חוק הגשר והחיבור):**
   - חובה שיהיה משהו משותף ישיר ומובהק בין המילה לעוגן!
   - ✔️ דוגמת מופת: עבור "לחדש קשר עם חברים" ➔ עוגן "גשר" (כי שניהם עוסקים בחיבור!).
   - ✔️ עבור "בלאגן" ➔ "מטאטא" או "שואב אבק" (כי שניהם עוסקים בהשלטת סדר).
   - ✔️ עבור "אימון קשה" ➔ "משקולת ברזל" (כי שניהם עוסקים במאמץ פיזי וכוח).
   - ✔️ עבור "משאית" ➔ "אופטימוס פריים" (רובוט שהופך למשאית), "מכולה" (מטען ענק), "ארגזי קרטון" (הובלה).
   - ❌ **איסור מוחלט על שרשורים סביבתיים מקריים ומאולצים** (כגון מתג תאורה לבלגן, או רמזור למשאית!). אם אין מהות משותפת ישירה — אל תציע את העוגן!
3. **הצגת האובייקט עצמו במילה (Literal):** עדיפות אחרונה בלבד (כשאין עוגן אסוציאטיבי מתאים בעל מהות משותפת).

כללי עוגן חזותי נוספים:
4. **אובייקט חזותי יחיד, מוחשי וצילומי (Single Vivid Focal Subject — אפס מושגים מופשטים!):**
   - כל עוגן חייב להיות דמות מוכרת, חיה, בעל מקצוע או עצם פיזי ברור שקל לצלם בפריים אחד חד ונקי.
   - **אסור לבחור מוסדות מופשטים** שקשה לצלם (כמו "מס הכנסה", "הממשלה", "בירוקרטיה").
   - **שמות פרטיים של אנשים (עקרון הבטוח והאוניברסלי):**
     * אם במשימה מופיע שם אישי (כמו "להיפגש עם שטדלר", "לדבר עם יוסי") — **התעלם מהשם האישי** והתמקד בליבה האוניברסלית ("פגישה", "שיחה"). לעולם אל תנחש טריוויה על שמות פרטיים!
5. **חוק האסוציאציה החד/דו-מילתית (Strict 1-2 Words Rule):**
   - כל שם עוגן (anchorName) חייב להכיל **מילה אחת או שתיים בלבד בעברית**!
6. **שאילתת צילום חדה באנגלית (englishQuery — 2 עד 4 מילים):**
   תאר את העוגן באנגלית פוטוגרפית מדויקת.
7. **הסבר המהות המשותפת (explanation — 2 עד 5 מילים):**
   התשובה הקצרצרה שמחברת את העוגן למילה ברגע (למשל: "מחבר בין שני צדדים", "מטאטא ועושה סדר", "רובוט שהופך למשאית").

החזר אך ורק אובייקט JSON תקין (ללא markdown וללא טקסט עודף):
{
  "reasoning": "משפט קצר (8-12 מילים): מה הליבה האוניברסלית של המשימה (תוך התעלמות משמות אישיים) ולמה העוגנים יוצרים רגע אה!",
  "coreConcept": "שם המושג המרכזי במילה אחת",
  "associations": [
    {
      "anchorName": "מילה אחת או שתיים בלבד בעברית",
      "englishQuery": "2 to 4 concrete english words",
      "emoji": "אימוג'י יחיד",
      "explanation": "הסבר קצרצר ב-2 עד 5 מילים"
    }
  ]
}
חובה לייצר בדיוק ${count} אסוציאציות שונות עם דילוג אסוציאטיבי חד.`;

  const models = ['gemini-flash-lite-latest', 'gemini-3-flash-preview', 'gemini-flash-latest'];
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(35000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanJson);
            if (Array.isArray(parsed.associations) && parsed.associations.length > 0) {
              return parsed;
            }
          }
        } else if (res.status === 429 || res.status === 503) {
          await new Promise(r => setTimeout(r, 2000));
          continue;
        }
        break;
      } catch (_) {
        break;
      }
    }
  }
  return null;
}

export async function fetchGeminiLiveAssociationsBatch(taskSpecs = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10 || !Array.isArray(taskSpecs) || taskSpecs.length === 0) return {};

  const itemsBlock = taskSpecs.map((spec, idx) => {
    const existing = Array.isArray(spec.existingAnchors) && spec.existingAnchors.length > 0
      ? ` | קיים כבר (אל תחזור): ${spec.existingAnchors.join(', ')}`
      : '';
    return `${idx + 1}. id="${spec.id}" | משימה: "${spec.taskText}" | ליבה: "${spec.branchKeyword}" | כמות נדרשת: ${spec.neededCount}${existing}`;
  }).join('\n');

  const prompt = `אתה סוכן מס' 1: מומחה עוגני זיכרון ו"דילוג אסוציאטיבי" (LifeQuest Mnemonic Anchor Specialist).
עליך להפיק עוגנים חזותיים חדים עבור רשימת המשימות הבאה בקריאה אחת:
${itemsBlock}

חוקי ברזל לכל משימה:
1. **התאמה ישירה לפי ענף/שורש במאגר:** העדף עוגנים מובהקים, דמויות מוכרות ומאפיינים קונקרטיים.
2. **מהות משותפת ישירה (חוק הגשר והחיבור):**
   - חובה שיהיה משהו משותף ישיר ומובהק בין המשימה לעוגן!
   - דוגמה מנחה: עבור "לחדש קשר עם חברים" ➔ "גשר" (שניהם עוסקים בחיבור!).
   - עבור "בלאגן" ➔ "מטאטא" או "שואב אבק" (שניהם עוסקים בהשלטת סדר).
   - **איסור מוחלט על שרשורים סביבתיים מקריים ומאולצים** (כמו מתג תאורה לבלגן!).
3. **הצגת האובייקט עצמו במילה:** עדיפות אחרונה בלבד (כשאין עוגן בעל מהות משותפת).
4. **שמות אישיים:** התעלם משמות פרטיים/משפחה והתמקד בנושא האוניברסלי.
5. **אובייקט חזותי יחיד וצילומי:** anchorName ב-1 עד 2 מילים בעברית, englishQuery ב-2 עד 4 מילים צילומיות באנגלית, emoji יחיד, explanation ב-2 עד 5 מילים (הסבר המהות המשותפת).

החזר אך ורק JSON תקין במבנה מערך שבו מופיע **כל id מהרשימה ללא יוצא מן הכלל**:
{
  "items": [
    {
      "id": "<id>",
      "reasoning": "משפט קצר (8-12 מילים): מה הליבה האוניברסלית ולמה נבחרו העוגנים",
      "coreConcept": "מילת הליבה",
      "associations": [
        { "anchorName": "...", "englishQuery": "...", "emoji": "...", "explanation": "..." }
      ]
    }
  ]
}`;

  const models = ['gemini-flash-lite-latest', 'gemini-3-flash-preview', 'gemini-flash-latest'];
  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              responseMimeType: 'application/json'
            }
          }),
          signal: AbortSignal.timeout(45000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
            const map = {};
            if (Array.isArray(parsed?.items)) {
              parsed.items.forEach((entry, i) => {
                const key = entry?.id || taskSpecs[i]?.id;
                if (key && Array.isArray(entry?.associations) && entry.associations.length > 0) {
                  map[key] = entry;
                }
              });
            } else if (parsed?.results && typeof parsed.results === 'object') {
              Object.assign(map, parsed.results);
            }
            if (Object.keys(map).length > 0) {
              return map;
            }
          }
        } else if (res.status === 429 || res.status === 503) {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        break;
      } catch (_) {
        break;
      }
    }
  }
  return {};
}

// זיכרון מטמון קצר טווח לפירוק מילים כדי לא לפנות לאותה משימה פעמיים
const LEMMA_BATCH_CACHE = new Map();

/**
 * פירוק לשוני חכם ומדויק של כל רשימת המשימות בקריאת Batch קלה אחת ויחידה ל-Gemini.
 * חוסך עשרות קריאות כבדות על ידי חילוץ שמות עצם, שורשים ולמות תקניות בעברית (ללא חיתוך אותיות עיוור!).
 */
export async function batchLemmatizeTasksWithGemini(taskTexts = []) {
  if (!Array.isArray(taskTexts) || taskTexts.length === 0) return {};

  const cleanList = taskTexts.map(t => String(t || '').trim()).filter(Boolean);
  if (cleanList.length === 0) return {};

  const resultMap = {};
  const tasksToQuery = [];

  cleanList.forEach((text, i) => {
    if (LEMMA_BATCH_CACHE.has(text)) {
      resultMap[i] = LEMMA_BATCH_CACHE.get(text);
    } else {
      tasksToQuery.push({ index: i, text });
    }
  });

  if (tasksToQuery.length === 0) {
    return resultMap;
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10) {
    // ללא מפתח API - גיבוי דטרמיניסטי במילים שלמות
    tasksToQuery.forEach(({ index, text }) => {
      const fallback = extractHebrewWordLemmas(text);
      resultMap[index] = fallback;
      LEMMA_BATCH_CACHE.set(text, fallback);
    });
    return resultMap;
  }

  const taskListBlock = tasksToQuery.map(({ index, text }) => `משימה #${index}: "${text}"`).join('\n');

  const prompt = `אתה בלשן עברי ומומחה עוגני זיכרון מוחשיים.
עבור כל משימה ברשימה, חלץ 2 עד 4 שמות עצם, שורשי מילים קונקרטיים ועוגנים חזותיים מוחשיים בעברית בלבד.

כללים מחמירים:
1. ללא מילות יחס, אותיות קישור או יידוע (אל תכלול אותיות יחס ב-, ל-, מ-, כ-, ו-, את, של, עם).
2. חלץ אך ורק מילים שלמות, אמיתיות ותקניות כפי שהן מופיעות במילון עברי (איסור מוחלט על חיתוך אותיות עיוור!).
3. עבור מושגים מופשטים או רגשות (כמו המצב של היום, עייפות אישית, לחץ): ספק עוגנים פיזיים מוחשיים שמייצגים אותם בבירור (כגון: עיתון, יומן, כוס קפה, כרית, שעון מעורר).
   - דוגמה: "סימני הזמן" -> ["שעון חול", "שעון כיס", "זמן", "שעון"]
   - דוגמה: "המצב של היום" -> ["עיתון", "חדשות", "שעון", "יומן"]
   - דוגמה: "עייפות אישית" -> ["כוס קפה", "כרית", "מיטה", "שעון"]
   - דוגמה: "קניית תרופות בסופר-פארם" -> ["תרופה", "סופר פארם", "מרקחת", "כדורים"]
   - דוגמה: "להחזיר 3 ספרים לספרייה" -> ["ספר", "ספרייה", "קריאה"]
   - דוגמה: "לשלם דוח חניה בעירייה" -> ["דוח", "חניה", "עירייה", "מדחן"]

רשימת המשימות:
${taskListBlock}

החזר אך ורק אובייקט JSON תקין (ללא שום טקסט נוסף):
{
  "results": {
    "0": ["מילה1", "מילה2", "מילה3"],
    "1": ["מילה1", "מילה2"]
  }
}`;

  const models = ['gemini-flash-lite-latest', 'gemini-3-flash-preview', 'gemini-flash-latest'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(8000)
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          const parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
          const lemmasResult = parsed.results || parsed;
          tasksToQuery.forEach(({ index, text }) => {
            const arr = Array.isArray(lemmasResult[index]) || Array.isArray(lemmasResult[String(index)])
              ? (lemmasResult[index] || lemmasResult[String(index)])
              : [];
            const cleanArr = arr.map(w => String(w || '').trim()).filter(w => w.length >= 2);
            if (cleanArr.length > 0) {
              resultMap[index] = cleanArr;
              LEMMA_BATCH_CACHE.set(text, cleanArr);
            } else {
              const fallback = extractHebrewWordLemmas(text);
              resultMap[index] = fallback;
              LEMMA_BATCH_CACHE.set(text, fallback);
            }
          });
          return resultMap;
        }
      }
      continue;
    } catch (_) {
      continue;
    }
  }

  // גיבוי דטרמיניסטי במקרה של שגיאת רשת
  tasksToQuery.forEach(({ index, text }) => {
    if (!resultMap[index]) {
      const fallback = extractHebrewWordLemmas(text);
      resultMap[index] = fallback;
      LEMMA_BATCH_CACHE.set(text, fallback);
    }
  });

  return resultMap;
}

const MAX_CANDIDATES_PER_STATION = 3;

// ============================================================================
// עובד 1: מומחה עוגנים וסריקת ענפים (Agent 1: Branch Search)
// ============================================================================
export async function agent1ExtractBranchesAndSearch(taskText = '', options = {}) {
  const cleanTask = String(taskText || '').trim();
  const maxCandidates = options.maxCandidates || MAX_CANDIDATES_PER_STATION;
  let branchKeyword = extractTaskBranchKeyword(cleanTask);
  let branchLower = branchKeyword.toLowerCase();

  const branchTokens = new Set(branchLower.split(/[\s,.;:!?\-–—]+/).filter(Boolean));
  const STOP_WORDS = new Set(['עם', 'על', 'של', 'את', 'אל', 'זה', 'כל', 'רק', 'בתוך', 'ליד', 'בין', 'מחר', 'היום', 'אתמול', 'בבוקר', 'בערב', 'ללכת', 'לקחת', 'לקנות', 'לאכול', 'לנסוע', 'לבוא', 'לטייל', 'לרדת', 'לצאת']);
  for (const sw of STOP_WORDS) {
    branchTokens.delete(sw);
  }

  // 1. חיפוש ראשוני ומיידי ב"המאגר שלי" (433 תמונות מאומתות) לפני פנייה ל-Gemini!
  const branchCandidates = [];
  const seenUrls = new Set();

  // סוכן 1 סורק את המאגר לפי ענפים מדויקים בלבד (minScore: 220 מונע זליגת מילים נרדפות חלשות כמו משאית -> רמזור!)
  const userMatchesBranch = findBestUserImagesForTask(branchKeyword, maxCandidates, { mode: 'branches', minScore: 220 });
  const userMatchesFull = branchKeyword !== cleanTask ? findBestUserImagesForTask(cleanTask, maxCandidates, { mode: 'branches', minScore: 220 }) : [];
  const allUserMatches = [...userMatchesBranch, ...userMatchesFull];

  for (const userMatch of allUserMatches) {
    if (branchCandidates.length >= maxCandidates) break;
    if (userMatch && userMatch.imageUrl && !userMatch.imageUrl.startsWith('data:image/svg') && !seenUrls.has(userMatch.imageUrl)) {
      if (!isAssociationDisliked(cleanTask, userMatch.imageUrl)) {
        seenUrls.add(userMatch.imageUrl);
        branchCandidates.push({
          anchorName: userMatch.title || branchKeyword,
          imageUrl: userMatch.imageUrl,
          emoji: userMatch.emoji || '⭐',
          explanation: userMatch.explanation || '', // הסבר דטרמיניסטי שמור מהמאגר או ריק אם לא הוגדר
          fromPool: true,
          source: 'user_approved'
        });
      }
    }
  }

  // 1.5. מדיניות חסכנית מורפולוגית: בחינת צירופי מילים ככל מילה לגופה/לשורשה התקני (Frugal Lemma Scan)
  // לפני פנייה ל-Gemini, מחלצים את הלמות והשורשים התקניים (בין אם מ-Gemini Batch ובין אם ממילון דטרמיניסטי ללא חיתוך אותיות)
  if (branchCandidates.length < maxCandidates) {
    const wordLemmas = Array.isArray(options.lemmas) && options.lemmas.length > 0
      ? options.lemmas
      : extractHebrewWordLemmas(cleanTask);
    const OVERLY_BROAD_WORDS = new Set(['חדר', 'בית', 'מקום', 'זמן', 'דבר', 'עולם', 'חיים', 'יום', 'איש', 'אנשים', 'משהו', 'עבודה']);
    for (const lemma of wordLemmas) {
      if (branchCandidates.length >= maxCandidates) break;
      if (!lemma || lemma.length < 2 || lemma === branchKeyword || OVERLY_BROAD_WORDS.has(lemma)) continue;
      const lemmaMatches = findBestUserImagesForTask(lemma, maxCandidates, { mode: 'branches', minScore: 220 });
      for (const m of lemmaMatches) {
        if (branchCandidates.length >= maxCandidates) break;
        if (m && m.imageUrl && !m.imageUrl.startsWith('data:image/svg') && !seenUrls.has(m.imageUrl)) {
          if (!isAssociationDisliked(cleanTask, m.imageUrl)) {
            seenUrls.add(m.imageUrl);
            branchCandidates.push({
              anchorName: m.title || lemma,
              imageUrl: m.imageUrl,
              emoji: m.emoji || '⭐',
              explanation: '',
              fromPool: true,
              source: 'frugal_root_lemma'
            });
          }
        }
      }
    }
  }

  // 2. בדיקת הקטלוג המנוהל לפי ענפים
  let reserveAssociations = [];
  const catalogEntry = MNEMONIC_ANCHOR_CATALOG[branchKeyword] ||
    Object.values(MNEMONIC_ANCHOR_CATALOG).find(c => c.synonyms.some(s => {
      const sLower = s.toLowerCase();
      return sLower === branchLower || branchTokens.has(sLower);
    }));

  if (catalogEntry && Array.isArray(catalogEntry.associations)) {
    for (const assoc of catalogEntry.associations) {
      if (branchCandidates.length >= 5) break;
      if (assoc.imageUrl && !seenUrls.has(assoc.imageUrl)) {
        if (!isAssociationDisliked(cleanTask, assoc.imageUrl)) {
          seenUrls.add(assoc.imageUrl);
          branchCandidates.push({
            anchorName: assoc.anchorName,
            imageUrl: assoc.imageUrl,
            emoji: assoc.emoji || '⭐',
            explanation: assoc.explanation || '',
            fromPool: true,
            source: 'catalog_branch'
          });
        }
      }
    }
  }

  // 2.5. הרחבה דטרמיניסטית בטוחה: שורש מורפולוגי ומילים נרדפות קונקרטיות (ללא גלישה מטאפורית!)
  // מחבר פעלים לשמות פעולה (לרעוד ➔ רעידה) ושומר על הומוגניות סמנטית קפדנית
  if (branchCandidates.length < 5) {
    const morphFamily = getSafeMorphologicalFamily(branchKeyword);
    const synonyms = getHebrewSynonyms(branchKeyword);
    const safeExpansions = Array.from(new Set([...morphFamily, ...synonyms])).filter(w => w !== branchKeyword);

    for (const syn of safeExpansions) {
      if (branchCandidates.length >= 5) break;
      const synMatches = findBestUserImagesForTask(syn, 3, { mode: 'branches', minScore: 240 });
      for (const m of synMatches) {
        if (branchCandidates.length >= 5) break;
        if (m && m.imageUrl && !m.imageUrl.startsWith('data:image/svg') && !seenUrls.has(m.imageUrl)) {
          if (!isAssociationDisliked(cleanTask, m.imageUrl)) {
            seenUrls.add(m.imageUrl);
            branchCandidates.push({
              anchorName: m.title || syn,
              imageUrl: m.imageUrl,
              emoji: m.emoji || '⭐',
              explanation: '', // עוגן דטרמיניסטי טהור מהמאגר - 0 רעש
              fromPool: true,
              source: 'thesaurus_synonym'
            });
          }
        }
      }
    }
  }

  // 3. קישוריות בין סוכנים: בדיקת כמות הפריטים שנמצאו כענפים במאגר (יעד: 3 תמונות חדות לכל מסגרת)
  const neededCount = Math.max(0, maxCandidates - branchCandidates.length);
  let aiReasoning = '';

  if (neededCount > 0 && !options.skipGemini) {
    const existingAnchorNames = branchCandidates.map(c => c.anchorName);
    try {
      const geminiResult = options.precomputedGeminiResult || await fetchGeminiLiveAssociations(branchKeyword, neededCount, existingAnchorNames);
      if (geminiResult && geminiResult.reasoning) {
        aiReasoning = String(geminiResult.reasoning).trim();
      }
      if (geminiResult && Array.isArray(geminiResult.associations) && geminiResult.associations.length > 0) {
        // סינון אסוציאציות: הגבלה ל-1-2 מילים + פסילת המילה הגולמית עצמה (תתי-סוגים מובהקים מותרים!)
        const branchCanon = toCanonicalKey(branchKeyword);
        for (const assoc of geminiResult.associations) {
          if (!assoc || !assoc.anchorName) continue;
          const cleanAnchor = String(assoc.anchorName).trim().split(/\s+/).slice(0, 2).join(' ');
          const anchorCanon = toCanonicalKey(cleanAnchor);
          if (branchCanon && branchCanon.length >= 3 && anchorCanon === branchCanon) {
            continue; // פוסלים רק שכפול זהה של המילה הגולמית עצמה
          }
          assoc.anchorName = cleanAnchor;
          reserveAssociations.push(assoc);
        }

        // בדיקה מיידית אם סוכן 1 קלע לשורש שכבר שמור במאגר המקומי
        for (let i = reserveAssociations.length - 1; i >= 0; i--) {
          if (branchCandidates.length >= maxCandidates) break;
          const candidateAssoc = reserveAssociations[i];
          const repoHits = findBestUserImagesForTask(candidateAssoc.anchorName, 1, { mode: 'roots' });
          const hit = repoHits[0];
          // התאמת שורש אמיתית ומדויקת בלבד — איסור מוחלט על שידוך תמונה של מושג אחר!
          if (hit && hit.imageUrl && isStrongRootMatch(candidateAssoc.anchorName, hit) && !seenUrls.has(hit.imageUrl) && !isAssociationDisliked(cleanTask, hit.imageUrl)) {
            seenUrls.add(hit.imageUrl);
            branchCandidates.push({
              anchorName: hit.title || candidateAssoc.anchorName,
              imageUrl: hit.imageUrl,
              emoji: candidateAssoc.emoji || hit.emoji || '⭐',
              explanation: candidateAssoc.explanation || '',
              fromPool: true,
              source: 'in_palace_ai_match'
            });
            reserveAssociations.splice(i, 1);
          }
        }
      }
    } catch (_) { }

    // גיבוי דטרמיניסטי קצר וממוקד (חד/דו-מילתי בלבד) במידה שאין מפתח או שיש חסימת רשת
    if (reserveAssociations.length === 0 && branchCandidates.length < 5) {
      const mappedEn = HEBREW_TO_COMMONS_QUERY_MAP[branchKeyword]?.primary || `${branchKeyword} object`;
      reserveAssociations.push({
        anchorName: branchKeyword,
        searchQuery: branchKeyword,
        englishQuery: mappedEn,
        emoji: '💡',
        explanation: ''
      });
    }
  }

  return {
    branchKeyword,
    aiReasoning,
    reserveAssociations,
    branchCandidates,
    isComplete: branchCandidates.length >= maxCandidates
  };
}

// ============================================================================
// עובד 2: חיפוש שורש והשלמת רשת (Agent 2: Root Search & Web Completion)
// ============================================================================
export async function agent2SearchRootAndCompleteFromWeb(agent1Result, rawTaskText = '', maxCandidates = MAX_CANDIDATES_PER_STATION, options = {}) {
  const cleanTask = String(rawTaskText || '').trim();
  const candidates = [...(agent1Result.branchCandidates || [])];
  const seenUrls = new Set(candidates.map(c => c.imageUrl).filter(Boolean));

  // אם סוכן 1 כבר מצא 3 תמונות שורש מאומתות מתוך המאגר המקומי — מחזירים מיד באפס השהיה וללא רשת!
  if (candidates.length >= maxCandidates) {
    return candidates.slice(0, maxCandidates);
  }

  // רשימת האסוציאציות שסוכן 1 המציא עבור הפריטים החסרים
  const pendingAssociations = [...(agent1Result.reserveAssociations || [])];

  // שלב א': סוכן 2 סורק את המאגר המקומי לפי שורשים (mode: 'roots') עבור כל אסוציאציה חדשה של סוכן 1
  for (let i = pendingAssociations.length - 1; i >= 0; i--) {
    if (candidates.length >= maxCandidates) break;
    const assoc = pendingAssociations[i];

    const repoMatches = findBestUserImagesForTask(assoc.anchorName || '', 1, { mode: 'roots' });
    const repoHit = repoMatches[0];
    // התאמת שורש מדויקת בלבד במאגר — אם אין התאמה אמיתית, משאירים להורדה מהרשת
    if (repoHit && repoHit.imageUrl && isStrongRootMatch(assoc.anchorName, repoHit) && !seenUrls.has(repoHit.imageUrl) && !isAssociationDisliked(cleanTask, repoHit.imageUrl)) {
      seenUrls.add(repoHit.imageUrl);
      candidates.push({
        anchorName: repoHit.title || assoc.anchorName,
        imageUrl: repoHit.imageUrl,
        emoji: assoc.emoji || '⭐',
        explanation: assoc.explanation || '',
        fromPool: true,
        source: 'in_palace_ai_match'
      });
      pendingAssociations.splice(i, 1);
      continue;
    }

    if (assoc.imageUrl && !seenUrls.has(assoc.imageUrl) && !isAssociationDisliked(cleanTask, assoc.imageUrl)) {
      seenUrls.add(assoc.imageUrl);
      candidates.push({
        anchorName: assoc.anchorName,
        imageUrl: assoc.imageUrl,
        emoji: assoc.emoji || '💡',
        explanation: assoc.explanation || '',
        fromPool: true,
        source: 'root_catalog'
      });
      pendingAssociations.splice(i, 1);
    }
  }

  // אם הוגדר skipWeb (למשל ב-Pass 1 המהיר): לא פונים לרשת לעולם ולא מחכים!
  if (options.skipWeb) {
    if (candidates.length === 0) {
      const broadMatches = findBestUserImagesForTask(cleanTask, 1, { minScore: 50 });
      const best = broadMatches[0];
      if (best && best.imageUrl && !best.imageUrl.startsWith('data:image/svg')) {
        candidates.push({
          anchorName: best.title || cleanTask,
          imageUrl: best.imageUrl,
          emoji: best.emoji || '⭐',
          explanation: '',
          fromPool: true,
          source: 'thematic_pool_fallback'
        });
      }
    }
    return candidates.slice(0, maxCandidates);
  }

  // שלב ב': סוכן 2 משלים מהרשת אך ורק את הפריטים שעדיין חסרים להשלמת 3 (Multi-Candidate Web Completion + Gemini Vision)
  const visionAuditLog = [];
  while (candidates.length < maxCandidates && pendingAssociations.length > 0) {
    const missingAssoc = pendingAssociations.shift();
    if (!missingAssoc) break;

    const webUrls = await searchPhotographicCandidates(
      missingAssoc.anchorName,
      missingAssoc.englishQuery,
      cleanTask,
      4
    );

    if (webUrls.length === 0) {
      visionAuditLog.push({
        anchorName: missingAssoc.anchorName,
        englishQuery: missingAssoc.englishQuery || '',
        status: 'no_web_results'
      });
      continue;
    }

    // עוברים על עד 4 מועמדי צילום ברשת עד שאחד עובר בהצלחה את ביקורת הראייה של Gemini Vision
    for (const webImg of webUrls) {
      if (!webImg || seenUrls.has(webImg) || isAssociationDisliked(cleanTask, webImg)) continue;

      let finalImageUrl = webImg;
      let isApprovedByVision = true;

      if (webImg.startsWith('http') && !webImg.includes('/staged_images/pool/')) {
        try {
          const ingestRes = await ingestImagePermanently({
            imageUrl: webImg,
            anchorName: missingAssoc.anchorName,
            coreConcept: cleanTask,
            explanation: missingAssoc.explanation || '',
            emoji: missingAssoc.emoji || '🌐'
          });

          if (ingestRes) {
            if (ingestRes.rejected) {
              console.info(`Vision rejected candidate for ${missingAssoc.anchorName}:`, ingestRes.audit?.reason);
              visionAuditLog.push({
                anchorName: missingAssoc.anchorName,
                status: 'rejected',
                score: ingestRes.audit?.score ?? 0,
                reason: ingestRes.audit?.reason || ''
              });
              isApprovedByVision = false;
            } else if (ingestRes.ok && ingestRes.localImageUrl) {
              visionAuditLog.push({
                anchorName: missingAssoc.anchorName,
                status: 'approved',
                score: ingestRes.audit?.score ?? 0,
                reason: ingestRes.audit?.reason || ''
              });
              finalImageUrl = ingestRes.localImageUrl;
            }
          }
        } catch (err) {
          console.warn('Ingestion attempt failed, trying next candidate:', err);
        }
      }

      if (isApprovedByVision && !seenUrls.has(finalImageUrl)) {
        seenUrls.add(finalImageUrl);
        candidates.push({
          anchorName: missingAssoc.anchorName,
          imageUrl: finalImageUrl,
          emoji: missingAssoc.emoji || '🌐',
          explanation: missingAssoc.explanation || '',
          englishQuery: missingAssoc.englishQuery || '',
          fromPool: finalImageUrl.includes('/staged_images/pool/'),
          source: finalImageUrl.includes('/staged_images/pool/') ? 'ingested_permanent' : 'web_search'
        });
        break; // מצאנו תמונה מאומתת ואיכותית לעוגן זה — עוברים לעוגן הבא
      }
    }
  }

  // שמירת לוג Vision על התוצאה לצורכי ביקורת הסשן בלבד (מוסתר מהלקוח)
  if (agent1Result && typeof agent1Result === 'object') {
    agent1Result.visionAuditLog = visionAuditLog;
  }

  // מקרה קצה בלבד: אם לא נמצאו מועמדים כלל, מפיקים כרטיס ברירת מחדל נקי אחד
  if (candidates.length === 0) {
    const fallbackCard = generateDynamicFallbackCard(cleanTask);
    candidates.push({
      anchorName: cleanTask,
      imageUrl: fallbackCard,
      emoji: '📌',
      explanation: '',
      fromPool: false,
      source: 'fallback_card'
    });
  }

  return candidates.slice(0, maxCandidates);
}

// ============================================================================
// עובד 3: ארכיטקט חיפוש תמונות פוטוגרפיות (Visual Search Architect)
// ============================================================================
export async function searchPhotographicCandidates(anchorName = '', englishQuery = '', rawTaskText = '', limit = 4) {
  const cleanAnchor = String(anchorName || '').trim();
  const cleanTask = String(rawTaskText || '').trim();
  let resolvedEn = String(englishQuery || '').trim();

  if (!resolvedEn || /[\u0590-\u05FF]/.test(resolvedEn)) {
    const fromMap = HEBREW_TO_COMMONS_QUERY_MAP[cleanAnchor]?.primary || HEBREW_TO_COMMONS_QUERY_MAP[cleanTask]?.primary;
    if (fromMap) resolvedEn = fromMap;
  }

  if (
    !resolvedEn ||
    resolvedEn.length < 3 ||
    /[\u0590-\u05FF]/.test(resolvedEn) ||
    /חלופה|עוגן|דמות מומחה|fallback|alternative/i.test(cleanAnchor)
  ) {
    return [];
  }

  try {
    const urls = await searchPopularWebImages(cleanAnchor, limit, resolvedEn);
    if (Array.isArray(urls) && urls.length > 0) {
      return urls.filter(Boolean);
    }
  } catch (err) {
    console.warn('Visual search error:', err);
  }

  return [];
}

export async function executePhotographicWebSearch(anchorName = '', englishQuery = '', rawTaskText = '') {
  const urls = await searchPhotographicCandidates(anchorName, englishQuery, rawTaskText, 4);
  return urls[0] || null;
}

/**
 * יצירת גל חלופות רענן (Smart Swap Wave) כאשר המשתמש מיצה את החלופות הקיימות בתחנה
 */
export async function generateFreshSwapCandidates(taskText = '', existingAnchors = [], neededCount = 3) {
  const cleanTask = String(taskText || '').trim();
  if (!cleanTask) return [];

  const branchKeyword = extractTaskBranchKeyword(cleanTask) || cleanTask;
  const geminiResult = await fetchGeminiLiveAssociations(branchKeyword, neededCount, existingAnchors);
  if (!geminiResult || !Array.isArray(geminiResult.associations) || geminiResult.associations.length === 0) {
    return [];
  }

  const branchCanon = toCanonicalKey(branchKeyword);
  const fakeAgent1 = {
    branchKeyword,
    branchCandidates: [],
    reserveAssociations: geminiResult.associations.map(a => ({
      ...a,
      anchorName: String(a.anchorName || '').trim().split(/\s+/).slice(0, 2).join(' ')
    })).filter(a => {
      if (!a.anchorName) return false;
      const anchorCanon = toCanonicalKey(a.anchorName);
      if (branchCanon && branchCanon.length >= 3 && anchorCanon === branchCanon) {
        return false;
      }
      return true;
    })
  };

  const resolved = await agent2SearchRootAndCompleteFromWeb(fakeAgent1, cleanTask);
  return resolved.filter(c => c && c.imageUrl && !c.imageUrl.startsWith('data:image/svg'));
}

// ============================================================================
// עובד 4: הסופר הראשי (The Author - Palace Narrative Weaving)
// ============================================================================
export function weavePalaceStory(curatedStations = []) {
  if (!Array.isArray(curatedStations) || curatedStations.length === 0) {
    return 'מסע הזיכרון בארמון מוכן לשינון!';
  }

  const woven = authorWeaveStory(curatedStations);
  if (woven) return woven;

  const anchorList = curatedStations.map((st, i) => {
    const name = st.associationWord || st.title || `תחנה ${i + 1}`;
    return name.replace(/[^\u0590-\u05FFa-zA-Z0-9\s]/g, '').trim();
  }).filter(Boolean);

  if (anchorList.length === 1) return `נכנסת לארמון ופגשת את ${anchorList[0]}.`;
  if (anchorList.length === 2) return `צעדת מהכניסה ופגשת את ${anchorList[0]}, ומשם המשכת אל ${anchorList[1]}.`;

  const lead = anchorList.slice(0, -1).join(', ');
  const last = anchorList[anchorList.length - 1];
  return `במסעך בארמון עברת דרך ${lead} והגעת לשיא אצל ${last} — כל תחנה נחרטה לעד!`;
}

export async function weavePalaceStoryAsync(curatedStations = []) {
  if (!Array.isArray(curatedStations) || curatedStations.length === 0) {
    return 'מסע הזיכרון בארמון מוכן לשינון!';
  }
  try {
    const aiStory = await authorWeaveStoryWithGemini(curatedStations);
    if (aiStory) return aiStory;
  } catch (_) { }
  return weavePalaceStory(curatedStations);
}

// ============================================================================
// הצינור המלא בסינרגיה: קבלת רשימה ➔ סוכן 1 (ענפים) ➔ סוכן 2 (שורש ורשת) ➔ סופר
// ============================================================================
export async function processTaskListWithSynergy(rawItems = []) {
  const cleanList = rawItems.map(item => {
    return typeof item === 'string' ? item.trim() : (item.title || item.name || '').trim();
  }).filter(Boolean);

  if (cleanList.length === 0) return [];

  // שלב 0: פירוק לשוני חכם ומדויק של כל המשימות יחד בקריאת Batch קלה אחת ויחידה (400ms, ללא חיתוך אותיות!)
  const batchLemmasMap = await batchLemmatizeTasksWithGemini(cleanList);

  // שלב 1א: סריקת ענפים מיידית במאגר המקומי (0ms) לכל המשימות ללא קריאות AI
  const localFirstResults = await Promise.all(
    cleanList.map(async (taskText, idx) => {
      const a1 = await agent1ExtractBranchesAndSearch(taskText, {
        skipGemini: true,
        lemmas: batchLemmasMap[idx] || []
      });
      return { idx, taskText, a1 };
    })
  );

  // שלב 1ב: איחוד כל המשימות החסרות לקריאת Gemini Batch אחת (עד 3 עוגנים חדים מראש לכל פריט חסר = מהיר פי 2, והשלמה אוטומטית בהחלפה!)
  const missingSpecs = localFirstResults
    .filter(r => r.a1.branchCandidates.length < 3)
    .map(r => ({
      id: `t_${r.idx}`,
      taskText: r.taskText,
      branchKeyword: r.a1.branchKeyword,
      neededCount: Math.max(1, 3 - r.a1.branchCandidates.length),
      existingAnchors: r.a1.branchCandidates.map(c => c.anchorName)
    }));

  const batchGeminiMap = missingSpecs.length > 0
    ? await fetchGeminiLiveAssociationsBatch(missingSpecs)
    : {};

  // שלב 1ג: אם פריט כלשהו בכל זאת הושמט מתשובת ה-Batch, משלימים אותו בטור (ללא הצפת 429!)
  for (const spec of missingSpecs) {
    if (!batchGeminiMap[spec.id]) {
      await new Promise(r => setTimeout(r, 400));
      const singleRes = await fetchGeminiLiveAssociations(spec.branchKeyword, spec.neededCount, spec.existingAnchors);
      if (singleRes && Array.isArray(singleRes.associations) && singleRes.associations.length > 0) {
        batchGeminiMap[spec.id] = singleRes;
      }
    }
  }

  // שלב 2: סגירת סוכן 1 (עם תוצאות ה-Batch/השלמה) + סוכן 2 (שורש במאגר והשלמת רשת + Vision)
  const rawStations = await Promise.all(localFirstResults.map(async ({ idx, taskText, a1 }) => {
    let agent1Result = a1;
    const precomputed = batchGeminiMap[`t_${idx}`] || null;
    if (a1.branchCandidates.length < 5 && precomputed) {
      agent1Result = await agent1ExtractBranchesAndSearch(taskText, {
        precomputedGeminiResult: precomputed
      });
    }

    const candidates = await agent2SearchRootAndCompleteFromWeb(agent1Result, taskText);
    return { idx, taskText, agent1Result, candidates };
  }));

  // הבטחה שכל תחנה ברשימה מקבלת תמונה ראשית ייחודית (ללא כפילויות בין תחנות באותה רשימה)
  const usedPrimaryUrls = new Set();
  const processedStations = rawStations.map(({ idx, taskText, agent1Result, candidates }) => {
    let chosenIdx = 0;
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i]?.imageUrl && !usedPrimaryUrls.has(candidates[i].imageUrl)) {
        chosenIdx = i;
        break;
      }
    }
    const primary = candidates[chosenIdx] || candidates[0] || {
      anchorName: taskText,
      imageUrl: generateDynamicFallbackCard(taskText),
      emoji: '📌',
      explanation: ''
    };
    if (primary.imageUrl) usedPrimaryUrls.add(primary.imageUrl);

    return {
      order: idx + 1,
      title: taskText,
      coreConcept: agent1Result.branchKeyword || taskText,
      associationWord: primary.anchorName,
      category: primary.category || '',
      imageUrl: primary.imageUrl,
      celebrationImage: primary.imageUrl,
      emoji: primary.emoji || '⭐',
      story: primary.explanation || '',
      explanation: primary.explanation || '',
      hasRepositoryImage: Boolean(primary.imageUrl && !primary.imageUrl.startsWith('data:image/svg')),
      candidates,
      currentCandidateIndex: chosenIdx,
      aiReasoning: agent1Result.aiReasoning || '',
      visionAuditLog: Array.isArray(agent1Result.visionAuditLog) ? agent1Result.visionAuditLog : [],
      isAiCurated: true
    };
  });

  // 3. עובד 4: אריגת סיפור המסע ההיברידי בארמון (Gemini Author + Fallback דטרמיניסטי)
  const grandFinaleStory = await weavePalaceStoryAsync(processedStations);

  return {
    stations: processedStations,
    grandFinaleStory
  };
}

/**
 * עיבוד כרונולוגי מדורג (Chronological Streaming):
 * 1. מעבד את תחנה #1 ראשונה (עד 3 תמונות) — וברגע שהיא מוכנה קורא ל-onFirstReady כדי שהמשתמש יתחיל לטייל מיד!
 * 2. ממשיך לעבד את תחנות #2..#N בטור כרונולוגי ברקע (אפס עומס מקבילי ואפס 429), ומעדכן כל מסגרת מיד כשהיא מוכנה.
 * 3. בסיום כל התחנות, אורג את סיפור הדרך הסופי וקורא ל-onAllDone.
 */
export async function processTaskListChronologically(rawItems = [], {
  onFirstReady = null,
  onStationReady = null,
  onAllDone = null
} = {}) {
  const cleanList = rawItems.map(item => {
    return typeof item === 'string' ? item.trim() : (item.title || item.name || '').trim();
  }).filter(Boolean);

  if (cleanList.length === 0) return { stations: [], grandFinaleStory: '' };

  const usedPrimaryUrls = new Set();

  // אתחול תחנות זמניות במצב טעינה כדי שכל המסגרות בבית יוקמו מיד (מוסתרות עד התקרבות)
  const stations = cleanList.map((taskText, idx) => ({
    order: idx + 1,
    title: taskText,
    coreConcept: extractTaskBranchKeyword(taskText) || taskText,
    associationWord: taskText,
    category: '',
    imageUrl: '',
    celebrationImage: '',
    emoji: '⏳',
    story: '',
    explanation: '',
    hasRepositoryImage: false,
    candidates: [],
    currentCandidateIndex: 0,
    aiReasoning: '',
    visionAuditLog: [],
    isLoading: true,
    isAiCurated: true
  }));

  // שלב 0: פירוק לשוני חכם ומדויק של כל המשימות יחד בקריאת Batch קלה אחת ויחידה (400ms לכל הרשימה כולה)
  const batchLemmasMap = await batchLemmatizeTasksWithGemini(cleanList);

  // שלב א': טעינה ספרינט של תמונה ראשונה אחת לכל מסגרת (Pass 1: Fast 1-Image Per Frame)
  // עובר על כל המסגרות 0..N-1 ושולף תמונה ראשונה בלבד (0ms ממאגר או השלמה מהירה).
  // ברגע שתחנה #1 מוכנה – השחקן משוחרר מיד לטיול, ותוך שניות בודדות כל שאר המסגרות מתמלאות!
  for (let idx = 0; idx < cleanList.length; idx++) {
    const taskText = cleanList[idx];
    const taskLemmas = batchLemmasMap[idx] || [];
    const agent1Result = await agent1ExtractBranchesAndSearch(taskText, {
      maxCandidates: 1,
      lemmas: taskLemmas,
      skipGemini: true
    });
    // Pass 1 שולף תמונה ראשונה מיידית (0ms) מתוך המאגר המקומי (ללא פנייה איטית לרשת!)
    let candidates = await agent2SearchRootAndCompleteFromWeb(agent1Result, taskText, 1, { skipWeb: true });

    // אם עדיין אין מועמד, שליפת עוגן צילום מאומת קיים מתוך 433 התמונות המקומיות - אפס SVG וללא כפילויות!
    if (candidates.length === 0) {
      const broadHits = findBestUserImagesForTask(taskText, 5, { minScore: 50 });
      const best = broadHits.find(h => h.imageUrl && !usedPrimaryUrls.has(h.imageUrl) && !h.imageUrl.startsWith('data:image/svg')) || broadHits[0];
      if (best && best.imageUrl && !best.imageUrl.startsWith('data:image/svg')) {
        candidates = [{
          anchorName: best.title || taskText,
          imageUrl: best.imageUrl,
          emoji: best.emoji || '⭐',
          explanation: '',
          fromPool: true,
          source: 'thematic_pool_fallback'
        }];
      }
    }

    let chosenIdx = 0;
    for (let i = 0; i < candidates.length; i++) {
      if (candidates[i]?.imageUrl && !usedPrimaryUrls.has(candidates[i].imageUrl)) {
        chosenIdx = i;
        break;
      }
    }
    const primary = candidates[chosenIdx] || candidates[0] || {
      anchorName: taskText,
      imageUrl: generateDynamicFallbackCard(taskText),
      emoji: '📌',
      explanation: ''
    };
    if (primary.imageUrl) usedPrimaryUrls.add(primary.imageUrl);

    stations[idx] = {
      order: idx + 1,
      title: taskText,
      coreConcept: agent1Result.branchKeyword || taskText,
      associationWord: primary.anchorName,
      category: primary.category || '',
      imageUrl: primary.imageUrl,
      celebrationImage: primary.imageUrl,
      emoji: primary.emoji || '⭐',
      story: primary.explanation || '',
      explanation: primary.explanation || '',
      hasRepositoryImage: Boolean(primary.imageUrl && !primary.imageUrl.startsWith('data:image/svg')),
      candidates: [primary],
      currentCandidateIndex: 0,
      aiReasoning: agent1Result.aiReasoning || '',
      visionAuditLog: Array.isArray(agent1Result.visionAuditLog) ? agent1Result.visionAuditLog : [],
      isLoading: false,
      isAiCurated: true
    };

    // תחנה #1 מוכנה – שחרור מיידי של המשתמש לשוטט בכפר
    if (idx === 0 && typeof onFirstReady === 'function') {
      onFirstReady({
        stations: [...stations],
        grandFinaleStory: ''
      });
    }

    // עדכון מיידי של כל מסגרת ברגע שהתמונה הראשונה שלה מוכנה
    if (typeof onStationReady === 'function') {
      onStationReady(stations[idx], idx, [...stations]);
    }
  }

  // שלב ב': הרחבת חלופות נוספות לכל מסגרת ברקע (Pass 2: Enrich Alternatives in Background)
  // כל המסגרות בכפר כבר מציגות תמונות מאומתות! כעת המערכת מוסיפה בשקט ברקע
  // חלופה שנייה ושלישית לכל מסגרת, עבור מקרים שבהם המשתמש ירצה לבחור תמונה אחרת במודאל.
  for (let idx = 0; idx < cleanList.length; idx++) {
    const st = stations[idx];
    if (st.candidates.length < MAX_CANDIDATES_PER_STATION) {
      try {
        const taskLemmas = batchLemmasMap[idx] || [];
        const fullAgent1 = await agent1ExtractBranchesAndSearch(st.title, {
          maxCandidates: MAX_CANDIDATES_PER_STATION,
          lemmas: taskLemmas
        });
        const fullCandidates = await agent2SearchRootAndCompleteFromWeb(fullAgent1, st.title, MAX_CANDIDATES_PER_STATION);
        if (Array.isArray(fullCandidates) && fullCandidates.length > st.candidates.length) {
          const existingUrls = new Set(st.candidates.map(c => c.imageUrl));
          const newAlts = fullCandidates.filter(c => c.imageUrl && !existingUrls.has(c.imageUrl));
          st.candidates = [...st.candidates, ...newAlts].slice(0, MAX_CANDIDATES_PER_STATION);
          if (typeof onStationReady === 'function') {
            onStationReady(st, idx, [...stations]);
          }
        }
      } catch (err) {
        console.warn(`Alternative enrichment pass error for station #${idx + 1}:`, err);
      }
    }
  }

  // בסיום כל התחנות והחלופות — אורגים את סיפור הדרך הסופי של "הסופר"
  const grandFinaleStory = await weavePalaceStoryAsync(stations);
  if (typeof onAllDone === 'function') {
    onAllDone({
      stations: [...stations],
      grandFinaleStory
    });
  }

  return {
    stations,
    grandFinaleStory
  };
}

// מתאם תאימות לאחור
export async function resolveAnchorFromLocalPool(taskText = '') {
  const a1 = await agent1ExtractBranchesAndSearch(taskText);
  if (a1.branchCandidates && a1.branchCandidates.length > 0) {
    return {
      concept: a1.branchKeyword,
      associations: a1.branchCandidates,
      primary: a1.branchCandidates[0],
      fromPool: true
    };
  }
  return null;
}

export default {
  MNEMONIC_ANCHOR_CATALOG,
  extractTaskBranchKeyword,
  agent1ExtractBranchesAndSearch,
  agent2SearchRootAndCompleteFromWeb,
  searchPhotographicCandidates,
  executePhotographicWebSearch,
  generateFreshSwapCandidates,
  weavePalaceStory,
  weavePalaceStoryAsync,
  processTaskListWithSynergy,
  processTaskListChronologically,
  resolveAnchorFromLocalPool
};
