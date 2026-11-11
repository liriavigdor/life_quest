import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Brain, Check, Upload, Image as ImageIcon, CheckCircle2, FolderOpen, ThumbsUp, ThumbsDown } from 'lucide-react';
import { sounds } from '../utils/sound';
import { generateDynamicFallbackCard } from '../utils/deterministicStoryEngine';
import { saveUserImage, approveAndSaveMnemonicImage, optimizeImage, dislikeAndRemoveMnemonicImage } from '../utils/userImageRepository';
import { recordMnemonicFeedback, getMnemonicItemFeedback, regenerateAlternativeMnemonicImage } from '../utils/aiMnemonicCurator';
import { getMnemonicConnectionExplanation } from '../utils/mnemonicConnectionExplainer';
import { MnemonicRepositoryPickerModal } from './MnemonicRepositoryPickerModal';

export function LociItemInspectionModal({
  isOpen,
  item,
  onClose,
  onUpdateImage,
  grandFinaleStory = ''
}) {
  const [currentImg, setCurrentImg] = useState(() => {
    return item?.imageUrl || item?.celebrationImage || (item ? generateDynamicFallbackCard(item.title) : '');
  });
  const [currentAnchor, setCurrentAnchor] = useState(() => item?.associationWord || item?.title || '');
  const [currentStory, setCurrentStory] = useState(() => item?.story || item?.explanation || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isRepoPickerOpen, setIsRepoPickerOpen] = useState(false);
  const [userRating, setUserRating] = useState(() => (item?.isUserApproved ? 'liked' : null));
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationMessage, setRegenerationMessage] = useState('');
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleRate = async (isLiked) => {
    setUserRating(isLiked ? 'liked' : 'disliked');
    if (isLiked) {
      sounds.playLevelUp?.();
      try {
        const savedRecord = await approveAndSaveMnemonicImage({
          itemTitle: item?.title || '',
          associationWord: item?.associationWord || item?.title || '',
          coreConcept: item?.coreConcept || '',
          imageUrl: currentImg,
          explanation: item?.story || '',
          emoji: item?.emoji || '⭐'
        });
        if (savedRecord && savedRecord.imageUrl) {
          setCurrentImg(savedRecord.imageUrl);
          if (onUpdateImage) {
            onUpdateImage(savedRecord.imageUrl, item?.associationWord || savedRecord.title);
          }
        }
        setRegenerationMessage('פידבק חיובי התקבל! העוגן והתמונה נוספו לצמיתות למאגר שלך 🎉💾');
        setUploadSuccess(true);
        setTimeout(() => {
          setUploadSuccess(false);
          setRegenerationMessage('');
        }, 3500);
      } catch (e) {
        console.warn('Auto-save liked image error:', e);
      }
    } else {
      sounds.playTap?.();
      try {
        await dislikeAndRemoveMnemonicImage(currentImg, item?.title || '', item?.associationWord || '');
      } catch (_) {}
    }
    recordMnemonicFeedback({
      itemTitle: item?.title || '',
      associationWord: item?.associationWord || item?.title || '',
      imageUrl: currentImg,
      isLiked
    });
  };

  const handleDislikeAndRegenerate = async () => {
    handleRate(false);
    setIsRegenerating(true);
    setRegenerationMessage('🔄 מעביר לעוגן הבא מתוך הרכב האסוציאציות... ✨');

    try {
      const res = await regenerateAlternativeMnemonicImage(
        item.title || item.associationWord,
        currentImg,
        item
      );

      if (res && res.imageUrl) {
        setCurrentImg(res.imageUrl);
        if (res.associationWord) {
          setCurrentAnchor(res.associationWord);
          item.associationWord = res.associationWord;
          if (item.card) {
            item.card.name = res.associationWord;
          }
        }
        if (res.story) {
          setCurrentStory(res.story);
          item.story = res.story;
        }
        setRegenerationMessage(`עברת לעוגן הבא: ${res.associationWord || 'עוגן חדש'}! 🎨✨`);
        sounds.playTap?.();
        if (onUpdateImage) {
          onUpdateImage(res.imageUrl, res.associationWord);
        }
        setTimeout(() => {
          setRegenerationMessage('');
        }, 3000);
      }
    } catch (err) {
      console.warn('Autonomous regeneration error:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRepoImageSelect = (newImgUrl) => {
    setCurrentImg(newImgUrl);
    setUploadSuccess(true);
    sounds.playLevelUp?.();
    if (onUpdateImage) {
      onUpdateImage(newImgUrl);
    }
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  // Sync if item changes
  React.useEffect(() => {
    if (item) {
      setCurrentImg(item.imageUrl || item.celebrationImage || generateDynamicFallbackCard(item.title));
      setCurrentAnchor(item.associationWord || item.title || '');
      setCurrentStory(item.story || item.explanation || '');
      setUserRating(item.isUserApproved ? 'liked' : null);
      setIsExplanationOpen(false);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const optimized = await optimizeImage(file, 1000, 1000, 0.85);
      await saveUserImage({
        title: item.title,
        imageUrl: optimized,
        keywords: [item.title, item.associationWord].filter(Boolean)
      });

      setCurrentImg(optimized);
      setUploadSuccess(true);
      sounds.playLevelUp?.();

      if (onUpdateImage) {
        onUpdateImage(optimized);
      }

      setTimeout(() => setUploadSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to save user image:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div 
      className="journal-backdrop" 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="glass-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '700px',
          backgroundColor: '#111827',
          borderRadius: '24px',
          border: '2px solid #f59e0b',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.25)',
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
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #2a1608 0%, #150d06 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.7rem' }}>{item.emoji || '📌'}</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fef3c7' }}>
              {item.title}
            </span>
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
            <X size={22} />
          </button>
        </div>

        {/* Body - Pure Image & Clean Single Label */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Large High Definition Image Display */}
          <div style={{
            width: '100%',
            height: '420px',
            borderRadius: '18px',
            overflow: 'hidden',
            backgroundColor: '#020617',
            border: '2.5px solid rgba(245, 158, 11, 0.6)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img 
              src={currentImg} 
              alt={item.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null;
                const localBackup = item?.candidates?.find(c => c.imageUrl && c.imageUrl.includes('/staged_images/pool/') && c.imageUrl !== e.target.src)?.imageUrl;
                e.target.src = localBackup || generateDynamicFallbackCard(item.title);
              }}
            />

            {/* Clean bottom badge with only the word */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              right: '16px',
              backgroundColor: 'rgba(15, 23, 42, 0.92)',
              border: '1.5px solid #fbbf24',
              borderRadius: '12px',
              padding: '6px 16px',
              color: '#fef08a',
              fontSize: '1.15rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(0,0,0,0.7)'
            }}>
              <span>{item.order ? `תחנה ${item.order}: ` : ''}{item.title}</span>
            </div>
          </div>

          {/* Upload Feedback Badge */}
          {uploadSuccess && (
            <div style={{
              backgroundColor: 'rgba(22, 101, 52, 0.85)',
              border: '1.5px solid #4ade80',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#bbf7d0',
              fontWeight: 'bold',
              fontSize: '0.96rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: 'fadeIn 0.25s ease'
            }}>
              <CheckCircle2 size={18} color="#4ade80" />
              <span>התמונה הועלתה בהצלחה ונשמרה במאגר האישי שלך! 📸✨</span>
            </div>
          )}

          {/* If image was found in the prepared repository: LOCK it in to surprise and challenge the user! */}
          {item.hasRepositoryImage || (item.imageUrl && !item.imageUrl.startsWith('data:image/svg')) ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* AI Quality & User Feedback Bar (👍 / 👎) */}
          <div style={{
            backgroundColor: userRating === 'liked' ? 'rgba(34, 197, 94, 0.12)' : (userRating === 'disliked' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(30, 41, 59, 0.7)'),
            border: `1.5px solid ${userRating === 'liked' ? '#22c55e' : (userRating === 'disliked' ? '#ef4444' : 'rgba(245, 158, 11, 0.35)')}`,
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            transition: 'all 0.25s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Brain size={18} color="#fbbf24" />
              <div style={{ fontSize: '0.9rem', color: '#f8fafc' }}>
                <span style={{ fontWeight: 800, color: '#fde047' }}>עוגן מומלץ: </span>
                <span>{currentAnchor || item.associationWord || item.title}</span>
                {userRating === 'liked' && (
                  <span style={{ color: '#86efac', fontWeight: 'bold', marginRight: '6px' }}>— סומן כעוגן מנצח! 🌟</span>
                )}
                {userRating === 'disliked' && (
                  <span style={{ color: '#fca5a5', fontWeight: 'bold', marginRight: '6px' }}>— הציון הופחת, מחליפים לעוגן מדויק 🔄</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => handleRate(true)}
                style={{
                  background: userRating === 'liked' ? '#15803d' : 'rgba(255, 255, 255, 0.08)',
                  border: userRating === 'liked' ? '1.5px solid #4ade80' : '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  color: userRating === 'liked' ? '#ffffff' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="אהבתי! העוגן עוזר לי לזכור"
              >
                <ThumbsUp size={15} color={userRating === 'liked' ? '#ffffff' : '#4ade80'} />
                <span>אהבתי 👍</span>
              </button>

              <button
                onClick={handleDislikeAndRegenerate}
                disabled={isRegenerating}
                style={{
                  background: isRegenerating ? '#4338ca' : (userRating === 'disliked' ? '#b91c1c' : 'rgba(255, 255, 255, 0.08)'),
                  border: isRegenerating ? '1.5px solid #818cf8' : (userRating === 'disliked' ? '1.5px solid #f87171' : '1px solid rgba(255, 255, 255, 0.15)'),
                  borderRadius: '10px',
                  padding: '6px 14px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.86rem',
                  fontWeight: 'bold',
                  cursor: isRegenerating ? 'wait' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="לא מתאים לי — מצא לי עוגן חדש ב-AI מיד"
              >
                <ThumbsDown size={15} color={userRating === 'disliked' ? '#ffffff' : '#f87171'} />
                <span>{isRegenerating ? 'מאתר ב-AI... ⏳' : 'החלף עוגן 👎'}</span>
              </button>
            </div>
          </div>

          {/* Cognitive Riddle & Revealable Mnemonic Explanation ("למה זה קשור?") */}
          <div style={{
            backgroundColor: isExplanationOpen ? 'rgba(245, 158, 11, 0.12)' : 'rgba(15, 23, 42, 0.65)',
            border: isExplanationOpen ? '1.5px solid #f59e0b' : '1px dashed rgba(245, 158, 11, 0.4)',
            borderRadius: '16px',
            padding: '12px 16px',
            transition: 'all 0.25s ease'
          }}>
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                userSelect: 'none',
                gap: '10px'
              }}
              onClick={() => {
                sounds.playTap?.();
                setIsExplanationOpen(prev => !prev);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.25rem' }}>💡</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.96rem', color: isExplanationOpen ? '#fef08a' : '#fde68a' }}>
                    {isExplanationOpen ? 'הגשר האסוציאטיבי של המוח 🧠' : 'למה זה קשור? (חשוף את ההסבר לחידה 💡)'}
                  </div>
                  {!isExplanationOpen && (
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      קושי רצוי מחזק את הזיכרון! נסה קודם לנחש בעצמך, או לחץ כדי לחשוף
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                style={{
                  background: isExplanationOpen ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '8px',
                  color: isExplanationOpen ? '#fbbf24' : '#cbd5e1',
                  padding: '5px 12px',
                  fontSize: '0.82rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {isExplanationOpen ? 'הסתר הסבר ✕' : 'חשוף תשובה 👁️'}
              </button>
            </div>

            {isExplanationOpen && (
              <div style={{
                marginTop: '12px',
                paddingTop: '12px',
                borderTop: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.95rem',
                lineHeight: '1.65',
                color: '#f8fafc',
                animation: 'fadeIn 0.2s ease'
              }}>
                {getMnemonicConnectionExplanation(
                  item.title,
                  currentAnchor || item.associationWord || item.card?.name,
                  currentAnchor || item.card?.name,
                  currentImg,
                  currentStory || item.story || item.roomQuote || item.hint || ''
                )}
              </div>
            )}
          </div>

          {/* Autonomous AI Regeneration Status Banner */}
          {regenerationMessage && (
            <div style={{
              backgroundColor: 'rgba(79, 70, 229, 0.25)',
              border: '1.5px solid #818cf8',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#e0e7ff',
              fontWeight: 'bold',
              fontSize: '0.94rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              animation: 'fadeIn 0.25s ease'
            }}>
              <Sparkles size={18} color="#a5b4fc" />
              <span>{regenerationMessage}</span>
            </div>
          )}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    sounds.playTap?.();
                    setIsRepoPickerOpen(true);
                  }}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    background: 'rgba(59, 130, 246, 0.18)',
                    border: '1.5px solid #3b82f6',
                    color: '#bfdbfe',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.94rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.18)'}
                >
                  <ImageIcon size={18} />
                  <span>החלף ממאגר האפליקציה 🔄</span>
                </button>

                <button
                  onClick={() => {
                    sounds.playTap?.();
                    onClose();
                  }}
                  style={{
                    flex: 1.5,
                    minWidth: '160px',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    border: '1px solid #f59e0b',
                    color: '#ffffff',
                    padding: '13px 20px',
                    borderRadius: '12px',
                    fontSize: '1.05rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                  }}
                >
                  <Check size={20} />
                  <span>הבנתי! {item.title} 🧠</span>
                </button>
              </div>
            </div>
          ) : (
            /* If NO image was found in repository: choose from app repository OR upload from device */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                border: '1px dashed #60a5fa',
                borderRadius: '12px',
                padding: '8px 14px',
                color: '#bfdbfe',
                fontSize: '0.88rem',
                textAlign: 'center'
              }}>
                <span>💡 לא נמצאה תמונה במאגר המוכן עבור <strong>"{item.title}"</strong> — בחר תמונה ממאגר האפליקציה או העלה משלך:</span>
              </div>

              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {/* 1. Choose from App Repository */}
                <button
                  onClick={() => {
                    sounds.playTap?.();
                    setIsRepoPickerOpen(true);
                  }}
                  style={{
                    flex: 1.2,
                    minWidth: '200px',
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    border: '1.5px solid #34d399',
                    color: '#ffffff',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <ImageIcon size={18} />
                  <span>בחר ממאגר האפליקציה 🖼️</span>
                </button>

                {/* 2. Upload from device */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    flex: 1,
                    minWidth: '180px',
                    background: 'rgba(245, 158, 11, 0.18)',
                    border: '1.5px solid #f59e0b',
                    color: '#fef08a',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    fontSize: '0.98rem',
                    fontWeight: 'bold',
                    cursor: isUploading ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.28)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.18)'}
                >
                  <Upload size={18} />
                  <span>{isUploading ? 'מעלה ושומר...' : 'העלה מהמכשיר 📷'}</span>
                </button>

                {/* 3. Continue */}
                <button
                  onClick={() => {
                    sounds.playTap?.();
                    onClose();
                  }}
                  style={{
                    flex: 0.8,
                    minWidth: '110px',
                    background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
                    border: '1px solid #f59e0b',
                    color: '#ffffff',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Check size={20} />
                  <span>המשך</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* App Image Repository Picker Modal */}
      <MnemonicRepositoryPickerModal
        isOpen={isRepoPickerOpen}
        targetTitle={item?.title || ''}
        onSelect={handleRepoImageSelect}
        onClose={() => setIsRepoPickerOpen(false)}
      />
    </div>
  );
}
export default LociItemInspectionModal;
