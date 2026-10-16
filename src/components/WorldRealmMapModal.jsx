import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  X, 
  Check, 
  CloudRain,
  Sun,
  Wind,
  Shield,
  Briefcase,
  Home,
  Sparkles,
  Lock
} from 'lucide-react';
import { VILLAGE_PRESETS } from '../data/villages';
import { sounds } from '../utils/sound';

export function WorldRealmMapModal({
  isOpen,
  onClose,
  currentVillageId,
  villagesRegistry = {},
  onSelectVillage
}) {
  const [selectedRegionId, setSelectedRegionId] = useState(currentVillageId || 'military');

  if (!isOpen) return null;

  // The 3 active villages
  const villagesList = ['military', 'business', 'sanctuary'].map(id => {
    const v = villagesRegistry[id] || {};
    const preset = VILLAGE_PRESETS.find(p => p.id === id) || VILLAGE_PRESETS[0];
    return {
      id,
      name: v.name || preset.defaultName,
      icon: v.icon || preset.icon,
      badge: v.badge || preset.badge,
      biome: v.biome || preset.biome,
      climateName: preset.climateName,
      climateTemp: preset.climateTemp,
      tagline: preset.tagline,
      description: v.description || preset.description,
      memoryFocus: preset.memoryFocus,
      scienceTip: preset.scienceTip,
      themeColor: v.color || preset.themeColor,
      placedObjects: v.placedObjects || preset.starterObjects || []
    };
  });

  const isFogSelected = selectedRegionId === 'fog';
  const selectedVillage = villagesList.find(v => v.id === selectedRegionId) || villagesList[0];
  const selectedObjects = selectedVillage?.placedObjects || [];
  const memoryCount = selectedObjects.filter(o => o.memory || o.dedicatedTo).length;

  const handleTravel = (id) => {
    sounds.playTap();
    onSelectVillage(id);
    onClose();
  };

  return (
    <div className="journal-backdrop catan-realm-backdrop" onClick={onClose}>
      <div className="realm-island-modal realistic-map-modal glass-card" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="catan-board-header">
          <div className="catan-title-wrap">
            <div className="catan-compass-badge">
              <Compass size={28} className="text-amber animate-spin-slow" />
            </div>
            <div>
              <div className="catan-title-row">
                <h2>ארץ הזכרונות — מפת היבשת המאוחדת</h2>
                <span className="catan-count-pill">טופוגרפיה ריאליסטית • מעברי שטח טבעיים 🗺️</span>
              </div>
              <p className="catan-subtitle">
                מפה קרטוגרפית אמיתית: מעבר הדרגתי בין רכס ההרים הצבאי, רמת השיש של היזמות, ועמק החיים הפסטורלי
              </p>
            </div>
          </div>
          <button className="close-mini-btn" onClick={onClose} title="סגור מפה">
            <X size={20} />
          </button>
        </div>

        {/* Board Layout */}
        <div className="catan-board-layout realistic-layout">
          
          {/* Main Visual Map (Photorealistic/Painted Fantasy Map with Interactive SVG Overlays) */}
          <div className="realistic-map-wrapper">
            <img 
              src="/realm_island_map.jpg" 
              alt="מפת ארץ הזכרונות" 
              className="realistic-map-base-img" 
            />

            {/* Interactive Vector Overlay for Clickable Hotspots, Glows, and Pins */}
            <svg 
              className="realistic-map-svg-overlay" 
              viewBox="0 0 1920 1080" 
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#fbbf24" floodOpacity="0.85" />
                </filter>
                <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="14" floodColor="#c084fc" floodOpacity="0.9" />
                </filter>
                <filter id="beaconPulse" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ef4444" floodOpacity="0.95" />
                </filter>
              </defs>

              {/* ========================================================
                  HOT-ZONE 1: MILITARY REALM (Northwest Mountains & Pine Forest)
                  ======================================================== */}
              <g 
                className={`realistic-hotzone ${selectedRegionId === 'military' ? 'is-selected' : ''}`}
                onClick={() => { sounds.playTap(); setSelectedRegionId('military'); }}
                cursor="pointer"
              >
                {/* Invisible Territory Click Area */}
                <path 
                  d="M 230 400 C 180 340, 240 180, 420 130 C 560 90, 780 130, 890 220 C 920 280, 890 380, 800 450 C 720 520, 600 520, 520 530 C 440 540, 350 480, 230 400 Z"
                  fill="rgba(0, 0, 0, 0.001)"
                  stroke="none"
                />

                {/* Floating Interactive Badge Pin */}
                <g transform="translate(640, 310)">
                  <rect x="-110" y="-22" width="220" height="44" rx="22" fill="rgba(15, 23, 42, 0.92)" stroke={selectedRegionId === 'military' ? '#fbbf24' : '#22c55e'} strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#fef08a" fontSize="17" fontWeight="800">🪖 כפר צבא וביטחון</text>
                  
                  {/* Climate pill underneath */}
                  <rect x="-85" y="27" width="170" height="24" rx="12" fill="rgba(24, 24, 27, 0.88)" stroke="rgba(255,255,255,0.2)" />
                  <text x="0" y="43" textAnchor="middle" fill="#93c5fd" fontSize="12.5" fontWeight="700">🌧️ 16°C • רכס מיוער ומוגן</text>

                  {/* Active Beacon Marker */}
                  {currentVillageId === 'military' && (
                    <g transform="translate(0, -38)" filter="url(#beaconPulse)">
                      <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">אתה</text>
                    </g>
                  )}
                </g>
              </g>


              {/* ========================================================
                  HOT-ZONE 2: BUSINESS REALM (Northeast Slate Plateau)
                  ======================================================== */}
              <g 
                className={`realistic-hotzone ${selectedRegionId === 'business' ? 'is-selected' : ''}`}
                onClick={() => { sounds.playTap(); setSelectedRegionId('business'); }}
                cursor="pointer"
              >
                {/* Invisible Territory Click Area */}
                <path 
                  d="M 920 220 C 1020 150, 1180 130, 1360 140 C 1460 150, 1490 230, 1460 300 C 1420 370, 1300 400, 1180 430 C 1060 450, 940 370, 910 290 Z"
                  fill="rgba(0, 0, 0, 0.001)"
                  stroke="none"
                />

                {/* Floating Interactive Badge Pin */}
                <g transform="translate(1250, 240)">
                  <rect x="-110" y="-22" width="220" height="44" rx="22" fill="rgba(15, 23, 42, 0.92)" stroke={selectedRegionId === 'business' ? '#fbbf24' : '#f59e0b'} strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#fef08a" fontSize="17" fontWeight="800">💼 כפר יזמות ועסק</text>

                  {/* Climate pill underneath */}
                  <rect x="-85" y="27" width="170" height="24" rx="12" fill="rgba(24, 24, 27, 0.88)" stroke="rgba(255,255,255,0.2)" />
                  <text x="0" y="43" textAnchor="middle" fill="#fde047" fontSize="12.5" fontWeight="700">☀️ 22°C • רמת שיש ומודרניות</text>

                  {/* Active Beacon Marker */}
                  {currentVillageId === 'business' && (
                    <g transform="translate(0, -38)" filter="url(#beaconPulse)">
                      <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">אתה</text>
                    </g>
                  )}
                </g>
              </g>


              {/* ========================================================
                  HOT-ZONE 3: SANCTUARY REALM (Southern River Valley & Bay)
                  ======================================================== */}
              <g 
                className={`realistic-hotzone ${selectedRegionId === 'sanctuary' ? 'is-selected' : ''}`}
                onClick={() => { sounds.playTap(); setSelectedRegionId('sanctuary'); }}
                cursor="pointer"
              >
                {/* Invisible Territory Click Area */}
                <path 
                  d="M 360 480 C 480 500, 620 500, 780 460 C 940 430, 1140 540, 1180 680 C 1140 780, 960 840, 800 840 C 600 850, 480 820, 360 760 C 280 700, 260 560, 360 480 Z"
                  fill="rgba(0, 0, 0, 0.001)"
                  stroke="none"
                />

                {/* Floating Interactive Badge Pin */}
                <g transform="translate(740, 680)">
                  <rect x="-110" y="-22" width="220" height="44" rx="22" fill="rgba(15, 23, 42, 0.92)" stroke={selectedRegionId === 'sanctuary' ? '#fbbf24' : '#10b981'} strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#fef08a" fontSize="17" fontWeight="800">🏡 כפר חיים ושגרה</text>

                  {/* Climate pill underneath */}
                  <rect x="-85" y="27" width="170" height="24" rx="12" fill="rgba(24, 24, 27, 0.88)" stroke="rgba(255,255,255,0.2)" />
                  <text x="0" y="43" textAnchor="middle" fill="#86efac" fontSize="12.5" fontWeight="700">🌸 20°C • עמק פסטורלי ונעים</text>

                  {/* Active Beacon Marker */}
                  {currentVillageId === 'sanctuary' && (
                    <g transform="translate(0, -38)" filter="url(#beaconPulse)">
                      <circle cx="0" cy="0" r="16" fill="#ef4444" stroke="#ffffff" strokeWidth="3" />
                      <text x="0" y="5" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="900">אתה</text>
                    </g>
                  )}
                </g>
              </g>


              {/* ========================================================
                  HOT-ZONE 4: FOG OF WAR (Mystical Eastern Clouds)
                  ======================================================== */}
              <g 
                className={`realistic-hotzone ${selectedRegionId === 'fog' ? 'is-selected' : ''}`}
                onClick={() => { sounds.playTap(); setSelectedRegionId('fog'); }}
                cursor="pointer"
              >
                {/* Invisible Territory Click Area */}
                <path 
                  d="M 1200 440 C 1350 350, 1550 320, 1780 400 C 1900 520, 1850 780, 1700 880 C 1500 950, 1300 880, 1200 750 C 1140 650, 1150 500, 1200 440 Z"
                  fill="rgba(0, 0, 0, 0.001)"
                  stroke="none"
                />

                {/* Floating Interactive Fog Badge */}
                <g transform="translate(1530, 560)">
                  <rect x="-125" y="-24" width="250" height="48" rx="24" fill="rgba(15, 23, 42, 0.94)" stroke="#a855f7" strokeWidth="2.5" />
                  <text x="0" y="5" textAnchor="middle" fill="#f3e8ff" fontSize="17" fontWeight="800">🔮 מחוזות הערפל הנסתרים</text>
                  
                  <rect x="-100" y="30" width="200" height="24" rx="12" fill="rgba(30, 41, 59, 0.88)" stroke="rgba(168, 85, 247, 0.4)" />
                  <text x="0" y="46" textAnchor="middle" fill="#d8b4fe" fontSize="12" fontWeight="700">ייחשף עם התרחבות החיים ☁️</text>
                </g>
              </g>

            </svg>
          </div>

          {/* Side Territory & Climate Inspector Card */}
          <div className="catan-inspector-panel glass-card realistic-inspector">
            
            {isFogSelected ? (
              /* Fog of War Inspector State */
              <div className="fog-inspector-content">
                <div className="inspector-top-row">
                  <span className="inspector-icon">🔮</span>
                  <div>
                    <h3>ארצות הערפל הבלתי נודעות</h3>
                    <span className="inspector-badge fog-badge">טרה אינקוגניטה (Terra Incognita) ☁️</span>
                  </div>
                </div>

                <div className="catan-climate-box">
                  <div className="climate-row">
                    <span className="climate-icon-label">
                      <Wind size={18} className="text-purple" />
                      <strong>תנאי אקלים:</strong>
                    </span>
                    <span className="climate-val">ערפל תמידי • עננים מסתוריים</span>
                  </div>
                  <div className="climate-row">
                    <strong>טופוגרפיה:</strong>
                    <span className="climate-val">רכסי הרים נסתרים ומחוזות שטרם נחקרו</span>
                  </div>
                </div>

                <p className="inspector-desc">
                  המרחבים הבלתי נודעים של העולם שלך. ככל שתעמיק ותרחיב את הפרויקטים והשאיפות שלך במסע החיים – הערפל יתפזר וייבנו כאן כפרים ומחוזות נוספים!
                </p>

                <div className="fog-teaser-box">
                  <Sparkles size={18} className="text-amber" />
                  <span>שמור לשלבים הבאים בהתפתחות ארץ הזכרונות שלך ✨</span>
                </div>

                <div className="catan-travel-action">
                  <div className="current-village-badge-pill fog-locked-pill">
                    <Lock size={16} />
                    <span>אזור זה ייחשף בעתיד 🔒</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Active Village Inspector State */
              <>
                <div className="inspector-top-row">
                  <span className="inspector-icon">{selectedVillage.icon}</span>
                  <div>
                    <h3>{selectedVillage.name}</h3>
                    <span className="inspector-badge">{selectedVillage.badge}</span>
                  </div>
                </div>

                {/* Climate & Topography Box */}
                <div className="catan-climate-box">
                  <div className="climate-row">
                    <span className="climate-icon-label">
                      {selectedVillage.id === 'military' && <CloudRain size={18} className="text-cyan" />}
                      {selectedVillage.id === 'business' && <Sun size={18} className="text-amber" />}
                      {selectedVillage.id === 'sanctuary' && <Wind size={18} className="text-emerald" />}
                      <strong>תנאי אקלים:</strong>
                    </span>
                    <span className="climate-val">{selectedVillage.climateName} ({selectedVillage.climateTemp})</span>
                  </div>
                  <div className="climate-row">
                    <strong>מיקום וטופוגרפיה:</strong>
                    <span className="climate-val">{selectedVillage.tagline}</span>
                  </div>
                </div>

                <p className="inspector-desc">{selectedVillage.description}</p>

                {/* Adjacent Borders Info Box */}
                <div className="island-adjacent-box">
                  <span className="adjacent-title">חיבורים גיאוגרפיים הדרגתיים:</span>
                  {selectedVillage.id === 'military' && (
                    <div className="adjacent-details">
                      <span>➡️ <strong>ממזרח:</strong> מדרון סלעי ומעבר הרים המוביל ישירות אל רמת היזמות</span>
                      <span>⬇️ <strong>מדרום:</strong> נחלי הפשרת השלגים זורמים ומזינים את עמק כפר החיים</span>
                      <span>🌊 <strong>ממערב ומצפון:</strong> מצוקים תלולים והאוקיינוס המבודד</span>
                    </div>
                  )}
                  {selectedVillage.id === 'business' && (
                    <div className="adjacent-details">
                      <span>⬅️ <strong>ממערב:</strong> מעבר הרים סלעי אל יער האורנים והמצודה הצבאית</span>
                      <span>⬇️ <strong>מדרום:</strong> ירידה במצוק אל עמק החיים וגשר האבן מעל הנהר</span>
                      <span>☁️ <strong>ממזרח:</strong> קו הגבול עם ענני הערפל המיסטי של הארצות הנסתרות</span>
                    </div>
                  )}
                  {selectedVillage.id === 'sanctuary' && (
                    <div className="adjacent-details">
                      <span>↖️ <strong>מצפון-מערב:</strong> עלייה הדרגתית אל גבעות היער של כפר הצבא</span>
                      <span>↗️ <strong>מצפון-מזרח:</strong> דרך נוף מרוצפת עולה אל רמת השיש של היזמות</span>
                      <span>🌊 <strong>מדרום:</strong> שפך הנהר וחוף חולי אל האוקיינוס הפתוח</span>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="catan-stats-row">
                  <div className="catan-stat-pill">
                    <span>✨</span>
                    <strong>{memoryCount}</strong>
                    <span>זיכרונות מעוגנים</span>
                  </div>
                  <div className="catan-stat-pill">
                    <span>🏡</span>
                    <strong>{selectedObjects.length}</strong>
                    <span>מבנים ופינות</span>
                  </div>
                </div>

                {/* Travel Action */}
                <div className="catan-travel-action">
                  {currentVillageId === selectedVillage.id ? (
                    <div className="current-village-badge-pill">
                      <Check size={18} />
                      <span>אתה נמצא כעת באזור זה ✓</span>
                    </div>
                  ) : (
                    <button
                      className="catan-direct-travel-btn"
                      onClick={() => handleTravel(selectedVillage.id)}
                    >
                      <Navigation size={18} />
                      <span>צא למסע אל {selectedVillage.name} 🚀</span>
                    </button>
                  )}
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
