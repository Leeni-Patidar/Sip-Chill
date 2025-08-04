

import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Get order data from location state or localStorage
    const orderData = location.state?.order || JSON.parse(localStorage.getItem('lastOrder') || 'null');
    
    if (!orderData) {
      // If no order data, redirect to shop
      navigate('/shop');
      return;
    }

    setOrder(orderData);
    
    // Clear cart after successful order
    clearCart();
    
    // Clear last order from localStorage after displaying
    localStorage.removeItem('lastOrder');
  }, [location.state, navigate, clearCart]);

  useEffect(() => {
    // GSAP Animations
    if (typeof window !== 'undefined' && order) {
      import('gsap').then(({ gsap }) => {
        // Success icon animation
        gsap.fromTo('.success-icon', 
          { scale: 0, rotation: -180 },
          { scale: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
        );
        
        // Content fade in
        gsap.fromTo('.confirmation-content', 
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: 'power2.out' }
        );
        
        // Order details stagger
        gsap.fromTo('.order-detail', 
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, delay: 0.5, stagger: 0.1, ease: 'power2.out' }
        );
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="success-icon w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-3xl text-green-600"></i>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">Thank you for your order</p>
          <p className="text-gray-500">
            Order #{order.id} has been placed successfully
          </p>
        </div>

        {/* Order Details Card */}
        <div className="confirmation-content bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h2 className="text-2xl font-semibold">Order Summary</h2>
                <p className="text-amber-100">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-amber-100 text-sm">Order ID</p>
                <p className="text-xl font-semibold">#{order.id}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-8">
            <div className="order-detail mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="order-detail grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{order.customerInfo?.name || user?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{order.customerInfo?.phone || user?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{order.customerInfo?.email || user?.email}</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium mt-1">
                      {order.customerInfo?.address || user?.address || 'Address not provided'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 font-medium">Order Confirmed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Preparing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Out for Delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                    <span className="text-gray-500">Delivered</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="order-detail border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">₹{(order.total * 0.9).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium">₹{(order.total * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes:</span>
                  <span className="font-medium">₹{(order.total * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-amber-600">₹{order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="order-detail flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t">
              {isAuthenticated && (
                <Link
                  to="/profile"
                  className="flex-1 bg-amber-600 text-white text-center py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                >
                  View All Orders
                </Link>
              )}
              <Link
                to="/shop"
                className="flex-1 bg-gray-200 text-gray-800 text-center py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Support Info */}
            <div className="order-detail bg-amber-50 rounded-lg p-6 mt-6">
              <div className="flex items-start space-x-3">
                <i className="ri-customer-service-2-line text-amber-600 text-xl mt-1"></i>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Need Help?</h4>
                  <p className="text-gray-600 mb-2">
                    If you have any questions about your order, please don't hesitate to contact us.
                  </p>
                  <Link
                    to="/contact"
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Contact Support →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
