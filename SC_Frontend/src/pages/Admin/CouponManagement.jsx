import React, { useState, useEffect } from "react";
import { getAllCoupons, createCoupon, deleteCoupon } from "../../api/admin"; // You need to implement these API calls

const CouponManagement = ({ coupons, setCoupons }) => {
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    expiryDate: ""
  });

  // Fetch coupons on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const res = await getAllCoupons();
        if (res?.success && res.data) setCoupons(res.data);
      } catch (err) {
        console.error("Error fetching coupons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [setCoupons]);

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount || !newCoupon.expiryDate) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await createCoupon(newCoupon);
      if (res?.success) {
        setCoupons(prev => [res.data, ...prev]);
        setNewCoupon({ code: "", discount: "", expiryDate: "" });
      }
    } catch (err) {
      console.error("Error creating coupon:", err);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await deleteCoupon(id);
      if (res?.success) setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting coupon:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="admin-card bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Coupon</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Coupon Code"
            value={newCoupon.code}
            onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={newCoupon.discount}
            onChange={(e) => setNewCoupon({ ...newCoupon, discount: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="date"
            value={newCoupon.expiryDate}
            onChange={(e) => setNewCoupon({ ...newCoupon, expiryDate: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleAddCoupon}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
          >
            Add Coupon
          </button>
        </div>
      </div>

      <div className="admin-card bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">All Coupons</h2>
        {loading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Code</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Discount</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Expiry</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map(coupon => (
                  <tr key={coupon.id}>
                    <td className="px-4 py-2">{coupon.code}</td>
                    <td className="px-4 py-2">{coupon.discount}%</td>
                    <td className="px-4 py-2">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponManagement;
