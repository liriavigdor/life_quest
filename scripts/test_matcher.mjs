function normalizeHebrewLetters(str) {
  if (!str) return '';
  return str
    .replace(/[״"'`()\[\]{}.,:;!?\-–—\/\\]+/g, '')
    .replace(/ם/g, 'מ')
    .replace(/ן/g, 'נ')
    .replace(/ץ/g, 'צ')
    .replace(/ף/g, 'פ')
    .replace(/ך/g, 'כ');
}

export function hebrewWordMatches(searchWord = '', targetText = '') {
  if (!searchWord || !targetText) return false;
  
  const rawSearch = String(searchWord).trim().toLowerCase();
  const rawTarget = String(targetText).trim().toLowerCase();
  if (!rawSearch) return false;

  const normSearch = normalizeHebrewLetters(rawSearch);
  const normTarget = normalizeHebrewLetters(rawTarget);

  if (normSearch === normTarget) return true;

  const targetTokens = rawTarget.split(/[,\s+./]+/).filter(Boolean);
  const prefixes = ['וה', 'שב', 'של', 'מה', 'וכ', 'וב', 'ול', 'ה', 'ו', 'ב', 'ל', 'כ', 'מ', 'ש'];

  // Search variants (in normalized form)
  const searchVariants = new Set([normSearch]);
  
  for (const p of prefixes) {
    const normP = normalizeHebrewLetters(p);
    if (normSearch.startsWith(normP) && normSearch.length - normP.length >= 2) {
      searchVariants.add(normSearch.slice(normP.length));
    }
  }

  // Construct ending ה <-> ת
  if (normSearch.endsWith('ה') && normSearch.length >= 3) {
    searchVariants.add(normSearch.slice(0, -1) + 'ת');
    searchVariants.add(normSearch.slice(0, -1) + 'ות');
  }
  if (normSearch.endsWith('ת') && normSearch.length >= 3) {
    searchVariants.add(normSearch.slice(0, -1) + 'ה');
    searchVariants.add(normSearch.slice(0, -1) + 'ות');
  }
  if (normSearch.endsWith('ות') && normSearch.length >= 4) {
    searchVariants.add(normSearch.slice(0, -2) + 'ה');
    searchVariants.add(normSearch.slice(0, -2) + 'ת');
    searchVariants.add(normSearch.slice(0, -2));
  }
  if (normSearch.endsWith('ימ') && normSearch.length >= 4) { // ים normalized is ימ
    searchVariants.add(normSearch.slice(0, -2));
  }

  // Check each token in target
  for (const rawToken of targetTokens) {
    const normToken = normalizeHebrewLetters(rawToken);
    if (!normToken) continue;

    if (searchVariants.has(normToken)) return true;

    // Prefixes on target token
    for (const p of prefixes) {
      const normP = normalizeHebrewLetters(p);
      if (normToken.startsWith(normP) && normToken.length - normP.length >= 2) {
        const stripped = normToken.slice(normP.length);
        if (searchVariants.has(stripped)) return true;
      }
    }

    // Morphology on target token
    if (normToken.endsWith('ת') && normToken.length >= 3) {
      if (searchVariants.has(normToken.slice(0, -1) + 'ה')) return true;
    }
    if (normToken.endsWith('ות') && normToken.length >= 4) {
      if (searchVariants.has(normToken.slice(0, -2) + 'ה')) return true;
      if (searchVariants.has(normToken.slice(0, -2) + 'ת')) return true;
      if (searchVariants.has(normToken.slice(0, -2))) return true;
    }
    if (normToken.endsWith('ימ') && normToken.length >= 4) {
      if (searchVariants.has(normToken.slice(0, -2))) return true;
    }

    // Stem prefix match (e.g. משקפיים / משקפי, פטריות / פטריה)
    if (normSearch.length >= 4 && normToken.length >= 4) {
      if (normToken.startsWith(normSearch) || normSearch.startsWith(normToken)) {
        return true;
      }
    }
  }

  return false;
}

console.log('False match test (רטטוי in בוי טוי):', hebrewWordMatches('רטטוי', 'בוי טוי'));
console.log('Valid match test (רטטוי in מנת רטטוי):', hebrewWordMatches('רטטוי', 'מנת רטטוי'));
console.log('Valid match test (רטטוי in רטטוי):', hebrewWordMatches('רטטוי', 'רטטוי'));

console.log('Test 1 (דמעה in דמעת התרגשות בעין):', hebrewWordMatches('דמעה', 'דמעת התרגשות בעין'));
console.log('Test 2 (דמעה in דמעת):', hebrewWordMatches('דמעה', 'דמעת'));
console.log('Test 3 (דמעה in דמעות):', hebrewWordMatches('דמעה', 'דמעות'));
console.log('Test 4 (מרק in סיר מרק מהביל):', hebrewWordMatches('מרק', 'סיר מרק מהביל'));
console.log('Test 5 (טלפון in טלפונים ניידים):', hebrewWordMatches('טלפון', 'טלפונים ניידים'));
console.log('Test 6 (ביקורת in מכונת כתיבה שיורה ביקורות):', hebrewWordMatches('ביקורת', 'מכונת כתיבה שיורה ביקורות'));
console.log('Test 7 (שף in כובע שף לבן):', hebrewWordMatches('שף', 'כובע שף לבן'));
console.log('Test 8 (מפתחות in צרור מפתחות לאוטו):', hebrewWordMatches('מפתחות', 'צרור מפתחות לאוטו'));
console.log('Test 9 (מפתח in מפתחות לאוטו):', hebrewWordMatches('מפתח', 'מפתחות לאוטו'));
console.log('Test 10 (משקפיים in משקפי שמש):', hebrewWordMatches('משקפיים', 'משקפי שמש'));
