import React, { useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogPosts } from '../../context/mock-data';

const BlogPost = () => {
  const { id } = useParams();
  const articleRef = useRef(null);
  const contentRef = useRef(null);

  const post = blogPosts.find(p => p.id === id);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        const tl = gsap.timeline();

        tl.fromTo(articleRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        );
      });
    }
  }, []);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            to="/blog"
            className="bg-amber-700 text-white px-8 py-3 rounded-full font-medium hover:bg-amber-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const relatedPosts = blogPosts.filter(p => p.id !== id && p.category === post.category).slice(0, 3);

  return (
 <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section 
        ref={articleRef}
        className="relative py-24 overflow-hidden"
        style={{
          backgroundImage: `url('${post.image}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <div className="flex items-center space-x-2 text-white/80 text-sm">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <i className="ri-arrow-right-s-line"></i>
              <span className="text-white">{post.title}</span>
            </div>
          </nav>

          <div className="text-white">
            <div className="mb-4">
              <span className="bg-amber-700 text-white text-sm px-4 py-2 rounded-full font-medium">
                {post.category}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between text-white/80">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <i className="ri-user-line"></i>
                  <span>By {post.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="ri-time-line"></i>
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <i className="ri-calendar-line"></i>
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section ref={contentRef} className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
            <article className="prose prose-lg prose-amber max-w-none">
              {/* Article content based on category */}
              {post.category === 'Coffee Guide' && (
                <div>
                  <h2>Introduction to Perfect Coffee Brewing</h2>
                  <p>Coffee brewing is both an art and a science. The perfect cup requires attention to detail, quality ingredients, and proper technique. In this comprehensive guide, we'll explore the fundamentals of coffee brewing that every coffee enthusiast should know.</p>
                  
                  <h3>Choosing the Right Beans</h3>
                  <p>The foundation of great coffee starts with selecting high-quality beans. Look for freshly roasted beans with a roast date within two weeks of purchase. Single-origin beans offer unique flavor profiles that reflect their growing region, while blends provide consistency and balance.</p>
                  
                  <h3>Grinding Techniques</h3>
                  <p>Grinding your beans just before brewing ensures maximum freshness and flavor extraction. Different brewing methods require different grind sizes - from coarse for French press to fine for espresso. Invest in a quality burr grinder for consistent results.</p>
                  
                  <h3>Water Quality and Temperature</h3>
                  <p>Water makes up 98% of your coffee, so quality matters. Use filtered water heated to 195-205°F (90-96°C) for optimal extraction. Too hot, and you'll over-extract bitter compounds; too cool, and you'll under-extract, resulting in sour, weak coffee.</p>
                  
                  <h3>Brewing Methods</h3>
                  <p>Each brewing method offers a different experience. Pour-over methods like V60 and Chemex highlight clarity and brightness, while immersion methods like French press emphasize body and richness. Experiment to find your preferred style.</p>
                  
                  <h3>Timing and Ratios</h3>
                  <p>A good starting ratio is 1:15 to 1:17 (coffee to water). Adjust based on your taste preferences. Brewing time varies by method - 4 minutes for French press, 2-3 minutes for pour-over, and 25-30 seconds for espresso.</p>
                </div>
              )}

              {post.category === 'Sustainability' && (
                <div>
                  <h2>The Importance of Sustainable Coffee</h2>
                  <p>Coffee is one of the world's most traded commodities, affecting millions of farmers and their communities. Understanding the impact of our coffee choices helps us make decisions that support both quality and sustainability.</p>
                  
                  <h3>What is Fair Trade Coffee?</h3>
                  <p>Fair Trade certification ensures farmers receive fair prices for their crops, promoting sustainable farming practices and community development. This system helps small-scale farmers compete in the global market while maintaining environmental standards.</p>
                  
                  <h3>Environmental Impact</h3>
                  <p>Sustainable coffee farming practices protect biodiversity, prevent soil erosion, and reduce water usage. Shade-grown coffee preserves forest habitats, while organic farming eliminates harmful pesticides and chemicals.</p>
                  
                  <h3>Supporting Coffee Communities</h3>
                  <p>By choosing ethically sourced coffee, we support education programs, healthcare initiatives, and infrastructure development in coffee-growing regions. This investment creates lasting positive change for farming communities.</p>
                  
                  <h3>How to Choose Sustainable Coffee</h3>
                  <p>Look for certifications like Fair Trade, Rainforest Alliance, or Direct Trade. Research roasters who maintain transparent relationships with farmers and prioritize sustainable sourcing practices.</p>
                </div>
              )}

              {post.category === 'Menu' && (
                <div>
                  <h2>Winter Menu Highlights at Sip & Chill</h2>
                  <p>As temperatures drop, we've crafted a special winter menu featuring warming spices, rich flavors, and comfort drinks that capture the essence of the season. Each item is carefully designed to provide comfort and satisfaction during the colder months.</p>
                  
                  <h3>Seasonal Spice Lattes</h3>
                  <p>Our winter spice collection includes cinnamon cardamom lattes, vanilla chai blends, and our signature winter warming spice mix. These drinks combine traditional coffee with aromatic spices that have been used for centuries to provide warmth and comfort.</p>
                  
                  <h3>Hot Chocolate Variations</h3>
                  <p>From classic rich chocolate to unique flavors like salted caramel and peppermint, our hot chocolate menu offers indulgent options for chocolate lovers. Each is made with premium cocoa and fresh ingredients.</p>
                  
                  <h3>Warming Pastries and Treats</h3>
                  <p>Complement your warm beverages with our selection of freshly baked pastries, including cinnamon rolls, apple turnovers, and seasonal cookies. These treats are baked fresh daily using traditional recipes and high-quality ingredients.</p>
                  
                  <h3>Limited Edition Winter Specials</h3>
                  <p>Our winter specials feature unique flavor combinations available only during the season. Try our maple bourbon coffee, gingerbread latte, or winter berry smoothie for something truly special.</p>
                </div>
              )}

              {post.category === 'Health' && (
                <div>
                  <h2>Coffee and Health: Separating Facts from Fiction</h2>
                  <p>Coffee consumption has been the subject of numerous studies over the decades. Current research reveals that moderate coffee consumption can be part of a healthy lifestyle, offering several potential benefits when consumed responsibly.</p>
                  
                  <h3>Antioxidant Properties</h3>
                  <p>Coffee is rich in antioxidants, which help protect cells from damage caused by free radicals. These compounds may contribute to reduced inflammation and lower risk of certain chronic diseases.</p>
                  
                  <h3>Cognitive Benefits</h3>
                  <p>Caffeine can improve focus, alertness, and cognitive performance. Regular moderate consumption may also be associated with reduced risk of neurodegenerative diseases, though more research is needed.</p>
                  
                  <h3>Common Myths Debunked</h3>
                  <p>Contrary to popular belief, moderate coffee consumption doesn't cause dehydration or significantly affect blood pressure in regular drinkers. The key is moderation - typically 3-4 cups per day for most healthy adults.</p>
                  
                  <h3>Individual Considerations</h3>
                  <p>Coffee affects everyone differently. Factors like genetics, tolerance, and existing health conditions influence how your body processes caffeine. Listen to your body and consult healthcare providers if you have concerns.</p>
                </div>
              )}

              {/* Default content for other categories */}
              {!['Coffee Guide', 'Sustainability', 'Menu', 'Health'].includes(post.category) && (
                <div>
                  <h2>Exploring {post.category}</h2>
                  <p>{post.excerpt}</p>
                  
                  <p>At Sip & Chill, we're passionate about sharing knowledge and stories that enhance your coffee experience. Whether you're a seasoned coffee enthusiast or just beginning your journey, we believe every cup tells a story worth sharing.</p>
                  
                  <p>This article delves deep into the fascinating world of coffee, exploring traditions, techniques, and the people who make exceptional coffee possible. From farm to cup, every step matters in creating the perfect coffee experience.</p>
                  
                  <p>We invite you to join us on this journey of discovery, whether through our carefully curated articles, hands-on workshops, or simply enjoying a thoughtfully prepared cup at our café. Coffee is more than a beverage - it's a connection to communities, cultures, and moments of daily joy.</p>
                  
                  <p>Stay tuned for more insights, tips, and stories from our team of coffee experts and passionate baristas.</p>
                </div>
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.id}`}>
                  <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover object-top"
                    />
                    <div className="p-6">
                      <div className="mb-3">
                        <span className="bg-amber-700 text-white text-xs px-3 py-1 rounded-full font-medium">
                          {relatedPost.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-amber-700 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span>{relatedPost.author}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back to Blog */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-amber-800 transition-colors whitespace-nowrap cursor-pointer"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to All Articles
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
