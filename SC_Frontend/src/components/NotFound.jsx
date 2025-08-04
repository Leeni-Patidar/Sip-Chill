'use client';

import React, { useEffect } from 'react';
import { Link } from 'react-router';

const NotFound = () => {
  useEffect(() => {
    // GSAP Animation
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo('.not-found-container', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
        gsap.fromTo('.coffee-cup', 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 1, delay: 0.3, ease: 'back.out(1.7)' }
        );
        gsap.fromTo('.not-found-text', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, delay: 0.5, stagger: 0.1, ease: 'power2.out' }
        );
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="not-found-container max-w-lg mx-auto text-center">
        {/* Animated Coffee Cup */}
        <div className="coffee-cup mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
              <i className="ri-cup-fill text-6xl text-white"></i>
            </div>
            {/* Steam Animation */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0s'}}></div>
                <div className="w-1 h-6 bg-gray-300 rounded-full opacity-40 animate-pulse" style={{animationDelay: '0.3s'}}></div>
                <div className="w-1 h-8 bg-gray-300 rounded-full opacity-60 animate-pulse" style={{animationDelay: '0.6s'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="not-found-text">
          <h1 className="text-8xl font-bold text-amber-700 mb-4">404</h1>
        </div>
        
        <div className="not-found-text">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Oops! Page Not Found</h2>
        </div>
        
        <div className="not-found-text">
          <p className="text-xl text-gray-600 mb-8">
            Looks like this page took a coffee break! The page you're looking for doesn't exist.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="not-found-text space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold rounded-lg hover:from-amber-700 hover:to-amber-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <i className="ri-home-line mr-2"></i>
              Back to Home
            </Link>
            
            <Link 
              to="/shop"
              className="inline-flex items-center px-6 py-3 bg-white text-amber-700 font-semibold rounded-lg border-2 border-amber-200 hover:bg-amber-50 hover:border-amber-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <i className="ri-shopping-bag-line mr-2"></i>
              Browse Menu
            </Link>
          </div>
        </div>

        {/* Popular Links */}
        <div className="not-found-text mt-12 p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link 
              to="/menu"
              className="flex items-center p-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors group"
            >
              <i className="ri-restaurant-line mr-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-sm font-medium">Menu</span>
            </Link>
            
            <Link 
              to="/blog"
              className="flex items-center p-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors group"
            >
              <i className="ri-article-line mr-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-sm font-medium">Blog</span>
            </Link>
            
            <Link 
              to="/contact"
              className="flex items-center p-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors group"
            >
              <i className="ri-phone-line mr-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-sm font-medium">Contact</span>
            </Link>
            
            <Link 
              to="/login"
              className="flex items-center p-3 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors group"
            >
              <i className="ri-user-line mr-2 group-hover:scale-110 transition-transform"></i>
              <span className="text-sm font-medium">Account</span>
            </Link>
          </div>
        </div>

        {/* Fun Quote */}
        <div className="not-found-text mt-8">
          <p className="text-sm text-gray-500 italic">
            "Life happens, coffee helps. And so do working links!" ☕
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
