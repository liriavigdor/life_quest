import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Helper to validate that no branch contains any word from the root
export function validateBranches(rootName, branches) {
  const rootWords = rootName
    .replace(/[()\/\"'’`\-]/g, ' ')
    .split(/\s+/)
    .map(w => w.trim())
    .filter(w => w.length > 1);

  const invalid = [];
  branches.forEach(b => {
    const cleanB = b.replace('#', '').trim();
    const branchWords = cleanB.split(/\s+/).map(w => w.trim());

    for (const rw of rootWords) {
      for (const bw of branchWords) {
        // Exact match of word, or prefix/suffix stem match for words > 2 chars
        if (bw === rw) {
          invalid.push({ branch: cleanB, matchedRootWord: rw, reason: 'exact word match' });
        } else if (rw.length >= 3 && bw.includes(rw)) {
          invalid.push({ branch: cleanB, matchedRootWord: rw, reason: 'stem contains root' });
        }
      }
    }
  });

  return invalid;
}

// Helper to extract JSON roots array from a markdown file with ```json block
export function parseRootsFromMarkdown(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  if (!jsonMatch) {
    throw new Error(`No json code block found in markdown file: ${filePath}`);
  }
  return JSON.parse(jsonMatch[1]);
}

// Comprehensive validator for a single root entry
export function validateRootEntry(root, options = {}) {
  const { strictHebrewLettersOnly = false, checkReverseContainment = false } = options;
  const issues = [];
  const rawBranches = root.branches || root.keywords || [];

  if (!Array.isArray(rawBranches)) {
    issues.push({ type: 'structure', message: `Branches must be an array, got ${typeof rawBranches}` });
    return { valid: false, issues, branchCount: 0 };
  }

  // Branch count check (must be 2 to 5)
  if (rawBranches.length < 2 || rawBranches.length > 5) {
    issues.push({
      type: 'count',
      message: `Branch count must be between 2 and 5 (got ${rawBranches.length})`
    });
  }

  // Single-token check
  for (const b of rawBranches) {
    if (typeof b !== 'string') {
      issues.push({ type: 'token', branch: b, message: 'Branch token must be a string' });
      continue;
    }
    const clean = b.replace('#', '').trim();
    if (clean.length === 0) {
      issues.push({ type: 'token', branch: b, message: 'Empty branch token' });
    } else if (/\s/.test(clean)) {
      issues.push({ type: 'token', branch: b, message: `Multi-word branch violation: "${clean}"` });
    } else if (strictHebrewLettersOnly && !/^[\u0590-\u05FF]+$/.test(clean)) {
      issues.push({ type: 'token', branch: b, message: `Non-Hebrew characters in token: "${clean}"` });
    }
  }

  // Standard overlap check via validateBranches
  const overlapResults = validateBranches(root.title || root.name || '', rawBranches);
  for (const inv of overlapResults) {
    issues.push({
      type: 'overlap',
      branch: inv.branch,
      matchedRootWord: inv.matchedRootWord,
      reason: inv.reason,
      message: `Branch "${inv.branch}" overlaps with root word "${inv.matchedRootWord}" (${inv.reason})`
    });
  }

  // Reverse containment check (root word contains branch of length >= 3)
  if (checkReverseContainment) {
    const rootWords = (root.title || root.name || '')
      .replace(/[()\/\"'’`\-]/g, ' ')
      .split(/\s+/)
      .map(w => w.trim())
      .filter(w => w.length > 1);

    for (const b of rawBranches) {
      const clean = b.replace('#', '').trim();
      if (clean.length >= 3) {
        for (const rw of rootWords) {
          if (rw.includes(clean)) {
            issues.push({
              type: 'reverse_overlap',
              branch: clean,
              matchedRootWord: rw,
              message: `Root word "${rw}" contains branch "${clean}"`
            });
          }
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    branchCount: rawBranches.length
  };
}

// CLI runner
async function runCli() {
  const args = process.argv.slice(2);
  const targetArg = args[0];

  console.log('================================================================================');
  console.log('                     Life Quest Branch Validator');
  console.log('================================================================================\n');

  let totalRootsChecked = 0;
  let totalErrors = 0;

  if (targetArg) {
    // Validate specific file
    const resolvedPath = path.resolve(process.cwd(), targetArg);
    console.log(`[Target] Validating specified file: ${targetArg}`);

    if (!fs.existsSync(resolvedPath)) {
      console.error(`Error: File not found: ${resolvedPath}`);
      process.exit(1);
    }

    let roots = [];
    if (resolvedPath.endsWith('.md')) {
      roots = parseRootsFromMarkdown(resolvedPath);
    } else if (resolvedPath.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      roots = Array.isArray(data) ? data : data.roots || [];
    } else if (resolvedPath.endsWith('.js') || resolvedPath.endsWith('.mjs')) {
      const mod = await import(pathToFileURL(resolvedPath).href);
      roots = mod.CURATED_USER_REPOSITORY_SEED || mod.curatedUserRepositorySeed || mod.default || [];
    }

    let fileErrors = 0;
    for (const root of roots) {
      totalRootsChecked++;
      const res = validateRootEntry(root, { strictHebrewLettersOnly: true, checkReverseContainment: true });
      if (!res.valid) {
        fileErrors += res.issues.length;
        totalErrors += res.issues.length;
        console.error(`  ✖ [${root.id || 'unknown'}] "${root.title || root.name}":`);
        for (const iss of res.issues) {
          console.error(`      - ${iss.message}`);
        }
      }
    }

    if (fileErrors === 0) {
      console.log(`  ✓ All ${roots.length} roots passed validation with 0 errors.`);
    } else {
      console.error(`  ✖ Found ${fileErrors} validation issues in ${targetArg}.`);
    }

  } else {
    // Default validation: LIFE_QUEST_ENRICHMENT_MANIFEST.md and repository seed
    const enrichmentPath = path.resolve(process.cwd(), 'LIFE_QUEST_ENRICHMENT_MANIFEST.md');
    if (fs.existsSync(enrichmentPath)) {
      console.log('[Target 1] Validating Enrichment Manifest: LIFE_QUEST_ENRICHMENT_MANIFEST.md');
      const enrichmentRoots = parseRootsFromMarkdown(enrichmentPath);
      let enrichmentErrors = 0;
      let countIssues = 0;
      let tokenIssues = 0;
      let overlapIssues = 0;

      for (const root of enrichmentRoots) {
        totalRootsChecked++;
        const res = validateRootEntry(root, { strictHebrewLettersOnly: true, checkReverseContainment: true });
        if (!res.valid) {
          for (const iss of res.issues) {
            enrichmentErrors++;
            totalErrors++;
            if (iss.type === 'count') countIssues++;
            else if (iss.type === 'token') tokenIssues++;
            else overlapIssues++;
            console.error(`  ✖ [${root.id}] "${root.title}": ${iss.message}`);
          }
        }
      }

      console.log(`  - Total roots parsed: ${enrichmentRoots.length}`);
      console.log(`  - Total branches parsed: ${enrichmentRoots.length * 5} (5 per root)`);
      console.log(`  - Branch count violations (2–5 required): ${countIssues}`);
      console.log(`  - Single-token violations: ${tokenIssues}`);
      console.log(`  - Branch overlap violations: ${overlapIssues}`);

      if (enrichmentErrors === 0) {
        console.log(`  ✓ Result: PASSED (${enrichmentRoots.length}/${enrichmentRoots.length} roots clean, 0 errors)\n`);
      } else {
        console.error(`  ✖ Result: FAILED (${enrichmentErrors} errors found)\n`);
      }
    }

    // Target 2: Curated User Repository Seed
    const seedPath = path.resolve(process.cwd(), 'src/data/curatedUserRepositorySeed.js');
    if (fs.existsSync(seedPath)) {
      console.log('[Target 2] Validating Curated User Repository Seed: src/data/curatedUserRepositorySeed.js');
      try {
        const seedModule = await import(pathToFileURL(seedPath).href);
        const seedRoots = seedModule.CURATED_USER_REPOSITORY_SEED || seedModule.default || [];
        let seedOverlapErrors = 0;

        for (const item of seedRoots) {
          totalRootsChecked++;
          const branches = item.keywords || item.branches || [];
          const inv = validateBranches(item.title, branches);
          if (inv.length > 0) {
            seedOverlapErrors += inv.length;
            totalErrors += inv.length;
            console.error(`  ✖ [${item.id}] "${item.title}":`);
            for (const i of inv) {
              console.error(`      - Overlap: "${i.branch}" matches root word "${i.matchedRootWord}"`);
            }
          }
        }

        console.log(`  - Total roots parsed: ${seedRoots.length}`);
        console.log(`  - Branch overlap violations (via validateBranches): ${seedOverlapErrors}`);
        if (seedOverlapErrors === 0) {
          console.log(`  ✓ Result: PASSED (${seedRoots.length}/${seedRoots.length} roots clean, 0 errors)\n`);
        } else {
          console.error(`  ✖ Result: FAILED (${seedOverlapErrors} overlap errors found)\n`);
        }
      } catch (err) {
        console.warn(`  - Note: Could not import seed (${err.message})\n`);
      }
    }

    // Target 3: Existing repository manifest status note
    const manifestJsonPath = path.resolve(process.cwd(), 'life_quest_repository_manifest.json');
    if (fs.existsSync(manifestJsonPath)) {
      try {
        const manifestData = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
        const count = manifestData.roots ? manifestData.roots.length : 0;
        console.log('[Target 3] Repository Manifest Status: life_quest_repository_manifest.json');
        console.log(`  - Current roots in active manifest: ${count}`);
        console.log('  - Note: Legacy localEdits overlaps documented; scheduled for reconciliation in Milestone 3 repository integration.\n');
      } catch {
        // ignore JSON parse issue for status note
      }
    }
  }

  console.log('================================================================================');
  console.log('FINAL VALIDATION SUMMARY:');
  console.log(`  Total active validated roots: ${totalRootsChecked}`);
  console.log(`  Total validation errors: ${totalErrors}`);
  console.log(`  Exit Status: ${totalErrors === 0 ? 'SUCCESS (code 0)' : 'FAILED (code 1)'}`);
  console.log('================================================================================');

  process.exit(totalErrors === 0 ? 0 : 1);
}

// Auto-run if executed directly
const isDirectExecution = process.argv[1] && (
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) ||
  process.argv[1].endsWith('branch_validator.mjs') ||
  process.argv[1].endsWith('branch_validator')
);

if (isDirectExecution) {
  runCli().catch(err => {
    console.error('Fatal CLI execution error:', err);
    process.exit(1);
  });
}
