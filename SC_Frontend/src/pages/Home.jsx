
import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { getAllCategories } from '../api/categories';
import { getAllProducts } from '../api/products';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch Categories
    getAllCategories()
      .then((res) => setCategories(res.data.data))
      .catch((err) => console.error('Error fetching categories:', err));

    // Fetch Products
    getAllProducts()
      .then((res) => setProducts(res.data.data.products))
      .catch((err) => console.error('Error fetching products:', err));

    // GSAP animations
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
          gsap.registerPlugin(ScrollTrigger);
        });
      });
    }
  }, []);

  const featuredProducts = products.filter((product) => product.is_featured === 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <Hero />

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Explore Our <span className="text-amber-700">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From premium coffee to delicious pastries, discover our carefully curated selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Featured <span className="text-amber-700">Products</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked favorites that our customers love most
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/shop"
              className="inline-flex items-center bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              View All Products
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </div>
      </section>

      {/* Milkshakes Section */}
      {/* <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Creamy <span className="text-amber-700">Milkshakes</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Indulge in our signature milkshakes made with premium ice cream and fresh ingredients. 
                Each sip is a perfect blend of creamy texture and rich flavors.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <i className="ri-check-line text-amber-700 text-xl"></i>
                  <span className="text-gray-700">Made with premium vanilla ice cream</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-check-line text-amber-700 text-xl"></i>
                  <span className="text-gray-700">Fresh ingredients and real fruit</span>
                </div>
                <div className="flex items-center space-x-3">
                  <i className="ri-check-line text-amber-700 text-xl"></i>
                  <span className="text-gray-700">Customizable toppings available</span>
                </div>
              </div>
              <a
                href="/shop?category=1"
                className="inline-flex items-center bg-amber-700 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-800 transition-colors whitespace-nowrap"
              >
                Order Milkshakes
                <i className="ri-arrow-right-line ml-2"></i>
              </a>
            </div>
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=Delicious%20chocolate%20and%20vanilla%20milkshakes%20in%20tall%20glasses%20with%20whipped%20cream%2C%20colorful%20straws%2C%20caf%C3%A9%20counter%20background%2C%20warm%20brown%20atmosphere%2C%20professional%20food%20photography%2C%20appetizing%20presentation&width=600&height=400&seq=milkshake-hero&orientation=landscape"
                alt="Premium Milkshakes"
                className="w-full h-96 object-cover object-top rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://readdy.ai/api/search-image?query=Coffee%20beans%20pattern%20texture%2C%20warm%20brown%20background%2C%20subtle%20coffee%20bean%20scattered%20design%2C%20elegant%20caf%C3%A9%20atmosphere%2C%20premium%20quality%20texture&width=800&height=400&seq=cta-bg&orientation=landscape')] opacity-10"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready for Your Next <span className="font-['Pacifico']">Coffee Adventure?</span>
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of coffee lovers who choose Sip & Chill for their daily dose of happiness
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/shop"
                  className="bg-white text-amber-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg whitespace-nowrap"
                >
                  Shop Now
                </a>
                <a
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                >
                  Visit Us Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
