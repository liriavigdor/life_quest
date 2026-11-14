/**
 * LifeQuest Mnemonic Connection Explainer (מפענח הקשרים האסוציאטיביים וגשרי הזיכרון)
 * 
 * כלל הברזל:
 * 1. אם ה-AI לא התערב (שליפה דטרמיניסטית ישירה מהמאגר) ➔ אין הסבר כלל (0 רעש, 0 עומס בממשק).
 * 2. אם ה-AI התערב ויצר גשר אסוציאטיבי (גם אם בחר עוגן קיים מהמאגר, כגון "פסנתר" ➔ "שוקולד/מדרגות")
 *    ➔ מציגים במדויק את ההסבר של ה-AI כדי שהמשתמש יבין את כוונת המשורר והקפיצה המוחית!
 */

export function getMnemonicConnectionExplanation(
  itemTitle = '', 
  associationWord = '', 
  cardName = '', 
  imageUrl = '', 
  providedStoryOrExplanation = ''
) {
  const customExp = String(providedStoryOrExplanation || '').trim();

  // אם ה-AI לא התערב (אין שום הסבר מה-AI) — לא מציגים שום הסבר!
  if (!customExp) {
    return '';
  }

  // סינון טקסטים גנריים/תבניתיים שאינם הסבר אסוציאטיבי אמיתי
  const isBoilerplate = /עוגן|מהמאגר|בארמון|המוח קושר|חזותי|שלך:|זיכרון/i.test(customExp);
  if (isBoilerplate) {
    return '';
  }

  // החזרת ההסבר של ה-AI (מוגבל לאורך סביר)
  return customExp;
}

export default getMnemonicConnectionExplanation;
