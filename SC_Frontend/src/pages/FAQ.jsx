import React from 'react';



const FAQ = () => {
  return (
 
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
        <div className="prose max-w-none">
          <div className="border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">What is your return policy?</h2>
            <p>Details about the return policy...</p>
          </div>
          <div className="border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">How can I track my order?</h2>
            <p>Details about order tracking...</p>
          </div>
          <div className="border-b border-gray-200 py-4">
            <h2 className="text-xl font-semibold mb-2">What payment methods do you accept?</h2>
            <p>Details about accepted payment methods...</p>
          </div>
          {/* Add more FAQ items as needed */}
        </div>
      </div>
    
  );
};

export default FAQ;