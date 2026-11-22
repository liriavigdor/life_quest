import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Sparkles, Brain, Check, Upload, Image as ImageIcon, CheckCircle2, ThumbsUp, ThumbsDown, Lightbulb, FolderPlus, Bookmark, Tag, Edit3, RefreshCw } from 'lucide-react';
import { sounds } from '../utils/sound';
import { generateDynamicFallbackCard } from '../utils/deterministicStoryEngine';
import { saveUserImage, approveAndSaveMnemonicImage, optimizeImage, dislikeAndRemoveMnemonicImage, getUserImagesSync, toCanonicalKey } from '../utils/userImageRepository';
import { recordMnemonicFeedback, regenerateAlternativeMnemonicImage } from '../utils/aiMnemonicCurator';
import { getMnemonicConnectionExplanation } from '../utils/mnemonicConnectionExplainer';
import { logSessionEvent } from '../utils/sessionLogger';
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
  const [isCatalogFormOpen, setIsCatalogFormOpen] = useState(false);
  const [customBranchesInput, setCustomBranchesInput] = useState('');
  const [customAnchorTitle, setCustomAnchorTitle] = useState('');
  const [isSavingToCatalog, setIsSavingToCatalog] = useState(false);

  // עריכת שורשים וענפים בלחיצה על המסגרת
  const [isRootsEditorOpen, setIsRootsEditorOpen] = useState(false);
  const [editRootsTitle, setEditRootsTitle] = useState('');
  const [editRootsList, setEditRootsList] = useState([]);
  const [newBranchInput, setNewBranchInput] = useState('');
  const [isSavingRoots, setIsSavingRoots] = useState(false);
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
          explanation: item?.explanation || '',
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
    logSessionEvent({
      type: isLiked ? 'like' : 'dislike',
      itemTitle: item?.title || '',
      anchorName: currentAnchor || item?.associationWord || '',
      imageUrl: currentImg
    }).catch(() => {});
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
        const exp = (res.explanation || res.story || '').trim();
        setCurrentStory(exp);
        item.explanation = exp;
        item.story = exp;
        setUserRating(null);
        setRegenerationMessage(`עברת לעוגן הבא: ${res.associationWord || 'עוגן חדש'}! 🎨✨`);
        sounds.playTap?.();
        if (onUpdateImage) {
          onUpdateImage(res.imageUrl, res.associationWord);
        }
        logSessionEvent({
          type: 'swap',
          itemTitle: item?.title || '',
          fromAnchor: currentAnchor || '',
          toAnchor: res.associationWord || '',
          imageUrl: res.imageUrl,
          explanation: exp
        }).catch(() => {});
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

  const handleSaveToRepositoryWithBranches = async (swapCurrentAnchorAfterwards = false) => {
    if (!currentImg || currentImg.startsWith('data:image/svg')) {
      alert('אין תמונה לשמירה.');
      return;
    }
    const titleToSave = (customAnchorTitle || currentAnchor || item?.associationWord || item?.title || '').trim();
    if (!titleToSave) {
      alert('אנא הזן שם לעוגן.');
      return;
    }

    const branches = customBranchesInput
      .split(/[,;\n]+/)
      .map(b => b.trim())
      .filter(b => b.length >= 2);

    setIsSavingToCatalog(true);
    try {
      sounds.playLevelUp?.();
      // 1. שמירה במאגר עם ענפים מותאמים אישית (IndexedDB + Firestore)
      await saveUserImage({
        title: titleToSave,
        imageUrl: currentImg,
        keywords: [titleToSave, ...branches],
        associatedTasks: [item?.title].filter(Boolean),
        caption: item?.explanation || '',
        isUserApproved: true,
        source: 'user_curated_branches',
        qualityScore: 98,
        emoji: '🏷️'
      });

      // 2. שמירה בשרת הפיתוח במאגר הקבוע
      try {
        await fetch('/api/approve-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemTitle: item?.title || '',
            associationWord: titleToSave,
            coreConcept: titleToSave,
            imageUrl: currentImg,
            keywords: [titleToSave, ...branches],
            explanation: item?.explanation || '',
            emoji: '🏷️'
          })
        });
      } catch (_) {}

      setIsCatalogFormOpen(false);
      setCustomBranchesInput('');
      setRegenerationMessage(`התמונה נשמרה בהצלחה במאגר תחת "${titleToSave}" עם ${branches.length} ענפים חדשים! 🏛️💾`);

      // 3. אם המשתמש בחר להחליף עוגן למשימה הנוכחית ("חבל לבזבז, אבל למשימה הזו מצא לי משהו אחר"):
      if (swapCurrentAnchorAfterwards) {
        setTimeout(() => {
          handleDislikeAndRegenerate();
        }, 500);
      }

      setTimeout(() => {
        setRegenerationMessage('');
      }, 4000);
    } catch (err) {
      console.error('Error saving image with custom branches:', err);
      alert('שגיאה בשמירת התמונה למאגר.');
    } finally {
      setIsSavingToCatalog(false);
    }
  };

  // פריט תואם מהמאגר עבור התמונה המוצגת
  const matchingRepoItem = useMemo(() => {
    const list = getUserImagesSync();
    return list.find(img => 
      (currentImg && img.imageUrl === currentImg) ||
      (currentAnchor && img.title && toCanonicalKey(img.title) === toCanonicalKey(currentAnchor)) ||
      (item?.associationWord && img.title && toCanonicalKey(img.title) === toCanonicalKey(item.associationWord))
    );
  }, [currentImg, currentAnchor, item]);

  // Sync if item changes
  React.useEffect(() => {
    if (item) {
      setCurrentImg(item.imageUrl || item.celebrationImage || generateDynamicFallbackCard(item.title));
      setCurrentAnchor(item.associationWord || item.title || '');
      setCurrentStory(item.story || item.explanation || '');
      setUserRating(item.isUserApproved ? 'liked' : null);
      setIsCatalogFormOpen(false);
      setIsRootsEditorOpen(false);
      setCustomBranchesInput('');
      setCustomAnchorTitle(item.associationWord || item.title || '');
    }
  }, [item]);

  // פתיחה / סגירה של עורך השורשים בלחיצה על המסגרת
  const openRootsEditor = () => {
    sounds.playTap?.();
    const title = matchingRepoItem?.title || currentAnchor || item?.associationWord || item?.title || '';
    let initialBranches = [];
    if (matchingRepoItem?.keywords && Array.isArray(matchingRepoItem.keywords)) {
      initialBranches = [...matchingRepoItem.keywords];
    } else if (matchingRepoItem?.association) {
      initialBranches = matchingRepoItem.association.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    } else if (item?.keywords && Array.isArray(item.keywords)) {
      initialBranches = [...item.keywords];
    }
    // סינון כותרת זהה
    initialBranches = initialBranches.filter(b => toCanonicalKey(b) !== toCanonicalKey(title));
    
    setEditRootsTitle(title);
    setEditRootsList(initialBranches);
    setNewBranchInput('');
    setIsRootsEditorOpen(prev => !prev);
  };

  const handleRemoveBranchChip = (branchToRemove) => {
    sounds.playTap?.();
    setEditRootsList(prev => prev.filter(b => b !== branchToRemove));
  };

  const handleAddBranchChip = () => {
    const val = newBranchInput.trim();
    if (!val) return;
    const parts = val.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
    setEditRootsList(prev => {
      const next = [...prev];
      for (const p of parts) {
        if (!next.includes(p)) next.push(p);
      }
      return next;
    });
    setNewBranchInput('');
    sounds.playTap?.();
  };

  const handleSaveRootsToRepository = async (swapCurrentAnchorAfterwards = false) => {
    if (!currentImg || currentImg.startsWith('data:image/svg')) {
      alert('אין תמונה לשמירה.');
      return;
    }
    const cleanTitle = (editRootsTitle || currentAnchor || item?.title || '').trim();
    if (!cleanTitle) {
      alert('נא להזין שם / שורש לעוגן.');
      return;
    }

    setIsSavingRoots(true);
    try {
      sounds.playLevelUp?.();
      
      // 1. שמירה במאגר המקומי (IndexedDB + זיכרון) עם דריסה מלאה של מילות המפתח המעודכנות
      await saveUserImage({
        id: matchingRepoItem?.id || null,
        title: cleanTitle,
        imageUrl: currentImg,
        keywords: [cleanTitle, ...editRootsList],
        associatedTasks: swapCurrentAnchorAfterwards ? [] : [item?.title].filter(Boolean),
        replaceKeywords: true,
        replaceAssociatedTasks: swapCurrentAnchorAfterwards,
        isUserApproved: true,
        qualityScore: 99,
        source: 'user_edited_roots'
      });

      // 2. עדכון שרת הפיתוח / sync
      try {
        await fetch('/api/sync-curation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            editedAnchor: {
              id: matchingRepoItem?.id,
              title: cleanTitle,
              imageUrl: currentImg,
              keywords: editRootsList,
              unlinkedFromTask: swapCurrentAnchorAfterwards ? (item?.title || '') : null
            }
          })
        });
      } catch (_) {}

      // 3. עדכון כותרת העוגן המקומית ב-UI
      setCurrentAnchor(cleanTitle);
      if (item) {
        item.associationWord = cleanTitle;
        if (item.card) item.card.name = cleanTitle;
      }

      setIsRootsEditorOpen(false);
      setRegenerationMessage(`שורשי העוגן "${cleanTitle}" עודכנו בהצלחה במאגר! (${editRootsList.length} ענפים) 🏛️💾`);

      // 4. אם המשתמש בחר להחליף עוגן למשימה הנוכחית ("פחות מרוצה מהאסוציאציה הזו למשימה הנוכחית"):
      if (swapCurrentAnchorAfterwards) {
        setTimeout(() => {
          handleDislikeAndRegenerate();
        }, 300);
      } else {
        setTimeout(() => setRegenerationMessage(''), 4000);
      }
    } catch (err) {
      console.error('Error saving roots:', err);
      alert('שגיאה בעדכון השורשים במאגר.');
    } finally {
      setIsSavingRoots(false);
    }
  };

  const isImageFromPool = Boolean(
    item?.fromPool ||
    (item?.source && item.source !== 'web_completed') ||
    (currentImg && getUserImagesSync().some(img => img.imageUrl === currentImg))
  );

  const connectionExplanation = getMnemonicConnectionExplanation(
    item?.title || '',
    currentAnchor || item?.associationWord || '',
    item?.card?.name || '',
    currentImg || '',
    item?.explanation || item?.story || ''
  );

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
          
          {/* Large High Definition Image Display — ניתן ללחוץ על המסגרת לעריכת שורשים וענפים */}
          <div 
            onClick={() => {
              if (!isRootsEditorOpen) {
                openRootsEditor();
              }
            }}
            style={{
              width: '100%',
              minHeight: '420px',
              height: isRootsEditorOpen ? 'auto' : '420px',
              borderRadius: '18px',
              overflow: 'hidden',
              backgroundColor: '#020617',
              border: isRootsEditorOpen ? '2.5px solid #38bdf8' : '2.5px solid rgba(245, 158, 11, 0.6)',
              boxShadow: isRootsEditorOpen ? '0 0 25px rgba(56, 189, 248, 0.35)' : '0 12px 32px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: isRootsEditorOpen ? 'default' : 'pointer',
              transition: 'all 0.25s ease'
            }}
            title={isRootsEditorOpen ? '' : 'לחץ בתוך המסגרת כדי לערוך את שורשי וענפי התמונה במאגר ✏️'}
          >
            {/* Click to edit badge inside frame */}
            {!isRootsEditorOpen && (
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  openRootsEditor();
                }}
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  backgroundColor: 'rgba(15, 23, 42, 0.90)',
                  border: '1.5px solid #38bdf8',
                  borderRadius: '10px',
                  padding: '6px 14px',
                  color: '#e0f2fe',
                  fontSize: '0.84rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  zIndex: 10,
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                  transition: 'all 0.15s ease'
                }}
                title="לחץ כאן או על התמונה כדי לערוך שורשים וענפים במאגר"
              >
                <Edit3 size={15} color="#38bdf8" />
                <span>ערוך שורשים וענפים ✏️</span>
              </div>
            )}

            <img 
              src={currentImg} 
              alt={item.title}
              referrerPolicy="no-referrer"
              style={{
                width: '100%',
                maxHeight: isRootsEditorOpen ? '220px' : '420px',
                height: isRootsEditorOpen ? '220px' : '100%',
                objectFit: 'contain',
                transition: 'all 0.25s ease'
              }}
              onError={(e) => {
                e.target.onerror = null;
                const localBackup = item?.candidates?.find(c => c.imageUrl && c.imageUrl.includes('/staged_images/pool/') && c.imageUrl !== e.target.src)?.imageUrl;
                e.target.src = localBackup || generateDynamicFallbackCard(item.title);
              }}
            />

            {/* Clean bottom badge with only the word */}
            {!isRootsEditorOpen && (
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
                boxShadow: '0 4px 14px rgba(0,0,0,0.7)',
                zIndex: 5
              }}>
                <span>{item.order ? `תחנה ${item.order}: ` : ''}{item.title}</span>
              </div>
            )}

            {/* Inline Roots & Branches Editor (נפתח בתוך המסגרת בלחיצה עליה!) */}
            {isRootsEditorOpen && (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '100%',
                  backgroundColor: 'rgba(15, 23, 42, 0.98)',
                  borderTop: '2px solid #38bdf8',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  animation: 'fadeIn 0.2s ease',
                  zIndex: 20
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(56, 189, 248, 0.25)', paddingBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Edit3 size={18} color="#38bdf8" />
                    <span style={{ fontWeight: 800, color: '#e0f2fe', fontSize: '0.98rem' }}>
                      עריכת שורשים וענפי זיכרון לעוגן במאגר
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsRootsEditorOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                    title="סגור עריכה"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                  פחות מרוצה מהאסוציאציה הזו? לחץ על <b style={{ color: '#f87171' }}>✕</b> כדי להסיר ענפים שגויים, ערוך את שם השורש, או הוסף ענפים מדויקים:
                </div>

                {/* Root name input */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '4px' }}>
                    שם העוגן / השורש הראשי:
                  </label>
                  <input
                    type="text"
                    value={editRootsTitle}
                    onChange={(e) => setEditRootsTitle(e.target.value)}
                    placeholder="למשל: פקק ירוק, דיזל, סולר..."
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(2, 6, 23, 0.9)',
                      border: '1.5px solid rgba(56, 189, 248, 0.45)',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Active Branches list with delete X buttons */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '6px' }}>
                    ענפי זיכרון פעילים במאגר (לחץ ✕ על ענף שאינו מתאים כדי להסירו לצמיתות):
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '36px', alignItems: 'center' }}>
                    {editRootsList.length === 0 ? (
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>אין ענפים מקושרים כרגע. הוסף ענפים למטה.</span>
                    ) : (
                      editRootsList.map((branch) => {
                        const isMismatchWord = branch === item?.title || branch === 'רכב' || branch === 'אוטו';
                        return (
                          <span
                            key={branch}
                            style={{
                              background: isMismatchWord ? 'rgba(239, 68, 68, 0.22)' : 'rgba(56, 189, 248, 0.15)',
                              border: `1.5px solid ${isMismatchWord ? '#ef4444' : '#38bdf8'}`,
                              borderRadius: '14px',
                              padding: '4px 10px',
                              color: '#ffffff',
                              fontSize: '0.84rem',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <span>{branch}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveBranchChip(branch)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f87171',
                                cursor: 'pointer',
                                fontWeight: 900,
                                fontSize: '0.92rem',
                                padding: '0 2px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                              title={`הסר את "${branch}" מענפי העוגן`}
                            >
                              ✕
                            </button>
                          </span>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Add new branch input */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={newBranchInput}
                    onChange={(e) => setNewBranchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddBranchChip();
                      }
                    }}
                    placeholder="הוסף ענף או אסוציאציה חדשה (הפרד בפסיקים) ולחץ Enter..."
                    style={{
                      flex: 1,
                      backgroundColor: 'rgba(2, 6, 23, 0.9)',
                      border: '1.5px solid rgba(56, 189, 248, 0.45)',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddBranchChip}
                    style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '8px',
                      padding: '7px 14px',
                      color: '#38bdf8',
                      fontSize: '0.84rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    + הוסף ענף
                  </button>
                </div>

                {/* Save and Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleSaveRootsToRepository(false)}
                    disabled={isSavingRoots}
                    style={{
                      flex: '1 1 180px',
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      border: '1.5px solid #38bdf8',
                      borderRadius: '10px',
                      padding: '9px 16px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 'bold',
                      cursor: isSavingRoots ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    <Check size={16} />
                    <span>{isSavingRoots ? 'שומר שינויים...' : '💾 שמור שורשים מעודכנים למאגר'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSaveRootsToRepository(true)}
                    disabled={isSavingRoots}
                    style={{
                      flex: '1 1 230px',
                      background: 'linear-gradient(135deg, #d97706, #b45309)',
                      border: '1.5px solid #fbbf24',
                      borderRadius: '10px',
                      padding: '9px 16px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      fontWeight: 'bold',
                      cursor: isSavingRoots ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.35)'
                    }}
                    title="שומר את התיקון למאגר ומחליף עוגן מיד למשימה הנוכחית"
                  >
                    <RefreshCw size={16} />
                    <span>🔄 שמור והחלף עוגן ל"{item?.title || 'משימה זו'}"</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsRootsEditorOpen(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      color: '#cbd5e1',
                      fontSize: '0.84rem',
                      cursor: 'pointer'
                    }}
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
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

          {/* Custom Branch Tagging & Curation Drawer (רק לתמונות AI חדשות, או מאומת מהמאגר) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {!isImageFromPool ? (
              <button
                onClick={() => {
                  sounds.playTap?.();
                  setIsCatalogFormOpen(!isCatalogFormOpen);
                  if (!customAnchorTitle) {
                    setCustomAnchorTitle(currentAnchor || item?.associationWord || item?.title || '');
                  }
                }}
                style={{
                  background: isCatalogFormOpen ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.08)',
                  border: isCatalogFormOpen ? '1.5px solid #f59e0b' : '1px dashed rgba(245, 158, 11, 0.5)',
                  borderRadius: '12px',
                  padding: '9px 14px',
                  color: '#fef08a',
                  fontSize: '0.86rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                title="ה-AI הביא תמונה מוצלחת? קטלג לה ענפים והכנס אותה למאגר הקבוע כדי שלא תתבזבז!"
              >
                <FolderPlus size={16} color="#fbbf24" />
                <span>{isCatalogFormOpen ? 'סגור טופס קיטלוג ענפים ▲' : '🏷️ תמונת AI חדשה — קטלג לה ענפים ושמור למאגר (חבל לבזבז!)'}</span>
              </button>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '7px 14px',
                background: 'rgba(34, 197, 94, 0.08)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '10px',
                fontSize: '0.82rem',
                color: '#86efac'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🏛️</span>
                  <span>עוגן מאומת מתוך המאגר המקומי שלך (אין צורך בקיטלוג)</span>
                </span>
                <button
                  type="button"
                  onClick={openRootsEditor}
                  style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    border: '1.5px solid #38bdf8',
                    borderRadius: '8px',
                    color: '#e0f2fe',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease'
                  }}
                  title="ערוך את השורשים והענפים של תמונה זו במאגר"
                >
                  <Edit3 size={13} color="#38bdf8" />
                  <span>{isRootsEditorOpen ? 'סגור עריכה ▲' : '✏️ ערוך שורשים וענפים'}</span>
                </button>
              </div>
            )}

            {isCatalogFormOpen && (
              <div style={{
                backgroundColor: 'rgba(24, 21, 18, 0.98)',
                border: '1.5px solid #f59e0b',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                animation: 'fadeIn 0.2s ease',
                boxShadow: '0 8px 24px rgba(0,0,0,0.55)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(245, 158, 11, 0.25)', paddingBottom: '8px' }}>
                  <Bookmark size={18} color="#fbbf24" />
                  <span style={{ fontWeight: 800, color: '#fde047', fontSize: '0.94rem' }}>
                    שמירת התמונה במאגר תחת ענפים חדשים
                  </span>
                </div>

                <div style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  התמונה איכותית אך עוסקת בנושא אחר? הגדר לה כאן ענפי זיכרון ואסוציאציות. היא תישמר לצמיתות במאגר הארמון ותשמש אותך במשימות מתאימות!
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#fde047', marginBottom: '4px' }}>
                    שם העוגן / תיאור התמונה:
                  </label>
                  <input
                    type="text"
                    value={customAnchorTitle}
                    onChange={(e) => setCustomAnchorTitle(e.target.value)}
                    placeholder="למשל: גיטרה חשמלית, כדורסל, שעון כיס"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      border: '1.5px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#fde047', marginBottom: '4px' }}>
                    ענפי זיכרון ואסוציאציות (הפרד בפסיקים):
                  </label>
                  <input
                    type="text"
                    value={customBranchesInput}
                    onChange={(e) => setCustomBranchesInput(e.target.value)}
                    placeholder="למשל: מוזיקה, כלי נגינה, הופעה, רוק, סולו"
                    style={{
                      width: '100%',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      border: '1.5px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: '8px',
                      padding: '7px 12px',
                      color: '#ffffff',
                      fontSize: '0.88rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <button
                    onClick={() => handleSaveToRepositoryWithBranches(true)}
                    disabled={isSavingToCatalog}
                    style={{
                      flex: 1.3,
                      minWidth: '220px',
                      background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
                      border: '1px solid #4ade80',
                      borderRadius: '10px',
                      padding: '9px 14px',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '0.86rem',
                      cursor: isSavingToCatalog ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                    title="שמור תמונה זו למאגר לעתיד, והחלף מיד לעוגן חדש עבור המשימה הנוכחית"
                  >
                    <FolderPlus size={15} />
                    <span>{isSavingToCatalog ? 'שומר במאגר...' : '💾 שמור למאגר והחלף עוגן למשימה זו 🔄'}</span>
                  </button>

                  <button
                    onClick={() => handleSaveToRepositoryWithBranches(false)}
                    disabled={isSavingToCatalog}
                    style={{
                      flex: 1,
                      minWidth: '150px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '10px',
                      padding: '9px 12px',
                      color: '#e2e8f0',
                      fontWeight: 'bold',
                      fontSize: '0.84rem',
                      cursor: isSavingToCatalog ? 'wait' : 'pointer'
                    }}
                    title="שמור את הענפים למאגר והישאר עם התמונה הנוכחית עבור משימה זו"
                  >
                    <span>שמור למאגר והשאר פה</span>
                  </button>

                  <button
                    onClick={() => setIsCatalogFormOpen(false)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#94a3b8',
                      padding: '6px 10px',
                      fontSize: '0.82rem',
                      cursor: 'pointer'
                    }}
                  >
                    ביטול
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mnemonic Cognitive Bridge (גשר הזיכרון - למה זה קשור?) */}
          {connectionExplanation && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '14px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              animation: 'fadeIn 0.25s ease'
            }}>
              <Lightbulb size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.88rem', color: '#fef3c7', lineHeight: 1.5 }}>
                <span style={{ fontWeight: 800, color: '#fde047' }}>💡 למה זה קשור?: </span>
                <span>{connectionExplanation}</span>
              </div>
            </div>
          )}

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
