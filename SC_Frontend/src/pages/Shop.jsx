import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import ProductCard from '../components/ProductCard';

function ShopContent() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ store categories from backend
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/products');
        const productsArr = response.data?.data?.products || [];
        setProducts(productsArr);
        setFilteredProducts(productsArr);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/categories');
        const cats = res.data?.data?.categories || [];
        setCategories(cats);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];

    // Filter by category_id
    if (selectedCategory !== 'all') {
      const categoryIdNum = Number(selectedCategory);
      filtered = filtered.filter((product) => product.category_id === categoryIdNum);
    }

    // Price range filter
    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-150':
          filtered = filtered.filter((product) => product.price < 150);
          break;
        case '150-300':
          filtered = filtered.filter((product) => product.price >= 150 && product.price <= 300);
          break;
        case 'over-300':
          filtered = filtered.filter((product) => product.price > 300);
          break;
        default:
          break;
      }
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy, priceRange, products]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Our <span className="text-amber-700">Shop</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our full range of premium coffee, delicious pastries, and café favorites
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white pr-8"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white pr-8"
                >
                  <option value="all">All Prices</option>
                  <option value="under-150">Under ₹150</option>
                  <option value="150-300">₹150 - ₹300</option>
                  <option value="over-300">Over ₹300</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white pr-8"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16 text-red-600">
              <i className="ri-error-warning-line text-6xl mb-4"></i>
              <p className="text-xl font-medium mb-2">{error}</p>
              <p className="text-gray-500">Please try again later.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="md:col-span-3 text-center py-16">
                <i className="ri-search-line text-6xl text-gray-300 mb-4"></i>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No products found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
          <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded max-w-2xl mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
