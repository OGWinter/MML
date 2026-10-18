import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  Globe,
  Play,
  Pause,
  PlusCircle,
  ExternalLink,
  Sparkles,
  Disc,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const ExternalMusicSearch = () => {
  const [query, setQuery] = useState('Daft Punk');
  const [provider, setProvider] = useState('apple'); // 'apple' or 'spotify'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const { playTrack, currentTrack, isPlaying, refreshTracks } = useMusic();
  const { isAdmin } = useAuth();

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setFeedback(null);
    try {
      if (provider === 'apple') {
        const data = await api.searchApple(searchQuery, 24);
        setResults(data.tracks || []);
      } else {
        const data = await api.searchSpotify(searchQuery, 24);
        setResults(data.tracks || []);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to search music catalog. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch('Daft Punk');
  }, [provider]);

  const handleImport = async (track, side) => {
    setImportingId(track.externalId);
    try {
      await api.importTrack({
        ...track,
        vinylSide: side
      });
      setFeedback({ type: 'success', message: `Added "${track.title}" to Radiant Side ${side}!` });
      await refreshTracks();
      setTimeout(() => setFeedback(null), 4000);
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Import failed.' });
    } finally {
      setImportingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0c152a] via-[#101b38] to-[#141432] rounded-3xl p-6 lg:p-8 border border-sky-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-sky-400 tracking-wider">
                Global Streaming API Discovery
              </span>
              <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded-full border border-rose-500/30">
                Apple Music & Spotify
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Worldwide Music Explorer
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Listen to preview streams from millions of songs across Apple Music and Spotify. Normal listeners can preview instantly; administrators can import any song directly into the Radiant Vinyl library.
            </p>
          </div>

          {/* Provider Toggle */}
          <div className="p-1 bg-[#090f1d] rounded-2xl border border-sky-500/25 flex items-center shadow-inner">
            <button
              onClick={() => setProvider('apple')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                provider === 'apple'
                  ? 'bg-gradient-to-r from-rose-500 to-crimson-light text-white shadow-glow-crimson'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apple Music
            </button>
            <button
              onClick={() => setProvider('spotify')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                provider === 'spotify'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Spotify API
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400" />
            <input
              type="text"
              placeholder={`Search artist, track, album on ${provider === 'apple' ? 'Apple Music' : 'Spotify'}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full bg-[#070b16] border border-sky-500/30 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-rose-600 text-white text-xs font-bold tracking-wider uppercase shadow-glow-sky hover:opacity-95 transition-all shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : 'Explore Catalog'}
          </button>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 border ${
            feedback.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
          }`}>
            {feedback.type === 'success' ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {results.map((track) => {
          const isCurrent = currentTrack && (currentTrack.externalId === track.externalId || currentTrack.title === track.title);
          const isImporting = importingId === track.externalId;

          return (
            <div
              key={track.externalId || track.id}
              className="group bg-[#090f1f] rounded-3xl p-4 border border-sky-500/20 hover:border-sky-400/50 shadow-xl transition-all hover:-translate-y-1 hover:shadow-glow-sky flex flex-col justify-between"
            >
              <div>
                {/* Artwork */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 shadow-md">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => playTrack(track)}
                    className={`absolute bottom-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                      isCurrent && isPlaying
                        ? 'bg-rose-500 text-white shadow-glow-crimson scale-105'
                        : 'bg-white text-black hover:scale-110'
                    }`}
                    title="Play Preview Stream"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-5 h-5 fill-current" />
                    ) : (
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    )}
                  </button>

                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-sky-300 border border-sky-400/30 backdrop-blur-md">
                    {track.source === 'apple' ? ' Apple Music' : 'Spotify'}
                  </span>
                </div>

                {/* Metadata */}
                <h4 className="text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                  {track.title}
                </h4>
                <p className="text-xs text-slate-400 truncate mt-0.5">{track.artist}</p>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{track.album || 'Single'}</p>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>{track.genre || 'Pop'}</span>
                  <span>{track.durationFormatted || '3:00'}</span>
                </div>

                {/* Admin Import Options vs Listener Action */}
                {isAdmin ? (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleImport(track, 'A')}
                      disabled={isImporting}
                      className="py-1.5 px-2 rounded-xl bg-sky-500/20 hover:bg-sky-500 text-sky-300 hover:text-white border border-sky-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Side A
                    </button>
                    <button
                      onClick={() => handleImport(track, 'B')}
                      disabled={isImporting}
                      className="py-1.5 px-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <PlusCircle className="w-3 h-3" />
                      Side B
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => playTrack(track)}
                    className="w-full py-2 rounded-xl bg-[#0f172a] hover:bg-sky-500 hover:text-white text-sky-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Listen Preview
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 && !loading && (
        <div className="p-12 text-center rounded-3xl bg-[#080d1a] border border-slate-800 text-slate-400 space-y-2">
          <Disc className="w-12 h-12 mx-auto text-sky-500/40 animate-spin" />
          <p className="text-sm">No streaming tracks found for "{query}". Try another search term.</p>
        </div>
      )}

    </div>
  );
};
