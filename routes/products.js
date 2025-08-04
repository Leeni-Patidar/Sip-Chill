const express = require('express');
const { query } = require('../config/database');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all products with optional filtering
// @route   GET /api/products
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      available,
      sort = 'name',
      order = 'ASC',
      page = 1,
      limit = 20
    } = req.query;

    let conditions = ['p.is_available = TRUE'];
    let params = [];

    // Category filter
    if (category) {
      conditions.push('p.category_id = ?');
      params.push(category);
    }

    // Search filter
    if (search) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    // Price filters
    if (minPrice) {
      conditions.push('p.price >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push('p.price <= ?');
      params.push(parseFloat(maxPrice));
    }

    // Featured filter
    if (featured === 'true') {
      conditions.push('p.is_featured = TRUE');
    }

    // Available filter
    if (available === 'true') {
      conditions.push('p.stock_quantity > 0');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort field
    const allowedSortFields = ['name', 'price', 'created_at'];
    const sortField = allowedSortFields.includes(sort) ? sort : 'name';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitClause = `LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    // Get products with category info
    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_featured,
        p.stock_quantity,
        p.allergens,
        p.nutritional_info,
        p.created_at,
        c.id as category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sortField} ${sortOrder}
      ${limitClause}
    `, params);

    // Get total count for pagination
    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `, params);

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting products' 
    });
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_featured = TRUE AND p.is_available = TRUE
      ORDER BY p.created_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting featured products' 
    });
  }
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_featured,
        p.stock_quantity,
        p.allergens,
        p.nutritional_info,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_available = TRUE
    `, [id]);

    if (products.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    const product = products[0];

    // Get related products from same category
    const relatedProducts = await query(`
      SELECT 
        id,
        name,
        price,
        image_url
      FROM products
      WHERE category_id = ? AND id != ? AND is_available = TRUE
      ORDER BY is_featured DESC, created_at DESC
      LIMIT 4
    `, [product.category_id, id]);

    // Get reviews for this product
    const reviews = await query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.first_name,
        u.last_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_verified = TRUE
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [id]);

    // Calculate average rating
    const avgRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json({
      success: true,
      data: {
        ...product,
        related_products: relatedProducts,
        reviews,
        average_rating: Math.round(avgRating * 10) / 10,
        review_count: reviews.length
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error getting product' 
    });
  }
});

// @desc    Search products
// @route   GET /api/products/search/:query
// @access  Public
router.get('/search/:query', async (req, res) => {
  try {
    const { query: searchQuery } = req.params;
    const { limit = 10 } = req.query;

    const products = await query(`
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_featured,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE (p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)
        AND p.is_available = TRUE
      ORDER BY p.is_featured DESC, p.name ASC
      LIMIT ?
    `, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, parseInt(limit)]);

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error searching products' 
    });
  }
});

module.exports = router;