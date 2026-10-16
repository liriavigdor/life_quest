import React from 'react';
import { BUILDINGS_META } from '../data/gameData';
import { BuildingGraphics } from './BuildingGraphics';
import { sounds } from '../utils/sound';

export function VillageGrid({ buildings, selectedBuildingId, onSelectBuilding }) {
  // 6x6 Isometric Grid representation
  const GRID_SIZE = 6;
  const TILE_WIDTH = 110;
  const TILE_HEIGHT = 55;

  // Convert (x, y) grid coordinates to isometric screen coordinates
  const toIso = (x, y) => {
    return {
      screenX: (x - y) * (TILE_WIDTH / 2),
      screenY: (x + y) * (TILE_HEIGHT / 2)
    };
  };

  // Build grid tiles
  const tiles = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const { screenX, screenY } = toIso(x, y);
      
      // Determine tile appearance: paths, grass, flowers
      const isPath = (x === 2 || y === 2);
      const isCorner = (x === 0 && y === 0) || (x === 5 && y === 5);
      
      tiles.push({
        x,
        y,
        screenX,
        screenY,
        isPath,
        isCorner
      });
    }
  }

  return (
    <div className="village-viewport">
      {/* Background Ambience */}
      <div className="ambient-clouds">
        <div className="cloud cloud-1"></div>
        <div className="cloud cloud-2"></div>
      </div>

      <div className="iso-stage">
        {/* Render Ground Tiles */}
        <div className="iso-grid-layer">
          {tiles.map((tile) => (
            <div
              key={`tile-${tile.x}-${tile.y}`}
              className={`iso-tile ${tile.isPath ? 'path-tile' : 'grass-tile'}`}
              style={{
                transform: `translate(${tile.screenX}px, ${tile.screenY}px)`
              }}
            >
              <svg viewBox="0 0 110 55" width="110" height="55" className="tile-svg">
                {/* Isometric diamond */}
                <polygon 
                  points="55,0 110,27.5 55,55 0,27.5" 
                  fill={tile.isPath ? '#a16207' : '#22c55e'} 
                  stroke={tile.isPath ? '#78350f' : '#15803d'} 
                  strokeWidth="1.2"
                />
                {/* Tile texture / shading */}
                <polygon 
                  points="55,4 102,27.5 55,51 8,27.5" 
                  fill={tile.isPath ? '#ca8a04' : '#4ade80'} 
                  opacity="0.8"
                />
                {/* Decorative flowers / rocks on some grass tiles */}
                {!tile.isPath && (tile.x + tile.y) % 3 === 0 && (
                  <circle cx="55" cy="28" r="3" fill="#fef08a" />
                )}
                {!tile.isPath && (tile.x * tile.y) % 5 === 2 && (
                  <circle cx="45" cy="32" r="2.5" fill="#f43f5e" />
                )}
              </svg>
            </div>
          ))}
        </div>

        {/* Render Buildings placed on the grid */}
        <div className="iso-buildings-layer">
          {Object.entries(BUILDINGS_META).map(([bKey, meta]) => {
            const buildingData = buildings[bKey] || { level: 1 };
            // Position based on gridPos
            const { screenX, screenY } = toIso(meta.gridPos.x, meta.gridPos.y);
            // Center building on its footprint
            const offsetX = meta.size.w > 1 ? 25 : 0;
            const offsetY = meta.size.h > 1 ? -15 : 0;
            const isSelected = selectedBuildingId === bKey;

            return (
              <div
                key={bKey}
                className={`building-container ${isSelected ? 'is-focused' : ''}`}
                style={{
                  transform: `translate(${screenX + offsetX}px, ${screenY + offsetY}px)`,
                  zIndex: 20 + (meta.gridPos.x + meta.gridPos.y) * 10
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  onSelectBuilding(bKey);
                }}
              >
                <BuildingGraphics 
                  type={bKey} 
                  level={buildingData.level} 
                  isSelected={isSelected}
                />
                <div className="building-title-pill">
                  {meta.name.split(' (')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
