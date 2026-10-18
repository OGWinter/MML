import React from 'react';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import {
  Disc,
  Compass,
  Heart,
  Globe,
  Radio,
  Music,
  ShieldCheck,
  UploadCloud,
  Flame,
  ListMusic
} from 'lucide-react';

export const Sidebar = ({ activeView, setActiveView, onOpenAdminStudio, onOpenAdminLogin }) => {
  const { vinylSide, setVinylSide, likedIds, tracks, playTrack } = useMusic();
  const { isAdmin, user } = useAuth();

  const curatedPlaylists = [
    { name: 'Late Night Drive', genre: 'Synthwave', desc: 'Chill synth city nights' },
    { name: 'Acoustic Mornings', genre: 'Indie Pop', desc: 'Soft, calm & beautiful' },
    { name: 'Heartbreak Diaries', genre: 'Classic Rock', desc: 'Emotional analog depth' },
    { name: 'Radiant Good Vibes', genre: 'Electronic', desc: 'Feel good radiant mix' },
  ];

  const handlePlaylistClick = (genre) => {
    const match = tracks.find(t => (t.genre || '').toLowerCase().includes(genre.toLowerCase()));
    if (match) {
      playTrack(match);
      setActiveView('midnight');
    }
  };

  return (
    <aside className="w-64 bg-[#070b16] border-r border-sky-500/15 p-5 flex flex-col justify-between shrink-0 hidden lg:flex select-none">
      <div className="space-y-6">
        
        {/* Navigation Section */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
            Menu
          </span>

          <button
            onClick={() => setActiveView('turntable')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeView === 'turntable'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Disc className="w-4 h-4 text-sky-300" />
            <span>Vinyl Turntable</span>
          </button>

          <button
            onClick={() => setActiveView('midnight')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeView === 'midnight'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Compass className="w-4 h-4 text-rose-400" />
            <span>Midnight Discovery</span>
          </button>

          <button
            onClick={() => setActiveView('external')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeView === 'external'
                ? 'bg-gradient-to-r from-rose-500 to-crimson-light text-white shadow-glow-crimson'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Apple & Spotify APIs</span>
          </button>

          <button
            onClick={() => setActiveView('liked')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeView === 'liked'
                ? 'bg-gradient-to-r from-rose-500 to-crimson-light text-white shadow-glow-crimson'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Liked Vinyls</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
              {likedIds.length}
            </span>
          </button>
        </div>

        {/* Vinyl Sides Selector */}
        <div className="p-3.5 rounded-2xl bg-[#090f1f] border border-sky-500/20 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 block">
            Turntable Disc Sides
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setVinylSide('A');
                setActiveView('turntable');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                vinylSide === 'A'
                  ? 'bg-sky-500 text-white shadow-glow-sky'
                  : 'bg-[#060a14] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Side A
            </button>
            <button
              onClick={() => {
                setVinylSide('B');
                setActiveView('turntable');
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                vinylSide === 'B'
                  ? 'bg-rose-500 text-white shadow-glow-crimson'
                : 'bg-[#060a14] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Side B
            </button>
          </div>
        </div>

        {/* Curated Midnight Playlists (Image 2 style) */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
            Your Playlists
          </span>
          <div className="space-y-1">
            {curatedPlaylists.map((pl) => (
              <div
                key={pl.name}
                onClick={() => handlePlaylistClick(pl.genre)}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[#0b1224] cursor-pointer transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-300 group-hover:text-sky-300 truncate">
                    {pl.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{pl.desc}</p>
                </div>
                <ListMusic className="w-3.5 h-3.5 text-slate-600 group-hover:text-rose-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Admin Quick Action Card at bottom of sidebar */}
      <div className="pt-4 border-t border-slate-800">
        {isAdmin ? (
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-950/40 via-slate-900 to-sky-950/30 border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold text-white">Admin Privileges Active</span>
            </div>
            <p className="text-[10px] text-slate-400">Multer uploads & Apple Music imports enabled.</p>
            <button
              onClick={onOpenAdminStudio}
              className="w-full py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-crimson-light text-white text-[11px] font-bold shadow-glow-crimson hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              Open Studio
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAdminLogin}
            className="w-full p-3 rounded-2xl bg-[#090f1f] hover:bg-sky-500/10 border border-sky-500/20 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-sky-400 group-hover:text-white">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold">Admin Portal</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Sign in to add & manage audio files
            </p>
          </button>
        )}
      </div>

    </aside>
  );
};
