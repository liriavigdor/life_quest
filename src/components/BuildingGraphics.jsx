import React from 'react';
import { CATEGORIES } from '../data/gameData';

export function BuildingGraphics({ type, level, isSelected }) {
  // Return tailored SVG vector graphics for each building type based on level
  const renderBuilding = () => {
    switch (type) {
      case 'townHall':
        // existing code unchanged
        return (
          <g className="building-svg-group">
            {/* SVG Gradients & Filters definitions */}
            <defs>
              {/* Roof Shading Gradients */}
              <linearGradient id="thRoofLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="60%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#991b1b" />
              </linearGradient>
              <linearGradient id="thRoofRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#b91c1c" />
                <stop offset="70%" stopColor="#7f1d1d" />
                <stop offset="100%" stopColor="#450a0a" />
              </linearGradient>
              
              {/* Stone Wall Gradients (Warm Medieval Ashlar) */}
              <linearGradient id="thWallLeft" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="thWallRight" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="60%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>

              {/* Gold Ornamentation Gradient */}
              <linearGradient id="thGold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Ground Ambient Contact Shadow */}
              <radialGradient id="thGroundShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0f172a" stopOpacity="0.6" />
                <stop offset="60%" stopColor="#0f172a" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
              </radialGradient>

              {/* Window Interior Warm Hearth Glow */}
              <radialGradient id="thWindowGlow" cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>
            </defs>

            {/* 1. LAYER 1: Deep Ground Contact Shadow */}
            <ellipse cx="2" cy="12" rx="66" ry="30" fill="url(#thGroundShadow)" />

            {/* 2. LAYER 2: Plinth & Cobblestone Foundation */}
            {/* Base Beveled Flagstone Slab */}
            <path d="M 0,-38 L 62,-7 L 0,24 L -62,-7 Z" fill="#334155" />
            <path d="M -62,-7 L 0,24 L 0,28 L -62,-3 Z" fill="#1e293b" />
            <path d="M 0,24 L 62,-7 L 62,-3 L 0,28 Z" fill="#0f172a" />
            <path d="M 0,-35 L 58,-6 L 0,22 L -58,-6 Z" fill="#475569" stroke="#64748b" strokeWidth="1" />
            {/* Foundation edge highlight */}
            <path d="M -58,-6 L 0,22 L 58,-6" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.6" />

            {/* 3. LAYER 3: Main Stone Body (Two-Tone Ashlar Blocks) */}
            {/* Left lit wall */}
            <path d="M -44,-14 L 0,8 L 0,-52 L -44,-74 Z" fill="url(#thWallLeft)" />
            {/* Right shaded wall */}
            <path d="M 0,8 L 44,-14 L 44,-74 L 0,-52 Z" fill="url(#thWallRight)" />

            {/* Architectural Relief: Stone block mortar lines */}
            <g stroke="#334155" strokeWidth="0.8" opacity="0.45">
              {/* Left Wall Mortar */}
              <line x1="-44" y1="-30" x2="0" y2="-8" />
              <line x1="-44" y1="-46" x2="0" y2="-24" />
              <line x1="-44" y1="-62" x2="0" y2="-40" />
              <line x1="-24" y1="-19" x2="-24" y2="-8" />
              <line x1="-12" y1="-35" x2="-12" y2="-24" />
              <line x1="-32" y1="-35" x2="-32" y2="-24" />
              
              {/* Right Wall Mortar */}
              <line x1="0" y1="-8" x2="44" y2="-30" />
              <line x1="0" y1="-24" x2="44" y2="-46" />
              <line x1="0" y1="-40" x2="44" y2="-62" />
              <line x1="22" y1="-8" x2="22" y2="-19" />
              <line x1="12" y1="-24" x2="12" y2="-35" />
              <line x1="32" y1="-24" x2="32" y2="-35" />
            </g>

            {/* Center Corner Bevel Highlight (Light reflection seam) */}
            <line x1="0" y1="8" x2="0" y2="-52" stroke="#f1f5f9" strokeWidth="1.2" opacity="0.75" />

            {/* 4. LAYER 4: Grand Portico & Wooden Iron-Banded Door */}
            {/* Portico Arch Stone Jambs */}
            <path d="M -14,1 L 14,-13 L 14,-34 Q 0,-44 -14,-22 Z" fill="#1e293b" />
            {/* Inner Recessed Door with Warm Ambient Lighting */}
            <path d="M -11,-1 L 11,-12 L 11,-30 Q 0,-38 -11,-20 Z" fill="url(#thWindowGlow)" />
            {/* Heavy Oak Wood Planks & Iron Studs */}
            <path d="M -9,0 L 9,-9 L 9,-27 Q 0,-34 -9,-18 Z" fill="#78350f" opacity="0.9" />
            <line x1="-9" y1="-8" x2="9" y2="-17" stroke="#334155" strokeWidth="1.6" />
            <line x1="-9" y1="-14" x2="9" y2="-23" stroke="#334155" strokeWidth="1.6" />
            <circle cx="6" cy="-14" r="1.3" fill="#facc15" />

            {/* Upper Floor Leaded Stained Glass Windows */}
            <g transform="translate(-24, -48)">
              {/* Left Window Arch */}
              <path d="M -5,2 L 5,-3 L 5,-14 Q 0,-18 -5,-12 Z" fill="#0f172a" />
              <path d="M -4,1 L 4,-3 L 4,-12 Q 0,-16 -4,-11 Z" fill="url(#thWindowGlow)" />
              {/* Window Mullion Grid */}
              <line x1="0" y1="-1" x2="0" y2="-14" stroke="#451a03" strokeWidth="0.8" />
              <line x1="-4" y1="-6" x2="4" y2="-10" stroke="#451a03" strokeWidth="0.8" />
            </g>
            <g transform="translate(24, -48)">
              {/* Right Window Arch */}
              <path d="M -5,-3 L 5,2 L 5,-12 Q 0,-18 -5,-14 Z" fill="#0f172a" />
              <path d="M -4,-3 L 4,1 L 4,-11 Q 0,-16 -4,-12 Z" fill="url(#thWindowGlow)" opacity="0.85" />
              <line x1="0" y1="-1" x2="0" y2="-14" stroke="#451a03" strokeWidth="0.8" />
              <line x1="-4" y1="-10" x2="4" y2="-6" stroke="#451a03" strokeWidth="0.8" />
            </g>

            {/* 5. LAYER 5: Overhanging Timber Eaves & Curved Mansard Roof */}
            {/* Eaves Underside Shadow (Ambient Occlusion) */}
            <path d="M -54,-68 L 0,-36 L 54,-68 L 50,-74 L 0,-44 L -50,-74 Z" fill="#1e293b" opacity="0.8" />

            {/* Left Swooping Fantasy Roof Face (Bézier Curves instead of flat triangle) */}
            <path 
              d="M 0,-104 Q -28,-90 -54,-64 Q -26,-40 0,-24 Z" 
              fill="url(#thRoofLeft)" 
              stroke="#7f1d1d" 
              strokeWidth="1.2"
            />
            {/* Right Shaded Roof Face */}
            <path 
              d="M 0,-104 Q 28,-90 54,-64 Q 26,-40 0,-24 Z" 
              fill="url(#thRoofRight)" 
              stroke="#450a0a" 
              strokeWidth="1.2"
            />

            {/* Architectural Shingle Ridge & Curved Overhang Relief */}
            <g stroke="#fecaca" strokeWidth="1" opacity="0.4" fill="none">
              {/* Shingle rows on left roof */}
              <path d="M 0,-85 Q -20,-74 -40,-54" />
              <path d="M 0,-66 Q -15,-57 -28,-40" />
              <path d="M 0,-46 Q -10,-40 -18,-31" />
            </g>
            <g stroke="#000" strokeWidth="1.2" opacity="0.3" fill="none">
              {/* Shadow troughs on right roof */}
              <path d="M 0,-85 Q 20,-74 40,-54" />
              <path d="M 0,-66 Q 15,-57 28,-40" />
              <path d="M 0,-46 Q 10,-40 18,-31" />
            </g>

            {/* Roof Spine Peak Highlight */}
            <path d="M 0,-104 L 0,-24" stroke="#fecaca" strokeWidth="1.8" opacity="0.8" />

            {/* 6. LEVEL PROGRESSION ORNAMENTS */}
            {/* Roof Spire & Gilded Crest */}
            <path d="M -4,-103 L 0,-118 L 4,-103 Z" fill="url(#thGold)" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="0" cy="-118" r="4.5" fill="url(#thGold)" stroke="#b45309" strokeWidth="1" />
            
            {/* Level 2+: Gilded Finial Weather-Vane */}
            {level >= 2 && (
              <g>
                <line x1="0" y1="-122" x2="0" y2="-134" stroke="url(#thGold)" strokeWidth="2.4" strokeLinecap="round" />
                <path d="M 0,-132 L 14,-136 L 0,-140 Z" fill="url(#thGold)" stroke="#b45309" strokeWidth="0.8" />
              </g>
            )}

            {/* Level 3+: Flanking Corner Guard Turrets & Crimson Banners */}
            {level >= 3 && (
              <g>
                {/* Left Watch Turret */}
                <g transform="translate(-48, -78)">
                  <path d="M -8,0 L 8,-8 L 8,-22 L -8,-14 Z" fill="url(#thWallLeft)" />
                  <path d="M 0,-34 L 10,-20 L -10,-14 Z" fill="url(#thRoofLeft)" stroke="#991b1b" strokeWidth="0.8" />
                  {/* Fluttering Banner */}
                  <path d="M 0,-34 L 0,-44 L -12,-40 L 0,-36" fill="#ef4444" stroke="#991b1b" strokeWidth="0.6" />
                </g>
                {/* Right Watch Turret */}
                <g transform="translate(48, -78)">
                  <path d="M -8,-8 L 8,0 L 8,-14 L -8,-22 Z" fill="url(#thWallRight)" />
                  <path d="M 0,-34 L 10,-14 L -10,-20 Z" fill="url(#thRoofRight)" stroke="#450a0a" strokeWidth="0.8" />
                  <path d="M 0,-34 L 0,-44 L 12,-40 L 0,-36" fill="#dc2626" stroke="#7f1d1d" strokeWidth="0.6" />
                </g>
              </g>
            )}

            {/* Level 4+: Arcane Golden Sanctuary Aura */}
            {level >= 4 && (
              <g>
                <ellipse cx="0" cy="-10" rx="64" ry="32" fill="none" stroke="url(#thGold)" strokeWidth="2.5" strokeDasharray="8,6" className="halo-spin" />
                <circle cx="-35" cy="-20" r="2.5" fill="#fef08a" opacity="0.8" className="glow-pulse" />
                <circle cx="35" cy="-20" r="2.5" fill="#fef08a" opacity="0.8" className="glow-pulse" />
              </g>
            )}
          </g>
        );

      case 'barracks':
        return (
          <g className="building-svg-group">
            {/* Earth foundation */}
            <path d="M 0,-25 L 45,-3 L 0,20 L -45,-3 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <path d="M 0,-22 L 40,-3 L 0,16 L -40,-3 Z" fill="#92400e" />
            {/* Wooden Arena Structure */}
            <path d="M -30,-10 L 0,8 L 30,-10 L 30,-45 L 0,-28 L -30,-45 Z" fill="#d97706" stroke="#78350f" strokeWidth="2" />
            <path d="M 0,8 L 30,-10 L 30,-45 L 0,-28 Z" fill="#b45309" />
            {/* Roof Straw / Tent */}
            <path d="M 0,-70 L 38,-42 L 0,-15 L -38,-42 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="2" />
            <path d="M 0,-70 L 38,-42 L 0,-15 Z" fill="#dc2626" />
            {/* Crossed swords emblem */}
            <g transform="translate(0, -32) scale(0.65)">
              <line x1="-15" y1="-15" x2="15" y2="15" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
              <line x1="15" y1="-15" x2="-15" y2="15" stroke="#f8fafc" strokeWidth="4" strokeLinecap="round" />
              <circle cx="0" cy="0" r="5" fill="#f59e0b" />
            </g>
            {/* Target dummy / weights on higher levels */}
            {level >= 2 && (
              <g transform="translate(-25, 5)">
                <rect x="-4" y="-12" width="8" height="14" fill="#64748b" rx="2" />
                <circle cx="-5" cy="-5" r="4" fill="#334155" />
                <circle cx="5" cy="-5" r="4" fill="#334155" />
              </g>
            )}
            {level >= 3 && (
              <polygon points="0,-72 -14,-78 0,-85" fill="#f59e0b" />
            )}
          </g>
        );

      case 'gym':
        return (
          <g className="building-svg-group">
            <defs>
              <linearGradient id="gymRoofGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="60%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
              <linearGradient id="gymMatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
            {/* Ground Contact Shadow */}
            <ellipse cx="0" cy="14" rx="55" ry="24" fill="#0f172a" fillOpacity="0.45" />

            {/* Base Training Platform / Flagstone Slab */}
            <path d="M 0,-28 L 52,-4 L 0,22 L -52,-4 Z" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <path d="M -52,-4 L 0,22 L 0,26 L -52,0 Z" fill="#1e293b" />
            <path d="M 0,22 L 52,-4 L 52,0 L 0,26 Z" fill="#0f172a" />
            
            {/* Rubber Training Mat Floor */}
            <path d="M 0,-23 L 44,-3 L 0,18 L -44,-3 Z" fill="url(#gymMatGrad)" />
            <line x1="-30" y1="-8" x2="16" y2="14" stroke="#fca5a5" strokeWidth="1" strokeOpacity="0.5" />

            {/* Heavy Timber Corner Pillars */}
            <rect x="-42" y="-55" width="8" height="50" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <rect x="34" y="-55" width="8" height="50" rx="1.5" fill="#78350f" stroke="#451a03" strokeWidth="1" />
            <rect x="-6" y="-38" width="12" height="50" rx="1.5" fill="#92400e" stroke="#451a03" strokeWidth="1" />

            {/* Iron Barbell & Dumbbell Equipment on the Floor */}
            <g transform="translate(-16, 2) scale(0.85)">
              <line x1="-16" y1="-2" x2="16" y2="4" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              {/* Iron Plates Left */}
              <circle cx="-14" cy="-2" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="-14" cy="-2" r="3" fill="#475569" />
              {/* Iron Plates Right */}
              <circle cx="14" cy="4" r="7" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
              <circle cx="14" cy="4" r="3" fill="#475569" />
            </g>

            {/* Heavy Punching Bag hanging */}
            <g transform="translate(18, -20)">
              <line x1="0" y1="-22" x2="0" y2="-6" stroke="#64748b" strokeWidth="1.5" />
              <rect x="-5" y="-6" width="10" height="24" rx="4" fill="#991b1b" stroke="#450a0a" strokeWidth="1.2" />
              <line x1="-5" y1="2" x2="5" y2="2" stroke="#f87171" strokeWidth="1" />
            </g>

            {/* Isometric Peaked Pavilion Roof */}
            <path d="M 0,-92 L 48,-56 L 0,-26 L -48,-56 Z" fill="url(#gymRoofGrad)" stroke="#451a03" strokeWidth="1.5" />
            <path d="M 0,-92 L 48,-56 L 0,-26 Z" fill="#92400e" stroke="#451a03" strokeWidth="1" />
            {/* Eaves Trim Line */}
            <path d="M -48,-56 L 0,-26 L 48,-56" stroke="#fef08a" strokeWidth="1.5" fill="none" />

            {/* Athletic Dumbbell Banner / Crest in the center */}
            <g transform="translate(0, -62)">
              <rect x="-18" y="-9" width="36" height="18" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.2" />
              {/* Dumbbell Icon */}
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#f8fafc" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="-12" y="-4" width="3" height="8" rx="1" fill="#f59e0b" />
              <rect x="9" y="-4" width="3" height="8" rx="1" fill="#f59e0b" />
            </g>

            {/* Summit Flag Pennant */}
            <line x1="0" y1="-92" x2="0" y2="-108" stroke="#cbd5e1" strokeWidth="1.5" />
            <polygon points="0,-108 14,-103 0,-98" fill="#ef4444" />
          </g>
        );

      case 'wizardTower':
        return (
          <g className="building-svg-group">
            <defs>
              {/* Arcane Obsidian & Indigo Stone Gradients */}
              <linearGradient id="wtTowerLeft" x1="0%" y1="0%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="35%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#312e81" />
              </linearGradient>
              <linearGradient id="wtTowerRight" x1="0%" y1="0%" x2="100%" y2="90%">
                <stop offset="0%" stopColor="#3730a3" />
                <stop offset="50%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Spire Roof Gradients */}
              <linearGradient id="wtSpireLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="wtSpireRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1d4ed8" />
                <stop offset="70%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>

              {/* Floating Crystal Core Gradient */}
              <radialGradient id="wtCrystalGlow" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#67e8f9" />
                <stop offset="80%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0e7490" />
              </radialGradient>
            </defs>

            {/* Ground Contact Shadow */}
            <ellipse cx="0" cy="12" rx="55" ry="24" fill="url(#thGroundShadow)" />

            {/* Arcane Octagonal Dais Foundation */}
            <path d="M 0,-26 L 48,-4 L 0,18 L -48,-4 Z" fill="#1e1b4b" stroke="#312e81" strokeWidth="1.2" />
            <path d="M -48,-4 L 0,18 L 0,23 L -48,1 Z" fill="#0f172a" />
            <path d="M 0,18 L 48,-4 L 48,1 L 0,23 Z" fill="#030712" />
            <path d="M 0,-23 L 44,-4 L 0,16 L -44,-4 Z" fill="#312e81" />
            <path d="M -44,-4 L 0,16 L 44,-4" stroke="#818cf8" strokeWidth="1" fill="none" opacity="0.6" />

            {/* Buttress Supports at the Base */}
            <path d="M -30,-4 L -20,-30 L -16,-2 L -24,4 Z" fill="#1e1b4b" opacity="0.85" />
            <path d="M 30,-4 L 20,-30 L 16,-2 L 24,4 Z" fill="#0f172a" opacity="0.85" />

            {/* Main Tapered Tower Shaft with Bézier Flaring */}
            <path 
              d="M -24,-6 Q -18,-45 -16,-78 L 0,-65 L 0,6 Q -14,1 -24,-6 Z" 
              fill="url(#wtTowerLeft)" 
            />
            <path 
              d="M 0,6 L 0,-65 L 16,-78 Q 18,-45 24,-6 Q 14,1 0,6 Z" 
              fill="url(#wtTowerRight)" 
            />

            {/* Center Chamfer Light Seam */}
            <line x1="0" y1="6" x2="0" y2="-65" stroke="#a5b4fc" strokeWidth="1.2" opacity="0.75" />

            {/* Glowing Inlaid Runic Channels */}
            <g stroke="#38bdf8" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" fill="none" filter="drop-shadow(0 0 3px #06b6d4)">
              <path d="M -12,-20 L -6,-28 L -10,-42 L -4,-52" />
              <circle cx="-10" cy="-42" r="1.5" fill="#e0f2fe" />
              <path d="M 8,-16 L 12,-28 L 6,-40 L 10,-52" opacity="0.7" />
              <circle cx="6" cy="-40" r="1.5" fill="#e0f2fe" />
            </g>

            {/* Wizard's Arched Observation Balcony */}
            <g transform="translate(0, -68)">
              {/* Balcony Base Stone Ring */}
              <ellipse cx="0" cy="0" rx="20" ry="8" fill="#1e1b4b" stroke="#312e81" strokeWidth="1" />
              <ellipse cx="0" cy="-1" rx="18" ry="7" fill="#4338ca" />
              {/* Small Glowing Arch Window */}
              <path d="M -6,-4 L 6,-4 L 6,-18 Q 0,-24 -6,-18 Z" fill="#0284c7" />
              <ellipse cx="0" cy="-12" rx="3.5" ry="6" fill="#e0f2fe" opacity="0.9" className="fire-flicker" />
            </g>

            {/* High Arcane Spire with Curved Flared Eaves */}
            <path 
              d="M 0,-122 Q -15,-98 -26,-72 Q 0,-56 0,-56 Z" 
              fill="url(#wtSpireLeft)" 
              stroke="#1e3a8a" 
              strokeWidth="1"
            />
            <path 
              d="M 0,-122 Q 15,-98 26,-72 Q 0,-56 0,-56 Z" 
              fill="url(#wtSpireRight)" 
              stroke="#0f172a" 
              strokeWidth="1"
            />
            {/* Spire Center Spine Highlight */}
            <path d="M 0,-122 L 0,-56" stroke="#93c5fd" strokeWidth="1.4" opacity="0.8" />

            {/* Floating Magical Polyhedral Crystal (Layered Facets) */}
            <g className="floating-crystal" transform="translate(0, -136)">
              {/* Outer crystal glow pulse */}
              <ellipse cx="0" cy="0" rx="14" ry="18" fill="#38bdf8" opacity="0.25" className="glow-pulse" />
              {/* Crystal Top & Left facets */}
              <polygon points="0,-18 10,-3 0,12" fill="url(#wtCrystalGlow)" />
              <polygon points="0,-18 -10,-3 0,12" fill="#0284c7" />
              <polygon points="0,-18 0,12 3,2" fill="#e0f2fe" opacity="0.9" />
              {/* Tiny orbiting mana particles */}
              <circle cx="-12" cy="-6" r="1.5" fill="#bae6fd" />
              <circle cx="11" cy="4" r="1.2" fill="#67e8f9" />
            </g>

            {/* Level 2+: Celestial Gyroscope Rings */}
            {level >= 2 && (
              <g>
                <ellipse cx="0" cy="-35" rx="32" ry="12" fill="none" stroke="#67e8f9" strokeWidth="1.4" strokeDasharray="6,4" className="halo-spin" opacity="0.75" />
                <ellipse cx="0" cy="-35" rx="26" ry="10" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
              </g>
            )}

            {/* Level 3+: Arcane Spell Tomes & Mystic Runes Float */}
            {level >= 3 && (
              <g>
                {/* Floating Mystic Runes */}
                <g transform="translate(-28, -90) scale(0.8)">
                  <polygon points="0,-6 6,0 0,6 -6,0" fill="#a855f7" stroke="#e9d5ff" strokeWidth="0.8" className="glow-pulse" />
                </g>
                <g transform="translate(28, -90) scale(0.8)">
                  <polygon points="0,-6 6,0 0,6 -6,0" fill="#38bdf8" stroke="#bae6fd" strokeWidth="0.8" className="glow-pulse" />
                </g>
              </g>
            )}

            {/* Level 4+: Celestial Rift & Cosmic Pillars */}
            {level >= 4 && (
              <g>
                <ellipse cx="0" cy="5" rx="58" ry="26" fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="10,6" className="halo-spin" />
                <ellipse cx="0" cy="-136" rx="24" ry="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4,4" className="halo-spin" />
              </g>
            )}
          </g>
        );

      case 'goldMine':
        return (
          <g className="building-svg-group">
            {/* Mountain / Pit Base */}
            <path d="M 0,-25 L 45,-3 L 0,20 L -45,-3 Z" fill="#713f12" stroke="#451a03" strokeWidth="2" />
            <path d="M 0,-22 L 40,-3 L 0,16 L -40,-3 Z" fill="#854d0e" />
            {/* Mine Entrance Rock */}
            <path d="M -32,-8 L 0,10 L 32,-8 L 25,-45 L 0,-32 L -25,-45 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
            <path d="M 0,10 L 32,-8 L 25,-45 L 0,-32 Z" fill="#334155" />
            {/* Tunnel Arch */}
            <path d="M -14,2 L 14,-12 L 14,-28 Q 0,-34 -14,-18 Z" fill="#0f172a" />
            {/* Gold Nuggets spilling out */}
            <circle cx="3" cy="-4" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="-5" cy="-1" r="4" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <circle cx="10" cy="-7" r="3.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            {/* Mine Cart Rails */}
            <line x1="-12" y1="5" x2="16" y2="20" stroke="#78350f" strokeWidth="3" />
            <line x1="-8" y1="1" x2="20" y2="16" stroke="#78350f" strokeWidth="3" />
            {/* Wooden Derrick & Hoist for Lv2+ */}
            {level >= 2 && (
              <g>
                <line x1="-18" y1="-35" x2="-18" y2="-65" stroke="#a16207" strokeWidth="3" />
                <line x1="18" y1="-45" x2="18" y2="-75" stroke="#a16207" strokeWidth="3" />
                <line x1="-18" y1="-65" x2="18" y2="-75" stroke="#ca8a04" strokeWidth="3" />
                <circle cx="0" cy="-70" r="6" fill="#f59e0b" />
              </g>
            )}
            {level >= 3 && (
              <g transform="translate(18, 5)">
                <rect x="-8" y="-6" width="16" height="12" fill="#b45309" stroke="#78350f" strokeWidth="1.5" rx="2" />
                <circle cx="-3" cy="-3" r="3" fill="#fde047" />
                <circle cx="3" cy="-2" r="3" fill="#facc15" />
              </g>
            )}
          </g>
        );

      case 'forge':
        return (
          <g className="building-svg-group">
            {/* Stone / Anvil base */}
            <path d="M 0,-25 L 45,-3 L 0,20 L -45,-3 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <path d="M 0,-22 L 40,-3 L 0,16 L -40,-3 Z" fill="#64748b" />
            {/* Brick Workshop */}
            <path d="M -30,-8 L 0,10 L 30,-8 L 30,-48 L 0,-30 L -30,-48 Z" fill="#7c2d12" stroke="#431407" strokeWidth="2" />
            <path d="M 0,10 L 30,-8 L 30,-48 L 0,-30 Z" fill="#9a3412" />
            {/* Chimney with Fire & Smoke */}
            <rect x="14" y="-72" width="12" height="32" fill="#475569" stroke="#334155" strokeWidth="2" />
            {/* Glowing Furnace Window */}
            <ellipse cx="-2" cy="-8" rx="8" ry="12" fill="#ea580c" />
            <ellipse cx="-2" cy="-8" rx="5" ry="8" fill="#fde047" className="fire-flicker" />
            {/* Roof */}
            <path d="M 0,-65 L 35,-42 L 0,-18 L -35,-42 Z" fill="#581c87" stroke="#3b0764" strokeWidth="2" />
            <path d="M 0,-65 L 35,-42 L 0,-18 Z" fill="#6b21a8" />
            {/* Hammer / Gear emblem */}
            {level >= 2 && (
              <g transform="translate(-18, -35) scale(0.7)">
                <rect x="-2" y="-12" width="4" height="24" fill="#94a3b8" />
                <rect x="-8" y="-12" width="16" height="7" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
              </g>
            )}
            {level >= 3 && (
              <g className="smoke-puff">
                <circle cx="20" cy="-80" r="6" fill="#cbd5e1" opacity="0.6" />
                <circle cx="23" cy="-94" r="8" fill="#e2e8f0" opacity="0.4" />
              </g>
            )}
          </g>
        );

      case 'new_cottage_engine':
      case 'blacksmith_cottage':
        return (
          <g className="building-svg-group blacksmith-cottage-sprite">
            {/* Ground Shadow */}
            <ellipse cx="0" cy="15" rx="36" ry="18" fill="rgba(15, 23, 42, 0.45)" />

            {/* Base Stone Foundation */}
            <path d="M -32,5 L 0,22 L 32,5 L 32,-15 L 0,-32 L -32,-15 Z" fill="#475569" stroke="#1e293b" strokeWidth="2" />
            <path d="M 0,22 L 32,5 L 32,-15 L 0,2 Z" fill="#334155" />

            {/* Timber-Framed Upper Walls */}
            <path d="M -30,-14 L 0,3 L 30,-14 L 30,-48 L 0,-65 L -30,-48 Z" fill="#92400e" stroke="#451a03" strokeWidth="2" />
            <path d="M 0,3 L 30,-14 L 30,-48 L 0,-31 Z" fill="#78350f" />
            <path d="M -30,-14 L 0,3 L 0,-31 L -30,-48 Z" fill="#b45309" />

            {/* Half-timber cross beams */}
            <line x1="-30" y1="-48" x2="0" y2="3" stroke="#451a03" strokeWidth="1.5" />
            <line x1="0" y1="-65" x2="0" y2="3" stroke="#451a03" strokeWidth="2" />
            <line x1="0" y1="-31" x2="30" y2="-14" stroke="#451a03" strokeWidth="1.5" />

            {/* Cozy Gable Roof (Slate Shingles) */}
            <path d="M 0,-78 L 38,-55 L 0,-32 L -38,-55 Z" fill="#1e3a8a" stroke="#0f172a" strokeWidth="2" />
            <path d="M 0,-78 L 38,-55 L 0,-32 Z" fill="#172554" />

            {/* Stone Chimney with Smoke */}
            <rect x="14" y="-85" width="10" height="25" fill="#64748b" stroke="#334155" strokeWidth="1.5" />
            <g className="smoke-puff">
              <circle cx="19" cy="-92" r="4" fill="#cbd5e1" opacity="0.6" />
              <circle cx="22" cy="-102" r="6" fill="#e2e8f0" opacity="0.4" />
            </g>

            {/* Warm Glowing Workshop Window */}
            <ellipse cx="-12" cy="-22" rx="6" ry="8" fill="#f59e0b" stroke="#78350f" strokeWidth="1.5" />
            <ellipse cx="-12" cy="-22" rx="3" ry="5" fill="#fef08a" opacity="0.9" />

            {/* Wooden Entrance Door */}
            <path d="M -4,15 L 4,11 L 4,-3 L -4,1 Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`building-sprite ${isSelected ? 'selected' : ''}`}>
      <svg 
        viewBox="-80 -140 160 180" 
        width="160" 
        height="180" 
        className="building-svg"
      >
        {/* Selection indicator under building */}
        {isSelected && (
          <ellipse cx="0" cy="5" rx="50" ry="25" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6,4" />
        )}
        {renderBuilding()}
      </svg>
      <div className="building-badge-container">
        <span className="building-level-badge">רמה {level}</span>
      </div>
    </div>
  );
}
