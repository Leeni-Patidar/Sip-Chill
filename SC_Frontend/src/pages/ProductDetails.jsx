// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { products } from "../context/mock-data"; // ✅ Directly import mock data

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const { addItem } = useCart(); // ✅ Matches your ProductCard's cart function

//   useEffect(() => {
//     // Find product from mock data (no backend call)
//     const foundProduct = products.find((p) => String(p.id) === String(id));
//     setProduct(foundProduct || null);
//   }, [id]);

//   if (!product) return <div className="p-6">Product not found.</div>;

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* Product Image */}
//         <div>
//           <img
//             src={product.image}
//             alt={product.name}
//             className="w-full h-auto rounded-2xl shadow-md"
//           />
//         </div>

//         {/* Product Info */}
//         <div>
//           <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
//           <div className="flex items-center space-x-2 mb-4">
//             <span className="text-lg font-bold text-amber-700">
//               ₹{product.price}
//             </span>
//             {product.originalPrice && (
//               <span className="text-sm text-gray-500 line-through">
//                 ₹{product.originalPrice}
//               </span>
//             )}
//           </div>
//           <p className="text-gray-600 mb-6">{product.description}</p>

//           {/* Stock Status */}
//           <div className="mb-4">
//             {product.inStock ? (
//               <span className="text-green-600 font-medium">In Stock</span>
//             ) : (
//               <span className="text-red-500 font-medium">Out of Stock</span>
//             )}
//           </div>

//           {/* Add to Cart */}
//           <button
//             onClick={() => addItem(product)}
//             disabled={!product.inStock}
//             className={`px-6 py-3 rounded-full font-medium text-white transition ${
//               product.inStock
//                 ? "bg-amber-700 hover:bg-amber-800"
//                 : "bg-gray-400 cursor-not-allowed"
//             }`}
//           >
//             Add to Cart
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios"; // Import axios

const api = axios.create({
  baseURL: "http://localhost:5002/api", // Configure your backend URL
});

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const { addItem } = useCart(); // ✅ Matches your ProductCard's cart function

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch product details."); // Set error state
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto rounded-2xl shadow-md"
          />
        </div>

        {/* Loading and Error Handling */}
        {loading && <div className="p-6">Loading product details...</div>}
        {error && <div className="p-6 text-red-600">Error: {error}</div>}

        {/* Product Info - Render only when product data is available */}
        {product && (
          <>
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-lg font-bold text-amber-700">
                  ₹{product.price}
                </span>
            <span className="text-lg font-bold text-amber-700">
              ₹{product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-4">
            {product.inStock ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={() => addItem(product)}
            disabled={!product.inStock}
            className={`px-6 py-3 rounded-full font-medium text-white transition ${
              product.inStock
                ? "bg-amber-700 hover:bg-amber-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
