import { useSessionHistory } from '../hooks/useSessionHistory.js';

function formatDuration(totalSeconds) {
  const minutes = Math.round(totalSeconds / 60);

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return remainingMinutes === 0 ? `${hours} hr` : `${hours}h ${remainingMinutes}m`;
}

function formatCompletedTime(timestamp) {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit'
  }).format(new Date(timestamp));
}

function SessionsPanel() {
  const history = useSessionHistory();

  return (
    <section className="bottom-panel sessions-panel glass-panel" aria-label="Sessions">
      <div className="sessions-panel__header">
        <div>
          <h2>Sessions</h2>
          <p>{history.length} recorded</p>
        </div>
        <span>Latest 5</span>
      </div>

      {history.length === 0 ? (
        <p className="sessions-panel__empty">Finished sessions will appear here.</p>
      ) : (
        <ul className="sessions-panel__list">
          {history.map((session) => (
            <li key={session.id} className={`session-item session-item--${session.type}`}>
              <div className="session-item__main">
                <strong>{session.label}</strong>
                <span>{formatCompletedTime(session.completedAt)}</span>
              </div>
              <div className="session-item__meta">
                <span>{formatDuration(session.durationSeconds)}</span>
                <span>{session.status}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default SessionsPanel;
