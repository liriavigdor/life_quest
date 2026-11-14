import fs from 'fs';
import path from 'path';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../src/data/creationDraftRoots.js';

const CONCISE_TITLES = {
  arch_swiss_army_knife: 'סכין שוויצרית',
  arch_hourglass: 'שעון חול',
  arch_pocket_watch: 'שעון כיס',
  arch_compass: 'מצפן',
  arch_magnifying_glass: 'זכוכית מגדלת',
  arch_gramophone: 'גרמופון',
  arch_typewriter: 'מכונת כתיבה',
  arch_rotary_phone: 'טלפון חוגה',
  arch_safety_pin: 'סיכת ביטחון',
  arch_zippo: 'מצית זיפו',
  arch_padlock: 'מנעול תלייה',
  arch_anvil: 'סדן',
  arch_claw_hammer: 'פטיש טפסרים',
  arch_sledgehammer: 'קורנס',
  arch_handsaw: 'מסור יד',
  arch_pipe_wrench: 'מפתח צינורות',
  arch_blowtorch: 'מבער גז',
  arch_stethoscope: 'סטטוסקופ',
  arch_syringe: 'מזרק',
  arch_tuning_fork: 'קולן',
  arch_metronome: 'מטרונום',
  arch_prism: 'מנסרה אופטית',
  arch_newtons_cradle: 'מטוטלת ניוטון',
  arch_megaphone: 'מגפון',
  arch_film_reel: 'גלגל פילם',
  arch_cassette_tape: 'קלטת שמע',
  arch_binoculars: 'משקפת',
  arch_spyglass: 'טלסקופ ימי',
  arch_corkscrew: 'פותחן יין',
  arch_mortar_pestle: 'מכתש ועלי',
  arch_chef_knife: 'סכין שף',
  arch_cast_iron_skillet: 'מחבת ברזל',
  arch_tetsubin_teapot: 'קומקום תה',
  arch_lifebuoy: 'גלגל הצלה',
  arch_anchor: 'עוגן',
  arch_traffic_cone: 'קונוס תנועה',
  arch_fire_extinguisher: 'מטפה כיבוי',
  arch_handcuffs: 'אזיקים',
  arch_gas_mask: 'מסכת אב"כ',
  arch_welding_mask: 'מסכת ריתוך'
};

const updated = INITIAL_CREATION_DRAFT_ROOTS.map(item => {
  if (CONCISE_TITLES[item.id]) {
    return {
      ...item,
      title: CONCISE_TITLES[item.id]
    };
  }
  return item;
});

const content = `/**
 * INITIAL_CREATION_DRAFT_ROOTS
 * 
 * שורשים ארכיטיפיים תכליתיים וממוקדים ללא מילות תיאור מיותרות.
 * סה"כ: ${updated.length} פריטים.
 */

export const INITIAL_CREATION_DRAFT_ROOTS = ${JSON.stringify(updated, null, 2)};
`;

fs.writeFileSync(path.resolve('src/data/creationDraftRoots.js'), content, 'utf8');
console.log('Successfully updated all 40 archetypes to concise, punchy root titles!');

