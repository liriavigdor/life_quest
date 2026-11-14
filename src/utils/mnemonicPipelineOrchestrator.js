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
import { authorWeaveStory } from './theAuthorStoryEngine.js';
import { getHebrewSynonyms } from './hebrewSynonymThesaurus.js';
import { getSafeMorphologicalFamily } from './hebrewLinguisticsEngine.js';

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
  let clean = rawText.trim().replace(/[.,!?:;]+/g, ' ');

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
  if (/(להסתפר|תספורת|מספרה|ספר)/.test(lowerRaw)) return 'תספורת';
  if (/(אינסטלטור|שרברב|סתימה|נזילה|ברז\s+דולף)/.test(lowerRaw)) return 'אינסטלטור';
  if (/(חשבון\s+חשמל|חשמלאי|קצר\s+בחשמל|חשמל)/.test(lowerRaw)) return 'חשמל';
  if (/(מוסך|טיפול\s+10000|טסט\s+לרכב)/.test(lowerRaw)) return 'מוסך';
  if (/(פנצ'?ר|אופניים)/.test(lowerRaw)) {
    if (lowerRaw.includes('אופניים')) return 'אופניים';
    return 'פנצ\'ר';
  }

  // 3. תנועה עם ישות/חפץ: "לצאת עם הכלב", "ללכת עם הילד"
  const motionMatch = clean.match(/^(?:לצאת|לרדת|לטייל|להסתובב|ללכת)\s+(?:עם|אל|ל)\s+(.+)$/i);
  if (motionMatch && motionMatch[1]) {
    clean = motionMatch[1];
  }

  // 4. הסרת פועלי פעולה ישירים
  const actionPrefixes = [
    /^(?:לעשות|לבצע|לערוך|להחזיר|להביא|לקחת|לאסוף|לקנות|לרכוש|למסור|לתת|להעביר|להזמין|לתקן|לשטוף|לנקות|לסדר|להכין|לאכול|לבשל|לאפות|לשחק|לפגוש|לראות|לבדוק|לשלם|למלא|לשלוח|לכתוב|לפתוח|לסגור|להתחיל|לסיים|להתקשר\s+ל?)\s+(?:את\s+ה?|את\s+|ל[^\s]+\s+את\s+ה?|ל[^\s]+\s+את\s+|ל[^\s]+\s+|ה?)?/i,
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
  const tNorm = toCanonicalKey(targetName);
  const rNorm = toCanonicalKey(repoItem.title || repoItem.name);
  if (!tNorm || !rNorm) return false;
  if (tNorm === rNorm) return true;
  if (tNorm.length >= 3 && rNorm.length >= 3) {
    if (tNorm.includes(rNorm) || rNorm.includes(tNorm)) return true;
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

  const palaceRoots = getCuratedArchetypeTitles();
  const rootsSample = palaceRoots.slice(0, 300).join(', ');

  const prompt = `אתה סוכן מס' 1: מומחה עוגני משימות ואסוציאציות (LifeQuest Mnemonic Anchor Specialist).
משימת המשתמש לשינון: "${cleanTask}"${coreClarification}.
${existingClause}

רשימת עוגנים וחפצים שקיימים כבר בארמון הזיכרון שלנו:
${rootsSample}

הנחיות ברזל קוגניטיביות (מודל משולב - Hybrid Mnemonic Model):
1. **עדיפות לעוגנים קיימים בארמון (אך ורק אם הקשר טבעי, חזק ומשכנע מיד!):**
   בדוק את רשימת העוגנים הקיימים בארמון לעיל. בחר עוגן מהארמון אך ורק אם קיים חיבור אסוציאטיבי טבעי ומשכנע שכל אדם יבין ברגע (כגון "פסנתר" ➔ "שוקולד" / "שחמט", "תאונה" ➔ "אמבולנס" / "קסדה").
   **איסור מוחלט על קפיצות מאולצות או קלושות:** לעולם אל תאנוס עוגן מהרשימה אם אין קשר ישיר ומשכנע! (לדוגמה: איסור מוחלט לבחור "כרטיס אדום" עבור תקלה, "מסור" עבור פרצה, או "עט" עבור שימוש).
   אם אין עוגן מתאים ומשכנע ברשימה — צא מיד החוצה ובחר עוגן ארכיטיפי קונקרטי חדש לחלוטין שמייצג את המושג בבהירות (כגון "תקלה" ➔ "משולש אזהרה" / "מנוע מעשן"; "פרצה" ➔ "מנעול פרוץ" / "גדר תיל"; "שימוש" ➔ "שלט רחוק" / "מתג חשמל")!
2. **חופש פריצה מבוקר (Controlled Out-of-Palace Expansion):**
   אם אף עוגן מהרשימה אינו מתאים בצורה טבעית, מותר לך להציע עוגן חדש לגמרי, **אך ורק בתנאי שהוא אובייקט ארכיטיפי מוחשי ויחיד** (עצם פיזי נקי, כלי, פריט לבוש, חיה, או דמות מובהקת — לעולם לא סצנה מופשטת או נדירה כמו "מתקן התנגשות מים" או "תמרור דרך הרוס").
3. **חוק האסוציאציה החד/דו-מילתית (Strict 1-2 Words Rule):**
   - כל שם עוגן (anchorName) חייב להכיל **בדיוק מילה אחת או שתיים בלבד!**
   - דוגמאות נכונות: "אמבולנס", "רמזור", "שוקולד", "סולם", "קסדה", "קונוס תנועה", "כרטיס אדום", "ווילי וונקה".
4. **חיפוש תמונות מדויק ונקי (2-3 מילים באנגלית!):** englishQuery חייב להכיל אך ורק את האובייקט החזותי באנגלית ב-2 עד 3 מילים, ללא מילות סרק (למשל: "traffic light", "ambulance vehicle", "chocolate bar", "wooden ladder").
5. **הסבר תמציתי ומדויק בלבד (explanation):** הסבר קצרצר של 2 עד 4 מילים בלבד מדוע בחרת בעוגן זה עבור המשימה (למשל: "אור אדום לעצירה", "רכב חירום", "צבע: שחור ולבן", "סולם צלילים").
   אם העוגן מייצג ישירות את המושג ומובן מאליו לכל אדם (למשל "כוח" ➔ "שריר זרוע", "אהבה" ➔ "לב", "זמן" ➔ "שעון", "כסף" ➔ "מטבעות") — החזר מחרוזת ריקה "" בשדה explanation!

החזר אך ורק אובייקט JSON תקין (ללא שום markdown וללא טקסט עודף):
{
  "coreConcept": "שם הענף המרכזי במילה אחת",
  "associations": [
    {
      "anchorName": "מילה אחת או שתיים בלבד בעברית",
      "englishQuery": "2 to 3 words in english",
      "emoji": "אימוג'י יחיד",
      "explanation": "הסבר מדויק ב-2 עד 4 מילים (או מחרוזת ריקה אם מובן מאליו)"
    }
  ]
}
חובה לייצר בדיוק ${count} אסוציאציות שונות ומוחשיות.`;

  const models = ['gemini-3.5-flash-lite', 'gemini-flash-lite-latest', 'gemini-3.8-flash', 'gemini-3.5-flash'];
  for (const model of models) {
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
        signal: AbortSignal.timeout(7500)
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
      }
    } catch (_) {}
  }
  return null;
}

// ============================================================================
// עובד 1: מומחה עוגנים וסריקת ענפים (Agent 1: Branch Search)
// ============================================================================
export async function agent1ExtractBranchesAndSearch(taskText = '') {
  const cleanTask = String(taskText || '').trim();
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

  // סוכן 1 סורק את המאגר אך ורק לפי ענפים (Branches Search) - ללא הצגת החפץ עצמו!
  const userMatchesBranch = findBestUserImagesForTask(branchKeyword, 5, { mode: 'branches' });
  const userMatchesFull = branchKeyword !== cleanTask ? findBestUserImagesForTask(cleanTask, 5, { mode: 'branches' }) : [];
  const allUserMatches = [...userMatchesBranch, ...userMatchesFull];

  for (const userMatch of allUserMatches) {
    if (branchCandidates.length >= 5) break;
    if (userMatch && userMatch.imageUrl && !userMatch.imageUrl.startsWith('data:image/svg') && !seenUrls.has(userMatch.imageUrl)) {
      if (!isAssociationDisliked(cleanTask, userMatch.imageUrl)) {
        seenUrls.add(userMatch.imageUrl);
        branchCandidates.push({
          anchorName: userMatch.title || branchKeyword,
          imageUrl: userMatch.imageUrl,
          emoji: userMatch.emoji || '⭐',
          explanation: '', // עוגן ישיר מהמאגר ללא מעורבות AI - אין הסבר מיותר
          fromPool: true,
          source: 'user_approved'
        });
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
      const synMatches = findBestUserImagesForTask(syn, 3, { mode: 'branches' });
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

  // 3. קישוריות בין סוכנים: בדיקת כמות הפריטים שנמצאו כענפים במאגר
  // עדיפות עליונה: הקרנת שורש עבור מילת המפתח מהמאגר.
  // רק אם חסרים פריטים להשלמה ל-5, סוכן 1 מייצר בדיוק את הכמות החסרה!
  const neededCount = 5 - branchCandidates.length;

  if (neededCount > 0) {
    const existingAnchorNames = branchCandidates.map(c => c.anchorName);
    try {
      const geminiResult = await fetchGeminiLiveAssociations(branchKeyword, neededCount, existingAnchorNames);
      if (geminiResult && Array.isArray(geminiResult.associations) && geminiResult.associations.length > 0) {
        // סינון אסוציאציות והגבלה ל-1-2 מילים ללא כפילויות
        for (const assoc of geminiResult.associations) {
          if (!assoc || !assoc.anchorName) continue;
          const cleanAnchor = String(assoc.anchorName).trim().split(/\s+/).slice(0, 2).join(' ');
          assoc.anchorName = cleanAnchor;
          reserveAssociations.push(assoc);
        }

        // בדיקה מיידית אם סוכן 1 קלע לשורש שכבר שמור במאגר המקומי
        for (let i = reserveAssociations.length - 1; i >= 0; i--) {
          if (branchCandidates.length >= 5) break;
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
    } catch (_) {}

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
    reserveAssociations,
    branchCandidates,
    isComplete: branchCandidates.length >= 5
  };
}

// ============================================================================
// עובד 2: חיפוש שורש והשלמת רשת (Agent 2: Root Search & Web Completion)
// ============================================================================
export async function agent2SearchRootAndCompleteFromWeb(agent1Result, rawTaskText = '') {
  const cleanTask = String(rawTaskText || '').trim();
  const candidates = [...(agent1Result.branchCandidates || [])];
  const seenUrls = new Set(candidates.map(c => c.imageUrl).filter(Boolean));

  // אם סוכן 1 כבר מצא 5 תמונות שורש מאומתות מתוך המאגר המקומי — מחזירים מיד באפס השהיה וללא רשת!
  if (candidates.length >= 5) {
    return candidates.slice(0, 5);
  }

  // רשימת האסוציאציות שסוכן 1 המציא עבור הפריטים החסרים
  const pendingAssociations = [...(agent1Result.reserveAssociations || [])];

  // שלב א': סוכן 2 סורק את המאגר המקומי לפי שורשים (mode: 'roots') עבור כל אסוציאציה חדשה של סוכן 1
  for (let i = pendingAssociations.length - 1; i >= 0; i--) {
    if (candidates.length >= 5) break;
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

  // שלב ב': סוכן 2 משלים מהרשת אך ורק את הפריטים שעדיין חסרים להשלמת 5 (Web Completion + Gemini Vision)
  while (candidates.length < 5 && pendingAssociations.length > 0) {
    const missingAssoc = pendingAssociations.shift();
    if (!missingAssoc) break;

    const webImg = await executePhotographicWebSearch(
      missingAssoc.anchorName,
      missingAssoc.englishQuery,
      cleanTask
    );

    if (webImg && !seenUrls.has(webImg)) {
      let finalImageUrl = webImg;
      let isApprovedByVision = true;

      // מנגנון הורדה והטמעה מקומית לצמיתות + ביקורת ראייה של Gemini Vision
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
              isApprovedByVision = false;
            } else if (ingestRes.ok && ingestRes.localImageUrl) {
              finalImageUrl = ingestRes.localImageUrl;
            }
          }
        } catch (err) {
          console.warn('Ingestion attempt failed, falling back to original URL:', err);
        }
      }

      if (isApprovedByVision && !seenUrls.has(finalImageUrl)) {
        seenUrls.add(finalImageUrl);
        candidates.push({
          anchorName: missingAssoc.anchorName,
          imageUrl: finalImageUrl,
          emoji: missingAssoc.emoji || '🌐',
          explanation: missingAssoc.explanation || '',
          fromPool: finalImageUrl.includes('/staged_images/pool/'),
          source: finalImageUrl.includes('/staged_images/pool/') ? 'ingested_permanent' : 'web_search'
        });
      }
    }
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

  return candidates.slice(0, 5);
}

// ============================================================================
// עובד 3: ארכיטקט חיפוש תמונות פוטוגרפיות (Visual Search Architect)
// ============================================================================
export async function executePhotographicWebSearch(anchorName = '', englishQuery = '', rawTaskText = '') {
  // שער ברזל הרמטי: איסור מוחלט על חיפוש מילת המשימה הגולמית של הלקוח ברשת!
  // סוכן 3 מסרב לבצע חיפוש ברשת אם העוגן חסר שאילתת צילום בינלאומית או מכיל אותיות עבריות בשאילתת הרשת.
  const cleanAnchor = String(anchorName || '').trim();
  const cleanTask = String(rawTaskText || '').trim();
  let resolvedEn = String(englishQuery || '').trim();

  // אם שאילתת האנגלית חסרה או מכילה אותיות עבריות — מחלצים שאילתת צילום תקנית מתוך המילון
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
    return null;
  }

  try {
    const urls = await searchPopularWebImages(cleanAnchor, 4, resolvedEn);
    if (urls && urls.length > 0 && urls[0]) {
      return urls[0];
    }
  } catch (err) {
    console.warn('Visual search error:', err);
  }

  return null;
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

// ============================================================================
// הצינור המלא בסינרגיה: קבלת רשימה ➔ סוכן 1 (ענפים) ➔ סוכן 2 (שורש ורשת) ➔ סופר
// ============================================================================
export async function processTaskListWithSynergy(rawItems = []) {
  const cleanList = rawItems.map(item => {
    return typeof item === 'string' ? item.trim() : (item.title || item.name || '').trim();
  }).filter(Boolean);

  if (cleanList.length === 0) return [];

  const rawStations = await Promise.all(cleanList.map(async (taskText, idx) => {
    // 1. סוכן 1: הפקת 5 אסוציאציות (ברזרבה) + סריקת המאגר לפי "ענפים"
    const agent1Result = await agent1ExtractBranchesAndSearch(taskText);

    // 2. סוכן 2: סריקה לפי "שורש" במאגר + השלמת תמונות חסרות ברשת בלבד
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
      isAiCurated: true
    };
  });

  // 3. עובד 4: אריגת סיפור המסע בארמון
  const grandFinaleStory = weavePalaceStory(processedStations);

  return {
    stations: processedStations,
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
  executePhotographicWebSearch,
  weavePalaceStory,
  processTaskListWithSynergy,
  resolveAnchorFromLocalPool
};
