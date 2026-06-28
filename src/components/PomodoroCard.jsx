import { usePomodoroTimer } from '../hooks/usePomodoroTimer.js';

function PomodoroCard() {
  const timer = usePomodoroTimer();

  return (
    <section
      className="pomodoro-card"
      aria-label="Pomodoro timer"
      style={{ '--pomodoro-progress': `${timer.progressDegrees}deg` }}
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

      <div className="pomodoro-card__timer glass-panel">
        <div className="pomodoro-card__ring" aria-hidden="true" />
        <div className="pomodoro-card__inner">
          <p className="pomodoro-card__session">{timer.sessionLabel}</p>
          <div className="pomodoro-card__time">{timer.timeDisplay}</div>
          <p className="pomodoro-card__status">{timer.modeLabel}</p>
        </div>
      </div>

      <p className="pomodoro-card__motivation">{timer.motivationalText}</p>

      <div className="pomodoro-card__controls" aria-label="Timer controls">
        <button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.start}
          disabled={timer.status !== 'idle'}
        >
          Start
        </button>
        <button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.pause}
          disabled={timer.status !== 'running'}
        >
          Pause
        </button>
        <button
          className="pomodoro-card__control"
          type="button"
          onClick={timer.resume}
          disabled={timer.status !== 'paused'}
        >
          Resume
        </button>
        <button className="pomodoro-card__control" type="button" onClick={timer.reset}>
          Reset
        </button>
        <button className="pomodoro-card__control" type="button" onClick={timer.skip}>
          Skip
        </button>
      </div>
    </section>
  );
}

export default PomodoroCard;
