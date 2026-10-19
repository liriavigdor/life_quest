import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  Lock, 
  Unlock, 
  Brain, 
  HelpCircle, 
  RotateCcw, 
  ArrowLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { LOCI_WORK_PRACTICE_ITEMS, LOCI_DOOR_STAGES } from '../data/lociPracticeData';

export function LociCumulativeQuizModal({
  isOpen,
  door,
  onClose,
  onUnlockDoor
}) {
  const [selectedChain, setSelectedChain] = useState([]);
  const [errorFeedback, setErrorFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  // Determine stage requirements based on door or fallback to Stage 1
  const stageConfig = LOCI_DOOR_STAGES[door?.id] || {
    doorId: door?.id || 'door_generic',
    doorName: door?.name || 'דלת מסדרון',
    targetRoomName: door?.toRoomName || 'החדר הבא',
    stageNumber: 1,
    title: `מנעול ${door?.fromRoomName || 'החדר'} 🔒`,
    requiredItemOrders: [1],
    unlockedMessage: 'המנעול נפתח בהצלחה! 💡'
  };

  const requiredOrders = stageConfig.requiredItemOrders; // e.g. [1, 2]
  const currentSlotIndex = selectedChain.length;
  const isComplete = selectedChain.length === requiredOrders.length;

  // Reset modal state on door open
  useEffect(() => {
    setSelectedChain([]);
    setErrorFeedback(null);
    setShowHint(false);
    setIsPassed(false);
  }, [door, isOpen]);

  if (!isOpen || !door) return null;

  // Handle player clicking an item card
  const handleSelectItem = (item) => {
    if (isPassed || isComplete) return;

    sounds.playTap?.();
    const expectedOrder = requiredOrders[currentSlotIndex];

    if (item.order === expectedOrder) {
      // Correct item in the chain!
      const nextChain = [...selectedChain, item];
      setSelectedChain(nextChain);
      setErrorFeedback(null);

      // Check if chain is fully assembled
      if (nextChain.length === requiredOrders.length) {
        setIsPassed(true);
        sounds.playLevelUp?.();
        try {
          confetti({
            particleCount: 100,
            spread: 75,
            origin: { y: 0.55 }
          });
        } catch (e) {}
      }
    } else {
      // Mistake: gentle feedback without shaming
      sounds.playBlip?.();
      const currentTargetStation = LOCI_WORK_PRACTICE_ITEMS.find(i => i.order === expectedOrder);
      setErrorFeedback({
        message: `לא מדויק עבור תחנה ${currentSlotIndex + 1} (${currentTargetStation?.roomShortName || 'בחדר'}). נסה שוב או לחץ על רמז!`,
        hint: currentTargetStation?.hint
      });
    }
  };

  const handleReset = () => {
    sounds.playTap?.();
    setSelectedChain([]);
    setErrorFeedback(null);
    setIsPassed(false);
  };

  const handleCompleteUnlock = () => {
    sounds.playTap?.();
    if (onUnlockDoor) {
      onUnlockDoor(door);
    }
  };

  return (
    <div 
      className="journal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.82)',
        backdropFilter: 'blur(7px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="loci-quiz-card glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#111827',
          borderRadius: '20px',
          border: isPassed ? '2px solid #22c55e' : '2px solid #f59e0b',
          boxShadow: isPassed 
            ? '0 25px 60px -15px rgba(34, 197, 94, 0.4), 0 0 30px rgba(34, 197, 94, 0.2)' 
            : '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.15)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          direction: 'rtl',
          fontFamily: 'Rubik, sans-serif',
          animation: 'scaleIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 22px',
          background: isPassed 
            ? 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)' 
            : 'linear-gradient(135deg, #2a1608 0%, #150d06 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: isPassed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: isPassed ? '1px solid #22c55e' : '1px solid #f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isPassed ? '#4ade80' : '#fbbf24'
            }}>
              {isPassed ? <Unlock size={22} /> : <Lock size={22} />}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#fef3c7' }}>
                  {stageConfig.title}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  backgroundColor: '#78350f',
                  color: '#fef08a',
                  fontWeight: 600
                }}>
                  שלב {stageConfig.stageNumber} מתוך 4
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                תרגול שיטת Loci: שחזור השרשרת המצטברת לפתיחת {stageConfig.targetRoomName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Instructions Banner */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Brain size={20} style={{ color: '#38bdf8', flexShrink: 0 }} />
              <span style={{ fontSize: '0.9rem', color: '#e2e8f0', lineHeight: 1.4 }}>
                {isPassed ? (
                  <strong style={{ color: '#4ade80' }}>
                    {stageConfig.unlockedMessage}
                  </strong>
                ) : (
                  <span>
                    כדי לפתוח את המנעול, בחר לפי הסדר את <strong>התמונה הנוכחית ואת כל הקודמות</strong> לה בארמון:
                  </span>
                )}
              </span>
            </div>

            {selectedChain.length > 0 && !isPassed && (
              <button
                onClick={handleReset}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}
              >
                <RotateCcw size={12} />
                <span>התחל מחדש</span>
              </button>
            )}
          </div>

          {/* Cumulative Chain Target Slots */}
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '8px' }}>
              מסלול הזיכרון הנדרש ({selectedChain.length} מתוך {requiredOrders.length} אומתו):
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${Math.max(requiredOrders.length, 1)}, 1fr)`,
              gap: '10px'
            }}>
              {requiredOrders.map((targetOrder, idx) => {
                const filledItem = selectedChain[idx];
                const isCurrentActive = idx === currentSlotIndex && !isPassed;
                const targetStation = LOCI_WORK_PRACTICE_ITEMS.find(i => i.order === targetOrder);

                return (
                  <div
                    key={targetOrder}
                    style={{
                      backgroundColor: filledItem 
                        ? 'rgba(6, 78, 59, 0.35)' 
                        : (isCurrentActive ? 'rgba(245, 158, 11, 0.1)' : '#1e293b'),
                      border: filledItem 
                        ? '2px solid #22c55e' 
                        : (isCurrentActive ? '2px dashed #f59e0b' : '1px solid #334155'),
                      borderRadius: '12px',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '110px',
                      position: 'relative',
                      transition: 'all 0.2s ease',
                      boxShadow: isCurrentActive ? '0 0 14px rgba(245, 158, 11, 0.25)' : 'none'
                    }}
                  >
                    {/* Slot Room Label */}
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 'bold',
                      color: isCurrentActive ? '#fde047' : '#94a3b8',
                      marginBottom: '6px'
                    }}>
                      תחנה {targetOrder}: {targetStation?.roomShortName}
                    </span>

                    {filledItem ? (
                      /* Filled Slot Card */
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <div style={{
                          width: '48px',
                          height: '36px',
                          borderRadius: '6px',
                          overflow: 'hidden',
                          border: '1px solid #4ade80'
                        }}>
                          <img 
                            src={filledItem.imageUrl} 
                            alt={filledItem.title} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#fef3c7' }}>
                          {filledItem.title}
                        </span>
                        <div style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#22c55e',
                          color: '#042f2e',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    ) : (
                      /* Empty Target Slot */
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: isCurrentActive ? 1 : 0.4 }}>
                        <span style={{ fontSize: '1.4rem' }}>
                          {isCurrentActive ? '❓' : '🔒'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: isCurrentActive ? '#fef08a' : '#64748b' }}>
                          {isCurrentActive ? 'בחר את הפריט הבא' : 'ממתין'}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feedback & Hint Message */}
          {errorFeedback && !isPassed && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: '#fca5a5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}>
              <span>⚠️ {errorFeedback.message}</span>
              <button
                onClick={() => setShowHint(h => !h)}
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid #f59e0b',
                  color: '#fef08a',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  flexShrink: 0
                }}
              >
                💡 {showHint ? 'הסתר רמז' : 'רמז לאבא'}
              </button>
            </div>
          )}

          {showHint && errorFeedback?.hint && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '0.85rem',
              color: '#fef08a',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <HelpCircle size={18} style={{ color: '#fbbf24', flexShrink: 0 }} />
              <span><strong>רמז לאבא:</strong> {errorFeedback.hint}</span>
            </div>
          )}

          {/* Available Item Cards Bank */}
          <div>
            <div style={{ 
              fontSize: '0.8rem', 
              fontWeight: 600, 
              color: '#94a3b8', 
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>בחר תמונה לשליפה:</span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                לחץ על התמונה שמתאימה לתחנה הנוכחית
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
              gap: '10px'
            }}>
              {LOCI_WORK_PRACTICE_ITEMS.map((item) => {
                const isAlreadyPlaced = selectedChain.some(c => c.order === item.order);

                return (
                  <button
                    key={item.id}
                    disabled={isAlreadyPlaced || isPassed}
                    onClick={() => handleSelectItem(item)}
                    style={{
                      backgroundColor: isAlreadyPlaced ? '#1e293b' : '#1f2937',
                      border: isAlreadyPlaced ? '1px solid #334155' : '1px solid #475569',
                      borderRadius: '12px',
                      padding: '10px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: isAlreadyPlaced || isPassed ? 'default' : 'pointer',
                      opacity: isAlreadyPlaced ? 0.35 : 1,
                      transform: isAlreadyPlaced ? 'none' : 'translateY(0)',
                      transition: 'all 0.16s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!isAlreadyPlaced && !isPassed) {
                        e.currentTarget.style.borderColor = '#fbbf24';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(0,0,0,0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAlreadyPlaced && !isPassed) {
                        e.currentTarget.style.borderColor = '#475569';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {/* Visual Art Thumbnail */}
                    <div style={{
                      width: '68px',
                      height: '48px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#0f172a',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    </div>

                    <span style={{
                      fontSize: '0.82rem',
                      fontWeight: 'bold',
                      color: isAlreadyPlaced ? '#64748b' : '#f8fafc',
                      textAlign: 'center'
                    }}>
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Footer Button when Passed */}
          {isPassed && (
            <button
              onClick={handleCompleteUnlock}
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                border: '2px solid #4ade80',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: '12px',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.45)',
                transition: 'all 0.18s ease',
                marginTop: '6px'
              }}
            >
              <Sparkles size={20} />
              <span>פתח את {stageConfig.doorName} והאר את {stageConfig.targetRoomName}! 🚪💡</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
export default LociCumulativeQuizModal;
