import fs from 'fs';

const CLEAN_MAP = {
  // 5 overlaps
  'neon_motel_sign': ['לינה', 'מלון', 'מוטל', 'חופשה', 'שלט'],
  'native_dreamcatcher': ['שינה', 'נוצות', 'רוגע', 'מנוחה'],
  'hamsa_hand_amulet': ['מזל', 'עין', 'ברכה', 'הגנה'],
  'item_163_מאזני_צדק__שתי_כפות_מאוזנות___מסמלות': ['שופט', 'צדק', 'דין', 'חוק', 'עו"ד'],
  'item_250_עגלת_תינוק_קלאסית': ['חיתולים', 'מוצץ', 'בקבוק', 'הורות', 'פעוט'],

  // Multi-word branches to clean single tokens
  'item_200_קולב_בגדים_ממתכת__מסמל': ['מכבסה', 'חליפה', 'ארון', 'תלייה'],
  'item_202_מונית_צהובה_ניו_יורקית': ['מונית', 'צהוב', 'נסיעה', 'תנועה'],
  'item_206_ספינת_פיראטים': ['פיראטים', 'מפרש', 'תותח', 'אוצר'],
  'item_208_מטוס_ג_מבו': ['טיסה', 'חו"ל', 'שמיים', 'נמל'],
  'item_215_כבאית_אדומה': ['אש', 'כבאי', 'זרנוק', 'סולם'],
  'item_216_אמבולנס_לבן': ['רפואה', 'חירום', 'סירנה', 'חובש'],
  'item_244_רכבת_הרים_לונה_פארק': ['פארק', 'מהירות', 'בילוי', 'אקסטרים'],
  'item_247_משאית_סמי_טריילר_אמריקאית': ['הובלה', 'מובילים', 'ארגזים', 'משא'],
  'item_249_רכב_גופה': ['לוויה', 'אבל', 'מכונית', 'פרידה'],
  'item_254_דוב_פנדה': ['במבוק', 'סין', 'דב', 'כתמים'],
  'item_257_ג_ירפה': ['צוואר', 'גובה', 'עלים', 'ספארי'],
  'item_265_טווס_פרוס_זנב': ['נוצות', 'זנב', 'צבעים', 'יופי'],
  'item_267_כלב_דלמטי': ['נקודות', 'כלב', 'כתמים', 'נביחה'],
  'item_274_צב_יבשה_ענק': ['שריון', 'איטיות', 'זוחל', 'חסה'],
  'item_276_דבורה': ['דבש', 'עוקץ', 'כוורת', 'פרחים']
};

const statePath = 'public/data/user_curation_state.json';
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
state.localEdits = state.localEdits || {};

for (const [id, branches] of Object.entries(CLEAN_MAP)) {
  state.localEdits[id] = {
    ...(state.localEdits[id] || {}),
    keywords: branches,
    isModified: true
  };
}
fs.writeFileSync(statePath, JSON.stringify(state, null, 2), 'utf8');
console.log('Cleaned remaining overlaps and multi-word branches in user_curation_state.json!');

