

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { getOrderById } from '../api/orders';

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const { user, isAuthenticated } = useAuth();
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }
//     const fetchOrder = async () => {
//       try {
//         setLoading(true);
//         setError(null);
//         const response = await getOrderById(orderId);
//         setOrder(response.data);
//       } catch (err) {
//         setError('Order not found.');
//         setOrder(null);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrder();
//   }, [orderId, isAuthenticated, navigate]);

//   useEffect(() => {
//     // GSAP Animation
//     if (typeof window !== 'undefined' && order) {
//       import('gsap').then(({ gsap }) => {
//         gsap.fromTo('.order-details-container', 
//           { opacity: 0, y: 30 },
//           { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
//         );
//         gsap.fromTo('.order-section', 
//           { opacity: 0, x: -20 },
//           { opacity: 1, x: 0, duration: 0.8, delay: 0.1, stagger: 0.1, ease: 'power2.out' }
//         );
//       });
//     }
//   }, [order]);

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'preparing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
//       case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getStatusSteps = () => {
//     const steps = [
//       { key: 'confirmed', label: 'Order Confirmed', icon: 'ri-check-line' },
//       { key: 'preparing', label: 'Preparing', icon: 'ri-restaurant-line' },
//       { key: 'shipped', label: 'Out for Delivery', icon: 'ri-truck-line' },
//       { key: 'delivered', label: 'Delivered', icon: 'ri-gift-line' }
//     ];

//     const statusOrder = ['confirmed', 'preparing', 'shipped', 'delivered'];
//     const currentIndex = statusOrder.indexOf(order.status);

//     return steps.map((step, index) => ({
//       ...step,
//       completed: index <= currentIndex,
//       active: index === currentIndex
//     }));
//   };

//   const canUpdateStatus = () => {
//     return user?.role === 'admin' || user?.id === order?.userId;
//   };

//   const handleStatusUpdate = (newStatus) => {
//     if (canUpdateStatus()) {
//       updateOrderStatus(orderId, newStatus);
//       setOrder({ ...order, status: newStatus });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading order details...</p>
//         </div>
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
//         <div className="text-center">
//           <i className="ri-file-search-line text-6xl text-gray-400 mb-4"></i>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <Link
//             to="/profile"
//             className="inline-flex items-center px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//           >
//             <i className="ri-arrow-left-line mr-2"></i>
//             Back to Orders
//           </Link>
//         </div>
//       </div>
//     );
//   }
//   if (!order) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="order-details-container max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="order-section bg-white rounded-2xl shadow-xl p-8 mb-8">
//           <div className="flex items-center justify-between mb-6">
//             <div>
//               <div className="flex items-center space-x-4 mb-2">
//                 <Link
//                   to="/profile"
//                   className="text-amber-600 hover:text-amber-700 transition-colors"
//                 >
//                   <i className="ri-arrow-left-line text-xl"></i>
//                 </Link>
//                 <h1 className="text-3xl font-bold text-gray-900">Order #{order.id}</h1>
//               </div>
//               <p className="text-gray-600">
//                 Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric',
//                   hour: '2-digit',
//                   minute: '2-digit'
//                 })}
//               </p>
//             </div>
//             <div className="text-right">
//               <span className={`inline-block px-4 py-2 text-sm font-medium rounded-full border ${getStatusColor(order.status)}`}>
//                 {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//               </span>
//               <p className="text-2xl font-bold text-gray-900 mt-2">₹{order.total}</p>
//             </div>
//           </div>

//           {/* Order Status Timeline */}
//           <div className="bg-gray-50 rounded-lg p-6">
//             <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h3>
//             <div className="flex items-center justify-between">
//               {getStatusSteps().map((step, index) => (
//                 <div key={step.key} className="flex flex-col items-center flex-1">
//                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-3 ${
//                     step.completed 
//                       ? 'bg-green-500 border-green-500 text-white' 
//                       : step.active
//                       ? 'bg-amber-500 border-amber-500 text-white'
//                       : 'bg-gray-200 border-gray-300 text-gray-500'
//                   }`}>
//                     <i className={`${step.icon} text-lg`}></i>
//                   </div>
//                   <span className={`text-sm font-medium text-center ${
//                     step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
//                   }`}>
//                     {step.label}
//                   </span>
//                   {index < getStatusSteps().length - 1 && (
//                     <div className={`flex-1 h-0.5 mt-6 ${
//                       step.completed ? 'bg-green-500' : 'bg-gray-300'
//                     }`} style={{
//                       position: 'absolute',
//                       left: '50%',
//                       width: '100%',
//                       transform: 'translateX(25%)',
//                       zIndex: -1
//                     }}></div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Admin Status Update */}
//           {user?.role === 'admin' && (
//             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//               <h4 className="font-semibold text-blue-900 mb-3">Update Order Status</h4>
//               <div className="flex space-x-2">
//                 {['confirmed', 'preparing', 'shipped', 'delivered'].map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => handleStatusUpdate(status)}
//                     className={`px-3 py-1 text-sm rounded ${
//                       order.status === status
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
//                     }`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Order Items */}
//           <div className="order-section bg-white rounded-2xl shadow-xl p-8">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Items Ordered</h2>
//             <div className="space-y-4">
//               {order.items?.map((item, index) => (
//                 <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
//                   <img
//                     src={item.image}
//                     alt={item.name}
//                     className="w-16 h-16 object-cover rounded-lg"
//                   />
//                   <div className="flex-1">
//                     <h3 className="font-medium text-gray-900">{item.name}</h3>
//                     <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Price Breakdown */}
//             <div className="mt-6 pt-6 border-t space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal:</span>
//                 <span className="font-medium">₹{(order.total * 0.9).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Delivery Fee:</span>
//                 <span className="font-medium">₹{(order.total * 0.05).toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Taxes:</span>
//                 <span className="font-medium">₹{(order.total * 0.05).toFixed(2)}</span>
//               </div>
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between">
//                   <span className="text-lg font-semibold text-gray-900">Total:</span>
//                   <span className="text-lg font-bold text-amber-600">₹{order.total}</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Customer & Delivery Info */}
//           <div className="space-y-8">
//             <div className="order-section bg-white rounded-2xl shadow-xl p-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Information</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
//                   <p className="text-gray-900">{order.customerInfo?.name || user?.name}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
//                   <p className="text-gray-900">{order.customerInfo?.email || user?.email}</p>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
//                   <p className="text-gray-900">{order.customerInfo?.phone || user?.phone || 'Not provided'}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="order-section bg-white rounded-2xl shadow-xl p-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Delivery Address</h2>
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <p className="text-gray-900">
//                   {order.customerInfo?.address || user?.address || 'Address not provided'}
//                 </p>
//               </div>
//             </div>

//             <div className="order-section bg-white rounded-2xl shadow-xl p-8">
//               <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <span className="font-medium">Cash on Delivery</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Payment Status:</span>
//                   <span className={`px-2 py-1 text-xs font-medium rounded ${
//                     order.status === 'delivered' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {order.status === 'delivered' ? 'Paid' : 'Pending'}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="order-section bg-white rounded-2xl shadow-xl p-8 mt-8">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Link
//               to="/contact"
//               className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//             >
//               <i className="ri-customer-service-2-line mr-2"></i>
//               Contact Support
//             </Link>
//             <Link
//               to="/shop"
//               className="flex-1 bg-amber-600 text-white text-center py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
//             >
//               <i className="ri-shopping-bag-line mr-2"></i>
//               Order Again
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetails;
