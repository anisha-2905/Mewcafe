import { useCallback, useEffect, useMemo, useState } from 'react';
import { recordTimerSessionCompleted } from './useSessionHistory.js';
import { readSettings, useSettings } from './useSettings.js';
import { recordFocusSessionCompleted } from './useTodayStats.js';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const TIMER_STORAGE_KEY = 'mewcafe:pomodoroTimer';

function createModes(settings) {
  return {
    focus: {
      name: 'focus',
      label: 'Focus',
      duration: settings.focusDuration * 60
    },
    shortBreak: {
      name: 'shortBreak',
      label: 'Short Break',
      duration: settings.shortBreakDuration * 60
    },
    longBreak: {
      name: 'longBreak',
      label: 'Long Break',
      duration: settings.longBreakDuration * 60
    }
  };
}

const defaultModes = createModes(readSettings());

const defaultTimerState = {
  mode: 'focus',
  status: 'idle',
  remainingSeconds: defaultModes.focus.duration,
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

function shouldAutoStart(nextMode, settings) {
  return nextMode === 'focus' ? settings.autoStartFocus : settings.autoStartBreak;
}

function advanceSession(state, modes, settings) {
  const completedFocusSessions =
    state.mode === 'focus' ? state.completedFocusSessions + 1 : state.completedFocusSessions;
  const nextMode = getNextMode(state.mode, completedFocusSessions);
  const shouldRunNextSession = shouldAutoStart(nextMode, settings);

  return {
    ...state,
    mode: nextMode,
    status: shouldRunNextSession ? 'running' : 'idle',
    remainingSeconds: getInitialRemainingSeconds(nextMode, modes),
    completedFocusSessions,
    lastStartedAt: shouldRunNextSession ? Date.now() : null,
    updatedAt: Date.now()
  };
}

function getInitialRemainingSeconds(mode, modes) {
  return modes[mode].duration;
}

function normalizeState(savedState, modes, settings) {
  if (!savedState || !modes[savedState.mode]) {
    return defaultTimerState;
  }

  let state = {
    ...defaultTimerState,
    ...savedState,
    remainingSeconds: Number(savedState.remainingSeconds) || getInitialRemainingSeconds(savedState.mode, modes),
    completedFocusSessions: Number(savedState.completedFocusSessions) || 0
  };

  if (state.status !== 'running') {
    return state;
  }

  let completionCursor = Number(state.updatedAt || Date.now());
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - completionCursor) / 1000));
  let remainingElapsedSeconds = elapsedSeconds;

  while (remainingElapsedSeconds >= state.remainingSeconds) {
    remainingElapsedSeconds -= state.remainingSeconds;

    const completedMode = modes[state.mode];
    completionCursor += state.remainingSeconds * 1000;

    const completedFocusSessions =
      state.mode === 'focus' ? state.completedFocusSessions + 1 : state.completedFocusSessions;
    const nextMode = getNextMode(state.mode, completedFocusSessions);

    if (state.mode === 'focus') {
      recordFocusSessionCompleted(modes.focus.duration);
    }

    recordTimerSessionCompleted({
      type: state.mode,
      label: completedMode.label,
      durationSeconds: completedMode.duration,
      completedAt: completionCursor
    });

    state = {
      ...state,
      mode: nextMode,
      completedFocusSessions,
      remainingSeconds: getInitialRemainingSeconds(nextMode, modes),
      status: shouldAutoStart(nextMode, settings) ? 'running' : 'idle',
      lastStartedAt: shouldAutoStart(nextMode, settings) ? completionCursor : null
    };

    if (state.status !== 'running') {
      return {
        ...state,
        updatedAt: Date.now()
      };
    }
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

function requestNotificationPermission(settings) {
  if (!settings.notificationsEnabled) {
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'default') {
    return;
  }

  Notification.requestPermission().catch(() => {});
}

function showSessionNotification(modeLabel, settings) {
  if (!settings.notificationsEnabled) {
    return;
  }

  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  new Notification('MewCafe timer complete', {
    body: `${modeLabel} is finished. Time for the next cup.`,
    silent: false
  });
}

function playAlertSound(settings) {
  if (!settings.soundEnabled) {
    return;
  }

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
  const { settings } = useSettings();
  const modes = useMemo(() => createModes(settings), [settings]);
  const [timerState, setTimerState] = useState(() =>
    normalizeState(getStoredValue(TIMER_STORAGE_KEY, defaultTimerState), defaultModes, readSettings())
  );

  const currentMode = modes[timerState.mode];
  const totalSeconds = currentMode.duration;
  const elapsedSeconds = totalSeconds - timerState.remainingSeconds;
  const progress = totalSeconds === 0 ? 0 : elapsedSeconds / totalSeconds;
  const focusSessionNumber = (timerState.completedFocusSessions % 4) + 1;

  const modeOptions = useMemo(() => Object.values(modes), [modes]);

  const completeSession = useCallback((state) => {
    const completedMode = modes[state.mode];

    if (state.mode === 'focus') {
      recordFocusSessionCompleted(modes.focus.duration);
    }

    recordTimerSessionCompleted({
      type: state.mode,
      label: completedMode.label,
      durationSeconds: completedMode.duration
    });

    showSessionNotification(completedMode.label, settings);
    playAlertSound(settings);

    return advanceSession(state, modes, settings);
  }, [modes, settings]);

  useEffect(() => {
    setTimerState((state) => {
      if (!modes[state.mode]) {
        return state;
      }

      if (state.status === 'running') {
        return state;
      }

      return {
        ...state,
        remainingSeconds: getInitialRemainingSeconds(state.mode, modes),
        updatedAt: Date.now()
      };
    });
  }, [modes]);

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
    requestNotificationPermission(settings);
    setTimerState((state) => ({
      ...state,
      status: 'running',
      lastStartedAt: Date.now(),
      updatedAt: Date.now()
    }));
  }, [settings]);

  const pause = useCallback(() => {
    setTimerState((state) => ({
      ...state,
      status: 'paused',
      updatedAt: Date.now()
    }));
  }, []);

  const resume = useCallback(() => {
    requestNotificationPermission(settings);
    setTimerState((state) => ({
      ...state,
      status: 'running',
      lastStartedAt: Date.now(),
      updatedAt: Date.now()
    }));
  }, [settings]);

  const reset = useCallback(() => {
    setTimerState((state) => ({
      ...state,
      status: 'idle',
      remainingSeconds: getInitialRemainingSeconds(state.mode, modes),
      lastStartedAt: null,
      updatedAt: Date.now()
    }));
  }, [modes]);

  const skip = useCallback(() => {
    setTimerState((state) => advanceSession(state, modes, settings));
  }, [modes, settings]);

  const setMode = useCallback((mode) => {
    if (!modes[mode]) {
      return;
    }

    setTimerState((state) => ({
      ...state,
      mode,
      status: 'idle',
      remainingSeconds: getInitialRemainingSeconds(mode, modes),
      lastStartedAt: null,
      updatedAt: Date.now()
    }));
  }, [modes]);

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
