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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center border-b py-4">
                <div className="flex items-center space-x-4">
                  <img src={item.image || item.image_url} alt={item.name} width={50} className="rounded" />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p>
                      ₹{item.price} x {item.quantity} = ₹{item.total_price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors cursor-pointer" disabled={item.quantity <= 1}>
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
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-xl font-bold">Total: ₹{total}</p>
            <button onClick={handleCheckout} className="bg-amber-700 text-white px-4 py-2 rounded">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
