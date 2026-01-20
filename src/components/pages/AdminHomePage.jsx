"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/adminSlice";
import { FaMoneyBillWave, FaClipboardList, FaBoxOpen } from "react-icons/fa";

const orders = [
  {
    _id: 123,
    user: { name: "Kaushal" },
    totalPrice: 100,
    status: "Processing",
  },
  { _id: 124, user: { name: "Kaushal" }, totalPrice: 150, status: "Shipped" },
  { _id: 125, user: { name: "Kaushal" }, totalPrice: 200, status: "Delivered" },
  {
    _id: 126,
    user: { name: "Kaushal" },
    totalPrice: 120,
    status: "Processing",
  },
];

const statusStyles = {
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

const AdminHomePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const totalProducts = useSelector((state) => state.admin.totalProducts);

  return (
    <div className="w-full container mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Admin Dashboard
        </h1>
        <p className="text-gray-500">Overview of your store performance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue */}
        <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xl">
              <FaMoneyBillWave />
            </div>
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-semibold text-gray-800">$122</p>
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
              <FaClipboardList />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-800">12</p>
              <Link
                href="/admin/orders"
                className="text-sm text-blue-600 hover:underline"
              >
                Manage Orders →
              </Link>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-xl">
              <FaBoxOpen />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-800">
                {totalProducts}
              </p>
              <Link
                href="/admin/products"
                className="text-sm text-purple-600 hover:underline"
              >
                Manage Products →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4 font-medium">#{order._id}</td>
                    <td className="py-3 px-4">{order.user.name}</td>
                    <td className="py-3 px-4">${order.totalPrice}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No Recent Orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
