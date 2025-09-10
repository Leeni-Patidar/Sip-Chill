const express = require("express");
const router = express.Router();
const { query } = require("../config/database");
const { optionalAuth, protect, authorize } = require("../middleware/auth");

// ==========================
// Helper: Safe JSON parse
// ==========================
const safeJSONParse = (value) => {
  if (!value) return [];
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (typeof value === "object") return value;
  return [];
};

// ==========================
// Create Product
// ==========================
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      image_url,
      category_id,
      is_featured,
      stock_quantity,
      allergens,
      reviews,
    } = req.body;

    if (!name || !price || !category_id) {
      return res
        .status(400)
        .json({ success: false, message: "Name, price, and category are required." });
    }

    is_featured = is_featured ? 1 : 0;
    const is_available = 1;
    allergens = allergens || null;

    // Ensure reviews is valid JSON string
    reviews = reviews ? JSON.stringify(reviews) : "[]";

    const result = await query(
      `INSERT INTO products 
        (name, description, price, image_url, category_id, is_featured, stock_quantity, allergens, reviews, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description,
        price,
        image_url,
        category_id,
        is_featured,
        stock_quantity || 0,
        allergens,
        reviews,
        is_available,
      ]
    );

    res.status(201).json({ success: true, productId: result.insertId });
  } catch (error) {
    console.error("❌ Create product error:", error.sqlMessage || error.message);
    res.status(500).json({ success: false, message: "Server error creating product" });
  }
});

// ==========================
// Update Product
// ==========================
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    let {
      name,
      description,
      price,
      image_url,
      category_id,
      is_featured,
      stock_quantity,
      allergens,
      reviews,
      is_available,
    } = req.body;
    const { id } = req.params;

    is_featured = is_featured ? 1 : 0;
    is_available = is_available ? 1 : 0;
    allergens = allergens || null;

    reviews = reviews ? JSON.stringify(reviews) : "[]";

    const result = await query(
      `UPDATE products 
       SET name=?, description=?, price=?, image_url=?, category_id=?, is_featured=?, stock_quantity=?, allergens=?, reviews=?, is_available=? 
       WHERE id=?`,
      [
        name,
        description,
        price,
        image_url,
        category_id,
        is_featured,
        stock_quantity || 0,
        allergens,
        reviews,
        is_available,
        id,
      ]
    );

    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error("❌ Update product error:", error.sqlMessage || error.message);
    res.status(500).json({ success: false, message: "Server error updating product" });
  }
});

// ==========================
// Delete Product
// ==========================
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`DELETE FROM products WHERE id=?`, [id]);
    res.json({ success: true, affectedRows: result.affectedRows });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ==========================
// Get All Products
// ==========================
router.get("/", optionalAuth, async (req, res) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      featured,
      available,
      sort = "name",
      order = "ASC",
      page = 1,
      limit = 1000,
    } = req.query;

    let conditions = ["p.is_available = TRUE"];
    let params = [];

    if (category) {
      conditions.push("p.category_id = ?");
      params.push(category);
    }

    if (search) {
      conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
      params.push(`%${search}%`, `%${search}%`);
    }

    if (minPrice) {
      conditions.push("p.price >= ?");
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      conditions.push("p.price <= ?");
      params.push(parseFloat(maxPrice));
    }

    if (featured === "true") {
      conditions.push("p.is_featured = TRUE");
    }

    if (available === "true") {
      conditions.push("p.stock_quantity > 0");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const allowedSortFields = ["name", "price", "created_at"];
    const sortField = allowedSortFields.includes(sort) ? sort : "name";
    const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const limitClause = `LIMIT ${parseInt(limit)} OFFSET ${offset}`;

    const products = await query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_featured,
        p.stock_quantity,
        p.allergens,
        p.reviews,
        p.created_at,
        c.id as category_id,
        c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.${sortField} ${sortOrder}
      ${limitClause}
    `,
      params
    );

    const parsedProducts = products.map((p) => ({
      ...p,
      reviews: safeJSONParse(p.reviews),
    }));

    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `,
      params
    );

    const total = countResult[0].total;
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        products: parsedProducts,
        pagination: {
          current_page: parseInt(page),
          total_pages: totalPages,
          total_items: total,
          items_per_page: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting products",
    });
  }
});

// ==========================
// Get Featured Products
// ==========================
router.get("/featured", async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const products = await query(
      `
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
    `,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      data: products.map(p => ({ ...p, reviews: [] })),
    });
  } catch (error) {
    console.error("Get featured products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting featured products",
    });
  }
});

// ==========================
// Get Single Product
// ==========================
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const products = await query(
      `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.is_featured,
        p.stock_quantity,
        p.allergens,
        p.reviews,
        p.created_at,
        c.id as category_id,
        c.name as category_name,
        c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ? AND p.is_available = TRUE
    `,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const product = products[0];
    product.reviews = safeJSONParse(product.reviews);

    const relatedProducts = await query(
      `
      SELECT 
        id,
        name,
        price,
        image_url
      FROM products
      WHERE category_id = ? AND id != ? AND is_available = TRUE
      ORDER BY is_featured DESC, created_at DESC
      LIMIT 4
    `,
      [product.category_id, id]
    );

    res.json({
      success: true,
      data: {
        ...product,
        related_products: relatedProducts,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Server error getting product",
    });
  }
});

// ==========================
// Search Products
// ==========================
router.get("/search/:query", async (req, res) => {
  try {
    const { query: searchQuery } = req.params;
    const { limit = 10 } = req.query;

    const products = await query(
      `
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
    `,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, parseInt(limit)]
    );

    res.json({
      success: true,
      data: products.map(p => ({ ...p, reviews: [] })),
    });
  } catch (error) {
    console.error("Search products error:", error);
    res.status(500).json({
      success: false,
      message: "Server error searching products",
    });
  }
});

module.exports = router;
