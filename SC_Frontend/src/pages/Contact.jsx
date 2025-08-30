import React, { useRef, useEffect, useState } from 'react';
import { submitContactForm } from '../api/contact';
import { getUserProfile } from '../api/users';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const heroRef = useRef(null);
  const contactFormRef = useRef(null);
  const contactInfoRef = useRef(null);
  const mapRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

   //🔹 Prefill from user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.data.success) {
          const u = res.data.data;
          setFormData((prev) => ({
            ...prev,
            firstName: u.first_name || '',
            lastName: u.last_name || '',
            email: u.email || '',
            phone: u.phone || ''
          }));
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.warn('User not authenticated, skipping profile prefill.');
        } else {
          console.error('Error fetching profile:', err);
        }
      }
    };
    fetchProfile();
  }, []);

   //🔹 GSAP animations
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const { firstName, lastName, email, subject, message } = formData;
    const name = `${firstName} ${lastName}`.trim();
    if (!name || name.length < 2) {
      setError('Please enter your full name (at least 2 characters).');
      setLoading(false);
      return;
    }
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (!subject || subject.length < 5) {
      setError('Subject must be at least 5 characters.');
      setLoading(false);
      return;
    }
    if (!message || message.length < 10) {
      setError('Message must be at least 10 characters.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = { name, email, subject, message };
      const response = await submitContactForm(dataToSend);
      if (response.data.success) {
        setSuccessMessage("Thank you for your message! We'll get back to you soon.");
        setFormData((prev) => ({
          ...prev,
          subject: '',
          message: ''
        }));
      } else {
        setError(response.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white py-24 overflow-hidden"
        style={{
          backgroundImage: `url('https:readdy.ai/api/search-image?query=modern%20cafe%20interior&width=1200&height=400')`,
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
                    Come experience our cozy atmosphere, friendly staff, and exceptional coffee. We're more than just a café – we're your neighborhood gathering place.
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
                          <span className="text-sm text-gray-500">We'll reply within 24 hours</span>
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
              

                {/* Social Media */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors cursor-pointer">
                    <i className="ri-facebook-fill text-xl"></i>
                   </a>
                  <a href="#" className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition-colors cursor-pointer">
                      <i className="ri-instagram-line text-xl"></i>                  </a>
                    <a href="#" className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-colors cursor-pointer">
                      <i className="ri-twitter-fill text-xl"></i>
                    </a>
                  </div>
                </div>
             </div>
             </div>


            {/* Contact Form */}
            <div ref={contactFormRef}>
              <div className="bg-white p-8 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Have a question, feedback, or just want to say hello? We'd love to hear from you!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {loading && <div className="text-center text-amber-700">Sending message...</div>}
                  {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
                  {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded">{successMessage}</div>}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
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
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                        placeholder="Your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
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
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-700 focus:border-transparent text-sm"
                      placeholder="+91 (..........)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border rounded-xl"
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
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      maxLength={500}
                      className="w-full px-4 py-3 border rounded-xl resize-none"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-amber-800"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

