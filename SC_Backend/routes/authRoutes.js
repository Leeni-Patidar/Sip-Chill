const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyToken,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} = require('../controllers/authController');

const { protect, rateLimitSensitive } = require('../middleware/auth');
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateMongoId
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', rateLimitSensitive(), validateRegister, register);
router.post('/login', rateLimitSensitive(), validateLogin, login);
router.post('/forgot-password', rateLimitSensitive(), forgotPassword);
router.post('/reset-password/:resettoken', rateLimitSensitive(), resetPassword);

// Protected routes
router.use(protect); // All routes after this are protected

router.post('/logout', logout);
router.get('/me', getMe);
router.get('/verify', verifyToken);
router.put('/profile', validateUpdateProfile, updateProfile);
router.put('/password', updatePassword);

// Wishlist routes
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', validateMongoId('productId'), addToWishlist);
router.delete('/wishlist/:productId', validateMongoId('productId'), removeFromWishlist);

module.exports = router;