import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Copy, 
  ArrowRight,
  Palette,
  Home,
  Lightbulb
} from 'lucide-react';
import { 
  BizarreStackingEngine, 
  judgeUltimateChimera,
  generatePegKeyword,
  generateAbsurdStory,
  generateSurrealArtPrompt,
  SURREAL_ART_STYLES,
  DEFAULT_PRESET_LISTS
} from './BizarreStackingEngine';
import { lookupMnemonicItem } from '../../data/massiveMnemonicCatalog';
import { sounds } from '../../utils/sound';

export function BizarreStackingModal({
  isOpen,
  onClose,
  stackConfig = {},
  onUpdateStackConfig,
  isGym = false
}) {
  if (!isOpen) return null;

  const initialItems = stackConfig.items || [];
  const hasExistingStatue = initialItems.length > 0;

  // View state: 'view' if a statue already exists in the house, otherwise 'input'
  const [mode, setMode] = useState(hasExistingStatue ? 'view' : 'input');

  // Input text
  const [inputText, setInputText] = useState(() => {
    return initialItems.map(it => it.text).join(', ') || 'טלפון, משקפי שמש, חולצה להחלפה, עניבה, בקבוק מים';
  });

  const [items, setItems] = useState(initialItems);
  const [forcedStyleId, setForcedStyleId] = useState(null);
  const [showPromptCopied, setShowPromptCopied] = useState(false);
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  // Quick word tags to click
  const QUICK_WORD_TAGS = [
    'חציל', 'תמנון', 'טלפון', 'משקפי שמש', 'חולצה להחלפה', 'עניבה', 'בקבוק מים', 
    'משקולת', 'מלפפון', 'נעלי ספורט', 'אוזניות', 'ספל קפה', 'מחשב נייד'
  ];

  const handleAddQuickTag = (word) => {
    sounds.playTap?.();
    const currentTokens = inputText.split(/[,;\n]+/).map(t => t.trim()).filter(Boolean);
    if (!currentTokens.includes(word)) {
      currentTokens.push(word);
      setInputText(currentTokens.join(', '));
    }
  };

  const handleSelectPreset = (preset) => {
    sounds.playTap?.();
    setInputText(preset.items.join(', '));
  };

  // One-click Creation & Immediate Placement in House (Zero Friction!)
  const handleCreateAndPlace = (e) => {
    e?.preventDefault();
    const rawTokens = inputText
      .split(/[,;\n]+/)
      .map(t => t.trim())
      .filter(Boolean);

    if (rawTokens.length === 0) return;
    sounds.playLevelUp?.();

    const newItems = rawTokens.map((txt, i) => {
      const meta = lookupMnemonicItem(txt);
      return {
        id: `${Date.now()}_${i}`,
        text: meta ? meta.name : txt,
        completed: false
      };
    });

    setItems(newItems);
    setMode('view');

    const peg = generatePegKeyword(newItems);
    
    // Auto-place into building immediately with zero friction
    if (onUpdateStackConfig) {
      onUpdateStackConfig({
        activeTitle: peg.word,
        items: newItems,
        targetLocus: stackConfig.targetLocus || 'shelf_top'
      });
    }
  };

  // Cycle art style
  const handleCycleStyle = () => {
    sounds.playTap?.();
    const currentIdx = SURREAL_ART_STYLES.findIndex(s => s.id === (forcedStyleId || chimeraJudgement?.style?.id));
    const nextStyle = SURREAL_ART_STYLES[(currentIdx + 1) % SURREAL_ART_STYLES.length];
    setForcedStyleId(nextStyle.id);
  };

  // Copy visual prompt
  const handleCopyPrompt = () => {
    sounds.playTap?.();
    const prompt = generateSurrealArtPrompt(activeNonCompleted, forcedStyleId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
      setShowPromptCopied(true);
      setTimeout(() => setShowPromptCopied(false), 2200);
    }
  };

  const activeNonCompleted = items.filter(it => !it.completed);
  const chimeraJudgement = judgeUltimateChimera(activeNonCompleted, forcedStyleId);
  const pegKeyword = generatePegKeyword(activeNonCompleted);
  const absurdStory = generateAbsurdStory(activeNonCompleted);
  const surrealPrompt = generateSurrealArtPrompt(activeNonCompleted, forcedStyleId);

  return (
    <div className="anchor-modal-backdrop" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="anchor-dialog-card glass-card simple-chimera-modal" 
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: '560px',
          width: '92%',
          background: 'linear-gradient(155deg, #09090b 0%, #171434 50%, #090d16 100%)',
          border: '1.5px solid #f59e0b',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          color: '#f8fafc',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div 
          style={{ 
            padding: '14px 18px', 
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0,0,0,0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Sparkles size={18} color="#000" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fef08a' }}>
                {mode === 'input' ? 'בחירת מילים לדמות הזיכרון' : 'הדמות הביזארית נוצרה והוצבה בבית'}
              </h3>
              <span style={{ color: '#94a3b8', fontSize: '0.78rem' }}>
                חיבור כאוטי, מצחיק וסוריאליסטי שנצרב בזיכרון במינימום חיכוך
              </span>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} style={{ cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* ========================================================
            SCREEN 1: WORD SELECTION (מינימום חיכוך - רק בחירת מילים!)
            ======================================================== */}
        {mode === 'input' ? (
          <form onSubmit={handleCreateAndPlace} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={{ fontSize: '0.88rem', color: '#fef08a', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                הקלד או בחר את רשימת הפריטים לזיכרון:
              </label>
              
              <textarea
                rows={3}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="למשל: טלפון, משקפי שמש, חולצה, עניבה, בקבוק מים..."
                autoFocus
                style={{
                  width: '100%',
                  background: '#020617',
                  border: '1.5px solid rgba(245, 158, 11, 0.45)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  padding: '12px 14px',
                  fontSize: '0.96rem',
                  lineHeight: '1.5',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Quick Word Chips */}
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '6px' }}>
                הוספה מהירה בלחיצה:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {QUICK_WORD_TAGS.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleAddQuickTag(tag)}
                    style={{
                      background: 'rgba(30, 41, 59, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#cbd5e1',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    + {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets List */}
            <div style={{ background: 'rgba(2, 6, 23, 0.6)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Lightbulb size={13} />
                <span>רשימות מוכנות לבחירה מהירה:</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {DEFAULT_PRESET_LISTS.map(preset => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      color: '#e0f2fe',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textAlign: 'right'
                    }}
                  >
                    {preset.title}
                  </button>
                ))}
              </div>
            </div>

            {/* THE ONE PRIMARY ACTION BUTTON: CREATE & PLACE IN HOUSE */}
            <button
              type="submit"
              style={{
                marginTop: '8px',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '10px',
                padding: '13px 20px',
                color: '#000',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Sparkles size={18} color="#000" />
              <span>צור יצור ביזארי ומקם בבית ⚡</span>
            </button>
          </form>
        ) : (
          /* ========================================================
             SCREEN 2: RESULT VIEW (מוצג בבית, מילת עוגן, חזרה קלה)
             ======================================================== */
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Confirmation Banner */}
            <div style={{ 
              background: 'rgba(34, 197, 94, 0.15)', 
              border: '1px solid rgba(34, 197, 94, 0.4)', 
              borderRadius: '8px', 
              padding: '6px 12px', 
              fontSize: '0.8rem', 
              color: '#86efac',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span>✅ הדמות נוצרה והוצבה ישירות על מדף החדר בבית!</span>
              <button 
                type="button" 
                onClick={handleCycleStyle}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fef08a',
                  borderRadius: '6px',
                  padding: '3px 8px',
                  fontSize: '0.72rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Palette size={12} />
                <span>{chimeraJudgement?.style?.badge || 'סגנון'}</span>
              </button>
            </div>

            {/* 1. התצוגה הוויזואלית הסוריאליסטית של היצור במרכז (Clean Negative Space) */}
            <div 
              style={{
                background: 'radial-gradient(circle at center, #1e1b4b 0%, #09090b 100%)',
                borderRadius: '14px',
                border: '1.5px solid rgba(245, 158, 11, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '10px',
                minHeight: '210px',
                boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)'
              }}
            >
              <svg 
                style={{ width: '100%', height: '190px', overflow: 'visible' }} 
                viewBox="-75 -120 150 145"
              >
                <BizarreStackingEngine
                  items={activeNonCompleted}
                  baseX={0}
                  baseY={10}
                  forcedStyleId={forcedStyleId}
                />
              </svg>
            </div>

            {/* 2. מילת העוגן האסוציאטיבית (Mnemonic Peg) */}
            <div 
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.35))',
                border: '1.5px solid #ef4444',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.6rem' }}>{pegKeyword.emoji}</span>
                <div>
                  <div style={{ fontSize: '0.74rem', color: '#fca5a5', fontWeight: 'bold' }}>
                    מילת העוגן שנחקקת בזיכרון:
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#ffffff' }}>
                    "{pegKeyword.word}"
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#fecaca', maxWidth: '190px', textAlign: 'left', lineHeight: '1.3' }}>
                זוכרים רק את <strong>"{pegKeyword.word}"</strong> ← הפסל קופץ בראש ← כל הרשימה נשלפת!
              </div>
            </div>

            {/* 3. הסיפור הביזארי */}
            <div style={{ 
              background: 'rgba(2, 6, 23, 0.75)', 
              borderRadius: '10px', 
              padding: '9px 12px', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.78rem',
              color: '#cbd5e1',
              lineHeight: '1.45'
            }}>
              {absurdStory}
            </div>

            {/* 4. Visual Prompt Accordion */}
            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div 
                onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                style={{
                  padding: '7px 10px',
                  fontSize: '0.72rem',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <span>🎨 פרומפט ויזואלי לתמונה (Visual Prompt)</span>
                <span style={{ color: '#38bdf8' }}>{isPromptExpanded ? '▲ סגור' : '▼ הצג'}</span>
              </div>
              {isPromptExpanded && (
                <div style={{ padding: '8px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', direction: 'ltr', textAlign: 'left', fontFamily: 'monospace', maxHeight: '70px', overflowY: 'auto', background: 'rgba(0,0,0,0.5)', padding: '6px', borderRadius: '4px' }}>
                    {surrealPrompt}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    style={{
                      marginTop: '6px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid #38bdf8',
                      color: '#e0f2fe',
                      borderRadius: '5px',
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Copy size={12} />
                    <span>{showPromptCopied ? 'הועתק ללוח! ✨' : 'העתק פרומפט'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons: Minimal Friction - Return to House or Edit Words */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
              <button
                type="button"
                onClick={() => setMode('input')}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <RotateCcw size={13} />
                <span>שנה מילים</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '9px 20px',
                  color: '#000',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Home size={15} color="#000" />
                <span>חזור לחדר בבית 🏠</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
