import { motion } from 'framer-motion';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer.js';

function PomodoroCard() {
  const timer = usePomodoroTimer();

  return (
    <motion.section
      className="pomodoro-card"
      aria-label="Pomodoro timer"
      style={{ '--pomodoro-progress': `${timer.progressDegrees}deg` }}
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="pomodoro-card__modes" aria-label="Timer modes">
        {timer.modeOptions.map((mode) => (
          <button
            key={mode.name}
            className={`pomodoro-card__mode ${mode.name === timer.mode ? 'is-active' : ''}`}
            type="button"
            aria-pressed={mode.name === timer.mode}
            onClick={() => timer.setMode(mode.name)}
          >
            {mode.label}
          </button>
        ))}
      </div>

      <motion.div
        className="pomodoro-card__timer glass-panel"
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="pomodoro-card__ring" aria-hidden="true" />
        <div className="pomodoro-card__inner">
          <p className="pomodoro-card__mode-pill">
            <span aria-hidden="true" /> {timer.modeLabel}
          </p>
          <p className="pomodoro-card__session">{timer.sessionLabel}</p>
          <div className="pomodoro-card__time">{timer.timeDisplay}</div>
          <p className="pomodoro-card__status">{timer.motivationalText}</p>
        </div>
      </motion.div>

      <motion.div
        className="pomodoro-card__controls"
        aria-label="Timer controls"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
      >
        <motion.button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.start}
          disabled={timer.status !== 'idle'}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Start
        </motion.button>
        <motion.button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.pause}
          disabled={timer.status !== 'running'}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Pause
        </motion.button>
        <motion.button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.resume}
          disabled={timer.status !== 'paused'}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Resume
        </motion.button>
        <motion.button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.reset}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset
        </motion.button>
        <motion.button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.skip}
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Skip
        </motion.button>
      </motion.div>
    </motion.section>
  );
}

export default PomodoroCard;
