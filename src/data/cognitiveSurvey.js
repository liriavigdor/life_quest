// Cognitive & Associative Profiling Engine for "Land of Memories" (ארץ הזכרונות)
// Abstract, low-friction associative mapping into tailored village frameworks.

export const DOMAINS_CATALOG = [
  {
    id: 'military',
    title: 'צבא וביטחון',
    emoji: '🪖',
    badge: 'משימות, פקודות וכשירות',
    desc: 'ניהול תפקיד צבאי/ביטחוני, פקודות, כוננות, משימות יומיומיות ועוגני משמעת.',
    color: '#65a30d',
    defaultName: 'מחנה הפלוגה'
  },
  {
    id: 'business',
    title: 'עסק ויזמות',
    emoji: '💼',
    badge: 'פרויקטים, לקוחות וצמיחה',
    desc: 'ניהול עסק או קריירה, מנועי צמיחה, לקוחות, יעדי הכנסה ותזרים.',
    color: '#d97706',
    defaultName: 'מתחם היזמות'
  },
  {
    id: 'sanctuary',
    title: 'חיים אישיים ושגרה',
    emoji: '🏡',
    badge: 'בית, הרגלים ושקט נפשי',
    desc: 'הרגלי שגרה, שנת לילה, כושר ותזונה, משפחה, רוגע ועוגני שלווה.',
    color: '#10b981',
    defaultName: 'נחלת השלווה'
  },
  {
    id: 'studies',
    title: 'לימודים והשכלה',
    emoji: '📚',
    badge: 'ידע, ספרים ומבחנים',
    desc: 'חומרי לימוד, מאמרים אקדמיים, מיומנויות מקצועיות ושינון מידע.',
    color: '#3b82f6',
    defaultName: 'מצפה הדעת'
  },
  {
    id: 'creative',
    title: 'יצירה ופרויקטים',
    emoji: '🎨',
    badge: 'קוד, כתיבה ותחביבים',
    desc: 'פרויקטי קוד אישיים, יצירה אמנותית, כתיבה, מוזיקה ועשייה מתוך תשוקה.',
    color: '#8b5cf6',
    defaultName: 'סדנת היצירה'
  },
  {
    id: 'finances',
    title: 'פיננסים והשקעות',
    emoji: '💰',
    badge: 'תקציב, חסכונות ועתיד',
    desc: 'מעקב הוצאות, חסכונות, תיק השקעות, עצמאות כלכלית וניהול סיכונים.',
    color: '#0ea5e9',
    defaultName: 'מצודת האוצר'
  }
];

export const THEMES_CATALOG = [
  {
    id: 'forest',
    name: 'יער עבות ומסתורי',
    emoji: '🌲',
    tagline: 'שטיחי טחב, עצים עתיקים ואור שמש בין הענפים',
    desc: 'מוגן, שקט, טבעי ומבודד. מעולה להפחתת עומס ולמיקוד פנימי עמוק.',
    biome: 'forest',
    paletteName: 'אזמרגד, טחב ועץ אלון'
  },
  {
    id: 'hills',
    name: 'גבעות פתוחות ושמש',
    emoji: '🌾',
    tagline: 'אופק רחב, משב רוח צלול ומרחב פתוח',
    desc: 'בהיר, אופטימי ומאפשר נשימה. מעולה לעוגנים של צמיחה, הרגלים והתחדשות.',
    biome: 'hills',
    paletteName: 'ירוק אביבי, פרחי בר ואדמה רעננה'
  },
  {
    id: 'desert',
    name: 'נווה מדבר וחולות זהב',
    emoji: '🏜️',
    tagline: 'דיונות חמות, אואזיס מים צלול ודקלים',
    desc: 'אנרגטי, חם ומסמל הישג וחוסן. אידיאלי למטרות שאפתניות ופיננסים.',
    biome: 'desert',
    paletteName: 'חרס, זהב חם וטורקיז מים'
  },
  {
    id: 'fortress',
    name: 'מבצר ימי-ביניים מבוצר',
    emoji: '🏰',
    tagline: 'חומות אבן עבות, לפידים ושער ברזל כבד',
    desc: 'משדר הגנה מוחלטת, סמכות ועמידה בלחץ. מצוין למשמעת ומשימות קריטיות.',
    biome: 'hills',
    paletteName: 'אבן גרניט, ברזל ולהבות לפיד'
  },
  {
    id: 'modern',
    name: 'מתחם מודרני מיושר ונקי',
    emoji: '🏛️',
    tagline: 'קווים גיאומטריים ישרים, שיש בהיר ומינימליזם',
    desc: 'מבטל הסחות דעת, הכל גלוי ואין הפתעות. מצוין לחשיבה אנליטית ולוגית.',
    biome: 'hills',
    paletteName: 'שיש לבן, מים צלולים ושבילי לבנים'
  }
];

// Abstract Association Categories (Pure & Simple)
export const ABSTRACT_ASSOCIATION_QUESTIONS = {
  color: {
    id: 'color',
    title: 'צבע ואווירה חושית',
    prompt: 'איזה צבע המוח שלך מדביק לתחום הזה?',
    options: [
      { id: 'green', text: 'ירוק טבעי', biome: 'forest', desc: 'יער, צמחייה ומוגנות' },
      { id: 'white', text: 'לבן ונקי', biome: 'hills', desc: 'מודרניות, שיש וסדר' },
      { id: 'gold', text: 'זהב ושמש', biome: 'desert', desc: 'חום, אואזיס והישג' },
      { id: 'stone_gray', text: 'אפור אבן', biome: 'hills', desc: 'חומות, מבצר ויציבות' },
      { id: 'blue', text: 'כחול מים', biome: 'hills', desc: 'רוגע, זרימה ושקט' }
    ]
  },
  style: {
    id: 'style',
    title: 'סגנון וארגון מרחבי',
    prompt: 'איזה סגנון ארגון מתאר את התחום הזה עבורך?',
    options: [
      { id: 'discipline', text: 'ארגון ומשמעת', desc: 'גריד מיושר, שבילים ישרים, סדר מופתי' },
      { id: 'modern', text: 'מודרניות וסדר', desc: 'קווים נקיים, רחבה מרוצפת, בהירות מלאה' },
      { id: 'pastoral', text: 'שלווה כפרית ורוגע', desc: 'שבילי עפר, עצי פרי, ספסל ומים' },
      { id: 'fortified', text: 'מבצר וגבולות', desc: 'חומות מגן היקפיות ושער כניסה מוגדר' }
    ]
  }
};

/**
 * Compiles the abstract answers into concrete, general village layouts.
 */
export function compileAbstractBlueprint({ selectedDomainIds, domainThemes = {}, domainAssociations = {} }) {
  const chosenDomains = DOMAINS_CATALOG.filter(d => selectedDomainIds.includes(d.id));

  const generatedVillages = chosenDomains.map((domain, index) => {
    const assoc = domainAssociations[domain.id] || {
      color: 'green',
      style: domain.id === 'military' ? 'discipline' : domain.id === 'business' ? 'modern' : 'pastoral'
    };

    // Color option determines theme/biome if not explicitly overridden
    const colorOpt = ABSTRACT_ASSOCIATION_QUESTIONS.color.options.find(c => c.id === assoc.color) || ABSTRACT_ASSOCIATION_QUESTIONS.color.options[0];
    const styleOpt = ABSTRACT_ASSOCIATION_QUESTIONS.style.options.find(s => s.id === assoc.style) || ABSTRACT_ASSOCIATION_QUESTIONS.style.options[0];

    const themeId = domainThemes[domain.id] || colorOpt.biome;
    const themeObj = THEMES_CATALOG.find(t => t.id === themeId) || THEMES_CATALOG[0];

    const villageId = `custom_${domain.id}_${Date.now()}_${index}`;
    const villageName = `${domain.title} — ${styleOpt.text}`;

    const placedObjects = buildGeneralVillageLayout(domain, themeObj, assoc);

    return {
      id: villageId,
      domainId: domain.id,
      name: villageName,
      biome: themeObj.biome,
      themeId: themeObj.id,
      themeName: themeObj.name,
      icon: domain.emoji,
      color: domain.color,
      badge: `${domain.badge} • ${styleOpt.text}`,
      description: `מעוצב על פי האסוציאציה שלך: גוון ${colorOpt.text} וסגנון של ${styleOpt.text} (${styleOpt.desc}).`,
      memoryFocus: `עוגן כללי לעיצוב והטמעת זיכרונות של ${domain.title}`,
      spatialRecipe: {
        color: colorOpt.text,
        style: styleOpt.text,
        styleDesc: styleOpt.desc,
        palette: themeObj.paletteName
      },
      placedObjects,
      expansionTier: 1,
      cultivatedPlots: [],
      createdAt: new Date().toISOString()
    };
  });

  const cognitiveProfile = {
    title: 'מיפוי עולמות הזיכרון האישי שלך',
    summary: 'הכפרים שלך כוננו בדיוק על פי האסוציאציות הפשוטות והמופשטות שבחרת: צבא מאורגן בירוק, יזמות מודרנית ומסודרת, ונחלת חיים שלווה וכפרית.',
    totalVillages: generatedVillages.length
  };

  return {
    cognitiveProfile,
    villages: generatedVillages
  };
}

/**
 * Builds a clean, general village layout (giving the user the framework while leaving room to create).
 */
function buildGeneralVillageLayout(domain, theme, assoc) {
  const objects = [];
  const cx = 12;
  const cy = 12;

  // 1. Core Starting Building
  let coreType = 'wooden_cabin';
  let coreName = 'מרכז הכפר';
  if (domain.id === 'military') {
    coreType = 'animal_coop';
    coreName = 'מפקדת המחנה';
  } else if (domain.id === 'business') {
    coreType = 'bakery';
    coreName = 'מרכז היזמות';
  } else if (domain.id === 'sanctuary') {
    coreType = 'greenhouse';
    coreName = 'בקתת השלווה';
  } else if (domain.id === 'studies') {
    coreType = 'library';
    coreName = 'ספריית הידע';
  }

  objects.push({
    gx: cx,
    gy: cy,
    type: coreType,
    customName: coreName,
    customEmoji: domain.emoji,
    dedicatedTo: `מרכז הליבה של ${domain.title}`,
    date: new Date().toLocaleDateString('he-IL')
  });

  // 2. Layout by Style
  const style = assoc.style;

  if (style === 'discipline') {
    // Symmetrical, organized grid with straight paved lines
    const road = 'cobblestone_road';
    for (let i = -2; i <= 2; i++) {
      if (i !== 0) {
        objects.push({ gx: cx + i, gy: cy, type: road, dedicatedTo: 'שביל מיושר' });
        objects.push({ gx: cx, gy: cy + i, type: road, dedicatedTo: 'שביל מיושר' });
      }
    }
    // Symmetrical corner accents
    objects.push({ gx: cx - 2, gy: cy - 2, type: 'bush' });
    objects.push({ gx: cx + 2, gy: cy - 2, type: 'bush' });
    objects.push({ gx: cx - 2, gy: cy + 2, type: 'bush' });
    objects.push({ gx: cx + 2, gy: cy + 2, type: 'bush' });

    // Center Banner / Flag anchor
    objects.push({
      gx: cx,
      gy: cy - 3,
      type: 'bonfire',
      customName: 'נקודת כינוס ומסדרים',
      customEmoji: '🚩'
    });
  } else if (style === 'modern') {
    // Clean modern lines, stone tiles, open central plaza
    const path = 'brick_path';
    objects.push({ gx: cx + 1, gy: cy, type: path, dedicatedTo: 'רחבת שיש מודרנית' });
    objects.push({ gx: cx - 1, gy: cy, type: path, dedicatedTo: 'רחבת שיש מודרנית' });
    objects.push({ gx: cx, gy: cy + 1, type: path, dedicatedTo: 'רחבת שיש מודרנית' });
    objects.push({ gx: cx, gy: cy - 1, type: path, dedicatedTo: 'רחבת שיש מודרנית' });

    objects.push({
      gx: cx + 2,
      gy: cy - 1,
      type: 'tea_table',
      customName: 'שולחן תכנון מודרני',
      customEmoji: '💼'
    });
    objects.push({
      gx: cx - 2,
      gy: cy + 1,
      type: 'reading_bench',
      customName: 'פינת פוקוס',
      customEmoji: '💡'
    });
  } else if (style === 'fortified') {
    // Fortified perimeter with gates
    const wall = theme.id === 'fortress' ? 'stone_wall' : 'wooden_fence';
    objects.push({ gx: cx - 2, gy: cy - 2, type: wall });
    objects.push({ gx: cx - 1, gy: cy - 2, type: wall });
    objects.push({ gx: cx + 1, gy: cy - 2, type: wall });
    objects.push({ gx: cx + 2, gy: cy - 2, type: wall });
    objects.push({ gx: cx, gy: cy - 2, type: 'cobblestone_road', dedicatedTo: 'שער מוגן' });
  } else {
    // Pastoral / Rural Calm
    // Winding dirt trail, water tile, fruit tree, bench
    objects.push({ gx: cx - 1, gy: cy + 1, type: 'dirt_trail' });
    objects.push({ gx: cx, gy: cy + 1, type: 'dirt_trail' });
    objects.push({ gx: cx + 1, gy: cy + 2, type: 'dirt_trail' });

    objects.push({
      gx: cx + 2,
      gy: cy + 1,
      type: 'river_tile',
      dedicatedTo: 'פלג מים לשלווה ורוגע'
    });
    objects.push({
      gx: cx + 3,
      gy: cy + 1,
      type: 'river_tile',
      dedicatedTo: 'מי פלג צלולים'
    });

    objects.push({
      gx: cx - 2,
      gy: cy,
      type: 'oak_tree',
      dedicatedTo: 'אלון ירוק ומוצל'
    });
    objects.push({
      gx: cx - 2,
      gy: cy + 2,
      type: 'reading_bench',
      customName: 'ספסל הפוגה כפרי',
      customEmoji: '🌿',
      dedicatedTo: 'פינת שקט ומנוחה'
    });
  }

  return objects;
}
