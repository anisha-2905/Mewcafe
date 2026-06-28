import { clearStoredValues } from '../utils/localStorage.js';
import { useSettings } from '../hooks/useSettings.js';

function SettingsPanel({ isOpen, onClose }) {
  const { settings, setSettings, resetSettings } = useSettings();

  if (!isOpen) {
    return null;
  }

  function updateNumberSetting(key, value) {
    setSettings({ [key]: value });
  }

  function updateToggleSetting(key, value) {
    setSettings({ [key]: value });
  }

  function handleResetAppData() {
    const confirmed = window.confirm('Reset all MewCafe data? This clears tasks, stats, sessions, timer, theme, and settings.');

    if (!confirmed) {
      return;
    }

    clearStoredValues();
    window.location.reload();
  }

  return (
    <div className="settings-overlay" role="presentation" onMouseDown={onClose}>
      <aside
        className="settings-panel glass-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="settings-panel__header">
          <div>
            <p>Preferences</p>
            <h2>Settings</h2>
          </div>
          <button className="settings-panel__close" type="button" aria-label="Close settings" onClick={onClose}>
            x
          </button>
        </div>

        <div className="settings-panel__section">
          <h3>Timer</h3>
          <label className="settings-field">
            <span>Focus duration</span>
            <input
              type="number"
              min="1"
              max="180"
              value={settings.focusDuration}
              onChange={(event) => updateNumberSetting('focusDuration', event.target.value)}
            />
          </label>
          <label className="settings-field">
            <span>Short break duration</span>
            <input
              type="number"
              min="1"
              max="180"
              value={settings.shortBreakDuration}
              onChange={(event) => updateNumberSetting('shortBreakDuration', event.target.value)}
            />
          </label>
          <label className="settings-field">
            <span>Long break duration</span>
            <input
              type="number"
              min="1"
              max="180"
              value={settings.longBreakDuration}
              onChange={(event) => updateNumberSetting('longBreakDuration', event.target.value)}
            />
          </label>
        </div>

        <div className="settings-panel__section">
          <h3>Flow</h3>
          <label className="settings-toggle">
            <span>Auto-start break</span>
            <input
              type="checkbox"
              checked={settings.autoStartBreak}
              onChange={(event) => updateToggleSetting('autoStartBreak', event.target.checked)}
            />
          </label>
          <label className="settings-toggle">
            <span>Auto-start focus</span>
            <input
              type="checkbox"
              checked={settings.autoStartFocus}
              onChange={(event) => updateToggleSetting('autoStartFocus', event.target.checked)}
            />
          </label>
          <label className="settings-toggle">
            <span>Notifications</span>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={(event) => updateToggleSetting('notificationsEnabled', event.target.checked)}
            />
          </label>
          <label className="settings-toggle">
            <span>Sound</span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(event) => updateToggleSetting('soundEnabled', event.target.checked)}
            />
          </label>
        </div>

        <div className="settings-panel__footer">
          <button className="settings-panel__secondary" type="button" onClick={resetSettings}>
            Defaults
          </button>
          <button className="settings-panel__danger" type="button" onClick={handleResetAppData}>
            Reset app data
          </button>
        </div>
      </aside>
    </div>
  );
}

export default SettingsPanel;
