import fs from 'node:fs';
import path from 'node:path';

const POOL_DIR = path.resolve('public/staged_images/pool');
const UA = 'LifeQuestMnemonicCurator/2.0 (https://lifequest.local; contact@lifequest.local)';

// Map of item ID -> { file: filename in pool, wiki: exact English Wikipedia article title, commons: fallback Commons search query }
const REPLACEMENTS = [
  { id: 'mickey_mouse', file: 'mickey_mouse.jpg', wiki: 'Mickey Mouse', commons: 'Mickey Mouse statue Walt Disney' },
  { id: 'statue_of_liberty', file: 'statue_of_liberty_ny.jpg', wiki: 'Statue of Liberty', commons: 'Statue of Liberty New York' },
  { id: 'cave_painting_bison', file: 'cave_painting_bison.jpg', wiki: 'Cave of Altamira', commons: 'Altamira bison cave painting' },
  { id: 'star_of_david', file: 'star_of_david.jpg', wiki: 'Flag of Israel', commons: 'Star of David gold' },
  { id: 'item_151_נורה_דולקת__מסמלת', file: 'item_151_נורה_דולקת__מסמלת.jpg', wiki: 'Incandescent light bulb', commons: 'Incandescent light bulb glowing' },
  { id: 'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל', file: 'item_157_שק_כסף_שקשור_בחוט_עם_סימן____מסמל.jpg', wiki: 'Money bag', commons: 'Burlap money bag dollar' },
  { id: 'item_163_מאזני_צדק__שתי_כפות_מאוזנות___מסמלות', file: 'item_163_מאזני_צדק__שתי_כפות_מאוזנות___מסמלות.jpg', wiki: 'Weighing scale', commons: 'Brass balance scale justice' },
  { id: 'item_173_גלולת_תרופה__חצי_אדום_חצי_לבן___מסמלת', file: 'item_173_גלולת_תרופה__חצי_אדום_חצי_לבן___מסמלת.jpg', wiki: 'Capsule (pharmacy)', commons: 'Medical capsules pills red white' },
  { id: 'item_201_לימוזינה_שחורה_ארוכה', file: 'item_201_לימוזינה_שחורה_ארוכה.jpg', wiki: 'Limousine', commons: 'Black stretch limousine' },
  { id: 'item_202_מונית_צהובה_ניו_יורקית', file: 'item_202_מונית_צהובה_ניו_יורקית.jpg', wiki: 'Taxicabs of New York City', commons: 'NYC yellow cab taxi' },
  { id: 'item_204_רכבת_קיטור_ישנה', file: 'item_204_רכבת_קיטור_ישנה.jpg', wiki: 'Steam locomotive', commons: 'Steam locomotive train smoke' },
  { id: 'item_206_ספינת_פיראטים', file: 'item_206_ספינת_פיראטים.jpg', wiki: 'Galleon', commons: 'Pirate ship galleon sails' },
  { id: 'item_209_גונדולה_ונציאנית', file: 'item_209_גונדולה_ונציאנית.jpg', wiki: 'Gondola', commons: 'Venice gondola canal' },
  { id: 'item_212_צוללת_צהובה', file: 'item_212_צוללת_צהובה.jpg', wiki: '', commons: 'Yellow submarine puerto de mogan.jpg' },
  { id: 'item_217_כרכרת_סוסים_מלכותית', file: 'item_217_כרכרת_סוסים_מלכותית.jpg', wiki: 'State Coach', commons: 'Royal horse carriage gold' },
  { id: 'item_219_קטנוע_וספה_איטלקי', file: 'item_219_קטנוע_וספה_איטלקי.jpg', wiki: 'Vespa', commons: 'Classic Vespa scooter Italy' },
  { id: 'item_220_ספינת_טיטאניק', file: 'item_220_ספינת_טיטאניק.jpg', wiki: 'RMS Titanic', commons: 'RMS Titanic departing Southampton' },
  { id: 'item_223_קורקינט_פשוט_לילדים', file: 'item_223_קורקינט_פשוט_לילדים.jpg', wiki: 'Kick scooter', commons: 'Kick scooter aluminum' },
  { id: 'item_225_רכבת_קליע_יפנית', file: 'item_225_רכבת_קליע_יפנית.jpg', wiki: 'Shinkansen', commons: 'Shinkansen bullet train Japan' },
  { id: 'item_226_הליקופטר_צבאי', file: 'item_226_הליקופטר_צבאי.jpg', wiki: 'Boeing AH-64 Apache', commons: 'Apache military helicopter flight' },
  { id: 'item_227_רכב_שטח_מפלצתי', file: 'item_227_רכב_שטח_מפלצתי.jpg', wiki: 'Monster truck', commons: 'Monster truck Bigfoot' },
  { id: 'item_230_רכב_שלג', file: 'item_230_רכב_שלג.jpg', wiki: 'Snowmobile', commons: 'Snowmobile in snow' },
  { id: 'item_231_מפרשית___יאכטה_לבנה', file: 'item_231_מפרשית___יאכטה_לבנה.jpg', wiki: 'Yacht', commons: 'White sailing yacht sea' },
  { id: 'item_232_רכב_גולף_קטן', file: 'item_232_רכב_גולף_קטן.jpg', wiki: 'Golf cart', commons: 'White golf cart course' },
  { id: 'item_248_רכב_קמפינג', file: 'item_248_רכב_קמפינג.jpg', wiki: 'Motorhome', commons: 'Campervan motorhome camping' },
  { id: 'item_249_רכב_גופה', file: 'item_249_רכב_גופה.jpg', wiki: 'Hearse', commons: 'Black funeral hearse car' },
  { id: 'item_250_עגלת_תינוק_קלאסית', file: 'item_250_עגלת_תינוק_קלאסית.jpg', wiki: 'Baby transport', commons: 'Baby pram stroller classic' },
  { id: 'item_251_קקטוס_סאגוארו', file: 'item_251_קקטוס_סאגוארו.jpg', wiki: 'Saguaro', commons: 'Carnegiea gigantea Saguaro cactus' },
  { id: 'item_260_קרחון_בלב_ים', file: 'item_260_קרחון_בלב_ים.jpg', wiki: 'Iceberg', commons: 'Iceberg in Arctic ocean' },
  { id: 'item_262_מכתש_ברק___פגיעת_ברק', file: 'item_262_מכתש_ברק___פגיעת_ברק.jpg', wiki: 'Lightning', commons: 'Lightning strike night sky' },
  { id: 'item_266_סוס_דוהרת_ברוח', file: 'item_266_סוס_דוהרת_ברוח.jpg', wiki: 'Mustang', commons: 'Horse galloping field' },
  { id: 'item_278_פרח_חמנייה', file: 'item_278_פרח_חמנייה.jpg', wiki: 'Common sunflower', commons: 'Sunflower flower yellow close up' },
  { id: 'item_279_ורד_אדום', file: 'item_279_ורד_אדום.jpg', wiki: 'Rose', commons: 'Red rose flower macro' },
  { id: 'item_280_עלה_מייפל', file: 'item_280_עלה_מייפל.jpg', wiki: 'Acer rubrum', commons: 'Red maple leaf autumn' },
  { id: 'item_287_צונאמי', file: 'item_287_צונאמי.jpg', wiki: 'The Great Wave off Kanagawa', commons: 'Huge ocean wave breaking' },
  { id: 'item_288_מדבר_חול', file: 'item_288_מדבר_חול.jpg', wiki: 'Sahara', commons: 'Sahara desert sand dunes' },
  { id: 'item_290_ביצה', file: 'item_290_ביצה.jpg', wiki: 'Swamp', commons: 'Swamp cypress trees water' },
  { id: 'item_292_כוכב_ים', file: 'item_292_כוכב_ים.jpg', wiki: 'Starfish', commons: 'Orange starfish sea star' },
  { id: 'item_293_סרטן', file: 'item_293_סרטן.jpg', wiki: 'Crab', commons: 'Red crab on beach sand' },
  { id: 'item_294_תמנון', file: 'item_294_תמנון.jpg', wiki: 'Common octopus', commons: 'Octopus vulgaris underwater' },
  { id: 'item_295_זיקית_על_ענף', file: 'item_295_זיקית_על_ענף.jpg', wiki: 'Veiled chameleon', commons: 'Chameleon on branch green' },
  { id: 'item_297_עקרב', file: 'item_297_עקרב.jpg', wiki: 'Deathstalker', commons: 'Desert scorpion sand' },
  { id: 'item_300_שפירית', file: 'item_300_שפירית.jpg', wiki: 'Sympetrum flaveolum', commons: 'Dragonfly close up macro' },
  { id: 'item_301_כדורגל_קלאסי', file: 'item_301_כדורגל_קלאסי.jpg', wiki: 'Adidas Telstar', commons: 'Soccer ball on grass pitch' },
  { id: 'item_302_כדורסל', file: 'item_302_כדורסל.jpg', wiki: 'Basketball (ball)', commons: 'Orange basketball ball' },
  { id: 'item_307_כדור_ביליארד', file: 'item_307_כדור_ביליארד.jpg', wiki: 'Eight-ball', commons: '8 ball billiard pool table' },
  { id: 'item_308_מחבט_בייסבול', file: 'item_308_מחבט_בייסבול.jpg', wiki: 'Baseball bat', commons: 'Wooden baseball bat ball' },
  { id: 'item_310_זוג_כפפות_אגרוף', file: 'item_310_זוג_כפפות_אגרוף.jpg', wiki: 'Boxing glove', commons: 'Red boxing gloves pair' },
  { id: 'item_311_הטבעות_האולימפיות__חמש_טבעות_צבעוניות_שלובות', file: 'item_311_הטבעות_האולימפיות__חמש_טבעות_צבעוניות_שלובות.jpg', wiki: 'Olympic symbols', commons: 'Olympic rings stadium' },
  { id: 'item_315_משקולת_ברזל_קלאסית', file: 'item_315_משקולת_ברזל_קלאסית.jpg', wiki: 'Dumbbell', commons: 'Gym dumbbells iron' },
  { id: 'item_316_חץ_ולוח_מטרה', file: 'item_316_חץ_ולוח_מטרה.jpg', wiki: 'Target archery', commons: 'Archery target arrows bullseye' },
  { id: 'item_317_משרוקית_שופט', file: 'item_317_משרוקית_שופט.jpg', wiki: 'Whistle', commons: 'Metal referee pea whistle' },
  { id: 'item_318_כרטיס_אדום_וצהוב', file: 'item_318_כרטיס_אדום_וצהוב.jpg', wiki: 'Penalty card', commons: 'Referee red card yellow card' },
  { id: 'item_320_נעלי_פקקים', file: 'item_320_נעלי_פקקים.jpg', wiki: 'Football boot', commons: 'Soccer cleats boots grass' },
  { id: 'item_322_רולטה_קזינו', file: 'item_322_רולטה_קזינו.jpg', wiki: 'Roulette', commons: 'Casino roulette wheel closeup' },
  { id: 'item_324_ז_יטונים_של_קזינו', file: 'item_324_ז_יטונים_של_קזינו.jpg', wiki: 'Casino token', commons: 'Poker chips casino stack' },
  { id: 'item_325_קובייה_הונגרית', file: 'item_325_קובייה_הונגרית.jpg', wiki: "Rubik's Cube", commons: 'Rubiks cube scrambled' },
  { id: 'item_326_חייל_שחמט', file: 'item_326_חייל_שחמט.jpg', wiki: 'Pawn (chess)', commons: 'Wooden chess pawn board' },
  { id: 'item_328_חתיכת_פאזל_קלאסית', file: 'item_328_חתיכת_פאזל_קלאסית.jpg', wiki: 'Jigsaw puzzle', commons: 'Jigsaw puzzle pieces' },
  { id: 'item_329_יו_יו', file: 'item_329_יו_יו.jpg', wiki: 'Yo-yo', commons: 'Wooden yoyo string toy' },
  { id: 'item_331_משקפת_שחייה_ומצוף_זרוע', file: 'item_331_משקפת_שחייה_ומצוף_זרוע.jpg', wiki: 'Goggles', commons: 'Swimming goggles pool' },
  { id: 'item_333_רשת_כדורגל_נטויה', file: 'item_333_רשת_כדורגל_נטויה.jpg', wiki: '', commons: 'Football goal net stadium grass' },
  { id: 'item_334_פודטראק', file: 'item_334_פודטראק.jpg', wiki: 'Food truck', commons: 'Street food truck van' },
  { id: 'item_338_מדורה_עם_שיפודי_מרשמלו', file: 'item_338_מדורה_עם_שיפודי_מרשמלו.jpg', wiki: 'Campfire', commons: 'Campfire flames night wood' },
  { id: 'item_339_מצנח_רחיפה', file: 'item_339_מצנח_רחיפה.jpg', wiki: 'Paragliding', commons: 'Paraglider flying sky close' },
  { id: 'item_344_דוכן_פופקורן_קולנוע', file: 'item_344_דוכן_פופקורן_קולנוע.jpg', wiki: 'Popcorn', commons: 'Popcorn bucket cinema' },
  { id: 'item_348_משחק_טטריס', file: 'item_348_משחק_טטריס.jpg', wiki: 'Tetromino', commons: 'Tetris blocks arcade game' },
  { id: 'item_349_מגלשת_מים_ענקית', file: 'item_349_מגלשת_מים_ענקית.jpg', wiki: 'Water slide', commons: 'Water park slide colorful' },
  { id: 'item_350_מצנח_פתוח_בשמיים', file: 'item_350_מצנח_פתוח_בשמיים.jpg', wiki: 'Parachuting', commons: 'Parachute skydiver canopy sky' },
  { id: 'item_351_פטיש_מסמרים_קלאסי', file: 'item_351_פטיש_מסמרים_קלאסי.jpg', wiki: 'Claw hammer', commons: 'Claw hammer wood handle' },
  { id: 'item_355_מטרייה_שחורה_פתוחה', file: 'item_355_מטרייה_שחורה_פתוחה.jpg', wiki: 'Umbrella', commons: 'Black umbrella open rain' },
  { id: 'item_356_מפתח_שוודי', file: 'item_356_מפתח_שוודי.jpg', wiki: 'Adjustable spanner', commons: 'Adjustable wrench steel' },
  { id: 'item_358_מטאטא_ומגרוד', file: 'item_358_מטאטא_ומגרוד.jpg', wiki: 'Broom', commons: 'Broom and dustpan cleaning' },
  { id: 'item_359_סולם_מתקפל', file: 'item_359_סולם_מתקפל.jpg', wiki: 'Ladder', commons: 'Aluminum stepladder folding' },
  { id: 'item_362_פחית_שימורים_חצי_פתוחה', file: 'item_362_פחית_שימורים_חצי_פתוחה.jpg', wiki: 'Tin can', commons: 'Open tin can metal' },
  { id: 'item_363_בקבוק_ייין_ופותחן_חולץ_פקקים', file: 'item_363_בקבוק_ייין_ופותחן_חולץ_פקקים.jpg', wiki: 'Corkscrew', commons: 'Wine bottle corkscrew opener' },
  { id: 'item_364_נר_דולק_נוטף_שעווה', file: 'item_364_נר_דולק_נוטף_שעווה.jpg', wiki: 'Candle', commons: 'Lit wax candle flame dark' },
  { id: 'item_365_פנס_כיס_דולק', file: 'item_365_פנס_כיס_דולק.jpg', wiki: 'Flashlight', commons: 'LED flashlight beam glowing' },
  { id: 'item_368_מברשת_שיניים_ומשחה', file: 'item_368_מברשת_שיניים_ומשחה.jpg', wiki: 'Toothbrush', commons: 'Toothbrush with toothpaste' },
  { id: 'item_372_מראת_יד_עגולה', file: 'item_372_מראת_יד_עגולה.jpg', wiki: '', commons: 'Antique hand mirror ornate' },
  { id: 'item_375_קולב_בגדים', file: 'item_375_קולב_בגדים.jpg', wiki: 'Clothes hanger', commons: 'Wooden coat hanger' },
  { id: 'item_376_מגהץ_אדים', file: 'item_376_מגהץ_אדים.jpg', wiki: 'Clothes iron', commons: 'Electric steam iron clothes' },
  { id: 'item_378_מחט_וחוט', file: 'item_378_מחט_וחוט.jpg', wiki: 'Sewing needle', commons: 'Sewing needle and red thread spool' },
  { id: 'item_381_סרט_מדידה_צהוב', file: 'item_381_סרט_מדידה_צהוב.jpg', wiki: 'Tape measure', commons: 'Yellow tape measure carpenter' },
  { id: 'item_382_פנקס_רשימות_ספירלה', file: 'item_382_פנקס_רשימות_ספירלה.jpg', wiki: 'Notebook', commons: 'Spiral notebook and pen' },
  { id: 'item_383_עט_כדורי_פשוט', file: 'item_383_עט_כדורי_פשוט.jpg', wiki: 'Ballpoint pen', commons: 'Blue ballpoint pen writing' },
  { id: 'item_385_מחדד_מתכת_קטן', file: 'item_385_מחדד_מתכת_קטן.jpg', wiki: 'Pencil sharpener', commons: 'Metal pencil sharpener shavings' },
  { id: 'item_389_סל_כביסה_פלסטיק', file: 'item_389_סל_כביסה_פלסטיק.jpg', wiki: '', commons: 'Plastic laundry basket clothes' },
  { id: 'item_391_מזלג_גינה', file: 'item_391_מזלג_גינה.jpg', wiki: 'Garden fork', commons: 'Garden digging fork soil' },
  { id: 'item_393_מריצה', file: 'item_393_מריצה.jpg', wiki: 'Wheelbarrow', commons: 'Garden wheelbarrow metal' },
  { id: 'item_394_עציץ_חרס_חום', file: 'item_394_עציץ_חרס_חום.jpg', wiki: 'Flowerpot', commons: 'Terracotta clay flowerpot plant' },
  { id: 'item_396_ארגז_כלים_אדום', file: 'item_396_ארגז_כלים_אדום.jpg', wiki: 'Toolbox', commons: 'Red metal toolbox tools' },
  { id: 'item_405_שרק', file: 'item_405_שרק.jpg', wiki: 'Shrek (character)', commons: 'Shrek statue Universal Studios' },
  { id: 'item_408_הלוגו_של_נייק__swoosh_', file: 'item_408_הלוגו_של_נייק__swoosh_.jpg', wiki: '', commons: 'Nike shoe swoosh logo close' },
  { id: 'item_409_הפחיות_של_קוקה_קולה', file: 'item_409_הפחיות_של_קוקה_קולה.jpg', wiki: 'Drink can', commons: 'Red Coca-Cola can aluminum' },
  { id: 'item_411_הארי_פוטר', file: 'item_411_הארי_פוטר.jpg', wiki: 'Daniel Radcliffe', commons: 'Harry Potter platform 9 3/4 trolley' },
  { id: 'item_412_שרלוק_הולמס', file: 'item_412_שרלוק_הולמס.jpg', wiki: 'Sherlock Holmes', commons: 'Sherlock Holmes Paget illustration' },
  { id: 'item_414_לגו', file: 'item_414_לגו.jpg', wiki: 'Lego', commons: 'Colorful Lego bricks pile' },
  { id: 'item_415_הסימפסונים', file: 'item_415_הסימפסונים.jpg', wiki: '', commons: 'The Simpsons Krustyland ride Universal' },
  { id: 'item_422_כרטיס_אדום', file: 'item_422_כרטיס_אדום.jpg', wiki: '', commons: 'Referee holding red card football' },
  { id: 'item_423_משקולת_ברזל__dumbbell_', file: 'item_423_משקולת_ברזל__dumbbell_.jpg', wiki: '', commons: 'Black hex dumbbells pair gym' },
  { id: 'item_425_קופת_חיסכון_בצורת_חזיר', file: 'item_425_קופת_חיסכון_בצורת_חזיר.jpg', wiki: 'Piggy bank', commons: 'Pink piggy bank coin' },
  { id: 'item_428_קביים', file: 'item_428_קביים.jpg', wiki: 'Crutch', commons: 'Wooden crutches medical pair' },
  { id: 'item_442_פסל_דוד__מיכלאנג_לו_', file: 'item_442_פסל_דוד__מיכלאנג_לו_.jpg', wiki: 'David (Michelangelo)', commons: 'Michelangelos David statue Florence' },
  { id: 'item_443_הקוליסאום', file: 'item_443_הקוליסאום.jpg', wiki: 'Colosseum', commons: 'Colosseum Rome exterior' },
  { id: 'item_445_הבית_הלבן', file: 'item_445_הבית_הלבן.jpg', wiki: 'White House', commons: 'White House Washington DC north' },
  { id: 'item_447_פסל_ישו_הגואל_בריו', file: 'item_447_פסל_ישו_הגואל_בריו.jpg', wiki: 'Christ the Redeemer (statue)', commons: 'Christ the Redeemer Rio de Janeiro' },
  { id: 'item_453_ברק_בשמיים', file: 'item_453_ברק_בשמיים.jpg', wiki: '', commons: 'Lightning bolt storm night sky' },
  { id: 'item_459_יונה_לבנה_עם_עלה_זית', file: 'item_459_יונה_לבנה_עם_עלה_זית.jpg', wiki: 'Release dove', commons: 'White dove flying sky' },
  { id: 'item_460_ינשוף', file: 'item_460_ינשוף.jpg', wiki: 'Eurasian eagle-owl', commons: 'Owl bird eyes close up' },
  { id: 'item_465_קרחון__iceberg_', file: 'item_465_קרחון__iceberg_.jpg', wiki: '', commons: 'Iceberg Greenland blue water' },
  { id: 'item_470_מדליית_זהב', file: 'item_470_מדליית_זהב.jpg', wiki: 'Olympic medal', commons: 'Gold medal ribbon winner' },
  { id: 'item_476_שחמט__כלי_המלך_או_הרץ_', file: 'item_476_שחמט__כלי_המלך_או_הרץ_.jpg', wiki: 'King (chess)', commons: 'King chess piece wooden' },
  { id: 'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_', file: 'item_479_מטה_הרפואה__נחש_כרוך_סביב_מוט_.jpg', wiki: 'Rod of Asclepius', commons: 'Rod of Asclepius statue' },
  { id: 'item_480_פרש_הברונזה___אביר_על_סוס_לבן', file: 'item_480_פרש_הברונזה___אביר_על_סוס_לבן.jpg', wiki: 'Knight', commons: 'Medieval knight armor horse tournament' },
  { id: 'item_481_הצלב_הנוצרי', file: 'item_481_הצלב_הנוצרי.jpg', wiki: 'Christian cross', commons: 'Wooden Christian cross church' },
  { id: 'item_484_בודהה_מחייך', file: 'item_484_בודהה_מחייך.jpg', wiki: 'Budai', commons: 'Laughing Buddha golden statue' },
  { id: 'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_', file: 'item_486_מודל_האטום__גרעין_ומסלולי_אלקטרונים_אליפטיים_.jpg', wiki: 'Atomic orbital', commons: 'Atom model orbits nucleus' },
  { id: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_', file: 'item_488_סמל_הקרינה_הרדיואקטיבית__שלוש_מניפות_שחורות_על_רקע_צהוב_.jpg', wiki: '', commons: 'Radioactive warning sign yellow black' },
  { id: 'item_490_טביעת_אצבע_שחורה', file: 'item_490_טביעת_אצבע_שחורה.jpg', wiki: 'Fingerprint', commons: 'Fingerprint whorl ridges black' },
  { id: 'item_492_צלחת_לוויין', file: 'item_492_צלחת_לוויין.jpg', wiki: 'Satellite dish', commons: 'Parabolic satellite dish antenna' },
  { id: 'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_', file: 'item_498_סמל_ה_wi_fi__קשתות_מתרחבות_.jpg', wiki: '', commons: 'WiFi sign public hotspot' },
  { id: 'alexander_graham_bell', file: 'alexander_graham_bell.jpg', wiki: 'Alexander Graham Bell', commons: 'Alexander Graham Bell portrait' },
  // Also fix the 3 flagged files on disk shown in Screenshot 1
  { id: 'barbie_doll', file: 'authentic_barbie_doll.jpg', wiki: '', commons: 'Barbie doll pink dress Mattel' },
  { id: 'sonic_the_hedgehog', file: 'authentic_sonic_the_hedgehog.jpg', wiki: '', commons: 'Sonic the Hedgehog figure statue' },
  { id: 'super_mario', file: 'authentic_super_mario.jpg', wiki: '', commons: 'Super Mario statue figure Nintendo' }
];

async function getWikiPageImage(title) {
  if (!title) return null;
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&pithumbsize=900&redirects=1&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    const src = pages[0]?.thumbnail?.source;
    if (src && !src.includes('.svg') && !src.includes('.pdf')) {
      return src;
    }
  } catch (_) {}
  return null;
}

async function getCommonsImage(query) {
  if (!query) return null;
  try {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=6&prop=imageinfo&iiprop=url&iiurlwidth=900&format=json`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Object.values(data.query?.pages || {});
    for (const p of pages) {
      const t = (p.title || '').toLowerCase();
      if ((t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png')) && !t.includes('.pdf') && !t.includes('.djvu') && !t.includes('logo')) {
        const info = p.imageinfo?.[0];
        const src = info?.thumburl || info?.url;
        if (src) return src;
      }
    }
  } catch (_) {}
  return null;
}

async function run() {
  let ok = 0;
  let failed = [];

  for (let i = 0; i < REPLACEMENTS.length; i++) {
    const item = REPLACEMENTS[i];
    let imgUrl = await getWikiPageImage(item.wiki);
    if (!imgUrl) {
      imgUrl = await getCommonsImage(item.commons || item.wiki);
    }

    if (imgUrl) {
      try {
        const res = await fetch(imgUrl, { headers: { 'User-Agent': UA } });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length > 4000) {
            fs.writeFileSync(path.join(POOL_DIR, item.file), buf);
            ok++;
            console.log(`[${i + 1}/${REPLACEMENTS.length}] ✅ ${item.id} -> ${buf.length}B`);
          } else {
            failed.push(item.id);
          }
        } else {
          failed.push(item.id);
        }
      } catch (e) {
        failed.push(item.id);
      }
    } else {
      console.log(`[${i + 1}/${REPLACEMENTS.length}] ❌ No URL for ${item.id}`);
      failed.push(item.id);
    }

    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\nDone! Downloaded: ${ok}/${REPLACEMENTS.length}. Failed: ${failed.length}`, failed);
}

run();

