import fs from 'fs';

const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));

// The Strict 50 Global Cultural Mega-Phenomena (Undisputed 10/10 Icons)
const megaPhenomena = new Set([
  'mona_lisa_louvre',
  'pikachu_electric_mouse',
  'super_mario_wonder',
  'sonic_the_hedgehog',
  'darth_vader_mask',
  'yoda_master_starwars',
  'james_bond_007',
  'indiana_jones_hero',
  'harry_potter_hero',
  'gandalf_the_grey',
  'jack_sparrow_captain',
  'rocky_balboa',
  'arnold_terminator',
  'the_mask_stanley',
  'mr_bean_teddy',
  'iron_man_tony',
  'captain_america_steve',
  'hulk_bruce_banner',
  'wolverine_logan',
  'deadpool_wade_wilson',
  'thanos_mad_titan',
  'lionel_messi_world_cup',
  'cristiano_ronaldo_siu',
  'michael_jordan_slam_dunk',
  'diego_maradona_hand',
  'pele_king_football',
  'muhammad_ali_knockout',
  'mike_tyson_iron',
  'usain_bolt_lightning_pose',
  'bruce_lee_dragon',
  'albert_einstein_icon',
  'steve_jobs',
  'neil_armstrong',
  'ferrari_testarossa_red',
  'lamborghini_countach_white',
  'aston_martin_db5_silver',
  'game_boy_nintendo_retro',
  'rubiks_cube_solved',
  'lego_yellow_minifigure',
  'barbie_doll_classic',
  'margherita_pizza_woodfire',
  'eiffel_tower_paris',
  'statue_of_liberty_ny',
  'pyramids_of_giza_egypt',
  'colosseum_rome_italy',
  'taj_mahal_agra',
  'great_white_shark_jaws',
  'african_lion_roar',
  'simba_lion_king',
  'aladdin_magic_lamp_gold'
]);

let basicCount = 0;
const updatedArsenal = arsenal.map(item => {
  const is_basic = megaPhenomena.has(item.id);
  if (is_basic) basicCount++;

  // Ensure mona_lisa has a clean theme
  if (item.id === 'mona_lisa_louvre') {
    item.theme = 'history_myth';
    item.theme_he = 'אמנות ומיתולוגיה';
  }

  return {
    ...item,
    is_basic
  };
});

console.log(`Updated arsenal: ${updatedArsenal.length} total items. Basic (תופעות תרבותיות בלבד): ${basicCount}`);

// 1. Update public/data/masterMnemonicArsenal1000.json
fs.writeFileSync('public/data/masterMnemonicArsenal1000.json', JSON.stringify(updatedArsenal, null, 2), 'utf8');

// 2. Update src/data/masterMnemonicArsenal1000.js
const jsContent = `// MASTER MNEMONIC ARSENAL (REFINED CULTURAL PHENOMENA)
// Total items: ${updatedArsenal.length}
// Default 'בסיסי' (Basic): Exactly ${basicCount} Global Mega-Phenomena (Mona Lisa, Pikachu, Ferrari, Einstein, Messi, etc.)
// Strictly zero obscure mosaics or academic trivia in Basic!

export const MASTER_MNEMONIC_ARSENAL = ${JSON.stringify(updatedArsenal, null, 2)};

export const MASTER_ARSENAL_COUNT = ${updatedArsenal.length};
export const BASIC_ARSENAL_COUNT = ${basicCount};

export default MASTER_MNEMONIC_ARSENAL;
`;
fs.writeFileSync('src/data/masterMnemonicArsenal1000.js', jsContent, 'utf8');

// 3. Update src/data/stagedImagesPool.js
const poolItems = updatedArsenal.map(item => ({
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

const stagedJsContent = `// STAGED IMAGES POOL (REFINED CULTURAL PHENOMENA)
// Total items: ${poolItems.length}
// Default 'בסיסי' (Basic): ${basicCount} Mega-Phenomena

export const STAGED_IMAGES_POOL = ${JSON.stringify(poolItems, null, 2)};

export default STAGED_IMAGES_POOL;
`;
fs.writeFileSync('src/data/stagedImagesPool.js', stagedJsContent, 'utf8');
console.log('Datasets updated successfully!');
