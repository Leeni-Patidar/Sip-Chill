import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6 py-26">
        <h1 className="text-4xl font-bold text-center text-black mb-10">
          Terms & Conditions
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-black leading-relaxed">
              Welcome to our café. By accessing or using our website, mobile
              app, or services, you agree to comply with the following Terms &
              Conditions. Please read them carefully before placing any order or
              using our services.
            </p>
          </section>

          {/* Use of Services */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Use of Services
            </h2>
            <p className="text-black leading-relaxed">
              You must be at least 18 years old to place an order. By using our
              services, you agree not to misuse them in any way, including but
              not limited to fraudulent orders, unauthorized payments, or
              violation of applicable laws.
            </p>
          </section>

          {/* Orders & Payments */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Orders & Payments
            </h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>
                Orders are confirmed only after successful payment or
                acknowledgment.
              </li>
              <li>
                Prices are subject to change without prior notice, but you will
                always be charged the amount displayed at checkout.
              </li>
              <li>
                We accept multiple payment methods including cards, UPI, and
                digital wallets.
              </li>
            </ul>
          </section>

          {/* Cancellations & Refunds */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Cancellations & Refunds
            </h2>
            <p className="text-black leading-relaxed">
              Cancellation and refund requests are governed by our{" "}
              <a
                href="/cancellation-refund"
                className="text-orange-600 font-semibold hover:underline"
              >
                Cancellation & Refund Policy
              </a>
              . Please refer to it for more details.
            </p>
          </section>

          {/* Delivery Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Delivery Policy
            </h2>
            <p className="text-black leading-relaxed">
              Deliveries are subject to availability and may vary based on
              location. For more information, please read our{" "}
              <a
                href="/shipping-delivery"
                className="text-orange-600 font-semibold hover:underline"
              >
                Shipping & Delivery Policy
              </a>
              .
            </p>
          </section>

          {/* Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Limitation of Liability
            </h2>
            <p className="text-black leading-relaxed">
              While we strive to provide high-quality products and services, we
              are not liable for any indirect, incidental, or consequential
              damages that may arise from using our services.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Changes to Terms
            </h2>
            <p className="text-black leading-relaxed">
              We reserve the right to update or modify these Terms &
              Conditions at any time. Changes will be effective immediately
              upon posting on this page.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Contact Us
            </h2>
            <p className="text-black leading-relaxed">
              If you have any questions about our Terms & Conditions, please{" "}
              <a
                href="/contact"
                className="text-orange-600 font-semibold hover:underline"
              >
                contact us
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
