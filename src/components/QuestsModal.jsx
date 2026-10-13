import React, { useState } from 'react';
import { CATEGORIES } from '../data/gameData';
import { X, CheckCircle, Plus, Flame, Filter, Trophy, Target } from 'lucide-react';
import { sounds } from '../utils/sound';

export function QuestsModal({
  quests,
  onClose,
  onToggleQuest,
  onAddQuest
}) {
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('GENERAL');

  const filteredQuests = quests.filter((q) => {
    if (selectedFilter === 'ALL') return true;
    return q.category === selectedFilter;
  });

  const completedCount = quests.filter((q) => q.completed).length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddQuest({
      title: newTitle.trim(),
      category: newCategory,
      goldReward: 35,
      xpReward: 40,
      frequency: 'daily'
    });
    setNewTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card quests-modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-left">
            <Trophy size={26} className="text-gold" />
            <div>
              <h2 className="modal-title">יומן משימות ויעדים</h2>
              <span className="modal-subtitle">השלמת משימות מעניקה זהב ו-XP לשדרוג הכפר</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Overview Stats */}
        <div className="quests-summary-banner">
          <div className="summary-stat-box">
            <span className="summary-stat-num">{completedCount} / {quests.length}</span>
            <span className="summary-stat-label">הושלמו היום</span>
          </div>
          <div className="summary-progress-bar">
            <div 
              className="summary-progress-fill"
              style={{ width: `${quests.length > 0 ? (completedCount / quests.length) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="category-filters-row">
          <button
            className={`filter-pill ${selectedFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedFilter('ALL')}
          >
            הכל ({quests.length})
          </button>
          {Object.values(CATEGORIES).map((cat) => (
            <button
              key={cat.id}
              className={`filter-pill ${selectedFilter === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedFilter(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Quests Stack */}
        <div className="quests-modal-stack">
          {filteredQuests.length === 0 ? (
            <div className="empty-quests-box">אין משימות בקטגוריה זו.</div>
          ) : (
            filteredQuests.map((quest) => {
              const cat = CATEGORIES[quest.category] || CATEGORIES.GENERAL;
              return (
                <div
                  key={quest.id}
                  className={`quest-item-card ${quest.completed ? 'quest-done' : ''}`}
                  onClick={() => onToggleQuest(quest.id)}
                >
                  <div className="quest-checkbox-wrap">
                    <div className={`custom-checkbox ${quest.completed ? 'checked' : ''}`}>
                      {quest.completed && <CheckCircle size={18} />}
                    </div>
                  </div>
                  <div className="quest-details">
                    <div className="quest-title-row">
                      <span className="quest-title">{quest.title}</span>
                      <span 
                        className="cat-micro-badge" 
                        style={{ backgroundColor: `${cat.color}25`, color: cat.color, borderColor: cat.color }}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <div className="quest-meta-row">
                      <span className="reward-chip gold-chip">+{quest.goldReward} זהב</span>
                      <span className="reward-chip xp-chip">+{quest.xpReward} XP</span>
                      {quest.streak > 0 && (
                        <span className="streak-chip">
                          <Flame size={12} /> רצף {quest.streak} ימים
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add New Quest Bottom Form */}
        <form onSubmit={handleAdd} className="add-quest-full-form">
          <input
            type="text"
            placeholder="הוסף משימה או יעד אישי חדש..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="add-quest-input"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="category-select"
          >
            {Object.values(CATEGORIES).map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit" className="game-btn game-btn-primary">
            <Plus size={18} />
            <span>הוסף</span>
          </button>
        </form>
      </div>
    </div>
  );
}
