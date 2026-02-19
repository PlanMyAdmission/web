'use client';

const SESSION_ID = 'ceronica_session_id';

function getStorage() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function saveSessionId(sessionId) {
  const storage = getStorage();
  if (!storage) return;
  storage.setItem(SESSION_ID, sessionId);
}
export function getSessionId() {
  const storage = getStorage();
  if (!storage) return null;
  return storage.getItem(SESSION_ID) || null;
}
