import React from 'react';
import { Sparkles, Coins, Gem } from 'lucide-react';
import { sounds } from '../utils/sound';

export function TopBar({ resources, onOpenQuests, onOpenStats, soundMuted, onToggleSound }) {
  // XP progress calculation towards next level
  const xpNeeded = resources.level * 100;
  const currentLevelXp = resources.xp % 100;
  const progressPercent = Math.min(100, Math.floor((currentLevelXp / 100) * 100));

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        {/* Profile & Level */}
        <div className="user-profile-badge" onClick={onOpenStats} title="פרופיל ושדרוגים">
          <div className="level-shield">
            <span className="level-number">{resources.level}</span>
          </div>
          <div className="profile-info">
            <div className="profile-title">
              <span>ראש הכפר</span>
              <span className="xp-text">{currentLevelXp}/100 XP</span>
            </div>
            <div className="xp-bar-track">
              <div 
                className="xp-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resources Center */}
      <div className="top-bar-center">
        <div className="resource-pill gold-pill" title="זהב (השגת משימות)">
          <div className="resource-icon-wrap gold-icon-wrap">
            <Coins size={18} className="resource-icon" />
          </div>
          <span className="resource-val">{resources.gold.toLocaleString()}</span>
        </div>

        <div className="resource-pill gems-pill" title="יהלומים (מטרות על והישגים)">
          <div className="resource-icon-wrap gem-icon-wrap">
            <Gem size={18} className="resource-icon" />
          </div>
          <span className="resource-val">{resources.gems.toLocaleString()}</span>
        </div>
      </div>

      {/* Quick Actions Right */}
      <div className="top-bar-right">
        <button 
          className="sound-toggle-btn" 
          onClick={onToggleSound} 
          title={soundMuted ? 'הפעל צלילים' : 'השתק צלילים'}
        >
          {soundMuted ? '🔇' : '🔊'}
        </button>

        <button 
          className="game-btn game-btn-gold quest-hud-btn" 
          onClick={() => {
            sounds.playClick();
            onOpenQuests();
          }}
        >
          <Sparkles size={18} />
          <span>משימות ויומן</span>
        </button>
      </div>
    </header>
  );
}
