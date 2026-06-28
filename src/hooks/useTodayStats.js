import { useCallback, useEffect, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const STATS_STORAGE_KEY = 'mewcafe:todayStats';
const STATS_UPDATED_EVENT = 'mewcafe:todayStatsUpdated';

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createEmptyStats() {
  return {
    date: getTodayKey(),
    focusSessionsCompleted: 0,
    totalFocusSeconds: 0,
    currentFocusStreak: 0,
    longestStreak: 0,
    tasksCompletedToday: 0,
    completedTaskIds: []
  };
}

function normalizeStats(savedStats) {
  const todayKey = getTodayKey();

  if (!savedStats || savedStats.date !== todayKey) {
    return createEmptyStats();
  }

  return {
    ...createEmptyStats(),
    ...savedStats,
    focusSessionsCompleted: Number(savedStats.focusSessionsCompleted) || 0,
    totalFocusSeconds: Number(savedStats.totalFocusSeconds) || 0,
    currentFocusStreak: Number(savedStats.currentFocusStreak) || 0,
    longestStreak: Number(savedStats.longestStreak) || 0,
    tasksCompletedToday: Number(savedStats.tasksCompletedToday) || 0,
    completedTaskIds: Array.isArray(savedStats.completedTaskIds) ? savedStats.completedTaskIds : []
  };
}

function readTodayStats() {
  return normalizeStats(getStoredValue(STATS_STORAGE_KEY, createEmptyStats()));
}

function writeTodayStats(stats) {
  setStoredValue(STATS_STORAGE_KEY, stats);
  window.dispatchEvent(new CustomEvent(STATS_UPDATED_EVENT, { detail: stats }));
}

export function recordFocusSessionCompleted(durationSeconds) {
  const currentStats = readTodayStats();
  const nextFocusStreak = currentStats.currentFocusStreak + 1;

  writeTodayStats({
    ...currentStats,
    focusSessionsCompleted: currentStats.focusSessionsCompleted + 1,
    totalFocusSeconds: currentStats.totalFocusSeconds + durationSeconds,
    currentFocusStreak: nextFocusStreak,
    longestStreak: Math.max(currentStats.longestStreak, nextFocusStreak)
  });
}

export function recordTaskCompletedToday(taskId) {
  const currentStats = readTodayStats();

  if (currentStats.completedTaskIds.includes(taskId)) {
    return;
  }

  const completedTaskIds = [...currentStats.completedTaskIds, taskId];

  writeTodayStats({
    ...currentStats,
    tasksCompletedToday: completedTaskIds.length,
    completedTaskIds
  });
}

export function useTodayStats() {
  const [stats, setStats] = useState(() => readTodayStats());

  const refreshStats = useCallback(() => {
    const nextStats = readTodayStats();
    setStats(nextStats);
    setStoredValue(STATS_STORAGE_KEY, nextStats);
  }, []);

  useEffect(() => {
    function handleStatsUpdated(event) {
      setStats(normalizeStats(event.detail));
    }

    window.addEventListener(STATS_UPDATED_EVENT, handleStatsUpdated);
    window.addEventListener('storage', refreshStats);

    const intervalId = window.setInterval(refreshStats, 60 * 1000);

    return () => {
      window.removeEventListener(STATS_UPDATED_EVENT, handleStatsUpdated);
      window.removeEventListener('storage', refreshStats);
      window.clearInterval(intervalId);
    };
  }, [refreshStats]);

  return stats;
}
