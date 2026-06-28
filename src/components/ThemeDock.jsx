function ThemeDock({ themes, selectedThemeName, onThemeChange }) {
  return (
    <nav className="theme-dock glass-panel" aria-label="Theme dock">
      {themes.map((theme) => (
        <button
          key={theme.name}
          className={`theme-dock__swatch ${theme.name === selectedThemeName ? 'is-active' : ''}`}
          type="button"
          aria-label={theme.label}
          aria-pressed={theme.name === selectedThemeName}
          title={theme.label}
          onClick={() => onThemeChange(theme.name)}
          style={{
            '--swatch-accent': theme.accentColor,
            '--swatch-button': theme.buttonColor,
            '--swatch-glass': theme.glassTint
          }}
        >
          <span aria-hidden="true">{theme.icon}</span>
        </button>
      ))}
    </nav>
  );
}

export default ThemeDock;
