const express = require('express');
const { getProducts, getProduct, createProduct } = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const { validateProduct, validateMongoId } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', validateMongoId(), getProduct);

// Protected routes
router.post('/', protect, authorize('admin'), validateProduct, createProduct);
// Add more routes for update, delete, reviews, etc.

module.exports = router;