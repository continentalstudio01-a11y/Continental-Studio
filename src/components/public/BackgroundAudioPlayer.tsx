import React, { useState, useEffect, useRef } from 'react';
import { useBioSite } from '../../context/BioSiteContext';
import { playTrack, stopAllAudio, getAudioContext } from '../../utils/audioSynth';
import { motion } from 'motion/react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export const BackgroundAudioPlayer: React.FC = () => {
  const { audioSettings } = useBioSite();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(audioSettings.volume || 0.5);
  const [hasInteracted, setHasInteracted] = useState(false);

  const activeTracks = (audioSettings.tracks || []).filter((t) => t.enabled);
  const currentTrack =
    activeTracks.find((t) => t.id === audioSettings.selectedTrackId) ||
    activeTracks[0];

  const audioControlRef = useRef<{
    stop: () => void;
    setVolume: (v: number) => void;
  } | null>(null);

  // If background music is disabled or no active tracks, don't render anything
  if (!audioSettings.backgroundMusicEnabled || !currentTrack) {
    return null;
  }

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    getAudioContext(); // Resume audio context on user click

    if (isPlaying) {
      stopAllAudio();
      setIsPlaying(false);
    } else {
      startPlayback();
    }
  };

  const startPlayback = () => {
    if (!currentTrack) return;
    const effVolume = isMuted ? 0 : volume;
    audioControlRef.current = playTrack(currentTrack.audioUrl, effVolume);
    setIsPlaying(true);
    setHasInteracted(true);
  };

  // Toggle Mute
  const toggleMute = () => {
    getAudioContext();
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (audioControlRef.current) {
      audioControlRef.current.setVolume(nextMute ? 0 : volume);
    }
    // If user unmutes while not playing, start playing
    if (!nextMute && !isPlaying) {
      startPlayback();
    }
  };

  // Auto-play on user first click interaction if enabled
  useEffect(() => {
    if (!audioSettings.autoPlayOnInteraction || hasInteracted) return;

    const handleFirstUserInteraction = () => {
      if (!hasInteracted && !isPlaying) {
        getAudioContext();
        startPlayback();
        window.removeEventListener('click', handleFirstUserInteraction);
      }
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
    };
  }, [audioSettings.autoPlayOnInteraction, currentTrack, hasInteracted]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-1 p-1.5 rounded-full bg-neutral-950/85 backdrop-blur-xl border border-white/15 shadow-2xl text-white hover:border-[#C9A45C]/50 transition"
      >
        {/* Play/Pause Button (Tocar / Pausar) */}
        <button
          onClick={togglePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition transform active:scale-95 cursor-pointer shadow-md ${
            isPlaying
              ? 'bg-[#C9A45C] text-black hover:bg-[#d8b56f]'
              : 'bg-white/10 hover:bg-[#C9A45C] text-white hover:text-black'
          }`}
          title={isPlaying ? 'Pausar música' : 'Tocar música de fundo'}
          aria-label={isPlaying ? 'Pausar música' : 'Tocar música'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current ml-0.5" />
          )}
        </button>

        {/* Mute/Unmute Button (Mutar / Desmutar) */}
        <button
          onClick={toggleMute}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer ${
            isMuted
              ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
              : 'hover:bg-white/10 text-white/80 hover:text-white'
          }`}
          title={isMuted ? 'Ativar som' : 'Mutar som'}
          aria-label={isMuted ? 'Ativar som' : 'Mutar som'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
        </button>
      </motion.div>
    </div>
  );
};

