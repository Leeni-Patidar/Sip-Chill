

import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import CartModal from './CartModal';
import WishlistModal from "../pages/WishlistModal";


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-white'
      }`}>
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <a href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center">
                <i className="ri-cup-fill text-white text-lg"></i>
              </div>
              <span className="font-['Pacifico'] text-2xl text-amber-800">Sip & Chill</span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-gray-700 hover:text-amber-700 font-medium transition-colors whitespace-nowrap">Home</a>
              <a href="/shop" className="text-gray-700 hover:text-amber-700 font-medium transition-colors whitespace-nowrap">Shop</a>
              <a href="/menu" className="text-gray-700 hover:text-amber-700 font-medium transition-colors whitespace-nowrap">Menu</a>
              <a href="/contact" className="text-gray-700 hover:text-amber-700 font-medium transition-colors whitespace-nowrap">Contact</a>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* User Authentication */}
              {isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full border-2 border-amber-200"
                    />
                    <span className="font-medium">{user?.name}</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-amber-700 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlistOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <i className="ri-heart-line text-xl"></i>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <i className="ri-shopping-cart-line text-xl"></i>
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <a href="/" className="text-gray-700 hover:text-amber-700 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="/shop" className="text-gray-700 hover:text-amber-700 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Shop</a>
                <a href="/menu" className="text-gray-700 hover:text-amber-700 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Menu</a>
                <a href="/contact" className="text-gray-700 hover:text-amber-700 font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
                
                {/* Mobile Auth Links */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center space-x-2 text-gray-700 hover:text-amber-700 font-medium transition-colors mb-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-6 h-6 rounded-full border border-amber-200"
                        />
                        <span>Profile</span>
                      </Link>
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="text-purple-600 hover:text-purple-700 font-medium transition-colors block mb-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="text-red-600 hover:text-red-700 font-medium transition-colors block"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-amber-700 font-medium transition-colors block mb-3"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-center block"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      {/* Wishlist Modal */}
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
};

export default Header;

