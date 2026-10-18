import React from 'react';
import { useMusic } from '../context/MusicContext';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume2,
  VolumeX,
  Heart,
  Disc,
  Radio
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const PlayerBar = ({ onOpenVinyl }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seek,
    nextTrack,
    prevTrack,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    isLooping,
    setIsLooping,
    isShuffling,
    setIsShuffling,
    isLiked,
    toggleLike,
    vinylSide
  } = useMusic();

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeekChange = (e) => {
    const newTime = parseFloat(e.target.value);
    seek(newTime);
  };

  const currentTrackIsLiked = currentTrack ? isLiked(currentTrack._id || currentTrack.id) : false;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#080d1c]/95 backdrop-blur-2xl border-t border-sky-500/20 shadow-2xl px-4 lg:px-8 py-3">
      {/* Top radiant highlight accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 via-rose-500 to-blue-600 opacity-80" />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Track Metadata & Like */}
        <div className="flex items-center gap-3 w-1/4 min-w-[200px]">
          {currentTrack ? (
            <>
              <div
                onClick={onOpenVinyl}
                className="relative group w-12 h-12 lg:w-14 lg:h-14 rounded-xl overflow-hidden shrink-0 cursor-pointer shadow-lg border border-sky-400/30"
                title="Click to view Turntable Deck"
              >
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                {/* Mini spinning vinyl indicator */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Disc className={`w-6 h-6 text-sky-300 ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
              </div>

              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-white truncate hover:text-sky-300 transition-colors cursor-pointer" onClick={onOpenVinyl}>
                    {currentTrack.title}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    {currentTrack.vinylSide || vinylSide}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate">{currentTrack.artist}</p>
              </div>

              <button
                onClick={() => toggleLike(currentTrack)}
                className="p-1.5 rounded-full hover:bg-slate-800 transition-colors shrink-0"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    currentTrackIsLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400 hover:text-white'
                  }`}
                />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 text-slate-500 text-xs">
              <Disc className="w-8 h-8 text-slate-600 animate-spin" />
              <span>Select track to listen</span>
            </div>
          )}
        </div>

        {/* Center: Playback Controls & Progress Scrubber */}
        <div className="flex flex-col items-center gap-1.5 w-2/4 max-w-xl">
          <div className="flex items-center gap-4">
            {/* Shuffle */}
            <button
              onClick={() => setIsShuffling(!isShuffling)}
              className={`p-1.5 rounded-lg transition-colors ${
                isShuffling ? 'text-sky-400 bg-sky-500/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            {/* Prev Track */}
            <button
              onClick={prevTrack}
              className="text-slate-300 hover:text-white p-1.5 transition-colors"
              title="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Main Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-tr from-rose-500 via-sky-500 to-blue-600 text-white flex items-center justify-center shadow-glow-sky hover:scale-105 active:scale-95 transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={nextTrack}
              className="text-slate-300 hover:text-white p-1.5 transition-colors"
              title="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            {/* Repeat */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-1.5 rounded-lg transition-colors ${
                isLooping ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-white'
              }`}
              title="Repeat"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Timeline Scrubber */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
              {formatTime(currentTime)}
            </span>

            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="w-full h-1.5 bg-slate-700/60 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <span className="text-[11px] font-mono text-slate-400 w-8">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right: Audio Visualizer Mini & Volume Slider */}
        <div className="flex items-center justify-end gap-4 w-1/4 min-w-[180px]">
          
          {/* Mini Waveform preview */}
          <div className="hidden xl:block w-28 h-6">
            <AudioVisualizer height={24} barCount={20} />
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-sky-300 transition-colors p-1"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-sky-400" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 lg:w-20 h-1 bg-slate-700/60 rounded appearance-none"
            />
          </div>
        </div>

      </div>
    </div>
  );
};
