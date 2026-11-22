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

// 2. Fetch polyfill
const originalFetch = globalThis.fetch;
globalThis.fetch = function(url, init) {
  if (typeof url === 'string' && url.startsWith('/api/')) {
    url = `http://localhost:5175${url}`;
  }
  return originalFetch(url, init);
};

// 3. Mock window
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: {
      _data: {},
      getItem: (k) => globalThis.window.localStorage._data[k] || process.env[k] || null,
      setItem: (k, v) => { globalThis.window.localStorage._data[k] = String(v); },
      removeItem: (k) => { delete globalThis.window.localStorage._data[k]; }
    }
  };
}

import { processTaskListChronologically } from '../src/utils/mnemonicPipelineOrchestrator.js';
import { processSrsReview, getItemSrsRecord, calculateRetentionScore, getRetentionVisualBadge, SRS_RATINGS } from '../src/utils/spacedRepetitionEngine.js';

const DOMAIN_TEST_SUITES = [
  {
    domainName: '🏥 בריאות, רפואה ורוקחות (Health & Medicine)',
    tasks: [
      'תור לבדיקת דם בקופת חולים',
      'לקנות אקמול וטיפות עיניים בבית מרקחת',
      'שיננית וניקוי אבנית בשעה 14:00',
      'בדיקת ראייה וחידוש מספר למשקפיים',
      'להזריק חיסון שפעת עונתי'
    ]
  },
  {
    domainName: '💼 בירוקרטיה, כספים ומשפטים (Bureaucracy, Finance & Legal)',
    tasks: [
      'לשלם דוח חניה של העירייה',
      'להוציא דרכון ביומטרי במשרד הפנים',
      'לחתום על חוזה שכירות אצל עורך דין',
      'להפקיד צ\'ק בחשבון הבנק',
      'לחדש ביטוח מקיף לרכב'
    ]
  },
  {
    domainName: '🎓 לימודים, פיתוח ותכנות (Academic, Coding & Studies)',
    tasks: [
      'לסיים פרויקט גמר בפייתון',
      'ללמוד למבחן במיקרו כלכלה',
      'להחזיר 3 ספרים לספרייה העירונית',
      'לרשום את הילד לחוג שחמט',
      'להגיש סמינריון מודפס למרצה'
    ]
  },
  {
    domainName: '🏡 סידורים ותחזוקת הבית (Home Chores & Maintenance)',
    tasks: [
      'לתקן סתימה בכיור במטבח',
      'לקנות קרטונים וחומרי אריזה למעבר דירה',
      'להזמין שק אוכל יבש לכלב',
      'לתלות מדף עץ מעל הטלוויזיה',
      'לשטוף את הרצפה עם סמרטוט ריחני'
    ]
  }
];

async function runBenchmark() {
  console.log('================================================================');
  console.log('🚀 LIFEQUEST COMPREHENSIVE MULTI-DOMAIN BENCHMARK & AUDIT SUITE');
  console.log('================================================================\n');

  const benchmarkReport = {
    timestamp: new Date().toISOString(),
    totalDomainsTested: DOMAIN_TEST_SUITES.length,
    suites: [],
    overallAverageScore: 0
  };

  let totalScoreSum = 0;

  for (let sIdx = 0; sIdx < DOMAIN_TEST_SUITES.length; sIdx++) {
    const suite = DOMAIN_TEST_SUITES[sIdx];
    console.log(`\n▶ [SUITE ${sIdx + 1}/${DOMAIN_TEST_SUITES.length}] ${suite.domainName}`);
    console.log('----------------------------------------------------------------');

    const startTime = Date.now();
    let firstReadyMs = null;

    const runResult = await processTaskListChronologically(suite.tasks, {
      onFirstReady: (payload) => {
        firstReadyMs = Date.now() - startTime;
        const s1 = payload?.stations?.[0] || payload;
        console.log(`  ⚡ Station #1 Streamed in ${firstReadyMs}ms! Anchor: "${s1.associationWord}" (${s1.emoji || '⭐'})`);
      },
      onStationReady: (station, idx) => {
        const timeMs = Date.now() - startTime;
        if (station.candidates?.length === 1) {
          console.log(`     🖼️ [Pass 1] Frame #${idx + 1} got 1st image in ${timeMs}ms: "${station.associationWord}"`);
        } else if (station.candidates?.length > 1) {
          console.log(`     ✨ [Pass 2] Frame #${idx + 1} enriched to ${station.candidates.length} candidates in ${timeMs}ms`);
        }
      }
    });

    const elapsedMs = Date.now() - startTime;
    console.log(`  ✨ Processed all ${runResult.stations.length} stations in ${elapsedMs}ms`);
    console.log(`  📖 Story: "${runResult.grandFinaleStory}"`);

    // Audit Suite
    let suiteScore = 100;
    const flaws = [];

    // Check fast entry
    if (firstReadyMs > 6000) {
      flaws.push(`Station 1 streamed in ${firstReadyMs}ms (exceeds 6s target)`);
      suiteScore -= 15;
    }

    // Check stations
    runResult.stations.forEach((st, idx) => {
      console.log(`     [Station ${idx + 1}] "${st.title}" -> "${st.associationWord}" (${st.imageUrl?.slice(0, 50)}...)`);
      if (!st.imageUrl || st.imageUrl.startsWith('data:image/svg')) {
        flaws.push(`Station ${idx + 1} has SVG fallback`);
        suiteScore -= 5;
      }
      if (st.candidates?.length > 3) {
        flaws.push(`Station ${idx + 1} candidates > 3`);
        suiteScore -= 5;
      }

      // Test SRS review integration
      const reviewRecord = processSrsReview(st, SRS_RATINGS.GOOD);
      const badge = getRetentionVisualBadge(st);
      if (!reviewRecord || !badge) {
        flaws.push(`Station ${idx + 1} SRS calculation failed`);
        suiteScore -= 5;
      }
    });

    // Check story
    const story = runResult.grandFinaleStory || '';
    if (!story) {
      flaws.push('Missing Grand Finale Story');
      suiteScore -= 20;
    } else {
      if (/[a-zA-Z]/.test(story)) {
        flaws.push('Story contains Latin/foreign characters');
        suiteScore -= 10;
      }
    }

    suiteScore = Math.max(0, suiteScore);
    totalScoreSum += suiteScore;

    console.log(`  🎯 Suite Score: ${suiteScore}/100 ${flaws.length === 0 ? '✅ (PERFECT)' : '⚠️ (' + flaws.join(', ') + ')'}`);

    benchmarkReport.suites.push({
      domain: suite.domainName,
      firstReadyMs,
      totalElapsedMs: elapsedMs,
      score: suiteScore,
      flaws,
      story: runResult.grandFinaleStory,
      stations: runResult.stations.map(s => ({
        title: s.title,
        anchor: s.associationWord,
        imageUrl: s.imageUrl,
        fromPool: s.hasRepositoryImage
      }))
    });
  }

  benchmarkReport.overallAverageScore = Math.round(totalScoreSum / DOMAIN_TEST_SUITES.length);

  console.log('\n================================================================');
  console.log(`🏁 BENCHMARK COMPLETE! OVERALL SCORE: ${benchmarkReport.overallAverageScore}/100`);
  console.log('================================================================');

  fs.writeFileSync('scripts/last_comprehensive_benchmark_report.json', JSON.stringify(benchmarkReport, null, 2), 'utf8');
}

runBenchmark().catch(err => {
  console.error('CRITICAL BENCHMARK ERROR:', err);
});
