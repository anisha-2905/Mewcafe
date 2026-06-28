import { motion } from 'framer-motion';
import SessionsPanel from './SessionsPanel.jsx';
import StatsPanel from './StatsPanel.jsx';
import TaskPanel from './TaskPanel.jsx';

function BottomPanels() {
  return (
    <motion.div
      className="bottom-panels"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <TaskPanel />
      <StatsPanel />
      <SessionsPanel />
    </motion.div>
  );
}

export default BottomPanels;
