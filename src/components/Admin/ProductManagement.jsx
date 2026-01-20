"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/adminSlice";
import Link from "next/link";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";

const ProductManagement = ({ products = [] }) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter(
    (p) => p.stock && p.stock < 10,
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock === 0).length;
  const topRatedProducts = products.filter((p) => p.rating >= 4.5).length;

  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      color: "text-green-600",
    },
    {
      title: "Low Stock Products",
      value: lowStockProducts,
      color: "text-red-500",
    },
    {
      title: "Out of Stock Products",
      value: outOfStockProducts,
      color: "text-red-500",
    },
    {
      title: "Top Rated Products",
      value: topRatedProducts,
      color: "text-green-600",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    console.log("Delete product:", id);
  };

  return (
    <div className="h-auto container mx-auto w-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Stocked Product</h2>
          <p className="text-gray-500 mt-1">
            Track and manage products inventory
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full shadow hover:opacity-90 transition">
          + New Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Product Table */}

      <div className="relative overflow-x-auto bg-gray-50 shadow-sm rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-700">
          {/* Table Head */}
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-300">
            <tr>
              <th scope="col" className="px-6 py-3 font-medium">
                Product Image
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Product Name
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Category
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Status
              </th>
              <th scope="col" className="px-6 py-3 font-medium">
                Price
              </th>
              <th scope="col" className="px-6 py-3 font-medium text-center">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                  style={{ height: "80px" }}
                >
                  {/* Product Image */}
                  <td className="px-6 py-3 font-medium whitespace-nowrap">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.images?.[0]?.altText || product.name}
                      className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                    />
                  </td>

                  {/* Product Name */}
                  <td className="px-6 py-3 font-medium whitespace-nowrap max-w-[200px] truncate">
                    {product.name.length > 20
                      ? product.name.slice(0, 20) + "..."
                      : product.name}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    {product.category || "Generic"}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Stock OK
                    </span>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-3 font-semibold text-gray-900">
                    ${product.price}
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={
                            star <= Math.round(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-500">
                        ({product.rating})
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-end gap-3">
                      <a
                        href={`/edit/${product._id}`}
                        className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                      >
                        Edit
                      </a>
                      <a
                        href="#"
                        onClick={() => console.log("Delete", product._id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        Delete
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 text-gray-400">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
