import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Heart, 
  Sparkles, 
  Wheat, 
  Feather, 
  Check, 
  Plus, 
  Trash2, 
  Sun, 
  RefreshCw, 
  Smile, 
  X,
  Volume2,
  Flame
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { CoopArchitectureSVG } from './stardewArt/CoopArchitecture';

export function RealCoopInterior({
  building,
  interiorData,
  onUpdateInteriorData,
  onAddAnimalToVillage,
  onEarnSeeds
}) {
  // --- Persistent Coop Game State ---
  const coopStorageKey = `lifequest_coop_game_${building?.gx}_${building?.gy}`;
  
  const [coopState, setCoopState] = useState(() => {
    try {
      const saved = localStorage.getItem(coopStorageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      cleanliness: 100, // 0 - 100
      eggsInBasket: 3,
      nests: [
        { id: 1, hasEgg: true, isGolden: false, henInside: null },
        { id: 2, hasEgg: true, isGolden: false, henInside: null },
        { id: 3, hasEgg: false, isGolden: false, henInside: null },
        { id: 4, hasEgg: true, isGolden: true, henInside: null }
      ],
      waterLevel: 90,
      grainsOnFloor: 8,
      lastFedTime: Date.now()
    };
  });

  // Save coop state
  useEffect(() => {
    try {
      localStorage.setItem(coopStorageKey, JSON.stringify(coopState));
    } catch (e) {
      console.error(e);
    }
  }, [coopState, coopStorageKey]);

  // Active floating speech bubble or notification
  const [toastMessage, setToastMessage] = useState('');
  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(''), 3200);
  };

  // Grain seeds scattered on the floor
  const [scatteredGrains, setScatteredGrains] = useState(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 25 + Math.random() * 50,
      y: 45 + Math.random() * 40
    }))
  );

  // Floating celebration hearts
  const [floatingParticles, setFloatingParticles] = useState([]);
  const spawnParticle = (x, y, emoji) => {
    const pId = Date.now() + Math.random();
    setFloatingParticles(prev => [...prev, { id: pId, x, y, emoji }]);
    setTimeout(() => {
      setFloatingParticles(prev => prev.filter(p => p.id !== pId));
    }, 1200);
  };

  // --- Living Chickens inside the Coop ---
  // Each morning anchor item in interiorData represents a proud, living chicken in this coop!
  const defaultAnchors = [
    { id: '1', name: 'דסקית', completed: true, icon: '🐔' },
    { id: '2', name: 'חוגר', completed: true, icon: '🐔' },
    { id: '3', name: 'ארנק', completed: false, icon: '🐔' },
    { id: '4', name: 'טלפון', completed: false, icon: '🐔' }
  ];

  const items = interiorData?.items?.length > 0 ? interiorData.items : defaultAnchors;

  // Chickens physical simulation state
  const [chickens, setChickens] = useState(() => 
    items.map((item, idx) => ({
      id: item.id,
      name: item.name,
      completed: item.completed,
      x: 20 + (idx * 18) % 65 + (Math.random() * 8),
      y: 50 + (idx * 12) % 35 + (Math.random() * 10),
      targetX: 20 + (idx * 18) % 65,
      targetY: 50 + (idx * 12) % 35,
      facingLeft: Math.random() > 0.5,
      hopY: 0,
      state: 'idle', // 'idle' | 'walking' | 'pecking' | 'perching'
      walkCycle: 0,
      happiness: 85,
      bubble: null,
      isBaby: false
    }))
  );

  // Sync chickens when items change
  useEffect(() => {
    setChickens(prev => {
      return items.map((item, idx) => {
        const existing = prev.find(c => c.id === item.id);
        if (existing) {
          return { ...existing, name: item.name, completed: item.completed };
        }
        return {
          id: item.id,
          name: item.name,
          completed: item.completed,
          x: 25 + (idx * 15) % 55,
          y: 55 + (idx * 10) % 30,
          targetX: 25 + (idx * 15) % 55,
          targetY: 55 + (idx * 10) % 30,
          facingLeft: Math.random() > 0.5,
          hopY: 0,
          state: 'idle',
          walkCycle: 0,
          happiness: 90,
          bubble: null,
          isBaby: false
        };
      });
    });
  }, [items]);

  // Main simulation tick for indoor chickens
  useEffect(() => {
    const interval = setInterval(() => {
      setChickens(prev => prev.map(c => {
        let { x, y, targetX, targetY, hopY, walkCycle, facingLeft, state, happiness, bubble } = c;

        // Decrease bubble timer
        if (bubble) {
          bubble = { ...bubble, timer: bubble.timer - 1 };
          if (bubble.timer <= 0) bubble = null;
        }

        // Move towards target
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);

        if (dist > 1.5) {
          state = 'walking';
          const speed = 0.65;
          x += (dx / dist) * speed;
          y += (dy / dist) * (speed * 0.6); // isometric/perspective ratio
          facingLeft = dx < 0;
          walkCycle = (walkCycle + 0.35) % (Math.PI * 2);
          hopY = -Math.abs(Math.sin(walkCycle)) * 3;
        } else {
          hopY = 0;
          // When at destination, decide next action
          if (Math.random() < 0.08) {
            state = Math.random() < 0.4 ? 'pecking' : 'idle';
          }

          // Pick new random wander target within the coop straw floor
          if (Math.random() < 0.04) {
            targetX = 18 + Math.random() * 64; // % width
            targetY = 48 + Math.random() * 38; // % height
          }
        }

        return {
          ...c,
          x,
          y,
          targetX,
          targetY,
          hopY,
          walkCycle,
          facingLeft,
          state,
          bubble
        };
      }));
    }, 60);

    return () => clearInterval(interval);
  }, []);

  // --- Interaction 1: Pet Chicken ---
  const handlePetChicken = (chicken, e) => {
    e.stopPropagation();
    sounds.playChickenPet();
    sounds.playCluck();

    // Trigger visual celebration
    spawnParticle(chicken.x, chicken.y - 8, '❤️');
    spawnParticle(chicken.x + 4, chicken.y - 12, '✨');

    const quotes = [
      `בּוֹק בּוֹק! ${chicken.name} שמחה ומגרגרת בנחת! 🐔❤️`,
      `${chicken.name} ערוכה ושומרת עליך, שיהיה לך יום מדהים! ✨`,
      `איזה כיף ללטף! הנוצות חמימות והקש נעים כל כך 🌾`,
      `בּוֹק בּוֹק! רגע של שקט וטוב פה בלול 💛`
    ];
    const speech = quotes[Math.floor(Math.random() * quotes.length)];

    setChickens(prev => prev.map(c => {
      if (c.id === chicken.id) {
        return {
          ...c,
          hopY: -10,
          happiness: 100,
          bubble: { text: speech, timer: 70 }
        };
      }
      return c;
    }));

    showToast(speech);
  };

  // --- Interaction 2: Scatter Grain on Straw Floor ---
  const handleScatterGrain = () => {
    sounds.playScatterSeeds();
    sounds.playCluck();

    // Spawn 10 fresh grain particles
    const newGrains = Array.from({ length: 10 }, (_, i) => ({
      id: Date.now() + i,
      x: 22 + Math.random() * 56,
      y: 50 + Math.random() * 34
    }));
    setScatteredGrains(newGrains);

    // All chickens rush excitedly towards the grain!
    setChickens(prev => prev.map((c, idx) => {
      const g = newGrains[idx % newGrains.length];
      return {
        ...c,
        targetX: g.x + (Math.random() - 0.5) * 4,
        targetY: g.y + (Math.random() - 0.5) * 3,
        happiness: 100,
        bubble: { text: 'גרגרים טעימים! בּוֹק בּוֹק! 🌾', timer: 50 }
      };
    }));

    setCoopState(prev => ({
      ...prev,
      grainsOnFloor: prev.grainsOnFloor + 10,
      cleanliness: Math.max(30, prev.cleanliness - 5)
    }));

    showToast('🌾 פיזרת תערובת גרעינים ודוחן! התרנגולות רצות לכרסם בנחת!');
  };

  // --- Interaction 3: Fluff & Clean Fresh Straw Bedding ---
  const handleCleanCoop = () => {
    sounds.playCultivate();
    sounds.playCluck();

    setCoopState(prev => ({
      ...prev,
      cleanliness: 100
    }));

    // Chickens jump with music notes
    chickens.forEach(c => {
      spawnParticle(c.x, c.y - 6, '🎵');
    });

    setChickens(prev => prev.map(c => ({
      ...c,
      hopY: -8,
      bubble: { text: 'קש חדש ורך! איזה ריח נקי ונעים! ✨', timer: 60 }
    })));

    showToast('🧹 רעננת מצע קש מוזהב ורך! הלול נקי והתרנגולות צוהלות!');
  };

  // --- Interaction 4: Collect Egg from Nest Box ---
  const handleCollectEgg = (nest) => {
    if (!nest.hasEgg) return;
    sounds.playEggCollect();

    const isGolden = nest.isGolden;
    const seedsWon = isGolden ? 15 : 5;
    
    // Spawn sparkle effect
    spawnParticle(22 + (nest.id * 15), 32, isGolden ? '🌟' : '🥚');

    setCoopState(prev => ({
      ...prev,
      eggsInBasket: prev.eggsInBasket + 1,
      nests: prev.nests.map(n => n.id === nest.id ? { ...n, hasEgg: false, isGolden: false } : n)
    }));

    if (onEarnSeeds) {
      onEarnSeeds(seedsWon);
    }

    showToast(isGolden ? `🌟 ביצת זהב נדירה נאספה! קיבלת +${seedsWon} זרעים!` : `🥚 אספת ביצת בוקר טרייה! (+${seedsWon} זרעים)`);
  };

  // --- Interaction 5: Hatch New Baby Chick in Incubator ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAnchorName, setNewAnchorName] = useState('');

  const handleHatchNewChick = (e) => {
    e?.preventDefault();
    if (!newAnchorName.trim()) return;

    sounds.playBabyChirp();
    sounds.playPlant();

    const chickName = newAnchorName.trim();
    const newId = Date.now().toString();

    // Add to interior items / anchors
    const updatedItems = [...items, { id: newId, name: chickName, completed: false, icon: '🐔' }];
    if (onUpdateInteriorData) {
      onUpdateInteriorData({
        ...interiorData,
        items: updatedItems
      });
    }

    // Also add to autonomous village animals outside if handler available
    if (onAddAnimalToVillage) {
      onAddAnimalToVillage('chicken', building.gx, building.gy, chickName);
    }

    // Spawn tiny baby chick inside the coop!
    setChickens(prev => [
      ...prev,
      {
        id: newId,
        name: chickName,
        completed: false,
        x: 75,
        y: 62,
        targetX: 50,
        targetY: 65,
        facingLeft: true,
        hopY: -12,
        state: 'walking',
        walkCycle: 0,
        happiness: 100,
        bubble: { text: `ציוץ! שלום, אני ${chickName}! 🐣`, timer: 90 },
        isBaby: true
      }
    ]);

    spawnParticle(75, 55, '🐣');
    spawnParticle(78, 50, '✨');

    setNewAnchorName('');
    setShowAddModal(false);
    showToast(`🐣 אפרוח חדש בקע בלול ושמו "${chickName}"!`);
  };

  // Toggle item check on the Morning Pegboard
  const handleTogglePegboardItem = (id) => {
    sounds.playTap();
    const updated = items.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    if (onUpdateInteriorData) {
      onUpdateInteriorData({
        ...interiorData,
        items: updated
      });
    }

    const clicked = updated.find(i => i.id === id);
    if (clicked?.completed) {
      sounds.playCluck();
      // Associated chicken does a happy jump!
      setChickens(prev => prev.map(c => {
        if (c.id === id) {
          spawnParticle(c.x, c.y - 10, '✓');
          return {
            ...c,
            hopY: -12,
            bubble: { text: `מעולה! "${c.name}" איתך ומוכן ליום! 🌟`, timer: 65 }
          };
        }
        return c;
      }));
    }
  };

  // Remove item
  const handleRemoveItem = (id) => {
    sounds.playTap();
    const updated = items.filter(i => i.id !== id);
    if (onUpdateInteriorData) {
      onUpdateInteriorData({
        ...interiorData,
        items: updated
      });
    }
  };

  const [showPegboardDrawer, setShowPegboardDrawer] = useState(false);

  return (
    <div className="real-coop-container">
      {/* 1. Atmospheric Coop Header & Stats Bar */}
      <div className="coop-top-hud">
        <div className="coop-badge-group">
          <span className="coop-hen-emoji">🐔</span>
          <div>
            <h2 className="coop-title">לול התרנגולות הכפרי</h2>
            <span className="coop-sub">מרחב חמים של קש מוזהב, הטלה ועוגני בוקר</span>
          </div>
        </div>

        {/* Live Coop Stats */}
        <div className="coop-stats-pills">
          <div className="coop-stat-pill" title="ביצים טריות שנאספו היום">
            <span className="stat-emoji">🧺</span>
            <span className="stat-label">סלסלה:</span>
            <strong>{coopState.eggsInBasket} 🥚</strong>
          </div>

          <div className="coop-stat-pill" title="תרנגולות חיות בלול">
            <span className="stat-emoji">🐔</span>
            <span className="stat-label">להקה:</span>
            <strong>{chickens.length}</strong>
          </div>

          <div className="coop-stat-pill" title="רמת ניקיון הקש">
            <span className="stat-emoji">🧹</span>
            <span className="stat-label">קש:</span>
            <strong className={coopState.cleanliness > 60 ? 'text-emerald' : 'text-amber'}>
              {coopState.cleanliness}%
            </strong>
          </div>

          <button 
            className={`coop-pegboard-toggle-btn ${showPegboardDrawer ? 'active' : ''}`}
            onClick={() => {
              sounds.playTap();
              setShowPegboardDrawer(!showPegboardDrawer);
            }}
            title="פתח את לוח עוגני הבוקר (דסקית, חוגר, ארנק...)"
          >
            <span>לוח עוגנים 🪪</span>
            <span className="pegboard-badge">
              {items.filter(i => i.completed).length}/{items.length}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Floating Notification Toast */}
      {toastMessage && (
        <div className="coop-toast-banner animate-bounce-gentle">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 3. The Playable Interactive Coop Stage */}
      <div className="coop-stage-wrapper">
        {/* Handcrafted Architectural Multi-Zone SVG Backdrop with Volumetric Dividers & Cast Shadows */}
        <CoopArchitectureSVG />

        {/* Sunbeam pouring through window */}
        <div className="coop-sunbeam-effect"></div>

        {/* Floating dust motes & feathers */}
        <div className="coop-floating-feathers">
          <span className="floating-feather f1">🪶</span>
          <span className="floating-feather f2">✨</span>
          <span className="floating-feather f3">🌾</span>
        </div>

        {/* Timber back wall decorations */}
        <div className="coop-back-wall">
          <div className="timber-rafter-beam"></div>
          <div className="coop-wall-lantern left">🏮</div>
          <div className="coop-window-pane">
            <div className="window-glow"></div>
            <Sun size={24} className="window-sun-icon text-amber" />
          </div>
          <div className="coop-wall-lantern right">🏮</div>
          <div className="hanging-herbs">🌽 🧄 🌾</div>
        </div>

        {/* High Roosting Perch (מוט לינה מעץ) */}
        <div className="coop-roost-branch" title="מוט עץ ללינה ומנוחה">
          <div className="roost-wood-bar"></div>
          <div className="roost-nap-chickens">
            <span className="roost-hen" title="תרנגולת ישנה בשלווה">🐔 <small className="zzz-bubble">💤</small></span>
          </div>
        </div>

        {/* Row of 4 Wooden Nesting Boxes (תאי הטלה מעץ) */}
        <div className="coop-nests-complex">
          {coopState.nests.map((nest) => (
            <div 
              key={nest.id} 
              className={`coop-nest-box ${nest.hasEgg ? 'has-egg' : 'empty-nest'}`}
              onClick={() => handleCollectEgg(nest)}
              title={nest.hasEgg ? (nest.isGolden ? "ביצת זהב נדירה! לחץ לאיסוף 🌟🥚" : "ביצת בוקר טרייה! לחץ לאיסוף 🥚") : "תא הטלה מרופד בקש מוזהב 🪹"}
            >
              <div className="nest-roof"></div>
              <div className="nest-straw-bed">
                <span className="nest-straw-icon">🪹</span>
                {nest.hasEgg && (
                  <span className={`nest-egg-item ${nest.isGolden ? 'golden-egg' : 'regular-egg'}`}>
                    {nest.isGolden ? '🌟🥚' : '🥚'}
                  </span>
                )}
              </div>
              <span className="nest-number-tag">תא {nest.id}</span>
            </div>
          ))}

          {/* Warm Chick Incubator Corner */}
          <div 
            className="coop-incubator-nest" 
            onClick={() => setShowAddModal(true)}
            title="מדגרה חמימה — לחץ להדגרת אפרוח חדש 🐣"
          >
            <div className="heat-lamp-glow">
              <Flame size={16} className="heat-lamp-icon text-amber" />
            </div>
            <span className="incubator-straw">🪹 💡</span>
            <span className="incubator-tag">+ אפרוח 🐣</span>
          </div>
        </div>

        {/* Golden Straw Floor (The Walkable Living Canvas) */}
        <div className="coop-straw-ground">
          {/* Scattered grain kernels on straw */}
          {scatteredGrains.map(g => (
            <span 
              key={g.id} 
              className="scattered-grain-kernel" 
              style={{ left: `${g.x}%`, top: `${g.y}%` }}
            >
              •
            </span>
          ))}

          {/* Straw tufts on ground */}
          <span className="straw-ground-tuft g1">🌾</span>
          <span className="straw-ground-tuft g2">🌾</span>
          <span className="straw-ground-tuft g3">🌾</span>
          <span className="straw-ground-tuft g4">🌾</span>

          {/* Living Interactive Chickens */}
          {chickens.map(chicken => (
            <div
              key={chicken.id}
              className={`indoor-chicken-sprite ${chicken.facingLeft ? 'facing-left' : 'facing-right'} ${chicken.isBaby ? 'baby-chick' : ''}`}
              style={{
                left: `${chicken.x}%`,
                top: `${chicken.y}%`,
                transform: `translate(-50%, calc(-100% + ${chicken.hopY}px)) ${chicken.facingLeft ? 'scaleX(-1)' : 'scaleX(1)'}`
              }}
              onClick={(e) => handlePetChicken(chicken, e)}
              title={`לחץ לליטוף תרנגולת ${chicken.name} ❤️`}
            >
              {/* Custom Name / Anchor Tag above chicken */}
              <div 
                className="chicken-name-pill"
                style={{ transform: chicken.facingLeft ? 'scaleX(-1)' : 'none' }}
              >
                <span className="pill-heart">❤️</span>
                <span className="pill-name">{chicken.name}</span>
                {chicken.completed && <span className="pill-check">✓</span>}
              </div>

              {/* Speech bubble */}
              {chicken.bubble && (
                <div 
                  className="chicken-speech-bubble"
                  style={{ transform: chicken.facingLeft ? 'scaleX(-1)' : 'none' }}
                >
                  {chicken.bubble.text}
                </div>
              )}

              {/* Chicken Sprite Body */}
              <div className="chicken-body-art">
                {chicken.isBaby ? (
                  <span className="chick-emoji">🐣</span>
                ) : (
                  <span className="hen-emoji">🐔</span>
                )}
              </div>

              {/* Shadow underneath */}
              <div className="chicken-shadow-oval"></div>
            </div>
          ))}

          {/* Floating Hearts & Particle animations */}
          {floatingParticles.map(p => (
            <div 
              key={p.id} 
              className="coop-floating-particle animate-float-fade"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {p.emoji}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rich Hands-On Coop Action Bar */}
      <div className="coop-bottom-actions-dock">
        <button 
          className="coop-action-btn feed-grain-btn"
          onClick={handleScatterGrain}
          title="פזר תערובת גרגרים ודוחן על הקש"
        >
          <Wheat size={18} className="text-amber" />
          <span>פזר גרגרים 🌾</span>
        </button>

        <button 
          className="coop-action-btn clean-straw-btn"
          onClick={handleCleanCoop}
          title="רענן ונקה את מצע הקש בלול"
        >
          <RefreshCw size={17} className="text-emerald" />
          <span>מצע קש רענן 🧹</span>
        </button>

        <button 
          className="coop-action-btn hatch-chick-btn"
          onClick={() => setShowAddModal(true)}
          title="הדגר אפרוח חדש ושייך לו עוגן בוקר"
        >
          <Plus size={18} className="text-rose" />
          <span>הדגרת אפרוח 🐣</span>
        </button>
      </div>

      {/* 5. Morning Routine & Personal Anchors Pegboard Drawer */}
      {showPegboardDrawer && (
        <div className="coop-pegboard-drawer glass-card">
          <div className="pegboard-header">
            <div className="pegboard-title-wrap">
              <span className="pegboard-icon">🪪</span>
              <div>
                <h3>מדף עוגני הבוקר וההרחבה האישית</h3>
                <span className="pegboard-sub">הפריטים והשגרות שהתרנגולות בלול מזכירות לך כל בוקר</span>
              </div>
            </div>
            <button 
              className="close-mini-btn"
              onClick={() => setShowPegboardDrawer(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Pegboard Items Grid */}
          <div className="pegboard-items-list">
            {items.map(item => (
              <div 
                key={item.id}
                className={`pegboard-peg-card ${item.completed ? 'equipped' : 'pending'}`}
                onClick={() => handleTogglePegboardItem(item.id)}
              >
                <div className={`peg-checkbox ${item.completed ? 'checked' : ''}`}>
                  {item.completed && <Check size={14} />}
                </div>

                <div className="peg-info">
                  <span className="peg-item-name">{item.name}</span>
                  <span className="peg-hen-status">
                    {item.completed ? 'מוכן אצלך ✓' : 'לחץ לסימון שלקחת 🐔'}
                  </span>
                </div>

                <button 
                  className="peg-remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  title="מחק עוגן"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Anchor Form */}
          <form className="pegboard-add-form" onSubmit={handleHatchNewChick}>
            <input 
              type="text"
              value={newAnchorName}
              onChange={(e) => setNewAnchorName(e.target.value)}
              placeholder="שם עוגן או תרנגולת (למשל: מפתחות, בקבוק מים)..."
              className="pegboard-input"
            />
            <button type="submit" className="pegboard-submit-btn" disabled={!newAnchorName.trim()}>
              <Plus size={15} />
              <span>הוסף עוגן ואפרוח 🐣</span>
            </button>
          </form>
        </div>
      )}

      {/* 6. Modal for Hatching / Adding New Chick */}
      {showAddModal && (
        <div className="hatch-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="hatch-modal-card glass-card" onClick={e => e.stopPropagation()}>
            <div className="hatch-modal-header">
              <span className="hatch-header-emoji">🐣</span>
              <h3>הדגרת אפרוח חדש בלול</h3>
            </div>
            <p className="hatch-modal-desc">
              איזה עוגן זיכרון, חפץ אישי או תזכורת בוקר תרצה שהאפרוח הזה ישמור עליה?
            </p>
            <form onSubmit={handleHatchNewChick}>
              <input 
                type="text"
                value={newAnchorName}
                onChange={(e) => setNewAnchorName(e.target.value)}
                placeholder="למשל: מפתחות רכב, תפילין, בקבוק מים..."
                className="hatch-name-input"
                autoFocus
              />
              <div className="hatch-modal-actions">
                <button type="button" className="hatch-cancel-btn" onClick={() => setShowAddModal(false)}>
                  ביטול
                </button>
                <button type="submit" className="hatch-confirm-btn" disabled={!newAnchorName.trim()}>
                  <Sparkles size={15} />
                  <span>הדגר עכשיו 🐣</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
