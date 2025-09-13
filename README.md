## ☕ Sip-Chill

Sip-Chill is a full-stack café management and ordering application that allows users to browse menus, add items to their cart/wishlist, place orders, and explore engaging blog posts. It also includes an admin dashboard for managing users, products, categories, coupons, and orders.

## 🔗 Live Demo

🌐 Click here to view the live app

(Replace # with your deployed URL once ready — e.g. Render/Netlify/Vercel link)

# # 🚀 Features

👤 Authentication & Authorization (User / Admin roles)

🛒 Cart & Wishlist Management

📦 Order Placement & Tracking

🎟️ Coupon Discounts

📑 Blog System for articles & updates

📊 Admin Dashboard (manage products, categories, coupons, orders, users)

💳 Secure Payments Integration (if enabled)

🎨 Modern & Responsive UI with Tailwind CSS

## 📦 Dependencies Used
Frontend

React – UI framework

React Router DOM – routing

Axios – API requests

Tailwind CSS – styling

Lucide React – icons

React Toastify – notifications

Backend

Node.js + Express – server framework

MySQL / MongoDB – database (replace with whichever you’re using)

JWT – authentication

bcryptjs – password hashing

multer – file uploads

cors – cross-origin handling

## 🛠️ Tech Stack

Frontend: React, Tailwind CSS, Axios
Backend: Node.js, Express
Database: MySQL (with MySQL2)
Authentication: JWT + bcryptjs
Deployment: (Render / Vercel / Netlify — replace with what you used)

## ⚙️ Installation & Setup
1. Clone the repo
git clone https://github.com/Leeni-Patidar/Sip-Chill.git
cd Sip-Chill

2. Setup Backend
cd SC_Backend
npm install
cp .env.example .env   # update your DB_URI, JWT_SECRET, PORT
npm run dev            # start backend on localhost:5001 (default)

3. Setup Frontend
cd SC_Frontend
npm install
npm start      
