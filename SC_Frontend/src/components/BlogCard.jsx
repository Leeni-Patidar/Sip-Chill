'use client';

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div ref={cardRef} className="group">
      {/* ✅ Use id instead of _id */}
      <Link to={`/blog/${post.id}`}>
        <article className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover object-top group-hover:scale-105 transition-transform duration-500"
            />

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-amber-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                {post.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-700 transition-colors line-clamp-2">
              {post.title}
            </h3>

            <p className="text-gray-600 mb-4 line-clamp-3">
              {post.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <i className="ri-user-line text-xs"></i>
                  <span>{post.author}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <i className="ri-time-line text-xs"></i>
                  <span>{post.readTime}</span>
                </span>
              </div>
              <span className="flex items-center space-x-1">
                <i className="ri-calendar-line text-xs"></i>
                <span>{formatDate(post.date)}</span>
              </span>
            </div>

            {/* Read More */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <span className="text-amber-700 font-medium group-hover:text-amber-800 transition-colors flex items-center space-x-1">
                <span>Read More</span>
                <i className="ri-arrow-right-line text-sm group-hover:translate-x-1 transition-transform"></i>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </div>
  );
};

export default BlogCard;
