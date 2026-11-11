import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Check, 
  ChevronRight, 
  ChevronLeft, 
  Save, 
  Sparkles, 
  Tag, 
  AlertTriangle, 
  Layers, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  Flame,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  Trash2,
  ThumbsDown,
  RotateCcw,
  Lightbulb,
  ListPlus,
  BookmarkPlus
} from 'lucide-react';
import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool';
import { STAGED_TRIPLET_POOL } from '../data/stagedTripletPool';
import { THEMATIC_DOMAINS } from '../data/mnemonicAssociativeCatalog';
import { checkDuplicateAssociations } from '../utils/userImageRepository';
import { getEverydaySuggestionsForItem, EVERYDAY_COMMON_CATEGORIES } from '../data/everydayMnemonicSuggestions';

export function RapidFilingDesk({ userImages = [], onSaveImage, uploaderName = '' }) {
  // Topic filter: 'basic' (default - core all-stars) | 'gaming' | 'cinema' | 'sports' | 'supercars_brands' | 'science' | 'history_myth' | 'nature' | 'filed' | 'all' | 'bad' | 'trash'
  const [activeTopic, setActiveTopic] = useState('basic');
  // Toggle: hide already filed items from queue (defaults to true)
  const [hideFiled, setHideFiled] = useState(true);
  
  // Current active index within the filtered list
  const [currentIndex, setCurrentIndex] = useState(0);

  // Form state for current selected staged image
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentDomain, setCurrentDomain] = useState('celebrities');
  const [currentKeywords, setCurrentKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [currentCaption, setCurrentCaption] = useState('');
  const [selectedOptionUrl, setSelectedOptionUrl] = useState('');
  const [saveSuccessAnim, setSaveSuccessAnim] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Selected Everyday suggestions category (optional filter)
  const [activeEverydayCat, setActiveEverydayCat] = useState(null);
  // Dismissed suggestions for this session
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());

  // Discarded (Deleted) Staged Images persisted in localStorage
  const [discardedIds, setDiscardedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_discarded_staged_images');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (_) {
      return new Set();
    }
  });

  // Flagged "Bad / Needs Replacement" Images persisted in localStorage
  const [flaggedBadMap, setFlaggedBadMap] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_flagged_bad_images');
      return saved ? JSON.parse(saved) : {};
    } catch (_) {
      return {};
    }
  });

  // Map userImages to identify which staged images are already filed in the user repo
  const filedMap = useMemo(() => {
    const map = new Map();
    userImages.forEach(img => {
      if (img.imageUrl) map.set(img.imageUrl, img);
      if (img.title) map.set(img.title.trim().toLowerCase(), img);
      if (img.id) map.set(img.id, img);
    });
    return map;
  }, [userImages]);

  // Triplet map for 3-option candidate images & curated everyday associations
  const tripletMap = useMemo(() => {
    return new Map(STAGED_TRIPLET_POOL.map(t => [t.id, t]));
  }, []);

  // Tag items with filed, flagged, or discarded status + triplet candidates
  const stagedWithStatus = useMemo(() => {
    return STAGED_IMAGES_POOL.map(item => {
      const itemTitle = (item.suggestedName || item.name || item.name_he || '').trim().toLowerCase();
      const isFiled = filedMap.has(item.imageUrl) || 
                      (itemTitle && filedMap.has(itemTitle)) ||
                      filedMap.has(item.id);
      const existingRecord = filedMap.get(item.imageUrl) || 
                             (itemTitle && filedMap.get(itemTitle)) ||
                             filedMap.get(item.id);
      const isDiscarded = discardedIds.has(item.id) || discardedIds.has(item.imageUrl);
      const isFlaggedBad = Boolean(flaggedBadMap[item.id] || flaggedBadMap[item.imageUrl]);

      const triplet = tripletMap.get(item.id);
      const imageOptions = triplet?.imageOptions && triplet.imageOptions.length > 0 
        ? triplet.imageOptions 
        : (item.imageUrl ? [item.imageUrl] : []);
      const curatedEverydayKeywords = triplet?.curatedEverydayKeywords || item.everyday_associations || item.everydayKeywords || [];

      return {
        ...item,
        imageOptions,
        curatedEverydayKeywords,
        isFiled,
        existingRecord,
        isDiscarded,
        isFlaggedBad
      };
    });
  }, [filedMap, discardedIds, flaggedBadMap, tripletMap]);

  // Overall statistics
  const totalCount = STAGED_IMAGES_POOL.length;
  const discardedCount = stagedWithStatus.filter(i => i.isDiscarded).length;
  const flaggedBadCount = stagedWithStatus.filter(i => i.isFlaggedBad && !i.isDiscarded).length;
  const activeAvailableCount = totalCount - discardedCount;
  const filedCount = stagedWithStatus.filter(i => i.isFiled && !i.isDiscarded).length;
  const pendingCount = activeAvailableCount - filedCount;
  const progressPercent = Math.round((filedCount / (activeAvailableCount || 1)) * 100) || 0;

  // Filtered list based on active topic and hideFiled
  const filteredItems = useMemo(() => {
    if (activeTopic === 'trash') {
      return stagedWithStatus.filter(i => i.isDiscarded);
    }
    if (activeTopic === 'bad') {
      return stagedWithStatus.filter(i => i.isFlaggedBad && !i.isDiscarded);
    }

    const available = stagedWithStatus.filter(i => !i.isDiscarded);

    if (activeTopic === 'basic') {
      const basicList = available.filter(i => i.is_basic);
      return hideFiled ? basicList.filter(i => !i.isFiled) : basicList;
    }
    if (activeTopic === 'filed') {
      return available.filter(i => i.isFiled);
    }
    if (activeTopic === 'pending') {
      return available.filter(i => !i.isFiled);
    }
    if (activeTopic === 'all') {
      return hideFiled ? available.filter(i => !i.isFiled) : available;
    }

    const byTheme = available.filter(i => i.theme === activeTopic || i.topic === activeTopic);
    return hideFiled ? byTheme.filter(i => !i.isFiled) : byTheme;
  }, [stagedWithStatus, activeTopic, hideFiled]);

  // Selected item
  const activeItem = filteredItems[currentIndex] || filteredItems[0] || null;

  // Clamp currentIndex if out of bounds when filter changes
  useEffect(() => {
    if (currentIndex >= filteredItems.length && filteredItems.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredItems.length, currentIndex]);

  // Sync form whenever activeItem changes
  useEffect(() => {
    if (!activeItem) return;

    // Set initial selected candidate image (defaults to existing filed or option 1)
    const initialUrl = activeItem.existingRecord?.imageUrl || 
                       activeItem.imageOptions?.[0] || 
                       activeItem.imageUrl;
    setSelectedOptionUrl(initialUrl);

    if (activeItem.isFiled && activeItem.existingRecord) {
      setCurrentTitle(activeItem.existingRecord.title || activeItem.suggestedName);
      setCurrentDomain(activeItem.existingRecord.domain || activeItem.topic || 'celebrities');
      const existingKw = activeItem.existingRecord.keywords || [];
      const isBloated = existingKw.length > 4 || existingKw.some(k => k.includes(' '));
      if (isBloated && activeItem.curatedEverydayKeywords && activeItem.curatedEverydayKeywords.length > 0) {
        setCurrentKeywords([...activeItem.curatedEverydayKeywords]);
      } else {
        setCurrentKeywords(existingKw.filter(k => !k.includes(' ')).slice(0, 4));
      }
      setCurrentCaption(activeItem.existingRecord.caption || '');
    } else {
      setCurrentTitle(activeItem.suggestedName || '');
      setCurrentDomain(activeItem.topic || 'celebrities');
      // PRE-FILL with curated, useful everyday associations!
      setCurrentKeywords(
        activeItem.curatedEverydayKeywords && activeItem.curatedEverydayKeywords.length > 0 
          ? [...activeItem.curatedEverydayKeywords]
          : []
      );
      setCurrentCaption('');
    }
    setKeywordInput('');
    setSaveSuccessAnim(false);
    setActiveEverydayCat(null);
  }, [activeItem]);

  // Duplicate associations checker
  const detectedDuplicates = useMemo(() => {
    if (!currentKeywords.length && !currentTitle) return [];
    const excludeId = activeItem?.existingRecord?.id || null;
    return checkDuplicateAssociations(currentTitle, currentKeywords, excludeId);
  }, [currentTitle, currentKeywords, activeItem, userImages]);

  // Everyday Suggestions computed dynamically for active item
  const everydaySuggestions = useMemo(() => {
    if (!activeItem) return [];

    let pool = [];
    if (activeEverydayCat) {
      const catObj = EVERYDAY_COMMON_CATEGORIES.find(c => c.name === activeEverydayCat);
      pool = catObj ? catObj.words : [];
    } else {
      pool = getEverydaySuggestionsForItem(activeItem.id, activeItem.topic);
    }

    // Filter out words already in currentKeywords or dismissed
    const currentSet = new Set(currentKeywords.map(k => k.trim().toLowerCase()));
    return pool.filter(word => !currentSet.has(word.trim().toLowerCase()) && !dismissedSuggestions.has(word));
  }, [activeItem, activeEverydayCat, currentKeywords, dismissedSuggestions]);

  // Add keyword helper
  const handleAddKeyword = (wordToAdd = null) => {
    const raw = (wordToAdd !== null ? wordToAdd : keywordInput).trim();
    if (!raw) return;
    
    const parts = raw.split(/[,;\n]+/).map(p => p.trim()).filter(Boolean);
    const updated = [...currentKeywords];
    
    parts.forEach(p => {
      if (!updated.includes(p)) {
        updated.push(p);
      }
    });

    setCurrentKeywords(updated);
    if (wordToAdd === null) {
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kwToRemove) => {
    setCurrentKeywords(prev => prev.filter(k => k !== kwToRemove));
  };

  const handleDismissSuggestion = (sug) => {
    setDismissedSuggestions(prev => new Set([...prev, sug]));
  };

  const handleKeyDownInput = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  // Discard / Delete image handler
  const handleDiscardImage = () => {
    if (!activeItem) return;
    const updated = new Set(discardedIds);
    updated.add(activeItem.id);
    setDiscardedIds(updated);
    try {
      localStorage.setItem('lifequest_discarded_staged_images', JSON.stringify([...updated]));
    } catch (_) {}

    showToast(`🗑️ התמונה "${activeItem.suggestedName}" נמחקה מתור התיוק`);
    advanceToNext();
  };

  // Flag "Bad Image / Needs Replacement" handler
  const handleFlagBadImage = () => {
    if (!activeItem) return;
    const updated = {
      ...flaggedBadMap,
      [activeItem.id]: {
        name: activeItem.suggestedName,
        imageUrl: activeItem.imageUrl,
        topic: activeItem.topic,
        flaggedAt: Date.now()
      }
    };
    setFlaggedBadMap(updated);
    try {
      localStorage.setItem('lifequest_flagged_bad_images', JSON.stringify(updated));
    } catch (_) {}

    showToast(`⚠️ התמונה "${activeItem.suggestedName}" סומנה כגרועה להחלפה!`);
    advanceToNext();
  };

  // Restore image handler (if viewing bad or trash)
  const handleRestoreImage = (itemToRestore) => {
    const target = itemToRestore || activeItem;
    if (!target) return;

    if (discardedIds.has(target.id)) {
      const updated = new Set(discardedIds);
      updated.delete(target.id);
      setDiscardedIds(updated);
      try {
        localStorage.setItem('lifequest_discarded_staged_images', JSON.stringify([...updated]));
      } catch (_) {}
    }

    if (flaggedBadMap[target.id]) {
      const updated = { ...flaggedBadMap };
      delete updated[target.id];
      setFlaggedBadMap(updated);
      try {
        localStorage.setItem('lifequest_flagged_bad_images', JSON.stringify(updated));
      } catch (_) {}
    }

    showToast(`↩️ התמונה "${target.suggestedName}" שוחזרה בהצלחה לתור התיוק!`);
  };

  const showToast = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2800);
  };

  const advanceToNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Save current item and advance to the next unfiled one!
  const handleSaveAndNext = async () => {
    if (!activeItem || isSaving) return;

    const titleToSave = currentTitle.trim() || activeItem.suggestedName;
    if (!titleToSave) return;

    setIsSaving(true);
    try {
      const record = {
        id: activeItem.existingRecord?.id || `staged_${activeItem.id}`,
        title: titleToSave,
        domain: currentDomain,
        keywords: currentKeywords,
        caption: currentCaption.trim(),
        imageUrl: selectedOptionUrl || activeItem.imageUrl,
        uploaderName: uploaderName || 'משתמש'
      };

      await onSaveImage(record);

      setSaveSuccessAnim(true);

      setTimeout(() => {
        setSaveSuccessAnim(false);
        setIsSaving(false);

        const nextUnfiledIndex = filteredItems.findIndex((item, idx) => idx > currentIndex && !item.isFiled);
        if (nextUnfiledIndex !== -1) {
          setCurrentIndex(nextUnfiledIndex);
        } else {
          const firstUnfiled = filteredItems.findIndex(item => !item.isFiled);
          if (firstUnfiled !== -1) {
            setCurrentIndex(firstUnfiled);
          } else if (currentIndex < filteredItems.length - 1) {
            setCurrentIndex(currentIndex + 1);
          }
        }
      }, 300);
    } catch (err) {
      console.error('Save error in RapidFilingDesk:', err);
      setIsSaving(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Keyboard shortcut: Ctrl+Enter to save & next
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleSaveAndNext();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeItem, currentTitle, currentDomain, currentKeywords, currentCaption]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: '#f8fafc' }} dir="rtl">
      
      {/* Toast Notification */}
      {feedbackToast && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#1e293b',
            color: '#38bdf8',
            border: '2px solid #38bdf8',
            padding: '10px 22px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.95rem',
            zIndex: 100,
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* 1. Header & Progress Stats Bar */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          padding: '14px 20px',
          borderRadius: '14px',
          border: '1px solid #1e293b',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              שולחן עבודה ותיוק מהיר
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
              הגדר אסוציאציות רלוונטיות ליומיום, סנן תמונות לא מתאימות, ותייק בלחיצה אחת
            </p>
          </div>
        </div>

        {/* Progress pill & bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
              <span>התקדמות תיוק:</span>
              <strong style={{ color: '#38bdf8' }}>{filedCount} / {activeAvailableCount} ({progressPercent}%)</strong>
            </div>
            <div style={{ height: '8px', backgroundColor: '#1e293b', borderRadius: '999px', overflow: 'hidden' }}>
              <div 
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  backgroundColor: '#10b981',
                  borderRadius: '999px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
          </div>

          <div 
            style={{
              padding: '6px 14px',
              backgroundColor: pendingCount === 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              border: pendingCount === 0 ? '1px solid #10b981' : '1px solid #f59e0b',
              borderRadius: '999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: pendingCount === 0 ? '#34d399' : '#fde68a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {pendingCount === 0 ? (
              <>
                <CheckCircle2 size={15} />
                <span>הכל מתויק! 🎉</span>
              </>
            ) : (
              <>
                <Clock size={15} />
                <span>{pendingCount} ממתינים</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Topic Filter Tabs (including Basic as default, Canonical 500 Thematic packs & Status) */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { 
            id: 'basic', 
            label: `⭐️ בסיסי (${stagedWithStatus.filter(i => i.is_basic && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🌟',
            isSpecial: true,
            isCore: true
          },
          { 
            id: 'fictional_pop', 
            label: `🎬 דמויות פופ (${stagedWithStatus.filter(i => i.theme === 'fictional_pop' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🎬' 
          },
          { 
            id: 'landmarks', 
            label: `🏢 מבנים ואתרים (${stagedWithStatus.filter(i => i.theme === 'landmarks' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🏢' 
          },
          { 
            id: 'art_archeology', 
            label: `🎨 יצירות אמנות (${stagedWithStatus.filter(i => i.theme === 'art_archeology' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🎨' 
          },
          { 
            id: 'concepts_cliches', 
            label: `🧠 קלישאות ומושגים (${stagedWithStatus.filter(i => i.theme === 'concepts_cliches' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🧠' 
          },
          { 
            id: 'vehicles', 
            label: `🚗 כלי תחבורה (${stagedWithStatus.filter(i => i.theme === 'vehicles' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🚗' 
          },
          { 
            id: 'nature_animals', 
            label: `🌿 טבע וחיות (${stagedWithStatus.filter(i => i.theme === 'nature_animals' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🌿' 
          },
          { 
            id: 'sports_games', 
            label: `⚽ ספורט ומשחקים (${stagedWithStatus.filter(i => i.theme === 'sports_games' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '⚽' 
          },
          { 
            id: 'tools_objects', 
            label: `🛠️ חפצים וכלים (${stagedWithStatus.filter(i => i.theme === 'tools_objects' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🛠️' 
          },
          { 
            id: 'religion_spirituality', 
            label: `🔱 סמלים ורוחניות (${stagedWithStatus.filter(i => i.theme === 'religion_spirituality' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🔱' 
          },
          { 
            id: 'science_tech', 
            label: `🧪 מדע וחלל (${stagedWithStatus.filter(i => i.theme === 'science_tech' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '🧪' 
          },
          { 
            id: 'signs_icons', 
            label: `⚠️ שלטים בינלאומיים (${stagedWithStatus.filter(i => i.theme === 'signs_icons' && !i.isDiscarded && (!hideFiled || !i.isFiled)).length})`, 
            icon: '⚠️' 
          },
          { 
            id: 'all', 
            label: `🌐 כל ה-500 (${activeAvailableCount})`, 
            icon: '🌐' 
          },
          { 
            id: 'filed', 
            label: `✔️ תויקו (${filedCount})`, 
            icon: '✔️' 
          }
        ].map(tab => {
          const isActive = activeTopic === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTopic(tab.id);
                setCurrentIndex(0);
              }}
              style={{
                padding: '7px 14px',
                borderRadius: '9px',
                border: isActive 
                  ? (tab.isSpecial ? '1px solid #f59e0b' : '1px solid #38bdf8')
                  : '1px solid #334155',
                backgroundColor: isActive 
                  ? (tab.isSpecial ? '#b45309' : '#0284c7')
                  : (tab.isSpecial && pendingCount > 0 ? 'rgba(245, 158, 11, 0.15)' : '#1e293b'),
                color: isActive 
                  ? '#ffffff' 
                  : (tab.isSpecial && pendingCount > 0 ? '#fde68a' : '#94a3b8'),
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}

        {/* Separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#334155', margin: '0 4px' }} />

        {/* Checkbox: Hide Already Filed Items */}
        <label 
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            cursor: 'pointer', 
            padding: '7px 12px', 
            borderRadius: '9px', 
            backgroundColor: hideFiled ? 'rgba(16, 185, 129, 0.15)' : '#1e293b', 
            border: hideFiled ? '1px solid #10b981' : '1px solid #334155', 
            color: hideFiled ? '#34d399' : '#94a3b8', 
            fontSize: '0.82rem', 
            fontWeight: 700,
            userSelect: 'none'
          }}
          title="כאשר מסומן, מוצגות רק התמונות החדשות שטרם נשמרו במאגר"
        >
          <input 
            type="checkbox" 
            checked={hideFiled} 
            onChange={e => {
              setHideFiled(e.target.checked);
              setCurrentIndex(0);
            }} 
            style={{ accentColor: '#10b981', cursor: 'pointer' }}
          />
          <span>הסתר תמונות שכבר תויקו</span>
        </label>

        {/* Separator */}
        <div style={{ width: '1px', height: '24px', backgroundColor: '#334155', margin: '0 4px' }} />

        {/* Flagged Bad Filter Button */}
        {flaggedBadCount > 0 && (
          <button
            onClick={() => {
              setActiveTopic('bad');
              setCurrentIndex(0);
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '9px',
              border: activeTopic === 'bad' ? '1px solid #f59e0b' : '1px solid #78350f',
              backgroundColor: activeTopic === 'bad' ? '#b45309' : 'rgba(245, 158, 11, 0.15)',
              color: '#fef3c7',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <ThumbsDown size={14} />
            <span>סומנו כגרועות ({flaggedBadCount})</span>
          </button>
        )}

        {/* Trash / Discarded Filter Button */}
        {discardedCount > 0 && (
          <button
            onClick={() => {
              setActiveTopic('trash');
              setCurrentIndex(0);
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '9px',
              border: activeTopic === 'trash' ? '1px solid #ef4444' : '1px solid #7f1d1d',
              backgroundColor: activeTopic === 'trash' ? '#b91c1c' : 'rgba(239, 68, 68, 0.15)',
              color: '#fee2e2',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <Trash2 size={14} />
            <span>סל מחוקים ({discardedCount})</span>
          </button>
        )}
      </div>

      {/* 3. Main Workspace Split View */}
      {activeItem ? (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1fr) minmax(400px, 1.25fr)',
            gap: '20px',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            position: 'relative'
          }}
        >
          {/* Success Flash Overlay */}
          {saveSuccessAnim && (
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 20,
                pointerEvents: 'none',
                animation: 'pulse 0.3s ease'
              }}
            >
              <div 
                style={{
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                }}
              >
                <CheckCircle2 size={24} />
                <span>נשמר ותויק בהצלחה! עובר לבא...</span>
              </div>
            </div>
          )}

          {/* Left / Center View: High-Res Image Anchor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div 
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                backgroundColor: '#020617',
                border: '2px solid #334155',
                maxHeight: '350px',
                aspectRatio: '1 / 1',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 20px rgba(0,0,0,0.6)'
              }}
            >
              <img 
                src={selectedOptionUrl || activeItem.imageUrl}
                alt={activeItem.suggestedName}
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '350px',
                  objectFit: 'contain',
                  backgroundColor: '#020617'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />

              {/* Status Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '5px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  backgroundColor: activeItem.isFiled ? '#059669' : '#d97706',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  zIndex: 11
                }}
              >
                {activeItem.isFiled ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                <span>{activeItem.isFiled ? 'תויק במאגר' : 'ממתין לתיוק'}</span>
              </div>

              {/* Topic Badge */}
              <div 
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#93c5fd',
                  border: '1px solid rgba(147, 197, 253, 0.3)',
                  zIndex: 11
                }}
              >
                {activeItem.topic === 'celebrities' && '⭐ סלבס'}
                {activeItem.topic === 'fictional' && '🦸 דמות בדיונית'}
                {activeItem.topic === 'associative' && '🔮 תמונה אסוציאטיבית'}
              </div>

              {/* Flagged Bad Indicator on Image */}
              {activeItem.isFlaggedBad && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '46px',
                    left: '12px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    zIndex: 11,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ThumbsDown size={11} />
                  <span>סומן כגרוע</span>
                </div>
              )}

              {/* LIVE OVERLAY: Words & Associations Directly ON The Picture! */}
              {currentKeywords.length > 0 && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '5px',
                    backgroundColor: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(56, 189, 248, 0.5)',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.6)',
                    maxHeight: '110px',
                    overflowY: 'auto',
                    zIndex: 10
                  }}
                >
                  <div style={{ width: '100%', fontSize: '0.72rem', color: '#38bdf8', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} />
                    <span>המילים ששייכת לתמונה זו ({currentKeywords.length}):</span>
                  </div>
                  {currentKeywords.map((kw, i) => (
                    <span 
                      key={i}
                      style={{
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Tag size={10} />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 3-Candidate Image Selector Row */}
            {activeItem.imageOptions && activeItem.imageOptions.length > 1 && (
              <div 
                style={{ 
                  backgroundColor: '#0f172a', 
                  padding: '10px 12px', 
                  borderRadius: '12px', 
                  border: '1px solid #334155',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#fde047', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎯</span>
                    <span>בחר את התמונה האיכותית ביותר (3 אופציות):</span>
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    לחץ לבחירה שתשמר במאגר
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {activeItem.imageOptions.map((optUrl, optIdx) => {
                    const isChosen = (selectedOptionUrl || activeItem.imageUrl) === optUrl;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => setSelectedOptionUrl(optUrl)}
                        style={{
                          position: 'relative',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: isChosen ? '3px solid #10b981' : '1px solid #475569',
                          backgroundColor: '#020617',
                          aspectRatio: '1 / 1',
                          boxShadow: isChosen ? '0 0 14px rgba(16, 185, 129, 0.65)' : 'none',
                          transform: isChosen ? 'scale(1.03)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img 
                          src={optUrl} 
                          alt={`אופציה ${optIdx + 1}`} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.opacity = '0.3';
                          }}
                        />
                        <div 
                          style={{ 
                            position: 'absolute', 
                            top: '4px', 
                            right: '4px', 
                            padding: '2px 6px', 
                            borderRadius: '5px', 
                            fontSize: '0.66rem', 
                            fontWeight: 800, 
                            backgroundColor: isChosen ? '#10b981' : 'rgba(0,0,0,0.75)', 
                            color: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.5)'
                          }}
                        >
                          {isChosen ? 'נבחרה ✔' : `אופציה ${optIdx + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Navigation Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: currentIndex === 0 ? '#1e293b' : '#334155',
                  color: currentIndex === 0 ? '#64748b' : '#ffffff',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowRight size={15} />
                <span>הקודם</span>
              </button>

              <span style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                {currentIndex + 1} מתוך {filteredItems.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentIndex === filteredItems.length - 1}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: currentIndex === filteredItems.length - 1 ? '#1e293b' : '#334155',
                  color: currentIndex === filteredItems.length - 1 ? '#64748b' : '#ffffff',
                  cursor: currentIndex === filteredItems.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>הבא</span>
                <ArrowLeft size={15} />
              </button>
            </div>
          </div>

          {/* Right Panel: Rapid Filing Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Top Action & Quality Control Bar */}
            <div 
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                padding: '8px 12px',
                borderRadius: '12px',
                border: '2px solid #10b981',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)'
              }}
            >
              {/* Primary Save Button */}
              <button
                type="button"
                onClick={handleSaveAndNext}
                disabled={isSaving}
                style={{
                  flex: 2,
                  minWidth: '180px',
                  padding: '10px 16px',
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '9px',
                  fontSize: '0.94rem',
                  fontWeight: 900,
                  cursor: isSaving ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.5)',
                  transition: 'all 0.15s ease'
                }}
              >
                <CheckCircle2 size={18} />
                <span>💾 סיימתי! שמור ועבור לבא (Ctrl+Enter)</span>
              </button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === filteredItems.length - 1}
                style={{
                  padding: '10px 14px',
                  backgroundColor: '#334155',
                  color: '#e2e8f0',
                  border: '1px solid #475569',
                  borderRadius: '9px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="דלג לתמונה הבאה מבלי לשמור כעת"
              >
                <span>דלג</span>
                <ArrowLeft size={15} />
              </button>

              {/* Flag as Bad Button */}
              {activeItem.isFlaggedBad || activeItem.isDiscarded ? (
                <button
                  type="button"
                  onClick={() => handleRestoreImage(activeItem)}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  title="שחזר תמונה זו בחזרה לרשימת התיוק הרגילה"
                >
                  <RotateCcw size={15} />
                  <span>שחזר תמונה</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleFlagBadImage}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      border: '1px solid #f59e0b',
                      color: '#fef08a',
                      borderRadius: '9px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                    title="סמן שתמונה זו לא מתאימה או גרועה וצריך להחליף אותה"
                  >
                    <ThumbsDown size={14} />
                    <span>⚠️ תמונה גרועה/החלף</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDiscardImage}
                    style={{
                      padding: '10px 12px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                      borderRadius: '9px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="מחק תמונה זו לצמיתות מתור התיוק"
                  >
                    <Trash2 size={14} />
                    <span>🗑️ מחק</span>
                  </button>
                </>
              )}
            </div>

            {/* 1. Title / Name */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                1. שם התמונה / הדמות / החפץ:
              </label>
              <input 
                type="text"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                placeholder="למשל: אלברט איינשטיין, סופרמן, כתר מלוכה..."
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1px solid #3b82f6',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

            {/* 2. Category / Domain Picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', marginBottom: '4px' }}>
                2. קטגוריה:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' }}>
                {[
                  { id: 'celebrities', label: 'סלבס ⭐', color: '#f59e0b' },
                  { id: 'fictional', label: 'דמות בדיונית 🦸', color: '#8b5cf6' },
                  { id: 'associative', label: 'אסוציאטיבי 🔮', color: '#ec4899' },
                  { id: 'objects', label: 'חפצים ועוגנים 📦', color: '#10b981' },
                  { id: 'places', label: 'מקומות ואתרים 🏛️', color: '#3b82f6' },
                  { id: 'general', label: 'כללי 📌', color: '#64748b' }
                ].map(cat => {
                  const isSelected = currentDomain === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCurrentDomain(cat.id)}
                      style={{
                        padding: '6px 8px',
                        borderRadius: '8px',
                        border: isSelected ? `2px solid ${cat.color}` : '1px solid #334155',
                        backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.2)' : '#1e293b',
                        color: isSelected ? '#ffffff' : '#94a3b8',
                        fontSize: '0.8rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.12s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Keywords / Associations */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8' }}>
                  3. אסוציאציות ומילות מפתח (לחץ Enter או פסיק להוספה):
                </label>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>
                  {currentKeywords.length} מילים הוגדרו
                </span>
              </div>

              {/* Free Text Input */}
              <div 
                style={{
                  display: 'flex',
                  gap: '6px',
                  marginBottom: '6px'
                }}
              >
                <input 
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeyDownInput}
                  placeholder="הקלד מילה (למשל: תור לרופא, מפתחות, חלב...) ולחץ Enter"
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '8px',
                    border: '1px solid #475569',
                    backgroundColor: '#1e293b',
                    color: '#ffffff',
                    fontSize: '0.86rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleAddKeyword()}
                  style={{
                    padding: '7px 12px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} />
                  <span>הוסף</span>
                </button>
              </div>

              {/* EVERYDAY PRACTICAL SUGGESTIONS BLOCK */}
              <div 
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #1e293b',
                  borderRadius: '9px',
                  padding: '8px 10px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', fontWeight: 800, color: '#fde047' }}>
                    <Lightbulb size={14} color="#eab308" />
                    <span>💡 הצעות אסוציאציות יומיומיות (לחץ על מילה להוספה מיידית):</span>
                  </div>

                  {/* Category Quick Chips */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {EVERYDAY_COMMON_CATEGORIES.map(cat => (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => setActiveEverydayCat(activeEverydayCat === cat.name ? null : cat.name)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '6px',
                          border: activeEverydayCat === cat.name ? '1px solid #38bdf8' : '1px solid #334155',
                          backgroundColor: activeEverydayCat === cat.name ? '#0284c7' : '#1e293b',
                          color: '#e2e8f0',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={cat.name}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.name.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggestions Chips List */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {everydaySuggestions.length === 0 ? (
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontStyle: 'italic' }}>
                      כל ההצעות בקטגוריה זו כבר נוספו לתמונה!
                    </span>
                  ) : (
                    everydaySuggestions.slice(0, 10).map((sug, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          backgroundColor: '#1e293b',
                          border: '1px solid rgba(56, 189, 248, 0.6)',
                          borderRadius: '999px',
                          overflow: 'hidden',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleAddKeyword(sug)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#e0f2fe',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title={`לחץ להוספת "${sug}"`}
                        >
                          <Plus size={11} color="#38bdf8" />
                          <span>{sug}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDismissSuggestion(sug)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#64748b',
                            padding: '3px 6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          title="הסר הצעה זו"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Tags Container */}
              <div 
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '6px',
                  minHeight: '38px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  padding: '6px 8px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  border: '1px solid #334155'
                }}
              >
                {currentKeywords.length === 0 ? (
                  <span style={{ color: '#64748b', fontSize: '0.78rem', fontStyle: 'italic', alignSelf: 'center' }}>
                    טרם נוספו אסוציאציות. בחר מההצעות למעלה או הקלד מילים משלך.
                  </span>
                ) : (
                  currentKeywords.map((kw, idx) => (
                    <span 
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        padding: '3px 9px',
                        borderRadius: '999px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      <Tag size={11} />
                      <span>{kw}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#bae6fd',
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Duplicate Prevention Engine Warning ("כדי לא למחזר") */}
              {detectedDuplicates.length > 0 && (
                <div 
                  style={{
                    marginTop: '6px',
                    padding: '6px 10px',
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid #ef4444',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <AlertTriangle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
                  <div>
                    <strong>שים לב למניעת כפילויות:</strong> המילה <strong>"{detectedDuplicates[0].matchedWord}"</strong> כבר קיימת עבור <strong>"{detectedDuplicates[0].item.title}"</strong>.
                  </div>
                </div>
              )}
            </div>

            {/* 4. Optional Narrative Anchor / Caption */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: '3px' }}>
                4. עוגן סיפורי / תיאור חזותי קצר (אופציונלי):
              </label>
              <input 
                type="text"
                value={currentCaption}
                onChange={(e) => setCurrentCaption(e.target.value)}
                placeholder="למשל: שיער לבן פרוע ולוח נוסחאות..."
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '8px',
                  border: '1px solid #334155',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  boxSizing: 'border-box',
                  outline: 'none'
                }}
              />
            </div>

          </div>
        </div>
      ) : (
        <div 
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            backgroundColor: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px'
          }}
        >
          <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#ffffff' }}>
            אין תמונות נוספות בקטגוריה זו
          </h3>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            בחר קטגוריה אחרת מלמעלה כדי להמשיך בתיוק!
          </p>
        </div>
      )}

      {/* 4. Filmstrip of All Thumbnails */}
      <div 
        style={{
          backgroundColor: '#0f172a',
          padding: '12px 16px',
          borderRadius: '14px',
          border: '1px solid #1e293b'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>
            רצועת תמונות לבחירה מהירה (לחץ על תמונה כדי לעבור אליה):
          </span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            {filteredItems.length} תמונות במסנן הנוכחי
          </span>
        </div>

        <div 
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '6px',
            scrollbarWidth: 'thin'
          }}
        >
          {filteredItems.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <div
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  position: 'relative',
                  width: '68px',
                  height: '68px',
                  flexShrink: 0,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '3px solid #38bdf8' : item.isFiled ? '2px solid #10b981' : item.isFlaggedBad ? '2px solid #f59e0b' : '1px solid #334155',
                  boxShadow: isSelected ? '0 0 12px rgba(56, 189, 248, 0.6)' : 'none',
                  backgroundColor: '#020617',
                  transition: 'all 0.15s ease'
                }}
                title={`${item.suggestedName} ${item.isFiled ? '(תויק ✔️)' : item.isFlaggedBad ? '(סומן כגרוע ⚠️)' : '(ממתין ⏳)'}`}
              >
                <img 
                  src={item.imageUrl}
                  alt={item.suggestedName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  loading="lazy"
                />

                {item.isFiled && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      backgroundColor: '#10b981',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Check size={11} color="#ffffff" strokeWidth={3} />
                  </div>
                )}

                {item.isFlaggedBad && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: '2px',
                      backgroundColor: '#f59e0b',
                      borderRadius: '50%',
                      width: '16px',
                      height: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="סומנה כגרועה"
                  >
                    <ThumbsDown size={9} color="#000000" />
                  </div>
                )}

                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    insetInline: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    padding: '2px 4px',
                    fontSize: '0.62rem',
                    color: '#ffffff',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'center'
                  }}
                >
                  {item.suggestedName}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
