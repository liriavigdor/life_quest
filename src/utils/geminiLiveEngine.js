/**
 * LifeQuest Real-Time Gemini AI Live Mnemonic Engine
 * 
 * חיבור ישיר בזמן אמת למודל Gemini 2.0 Flash / 1.5 Flash
 * מבצע את תורת 5 השלבים האולטימטיבית:
 * 1. פירוק לשוני ומושגי של משימות ומשפטים מורכבים ("שיעור נהיגה מחר ב10", "לקנות שוקולית")
 * 2. יצירת עוגנים חזותיים מוחשיים ובלתי נשכחים (רכב עם שלט ל', קופסת שוקולית צהובה)
 * 3. חיבור סיפור עלילתי אחד, שנון, ללא כפילויות וללא תבניות יבשות
 * 4. אחזור תמונות מדויקות ברשת (Wikimedia Commons API / מאגר מקומי)
 */

import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool.js';
import { searchPopularWebImages } from './webImageSearch.js';
import { getUserImagesSync, findUserImageByKeyword, hebrewWordMatches } from './userImageRepository.js';

const STORAGE_KEY = 'lifequest_gemini_api_key';

export function getGeminiApiKey() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim().length > 10) return saved.trim();
    }
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
      return import.meta.env.VITE_GEMINI_API_KEY.trim();
    }
    if (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
      return process.env.VITE_GEMINI_API_KEY.trim();
    }
  } catch (_) {}
  return '';
}

export function setGeminiApiKey(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!key) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, String(key).trim());
      }
    }
  } catch (_) {}
}

export function hasGeminiApiKey() {
  return Boolean(getGeminiApiKey());
}

/**
 * עיבוד רשימה מלאה ב-AI חי בזמן אמת מול Gemini
 * מייצר עבור כל פריט 5 אסוציאציות מוחשיות שונות (לא הדבר עצמו!)
 * בודק קודם כל במאגר התמונות המקומי (Pool-First), ומשלים את החסר מחיפוש רשת פופולרי בעברית.
 */
export async function curateListWithLiveGemini(itemsList = []) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY');
  }

  const cleanList = itemsList.map(item => {
    return typeof item === 'string' ? item.trim() : (item.title || item.name || '').trim();
  }).filter(Boolean);

  if (cleanList.length === 0) return [];

  const prompt = `אתה אמן טכניקות הזיכרון (Memory Champion) של אפליקציית LifeQuest.
המשתמש הזין רשימת משימות/פריטים לשינון בארמון הזיכרון:
${JSON.stringify(cleanList, null, 2)}

הנחיות ברזל קוגניטיביות חובה (תורת ארמון הזיכרון והאסוציאציות):
1. **חוק המילה עצמה ולא השערות מציאות (Word Semantics over Context Guessing):**
   - לעולם אל תנחש מה המילה מייצגת במציאות של המשתמש!
   - אם המשימה היא "לצאת עם מילקי", "לצאת עם טריקסי", "לרדת עם רקס" או "לטייל עם X" — **איסור מוחלט להניח שמדובר בכלב או בחיית מחמד!** (אדם שיוצא עם חברה בשם טריקסי ייעלב עד עמקי נשמתו לראות תמונה של כלב!).
   - העוגן נבחר אך ורק לפי המשמעות החזותית, המותגית, התרבותית או הצלילית של **המילה עצמה**:
     * "מילקי" ➔ מעדן מילקי שוקולד עם הר קצפת אוורירית, פודינג, שוקולד, גביע קינוח (לעולם לא כלב!)
     * "רקס" ➔ טירנוזאורוס רקס (T-Rex) שואג, דינוזאור פרהיסטורי, שלד טי-רקס (לעולם לא כלב!)
     * "טריקסי" ➔ קוסם שעושה טריק, שפן שנשלף מכובע, קלפי קסמים, דגני בוקר טריקס (לעולם לא כלב!)
   - אסור בתוקף לבחור עוגן על הפועל השולי "לצאת" (איסור מוחלט על "ספיידרמן שיוצא").
   - כאשר המשימה היא פעולת משק בית ("לנקות את החדר", "לסדר את הבית", "לכבס") — המוקד הוא הפעולה עצמה (ניקיון, כביסה, סדר) ולא החלל הגנרי (לא "חדר" ריק).
   - כאשר המשימה היא תחרות או משחק ("להשתתף בטורניר בייבלייד") — המוקד הוא המשחק עצמו ("בייבלייד" -> סביבון מסתחרר, סופת טייפון/הוריקן, זירת קרב).

2. **חוק הזהב של הזיכרון: לעולם אל תציג את החפץ המשעמם עצמו!**
   - הלקוח אינו רוצה לראות תמונה של נעליים כשהוא צריך לזכור לקנות נעליים!
   - הלקוח רוצה לראות **אסוציאציה חזותית חיה, דינמית, חושית ובלתי נשכחת** הקשורה לנעליים (למשל: רקדן סטפס מתופף, שחקן כדורגל בועט בנעלי פקקים, מחליק על הקרח בהחלקרח, רקדנית בלט על קצות האצבעות)!
   - עבור "להחזיר ליהושוע את המכנסיים": לא תמונת מכנסיים! אלא: קוסם ששולף שפנים מהמכנסיים, חייט עם סרט מידה, קאובוי עם שלייקס, ליצן במכנסיים ענקיים.
   - עבור "לרכוש שוקולד חדש": לא תמונת שוקולד! אלא: ווילי וונקה בפתח מפעל השוקולד, שוויצרי באלפים המושלגים, עמי ותמי מול בית הממתקים, שף קונדיטור יוצק מפל שוקולד.
   - עבור "לקחת את הילדה מהגן": לא סתם ילדה! אלא: מרי פופינס מרחפת עם מטרייה, נהג אוטובוס צהוב, גננת עם פעמון, ליצן עם בלוני חיות.
   - עבור "לשחק כדורגל ברביעי": שוער מתעופף לחיבורים, שופט שולף כרטיס אדום, מסי חוגג שער, אצטדיון כדורגל מואר.

3. **לכל פריט ברשימה עליך לייצר בדיוק 5 אסוציאציות מגוונות, חיות וחושיות (דמויות, מקצועות, סצנות פעולה):**
   - anchorName: שם האסוציאציה בעברית (למשל: "מעדן שוקולד עם הר קצפת", "רקדן סטפס", "מחליק על הקרח", "חייט עם סרט מידה")
   - searchQuery: ביטוי חיפוש מדויק בעברית עבור האסוציאציה
   - englishQuery: ביטוי חיפוש ישיר ברשת שמביא צילום מעולה של האסוציאציה (חובה באנגלית בלבד ללא אותיות עבריות! למשל: "chocolate pudding whipped cream dessert glass photography", "tap dancer performance", "figure skater ice skating")
   - emoji: אימוג'י יחיד מתאים
   - explanation: הסבר קוגניטיבי הגיוני, קצר ומשכנע שמחבר בבירור בין המשימה של הלקוח לבין האסוציאציה

4. **חבר משפט עלילתי אחד קצרצר, קולח והגיוני שמחבר את האסוציאציות המובילות להרפתקה אחת בארמון.**

החזר אך ורק אובייקט JSON תקין (ללא Markdown וללא טקסט עודף) במבנה הבא:
{
  "stations": [
    {
      "originalItem": "שם הפריט כפי שהזין המשתמש",
      "coreConcept": "הנושא המרכזי של המשימה",
      "associations": [
        {
          "anchorName": "רקדן סטפס",
          "searchQuery": "רקדן סטפס",
          "englishQuery": "tap dancer performance",
          "emoji": "👞",
          "explanation": "רקדן הסטפס מתופף ברגליו וממחיש מיד את רעש ונעילת הנעליים"
        },
        {
          "anchorName": "מחליק על הקרח",
          "searchQuery": "מחליק על הקרח",
          "englishQuery": "figure skater ice skating",
          "emoji": "⛸️",
          "explanation": "להבי נעלי ההחלקרח החדים חותכים את הקרח ומזכירים את הנעליים"
        },
        {
          "anchorName": "שחקן כדורגל בועט",
          "searchQuery": "שחקן כדורגל בועט",
          "englishQuery": "soccer player kicking ball",
          "emoji": "⚽",
          "explanation": "נעלי הפקקים של שחקן הכדורגל בועטות בעוצמה בכדור"
        },
        {
          "anchorName": "רקדנית בלט",
          "searchQuery": "רקדנית בלט פוינט",
          "englishQuery": "ballerina pointe shoes",
          "emoji": "🩰",
          "explanation": "נעלי הפוינט של רקדנית הבלט נעמדות בדיוק על קצות האצבעות"
        },
        {
          "anchorName": "צועד יחף על גחלים",
          "searchQuery": "הליכה על גחלים",
          "englishQuery": "firewalking barefoot",
          "emoji": "🔥",
          "explanation": "ההליכה היחפה על גחלים לוהטים ממחישה כמה אתה חייב נעליים חדשות"
        }
      ],
      "actionInStory": "הפעולה בסיפור"
    }
  ],
  "grandFinaleStory": "משפט עלילתי שלם, קצר ומבריק שמחבר את כל האסוציאציות בלי חזרות"
}`;

  // Call Gemini API (Active supported production models)
  const models = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-2.5-flash'];
  let jsonResponse = null;
  let lastErr = null;

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
        signal: AbortSignal.timeout(5000)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errText}`);
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        jsonResponse = JSON.parse(rawText);
        break;
      }
    } catch (err) {
      lastErr = err;
      console.warn(`Failed model ${model}:`, err);
    }
  }

  if (!jsonResponse || !Array.isArray(jsonResponse.stations)) {
    throw lastErr || new Error('Invalid response from Gemini');
  }

  // Load user saved images if available (IndexedDB)
  let userSavedImages = [];
  try {
    userSavedImages = getUserImagesSync() || [];
  } catch (_) {}

  // Helper function to resolve candidate: Prioritize direct, high-quality Web Image Search
  // of the concrete object, and prevent fantasy/pop-culture hijackings completely!
  async function resolveCandidate(assoc, coreConcept) {
    const anchorName = (assoc.anchorName || '').trim();
    const searchQuery = (assoc.searchQuery || anchorName).trim();
    const englishQuery = (assoc.englishQuery || '').trim();

    // 1. Check user private saved images - ONLY if the user specifically uploaded or approved an image with this exact title
    const userMatch = userSavedImages.find(u => 
      u.title && u.title.trim().toLowerCase() === anchorName.toLowerCase()
    );
    if (userMatch && userMatch.imageUrl && !userMatch.imageUrl.startsWith('data:image/svg')) {
      return {
        anchorName,
        imageUrl: userMatch.imageUrl,
        emoji: assoc.emoji || userMatch.emoji || '💡',
        explanation: assoc.explanation || userMatch.caption || '',
        fromPool: true,
        source: 'user_saved'
      };
    }

    // 2. Search web image directly (Wikimedia Commons API / Wikipedia / DDG)
    // using clean englishQuery (e.g. "karaoke microphone", "karaoke party speaker")
    try {
      const webImages = await searchPopularWebImages(searchQuery || anchorName, 4, englishQuery);
      if (webImages && webImages.length > 0 && webImages[0]) {
        return {
          anchorName,
          imageUrl: webImages[0],
          emoji: assoc.emoji || '💡',
          explanation: assoc.explanation || '',
          fromPool: false,
          source: 'web_search'
        };
      }
    } catch (err) {
      console.warn('Web search failed for anchor:', anchorName, err);
    }

    // 3. Fallback to local pool ONLY if exact name match AND strictly NOT a fictional/pop-culture character
    const poolMatch = STAGED_IMAGES_POOL.find(p => {
      if (p.theme === 'fictional_pop' || p.category?.includes('בדיוניות') || p.category?.includes('1. דמויות')) {
        return false;
      }
      const pName = (p.name_he || p.name || p.suggestedName || '').trim().toLowerCase();
      if (!pName || !anchorName) return false;
      return pName === anchorName.toLowerCase();
    });

    if (poolMatch && poolMatch.imageUrl) {
      return {
        anchorName,
        imageUrl: poolMatch.imageUrl,
        emoji: assoc.emoji || '💡',
        explanation: assoc.explanation || '',
        fromPool: true,
        source: 'local_pool'
      };
    }

    return {
      anchorName,
      imageUrl: '',
      emoji: assoc.emoji || '💡',
      explanation: assoc.explanation || '',
      fromPool: false,
      source: 'web_search'
    };
  }

  // Enrich each station: Resolve Candidate #1 eagerly for instant, lightning-fast rendering (<1s),
  // while keeping Candidates #2-#5 lazy-loaded on-demand when the user clicks "החלף עוגן 👎"!
  const enrichedStations = await Promise.all(
    jsonResponse.stations.map(async (st, idx) => {
      const rawAssocs = Array.isArray(st.associations) && st.associations.length > 0 
        ? st.associations 
        : [{ anchorName: st.originalItem, searchQuery: st.originalItem, englishQuery: '', emoji: '💡', explanation: '' }];

      // 1. Check if user specifically approved an image for this EXACT item title (STRICT match only!)
      const directUserApproved = userSavedImages.find(u => 
        u.isUserApproved && 
        u.title && 
        u.title.trim().toLowerCase() === st.originalItem.trim().toLowerCase()
      );
      const approvedCandidate = (directUserApproved && directUserApproved.imageUrl && !directUserApproved.imageUrl.startsWith('data:image/svg'))
        ? {
            anchorName: directUserApproved.title || directUserApproved.name || st.originalItem,
            imageUrl: directUserApproved.imageUrl,
            emoji: directUserApproved.emoji || '⭐',
            explanation: directUserApproved.caption || rawAssocs[0]?.explanation || '',
            fromPool: true,
            source: 'user_approved'
          }
        : null;

      // 2. Resolve Candidate #1 immediately
      const primaryCandidate = approvedCandidate || await resolveCandidate(rawAssocs[0], st.coreConcept);

      // 3. Lazy candidates #2-#5 (ready with full cognitive text and englishQuery, images fetched on click)
      const secondaryCandidates = rawAssocs.slice(1, 5).map(a => ({
        anchorName: a.anchorName,
        searchQuery: a.searchQuery || a.anchorName,
        englishQuery: a.englishQuery || '',
        emoji: a.emoji || '💡',
        explanation: a.explanation || '',
        imageUrl: '',
        fromPool: false,
        source: 'lazy_web'
      }));

      const finalCandidates = [primaryCandidate, ...secondaryCandidates];
      const primary = finalCandidates[0];

      return {
        order: idx + 1,
        title: st.originalItem,
        coreConcept: st.coreConcept || st.originalItem,
        associationWord: primary.anchorName,
        emoji: primary.emoji || '💡',
        imageUrl: primary.imageUrl || '',
        story: primary.explanation,
        hasRepositoryImage: primary.fromPool,
        isUserApproved: primary.source === 'user_approved',
        candidates: finalCandidates,
        currentCandidateIndex: 0,
        card: {
          name: primary.anchorName,
          emoji: primary.emoji || '💡',
          caption: primary.explanation,
          imageUrl: primary.imageUrl || ''
        },
        actionInStory: st.actionInStory
      };
    })
  );

  return {
    stations: enrichedStations,
    grandFinaleStory: jsonResponse.grandFinaleStory
  };
}

export default {
  getGeminiApiKey,
  setGeminiApiKey,
  hasGeminiApiKey,
  curateListWithLiveGemini
};
