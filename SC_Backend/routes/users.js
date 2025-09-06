const express = require('express');
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// helper for safe pagination
function getPagination(page, limit, defaultLimit = 10) {
  const pageNum = Number.isInteger(Number(page)) && Number(page) > 0 ? Number(page) : 1;
  const limitNum = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : defaultLimit;
  const offset = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, offset };
}

// @desc    Get user profile
router.get('/profile', async (req, res) => {
  try {
    const users = await query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        phone,
        address,
        role,
        created_at
      FROM users
      WHERE id = ?
    `, [req.user.id]);

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user profile' });
  }
});

// @desc    Get user order history
router.get('/orders', async (req, res) => {
  try {
    const { page, limit, status } = req.query;
    const { pageNum, limitNum, offset } = getPagination(page, limit, 10);

    let conditions = ['o.user_id = ?'];
    let params = [req.user.id];

    if (status) {
      conditions.push('o.status = ?');
      params.push(status);
    }

    const whereClause = `WHERE ${conditions.join(' AND ')}`;

    const orders = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.status,
        o.payment_status,
        o.payment_method,
        o.delivery_address,
        o.contact_phone,
        o.created_at,
        o.estimated_delivery_time,
        o.actual_delivery_time
      FROM orders o
      ${whereClause}
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limitNum, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `, params);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user orders' });
  }
});

// @desc    Get user order details
router.get('/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await query(`
      SELECT 
        o.id,
        o.order_number,
        o.total_amount,
        o.tax_amount,
        o.delivery_fee,
        o.status,
        o.payment_status,
        o.payment_method,
        o.delivery_address,
        o.contact_phone,
        o.special_instructions,
        o.created_at,
        o.estimated_delivery_time,
        o.actual_delivery_time
      FROM orders o
      WHERE o.id = ? AND o.user_id = ?
    `, [id, req.user.id]);

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const order = orders[0];

    const orderItems = await query(`
      SELECT 
        id,
        product_id,
        product_name,
        product_price,
        quantity,
        special_instructions
      FROM order_items
      WHERE order_id = ?
    `, [id]);

    res.json({ success: true, data: { ...order, items: orderItems } });
  } catch (error) {
    console.error('Get user order error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user order' });
  }
});

// @desc    Get user favorites
router.get('/favorites', async (req, res) => {
  try {
    res.json({ success: true, data: { favorites: [] } });
  } catch (error) {
    console.error('Get user favorites error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user favorites' });
  }
});

// @desc    Get user reviews
router.get('/reviews', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const { pageNum, limitNum, offset } = getPagination(page, limit, 10);

    const reviews = await query(`
      SELECT 
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        p.id as product_id,
        p.name as product_name,
        p.image_url as product_image
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, limitNum, offset]);

    const countResult = await query(`
      SELECT COUNT(*) as total
      FROM reviews
      WHERE user_id = ?
    `, [req.user.id]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current_page: pageNum,
          total_pages: totalPages,
          total_items: total,
          items_per_page: limitNum
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user reviews' });
  }
});

// @desc    Add product review
router.post('/reviews', async (req, res) => {
  try {
    const { product_id, order_id, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (order_id) {
      const orderItems = await query(`
        SELECT oi.id
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.id
        WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ?
      `, [order_id, req.user.id, product_id]);

      if (orderItems.length === 0) {
        return res.status(400).json({ success: false, message: 'You can only review products you have ordered' });
      }
    }

    const existingReviews = await query(`
      SELECT id FROM reviews WHERE user_id = ? AND product_id = ?
    `, [req.user.id, product_id]);

    if (existingReviews.length > 0) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    await query(`
      INSERT INTO reviews (user_id, product_id, order_id, rating, comment, is_verified)
      VALUES (?, ?, ?, ?, ?, TRUE)
    `, [req.user.id, product_id, order_id, rating, comment]);

    res.status(201).json({ success: true, message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ success: false, message: 'Server error adding review' });
  }
});

// @desc    Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const totalOrders = await query(`
      SELECT COUNT(*) as count FROM orders WHERE user_id = ?
    `, [req.user.id]);

    const totalSpent = await query(`
      SELECT SUM(total_amount) as total
      FROM orders
      WHERE user_id = ? AND payment_status = 'paid'
    `, [req.user.id]);

    const favoriteCategory = await query(`
      SELECT 
        c.name as category_name,
        COUNT(oi.id) as order_count
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY c.id
      ORDER BY order_count DESC
      LIMIT 1
    `, [req.user.id]);

    const recentActivity = await query(`
      SELECT 
        'order' as type,
        o.order_number as reference,
        o.created_at as date,
        o.total_amount as amount
      FROM orders o
      WHERE o.user_id = ?
      UNION ALL
      SELECT 
        'review' as type,
        p.name as reference,
        r.created_at as date,
        r.rating as amount
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      WHERE r.user_id = ?
      ORDER BY date DESC
      LIMIT 10
    `, [req.user.id, req.user.id]);

    res.json({
      success: true,
      data: {
        total_orders: totalOrders[0]?.count || 0,
        total_spent: totalSpent[0]?.total || 0,
        favorite_category: favoriteCategory[0]?.category_name || 'None',
        recent_activity: recentActivity
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ success: false, message: 'Server error getting user statistics' });
  }
});

module.exports = router;
