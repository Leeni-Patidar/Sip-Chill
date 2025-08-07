import React, { useContext } from "react";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const { cartItems } = useContext(useCart);

  const total = cartItems.reduce((acc, item) => acc  item.price * item.quantity, 0);

  const handlePlaceOrder = () => {
    alert("Order placed!");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
      {cartItems.map((item) => (
        <div key={item._id} className="flex justify-between border-b py-2">
          <span>{item.name} × {item.quantity}</span>
          <span>₹{item.price * item.quantity}</span>
        </div>
      ))}
      <div className="mt-4 font-bold">Total: ₹{total}</div>
      <button className="mt-6 bg-amber-700 text-white px-4 py-2 rounded" onClick={handlePlaceOrder}>
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
