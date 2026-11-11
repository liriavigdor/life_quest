import fs from 'fs';
import path from 'path';

const stopWords = new Set([
  'של', 'עם', 'על', 'את', 'כי', 'בתוך', 'כמו', 'וגם', 'גם', 'מאוד', 
  'יותר', 'לפני', 'אחרי', 'בין', 'תחת', 'מעל', 'מול', 'אל', 'מן', 
  'כל', 'כדי', 'באמצעות', 'לפי', 'בזמן', 'בשביל', 'שלא', 'אינו', 
  'אינה', 'היא', 'הוא', 'הם', 'הן', 'זה', 'זו', 'אלה', 'אלו', 
  'וכו', 'לא', 'כן', 'אך', 'רק', 'עד', 'או', 'אם', 'כבר', 'פה', 'שם',
  'אותו', 'אותה', 'אותם', 'אותי', 'אותנו', 'שלו', 'שלה', 'שלהם', 'שלי'
]);

function cleanToken(t) {
  if (!t) return '';
  return t.replace(/[״"'`()\[\]{}.,:;!?\-–—\/\\]+/g, '').trim();
}

function stripHebrewPrefix(word) {
  if (word.length <= 3) return [word];
  const list = [word];
  const prefixes = ['וה', 'שב', 'של', 'מה', 'וכ', 'וב', 'ול', 'ה', 'ב', 'ל', 'כ', 'מ', 'ש', 'ו'];
  for (const p of prefixes) {
    if (word.startsWith(p) && word.length - p.length >= 3) {
      const stripped = word.slice(p.length);
      if (!stopWords.has(stripped)) {
        list.push(stripped);
      }
    }
  }
  return list;
}

function normalizeHebrewMorphology(word) {
  const forms = [word];
  
  // Construct state: e.g., דמעת -> דמעה, חליפת -> חליפה, מכונת -> מכונה
  if (word.endsWith('ת') && !word.endsWith('ות') && !word.endsWith('ית') && word.length >= 4) {
    forms.push(word.slice(0, -1) + 'ה');
  }

  // Plural feminine: e.g., דמעות -> דמעה, חמניות -> חמניה, פטריות -> פטריה, ביקורות -> ביקורת
  if (word.endsWith('ות') && word.length >= 5) {
    if (word.endsWith('יות')) {
      forms.push(word.slice(0, -3) + 'יה'); // פטריות -> פטריה, חמניות -> חמניה
    } else {
      forms.push(word.slice(0, -2) + 'ה');  // דמעות -> דמעה
      forms.push(word.slice(0, -2) + 'ת');  // ביקורות -> ביקורת
    }
  }

  // Plural masculine: e.g., מרקים -> מרק, כובעים -> כובע, ספרים -> ספר
  if (word.endsWith('ים') && !word.endsWith('יים') && word.length >= 5) {
    forms.push(word.slice(0, -2));
  }

  // Dual: e.g., משקפיים -> משקפיים, משקפי, משקף
  if (word.endsWith('יים') && word.length >= 6) {
    forms.push(word.slice(0, -3));
  }

  return forms;
}

export function extractAtomicKeywords(phrases) {
  if (!Array.isArray(phrases)) return [];
  const keywordSet = new Set();
  
  for (const phrase of phrases) {
    if (!phrase || typeof phrase !== 'string') continue;

    const rawTokens = phrase.split(/[,\s+./]+/).map(cleanToken).filter(t => t.length >= 2 && !stopWords.has(t));
    
    // Add compound terms (2 words max)
    for (let i = 0; i < rawTokens.length - 1; i++) {
      const w1 = rawTokens[i];
      const w2 = rawTokens[i+1];
      if (!stopWords.has(w1) && !stopWords.has(w2) && w1.length >= 3 && w2.length >= 3) {
        // Exclude verb-like prefixes
        if (!w1.startsWith('ש') && !w2.startsWith('ש')) {
          keywordSet.add(`${w1} ${w2}`);
          // If first word is construct, also add base noun compound (e.g. מכונת כתיבה -> מכונה כתיבה)
          if (w1.endsWith('ת') && !w1.endsWith('ות') && w1.length >= 4) {
            keywordSet.add(`${w1.slice(0, -1)}ה ${w2}`);
          }
        }
      }
    }
    
    // Add individual words + morphology variations
    for (const raw of rawTokens) {
      const strippedForms = stripHebrewPrefix(raw);
      for (const s of strippedForms) {
        if (!stopWords.has(s) && s.length >= 2) {
          keywordSet.add(s);
          const morphForms = normalizeHebrewMorphology(s);
          for (const m of morphForms) {
            if (m.length >= 2 && !stopWords.has(m)) {
              keywordSet.add(m);
            }
          }
        }
      }
    }
  }

  // Ensure high-priority cognitive anchors are cleanly present
  const list = Array.from(keywordSet);
  if (list.some(k => k.includes('דמע'))) {
    keywordSet.add('דמעה');
    keywordSet.add('דמעות');
    keywordSet.add('בכי');
  }
  if (list.some(k => k.includes('מרק'))) {
    keywordSet.add('מרק');
    keywordSet.add('סיר');
  }
  if (list.some(k => k.includes('שף') || k.includes('טבח'))) {
    keywordSet.add('שף');
    keywordSet.add('טבח');
    keywordSet.add('בישול');
  }

  return Array.from(keywordSet).filter(k => k.length >= 2);
}

// Re-process all files in scripts/catalog_1000/
const catalogDir = './scripts/catalog_1000';
const files = fs.readdirSync(catalogDir).filter(f => f.endsWith('.json'));

let totalConverted = 0;

for (const file of files) {
  const filePath = path.join(catalogDir, file);
  const items = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  for (const item of items) {
    const rawPhrases = item.everyday_associations || item.everydayKeywords || item.associations || [];
    const atomicWords = extractAtomicKeywords(rawPhrases);

    item.everyday_associations = atomicWords;
    if (item.everydayKeywords) item.everydayKeywords = atomicWords;
    totalConverted++;
  }

  fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8');
}

console.log(`Cleanly atomized ${totalConverted} items across all JSON catalog files!`);
