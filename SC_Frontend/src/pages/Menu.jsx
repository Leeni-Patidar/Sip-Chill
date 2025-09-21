import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function MenuProductCard({ product, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 mb-6 cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <span className="text-xl font-bold text-amber-700">₹{product.price}</span>
      </div>
    </div>
  );
}

export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); 
  const navigate = useNavigate();

  const categoriesPerPage = 4; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch categories
        const catRes = await api.get("/api/categories");
        const cats = catRes.data?.data || [];
        setCategories(cats);

        // ✅ Fetch products
        const prodRes = await api.get("/api/products");
        const productsArr =
          prodRes.data?.data?.products || prodRes.data?.products || [];
        setProducts(productsArr);
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError("Failed to fetch menu items.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Pagination logic
  const startIndex = (page - 1) * categoriesPerPage;
  const endIndex = startIndex + categoriesPerPage;
  const displayedCategories = categories.slice(startIndex, endIndex);

  const totalPages = Math.ceil(categories.length / categoriesPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section
        className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Elegant%20caf%C3%A9%20menu%20background%20with%20coffee%20beans%2C%20warm%20brown%20wooden%20texture%2C%20vintage%20paper%20background%2C%20cozy%20atmosphere%2C%20professional%20menu%20design%20inspiration&width=1920&height=600&seq=menu-hero&orientation=landscape')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Our <span className="font-['Pacifico'] text-amber-300">Menu</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Carefully crafted beverages and dishes made with the finest
            ingredients
          </p>
        </div>
      </section>

      {/* Menu Products Category Wise */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading menu...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">
              <i className="ri-error-warning-line text-6xl mb-4"></i>
              <p className="text-xl font-medium mb-2">{error}</p>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          ) : (
            <>
              {displayedCategories.map((cat) => {
                const catProducts = products.filter(
                  (p) => p.category_id === cat.id
                );
                // if (catProducts.length === 0) return null; // skip empty categories

                return (
                  <div key={cat.id} className="mb-16">
                    {/* Category Heading */}
                    <h2 className="text-3xl font-bold text-amber-700 mb-8 border-b pb-2">
                      {cat.name}
                    </h2>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                      {catProducts.map((product) => (
                        <MenuProductCard
                          key={product.id}
                          product={product}
                          onClick={() => navigate(`/product/${product.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* ✅ Pagination Controls */}
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  Prev
                </button>
                <span className="text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    page === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-amber-600 text-white hover:bg-amber-700"
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
