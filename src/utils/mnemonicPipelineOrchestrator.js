/**
 * LifeQuest Mnemonic Synergy Pipeline Orchestrator
 * 
 * מתאם 5 עובדים מתמחים (Specialized Workers / Skills) בסינרגיה מלאה:
 * 
 * 1. מומחה האסוציאציות (Mnemonic Anchor Specialist):
 *    מפיק 5 עוגנים חיים, חושיים ופעילים עבור כל משימה (לעולם לא החפץ עצמו!).
 * 
 * 2. שומר המאגר המקומי (Local Pool Curator):
 *    בודק קודם כל במאגר המקומי ובמאגר המשתמש (Pool-First) לשליפה מיידית ב-0ms.
 * 
 * 3. ארכיטקט חיפוש התמונות (Visual Search Architect):
 *    מתרגם עוגנים חסרים לשאילתות צילום פוטוגרפיות באנגלית ומסנן רעשי רשת/פרסומות.
 * 
 * 4. הסופר הראשי (The Author):
 *    מחבר את 5 העוגנים שנבחרו למשפט מסע עלילתי שלם וקולח לארמון.
 * 
 * 5. מנהל המשוב והלמידה (Contextual Feedback Manager):
 *    משמר הצלחות (👍) כעוגני מאגר קבועים ופוסל חיבורים ספציפיים (👎) לפי הקשר בלבד.
 */

import { searchPopularWebImages } from './webImageSearch.js';
import { getGeminiApiKey } from './geminiLiveEngine.js';
import { 
  findUserImageByKeyword, 
  approveAndSaveMnemonicImage, 
  dislikeAndRemoveMnemonicImage,
  isAssociationDisliked 
} from './userImageRepository.js';
import { generateDynamicFallbackCard } from './deterministicStoryEngine.js';

// ============================================================================
// עובד 1: מאגר אסוציאציות עוגנים מנמוניים (Mnemonic Anchor Specialist)
// ============================================================================
export const MNEMONIC_ANCHOR_CATALOG = {
  // תספורת / להסתפר / מספרה
  'תספורת': {
    concept: 'תספורת',
    synonyms: ['להסתפר', 'תספורת', 'מספרה', 'ספר', 'פדיקור', 'מניקור', 'ספרית'],
    associations: [
      {
        anchorName: 'אדוארד בעל ידי מספריים מפסל ומספר ✂️🌿',
        searchQuery: 'אדוארד ידי מספריים תספורת',
        englishQuery: 'edward scissorhands cutting hair',
        emoji: '✂️',
        explanation: 'אדוארד בעל ידי המספריים מניף את ידי המספריים שלו ומספר בדיוק מופלא — לעולם לא תשכח ללכת להסתפר!',
        imageUrl: '/staged_images/pool/edward_scissorhands_hands.jpg'
      },
      {
        anchorName: 'אייס ונטורה והבלורית המפוסלת המפורסמת 🦚✨',
        searchQuery: 'אייס ונטורה בלורית שיער',
        englishQuery: 'ace ventura iconic hair style portrait',
        emoji: '🦚',
        explanation: 'אייס ונטורה עם בלורית השיער המפוסלת והגבוהה ביותר בהיסטוריה שממחישה מיד תספורת ועיצוב שיער!',
        imageUrl: '/staged_images/pool/ace_ventura_hair.jpg'
      },
      {
        anchorName: 'שמשון הגיבור ודלילה הגוזרת את מחלפות ראשו 🦁✂️',
        searchQuery: 'שמשון ודלילה תספורת ציור',
        englishQuery: 'samson and delilah classic painting haircut',
        emoji: '🦁',
        explanation: 'דלילה גוזרת בחשאי את מחלפות שערותיו של שמשון הגיבור וממחישה מיד את חובת התספורת!',
        imageUrl: null
      },
      {
        anchorName: 'עמוד מספרה וינטג\' מסתובב באדום-לבן 💈✨',
        searchQuery: 'עמוד מספרה פסים מסתובב',
        englishQuery: 'vintage barbershop pole rotating stripes classic',
        emoji: '💈',
        explanation: 'עמוד הפסים המסתובב המפורסם מנצנץ ברחוב ומסמן את היעד להסתפר!',
        imageUrl: null
      },
      {
        anchorName: 'ספר צמרת במספרה קלאסית עם מספריים ✂️💈',
        searchQuery: 'ספר במספרה קלאסית מספריים',
        englishQuery: 'classic vintage barber haircut shears portrait photography',
        emoji: '✂️',
        explanation: 'ספר מקצועי מניף מספריים מעל כיסא עור במספרת וינטג\' קלאסית!',
        imageUrl: '/staged_images/pool/barber_classic_shears.jpg'
      }
    ]
  },

  // מכנסיים / בגדים
  'מכנסיים': {
    concept: 'מכנסיים',
    synonyms: ['מכנסיים', 'מכנס', 'מכנסי', 'בגדים', 'ג\'ינס', 'חולצה', 'להחזיר מכנסיים'],
    associations: [
      {
        anchorName: 'מכנסי ג\'ינס כחולים קלאסיים עם תפרים כפולים 👖',
        searchQuery: 'מכנסי ג\'ינס כחולים',
        englishQuery: 'blue denim jeans folded classic clothing store photography',
        emoji: '👖',
        explanation: 'מכנסי ג\'ינס איכותיים מכופלים בחנות בגדים אופנתית — עוגן מובהק למכנסיים!',
        imageUrl: '/staged_images/pool/classic_blue_denim_jeans.jpg'
      },
      {
        anchorName: 'חליפת טוקסידו יוקרתית עם מכנסיים מחויטים 🤵',
        searchQuery: 'חליפת טוקסידו מכנסיים',
        englishQuery: 'mens formal tuxedo suit trousers elegant fashion photography',
        emoji: '🤵',
        explanation: 'מכנסיים מחויטים של חליפת ערב אלגנטית ומגוהצת למשעי!',
        imageUrl: null
      },
      {
        anchorName: 'קאובוי ג\'ון מרסטון עם שלייקס מעור 🤠',
        searchQuery: 'קאובוי שלייקס',
        englishQuery: 'cowboy suspenders leather vest wild west portrait',
        emoji: '🤠',
        explanation: 'קאובוי קשוח עם שלייקס עור ומכנסי רכיבה בבר במערב הפרוע!',
        imageUrl: '/staged_images/pool/john_marston_cowboy.jpg'
      },
      {
        anchorName: 'וודי הקאובוי עם חגורת אקדחים ושלייקס 🤠⭐',
        searchQuery: 'וודי קאובוי צעצוע',
        englishQuery: 'woody cowboy belt boots toy sheriff',
        emoji: '⭐',
        explanation: 'וודי השריף מותח את חגורת המכנסיים שלו בגאווה וצועד במגפיו!',
        imageUrl: null
      },
      {
        anchorName: 'אלביס פרסלי בחליפת הפעמון הלבנה 🕺🎸',
        searchQuery: 'אלביס חליפה פעמון',
        englishQuery: 'elvis presley white jumpsuit flared trousers stage',
        emoji: '🕺',
        explanation: 'מלך הרוקנרול אלביס במכנסי הפעמון הנוצצים רוקד ומטריף את הקהל!',
        imageUrl: null
      },
      {
        anchorName: 'גנדי בלבוש הבד המסורתי 🕊️🧘',
        searchQuery: 'גנדי בד לבן',
        englishQuery: 'mahatma gandhi traditional white cloth peaceful',
        emoji: '🕊️',
        explanation: 'מהטמה גנדי צועד בבגד הבד הלבן המפורסם במצעד המלח!',
        imageUrl: '/staged_images/pool/mahatma_gandhi.jpg'
      }
    ]
  },

  // נעליים
  'נעליים': {
    concept: 'נעליים',
    synonyms: ['נעליים', 'נעל', 'נעלי', 'סניקרס', 'מגפיים', 'סנדלים'],
    associations: [
      {
        anchorName: 'וינסנט וגה רוקד ומחליק בנעליים בטוויסט 🕺👞',
        searchQuery: 'ריקוד נעליים טוויסט',
        englishQuery: 'vincent vega dance shoes floor pulp fiction',
        emoji: '👞',
        explanation: 'וינסנט וגה מבצע את ריקוד הטוויסט המפורסם ומחליק בנעלי העור שלו על הרחבה — לעולם לא תשכח לקנות נעליים חדשות!',
        imageUrl: '/staged_images/pool/vincent_vega_dance.jpg'
      },
      {
        anchorName: 'יוסיין בולט מזנק בנעלי הריצה המוזהבות ⚡🏃',
        searchQuery: 'יוסיין בולט נעלי ריצה',
        englishQuery: 'usain bolt golden running shoes lightning pose track',
        emoji: '⚡',
        explanation: 'האיש המהיר בעולם בנעלי ריצה מוזהבות מציג את תנועת הברק המפורסמת!',
        imageUrl: '/staged_images/pool/usain_bolt_lightning_pose.jpg'
      },
      {
        anchorName: 'החתול במגפיים נועל מגפי עור ענקיות 👢🐱',
        searchQuery: 'החתול במגפיים',
        englishQuery: 'puss in boots leather boots sword hero',
        emoji: '👢',
        explanation: 'החתול במגפיים המפורסם צועד בגאווה במגפי העור הגדולות שלו!',
        imageUrl: '/staged_images/pool/puss_in_boots_eyes.jpg'
      },
      {
        anchorName: 'מייקל ג\'ורדן מתעופף בנעלי אייר ג\'ורדן 🏀🔴',
        searchQuery: 'מייקל גורדן נעליים סל',
        englishQuery: 'michael jordan flying air sneakers slam dunk red bull',
        emoji: '🏀',
        explanation: 'מייקל ג\'ורדן מתעופף באוויר בנעלי האייר האגדיות שלו להטבעה מרהיבה!',
        imageUrl: '/staged_images/pool/michael_jordan_slam_dunk.jpg'
      },
      {
        anchorName: 'רוג\'ר פדרר מחליק בנעלי טניס על הדשא 🎾🌱',
        searchQuery: 'רוגר פדרר טניס נעליים',
        englishQuery: 'roger federer grass tennis shoes wimbledon match',
        emoji: '🎾',
        explanation: 'רוג\'ר פדרר בנעלי טניס לבנות מושלמות מחליק על משטח הדשא הירוק!',
        imageUrl: '/staged_images/pool/roger_federer_wimbledon.jpg'
      }
    ]
  },

  // שוקולד / ממתקים
  'שוקולד': {
    concept: 'שוקולד',
    synonyms: ['שוקולד', 'שוקולית', 'ממתקים', 'ממתק', 'עוגה', 'קינוח'],
    associations: [
      {
        anchorName: 'ווילי וונקה בפתח מפעל השוקולד 🎩🍫',
        searchQuery: 'ווילי וונקה מפעל שוקולד',
        englishQuery: 'willy wonka chocolate factory top hat purple coat',
        emoji: '🎩',
        explanation: 'ווילי וונקה בכובע צילינדר ומעיל סגול מזמין אותך למפעל השוקולד האגדי — לעולם לא תשכח לקנות שוקולד!',
        imageUrl: '/staged_images/pool/willy_wonka_chocolate.jpg'
      },
      {
        anchorName: 'ווילי וונקה המקורי מחזיק שוקולד מוזהב 🍫✨',
        searchQuery: 'ווילי וונקה שוקולד זהב',
        englishQuery: 'willy wonka golden ticket chocolate bar gene wilder',
        emoji: '🍫',
        explanation: 'ווילי וונקה חושף את כרטיס הזהב הנוצץ בתוך לוח שוקולד ענק!',
        imageUrl: '/staged_images/pool/willy_wonka_gene_wilder.jpg'
      },
      {
        anchorName: 'קוקי מונסטר בטירוף של מתוקים 🍪💙',
        searchQuery: 'קוקי מונסטר מתוקים עוגיות',
        englishQuery: 'cookie monster eating sweets blue puppet',
        emoji: '🍪',
        explanation: 'מפלצת העוגיות הכחולה זוללת מתוקים בהתלהבות מדבקת שאי אפשר לשכוח!',
        imageUrl: '/staged_images/pool/cookie_monster_sesame.jpg'
      },
      {
        anchorName: 'פדינגטון הדב זולל ריבה מתוקה 🐻🍯',
        searchQuery: 'פדינגטון דב ריבה',
        englishQuery: 'paddington bear marmalade jar sweet sandwich',
        emoji: '🐻',
        explanation: 'הדב החמוד פדינגטון שולף כריך ריבה מתוק מתוך כובעו האדום!',
        imageUrl: '/staged_images/pool/paddington_bear_marmalade.jpg'
      },
      {
        anchorName: 'עוגיפלצת פותח קופסת שוקולד ענקית 🎁🍫',
        searchQuery: 'עוגיפלצת קופסת שוקולד',
        englishQuery: 'cookie monster chocolate box feast joyful',
        emoji: '🎁',
        explanation: 'עוגיפלצת מקבל חבילת שוקולדים עטופה בסרט אדום ושואג בשמחה!',
        imageUrl: null
      }
    ]
  },

  // גלידה / ארטיק / קינוח קר
  'גלידה': {
    concept: 'גלידה',
    synonyms: ['גלידה', 'ארטיק', 'טילון', 'אוטו גלידה', 'לאכול גלידה'],
    associations: [
      {
        anchorName: 'גביע גלידה איטלקית עם כדורים צבעוניים 🍦🍓',
        searchQuery: 'גביע גלידה כדורים צבעוניים',
        englishQuery: 'ice cream cone scoops colorful delicious sweet dessert photography',
        emoji: '🍦',
        explanation: 'גביע וופל פריך עם כדורי גלידה צבעוניים שנוטפים מתיקות ורעננות!',
        imageUrl: '/staged_images/pool/colorful_ice_cream_cone.jpg'
      },
      {
        anchorName: 'קערת סאנדיי גלידה עם קצפת ודובדבן 🍨🍒',
        searchQuery: 'סאנדיי גלידה קצפת דובדבן',
        englishQuery: 'ice cream sundae whipped cream cherry glass cup photography',
        emoji: '🍨',
        explanation: 'מנת גלידה חגיגית עם הר קצפת ודובדבן אדום בראשו!',
        imageUrl: '/staged_images/pool/ice_cream_sundae_cherry.jpg'
      },
      {
        anchorName: 'אוטו גלידה מנגן ברחוב 🚐🍦',
        searchQuery: 'אוטו גלידה וינטג',
        englishQuery: 'vintage ice cream truck colorful music outdoor photography',
        emoji: '🚐',
        explanation: 'אוטו גלידה קלאסי עם מנגינה שמחה שמושכת את כולם!',
        imageUrl: '/staged_images/pool/mia_wallace_milkshake.jpg'
      },
      {
        anchorName: 'גביע וופל בלגי חם עם כדור גלידה 🧇🍦',
        searchQuery: 'וופל בלגי עם גלידה',
        englishQuery: 'belgian waffle ice cream scoop melting sweet photography',
        emoji: '🧇',
        explanation: 'וופל בלגי חם וטרי עם כדור גלידה קריר שנמס מעליו!',
        imageUrl: '/staged_images/pool/mia_wallace_milkshake.jpg'
      },
      {
        anchorName: 'ארטיק קרח פירות מרענן וצבעוני 🍧☀️',
        searchQuery: 'ארטיק קרח פירות',
        englishQuery: 'fruit popsicle ice pop colorful summer refreshing photography',
        emoji: '🍧',
        explanation: 'ארטיק קרח טרופי בצבעי הקשת שמצנן כל יום קיץ חם!',
        imageUrl: null
      }
    ]
  },

  // טיפוס / קיר טיפוס / טיפוס הרים
  'טיפוס': {
    concept: 'טיפוס',
    synonyms: ['טיפוס', 'לטפס', 'קיר טיפוס', 'טיפוס הרים', 'בולדרינג', 'מטפס'],
    associations: [
      {
        anchorName: 'מטפס הרים תלוי על צוק סלע נישא 🧗🏔️',
        searchQuery: 'מטפס הרים צוק סלע',
        englishQuery: 'rock climber climbing cliff mountain extreme sport photography',
        emoji: '🧗',
        explanation: 'מטפס נועז תלוי על צוק הרים אדיר ומפגין עוצמה ודיוק — עוגן מושלם לטיפוס!',
        imageUrl: null
      },
      {
        anchorName: 'ספיידרמן מטפס בזריזות על קיר גורד שחקים 🕷️🏙️',
        searchQuery: 'ספיידרמן מטפס קיר',
        englishQuery: 'spiderman crawling climbing skyscraper wall superhero action',
        emoji: '🕷️',
        explanation: 'איש העכביש מטפס על קירות אנכיים בקלות ובזריזות מדהימה!',
        imageUrl: '/staged_images/pool/spider_man.jpg'
      },
      {
        anchorName: 'סולם מתקפל ניצב אל מול קיר גבוה 🪜',
        searchQuery: 'סולם מתקפל',
        englishQuery: 'stepladder standing tall reaching high photography',
        emoji: '🪜',
        explanation: 'סולם מתכת איתן שמאפשר לטפס ולהגיע לכל גובה!',
        imageUrl: '/staged_images/pool/item_359_סולם_מתקפל.jpg'
      },
      {
        anchorName: 'אדם מטפס על קיר טיפוס צבעוני 🧗‍♂️',
        searchQuery: 'קיר טיפוס בולדרינג',
        englishQuery: 'indoor rock climbing gym colorful grips bouldering photography',
        emoji: '🧗‍♂️',
        explanation: 'אחיזות טיפוס צבעוניות על קיר בולדרינג מקצועי!',
        imageUrl: null
      },
      {
        anchorName: 'גביע זהב והישג מנצח של אלופים 🏆',
        searchQuery: 'גביע זהב ניצחון',
        englishQuery: 'golden victory trophy cup shining photography',
        emoji: '🏆',
        explanation: 'גביע ההישג שמסמל הגעה לפסגה הגבוהה ביותר!',
        imageUrl: '/staged_images/pool/item_169_גביע_זהב_עם_ידיות__מסמל.jpg'
      }
    ]
  },

  // מגן מסך / מסך / מגן
  'מגן מסך': {
    concept: 'מגן מסך',
    synonyms: ['מגן מסך', 'מגן', 'מסך', 'זכוכית מגן', 'מגן לסמארטפון'],
    associations: [
      {
        anchorName: 'מגן אבירים מוזהב מנצנץ וחסין שברים 🛡️⚔️',
        searchQuery: 'מגן אבירים מוזהב',
        englishQuery: 'golden knight medieval shield steel protective armour photography',
        emoji: '🛡️',
        explanation: 'מגן פלדה וזהב שמגן וחוצץ מפני כל פגיעה — עוגן בלתי נשכח למגן מסך!',
        imageUrl: null
      },
      {
        anchorName: 'קפטן אמריקה מרים את מגן הוויברניום החסין 🛡️⭐',
        searchQuery: 'קפטן אמריקה מגן',
        englishQuery: 'captain america vibranium shield circular superhero battle portrait',
        emoji: '🛡️',
        explanation: 'קפטן אמריקה אוחז במגן העגול החסין ביותר בעולם שמגן על המסך!',
        imageUrl: null
      },
      {
        anchorName: 'מגן מסך זכוכית מחוסמת נדבק לסמארטפון 📱🛡️',
        searchQuery: 'מגן מסך זכוכית סמארטפון',
        englishQuery: 'tempered glass screen protector phone display scratch resistant photography',
        emoji: '📱',
        explanation: 'שכבת זכוכית חזקה וצלולה שנצמדת ושומרת על המסך מכל שריטה!',
        imageUrl: null
      },
      {
        anchorName: 'משקפי מגן שקופים נגד רסיסים 🥽',
        searchQuery: 'משקפי מגן שקופים',
        englishQuery: 'safety protective glasses clear lenses laboratory photography',
        emoji: '🥽',
        explanation: 'עדשות מגן מיוחדות המבטיחות הגנה מושלמת!',
        imageUrl: '/staged_images/pool/item_373_משקפי_קריאה.jpg'
      },
      {
        anchorName: 'סמארטפון מודרני בעל מסך זכוכית בוהק 📱✨',
        searchQuery: 'סמארטפון מסך זוהר',
        englishQuery: 'modern smartphone glowing black display glass reflection photography',
        emoji: '📱',
        explanation: 'מסך סמארטפון יוקרתי ונקי מכל שבר ושריטה!',
        imageUrl: null
      }
    ]
  },

  // כובע / לקחת את הכובע / כובעים
  'כובע': {
    concept: 'כובע',
    synonyms: ['כובע', 'כובעים', 'לקחת את הכובע', 'כובע קסקט', 'כובע טמבל', 'פדורה'],
    associations: [
      {
        anchorName: 'שרלוק הולמס במעיל וכובע בלשים קלאסי 🕵️‍♂️🔍',
        searchQuery: 'שרלוק הולמס כובע בלש',
        englishQuery: 'sherlock holmes deerstalker hat detective trench coat vintage photography',
        emoji: '🕵️‍♂️',
        explanation: 'הבלש שרלוק הולמס בכובע הבלשים המפורסם בעולם — עוגן אגדי לכובע!',
        imageUrl: '/staged_images/pool/sherlock_cumberbatch.jpg'
      },
      {
        anchorName: 'קאובוי עם כובע בוקרים רחב שוליים 🤠🌵',
        searchQuery: 'קאובוי כובע בוקרים',
        englishQuery: 'cowboy wide brim hat western outlaw classic portrait photography',
        emoji: '🤠',
        explanation: 'קאובוי קשוח חובש כובע בוקרים עור רחב ומביט אל האופק!',
        imageUrl: '/staged_images/pool/john_marston_cowboy.jpg'
      },
      {
        anchorName: 'כובע צילינדר קסום של קוסם במה 🎩✨',
        searchQuery: 'כובע צילינדר קוסם',
        englishQuery: 'magician black top hat silk formal antique photography',
        emoji: '🎩',
        explanation: 'כובע צילינדר שחור וגבוה שממנו שולפים שפנים וקסמים!',
        imageUrl: '/staged_images/pool/item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן_מציץ__מסמל.jpg'
      },
      {
        anchorName: 'כובע קסקט וינטג\' אופנתי 🧢',
        searchQuery: 'כובע קסקט בייסבול',
        englishQuery: 'baseball cap hat casual cotton outdoor photography',
        emoji: '🧢',
        explanation: 'כובע מצחייה קלאסי שמגן מהשמש ומוכן ליציאה לבסיס!',
        imageUrl: '/staged_images/pool/sherlock_cumberbatch.jpg'
      },
      {
        anchorName: 'כובע טמבל ישראלי קלאסי 👒☀️',
        searchQuery: 'כובע טמבל בד',
        englishQuery: 'bucket hat cotton sun outdoor summer photography',
        emoji: '👒',
        explanation: 'כובע בד קיצי ונוח ששומר עליך מכל חום ושמש!',
        imageUrl: '/staged_images/pool/john_marston_cowboy.jpg'
      }
    ]
  },

  // גלישה / לגלוש / גולש גלים
  'גלישה': {
    concept: 'גלישה',
    synonyms: ['גלישה', 'לגלוש', 'גלשן', 'גולש', 'לגלוש מחר', 'גלישת גלים'],
    associations: [
      {
        anchorName: 'גולש גלים רוכב על גל ענק באוקיינוס 🏄🌊',
        searchQuery: 'גולש גלים גל ענק ים',
        englishQuery: 'surfer riding huge ocean barrel wave surfboard dynamic action photography',
        emoji: '🏄',
        explanation: 'גולש גלים מקצועי חותך גל אדיר ומתיז רסס מים לבן — עוגן מדהים לגלישה!',
        imageUrl: null
      },
      {
        anchorName: 'גלשן גלים צבעוני תקוע בחול בחוף הים 🏄‍♂️🏖️',
        searchQuery: 'גלשן גלים חוף ים',
        englishQuery: 'colorful surfboard resting on sandy beach tropical ocean sunny photography',
        emoji: '🏄‍♂️',
        explanation: 'גלשן צבעוני שמחכה על החוף המוזהב לטבילה במים!',
        imageUrl: null
      },
      {
        anchorName: 'גולש סנובורד טס על שלג לבן במדרון 🏂❄️',
        searchQuery: 'גולש סנובורד שלג',
        englishQuery: 'snowboarder carving powder snow mountain winter sports action photography',
        emoji: '🏂',
        explanation: 'סנובורדיסט גולש במהירות מסחררת במדרון המושלג!',
        imageUrl: null
      },
      {
        anchorName: 'מגדלור על שפת הים מול הגלים הגבוהים 🌊🏮',
        searchQuery: 'מגדלור גלים סערה',
        englishQuery: 'lighthouse ocean waves splashing dramatic sea coast photography',
        emoji: '🏮',
        explanation: 'מגדלור עתיק ניצב בגאון מול גלי הים השוצפים!',
        imageUrl: null
      },
      {
        anchorName: 'דולפין מקפץ מתוך גלי האוקיינוס 🐬🌊',
        searchQuery: 'דולפין גלים ים',
        englishQuery: 'dolphin jumping out of ocean waves water splash sunny photography',
        emoji: '🐬',
        explanation: 'דולפין שמח מקפץ מתוך המים הכחולים לצד הגלשנים!',
        imageUrl: null
      }
    ]
  },

  // ילדה / גן / בית ספר
  'ילדה': {
    concept: 'ילדה',
    synonyms: ['ילדה', 'גן', 'ילד', 'ילדים', 'פעוט', 'תינוק', 'בית ספר', 'לאסוף את הילדה'],
    associations: [
      {
        anchorName: 'מרי פופינס מרחפת עם מטרייה לאסוף את הילדה ☂️✨',
        searchQuery: 'מרי פופינס מטריה ילדים',
        englishQuery: 'mary poppins flying umbrella magical nanny bag',
        emoji: '☂️',
        explanation: 'מרי פופינס מרחפת מן השמיים עם מטרייה פתוחה בדיוק כדי לאסוף את הילדה מהגן בזמן!',
        imageUrl: '/staged_images/pool/mary_poppins_umbrella.jpg'
      },
      {
        anchorName: 'פדינגטון הדב מחכה עם מזוודה ליד שער הגן 🐻🧳',
        searchQuery: 'פדינגטון הדב מזוודה ילד',
        englishQuery: 'paddington bear suitcase red hat school gate',
        emoji: '🐻',
        explanation: 'פדינגטון הדב החמוד עם מגפיו ומזוודתו הקטנה מחכה בסבלנות ליד שער הגן!',
        imageUrl: '/staged_images/pool/paddington_bear_marmalade.jpg'
      },
      {
        anchorName: 'הנסיכה אנה עם גלימה סגולה בדרך לממלכה ❄️👸',
        searchQuery: 'הנסיכה אנה גלימה',
        englishQuery: 'princess anna cape frozen adventure outdoor',
        emoji: '❄️',
        explanation: 'הנסיכה אנה השמחה והאמיצה צועדת במרץ עם גלימת החורף שלה!',
        imageUrl: '/staged_images/pool/anna_frozen_cape.jpg'
      },
      {
        anchorName: 'אלאדין טס על מרבד הקסמים 🧞‍♂️✨',
        searchQuery: 'אלאדין מרבד קסמים טיסה',
        englishQuery: 'aladdin magic carpet flying fantasy sky',
        emoji: '🧞‍♂️',
        explanation: 'אלאדין טס על שטיח מעופף שמגיע במהירות לכל יעד של הילדים!',
        imageUrl: '/staged_images/pool/aladdin_prince_ali.jpg'
      },
      {
        anchorName: 'מנורת הקסמים המוזהבת של אלאדין 🪔',
        searchQuery: 'מנורת קסמים מוזהבת',
        englishQuery: 'aladdin golden magic lamp genie smoke fantasy',
        emoji: '🪔',
        explanation: 'מנורת קסמים מוזהבת שמתוכה יוצא ענן קסום שמגשים כל משאלה!',
        imageUrl: '/staged_images/pool/aladdin_magic_lamp_gold.jpg'
      }
    ]
  },

  // קריוקי / שירה / מוזיקה
  'קריוקי': {
    concept: 'קריוקי',
    synonyms: ['קריוקי', 'הקריוקי', 'לשיר', 'שירה', 'מיקרופון', 'פזמון', 'מסיבת קריוקי'],
    associations: [
      {
        anchorName: 'פרדי מרקיורי שר בהתלהבות למיקרופון באצטדיון 🎤👑',
        searchQuery: 'פרדי מרקיורי שר מיקרופון במה',
        englishQuery: 'freddie mercury singing live microphone stadium concert',
        emoji: '🎤',
        explanation: 'פרדי מרקיורי מרעיד את האצטדיון בשירה עוצמתית לתוך המיקרופון — תמונה שמחשמלת את המוח לזכור את הקריוקי!',
        imageUrl: '/staged_images/pool/queen_freddie_mercury_wembley.jpg'
      },
      {
        anchorName: 'אלביס פרסלי מלך הרוקנרול שר במיקרופון 🕺🎙️',
        searchQuery: 'אלביס פרסלי מיקרופון וינטג',
        englishQuery: 'elvis presley holding vintage microphone singing portrait',
        emoji: '🎙️',
        explanation: 'אלביס מלך הרוקנרול אוחז במיקרופון ושר לקהל בהופעה חיה ובלתי נשכחת!',
        imageUrl: '/staged_images/pool/elvis_presley_king.jpg'
      },
      {
        anchorName: 'מייקל ג\'קסון שר ורוקד במונווק המפורסם 🧤✨',
        searchQuery: 'מייקל גקסון שר מונווק',
        englishQuery: 'michael jackson moonwalk singing stage performance',
        emoji: '🧤',
        explanation: 'מייקל ג\'קסון שר ומחליק לאחור במונווק מול אולם מריע — עוגן שאי אפשר לשכוח!',
        imageUrl: '/staged_images/pool/michael_jackson_moonwalk.jpg'
      },
      {
        anchorName: 'מיק ג\'אגר שר ומקפיץ את הקהל בהופעה 🎸👅',
        searchQuery: 'מיק גאגר שר במה',
        englishQuery: 'mick jagger singing stones concert live microphone',
        emoji: '🎸',
        explanation: 'מיק ג\'אגר מניף את המיקרופון ושר בטירוף על הבמה!',
        imageUrl: '/staged_images/pool/mick_jagger_stones.jpg'
      },
      {
        anchorName: 'להקת הביטלס שרה יחד במעבר החצייה 🎵🚶‍♂️',
        searchQuery: 'הביטלס מעבר חציה',
        englishQuery: 'the beatles abbey road crossing singing',
        emoji: '🎵',
        explanation: 'ארבעת המופלאים צועדים ושרים את להיטי הענק שהפכו לקלאסיקות קריוקי!',
        imageUrl: '/staged_images/pool/the_beatles_abbey_road_crossing.jpg'
      }
    ]
  },

  // כדורגל / ספורט
  'כדורגל': {
    concept: 'כדורגל',
    synonyms: ['כדורגל', 'כדור', 'משחק', 'אימון', 'ספורט', 'לשחק כדורגל'],
    associations: [
      {
        anchorName: 'ליאו מסי מניף את גביע העולם 🏆🇦🇷',
        searchQuery: 'מסי גביע העולם הנפה',
        englishQuery: 'lionel messi world cup trophy celebration golden ball',
        emoji: '🏆',
        explanation: 'ליאו מסי מניף את גביע העולם המוזהב באושר עילאי ומזכיר את משחק הכדורגל!',
        imageUrl: '/staged_images/pool/lionel_messi_world_cup.jpg'
      },
      {
        anchorName: 'כריסטיאנו רונאלדו בחגיגת ה-SIUUU המפורסמת ⚡⚪',
        searchQuery: 'רונאלדו חגיגת שער סיו',
        englishQuery: 'cristiano ronaldo siu goal celebration jump stadium',
        emoji: '⚡',
        explanation: 'כריסטיאנו רונאלדו מזנק באוויר בחגיגת ה-SIU המסורתית שלו מול אצטדיון רועש!',
        imageUrl: '/staged_images/pool/cristiano_ronaldo_siu.jpg'
      },
      {
        anchorName: 'ג\'אנלואיג\'י בופון מזנק בטירוף לחיבורים 🧤⚽',
        searchQuery: 'בופון שוער כדורגל זינוק',
        englishQuery: 'gianluigi buffon goalkeeper save diving soccer match',
        emoji: '🧤',
        explanation: 'השוער האגדי בופון מתעופף באוויר והודף כדור מקו השער באצטדיון גועש — תמונה שמחשמלת את המוח לשחק כדורגל!',
        imageUrl: '/staged_images/pool/gianluigi_buffon_keeper.jpg'
      },
      {
        anchorName: 'דייוויד בקהאם מסובב בעיטה חופשית לחיבורים 🎯⚽',
        searchQuery: 'דייוויד בקהאם בעיטה חופשית',
        englishQuery: 'david beckham free kick curve ball grass match',
        emoji: '🎯',
        explanation: 'דייוויד בקהאם בועט כדור מסובב אגדי שנעצר רק בתוך רשת החיבורים!',
        imageUrl: '/staged_images/pool/david_beckham_freekick.jpg'
      },
      {
        anchorName: 'אנדרס אינייסטה חוגג שער ניצחון דרמטי 🇪🇸💥',
        searchQuery: 'אינייסטה שער ניצחון מונדיאל',
        englishQuery: 'andres iniesta world cup winning goal celebration dramatic',
        emoji: '🇪🇸',
        explanation: 'אינייסטה קורע את החולצה ורץ באקסטזה לאחר שער ניצחון בלתי נשכח בדקה ה-116!',
        imageUrl: '/staged_images/pool/andres_iniesta_goal.jpg'
      }
    ]
  },

  // ניקיון / לנקות / לסדר
  'ניקיון': {
    concept: 'ניקיון',
    synonyms: ['ניקיון', 'לנקות', 'לסדר', 'לשטוף', 'ספונג\'ה', 'לנקות את החדר', 'סדר', 'חדר', 'לנקות חדר', 'ניקיון חדר', 'לסדר חדר', 'לסדר את החדר'],
    associations: [
      {
        anchorName: 'סינדרלה מקרצפת את הרצפה עם דלי וסבון 🧼🏰',
        searchQuery: 'סינדרלה מנקה רצפה',
        englishQuery: 'cinderella scrubbing floor soap bubbles bucket classic fairy tale portrait',
        emoji: '🧼',
        explanation: 'סינדרלה האגדית מקרצפת את הרצפה בסבון ומים עד שהיא נוצצת כמו ראי — תמונה בלתי נשכחת שמזכירה לנקות את החדר!',
        imageUrl: '/staged_images/pool/cinderella.jpg'
      },
      {
        anchorName: 'מטאטא ויעה לניקיון יסודי של החדר 🧹',
        searchQuery: 'מטאטא ויעה ניקיון',
        englishQuery: 'broom and dustpan sweeping floor clean room photography',
        emoji: '🧹',
        explanation: 'מטאטא ויעה אוספים את כל האבק והלכלוך החוצה ומחזירים את הסדר לחדר!',
        imageUrl: '/staged_images/pool/item_358_מטאטא_ומגרוד.jpg'
      },
      {
        anchorName: 'בובספוג מכנסמרובע מקרצף בהתלהבות עם קצף 🧽✨',
        searchQuery: 'בובספוג מנקה ספוג',
        englishQuery: 'spongebob cleaning scrubbing joyfully bubbles sponge cartoon',
        emoji: '🧽',
        explanation: 'בובספוג הספוג הצהוב מבריק את כל החדר בחיוך ענק וקצף סבון!',
        imageUrl: '/staged_images/pool/spongebob.jpg'
      },
      {
        anchorName: 'מרי פופינס מסדרת את החדר בנקישת אצבע קסומה ☂️✨',
        searchQuery: 'מרי פופינס מטריה חדר ילדים',
        englishQuery: 'mary poppins tidy room snap magic toys fly photography',
        emoji: '☂️',
        explanation: 'מרי פופינס נוקשת באצבע וכל הבלגן בחדר עף ומתיישר באורח פלא למקום!',
        imageUrl: '/staged_images/pool/mary_poppins_umbrella.jpg'
      },
      {
        anchorName: 'פח אשפה גדול מסלק את כל הלכלוך 🗑️',
        searchQuery: 'פח אשפה גדול',
        englishQuery: 'trash bin open lid tidy garbage clean room photography',
        emoji: '🗑️',
        explanation: 'פח אשפה ענק פתוח בולע את כל השקיות והפסולת ומותיר חדר מבריק!',
        imageUrl: '/staged_images/pool/item_192_פח_אשפה_עם_מכסה_חצי_פתוח__מסמל.jpg'
      }
    ]
  },

  // כביסה / בגדים
  'כביסה': {
    concept: 'כביסה',
    synonyms: ['כביסה', 'לכבס', 'לתלות כביסה', 'לקפל כביסה', 'מכונת כביסה'],
    associations: [
      {
        anchorName: 'מכונת כביסה מסתחררת עם בועות סבון 🫧🧺',
        searchQuery: 'מכונת כביסה בועות',
        englishQuery: 'washing machine spinning soap bubbles laundry clean photography',
        emoji: '🫧',
        explanation: 'מכונת הכביסה מסתובבת ומקציפה בועות סבון ריחניות שמזכירות לכבס!',
        imageUrl: '/staged_images/pool/item_377_מכונת_תפירה_ישנה.jpg'
      },
      {
        anchorName: 'מגהץ אדים חם מחליק בגדים 👔♨️',
        searchQuery: 'מגהץ אדים בגדים',
        englishQuery: 'steam iron pressing shirt hot laundry photography',
        emoji: '♨️',
        explanation: 'מגהץ אדים חם מעלה ענני אדים ומיישר כל קמט בבגדים!',
        imageUrl: '/staged_images/pool/item_376_מגהץ_אדים.jpg'
      },
      {
        anchorName: 'קולב בגדים ממתכת בארון 👔',
        searchQuery: 'קולב בגדים מתכת',
        englishQuery: 'clothes hanger closet wardrobe photography',
        emoji: '👔',
        explanation: 'קולב מתכת מבריק מוכן לתליית הבגדים המכובסים והנקיים!',
        imageUrl: '/staged_images/pool/item_200_קולב_בגדים_ממתכת__מסמל.jpg'
      },
      {
        anchorName: 'סבון רחצה וקצף ניקיון 🧼',
        searchQuery: 'סבון רחצה קצף',
        englishQuery: 'soap bar foam bubbles clean fresh photography',
        emoji: '🧼',
        explanation: 'סבון ריחני עם קצף עשיר שמשדר ניקיון ורעננות לכל הבגדים!',
        imageUrl: '/staged_images/pool/item_369_סבון_מוצק_בתוך_קצף.jpg'
      },
      {
        anchorName: 'בובספוג מכנסמרובע מותח מכנסיים נקיים 🧽👖',
        searchQuery: 'בובספוג מכנסיים',
        englishQuery: 'spongebob squarepants clean clothes joyful',
        emoji: '👖',
        explanation: 'בובספוג לובש את המכנסיים המרובעים המכובסים שלו בגאווה!',
        imageUrl: '/staged_images/pool/spongebob.jpg'
      }
    ]
  },

  // מדחום / בדיקת חום / רופא
  'מדחום': {
    concept: 'מדחום',
    synonyms: ['מדחום', 'מד חום', 'חום', 'להחזיר את המדחום', 'תרמומטר', 'בדיקת חום', 'מדידת חום'],
    associations: [
      {
        anchorName: 'מד חום כספית רפואי מתפוצץ מרוב חום 🌡️💥',
        searchQuery: 'מד חום כספית מתפוצץ',
        englishQuery: 'vintage mercury thermometer fever bursting heat glass photography',
        emoji: '🌡️',
        explanation: 'מד חום כספית קלאסי שמתפוצץ מרוב חום אדום — תמונה בלתי נשכחת שמזכירה מיד להחזיר את המדחום!',
        imageUrl: '/staged_images/pool/item_165_מד_חום_של_כספית_מתפוצץ_למעלה__מסמל.jpg'
      },
      {
        anchorName: 'סטטוסקופ רפואי של רופא מנתח 🩺👨‍⚕️',
        searchQuery: 'סטטוסקופ רפואי רופא',
        englishQuery: 'stethoscope medical doctor equipment clinical photography',
        emoji: '🩺',
        explanation: 'סטטוסקופ מתכת בוהק של רופא בודק דופק וחום — עוגן מרפאתי מובהק!',
        imageUrl: '/staged_images/pool/stethoscope_doctor_tool.jpg'
      },
      {
        anchorName: 'דוקטור סטריינג\' פותח שער אנרגיה בוער 🔮🌀',
        searchQuery: 'דוקטור סטריינג קסם אש',
        englishQuery: 'doctor strange mystic magic portal sparks glowing portrait',
        emoji: '🔮',
        explanation: 'דוקטור סטריינג\' מעלה גיצים לוהטים ומזכיר את הבדיקה הרפואית!',
        imageUrl: '/staged_images/pool/doctor_strange_magic.jpg'
      },
      {
        anchorName: 'דוקטור אוקטופוס עם זרועות מכניות לוהטות 🐙🦾',
        searchQuery: 'דוקטור אוקטופוס זרועות',
        englishQuery: 'doctor octopus mechanical tentacles metallic portrait action',
        emoji: '🐙',
        explanation: 'הדוקטור בעל זרועות הפלדה בודק ומחזיק חפצים בכוח עצום!',
        imageUrl: '/staged_images/pool/doctor_octopus_otto.jpg'
      },
      {
        anchorName: 'סנופי השוכב על גג המלונה עם מדחום 🐶🌡️',
        searchQuery: 'סנופי מלונה אדומה',
        englishQuery: 'snoopy on red doghouse cute peaceful cartoon classic',
        emoji: '🐶',
        explanation: 'סנופי החמוד נח על גג המלונה האדומה ומחלים בנחת!',
        imageUrl: '/staged_images/pool/snoopy_doghouse_peanuts.jpg'
      }
    ]
  },

  // אנימה / כנס אנימה / קוספליי
  'אנימה': {
    concept: 'אנימה',
    synonyms: ['אנימה', 'כנס אנימה', 'מנגה', 'קוספליי', 'ללכת לכנס אנימה', 'אוטאקו', 'יפן', 'קומיקס'],
    associations: [
      {
        anchorName: 'פיקאצ\'ו פולט מכת ברק וניצוצות חשמל ⚡🐭',
        searchQuery: 'פיקאצ\'ו ברק צהוב',
        englishQuery: 'pikachu electric spark lightning cheeks joyful anime icon',
        emoji: '⚡',
        explanation: 'פיקאצ\'ו האגדי טוען 100,000 וולט ומחשמל את כנס האנימה — בלתי נשכח!',
        imageUrl: '/staged_images/pool/pikachu_electric_mouse.jpg'
      },
      {
        anchorName: 'גוקו סופר סאיין בשיער זהוב ולהבות צ\'י 🥋🔥',
        searchQuery: 'גוקו סופר סאיין דרגון בול',
        englishQuery: 'goku super saiyan golden hair energy aura dragon ball anime',
        emoji: '🔥',
        explanation: 'גוקו הופך לסופר סאיין עם הילת אנרגיה אגדית שמסעירה את כל חובבי האנימה!',
        imageUrl: '/staged_images/pool/goku_super_saiyan.jpg'
      },
      {
        anchorName: 'מונקי די לופי בכובע הקש של שודדי הים 👒🏴‍☠️',
        searchQuery: 'לופי כובע קש וואן פיס',
        englishQuery: 'luffy straw hat one piece pirate smile action portrait',
        emoji: '👒',
        explanation: 'לופי מנהיג כובעי הקש מוואן פיס מחייך ומזנק להרפתקה בכנס!',
        imageUrl: '/staged_images/pool/luffy_straw_hat_pirate.jpg'
      },
      {
        anchorName: 'נארוטו אוזומאקי רץ בתנוחת נינג\'ה של קונוהה 🍥🥋',
        searchQuery: 'נארוטו נינג\'ה ראסנגאן',
        englishQuery: 'naruto uzumaki ninja headband orange suit energetic anime portrait',
        emoji: '🍥',
        explanation: 'הנינג\'ה האהוב בעולם נארוטו רץ קדימה עם סרט המצח של כפר העלה!',
        imageUrl: '/staged_images/pool/naruto_uzumaki_hokage.jpg'
      },
      {
        anchorName: 'טוטורו הענק עומד בגשם עם מטרייה בתחנת אוטובוס 🌳☔',
        searchQuery: 'טוטורו ענק מטריה יער',
        englishQuery: 'totoro giant forest spirit holding leaf umbrella studio ghibli',
        emoji: '🌳',
        explanation: 'רוח היער טוטורו עומד לצדך עם עלה ומטרייה בעולם המופלא של סטודיו ג\'יבלי!',
        imageUrl: '/staged_images/pool/totoro_umbrella_bus.jpg'
      }
    ]
  },

  // מכתב / כתיבה / הודעה
  'מכתב': {
    concept: 'מכתב',
    synonyms: ['מכתב', 'כתיבה', 'לכתוב', 'הודעה', 'לשלוח', 'מייל', 'סמס', 'לסמס', 'פתק', 'לכתוב לרונה', 'רונה'],
    associations: [
      {
        anchorName: 'נוצה מוזהבת וקסת דיו עתיקה של סופרים 🪶📜',
        searchQuery: 'נוצה וקסת דיו עתיקה',
        englishQuery: 'vintage feather quill pen inkwell antique parchment paper photography',
        emoji: '🪶',
        explanation: 'נוצת דיו מעוצבת וקסת זכוכית עתיקה על מגילת קלף — תמונה מובהקת שמזכירה מיד לכתוב את ההודעה!',
        imageUrl: '/staged_images/pool/feather_quill_inkwell.jpg'
      },
      {
        anchorName: 'מכונת כתיבה רמינגטון וינטג\' מתקתקת ⌨️📄',
        searchQuery: 'מכונת כתיבה רמינגטון וינטג',
        englishQuery: 'vintage remington typewriter mechanical keys paper photography',
        emoji: '⌨️',
        explanation: 'מכונת כתיבה קלאסית של סופרים עם מקשים מכניים ודף נייר מודפס שממחישה כתיבה ומסר!',
        imageUrl: '/staged_images/pool/typewriter_remington_vintage.jpg'
      },
      {
        anchorName: 'תחות אל הכתיבה והסופרים המצרי עם קולמוס 🪶🏛️',
        searchQuery: 'תחות אל הכתיבה פפירוס',
        englishQuery: 'thoth ibis ancient egyptian god writing scribe hieroglyphs statue',
        emoji: '🏛️',
        explanation: 'אל החוכמה והסופרים תחות אוחז קולמוס עתיק ומתעד מכתבים וכתבים לנצח!',
        imageUrl: '/staged_images/pool/thoth_ibis_scribe.jpg'
      },
      {
        anchorName: 'ויליאם שייקספיר כותב מחזה על מגילת קלף 📜🎭',
        searchQuery: 'שייקספיר כותב מחזה נוצה',
        englishQuery: 'william shakespeare portrait writing play quill historic painting',
        emoji: '📜',
        explanation: 'שייקספיר הדגול שקוע בכתיבת מכתב אהבה ומחזה בלתי נשכח!',
        imageUrl: null
      },
      {
        anchorName: 'מטוס נייר מקופל מוטס למסירת הודעה ✈️💌',
        searchQuery: 'מטוס נייר מקופל מכתב',
        englishQuery: 'folded paper airplane letter note flying photography',
        emoji: '💌',
        explanation: 'מטוס נייר מקופל מרחף באוויר ומוסר הודעה אישית ומרגשת אל היעד!',
        imageUrl: null
      }
    ]
  },

  // בייבלייד / טורניר בייבלייד / סביבונים
  'בייבלייד': {
    concept: 'בייבלייד',
    synonyms: ['בייבלייד', 'טורניר בייבלייד', 'סביבון', 'זירה', 'סביבונים', 'קרב סביבונים'],
    associations: [
      {
        anchorName: 'טייפון וסופת הוריקן מסתחררת בעוצמה 🌀🌪️',
        searchQuery: 'סופת טורנדו מסתחררת',
        englishQuery: 'spinning hurricane vortex cyclone storm high speed powerful photography',
        emoji: '🌀',
        explanation: 'סופת טייפון אדירה מסתחררת במהירות עצומה כמו בייבלייד משוגע בזירה!',
        imageUrl: '/staged_images/pool/item_286_סופת_טורנדו.jpg'
      },
      {
        anchorName: 'גלגל ענק מסתובב באורות זוהרים 🎡',
        searchQuery: 'גלגל ענק אורות לילה',
        englishQuery: 'ferris wheel spinning colorful lights amusement park photography',
        emoji: '🎡',
        explanation: 'גלגל ענק מסתובב בתנופה מתמדת וממחיש את הסיבוב המנצח!',
        imageUrl: '/staged_images/pool/item_332_גלגל_ענק.jpg'
      },
      {
        anchorName: 'פיקאצ\'ו פולט מכת ברק מחשמלת לזירה ⚡🐭',
        searchQuery: 'פיקאצ\'ו ברק צהוב',
        englishQuery: 'pikachu electric spark lightning cheeks joyful anime icon',
        emoji: '⚡',
        explanation: 'פיקאצ\'ו מחשמל את זירת הבייבלייד באנרגיה אדירה!',
        imageUrl: '/staged_images/pool/pikachu_electric_mouse.jpg'
      },
      {
        anchorName: 'גביע זהב של אלופי הטורניר 🏆',
        searchQuery: 'גביע זהב ניצחון',
        englishQuery: 'golden champion victory trophy cup shining photography',
        emoji: '🏆',
        explanation: 'גביע הניצחון המוזהב שמחכה לאלוף טורניר הבייבלייד!',
        imageUrl: '/staged_images/pool/item_169_גביע_זהב_עם_ידיות__מסמל.jpg'
      },
      {
        anchorName: 'סביבון קרב מסתחרר בזירת לחימה 🌀⚡',
        searchQuery: 'סביבון מסתחרר זירה',
        englishQuery: 'spinning top toy motion blur colorful arena competition action photography',
        emoji: '🌀',
        explanation: 'סביבון מתכת מהיר מסתחרר ומתיז ניצוצות בדרך לניצחון!',
        imageUrl: '/staged_images/pool/item_286_סופת_טורנדו.jpg'
      }
    ]
  },

  // מילקי / מעדן מילקי שוקולד וקצפת (לעולם לא כלב!)
  'מילקי': {
    concept: 'מילקי',
    synonyms: ['מילקי', 'לצאת עם מילקי', 'לטייל עם מילקי', 'מעדן מילקי', 'פודינג מילקי', 'שוקולד מילקי', 'קצפת מילקי', 'גביע מילקי'],
    associations: [
      {
        anchorName: 'מעדן שוקולד עשיר עם הר קצפת אוורירית 🍮🥛',
        searchQuery: 'מילקשייק קצפת שוקולד',
        englishQuery: 'chocolate pudding whipped cream dessert glass spoon delicious photography',
        emoji: '🍮',
        explanation: 'כוס מעדן שוקולד שמוצפת בהר קצפת אוורירית ומפתה — עוגן בלתי נשכח למילה מילקי!',
        imageUrl: '/staged_images/pool/mia_wallace_milkshake.jpg'
      },
      {
        anchorName: 'ווילי וונקה ממפעל השוקולד והקינוחים 🍫🎩',
        searchQuery: 'ווילי וונקה שוקולד',
        englishQuery: 'willy wonka chocolate factory top hat candy fantasy photography',
        emoji: '🍫',
        explanation: 'ווילי וונקה שולף ממעבדת הממתקים שלו מעדן שוקולד וקצפת קסום!',
        imageUrl: '/staged_images/pool/willy_wonka_chocolate.jpg'
      },
      {
        anchorName: 'גביע קינוח שוקולד מוצף בשמנת מתוקה עם כפית 🍨',
        searchQuery: 'גביע שוקולד קצפת כפית',
        englishQuery: 'chocolate dessert cup rich whipped cream swirl layered spoon photography',
        emoji: '🍨',
        explanation: 'גביע קינוח שוקולד עם כפית נעוצה עמוק בקצפת הלבנה!',
        imageUrl: '/staged_images/pool/mia_wallace_milkshake.jpg'
      },
      {
        anchorName: 'קוקי מונסטר בטירוף של ממתקים ושוקולד 🍪💙',
        searchQuery: 'קוקי מונסטר שוקולד',
        englishQuery: 'cookie monster chocolate feast joyful blue puppet photography',
        emoji: '🍪',
        explanation: 'מפלצת העוגיות פותחת מארז שוקולד חלומי וזוללת בהנאה!',
        imageUrl: null
      },
      {
        anchorName: 'מפל שוקולד חם נמזג על קינוח קצפת 🍫♨️',
        searchQuery: 'מפל שוקולד חם קינוח',
        englishQuery: 'chocolate fountain waterfall pouring rich melted cocoa photography',
        emoji: '♨️',
        explanation: 'מפל שוקולד חם זורם ומשתלב בקצפת אוורירית וטעימה!',
        imageUrl: '/staged_images/pool/willy_wonka_chocolate.jpg'
      }
    ]
  },

  // רקס / טירנוזאורוס רקס / דינוזאור (לעולם לא כלב!)
  'רקס': {
    concept: 'רקס',
    synonyms: ['רקס', 'לצאת עם רקס', 'לרדת עם רקס', 'לטייל עם רקס', 'טי רקס', 'טירקס', 'דינוזאור'],
    associations: [
      {
        anchorName: 'טי-רקס (T-Rex) אדיר שואג ביער פרהיסטורי 🦖💥',
        searchQuery: 'טי רקס דינוזאור שואג',
        englishQuery: 'tyrannosaurus rex roaring dinosaur prehistoric jungle massive photography',
        emoji: '🦖',
        explanation: 'טירנוזאורוס רקס אדיר פוער מלתעות ושואג ביער — עוגן מושלם ועוצמתי לשם רקס!',
        imageUrl: '/staged_images/pool/tyrannosaurus_rex_dinosaur.jpg'
      },
      {
        anchorName: 'יושי הדינוזאור הירוק מקפץ בשמחה 🦕',
        searchQuery: 'יושי דינוזאור ירוק',
        englishQuery: 'yoshi green dinosaur jumping happy fantasy game icon',
        emoji: '🦕',
        explanation: 'יושי הדינוזאור הירוק מקפץ ושולף לשון שובבה!',
        imageUrl: '/staged_images/pool/yoshi_dinosaur.jpg'
      },
      {
        anchorName: 'טריצרטופס משוריין עם 3 קרניים 🦏',
        searchQuery: 'טריצרטופס דינוזאור קרניים',
        englishQuery: 'triceratops dinosaur three horns prehistoric museum photography',
        emoji: '🦏',
        explanation: 'טריצרטופס עצום ומרשים פוסע בגאווה!',
        imageUrl: '/staged_images/pool/triceratops_three_horns.jpg'
      },
      {
        anchorName: 'פטרודקטיל ענק פורש כנפיים בשמיים 🦅',
        searchQuery: 'פטרודקטיל דינוזאור מעופף',
        englishQuery: 'pterodactyl flying dinosaur wings sky prehistoric photography',
        emoji: '🦅',
        explanation: 'דינוזאור מעופף ענקי פורש כנפיים ודואה בשמיים מעל הראש!',
        imageUrl: '/staged_images/pool/pterodactyl_flying_dinosaur.jpg'
      },
      {
        anchorName: 'שלד דינוזאור טי-רקס ענק במוזיאון טבע 🏛️🦴',
        searchQuery: 'שלד טי רקס מוזיאון',
        englishQuery: 'tyrannosaurus rex fossil skeleton museum hall dramatic lighting photography',
        emoji: '🦴',
        explanation: 'שלד עצום של טירנוזאורוס רקס ניצב במרכז מוזיאון הטבע ומעורר השתאות!',
        imageUrl: '/staged_images/pool/tyrannosaurus_rex_dinosaur.jpg'
      }
    ]
  },

  // טריקסי / קוסם שעושה טריק / דגני בוקר טריקס (לעולם לא כלב!)
  'טריקסי': {
    concept: 'טריקסי',
    synonyms: ['טריקסי', 'לצאת עם טריקסי', 'לטייל עם טריקסי', 'טריקס', 'טריק', 'קסם'],
    associations: [
      {
        anchorName: 'קוסם שולף שפן לבן מכובע קסמים 🎩🐇',
        searchQuery: 'קוסם שולף שפן כובע קסמים',
        englishQuery: 'magician pulling white rabbit out of black top hat magic trick photography',
        emoji: '🎩',
        explanation: 'קוסם בחליפה שולף שפן לבן מכובע הצילינדר בטריק עוצר נשימה — עוגן מושלם לשם טריקסי!',
        imageUrl: '/staged_images/pool/item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן_מציץ__מסמל.jpg'
      },
      {
        anchorName: 'להטוטן קלפים מקצועי מבצע תרגיל קסם מרהיב 🃏✨',
        searchQuery: 'להטוטן קלפים קסם',
        englishQuery: 'magician playing cards illusion trick close up hands photography',
        emoji: '🃏',
        explanation: 'ידיים זריזות מפרפרות קלפי קסמים באוויר ומבצעות טריק בלתי נתפס!',
        imageUrl: '/staged_images/pool/item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן_מציץ__מסמל.jpg'
      },
      {
        anchorName: 'מטה קסמים מוזהב מתיז ניצוצות וגיצים 🪄⭐',
        searchQuery: 'מטה קסמים כוכבים ניצוצות',
        englishQuery: 'magic wand sparkling glowing stars illusion performance photography',
        emoji: '🪄',
        explanation: 'מטה קסמים מנצנץ ברקים וניצוצות ומחולל פלאים!',
        imageUrl: '/staged_images/pool/item_197_כובע_קוסמים_שחור_וגבוה_עם_שפנפן_מציץ__מסמל.jpg'
      },
      {
        anchorName: 'ארנב דגני בוקר טריקס עם פירות צבעוניים 🥣🍓',
        searchQuery: 'דגני בוקר טריקס צבעוני',
        englishQuery: 'trix cereal fruit loops colorful breakfast bowl milk splash photography',
        emoji: '🥣',
        explanation: 'קערת דגני בוקר צבעוניים בצורות פירות של המותג טריקס!',
        imageUrl: null
      },
      {
        anchorName: 'דוקטור סטריינג\' פותח שער קסמים בוער 🔮🌀',
        searchQuery: 'דוקטור סטריינג קסם אש',
        englishQuery: 'doctor strange mystic magic portal sparks glowing portrait',
        emoji: '🔮',
        explanation: 'דוקטור סטריינג\' מסחרר שער קסום של ניצוצות ומבצע טריק על-טבעי!',
        imageUrl: '/staged_images/pool/doctor_strange_magic.jpg'
      }
    ]
  },

  // יין / כוסית יין / כרם
  'יין': {
    concept: 'יין',
    synonyms: ['יין', 'כוסית יין', 'יין אדום', 'יין לבן', 'בקבוק יין', 'יקב', 'כרם'],
    associations: [
      {
        anchorName: 'בקבוק יין אדום וכוס יין קריסטל 🍷🍇',
        searchQuery: 'יין אדום בקבוק וכוס',
        englishQuery: 'red wine glass bottle winery cellar vineyard photography',
        emoji: '🍷',
        explanation: 'כוס יין קריסטל עם יין בורדו עמוק ובקבוק יין עתיק לצדה!',
        imageUrl: null
      },
      {
        anchorName: 'חבית עץ אלון ביקב עתיק 🍇🍷',
        searchQuery: 'חבית יין יקב',
        englishQuery: 'oak wine barrel rustic winery cellar photography',
        emoji: '🍇',
        explanation: 'חביות עץ אלון ענקיות במרתף יין קסום ועתיק!',
        imageUrl: null
      }
    ]
  },

  // מסעדה / שולחן במסעדה
  'מסעדה': {
    concept: 'מסעדה',
    synonyms: ['מסעדה', 'שולחן במסעדה', 'להזמין שולחן', 'מלצר', 'תפריט'],
    associations: [
      {
        anchorName: 'שולחן ערוך במסעדת שף רומנטית לאור נרות 🍽️🕯️',
        searchQuery: 'שולחן ערוך מסעדה',
        englishQuery: 'romantic restaurant dining table candlelit elegant photography',
        emoji: '🍽️',
        explanation: 'שולחן ערוך ומפואר עם מפה לבנה וסכו"ם מנצנץ במסעדה יוקרתית!',
        imageUrl: null
      },
      {
        anchorName: 'שף מקצועי במטבח פתוח של מסעדה 👨‍🍳🔥',
        searchQuery: 'שף מבשל מסעדה',
        englishQuery: 'restaurant chef cooking gourmet kitchen photography',
        emoji: '👨‍🍳',
        explanation: 'שף במדי טבחים לבנים מצלחת מנת גורמה מרהיבה!',
        imageUrl: null
      }
    ]
  },

  // עלים / גינה / חצר
  'עלים': {
    concept: 'עלים',
    synonyms: ['עלים', 'לגרוף עלים', 'מגרפה', 'עלי שלכת', 'חצר'],
    associations: [
      {
        anchorName: 'מגרפת מתכת גורפת ערימת עלי שלכת זהובים 🍂🧹',
        searchQuery: 'מגרפה עלי שלכת חצר',
        englishQuery: 'garden leaf rake autumn fallen leaves yard photography',
        emoji: '🍂',
        explanation: 'מגרפת גינה גורפת ערימה זהובה וריחנית של עלי שלכת בסתיו!',
        imageUrl: null
      },
      {
        anchorName: 'עלי שלכת כתומים וזהובים ביער 🍁🍂',
        searchQuery: 'עלי שלכת סתיו',
        englishQuery: 'vibrant autumn leaves foliage forest path photography',
        emoji: '🍁',
        explanation: 'שטיח עלי שלכת בוהק בצבעי זהב, נחושת וכתום!',
        imageUrl: null
      }
    ]
  },

  // אופניים / פנצ'ר
  'אופניים': {
    concept: 'אופניים',
    synonyms: ['אופניים', 'פנצ\'ר', 'פנצר באופניים', 'גלגל אופניים', 'לרכוב על אופניים'],
    associations: [
      {
        anchorName: 'אופני הרים ספורטיביים על שביל הרים 🚲⛰️',
        searchQuery: 'אופני הרים ספורט',
        englishQuery: 'mountain bike trail outdoor cycling sports photography',
        emoji: '🚲',
        explanation: 'אופני הרים מקצועיים מוכנים לרכיבת שטח מהירה!',
        imageUrl: null
      },
      {
        anchorName: 'גלגל אופניים ומשאבת אוויר 🚲💨',
        searchQuery: 'גלגל אופניים משאבה',
        englishQuery: 'bicycle tire wheel air pump repair mechanics photography',
        emoji: '🚲',
        explanation: 'משאבת אוויר מתכתית מנפחת גלגל אופניים חדש!',
        imageUrl: null
      }
    ]
  },

  // דואר / חבילה
  'דואר': {
    concept: 'דואר',
    synonyms: ['דואר', 'חבילה', 'סניף הדואר', 'בולים', 'משלוח'],
    associations: [
      {
        anchorName: 'חבילת קרטון עם בולים וחותמת דואר 📦📮',
        searchQuery: 'חבילת קרטון דואר',
        englishQuery: 'cardboard parcel package postal stamps mail delivery photography',
        emoji: '📦',
        explanation: 'חבילת קרטון קשורה בחבל עם בולים וחותמות משלוח מרגשות!',
        imageUrl: null
      },
      {
        anchorName: 'תיבת דואר אדומה קלאסית 📮✨',
        searchQuery: 'תיבת דואר אדומה',
        englishQuery: 'red mail box post office traditional street photography',
        emoji: '📮',
        explanation: 'תיבת דואר בריטית אדומה ובוהקת ברחוב אבן!',
        imageUrl: null
      }
    ]
  },

  // צביעה / צבע / קיר
  'צביעה': {
    concept: 'צביעה',
    synonyms: ['לצבוע', 'צבע', 'רולר צבע', 'מברשת צבע', 'לצבוע קיר'],
    associations: [
      {
        anchorName: 'רולר צבע רטוב מורח צבע כחול על קיר 🖌️🎨',
        searchQuery: 'רולר צבע קיר',
        englishQuery: 'paint roller fresh color painting wall renovation photography',
        emoji: '🖌️',
        explanation: 'רולר צבע איכותי מורח שכבת צבע בוהקת וחלקה על הקיר!',
        imageUrl: null
      },
      {
        anchorName: 'פחית צבע נשפכת ומברשת צבע עשירה 🎨🪣',
        searchQuery: 'פחית צבע מברשת',
        englishQuery: 'paint brush colorful paint can home improvement photography',
        emoji: '🎨',
        explanation: 'פחית צבע פתוחה עם מברשת צבע עמוסה בצבע עז!',
        imageUrl: null
      }
    ]
  },

  // מים / מים מינרליים
  'מים': {
    concept: 'מים',
    synonyms: ['מים', 'מים מינרליים', 'שישיית מים', 'בקבוק מים'],
    associations: [
      {
        anchorName: 'בקבוק מים צלול וקר עם טיפות טל 💧🧊',
        searchQuery: 'בקבוק מים קרים',
        englishQuery: 'fresh clear water bottle condensation drops mineral water photography',
        emoji: '💧',
        explanation: 'בקבוק מים מינרליים צלול ומרווה המצופה טיפות מים קרות!',
        imageUrl: null
      },
      {
        anchorName: 'מפל מים צלול ביער ירוק 🌊💧',
        searchQuery: 'מפל מים צלול',
        englishQuery: 'crystal clear waterfall natural spring stream photography',
        emoji: '🌊',
        explanation: 'מי מעיין זכים וטהורים הנובעים מבין הסלעים!',
        imageUrl: null
      }
    ]
  },

  // דרכון / נסיעות
  'דרכון': {
    concept: 'דרכון',
    synonyms: ['דרכון', 'לחדש דרכון', 'משרד הפנים', 'טיסה', 'ויזה'],
    associations: [
      {
        anchorName: 'דרכון כחול עם חותמות כניסה בינלאומיות 🛂✈️',
        searchQuery: 'דרכון חותמות נמל תעופה',
        englishQuery: 'passport travel stamps airport boarding pass photography',
        emoji: '🛂',
        explanation: 'דרכון פתוח ומלא בחותמות כניסה ממדינות שונות בעולם!',
        imageUrl: null
      }
    ]
  },

  // שוקו / משקה
  'שוקו': {
    concept: 'שוקו',
    synonyms: ['שוקו', 'כוס שוקו', 'שוקולטה', 'קקאו'],
    associations: [
      {
        anchorName: 'ספל שוקו חם עשיר עם קצפת ומרשמלו ☕🍫',
        searchQuery: 'ספל שוקו חם קצפת מרשמלו',
        englishQuery: 'hot chocolate mug whipped cream marshmallows cozy cafe photography',
        emoji: '☕',
        explanation: 'ספל שוקו חם, עשיר ונוטף שוקולד מומס עם קצפת עננים!',
        imageUrl: null
      }
    ]
  },

  // בלונים / מסיבה
  'בלונים': {
    concept: 'בלונים',
    synonyms: ['בלונים', 'בלון', 'מסיבה', 'יום הולדת'],
    associations: [
      {
        anchorName: 'צרור בלונים צבעוניים מרחפים באוויר 🎈🎉',
        searchQuery: 'צרור בלונים צבעוניים',
        englishQuery: 'colorful helium balloons flying sky party celebration photography',
        emoji: '🎈',
        explanation: 'עשרות בלוני הליום זוהרים בצבעי הקשת המרחפים אל השמיים!',
        imageUrl: null
      }
    ]
  },

  // עציצים / צמחים / השקיה
  'עציצים': {
    concept: 'עציצים',
    synonyms: ['עציץ', 'עציצים', 'להשקות', 'עציצים במרפסת', 'אדנית'],
    associations: [
      {
        anchorName: 'משפך מים ירוק משקה עציץ פורח במרפסת 🪴💧',
        searchQuery: 'משפך עציץ פרחים מרפסת',
        englishQuery: 'watering can watering potted plants balcony garden photography',
        emoji: '🪴',
        explanation: 'משפך וינטג\' משקה פרחים פורחים באדנית שמשית ומוריקה!',
        imageUrl: null
      }
    ]
  },

  // נר / נרות שבת
  'נר': {
    concept: 'נר',
    synonyms: ['נר', 'נרות', 'נרות שבת', 'להדליק נרות', 'פמוטים'],
    associations: [
      {
        anchorName: 'נרות שבת דולקים בפמוטי כסף נוצצים 🕯️✨',
        searchQuery: 'נרות שבת פמוטי כסף',
        englishQuery: 'silver candlesticks burning candles glowing warm flame photography',
        emoji: '🕯️',
        explanation: 'להבות נרות חמות וזהובות בפמוטי כסף טהור משרות אווירת חג ושלווה!',
        imageUrl: null
      }
    ]
  },

  // מתנה
  'מתנה': {
    concept: 'מתנה',
    synonyms: ['מתנה', 'לעטוף מתנה', 'סרט מתנה', 'קופסת מתנה'],
    associations: [
      {
        anchorName: 'קופסת מתנה עטופה בנייר מבריק עם סרט משי אדום 🎁✨',
        searchQuery: 'קופסת מתנה סרט אדום',
        englishQuery: 'gift box elegant wrapping paper red silk bow ribbon photography',
        emoji: '🎁',
        explanation: 'קופסת מתנה יוקרתית קשורה בסרט משי מושלם הממתינה לפתיחה!',
        imageUrl: null
      }
    ]
  },

};

// ============================================================================
// חילוץ ענף המשימה הראשי (Semantic Information Pivot Parser)
// ============================================================================
export function extractTaskBranchKeyword(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';
  let clean = rawText.trim().replace(/[.,!?:;]+/g, ' ');

  const lowerRaw = clean.toLowerCase();

  // 1. קטגוריית פעולות בעלות משקל סמנטי גבוה (מטלות בית וסדר - הפעולה עצמה היא העיקר, לא החלל הגנרי!)
  if (lowerRaw.includes('לנקות') || lowerRaw.includes('ניקיון') || lowerRaw.includes('ספונג') || lowerRaw.includes('לשטוף רצפה') || lowerRaw.includes('ספונגה') || lowerRaw.includes('לקרצף')) return 'ניקיון';
  if (lowerRaw.includes('לסדר את החדר') || lowerRaw.includes('לסדר חדר') || lowerRaw.includes('סידור החדר') || lowerRaw.includes('סדר בחדר') || lowerRaw.includes('לסדר את הבית')) return 'ניקיון';
  if (lowerRaw.includes('כביסה') || lowerRaw.includes('לכבס') || lowerRaw.includes('לתלות כביסה') || lowerRaw.includes('לקפל כביסה')) return 'כביסה';
  if (lowerRaw.includes('מדיח') || lowerRaw.includes('לשטוף כלים') || lowerRaw.includes('להדיח כלים')) return 'ניקיון';

  // 2. קטגוריית פועלי תנועה ויחס כלליים ("לצאת עם X", "לרדת עם X", "לטייל עם X", "ללכת עם X")
  // המוקד הסמנטי הוא אך ורק הישות (X) ולא הפועל השולי "לצאת" / "לרדת"!
  const motionWithEntity = clean.match(/^(?:לצאת|לרדת|לטייל|להסתובב|ללכת)\s+(?:עם|אל|ל)\s+(.+)$/i);
  if (motionWithEntity && motionWithEntity[1]) {
    let entity = motionWithEntity[1]
      .replace(/\s+(ברביעי|בחמישי|בשני|בשלישי|בראשון|בשישי|בשבת|מחר|היום|אתמול)\b/g, '')
      .replace(/\s+(ב10|ב-10|ב9|ב8|בצהריים|בבוקר|בערב)\b/g, '')
      .replace(/\s+(בחוץ|בפארק|ברחוב|למטה|לטיול)\b/g, '')
      .replace(/^(?:ה|את\s*ה?)/, '')
      .trim();
    if (entity.toLowerCase().includes('מילקי')) return 'מילקי';
    if (entity.toLowerCase().includes('רקס')) return 'רקס';
    if (entity.toLowerCase().includes('טריקסי') || entity.toLowerCase().includes('טריקס')) return 'טריקסי';
    if (entity.toLowerCase().includes('לטפס') || entity.toLowerCase().includes('טיפוס')) return 'טיפוס';
    if (entity.toLowerCase().includes('לגלוש') || entity.toLowerCase().includes('גלישה')) return 'גלישה';
    if (/\b(?:ילדה|ילד|פעוט|תינוק|גן\s+ילדים|הגן)\b/i.test(entity)) return 'ילדה';
    if (entity.length >= 2) return entity;
  }

  // 3. קטגוריית פועלי פעולה על עצמים ("להחזיר את X", "להביא את X", "לקחת את X", "לקנות X")
  // המוקד הסמנטי הוא החפץ (X)!
  const objectAction = clean.match(/^(?:להחזיר|להביא|לקחת|לאסוף|לקנות|לרכוש|למסור|לתת|להעביר|להזמין)\s+(?:את\s+ה?|את\s+|ל[^\s]+\s+את\s+ה?|ל[^\s]+\s+את\s+|ל[^\s]+\s+|ה?)?(.+)$/i);
  if (objectAction && objectAction[1]) {
    let target = objectAction[1]
      .replace(/\s+(ברביעי|בחמישי|בשני|בשלישי|בראשון|בשישי|בשבת|מחר|היום|אתמול)\b/g, '')
      .replace(/\s+(ב10|ב-10|ב9|ב8|בצהריים|בבוקר|בערב)\b/g, '')
      .replace(/\s+(לבסיס|הביתה|לעבודה|למשרד|לגן|לבית\s*ספר|לחדר|לסלון|למטבח)\b/g, '')
      .replace(/^(?:ה)/, '')
      .trim();
    if (target.toLowerCase().includes('מדחום') || target.toLowerCase().includes('מד חום') || target.toLowerCase().includes('תרמומטר')) return 'מדחום';
    if (target.toLowerCase().includes('מגן מסך') || target.toLowerCase().includes('מגן') || target.toLowerCase().includes('מסך')) return 'מגן מסך';
    if (target.toLowerCase().includes('כובע')) return 'כובע';
    if (target.toLowerCase().includes('קריוקי')) return 'קריוקי';
    if (target.toLowerCase().includes('מכנסיים') || target.toLowerCase().includes('מכנס')) return 'מכנסיים';
    if (target.toLowerCase().includes('נעליים') || target.toLowerCase().includes('נעל')) return 'נעליים';
    if (target.toLowerCase().includes('גלידה')) return 'גלידה';
    if (target.toLowerCase().includes('שוקולד') || target.toLowerCase().includes('שוקולית')) return 'שוקולד';
    if (target.toLowerCase().includes('בייבלייד')) return 'בייבלייד';
    if (/\b(?:ילדה|ילד|פעוט|תינוק|גן\s+ילדים|הגן)\b/i.test(target)) return 'ילדה';
    if (target.length >= 2) return target;
  }

  // 4. מושגי תרבות, תחביבים, צרכנות, ספורט וסמנטיקה מובהקים
  if (lowerRaw.includes('שוקו')) return 'שוקו';
  if (lowerRaw.includes('יין') || lowerRaw.includes('כוסית יין')) return 'יין';
  if (lowerRaw.includes('מסעדה') || lowerRaw.includes('שולחן במסעדה')) return 'מסעדה';
  if (lowerRaw.includes('עלים') || lowerRaw.includes('לגרוף')) return 'עלים';
  if (lowerRaw.includes('אופניים') || lowerRaw.includes('פנצ')) return 'אופניים';
  if (lowerRaw.includes('דואר') || lowerRaw.includes('חבילה') || lowerRaw.includes('בולים')) return 'דואר';
  if (lowerRaw.includes('לצבוע') || lowerRaw.includes('צבע') || lowerRaw.includes('רולר צבע')) return 'צביעה';
  if (lowerRaw.includes('מים מינרליים') || lowerRaw.includes('שישיית מים') || lowerRaw.includes('בקבוק מים')) return 'מים';
  if (lowerRaw.includes('דרכון') || lowerRaw.includes('משרד הפנים')) return 'דרכון';
  if (lowerRaw.includes('בלונים') || lowerRaw.includes('בלון')) return 'בלונים';
  if (lowerRaw.includes('עציץ') || lowerRaw.includes('עציצים') || lowerRaw.includes('להשקות')) return 'עציצים';
  if (lowerRaw.includes('נרות') || lowerRaw.includes('נר דולק') || lowerRaw.includes('פמוטים')) return 'נר';
  if (lowerRaw.includes('מתנה') || lowerRaw.includes('לעטוף מתנה')) return 'מתנה';
  if (lowerRaw.includes('ג\'ינס') || lowerRaw.includes('גינס')) return 'מכנסיים';
  if (lowerRaw.includes('כובע צמר') || lowerRaw.includes('כובע בלשים')) return 'כובע';
  if (lowerRaw.includes('קיר טיפוס') || lowerRaw.includes('טיפוס')) return 'טיפוס';
  if (lowerRaw.includes('גלישת גלים') || lowerRaw.includes('לגלוש גלים')) return 'גלישה';

  if (lowerRaw.includes('גלידה') || lowerRaw.includes('ארטיק')) return 'גלידה';
  if (lowerRaw.includes('לטפס') || lowerRaw.includes('טיפוס') || lowerRaw.includes('קיר טיפוס')) return 'טיפוס';
  if (lowerRaw.includes('לגלוש') || lowerRaw.includes('גלישה') || lowerRaw.includes('גלשן')) return 'גלישה';
  if (lowerRaw.includes('מגן מסך') || lowerRaw.includes('מגן') || lowerRaw.includes('מסך')) return 'מגן מסך';
  if (lowerRaw.includes('כובע') || lowerRaw.includes('כובעים')) return 'כובע';
  if (lowerRaw.includes('בייבלייד') || lowerRaw.includes('טורניר בייבלייד')) return 'בייבלייד';
  if (lowerRaw.includes('אנימה') || lowerRaw.includes('קוספליי') || lowerRaw.includes('מנגה')) return 'אנימה';
  if (lowerRaw.includes('מדחום') || lowerRaw.includes('מד חום') || lowerRaw.includes('תרמומטר')) return 'מדחום';
  if (lowerRaw.includes('מילקי')) return 'מילקי';
  if (lowerRaw.includes('רקס')) return 'רקס';
  if (lowerRaw.includes('טריקסי') || lowerRaw.includes('טריקס')) return 'טריקסי';
  if (lowerRaw.includes('מכנסיים') || lowerRaw.includes('מכנס')) return 'מכנסיים';
  if (lowerRaw.includes('נעליים') || lowerRaw.includes('נעל')) return 'נעליים';
  if (lowerRaw.includes('כדורגל')) return 'כדורגל';
  if (lowerRaw.includes('קריוקי')) return 'קריוקי';
  if (lowerRaw.includes('תספורת') || lowerRaw.includes('להסתפר') || lowerRaw.includes('מספרה')) return 'תספורת';
  if (lowerRaw.includes('לכתוב') || lowerRaw.includes('מכתב') || lowerRaw.includes('הודעה') || lowerRaw.includes('סמס') || lowerRaw.includes('מייל') || lowerRaw.includes('רונה')) return 'מכתב';
  if (lowerRaw.includes('שוקולד') || lowerRaw.includes('שוקולית')) return 'שוקולד';

  // ניקוי תחיליות ופעלים כלליים
  const actionPrefixes = [
    /^להחזיר\s+ל[^\s]+\s+את\s+ה?/, /^להחזיר\s+את\s+ה?/, /^להחזיר\s+/,
    /^לקנות\s+את\s+ה?/, /^לקנות\s+/,
    /^לרכוש\s+את\s+ה?/, /^לרכוש\s+/,
    /^לקחת\s+את\s+ה?/, /^לקחת\s+/,
    /^ללכת\s+ל?/, /^ללכת\s+אל\s+ה?/,
    /^לשחק\s+ב?/,
    /^לנסוע\s+ל?/, /^לנסוע\s+אל\s+ה?/,
    /^לפגוש\s+את\s+/, /^לפגוש\s+/,
    /^להכין\s+את\s+ה?/, /^להכין\s+/,
    /^לסדר\s+את\s+ה?/, /^לסדר\s+/,
    /^לשטוף\s+את\s+ה?/, /^לשטוף\s+/,
    /^לשלם\s+על\s+ה?/, /^לשלם\s+/,
    /^להביא\s+את\s+ה?/, /^להביא\s+/,
    /^לנקות\s+את\s+ה?/, /^לנקות\s+/,
    /^לצאת\s+עם\s+/, /^לצאת\s+/,
    /^לרדת\s+עם\s+/, /^לרדת\s+/,
    /^לטייל\s+עם\s+/, /^לטייל\s+/,
    /^לכתוב\s+ל[^\s]+\s+את\s+ה?/, /^לכתוב\s+ל[^\s]+\s+/, /^לכתוב\s+אל\s+/, /^לכתוב\s+/,
    /^לשלוח\s+הודעה\s+ל[^\s]+\s+/, /^לשלוח\s+מכתב\s+ל[^\s]+\s+/, /^לשלוח\s+מייל\s+ל[^\s]+\s+/, /^לשלוח\s+/,
    /^להתקשר\s+ל[^\s]+\s+/, /^להתקשר\s+/
  ];

  for (const rx of actionPrefixes) {
    if (rx.test(clean)) {
      clean = clean.replace(rx, '').trim();
      break;
    }
  }

  // סילוק זמנים, ימים ושמות לוואי
  clean = clean
    .replace(/\s+(ברביעי|בחמישי|בשני|בשלישי|בראשון|בשישי|בשבת|מחר|היום|אתמול)\b/g, '')
    .replace(/\s+(ב10|ב-10|ב9|ב8|בצהריים|בבוקר|בערב)\b/g, '')
    .replace(/\s+(חדשות|חדש|חדשים|טרי|יפה|טוב)\b/g, '')
    .trim();

  return clean || rawText.trim();
}

// ============================================================================
// עובד 1: מנוע AI חי בזמן אמת (Gemini Live Dynamic Associations)
// ============================================================================
export async function fetchGeminiLiveAssociations(taskText = '') {
  const apiKey = getGeminiApiKey();
  if (!apiKey || apiKey.length < 10) return null;

  const prompt = `אתה אמן טכניקות הזיכרון (Memory Champion).
משימת הלקוח לשינון: "${taskText}".

הנחיות ברזל קוגניטיביות חובה:
1. **חוק המילה עצמה ולא השערות מציאות (Word Semantics over Context Guessing):**
   - לעולם אל תנחש מה המילה מייצגת במציאות של המשתמש!
   - אם המשימה היא "לצאת עם מילקי", "לצאת עם טריקסי", "לרדת עם רקס" או "לטייל עם X" — **איסור מוחלט להניח שמדובר בכלב או בחיית מחמד!** (אדם שיוצא עם חברה בשם טריקסי ייעלב עד עמקי נשמתו לראות תמונה של כלב!).
   - העוגן נבחר אך ורק לפי המשמעות החזותית, המותגית, התרבותית או הצלילית של **המילה עצמה**:
     * "מילקי" ➔ מעדן מילקי שוקולד עם הר קצפת, פודינג שוקולד, גביע קינוח, מפל שוקולד (לעולם לא כלב!)
     * "רקס" ➔ טירנוזאורוס רקס (T-Rex) שואג, דינוזאור פרהיסטורי, שלד טי-רקס במוזיאון (לעולם לא כלב!)
     * "טריקסי" ➔ קוסם שעושה טריק, שפן שנשלף מכובע, קלפי קסמים, דגני בוקר טריקס (לעולם לא כלב!)
   - אסור בתוקף לבחור עוגן על הפועל השולי "לצאת" (איסור מוחלט על "ספיידרמן שיוצא לרחוב").

2. **חוק מטלות הבית:**
   - כאשר המשימה היא מטלת בית או סדר ("לנקות את החדר", "לסדר את הבית", "לכבס") — המוקד הוא הפעולה עצמה (ניקיון, כביסה, סדר) ולא החלל הגנרי (לא "חדר" ריק).
   - כאשר המשימה היא תחרות או משחק ("להשתתף בטורניר בייבלייד") — המוקד הוא המשחק עצמו ("בייבלייד" -> סביבון מסתחרר, סופת טייפון/הוריקן, זירת קרב).

3. **חוק האסוציאציה החושית:** לעולם אל תציג את החפץ המשעמם עצמו. צור 5 עוגנים חיים, חושיים, אנושיים או תרבותיים בלתי נשכחים!
4. **חיפוש תמונות מדויק:** englishQuery חייב להכיל אך ורק מילות צילום קונקרטיות באנגלית (למשל: "chocolate pudding whipped cream dessert glass photography", "tyrannosaurus rex roaring dinosaur prehistoric", "magician pulling rabbit out of hat photography").

החזר אך ורק אובייקט JSON תקין (ללא שום markdown וללא טקסט עודף):
{
  "coreConcept": "הענף המרכזי במילה אחת",
  "associations": [
    {
      "anchorName": "שם עוגן חזותי אנושי או פעיל בעברית",
      "englishQuery": "photo search query in english with photographic terms",
      "emoji": "אימוג'י יחיד",
      "explanation": "הסבר קצרצר וקולח שמחבר את המשימה לעוגן"
    }
  ]
}
חובה לייצר בדיוק 5 אסוציאציות שונות ומוחשיות.`;

  const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];
  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3
          }
        }),
        signal: AbortSignal.timeout(4500)
      });

      if (res.ok) {
        const data = await res.json();
        const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (raw) {
          // מנקים תגיות markdown אפשריות
          const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanJson);
          if (Array.isArray(parsed.associations) && parsed.associations.length > 0) {
            return parsed;
          }
        }
      }
    } catch (_) {}
  }
  return null;
}

// ============================================================================
// עובד 1: מומחה עוגנים וסריקת ענפים (Agent 1: Branch Search)
// ============================================================================
export async function agent1ExtractBranchesAndSearch(taskText = '') {
  const cleanTask = String(taskText || '').trim();
  let branchKeyword = extractTaskBranchKeyword(cleanTask);
  let branchLower = branchKeyword.toLowerCase();

  const branchTokens = new Set(branchLower.split(/[\s,.;:!?\-–—]+/).filter(Boolean));
  const STOP_WORDS = new Set(['עם', 'על', 'של', 'את', 'אל', 'זה', 'כל', 'רק', 'בתוך', 'ליד', 'בין', 'מחר', 'היום', 'אתמול', 'בבוקר', 'בערב', 'ללכת', 'לקחת', 'לקנות', 'לאכול', 'לנסוע', 'לבוא', 'לטייל', 'לרדת', 'לצאת']);
  for (const sw of STOP_WORDS) {
    branchTokens.delete(sw);
  }
  // הוספת גרסה ללא ה' הידיעה בלבד (אך לעולם לא קיצוץ אותיות שורש כמו מ' מ"מגן" שהפך ל"גן"!)
  for (const t of Array.from(branchTokens)) {
    if (t.length >= 4 && t.startsWith('ה')) {
      const stripped = t.slice(1);
      if (!STOP_WORDS.has(stripped)) {
        branchTokens.add(stripped);
      }
    }
  }

  // 1. הפקת 5 אסוציאציות מגוונות (שנשמרות ברזרבה בצד!)
  let reserveAssociations = [];
  const catalogEntry = MNEMONIC_ANCHOR_CATALOG[branchKeyword] || 
    Object.values(MNEMONIC_ANCHOR_CATALOG).find(c => c.synonyms.some(s => {
      const sLower = s.toLowerCase();
      return sLower === branchLower || branchTokens.has(sLower);
    }));

  if (catalogEntry && Array.isArray(catalogEntry.associations)) {
    reserveAssociations = catalogEntry.associations.map(a => ({ ...a }));
  } else {
    // 🧠 פנייה ל-AI חי בזמן אמת (Gemini Live)
    try {
      const geminiResult = await fetchGeminiLiveAssociations(cleanTask);
      if (geminiResult && Array.isArray(geminiResult.associations) && geminiResult.associations.length > 0) {
        reserveAssociations = geminiResult.associations;
        if (geminiResult.coreConcept) {
          branchKeyword = geminiResult.coreConcept;
          branchLower = branchKeyword.toLowerCase();
        }
      }
    } catch (_) {}

    // גיבוי ממוקד של המילה החסרה ע"י סוכן 3 אם אין אסוציאציות
    if (reserveAssociations.length === 0) {
      reserveAssociations = [
        {
          anchorName: branchKeyword,
          searchQuery: branchKeyword,
          englishQuery: `${branchKeyword} photography`,
          emoji: '💡',
          explanation: `עוגן זיכרון בארמון עבור ${cleanTask}`
        }
      ];
    }
  }

  // 2. חיפוש במאגר לפי "ענפים" (Branches Search)
  // סורק אך ורק מקורות מאומתים: מאגר משתמש אישי וקטלוג עוגנים מפוקח
  const branchCandidates = [];
  const seenUrls = new Set();

  // בדיקת מאגר אישי מאושר של המשתמש קודם כל
  const userMatch = findUserImageByKeyword(branchLower);
  if (userMatch && userMatch.imageUrl && !userMatch.imageUrl.startsWith('data:image/svg')) {
    if (!isAssociationDisliked(cleanTask, userMatch.imageUrl)) {
      seenUrls.add(userMatch.imageUrl);
      branchCandidates.push({
        anchorName: userMatch.title || branchKeyword,
        imageUrl: userMatch.imageUrl,
        emoji: userMatch.emoji || '⭐',
        explanation: userMatch.caption || `עוגן אישי מנצח מהמאגר שלך!`,
        fromPool: true,
        source: 'user_approved'
      });
    }
  }

  // בדיקת הקטלוג המנוהל לפי ענפים (קטלוג מאומת ומפוקח בלבד!)
  if (catalogEntry && Array.isArray(catalogEntry.associations)) {
    for (const assoc of catalogEntry.associations) {
      if (branchCandidates.length >= 5) break;
      if (assoc.imageUrl && !seenUrls.has(assoc.imageUrl)) {
        if (!isAssociationDisliked(cleanTask, assoc.imageUrl)) {
          seenUrls.add(assoc.imageUrl);
          branchCandidates.push({
            anchorName: assoc.anchorName,
            imageUrl: assoc.imageUrl,
            emoji: assoc.emoji || '⭐',
            explanation: assoc.explanation,
            fromPool: true,
            source: 'catalog_branch'
          });
        }
      }
    }
  }

  return {
    branchKeyword,
    reserveAssociations,
    branchCandidates,
    isComplete: branchCandidates.length >= 5
  };
}

// ============================================================================
// עובד 2: חיפוש שורש והשלמת רשת (Agent 2: Root Search & Web Completion)
// ============================================================================
export async function agent2SearchRootAndCompleteFromWeb(agent1Result, rawTaskText = '') {
  const cleanTask = String(rawTaskText || '').trim();
  const candidates = [...(agent1Result.branchCandidates || [])];
  const seenUrls = new Set(candidates.map(c => c.imageUrl).filter(Boolean));

  // אם סוכן 1 כבר מצא 5 תמונות שלמות בענפים — סוכן 2 מסיים מיד!
  if (candidates.length >= 5) {
    return candidates.slice(0, 5);
  }

  // רשימת האסוציאציות שסוכן 1 שמר ברזרבה
  const pendingAssociations = [...(agent1Result.reserveAssociations || [])];

  // שלב א': בדיקת תמונות שורש מובנות ומאומתות בקטלוג המפוקח
  for (let i = pendingAssociations.length - 1; i >= 0; i--) {
    if (candidates.length >= 5) break;
    const assoc = pendingAssociations[i];

    // האם יש תמונת שורש מובנית בקטלוג המפוקח?
    if (assoc.imageUrl && !seenUrls.has(assoc.imageUrl) && !isAssociationDisliked(cleanTask, assoc.imageUrl)) {
      seenUrls.add(assoc.imageUrl);
      candidates.push({
        anchorName: assoc.anchorName,
        imageUrl: assoc.imageUrl,
        emoji: assoc.emoji || '💡',
        explanation: assoc.explanation || `עוגן שורש מובהק עבור ${assoc.anchorName}!`,
        fromPool: true,
        source: 'root_catalog'
      });
      pendingAssociations.splice(i, 1); // נמחק מרשימת החיפוש ברשת!
    }
  }

  // שלב ב': חיפוש ברשת של האסוציאציות החסרות בלבד!
  if (candidates.length < 5) {
    for (const missingAssoc of pendingAssociations) {
      if (candidates.length >= 5) break;

      const webImg = await executePhotographicWebSearch(
        missingAssoc.anchorName,
        missingAssoc.englishQuery,
        cleanTask
      );

      if (webImg && !seenUrls.has(webImg)) {
        seenUrls.add(webImg);
        candidates.push({
          anchorName: missingAssoc.anchorName,
          imageUrl: webImg,
          emoji: missingAssoc.emoji || '🌐',
          explanation: missingAssoc.explanation || `צילום אמיתי שנשלף עבור ${missingAssoc.anchorName}!`,
          fromPool: false,
          source: 'web_search'
        });
      }
    }
  }

  // אם אין שום מועמד מאושר — מציגים כרטיסיית ברירת מחדל אלגנטית נקייה אחת בלבד (ללא שכפול חלופות פיקטיביות!)
  if (candidates.length === 0) {
    const fallbackCard = generateDynamicFallbackCard(cleanTask);
    candidates.push({
      anchorName: cleanTask,
      imageUrl: fallbackCard,
      emoji: '📌',
      explanation: `עוגן זיכרון בארמון עבור ${cleanTask}`,
      fromPool: false,
      source: 'fallback_card'
    });
  }

  return candidates.slice(0, 5);
}

// ============================================================================
// עובד 3: ארכיטקט חיפוש תמונות פוטוגרפיות (Visual Search Architect)
// ============================================================================
export async function executePhotographicWebSearch(anchorName = '', englishQuery = '', rawTaskText = '') {
  // שער ברזל הרמטי: איסור מוחלט על חיפוש מילת המשימה הגולמית של הלקוח ברשת!
  // סוכן 3 מסרב לבצע חיפוש ברשת אם העוגן זהה למשימה המקורית, חסר שאילתת צילום בינלאומית, או מכיל אותיות עבריות בשאילתת הרשת.
  const cleanAnchor = String(anchorName || '').trim();
  const cleanTask = String(rawTaskText || '').trim();
  const cleanEn = String(englishQuery || '').trim();

  if (
    !cleanEn || 
    cleanEn.length < 3 || 
    /[\u0590-\u05FF]/.test(cleanEn) ||
    /חלופה|עוגן|דמות מומחה|fallback|alternative/i.test(cleanAnchor) ||
    (cleanTask && cleanAnchor.toLowerCase() === cleanTask.toLowerCase())
  ) {
    return null;
  }

  try {
    const urls = await searchPopularWebImages(cleanAnchor, 4, cleanEn);
    if (urls && urls.length > 0 && urls[0]) {
      return urls[0];
    }
  } catch (err) {
    console.warn('Visual search error:', err);
  }

  return null;
}

// ============================================================================
// עובד 4: הסופר הראשי (The Author - Palace Narrative Weaving)
// ============================================================================
export function weavePalaceStory(curatedStations = []) {
  if (!Array.isArray(curatedStations) || curatedStations.length === 0) {
    return 'מסע הזיכרון בארמון מוכן לשינון!';
  }

  const anchorList = curatedStations.map((st, i) => {
    const name = st.associationWord || st.title || `תחנה ${i + 1}`;
    // ניקוי אימוג'י ומילים עודפות למשפט קולח
    return name.replace(/[^\u0590-\u05FFa-zA-Z0-9\s]/g, '').trim();
  }).filter(Boolean);

  if (anchorList.length === 1) return `נכנסת לארמון ופגשת את ${anchorList[0]}.`;
  if (anchorList.length === 2) return `צעדת מהכניסה ופגשת את ${anchorList[0]}, ומשם המשכת אל ${anchorList[1]}.`;

  const lead = anchorList.slice(0, -1).join(', ');
  const last = anchorList[anchorList.length - 1];
  return `במסעך בארמון עברת דרך ${lead} והגעת לשיא אצל ${last} — כל תחנה נחרטה לעד!`;
}

// ============================================================================
// הצינור המלא בסינרגיה: קבלת רשימה ➔ סוכן 1 (ענפים) ➔ סוכן 2 (שורש ורשת) ➔ סופר
// ============================================================================
export async function processTaskListWithSynergy(rawItems = []) {
  const cleanList = rawItems.map(item => {
    return typeof item === 'string' ? item.trim() : (item.title || item.name || '').trim();
  }).filter(Boolean);

  if (cleanList.length === 0) return [];

  const processedStations = await Promise.all(cleanList.map(async (taskText, idx) => {
    // 1. סוכן 1: הפקת 5 אסוציאציות (ברזרבה) + סריקת המאגר לפי "ענפים"
    const agent1Result = await agent1ExtractBranchesAndSearch(taskText);

    // 2. סוכן 2: סריקה לפי "שורש" במאגר + השלמת תמונות חסרות ברשת בלבד
    const candidates = await agent2SearchRootAndCompleteFromWeb(agent1Result, taskText);
    const primary = candidates[0] || {
      anchorName: taskText,
      imageUrl: generateDynamicFallbackCard(taskText),
      emoji: '📌',
      explanation: `עוגן זיכרון בארמון עבור ${taskText}`
    };

    return {
      order: idx + 1,
      title: taskText,
      coreConcept: agent1Result.branchKeyword || taskText,
      associationWord: primary.anchorName,
      imageUrl: primary.imageUrl,
      celebrationImage: primary.imageUrl,
      emoji: primary.emoji || '⭐',
      story: primary.explanation,
      hasRepositoryImage: Boolean(primary.imageUrl && !primary.imageUrl.startsWith('data:image/svg')),
      candidates,
      currentCandidateIndex: 0,
      isAiCurated: true
    };
  }));

  // 3. עובד 4: אריגת סיפור המסע בארמון
  const grandFinaleStory = weavePalaceStory(processedStations);

  return {
    stations: processedStations,
    grandFinaleStory
  };
}

// מתאם תאימות לאחור
export async function resolveAnchorFromLocalPool(taskText = '') {
  const a1 = await agent1ExtractBranchesAndSearch(taskText);
  if (a1.branchCandidates && a1.branchCandidates.length > 0) {
    return {
      concept: a1.branchKeyword,
      associations: a1.branchCandidates,
      primary: a1.branchCandidates[0],
      fromPool: true
    };
  }
  return null;
}

export default {
  MNEMONIC_ANCHOR_CATALOG,
  extractTaskBranchKeyword,
  agent1ExtractBranchesAndSearch,
  agent2SearchRootAndCompleteFromWeb,
  executePhotographicWebSearch,
  weavePalaceStory,
  processTaskListWithSynergy,
  resolveAnchorFromLocalPool
};
