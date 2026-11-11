import { agent1ExtractBranchesAndSearch, agent2SearchRootAndCompleteFromWeb } from '../src/utils/mnemonicPipelineOrchestrator.js';

async function test() {
  console.log('--- בדיקת "לנקות את החדר" ---');
  const r1 = await agent1ExtractBranchesAndSearch('לנקות את החדר');
  console.log('Keyword:', r1.branchKeyword);
  console.log('Candidate count:', r1.branchCandidates.length);
  r1.branchCandidates.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.anchorName} (${c.source}) -> ${c.imageUrl}`);
  });

  console.log('\n--- בדיקת סוכן 2: ---');
  const finalCandidates = await agent2SearchRootAndCompleteFromWeb(r1, 'לנקות את החדר');
  finalCandidates.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.anchorName} (${c.source}) -> ${c.imageUrl}`);
  });
}

test();

