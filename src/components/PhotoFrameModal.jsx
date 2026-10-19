import React, { useState, useRef } from 'react';
import { X, Upload, Trash2, Camera, Sparkles, Check, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { saveDeposit, deleteDeposit } from '../utils/keyMethodStorage';

export function PhotoFrameModal({
  isOpen,
  onClose,
  roomId,
  roomName,
  existingPhoto,
  villageCipher = 'יער',
  houseCipher = 'אבק',
  onPhotoSaved
}) {
  const [isEditing, setIsEditing] = useState(!existingPhoto);
  const [photoDataUrl, setPhotoDataUrl] = useState(existingPhoto?.imageUrl || '');
  const [title, setTitle] = useState(existingPhoto?.title || '');
  const [story, setStory] = useState(existingPhoto?.story || '');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Sync state if existingPhoto changes
  React.useEffect(() => {
    if (existingPhoto) {
      setPhotoDataUrl(existingPhoto.imageUrl || '');
      setTitle(existingPhoto.title || '');
      setStory(existingPhoto.story || '');
      setIsEditing(false);
    } else {
      setPhotoDataUrl('');
      setTitle('');
      setStory('');
      setIsEditing(true);
    }
  }, [existingPhoto, isOpen]);

  if (!isOpen) return null;

  // Process and compress image file to data URL
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('אנא בחר קובץ תמונה תקין (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress to max 1000px width/height to keep localStorage compact
        const maxDim = 1000;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressedData = canvas.toDataURL('image/jpeg', 0.85);

        sounds.playTap?.();
        setPhotoDataUrl(compressedData);
        if (!title.trim()) {
          const rawName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'תמונה אישית';
          setTitle(rawName);
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) processImageFile(file);
        break;
      }
    }
  };

  const handleSave = () => {
    if (!photoDataUrl) {
      alert('אנא העלה או בחר תמונה תחילה.');
      return;
    }

    sounds.playFanfare?.();

    const photoDeposit = {
      id: existingPhoto?.id || `photo_${roomId}_${Date.now()}`,
      createdAt: existingPhoto?.createdAt || Date.now(),
      updatedAt: Date.now(),
      villageCipher,
      houseCipher,
      roomId,
      roomName: roomName || 'חדר הבית',
      type: 'photo',
      imageUrl: photoDataUrl,
      title: title.trim() || 'תמונה על הקיר',
      story: story.trim(),
      visualAnchor: {
        emoji: '🖼️',
        label: title.trim() || 'תמונה'
      }
    };

    saveDeposit(photoDeposit);

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {}

    onPhotoSaved?.(photoDeposit);
    onClose();
  };

  const handleDelete = () => {
    if (!existingPhoto?.id) return;
    if (window.confirm('האם אתה בטוח שברצונך להוריד את התמונה מהקיר?')) {
      sounds.playTap?.();
      deleteDeposit(existingPhoto.id);
      onPhotoSaved?.(null);
      onClose();
    }
  };

  return (
    <div 
      className="journal-backdrop key-method-backdrop animate-fade-in" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      style={{ zIndex: 1100 }}
      onPaste={handlePaste}
    >
      <div 
        className="glass-card" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '540px',
          borderRadius: '24px',
          background: 'linear-gradient(165deg, #1c1829 0%, #110e1c 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.45)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 158, 11, 0.15)',
          color: '#f8fafc',
          direction: 'rtl',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>🖼️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fef08a', fontWeight: 800 }}>
                תמונה על הקיר — {roomName}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {isEditing ? 'הכנס תמונה אמיתית שתעוגן בזיכרון בחדר' : 'זיכרון חזותי מעוגן על קיר החדר'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px' }}>

          {/* VIEW MODE: When existing photo is being inspected */}
          {!isEditing && existingPhoto && (
            <div>
              {/* Ornate Wall Picture Frame Container */}
              <div 
                style={{
                  position: 'relative',
                  margin: '0 auto 18px auto',
                  maxWidth: '380px',
                  borderRadius: '16px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #78350f 0%, #451a03 50%, #78350f 100%)',
                  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), inset 0 2px 4px rgba(251, 191, 36, 0.5), inset 0 -2px 4px rgba(0, 0, 0, 0.8)',
                  border: '2px solid #b45309'
                }}
              >
                <div 
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000',
                    maxHeight: '260px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <img 
                    src={existingPhoto.imageUrl} 
                    alt={existingPhoto.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '260px',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </div>

              {/* Title & Story */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#fef08a', fontWeight: 800 }}>
                  {existingPhoto.title}
                </h4>
                {existingPhoto.story && (
                  <p style={{ margin: 0, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                    {existingPhoto.story}
                  </p>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#fca5a5',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={15} />
                  <span>הורד מהקיר</span>
                </button>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#e2e8f0',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 600
                    }}
                  >
                    החלף תמונה
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      border: 'none',
                      color: '#000000',
                      padding: '8px 20px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontSize: '0.88rem',
                      fontWeight: 800
                    }}
                  >
                    סגור
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT / UPLOAD MODE */}
          {isEditing && (
            <div>
              {/* Drop / Upload Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragOver ? '2px dashed #f59e0b' : '2px dashed rgba(245, 158, 11, 0.4)',
                  background: isDragOver ? 'rgba(245, 158, 11, 0.15)' : 'rgba(0, 0, 0, 0.35)',
                  borderRadius: '18px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  marginBottom: '16px',
                  transition: 'all 0.2s ease'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />

                {photoDataUrl ? (
                  <div>
                    <img 
                      src={photoDataUrl} 
                      alt="תצוגה מקדימה"
                      style={{
                        maxHeight: '160px',
                        maxWidth: '100%',
                        borderRadius: '10px',
                        marginBottom: '10px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)'
                      }}
                    />
                    <div style={{ fontSize: '0.82rem', color: '#fef08a', fontWeight: 600 }}>
                      לחץ לבחירת תמונה אחרת או הדבק תמונה מהלוח (Ctrl+V)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div 
                      style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        background: 'rgba(245, 158, 11, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px auto',
                        color: '#f59e0b'
                      }}
                    >
                      <Camera size={26} />
                    </div>
                    <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                      בחר תמונה אמיתית מהמכשיר או גרור לכאן
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      ניתן גם להדביק תמונה ישירות עם Ctrl + V
                    </div>
                  </div>
                )}
              </div>

              {/* Title Field */}
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  כותרת התמונה:
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="למשל: סיום מסלול, טיול בירושלים, מתכון סודי..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1.5px solid rgba(245, 158, 11, 0.35)',
                    color: '#ffffff',
                    fontSize: '0.95rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Memory Story Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                  מה הזיכרון שמקבע את התמונה הזו?
                </label>
                <textarea
                  rows={3}
                  value={story}
                  onChange={e => setStory(e.target.value)}
                  placeholder="הסבר קצר, סיפור אישי או משמעות הזיכרון שיעזור לך לשלוף את זה תמיד..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1.5px solid rgba(245, 158, 11, 0.35)',
                    color: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {existingPhoto ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    ביטול
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  disabled={!photoDataUrl}
                  onClick={handleSave}
                  style={{
                    background: photoDataUrl ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: photoDataUrl ? '#000000' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    cursor: photoDataUrl ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: photoDataUrl ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
                  }}
                >
                  <Sparkles size={16} />
                  <span>תלה תמונה על הקיר</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
