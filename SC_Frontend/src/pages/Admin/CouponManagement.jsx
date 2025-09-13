import React, { useEffect, useState } from "react";
import {
  getAllCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../api/coupons";

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    code: "",
    discount_value: "",
    valid_until: "",
    description: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch coupons on mount
  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      const res = await getAllCoupons();
      if (res.success) setCoupons(res.data);
      else alert(res.message);
      setLoading(false);
    };
    fetchCoupons();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discount_value) {
      alert("Code and discount are required");
      return;
    }

    let res;
    if (editingId) {
      res = await updateCoupon(editingId, form);
    } else {
      res = await createCoupon(form);
    }

    if (res.success) {
      if (editingId) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === editingId ? res.data : c))
        );
      } else {
        setCoupons((prev) => [res.data, ...prev]);
      }
      setForm({
        code: "",
        discount_value: "",
        valid_until: "",
        description: "",
        is_active: true,
      });
      setEditingId(null);
    } else {
      alert(res.message);
    }
  };

  // Delete coupon
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    const res = await deleteCoupon(id);
    if (res.success) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } else {
      alert(res.message);
    }
  };

  // Edit coupon
  const handleEdit = (coupon) => {
    setForm({
      code: coupon.code,
      discount_value: coupon.discount_value,
      valid_until: coupon.valid_until
        ? coupon.valid_until.split("T")[0]
        : "",
      description: coupon.description || "",
      is_active: coupon.is_active,
    });
    setEditingId(coupon.id);
  };

  return (
    <div className="space-y-6">
      {/* Coupon Form */}
      <div className="admin-card bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {editingId ? "Edit Coupon" : "Add New Coupon"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="code"
            placeholder="Coupon Code"
            value={form.code}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            name="discount_value"
            placeholder="Discount (%)"
            value={form.discount_value}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="date"
            name="valid_until"
            value={form.valid_until}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <div className="flex items-center justify-between space-x-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="rounded"
              />
              <span>Active</span>
            </label>
            <button
              type="submit"
              className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
            >
              {editingId ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>

      {/* Coupons Table */}
      <div className="admin-card bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Coupons
        </h2>
        {loading ? (
          <p>Loading coupons...</p>
        ) : coupons.length === 0 ? (
          <p>No coupons available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Code</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Discount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Valid Until</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{c.code}</td>
                    <td className="px-4 py-2">{c.discount_value}%</td>
                    <td className="px-4 py-2">
                      {c.valid_until
                        ? new Date(c.valid_until).toLocaleDateString()
                        : "No expiry"}
                    </td>
                    <td className="px-4 py-2">{c.description || "-"}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          c.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleEdit(c)}
                        className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="bg-amber-400 text-white px-4 py-2 rounded-lg hover:bg-amber-500"
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
