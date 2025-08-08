'use client';

import React, { useRef, useEffect } from 'react';

const Contact = () => {
  const heroRef = useRef(null);
  const contactFormRef = useRef(null);
  const contactInfoRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        const tl = gsap.timeline();

        tl.fromTo(heroRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        )
        .fromTo(contactInfoRef.current,
          { opacity: 0, x: -50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.5'
        )
        .fromTo(contactFormRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.8'
        )
        .fromTo(mapRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          '-=0.3'
        );
      });
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! We'll get back to you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white py-24 overflow-hidden"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=modern%20cafe%20interior%20with%20comfortable%20seating%20area%2C%20warm%20lighting%2C%20contact%20us%20concept%2C%20people%20having%20conversations%20over%20coffee&width=1200&height=400&seq=contactHero&orientation=landscape')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/90 to-amber-700/90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Get In Touch</h1>
          <p className="text-xl md:text-2xl text-amber-100 mb-8 max-w-3xl mx-auto">
            We'd love to hear from you. Drop by for a coffee or send us a message!
          </p>
          <div className="flex items-center justify-center space-x-8 text-amber-200">
            <div className="flex items-center space-x-2">
              <i className="ri-time-line text-2xl"></i>
              <span className="text-lg">Open Daily</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-phone-line text-2xl"></i>
              <span className="text-lg">Quick Response</span>
            </div>
            <div className="flex items-center space-x-2">
              <i className="ri-map-pin-line text-2xl"></i>
              <span className="text-lg">Central Location</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div ref={contactInfoRef} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Visit Our Café</h2>
                <p className="text-gray-600 text-lg mb-8">
                  Come experience our cozy atmosphere, friendly staff, and exceptional coffee. We\'re more than just a café – we\'re your neighborhood gathering place.
                </p>
              </div>

              {/* Contact Cards */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-map-pin-fill text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Location</h3>
                      <p className="text-gray-600">
                        123 Coffee Street<br />
                        Bean City, BC 12345<br />
                        Near Central Park
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-phone-fill text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Phone</h3>
                      <p className="text-gray-600">
                        <a href="tel:15551234567" className="hover:text-amber-700 transition-colors">
                          (555) 123-4567
                        </a><br />
                        <span className="text-sm text-gray-500">Available during business hours</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-mail-fill text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:hello@sipandchill.com" className="hover:text-amber-700 transition-colors">
                          hello@sipandchill.com
                        </a><br />
                        <span className="text-sm text-gray-500">We\'ll reply within 24 hours</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <i className="ri-time-fill text-white text-xl"></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p><strong>Monday - Friday:</strong> 7:00 AM - 9:00 PM</p>
                        <p><strong>Saturday - Sunday:</strong> 8:00 AM - 10:00 PM</p>
                        <p className="text-sm text-gray-500">Extended hours on weekends</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                    <i className="ri-facebook-fill text-xl"></i>
                  </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors cursor-pointer">
                    <i className="ri-instagram-line text-xl"></i>
                  </a>
                  <a href="#" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors cursor-pointer">
                    <i className="ri-twitter-fill text-xl"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div ref={contactFormRef}>
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Have a question, feedback, or just want to say hello? We\'d love to hear from you!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                        placeholder="Your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select 
                      name="subject" 
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm pr-8"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="feedback">Feedback</option>
                      <option value="catering">Catering Services</option>
                      <option value="events">Private Events</option>
                      <option value="partnership">Partnership</option>
                      <option value="complaint">Complaint</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      maxLength={500}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent resize-none text-sm"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                    <p className="text-xs text-gray-500 mt-1">Maximum 500 characters</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-amber-800 transition-colors focus:ring-4 focus:ring-amber-300 whitespace-nowrap cursor-pointer"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Map Section */}
      {/* <section ref={mapRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us</h2>
            <p className="text-gray-600 text-lg">
              Located in the heart of Bean City, just minutes from downtown
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="h-96">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74844827932764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af15f27691%3A0x5ddf09db3fcaa147!2s123%20Coffee%20St%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1703123456789!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <div className="p-6 bg-gradient-to-r from-amber-700 to-amber-900 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Sip & Chill Café</h3>
                  <p className="text-amber-100">123 Coffee Street, Bean City, BC 12345</p>
                </div>
                <a
                  href="https://maps.google.com/?q=123CoffeeStreet,BeanCity,BC12345"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-amber-700 px-6 py-3 rounded-full font-medium hover:bg-amber-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        </div>
      </section> */}

       {/* Quick Contact CTA */}
      <section className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions?</h2>
          <p className="text-xl text-amber-100 mb-8">
            Call us directly or stop by – we\'re always happy to chat over coffee!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:15551234567"
              className="bg-white text-amber-700 px-8 py-4 rounded-full font-semibold hover:bg-amber-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-phone-fill mr-2"></i>
              Call Now
            </a>
            <a
              href="mailto:hello@sipandchill.com"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-amber-700 transition-colors whitespace-nowrap cursor-pointer"
            >
              <i className="ri-mail-fill mr-2"></i>
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
