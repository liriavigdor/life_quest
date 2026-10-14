import React, { useState, useEffect } from 'react';
import { 
  X, 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  Sparkles, 
  DoorOpen, 
  Flame, 
  Sun, 
  Heart,
  Feather,
  BookOpen,
  Wheat,
  Leaf
} from 'lucide-react';
import { sounds } from '../utils/sound';

export function BuildingInteriorModal({
  building,
  catalogItem,
  onClose,
  onUpdateBuildingData,
  animals = [],
  onUpdateAnimal,
  onAddAnimalToBuilding
}) {
  if (!building) return null;

  // Persistent storage key for this specific building's interior data
  const storageKey = `lifequest_interior_${building.gx}_${building.gy}_${building.type}`;

  // Default interior template based on building type
  const getInitialInterior = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    // Context-sensitive defaults for different buildings
    if (building.type === 'animal_coop' || building.type.includes('coop')) {
      return {
        roomTitle: 'פנים לול התרנגולות ומכלאת הבוקר',
        roomNote: 'מרחב חמים של קש ורוגע — מקום לעוגני בוקר או פריטי שגרה אישיים',
        items: [
          { id: '1', name: 'דסקית', completed: false, icon: '🐔' },
          { id: '2', name: 'חוגר', completed: false, icon: '🐔' },
          { id: '3', name: 'ארנק', completed: false, icon: '🐔' },
          { id: '4', name: 'טלפון', completed: false, icon: '🐔' }
        ]
      };
    } else if (building.type === 'greenhouse' || building.type === 'veggie_garden') {
      return {
        roomTitle: 'חממת זכוכית ובוטניקה שקטה',
        roomNote: 'אדניות עץ וצמחי תבלין — עוגנים של רעיונות והרגלים בצמיחה',
        items: [
          { id: '1', name: 'שתיית 2 ליטר מים ביום', completed: false, icon: '🌱' },
          { id: '2', name: 'מתיחות ונשימה בבוקר', completed: false, icon: '🌿' }
        ]
      };
    } else if (building.type === 'wooden_cabin' || building.type === 'art_studio') {
      return {
        roomTitle: 'בקתת היצירה והאח המבוערת',
        roomNote: 'מרחב אישי לשקט, כתיבה, מחשבות ורעיונות מהלב',
        items: [
          { id: '1', name: 'זמן קריאה שקט בערב', completed: false, icon: '📖' },
          { id: '2', name: 'התקדמות בפרויקט אישי', completed: false, icon: '✨' }
        ]
      };
    } else if (building.type === 'library') {
      return {
        roomTitle: 'ספריית מחשבה וידע',
        roomNote: 'כונניות ספרים מעץ ארז — סידור רעיונות ותובנות אישיות',
        items: [
          { id: '1', name: 'לסכם פרק מעניין', completed: false, icon: '📚' }
        ]
      };
    } else if (building.type === 'farm' || building.type === 'bakery') {
      return {
        roomTitle: building.type === 'bakery' ? 'מאפיית הבוקר והמטבח הכפרי' : 'אסם התבואה והחווה',
        roomNote: 'חום, הזנה וציוד ביתי — מקום לארגן את מה שמזין ומשמח אותך',
        items: [
          { id: '1', name: 'ארוחת בוקר מזינה', completed: false, icon: '🥖' }
        ]
      };
    }

    return {
      roomTitle: building.customName || catalogItem?.name || 'מרחב פנים אישי',
      roomNote: 'עוגן מרחבי אישי — סדר כאן את המחשבות והפריטים שלך בחופשיות',
      items: []
    };
  };

  const [interiorData, setInteriorData] = useState(getInitialInterior);
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editTitle, setEditTitle] = useState(interiorData.roomTitle);
  const [editNote, setEditNote] = useState(interiorData.roomNote);
  const [newItemName, setNewItemName] = useState('');

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(interiorData));
    } catch (e) {
      console.error(e);
    }
  }, [interiorData, storageKey]);

  // Animals attached to this building (e.g. Chickens living in the coop)
  const attachedAnimals = animals.filter(a => 
    a.attachedBuilding && 
    a.attachedBuilding.gx === building.gx && 
    a.attachedBuilding.gy === building.gy
  );

  const handleToggleItem = (id) => {
    sounds.playTap();
    setInteriorData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    }));
  };

  const handleAddItem = (e) => {
    e?.preventDefault();
    if (!newItemName.trim()) return;
    sounds.playTap();
    const isCoop = building.type === 'animal_coop' || building.type.includes('coop');
    const newItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      completed: false,
      icon: isCoop ? '🐔' : '🌿'
    };
    setInteriorData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));

    // If it's a coop, also spawn an actual wandering chicken outside with this name!
    if (isCoop && onAddAnimalToBuilding) {
      onAddAnimalToBuilding('chicken', building.gx, building.gy, newItemName.trim());
    }

    setNewItemName('');
  };

  const handleRemoveItem = (id) => {
    sounds.playTap();
    setInteriorData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleSaveHeader = () => {
    sounds.playTap();
    setInteriorData(prev => ({
      ...prev,
      roomTitle: editTitle.trim() || prev.roomTitle,
      roomNote: editNote.trim() || prev.roomNote
    }));
    setIsEditingHeader(false);
  };

  // Determine interior atmosphere theme
  const isCoop = building.type === 'animal_coop' || building.type.includes('coop');
  const isGreenhouse = building.type === 'greenhouse' || building.type === 'veggie_garden';
  const isCabin = building.type === 'wooden_cabin' || building.type === 'art_studio';
  const isLibrary = building.type === 'library';

  return (
    <div className="interior-modal-overlay" onClick={onClose}>
      <div 
        className={`interior-room-stage glass-card ${isCoop ? 'theme-coop' : isGreenhouse ? 'theme-greenhouse' : isCabin ? 'theme-cabin' : isLibrary ? 'theme-library' : 'theme-default'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar */}
        <div className="interior-top-bar">
          <div className="interior-building-badge">
            <span className="building-emoji">{catalogItem?.emoji || '🏡'}</span>
            <span className="building-parent-name">{catalogItem?.name || 'מבנה כפר'}</span>
          </div>

          <button 
            className="interior-exit-btn"
            onClick={onClose}
            title="צא חזרה אל חצר הכפר (Esc)"
          >
            <DoorOpen size={17} />
            <span>יציאה אל הכפר 🍃</span>
          </button>
        </div>

        {/* Room Header & Atmospheric Title */}
        <div className="interior-header-section">
          {isEditingHeader ? (
            <div className="interior-edit-header-box">
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="שם החלל / מטרת החדר..."
                className="interior-input-title"
                autoFocus
              />
              <textarea 
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                rows={2}
                placeholder="תיאור האסוציאציה או השגרה של החדר הזה..."
                className="interior-input-note"
              />
              <div className="interior-edit-actions">
                <button className="interior-save-btn" onClick={handleSaveHeader}>
                  <Check size={14} />
                  <span>שמור הגדרות</span>
                </button>
                <button className="interior-cancel-btn" onClick={() => setIsEditingHeader(false)}>
                  ביטול
                </button>
              </div>
            </div>
          ) : (
            <div className="interior-title-display">
              <div className="title-row">
                <h2 className="interior-room-title">{interiorData.roomTitle}</h2>
                <button 
                  className="interior-edit-toggle-btn"
                  onClick={() => {
                    setEditTitle(interiorData.roomTitle);
                    setEditNote(interiorData.roomNote);
                    setIsEditingHeader(true);
                  }}
                  title="ערוך את שם ותיאור החלל הזה"
                >
                  <Edit3 size={14} />
                  <span>התאמה אישית</span>
                </button>
              </div>
              <p className="interior-room-note">{interiorData.roomNote}</p>
            </div>
          )}
        </div>

        {/* Visual Atmospheric Stage (The Interior Scenery) */}
        <div className="interior-scenery-view">
          {isCoop && (
            <div className="scenery-coop-backdrop">
              <div className="straw-bedding">
                <div className="straw-tuft tuft-1">🌾</div>
                <div className="straw-tuft tuft-2">🌾</div>
                <div className="straw-tuft tuft-3">🌾</div>
              </div>
              <div className="nest-boxes-row">
                <div className="nest-box">
                  <span className="nest-label">תא הטלה 1</span>
                  <span className="nest-straw">🪹 🥚</span>
                </div>
                <div className="nest-box">
                  <span className="nest-label">תא הטלה 2</span>
                  <span className="nest-straw">🪹 🥚</span>
                </div>
                <div className="nest-box">
                  <span className="nest-label">תא הטלה 3</span>
                  <span className="nest-straw">🪹 🥚</span>
                </div>
              </div>
              <div className="warm-sunbeam"></div>
            </div>
          )}

          {isGreenhouse && (
            <div className="scenery-greenhouse-backdrop">
              <div className="glass-panes"></div>
              <div className="plant-benches">
                <span className="bench-plant">🪴</span>
                <span className="bench-plant">🌿</span>
                <span className="bench-plant">🌱</span>
                <span className="bench-plant">🌺</span>
              </div>
            </div>
          )}

          {isCabin && (
            <div className="scenery-cabin-backdrop">
              <div className="fireplace-glow">
                <Flame size={28} className="flame-icon animate-pulse text-amber-500" />
                <span className="fire-hearth">אח מבוערת ונעימה 🔥</span>
              </div>
              <div className="cozy-rug">🪵 שטיח עץ ופינת קריאה</div>
            </div>
          )}

          {isLibrary && (
            <div className="scenery-library-backdrop">
              <div className="bookshelves-row">
                <span className="book-shelf">📚 📖 📜 📚 📖</span>
              </div>
            </div>
          )}
        </div>

        {/* Associative Items / Loci Checklist Container */}
        <div className="interior-items-container">
          <div className="items-header">
            <div className="items-title-wrap">
              <Sparkles size={16} className="text-amber" />
              <h3>עוגנים ופריטים בחדר זה ({interiorData.items.filter(i => i.completed).length}/{interiorData.items.length})</h3>
            </div>
            <span className="items-hint">לחץ על פריט כדי לסמן שהושלם / נמצא עליך</span>
          </div>

          {/* Items List */}
          <div className="interior-items-grid">
            {interiorData.items.map((item) => (
              <div 
                key={item.id} 
                className={`interior-item-card ${item.completed ? 'completed' : ''}`}
                onClick={() => handleToggleItem(item.id)}
              >
                <div className="item-check-circle">
                  {item.completed && <Check size={14} className="check-mark" />}
                </div>

                <div className="item-icon-tag">{item.icon}</div>

                <span className="item-name-text">{item.name}</span>

                <button 
                  className="item-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveItem(item.id);
                  }}
                  title="מחק עוגן זה"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}

            {interiorData.items.length === 0 && (
              <div className="empty-room-state">
                <Feather size={28} className="text-amber opacity-60" />
                <p>החלל הזה פתוח לחלוטין. הוסף למטה את הדבר הראשון שתרצה לעגן כאן!</p>
              </div>
            )}
          </div>

          {/* Add New Associative Item Form */}
          <form className="interior-add-item-form" onSubmit={handleAddItem}>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={isCoop ? "שם פריט או תרנגולת (למשל: דסקית, חוגר, ארנק)..." : "הוסף עוגן חדש לחדר זה..."}
              className="interior-new-item-input"
            />
            <button type="submit" className="interior-add-submit-btn" disabled={!newItemName.trim()}>
              <Plus size={16} />
              <span>הוסף עוגן 🌾</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
