import fs from 'fs';
import path from 'path';

const outDir = 'public/celebrities';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Complete list of 42 iconic figures with Wikipedia page titles
const CELEB_ENTRIES = [
  // 1. Tech & Science
  { id: 'elon_musk', wiki: 'Elon_Musk', name: 'אילון מאסק' },
  { id: 'steve_jobs', wiki: 'Steve_Jobs', name: 'סטיב ג\'ובס' },
  { id: 'albert_einstein', wiki: 'Albert_Einstein', name: 'אלברט איינשטיין' },
  { id: 'bill_gates', wiki: 'Bill_Gates', name: 'ביל גייטס' },
  { id: 'mark_zuckerberg', wiki: 'Mark_Zuckerberg', name: 'מארק צוקרברג' },
  { id: 'nikola_tesla', wiki: 'Nikola_Tesla', name: 'ניקולה טסלה' },

  // 2. Cartoons & Gaming & Comics
  { id: 'mickey_mouse', wiki: 'Mickey_Mouse', name: 'מיקי מאוס' },
  { id: 'spongebob', wiki: 'SpongeBob_SquarePants_(character)', name: 'בובספוג' },
  { id: 'homer_simpson', wiki: 'Homer_Simpson', name: 'הומר סימפסון' },
  { id: 'super_mario', wiki: 'Mario', name: 'סופר מריו' },
  { id: 'pikachu', wiki: 'Pikachu', name: 'פיקאצ\'ו' },
  { id: 'batman', wiki: 'Batman', name: 'באטמן' },
  { id: 'spiderman', wiki: 'Spider-Man', name: 'ספיידרמן' },
  { id: 'shrek', wiki: 'Shrek_(character)', name: 'שרק' },
  { id: 'darth_vader', wiki: 'Darth_Vader', name: 'דארת\' ויידר' },

  // 3. Sports Legends
  { id: 'michael_phelps', wiki: 'Michael_Phelps', name: 'מייקל פלפס' },
  { id: 'cristiano_ronaldo', wiki: 'Cristiano_Ronaldo', name: 'כריסטיאנו רונאלדו' },
  { id: 'leo_messi', wiki: 'Lionel_Messi', name: 'ליאו מסי' },
  { id: 'michael_jordan', wiki: 'Michael_Jordan', name: 'מייקל ג\'ורדן' },
  { id: 'mike_tyson', wiki: 'Mike_Tyson', name: 'מייק טייסון' },
  { id: 'lebron_james', wiki: 'LeBron_James', name: 'לברון ג\'יימס' },
  { id: 'usain_bolt', wiki: 'Usain_Bolt', name: 'יוסיין בולט' },

  // 4. Music & Pop Culture
  { id: 'elvis_presley', wiki: 'Elvis_Presley', name: 'אלביס פרסלי' },
  { id: 'michael_jackson', wiki: 'Michael_Jackson', name: 'מייקל ג\'קסון' },
  { id: 'freddie_mercury', wiki: 'Freddie_Mercury', name: 'פרדי מרקורי' },
  { id: 'bob_marley', wiki: 'Bob_Marley', name: 'בוב מארלי' },
  { id: 'taylor_swift', wiki: 'Taylor_Swift', name: 'טיילור סוויפט' },
  { id: 'eyal_golan', wiki: 'Eyal_Golan', name: 'אייל גולן' },
  { id: 'beyonce', wiki: 'Beyoncé', name: 'ביונסה' },

  // 5. Cinema & TV
  { id: 'charlie_chaplin', wiki: 'Charlie_Chaplin', name: 'צ\'ארלי צ\'פלין' },
  { id: 'marilyn_monroe', wiki: 'Marilyn_Monroe', name: 'מרילין מונרו' },
  { id: 'arnold_schwarzenegger', wiki: 'Arnold_Schwarzenegger', name: 'ארנולד שוורצנגר' },
  { id: 'gal_gadot', wiki: 'Gal_Gadot', name: 'גל גדות' },
  { id: 'rowan_atkinson', wiki: 'Rowan_Atkinson', name: 'מיסטר בין' },
  { id: 'gordon_ramsay', wiki: 'Gordon_Ramsay', name: 'גורדון רמזי' },
  { id: 'leonardo_dicaprio', wiki: 'Leonardo_DiCaprio', name: 'ליאונרדו דיקפריו' },

  // 6. Politics & Leaders
  { id: 'donald_trump', wiki: 'Donald_Trump', name: 'דונלד טראמפ' },
  { id: 'bibi_netanyahu', wiki: 'Benjamin_Netanyahu', name: 'בנימין נתניהו' },
  { id: 'barack_obama', wiki: 'Barack_Obama', name: 'ברק אובמה' },
  { id: 'david_ben_gurion', wiki: 'David_Ben-Gurion', name: 'דוד בן-גוריון' },
  { id: 'vladimir_putin', wiki: 'Vladimir_Putin', name: 'ולדימיר פוטין' },
  { id: 'winston_churchill', wiki: 'Winston_Churchill', name: 'וינסטון צ\'רצ\'יל' },
  { id: 'cleopatra', wiki: 'Cleopatra', name: 'קליאופטרה' }
];

async function run() {
  console.log(`Checking ${CELEB_ENTRIES.length} celebrity entries...`);
  for (const item of CELEB_ENTRIES) {
    const targetFile = path.join(outDir, `${item.id}.jpg`);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 1500) {
      console.log(`✓ Exists: ${item.id} (${fs.statSync(targetFile).size} bytes)`);
      continue;
    }

    try {
      console.log(`Fetching info for ${item.wiki} (${item.id})...`);
      const res = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.wiki)}&prop=pageimages&format=json&pithumbsize=600`,
        { headers: { 'User-Agent': 'LifeQuestApp/2.0 (mnemonic@lifequest.app; +https://lifequest.app)' } }
      );
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      const thumb = page?.thumbnail?.source;
      if (thumb) {
        const imgRes = await fetch(thumb, {
          headers: { 'User-Agent': 'LifeQuestApp/2.0 (mnemonic@lifequest.app; +https://lifequest.app)' }
        });
        const buf = Buffer.from(await imgRes.arrayBuffer());
        if (buf.length > 1000) {
          fs.writeFileSync(targetFile, buf);
          console.log(`✓ Saved ${item.id} (${buf.length} bytes)`);
        } else {
          console.warn(`! Small buffer for ${item.id}:`, buf.toString());
        }
      } else {
        console.warn(`! No thumbnail for ${item.wiki}`);
      }
    } catch (e) {
      console.error(`Error for ${item.id}:`, e.message);
    }
    // Small delay to be polite to Wikipedia API
    await new Promise(r => setTimeout(r, 120));
  }
  console.log('Finished checking/downloading all images!');
}

run();
