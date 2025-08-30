'use client';

import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';

const CartModal = ({ isOpen, onClose }) => {
  const { items, total, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <i className="ri-close-line text-xl text-gray-500"></i>
          </button>
        </div>
        <div className="flex flex-col h-full max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 mb-6">Add some delicious items to get started!</p>
              <a href="/shop" className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium hover:bg-amber-800 transition-colors whitespace-nowrap" onClick={onClose}>
                Start Shopping
              </a>
            </div>
          ) : (
            <>
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <img src={item.image || item.image_url} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-amber-700 font-medium">
                        {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` :
                          !isNaN(parseFloat(item.price)) ? `$${parseFloat(item.price).toFixed(2)}` :
                          `$${item.price}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <i className="ri-subtract-line text-sm"></i>
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer">
                        <i className="ri-add-line text-sm"></i>
                      </button>
                      <button onClick={() => removeItem(item.id)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer ml-2">
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-xl font-bold text-amber-700">${total.toFixed(2)}</span>
                </div>
                <a href="/cart" className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors flex items-center justify-center whitespace-nowrap" onClick={onClose}>
                  View Cart & Checkout
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;
