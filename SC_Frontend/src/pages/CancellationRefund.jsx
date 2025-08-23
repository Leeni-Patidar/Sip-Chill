import React from "react";


const CancellationRefund = () => {
  return (
    
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-10 py-20">
          <h1 className="text-4xl font-bold text-center text-black mb-10">
            Cancellation & Refund Policy
          </h1>

          {/* Cancellation Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2">
              Cancellation Policy
            </h2>
            <p className="text-black leading-relaxed mb-4">
              You can cancel your order within{" "}
              <span className="font-semibold">[Number] hours</span> of placing
              it, provided it has not already been shipped. To cancel your
              order, please contact our customer support team at{" "}
              <span className="font-semibold">[Email Address]</span> or{" "}
              <span className="font-semibold">[Phone Number]</span> with your
              order details.
            </p>
            <p className="text-black leading-relaxed">
              If your order has already been shipped, you will not be able to
              cancel it. In this case, please refer to our{" "}
              <span className="font-semibold">Return Policy</span>.
            </p>
          </section>

          {/* Refund Policy */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-black mb-4 pb-2">
              Refund Policy
            </h2>
            <p className="text-black leading-relaxed mb-6">
              We aim to provide you with high-quality products and a positive
              shopping experience. If you are not entirely satisfied with your
              purchase, we offer refunds under the following conditions:
            </p>

            <h3 className="text-xl font-semibold text-black mb-2">
              Eligible for Refund:
            </h3>
            <ul className="list-disc list-inside text-black mb-6 space-y-1">
              <li>Defective or damaged products received.</li>
              <li>Incorrect items shipped.</li>
              <li>Products that do not match the description.</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-2">
              Not Eligible for Refund:
            </h3>
            <ul className="list-disc list-inside text-black mb-6 space-y-1">
              <li>Products that have been used or altered.</li>
              <li>Products returned without original packaging and tags.</li>
              <li>
                Products purchased during a sale or promotion (unless defective).
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-2">
              Refund Process:
            </h3>
            <p className="text-black leading-relaxed mb-4">
              To request a refund, please contact our customer support team
              within <span className="font-semibold">[Number] days</span> of
              receiving your order. Provide your order number and a detailed
              explanation of the reason for the refund request.
            </p>
            <p className="text-black leading-relaxed mb-4">
              Once your request is received and approved, we will provide
              instructions on how to return the item(s). You may be responsible
              for return shipping costs unless the return is due to our error.
            </p>
            <p className="text-black leading-relaxed mb-4">
              Upon receiving the returned item(s) and verifying their condition,
              we will process your refund. Refunds will be issued to the
              original payment method and may take{" "}
              <span className="font-semibold">[Number] business days</span> to
              appear in your account, depending on your bank or payment
              provider.
            </p>

            <h3 className="text-xl font-semibold text-black mb-2">Exchanges:</h3>
            <p className="text-black leading-relaxed">
              We do not offer direct exchanges. If you wish to exchange an item,
              please follow the refund process and place a new order for the
              desired item.
            </p>
          </section>

          {/* Footer Note */}
          <div className="p-4 rounded-lg border mt-8 w-fit mx-auto">
            <p className="text-center text-black font-medium">
              If you have any questions about our{" "}
              <span className="font-semibold">Cancellation & Refund Policy</span>
              , please do not hesitate to{" "}
              <a
                href="/contact"
                className="text-orange-600 font-semibold hover:underline"
              >
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    
  );
};

export default CancellationRefund;
