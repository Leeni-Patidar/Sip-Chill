
import React from 'react';
import Layout from '../components/Layout';

const CancellationRefund = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>

        <div className="prose max-w-none">
          <h2>Cancellation Policy</h2>
          <p>
            You can cancel your order within [Number] hours of placing it, provided it has not already been shipped.
            To cancel your order, please contact our customer support team at [Email Address] or [Phone Number] with
            your order details.
          </p>
          <p>
            If your order has already been shipped, you will not be able to cancel it. In this case, please refer
            to our Return Policy.
          </p>

          <h2>Refund Policy</h2>
          <p>
            We aim to provide you with high-quality products and a positive shopping experience. If you are not
            entirely satisfied with your purchase, we offer refunds under the following conditions:
          </p>

          <h3>Eligible for Refund:</h3>
          <ul>
            <li>Defective or damaged products received.</li>
            <li>Incorrect items shipped.</li>
            <li>Products that do not match the description.</li>
          </ul>

          <h3>Not Eligible for Refund:</h3>
          <ul>
            <li>Products that have been used or altered.</li>
            <li>Products returned without original packaging and tags.</li>
            <li>Products purchased during a sale or promotion (unless defective).</li>
          </ul>

          <h3>Refund Process:</h3>
          <p>
            To request a refund, please contact our customer support team within [Number] days of receiving your
            order. Provide your order number and a detailed explanation of the reason for the refund request.
          </p>
          <p>
            Once your request is received and approved, we will provide instructions on how to return the item(s).
            You may be responsible for return shipping costs unless the return is due to our error.
          </p>
          <p>
            Upon receiving the returned item(s) and verifying their condition, we will process your refund.
            Refunds will be issued to the original payment method used for the purchase and may take [Number]
            business days to appear in your account, depending on your bank or payment provider.
          </p>

          <h3>Exchanges:</h3>
          <p>
            We do not offer direct exchanges. If you wish to exchange an item, please follow the refund process
            and place a new order for the desired item.
          </p>

          <p>
            If you have any questions about our Cancellation and Refund Policy, please do not hesitate to contact us.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CancellationRefund;