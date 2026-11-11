import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// Helper to normalize strings for matching
function norm(str) {
  if (!str) return '';
  return str.toLowerCase()
    .replace(/["'״׳`\(\)\-\:\,\.\/\\_\?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Check match between user item and arsenal item
function isMatch(userItem, arsItem) {
  const uName = norm(userItem.name);
  const uFull = norm(userItem.fullText);
  const aName = norm(arsItem.name_he);
  const aId = norm(arsItem.id);

  // Exact Hebrew name match
  if (uName === aName) return true;
  if (aName.includes(uName) || uName.includes(aName)) return true;

  // Direct keyword matching
  const keywords = [
    ['מיקי מאוס', 'mickey_mouse'],
    ['סופר מריו', 'super_mario'],
    ['פיקאצ', 'pikachu'],
    ['סוניק', 'sonic'],
    ['ספיידרמן', 'spider_man'],
    ['באטמן', 'batman'],
    ['סופרמן', 'superman'],
    ['ברבי', 'barbie'],
    ['דארת', 'darth_vader'],
    ['הומר סימפסון', 'homer'],
    ['שרק', 'shrek'],
    ['פאק מן', 'pac_man'],
    ['פאק-מן', 'pac_man'],
    ['r2 d2', 'r2_d2'],
    ['באגס באני', 'bugs_bunny'],
    ['פו הדב', 'winnie'],
    ['הלו קיטי', 'hello_kitty'],
    ['בובספוג', 'spongebob'],
    ['קינג קונג', 'king_kong'],
    ['המלך קונג', 'king_kong'],
    ['גודזילה', 'godzilla'],
    ['דרקולה', 'dracula'],
    ['האלק', 'hulk'],
    ['איירון מן', 'iron_man'],
    ['ג יימס בונד', 'james_bond'],
    ['ג וקר', 'joker'],
    ['הג וקר', 'joker'],
    ['פנתר ורוד', 'pink_panther'],
    ['טרזן', 'tarzan'],
    ['פינוקיו', 'pinocchio'],
    ['רובין הוד', 'robin_hood'],
    ['פיטר פן', 'peter_pan'],
    ['סינדרלה', 'cinderella'],
    ['הארי פוטר', 'harry_potter'],
    ['דונלד דאק', 'donald_duck'],
    ['סקובי דו', 'scooby'],
    ['טום וג רי', 'tom_and_jerry'],
    ['פופאי', 'popeye'],
    ['טרמינטור', 'terminator'],
    ['המחסל', 'terminator'],
    ['קפטן אמריקה', 'captain_america'],
    ['וולברין', 'wolverine'],
    ['גנדלף', 'gandalf'],
    ['גולום', 'gollum'],
    ['מיניונים', 'minion'],
    ['קולונל', 'colonel_sanders'],
    ['רונלד מקדונלד', 'ronald_mcdonald'],
    ['גרינץ', 'grinch'],
    ['בילבו', 'bilbo'],
    ['רובוקופ', 'robocop'],
    ['אלף', 'alf'],
    ['הטורף', 'predator'],
    ['פרנקנשטיין', 'frankenstein'],
    ['אייפל', 'eiffel'],
    ['חרות', 'liberty'],
    ['חירות', 'liberty'],
    ['גיזה', 'pyramid'],
    ['פירמידות', 'pyramid'],
    ['ספינקס', 'sphinx'],
    ['טאג', 'taj'],
    ['קוליסאום', 'colosseum'],
    ['קולוסיאום', 'colosseum'],
    ['סינית', 'great_wall'],
    ['חומה', 'great_wall'],
    ['פיזה', 'pisa'],
    ['ביג בן', 'big_ben'],
    ['אופרה', 'sydney_opera'],
    ['ישו הגואל', 'christ_redeemer'],
    ['שער הזהב', 'golden_gate'],
    ['בית הלבן', 'white_house'],
    ['עזריאלי', 'azrieli'],
    ['קרמלין', 'kremlin'],
    ['ואסילי', 'st_basil'],
    ['טחנת רוח', 'windmill'],
    ['אמפייר סטייט', 'empire_state'],
    ['הוליווד', 'hollywood'],
    ['סטונהנג', 'stonehenge'],
    ['מואי', 'moai'],
    ['פרתנון', 'parthenon'],
    ['אקרופוליס', 'acropolis'],
    ['בורג ח ליפה', 'burj_khalifa'],
    ['כעבה', 'kaaba'],
    ['פנתיאון', 'pantheon'],
    ['קשת הניצחון', 'arc_de_triomphe'],
    ['דיסני', 'disney_castle'],
    ['בורג אל ערב', 'burj_al_arab'],
    ['מאיה', 'chichen_itza'],
    ['כותל', 'western_wall'],
    ['סגרדה פמיליה', 'sagrada_familia'],
    ['מצודת לונדון', 'tower_bridge'],
    ['צ ק פוינט', 'checkpoint_charlie'],
    ['רושמור', 'mount_rushmore'],
    ['מונה ליזה', 'mona_lisa'],
    ['הצעקה', 'scream'],
    ['אדם החושב', 'thinker'],
    ['פסל דוד', 'statue_of_david'],
    ['ליל כוכבים', 'starry_night'],
    ['בריאת האדם', 'creation_of_adam'],
    ['הסעודה האחרונה', 'last_supper'],
    ['הולדת ונוס', 'birth_of_venus'],
    ['זיכרון', 'persistence_of_memory'],
    ['שעונים נמסים', 'melting_clocks'],
    ['תות ענח אמון', 'tutankhamun'],
    ['ונוס ממילו', 'venus_de_milo'],
    ['גרניקה', 'guernica'],
    ['נערה עם עגיל פנינה', 'girl_with_pearl'],
    ['בנו של אדם', 'son_of_man'],
    ['מרק קמפבל', 'campbell'],
    ['הנשיקה', 'the_kiss'],
    ['חמניות', 'sunflowers'],
    ['טרקוטה', 'terracotta'],
    ['רוזטה', 'rosetta'],
    ['סרקופג', 'sarcophagus'],
    ['בבושקה', 'matryoshka'],
    ['מטריושקה', 'matryoshka'],
    ['גרגויל', 'gargoyle'],
    ['מומיה', 'mummy'],
    ['חמסה', 'hamsa'],
    ['מגן דוד', 'star_of_david'],
    ['נורה דולקת', 'lightbulb'],
    ['תיבת אוצר', 'treasure_chest'],
    ['פצצה', 'cartoon_bomb'],
    ['דיסקט', 'floppy_disk'],
    ['זכוכית מגדלת', 'magnifying_glass'],
    ['מפתח', 'wrench'],
    ['שק כסף', 'money_bag'],
    ['תיאטרון', 'theater_masks'],
    ['שעון חול', 'hourglass'],
    ['עוגן', 'anchor'],
    ['גולגולת', 'skull'],
    ['כתר', 'crown'],
    ['תלתן', 'clover'],
    ['כדור בדולח', 'crystal_ball'],
    ['פרארי', 'ferrari'],
    ['למבורגיני', 'lamborghini'],
    ['אסטון מרטין', 'aston_martin'],
    ['מוסטנג', 'mustang'],
    ['חיפושית', 'volkswagen_beetle'],
    ['טיטאניק', 'titanic'],
    ['הארלי דיווידסון', 'harley_davidson'],
    ['לימוזינה', 'limousine'],
    ['מונית צהובה', 'yellow_cab'],
    ['קומותיים', 'double_decker'],
    ['מעבורת חלל', 'space_shuttle'],
    ['בואינג 747', 'boeing_747'],
    ['גונדולה', 'gondola'],
    ['צפלין', 'zeppelin'],
    ['כדור פורח', 'hot_air_balloon'],
    ['צוללת צהובה', 'yellow_submarine'],
    ['טרקטור', 'tractor'],
    ['פורמולה 1', 'formula_1'],
    ['טנק', 'tank'],
    ['אריה', 'lion'],
    ['כריש לבן', 'great_white_shark'],
    ['פנדה', 'panda'],
    ['פיל', 'elephant'],
    ['ג ירפה', 'giraffe'],
    ['הר געש', 'volcano'],
    ['קרחון', 'iceberg'],
    ['שבתאי', 'saturn'],
    ['פינגווין', 'penguin'],
    ['קורי עכביש', 'spider_web'],
    ['טווס', 'peacock'],
    ['ינשוף', 'owl'],
    ['נשר', 'eagle'],
    ['קנגורו', 'kangaroo'],
    ['גמל', 'camel'],
    ['דולפין', 'dolphin'],
    ['לווייתן', 'killer_whale'],
    ['צפרדע', 'frog'],
    ['פרפר', 'butterfly'],
    ['כדורגל', 'soccer_ball'],
    ['כדורסל', 'basketball'],
    ['טניס', 'tennis'],
    ['באולינג', 'bowling'],
    ['ביליארד', 'billiards'],
    ['כפפות אגרוף', 'boxing_gloves'],
    ['טבעות אולימפיות', 'olympic_rings'],
    ['גלשן', 'surfboard'],
    ['שחמט', 'chess'],
    ['יו יו', 'yo_yo'],
    ['קוביה הונגרית', 'rubiks_cube'],
    ['טטריס', 'tetris'],
    ['פטיש', 'hammer'],
    ['מברג', 'screwdriver'],
    ['מספריים', 'scissors'],
    ['מטרייה', 'umbrella'],
    ['מצית זיפו', 'zippo'],
    ['שעון מעורר', 'alarm_clock'],
    ['ספרייט', 'coca_cola'],
    ['קוקה קולה', 'coca_cola'],
    ['מרלין מונרו', 'marilyn_monroe'],
    ['שרלוק הולמס', 'sherlock_holmes'],
    ['לגו', 'lego'],
    ['סטטוסקופ', 'stethoscope'],
    ['מייקל ג ורדן', 'michael_jordan'],
    ['מלאך', 'angel'],
    ['שטן', 'devil'],
    ['בודהה', 'buddha'],
    ['אטום', 'atom_model'],
    ['תמרור עצור', 'stop_sign'],
    ['ווי פיי', 'wifi'],
    ['בלוטות', 'bluetooth']
  ];

  for (const [heb, eng] of keywords) {
    const hNorm = norm(heb);
    if ((uName.includes(hNorm) || uFull.includes(hNorm)) && (aName.includes(hNorm) || aId.includes(eng))) {
      return true;
    }
  }

  return false;
}

// Perform cross matching
const matchedInArsenal = new Map(); // userItem.num -> arsItem
const matchedArsenalIds = new Set();

user500.forEach(userItem => {
  for (const arsItem of currentArsenal) {
    if (!matchedArsenalIds.has(arsItem.id) && isMatch(userItem, arsItem)) {
      matchedInArsenal.set(userItem.num, arsItem);
      matchedArsenalIds.add(arsItem.id);
      break;
    }
  }
});

console.log('=== MATCH RESULTS ===');
console.log(`Out of 500 items requested:`);
console.log(`- Matched in current repository: ${matchedInArsenal.size} items`);
console.log(`- New / Missing to add to 500: ${500 - matchedInArsenal.size} items`);

const arsenalToDelete = currentArsenal.filter(a => !matchedArsenalIds.has(a.id));
console.log(`Current repository items to delete (not in user 500 list): ${arsenalToDelete.length} items`);

// Save lists for review
const matchedList = [];
const missingFromArsenalList = [];

user500.forEach(userItem => {
  if (matchedInArsenal.has(userItem.num)) {
    const ars = matchedInArsenal.get(userItem.num);
    matchedList.push({
      num: userItem.num,
      requestedName: userItem.name,
      matchedArsenalId: ars.id,
      matchedArsenalName: ars.name_he,
      imageUrl: ars.imageUrl,
      category: userItem.category
    });
  } else {
    missingFromArsenalList.push(userItem);
  }
});

fs.writeFileSync('scripts/matched_user_items.json', JSON.stringify(matchedList, null, 2), 'utf8');
fs.writeFileSync('scripts/missing_user_items.json', JSON.stringify(missingFromArsenalList, null, 2), 'utf8');
fs.writeFileSync('scripts/arsenal_items_to_delete.json', JSON.stringify(arsenalToDelete.map(a => ({ id: a.id, name: a.name_he, cat: a.category })), null, 2), 'utf8');

console.log('Saved matched_user_items.json, missing_user_items.json, and arsenal_items_to_delete.json');
