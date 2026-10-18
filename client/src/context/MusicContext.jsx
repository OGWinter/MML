import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { api } from '../services/api';

const MusicContext = createContext(null);

export const MusicProvider = ({ children }) => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [vinylSide, setVinylSide] = useState('A');
  const [turntableRpm, setTurntableRpm] = useState(33);
  const [likedIds, setLikedIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('radiant_liked_ids')) || [];
    } catch {
      return [];
    }
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dedicated HTML5 Audio Element
  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);

  // Initialize Audio instance once
  if (!audioRef.current && typeof Audio !== 'undefined') {
    audioRef.current = new Audio();
    audioRef.current.preload = 'auto';
  }

  // Load tracks from server on mount
  const refreshTracks = async () => {
    try {
      setLoading(true);
      const data = await api.getTracks();
      setTracks(data.tracks || []);
      if (data.tracks && data.tracks.length > 0) {
        // Default to first track if none selected
        setCurrentTrack(prev => prev || data.tracks[0]);
      }
    } catch (err) {
      console.error('Failed to load tracks from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTracks();
  }, []);

  // Save liked IDs
  useEffect(() => {
    localStorage.setItem('radiant_liked_ids', JSON.stringify(likedIds));
  }, [likedIds]);

  // Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
    };

    const onPause = () => {
      setIsPlaying(false);
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else {
        nextTrack();
      }
    };

    const onError = (e) => {
      console.warn('Playback error event:', e);
      // If direct external URL failed, try streaming via backend proxy
      if (currentTrack && currentTrack.audioUrl && !currentTrack.audioUrl.includes('/stream/proxy') && !currentTrack.audioUrl.includes('localhost:5050')) {
        const proxyUrl = `http://localhost:5050/api/tracks/stream/proxy?url=${encodeURIComponent(currentTrack.audioUrl)}`;
        console.log('Retrying audio playback via backend stream proxy:', proxyUrl);
        audio.src = proxyUrl;
        audio.load();
        audio.play().then(() => setIsPlaying(true)).catch(console.error);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [isLooping, currentTrack, tracks]);

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Play a specific track
  const playTrack = async (track) => {
    if (!track) return;
    const audio = audioRef.current;
    if (!audio) return;

    const isSameTrack = currentTrack && (currentTrack._id === track._id || currentTrack.id === track.id);

    if (isSameTrack && isPlaying) {
      audio.pause();
      return;
    }

    setCurrentTrack(track);
    if (track.vinylSide) {
      setVinylSide(track.vinylSide);
    }

    // Add to recently played (unique)
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => (t._id || t.id) !== (track._id || track.id));
      return [track, ...filtered].slice(0, 10);
    });

    const targetUrl = track.audioUrl;
    if (audio.src !== targetUrl) {
      audio.src = targetUrl;
      audio.load();
    }

    try {
      await audio.play();
      setIsPlaying(true);
      if (track._id) {
        api.recordPlay(track._id);
      }
    } catch (err) {
      console.warn('Direct play rejected (trying fallback):', err.message);
      // Try backend proxy if external
      if (targetUrl.startsWith('http') && !targetUrl.includes('localhost:5050')) {
        const proxyUrl = `http://localhost:5050/api/tracks/stream/proxy?url=${encodeURIComponent(targetUrl)}`;
        audio.src = proxyUrl;
        audio.load();
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (retryErr) {
          console.error('Proxy play also failed:', retryErr);
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!currentTrack && tracks.length > 0) {
      playTrack(tracks[0]);
      return;
    }

    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src && currentTrack) {
        audio.src = currentTrack.audioUrl;
        audio.load();
      }
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn('Play was prevented:', err);
      });
    }
  };

  // Seek audio position
  const seek = (time) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Next Track
  const nextTrack = () => {
    if (tracks.length === 0) return;
    if (isShuffling) {
      const randomIdx = Math.floor(Math.random() * tracks.length);
      playTrack(tracks[randomIdx]);
      return;
    }

    const currentIdx = tracks.findIndex(t => (t._id || t.id) === (currentTrack?._id || currentTrack?.id));
    const nextIdx = (currentIdx + 1) % tracks.length;
    playTrack(tracks[nextIdx]);
  };

  // Previous Track
  const prevTrack = () => {
    if (tracks.length === 0) return;
    if (currentTime > 3) {
      seek(0);
      return;
    }
    const currentIdx = tracks.findIndex(t => (t._id || t.id) === (currentTrack?._id || currentTrack?.id));
    const prevIdx = (currentIdx - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIdx]);
  };

  // Toggle Like
  const toggleLike = async (track) => {
    const trackId = track._id || track.id;
    const isLiked = likedIds.includes(trackId);
    const newLiked = !isLiked;

    setLikedIds(prev => newLiked ? [...prev, trackId] : prev.filter(id => id !== trackId));

    if (track._id) {
      try {
        await api.toggleLike(track._id, newLiked);
        setTracks(prev => prev.map(t => {
          if (t._id === track._id) {
            return { ...t, likes: Math.max(0, (t.likes || 0) + (newLiked ? 1 : -1)) };
          }
          return t;
        }));
      } catch (err) {
        console.warn('Failed to update like on server:', err);
      }
    }
  };

  const isLiked = (trackId) => likedIds.includes(trackId);

  return (
    <MusicContext.Provider value={{
      tracks,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      setVolume,
      isMuted,
      setIsMuted,
      isLooping,
      setIsLooping,
      isShuffling,
      setIsShuffling,
      vinylSide,
      setVinylSide,
      turntableRpm,
      setTurntableRpm,
      likedIds,
      isLiked,
      toggleLike,
      recentlyPlayed,
      loading,
      analyser: analyserRef.current,
      playTrack,
      togglePlay,
      seek,
      nextTrack,
      prevTrack,
      refreshTracks
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within a MusicProvider');
  return context;
};
