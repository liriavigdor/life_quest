import React from 'react';
import { 
  X, 
  Sparkles, 
  Hammer, 
  Wheat, 
  Carrot, 
  Gem, 
  ArrowUpRight, 
  Check, 
  MapPin, 
  User, 
  PackageCheck,
  TrendingUp,
  Sprout
} from 'lucide-react';
import { INSTITUTIONS_CONFIG } from '../data/institutions';
import { sounds } from '../utils/sound';

export const VillageInstitutionsModal = ({
  isOpen,
  onClose,
  placedObjects,
  villageResources,
  seeds,
  onBuildInstitution,
  onUpgradeInstitution,
  onCollectProduce,
  onSendVillagerToWork,
  onFocusInstitution
}) => {
  if (!isOpen) return null;

  const institutionsList = Object.values(INSTITUTIONS_CONFIG);

  return (
    <div className="institutions-backdrop" onClick={onClose}>
      <div className="institutions-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="institutions-header">
          <div className="institutions-title-wrap">
            <div className="institutions-icon-bubble">
              <Hammer size={24} className="text-amber" />
            </div>
            <div>
              <h2>מוסדות הכפר והתפתחות המשק</h2>
              <span className="institutions-subtitle">
                בנה, שדרג והרחב את מבני הייצור והחקלאות של הכפר — שגשוג מתמשך שנבנה בקצב שלך
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור">
            <X size={18} />
          </button>
        </div>

        {/* Resources Bar */}
        <div className="institution-resources-strip">
          <div className="res-pill">
            <Sprout size={16} className="text-emerald" />
            <div className="res-meta">
              <span className="res-count">{seeds}</span>
              <span className="res-name">זרעי טיפוח</span>
            </div>
          </div>

          <div className="res-pill">
            <span className="res-emoji">🥕</span>
            <div className="res-meta">
              <span className="res-count">{villageResources.veggies || 0}</span>
              <span className="res-name">ירקות טריים</span>
            </div>
          </div>

          <div className="res-pill">
            <span className="res-emoji">🌾</span>
            <div className="res-meta">
              <span className="res-count">{villageResources.harvest || 0}</span>
              <span className="res-name">תבואה וקמח</span>
            </div>
          </div>

          <div className="res-pill">
            <span className="res-emoji">💎</span>
            <div className="res-meta">
              <span className="res-count">{villageResources.crystals || 0}</span>
              <span className="res-name">קריסטלים זוהרים</span>
            </div>
          </div>
        </div>

        {/* Institutions Cards List */}
        <div className="institutions-cards-scroll">
          {institutionsList.map((inst) => {
            const placed = placedObjects.find(o => o.type === inst.id);
            const currentLevel = placed ? (placed.level || 1) : 0;
            const levelData = inst.levels.find(l => l.level === currentLevel) || inst.levels[0];
            const nextLevelData = inst.levels.find(l => l.level === currentLevel + 1);
            const readyProduce = placed ? (placed.readyProduce || 0) : 0;

            // Check if can afford next upgrade
            let canAffordUpgrade = false;
            let missingDetails = [];
            if (nextLevelData && nextLevelData.upgradeCost) {
              const cost = nextLevelData.upgradeCost;
              canAffordUpgrade = true;
              if (cost.seeds && seeds < cost.seeds) {
                canAffordUpgrade = false;
                missingDetails.push(`${cost.seeds - seeds} זרעים`);
              }
              if (cost.veggies && (villageResources.veggies || 0) < cost.veggies) {
                canAffordUpgrade = false;
                missingDetails.push(`${cost.veggies - (villageResources.veggies || 0)} ירקות`);
              }
              if (cost.harvest && (villageResources.harvest || 0) < cost.harvest) {
                canAffordUpgrade = false;
                missingDetails.push(`${cost.harvest - (villageResources.harvest || 0)} תבואה`);
              }
              if (cost.crystals && (villageResources.crystals || 0) < cost.crystals) {
                canAffordUpgrade = false;
                missingDetails.push(`${cost.crystals - (villageResources.crystals || 0)} קריסטלים`);
              }
            }

            // Check if can afford base construction
            const canAffordBuild = seeds >= inst.baseCost.seeds;

            return (
              <div key={inst.id} className={`inst-card ${placed ? 'is-built' : 'not-built'}`}>
                {/* Card Top Row */}
                <div className="inst-card-top">
                  <div className="inst-title-group">
                    <span className="inst-emoji-badge">{inst.emoji}</span>
                    <div>
                      <div className="inst-cat-tag">{inst.category}</div>
                      <h3 className="inst-name">{inst.name}</h3>
                    </div>
                  </div>

                  {placed ? (
                    <div className="inst-level-badge">
                      <span className="level-num">רמה {currentLevel}</span>
                      <span className="level-subtitle">{levelData.subtitle}</span>
                    </div>
                  ) : (
                    <div className="inst-not-built-badge">
                      <span>טרם נבנה בכפר 🏗️</span>
                    </div>
                  )}
                </div>

                {/* Card Description */}
                <p className="inst-desc">{placed ? levelData.desc : inst.desc}</p>

                {/* Active Features of current level */}
                {placed && (
                  <div className="inst-features-row">
                    {levelData.features.map((feat, fIdx) => (
                      <span key={fIdx} className="feature-chip">
                        <Check size={12} className="text-emerald" />
                        <span>{feat}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Harvesting & Production Strip */}
                {placed && (
                  <div className="inst-production-box">
                    <div className="prod-info-row">
                      <span className="prod-label">תוצרת מוכנה לאיסוף:</span>
                      <strong className="prod-amount">
                        {readyProduce} / {levelData.maxCapacity} {inst.resourceIcon}
                      </strong>
                    </div>

                    <button
                      className={`collect-btn ${readyProduce > 0 ? 'ready' : 'empty'}`}
                      disabled={readyProduce === 0}
                      onClick={() => onCollectProduce(placed)}
                    >
                      <PackageCheck size={16} />
                      <span>
                        {readyProduce > 0 ? `אסוף ${readyProduce} ${inst.resourceName}` : 'ממתין לתנובה...'}
                      </span>
                    </button>
                  </div>
                )}

                {/* Actions Footer */}
                <div className="inst-card-footer">
                  {!placed ? (
                    <button
                      className={`build-inst-btn ${canAffordBuild ? 'can-afford' : 'disabled'}`}
                      disabled={!canAffordBuild}
                      onClick={() => onBuildInstitution(inst)}
                    >
                      <Hammer size={16} />
                      <span>
                        {canAffordBuild 
                          ? `בנה מוסד זה (${inst.baseCost.seeds} זרעים)` 
                          : `חסרים עוד ${inst.baseCost.seeds - seeds} זרעים`}
                      </span>
                    </button>
                  ) : (
                    <div className="inst-upgrades-bar">
                      {nextLevelData ? (
                        <div className="upgrade-block">
                          <button
                            className={`upgrade-btn ${canAffordUpgrade ? 'ready' : 'locked'}`}
                            disabled={!canAffordUpgrade}
                            onClick={() => onUpgradeInstitution(placed, nextLevelData)}
                          >
                            <TrendingUp size={16} />
                            <span>
                              {canAffordUpgrade 
                                ? `שדרג לרמה ${nextLevelData.level}: ${nextLevelData.title}` 
                                : `שדרוג נעול (חסרים: ${missingDetails.join(', ')})`}
                            </span>
                          </button>
                        </div>
                      ) : (
                        <span className="max-level-pill">
                          ⭐ המוסד פועל במלוא תפארתו ברמה המרבית!
                        </span>
                      )}

                      <div className="secondary-inst-actions">
                        <button 
                          className="work-btn"
                          onClick={() => onSendVillagerToWork(inst.id)}
                          title="שלח את איש הכפר לעבוד במוסד זה"
                        >
                          <User size={14} />
                          <span>שלח לעבודה</span>
                        </button>

                        <button 
                          className="locate-btn"
                          onClick={() => onFocusInstitution(placed)}
                          title="הצג מיקום במפה"
                        >
                          <MapPin size={14} />
                          <span>אתר במפה</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
