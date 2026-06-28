import BottomPanel from './BottomPanel.jsx';
import TaskPanel from './TaskPanel.jsx';

function BottomPanels() {
  return (
    <div className="bottom-panels">
      <TaskPanel />
      <BottomPanel title="Today">
        <p>Daily overview</p>
      </BottomPanel>
      <BottomPanel title="Sessions">
        <p>Session history</p>
      </BottomPanel>
    </div>
  );
}

export default BottomPanels;
