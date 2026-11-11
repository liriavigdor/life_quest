import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, Search, Image as ImageIcon, Upload, Check, Sparkles, Tag, Plus } from 'lucide-react';
import { 
  getUserImagesSync, 
  saveUserImage, 
  subscribeToUserImages, 
  optimizeImage 
} from '../utils/userImageRepository';
import { THEMATIC_DOMAINS } from '../data/mnemonicAssociativeCatalog';
import { sounds } from '../utils/sound';

export function MnemonicRepositoryPickerModal({
  isOpen,
  targetTitle = '',
  onSelect,
  onClose
}) {
  const [images, setImages] = useState(() => getUserImagesSync());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const fileInputRef = useRef(null);

  // Sync with repository changes
  useEffect(() => {
    if (isOpen) {
      setImages(getUserImagesSync());
      const unsub = subscribeToUserImages((updated) => setImages(updated));
      return unsub;
    }
  }, [isOpen]);

  // Filtered images
  const filteredImages = useMemo(() => {
    let list = images;

    if (selectedDomain !== 'all') {
      list = list.filter((img) => (img.domain || 'general') === selectedDomain);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((img) => {
        const titleMatch = (img.title || '').toLowerCase().includes(q) || (img.name || '').toLowerCase().includes(q);
        const kwMatch = Array.isArray(img.keywords) && img.keywords.some((k) => String(k).toLowerCase().includes(q));
        const captionMatch = (img.caption || '').toLowerCase().includes(q);
        return titleMatch || kwMatch || captionMatch;
      });
    }

    return list;
  }, [images, selectedDomain, searchQuery]);

  if (!isOpen) return null;

  // Handle picking an image from the repository
  const handleSelectImage = async (imgRecord) => {
    if (!imgRecord || !imgRecord.imageUrl) return;

    sounds.playLevelUp?.();

    // Associate targetTitle with this image so it will be recognized in the future
    if (targetTitle && targetTitle.trim()) {
      try {
        const existingKw = Array.isArray(imgRecord.keywords) ? imgRecord.keywords : [];
        const cleanTarget = targetTitle.trim();
        if (!existingKw.some(k => k.toLowerCase() === cleanTarget.toLowerCase())) {
          await saveUserImage({
            ...imgRecord,
            keywords: [...existingKw, cleanTarget]
          });
        }
      } catch (err) {
        console.warn('Failed to update keywords on image select:', err);
      }
    }

    if (onSelect) {
      onSelect(imgRecord.imageUrl, imgRecord);
    }
    onClose();
  };

  // Allow uploading a new image right from within the picker
  const handleDirectUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingNew(true);
    try {
      const optimized = await optimizeImage(file, 1000, 1000, 0.85);
      const newTitle = targetTitle || file.name.replace(/\.[^/.]+$/, '');
      const saved = await saveUserImage({
        title: newTitle,
        imageUrl: optimized,
        keywords: [newTitle, targetTitle].filter(Boolean),
        domain: selectedDomain !== 'all' ? selectedDomain : 'objects'
      });

      sounds.playLevelUp?.();
      if (onSelect) {
        onSelect(saved.imageUrl, saved);
      }
      onClose();
    } catch (err) {
      console.error('Failed to upload image directly:', err);
    } finally {
      setIsUploadingNew(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className="journal-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(3, 7, 18, 0.88)',
        backdropFilter: 'blur(10px)',
        zIndex: 100000,
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
          maxWidth: '850px',
          maxHeight: '90vh',
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          border: '2px solid #10b981',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(16, 185, 129, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          color: '#f8fafc',
          direction: 'rtl',
          fontFamily: 'Rubik, sans-serif',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ImageIcon size={24} color="#34d399" />
              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#ecfdf5' }}>
                מאגר התמונות של האפליקציה
              </h2>
            </div>
            {targetTitle && (
              <p style={{ margin: '4px 0 0', color: '#a7f3d0', fontSize: '0.88rem' }}>
                בחר תמונה עבור: <strong style={{ color: '#fef08a' }}>"{targetTitle}"</strong> (התמונה תשויך למילה זו)
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingNew}
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                borderRadius: '10px',
                padding: '7px 14px',
                color: '#6ee7b7',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: isUploadingNew ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Upload size={15} />
              <span>{isUploadingNew ? 'מעלה...' : 'העלה תמונה חדשה 📷'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleDirectUpload}
            />

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
        </div>

        {/* Search & Domain Filter Bar */}
        <div style={{
          padding: '14px 22px',
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search 
              size={18} 
              color="#94a3b8" 
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חפש לפי שם תמונה או מילת אסוציאציה..."
              style={{
                width: '100%',
                padding: '10px 42px 10px 14px',
                backgroundColor: '#0f172a',
                border: '1.5px solid #334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '0.92rem',
                fontFamily: 'Rubik, sans-serif',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>

          {/* Domain Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {THEMATIC_DOMAINS.map((dom) => {
              const active = selectedDomain === dom.id;
              return (
                <button
                  key={dom.id}
                  onClick={() => {
                    sounds.playTap?.();
                    setSelectedDomain(dom.id);
                  }}
                  style={{
                    backgroundColor: active ? '#10b981' : 'rgba(15, 23, 42, 0.7)',
                    border: active ? '1.5px solid #34d399' : '1px solid #334155',
                    color: active ? '#ffffff' : '#94a3b8',
                    borderRadius: '10px',
                    padding: '6px 12px',
                    fontSize: '0.82rem',
                    fontWeight: active ? 800 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {dom.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Gallery Grid Body */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1,
          maxHeight: 'calc(90vh - 220px)'
        }}>
          {images.length === 0 ? (
            /* No images in DB at all */
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              borderRadius: '16px',
              border: '1px dashed #475569',
              margin: '20px auto',
              maxWidth: '500px'
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📂</div>
              <h3 style={{ margin: '0 0 8px', color: '#f8fafc', fontSize: '1.2rem', fontWeight: 700 }}>
                מאגר התמונות של האפליקציה ריק כרגע
              </h3>
              <p style={{ margin: '0 0 20px', color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                באפשרותך להעלות תמונה אסוציאטיבית ישירות מהמכשיר עבור "{targetTitle}", והיא תישמר במאגר לשימוש חוזר!
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingNew}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Upload size={18} />
                <span>העלה תמונה ראשונה עכשיו 📷</span>
              </button>
            </div>
          ) : filteredImages.length === 0 ? (
            /* Search filter yielded 0 */
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#94a3b8'
            }}>
              <p style={{ fontSize: '1.05rem', margin: '0 0 16px' }}>
                לא נמצאו תמונות התואמות לחיפוש "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'transparent',
                  border: '1px solid #64748b',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                נקה חיפוש
              </button>
            </div>
          ) : (
            /* Images Grid */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '16px'
            }}>
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => handleSelectImage(img)}
                  style={{
                    backgroundColor: '#1e293b',
                    border: '1.5px solid #334155',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = '#10b981';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#334155';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{
                    width: '100%',
                    height: '140px',
                    backgroundColor: '#0a0f1d',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={img.imageUrl}
                      alt={img.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '8px 12px'
                    }}>
                      <span style={{
                        color: '#f8fafc',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                      }}>
                        {img.title || img.name}
                      </span>
                    </div>
                  </div>

                  {/* Body Info & Keywords */}
                  <div style={{
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    flex: 1,
                    justifyContent: 'space-between'
                  }}>
                    {/* Keywords pills */}
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxHeight: '48px', overflow: 'hidden' }}>
                      {(img.keywords || []).slice(0, 4).map((kw, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.15)',
                            color: '#93c5fd',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            padding: '2px 6px',
                            fontSize: '0.72rem',
                            fontWeight: 600
                          }}
                        >
                          #{kw}
                        </span>
                      ))}
                      {(img.keywords || []).length > 4 && (
                        <span style={{ color: '#64748b', fontSize: '0.72rem', alignSelf: 'center' }}>
                          +{img.keywords.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Select CTA Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectImage(img);
                      }}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '7px 10px',
                        color: '#ffffff',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '4px'
                      }}
                    >
                      <Check size={14} />
                      <span>בחר תמונה זו</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MnemonicRepositoryPickerModal;
