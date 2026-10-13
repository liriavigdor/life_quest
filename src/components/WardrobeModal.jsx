import React, { useState, useEffect } from 'react';
import { X, Sparkles, Shirt, Activity, Palette, Check, Waves } from 'lucide-react';
import { 
  OUTFITS, 
  ACTIVITIES, 
  SKIN_TONES, 
  HAIR_COLORS, 
  HAIR_STYLES, 
  GLASSES_OPTIONS, 
  HEADWEAR_OPTIONS, 
  ACCESSORY_OPTIONS 
} from '../data/wardrobe';
import { VillagerPortrait } from './VillagerPortrait';
import { sounds } from '../utils/sound';

export const WardrobeModal = ({ 
  isOpen, 
  onClose, 
  currentOutfit, 
  onSelectOutfit, 
  onSelectActivity,
  villagerStatus,
  villagerLook = {},
  onUpdateVillagerLook,
  initialTab = 'wardrobe',
  hasWaterTile,
  hasTeaTile,
  hasBonfireTile,
  hasTreeTile
}) => {
  const [activeTab, setActiveTab] = useState(initialTab); // 'wardrobe' | 'styling' | 'activities'

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const handleLookChange = (key, value) => {
    sounds.playTap();
    if (onUpdateVillagerLook) {
      onUpdateVillagerLook({
        ...villagerLook,
        [key]: value
      });
    }
  };

  return (
    <div className="wardrobe-backdrop" onClick={onClose}>
      <div className="wardrobe-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="wardrobe-header">
          <div className="wardrobe-title-wrap">
            <div className="wardrobe-icon-bubble">
              {activeTab === 'styling' ? (
                <Palette size={22} className="text-emerald" />
              ) : activeTab === 'activities' ? (
                <Activity size={22} className="text-cyan" />
              ) : (
                <Shirt size={22} className="text-amber" />
              )}
            </div>
            <div>
              <h2>סטודיו איש הכפר — לבוש, מראה ופעילויות</h2>
              <span className="wardrobe-sub">
                התאם את צבע העור, השיער, המשקפיים, הכובעים והבגדים של איש הכפר האישי שלך
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור">
            <X size={20} />
          </button>
        </div>

        {/* Current Status Pill */}
        <div className="villager-current-status-banner">
          <div className="status-item">
            <span className="status-label">לבוש כעת:</span>
            <span className="status-value">
              {OUTFITS.find(o => o.id === currentOutfit)?.name || 'סוודר סתווי'} 
              {villagerStatus?.inWater ? ' (בגד ים במים 🌊)' : ''}
            </span>
          </div>
          <div className="status-divider">•</div>
          <div className="status-item">
            <span className="status-label">פעילות:</span>
            <span className="status-value">
              {villagerStatus?.activityLabel || 'מטייל בנחת בכפר 🍃'}
            </span>
          </div>
          {villagerStatus?.fruitsEaten !== undefined && (
            <>
              <div className="status-divider">•</div>
              <div className="status-item">
                <span className="status-label">פירות שנאכלו:</span>
                <span className="status-value text-rose">
                  🍎 {villagerStatus.fruitsEaten}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Tabs: Wardrobe vs Styling vs Activities */}
        <div className="wardrobe-tabs">
          <button 
            className={`wardrobe-tab-btn ${activeTab === 'wardrobe' ? 'active' : ''}`}
            onClick={() => setActiveTab('wardrobe')}
          >
            <Shirt size={17} />
            <span>ארון הבגדים ({OUTFITS.length})</span>
          </button>
          <button 
            className={`wardrobe-tab-btn ${activeTab === 'styling' ? 'active' : ''}`}
            onClick={() => setActiveTab('styling')}
          >
            <Palette size={17} />
            <span>עיצוב ומראה הדמות (סטיילינג) ✨</span>
          </button>
          <button 
            className={`wardrobe-tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
            onClick={() => setActiveTab('activities')}
          >
            <Activity size={17} />
            <span>פעילויות בכפר ({ACTIVITIES.length})</span>
          </button>
        </div>

        {/* Tab 1: Wardrobe */}
        {activeTab === 'wardrobe' && (
          <div className="wardrobe-tab-content">
            <div className="water-suit-notice">
              <Waves size={16} className="text-cyan" />
              <span>
                <strong>שים לב:</strong> כשהאיש נכנס לפלג מים או לבריכה, הוא לובש אוטומטית בגד ים קיצי עם ברווזון מתוק!
              </span>
            </div>

            <div className="outfits-grid">
              {OUTFITS.map(outfit => {
                const isSelected = currentOutfit === outfit.id;
                return (
                  <div 
                    key={outfit.id} 
                    className={`outfit-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      sounds.playTap();
                      onSelectOutfit(outfit.id);
                    }}
                  >
                    <div className="outfit-card-header">
                      <div className="outfit-emoji-avatar" style={{ borderColor: outfit.colorPreview }}>
                        <span className="outfit-emoji">{outfit.emoji}</span>
                      </div>
                      <div className="outfit-title-col">
                        <div className="outfit-name-row">
                          <strong className="outfit-name">{outfit.name}</strong>
                          {isSelected && (
                            <span className="worn-pill">
                              <Check size={12} /> נלבש כעת
                            </span>
                          )}
                        </div>
                        <span className="outfit-tag">{outfit.tag}</span>
                      </div>
                    </div>
                    
                    <p className="outfit-desc">{outfit.description}</p>

                    <div className="outfit-card-footer">
                      <div className="color-dots">
                        <span className="color-dot" style={{ backgroundColor: outfit.colorPreview }} title="צבע מרכזי" />
                        <span className="color-dot" style={{ backgroundColor: outfit.hatColor }} title="צבע כובע/אביזר" />
                      </div>
                      <button 
                        className={`wear-btn ${isSelected ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          onSelectOutfit(outfit.id);
                        }}
                      >
                        {isSelected ? 'נלבש כעת' : 'לבש עכשיו'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Appearance & Styling Studio */}
        {activeTab === 'styling' && (
          <div className="styling-tab-content">
            <div className="styling-studio-layout">
              {/* Left Column: Enlarged Live Character Portrait */}
              <div className="studio-preview-col">
                <div className="studio-portrait-box glass-card">
                  <span className="preview-heading">תצוגה מקדימה מוגדלת</span>
                  <VillagerPortrait 
                    outfit={currentOutfit}
                    inWater={villagerStatus?.inWater}
                    activity={villagerStatus?.activity}
                    look={villagerLook}
                    scale={5.2}
                    width={180}
                    height={210}
                  />
                  <span className="preview-caption">
                    השינויים מתעדכנים מיידית גם בכפר!
                  </span>
                </div>
              </div>

              {/* Right Column: Customization Controls */}
              <div className="studio-controls-col">
                {/* 1. Skin Tone */}
                <div className="styling-group">
                  <label className="group-label">🎨 צבע עור:</label>
                  <div className="swatches-grid">
                    {SKIN_TONES.map(tone => {
                      const isSel = villagerLook?.skinTone === tone.id;
                      return (
                        <button
                          key={tone.id}
                          className={`swatch-btn ${isSel ? 'selected' : ''}`}
                          style={{ backgroundColor: tone.color }}
                          onClick={() => handleLookChange('skinTone', tone.id)}
                          title={tone.name}
                        >
                          {isSel && <Check size={14} className="swatch-check dark" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Hair Color */}
                <div className="styling-group">
                  <label className="group-label">💇 צבע שיער:</label>
                  <div className="swatches-grid">
                    {HAIR_COLORS.map(hair => {
                      const isSel = villagerLook?.hairColor === hair.id;
                      return (
                        <button
                          key={hair.id}
                          className={`swatch-btn ${isSel ? 'selected' : ''}`}
                          style={{ backgroundColor: hair.color }}
                          onClick={() => handleLookChange('hairColor', hair.id)}
                          title={hair.name}
                        >
                          {isSel && <Check size={14} className="swatch-check" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Hair Style */}
                <div className="styling-group">
                  <label className="group-label">✂️ עיצוב תסרוקת:</label>
                  <div className="options-chip-grid">
                    {HAIR_STYLES.map(style => {
                      const isSel = (villagerLook?.hairStyle || 'messy') === style.id;
                      return (
                        <button
                          key={style.id}
                          className={`option-chip-btn ${isSel ? 'selected' : ''}`}
                          onClick={() => handleLookChange('hairStyle', style.id)}
                        >
                          <span>{style.emoji}</span>
                          <span>{style.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Glasses */}
                <div className="styling-group">
                  <label className="group-label">👓 משקפיים:</label>
                  <div className="options-chip-grid">
                    {GLASSES_OPTIONS.map(g => {
                      const isSel = (villagerLook?.glasses || 'none') === g.id;
                      return (
                        <button
                          key={g.id}
                          className={`option-chip-btn ${isSel ? 'selected' : ''}`}
                          onClick={() => handleLookChange('glasses', g.id)}
                        >
                          <span>{g.emoji}</span>
                          <span>{g.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Headwear / Hats */}
                <div className="styling-group">
                  <label className="group-label">👒 כובעים וכיסויי ראש:</label>
                  <div className="options-chip-grid">
                    {HEADWEAR_OPTIONS.map(h => {
                      const isSel = (villagerLook?.headwear || 'outfit_default') === h.id;
                      return (
                        <button
                          key={h.id}
                          className={`option-chip-btn ${isSel ? 'selected' : ''}`}
                          onClick={() => handleLookChange('headwear', h.id)}
                        >
                          <span>{h.emoji}</span>
                          <span>{h.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Accessories / Details */}
                <div className="styling-group">
                  <label className="group-label">✨ אקססוריז ופרטים מיוחדים:</label>
                  <div className="options-chip-grid">
                    {ACCESSORY_OPTIONS.map(acc => {
                      const isSel = (villagerLook?.accessory || 'none') === acc.id;
                      return (
                        <button
                          key={acc.id}
                          className={`option-chip-btn ${isSel ? 'selected' : ''}`}
                          onClick={() => handleLookChange('accessory', acc.id)}
                        >
                          <span>{acc.emoji}</span>
                          <span>{acc.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Activities */}
        {activeTab === 'activities' && (
          <div className="activities-tab-content">
            <p className="activities-intro">
              בחר פעילות ואיש הכפר ילך מיד לפינה המתאימה, יבצע אותה וישתף במחשבותיו:
            </p>

            <div className="activities-grid">
              {ACTIVITIES.map(activity => {
                const isCurrent = villagerStatus?.activity === activity.id;
                let warningText = null;
                if (activity.id === 'swimming' && !hasWaterTile) {
                  warningText = 'כדי לשחות, הנח פלג מים או בריכה בטיפוח הכפר 🌊';
                } else if (activity.id === 'drinking_tea' && !hasTeaTile) {
                  warningText = 'הנח פינת תה בכפר כדי שיוכל לשבת בה 🍵';
                } else if (activity.id === 'bonfire_warming' && !hasBonfireTile) {
                  warningText = 'הנח מדורה בכפר כדי שיוכל להתחמם לצידה 🔥';
                } else if (activity.id === 'picking_fruit' && !hasTreeTile) {
                  warningText = 'הנח עץ אלון או שיח בכפר כדי שיהיה מה לקטוף 🌳';
                }

                return (
                  <div 
                    key={activity.id}
                    className={`activity-card ${isCurrent ? 'active' : ''}`}
                    onClick={() => {
                      sounds.playTap();
                      onSelectActivity(activity.id);
                    }}
                  >
                    <div className="activity-icon-col">
                      <span className="activity-emoji">{activity.emoji}</span>
                    </div>
                    <div className="activity-info-col">
                      <div className="activity-title-row">
                        <strong className="activity-name">{activity.name}</strong>
                        {isCurrent && <span className="active-badge">מתבצע כעת</span>}
                      </div>
                      <p className="activity-desc">{activity.desc}</p>
                      {warningText && (
                        <span className="activity-warning-hint">{warningText}</span>
                      )}
                    </div>
                    <div className="activity-action-col">
                      <button 
                        className={`send-activity-btn ${isCurrent ? 'current' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          sounds.playTap();
                          onSelectActivity(activity.id);
                        }}
                      >
                        {isCurrent ? 'מבצע כעת' : 'שלח עכשיו ↵'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
