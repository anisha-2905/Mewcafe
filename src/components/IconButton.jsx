import { motion } from 'framer-motion';

function IconButton({ label, icon, className = '', onClick }) {
  return (
    <motion.button
      className={`icon-button ${className}`.trim()}
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.05 }}
      whileTap={{ scale: 0.94 }}
    >
      <span aria-hidden="true">{icon}</span>
    </motion.button>
  );
}

export default IconButton;
