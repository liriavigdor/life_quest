import { agent1ExtractBranchesAndSearch, agent2SearchRootAndCompleteFromWeb } from '../src/utils/mnemonicPipelineOrchestrator.js';

async function test() {
  console.log('--- בדיקת המשימה: "להחזיר את המדחום" ---');
  const res1 = await agent1ExtractBranchesAndSearch('להחזיר את המדחום');
  console.log('Keyword:', res1.branchKeyword);
  console.log('Reserve associations:', res1.reserveAssociations.map(a => a.anchorName));
  console.log('Branch Candidates count:', res1.branchCandidates.length);
  res1.branchCandidates.forEach((c, idx) => console.log(`${idx + 1}. ${c.anchorName} (${c.source}) -> ${c.imageUrl}`));

  console.log('\n--- בדיקת סוכן 2 (השלמת רשת/שורש אם נדרש): ---');
  const finalCandidates = await agent2SearchRootAndCompleteFromWeb(res1, 'להחזיר את המדחום');
  finalCandidates.forEach((c, idx) => console.log(`${idx + 1}. ${c.anchorName} (${c.source}) -> ${c.imageUrl}`));
}

test();

