import { useCallback, useEffect, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const SESSION_HISTORY_STORAGE_KEY = 'mewcafe:sessionHistory';
const SESSION_HISTORY_UPDATED_EVENT = 'mewcafe:sessionHistoryUpdated';
const MAX_STORED_SESSIONS = 100;

function createSessionId() {
  return crypto.randomUUID?.() ?? `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeSession(session) {
  if (!session || typeof session.type !== 'string') {
    return null;
  }

  return {
    id: session.id || createSessionId(),
    type: session.type,
    label: session.label || session.type,
    durationSeconds: Number(session.durationSeconds) || 0,
    completedAt: Number(session.completedAt) || Date.now(),
    status: session.status || 'Completed'
  };
}

function readSessionHistory() {
  const savedSessions = getStoredValue(SESSION_HISTORY_STORAGE_KEY, []);

  if (!Array.isArray(savedSessions)) {
    return [];
  }

  return savedSessions
    .map(normalizeSession)
    .filter(Boolean)
    .sort((first, second) => second.completedAt - first.completedAt)
    .slice(0, MAX_STORED_SESSIONS);
}

function writeSessionHistory(history) {
  const normalizedHistory = history
    .map(normalizeSession)
    .filter(Boolean)
    .sort((first, second) => second.completedAt - first.completedAt)
    .slice(0, MAX_STORED_SESSIONS);

  setStoredValue(SESSION_HISTORY_STORAGE_KEY, normalizedHistory);
  window.dispatchEvent(new CustomEvent(SESSION_HISTORY_UPDATED_EVENT, { detail: normalizedHistory }));
}

export function recordTimerSessionCompleted({ type, label, durationSeconds, completedAt = Date.now() }) {
  const nextSession = {
    id: createSessionId(),
    type,
    label,
    durationSeconds,
    completedAt,
    status: 'Completed'
  };

  writeSessionHistory([nextSession, ...readSessionHistory()]);
}

export function useSessionHistory() {
  const [history, setHistory] = useState(() => readSessionHistory());

  const refreshHistory = useCallback(() => {
    const nextHistory = readSessionHistory();
    setHistory(nextHistory);
  }, []);

  useEffect(() => {
    function handleHistoryUpdated(event) {
      setHistory(Array.isArray(event.detail) ? event.detail : readSessionHistory());
    }

    window.addEventListener(SESSION_HISTORY_UPDATED_EVENT, handleHistoryUpdated);
    window.addEventListener('storage', refreshHistory);

    return () => {
      window.removeEventListener(SESSION_HISTORY_UPDATED_EVENT, handleHistoryUpdated);
      window.removeEventListener('storage', refreshHistory);
    };
  }, [refreshHistory]);

  return history;
}
