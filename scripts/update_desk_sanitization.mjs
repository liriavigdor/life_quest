import fs from 'fs';

let code = fs.readFileSync('src/components/BulkImageCurationDesk.jsx', 'utf8');

// 1. Add sanitizeLocalEdits helper function before BulkImageCurationDesk definition
const helperFunc = `function sanitizeLocalEditsMap(editsObj) {
  if (!editsObj || typeof editsObj !== 'object') return {};
  const cleaned = {};
  for (const [id, edit] of Object.entries(editsObj)) {
    if (!edit) continue;
    const itemTitle = String(edit.title || '');
    const titleWords = new Set(
      itemTitle.toLowerCase().replace(/[()\\/\\"'’\`\\-]/g, ' ').split(/\\s+/).filter(w => w.length > 1)
    );
    let keywords = Array.isArray(edit.keywords) ? edit.keywords : [];
    keywords = Array.from(new Set(keywords.map(k => String(k).trim()).filter(Boolean)))
      .filter(k => {
        const lk = k.toLowerCase();
        if (lk === itemTitle.toLowerCase()) return false;
        if (titleWords.has(lk)) return false;
        if (lk.includes(' ')) return false;
        if (itemTitle.includes('איטריות') && (lk === 'איטריות' || lk === 'אטריות' || lk === 'נודלס')) return false;
        if (itemTitle.includes('מגדלור') && (lk === 'מגדלור' || lk === 'מגדל-אור')) return false;
        if (itemTitle.includes('פצצה') && lk === 'פצצה') return false;
        return true;
      })
      .slice(0, 4);

    cleaned[id] = {
      ...edit,
      keywords
    };
  }
  return cleaned;
}
`;

if (!code.includes('function sanitizeLocalEditsMap')) {
  code = code.replace('export function BulkImageCurationDesk({', helperFunc + '\nexport function BulkImageCurationDesk({');
  console.log('Added sanitizeLocalEditsMap');
}

// 2. Update initial localEdits state
const oldLocalEditsInit = `  const [localEdits, setLocalEdits] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_staged_local_edits');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });`;

const newLocalEditsInit = `  const [localEdits, setLocalEdits] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_staged_local_edits');
      return saved ? sanitizeLocalEditsMap(JSON.parse(saved)) : {};
    } catch (_) {
      return {};
    }
  });`;

if (code.includes(oldLocalEditsInit)) {
  code = code.replace(oldLocalEditsInit, newLocalEditsInit);
  console.log('Updated localEdits useState init');
}

// 3. Update unifiedItems keywords cleaning logic
const oldCleanKeywords = `      // Clean keywords: unique, non-empty, and omit exact root title
      const cleanKeywords = Array.from(new Set(keywords.map(k => String(k).trim()).filter(Boolean)))
        .filter(k => k.toLowerCase() !== title.toLowerCase());`;

const newCleanKeywords = `      // Clean keywords: unique, non-empty, single-word, no root title overlaps, max 4
      const titleWords = new Set(
        title.toLowerCase().replace(/[()\\/\\"'’\`\\-]/g, ' ').split(/\\s+/).filter(w => w.length > 1)
      );
      const cleanKeywords = Array.from(new Set(keywords.map(k => String(k).trim()).filter(Boolean)))
        .filter(k => {
          const lk = k.toLowerCase();
          if (lk === title.toLowerCase()) return false;
          if (titleWords.has(lk)) return false;
          if (lk.includes(' ')) return false;
          if (title.includes('איטריות') && (lk === 'איטריות' || lk === 'אטריות' || lk === 'נודלס')) return false;
          if (title.includes('מגדלור') && (lk === 'מגדלור' || lk === 'מגדל-אור')) return false;
          if (title.includes('פצצה') && lk === 'פצצה') return false;
          if (title.includes('כדורסל') && lk === 'כדורסל') return false;
          if (title.includes('כדורגל') && lk === 'כדורגל') return false;
          return true;
        })
        .slice(0, 4);`;

if (code.includes(oldCleanKeywords)) {
  code = code.replace(oldCleanKeywords, newCleanKeywords);
  console.log('Updated cleanKeywords in unifiedItems');
} else {
  console.warn('oldCleanKeywords not found verbatim');
}

fs.writeFileSync('src/components/BulkImageCurationDesk.jsx', code, 'utf8');
console.log('BulkImageCurationDesk.jsx updated successfully.');

