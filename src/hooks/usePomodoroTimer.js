import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const TIMER_STORAGE_KEY = 'mewcafe:pomodoroTimer';

const MODES = {
  focus: {
    name: 'focus',
    label: 'Focus',
    duration: 25 * 60
  },
  shortBreak: {
    name: 'shortBreak',
    label: 'Short Break',
    duration: 5 * 60
  },
  longBreak: {
    name: 'longBreak',
    label: 'Long Break',
    duration: 15 * 60
  }
};

const defaultTimerState = {
  mode: 'focus',
  status: 'idle',
  remainingSeconds: MODES.focus.duration,
  completedFocusSessions: 0,
  lastStartedAt: null,
  updatedAt: Date.now()
};

function getNextMode(mode, completedFocusSessions) {
  if (mode !== 'focus') {
    return 'focus';
  }

  return completedFocusSessions % 4 === 0 ? 'longBreak' : 'shortBreak';
}

function advanceSession(state) {
  const completedFocusSessions =
    state.mode === 'focus' ? state.completedFocusSessions + 1 : state.completedFocusSessions;
  const nextMode = getNextMode(state.mode, completedFocusSessions);

  return {
    ...state,
    mode: nextMode,
    status: 'running',
    remainingSeconds: getInitialRemainingSeconds(nextMode),
    completedFocusSessions,
    lastStartedAt: Date.now(),
    updatedAt: Date.now()
  };
}

function getInitialRemainingSeconds(mode) {
  return MODES[mode].duration;
}

function normalizeState(savedState) {
  if (!savedState || !MODES[savedState.mode]) {
    return defaultTimerState;
  }

  let state = {
    ...defaultTimerState,
    ...savedState,
    remainingSeconds: Number(savedState.remainingSeconds) || getInitialRemainingSeconds(savedState.mode),
    completedFocusSessions: Number(savedState.completedFocusSessions) || 0
  };

  if (state.status !== 'running') {
    return state;
  }

  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - Number(state.updatedAt || Date.now())) / 1000));
  let remainingElapsedSeconds = elapsedSeconds;

  while (remainingElapsedSeconds >= state.remainingSeconds) {
    remainingElapsedSeconds -= state.remainingSeconds;

    const completedFocusSessions =
      state.mode === 'focus' ? state.completedFocusSessions + 1 : state.completedFocusSessions;
    const nextMode = getNextMode(state.mode, completedFocusSessions);

    state = {
      ...state,
      mode: nextMode,
      completedFocusSessions,
      remainingSeconds: getInitialRemainingSeconds(nextMode)
    };
  }

  return {
    ...state,
    remainingSeconds: Math.max(0, state.remainingSeconds - remainingElapsedSeconds),
    updatedAt: Date.now()
  };
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function requestNotificationPermission() {
  if (!('Notification' in window) || Notification.permission !== 'default') {
    return;
  }

  Notification.requestPermission().catch(() => {});
}

function showSessionNotification(modeLabel) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  new Notification('MewCafe timer complete', {
    body: `${modeLabel} is finished. Time for the next cup.`,
    silent: false
  });
}

function playAlertSound() {
  const audio = new Audio('/sounds/alert.mp3');

  audio.play().catch(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      return;
    }

    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(660, context.currentTime);
    oscillator.frequency.setValueAtTime(520, context.currentTime + 0.14);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.34);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.36);
  });
}

function getMotivationalText(mode, status) {
  if (status === 'paused') {
    return 'Your cup is still warm. Pick up when you are ready.';
  }

  if (mode === 'focus') {
    return 'Fresh coffee, steady focus.';
  }

  if (mode === 'longBreak') {
    return 'Stretch out. You earned the long cozy pause.';
  }

  return 'Breathe, sip, and let your attention reset.';
}

export function usePomodoroTimer() {
  const [timerState, setTimerState] = useState(() =>
    normalizeState(getStoredValue(TIMER_STORAGE_KEY, defaultTimerState))
  );

  const currentMode = MODES[timerState.mode];
  const totalSeconds = currentMode.duration;
  const elapsedSeconds = totalSeconds - timerState.remainingSeconds;
  const progress = totalSeconds === 0 ? 0 : elapsedSeconds / totalSeconds;
  const focusSessionNumber = (timerState.completedFocusSessions % 4) + 1;

  const modeOptions = useMemo(() => Object.values(MODES), []);

  const completeSession = useCallback((state) => {
    const completedMode = MODES[state.mode];

    showSessionNotification(completedMode.label);
    playAlertSound();

    return advanceSession(state);
  }, []);

  useEffect(() => {
    setStoredValue(TIMER_STORAGE_KEY, {
      ...timerState,
      updatedAt: Date.now()
    });
  }, [timerState]);

  useEffect(() => {
    if (timerState.status !== 'running') {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimerState((currentState) => {
        if (currentState.status !== 'running') {
          return currentState;
        }

        if (currentState.remainingSeconds <= 1) {
          return completeSession(currentState);
        }

        return {
          ...currentState,
          remainingSeconds: currentState.remainingSeconds - 1,
          updatedAt: Date.now()
        };
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [completeSession, timerState.status]);

  const start = useCallback(() => {
    requestNotificationPermission();
    setTimerState((state) => ({
      ...state,
      status: 'running',
      lastStartedAt: Date.now(),
      updatedAt: Date.now()
    }));
  }, []);

  const pause = useCallback(() => {
    setTimerState((state) => ({
      ...state,
      status: 'paused',
      updatedAt: Date.now()
    }));
  }, []);

  const resume = useCallback(() => {
    requestNotificationPermission();
    setTimerState((state) => ({
      ...state,
      status: 'running',
      lastStartedAt: Date.now(),
      updatedAt: Date.now()
    }));
  }, []);

  const reset = useCallback(() => {
    setTimerState((state) => ({
      ...state,
      status: 'idle',
      remainingSeconds: getInitialRemainingSeconds(state.mode),
      lastStartedAt: null,
      updatedAt: Date.now()
    }));
  }, []);

  const skip = useCallback(() => {
    setTimerState((state) => advanceSession(state));
  }, []);

  const setMode = useCallback((mode) => {
    if (!MODES[mode]) {
      return;
    }

    setTimerState((state) => ({
      ...state,
      mode,
      status: 'idle',
      remainingSeconds: getInitialRemainingSeconds(mode),
      lastStartedAt: null,
      updatedAt: Date.now()
    }));
  }, []);

  return {
    mode: timerState.mode,
    modeLabel: currentMode.label,
    modeOptions,
    status: timerState.status,
    timeDisplay: formatTime(timerState.remainingSeconds),
    remainingSeconds: timerState.remainingSeconds,
    progress,
    progressDegrees: Math.round(progress * 360),
    sessionLabel: `Pomodoro ${focusSessionNumber}/4`,
    motivationalText: getMotivationalText(timerState.mode, timerState.status),
    start,
    pause,
    resume,
    reset,
    skip,
    setMode
  };
}
