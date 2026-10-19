import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Award,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { deleteDeposit, saveDeposit } from '../utils/keyMethodStorage';

export function AcronymChestModal({
  isOpen,
  onClose,
  chestData, // { roomId, roomName, deposit }
  onDepositUpdated
}) {
  if (!isOpen || !chestData || !chestData.deposit) return null;

  const { roomId, roomName, deposit } = chestData;
  const acronym = deposit.acronym || deposit.title || '';
  const orderedItems = deposit.orderedItems || deposit.items || [];
  const isRealWord = Boolean(deposit.isRealWord);
  const matchedWord = deposit.matchedWord || '';

  // Track which letter cards are revealed by the user
  const [revealedIndices, setRevealedIndices] = useState(() => new Set());
  const [hasCompletedAll, setHasCompletedAll] = useState(false);

  const toggleReveal = (idx) => {
    sounds.playTap?.();
    setRevealedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }

      if (next.size === orderedItems.length && !hasCompletedAll) {
        setHasCompletedAll(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
      return next;
    });
  };

  const handleRevealAll = () => {
    sounds.playTap?.();
    const all = new Set(orderedItems.map((_, i) => i));
    setRevealedIndices(all);
    setHasCompletedAll(true);
  };

  const handleResetRecall = () => {
    sounds.playTap?.();
    setRevealedIndices(new Set());
    setHasCompletedAll(false);
  };

  const handleMarkPracticed = () => {
    sounds.playTap?.();
    const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
    const updated = {
      ...deposit,
      lastPracticed: todayStr
    };
    saveDeposit(updated);
    if (onDepositUpdated) onDepositUpdated(updated);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 }
    });
  };

  const handleDelete = () => {
    if (!window.confirm(`האם להסיר את תיבת ראשי התיבות (${acronym}) מחדר זה?`)) {
      return;
    }
    sounds.playTap?.();
    deleteDeposit(deposit.id);
    if (onDepositUpdated) onDepositUpdated(null);
    onClose();
  };

  return (
    <div className="acronym-chest-backdrop" onClick={onClose}>
      <div className="acronym-chest-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="acronym-modal-header">
          <div className="chest-badge-icon">🧰</div>
          <div className="chest-header-titles">
            <div className="chest-room-tag">
              <span>{roomName}</span>
              <span className="dot-sep">•</span>
              <span>טכניקה מילולית: ראשי תיבות</span>
            </div>
            <h2>תיבת ראשי התיבות: <span className="acronym-highlight-text">{acronym}</span></h2>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור">
            <X size={20} />
          </button>
        </div>

        {/* Real Word Discovery Celebration Banner */}
        {isRealWord && matchedWord && (
          <div className="acronym-word-banner animate-fade-in">
            <Sparkles size={18} className="text-amber" />
            <div>
              <strong>מילה עברית נבחרת: "{matchedWord}"!</strong>
              <p>האותיות מסתדרות למילה קליטה שמהווה מפתח שליפה מהיר לכל הפריטים.</p>
            </div>
          </div>
        )}

        {/* Active Recall Training Area */}
        <div className="acronym-recall-stage">
          <div className="recall-instructions-bar">
            <span>🧠 <strong>תרגול שליפה פעילה:</strong> נסה להיזכר מה מסתתר מאחורי כל אות ברצף:</span>
            <div className="recall-quick-actions">
              <button className="recall-tool-btn" onClick={handleRevealAll} title="חשוף את כל הפריטים">
                <Eye size={14} />
                <span>חשוף הכל</span>
              </button>
              <button className="recall-tool-btn" onClick={handleResetRecall} title="הסתר מחדש לבדיקה חוזרת">
                <RotateCcw size={14} />
                <span>הסתר מחדש</span>
              </button>
            </div>
          </div>

          {/* Letter / Item Card Grid */}
          <div className="acronym-cards-grid">
            {orderedItems.map((itemObj, idx) => {
              const letter = itemObj.letter || itemObj.item?.[0] || (idx + 1);
              const text = itemObj.item || (typeof itemObj === 'string' ? itemObj : '');
              const isRevealed = revealedIndices.has(idx);

              return (
                <div 
                  key={idx}
                  className={`acronym-letter-card ${isRevealed ? 'revealed' : 'hidden-secret'}`}
                  onClick={() => toggleReveal(idx)}
                >
                  <div className="card-letter-pillar">
                    <span className="letter-glyph">{letter}</span>
                    <span className="letter-idx">#{idx + 1}</span>
                  </div>

                  <div className="card-item-content">
                    {isRevealed ? (
                      <div className="revealed-item-view animate-fade-in">
                        <span className="revealed-item-text">{text}</span>
                        <span className="revealed-check">✓</span>
                      </div>
                    ) : (
                      <div className="concealed-prompt-view">
                        <span className="concealed-hint">לחץ לחשיפה...</span>
                        <EyeOff size={16} className="concealed-icon" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Progress summary */}
          <div className="acronym-progress-footer">
            <div className="progress-pill">
              <span>נחשפו: {revealedIndices.size} מתוך {orderedItems.length}</span>
            </div>
            {hasCompletedAll && (
              <div className="completion-cheer-pill animate-fade-in">
                <Award size={15} className="text-amber" />
                <span>כל הכבוד! כל ראשי התיבות נשלפו בהצלחה 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="acronym-modal-footer">
          <button 
            type="button" 
            className="chest-delete-btn" 
            onClick={handleDelete}
            title="הסר תיבה זו"
          >
            <Trash2 size={16} />
            <span>הסר תיבה</span>
          </button>

          <div className="footer-right-group">
            <button
              type="button"
              className="chest-practice-btn"
              onClick={handleMarkPracticed}
              title="סמן כטופח היום בזיכרון (חזרתיות פעילה)"
            >
              <Check size={16} />
              <span>סמן כרוענן היום ✨</span>
            </button>
            <button
              type="button"
              className="chest-close-done-btn"
              onClick={onClose}
            >
              סיום וחזרה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
