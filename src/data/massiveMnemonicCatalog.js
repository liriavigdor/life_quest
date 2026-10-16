/**
 * מאגר ענק, עשיר ודטרמיניסטי של מאות מושגים בעברית
 * כולל בעלי חיים, יצורי ים (תמנון, דיונון, כריש), ירקות ופירות (חציל, מלפפון, עגבנייה),
 * כלי נשק, פנטזיה, רכבים, גאדג'טים, מוזיקה ומזון.
 */

export const MNEMONIC_CATALOG = [
  // ==========================================
  // יצורי ים, חיות, חרקים ומפלצות פנטזיה
  // ==========================================
  { id: 'octopus', names: ['תמנון', 'תמנונים', 'אוקטופוס'], emoji: '🐙', type: 'tentacled_beast', color: '#ec4899', darkColor: '#9d174d', shape: 'tentacles' },
  { id: 'squid', names: ['דיונון', 'קלאמרי', 'דיונונים'], emoji: '🦑', type: 'tentacled_beast', color: '#f43f5e', darkColor: '#be123c', shape: 'tentacles' },
  { id: 'shark', names: ['כריש', 'כרישים'], emoji: '🦈', type: 'fierce_beast', color: '#0284c7', darkColor: '#0c4a6e', shape: 'beast' },
  { id: 'whale', names: ['לוויתן', 'לוויתנים', 'לויתן'], emoji: '🐋', type: 'giant_beast', color: '#0369a1', darkColor: '#082f49', shape: 'beast' },
  { id: 'dolphin', names: ['דולפין', 'דולפינים'], emoji: '🐬', type: 'beast', color: '#38bdf8', darkColor: '#0369a1', shape: 'beast' },
  { id: 'crab', names: ['סרטן', 'סרטנים'], emoji: '🦀', type: 'clawed_beast', color: '#dc2626', darkColor: '#7f1d1d', shape: 'blob' },
  { id: 'lobster', names: ['לובסטר'], emoji: '🦞', type: 'clawed_beast', color: '#ea580c', darkColor: '#7c2d12', shape: 'blob' },
  { id: 'fish', names: ['דג', 'דגים', 'דגיגון'], emoji: '🐟', type: 'beast', color: '#38bdf8', darkColor: '#0284c7', shape: 'blob' },
  { id: 'turtle', names: ['צב', 'צבים', 'צבת'], emoji: '🐢', type: 'armored_beast', color: '#16a34a', darkColor: '#14532d', shape: 'blob' },
  { id: 'frog', names: ['צפרדע', 'צפרדעים', 'קרפדה'], emoji: '🐸', type: 'organic_beast', color: '#22c55e', darkColor: '#15803d', shape: 'blob' },
  { id: 'snake', names: ['נחש', 'נחשים', 'צפע'], emoji: '🐍', type: 'coiled_serpent', color: '#15803d', darkColor: '#052e16', shape: 'snake' },
  { id: 'lion', names: ['אריה', 'אריות', 'לביאה', 'כפיר'], emoji: '🦁', type: 'fierce_beast', color: '#f59e0b', darkColor: '#78350f', shape: 'beast' },
  { id: 'tiger', names: ['נמר', 'טיגריס', 'נמרים'], emoji: '🐯', type: 'fierce_beast', color: '#ea580c', darkColor: '#9a3412', shape: 'beast' },
  { id: 'bear', names: ['דב', 'דוב', 'דובים'], emoji: '🐻', type: 'giant_beast', color: '#78350f', darkColor: '#451a03', shape: 'beast' },
  { id: 'monkey', names: ['קוף', 'קופים', 'שימפנזה'], emoji: '🐵', type: 'living_creature', color: '#a16207', darkColor: '#713f12', shape: 'beast' },
  { id: 'elephant', names: ['פיל', 'פילים', 'פילון'], emoji: '🐘', type: 'giant_beast', color: '#64748b', darkColor: '#334155', shape: 'beast' },
  { id: 'giraffe', names: ['ג\'ירפה', 'גירפה', 'ז\'ירף'], emoji: '🦒', type: 'tall_beast', color: '#facc15', darkColor: '#ca8a04', shape: 'elongated' },
  { id: 'penguin', names: ['פינגווין', 'פינגווינים'], emoji: '🐧', type: 'living_creature', color: '#09090b', darkColor: '#000000', shape: 'beast' },
  { id: 'cat', names: ['חתול', 'חתולים', 'חתלתול', 'חתולה'], emoji: '🐱', type: 'pet_beast', color: '#f97316', darkColor: '#c2410c', shape: 'beast' },
  { id: 'dog', names: ['כלב', 'כלבים', 'כלבלב', 'כלבה'], emoji: '🐶', type: 'pet_beast', color: '#d97706', darkColor: '#78350f', shape: 'beast' },
  { id: 'horse', names: ['סוס', 'סוסים', 'סוסה'], emoji: '🐴', type: 'beast', color: '#b45309', darkColor: '#78350f', shape: 'beast' },
  { id: 'pig', names: ['חזיר', 'חזירים', 'חזיר בר'], emoji: '🐷', type: 'beast', color: '#f472b6', darkColor: '#db2777', shape: 'blob' },
  { id: 'cow', names: ['פרה', 'פרות', 'שור'], emoji: '🐮', type: 'beast', color: '#f8fafc', darkColor: '#18181b', shape: 'beast' },
  { id: 'chicken', names: ['תרנגולת', 'תרנגול', 'עוף'], emoji: '🐔', type: 'beast', color: '#ffffff', darkColor: '#dc2626', shape: 'blob' },
  { id: 'duck', names: ['ברווז', 'ברווזים'], emoji: '🦆', type: 'beast', color: '#15803d', darkColor: '#166534', shape: 'blob' },
  { id: 'owl', names: ['ינשוף', 'ינשופים', 'אוח'], emoji: '🦉', type: 'beast', color: '#78350f', darkColor: '#451a03', shape: 'blob' },
  { id: 'bat', names: ['עטלף', 'עטלפים'], emoji: '🦇', type: 'beast', color: '#18181b', darkColor: '#09090b', shape: 'blob' },
  { id: 'bee', names: ['דבורה', 'דבורים', 'צרעה'], emoji: '🐝', type: 'beast', color: '#facc15', darkColor: '#18181b', shape: 'blob' },
  { id: 'butterfly', names: ['פרפר', 'פרפרים'], emoji: '🦋', type: 'beast', color: '#38bdf8', darkColor: '#1d4ed8', shape: 'blob' },
  { id: 'spider', names: ['עכביש', 'עכבישים'], emoji: '🕷️', type: 'beast', color: '#18181b', darkColor: '#000000', shape: 'blob' },
  { id: 'dragon', names: ['דרקון', 'דרקונים'], emoji: '🐉', type: 'fierce_beast', color: '#16a34a', darkColor: '#14532d', shape: 'beast' },
  { id: 'dinosaur', names: ['דינוזאור', 'דינוזאורים', 'טי-רקס'], emoji: '🦖', type: 'giant_beast', color: '#65a30d', darkColor: '#365314', shape: 'beast' },
  { id: 'unicorn', names: ['חד קרן', 'יוניקורן'], emoji: '🦄', type: 'beast', color: '#f43f5e', darkColor: '#be123c', shape: 'beast' },
  { id: 'alien', names: ['חייזר', 'חייזרים', 'עבם'], emoji: '👽', type: 'sentient_creature', color: '#4ade80', darkColor: '#15803d', shape: 'blob' },
  { id: 'robot', names: ['רובוט', 'רובוטים'], emoji: '🤖', type: 'sentient_device', color: '#94a3b8', darkColor: '#334155', shape: 'device' },
  { id: 'ghost', names: ['רוח רפאים', 'רוח', 'שד'], emoji: '👻', type: 'sentient_creature', color: '#f8fafc', darkColor: '#94a3b8', shape: 'blob' },
  { id: 'skull', names: ['גולגולת', 'שלד'], emoji: '💀', type: 'bone_prop', color: '#f8fafc', darkColor: '#0f172a', shape: 'blob' },
  { id: 'clown', names: ['ליצן', 'ליצנים'], emoji: '🤡', type: 'sentient_creature', color: '#ef4444', darkColor: '#b91c1c', shape: 'blob' },

  // ==========================================
  // ירקות, פירות ומזון
  // ==========================================
  { id: 'eggplant', names: ['חציל', 'חצילים', 'חצילון'], emoji: '🍆', type: 'pear_organic', color: '#701a75', darkColor: '#4a044e', shape: 'pear' },
  { id: 'cucumber', names: ['מלפפון', 'מלפפונים', 'מלפפון חמוץ'], emoji: '🥒', type: 'elongated_organic', color: '#16a34a', darkColor: '#14532d', shape: 'elongated' },
  { id: 'tomato', names: ['עגבנייה', 'עגבניה', 'עגבניות', 'שרי'], emoji: '🍅', type: 'round_organic', color: '#dc2626', darkColor: '#991b1b', shape: 'round' },
  { id: 'carrot', names: ['גזר', 'גזרים'], emoji: '🥕', type: 'elongated_organic', color: '#ea580c', darkColor: '#9a3412', shape: 'elongated' },
  { id: 'banana', names: ['בננה', 'בננות'], emoji: '🍌', type: 'elongated_organic', color: '#facc15', darkColor: '#a16207', shape: 'elongated' },
  { id: 'watermelon', names: ['אבטיח', 'אבטיחים'], emoji: '🍉', type: 'huge_round', color: '#15803d', darkColor: '#991b1b', shape: 'round' },
  { id: 'apple', names: ['תפוח', 'תפוחים', 'תפוח עץ'], emoji: '🍎', type: 'round_organic', color: '#ef4444', darkColor: '#991b1b', shape: 'round' },
  { id: 'pear', names: ['אגס', 'אגסים'], emoji: '🍐', type: 'pear_organic', color: '#a3e635', darkColor: '#4d7c0f', shape: 'pear' },
  { id: 'strawberry', names: ['תות', 'תותים', 'תות שדה'], emoji: '🍓', type: 'small_berry', color: '#e11d48', darkColor: '#9f1239', shape: 'round' },
  { id: 'grape', names: ['ענבים', 'ענב'], emoji: '🍇', type: 'round_organic', color: '#7e22ce', darkColor: '#581c87', shape: 'round' },
  { id: 'lemon', names: ['לימון', 'לימונים'], emoji: '🍋', type: 'round_organic', color: '#fde047', darkColor: '#ca8a04', shape: 'round' },
  { id: 'orange', names: ['תפוז', 'תפוזים', 'קלמנטינה'], emoji: '🍊', type: 'round_organic', color: '#f97316', darkColor: '#c2410c', shape: 'round' },
  { id: 'pineapple', names: ['אננס'], emoji: '🍍', type: 'pear_organic', color: '#eab308', darkColor: '#a16207', shape: 'pear' },
  { id: 'avocado', names: ['אבוקדו'], emoji: '🥑', type: 'pear_organic', color: '#4d7c0f', darkColor: '#14532d', shape: 'pear' },
  { id: 'corn', names: ['תירס', 'קלח תירס'], emoji: '🌽', type: 'elongated_organic', color: '#eab308', darkColor: '#ca8a04', shape: 'elongated' },
  { id: 'pepper', names: ['פלפל', 'פלפלים', 'גמבה', 'פלפל חריף'], emoji: '🌶️', type: 'elongated_organic', color: '#dc2626', darkColor: '#991b1b', shape: 'elongated' },
  { id: 'potato', names: ['תפוח אדמה', 'תפוחי אדמה', 'תפוד'], emoji: '🥔', type: 'round_organic', color: '#b45309', darkColor: '#78350f', shape: 'round' },
  { id: 'onion', names: ['בצל', 'בצלים'], emoji: '🧅', type: 'round_organic', color: '#c084fc', darkColor: '#7e22ce', shape: 'round' },
  { id: 'garlic', names: ['שום'], emoji: '🧄', type: 'round_organic', color: '#f8fafc', darkColor: '#94a3b8', shape: 'round' },
  { id: 'broccoli', names: ['ברוקולי'], emoji: '🥦', type: 'round_organic', color: '#16a34a', darkColor: '#14532d', shape: 'round' },
  { id: 'mushroom', names: ['פטרייה', 'פטריה', 'פטריות'], emoji: '🍄', type: 'round_organic', color: '#dc2626', darkColor: '#7f1d1d', shape: 'round' },
  { id: 'pizza', names: ['פיצה', 'משולש פיצה'], emoji: '🍕', type: 'food_prop', color: '#f97316', darkColor: '#c2410c', shape: 'flat' },
  { id: 'burger', names: ['המבורגר', 'בורגר'], emoji: '🍔', type: 'food_prop', color: '#d97706', darkColor: '#78350f', shape: 'round' },
  { id: 'fries', names: ['צ\'יפס', 'ציפס'], emoji: '🍟', type: 'food_prop', color: '#facc15', darkColor: '#ca8a04', shape: 'device' },
  { id: 'hotdog', names: ['נקניקייה', 'נקניקיה', 'הוט דוג'], emoji: '🌭', type: 'elongated_organic', color: '#ea580c', darkColor: '#9a3412', shape: 'elongated' },
  { id: 'sushi', names: ['סושי'], emoji: '🍣', type: 'food_prop', color: '#09090b', darkColor: '#dc2626', shape: 'flat' },
  { id: 'icecream', names: ['גלידה', 'טילון', 'ארטיק'], emoji: '🍦', type: 'food_prop', color: '#f472b6', darkColor: '#db2777', shape: 'elongated' },
  { id: 'cake', names: ['עוגה', 'עוגת יום הולדת'], emoji: '🎂', type: 'food_prop', color: '#ec4899', darkColor: '#9d174d', shape: 'round' },
  { id: 'donut', names: ['דונאט', 'סופגנייה', 'סופגניה'], emoji: '🍩', type: 'food_prop', color: '#e11d48', darkColor: '#881337', shape: 'round' },
  { id: 'coffee_cup', names: ['ספל קפה', 'קפה', 'אספרסו', 'קפוצ\'ינו'], emoji: '☕', type: 'steaming_cup', color: '#ffffff', darkColor: '#78350f', shape: 'device' },
  { id: 'bread', names: ['כיכר לחם', 'לחם', 'חלה', 'בגט'], emoji: '🥖', type: 'food_loaf', color: '#d97706', darkColor: '#78350f', shape: 'elongated' },
  { id: 'egg', names: ['ביצה', 'ביצים'], emoji: '🥚', type: 'small_prop', color: '#fef3c7', darkColor: '#d97706', shape: 'round' },
  { id: 'cheese', names: ['גבינה', 'גבינה צהובה'], emoji: '🧀', type: 'food_prop', color: '#fde047', darkColor: '#ca8a04', shape: 'flat' },

  // ==========================================
  // ציוד אישי, לבוש ואביזרים
  // ==========================================
  { id: 'shirt', names: ['חולצה', 'חולצה להחלפה', 'חולצות', 'גופיה', 'טישרט'], emoji: '👕', type: 'wearable_torso', color: '#ef4444', darkColor: '#991b1b', shape: 'clothing' },
  { id: 'sunglasses', names: ['משקפי שמש', 'משקפיים', 'משקפי ראייה'], emoji: '🕶️', type: 'wearable_eyes', color: '#09090b', darkColor: '#000000', shape: 'eyewear' },
  { id: 'tie', names: ['עניבה', 'עניבות'], emoji: '👔', type: 'wearable_neck', color: '#dc2626', darkColor: '#991b1b', shape: 'snake' },
  { id: 'uniform', names: ['מדים', 'מדי ב', 'מדי א'], emoji: '🪖', type: 'wearable_torso', color: '#4d7c0f', darkColor: '#365314', shape: 'clothing' },
  { id: 'shoes', names: ['נעלי ספורט', 'נעליים', 'נעלי ריצה', 'סניקרס'], emoji: '👟', type: 'wearable_feet', color: '#f43f5e', darkColor: '#be123c', shape: 'shoes' },
  { id: 'boots', names: ['נעלי צבא', 'מגפיים', 'מגף'], emoji: '🥾', type: 'wearable_feet', color: '#27272a', darkColor: '#09090b', shape: 'shoes' },
  { id: 'hat', names: ['כובע', 'כובע מצחייה', 'כובעים'], emoji: '🧢', type: 'wearable_head', color: '#3b82f6', darkColor: '#1d4ed8', shape: 'hat' },
  { id: 'beret', names: ['כומתה', 'כומתות'], emoji: '💂', type: 'wearable_head', color: '#15803d', darkColor: '#14532d', shape: 'hat' },
  { id: 'crown', names: ['כתר', 'כתר מלכות'], emoji: '👑', type: 'wearable_head', color: '#facc15', darkColor: '#a16207', shape: 'hat' },
  { id: 'diamond', names: ['יהלום', 'יהלומים'], emoji: '💎', type: 'small_prop', color: '#38bdf8', darkColor: '#0284c7', shape: 'gem' },
  { id: 'ring', names: ['טבעת', 'טבעות'], emoji: '💍', type: 'small_prop', color: '#fbbf24', darkColor: '#d97706', shape: 'round' },
  { id: 'keys', names: ['מפתחות', 'מפתח', 'צרור מפתחות'], emoji: '🔑', type: 'hanging_metal', color: '#eab308', darkColor: '#a16207', shape: 'prop' },
  { id: 'wallet', names: ['ארנק', 'ארנקים'], emoji: '👛', type: 'flat_leather', color: '#78350f', darkColor: '#451a03', shape: 'flat' },

  // ==========================================
  // אלקטרוניקה, כושר, כלי נשק ומכשירים
  // ==========================================
  { id: 'phone', names: ['טלפון', 'סלולרי', 'פלאפון', 'סלולר', 'נייד', 'סמארטפון'], emoji: '📱', type: 'sentient_device', color: '#0284c7', darkColor: '#0f172a', shape: 'phone' },
  { id: 'laptop', names: ['מחשב נייד', 'לפטופ', 'מחשב'], emoji: '💻', type: 'sentient_device', color: '#64748b', darkColor: '#1e293b', shape: 'device' },
  { id: 'headphones', names: ['אוזניות'], emoji: '🎧', type: 'wearable_ears', color: '#ec4899', darkColor: '#be185d', shape: 'eyewear' },
  { id: 'smartwatch', names: ['שעון חכם', 'שעון'], emoji: '⌚', type: 'device_wrist', color: '#f59e0b', darkColor: '#78350f', shape: 'device' },
  { id: 'water_bottle', names: ['בקבוק מים', 'בקבוק', 'מימייה', 'מימיה'], emoji: '🍶', type: 'fluid_jet', color: '#0284c7', darkColor: '#0369a1', shape: 'bottle' },
  { id: 'dumbbell', names: ['משקולת', 'משקולות', 'דמבל'], emoji: '🏋️', type: 'heavy_weight', color: '#334155', darkColor: '#0f172a', shape: 'dumbbell' },
  { id: 'gym_bag', names: ['תיק אימון', 'תיק', 'תרמיל'], emoji: '🎒', type: 'bag_container', color: '#d97706', darkColor: '#78350f', shape: 'blob' },
  { id: 'sword', names: ['חרב', 'חרבות'], emoji: '⚔️', type: 'bladed_weapon', color: '#94a3b8', darkColor: '#475569', shape: 'elongated' },
  { id: 'shield', names: ['מגן', 'מגינים'], emoji: '🛡️', type: 'armor_shield', color: '#3b82f6', darkColor: '#1d4ed8', shape: 'blob' },
  { id: 'hammer', names: ['פטיש', 'פטישים'], emoji: '🔨', type: 'heavy_tool', color: '#78350f', darkColor: '#334155', shape: 'prop' },
  { id: 'bomb', names: ['פצצה', 'פצצות'], emoji: '💣', type: 'explosive_prop', color: '#09090b', darkColor: '#dc2626', shape: 'round' },
  { id: 'guitar', names: ['גיטרה', 'גיטרות'], emoji: '🎸', type: 'musical_prop', color: '#ea580c', darkColor: '#9a3412', shape: 'elongated' },
  { id: 'car', names: ['מכונית', 'רכב', 'אוטו'], emoji: '🚗', type: 'vehicle', color: '#dc2626', darkColor: '#991b1b', shape: 'device' },
  { id: 'rocket', names: ['חללית', 'טיל', 'רקטה'], emoji: '🚀', type: 'vehicle', color: '#f8fafc', darkColor: '#dc2626', shape: 'elongated' }
];

/**
 * פונקציית ניקוי וסילוק תחיליות וסיומות בעברית (Hebrew Stemmer)
 */
export function normalizeHebrewWord(rawText) {
  if (!rawText) return '';
  let str = String(rawText).trim().toLowerCase();
  
  // הסרת סימני פיסוק
  str = str.replace(/[.,;!?"'״׳()\[\]{}]/g, '').trim();
  
  return str;
}

/**
 * מנוע החיפוש הסמנטי החכם (Semantic Lookup Engine)
 * תומך בהטיות, תחיליות (ה-, ו-, ב-, ל-, מ-, כ-, ש-), וסיומות רבים (ים, ות)
 */
export function lookupMnemonicItem(rawText) {
  if (!rawText) return null;
  const clean = normalizeHebrewWord(rawText);
  if (!clean) return null;

  // 1. התאמה מדויקת
  const exact = MNEMONIC_CATALOG.find(it => it.names.includes(clean) || it.id === clean);
  if (exact) return { ...exact, name: clean };

  // 2. בדיקת תחיליות נפוצות בעברית (החציל -> חציל, והתמנון -> תמנון)
  const prefixes = ['וה', 'וב', 'ול', 'ומ', 'וכ', 'ה', 'ו', 'ב', 'ל', 'מ', 'כ', 'ש'];
  for (const prefix of prefixes) {
    if (clean.startsWith(prefix) && clean.length > prefix.length + 2) {
      const stripped = clean.slice(prefix.length);
      const match = MNEMONIC_CATALOG.find(it => it.names.includes(stripped) || it.id === stripped);
      if (match) return { ...match, name: clean };
    }
  }

  // 3. בדיקת סיומות רבים (חצילים -> חציל, תמנונים -> תמנון, עגבניות -> עגבנייה)
  if (clean.endsWith('ים') && clean.length > 3) {
    const singular = clean.slice(0, -2);
    const match = MNEMONIC_CATALOG.find(it => it.names.includes(singular) || it.names.some(n => n.startsWith(singular)));
    if (match) return { ...match, name: clean };
  }
  if (clean.endsWith('ות') && clean.length > 3) {
    const base = clean.slice(0, -2);
    const match = MNEMONIC_CATALOG.find(it => it.names.some(n => n.startsWith(base)));
    if (match) return { ...match, name: clean };
  }

  // 4. חיפוש חלקי (מכיל את המילה)
  const partial = MNEMONIC_CATALOG.find(it => 
    it.names.some(n => clean.includes(n) || n.includes(clean))
  );
  if (partial) return { ...partial, name: clean };

  // 5. מנגנון יצירת יצור סוריאליסטי דינמי (לעולם לא עוד קופסת קרטון משעממת!)
  // מחולל פלטת צבעים וצורת מפלצת ייחודית מבוססת גיבוב השם
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = clean.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const VIBRANT_PALETTES = [
    { color: '#8b5cf6', darkColor: '#5b21b6', emoji: '👾', type: 'surreal_beast', shape: 'blob' },
    { color: '#ec4899', darkColor: '#be185d', emoji: '🐙', type: 'tentacled_beast', shape: 'tentacles' },
    { color: '#06b6d4', darkColor: '#0e7490', emoji: '🔮', type: 'cosmic_orb', shape: 'round' },
    { color: '#10b981', darkColor: '#047857', emoji: '🥒', type: 'organic_creature', shape: 'pear' },
    { color: '#f59e0b', darkColor: '#b45309', emoji: '⭐', type: 'radiant_titan', shape: 'blob' },
    { color: '#ef4444', darkColor: '#991b1b', emoji: '🔥', type: 'fierce_beast', shape: 'beast' }
  ];

  const palette = VIBRANT_PALETTES[Math.abs(hash) % VIBRANT_PALETTES.length];

  return {
    id: `custom_${clean}`,
    name: rawText,
    names: [clean],
    emoji: palette.emoji,
    type: palette.type,
    shape: palette.shape,
    color: palette.color,
    darkColor: palette.darkColor,
    isGeneratedSurreal: true
  };
}

export const ALL_MNEMONIC_ITEMS = MNEMONIC_CATALOG;
export const MNEMONIC_CATEGORIES = {};
