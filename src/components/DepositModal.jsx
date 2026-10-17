import React, { useState, useEffect } from 'react';
import { 
  X, 
  Key, 
  Package, 
  Layers, 
  ArrowUpDown, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Check, 
  HelpCircle,
  Hash
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { 
  SORTING_BENCHMARKS, 
  formatPhysicalChain, 
  saveDeposit 
} from '../utils/keyMethodStorage';

export function DepositModal({
  isOpen,
  onClose,
  villageCipher = 'יער',
  villageName = 'כפר יער הצבא והביטחון',
  houseCipher = 'אבק',
  houseName = 'מחלקת לוגיסטיקה וציוד',
  room,
  onDepositSaved
}) {
  const [depositType, setDepositType] = useState('single'); // 'single' | 'list'

  // Single Item State
  const [singleItemName, setSingleItemName] = useState('');
  const [singleAssociationWord, setSingleAssociationWord] = useState('');

  // List State
  const [listRawInput, setListRawInput] = useState('');
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState('mouth_first');
  const [customCriterion, setCustomCriterion] = useState('');
  const [customAssociationWord, setCustomAssociationWord] = useState('');
  const [sortedItems, setSortedItems] = useState([]);
  const [isSortedConfirmed, setIsSortedConfirmed] = useState(false);

  // Active benchmark details
  const activeBenchmark = SORTING_BENCHMARKS.find(b => b.id === selectedBenchmarkId) || SORTING_BENCHMARKS[0];
  const effectiveAssociationWord = depositType === 'single'
    ? singleAssociationWord.trim()
    : (selectedBenchmarkId === 'custom' ? customAssociationWord.trim() : activeBenchmark.associationWord);

  const effectiveCriterion = selectedBenchmarkId === 'custom'
    ? (customCriterion.trim() || 'שאלה ביזארית מותאמת')
    : (activeBenchmark.question || activeBenchmark.label);

  // Sync list raw input to sorted items
  useEffect(() => {
    if (depositType === 'list') {
      const lines = listRawInput
        .split(/[\n,]+/)
        .map(s => s.trim())
        .filter(Boolean);

      if (lines.length > 0) {
        setSortedItems(lines.map((text, idx) => ({
          id: `item-${idx}-${text}`,
          text,
          rank: idx + 1
        })));
      } else {
        setSortedItems([]);
      }
    }
  }, [listRawInput, depositType]);

  if (!isOpen) return null;

  const handleMoveItem = (index, direction) => {
    sounds.playTap?.();
    const newItems = [...sortedItems];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Re-assign ranks
    const reRanked = newItems.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setSortedItems(reRanked);
    setIsSortedConfirmed(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (depositType === 'single') {
      if (!singleItemName.trim()) {
        alert('אנא הזן את שם החפץ או המידע שברצונך להפקיד.');
        return;
      }
      if (!singleAssociationWord.trim()) {
        alert('אנא הזן מילת אסוציאציה לקשירת המידע ברצף הפיזי.');
        return;
      }

      const newDeposit = {
        id: `dep_${Date.now()}`,
        createdAt: Date.now(),
        villageCipher,
        villageName,
        houseCipher,
        houseName,
        roomId: room?.id || 'main_hall',
        roomName: room?.name || 'חדר מרכזי',
        type: 'single',
        itemName: singleItemName.trim(),
        associationWord: singleAssociationWord.trim(),
        physicalChain: formatPhysicalChain(villageCipher, houseCipher, singleAssociationWord.trim())
      };

      saveDeposit(newDeposit);
      sounds.playSuccess?.();
      onDepositSaved?.(newDeposit);
      onClose();
    } else {
      // List
      if (sortedItems.length === 0) {
        alert('אנא הזן לפחות 2 פריטים לרשימה.');
        return;
      }
      if (selectedBenchmarkId === 'custom' && (!customCriterion.trim() || !customAssociationWord.trim())) {
        alert('אנא הזן אמת מידה ומילת אסוציאציה מותאמת אישית.');
        return;
      }

      const newDeposit = {
        id: `dep_${Date.now()}`,
        createdAt: Date.now(),
        villageCipher,
        villageName,
        houseCipher,
        houseName,
        roomId: room?.id || 'main_hall',
        roomName: room?.name || 'חדר מרכזי',
        type: 'list',
        criterion: effectiveCriterion,
        associationWord: effectiveAssociationWord,
        physicalChain: formatPhysicalChain(villageCipher, houseCipher, effectiveAssociationWord),
        lockerTitle: `לוקר ממוין (${effectiveCriterion})`,
        items: sortedItems
      };

      saveDeposit(newDeposit);
      sounds.playLevelUp?.();
      onDepositSaved?.(newDeposit);
      onClose();
    }
  };

  const physicalChainPreview = formatPhysicalChain(
    villageCipher,
    houseCipher,
    effectiveAssociationWord || '?'
  );

  return (
    <div className="journal-backdrop key-method-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="key-method-modal glass-card" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="key-modal-header">
          <div className="key-header-title">
            <span className="key-icon-badge">🗝️</span>
            <div>
              <h2>שיטת המפתחות • מה אתה מפקיד היום?</h2>
              <div className="key-chain-breadcrumbs">
                <span className="chain-step">🌲 כפר: <strong>"{villageCipher}"</strong></span>
                <span className="chain-arrow">➔</span>
                <span className="chain-step">🏠 בית: <strong>"{houseCipher}"</strong></span>
                <span className="chain-arrow">➔</span>
                <span className="chain-step room-step" style={{ color: room?.color || '#f59e0b' }}>
                  {room?.emoji || '🚪'} <strong>{room?.name || 'חדר הארמון'}</strong>
                </span>
              </div>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור חלון (Esc)">
            <X size={20} />
          </button>
        </div>

        {/* Step 1: Choose Deposit Mode */}
        <div className="key-mode-tabs">
          <button
            type="button"
            className={`key-mode-tab ${depositType === 'single' ? 'active' : ''}`}
            onClick={() => {
              sounds.playTap?.();
              setDepositType('single');
            }}
          >
            <Package size={18} />
            <div className="tab-text">
              <strong>פריט בודד</strong>
              <span>עוגן מילולי ברצף פיזי</span>
            </div>
          </button>

          <button
            type="button"
            className={`key-mode-tab ${depositType === 'list' ? 'active' : ''}`}
            onClick={() => {
              sounds.playTap?.();
              setDepositType('list');
            }}
          >
            <Layers size={18} />
            <div className="tab-text">
              <strong>רשימת פריטים</strong>
              <span>ארונית לוקר ממוספרת וממוינת</span>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="key-deposit-form">
          {/* SINGLE ITEM FORM */}
          {depositType === 'single' ? (
            <div className="key-single-body animate-fade-in">
              <div className="form-group">
                <label className="form-label">
                  <span>📦 מה אתה מפקיד היום בחדר זה?</span>
                  <span className="label-hint">(שם החפץ, מידע, משימה או מושג)</span>
                </label>
                <input
                  type="text"
                  className="key-input"
                  placeholder="למשל: מפתחות הרכב, סיסמת מחשב, פגישה חשובה..."
                  value={singleItemName}
                  onChange={e => setSingleItemName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>✨ מילת אסוציאציה לקשירה</span>
                  <span className="label-hint">(מילה חיה שתשמש מפתח לשליפה מהירה)</span>
                </label>
                <input
                  type="text"
                  className="key-input"
                  placeholder="למשל: מנעול, ברק, פטיש, להבה..."
                  value={singleAssociationWord}
                  onChange={e => setSingleAssociationWord(e.target.value)}
                  required
                />
              </div>

              {/* Physical Chain Live Seal */}
              <div className="physical-chain-seal glass-card">
                <div className="seal-head">
                  <Key size={16} className="text-amber" />
                  <strong>עוגן מילולי פיזי שנוצר (לפי רצף השמירה בזיכרון):</strong>
                </div>
                <div className="seal-chain-display">
                  <span className="chain-node village-node">הכפר ({villageCipher})</span>
                  <span className="chain-sep">←</span>
                  <span className="chain-node house-node">הבית ({houseCipher})</span>
                  <span className="chain-sep">←</span>
                  <span className="chain-node assoc-node">{singleAssociationWord.trim() || '[מילת אסוציאציה]'}</span>
                </div>
                <p className="seal-tip">
                  💡 כדי להיזכר: תמיד צעד מנטלית מ<strong>הכפר ({villageCipher})</strong>, אל <strong>הבית ({houseCipher})</strong>, ומיד תצוף מילת המפתח שתשלוף את הפריט!
                </p>
              </div>
            </div>
          ) : (
            /* LIST FORM: NUMBERED LOCKER & SORTING BENCHMARK */
            <div className="key-list-body animate-fade-in">
              {/* 1. Raw Input */}
              <div className="form-group">
                <label className="form-label">
                  <span>📝 הזן את פריטי הרשימה</span>
                  <span className="label-hint">(פריט בכל שורה או מופרדים בפסיקים)</span>
                </label>
                <textarea
                  className="key-textarea"
                  rows={3}
                  placeholder={`טלפון נייד\nמשקפי שמש\nחולצה להחלפה\nבקבוק מים\nמשקולת`}
                  value={listRawInput}
                  onChange={e => setListRawInput(e.target.value)}
                />
              </div>

              {/* 2. Bizarre Sorting Question Card (The Key Method Anchor) */}
              <div className="form-group">
                <div className="bizarre-challenge-card glass-card">
                  <div className="bizarre-card-top">
                    <span className="bizarre-tag">🤪 שאלת מיון ביזארית לקידוד עמוק</span>
                    <span className="bizarre-tag-sub">שיטת המפתחות: חריטה רגשית וצחוק = זיכרון שלא נמחק!</span>
                  </div>

                  <div className="bizarre-highlight-question">
                    <span className="bizarre-big-icon">{activeBenchmark.icon || '👄'}</span>
                    <div className="bizarre-q-content">
                      <h3 className="bizarre-q-title">"{activeBenchmark.question || activeBenchmark.label}"</h3>
                      <p className="bizarre-q-hint">💡 {activeBenchmark.hint}</p>
                    </div>
                  </div>

                  <div className="bizarre-assoc-ribbon">
                    <span className="bizarre-assoc-label">🔑 מילת אסוציאציה נגזרת שתפתח את הלוקר:</span>
                    <strong className="bizarre-assoc-target">"{effectiveAssociationWord || '...'}"</strong>
                  </div>
                </div>

                <div className="switch-benchmark-wrapper">
                  <span className="switch-benchmark-label">או בחר שאלה ביזארית אחרת:</span>
                  <div className="benchmarks-grid">
                    {SORTING_BENCHMARKS.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        className={`benchmark-pill ${selectedBenchmarkId === b.id ? 'active' : ''}`}
                        onClick={() => {
                          sounds.playTap?.();
                          setSelectedBenchmarkId(b.id);
                        }}
                      >
                        <span className="bench-icon">{b.icon}</span>
                        <div className="bench-info">
                          <strong>{b.question || b.label}</strong>
                          {b.associationWord && (
                            <span className="bench-assoc">אסוציאציה: "{b.associationWord}"</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedBenchmarkId === 'custom' && (
                    <div className="custom-benchmark-row animate-fade-in">
                      <input
                        type="text"
                        className="key-input"
                        placeholder="הגדר שאלה ביזארית משלך..."
                        value={customCriterion}
                        onChange={e => setCustomCriterion(e.target.value)}
                      />
                      <input
                        type="text"
                        className="key-input"
                        placeholder="מילת אסוציאציה נגזרת..."
                        value={customAssociationWord}
                        onChange={e => setCustomAssociationWord(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Numbered Locker Interactive Sorting Area */}
              {sortedItems.length > 0 && (
                <div className="numbered-locker-station glass-card">
                  <div className="locker-station-head">
                    <div className="locker-title-wrap">
                      <span className="locker-brass-tag">🗄️ ארונית לוקר ממוספרת</span>
                      <span className="locker-bench-badge">
                        שאלה: <strong>{effectiveCriterion}</strong>
                      </span>
                      <span className="locker-assoc-badge">
                        🗝️ מילת אסוציאציה: <strong>"{effectiveAssociationWord || '?'}"</strong>
                      </span>
                    </div>
                    <span className="reorder-prompt-hint">
                      {selectedBenchmarkId === 'mouth_first'
                        ? `👄 סדר מהפריט שהכי היית דוחף לפה ובולע (תא 1) ועד לזה שבחיים לא היית נוגע בו בלשון (תא ${sortedItems.length}) בעזרת 🔼 🔽:`
                        : `מיין לפי השאלה "${effectiveCriterion}" בעזרת החצים 🔼 🔽:`}
                    </span>
                  </div>

                  <div className="locker-slots-list">
                    {sortedItems.map((item, idx) => (
                      <div key={item.id} className="locker-slot-row">
                        <div className="slot-number-badge">
                          <Hash size={13} />
                          <span>תא {idx + 1}</span>
                        </div>

                        <div className="slot-item-text">
                          {item.text}
                        </div>

                        <div className="slot-order-actions">
                          <button
                            type="button"
                            className="order-btn"
                            disabled={idx === 0}
                            onClick={() => handleMoveItem(idx, -1)}
                            title="העלה תא למעלה"
                          >
                            <ChevronUp size={16} />
                          </button>
                          <button
                            type="button"
                            className="order-btn"
                            disabled={idx === sortedItems.length - 1}
                            onClick={() => handleMoveItem(idx, 1)}
                            title="הורד תא למטה"
                          >
                            <ChevronDown size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Physical Chain for List */}
                  <div className="seal-chain-display" style={{ marginTop: '12px' }}>
                    <span className="chain-node village-node">הכפר ({villageCipher})</span>
                    <span className="chain-sep">←</span>
                    <span className="chain-node house-node">הבית ({houseCipher})</span>
                    <span className="chain-sep">←</span>
                    <span className="chain-node assoc-node">{effectiveAssociationWord || '[מילה]'}</span>
                    <span className="chain-sep">←</span>
                    <span className="chain-node locker-node">ארונית לוקר ({sortedItems.length} תאים ממוספרים)</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Actions */}
          <div className="key-modal-footer">
            <button
              type="button"
              className="key-cancel-btn"
              onClick={onClose}
            >
              ביטול
            </button>
            <button
              type="submit"
              className="key-submit-btn"
            >
              <Sparkles size={17} />
              <span>הפקד בארמון המנטלי 🗝️</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
