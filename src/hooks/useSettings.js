import { useCallback, useEffect, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const SETTINGS_STORAGE_KEY = 'mewcafe:settings';
const SETTINGS_UPDATED_EVENT = 'mewcafe:settingsUpdated';

export const defaultSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  autoStartBreak: true,
  autoStartFocus: true,
  notificationsEnabled: true,
  soundEnabled: true
};

function normalizeMinuteValue(value, fallbackValue) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return fallbackValue;
  }

  return Math.min(180, Math.max(1, Math.round(numericValue)));
}

function normalizeSettings(savedSettings) {
  return {
    focusDuration: normalizeMinuteValue(savedSettings?.focusDuration, defaultSettings.focusDuration),
    shortBreakDuration: normalizeMinuteValue(
      savedSettings?.shortBreakDuration,
      defaultSettings.shortBreakDuration
    ),
    longBreakDuration: normalizeMinuteValue(
      savedSettings?.longBreakDuration,
      defaultSettings.longBreakDuration
    ),
    autoStartBreak: savedSettings?.autoStartBreak ?? defaultSettings.autoStartBreak,
    autoStartFocus: savedSettings?.autoStartFocus ?? defaultSettings.autoStartFocus,
    notificationsEnabled: savedSettings?.notificationsEnabled ?? defaultSettings.notificationsEnabled,
    soundEnabled: savedSettings?.soundEnabled ?? defaultSettings.soundEnabled
  };
}

export function readSettings() {
  return normalizeSettings(getStoredValue(SETTINGS_STORAGE_KEY, defaultSettings));
}

function writeSettings(settings) {
  const normalizedSettings = normalizeSettings(settings);

  setStoredValue(SETTINGS_STORAGE_KEY, normalizedSettings);
  window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: normalizedSettings }));
}

export function useSettings() {
  const [settings, setSettingsState] = useState(() => readSettings());

  const setSettings = useCallback((updates) => {
    setSettingsState((currentSettings) => {
      const nextSettings = normalizeSettings({
        ...currentSettings,
        ...(typeof updates === 'function' ? updates(currentSettings) : updates)
      });

      writeSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(defaultSettings);
    writeSettings(defaultSettings);
  }, []);

  useEffect(() => {
    function handleSettingsUpdated(event) {
      setSettingsState(normalizeSettings(event.detail));
    }

    function handleStorageChange() {
      setSettingsState(readSettings());
    }

    window.addEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener(SETTINGS_UPDATED_EVENT, handleSettingsUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    settings,
    setSettings,
    resetSettings
  };
}
