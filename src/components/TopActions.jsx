import IconButton from './IconButton.jsx';

const actions = [
  { label: 'Music', icon: '♪' },
  { label: 'Volume', icon: '◉' },
  { label: 'Stats', icon: '▥' },
  { label: 'Settings', icon: '⚙' }
];

function TopActions() {
  return (
    <div className="top-actions" aria-label="App tools">
      {actions.map((action) => (
        <IconButton key={action.label} label={action.label} icon={action.icon} />
      ))}
    </div>
  );
}

export default TopActions;
