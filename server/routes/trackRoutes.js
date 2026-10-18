const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { requireAdmin } = require('../middleware/auth');
const {
  getAllTracks,
  getTrackById,
  incrementPlayCount,
  toggleLike,
  createTrack,
  importExternalTrack,
  updateTrack,
  deleteTrack,
  getLibraryStats,
  streamProxy
} = require('../controllers/trackController');

// Public routes for all users
router.get('/', getAllTracks);
router.get('/stats', getLibraryStats);
router.get('/stream/proxy', streamProxy);
router.get('/:id', getTrackById);
router.post('/play/:id', incrementPlayCount);
router.post('/like/:id', toggleLike);

// Admin restricted routes
router.post('/', requireAdmin, upload.fields([
  { name: 'audio', maxCount: 1 },
  { name: 'cover', maxCount: 1 }
]), createTrack);

router.post('/import', requireAdmin, importExternalTrack);
router.put('/:id', requireAdmin, updateTrack);
router.delete('/:id', requireAdmin, deleteTrack);

module.exports = router;
