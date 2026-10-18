import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { Play, Pause, Disc, Heart, Volume2, Sparkles, RotateCw, Radio, ExternalLink } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const VinylPlayer = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    vinylSide,
    setVinylSide,
    turntableRpm,
    setTurntableRpm,
    isLiked,
    toggleLike
  } = useMusic();

  const [isFlipping, setIsFlipping] = useState(false);

  // Filter tracks by current vinyl side
  const currentSideTracks = tracks.filter(t => (t.vinylSide || 'A') === vinylSide);

  const handleSideToggle = (side) => {
    if (side === vinylSide) return;
    setIsFlipping(true);
    setTimeout(() => {
      setVinylSide(side);
      setIsFlipping(false);
      // Play first track of new side if available
      const sideSongs = tracks.filter(t => (t.vinylSide || 'A') === side);
      if (sideSongs.length > 0) {
        playTrack(sideSongs[0]);
      }
    }, 300);
  };

  const currentTrackIsLiked = currentTrack ? isLiked(currentTrack._id || currentTrack.id) : false;

  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#070b16] via-[#0d1527] to-[#080d1a] border border-sky-500/20 shadow-2xl p-6 lg:p-8 backdrop-blur-xl">
      {/* Radiant Background Aura Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-sky-500/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 via-sky-500 to-blue-600 shadow-glow-sky">
            <Disc className={`w-6 h-6 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: turntableRpm === 45 ? '1.8s' : '2.5s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold">Audiophile Hi-Fi</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700">
                {turntableRpm} RPM Analog Master
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Radiant Turntable Deck
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                SIDE {vinylSide}
              </span>
            </h2>
          </div>
        </div>

        {/* Vinyl Controls & Side Switcher */}
        <div className="flex items-center gap-3">
          <div className="bg-[#090f1d] p-1 rounded-2xl border border-sky-500/20 flex items-center shadow-inner">
            <button
              onClick={() => handleSideToggle('A')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                vinylSide === 'A'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side A
            </button>
            <button
              onClick={() => handleSideToggle('B')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                vinylSide === 'B'
                  ? 'bg-gradient-to-r from-rose-500 to-crimson-light text-white shadow-glow-crimson'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Side B
            </button>
          </div>

          <button
            onClick={() => setTurntableRpm(prev => prev === 33 ? 45 : 33)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0e1629] border border-sky-400/25 text-sky-300 hover:bg-sky-500/10 transition-colors"
            title="Toggle Vinyl Speed"
          >
            {turntableRpm} RPM
          </button>
        </div>
      </div>

      {/* Main Turntable Layout Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
        
        {/* Left Column: Track List for active Vinyl Side (Image 1 style) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-sky-400">
                {vinylSide}
              </span>
              <span className="text-2xl font-light text-slate-400">side</span>
            </div>
            <span className="text-xs text-sky-400/80 font-mono tracking-wider">
              {currentSideTracks.length} SELECTIONS
            </span>
          </div>

          <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
            {currentSideTracks.map((track, idx) => {
              const isCurrent = currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id);
              const trackNum = String(idx + 1).padStart(2, '0');

              return (
                <div
                  key={track._id || track.id || idx}
                  onClick={() => playTrack(track)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-sky-500/20 via-blue-600/15 to-transparent border-sky-400/40 shadow-glow-sky'
                      : 'bg-[#0a101f]/60 hover:bg-[#111a31] border-slate-800/80 hover:border-sky-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-xs font-mono font-bold w-6 ${isCurrent ? 'text-sky-400' : 'text-slate-500'}`}>
                      {trackNum}
                    </span>

                    <button
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                        isCurrent
                          ? 'bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-glow-crimson scale-105'
                          : 'bg-slate-800 text-slate-300 group-hover:bg-sky-500 group-hover:text-white'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${isCurrent ? 'text-white' : 'text-slate-200 group-hover:text-sky-200'}`}>
                        {track.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{track.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    {isCurrent && isPlaying && (
                      <div className="flex items-end gap-0.5 h-3">
                        <span className="w-0.5 h-3 bg-sky-400 animate-pulse rounded-full" />
                        <span className="w-0.5 h-2 bg-rose-500 animate-pulse delay-75 rounded-full" />
                        <span className="w-0.5 h-3.5 bg-sky-300 animate-pulse delay-150 rounded-full" />
                      </div>
                    )}
                    <span className="text-xs font-mono text-slate-400">
                      {track.durationFormatted || '3:00'}
                    </span>
                  </div>
                </div>
              );
            })}

            {currentSideTracks.length === 0 && (
              <div className="p-6 text-center rounded-2xl bg-[#090f1d] border border-dashed border-slate-800 text-slate-400 text-xs">
                No tracks assigned to Side {vinylSide} yet. Admins can add or import tracks to Side {vinylSide}!
              </div>
            )}
          </div>
        </div>

        {/* Center Turntable Platter with Tonearm */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative py-4">
          <div className={`relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 transition-transform duration-500 ${isFlipping ? 'scale-90 rotate-180 opacity-40' : 'scale-100'}`}>
            
            {/* Turntable Outer Ring & Base */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#02050b] via-[#0b1021] to-[#141e3a] p-3 shadow-2xl border border-sky-400/20">
              
              {/* Spinning Vinyl Disc */}
              <div
                className={`w-full h-full rounded-full vinyl-grooves relative flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-700 ${
                  isPlaying ? 'shadow-vinyl' : ''
                }`}
                onClick={togglePlay}
              >
                {/* Vinyl Spin Container */}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center relative"
                  style={{
                    animation: isPlaying ? `spin ${turntableRpm === 45 ? '1.33s' : '1.81s'} linear infinite` : 'none',
                    transition: 'transform 0.5s ease-out'
                  }}
                >
                  {/* Sheen Overlay */}
                  <div className="absolute inset-0 rounded-full vinyl-sheen pointer-events-none" />

                  {/* Micro Grooves Rings */}
                  <div className="absolute inset-8 rounded-full border border-sky-400/10 pointer-events-none" />
                  <div className="absolute inset-16 rounded-full border border-slate-400/10 pointer-events-none" />
                  <div className="absolute inset-24 rounded-full border border-sky-400/15 pointer-events-none" />

                  {/* Center Label (Album Art or Led Zeppelin Rune) */}
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-rose-500 via-sky-400 to-blue-600 shadow-xl relative z-10 flex items-center justify-center">
                    <div className="w-full h-full rounded-full overflow-hidden relative bg-[#090d18] border-2 border-white/40 flex items-center justify-center">
                      {currentTrack?.coverUrl ? (
                        <img
                          src={currentTrack.coverUrl}
                          alt="Vinyl Center Label"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Disc className="w-12 h-12 text-sky-300" />
                      )}

                      {/* Center Spindle Hole */}
                      <div className="absolute w-5 h-5 rounded-full bg-[#050811] border-2 border-white/60 shadow-inner z-20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-silver bg-slate-300" />
                      </div>

                      {/* Label Side text */}
                      <span className="absolute bottom-2 text-[9px] font-black uppercase text-white bg-black/70 px-1.5 py-0.5 rounded-full z-10">
                        Side {vinylSide}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tonearm & Needle (Realistic Pivoting Tonearm) */}
            <div
              className="absolute -top-4 right-2 sm:right-6 w-24 h-48 pointer-events-none z-30 transition-transform duration-700 ease-out origin-top-right"
              style={{
                transform: isPlaying ? 'rotate(24deg)' : 'rotate(0deg)'
              }}
            >
              {/* Tonearm Base / Gimbal Bearing */}
              <div className="absolute top-0 right-0 w-10 h-10 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 border border-slate-500 shadow-xl flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-slate-800 border border-sky-400/50" />
              </div>

              {/* Tonearm Counterweight */}
              <div className="absolute -top-3 right-2 w-6 h-5 rounded-sm bg-slate-700 border border-slate-600 shadow-md" />

              {/* Tonearm Wand (Metallic Curved Tube) */}
              <div className="absolute top-8 right-4 w-1.5 h-32 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-400 rounded-full shadow-lg" />

              {/* Headshell & Stylus Cartridge */}
              <div className="absolute bottom-8 right-2 w-5 h-9 bg-gradient-to-br from-rose-600 to-rose-700 rounded-sm shadow-md border border-white/20 flex flex-col items-center justify-end p-0.5">
                <div className="w-1 h-2 bg-white rounded-full shadow-glow-crimson animate-pulse" />
              </div>
            </div>

            {/* Center Play/Pause Floating Prompt */}
            <button
              onClick={togglePlay}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-[#0d162b] hover:bg-sky-500 hover:text-white text-sky-300 border border-sky-400/40 text-xs font-bold tracking-wide shadow-glow-sky flex items-center gap-2 transition-all transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              {isPlaying ? 'PAUSE VINYL' : 'DROP NEEDLE & PLAY'}
            </button>
          </div>
        </div>

        {/* Right Column: Album Details & Metadata (Image 1 style) */}
        <div className="lg:col-span-3 space-y-5">
          {currentTrack ? (
            <div className="bg-[#090f1f]/80 p-5 rounded-3xl border border-sky-500/20 shadow-xl space-y-4">
              
              {/* Album Art Preview */}
              <div className="relative group rounded-2xl overflow-hidden aspect-square border border-slate-700/60 shadow-2xl">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.album}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/80 text-white backdrop-blur-md">
                  {currentTrack.genre || 'Master'}
                </span>
                <span className="absolute bottom-3 right-3 text-[11px] font-mono text-slate-300 font-bold">
                  {currentTrack.releaseYear || '2024'}
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-semibold text-sky-400 tracking-wider">
                    Album Spotlight
                  </span>
                  <button
                    onClick={() => toggleLike(currentTrack)}
                    className="p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        currentTrackIsLiked ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_8px_rgba(225,29,72,0.8)]' : 'text-slate-400 hover:text-white'
                      }`}
                    />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mt-1 truncate">
                  {currentTrack.album || currentTrack.title}
                </h3>
                <p className="text-sm text-slate-300 font-medium">{currentTrack.artist}</p>
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 leading-relaxed line-clamp-3">
                {currentTrack.description || 'Delivering rich analog warm frequencies, acoustic depth, and radiant studio clarity.'}
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-500">Plays: </span>
                  <span className="text-sky-400 font-semibold">{currentTrack.plays || 0}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-500">Likes: </span>
                  <span className="text-rose-400 font-semibold">{currentTrack.likes || 0}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#090f1d] border border-slate-800 text-center text-slate-400 text-xs">
              Select a vinyl track to view full analog sleeve notes.
            </div>
          )}

          {/* Mini Live Equalizer Box */}
          <div className="bg-[#090f1f]/80 p-4 rounded-2xl border border-sky-500/20 shadow-inner space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                <Radio className="w-3.5 h-3.5 text-rose-500" />
                Live Frequency Spectrum
              </span>
              <span className="text-[10px] text-sky-400 font-mono">20Hz - 20kHz</span>
            </div>
            <AudioVisualizer height={36} barCount={32} />
          </div>
        </div>

      </div>
    </div>
  );
};
