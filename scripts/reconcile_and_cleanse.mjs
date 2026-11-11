import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// High-precision matcher function
function matchItem(userItem, arsenalList, usedArsenalIds) {
  const uFull = (userItem.fullText || '').toLowerCase();
  const uName = (userItem.name || '').toLowerCase();

  // Try exact ID or direct keywords
  for (const a of arsenalList) {
    if (usedArsenalIds.has(a.id)) continue;
    const aName = (a.name_he || '').toLowerCase();
    const aId = (a.id || '').toLowerCase();

    // Check direct equality
    if (uName === aName || uName === aId) return a;

    // Check specific iconic pairs
    const pairs = [
      ['סופר מריו', 'super_mario'],
      ['פיקאצ', 'pikachu'],
      ['סוניק', 'sonic'],
      ['ברבי', 'barbie_doll'],
      ['דארת', 'darth_vader'],
      ['שרק', 'shrek'],
      ['פאק מן', 'pac_man'],
      ['פאק-מן', 'pac_man'],
      ['r2-d2', 'r2_d2'],
      ['r2 d2', 'r2_d2'],
      ['באגס באני', 'bugs_bunny'],
      ['דרקולה', 'dracula'],
      ['האלק', 'hulk'],
      ['איירון מן', 'iron_man'],
      ['ג\'יימס בונד', 'james_bond'],
      ['גיימס בונד', 'james_bond'],
      ['טרזן', 'tarzan'],
      ['הארי פוטר', 'harry_potter'],
      ['דונלד דאק', 'donald_duck'],
      ['טרמינטור', 'terminator'],
      ['קפטן אמריקה', 'captain_america'],
      ['וולברין', 'wolverine'],
      ['גנדלף', 'gandalf'],
      ['גולום', 'gollum'],
      ['בילבו בגינס', 'bilbo'],
      ['הטורף', 'predator'],
      ['פרנקנשטיין', 'frankenstein'],
      ['מגדל אייפל', 'eiffel'],
      ['פסל החירות', 'liberty'],
      ['הפירמידות בגיזה', 'pyramids_of_giza'],
      ['פירמידות בגיזה', 'pyramids_of_giza'],
      ['הספינקס', 'sphinx'],
      ['ספינקס', 'sphinx'],
      ['טאג\' מהאל', 'taj_mahal'],
      ['טאג מהאל', 'taj_mahal'],
      ['הקוליסאום', 'colosseum'],
      ['הקולוסיאום', 'colosseum'],
      ['החומה הסינית', 'great_wall'],
      ['מגדל פיזה', 'pisa'],
      ['ביג בן', 'big_ben'],
      ['בית האופרה של סידני', 'sydney_opera'],
      ['ישו הגואל', 'christ'],
      ['גשר שער הזהב', 'golden_gate'],
      ['הבית הלבן', 'white_house'],
      ['מגדלי עזריאלי', 'azrieli'],
      ['סטונהנג', 'stonehenge'],
      ['פסלי המואי', 'moai'],
      ['פנתיאון', 'pantheon'],
      ['קשת הניצחון', 'arc_de_triomphe'],
      ['צ\'יצ\'ן איצה', 'chichen_itza'],
      ['הכותל המערבי', 'western_wall'],
      ['סגרדה פמיליה', 'sagrada_familia'],
      ['מצודת לונדון', 'tower_bridge'],
      ['הר רושמור', 'rushmore'],
      ['מונה ליזה', 'mona_lisa'],
      ['הצעקה', 'scream'],
      ['אוגוסט רודן', 'rodin'],
      ['האדם החושב', 'rodin'],
      ['פסל דוד', 'statue_of_david'],
      ['ליל כוכבים', 'van_gogh'],
      ['הסעודה האחרונה', 'last_supper'],
      ['הולדת ונוס', 'birth_of_venus'],
      ['התמדה של זיכרון', 'dali'],
      ['תות ענח', 'tutankhamun'],
      ['גרניקה', 'picasso'],
      ['עגיל פנינה', 'vermeer'],
      ['מרק קמפבל', 'warhol'],
      ['הנשיקה', 'klimt'],
      ['ג\'קסון פולוק', 'pollock'],
      ['בנקסי', 'banksy'],
      ['טרקוטה', 'terracotta'],
      ['בבושקה', 'matryoshka'],
      ['מטריושקה', 'matryoshka'],
      ['מנורת שבעת', 'menorah'],
      ['חמסה', 'hamsa'],
      ['מגן דוד', 'star_of_david'],
      ['צלב', 'cross'],
      ['נורה דולקת', 'lightbulb'],
      ['תיבת אוצר', 'treasure_chest'],
      ['שעון חול', 'hourglass'],
      ['טיטאניק', 'titanic'],
      ['בואינג 747', 'boeing_747'],
      ['גונדולה ונציאנית', 'gondola'],
      ['צפלין', 'zeppelin'],
      ['חיפושית (פולקסווגן)', 'volkswagen_beetle'],
      ['אריה', 'african_lion'],
      ['כריש לבן', 'great_white_shark'],
      ['דוב פנדה', 'panda'],
      ['אולימפיות', 'olympic_rings'],
      ['קוביה הונגרית', 'rubik'],
      ['קובייה הונגרית', 'rubik'],
      ['זיפו', 'zippo'],
      ['מייקל ג\'ורדן', 'jordan'],
      ['גורדן', 'jordan'],
      ['בודהה', 'buddha']
    ];

    for (const [hPattern, idPattern] of pairs) {
      if ((uFull.includes(hPattern) || uName.includes(hPattern)) && (aId.includes(idPattern) || aName.includes(hPattern))) {
        return a;
      }
    }
  }

  return null;
}

const matchedArsenalIds = new Set();
const alreadyInRepo = [];
const remainingFor500 = [];

user500.forEach(u => {
  const match = matchItem(u, currentArsenal, matchedArsenalIds);
  if (match) {
    matchedArsenalIds.add(match.id);
    alreadyInRepo.push({
      num: u.num,
      name: u.name,
      category: u.category,
      arsenalId: match.id,
      arsenalName: match.name_he,
      imageUrl: match.imageUrl,
      associations: match.everyday_associations
    });
  } else {
    remainingFor500.push(u);
  }
});

console.log(`=== RECONCILIATION SUMMARY ===`);
console.log(`1. Total requested items in canonical 500: ${user500.length}`);
console.log(`2. Items ALREADY in our repository (to subtract from 500 list): ${alreadyInRepo.length}`);
console.log(`3. Items REMAINING to acquire for 500: ${remainingFor500.length}`);

const itemsToDeleteFromArsenal = currentArsenal.filter(a => !matchedArsenalIds.has(a.id));
console.log(`4. Items in current arsenal to PURGE (not in user 500): ${itemsToDeleteFromArsenal.length}`);

fs.writeFileSync('scripts/500_already_in_repository.json', JSON.stringify(alreadyInRepo, null, 2), 'utf8');
fs.writeFileSync('scripts/500_remaining_to_acquire.json', JSON.stringify(remainingFor500, null, 2), 'utf8');
fs.writeFileSync('scripts/arsenal_unwanted_to_purge.json', JSON.stringify(itemsToDeleteFromArsenal.map(a => ({ id: a.id, name_he: a.name_he, category: a.category })), null, 2), 'utf8');

console.log('Saved 500_already_in_repository.json, 500_remaining_to_acquire.json, and arsenal_unwanted_to_purge.json');
