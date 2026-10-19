import React from 'react';
import { X, Sparkles, Brain, Check, MapPin, Compass } from 'lucide-react';
import { sounds } from '../utils/sound';

export function LociItemInspectionModal({
  isOpen,
  item,
  onClose
}) {
  if (!isOpen || !item) return null;

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
          maxWidth: '520px',
          backgroundColor: '#111827',
          borderRadius: '20px',
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
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #2a1608 0%, #150d06 100%)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>{item.emoji}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fef3c7' }}>
                  תחנה {item.order}: {item.title}
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: '#78350f',
                  color: '#fde047',
                  fontWeight: 600
                }}>
                  ארמון הזיכרון
                </span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {item.roomName}
              </span>
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

        {/* Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Large High Definition Image Display */}
          <div style={{
            width: '100%',
            height: '220px',
            borderRadius: '14px',
            overflow: 'hidden',
            backgroundColor: '#0f172a',
            border: '2px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={item.celebrationImage || item.imageUrl} 
              alt={item.celebrationTitle || item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: item.celebrationImage ? 'cover' : 'contain'
              }}
              onError={(e) => {
                if (item.imageUrl && e.target.src !== item.imageUrl) {
                  e.target.src = item.imageUrl;
                }
              }}
            />
          </div>

          {/* Funny Mnemonic Quote */}
          {item.quote && (
            <div style={{
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: '12px',
              padding: '10px 14px',
              color: '#fef08a',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              lineHeight: 1.4
            }}>
              <span>💬 {item.quote}</span>
            </div>
          )}

          {/* Mnemonic Story Card */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.7)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fde047', fontWeight: 'bold', fontSize: '0.9rem' }}>
              <Brain size={18} />
              <span>עוגן הזיכרון בארמון:</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.5 }}>
              {item.story}
            </p>
          </div>

          {/* Location & Recall Tip */}
          <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <MapPin size={20} style={{ color: '#fbbf24', flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', color: '#fef3c7', lineHeight: 1.4 }}>
              <strong>מיקום פיזי בבית: </strong>{item.roomName}
              <br />
              <span style={{ color: '#cbd5e1' }}>טיפ לשליפה: {item.hint}</span>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => {
              sounds.playTap?.();
              onClose();
            }}
            style={{
              background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
              border: '1px solid #f59e0b',
              color: '#ffffff',
              padding: '12px 20px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
              marginTop: '4px'
            }}
          >
            <Check size={18} />
            <span>הבנתי! זכרתי את התחנה 🧠✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default LociItemInspectionModal;
