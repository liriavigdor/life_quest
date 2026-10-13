import React, { useState } from 'react';
import { BUILDINGS_META, CATEGORIES } from '../data/gameData';
import { X, ArrowUpCircle, CheckCircle, Plus, Sparkles, Coins, Flame } from 'lucide-react';
import { sounds } from '../utils/sound';

export function BuildingModal({
  buildingId,
  buildingData,
  resources,
  quests,
  onClose,
  onUpgrade,
  onToggleQuest,
  onAddQuest
}) {
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const meta = BUILDINGS_META[buildingId];
  if (!meta) return null;

  const category = CATEGORIES[meta.category];
  const level = buildingData?.level || 1;
  const isMaxLevel = level >= meta.maxLevel;

  // Upgrade cost formula
  const upgradeCostGold = Math.floor(meta.baseCost.gold * Math.pow(meta.costMultiplier, level - 1));
  const canAfford = resources.gold >= upgradeCostGold && !isMaxLevel;

  // Filter quests belonging to this building's category
  const buildingQuests = quests.filter((q) => q.category === meta.category);

  const handleAddCustomQuest = (e) => {
    e.preventDefault();
    if (!newQuestTitle.trim()) return;
    onAddQuest({
      title: newQuestTitle.trim(),
      category: meta.category,
      goldReward: 30 + level * 5,
      xpReward: 40 + level * 5,
      frequency: 'daily'
    });
    setNewQuestTitle('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: `2px solid ${category.color}` }}>
          <div className="modal-header-left">
            <span className="modal-cat-badge" style={{ backgroundColor: category.color }}>
              {category.name}
            </span>
            <h2 className="modal-title">{meta.name}</h2>
            <span className="badge-level">רמה {level} / {meta.maxLevel}</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <p className="building-desc">{meta.description}</p>

          {/* Upgrade Banner */}
          <div className="upgrade-box">
            <div className="upgrade-info">
              <div className="upgrade-title">
                <ArrowUpCircle size={22} className="upgrade-icon" />
                <span>שדרוג לרמה {level + 1}</span>
              </div>
              <p className="upgrade-sub">
                מעלה את בונוס המשאבים של המשימות ומפתח את מראה המבנה!
              </p>
            </div>

            <div className="upgrade-action">
              {!isMaxLevel ? (
                <button
                  className={`game-btn ${canAfford ? 'game-btn-gold' : 'game-btn-disabled'}`}
                  disabled={!canAfford}
                  onClick={() => {
                    sounds.playClick();
                    onUpgrade(buildingId, upgradeCostGold);
                  }}
                >
                  <Coins size={18} />
                  <span>שדרג ב-{upgradeCostGold} זהב</span>
                </button>
              ) : (
                <div className="max-level-pill">רמה מקסימלית! ⭐</div>
              )}
            </div>
          </div>

          {/* Related Quests Section */}
          <div className="building-quests-section">
            <div className="section-head">
              <h3>משימות ויעדים בתחום זה ({buildingQuests.length})</h3>
            </div>

            {/* Quests List */}
            <div className="quests-stack">
              {buildingQuests.length === 0 ? (
                <div className="empty-quests-box">
                  אין כרגע משימות בתחום זה. הוסף יעד ראשון למטה!
                </div>
              ) : (
                buildingQuests.map((quest) => (
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
                      <span className="quest-title">{quest.title}</span>
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
                ))
              )}
            </div>

            {/* Add New Quest Form */}
            <form onSubmit={handleAddCustomQuest} className="add-quest-form">
              <input
                type="text"
                placeholder={`הוסף משימה או יעד חדש ב${category.name}...`}
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                className="add-quest-input"
              />
              <button type="submit" className="game-btn game-btn-primary add-quest-btn">
                <Plus size={18} />
                <span>הוסף</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
