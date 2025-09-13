## ☕ Sip-Chill

Sip-Chill is a full-stack café management and ordering application that allows users to browse menus, add items to their cart/wishlist, place orders. It also includes an admin dashboard for managing users, products, categories, coupons, and orders.

## 🔗 Live Demo

🌐 Click here to view the live app

[Sip&Chill](https://sip-chill.vercel.app/)

# # 🚀 Features

👤 Authentication & Authorization (User / Admin roles)

🛒 Cart & Wishlist Management

📦 Order Placement & Tracking

🎟️ Coupon Discounts

📊 Admin Dashboard (manage products, categories, coupons, orders, users)

💳 Secure Payments Integration (if enabled)

🎨 Modern & Responsive UI with Tailwind CSS


## 🛠️ Tech Stack

Frontend: React, Tailwind CSS, Axios
Backend: Node.js, Express
Database: MySQL (with MySQL2)
Authentication: JWT + bcryptjs
Deployment: (Render / Vercel / Netlify — replace with what you used)

## ⚙️ Installation & Setup
1. Clone the repo
- git clone https://github.com/Leeni-Patidar/Sip-Chill.git
- cd Sip-Chill

2. Setup Backend
- cd SC_Backend
- npm install
- cp .env.example .env   # update your DB_URI, JWT_SECRET, PORT
- npm run dev            # start backend on localhost:5001 (default)

3. Setup Frontend
- cd SC_Frontend
- npm install
- npm start      
