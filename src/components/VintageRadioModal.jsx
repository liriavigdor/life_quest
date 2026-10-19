import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  Volume2, 
  Radio, 
  Sparkles, 
  Upload, 
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/sound';
import { saveDeposit, deleteDeposit } from '../utils/keyMethodStorage';

export function VintageRadioModal({
  isOpen,
  onClose,
  roomId,
  roomName,
  existingRadio,
  villageCipher = 'יער',
  houseCipher = 'אבק',
  onRadioSaved
}) {
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioDuration, setAudioDuration] = useState(0);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingError, setRecordingError] = useState(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load existing radio deposit
  useEffect(() => {
    if (existingRadio) {
      setTitle(existingRadio.title || 'תזכורת קולית');
      setNote(existingRadio.note || '');
      setAudioUrl(existingRadio.audioUrl || null);
      setAudioDuration(existingRadio.duration || 0);
    } else {
      setTitle('');
      setNote('');
      setAudioUrl(null);
      setAudioDuration(0);
    }
    setIsRecording(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setRecordingSeconds(0);
    setRecordingError(null);
  }, [existingRadio, isOpen]);

  // Cleanup on unmount or close
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  if (!isOpen) return null;

  // Start microphone recording
  const startRecording = async () => {
    setRecordingError(null);
    sounds.playTap?.();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingError('הדפדפן אינו תומך בהקלטת מיקרופון. ניתן להעלות קובץ אודיו.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUrl(reader.result);
        };
        reader.readAsDataURL(audioBlob);

        // Stop all audio tracks
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setRecordingError('לא התקבלה גישה למיקרופון. אנא אשר הרשאה או העלה קובץ שמע.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    sounds.playTap?.();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Upload local audio file (.mp3, .wav, .m4a, etc.)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('אנא בחר קובץ אודיו תקין (MP3, WAV, M4A וכד\')');
      return;
    }

    sounds.playTap?.();
    const reader = new FileReader();
    reader.onload = (event) => {
      setAudioUrl(event.target.result);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsDataURL(file);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioPlayerRef.current) return;
    if (isPlaying) {
      audioPlayerRef.current.pause();
      setIsPlaying(false);
    } else {
      audioPlayerRef.current.volume = volume;
      audioPlayerRef.current.play();
      setIsPlaying(true);
    }
  };

  // Save or update radio deposit
  const handleSave = (e) => {
    e?.preventDefault();
    if (!audioUrl) {
      alert('אנא הקלט הודעה קולית או העלה קובץ אודיו עבור הרדיו.');
      return;
    }

    sounds.playFanfare?.();
    const todayStr = new Date().toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });

    const newDeposit = {
      id: existingRadio ? existingRadio.id : `dep_radio_${Date.now()}`,
      createdAt: existingRadio ? existingRadio.createdAt : Date.now(),
      villageCipher,
      houseCipher,
      roomId,
      roomName,
      type: 'radio',
      title: title.trim() || 'הקלטה קולית',
      note: note.trim(),
      audioUrl,
      duration: audioDuration || recordingSeconds || 10,
      visualAnchor: { emoji: '📻', label: 'רדיו וינטג\'' },
      lastPracticed: todayStr
    };

    saveDeposit(newDeposit);

    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}

    onRadioSaved?.(newDeposit);
    onClose();
  };

  // Delete radio memo
  const handleDelete = () => {
    if (!existingRadio) return;
    if (window.confirm('האם אתה בטוח שברצונך למחוק את ההקלטה מרדיו זה?')) {
      sounds.playTap?.();
      deleteDeposit(existingRadio.id);
      onRadioSaved?.(null);
      onClose();
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="journal-backdrop vintage-radio-backdrop animate-fade-in" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      style={{ zIndex: 1100 }}
    >
      <div 
        className="vintage-radio-dialog-card glass-card" 
        onClick={e => e.stopPropagation()}
        style={{
          width: '92%',
          maxWidth: '520px',
          borderRadius: '24px',
          background: 'linear-gradient(165deg, #2b1810 0%, #150a06 100%)',
          border: '2px solid #b45309',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
          color: '#f8fafc',
          direction: 'rtl',
          overflow: 'hidden'
        }}
      >
        {/* Hidden HTML5 Audio Element */}
        {audioUrl && (
          <audio
            ref={audioPlayerRef}
            src={audioUrl}
            onTimeUpdate={() => {
              if (audioPlayerRef.current) {
                setCurrentTime(audioPlayerRef.current.currentTime);
              }
            }}
            onLoadedMetadata={() => {
              if (audioPlayerRef.current) {
                setAudioDuration(audioPlayerRef.current.duration);
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
          />
        )}

        {/* Vintage Radio Header */}
        <div 
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, rgba(69, 26, 3, 0.9) 0%, rgba(30, 10, 2, 0.95) 100%)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>📻</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fef08a', fontWeight: 800 }}>
                {roomName ? `רדיו וינטג' שולחני — ${roomName}` : 'רדיו וינטג\' שולחני'}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>
                שיטת זיכרון קולית-שמיעתית (Auditory Echoic Memory)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '22px' }}>

          {/* Authentic 1950s Radio Visual Console */}
          <div 
            style={{
              background: 'linear-gradient(180deg, #3d1d0c 0%, #200e05 100%)',
              border: '2px solid #78350f',
              borderRadius: '16px',
              padding: '18px',
              boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.8), 0 4px 15px rgba(0,0,0,0.5)',
              marginBottom: '20px',
              position: 'relative'
            }}
          >
            {/* AM / FM Glowing Vacuum-Tube Frequency Dial */}
            <div 
              style={{
                background: 'linear-gradient(180deg, #180903 0%, #0d0502 100%)',
                border: '1.5px solid #d97706',
                borderRadius: '10px',
                padding: '12px 14px',
                marginBottom: '16px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.9), 0 0 10px rgba(245, 158, 11, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f59e0b', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '1px' }}>AM 540 • 800 • 1200 • 1600 kHz</span>
                <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 800 }}>TUNER • MEMORY FREQ</span>
              </div>

              {/* Dial Track with Moving Needle */}
              <div style={{ position: 'relative', height: '14px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                {/* Vintage Tuning Lines */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px', height: '100%', alignItems: 'center', opacity: 0.35 }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} style={{ width: '1px', height: i % 4 === 0 ? '10px' : '5px', background: '#fef08a' }} />
                  ))}
                </div>

                {/* Moving Orange Needle */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: audioDuration > 0 ? `${Math.min(100, (currentTime / audioDuration) * 100)}%` : '25%',
                    width: '3px',
                    background: '#ef4444',
                    boxShadow: '0 0 8px #ef4444',
                    transition: isPlaying ? 'left 0.1s linear' : 'left 0.3s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem' }}>
                <span style={{ color: isRecording ? '#ef4444' : '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {isRecording && <span className="recording-dot-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />}
                  {isRecording ? `מקליט: ${formatTime(recordingSeconds)}` : (audioUrl ? `משך: ${formatTime(audioDuration || recordingSeconds)}` : 'ממתין לקול...')}
                </span>
                <span style={{ color: '#fde047', fontFamily: 'monospace', fontWeight: 800 }}>
                  {audioUrl ? `${formatTime(currentTime)} / ${formatTime(audioDuration || recordingSeconds)}` : '88.4 MHz'}
                </span>
              </div>
            </div>

            {/* Vintage Speaker Cloth Grill with Action Knobs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
              
              {/* Speaker Slits */}
              <div 
                style={{
                  flex: 1,
                  height: '60px',
                  background: 'repeating-linear-gradient(0deg, #1e0f07, #1e0f07 3px, #2f190e 3px, #2f190e 6px)',
                  borderRadius: '8px',
                  border: '1px solid #78350f',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '8px'
                }}
              >
                {audioUrl ? (
                  <button
                    type="button"
                    onClick={togglePlay}
                    style={{
                      background: isPlaying ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '50%',
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.6)'
                    }}
                    title={isPlaying ? 'השהה' : 'השמע הקלטה'}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ transform: 'translateX(-1px)' }} />}
                  </button>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#a16207', fontWeight: 700 }}>
                    🔊 רמקול וינטג'
                  </span>
                )}
              </div>

              {/* Action Knobs (Record / Stop / Upload) */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={startRecording}
                    style={{
                      background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                      border: '1.5px solid #ef4444',
                      color: '#ffffff',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.4)'
                    }}
                    title="התחל הקלטת מיקרופון"
                  >
                    <Mic size={16} />
                    <span>הקלט קול</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={stopRecording}
                    style={{
                      background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                      border: '1.5px solid #fef08a',
                      color: '#1c0a00',
                      borderRadius: '12px',
                      padding: '10px 14px',
                      fontSize: '0.85rem',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(234, 179, 8, 0.4)'
                    }}
                    title="סיים הקלטה"
                  >
                    <Square size={16} />
                    <span>סיים הקלטה</span>
                  </button>
                )}

                {/* Upload File Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="audio/*"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(245, 158, 11, 0.35)',
                    color: '#fef08a',
                    borderRadius: '12px',
                    padding: '10px 12px',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="העלה קובץ אודיו מהמחשב"
                >
                  <Upload size={15} />
                  <span>קובץ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recording Error Alert if any */}
          {recordingError && (
            <div 
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                marginBottom: '14px'
              }}
            >
              ⚠️ {recordingError}
            </div>
          )}

          {/* Metadata Form */}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#fef08a', marginBottom: '6px' }}>
                כותרת התזכורת הקולית:
              </label>
              <input 
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="למשל: סיכום מנטלי לפגישה, ג'ינגל לזכירת החוק..."
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1.5px solid rgba(245, 158, 11, 0.35)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '6px' }}>
                הערת עוגן / תמלול קצר:
              </label>
              <textarea 
                rows={2}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="רשום מילות מפתח, חרוזים או רמז שיחזקו את הזיכרון השמיעתי..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Bottom Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
              {existingRadio ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    padding: '9px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem'
                  }}
                >
                  <Trash2 size={15} />
                  <span>מחק הקלטה</span>
                </button>
              ) : <div />}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: '#cbd5e1',
                    padding: '9px 16px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.88rem'
                  }}
                >
                  ביטול
                </button>

                <button
                  type="submit"
                  disabled={!audioUrl}
                  style={{
                    background: audioUrl ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: audioUrl ? '#1c0a00' : '#64748b',
                    fontWeight: 900,
                    padding: '9px 20px',
                    borderRadius: '10px',
                    cursor: audioUrl ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: audioUrl ? '0 4px 14px rgba(245, 158, 11, 0.4)' : 'none'
                  }}
                >
                  <Sparkles size={16} />
                  <span>שמור ברדיו 📻</span>
                </button>
              </div>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
