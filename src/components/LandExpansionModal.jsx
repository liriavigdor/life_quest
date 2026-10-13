import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sprout, 
  Maximize2, 
  Check, 
  Pickaxe, 
  Compass, 
  MapPin, 
  Trees, 
  ChevronLeft,
  ArrowUpRight,
  ShieldCheck,
  Shovel
} from 'lucide-react';
import { EXPANSION_TIERS, PLOT_CULTIVATION_COST } from '../data/expansion';
import { sounds } from '../utils/sound';

export const LandExpansionModal = ({
  isOpen,
  onClose,
  currentTier,
  onUpgradeTier,
  seeds,
  cultivatedCount,
  onActivateCultivationMode,
  onBatchCultivate
}) => {
  const [activeTab, setActiveTab] = useState('tiers'); // 'tiers' | 'cultivate'

  if (!isOpen) return null;

  const currentTierData = EXPANSION_TIERS.find(t => t.tier === currentTier) || EXPANSION_TIERS[0];

  return (
    <div className="expansion-backdrop" onClick={onClose}>
      <div className="expansion-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="expansion-header">
          <div className="expansion-title-wrap">
            <div className="expansion-icon-bubble">
              <Compass size={22} className="text-emerald" />
            </div>
            <div>
              <h2>הרחבת שטח הכפר ועיבוד אדמות</h2>
              <span className="expansion-subtitle">
                פתח שטחים חדשים, הסג את קו היער והכשר קרקעות פורחות לבנייה ולצמיחה
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור">
            <X size={18} />
          </button>
        </div>

        {/* Status Highlights Bar */}
        <div className="expansion-status-strip">
          <div className="status-stat-item">
            <span className="stat-label">דרגת נחלה נוכחית</span>
            <div className="stat-val-row">
              <span className="stat-badge-emoji">{currentTierData.badge}</span>
              <strong className="stat-value">{currentTierData.name}</strong>
            </div>
          </div>

          <div className="status-stat-divider" />

          <div className="status-stat-item">
            <span className="stat-label">חלקות מעובדות וזמינות</span>
            <div className="stat-val-row">
              <strong className="stat-value text-emerald">{cultivatedCount}</strong>
              <span className="stat-sub-text">חלקות בטוחות לשתילה</span>
            </div>
          </div>

          <div className="status-stat-divider" />

          <div className="status-stat-item">
            <span className="stat-label">זרעי טיפוח באמתחתך</span>
            <div className="stat-val-row">
              <Sprout size={18} className="text-emerald" />
              <strong className="stat-value text-amber">{seeds}</strong>
              <span className="stat-sub-text">זרעים</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="expansion-tabs">
          <button 
            className={`expansion-tab-btn ${activeTab === 'tiers' ? 'active' : ''}`}
            onClick={() => { sounds.playTap(); setActiveTab('tiers'); }}
          >
            <Maximize2 size={16} />
            <span>דרגות נחלה (הרחבה כוללת)</span>
          </button>
          <button 
            className={`expansion-tab-btn ${activeTab === 'cultivate' ? 'active' : ''}`}
            onClick={() => { sounds.playTap(); setActiveTab('cultivate'); }}
          >
            <Shovel size={16} />
            <span>עיבוד חלקות אדמה ישיר</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="expansion-body">
          {activeTab === 'tiers' ? (
            <div className="tiers-list">
              <p className="tiers-intro-text">
                שדרוג דרגת הנחלה מרחיב את כל רדיוס הכפר בבת אחת, דוחף את עצי הספר אחורה וחושף מרחבים ירוקים חדשים ורחבי ידיים:
              </p>

              <div className="tiers-grid">
                {EXPANSION_TIERS.map((tier) => {
                  const isCurrent = tier.tier === currentTier;
                  const isUnlocked = tier.tier <= currentTier;
                  const isNext = tier.tier === currentTier + 1;
                  const canAfford = seeds >= tier.costSeeds;

                  return (
                    <div 
                      key={tier.tier}
                      className={`tier-card ${isCurrent ? 'current' : ''} ${isUnlocked ? 'unlocked' : ''} ${isNext ? 'next-target' : ''}`}
                    >
                      <div className="tier-card-header">
                        <div className="tier-badge-title">
                          <span className="tier-emoji">{tier.badge}</span>
                          <div>
                            <div className="tier-level-tag">{tier.levelTitle}</div>
                            <h3 className="tier-name">{tier.name}</h3>
                          </div>
                        </div>

                        {isCurrent ? (
                          <span className="tier-state-pill current-pill">
                            <Check size={14} />
                            נחלה פעילה
                          </span>
                        ) : isUnlocked ? (
                          <span className="tier-state-pill unlocked-pill">
                            <Check size={14} />
                            הושלם
                          </span>
                        ) : (
                          <span className="tier-cost-pill">
                            {tier.costSeeds} זרעים
                          </span>
                        )}
                      </div>

                      <p className="tier-desc">{tier.desc}</p>

                      <div className="tier-footer">
                        <span className="tier-meta-tag">רדיוס: ~{tier.radius} משבצות</span>

                        {isNext && (
                          <button
                            className={`tier-upgrade-btn ${canAfford ? 'can-buy' : 'locked'}`}
                            disabled={!canAfford}
                            onClick={() => {
                              onUpgradeTier(tier.tier, tier.costSeeds);
                            }}
                          >
                            <Sparkles size={16} />
                            <span>
                              {canAfford 
                                ? `הרחב נחלה (${tier.costSeeds} זרעים)` 
                                : `דרושים עוד ${tier.costSeeds - seeds} זרעים`}
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="cultivation-panel">
              <div className="cultivate-hero glass-card">
                <div className="hero-icon-box">
                  <Shovel size={28} className="text-emerald" />
                </div>
                <div className="hero-text-content">
                  <h3>מצב מכוש לעיבוד אדמות (Land Cultivation)</h3>
                  <p>
                    רוצה להכשיר שטח ספציפי ליד הנחל, לפתוח שביל מיוחד בתוך היער, או לעצב את שטח הכפר בדיוק כרצונך?
                    תוכל לעבד חלקות פרא הגובלות בכפר, משבצת אחר משבצת.
                  </p>
                </div>
              </div>

              <div className="cultivate-actions-row">
                {/* Mode activation button */}
                <div className="cultivate-action-card">
                  <div className="action-card-top">
                    <h4>🌾 כלי עיבוד אדמה חופשי במפה</h4>
                    <span className="cost-tag">{PLOT_CULTIVATION_COST} זרעים לחלקה</span>
                  </div>
                  <p className="action-card-desc">
                    מפעיל מכוש עיבוד במפה. חלקות הפרא הסמוכות יזהרו באור זהוב-ירוק, ולחיצה עליהן תכשיר את הקרקע מיד.
                  </p>
                  <button 
                    className="action-btn primary"
                    onClick={() => {
                      sounds.playTap();
                      onActivateCultivationMode();
                      onClose();
                    }}
                  >
                    <Shovel size={16} />
                    <span>הפעל מצב עיבוד אדמות במפה</span>
                  </button>
                </div>

                {/* Batch clearing button */}
                <div className="cultivate-action-card">
                  <div className="action-card-top">
                    <h4>✨ חבילת עיבוד שטח מהירה</h4>
                    <span className="cost-tag">45 זרעים (5 חלקות)</span>
                  </div>
                  <p className="action-card-desc">
                    מכשיר באופן מיידי 5 חלקות פרא סמוכות מסביב לגבול הכפר הקיים, בהנחה מיוחדת של זרעים.
                  </p>
                  <button 
                    className={`action-btn ${seeds >= 45 ? 'secondary' : 'disabled'}`}
                    disabled={seeds < 45}
                    onClick={() => {
                      if (seeds >= 45) {
                        onBatchCultivate(5, 45);
                      }
                    }}
                  >
                    <Sparkles size={16} />
                    <span>
                      {seeds >= 45 
                        ? 'הכשר 5 חלקות גבול (45 זרעים)' 
                        : `דרושים עוד ${45 - seeds} זרעים`}
                    </span>
                  </button>
                </div>
              </div>

              {/* Wholesome hint */}
              <div className="cultivate-tip-box">
                <span className="tip-bulb">💡</span>
                <p>
                  <strong>טיפ לצמיחה:</strong> כל חלקה שתכשיר תישמר בכפר שלך לתמיד. תוכל להציב עליה עצי אלון, פינות תה, ספסלים או בריכות נימפאה.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
