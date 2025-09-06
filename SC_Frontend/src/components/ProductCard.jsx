

import React, { useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(cardRef.current, 
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.6,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  // Parse reviews JSON string if needed
  let reviewData = { rating: 0, reviews: 0 };
  if (product.reviews) {
    if (typeof product.reviews === 'string') {
      try {
        reviewData = JSON.parse(product.reviews);
      } catch {
        reviewData = { rating: 0, reviews: 0 };
      }
    } else if (typeof product.reviews === 'object') {
      reviewData = product.reviews;
    }
  }

  return (
    <div ref={cardRef} className="group">
      <a href={`/product/${product.id}`}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.featured && (
                <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </span>
              )}
              {product.originalPrice && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Sale
                </span>
              )}
            </div>
            
            <button
  onClick={handleAddToCart}
  className="absolute bottom-4 left-1/2 transform -translate-x-1/2
             bg-amber-700 text-white px-6 py-2 rounded-full font-medium
             opacity-100 lg:opacity-0 group-hover:opacity-100
             transition-all duration-300 hover:bg-amber-800
             whitespace-nowrap cursor-pointer z-10"
>
  Add to Cart
</button>

          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center space-x-1 mb-3">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`ri-star-${i < Math.floor(reviewData.rating) ? 'fill' : 'line'} text-sm`}></i>
                ))}
              </div>
              <span className="text-sm text-gray-500">({reviewData.reviews} reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-amber-700">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <div className="mt-2">
              {product.stock_quantity ? (
                <span className="text-green-600 text-sm font-medium">In Stock</span>
              ) : (
                <span className="text-red-500 text-sm font-medium">Out of Stock</span>
              )}
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProductCard;
