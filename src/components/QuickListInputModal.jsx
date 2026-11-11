import React, { useState, useEffect } from 'react';
import { Sparkles, X, ListPlus, Loader2, Key, Check, ExternalLink, ShieldCheck, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { processTaskListWithSynergy } from '../utils/mnemonicPipelineOrchestrator';
import { curateListWithAi } from '../utils/aiMnemonicCurator';
import { 
  getGeminiApiKey, 
  setGeminiApiKey, 
  hasGeminiApiKey, 
  curateListWithLiveGemini 
} from '../utils/geminiLiveEngine';

export function QuickListInputModal({
  isOpen,
  onClose,
  onGenerateList
}) {
  const [textInput, setTextInput] = useState(
    'לסדר את החדר\nלקנות שוקולית\nשיעור נהיגה מחר ב10'
  );
  const [isCurating, setIsCurating] = useState(false);
  const [curationStatus, setCurationStatus] = useState('');
  
  const apiKey = getGeminiApiKey();
  const isAiConnected = Boolean(apiKey && apiKey.trim().length > 10);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCurating) return;

    const parsedItems = textInput
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (parsedItems.length < 2) {
      alert('אנא הזן לפחות 2-3 פריטים לשינון.');
      return;
    }

    setIsCurating(true);
    sounds?.playTap?.();

    try {
      // הפעלת צינור הסינרגיה של 5 המומחים (אסוציאציות, מאגר מקומי, צילום רשת ואריגת סיפור)
      setCurationStatus('מפעיל את צוות המומחים (אסוציאציות, מאגר מקומי וצילום רשת)... 🏰✨');
      const synergyResult = await processTaskListWithSynergy(parsedItems);

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (_) {}

      sounds?.playLevelUp?.();
      onGenerateList(synergyResult);
      onClose();
    } catch (err) {
      console.error('Synergy Curation error:', err);
      try {
        const fallbackCurated = await curateListWithAi(parsedItems);
        onGenerateList(fallbackCurated);
      } catch (_) {
        onGenerateList(parsedItems);
      }
      onClose();
    } finally {
      setIsCurating(false);
      setCurationStatus('');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl shadow-2xl border-2 p-6 text-right"
        style={{
          backgroundColor: '#181512',
          borderColor: '#f59e0b',
          color: '#fef3c7'
        }}
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ListPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-amber-300">
                הזן רשימה לשינון בארמון 📝
              </h3>
              <p className="text-xs text-amber-200/70">
                הקלד משימות או פריטים שתרצה לזכור (כל פריט בשורה חדשה)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Processing Mode Banner */}
        <div className="mb-4 p-3 rounded-xl border text-xs" style={{
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderColor: 'rgba(16, 185, 129, 0.4)'
        }}>
          <div className="flex items-center gap-2">
            <span className="text-base">🧠</span>
            <div>
              <span className="font-black text-emerald-400">
                מנוע הזיכרון פועל ומאתר עוגנים חזותיים בזמן אמת! ✨
              </span>
              <p className="text-[11px] text-amber-200/70 mt-0.5">
                המערכת תפרק כל משימה לעוגנים מוחשיים (תמונות מהחיים) ותארוג סיפור הרפתקה בארמון.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-200 mb-1.5">
              רשימת המשימות / הפריטים שלך:
            </label>
            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="הקלד פריט בכל שורה...&#10;למשל:&#10;לסדר את החדר&#10;לקנות שוקולית&#10;שיעור נהיגה מחר ב10"
              className="w-full p-3.5 rounded-xl bg-black/60 border border-amber-700/60 text-amber-100 placeholder-stone-500 text-sm font-bold focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
              autoFocus
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/80 leading-relaxed">
            <span className="font-bold text-amber-300">✨ חוקי הארמון:</span> {isAiConnected 
              ? 'Gemini מנתח את המשימות שלך בזמן אמת, מוציא עוגנים חזותיים מוחשיים, ורוקם סיפור הרפתקה אחד קולח שנחרט בזיכרון.'
              : 'המערכת משבצת את הפריטים בחדרי הארמון לפי תורת 5 השלבים הקוגניטיבית.'}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-amber-300/80 hover:text-amber-100 transition"
            >
              ביטול
            </button>

            <button
              type="submit"
              disabled={isCurating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 hover:brightness-110 shadow-lg transition active:scale-95 disabled:opacity-75 disabled:cursor-wait"
            >
              {isCurating ? (
                <>
                  <Loader2 className="w-4 h-4 text-stone-950 animate-spin" />
                  <span>{curationStatus || 'מעבד ב-AI... ✨'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>{isAiConnected ? 'שנן עם Gemini Live AI 🚀' : 'שנן בארמון 🚀'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default QuickListInputModal;
