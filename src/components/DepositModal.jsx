import React, { useState } from 'react';
import { 
  X, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  HelpCircle,
  Dices
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { saveDeposit } from '../utils/keyMethodStorage';
import { analyzeAcronym } from '../utils/acronymEngine';

// Clean, direct questions for memory palace encoding
const SCENARIOS = [
  {
    id: 'roach',
    icon: '🪳',
    title: 'ג\'וק מעופף',
    question: 'במה היית משתמש כדי לנטרל ג\'וק מעופף?',
    task: 'דרג את הפריטים שלך: מהכי יעיל (1) ועד להכי פחות יעיל',
    singleTask: 'דרג את מידת היעילות של הפריט לנטרול ג\'וק מעופף:',
    anchorQuestion: 'בחר עוגן ויזואלי שייצג את הארונית בחדר:',
    anchors: [
      { emoji: '🪳', label: 'ג\'וק מעופף' },
      { emoji: '👞', label: 'כפכף קטלני' },
      { emoji: '🧹', label: 'מטאטא עץ' },
      { emoji: '💥', label: 'מחבט חשמלי' }
    ]
  },
  {
    id: 'zombie',
    icon: '🧟',
    title: 'מתקפת זומבי',
    question: 'במה היית מתגונן מפני זומבי רעב?',
    task: 'דרג את הפריטים שלך: מהכי מועיל להגנה (1) ועד להכי פחות מועיל',
    singleTask: 'דרג את מידת היעילות של הפריט להגנה מפני זומבי:',
    anchorQuestion: 'בחר עוגן ויזואלי שייצג את הארונית בחדר:',
    anchors: [
      { emoji: '🧟', label: 'זומבי רעב' },
      { emoji: '🛡️', label: 'מגן פלדה' },
      { emoji: '🧠', label: 'מוח מבריק' },
      { emoji: '🚪', label: 'בריח ברזל' }
    ]
  },
  {
    id: 'island',
    icon: '🏝️',
    title: 'הישרדות על אי בודד',
    question: 'מה הכי חיוני להישרדות על אי בודד?',
    task: 'דרג את הפריטים שלך: מהכי מציל חיים (1) ועד להכי פחות חיוני',
    singleTask: 'דרג את מידת החיוניות של הפריט להישרדות על אי בודד:',
    anchorQuestion: 'בחר עוגן ויזואלי שייצג את הארונית בחדר:',
    anchors: [
      { emoji: '🏝️', label: 'אי בודד' },
      { emoji: '🥥', label: 'קוקוס מציל' },
      { emoji: '🔥', label: 'אש הישרדות' },
      { emoji: '⛺', label: 'אוהל מחסה' }
    ]
  },
  {
    id: 'rocket',
    icon: '🚀',
    title: 'חללית במצב חירום',
    question: 'מה הכי דחוף לשמור עליו בחללית שמאבדת גובה?',
    task: 'דרג את הפריטים שלך: מהכי קריטי לשמור (1) ועד להכי פחות קריטי',
    singleTask: 'דרג כמה קריטי לשמור על הפריט הזה בחללית:',
    anchorQuestion: 'בחר עוגן ויזואלי שייצג את הארונית בחדר:',
    anchors: [
      { emoji: '🚀', label: 'חללית מהירה' },
      { emoji: '🛸', label: 'צלחת מעופפת' },
      { emoji: '🌌', label: 'כוכב זוהר' },
      { emoji: '👨‍🚀', label: 'קסדת חלל' }
    ]
  }
];

// Helper to parse input items by newlines, commas, semicolons, or spaces
function parseInputItems(text) {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];

  // Check if text has commas, newlines, or semicolons
  if (/[\n,;\u060C]/.test(trimmed)) {
    return trimmed
      .split(/[\n,;\u060C]+/)
      .map(s => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean);
  }

  // Otherwise, split by whitespace (spaces / tabs)
  return trimmed
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);
}

export function DepositModal({
  isOpen,
  onClose,
  villageCipher = 'יער',
  villageName = 'כפר יער הצבא והביטחון',
  houseCipher = 'אבק',
  houseName = 'מתחם הבית',
  room,
  onDepositSaved
}) {
  // Step navigation: 'input' -> 'bizarre_question' -> 'pick_anchor'
  const [step, setStep] = useState('input');

  // Input state
  const [rawText, setRawText] = useState('');
  const [itemsArray, setItemsArray] = useState([]);

  // Question & rating state
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [sortedItems, setSortedItems] = useState([]);
  const [singleRating, setSingleRating] = useState(5);
  const [singleNote, setSingleNote] = useState('');

  // Chosen visual anchor
  const [selectedAnchor, setSelectedAnchor] = useState(null);

  if (!isOpen) return null;

  const activeScenario = SCENARIOS[scenarioIdx];

  // Step 1 -> Step 2: Parse raw text into array and initiate clean question
  const handleProceedFromInput = (e) => {
    e?.preventDefault();
    const parsed = parseInputItems(rawText);

    if (parsed.length === 0) {
      alert('אנא הקלד לפחות פריט אחד שברצונך לזכור.');
      return;
    }

    sounds.playTap?.();
    setItemsArray(parsed);

    if (parsed.length > 1) {
      // Check if algorithmic acronym / Hebrew phrase is formed!
      const acronymAnalysis = analyzeAcronym(parsed);
      if (acronymAnalysis && acronymAnalysis.isRealWord) {
        // Automatically save as an Acronym Chest directly without interrupting the customer!
        handleSaveAsChest(acronymAnalysis);
        return;
      }

      // Fallback: list without a real word acronym proceeds to bizarre question ranking flow
      setSortedItems(parsed.map((name, idx) => ({
        id: `item_${idx}_${Date.now()}`,
        name,
        rank: idx + 1
      })));
    } else {
      // Single item: setup default 5-star rating
      setSingleRating(5);
      setSingleNote('');
    }

    // Default anchor to scenario's first icon
    setSelectedAnchor(activeScenario.anchors[0]);
    setStep('bizarre_question');
  };

  // Convert and save directly into the room's Acronym Chest (תיבה)
  const handleSaveAsChest = (acronymInfo) => {
    sounds.playFanfare?.();
    const newDeposit = {
      id: `dep_${Date.now()}`,
      createdAt: Date.now(),
      villageCipher,
      villageName,
      houseCipher,
      houseName,
      roomId: room?.id || 'main_hall',
      roomName: room?.name || 'חדר מרכזי',
      type: 'chest',
      acronym: acronymInfo.bestAcronym,
      matchedWord: acronymInfo.matchedWord,
      isRealWord: acronymInfo.isRealWord,
      orderedItems: acronymInfo.orderedItems,
      items: acronymInfo.orderedItems.map(p => p.item),
      title: `תיבת ראשי תיבות: ${acronymInfo.bestAcronym}`,
      visualAnchor: { emoji: '🧰', label: acronymInfo.bestAcronym },
      lastPracticed: new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' })
    };
    saveDeposit(newDeposit);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
    onDepositSaved?.(newDeposit);
    onClose();
  };

  // Switch scenario (e.g. if user wants a different funny question)
  const handleNextScenario = () => {
    sounds.playTap?.();
    const nextIdx = (scenarioIdx + 1) % SCENARIOS.length;
    setScenarioIdx(nextIdx);
    setSelectedAnchor(SCENARIOS[nextIdx].anchors[0]);
  };

  // Reorder items in list
  const handleMoveItem = (index, direction) => {
    sounds.playTap?.();
    const target = index + direction;
    if (target < 0 || target >= sortedItems.length) return;

    const copy = [...sortedItems];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setSortedItems(copy.map((it, idx) => ({ ...it, rank: idx + 1 })));
  };

  // Step 2 -> Step 3: Go to Visual Anchor picker
  const handleProceedToAnchor = () => {
    sounds.playTap?.();
    setStep('pick_anchor');
  };

  // Final Step: Save deposit to room storage and celebrate
  const handleFinalSave = () => {
    sounds.playFanfare?.();

    const isList = itemsArray.length > 1;
    const finalAnchor = selectedAnchor || activeScenario.anchors[0];

    const newDeposit = {
      id: `dep_${Date.now()}`,
      createdAt: Date.now(),
      villageCipher,
      villageName,
      houseCipher,
      houseName,
      roomId: room?.id || 'main_hall',
      roomName: room?.name || 'חדר מרכזי',
      type: isList ? 'list' : 'single',
      visualAnchor: finalAnchor,
      bizarreScenarioId: activeScenario.id,
      criterion: activeScenario.question,
      associationWord: finalAnchor.label,
      
      // Data payload
      ...(isList ? {
        items: sortedItems.map((it, idx) => ({
          id: it.id,
          name: it.name,
          text: it.name,
          rank: idx + 1
        })),
        lockerTitle: `ארונית ${finalAnchor.emoji} (${finalAnchor.label})`
      } : {
        itemName: itemsArray[0],
        rating: singleRating,
        singleNote: singleNote.trim(),
        lockerTitle: `פריט ${finalAnchor.emoji} (${itemsArray[0]})`
      })
    };

    saveDeposit(newDeposit);

    // Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    onDepositSaved?.(newDeposit);
    onClose();
  };

  return (
    <div 
      className="journal-backdrop key-method-backdrop animate-fade-in" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      style={{ zIndex: 1100 }}
    >
      <div 
        className="glass-card" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '560px',
          borderRadius: '24px',
          background: 'linear-gradient(165deg, #1c1829 0%, #110e1c 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(245, 158, 11, 0.15)',
          color: '#f8fafc',
          direction: 'rtl',
          overflow: 'hidden'
        }}
      >
        {/* Simple & Quiet Header */}
        <div 
          style={{
            padding: '16px 22px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.25)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>{activeScenario.icon}</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#fef08a', fontWeight: 800 }}>
                {room?.name ? `הפקדת רשימה לארונית — ${room.name}` : 'הפקדת רשימה לארונית'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {step === 'input' && 'שלב 1: הזנת פריטי הרשימה'}
                {step === 'bizarre_question' && 'שלב 2: שאלת הפתעה ודירוג הרשימה'}
                {step === 'pick_anchor' && 'שלב 3: בחירת עוגן ויזואלי לארונית'}
              </span>
            </div>
          </div>

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
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px' }}>

          {/* ======================================================== */}
          {/* STEP 1: CLEAN MINIMAL INPUT ("הקלד כאן..")               */}
          {/* ======================================================== */}
          {step === 'input' && (
            <form onSubmit={handleProceedFromInput}>
              <div style={{ marginBottom: '16px' }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontSize: '1rem', 
                    fontWeight: 700, 
                    color: '#ffffff', 
                    marginBottom: '8px' 
                  }}
                >
                  מה תרצה לזכור?
                </label>
                <textarea
                  rows={4}
                  autoFocus
                  value={rawText}
                  onChange={e => setRawText(e.target.value)}
                  placeholder="הקלד כאן... (למשל: חוגר, דסקית, דוח1, גלחצ או כל רשימה)"
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    background: 'rgba(0, 0, 0, 0.45)',
                    border: '1.5px solid rgba(245, 158, 11, 0.35)',
                    color: '#ffffff',
                    fontSize: '1.05rem',
                    outline: 'none',
                    resize: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      handleProceedFromInput(e);
                    }
                  }}
                />

                {/* Real-time chips preview of parsed items */}
                {rawText.trim() && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ fontSize: '0.8rem', color: '#fde047', fontWeight: 600, marginBottom: '6px' }}>
                      {parseInputItems(rawText).length > 1 
                        ? `זוהו ${parseInputItems(rawText).length} פריטים נפרדים:` 
                        : 'פריט יחיד:'}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {parseInputItems(rawText).map((it, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.45)',
                            color: '#fef08a',
                            fontSize: '0.82rem',
                            padding: '3px 10px',
                            borderRadius: '8px',
                            fontWeight: 700
                          }}
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                )}



                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '8px', display: 'block' }}>
                  💡 טיפ: הפרד פריטים ברווחים, בפסיקים או בשורות חדשות.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  type="submit"
                  disabled={!rawText.trim()}
                  style={{
                    background: rawText.trim() ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: rawText.trim() ? '#000000' : '#64748b',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    padding: '10px 24px',
                    borderRadius: '12px',
                    cursor: rawText.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: rawText.trim() ? '0 4px 15px rgba(245, 158, 11, 0.4)' : 'none'
                  }}
                >
                  <span>המשך</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: CLEAN QUESTION & RANKING                          */}
          {/* ======================================================== */}
          {step === 'bizarre_question' && (
            <div>
              {/* Optional Acronym Chest Conversion Banner in Step 2 */}
              {(() => {
                if (itemsArray.length < 2) return null;
                const acronymInfo = analyzeAcronym(itemsArray);
                if (!acronymInfo) return null;

                return (
                  <div
                    className="animate-fade-in"
                    style={{
                      marginBottom: '16px',
                      padding: '12px 16px',
                      background: 'linear-gradient(135deg, rgba(69, 26, 3, 0.95), rgba(28, 12, 4, 0.98))',
                      border: '1.5px solid #f59e0b',
                      borderRadius: '16px',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '220px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '1.3rem' }}>🧰</span>
                        <strong style={{ color: '#fef08a', fontSize: '0.94rem' }}>
                          {acronymInfo.isRealWord
                            ? (acronymInfo.isPhrase ? `זוהה ביטוי עברי מושלם: "${acronymInfo.matchedWord}" (${acronymInfo.bestAcronym})!` : `נמצאו ראשי תיבות מושלמים: "${acronymInfo.matchedWord}" (${acronymInfo.bestAcronym})!`)
                            : `הצעת ראשי תיבות: [ ${acronymInfo.bestAcronym} ]`}
                        </strong>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#fde68a', lineHeight: 1.35 }}>
                        {acronymInfo.isRealWord
                          ? (acronymInfo.isPhrase ? `הביטוי "${acronymInfo.matchedWord}" מחבר את הפריטים בצורה קליטה וטבעית. מעדיף לשמור ישירות בתיבה במקום לדרג?` : `המילה "${acronymInfo.matchedWord}" מחברת את הפריטים בצורה קליטה וטבעית. מעדיף לשמור ישירות בתיבה במקום לדרג?`)
                          : `מעדיף לשמור כתיבת ראשי תיבות בחדר במקום בארונית עם שאלת דירוג?`}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveAsChest(acronymInfo)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        border: 'none',
                        color: '#1c0a00',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        padding: '9px 16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 3px 12px rgba(245, 158, 11, 0.45)'
                      }}
                    >
                      <Sparkles size={15} />
                      <span>הפקד בתיבה ({acronymInfo.bestAcronym}) 🧰</span>
                    </button>
                  </div>
                );
              })()}

              {/* Question Banner - Clean and without bloat */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), rgba(217, 119, 6, 0.08))',
                  border: '1.5px solid #f59e0b',
                  borderRadius: '18px',
                  padding: '16px',
                  marginBottom: '18px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{activeScenario.icon}</span>
                    <span style={{ fontSize: '0.9rem', color: '#fef08a', fontWeight: 800 }}>
                      {activeScenario.title}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleNextScenario}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#cbd5e1',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="החלף לשאלה אחרת"
                  >
                    <Dices size={13} color="#f59e0b" />
                    <span>שאלה אחרת</span>
                  </button>
                </div>

                <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#ffffff', fontWeight: 800, lineHeight: 1.35 }}>
                  {activeScenario.question}
                </h4>
                <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '6px', fontWeight: 500 }}>
                  {itemsArray.length > 1 ? activeScenario.task : activeScenario.singleTask}
                </div>
              </div>

              {/* Multi-item sorting UI */}
              {itemsArray.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                  {sortedItems.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: index === 0 
                          ? 'rgba(245, 158, 11, 0.2)' 
                          : (index === sortedItems.length - 1 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
                        border: index === 0 
                          ? '1.5px solid #f59e0b' 
                          : (index === sortedItems.length - 1 ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)'),
                        borderRadius: '12px',
                        padding: '10px 14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span 
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: index === 0 ? '#f59e0b' : 'rgba(255, 255, 255, 0.15)',
                            color: index === 0 ? '#000000' : '#ffffff',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {index + 1}
                        </span>
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                          {item.name}
                        </span>
                        {index === 0 && (
                          <span style={{ fontSize: '0.72rem', color: '#fde047', fontWeight: 700 }}>
                            (מקום ראשון 🏆)
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveItem(index, -1)}
                          style={{
                            background: index === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            borderRadius: '6px',
                            color: index === 0 ? '#475569' : '#cbd5e1',
                            cursor: index === 0 ? 'default' : 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="העלה בדירוג"
                        >
                          <ChevronUp size={20} />
                        </button>
                        <button
                          type="button"
                          disabled={index === sortedItems.length - 1}
                          onClick={() => handleMoveItem(index, 1)}
                          style={{
                            background: index === sortedItems.length - 1 ? 'transparent' : 'rgba(255, 255, 255, 0.08)',
                            border: 'none',
                            borderRadius: '6px',
                            color: index === sortedItems.length - 1 ? '#475569' : '#cbd5e1',
                            cursor: index === sortedItems.length - 1 ? 'default' : 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="הורד בדירוג"
                        >
                          <ChevronDown size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Single item rating UI */
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '10px' }}>
                    דרג את רמת היעילות עבור <strong style={{ color: '#fef08a' }}>{itemsArray[0]}</strong>:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => {
                          sounds.playTap?.();
                          setSingleRating(stars);
                        }}
                        style={{
                          flex: 1,
                          padding: '10px 4px',
                          borderRadius: '12px',
                          border: singleRating === stars ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
                          background: singleRating === stars ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                          color: singleRating === stars ? '#fde047' : '#e2e8f0',
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        <span style={{ fontSize: '1.1rem' }}>{'⭐'.repeat(stars)}</span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>דרגה {stars}</span>
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={singleNote}
                    onChange={e => setSingleNote(e.target.value)}
                    placeholder="הוסף הערה או אסוציאציה (אופציונלי)..."
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  חזור לעריכת הטקסט
                </button>

                <button
                  type="button"
                  onClick={handleProceedToAnchor}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: '#000000',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    padding: '10px 22px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>המשך לבחירת עוגן</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: PICK VISUAL ANCHOR ("מה מזכיר לך ג'וק?")          */}
          {/* ======================================================== */}
          {step === 'pick_anchor' && (
            <div>
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>
                  {selectedAnchor?.emoji || activeScenario.icon}
                </span>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '1.15rem', color: '#fef08a', fontWeight: 800 }}>
                  {activeScenario.anchorQuestion}
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#94a3b8' }}>
                  הסמל שתבחר יוצג על גבי הארונית בחדר, ויפעיל את הזיכרון בכל פעם שתביט בו!
                </p>
              </div>

              {/* Anchor choices grid */}
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '12px',
                  marginBottom: '24px'
                }}
              >
                {activeScenario.anchors.map((anc) => {
                  const isSelected = selectedAnchor?.emoji === anc.emoji;

                  return (
                    <div
                      key={anc.emoji}
                      onClick={() => {
                        sounds.playTap?.();
                        setSelectedAnchor(anc);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        background: isSelected ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '2px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: isSelected ? '0 4px 15px rgba(245, 158, 11, 0.3)' : 'none'
                      }}
                    >
                      <span style={{ fontSize: '1.8rem' }}>{anc.emoji}</span>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: isSelected ? '#fef08a' : '#ffffff' }}>
                          {anc.label}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          עוגן חזותי
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Save Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={() => setStep('bizarre_question')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  חזור לשאלה
                </button>

                <button
                  type="button"
                  onClick={handleFinalSave}
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    padding: '12px 28px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.45)'
                  }}
                >
                  <Sparkles size={18} />
                  <span>שמור בארמון הזיכרון 🏛️</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
