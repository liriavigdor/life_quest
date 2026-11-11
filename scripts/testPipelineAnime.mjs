import { agent1ExtractBranchesAndSearch, agent2SearchRootAndCompleteFromWeb } from '../src/utils/mnemonicPipelineOrchestrator.js';

async function test() {
  console.log('--- בדיקת המשימה: "ללכת לכנס אנימה" ---');
  const res1 = await agent1ExtractBranchesAndSearch('ללכת לכנס אנימה');
  console.log('Keyword:', res1.branchKeyword);
  console.log('Candidates count:', res1.branchCandidates.length);
  res1.branchCandidates.forEach((c, idx) => console.log(`${idx + 1}. ${c.anchorName} (${c.source}) -> ${c.imageUrl}`));
}

test();

