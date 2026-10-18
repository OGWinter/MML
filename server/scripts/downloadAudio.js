const axios = require('axios');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Search iTunes for live working preview and download
const downloadSongPreview = async (query, filename) => {
  const filePath = path.join(uploadsDir, filename);
  try {
    const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=1`;
    const res = await axios.get(searchUrl, { timeout: 8000 });
    if (!res.data.results || res.data.results.length === 0) {
      console.warn(`No iTunes results for: ${query}`);
      return null;
    }
    const track = res.data.results[0];
    const previewUrl = track.previewUrl;
    if (!previewUrl) {
      console.warn(`No preview URL for: ${query}`);
      return null;
    }

    console.log(`Downloading audio preview for "${query}" from ${previewUrl}...`);
    const audioRes = await axios.get(previewUrl, { responseType: 'stream', timeout: 15000 });
    const writer = fs.createWriteStream(filePath);
    audioRes.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    console.log(`✓ Saved ${filename} (${fs.statSync(filePath).size} bytes)`);
    return {
      filename,
      trackName: track.trackName,
      artistName: track.artistName,
      albumName: track.collectionName,
      artwork: track.artworkUrl100.replace('100x100bb.jpg', '600x600bb.jpg'),
      previewUrl
    };
  } catch (err) {
    console.error(`Failed downloading "${query}":`, err.message);
    return null;
  }
};

const run = async () => {
  console.log('Downloading high-quality seed audio files...');
  await downloadSongPreview('Led Zeppelin Good Times Bad Times', 'good_times_bad_times.m4a');
  await downloadSongPreview('Led Zeppelin Dazed and Confused', 'dazed_and_confused.m4a');
  await downloadSongPreview('Led Zeppelin Black Dog', 'black_dog.m4a');
  await downloadSongPreview('Aiden Vale Perfect', 'perfect.m4a');
  await downloadSongPreview('ZAYN Dusk Till Dawn', 'dusk_till_dawn.m4a');
  await downloadSongPreview('M83 Midnight City', 'midnight_city.m4a');
  console.log('Finished downloading audio assets!');
};

run();
