import { motion } from 'framer-motion';

function ThemeDock({ themes, selectedThemeName, onThemeChange }) {
  return (
    <motion.nav
      className="theme-dock glass-panel"
      aria-label="Theme dock"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
    >
      {themes.map((theme) => (
        <motion.button
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
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span aria-hidden="true">{theme.icon}</span>
          <strong>{theme.label}</strong>
        </motion.button>
      ))}
    </motion.nav>
  );
}

export default ThemeDock;
