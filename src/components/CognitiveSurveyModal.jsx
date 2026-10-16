import React, { useState } from 'react';
import { 
  X, 
  Brain, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  RotateCcw
} from 'lucide-react';
import { 
  DOMAINS_CATALOG, 
  THEMES_CATALOG, 
  ABSTRACT_ASSOCIATION_QUESTIONS,
  compileAbstractBlueprint
} from '../data/cognitiveSurvey';
import { sounds } from '../utils/sound';

export function CognitiveSurveyModal({
  isOpen,
  onClose,
  onApplyBlueprint
}) {
  // Steps: 1 = Domains, 2 = Themes, 3 = Abstract Associations, 4 = Compiled Blueprint
  const [currentStep, setCurrentStep] = useState(1);

  // Selections state
  const [selectedDomainIds, setSelectedDomainIds] = useState(['military', 'business', 'sanctuary']);
  const [domainThemes, setDomainThemes] = useState({
    military: 'forest',
    business: 'desert',
    sanctuary: 'hills'
  });

  // Step 3 Abstract Associations (color & style per domain)
  const [domainAssociations, setDomainAssociations] = useState({
    military: { color: 'green', style: 'discipline' },
    business: { color: 'white', style: 'modern' },
    sanctuary: { color: 'green', style: 'pastoral' }
  });

  // Track domain index for Step 2 & Step 3
  const [activeDomainIndex, setActiveDomainIndex] = useState(0);

  // Result blueprint
  const [compiledResult, setCompiledResult] = useState(null);

  if (!isOpen) return null;

  const currentDomain = DOMAINS_CATALOG.find(d => d.id === selectedDomainIds[activeDomainIndex]) || DOMAINS_CATALOG[0];

  // Domain selection toggle in Step 1
  const toggleDomain = (domainId) => {
    sounds.playTap();
    if (selectedDomainIds.includes(domainId)) {
      if (selectedDomainIds.length > 1) {
        setSelectedDomainIds(selectedDomainIds.filter(id => id !== domainId));
      }
    } else {
      if (selectedDomainIds.length < 3) {
        setSelectedDomainIds([...selectedDomainIds, domainId]);
      } else {
        setSelectedDomainIds([selectedDomainIds[0], selectedDomainIds[1], domainId]);
      }
    }
  };

  // Select theme in Step 2
  const selectThemeForCurrentDomain = (themeId) => {
    sounds.playTap();
    setDomainThemes(prev => ({
      ...prev,
      [currentDomain.id]: themeId
    }));
  };

  // Select abstract association in Step 3
  const selectAbstractField = (field, value) => {
    sounds.playTap();
    setDomainAssociations(prev => ({
      ...prev,
      [currentDomain.id]: {
        ...(prev[currentDomain.id] || {}),
        [field]: value
      }
    }));
  };

  // Handle compiling the blueprint
  const handleCompile = () => {
    sounds.playHarvest();
    const result = compileAbstractBlueprint({
      selectedDomainIds,
      domainThemes,
      domainAssociations
    });
    setCompiledResult(result);
    setCurrentStep(4);
  };

  return (
    <div className="journal-backdrop cognitive-survey-backdrop" onClick={onClose}>
      <div className="cognitive-survey-modal glass-card" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="survey-modal-header">
          <div className="survey-title-wrap">
            <div className="brain-icon-badge">
              <Brain size={26} className="text-amber" />
            </div>
            <div>
              <div className="survey-header-row">
                <h2>שאלון מיפוי ארץ הזכרונות</h2>
                <span className="survey-step-pill">
                  {currentStep === 4 ? 'תוצאת המיפוי ✨' : `שלב ${currentStep} מתוך 3`}
                </span>
              </div>
              <p className="survey-subhead">
                אפיון מופשט ומהיר להתאמת מסגרת הכפרים במוח שלך
              </p>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור שאלון">
            <X size={20} />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="survey-progress-bar-track">
          <div 
            className="survey-progress-bar-fill" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* STEP 1: What to Remember? (Domains) */}
        {currentStep === 1 && (
          <div className="survey-step-body survey-step-1">
            <div className="survey-step-intro">
              <span className="step-tag">שלב 1: מאקרו</span>
              <h3>מהם תחומי החיים שתרצה לסדר ולזכור?</h3>
              <p>בחר 1 עד 3 תחומים. עבור כל תחום שייבחר יוקם כפר ייעודי במפת הממלכה שלך.</p>
            </div>

            <div className="survey-domains-grid">
              {DOMAINS_CATALOG.map(domain => {
                const isSelected = selectedDomainIds.includes(domain.id);
                return (
                  <div
                    key={domain.id}
                    className={`domain-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleDomain(domain.id)}
                    style={{ borderColor: isSelected ? domain.color : 'transparent' }}
                  >
                    <div className="domain-card-head">
                      <span className="domain-emoji">{domain.emoji}</span>
                      <div className="domain-title-col">
                        <h4>{domain.title}</h4>
                        <span className="domain-badge">{domain.badge}</span>
                      </div>
                      <div className={`domain-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={16} />}
                      </div>
                    </div>
                    <p className="domain-desc">{domain.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="survey-footer-nav">
              <span className="selection-count-hint">
                נבחרו {selectedDomainIds.length} מתוך 3 תחומים
              </span>
              <button
                className="survey-next-btn primary-glow-btn"
                disabled={selectedDomainIds.length === 0}
                onClick={() => {
                  sounds.playTap();
                  setActiveDomainIndex(0);
                  setCurrentStep(2);
                }}
              >
                <span>המשך לשלב 2: בחירת הנוף וה-Theme</span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Meso Theme & Environment */}
        {currentStep === 2 && (
          <div className="survey-step-body survey-step-2">
            <div className="survey-step-intro">
              <span className="step-tag">שלב 2: מזו (נוף ואווירה)</span>
              <div className="domain-sub-selector-tabs">
                {selectedDomainIds.map((domId, idx) => {
                  const domObj = DOMAINS_CATALOG.find(d => d.id === domId);
                  const isCurrent = idx === activeDomainIndex;
                  return (
                    <button
                      key={domId}
                      className={`domain-tab-pill ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        sounds.playTap();
                        setActiveDomainIndex(idx);
                      }}
                    >
                      <span>{domObj?.emoji} {domObj?.title}</span>
                    </button>
                  );
                })}
              </div>
              <h3>איזה נוף עולה לך בראש עבור {currentDomain.title}?</h3>
              <p>הסביבה הטופוגרפית משמשת כעוגן חושי שמפריד את המידע ומקל על שליפתו.</p>
            </div>

            <div className="survey-themes-grid">
              {THEMES_CATALOG.map(theme => {
                const isSelected = domainThemes[currentDomain.id] === theme.id;
                return (
                  <div
                    key={theme.id}
                    className={`theme-select-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => selectThemeForCurrentDomain(theme.id)}
                  >
                    <div className="theme-card-top">
                      <span className="theme-emoji">{theme.emoji}</span>
                      <div>
                        <h4>{theme.name}</h4>
                        <span className="theme-palette-tag">{theme.paletteName}</span>
                      </div>
                      <div className={`domain-checkbox ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <Check size={16} />}
                      </div>
                    </div>
                    <p className="theme-tagline">"{theme.tagline}"</p>
                    <p className="theme-desc">{theme.desc}</p>
                  </div>
                );
              })}
            </div>

            <div className="survey-footer-nav between">
              <button
                className="survey-back-btn"
                onClick={() => {
                  sounds.playTap();
                  if (activeDomainIndex > 0) {
                    setActiveDomainIndex(activeDomainIndex - 1);
                  } else {
                    setCurrentStep(1);
                  }
                }}
              >
                <ArrowRight size={18} />
                <span>חזור</span>
              </button>

              <button
                className="survey-next-btn primary-glow-btn"
                onClick={() => {
                  sounds.playTap();
                  if (activeDomainIndex < selectedDomainIds.length - 1) {
                    setActiveDomainIndex(activeDomainIndex + 1);
                  } else {
                    setActiveDomainIndex(0);
                    setCurrentStep(3);
                  }
                }}
              >
                <span>
                  {activeDomainIndex < selectedDomainIds.length - 1
                    ? `המשך לכפר הבא (${DOMAINS_CATALOG.find(d => d.id === selectedDomainIds[activeDomainIndex + 1])?.title})`
                    : 'המשך לשלב 3: אסוציאציות מופשטות'}
                </span>
                <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Pure Abstract Associations (Color & Style, 0% Complexity) */}
        {currentStep === 3 && (
          <div className="survey-step-body survey-step-abstract">
            <div className="survey-step-intro">
              <span className="step-tag">שלב 3: אסוציאציות מופשטות</span>
              <div className="domain-sub-selector-tabs">
                {selectedDomainIds.map((domId, idx) => {
                  const domObj = DOMAINS_CATALOG.find(d => d.id === domId);
                  const isCurrent = idx === activeDomainIndex;
                  return (
                    <button
                      key={domId}
                      className={`domain-tab-pill ${isCurrent ? 'active' : ''}`}
                      onClick={() => {
                        sounds.playTap();
                        setActiveDomainIndex(idx);
                      }}
                    >
                      <span>{domObj?.emoji} {domObj?.title}</span>
                    </button>
                  );
                })}
              </div>
              <h3>איך המוח שלך תופס את {currentDomain.title}?</h3>
              <p>שתי בחירות פשוטות בלבד לקביעת צבעוניות וסגנון המרחב:</p>
            </div>

            <div className="abstract-questions-wrapper">
              {/* Question 1: Color Association */}
              <div className="abstract-q-box">
                <span className="abstract-q-title">1. איזה צבע המוח שלך מדביק לתחום הזה?</span>
                <div className="abstract-color-chips-row">
                  {ABSTRACT_ASSOCIATION_QUESTIONS.color.options.map(opt => {
                    const isSelected = (domainAssociations[currentDomain.id]?.color || 'green') === opt.id;
                    return (
                      <button
                        key={opt.id}
                        className={`abstract-chip-btn ${isSelected ? 'selected' : ''}`}
                        onClick={() => selectAbstractField('color', opt.id)}
                      >
                        <span className="chip-label">{opt.text}</span>
                        <span className="chip-sub">{opt.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Style Association */}
              <div className="abstract-q-box">
                <span className="abstract-q-title">2. איזה סגנון ארגון מתאר את התחום עבורך?</span>
                <div className="abstract-style-cards-grid">
                  {ABSTRACT_ASSOCIATION_QUESTIONS.style.options.map(opt => {
                    const isSelected = (domainAssociations[currentDomain.id]?.style || 'discipline') === opt.id;
                    return (
                      <div
                        key={opt.id}
                        className={`abstract-style-card ${isSelected ? 'selected' : ''}`}
                        onClick={() => selectAbstractField('style', opt.id)}
                      >
                        <div className="style-card-title-row">
                          <strong>{opt.text}</strong>
                          <div className={`domain-checkbox mini ${isSelected ? 'checked' : ''}`}>
                            {isSelected && <Check size={14} />}
                          </div>
                        </div>
                        <p className="style-card-desc">{opt.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="survey-footer-nav between">
              <button
                className="survey-back-btn"
                onClick={() => {
                  sounds.playTap();
                  if (activeDomainIndex > 0) {
                    setActiveDomainIndex(activeDomainIndex - 1);
                  } else {
                    setActiveDomainIndex(selectedDomainIds.length - 1);
                    setCurrentStep(2);
                  }
                }}
              >
                <ArrowRight size={18} />
                <span>חזור</span>
              </button>

              <button
                className="survey-next-btn primary-glow-btn"
                onClick={() => {
                  sounds.playTap();
                  if (activeDomainIndex < selectedDomainIds.length - 1) {
                    setActiveDomainIndex(activeDomainIndex + 1);
                  } else {
                    handleCompile();
                  }
                }}
              >
                <span>
                  {activeDomainIndex < selectedDomainIds.length - 1
                    ? `המשך לאסוציאציה של ${DOMAINS_CATALOG.find(d => d.id === selectedDomainIds[activeDomainIndex + 1])?.title}`
                    : 'חולל את ארץ הזכרונות שלי ✨'}
                </span>
                <Sparkles size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Compiled Result & The Villages Built for the User */}
        {currentStep === 4 && compiledResult && (
          <div className="survey-step-body survey-step-result">
            <div className="result-profile-card glass-card">
              <div className="profile-badge-row">
                <span className="profile-icon">🧠✨</span>
                <div>
                  <span className="profile-subtitle">הפרופיל המותאם שלך</span>
                  <h3>{compiledResult.cognitiveProfile.title}</h3>
                </div>
              </div>
              <p className="profile-summary-text">
                {compiledResult.cognitiveProfile.summary}
              </p>
            </div>

            <h3 className="result-villages-title">
              הכפרים שכוננו ב"ארץ הזכרונות" ({compiledResult.villages.length})
            </h3>

            {/* Generated Villages Cards */}
            <div className="result-villages-list">
              {compiledResult.villages.map(village => (
                <div key={village.id} className="generated-village-card glass-card">
                  <div className="v-card-top">
                    <span className="v-card-icon" style={{ background: village.color + '22', color: village.color }}>
                      {village.icon}
                    </span>
                    <div className="v-card-info">
                      <h4>{village.name}</h4>
                      <span className="v-card-badge">{village.badge}</span>
                    </div>
                  </div>

                  <p className="v-card-desc">{village.description}</p>

                  <div className="v-recipe-breakdown">
                    <div className="recipe-tag">
                      <span>צבע מוביל:</span>
                      <strong>{village.spatialRecipe.color}</strong>
                    </div>
                    <div className="recipe-tag">
                      <span>סגנון ארגון:</span>
                      <strong>{village.spatialRecipe.style}</strong>
                    </div>
                    <div className="recipe-tag">
                      <span>נוף וטופוגרפיה:</span>
                      <strong>{village.spatialRecipe.palette}</strong>
                    </div>
                  </div>

                  <div className="v-objects-preview">
                    <span className="objects-label">מבנה בסיסי שהוצב בכפר:</span>
                    <div className="objects-pills-row">
                      {village.placedObjects.slice(0, 6).map((obj, i) => (
                        <span key={i} className="mini-obj-pill">
                          {obj.customEmoji || '📍'} {obj.customName || obj.dedicatedTo || obj.type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Final Action Buttons */}
            <div className="survey-footer-nav between">
              <button
                className="survey-back-btn"
                onClick={() => {
                  sounds.playTap();
                  setCurrentStep(3);
                }}
              >
                <RotateCcw size={16} />
                <span>ערוך בחירות שוב</span>
              </button>

              <button
                className="survey-apply-btn primary-glow-btn"
                onClick={() => {
                  sounds.playHarvest();
                  if (onApplyBlueprint) {
                    onApplyBlueprint(compiledResult);
                  }
                  onClose();
                }}
              >
                <Sparkles size={18} />
                <span>החל כפרים אלו על ארץ הזכרונות שלי וצא למסע! 🚀</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
