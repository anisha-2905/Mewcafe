const hints = {
  focus: {
    icon: '🌸',
    title: 'Focus',
    text: 'Time to focus!'
  },
  shortBreak: {
    icon: '☕',
    title: 'Short Break',
    text: 'Sip, breathe, reset.'
  },
  longBreak: {
    icon: '🌙',
    title: 'Long Break',
    text: 'Stretch out. You earned it.'
  },
  idle: {
    icon: '🐾',
    title: 'Ready?',
    text: 'Start when you are ready.'
  },
  paused: {
    icon: '🐱',
    title: 'Paused',
    text: 'Your cup is still warm.'
  }
};

function FocusHint({ mode, status }) {
  const currentHint =
    status === 'paused'
      ? hints.paused
      : status === 'idle'
        ? hints.idle
        : hints[mode] ?? hints.focus;

  return (
    <div className="focus-hint">
      <div className="focus-hint__content">
        <div>
          <div className="focus-hint__title">
            <span>{currentHint.icon}</span> {currentHint.title}
          </div>
          <p>{currentHint.text}</p>
        </div>

        <img src="./favicon.png" alt="" className="focus-hint__cat" />
      </div>
    </div>
  );
}

export default FocusHint;