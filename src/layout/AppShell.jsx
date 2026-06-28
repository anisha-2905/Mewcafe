import { useEffect, useMemo, useState } from 'react';
import BottomPanels from '../components/BottomPanels.jsx';
import PomodoroCard from '../components/PomodoroCard.jsx';
import ThemeDock from '../components/ThemeDock.jsx';
import TitleBar from '../components/TitleBar.jsx';
import TopActions from '../components/TopActions.jsx';
import { defaultThemeName, getThemeByName, themes } from '../data/themes.js';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const THEME_STORAGE_KEY = 'mewcafe:selectedTheme';

function AppShell() {
  const [selectedThemeName, setSelectedThemeName] = useState(() =>
    getStoredValue(THEME_STORAGE_KEY, defaultThemeName)
  );
  const [previousTheme, setPreviousTheme] = useState(null);
  const [isFadingPreviousTheme, setIsFadingPreviousTheme] = useState(false);

  const selectedTheme = useMemo(() => getThemeByName(selectedThemeName), [selectedThemeName]);

  useEffect(() => {
    setStoredValue(THEME_STORAGE_KEY, selectedTheme.name);
  }, [selectedTheme.name]);

  useEffect(() => {
    if (!previousTheme) {
      return undefined;
    }

    setIsFadingPreviousTheme(true);

    const timeoutId = window.setTimeout(() => {
      setPreviousTheme(null);
      setIsFadingPreviousTheme(false);
    }, 520);

    return () => window.clearTimeout(timeoutId);
  }, [previousTheme]);

  const themeStyle = {
    '--theme-accent': selectedTheme.accentColor,
    '--theme-button': selectedTheme.buttonColor,
    '--theme-glass-tint': selectedTheme.glassTint,
    '--theme-text': selectedTheme.textColor,
    '--theme-progress-ring': selectedTheme.progressRingColor
  };

  function handleThemeChange(themeName) {
    if (themeName === selectedTheme.name) {
      return;
    }

    setPreviousTheme(selectedTheme);
    setSelectedThemeName(themeName);
  }

  return (
    <div className="app-window" style={themeStyle}>
      <div className="app-background" aria-hidden="true">
        {previousTheme && (
          <div
            className={`app-background__image app-background__image--previous ${
              isFadingPreviousTheme ? 'is-fading' : ''
            }`}
            style={{ backgroundImage: `url(${previousTheme.backgroundImage})` }}
          />
        )}
        <div
          className="app-background__image app-background__image--current"
          style={{ backgroundImage: `url(${selectedTheme.backgroundImage})` }}
        />
      </div>
      <TitleBar />
      <main className="app-shell" aria-label="MewCafe desktop layout">
        <TopActions />
        <PomodoroCard />
        <div className="app-shell__bottom">
          <BottomPanels />
          <ThemeDock
            themes={themes}
            selectedThemeName={selectedTheme.name}
            onThemeChange={handleThemeChange}
          />
        </div>
      </main>
    </div>
  );
}

export default AppShell;
