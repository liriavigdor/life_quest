import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Trash2, 
  Sparkles, 
  Plus, 
  Tag, 
  Info, 
  ExternalLink, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { AUDITED_VERIFIED_POOL, AUDITED_REJECTED_POOL } from '../data/auditedImagesPool';

export function AuditedMnemonicPoolView({ 
  mode = 'verified', // 'verified' | 'rejected'
  onPromoteToUserRepo = null 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [promotedIds, setPromotedIds] = useState(() => new Set(AUDITED_VERIFIED_POOL.map(i => i.id)));

  const isVerifiedMode = mode === 'verified';
  const rawList = isVerifiedMode ? AUDITED_VERIFIED_POOL : AUDITED_REJECTED_POOL;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    rawList.forEach(item => {
      const cat = item.category || item.originalCategory;
      if (cat) set.add(cat);
    });
    return ['all', ...Array.from(set)];
  }, [rawList]);

  // Filtered items
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return rawList.filter(item => {
      const title = (item.name || item.originalName || '').toLowerCase();
      const cat = (item.category || item.originalCategory || '').toLowerCase();
      const branches = (item.branches || []).map(b => String(b).toLowerCase());
      const reason = (item.rejectionReason || '').toLowerCase();
      const notes = (item.visualNotes || '').toLowerCase();

      const matchesSearch = !q || 
        title.includes(q) || 
        cat.includes(q) || 
        branches.some(b => b.includes(q)) || 
        reason.includes(q) || 
        notes.includes(q);

      const matchesCat = selectedCategory === 'all' || 
        (item.category || item.originalCategory) === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [rawList, searchQuery, selectedCategory]);

  const handlePromote = async (item) => {
    if (!onPromoteToUserRepo) return;
    try {
      await onPromoteToUserRepo({
        title: item.name,
        imageUrl: item.imageUrl,
        keywords: item.branches,
        caption: item.visualNotes,
        domain: 'objects',
        source: 'ai_audited_verified',
        isUserApproved: true,
        qualityScore: item.qualityScore || 100
      });
      setPromotedIds(prev => new Set([...prev, item.id]));
    } catch (err) {
      console.error('Error promoting audited item to user repository:', err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner / Description */}
      <div 
        style={{
          backgroundColor: isVerifiedMode ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isVerifiedMode ? '#10b981' : '#ef4444'}`,
          borderRadius: '16px',
          padding: '18px 22px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            {isVerifiedMode ? (
              <ShieldCheck size={24} style={{ color: '#10b981' }} />
            ) : (
              <Trash2 size={24} style={{ color: '#ef4444' }} />
            )}
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc' }}>
              {isVerifiedMode 
                ? `מאגר תמונות שנבדקו ע״י AI (${rawList.length} תמונות מאומתות)`
                : `מאגר תמונות פסולות למחיקה (${rawList.length} תמונות שלא עמדו בסטנדרט)`}
            </h2>
          </div>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.88rem', lineHeight: '1.5' }}>
            {isVerifiedMode
              ? 'תמונות אלו עברו ניתוח חזותי פרטני: נקיות מסימני מים, צילומים אותנטיים, ובעלות שורש וענפים מנומקים למשימות יומיומיות.'
              : 'תמונות שנפסלו על ידי המודל בניתוח חזותי עמוק: חוברות נייר, שרטוטים מכניים שגויים, סימני מים מסחריים (Alamy/Dreamstime), קולאז\'ים וכרזות פרסומת.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span 
            style={{
              backgroundColor: isVerifiedMode ? '#065f46' : '#7f1d1d',
              color: isVerifiedMode ? '#6ee7b7' : '#fca5a5',
              padding: '6px 14px',
              borderRadius: '999px',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            מחזור בדיקה: סבב 1 (100 ראשונות)
          </span>
        </div>
      </div>

      {/* Search & Categories Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={18} 
            style={{ position: 'absolute', right: '12px', top: '12px', color: '#94a3b8' }} 
          />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isVerifiedMode ? "חפש בתמונות המאומתות לפי שם, ענף או קטגוריה..." : "חפש בתמונות הפסולות לפי שם או סיבת פסילה..."}
            style={{
              width: '100%',
              padding: '10px 40px 10px 14px',
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '10px',
              color: '#f8fafc',
              fontSize: '0.9rem',
              fontFamily: 'Rubik, sans-serif'
            }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat 
                  ? (isVerifiedMode ? '#059669' : '#dc2626') 
                  : '#1e293b',
                color: selectedCategory === cat ? '#ffffff' : '#94a3b8',
                border: selectedCategory === cat 
                  ? `1px solid ${isVerifiedMode ? '#10b981' : '#ef4444'}` 
                  : '1px solid #334155',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'all' ? 'הכל' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94a3b8' }}>
          לא נמצאו תמונות התואמות לחיפוש הנוכחי
        </div>
      ) : (
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredItems.map(item => {
            const isPromoted = promotedIds.has(item.id);

            return (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#1e293b',
                  border: isVerifiedMode ? '1px solid #334155' : '1px solid rgba(239, 68, 68, 0.4)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 6px 18px rgba(0,0,0,0.3)',
                  transition: 'transform 0.15s, box-shadow 0.15s'
                }}
              >
                {/* Image preview box */}
                <div 
                  style={{
                    height: '180px',
                    backgroundColor: '#0a0f1d',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name || item.originalName}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />

                  {/* Status Overlay Badge */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: isVerifiedMode ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '4px 8px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {isVerifiedMode ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                    <span>{isVerifiedMode ? 'מאומת AI' : 'פסול למחיקה'}</span>
                  </div>

                  {/* Category Pill */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#cbd5e1',
                      borderRadius: '6px',
                      padding: '3px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    {item.category || item.originalCategory}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                      {item.name || item.originalName}
                    </h3>
                    {isVerifiedMode && (
                      <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>
                        ⭐ 100% איכות
                      </span>
                    )}
                  </div>

                  {/* Verified mode: Root & Branches */}
                  {isVerifiedMode && (
                    <>
                      <div>
                        <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 700, marginBottom: '5px' }}>
                          ענפים (אסוציאציות יומיומיות ממוקדות):
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(item.branches || []).map((b, bIdx) => (
                            <span
                              key={bIdx}
                              style={{
                                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                color: '#93c5fd',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '6px',
                                padding: '2px 8px',
                                fontSize: '0.76rem',
                                fontWeight: 700
                              }}
                            >
                              #{b}
                            </span>
                          ))}
                        </div>
                      </div>

                      {item.visualNotes && (
                        <div style={{ fontSize: '0.78rem', color: '#cbd5e1', backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', border: '1px solid #334155', lineHeight: '1.4' }}>
                          <span style={{ color: '#38bdf8', fontWeight: 700 }}>🔍 בדיקה ויזואלית: </span>
                          {item.visualNotes}
                        </div>
                      )}

                      {onPromoteToUserRepo && (
                        <button
                          onClick={() => handlePromote(item)}
                          disabled={isPromoted}
                          style={{
                            marginTop: 'auto',
                            backgroundColor: isPromoted ? '#334155' : '#059669',
                            color: isPromoted ? '#94a3b8' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '8px 14px',
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            cursor: isPromoted ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isPromoted ? (
                            <>
                              <CheckCircle2 size={15} />
                              <span>נוסף למאגר שלך!</span>
                            </>
                          ) : (
                            <>
                              <Plus size={15} />
                              <span>הוסף למאגר שלי</span>
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}

                  {/* Rejected mode: Explanation Box */}
                  {!isVerifiedMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      <div 
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid #ef4444',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f87171', fontWeight: 800, fontSize: '0.82rem' }}>
                          <AlertTriangle size={15} />
                          <span>סיבת הפסילה:</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#fecaca', lineHeight: '1.4' }}>
                          {item.rejectionReason}
                        </div>
                      </div>

                      {item.visualNotes && (
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8', backgroundColor: '#0f172a', padding: '8px 10px', borderRadius: '8px', border: '1px solid #334155', lineHeight: '1.4' }}>
                          <span style={{ color: '#e2e8f0', fontWeight: 700 }}>👁️ מה נראה בפועל: </span>
                          {item.visualNotes}
                        </div>
                      )}

                      {item.suggestedFix && (
                        <div style={{ fontSize: '0.78rem', color: '#fde68a', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)', lineHeight: '1.4', marginTop: 'auto' }}>
                          <span style={{ fontWeight: 700 }}>💡 הצעה לתיקון: </span>
                          {item.suggestedFix}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

