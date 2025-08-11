import React from 'react';
import Layout from '../components/Layout';

function FAQ() {
  return (
    <Layout>
      <div className="container  pt-20 mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
        <div className="faq-container">
          {/* FAQ items will go here */}
          <div className="faq-item border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">What is your return policy?</h2>
            <p className="text-gray-700">Details about the return policy...</p>
          </div>
          <div className="faq-item border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">How can I track my order?</h2>
            <p className="text-gray-700">Details about order tracking...</p>
          </div>
          <div className="faq-item border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">What payment methods do you accept?</h2>
            <p className="text-gray-700">Details about accepted payment methods...</p>
          </div>
          {/* Add more FAQ items as needed */}
        </div>
      </div>
    </Layout>
  );
}

export default FAQ;