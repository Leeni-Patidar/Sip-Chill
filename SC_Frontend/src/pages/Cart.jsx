import React, { useContext } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart } = useContext(useCart);

  const totalAmount = cartItems.reduce((acc, item) => acc  item.price * item.quantity, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-4">
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity  1)}></button>
                </div>
              </div>
              <button className="text-red-600" onClick={() => removeFromCart(item._id)}>Remove</button>
            </div>
          ))}
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ₹{totalAmount}</p>
            <Link to="/checkout" className="bg-amber-700 text-white px-4 py-2 rounded mt-4 inline-block">Proceed to Checkout</Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
