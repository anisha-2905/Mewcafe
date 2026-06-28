import { useEffect, useRef, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const VOLUME_STORAGE_KEY = 'mewcafe:ambienceVolume';
const MUTED_STORAGE_KEY = 'mewcafe:ambienceMuted';
const DEFAULT_VOLUME = 0.45;

function clampVolume(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return DEFAULT_VOLUME;
  }

  return Math.min(1, Math.max(0, numericValue));
}

export function useAmbienceAudio(theme) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => Boolean(getStoredValue(MUTED_STORAGE_KEY, false)));
  const [volume, setVolumeState] = useState(() =>
    clampVolume(getStoredValue(VOLUME_STORAGE_KEY, DEFAULT_VOLUME))
  );

  useEffect(() => {
    const audio = new Audio(theme.ambiencePath);

    audio.loop = true;
    audio.preload = 'none';
    audio.volume = volume;
    audio.muted = isMuted;
    audioRef.current = audio;

    function handleAudioStop() {
      setIsPlaying(false);
    }

    audio.addEventListener('ended', handleAudioStop);
    audio.addEventListener('error', handleAudioStop);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }

    return () => {
      audio.pause();
      audio.removeEventListener('ended', handleAudioStop);
      audio.removeEventListener('error', handleAudioStop);
      audioRef.current = null;
    };
  }, [theme.ambiencePath]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = volume;
    setStoredValue(VOLUME_STORAGE_KEY, volume);
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.muted = isMuted;
    setStoredValue(MUTED_STORAGE_KEY, isMuted);
  }, [isMuted]);

  function play() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }

  function pause() {
    audioRef.current?.pause();
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (isPlaying) {
      pause();
      return;
    }

    play();
  }

  function toggleMute() {
    setIsMuted((currentValue) => !currentValue);
  }

  function setVolume(value) {
    const nextVolume = clampVolume(value);

    setVolumeState(nextVolume);

    if (nextVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  }

  return {
    isPlaying,
    isMuted,
    volume,
    togglePlayback,
    toggleMute,
    setVolume
  };
}
