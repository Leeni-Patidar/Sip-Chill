import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductById } from "../api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data?.data || null);
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

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
            src={product.image_url}
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
              onClick={() => addItem(product)}
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
    </div>
  );
};

export default ProductDetails;
