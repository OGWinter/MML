import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useMusic } from '../context/MusicContext';
import { useAuth } from '../context/AuthContext';
import {
  X,
  UploadCloud,
  Disc,
  Music,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
  BarChart3,
  Layers,
  Sparkles
} from 'lucide-react';

export const AdminModal = ({ isOpen, onClose }) => {
  const { tracks, refreshTracks } = useMusic();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'manage', 'stats'
  const [stats, setStats] = useState(null);

  // Form State
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [vinylSide, setVinylSide] = useState('A');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState('2024');
  const [audioUrl, setAudioUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');

  // Multer Files
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (isOpen) {
      api.getStats().then(setStats).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('artist', artist);
      formData.append('album', album || 'Single');
      formData.append('genre', genre);
      formData.append('vinylSide', vinylSide);
      formData.append('description', description);
      formData.append('releaseYear', releaseYear);

      if (audioFile) {
        formData.append('audio', audioFile);
      } else if (audioUrl) {
        formData.append('audioUrl', audioUrl);
      } else {
        throw new Error('Please select an audio file (MP3/WAV) or provide an audio URL.');
      }

      if (coverFile) {
        formData.append('cover', coverFile);
      } else if (coverUrl) {
        formData.append('coverUrl', coverUrl);
      }

      await api.uploadTrack(formData);
      setFeedback({ type: 'success', message: `Track "${title}" successfully added by Admin!` });
      await refreshTracks();
      const updatedStats = await api.getStats();
      setStats(updatedStats);

      // Reset form
      setTitle('');
      setArtist('');
      setAlbum('');
      setDescription('');
      setAudioFile(null);
      setCoverFile(null);
      setAudioUrl('');
      setCoverUrl('');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (trackId, trackTitle) => {
    if (!window.confirm(`Delete "${trackTitle}" from music library?`)) return;
    try {
      await api.deleteTrack(trackId);
      await refreshTracks();
      const updatedStats = await api.getStats();
      setStats(updatedStats);
    } catch (err) {
      alert('Failed to delete track: ' + err.message);
    }
  };

  const handleSideSwitch = async (track) => {
    const nextSide = (track.vinylSide === 'A') ? 'B' : 'A';
    try {
      await api.updateTrack(track._id || track.id, { vinylSide: nextSide });
      await refreshTracks();
    } catch (err) {
      alert('Failed to change side');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#090f1f] border border-sky-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-sky-500/20 bg-[#070b16]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-rose-500 via-sky-400 to-blue-600 text-white shadow-glow-crimson">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-rose-400 tracking-wider">
                  Admin Privileged Studio
                </span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded-full border border-sky-500/30 font-bold">
                  Multer + JWT
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">Music Management Console</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-[#080d1a] px-6 text-xs font-bold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-rose-500 text-white shadow-glow-crimson'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Upload Music (Multer)
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'manage'
                ? 'border-sky-400 text-white shadow-glow-sky'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Manage Catalog ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-3.5 px-4 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'stats'
                ? 'border-blue-500 text-white shadow-glow-blue'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Library Insights
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {feedback && (
            <div className={`mb-6 p-4 rounded-2xl text-xs flex items-center gap-3 border ${
              feedback.type === 'success'
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-rose-950/70 border-rose-500/50 text-rose-300'
            }`}>
              {feedback.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span className="font-medium">{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD (MULTER) */}
          {activeTab === 'upload' && (
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Track Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Celestial Horizon"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Artist */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Artist Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luna Echoes"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Album */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Album Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Midnight Reverie"
                    value={album}
                    onChange={(e) => setAlbum(e.target.value)}
                    className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                  />
                </div>

                {/* Genre */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Genre</label>
                  <select
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  >
                    <option value="Electronic">Electronic</option>
                    <option value="Synthwave">Synthwave</option>
                    <option value="Indie Pop">Indie Pop</option>
                    <option value="Classic Rock">Classic Rock</option>
                    <option value="Hard Rock">Hard Rock</option>
                    <option value="Lo-Fi Chill">Lo-Fi Chill</option>
                    <option value="Pop / Synth">Pop / Synth</option>
                  </select>
                </div>

                {/* Vinyl Side Selection */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Assigned Vinyl Side</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setVinylSide('A')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        vinylSide === 'A'
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300 shadow-glow-sky'
                          : 'bg-[#070b16] border-slate-800 text-slate-400'
                      }`}
                    >
                      Side A
                    </button>
                    <button
                      type="button"
                      onClick={() => setVinylSide('B')}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        vinylSide === 'B'
                          ? 'bg-rose-500/20 border-rose-400 text-rose-300 shadow-glow-crimson'
                          : 'bg-[#070b16] border-slate-800 text-slate-400'
                      }`}
                    >
                      Side B
                    </button>
                  </div>
                </div>

                {/* Release Year */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Release Year</label>
                  <input
                    type="text"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              {/* File Uploads (Multer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                
                {/* Audio File Input */}
                <div className="p-4 rounded-2xl bg-[#070b16] border border-dashed border-sky-500/40 hover:border-sky-400 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-sky-400 font-semibold text-xs">
                    <Music className="w-4 h-4" />
                    <span>Upload Audio Track (Multer)</span>
                  </div>
                  <input
                    type="file"
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500 file:text-white hover:file:bg-sky-600 cursor-pointer"
                  />
                  {audioFile ? (
                    <p className="text-[11px] text-emerald-400 mt-2 font-mono truncate">
                      ✓ Ready: {audioFile.name} ({(audioFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  ) : (
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-500 block mb-1">Or paste audio URL:</span>
                      <input
                        type="url"
                        placeholder="https://... audio stream URL"
                        value={audioUrl}
                        onChange={(e) => setAudioUrl(e.target.value)}
                        className="w-full bg-[#090f1e] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white"
                      />
                    </div>
                  )}
                </div>

                {/* Cover Image Input */}
                <div className="p-4 rounded-2xl bg-[#070b16] border border-dashed border-rose-500/40 hover:border-rose-400 transition-colors">
                  <div className="flex items-center gap-2 mb-2 text-rose-400 font-semibold text-xs">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Cover Artwork (Multer)</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => setCoverFile(e.target.files[0])}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600 cursor-pointer"
                  />
                  {coverFile ? (
                    <p className="text-[11px] text-emerald-400 mt-2 font-mono truncate">
                      ✓ Ready: {coverFile.name}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <span className="text-[10px] text-slate-500 block mb-1">Or paste image URL:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={coverUrl}
                        onChange={(e) => setCoverUrl(e.target.value)}
                        className="w-full bg-[#090f1e] border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-white"
                      />
                    </div>
                  )}
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Sleeve Notes / Description</label>
                <textarea
                  rows="2"
                  placeholder="Audiophile mastering notes, acoustic highlights..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#070b16] border border-sky-500/25 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-sky-500 to-blue-600 text-white text-xs font-bold shadow-glow-crimson hover:opacity-95 transition-all flex items-center gap-2"
                >
                  {loading ? 'Uploading via Multer...' : 'Publish to Radiant Vinyl Library'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MANAGE CATALOG */}
          {activeTab === 'manage' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
                <span>Manage active catalog tracks ({tracks.length})</span>
                <span>Click Side badge to toggle A / B</span>
              </div>

              <div className="space-y-2">
                {tracks.map((track) => (
                  <div
                    key={track._id || track.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#070b16] border border-slate-800 hover:border-sky-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-700"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate">{track.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{track.artist} • {track.genre}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSideSwitch(track)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                          track.vinylSide === 'A'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-400'
                            : 'bg-rose-500/20 text-rose-300 border-rose-400'
                        }`}
                        title="Click to toggle between Side A and Side B"
                      >
                        Side {track.vinylSide || 'A'}
                      </button>

                      <button
                        onClick={() => handleDelete(track._id || track.id, track.title)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                        title="Delete Track"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: LIBRARY INSIGHTS / STATS */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#070b16] border border-sky-500/20">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Tracks</span>
                  <p className="text-2xl font-black text-white mt-1">{stats.totalTracks}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b16] border border-sky-500/20">
                  <span className="text-[10px] uppercase font-bold text-sky-400">Side A Cuts</span>
                  <p className="text-2xl font-black text-sky-300 mt-1">{stats.sideA}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b16] border border-rose-500/20">
                  <span className="text-[10px] uppercase font-bold text-rose-400">Side B Cuts</span>
                  <p className="text-2xl font-black text-rose-300 mt-1">{stats.sideB}</p>
                </div>
                <div className="p-4 rounded-2xl bg-[#070b16] border border-blue-500/20">
                  <span className="text-[10px] uppercase font-bold text-blue-400">Total Plays</span>
                  <p className="text-2xl font-black text-white mt-1">{stats.totalPlays}</p>
                </div>
              </div>

              {/* Genre Distribution */}
              <div className="p-5 rounded-2xl bg-[#070b16] border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Genre Distribution
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.genres || {}).map(([g, count]) => {
                    const pct = Math.round((count / (stats.totalTracks || 1)) * 100);
                    return (
                      <div key={g} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{g}</span>
                          <span className="text-slate-400 font-mono">{count} tracks ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-sky-400 to-rose-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
