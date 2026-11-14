import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  UploadCloud, 
  ImagePlus, 
  Image as ImageIcon, 
  Search, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Sparkles, 
  Filter, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { INITIAL_CREATION_DRAFT_ROOTS } from '../data/creationDraftRoots';
import { saveUserImage, optimizeImage } from '../utils/userImageRepository';

const DRAFTS_STORAGE_KEY = 'lifequest_creation_drafts_v7';
const COMPLETED_DRAFTS_STORAGE_KEY = 'lifequest_creation_completed_ids_v5';

export function CreationStudioDesk({ onSwitchTab, onImageAdded }) {
  // 1. Load Drafts from localStorage and merge any new items from INITIAL_CREATION_DRAFT_ROOTS
  const [drafts, setDrafts] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.id));
          const newItems = INITIAL_CREATION_DRAFT_ROOTS.filter(r => !existingIds.has(r.id));
          if (newItems.length > 0) {
            return [...newItems, ...parsed];
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading creation drafts:', e);
    }
    return INITIAL_CREATION_DRAFT_ROOTS;
  });

  // Track completed/saved draft IDs
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(COMPLETED_DRAFTS_STORAGE_KEY);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (_) {
      return new Set();
    }
  });

  // Search and Category Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState('pending'); // 'all' | 'pending' | 'completed'

  // Per-card pending image previews: { [id]: dataUrl }
  const [cardPreviews, setCardPreviews] = useState({});

  // Editing state for root title: cardId or null
  const [editingTitleId, setEditingTitleId] = useState(null);

  // New branch input per card: { [id]: string }
  const [branchInputs, setBranchInputs] = useState({});

  // Drag over visual state: cardId or null
  const [dragOverCardId, setDragOverCardId] = useState(null);

  // Saving indicator per card: { [id]: boolean }
  const [isSavingCard, setIsSavingCard] = useState({});

  // Toast feedback
  const [toast, setToast] = useState(null);

  // Modal for adding a custom new draft
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newDraftTitle, setNewDraftTitle] = useState('');
  const [newDraftCategory, setNewDraftCategory] = useState('משק בית, ניקיון ותחזוקה');
  const [newDraftBranches, setNewDraftBranches] = useState('');
  const [newDraftSearch, setNewDraftSearch] = useState('');

  // Persist drafts whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.warn('Failed to save drafts:', e);
    }
  }, [drafts]);

  // Persist completed IDs whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(COMPLETED_DRAFTS_STORAGE_KEY, JSON.stringify(Array.from(completedIds)));
    } catch (e) {
      console.warn('Failed to save completed drafts:', e);
    }
  }, [completedIds]);

  // Toast auto-hide
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    drafts.forEach(d => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set);
  }, [drafts]);

  // Filtered drafts
  const filteredDrafts = useMemo(() => {
    return drafts.filter(item => {
      const isCompleted = completedIds.has(item.id);

      if (statusFilter === 'pending' && isCompleted) return false;
      if (statusFilter === 'completed' && !isCompleted) return false;

      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchTitle = (item.title || '').toLowerCase().includes(q);
        const matchBranch = (item.keywords || []).some(k => k.toLowerCase().includes(q));
        const matchCat = (item.category || '').toLowerCase().includes(q);
        if (!matchTitle && !matchBranch && !matchCat) return false;
      }

      return true;
    });
  }, [drafts, completedIds, statusFilter, selectedCategory, searchQuery]);

  // Update root title
  const handleUpdateTitle = (id, newTitle) => {
    const clean = String(newTitle || '').trim();
    if (!clean) return;
    setDrafts(prev => prev.map(d => d.id === id ? { ...d, title: clean } : d));
    setEditingTitleId(null);
  };

  // Add branch to a card
  const handleAddBranch = (id) => {
    const inputVal = (branchInputs[id] || '').trim().replace(/^#/, '');
    if (!inputVal) return;
    if (inputVal.includes(' ')) {
      setToast({ message: '⚠️ חוק הזיכרון: ענף חייב להיות מילה אחת בלבד ללא רווחים!' });
      return;
    }

    setDrafts(prev => prev.map(d => {
      if (d.id !== id) return d;
      const current = Array.isArray(d.keywords) ? d.keywords : [];
      if (current.includes(inputVal)) return d;
      return { ...d, keywords: [...current, inputVal].slice(0, 5) };
    }));

    setBranchInputs(prev => ({ ...prev, [id]: '' }));
  };

  // Remove branch
  const handleRemoveBranch = (id, branchToRemove) => {
    setDrafts(prev => prev.map(d => {
      if (d.id !== id) return d;
      return { ...d, keywords: (d.keywords || []).filter(k => k !== branchToRemove) };
    }));
  };

  // Handle dropped or selected file with INSTANT AUTO-SAVE
  const processImageFile = async (id, fileOrUrl) => {
    try {
      let rawImage = '';

      if (typeof fileOrUrl === 'string') {
        rawImage = fileOrUrl;
      } else if (fileOrUrl instanceof File || fileOrUrl instanceof Blob) {
        rawImage = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(fileOrUrl);
        });
      }

      if (!rawImage) return;

      // 1. Show preview immediately
      setCardPreviews(prev => ({ ...prev, [id]: rawImage }));

      // 2. Find draft item definition
      const targetItem = drafts.find(d => d.id === id);
      if (!targetItem) return;

      // 3. INSTANT AUTO-SAVE directly to IndexedDB & Firestore (Zero lost work!)
      setIsSavingCard(prev => ({ ...prev, [id]: true }));
      try {
        const optimized = await optimizeImage(rawImage, 800, 800, 0.82);
        await saveUserImage({
          title: targetItem.title,
          imageUrl: optimized,
          keywords: targetItem.keywords,
          category: targetItem.category,
          isUserApproved: true,
          source: 'user_uploaded'
        });

        // Mark as completed
        setCompletedIds(prev => {
          const next = new Set(prev);
          next.add(id);
          return next;
        });

        setToast({ message: `⚡ נשמר אוטומטית למאגר: "${targetItem.title}"` });

        if (typeof onImageAdded === 'function') {
          onImageAdded();
        }
      } catch (err) {
        console.error('Auto-save error for', targetItem.title, err);
        setToast({ message: `⚠️ שגיאה בשמירה: ${err.message}` });
      } finally {
        setIsSavingCard(prev => ({ ...prev, [id]: false }));
      }
    } catch (e) {
      console.error('Error processing image:', e);
      setToast({ message: 'שגיאה בטעינת התמונה' });
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverCardId !== id) setDragOverCardId(id);
  };

  const handleDragLeave = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (dragOverCardId === id) setDragOverCardId(null);
  };

  const handleDrop = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverCardId(null);

    // 1. Check local files
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await processImageFile(id, file);
        return;
      }
    }

    // 2. Check HTML/URL drag from another browser tab
    const uri = e.dataTransfer.getData('text/uri-list');
    if (uri && (uri.startsWith('http://') || uri.startsWith('https://') || uri.startsWith('data:image/'))) {
      await processImageFile(id, uri);
      return;
    }

    const html = e.dataTransfer.getData('text/html');
    if (html) {
      const match = html.match(/src=["'](https?:\/\/[^"']+)["']/i);
      if (match && match[1]) {
        await processImageFile(id, match[1]);
        return;
      }
    }

    setToast({ message: 'אנא גרור קובץ תמונה תקין או קישור ישיר לתמונה' });
  };

  // 1-Click Search link generator with "animated classic" formula
  const openSearch = (query, engine = 'google') => {
    let finalQuery = query || '';
    if (engine === 'google') {
      const cleanCore = finalQuery
        .replace(/\b(vintage|stainless steel|heavy duty|desktop|professional|circular|wooden|electric|plastic)\b/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
      finalQuery = `${cleanCore} animated classic`;
    }
    const q = encodeURIComponent(finalQuery);
    const url = engine === 'google'
      ? `https://www.google.com/search?tbm=isch&q=${q}`
      : `https://commons.wikimedia.org/w/index.php?search=${encodeURIComponent(query)}&title=Special:MediaSearch&type=image`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Save Card to Live Repository
  const handleSaveToRepository = async (item) => {
    const preview = cardPreviews[item.id] || item.imageUrl;
    if (!preview) {
      setToast({ message: '⚠️ יש לגרור או להעלות תמונה לפני השמירה' });
      return;
    }

    setIsSavingCard(prev => ({ ...prev, [item.id]: true }));

    try {
      // 1. Optimize image client-side to keep lightweight
      const optimized = await optimizeImage(preview, 800, 800, 0.82);

      // 2. Save directly to Firestore + IndexedDB active repository
      await saveUserImage({
        title: item.title,
        imageUrl: optimized,
        keywords: item.keywords,
        category: item.category,
        isUserApproved: true,
        source: 'user_uploaded'
      });

      // 3. Mark as completed
      setCompletedIds(prev => {
        const next = new Set(prev);
        next.add(item.id);
        return next;
      });

      setToast({ message: `✨ העוגן "${item.title}" נשמר בהצלחה במאגר הפעיל!` });

      if (typeof onImageAdded === 'function') {
        onImageAdded();
      }
    } catch (e) {
      console.error('Save to repository error:', e);
      setToast({ message: `❌ שגיאה בשמירה: ${e.message}` });
    } finally {
      setIsSavingCard(prev => ({ ...prev, [item.id]: false }));
    }
  };

  // Reset to initial 50 drafts
  const handleResetDrafts = () => {
    if (window.confirm('האם לאפס את רשימת השורשים לברירת המחדל (50 עוגני מטלות יומיומיות)?')) {
      setDrafts(INITIAL_CREATION_DRAFT_ROOTS);
      setCompletedIds(new Set());
      setCardPreviews({});
      localStorage.removeItem(DRAFTS_STORAGE_KEY);
      localStorage.removeItem(COMPLETED_DRAFTS_STORAGE_KEY);
      setToast({ message: 'מאגר הטיוטות אופס ל-50 העוגנים המקוריים' });
    }
  };

  // Add custom draft
  const handleCreateCustomDraft = (e) => {
    e.preventDefault();
    if (!newDraftTitle.trim()) return;

    const branches = newDraftBranches
      .split(/[,;\s]+/)
      .map(b => b.trim().replace(/^#/, ''))
      .filter(Boolean)
      .slice(0, 5);

    const newId = `custom_draft_${Date.now()}`;
    const newEntry = {
      id: newId,
      title: newDraftTitle.trim(),
      category: newDraftCategory,
      keywords: branches,
      searchQuery: newDraftSearch.trim() || newDraftTitle.trim()
    };

    setDrafts(prev => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    setNewDraftTitle('');
    setNewDraftBranches('');
    setNewDraftSearch('');
    setToast({ message: `שורש חדש "${newEntry.title}" נוסף בהצלחה!` });
  };

  const pendingCount = drafts.filter(d => !completedIds.has(d.id)).length;
  const completedCount = completedIds.size;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', direction: 'rtl', fontFamily: 'Rubik, sans-serif' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#059669',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            zIndex: 9999,
            fontWeight: 700,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Sparkles size={16} />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Controls & Banner */}
      <div 
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '20px 24px',
          border: '1px solid #334155',
          marginBottom: '22px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '1.35rem', color: '#f8fafc', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🎨 סטודיו יצירה והזנת שורשים (Zero-Quota Drop Studio)</span>
              <span style={{ fontSize: '0.78rem', backgroundColor: '#10b981', color: '#0f172a', padding: '3px 10px', borderRadius: '999px', fontWeight: 900 }}>
                {pendingCount} ממתינים לתמונה
              </span>
            </h2>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.86rem' }}>
              השורשים והענפים כבר מוגדרים לפי חוקי הזיכרון. לחץ על כפתור החיפוש 🔍, מצא תמונה קלאסית, וגרור אותה ישירות אל הכרטיס!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.open('/creation_contact_sheet.html', '_blank')}
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.4)'
              }}
              title="פתח לוח Contact Sheet מלא בכל 81 התמונות לבקרה מהירה"
            >
              <ExternalLink size={16} />
              <span>פתח לוח סקירה (Contact Sheet) ↗</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '9px 16px',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <Plus size={16} />
              <span>הוסף שורש ידני +</span>
            </button>

            <button
              onClick={handleResetDrafts}
              style={{
                backgroundColor: '#334155',
                color: '#cbd5e1',
                border: '1px solid #475569',
                borderRadius: '10px',
                padding: '9px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="איפוס ל-50 עוגני ברירת מחדל"
            >
              <RotateCcw size={15} />
              <span>איפוס ל-50</span>
            </button>
          </div>
        </div>

        {/* Search & Category Filter Pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            
            {/* Search Input */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <Search 
                size={17} 
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} 
              />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="חפש שורש, ענף או קטגוריה..."
                style={{
                  width: '100%',
                  backgroundColor: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '10px',
                  color: '#ffffff',
                  padding: '9px 38px 9px 14px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Status Pills */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'pending', label: `⏳ ממתינים לתמונה (${pendingCount})` },
                { id: 'completed', label: `✓ הושלמו (${completedCount})` },
                { id: 'all', label: `הכל (${drafts.length})` }
              ].map(st => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id)}
                  style={{
                    backgroundColor: statusFilter === st.id ? '#0284c7' : '#0f172a',
                    color: statusFilter === st.id ? '#ffffff' : '#94a3b8',
                    border: statusFilter === st.id ? '1px solid #38bdf8' : '1px solid #334155',
                    borderRadius: '8px',
                    padding: '8px 14px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills (Matches Screenshot) */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, marginLeft: '4px' }}>
              קטגוריות:
            </span>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? '#334155' : '#0f172a',
                color: selectedCategory === 'all' ? '#38bdf8' : '#94a3b8',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '4px 11px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              הכל
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#0284c7' : '#0f172a',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                  border: selectedCategory === cat ? '1px solid #38bdf8' : '1px solid #334155',
                  borderRadius: '8px',
                  padding: '4px 11px',
                  fontSize: '0.78rem',
                  fontWeight: selectedCategory === cat ? 800 : 500,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredDrafts.length === 0 ? (
        <div 
          style={{
            backgroundColor: '#1e293b',
            borderRadius: '16px',
            padding: '60px 20px',
            textAlign: 'center',
            border: '1px dashed #475569',
            color: '#94a3b8'
          }}
        >
          <Sparkles size={36} color="#38bdf8" style={{ marginBottom: '12px' }} />
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px', color: '#f8fafc', fontWeight: 700 }}>
            {statusFilter === 'pending' ? 'כל השורשים הושלמו בהצלחה!' : 'לא נמצאו שורשים תואמים'}
          </p>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            {statusFilter === 'pending' 
              ? 'עבור ללשונית "גריד המאגר הפעיל" כדי לצפות בהם או הוסף שורשים חדשים.' 
              : 'נסה לשנות את הסינון או החיפוש.'}
          </p>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredDrafts.map(item => {
            const isCompleted = completedIds.has(item.id);
            const preview = cardPreviews[item.id] || item.imageUrl;
            const isDragOver = dragOverCardId === item.id;
            const isSaving = isSavingCard[item.id];
            const isEditingTitle = editingTitleId === item.id;
            const cardInputVal = branchInputs[item.id] || '';

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '14px',
                  border: isDragOver 
                    ? '2px dashed #38bdf8' 
                    : isCompleted 
                      ? '1px solid #059669' 
                      : preview 
                        ? '1px solid #10b981' 
                        : '1px solid #334155',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.18s ease',
                  boxShadow: isDragOver ? '0 0 20px rgba(56, 189, 248, 0.3)' : '0 4px 12px rgba(0,0,0,0.25)',
                  position: 'relative'
                }}
              >
                {/* Top Image Drop Zone (Height 170px) */}
                <div
                  onDragOver={(e) => handleDragOver(e, item.id)}
                  onDragLeave={(e) => handleDragLeave(e, item.id)}
                  onDrop={(e) => handleDrop(e, item.id)}
                  style={{
                    height: '170px',
                    backgroundColor: isDragOver ? 'rgba(56, 189, 248, 0.08)' : '#0a0f1d',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: preview ? 'default' : 'pointer'
                  }}
                  onClick={() => {
                    if (!preview) {
                      const input = document.getElementById(`file_input_${item.id}`);
                      if (input) input.click();
                    }
                  }}
                >
                  <input 
                    type="file" 
                    id={`file_input_${item.id}`}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        processImageFile(item.id, e.target.files[0]);
                      }
                    }}
                  />

                  {preview ? (
                    <>
                      <img 
                        src={preview} 
                        alt={item.title} 
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      {/* Top Overlay Badge & Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardPreviews(prev => {
                            const next = { ...prev };
                            delete next[item.id];
                            return next;
                          });
                        }}
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          backgroundColor: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '6px',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}
                        title="החלף תמונה"
                      >
                        <X size={12} />
                        <span>החלף</span>
                      </button>
                    </>
                  ) : (
                    <div 
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        padding: '16px',
                        textAlign: 'center',
                        color: isDragOver ? '#38bdf8' : '#94a3b8'
                      }}
                    >
                      <UploadCloud size={30} color={isDragOver ? '#38bdf8' : '#64748b'} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                        {isDragOver ? 'שחרר את התמונה כאן!' : 'גרור לכאן תמונה'}
                      </span>
                      <span style={{ fontSize: '0.70rem', color: '#64748b' }}>
                        (או לחץ להעלאה / הדבק)
                      </span>
                    </div>
                  )}

                  {/* Top-Right Status Badge */}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
                    {isCompleted ? (
                      <span 
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.95)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}
                      >
                        <Check size={11} />
                        <span>נשמר במאגר</span>
                      </span>
                    ) : preview ? (
                      <span 
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.95)',
                          color: '#0f172a',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}
                      >
                        <Sparkles size={11} />
                        <span>מוכן לשמירה!</span>
                      </span>
                    ) : (
                      <span 
                        style={{
                          backgroundColor: 'rgba(30, 41, 59, 0.85)',
                          color: '#94a3b8',
                          fontSize: '0.70rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #334155'
                        }}
                      >
                        ממתין לתמונה
                      </span>
                    )}
                  </div>
                </div>

                {/* 1-Click Search Bar (Directly below image box) */}
                <div 
                  style={{
                    backgroundColor: '#0f172a',
                    borderBottom: '1px solid #1e293b',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.72rem'
                  }}
                >
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Search size={12} />
                    <span>חפש תמונה:</span>
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openSearch(item.searchQuery || item.title, 'google')}
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#38bdf8',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '2px 7px',
                        cursor: 'pointer',
                        fontSize: '0.70rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title="פתח חיפוש תמונות ב-Google בלשונית חדשה"
                    >
                      <span>Google</span>
                      <ExternalLink size={10} />
                    </button>

                    <button
                      onClick={() => openSearch(item.searchQuery || item.title, 'wikimedia')}
                      style={{
                        backgroundColor: '#1e293b',
                        color: '#cbd5e1',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                        padding: '2px 7px',
                        cursor: 'pointer',
                        fontSize: '0.70rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                      title="פתח חיפוש ב-Wikimedia Commons"
                    >
                      <span>Commons</span>
                      <ExternalLink size={10} />
                    </button>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                  
                  {/* Root Title */}
                  <div>
                    {isEditingTitle ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input 
                          type="text"
                          defaultValue={item.title}
                          onBlur={(e) => handleUpdateTitle(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleUpdateTitle(item.id, e.currentTarget.value);
                          }}
                          autoFocus
                          style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #38bdf8',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '6px 8px',
                            fontSize: '0.92rem',
                            fontWeight: 700,
                            fontFamily: 'Rubik, sans-serif'
                          }}
                        />
                      </div>
                    ) : (
                      <div 
                        onClick={() => setEditingTitleId(item.id)}
                        style={{
                          fontWeight: 800,
                          fontSize: '0.98rem',
                          color: '#f8fafc',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="לחץ לעריכת השורש"
                      >
                        <span>{item.title}</span>
                        <Edit3 size={13} style={{ color: '#64748b' }} />
                      </div>
                    )}
                    {item.category && (
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        {item.category}
                      </span>
                    )}
                  </div>

                  {/* Branches Chips (ענפים מקושרים) */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                        ענפים מקושרים ({(item.keywords || []).length}):
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {(item.keywords || []).map((kw, i) => (
                        <span 
                          key={i}
                          style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            color: '#38bdf8',
                            fontSize: '0.74rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontWeight: 600
                          }}
                        >
                          <span>#{kw}</span>
                          <button
                            onClick={() => handleRemoveBranch(item.id, kw)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#64748b',
                              cursor: 'pointer',
                              padding: '0 2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="הסר ענף"
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}
                    </div>

                    {/* Add Branch Input */}
                    <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                      <input 
                        type="text"
                        value={cardInputVal}
                        onChange={(e) => setBranchInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddBranch(item.id);
                          }
                        }}
                        placeholder="+ ענף חדש (לחץ Enter)..."
                        style={{
                          flex: 1,
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          color: '#ffffff',
                          padding: '5px 8px',
                          fontSize: '0.76rem',
                          fontFamily: 'Rubik, sans-serif',
                          outline: 'none'
                        }}
                      />
                      <button
                        onClick={() => handleAddBranch(item.id)}
                        style={{
                          backgroundColor: '#334155',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#38bdf8',
                          padding: '0 9px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="הוסף ענף"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Spacer to push button to bottom */}
                  <div style={{ flex: 1 }} />

                  {/* Bottom Save Action Button */}
                  {preview ? (
                    <button
                      onClick={() => handleSaveToRepository(item)}
                      disabled={isSaving}
                      style={{
                        backgroundColor: isCompleted ? '#059669' : '#10b981',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: isSaving ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSaving ? (
                        <span>שומר ומסנכרן...</span>
                      ) : isCompleted ? (
                        <>
                          <CheckCircle2 size={16} />
                          <span>נשמר! לחץ לעדכון</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>⚡ אשר ושמור למאגר הפעיל</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => openSearch(item.searchQuery || item.title, 'google')}
                      style={{
                        backgroundColor: '#0f172a',
                        color: '#94a3b8',
                        border: '1px dashed #334155',
                        borderRadius: '8px',
                        padding: '9px 12px',
                        fontWeight: 600,
                        fontSize: '0.80rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Search size={13} color="#38bdf8" />
                      <span>חפש תמונה ב-Google ↗</span>
                    </button>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Custom Draft Modal */}
      {isAddModalOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px'
          }}
          onClick={() => setIsAddModalOpen(false)}
        >
          <div 
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
              direction: 'rtl'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                ➕ הוספת שורש וענפים חדשים
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomDraft} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 700 }}>
                  שורש חזותי קלאסי (למשל: "מכונת תספורת"):
                </label>
                <input 
                  type="text"
                  required
                  value={newDraftTitle}
                  onChange={(e) => setNewDraftTitle(e.target.value)}
                  placeholder="הקלד שורש..."
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 700 }}>
                  קטגוריה:
                </label>
                <select 
                  value={newDraftCategory}
                  onChange={(e) => setNewDraftCategory(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '0.88rem',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="משק בית, ניקיון ותחזוקה">משק בית, ניקיון ותחזוקה</option>
                  <option value="סידורים, בירוקרטיה וכספים">סידורים, בירוקרטיה וכספים</option>
                  <option value="בריאות, רפואה ורוקחות">בריאות, רפואה ורוקחות</option>
                  <option value="קניות וצריכה שוטפת">קניות וצריכה שוטפת</option>
                  <option value="רכב ותחבורה">רכב ותחבורה</option>
                  <option value="טיפוח אישי וכושר">טיפוח אישי וכושר</option>
                  <option value="משפחה, ילדים וחיות מחמד">משפחה, ילדים וחיות מחמד</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 700 }}>
                  ענפים מקושרים (מופרדים בפסיקים או רווחים, מילים בודדות):
                </label>
                <input 
                  type="text"
                  value={newDraftBranches}
                  onChange={(e) => setNewDraftBranches(e.target.value)}
                  placeholder="למשל: תספורת, זקן, זיפים"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '5px', fontWeight: 700 }}>
                  מילת חיפוש באנגלית (ל-Google Images):
                </label>
                <input 
                  type="text"
                  value={newDraftSearch}
                  onChange={(e) => setNewDraftSearch(e.target.value)}
                  placeholder="hair clipper trimmer"
                  style={{
                    width: '100%',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 12px',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    backgroundColor: '#334155',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#cbd5e1',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  ביטול
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#10b981',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '8px 20px',
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                >
                  הוסף שורש
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

