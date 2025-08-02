import React from 'react';
import '../index.css'; // includes Tailwind, fonts, and icons
import { CartProvider } from '../context/CartContext';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="antialiased font-poppins bg-white">
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </div>
  );
}
