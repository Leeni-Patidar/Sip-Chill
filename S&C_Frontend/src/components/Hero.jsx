'use client';

import React, { useRef, useEffect } from 'react';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonsRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        const tl = gsap.timeline({ delay: 0.5 });

        tl.fromTo(titleRef.current, 
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo(subtitleRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(buttonsRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
      });
    }
  }, []);

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url('https://readdy.ai/api/search-image?query=Cozy%20coffee%20shop%20interior%20with%20warm%20brown%20wooden%20furniture%2C%20soft%20ambient%20lighting%2C%20coffee%20beans%20scattered%20on%20rustic%20table%2C%20steam%20rising%20from%20coffee%20cups%2C%20comfortable%20seating%20area%2C%20inviting%20atmosphere%2C%20cream%20and%20brown%20color%20palette%2C%20modern%20caf%C3%A9%20design&width=1920&height=1080&seq=hero-bg&orientation=landscape')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full text-center lg:text-left lg:w-1/2">
          <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="font-['Pacifico'] text-amber-300">Sip & Chill</span>
          </h1>

          <p ref={subtitleRef} className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
            Discover the perfect blend of premium coffee, delicious pastries, and cozy atmosphere. 
            Your neighborhood café where every sip tells a story.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="/shop"
              className="bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              Shop Now
            </a>
            <a
              href="/menu"
              className="bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
            >
              View Menu
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60">
        <div className="flex flex-col items-center animate-bounce">
          <span className="text-sm mb-2">Scroll to explore</span>
          <i className="ri-arrow-down-line text-xl"></i>
        </div>
      </div>
    </div>
  );
};

export default Hero;
