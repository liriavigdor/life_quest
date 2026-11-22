import fs from 'fs';
import { getUserImagesSync } from '../src/utils/userImageRepository.js';

const rawState = fs.readFileSync('public/data/user_curation_state.json', 'utf8');
const state = JSON.parse(rawState);
const localEdits = state.localEdits || {};

const items = getUserImagesSync();

const enriched = items.map(item => {
  const edit = localEdits[item.id];
  const title = edit?.title || item.title || item.name || '';
  const keywords = edit?.keywords !== undefined ? edit.keywords : (item.keywords || []);
  const category = item.category || 'כללי';
  const imageFilename = item.imageUrl ? item.imageUrl.split('/').pop() : '';
  return {
    id: item.id,
    title,
    keywords,
    category,
    imageUrl: item.imageUrl || '',
    imageFilename
  };
});

// Sort by category then title
enriched.sort((a, b) => a.category.localeCompare(b.category, 'he') || a.title.localeCompare(b.title, 'he'));

// 1. Generate Markdown File
let md = '# מאגר עוגנים וענפים (Mnemonic Repository Audit) - LifeQuest\n\n';
md += 'קובץ זה מיועד לניתוח מעמיק ב-**Google NotebookLM** או במודלי שפה לאיתור טעויות, פערים, סתירות וכפילויות במאגר התמונות והזיכרון.\n\n';
md += '## 📌 מודל הנתונים של המאגר\n';
md += '* **שורש (Root / Anchor):** האובייקט הוויזואלי המובהק (למשל: סכין שף, כרטיס אדום, שרק, מגדל אייפל).\n';
md += '* **ענפים (Branches / Keywords):** 1 עד 5 אסוציאציות יומיומיות, משימות או מושגים מובהקים שמקושרים לשורש (הכרטיס נשלף כשאחת ממילות אלו מופיעה במשימת המשתמש).\n';
md += '* **קובץ תמונה (Image Filename):** שם קובץ התמונה המשויך לעוגן (מסייע לוודא התאמה ויזואלית לשם העוגן).\n\n';
md += `סה"כ פריטים פעילים במאגר: **${enriched.length}**\n\n`;

md += '## 🔍 פרומפטים מומלצים להזנה ב-NotebookLM לאחר העלאת הקובץ:\n\n';
md += '1. **איתור חוסרים ועוגנים ריקים:**\n';
md += '   > "זהה את כל העוגנים במאגר שיש להם 0 ענפים או ענף בודד בלבד. עבור כל אחד מהם, הצע 3-4 ענפים יומיומיים מובהקים וקליטים בהתאם למהות העוגן."\n\n';
md += '2. **איתור סתירות ואי-התאמות בין שם העוגן לענפים:**\n';
md += '   > "סרוק את כל הרשומות: האם קיימים ענפים שאינם הגיוניים, מנוגדים או מוזרים ביחס לשם העוגן (למשל צבע לא נכון, תחום שגוי)? ציין את המזהה ואת הענף הבעייתי."\n\n';
md += '3. **איתור פערים בין שם העוגן לשם קובץ התמונה:**\n';
md += '   > "השווה בין שם העוגן (Title) לבין שם קובץ התמונה (Image Filename). האם יש מקרים של אי-התאמה ברורה בין התמונה לעוגן (כמו עוגן אדום כשהקובץ הוא צהוב)?"\n\n';
md += '4. **איתור כפילויות סמנטיות ועומס ענפים:**\n';
md += '   > "אילו ענפים חוזרים על עצמם ביותר מדי עוגנים שונים ויכולים לייצר התנגשות בשליפה? באילו מקרים כדאי להשאיר את הענף רק לעוגן המובהק ביותר?"\n\n';
md += '5. **סקירת קטגוריות:**\n';
md += '   > "דרג את הקטגוריות השונות לפי מידת הכיסוי שלהן. אילו קטגוריות מושלמות ומדויקות, ובאילו קטגוריות יש כרטיסים שדורשים ליטוש?"\n\n';
md += '---\n\n';

// Group by category
const categories = {};
for (const item of enriched) {
  if (!categories[item.category]) categories[item.category] = [];
  categories[item.category].push(item);
}

for (const [cat, catItems] of Object.entries(categories)) {
  md += `## 📂 קטגוריה: ${cat} (${catItems.length} פריטים)\n\n`;
  md += '| מזהה (ID) | שם העוגן (שורש) | ענפים מקושרים | כמות | קובץ תמונה |\n';
  md += '| :--- | :--- | :--- | :---: | :--- |\n';
  for (const it of catItems) {
    const kwStr = it.keywords.length > 0 ? it.keywords.join(', ') : '*(ללא ענפים)*';
    md += `| \`${it.id}\` | **${it.title}** | ${kwStr} | ${it.keywords.length} | \`${it.imageFilename}\` |\n`;
  }
  md += '\n';
}

fs.writeFileSync('notebooklm_repository_audit.md', md, 'utf8');
console.log('Successfully generated notebooklm_repository_audit.md');

// 2. Generate CSV File with UTF-8 BOM
let csv = 'ID,Title,Category,BranchCount,Branches,ImageFilename\n';
for (const it of enriched) {
  const cleanBranches = it.keywords.join('; ');
  csv += `"${it.id}","${it.title.replace(/"/g, '""')}","${it.category.replace(/"/g, '""')}",${it.keywords.length},"${cleanBranches}","${it.imageFilename}"\n`;
}
fs.writeFileSync('notebooklm_repository_data.csv', '\uFEFF' + csv, 'utf8');
console.log('Successfully generated notebooklm_repository_data.csv');

