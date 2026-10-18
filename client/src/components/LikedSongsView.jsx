import React from 'react';
import { useMusic } from '../context/MusicContext';
import { Heart, Play, Pause, Disc } from 'lucide-react';

export const LikedSongsView = () => {
  const { tracks, likedIds, playTrack, currentTrack, isPlaying, toggleLike } = useMusic();

  const likedTracks = tracks.filter(t => likedIds.includes(t._id || t.id));

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/40 via-[#0d152a] to-[#070b16] rounded-3xl p-6 lg:p-8 border border-rose-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-rose-500 via-rose-600 to-crimson-light text-white shadow-glow-crimson flex items-center justify-center shrink-0">
            <Heart className="w-10 h-10 fill-current" />
          </div>
          <div>
            <span className="text-xs uppercase font-extrabold text-rose-400 tracking-wider">
              Listener Collection
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Liked Tracks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {likedTracks.length} favorite songs saved to your listening session.
            </p>
          </div>
        </div>
      </div>

      {/* Track List */}
      {likedTracks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedTracks.map((track) => {
            const isCurrent = currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id);

            return (
              <div
                key={track._id || track.id}
                onClick={() => playTrack(track)}
                className="group bg-[#090f1f] rounded-2xl p-3 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-between cursor-pointer shadow-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-700">
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isCurrent && isPlaying ? (
                        <Pause className="w-5 h-5 text-white fill-current" />
                      ) : (
                        <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                      )}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate group-hover:text-rose-300 transition-colors">
                      {track.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate">{track.artist}</p>
                    <span className="text-[10px] text-sky-400 font-mono">Side {track.vinylSide || 'A'}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(track);
                  }}
                  className="p-2 rounded-xl text-rose-500 hover:bg-rose-500/20 transition-colors shrink-0"
                >
                  <Heart className="w-4 h-4 fill-current filter drop-shadow-[0_0_6px_rgba(225,29,72,0.8)]" />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#090f1f] border border-slate-800 text-slate-400 space-y-2">
          <Heart className="w-12 h-12 mx-auto text-rose-500/30" />
          <p className="text-sm">You haven't liked any songs yet.</p>
          <p className="text-xs text-slate-500">Click the heart icon on any vinyl or preview track to add it here!</p>
        </div>
      )}

    </div>
  );
};
