import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { placeOrder } from "../api/orders";
import { getUserProfile } from "../api/users";
import { getCoupons } from "../api/coupons";
import { createRazorpayOrder, getRazorpayKey, verifyRazorpayPayment } from "../api/payment";

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
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = +(subtotal * 0.08).toFixed(2);
  const deliveryFee = subtotal >= 500 ? 0 : 49;
  const totalBeforeDiscount = +(subtotal + taxAmount + deliveryFee).toFixed(2);
  const finalTotal = +(totalBeforeDiscount - discount).toFixed(2);

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.data?.success) {
          setDeliveryAddress(res.data.data.address || "");
          setContactPhone(res.data.data.phone || "");
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    fetchProfile();
  }, []);

  // Fetch coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await getCoupons();
        if (res.data?.success) setCoupons(res.data.data || []);
      } catch (err) {
        console.error("Coupons fetch error:", err);
      }
    };
    fetchCoupons();
  }, []);

  const handleCouponSelect = (code) => {
    setCouponCode(code);
    const selected = coupons.find(c => c.code === code);
    if (selected) {
      setDiscount(
        selected.discount_type === "percentage"
          ? +(subtotal * selected.discount_value / 100).toFixed(2)
          : +selected.discount_value.toFixed(2)
      );
    } else setDiscount(0);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty");
    setLoading(true);

    const orderData = {
      cartItems: cartItems.map(i => ({
        product_id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        special_instructions: i.special_instructions || "",
      })),
      totalAmount: finalTotal,
      taxAmount,
      deliveryFee,
      paymentMethod,
      deliveryAddress,
      contactPhone,
      specialInstructions,
      couponCode: couponCode || null,
    };

    try {
      if (paymentMethod === "online") {
        const amountInPaise = Math.round(finalTotal * 100);
        const res = await createRazorpayOrder(amountInPaise);
        if (!res.success) throw new Error(res.message || "Failed to create Razorpay order");

        const isScriptLoaded = await loadRazorpayScript();
        if (!isScriptLoaded) throw new Error("Razorpay SDK failed to load");

        const keyData = await getRazorpayKey();
        if (!keyData.key) throw new Error("Failed to fetch Razorpay key");

        const options = {
          key: keyData.key,
          amount: res.amount,
          currency: "INR",
          name: "Sip-Chill",
          description: "Order Payment",
          order_id: res.id,
          handler: async function (response) {
            const verifyData = await verifyRazorpayPayment(response);

            if (verifyData.success) {
              orderData.razorpayPaymentId = response.razorpay_payment_id;
              orderData.razorpayOrderId = response.razorpay_order_id;
              orderData.razorpaySignature = response.razorpay_signature;

              const orderRes = await placeOrder(orderData);
              if (orderRes.success) {
                alert(`Order placed! Order No: ${orderRes.orderNumber}`);
                clearCart();
              } else {
                alert(orderRes.message || "Failed to place order");
              }
            } else {
              alert("Payment verification failed");
            }
          },
          prefill: { contact: contactPhone },
          theme: { color: "#F59E0B" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        const res = await placeOrder(orderData);
        if (res.success) {
          alert(`Order placed! Order No: ${res.orderNumber}`);
          clearCart();
        } else {
          alert(res.message || "Failed to place order");
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "Payment failed");
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            >
              <option value="online">Online</option>
              <option value="cash">Cash On Delivery</option>
            </select>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Apply Coupon</label>
            <select
              value={couponCode}
              onChange={(e) => handleCouponSelect(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-amber-600 focus:outline-none"
            >
              <option value="">Select a coupon</option>
              {coupons.map(c => (
                <option key={c.id} value={c.code}>
                  {c.code} — {c.discount_type === "percentage" ? `${c.discount_value}% off` : `₹${c.discount_value} off`}
                </option>
              ))}
            </select>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4 space-y-2 text-gray-700">
            <p className="flex justify-between"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Tax:</span><span>₹{taxAmount.toFixed(2)}</span></p>
            <p className="flex justify-between"><span>Delivery Fee:</span><span>₹{deliveryFee.toFixed(2)}</span></p>
            <p className="flex justify-between text-green-600"><span>Discount:</span><span>- ₹{discount.toFixed(2)}</span></p>
            <p className="flex justify-between font-semibold text-lg text-gray-900"><span>Total:</span><span>₹{finalTotal.toFixed(2)}</span></p>
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
