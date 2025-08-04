# Sip & Chill Backend API

A complete backend API for the Sip & Chill cafe website built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role-based access control
- **User Management** - Registration, login, profile management, wishlist
- **Product Management** - CRUD operations for menu items with categories
- **Order Management** - Complete order lifecycle with status tracking
- **Admin Dashboard** - Admin-only routes for managing products and orders
- **Email Integration** - Contact form and notifications (optional)
- **File Upload** - Image upload with Cloudinary integration (optional)
- **Input Validation** - Comprehensive validation with express-validator
- **Error Handling** - Centralized error handling with detailed responses
- **Security** - Helmet, CORS, rate limiting, and input sanitization
- **API Documentation** - Well-documented REST API endpoints

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** Helmet, CORS, express-rate-limit
- **File Upload:** Multer + Cloudinary (optional)
- **Email:** Nodemailer (optional)
- **Development:** Nodemon

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (local or MongoDB Atlas)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## ⚡ Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd SC_Backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Update the `.env` file with your settings:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/sip-and-chill

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@sipandchill.com

# Cloudinary Configuration (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=admin@sipandchill.com
ADMIN_PASSWORD=admin123
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# For local MongoDB
mongod

# Or if using MongoDB service
sudo systemctl start mongod
```

### 5. Seed the database (optional)

```bash
npm run seed
```

### 6. Start the server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

### User Model
- Authentication and profile information
- Role-based access (customer/admin)
- Wishlist functionality
- Address and contact details

### Product Model
- Menu items with detailed information
- Categories, pricing, and images
- Ratings and reviews system
- Inventory management

### Category Model
- Product categorization
- Icons and styling information
- Hierarchical organization

### Order Model
- Complete order lifecycle
- Status tracking and history
- Customer and shipping information
- Payment integration ready

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | User login | Public |
| POST | `/logout` | User logout | Private |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |
| PUT | `/password` | Change password | Private |
| POST | `/forgot-password` | Forgot password | Public |
| POST | `/reset-password/:token` | Reset password | Public |
| GET | `/wishlist` | Get user wishlist | Private |
| POST | `/wishlist/:productId` | Add to wishlist | Private |
| DELETE | `/wishlist/:productId` | Remove from wishlist | Private |

### Product Routes (`/api/products`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all products | Public |
| GET | `/:id` | Get single product | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |
| GET | `/featured` | Get featured products | Public |
| GET | `/search` | Search products | Public |
| POST | `/:id/reviews` | Add product review | Private |

### Category Routes (`/api/categories`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all categories | Public |
| GET | `/:id` | Get single category | Public |
| POST | `/` | Create category | Admin |
| PUT | `/:id` | Update category | Admin |
| DELETE | `/:id` | Delete category | Admin |

### Order Routes (`/api/orders`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get user orders | Private |
| GET | `/:id` | Get single order | Private |
| POST | `/` | Create new order | Private |
| PUT | `/:id/status` | Update order status | Admin |
| POST | `/:id/rating` | Rate completed order | Private |

### Admin Routes (`/api/admin`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/stats` | Get dashboard stats | Admin |
| GET | `/orders` | Get all orders | Admin |
| GET | `/users` | Get all users | Admin |
| PUT | `/users/:id/status` | Update user status | Admin |

### Contact Routes (`/api/contact`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/` | Send contact message | Public |

## 🔒 Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents abuse and DDoS attacks
- **Input Validation** - Comprehensive request validation
- **Password Hashing** - bcrypt for secure password storage
- **JWT Security** - Secure token-based authentication
- **MongoDB Injection Prevention** - Input sanitization

## 📝 Error Handling

The API includes comprehensive error handling with consistent response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": "Specific field error message"
  }
}
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📦 Deployment

### Environment Variables for Production

Make sure to set these environment variables in production:

- `NODE_ENV=production`
- `MONGODB_URI` - Your production MongoDB connection string
- `JWT_SECRET` - A secure, long random string
- `FRONTEND_URL` - Your frontend application URL

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "sip-and-chill-api"

# Monitor the application
pm2 monit

# View logs
pm2 logs sip-and-chill-api
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help with setup, please:

1. Check the documentation above
2. Look through existing issues
3. Create a new issue with detailed information
4. Contact the development team

## 🔮 Future Enhancements

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time order tracking with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Mobile app API endpoints
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch
- [ ] Caching with Redis
- [ ] Microservices architecture

---

**Made with ❤️ for Sip & Chill Cafe**