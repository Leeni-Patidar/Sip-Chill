'use client';

import React, { useRef, useEffect } from 'react';

const CategoryCard = ({ category }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo(cardRef.current, 
          { opacity: 0, scale: 0.9 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.5,
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  }, []);

  return (
    <a href={`/shop?category=${category.id}`}>
      <div ref={cardRef} className="group cursor-pointer">
        <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-64 object-cover object-top group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Content */}
          <div className="absolute bottom-6 left-6 text-white">
            <h3 className="text-xl font-bold mb-1 group-hover:text-amber-300 transition-colors">
              {category.name}
            </h3>
            <p className="text-white/80 text-sm">
              {category.count} items
            </p>
          </div>

          {/* Arrow Icon */}
          <div className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <i className="ri-arrow-right-line text-white"></i>
          </div>
        </div>
      </div>
    </a>
  );
};

export default CategoryCard;
