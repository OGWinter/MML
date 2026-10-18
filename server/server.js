require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const { ensureAdminAccount } = require('./controllers/authController');
const { seedInitialTracks } = require('./controllers/trackController');

const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const externalRoutes = require('./routes/externalRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded audio & artwork
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tracks', trackRoutes);
app.use('/api/external', externalRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Radiant Vinyl & Digital Music Server',
    version: '1.0.0'
  });
});

// Start Server & Initialize
const startServer = async () => {
  try {
    await connectDB();
    await ensureAdminAccount();
    await seedInitialTracks();

    app.listen(PORT, () => {
      console.log(`🚀 Radiant Music Server running on http://localhost:${PORT}`);
      console.log(`🎵 API endpoints: /api/tracks, /api/auth, /api/external`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
