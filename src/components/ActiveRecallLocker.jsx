import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  Eye, 
  RotateCcw, 
  Sparkles, 
  Hash, 
  Key, 
  ChevronUp, 
  ChevronDown, 
  Check, 
  HelpCircle,
  GripVertical
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { getStoredDeposits, saveDeposit } from '../utils/keyMethodStorage';

/**
 * ActiveRecallLocker:
 * An authentic physical wooden locker cabinet ("ארונית לוקר ומגירות פיזית").
 * Users and their in-game character physically inspect the cabinet,
 * pull drawers out to reveal active-recall keywords, and shift/reorder drawers.
 */
export function ActiveRecallLocker({
  depositId,
  items = [],
  criterion = '',
  associationWord = '',
  villageCipher = 'יער',
  houseCipher = 'אבק',
  compact = false,
  showCharacterAvatar = false,
  onReorder = null
}) {
  // Current drawer items (allow reordering)
  const [drawerItems, setDrawerItems] = useState(items);

  // Track which drawers are currently pulled open (Active Recall)
  const [pulledDrawers, setPulledDrawers] = useState({});
  const [activeHintDrawer, setActiveHintDrawer] = useState(null);

  // Keep internal items in sync if props change
  useEffect(() => {
    if (items && items.length > 0) {
      setDrawerItems(items);
    }
  }, [items]);

  // Pull a drawer out or push it back in
  const toggleDrawer = (idx) => {
    sounds.playTap?.();
    setPulledDrawers(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Pull all drawers open
  const handlePullAllDrawers = (e) => {
    e?.stopPropagation();
    sounds.playCultivate?.();
    const all = {};
    drawerItems.forEach((_, idx) => { all[idx] = true; });
    setPulledDrawers(all);
  };

  // Push all drawers shut (Reset for Active Recall practice)
  const handlePushAllDrawers = (e) => {
    e?.stopPropagation();
    sounds.playTap?.();
    setPulledDrawers({});
    setActiveHintDrawer(null);
  };

  // Reorder drawers up or down ("מזיזים מגירות")
  const handleMoveDrawer = (index, direction, e) => {
    e?.stopPropagation();
    sounds.playTap?.();

    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= drawerItems.length) return;

    const newItems = [...drawerItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    // Update ranks
    const reRanked = newItems.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));

    setDrawerItems(reRanked);

    // Also swap the pulled state so the drawer stays in its opened/closed state
    setPulledDrawers(prev => {
      const updated = { ...prev };
      const currentVal = !!prev[index];
      const targetVal = !!prev[targetIndex];
      updated[index] = targetVal;
      updated[targetIndex] = currentVal;
      return updated;
    });

    // Notify parent or persist if depositId provided
    if (onReorder) {
      onReorder(reRanked);
    } else if (depositId) {
      const all = getStoredDeposits();
      const dep = all.find(d => d.id === depositId);
      if (dep) {
        saveDeposit({
          ...dep,
          items: reRanked
        });
      }
    }
  };

  const openCount = Object.values(pulledDrawers).filter(Boolean).length;
  const isAllOpen = drawerItems.length > 0 && openCount === drawerItems.length;

  return (
    <div className={`physical-locker-furniture-container ${compact ? 'compact' : ''}`}>
      {/* Optional In-Scene Companion Character standing beside the locker */}
      {showCharacterAvatar && (
        <div className="locker-companion-stage">
          <div className="companion-character-avatar">
            <div className="char-sprite-mini" title="הדמות שלך מתבוננת בלוקר ומאמנת את הזיכרון!">
              <div className="char-hat"></div>
              <div className="char-head">
                <div className="char-eyes"></div>
                <div className="char-smile"></div>
              </div>
              <div className="char-torso">
                <div className="char-backpack"></div>
              </div>
            </div>
            <div className="companion-speech-bubble">
              <span>"בוא נראה מה זכרת! משוך את המגירה רק אחרי שניחשת 🧠"</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Physical Wooden Cabinet Shell */}
      <div className="wooden-cabinet-shell">
        {/* Brass Header Plate with Engraved Bizarre Question & Anchors */}
        <div className="cabinet-brass-header">
          <div className="brass-screws-row">
            <span className="brass-screw top-left">✛</span>
            <span className="brass-screw top-right">✛</span>
          </div>

          <div className="cabinet-header-content">
            <div className="cabinet-header-badge">
              <span className="cabinet-icon">🗄️</span>
              <strong className="cabinet-title">ארונית לוקר פיזית • {drawerItems.length} מגירות עץ</strong>
            </div>

            <div className="bizarre-q-highlight-strip">
              <span className="q-label">שאלה ממיינת:</span>
              <h4 className="bizarre-q-text">
                {criterion || 'את מה היית דוחף לפה קודם? 👄'}
              </h4>
            </div>

            <div className="cabinet-anchors-row">
              <span className="anchor-pill village-pill">
                הכפר ({villageCipher})
              </span>
              <span className="anchor-sep">←</span>
              <span className="anchor-pill house-pill">
                הבית ({houseCipher})
              </span>
              <span className="anchor-sep">←</span>
              <span className="anchor-pill assoc-pill">
                <Key size={12} className="text-amber" />
                מפתח: <strong>"{associationWord || 'בלוע'}"</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tactile Cabinet Active Recall Controls */}
        <div className="cabinet-tactile-toolbar">
          <div className="drawers-status-counter">
            <span className="counter-icon">{isAllOpen ? '🔓' : '🔒'}</span>
            <span><strong>{openCount}</strong> מתוך <strong>{drawerItems.length}</strong> מגירות פתוחות</span>
          </div>

          <div className="cabinet-toolbar-actions">
            <button
              type="button"
              className="cabinet-tool-btn push-all-btn"
              onClick={handlePushAllDrawers}
              title="דחוף את כל המגירות פנימה כדי לבחון את עצמך בשליפה אקטיבית"
            >
              <RotateCcw size={13} />
              <span>דחוף הכל פנימה 🔒</span>
            </button>

            {!isAllOpen && (
              <button
                type="button"
                className="cabinet-tool-btn pull-all-btn"
                onClick={handlePullAllDrawers}
                title="משוך את כל המגירות החוצה וחשוף את כל המילים"
              >
                <Eye size={13} />
                <span>שלוף הכל 👁️</span>
              </button>
            )}
          </div>
        </div>

        {/* Tier Hierarchy Guide (Extreme Bizarre Question Context) */}
        <div className="drawer-tier-guide">
          <span className="tier-guide-top">
            ⬆️ מגירה עליונה (1): הראשון שהיית דוחף לפה ובולע 👄
          </span>
          <span className="tier-guide-bottom">
            ⬇️ מגירה תחתונה ({drawerItems.length}): בחיים לא מתקרב לפה! 🚫
          </span>
        </div>

        {/* The Physical Tiered Drawers Stack */}
        <div className="drawers-stack-frame">
          {drawerItems.map((item, idx) => {
            const isPulled = !!pulledDrawers[idx];

            return (
              <div 
                key={item.id || `drawer-${idx}`} 
                className={`physical-drawer-bay ${isPulled ? 'drawer-open' : 'drawer-closed'}`}
              >
                {/* Drawer Cavity / Depth Interior Background */}
                <div className="drawer-cavity-shadow">
                  {/* Sliding Wooden Drawer Body */}
                  <div 
                    className={`sliding-drawer-body ${isPulled ? 'is-slid-out' : ''}`}
                    onClick={() => toggleDrawer(idx)}
                  >
                    {/* Drawer Side Wood & Dovetail Joints (visible when pulled open!) */}
                    <div className="drawer-wood-side left-side">
                      <div className="dovetail-joint"></div>
                      <div className="dovetail-joint"></div>
                    </div>

                    {/* Drawer Front Wooden Face */}
                    <div className="drawer-front-face">
                      {/* Brass Number Plate */}
                      <div className="brass-number-plate">
                        <span className="plate-rivet left">●</span>
                        <span className="plate-text">מגירה {idx + 1}</span>
                        <span className="plate-rivet right">●</span>
                      </div>

                      {/* Solid Brass Pull Handle */}
                      <div 
                        className="brass-pull-handle"
                        title={isPulled ? "לחץ לדחיפת המגירה פנימה" : "לחץ למשיכת המגירה החוצה"}
                      >
                        <div className="handle-mount top"></div>
                        <div className="handle-ring"></div>
                        <div className="handle-mount bottom"></div>
                      </div>

                      {/* Brass Keyhole */}
                      <div className="brass-keyhole-socket" title={`מנעול אסוציאציה: "${associationWord || 'בלוע'}"`}>
                        <div className="keyhole-slot"></div>
                      </div>

                      {/* Tactile Reordering Arrows ("מזיזים מגירות") */}
                      <div className="drawer-reorder-controls" onClick={e => e.stopPropagation()}>
                        <button
                          type="button"
                          className="drawer-reorder-btn"
                          disabled={idx === 0}
                          onClick={(e) => handleMoveDrawer(idx, -1, e)}
                          title="הזז מגירה זו שלב אחד למעלה"
                        >
                          <ChevronUp size={15} />
                        </button>
                        <button
                          type="button"
                          className="drawer-reorder-btn"
                          disabled={idx === drawerItems.length - 1}
                          onClick={(e) => handleMoveDrawer(idx, 1, e)}
                          title="הזז מגירה זו שלב אחד למטה"
                        >
                          <ChevronDown size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Inner Velvet Lining / Secret Compartment Revealed Upon Pulling */}
                    <div className="drawer-inner-compartment">
                      <div className="velvet-tray">
                        <div className="velvet-texture-overlay"></div>
                        <div className="secret-item-card animate-fade-in">
                          <span className="secret-item-badge">פריט שמור במגירה:</span>
                          <strong className="secret-item-word">{item.text}</strong>
                          <span className="secret-item-rank">דרגה #{idx + 1}</span>
                        </div>
                      </div>
                    </div>

                    {/* Drawer Side Wood Right */}
                    <div className="drawer-wood-side right-side">
                      <div className="dovetail-joint"></div>
                      <div className="dovetail-joint"></div>
                    </div>
                  </div>
                </div>

                {/* Subtle Drawer Interactive Status Pill */}
                <div className="drawer-status-cue" onClick={() => toggleDrawer(idx)}>
                  {isPulled ? (
                    <span className="cue-badge open">
                      <Unlock size={11} />
                      מגירה פתוחה (לחץ לסגירה)
                    </span>
                  ) : (
                    <span className="cue-badge closed">
                      <Lock size={11} />
                      משוך מגירה לחשיפה 👁️
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Brass Reinforced Plinth */}
        <div className="cabinet-bottom-plinth">
          <div className="plinth-brass-trim"></div>
          <span className="plinth-maker-seal">
            🏛️ ארמון הזיכרון • שיטת המפתחות והאסוציאציות
          </span>
        </div>
      </div>
    </div>
  );
}
