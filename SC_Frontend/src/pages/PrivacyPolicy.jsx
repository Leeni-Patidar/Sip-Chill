
import React from 'react';
import Layout from '../components/Layout'; // Assuming a Layout component for consistent structure

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose max-w-none"> {/* Using prose for basic typography styling, adjust as needed */}
          <h2>Introduction</h2>
          <p>
            This Privacy Policy explains how we collect, use, and disclose information about you when you use our website and services.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect several types of information from and about users of our Website, including:
          </p>
          <ul>
            <li>Personal Information: Information by which you may be personally identified, such as name, postal address, email address, telephone number.</li>
            <li>Non-Personal Information: Information that is about you but individually does not identify you.</li>
            <li>Usage Details: Information about your internet connection, the equipment you use to access our Website, and usage details.</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We use information that we collect about you or that you provide to us, including any personal information:
          </p>
          <ul>
            <li>To present our Website and its contents to you.</li>
            <li>To provide you with information, products, or services that you request from us.</li>
            <li>To fulfill any other purpose for which you provide it.</li>
            <li>To carry out our obligations and enforce our rights arising from any contracts entered into between you and us, including for billing and collection.</li>
          </ul>

          <h2>Disclosure of Your Information</h2>
          <p>
            We may disclose personal information that we collect or you provide:
          </p>
          <ul>
            <li>To our subsidiaries and affiliates.</li>
            <li>To contractors, service providers, and other third parties we use to support our business.</li>
            <li>To fulfill the purpose for which you provide it.</li>
            <li>For any other purpose disclosed by us when you provide the information.</li>
            <li>With your consent.</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We have implemented measures designed to secure your personal information from accidental loss and from unauthorized access, use, alteration, and disclosure.
          </p>

          <h2>Changes to Our Privacy Policy</h2>
          <p>
            It is our policy to post any changes we make to our privacy policy on this page. If we make material changes to how we treat our users' personal information, we will notify you through a notice on the Website home page.
          </p>

          <h2>Contact Information</h2>
          <p>
            To ask questions or comment about this privacy policy and our privacy practices, contact us at: [Your Contact Email Address]
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;