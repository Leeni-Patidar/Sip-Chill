
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await query(`
      INSERT INTO users (email, password, first_name, last_name, phone, role) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE email = email
    `, ['admin@sipchill.com', hashedPassword, 'Admin', 'User', '1234567890', 'admin']);

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    await query(`
      INSERT INTO users (email, password, first_name, last_name, phone, address) 
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE email = email
    `, ['customer@sipchill.com', customerPassword, 'John', 'Doe', '1234567891', '123 Main St, City, State']);

    // Create categories
    const categories = [
      { name: 'Hot Coffee', description: 'Freshly brewed hot coffee varieties' },
      { name: 'Cold Coffee', description: 'Iced and cold brew coffee options' },
      { name: 'Tea', description: 'Premium tea selections' },
      { name: 'Smoothies', description: 'Fresh fruit smoothies and juices' },
      { name: 'Pastries', description: 'Freshly baked pastries and desserts' },
      { name: 'Sandwiches', description: 'Delicious sandwiches and wraps' },
      { name: 'Snacks', description: 'Light snacks and appetizers' }
    ];

    for (const category of categories) {
      await query(`
        INSERT INTO categories (name, description) 
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE name = name
      `, [category.name, category.description]);
    }

    // Get category IDs
    const categoryRows = await query('SELECT id, name FROM categories');
    const categoryMap = {};
    categoryRows.forEach(row => {
      categoryMap[row.name] = row.id;
    });

    // Create products
    const products = [
      {
        name: 'Espresso',
        description: 'Single shot of pure coffee essence',
        price: 3.50,
        category_id: categoryMap['Hot Coffee'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Cappuccino',
        description: 'Espresso with steamed milk and foam',
        price: 4.50,
        category_id: categoryMap['Hot Coffee'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Latte',
        description: 'Espresso with steamed milk',
        price: 4.75,
        category_id: categoryMap['Hot Coffee'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Iced Latte',
        description: 'Espresso with cold milk over ice',
        price: 5.00,
        category_id: categoryMap['Cold Coffee'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Cold Brew',
        description: 'Smooth, low-acid cold brewed coffee',
        price: 4.25,
        category_id: categoryMap['Cold Coffee'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Green Tea',
        description: 'Premium Japanese green tea',
        price: 3.00,
        category_id: categoryMap['Tea'],
        stock_quantity: 100
      },
      {
        name: 'Chai Latte',
        description: 'Spiced tea with steamed milk',
        price: 4.25,
        category_id: categoryMap['Tea'],
        is_featured: true,
        stock_quantity: 100
      },
      {
        name: 'Berry Blast Smoothie',
        description: 'Mixed berries with yogurt and honey',
        price: 6.50,
        category_id: categoryMap['Smoothies'],
        is_featured: true,
        stock_quantity: 50
      },
      {
        name: 'Croissant',
        description: 'Buttery, flaky French croissant',
        price: 3.75,
        category_id: categoryMap['Pastries'],
        is_featured: true,
        stock_quantity: 30
      },
      {
        name: 'Chocolate Muffin',
        description: 'Rich chocolate muffin with chocolate chips',
        price: 3.50,
        category_id: categoryMap['Pastries'],
        stock_quantity: 25
      },
      {
        name: 'Turkey Club Sandwich',
        description: 'Turkey, bacon, lettuce, tomato on toasted bread',
        price: 8.50,
        category_id: categoryMap['Sandwiches'],
        is_featured: true,
        stock_quantity: 20
      },
      {
        name: 'Veggie Wrap',
        description: 'Fresh vegetables with hummus in a whole wheat wrap',
        price: 7.25,
        category_id: categoryMap['Sandwiches'],
        stock_quantity: 15
      },
      {
        name: 'Mixed Nuts',
        description: 'Premium mixed nuts and dried fruits',
        price: 4.00,
        category_id: categoryMap['Snacks'],
        stock_quantity: 40
      }
    ];

    for (const product of products) {
      await query(`
        INSERT INTO products (name, description, price, category_id, is_featured, stock_quantity) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = name
      `, [product.name, product.description, product.price, product.category_id, product.is_featured, product.stock_quantity]);
    }

    // Create blog posts
    const blogPosts = [
      {
        title: 'The Art of Coffee Brewing',
        slug: 'art-of-coffee-brewing',
        content: 'Discover the secrets behind perfect coffee brewing techniques and how they affect the flavor profile of your favorite beverages.',
        excerpt: 'Learn about different brewing methods and their impact on coffee taste.',
        status: 'published',
        published_at: new Date()
      },
      {
        title: 'Health Benefits of Green Tea',
        slug: 'health-benefits-green-tea',
        content: 'Explore the numerous health benefits of green tea, from antioxidants to improved metabolism and mental clarity.',
        excerpt: 'Discover why green tea is considered one of the healthiest beverages in the world.',
        status: 'published',
        published_at: new Date()
      },
      {
        title: 'Seasonal Menu Updates',
        slug: 'seasonal-menu-updates',
        content: 'We\'re excited to announce our new seasonal menu featuring fresh, locally-sourced ingredients and innovative flavor combinations.',
        excerpt: 'Check out our latest seasonal offerings and limited-time menu items.',
        status: 'published',
        published_at: new Date()
      }
    ];

    for (const post of blogPosts) {
      await query(`
        INSERT INTO blog_posts (title, slug, content, excerpt, status, published_at) 
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE title = title
      `, [post.title, post.slug, post.content, post.excerpt, post.status, post.published_at]);
    }

    // Create sample coupons
    const coupons = [
      {
        code: 'WELCOME10',
        description: 'Welcome discount for new customers',
        discount_type: 'percentage',
        discount_value: 10.00,
        minimum_order_amount: 15.00,
        max_uses: 100,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        code: 'FREESHIP',
        description: 'Free shipping on orders over $25',
        discount_type: 'fixed',
        discount_value: 5.00,
        minimum_order_amount: 25.00,
        max_uses: 50,
        valid_until: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
      }
    ];

    for (const coupon of coupons) {
      await query(`
        INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, max_uses, valid_until) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE code = code
      `, [coupon.code, coupon.description, coupon.discount_type, coupon.discount_value, coupon.minimum_order_amount, coupon.max_uses, coupon.valid_until]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Data Created:');
    console.log('- Admin user: admin@sipchill.com (password: admin123)');
    console.log('- Customer user: customer@sipchill.com (password: customer123)');
    console.log('- 7 product categories');
    console.log('- 13 sample products');
    console.log('- 3 blog posts');
    console.log('- 2 sample coupons');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
