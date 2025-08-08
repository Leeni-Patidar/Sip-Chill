'use client';

import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-amber-900 to-amber-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <i className="ri-cup-fill text-white text-lg"></i>
              </div>
              <span className="font-['Pacifico'] text-2xl">Sip & Chill</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Your cozy neighborhood café serving premium coffee, delicious pastries, and unforgettable experiences since 2020.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-instagram-line text-lg"></i>
              </a>
              <a href="#" className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                <i className="ri-twitter-fill text-lg"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-white/80 hover:text-white transition-colors">Home</a></li>
              <li><a href="/shop" className="text-white/80 hover:text-white transition-colors">Shop</a></li>
              <li><a href="/menu" className="text-white/80 hover:text-white transition-colors">Menu</a></li>
              <li><a href="/blog" className="text-white/80 hover:text-white transition-colors">Blog</a></li>
              <li><a href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <i className="ri-map-pin-line text-white/60"></i>
                <span className="text-white/80 text-sm">123 Coffee Street, Bean City, BC 12345</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-phone-line text-white/60"></i>
                <span className="text-white/80 text-sm">(555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-mail-line text-white/60"></i>
                <span className="text-white/80 text-sm">hello@sipandchill.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <i className="ri-time-line text-white/60"></i>
                <span className="text-white/80 text-sm">Mon-Sun: 7AM - 9PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2025 Sip & Chill. All rights reserved. Made with ❤️ and lots of coffee.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
