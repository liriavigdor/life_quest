import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Trash2, 
  Plus
} from 'lucide-react';
import { sounds } from '../utils/sound';
import { 
  getStoredDeposits, 
  buildHierarchyTree, 
  deleteDeposit,
  DEFAULT_VILLAGES,
  DEFAULT_HOUSES,
  HOUSE_CHAMBERS
} from '../utils/keyMethodStorage';
import { ActiveRecallLocker } from './ActiveRecallLocker';
import { ActiveRecallSingle } from './ActiveRecallSingle';

export function MemoryHierarchyTreeModal({
  isOpen,
  onClose,
  onOpenDepositForRoom
}) {
  const [deposits, setDeposits] = useState(() => getStoredDeposits());

  // Selected branch in tree (Village -> House)
  const [selectedVillageCipher, setSelectedVillageCipher] = useState('יער');
  const [selectedHouseCipher, setSelectedHouseCipher] = useState('אבק');

  // Currently inspected deposit (modal popup when clicking a leaf node)
  const [inspectedDeposit, setInspectedDeposit] = useState(null);

  // Sync deposits on window event
  useEffect(() => {
    const handleUpdate = () => {
      setDeposits(getStoredDeposits());
    };
    window.addEventListener('lifequest_deposits_updated', handleUpdate);
    return () => window.removeEventListener('lifequest_deposits_updated', handleUpdate);
  }, []);

  const treeData = useMemo(() => {
    return buildHierarchyTree(deposits);
  }, [deposits]);

  // Top tier roots: 🌲 ברוש, 🐑 כבשה, 🏠 בית
  const rootVillages = useMemo(() => {
    return [
      { id: 'forest', cipher: 'יער', word: 'ברוש', icon: '🌲', color: '#10b981' },
      { id: 'village', cipher: 'כפר', word: 'כבשה', icon: '🐑', color: '#f59e0b' },
      { id: 'city', cipher: 'עיר', word: 'בית', icon: '🏠', color: '#8b5cf6' }
    ];
  }, []);

  // Currently active village & house
  const activeVillageData = useMemo(() => {
    return treeData.find(v => v.cipher === selectedVillageCipher) || treeData[0];
  }, [treeData, selectedVillageCipher]);

  const activeHouseData = useMemo(() => {
    if (!activeVillageData) return null;
    return activeVillageData.houses.find(h => h.cipher === selectedHouseCipher) || activeVillageData.houses[0];
  }, [activeVillageData, selectedHouseCipher]);

  if (!isOpen) return null;

  const handleDelete = (e, depositId) => {
    e.stopPropagation();
    if (window.confirm('למחוק הפקדה זו?')) {
      sounds.playTap?.();
      deleteDeposit(depositId);
      setDeposits(getStoredDeposits());
      if (inspectedDeposit?.id === depositId) {
        setInspectedDeposit(null);
      }
    }
  };

  // Helper to count deposits in a house
  const getHouseDepositCount = (villageCipher, houseCipher) => {
    return deposits.filter(d => 
      (d.villageCipher === villageCipher) && (d.houseCipher === houseCipher)
    ).length;
  };

  // Helper to count deposits in a village
  const getVillageDepositCount = (villageCipher) => {
    return deposits.filter(d => d.villageCipher === villageCipher).length;
  };

  return (
    <div className="journal-backdrop hierarchy-tree-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="hierarchy-tree-modal minimal-tree-modal glass-card" onClick={e => e.stopPropagation()}>
        
        {/* Minimal Header */}
        <div className="minimal-tree-header">
          <div className="minimal-header-left">
            <span className="minimal-logo-icon">🌳</span>
            <span className="minimal-title">ארמון הזיכרון</span>
          </div>

          <div className="minimal-header-right">
            <button className="minimal-close-btn" onClick={onClose} title="סגור">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Minimal Tree Canvas */}
        <div className="minimal-tree-canvas">
          
          {/* LEVEL 1: TOP ROW (🌲 ברוש | 🐑 כבשה | 🏠 בית) & THEIR HOUSES */}
          <div className="minimal-tree-top-tier">
            {rootVillages.map(village => {
              const isVillageActive = village.cipher === selectedVillageCipher;
              const villageHouses = DEFAULT_HOUSES[village.id] || [];
              const villageTotal = getVillageDepositCount(village.cipher);

              return (
                <div key={village.id} className={`minimal-village-branch ${isVillageActive ? 'active' : ''}`}>
                  
                  {/* Top Root Node */}
                  <button
                    type="button"
                    className={`minimal-node root-pill ${isVillageActive ? 'selected' : ''}`}
                    onClick={() => {
                      sounds.playTap?.();
                      setSelectedVillageCipher(village.cipher);
                      if (villageHouses[0]) {
                        setSelectedHouseCipher(villageHouses[0].cipher);
                      }
                    }}
                    style={{ '--node-color': village.color }}
                  >
                    <span className="pill-emoji">{village.icon}</span>
                    <span className="pill-word">{village.word}</span>
                    {villageTotal > 0 && <span className="pill-badge">{villageTotal}</span>}
                  </button>

                  {/* SVG Fork Line to Houses */}
                  <div className="minimal-fork-svg-wrap">
                    <svg width="100%" height="24" viewBox="0 0 160 24" preserveAspectRatio="none">
                      <path 
                        d="M 80 0 L 80 12 M 40 12 L 120 12 M 40 12 L 40 24 M 120 12 L 120 24" 
                        stroke={isVillageActive ? village.color : '#475569'} 
                        strokeWidth="2" 
                        fill="none" 
                        opacity={isVillageActive ? "0.9" : "0.35"}
                      />
                    </svg>
                  </div>

                  {/* Level 2: Houses under this Root */}
                  <div className="minimal-houses-subrow">
                    {villageHouses.map(house => {
                      const isHouseActive = isVillageActive && (house.cipher === selectedHouseCipher);
                      const houseCount = getHouseDepositCount(village.cipher, house.cipher);

                      return (
                        <button
                          key={house.id}
                          type="button"
                          className={`minimal-node house-pill ${isHouseActive ? 'selected' : ''}`}
                          onClick={() => {
                            sounds.playTap?.();
                            setSelectedVillageCipher(village.cipher);
                            setSelectedHouseCipher(house.cipher);
                          }}
                        >
                          <span className="pill-emoji">{house.icon}</span>
                          <span className="pill-word">{house.shortName}</span>
                          {houseCount > 0 && <span className="pill-badge">{houseCount}</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* CONNECTOR: STEM FROM SELECTED HOUSE TO THE 4 ROOMS */}
          <div className="minimal-stem-to-rooms">
            <svg width="100%" height="34" viewBox="0 0 600 34" preserveAspectRatio="none">
              <path 
                d="M 300 0 L 300 16 M 75 16 L 525 16 M 75 16 L 75 34 M 225 16 L 225 34 M 375 16 L 375 34 M 525 16 L 525 34" 
                stroke="#38bdf8" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.8"
              />
            </svg>
          </div>

          {/* LEVEL 3: THE 4 ROOMS & THEIR LEAVES */}
          <div className="minimal-rooms-tier">
            {HOUSE_CHAMBERS.map(room => {
              const roomDeposits = activeHouseData?.rooms?.find(r => r.id === room.id)?.deposits || [];

              return (
                <div key={room.id} className="minimal-room-column">
                  
                  {/* Room Pill */}
                  <div 
                    className="minimal-node room-pill" 
                    style={{ '--room-color': room.color }}
                  >
                    <span className="pill-emoji">{room.emoji}</span>
                    <span className="pill-word">{room.shortName}</span>
                    {roomDeposits.length > 0 && (
                      <span className="pill-badge">{roomDeposits.length}</span>
                    )}
                  </div>

                  {/* Stem line down to leaves */}
                  <div className="minimal-leaf-stem"></div>

                  {/* Leaves (Deposits) */}
                  <div className="minimal-leaves-list">
                    {roomDeposits.length === 0 ? (
                      <button
                        type="button"
                        className="minimal-empty-leaf"
                        onClick={() => {
                          sounds.playTap?.();
                          if (onOpenDepositForRoom && activeVillageData && activeHouseData) {
                            onOpenDepositForRoom({
                              villageCipher: activeVillageData.cipher,
                              villageName: activeVillageData.name,
                              houseCipher: activeHouseData.cipher,
                              houseName: activeHouseData.name,
                              room
                            });
                          }
                        }}
                        title="הפקד פריט בחדר זה"
                      >
                        <Plus size={13} />
                      </button>
                    ) : (
                      roomDeposits.map(dep => {
                        const isList = dep.type === 'list';
                        const emoji = isList ? '🗄️' : '🗝️';
                        const word = dep.associationWord || (isList ? 'לוקר' : 'עוגן');

                        return (
                          <div 
                            key={dep.id} 
                            className={`minimal-node leaf-pill ${isList ? 'locker-leaf' : 'single-leaf'}`}
                            onClick={() => {
                              sounds.playTap?.();
                              setInspectedDeposit(dep);
                            }}
                            title={isList ? 'לחץ לפתיחת הלוקר' : 'לחץ לצפייה בעוגן'}
                          >
                            <span className="pill-emoji">{emoji}</span>
                            <span className="pill-word">{word}</span>
                            <button
                              type="button"
                              className="leaf-quick-del"
                              onClick={(e) => handleDelete(e, dep.id)}
                              title="מחק"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* POPUP MODAL: INSPECT PHYSICAL LOCKER OR SINGLE ANCHOR */}
        {inspectedDeposit && (
          <div className="minimal-inspect-overlay" onClick={() => setInspectedDeposit(null)}>
            <div className="minimal-inspect-card glass-card" onClick={e => e.stopPropagation()}>
              <div className="minimal-inspect-header">
                <div className="inspect-header-info">
                  <span className="inspect-tag">
                    {inspectedDeposit.type === 'list' ? '🗄️ ארונית לוקר' : '🗝️ עוגן בודד'}
                  </span>
                  <span className="inspect-path">
                    {inspectedDeposit.physicalChain || `${inspectedDeposit.villageCipher} ← ${inspectedDeposit.houseCipher} ← ${inspectedDeposit.associationWord}`}
                  </span>
                </div>
                <div className="inspect-header-actions">
                  <button 
                    type="button" 
                    className="delete-card-btn" 
                    onClick={(e) => handleDelete(e, inspectedDeposit.id)}
                    title="מחק הפקדה"
                  >
                    <Trash2 size={15} />
                  </button>
                  <button 
                    type="button" 
                    className="minimal-close-btn" 
                    onClick={() => setInspectedDeposit(null)}
                    title="סגור"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              <div className="minimal-inspect-body">
                {inspectedDeposit.type === 'list' ? (
                  <ActiveRecallLocker
                    items={inspectedDeposit.items || []}
                    criterion={inspectedDeposit.criterion}
                    associationWord={inspectedDeposit.associationWord}
                    villageCipher={inspectedDeposit.villageCipher}
                    houseCipher={inspectedDeposit.houseCipher}
                    compact={false}
                  />
                ) : (
                  <ActiveRecallSingle
                    itemName={inspectedDeposit.itemName}
                    associationWord={inspectedDeposit.associationWord}
                    villageCipher={inspectedDeposit.villageCipher}
                    houseCipher={inspectedDeposit.houseCipher}
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
