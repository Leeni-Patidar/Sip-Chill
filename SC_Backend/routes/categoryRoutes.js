const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes - implement controllers
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get categories endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ success: true, message: 'Get single category endpoint' });
});

router.post('/', protect, authorize('admin'), (req, res) => {
  res.json({ success: true, message: 'Create category endpoint' });
});

module.exports = router;