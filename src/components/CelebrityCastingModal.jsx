import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Sparkles, 
  RotateCcw, 
  X, 
  Play, 
  ChevronRight, 
  ChevronLeft,
  Eye,
  Crown,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { 
  CELEBRITIES
} from '../data/celebrityMnemonicCatalog';
import {
  CULTURAL_SCENARIOS,
  weaveDeterministicStory
} from '../utils/deterministicStoryEngine';

export function CelebrityCastingModal({
  isOpen,
  onClose,
  initialItems = ['משקפי שמש', 'טלפון נייד', 'חולצה נקייה', 'בקבוק מים', 'צרור מפתחות'],
  onStartJourney
}) {
  const [items, setItems] = useState(initialItems);
  const [selectedScenarioId, setSelectedScenarioId] = useState('red_ferrari_roadtrip');
  const [activeStep, setActiveStep] = useState(0); // 0 = Items & Scenario, 1 = Guided Imagery Preview, 2 = Grand Finale Story
  const [swappingIndex, setSwappingIndex] = useState(null);
  const [customOverrides, setCustomOverrides] = useState({});

  // Generate complete deterministic narrative binding
  const storyResult = useMemo(() => {
    const res = weaveDeterministicStory(items, selectedScenarioId);
    if (!res) return null;

    // Apply any custom celebrity swaps chosen by the user
    const updatedStations = res.stations.map((st, idx) => {
      if (customOverrides[idx]) {
        const celeb = customOverrides[idx];
        return {
          ...st,
          celebrity: celeb,
          roomSensoryGuidedPrompt: `עצום עיניים לרגע: דמיין שאתה בתוך ${res.scenario.title}. שם עומד ${celeb.name} (${celeb.nickname}). הוא ${st.naturalActionText}! הרגש את הטמפרטורה, את ${res.scenario.soundAtmosphere}, ואת התנועה שלו עם ה-${st.itemTitle}.`
        };
      }
      return st;
    });

    return {
      ...res,
      stations: updatedStations
    };
  }, [items, selectedScenarioId, customOverrides]);

  const handleItemChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleAddItem = () => {
    if (items.length >= 7) return;
    setItems([...items, `פריט ${items.length + 1}`]);
    sounds?.click?.();
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 3) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    setCustomOverrides({});
    sounds?.click?.();
  };

  // Swap a specific station's character
  const handleSwapCelebrity = (stationIndex, newCelebrity) => {
    setCustomOverrides(prev => ({
      ...prev,
      [stationIndex]: newCelebrity
    }));
    setSwappingIndex(null);
    sounds?.pop?.();
  };

  if (!isOpen || !storyResult) return null;

  const currentScenario = storyResult.scenario;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border-4 overflow-hidden text-right"
        style={{
          backgroundColor: '#1e1b18',
          borderColor: '#855118',
          color: '#fef3c7'
        }}
        dir="rtl"
      >
        {/* Header Bar */}
        <div 
          className="flex items-center justify-between px-5 py-4 border-b-2"
          style={{ backgroundColor: '#2a2015', borderColor: '#855118' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 flex items-center gap-2">
                אלגוריתם סיפורי דטרמיניסטי 🎭
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-900/60 text-amber-200 border border-amber-600/40">
                  {items.length} חדרים
                </span>
              </h2>
              <p className="text-xs text-amber-200/70">
                סלבריטאים אסוציאטיביים • שילוב חפצים חכם ללא תחפושת • עוגן תרבותי חקוק בזיכרון
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds?.click?.();
              onClose();
            }}
            className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-900/40 hover:text-amber-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Stepper */}
        <div className="flex border-b border-amber-800/40 bg-stone-900/80 px-4 pt-2 gap-2 text-sm">
          <button
            onClick={() => setActiveStep(0)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition border-b-2 ${
              activeStep === 0
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-inner'
                : 'text-amber-200/60 border-transparent hover:text-amber-100'
            }`}
          >
            <span>1. הרשימה והעוגן התרבותי</span>
            <span className="text-xs px-1.5 py-0.2 rounded bg-amber-800/50">{items.length}</span>
          </button>

          <button
            onClick={() => setActiveStep(1)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition border-b-2 ${
              activeStep === 1
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-inner'
                : 'text-amber-200/60 border-transparent hover:text-amber-100'
            }`}
          >
            <span>2. דימיון מודרך בחדרים</span>
            <Eye className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => setActiveStep(2)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-bold transition border-b-2 ${
              activeStep === 2
                ? 'bg-amber-950/80 text-amber-300 border-amber-500 shadow-inner'
                : 'text-amber-200/60 border-transparent hover:text-amber-100'
            }`}
          >
            <span>3. סיפור השיא המאחד</span>
            <Crown className="w-4 h-4 text-yellow-400" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* STEP 0: Items & Scenario */}
          {activeStep === 0 && (
            <div className="space-y-6">
              {/* Cultural Scenario Selector (Thematic Arena) */}
              <div className="p-4 rounded-xl bg-black/40 border border-amber-900/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-amber-400" />
                    בחר עוגן תרבותי מוביל (הסיטואציה שנחרטת בזיכרון):
                  </span>
                  <span className="text-[11px] text-amber-400/80">
                    {currentScenario.culturalIcon}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {CULTURAL_SCENARIOS.map((sc) => (
                    <button
                      key={sc.id}
                      onClick={() => {
                        setSelectedScenarioId(sc.id);
                        setCustomOverrides({});
                        sounds?.click?.();
                      }}
                      className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between ${
                        selectedScenarioId === sc.id
                          ? 'bg-amber-600/30 border-amber-400 shadow-md ring-1 ring-amber-400'
                          : 'bg-stone-900/70 border-amber-900/40 hover:bg-stone-800'
                      }`}
                    >
                      <div className="font-bold text-xs text-amber-100 mb-1">
                        {sc.title}
                      </div>
                      <div className="text-[10px] text-amber-300/70 line-clamp-2">
                        {sc.settingDescription}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Station Rows */}
              <div className="space-y-3">
                {storyResult.stations.map((station, index) => {
                  const celeb = station.celebrity;
                  return (
                    <div
                      key={index}
                      className="relative flex flex-col md:flex-row items-center justify-between gap-3 p-3.5 rounded-xl border transition"
                      style={{
                        backgroundColor: '#261e16',
                        borderColor: celeb?.themeColor || '#855118'
                      }}
                    >
                      {/* Room Order & Item Input */}
                      <div className="flex items-center gap-3 w-full md:w-5/12">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shrink-0 border"
                          style={{
                            backgroundColor: celeb?.themeColor || '#b45309',
                            color: '#ffffff',
                            borderColor: celeb?.accentColor || '#f59e0b'
                          }}
                        >
                          {station.order}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-0.5">
                            <label className="text-[11px] text-amber-300 font-bold">
                              חדר {station.order} • פריט:
                            </label>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/90 text-amber-300 border border-amber-700/50">
                              {station.roleName}
                            </span>
                          </div>
                          <input
                            type="text"
                            value={station.itemTitle}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            className="w-full text-sm font-bold px-3 py-1.5 rounded-lg bg-black/50 border border-amber-700/60 text-amber-100 focus:outline-none focus:border-amber-400"
                            placeholder="מה תרצה לזכור בחדר הזה?"
                          />
                        </div>
                      </div>

                      {/* Celebrity Character Card */}
                      <div className="flex items-center justify-between w-full md:w-7/12 p-2 rounded-lg bg-black/40 border border-amber-900/40 gap-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="text-3xl shrink-0">{celeb.emoji}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-amber-200 text-sm truncate">
                                {celeb.name}
                              </span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-amber-950 text-amber-300 border border-amber-700/50">
                                {celeb.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-emerald-300/90 font-medium truncate">
                              ✨ פעולה טבעית: {station.naturalActionText}
                            </div>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setSwappingIndex(swappingIndex === index ? null : index)}
                            className="text-xs px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-700/60 flex items-center gap-1 transition"
                            title="בחר דמות אחרת לחדר זה"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-400" />
                            החלף שחקן
                          </button>

                          {items.length > 3 && (
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="text-xs p-1 text-red-400/70 hover:text-red-300 transition"
                              title="הסר חדר"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Swap Character Picker Dropdown */}
                      {swappingIndex === index && (
                        <div className="w-full mt-2 p-3 rounded-xl bg-stone-950 border-2 border-amber-500 shadow-2xl animate-fade-in">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-900/40">
                            <span className="text-xs font-bold text-amber-300">
                              בחר דמות חלופית עבור חדר {station.order} ({station.itemTitle}):
                            </span>
                            <button 
                              onClick={() => setSwappingIndex(null)}
                              className="text-amber-400 text-xs hover:underline"
                            >
                              סגור
                            </button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
                            {CELEBRITIES.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => handleSwapCelebrity(index, c)}
                                className={`flex items-center gap-2 p-2 rounded-lg border text-right transition ${
                                  c.id === celeb.id
                                    ? 'bg-amber-600/30 border-amber-400 text-amber-100 font-bold'
                                    : 'bg-stone-900/80 border-amber-900/30 text-amber-200 hover:bg-stone-800'
                                }`}
                              >
                                <span className="text-xl">{c.emoji}</span>
                                <div className="text-[11px] truncate">
                                  <div className="font-bold">{c.name}</div>
                                  <div className="text-[9px] text-amber-400/70">{c.categoryLabel}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Room Item Button */}
              {items.length < 7 && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={handleAddItem}
                    className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-amber-950/80 hover:bg-amber-900 border border-dashed border-amber-600/60 text-amber-300 transition"
                  >
                    + הוסף חדר נוסף לרשימה (עד 7 חדרים)
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 1: Guided Sensory Imagery Previews */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 leading-relaxed">
                <span className="font-black text-amber-300">💡 שילוב חפצים חכם ללא תחפושת (Natural Prop Immersion):</span>
                <br />
                החפצים שלך משתלבים באופן טבעי בתוך הסיטואציה (מרכיבים משקפי שמש, שותים מים, מסובבים מפתחות ברכב). המוח זוכר את הפעולה והחוויה החושית בלי צורך להמציא מפלצות מלאכותיות.
              </div>

              <div className="space-y-3">
                {storyResult.stations.map((station, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border bg-black/40 space-y-2"
                    style={{ borderColor: station.celebrity.themeColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{station.celebrity.emoji}</span>
                        <span className="font-bold text-amber-200 text-sm">
                          חדר {station.order}: {station.celebrity.name} • {station.celebrity.nickname}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                          {station.roleName}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold border border-amber-700/40">
                          {station.itemTitle}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-stone-900/90 border border-amber-900/30 text-amber-100/90 text-sm leading-relaxed">
                      {station.roomSensoryGuidedPrompt}
                    </div>

                    <div className="text-[11px] text-amber-400/80 italic">
                      ציטוט עוגן: {station.catchphrase}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Grand Finale Preview */}
          {activeStep === 2 && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-950/90 via-stone-900 to-amber-950 border-2 border-amber-500 shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <Crown className="w-7 h-7 text-yellow-400" />
                  <div>
                    <h3 className="text-lg font-black text-amber-300">
                      {storyResult.headline}
                    </h3>
                    <p className="text-xs text-amber-200/80">
                      עוגן תרבותי: {currentScenario.culturalIcon} • {items.length} תחנות זיכרון
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-black/60 border border-amber-700/50 text-amber-100 text-base leading-relaxed font-serif whitespace-pre-line">
                  {storyResult.grandFinaleStory}
                </div>
              </div>

              {/* AI Image Generation Background Spec */}
              <div className="p-4 rounded-xl bg-black/40 border border-amber-900/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    פרומפט ויזואלי לתמונת ה-AI (מופק ברקע במהלך הסיור):
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-600/40">
                    Async Pre-fetch Ready
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 font-mono bg-black/60 p-2.5 rounded-lg border border-stone-800 break-words dir-ltr text-left">
                  {storyResult.aiVisualPrompt}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div 
          className="flex items-center justify-between px-5 py-4 border-t-2"
          style={{ backgroundColor: '#2a2015', borderColor: '#855118' }}
        >
          <div className="flex items-center gap-2">
            {activeStep > 0 && (
              <button
                onClick={() => setActiveStep(prev => prev - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 transition"
              >
                <ChevronRight className="w-4 h-4" />
                חזור
              </button>
            )}

            {activeStep < 2 && (
              <button
                onClick={() => setActiveStep(prev => prev + 1)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-800/60 hover:bg-amber-700 text-amber-100 border border-amber-600/60 transition"
              >
                הבא
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                confetti({
                  particleCount: 50,
                  spread: 70,
                  origin: { y: 0.7 }
                });
                sounds?.success?.();
                onStartJourney?.({
                  items,
                  scenario: currentScenario,
                  stations: storyResult.stations,
                  grandFinaleStory: storyResult.grandFinaleStory,
                  aiPrompt: storyResult.aiVisualPrompt
                });
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 hover:brightness-110 shadow-lg transition transform active:scale-95"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              צא למסע בארמון הזיכרון! 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
