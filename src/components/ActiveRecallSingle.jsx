import React, { useState } from 'react';
import { Lock, Unlock, Key, RotateCcw } from 'lucide-react';
import { sounds } from '../utils/sound';

export function ActiveRecallSingle({
  itemName = '',
  associationWord = '',
  villageCipher = 'יער',
  houseCipher = 'אבק'
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    if (!isRevealed) {
      sounds.playTap?.();
      setIsRevealed(true);
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    sounds.playTap?.();
    setIsRevealed(false);
  };

  return (
    <div 
      className={`active-recall-single-box ${isRevealed ? 'revealed' : 'locked'}`}
      onMouseEnter={handleReveal}
      onClick={handleReveal}
      title={isRevealed ? 'נחשף' : 'רחף או לחץ כדי לבדוק את עצמך'}
    >
      <div className="single-recall-top">
        <div className="stored-item-title">
          <span>חפץ שהופקד:</span>
          {isRevealed ? (
            <strong className="revealed-text animate-pop-in">{itemName}</strong>
          ) : (
            <span className="locked-teaser">
              <Lock size={13} />
              <span>רחף עם העכבר לבדיקת הזיכרון 👁️</span>
            </span>
          )}
        </div>

        {isRevealed && (
          <button 
            type="button" 
            className="single-reset-btn" 
            onClick={handleReset}
            title="הסתר מחדש לבדיקה נוספת"
          >
            <RotateCcw size={12} />
            <span>נעל 🔒</span>
          </button>
        )}
      </div>

      {/* Strict Physical Verbal Chain */}
      <div className="leaf-chain-box">
        <Key size={13} className="text-amber" />
        <div className="chain-nodes">
          <span className="chain-v">הכפר ({villageCipher})</span>
          <span className="arrow">←</span>
          <span className="chain-h">הבית ({houseCipher})</span>
          <span className="arrow">←</span>
          <span className="chain-a">
            אסוציאציה:{' '}
            {isRevealed ? (
              <strong className="revealed-assoc animate-pop-in">"{associationWord}"</strong>
            ) : (
              <span className="masked-assoc">???</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
