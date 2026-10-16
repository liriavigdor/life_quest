import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Wifi, 
  Search, 
  Layers, 
  Check, 
  RefreshCw, 
  Feather, 
  Heart, 
  Image as ImageIcon,
  CloudRain,
  Mountain,
  Waves,
  Sun,
  Moon
} from 'lucide-react';
import { parseUserStory, searchOnlineIconAssets } from '../utils/storyParser';
import { drawStoryDiorama } from '../utils/storyDioramaRenderer';
import { sounds } from '../utils/sound';

const QUICK_INSPIRATIONS = [
  'הצלתי חתלתול קטן מהגשם השוטף ואימצתי אותו 🐱🌧️',
  'טיפסתי על הר מושלג בלילה כדי למצוא ספר עתיק 🏔️📖',
  'ניצחתי במירוץ 10 קילומטר וקיבלתי גביע זהב 🏃‍♂️🏆',
  'חציתי את האוקיינוס בספינת עץ ישנה עם כוכבים זוהרים ⛵🌌',
  'ישבנו שעות בפינת קפה שקטה עם פיצה וצחקנו ☕🍕'
];

const TERRAIN_LABELS = {
  snow_mountain: { label: 'פסגה מושלגת', emoji: '🏔️' },
  ocean_waves: { label: 'גלי ים ואוקיינוס', emoji: '🌊' },
  rainy_puddles: { label: 'רצפת שלוליות גשם', emoji: '🌧️' },
  starry_celestial: { label: 'פלטפורמת כוכבים', emoji: '🌌' },
  victory_podium: { label: 'פודיום ניצחון', emoji: '🏆' },
  lush_forest: { label: 'יער וצמחייה ירוקה', emoji: '🌲' },
  ancient_sanctuary: { label: 'אבן מקדש עתיק', emoji: '🏛️' }
};

const WEATHER_LABELS = {
  rain_storm: { label: 'גשם וענני סערה', emoji: '🌧️' },
  snow_flurry: { label: 'פתיתי שלג מתעופפים', emoji: '❄️' },
  starry_night: { label: 'ירח וכוכבים נוצצים', emoji: '🌙' },
  fire_embers: { label: 'גיצי אש ולהבות', emoji: '🔥' },
  falling_petals: { label: 'עלי כותרת מתעופפים', emoji: '🌸' },
  sunlit_sparks: { label: 'ניצוצות שמש זוהרים', emoji: '✨' }
};

export function StoryToMonumentModal({
  isOpen,
  onClose,
  onPlaceMonument
}) {
  const [storyText, setStoryText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [customTitle, setCustomTitle] = useState('');
  const [selectedTerrain, setSelectedTerrain] = useState('rainy_puddles');
  const [selectedWeather, setSelectedWeather] = useState('rain_storm');
  const [useAiImage, setUseAiImage] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiImageLoaded, setAiImageLoaded] = useState(false);

  const previewCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Debounced parsing whenever storyText changes
  useEffect(() => {
    if (!storyText.trim()) {
      setParsedData(null);
      setUseAiImage(false);
      setAiImageLoaded(false);
      return;
    }

    const timer = setTimeout(() => {
      const parsed = parseUserStory(storyText);
      setParsedData(parsed);
      setSelectedTerrain(parsed.terrain);
      setSelectedWeather(parsed.weather);
      setCustomTitle(parsed.title);
      setAiImageLoaded(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [storyText]);

  // Handle generating full AI diorama image
  const handleTriggerAiGeneration = () => {
    if (!parsedData?.aiImageUrl) return;
    setIsGeneratingAi(true);
    sounds.playTap();

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = parsedData.aiImageUrl;
    img.onload = () => {
      setIsGeneratingAi(false);
      setAiImageLoaded(true);
      setUseAiImage(true);
      sounds.playLevelUp?.();
    };
    img.onerror = () => {
      setIsGeneratingAi(false);
      alert('מחולל התמונות עמוס כעת. הקומפוזיציה הווקטורית העשירה פועלת מיד ללא תלות!');
    };
  };

  // Live Canvas Render Loop for Preview
  useEffect(() => {
    if (!isOpen) return;

    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const monumentData = {
        seed: parsedData?.seed || 12345,
        terrain: selectedTerrain || parsedData?.terrain || 'lush_forest',
        weather: selectedWeather || parsedData?.weather || 'sunlit_sparks',
        primaryEntity: parsedData?.primaryEntity,
        secondaryEntity: parsedData?.secondaryEntity,
        suggestedColor: parsedData?.suggestedColor || '#f59e0b',
        useAiImage: useAiImage,
        aiImageUrl: parsedData?.aiImageUrl
      };

      // Draw centered in preview canvas
      drawStoryDiorama(ctx, canvas.width / 2, canvas.height / 2 + 18, monumentData, Date.now(), 1.45);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, parsedData, selectedTerrain, selectedWeather, useAiImage]);

  if (!isOpen) return null;

  const handlePlace = () => {
    if (!storyText.trim()) return;

    sounds.playLevelUp?.();

    const finalMonument = {
      type: 'story_monument',
      isStoryMonument: true,
      storyText: storyText.trim(),
      customName: customTitle.trim() || parsedData?.title || 'אנדרטת סיפור חי',
      title: customTitle.trim() || parsedData?.title || 'אנדרטת סיפור חי',
      dedicatedTo: storyText.trim(),
      memory: storyText.trim(),
      date: new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' }),
      terrain: selectedTerrain,
      weather: selectedWeather,
      primaryColor: parsedData?.suggestedColor || '#f59e0b',
      primaryEntity: parsedData?.primaryEntity,
      secondaryEntity: parsedData?.secondaryEntity,
      allEntities: parsedData?.allEntities || [],
      customEmoji: parsedData?.primaryEntity?.emoji || '📖',
      useAiImage: useAiImage,
      aiImageUrl: parsedData?.aiImageUrl,
      seed: parsedData?.seed || Math.floor(Math.random() * 100000)
    };

    onPlaceMonument(finalMonument);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-card story-monument-modal glass-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '840px', width: '94%', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '2px solid rgba(245, 158, 11, 0.4)' }}>
          <div className="modal-header-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '24px' }}>🎨✨</span>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.25rem' }}>
                מחולל קומפוזיציה חזותית מסיפור
              </h2>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
              הקלד סיפור – המנוע משלב יחד את השטח, מזג האוויר, החפצים והדמויות לדיורמה ויזואלית אחת!
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="story-modal-body" style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Quick Inspirations Chips */}
          <div className="story-inspirations-strip">
            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
              💡 השראה מהירה לשילובים ויזואליים:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {QUICK_INSPIRATIONS.map((insp, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="inspiration-chip-btn"
                  onClick={() => {
                    sounds.playTap();
                    setStoryText(insp);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#e2e8f0',
                    borderRadius: '14px',
                    padding: '4px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {insp}
                </button>
              ))}
            </div>
          </div>

          {/* Story Textarea */}
          <div className="story-input-box">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '6px' }}>
              כתוב את הסיפור או הסיטואציה שתרצה להמחיש:
            </label>
            <textarea
              className="story-textarea"
              rows={3}
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              placeholder="למשל: הצלתי חתלתול קטן מהגשם השוטף... או: טיפסתי על הר מושלג בלילה כדי למצוא ספר עתיק..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                color: '#f8fafc',
                fontSize: '14px',
                lineHeight: '1.5',
                resize: 'none',
                outline: 'none'
              }}
            />
          </div>

          {/* Split Section: Scene Layers Breakdown & Live Visual Canvas */}
          <div className="story-preview-grid" style={{
            display: 'grid',
            gridTemplateColumns: parsedData ? '1fr 260px' : '1fr',
            gap: '16px',
            alignItems: 'start'
          }}>
            {/* Left: Decomposed Visual Layers */}
            <div className="story-semantics-panel" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {parsedData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Layer 1: Ground Terrain */}
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <Mountain size={13} className="text-amber" />
                      <span>שכבת שטח וקרקע שזוהתה:</span>
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(TERRAIN_LABELS).map(([k, v]) => {
                        const isSel = selectedTerrain === k;
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setSelectedTerrain(k);
                            }}
                            style={{
                              background: isSel ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              border: isSel ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: isSel ? '#fef08a' : '#cbd5e1',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{v.emoji}</span>
                            <span>{v.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 2: Weather & Sky Atmosphere */}
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <CloudRain size={13} className="text-amber" />
                      <span>שכבת מזג אוויר ואווירה:</span>
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {Object.entries(WEATHER_LABELS).map(([k, v]) => {
                        const isSel = selectedWeather === k;
                        return (
                          <button
                            key={k}
                            type="button"
                            onClick={() => {
                              sounds.playTap();
                              setSelectedWeather(k);
                            }}
                            style={{
                              background: isSel ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                              border: isSel ? '1.5px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: isSel ? '#bae6fd' : '#cbd5e1',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>{v.emoji}</span>
                            <span>{v.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Layer 3: Combined Subjects in Scene */}
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                      <Layers size={13} className="text-amber" />
                      <span>שילוב השחקנים והחפצים בסצנה:</span>
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '12px',
                        color: '#fef08a',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '15px' }}>{parsedData.primaryEntity?.emoji}</span>
                        <span>סובייקט מרכזי: <strong>{parsedData.primaryEntity?.name}</strong></span>
                      </div>

                      {parsedData.secondaryEntity && (
                        <div style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          background: 'rgba(236, 72, 153, 0.15)',
                          border: '1px solid rgba(236, 72, 153, 0.3)',
                          fontSize: '12px',
                          color: '#fbcfe8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ fontSize: '15px' }}>{parsedData.secondaryEntity?.emoji}</span>
                          <span>קונטקסט משלים: <strong>{parsedData.secondaryEntity?.name}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Generation Mode Button */}
                  <div style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div>
                      <strong style={{ fontSize: '12px', color: '#c084fc', display: 'block' }}>
                        ציור תמונת AI מלאה (Pixel-Art Diorama)
                      </strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        יוצר תמונה מאויירת שלמה בדיוק לפי הפרומפט שגזרנו
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleTriggerAiGeneration}
                      disabled={isGeneratingAi}
                      className="game-btn"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
                        color: '#fff',
                        borderRadius: '8px',
                        cursor: isGeneratingAi ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isGeneratingAi ? (
                        <>
                          <RefreshCw size={12} className="spin-slow" />
                          <span>מצייר...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          <span>צייר ב-AI ✨</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Monument Title Input */}
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                      🏷️ שם הדיורמה (ניתן לעריכה):
                    </label>
                    <input
                      type="text"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 10px', color: '#64748b' }}>
                  <Feather size={28} style={{ opacity: 0.5, marginBottom: '8px' }} />
                  <p style={{ margin: 0, fontSize: '13px' }}>
                    הקלד סיפור למעלה או בחר אחת מההשראות כדי לראות את השילוב הוויזואלי קורם עור וגידים!
                  </p>
                </div>
              )}
            </div>

            {/* Right: Live Interactive Canvas Diorama Preview */}
            {parsedData && (
              <div className="story-canvas-preview-box" style={{
                background: 'radial-gradient(circle, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
                borderRadius: '14px',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 'bold' }}>
                    קומפוזיציה חיה (60 FPS):
                  </span>
                  {useAiImage && (
                    <span style={{ fontSize: '10px', color: '#c084fc', background: 'rgba(139, 92, 246, 0.2)', padding: '2px 6px', borderRadius: '6px' }}>
                      מצב AI פעיל
                    </span>
                  )}
                </div>

                <canvas
                  ref={previewCanvasRef}
                  width={220}
                  height={170}
                  style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px' }}
                />

                <span style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '6px' }}>
                  משלב שטח, גשם/מזג אוויר וחפצים לאנדרטה חיה אחת
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <button 
            type="button" 
            className="game-btn game-btn-secondary" 
            onClick={onClose}
          >
            ביטול
          </button>

          <button
            type="button"
            className="game-btn game-btn-gold"
            disabled={!storyText.trim()}
            onClick={handlePlace}
            style={{
              opacity: storyText.trim() ? 1 : 0.5,
              cursor: storyText.trim() ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={16} />
            <span>הצב בכפר עכשיו ✨</span>
          </button>
        </div>
      </div>
    </div>
  );
}
