import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  RotateCcw, 
  Dices, 
  Check, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Trophy, 
  Zap, 
  Flame, 
  ShieldAlert,
  ArrowUpDown,
  Bug,
  Ghost,
  Rocket,
  Crown,
  Compass,
  Wand2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { MNEMONIC_CATALOG } from '../data/massiveMnemonicCatalog';

// Bank of hilarious and surprising memory scenarios
export const BIZARRE_SCENARIOS = [
  {
    id: 'roach_attack',
    title: 'מתקפת ג\'וק מעופף!',
    icon: '🪳',
    themeColor: '#ef4444',
    bgGradient: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.1))',
    subtitle: 'פאניקה בחדר! ג\'וק ענקי ומעופף נחת במרכז השטיח!',
    question: 'במה היית משתמש כדי להרוג ג\'וק?',
    task: 'מיין את הפריטים שלך: מהכי יעיל לחיסול מיידי ועד לחסר תועלת לחלוטין!',
    topBadge: '🔨 נשק יום הדין נגד הג\'וק',
    bottomBadge: '🪰 הג\'וק נקרע עליך מצחוק',
    debrief: (items) => `הדמות שלך הרימה את "${items[0]?.name || 'הפריט הראשון'}" בתנופה אדירה וריסקה את הג'וק במכה אחת! חדר השינה ניצל! לעומת זאת, "${items[items.length - 1]?.name || 'הפריט האחרון'}" רק גרם לג'וק לחייך בביטחון עצמי...`
  },
  {
    id: 'zombie_apocalypse',
    title: 'אפוקליפסת זומבים בכפר!',
    icon: '🧟',
    themeColor: '#10b981',
    bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(4, 120, 87, 0.1))',
    subtitle: 'אזעקה בכפר! עדר זומבים איטיים אך רעבים צועד לעבר השער!',
    question: 'מה מציל אותך מהזומבים?',
    task: 'מיין: מהפריט שהכי יציל את חייך ועד לפריט שיגרום לך להפוך לנשנוש ראשון!',
    topBadge: '🛡️ נשק הישרדות ראשי',
    bottomBadge: '🧠 מנת פתיחה לזומבים',
    debrief: (items) => `השתמשת ב-"${items[0]?.name || 'הפריט הראשון'}" בתושייה הירואית ופילסת לעצמך דרך מילוט מרהיבה אל מעבר לנהר! מזל שלא ניסית להתגונן עם "${items[items.length - 1]?.name || 'הפריט האחרון'}", אחרת היית הופך למרק זומבים!`
  },
  {
    id: 'mars_emergency',
    title: 'משימת חירום למאדים!',
    icon: '🚀',
    themeColor: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(180, 83, 9, 0.1))',
    subtitle: 'משקל יתר בתא החללית! החללית רועדת ומאבדת גובה!',
    question: 'מה אסור לזרוק לחלל?',
    task: 'מיין: מהפריט הכי קריטי שאסור לזרוק ועד לפריט שייזרק מיידית לחלל הפתוח!',
    topBadge: '🛸 נשמר בכספת החללית',
    bottomBadge: '🌌 מושלך דרך מנעול האוויר',
    debrief: (items) => `נעלת את "${items[0]?.name || 'הפריט הראשון'}" בחיבוק דוב והעפת את "${items[items.length - 1]?.name || 'הפריט האחרון'}" לתוך השביט הקרוב. החללית התייצבה, ואתם בדרך למאדים!`
  },
  {
    id: 'mad_king',
    title: 'המשפט בפני המלך המשוגע!',
    icon: '👑',
    themeColor: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(109, 40, 217, 0.1))',
    subtitle: 'הובלת אל כס המלכות. המלך הזועם דורש שתשעשע אותו עם הרשימה שלך!',
    question: 'מה ירשים את המלך המשוגע?',
    task: 'מיין: מהפריט שיעשה עליו רושם אדיר ועד לפריט שישלח אותך ישירות לצינוק!',
    topBadge: '👑 תואר אבירות ומדליית זהב',
    bottomBadge: '🏰 כרטיס בכיוון אחד לצינוק',
    debrief: (items) => `המלך קפץ מכסאו בהתלהבות מטורפת לנוכח "${items[0]?.name || 'הפריט הראשון'}" והכריז על חג לאומי! מזל גדול שהסתרת היטב את "${items[items.length - 1]?.name || 'הפריט האחרון'}" בכיס...`
  },
  {
    id: 'desert_island',
    title: 'אי בודד וקוקוס מסתורי!',
    icon: '🏝️',
    themeColor: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(14, 116, 144, 0.1))',
    subtitle: 'נסחפת על גבי קרש אל חוף טרופי נטוש ללא קליטה סלולרית!',
    question: 'מה הכי יעזור לך לשרוד על האי?',
    task: 'מיין: מהפריט שהכי יאפשר לך לשרוד ולבנות מחנה ועד לפריט הכי מיותר ומגוחך על האי!',
    topBadge: '🥥 אולר ההישרדות של האי',
    bottomBadge: '🦀 בדיחה לסרטנים על החוף',
    debrief: (items) => `בנית מחנה מפואר, הדלקת מדורה וסימנת ספינות בעזרת "${items[0]?.name || 'הפריט הראשון'}"! הסרטנים על החוף עדיין תוהים מה ניסית לעשות עם "${items[items.length - 1]?.name || 'הפריט האחרון'}"...`
  },
  {
    id: 'potion_lab',
    title: 'סדנת השיקויים של האלכימאי!',
    icon: '🧙‍♂️',
    themeColor: '#ec4899',
    bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(190, 24, 93, 0.1))',
    subtitle: 'הקדרה מבעבעת בעשן סגול! חסרים מרכיבים לשיקוי עוצמתי סודי!',
    question: 'איזה פריט היית זורק ראשון לקדרה?',
    task: 'מיין: מהפריט שהכי מתאים כמרכיב קסם ועד לפריט שיפוצץ את המעבדה!',
    topBadge: '✨ מרכיב קסם אגדי',
    bottomBadge: '💥 פיצוץ בלתי הפיך',
    debrief: (items) => `ברגע שזרקת את "${items[0]?.name || 'הפריט הראשון'}" לקדרה, פרץ אור זהוב והשיקוי המושלם הוכן! המכשף הודה לך אישית שהרחקת את "${items[items.length - 1]?.name || 'הפריט האחרון'}" מהאש!`
  }
];

// Helper to find or generate a visual mnemonic anchor for any text
export function getVisualAnchorForItem(name) {
  if (!name) return { emoji: '📦', color: '#f59e0b', darkColor: '#78350f' };
  const clean = name.trim().toLowerCase();
  const match = MNEMONIC_CATALOG.find(entry => 
    entry.names.some(n => clean.includes(n.toLowerCase()) || n.toLowerCase().includes(clean))
  );
  if (match) {
    return { emoji: match.emoji, color: match.color, darkColor: match.darkColor };
  }

  // Common quick keywords heuristics
  if (clean.includes('ספר') || clean.includes('מחברת')) return { emoji: '📖', color: '#38bdf8', darkColor: '#0369a1' };
  if (clean.includes('טלפון') || clean.includes('נייד')) return { emoji: '📱', color: '#818cf8', darkColor: '#3730a3' };
  if (clean.includes('מפתח') || clean.includes('מנעול')) return { emoji: '🗝️', color: '#fbbf24', darkColor: '#b45309' };
  if (clean.includes('בקבוק') || clean.includes('מים')) return { emoji: '🍶', color: '#06b6d4', darkColor: '#0e7490' };
  if (clean.includes('שעון')) return { emoji: '⏰', color: '#ec4899', darkColor: '#9d174d' };
  if (clean.includes('נעל') || clean.includes('בגד')) return { emoji: '👞', color: '#a8a29e', darkColor: '#44403c' };
  if (clean.includes('כסף') || clean.includes('מטבע')) return { emoji: '🪙', color: '#eab308', darkColor: '#854d0e' };
  
  return { emoji: '✨', color: '#a855f7', darkColor: '#581c87' };
}

export function BizarreSortChallengeModal({
  isOpen,
  onClose,
  items = [],
  depositTitle = 'רשימת זיכרון',
  onSaveNewOrder = null
}) {
  // Normalize items to standard structure
  const initialItems = (items && items.length > 0)
    ? items.map((it, idx) => ({
        id: it.id || `item_${idx}`,
        name: typeof it === 'string' ? it : (it.name || it.text || `פריט ${idx + 1}`),
        originalRank: idx + 1
      }))
    : [
        { id: '1', name: 'מטען לטלפון', originalRank: 1 },
        { id: '2', name: 'נעלי בית צמריריות', originalRank: 2 },
        { id: '3', name: 'מחבת ברזל כבדה', originalRank: 3 },
        { id: '4', name: 'בקבוק מים מינרליים', originalRank: 4 },
        { id: '5', name: 'ספר היסטוריה עבה', originalRank: 5 }
      ];

  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [sortedItems, setSortedItems] = useState(initialItems);
  const [blindRecallMode, setBlindRecallMode] = useState(false);
  const [revealedItems, setRevealedItems] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Sync when items change or modal opens
  useEffect(() => {
    if (isOpen) {
      setSortedItems(initialItems);
      setRevealedItems({});
      setIsCompleted(false);
    }
  }, [isOpen, items]);

  if (!isOpen) return null;

  const scenario = BIZARRE_SCENARIOS[currentScenarioIdx];

  // Randomize a new surprise scenario
  const handleRandomizeScenario = () => {
    sounds.playTap?.();
    let nextIdx = Math.floor(Math.random() * BIZARRE_SCENARIOS.length);
    if (nextIdx === currentScenarioIdx) {
      nextIdx = (nextIdx + 1) % BIZARRE_SCENARIOS.length;
    }
    setCurrentScenarioIdx(nextIdx);
    setIsCompleted(false);
  };

  // Reorder items up/down
  const handleMove = (index, direction) => {
    sounds.playTap?.();
    const target = index + direction;
    if (target < 0 || target >= sortedItems.length) return;

    const copy = [...sortedItems];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSortedItems(copy);
  };

  // Reveal a single item in blind recall mode
  const handleToggleReveal = (itemId) => {
    sounds.playTap?.();
    setRevealedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  // Submit and celebrate completion
  const handleCompleteChallenge = () => {
    sounds.playFanfare?.();
    setIsCompleted(true);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch {}

    if (onSaveNewOrder) {
      onSaveNewOrder(sortedItems);
    }
  };

  return (
    <div 
      className="journal-backdrop physical-locker-backdrop animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 1200 }}
    >
      <div 
        className="bizarre-sort-modal glass-card"
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '680px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(165deg, #1e1b2e 0%, #110e1c 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.35)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(245, 158, 11, 0.15)',
          color: '#f8fafc',
          direction: 'rtl'
        }}
      >
        {/* Modal Top Header */}
        <div 
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>{scenario.icon}</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#fef08a' }}>
                  {scenario.title}
                </h3>
                <span 
                  style={{
                    fontSize: '0.72rem',
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#fde047',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245, 158, 11, 0.4)'
                  }}
                >
                  Active Recall 🧠
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                {depositTitle} • תרגול שליפה באמצעות מיון מעמיק
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={handleRandomizeScenario}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#e2e8f0',
                padding: '6px 12px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              title="הגרל שאלה ותרחיש מצחיק אחר"
            >
              <Dices size={15} color="#f59e0b" />
              <span>הגרל שאלה 🎲</span>
            </button>
            
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#94a3b8',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="סגור חלון"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          
          {/* Big Scenario Banner */}
          <div 
            style={{
              background: scenario.bgGradient,
              border: `1.5px solid ${scenario.themeColor}`,
              borderRadius: '18px',
              padding: '16px 20px',
              marginBottom: '20px',
              position: 'relative'
            }}
          >
            <div style={{ fontSize: '0.9rem', color: '#fef08a', marginBottom: '6px', fontWeight: 600 }}>
              {scenario.subtitle}
            </div>
            <div style={{ fontSize: '1.18rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
              ❓ "{scenario.question}"
            </div>
            <div style={{ fontSize: '0.84rem', color: '#cbd5e1' }}>
              🎯 <strong>המשימה שלך:</strong> {scenario.task}
            </div>
          </div>

          {/* Controls Bar: Blind Recall Mode Toggle */}
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              marginBottom: '14px',
              padding: '0 4px'
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              סדר הפריטים הנוכחי ({sortedItems.length} פריטים ברשימה):
            </div>
            
            <button
              type="button"
              onClick={() => {
                sounds.playTap?.();
                setBlindRecallMode(prev => !prev);
              }}
              style={{
                background: blindRecallMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${blindRecallMode ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
                color: blindRecallMode ? '#fca5a5' : '#cbd5e1',
                padding: '4px 12px',
                borderRadius: '14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="הסתרת שמות הפריטים לצורך שליפה עיוורת מאתגרת מהזיכרון"
            >
              {blindRecallMode ? <EyeOff size={14} /> : <Eye size={14} />}
              <span>{blindRecallMode ? 'מצב עיוור פעיל 🙈' : 'אתגר זיכרון עיוור 👁️'}</span>
            </button>
          </div>

          {/* Reorderable Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {sortedItems.map((item, index) => {
              const anchor = getVisualAnchorForItem(item.name);
              const isFirst = index === 0;
              const isLast = index === sortedItems.length - 1;
              const isRevealed = revealedItems[item.id];

              // Mask item name if blind recall mode is active and item not manually revealed
              const displayName = (blindRecallMode && !isRevealed)
                ? `${item.name.charAt(0)}••• (לחץ להצצה)`
                : item.name;

              return (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isFirst 
                      ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.22) 0%, rgba(30, 27, 46, 0.8) 100%)' 
                      : (isLast 
                          ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.18) 0%, rgba(30, 27, 46, 0.8) 100%)' 
                          : 'rgba(30, 41, 59, 0.45)'),
                    border: isFirst 
                      ? '1.5px solid #f59e0b' 
                      : (isLast ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)'),
                    borderRadius: '16px',
                    padding: '10px 14px',
                    transition: 'all 0.2s ease',
                    boxShadow: isFirst ? '0 4px 15px rgba(245, 158, 11, 0.25)' : 'none'
                  }}
                >
                  {/* Left: Rank & Item Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <div 
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: isFirst ? '#f59e0b' : (isLast ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'),
                        color: isFirst || isLast ? '#000000' : '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Visual Mnemonic Anchor Badge */}
                    <div 
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: anchor.darkColor || '#312e81',
                        border: `1.5px solid ${anchor.color || '#818cf8'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        boxShadow: `0 2px 8px ${anchor.color}33`
                      }}
                    >
                      {anchor.emoji}
                    </div>

                    {/* Text Title & Criteria Tag */}
                    <div style={{ flex: 1 }}>
                      <div 
                        onClick={() => blindRecallMode && handleToggleReveal(item.id)}
                        style={{
                          fontSize: '1rem',
                          fontWeight: 700,
                          color: (blindRecallMode && !isRevealed) ? '#94a3b8' : '#ffffff',
                          cursor: blindRecallMode ? 'pointer' : 'default',
                          userSelect: 'none'
                        }}
                      >
                        {displayName}
                      </div>

                      {/* Scenario role tag for #1 and Last */}
                      {isFirst && (
                        <span style={{ fontSize: '0.74rem', color: '#fef08a', fontWeight: 600 }}>
                          {scenario.topBadge}
                        </span>
                      )}
                      {isLast && (
                        <span style={{ fontSize: '0.74rem', color: '#fca5a5', fontWeight: 600 }}>
                          {scenario.bottomBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Reorder Up / Down Arrows */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, -1)}
                      style={{
                        background: index === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: index === 0 ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: index === 0 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      title="העלה פריט שלב אחד למעלה"
                    >
                      <ChevronUp size={20} />
                    </button>

                    <button
                      type="button"
                      disabled={index === sortedItems.length - 1}
                      onClick={() => handleMove(index, 1)}
                      style={{
                        background: index === sortedItems.length - 1 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                        border: 'none',
                        color: index === sortedItems.length - 1 ? 'rgba(255, 255, 255, 0.2)' : '#cbd5e1',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        cursor: index === sortedItems.length - 1 ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease'
                      }}
                      title="הורד פריט שלב אחד למטה"
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Victory / Debrief Box upon completion */}
          {isCompleted && (
            <div 
              className="animate-slide-down"
              style={{
                marginTop: '20px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(16, 185, 129, 0.15))',
                border: '1.5px solid #f59e0b',
                borderRadius: '18px',
                padding: '16px 20px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Trophy size={22} color="#f59e0b" />
                <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fef08a' }}>
                  מיון מושלם! עוגן הזיכרון הוטמע בהצלחה 🧠✨
                </h4>
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                {scenario.debrief(sortedItems)}
              </p>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div 
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(0, 0, 0, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
            💡 <strong>עצת המומחה:</strong> פעולת הדירוג וההשוואה יוצרת קשרים עצביים שמקבעים את הפריטים בזיכרון.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCompleteChallenge}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                border: 'none',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
              }}
            >
              <Check size={18} />
              <span>{isCompleted ? 'מיין שוב / אשר תוצאה ✓' : 'סיימתי למיין! 🎯'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
