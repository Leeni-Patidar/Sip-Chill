import React from "react";

const ShippingAndDelivery = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6 py-26">
        <h1 className="text-4xl font-bold text-center text-black mb-10">
          Shipping & Delivery
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-6">
          <p className="text-black leading-relaxed">
            We aim to provide fast, reliable, and affordable delivery services
            to ensure your order reaches you safely and on time. Below are the
            details of our shipping and delivery policies:
          </p>

          <ul className="list-disc list-inside text-black space-y-2">
            <li>
              <span className="font-semibold">Shipping Costs & Methods:</span>{" "}
              Charges may vary based on location, delivery speed, and order
              value. Standard and express delivery options are available.
            </li>
            <li>
              <span className="font-semibold">Estimated Delivery Times:</span>{" "}
              Local orders are usually delivered within 30-50 minutes,
              whereas outstation deliveries may take 30-50 minutes.
            </li>
            <li>
              <span className="font-semibold">International Shipping:</span>{" "}
              Available in select regions with additional charges. Delivery
              timelines may vary depending on customs and local logistics.
            </li>
            <li>
              <span className="font-semibold">Order Tracking:</span> Once your
              order is shipped, you will receive a tracking ID via email or SMS
              to monitor your package in real time.
            </li>
            <li>
              <span className="font-semibold">Delays or Issues:</span> In case
              of unexpected delays, weather disruptions, or courier issues, our
              team will keep you informed and provide support.
            </li>
          </ul>

          <p className="text-black leading-relaxed">
            For any specific shipping or delivery-related queries, please{" "}
            <a
              href="/contact"
              className="text-orange-600 font-semibold hover:underline"
            >
              contact us
            </a>{" "}
            and our team will be happy to assist you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAndDelivery;
