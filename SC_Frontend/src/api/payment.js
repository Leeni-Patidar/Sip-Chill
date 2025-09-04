// api/payment.js
const BACKEND_URL = "http://localhost:5002"; // replace with your backend port

export const createRazorpayOrder = async (amountInPaise) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payment/razorpay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountInPaise }),
    });

    if (!res.ok) {
      const text = await res.text(); // in case JSON is invalid
      throw new Error(`Server error: ${res.status} - ${text}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    return { success: false, message: err.message };
  }
};
