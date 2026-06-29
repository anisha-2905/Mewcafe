import { useTodayStats } from '../hooks/useTodayStats.js';

function formatFocusTime(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

const statIcons = {
  focus: String.fromCharCode(0x2615),
  time: String.fromCharCode(0x23f1),
  streak: String.fromCodePoint(0x1f525),
  tasks: String.fromCharCode(0x2713)
};

function StatsPanel() {
  const stats = useTodayStats();

  const items = [
    {
      icon: statIcons.focus,
      label: 'Focus',
      value: stats.focusSessionsCompleted,
      detail: 'sessions'
    },
    {
      icon: statIcons.time,
      label: 'Time',
      value: formatFocusTime(stats.totalFocusSeconds),
      detail: 'focused'
    },
    {
      icon: statIcons.streak,
      label: 'Streak',
      value: stats.longestStreak,
      detail: 'best'
    },
    {
      icon: statIcons.tasks,
      label: 'Tasks',
      value: stats.tasksCompletedToday,
      detail: 'done'
    }
  ];

  return (
   <section className="bottom-panel stats-panel">
      <div className="stats-panel__header">
        <h2>Today</h2>
        <span>{stats.date}</span>
      </div>
      <div className="stats-panel__grid">
        {items.map((item) => (
          <article key={item.label} className="stats-panel__item">
            <span className="stats-panel__icon" aria-hidden="true">{item.icon}</span>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.detail}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default StatsPanel;
