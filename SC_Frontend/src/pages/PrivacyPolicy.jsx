import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6 py-26">
        <h1 className="text-4xl font-bold text-center text-black mb-10">
          Privacy Policy
        </h1>

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Introduction
            </h2>
            <p className="text-black leading-relaxed">
              This Privacy Policy explains how we collect, use, and disclose
              information about you when you use our website and services.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Information We Collect
            </h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>
                <span className="font-semibold">Personal Information:</span>{" "}
                Includes your name, postal address, email address, and phone
                number.
              </li>
              <li>
                <span className="font-semibold">Non-Personal Information:</span>{" "}
                Information that does not directly identify you.
              </li>
              <li>
                <span className="font-semibold">Usage Details:</span> Such as
                IP address, device type, and browsing behavior.
              </li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>To present our website and its contents to you.</li>
              <li>To provide you with requested information, products, or services.</li>
              <li>To fulfill any other purpose for which you provide it.</li>
              <li>
                To carry out obligations and enforce rights arising from
                contracts, including billing and collection.
              </li>
            </ul>
          </section>

          {/* Disclosure of Your Information */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Disclosure of Your Information
            </h2>
            <ul className="list-disc list-inside text-black space-y-2">
              <li>To our subsidiaries and affiliates.</li>
              <li>To contractors, service providers, and partners supporting our business.</li>
              <li>To fulfill the purpose for which you provide it.</li>
              <li>For any other purpose disclosed when you provide information.</li>
              <li>With your consent.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Data Security
            </h2>
            <p className="text-black leading-relaxed">
              We implement measures to protect your personal information from
              unauthorized access, use, alteration, and disclosure. However,
              please note that no method of transmission over the Internet is
              completely secure.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Changes to Our Privacy Policy
            </h2>
            <p className="text-black leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page, and significant updates may also be
              notified on the homepage.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2 ">
              Contact Information
            </h2>
            <p className="text-black leading-relaxed">
              For questions or comments about this Privacy Policy, please{" "}
              <a
                href="/contact"
                className="text-orange-600 font-semibold hover:underline"
              >
                contact us
              </a>{" "}
              at [Your Contact Email Address].
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
