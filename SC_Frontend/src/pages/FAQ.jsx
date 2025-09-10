import React, { useState } from "react";

const faqs = [
  {
    question: "What are your café’s opening hours?",
    answer:
      "We are open from 11:00 AM to 11:00 PM from Monday to Sunday. Holiday hours may vary.",
  },
  {
    question: "Do you offer home delivery?",
    answer:
      "Yes, we offer home delivery through our website and food delivery partners. Delivery charges may apply depending on your location.",
  },
  {
    question: "How can I place an order online?",
    answer:
      "You can place an order directly from our website or mobile app. Simply browse the menu, add items to your cart, and checkout securely.",
  },
  {
    question: "Do you take table reservations?",
    answer:
      "Yes, you can reserve a table by calling us directly .",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit/debit cards, UPI, and popular digital wallets such as Google Pay and Paytm.",
  },
  {
    question: "Do you have vegetarian and vegan options?",
    answer:
      "Absolutely! Our menu includes a wide range of vegetarian and vegan dishes. Please check the menu for details.",
  },
  {
    question: "Are there gluten-free options available?",
    answer:
      "Yes, we do have gluten-free options. Please inform our staff while ordering so we can assist you better.",
  },
  {
    question: "Do you offer catering services?",
    answer:
      "Yes, we provide catering services for parties, corporate events, and special occasions. Contact us for customized packages.",
  },
  {
    question: "What is your return and refund policy?",
    answer:
      "We aim to provide the best experience. If you are unsatisfied with your order, please contact us immediately. Refunds are provided for incorrect or defective items as per our refund policy.",
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can reach us at hello@sipandchill.com or call us at +91-XXXXXXX888. Alternatively, visit our Contact Us page for assistance.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6 py-26">
        <h1 className="text-4xl font-bold text-center text-black mb-12">
          Frequently Asked Questions
        </h1>

        <div className="max-w-3xl mx-auto space-y-6">
  {faqs.map((faq, index) => (
    <div
      key={index}
      className="p-6 rounded-xl border border-gray-300 bg-white shadow-md cursor-pointer hover:bg-orange-50 transition"
      onClick={() => toggleFAQ(index)}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-lg md:text-xl font-semibold text-black">
          {faq.question}
        </h2>
        <span className="text-orange-600 text-2xl">
          {openIndex === index ? "−" : "+"}
        </span>
      </div>
      {openIndex === index && (
        <p className="mt-3 text-black leading-relaxed">{faq.answer}</p>
      )}
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default FAQ;
