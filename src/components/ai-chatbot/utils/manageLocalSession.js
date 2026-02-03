const SESSION_ID = 'ceronica_session_id';

export function saveSessionId(sessionId) {
  localStorage.setItem(SESSION_ID, sessionId);
}

export function getSessionId() {
  return localStorage.getItem(SESSION_ID) || null;
}
