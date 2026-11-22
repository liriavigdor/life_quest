/**
 * LifeQuest Ephemeral Real-Time Session Logger
 *
 * מתעד אך ורק את הסשן הפעיל הנוכחי (רשימה ➔ תמונות ראשוניות ➔ דירוגים/החלפות ➔ סיפור דרך)
 * לקובץ יחיד public/data/current_session_log.json (וגיבוי Firestore אופציונלי).
 * נדרס בכל סשן חדש וניתן למחיקה מלאה בסיום הביקורת כדי למנוע הצטברות מידע מיותר.
 */

import { db, isFirebaseConfigured } from '../firebase.js';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { getLastStoryReasoning } from './theAuthorStoryEngine.js';

const FIRESTORE_COLLECTION = 'system_telemetry';
const FIRESTORE_DOC_ID = 'current_session';

let activeSessionState = null;

async function persistSessionToServer(payload) {
  try {
    await fetch('/api/session-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (_) {}

  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID), payload);
    } catch (_) {}
  }
}

function sanitizeUrlForLog(url = '') {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:image/svg')) return '[svg_fallback_card]';
  if (url.startsWith('data:image/')) return '[base64_image]';
  return url;
}

export async function startSessionLog({ rawItems = [], stations = [], grandFinaleStory = '' } = {}) {
  const now = new Date().toISOString();
  activeSessionState = {
    sessionId: `sess_${Date.now()}`,
    startedAt: now,
    updatedAt: now,
    inputList: Array.isArray(rawItems) ? rawItems : [],
    initialStations: (Array.isArray(stations) ? stations : []).map((st, idx) => ({
      order: st.order || idx + 1,
      itemTitle: st.title || '',
      coreConcept: st.coreConcept || '',
      anchorName: st.associationWord || '',
      imageUrl: sanitizeUrlForLog(st.imageUrl),
      explanation: st.explanation || st.story || '',
      source: st.candidates?.[st.currentCandidateIndex || 0]?.source || (st.hasRepositoryImage ? 'pool_or_web' : 'fallback_svg'),
      aiReasoning: st.aiReasoning || '',
      visionAuditLog: Array.isArray(st.visionAuditLog) ? st.visionAuditLog : [],
      candidatesCount: Array.isArray(st.candidates) ? st.candidates.length : 0,
      candidateNames: Array.isArray(st.candidates) ? st.candidates.map(c => c?.anchorName).filter(Boolean) : []
    })),
    initialStory: grandFinaleStory || '',
    initialStoryReasoning: getLastStoryReasoning() || '',
    finalStory: grandFinaleStory || '',
    finalStoryReasoning: getLastStoryReasoning() || '',
    events: []
  };

  await persistSessionToServer(activeSessionState);
  return activeSessionState;
}

export async function logSessionEvent(event = {}) {
  if (!event || !event.type) return;
  const now = new Date().toISOString();

  if (!activeSessionState) {
    activeSessionState = {
      sessionId: `sess_${Date.now()}`,
      startedAt: now,
      updatedAt: now,
      inputList: [],
      initialStations: [],
      initialStory: '',
      finalStory: '',
      events: []
    };
  }

  activeSessionState.updatedAt = now;
  if (event.type === 'story_updated' && event.story) {
    activeSessionState.finalStory = event.story;
    const sr = getLastStoryReasoning();
    if (sr) activeSessionState.finalStoryReasoning = sr;
  }

  const sanitizedEvent = { ...event };
  if (event.type === 'story_updated') {
    const sr = getLastStoryReasoning();
    if (sr) sanitizedEvent.storyReasoning = sr;
  }
  if (sanitizedEvent.imageUrl) {
    sanitizedEvent.imageUrl = sanitizeUrlForLog(sanitizedEvent.imageUrl);
  }

  activeSessionState.events.push({
    at: now,
    ...sanitizedEvent
  });

  await persistSessionToServer(activeSessionState);
}

export async function clearCurrentSessionLog() {
  activeSessionState = null;
  try {
    await fetch('/api/session-log', { method: 'DELETE' });
  } catch (_) {}

  if (isFirebaseConfigured && db) {
    try {
      await deleteDoc(doc(db, FIRESTORE_COLLECTION, FIRESTORE_DOC_ID));
    } catch (_) {}
  }
}

export default {
  startSessionLog,
  logSessionEvent,
  clearCurrentSessionLog
};
