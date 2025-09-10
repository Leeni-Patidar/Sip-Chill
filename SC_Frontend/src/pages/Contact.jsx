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
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 🔹 Track login status

  // Prefill from user profile
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
          setIsAuthenticated(true); // ✅ User is logged in
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          console.warn('User not authenticated.');
          setIsAuthenticated(false); // ❌ Not logged in
        } else {
          console.error('Error fetching profile:', err);
        }
      }
    };
    fetchProfile();
  }, []);

  // GSAP animations
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
    setError(null);
    setSuccessMessage(null);

    // 🔹 Block submission if user not logged in
    if (!isAuthenticated) {
      setError("Please login first to send us a message.");
      return;
    }

    setLoading(true);

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
      <section ref={heroRef} className="relative bg-gradient-to-r from-amber-900 to-amber-700 text-white py-24 overflow-hidden">
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
              {/* ... (your contact info cards stay the same) */}
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

                  {/* Form fields remain the same */}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-700 text-white py-4 px-6 rounded-xl font-semibold hover:bg-amber-800"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-sm text-gray-500 mt-4">
                      ⚠️ You must{" "}
                      <a href="/login" className="text-amber-700 font-semibold hover:underline">
                        login
                      </a>{" "}
                      before sending a message.
                    </p>
                  )}
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
