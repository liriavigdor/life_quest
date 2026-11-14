import React, { useState } from 'react';
import { 
  Sparkles, 
  Trophy, 
  Check, 
  Flame, 
  Layers, 
  HelpCircle, 
  Eye, 
  Zap, 
  ThumbsUp, 
  RotateCcw,
  Sliders
} from 'lucide-react';

export const EXPERIMENTS_SUITE = [
  {
    id: 'exp_radar',
    title: '1. מסך מכ"ם / סונאר',
    promptQuestion: 'איזו תמונה משדרת באופן מיידי ובלתי-נשכח את המושג מכ"ם / סריקה?',
    options: [
      {
        id: 'opt_radar_a',
        styleCode: 'A',
        styleTitle: 'גישה א: אנציקלופדיה דוממת',
        subtext: 'מוצג מוזיאוני כבוי וצהוב עם תווית מלאי',
        imgUrl: '/staged_images/experiments/radar_a_encyclopedia.jpg',
        analysis: 'חפץ היסטורי כבוי, נטול אנרגיה, דורש מאמץ קוגניטיבי כדי לזהות.'
      },
      {
        id: 'opt_radar_b',
        styleCode: 'B',
        styleTitle: 'גישה ב: עמדת פיקוד קרבית',
        subtext: 'צילום קונסולה מבצעית באונייה',
        imgUrl: '/staged_images/experiments/radar_b_action.jpg',
        analysis: 'מציאותי ומבצעי, אך עמוס בכפתורים ומסגרות שמסיטים את המבט מהמסך עצמו.'
      },
      {
        id: 'opt_radar_c',
        styleCode: 'C',
        styleTitle: 'גישה ג: אנימציה וגרפיקה נקייה',
        subtext: 'אייקון תלת-ממדי מסוגנן',
        imgUrl: '/staged_images/experiments/radar_c_3d.jpg',
        analysis: 'צללית סמלית ופשוטה, אך לעיתים חסרה את הדרמה של האור בחושך.'
      },
      {
        id: 'opt_radar_d',
        styleCode: 'D',
        styleTitle: 'גישה ד: קרן סריקה זוהרת בחושך',
        subtext: 'ניאון זרחני על שחור עמוק (הבחירה שלך)',
        imgUrl: '/staged_images/experiments/radar_d_glowing.jpg',
        analysis: 'ניגודיות שיא (Glow on Dark), תנועה קוגניטיבית ברורה (Sweep), אפס רעש רקע.'
      }
    ]
  },
  {
    id: 'exp_toaster',
    title: '2. טוסטר לחיצה / קופץ',
    promptQuestion: 'איזו תמונה מפעילה מיידית את האסוציאציה של חום, פריכות וארוחת בוקר?',
    options: [
      {
        id: 'opt_toaster_a',
        styleCode: 'A',
        styleTitle: 'גישה א: אנציקלופדיה דוממת',
        subtext: 'צילום מוצר קטלוגי של טוסטר כבוי',
        imgUrl: '/staged_images/experiments/toaster_a_encyclopedia.jpg',
        analysis: 'חפץ דומם וכסוף, הלחם יושב בפנים ללא תנועה או חום.'
      },
      {
        id: 'opt_toaster_b',
        styleCode: 'B',
        styleTitle: 'גישה ב: שיא הפעולה',
        subtext: 'טוסטר בפעולה מלאה עם פרוסות לחם',
        imgUrl: '/staged_images/experiments/toaster_b_action.jpg',
        analysis: 'ממחיש את השימוש בפועל, אך עדיין בצבעים יומיומיים סטנדרטיים.'
      },
      {
        id: 'opt_toaster_c',
        styleCode: 'C',
        styleTitle: 'גישה ג: אנימציה וסגנון 3D',
        subtext: 'רנדר תלת-ממד צבעוני ונקי',
        imgUrl: '/staged_images/experiments/toaster_c_3d.jpg',
        analysis: 'צורניות מוגזמת ואיקונית (פיקסאר-סטייל), מושכת את העין מיידית.'
      },
      {
        id: 'opt_toaster_d',
        styleCode: 'D',
        styleTitle: 'גישה ד: גופי חימום לוהטים',
        subtext: 'תקריב דרמטי של חוטים זוהרים באדום-אש',
        imgUrl: '/staged_images/experiments/toaster_d_glowing.jpg',
        analysis: 'עוצמה חושית גבוהה (חום לוהט וזוהר), משדרת חום ואנרגיה מיידית.'
      }
    ]
  },
  {
    id: 'exp_kettle',
    title: '3. קומקום שורק',
    promptQuestion: 'איזו תמונה מייצגת את האבטיפוס של קומקום מים רותחים?',
    options: [
      {
        id: 'opt_kettle_a',
        styleCode: 'A',
        styleTitle: 'גישה א: אנציקלופדיה דוממת',
        subtext: 'קומקום נירוסטה סטנדרטי כבוי',
        imgUrl: '/staged_images/experiments/kettle_a_encyclopedia.jpg',
        analysis: 'כלי קר, שום תחושת חום, שריקה או קיטור.'
      },
      {
        id: 'opt_kettle_b',
        styleCode: 'B',
        styleTitle: 'גישה ב: סילון קיטור רותח',
        subtext: 'קומקום על כיריים עם ענני קיטור עזים',
        imgUrl: '/staged_images/experiments/kettle_b_action.jpg',
        analysis: 'פעולה חיה (Active State) – סילון אדים ברור שמפעיל את הקול והתחושה במוח.'
      }
    ]
  },
  {
    id: 'exp_scanner',
    title: '4. סורק מסמכים / דיגיטציה',
    promptQuestion: 'איזו תמונה מבטאת בצורה הברורה ביותר סריקה דיגיטלית ואיתור מידע?',
    options: [
      {
        id: 'opt_scanner_a',
        styleCode: 'A',
        styleTitle: 'גישה א: אנציקלופדיה דוממת',
        subtext: 'קופסת פלסטיק משרדית סגורה',
        imgUrl: '/staged_images/experiments/scanner_a_encyclopedia.jpg',
        analysis: 'נראה כמו מדפסת/מכשיר פלסטיק ישן, שום רמז לפעולת הסריקה.'
      },
      {
        id: 'opt_scanner_b',
        styleCode: 'B',
        styleTitle: 'גישה ב: צילום פס אור נע',
        subtext: 'סורק פתוח עם פס אור כחול תחת מסמך',
        imgUrl: '/staged_images/experiments/scanner_b_action.jpg',
        analysis: 'ממחיש את המנגנון האופטי הממשי של סורק בפעולה.'
      },
      {
        id: 'opt_scanner_d',
        styleCode: 'D',
        styleTitle: 'גישה ד: סריקת לייזר הייטק',
        subtext: 'קרן לייזר כחולה-ציאן זוהרת על גריד מידע',
        imgUrl: '/staged_images/experiments/scanner_d_glowing.jpg',
        analysis: 'הפשטה קולנועית (Cyber/Glow) – משדרת "סריקה", "טכנולוגיה" ו"דיגיטציה" ב-0.1 שניות.'
      }
    ]
  }
];

export function VisualSearchExperimentDesk() {
  const [votes, setVotes] = useState(() => {
    try {
      const saved = localStorage.getItem('lifequest_experiment_votes_v1');
      return saved ? JSON.parse(saved) : { exp_radar: 'opt_radar_d' };
    } catch (_) {
      return { exp_radar: 'opt_radar_d' };
    }
  });

  const [notes, setNotes] = useState(() => {
    return localStorage.getItem('lifequest_experiment_user_notes') || '';
  });

  const handleVote = (expId, optId) => {
    setVotes(prev => {
      const next = { ...prev, [expId]: optId };
      try {
        localStorage.setItem('lifequest_experiment_votes_v1', JSON.stringify(next));
      } catch (_) {}
      return next;
    });
  };

  const handleSaveNotes = (val) => {
    setNotes(val);
    try {
      localStorage.setItem('lifequest_experiment_user_notes', val);
    } catch (_) {}
  };

  // Compute style breakdown
  const styleScores = {
    'גישה א (דומם/מוזיאוני)': 0,
    'גישה ב (שיא הפעולה / Active)': 0,
    'גישה ג (אנימציה / 3D)': 0,
    'גישה ד (זוהר דרמטי / Glow)': 0
  };

  Object.values(votes).forEach(optId => {
    if (optId.includes('_a')) styleScores['גישה א (דומם/מוזיאוני)']++;
    if (optId.includes('_b')) styleScores['גישה ב (שיא הפעולה / Active)']++;
    if (optId.includes('_c')) styleScores['גישה ג (אנימציה / 3D)']++;
    if (optId.includes('_d')) styleScores['גישה ד (זוהר דרמטי / Glow)']++;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', gap: '28px', backgroundColor: '#090d16' }}>
      
      {/* Top Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)',
          border: '1px solid #3730a3',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>🧪</span>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#a5b4fc' }}>
              מעבדת ניסויי חיפוש – כיול "עין הרוח"
            </h2>
          </div>
          <p style={{ margin: '6px 0 0', color: '#cbd5e1', fontSize: '0.88rem', maxWidth: '720px' }}>
            בחינה השוואתית ראש-בראש בין 4 גישות שונות לאותו השורש: חפץ דומם/מוזיאוני, צילום בשיא הפעולה, רנדר תלת-ממד אנימטיבי, ותאורת ניאון זוהרת.
            בחר את התמונה המנצחת בכל שורה כדי שננעל את הנוסחה המדויקת!
          </p>
        </div>

        {/* Live Score Breakdown */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {Object.entries(styleScores).map(([label, count]) => (
            <div 
              key={label}
              style={{
                backgroundColor: count > 0 ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.6)',
                border: count > 0 ? '1px solid #6366f1' : '1px solid #334155',
                borderRadius: '10px',
                padding: '6px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{label}</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color: count > 0 ? '#818cf8' : '#64748b' }}>
                {count} {count === 1 ? 'קול' : 'קולות'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Experiments Rows */}
      {EXPERIMENTS_SUITE.map((exp) => {
        const currentVote = votes[exp.id];

        return (
          <div 
            key={exp.id}
            style={{
              backgroundColor: '#111827',
              border: '1px solid #1f2937',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                  {exp.title}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  {exp.promptQuestion}
                </p>
              </div>

              {currentVote && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.82rem', fontWeight: 700 }}>
                  <Trophy size={15} />
                  <span>נבחרה: {exp.options.find(o => o.id === currentVote)?.styleTitle}</span>
                </div>
              )}
            </div>

            {/* Options Grid */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${exp.options.length}, minmax(0, 1fr))`,
                gap: '16px'
              }}
            >
              {exp.options.map((opt) => {
                const isSelected = currentVote === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleVote(exp.id, opt.id)}
                    style={{
                      backgroundColor: isSelected ? '#1e1b4b' : '#0f172a',
                      border: isSelected ? '2px solid #6366f1' : '1px solid #334155',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 0 20px rgba(99, 102, 241, 0.4)' : 'none',
                      transform: isSelected ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    {/* Image Area */}
                    <div style={{ height: '170px', width: '100%', backgroundColor: '#000', position: 'relative', overflow: 'hidden' }}>
                      <img 
                        src={opt.imgUrl} 
                        alt={opt.styleTitle}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          backgroundColor: '#0a0f1d'
                        }}
                      />
                      <span 
                        style={{
                          position: 'absolute',
                          top: '8px',
                          right: '8px',
                          backgroundColor: 'rgba(0,0,0,0.8)',
                          color: '#e2e8f0',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.70rem',
                          fontWeight: 800,
                          backdropFilter: 'blur(4px)'
                        }}
                      >
                        {opt.styleCode}
                      </span>

                      {isSelected && (
                        <div 
                          style={{
                            position: 'absolute',
                            bottom: '8px',
                            right: '8px',
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.70rem',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                          }}
                        >
                          <Check size={12} />
                          <span>המנצחת שלך!</span>
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? '#a5b4fc' : '#f8fafc' }}>
                        {opt.styleTitle}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 600 }}>
                        🏷️ {opt.subtext}
                      </div>
                      <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                        {opt.description}
                      </p>
                      
                      <div 
                        style={{ 
                          marginTop: 'auto', 
                          paddingTop: '8px', 
                          borderTop: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '0.68rem',
                          color: '#64748b'
                        }}
                      >
                        💡 {opt.analysis}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* User Observations & Conclusion Box */}
      <div 
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid #475569',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>📝</span>
          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
            הערות ותובנות שלך מההשוואה:
          </h4>
        </div>
        <textarea
          value={notes}
          onChange={(e) => handleSaveNotes(e.target.value)}
          placeholder="למשל: סגנון הניאון והאור הדרמטי עובד הכי טוב באלקטרוניקה, ואילו בכלי מטבח סילון הקיטור/הקפיצה החיה עדיפים..."
          rows={3}
          style={{
            width: '100%',
            backgroundColor: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '10px',
            color: '#ffffff',
            padding: '10px 14px',
            fontSize: '0.88rem',
            fontFamily: 'Rubik, sans-serif',
            outline: 'none',
            resize: 'vertical',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
            ההצבעות וההערות נשמרות אוטומטית בדפדפן.
          </span>
        </div>
      </div>

    </div>
  );
}

