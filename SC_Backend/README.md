
# Sip & Chill Café Backend API

A complete Node.js backend API for the "Sip & Chill" café application, built with Express.js and MySQL.

## 🚀 Features

- **User Authentication & Authorization** - JWT-based authentication with role-based access
- **Product Management** - Complete CRUD operations for products and categories
- **Shopping Cart** - Session-based cart for both guests and authenticated users
- **Order Management** - Full order lifecycle with status tracking
- **Contact Management** - Contact form submissions and café information
- **Admin Dashboard** - Comprehensive admin panel with analytics
- **Review System** - Product reviews and ratings
- **Payment Integration** - Ready for Razorpay integration
- **Email Notifications** - Order confirmations and contact notifications

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sip-chill-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5002
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=sip_chill_db
   DB_PORT=3306
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=356d
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
   ```

4. **Database Setup**
   ```bash
   # Create database and tables
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📊 Database Schema

### Core Tables
- **users** - User accounts and profiles
- **categories** - Product categories
- **products** - Menu items with pricing and stock
- **cart** - Shopping cart sessions
- **cart_items** - Individual cart items
- **orders** - Order information and status
- **order_items** - Items in each order
- **contact_messages** - Contact form submissions
- **reviews** - Product reviews and ratings
- **coupons** - Discount codes and promotions

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `GET /api/products/search/:query` - Search products

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category with products
- `GET /api/categories/slug/:slug` - Get category by slug

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:itemId` - Update cart item
- `DELETE /api/cart/remove/:itemId` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/merge` - Merge guest cart with user cart

### Orders
- `POST /api/orders` - Place new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/track/:orderNumber` - Track order by number

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/info` - Get café information
- `GET /api/contact/hours` - Get operating hours
- `GET /api/contact/is-open` - Check if café is open

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/orders` - Get user order history
- `GET /api/users/orders/:id` - Get order details
- `GET /api/users/favorites` - Get user favorites
- `GET /api/users/reviews` - Get user reviews
- `POST /api/users/reviews` - Add product review
- `GET /api/users/stats` - Get user statistics

### Admin (Protected)
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `GET /api/admin/contact-messages` - Get contact messages
- `PUT /api/admin/contact-messages/:id/read` - Mark message as read
- `GET /api/admin/analytics/products` - Get product analytics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Sample Login Request
```json
{
  "email": "customer@sipchill.com",
  "password": "customer123"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 2,
      "email": "customer@sipchill.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "customer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## 📝 Sample Data

After running the seed script, you'll have:

### Users
- **Admin**: `admin@sipchill.com` / `admin123`
- **Customer**: `customer@sipchill.com` / `customer123`

### Products
- 13 sample products across 7 categories
- Hot Coffee, Cold Coffee, Tea, Smoothies, Pastries, Sandwiches, Snacks


### Coupons
- `WELCOME10` - 10% off for new customers
- `FREESHIP` - Free shipping on orders over $25

## 🛡️ Security Features

- **Password Hashing** - bcryptjs for secure password storage
- **JWT Authentication** - Stateless authentication with configurable expiration
- **Rate Limiting** - Protection against abuse
- **Input Validation** - Express-validator for request validation
- **CORS Configuration** - Configurable cross-origin requests
- **Helmet** - Security headers middleware
- **SQL Injection Protection** - Parameterized queries

## 📦 Project Structure

```
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── products.js          # Product routes
│   ├── categories.js        # Category routes
│   ├── cart.js              # Cart routes
│   ├── orders.js            # Order routes
│   ├── contact.js           # Contact routes
│   ├── users.js             # User routes
│   └── admin.js             # Admin routes
├── scripts/
│   ├── migrate.js           # Database migration
│   └── seed.js              # Sample data seeding
├── uploads/                 # File uploads directory
├── .env.example            # Environment variables template
├── package.json            # Dependencies and scripts
├── server.js               # Main application file
└── README.md               # This file
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5002
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=sip_chill_db
JWT_SECRET=your_very_secure_jwt_secret
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "sip-chill-api"
pm2 save
pm2 startup
```

## 🔧 Development

### Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests (when implemented)

### Adding New Features
1. Create new route file in `routes/` directory
2. Add route to `server.js`
3. Implement middleware if needed
4. Add database migrations if schema changes
5. Update documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@sipchill.com or create an issue in the repository.

---

**Sip & Chill Café API** - Built with ❤️ for coffee lovers everywhere ☕
