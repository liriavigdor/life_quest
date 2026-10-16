import React, { useState } from 'react';
import { Sparkles, X, Check, AlertTriangle, Layers, Compass, BookOpen, RefreshCw, Undo2 } from 'lucide-react';
import { VILLAGE_TEMPLATES } from '../data/villageTemplates';
import { sounds } from '../utils/sound';

export function VillageTemplatesModal({
  isOpen,
  onClose,
  currentPlacedObjects = [],
  onApplyTemplate
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState(VILLAGE_TEMPLATES[0].id);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(null);

  if (!isOpen) return null;

  const selectedTemplate = VILLAGE_TEMPLATES.find(t => t.id === selectedTemplateId) || VILLAGE_TEMPLATES[0];

  // Count existing custom memories to warn if anything will be replaced
  const existingMemoriesCount = currentPlacedObjects.filter(
    o => (o.memory && o.memory.trim().length > 0) || (o.dedicatedTo && o.dedicatedTo.trim().length > 0)
  ).length;

  const handleApplyClick = () => {
    sounds.playTap();
    // If the village already has custom memories and the template isn't identical, ask for confirmation
    if (existingMemoriesCount > 2) {
      setShowConfirmModal(true);
    } else {
      executeApply(selectedTemplate);
    }
  };

  const executeApply = (template) => {
    sounds.playChime();
    onApplyTemplate(template);
    setShowConfirmModal(false);
    setAppliedNotice(`תבנית "${template.name}" הוחלה בהצלחה! ✨`);
    setTimeout(() => {
      setAppliedNotice(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="journal-backdrop village-templates-backdrop" onClick={onClose}>
      <div className="village-templates-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="templates-modal-header">
          <div className="templates-title-wrap">
            <div className="templates-icon-badge">
              <Layers size={26} className="text-amber" />
            </div>
            <div>
              <div className="templates-title-badge-row">
                <h2>תבניות כפר ומסגרות לוגיות</h2>
                <span className="templates-count-tag">התחלה קלה ללא חיכוך 🏛️</span>
              </div>
              <span className="templates-subtitle">
                בחר מסגרת מאורגנת להתחלת הכפר והטמע בתוכה את הזיכרונות שלך, או בחר להתחיל מלוח חלק לחלוטין
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור תבניות">
            <X size={20} />
          </button>
        </div>

        {/* Cognitive Psychology Insight Callout */}
        <div className="templates-psychology-callout">
          <div className="callout-icon-col">
            <span style={{ fontSize: '24px' }}>🧠💡</span>
          </div>
          <div className="callout-text-col">
            <strong>למה מסגרת מובנית מונעת חיכוך ומשפרת את הטמעת הזיכרונות?</strong>
            <p>
              תסמונת "הדף החלק" (Blank Canvas Syndrome) מציפה את המוח בהחלטות ארכיטקטוניות ומעכבת את הפעולה החשובה באמת:
              עיבוד והטמעת משמעות אישית. תבנית לוגית מעניקה שלד מוכן של צירים, שבילים ואזורים פונקציונליים –
              כך שכל מה שנותר לך הוא לחבר לכל פריט זיכרון, כוונה או רגע משמעותי.
            </p>
          </div>
        </div>

        {/* Success feedback toast */}
        {appliedNotice && (
          <div className="templates-toast-notice">
            <Sparkles size={18} />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* Main Content Area: Left Grid of Templates & Right Detailed Inspector */}
        <div className="templates-modal-body">
          {/* Templates Cards Grid */}
          <div className="templates-cards-grid">
            {VILLAGE_TEMPLATES.map(tmpl => {
              const isSelected = tmpl.id === selectedTemplateId;
              const isBlank = tmpl.id === 'blank';

              return (
                <div
                  key={tmpl.id}
                  className={`template-card ${isSelected ? 'is-selected' : ''} ${isBlank ? 'is-blank-slate' : ''}`}
                  onClick={() => {
                    sounds.playTap();
                    setSelectedTemplateId(tmpl.id);
                  }}
                >
                  <div className="template-card-top">
                    <span className="template-card-icon">{tmpl.icon}</span>
                    <div className="template-card-title-group">
                      <strong className="template-name">{tmpl.name}</strong>
                      <span className="template-badge">{tmpl.badge}</span>
                    </div>
                  </div>

                  <p className="template-card-tagline">{tmpl.tagline}</p>

                  <div className="template-card-footer">
                    <span className="template-items-count">
                      {isBlank ? '🌱 משטח פתוח ונקי' : `✨ ${tmpl.items.length} פריטים מעוגנים`}
                    </span>
                    {isSelected && (
                      <span className="template-selected-chip">
                        <Check size={14} /> נבחר
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Template Preview & Deep Details */}
          <div className="template-detail-inspector glass-card">
            <div className="inspector-top-banner">
              <span className="inspector-icon">{selectedTemplate.icon}</span>
              <div>
                <h3 className="inspector-title">{selectedTemplate.name}</h3>
                <span className="inspector-eng-name">{selectedTemplate.englishName}</span>
              </div>
            </div>

            <div className="inspector-badge-row">
              <span className="inspector-badge">{selectedTemplate.badge}</span>
              <span className="inspector-item-count">
                {selectedTemplate.items.length === 0 ? 'ללא פריטים (לוח חלק)' : `${selectedTemplate.items.length} מבנים ושבילים מתוכננים`}
              </span>
            </div>

            <div className="inspector-section">
              <h4 className="section-title">תיאור המסגרת:</h4>
              <p className="inspector-desc">{selectedTemplate.description}</p>
            </div>

            <div className="inspector-section">
              <h4 className="section-title">היגיון קוגניטיבי (מיקוד תודעתי):</h4>
              <div className="cognitive-box">
                <p>{selectedTemplate.cognitiveFocus}</p>
              </div>
            </div>

            <div className="inspector-section">
              <h4 className="section-title">חלוקה לאזורים לוגיים:</h4>
              <ul className="template-zones-list">
                {selectedTemplate.zones.map((zone, idx) => (
                  <li key={idx} className="zone-item-bullet">
                    <span>{zone}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="inspector-action-bar">
              <button
                className={`apply-template-btn ${selectedTemplate.id === 'blank' ? 'blank-btn' : ''}`}
                onClick={handleApplyClick}
              >
                {selectedTemplate.id === 'blank' ? (
                  <>
                    <RefreshCw size={18} />
                    <span>אפס כפר והתחל מלוח חלק 🍃</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>החל תבנית זו על הכפר ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Confirmation Modal (To avoid accidental override of memories) */}
        {showConfirmModal && (
          <div className="template-confirm-overlay" onClick={() => setShowConfirmModal(false)}>
            <div className="template-confirm-dialog glass-card" onClick={e => e.stopPropagation()}>
              <div className="confirm-icon-wrap">
                <AlertTriangle size={34} className="text-amber" />
              </div>
              <h3>החלת תבנית חדשה על הכפר</h3>
              <p>
                בכפר הנוכחי שלך קיימים <strong>{existingMemoriesCount} פריטים עם זיכרונות וכוונות אישיות</strong>.
                החלת התבנית "{selectedTemplate.name}" תחליף את סידור הפריטים הקיים במבנה החדש.
              </p>
              <div className="confirm-dialog-actions">
                <button
                  className="confirm-cancel-btn"
                  onClick={() => setShowConfirmModal(false)}
                >
                  <Undo2 size={16} />
                  <span>ביטול (השאר את הכפר הנוכחי)</span>
                </button>
                <button
                  className="confirm-execute-btn"
                  onClick={() => executeApply(selectedTemplate)}
                >
                  <Check size={16} />
                  <span>החל תבנית בכל זאת</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
