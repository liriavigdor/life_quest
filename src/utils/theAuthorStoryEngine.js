/**
 * The Author (הסופר) — LifeQuest Ultra-Tight Narrative Compression Engine v2
 *
 * תפקיד בלעדי: "תפירה מהודקת" של 2–7 תמונות למשפט עלילתי אחד קצר, חד ובלתי נשכח (6–10 מילים).
 *
 * 4 טכניקות הדחיסה הקוגניטיבית:
 * 1. מיזוג שחקנים/חיות לנושא משותף ("הצפרדע והתרנגול...", "מריו וסוניק...") — חוסך פועל קישור מיותר.
 * 2. היתוך תכונה/חפץ לשם תואר (Adjective Fusion): מתלבש על חפץ ("עם הסבון הדביק", "מהקפה הקפוא")
 *    או על הגיבור עצמו ("סופר מריו התינוק", "דרקולה הממושקף").
 * 3. היתוך חפץ לפועל חד של מילה אחת (Verb Compression): "שעון מעורר" -> התעוררו, "מכונת כביסה" -> כיבסו,
 *    "משאבת דלק" -> תדלקו, "מדחום" -> מדדו חום, "מזרק" -> התחסנו.
 * 4. היתוך תנועה+זירה (Motion-Location Fusion): "דרכון/מטוס" + "מגדל פיזה" -> "טס לפיזה" במקום שני משפטים נפרדים.
 */

const COMPOUND_KEEP_REGEX = /סדרת אנימציה|בדיקת דם|בית חולים|הבית הלבן|שק כסף|לחיצת ידיים|קפה חם|פחית קולה|כיכר לחם|כרטיס אשראי|פנקס המחאות|מגדל פיזה|מגדל אייפל|הכותל המערבי|החומה הסינית|מכונת כביסה|מכונת תפירה|משאבת דלק|סכין גילוח|שקע חשמל|רולר צביעה|שעון מעורר|שעון חול|שטיח אדום|גביע זהב|שלט עצור|סימן שאלה|בועת מחשבה|לב שבור|בוגר אוניברסיטה|ארגז כלים|מברשת שיניים|מפתח ברגים|מד חום|אופנוע הארלי|מטוס ג'מבו|כדור פורח|גולגולת ועצמות|נייר דבק|חכת דיג|שק שינה|סופר מריו|הענק הירוק|מר בין|צ'רלי צ'פלין|מייקל ג'ורדן|פרדי מרקיורי|ביל גייטס|בובספוג|פו הדב|מיקי מאוס|דונלד דאק|קפטן אמריקה|איירון מן|הומר סימפסון|איש העטלף|איש הפלדה|הר פוג'י|פסל דוד|פסל החושב/;

export function simplifyMnemonicTerm(raw = '') {
  let text = String(raw || '').trim();
  if (!text) return '';

  text = text
    .replace(/\([^)]*\)/g, '')
    .replace(/דמויות\s*תרבות.*/, '')
    .replace(/[_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return '';

  if (/סדרת\s*אנימציה/.test(text)) return 'סדרת אנימציה';
  if (/מונית\s*פנויה/.test(text)) return 'מונית פנויה';
  if (/עבדים|פירמידות|פירמידה/.test(text)) return 'פירמידות';
  if (/בדיקת\s*דם/.test(text)) return 'בדיקת דם';
  if (/ארגז\s*כלים/.test(text)) return 'ארגז כלים';
  if (/כיכר\s*לחם/.test(text)) return 'לחם';
  if (/כרטיס\s*אשראי/.test(text)) return 'אשראי';
  if (/פנקס\s*המחאות|צ'קים/.test(text)) return "צ'קים";
  if (/שעון\s*מעורר/.test(text)) return 'שעון מעורר';
  if (/נייר\s*דבק|סלוטייפ|מסקינטייפ/.test(text)) return 'נייר דבק';
  if (/מגדל\s*פיזה/.test(text)) return 'פיזה';
  if (/מגדל\s*אייפל/.test(text)) return 'אייפל';
  if (/הכותל\s*המערבי/.test(text)) return 'הכותל';
  if (/החומה\s*הסינית/.test(text)) return 'החומה הסינית';
  if (/טלפון\s*חוגה/.test(text)) return 'טלפון';
  if (/אופנוע\s*הארלי/.test(text)) return 'אופנוע';

  if (COMPOUND_KEEP_REGEX.test(text)) {
    return text;
  }

  const words = text.split(/\s+/).filter(Boolean);
  return words.slice(0, 2).join(' ');
}

function extractStationNode(item) {
  if (!item) return null;
  if (typeof item === 'string') {
    const label = simplifyMnemonicTerm(item);
    return label ? { label, category: '', raw: item } : null;
  }

  const activeCandidate =
    Array.isArray(item.candidates) && typeof item.currentCandidateIndex === 'number'
      ? item.candidates[item.currentCandidateIndex]
      : null;

  const rawLabel =
    item.associationWord ||
    activeCandidate?.anchorName ||
    item.card?.title ||
    item.card?.name ||
    item.card?.name_he ||
    item.anchorName ||
    item.matchedCard?.name ||
    item.title ||
    item.itemTitle ||
    item.name ||
    '';

  const category =
    item.category ||
    activeCandidate?.category ||
    item.card?.category ||
    item.matchedCard?.category ||
    '';

  const label = simplifyMnemonicTerm(rawLabel);
  if (!label) return null;

  return { label, category, raw: rawLabel };
}

// ============================================================================
// זיהוי תפקידים וסיווג סמנטי
// ============================================================================
const ACTOR_REGEX = /בובספוג|דרקולה|סופר\s*מריו|מריו|סוניק|פיקאצ'ו|מר\s*בין|צ'רלי\s*צ'פלין|צפלין|איינשטיין|הענק\s*הירוק|האלק|שוורצנגר|מייקל\s*ג'ורדן|ג'ורדן|באטמן|איש\s*העטלף|סופרמן|איש\s*הפלדה|ספיידרמן|איירון\s*מן|קפטן\s*אמריקה|שרק|דונלד\s*דאק|מיקי\s*מאוס|פו\s*הדב|פינוקיו|מיניונים|סקובי|גולום|ברבי|הומר\s*סימפסון|רונלד\s*מקדונלד|הלו\s*קיטי|פרדי\s*מרקיורי|ביל\s*גייטס|אלביס|טראמפ|אובמה|ביבי|הרצל|נפוליאון|שייקספיר|שרלוק|פרנקנשטיין|טרזן|פופאי|באגס\s*באני|מסי|רונאלדו|לוחם|אביר|חייל|שוטר|רופא|תינוק|צנחן|ליצן|מתאגרף|תרמילאי|מלאך|הורים|אינסטלטור|חשמלאי|ספר|נגר|שף|טבח|נהג|טייס|קברניט|מורה|מוזיקאי/;

const ANIMAL_REGEX = /תרנגול|צפרדע|דרקון|אריה|נמר|כריש|דולפין|לווייתן|ינשוף|נשר|יונה|גמל|סוס|ג'ירפה|פיל|קוף|כלב|חתול|זיקית|חיפושית|עקרב|נחש|צב|דוב|פרה|שועל|זאב|פינגווין|תוכי|עטלף/;

const PROPER_NAME_REGEX = /^(בובספוג|דרקולה|סופר מריו|סוניק|פיקאצ'ו|מר בין|צ'רלי צ'פלין|איינשטיין|שוורצנגר|מייקל ג'ורדן|באטמן|סופרמן|ספיידרמן|איירון מן|קפטן אמריקה|שרק|דונלד דאק|מיקי מאוס|פו הדב|פינוקיו|גולום|ברבי|הומר סימפסון|רונלד מקדונלד|הלו קיטי|פרדי מרקיורי|ביל גייטס|אלביס|נפוליאון|שייקספיר|שרלוק|פרנקנשטיין|טרזן|פופאי|באגס באני|מסי|רונאלדו|פיזה|אייפל)/;

const PLURAL_WORD_REGEX = /^(הורים|ההורים|מיניונים|המיניונים|צ'קים)$/;

const VEHICLE_AIR_REGEX = /מטוס|מסוק|חללית|טיל|כדור\s*פורח|שאטל/;
const VEHICLE_SEA_REGEX = /ספינה|אונייה|אוניה|יאכטה|סירה|גונדולה|צוללת|ג'ט\s*סקי/;
const VEHICLE_LAND_REGEX = /מכונית|רכב|אופנוע|אופניים|רכבת|משאית|ג'יפ|מונית|קורקינט|כרכרה|דחפור/;

const LOCATION_REGEX = /(?:^|\s)(?:פירמידות|הבית\s*הלבן|פיזה|אייפל|קוליסאום|הכותל|חומה\s*הסינית|צ'יצ'ן\s*איצה|עזריאלי|הר\s*פוג'י|כנסיית|טירת|טירה|ארמון|מוסך|בנק|מרפאה|בית\s*חולים|סופר|מספרה|חוף|מדבר|יער|ג'ונגל|גינה|ים|קרח|מגדלור|גשר|הר\s*געש|מפלי\s*מים|מסעדה|מאפייה)(?:\s|$)/;

const FOOD_DRINK_REGEX = /קפה|אספרסו|לחם|חלה|פיצה|המבורגר|פסטה|ספגטי|שניצל|עוגה|מרק|פחית|שוקולד|גלידה|תפוח|בננה|דונאט|סלט|גבינה|יין|בירה|מים|תה|קולה/;

// מילון הפיכת חפץ/תופעה לשם תואר (מתלבש על חפץ או על גיבור!)
const ADJECTIVE_FUSION_MAP = [
  { test: /נייר\s*דבק|סלוטייפ|דבק/, adjM: 'הדביק', adjF: 'הדביקה', actorOk: false },
  { test: /^(קרח|שלג|איש\s*שלג|איגלו)$/, adjM: 'הקפוא', adjF: 'הקפואה', actorOk: true },
  { test: /^(אש|להבה|מדורה|הר\s*געש|גפרורים)$/, adjM: 'הלוהט', adjF: 'הלוהטת', actorOk: true },
  { test: /^(זהב|גביע\s*זהב|יהלום|מטמון)$/, adjM: 'המוזהב', adjF: 'המוזהבת', actorOk: true },
  { test: /^(ברק|חשמל|שקע\s*חשמל|סוללה)$/, adjM: 'המחשמל', adjF: 'המחשמלת', actorOk: true },
  { test: /לב\s*שבור/, adjM: 'השבור', adjF: 'השבורה', actorOk: false },
  { test: /רולר\s*צביעה|צבע/, adjM: 'הצבעוני', adjF: 'הצבעונית', actorOk: false },
  { test: /מגנט/, adjM: 'המגנטי', adjF: 'המגנטית', actorOk: false },
  { test: /קוצים|קיפוד/, adjM: 'הקוצני', adjF: 'הקוצנית', actorOk: true },
  { test: /^(שמש|חמנייה|חמניות)$/, adjM: 'הזוהר', adjF: 'הזוהרת', actorOk: true },
  { test: /^(גשם|מטרייה|ענן|נחשול)$/, adjM: 'הרטוב', adjF: 'הרטובה', actorOk: true },
  { test: /^(משקפיים)$/, adjM: 'הממושקף', adjF: 'הממושקפת', actorOk: true, actorOnly: true },
  { test: /^(תינוק)$/, adjM: 'התינוק', adjF: 'התינוקת', actorOk: true, actorOnly: true },
  { test: /^(כתר)$/, adjM: 'המוכתר', adjF: 'המוכתרת', actorOk: true, actorOnly: true },
  { test: /^(גולגולת|סכנה|רעל)$/, adjM: 'המסוכן', adjF: 'המסוכנת', actorOk: false },
  { test: /^(משקולת|עוגן|אבן)$/, adjM: 'הכבד', adjF: 'הכבדה', actorOk: false }
];

const FEMININE_NOUN_REGEX = /(ה|ת|ית)$|^(מכונית|רכבת|מונית|ספינה|פחית|פיצה|עוגה|פסטה|מברשת|מצלמה|סירה|חללית|צפרדע|טירה|פירמידות|אייפל)$/;

function isFeminineNoun(label) {
  if (/^(דרקולה|קפה|בית|שעון|דרכון|סבון|כספומט|מפתח|מברג|לחם|שניצל|המבורגר|תרנגול|דרקון|אופנוע|טלפון|קלסר)$/.test(label)) return false;
  return FEMININE_NOUN_REGEX.test(label);
}

function getAdjectiveMatch(label) {
  for (const rule of ADJECTIVE_FUSION_MAP) {
    if (rule.test.test(label)) return rule;
  }
  return null;
}

function classifyNode(node) {
  const { label, category } = node;
  const cat = String(category || '');

  if (ACTOR_REGEX.test(label) || /דמויות|אישים|סלבס|אינטראקציות/.test(cat)) return 'actor';
  if (ANIMAL_REGEX.test(label)) return 'animal';
  if (VEHICLE_AIR_REGEX.test(label) || VEHICLE_SEA_REGEX.test(label) || VEHICLE_LAND_REGEX.test(label) || /כלי\s*תחבורה/.test(cat)) return 'vehicle';
  if (LOCATION_REGEX.test(label) || /מבנים,\s*אתרים\s*וציוני\s*דרך/.test(cat)) return 'location';
  if (FOOD_DRINK_REGEX.test(label) || /מאכלים\s*ומאפים/.test(cat)) return 'food';
  return 'object';
}

function withDefiniteArticle(label) {
  if (!label) return '';
  if (PROPER_NAME_REGEX.test(label)) return label;
  if (label.startsWith('ה')) return label;
  if (label.includes(' ')) return label;
  return `ה${label}`;
}

function withPrefix(prep, label) {
  const def = withDefiniteArticle(label);
  if (prep === 'ב' || prep === 'ל') {
    if (def.startsWith('ה')) return `${prep}${def.slice(1)}`;
    return `${prep}${def}`;
  }
  if (prep === 'מ') {
    if (def.startsWith('ה')) return `מה${def.slice(1)}`;
    return `מ${def}`;
  }
  return `${prep}${def}`;
}

function attachAdjective(nounLabel, adjRule) {
  if (!adjRule) return withDefiniteArticle(nounLabel);
  const adj = isFeminineNoun(nounLabel) ? adjRule.adjF : adjRule.adjM;
  return `${withDefiniteArticle(nounLabel)} ${adj}`;
}

// בודק אם מושג מתקצר לפועל תנועה שמתחבר ישירות לזירה (כגון דרכון/מטוס + פיזה -> "טס לפיזה")
function getMotionVerbForNode(node, isPlural) {
  const { label } = node;
  if (/דרכון/.test(label) || VEHICLE_AIR_REGEX.test(label)) return isPlural ? 'טסו' : 'טס';
  if (VEHICLE_SEA_REGEX.test(label)) return isPlural ? 'הפליגו' : 'הפליג';
  if (/אופנוע|אופניים|סוס|גמל|דרקון/.test(label)) return isPlural ? 'רכבו' : 'רכב';
  if (VEHICLE_LAND_REGEX.test(label)) return isPlural ? 'נסעו' : 'נסע';
  return null;
}

function formatUltraTightClause(node, isPlural, attachedAdjRule, usedFallbackIdx) {
  const { label } = node;
  const role = classifyNode(node);

  // 1. חפצים שמתקצרים לפועל חד של 1–2 מילים (כשאין עליהם תואר מוצמד)
  if (!attachedAdjRule) {
    if (/שעון\s*מעורר/.test(label)) return isPlural ? 'התעוררו' : 'התעורר';
    if (/שעון\s*חול|שעון/.test(label)) return isPlural ? 'מיהרו' : 'מיהר';
    if (/סכין\s*גילוח/.test(label)) return isPlural ? 'התגלחו' : 'התגלח';
    if (/מברשת\s*שיניים/.test(label)) return isPlural ? 'צחצחו שיניים' : 'צחצח שיניים';
    if (/טלפון|שיחה|חיוג/.test(label)) return isPlural ? 'התקשרו' : 'התקשר';
    if (/מצלמה/.test(label)) return isPlural ? 'צילמו' : 'צילם';
    if (/מיטה|כרית/.test(label)) return isPlural ? 'נרדמו' : 'נרדם';
    if (/אשראי/.test(label)) return isPlural ? 'שילמו באשראי' : 'שילם באשראי';
    if (/כספומט/.test(label)) return isPlural ? 'משכו מזומן' : 'משך מזומן';
    if (/מחשבון/.test(label)) return isPlural ? 'חישבו' : 'חישב';
    if (/דרכון/.test(label)) return isPlural ? 'טסו עם דרכון' : 'טס עם דרכון';
    if (/משאבת\s*דלק/.test(label)) return isPlural ? 'תדלקו' : 'תדלק';
    if (/מכונת\s*כביסה|אטב/.test(label)) return isPlural ? 'כיבסו' : 'כיבס';
    if (/מגהץ/.test(label)) return isPlural ? 'גיהצו' : 'גיהץ';
    if (/מטאטא|יעה/.test(label)) return isPlural ? 'טאטאו' : 'טאטא';
    if (/מחט|חוט|מכונת\s*תפירה/.test(label)) return isPlural ? 'תפרו' : 'תפר';
    if (/מד\s*חום|מדחום/.test(label)) return isPlural ? 'מדדו חום' : 'מדד חום';
    if (/מזרק|חיסון/.test(label)) return isPlural ? 'התחסנו' : 'התחסן';
    if (/סטטוסקופ/.test(label)) return isPlural ? 'נבדקו' : 'נבדק';
    if (/חותמת/.test(label)) return isPlural ? 'החתימו' : 'החתים';
    if (/קלסר/.test(label)) return isPlural ? 'תייקו' : 'תייק';
    if (/סולם/.test(label)) return isPlural ? 'טיפסו בסולם' : 'טיפס בסולם';
    if (/מצפן|מפה/.test(label)) return isPlural ? 'ניווטו' : 'ניווט';
    if (/משקפת/.test(label)) return isPlural ? 'השקיפו' : 'השקיף';
    if (/מיקרופון/.test(label)) return isPlural ? 'שרו' : 'שר';
    if (/מכחול/.test(label)) return isPlural ? 'ציירו' : 'צייר';
    if (/חכת\s*דיג/.test(label)) return isPlural ? 'דגו' : 'דג';
    if (/אוהל|שק\s*שינה/.test(label)) return isPlural ? 'ישנו באוהל' : 'ישן באוהל';
    if (/אופנוע/.test(label)) return isPlural ? 'דהרו באופנוע' : 'דהר באופנוע';
    if (/מברג|מפתח\s*ברגים|פטיש|מסור/.test(label)) return isPlural ? `תיקנו ${withPrefix('ב', label)}` : `תיקן ${withPrefix('ב', label)}`;
    if (/מדליה|גביע/.test(label)) return isPlural ? `זכו ${withPrefix('ב', label)}` : `זכה ${withPrefix('ב', label)}`;
  }

  // 2. חפצים וזירות עם אפשרות לשם תואר מוצמד ("עם הסבון הדביק", "מהקפה הקפוא")
  const nounWithAdj = attachAdjective(label, attachedAdjRule);

  if (/סבון/.test(label)) {
    return `${isPlural ? 'התקלחו' : 'התקלח'} עם ${nounWithAdj}`;
  }
  if (/קלסר|מסמכים/.test(label)) {
    return `${isPlural ? 'תייקו' : 'תייק'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  }
  if (role === 'actor') {
    return `${isPlural ? 'פגשו את' : 'פגש את'} ${nounWithAdj}`;
  }
  if (role === 'vehicle') {
    if (VEHICLE_AIR_REGEX.test(label)) return `${isPlural ? 'טסו' : 'טס'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
    if (VEHICLE_SEA_REGEX.test(label)) return `${isPlural ? 'הפליגו' : 'הפליג'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
    if (/אופנוע|אופניים|קורקינט|סוס/.test(label)) return `${isPlural ? 'רכבו על' : 'רכב על'} ${nounWithAdj}`;
    return `${isPlural ? 'נסעו' : 'נסע'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  }
  if (role === 'location') {
    if (/^קרח$/.test(label)) return isPlural ? 'החליקו על הקרח' : 'החליק על הקרח';
    return `${isPlural ? 'ביקרו' : 'ביקר'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  }
  if (role === 'animal') {
    if (/דרקון|סוס|גמל/.test(label)) return `${isPlural ? 'רכבו על' : 'רכב על'} ${nounWithAdj}`;
    return `${isPlural ? 'ליטפו את' : 'ליטף את'} ${nounWithAdj}`;
  }
  if (role === 'food') {
    if (/קפה|אספרסו|מרק|תה|מים|יין|בירה|פחית|קולה/.test(label)) {
      return `${isPlural ? 'לגמו' : 'לגם'} ${attachedAdjRule ? `מ${nounWithAdj}` : withPrefix('מ', label)}`;
    }
    return `${isPlural ? 'אכלו' : 'אכל'} ${attachedAdjRule ? `את ${nounWithAdj}` : label}`;
  }

  if (/צ'קים|פנקס/.test(label)) return `${isPlural ? 'חתמו על' : 'חתם על'} ${nounWithAdj}`;
  if (/תחמושת|טעינה/.test(label)) return isPlural ? 'טענו תחמושת' : 'טען תחמושת';
  if (/ספר|מחברת/.test(label)) return `${isPlural ? 'קראו' : 'קרא'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  if (/מפתח/.test(label)) return `${isPlural ? 'פתחו' : 'פתח'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  if (/גיטרה|כינור|חליל|תוף|פסנתר/.test(label)) return `${isPlural ? 'ניגנו' : 'ניגן'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  if (/כדור|מחבט|גביע|שחמט|קוביות|קלפים/.test(label)) return `${isPlural ? 'שיחקו' : 'שיחק'} ${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;

  const singularFallbacks = ['לקח את', 'נשא את', 'אחז ב', 'בדק את', 'שמר את'];
  const pluralFallbacks = ['לקחו את', 'נשאו את', 'אחזו ב', 'בדקו את', 'שמרו את'];
  const verb = isPlural
    ? pluralFallbacks[usedFallbackIdx.count % pluralFallbacks.length]
    : singularFallbacks[usedFallbackIdx.count % singularFallbacks.length];
  usedFallbackIdx.count++;

  if (verb.endsWith('ב')) {
    return `${verb.slice(0, -1)}${attachedAdjRule ? `ב${nounWithAdj}` : withPrefix('ב', label)}`;
  }
  return `${verb} ${nounWithAdj}`;
}

// מילון דחיסה למניעת "רשימת פעלים": הופך חפצי גיבוי לתואר על המושא או לאמצעי ("עם...")
const OVERFLOW_TO_MODIFIER = [
  { test: /מגהץ/, adjM: 'מגוהץ', adjF: 'מגוהצת' },
  { test: /סכין\s*גילוח|מספריים/, adjM: 'גזור', adjF: 'גזורה' },
  { test: /מכונת\s*תפירה|מחט|חוט/, adjM: 'תפור', adjF: 'תפורה' },
  { test: /מכונת\s*כביסה|סבון/, adjM: 'מכובס', adjF: 'מכובסת' },
  { test: /נייר\s*דבק|סלוטייפ|דבק/, adjM: 'דביק', adjF: 'דביקה' },
  { test: /קרח|שלג/, adjM: 'קפוא', adjF: 'קפואה' },
  { test: /אש|להבה/, adjM: 'לוהט', adjF: 'לוהטת' },
  { test: /רולר\s*צביעה|צבע/, adjM: 'צבוע', adjF: 'צבועה' }
];

function getOverflowModifier(label) {
  for (const r of OVERFLOW_TO_MODIFIER) {
    if (r.test.test(label)) return r;
  }
  return null;
}

function getOverflowInstrument(label) {
  if (/משאבת\s*דלק/.test(label)) return 'עם דלק';
  if (/אשראי/.test(label)) return 'באשראי';
  if (/כספומט/.test(label)) return 'במזומן';
  if (/שעון\s*מעורר/.test(label)) return 'עם שחר';
  if (/טלפון/.test(label)) return 'תוך שיחה';
  if (/מד\s*חום|מדחום/.test(label)) return 'עם מד חום';
  if (/מזרק/.test(label)) return 'עם מזרק';
  if (/סטטוסקופ/.test(label)) return 'עם סטטוסקופ';
  if (/מברשת\s*שיניים/.test(label)) return 'עם מברשת שיניים';
  return `עם ${label}`;
}

// מילון היתוך כלי-למושא לפי היגיון פיזי/קאנוני (למשל: מזרק + נוזל = "הזריק קפה", כספומט + חפץ = "משך דרכון מכספומט")
const LIQUID_REGEX = /^(קפה|אספרסו|תה|מים|יין|בירה|מרק|פחית|קולה|סבון|משאבת\s*דלק)$/;
const SOLID_OBJECT_REGEX = /^(לחם|פיצה|כריך|חולצה|דרכון|מפתח|ספר|כסף|צ'קים|פנקס)$/;

function tryToolObjectFusion(actionNodes, attachedAdjs, isPlural) {
  const syringe = actionNodes.find(n => /מזרק/.test(n.label) && !attachedAdjs.has(n));
  const liquid = actionNodes.find(n => LIQUID_REGEX.test(n.label) && n !== syringe);
  if (syringe && liquid) {
    const adjRule = attachedAdjs.get(liquid) || null;
    const liqName = /משאבת\s*דלק/.test(liquid.label) ? 'דלק' : liquid.label;
    const adjWord = adjRule ? ` ${isFeminineNoun(liqName) ? adjRule.adjF.replace(/^ה/, '') : adjRule.adjM.replace(/^ה/, '')}` : '';
    const clause = `${isPlural ? 'הזריקו' : 'הזריק'} ${liqName}${adjWord}`;
    return {
      clause,
      consumed: [syringe, liquid]
    };
  }

  const brush = actionNodes.find(n => /מכחול|רולר\s*צביעה/.test(n.label) && !attachedAdjs.has(n));
  const solid = actionNodes.find(n => SOLID_OBJECT_REGEX.test(n.label) && n !== brush);
  if (brush && solid) {
    const adjRule = attachedAdjs.get(solid) || null;
    const adjWord = adjRule ? ` ${isFeminineNoun(solid.label) ? adjRule.adjF.replace(/^ה/, '') : adjRule.adjM.replace(/^ה/, '')}` : '';
    const clause = `${isPlural ? 'צבעו' : 'צבע'} ${solid.label}${adjWord}`;
    return {
      clause,
      consumed: [brush, solid]
    };
  }

  return null;
}

/**
 * מנוע "הסופר" המכווץ v3 — מקסימום 2 פעלים במשפט (אפס רשימות פעלים בפסיקים!).
 * שוזר 2–7 תמונות לתמונה עלילתית חיה אחת (6–10 מילים).
 */
export function authorWeaveStory(items = []) {
  if (!Array.isArray(items) || items.length === 0) return '';

  const nodes = [];
  const seenLabels = new Set();
  for (const item of items) {
    const node = extractStationNode(item);
    if (node && !seenLabels.has(node.label)) {
      seenLabels.add(node.label);
      nodes.push(node);
    }
  }

  if (nodes.length === 0) return '';
  const labelsSet = new Set(nodes.map(n => n.label));

  // תבניות מופת
  if (nodes.length <= 5 && labelsSet.has('בובספוג') && labelsSet.has('פירמידות') && (labelsSet.has('תחמושת') || labelsSet.has('טעינה'))) {
    const hero = labelsSet.has('תינוק') ? 'בובספוג התינוק' : 'בובספוג';
    return `${hero} ביקר בפירמידות וטען תחמושת.`;
  }
  if (nodes.length <= 5 && labelsSet.has('דרקולה') && labelsSet.has('קרח') && labelsSet.has('פגישה') && labelsSet.has('שיחה')) {
    const hero = labelsSet.has('משקפיים') ? 'דרקולה החנון' : 'דרקולה';
    return `${hero} התקשר לאסקימואי שעל הקרח, והם לחצו ידיים.`;
  }

  // 1. מיזוג עד 2 שחקנים/חיות לנושא אחד
  const actors = nodes.filter(n => classifyNode(n) === 'actor');
  const animals = nodes.filter(n => classifyNode(n) === 'animal');
  const subjectNodes = [];

  if (actors.length >= 2) {
    subjectNodes.push(actors[0], actors[1]);
  } else if (actors.length === 1) {
    subjectNodes.push(actors[0]);
  } else if (animals.length >= 2) {
    subjectNodes.push(animals[0], animals[1]);
  } else if (animals.length === 1) {
    subjectNodes.push(animals[0]);
  }

  let subjectText = '';
  let isPlural = false;
  const remaining = [];

  if (subjectNodes.length === 2) {
    subjectText = `${withDefiniteArticle(subjectNodes[0].label)} ו${withDefiniteArticle(subjectNodes[1].label)}`;
    isPlural = true;
  } else if (subjectNodes.length === 1) {
    subjectText = withDefiniteArticle(subjectNodes[0].label);
    isPlural = PLURAL_WORD_REGEX.test(subjectNodes[0].label);
  } else {
    subjectText = 'הוא';
    isPlural = false;
  }

  for (const n of nodes) {
    if (!subjectNodes.includes(n)) remaining.push(n);
  }

  // 2. איסוף מושגים שניתנים להיתוך כשם תואר והדבקתם על חפץ מתאים (או על גיבור בודד!)
  const adjCandidates = [];
  const actionNodes = [];

  for (const n of remaining) {
    const adjMatch = getAdjectiveMatch(n.label);
    if (adjMatch && remaining.length >= 2) {
      adjCandidates.push({ node: n, adjRule: adjMatch });
    } else {
      actionNodes.push(n);
    }
  }

  const attachedAdjs = new Map();
  let actorModifierApplied = false;
  const unattachedAdjs = [];

  for (const { node: adjNode, adjRule } of adjCandidates) {
    if (adjRule.actorOnly && subjectNodes.length === 1 && !actorModifierApplied) {
      const isFemActor = isFeminineNoun(subjectNodes[0].label);
      subjectText = `${subjectText} ${isFemActor ? adjRule.adjF : adjRule.adjM}`;
      actorModifierApplied = true;
      continue;
    }

    // עדיפות א: הדבקה על חפץ/אוכל מוחשי שנותר ברשימה
    const target = !adjRule.actorOnly && (
      actionNodes.find(an => !attachedAdjs.has(an) && /סבון|לחם|קפה|מפתח|ספר|כדור|קלסר/.test(an.label)) ||
      actionNodes.find(an => !attachedAdjs.has(an) && (classifyNode(an) === 'object' || classifyNode(an) === 'food') && !/שעון\s*מעורר|אשראי|כספומט|מכונת\s*כביסה|משאבת\s*דלק|מד\s*חום|מזרק/.test(an.label))
    );

    if (target) {
      attachedAdjs.set(target, adjRule);
    } else if (adjRule.actorOk && subjectNodes.length === 1 && !actorModifierApplied) {
      // עדיפות ב: הדבקה ישירות על הגיבור הבודד ("סופר מריו הממושקף", "דרקולה הקפוא")!
      const isFemActor = isFeminineNoun(subjectNodes[0].label);
      subjectText = `${subjectText} ${isFemActor ? adjRule.adjF : adjRule.adjM}`;
      actorModifierApplied = true;
    } else {
      unattachedAdjs.push(adjNode);
    }
  }

  for (const ua of unattachedAdjs) {
    actionNodes.push(ua);
  }

  // 3. היתוך תנועה+זירה (Motion-Location Fusion) והיתוך כלי+מושא (Tool-Object Physical Fusion)
  const fusedClauses = [];
  let filteredActionNodes = [...actionNodes];

  const motionNode = filteredActionNodes.find(n => getMotionVerbForNode(n, isPlural) !== null);
  const locationNode = filteredActionNodes.find(n => classifyNode(n) === 'location' && !attachedAdjs.has(n));

  if (motionNode && locationNode) {
    const mVerb = getMotionVerbForNode(motionNode, isPlural);
    fusedClauses.push(`${mVerb} ${withPrefix('ל', locationNode.label)}`);
    filteredActionNodes = filteredActionNodes.filter(n => n !== motionNode && n !== locationNode);
  }

  const toolFusion = tryToolObjectFusion(filteredActionNodes, attachedAdjs, isPlural);
  if (toolFusion) {
    fusedClauses.push(toolFusion.clause);
    filteredActionNodes = filteredActionNodes.filter(n => !toolFusion.consumed.includes(n));
  }

  // סידור: פסוקיות קצרות קודם, וחפץ עם תואר מוצמד בסוף
  filteredActionNodes.sort((a, b) => {
    const aHasAdj = attachedAdjs.has(a) ? 1 : 0;
    const bHasAdj = attachedAdjs.has(b) ? 1 : 0;
    return aHasAdj - bHasAdj;
  });

  const usedFallbackIdx = { count: 0 };
  const maxVerbBudget = Math.max(0, 2 - fusedClauses.length);

  let verbNodes = [];
  let overflowNodes = [];

  if (filteredActionNodes.length <= maxVerbBudget) {
    verbNodes = filteredActionNodes;
  } else {
    // מעדיפים לשמור כפועל ראשי פעולות בעלות מושא נוח (כביסה, אכילה, שתייה, מקלחת, חיסון)
    const prioritized = [...filteredActionNodes].sort((a, b) => {
      const aScore = /מכונת\s*כביסה|סבון|קפה|לחם|פיצה|ספר|מזרק|כספומט/.test(a.label) ? 0 : 1;
      const bScore = /מכונת\s*כביסה|סבון|קפה|לחם|פיצה|ספר|מזרק|כספומט/.test(b.label) ? 0 : 1;
      return aScore - bScore;
    });
    verbNodes = prioritized.slice(0, maxVerbBudget);
    overflowNodes = prioritized.slice(maxVerbBudget);
  }

  // דחיסת עודפי הפעולות לתארים על מושא קיים ולתוספת אמצעי ("עם דלק") — אפס רשימת פעלים!
  const overflowMods = [];
  const overflowInstruments = [];
  for (const on of overflowNodes) {
    const mod = getOverflowModifier(on.label);
    if (mod && overflowMods.length < 2) {
      overflowMods.push(mod);
    } else {
      overflowInstruments.push(getOverflowInstrument(on.label));
    }
  }

  const verbClauses = verbNodes.map((n, idx) => {
    let clause = formatUltraTightClause(n, isPlural, attachedAdjs.get(n) || null, usedFallbackIdx);
    // אם הפועל האחרון הוא "כיבסו"/"גיהצו"/"תפרו" ויש לנו תארים של בגד, נלביש מושא חי ("חולצה מגוהצת וגזורה")
    if (idx === verbNodes.length - 1) {
      if (overflowMods.length > 0) {
        const isLaunderOrSew = /כיבס|גיהצ|תפר/.test(clause);
        if (isLaunderOrSew) {
          const adjText = overflowMods.map(m => m.adjF).join(' ו');
          clause = `${clause} חולצה ${adjText}`;
        } else {
          const isFem = isFeminineNoun(n.label);
          const adjText = overflowMods.map(m => (isFem ? m.adjF : m.adjM)).join(' ו');
          clause = `${clause} ${adjText}`;
        }
      }
      if (overflowInstruments.length > 0) {
        clause = `${clause} ${overflowInstruments.join(' ')}`;
      }
    }
    return clause;
  });

  const rawClauses = [...fusedClauses, ...verbClauses];
  const clauses = Array.from(new Set(rawClauses));

  if (clauses.length === 0) {
    return `${subjectText} ${isPlural ? 'יצאו למסע.' : 'יצא למסע.'}`;
  }
  if (clauses.length === 1) {
    return `${subjectText} ${clauses[0]}.`;
  }
  if (clauses.length === 2) {
    return `${subjectText} ${clauses[0]}, ו${clauses[1]}.`;
  }
  if (clauses.length === 3) {
    return `${subjectText} ${clauses[0]}, ${clauses[1]} ו${clauses[2]}.`;
  }

  const head = clauses.slice(0, -1).join(', ');
  const tail = clauses[clauses.length - 1];
  return `${subjectText} ${head}, ו${tail}.`;
}

export default authorWeaveStory;
