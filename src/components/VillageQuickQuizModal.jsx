import React, { useState } from 'react';
import { Sparkles, Check, X, ArrowRight, DoorOpen, Award, Brain, Lock, Unlock, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

/**
 * VillageQuickQuizModal:
 * Fast, joyful, zero-friction Active Recall Check (5-10 seconds).
 * Ensures the memory anchor is firmly engraved in the brain before unlocking
 * the house interior and expanding the next area of the village.
 */
export function VillageQuickQuizModal({
  isOpen,
  onClose,
  station,
  targetBuildingName = 'מפקדת הפיקוד והתדריכים',
  targetBuildingType = 'wooden_cabin',
  currentMemory = '',
  stationEmoji = '🪖',
  stageNumber = 1,
  totalStages = 5,
  onPassedQuiz,
  onEnterInteriorDirectly
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPassed, setIsPassed] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isOpen) return null;

  // The core memory anchor to test
  const memoryPrompt = currentMemory?.trim() || 'מוקד פקודות היום, תכנון מבצעי ועוגן ראשי';
  
  // Plausible distractors for quick multi-choice
  const distractors = [
    'ספריית מודיעין, מפות שטח ותחקירים',
    'הזנה, אפיית לחם ואנרגיה יומית',
    'חממת צמחי מרפא ועזרה ראשונה',
    'אימוני כשירות, כושר גופני ומשמעת'
  ].filter(d => d !== memoryPrompt);

  const options = [
    { text: memoryPrompt, isCorrect: true, emoji: stationEmoji || '✨' },
    { text: distractors[0] || 'מחסן אספקה וציוד שטח', isCorrect: false, emoji: '📦' },
    { text: distractors[1] || 'פינת מנוחה וצפייה בנוף', isCorrect: false, emoji: '☕' }
  ].sort(() => 0.5 - Math.sin(stageNumber * 99)); // Deterministic shuffle per stage

  const handleSelect = (opt) => {
    sounds.playTap?.();
    setSelectedOption(opt.text);

    if (opt.isCorrect) {
      setIsPassed(true);
      setIsWrong(false);
      sounds.playLevelUp?.();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
      if (onPassedQuiz) {
        onPassedQuiz(stageNumber);
      }
    } else {
      setIsWrong(true);
      setAttempts(a => a + 1);
      sounds.playBlip?.();
    }
  };

  return (
    <div className="journal-backdrop village-quick-quiz-backdrop" onClick={onClose}>
      <div 
        className="village-quick-quiz-modal glass-card" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="מבחן שליפה מהיר"
      >
        {/* Header */}
        <div className="quick-quiz-header">
          <div className="quick-quiz-stage-pill">
            <Brain size={15} className="text-amber" />
            <span>שלב שליטה {stageNumber} מתוך {totalStages}</span>
          </div>
          <button 
            type="button" 
            className="close-mini-btn" 
            onClick={onClose} 
            title="סגור מבחן"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        {!isPassed ? (
          <div className="quick-quiz-body">
            <div className="quick-quiz-icon-wrapper">
              <span className="quick-quiz-station-emoji">{stationEmoji}</span>
              <span className="quick-quiz-spark-badge">⚡</span>
            </div>

            <h3 className="quick-quiz-title">
              מבחן שליפה בזק (5 שניות) 🧠
            </h3>

            <p className="quick-quiz-subtitle">
              מהו עוגן הזיכרון שקיבעת ב<strong>{targetBuildingName}</strong>?
            </p>

            <div className="quick-quiz-options-list">
              {options.map((opt, idx) => {
                const isSelected = selectedOption === opt.text;
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`quick-quiz-opt-btn ${isSelected && isWrong ? 'opt-wrong' : ''}`}
                    onClick={() => handleSelect(opt)}
                  >
                    <span className="opt-emoji">{opt.emoji}</span>
                    <span className="opt-text">{opt.text}</span>
                    <span className="opt-arrow">←</span>
                  </button>
                );
              })}
            </div>

            {isWrong && (
              <div className="quick-quiz-wrong-hint">
                <span>💡 רמז קל: חשוב על התפקיד המרכזי של {targetBuildingName}. נסה שוב בלחיצה!</span>
              </div>
            )}

            <div className="quick-quiz-footer-note">
              <span>🔒 הצלחה במבחן פותחת מיד את חלל הפנים של הבית ומרחיבה את הכפר</span>
            </div>
          </div>
        ) : (
          /* Passed Celebration Screen */
          <div className="quick-quiz-passed-screen">
            <div className="passed-badge-burst">
              <span className="passed-big-icon">🎉</span>
              <div className="passed-spark-ring" />
            </div>

            <h2 className="passed-title">
              נחקק בזיכרון בהצלחה! ✨
            </h2>

            <p className="passed-desc">
              העוגן המרחבי הוטמע בהצלחה ברשת הזיכרון לטווח ארוך (LTM).
              המשחק פותח בפניך את השלב הבא!
            </p>

            {/* Unlocks Summary Grid */}
            <div className="passed-unlocks-box">
              <div className="passed-unlock-item">
                <div className="unlock-icon-circle green">
                  <DoorOpen size={20} />
                </div>
                <div className="unlock-info">
                  <strong>חלל הפנים של הבית נפתח 🚪</strong>
                  <span>כעת ניתן להיכנס למבנה, לעצב חדרים ולנהל לוקרים פנימיים</span>
                </div>
              </div>

              <div className="passed-unlock-item">
                <div className="unlock-icon-circle amber">
                  <Unlock size={20} />
                </div>
                <div className="unlock-info">
                  <strong>הכפר התרחב והשער נפתח 🗺️</strong>
                  <span>שבילי הגישה והמבנה הבא במסלול נפתחו לתנועה חופשית</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="passed-actions-row">
              {onEnterInteriorDirectly && (
                <button
                  type="button"
                  className="quick-quiz-action-btn primary"
                  onClick={() => {
                    sounds.playTap?.();
                    onEnterInteriorDirectly();
                    onClose();
                  }}
                >
                  <DoorOpen size={18} />
                  <span>היכנס מיד לתוך הבית 🚪</span>
                </button>
              )}

              <button
                type="button"
                className="quick-quiz-action-btn secondary"
                onClick={() => {
                  sounds.playTap?.();
                  onClose();
                }}
              >
                <span>המשך לחקור את הכפר המורחב 🌿</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
