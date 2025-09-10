import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // ✅ auth check
import { getProductById } from "../api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const { addItem } = useCart();
  const { isAuthenticated } = useAuth(); // ✅ login state

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true); // ✅ ask login
      return;
    }

    if (!(product.stock_quantity > 0)) {
      alert("Sorry, this product is out of stock!");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || product.image,
    });
  };

  if (loading) {
    return <div className="p-6">Loading product details...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-600">Error: {error}</div>;
  }

  if (!product) {
    return <div className="p-6 text-gray-600">Product not found.</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={product.image_url || product.image}
            alt={product.name}
            className="w-full h-auto rounded-2xl shadow-md"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

          <div className="flex items-center space-x-2 mb-4">
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
            {product.stock_quantity > 0 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              disabled={!(product.stock_quantity > 0)}
              className={`px-6 py-3 rounded-full font-medium text-white transition ${
                product.stock_quantity > 0
                  ? "bg-amber-700 hover:bg-amber-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* ✅ Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Please Login
            </h2>
            <p className="text-gray-600 mb-6">
              You need to login before adding products to your cart.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <a
                href="/login"
                className="px-4 py-2 rounded-lg bg-amber-700 text-white hover:bg-amber-800"
              >
                Login
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
