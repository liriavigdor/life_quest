/**
 * Dual Track E2E Test Suite: Life Quest Image Repository Enrichment (150 New Roots)
 *
 * Requirements Covered:
 *   - R1: Manifest Validation & Branch Overlap Fixes
 *   - R2: Authentic, Classical Image Selection, Raster Verification & Staging
 *   - R3: Active Repository Integration (Manifests, Seed, Pool)
 *   - R4: Visual Review Surface (Contact Sheet & BulkImageCurationDesk)
 *
 * Test Architecture:
 *   - Tier 1: Feature Coverage (20 tests)
 *   - Tier 2: Boundary & Corner Cases (23 tests)
 *   - Tier 3: Cross-Feature Relational Parity (6 tests)
 *   - Tier 4: Real-World Application Scenarios (5 tests)
 * Total: 54 Test Cases
 *
 * Zero external dependencies: uses Node.js native `node:test`, `node:assert/strict`,
 * and embedded pure JS binary Buffer inspection for image headers and dimensions.
 */

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

// ==============================================================================
// Common Paths & Configuration
// ==============================================================================

const ROOT_DIR = process.cwd();
const POOL_DIR = path.resolve(ROOT_DIR, 'public', 'staged_images', 'pool');
const ENRICHMENT_MANIFEST_PATH = path.resolve(ROOT_DIR, 'LIFE_QUEST_ENRICHMENT_MANIFEST.md');
const REPO_MANIFEST_MD_PATH = path.resolve(ROOT_DIR, 'LIFE_QUEST_REPOSITORY_MANIFEST.md');
const REPO_MANIFEST_JSON_PATH = path.resolve(ROOT_DIR, 'life_quest_repository_manifest.json');
const POOL_DATA_PATH = path.resolve(ROOT_DIR, 'src', 'data', 'stagedImagesPool.js');
const SEED_DATA_PATH = path.resolve(ROOT_DIR, 'src', 'data', 'curatedUserRepositorySeed.js');
const CURATION_DESK_JSX_PATH = path.resolve(ROOT_DIR, 'src', 'components', 'BulkImageCurationDesk.jsx');
const BRANCH_VALIDATOR_PATH = path.resolve(ROOT_DIR, 'scripts', 'branch_validator.mjs');
const GENERATE_MANIFEST_SCRIPT = path.resolve(ROOT_DIR, 'scripts', 'generate_repository_manifest.mjs');
const GENERATE_CONTACT_SHEET_SCRIPT = path.resolve(ROOT_DIR, 'scripts', 'generate_contact_sheet.mjs');
const CONTACT_SHEET_HTML_PATH = path.resolve(ROOT_DIR, 'public', 'contact_sheet.html');

// ==============================================================================
// Pure JS Buffer Parser (Zero External Dependencies)
// ==============================================================================

/**
 * Parses binary buffer headers to validate raster image format and dimensions.
 * Strictly accepts JPEG, PNG, and WebP raster images.
 * Strictly rejects SVG, XML, HTML error responses, AVIF/MP4 containers, and GIF.
 *
 * @param {Buffer} buf - File binary buffer
 * @returns {{ valid: boolean, format?: string, width?: number, height?: number, reason?: string }}
 */
export function validateImageBuffer(buf) {
  if (!buf || !Buffer.isBuffer(buf) || buf.length < 24) {
    return { valid: false, reason: 'Zero-byte or truncated buffer' };
  }

  const prefixAscii = buf.slice(0, 64).toString('ascii');

  // Negative Gate: Reject SVG / XML
  if (prefixAscii.includes('<svg') || prefixAscii.includes('<?xml')) {
    return { valid: false, reason: 'Disallowed format: SVG' };
  }

  // Negative Gate: Reject HTML error responses (e.g. 404/500 pages)
  if (prefixAscii.toLowerCase().includes('<!doctype html') || prefixAscii.toLowerCase().includes('<html')) {
    return { valid: false, reason: 'Disallowed format: HTML error response' };
  }

  // Negative Gate: Reject AVIF / MP4 containers (ftyp box at byte offset 4)
  if (buf.length >= 12 && buf.slice(4, 12).toString('ascii').includes('ftyp')) {
    return { valid: false, reason: 'Disallowed format: AVIF / MP4 container' };
  }

  // Negative Gate: Reject GIF
  if (prefixAscii.startsWith('GIF87a') || prefixAscii.startsWith('GIF89a')) {
    return { valid: false, reason: 'Disallowed format: GIF' };
  }

  // PNG: Signature 89 50 4E 47 0D 0A 1A 0A
  if (
    buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47 &&
    buf[4] === 0x0D && buf[5] === 0x0A && buf[6] === 0x1A && buf[7] === 0x0A
  ) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    if (width < 300 || height < 300) {
      return { valid: false, format: 'png', width, height, reason: `Dimensions ${width}x${height} < 300x300` };
    }
    return { valid: true, format: 'png', width, height };
  }

  // WebP: RIFF .... WEBP
  if (buf.slice(0, 4).toString('ascii') === 'RIFF' && buf.slice(8, 12).toString('ascii') === 'WEBP') {
    const chunkType = buf.slice(12, 16).toString('ascii');
    let width = null;
    let height = null;

    if (chunkType === 'VP8 ') {
      if (buf.length < 30) return { valid: false, reason: 'Truncated WebP VP8' };
      width = buf.readUInt16LE(26) & 0x3fff;
      height = buf.readUInt16LE(28) & 0x3fff;
    } else if (chunkType === 'VP8L') {
      if (buf.length < 25) return { valid: false, reason: 'Truncated WebP VP8L' };
      const b = buf.readUInt32LE(21);
      width = 1 + (b & 0x3fff);
      height = 1 + ((b >> 14) & 0x3fff);
    } else if (chunkType === 'VP8X') {
      if (buf.length < 30) return { valid: false, reason: 'Truncated WebP VP8X' };
      width = 1 + buf[24] + (buf[25] << 8) + (buf[26] << 16);
      height = 1 + buf[27] + (buf[28] << 8) + (buf[29] << 16);
    }

    if (!width || !height) {
      return { valid: false, reason: 'Unable to parse WebP dimensions' };
    }
    if (width < 300 || height < 300) {
      return { valid: false, format: 'webp', width, height, reason: `Dimensions ${width}x${height} < 300x300` };
    }
    return { valid: true, format: 'webp', width, height };
  }

  // JPEG: Signature FF D8
  if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) {
        offset++;
        continue;
      }
      const marker = buf[offset + 1];
      if (marker === 0xD9 || marker === 0xDA) break; // EOI or SOS
      if (marker === 0x00 || (marker >= 0xD0 && marker <= 0xD7) || marker === 0x01) {
        offset += 2;
        continue;
      }
      if (offset + 4 > buf.length) break;
      const len = buf.readUInt16BE(offset + 2);
      const isSOF = (
        marker >= 0xC0 && marker <= 0xCF &&
        marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC
      );
      if (isSOF) {
        if (offset + 9 > buf.length) break;
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        if (width < 300 || height < 300) {
          return { valid: false, format: 'jpeg', width, height, reason: `Dimensions ${width}x${height} < 300x300` };
        }
        return { valid: true, format: 'jpeg', width, height };
      }
      offset += 2 + len;
    }
  }

  return { valid: false, reason: 'Unsupported or unparsed raster format' };
}

// ==============================================================================
// Helper Functions
// ==============================================================================

/**
 * Safely parses the JSON array embedded in LIFE_QUEST_ENRICHMENT_MANIFEST.md.
 */
function getEnrichmentManifestRoots() {
  assert.ok(fs.existsSync(ENRICHMENT_MANIFEST_PATH), `Enrichment manifest must exist at ${ENRICHMENT_MANIFEST_PATH}`);
  const content = fs.readFileSync(ENRICHMENT_MANIFEST_PATH, 'utf8');
  const match = content.match(/```json\s*([\s\S]*?)\s*```/);
  assert.ok(match, 'JSON code block not found in LIFE_QUEST_ENRICHMENT_MANIFEST.md');
  const roots = JSON.parse(match[1]);
  assert.ok(Array.isArray(roots), 'Enrichment manifest must parse to an array');
  return roots;
}

/**
 * Dynamically loads stagedImagesPool module safely.
 */
async function loadStagedImagesPoolModule() {
  assert.ok(fs.existsSync(POOL_DATA_PATH), `Pool module must exist at ${POOL_DATA_PATH}`);
  return await import(pathToFileURL(POOL_DATA_PATH).href);
}

/**
 * Dynamically loads curatedUserRepositorySeed module safely.
 */
async function loadSeedModule() {
  assert.ok(fs.existsSync(SEED_DATA_PATH), `Seed module must exist at ${SEED_DATA_PATH}`);
  return await import(pathToFileURL(SEED_DATA_PATH).href);
}

// ==============================================================================
// TIER 1: FEATURE COVERAGE (20 Tests)
// ==============================================================================

describe('Tier 1: Feature Coverage', () => {

  // ----------------------------------------------------------------------------
  // R1: Manifest Validation & Branch Overlap Fixes
  // ----------------------------------------------------------------------------
  describe('Requirement R1: Branch Validation & Fixes', () => {

    it('T1_R1_01: validateBranches approves valid Hebrew branches with zero overlap', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const rootName = 'שעון מעורר';
      const branches = ['בוקר', 'זמן', 'קימה', 'צלצול', 'נודניק'];
      const invalid = validateBranches(rootName, branches);
      assert.deepStrictEqual(invalid, [], 'Expected zero branch overlap issues for valid everyday anchors');
    });

    it('T1_R1_02: validateBranches correctly flags exact word overlaps', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const rootName = 'שקע חשמל';
      const branches = ['חשמל', 'קיר'];
      const invalid = validateBranches(rootName, branches);
      assert.strictEqual(invalid.length, 1);
      assert.strictEqual(invalid[0].branch, 'חשמל');
      assert.strictEqual(invalid[0].matchedRootWord, 'חשמל');
      assert.strictEqual(invalid[0].reason, 'exact word match');
    });

    it('T1_R1_03: validateBranches correctly flags stem containment overlaps', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const rootName = 'זוג טבעות נישואין';
      const branches = ['זוגיות', 'זהב'];
      const invalid = validateBranches(rootName, branches);
      assert.strictEqual(invalid.length, 1);
      assert.strictEqual(invalid[0].branch, 'זוגיות');
      assert.strictEqual(invalid[0].matchedRootWord, 'זוג');
      assert.strictEqual(invalid[0].reason, 'stem contains root');
    });

    it('T1_R1_04: LIFE_QUEST_ENRICHMENT_MANIFEST.md has 150 roots with 2-5 single-token Hebrew branches', () => {
      const roots = getEnrichmentManifestRoots();
      assert.strictEqual(roots.length, 150, 'Enrichment manifest must contain exactly 150 roots');

      const hebrewSingleTokenRegex = /^[\u0590-\u05FF]+$/;
      const countViolations = [];
      const tokenViolations = [];

      for (const root of roots) {
        if (!Array.isArray(root.branches) || root.branches.length < 2 || root.branches.length > 5) {
          countViolations.push({ id: root.id, count: root.branches ? root.branches.length : 0 });
        }
        for (const branch of (root.branches || [])) {
          if (!hebrewSingleTokenRegex.test(branch)) {
            tokenViolations.push({ id: root.id, branch });
          }
        }
      }

      assert.strictEqual(countViolations.length, 0, `Roots with invalid branch count: ${JSON.stringify(countViolations)}`);
      assert.strictEqual(tokenViolations.length, 0, `Branches with invalid single-token Hebrew format: ${JSON.stringify(tokenViolations)}`);
    });

    it('T1_R1_05: LIFE_QUEST_ENRICHMENT_MANIFEST.md has zero overlap violations', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const roots = getEnrichmentManifestRoots();
      const detectedOverlaps = [];

      for (const root of roots) {
        const issues = validateBranches(root.title, root.branches);
        if (issues.length > 0) {
          detectedOverlaps.push({ id: root.id, title: root.title, issues });
        }
      }

      assert.strictEqual(detectedOverlaps.length, 0, `Found branch overlaps in enrichment manifest: ${JSON.stringify(detectedOverlaps)}`);
    });

  });

  // ----------------------------------------------------------------------------
  // R2: Authentic Image Staging & Raster Integrity
  // ----------------------------------------------------------------------------
  describe('Requirement R2: Image Staging & Integrity', () => {

    it('T1_R2_01: All 150 enrichment root image files exist in public/staged_images/pool/', () => {
      const roots = getEnrichmentManifestRoots();
      const missingImages = [];

      for (const root of roots) {
        const expectedFile = path.resolve(POOL_DIR, `${root.id}.jpg`);
        if (!fs.existsSync(expectedFile)) {
          missingImages.push(root.id);
        }
      }

      assert.strictEqual(
        missingImages.length,
        0,
        `Missing staged image files for ${missingImages.length} enrichment roots in ${POOL_DIR} (first 5: ${missingImages.slice(0, 5).join(', ')})`
      );
    });

    it('T1_R2_02: Every staged enrichment image is a valid raster image (JPEG, PNG, or WebP)', () => {
      const roots = getEnrichmentManifestRoots();
      const invalidFiles = [];
      let checkedCount = 0;

      for (const root of roots) {
        const expectedFile = path.resolve(POOL_DIR, `${root.id}.jpg`);
        if (fs.existsSync(expectedFile)) {
          checkedCount++;
          const buf = fs.readFileSync(expectedFile);
          const res = validateImageBuffer(buf);
          if (!res.valid || !['jpeg', 'png', 'webp'].includes(res.format)) {
            invalidFiles.push({ id: root.id, reason: res.reason || res.format });
          }
        }
      }

      assert.strictEqual(checkedCount, roots.length, `Expected ${roots.length} images on disk before validating format, found ${checkedCount}`);
      assert.strictEqual(invalidFiles.length, 0, `Found invalid raster formats: ${JSON.stringify(invalidFiles.slice(0, 5))}`);
    });

    it('T1_R2_03: Every staged enrichment image meets the minimum dimension threshold (>= 300x300)', () => {
      const roots = getEnrichmentManifestRoots();
      const subDimensions = [];
      let checkedCount = 0;

      for (const root of roots) {
        const expectedFile = path.resolve(POOL_DIR, `${root.id}.jpg`);
        if (fs.existsSync(expectedFile)) {
          checkedCount++;
          const buf = fs.readFileSync(expectedFile);
          const res = validateImageBuffer(buf);
          if (!res.valid || !res.width || !res.height || res.width < 300 || res.height < 300) {
            subDimensions.push({ id: root.id, width: res.width, height: res.height, reason: res.reason });
          }
        }
      }

      assert.strictEqual(checkedCount, roots.length, `Expected ${roots.length} images on disk before validating dimensions, found ${checkedCount}`);
      assert.strictEqual(subDimensions.length, 0, `Found images below 300x300: ${JSON.stringify(subDimensions.slice(0, 5))}`);
    });

    it('T1_R2_04: Every staged enrichment image is non-empty and has realistic file size (>= 15 KB)', () => {
      const roots = getEnrichmentManifestRoots();
      const smallFiles = [];
      let checkedCount = 0;

      for (const root of roots) {
        const expectedFile = path.resolve(POOL_DIR, `${root.id}.jpg`);
        if (fs.existsSync(expectedFile)) {
          checkedCount++;
          const stat = fs.statSync(expectedFile);
          if (stat.size < 15000) { // < 15 KB threshold for photographic fidelity
            smallFiles.push({ id: root.id, sizeBytes: stat.size });
          }
        }
      }

      assert.strictEqual(checkedCount, roots.length, `Expected ${roots.length} images on disk before validating sizes, found ${checkedCount}`);
      assert.strictEqual(smallFiles.length, 0, `Found files below 15 KB threshold: ${JSON.stringify(smallFiles.slice(0, 5))}`);
    });

    it('T1_R2_05: Image filenames conform to the naming standard new_XXX_<english_slug>.jpg', () => {
      const roots = getEnrichmentManifestRoots();
      const namingRegex = /^new_\d{3}_[a-z0-9_]+\.(jpg|jpeg|png|webp)$/;
      const nonConforming = [];

      for (const root of roots) {
        const filename = `${root.id}.jpg`;
        if (!namingRegex.test(filename)) {
          nonConforming.push(filename);
        }
      }

      assert.strictEqual(nonConforming.length, 0, `Non-conforming image filenames: ${JSON.stringify(nonConforming)}`);
    });

  });

  // ----------------------------------------------------------------------------
  // R3: Repository Integration & Synchronization
  // ----------------------------------------------------------------------------
  describe('Requirement R3: Repository Integration & Sync', () => {

    it('T1_R3_01: src/data/stagedImagesPool.js exports STAGED_IMAGES_POOL array (>= 520 items)', async () => {
      const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
      assert.ok(Array.isArray(STAGED_IMAGES_POOL), 'STAGED_IMAGES_POOL must be an array');
      assert.ok(STAGED_IMAGES_POOL.length >= 520, `Expected at least baseline 520 items, got ${STAGED_IMAGES_POOL.length}`);
    });

    it('T1_R3_02: src/data/curatedUserRepositorySeed.js exports CURATED_USER_REPOSITORY_SEED and DISCARDED_STAGED_IDS', async () => {
      const { CURATED_USER_REPOSITORY_SEED, DISCARDED_STAGED_IDS } = await loadSeedModule();
      assert.ok(Array.isArray(CURATED_USER_REPOSITORY_SEED), 'CURATED_USER_REPOSITORY_SEED must be an array');
      assert.ok(CURATED_USER_REPOSITORY_SEED.length >= 441, `Expected at least baseline 441 items, got ${CURATED_USER_REPOSITORY_SEED.length}`);
      assert.ok(Array.isArray(DISCARDED_STAGED_IDS), 'DISCARDED_STAGED_IDS must be an array');
      assert.ok(DISCARDED_STAGED_IDS.length >= 87, `Expected at least baseline 87 discarded IDs, got ${DISCARDED_STAGED_IDS.length}`);
    });

    it('T1_R3_03: All 150 new enrichment roots exist in CURATED_USER_REPOSITORY_SEED with required schema', async () => {
      const { CURATED_USER_REPOSITORY_SEED } = await loadSeedModule();
      const roots = getEnrichmentManifestRoots();
      const seedMap = new Map(CURATED_USER_REPOSITORY_SEED.map(x => [x.id, x]));

      const missing = [];
      const invalidSchema = [];
      const requiredProps = [
        'id', 'name', 'title', 'imageUrl', 'keywords', 'association',
        'domain', 'category', 'uploaderName', 'isUserApproved', 'isCuratedSeed', 'createdAt'
      ];

      for (const root of roots) {
        const item = seedMap.get(root.id);
        if (!item) {
          missing.push(root.id);
          continue;
        }
        const missingProps = requiredProps.filter(p => item[p] === undefined);
        if (missingProps.length > 0) {
          invalidSchema.push({ id: root.id, missingProps });
        }
      }

      assert.strictEqual(missing.length, 0, `Missing ${missing.length} roots in CURATED_USER_REPOSITORY_SEED (first 5: ${missing.slice(0, 5).join(', ')})`);
      assert.strictEqual(invalidSchema.length, 0, `Invalid schema for items in seed: ${JSON.stringify(invalidSchema.slice(0, 5))}`);
    });

    it('T1_R3_04: All 150 new enrichment roots exist in STAGED_IMAGES_POOL with required schema', async () => {
      const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
      const roots = getEnrichmentManifestRoots();
      const poolMap = new Map(STAGED_IMAGES_POOL.map(x => [x.id, x]));

      const missing = [];
      const invalidSchema = [];
      const requiredProps = [
        'id', 'name', 'name_he', 'suggestedName', 'title', 'category', 'theme', 'theme_he',
        'imageUrl', 'keywords', 'associations', 'everyday_associations', 'association',
        'is_basic', 'userCurated', 'isCuratedSeed', 'isUserApproved'
      ];

      for (const root of roots) {
        const item = poolMap.get(root.id);
        if (!item) {
          missing.push(root.id);
          continue;
        }
        const missingProps = requiredProps.filter(p => item[p] === undefined);
        if (missingProps.length > 0) {
          invalidSchema.push({ id: root.id, missingProps });
        }
      }

      assert.strictEqual(missing.length, 0, `Missing ${missing.length} roots in STAGED_IMAGES_POOL (first 5: ${missing.slice(0, 5).join(', ')})`);
      assert.strictEqual(invalidSchema.length, 0, `Invalid schema for items in pool: ${JSON.stringify(invalidSchema.slice(0, 5))}`);
    });

    it('T1_R3_05: life_quest_repository_manifest.json contains metadata indicating 588 active roots with zero duplicate IDs', () => {
      assert.ok(fs.existsSync(REPO_MANIFEST_JSON_PATH), `Manifest JSON must exist at ${REPO_MANIFEST_JSON_PATH}`);
      const json = JSON.parse(fs.readFileSync(REPO_MANIFEST_JSON_PATH, 'utf8'));

      assert.ok(json.metadata, 'Manifest JSON must have metadata object');

      // Assert zero duplicate IDs in manifest JSON roots
      const seen = new Set();
      const duplicates = [];
      for (const root of json.roots || []) {
        if (seen.has(root.id)) duplicates.push(root.id);
        seen.add(root.id);
      }
      assert.strictEqual(duplicates.length, 0, `Duplicate IDs found in manifest JSON: ${JSON.stringify(duplicates)}`);

      assert.strictEqual(
        json.metadata.totalActiveRoots,
        588,
        `Expected metadata.totalActiveRoots to be 588, got ${json.metadata.totalActiveRoots}`
      );
      assert.strictEqual(
        Array.isArray(json.roots) ? json.roots.length : 0,
        588,
        `Expected roots array length to be 588, got ${json.roots ? json.roots.length : 0}`
      );
    });

  });

  // ----------------------------------------------------------------------------
  // R4: Visual Review Surface
  // ----------------------------------------------------------------------------
  describe('Requirement R4: Visual Review Surface', () => {

    it('T1_R4_01: scripts/generate_contact_sheet.mjs exists on disk', () => {
      assert.ok(
        fs.existsSync(GENERATE_CONTACT_SHEET_SCRIPT),
        `Contact sheet generator script must exist at ${GENERATE_CONTACT_SHEET_SCRIPT}`
      );
    });

    it('T1_R4_02: public/contact_sheet.html exists with valid HTML5 structure and UTF-8 charset', () => {
      assert.ok(
        fs.existsSync(CONTACT_SHEET_HTML_PATH),
        `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`
      );
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      assert.ok(/<!doctype html>/i.test(html), 'Contact sheet must contain <!doctype html>');
      assert.ok(/charset=["']?utf-8/i.test(html), 'Contact sheet must declare UTF-8 charset');
      assert.ok(/[\u0590-\u05FF]/.test(html), 'Contact sheet must contain rendered Hebrew characters');
    });

    it('T1_R4_03: public/contact_sheet.html renders cards for all 150 enrichment roots', () => {
      assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      const roots = getEnrichmentManifestRoots();
      const missingCards = [];

      for (const root of roots) {
        if (!html.includes(root.id) && !html.includes(root.title)) {
          missingCards.push(root.id);
        }
      }

      assert.strictEqual(
        missingCards.length,
        0,
        `Contact sheet missing ${missingCards.length} enrichment roots (first 5: ${missingCards.slice(0, 5).join(', ')})`
      );
    });

    it('T1_R4_04: public/contact_sheet.html renders image elements pointing to local pool files', () => {
      assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      assert.ok(
        html.includes('/staged_images/pool/') || html.includes('./staged_images/pool/'),
        'Contact sheet must contain image paths referencing the staged images pool'
      );
      const imgTags = html.match(/<img[^>]+src=["']([^"']+)["']/gi) || [];
      assert.ok(imgTags.length >= 150, `Expected at least 150 images in contact sheet, found ${imgTags.length}`);
    });

    it('T1_R4_05: public/contact_sheet.html renders all 5 branch badges for each enrichment root', () => {
      assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      const roots = getEnrichmentManifestRoots();
      let missingBranchBadges = 0;

      for (const root of roots) {
        for (const branch of root.branches) {
          if (!html.includes(branch)) {
            missingBranchBadges++;
          }
        }
      }

      assert.strictEqual(missingBranchBadges, 0, `Found ${missingBranchBadges} missing branch badges in contact sheet`);
    });

  });

});

// ==============================================================================
// TIER 2: BOUNDARY & CORNER CASES (23 Tests)
// ==============================================================================

describe('Tier 2: Boundary & Corner Cases', () => {

  // ----------------------------------------------------------------------------
  // R1 Boundary Tests
  // ----------------------------------------------------------------------------
  describe('R1 Boundaries: Validator Robustness & Token Integrity', () => {

    it('T2_R1_01: Empty or whitespace root title and branch array returns [] without error', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      assert.deepStrictEqual(validateBranches('', []), []);
      assert.deepStrictEqual(validateBranches('   ', []), []);
      assert.deepStrictEqual(validateBranches('', ['מטבח', 'סיר']), []);
    });

    it('T2_R1_02: Special character stripping removes punctuation and catches embedded overlaps', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const rootWithChars = 'רובוט (R2-D2) [דגם] / "חכם"';
      const branches = ['רובוט', 'חכם'];
      const invalid = validateBranches(rootWithChars, branches);
      assert.strictEqual(invalid.length, 2);
      const matchedWords = invalid.map(x => x.matchedRootWord).sort();
      assert.deepStrictEqual(matchedWords, ['חכם', 'רובוט']);
    });

    it('T2_R1_03: Hashtag prefix stripping detects embedded overlap', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const root = 'מנעול';
      const branches = ['#מנעול', '#מפתח'];
      const invalid = validateBranches(root, branches);
      assert.strictEqual(invalid.length, 1);
      assert.strictEqual(invalid[0].branch, 'מנעול');
      assert.strictEqual(invalid[0].matchedRootWord, 'מנעול');
    });

    it('T2_R1_04: Single-letter root words do not trigger false positive stem overlaps', async () => {
      const { validateBranches } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const root = 'סיר ו מחבת';
      const branches = ['וילה', 'מטבח'];
      const invalid = validateBranches(root, branches);
      assert.deepStrictEqual(invalid, [], 'Single-letter conjunction "ו" should not falsely match "וילה"');
    });

    it('T2_R1_05: Multi-word branches are rejected by single-token rule', () => {
      const singleTokenRegex = /^[\u0590-\u05FF]+$/;
      const multiWordInputs = ['עוגת שוקולד', 'נעלי בית', 'טלפון-סלולרי', 'מסך 4K', 'בית '];
      for (const input of multiWordInputs) {
        assert.strictEqual(
          singleTokenRegex.test(input),
          false,
          `Multi-word or symbol input "${input}" must be rejected by single-token Hebrew regex`
        );
      }
    });

    it('T2_R1_06: Reverse morphological containment is detected (root contains branch)', async () => {
      const { validateRootEntry } = await import(pathToFileURL(BRANCH_VALIDATOR_PATH).href);
      const testRoot = {
        id: 'test_reverse',
        title: 'מחשבון כיס',
        branches: ['חשבון', 'כפתור']
      };
      const res = validateRootEntry(testRoot, { checkReverseContainment: true });
      assert.strictEqual(res.valid, false, 'Expected reverse containment to be flagged as invalid');
      const revIssue = res.issues.find(i => i.type === 'reverse_overlap');
      assert.ok(revIssue, 'Expected reverse_overlap issue to be reported');
      assert.strictEqual(revIssue.branch, 'חשבון');
      assert.strictEqual(revIssue.matchedRootWord, 'מחשבון');
    });

  });

  // ----------------------------------------------------------------------------
  // R2 Boundary Tests
  // ----------------------------------------------------------------------------
  describe('R2 Boundaries: Binary Parser Defensive Gates & AI Guard', () => {

    it('T2_R2_01: Zero-byte buffer rejection', () => {
      const res = validateImageBuffer(Buffer.alloc(0));
      assert.strictEqual(res.valid, false);
      assert.ok(res.reason.includes('Zero-byte or truncated buffer'));
    });

    it('T2_R2_02: Truncated header buffer rejection', () => {
      const res = validateImageBuffer(Buffer.from([0xFF, 0xD8]));
      assert.strictEqual(res.valid, false);
    });

    it('T2_R2_03: Disallowed format: SVG disguised as raster is rejected', () => {
      const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600"><rect/></svg>');
      const res = validateImageBuffer(svgBuffer);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.reason, 'Disallowed format: SVG');
    });

    it('T2_R2_04: Disallowed format: HTML error page response is rejected', () => {
      const htmlBuffer = Buffer.from('<!DOCTYPE html><html><body><h1>404 Not Found</h1></body></html>');
      const res = validateImageBuffer(htmlBuffer);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.reason, 'Disallowed format: HTML error response');
    });

    it('T2_R2_05: Disallowed format: AVIF container is rejected', () => {
      // Synthetic AVIF container with 'ftypavif' at offset 4
      const avifBuffer = Buffer.from([
        0x00, 0x00, 0x00, 0x1C, // box size
        0x66, 0x74, 0x79, 0x70, // 'ftyp'
        0x61, 0x76, 0x69, 0x66, // 'avif'
        0x00, 0x00, 0x00, 0x00,
        0x61, 0x76, 0x69, 0x66, 0x6D, 0x69, 0x66, 0x31
      ]);
      const res = validateImageBuffer(avifBuffer);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.reason, 'Disallowed format: AVIF / MP4 container');
    });

    it('T2_R2_06: Dimension gate: Sub-300x300 image is rejected', () => {
      // Minimal valid PNG buffer with 200x200 dimensions
      const pngSub300 = Buffer.alloc(33);
      pngSub300.write('\x89PNG\r\n\x1a\n', 0, 8, 'binary');
      pngSub300.writeUInt32BE(13, 8); // IHDR length
      pngSub300.write('IHDR', 12, 4, 'ascii');
      pngSub300.writeUInt32BE(200, 16); // width 200
      pngSub300.writeUInt32BE(200, 20); // height 200
      pngSub300[24] = 8; // bit depth
      pngSub300[25] = 2; // color type

      const res = validateImageBuffer(pngSub300);
      assert.strictEqual(res.valid, false);
      assert.strictEqual(res.reason, 'Dimensions 200x200 < 300x300');
    });

    it('T2_R2_07: AI Image Generation Guard: download pipeline uses authentic web sources and NO AI generation', () => {
      const downloadScriptPath = path.resolve(ROOT_DIR, 'scripts', 'download_enrichment_150_pool.mjs');
      if (fs.existsSync(downloadScriptPath)) {
        const content = fs.readFileSync(downloadScriptPath, 'utf8');
        const disallowedAiKeywords = [
          '@google/genai', 'openai', 'replicate', 'stability-ai', 'dall-e',
          'images.generate', 'midjourney', 'stability', 'createimage'
        ];
        for (const kw of disallowedAiKeywords) {
          assert.strictEqual(
            content.toLowerCase().includes(kw),
            false,
            `Download script must NOT invoke AI image generator (${kw})`
          );
        }
        assert.ok(
          content.includes('wikipedia') || content.includes('wikimedia') || content.includes('commons'),
          'Download script must source authentic images from Wikipedia / Wikimedia Commons'
        );
      } else {
        // Guard check across all script files in scripts/
        const scriptFiles = fs.readdirSync(path.resolve(ROOT_DIR, 'scripts'));
        for (const file of scriptFiles) {
          if (file.toLowerCase().includes('generate_image') || file.toLowerCase().includes('dalle')) {
            assert.fail(`Disallowed AI image generation script found: ${file}`);
          }
        }
      }
    });

  });

  // ----------------------------------------------------------------------------
  // R3 Boundary Tests
  // ----------------------------------------------------------------------------
  describe('R3 Boundaries: Unique IDs & URL Integrity', () => {

    it('T2_R3_01: Zero duplicate ID values in CURATED_USER_REPOSITORY_SEED', async () => {
      const { CURATED_USER_REPOSITORY_SEED } = await loadSeedModule();
      const seen = new Set();
      const duplicates = [];

      for (const item of CURATED_USER_REPOSITORY_SEED) {
        if (seen.has(item.id)) {
          duplicates.push(item.id);
        }
        seen.add(item.id);
      }

      assert.strictEqual(duplicates.length, 0, `Duplicate IDs found in seed: ${JSON.stringify(duplicates)}`);
    });

    it('T2_R3_02: Zero duplicate ID values in STAGED_IMAGES_POOL', async () => {
      const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
      const seen = new Set();
      const duplicates = [];

      for (const item of STAGED_IMAGES_POOL) {
        if (seen.has(item.id)) {
          duplicates.push(item.id);
        }
        seen.add(item.id);
      }

      assert.strictEqual(duplicates.length, 0, `Duplicate IDs found in pool: ${JSON.stringify(duplicates)}`);
    });

    it('T2_R3_03: Every imageUrl in CURATED_USER_REPOSITORY_SEED resolves to an existing file on disk', async () => {
      const { CURATED_USER_REPOSITORY_SEED } = await loadSeedModule();
      const missingFiles = [];

      for (const item of CURATED_USER_REPOSITORY_SEED) {
        const relPath = item.imageUrl.replace(/^\//, '');
        const diskPath = path.resolve(ROOT_DIR, 'public', relPath.replace(/^public\//, ''));
        if (!fs.existsSync(diskPath)) {
          missingFiles.push({ id: item.id, url: item.imageUrl, diskPath });
        }
      }

      assert.strictEqual(
        missingFiles.length,
        0,
        `Missing image files referenced by seed: ${JSON.stringify(missingFiles.slice(0, 5))}`
      );
    });

    it('T2_R3_04: Every imageUrl in STAGED_IMAGES_POOL resolves to an existing file on disk', async () => {
      const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
      const missingFiles = [];

      for (const item of STAGED_IMAGES_POOL) {
        const relPath = item.imageUrl.replace(/^\//, '');
        const diskPath = path.resolve(ROOT_DIR, 'public', relPath.replace(/^public\//, ''));
        if (!fs.existsSync(diskPath)) {
          missingFiles.push({ id: item.id, url: item.imageUrl, diskPath });
        }
      }

      assert.strictEqual(
        missingFiles.length,
        0,
        `Missing image files referenced by pool: ${JSON.stringify(missingFiles.slice(0, 5))}`
      );
    });

    it('T2_R3_05: DISCARDED_STAGED_IDS array remains intact and uncorrupted after repository updates', async () => {
      const { DISCARDED_STAGED_IDS } = await loadSeedModule();
      assert.ok(Array.isArray(DISCARDED_STAGED_IDS), 'DISCARDED_STAGED_IDS must be an array');
      assert.ok(DISCARDED_STAGED_IDS.length >= 87, `Expected at least baseline 87 items, got ${DISCARDED_STAGED_IDS.length}`);
      for (const id of DISCARDED_STAGED_IDS) {
        assert.strictEqual(typeof id, 'string', `Discarded ID must be a string, got ${typeof id}`);
        assert.ok(id.length > 0, 'Discarded ID cannot be empty');
      }
    });

  });

  // ----------------------------------------------------------------------------
  // R4 Boundary Tests
  // ----------------------------------------------------------------------------
  describe('R4 Boundaries: Curation Desk Slicing & HTML Integrity', () => {

    it('T2_R4_01: BulkImageCurationDesk.jsx contains zero remaining occurrences of .slice(0, 4)', () => {
      assert.ok(fs.existsSync(CURATION_DESK_JSX_PATH), `Curation desk component must exist at ${CURATION_DESK_JSX_PATH}`);
      const content = fs.readFileSync(CURATION_DESK_JSX_PATH, 'utf8');
      const matches = content.match(/\.slice\(0,\s*4\)/g);
      assert.strictEqual(
        matches,
        null,
        `BulkImageCurationDesk.jsx still contains ${matches ? matches.length : 0} occurrences of .slice(0, 4)`
      );
    });

    it('T2_R4_02: BulkImageCurationDesk.jsx contains .slice(0, 5) to support 5 branches', () => {
      assert.ok(fs.existsSync(CURATION_DESK_JSX_PATH), `Curation desk component must exist at ${CURATION_DESK_JSX_PATH}`);
      const content = fs.readFileSync(CURATION_DESK_JSX_PATH, 'utf8');
      const matches = content.match(/\.slice\(0,\s*5\)/g);
      assert.ok(
        matches && matches.length > 0,
        'BulkImageCurationDesk.jsx must contain .slice(0, 5) to preserve 5 branches per root'
      );
    });

    it('T2_R4_03: BulkImageCurationDesk.jsx contains missing-image placeholder fallback indicator in onError', () => {
      assert.ok(fs.existsSync(CURATION_DESK_JSX_PATH), `Curation desk component must exist at ${CURATION_DESK_JSX_PATH}`);
      const content = fs.readFileSync(CURATION_DESK_JSX_PATH, 'utf8');
      const hasFallback = content.includes('onError') && (
        content.includes('fallback') ||
        content.includes('Alert') ||
        content.includes('חסרה') ||
        content.includes('placeholder')
      );
      assert.ok(hasFallback, 'BulkImageCurationDesk.jsx onError must render a visible missing-image fallback indicator');
    });

    it('T2_R4_04: public/contact_sheet.html does not contain leaked undefined, null, or [object Object]', () => {
      assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      assert.strictEqual(html.includes('undefined'), false, 'HTML must not contain leaked "undefined" strings');
      assert.strictEqual(html.includes('null'), false, 'HTML must not contain leaked "null" strings');
      assert.strictEqual(html.includes('[object Object]'), false, 'HTML must not contain leaked "[object Object]"');
    });

    it('T2_R4_05: public/contact_sheet.html includes placeholder handling for missing images', () => {
      assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
      const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
      const hasPlaceholder = (
        html.includes('placeholder') ||
        html.includes('חסרה') ||
        html.includes('fallback') ||
        html.includes('onError')
      );
      assert.ok(hasPlaceholder, 'Contact sheet must provide placeholder handling for missing images');
    });

  });

});

// ==============================================================================
// TIER 3: CROSS-FEATURE RELATIONAL PARITY (6 Tests)
// ==============================================================================

describe('Tier 3: Cross-Feature Relational Parity', () => {

  it('T3_01: 1:1 Relational Parity: Enrichment manifest roots map 1:1 to unique pool images', () => {
    const roots = getEnrichmentManifestRoots();
    const mappedImages = new Set();
    const missing = [];

    for (const root of roots) {
      const expectedFile = path.resolve(POOL_DIR, `${root.id}.jpg`);
      if (fs.existsSync(expectedFile)) {
        mappedImages.add(expectedFile);
      } else {
        missing.push(root.id);
      }
    }

    assert.strictEqual(missing.length, 0, `Missing pool files for ${missing.length} roots`);
    assert.strictEqual(mappedImages.size, roots.length, 'Each enrichment root must map to a unique pool image');
  });

  it('T3_02: 1:1 Relational Parity: Enrichment manifest roots map 1:1 to CURATED_USER_REPOSITORY_SEED', async () => {
    const { CURATED_USER_REPOSITORY_SEED } = await loadSeedModule();
    const roots = getEnrichmentManifestRoots();
    const seedMap = new Map(CURATED_USER_REPOSITORY_SEED.map(x => [x.id, x]));

    for (const root of roots) {
      const item = seedMap.get(root.id);
      assert.ok(item, `Enrichment root ${root.id} missing from CURATED_USER_REPOSITORY_SEED`);
      assert.strictEqual(item.title, root.title, `Title mismatch in seed for ${root.id}`);
      assert.strictEqual(item.keywords.length, 5, `Expected 5 keywords in seed for ${root.id}`);
      assert.deepStrictEqual([...item.keywords].sort(), [...root.branches].sort(), `Branch mismatch in seed for ${root.id}`);
    }
  });

  it('T3_03: 1:1 Relational Parity: Enrichment manifest roots map 1:1 to STAGED_IMAGES_POOL', async () => {
    const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
    const roots = getEnrichmentManifestRoots();
    const poolMap = new Map(STAGED_IMAGES_POOL.map(x => [x.id, x]));

    for (const root of roots) {
      const item = poolMap.get(root.id);
      assert.ok(item, `Enrichment root ${root.id} missing from STAGED_IMAGES_POOL`);
      assert.strictEqual(item.title, root.title, `Title mismatch in pool for ${root.id}`);
      assert.strictEqual(item.keywords.length, 5, `Expected 5 keywords in pool for ${root.id}`);
      assert.deepStrictEqual([...item.keywords].sort(), [...root.branches].sort(), `Branch mismatch in pool for ${root.id}`);
    }
  });

  it('T3_04: 1:1 Relational Parity: Seed vs Pool imageUrl parity for all 150 enrichment roots', async () => {
    const { CURATED_USER_REPOSITORY_SEED } = await loadSeedModule();
    const { STAGED_IMAGES_POOL } = await loadStagedImagesPoolModule();
    const roots = getEnrichmentManifestRoots();

    const seedMap = new Map(CURATED_USER_REPOSITORY_SEED.map(x => [x.id, x]));
    const poolMap = new Map(STAGED_IMAGES_POOL.map(x => [x.id, x]));

    for (const root of roots) {
      const seedItem = seedMap.get(root.id);
      const poolItem = poolMap.get(root.id);
      assert.ok(seedItem, `Missing ${root.id} in seed`);
      assert.ok(poolItem, `Missing ${root.id} in pool`);
      assert.strictEqual(seedItem.imageUrl, poolItem.imageUrl, `imageUrl mismatch between seed and pool for ${root.id}`);
    }
  });

  it('T3_05: 1:1 Relational Parity: Seed vs Repository Manifest JSON parity for all active roots', async () => {
    const { CURATED_USER_REPOSITORY_SEED, DISCARDED_STAGED_IDS } = await loadSeedModule();
    assert.ok(fs.existsSync(REPO_MANIFEST_JSON_PATH), `Manifest JSON must exist at ${REPO_MANIFEST_JSON_PATH}`);
    const json = JSON.parse(fs.readFileSync(REPO_MANIFEST_JSON_PATH, 'utf8'));

    // Zero duplicate IDs guard in manifest JSON
    const seen = new Set();
    const duplicates = [];
    for (const root of json.roots || []) {
      if (seen.has(root.id)) duplicates.push(root.id);
      seen.add(root.id);
    }
    assert.strictEqual(duplicates.length, 0, `Duplicate IDs found in manifest JSON: ${JSON.stringify(duplicates)}`);

    const discardedSet = new Set(DISCARDED_STAGED_IDS);
    const activeSeedRoots = CURATED_USER_REPOSITORY_SEED.filter(x => !discardedSet.has(x.id));
    const jsonRootsMap = new Map((json.roots || []).map(x => [x.id, x]));

    for (const seedItem of activeSeedRoots) {
      const jsonRoot = jsonRootsMap.get(seedItem.id);
      assert.ok(jsonRoot, `Active seed item ${seedItem.id} missing from life_quest_repository_manifest.json`);
      assert.strictEqual(jsonRoot.title, seedItem.title, `Title mismatch for ${seedItem.id}`);
    }

    // Enforce branch parity for all 150 enrichment roots between manifest and JSON
    const enrichmentRoots = getEnrichmentManifestRoots();
    for (const root of enrichmentRoots) {
      const jsonRoot = jsonRootsMap.get(root.id);
      assert.ok(jsonRoot, `Enrichment root ${root.id} missing from manifest JSON`);
      assert.strictEqual(jsonRoot.title, root.title, `Title mismatch in manifest JSON for ${root.id}`);
      assert.deepStrictEqual(
        [...(jsonRoot.branches || [])].sort(),
        [...root.branches].sort(),
        `Branch mismatch in manifest JSON for ${root.id}`
      );
    }
  });

  it('T3_06: 1:1 Relational Parity: Enrichment manifest roots map 1:1 to Contact Sheet entries', () => {
    assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), `Contact sheet HTML must exist at ${CONTACT_SHEET_HTML_PATH}`);
    const html = fs.readFileSync(CONTACT_SHEET_HTML_PATH, 'utf8');
    const roots = getEnrichmentManifestRoots();

    for (const root of roots) {
      assert.ok(
        html.includes(root.id) || html.includes(root.title),
        `Enrichment root ${root.id} (${root.title}) not found in contact sheet`
      );
    }
  });

});

// ==============================================================================
// TIER 4: REAL-WORLD APPLICATION SCENARIOS (5 Tests)
// ==============================================================================

describe('Tier 4: Real-World Application Scenarios', () => {

  it('T4_01: CLI Scenario: node scripts/branch_validator.mjs exits with code 0 on valid manifest', () => {
    const res = spawnSync('node', ['scripts/branch_validator.mjs'], {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    });
    assert.strictEqual(
      res.status,
      0,
      `scripts/branch_validator.mjs exited with non-zero code ${res.status}.\nOutput:\n${res.stdout}\n${res.stderr}`
    );
    assert.ok(res.stdout.includes('FINAL VALIDATION SUMMARY:'), 'CLI stdout must include summary banner');
    assert.ok(res.stdout.includes('SUCCESS (code 0)'), 'CLI stdout must report SUCCESS (code 0)');
  });

  it('T4_02: CLI Scenario: node scripts/branch_validator.mjs exits with code 1 on overlap violations', () => {
    const fixturePath = path.resolve(os.tmpdir(), 'fixture_overlap_test.json');
    try {
      fs.writeFileSync(fixturePath, JSON.stringify([
        { id: 'fixture_invalid', title: 'שקע חשמל', branches: ['חשמל', 'בנק'] }
      ], null, 2));

      const res = spawnSync('node', ['scripts/branch_validator.mjs', fixturePath], {
        cwd: ROOT_DIR,
        encoding: 'utf8'
      });

      assert.strictEqual(
        res.status,
        1,
        `Expected branch_validator.mjs to exit with code 1 on overlap violation, got ${res.status}`
      );
      assert.ok(
        res.stderr.includes('overlaps') || res.stdout.includes('validation issues') || res.stderr.includes('validation issues'),
        'CLI output must detail the detected overlap violation'
      );
    } finally {
      if (fs.existsSync(fixturePath)) {
        fs.unlinkSync(fixturePath);
      }
    }
  });

  it('T4_03: CLI Scenario: node scripts/generate_repository_manifest.mjs generates manifests with 588 active roots', () => {
    const res = spawnSync('node', ['scripts/generate_repository_manifest.mjs'], {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    });
    assert.strictEqual(
      res.status,
      0,
      `generate_repository_manifest.mjs exited with code ${res.status}: ${res.stderr}`
    );

    assert.ok(fs.existsSync(REPO_MANIFEST_JSON_PATH), 'Manifest JSON must exist');
    assert.ok(fs.existsSync(REPO_MANIFEST_MD_PATH), 'Manifest MD must exist');

    const json = JSON.parse(fs.readFileSync(REPO_MANIFEST_JSON_PATH, 'utf8'));
    assert.strictEqual(
      json.metadata.totalActiveRoots,
      588,
      `Expected totalActiveRoots to equal 588, got ${json.metadata.totalActiveRoots}`
    );
    assert.strictEqual(
      json.roots.length,
      588,
      `Expected 588 roots in JSON, got ${json.roots.length}`
    );

    const md = fs.readFileSync(REPO_MANIFEST_MD_PATH, 'utf8');
    assert.ok(md.includes('588'), 'Markdown manifest header must mention 588 active roots');
  });

  it('T4_04: CLI Scenario: node scripts/generate_contact_sheet.mjs generates public/contact_sheet.html', () => {
    assert.ok(
      fs.existsSync(GENERATE_CONTACT_SHEET_SCRIPT),
      `generate_contact_sheet.mjs must exist at ${GENERATE_CONTACT_SHEET_SCRIPT}`
    );

    const startTime = Date.now();
    const res = spawnSync('node', ['scripts/generate_contact_sheet.mjs'], {
      cwd: ROOT_DIR,
      encoding: 'utf8'
    });
    assert.strictEqual(
      res.status,
      0,
      `generate_contact_sheet.mjs exited with code ${res.status}: ${res.stderr}`
    );

    assert.ok(fs.existsSync(CONTACT_SHEET_HTML_PATH), 'public/contact_sheet.html must be generated');
    const stat = fs.statSync(CONTACT_SHEET_HTML_PATH);
    assert.ok(stat.mtimeMs >= startTime - 1000, 'public/contact_sheet.html mtime was not updated');
  });

  it('T4_05: Data Pipeline Scenario: BulkImageCurationDesk preserves all 5 branches for enrichment items', () => {
    assert.ok(fs.existsSync(CURATION_DESK_JSX_PATH), `Curation desk component must exist at ${CURATION_DESK_JSX_PATH}`);
    const content = fs.readFileSync(CURATION_DESK_JSX_PATH, 'utf8');

    // Verify .slice(0, 4) is removed
    const hasSlice4 = /\.slice\(0,\s*4\)/.test(content);
    assert.strictEqual(
      hasSlice4,
      false,
      'BulkImageCurationDesk still contains .slice(0, 4) truncating 5-branch items'
    );

    // Verify simulation of curation desk pipeline preserves all 5 branches
    const roots = getEnrichmentManifestRoots();
    const sample = roots[0];
    assert.ok(sample, 'Must have sample enrichment root');
    assert.strictEqual(sample.branches.length, 5, 'Sample root must have 5 branches');

    const itemTitle = sample.title;
    const titleWords = new Set(itemTitle.replace(/[()\/\"'’`\-]/g, ' ').split(/\s+/).map(w => w.toLowerCase()));
    const cleanKeywords = sample.branches.filter(k => {
      const lk = k.toLowerCase();
      if (lk === itemTitle.toLowerCase()) return false;
      if (titleWords.has(lk)) return false;
      if (lk.includes(' ')) return false;
      return true;
    });

    const deskSliceLimit = content.includes('.slice(0, 5)') ? 5 : 4;
    const processedKeywords = cleanKeywords.slice(0, deskSliceLimit);
    assert.strictEqual(
      processedKeywords.length,
      5,
      `Curation desk data pipeline should preserve 5 keywords, got ${processedKeywords.length}`
    );
  });

});
