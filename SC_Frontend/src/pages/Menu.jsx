'use client';

import React, { useRef, useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';


function MenuProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <span className="text-xl font-bold text-amber-700">₹{product.price}</span>
      </div>
      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
      {product.image && (
        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded mt-2" />
      )}
    </div>
  );
}


export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        // Support both { products } and { data: { products } }
        const productsArr = res.data?.products || res.data?.data?.products || [];
        setProducts(productsArr);
      } catch (err) {
        setError('Failed to fetch menu items.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section
        className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Elegant%20caf%C3%A9%20menu%20background%20with%20coffee%20beans%2C%20warm%20brown%20wooden%20texture%2C%20vintage%20paper%20background%2C%20cozy%20atmosphere%2C%20professional%20menu%20design%20inspiration&width=1920&height=600&seq=menu-hero&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our <span className="font-['Pacifico'] text-amber-300">Menu</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Carefully crafted beverages and dishes made with the finest ingredients
          </p>
        </div>
      </section>

      {/* Menu Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">
              <i className="ri-error-warning-line text-6xl mb-4"></i>
              <p className="text-xl font-medium mb-2">{error}</p>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-medium text-gray-600 mb-2">No menu items found</h3>
              <p className="text-gray-500">Check back soon for new additions!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <MenuProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ready to Order?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Visit us today or order online for pickup
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Order Online
            </a>
            <a
              href="/contact"
              className="bg-white text-amber-700 border-2 border-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-50 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              Visit Us
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
