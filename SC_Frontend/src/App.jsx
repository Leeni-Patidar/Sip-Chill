import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ScrollToTop from "./components/ScrollToTop"
import NotFound from './components/NotFound';

import CancellationRefund from './pages/CancellationRefund';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Home from './pages/Home';
import Login from './pages/Login';
import Menu from './pages/Menu';
// import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetails from './pages/OrderDetails';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ProductDetails from './pages/ProductDetails';
import Profile from './pages/Profile';
import Register from './pages/Register';
import ShippingAndDelivery from './pages/ShippingAndDelivery';
import Shop from './pages/Shop';
import TermsAndConditions from './pages/TermsAndConditions';


// Admin pages
import AdminDashboard from './pages/Admin/AdminDashboard';
// import OrderManagement from './pages/Admin/OrderManagement';
// import ProductManagement from './pages/Admin/ProductManagement';

// import UserList from './pages/Admin/UserList';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/cancellation-refund" element={<CancellationRefund />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/login" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          {/* <Route path="/order-confirmation" element={<OrderConfirmation />} /> */}
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          {/* <Route path="/admin/orders" element={<OrderManagement />} />
          <Route path="/admin/products" element={<ProductManagement />} />
          <Route path="/admin/users" element={<UserList />} /> */}

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
