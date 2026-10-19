import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Compass, 
  Home, 
  Sprout, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

// Character SVG Portrait: Master Eldor (Dignified Memory Architect)
function EldorPortrait({ size = 110 }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', borderRadius: '12px' }}
      aria-label="פורטרט מאסטר אלדור"
    >
      <defs>
        {/* Background gradient */}
        <radialGradient id="bgGlow" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#451a03" />
          <stop offset="60%" stopColor="#1c1917" />
          <stop offset="100%" stopColor="#0c0a09" />
        </radialGradient>
        {/* Coat gradient */}
        <linearGradient id="coatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14532d" />
          <stop offset="50%" stopColor="#0f3d21" />
          <stop offset="100%" stopColor="#052e16" />
        </linearGradient>
        {/* Gold trim */}
        <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        {/* Skin gradient */}
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Frame Background */}
      <rect width="120" height="120" rx="12" fill="url(#bgGlow)" />
      <rect x="2" y="2" width="116" height="116" rx="10" stroke="url(#goldTrim)" strokeWidth="2.5" opacity="0.85" />
      <rect x="5" y="5" width="110" height="110" rx="8" stroke="#78350f" strokeWidth="1" opacity="0.5" />

      {/* Shoulders & Coat */}
      <path 
        d="M20 118 C22 96 36 86 60 86 C84 86 98 96 100 118 Z" 
        fill="url(#coatGrad)" 
      />
      {/* Coat Lapels */}
      <path d="M42 88 L52 118 L60 118 L48 87 Z" fill="#166534" />
      <path d="M78 88 L68 118 L60 118 L72 87 Z" fill="#166534" />
      
      {/* Warm Scarf / High Collar */}
      <path 
        d="M45 74 Q60 84 75 74 L78 88 Q60 94 42 88 Z" 
        fill="#b45309" 
        stroke="#78350f" 
        strokeWidth="1.2" 
      />
      <path d="M52 79 Q60 83 68 79" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" fill="none" />

      {/* Neck */}
      <rect x="53" y="66" width="14" height="14" fill="#f59e0b" rx="2" />

      {/* Head Base */}
      <ellipse cx="60" cy="52" rx="21" ry="24" fill="#fed7aa" />

      {/* Ear Left & Right */}
      <circle cx="39" cy="53" r="5" fill="#fbb073" />
      <circle cx="81" cy="53" r="5" fill="#fbb073" />

      {/* Beard & Jaw */}
      <path 
        d="M43 55 C43 72 52 78 60 78 C68 78 77 72 77 55 C74 62 67 65 60 65 C53 65 46 62 43 55 Z" 
        fill="#e2e8f0" 
      />
      <path d="M52 65 Q60 67 68 65" stroke="#cbd5e1" strokeWidth="1.2" fill="none" />

      {/* Gentle Mouth */}
      <path d="M54 62 Q60 64 66 62" stroke="#9a3412" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Scholar Glasses (Round Gold Frames) */}
      <circle cx="50" cy="49" r="8" stroke="#fbbf24" strokeWidth="1.8" fill="rgba(255,255,255,0.18)" />
      <circle cx="70" cy="49" r="8" stroke="#fbbf24" strokeWidth="1.8" fill="rgba(255,255,255,0.18)" />
      <path d="M58 49 L62 49" stroke="#fbbf24" strokeWidth="1.8" />
      <path d="M42 49 L39 48" stroke="#fbbf24" strokeWidth="1.4" />
      <path d="M78 49 L81 48" stroke="#fbbf24" strokeWidth="1.4" />

      {/* Eyes & Warm Gaze */}
      <circle cx="50" cy="49" r="2.8" fill="#1e293b" />
      <circle cx="70" cy="49" r="2.8" fill="#1e293b" />
      <circle cx="51.2" cy="47.8" r="1" fill="#ffffff" />
      <circle cx="71.2" cy="47.8" r="1" fill="#ffffff" />

      {/* Refined Eyebrows */}
      <path d="M44 40 Q50 38 56 41" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      <path d="M76 40 Q70 38 64 41" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" fill="none" />

      {/* Distinguished Silver Hair */}
      <path 
        d="M38 48 C36 28 48 24 60 24 C72 24 84 28 82 48 C79 32 72 30 60 30 C48 30 41 32 38 48 Z" 
        fill="#f1f5f9" 
      />
      <path d="M44 32 C49 26 56 26 62 26" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M64 27 C70 27 75 30 78 34" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" fill="none" />

      {/* Brass Compass Pin / Emblem on Lapel */}
      <circle cx="34" cy="98" r="4.5" fill="url(#goldTrim)" stroke="#78350f" strokeWidth="1" />
      <path d="M34 95 L35 98 L34 101 L33 98 Z" fill="#78350f" />
    </svg>
  );
}

// 4 Deterministic, practical steps for maximum retention & zero friction
const GUIDE_STEPS = [
  {
    stepNumber: 1,
    badge: 'היכרות עם המרחב',
    title: 'ברוכים הבאים לארמון הזיכרון שלך 🏰',
    icon: Compass,
    iconColor: '#38bdf8',
    summary: 'הכפר הזה הוא לא עוד רשימת טקסט, אלא ארמון זיכרון מרחבי חי המבוסס על שיטת המקומות (Method of Loci).',
    content: (
      <div className="guide-step-body">
        <p>
          המוח האנושי מתקשה לזכור רשימות טקסט ארוכות, אך מצטיין בזכירת <strong>מיקומים מרחביים</strong>.
          ב-Life Quest, כל חלקה, עץ ומבנה בכפר משמשים כעוגן חזותי לקיבוע מטרות וידע בזיכרון לטווח ארוך.
        </p>
        <div className="guide-tip-card">
          <div className="guide-tip-header">
            <Lightbulb size={18} className="text-amber" />
            <strong>איך זה עובד?</strong>
          </div>
          <span>
            במקום לשנן כותרות, אתה "מפקיד" ידע במקומות מוגדרים. כשאתה מטייל בכפר או נכנס למבנים, המוח שלך משחזר את המידע בקלות.
          </span>
        </div>
      </div>
    )
  },
  {
    stepNumber: 2,
    badge: 'כלל זהב קוגניטיבי',
    title: 'קביעות הבית לעומת חופש החווה 🏡🌾',
    icon: Home,
    iconColor: '#f59e0b',
    summary: 'אתה לא מזיז רהיטים בבית שלך כל שני וחמישי! בדיוק כך עובד זיכרון יציב.',
    content: (
      <div className="guide-step-body">
        <p>
          כדי שארמון זיכרון יפעל בעוצמה, המוח זקוק ל<strong>עוגנים פיזיים יציבים</strong>.
        </p>
        <div className="guide-rules-grid">
          <div className="guide-rule-card house-rule">
            <div className="rule-badge">🛋️ בתוך המבנים והבית</div>
            <strong className="rule-title">שמור על עוגנים קבועים</strong>
            <p className="rule-desc">
              הרהיטים (הלוקר, השולחן, האח) צריכים להישאר במקומם הקבוע. אל תמקם שם דברים לא שגרתיים או זמניים – המוח צריך לדעת בדיוק איפה כל פריט נמצא בכל כניסה.
            </p>
          </div>
          <div className="guide-rule-card farm-rule">
            <div className="rule-badge">🌻 בחצר, בגינה ובחווה</div>
            <strong className="rule-title">מרחב דינמי ורעיונות חופשיים</strong>
            <p className="rule-desc">
              זה המקום המושלם לדברים לא שגרתיים, משימות יומיות מתחלפות, אסוציאציות מוזרות ועונתיות שדורשות שינויים וגמישות.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    stepNumber: 3,
    badge: 'כלי שליפה פעילה',
    title: 'איך פועלים רהיטי הזיכרון 🗄️🧠',
    icon: BookOpen,
    iconColor: '#34d399',
    summary: 'בתוך כל מבנה מחכים לך רהיטים דטרמיניסטיים המממשים שיטות זיכרון מדעיות.',
    content: (
      <div className="guide-step-body">
        <p>
          לחיצה על מבנה בכפר תכניס אותך לתוכו. שם תפגוש רהיטים ייעודיים:
        </p>
        <div className="furniture-guide-list">
          <div className="furniture-guide-row">
            <span className="furniture-mini-icon">🗄️</span>
            <div>
              <strong>ארונית / לוקר מעץ (שליפה פעילה):</strong>
              <span> המגירה מתחילה סגורה – קודם מאמצים את המוח להיזכר בעוגן, ורק אז פותחים לבדיקה.</span>
            </div>
          </div>
          <div className="furniture-guide-row">
            <span className="furniture-mini-icon">🧰</span>
            <div>
              <strong>תיבת ראשי תיבות (Acronyms & Chunking):</strong>
              <span> קיבוץ רשימות ארוכות למילה או תבנית קליטה של 3 עד 5 פריטים.</span>
            </div>
          </div>
          <div className="furniture-guide-row">
            <span className="furniture-mini-icon">📻</span>
            <div>
              <strong>רדיו וינטג':</strong>
              <span> זיכרון קולי, שינון שמיעתי והקלטות תזכורת.</span>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    stepNumber: 4,
    badge: 'מוכנים ליציאה לדרך',
    title: 'התמצאות וסיום ההדרכה ✨🚀',
    icon: Sparkles,
    iconColor: '#a855f7',
    summary: 'אתה שולט לחלוטין בקצב שלך. הנה מה שכדאי לעשות ממש עכשיו:',
    content: (
      <div className="guide-step-body">
        <div className="quick-actions-summary">
          <div className="qa-item">
            <span className="qa-num">1</span>
            <div>
              <strong>סייר בכפר:</strong>
              <span> גרור את המסך כדי להזיז את המפה, לחץ על הקרקע כדי שהדמות תלך לשם, והשתמש בגלגלת העכבר לזום.</span>
            </div>
          </div>
          <div className="qa-item">
            <span className="qa-num">2</span>
            <div>
              <strong>היכנס למבנה הראשון:</strong>
              <span> לחץ על המבנה המרכזי כדי להיכנס פנימה ולהכיר את חלל הפנים והלוקרים שלו.</span>
            </div>
          </div>
          <div className="qa-item">
            <span className="qa-num">3</span>
            <div>
              <strong>המנחה תמיד כאן:</strong>
              <span> תוכל לפתוח הדרכה זו וטיפים נוספים בכל רגע דרך כפתור <strong>'מנחה'</strong> בסרגל הצד.</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
];

export function VillageGuideModal({
  isOpen,
  onClose,
  defaultDoNotShowAgain = true
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(defaultDoNotShowAgain);

  if (!isOpen) return null;

  const step = GUIDE_STEPS[currentStepIdx];
  const isFirstStep = currentStepIdx === 0;
  const isLastStep = currentStepIdx === GUIDE_STEPS.length - 1;

  const handleFinishOrSkip = () => {
    try {
      if (dontShowAgain) {
        localStorage.setItem('lifequest_guide_seen_v1', 'true');
      }
    } catch (e) {
      // safe fallback
    }
    onClose();
  };

  const handleNext = () => {
    if (isLastStep) {
      handleFinishOrSkip();
    } else {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  return (
    <div 
      className="journal-backdrop village-guide-backdrop" 
      onClick={handleFinishOrSkip}
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(12, 10, 9, 0.78)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div 
        className="village-guide-card"
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: '#1c1917',
          color: '#f8fafc',
          width: '100%',
          maxWidth: '680px',
          borderRadius: '16px',
          border: '1.5px solid #d97706',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
          fontFamily: 'inherit'
        }}
      >
        {/* Top Header Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            backgroundColor: '#292524',
            borderBottom: '1px solid #44403c'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.25rem' }}>🧙‍♂️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#fef3c7' }}>
                  מאסטר אלדור
                </span>
                <span 
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#78350f',
                    color: '#fde68a',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 600
                  }}
                >
                  ארכיטקט הזיכרון
                </span>
              </div>
            </div>
          </div>

          {/* Quick Skip Button on Top-Left */}
          <button
            type="button"
            onClick={handleFinishOrSkip}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a8a29e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
            title="דלג וסגור הדרכה"
          >
            <span>דלג על ההדרכה</span>
            <X size={16} />
          </button>
        </div>

        {/* Card Main Body */}
        <div style={{ padding: '22px 24px', display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          {/* Character Portrait Column */}
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <EldorPortrait size={112} />
            <div 
              style={{
                marginTop: '8px',
                fontSize: '0.78rem',
                color: '#d6d3d1',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '3px 8px',
                borderRadius: '8px',
                border: '1px solid #44403c'
              }}
            >
              שלב {step.stepNumber} מתוך {GUIDE_STEPS.length}
            </div>
          </div>

          {/* Content Column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Step Badge & Title */}
            <div style={{ marginBottom: '10px' }}>
              <span 
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 'bold',
                  color: step.iconColor,
                  letterSpacing: '0.02em'
                }}
              >
                {step.badge}
              </span>
              <h3 
                style={{
                  margin: '4px 0 8px 0',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#fef3c7',
                  lineHeight: 1.3
                }}
              >
                {step.title}
              </h3>
              <p 
                style={{
                  margin: 0,
                  fontSize: '0.92rem',
                  color: '#e2e8f0',
                  lineHeight: 1.5,
                  fontWeight: 500
                }}
              >
                {step.summary}
              </p>
            </div>

            {/* Custom Content Area */}
            <div style={{ marginTop: '12px' }}>
              {step.content}
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div 
          style={{
            padding: '14px 24px',
            backgroundColor: '#141210',
            borderTop: '1px solid #292524',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          {/* Don't show again toggle */}
          <label 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '0.82rem',
              color: '#a8a29e',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <input 
              type="checkbox"
              checked={dontShowAgain}
              onChange={e => setDontShowAgain(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: '#d97706' }}
            />
            <span>אל תציג שוב בהפעלה הבאה</span>
          </label>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {!isFirstStep && (
              <button
                type="button"
                onClick={handlePrev}
                style={{
                  backgroundColor: '#292524',
                  color: '#e7e5e4',
                  border: '1px solid #44403c',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowRight size={15} />
                <span>הקודם</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              style={{
                backgroundColor: '#d97706',
                color: '#ffffff',
                border: 'none',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.92rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(217, 119, 6, 0.35)'
              }}
            >
              <span>{isLastStep ? 'הבנתי, בוא נתחיל! 🚀' : 'המשך'}</span>
              {!isLastStep && <ArrowLeft size={15} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
