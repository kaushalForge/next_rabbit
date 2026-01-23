"use client";

import React from "react";
import { FaBox, FaCheckCircle, FaTruck, FaTimesCircle } from "react-icons/fa";

const orders = [
  {
    _id: 1234,
    user: { name: "John Doe" },
    totalPrice: 123,
    status: "Processing",
  },
];

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const handleStatusChange = (orderID, status) => {
  // console.log({ orderID, status });
};

const OrderManagement = () => {
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
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Total</th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.length ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order._id}
                  </td>

                  <td className="px-6 py-4 text-gray-700">{order.user.name}</td>

                  <td className="px-6 py-4 font-semibold text-gray-900">
                    Rs. {order.totalPrice}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500"
                      >
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
