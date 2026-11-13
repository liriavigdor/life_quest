import { processTaskListWithSynergy } from '../src/utils/mnemonicPipelineOrchestrator.js';

const testList = [
  'להחזיר מכנסיים ליהושוע ברביעי',
  'ללכת להסתפר אצל משה',
  'להזמין אינסטלטור לסתימה במקלחת',
  'לשחק כדורגל עם החבר\'ה בשישי',
  'לקנות נעליים חדשות',
  'להכין חביתה לילד'
];

console.log('Running processTaskListWithSynergy on real tasks...\n');
const result = await processTaskListWithSynergy(testList);

console.log(`Grand Finale Story:\n${result.grandFinaleStory}\n`);
console.log('Stations Breakdown:');
for (const st of result.stations) {
  console.log(`\n[תחנה ${st.order}] משימה: "${st.title}"`);
  console.log(`  - ענף שחולץ: "${st.coreConcept}"`);
  console.log(`  - עוגן שנבחר: "${st.associationWord}" (${st.emoji})`);
  console.log(`  - תמונה: ${st.imageUrl}`);
  console.log(`  - הסבר: ${st.story}`);
  console.log(`  - מספר מועמדים ברשימה: ${st.candidates?.length}`);
  if (st.candidates?.length > 1) {
    console.log(`    חלופות מוכנות: ${st.candidates.slice(1).map(c => `"${c.anchorName}" (${c.source})`).join(', ')}`);
  }
}

