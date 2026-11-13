import { CURATED_USER_REPOSITORY_SEED } from '../src/data/curatedUserRepositorySeed.js';

const items = CURATED_USER_REPOSITORY_SEED;
const issues = [];

for (const item of items) {
  const title = (item.title || item.name || '').trim();
  const titleWords = new Set(
    title.toLowerCase().replace(/[()\/\"'’`\-]/g, ' ').split(/\s+/).filter(w => w.length > 1)
  );
  const kws = item.keywords || [];
  const rootMatches = kws.filter(k => {
    const lk = k.toLowerCase();
    if (lk === title.toLowerCase()) return true;
    if (titleWords.has(lk)) return true;
    if (title.toLowerCase().includes(lk) && lk.length >= 3) return true;
    return false;
  });
  const multiWords = kws.filter(k => k.includes(' '));
  const suspicious = kws.filter(k => ['לנקות', 'לצאת עם', 'טיול עם', 'שבת'].includes(k));
  const tooFew = kws.length < 2;

  if (rootMatches.length > 0 || multiWords.length > 0 || suspicious.length > 0 || tooFew) {
    issues.push({
      id: item.id,
      title,
      keywords: kws,
      rootMatches,
      multiWords,
      suspicious,
      tooFew
    });
  }
}

console.log(`Found ${issues.length} items with issues:`);
for (const iss of issues) {
  console.log(`- ID: ${iss.id} | Title: "${iss.title}"`);
  console.log(`  Current: ${JSON.stringify(iss.keywords)}`);
  if (iss.rootMatches.length) console.log(`  Root overlaps: ${JSON.stringify(iss.rootMatches)}`);
  if (iss.multiWords.length) console.log(`  Multi-words: ${JSON.stringify(iss.multiWords)}`);
  if (iss.suspicious.length) console.log(`  Suspicious: ${JSON.stringify(iss.suspicious)}`);
  if (iss.tooFew) console.log(`  Too few keywords!`);
}

