import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import {
  Play,
  Pause,
  Heart,
  Sparkles,
  TrendingUp,
  Disc,
  Clock,
  Radio,
  Flame,
  ChevronRight
} from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';

export const MidnightView = ({ onSelectTrack }) => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    togglePlay,
    playTrack,
    isLiked,
    toggleLike
  } = useMusic();

  const [selectedGenre, setSelectedGenre] = useState('All');

  const genres = ['All', 'Classic Rock', 'Hard Rock', 'Indie Pop', 'Pop / Synth', 'Synthwave', 'Electronic'];

  const filteredTracks = selectedGenre === 'All'
    ? tracks
    : tracks.filter(t => (t.genre || '').toLowerCase().includes(selectedGenre.toLowerCase()));

  const heroTrack = currentTrack || tracks[0];
  const heroIsLiked = heroTrack ? isLiked(heroTrack._id || heroTrack.id) : false;

  return (
    <div className="space-y-8">
      
      {/* Hero Spotlight Section (Inspired by Image 2 "MIDNIGHT" & Image 4 "Apple Music") */}
      {heroTrack && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b1224] via-[#101b36] to-[#0d162d] border border-sky-500/20 shadow-2xl p-6 lg:p-10">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left: Album Cover with Midnight Sunset Glow */}
            <div className="relative group w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-3xl overflow-hidden shrink-0 shadow-2xl border-2 border-sky-400/30">
              <img
                src={heroTrack.coverUrl}
                alt={heroTrack.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-sky-300 border border-sky-400/30 backdrop-blur-md flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-500 fill-current" />
                Featured Master
              </div>

              {/* Side badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500 text-white shadow-glow-crimson">
                Side {heroTrack.vinylSide || 'A'}
              </div>
            </div>

            {/* Middle: Track Title, Artist, & Play Controls */}
            <div className="flex-1 space-y-4 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <span className="text-xs uppercase tracking-widest text-sky-400 font-bold">
                  Now Playing Spotlight
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
                <span className="text-xs font-mono text-slate-400">
                  {heroTrack.genre || 'Electronic'}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                {heroTrack.title}
              </h2>

              <p className="text-xl sm:text-2xl font-light text-slate-300">
                {heroTrack.artist}
              </p>

              <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                {heroTrack.description || 'Every moment with you feels like the perfect song. Immersive vinyl textures and radiant frequencies.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={() => playTrack(heroTrack)}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-crimson-light text-white text-sm font-bold shadow-glow-crimson flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
                >
                  {isPlaying && currentTrack?._id === heroTrack._id ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      Pause Audio
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                      Play Spotlight
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleLike(heroTrack)}
                  className={`p-3 rounded-full border transition-all ${
                    heroIsLiked
                      ? 'bg-rose-500/20 border-rose-500 text-rose-500 shadow-glow-crimson'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${heroIsLiked ? 'fill-current' : ''}`} />
                </button>

                <span className="text-xs font-mono text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  ⏱ {heroTrack.durationFormatted || '3:30'}
                </span>
              </div>
            </div>

            {/* Right: Real-time Audio Waveform preview */}
            <div className="w-full lg:w-48 bg-[#090f1e]/80 p-4 rounded-2xl border border-sky-500/20 text-center space-y-2">
              <span className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider block">
                Harmonic Flow
              </span>
              <AudioVisualizer height={40} barCount={24} />
              <span className="text-[10px] text-slate-500 font-mono">Dynamic Audio Stream</span>
            </div>

          </div>
        </div>
      )}

      {/* Genre Filter Tags (Apple Music Image 4 style) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
          Genres:
        </span>
        {genres.map(genre => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedGenre === genre
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                : 'bg-[#0d1629] text-slate-400 hover:text-white border border-slate-800 hover:border-sky-500/30'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* "Made For You" Carousel Cards (Image 2 style) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Made For You
              <Sparkles className="w-4 h-4 text-sky-400" />
            </h3>
            <p className="text-xs text-slate-400">Curated analog selections based on your sonic taste</p>
          </div>
          <span className="text-xs font-semibold text-sky-400 hover:underline cursor-pointer flex items-center">
            See all <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredTracks.map(track => {
            const isCurrent = currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id);
            const trackIsLiked = isLiked(track._id || track.id);

            return (
              <div
                key={track._id || track.id}
                onClick={() => playTrack(track)}
                className="group relative bg-[#090f1f] rounded-2xl p-3 border border-sky-500/15 hover:border-sky-400/40 transition-all hover:-translate-y-1 hover:shadow-glow-sky cursor-pointer flex flex-col justify-between"
              >
                {/* Artwork */}
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

                  {/* Play Button Overlay */}
                  <button
                    className={`absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                      isCurrent && isPlaying
                        ? 'bg-rose-500 text-white shadow-glow-crimson scale-100'
                        : 'bg-white text-black opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 shadow-lg'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                  </button>

                  <span className="absolute top-2 left-2 text-[9px] font-mono font-bold bg-black/70 text-sky-300 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    Side {track.vinylSide || 'A'}
                  </span>
                </div>

                {/* Track Info */}
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{track.genre || 'Single'}</span>
                  <span>{track.durationFormatted || '3:00'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Tracks Table (Image 2 & 4 style) */}
      <div className="bg-[#090f1f]/90 rounded-3xl p-6 border border-sky-500/20 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              Popular Vinyl & Digital Streams
            </h3>
            <p className="text-xs text-slate-400">High fidelity catalog tracks available to all listeners</p>
          </div>
          <span className="text-xs font-mono text-sky-400">
            {tracks.length} Tracks in Library
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3 px-3 w-10">#</th>
                <th className="py-3 px-3">Title & Artist</th>
                <th className="py-3 px-3 hidden sm:table-cell">Album</th>
                <th className="py-3 px-3 hidden md:table-cell">Genre</th>
                <th className="py-3 px-3 text-right">Plays</th>
                <th className="py-3 px-3 text-right">Time</th>
                <th className="py-3 px-3 text-center w-12">Like</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTracks.map((track, idx) => {
                const isCurrent = currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id);
                const trackIsLiked = isLiked(track._id || track.id);

                return (
                  <tr
                    key={track._id || track.id || idx}
                    onClick={() => playTrack(track)}
                    className={`group cursor-pointer transition-colors ${
                      isCurrent
                        ? 'bg-sky-500/10 text-white'
                        : 'hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    {/* Index or Play icon */}
                    <td className="py-3 px-3 font-mono">
                      <span className="group-hover:hidden">{String(idx + 1).padStart(2, '0')}</span>
                      <button className="hidden group-hover:inline-block text-sky-400">
                        {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                    </td>

                    {/* Title & Cover */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={track.coverUrl}
                          alt={track.title}
                          className="w-9 h-9 rounded-lg object-cover shadow border border-slate-700"
                        />
                        <div className="min-w-0">
                          <p className={`font-bold truncate ${isCurrent ? 'text-sky-300' : 'text-white'}`}>
                            {track.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                        </div>
                      </div>
                    </td>

                    {/* Album */}
                    <td className="py-3 px-3 hidden sm:table-cell text-slate-400 truncate">
                      {track.album || 'Single'}
                    </td>

                    {/* Genre */}
                    <td className="py-3 px-3 hidden md:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-sky-300 border border-slate-700 font-semibold">
                        {track.genre || 'Electronic'}
                      </span>
                    </td>

                    {/* Plays */}
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {track.plays || 0}
                    </td>

                    {/* Duration */}
                    <td className="py-3 px-3 text-right font-mono text-slate-400">
                      {track.durationFormatted || '3:00'}
                    </td>

                    {/* Like button */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(track);
                      }}
                    >
                      <button className="p-1 hover:scale-110 transition-transform">
                        <Heart
                          className={`w-4 h-4 ${
                            trackIsLiked
                              ? 'text-rose-500 fill-rose-500 filter drop-shadow-[0_0_6px_rgba(225,29,72,0.8)]'
                              : 'text-slate-500 hover:text-white'
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
