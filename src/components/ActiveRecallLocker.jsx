import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { sounds } from '../utils/sound';
import { getStoredDeposits, saveDeposit } from '../utils/keyMethodStorage';

/**
 * ActiveRecallLocker:
 * כרטיסיות פשוטות ונקיות.
 * המידע לא מוצג אוטומטית (נפתח רק בלחיצה), ללא מילים מיותרות וללא הודעות על מבחן.
 */
export function ActiveRecallLocker({
  depositId,
  items = [],
  criterion = '',
  visualAnchor = null,
  onReorder = null
}) {
  const normalize = (raw) => {
    return (raw || []).map((it, idx) => ({
      id: it.id || `item_${idx}`,
      name: typeof it === 'string' ? it : (it.name || it.text || `פריט ${idx + 1}`),
      rank: it.rank || idx + 1
    }));
  };

  const [cardItems, setCardItems] = useState(() => normalize(items));
  
  // Drawers/cards start closed by default (Active Recall happens implicitly on click)
  const [openedIds, setOpenedIds] = useState({});

  useEffect(() => {
    if (items && items.length > 0) {
      setCardItems(normalize(items));
    }
  }, [items]);

  // Click card to toggle open/close (Implicit Active Recall)
  const handleToggleCard = (id) => {
    sounds.playTap?.();
    setOpenedIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));

    if (depositId) {
      const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
      const all = getStoredDeposits();
      const dep = all.find(d => d.id === depositId);
      if (dep && dep.lastPracticed !== todayStr) {
        saveDeposit({
          ...dep,
          lastPracticed: todayStr
        });
      }
    }
  };

  // Move a card up or down
  const handleMoveCard = (index, direction, e) => {
    e?.stopPropagation();
    sounds.playTap?.();

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= cardItems.length) return;

    const copy = [...cardItems];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reRanked = copy.map((it, idx) => ({
      ...it,
      rank: idx + 1
    }));

    setCardItems(reRanked);

    if (onReorder) {
      onReorder(reRanked);
    } else if (depositId) {
      const all = getStoredDeposits();
      const dep = all.find(d => d.id === depositId);
      if (dep) {
        saveDeposit({
          ...dep,
          items: reRanked
        });
      }
    }
  };

  const anchorEmoji = visualAnchor?.emoji || '🗄️';

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
      {/* Simple Question Header */}
      {criterion && (
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '12px 16px',
            boxSizing: 'border-box'
          }}
        >
          <span style={{ fontSize: '1.4rem' }}>{anchorEmoji}</span>
          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#fef08a' }}>
            {criterion}
          </h4>
        </div>
      )}

      {/* Simple Clean Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {cardItems.map((item, index) => {
          const isOpen = !!openedIds[item.id];

          return (
            <div
              key={item.id}
              onClick={() => handleToggleCard(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: index === 0 
                  ? 'rgba(245, 158, 11, 0.12)' 
                  : 'rgba(255, 255, 255, 0.04)',
                border: index === 0 
                  ? '1.5px solid rgba(245, 158, 11, 0.5)' 
                  : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '10px 14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none'
              }}
              title={isOpen ? 'לחץ לסגירה' : 'לחץ לפתיחה'}
            >
              {/* Rank & Item Content */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                <span 
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '6px',
                    background: index === 0 ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                    color: index === 0 ? '#000000' : '#e2e8f0',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </span>

                <span 
                  style={{
                    fontSize: '1rem',
                    fontWeight: isOpen ? 700 : 400,
                    color: isOpen ? '#ffffff' : '#64748b',
                    letterSpacing: isOpen ? 'normal' : '2px'
                  }}
                >
                  {isOpen ? item.name : '•••••'}
                </span>
              </div>

              {/* Up / Down Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={(e) => handleMoveCard(index, -1, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: index === 0 ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    cursor: index === 0 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="העלה למעלה"
                >
                  <ChevronUp size={18} />
                </button>

                <button
                  type="button"
                  disabled={index === cardItems.length - 1}
                  onClick={(e) => handleMoveCard(index, 1, e)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: index === cardItems.length - 1 ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1',
                    width: '28px',
                    height: '28px',
                    borderRadius: '6px',
                    cursor: index === cardItems.length - 1 ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="הורד למטה"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
