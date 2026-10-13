import React, { useState } from 'react';
import { VillagerPortrait } from './VillagerPortrait';
import { Sparkles, Shirt, Palette, ChevronLeft, ChevronRight, ZoomIn, Eye, X } from 'lucide-react';
import { OUTFITS } from '../data/wardrobe';

export const CharacterSideView = ({
  isOpen,
  onToggle,
  currentOutfit,
  villagerStatus,
  villagerLook,
  onOpenWardrobe,
  onOpenStyling
}) => {
  const [zoomLevel, setZoomLevel] = useState(4.5); // 3, 4.5, 6

  const outfitObj = OUTFITS.find(o => o.id === currentOutfit) || OUTFITS[0];

  if (!isOpen) {
    return (
      <button 
        className="character-side-pill-btn glass-card"
        onClick={onToggle}
        title="פתח מבט מקרוב על איש הכפר"
      >
        <span className="side-pill-emoji">{outfitObj.emoji}</span>
        <div className="side-pill-text-col">
          <span className="side-pill-title">מבט מקרוב</span>
          <span className="side-pill-sub">הדמות בגדול 🔍</span>
        </div>
        <Eye size={16} className="text-emerald" />
      </button>
    );
  }

  return (
    <aside className="character-side-panel glass-card">
      <div className="side-panel-header">
        <div className="side-panel-title-wrap">
          <span className="side-panel-avatar-emoji">{outfitObj.emoji}</span>
          <div>
            <h4 className="side-panel-title">מבט מקרוב על הדמות</h4>
            <span className="side-panel-sub">תצוגה מוגדלת וחיים בכפר</span>
          </div>
        </div>
        <button 
          className="side-panel-close-btn"
          onClick={onToggle}
          title="מזער תצוגה צדדית"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main Enlarged Canvas View */}
      <div className="side-portrait-container">
        <VillagerPortrait 
          outfit={currentOutfit}
          inWater={villagerStatus?.inWater}
          activity={villagerStatus?.activity}
          look={villagerLook}
          scale={zoomLevel}
          width={190}
          height={210}
        />

        {/* Floating Zoom Switcher */}
        <div className="zoom-switch-bar">
          <span className="zoom-label"><ZoomIn size={12} /> זום:</span>
          <button 
            className={`zoom-btn ${zoomLevel === 3 ? 'active' : ''}`}
            onClick={() => setZoomLevel(3)}
          >
            3x
          </button>
          <button 
            className={`zoom-btn ${zoomLevel === 4.5 ? 'active' : ''}`}
            onClick={() => setZoomLevel(4.5)}
          >
            4.5x
          </button>
          <button 
            className={`zoom-btn ${zoomLevel === 6 ? 'active' : ''}`}
            onClick={() => setZoomLevel(6)}
          >
            6x
          </button>
        </div>
      </div>

      {/* Villager Live Status */}
      <div className="side-villager-info">
        <div className="side-info-row">
          <span className="info-key">תלבושת:</span>
          <span className="info-val">{outfitObj.name} {villagerStatus?.inWater ? '(שוחה במים 🩱)' : ''}</span>
        </div>
        <div className="side-info-row">
          <span className="info-key">מצב נוכחי:</span>
          <span className="info-val text-emerald">{villagerStatus?.activityLabel || 'מטייל בנחת בכפר 🍃'}</span>
        </div>
        {villagerStatus?.fruitsEaten !== undefined && (
          <div className="side-info-row">
            <span className="info-key">פירות שנאכלו:</span>
            <span className="info-val text-rose">🍎 {villagerStatus.fruitsEaten}</span>
          </div>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="side-panel-actions">
        <button 
          className="side-action-btn styling-btn"
          onClick={onOpenStyling}
        >
          <Palette size={16} />
          <span>התאמת מראה וסטיילינג</span>
        </button>
        <button 
          className="side-action-btn wardrobe-btn"
          onClick={onOpenWardrobe}
        >
          <Shirt size={16} />
          <span>החלפת תלבושת</span>
        </button>
      </div>
    </aside>
  );
};
