const mongoose = require('mongoose');
const { isMongoConnected, localDB } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  album: { type: String, default: 'Single' },
  duration: { type: Number, default: 180 }, // in seconds
  durationFormatted: { type: String, default: '3:00' },
  audioUrl: { type: String, required: true },
  coverUrl: { type: String, default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80' },
  genre: { type: String, default: 'Electronic' },
  vinylSide: { type: String, enum: ['A', 'B'], default: 'A' },
  trackNumber: { type: Number, default: 1 },
  source: { type: String, default: 'upload' }, // 'upload', 'apple', 'spotify', 'seed'
  externalId: { type: String, default: null },
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  description: { type: String, default: '' },
  releaseYear: { type: String, default: '2024' },
  colorPalette: {
    primary: { type: String, default: '#0ea5e9' },
    accent: { type: String, default: '#e11d48' }
  },
  createdAt: { type: Date, default: Date.now }
});

const MongoTrack = mongoose.model('Track', trackSchema);

// Unified Track Access Layer
const Track = {
  async find(filter = {}) {
    if (isMongoConnected()) {
      return await MongoTrack.find(filter).sort({ createdAt: -1 });
    }
    const db = localDB.read();
    let results = [...(db.tracks || [])];
    if (filter.vinylSide) {
      results = results.filter(t => t.vinylSide === filter.vinylSide);
    }
    if (filter.genre && filter.genre !== 'All') {
      results = results.filter(t => t.genre.toLowerCase() === filter.genre.toLowerCase());
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async findById(id) {
    if (isMongoConnected()) {
      return await MongoTrack.findById(id);
    }
    const db = localDB.read();
    return db.tracks.find(t => t._id === id || t.id === id) || null;
  },

  async create(trackData) {
    if (isMongoConnected()) {
      const doc = new MongoTrack(trackData);
      return await doc.save();
    }
    const db = localDB.read();
    const newTrack = {
      _id: uuidv4(),
      id: uuidv4(),
      ...trackData,
      plays: trackData.plays || 0,
      likes: trackData.likes || 0,
      createdAt: new Date().toISOString()
    };
    db.tracks.push(newTrack);
    localDB.write(db);
    return newTrack;
  },

  async findByIdAndUpdate(id, updates) {
    if (isMongoConnected()) {
      return await MongoTrack.findByIdAndUpdate(id, updates, { new: true });
    }
    const db = localDB.read();
    const idx = db.tracks.findIndex(t => t._id === id || t.id === id);
    if (idx === -1) return null;
    db.tracks[idx] = { ...db.tracks[idx], ...updates, updatedAt: new Date().toISOString() };
    localDB.write(db);
    return db.tracks[idx];
  },

  async findByIdAndDelete(id) {
    if (isMongoConnected()) {
      return await MongoTrack.findByIdAndDelete(id);
    }
    const db = localDB.read();
    const idx = db.tracks.findIndex(t => t._id === id || t.id === id);
    if (idx === -1) return null;
    const removed = db.tracks.splice(idx, 1)[0];
    localDB.write(db);
    return removed;
  },

  async countDocuments() {
    if (isMongoConnected()) {
      return await MongoTrack.countDocuments();
    }
    const db = localDB.read();
    return (db.tracks || []).length;
  }
};

module.exports = Track;
