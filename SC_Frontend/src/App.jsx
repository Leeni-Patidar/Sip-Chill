import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import ScrollToTop from "./components/ScrollToTop"
import Home from './pages/Home';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/Admin/AdminDashboard';
import NotFound from './components/NotFound';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingAndDelivery from './pages/ShippingAndDelivery';
import CancellationRefund from './pages/CancellationRefund';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';

function App() {
  return (
    <Router>
    <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders/:orderId" element={<OrderDetails />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/shipping-and-delivery" element={<ShippingAndDelivery />} />
          <Route path="/cancellation-refund" element={<CancellationRefund/>}/>
           <Route path="/faq" element={<FAQ />}/>
            <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

