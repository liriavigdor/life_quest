import fs from 'fs';

const user500 = JSON.parse(fs.readFileSync('scripts/parsed_user_500.json', 'utf8'));
const poolFiles = JSON.parse(fs.readFileSync('scripts/pool_files_list.json', 'utf8'));

// Build dictionary of manual mappings from userNum -> pool filename
const manualNumToPoolFile = {
  // Characters & Pop
  1: 'mickey_mouse.jpg',
  2: 'super_mario_wonder.jpg',
  3: 'pikachu_electric_mouse.jpg',
  4: 'sonic_the_hedgehog.jpg',
  8: 'barbie_doll_classic.jpg',
  9: 'darth_vader_mask.jpg',
  11: 'shrek_ogre_swamp.jpg',
  12: 'pac_man_arcade.jpg',
  13: 'r2_d2_droid.jpg',
  14: 'bugs_bunny_carrot.jpg',
  15: 'winnie_the_pooh_honey.jpg',
  18: 'king_kong_empire_state.jpg',
  19: 'godzilla_monster_roar.jpg',
  20: 'bela_lugosi_dracula.jpg',
  21: 'hulk_bruce_banner.jpg',
  22: 'iron_man_tony.jpg',
  23: 'james_bond_007.jpg',
  26: 'pink_panther_classic.jpg',
  27: 'tarzan_vine_swing.jpg',
  29: 'robin_hood_bow_arrow.jpg',
  32: 'harry_potter_hero.jpg',
  33: 'donald_duck_sailor.jpg',
  34: 'scooby_doo_snack.jpg',
  36: 'popeye_sailor_spinach.jpg',
  37: 'arnold_terminator.jpg',
  38: 'captain_america_steve.jpg',
  39: 'wolverine_logan.jpg',
  40: 'gandalf_the_grey.jpg',
  41: 'gollum_smeagol.jpg',
  46: 'bilbo_baggins_ring.jpg',
  49: 'predator_hunter_mask.jpg',
  50: 'boris_karloff_frankenstein.jpg',

  // Landmarks
  51: 'eiffel_tower_paris.jpg',
  52: 'statue_of_liberty_ny.jpg',
  53: 'pyramids_of_giza_egypt.jpg',
  54: 'sphinx_giza_sand.jpg',
  55: 'taj_mahal_agra.jpg',
  56: 'colosseum_rome_italy.jpg',
  57: 'great_wall_of_china_mutianyu.jpg',
  58: 'leaning_tower_of_pisa.jpg',
  59: 'big_ben_london.jpg',
  60: 'sydney_opera_house_sails.jpg',
  61: 'christ_the_redeemer_rio.jpg',
  62: 'golden_gate_bridge_sf.jpg',
  65: 'kremlin_red_square_moscow.jpg',
  67: 'empire_state_building_ny.jpg',
  68: 'hollywood_sign_la.jpg',
  69: 'stonehenge_england.jpg',
  71: 'acropolis_parthenon_athens.jpg',
  72: 'burj_khalifa_dubai.jpg',
  75: 'arc_de_triomphe_paris.jpg',
  77: 'neuschwanstein_castle_bavaria.jpg',
  79: 'chichen_itza_pyramid.jpg',
  80: 'western_wall_jerusalem.jpg',
  81: 'sagrada_familia_barcelona.jpg',
  82: 'tower_bridge_london.jpg',
  84: 'mount_rushmore_monument.jpg',

  // Art
  101: 'mona_lisa_louvre.jpg',
  102: 'the_scream_edvard_munch.jpg',
  103: 'the_thinker_rodin_statue.jpg',
  109: 'salvador_dali_melting_clocks.jpg',
  110: 'tutankhamun.jpg',
  111: 'venus_de_milo_marble.jpg',
  114: 'girl_with_pearl_earring.jpg',
  117: 'andy_warhol_campbell_soup.jpg',
  118: 'gustav_klimt_the_kiss.jpg',
  121: 'van_gogh_sunflowers.jpg',
  122: 'banksy_balloon_girl.jpg',
  123: 'terracotta_army_warriors.jpg',
  124: 'rosetta_stone_british_museum.jpg',
  141: 'matryoshka_nesting_dolls.jpg',

  // Vehicles
  203: 'london_red_bus_routemaster.jpg',
  205: 'harley_davidson_chopper.jpg',
  207: 'space_shuttle_discovery.jpg',
  208: 'boeing_747_jumbo_jet.jpg',
  210: 'zeppelin_hindenburg_airship.jpg',
  212: 'yellow_submarine_beatles.jpg',
  219: 'vespa_scooter_classic.jpg',
  220: 'titanic_ship_ocean.jpg',
  242: 'volkswagen_beetle_yellow.jpg',

  // Nature
  254: 'giant_panda_bamboo.jpg',
  255: 'african_lion_male_mane.jpg',
  256: 'african_elephant_tusks.jpg',
  253: 'great_white_shark_breach.jpg',
  263: 'emperor_penguin_ice.jpg',

  // Sports & Games
  325: 'rubiks_cube_solved.jpg',

  // Tools
  367: 'zippo_lighter_chrome.jpg',

  // 100 Supplemental
  401: 'darth_vader_mask.jpg',
  404: 'pac_man_arcade.jpg',
  405: 'shrek_ogre_swamp.jpg',
  411: 'harry_potter_hero.jpg',
  439: 'big_ben_london.jpg',
  440: 'taj_mahal_agra.jpg',
  441: 'the_thinker_rodin_statue.jpg',
  443: 'colosseum_rome_italy.jpg',
  444: 'great_wall_of_china_mutianyu.jpg',
  446: 'leaning_tower_of_pisa.jpg',
  447: 'christ_the_redeemer_rio.jpg',
  448: 'golden_gate_bridge_sf.jpg',
  458: 'african_lion_male_mane.jpg'
};

const verifiedMatches = [];
const missingImages = [];

for (const u of user500) {
  const manualFile = manualNumToPoolFile[u.num];
  if (manualFile && poolFiles.includes(manualFile)) {
    verifiedMatches.push({
      num: u.num,
      name: u.name,
      category: u.category,
      desc: u.desc,
      imageFile: manualFile
    });
  } else {
    missingImages.push(u);
  }
}

console.log(`=============================================`);
console.log(`Total 500 items: ${user500.length}`);
console.log(`Verified pool files matched directly: ${verifiedMatches.length}`);
console.log(`Items needing images: ${missingImages.length}`);
console.log(`=============================================`);

fs.writeFileSync('scripts/500_with_existing_pool_images.json', JSON.stringify(verifiedMatches, null, 2), 'utf8');
fs.writeFileSync('scripts/500_needing_images.json', JSON.stringify(missingImages, null, 2), 'utf8');
