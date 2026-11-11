/**
 * LifeQuest Autonomous AI Mnemonic Curator & Self-Improving Quality Feedback Engine
 * 
 * מספק למערכת יכולות שיפוט קוגניטיבי, שליפת תמונות חיות ואוטונומיות (Wikimedia Commons API),
 * אריגת סיפורים קוהרנטיים ולולאת משוב ולימוד עצמי (👍 / 👎) לשיפור איכות האסוציאציות בזמן אמת.
 */

import { findMnemonicAssetByKeyword, calculateMatchScore } from '../data/mnemonicAssociativeCatalog.js';
import { findUserImageByKeyword, hebrewWordMatches, isAssociationDisliked } from './userImageRepository.js';
import { generateDynamicFallbackCard } from './deterministicStoryEngine.js';
import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool.js';
import { searchPopularWebImages } from './webImageSearch.js';
import { processTaskListWithSynergy } from './mnemonicPipelineOrchestrator.js';

const FEEDBACK_STORAGE_KEY = 'lifequest_mnemonic_feedback_records_v1';
const RATINGS_MAP_KEY = 'lifequest_mnemonic_ratings_map_v1';

// Comprehensive Hebrew to high-yield English search terms for Commons API
export const HEBREW_TO_COMMONS_QUERY_MAP = {
  // Food & Dining
  'שניצל': { primary: 'schnitzel cutlet', secondary: 'fried chicken cutlet plate' },
  'שניצלים': { primary: 'schnitzel cutlet', secondary: 'fried chicken cutlet plate' },
  'פיצה': { primary: 'pizza slice hot cheese', secondary: 'italian pizza oven' },
  'המבורגר': { primary: 'burger fries beef', secondary: 'cheeseburger sesame bun' },
  'פסטה': { primary: 'pasta spaghetti plate', secondary: 'italian pasta bolognese' },
  'סושי': { primary: 'sushi roll salmon', secondary: 'japanese sushi platter' },
  'מרק': { primary: 'hot soup bowl vegetable', secondary: 'chicken soup broth bowl' },
  'סלט': { primary: 'fresh vegetable salad bowl', secondary: 'green salad plate' },
  'לחם': { primary: 'fresh bread loaf bakery', secondary: 'sourdough bread crust' },
  'חלב': { primary: 'fresh milk glass jug', secondary: 'milk carton pour' },
  'ביצים': { primary: 'chicken eggs carton', secondary: 'farm fresh eggs brown' },
  'קפה': { primary: 'hot espresso coffee cup latte', secondary: 'coffee cup beans saucer' },
  'תה': { primary: 'hot tea cup herbal lemon', secondary: 'tea cup teapot ceramic' },
  'עוגה': { primary: 'chocolate cake slice dessert', secondary: 'birthday cake frosted' },
  'גלידה': { primary: 'ice cream cone colorful scoops', secondary: 'gelato ice cream bowl' },
  'שוקולד': { primary: 'chocolate bar broken pieces', secondary: 'dark chocolate squares' },
  'פחית': { primary: 'soda drink can cold', secondary: 'aluminum beverage can' },
  'קולה': { primary: 'cola soda glass ice lemon', secondary: 'soda can cold' },
  'בירה': { primary: 'beer mug foam cold', secondary: 'draft beer pint glass' },
  'יין': { primary: 'red wine glass bottle', secondary: 'white wine goblet vineyard' },
  'תפוח': { primary: 'fresh red apple fruit', secondary: 'green apple fresh leaf' },
  'בננה': { primary: 'ripe yellow banana bunch', secondary: 'single yellow banana' },
  'תפוז': { primary: 'fresh orange citrus fruit', secondary: 'orange slice juice' },
  'ענבים': { primary: 'fresh grapes bunch vine', secondary: 'purple grapes bowl' },
  'אבטיח': { primary: 'watermelon slice red fresh', secondary: 'whole watermelon fruit' },
  'סטייק': { primary: 'grilled beef steak plate', secondary: 'barbecue meat steak' },
  'בשר': { primary: 'grilled meat platter steak', secondary: 'roasted barbecue beef' },
  'דג': { primary: 'grilled fish salmon plate', secondary: 'fresh salmon fillet lemon' },

  // Media, TV & Pop Culture
  'סדרת אנימציה': { primary: 'animated cartoon characters', secondary: 'animation cel drawing colorful' },
  'אנימציה': { primary: 'animated cartoon illustration', secondary: 'classic cartoon character drawing' },
  'סדרה': { primary: 'television broadcast screen vintage', secondary: 'classic tv retro set' },
  'סרט': { primary: 'cinema film projector theater', secondary: 'movie clapperboard film reel' },
  'טלוויזיה': { primary: 'vintage retro television set', secondary: 'modern living room tv screen' },
  'בובספוג': { primary: 'spongebob squarepants character', secondary: 'yellow sea sponge cartoon' },
  'פיקאצ': { primary: 'pikachu electric mouse pokemon', secondary: 'pokemon character yellow' },
  'פיקאצ\'ו': { primary: 'pikachu electric mouse pokemon', secondary: 'pokemon character yellow' },
  'מריו': { primary: 'super mario bros character figure', secondary: 'super mario plumber hat' },
  'סוניק': { primary: 'sonic the hedgehog hedgehog figure', secondary: 'sonic speed blue hedgehog' },
  'דרקולה': { primary: 'bela lugosi count dracula vampire', secondary: 'vampire cloak fangs castle' },

  // Fantasy, Heroes & Professions
  'דרקון': { primary: 'fire breathing dragon sculpture statue', secondary: 'dragon statue Wawel Krakow' },
  'דרקונים': { primary: 'dragon statue sculpture fire', secondary: 'medieval dragon carving' },
  'לוחם': { primary: 'medieval knight warrior armor sword', secondary: 'samurai warrior armor suit' },
  'לוחמים': { primary: 'medieval knight warriors armor', secondary: 'ancient roman legionary soldier' },
  'אביר': { primary: 'medieval knight plate armor horse', secondary: 'gothic knight armor helmet' },
  'חייל': { primary: 'soldier military uniform helmet', secondary: 'infantry guard soldier watch' },
  'קוסם': { primary: 'magician top hat magic wand rabbit', secondary: 'wizard cloak magic staff robe' },
  'נינג\'ה': { primary: 'ninja warrior martial arts black', secondary: 'samurai warrior sword mask' },
  'פיראט': { primary: 'pirate captain hat eye patch', secondary: 'pirate ship flag crossbones' },
  'רופא': { primary: 'medical doctor stethoscope hospital', secondary: 'physician medical clinic coat' },
  'רופאה': { primary: 'female doctor stethoscope clinic', secondary: 'healthcare physician scrubs' },
  'שוטר': { primary: 'police officer uniform badge vehicle', secondary: 'police patrol officer cap' },
  'שוטרת': { primary: 'police officer uniform patrol', secondary: 'law enforcement officer badge' },
  'כבאי': { primary: 'firefighter helmet uniform fire truck', secondary: 'firefighter hose rescue' },
  'טבח': { primary: 'chef cooking uniform white hat', secondary: 'culinary master chef kitchen' },
  'שף': { primary: 'professional chef toque hat plate', secondary: 'restaurant chef cooking gourmet' },
  'תינוק': { primary: 'cute baby infant smiling cute', secondary: 'baby stroller infant carriage' },
  'אסקימואי': { primary: 'inuit hunter arctic parka snow', secondary: 'eskimo inuit igloo arctic' },

  // Errands & Cognitive Concepts
  'פגישה': { primary: 'business handshake deal meeting', secondary: 'executives handshake conference' },
  'מפגש': { primary: 'handshake agreement business deal', secondary: 'two people shaking hands contract' },
  'לחיצת ידיים': { primary: 'handshake business partnership deal', secondary: 'close up handshake agreement' },
  'שיחה': { primary: 'vintage rotary telephone call conversation', secondary: 'antique candlestick telephone brass' },
  'טלפון': { primary: 'vintage retro rotary telephone', secondary: 'classic red telephone booth' },
  'קרח': { primary: 'inuit igloo snow arctic tundra', secondary: 'blue ice glacier iceberg arctic' },
  'שלג': { primary: 'fresh snowy winter landscape trees', secondary: 'snowy mountain winter blizzard' },
  'איגלו': { primary: 'inuit snow igloo arctic dome', secondary: 'arctic igloo snow winter' },
  'טיפול שיניים': { primary: 'bela lugosi dracula vampire teeth', secondary: 'dental clinic hygiene dentist chair' },
  'רופא שיניים': { primary: 'bela lugosi dracula vampire fangs', secondary: 'dentist examination teeth clinic' },
  'שיניים': { primary: 'vampire fangs dracula teeth model', secondary: 'human teeth model dental' },
  'משקפיים': { primary: 'nerd geek thick horn rimmed eyeglasses', secondary: 'vintage round horn spectacles' },
  'משקפי ראייה': { primary: 'nerd thick eyeglasses frame', secondary: 'classic reading glasses book' },
  'עבדים': { primary: 'ancient egyptian pyramids giza monument', secondary: 'pyramids of giza sphinx egypt' },
  'פירמידות': { primary: 'ancient egyptian pyramids giza monument', secondary: 'great pyramid of giza desert' },
  'פירמידה': { primary: 'great pyramid giza egypt desert', secondary: 'ancient pyramids monuments stone' },
  'תחמושת': { primary: 'military artillery ammunition brass shells', secondary: 'ammo shells vintage military cannon' },
  'טעינה': { primary: 'artillery cannon ammunition reload', secondary: 'smartphone fast charger plugged cable' },
  'מטען': { primary: 'smartphone usb cable charger wall plug', secondary: 'charging cable modern electronic' },
  'סוללה': { primary: 'alkaline batteries pack aa power', secondary: 'rechargeable battery power energy' },
  'סוללות': { primary: 'alkaline batteries pack aa cylinder', secondary: 'lithium battery power pack' },
  'כושר': { primary: 'arnold schwarzenegger bodybuilding weights', secondary: 'heavy gym dumbbells barbells workout' },
  'אימון': { primary: 'gym dumbbells barbells workout fitness', secondary: 'fitness weightlifting gym barbell' },
  'סתימה': { primary: 'super mario pipe wrench plumber', secondary: 'plumbing pipe wrench tool brass' },
  'אינסטלטור': { primary: 'super mario plumber wrench overalls', secondary: 'plumber tools pipe repair wrench' },
  'תספורת': { primary: 'sonic the hedgehog hair spikes blue', secondary: 'barber scissors comb haircut salon' },
  'חשמל': { primary: 'electric lightning bolt spark blue', secondary: 'high voltage electric spark tesla' },
  'חשבון': { primary: 'money bag bank gold coins cash', secondary: 'leather wallet dollar bills cash' },
  'כסף': { primary: 'golden treasure chest coins wealth', secondary: 'bank money bills banknotes cash' },
  'בית חולים': { primary: 'medical doctor stethoscope clinic hospital', secondary: 'hospital building medical ambulance' },
  'בדיקת דם': { primary: 'medical laboratory test tube blood sample', secondary: 'medical syringe clinical laboratory' },
  'תרופה': { primary: 'medicine pills blister pack pharmacy', secondary: 'capsules tablets medicine bottle' },
  'תרופות': { primary: 'pharmacy pills medicine blister capsules', secondary: 'apothecary medicine bottles vintage' },

  // Everyday Objects & Tools
  'מפתח': { primary: 'vintage ornate brass skeleton key', secondary: 'antique iron key castle gate' },
  'מפתחות': { primary: 'bunch of antique brass skeleton keys', secondary: 'vintage key ring brass keys' },
  'מנעול': { primary: 'heavy brass antique padlock lock', secondary: 'iron padlock vintage security' },
  'חרב': { primary: 'medieval steel broadsword blade ornate', secondary: 'crusader knight sword hilt steel' },
  'מגן': { primary: 'medieval knight heraldic steel shield', secondary: 'bronze round shield warrior crest' },
  'ספר': { primary: 'ancient leather bound book open pages', secondary: 'vintage library stack of books' },
  'שעון': { primary: 'vintage brass pocket watch chain', secondary: 'classic mechanical wrist watch dials' },
  'מחשב': { primary: 'modern laptop computer glowing screen', secondary: 'workspace desktop monitor keyboard' },
  'אוזניות': { primary: 'modern studio over ear headphones music', secondary: 'vintage audio headphones retro' },
  'גיטרה': { primary: 'wooden acoustic guitar strings musical', secondary: 'classic electric rock guitar instrument' },
  'מצלמה': { primary: 'vintage analog film camera vintage lens', secondary: 'classic rangefinder camera leather strap' },
  'רכב': { primary: 'modern red sports car coupe', secondary: 'classic vintage automobile road' },
  'מכונית': { primary: 'modern automobile sports car drive', secondary: 'classic retro convertible car' },
  'אופניים': { primary: 'vintage city bicycle basket road', secondary: 'modern road racing bicycle cycle' },
  'אופנוע': { primary: 'classic motorcycle cruiser speed road', secondary: 'vintage cafe racer motorbike' },
  'מטוס': { primary: 'commercial passenger jet airplane sky clouds', secondary: 'vintage propeller airplane biplane flying' },
  'ספינה': { primary: 'tall wooden sailing ship ocean sails', secondary: 'galleon pirate sailing vessel sea' },
  'נר': { primary: 'burning wax candle warm flame glow', secondary: 'candelabra candles glowing dark' },
  'פרח': { primary: 'blooming red rose blossom fresh petal', secondary: 'colorful botanical flower bouquet' },
  'עץ': { primary: 'ancient giant oak tree green leaves', secondary: 'lush green forest woodland sunlight' },
  'זהב': { primary: 'golden bars bullion treasure vault', secondary: 'pirate treasure chest gold coins glittering' },
  'יהלום': { primary: 'sparkling cut diamond gemstone facet', secondary: 'brilliant clear diamond crystal jewelry' }
};

// Concept to high-impact visual search terms & English mappings for optimal imagery
const CONCEPT_VISUAL_MAP = {
  'שחות': { query: 'swimming pool blue water', anchor: 'בריכת שחייה', emoji: '🏊' },
  'לשחות': { query: 'swimming pool blue water', anchor: 'בריכת שחייה', emoji: '🏊' },
  'שחייה': { query: 'swimming pool blue water', anchor: 'בריכת שחייה', emoji: '🏊' },
  'בריכה': { query: 'swimming pool clear water', anchor: 'בריכת שחייה', emoji: '🏊' },
  'משקפת': { query: 'swimming goggles pool', anchor: 'משקפת שחייה', emoji: '🥽' },
  'קריוקי': { query: 'karaoke microphone stage', anchor: 'מיקרופון קריוקי', emoji: '🎤' },
  'לכתוב': { query: 'handwritten letter envelope', anchor: 'מכתב ומעטפה', emoji: '✉️' },
  'שוקולית': { query: 'chocolate milk drink powder', anchor: 'קופסת שוקולית', emoji: '🍫' },
  'נהיגה': { query: 'driving student learning car', anchor: 'רכב לימוד נהיגה', emoji: '🚗' },
  'חלב': { query: 'milk glass carton', anchor: 'כוס חלב רעננה', emoji: '🥛' },
  'לחם': { query: 'fresh bread loaf', anchor: 'כיכר לחם חמה', emoji: '🍞' },
  'ביצים': { query: 'chicken eggs carton', anchor: 'תבנית ביצים', emoji: '🥚' },
  'קפה': { query: 'espresso coffee cup', anchor: 'ספל קפה מהביל', emoji: '☕' },
  'נורה': { query: 'incandescent light bulb glowing', anchor: 'נורת להט זוהרת', emoji: '💡' },
  'מזגן': { query: 'air conditioner unit cool', anchor: 'שלט ומזגן קפוא', emoji: '❄️' },
  'מכונית': { query: 'modern car vehicle', anchor: 'מכונית נוצצת', emoji: '🚗' },
  'רכב': { query: 'modern automobile', anchor: 'רכב מוכן לנסיעה', emoji: '🚗' },
  'פנצ\'ר': { query: 'car tire puncture wheel', anchor: 'צמיג וג\'ק לרכב', emoji: '🛞' },
  'צמיג': { query: 'car tire rubber', anchor: 'צמיג חדש', emoji: '🛞' },
  'סוללה': { query: 'batteries aa pack power', anchor: 'סוללות אנרגיה', emoji: '🔋' },
  'סוללות': { query: 'batteries power', anchor: 'סוללות אנרגיה', emoji: '🔋' },
  'מטען': { query: 'smartphone charger cable', anchor: 'מטען וכבל חשמל', emoji: '🔌' },
  'תרופות': { query: 'medicine pills pharmacy blister', anchor: 'חפיסת תרופות', emoji: '💊' },
  'תרופה': { query: 'medicine pills', anchor: 'כדור תרופה', emoji: '💊' },
  'פגישה': { query: 'handshake deal business meeting', anchor: 'לחיצת ידיים', emoji: '🤝' },
  'מפגש': { query: 'handshake business meeting', anchor: 'לחיצת ידיים', emoji: '🤝' },
  'לחיצת ידיים': { query: 'handshake deal agreement', anchor: 'לחיצת ידיים', emoji: '🤝' },
  'שיחה': { query: 'vintage telephone call speaking', anchor: 'שיחת טלפון', emoji: '📞' },
  'טלפון': { query: 'vintage telephone call', anchor: 'טלפון', emoji: '☎️' },
  'קרח': { query: 'inuit igloo snow arctic', anchor: 'אסקימואי על הקרח', emoji: '❄️' },
  'שלג': { query: 'inuit igloo snow winter', anchor: 'אסקימואי בשלג', emoji: '❄️' },
  'טיפול שיניים': { query: 'dracula bela lugosi vampire teeth', anchor: 'דרקולה', emoji: '🧛' },
  'רופא שיניים': { query: 'dracula bela lugosi vampire teeth', anchor: 'דרקולה', emoji: '🧛' },
  'משקפיים': { query: 'nerd glasses horn rimmed', anchor: 'חנון עם משקפיים', emoji: '👓' },
  'משקפי ראייה': { query: 'nerd glasses eyeglasses', anchor: 'חנון עם משקפיים', emoji: '👓' },
  'כושר': { query: 'arnold schwarzenegger bodybuilding weights', anchor: 'שוורצנגר באימון', emoji: '🏋️' },
  'סתימה': { query: 'super mario plumber pipe wrench', anchor: 'סופר מריו עם מפתח שוודי', emoji: '🔧' },
  'תספורת': { query: 'sonic the hedgehog hair spikes', anchor: 'סוניק קוצים', emoji: '🦔' },
  'חשמל': { query: 'pikachu electric spark lightning', anchor: 'פיקאצ\'ו', emoji: '⚡' },
  'חשבון': { query: 'money bag bank wealth cash', anchor: 'שק כסף', emoji: '💰' },
  'בית חולים': { query: 'medical stethoscope doctor hospital', anchor: 'סטטוסקופ ורופא', emoji: '🩺' },
  'דרקון': { query: 'Dragon fire statue Wawel', anchor: 'דרקון יורק אש', emoji: '🐉' },
  'דרקונים': { query: 'Dragon fire statue Wawel', anchor: 'דרקון יורק אש', emoji: '🐉' },
  'אימון': { query: 'gym dumbbells weights fitness', anchor: 'משקולות אימון', emoji: '🏋️' },
  // Cognitive Mnemonic Leaps (Active Recall Anchors - Desirable Difficulty)
  'אסיפה': { query: 'parents teacher conference classroom', anchor: 'אסיפת הורים (הורים ומורה בכיתה)', emoji: '👨‍👩‍👧', directUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop' },
  'אסיפת': { query: 'parents teacher conference classroom', anchor: 'אסיפת הורים (הורים ומורה בכיתה)', emoji: '👨‍👩‍👧', directUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop' },
  'הורים': { query: 'happy family parents with child', anchor: 'משפחה והורים מחבקים ילד', emoji: '👨‍👩‍👦', directUrl: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop' },
  'מדים': { query: 'soldier military uniform camouflage', anchor: 'חייל במדי צבא', emoji: '🪖', directUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop' },
  'מדי': { query: 'soldier military uniform camouflage', anchor: 'חייל במדי צבא', emoji: '🪖', directUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop' },
  'מצנח': { query: 'skydiver parachute open sky jumping', anchor: 'צנחן עם מצנח פתוח בשמיים', emoji: '🪂', directUrl: 'https://images.unsplash.com/photo-1521673845961-d646698fb01e?w=800&auto=format&fit=crop' },
  'צניחה': { query: 'skydiver parachute open sky jumping', anchor: 'צנחן עם מצנח פתוח בשמיים', emoji: '🪂', directUrl: 'https://images.unsplash.com/photo-1521673845961-d646698fb01e?w=800&auto=format&fit=crop' },
  'כנס': { query: 'conference audience lecture hall', anchor: 'אולם כנסים והרצאה', emoji: '🏛️', directUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format&fit=crop' },
  'ישיבה': { query: 'business boardroom conference meeting', anchor: 'ישיבת צוות במשרד', emoji: '💼', directUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop' },
  'חופשה': { query: 'tropical beach palm trees ocean', anchor: 'חוף ים טרופי', emoji: '🏖️', directUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop' },
  'טיסה': { query: 'passenger airplane taking off sky', anchor: 'מטוס נוסעים בשמיים', emoji: '✈️', directUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop' },
  'בלון': { query: 'clown holding balloons', anchor: 'ליצן עם בלונים', emoji: '🤡' },
  'בלונים': { query: 'clown holding balloons', anchor: 'ליצן עם בלונים', emoji: '🤡' },
  'יד': { query: 'boxer boxing gloves athlete', anchor: 'כפפות אגרוף', emoji: '🥊' },
  'ידיים': { query: 'boxer boxing gloves athlete', anchor: 'כפפות אגרוף', emoji: '🥊' },
  'שמאל': { query: 'traffic police officer direction', anchor: 'שוטר תנועה (פנייה שמאלה)', emoji: '👮' },
  'שמאלה': { query: 'traffic police officer direction', anchor: 'שוטר תנועה (פנייה שמאלה)', emoji: '👮' },
  'פנויה': { query: 'yellow taxi cab city', anchor: 'מונית צהובה', emoji: '🚕' },
  'פנוי': { query: 'yellow taxi cab city', anchor: 'מונית צהובה', emoji: '🚕' },
  'ימין': { query: 'soldier saluting hand uniform', anchor: 'חייל מצדיע (ביד ימין)', emoji: '🫡' },
  'ימינה': { query: 'soldier saluting hand uniform', anchor: 'חייל מצדיע (ביד ימין)', emoji: '🫡' },
  'מצחיק': { query: 'mr bean comedy rowan atkinson', anchor: 'מר בין', emoji: '😂' },
  'צחוק': { query: 'mr bean comedy rowan atkinson', anchor: 'מר בין', emoji: '😂' },
  'בדיחה': { query: 'mr bean comedy rowan atkinson', anchor: 'מר בין', emoji: '😂' },
  'הומור': { query: 'charlie chaplin comedy', anchor: 'צ\'רלי צ\'פלין', emoji: '🎩' },
  'עצוב': { query: 'crying baby infant tears', anchor: 'תינוק בוכה', emoji: '😢' },
  'בכי': { query: 'crying baby infant tears', anchor: 'תינוק בוכה', emoji: '😢' },
  'כועס': { query: 'the incredible hulk angry green', anchor: 'הענק הירוק (האלק)', emoji: '😡' },
  'עצבים': { query: 'the incredible hulk angry green', anchor: 'הענק הירוק (האלק)', emoji: '😡' },
  'חכם': { query: 'albert einstein tongue genius', anchor: 'אלברט איינשטיין', emoji: '🧠' },
  'גאון': { query: 'albert einstein tongue genius', anchor: 'אלברט איינשטיין', emoji: '🧠' },
  'מהיר': { query: 'formula 1 racing car speed', anchor: 'רכב פורמולה 1', emoji: '🏎️' },
  'זריז': { query: 'formula 1 racing car speed', anchor: 'רכב פורמולה 1', emoji: '🏎️' },
  'איטי': { query: 'giant tortoise sea turtle walking', anchor: 'צב ענק', emoji: '🐢' },
  'לאט': { query: 'giant tortoise sea turtle walking', anchor: 'צב ענק', emoji: '🐢' },
  'עשיר': { query: 'treasure chest gold coins wealth', anchor: 'שק כסף וזהב', emoji: '💰' },
  'חזק': { query: 'arnold schwarzenegger bodybuilding weights', anchor: 'ארנולד שוורצנגר', emoji: '💪' },
  'מפחיד': { query: 'spooky halloween ghost costume', anchor: 'רוח רפאים', emoji: '👻' },
  'חם': { query: 'golden desert dunes hot sun', anchor: 'מדבר ושמש לוהטת', emoji: '☀️' },
  'קר': { query: 'inuit igloo snow arctic', anchor: 'אסקימואי באיגלו', emoji: '❄️' },
  'ישן': { query: 'sleeping giant panda tree branch', anchor: 'דובי פנדה ישן', emoji: '🐼' },
  'עייף': { query: 'sleeping giant panda tree branch', anchor: 'דובי פנדה ישן', emoji: '🥱' },
  'נקי': { query: 'cinderella cleaning vintage illustration', anchor: 'סינדרלה עם מטאטא', emoji: '✨' },
  'טעים': { query: 'italian chef holding pizza pie', anchor: 'שף איטלקי ופיצה', emoji: '🍕' },
  'מסוכן': { query: 'danger skull crossbones warning sign', anchor: 'שלט סכנה וגולגולת', emoji: '⚠️' }
};

/**
 * Resolve high-yield English search queries for any Hebrew term
 */
export function resolveEnglishMnemonicQueries(rawHebrew = '') {
  let clean = String(rawHebrew || '').trim();
  clean = clean.replace(/עוגן\s*מומלץ:?/g, '').split(/[—–-]/)[0].trim();
  clean = clean.replace(/\([^)]*\)/g, '').trim();
  if (!clean) return { primary: '', secondary: '' };

  // 1. Direct match in dictionary
  for (const [kw, queries] of Object.entries(HEBREW_TO_COMMONS_QUERY_MAP)) {
    if (clean === kw || clean.includes(kw)) {
      return queries;
    }
  }

  // 2. Check concept visual map
  for (const [kw, meta] of Object.entries(CONCEPT_VISUAL_MAP)) {
    if (clean === kw || clean.includes(kw)) {
      return { primary: meta.query, secondary: `${meta.query} illustration` };
    }
  }

  // 3. Fallback: derive from local pool themes/IDs (with precise Hebrew token matching, not substring includes)
  const matchedInPool = STAGED_IMAGES_POOL.find(p => 
    hebrewWordMatches(clean, p.name_he || p.name || p.suggestedName) || 
    p.associations?.some(a => hebrewWordMatches(clean, a))
  );

  if (matchedInPool && matchedInPool.id) {
    const englishName = matchedInPool.id.replace(/_/g, ' ');
    return {
      primary: `${englishName} iconic photo`,
      secondary: `${englishName} colorful illustration`
    };
  }

  return {
    primary: `${clean}`,
    secondary: `${clean} illustration`
  };
}

/**
 * Fetch a high-quality free cultural/associative image from Wikimedia Commons API
 */
export async function fetchCommonsMnemonicImage(query) {
  if (!query) return null;
  // STRICT BAN: Never query Commons with Hebrew letters!
  if (/[\u0590-\u05FF]/.test(query)) {
    return null;
  }
  try {
    const cleanQ = String(query).replace(/[^\w\s-]/g, '').trim();
    if (!cleanQ || cleanQ.length < 3) return null;

    async function queryCommons(searchTerm) {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(searchTerm)}&gsrnamespace=6&gsrlimit=8&prop=pageimages&pithumbsize=800&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) return null;

      const urls = Object.values(pages)
        .map(p => p.thumbnail?.source)
        .filter(u => {
          if (!u) return false;
          const low = u.toLowerCase();
          return (
            !low.includes('.svg') && 
            !low.includes('.pdf') && 
            !low.includes('.webm') && 
            !low.includes('microscope') &&
            !low.includes('page_') &&
            !low.includes('page1-') &&
            !low.includes('ia_') &&
            !low.includes('scan') &&
            !low.includes('document') &&
            !low.includes('text')
          );
        });

      return urls[0] || null;
    }

    // Try primary clean query
    let result = await queryCommons(cleanQ);
    if (result) return result;

    // If multi-word query yielded nothing, try first 2 words and last 2 words
    const words = cleanQ.split(/\s+/).filter(w => w.length > 2);
    if (words.length > 2) {
      const firstTwo = words.slice(0, 2).join(' ');
      result = await queryCommons(firstTwo);
      if (result) return result;

      const lastTwo = words.slice(-2).join(' ');
      result = await queryCommons(lastTwo);
      if (result) return result;
    }

    return null;
  } catch (err) {
    console.warn('Wikimedia Commons search failed:', err);
    return null;
  }
}

/**
 * AI Cognitive Derivation:
 * Given any freeform user text, resolves the most salient visual feature
 * and finds/fetches a verified associative image.
 */
export async function curateSingleItemWithAi(itemText = '') {
  const clean = String(itemText || '').trim();
  if (!clean) return null;
  const synergy = await processTaskListWithSynergy([clean]);
  return synergy?.stations?.[0] || null;
}

// Legacy curateSingleItemWithAi superseded by 4-agent processTaskListWithSynergy
async function _legacyCurateSingleItem(clean) {

  // Step 2, 3 & 4: Hebrew Root & Morphological Mnemonic Pipeline (The 5-Step Canon)
  // NOTE: Do NOT call saveUserImage here! Images are added to the user repository ONLY after positive feedback (👍).
  const rootCandidates = getRootMnemonicCandidates(clean);
  if (rootCandidates.length > 0) {
    const topCandidate = rootCandidates[0];
    const mappedCandidates = rootCandidates.map(c => ({
      anchorName: c.anchorWord || c.name,
      imageUrl: c.imageUrl,
      emoji: c.emoji || '🚨',
      explanation: c.explanation,
      fromPool: true
    }));

    return {
      title: clean,
      coreConcept: topCandidate.concept || clean,
      associationWord: topCandidate.anchorWord,
      imageUrl: topCandidate.imageUrl,
      emoji: topCandidate.emoji || '🚨',
      story: topCandidate.explanation,
      hasRepositoryImage: true,
      candidates: mappedCandidates,
      currentCandidateIndex: 0,
      card: {
        imageUrl: topCandidate.imageUrl,
        name: topCandidate.name,
        emoji: topCandidate.emoji || '🚨',
        caption: `${clean} ➔ ${topCandidate.anchorWord}`
      },
      alternativeCandidates: rootCandidates.slice(1),
      isAiCurated: true,
      confidenceScore: 99
    };
  }

  // 2. Check existing verified catalog / staged pool / master arsenal
  const existing = findMnemonicAssetByKeyword(clean);
  if (existing && (existing.matchScore >= 80 || existing.isVerified)) {
    const anchorWord = existing.name || existing.title || clean;
    return {
      title: clean,
      associationWord: anchorWord,
      imageUrl: existing.imageUrl,
      emoji: existing.emoji || '⭐',
      story: existing.caption || `עוגן מנצח בארמון: ${anchorWord}`,
      hasRepositoryImage: true,
      candidates: [
        {
          anchorName: anchorWord,
          imageUrl: existing.imageUrl,
          emoji: existing.emoji || '⭐',
          explanation: existing.caption || `עוגן מנצח בארמון: ${anchorWord}`,
          fromPool: true
        }
      ],
      currentCandidateIndex: 0,
      card: {
        imageUrl: existing.imageUrl,
        name: anchorWord,
        emoji: existing.emoji || '⭐',
        caption: existing.caption || anchorWord
      },
      isAiCurated: false,
      confidenceScore: existing.matchScore || 90
    };
  }

  // 3. Check direct cognitive concept mapping
  let chosenQuery = clean;
  let chosenAnchor = clean;
  let chosenEmoji = '💡';
  let matchedMeta = null;

  for (const [kw, meta] of Object.entries(CONCEPT_VISUAL_MAP)) {
    if (clean.includes(kw)) {
      matchedMeta = meta;
      chosenQuery = meta.query;
      chosenAnchor = meta.anchor;
      chosenEmoji = meta.emoji;
      break;
    }
  }

  if (matchedMeta) {
    const anchorMatch = findMnemonicAssetByKeyword(chosenAnchor);
    let anchorImageUrl = anchorMatch?.imageUrl;

    if (!anchorImageUrl && (chosenQuery || chosenAnchor)) {
      try {
        const popular = await searchPopularWebImages(chosenAnchor, 3, chosenQuery);
        if (popular && popular[0]) {
          anchorImageUrl = popular[0];
        }
      } catch (_) {}
    }
    if (!anchorImageUrl && chosenQuery) {
      anchorImageUrl = await fetchCommonsMnemonicImage(chosenQuery);
    }
    if (!anchorImageUrl && matchedMeta.directUrl) {
      anchorImageUrl = matchedMeta.directUrl;
    }
    const finalUrl = anchorImageUrl || matchedMeta.directUrl || generateDynamicFallbackCard(chosenAnchor);

    return {
      title: clean,
      associationWord: chosenAnchor,
      imageUrl: finalUrl,
      emoji: chosenEmoji,
      story: `עוגן זיכרון פעיל: ${clean} ➔ ${chosenAnchor}`,
      hasRepositoryImage: Boolean(anchorMatch?.imageUrl),
      candidates: [
        {
          anchorName: chosenAnchor,
          imageUrl: finalUrl,
          emoji: chosenEmoji,
          explanation: `עוגן זיכרון פעיל: ${clean} ➔ ${chosenAnchor}`,
          fromPool: Boolean(anchorMatch?.imageUrl)
        }
      ],
      currentCandidateIndex: 0,
      card: {
        imageUrl: finalUrl,
        name: chosenAnchor,
        emoji: chosenEmoji,
        caption: `${clean} ➔ ${chosenAnchor}`
      },
      isAiCurated: Boolean(anchorImageUrl),
      confidenceScore: 98
    };
  }

  // 4. שער ברזל: איסור מוחלט על חיפוש ביטוי המשימה הגולמי ברשת!
  // סוכן 2 ו-3 מחפשים ברשת אך ורק עוגן מאושר באנגלית צילומית שיצא מסוכן 1, ולעולם לא טקסט משימה גולמי.
  let webUrls = [];
  if (chosenAnchor && chosenAnchor !== clean) {
    const { primary } = resolveEnglishMnemonicQueries(chosenAnchor);
    webUrls = await searchPopularWebImages(chosenAnchor, 4, primary);
  }

  // 5. Check STAGED_IMAGES_POOL ONLY for strict exact name match on real-world items (reject fictional characters!)
  let fallbackLocalUrl = null;
  const poolItem = STAGED_IMAGES_POOL.find(p => {
    if (p.theme === 'fictional_pop' || p.category?.includes('בדיוניות') || p.category?.includes('1. דמויות')) {
      return false;
    }
    const pName = (p.name_he || p.name || p.suggestedName || '').trim().toLowerCase();
    return pName && (pName === clean.toLowerCase() || clean.toLowerCase() === pName);
  });
  if (poolItem && poolItem.imageUrl) {
    fallbackLocalUrl = poolItem.imageUrl;
    if (chosenAnchor === clean && (poolItem.suggestedName || poolItem.name_he)) {
      chosenAnchor = poolItem.suggestedName || poolItem.name_he;
    }
  }

  // Prioritize real web images of the actual object, then local exact match, then commons
  const allCandidateUrls = Array.from(new Set([
    ...webUrls,
    ...(fallbackLocalUrl ? [fallbackLocalUrl] : []),
    ...(commonsUrl ? [commonsUrl] : [])
  ])).filter(Boolean);

  const finalImageUrl = allCandidateUrls[0] || generateDynamicFallbackCard(chosenAnchor);
  const candidates = allCandidateUrls.length > 0
    ? allCandidateUrls.map((url) => ({
        anchorName: chosenAnchor,
        imageUrl: url,
        emoji: chosenEmoji,
        explanation: `עוגן חזותי עבור "${clean}" — לחץ אהבתי 👍 כדי להוסיף אותו למאגר הקבוע שלך!`,
        fromPool: url === fallbackLocalUrl
      }))
    : [
        {
          anchorName: chosenAnchor,
          imageUrl: generateDynamicFallbackCard(chosenAnchor),
          emoji: chosenEmoji,
          explanation: `עוגן זיכרון בארמון עבור "${clean}"`,
          fromPool: false
        }
      ];

  return {
    title: clean,
    associationWord: chosenAnchor,
    imageUrl: finalImageUrl,
    emoji: chosenEmoji,
    story: `עוגן חזותי פעיל: ${chosenAnchor} — חרוט ונעוץ בזיכרון היטב!`,
    hasRepositoryImage: Boolean(fallbackLocalUrl && finalImageUrl === fallbackLocalUrl),
    candidates,
    currentCandidateIndex: 0,
    card: {
      imageUrl: finalImageUrl,
      name: chosenAnchor,
      emoji: chosenEmoji,
      caption: chosenAnchor
    },
    isAiCurated: allCandidateUrls.length > 0,
  };
}

/**
 * Curate and elevate an entire list with autonomous AI verification
 */
export async function curateListWithAi(itemsList = []) {
  if (!Array.isArray(itemsList) || itemsList.length === 0) return [];
  const textItems = itemsList.map(item => (typeof item === 'string' ? item : (item.title || item.name || ''))).filter(Boolean);
  const synergy = await processTaskListWithSynergy(textItems);
  return synergy?.stations || [];
}

const memStorage = new Map();
function safeGetItem(key) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return memStorage.get(key) || null;
  } catch (_) {
    return memStorage.get(key) || null;
  }
}
function safeSetItem(key, val) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, val);
    }
    memStorage.set(key, val);
  } catch (_) {
    memStorage.set(key, val);
  }
}

/**
 * Record Like/Dislike Feedback on an association shown to the client
 */
export function recordMnemonicFeedback({
  itemTitle = '',
  associationWord = '',
  imageUrl = '',
  isLiked = true,
  reason = ''
}) {
  const record = {
    id: `fb_${Date.now()}`,
    itemTitle: String(itemTitle).trim(),
    associationWord: String(associationWord).trim(),
    imageUrl,
    isLiked: Boolean(isLiked),
    reason: String(reason || ''),
    timestamp: new Date().toISOString()
  };

  try {
    const raw = safeGetItem(FEEDBACK_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.unshift(record);
    safeSetItem(FEEDBACK_STORAGE_KEY, JSON.stringify(list.slice(0, 100)));

    // Update aggregated rating map
    const ratingsRaw = safeGetItem(RATINGS_MAP_KEY);
    const ratings = ratingsRaw ? JSON.parse(ratingsRaw) : {};
    const key = `${record.itemTitle}__${record.associationWord}`;
    
    if (!ratings[key]) {
      ratings[key] = { likes: 0, dislikes: 0 };
    }
    if (record.isLiked) {
      ratings[key].likes += 1;
    } else {
      ratings[key].dislikes += 1;
    }
    safeSetItem(RATINGS_MAP_KEY, JSON.stringify(ratings));
  } catch (e) {
    console.warn('Failed to record feedback:', e);
  }

  return record;
}

/**
 * Get current feedback status for an item
 */
export function getMnemonicItemFeedback(itemTitle = '', associationWord = '') {
  try {
    const ratingsRaw = safeGetItem(RATINGS_MAP_KEY);
    if (!ratingsRaw) return null;
    const ratings = JSON.parse(ratingsRaw);
    const key = `${String(itemTitle).trim()}__${String(associationWord).trim()}`;
    return ratings[key] || null;
  } catch (_) {
    return null;
  }
}

/**
 * Autonomous AI Alternative Image Regenerator:
 * Triggered when the client clicks "לא אהבתי 👎 / החלף עוגן".
 * Instead of asking the client to manually pick or upload from a gallery,
 * the AI immediately derives an elevated, ultra-vivid visual concept and fetches a stunning new image.
 */
export async function regenerateAlternativeMnemonicImage(itemTitle = '', currentImageUrl = '', itemObject = null) {
  let clean = String(itemTitle || '').trim();
  clean = clean.replace(/עוגן\s*מומלץ:?/g, '').split(/[—–-]/)[0].trim();
  clean = clean.replace(/\([^)]*\)/g, '').trim();
  if (!clean) return null;

  // 1. מעבר נקי ומדויק בין המועמדים ברשימת האסוציאציות המוכנה (Rotation)
  if (itemObject && Array.isArray(itemObject.candidates) && itemObject.candidates.length > 0) {
    // סינון מוחלט של מועמדים שסומנו בדיסלייק כדי שלא יופיעו שוב לעולם!
    const eligibleCandidates = itemObject.candidates.filter(c => 
      c && (!c.imageUrl || (!isAssociationDisliked(clean, c.imageUrl) && c.imageUrl !== currentImageUrl))
    );

    const poolToUse = eligibleCandidates.length > 0 ? eligibleCandidates : itemObject.candidates;
    let nextIdx = 0;
    if (typeof itemObject.currentCandidateIndex === 'number') {
      nextIdx = (itemObject.currentCandidateIndex + 1) % poolToUse.length;
    } else {
      const currIdx = poolToUse.findIndex(c => c.imageUrl === currentImageUrl);
      nextIdx = currIdx >= 0 ? (currIdx + 1) % poolToUse.length : 0;
    }
    itemObject.currentCandidateIndex = nextIdx;
    const cand = poolToUse[nextIdx] || poolToUse[0];
    let resolvedImg = cand.imageUrl;

    // פתרון עצל (Lazy Resolution) של עוגנים חלופיים:
    if (!resolvedImg || resolvedImg.startsWith('data:image/svg')) {
      // 1. בדיקת מאגר מקומי מדויק לפי שורש
      const anchorClean = (cand.anchorName || '').trim().toLowerCase();
      const poolMatch = STAGED_IMAGES_POOL.find(p => {
        if (p.theme === 'fictional_pop' || p.category?.includes('בדיוניות') || p.category?.includes('1. דמויות')) {
          return false;
        }
        const pName = (p.name_he || p.name || p.suggestedName || '').trim().toLowerCase();
        return pName && (pName === anchorClean || anchorClean === pName);
      });
      if (poolMatch && poolMatch.imageUrl) {
        resolvedImg = poolMatch.imageUrl;
        cand.imageUrl = resolvedImg;
      }

      // 2. פנייה לרשת אך ורק אם קיימת שאילתת צילום מאומתת באנגלית!
      if ((!resolvedImg || resolvedImg.startsWith('data:image/svg')) && cand.englishQuery && !/[\u0590-\u05FF]/.test(cand.englishQuery)) {
        const fetched = await searchPopularWebImages(cand.anchorName, 3, cand.englishQuery);
        if (fetched && fetched[0]) {
          resolvedImg = fetched[0];
          cand.imageUrl = resolvedImg;
        }
      }
    }

    const finalImg = resolvedImg || generateDynamicFallbackCard(cand.anchorName || clean);

    return {
      imageUrl: finalImg,
      associationWord: cand.anchorName || clean,
      story: cand.explanation || `עוגן זיכרון בארמון: ${cand.anchorName || clean}`,
      fromPool: Boolean(finalImg && finalImg.includes('/staged_images/pool/'))
    };
  }

  // 2. שער ברזל: אסור בתוקף לחפש את מילת המשימה הגולמית של המשתמש ברשת!
  // סוכן 2/3 לא יפנה לרשת אם אין עוגן חוקי מסוכן 1 (מונע שליפת מודעות או כרזות סרטים מקריות).
  const finalUrl = generateDynamicFallbackCard(clean);

  return {
    imageUrl: finalUrl,
    associationWord: clean,
    source: 'clean_fallback_card',
    confidenceScore: 70
  };
}

export default {
  curateSingleItemWithAi,
  curateListWithAi,
  fetchCommonsMnemonicImage,
  regenerateAlternativeMnemonicImage,
  recordMnemonicFeedback,
  getMnemonicItemFeedback
};
