import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Trash2, 
  Edit3, 
  Check, 
  Plus, 
  X, 
  Search, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle,
  FolderPlus, 
  ArrowRight, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Eye,
  SlidersHorizontal,
  Download,
  Save,
  ExternalLink,
  Layers
} from 'lucide-react';
import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool';
import { STAGED_TRIPLET_POOL } from '../data/stagedTripletPool';
import { saveUserImage, deleteUserImage, getDiscardedStagedSet } from '../utils/userImageRepository';
import { getEverydaySuggestionsForItem } from '../data/everydayMnemonicSuggestions';

/**
 * BulkImageCurationDesk
 * 
 * שולחן עבודה ומיון מהיר בגריד לכלל מאגר התמונות (Human-in-the-loop rapid workbench).
 * מאפשר מעבר מהיר על כל 500+ התמונות בתצוגת גריד מרווחת, מחיקה מהירה בלחיצה אחת,
 * עריכת שורשים בזמן אמת, והצמדה/הסרה מיידית של ענפי אסוציאציות.
 */
function sanitizeLocalEditsMap(editsObj) {
  if (!editsObj || typeof editsObj !== 'object') return {};
  const cleaned = {};
  for (const [id, edit] of Object.entries(editsObj)) {
    if (!edit) continue;
    const itemTitle = String(edit.title || '');
    const titleWords = new Set(
      itemTitle.toLowerCase().replace(/[()\/\"'’`\-]/g, ' ').split(/\s+/).filter(w => w.length > 1)
    );
    let keywords = Array.isArray(edit.keywords) ? edit.keywords : [];
    keywords = Array.from(new Set(keywords.map(k => String(k).trim()).filter(Boolean)))
      .filter(k => {
        const lk = k.toLowerCase();
        if (lk === itemTitle.toLowerCase()) return false;
        if (titleWords.has(lk)) return false;
        if (lk.includes(' ')) return false;
        if (itemTitle.includes('איטריות') && (lk === 'איטריות' || lk === 'אטריות' || lk === 'נודלס')) return false;
        if (itemTitle.includes('מגדלור') && (lk === 'מגדלור' || lk === 'מגדל-אור')) return false;
        if (itemTitle.includes('פצצה') && lk === 'פצצה') return false;
        return true;
      })
      .slice(0, 4);

    cleaned[id] = {
      ...edit,
      keywords
    };
  }
  return cleaned;
}

export function BulkImageCurationDesk({ 
  userImages = [], 
  uploaderName = '',
  onSwitchTab 
}) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'filed' | 'trash'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(36); // 36 items per page for great responsiveness

  // Inline Editing Card ID (null if none open)
  const [activeEditingId, setActiveEditingId] = useState(null);

  // New branch inputs per card: { [id]: string }
  const [branchInputs, setBranchInputs] = useState({});

  // Local Edits persisted to localStorage: { [id]: { title, keywords, isModified } }
  const [localEdits, setLocalEdits] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_staged_local_edits');
      return saved ? sanitizeLocalEditsMap(JSON.parse(saved)) : {};
    } catch (_) {
      return {};
    }
  });

  // Discarded (Trash) items persisted to localStorage: Set of item IDs
  const [discardedIds, setDiscardedIds] = useState(() => getDiscardedStagedSet());

  // Flagged "Bad / Needs Replacement" items persisted to localStorage: { [id]: { id, title, reason, flaggedAt, imageUrl, category } }
  const [flaggedBadMap, setFlaggedBadMap] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_flagged_bad_images');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const cleaned = {};
      const resolvedClassicIds = new Set([
        'scooby_doo', 'mickey_mouse', 'sonic_the_hedgehog', 'barbie_doll', 'winnie_the_pooh', 'spongebob', 'peter_pan'
      ]);
      for (const [k, v] of Object.entries(parsed)) {
        // Clear flags for items that were already fixed with classic images
        if (resolvedClassicIds.has(k)) continue;
        if (v && v.flaggedAt && v.flaggedAt > 1794415000000) {
          cleaned[k] = v;
        }
      }
      return cleaned;
    } catch (_) {
      return {};
    }
  });

  // Toast feedback
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (message, type = 'success', undoAction = null) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type, undoAction });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Persist discarded IDs
  useEffect(() => {
    try {
      localStorage.setItem('lifequest_discarded_staged_images', JSON.stringify(Array.from(discardedIds)));
    } catch (_) {}
  }, [discardedIds]);

  // Persist flagged bad items
  useEffect(() => {
    try {
      localStorage.setItem('lifequest_flagged_bad_images', JSON.stringify(flaggedBadMap));
    } catch (_) {}
  }, [flaggedBadMap]);

  // Persist local edits
  useEffect(() => {
    try {
      localStorage.setItem('lifequest_staged_local_edits', JSON.stringify(localEdits));
    } catch (_) {}
  }, [localEdits]);

  // Synchronize curation state directly to local dev server / project files
  const syncToDisk = async (silent = false) => {
    try {
      const payload = {
        discardedIds: Array.from(discardedIds),
        flaggedBadMap,
        localEdits,
        totalItems: STAGED_IMAGES_POOL.length,
        timestamp: Date.now()
      };
      const res = await fetch('/api/sync-curation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok && !silent) {
        showToast('🚀 סונכרן ישירות לסוכן ולקבצי הפרויקט!', 'success');
      }
    } catch (err) {
      if (!silent) console.warn('Sync to disk error:', err);
    }
  };

  // Debounced Auto-sync on changes
  const autoSyncTimerRef = useRef(null);
  useEffect(() => {
    if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    autoSyncTimerRef.current = setTimeout(() => {
      syncToDisk(true);
    }, 1200);
    return () => {
      if (autoSyncTimerRef.current) clearTimeout(autoSyncTimerRef.current);
    };
  }, [discardedIds, flaggedBadMap, localEdits]);

  // Map of already filed user images (by imageUrl, clean title, id)
  const filedMap = useMemo(() => {
    const map = new Map();
    userImages.forEach(img => {
      if (img.imageUrl) map.set(img.imageUrl, img);
      if (img.title) map.set(img.title.trim().toLowerCase(), img);
      if (img.id) map.set(img.id, img);
    });
    return map;
  }, [userImages]);

  // Map of triplets for rich candidate associations
  const tripletMap = useMemo(() => {
    return new Map(STAGED_TRIPLET_POOL.map(t => [t.id, t]));
  }, []);

  // Compute categories list from the active user repository pool
  const basePool = useMemo(() => {
    return (userImages && userImages.length > 0) ? userImages : STAGED_IMAGES_POOL;
  }, [userImages]);

  const categoriesList = useMemo(() => {
    const cats = new Set();
    basePool.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [basePool]);

  // Unified items with current effective data from the active pool
  const unifiedItems = useMemo(() => {
    return basePool.map(item => {
      const id = item.id;
      const edits = localEdits[id] || {};
      const filedItem = filedMap.get(item.imageUrl) || filedMap.get(id) || filedMap.get((item.suggestedName || item.name || '').trim().toLowerCase()) || item;
      
      const isFiled = true; // All items in basePool are in the active repository!
      const isDiscarded = discardedIds.has(id);
      const isFlaggedBad = Boolean(flaggedBadMap[id]);
      const flagInfo = flaggedBadMap[id] || null;

      // Title priority: local edit > filed item title > suggestedName > name
      const title = edits.title !== undefined ? edits.title : (filedItem?.title || item.suggestedName || item.name_he || item.name || 'ללא שם');
      
      // Keywords priority: local edit > filed item keywords > everyday_associations > associations
      let keywords = edits.keywords !== undefined 
        ? edits.keywords 
        : (filedItem?.keywords && filedItem.keywords.length > 0)
          ? filedItem.keywords 
          : (item.everyday_associations && item.everyday_associations.length > 0)
            ? item.everyday_associations
            : (item.associations || []);

      // Clean keywords: unique, non-empty, single-word, no root title overlaps, max 4
      const titleWords = new Set(
        title.toLowerCase().replace(/[()\/\"'’`\-]/g, ' ').split(/\s+/).filter(w => w.length > 1)
      );
      const cleanKeywords = Array.from(new Set(keywords.map(k => String(k).trim()).filter(Boolean)))
        .filter(k => {
          const lk = k.toLowerCase();
          if (lk === title.toLowerCase()) return false;
          if (titleWords.has(lk)) return false;
          if (lk.includes(' ')) return false;
          if (title.includes('איטריות') && (lk === 'איטריות' || lk === 'אטריות' || lk === 'נודלס')) return false;
          if (title.includes('מגדלור') && (lk === 'מגדלור' || lk === 'מגדל-אור')) return false;
          if (title.includes('פצצה') && lk === 'פצצה') return false;
          if (title.includes('כדורסל') && lk === 'כדורסל') return false;
          if (title.includes('כדורגל') && lk === 'כדורגל') return false;
          return true;
        })
        .slice(0, 4);

      return {
        ...item,
        title,
        keywords: cleanKeywords,
        isFiled,
        isDiscarded,
        isFlaggedBad,
        flagInfo,
        filedItem,
        hasLocalEdits: Boolean(edits.isModified)
      };
    });
  }, [localEdits, filedMap, discardedIds, flaggedBadMap]);

  // Filtered Items based on Status, Search, and Category
  const filteredItems = useMemo(() => {
    const cleanQuery = searchQuery.trim().toLowerCase();

    return unifiedItems.filter(item => {
      // 1. Status Filter
      if (statusFilter === 'ai_curated' && !item.aiCurated) return false;
      if (statusFilter === 'flagged' && !item.isFlaggedBad) return false;
      if (statusFilter === 'pending' && (item.isFiled || item.isDiscarded)) return false;
      if (statusFilter === 'filed' && !item.isFiled) return false;
      if (statusFilter === 'trash' && !item.isDiscarded) return false;
      // In 'all' view, hide discarded items by default unless explicitly searching
      if (statusFilter === 'all' && item.isDiscarded && !cleanQuery) return false;

      // 2. Category Filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // 3. Search Query
      if (cleanQuery) {
        const titleMatch = item.title.toLowerCase().includes(cleanQuery);
        const nameMatch = (item.name || '').toLowerCase().includes(cleanQuery);
        const idMatch = (item.id || '').toLowerCase().includes(cleanQuery);
        const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(cleanQuery));
        const categoryMatch = (item.category || '').toLowerCase().includes(cleanQuery);
        const reasonMatch = item.flagInfo?.reason?.toLowerCase().includes(cleanQuery);
        if (!titleMatch && !nameMatch && !idMatch && !keywordMatch && !categoryMatch && !reasonMatch) {
          return false;
        }
      }

      return true;
    });
  }, [unifiedItems, statusFilter, selectedCategory, searchQuery]);

  // Statistics counters
  const stats = useMemo(() => {
    let pendingCount = 0;
    let filedCount = 0;
    let trashCount = 0;
    let flaggedCount = 0;
    let aiCuratedCount = 0;

    unifiedItems.forEach(item => {
      if (item.aiCurated) aiCuratedCount++;
      if (item.isFlaggedBad) flaggedCount++;
      if (item.isDiscarded) trashCount++;
      else if (item.isFiled) filedCount++;
      else pendingCount++;
    });

    return {
      total: unifiedItems.length,
      pending: pendingCount,
      filed: filedCount,
      trash: trashCount,
      flagged: flaggedCount,
      aiCurated: aiCuratedCount
    };
  }, [unifiedItems]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, selectedCategory, pageSize]);

  // -------------------------------------------------------------
  // Fast Curation Actions
  // -------------------------------------------------------------

  // 1. Fast 1-Click Delete / Move to Trash
  const handleFastDelete = (item, e) => {
    e?.stopPropagation();
    const id = item.id;
    const title = item.title;

    setDiscardedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    showToast(`🗑️ "${title}" הועברה לסל המחזור`, 'info', () => {
      // Undo callback
      setDiscardedIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    });
  };

  // 2. Restore from Trash
  const handleRestoreFromTrash = (item, e) => {
    e?.stopPropagation();
    const id = item.id;
    setDiscardedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    showToast(`↩️ "${item.title}" שוחזרה מהסל!`, 'success');
  };

  // 3. Fast Root (Title) Edit
  const handleUpdateTitle = (itemId, newTitle) => {
    const clean = newTitle.trim();
    if (!clean) return;

    setLocalEdits(prev => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        title: clean,
        isModified: true
      }
    }));

    // If already filed in repository, sync live
    const existingFiled = filedMap.get(itemId);
    if (existingFiled) {
      saveUserImage({
        ...existingFiled,
        title: clean,
        name: clean
      }).catch(console.warn);
    }
  };

  // 4. Fast Branch (Keyword) Removal
  const handleRemoveBranch = (item, branchToRemove, e) => {
    e?.stopPropagation();
    const newKeywords = item.keywords.filter(k => k !== branchToRemove);

    setLocalEdits(prev => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        keywords: newKeywords,
        isModified: true
      }
    }));

    // If filed, update in repo
    if (item.filedItem) {
      saveUserImage({
        ...item.filedItem,
        keywords: newKeywords
      }).catch(console.warn);
    }
  };

  // 5. Fast Branch Addition
  const handleAddBranch = (item, branchToAdd) => {
    const clean = (branchToAdd || '').trim().replace(/^#+/, '');
    if (!clean) return;

    if (item.keywords.includes(clean)) {
      showToast(`הענף "${clean}" כבר קיים בתמונה`, 'info');
      return;
    }

    const newKeywords = [...item.keywords, clean];

    setLocalEdits(prev => ({
      ...prev,
      [item.id]: {
        ...(prev[item.id] || {}),
        keywords: newKeywords,
        isModified: true
      }
    }));

    // Clear the card's input
    setBranchInputs(prev => ({ ...prev, [item.id]: '' }));

    // If filed, update repo
    if (item.filedItem) {
      saveUserImage({
        ...item.filedItem,
        keywords: newKeywords
      }).catch(console.warn);
    }

    showToast(`+ נוסף ענף "${clean}" ל-${item.title}`);
  };

  // 6. Fast 1-Click File / Approve to Live Repository
  const handleFastFile = async (item, e) => {
    e?.stopPropagation();
    try {
      const contributor = (uploaderName || localStorage.getItem('lifequest_contributor_name') || 'משתמש').trim();
      
      await saveUserImage({
        id: item.id,
        title: item.title,
        name: item.title,
        imageUrl: item.imageUrl,
        keywords: item.keywords,
        domain: item.theme || 'objects',
        category: item.category,
        isUserApproved: true,
        uploaderName: contributor
      });

      // Remove from trash if it was there
      if (discardedIds.has(item.id)) {
        setDiscardedIds(prev => {
          const next = new Set(prev);
          next.delete(item.id);
          return next;
        });
      }

      showToast(`✅ "${item.title}" נשמרה ותוייקה בהצלחה במאגר הפעיל!`, 'success');
    } catch (err) {
      showToast(`שגיאה בתיוק: ${err.message}`, 'error');
    }
  };

  // 7. Toggle Flag as Bad / Needs Replacement
  const handleToggleFlagBad = (item, defaultReason = 'תמונה לא מתאימה - דרושה החלפה', e) => {
    e?.stopPropagation();
    const id = item.id;
    setFlaggedBadMap(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
        showToast(`↩️ הוסר סימון להחלפה עבור "${item.title}"`, 'info');
      } else {
        next[id] = {
          id,
          title: item.title,
          name: item.name || item.title,
          imageUrl: item.imageUrl,
          category: item.category,
          reason: defaultReason,
          flaggedAt: Date.now()
        };
        showToast(`⚠️ "${item.title}" סומנה להחלפת תמונה!`, 'warning');
      }
      return next;
    });
  };

  // 8. Update Flag Reason
  const handleUpdateFlagReason = (item, reason, e) => {
    e?.stopPropagation();
    const id = item.id;
    setFlaggedBadMap(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        id,
        title: item.title,
        imageUrl: item.imageUrl,
        category: item.category,
        reason,
        flaggedAt: Date.now()
      }
    }));
    showToast(`סיבת החלפה עודכנה: "${reason}"`);
  };

  // 9. Export flagged list to JSON & Clipboard
  const handleExportFlaggedList = () => {
    const list = Object.values(flaggedBadMap);
    if (list.length === 0) {
      showToast('אין תמונות שסומנו להחלפה כרגע', 'info');
      return;
    }
    const jsonStr = JSON.stringify(list, null, 2);
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(jsonStr);
      }
      showToast(`📋 הועתקה רשימה של ${list.length} תמונות להחלפה ללוח!`);
    } catch (_) {}

    // Download JSON file
    try {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flagged_images_for_replacement_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (_) {}
  };

  // Quick Smart Suggestion Pills for an item
  const getSmartSuggestions = (item) => {
    const existing = new Set(item.keywords.map(k => k.toLowerCase()));
    existing.add(item.title.toLowerCase());

    const suggestions = [];
    
    // 1. From everyday suggestions engine
    const ev = getEverydaySuggestionsForItem(item);
    if (Array.isArray(ev)) {
      ev.forEach(s => {
        if (!existing.has(s.toLowerCase())) suggestions.push(s);
      });
    }

    // 2. From raw item associations
    if (Array.isArray(item.associations)) {
      item.associations.forEach(a => {
        const clean = a.trim();
        if (clean && !clean.includes(' ') && !existing.has(clean.toLowerCase())) {
          suggestions.push(clean);
        }
      });
    }

    // Return first 4 distinct suggestions
    return Array.from(new Set(suggestions)).slice(0, 4);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '600px' }}>
      
      {/* Top Header & Fast Filter Bar */}
      <div 
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '16px',
          padding: '18px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                ⚡ גריד מיון ועריכה מהירה (כל המאגר)
              </h3>
              <span 
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  padding: '2px 10px',
                  borderRadius: '999px'
                }}
              >
                {stats.total} תמונות
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: '#94a3b8' }}>
              ממשק אנושי מהיר: מחיקה בלחיצה אחת 🗑️, עריכת שורשים מיידית ✏️, והצמדת ענפי אסוציאציות 🏷️
            </p>
          </div>

          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setStatusFilter('all')}
              style={{
                backgroundColor: statusFilter === 'all' ? '#0284c7' : '#0f172a',
                color: statusFilter === 'all' ? '#ffffff' : '#94a3b8',
                border: statusFilter === 'all' ? '1px solid #38bdf8' : '1px solid #334155',
                padding: '7px 14px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🌐 כל המאגר הפעיל</span>
              <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>({stats.total})</span>
            </button>

            {stats.flagged > 0 && (
              <button
                onClick={() => setStatusFilter('flagged')}
                style={{
                  backgroundColor: statusFilter === 'flagged' ? '#b45309' : '#0f172a',
                  color: statusFilter === 'flagged' ? '#ffffff' : '#fbbf24',
                  border: statusFilter === 'flagged' ? '1px solid #f59e0b' : '1px solid #334155',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <AlertTriangle size={14} />
                <span>⚠️ דורשות החלפה</span>
                <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>({stats.flagged})</span>
              </button>
            )}

            {stats.trash > 0 && (
              <button
                onClick={() => setStatusFilter('trash')}
                style={{
                  backgroundColor: statusFilter === 'trash' ? '#dc2626' : '#0f172a',
                  color: statusFilter === 'trash' ? '#ffffff' : '#f87171',
                  border: statusFilter === 'trash' ? '1px solid #ef4444' : '1px solid #334155',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Trash2 size={14} />
                <span>סל מחזור</span>
                <span style={{ opacity: 0.85, fontSize: '0.78rem' }}>({stats.trash})</span>
              </button>
            )}

            {stats.flagged > 0 && (
              <button
                onClick={handleExportFlaggedList}
                style={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #f59e0b',
                  color: '#fbbf24',
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
                title="ייצא רשימת תמונות להחלפה (JSON + העתקה ללוח)"
              >
                <Download size={14} />
                <span>ייצא רשימת החלפה ({stats.flagged})</span>
              </button>
            )}

            <button
              onClick={() => syncToDisk(false)}
              style={{
                backgroundColor: '#0284c7',
                border: '1px solid #38bdf8',
                color: '#ffffff',
                padding: '7px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)',
                transition: 'all 0.15s ease'
              }}
              title="שמור וסנכרן את כל ההחלטות והסימונים ישירות לסוכן AI ולקבצי הפרויקט"
            >
              <Save size={15} />
              <span>💾 סנכרן לסוכן</span>
            </button>
          </div>
        </div>

        {/* Second Row: Search & Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap' }}>
          {/* Search box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', right: '12px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש לפי שורש, ענף, מזהה..."
              style={{
                width: '100%',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 36px 8px 12px',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontFamily: 'Rubik, sans-serif'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '8px',
                  background: 'transparent',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer'
                }}
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? '#475569' : '#0f172a',
                color: selectedCategory === 'all' ? '#ffffff' : '#94a3b8',
                border: '1px solid #334155',
                padding: '5px 10px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              כל הקטגוריות
            </button>
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  backgroundColor: selectedCategory === cat ? '#2563eb' : '#0f172a',
                  color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                  border: selectedCategory === cat ? '1px solid #3b82f6' : '1px solid #334155',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Page size selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
            <span>הצג:</span>
            {[24, 36, 60, 120].map(size => (
              <button
                key={size}
                onClick={() => setPageSize(size)}
                style={{
                  backgroundColor: pageSize === size ? '#334155' : 'transparent',
                  color: pageSize === size ? '#38bdf8' : '#64748b',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '3px 7px',
                  cursor: 'pointer',
                  fontWeight: pageSize === size ? 700 : 400
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: toast.type === 'error' ? '#991b1b' : toast.type === 'info' ? '#1e293b' : '#065f46',
            border: `1px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'info' ? '#475569' : '#10b981'}`,
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '12px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 99999,
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          <span>{toast.message}</span>
          {toast.undoAction && (
            <button
              onClick={() => {
                toast.undoAction();
                setToast(null);
              }}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700
              }}
            >
              בטל ↩️
            </button>
          )}
        </div>
      )}

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
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
          <p style={{ fontSize: '1.1rem', margin: '0 0 8px', color: '#f8fafc', fontWeight: 700 }}>
            לא נמצאו תמונות התואמות לסינון הנוכחי
          </p>
          <p style={{ fontSize: '0.85rem', margin: 0 }}>
            נסה לאפס את החיפוש או לבחור קטגוריה / סטטוס אחרים.
          </p>
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '18px'
          }}
        >
          {paginatedItems.map(item => {
            const isEditing = activeEditingId === item.id;
            const smartSuggestions = getSmartSuggestions(item);
            const cardInputVal = branchInputs[item.id] || '';

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: item.isDiscarded ? '#1c1517' : '#1e293b',
                  border: item.isDiscarded 
                    ? '1px solid #7f1d1d' 
                    : item.isFlaggedBad
                      ? '2px solid #f59e0b'
                      : item.isFiled 
                        ? '1px solid #059669' 
                        : '1px solid #334155',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  transition: 'all 0.15s ease',
                  opacity: item.isDiscarded ? 0.75 : 1
                }}
              >
                {/* Image Container with Quick Action Overlay */}
                <div 
                  style={{
                    height: '170px',
                    backgroundColor: '#0a0f1d',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={item.imageUrl ? `${item.imageUrl}${item.imageUrl.includes('?') ? '&' : '?'}v=clean_v3` : ''} 
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />

                  {/* Top-Right Status Badge */}
                  <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {item.aiCurated && (
                      <span 
                        style={{
                          backgroundColor: 'rgba(79, 70, 229, 0.92)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}
                      >
                        <Sparkles size={11} />
                        <span>טויב ע״י AI</span>
                      </span>
                    )}
                    {item.isFlaggedBad && (
                      <span 
                        style={{
                          backgroundColor: 'rgba(217, 119, 6, 0.95)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                        }}
                      >
                        <AlertTriangle size={11} />
                        <span>דורש החלפה</span>
                      </span>
                    )}
                    {item.isDiscarded ? (
                      <span 
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.9)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        🗑️ בסל מחזור
                      </span>
                    ) : item.isFiled ? (
                      <span 
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.9)',
                          color: '#ffffff',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        ✓ במאגר הפעיל
                      </span>
                    ) : (
                      <span 
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.85)',
                          color: '#000000',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        ⏳ ממתין לתיוק
                      </span>
                    )}
                  </div>

                  {/* Top-Left Action Icons (Matches Screenshot Style) */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      display: 'flex',
                      gap: '6px',
                      zIndex: 10
                    }}
                  >
                    {/* 1-Click Fast Delete / Trash */}
                    {item.isDiscarded ? (
                      <button
                        onClick={(e) => handleRestoreFromTrash(item, e)}
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.9)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '6px',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}
                        title="שחזר מהסל"
                      >
                        <RotateCcw size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleFastDelete(item, e)}
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          border: '1px solid #7f1d1d',
                          color: '#f87171',
                          padding: '6px',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.85)'}
                        title="מחיקה מהירה (העבר לסל מחזור)"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}

                    {/* Flag as Bad / Needs Replacement Button */}
                    <button
                      onClick={(e) => handleToggleFlagBad(item, 'איור/מצויר - דרוש צילום אמיתי', e)}
                      style={{
                        backgroundColor: item.isFlaggedBad ? '#d97706' : 'rgba(15, 23, 42, 0.85)',
                        border: item.isFlaggedBad ? '1px solid #fbbf24' : '1px solid #78350f',
                        color: item.isFlaggedBad ? '#ffffff' : '#fbbf24',
                        padding: '6px',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                        transition: 'all 0.15s ease'
                      }}
                      title={item.isFlaggedBad ? "בטל סימון להחלפה" : "סמן להחלפת תמונה (תמונה לא טובה / דרושה חלופה)"}
                    >
                      <AlertTriangle size={14} />
                    </button>

                    {/* Edit Mode Toggle */}
                    <button
                      onClick={() => setActiveEditingId(isEditing ? null : item.id)}
                      style={{
                        backgroundColor: isEditing ? '#0284c7' : 'rgba(15, 23, 42, 0.85)',
                        border: '1px solid #38bdf8',
                        color: '#38bdf8',
                        padding: '6px',
                        borderRadius: '7px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                      }}
                      title="עריכת שורש וענפים"
                    >
                      <Edit3 size={14} color={isEditing ? '#ffffff' : '#38bdf8'} />
                    </button>

                    {/* 1-Click Fast File to Repo */}
                    {!item.isFiled && (
                      <button
                        onClick={(e) => handleFastFile(item, e)}
                        style={{
                          backgroundColor: 'rgba(16, 185, 129, 0.9)',
                          border: 'none',
                          color: '#ffffff',
                          padding: '6px',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}
                        title="תייק ושמור למאגר הפעיל"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                  
                  {/* Root / Title Row */}
                  <div>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                          ערוך שורש (כותרת העוגן):
                        </label>
                        <input 
                          type="text"
                          defaultValue={item.title}
                          onBlur={(e) => handleUpdateTitle(item.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateTitle(item.id, e.currentTarget.value);
                              setActiveEditingId(null);
                            }
                          }}
                          autoFocus
                          style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #38bdf8',
                            borderRadius: '6px',
                            color: '#ffffff',
                            padding: '6px 8px',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                            fontFamily: 'Rubik, sans-serif'
                          }}
                        />
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>
                          לחץ Enter או צא מהשדה כדי לשמור
                        </span>
                      </div>
                    ) : (
                      <div 
                        onClick={() => setActiveEditingId(item.id)}
                        style={{
                          fontWeight: 800,
                          fontSize: '0.96rem',
                          color: '#f8fafc',
                          lineHeight: '1.4',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                        title="לחץ לעריכת השורש"
                      >
                        <span>{item.title}</span>
                        <Edit3 size={12} style={{ color: '#64748b', opacity: 0.6 }} />
                      </div>
                    )}
                    {item.category && (
                      <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                        {item.category}
                      </span>
                    )}

                    {/* Reason badge & quick pills if flagged */}
                    {item.isFlaggedBad && (
                      <div 
                        style={{
                          backgroundColor: 'rgba(245, 158, 11, 0.1)',
                          border: '1px dashed #d97706',
                          borderRadius: '8px',
                          padding: '7px 9px',
                          marginTop: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem' }}>
                          <span style={{ fontWeight: 800, color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} />
                            <span>סומנה להחלפה:</span>
                          </span>
                          <span style={{ color: '#fef08a', fontStyle: 'italic', fontWeight: 600 }}>
                            {item.flagInfo?.reason || 'דרושה החלפה'}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {[
                            'איור במקום צילום',
                            'חתוך / לא ברור',
                            'סימן מים',
                            'איכות נמוכה',
                            'לא מושך/משעמם'
                          ].map((quickR) => (
                            <button
                              key={quickR}
                              onClick={(e) => handleUpdateFlagReason(item, quickR, e)}
                              style={{
                                backgroundColor: item.flagInfo?.reason === quickR ? '#d97706' : '#0f172a',
                                color: item.flagInfo?.reason === quickR ? '#ffffff' : '#fde68a',
                                border: '1px solid #78350f',
                                borderRadius: '4px',
                                fontSize: '0.67rem',
                                padding: '2px 5px',
                                cursor: 'pointer',
                                fontWeight: item.flagInfo?.reason === quickR ? 700 : 500
                              }}
                            >
                              {quickR}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Branches (ענפים / אסוציאציות) Chips */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                        ענפים מקושרים ({item.keywords.length}):
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {item.keywords.map((kw, i) => (
                        <span 
                          key={i}
                          style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #334155',
                            color: '#38bdf8',
                            fontSize: '0.74rem',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>#{kw}</span>
                          <button
                            onClick={(e) => handleRemoveBranch(item, kw, e)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              padding: 0,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                            title={`הסר ענף "${kw}"`}
                          >
                            <X size={11} />
                          </button>
                        </span>
                      ))}

                      {item.keywords.length === 0 && (
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontStyle: 'italic' }}>
                          אין ענפים מקושרים עדיין
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Fast Branch Addition Input */}
                  <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input 
                        type="text"
                        value={cardInputVal}
                        onChange={(e) => setBranchInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ',') {
                            e.preventDefault();
                            handleAddBranch(item, cardInputVal);
                          }
                        }}
                        placeholder="+ ענף חדש (לחץ Enter)..."
                        style={{
                          flex: 1,
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '6px',
                          color: '#f8fafc',
                          padding: '5px 8px',
                          fontSize: '0.78rem',
                          fontFamily: 'Rubik, sans-serif'
                        }}
                      />
                      <button
                        onClick={() => handleAddBranch(item, cardInputVal)}
                        disabled={!cardInputVal.trim()}
                        style={{
                          backgroundColor: cardInputVal.trim() ? '#0284c7' : '#334155',
                          border: 'none',
                          color: '#ffffff',
                          padding: '5px 9px',
                          borderRadius: '6px',
                          cursor: cardInputVal.trim() ? 'pointer' : 'default',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        title="הוסף ענף"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Quick Smart Suggestions */}
                    {smartSuggestions.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.68rem', color: '#64748b' }}>הצעות:</span>
                        {smartSuggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleAddBranch(item, sug)}
                            style={{
                              backgroundColor: 'rgba(56, 189, 248, 0.1)',
                              border: '1px dashed #0284c7',
                              color: '#38bdf8',
                              fontSize: '0.68rem',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                            title={`לחץ להוספת "${sug}"`}
                          >
                            +{sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div 
                    style={{
                      borderTop: '1px solid #334155',
                      paddingTop: '8px',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    {item.isDiscarded ? (
                      <button
                        onClick={(e) => handleRestoreFromTrash(item, e)}
                        style={{
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '5px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>שחזר תמונה זו</span>
                      </button>
                    ) : item.isFiled ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} />
                          <span>שמור ומסונכרן</span>
                        </span>
                        <button
                          onClick={(e) => handleFastFile(item, e)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #334155',
                            color: '#94a3b8',
                            fontSize: '0.72rem',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                          title="עדכן שינויים אחרונים בענן"
                        >
                          סנכרן עדכון 🔄
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleFastFile(item, e)}
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: '100%',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <Check size={14} />
                        <span>תייק למאגר עכשיו</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '16px 0',
            marginTop: '10px'
          }}
        >
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: currentPage === 1 ? '#64748b' : '#f8fafc',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: currentPage === 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem'
            }}
          >
            <ChevronRight size={16} />
            <span>הקודם</span>
          </button>

          <span style={{ color: '#94a3b8', fontSize: '0.85rem', padding: '0 10px', fontWeight: 600 }}>
            עמוד {currentPage} מתוך {totalPages} ({filteredItems.length} תמונות)
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              color: currentPage === totalPages ? '#64748b' : '#f8fafc',
              padding: '8px 14px',
              borderRadius: '8px',
              cursor: currentPage === totalPages ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem'
            }}
          >
            <span>הבא</span>
            <ChevronLeft size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

