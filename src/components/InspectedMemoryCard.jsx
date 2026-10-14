import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Sparkles, 
  Edit3, 
  Check, 
  Trash2, 
  Footprints,
  DoorOpen,
  Tag,
  Heart
} from 'lucide-react';
import { BUILD_CATALOG } from '../data/catalog';
import { sounds } from '../utils/sound';

export function InspectedMemoryCard({
  object,
  onClose,
  onUpdateMemory,
  onRemove,
  onVisit,
  onEnterInterior
}) {
  if (!object) return null;

  const catalogItem = BUILD_CATALOG.find(c => c.renderType === object.type);

  // Parse memory & date safely with defaults
  const initialMemory = object.memory || object.dedicatedTo || 'עוגן מרחבי אישי בכפר';
  const initialCustomTitle = object.customName || catalogItem?.name || 'פינת כפר אישית';
  
  const parseInitialDate = () => {
    if (object.date) return object.date;
    const match = (object.dedicatedTo || '').match(/\(([^)]+)\)$/);
    if (match) return match[1];
    return new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(initialCustomTitle);
  const [memoryText, setMemoryText] = useState(initialMemory);
  const [dateText, setDateText] = useState(parseInitialDate());

  // Keep state synced when a different object is clicked
  useEffect(() => {
    setCustomTitle(object.customName || catalogItem?.name || 'פינת כפר אישית');
    setMemoryText(object.memory || object.dedicatedTo || 'עוגן מרחבי אישי בכפר');
    setDateText(parseInitialDate());
    setIsEditing(false);
  }, [object.gx, object.gy, object.type, object.customName]);

  const handleSave = (e) => {
    e?.preventDefault();
    onUpdateMemory(object.gx, object.gy, memoryText.trim(), dateText.trim(), customTitle.trim());
    setIsEditing(false);
    sounds.playTap();
  };

  const displayName = customTitle || catalogItem?.name || 'פינת כפר מיוחדת';
  const displayEmoji = catalogItem?.emoji || (object.isAnimal ? '🐾' : '🌿');
  const hasInterior = catalogItem?.hasInterior || object.hasInterior || [
    'animal_coop', 'wooden_cabin', 'library', 'bakery', 'greenhouse', 'farm', 'art_studio'
  ].includes(object.type);

  return (
    <div className="inspected-memory-card glass-card" onClick={(e) => e.stopPropagation()}>
      {/* Card Header */}
      <div className="memory-card-header">
        <div className="memory-card-title-group">
          <div className="memory-card-emoji-badge">
            <span>{displayEmoji}</span>
          </div>
          <div className="memory-card-titles">
            {isEditing ? (
              <input 
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="תן שם או אסוציאציה (למשל: מברשת שיניים)..."
                className="memory-edit-input memory-title-input"
              />
            ) : (
              <h3 className="memory-card-title">{displayName}</h3>
            )}
            {catalogItem?.name && catalogItem.name !== displayName && (
              <span className="memory-card-sub">{catalogItem.name}</span>
            )}
          </div>
        </div>

        <button 
          className="memory-card-close-btn" 
          onClick={onClose}
          title="סגור חלונית (✕)"
          aria-label="סגור"
        >
          <X size={18} />
        </button>
      </div>

      {/* Main Memory & Commemoration Date Body */}
      <div className="memory-card-body">
        {/* Date Row */}
        <div className="memory-date-strip">
          <div className="memory-date-icon-box">
            <Calendar size={16} className="text-amber" />
          </div>
          <div className="memory-date-content">
            <span className="memory-date-label">תאריך הצבה בכפר:</span>
            {isEditing ? (
              <input 
                type="text" 
                value={dateText}
                onChange={(e) => setDateText(e.target.value)}
                placeholder="למשל 14/10/2026"
                className="memory-edit-input memory-date-input"
              />
            ) : (
              <strong className="memory-date-value">
                {dateText}
              </strong>
            )}
          </div>
        </div>

        {/* Association & Memory Content */}
        <div className="memory-quote-box">
          <div className="memory-quote-header">
            <div className="memory-quote-title">
              <Sparkles size={15} className="text-emerald" />
              <span>משמעות ואסוציאציה אישית:</span>
            </div>
            {!isEditing && (
              <button 
                className="memory-edit-toggle-btn"
                onClick={() => setIsEditing(true)}
                title="ערוך שם אישי, אסוציאציה או תאריך"
              >
                <Edit3 size={13} />
                <span>עריכה</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="memory-edit-form">
              <textarea 
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                rows={3}
                placeholder="כתוב כאן מה העוגן הזה מסמל עבורך, שגרה שתרצה לזכור, או סיפור הדרך..."
                className="memory-edit-textarea"
                autoFocus
              />
              <div className="memory-edit-actions">
                <button 
                  type="button" 
                  className="memory-save-btn"
                  onClick={handleSave}
                >
                  <Check size={14} />
                  <span>שמור שינויים</span>
                </button>
                <button 
                  type="button" 
                  className="memory-cancel-btn"
                  onClick={() => {
                    setCustomTitle(initialCustomTitle);
                    setMemoryText(initialMemory);
                    setDateText(parseInitialDate());
                    setIsEditing(false);
                  }}
                >
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <div className="memory-quote-content">
              <p className="memory-quote-text">
                "{memoryText}"
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="memory-actions-row">
          {hasInterior && onEnterInterior && (
            <button 
              className="mem-action-btn mem-interior-btn"
              onClick={() => onEnterInterior(object, catalogItem)}
              title="כניסה לתוך חלל הפנים המעוצב של המבנה"
            >
              <DoorOpen size={16} />
              <span>היכנס פנימה 🚪</span>
            </button>
          )}

          <button 
            className="mem-action-btn mem-visit-btn"
            onClick={() => onVisit(object)}
            title="שליחת הדמות לבקר בפינה זו בנחת"
          >
            <Footprints size={15} />
            <span>בקר בפינה 🚶‍♂️</span>
          </button>

          <button 
            className="mem-action-btn mem-remove-btn"
            onClick={() => onRemove(object)}
            title="הסרת הפריט מהכפר"
          >
            <Trash2 size={15} />
            <span>הסר 🧹</span>
          </button>
        </div>
      </div>
    </div>
  );
}
