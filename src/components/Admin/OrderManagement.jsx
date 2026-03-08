"use client";

import React, { useState } from "react";
import { FaBox, FaCheckCircle } from "react-icons/fa";
import { toast } from "sonner";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderManagement = ({ orderDetails = [] }) => {
  // Initialize state directly from props
  const [orders, setOrders] = useState(orderDetails?.orders);

  const handleStatusChange = async (orderID, newStatus) => {
    try {
      // Optimistic UI update
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderID ? { ...order, orderStatus: newStatus } : order,
        ),
      );

      // TODO: Replace with your backend API call
      // await fetch(`/api/admin/orders/${orderID}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) });

      toast.success("Order status updated");
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-500 mt-1">
            Track, update and manage customer orders
          </p>
        </div>
        <FaBox className="text-blue-600" size={26} />
      </div>

      {/* Orders Table */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Order</th>
              <th className="px-6 py-4 text-left">Customer ID</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="px-6 py-4 text-gray-700">
                    {order.userId?.slice(-6) || "N/A"}
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Rs. {order.totalPrice || 0}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[order.orderStatus] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>

                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleStatusChange(order._id, "Delivered")}
                      className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
                    >
                      <FaCheckCircle />
                      Deliver
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-10 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
