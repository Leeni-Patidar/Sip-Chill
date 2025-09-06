// [import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getOrderById } from "../api/orders";

// const OrderConfirmation = () => {
//   const { id } = useParams(); // order ID from route
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await getOrderById(id);
//         if (res.success) {
//           setOrder(res.data);
//         } else {
//           alert(res.message || "Order not found");
//         }
//       } catch (err) {
//         console.error("Fetch order error:", err);
//         alert("Error fetching order details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [id]);

//   if (loading) return <p className="text-center mt-8">Loading order...</p>;
//   if (!order) return <p className="text-center mt-8">Order not found</p>;

//   // Calculate subtotal, tax, delivery fee, discount
//   const subtotal = order.items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);
//   const tax = +(subtotal * 0.08).toFixed(2);
//   const deliveryFee = subtotal >= 25 ? 0 : 3.99;
//   const totalBeforeDiscount = +(subtotal + tax + deliveryFee).toFixed(2);
//   const discount = totalBeforeDiscount - order.total_amount;
//   const finalTotal = +order.total_amount.toFixed(2);

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-semibold mb-4">Order Confirmation</h1>
//       <p className="mb-2">Order Number: <span className="font-medium">{order.order_number}</span></p>
//       <p className="mb-2">Status: <span className="font-medium capitalize">{order.status}</span></p>
//       <p className="mb-4">Placed by: <span className="font-medium">{order.first_name} {order.last_name}</span></p>

//       <div className="mb-4 border-t pt-4">
//         <h2 className="font-semibold mb-2">Items</h2>
//         <ul>
//           {order.items.map(item => (
//             <li key={item.id} className="mb-2 flex justify-between">
//               <span>{item.product_name} x {item.quantity}</span>
//               <span>${(item.product_price * item.quantity).toFixed(2)}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="mb-4 border-t pt-4">
//         <p>Subtotal: ${subtotal.toFixed(2)}</p>
//         <p>Tax: ${tax.toFixed(2)}</p>
//         <p>Delivery Fee: ${deliveryFee.toFixed(2)}</p>
//         {discount > 0 && <p>Discount: -${discount.toFixed(2)}</p>}
//         <p className="font-semibold">Total Paid: ${finalTotal.toFixed(2)}</p>
//       </div>

//       <div className="mb-4 border-t pt-4">
//         <h2 className="font-semibold mb-2">Delivery Details</h2>
//         <p>Address: {order.delivery_address}</p>
//         <p>Phone: {order.contact_phone}</p>
//         {order.special_instructions && <p>Special Instructions: {order.special_instructions}</p>}
//       </div>

//       <div className="mt-4">
//         <p>Thank you for your order! Your order will be processed shortly.</p>
//       </div>
//     </div>
//   );
// };

// export default OrderConfirmation;
