import { motion } from 'framer-motion';
import { usePomodoroTimer } from '../hooks/usePomodoroTimer.js';

function PomodoroCard() {
  const timer = usePomodoroTimer();

  return (
    <motion.section
      className="pomodoro-card"
      aria-label="Pomodoro timer"
      style={{ '--pomodoro-progress': `${timer.progressDegrees}deg` }}
    >
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
          <div className="pomodoro-card__time">{timer.timeDisplay}</div>
          <p className="pomodoro-card__status">{timer.motivationalText}</p>
          <p className="pomodoro-card__session">{timer.sessionLabel}</p>
        </div>
      </motion.div>

      <div className="pomodoro-card__controls">
        {timer.status === 'idle' && (
          <button className="pomodoro-card__control is-primary" onClick={timer.start}>
            Start
          </button>
        )}

        {timer.status === 'running' && (
          <button className="pomodoro-card__control is-primary" onClick={timer.pause}>
            Pause
          </button>
        )}

        {timer.status === 'paused' && (
          <button className="pomodoro-card__control is-primary" onClick={timer.resume}>
            Resume
          </button>
        )}

        <button className="pomodoro-card__control" onClick={timer.reset}>
          Reset
        </button>

        <button className="pomodoro-card__control" onClick={timer.skip}>
          Skip
        </button>
      </div>
    </motion.section>
  );
}

export default PomodoroCard;