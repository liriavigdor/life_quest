import React, { useState, useEffect } from 'react';
import { X, Sparkles, Trophy, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';

export function AnimatedPalaceStoryBook({
  isOpen,
  storyText = '',
  onClose
}) {
  const [isBookOpen, setIsBookOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsBookOpen(false);
      return;
    }

    // Smooth opening transition after entrance
    const timer = setTimeout(() => {
      setIsBookOpen(true);
      sounds.playBookOpen?.();

      try {
        confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#fbbf24', '#f59e0b', '#d97706', '#fef08a']
        });
      } catch (_) {}
    }, 450);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReplay = (e) => {
    e.stopPropagation();
    setIsBookOpen(false);
    setTimeout(() => {
      setIsBookOpen(true);
      sounds.playBookOpen?.();
    }, 350);
  };

  const handleFinish = (e) => {
    e.stopPropagation();
    sounds.playFanfare?.();
    onClose?.();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        backgroundColor: 'rgba(6, 9, 18, 0.94)',
        backdropFilter: 'blur(16px)',
        userSelect: 'none',
        overflowY: 'auto',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      {/* Top Floating Bar */}
      <div 
        style={{
          width: '100%',
          maxWidth: '860px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 16px',
          marginBottom: '8px',
          boxSizing: 'border-box',
          margin: '0 auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fcd34d', fontWeight: 900, fontSize: '0.95rem' }}>
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>ספר הזיכרונות של הארמון 🏰</span>
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '8px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#cbd5e1',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="סגור"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Centered Symmetrical 3D Book Stage */}
      <div 
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '860px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: 'auto auto',
          padding: '8px 0',
          perspective: '1800px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Closed Book State (Shown before opening) */}
        {!isBookOpen && (
          <div 
            className="relative rounded-3xl flex flex-col items-center justify-center p-10 text-center shadow-[0_30px_90px_rgba(0,0,0,0.95),0_0_60px_rgba(245,158,11,0.3)] transition-all duration-700 animate-pulse cursor-pointer"
            style={{
              width: 'min(90vw, 440px)',
              minHeight: '520px',
              backgroundColor: '#1c140e',
              backgroundImage: 'radial-gradient(circle at 50% 35%, #2d1d13 0%, #120c08 100%)',
              border: '4px solid #f59e0b',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.9), 0 25px 80px rgba(0,0,0,0.95)'
            }}
            onClick={() => {
              setIsBookOpen(true);
              sounds.playBookOpen?.();
            }}
          >
            {/* Ornamental Gold Inlays */}
            <div className="absolute inset-4 rounded-2xl border-2 border-amber-500/40 pointer-events-none" />
            <div className="absolute inset-7 rounded-xl border border-amber-400/20 pointer-events-none" />

            {/* Corner Brass Plates */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

            {/* Center Royal Seal */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-1 shadow-2xl flex items-center justify-center mb-6">
              <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-400 shadow-inner">
                <Trophy className="w-12 h-12 text-amber-400" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-amber-300 tracking-wider mb-3 drop-shadow-md">
              ספר הזיכרון
            </h2>
            <p className="text-xs md:text-sm text-amber-200/80 font-bold max-w-xs leading-relaxed">
              העוגנים שזורים בסיפור חי שננעל בזיכרון
            </p>

            <div className="mt-8 px-6 py-2.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black tracking-wider shadow-lg">
              ✨ נפתח כעת... ✨
            </div>
          </div>
        )}

        {/* Opened Book State (Centered, Symmetrical, Grand Folio Spread) */}
        {isBookOpen && (
          <div 
            className="relative rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.95),0_0_80px_rgba(245,158,11,0.25)] flex flex-col justify-between overflow-hidden transition-all duration-700 animate-scale-in"
            style={{
              width: 'min(94vw, 860px)',
              minHeight: '480px',
              backgroundColor: '#faf2dc',
              backgroundImage: 'radial-gradient(circle at 50% 50%, #fbf5e6 0%, #f5ebd0 100%)',
              border: '6px solid #854d0e',
              outline: '2px solid #fbbf24',
              boxShadow: 'inset 0 0 60px rgba(180,83,9,0.18), 0 35px 90px rgba(0,0,0,0.95)'
            }}
          >
            {/* Dark Leather Spine Rim Backing */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none shadow-[inset_0_0_35px_rgba(69,26,3,0.3)]" />

            {/* Subtle Center Gutter / Spine Fold Shadow */}
            <div 
              className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to right, rgba(120,53,15,0.15) 0%, rgba(120,53,15,0.02) 40%, rgba(120,53,15,0.02) 60%, rgba(120,53,15,0.15) 100%)'
              }}
            />

            {/* Royal Crimson Satin Ribbon Bookmark */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-28 pointer-events-none z-20 rounded-b shadow-md"
              style={{
                background: 'linear-gradient(to right, #991b1b, #dc2626 50%, #7f1d1d)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.45)'
              }}
            >
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[8px] border-t-red-900 absolute bottom-0 left-0 right-0 m-auto" />
            </div>

            {/* Top Ornamental Header */}
            <div className="relative z-10 px-8 pt-8 pb-3 flex items-center justify-between border-b border-amber-900/20 text-center">
              <span className="text-amber-800/40 text-sm font-serif select-none">❧ § ☙</span>
              <div className="flex items-center gap-2">
                <span className="text-amber-900 font-black text-sm md:text-base tracking-widest uppercase">
                  📜 סיפור הדרך של הארמון
                </span>
              </div>
              <span className="text-amber-800/40 text-sm font-serif select-none">❧ § ☙</span>
            </div>

            {/* Core Center Area: THE STORY AND ONLY THE STORY */}
            <div 
              className="relative z-10 my-auto px-6 md:px-16 py-8 text-center flex flex-col items-center justify-center"
              dir="rtl"
            >
              <div className="text-amber-700/30 text-5xl md:text-6xl font-serif select-none leading-none mb-2">
                ❝
              </div>

              {/* The Grand Master Story */}
              <div 
                className="font-extrabold leading-relaxed tracking-tight select-text text-stone-900"
                style={{
                  fontSize: 'clamp(1.4rem, 2.9vw, 2.25rem)',
                  lineHeight: '1.7',
                  color: '#1c1917',
                  textShadow: '0 1px 2px rgba(245,158,11,0.25)',
                  maxWidth: '740px'
                }}
              >
                {storyText}
              </div>

              <div className="text-amber-700/30 text-5xl md:text-6xl font-serif select-none leading-none mt-2">
                ❞
              </div>
            </div>

            {/* Bottom Calligraphic Footer */}
            <div className="relative z-10 px-8 pb-6 pt-2 flex items-center justify-center border-t border-amber-900/15">
              <span className="text-amber-800/60 font-serif text-xs md:text-sm tracking-widest select-none">
                ~ חקוק בזיכרון לנצח כסרט חי ~
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Controls (Clean, Centered, Visible) */}
      <div 
        style={{
          width: '100%',
          maxWidth: '860px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          paddingTop: '16px',
          marginTop: '8px',
          margin: '8px auto 0 auto',
          boxSizing: 'border-box',
          flexWrap: 'wrap'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleReplay}
          className="px-6 py-3 rounded-2xl bg-stone-900/90 hover:bg-stone-800 border-2 border-amber-500/40 text-amber-300 font-extrabold text-sm flex items-center gap-2 transition active:scale-95 shadow-lg"
        >
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>פתח ספר מחדש 📖</span>
        </button>

        <button
          onClick={handleFinish}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:brightness-110 text-white font-black text-base flex items-center justify-center gap-3 transition active:scale-95 shadow-[0_10px_30px_rgba(16,185,129,0.5)] border border-emerald-300/40"
        >
          <span>נחרט בזיכרון — הושלם בהצלחה! 🏆</span>
        </button>
      </div>
    </div>
  );
}

export default AnimatedPalaceStoryBook;
