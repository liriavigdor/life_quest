import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// Improved matcher
function getMatch(userItem) {
  const fullText = (userItem.fullText || '').toLowerCase();
  const name = (userItem.name || '').toLowerCase();

  for (const a of currentArsenal) {
    const aName = (a.name_he || '').toLowerCase();
    const aId = (a.id || '').toLowerCase();

    // Check specific direct equivalences
    if (fullText.includes('מייקל ג\'ורדן') || fullText.includes('גורדן') || fullText.includes('jumpman')) {
      if (aId.includes('jordan') || aName.includes('ג\'ורדן')) return a;
    }
    if (fullText.includes('מונה ליזה')) {
      if (aId.includes('mona_lisa') || aName.includes('מונה ליזה')) return a;
    }
    if (fullText.includes('הצעקה')) {
      if (aId.includes('scream') || aName.includes('צעקה') || aId.includes('munch')) return a;
    }
    if (fullText.includes('החושב') || fullText.includes('רודן')) {
      if (aId.includes('rodin') || aName.includes('רודן') || aId.includes('thinker')) return a;
    }
    if (fullText.includes('פסל דוד')) {
      if (aId.includes('david') || aName.includes('דוד')) return a;
    }
    if (fullText.includes('ליל כוכבים')) {
      if (aId.includes('starry_night') || aId.includes('van_gogh') || aName.includes('כוכבים')) return a;
    }
    if (fullText.includes('הסעודה האחרונה')) {
      if (aId.includes('last_supper') || aName.includes('הסעודה האחרונה')) return a;
    }
    if (fullText.includes('הולדת ונוס')) {
      if (aId.includes('birth_of_venus') || aName.includes('ונוס') || aId.includes('botticelli')) return a;
    }
    if (fullText.includes('שעונים נמסים') || fullText.includes('התמדה של זיכרון')) {
      if (aId.includes('dali') || aName.includes('דאלי')) return a;
    }
    if (fullText.includes('תות ענח')) {
      if (aId.includes('tutankhamun') || aName.includes('תות ענח')) return a;
    }
    if (fullText.includes('גרניקה')) {
      if (aId.includes('guernica') || aId.includes('picasso') || aName.includes('פיקאסו')) return a;
    }
    if (fullText.includes('עגיל פנינה')) {
      if (aId.includes('vermeer') || aName.includes('ורמיר') || aId.includes('pearl')) return a;
    }
    if (fullText.includes('בנו של אדם') || fullText.includes('מגריט')) {
      if (aId.includes('magritte') || aName.includes('מגריט')) return a;
    }
    if (fullText.includes('האדם הוויטרובי')) {
      if (aId.includes('vitruvian') || aId.includes('da_vinci')) return a;
    }
    if (fullText.includes('מרק קמפבל') || fullText.includes('וורהול')) {
      if (aId.includes('warhol') || aName.includes('וורהול')) return a;
    }
    if (fullText.includes('הנשיקה') || fullText.includes('קלימט')) {
      if (aId.includes('klimt') || aName.includes('קלימט')) return a;
    }
    if (fullText.includes('ג\'קסון פולוק') || fullText.includes('פולוק')) {
      if (aId.includes('pollock') || aName.includes('פולוק')) return a;
    }
    if (fullText.includes('חמניות')) {
      if (aId.includes('sunflower') || aName.includes('חמניות')) return a;
    }
    if (fullText.includes('בנקסי')) {
      if (aId.includes('banksy') || aName.includes('בנקסי')) return a;
    }
    if (fullText.includes('טרקוטה')) {
      if (aId.includes('terracotta') || aName.includes('טרקוטה')) return a;
    }
    if (fullText.includes('רולינג סטונס') || fullText.includes('הלשון')) {
      if (aId.includes('rolling_stones') || aName.includes('רולינג סטונס')) return a;
    }
    if (fullText.includes('בבושקה') || fullText.includes('מטריושקה')) {
      if (aId.includes('matryoshka') || aName.includes('מטריושקה')) return a;
    }
    if (fullText.includes('שחמט')) {
      if (aId.includes('chess') || aName.includes('שחמט')) return a;
    }
    if (fullText.includes('טיטאניק')) {
      if (aId.includes('titanic') || aName.includes('טיטאניק')) return a;
    }
    if (fullText.includes('בואינג 747') || fullText.includes('ג\'מבו')) {
      if (aId.includes('boeing') || aName.includes('בואינג')) return a;
    }
    if (fullText.includes('פורמולה 1')) {
      if (aId.includes('formula') || aId.includes('ferrari') || aName.includes('פורמולה')) return a;
    }
    if (fullText.includes('אריה')) {
      if (aId.includes('lion') || aName.includes('אריה')) return a;
    }
    if (fullText.includes('כריש לבן')) {
      if (aId.includes('shark') || aName.includes('כריש')) return a;
    }
    if (fullText.includes('פיל')) {
      if (aId.includes('elephant') || aName.includes('פיל')) return a;
    }
    if (fullText.includes('ג\'ירפה')) {
      if (aId.includes('giraffe') || aName.includes('ג\'ירפה')) return a;
    }
    if (fullText.includes('פינגווין')) {
      if (aId.includes('penguin') || aName.includes('פינגווין')) return a;
    }
    if (fullText.includes('קורי עכביש')) {
      if (aId.includes('spider_web') || aName.includes('עכביש')) return a;
    }
    if (fullText.includes('טווס')) {
      if (aId.includes('peacock') || aName.includes('טווס')) return a;
    }
    if (fullText.includes('ינשוף')) {
      if (aId.includes('owl') || aName.includes('ינשוף')) return a;
    }
    if (fullText.includes('נשר')) {
      if (aId.includes('eagle') || aName.includes('נשר')) return a;
    }
    if (fullText.includes('קנגורו')) {
      if (aId.includes('kangaroo') || aName.includes('קנגורו')) return a;
    }
    if (fullText.includes('גמל')) {
      if (aId.includes('camel') || aName.includes('גמל')) return a;
    }
    if (fullText.includes('דולפין')) {
      if (aId.includes('dolphin') || aName.includes('דולפין')) return a;
    }
    if (fullText.includes('לווייתן')) {
      if (aId.includes('whale') || aName.includes('לווייתן')) return a;
    }
    if (fullText.includes('צפרדע')) {
      if (aId.includes('frog') || aName.includes('צפרדע')) return a;
    }
    if (fullText.includes('פרפר')) {
      if (aId.includes('butterfly') || aName.includes('פרפר')) return a;
    }
    if (fullText.includes('שפירית')) {
      if (aId.includes('dragonfly') || aName.includes('שפירית')) return a;
    }
    if (fullText.includes('זיקו') || fullText.includes('זיפו')) {
      if (aId.includes('zippo') || aName.includes('זיפו')) return a;
    }
    if (fullText.includes('קוביה הונגרית') || fullText.includes('רוביק')) {
      if (aId.includes('rubik') || aName.includes('רוביק') || aName.includes('הונגרית')) return a;
    }
    if (fullText.includes('אולר שוויצרי') || fullText.includes('ויקטורינוקס')) {
      if (aId.includes('swiss_army') || aName.includes('אולר')) return a;
    }
    if (fullText.includes('לגו')) {
      if (aId.includes('lego') || aName.includes('לגו')) return a;
    }
    if (fullText.includes('ברבי')) {
      if (aId.includes('barbie') || aName.includes('ברבי')) return a;
    }
    if (fullText.includes('גיים בוי')) {
      if (aId.includes('game_boy') || aName.includes('גיים בוי')) return a;
    }
    if (fullText.includes('ווקמן')) {
      if (aId.includes('walkman') || aName.includes('ווקמן')) return a;
    }
    if (fullText.includes('פולרואיד')) {
      if (aId.includes('polaroid') || aName.includes('פולרואיד')) return a;
    }
    if (fullText.includes('פיקאצ')) {
      if (aId.includes('pikachu') || aName.includes('פיקאצ')) return a;
    }
    if (fullText.includes('מריו')) {
      if (aId.includes('mario') || aName.includes('מריו')) return a;
    }
    if (fullText.includes('סוניק')) {
      if (aId.includes('sonic') || aName.includes('סוניק')) return a;
    }
    if (fullText.includes('ויידר')) {
      if (aId.includes('vader') || aName.includes('ויידר')) return a;
    }
    if (fullText.includes('יודה')) {
      if (aId.includes('yoda') || aName.includes('יודה')) return a;
    }
    if (fullText.includes('בונד')) {
      if (aId.includes('bond') || aName.includes('בונד')) return a;
    }
    if (fullText.includes('איירון מן')) {
      if (aId.includes('iron_man') || aName.includes('איירון מן')) return a;
    }
    if (fullText.includes('קפטן אמריקה')) {
      if (aId.includes('captain_america') || aName.includes('קפטן אמריקה')) return a;
    }
    if (fullText.includes('האלק')) {
      if (aId.includes('hulk') || aName.includes('האלק')) return a;
    }
    if (fullText.includes('וולברין')) {
      if (aId.includes('wolverine') || aName.includes('וולברין')) return a;
    }
    if (fullText.includes('גנדלף')) {
      if (aId.includes('gandalf') || aName.includes('גנדלף')) return a;
    }
    if (fullText.includes('גולום')) {
      if (aId.includes('gollum') || aName.includes('גולום')) return a;
    }
    if (fullText.includes('בילבו')) {
      if (aId.includes('bilbo') || aName.includes('בילבו')) return a;
    }
    if (fullText.includes('הארי פוטר')) {
      if (aId.includes('harry_potter') || aName.includes('הארי פוטר')) return a;
    }
    if (fullText.includes('טרמינטור')) {
      if (aId.includes('terminator') || aName.includes('טרמינטור') || aName.includes('המחסל')) return a;
    }
    if (fullText.includes('הטורף') || fullText.includes('predator')) {
      if (aId.includes('predator') || aName.includes('הטורף')) return a;
    }
    if (fullText.includes('פרנקנשטיין')) {
      if (aId.includes('frankenstein') || aName.includes('פרנקנשטיין')) return a;
    }
    if (fullText.includes('דרקולה')) {
      if (aId.includes('dracula') || aName.includes('דרקולה')) return a;
    }
    if (fullText.includes('אייפל')) {
      if (aId.includes('eiffel') || aName.includes('אייפל')) return a;
    }
    if (fullText.includes('חירות') || fullText.includes('חרות')) {
      if (aId.includes('liberty') || aName.includes('חירות')) return a;
    }
    if (fullText.includes('פירמידות') || fullText.includes('גיזה')) {
      if (aId.includes('pyramid') || aName.includes('פירמידות')) return a;
    }
    if (fullText.includes('ספינקס')) {
      if (aId.includes('sphinx') || aName.includes('ספינקס')) return a;
    }
    if (fullText.includes('טאג') || fullText.includes('מאהל')) {
      if (aId.includes('taj') || aName.includes('טאג')) return a;
    }
    if (fullText.includes('קוליסאום') || fullText.includes('קולוסיאום')) {
      if (aId.includes('colosseum') || aName.includes('קולוסיאום')) return a;
    }
    if (fullText.includes('החומה הסינית') || (fullText.includes('חומה') && fullText.includes('סין'))) {
      if (aId.includes('great_wall') || aName.includes('החומה הסינית')) return a;
    }
    if (fullText.includes('פיזה')) {
      if (aId.includes('pisa') || aName.includes('פיזה')) return a;
    }
    if (fullText.includes('ביג בן')) {
      if (aId.includes('big_ben') || aName.includes('ביג בן')) return a;
    }
    if (fullText.includes('אופרה') && fullText.includes('סידני')) {
      if (aId.includes('sydney') || aName.includes('סידני')) return a;
    }
    if (fullText.includes('שער הזהב')) {
      if (aId.includes('golden_gate') || aName.includes('שער הזהב')) return a;
    }
    if (fullText.includes('הבית הלבן')) {
      if (aId.includes('white_house') || aName.includes('הבית הלבן')) return a;
    }
    if (fullText.includes('עזריאלי')) {
      if (aId.includes('azrieli') || aName.includes('עזריאלי')) return a;
    }
    if (fullText.includes('סטונהנג')) {
      if (aId.includes('stonehenge') || aName.includes('סטונהנג')) return a;
    }
    if (fullText.includes('מואי') || fullText.includes('הפסחא')) {
      if (aId.includes('moai') || aName.includes('מואי')) return a;
    }
    if (fullText.includes('פרתנון') || fullText.includes('אקרופוליס')) {
      if (aId.includes('parthenon') || aName.includes('אקרופוליס')) return a;
    }
    if (fullText.includes('בורג') && fullText.includes('חליפה')) {
      if (aId.includes('burj_khalifa') || aName.includes('ח\'ליפה')) return a;
    }
    if (fullText.includes('כעבה')) {
      if (aId.includes('kaaba') || aName.includes('כעבה')) return a;
    }
    if (fullText.includes('פנתיאון') || fullText.includes('פנתאון')) {
      if (aId.includes('pantheon') || aName.includes('פנתאון')) return a;
    }
    if (fullText.includes('קשת הניצחון')) {
      if (aId.includes('arc_de_triomphe') || aName.includes('קשת הניצחון')) return a;
    }
    if (fullText.includes('צ\'יצ\'ן') || fullText.includes('איצה')) {
      if (aId.includes('chichen') || aName.includes('איצה')) return a;
    }
    if (fullText.includes('הכותל')) {
      if (aId.includes('western_wall') || aName.includes('הכותל')) return a;
    }
    if (fullText.includes('סגרדה פמיליה')) {
      if (aId.includes('sagrada') || aName.includes('סגרדה')) return a;
    }
    if (fullText.includes('מצודת לונדון') || fullText.includes('tower bridge')) {
      if (aId.includes('tower_bridge') || aName.includes('לונדון')) return a;
    }
    if (fullText.includes('רושמור')) {
      if (aId.includes('rushmore') || aName.includes('רושמור')) return a;
    }
    if (fullText.includes('בודהה')) {
      if (aId.includes('buddha') || aName.includes('בודהה')) return a;
    }
    if (fullText.includes('מגן דוד')) {
      if (aId.includes('star_of_david') || aName.includes('מגן דוד')) return a;
    }
    if (fullText.includes('צלב')) {
      if (aId.includes('cross') || aName.includes('צלב')) return a;
    }
    if (fullText.includes('חמסה')) {
      if (aId.includes('hamsa') || aName.includes('חמסה')) return a;
    }
  }

  return null;
}

const matchedMap = new Map();
const matchedIds = new Set();

user500.forEach(u => {
  const m = getMatch(u);
  if (m && !matchedIds.has(m.id)) {
    matchedMap.set(u.num, m);
    matchedIds.add(m.id);
  }
});

console.log('Total user items:', user500.length);
console.log('Total matched in arsenal:', matchedMap.size);

const notMatched = user500.filter(u => !matchedMap.has(u.num));
console.log('Not matched (new items):', notMatched.length);

const arsenalNotKept = currentArsenal.filter(a => !matchedIds.has(a.id));
console.log('Arsenal items to delete (not in user 500):', arsenalNotKept.length);

fs.writeFileSync('scripts/user_matched_refined.json', JSON.stringify(Array.from(matchedMap.entries()).map(([num, m]) => ({ num, mId: m.id, mName: m.name_he })), null, 2), 'utf8');
fs.writeFileSync('scripts/user_unmatched_refined.json', JSON.stringify(notMatched, null, 2), 'utf8');
fs.writeFileSync('scripts/arsenal_to_delete_refined.json', JSON.stringify(arsenalNotKept.map(a => ({ id: a.id, name: a.name_he })), null, 2), 'utf8');
