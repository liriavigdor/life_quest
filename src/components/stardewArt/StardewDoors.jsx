import React from 'react';
import { Lock, Unlock, Sparkles, Key } from 'lucide-react';
import { sounds } from '../../utils/sound';

/**
 * StardewDoors:
 * Authentic 2.5D Pixel-Art Wooden Cottage Doors installed at every interior corridor transition.
 * Locked doors physically seal passages and display golden keyhole locks.
 * Unlocking opens the door with smooth wood-creak and unlocks lighting in the connecting room.
 */
export const INTERIOR_DOORS_CONFIG = {
  door_c3: {
    id: 'door_c3',
    name: 'דלת האולם המרכזי',
    fromRoom: 'entry_foyer',
    toRoom: 'main_hall',
    fromRoomName: 'חדר הכניסה',
    toRoomName: 'האולם המרכזי',
    orientation: 'horizontal', // runs across N-S corridor C3
    x: 567,
    y: 355,
    w: 56,
    h: 38,
    requiredRoom: 'entry_foyer'
  },
  door_c1: {
    id: 'door_c1',
    name: 'דלת אגף שמאל (דחוף)',
    fromRoom: 'main_hall',
    toRoom: 'left_store',
    fromRoomName: 'האולם המרכזי',
    toRoomName: 'אגף שמאל',
    orientation: 'vertical', // runs across W-E corridor C1
    x: 395,
    y: 220,
    w: 24,
    h: 56,
    requiredRoom: 'main_hall'
  },
  door_c2: {
    id: 'door_c2',
    name: 'דלת אגף ימין (שגרה)',
    fromRoom: 'main_hall',
    toRoom: 'right_sanctuary',
    fromRoomName: 'האולם המרכזי',
    toRoomName: 'אגף ימין (צפון)',
    orientation: 'vertical', // runs across W-E corridor C2
    x: 775,
    y: 220,
    w: 24,
    h: 56,
    requiredRoom: 'main_hall'
  },
  door_east_south: {
    id: 'door_east_south',
    name: 'דלת חדר השלווה הדרומי',
    fromRoom: 'right_sanctuary',
    toRoom: 'right_south',
    fromRoomName: 'אגף ימין (צפון)',
    toRoomName: 'אגף ימין (דרום)',
    orientation: 'horizontal', // runs across N-S partition tunnel
    x: 970,
    y: 355,
    w: 56,
    h: 38,
    requiredRoom: 'right_sanctuary'
  }
};

export const StardewDoorsLayer = React.memo(function StardewDoorsLayer({
  doorsState = {},
  onDoorClick,
  onInspectLockedDoor
}) {
  return (
    <div 
      className="stardew-doors-layer" 
      style={{ 
        position: 'absolute', 
        left: 0, 
        top: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 25 
      }}
    >
      {Object.values(INTERIOR_DOORS_CONFIG).map((door) => {
        const isLocked = doorsState[door.id] !== false; // Locked by default
        const isH = door.orientation === 'horizontal';

        return (
          <div
            key={door.id}
            className={`stardew-corridor-door ${isLocked ? 'door-locked' : 'door-unlocked'} ${isH ? 'door-h' : 'door-v'}`}
            style={{
              position: 'absolute',
              left: `${door.x}px`,
              top: `${door.y}px`,
              width: `${door.w}px`,
              height: `${door.h}px`,
              pointerEvents: 'auto',
              cursor: isLocked ? 'pointer' : 'default'
            }}
            onClick={(e) => {
              e.stopPropagation();
              sounds.playTap?.();
              if (onDoorClick) {
                onDoorClick(door, isLocked);
              }
            }}
            title={isLocked 
              ? `${door.name} — 🔒 נעולה! לחץ לביצוע מבחן שליפה ב${door.fromRoomName} לפתיחת הדלת והארת ${door.toRoomName}` 
              : `${door.name} — פתוחה לרווחה ✨`}
          >
            {isLocked ? (
              /* LOCKED CLOSED WOODEN DOOR */
              <div className="door-panel-closed">
                {/* Heavy Oak Timber Frame */}
                <div className="door-timber-frame" />

                {/* Stardew Planks */}
                <div className="door-oak-planks">
                  <div className="plank-line" />
                  <div className="plank-line" />
                </div>

                {/* Iron Strap Hinges */}
                <div className="door-iron-strap strap-top" />
                <div className="door-iron-strap strap-bottom" />

                {/* Golden Padlock Emblem & Keyhole */}
                <div className="door-lock-emblem">
                  <Lock size={13} className="lock-icon" />
                  <div className="lock-glow-ring" />
                </div>

                {/* Interactive Prompt Chip on Hover */}
                <div className="door-hover-chip">
                  <span>🔒 שליטה ב{door.fromRoomName}</span>
                </div>
              </div>
            ) : (
              /* UNLOCKED OPEN DOOR */
              <div className="door-panel-opened">
                {/* Swung-back door leaf against jamb */}
                <div className="door-leaf-swung" />
                <div className="door-threshold-glow">
                  <Sparkles size={11} className="open-sparkle" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

