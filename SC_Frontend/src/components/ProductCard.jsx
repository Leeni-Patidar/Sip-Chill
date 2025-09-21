import React, { useRef, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

const ProductCard = ({ product }) => {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const cardRef = useRef(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }
  }, []);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginModal(true); // ✅ ask to login
      return;
    }

    if (!product.stock_quantity) {
      alert("Sorry, this product is out of stock!");
      return;
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
    });
  };

  // ✅ Review parsing (safe)
  let reviewData = { rating: 0, reviews: [] };
  if (product.reviews) {
    if (typeof product.reviews === "string") {
      try {
        const parsed = JSON.parse(product.reviews);
        reviewData = {
          rating: parsed.rating || 0,
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
        };
      } catch {
        reviewData = { rating: 0, reviews: [] };
      }
    } else if (typeof product.reviews === "object") {
      reviewData = {
        rating: product.reviews.rating || 0,
        reviews: Array.isArray(product.reviews.reviews)
          ? product.reviews.reviews
          : [],
      };
    }
  }

  return (
    <>
      <div ref={cardRef} className="group">
        <a href={`/product/${product.id}`}>
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
            <div className="relative overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-300px object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {product.featured && (
                  <span className="bg-amber-700 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Featured
                  </span>
                )}
                {product.originalPrice && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Sale
                  </span>
                )}
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2
               bg-amber-700 text-white px-6 py-2 rounded-full font-medium
               opacity-100 lg:opacity-0 group-hover:opacity-100
               transition-all duration-300 hover:bg-amber-800
               whitespace-nowrap cursor-pointer z-10"
              >
                Add to Cart
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-amber-700">
                  ₹{product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
              </div>
              <div className="mt-2">
                {product.stock_quantity ? (
                  <span className="text-green-600 text-sm font-medium">
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-500 text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
          </div>
        </a>
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
    </>
  );
};

export default ProductCard;
