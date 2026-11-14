/**
 * LifeQuest Deterministic Narrative & Associative Engine (Make-It-Meme Style)
 * 
 * עקרונות הליבה:
 * 1. אפס כפילויות, אפס סלבס מאולצים! אם אין סלב ברשימה, לא ממציאים את אלביס או פלפס.
 * 2. התאמה מדויקת של 5 מילות מפתח מובהקות מתוך המאגר המורחב (הון -> שטרות, סיכון -> פצצה, אמריקה -> קפטן אמריקה, כיף -> רכבת הרים, מיטה -> מיטה נוחה).
 * 3. פריטים שאין להם התאמה מקבלים כרטיסיית SVG עשירה ומעוצבת עם המילה עצמה וסמל עוגן מוזהב, במקום תמונת ברירת מחדל לא קשורה.
 * 4. אריגת סיפור דרך קוהרנטי, טבעי וחי שמחבר את כל פריטי הרשימה של המשתמש.
 */

import { MNEMONIC_CATALOG, findMnemonicAssetByKeyword, getMnemonicCardById } from '../data/mnemonicAssociativeCatalog.js';
import { CELEBRITIES } from '../data/celebrityMnemonicCatalog.js';
import { authorWeaveStory } from './theAuthorStoryEngine.js';

const KNOWN_CELEBRITY_NAMES = new Set(
  (CELEBRITIES || []).flatMap(c => [
    (c.name || '').trim().toLowerCase(),
    (c.nickname || '').trim().toLowerCase(),
    (c.englishName || '').trim().toLowerCase()
  ]).filter(Boolean)
);

export function isKnownCelebrity(text = '') {
  const clean = String(text || '').trim().toLowerCase();
  if (!clean) return false;
  if (KNOWN_CELEBRITY_NAMES.has(clean)) return true;
  for (const c of (CELEBRITIES || [])) {
    const cName = (c.name || '').trim().toLowerCase();
    const cNick = (c.nickname || '').trim().toLowerCase();
    if (cName && (clean === cName || clean.includes(cName))) return true;
    if (cNick && cNick.length >= 3 && (clean === cNick || clean.includes(cNick))) return true;
  }
  return false;
}

/**
 * יצירת כרטיסייה ויזואלית עצמאית (SVG) עבור מילים שאינן במאגר
 * מבטיח שהמשתמש תמיד יראה את המילה המדויקת שלו ולא תמונת סלב שגויה!
 */
const WORD_EMOJI_MAP = {
  'כריש': '🦈', 'דג': '🐟', 'לווייתן': '🐋', 'דולפין': '🐬', 'אריה': '🦁', 'נמר': '🐅',
  'כלב': '🐕', 'חתול': '🐈', 'סוס': '🐎', 'פיל': '🐘', 'דוב': '🐻', 'קוף': '🐒',
  'ציפור': '🦅', 'נשר': '🦅', 'יונה': '🕊️', 'נחש': '🐍', 'צב': '🐢', 'עכבר': '🐁',
  'מטוס': '✈️', 'אוניה': '🚢', 'ספינה': '⛵', 'סירה': '🛶', 'רכבת': '🚂', 'מכונית': '🚗',
  'אופניים': '🚲', 'אופנוע': '🏍️', 'חללית': '🚀', 'טיל': '🚀', 'מסוק': '🚁',
  'פיצה': '🍕', 'המבורגר': '🍔', 'גלידה': '🍦', 'קפה': '☕', 'שוקולד': '🍫',
  'תפוח': '🍎', 'בננה': '🍌', 'לחם': '🍞', 'יין': '🍷', 'בירה': '🍺',
  'ספר': '📚', 'מחשב': '💻', 'טלפון': '📱', 'שעון': '⌚', 'מפתח': '🔑', 'חרב': '⚔️',
  'גיטרה': '🎸', 'כדור': '⚽', 'בית': '🏠', 'טירה': '🏰', 'גשר': '🌉',
  'שמש': '☀️', 'ירח': '🌙', 'כוכב': '⭐', 'ענן': '☁️', 'גשם': '🌧️', 'אש': '🔥',
  'לב': '❤️', 'יהלום': '💎', 'גביע': '🏆', 'מדליה': '🥇', 'מוזיקה': '🎵'
};

function resolveWordEmoji(text = '') {
  const clean = text.trim().toLowerCase();
  if (WORD_EMOJI_MAP[clean]) return WORD_EMOJI_MAP[clean];
  for (const [key, emoji] of Object.entries(WORD_EMOJI_MAP)) {
    if (clean.includes(key) || key.includes(clean)) return emoji;
  }
  return '📌';
}

/**
 * יצירת כרטיסייה ויזואלית עצמאית (SVG) עבור מילים שאינן במאגר
 * מבטיח שהמשתמש תמיד יראה את המילה המדויקת שלו ולא תמונת סלב שגויה!
 */
export function generateDynamicFallbackCard(word = '') {
  const cleanWord = String(word || 'עוגן זיכרון').trim();
  const iconEmoji = resolveWordEmoji(cleanWord);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e1b4b"/>
        <stop offset="60%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#1c1917"/>
      </linearGradient>
      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fbbf24"/>
        <stop offset="50%" stop-color="#d97706"/>
        <stop offset="100%" stop-color="#b45309"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" rx="16" fill="url(#bgGrad)"/>
    <rect x="8" y="8" width="384" height="284" rx="12" fill="none" stroke="url(#borderGrad)" stroke-width="3"/>
    <circle cx="200" cy="95" r="38" fill="rgba(245, 158, 11, 0.15)" stroke="#fbbf24" stroke-width="2"/>
    <text x="200" y="110" font-size="36" text-anchor="middle">${iconEmoji}</text>
    <text x="200" y="175" font-size="28" font-family="Rubik, sans-serif" font-weight="bold" text-anchor="middle" fill="#ffffff">${cleanWord}</text>
    <text x="200" y="210" font-size="14" font-family="Rubik, sans-serif" text-anchor="middle" fill="#fde047">עוגן זיכרון בארמון</text>
    <line x1="120" y1="230" x2="280" y2="230" stroke="rgba(245, 158, 11, 0.4)" stroke-width="1.5"/>
    <text x="200" y="258" font-size="12" font-family="Rubik, sans-serif" text-anchor="middle" fill="#94a3b8">חבר את העוגן החזותי בדמיונך</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function getDedicatedStationImage(itemText = '', role = {}, card = null, options = {}) {
  if (card && card.imageUrl) {
    return card.imageUrl;
  }
  const clean = itemText.trim().toLowerCase();
  const found = findMnemonicAssetByKeyword(clean, options.preferredDomains || []);
  if (found && found.imageUrl) {
    return found.imageUrl;
  }
  return generateDynamicFallbackCard(itemText);
}



const PERSON_KEYWORDS_REGEX = /ביל\s*גייטס|גייטס|איינשטיין|רונאלדו|מסי|אלביס|ג'ובס|הומר|סימפסון|פיקאצ'ו|סופרמן|באטמן|ספיידרמן|ברבי|מריו|ג'ורדן|ביבי|בגין|הרצל|רבין|שייקספיר|נפוליאון|הארי\s*פוטר|פוטר|טראמפ|אובמה|דרקולה|טרזן|איש|אישה|ילד|ילדה|תלמיד|תלמידה|חייל|חיילת|שוטר|שוטרת|רופא|רופאה|טבח|שף|מלצר|נהג|טייס|קברניט|מפקד|קצין|אינסטלטור|חשמלאי|ספר|נגר|מורה|מדריך|ספורטאי|מתאמן|שחקן|זמר/;

function isPersonOrHero(name = '', card = null) {
  const clean = String(name || '').toLowerCase();
  if (PERSON_KEYWORDS_REGEX.test(clean)) return true;
  if (!card) return false;
  const t = (card.type || '').toLowerCase();
  const cat = (card.category || '').toLowerCase();
  const theme = (card.theme || '').toLowerCase();
  const cname = (card.name || card.name_he || '').toLowerCase();

  return (
    t === 'celebrity' ||
    t === 'character' ||
    theme === 'fictional_pop' ||
    theme === 'celebrities' ||
    theme === 'people' ||
    cat.includes('דמויות') ||
    cat.includes('אישים') ||
    cat.includes('סלבס') ||
    cat.includes('אנשים') ||
    PERSON_KEYWORDS_REGEX.test(cname)
  );
}

export function isCharacterCard(card) {
  if (!card) return false;
  return isPersonOrHero(card.name || card.name_he, card);
}

function isVehicleCard(card, name = '') {
  const clean = String(name || '').toLowerCase();
  if (/פרארי|מטוס|רכבת|משאית|אופניים|אופנוע|ספינה|סירה|קורקינט|שאטל/.test(clean)) return true;
  if (!card) return false;
  const t = (card.type || '').toLowerCase();
  const cat = (card.category || '').toLowerCase();
  const theme = (card.theme || '').toLowerCase();
  const cname = (card.name || card.name_he || '').toLowerCase();

  return (
    t === 'vehicle' ||
    theme === 'vehicles' ||
    cat.includes('רכב') ||
    cat.includes('תחבורה') ||
    /פרארי|מטוס|רכבת|משאית|אופניים|אופנוע|ספינה|סירה|קורקינט|שאטל/.test(cname)
  );
}

function isLocationCard(card, name = '') {
  const clean = String(name || '').toLowerCase();
  if (/איגלו|בית|ארמון|חוף|משרד|אולם|כיתה|שדה\s*תעופה|חנות|טירה/.test(clean)) return true;
  if (!card) return false;
  const t = (card.type || '').toLowerCase();
  const cat = (card.category || '').toLowerCase();
  const theme = (card.theme || '').toLowerCase();
  const cname = (card.name || card.name_he || '').toLowerCase();

  return (
    t === 'location' ||
    card.role === 'destination' ||
    theme === 'places' ||
    cat.includes('מקומות') ||
    cat.includes('מבנים') ||
    /איגלו|בית|ארמון|חוף|משרד|אולם|כיתה|שדה\s*תעופה|חנות|טירה/.test(cname)
  );
}

function cleanAnchorName(name = '') {
  return String(name || '')
    .replace(/\([^)]*\)/g, '')
    .replace(/__+/g, ' ')
    .replace(/[_-]/g, ' ')
    .replace(/דמויות\s*תרבות.*/, '')
    .trim();
}

/**
 * Creative Agentic & Personified Narrative Synthesizer
 * Connects 2+ characters and interactive verbs into an unforgettable micro-story:
 * e.g. "דרקולה החנון עם המשקפיים התקשר בשיחה לאסקימואי שעל הקרח, והם נפגשו ולחצו ידיים חמות!"
 */
export function synthesizeVividMnemonicStory(items = []) {
  if (!items || !items.length) return null;
  const cleanItems = items.map(i => (typeof i === 'string' ? i : i.title || i.name || '').trim());

  let char1 = null, char2 = null;
  let modifier1 = '', modifier2 = '';
  let commAction = null;
  let meetAction = null;
  const remaining = [];

  for (const raw of cleanItems) {
    const item = raw.toLowerCase();

    // 1. Personifications
    if (/טיפול\s*שיניים|שיניים|שיננית/.test(item)) {
      if (!char1) char1 = 'דרקולה';
      else if (!char2) char2 = 'דרקולה';
      continue;
    }
    if (/קרח|שלג|איגלו|קור/.test(item)) {
      if (!char1) char1 = 'האסקימואי שעל הקרח';
      else if (!char2) char2 = 'האסקימואי שעל הקרח';
      continue;
    }
    if (/משקפיים|משקפי\s*ראייה|חנון|פרופסור/.test(item)) {
      modifier1 = 'החנון עם המשקפיים';
      continue;
    }
    if (/אימון|שרירים|משקולות|כושר/.test(item)) {
      if (!char1) char1 = 'שוורצנגר';
      else if (!char2) char2 = 'שוורצנגר';
      continue;
    }
    if (/סתימה|אינסטלטור|ברז|כיור/.test(item)) {
      if (!char1) char1 = 'סופר מריו';
      else if (!char2) char2 = 'סופר מריו';
      continue;
    }
    if (/תספורת|מספרה|ספר|קוצים/.test(item)) {
      if (!char1) char1 = 'סוניק הקיפוד';
      else if (!char2) char2 = 'סוניק הקיפוד';
      continue;
    }
    if (/חשמל|סוללה|סוללות|מטען|שקע/.test(item)) {
      if (!char1) char1 = 'פיקאצ\'ו';
      else if (!char2) char2 = 'פיקאצ\'ו';
      continue;
    }
    if (/רופא|מרפאה|בית\s*חולים|סטטוסקופ/.test(item)) {
      if (!char1) char1 = 'הרופא המנתח';
      else if (!char2) char2 = 'הרופא המנתח';
      continue;
    }
    if (/כסף|בנק|חשבון|תשלום|שק\s*כסף/.test(item)) {
      if (!char1) char1 = 'הבנקאי העשיר';
      else if (!char2) char2 = 'הבנקאי העשיר';
      continue;
    }

    // 2. Interactive verbs
    if (/פגישה|מפגש|להיפגש|לחיצת\s*ידיים/.test(item)) {
      meetAction = 'והם לחצו ידיים';
      continue;
    }
    if (/שיחה|טלפון|להתקשר|לדבר/.test(item)) {
      commAction = 'התקשר בשיחה';
      continue;
    }

    remaining.push(raw);
  }

  // Prioritize Dracula or leading person as actor1
  if (char2 === 'דרקולה' && char1 !== 'דרקולה') {
    const tmp = char1;
    char1 = char2;
    char2 = tmp;
  }

  // If we have at least 2 personified characters or 1 character with actions
  if (char1 && char2) {
    const actor1 = modifier1 ? `${char1} ${modifier1}` : char1;
    const actor2 = char2.startsWith('ל') ? char2 : `ל${char2}`;
    const callPart = commAction ? `${commAction} ${actor2}` : `פגש את ${char2}`;
    const meetPart = meetAction ? `, ${meetAction}` : '';
    const remPart = remaining.length ? ` (בזמן שארגנו ${remaining.join(' ו-')})` : '';
    return `${actor1} ${callPart}${meetPart}${remPart}!`;
  }

  if (char1 && (commAction || meetAction)) {
    const actor1 = modifier1 ? `${char1} ${modifier1}` : char1;
    const act = meetAction ? meetAction.replace('והם ', '') : commAction;
    const remPart = remaining.length ? ` סביב ${remaining.join(' ו-')}` : '';
    return `${actor1} ${act}${remPart}!`;
  }

  return null;
}

/**
 * קודקס לבניית הסיפור הסופי:
 * הסיפור נבנה ישירות מתוך האסוציאציות והעוגנים החזותיים שהוצגו ללקוח בחדרים!
 * משלב סינתזה פרסוניפיקטיבית אינטליגנטית להפגשת דמויות ועוגנים בסיפור אחד קצר ובלתי נשכח!
 */
export function composeCodexNarrativeSentence(itemNames = [], itemBindings = []) {
  const sourceItems = (itemBindings && itemBindings.length) ? itemBindings : itemNames;

  if (!sourceItems || !sourceItems.length) return '';

  // 1. "הסופר" (The Author) — המומחה הבלעדי לחיבור סיפורי זיכרון קוהרנטיים, קצרים והדוקים
  const authorStory = authorWeaveStory(sourceItems);
  if (authorStory) {
    return authorStory;
  }

  // 2. Secondary fallback to personified synthesizer
  const names = itemNames.length ? itemNames : itemBindings.map(b => b.itemTitle);
  const vividStory = synthesizeVividMnemonicStory(names);
  if (vividStory) {
    return vividStory;
  }

  const presented = itemBindings.map(b => {
    const card = b.matchedCard;
    let visualName = card ? cleanAnchorName(card.name || card.name_he) : b.itemTitle;

    // Normalize known verbose phrases into punchy Hebrew nouns
    if (/סימפסון/.test(visualName)) visualName = 'משפחת סימפסון';
    if (/נר דולק/.test(visualName)) visualName = 'נר';
    if (/בקבוק יין|בקבוק ייין/.test(visualName)) visualName = 'בקבוק יין';
    if (/גלולת תרופה/.test(visualName)) visualName = 'כדור';
    if (/שבב אלקטרוני/.test(visualName)) visualName = 'צ\'יפ';
    if (/רולטה.*קזינו|קזינו.*רולטה/.test(visualName)) visualName = 'רולטת הקזינו';

    const isHero = isPersonOrHero(visualName, card) || isPersonOrHero(b.itemTitle);
    const isVehicle = isVehicleCard(card, visualName);
    const isLocation = isLocationCard(card, visualName);

    return {
      originalItem: b.itemTitle,
      card,
      anchorName: visualName,
      isHero,
      isVehicle,
      isLocation
    };
  });

  const heroes = presented.filter(p => p.isHero);
  const vehicles = presented.filter(p => p.isVehicle && !p.isHero);
  const locations = presented.filter(p => p.isLocation && !p.isHero);
  const objects = presented.filter(p => !p.isHero && !p.isVehicle && !p.isLocation);

  // Formulate actors (People are NEVER treated as objects!)
  let actorClause = '';
  let isPlural = false;

  if (heroes.length > 2) {
    const allExceptLast = heroes.slice(0, -1).map(h => h.anchorName).join(', ');
    actorClause = `${allExceptLast} ו${heroes[heroes.length - 1].anchorName}`;
    isPlural = true;
  } else if (heroes.length === 2) {
    actorClause = `${heroes[0].anchorName} ו${heroes[1].anchorName}`;
    isPlural = true;
  } else if (heroes.length === 1) {
    actorClause = heroes[0].anchorName;
    isPlural = /משפחת|התלמידים|אנשים|חברים/.test(actorClause);
  } else {
    actorClause = 'הוא';
    isPlural = false;
  }

  // Semantic Object Classifications
  const casino = objects.find(o => /רולט|קזינו|הימור|גלגל\s*מזל/.test(o.anchorName));
  const dogtag = objects.find(o => /דיסקית|תג\s*שם|מדליה/.test(o.anchorName));
  const militaryId = objects.find(o => /חוגר|תעודת\s*זהות|דרכון|רישיון|תג/.test(o.anchorName));
  const appliance = objects.find(o => /טוסטר|תנור|מיקרוגל|מקרר|קומקום/.test(o.anchorName));
  const food = objects.find(o => /פסטה|פיצה|טוסט|מרק|סלט|כריך|לחם|עוגה|שוקולד|סטייק|תפוח|בננה/.test(o.anchorName) && !/טוסטר/.test(o.anchorName));
  const light = objects.find(o => /נר|פנס|מנורה|מדורה|גפרור/.test(o.anchorName));
  const play = objects.find(o => /כדור|כדורגל|כדורסל|טניס|משקולת|חבל/.test(o.anchorName));
  const drink = objects.find(o => /קפה|תה|מים|יין|בירה|מיץ|שייק|קדם\s*אימון/.test(o.anchorName) && !/בקבוק/.test(o.anchorName));
  const container = objects.find(o => /בקבוק|כוס|ספל|שייקר/.test(o.anchorName));
  const wearable = objects.find(o => /מגבת|משקפיים|משקפי\s*שמש|חולצה|כובע|מעיל|נעליים|שעון/.test(o.anchorName));
  const token = objects.find(o => /צ'?יפ|מפתח|מפתחות|טלפון|שלט/.test(o.anchorName));

  const clauses = [];
  const handled = new Set();

  if (vehicles.length > 0) {
    clauses.push(isPlural ? `נסעו ב-${vehicles[0].anchorName}` : `נסע ב-${vehicles[0].anchorName}`);
    handled.add(vehicles[0]);
  }

  if (locations.length > 0) {
    clauses.push(isPlural ? `נכנסו ל${locations[0].anchorName}` : `נכנס ל${locations[0].anchorName}`);
    handled.add(locations[0]);
  }

  if (casino) {
    clauses.push(isPlural ? `סובבו את ${casino.anchorName}` : `סובב את ${casino.anchorName}`);
    handled.add(casino);
  }

  if (dogtag) {
    clauses.push(isPlural ? `ענדו ${dogtag.anchorName}` : `ענד ${dogtag.anchorName}`);
    handled.add(dogtag);
  }

  if (militaryId) {
    clauses.push(isPlural ? `הציגו ${militaryId.anchorName}` : `הציג ${militaryId.anchorName}`);
    handled.add(militaryId);
  }

  if (light) {
    clauses.push(isPlural ? `הדליקו ${light.anchorName}` : `הדליק ${light.anchorName}`);
    handled.add(light);
  }

  if (appliance && food) {
    clauses.push(isPlural ? `שלפו ${food.anchorName} חמה מה${appliance.anchorName}` : `שלף ${food.anchorName} חמה מה${appliance.anchorName}`);
    handled.add(appliance);
    handled.add(food);
  } else {
    if (food && !handled.has(food)) {
      clauses.push(isPlural ? `אכלו ${food.anchorName}` : `אכל ${food.anchorName}`);
      handled.add(food);
    }
    if (appliance && !handled.has(appliance)) {
      clauses.push(isPlural ? `הפעילו את ה${appliance.anchorName}` : `הפעיל את ה${appliance.anchorName}`);
      handled.add(appliance);
    }
  }

  if (drink && container && !handled.has(drink) && !handled.has(container)) {
    clauses.push(isPlural ? `שתו ${drink.anchorName} מ${container.anchorName}` : `שתה ${drink.anchorName} מ${container.anchorName}`);
    handled.add(drink);
    handled.add(container);
  } else if (container && !handled.has(container)) {
    clauses.push(isPlural ? `שתו מ${container.anchorName}` : `שתה מ${container.anchorName}`);
    handled.add(container);
  } else if (drink && !handled.has(drink)) {
    clauses.push(isPlural ? `שתו ${drink.anchorName}` : `שתה ${drink.anchorName}`);
    handled.add(drink);
  }

  if (play && !handled.has(play)) {
    clauses.push(isPlural ? `הקפיצו ${play.anchorName}` : `הקפיץ ${play.anchorName}`);
    handled.add(play);
  }

  if (wearable && !handled.has(wearable)) {
    if (/משקפיים/.test(wearable.anchorName)) clauses.push(isPlural ? `הרכיבו ${wearable.anchorName}` : `הרכיב ${wearable.anchorName}`);
    else if (/מגבת/.test(wearable.anchorName)) clauses.push(isPlural ? `ניגבו את הזיעה ב${wearable.anchorName}` : `ניגב את הזיעה ב${wearable.anchorName}`);
    else clauses.push(isPlural ? `לבשו ${wearable.anchorName}` : `לבש ${wearable.anchorName}`);
    handled.add(wearable);
  }

  if (token && !handled.has(token)) {
    if (/מפתח/.test(token.anchorName)) clauses.push(isPlural ? `פתחו עם ה${token.anchorName}` : `פתח עם ה${token.anchorName}`);
    else if (/טלפון/.test(token.anchorName)) clauses.push(isPlural ? `ענו ל${token.anchorName}` : `ענה ל${token.anchorName}`);
    else clauses.push(isPlural ? `העבירו את ה${token.anchorName}` : `העביר את ה${token.anchorName}`);
    handled.add(token);
  }

  // Guaranteed authorial resolution without repetitive enumeration
  return authorWeaveStory(sourceItems) || `${actorClause} יצא להרפתקה בארמון.`;
}

export function weaveDeterministicStory(userItems = [], options = {}) {
  const rawList = userItems.slice(0, 7);
  if (!rawList.length) return null;

  const preferredDomains = options.preferredDomains || [];

  const itemBindings = rawList.map((item, index) => {
    const text = typeof item === 'string' ? item : item.title || item.name || `פריט ${index + 1}`;
    const clean = text.trim().toLowerCase();

    // Use item.card or item itself if already has imageUrl, otherwise find in catalog
    const matchedCard = item?.card || (item?.imageUrl ? item : null) || findMnemonicAssetByKeyword(clean, preferredDomains);

    return {
      order: index + 1,
      itemTitle: text,
      matchedCard,
      category: item?.category || matchedCard?.category || '',
      associationWord: item?.associationWord || matchedCard?.name || matchedCard?.name_he || text,
      originalItem: item
    };
  });

  const grandFinaleStory = composeCodexNarrativeSentence(
    itemBindings.map(b => b.itemTitle),
    itemBindings
  );

  const heroCard = itemBindings.find(b => isPersonOrHero(b.matchedCard?.name || b.itemTitle, b.matchedCard))?.matchedCard;
  const headline = heroCard 
    ? `${heroCard.name} וההרפתקה בארמון 📜✨`
    : `סיפור הדרך של הארמון 📜✨`;

  // Build per-station individual assets & focused instructions
  const stationStoryCards = itemBindings.map((binding) => {
    const card = binding.matchedCard;
    const itemImg = binding.originalItem?.imageUrl;
    const stationImageUrl = card?.imageUrl || itemImg || generateDynamicFallbackCard(binding.itemTitle);
    const hasRepositoryImage = Boolean(
      (card && card.imageUrl && !card.imageUrl.startsWith('data:image/svg')) ||
      (itemImg && !itemImg.startsWith('data:image/svg'))
    );

    let roomPrompt = '';
    let roomQuote = '';

    if (card) {
      roomPrompt = card.roomPrompt ? card.roomPrompt(binding.itemTitle) : `${card.name} עם ${binding.itemTitle}`;
      roomQuote = card.caption || `${card.name}: עוגן מנצח ל-${binding.itemTitle}`;
    } else {
      roomPrompt = `עוגן זיכרון: ${binding.itemTitle}`;
      roomQuote = `זכור את ${binding.itemTitle} בחדר זה`;
    }

    return {
      order: binding.order,
      itemTitle: binding.itemTitle,
      card,
      associationWord: binding.associationWord || card?.name || binding.itemTitle,
      hasRepositoryImage,
      celebrity: isCharacterCard(card) ? card : null,
      imageUrl: stationImageUrl,
      roomSensoryGuidedPrompt: roomPrompt,
      roomQuote: roomQuote
    };
  });

  return {
    stations: stationStoryCards,
    headline,
    grandFinaleStory,
    celebrationImage: stationStoryCards[stationStoryCards.length - 1]?.imageUrl || generateDynamicFallbackCard(itemBindings[itemBindings.length - 1]?.itemTitle)
  };
}
