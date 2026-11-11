import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const poolDir = path.resolve(__dirname, '../public/staged_images/pool');
if (!fs.existsSync(poolDir)) {
  fs.mkdirSync(poolDir, { recursive: true });
}

// Curated English search queries specifically crafted to fetch the #1 most iconic, popular photographic or rendered image
export const CURATED_POPULAR_QUERIES = {
  25: 'Scrooge McDuck swimming in gold coins vault',
  48: 'ALF alien Gordon Shumway sitting with cat',
  66: 'Zaanse Schans Dutch windmill Netherlands tulips sunset',
  112: 'Guernica Pablo Picasso painting black white mural',
  127: 'Jeff Koons balloon dog shiny metallic magenta sculpture',
  137: 'Banksy flower thrower mural wall art',
  147: 'Egyptian mummy wrapped in linen bandages ancient Cairo',
  151: 'glowing incandescent light bulb idea dark background yellow filament',
  152: 'pirate treasure chest open overflowing with gold coins and gems',
  153: 'cartoon round black iron bomb lit burning spark fuse',
  154: '3.5 inch floppy disk diskette black Sony',
  155: 'classic magnifying glass wooden handle on antique book',
  156: 'large heavy adjustable metal wrench spanner tool',
  157: 'burlap money bag tied with dollar sign gold coins',
  158: 'comedy and tragedy theater drama masks gold and silver',
  159: 'comic book speech bubble thought cloud white isolated',
  160: 'broken red heart cracked in two pieces romance',
  161: 'cogs and gears metallic industrial interlocking mechanism',
  162: 'graduation cap mortarboard black golden tassel diploma scroll',
  163: 'brass scales of justice law courthouse wooden table',
  164: 'archery arrow hitting red bullseye center target board',
  165: 'glass mercury thermometer high temperature red rising heat',
  166: 'antique brass hourglass sand flowing time deadline',
  167: 'luxurious red carpet rolled out velvet ropes premiere',
  168: 'pair of white casino dice showing dots lucky roll',
  169: 'golden championship trophy cup two handles winner',
  170: 'heavy black maritime iron ship anchor sea',
  171: 'flexed arm bicep muscle bodybuilder strength',
  172: 'closed heavy brass padlock with key lock security',
  173: 'red and white medicine capsule pill tablet pharmaceutical',
  174: 'red octagonal STOP traffic road sign isolated',
  175: 'white dove flying olive branch in beak peace symbol',
  176: 'glowing 3D red question mark symbol isolated',
  177: 'yellow triangular warning hazard sign exclamation mark',
  178: 'pirate skull and crossbones flag Jolly Roger black',
  179: 'white folded paper airplane gliding flight isolated',
  180: 'royal golden crown jewels diamonds velvet king',
  181: 'classic black silk bowtie formal tuxedo accessory',
  182: 'iron horseshoe luck equestrian nailed wood',
  183: 'four leaf clover green shamrock lucky close up',
  184: 'cupid cherub angel holding golden bow and heart arrow',
  185: 'shoulder angel and devil cartoon conscience',
  186: 'black ink human fingerprint forensic whorl',
  187: 'human footprints in wet beach sand sunset walk',
  188: 'computer microchip green printed circuit board gold processor CPU',
  189: 'jigsaw puzzle missing one center piece solving',
  190: 'red push pin thumbtack cork bulletin board',
  191: 'metal supermarket shopping cart basket empty',
  192: 'outdoor metal garbage trash can half open lid',
  193: 'awareness ribbon loop pink yellow charity support',
  194: 'mystical glowing glass crystal ball fortune teller dark',
  195: 'vintage brown leather travel suitcase vintage stickers luggage',
  196: 'traditional witch straw twig broomstick flying',
  197: 'black magician top hat white rabbit ears sticking out wand',
  198: 'antique feather quill pen dipped in ink bottle parchment',
  199: 'open vintage thick book yellowed pages leather bound',
  200: 'classic wire metal clothes hanger closet',
  203: 'red London double decker bus Big Ben street',
  205: 'Harley Davidson chrome cruiser chopper motorcycle road',
  214: 'classic American police patrol car flashing red blue lights night',
  215: 'red fire truck engine vehicle ladder sirens emergency',
  218: 'WWII Willys military army jeep olive green vintage',
  221: 'garbage sanitation dump truck lifting bin street',
  229: 'pair of inline rollerblades skates on pavement',
  237: 'auto rickshaw tuk tuk vehicle India street colorful',
  240: 'jet ski personal watercraft racing ocean waves splash',
  241: 'antique penny farthing high wheeler bicycle vintage',
  242: 'classic vintage Volkswagen Beetle bug car yellow',
  251: 'giant saguaro cactus desert Arizona blue sky',
  252: 'tropical palm tree small desert sand island blue ocean',
  276: 'honey bee pollinating flower close up wings yellow stripes',
  279: 'deep red rose blossom dew drops thorny green stem',
  280: 'red autumn maple leaf Canada symbol isolated',
  293: 'red marine crab sea creature pincers ocean beach',
  309: 'badminton shuttlecock feather white cork on court',
  310: 'pair of red leather boxing gloves sparring',
  311: 'Olympic rings five colors blue yellow black green red symbol',
  313: 'snowboarder carved on snow mountain slope skis winter',
  319: 'white karate judo gi martial arts uniform black belt',
  327: 'dominoes tiles black white dots line chain falling',
  330: 'classic Twister party game mat colored dots',
  342: 'flying frisbee plastic disc in blue sunny sky park',
  344: 'vintage red movie theater popcorn cart machine popping corn',
  345: 'vintage admit one movie theater ticket stub red paper',
  346: 'vintage retro arcade video game machine cabinet glowing screen',
  347: 'video game wireless controller gamepad dual sticks buttons',
  350: 'skydiver open parachute canopy floating in blue sky',
  351: 'claw hammer wooden handle steel head driving nail',
  352: 'cross head Phillips screwdriver tool rubber grip handle',
  353: 'sharp stainless steel cutting scissors open on table',
  354: 'silver metal safety pin open and closed isolated',
  355: 'open classic black umbrella rain curved handle',
  356: 'heavy adjustable crescent wrench spanner tool isolated',
  357: 'traditional wood cutting hand saw steel serrated blade handle',
  358: 'sweeping broom and plastic dustpan cleaning floor',
  359: 'aluminum folding A frame stepladder tool',
  360: 'classic stainless steel fork knife and spoon dining cutlery set',
  361: 'manual steel can opener tool rotating gear',
  362: 'opened tin can metal lid peeled back food',
  363: 'glass wine bottle and lever corkscrew opener pulling cork',
  364: 'burning white candle melting wax dripping flame glow',
  365: 'black LED tactical flashlight beam shining in dark',
  366: 'wooden matchstick striking matchbox fire flame spark',
  367: 'silver chrome Zippo flip top lighter open lit flame',
  368: 'toothbrush with striped toothpaste on bristles plastic handle',
  369: 'bar of soap with rich foamy bubbles lather wash',
  370: 'roll of white soft toilet paper tissue bathroom',
  371: 'black plastic hair comb teeth grooming styling',
  372: 'ornate vintage handheld vanity mirror reflection glass',
  373: 'stylish reading glasses black frame on open book',
  374: 'vintage retro twin bell alarm clock ringing morning',
  375: 'wooden clothes coat hanger with metal hook closet',
  376: 'modern electric steam iron pressing clothes steam vents',
  377: 'antique Singer black cast iron treadle sewing machine gold details',
  378: 'metal sewing needle threaded with red cotton thread eye',
  379: 'round 4 hole plastic shirt button sewing thread',
  380: 'metal jacket zipper halfway open teeth pull tab',
  381: 'yellow retractable steel measuring tape measure roll',
  382: 'spiral bound ruled notebook notepad wire coil paper',
  383: 'classic BIC blue ballpoint pen clear plastic cap',
  384: 'classic yellow #2 graphite pencil pink eraser ferrule',
  385: 'small metal handheld pencil sharpener wedge blade screw',
  386: 'office desk stapler tool metallic paper staples',
  387: 'silver bent wire paper clip office stationery',
  388: 'wooden spring clothespin peg laundry line clip',
  389: 'plastic laundry hamper basket full of colorful folded clothes',
  390: 'coiled green garden hose sprayer nozzle grass lawn',
  391: 'steel garden digging fork pitchfork wooden handle tines',
  392: 'metal garden lawn rake gathering autumn leaves yard',
  393: 'heavy metal construction wheelbarrow single wheel handles dirt',
  394: 'terracotta clay brown flower plant pot empty ceramic',
  395: 'vintage galvanized metal garden watering can long spout sprinkler',
  396: 'red steel toolbox chest organizer tools handle latches',
  397: 'roll of brown carton packing packaging tape adhesive',
  398: 'stainless steel insulated thermos beverage flask bottle cup lid',
  399: 'blue hard plastic cooler ice box chest handle white lid picnic',
  400: 'white emergency first aid kit medical box red cross handle',
  404: 'Pac Man retro arcade video game maze yellow dot eater',
  407: 'Ronald McDonald clown face red hair big smile fast food mascot',
  413: 'King Kong giant gorilla climbing Empire State Building biplanes',
  416: 'wooden judge gavel sounding block courtroom legal hammer',
  417: 'black metal briefcase open packed with stacked 100 dollar bills cash',
  418: 'fortune teller glowing magical crystal ball mystical violet glow',
  419: 'heavy pipe wrench spanner plumbing tool steel',
  420: 'medical stethoscope doctor clinical equipment isolated table',
  421: 'supermarket metal wire grocery shopping cart isolated',
  422: 'soccer referee holding up penalty red card in air match',
  423: 'pair of black cast iron dumbbells weights gym fitness workout',
  424: 'antique brass sand timer hourglass running sand desk',
  425: 'pink porcelain piggy bank coin slot saving money',
  426: 'hangmans noose rope knot gallows execution',
  427: 'vintage rotary dial telephone handset receiver retro 1960s',
  428: 'pair of aluminum medical walking crutches rehabilitation injury',
  429: 'grand opening ceremony ribbon cutting gold scissors red ribbon',
  430: 'metallic safety pin fastened securely silver steel',
  431: 'magnifying glass exploring inspection clear optical glass',
  432: 'medical syringe with needle clear liquid medicine vaccine injection',
  433: 'golden imperial monarch crown diamonds rubies velvet cushion',
  434: 'first aid medical trauma bag red white cross emergency supplies',
  435: 'NASA astronaut white spacesuit helmet spacewalk outer space Earth',
  436: 'black graduation mortarboard cap thrown in air celebration',
  437: 'vintage admit one admission movie cinema theater ticket paper',
  438: 'white gaming dice with black spots pair random chance',
  442: 'Michelangelo statue of David Florence Italy white marble masterpiece',
  446: 'Leaning Tower of Pisa Italy white marble architecture sunny blue sky',
  447: 'Christ the Redeemer statue Rio de Janeiro Corcovado Brazil clouds',
  453: 'bright jagged lightning bolt striking dark stormy night sky clouds',
  454: 'massive tornado funnel cloud touching ground prairie storm dark sky',
  455: 'active volcano erupting red glowing lava magma smoke crater night',
  456: 'vibrant green chameleon on branch camouflage changing colors eye',
  457: 'black venomous scorpion stinger raised claws desert sand',
  458: 'male African lion majestic mane roaring king of the jungle savanna',
  459: 'white dove flying peace symbol fresh green olive sprig branch',
  460: 'wise barn owl perched on tree branch nocturnal golden big eyes',
  461: 'majestic American bald eagle flying soaring wings spread blue sky',
  462: 'golden retriever guide dog in harness working assistance companion',
  463: 'delicate spider web dew drops glinting morning sunrise light',
  464: 'vibrant sunset ocean golden sun dipping into sea waves horizon',
  465: 'giant underwater iceberg floating ocean tip above water underwater blue',
  466: 'bare winter deciduous tree silhouette branches without leaves mist',
  467: 'field of blooming giant yellow sunflowers bright blue sky summer',
  468: 'Michael Jordan Jumpman silhouette dunking basketball Chicago Bulls',
  469: 'golden victory cup trophy held high in two hands champions celebration',
  470: 'gold medal victory ribbon around neck first place championship podium',
  471: 'dart arrow hit dead center bullseye dartboard target game',
  472: 'red Ferrari Formula 1 race car racing fast speed on track circuit',
  473: 'bright neon yellow green tennis ball on clay court fuzz texture',
  474: 'bowling ball crashing into pins strike bowling alley lane',
  475: 'martial arts black belt tied around waist karate master discipline',
  476: 'wooden chess king piece isolated on chessboard strategy checkmate',
  477: 'seraphim angel white feathered wings glowing halo holy light',
  478: 'red mythical dragon demon horns breathing fire pitchfork hell',
  479: 'Rod of Asclepius serpent entwined rod ancient medicine staff gold',
  480: 'medieval knight shining steel armor white warhorse lance heroic',
  481: 'wooden Christian cross crucifix silhouette sunrise hill blue sky',
  482: 'crescent moon and star golden symbol Islamic culture mosque twilight',
  483: 'Star of David Magen David blue gold hexagram sacred Jewish symbol',
  484: 'golden smiling laughing Buddha statue sitting meditation peace temple',
  485: 'Grim Reaper black hooded cloak skeleton scythe death shadows mist',
  486: 'Bohr atom model atomic nucleus orbiting electrons science physics graphic',
  487: 'chemical glass test tube bubbling smoking colored liquid laboratory flask',
  488: 'yellow trefoil radioactive radiation hazard warning symbol sign nuclear',
  489: 'green matrix binary code falling numbers computer screen cyberpunk hacker',
  490: 'black ink forensic fingerprint impression loop whorl forensic evidence',
  491: 'retro steel robot glowing eyes antenna vintage sci fi automaton',
  492: 'satellite dish antenna pointing at starry night sky space observatory',
  493: 'skull and crossed bones poison pirate danger warning sign black white',
  494: 'red octagon stop sign white border street post isolated',
  495: 'blue international wheelchair symbol handicap accessibility sign icon',
  496: 'green Mobius loop recycling symbol three chasing arrows ecology icon',
  497: 'male and female bathroom restroom door restroom door sign icons',
  498: 'WiFi wireless internet signal broadcast waves blue glowing icon symbol',
  499: 'Bluetooth rune symbol logo blue glowing wireless technology icon',
  500: 'green emergency exit running man sign illuminated door safety'
};

async function fetchTopDuckDuckGoImageUrl(query) {
  try {
    const tokenRes = await fetch('https://duckduckgo.com/?q=' + encodeURIComponent(query), {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
      signal: AbortSignal.timeout(7000)
    });
    const text = await tokenRes.text();
    const vqdMatch = text.match(/vqd=([0-9-]+)/);
    if (!vqdMatch) return null;

    const imgRes = await fetch(
      'https://duckduckgo.com/i.js?l=us-en&o=json&q=' + encodeURIComponent(query) + '&vqd=' + vqdMatch[1],
      {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        signal: AbortSignal.timeout(7000)
      }
    );
    if (!imgRes.ok) return null;
    const data = await imgRes.json();
    if (!data.results || data.results.length === 0) return null;
    
    // Pick first result that has a valid direct image URL
    for (const r of data.results) {
      if (r.image && (r.image.startsWith('http://') || r.image.startsWith('https://'))) {
        return r.image;
      }
    }
    return null;
  } catch (err) {
    return null;
  }
}

async function downloadImageToDisk(url, destPath) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 8000) return false; // reject tiny broken thumbnails
    fs.writeFileSync(destPath, buf);
    return buf.length;
  } catch (e) {
    return false;
  }
}

async function runAuditAndDownload() {
  const arsenal = JSON.parse(fs.readFileSync('public/data/masterMnemonicArsenal1000.json', 'utf8'));
  const targets = JSON.parse(fs.readFileSync('scripts/target_214_items.json', 'utf8'));

  console.log(`Starting audit and download of popular web images for ${targets.length} targets...`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    const num = target.num;
    const item = arsenal.find(a => a.num === num);
    if (!item) {
      console.warn(`Item ${num} not found in arsenal!`);
      continue;
    }

    const filename = path.basename(item.imageUrl);
    const destPath = path.join(poolDir, filename);

    const query = CURATED_POPULAR_QUERIES[num];
    if (!query) {
      console.warn(`[${i + 1}/${targets.length}] (#${num}) No query defined for: ${target.name_he}`);
      continue;
    }

    process.stdout.write(`[${i + 1}/${targets.length}] (#${num}) ${target.name_he} -> "${query}"... `);

    // Fetch top popular image
    const imgUrl = await fetchTopDuckDuckGoImageUrl(query);
    if (!imgUrl) {
      console.log(`❌ No image URL returned`);
      failCount++;
      await new Promise(r => setTimeout(r, 100));
      continue;
    }

    const bytes = await downloadImageToDisk(imgUrl, destPath);
    if (bytes) {
      console.log(`✓ Saved ${filename} (${bytes} B)`);
      successCount++;
    } else {
      console.log(`⚠️ Download failed for ${imgUrl.slice(0, 50)}...`);
      failCount++;
    }

    await new Promise(r => setTimeout(r, 120));
  }

  console.log('\n=============================================');
  console.log(`Download finished! Success: ${successCount}, Fail: ${failCount}, Total targets: ${targets.length}`);
  console.log('=============================================\n');
}

runAuditAndDownload();
