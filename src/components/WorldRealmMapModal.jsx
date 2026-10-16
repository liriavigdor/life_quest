import React, { useState } from 'react';
import { Compass, MapPin, Sparkles, Navigation, X, Check, Edit2, Trees, Mountain, Sun, BookOpen } from 'lucide-react';
import { VILLAGE_PRESETS } from '../data/villages';
import { sounds } from '../utils/sound';

export function WorldRealmMapModal({
  isOpen,
  onClose,
  currentVillageId,
  villagesRegistry,
  onSelectVillage,
  onRenameVillage
}) {
  const [editingVillageId, setEditingVillageId] = useState(null);
  const [tempName, setTempName] = useState('');
  const [selectedPreviewId, setSelectedPreviewId] = useState(currentVillageId);

  if (!isOpen) return null;

  const activePreset = VILLAGE_PRESETS.find(p => p.id === selectedPreviewId) || VILLAGE_PRESETS[0];
  const activeVillageData = villagesRegistry?.[selectedPreviewId] || {};
  const activeObjects = activeVillageData.placedObjects || [];
  const memoryCount = activeObjects.filter(o => o.memory || o.dedicatedTo).length;
  const buildingCount = activeObjects.length;

  const handleStartRename = (villageId, currentName) => {
    setEditingVillageId(villageId);
    setTempName(currentName);
  };

  const handleSaveRename = (villageId) => {
    if (tempName.trim()) {
      onRenameVillage(villageId, tempName.trim());
    }
    setEditingVillageId(null);
  };

  return (
    <div className="journal-backdrop realm-map-backdrop" onClick={onClose}>
      <div className="realm-map-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="realm-map-header">
          <div className="realm-title-wrap">
            <div className="compass-icon-badge">
              <Compass size={28} className="text-amber animate-spin-slow" />
            </div>
            <div>
              <div className="realm-title-badge-row">
                <h2>מפת הממלכה והעולמות</h2>
                <span className="realm-count-tag">3 כפרים בטופוגרפיות שונות 🗺️</span>
              </div>
              <span className="realm-subtitle">
                בנה כפרים שונים בנופים מגוונים – גבעות, יער עמוק ומדבר מוזהב – לעיגון זיכרונות בגירויים חושיים עשירים
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור מפה">
            <X size={20} />
          </button>
        </div>

        {/* Cognitive Psychology Insight Banner */}
        <div className="realm-psychology-callout">
          <div className="callout-icon-col">
            <span style={{ fontSize: '24px' }}>🧠💡</span>
          </div>
          <div className="callout-text-col">
            <strong>למה סביבות טופוגרפיות שונות מסייעות לזיכרון? (Method of Loci)</strong>
            <p>
              מחקרים קוגניטיביים מוכיחים כי גירויים חושיים נפרדים – שטיחי טחב מוצלים ביער, חולות מדבר חמימים או גבעות ירוקות שטופות שמש –
              יוצרים עוגנים אסוציאטיביים עצמאיים במוח, המונעים עומס קוגניטיבי ומקלים על שליפת זיכרונות מדויקים.
            </p>
          </div>
        </div>

        {/* Main Realm Map Content: Region Selector & Detailed Territory View */}
        <div className="realm-map-body">
          {/* Territories Grid */}
          <div className="realm-territories-grid">
            {VILLAGE_PRESETS.map(preset => {
              const villageData = villagesRegistry?.[preset.id] || {};
              const isCurrent = currentVillageId === preset.id;
              const isSelected = selectedPreviewId === preset.id;
              const objs = villageData.placedObjects || [];
              const memories = objs.filter(o => o.memory || o.dedicatedTo).length;
              const displayName = villageData.name || preset.defaultName;

              return (
                <div
                  key={preset.id}
                  className={`realm-card ${isCurrent ? 'is-active-village' : ''} ${isSelected ? 'is-selected-preview' : ''}`}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedPreviewId(preset.id);
                  }}
                  style={{ '--biome-accent': preset.themeColor }}
                >
                  {/* Card Biome Banner */}
                  <div className="realm-card-banner" style={{ background: preset.accentBg }}>
                    <div className="realm-badge-pill">
                      <span className="realm-icon">{preset.icon}</span>
                      <span className="realm-badge-text">{preset.badge}</span>
                    </div>
                    {isCurrent && (
                      <span className="current-village-indicator">
                        <MapPin size={13} />
                        <span>אתה נמצא כאן</span>
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="realm-card-content">
                    <div className="realm-name-row">
                      {editingVillageId === preset.id ? (
                        <div className="rename-input-row" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={tempName}
                            onChange={e => setTempName(e.target.value)}
                            className="rename-input"
                            maxLength={24}
                            autoFocus
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveRename(preset.id);
                              if (e.key === 'Escape') setEditingVillageId(null);
                            }}
                          />
                          <button
                            className="save-rename-btn"
                            onClick={() => handleSaveRename(preset.id)}
                            title="שמור שם"
                          >
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="village-title-group">
                          <h3 className="realm-name">{displayName}</h3>
                          <button
                            className="edit-name-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartRename(preset.id, displayName);
                            }}
                            title="ערוך שם כפר"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="realm-tagline">{preset.tagline}</p>

                    {/* Quick Stats Chips */}
                    <div className="realm-stats-chips">
                      <div className="stat-chip" title="זיכרונות מעוגנים בכפר זה">
                        <span>✨</span>
                        <strong>{memories}</strong>
                        <span>זיכרונות</span>
                      </div>
                      <div className="stat-chip" title="מבנים ופינות שלווה">
                        <span>🏡</span>
                        <strong>{objs.length}</strong>
                        <span>פריטים</span>
                      </div>
                      <div className="stat-chip" title="דרגת הרחבת נחלה">
                        <span>🏰</span>
                        <span>דרגה {villageData.expansionTier || 1}</span>
                      </div>
                    </div>

                    {/* Travel Action Button */}
                    <div className="realm-card-actions">
                      {isCurrent ? (
                        <div className="current-village-btn-disabled">
                          <Check size={16} />
                          <span>כפר פעיל כעת</span>
                        </div>
                      ) : (
                        <button
                          className="travel-to-village-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            sounds.playTap();
                            onSelectVillage(preset.id);
                            onClose();
                          }}
                        >
                          <Navigation size={15} />
                          <span>צא למסע אל {displayName}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Territory Detailed Profile */}
          <div className="realm-detail-card glass-card">
            <div className="detail-head">
              <span className="detail-icon" style={{ fontSize: '32px' }}>{activePreset.icon}</span>
              <div>
                <div className="detail-name-row">
                  <h3>{activeVillageData.name || activePreset.defaultName}</h3>
                  <span className="biome-pill-tag" style={{ borderColor: activePreset.themeColor, color: activePreset.themeColor }}>
                    {activePreset.badge}
                  </span>
                </div>
                <span className="detail-desc">{activePreset.description}</span>
              </div>
            </div>

            <div className="detail-features-grid">
              <div className="feature-item">
                <span className="feature-title">🎯 מיקוד קוגניטיבי מומלץ:</span>
                <p className="feature-text">{activePreset.memoryFocus}</p>
              </div>

              <div className="feature-item">
                <span className="feature-title">🌿 תובנה פסיכולוגית:</span>
                <p className="feature-text">{activePreset.scienceTip}</p>
              </div>
            </div>

            {/* Travel CTA if not current */}
            {currentVillageId !== activePreset.id && (
              <div className="detail-bottom-cta">
                <button
                  className="big-travel-btn"
                  onClick={() => {
                    sounds.playTap();
                    onSelectVillage(activePreset.id);
                    onClose();
                  }}
                >
                  <Navigation size={18} />
                  <span>מעבר מיידי אל {activeVillageData.name || activePreset.defaultName} 🚀</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
