import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, Trophy, X, ArrowLeft, Heart, Flame, Upload, CheckCircle2, Image as ImageIcon, Brain, ThumbsUp, ThumbsDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { saveUserImage, approveAndSaveMnemonicImage, optimizeImage, dislikeAndRemoveMnemonicImage } from '../utils/userImageRepository';
import { recordMnemonicFeedback, regenerateAlternativeMnemonicImage } from '../utils/aiMnemonicCurator';
import { getMnemonicConnectionExplanation } from '../utils/mnemonicConnectionExplainer';
import { MnemonicRepositoryPickerModal } from './MnemonicRepositoryPickerModal';
import { AnimatedPalaceStoryBook } from './AnimatedPalaceStoryBook';

export function LociSurpriseCelebrationModal({
  isOpen,
  data,
  onClose,
  onUpdateImage,
  grandFinaleStory = ''
}) {
  const [currentImg, setCurrentImg] = useState(() => data?.celebrationImage || data?.imageUrl || '');
  const [currentAnchor, setCurrentAnchor] = useState(() => data?.associationWord || data?.title || '');
  const [currentStory, setCurrentStory] = useState(() => data?.story || data?.quote || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isRepoPickerOpen, setIsRepoPickerOpen] = useState(false);
  const [userRating, setUserRating] = useState(() => (data?.isUserApproved ? 'liked' : null));
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationMessage, setRegenerationMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleRate = async (isLiked) => {
    setUserRating(isLiked ? 'liked' : 'disliked');
    if (isLiked) {
      sounds.playLevelUp?.();
      try {
        const savedRecord = await approveAndSaveMnemonicImage({
          itemTitle: data?.title || data?.celebrationTitle || '',
          associationWord: data?.associationWord || data?.title || '',
          coreConcept: data?.coreConcept || '',
          imageUrl: currentImg,
          explanation: data?.story || data?.quote || '',
          emoji: data?.emoji || '⭐'
        });
        if (savedRecord && savedRecord.imageUrl) {
          setCurrentImg(savedRecord.imageUrl);
          if (onUpdateImage) {
            onUpdateImage(savedRecord.imageUrl, data?.associationWord || savedRecord.title);
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
        await dislikeAndRemoveMnemonicImage(currentImg, data?.title || data?.celebrationTitle || '', data?.associationWord || '');
      } catch (_) {}
    }
    recordMnemonicFeedback({
      itemTitle: data?.title || data?.celebrationTitle || '',
      associationWord: data?.associationWord || data?.title || '',
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
        data?.title || data?.celebrationTitle || data?.associationWord,
        currentImg,
        data
      );

      if (res && res.imageUrl) {
        setCurrentImg(res.imageUrl);
        if (res.associationWord) {
          setCurrentAnchor(res.associationWord);
          data.associationWord = res.associationWord;
          if (data.card) {
            data.card.name = res.associationWord;
          }
        }
        if (res.story) {
          setCurrentStory(res.story);
          data.story = res.story;
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
      console.warn('Autonomous regeneration error in celebration modal:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const isLastStation = data ? (data.isLastStation || (data.order >= 5) || data.celebrationTitle?.includes('שרשרת הזיכרון')) : false;
  const rawStory = grandFinaleStory || (data?.quote && !data.quote.includes('עוגן מנצח') ? data.quote : '');
  const celebrationStoryText = isLastStation 
    ? (rawStory || 'המתאמן שתה קדם אימון מהבקבוק, עשה חימום יסודי, ניגב את הזיעה במגבת והעביר את הצ\'יפ בכניסה.')
    : (data?.quote || data?.story);

  const handleRepoImageSelect = (newImgUrl) => {
    setCurrentImg(newImgUrl);
    setUploadSuccess(true);
    sounds.playLevelUp?.();
    if (onUpdateImage) {
      onUpdateImage(newImgUrl);
    }
    setTimeout(() => setUploadSuccess(false), 3500);
  };

  useEffect(() => {
    if (data) {
      setCurrentImg(data.celebrationImage || data.imageUrl || '');
      setCurrentAnchor(data.associationWord || data.title || '');
      setCurrentStory(data.story || data.quote || '');
      setUserRating(data.isUserApproved ? 'liked' : null);
      setIsExplanationOpen(false);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen && data && !isLastStation) {
      sounds.playLevelUp?.();
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  }, [isOpen, data, isLastStation]);

  if (!isOpen || !data) return null;

  // The Final Grand Reveal: Animated Book of Wisdom with ONLY the story!
  if (isLastStation) {
    return (
      <AnimatedPalaceStoryBook
        isOpen={isOpen}
        storyText={celebrationStoryText}
        onClose={onClose}
      />
    );
  }

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const optimized = await optimizeImage(file, 1000, 1000, 0.85);
      await saveUserImage({
        title: data.title || data.celebrationTitle || 'עוגן זיכרון',
        imageUrl: optimized,
        keywords: [data.title, data.associationWord].filter(Boolean)
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
        backgroundColor: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 999999,
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
          maxWidth: '740px',
          backgroundColor: '#0f172a',
          borderRadius: '26px',
          border: '3px solid #fbbf24',
          boxShadow: '0 35px 80px -15px rgba(0, 0, 0, 0.95), 0 0 50px rgba(245, 158, 11, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          direction: 'rtl',
          fontFamily: 'Rubik, sans-serif',
          animation: 'scaleIn 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}
      >
        {/* Celebration Header */}
        <div style={{
          padding: '18px 26px',
          background: 'linear-gradient(135deg, #78350f 0%, #1c1917 100%)',
          borderBottom: '2px solid rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '2.4rem', animation: 'bounce 1s infinite' }}>{isLastStation ? '🏆' : (data.emoji || '🎉')}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fef08a' }}>
                  {isLastStation ? 'סיפור הדרך של הארמון' : data.celebrationTitle}
                </span>
              </div>
              <span style={{ fontSize: '0.98rem', color: '#fde047', fontWeight: 600 }}>
                {isLastStation ? 'חיבור כל 5 העוגנים לסרט זיכרון אחד רציף:' : data.celebrationSubtitle}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#cbd5e1',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {isLastStation ? (
            /* ========================================================== */
            /* מסך ייעודי לסיפור בלבד (ללא תמונה, פוקוס 100% על הסיפור)    */
            /* ========================================================== */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Grand Narrative Card */}
              <div style={{
                backgroundColor: 'rgba(30, 27, 75, 0.95)',
                border: '2.5px solid #fbbf24',
                borderRadius: '24px',
                padding: '36px 24px',
                textAlign: 'center',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 35px rgba(245, 158, 11, 0.25)',
                position: 'relative'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  border: '1.5px solid #f59e0b',
                  borderRadius: '12px',
                  padding: '6px 18px',
                  color: '#fef08a',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  marginBottom: '22px'
                }}>
                  <Sparkles size={18} />
                  <span>📜 סיפור הדרך שנחרט בזיכרון</span>
                </div>

                {/* Big Bold 9-Word Story Text */}
                <div style={{
                  fontSize: '1.9rem',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.6,
                  textShadow: '0 2px 12px rgba(0, 0, 0, 0.9), 0 0 25px rgba(254, 240, 138, 0.35)',
                  margin: '10px 0 24px'
                }}>
                  "{celebrationStoryText}"
                </div>

                {/* Chronological Anchors Chain */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(245, 158, 11, 0.25)'
                }}>
                  {['1. תלמידים 🧑‍🎓', '2. גבול 🛂', '3. מטוס ✈️', '4. סולר ⛽', '5. בית 🏡'].map((step, idx, arr) => (
                    <React.Fragment key={idx}>
                      <span style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1.5px solid #d97706',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        color: '#fde047',
                        fontSize: '0.92rem',
                        fontWeight: 800,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)'
                      }}>
                        {step}
                      </span>
                      {idx < arr.length - 1 && (
                        <span style={{ color: '#f59e0b', fontWeight: 900, fontSize: '1.2rem' }}>
                          ⟵
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Sensory Imagination Box */}
              <div style={{
                backgroundColor: 'rgba(15, 23, 42, 0.85)',
                border: '1.5px dashed #a855f7',
                borderRadius: '18px',
                padding: '18px 22px',
                textAlign: 'center',
                color: '#f3e8ff',
                fontSize: '1.08rem',
                lineHeight: 1.6,
                fontWeight: 600,
                boxShadow: '0 6px 20px rgba(168, 85, 247, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#d8b4fe', fontWeight: 800, fontSize: '1.15rem', marginBottom: '6px' }}>
                  <Brain size={22} />
                  <span>עצור ודמיין לרגע:</span>
                </div>
                <span>עצום עיניים וראה את כל הסיפור מתרחש בראש כסרט חי.</span>
                <br />
                <span style={{ color: '#fef08a', fontWeight: 800 }}>ברגע שראית את זה בדמיון — הרשימה שלך חקוקה בזיכרון לנצח!</span>
              </div>
            </div>
          ) : (
            /* ========================================================== */
            /* עבור תחנות קודמות בלבד: תצוגת תמונה רגילה                 */
            /* ========================================================== */
            <>
              <div style={{
                width: '100%',
                height: '420px',
                borderRadius: '20px',
                overflow: 'hidden',
                backgroundColor: '#020617',
                border: '2.5px solid rgba(245, 158, 11, 0.6)',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 25px rgba(251, 191, 36, 0.3)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src={currentImg || data.celebrationImage || data.imageUrl} 
                  alt={data.celebrationTitle}
                  referrerPolicy="no-referrer"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                  onError={(e) => {
                    if (data.imageUrl && e.target.src !== data.imageUrl) {
                      e.target.src = data.imageUrl;
                    }
                  }}
                />

                <div style={{
                  position: 'absolute',
                  bottom: '16px',
                  right: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.94)',
                  border: '2px solid #fbbf24',
                  borderRadius: '14px',
                  padding: '6px 16px',
                  color: '#fef08a',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.7)'
                }}>
                  <span>{data.order ? `תחנה ${data.order}: ` : ''}{data.title}</span>
                  <span>{data.emoji}</span>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(30, 41, 59, 0.75)',
                border: '1.5px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '16px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 'bold', fontSize: '1rem' }}>
                  <Flame size={20} className="text-amber" />
                  <span>עוגן הזיכרון שלא תשכח בחיים:</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.96rem', color: '#f1f5f9', lineHeight: 1.6, fontWeight: 500 }}>
                  {celebrationStoryText}
                </p>
              </div>

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
                    <span style={{ fontWeight: 800, color: '#fde047' }}>דיוק העוגן: </span>
                    <span>{currentAnchor || data.associationWord || data.title}</span>
                    {userRating === 'liked' && (
                      <span style={{ color: '#86efac', fontWeight: 'bold', marginRight: '6px' }}>— סומן כעוגן מנצח! 🌟</span>
                    )}
                    {userRating === 'disliked' && (
                      <span style={{ color: '#fca5a5', fontWeight: 'bold', marginRight: '6px' }}>— הציון עודכן, נבחר עוגן חלופי 🔄</span>
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

              {/* Autonomous AI Regeneration Status Banner */}
              {regenerationMessage && (
                <div style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  border: '1.5px solid #818cf8',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  color: '#e0e7ff',
                  fontWeight: 'bold',
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  animation: 'fadeIn 0.2s ease'
                }}>
                  <Brain size={18} color="#a5b4fc" />
                  <span>{regenerationMessage}</span>
                </div>
              )}

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

              {/* Repository picker / upload if missing */}
              {(!data.hasRepositoryImage && (!data.imageUrl || data.imageUrl.startsWith('data:image/svg'))) && (
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input 
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                  
                  <button
                    onClick={() => {
                      sounds.playTap?.();
                      setIsRepoPickerOpen(true);
                    }}
                    style={{
                      flex: 1.2,
                      minWidth: '180px',
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      border: '1.5px solid #34d399',
                      color: '#ffffff',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      fontSize: '0.94rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
                    }}
                  >
                    <ImageIcon size={18} />
                    <span>בחר ממאגר האפליקציה 🖼️</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    style={{
                      flex: 1,
                      minWidth: '160px',
                      background: 'rgba(245, 158, 11, 0.16)',
                      border: '1.5px dashed #f59e0b',
                      color: '#fde047',
                      padding: '11px 16px',
                      borderRadius: '12px',
                      fontSize: '0.94rem',
                      fontWeight: 'bold',
                      cursor: isUploading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Upload size={18} />
                    <span>{isUploading ? 'מעלה...' : 'העלה מהמכשיר 📷'}</span>
                  </button>
                </div>
              )}
            </>
          )}

          {/* Action Continue / Complete Button */}
          <button
            onClick={() => {
              sounds.playTap?.();
              if (isLastStation) {
                sounds.playFanfare?.();
              }
              onClose();
            }}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              background: isLastStation 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: isLastStation ? '#ffffff' : '#1e1b4b',
              fontWeight: 900,
              fontSize: '1.08rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isLastStation 
                ? '0 6px 20px rgba(16, 185, 129, 0.45)' 
                : '0 6px 20px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>{isLastStation ? 'סיימתי לדמיין — התהליך הושלם בהצלחה! 🏆' : 'המשך לחדר הבא בארמון! 🏰'}</span>
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>

      {/* App Image Repository Picker Modal */}
      <MnemonicRepositoryPickerModal
        isOpen={isRepoPickerOpen}
        targetTitle={data?.title || data?.celebrationTitle || ''}
        onSelect={handleRepoImageSelect}
        onClose={() => setIsRepoPickerOpen(false)}
      />
    </div>
  );
}

export default LociSurpriseCelebrationModal;
