
const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active = 'true' } = req.query;
    let whereClause = active === 'true' ? 'WHERE is_active = TRUE' : '';

    const categories = await query(`
      SELECT 
        id,
        name,
        description,
        image_url,
        created_at,
        (SELECT COUNT(*) FROM products WHERE category_id = categories.id AND is_available = TRUE) AS product_count
      FROM categories
      ${whereClause}
      ORDER BY name ASC
    `);

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Server error getting categories' });
  }
});

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const categories = await query(`
      SELECT id, name, description, image_url, created_at
      FROM categories
      WHERE name = ? AND is_active = TRUE
    `, [categoryName]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const category = categories[0];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await query(`
      SELECT id, name, description, price, image_url, is_featured, stock_quantity, created_at
      FROM products
      WHERE category_id = ? AND is_available = TRUE
      ORDER BY is_featured DESC, name ASC
      LIMIT ? OFFSET ?
    `, [category.id, parseInt(limit), offset]);

    const [{ total }] = await query(`
      SELECT COUNT(*) as total
      FROM products
      WHERE category_id = ? AND is_available = TRUE
    `, [category.id]);

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get category by slug error:', error);
    res.status(500).json({ success: false, message: 'Server error getting category by slug' });
  }
});

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const categories = await query(`
      SELECT id, name, description, image_url, created_at
      FROM categories
      WHERE id = ? AND is_active = TRUE
    `, [id]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const category = categories[0];
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await query(`
      SELECT id, name, description, price, image_url, is_featured, stock_quantity, created_at
      FROM products
      WHERE category_id = ? AND is_available = TRUE
      ORDER BY is_featured DESC, name ASC
      LIMIT ? OFFSET ?
    `, [id, parseInt(limit), offset]);

    const [{ total }] = await query(`
      SELECT COUNT(*) as total
      FROM products
      WHERE category_id = ? AND is_available = TRUE
    `, [id]);

    res.json({
      success: true,
      data: {
        category,
        products,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: 'Server error getting category' });
  }
});

module.exports = router;
