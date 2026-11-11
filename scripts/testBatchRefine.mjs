import fs from 'fs';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
if (!match) {
  console.error('API key not found in .env');
  process.exit(1);
}
const apiKey = match[1].trim();

async function callGeminiBatch(items) {
  const prompt = `אתה מומחה מדע קוגניטיבי, בלשנות עברית וארכיטקטורת זיכרון (Memory Champion).
תפקידך: לדייק ולייצר "ענפים" (Branches / Associations) עבור מאגר תמונות ארמון הזיכרון.
כל תמונה מורכבת מ"שורש" (נושא התמונה) ו"ענפים" (רשת אסוציאציות יומיומיות שדרכן המשתמש ישלוף את התמונה).

חוקים קוגניטיביים מחייבים:
1. שמות עצם נרדפים וישירים חובה: אם השורש הוא "מד חום כספית", הענפים חייבים לכלול: "מדחום", "מד חום", "תרמומטר".
2. עוגנים תמטיים חושיים משותפים: דברים שמשדרים חום (תנור, שמש, מדבר, קקטוס סאגוארו, מדחום, לבה) - כולם חייבים לכלול את הענף "חום"!
3. מושגי תרבות וזיהוי מובהקים: פיקאצ'ו -> חייב לכלול "אנימה", "פוקימון", "יפן", "חשמל". סוניק -> "משחק", "גיימינג", "קיפוד", "מהירות".
4. משימות יומיומיות: לקשר לפעולות אמיתיות שהאדם עושה (למשל: רופא, בדיקה, מאפייה, תספורת).
5. נקה אסוציאציות מטעות או סותרות: אל תשים "חום" על מניפה (מניפה זה "אוורור", "קירור", "רוח", "קיץ").

הפריטים לעיבוד כעת:
${JSON.stringify(items.map(p => ({
  id: p.id,
  num: p.num,
  name: p.name_he || p.name,
  category: p.category,
  currentAssociations: p.associations
})), null, 2)}

החזר אך ורק מערך JSON תקין (ללא markdown וללא שום טקסט עודף):
[
  {
    "id": "מזהה הפריט",
    "branches": ["ענף1", "ענף2", "ענף3", "ענף4", "ענף5", "ענף6", "ענף7", "ענף8", "ענף9", "ענף10"]
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json"
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  return JSON.parse(rawText);
}

// בדיקת הרצה על 5 פריטי מפתח כולל מדחום, קקטוס סאגוארו, פיקאצ'ו, מניפה יפנית
const testItems = STAGED_IMAGES_POOL.filter(p => 
  p.id === 'item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל' ||
  p.id === 'item_251_קקטוס_סאגוארו' ||
  p.id === 'item_167_שטיח_אדום_ארוך__מסמל' ||
  p.id === 'japanese_folding_fan' ||
  p.num === 3
);

console.log('Testing with 5 items...');
const result = await callGeminiBatch(testItems);
console.log('Result:');
console.log(JSON.stringify(result, null, 2));

