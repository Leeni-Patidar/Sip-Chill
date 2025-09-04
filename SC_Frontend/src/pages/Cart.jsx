import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const { items: cartItems, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  // helper for price formatting
  const formatPrice = (price) => {
    if (typeof price === "number") return `₹${price.toFixed(2)}`;
    if (!isNaN(parseFloat(price))) return `₹${parseFloat(price).toFixed(2)}`;
    return `₹${price}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-26 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {/* <h2 className="text-2xl font-semibold text-gray-800">Your Cart</h2> */}
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <i className="ri-shopping-cart-line text-7xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Add some delicious items to get started!
            </p>
            <a
              href="/shop"
              className="bg-amber-700 text-white px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors whitespace-nowrap"
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image || item.image_url}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-amber-700 font-medium">
                        {formatPrice(item.price)} × {item.quantity} ={" "}
                        <span className="font-semibold">
                          ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <i className="ri-subtract-line text-sm"></i>
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-add-line text-sm"></i>
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors ml-2"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-800">
                  Total:
                </span>
                <span className="text-2xl font-bold text-amber-700">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors flex items-center justify-center whitespace-nowrap"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
