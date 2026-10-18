const express = require('express');
const router = express.Router();
const { searchAppleMusic, searchSpotifyMusic } = require('../controllers/externalApiController');

// Public search endpoints
router.get('/apple/search', searchAppleMusic);
router.get('/spotify/search', searchSpotifyMusic);

module.exports = router;
