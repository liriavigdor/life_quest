import React from 'react';
import { X, Award, Shield, Castle, Activity, BookOpen, Coins, Hammer, Sparkles } from 'lucide-react';
import { BUILDINGS_META, CATEGORIES } from '../data/gameData';

export function VillageStatsModal({ resources, buildings, quests, onClose }) {
  const completedQuests = quests.filter((q) => q.completed).length;
  const totalBuildingsLevels = Object.values(buildings).reduce((sum, b) => sum + (b.level || 1), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card glass-panel stats-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            <Award size={26} className="text-gold" />
            <div>
              <h2 className="modal-title">סטטיסטיקות הממלכה ופרופיל</h2>
              <span className="modal-subtitle">סקירת התקדמות החיים והתפתחות הכפר</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">רמת הכפר הכוללת</span>
            <span className="stat-value text-gold">רמה {resources.level}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">סך רמות כל המבנים</span>
            <span className="stat-value text-blue">{totalBuildingsLevels}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">משימות שהושלמו</span>
            <span className="stat-value text-green">{completedQuests}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">יהלומים נצברו</span>
            <span className="stat-value text-purple">{resources.gems} 💎</span>
          </div>
        </div>

        <div className="buildings-overview-list">
          <h3 className="section-subtitle">מצב מבני החיים:</h3>
          {Object.entries(BUILDINGS_META).map(([bKey, meta]) => {
            const bData = buildings[bKey] || { level: 1 };
            const cat = CATEGORIES[meta.category];
            return (
              <div key={bKey} className="building-stat-row">
                <div className="stat-row-left">
                  <div className="stat-cat-dot" style={{ backgroundColor: cat.color }}></div>
                  <span className="stat-b-name">{meta.name}</span>
                </div>
                <div className="stat-row-right">
                  <span className="stat-b-level">רמה {bData.level} / {meta.maxLevel}</span>
                  <div className="level-mini-bar">
                    <div 
                      className="level-mini-fill" 
                      style={{ 
                        width: `${(bData.level / meta.maxLevel) * 100}%`,
                        backgroundColor: cat.color
                      }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
