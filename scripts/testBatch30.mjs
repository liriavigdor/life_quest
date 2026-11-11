import fs from 'fs';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
const apiKey = match[1].trim();

const items = STAGED_IMAGES_POOL.slice(0, 30);

const prompt = `אתה מומחה מדע קוגניטיבי, בלשנות עברית וארכיטקטורת זיכרון אסוציאטיבית (Memory Champion).
תפקידך: להפיק בדיוק 8-10 ענפים (Branches) אסוציאטיביים מובהקים בעברית לכל פריט.
חוקים:
1. שמות עצם נרדפים וישירים חובה (מדחום כספית -> מדחום, תרמומטר).
2. עוגנים חושיים משותפים: דברים שמשדרים חום (תנור, שמש, מדבר, קקטוס, מדחום, אש, לבה) - כולם כוללים 'חום'!
3. תרבות, גיימינג ואנימה: פיקאצ'ו -> אנימה, פוקימון, יפן, חשמל. סוניק -> משחק, קיפוד.
4. נקה סתירות: אל תשים 'חום' על מניפה (מניפה = קירור, אוורור).

פריטים:
${JSON.stringify(items.map(p => ({ id: p.id, name: p.name_he || p.name })), null, 2)}

החזר אך ורק מערך JSON תקין:
[
  { "id": "id הפריט", "branches": ["ענף1", "ענף2", "ענף3", "ענף4", "ענף5", "ענף6", "ענף7", "ענף8"] }
]`;

const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`, {
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

console.log('Status:', res.status);
if (res.ok) {
  const d = await res.json();
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(text);
  console.log('Successfully received', parsed.length, 'items!');
  console.log('Sample item 0:', parsed[0]);
  console.log('Sample item 1:', parsed[1]);
} else {
  console.log(await res.text());
}

