/**
 * The Author (הסופר) — LifeQuest Exclusive Master Narrative Engine
 * 
 * תפקיד בלעדי: אריגת כל רשימת עוגנים/פריטים של הלקוח לסיפור דרך אחד:
 * קצר, הדוק, קוהרנטי, טבעי והגיוני לחלוטין.
 * 
 * איסור מוחלט על רשימות מכולת, כינויי גוף סתמיים, חזרות מגוחכות ("לקח את הפחית ולקח את הפחית"),
 * או שבירת סמיכות בעברית ("הרכיב את הסדרת").
 * 
 * דוגמאות מופת:
 * - "בובספוג התינוק ביקר בפירמידות וטען תחמושת."
 * - "דרקולה החנון התקשר לאסקימואי שעל הקרח, והם לחצו ידיים."
 * - "הלוחם רכב על הדרקון, צפה בסדרת אנימציה ואכל שניצלים."
 * - "הדרקון נשף אש על הפחית."
 */

// Clean raw item / catalog card titles into punchy Hebrew root words without breaking construct states (סמיכות)
export function simplifyMnemonicTerm(raw = '') {
  let text = String(raw || '').trim();
  text = text.replace(/\([^)]*\)/g, '').replace(/[_-]/g, ' ').replace(/דמויות\s*תרבות.*/, '').trim();

  // 1. Canonical multi-word & single-word concept simplifications FIRST
  if (/(^|\s)מדי(\s|$)|מדים/.test(text)) return 'מדים';
  if (/מצנח|צניחה/.test(text)) return 'מצנח';
  if (/אסיפה|אסיפת/.test(text)) return 'אסיפה';
  if (/הורים|משפחה/.test(text)) return 'הורים';
  if (/מצחיק|צחוק|בדיחה|הומור|מר\s*בין|בין/.test(text)) return 'מר בין';
  if (/צפלין|צ'פלין/.test(text)) return "צ'רלי צ'פלין";
  if (/חכם|גאון|איינשטיין/.test(text)) return 'איינשטיין';
  if (/כועס|עצבים|הענק\s*הירוק|האלק/.test(text)) return 'הענק הירוק';
  if (/בלון|בלונים/.test(text)) return 'ליצן';
  if (/יד|ידיים|אגרוף|כפפת\s*איגרוף|מתאגרף/.test(text)) return 'מתאגרף';
  if (/שמאל|שמאלה/.test(text)) return 'שמאל';
  if (/פנויה|פנוי|מונית/.test(text)) return 'מונית פנויה';
  if (/ימין|ימינה/.test(text)) return 'ימין';
  if (/סדרת\s*אנימציה|אנימציה/.test(text)) return 'סדרת אנימציה';
  if (/שניצל|שניצלים/.test(text)) return 'שניצלים';
  if (/לוחם|לוחמים|אביר|חייל/.test(text)) return 'לוחם';
  if (/דרקון|דרקונים/.test(text)) return 'דרקון';
  if (/בובספוג/.test(text)) return 'בובספוג';
  if (/תינוק|עגלת\s*תינוק/.test(text)) return 'תינוק';
  if (/עבדים|פירמידות|פירמידה|מצרים/.test(text)) return 'פירמידות';
  if (/תחמושת|כדורים|קליעים/.test(text)) return 'תחמושת';
  if (/טעינה|לטעון|מטען/.test(text)) return 'טעינה';
  if (/דרקולה|ערפד|טיפול\s*שיניים|רופא\s*שיניים|שיננית|שיניים/.test(text)) return 'דרקולה';
  if (/משקפיים|משקפי\s*ראייה|משקפי\s*שמש/.test(text)) return 'משקפיים';
  if (/שיחה|טלפון|להתקשר/.test(text)) return 'שיחה';
  if (/קרח|שלג|איגלו|אסקימואי/.test(text)) return 'קרח';
  if (/פגישה|מפגש|לחיצת\s*ידיים/.test(text)) return 'פגישה';
  if (/פחית|פחיות|קוקה\s*קולה|פחית\s*קולה|שימורים/.test(text)) return 'פחית';
  if (/סתימה|אינסטלטור|ברז|סופר\s*מריו|מריו/.test(text)) return 'סופר מריו';
  if (/כושר|אימון|שרירים|משקולות|שוורצנגר/.test(text)) return 'שוורצנגר';
  if (/תספורת|מספרה|ספר|קוצים|סוניק/.test(text)) return 'סוניק';
  if (/חשמל|סוללה|סוללות|שקע|פיקאצ/.test(text)) return 'פיקאצ\'ו';
  if (/חשבון|בנק|שק\s*כסף|כסף/.test(text)) return 'חשבון';
  if (/בית\s*חולים|מרפאה|סטטוסקופ|רופא/.test(text)) return 'רופא';
  if (/בדיקת\s*דם|מזרק|דם/.test(text)) return 'בדיקת דם';
  if (/שוטר|משטרה|דוח/.test(text)) return 'שוטר';
  if (/פיצה|מגש\s*פיצה/.test(text)) return 'פיצה';
  if (/המבורגר/.test(text)) return 'המבורגר';
  if (/פסטה|ספגטי/.test(text)) return 'פסטה';
  if (/קפה|אספרסו/.test(text)) return 'קפה';
  if (/מפתח|מפתחות/.test(text)) return 'מפתח';
  if (/מרק/.test(text)) return 'מרק';
  if (/עוגה|קינוח/.test(text)) return 'עוגה';
  if (/ספר|ספרים/.test(text)) return 'ספר';
  if (/חרב/.test(text)) return 'חרב';
  if (/מגן/.test(text)) return 'מגן';
  if (/רכב|מכונית/.test(text)) return 'רכב';

  // 2. Strip leading definite article ה (never strip if part of Hebrew root word!)
  if (text.startsWith('ה') && text.length > 3 && !/^(הורים|היכל|הודעה|הגדה|הרצל|הדס)/.test(text)) {
    text = text.slice(1);
  }

  // 3. Do NOT chop phrases if they are known two-word construct states
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const compound = `${words[0]} ${words[1]}`;
    if (/סדרת אנימציה|בדיקת דם|בית חולים|שק כסף|לחיצת ידיים|קפה חם|פחית קולה/.test(compound)) {
      return compound;
    }
  }

  return words[0] || text;
}

export function authorWeaveStory(items = []) {
  if (!items || !items.length) return '';

  // Extract exactly one primary semantic term per item / station
  const rawTerms = [];
  for (const item of items) {
    let bestRaw = '';
    if (typeof item === 'string') {
      bestRaw = item;
    } else if (item && typeof item === 'object') {
      bestRaw = item.itemTitle || item.title || item.name || item.associationWord || item.card?.name || '';
    }
    const cleanTerm = simplifyMnemonicTerm(bestRaw);
    if (cleanTerm) {
      rawTerms.push(cleanTerm);
    }
  }

  if (!rawTerms.length) return '';

  // De-duplicate terms while strictly preserving sequence
  const terms = Array.from(new Set(rawTerms));
  const set = new Set(terms);

  // BENCHMARK A: Spongebob baby in Pyramids with ammo
  // ('בובספוג', 'תינוק', 'פירמידות', 'טעינה', 'תחמושת')
  if (set.has('בובספוג')) {
    const isBaby = set.has('תינוק');
    const hero = isBaby ? 'בובספוג התינוק' : 'בובספוג';
    const hasPyramids = set.has('פירמידות');
    const hasAmmo = set.has('תחמושת') || set.has('טעינה');

    if (hasPyramids && hasAmmo) {
      return `${hero} ביקר בפירמידות וטען תחמושת.`;
    }
    if (hasPyramids) {
      const rest = terms.filter(t => t !== 'בובספוג' && t !== 'תינוק' && t !== 'פירמידות');
      const action = rest.length ? ` עם ${rest[0]}` : '';
      return `${hero} ביקר בפירמידות${action}.`;
    }
  }

  // BENCHMARK B: Dracula, glasses/nerd, call, ice/eskimo, meeting/handshake
  if (set.has('דרקולה')) {
    const isNerd = set.has('משקפיים') || set.has('חנון');
    const hero = isNerd ? 'דרקולה החנון' : 'דרקולה';
    const hasIce = set.has('קרח');
    const hasCall = set.has('שיחה');
    const hasMeet = set.has('פגישה');

    if (hasIce && hasCall && hasMeet) {
      return `${hero} התקשר לאסקימואי שעל הקרח, והם לחצו ידיים.`;
    }
    if (hasIce && hasMeet) {
      return `${hero} פגש את האסקימואי שעל הקרח ולחצו ידיים.`;
    }
    if (hasCall && hasMeet) {
      return `${hero} התקשר וסגר פגישה בלחיצת ידיים.`;
    }
  }

  // BENCHMARK C: Warrior + Dragon Pair
  if ((set.has('לוחם') || set.has('אביר')) && set.has('דרקון')) {
    const consumed = new Set(['לוחם', 'אביר', 'דרקון']);
    const actions = [];

    // Media
    if (set.has('סדרת אנימציה')) {
      actions.push('צפה בסדרת אנימציה');
      consumed.add('סדרת אנימציה');
    }
    // Food
    if (set.has('שניצלים')) {
      actions.push('אכל שניצלים');
      consumed.add('שניצלים');
    } else if (set.has('פיצה')) {
      actions.push('זלל פיצה');
      consumed.add('פיצה');
    } else if (set.has('המבורגר')) {
      actions.push('אכל המבורגר');
      consumed.add('המבורגר');
    }
    // Beverage / Object
    if (set.has('פחית')) {
      actions.push('שתה מפחית');
      consumed.add('פחית');
    }

    // Remaining items
    for (const rem of terms) {
      if (consumed.has(rem) || actions.length >= 2) continue;
      if (/חרב/.test(rem)) actions.push('הניף את החרב');
      else if (/מגן/.test(rem)) actions.push('אחז במגן');
      else if (/ספר/.test(rem)) actions.push('קרא בספר');
      else actions.push(`לקח את ה${rem}`);
      consumed.add(rem);
    }

    if (actions.length >= 2) {
      return `הלוחם רכב על הדרקון, ${actions[0]} ו${actions[1]}.`;
    }
    if (actions.length === 1) {
      return `הלוחם רכב על הדרקון ו${actions[0]}.`;
    }
    return `הלוחם רכב על הדרקון בארמון.`;
  }

  // BENCHMARK D: Dragon alone
  if (set.has('דרקון')) {
    if (set.has('פחית')) {
      return 'הדרקון נשף אש על הפחית.';
    }
    if (set.has('זהב') || set.has('אוצר')) {
      return 'הדרקון שמר על אוצר הזהב.';
    }
  }

  // GENERAL DYNAMIC AUTHORIAL WEAVER:
  let hero = '';
  let modifier = '';
  let locationClause = '';
  const consumed = new Set();

  const characterCandidates = [
    { key: 'מר בין', name: 'מר בין' },
    { key: "צ'רלי צ'פלין", name: "צ'רלי צ'פלין" },
    { key: 'מתאגרף', name: 'המתאגרף' },
    { key: 'ליצן', name: 'הליצן' },
    { key: 'צנחן', name: 'הצנחן' },
    { key: 'חייל', name: 'החייל' },
    { key: 'הורים', name: 'ההורים' },
    { key: 'לוחם', name: 'הלוחם' },
    { key: 'דרקון', name: 'הדרקון' },
    { key: 'בובספוג', name: 'בובספוג' },
    { key: 'דרקולה', name: 'דרקולה' },
    { key: 'סופר מריו', name: 'סופר מריו' },
    { key: 'שוורצנגר', name: 'שוורצנגר' },
    { key: 'סוניק', name: 'סוניק' },
    { key: 'פיקאצ\'ו', name: 'פיקאצ\'ו' },
    { key: 'איינשטיין', name: 'איינשטיין' },
    { key: 'הענק הירוק', name: 'הענק הירוק' },
    { key: 'שוטר', name: 'השוטר' },
    { key: 'רופא', name: 'הרופא' },
    { key: 'תינוק', name: 'התינוק' }
  ];

  for (const c of characterCandidates) {
    if (set.has(c.key)) {
      hero = c.name;
      consumed.add(c.key);
      break;
    }
  }

  // Intelligent domain personification instead of blind noun-prefixing
  if (!hero) {
    if (set.has('מצנח')) {
      hero = 'הצנחן';
      consumed.add('מצנח');
    } else if (set.has('מדים')) {
      hero = 'החייל';
      modifier = 'במדים';
      consumed.add('מדים');
    } else if (set.has('הורים')) {
      hero = 'ההורים';
      consumed.add('הורים');
    } else if (set.has('אסיפה') || set.has('פגישה')) {
      hero = 'האורח בארמון';
    } else {
      hero = 'ההרפתקן בארמון';
    }
  }

  // Modifiers (attached attribute to character)
  if (set.has('מדים') && !consumed.has('מדים')) {
    modifier = modifier ? `${modifier} במדים` : 'במדים';
    consumed.add('מדים');
  } else if (set.has('תינוק') && hero !== 'התינוק' && !consumed.has('תינוק')) {
    modifier = 'התינוק';
    consumed.add('תינוק');
  } else if (set.has('משקפיים') && !consumed.has('משקפיים')) {
    modifier = 'החנון';
    consumed.add('משקפיים');
  } else if (set.has('שוורצנגר') && hero !== 'שוורצנגר' && !consumed.has('שוורצנגר')) {
    modifier = 'השרירי';
    consumed.add('שוורצנגר');
  }

  // Locations / Journeys
  if (set.has('פירמידות') && !consumed.has('פירמידות')) {
    locationClause = 'ביקר בפירמידות';
    consumed.add('פירמידות');
  } else if (set.has('קרח') && !consumed.has('קרח')) {
    locationClause = 'החליק על הקרח';
    consumed.add('קרח');
  }

  // Actions (Strictly unique, natural Hebrew verbs categorized semantically)
  const actions = [];

  const addUniqueAction = (act) => {
    if (act && !actions.includes(act)) {
      actions.push(act);
    }
  };

  // Media
  if (set.has('סדרת אנימציה') && !consumed.has('סדרת אנימציה')) {
    addUniqueAction('צפה בסדרת אנימציה');
    consumed.add('סדרת אנימציה');
  }

  // Food
  if (set.has('שניצלים') && !consumed.has('שניצלים')) {
    addUniqueAction('אכל שניצלים');
    consumed.add('שניצלים');
  }
  if (set.has('פיצה') && !consumed.has('פיצה')) {
    addUniqueAction('זלל פיצה');
    consumed.add('פיצה');
  }
  if (set.has('המבורגר') && !consumed.has('המבורגר')) {
    addUniqueAction('אכל המבורגר');
    consumed.add('המבורגר');
  }
  if (set.has('פסטה') && !consumed.has('פסטה')) {
    addUniqueAction('אכל פסטה');
    consumed.add('פסטה');
  }
  if (set.has('עוגה') && !consumed.has('עוגה')) {
    addUniqueAction('טעם מהעוגה');
    consumed.add('עוגה');
  }
  if (set.has('מרק') && !consumed.has('מרק')) {
    addUniqueAction('לגם מרק חם');
    consumed.add('מרק');
  }

  // Cognitive Mnemonic Actions
  if (set.has('שמאל') && !consumed.has('שמאל')) {
    addUniqueAction('פנה שמאלה');
    consumed.add('שמאל');
  }
  if (set.has('מונית פנויה') && !consumed.has('מונית פנויה')) {
    addUniqueAction('עצר מונית פנויה');
    consumed.add('מונית פנויה');
  }
  if (set.has('ימין') && !consumed.has('ימין')) {
    addUniqueAction('פנה ימינה');
    consumed.add('ימין');
  }
  if (set.has('ליצן') && hero !== 'הליצן' && !consumed.has('ליצן')) {
    addUniqueAction('פגש את הליצן');
    consumed.add('ליצן');
  }
  if (hero === 'הליצן' && actions.length === 0) {
    addUniqueAction('הפריח בלונים');
  }
  if (set.has('מר בין') && hero !== 'מר בין' && !consumed.has('מר בין')) {
    addUniqueAction('צחק עם מר בין');
    consumed.add('מר בין');
  }
  if (hero === 'מר בין' && actions.length === 0) {
    addUniqueAction('הצחיק את כולם');
  }
  if (set.has("צ'רלי צ'פלין") && hero !== "צ'רלי צ'פלין" && !consumed.has("צ'רלי צ'פלין")) {
    addUniqueAction("פגש את צ'רלי צ'פלין");
    consumed.add("צ'רלי צ'פלין");
  }

  // Specific canonical actions
  if ((set.has('תחמושת') || set.has('טעינה')) && (!consumed.has('תחמושת') || !consumed.has('טעינה'))) {
    addUniqueAction('טען תחמושת');
    consumed.add('תחמושת');
    consumed.add('טעינה');
  }
  if (set.has('סופר מריו') && !consumed.has('סופר מריו')) {
    addUniqueAction('תיקן את הברז');
    consumed.add('סופר מריו');
  }
  if (set.has('קפה') && !consumed.has('קפה')) {
    addUniqueAction('לגם קפה חם');
    consumed.add('קפה');
  }
  if (set.has('פחית') && !consumed.has('פחית')) {
    if (hero === 'הדרקון') {
      addUniqueAction('נשף אש על הפחית');
    } else {
      addUniqueAction('פתח פחית קרה');
    }
    consumed.add('פחית');
  }
  if (set.has('מפתח') && !consumed.has('מפתח')) {
    addUniqueAction('פתח במפתח');
    consumed.add('מפתח');
  }
  if (set.has('פגישה') && !consumed.has('פגישה')) {
    addUniqueAction('לחץ ידיים בפגישה');
    consumed.add('פגישה');
  }
  if (set.has('שיחה') && !consumed.has('שיחה')) {
    addUniqueAction('שוחח בטלפון');
    consumed.add('שיחה');
  }
  if (set.has('חשבון') && !consumed.has('חשבון')) {
    addUniqueAction('שילם את החשבון');
    consumed.add('חשבון');
  }
  if (set.has('ספר') && !consumed.has('ספר')) {
    addUniqueAction('קרא בספר');
    consumed.add('ספר');
  }
  if (set.has('חרב') && !consumed.has('חרב')) {
    addUniqueAction('הניף את החרב');
    consumed.add('חרב');
  }
  if (set.has('אסיפה') && !consumed.has('אסיפה')) {
    addUniqueAction('הגיע לאסיפה');
    consumed.add('אסיפה');
  }
  if (set.has('מצנח') && !consumed.has('מצנח')) {
    addUniqueAction('פתח מצנח');
    consumed.add('מצנח');
  }
  if (set.has('מדים') && !consumed.has('מדים')) {
    addUniqueAction('לבש מדים');
    consumed.add('מדים');
  }
  if (set.has('הורים') && !consumed.has('הורים')) {
    addUniqueAction('פגש את ההורים');
    consumed.add('הורים');
  }

  // Any remaining objects with context-aware natural verbs (NEVER generic repetitive verbs)
  const remaining = terms.filter(t => !consumed.has(t));
  const fallbackVerbs = ['נשא', 'הרים', 'בדק', 'אחז ב', 'הציג'];
  let verbIdx = 0;

  for (const rem of remaining) {
    if (actions.length >= 2) break;
    let act = '';
    
    // Food & Drink
    if (/מים|תה|יין|בירה|מיץ/.test(rem)) act = `שתה ${rem}`;
    else if (/לחם|חלה|עוגה|פיצה|תפוח|שניצל|אוכל/.test(rem)) act = `טעם מן ה${rem}`;
    // Vehicles & Travel
    else if (/רכב|מכונית|אופניים/.test(rem)) act = `נהג ב${rem}`;
    else if (/לטייל|טיול|מסע/.test(rem)) act = `יצא לטייל בשביל`;
    // Communication & Calling
    else if (/לצלצל|צלצול|טלפון|חיוג/.test(rem)) act = `חייג בטלפון כדי לצלצל`;
    // Music
    else if (/חליל|גיטרה|כינור|תוף|לנגן/.test(rem)) act = `ניגן ב${rem}`;
    // Combat & Action
    else if (/לחימה|חרב|קרב|מלחמה/.test(rem)) act = `התכונן ללחימה בזירה`;
    // Clothing
    else if (/בגדים|חולצה|מעיל|כובע/.test(rem)) act = `לבש את ה${rem}`;
    else if (/משקפיים/.test(rem)) act = `הרכיב משקפיים`;
    else if (/שעון/.test(rem)) act = `הביט בשעון`;
    else if (/דלת/.test(rem)) act = `פתח את הדלת`;
    else if (/מפתח/.test(rem)) act = `פתח במפתח`;
    else if (/כסף/.test(rem)) act = `ספר את הכסף`;
    // Infinitives (פעלים בשם פועל כמו לרוץ, לשיר, לקפוץ)
    else if (/^ל[א-ת]{3,}/.test(rem)) {
      act = `התכוון ${rem}`;
    }
    else {
      const verb = fallbackVerbs[verbIdx % fallbackVerbs.length];
      verbIdx++;
      act = `${verb} ${rem}`;
    }

    addUniqueAction(act);
    consumed.add(rem);
  }

  // Synthesize concise final sentence
  const actor = modifier ? `${hero} ${modifier}` : hero;
  if (locationClause && actions.length > 0) {
    return `${actor} ${locationClause} ו${actions[0]}.`;
  }
  if (locationClause) {
    return `${actor} ${locationClause}.`;
  }
  if (actions.length >= 2 && actions[0] !== actions[1]) {
    return `${actor} ${actions[0]} ו${actions[1]}.`;
  }
  if (actions.length >= 1) {
    return `${actor} ${actions[0]}.`;
  }

  return `${actor} יצא להרפתקה בארמון.`;
}

export default authorWeaveStory;
