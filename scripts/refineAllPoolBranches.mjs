import fs from 'fs';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';

const env = fs.readFileSync('.env', 'utf8');
const match = env.match(/VITE_GEMINI_API_KEY=(.*)/);
if (!match) {
  console.error('API key not found in .env');
  process.exit(1);
}
const apiKey = match[1].trim();

async function callGeminiBatch(items, batchIndex, totalBatches) {
  const prompt = `אתה מומחה מדע קוגניטיבי, בלשנות עברית וארכיטקטורת זיכרון אסוציאטיבית (Memory Champion).
תפקידך: לדייק ולייצר "ענפים" (Branches / Associations) עבור מאגר תמונות ארמון הזיכרון (Loci Method).
כל תמונה מורכבת מ"שורש" (נושא התמונה) ו"ענפים" (רשת אסוציאציות יומיומיות שדרכן המשתמש ישלוף את התמונה).

חוקים קוגניטיביים מחייבים:
1. שמות עצם נרדפים וישירים חובה: אם השורש הוא "מד חום כספית", הענפים חייבים לכלול: "מדחום", "מד חום", "תרמומטר". אם השורש הוא "כיכר לחם", הענפים: "לחם", "מאפה", "בגט", "מאפייה".
2. עוגנים תמטיים חושיים משותפים: דברים שמשדרים חום (תנור, שמש, מדבר, קקטוס, מדחום, לבה, אש) - כולם חייבים לכלול את הענף "חום"! דברים של קור (קרחון, איגלו, שלג, מקרר) - כולם כוללים "קור".
3. מושגי תרבות, גיימינג וזיהוי מובהקים:
   - פיקאצ'ו -> חייב "אנימה", "פוקימון", "חשמל", "יפן".
   - סוניק -> "משחק", "גיימינג", "קיפוד", "מהירות".
   - כדורגלנים -> "כדורגל", "ספורט", "משחק", "גול".
4. משימות יומיומיות: לקשר לפעולות אמיתיות שהאדם רושם ברשימות (רופא, קניות, בישול, מוסך, בנק, טיסה, דואר, כביסה, ניקיון, לימודים, פגישה).
5. נקה אסוציאציות מטעות או סותרות: אל תשים "חום" על מניפה (מניפה זה "אוורור", "קירור", "רוח", "קיץ"). אל תשים "כנס" על שטיח אדום באופן שיבלע כנס אנימה.

הפריטים לעיבוד במקבץ זה (${items.length} פריטים):
${JSON.stringify(items.map(p => ({
  id: p.id,
  num: p.num,
  name: p.name_he || p.name,
  category: p.category,
  currentAssociations: p.associations
})), null, 2)}

החזר אך ורק מערך JSON תקין (ללא שום markdown מסביב, ללא הערות, אך ורק JSON raw):
[
  {
    "id": "מזהה הפריט",
    "branches": ["ענף1", "ענף2", "ענף3", "ענף4", "ענף5", "ענף6", "ענף7", "ענף8", "ענף9", "ענף10"]
  }
]`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  
  let attempts = 0;
  while (attempts < 3) {
    try {
      attempts++;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        }),
        signal: AbortSignal.timeout(30000)
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[Batch ${batchIndex}/${totalBatches}] Attempt ${attempts} failed: HTTP ${res.status}`);
        if (attempts >= 3) throw new Error(errText);
        await new Promise(r => setTimeout(r, 2000 * attempts));
        continue;
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      throw new Error('Response is not an array');
    } catch (err) {
      if (attempts >= 3) {
        console.error(`[Batch ${batchIndex}/${totalBatches}] Error:`, err.message);
        return [];
      }
      await new Promise(r => setTimeout(r, 2000 * attempts));
    }
  }
  return [];
}

async function main() {
  console.log(`Starting Cognitive Branch Refinement for ${STAGED_IMAGES_POOL.length} items...`);
  
  // גיבוי הקובץ המקורי
  fs.copyFileSync('src/data/stagedImagesPool.js', 'src/data/stagedImagesPool.backup.js');
  console.log('Created backup at src/data/stagedImagesPool.backup.js');

  const BATCH_SIZE = 20;
  const totalBatches = Math.ceil(STAGED_IMAGES_POOL.length / BATCH_SIZE);
  const refinedMap = new Map();

  for (let i = 0; i < STAGED_IMAGES_POOL.length; i += BATCH_SIZE) {
    const batch = STAGED_IMAGES_POOL.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE) + 1;
    console.log(`Processing Batch ${batchIndex}/${totalBatches} (${batch.length} items)...`);

    const refinedBatch = await callGeminiBatch(batch, batchIndex, totalBatches);
    for (const item of refinedBatch) {
      if (item && item.id && Array.isArray(item.branches) && item.branches.length > 0) {
        // מנקים כפילויות ורווחים
        const cleanBranches = Array.from(new Set(item.branches.map(b => String(b).trim()).filter(Boolean)));
        refinedMap.set(item.id, cleanBranches);
      }
    }

    // הפסקה קטנה כדי למנוע חריגת rate-limit
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`Refined branches for ${refinedMap.size} items! Merging into pool...`);

  let updatedCount = 0;
  const updatedPool = STAGED_IMAGES_POOL.map(item => {
    if (refinedMap.has(item.id)) {
      const newBranches = refinedMap.get(item.id);
      updatedCount++;
      return {
        ...item,
        associations: newBranches,
        everyday_associations: newBranches
      };
    }
    return item;
  });

  const fileContent = `// Auto-generated Staged Images Pool (Cognitively Refined by Gemini 3.5 Flash)\nexport const STAGED_IMAGES_POOL = ${JSON.stringify(updatedPool, null, 2)};\n`;
  fs.writeFileSync('src/data/stagedImagesPool.js', fileContent, 'utf8');
  console.log(`SUCCESS! Updated ${updatedCount} items in src/data/stagedImagesPool.js.`);
}

main().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

