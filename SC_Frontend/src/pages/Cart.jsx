// import React from "react";
// import { useCart } from "../context/CartContext";
// import { Link } from "react-router-dom";

// const Cart = () => {
//   const { items, updateQuantity, removeItem } = useCart();

//   const totalAmount = items.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
//       {items.length === 0 ? (
//         <p>Your cart is empty.</p>
//       ) : (
//         <>
//           {items.map((item) => (
//             <div
//               key={item.id} // or use item._id if your data uses that
//               className="flex justify-between items-center border-b py-4"
//             >
//               <div>
//                 <h3 className="text-lg font-medium">{item.name}</h3>
//                 <p>Price: ₹{item.price}</p>
//                 <div className="flex items-center space-x-2 mt-2">
//                   <button
//                     onClick={() =>
//                       updateQuantity(item.id, item.quantity - 1)
//                     }
//                     disabled={item.quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span>{item.quantity}</span>
//                   <button
//                     onClick={() =>
//                       updateQuantity(item.id, item.quantity + 1)
//                     }
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//               <button
//                 className="text-red-600"
//                 onClick={() => removeItem(item.id)}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <div className="mt-6">
//             <p className="text-xl font-bold">Total: ₹{totalAmount}</p>
//             <Link
//               to="/checkout"
//               className="bg-amber-700 text-white px-4 py-2 rounded mt-4 inline-block"
//             >
//               Proceed to Checkout
//             </Link>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Cart;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem } from "../api/cart";
import { useAuth } from "../context/AuthContext";

const Cart = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getCart();
        setItems(response.data);
      } catch (err) {
        setError("Failed to fetch cart items.");
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    try {
      await updateCartItem(itemId, { quantity });
      setItems(items.map(item => item.id === itemId ? { ...item, quantity } : item));
    } catch (err) {
      setError("Failed to update item quantity.");
      console.error("Error updating cart item quantity:", err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await removeCartItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (err) {
      setError("Failed to remove item from cart.");
      console.error("Error removing cart item:", err);
    }
  };

  const totalAmount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return <div className="p-6">Loading cart...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div
              key={item.id} // or use item._id if your data uses that
              className="flex justify-between items-center border-b py-4"
>
              <div>
                <h3 className="text-lg font-medium">{item.name}</h3>
                <p>Price: ₹{item.price}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="text-red-600"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="mt-6">
            <p className="text-xl font-bold">Total: ₹{totalAmount}</p>
            <Link
              to="/checkout"
              className="bg-amber-700 text-white px-4 py-2 rounded mt-4 inline-block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;

