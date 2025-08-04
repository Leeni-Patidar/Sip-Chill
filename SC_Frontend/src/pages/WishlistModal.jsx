

import React, { useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

const WishlistModal = ({ isOpen, onClose }) => {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  useEffect(() => {
    if (isOpen && typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo('.wishlist-modal', 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
        gsap.fromTo('.wishlist-item', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, delay: 0.1, stagger: 0.05, ease: 'power2.out' }
        );
      });
    }
  }, [isOpen]);

  const handleAddToCart = (item) => {
    addToCart(item);
    removeItem(item.id);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="wishlist-modal bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
              <p className="text-gray-600">{items.length} item(s) saved</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="ri-close-line text-2xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <i className="ri-heart-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 text-center mb-6">
                Save your favorite items by clicking the heart icon on products
              </p>
              <button
                onClick={onClose}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="p-6">
              {/* Clear All Button */}
              {items.length > 0 && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => {
                      clearWishlist();
                      onClose();
                    }}
                    className="text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <i className="ri-delete-bin-line mr-1"></i>
                    Clear All
                  </button>
                </div>
              )}

              {/* Wishlist Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="wishlist-item bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.category}</p>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`ri-star-${i < Math.floor(item.rating) ? 'fill' : 'line'} text-yellow-400 text-sm`}
                              ></i>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">({item.reviews})</span>
                        </div>
                        <p className="text-lg font-bold text-amber-600">₹{item.price}</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                        >
                          <i className="ri-shopping-cart-line mr-1"></i>
                          Add to Cart
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm"
                        >
                          <i className="ri-delete-bin-line mr-1"></i>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  items.forEach(item => addToCart(item));
                  clearWishlist();
                  onClose();
                }}
                className="flex-1 bg-amber-600 text-white py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
              >
                <i className="ri-shopping-cart-line mr-2"></i>
                Add All to Cart
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistModal;
