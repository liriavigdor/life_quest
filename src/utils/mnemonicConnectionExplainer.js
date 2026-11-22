/**
 * LifeQuest Mnemonic Connection Explainer (מפענח הקשרים האסוציאטיביים וגשרי הזיכרון)
 * 
 * כלל הברזל:
 * 1. בכל התערבות של ה-AI בשיבוץ התמונה (גם אם בחר עוגן קיים מהמאגר, כגון "חיילת ללא נשק" ➔ "תרמילאי")
 *    מוכרח להיות הסבר כדי שהמשתמש יבין את כוונת המשורר והקפיצה המוחית!
 * 2. ההסבר מוצג בסשן הנוכחי ונשמר אוטומטית במאגר (contextExplanations) כך שיוצג גם בכל סשן עתידי באותו קונטקסט.
 */

import { getUserImagesSync, toCanonicalKey } from './userImageRepository.js';

export function getMnemonicConnectionExplanation(
  itemTitle = '', 
  associationWord = '', 
  cardName = '', 
  imageUrl = '', 
  providedStoryOrExplanation = '',
  aiReasoning = ''
) {
  let customExp = String(providedStoryOrExplanation || '').trim();

  // אם לא הוזן הסבר ישיר אך יש aiReasoning מ-Gemini
  if (!customExp && aiReasoning) {
    customExp = String(aiReasoning).trim();
  }

  // בדיקת שימור היסטורי במאגר התמונות המקומי (לסשנים עתידיים באותו קונטקסט)
  if (!customExp && typeof getUserImagesSync === 'function') {
    try {
      const list = getUserImagesSync();
      const match = list.find(img => 
        (imageUrl && img.imageUrl === imageUrl) ||
        (associationWord && img.title && toCanonicalKey(img.title) === toCanonicalKey(associationWord)) ||
        (cardName && img.title && toCanonicalKey(img.title) === toCanonicalKey(cardName))
      );

      if (match) {
        if (match.contextExplanations && itemTitle) {
          const canonTask = toCanonicalKey(itemTitle);
          customExp = match.contextExplanations[canonTask] || match.contextExplanations[itemTitle] || '';
          if (!customExp) {
            const tokens = String(itemTitle).split(/\s+/).filter(Boolean);
            for (const tok of tokens) {
              const cTok = toCanonicalKey(tok);
              if (match.contextExplanations[cTok]) {
                customExp = match.contextExplanations[cTok];
                break;
              }
            }
          }
        }
        if (!customExp && match.caption && match.caption !== match.title && !match.caption.includes('➔')) {
          customExp = match.caption;
        }
      }
    } catch (_) {}
  }

  if (!customExp) {
    return '';
  }

  // סינון טקסטים טכניים סתמיים
  if (/^עוגן מאומת|^תמונה מאומתת|^default_fallback/i.test(customExp)) {
    return '';
  }

  return customExp;
}

export default getMnemonicConnectionExplanation;
