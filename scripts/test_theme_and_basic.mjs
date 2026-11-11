import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// High-confidence, universally recognizable All-Stars for the "בסיסי" (Basic) default tier
const basicIds = new Set([
  // Gaming & Animation
  'pikachu_electric_mouse',
  'super_mario_wonder',
  'luigi_mansion',
  'princess_peach_cake',
  'bowser_king_koopa',
  'yoshi_dinosaur',
  'donkey_kong_bananas',
  'link_legend_of_zelda',
  'sonic_the_hedgehog',
  'crash_bandicoot_wumpa',
  'kratos_god_of_war',
  'master_chief_halo',
  'lara_croft_tomb_raider',
  'goku_super_saiyan',
  'vegeta_saiyan_prince',
  'naruto_uzumaki_hokage',
  'homer_simpson',
  'spongebob_squarepants',
  'mickey_mouse_classic',

  // Superheroes & Villains
  'spider_man_classic',
  'batman_dark_knight',
  'the_joker_heath',
  'superman_man_of_steel',
  'iron_man_mark',
  'captain_america_shield',
  'thor_odinson_hammer',
  'hulk_smash_green',
  'wolverine_claws',
  'deadpool_chimichanga',
  'thanos_infinity_gauntlet',
  'wonder_woman_lasso',
  'harley_quinn_mallet',

  // Cinema & Cult Characters
  'james_bond_007',
  'indiana_jones_hero',
  'darth_vader_mask',
  'luke_skywalker',
  'yoda_master_starwars',
  'chewbacca_wookiee',
  'r2_d2_droid',
  'harry_potter_hero',
  'hermione_granger_wand',
  'gandalf_the_grey',
  'frodo_baggins_ring',
  'gollum_my_precious',
  'jack_sparrow_captain',
  'rocky_balboa',
  'arnold_terminator',
  'neo_the_matrix',
  'forrest_gump_bench',
  'charlie_chaplin_tramp',
  'the_mask_stanley',
  'edward_scissorhands_hands',
  'mr_bean_teddy',
  'hannibal_lecter_mask',
  'freddy_krueger_glove',
  'john_wick_keanu',
  'daenerys_targaryen_dragons',
  'jon_snow_longclaw',

  // Sports Titans
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

  // Supercars, Iconic Objects & Relics
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

  // Science & Tech Giants
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

  // History, Wonders & Myth
  'eiffel_tower_paris',
  'statue_of_liberty_ny',
  'great_pyramid_giza',
  'colosseum_rome_flavian',
  'taj_mahal_india',
  'great_wall_of_china',
  'machu_picchu_inca',
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
  'african_lion_male',
  'bengal_tiger_stripes',
  'polar_bear_arctic_ice',
  'great_white_shark_ocean',
  'killer_whale_orca',
  'tyrannosaurus_rex_fossil',
  'bald_eagle_america',
  'giant_panda_bamboo'
]);

// Map categories to 7 clean themes
function getTheme(item) {
  const cat = item.category || '';
  const id = item.id || '';

  if (cat === 'gaming_animation') return 'gaming';
  if (cat === 'superheroes_villains' || cat === 'cinema_tv') return 'cinema';
  if (cat === 'sports_athletes') return 'sports';
  if (cat === 'cultural_objects' || cat === 'iconic_objects') return 'brands_relics';
  if (cat === 'science_thinkers') return 'science';
  if (cat === 'history_leaders' || cat === 'mythology_folklore' || cat === 'landmarks_wonders' || cat === 'arts_creators' || cat === 'history_figures') return 'history_myth';
  if (cat === 'nature_beasts' || cat === 'nature_wildlife') return 'nature';

  return 'cinema';
}

console.log('Total items in arsenal:', arsenal.length);
let basicMatches = 0;

arsenal.forEach(it => {
  it.theme = getTheme(it);
  it.is_basic = basicIds.has(it.id);
  if (it.is_basic) basicMatches++;
});

console.log(`Matched ${basicMatches} basic items out of ${basicIds.size} specified in set!`);

const byTheme = {};
arsenal.forEach(it => {
  byTheme[it.theme] = (byTheme[it.theme] || 0) + 1;
});
console.log('Distribution by theme:', byTheme);

// Also verify missing basic IDs if any
const missingBasic = Array.from(basicIds).filter(id => !arsenal.some(it => it.id === id));
if (missingBasic.length > 0) {
  console.log('Basic IDs not found in arsenal:', missingBasic);
}
