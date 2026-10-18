const Track = require('../models/Track');
const path = require('path');
const fs = require('fs');

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

// Seed initial tracks if library is empty
const seedInitialTracks = async () => {
  const count = await Track.countDocuments();
  if (count > 0) return;

  console.log('🎵 Seeding initial Vinyl & Radiant tracks...');
  const initialTracks = [
    {
      title: 'Good Times Bad Times',
      artist: 'Led Zeppelin',
      album: 'Mothership',
      duration: 166,
      durationFormatted: '2:46',
      audioUrl: 'http://localhost:5050/uploads/good_times_bad_times.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      genre: 'Classic Rock',
      vinylSide: 'A',
      trackNumber: 1,
      source: 'seed',
      releaseYear: '1969',
      plays: 1420,
      likes: 312,
      description: 'Iconic opening track from Mothership remaster, featuring dynamic John Bonham triplet kick drum grooves.',
      colorPalette: { primary: '#0ea5e9', accent: '#e11d48' }
    },
    {
      title: 'Dazed & Confused',
      artist: 'Led Zeppelin',
      album: 'Mothership',
      duration: 388,
      durationFormatted: '6:28',
      audioUrl: 'http://localhost:5050/uploads/dazed_and_confused.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80',
      genre: 'Hard Rock',
      vinylSide: 'A',
      trackNumber: 2,
      source: 'seed',
      releaseYear: '1969',
      plays: 2890,
      likes: 540,
      description: 'Hypnotic bassline and bowed guitar effects capturing the true analog vinyl spirit.',
      colorPalette: { primary: '#2563eb', accent: '#e11d48' }
    },
    {
      title: 'Black Dog',
      artist: 'Led Zeppelin',
      album: 'Mothership',
      duration: 296,
      durationFormatted: '4:56',
      audioUrl: 'http://localhost:5050/uploads/black_dog.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80',
      genre: 'Rock',
      vinylSide: 'A',
      trackNumber: 3,
      source: 'seed',
      releaseYear: '1971',
      plays: 980,
      likes: 215,
      description: 'A capella call-and-response hooks in complex 5/4 and 4/4 syncopated time signatures.',
      colorPalette: { primary: '#38bdf8', accent: '#fb7185' }
    },
    {
      title: 'Perfect',
      artist: 'Aiden Vale',
      album: 'Midnight Horizons',
      duration: 252,
      durationFormatted: '4:12',
      audioUrl: 'http://localhost:5050/uploads/perfect.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      genre: 'Indie Pop',
      vinylSide: 'B',
      trackNumber: 1,
      source: 'seed',
      releaseYear: '2023',
      plays: 4800,
      likes: 910,
      description: 'Chill romantic sunset melody with dreamy synthesizers and lush vocal harmonics.',
      colorPalette: { primary: '#0ea5e9', accent: '#e11d48' }
    },
    {
      title: 'Dusk Till Dawn',
      artist: 'ZAYN & Sia',
      album: 'Midnight Collection',
      duration: 239,
      durationFormatted: '3:59',
      audioUrl: 'http://localhost:5050/uploads/dusk_till_dawn.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      genre: 'Pop / Synth',
      vinylSide: 'B',
      trackNumber: 2,
      source: 'seed',
      releaseYear: '2022',
      plays: 3450,
      likes: 820,
      description: 'High-octane pop ballad with resonant sky blue synths and rich crimson bass drops.',
      colorPalette: { primary: '#0284c7', accent: '#be123c' }
    },
    {
      title: 'Midnight City',
      artist: 'M83',
      album: 'Hurry Up, We\'re Dreaming',
      duration: 243,
      durationFormatted: '4:03',
      audioUrl: 'http://localhost:5050/uploads/midnight_city.m4a',
      coverUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
      genre: 'Synthwave',
      vinylSide: 'B',
      trackNumber: 3,
      source: 'seed',
      releaseYear: '2021',
      plays: 5210,
      likes: 1240,
      description: 'The definitive midnight driving anthem, pulsating electronic arpeggios and iconic saxophone solo.',
      colorPalette: { primary: '#38bdf8', accent: '#e11d48' }
    }
  ];

  for (const track of initialTracks) {
    await Track.create(track);
  }
  console.log(`✨ Successfully seeded ${initialTracks.length} high-fidelity vinyl tracks.`);
};

// Audio Proxy for external Apple Music & Spotify preview streams
const axios = require('axios');
const streamProxy = async (req, res) => {
  try {
    const audioUrl = req.query.url;
    if (!audioUrl) return res.status(400).send('Missing url query parameter');

    const response = await axios({
      method: 'get',
      url: audioUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    res.set({
      'Content-Type': response.headers['content-type'] || 'audio/mp4',
      'Content-Length': response.headers['content-length'],
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*'
    });

    response.data.pipe(res);
  } catch (err) {
    console.warn('Stream proxy error:', err.message);
    res.status(500).send('Audio proxy error: ' + err.message);
  }
};

// GET /api/tracks
const getAllTracks = async (req, res) => {
  try {
    const { genre, vinylSide, search } = req.query;
    let tracks = await Track.find();

    if (vinylSide) {
      tracks = tracks.filter(t => t.vinylSide === vinylSide.toUpperCase());
    }
    if (genre && genre !== 'All') {
      tracks = tracks.filter(t => t.genre.toLowerCase() === genre.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      tracks = tracks.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.artist.toLowerCase().includes(q) ||
        (t.album && t.album.toLowerCase().includes(q))
      );
    }

    res.json({ count: tracks.length, tracks });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tracks', error: err.message });
  }
};

// GET /api/tracks/:id
const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: 'Track not found' });
    }
    res.json(track);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving track', error: err.message });
  }
};

// POST /api/tracks/play/:id
const incrementPlayCount = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    const updated = await Track.findByIdAndUpdate(req.params.id, { plays: (track.plays || 0) + 1 });
    res.json({ message: 'Play recorded', plays: updated.plays });
  } catch (err) {
    res.status(500).json({ message: 'Failed to record play' });
  }
};

// POST /api/tracks/like/:id
const toggleLike = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) return res.status(404).json({ message: 'Track not found' });
    const increment = req.body.liked ? 1 : -1;
    const newLikes = Math.max(0, (track.likes || 0) + increment);
    const updated = await Track.findByIdAndUpdate(req.params.id, { likes: newLikes });
    res.json({ message: 'Like updated', likes: updated.likes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update like' });
  }
};

// POST /api/tracks (Admin only - Multer or JSON upload)
const createTrack = async (req, res) => {
  try {
    let audioUrl = req.body.audioUrl;
    let coverUrl = req.body.coverUrl;

    // Handle Multer uploaded files
    if (req.files) {
      const host = req.get('host');
      const protocol = req.protocol;
      if (req.files.audio && req.files.audio[0]) {
        audioUrl = `${protocol}://${host}/uploads/${req.files.audio[0].filename}`;
      }
      if (req.files.cover && req.files.cover[0]) {
        coverUrl = `${protocol}://${host}/uploads/${req.files.cover[0].filename}`;
      }
    }

    if (!audioUrl) {
      return res.status(400).json({ message: 'Audio file or audio URL is required.' });
    }

    const duration = parseInt(req.body.duration) || 180;
    const durationFormatted = req.body.durationFormatted || formatDuration(duration);

    const newTrack = await Track.create({
      title: req.body.title || 'Untitled Track',
      artist: req.body.artist || 'Unknown Artist',
      album: req.body.album || 'Radiant Singles',
      genre: req.body.genre || 'Electronic',
      vinylSide: (req.body.vinylSide || 'A').toUpperCase(),
      trackNumber: parseInt(req.body.trackNumber) || 1,
      duration,
      durationFormatted,
      audioUrl,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
      description: req.body.description || 'Custom uploaded vinyl track',
      releaseYear: req.body.releaseYear || new Date().getFullYear().toString(),
      source: 'upload',
      colorPalette: {
        primary: req.body.primaryColor || '#0ea5e9',
        accent: req.body.accentColor || '#e11d48'
      }
    });

    res.status(201).json({
      message: 'Track successfully added by administrator!',
      track: newTrack
    });
  } catch (err) {
    console.error('Create track error:', err);
    res.status(500).json({ message: 'Failed to create track', error: err.message });
  }
};

// POST /api/tracks/import (Admin only - Import from Apple Music or Spotify)
const importExternalTrack = async (req, res) => {
  try {
    const { title, artist, album, audioUrl, coverUrl, genre, duration, releaseYear, source, externalId, vinylSide } = req.body;

    if (!audioUrl || !title || !artist) {
      return res.status(400).json({ message: 'Missing essential track metadata for import.' });
    }

    const dur = parseInt(duration) || 180;
    const newTrack = await Track.create({
      title,
      artist,
      album: album || 'Imported Album',
      duration: dur,
      durationFormatted: formatDuration(dur),
      audioUrl,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80',
      genre: genre || 'Pop',
      vinylSide: (vinylSide || 'A').toUpperCase(),
      source: source || 'apple',
      externalId: externalId || null,
      releaseYear: releaseYear || '2024',
      description: `Imported from ${source === 'spotify' ? 'Spotify Catalog' : 'Apple Music'} by Administrator`,
      colorPalette: {
        primary: '#38bdf8',
        accent: '#e11d48'
      }
    });

    res.status(201).json({
      message: `Successfully imported "${title}" into Radiant vinyl library!`,
      track: newTrack
    });
  } catch (err) {
    res.status(500).json({ message: 'Import failed', error: err.message });
  }
};

// PUT /api/tracks/:id (Admin only)
const updateTrack = async (req, res) => {
  try {
    const updated = await Track.findByIdAndUpdate(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Track not found' });
    res.json({ message: 'Track updated successfully', track: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update track', error: err.message });
  }
};

// DELETE /api/tracks/:id (Admin only)
const deleteTrack = async (req, res) => {
  try {
    const deleted = await Track.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Track not found' });
    res.json({ message: 'Track removed from library', track: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete track', error: err.message });
  }
};

// GET /api/stats
const getLibraryStats = async (req, res) => {
  try {
    const tracks = await Track.find();
    const sideA = tracks.filter(t => t.vinylSide === 'A').length;
    const sideB = tracks.filter(t => t.vinylSide === 'B').length;
    const totalPlays = tracks.reduce((acc, t) => acc + (t.plays || 0), 0);
    const totalLikes = tracks.reduce((acc, t) => acc + (t.likes || 0), 0);
    
    // Genre count breakdown
    const genreMap = {};
    tracks.forEach(t => {
      const g = t.genre || 'Other';
      genreMap[g] = (genreMap[g] || 0) + 1;
    });

    res.json({
      totalTracks: tracks.length,
      sideA,
      sideB,
      totalPlays,
      totalLikes,
      genres: genreMap
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate stats' });
  }
};

module.exports = {
  getAllTracks,
  getTrackById,
  incrementPlayCount,
  toggleLike,
  createTrack,
  importExternalTrack,
  updateTrack,
  deleteTrack,
  getLibraryStats,
  seedInitialTracks,
  streamProxy
};
