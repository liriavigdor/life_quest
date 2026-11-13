import fs from 'fs';

const ABSOLUTE_FINAL = {
  // 2 overlaps
  'item_426_חבל_תלייה': ['לולאה', 'קשר', 'קשירה', 'מערבון'],
  'item_438_קוביית_משחק__עם_נקודות_': ['מזל', 'שש-בש', 'הטלה', 'הימורים'],

  // Multi-words
  'item_448_גשר_שער_הזהב': ['מפרץ', 'כבלים', 'אדום', 'מעבר'],
  'item_449_הצלב_האדום': ['רפואה', 'חירום', 'הצלה', 'תרומה'],
  'item_450_סימן_היין_והיאנג': ['איזון', 'הרמוניה', 'ניגודים', 'זן'],
  'item_453_ברק_בשמיים': ['רעם', 'חשמל', 'סערה', 'גשם'],
  'item_454_טורנדו___מערבולת': ['מערבולת', 'סופה', 'הרס', 'רוח'],
  'item_458_אריה': ['שאגה', 'טורף', 'מלך', 'סוואנה'],
  'item_459_יונה_לבנה_עם_עלה_זית': ['תקווה', 'נוצות', 'ענף', 'בשורות'],
  'item_469_גביע_זהב__מונף_בשתי_ידיים_': ['אליפות', 'מדליה', 'פרס', 'במה'],
  'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_': ['נחש', 'מוט', 'רופא', 'מרפא'],
  'item_483_מגן_דוד': ['ישראל', 'סמל', 'יהדות', 'דגל'],
  'item_495_איש_קו_על_כיסא_גלגלים': ['נכות', 'רמפה', 'סיוע', 'חניה'],
  'farm_rooster': ['השכמה', 'בוקר', 'לול', 'כרבולת'],
  'farm_pig': ['בוץ', 'ורוד', 'דיר', 'חיסכון'],
  'farm_sheep': ['צמר', 'עדר', 'רועה', 'מרעה']
};

const statePath = 'public/data/user_curation_state.json';
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
state.localEdits = state.localEdits || {};

for (const [id, branches] of Object.entries(ABSOLUTE_FINAL)) {
  state.localEdits[id] = {
    ...(state.localEdits[id] || {}),
    keywords: branches,
    isModified: true
  };
}
fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
console.log('Saved absolute final clean branches!');
