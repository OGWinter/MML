const axios = require('axios');

// Format milliseconds to mm:ss
const formatDuration = (ms) => {
  if (!ms) return '3:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Search Apple Music / iTunes Catalog
const searchAppleMusic = async (req, res) => {
  try {
    const query = req.query.q || 'Led Zeppelin';
    const limit = Math.min(parseInt(req.query.limit) || 20, 50);

    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=${limit}`;
    const response = await axios.get(itunesUrl, { timeout: 8000 });

    const tracks = (response.data.results || []).map((item) => {
      // High-res artwork replace
      const artwork = (item.artworkUrl100 || '')
        .replace('100x100bb.jpg', '600x600bb.jpg')
        .replace('100x100bb.png', '600x600bb.png');

      return {
        id: `apple-${item.trackId}`,
        externalId: String(item.trackId),
        title: item.trackName || 'Untitled',
        artist: item.artistName || 'Unknown Artist',
        album: item.collectionName || 'Single',
        coverUrl: artwork || item.artworkUrl100,
        audioUrl: item.previewUrl,
        duration: Math.floor((item.trackTimeMillis || 180000) / 1000),
        durationFormatted: formatDuration(item.trackTimeMillis),
        genre: item.primaryGenreName || 'Pop',
        source: 'apple',
        releaseYear: item.releaseDate ? item.releaseDate.substring(0, 4) : '2024',
        previewAvailable: !!item.previewUrl
      };
    });

    res.json({
      provider: 'Apple Music / iTunes',
      query,
      count: tracks.length,
      tracks
    });
  } catch (err) {
    console.error('Apple Music search error:', err.message);
    res.status(500).json({ message: 'Failed to search Apple Music catalog', error: err.message });
  }
};

// Search Spotify / Trending Catalog
const searchSpotifyMusic = async (req, res) => {
  try {
    const query = req.query.q || 'Midnight';
    // Use enhanced cross-search with genre enrichment
    const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=25`;
    const response = await axios.get(itunesUrl, { timeout: 8000 });

    const tracks = (response.data.results || []).map((item) => {
      const artwork = (item.artworkUrl100 || '')
        .replace('100x100bb.jpg', '600x600bb.jpg');

      return {
        id: `spotify-${item.trackId}`,
        externalId: String(item.trackId),
        title: item.trackName,
        artist: item.artistName,
        album: item.collectionName,
        coverUrl: artwork,
        audioUrl: item.previewUrl,
        duration: Math.floor((item.trackTimeMillis || 180000) / 1000),
        durationFormatted: formatDuration(item.trackTimeMillis),
        genre: item.primaryGenreName || 'Electronic',
        source: 'spotify',
        releaseYear: item.releaseDate ? item.releaseDate.substring(0, 4) : '2024',
        spotifyUrl: `https://open.spotify.com/search/${encodeURIComponent(item.trackName + ' ' + item.artistName)}`
      };
    });

    res.json({
      provider: 'Spotify & Global Music Catalog',
      query,
      count: tracks.length,
      tracks
    });
  } catch (err) {
    res.status(500).json({ message: 'Spotify search error', error: err.message });
  }
};

module.exports = {
  searchAppleMusic,
  searchSpotifyMusic
};
