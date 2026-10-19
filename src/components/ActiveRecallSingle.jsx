import React, { useState } from 'react';
import { sounds } from '../utils/sound';

export function ActiveRecallSingle({
  itemName = '',
  associationWord = '',
  visualAnchor = null
}) {
  const [isRevealed, setIsRevealed] = useState(false);

  const handleToggle = () => {
    sounds.playTap?.();
    setIsRevealed(prev => !prev);
  };

  const anchorEmoji = visualAnchor?.emoji || '✨';

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        direction: 'rtl'
      }}
    >
      <div
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '12px 16px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          userSelect: 'none'
        }}
        title={isRevealed ? 'לחץ לסגירה' : 'לחץ לפתיחה'}
      >
        <span style={{ fontSize: '1.4rem' }}>{anchorEmoji}</span>
        <span 
          style={{
            fontSize: '1.05rem',
            fontWeight: isRevealed ? 700 : 400,
            color: isRevealed ? '#ffffff' : '#64748b',
            letterSpacing: isRevealed ? 'normal' : '2px'
          }}
        >
          {isRevealed ? itemName : '•••••'}
        </span>
      </div>
    </div>
  );
}
