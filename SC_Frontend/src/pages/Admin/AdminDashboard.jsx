
import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import { getDashboardStats, getAllOrders, getAllUsers } from '../../api/admin';
import { getAllProducts } from '../../api/products';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [adminProducts, setAdminProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard stats for summary and recent orders/users
        const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
          getDashboardStats(),
          getAllOrders(),
          getAllProducts(),
          getAllUsers()
        ]);
        if (statsRes.data && statsRes.data.data) {
          setDashboardStats(statsRes.data.data.stats);
          setRecentOrders(statsRes.data.data.recent_orders || []);
          // Optionally, fetch recent users if available in stats
        }
  setOrders(ordersRes.data.orders || []);
  setAdminProducts(productsRes.data || []);
  const usersArr = (usersRes.data && usersRes.data.data && Array.isArray(usersRes.data.data.users)) ? usersRes.data.data.users : [];
  setUsers(usersArr);
  // For recent users, sort by createdAt (if available)
  const sortedUsers = usersArr.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  setRecentUsers(sortedUsers.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user, navigate]);

  // Safe Arrays
  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeUsers = Array.isArray(users) ? users : [];

  // Stats (prefer dashboardStats if available)
  const totalOrders = dashboardStats?.total_orders ?? safeOrders.length;
  const totalProducts = dashboardStats?.total_products ?? adminProducts.length;
  const totalUsers = dashboardStats?.total_users ?? safeUsers.length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-26 px-4 sm:px-6 lg:px-8">
      <div className="admin-container max-w-7xl mx-auto">
        {/* Header */}
        <div className="admin-card bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
              Administrator
            </span>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Products ({totalProducts})
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white text-amber-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders ({totalOrders})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="admin-card bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-3-line text-purple-600 text-2xl"></i>
                </div>
              </div>

              <div className="admin-card bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <i className="ri-product-hunt-line text-amber-600 text-2xl"></i>
                </div>
              </div>

              <div className="admin-card bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="ri-shopping-cart-line text-blue-600 text-2xl"></i>
                </div>
              </div>
            </div>

            {/* Recent Orders & New Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="admin-card bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {(recentOrders || []).map((order) => (
                    <div key={order._id || order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Order #{order.order_number || order._id || order.id}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{order.total_amount || order.total}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(recentOrders || []).length === 0 && (
                    <div className="text-center py-8">
                      <i className="ri-shopping-cart-line text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* New Users */}
              <div className="admin-card bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">New Registered Users</h2>
                <div className="space-y-4">
                  {(recentUsers || []).map((u) => (
                    <div key={u._id || u.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{u.name || `${u.first_name} ${u.last_name}`}</h3>
                        <p className="text-sm text-gray-600">{u.email}</p>
                      </div>
                      <p className="text-sm text-gray-500">{new Date(u.createdAt || u.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                  {(recentUsers || []).length === 0 && (
                    <div className="text-center py-8">
                      <i className="ri-user-line text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No users yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductManagement products={adminProducts} setProducts={setAdminProducts} />
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && <OrderManagement orders={orders} />}
      </div>
    </div>
  );
};

export default AdminDashboard;
