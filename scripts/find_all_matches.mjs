import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const currentArsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// Build manual dictionary mapping userNum -> arsenal ID based on semantic identity
const manualNumToArsenalId = {
  // Landmarks & Buildings
  67: 'empire_state_building_ny', // האמפייר סטייט בילדינג
  71: 'acropolis_parthenon_athens', // הפרתנון / האקרופוליס
  72: 'burj_khalifa_dubai', // בורג' ח'ליפה
  77: 'neuschwanstein_castle_bavaria', // טירת דיסני / נוישוונשטיין
  78: 'burj_al_arab_hotel', // מגדל דובאי (בורג' אל-ערב)
  80: 'western_wall_jerusalem', // הכותל המערבי
  81: 'sagrada_familia_barcelona', // כנסיית סגרדה פמיליה
  82: 'tower_bridge_london', // גשר מצודת לונדון
  84: 'mount_rushmore_monument', // הר רושמור
  98: 'versailles_palace_gardens', // ארמון ורסאי

  // Art & Antiquities
  107: 'the_last_supper_mural', // הסעודה האחרונה
  108: 'birth_of_venus_painting', // הולדת ונוס
  109: 'persistence_of_memory_dali', // התמדה של זיכרון
  110: 'tutankhamun_golden_mask', // מסכת הזהב של תות ענח' אמון
  111: 'venus_de_milo_statue', // ונוס ממילו
  114: 'girl_with_pearl_earring', // הנערה עם עגיל פנינה
  116: 'vitruvian_man_leonardo', // האדם הוויטרובי
  117: 'campbell_soup_can_popart', // מרק קמפבל
  118: 'the_kiss_klimt_painting', // הנשיקה (קלימט)
  121: 'sunflowers_van_gogh_vase', // החמניות
  122: 'balloon_girl_banksy_graffiti', // בלון ילדה (בנקסי)
  123: 'terracotta_army_warriors', // הלוחמים מטרקוטה
  124: 'rosetta_stone_british_museum', // אבן רוזטה
  128: 'sarcophagus_egyptian_pharaoh', // סרקופג
  135: 'great_wave_off_kanagawa_art', // הגל הגדול בסמוך לקאנאגאווה
  141: 'matryoshka_doll_russian', // בבושקה / מטריושקה
  145: 'chess_knight_wooden_piece', // חייל שחמט (פרש)
  146: 'seven_branched_menorah_gold', // מנורת שבעת הקנים
  147: 'egyptian_mummy_sarcophagus', // תחבושת חניטה (מומיה)
  148: 'hamsa_hand_amulet_protection', // קמע חמסה
  149: 'star_of_david_symbol_blue', // מגן דוד
  150: 'holy_cross_wooden_crucifix', // צלב קלאסי

  // Concepts & Clichés
  151: 'incandescent_light_bulb_glowing', // נורה דולקת
  152: 'treasure_chest_gold_coins', // תיבת אוצר
  154: 'floppy_disk_vintage_tech', // דיסקט 3.5 אינץ'
  155: 'magnifying_glass_detective', // זכוכית מגדלת
  156: 'adjustable_wrench_spanner_tool', // מפתח מכני גדול / שוודי
  163: 'scales_of_justice_brass', // מאזני צדק
  166: 'vintage_hourglass_sand_timer', // שעון חול
  169: 'golden_trophy_cup_champion', // גביע זהב
  170: 'ship_anchor_heavy_iron', // עוגן ברזל
  178: 'skull_and_crossbones_pirate', // גולגולת עם שתי עצמות מוצלבות
  180: 'royal_gold_crown_jewels', // כתר זהב
  182: 'lucky_horseshoe_iron_farm', // פרסה של סוס
  194: 'crystal_ball_fortune_teller', // כדור בדולח
  197: 'magician_top_hat_rabbit', // כובע קוסמים

  // Vehicles
  203: 'london_double_decker_bus_red', // אוטובוס קומותיים
  204: 'steam_train_locomotive_smoke', // רכבת קיטור
  205: 'harley_davidson_chopper_bike', // אופנוע הארלי דיווידסון
  206: 'black_pearl_pirate_ship', // ספינת פיראטים
  207: 'nasa_space_shuttle_launch', // מעבורת חלל
  208: 'boeing_747_jumbo_jet', // מטוס ג'מבו (בואינג 747)
  209: 'venetian_gondola_canal_boat', // גונדולה ונציאנית
  210: 'hindenburg_zeppelin_airship', // צפלין
  211: 'hot_air_balloon_colorful_sky', // כדור פורח
  212: 'yellow_submarine_beatles_ocean', // צוללת צהובה
  214: 'police_car_emergency_flashing', // ניידת משטרה
  215: 'fire_truck_engine_red_ladder', // כבאית אדומה
  216: 'ambulance_emergency_vehicle', // אמבולנס לבן
  219: 'vespa_scooter_classic', // קטנוע וספה איטלקי
  220: 'titanic_ocean_liner_ship', // ספינת טיטאניק
  224: 'formula_one_race_car_speed', // מכונית מרוץ פורמולה 1
  235: 'merkava_tank_heavy_armor', // טנק מרכבה
  242: 'volkswagen_beetle_classic_car', // מכונית חיפושית (פולקסווגן)

  // Nature & Animals
  253: 'great_white_shark_ocean', // כריש לבן
  254: 'giant_panda_bamboo_bear', // דוב פנדה
  255: 'african_lion_savanna_king', // אריה
  256: 'african_elephant_tusks_wild', // פיל אפריקאי
  259: 'volcano_eruption_lava_flow', // הר געש מתפרץ
  260: 'iceberg_ocean_titanic_frozen', // קרחון בלב ים
  261: 'saturn_rings_planet_space', // טבעת שבתאי
  263: 'emperor_penguin_antarctica_ice', // פינגווין קיסרי
  267: 'dalmatian_dog_spots_fire', // כלב דלמטי
  269: 'bald_eagle_flight', // נשר / עיטם דואה
  271: 'camel_caravan_desert_sand', // גמל
  272: 'dolphin_jumping_ocean_waves', // דולפין קופץ
  278: 'sunflower_golden_petals_field', // פרח חמנייה
  279: 'red_rose_romantic_flower', // ורד אדום
  283: 'niagara_falls_waterfall_mist', // מפלי ניאגרה
  284: 'grand_canyon_arizona_river', // הגרנד קניון
  285: 'mount_fuji_snow_cap_japan', // הר פוג'י
  291: 'rainbow_sky_colorful_arc', // קשת בענן
  296: 'king_cobra_snake_hood_strike', // נחש קוברה

  // Sports & Games
  301: 'soccer_ball_classic_leather', // כדורגל קלאסי
  302: 'basketball_spalding_orange', // כדורסל
  303: 'tennis_ball_wilson_yellow', // כדור טניס
  307: 'magic_8_ball_classic_toy', // כדור ביליארד 8 / 8 ball
  310: 'boxing_gloves_red_leather', // כפפות אגרוף
  311: 'olympic_rings_symbol_colors', // הטבעות האולימפיות
  315: 'dumbbell_weights_iron_gym', // משקולת ברזל קלאסית
  316: 'dartboard_bullseye_target_dart', // חץ ולוח מטרה (דארטס)
  325: 'rubik_cube_classic_puzzle', // קובייה הונגרית
  326: 'chess_king_royal_piece', // חייל שחמט (מלך)
  347: 'game_controller_playstation', // ג'ויסטיק

  // Tools & Daily Objects
  351: 'claw_hammer_steel_wood_handle', // פטיש מסמרים
  353: 'scissors_office_sharp_blades', // מספריים
  355: 'black_umbrella_open_rain', // מטרייה שחורה
  364: 'burning_candle_wax_flame', // נר דולק נוטף שעווה
  367: 'zippo_lighter_classic_silver', // מצית זיפו
  374: 'alarm_clock_twin_bell_vintage', // שעון מעורר קלאסי
  375: 'wooden_coat_hanger_closet', // קולב בגדים
  384: 'wooden_pencil_eraser_yellow', // עיפרון צהוב עם מחק

  // Section 9: Supplemental 401-500
  401: 'darth_vader_dark_lord_sith', // דארת' ויידר
  404: 'pac_man_retro_arcade_icon', // פאקמן
  405: 'shrek_swamp_ogre_dreamworks', // שרק
  408: 'nike_swoosh_logo_sport', // לוגו נייק
  409: 'coca_cola_glass_bottle_soda', // פחיות/בקבוק קוקה-קולה
  411: 'harry_potter_round_glasses_scar', // הארי פוטר
  412: 'sherlock_holmes_deerstalker_pipe', // שרלוק הולמס
  414: 'lego_brick_red_classic', // לגו
  416: 'gavel_judge_wooden_court', // פטיש שופטים
  419: 'adjustable_wrench_spanner_tool', // מפתח שוודי
  420: 'stethoscope_medical_doctor', // סטטוסקופ
  421: 'shopping_cart_supermarket_metal', // עגלת קניות
  424: 'vintage_hourglass_sand_timer', // שעון חול
  425: 'piggy_bank_pink_ceramic_coin', // קופת חיסכון חזיר
  427: 'rotary_phone_vintage_dial_red', // טלפון חוגה ישן
  431: 'magnifying_glass_detective', // זכוכית מגדלת
  433: 'royal_gold_crown_jewels', // כתר זהב
  438: 'rubik_cube_classic_puzzle', // קוביית משחק
  439: 'big_ben_clock_tower_london', // ביג בן
  440: 'taj_mahal_agra_india', // טאג' מהאל
  441: 'thinker_statue_auguste_rodin', // פסל החושב
  442: 'statue_of_david_florence_marble', // פסל דוד
  443: 'colosseum_rome_flavian_arena', // הקוליסאום
  444: 'great_wall_of_china_jinshanling', // החומה הסינית
  445: 'white_house_washington_dc', // הבית הלבן
  446: 'leaning_tower_of_pisa_italy', // מגדל פיזה
  447: 'christ_the_redeemer_rio', // ישו הגואל
  448: 'golden_gate_bridge_san_francisco', // גשר שער הזהב
  450: 'yin_yang_daoist_balance_symbol', // יין ויאנג
  451: 'hammer_and_sickle_soviet', // פטיש ומגל
  455: 'volcano_eruption_lava_flow', // הר געש
  458: 'african_lion_savanna_king', // אריה
  460: 'owl_wise_eyes_tree_night', // ינשוף
  461: 'bald_eagle_flight', // נשר
  468: 'michael_jordan_jumpman_slam_dunk', // מייקל ג'ורדן
  469: 'golden_trophy_cup_champion', // גביע זהב
  471: 'dartboard_bullseye_target_dart', // לוח מטרה
  472: 'formula_one_race_car_speed', // מכונית פורמולה 1
  473: 'tennis_ball_wilson_yellow', // כדור טניס
  476: 'chess_king_royal_piece', // שחמט מלך
  481: 'holy_cross_wooden_crucifix', // הצלב הנוצרי
  483: 'star_of_david_symbol_blue', // מגן דוד
  484: 'buddha_statue_golden_meditation', // בודהה
  485: 'grim_reaper_death_scythe', // מלאך המוות
  486: 'atom_model_science_physics', // מודל האטום
  493: 'skull_and_crossbones_pirate', // גולגולת ועצמות
  494: 'stop_sign_red_octagonal', // תמרור עצור
  496: 'recycling_symbol_three_arrows' // סמל המיחזור
};

// Also check existing matches from earlier run
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

const arsenalById = new Map();
currentArsenal.forEach(a => arsenalById.set(a.id, a));

const matchedArsenalIds = new Set();
const finalAlreadyInRepo = [];
const finalRemainingFor500 = [];

for (const u of user500) {
  let matchedArsenalItem = null;

  // 1. Direct manual ID mapping
  if (manualNumToArsenalId[u.num]) {
    const targetId = manualNumToArsenalId[u.num];
    if (arsenalById.has(targetId)) {
      matchedArsenalItem = arsenalById.get(targetId);
    }
  }

  // 2. Pairwise keyword heuristic if not matched yet
  if (!matchedArsenalItem) {
    const uFull = (u.fullText || '').toLowerCase();
    const uName = (u.name || '').toLowerCase();

    for (const a of currentArsenal) {
      if (matchedArsenalIds.has(a.id)) continue;
      const aName = (a.name_he || '').toLowerCase();
      const aId = (a.id || '').toLowerCase();

      if (uName === aName || uName === aId) {
        matchedArsenalItem = a;
        break;
      }

      for (const [hPattern, idPattern] of pairs) {
        if ((uFull.includes(hPattern) || uName.includes(hPattern)) && (aId.includes(idPattern) || aName.includes(hPattern))) {
          matchedArsenalItem = a;
          break;
        }
      }
      if (matchedArsenalItem) break;
    }
  }

  if (matchedArsenalItem) {
    matchedArsenalIds.add(matchedArsenalItem.id);
    finalAlreadyInRepo.push({
      num: u.num,
      name: u.name,
      category: u.category,
      subCategory: u.subCategory || u.category,
      arsenalId: matchedArsenalItem.id,
      arsenalName: matchedArsenalItem.name_he,
      imageUrl: matchedArsenalItem.imageUrl,
      associations: matchedArsenalItem.everyday_associations
    });
  } else {
    finalRemainingFor500.push(u);
  }
}

console.log(`=============================================`);
console.log(`TOTAL USER 500 LIST ITEMS: ${user500.length}`);
console.log(`ITEMS ALREADY IN REPO (SUBTRACTED): ${finalAlreadyInRepo.length}`);
console.log(`ITEMS REMAINING TO ACQUIRE/GENERATE: ${finalRemainingFor500.length}`);
console.log(`TOTAL CURRENT ARSENAL ITEMS: ${currentArsenal.length}`);
console.log(`ARSENAL ITEMS MATCHED AND KEPT: ${matchedArsenalIds.size}`);

const arsenalToPurge = currentArsenal.filter(a => !matchedArsenalIds.has(a.id));
console.log(`ARSENAL ITEMS TO PURGE (NOT IN 500): ${arsenalToPurge.length}`);
console.log(`=============================================`);

fs.writeFileSync('scripts/500_already_in_repository.json', JSON.stringify(finalAlreadyInRepo, null, 2), 'utf8');
fs.writeFileSync('scripts/500_remaining_to_acquire.json', JSON.stringify(finalRemainingFor500, null, 2), 'utf8');
fs.writeFileSync('scripts/arsenal_unwanted_to_purge.json', JSON.stringify(arsenalToPurge.map(a => ({ id: a.id, name_he: a.name_he, category: a.category })), null, 2), 'utf8');
