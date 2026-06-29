import { motion } from 'framer-motion';
import IconButton from './IconButton.jsx';
import { useAmbienceAudio } from '../hooks/useAmbienceAudio.js';

const icons = {
  musicOn: String.fromCharCode(0x266b),
  musicOff: String.fromCharCode(0x266a),
  muted: String.fromCodePoint(0x1f507),
  volume: String.fromCodePoint(0x1f50a),
  settings: String.fromCharCode(0x2699)
};

function TopActions({ theme, onOpenSettings }) {
  const ambience = useAmbienceAudio(theme);

  return (
    <div className="top-actions" aria-label="App tools">
      <IconButton
        label={ambience.isPlaying ? 'Pause music' : 'Play music'}
        icon={ambience.isPlaying ? icons.musicOn : icons.musicOff}
        className={ambience.isPlaying ? 'icon-button--active' : ''}
        onClick={ambience.togglePlayback}
      />

      <motion.div className="volume-control glass-panel" whileHover={{ scale: 1.03 }}>
        <IconButton
          label={ambience.isMuted ? 'Unmute ambience' : 'Mute ambience'}
          icon={ambience.isMuted ? icons.muted : icons.volume}
          className={ambience.isMuted ? '' : 'icon-button--active'}
          onClick={ambience.toggleMute}
        />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={ambience.volume}
          aria-label="Ambience volume"
          title="Ambience volume"
          onChange={(event) => ambience.setVolume(event.target.value)}
        />
      </motion.div>

      <IconButton label="Settings" icon={icons.settings} onClick={onOpenSettings} />
    </div>
  );
}

export default TopActions;
