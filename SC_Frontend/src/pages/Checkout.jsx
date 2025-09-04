import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orders";
import { getUserProfile } from "../api/users";
import { getCoupons } from "../api/coupons";

const Checkout = () => {
  const { items: cartItems = [], clearCart } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = +(subtotal * 0.08).toFixed(2);
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const totalBeforeDiscount = +(subtotal + tax + deliveryFee).toFixed(2);
  const finalTotal = +(totalBeforeDiscount - discount).toFixed(2);

  // Fetch profile data (address + phone)
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await getUserProfile();
        if (res.success) {
          setDeliveryAddress(res.data.address || "");
          setContactPhone(res.data.phone || "");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    }
    fetchProfile();
  }, []);

  // Fetch coupons from DB
  useEffect(() => {
    async function fetchCoupons() {
      try {
        const res = await getCoupons();
        if (res.success) {
          setCoupons(res.data);
        }
      } catch (err) {
        console.error("Coupons fetch error:", err);
      }
    }
    fetchCoupons();
  }, []);

  // Apply coupon discount
  const handleCouponSelect = (code) => {
    setCouponCode(code);

    const selected = coupons.find((c) => c.code === code);
    if (selected) {
      if (selected.discount_type === "percentage") {
        setDiscount((subtotal * selected.discount_value) / 100);
      } else {
        setDiscount(selected.discount_value);
      }
    } else {
      setDiscount(0);
    }
  };

  // Place order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");

    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
          special_instructions: i.special_instructions || "",
          product_name: i.name,
          product_price: i.price,
        })),
        delivery_address: deliveryAddress,
        contact_phone: contactPhone,
        payment_method: paymentMethod,
        special_instructions: specialInstructions,
        coupon_code: couponCode || null,
        tax_amount: tax,
        delivery_fee: deliveryFee,
        discount_amount: discount,
        total_amount: finalTotal,
      };

      const res = await placeOrder(orderData);
      if (res.success) {
        alert("Order placed! Order No: " + res.data.order_number);
        clearCart();
      } else {
        alert(res.message || "Failed to place order");
      }
    } catch (err) {
      console.error("Place order error:", err);
      alert("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">Checkout</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Address
            </label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              rows={3}
              placeholder="Enter your delivery address"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            >
              {/* <option value="cash">Cash</option> */}
              <option value="card">Card</option>
              <option value="online">Online</option>
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Instructions
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
              rows={2}
              placeholder="Add any notes for your order"
            />
          </div>

          {/* Coupon Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apply Coupon
            </label>
            <select
              value={couponCode}
              onChange={(e) => handleCouponSelect(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            >
              <option value="">Select a coupon</option>
              {coupons.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.code} —{" "}
                  {c.discount_type === "percentage"
                    ? `${c.discount_value}% off`
                    : `₹${c.discount_value} off`}
                </option>
              ))}
            </select>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2 text-gray-700">
            <p className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Tax:</span>
              <span>₹{tax.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </p>
            <p className="flex justify-between text-green-600">
              <span>Discount:</span>
              <span>- ₹{discount.toFixed(2)}</span>
            </p>
            <p className="flex justify-between font-semibold text-lg text-gray-900">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </p>
          </div>

          {/* Place Order */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-amber-700 text-white py-3 rounded-full font-medium hover:bg-amber-800 transition-colors"
          >
            {loading ? "Placing order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
