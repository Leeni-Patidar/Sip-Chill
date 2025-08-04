const express = require('express');
const { validateContact } = require('../middleware/validation');

const router = express.Router();

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
router.post('/', validateContact, (req, res) => {
  // Placeholder for contact form submission
  res.status(200).json({
    success: true,
    message: 'Contact message sent successfully'
  });
});

module.exports = router;