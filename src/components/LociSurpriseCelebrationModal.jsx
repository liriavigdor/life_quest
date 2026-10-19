import React, { useEffect } from 'react';
import { Sparkles, Trophy, X, ArrowLeft, Heart, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

export function LociSurpriseCelebrationModal({
  isOpen,
  data,
  onClose
}) {
  useEffect(() => {
    if (isOpen && data) {
      sounds.playLevelUp?.();
      try {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.5 }
        });
      } catch (e) {}
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

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
            <span style={{ fontSize: '2.4rem', animation: 'bounce 1s infinite' }}>{data.emoji || '🎉'}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fef08a' }}>
                  {data.celebrationTitle}
                </span>
              </div>
              <span style={{ fontSize: '0.98rem', color: '#fde047', fontWeight: 600 }}>
                {data.celebrationSubtitle}
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

        {/* Big Hilarious Photo Card (150% Enormous Display) */}
        <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
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
              src={data.celebrationImage} 
              alt={data.celebrationTitle}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block'
              }}
              onError={(e) => {
                // Fallback to vector item illustration if network image fails
                if (data.imageUrl && e.target.src !== data.imageUrl) {
                  e.target.src = data.imageUrl;
                }
              }}
            />

            {/* Glowing Tag Pill */}
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

          {/* Funny Quote / Mnemonic Anchor Message */}
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.75)',
            border: '1.5px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 'bold', fontSize: '0.92rem' }}>
              <Flame size={18} className="text-amber" />
              <span>עוגן הזיכרון שלא תשכח בחיים:</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.96rem', color: '#f1f5f9', lineHeight: 1.5, fontWeight: 500 }}>
              {data.quote || data.story}
            </p>
          </div>

          {/* Action Continue Button */}
          <button
            onClick={() => {
              sounds.playTap?.();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: '#1e1b4b',
              fontWeight: 900,
              fontSize: '1.05rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)',
              transition: 'transform 0.15s ease'
            }}
          >
            <span>המשך לחדר הבא בארמון! 🏰</span>
            <ArrowLeft size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
