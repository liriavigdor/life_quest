import fs from 'fs';
import path from 'path';

// 1. Load .env
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
} catch (e) {
  console.warn('Could not load .env file', e);
}

// 2. Fetch polyfill to route /api/... to Vite dev server (http://localhost:5175)
const originalFetch = globalThis.fetch;
globalThis.fetch = function(url, init) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = `http://localhost:5175${url}`;
  }
  return originalFetch(url, init);
};

// 3. Mock localStorage/window if needed
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: {
      getItem: (k) => process.env[k] || null,
      setItem: () => {},
      removeItem: () => {}
    }
  };
}

import { processTaskListChronologically } from '../src/utils/mnemonicPipelineOrchestrator.js';

const TEST_TASKS = [
  'להזמין כרטיסים להופעה של עומר אדם',
  'לקחת את הרכב לבדיקת בלמים וטסט',
  'להכין מצגת תקציב רבעוני למנכ"ל',
  'לקנות מתנה ליום הולדת של שירה',
  'לתקן את המזגן המטפטף בסלון'
];

async function runAutonomousSimulation() {
  console.log('====================================================');
  console.log('🤖 STARTING AUTONOMOUS CUSTOMER SIMULATION & CRITIQUE');
  console.log('====================================================\n');
  console.log('Customer Task List:');
  TEST_TASKS.forEach((t, i) => console.log(`  ${i + 1}. "${t}"`));
  console.log('\n----------------------------------------------------');

  const startTime = Date.now();
  let firstReadyTime = null;
  const readyStations = [];

  const result = await processTaskListChronologically(TEST_TASKS, {
    onFirstReady: (payload) => {
      firstReadyTime = Date.now() - startTime;
      const s1 = payload?.stations?.[0] || payload;
      console.log(`\n⚡ [STREAMING EVENT] Station #1 is READY in ${firstReadyTime}ms!`);
      console.log(`   Title: "${s1.title}"`);
      console.log(`   Anchor: "${s1.associationWord}" (${s1.emoji})`);
      console.log(`   Image URL: ${s1.imageUrl}`);
      console.log(`   Source: ${s1.hasRepositoryImage ? 'Curated/Pool Image' : 'Web/Fallback'}`);
    },
    onStationReady: (st, idx) => {
      const elapsed = Date.now() - startTime;
      readyStations.push(st);
      console.log(`\n📍 [STATION #${idx + 1} READY] (+${elapsed}ms)`);
      console.log(`   Task: "${st.title}"`);
      console.log(`   Core Concept: "${st.coreConcept}"`);
      console.log(`   Association Anchor: "${st.associationWord}" (${st.emoji})`);
      console.log(`   Reasoning: "${st.explanation || st.story || ''}"`);
      console.log(`   Candidates Count: ${st.candidates?.length || 0}`);
      st.candidates?.forEach((c, cIdx) => {
        console.log(`     [Cand ${cIdx + 1}] "${c.anchorName}" -> ${c.imageUrl?.slice(0, 70)}... (${c.source || 'pool'})`);
      });
    },
    onAllDone: ({ stations, grandFinaleStory }) => {
      const totalElapsed = Date.now() - startTime;
      console.log(`\n✨ [ALL DONE] Processed all ${stations.length} stations in ${totalElapsed}ms`);
      console.log(`📖 Grand Finale Story: "${grandFinaleStory}"\n`);
    }
  });

  console.log('====================================================');
  console.log('🔍 INITIATING RUTHLESS COGNITIVE CRITIQUE AUDIT');
  console.log('====================================================\n');

  const auditReport = {
    firstReadyLatencyMs: firstReadyTime,
    totalLatencyMs: Date.now() - startTime,
    stationsAudit: [],
    storyAudit: {},
    overallScore: 100,
    flawsFound: [],
    remediationsApplied: []
  };

  // 1. Audit Station 1 Fast-Path
  if (firstReadyTime > 8000) {
    auditReport.overallScore -= 15;
    auditReport.flawsFound.push(`Station 1 took ${firstReadyTime}ms (should be < 5000ms for instant walking entry)`);
  }

  // 2. Audit each station
  for (let i = 0; i < result.stations.length; i++) {
    const st = result.stations[i];
    const task = TEST_TASKS[i];
    const flaws = [];

    // Rule A: Associative Leap (Generation Effect)
    // The anchor shouldn't be identical to the raw task verb
    if (st.associationWord === task) {
      flaws.push('Anchor is identical to full raw task text (No associative leap)');
    }

    // Rule B: Did it strip personal names?
    if (task.includes('שירה') && st.associationWord?.includes('שירה')) {
      flaws.push('Personal name "שירה" was preserved in anchor instead of focusing on birthday/gift');
    }

    // Rule C: Image validity
    if (!st.imageUrl) {
      flaws.push('No image URL assigned to station');
    } else if (st.imageUrl.startsWith('data:image/svg')) {
      flaws.push('Fell back to SVG (no photographic candidate approved)');
    }

    // Rule D: Max candidates constraint
    if (st.candidates && st.candidates.length > 3) {
      flaws.push(`Station has ${st.candidates.length} candidates (exceeds max 3 limit)`);
    }

    const stationScore = Math.max(0, 10 - (flaws.length * 3));
    auditReport.stationsAudit.push({
      stationNumber: i + 1,
      task,
      coreConcept: st.coreConcept,
      anchor: st.associationWord,
      imageUrl: st.imageUrl,
      score: stationScore,
      flaws
    });

    if (flaws.length > 0) {
      auditReport.flawsFound.push(`Station ${i + 1} flaws: ${flaws.join('; ')}`);
      auditReport.overallScore -= (flaws.length * 5);
    }
  }

  // 3. Audit The Grand Finale Story
  const story = result.grandFinaleStory || '';
  const storyFlaws = [];
  if (!story) {
    storyFlaws.push('Grand Finale Story is completely empty');
  } else {
    // Single sentence check
    const sentences = story.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length > 1) {
      storyFlaws.push(`Story contains ${sentences.length} sentences instead of 1 continuous flow`);
    }
    // No foreign script
    if (/[a-zA-Z]/.test(story)) {
      storyFlaws.push('Story contains Latin/foreign letters');
    }
    // Check if each station's anchor or core concept is mentioned
    let mentionedCount = 0;
    for (const st of result.stations) {
      const anchorClean = (st.associationWord || '').trim();
      const firstWord = anchorClean.split(/\s+/)[0];
      if (firstWord && story.includes(firstWord)) {
        mentionedCount++;
      }
    }
    if (mentionedCount < result.stations.length - 1) {
      storyFlaws.push(`Only ${mentionedCount}/${result.stations.length} anchors mentioned in the story`);
    }
  }

  auditReport.storyAudit = {
    story,
    flaws: storyFlaws,
    score: Math.max(0, 10 - (storyFlaws.length * 3))
  };

  if (storyFlaws.length > 0) {
    auditReport.flawsFound.push(`Story flaws: ${storyFlaws.join('; ')}`);
    auditReport.overallScore -= (storyFlaws.length * 5);
  }

  auditReport.overallScore = Math.max(0, auditReport.overallScore);

  console.log('\n--- AUDIT SUMMARY REPORT ---');
  console.log(JSON.stringify(auditReport, null, 2));

  fs.writeFileSync('scripts/last_simulation_report.json', JSON.stringify(auditReport, null, 2), 'utf8');
}

runAutonomousSimulation().catch(err => {
  console.error('CRITICAL ERROR in autonomous simulation:', err);
});
