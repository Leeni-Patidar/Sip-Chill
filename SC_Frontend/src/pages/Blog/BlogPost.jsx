import React, { useRef, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { blogPosts } from '../../context/mock-data';

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef(null);
  const contentRef = useRef(null);

  const post = blogPosts.find(p => String(p.id) === String(id));

  useEffect(() => {
    if (!post) {
      // Redirect if ID is invalid
      navigate('/blog', { replace: true });
    }
  }, [post, navigate]);

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

  if (!post) return null; // Navigation will handle redirect

  const relatedPosts = blogPosts
    .filter(p => String(p.id) !== String(id) && p.category === post.category)
    .slice(0, 3);

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
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <i className="ri-arrow-right-s-line"></i>
              <Link to="/blog" className="hover:text-white transition-colors">Blog</Link>
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
              {/* Existing category-based content stays unchanged */}
              {/* ... */}
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
                <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
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
            to="/blog"
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
