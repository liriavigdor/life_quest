import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Brain, 
  DoorOpen, 
  MapPin, 
  Check, 
  Layers, 
  Compass,
  RotateCcw
} from 'lucide-react';
import { INSTITUTIONS_CONFIG } from '../data/institutions';
import { sounds } from '../utils/sound';

export const VillageInstitutionsModal = ({
  isOpen,
  onClose,
  placedObjects = [],
  onFocusInstitution,
  onEnterInterior
}) => {
  if (!isOpen) return null;

  const institutionsList = Object.values(INSTITUTIONS_CONFIG);

  // Cultivation & Repetition status state stored in localStorage
  const [cultivationDates, setCultivationDates] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_institutions_cultivation_log');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [toastMessage, setToastMessage] = useState('');
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  const handleCultivate = (instId, instName) => {
    sounds.playTap?.();
    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...cultivationDates,
      [instId]: {
        lastReviewed: today,
        repetitionStreak: (cultivationDates[instId]?.repetitionStreak || 0) + 1
      }
    };
    setCultivationDates(updated);
    try {
      localStorage.setItem('lifequest_institutions_cultivation_log', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    showToast(`טופח בהצלחה: "${instName}" רוענן בזיכרון 🧠✨`);
  };

  // Helper to get active loci count for an institution from localStorage
  const getActiveAnchorsCount = (inst) => {
    try {
      if (inst.id === 'wooden_cabin') {
        const saved = localStorage.getItem(`lifequest_stardew_farmhouse_loci_0_0`);
        if (saved) {
          const parsed = JSON.parse(saved);
          const fixedCount = Object.values(parsed.fixedLoci || {}).filter(l => l.title?.trim()).length;
          const customCount = (parsed.customAnchors || []).length;
          return fixedCount + customCount;
        }
      } else if (inst.id === 'community_center') {
        const saved = localStorage.getItem(`lifequest_institution_complex_loci_0_0`);
        if (saved) {
          const parsed = JSON.parse(saved);
          const fixedCount = Object.values(parsed.fixedLoci || {}).filter(l => l.title?.trim()).length;
          const customCount = (parsed.customAnchors || []).length;
          return fixedCount + customCount;
        }
      }
    } catch {
      // fallback
    }
    return 0;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="institutions-backdrop" onClick={onClose}>
      <div className="institutions-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="institutions-header">
          <div className="institutions-title-wrap">
            <div className="institutions-icon-bubble">
              <Brain size={26} className="text-amber" />
            </div>
            <div>
              <h2>מוסדות הכפר ומרחבי הזיכרון (Method of Loci)</h2>
              <span className="institutions-subtitle">
                ארמונות זיכרון מרחביים לקידוד ויזואלי של מידע, משימות והרגלים — טיפוח מתמיד דרך חזרתיות פעילה
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור">
            <X size={18} />
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="institutions-toast-banner animate-bounce-gentle">
            <Sparkles size={16} className="text-amber" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Repetition & Cultivation Summary Strip */}
        <div className="institution-resources-strip memory-summary-strip">
          <div className="res-pill">
            <Compass size={18} className="text-amber" />
            <div className="res-meta">
              <span className="res-count">{institutionsList.length}</span>
              <span className="res-name">מרחבי זיכרון</span>
            </div>
          </div>

          <div className="res-pill">
            <Layers size={18} className="text-cyan" />
            <div className="res-meta">
              <span className="res-count">
                {institutionsList.reduce((acc, inst) => acc + getActiveAnchorsCount(inst), 0)}
              </span>
              <span className="res-name">עוגנים ויזואליים פעילים</span>
            </div>
          </div>

          <div className="res-pill">
            <Brain size={18} className="text-emerald" />
            <div className="res-meta">
              <span className="res-count">
                {Object.values(cultivationDates).filter(d => d.lastReviewed === todayStr).length} / {institutionsList.length}
              </span>
              <span className="res-name">מרחבים שטופחו היום</span>
            </div>
          </div>
        </div>

        {/* Institutions Memory Palaces Scroll */}
        <div className="institutions-cards-scroll">
          {institutionsList.map((inst) => {
            const placed = placedObjects.find(o => o.type === inst.id);
            const activeAnchors = getActiveAnchorsCount(inst);
            const cultRecord = cultivationDates[inst.id] || {};
            const isReviewedToday = cultRecord.lastReviewed === todayStr;

            return (
              <div key={inst.id} className="inst-card memory-palace-card">
                {/* Card Top Row */}
                <div className="inst-card-top">
                  <div className="inst-title-group">
                    <div className="inst-palace-icon-circle">
                      <Brain size={22} className="text-amber" />
                    </div>
                    <div>
                      <div className="inst-cat-tag">{inst.category}</div>
                      <h3 className="inst-name">{inst.name}</h3>
                    </div>
                  </div>

                  <div className={`memory-cultivation-badge ${isReviewedToday ? 'is-fresh' : 'needs-review'}`}>
                    {isReviewedToday ? (
                      <>
                        <Check size={14} className="text-emerald" />
                        <span>רוענן היום בזיכרון ✨</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw size={14} className="text-amber" />
                        <span>ממתין לחזרה יומית</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Description */}
                <p className="inst-desc">{inst.desc}</p>

                {/* Spatial Loci List */}
                <div className="inst-loci-preview">
                  <span className="loci-label">משבצות עוגן מרחביות בחלל זה ({inst.loci?.length || 0}):</span>
                  <div className="loci-chips-wrap">
                    {(inst.loci || []).map(locus => (
                      <span key={locus.id} className="locus-chip-pill">
                        <span>•</span>
                        <span>{locus.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Anchors Stats Strip */}
                <div className="inst-anchors-stat-box">
                  <span className="anchors-count-label">
                    עוגנים מוגדרים בחלל זה: <strong>{activeAnchors} פעילים</strong>
                  </span>
                  {cultRecord.repetitionStreak > 0 && (
                    <span className="streak-tag">
                      רצף חזרות: {cultRecord.repetitionStreak} ימים 🧠
                    </span>
                  )}
                </div>

                {/* Action Buttons: Enter Interior & Cultivate/Repeat */}
                <div className="inst-card-footer">
                  <div className="memory-palace-actions-row">
                    {onEnterInterior && (
                      <button 
                        className="enter-interior-inst-btn primary-pulse"
                        onClick={() => onEnterInterior(placed || { gx: 0, gy: 0, type: inst.id }, inst)}
                        title="היכנס פנימה אל תוך החלל הוויזואלי לעיגון וצפייה"
                      >
                        <DoorOpen size={16} />
                        <span>היכנס למרחב הזיכרון 🚪</span>
                      </button>
                    )}

                    <button 
                      className={`cultivate-memory-btn ${isReviewedToday ? 'already-done' : ''}`}
                      onClick={() => handleCultivate(inst.id, inst.name)}
                      title="רענן את הזיכרון בחלל זה (חזרתיות יומית)"
                    >
                      <Brain size={15} />
                      <span>{isReviewedToday ? 'רוענן היום ✓' : 'טפח ורענן בזיכרון 🧠'}</span>
                    </button>

                    {placed && onFocusInstitution && (
                      <button 
                        className="locate-btn"
                        onClick={() => onFocusInstitution(placed)}
                        title="הצג מיקום המבנה במפת הכפר"
                      >
                        <MapPin size={15} />
                        <span>אתר בכפר</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
