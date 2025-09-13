import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ProductManagement from "./ProductManagement";
import OrderManagement from "./OrderManagement";
import CouponManagement from "./CouponManagement"; 
import { getDashboardStats, getAllOrders, getAllUsers } from "../../api/admin";
import { getAllProducts } from "../../api/products";
import { getAllCoupons } from "../../api/coupons";

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [adminProducts, setAdminProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, ordersRes, productsRes, usersRes, couponsRes] =
          await Promise.all([
            getDashboardStats(),
            getAllOrders({ page: 1, limit: 10 }),
            getAllProducts(),
            getAllUsers({ page: 1, limit: 20 }),
            getAllCoupons(), // ✅ fetch coupons
          ]);

        if (statsRes?.success && statsRes.data?.data) {
          setDashboardStats(statsRes.data.data.stats);
          setRecentOrders(statsRes.data.data.recent_orders || []);
        }

        if (ordersRes?.success)
          setOrders(ordersRes.data?.data?.orders || []);
        if (productsRes?.data) setAdminProducts(productsRes.data || []);

        if (usersRes?.success) {
          const userList =
            usersRes.users ||
            usersRes.data?.data?.users ||
            usersRes.data?.users ||
            [];

          const formattedUsers = userList.map((u) => {
            const displayName =
              u.name ||
              u.username ||
              `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
              (u.email ? u.email.split("@")[0] : "") ||
              "No Name";

            return {
              ...u,
              createdAt:
                u.createdAt ||
                u.created_at ||
                new Date().toISOString(),
              name: displayName,
            };
          });

          setUsers(formattedUsers);

          const sortedUsers = formattedUsers
            .slice()
            .sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

          setRecentUsers(sortedUsers.slice(0, 5));
        }

        // ✅ set coupons
        if (couponsRes?.success) {
          setCoupons(couponsRes.data || []);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate]);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeUsers = Array.isArray(users) ? users : [];

  const totalOrders = dashboardStats?.total_orders ?? safeOrders.length;
  const totalProducts =
    dashboardStats?.total_products ?? adminProducts.length;
  const totalUsers = dashboardStats?.total_users ?? safeUsers.length;

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-error-warning-line text-6xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
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
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user.name}</p>
            </div>
            <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
              Administrator
            </span>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: "overview", label: "Overview" },
              { key: "products", label: `Products (${totalProducts})` },
              { key: "orders", label: `Orders (${totalOrders})` },
              { key: "coupons", label: `Coupons (${coupons.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-white text-amber-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: "Total Users",
                  value: totalUsers,
                  icon: "ri-user-3-line",
                  bg: "bg-purple-100",
                  text: "text-purple-600",
                },
                {
                  title: "Total Products",
                  value: totalProducts,
                  icon: "ri-product-hunt-line",
                  bg: "bg-amber-100",
                  text: "text-amber-600",
                },
                {
                  title: "Total Orders",
                  value: totalOrders,
                  icon: "ri-shopping-cart-line",
                  bg: "bg-blue-100",
                  text: "text-blue-600",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="admin-card bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}
                  >
                    <i
                      className={`${stat.icon} ${stat.text} text-2xl`}
                    ></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders & New Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="admin-card bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Recent Orders
                </h2>
                <div className="space-y-4">
                  {(recentOrders || []).length > 0 ? (
                    recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            Order #{order.order_number}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{order.total_amount}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <i className="ri-shopping-cart-line text-4xl text-gray-300 mb-2"></i>
                      <p className="text-gray-500">No orders yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* New Users */}
              <div className="admin-card bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  New Registered Users
                </h2>
                <div className="space-y-4">
                  {(recentUsers || []).length > 0 ? (
                    recentUsers.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {u.name}
                          </h3>
                          <p className="text-sm text-gray-600">{u.email}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
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

        {activeTab === "products" && (
          <ProductManagement
            products={adminProducts}
            setProducts={setAdminProducts}
          />
        )}

        {activeTab === "orders" && <OrderManagement orders={orders} />}

        {activeTab === "coupons" && (
          <CouponManagement coupons={coupons} setCoupons={setCoupons} /> 
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
