const express = require('express');
const { query } = require('../config/database');

const router = express.Router();

/**
 * @desc Get all blog posts
 * @route GET /api/blog
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status = 'published', search, author } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let conditions = ['bp.status = ?'];
    let params = [status];

    if (search) {
      conditions.push('(bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (author) {
      conditions.push('u.id = ?');
      params.push(author);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const posts = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
        bp.status, bp.published_at, bp.created_at, bp.updated_at,
        u.first_name, u.last_name, u.email AS author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      ${whereClause}
      ORDER BY bp.published_at DESC, bp.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, parseInt(limit), offset]);

    const [{ total }] = await query(`
      SELECT COUNT(*) as total
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      ${whereClause}
    `, params);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ success: false, message: 'Server error getting blog posts' });
  }
});

/**
 * @desc Get featured blog posts
 * @route GET /api/blog/featured
 * @access Public
 */
router.get('/featured', async (req, res) => {
  try {
    const { limit = 3 } = req.query;
    const posts = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
        bp.published_at, bp.created_at,
        u.first_name, u.last_name
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
      ORDER BY bp.published_at DESC
      LIMIT ?
    `, [parseInt(limit)]);

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Get featured blog posts error:', error);
    res.status(500).json({ success: false, message: 'Server error getting featured blog posts' });
  }
});

/**
 * @desc Get blog post by slug
 * @route GET /api/blog/slug/:slug
 * @access Public
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const posts = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.content, bp.excerpt, bp.featured_image,
        bp.status, bp.published_at, bp.created_at, bp.updated_at,
        u.id AS author_id, u.first_name, u.last_name, u.email AS author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.slug = ? AND bp.status = 'published'
    `, [slug]);

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const post = posts[0];
    const relatedPosts = await query(`
      SELECT id, title, slug, excerpt, featured_image, published_at
      FROM blog_posts
      WHERE status = 'published' AND id != ? 
        AND (author_id = ? OR title LIKE ?)
      ORDER BY published_at DESC
      LIMIT 3
    `, [post.id, post.author_id, `%${post.title.split(' ')[0]}%`]);

    res.json({ success: true, data: { ...post, related_posts: relatedPosts } });
  } catch (error) {
    console.error('Get blog post by slug error:', error);
    res.status(500).json({ success: false, message: 'Server error getting blog post' });
  }
});

/**
 * @desc Search blog posts
 * @route GET /api/blog/search/:query
 * @access Public
 */
router.get('/search/:query', async (req, res) => {
  try {
    const { query: searchQuery } = req.params;
    const { limit = 10 } = req.query;

    const posts = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.excerpt, bp.featured_image,
        bp.published_at, bp.created_at,
        u.first_name, u.last_name
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.status = 'published'
        AND (bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?)
      ORDER BY bp.published_at DESC
      LIMIT ?
    `, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, parseInt(limit)]);

    res.json({ success: true, data: posts });
  } catch (error) {
    console.error('Search blog posts error:', error);
    res.status(500).json({ success: false, message: 'Server error searching blog posts' });
  }
});

/**
 * @desc Get blog categories
 * @route GET /api/blog/categories
 * @access Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await query(`
      SELECT 
        LOWER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(title, ' ', 1), ' ', 1))) AS category,
        COUNT(*) AS post_count
      FROM blog_posts
      WHERE status = 'published'
      GROUP BY LOWER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(title, ' ', 1), ' ', 1)))
      HAVING post_count > 0
      ORDER BY post_count DESC
      LIMIT 10
    `);
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({ success: false, message: 'Server error getting blog categories' });
  }
});

/**
 * @desc Get blog post by ID
 * @route GET /api/blog/:id
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const posts = await query(`
      SELECT 
        bp.id, bp.title, bp.slug, bp.content, bp.excerpt, bp.featured_image,
        bp.status, bp.published_at, bp.created_at, bp.updated_at,
        u.id AS author_id, u.first_name, u.last_name, u.email AS author_email
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ? AND bp.status = 'published'
    `, [id]);

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const post = posts[0];
    const relatedPosts = await query(`
      SELECT id, title, slug, excerpt, featured_image, published_at
      FROM blog_posts
      WHERE status = 'published' AND id != ? 
        AND (author_id = ? OR title LIKE ?)
      ORDER BY published_at DESC
      LIMIT 3
    `, [id, post.author_id, `%${post.title.split(' ')[0]}%`]);

    res.json({ success: true, data: { ...post, related_posts: relatedPosts } });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ success: false, message: 'Server error getting blog post' });
  }
});

module.exports = router;

