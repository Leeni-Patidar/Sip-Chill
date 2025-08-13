const express = require('express');
const { query, transaction } = require('../config/database');
const { protect } = require('../middleware/auth'); // ✅ only import the middleware function you need

const router = express.Router();

// @desc    Get cart items
// @route   GET /api/cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const cartItems = await query(`
      SELECT 
        c.id as cart_id,
        c.product_id,
        p.name,
        p.price,
        p.discount_price,
        p.featured_image,
        c.quantity,
        (CASE 
          WHEN p.discount_price IS NOT NULL 
          THEN p.discount_price * c.quantity
          ELSE p.price * c.quantity
        END) as total_price
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    res.json({ success: true, data: cartItems });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ success: false, message: 'Server error getting cart items' });
  }
});

// @desc    Add to cart
// @route   POST /api/cart
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Check if product exists and has enough stock
    const [product] = await query(`SELECT stock_quantity FROM products WHERE id = ?`, [product_id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Check if already in cart
    const [existingCart] = await query(
      `SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?`,
      [req.user.id, product_id]
    );

    if (existingCart) {
      await query(
        `UPDATE cart SET quantity = quantity + ? WHERE id = ?`,
        [quantity, existingCart.id]
      );
    } else {
      await query(
        `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`,
        [req.user.id, product_id, quantity]
      );
    }

    res.json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error adding product to cart' });
  }
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    // Check if cart item exists
    const [cartItem] = await query(
      `SELECT product_id FROM cart WHERE id = ? AND user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    // Check stock
    const [product] = await query(
      `SELECT stock_quantity FROM products WHERE id = ?`,
      [cartItem.product_id]
    );
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    await query(`UPDATE cart SET quantity = ? WHERE id = ?`, [quantity, req.params.id]);

    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error updating cart' });
  }
});

// @desc    Delete cart item
// @route   DELETE /api/cart/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    await query(`DELETE FROM cart WHERE id = ? AND user_id = ?`, [req.params.id, req.user.id]);
    res.json({ success: true, message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting cart item' });
  }
});

// @desc    Get total cart value
// @route   GET /api/cart/total/value
// @access  Private
router.get('/total/value', protect, async (req, res) => {
  try {
    const cartItems = await query(`
      SELECT p.price, p.discount_price, c.quantity
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [req.user.id]);

    const totalValue = cartItems.reduce((sum, item) => {
      const price = item.discount_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({ success: true, data: { total: totalValue } });
  } catch (error) {
    console.error('Get total cart value error:', error);
    res.status(500).json({ success: false, message: 'Server error getting total cart value' });
  }
});

module.exports = router;
