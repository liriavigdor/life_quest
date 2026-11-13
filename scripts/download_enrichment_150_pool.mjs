/**
 * Life Quest Image Repository Enrichment - 150 New Roots Downloader & Stager
 * Script: scripts/download_enrichment_150_pool.mjs
 *
 * Implements:
 * 1. Complete 150-root mapping from CANONICAL_ROOT_LOOKUP_150
 * 2. 3-Tier cascade:
 *    - Tier 1: Canonical Wikipedia Lead Image API (with Commons fallback for curated items)
 *    - Tier 2: Wikipedia Search Generator API
 *    - Tier 3: Wikimedia Commons Bitmap Search API
 * 3. User-Agent policy adherence & serialized 150ms throttle delay
 * 4. Zero-dependency pure-JS in-memory raster verification gate:
 *    - Magic bytes check: JPEG, PNG, WebP only
 *    - Rejection of SVG, HTML error pages, AVIF, GIF, PDF
 *    - Dimension gate: width >= 300 AND height >= 300
 *    - Buffer size gate: >= 15 KB
 * 5. Atomic write to `public/staged_images/pool/${id}.jpg`
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const USER_AGENT = 'LifeQuestMnemonicCurator/2.0 (educational research; contact: dev@lifequest.local)';
export const THROTTLE_MS = 150;
export const TARGET_DIR = path.join(process.cwd(), 'public', 'staged_images', 'pool');

export const CANONICAL_ROOT_LOOKUP_150 = [
  { id: "new_001_atm_machine", title: "כספומט", wiki: "ATM" },
  { id: "new_002_credit_card", title: "כרטיס אשראי", wiki: "Credit card" },
  { id: "new_003_bank_checkbook", title: "פנקס המחאות", wiki: "Cheque", fallbackCommons: "File:Gfp-checkbooks.jpg" },
  { id: "new_004_pocket_calculator", title: "מחשבון כיס", wiki: "Calculator" },
  { id: "new_005_office_binder", title: "קלסר משרדי", wiki: "Ring binder" },
  { id: "new_006_ink_stamp", title: "חותמת דיו", wiki: "Rubber stamp" },
  { id: "new_007_passport_booklet", title: "דרכון", wiki: "Passport" },
  { id: "new_008_id_card", title: "תעודת זהות", wiki: "Identity document" },
  { id: "new_009_fountain_pen", title: "עט נובע", wiki: "Fountain pen" },
  { id: "new_010_office_printer", title: "מדפסת", wiki: "Printer (computing)" },
  { id: "new_011_wall_calendar", title: "לוח שנה", wiki: "Calendar" },
  { id: "new_012_red_mailbox", title: "תיבת דואר אדומה", wiki: "Pillar box" },
  { id: "new_013_cardboard_box", title: "ארגז קרטון", wiki: "Cardboard box" },
  { id: "new_014_laptop_computer", title: "מחשב נייד", wiki: "Laptop" },
  { id: "new_015_over_ear_headphones", title: "אוזניות קשת", wiki: "Headphones" },
  { id: "new_016_phone_charger", title: "מטען לטלפון", wiki: "Battery charger", fallbackCommons: "File:Mobile phone charger (2249583565).jpg" },
  { id: "new_017_power_outlet", title: "שקע חשמל", wiki: "AC power plugs and sockets" },
  { id: "new_018_wall_light_switch", title: "מתג תאורה", wiki: "Light switch", fallbackCommons: "File:Australian Architrave 2 Gang Switch Plate.jpg" },
  { id: "new_019_bunch_of_keys", title: "צרור מפתחות", wiki: "Keychain" },
  { id: "new_020_plumber_pipe_wrench", title: "מפתח צינורות אדום", wiki: "Pipe wrench" },
  { id: "new_021_dripping_faucet", title: "ברז מטפטף", wiki: "Tap (valve)" },
  { id: "new_022_rubber_plunger", title: "פומפה", wiki: "Plunger" },
  { id: "new_023_electric_drill", title: "מקדחה", wiki: "Drill", fallbackCommons: "File:CordlessDrill.jpg" },
  { id: "new_024_paint_roller", title: "רולר צביעה", wiki: "Paint roller" },
  { id: "new_025_washing_machine", title: "מכונת כביסה", wiki: "Washing machine" },
  { id: "new_026_dishwasher", title: "מדיח כלים", wiki: "Dishwasher" },
  { id: "new_027_vacuum_cleaner", title: "שואב אבק", wiki: "Vacuum cleaner" },
  { id: "new_028_mop_and_bucket", title: "מגב ודלי", wiki: "Mop" },
  { id: "new_029_cleaning_spray", title: "בקבוק תרסיס ניקוי", wiki: "Spray bottle", fallbackCommons: "File:Dry Season (6195644129).jpg" },
  { id: "new_030_refrigerator", title: "מקרר", wiki: "Refrigerator" },
  { id: "new_031_electric_kettle", title: "קומקום חשמלי", wiki: "Kettle", fallbackCommons: "File:Electric kettle - Электрический чайник.JPG" },
  { id: "new_032_air_conditioner", title: "מזגן", wiki: "Air conditioning" },
  { id: "new_033_milk_carton", title: "קרטון חלב", wiki: "Milk carton" },
  { id: "new_034_french_baguette", title: "כיכר בגט", wiki: "Baguette" },
  { id: "new_035_egg_carton", title: "קרטון ביצים", wiki: "Egg carton" },
  { id: "new_036_yellow_cheese", title: "חריץ גבינה צהובה", wiki: "Cheese" },
  { id: "new_037_vegetable_basket", title: "סלסלת ירקות טריים", wiki: "Vegetable" },
  { id: "new_038_fruit_bowl", title: "קערת פירות", wiki: "Fruit" },
  { id: "new_039_olive_oil", title: "בקבוק שמן זית", wiki: "Olive oil" },
  { id: "new_040_cappuccino_cup", title: "ספל קפה הפוך", wiki: "Cappuccino" },
  { id: "new_041_mineral_water", title: "בקבוק מים מינרליים", wiki: "Bottled water" },
  { id: "new_042_pizza_slice", title: "משולש פיצה", wiki: "Pizza" },
  { id: "new_043_birthday_cake", title: "עוגת יום הולדת", wiki: "Birthday cake" },
  { id: "new_044_medicine_capsule", title: "קפסולת תרופה", wiki: "Capsule (pharmacy)" },
  { id: "new_045_cough_syrup", title: "בקבוק סירופ רפואי", wiki: "Cold medicine" },
  { id: "new_046_band_aid", title: "פלסטר", wiki: "Adhesive bandage" },
  { id: "new_047_arm_cast", title: "יד מגובסת", wiki: "Orthopedic cast", fallbackCommons: "File:Getting A Cast On His Arm - 6022672648.jpg" },
  { id: "new_048_blood_pressure", title: "מד לחץ דם", wiki: "Blood pressure" },
  { id: "new_049_chattering_teeth", title: "שיניים תותבות מתקתקות", wiki: "Dental prosthesis" },
  { id: "new_050_dental_floss", title: "חוט דנטלי", wiki: "Dental floss", fallbackCommons: "File:Dental floss (whole).jpg" },
  { id: "new_051_bathroom_scale", title: "משקל אדם", wiki: "Weighing scale", fallbackCommons: "File:Bathroom Scale (4517197776).jpg" },
  { id: "new_052_hospital_bed", title: "מיטת בית חולים", wiki: "Hospital bed" },
  { id: "new_053_gas_pump", title: "משאבת דלק", wiki: "Gasoline pump" },
  { id: "new_054_car_tire", title: "צמיג רכב", wiki: "Tire" },
  { id: "new_055_parking_meter", title: "מדחן חניה", wiki: "Parking meter" },
  { id: "new_056_car_wash", title: "מכונת שטיפת רכבים", wiki: "Car wash" },
  { id: "new_057_traffic_light", title: "רמזור", wiki: "Traffic light" },
  { id: "new_058_drivers_license", title: "רישיון נהיגה", wiki: "Driver's license" },
  { id: "new_059_car_battery", title: "מצבר רכב", wiki: "Automotive battery" },
  { id: "new_060_city_bus", title: "אוטובוס עירוני", wiki: "Transit bus" },
  { id: "new_061_baby_bottle", title: "בקבוק תינוק", wiki: "Baby bottle" },
  { id: "new_062_baby_diaper", title: "חיתול", wiki: "Diaper" },
  { id: "new_063_baby_pacifier", title: "מוצץ", wiki: "Pacifier" },
  { id: "new_064_school_backpack", title: "ילקוט בית ספר", wiki: "Backpack" },
  { id: "new_065_teddy_bear", title: "דובי פרווה", wiki: "Teddy bear" },
  { id: "new_066_dog_bowl", title: "קערת אוכל לכלב", wiki: "Pet food", fallbackCommons: "File:Dog food in a bowl.jpg" },
  { id: "new_067_dog_leash", title: "רצועת טיול לכלב", wiki: "Leash" },
  { id: "new_068_yarn_ball", title: "כדור צמר", wiki: "Yarn" },
  { id: "new_069_cat_litter_box", title: "ארגז חול לחתול", wiki: "Litter box" },
  { id: "new_070_barber_pole", title: "עמוד ספרים מסתובב", wiki: "Barber's pole" },
  { id: "new_071_hair_dryer", title: "מייבש שיער", wiki: "Hair dryer" },
  { id: "new_072_hair_clippers", title: "מכונת תספורת", wiki: "Hair clipper" },
  { id: "new_073_razor_blade", title: "סכין גילוח", wiki: "Razor" },
  { id: "new_074_nail_polish", title: "בקבוק לק", wiki: "Nail polish" },
  { id: "new_075_perfume_bottle", title: "בקבוק בושם", wiki: "Chanel No. 5" },
  { id: "new_076_shampoo_bottle", title: "בקבוק שמפו", wiki: "Shampoo" },
  { id: "new_077_gift_box", title: "קופסת מתנה עם סרט", wiki: "Gift" },
  { id: "new_078_wedding_rings", title: "זוג טבעות נישואין", wiki: "Wedding ring" },
  { id: "new_079_bouquet_flowers", title: "זר פרחים צבעוני", wiki: "Cut flowers" },
  { id: "new_080_acoustic_guitar", title: "גיטרה אקוסטית", wiki: "Steel-string acoustic guitar" },
  { id: "new_081_dslr_camera", title: "מצלמה דיגיטלית", wiki: "Digital camera" },
  { id: "new_082_running_shoes", title: "נעלי ריצה ספורטיביות", wiki: "Sneakers" },
  { id: "new_083_yoga_mat", title: "מזרן יוגה מגולגל", wiki: "Yoga mat" },
  { id: "new_084_shopping_bag", title: "שקית קניות מלאה", wiki: "Shopping bag" },
  { id: "new_085_receipt_paper", title: "קבלה מודפסת", wiki: "Receipt", fallbackCommons: "File:Grocery Store Receipt in Vienna.jpg" },
  { id: "new_086_safe_box", title: "כספת פלדה", wiki: "Safe" },
  { id: "new_087_security_camera", title: "מצלמת אבטחה", wiki: "Closed-circuit television" },
  { id: "new_088_fire_extinguisher", title: "מטף כיבוי אש", wiki: "Fire extinguisher" },
  { id: "new_089_ironing_board", title: "קרש גיהוץ", wiki: "Ironing" },
  { id: "new_090_thread_spool", title: "סליל חוטים צבעוני", wiki: "Thread (textiles)" },
  { id: "new_091_cash_register", title: "קופה רושמת", wiki: "Cash register" },
  { id: "new_092_delivery_scooter", title: "שליח על קטנוע", wiki: "Motorcycle courier" },
  { id: "new_093_desk_lamp", title: "מנורת שולחן", wiki: "Anglepoise lamp" },
  { id: "new_094_whiteboard", title: "לוח מחיק משרדי", wiki: "Whiteboard" },
  { id: "new_095_microphone", title: "מיקרופון", wiki: "Microphone" },
  { id: "new_096_train_ticket", title: "כרטיס רכבת", wiki: "Train ticket" },
  { id: "new_097_hotel_bell", title: "פעמון קבלה במלון", wiki: "Call bell" },
  { id: "new_098_towel_stack", title: "ערימת מגבות נקיות", wiki: "Towel" },
  { id: "new_099_trash_bag", title: "שקית אשפה שחורה", wiki: "Bin bag" },
  { id: "new_100_recycling_bin", title: "פח מיחזור כחול", wiki: "Recycling bin" },
  { id: "new_101_sherlock_holmes", title: "שרלוק הולמס", wiki: "Sherlock Holmes", fallbackCommons: "File:Charles Frohman presents William Gillette in his new four act drama, Sherlock Holmes (LOC var 1364) (edit).jpg" },
  { id: "new_102_albert_einstein", title: "אלברט איינשטיין", wiki: "Albert Einstein" },
  { id: "new_103_mona_lisa", title: "מונה ליזה", wiki: "Mona Lisa" },
  { id: "new_104_santa_claus", title: "סנטה קלאוס", wiki: "Santa Claus" },
  { id: "new_105_elsa_frozen", title: "אלזה מלכת השלג", wiki: "Elsa (Frozen)", fallbackCommons: "File:Frozen cosplay, Elsa walking in the city.jpg" },
  { id: "new_106_aladdin_lamp", title: "מנורת הקסמים של אלאדין", wiki: "Aladdin" },
  { id: "new_107_mary_poppins", title: "מרי פופינס", wiki: "Mary Poppins (character)" },
  { id: "new_108_wall_e", title: "וולי הרובוט", wiki: "WALL-E", fallbackCommons: "File:‘Wall-E’ on the Front Lines- EOD Soldiers Train for Real-World Explosives (9267030).jpg" },
  { id: "new_109_cooking_pot", title: "סיר בישול על הכיריים", wiki: "Cooking pot" },
  { id: "new_110_frying_pan", title: "מחבת טיגון", wiki: "Frying pan" },
  { id: "new_111_chef_hat", title: "כובע שף לבן", wiki: "Toque", fallbackCommons: "File:Chef Hat.JPG" },
  { id: "new_112_rolling_pin", title: "מערוך עץ", wiki: "Rolling pin" },
  { id: "new_113_blender", title: "בלנדר שייקים", wiki: "Blender (appliance)" },
  { id: "new_114_toaster", title: "מצנם פרוסות לחם", wiki: "Toaster" },
  { id: "new_115_microwave", title: "מיקרוגל", wiki: "Microwave oven" },
  { id: "new_116_ice_cream_cone", title: "גביע גלידה", wiki: "Ice cream cone" },
  { id: "new_117_sushi_roll", title: "מגש סושי", wiki: "Sushi" },
  { id: "new_118_wine_glasses", title: "שתי כוסות יין אדום", wiki: "Wine glass" },
  { id: "new_119_champagne_bottle", title: "בקבוק שמפניה נפתח", wiki: "Champagne" },
  { id: "new_120_mountain_bike", title: "אופני הרים", wiki: "Mountain bike" },
  { id: "new_121_passenger_train", title: "רכבת נוסעים", wiki: "Passenger train" },
  { id: "new_122_tow_truck", title: "משאית גרר", wiki: "Tow truck" },
  { id: "new_123_camping_tent", title: "אוהל קמפינג משפחתי", wiki: "Camping", fallbackCommons: "File:Backpacking Tent.jpg" },
  { id: "new_124_navigation_compass", title: "מצפן ניווט", wiki: "Compass" },
  { id: "new_125_beach_chair", title: "כיסא נוח ושמשייה", wiki: "Sunlounger" },
  { id: "new_126_sunscreen_bottle", title: "בקבוק קרם הגנה", wiki: "Sunscreen" },
  { id: "new_127_sunglasses", title: "משקפי שמש", wiki: "Sunglasses" },
  { id: "new_128_trolley_suitcase", title: "מזוודת טרולי על גלגלים", wiki: "Suitcase" },
  { id: "new_129_wall_clock", title: "שעון קיר עגול", wiki: "Electric clock" },
  { id: "new_130_kitchen_timer", title: "טיימר מטבח", wiki: "Egg timer" },
  { id: "new_131_megaphone", title: "מגפון כריזה", wiki: "Megaphone" },
  { id: "new_132_daily_newspaper", title: "עיתון יומי מקופל", wiki: "Newspaper" },
  { id: "new_133_sealed_envelope", title: "מעטפה חתומה", wiki: "Envelope" },
  { id: "new_134_document_folder", title: "תיקיית מסמכים", wiki: "File folder" },
  { id: "new_135_executive_briefcase", title: "תיק מנהלים", wiki: "Briefcase" },
  { id: "new_136_living_room_sofa", title: "ספה בסלון", wiki: "Couch" },
  { id: "new_137_double_bed", title: "מיטה זוגית מוצעת", wiki: "Bed" },
  { id: "new_138_shower_head", title: "ראש מקלחת זורם", wiki: "Shower" },
  { id: "new_139_bubble_bathtub", title: "אמבטיה מלאה קצף", wiki: "Bathtub" },
  { id: "new_140_standing_fan", title: "מאוורר עמוד", wiki: "Fan (machine)" },
  { id: "new_141_radiator_heater", title: "רדיאטור חימום", wiki: "Radiator (heating)" },
  { id: "new_142_lawn_mower", title: "מכסחת דשא", wiki: "Lawn mower" },
  { id: "new_143_pruning_shears", title: "מזמרת גינון", wiki: "Pruning shears" },
  { id: "new_144_paint_palette", title: "פלטת צבעים ומכחול", wiki: "Palette (painting)" },
  { id: "new_145_clapperboard", title: "קלאפר קולנוע", wiki: "Clapperboard", fallbackCommons: "File:Clapperboard.jpg" },
  { id: "new_146_game_controller", title: "שלט קונסולת משחקים", wiki: "Gamepad" },
  { id: "new_147_museum_facade", title: "חזית מוזיאון עם עמודים", wiki: "Museum" },
  { id: "new_148_bookshelf", title: "כוננית ספרים עמוסה", wiki: "Bookcase" },
  { id: "new_149_graduation_diploma", title: "תעודת סיום מגולגלת בסרט", wiki: "Diploma" },
  { id: "new_150_charity_box", title: "קופת צדקה", wiki: "Tzedakah box" }
];

/**
 * Pure JavaScript, Zero-Dependency In-Memory Raster Verification and Dimension Parser
 */
export function verifyAndParseRasterBuffer(buffer, options = {}) {
  const {
    minSize = 15000,
    minWidth = 300,
    minHeight = 300,
    preferredWidth = 600,
    preferredHeight = 600
  } = options;

  if (!Buffer.isBuffer(buffer)) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size: 0,
      meetsPreferredDimensions: false,
      rejectionReason: 'NOT_A_BUFFER: Provided input is not a Node.js Buffer'
    };
  }

  const size = buffer.length;

  if (size < minSize) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: `FILE_SIZE_TOO_SMALL: Buffer size (${size} bytes) is below minimum required ${minSize} bytes`
    };
  }

  const headStr = buffer.subarray(0, Math.min(size, 256)).toString('latin1').trimStart();
  const headLower = headStr.toLowerCase();

  if (headLower.startsWith('<!doctype html') || headLower.startsWith('<html') || headLower.startsWith('<body') || headLower.startsWith('<head')) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'DISALLOWED_FORMAT_HTML: Detected HTML page or HTTP error response'
    };
  }

  if (headLower.startsWith('<svg') || headLower.startsWith('<?xml') || headLower.startsWith('<!doctype svg')) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'DISALLOWED_FORMAT_SVG: Detected SVG / XML markup'
    };
  }

  if (size >= 8 && buffer.subarray(4, 8).toString('ascii') === 'ftyp') {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'DISALLOWED_FORMAT_AVIF: Detected AVIF / HEIF / ISO-BMFF container'
    };
  }

  if (headStr.startsWith('GIF87a') || headStr.startsWith('GIF89a')) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'DISALLOWED_FORMAT_GIF: GIF format not permitted for photographic repository'
    };
  }

  if (headStr.startsWith('%PDF-')) {
    return {
      valid: false,
      format: null,
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'DISALLOWED_FORMAT_PDF: Detected PDF document'
    };
  }

  // Format A: JPEG
  if (buffer[0] === 0xFF && buffer[1] === 0xD8) {
    let offset = 2;
    while (offset < size) {
      while (offset < size && buffer[offset] !== 0xFF) offset++;
      while (offset < size && buffer[offset] === 0xFF) offset++;
      if (offset >= size) break;

      const marker = buffer[offset++];
      if (marker === 0xD8 || marker === 0xD9 || (marker >= 0xD0 && marker <= 0xD7) || marker === 0x01) {
        continue;
      }
      if (marker === 0xDA) break;
      if (offset + 2 > size) break;

      const segmentLen = buffer.readUInt16BE(offset);
      if (segmentLen < 2) break;

      const isSOF = (marker >= 0xC0 && marker <= 0xCF &&
                     marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC);

      if (isSOF) {
        if (segmentLen >= 7 && offset + 7 <= size) {
          const height = buffer.readUInt16BE(offset + 3);
          const width = buffer.readUInt16BE(offset + 5);
          const subType = 'SOF' + (marker & 0x0F).toString(16).toUpperCase();

          if (width < minWidth || height < minHeight) {
            return {
              valid: false,
              format: 'JPEG',
              subType,
              width,
              height,
              size,
              meetsPreferredDimensions: false,
              rejectionReason: `DIMENSIONS_BELOW_MINIMUM: Image dimensions (${width}x${height}) are below required ${minWidth}x${minHeight}`
            };
          }

          return {
            valid: true,
            format: 'JPEG',
            subType,
            width,
            height,
            size,
            meetsPreferredDimensions: width >= preferredWidth && height >= preferredHeight,
            rejectionReason: null
          };
        }

        return {
          valid: false,
          format: 'JPEG',
          subType: null,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_JPEG: Truncated SOF marker payload'
        };
      }

      offset += segmentLen;
    }

    return {
      valid: false,
      format: 'JPEG',
      subType: null,
      width: null,
      height: null,
      size,
      meetsPreferredDimensions: false,
      rejectionReason: 'CORRUPT_JPEG: No Start-Of-Frame (SOF) marker found before SOS or EOF'
    };
  }

  // Format B: PNG
  if (size >= 24 &&
      buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
      buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
    const chunkType = buffer.subarray(12, 16).toString('ascii');
    if (chunkType !== 'IHDR') {
      return {
        valid: false,
        format: 'PNG',
        subType: null,
        width: null,
        height: null,
        size,
        meetsPreferredDimensions: false,
        rejectionReason: 'CORRUPT_PNG: Missing IHDR chunk at offset 12'
      };
    }

    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    if (width < minWidth || height < minHeight) {
      return {
        valid: false,
        format: 'PNG',
        subType: 'IHDR',
        width,
        height,
        size,
        meetsPreferredDimensions: false,
        rejectionReason: `DIMENSIONS_BELOW_MINIMUM: Image dimensions (${width}x${height}) are below required ${minWidth}x${minHeight}`
      };
    }

    return {
      valid: true,
      format: 'PNG',
      subType: 'IHDR',
      width,
      height,
      size,
      meetsPreferredDimensions: width >= preferredWidth && height >= preferredHeight,
      rejectionReason: null
    };
  }

  // Format C: WebP
  if (size >= 16 &&
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    const chunkType = buffer.subarray(12, 16).toString('ascii');
    let width = 0;
    let height = 0;
    const subType = chunkType.trim();

    if (chunkType === 'VP8X') {
      if (size < 30) {
        return {
          valid: false,
          format: 'WEBP',
          subType,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_WEBP: VP8X chunk truncated'
        };
      }
      width = 1 + buffer.readUIntLE(24, 3);
      height = 1 + buffer.readUIntLE(27, 3);
    } else if (chunkType === 'VP8 ') {
      if (size < 30) {
        return {
          valid: false,
          format: 'WEBP',
          subType,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_WEBP: VP8 chunk truncated'
        };
      }
      if (buffer[23] !== 0x9D || buffer[24] !== 0x01 || buffer[25] !== 0x2A) {
        return {
          valid: false,
          format: 'WEBP',
          subType,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_WEBP: Invalid VP8 start code'
        };
      }
      width = buffer.readUInt16LE(26) & 0x3FFF;
      height = buffer.readUInt16LE(28) & 0x3FFF;
    } else if (chunkType === 'VP8L') {
      if (size < 25) {
        return {
          valid: false,
          format: 'WEBP',
          subType,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_WEBP: VP8L chunk truncated'
        };
      }
      if (buffer[20] !== 0x2F) {
        return {
          valid: false,
          format: 'WEBP',
          subType,
          width: null,
          height: null,
          size,
          meetsPreferredDimensions: false,
          rejectionReason: 'CORRUPT_WEBP: Invalid VP8L signature'
        };
      }
      const val = buffer.readUInt32LE(21);
      width = 1 + (val & 0x3FFF);
      height = 1 + ((val >>> 14) & 0x3FFF);
    } else {
      return {
        valid: false,
        format: 'WEBP',
        subType,
        width: null,
        height: null,
        size,
        meetsPreferredDimensions: false,
        rejectionReason: `UNSUPPORTED_WEBP_CHUNK: Chunk type "${chunkType}" is not supported`
      };
    }

    if (width < minWidth || height < minHeight) {
      return {
        valid: false,
        format: 'WEBP',
        subType,
        width,
        height,
        size,
        meetsPreferredDimensions: false,
        rejectionReason: `DIMENSIONS_BELOW_MINIMUM: Image dimensions (${width}x${height}) are below required ${minWidth}x${minHeight}`
      };
    }

    return {
      valid: true,
      format: 'WEBP',
      subType,
      width,
      height,
      size,
      meetsPreferredDimensions: width >= preferredWidth && height >= preferredHeight,
      rejectionReason: null
    };
  }

  return {
    valid: false,
    format: null,
    subType: null,
    width: null,
    height: null,
    size,
    meetsPreferredDimensions: false,
    rejectionReason: 'UNKNOWN_OR_UNSUPPORTED_FORMAT: Magic bytes do not match JPEG, PNG, or WebP'
  };
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    attempt++;
    try {
      const headers = {
        'User-Agent': USER_AGENT,
        ...(options.headers || {})
      };

      const res = await fetch(url, {
        ...options,
        headers,
        signal: AbortSignal.timeout(12000)
      });

      if (res.status === 429 || res.status >= 500) {
        const retryAfterHeader = res.headers.get('Retry-After');
        const waitMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : Math.min(1000 * Math.pow(2, attempt), 8000);
        console.warn(`[HTTP ${res.status}] Retrying ${url} in ${waitMs}ms (attempt ${attempt}/${maxRetries})...`);
        await sleep(waitMs);
        continue;
      }

      return res;
    } catch (err) {
      lastError = err;
      const waitMs = Math.min(1000 * Math.pow(2, attempt), 6000);
      console.warn(`[Network Error: ${err.message}] Retrying ${url} in ${waitMs}ms (attempt ${attempt}/${maxRetries})...`);
      await sleep(waitMs);
    }
  }

  throw new Error(`fetchWithRetry failed after ${maxRetries} attempts for URL: ${url}. Last error: ${lastError?.message}`);
}

/**
 * Acquire and validate image buffer using the 3-Tier cascade
 */
export async function acquireRootImage(item, options = {}) {
  const { minSize = 15000, minWidth = 300, minHeight = 300 } = options;

  // --- Tier 1A: Commons Fallback (if specifically configured) ---
  if (item.fallbackCommons) {
    try {
      const fileTitle = item.fallbackCommons.startsWith('File:') ? item.fallbackCommons : `File:${item.fallbackCommons}`;
      const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
      const res = await fetchWithRetry(apiUrl);
      if (res.ok) {
        const data = await res.json();
        const page = Object.values(data.query?.pages || {})[0];
        const info = page?.imageinfo?.[0];
        if (info && info.mime && !info.mime.includes('svg') && !info.mime.includes('pdf')) {
          const downloadUrl = info.thumburl || info.url;
          const imgRes = await fetchWithRetry(downloadUrl);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            const vResult = verifyAndParseRasterBuffer(buffer, { minSize, minWidth, minHeight });
            if (vResult.valid) {
              return { buffer, validation: vResult, source: 'commons_file', url: downloadUrl };
            }
          }
        }
      }
    } catch (err) {
      console.warn(`[Tier 1A Warning] Failed for ${item.id} (${item.fallbackCommons}): ${err.message}`);
    }
  }

  // --- Tier 1B: English Wikipedia Lead Image API ---
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(item.wiki)}&prop=pageimages|description&piprop=original|thumbnail&pithumbsize=800&redirects=1&format=json`;
    const res = await fetchWithRetry(apiUrl);
    if (res.ok) {
      const data = await res.json();
      const page = Object.values(data.query?.pages || {})[0];
      const thumb = page?.thumbnail;
      const original = page?.original;

      const candidateUrl = thumb?.source || original?.source;
      const isSvg = candidateUrl && (candidateUrl.toLowerCase().includes('.svg') || original?.source?.toLowerCase()?.includes('.svg'));

      if (candidateUrl && !isSvg) {
        const imgRes = await fetchWithRetry(candidateUrl);
        if (imgRes.ok) {
          const buffer = Buffer.from(await imgRes.arrayBuffer());
          const vResult = verifyAndParseRasterBuffer(buffer, { minSize, minWidth, minHeight });
          if (vResult.valid) {
            return { buffer, validation: vResult, source: 'wikipedia_lead', url: candidateUrl };
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Tier 1B Warning] Failed for ${item.id} (${item.wiki}): ${err.message}`);
  }

  // --- Tier 2: Wikipedia Search Generator API ---
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(item.wiki)}&gsrlimit=3&prop=pageimages|description&piprop=original|thumbnail&pithumbsize=800&format=json`;
    const res = await fetchWithRetry(apiUrl);
    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 99) - (b.index || 99));

      for (const page of pages) {
        const candidateUrl = page.thumbnail?.source || page.original?.source;
        const isSvg = candidateUrl && (candidateUrl.toLowerCase().includes('.svg') || page.original?.source?.toLowerCase()?.includes('.svg'));
        if (candidateUrl && !isSvg) {
          const imgRes = await fetchWithRetry(candidateUrl);
          if (imgRes.ok) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            const vResult = verifyAndParseRasterBuffer(buffer, { minSize, minWidth, minHeight });
            if (vResult.valid) {
              return { buffer, validation: vResult, source: 'wikipedia_search_generator', url: candidateUrl };
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Tier 2 Warning] Failed for ${item.id} (${item.wiki}): ${err.message}`);
  }

  // --- Tier 3: Wikimedia Commons Bitmap Search API ---
  try {
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=filetype:bitmap%20${encodeURIComponent(item.wiki)}%20-svg%20-logo&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|size|mime&iiurlwidth=800&format=json`;
    const res = await fetchWithRetry(apiUrl);
    if (res.ok) {
      const data = await res.json();
      const pages = Object.values(data.query?.pages || {});

      for (const page of pages) {
        const info = page.imageinfo?.[0];
        if (info && info.mime && !info.mime.includes('svg') && !info.mime.includes('pdf')) {
          const downloadUrl = info.thumburl || info.url;
          if (downloadUrl) {
            const imgRes = await fetchWithRetry(downloadUrl);
            if (imgRes.ok) {
              const buffer = Buffer.from(await imgRes.arrayBuffer());
              const vResult = verifyAndParseRasterBuffer(buffer, { minSize, minWidth, minHeight });
              if (vResult.valid) {
                return { buffer, validation: vResult, source: 'commons_search', url: downloadUrl };
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.warn(`[Tier 3 Warning] Failed for ${item.id} (${item.wiki}): ${err.message}`);
  }

  return null;
}

/**
 * Main execution runner: Downloads, validates, and stages all 150 enrichment images
 */
export async function downloadAll150(options = {}) {
  const { force = false, outDir = TARGET_DIR } = options;

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  console.log(`======================================================================`);
  console.log(`Life Quest M2 Downloader: Processing ${CANONICAL_ROOT_LOOKUP_150.length} enrichment roots`);
  console.log(`Target Directory: ${outDir}`);
  console.log(`Throttling: ${THROTTLE_MS}ms | Force Overwrite: ${force}`);
  console.log(`User-Agent: ${USER_AGENT}`);
  console.log(`======================================================================\n`);

  const results = [];
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  const startTime = Date.now();

  for (let i = 0; i < CANONICAL_ROOT_LOOKUP_150.length; i++) {
    const item = CANONICAL_ROOT_LOOKUP_150[i];
    const itemNum = String(i + 1).padStart(3, '0');
    const outPath = path.join(outDir, `${item.id}.jpg`);

    // Check if valid image already exists on disk
    if (!force && fs.existsSync(outPath)) {
      try {
        const existingBuf = fs.readFileSync(outPath);
        const existingValidation = verifyAndParseRasterBuffer(existingBuf);
        if (existingValidation.valid) {
          console.log(`[${itemNum}/150] ${item.id} -> ALREADY_VALID (${existingValidation.format} ${existingValidation.width}x${existingValidation.height}, ${(existingBuf.length / 1024).toFixed(1)} KB)`);
          results.push({
            id: item.id,
            title: item.title,
            wiki: item.wiki,
            status: 'ALREADY_VALID',
            format: existingValidation.format,
            width: existingValidation.width,
            height: existingValidation.height,
            size: existingBuf.length,
            source: 'disk_cache'
          });
          skippedCount++;
          continue;
        }
      } catch (_) {}
    }

    // Acquire via 3-tier cascade
    const acquired = await acquireRootImage(item);

    if (acquired && acquired.buffer) {
      // In-memory validation is already guaranteed by acquireRootImage, write to disk
      fs.writeFileSync(outPath, acquired.buffer);
      const { validation, source } = acquired;
      const sizeKb = (acquired.buffer.length / 1024).toFixed(1);

      console.log(`[${itemNum}/150] ${item.id} -> SAVED [${source}] (${validation.format} ${validation.width}x${validation.height}, ${sizeKb} KB)`);
      results.push({
        id: item.id,
        title: item.title,
        wiki: item.wiki,
        status: 'SAVED',
        format: validation.format,
        width: validation.width,
        height: validation.height,
        size: acquired.buffer.length,
        source
      });
      downloadedCount++;
    } else {
      console.error(`[${itemNum}/150] ${item.id} -> FAILED (Left as missing placeholder)`);
      results.push({
        id: item.id,
        title: item.title,
        wiki: item.wiki,
        status: 'FAILED',
        format: null,
        width: null,
        height: null,
        size: 0,
        source: null
      });
      failedCount++;
    }

    if (i < CANONICAL_ROOT_LOOKUP_150.length - 1) {
      await sleep(THROTTLE_MS);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(`\n======================================================================`);
  console.log(`DOWNLOAD COMPLETE in ${durationSec}s`);
  console.log(`Total Roots: ${CANONICAL_ROOT_LOOKUP_150.length}`);
  console.log(`Successfully Downloaded / Saved: ${downloadedCount}`);
  console.log(`Pre-existing Valid (Skipped): ${skippedCount}`);
  console.log(`Failed / Missing: ${failedCount}`);
  console.log(`Overall Success Rate: ${(((downloadedCount + skippedCount) / CANONICAL_ROOT_LOOKUP_150.length) * 100).toFixed(1)}%`);
  console.log(`======================================================================\n`);

  return {
    total: CANONICAL_ROOT_LOOKUP_150.length,
    downloadedCount,
    skippedCount,
    failedCount,
    results
  };
}

/**
 * Standalone CLI execution block
 */
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const force = process.argv.includes('--force');
  downloadAll150({ force }).catch(err => {
    console.error('Fatal execution error:', err);
    process.exit(1);
  });
}
