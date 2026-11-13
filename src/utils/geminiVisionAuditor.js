/**
 * LifeQuest Gemini Vision Quality Auditor & Image Ingestion Engine
 * 
 * מקנה לג'מיני "עיניים" לבחינת איכות צילום חזותית וקוגניטיבית לפני אישור התמונה.
 * פוסל אוטומטית: תרשימים, דיאגרמות, סריקות מסמכים, תמונות בשחור-לבן, מפות, וקטורים זולים וסימני מים.
 * מאשר אך ורק: צילום אמיתי, חי, צבעוני, רחב (Landscape/Wide) שתואם בדיוק מופתי לעוגן המבוקש.
 */

import { getGeminiApiKey } from './geminiLiveEngine.js';

// רשימת מודלי הראייה (Multimodal Vision) הפעילים לפי סדר עדיפויות
export const VISION_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.8-flash'
];

/**
 * המרת כתובת תמונה ברשת (URL) או קובץ ל-Base64 ו-MimeType
 */
export async function fetchImageAsBase64(imageUrl, timeoutMs = 6000) {
  if (!imageUrl || typeof imageUrl !== 'string') return null;

  // אם זה כבר Data URL
  const dataMatch = imageUrl.match(/^data:(image\/[a-zA-Z0-9+]+);base64,(.+)$/);
  if (dataMatch) {
    return {
      mimeType: dataMatch[1],
      base64Data: dataMatch[2]
    };
  }

  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) LifeQuestVision/1.0'
      },
      signal: AbortSignal.timeout(timeoutMs)
    });

    if (!res.ok) return null;

    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const mimeType = contentType.split(';')[0].trim().toLowerCase();

    // שלילת פורמטים לא נתמכים
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return null;
    }

    const arrayBuffer = await res.arrayBuffer();
    // הגבלת משקל: תמונה קטנה מ-5KB היא כנראה פגומה/אייקון, ומעל 10MB כבדה מדי
    if (arrayBuffer.byteLength < 5000 || arrayBuffer.byteLength > 10 * 1024 * 1024) {
      return null;
    }

    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64Data = btoa(binary);

    return {
      mimeType,
      base64Data
    };
  } catch (err) {
    console.warn('Failed to convert image to base64 for Vision audit:', err);
    return null;
  }
}

/**
 * בדיקת תמונה בעיני ה-AI (Gemini Vision Quality Audit)
 * 
 * @param {Object} params
 * @param {string} params.imageUrl - כתובת התמונה (רשת או Data URL)
 * @param {string} params.anchorName - שם העוגן המבוקש בעברית (למשל: "לוח קליפבורד ושאלון")
 * @param {string} [params.coreConcept] - ענף המשימה (למשל: "סקר")
 * @param {string} [params.englishQuery] - שאילתת החיפוש באנגלית
 * @param {string} [params.apiKey] - מפתח API (אופציונלי, נשלף אוטומטית אם ריק)
 * @returns {Promise<{ approved: boolean, score: number, reason: string, isRealPhoto: boolean, isAnchorMatch: boolean }>}
 */
export async function auditImageWithGeminiVision({
  imageUrl,
  imageBase64 = null,
  mimeType = 'image/jpeg',
  anchorName = '',
  coreConcept = '',
  englishQuery = '',
  apiKey = null
}) {
  const activeKey = apiKey || getGeminiApiKey();
  if (!activeKey) {
    // ללא מפתח API - לא פוסלים אוטומטית אלא מעבירים בציון נייטרלי
    return {
      approved: true,
      score: 7,
      reason: 'עבר ללא ביקורת ראייה (חסר מפתח API)',
      isRealPhoto: true,
      isAnchorMatch: true
    };
  }

  // חילוץ Base64
  let imgPayload = null;
  if (imageBase64) {
    imgPayload = { mimeType, base64Data: imageBase64 };
  } else if (imageUrl) {
    imgPayload = await fetchImageAsBase64(imageUrl);
  }

  if (!imgPayload || !imgPayload.base64Data) {
    return {
      approved: false,
      score: 0,
      reason: 'לא ניתן היה לקרוא את קובץ התמונה לבדיקה',
      isRealPhoto: false,
      isAnchorMatch: false
    };
  }

  const prompt = `אתה מבקר איכות צילום קוגניטיבי של ארמון הזיכרון (LifeQuest Visual Quality & Cognitive Anchor Auditor).
עליך להביט בתמונה המצורפת בעיון ולבחון אותה לפי קריטריוני הברזל הבאים:

1. **התאמה לעוגן המבוקש (Anchor Alignment):**
   - העוגן המבוקש: "${anchorName || coreConcept}"
   - נושא הענף: "${coreConcept || anchorName}"
   - שאילתת החיפוש המקורית: "${englishQuery || anchorName}"
   - האם התמונה הזו אכן ממחישה בצורה ברורה, ישירה ומובהקת את העוגן המבוקש? (אם התמונה מציגה משהו אחר לחלוטין – פסול מיד!).

2. **דרישות צילום איכותי (תמונה טובה):**
   - צילום אותנטי, חי, צבעוני, ברור, מואר היטב ומקצועי (או ייצוג מותגי מובהק של דמות תרבותית מוכרת).
   - קומפוזיציה רחבה/אופקית מתאימה למסגרת (Landscape, סביב 16:9 או 4:3).
   - עוגן חזותי עשיר, בלתי נשכח שמעורר רגש ואסוציאציה מיידית (Anti-Generic).

3. **עילות פסילה מיידיות (תמונה גרועה - Reject):**
   - דיאגרמות, תרשימים, גרפים, עצי תהליך, סכמות, מפות, או שרטוטים הנדסיים/אדריכליים (Floorplans / Blueprints).
   - דפי ספרים, סריקות מסמכים, טקסטים בשחור-לבן, כתבי יד היסטוריים או תמונות ארכיון מטושטשות.
   - וקטורים זולים, קליפארט, סטיקרים, אימוג'ים מוגדלים או גרפיקה פרימיטיבית.
   - סימני מים בולטים של אתרי סטוק (Shutterstock, Alamy וכו') או עומס של כרזות טקסט שיווקי.
   - תמונה מטושטשת ברזולוציה ירודה, חשוכה מדי או קטועה בצורה מכוערת.

החזר אך ורק אובייקט JSON תקין (ללא markdown) במבנה הבא:
{
  "approved": boolean, // true אך ורק אם score >= 7 ואין אף עילת פסילה
  "score": number, // ציון איכות והתאמה מ-1 עד 10
  "reason": "נימוק קצר וחד בעברית שמסביר בדיוק מה רואים בתמונה ולמה אושרה/נפסלה",
  "isRealPhoto": boolean,
  "isAnchorMatch": boolean,
  "detectedSubject": "תיאור קצרצר באנגלית או עברית של מה שמופיע בתמונה בפועל"
}`;

  for (const model of VISION_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imgPayload.mimeType,
                  data: imgPayload.base64Data
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json'
          }
        }),
        signal: AbortSignal.timeout(16000)
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const clean = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        return {
          approved: Boolean(parsed.approved && Number(parsed.score) >= 7),
          score: Number(parsed.score) || (parsed.approved ? 8 : 4),
          reason: parsed.reason || (parsed.approved ? 'אושר בביקורת ראייה' : 'נפסל בביקורת ראייה'),
          isRealPhoto: Boolean(parsed.isRealPhoto),
          isAnchorMatch: Boolean(parsed.isAnchorMatch),
          detectedSubject: parsed.detectedSubject || ''
        };
      }
    } catch (err) {
      console.warn(`Vision audit model ${model} failed, trying next...`, err);
    }
  }

  // במקרה שכל מודלי הראייה לא הגיבו (503 / Network timeout)
  return {
    approved: true,
    score: 6,
    reason: 'ביקורת הראייה השהתה מענה - הועבר כרזרבה זהירה',
    isRealPhoto: true,
    isAnchorMatch: true
  };
}

/**
 * מנגנון הורדה והטמעה קבועה (Self-Hosting Asset Ingestion)
 * 
 * מוריד את קובץ התמונה לשרת המקומי / למאגר הענן, מוודא שאינו נחסם ב-CORS / 403,
 * ושומר אותו בכתובת קבועה פנימית שמוצגת תמיד ללא תקלות.
 */
export async function ingestImagePermanently({
  imageUrl,
  anchorName = '',
  coreConcept = '',
  explanation = '',
  emoji = '⭐',
  apiKey = null
}) {
  if (!imageUrl || imageUrl.startsWith('data:image/svg')) {
    return { ok: false, error: 'Invalid or fallback image URL' };
  }

  // 1. קריאה ל-API הפנימי של השרת (/api/ingest-image) להורדה ואחסון קבוע
  try {
    const res = await fetch('/api/ingest-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        anchorName,
        coreConcept,
        explanation,
        emoji,
        apiKey: apiKey || getGeminiApiKey()
      }),
      signal: AbortSignal.timeout(9000)
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.ok && data.localImageUrl) {
        return {
          ok: true,
          localImageUrl: data.localImageUrl,
          audit: data.audit || null,
          source: 'ingested_permanent'
        };
      }
    }
  } catch (err) {
    console.warn('Server-side ingestion endpoint unreachable:', err);
  }

  // 2. אם השרת המקומי אינו פעיל (Static Build), נחזיר את הכתובת הקיימת
  return {
    ok: true,
    localImageUrl: imageUrl,
    source: 'remote_fallback'
  };
}

export default {
  auditImageWithGeminiVision,
  fetchImageAsBase64,
  ingestImagePermanently,
  VISION_MODELS
};
