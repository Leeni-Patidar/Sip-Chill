'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ✅ Added
import BlogCard from '../../components/BlogCard';
import { blogPosts } from '../../context/mock-data';

// ... your blogPosts array stays the same ...

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
      {/* ... hero & categories stay unchanged ... */}

      {/* Blog Posts */}
      <section ref={postsRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <>
              {/* Featured Post */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Article</h2>
                {/* ✅ Link entire featured card */}
                <Link to={`/blog/${filteredPosts[0].id}`}>
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow cursor-pointer">
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
                        <span className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors self-start">
                          Read Full Article
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
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
    </div>
  );
};

export default Blog;
