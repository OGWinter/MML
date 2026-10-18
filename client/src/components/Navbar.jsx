import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Disc,
  Search,
  ShieldCheck,
  UploadCloud,
  LogOut,
  User,
  Sparkles,
  Music2,
  Globe
} from 'lucide-react';

export const Navbar = ({
  searchQuery,
  setSearchQuery,
  activeView,
  setActiveView,
  onOpenAdminLogin,
  onOpenAdminStudio
}) => {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#060a16]/90 backdrop-blur-xl border-b border-sky-500/15 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div
          onClick={() => setActiveView('turntable')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 via-sky-400 to-blue-600 p-0.5 shadow-glow-sky group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070b15] rounded-[14px] flex items-center justify-center">
              <Disc className="w-5 h-5 text-sky-400 group-hover:rotate-180 transition-transform duration-700" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base lg:text-lg font-black tracking-wider text-white">
                VINYLIST
              </h1>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-glow-crimson">
                RADIANT
              </span>
            </div>
            <p className="text-[11px] text-sky-400/80 font-medium tracking-tight">
              Hi-Fi Vinyl & Global Streaming
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400/60" />
            <input
              type="text"
              placeholder="Search vinyls, artists, Apple Music & Spotify..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a1122] border border-sky-500/20 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Navigation Tabs & Admin Status */}
        <div className="flex items-center gap-3">
          
          {/* View Switcher Pills */}
          <div className="hidden sm:flex items-center p-1 bg-[#090f1e] rounded-2xl border border-sky-500/20 text-xs">
            <button
              onClick={() => setActiveView('turntable')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'turntable'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Disc className="w-3.5 h-3.5" />
              Vinyl Deck
            </button>
            <button
              onClick={() => setActiveView('midnight')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'midnight'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-glow-sky'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Music2 className="w-3.5 h-3.5" />
              Midnight
            </button>
            <button
              onClick={() => setActiveView('external')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'external'
                  ? 'bg-gradient-to-r from-rose-500 to-crimson-light text-white shadow-glow-crimson'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Apple & Spotify
            </button>
          </div>

          {/* Admin Status / Actions */}
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenAdminStudio}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-crimson-light text-white text-xs font-bold tracking-wide shadow-glow-crimson flex items-center gap-1.5 hover:opacity-95 transition-all"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin</span> Studio
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl bg-[#0f172a] hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                title="Log out of Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="px-3.5 py-1.5 rounded-xl bg-[#0e162b] hover:bg-sky-500/20 border border-sky-400/30 text-sky-300 hover:text-white text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              Admin Access
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
