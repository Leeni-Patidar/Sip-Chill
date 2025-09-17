const BACKEND_URL = "http://localhost:5002" || "https://sip-chill-1.onrender.com"; // replace with your backend port

// ✅ Get Razorpay Key
export const getRazorpayKey = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payment/razorpay-key`);
    if (!res.ok) throw new Error("Failed to fetch Razorpay key");
    return await res.json();
  } catch (err) {
    console.error("Fetch Razorpay key error:", err);
    return { key: null };
  }
};

// ✅ Create Razorpay Order
export const createRazorpayOrder = async (amountInPaise) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payment/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return { success: false, message: err.message };
  }
};

// ✅ Verify Razorpay Payment
export const verifyRazorpayPayment = async (paymentData) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    return await res.json();
  } catch (err) {
    console.error("Razorpay verification error:", err);
    return { success: false, message: err.message };
  }
};
