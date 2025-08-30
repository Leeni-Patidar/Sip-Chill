'use client';

import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { useNavigate } from "react-router-dom";

function MenuProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <span className="text-xl font-bold text-amber-700">₹{product.price}</span>
      </div>
     
    </div>
  );
}

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Map category_id → category name
  const categoryMap = {
    7: "Desserts",
    6: "Pizza & Pasta",
    5: "Salads",
    4: "Burgers & Sandwiches",
    3: "other",
    2: "Specials",
    1: "Beverages"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
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

  // group products by category_id
  const groupedProducts = products.reduce((acc, product) => {
    const catName = categoryMap[product.category_id] || "Other";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {});

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

      {/* Menu Products Category Wise */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
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
            Object.entries(groupedProducts).map(([category, prods]) => (
              <div key={category} className="mb-16">
                {/* Category Heading */}
                <h2 className="text-3xl font-bold text-amber-700 mb-8 border-b pb-2">
                  {category}
                </h2>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                  {prods.map((product) => (
                    <MenuProductCard
                      key={product.id}
                      product={product}
                      onClick={() => navigate(`/product/${product.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
