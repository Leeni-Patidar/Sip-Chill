// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const { login, isLoading, error, isAuthenticated } = useAuth();
//   const navigate = useNavigate(); 
//   const [loginError, setLoginError] = useState(null);

//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/profile');
//     }
//   }, [isAuthenticated, navigate]);

//   useEffect(() => {
//     // GSAP Animation
//     if (typeof window !== 'undefined') {
//       import('gsap').then(({ gsap }) => {
//         gsap.fromTo('.login-container', 
//           { opacity: 0, y: 30 },
//           { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
//         );
//         gsap.fromTo('.login-form', 
//           { opacity: 0, y: 20 },
//           { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
//         );
//       });
//     }
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     if (loginError) setLoginError(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoginError(null); // Clear previous errors

//     const email = formData.email.trim();
//     const password = formData.password.trim();

//     try {
//       const { success, error } = await login(email, password);
//       if (success) {
//         navigate('/profile');
//       } else {
//         setLoginError(error || 'Invalid email or password. Please try again.');
//       }
//     } catch (err) {
//       console.error('Login failed:', err);
//       setLoginError('Login failed. Please try again.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8 pt-25">
//       <div className="login-container max-w-md mx-auto">
//         <div className="text-center mb-8">
//           <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
//             <i className="ri-cup-fill text-white text-2xl"></i>
//           </div>
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
//           <p className="text-gray-600">Sign in to your Sip & Chill account</p>
//         </div>

//         <div className="login-form bg-white rounded-2xl shadow-xl p-8">
//           {(error || loginError) && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-center">
//                 <i className="ri-error-warning-line text-red-500 mr-2"></i>
//                 <p className="text-red-700 text-sm">{error || loginError}</p>
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
//                   placeholder="Enter your email"
//                 />
//                 <i className="ri-mail-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
//                   placeholder="Enter your password"
//                 />
//                 <i className="ri-lock-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
//               className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? (
//                 <div className="flex items-center justify-center">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
//                   Signing In...
//                 </div>
//               ) : (
//                 'Sign In'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 pt-6 border-t border-gray-200">
//             <p className="text-center text-sm text-gray-600">
//               Don't have an account?{' '}
//               <Link 
//                 to="/register" 
//                 className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
//               >
//                 Create one here
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google'; // ✅ add this

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle, isLoading, error, isAuthenticated } = useAuth(); // ✅ added loginWithGoogle
  const navigate = useNavigate(); 
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // GSAP Animation
    if (typeof window !== 'undefined') {
      import('gsap').then(({ gsap }) => {
        gsap.fromTo('.login-container', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
        );
        gsap.fromTo('.login-form', 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
        );
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (loginError) setLoginError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(null);

    const email = formData.email.trim();
    const password = formData.password.trim();

    try {
      const { success, error } = await login(email, password);
      if (success) {
        navigate('/profile');
      } else {
        setLoginError(error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      setLoginError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8 pt-25">
      <div className="login-container max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-700 to-amber-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-cup-fill text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your Sip & Chill account</p>
        </div>

        <div className="login-form bg-white rounded-2xl shadow-xl p-8">
          {(error || loginError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <i className="ri-error-warning-line text-red-500 mr-2"></i>
                <p className="text-red-700 text-sm">{error || loginError}</p>
              </div>
            </div>
          )}

          {/* Email/password form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Enter your email"
                />
                <i className="ri-mail-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 pl-11 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                  placeholder="Enter your password"
                />
                <i className="ri-lock-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <i className={`ri-${showPassword ? 'eye-off' : 'eye'}-line`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.email.trim() || !formData.password.trim()}
              className="w-full bg-gradient-to-r from-amber-700 to-amber-800 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-800 hover:to-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Google login button */}
          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const token = credentialResponse.credential;
                  const { success, error } = await loginWithGoogle(token);
                  if (success) {
                    navigate('/profile');
                  } else {
                    setLoginError(error || 'Google login failed');
                  }
                } catch (err) {
                  console.error('Google login failed:', err);
                  setLoginError('Google login failed');
                }
              }}
              onError={() => {
                setLoginError('Google login failed. Try again.');
              }}
            />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-amber-700 hover:text-amber-800 transition-colors"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
