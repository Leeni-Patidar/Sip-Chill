'use client';

import React, { useRef, useEffect, useState } from 'react';
import BlogCard from '../../components/BlogCard';

const blogPosts = [
  {
    id: '1',
    title: 'The Art of Perfect Coffee Brewing: A Comprehensive Guide',
    excerpt: 'Discover the secrets behind brewing the perfect cup of coffee. From bean selection to brewing techniques, learn everything you need to know to elevate your coffee experience at home.',
    image: 'https://readdy.ai/api/search-image?query=professional%20barista%20brewing%20coffee%20with%20pour%20over%20method%20in%20modern%20cafe%20setting%2C%20steam%20rising%20from%20cup%2C%20warm%20lighting%2C%20coffee%20beans%20scattered%20around&width=400&height=250&seq=blog1&orientation=landscape',
    author: 'Sarah Johnson',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Coffee Guide'
  },
  {
    id: '2',
    title: 'Sustainable Coffee: Why Fair Trade Matters',
    excerpt: 'Learn about the importance of sustainable coffee farming and how choosing fair trade coffee makes a difference for farmers and the environment worldwide.',
    image: 'https://readdy.ai/api/search-image?query=coffee%20farmer%20in%20green%20plantation%20harvesting%20ripe%20coffee%20cherries%2C%20sustainable%20farming%2C%20natural%20sunlight%2C%20tropical%20landscape%20background&width=400&height=250&seq=blog2&orientation=landscape',
    author: 'Michael Chen',
    date: '2024-01-10',
    readTime: '6 min read',
    category: 'Sustainability'
  },
  {
    id: '3',
    title: 'Seasonal Menu Favorites: Winter Warmers at Sip & Chill',
    excerpt: 'Explore our cozy winter menu featuring spiced lattes, hot chocolate variations, and warming pastries that will keep you comfortable during the cold season.',
    image: 'https://readdy.ai/api/search-image?query=winter%20coffee%20drinks%20with%20cinnamon%20sticks%20and%20whipped%20cream%2C%20cozy%20cafe%20atmosphere%2C%20warm%20lighting%2C%20seasonal%20spices%20and%20pastries%20around&width=400&height=250&seq=blog3&orientation=landscape',
    author: 'Emma Rodriguez',
    date: '2024-01-05',
    readTime: '5 min read',
    category: 'Menu'
  },
  {
    id: '4',
    title: 'Coffee and Health: Debunking Common Myths',
    excerpt: 'Separate fact from fiction as we explore the health benefits and myths surrounding coffee consumption, backed by scientific research and expert opinions.',
    image: 'https://readdy.ai/api/search-image?query=healthy%20lifestyle%20with%20coffee%20cup%20next%20to%20fresh%20fruits%20and%20vegetables%2C%20clean%20modern%20kitchen%2C%20natural%20lighting%2C%20wellness%20concept&width=400&height=250&seq=blog4&orientation=landscape',
    author: 'Dr. Lisa Park',
    date: '2023-12-28',
    readTime: '7 min read',
    category: 'Health'
  },
  {
    id: '5',
    title: 'Behind the Scenes: Meet Our Coffee Roasting Team',
    excerpt: 'Get to know the passionate team behind our signature roasts. Learn about their journey, expertise, and the careful process that brings you exceptional coffee.',
    image: 'https://readdy.ai/api/search-image?query=coffee%20roasting%20team%20working%20with%20industrial%20coffee%20roaster%20machine%2C%20coffee%20beans%20being%20roasted%2C%20professional%20setting%2C%20warm%20industrial%20lighting&width=400&height=250&seq=blog5&orientation=landscape',
    author: 'James Wilson',
    date: '2023-12-20',
    readTime: '9 min read',
    category: 'Team'
  },
  {
    id: '6',
    title: 'The Perfect Pairing: Coffee and Pastries Guide',
    excerpt: 'Discover which pastries complement different coffee varieties best. Our expert recommendations will help you create the perfect flavor combinations.',
    image: 'https://readdy.ai/api/search-image?query=elegant%20coffee%20and%20pastry%20pairing%20display%20with%20croissants%2C%20muffins%2C%20and%20various%20coffee%20cups%20on%20marble%20table%2C%20artistic%20food%20photography&width=400&height=250&seq=blog6&orientation=landscape',
    author: 'Anna Martinez',
    date: '2023-12-15',
    readTime: '6 min read',
    category: 'Food Pairing'
  },
  {
    id: '7',
    title: 'Coffee Around the World: A Cultural Journey',
    excerpt: 'Take a virtual trip around the globe as we explore different coffee cultures, from Italian espresso traditions to Ethiopian coffee ceremonies.',
    image: 'https://readdy.ai/api/search-image?query=world%20map%20with%20coffee%20cups%20from%20different%20countries%2C%20cultural%20coffee%20brewing%20methods%2C%20traditional%20coffee%20ceremonies%2C%20diverse%20cultural%20elements&width=400&height=250&seq=blog7&orientation=landscape',
    author: 'Roberto Silva',
    date: '2023-12-10',
    readTime: '10 min read',
    category: 'Culture'
  },
  {
    id: '8',
    title: 'Home Barista Tips: Equipment and Techniques',
    excerpt: 'Transform your kitchen into a professional coffee station with our guide to essential equipment and expert techniques for brewing café-quality coffee at home.',
    image: 'https://readdy.ai/api/search-image?query=home%20coffee%20brewing%20setup%20with%20espresso%20machine%2C%20grinder%2C%20and%20various%20brewing%20equipment%20on%20clean%20kitchen%20counter%2C%20professional%20home%20barista%20tools&width=400&height=250&seq=blog8&orientation=landscape',
    author: 'David Thompson',
    date: '2023-12-05',
    readTime: '8 min read',
    category: 'Home Brewing'
  },
  {
    id: '9',
    title: 'Community Events: Building Connections Over Coffee',
    excerpt: 'Learn about our community initiatives and upcoming events. Discover how coffee brings people together and strengthens neighborhood bonds.',
    image: 'https://readdy.ai/api/search-image?query=community%20coffee%20event%20with%20diverse%20group%20of%20people%20enjoying%20coffee%20together%2C%20cafe%20interior%2C%20social%20gathering%2C%20warm%20community%20atmosphere&width=400&height=250&seq=blog9&orientation=landscape',
    author: 'Sophie Chang',
    date: '2023-11-30',
    readTime: '5 min read',
    category: 'Community'
  }
];

const categories = ['All', 'Coffee Guide', 'Sustainability', 'Menu', 'Health', 'Team', 'Food Pairing', 'Culture', 'Home Brewing', 'Community'];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const heroRef = useRef(null);
  const categoriesRef = useRef(null);
  const postsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        const tl = gsap.timeline();
        tl.fromTo(heroRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
          .fromTo(categoriesRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
          .fromTo(postsRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3');
      });
    }
  }, []);

  const filteredPosts = selectedCategory === 'All'
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white py-24 overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=coffee%20blog%20header%20with%20coffee%20beans%20pattern%2C%20warm%20brown%20background%2C%20elegant%20typography%20space%2C%20professional%20coffee%20magazine%20style&width=1200&height=400&seq=blogHero&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Coffee Stories & More</h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            Discover the world of coffee through our curated articles, brewing guides, and community stories
          </p>
          <div className="flex items-center justify-center space-x-6 text-amber-200">
            <div className="flex items-center space-x-2">
              <i className="ri-article-line text-2xl"></i>
              <span className="text-lg">{blogPosts.length} Articles</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-user-line text-2xl"></i>
              <span className="text-lg">Expert Writers</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-heart-line text-2xl"></i>
              <span className="text-lg">Coffee Lovers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section ref={categoriesRef} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-amber-700 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-amber-50 hover:text-amber-700 shadow-sm hover:shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section ref={postsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <>
              {/* Featured Post */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Article</h2>
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                  <div className="md:flex">
                    <div className="md:w-1/2">
                      <img
                        src={filteredPosts[0].image}
                        alt={filteredPosts[0].title}
                        className="w-full h-64 md:h-full object-cover object-top"
                      />
                    </div>
                    <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                      <div className="mb-4">
                        <span className="bg-amber-700 text-white text-sm px-4 py-2 rounded-full font-medium">
                          {filteredPosts[0].category}
                        </span>
                      </div>
                      <h3 className="text-3xl font-bold text-gray-800 mb-4">
                        {filteredPosts[0].title}
                      </h3>
                      <p className="text-gray-600 mb-6 text-lg">
                        {filteredPosts[0].excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <i className="ri-user-line"></i>
                            <span>{filteredPosts[0].author}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <i className="ri-time-line"></i>
                            <span>{filteredPosts[0].readTime}</span>
                          </span>
                        </div>
                        <span className="flex items-center space-x-1">
                          <i className="ri-calendar-line"></i>
                          <span>{new Date(filteredPosts[0].date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </span>
                      </div>
                      <button className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors self-start">
                        Read Full Article
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Other Posts */}
              {filteredPosts.length > 1 && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">More Articles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.slice(1).map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <i className="ri-file-search-line text-6xl text-gray-400 mb-4"></i>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Articles Found</h3>
              <p className="text-gray-500">Try selecting a different category</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-amber-100 mb-8">
            Subscribe to our newsletter for the latest coffee tips, recipes, and stories
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-4 focus:ring-amber-300 text-sm"
              required
            />
            <button
              type="submit"
              className="bg-white text-amber-700 px-8 py-3 rounded-full font-medium hover:bg-amber-50 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Blog;
