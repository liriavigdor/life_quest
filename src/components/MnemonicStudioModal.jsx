import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  Sparkles, 
  Download, 
  FolderPlus, 
  Tag, 
  AlertCircle, 
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Layers,
  ArrowRight,
  AlertTriangle,
  Cloud,
  CloudOff,
  User,
  Users,
  ShieldCheck,
  LayoutGrid
} from 'lucide-react';
import { 
  getUserImagesSync, 
  saveUserImage, 
  deleteUserImage, 
  clearAllUserImages, 
  subscribeToUserImages, 
  findUserImageByKeyword,
  optimizeImage,
  checkDuplicateAssociations,
  getCloudSyncStatus,
  subscribeToCloudStatus
} from '../utils/userImageRepository';
import { THEMATIC_DOMAINS } from '../data/mnemonicAssociativeCatalog';
import { RapidFilingDesk } from './RapidFilingDesk';
import { BulkImageCurationDesk } from './BulkImageCurationDesk';
import { STAGED_IMAGES_POOL } from '../data/stagedImagesPool';
import { AuditedMnemonicPoolView } from './AuditedMnemonicPoolView';
import { AUDITED_VERIFIED_POOL, AUDITED_REJECTED_POOL } from '../data/auditedImagesPool';

export function MnemonicStudioModal({ isOpen, onClose }) {
  // Navigation tabs: 'grid' | 'filing' | 'gallery' | 'upload' | 'sandbox' | 'audited' | 'rejected'
  const [activeTab, setActiveTab] = useState('grid');

  // Images state synced with repository
  const [userImages, setUserImages] = useState(() => getUserImagesSync());
  
  // Realtime Cloud Sync status
  const [cloudStatus, setCloudStatus] = useState(() => getCloudSyncStatus());

  // Contributor / Uploader name (persisted in localStorage)
  const [uploaderName, setUploaderName] = useState(() => {
    return (typeof window !== 'undefined' && localStorage.getItem('lifequest_contributor_name')) || '';
  });
  
  // Gallery filtering & search
  const [gallerySearch, setGallerySearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');

  // Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadKeywords, setUploadKeywords] = useState('');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDomain, setUploadDomain] = useState('objects');
  const [uploadImageData, setUploadImageData] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Edit Form State (for existing image)
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editCaption, setEditCaption] = useState('');
  const [editDomain, setEditDomain] = useState('objects');

  // Sandbox Test State
  const [sandboxQuery, setSandboxQuery] = useState('');
  const [sandboxMatch, setSandboxMatch] = useState(null);

  // Realtime Cloud Status Listener
  useEffect(() => {
    const unsubCloud = subscribeToCloudStatus((status) => {
      setCloudStatus(status);
    });
    return unsubCloud;
  }, []);

  // Sync with repository changes
  useEffect(() => {
    setUserImages(getUserImagesSync());
    const unsubscribe = subscribeToUserImages((updated) => {
      setUserImages(updated);
    });
    return unsubscribe;
  }, []);

  // Count unfiled staged images for the badge
  const pendingFilingCount = useMemo(() => {
    const filedSet = new Set(
      userImages.flatMap(i => [
        i.imageUrl,
        i.id,
        (i.title || '').trim().toLowerCase()
      ]).filter(Boolean)
    );
    return STAGED_IMAGES_POOL.filter(
      s => !filedSet.has(s.imageUrl) && 
           !filedSet.has(s.id) && 
           !filedSet.has((s.suggestedName || '').trim().toLowerCase())
    ).length;
  }, [userImages]);

  // Live duplicate detection in upload form ("כדי לא למחזר")
  const detectedDuplicates = useMemo(() => {
    return checkDuplicateAssociations(uploadTitle, uploadKeywords);
  }, [uploadTitle, uploadKeywords, userImages]);

  // Live duplicate detection in edit form
  const editDuplicates = useMemo(() => {
    if (!editingItem) return [];
    return checkDuplicateAssociations(editTitle, editKeywords, editingItem.id);
  }, [editTitle, editKeywords, editingItem, userImages]);

  // Sandbox match live evaluation
  useEffect(() => {
    if (!sandboxQuery.trim()) {
      setSandboxMatch(null);
      return;
    }
    const match = findUserImageByKeyword(sandboxQuery.trim());
    setSandboxMatch(match);
  }, [sandboxQuery, userImages]);

  // Handle file selection and conversion to optimized image
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setUploadErrorMsg('אנא בחר קובץ תמונה תקין (JPG, PNG, WebP, SVG)');
      return;
    }
    setUploadErrorMsg('');
    setIsOptimizing(true);

    try {
      // Auto-populate title from filename if empty
      if (!uploadTitle.trim()) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
        setUploadTitle(nameWithoutExt);
      }

      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawData = event.target.result;
        try {
          const optimized = await optimizeImage(rawData, 1000, 1000, 0.85);
          setUploadImageData(optimized);
        } catch (_) {
          setUploadImageData(rawData);
        } finally {
          setIsOptimizing(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setUploadErrorMsg('שגיאה בעיבוד התמונה');
      setIsOptimizing(false);
    }
  };

  // Drag and drop handling
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  // Save new image
  const handleSaveUpload = async (e) => {
    e?.preventDefault();
    if (!uploadTitle.trim()) {
      setUploadErrorMsg('נא להזין כותרת / שם לתמונה');
      return;
    }
    if (!uploadImageData) {
      setUploadErrorMsg('נא להעלות קובץ תמונה');
      return;
    }

    try {
      const keywordsArray = uploadKeywords
        .split(/[,;\n]+/)
        .map(k => k.trim())
        .filter(Boolean);

      const finalUploader = (uploaderName || localStorage.getItem('lifequest_contributor_name') || 'חבר צוות').trim();

      await saveUserImage({
        title: uploadTitle.trim(),
        imageUrl: uploadImageData,
        keywords: keywordsArray,
        caption: uploadCaption.trim(),
        domain: uploadDomain,
        uploaderName: finalUploader
      });

      setUploadSuccessMsg(`התמונה "${uploadTitle.trim()}" נשמרה וסונכרנה בהצלחה במאגר המשותף!`);
      // Reset form
      setUploadTitle('');
      setUploadKeywords('');
      setUploadCaption('');
      setUploadImageData('');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setTimeout(() => {
        setUploadSuccessMsg('');
        setActiveTab('gallery');
      }, 1400);
    } catch (err) {
      setUploadErrorMsg(err.message || 'שגיאה בשמירת התמונה');
    }
  };

  // Open edit modal for an item
  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title || item.name || '');
    setEditKeywords((item.keywords || []).join(', '));
    setEditCaption(item.caption || '');
    setEditDomain(item.domain || 'objects');
  };

  // Save edited item
  const handleSaveEdit = async () => {
    if (!editingItem) return;
    try {
      const keywordsArray = editKeywords
        .split(/[,;\n]+/)
        .map(k => k.trim())
        .filter(Boolean);

      const finalUploader = (editingItem.uploaderName || uploaderName || localStorage.getItem('lifequest_contributor_name') || 'חבר צוות').trim();

      await saveUserImage({
        id: editingItem.id,
        title: editTitle.trim(),
        imageUrl: editingItem.imageUrl,
        keywords: keywordsArray,
        caption: editCaption.trim(),
        domain: editDomain,
        uploaderName: finalUploader
      });

      setEditingItem(null);
    } catch (err) {
      alert('שגיאה בעדכון התמונה: ' + err.message);
    }
  };

  // Delete an item
  const handleDeleteItem = async (id, title) => {
    if (window.confirm(`האם למחוק את התמונה "${title}" ממאגר התמונות שלך?`)) {
      await deleteUserImage(id);
    }
  };

  // Clear all images
  const handleClearAll = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל התמונות במאגר האישי שלך? פעולה זו אינה ניתנת לביטול.')) {
      await clearAllUserImages();
    }
  };

  // Export JSON backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userImages, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lifequest_mnemonic_images_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered images for gallery
  const filteredGallery = useMemo(() => {
    return userImages.filter(item => {
      const matchesDomain = selectedDomain === 'all' || item.domain === selectedDomain;
      if (!matchesDomain) return false;
      if (!gallerySearch.trim()) return true;

      const q = gallerySearch.trim().toLowerCase();
      const inTitle = (item.title || '').toLowerCase().includes(q);
      const inKeywords = (item.keywords || []).some(k => k.toLowerCase().includes(q));
      const inCaption = (item.caption || '').toLowerCase().includes(q);
      return inTitle || inKeywords || inCaption;
    });
  }, [userImages, selectedDomain, gallerySearch]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: 'rgba(5, 7, 15, 0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Rubik, sans-serif',
        direction: 'rtl',
        padding: '16px'
      }}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '1150px',
          height: '92vh',
          backgroundColor: '#0f172a',
          border: '2px solid #334155',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          color: '#f8fafc'
        }}
      >
        {/* Top Header */}
        <div 
          style={{
            padding: '16px 24px',
            backgroundColor: '#1e293b',
            borderBottom: '1px solid #334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div 
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.4rem',
                boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
              }}
            >
              🧠
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  סטודיו מאגר תמונות ואסוציאציות (משותף)
                </h2>
                {cloudStatus.status === 'online' ? (
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(16, 185, 129, 0.18)',
                      border: '1px solid #10b981',
                      color: '#a7f3d0',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    title="מחובר ומסונכרן לענן Firestore בזמן אמת"
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                    <Cloud size={13} />
                    <span>ענן חי ({userImages.length} תמונות)</span>
                  </span>
                ) : cloudStatus.status === 'connecting' ? (
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: 'rgba(245, 158, 11, 0.18)',
                      border: '1px solid #f59e0b',
                      color: '#fde68a',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <RefreshCw size={12} className="spin" />
                    <span>מתחבר לענן...</span>
                  </span>
                ) : (
                  <span 
                    style={{
                      fontSize: '0.75rem',
                      backgroundColor: '#334155',
                      color: '#94a3b8',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <CloudOff size={13} />
                    <span>מקומי ({userImages.length} תמונות)</span>
                  </span>
                )}
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                מאגר שיתופי בענן בזמן אמת — כל בני המשפחה והחברים מעלים, רואים הכל, ומערכת מונעת כפילויות
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {userImages.length > 0 && (
              <button
                onClick={handleExportJSON}
                style={{
                  backgroundColor: '#334155',
                  border: '1px solid #475569',
                  color: '#e2e8f0',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                title="הורד קובץ גיבוי של התמונות"
              >
                <Download size={15} />
                <span>גיבוי JSON</span>
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#94a3b8',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#334155';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 24px',
            backgroundColor: '#0f172a',
            borderBottom: '1px solid #1e293b'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('grid')}
              style={{
                backgroundColor: activeTab === 'grid' ? '#0284c7' : '#1e293b',
                color: activeTab === 'grid' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'grid' ? '1px solid #38bdf8' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === 'grid' ? '0 0 15px rgba(56, 189, 248, 0.3)' : 'none'
              }}
            >
              <LayoutGrid size={17} />
              <span>⚡ גריד מיון ועריכה</span>
              <span 
                style={{
                  backgroundColor: '#38bdf8',
                  color: '#0f172a',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}
              >
                {STAGED_IMAGES_POOL.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('filing')}
              style={{
                backgroundColor: activeTab === 'filing' ? '#0369a1' : '#1e293b',
                color: activeTab === 'filing' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'filing' ? '1px solid #0284c7' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={17} />
              <span>📥 תיוק יחידני</span>
              {pendingFilingCount > 0 && (
                <span 
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#000000',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    fontWeight: 900
                  }}
                >
                  {pendingFilingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              style={{
                backgroundColor: activeTab === 'gallery' ? '#2563eb' : '#1e293b',
                color: activeTab === 'gallery' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'gallery' ? '1px solid #3b82f6' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <ImageIcon size={17} />
              <span>המאגר שלי ({userImages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('upload')}
              style={{
                backgroundColor: activeTab === 'upload' ? '#10b981' : '#1e293b',
                color: activeTab === 'upload' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'upload' ? '1px solid #059669' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Upload size={17} />
              <span>📤 העלאה ידנית</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              style={{
                backgroundColor: activeTab === 'sandbox' ? '#8b5cf6' : '#1e293b',
                color: activeTab === 'sandbox' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'sandbox' ? '1px solid #7c3aed' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Sparkles size={17} />
              <span>🧪 בדיקת התאמות</span>
            </button>

            <button
              onClick={() => setActiveTab('audited')}
              style={{
                backgroundColor: activeTab === 'audited' ? '#059669' : '#1e293b',
                color: activeTab === 'audited' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'audited' ? '1px solid #10b981' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <ShieldCheck size={17} style={{ color: activeTab === 'audited' ? '#ffffff' : '#34d399' }} />
              <span>🛡️ נבדקו ע״י AI</span>
              <span 
                style={{
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}
              >
                {AUDITED_VERIFIED_POOL.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('rejected')}
              style={{
                backgroundColor: activeTab === 'rejected' ? '#b91c1c' : '#1e293b',
                color: activeTab === 'rejected' ? '#ffffff' : '#94a3b8',
                border: activeTab === 'rejected' ? '1px solid #ef4444' : '1px solid #334155',
                borderRadius: '10px',
                padding: '8px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Trash2 size={17} style={{ color: activeTab === 'rejected' ? '#ffffff' : '#f87171' }} />
              <span>🗑️ למחיקה</span>
              <span 
                style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  borderRadius: '999px',
                  padding: '2px 8px',
                  fontSize: '0.75rem',
                  fontWeight: 900
                }}
              >
                {AUDITED_REJECTED_POOL.length}
              </span>
            </button>
          </div>

          {userImages.length > 0 && activeTab === 'gallery' && (
            <button
              onClick={handleClearAll}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="מחק את כל התמונות במאגר"
            >
              <Trash2 size={13} />
              <span>מחק את כל המאגר</span>
            </button>
          )}
        </div>

        {/* Tab Content Container */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          
          {/* ======================================================== */}
          {/* TAB -1: BULK RAPID GRID DESK (גריד מיון ועריכה לכל המאגר)   */}
          {/* ======================================================== */}
          {activeTab === 'grid' && (
            <BulkImageCurationDesk
              userImages={userImages}
              uploaderName={uploaderName}
              onSwitchTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 0: RAPID FILING DESK (שולחן עבודה ותיוק מהיר)         */}
          {/* ======================================================== */}
          {activeTab === 'filing' && (
            <RapidFilingDesk 
              userImages={userImages}
              uploaderName={uploaderName}
              onSaveImage={async (record) => {
                await saveUserImage(record);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 1: UPLOAD (העלאת תמונה ואסוציאציות)                    */}
          {/* ======================================================== */}
          {activeTab === 'upload' && (
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '18px',
                  border: '1px solid #334155',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}
              >
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                  העלאת תמונה חדשה למאגר האישי
                </h3>
                <p style={{ margin: '0 0 20px', color: '#94a3b8', fontSize: '0.88rem' }}>
                  העלה תמונה מהמחשב והגדר לה את מילות האסוציאציה המדויקות שעבורן היא תוצג בארמון.
                </p>

                {uploadSuccessMsg && (
                  <div 
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#6ee7b7',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 700
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{uploadSuccessMsg}</span>
                  </div>
                )}

                {uploadErrorMsg && (
                  <div 
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid #ef4444',
                      color: '#fca5a5',
                      padding: '12px 16px',
                      borderRadius: '10px',
                      marginBottom: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontWeight: 700
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{uploadErrorMsg}</span>
                  </div>
                )}

                {/* Dropzone / Upload area */}
                <div 
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    border: isDragging ? '2px dashed #10b981' : uploadImageData ? '2px solid #3b82f6' : '2px dashed #475569',
                    backgroundColor: isDragging ? 'rgba(16, 185, 129, 0.1)' : uploadImageData ? '#0f172a' : '#1e293b',
                    borderRadius: '14px',
                    padding: uploadImageData ? '16px' : '40px 20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />

                  {uploadImageData ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{
                          width: '260px',
                          height: '180px',
                          borderRadius: '10px',
                          overflow: 'hidden',
                          border: '2px solid #334155',
                          boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                          backgroundColor: '#000'
                        }}
                      >
                        <img 
                          src={uploadImageData} 
                          alt="תצוגה מקדימה"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <span style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: 600 }}>
                        לחץ כאן או גרור כדי להחליף תמונה 🔄
                      </span>
                    </div>
                  ) : (
                    <>
                      <div 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(56, 189, 248, 0.15)',
                          color: '#38bdf8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '12px'
                        }}
                      >
                        {isOptimizing ? <RefreshCw size={26} className="animate-spin" /> : <Upload size={26} />}
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc', marginBottom: '4px' }}>
                        {isOptimizing ? 'מעבד וממטב את התמונה...' : 'גרור ושחרר תמונה לכאן או לחץ לבחירת קובץ'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        תומך ב-JPG, PNG, WebP, GIF, SVG (מותאם ונשמר אוטומטית במאגר המקומי)
                      </div>
                    </>
                  )}
                </div>

                {/* Form fields */}
                <form onSubmit={handleSaveUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                        כותרת / שם הפריט בתמונה *
                      </label>
                      <input 
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="למשל: משקפי שמש יוקרתיים, חתול שחור, מפתחות לאוטו..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '0.92rem',
                          fontFamily: 'Rubik, sans-serif'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                        שם המעלה (שמך / בן המשפחה)
                      </label>
                      <input 
                        type="text"
                        value={uploaderName}
                        onChange={(e) => {
                          setUploaderName(e.target.value);
                          localStorage.setItem('lifequest_contributor_name', e.target.value);
                        }}
                        placeholder="למשל: שיראל, אבא, דני..."
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#38bdf8',
                          fontWeight: 600,
                          fontSize: '0.92rem',
                          fontFamily: 'Rubik, sans-serif'
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                        קטגוריה
                      </label>
                      <select
                        value={uploadDomain}
                        onChange={(e) => setUploadDomain(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          backgroundColor: '#0f172a',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#f8fafc',
                          fontSize: '0.92rem',
                          fontFamily: 'Rubik, sans-serif',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="objects">חפצים ועוגנים 📦</option>
                        <option value="people">דמויות ואנשים 👤</option>
                        <option value="places">מקומות ומבנים 🏛️</option>
                        <option value="memes">ממים ובידור 🎭</option>
                        <option value="general">כללי 📌</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                      מילות אסוציאציה ומילות מפתח (הפרד בפסיק) *
                    </label>
                    <input 
                      type="text"
                      value={uploadKeywords}
                      onChange={(e) => setUploadKeywords(e.target.value)}
                      placeholder="למשל: משקפיים, שמש, ים, חוף, קיץ, מסנוור, הגנה, ראייה"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.92rem',
                        fontFamily: 'Rubik, sans-serif'
                      }}
                    />
                    <div style={{ marginTop: '6px', fontSize: '0.78rem', color: '#94a3b8' }}>
                      💡 כל מילה שתוסיף כאן תגרום לאפליקציה לשלוף את התמונה הזו בדיוק כשתתרגל או תשנן פריט מתאים!
                    </div>
                  </div>

                  {/* Duplicate Prevention Alert Box ("כדי לא למחזר") */}
                  {detectedDuplicates.length > 0 && (
                    <div 
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid #f59e0b',
                        borderRadius: '12px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 800, fontSize: '0.92rem' }}>
                        <AlertTriangle size={19} />
                        <span>זהירות מכפילות! אסוציאציה זו כבר קיימת במאגר (כדי לא למחזר):</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {detectedDuplicates.slice(0, 3).map((dup) => (
                          <div 
                            key={dup.item.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '12px',
                              backgroundColor: 'rgba(15, 23, 42, 0.7)',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid rgba(245, 158, 11, 0.3)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={dup.item.imageUrl} 
                                alt={dup.item.title} 
                                style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover', border: '1px solid #475569' }}
                              />
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8fafc' }}>
                                  {dup.item.title}
                                  <span style={{ fontSize: '0.78rem', color: '#fbbf24', marginRight: '6px', fontWeight: 600 }}>
                                    ← מילה תואמת: "{dup.matchedWord}"
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                                  <span>👤 הועלה ע"י: <strong style={{ color: '#e2e8f0' }}>{dup.item.uploaderName || 'חבר צוות'}</strong></span>
                                  <span>•</span>
                                  <span>מילים: {(dup.item.keywords || []).slice(0, 4).join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setGallerySearch(dup.matchedWord);
                                setActiveTab('gallery');
                              }}
                              style={{
                                fontSize: '0.78rem',
                                backgroundColor: '#334155',
                                border: '1px solid #475569',
                                color: '#38bdf8',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 700,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              הצג בגלריה 🔍
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#fde68a' }}>
                        💡 אם מדובר באותו מושג בדיוק, עדיף לא להעלות שוב כדי לשמור על מאגר חד ומובחן.
                      </div>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                      תיאור / סיפור אסוציאטיבי קצר (אופציונלי)
                    </label>
                    <textarea 
                      value={uploadCaption}
                      onChange={(e) => setUploadCaption(e.target.value)}
                      rows={2}
                      placeholder="למשל: משקפי שמש מוזהבים מונחים בכניסה כדי שלא אסתנוור ביציאה"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f8fafc',
                        fontSize: '0.9rem',
                        fontFamily: 'Rubik, sans-serif',
                        resize: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <button
                      type="submit"
                      disabled={!uploadImageData || !uploadTitle.trim()}
                      style={{
                        background: (!uploadImageData || !uploadTitle.trim()) 
                          ? '#475569' 
                          : 'linear-gradient(135deg, #10b981, #059669)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px 28px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        cursor: (!uploadImageData || !uploadTitle.trim()) ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: (!uploadImageData || !uploadTitle.trim()) ? 'none' : '0 4px 15px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Check size={18} />
                      <span>שמור תמונה למאגר הזיכרון</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: GALLERY (המאגר שלי)                                */}
          {/* ======================================================== */}
          {activeTab === 'gallery' && (
            <div>
              {/* Filter & Search Bar */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px',
                  marginBottom: '20px',
                  flexWrap: 'wrap'
                }}
              >
                {/* Search */}
                <div style={{ position: 'relative', width: '320px' }}>
                  <Search 
                    size={18} 
                    style={{ position: 'absolute', right: '12px', top: '11px', color: '#94a3b8' }} 
                  />
                  <input 
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="חפש לפי כותרת או אסוציאציה..."
                    style={{
                      width: '100%',
                      padding: '9px 38px 9px 12px',
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      fontFamily: 'Rubik, sans-serif'
                    }}
                  />
                </div>

                {/* Domain Category Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {THEMATIC_DOMAINS.map(d => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDomain(d.id)}
                      style={{
                        backgroundColor: selectedDomain === d.id ? '#3b82f6' : '#1e293b',
                        color: selectedDomain === d.id ? '#ffffff' : '#94a3b8',
                        border: selectedDomain === d.id ? '1px solid #60a5fa' : '1px solid #334155',
                        borderRadius: '8px',
                        padding: '6px 12px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gallery Grid */}
              {userImages.length === 0 ? (
                /* Empty state */
                <div 
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: '18px',
                    border: '1px dashed #475569',
                    padding: '60px 20px',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '40px auto'
                  }}
                >
                  <div 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: '#60a5fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      fontSize: '1.8rem'
                    }}
                  >
                    🗑️
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px', color: '#f8fafc' }}>
                    המאגר הקודם נמחק – המאגר שלך ריק כרגע
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', margin: '0 0 24px' }}>
                    מחקנו את כל התמונות הקודמות שלא תאמו את הציפיות. מעכשיו אתה יוצר ידנית את המאגר המדויק שלך, עם התמונות והאסוציאציות שאתה בוחר!
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    style={{
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px 24px',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Plus size={18} />
                    <span>העלה תמונה ראשונה עכשיו</span>
                  </button>
                </div>
              ) : filteredGallery.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
                  לא נמצאו תמונות התואמות לחיפוש הנוכחי
                </div>
              ) : (
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '18px'
                  }}
                >
                  {filteredGallery.map((item) => (
                    <div 
                      key={item.id}
                      style={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.3)'
                      }}
                    >
                      {/* Image Preview */}
                      <div 
                        style={{
                          height: '160px',
                          backgroundColor: '#0a0f1d',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div 
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            display: 'flex',
                            gap: '6px'
                          }}
                        >
                          <button
                            onClick={() => handleStartEdit(item)}
                            style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.85)',
                              border: '1px solid #475569',
                              color: '#38bdf8',
                              padding: '5px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="ערוך אסוציאציות"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            style={{
                              backgroundColor: 'rgba(15, 23, 42, 0.85)',
                              border: '1px solid #475569',
                              color: '#f87171',
                              padding: '5px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="מחק תמונה"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '1rem', color: '#f8fafc', marginBottom: '6px' }}>
                          {item.title}
                        </div>

                        {item.caption && (
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '10px', fontStyle: 'italic', lineHeight: '1.4' }}>
                            "{item.caption}"
                          </div>
                        )}

                        {/* Keyword tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: 'auto' }}>
                          {(item.keywords || [])
                            .filter(kw => kw.toLowerCase() !== (item.title || '').toLowerCase())
                            .slice(0, 4)
                            .map((kw, i) => (
                            <span 
                              key={i}
                              style={{
                                backgroundColor: 'rgba(56, 189, 248, 0.12)',
                                border: '1px solid rgba(56, 189, 248, 0.25)',
                                color: '#38bdf8',
                                fontSize: '0.72rem',
                                padding: '2px 7px',
                                borderRadius: '6px',
                                fontWeight: 600
                              }}
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>

                        {/* Uploader and Date Footer */}
                        <div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '10px',
                            paddingTop: '8px',
                            borderTop: '1px solid #334155',
                            fontSize: '0.72rem',
                            color: '#94a3b8'
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#38bdf8' }}>
                            <User size={12} />
                            <span>{item.uploaderName || 'חבר צוות'}</span>
                          </span>
                          <span>
                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString('he-IL') : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: SANDBOX (בדיקת התאמות אסוציאציות)                   */}
          {/* ======================================================== */}
          {activeTab === 'sandbox' && (
            <div style={{ maxWidth: '750px', margin: '0 auto' }}>
              <div 
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '18px',
                  border: '1px solid #334155',
                  padding: '24px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.3)'
                }}
              >
                <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', color: '#f8fafc', fontWeight: 800 }}>
                  🧪 בדיקת זיהוי אסוציאציות בזמן אמת
                </h3>
                <p style={{ margin: '0 0 20px', color: '#94a3b8', fontSize: '0.88rem' }}>
                  בדוק כיצד האפליקציה תתאים מילים מהרשימות שלך לתמונות שהעלית.
                </p>

                <div style={{ position: 'relative', marginBottom: '24px' }}>
                  <Search 
                    size={20} 
                    style={{ position: 'absolute', right: '14px', top: '13px', color: '#94a3b8' }} 
                  />
                  <input 
                    type="text"
                    value={sandboxQuery}
                    onChange={(e) => setSandboxQuery(e.target.value)}
                    placeholder="הקלד כאן מילה כלשהי (למשל: משקפיים, שמש, חתול, מפתחות)..."
                    style={{
                      width: '100%',
                      padding: '12px 44px 12px 14px',
                      backgroundColor: '#0f172a',
                      border: '2px solid #8b5cf6',
                      borderRadius: '10px',
                      color: '#f8fafc',
                      fontSize: '1rem',
                      fontFamily: 'Rubik, sans-serif'
                    }}
                  />
                </div>

                {sandboxQuery.trim() && (
                  <div>
                    {sandboxMatch ? (
                      <div 
                        style={{
                          backgroundColor: '#0f172a',
                          border: '2px solid #10b981',
                          borderRadius: '14px',
                          padding: '18px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '18px'
                        }}
                      >
                        <div 
                          style={{
                            width: '130px',
                            height: '110px',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: '#000',
                            border: '1px solid #334155',
                            flexShrink: 0
                          }}
                        >
                          <img 
                            src={sandboxMatch.imageUrl} 
                            alt={sandboxMatch.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ color: sandboxMatch._matchedViaLeap ? '#38bdf8' : '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
                              {sandboxMatch._matchedViaLeap 
                                ? `🧠 קפיצה אסוציאטיבית חכמה: "${sandboxMatch._matchedViaLeap.sourceWord}" ➔ "${sandboxMatch._matchedViaLeap.bridgeWord}"`
                                : '✅ התאמה מושלמת למאגר שלך!'}
                            </span>
                          </div>
                          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', marginBottom: '4px' }}>
                            {sandboxMatch.title}
                          </div>
                          {sandboxMatch.caption && (
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>
                              "{sandboxMatch.caption}"
                            </div>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {(sandboxMatch.keywords || [])
                              .filter(kw => kw.toLowerCase() !== (sandboxMatch.title || '').toLowerCase())
                              .slice(0, 4)
                              .map((kw, i) => {
                              const isDirectMatch = kw.toLowerCase() === sandboxQuery.trim().toLowerCase();
                              const isBridgeMatch = sandboxMatch._matchedViaLeap && kw.toLowerCase() === sandboxMatch._matchedViaLeap.bridgeWord.toLowerCase();
                              const isHighlight = isDirectMatch || isBridgeMatch;
                              return (
                                <span 
                                  key={i}
                                  style={{
                                    backgroundColor: isHighlight ? '#10b981' : 'rgba(56, 189, 248, 0.12)',
                                    color: isHighlight ? '#ffffff' : '#38bdf8',
                                    fontWeight: isHighlight ? 800 : 600,
                                    fontSize: '0.75rem',
                                    padding: '2px 8px',
                                    borderRadius: '6px',
                                    border: isBridgeMatch ? '1px solid #34d399' : 'none'
                                  }}
                                >
                                  #{kw}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div 
                        style={{
                          backgroundColor: '#0f172a',
                          border: '1px solid #475569',
                          borderRadius: '14px',
                          padding: '20px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>🛡️</div>
                        <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>
                          אין תמונה במאגר עבור המילה "{sandboxQuery.trim()}"
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5' }}>
                          האפליקציה תציג עבור מילה זו כרטיסיית עוגן נקייה (SVG) עם שם המילה עצמה, ולא תציג תמונה שגויה או לא קשורה!
                        </div>
                        <button
                          onClick={() => {
                            setUploadTitle(sandboxQuery.trim());
                            setUploadKeywords(sandboxQuery.trim());
                            setActiveTab('upload');
                          }}
                          style={{
                            marginTop: '14px',
                            backgroundColor: '#3b82f6',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          + העלה תמונה חדשה עבור "{sandboxQuery.trim()}"
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: AUDITED VERIFIED POOL (מאגר תמונות שנבדקו ע״י AI) */}
          {/* ======================================================== */}
          {activeTab === 'audited' && (
            <AuditedMnemonicPoolView 
              mode="verified"
              onPromoteToUserRepo={async (record) => {
                await saveUserImage(record);
              }}
            />
          )}

          {/* ======================================================== */}
          {/* TAB 5: AUDITED REJECTED POOL (מאגר תמונות פסולות למחיקה) */}
          {/* ======================================================== */}
          {activeTab === 'rejected' && (
            <AuditedMnemonicPoolView 
              mode="rejected"
            />
          )}

        </div>

        {/* Edit Modal (if editing an item) */}
        {editingItem && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100005,
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}
          >
            <div 
              style={{
                width: '100%',
                maxWidth: '540px',
                backgroundColor: '#1e293b',
                border: '2px solid #475569',
                borderRadius: '18px',
                padding: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f8fafc', fontWeight: 800 }}>
                  עריכת אסוציאציות לתמונה
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '16px', alignItems: 'center' }}>
                <img 
                  src={editingItem.imageUrl} 
                  alt={editingItem.title}
                  style={{ width: '80px', height: '65px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '4px' }}>
                    כותרת הפריט
                  </label>
                  <input 
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      backgroundColor: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#f8fafc',
                      fontSize: '0.9rem',
                      fontFamily: 'Rubik, sans-serif'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '4px' }}>
                  מילות אסוציאציה (מופרדות בפסיק)
                </label>
                <input 
                  type="text"
                  value={editKeywords}
                  onChange={(e) => setEditKeywords(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    fontFamily: 'Rubik, sans-serif'
                  }}
                />
              </div>

                {editDuplicates.length > 0 && (
                  <div 
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      marginBottom: '14px',
                      fontSize: '0.82rem',
                      color: '#fbbf24'
                    }}
                  >
                    ⚠️ מילים אלו כבר בשימוש בתמונה אחרת: "{editDuplicates[0].item.title}" (מילה: "{editDuplicates[0].matchedWord}")
                  </div>
                )}

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 700, marginBottom: '4px' }}>
                  תיאור מנמוני
                </label>
                <textarea 
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#f8fafc',
                    fontSize: '0.88rem',
                    fontFamily: 'Rubik, sans-serif',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  onClick={() => setEditingItem(null)}
                  style={{
                    backgroundColor: '#334155',
                    color: '#cbd5e1',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  ביטול
                </button>
                <button
                  onClick={handleSaveEdit}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  שמור שינויים
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
