"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { deleteProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";

const ProductManagement = ({ products = [] }) => {
  let totalProducts = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let topRatedProducts = 0;
  if (products.length > 0) {
    totalProducts = products.length;
    lowStockProducts = products.filter((p) => p.stock && p.stock < 10).length;
    outOfStockProducts = products.filter((p) => p.stock === 0).length;
    topRatedProducts = products.filter((p) => p.rating >= 4.5).length;
  }
  const stats = [
    { title: "Total Products", value: totalProducts, color: "text-green-600" },
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

  const handleProductDelete = async (productId) => {
    // Ask for confirmation first
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    try {
      const { status, message } = await deleteProductAction(productId);

      // Show toast based on status
      if (status === 200 || status === 201) {
        toast.success(message || "Product deleted successfully!");
      } else {
        toast.error(message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete product failed:", err);
      toast.error("An error occurred while deleting the product");
    }
  };
  return (
    <div className="flex container mx-auto flex-col w-full h-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Stocked Product</h2>
          <p className="text-gray-500 mt-1">
            Track and manage products inventory
          </p>
        </div>
        <button className="bg-black text-white px-5 py-2 rounded-full shadow hover:opacity-90 transition">
          <Link href="/admin/products/add-product"> + New Product</Link>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-4">
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
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="min-w-full bg-gray-50 shadow-sm rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 table-fixed">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Product Image</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium text-center">Rating</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                    style={{ height: "80px" }}
                  >
                    <td className="px-6 py-3 font-medium whitespace-nowrap">
                      <img
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.images?.[0]?.altText || product.name}
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                      />
                    </td>
                    <td className="px-6 py-3 font-medium whitespace-nowrap max-w-[200px] truncate">
                      {product.name.length > 20
                        ? product.name.slice(0, 20) + "..."
                        : product.name}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      {product.category || "Generic"}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Stock OK
                      </span>
                    </td>
                    <td className="px-6 py-3 font-semibold text-gray-900">
                      ${product.price}
                    </td>
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
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/edit/${product._id}`}
                          className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleProductDelete(product._id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                        >
                          Delete
                        </button>
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
    </div>
  );
};

export default ProductManagement;
