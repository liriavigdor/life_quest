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
  Heart,
  Droplet,
  Wheat,
  Smile,
  Lock,
  Unlock,
  Zap
} from 'lucide-react';
import { BUILD_CATALOG } from '../data/catalog';
import { sounds } from '../utils/sound';

const QUICK_EMOJIS = [
  '🍭', '⏳', '🪥', '🔑', '💡', '🧭', '🎯', '📚', 
  '🎨', '🎸', '☕', '💊', '👓', '💎', '🌿', '🕊️', 
  '🚀', '🍎', '💧', '🏠', '🕯️', '⚓', '🧸', '🔮'
];

export function InspectedMemoryCard({
  object,
  onClose,
  onUpdateMemory,
  onRemove,
  onVisit,
  onEnterInterior,
  onNourishRecall,
  isInteriorUnlocked = true,
  isBuildingLocked = false,
  requiredStage = 1,
  onTriggerQuickQuiz
}) {
  if (!object) return null;

  const catalogItem = BUILD_CATALOG.find(c => c.renderType === object.type);

  // Parse memory & date safely with defaults
  const initialMemory = object.memory || object.dedicatedTo || 'עוגן מרחבי אישי בכפר';
  const initialCustomTitle = object.customName || catalogItem?.name || 'פינת כפר אישית';
  const initialCustomEmoji = object.customEmoji || catalogItem?.defaultEmoji || (object.type === 'custom_totem' ? '🍭' : '');
  
  const parseInitialDate = () => {
    if (object.date) return object.date;
    const match = (object.dedicatedTo || '').match(/\(([^)]+)\)$/);
    if (match) return match[1];
    return new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [customTitle, setCustomTitle] = useState(initialCustomTitle);
  const [customEmoji, setCustomEmoji] = useState(initialCustomEmoji);
  const [memoryText, setMemoryText] = useState(initialMemory);
  const [dateText, setDateText] = useState(parseInitialDate());

  // Today string for care check
  const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const isCaredToday = object.lastCaredDate === todayStr;

  const isAnimal = !!object.isAnimal || object.type?.startsWith('animal_');
  const isPlant = ['pine_tree', 'cypress_tree', 'oak_tree', 'fruit_tree', 'sakura_tree', 'willow_tree', 'flower_garden', 'veggie_garden', 'sunflower_patch', 'bush'].includes(object.type);
  const isTotem = object.type === 'custom_totem' || object.isCustomTotem;
  const isStoryMonument = object.type === 'story_monument' || object.isStoryMonument;

  // Keep state synced when a different object or animal is clicked
  useEffect(() => {
    setCustomTitle(object.customName || object.title || catalogItem?.name || 'פינת כפר אישית');
    setCustomEmoji(object.customEmoji || catalogItem?.defaultEmoji || (object.type === 'custom_totem' ? '🍭' : ''));
    setMemoryText(object.storyText || object.memory || object.dedicatedTo || 'עוגן מרחבי אישי בכפר');
    setDateText(parseInitialDate());
    setIsEditing(false);
  }, [object.animalId, object.gx, object.gy, object.type, object.seed]);

  const handleSave = (e) => {
    e?.preventDefault();
    onUpdateMemory(
      object.gx, 
      object.gy, 
      memoryText.trim(), 
      dateText.trim(), 
      customTitle.trim(),
      object.animalId,
      customEmoji.trim()
    );
    setIsEditing(false);
    sounds.playTap();
  };

  const handleTriggerCare = () => {
    if (onNourishRecall) {
      onNourishRecall(object);
    }
  };

  const displayName = customTitle || catalogItem?.name || (isStoryMonument ? 'אנדרטת סיפור חי' : 'פינת כפר מיוחדת');
  const displayEmoji = customEmoji || catalogItem?.emoji || (isAnimal ? '🐾' : (isTotem ? '🍭' : (isStoryMonument ? '📖' : '🌿')));
  const hasInterior = catalogItem?.hasInterior || object.hasInterior || [
    'animal_coop', 'wooden_cabin', 'library', 'bakery', 'greenhouse', 'farm', 'art_studio'
  ].includes(object.type);

  return (
    <div className="inspected-memory-card glass-card" onClick={(e) => e.stopPropagation()}>
      {/* Card Header */}
      <div className="memory-card-header">
        <div className="memory-card-title-group">
          <div className="memory-card-emoji-badge">
            {object.iconUrl ? (
              <img src={object.iconUrl} alt="icon" style={{ width: '24px', height: '24px' }} />
            ) : (
              <span>{displayEmoji}</span>
            )}
          </div>
          <div className="memory-card-titles">
            {isEditing ? (
              <input 
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="תן שם או אסוציאציה (למשל: מברשת שיניים, חזרתיות)..."
                className="memory-edit-input memory-title-input"
              />
            ) : (
              <h3 className="memory-card-title">{displayName}</h3>
            )}
            {isStoryMonument ? (
              <span className="memory-card-sub" style={{ color: '#f59e0b', fontWeight: 'bold' }}>
                📖 אנדרטת סיפור חי (מקוונת)
              </span>
            ) : (
              catalogItem?.name && catalogItem.name !== displayName && (
                <span className="memory-card-sub">{catalogItem.name}</span>
              )
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
        
        {/* Custom Totem Emoji Selector (When editing or on custom totem) */}
        {(isEditing || isTotem) && (
          <div className="totem-symbol-picker-box">
            <div className="picker-title-row">
              <Smile size={14} className="text-amber" />
              <span>בחר סמל או אימוג'י לאסוציאציה שלך:</span>
            </div>
            
            <div className="quick-emoji-scroll-row">
              {QUICK_EMOJIS.map(em => (
                <button
                  key={em}
                  type="button"
                  className={`quick-emoji-btn ${customEmoji === em ? 'active' : ''}`}
                  onClick={() => {
                    setCustomEmoji(em);
                    sounds.playTap();
                  }}
                  title={`בחר ${em}`}
                >
                  {em}
                </button>
              ))}
            </div>

            <div className="custom-emoji-input-row">
              <span className="custom-emoji-label">או הקלד כל אימוג'י / סמל מהמקלדת:</span>
              <input 
                type="text"
                value={customEmoji}
                onChange={(e) => setCustomEmoji(e.target.value)}
                placeholder="למשל 🍭, 🎷, ⏳..."
                className="custom-emoji-field"
                maxLength={4}
              />
            </div>
          </div>
        )}

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
                placeholder="למשל 15/10/2026"
                className="memory-edit-input memory-date-input"
              />
            ) : (
              <strong className="memory-date-value">
                {dateText}
              </strong>
            )}
          </div>
        </div>

        {/* Gentle Care Strip (מים לצמחים ואוכל לחיות) */}
        <div className={`daily-care-card ${isCaredToday ? 'cared-complete' : 'cared-pending'}`}>
          <div className="care-header-row">
            <div className="care-title-wrap">
              <span className="care-icon-badge">
                {isAnimal ? '🌾' : (isPlant ? '💧' : '✨')}
              </span>
              <div>
                <strong>{isAnimal ? 'טיפוח והאכלת החיה' : (isPlant ? 'השקיית הצמח' : 'רענון העוגן')}</strong>
                <span className="care-sub-text">
                  {isCaredToday 
                    ? (isAnimal ? 'החיה שבעה, שלווה ומגרגרת בנחת ✓' : (isPlant ? 'הצמח שותה ומלבלב ברוגע ✓' : 'העוגן רענן ומואר בנחת ✓'))
                    : (isAnimal ? 'אפשר לתת קצת אוכל וגרגרים בנחת' : (isPlant ? 'אפשר לתת מים רעננים לצמח' : 'רענון עדין לעוגן בכפר'))}
                </span>
              </div>
            </div>

            {isCaredToday ? (
              <div className="cared-badge-pill">
                <Check size={14} />
                <span>טופח בנחת ✓</span>
              </div>
            ) : (
              <button 
                type="button" 
                className="care-action-btn"
                onClick={handleTriggerCare}
                title={isAnimal ? 'תן אוכל לחיה בנחת' : (isPlant ? 'השקה את הצמח בנחת' : 'רענן את העוגן')}
              >
                <span>{isAnimal ? 'תן אוכל 🌾' : (isPlant ? 'תן מים 💧' : 'רענן ✨')}</span>
              </button>
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
                title="ערוך שם אישי, סמל אימוג'י, או אסוציאציה"
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
                    setCustomEmoji(initialCustomEmoji);
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
              {object.allEntities && object.allEntities.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {object.allEntities.map((ent, idx) => (
                    <span key={idx} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      borderRadius: '6px',
                      padding: '2px 6px',
                      fontSize: '11px',
                      color: '#fef08a'
                    }}>
                      <span>{ent.emoji}</span>
                      <span>{ent.name}</span>
                    </span>
                  ))}
                </div>
              )}
              <p className="memory-quote-text">
                "{memoryText}"
              </p>
            </div>
          )}
        </div>

        {/* Building Locked Cue (For future stages along the mental walk) */}
        {isBuildingLocked && (
          <div className="building-locked-cue">
            <Lock size={18} className="text-amber" />
            <div className="locked-cue-text">
              <strong>מבנה נעול • נדרש שלב {requiredStage}</strong>
              <span>כדי למנוע עומס והתברברות, השלם תחילה את מבחן השליפה של התחנה הקודמת לפתיחת שביל הגישה למבנה זה!</span>
            </div>
          </div>
        )}

        {/* Interior Locked Banner (Requires quick blitz recall test) */}
        {hasInterior && !isBuildingLocked && !isInteriorUnlocked && (
          <div className="interior-locked-banner">
            <div className="interior-locked-info">
              <Lock size={16} className="text-amber" />
              <div>
                <strong>חלל הפנים של הבית נעול • מבוקר משחק 🧠</strong>
                <span>ענה על שאלת שליפה קצרה (5 שניות) לווידוא חקיקת הזיכרון לפתיחת הפנים והרחבת הכפר!</span>
              </div>
            </div>
            {onTriggerQuickQuiz && (
              <button 
                type="button" 
                className="interior-quiz-trigger-btn"
                onClick={() => onTriggerQuickQuiz(object)}
                title="התחל מבחן שליפה מהיר"
              >
                <Zap size={14} />
                <span>בחן אותי ⚡</span>
              </button>
            )}
          </div>
        )}

        {/* Action Buttons Row */}
        <div className="memory-actions-row">
          {hasInterior && !isBuildingLocked && (
            isInteriorUnlocked ? (
              onEnterInterior && (
                <button 
                  className="mem-action-btn mem-interior-btn"
                  onClick={() => onEnterInterior(object, catalogItem)}
                  title="כניסה לתוך חלל הפנים המעוצב של המבנה"
                >
                  <DoorOpen size={16} />
                  <span>היכנס פנימה 🚪</span>
                </button>
              )
            ) : (
              onTriggerQuickQuiz && (
                <button 
                  className="mem-action-btn mem-quiz-unlock-btn"
                  onClick={() => onTriggerQuickQuiz(object)}
                  title="בצע מבחן שליפה קצר (5 שניות) לפתיחת חלל הפנים והרחבת הכפר"
                >
                  <Zap size={15} className="text-amber" />
                  <span>פתיחת פנים הבית (מבחן 5 שנ') ⚡</span>
                </button>
              )
            )
          )}

          <button 
            className="mem-action-btn mem-visit-btn"
            onClick={() => onVisit(object)}
            title="שליחת הדמות לבקר בפינה זו בנחת"
          >
            <Footprints size={15} />
            <span>בקר בפינה 🚶‍♂️</span>
          </button>

          {!isBuildingLocked && (
            <button 
              className="mem-action-btn mem-remove-btn"
              onClick={() => onRemove(object)}
              title="הסרת הפריט מהכפר"
            >
              <Trash2 size={15} />
              <span>הסר 🧹</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
