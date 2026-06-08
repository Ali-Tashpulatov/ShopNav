const express = require('express');
const router = express.Router();
const dbModule = require('../db/database');

// GET /api/likes
router.get('/', (req, res) => {
  try {
    const likes = dbModule.getAllProductLikes();
    res.json({ success: true, likes });
  } catch (err) {
    console.error('[Likes API] get all likes error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch likes' });
  }
});

// POST /api/likes/:id/increment
router.post('/:id/increment', (req, res) => {
  try {
    const { id } = req.params;
    const newCount = dbModule.incrementProductLike(id);
    res.json({ success: true, likesCount: newCount });
  } catch (err) {
    console.error(`[Likes API] increment error for ${req.params.id}:`, err);
    res.status(500).json({ success: false, error: 'Failed to increment like' });
  }
});

// POST /api/likes/:id/decrement
router.post('/:id/decrement', (req, res) => {
  try {
    const { id } = req.params;
    const newCount = dbModule.decrementProductLike(id);
    res.json({ success: true, likesCount: newCount });
  } catch (err) {
    console.error(`[Likes API] decrement error for ${req.params.id}:`, err);
    res.status(500).json({ success: false, error: 'Failed to decrement like' });
  }
});

module.exports = router;
