import React, { useState, useEffect } from "react";
import { getAllOrders, updateOrderStatus as apiUpdateOrderStatus } from "../../api/admin";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await getAllOrders();
        const orders = res?.data?.orders || [];
        setOrders(orders);
      } catch (err) {
        console.error("Fetch orders error:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // GSAP Animation
    if (typeof window !== "undefined") {
      import("gsap").then(({ gsap }) => {
        gsap.fromTo(
          ".order-management-container",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
        gsap.fromTo(
          ".order-card",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.8, delay: 0.1, stagger: 0.1, ease: "power2.out" }
        );
      });
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "preparing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return "ri-check-line";
      case "preparing":
        return "ri-restaurant-line";
      case "shipped":
        return "ri-truck-line";
      case "delivered":
        return "ri-gift-line";
      case "cancelled":
        return "ri-close-line";
      default:
        return "ri-time-line";
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
      );
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders
    .filter((order) => {
      const customerName = `${order.first_name || ""} ${order.last_name || ""}`.trim();
      const matchesSearch =
        (order.order_number || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.email || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.created_at || b.createdAt) - new Date(a.created_at || a.createdAt);
        case "total":
          return (b.total_amount || 0) - (a.total_amount || 0);
        case "status":
          return (a.status || "").localeCompare(b.status || "");
        default:
          return 0;
      }
    });

  const orderStats = {
    total: safeOrders.length,
    confirmed: safeOrders.filter((o) => o.status === "confirmed").length,
    preparing: safeOrders.filter((o) => o.status === "preparing").length,
    shipped: safeOrders.filter((o) => o.status === "shipped").length,
    delivered: safeOrders.filter((o) => o.status === "delivered").length,
    cancelled: safeOrders.filter((o) => o.status === "cancelled").length,
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  return (
    <div className="order-management-container space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(orderStats).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg shadow-md p-4 text-center">
            <p
              className={`text-2xl font-bold ${key === "confirmed"
                ? "text-blue-600"
                : key === "preparing"
                  ? "text-yellow-600"
                  : key === "shipped"
                    ? "text-purple-600"
                    : key === "delivered"
                      ? "text-green-600"
                      : key === "cancelled"
                        ? "text-red-600"
                        : "text-gray-900"
                }`}
            >
              {value}
            </p>
            <p className="text-sm text-gray-600">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Order Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by Order ID, Customer Name, or Email..."
                className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            >
              <option value="date">Order Date</option>
              <option value="total">Order Total</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <i className="ri-shopping-cart-line text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="order-card border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.order_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {order.first_name} {order.last_name} <br />
                      📞 {order.contact_phone || "N/A"} <br />
                      📍 {order.delivery_address || "N/A"}
                    </p>
                  </div>

                  {/* Status dropdown on right */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">Update Status:</span>
                    <select
                      value={order.status || ""}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="confirmed">Confirmed</option>
                      <option value="preparing">Preparing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-gray-800">Items:</h4>
                  <ul className="list-disc list-inside text-gray-700 text-sm mt-2">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <li key={i}>
                          {item.product_name} × {item.quantity} — ₹{item.product_price}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No items found</li>
                    )}
                  </ul>
                </div>

                {/* Total */}
                <div className="mt-4 text-right">
                  <span className="text-md font-semibold text-gray-900">
                    Total: ₹{order.total_amount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
