import fs from 'node:fs';
import path from 'node:path';
import { CURATED_USER_REPOSITORY_SEED } from '../src/data/curatedUserRepositorySeed.js';
import { STAGED_IMAGES_POOL } from '../src/data/stagedImagesPool.js';
import { validateBranches } from './branch_validator.mjs';

const stateFile = 'public/data/user_curation_state.json';
let state = { discardedIds: [], localEdits: {} };
if (fs.existsSync(stateFile)) {
  try {
    state = JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch (err) {
    console.warn('Failed to parse user_curation_state.json:', err.message);
  }
}

const discarded = new Set(state.discardedIds || []);
const localEdits = state.localEdits || {};

const allMap = new Map();

// 1. Curated seed
for (const item of CURATED_USER_REPOSITORY_SEED) {
  if (discarded.has(item.id)) continue;
  allMap.set(item.id, {
    id: item.id,
    title: item.title || item.name,
    category: item.category || 'כללי',
    branches: Array.isArray(item.keywords) ? [...item.keywords] : []
  });
}

// 2. Staged pool overlay
for (const item of STAGED_IMAGES_POOL) {
  if (discarded.has(item.id)) {
    allMap.delete(item.id);
    continue;
  }
  const existing = allMap.get(item.id);
  const title = item.suggestedName || item.name_he || item.name || existing?.title || item.id;
  const branches = item.curatedEverydayKeywords || item.everyday_associations || item.keywords || existing?.branches || [];
  if (!existing) {
    allMap.set(item.id, {
      id: item.id,
      title,
      category: item.category || 'כללי',
      branches: Array.isArray(branches) ? [...branches] : []
    });
  }
}

// 3. Local edits overlay
for (const [id, edit] of Object.entries(localEdits)) {
  if (discarded.has(id)) continue;
  if (allMap.has(id)) {
    const item = allMap.get(id);
    if (edit.title) item.title = edit.title;
    if (Array.isArray(edit.keywords)) item.branches = [...edit.keywords];
  }
}

const items = Array.from(allMap.values()).sort((a, b) => a.title.localeCompare(b.title, 'he'));

// Calculate branch analytics
const branchToRoots = new Map();
let totalBranchSlots = 0;
const validationIssues = [];

for (const item of items) {
  const overlaps = validateBranches(item.title, item.branches);
  if (overlaps.length > 0) {
    validationIssues.push({
      id: item.id,
      title: item.title,
      type: 'overlap',
      details: overlaps
    });
  }

  const multiWordBranches = item.branches.filter(b => String(b).trim().includes(' '));
  if (multiWordBranches.length > 0) {
    validationIssues.push({
      id: item.id,
      title: item.title,
      type: 'multi_word',
      details: multiWordBranches
    });
  }

  for (const b of item.branches) {
    const cleanB = String(b).trim();
    if (!cleanB) continue;
    totalBranchSlots++;
    if (!branchToRoots.has(cleanB)) {
      branchToRoots.set(cleanB, []);
    }
    branchToRoots.get(cleanB).push(item.title);
  }
}

// Group branches by count
const branchesWithCount = Array.from(branchToRoots.entries()).map(([branch, roots]) => ({
  branch,
  count: roots.length,
  roots
})).sort((a, b) => b.count - a.count || a.branch.localeCompare(b.branch, 'he'));

const saturatedBranches = branchesWithCount.filter(b => b.count >= 5);
const nearSaturated = branchesWithCount.filter(b => b.count >= 3 && b.count < 5);
const lowBranches = branchesWithCount.filter(b => b.count === 1 || b.count === 2);

// Group items by category
const categoryMap = new Map();
for (const item of items) {
  const cat = item.category || 'כללי';
  if (!categoryMap.has(cat)) categoryMap.set(cat, []);
  categoryMap.get(cat).push(item);
}

// Build JSON payload
const jsonPayload = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalActiveRoots: items.length,
    totalUniqueBranches: branchToRoots.size,
    totalBranchConnections: totalBranchSlots,
    averageBranchesPerRoot: (totalBranchSlots / items.length).toFixed(2),
    saturatedBranchesCount: saturatedBranches.length,
    nearSaturatedBranchesCount: nearSaturated.length,
    lowBranchesCount: lowBranches.length,
    validationIssuesCount: validationIssues.length
  },
  branchesRanked: branchesWithCount.map(b => ({ branch: b.branch, count: b.count })),
  roots: items
};

fs.writeFileSync('life_quest_repository_manifest.json', JSON.stringify(jsonPayload, null, 2), 'utf8');
console.log('Saved life_quest_repository_manifest.json');

// Build Markdown Manifest
let md = `# מניפסט מאגר הזיכרון והעוגנים — Life Quest
**תאריך יצירה:** ${new Date().toLocaleDateString('he-IL')}  
**סה"כ שורשים (עוגנים חזותיים) פעילים:** ${items.length}  
**סה"כ ענפים (מילות מפתח למשימות) ייחודיים:** ${branchToRoots.size}  
**ממוצע ענפים לשורש:** ${(totalBranchSlots / items.length).toFixed(2)}  

---

## 🧭 רקע לפרויקט והנחיות לבינה המבקרת (Reviewing AI Prompt)
קובץ זה מיועד לניתוח ביקורתי של מאגר הזיכרון של המשחק **Life Quest** לצורך גיבוש **תוכנית עבודה מפורטת להרחבת המאגר**.

### מהו Life Quest?
משחק ארמון זיכרון וניהול משימות 2.5D. המשתמש מזין משימות יומיומיות אמיתיות (למשל: "להזמין תור לרופא שיניים", "לקנות חלב", "לתקן סתימה בכיור").
המערכת פועלת בארכיטקטורה דו-שכבתית:
1. **שורשים (Roots):** עוגנים חזותיים / אייקונים תרבותיים / חפצים מוחשיים בלתי נשכחים (למשל: *סופר מריו*, *דרקולה*, *כיכר לחם כפרי*, *מגדל פיזה*).
2. **ענפים (Branches):** מילות עוגן למשימות יומיומיות (למשל למריו: *אינסטלטור, סתימה, ברז*; לדרקולה: *שיניים, שיננית, רופא*).

### חוקי הברזל של הפרויקט:
1. **"מבחן רשימת המטלות" (The To-Do List Test):** אסור לתייג טריוויה פסיבית (כמו "קיפוד, כחול" לסוניק). חובה לתייג מטלות אנושיות אמיתיות שהמשתמש רוצה לזכור (סוניק = *תספורת, מספרה, ספר*).
2. **כלל המילה הבודדת (Single-Token Rule):** כל ענף הוא מילה אחת בלבד בעברית תקנית, ללא רווחים, ללא מקפים.
3. **אפס חפיפה (Anti-Overlap):** ענף לא יכול לחזור על מילה משם השורש.
4. **יעד הכיסוי (5 Roots Per Task):** המטרה היא שעבור כל משימת חיים שכיחה, יהיו לפחות **5 שורשים שונים** במאגר שמכסים אותה, כדי שהמשחק ישלוף 5 עוגנים מיידית (0ms) ללא צורך בקריאות רשת או API.

---

## 🎯 שאלות מנחות לבינה המבקרת לגיבוש תוכנית העבודה:
1. **איתור פערים קריטיים (Gap Analysis):** אילו עולמות תוכן ומשימות חיים נפוצות (בריאות, תחזוקת בית, כספים ובירוקרטיה, רכב, הורות, קניות, טיפוח, עבודה ולימודים) חסרות לחלוטין או בעלות כיסוי דל (פחות מ-5 שורשים)?
2. **בקרת איכות (Quality & Sanitation):** זהה ענפים שאינם עומדים בכלל המילה הבודדת, ענפים פסיביים שאינם מטלות, או שורשים לא ברורים.
3. **תוכנית פעולה מדורגת (Actionable Roadmap):** הצע באצ'ים ספציפיים של 20–50 שורשים חדשים (עם הצעות לענפים בכלל המילה הבודדת) שיביאו למקסימום תועלת וכיסוי של המשימות היומיומיות השכיחות ביותר.

---

## 📊 סטטיסטיקות כיסוי נוכחיות

### ענפים בכיסוי מלא (5 שורשים ומעלה) — ${saturatedBranches.length} ענפים
משימות אלו כבר נשלפות ב-0ms בתוך המשחק עם 5 אפשרויות מלאות:
${saturatedBranches.slice(0, 30).map(b => `- **${b.branch}** (${b.count} שורשים): ${b.roots.slice(0, 5).join(', ')}${b.roots.length > 5 ? '...' : ''}`).join('\n')}

### ענפים בכיסוי חלקי (3-4 שורשים) — ${nearSaturated.length} ענפים (צריכים רק 1-2 שורשים נוספים לסגירה!)
${nearSaturated.slice(0, 30).map(b => `- **${b.branch}** (${b.count} שורשים): ${b.roots.join(', ')}`).join('\n')}

### ענפים בכיסוי ראשוני בלבד (1-2 שורשים) — ${lowBranches.length} ענפים
מילים אלו נכנסו למאגר אך חסרים להן 3-4 שורשים נוספים להשלמת חמישייה. דוגמאות בולטות:
${lowBranches.slice(0, 40).map(b => `- \`${b.branch}\` (${b.count}): ${b.roots.join(', ')}`).join('\n')}

---

## ⚠️ ממצאי בדיקות תקינות (Validation Flags) — ${validationIssues.length} פריטים
${validationIssues.length === 0 ? 'כל הפריטים עומדים בכללי התקינות!' : validationIssues.slice(0, 25).map(v => {
  if (v.type === 'overlap') {
    return `- **${v.title}**: חפיפה בין השורש לענף (${v.details.map(d => `${d.branch} ↔ ${d.matchedRootWord}`).join(', ')})`;
  }
  return `- **${v.title}**: ענף המכיל יותר ממילה אחת (${v.details.join(', ')})`;
}).join('\n')}

---

## 🗂️ פירוט מלא של כל ${items.length} השורשים והענפים (לפי קטגוריות)

`;

for (const [cat, catItems] of Array.from(categoryMap.entries()).sort((a, b) => a[0].localeCompare(b[0], 'he'))) {
  md += `### קטגוריה: ${cat} (${catItems.length} פריטים)\n\n`;
  for (const it of catItems) {
    const branchesStr = it.branches.length > 0 ? it.branches.map(b => `\`${b}\``).join(', ') : '_ללא ענפים_';
    md += `- **${it.title}** \`[${it.id}]\` ➔ ענפים: ${branchesStr}\n`;
  }
  md += '\n';
}

fs.writeFileSync('LIFE_QUEST_REPOSITORY_MANIFEST.md', md, 'utf8');
console.log('Saved LIFE_QUEST_REPOSITORY_MANIFEST.md');

