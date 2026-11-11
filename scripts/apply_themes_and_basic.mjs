import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// The Undisputed Cultural Superstars for "בסיסי" (Basic)
const basicIds = new Set([
  // Gaming
  'pikachu_electric_mouse',
  'super_mario_wonder',
  'luigi_mansion',
  'princess_peach_cake',
  'bowser_king_koopa',
  'yoshi_dinosaur',
  'donkey_kong_bananas',
  'link_legend_of_zelda',
  'sonic_the_hedgehog',
  'kratos_god_of_war',
  'master_chief_halo',
  'lara_croft_tomb_raider',
  'crash_bandicoot_wumpa',
  'goku_super_saiyan',
  'vegeta_saiyan_prince',
  'naruto_uzumaki_hokage',

  // Cinema & Television Superstars
  'james_bond_007',
  'indiana_jones_hero',
  'darth_vader_mask',
  'luke_skywalker',
  'yoda_master_starwars',
  'chewbacca_wookiee',
  'r2_d2_droid',
  'c_3po_gold_droid',
  'baby_yoda_grogu',
  'harry_potter_hero',
  'gandalf_the_grey',
  'legolas_elf',
  'jack_sparrow_captain',
  'rocky_balboa',
  'arnold_terminator',
  'forrest_gump_bench',
  'the_mask_stanley',
  'mr_bean_teddy',
  'charlie_chaplin_tramp',
  'edward_scissorhands_hands',
  'hannibal_lecter_mask',
  'freddy_krueger_glove',
  'john_wick_keanu',
  'daenerys_targaryen_dragons',
  'jon_snow_longclaw',
  'simba_lion_king',

  // Superheroes & Villains
  'iron_man_tony',
  'captain_america_steve',
  'thor_god_of_thunder',
  'hulk_bruce_banner',
  'wolverine_logan',
  'deadpool_wade_wilson',
  'wonder_woman_diana',
  'aquaman_arthur_curry',
  'flash_barry_allen',
  'thanos_mad_titan',
  'venom_symbiote',
  'groot_guardian',

  // Sports Legends
  'lionel_messi_world_cup',
  'cristiano_ronaldo_siu',
  'pele_king_football',
  'diego_maradona_hand',
  'michael_jordan_slam_dunk',
  'kobe_bryant_mamba',
  'lebron_james_chalk',
  'stephen_curry_night_night',
  'shaquille_o_neal_dunk',
  'muhammad_ali_knockout',
  'mike_tyson_iron',
  'usain_bolt_lightning_pose',
  'michael_phelps_medals',
  'roger_federer_wimbledon',
  'rafael_nadal_clay',
  'bruce_lee_dragon',

  // Supercars, Iconic Brands & Relics
  'ferrari_testarossa_red',
  'lamborghini_countach_white',
  'aston_martin_db5_silver',
  'ford_mustang_1967_fastback',
  'volkswagen_beetle_yellow',
  'game_boy_nintendo_retro',
  'walkman_sony_cassette',
  'polaroid_onestep_camera',
  'rubiks_cube_solved',
  'swiss_army_knife_victorinox',
  'lego_yellow_minifigure',
  'barbie_doll_classic',
  'flying_carpet_aladdin',
  'aladdin_magic_lamp_gold',
  'margherita_pizza_woodfire',

  // Science & Technology Titans
  'albert_einstein_icon',
  'isaac_newton',
  'marie_curie',
  'nikola_tesla',
  'leonardo_da_vinci',
  'stephen_hawking',
  'charles_darwin',
  'galileo_galilei',
  'steve_jobs',
  'bill_gates_tech',
  'elon_musk_tech',
  'neil_armstrong',

  // World Wonders, Myth & History
  'eiffel_tower_paris',
  'statue_of_liberty_ny',
  'pyramids_of_giza_egypt',
  'colosseum_rome_italy',
  'taj_mahal_agra',
  'zeus_thunderbolt_king',
  'poseidon_ocean_trident',
  'thor_norse_hammer',
  'medusa_gorgon_snakes',
  'julius_caesar',
  'alexander_the_great',
  'cleopatra_vii',
  'napoleon_bonaparte',
  'winston_churchill_pm',
  'abraham_lincoln',
  'king_david',
  'king_solomon',
  'tutankhamun',

  // Apex Wildlife
  'african_lion_roar',
  'bengal_tiger_stalk',
  'polar_bear_snow_run',
  'great_white_shark_jaws',
  'killer_whale_spyhop',
  'giant_panda_sitting'
]);

function getTheme(item) {
  const cat = item.category || '';
  if (cat === 'gaming_animation') return { theme: 'gaming', theme_he: 'גיימינג ואנימה' };
  if (cat === 'superheroes_villains' || cat === 'cinema_tv') return { theme: 'cinema', theme_he: 'קולנוע וגיבורי על' };
  if (cat === 'sports_athletes') return { theme: 'sports', theme_he: 'ספורט ואלופים' };
  if (cat === 'cultural_objects' || cat === 'iconic_objects') return { theme: 'supercars_brands', theme_he: 'רכבי על ומותגים' };
  if (cat === 'science_thinkers') return { theme: 'science', theme_he: 'מדע וחלל' };
  if (cat === 'history_leaders' || cat === 'mythology_folklore' || cat === 'landmarks_wonders' || cat === 'arts_creators' || cat === 'history_figures') return { theme: 'history_myth', theme_he: 'היסטוריה ומיתולוגיה' };
  if (cat === 'nature_beasts' || cat === 'nature_wildlife') return { theme: 'nature', theme_he: 'טבע וחיות פרא' };

  return { theme: 'cinema', theme_he: 'קולנוע וגיבורי על' };
}

let basicCount = 0;
const enrichedArsenal = arsenal.map(item => {
  const t = getTheme(item);
  const is_basic = basicIds.has(item.id);
  if (is_basic) basicCount++;

  return {
    ...item,
    is_basic,
    theme: t.theme,
    theme_he: t.theme_he
  };
});

console.log(`Enriched ${enrichedArsenal.length} items. Total in Basic (בסיסי): ${basicCount}`);

// Save to public/data/masterMnemonicArsenal1000.json
fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(enrichedArsenal, null, 2), 'utf8');
console.log('Saved public/data/masterMnemonicArsenal1000.json');

// Save to src/data/masterMnemonicArsenal1000.js
const jsContent = `// MASTER MNEMONIC ARSENAL (CURATED CULTURAL ANCHORS)
// Total items: ${enrichedArsenal.length}
// Default 'בסיסי' (Basic): ${basicCount} iconic All-Stars
// Thematic Expansion packs available: gaming, cinema, sports, supercars_brands, science, history_myth, nature

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(enrichedArsenal, null, 2)};

export const MASTER_ARSENAL_COUNT = ${enrichedArsenal.length};
export const BASIC_ARSENAL_COUNT = ${basicCount};

export default MASTER_MNEMONIC_ARSENAL;
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsContent, 'utf8');
console.log('Saved src/data/masterMnemonicArsenal1000.js');

// Save to src/data/stagedImagesPool.js
const poolItems = enrichedArsenal.map(item => ({
  id: item.id,
  suggestedName: item.name_he,
  topic: item.category,
  theme: item.theme,
  theme_he: item.theme_he,
  is_basic: item.is_basic,
  imageUrl: item.imageUrl,
  fileSize: item.fileSize,
  everyday_associations: item.everyday_associations
}));

const stagedJsContent = `// STAGED IMAGES POOL (REFINED CULTURAL ARSENAL)
// Total items: ${poolItems.length}
// Default 'בסיסי' (Basic): ${basicCount} items

export const STAGED_IMAGES_POOL = ${JSON.stringify(poolItems, null, 2)};

export default STAGED_IMAGES_POOL;
`;
fs.writeFileSync('src/data/stagedImagesPool.js', stagedJsContent, 'utf8');
console.log('Saved src/data/stagedImagesPool.js');
