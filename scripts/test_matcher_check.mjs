import { findBestUserImagesForTask } from '../src/utils/userImageRepository.js';

const keywords = [
  'כדורגל',
  'תספורת',
  'אינסטלטור',
  'מכנסיים',
  'שיניים',
  'חלב',
  'חביתה',
  'נעליים'
];

console.log('------------------------------------------------------------');
console.log('סוכן 1 (Agent 1) - בדיקת סריקת ענפים (Branches Search בלבד, ללא החפץ עצמו!):');
console.log('------------------------------------------------------------');
for (const kw of keywords) {
  const matches = findBestUserImagesForTask(kw, 3, { mode: 'branches' });
  console.log(`\n🎯 Task Branch: "${kw}"`);
  for (const m of matches) {
    console.log(`   ➔ Title: "${m.title || m.name}" (${m.id}) | Branches: [${(m.keywords || []).slice(0, 5).join(', ')}]`);
  }
}

console.log('\n------------------------------------------------------------');
console.log('סוכן 2 (Agent 2) - בדיקת סריקת שורשים (Root Search לאסוציאציה שהופקה):');
console.log('------------------------------------------------------------');
const associations = ['שער כדורגל', 'מספריים', 'כרטיס אדום', 'תרנגול', 'כריש'];
for (const assoc of associations) {
  const matches = findBestUserImagesForTask(assoc, 2, { mode: 'roots' });
  console.log(`\n🔍 Reserve Association: "${assoc}"`);
  for (const m of matches) {
    console.log(`   ➔ Title: "${m.title || m.name}" (${m.id})`);
  }
}
