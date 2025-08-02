import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Blog from './pages/Blog/Blog';
import ProductDetails from './pages/ProductDetails';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
