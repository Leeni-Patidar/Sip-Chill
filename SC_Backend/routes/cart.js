// const express = require('express');
// const { query, transaction } = require('../config/database');
// const { protect } = require('../middleware/auth');

// const router = express.Router();

// // @desc    Get cart items
// // @route   GET /api/cart
// // @access  Private
// router.get('/', protect, async (req, res) => {
//   try {
//     const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
//     if (!cart) {
//       return res.json({ success: true, data: [] });
//     }

//     const cartItems = await query(`
//       SELECT 
//         ci.id as cart_item_id,
//         ci.product_id,
//         p.name,
//         p.price,
//         p.discount_price,
//         p.featured_image,
//         ci.quantity,
//         (CASE 
//           WHEN p.discount_price IS NOT NULL 
//           THEN p.discount_price * ci.quantity
//           ELSE p.price * ci.quantity
//         END) as total_price
//       FROM cart_items ci
//       JOIN products p ON ci.product_id = p.id
//       WHERE ci.cart_id = ?
//     `, [cart.id]);

//     res.json({ success: true, data: cartItems });
//   } catch (error) {
//     console.error('Get cart items error:', error);
//     res.status(500).json({ success: false, message: 'Server error getting cart items' });
//   }
// });

// // @desc    Add to cart
// // @route   POST /api/cart
// // @access  Private (Changed route from /api/cart/add to /api/cart)
// router.post('/', protect, async (req, res) => {
//   try {
//     const { product_id, quantity } = req.body;

//     const [product] = await query(`SELECT stock_quantity FROM products WHERE id = ?`, [product_id]);
//     if (!product) {
//       return res.status(404).json({ success: false, message: 'Product not found' });
//     }
//     if (product.stock_quantity < quantity) {
//       return res.status(400).json({ success: false, message: 'Insufficient stock' });
//     }

//     let [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
//     if (!cart) {
//       const result = await query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
//       cart = { id: result.insertId };
//     }

//     const [existingItem] = await query(
//       'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
//       [cart.id, product_id]
//     );

//     if (existingItem) {
//       await query(
//         'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
//         [quantity, existingItem.id]
//       );
//     } else {
//       await query(
//         'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
//         [cart.id, product_id, quantity]
//       );
//     }

//     res.json({ success: true, message: 'Product added to cart successfully' });
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     res.status(500).json({ success: false, message: 'Server error adding product to cart' });
//   }
// });

// // @desc    Update cart item quantity
// // @route   PUT /api/cart/:id
// // @access  Private
// router.put('/:id', protect, async (req, res) => {
//   try {
//     const { quantity } = req.body;

//     const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'Cart not found' });
//     }

//     const [cartItem] = await query(
//       'SELECT product_id FROM cart_items WHERE id = ? AND cart_id = ?',
//       [req.params.id, cart.id]
//     );
//     if (!cartItem) {
//       return res.status(404).json({ success: false, message: 'Cart item not found' });
//     }

//     const [product] = await query(
//       'SELECT stock_quantity FROM products WHERE id = ?',
//       [cartItem.product_id]
//     );
//     if (product.stock_quantity < quantity) {
//       return res.status(400).json({ success: false, message: 'Insufficient stock' });
//     }

//     await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);

//     res.json({ success: true, message: 'Cart updated successfully' });
//   } catch (error) {
//     console.error('Update cart error:', error);
//     res.status(500).json({ success: false, message: 'Server error updating cart' });
//   }
// });

// // @desc    Delete cart item
// // @route   DELETE /api/cart/:id
// // @access  Private
// router.delete('/:id', protect, async (req, res) => {
//   try {
//     const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
//     if (!cart) {
//       return res.status(404).json({ success: false, message: 'Cart not found' });
//     }
//     await query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.id, cart.id]);
//     res.json({ success: true, message: 'Cart item removed successfully' });
//   } catch (error) {
//     console.error('Delete cart error:', error);
//     res.status(500).json({ success: false, message: 'Server error deleting cart item' });
//   }
// });

// // @desc    Get total cart value
// // @route   GET /api/cart/total/value
// // @access  Private
// router.get('/total/value', protect, async (req, res) => {
//   try {
//     const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
//     if (!cart) {
//       return res.json({ success: true, data: { total: 0 } });
//     }
//     const cartItems = await query(`
//       SELECT p.price, p.discount_price, ci.quantity
//       FROM cart_items ci
//       JOIN products p ON ci.product_id = p.id
//       WHERE ci.cart_id = ?
//     `, [cart.id]);

//     const totalValue = cartItems.reduce((sum, item) => {
//       const price = item.discount_price || item.price;
//       return sum + (price * item.quantity);
//     }, 0);

//     res.json({ success: true, data: { total: totalValue } });
//   } catch (error) {
//     console.error('Get total cart value error:', error);
//     res.status(500).json({ success: false, message: 'Server error getting total cart value' });
//   }
// });

// module.exports = router;


const express = require('express');
const { query } = require('../config/database');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ================== GET CART ==================
// Get all cart items for the logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart) {
      return res.json({ success: true, data: [] });
    }

    const cartItems = await query(`
      SELECT 
        ci.id AS cart_item_id,
        ci.product_id,
        p.name,
        p.price,
        p.image_url AS featured_image,
        ci.quantity,
        (p.price * ci.quantity) AS total_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart.id]);

    res.json({ success: true, data: cartItems });
  } catch (error) {
    console.error('Get cart items error:', error);
    res.status(500).json({ success: false, message: 'Server error getting cart items' });
  }
});

// ================== ADD TO CART ==================
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const [product] = await query('SELECT stock_quantity FROM products WHERE id = ?', [product_id]);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart) {
      const result = await query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
      cart = { id: result.insertId };
    }

    const [existingItem] = await query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
      [cart.id, product_id]
    );

    if (existingItem) {
      await query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existingItem.id]
      );
    } else {
      await query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',
        [cart.id, product_id, quantity]
      );
    }

    res.json({ success: true, message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, message: 'Server error adding product to cart' });
  }
});

// ================== UPDATE CART ITEM ==================
router.put('/:id', protect, async (req, res) => {
  try {
    const { quantity } = req.body;

    const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const [cartItem] = await query(
      'SELECT product_id FROM cart_items WHERE id = ? AND cart_id = ?',
      [req.params.id, cart.id]
    );
    if (!cartItem) return res.status(404).json({ success: false, message: 'Cart item not found' });

    const [product] = await query('SELECT stock_quantity FROM products WHERE id = ?', [cartItem.product_id]);
    if (product.stock_quantity < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    await query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);
    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Server error updating cart' });
  }
});

// ================== DELETE CART ITEM ==================
router.delete('/:id', protect, async (req, res) => {
  try {
    const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    await query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', [req.params.id, cart.id]);
    res.json({ success: true, message: 'Cart item removed successfully' });
  } catch (error) {
    console.error('Delete cart error:', error);
    res.status(500).json({ success: false, message: 'Server error deleting cart item' });
  }
});

// ================== GET TOTAL CART VALUE ==================
router.get('/total/value', protect, async (req, res) => {
  try {
    const [cart] = await query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
    if (!cart) return res.json({ success: true, data: { total: 0 } });

    const cartItems = await query(`
      SELECT p.price, ci.quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ?
    `, [cart.id]);

    const totalValue = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.json({ success: true, data: { total: totalValue } });
  } catch (error) {
    console.error('Get total cart value error:', error);
    res.status(500).json({ success: false, message: 'Server error getting total cart value' });
  }
});

module.exports = router;
