import React from 'react';
import '../index.css'; // includes Tailwind, fonts, and icons

import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="antialiased font-poppins bg-white">

        <Header />
        <main>{children}</main>
        <Footer />
      
    </div>
  );
}
