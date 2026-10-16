import React, { useState, useId } from 'react';
import { 
  lookupMnemonicItem, 
  ALL_MNEMONIC_ITEMS, 
  MNEMONIC_CATALOG 
} from '../../data/massiveMnemonicCatalog';

export const SURREAL_ART_STYLES = [
  {
    id: 'vector_cartoon',
    name: 'Bold 2D Cartoon',
    labelHe: 'קומיקס וקטורי מודרני',
    badge: '💥 Style A',
    desc: 'Bold 2D vector cartoon with thick comic outlines and vibrant cel-shading (Brawl Stars / modern indie game vibe)'
  },
  {
    id: 'claymation',
    name: 'Claymation',
    labelHe: 'פלסטלינה וסטופ-מושן',
    badge: '🏺 Style B',
    desc: 'Claymation / Stop-motion look with visible thumbprints, soft clay texture, and warm studio lighting'
  },
  {
    id: 'pixel_art',
    name: 'Chunky Pixel Art',
    labelHe: 'פיקסל ארט HD רטרו',
    badge: '👾 Style C',
    desc: '8-bit / 16-bit high-definition Pixel Art with exaggerated chunky details and stepped shading'
  },
  {
    id: 'surreal_3d',
    name: 'Surreal Minimalist 3D',
    labelHe: 'תלת-ממד סוריאליסטי מט',
    badge: '🔮 Style D',
    desc: 'Surreal minimalist 3D render with smooth matte pastel materials and dramatic studio shadows'
  }
];

export const DEFAULT_PRESET_LISTS = [
  {
    id: 'eggplant_octopus',
    title: 'חציל ותמנון סוריאליסטיים 🍆🐙',
    description: 'חציל סגול ענק חי ומזיע שמחזיק תמנון חי ובועט בזרועו!',
    items: ['חציל', 'תמנון']
  },
  {
    id: 'gym_dad',
    title: 'ציוד אימון כושר של אבא 🏋️',
    description: 'טלפון ענק חי לבוש בחולצה ומשקפי שמש, עניבה מנסה לשתות מבקבוק מים!',
    items: ['טלפון', 'משקפי שמש', 'חולצה להחלפה', 'עניבה', 'בקבוק מים']
  },
  {
    id: 'cucumber_salad',
    title: 'ירקות שוק ומזווה 🥒',
    description: 'מלפפון ענקי חי מרכיב משקפי שמש ומדבר בטלפון בזמן שעגבנייה מזיעה!',
    items: ['מלפפון', 'משקפי שמש', 'טלפון', 'עגבנייה']
  },
  {
    id: 'military_gear',
    title: 'ציוד צבא ומסדר 🪖',
    description: 'מדים חיים עם כומתה ענקית, חוגר, מימייה צבאית ונעלי קרב מרחפות!',
    items: ['מדים', 'כומתה', 'חוגר', 'מימייה צבאית', 'נעלי צבא']
  }
];

/**
 * אלגוריתם שיפוט הכימרה הסוריאליסטית (The Avant-Garde Surrealist Chimera Judge)
 */
export function judgeUltimateChimera(rawItems = [], forcedStyleId = null) {
  if (!rawItems || rawItems.length === 0) return null;

  // 1. נרמול פריטים
  const mappedItems = rawItems.map((raw, idx) => {
    const text = typeof raw === 'string' ? raw : (raw.text || raw.name || '');
    const meta = lookupMnemonicItem(text);
    return {
      id: raw.id || `item_${idx}`,
      text: meta ? meta.name : text,
      cleanName: text,
      meta: meta || { id: 'generic', type: 'generic_prop', color: '#64748b', emoji: '⭐' },
      completed: !!raw.completed
    };
  });

  const activeItems = mappedItems.filter(it => !it.completed);
  if (activeItems.length === 0) return null;

  // 2. בחירת סגנון אומנותי (Stylistic Randomization מתוך 4 הסגנונות)
  const styleSeed = activeItems.reduce((acc, it) => acc + (it.text.charCodeAt(0) || 1), 0);
  const chosenStyle = forcedStyleId 
    ? (SURREAL_ART_STYLES.find(s => s.id === forcedStyleId) || SURREAL_ART_STYLES[0])
    : SURREAL_ART_STYLES[styleSeed % SURREAL_ART_STYLES.length];

  // 3. היררכיית שיפוט: מי ראוי להיות הגיבור המרכזי הענק (The Absurd Anchor)?
  const PROTAGONIST_HIERARCHY = [
    'eggplant',       // חציל סגול ענק חי
    'octopus',        // תמנון ענק עם זרועות
    'phone',          // טלפון חכם ענק עם מסך פרצוף
    'cucumber',       // מלפפון ענקי חי
    'squid',          // דיונון
    'shark',          // כריש
    'laptop',         // מחשב נייד מדבר
    'dumbbell',       // משקולת שרירית חיה
    'watermelon',     // אבטיח ענק
    'tomato',         // עגבנייה ענקית
    'carrot',         // גזר ענק
    'banana',         // בננה ענקית
    'coffee_cup',     // ספל קפה ענק
    'book',           // ספר ענקי
    'smartwatch',     // שעון
    'shirt',          // חולצה חיה
    'water_bottle'    // בקבוק מים ענק
  ];

  let protagonist = null;
  for (const id of PROTAGONIST_HIERARCHY) {
    const found = activeItems.find(it => it.meta.id === id);
    if (found) {
      protagonist = found;
      break;
    }
  }

  if (!protagonist) {
    protagonist = activeItems[0];
  }

  // 4. חלוקת תפקידים סוריאליסטיים
  const otherItems = activeItems.filter(it => it.id !== protagonist.id);

  const roles = {
    protagonist,
    style: chosenStyle,
    eyewear: null,
    clothing: null,
    sentientTie: null,
    waterBottle: null,
    rightHand: null,
    leftHand: null,
    headgear: null,
    mouthHold: null,
    shoes: null,
    extras: []
  };

  otherItems.forEach(item => {
    const type = item.meta.type;
    const id = item.meta.id;

    if (id === 'tie' && !roles.sentientTie) {
      roles.sentientTie = item;
    } else if (type === 'wearable_eyes' && !roles.eyewear) {
      roles.eyewear = item;
    } else if (type === 'wearable_head' && !roles.headgear) {
      roles.headgear = item;
    } else if (type === 'wearable_torso' && !roles.clothing) {
      roles.clothing = item;
    } else if (type === 'fluid_jet' && !roles.waterBottle) {
      roles.waterBottle = item;
    } else if (type === 'wearable_feet' && !roles.shoes) {
      roles.shoes = item;
    } else if (type === 'elongated_organic' && !roles.mouthHold && protagonist.meta.id !== id) {
      roles.mouthHold = item;
    } else if (!roles.rightHand) {
      roles.rightHand = item;
    } else if (!roles.leftHand) {
      roles.leftHand = item;
    } else {
      roles.extras.push(item);
    }
  });

  return roles;
}

/**
 * מחולל פרומפט אומנות סוריאליסטי
 */
export function generateSurrealArtPrompt(rawItems = [], forcedStyleId = null) {
  const chimera = judgeUltimateChimera(rawItems, forcedStyleId);
  if (!chimera) return '';

  const { protagonist, style, eyewear, clothing, sentientTie, waterBottle, rightHand, leftHand, headgear, mouthHold, shoes } = chimera;
  const itemsListStr = (rawItems.map(it => typeof it === 'string' ? it : it.text || it.name)).join(', ');

  const styleText = style.desc;

  const anatomyDesc = [];
  anatomyDesc.push(`The central absurd anchor is a giant living sentient ${protagonist.text} acting as the main body/torso with bulging expressive cartoon eyes and beads of comedic sweat wobbling in an unstable pose.`);

  if (eyewear) {
    anatomyDesc.push(`crooked, oversized ${eyewear.text} resting askew across its face with dramatic comic lens reflections`);
  }

  if (clothing) {
    anatomyDesc.push(`a comically stretched, straining ${clothing.text} pulled tightly over its lower body with bulging seams`);
  }

  if (sentientTie) {
    if (waterBottle) {
      anatomyDesc.push(`the ${sentientTie.text} is an independent, sentient serpent-like creature coiled around the torso, wearing a comical expression and desperately reaching with an open mouth to drink from the ${waterBottle.text}`);
    } else {
      anatomyDesc.push(`the ${sentientTie.text} is an independent living creature acting as a flailing sentient scarf waving in the wind`);
    }
  }

  if (waterBottle) {
    anatomyDesc.push(`a ${waterBottle.text} blasting an energetic, pressurized cartoon jet of water droplets spraying in a wide arc`);
  }

  if (headgear) {
    anatomyDesc.push(`a disproportionately massive ${headgear.text} balanced precariously on the very top, tilting to one side`);
  }

  if (mouthHold) {
    anatomyDesc.push(`clamping a ${mouthHold.text} in its comically panting mouth like a cigar`);
  }

  if (rightHand) {
    if (rightHand.meta.id === 'octopus') {
      anatomyDesc.push(`gripping a frantic, living miniature octopus with swirling tentacles coiled around its wrist`);
    } else {
      anatomyDesc.push(`waving a ${rightHand.text} with an elastic rubber-hose cartoon arm`);
    }
  }

  if (leftHand) {
    anatomyDesc.push(`gripping a ${leftHand.text} with strained slapstick tension`);
  }

  if (shoes) {
    anatomyDesc.push(`perched upon tiny, wobbly ${shoes.text} that struggle to balance the massive creature`);
  }

  return `Surreal avant-garde memory anchor character hybrid, fusing items: [${itemsListStr}]. 
Style: ${styleText}. 
Scene composition: ${anatomyDesc.join('; ')}. 
Clean negative space, high contrast solid background, dramatic studio rim lighting, zero visual clutter, bold crisp silhouette.`;
}

/**
 * מחולל הסיפור הביזארי הדטרמיניסטי בעברית
 */
export function generateAbsurdStory(rawItems = []) {
  const chimera = judgeUltimateChimera(rawItems);
  if (!chimera) return '';

  const { protagonist, eyewear, clothing, sentientTie, waterBottle, rightHand, leftHand, mouthHold, shoes } = chimera;
  const parts = [];

  parts.push(`**${protagonist.text} ענקי וחי** עומד ומתנדנד באי-איזון מוחלט עם עיניים קומיות וטיפות זיעה`);

  if (clothing) {
    parts.push(`לבוש ב**${clothing.text}** שנמתחת עליו עד להתפקעות`);
  }

  if (eyewear) {
    parts.push(`מרכיב על הפרצוף **${eyewear.text}** ענקיים ועקומים`);
  }

  if (sentientTie && waterBottle) {
    parts.push(`ה**${sentientTie.text}** הוא יצור חי עצמאי שמנסה בייאוש לשתות מתוך ה**${waterBottle.text}**`);
  } else if (sentientTie) {
    parts.push(`ה**${sentientTie.text}** חי ומנפנף בידיים קטנות`);
  }

  if (waterBottle && !sentientTie) {
    parts.push(`מתיז סילון מים סוער מתוך ה**${waterBottle.text}**`);
  }

  if (mouthHold) {
    parts.push(`תוקע בפה **${mouthHold.text}** עסיסי כמו סיגר`);
  }

  if (rightHand) {
    if (rightHand.meta.id === 'octopus') {
      parts.push(`ביד ימין הוא אוחז ב**תמנון חי ובועט** שמלפף זרועות ורודות מסביב לזרוע שלו`);
    } else {
      parts.push(`מניף ביד ימין **${rightHand.text}**`);
    }
  }

  if (leftHand) {
    parts.push(`מחזיק ביד שמאל **${leftHand.text}**`);
  }

  if (shoes) {
    parts.push(`עומד על נעלי **${shoes.text}** קטנות מדי שרועדות מעומס`);
  }

  return parts.join(' ── ') + ' 💥 חיבור כאוטי ביזארי שלא יישכח!';
}

/**
 * מחולל מילת עוגן אסוציאטיבית פשוטה וחדה לשליפה מהירה
 */
export function generatePegKeyword(rawItems = []) {
  const chimera = judgeUltimateChimera(rawItems);
  if (!chimera) return { word: 'עוגן', color: '#f59e0b', emoji: '✨', reason: 'עוגן כללי' };

  if (chimera.protagonist.meta.id === 'eggplant') {
    return { word: 'סגול', color: '#9333ea', emoji: '🍆', reason: 'בגלל החציל הסגול הענק' };
  }

  if (chimera.protagonist.meta.id === 'octopus') {
    return { word: 'תמנון', color: '#ec4899', emoji: '🐙', reason: 'בגלל זרועות התמנון' };
  }

  if (chimera.clothing) {
    if (chimera.clothing.meta.id === 'uniform') {
      return { word: 'זית', color: '#65a30d', emoji: '🪖', reason: 'בגלל מדי הזית' };
    }
    return { word: 'אדום', color: '#ef4444', emoji: '🔴', reason: 'בגלל החולצה האדומה הבולטת' };
  }

  if (chimera.protagonist.meta.id === 'cucumber') {
    return { word: 'ירוק', color: '#16a34a', emoji: '🥒', reason: 'בגלל המלפפון הירוק' };
  }

  if (chimera.protagonist.meta.id === 'phone') {
    return { word: 'כחול', color: '#0284c7', emoji: '📱', reason: 'בגלל מסך הטלפון הכחול' };
  }

  if (chimera.waterBottle) {
    return { word: 'סילון', color: '#38bdf8', emoji: '🌊', reason: 'בגלל סילון המים המתפרץ' };
  }

  return { 
    word: chimera.protagonist.text, 
    color: chimera.protagonist.meta.color || '#f59e0b', 
    emoji: chimera.protagonist.meta.emoji || '⭐',
    reason: `בגלל ${chimera.protagonist.text}`
  };
}

/**
 * The Avant-Garde Surrealist Chimera SVG Component
 */
export function BizarreStackingEngine({
  items = [],
  baseX = 0,
  baseY = 0,
  forcedStyleId = null,
  onItemClick = null
}) {
  const [hoveredKey, setHoveredKey] = useState(null);
  const uid = useId().replace(/:/g, '_');

  if (!items || items.length === 0) return null;

  const chimera = judgeUltimateChimera(items, forcedStyleId);
  if (!chimera) return null;

  const { 
    protagonist, 
    style, 
    eyewear, 
    clothing, 
    sentientTie, 
    waterBottle, 
    rightHand, 
    leftHand, 
    headgear, 
    mouthHold, 
    shoes 
  } = chimera;

  const handlePartClick = (e, itemObj, roleName) => {
    e.stopPropagation();
    if (onItemClick && itemObj) {
      onItemClick(itemObj, roleName);
    }
  };

  const isPhone = protagonist.meta.id === 'phone';
  const isCucumber = protagonist.meta.id === 'cucumber';
  const isEggplant = protagonist.meta.id === 'eggplant';
  const isOctopus = protagonist.meta.id === 'octopus';

  const strokeWidthMain = style.id === 'vector_cartoon' ? 3.5 : (style.id === 'pixel_art' ? 4 : 2);
  const strokeColorMain = style.id === 'pixel_art' ? '#000000' : '#0f172a';

  return (
    <g className="surreal-hybrid-chimera" transform={`translate(${baseX}, ${baseY})`}>
      <defs>
        {/* צל רצפה עמוק */}
        <radialGradient id={`protagonistFloorShadow_${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.85" />
          <stop offset="65%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>

        {/* עור חציל סגול מלכותי מבריק ועסיסי */}
        <linearGradient id={`livingEggplantSkin_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="25%" stopColor="#7e22ce" />
          <stop offset="70%" stopColor="#581c87" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        {/* עור תמנון ורוד-מגנטה חי */}
        <linearGradient id={`livingOctopusSkin_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="45%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#9d174d" />
        </linearGradient>

        {/* מסך טלפון סלולרי מאיר */}
        <linearGradient id={`livingPhoneScreen_${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>

        {/* עור מלפפון ירוק עסיסי */}
        <linearGradient id={`livingCucumberSkin_${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="35%" stopColor="#16a34a" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>

        {/* סילון מים קומי מתפרץ */}
        <linearGradient id={`comicWaterJet_${uid}`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#e0f2fe" stopOpacity="0.4" />
        </linearGradient>

        {/* זוהר היילייט ב-Hover */}
        <filter id={`chimeraHighlightGlow_${uid}`} x="-35%" y="-35%" width="170%" height="170%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#facc15" floodOpacity="1" />
        </filter>
      </defs>

      {/* 1. צל קרקע רחב שמעגן את הדמות */}
      <ellipse cx="0" cy="20" rx="48" ry="12" fill={`url(#protagonistFloorShadow_${uid})`} />

      {/* 2. רגליים קומיות אלסטיות (רועדות בעומס) */}
      <g className="protagonist-legs">
        <path d="M -16,2 Q -22,10 -16,18" stroke={strokeColorMain} strokeWidth={strokeWidthMain} fill="none" strokeLinecap="round" />
        <path d="M 16,2 Q 22,8 16,18" stroke={strokeColorMain} strokeWidth={strokeWidthMain} fill="none" strokeLinecap="round" />

        {/* טיפות זיעה ממאמץ בקרקע 💦 */}
        <circle cx="-28" cy="14" r="2" fill="#38bdf8" />
        <circle cx="28" cy="15" r="2.2" fill="#38bdf8" />

        {shoes ? (
          <g 
            className="chimera-shoes-part"
            filter={hoveredKey === 'shoes' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
            onMouseEnter={() => setHoveredKey('shoes')}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={(e) => handlePartClick(e, shoes, 'shoes')}
            style={{ cursor: 'pointer' }}
          >
            <rect x="-26" y="14" width="18" height="7" rx="3" fill="#ef4444" stroke={strokeColorMain} strokeWidth={strokeWidthMain * 0.7} />
            <rect x="-27" y="18.5" width="20" height="3" rx="1.5" fill="#f8fafc" />
            <rect x="8" y="14" width="18" height="7" rx="3" fill="#ef4444" stroke={strokeColorMain} strokeWidth={strokeWidthMain * 0.7} />
            <rect x="7" y="18.5" width="20" height="3" rx="1.5" fill="#f8fafc" />
          </g>
        ) : (
          <g>
            <ellipse cx="-16" cy="18" rx="6" ry="3" fill="#18181b" />
            <ellipse cx="16" cy="18" rx="6" ry="3" fill="#18181b" />
          </g>
        )}
      </g>

      {/* 3. הגוף המרכזי הענק (THE ABSURD SENTIENT ANCHOR) */}
      <g 
        className="protagonist-main-body"
        filter={hoveredKey === 'protagonist' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
        onMouseEnter={() => setHoveredKey('protagonist')}
        onMouseLeave={() => setHoveredKey(null)}
        onClick={(e) => handlePartClick(e, protagonist, 'protagonist')}
        style={{ cursor: 'pointer' }}
      >
        {isEggplant ? (
          /* ========================================================
             חציל סגול מלכותי ענק חי - גוף אגסי עסיסי, כתר עלים וברק
             ======================================================== */
          <g transform="translate(0, -40) rotate(-4)">
            {/* גוף החציל המעוקל והשמנמן */}
            <path 
              d="M -13,-46 C -20,-18 -32,10 -26,34 C -20,52 20,52 26,34 C 32,10 20,-18 13,-46 C 7,-54 -7,-54 -13,-46 Z" 
              fill={`url(#livingEggplantSkin_${uid})`} 
              stroke={strokeColorMain} 
              strokeWidth={strokeWidthMain} 
            />

            {/* פס ברק לבן בוהק לאורך הכתף */}
            <path 
              d="M -18,0 C -22,14 -20,30 -14,38" 
              stroke="#f3e8ff" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeOpacity="0.45" 
              fill="none" 
            />

            {/* עלי גביע ירוקים של חציל (Calyx) בראשו */}
            <g transform="translate(0, -48)">
              {/* עלה ימין */}
              <path d="M 0,0 Q 14,-6 18,6 Q 10,6 0,2 Z" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />
              {/* עלה שמאל */}
              <path d="M 0,0 Q -14,-6 -18,6 Q -10,6 0,2 Z" fill="#15803d" stroke="#052e16" strokeWidth="1.2" />
              {/* עלה מרכז */}
              <path d="M 0,0 Q 0,-12 6,-18 Q -4,-12 0,0 Z" fill="#166534" stroke="#052e16" strokeWidth="1.2" />
              {/* גבעול מעוקל */}
              <path d="M 0,-4 Q -4,-22 4,-26" stroke="#166534" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>

            {/* עיניים קומיות ענקיות מופתעות על החציל */}
            <circle cx="-10" cy="-6" r="7.5" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="-9" cy="-6" r="4" fill="#000000" />
            <circle cx="-11" cy="-8" r="1.6" fill="#ffffff" />
            <circle cx="10" cy="-6" r="7.5" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="9" cy="-6" r="4" fill="#000000" />
            <circle cx="8" cy="-8" r="1.6" fill="#ffffff" />

            {/* גבות מאומצות */}
            <path d="M -16,-16 Q -10,-20 -4,-15" stroke="#000000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 4,-15 Q 10,-20 16,-16" stroke="#000000" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* פה קומי רחב שמתנשף */}
            <path d="M -8,14 Q 0,28 8,14 Z" fill="#4a044e" stroke="#000" strokeWidth="1.5" />
            <ellipse cx="0" cy="22" rx="4" ry="2.2" fill="#ec4899" />

            {/* טיפות זיעה ממאמץ 💦 */}
            <path d="M -26,-18 Q -32,-20 -29,-26 Q -26,-24 -26,-18 Z" fill="#38bdf8" />
            <path d="M 28,-14 Q 34,-16 31,-22 Q 28,-20 28,-14 Z" fill="#38bdf8" />
          </g>
        ) : isOctopus ? (
          /* ========================================================
             תמנון ענק חי - ראש כיפה רחב וזרועות מתפתלות עם כפתורי יניקה
             ======================================================== */
          <g transform="translate(0, -38)">
            {/* ראש כיפת התמנון */}
            <path 
              d="M -28,8 C -36,-14 -28,-48 0,-48 C 28,-48 36,-14 28,8 C 22,24 -22,24 -28,8 Z" 
              fill={`url(#livingOctopusSkin_${uid})`} 
              stroke={strokeColorMain} 
              strokeWidth={strokeWidthMain} 
            />

            {/* זרועות תמנון קדמיות תחתונות */}
            <path d="M -22,14 Q -34,28 -24,40 Q -14,48 -8,32" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" />
            <path d="M 22,14 Q 34,28 24,40 Q 14,48 8,32" fill="none" stroke="#db2777" strokeWidth="6" strokeLinecap="round" />
            <path d="M -6,20 Q -8,38 -2,44" fill="none" stroke="#db2777" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M 6,20 Q 8,38 2,44" fill="none" stroke="#db2777" strokeWidth="5.5" strokeLinecap="round" />

            {/* כפתורי יניקה צהובים (Suction Cups) */}
            <circle cx="-28" cy="26" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="-22" cy="38" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="28" cy="26" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <circle cx="22" cy="38" r="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />

            {/* עיניים קומיות גדולות וסקרניות */}
            <circle cx="-12" cy="-14" r="8" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="-11" cy="-14" r="4.2" fill="#000000" />
            <circle cx="-13" cy="-16" r="1.8" fill="#ffffff" />
            <circle cx="12" cy="-14" r="8" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="11" cy="-14" r="4.2" fill="#000000" />
            <circle cx="9" cy="-16" r="1.8" fill="#ffffff" />

            {/* פה קטן עגול מופתע */}
            <circle cx="0" cy="4" r="4" fill="#831843" stroke="#000" strokeWidth="1.2" />
          </g>
        ) : isPhone ? (
          /* טלפון חכם ענק חי */
          <g transform="translate(0, -42) rotate(-3)">
            <rect x="-28" y="-42" width="56" height="84" rx="11" fill="#0f172a" stroke={strokeColorMain} strokeWidth={strokeWidthMain} />
            <rect x="-23" y="-36" width="46" height="66" rx="7" fill={`url(#livingPhoneScreen_${uid})`} />
            
            <circle cx="-10" cy="-14" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="-9" cy="-14" r="3.8" fill="#000000" />
            <circle cx="-11" cy="-16" r="1.5" fill="#ffffff" />
            <circle cx="10" cy="-14" r="7" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="9" cy="-14" r="3.8" fill="#000000" />
            <circle cx="8" cy="-16" r="1.5" fill="#ffffff" />

            <path d="M -16,-24 Q -10,-28 -4,-23" stroke="#000000" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 4,-23 Q 10,-28 16,-24" stroke="#000000" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            <path d="M -8,5 Q 0,18 8,5 Z" fill="#b91c1c" stroke="#000" strokeWidth="1.5" />
            <ellipse cx="0" cy="11" rx="4" ry="2" fill="#f87171" />

            <path d="M -24,-32 Q -30,-34 -27,-40 Q -24,-38 -24,-32 Z" fill="#38bdf8" />
            <path d="M 26,-28 Q 32,-30 29,-36 Q 26,-34 26,-28 Z" fill="#38bdf8" />
          </g>
        ) : isCucumber ? (
          /* מלפפון ענקי חי */
          <g transform="translate(0, -42) rotate(4)">
            <path 
              d="M -16,-52 C -24,-20 -25,10 -16,38 C -8,48 8,48 16,38 C 25,10 24,-20 16,-52 C 12,-58 -12,-58 -16,-52 Z" 
              fill={`url(#livingCucumberSkin_${uid})`} 
              stroke={strokeColorMain} 
              strokeWidth={strokeWidthMain} 
            />
            <path d="M 0,-56 Q 6,-68 -4,-72" stroke="#15803d" strokeWidth="4" fill="none" strokeLinecap="round" />
            
            <circle cx="-10" cy="-20" r="2.2" fill="#86efac" />
            <circle cx="12" cy="-10" r="2.2" fill="#86efac" />
            <circle cx="-6" cy="15" r="2" fill="#86efac" />
            <circle cx="8" cy="24" r="2" fill="#86efac" />

            <circle cx="-7" cy="-24" r="6" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="-6" cy="-24" r="3.2" fill="#000000" />
            <circle cx="7" cy="-24" r="6" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="6" cy="-24" r="3.2" fill="#000000" />
            <path d="M -6,-8 Q 0,4 6,-8 Z" fill="#052e16" stroke="#052e16" strokeWidth="1.5" />
          </g>
        ) : (
          /* ========================================================
             מפלצת סוריאליסטית אורגנית חיה (לעולם לא קופסת קרטון!)
             ======================================================== */
          <g transform="translate(0, -42)">
            {/* גוף אורגני מעוגל ושופע צבע */}
            <path 
              d="M -24,-36 C -34,-10 -30,20 -20,38 C -10,48 10,48 20,38 C 30,20 34,-10 24,-36 C 18,-48 -18,-48 -24,-36 Z" 
              fill={protagonist.meta.color || '#8b5cf6'} 
              stroke={strokeColorMain} 
              strokeWidth={strokeWidthMain} 
            />
            {/* ברק אורגני */}
            <path d="M -16,-20 Q -24,4 -14,24" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.4" fill="none" />
            
            {/* סמל/אימוג'י בולט בבטן של היצור */}
            <text x="0" y="24" fontSize="24" textAnchor="middle" style={{ userSelect: 'none' }}>
              {protagonist.meta.emoji || '⭐'}
            </text>

            {/* עיניים קומיות חיות מובנות */}
            <circle cx="-9" cy="-14" r="6.5" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="-8" cy="-14" r="3.5" fill="#000000" />
            <circle cx="-10" cy="-16" r="1.4" fill="#ffffff" />
            <circle cx="9" cy="-14" r="6.5" fill="#ffffff" stroke="#000" strokeWidth="1" />
            <circle cx="8" cy="-14" r="3.5" fill="#000000" />
            <circle cx="7" cy="-16" r="1.4" fill="#ffffff" />
            <path d="M -6,0 Q 0,10 6,0 Z" fill="#000" />
          </g>
        )}
      </g>

      {/* 4. חולצה מתוחה עד להתפקעות */}
      {clothing && (
        <g 
          className="chimera-clothing-part"
          transform="translate(0, -18)"
          filter={hoveredKey === 'clothing' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
          onMouseEnter={() => setHoveredKey('clothing')}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => handlePartClick(e, clothing, 'clothing')}
          style={{ cursor: 'pointer' }}
        >
          <path 
            d="M -30,-14 L 30,-14 L 28,16 L -28,16 Z" 
            fill={clothing.meta.id === 'uniform' ? '#4d7c0f' : '#ef4444'} 
            stroke={strokeColorMain} 
            strokeWidth={strokeWidthMain * 0.8} 
          />
          <line x1="-14" y1="-2" x2="14" y2="-2" stroke="#ffffff" strokeWidth="1.2" strokeDasharray="3 2" />
          <polygon points="-12,-14 0,-4 12,-14" fill="#ffffff" stroke={strokeColorMain} strokeWidth="1" />
          <path d="M -30,-14 L -40,-2 L -34,6 L -26,-6 Z" fill="#ef4444" stroke={strokeColorMain} strokeWidth="1.5" />
          <path d="M 30,-14 L 40,-2 L 34,6 L 26,-6 Z" fill="#ef4444" stroke={strokeColorMain} strokeWidth="1.5" />
        </g>
      )}

      {/* 5. עניבה עצמאית חיה שמנסה בייאוש לשתות מבקבוק מים! */}
      {sentientTie && (
        <g 
          className="chimera-sentient-tie"
          transform="translate(-6, -34) rotate(12)"
          filter={hoveredKey === 'sentientTie' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
          onMouseEnter={() => setHoveredKey('sentientTie')}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => handlePartClick(e, sentientTie, 'sentientTie')}
          style={{ cursor: 'pointer' }}
        >
          <path 
            d="M 0,0 C 8,8 14,18 20,10 C 26,2 34,4 40,-4" 
            fill="none" 
            stroke="#dc2626" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          <path 
            d="M 0,0 C 8,8 14,18 20,10 C 26,2 34,4 40,-4" 
            fill="none" 
            stroke="#991b1b" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          <g transform="translate(42, -5)">
            <ellipse cx="0" cy="0" rx="4" ry="3" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="1" cy="-1" r="1.5" fill="#ffffff" />
            <circle cx="1.5" cy="-1" r="0.8" fill="#000000" />
            <path d="M 2,1 Q 5,2 3,4" stroke="#ffffff" strokeWidth="1" fill="none" />
          </g>
        </g>
      )}

      {/* 6. משקפי שמש ענקיים ועקומים */}
      {eyewear && (
        <g 
          className="chimera-eyewear-part"
          transform={isPhone ? "translate(0, -56) rotate(-6)" : "translate(0, -48) rotate(-6)"}
          filter={hoveredKey === 'eyewear' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
          onMouseEnter={() => setHoveredKey('eyewear')}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => handlePartClick(e, eyewear, 'eyewear')}
          style={{ cursor: 'pointer' }}
        >
          <path d="M -24,-2 Q 0,-8 24,-2" stroke="#000000" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M -23,0 L -4,0 C -4,15 -15,18 -23,11 Z" fill="#09090b" stroke="#000000" strokeWidth="2" />
          <line x1="-20" y1="3" x2="-10" y2="13" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.85" />
          <path d="M 4,0 L 23,0 C 23,11 15,18 4,15 Z" fill="#09090b" stroke="#000000" strokeWidth="2" />
          <line x1="7" y1="3" x2="17" y2="13" stroke="#38bdf8" strokeWidth="2" strokeOpacity="0.85" />
        </g>
      )}

      {/* 7. כובע / כומתה ענקית */}
      {headgear && (
        <g 
          className="chimera-headgear-part"
          transform="translate(4, -80) rotate(-10)"
          filter={hoveredKey === 'headgear' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
          onMouseEnter={() => setHoveredKey('headgear')}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => handlePartClick(e, headgear, 'headgear')}
          style={{ cursor: 'pointer' }}
        >
          <ellipse cx="0" cy="0" rx="28" ry="10" fill={headgear.meta.id === 'beret' ? '#15803d' : '#3b82f6'} stroke={strokeColorMain} strokeWidth="2" />
          <circle cx="0" cy="-3" r="3" fill="#facc15" />
        </g>
      )}

      {/* 8. פריט תקוע בפה (מלפפון / גזר כסיגר עשן) */}
      {mouthHold && (
        <g 
          className="chimera-mouth-part"
          transform="translate(10, -28) rotate(-18)"
          filter={hoveredKey === 'mouthHold' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
          onMouseEnter={() => setHoveredKey('mouthHold')}
          onMouseLeave={() => setHoveredKey(null)}
          onClick={(e) => handlePartClick(e, mouthHold, 'mouthHold')}
          style={{ cursor: 'pointer' }}
        >
          <rect x="0" y="-5" width="30" height="10" rx="4" fill="#16a34a" stroke="#14532d" strokeWidth="1.5" />
          <circle cx="10" cy="-1" r="1.2" fill="#86efac" />
          <circle cx="20" cy="1" r="1.2" fill="#86efac" />
          <path d="M 32,0 Q 36,-6 40,-4 Q 44,-10 48,-8" stroke="#cbd5e1" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* 9. זרוע ימין + בקבוק מים יורה סילון או תמנון חי ובועט! 🐙 */}
      <g className="protagonist-right-arm">
        <path d="M 26,-26 Q 44,-20 40,-8" stroke={strokeColorMain} strokeWidth={strokeWidthMain} strokeLinecap="round" fill="none" />

        {/* מקרה א': בקבוק מים משפריץ סילון */}
        {waterBottle && (
          <g 
            className="chimera-waterbottle-part"
            transform="translate(42, -12) rotate(35)"
            filter={hoveredKey === 'waterBottle' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
            onMouseEnter={() => setHoveredKey('waterBottle')}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={(e) => handlePartClick(e, waterBottle, 'waterBottle')}
            style={{ cursor: 'pointer' }}
          >
            <rect x="-6" y="-16" width="12" height="24" rx="4" fill="#0284c7" stroke={strokeColorMain} strokeWidth="1.5" />
            <rect x="-3.5" y="-21" width="7" height="5" rx="1.5" fill="#facc15" stroke="#713f12" strokeWidth="1" />
            <path 
              d="M 0,-21 Q 4,-45 25,-55 Q 35,-60 45,-56" 
              fill="none" 
              stroke={`url(#comicWaterJet_${uid})`} 
              strokeWidth="5" 
              strokeLinecap="round" 
            />
            <circle cx="15" cy="-42" r="2.2" fill="#38bdf8" />
            <circle cx="28" cy="-52" r="3" fill="#7dd3fc" />
            <circle cx="48" cy="-56" r="2.5" fill="#bae6fd" />
          </g>
        )}

        {/* מקרה ב': תמנון חי ובועט מוחזק ביד ימין (כמו בבדיקת חציל + תמנון!) */}
        {!waterBottle && rightHand && rightHand.meta.id === 'octopus' && (
          <g 
            className="chimera-righthand-octopus"
            transform="translate(44, -10)"
            filter={hoveredKey === 'rightHand' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
            onMouseEnter={() => setHoveredKey('rightHand')}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={(e) => handlePartClick(e, rightHand, 'rightHand')}
            style={{ cursor: 'pointer' }}
          >
            {/* גוף התמנון הקטן */}
            <ellipse cx="0" cy="0" rx="14" ry="12" fill="#ec4899" stroke={strokeColorMain} strokeWidth="1.8" />
            
            {/* זרועות מתפתלות שמלפפות את היד */}
            <path d="M -8,6 Q -18,18 -8,26 Q 2,24 -4,14" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
            <path d="M 6,6 Q 18,16 12,24 Q 2,22 4,12" fill="none" stroke="#db2777" strokeWidth="4" strokeLinecap="round" />
            <path d="M 12,-2 Q 24,0 20,-8" fill="none" stroke="#db2777" strokeWidth="3.5" strokeLinecap="round" />

            {/* כפתורי יניקה צהובים קטנים */}
            <circle cx="-14" cy="18" r="1.5" fill="#fef08a" />
            <circle cx="16" cy="16" r="1.5" fill="#fef08a" />
            <circle cx="20" cy="-4" r="1.5" fill="#fef08a" />

            {/* פרצוף תמנון קומי חי שמביט לצדדים */}
            <circle cx="-4" cy="-2" r="3.5" fill="#ffffff" />
            <circle cx="-3" cy="-2" r="1.8" fill="#000000" />
            <circle cx="5" cy="-2" r="3.5" fill="#ffffff" />
            <circle cx="6" cy="-2" r="1.8" fill="#000000" />
            <path d="M -1,5 Q 1,8 3,5" stroke="#831843" strokeWidth="1.2" fill="none" />
          </g>
        )}

        {/* מקרה ג': פריט כללי אחר ביד ימין (לא תמנון ולא בקבוק) */}
        {!waterBottle && rightHand && rightHand.meta.id !== 'octopus' && (
          <g 
            className="chimera-righthand-prop"
            transform="translate(42, -10)"
            filter={hoveredKey === 'rightHand' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
            onMouseEnter={() => setHoveredKey('rightHand')}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={(e) => handlePartClick(e, rightHand, 'rightHand')}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="0" cy="0" r="13" fill={rightHand.meta.color || '#f59e0b'} stroke={strokeColorMain} strokeWidth="1.8" />
            <text x="0" y="5" fontSize="15" textAnchor="middle">{rightHand.meta.emoji || '⭐'}</text>
          </g>
        )}
      </g>

      {/* 10. זרוע שמאל + פריט מוחזק */}
      <g className="protagonist-left-arm">
        <path d="M -26,-26 Q -44,-20 -40,-8" stroke={strokeColorMain} strokeWidth={strokeWidthMain} strokeLinecap="round" fill="none" />

        {leftHand && (
          <g 
            className="chimera-lefthand-prop"
            transform="translate(-42, -10)"
            filter={hoveredKey === 'leftHand' ? `url(#chimeraHighlightGlow_${uid})` : undefined}
            onMouseEnter={() => setHoveredKey('leftHand')}
            onMouseLeave={() => setHoveredKey(null)}
            onClick={(e) => handlePartClick(e, leftHand, 'leftHand')}
            style={{ cursor: 'pointer' }}
          >
            {leftHand.meta.id === 'dumbbell' ? (
              <g transform="rotate(-20)">
                <rect x="-4" y="-14" width="8" height="28" rx="2" fill="#334155" stroke={strokeColorMain} strokeWidth="1.2" />
                <rect x="-10" y="-18" width="20" height="6" rx="2" fill="#1e293b" stroke={strokeColorMain} strokeWidth="1.2" />
                <rect x="-10" y="12" width="20" height="6" rx="2" fill="#1e293b" stroke={strokeColorMain} strokeWidth="1.2" />
              </g>
            ) : (
              <g>
                <circle cx="0" cy="0" r="13" fill={leftHand.meta.color || '#f59e0b'} stroke={strokeColorMain} strokeWidth="1.8" />
                <text x="0" y="5" fontSize="15" textAnchor="middle">{leftHand.meta.emoji || '🎒'}</text>
              </g>
            )}
          </g>
        )}
      </g>
    </g>
  );
}
