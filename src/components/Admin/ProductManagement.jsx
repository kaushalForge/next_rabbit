"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { deleteProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";

const ProductManagement = ({ products = [] }) => {
  let totalProducts = 0;
  let lowStockProducts = 0;
  let outOfStockProducts = 0;
  let topRatedProducts = 0;

  const getVariants = (product) => {
    const { food = [], fashion = [] } = product;
    return [...food, ...fashion];
  };

  if (Array.isArray(products) && products.length > 0) {
    products.forEach((product) => {
      totalProducts++;

      const variants = getVariants(product);

      variants.forEach((variant) => {
        const stock = Number(variant.stock) || 0;

        if (stock === 0) {
          outOfStockProducts++;
        } else if (stock > 0 && stock < 10) {
          lowStockProducts++;
        }
      });

      if (Number(product.rating) >= 4.5) {
        topRatedProducts++;
      }
    });
  }

  const stats = [
    { title: "Total Products", value: totalProducts },
    { title: "Low Stock Products", value: lowStockProducts },
    { title: "Out of Stock Products", value: outOfStockProducts },
    { title: "Top Rated Products", value: topRatedProducts },
  ];

  const handleProductDelete = async (productId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    try {
      const { status, message } = await deleteProductAction(productId);

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
          <h2 className="text-3xl font-bold text-gray-900">
            Product Management
          </h2>
          <p className="text-gray-500 mt-1">
            Track and manage products inventory
          </p>
        </div>
        <Link
          href="/admin/products/add-product"
          className="bg-black text-white px-5 py-2 rounded-full shadow hover:opacity-90 transition"
        >
          + New Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 pb-4">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500 mb-2">{stat.title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
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
                <th className="px-6 py-3 font-medium">Stock</th>
                <th className="px-6 py-3 font-medium text-center">Rating</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => {
                  const variants = getVariants(product);

                  return (
                    <tr
                      key={product._id}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                      style={{ height: "80px" }}
                    >
                      <td className="px-6 py-3">
                        <img
                          src={product.images?.[0]?.url || "/placeholder.png"}
                          alt={product.images?.[0]?.altText || product.name}
                          className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                        />
                      </td>

                      <td className="px-6 py-3 font-medium max-w-50 truncate">
                        {product.name.length > 20
                          ? product.name.slice(0, 20) + "..."
                          : product.name}
                      </td>

                      <td className="px-6 py-3">
                        {product.mainCategory || "Generic"}
                      </td>

                      {/* Stock Column (Per Variant) */}
                      <td className="px-6 py-3">
                        {variants.length === 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                            Out of Stock
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {variants.map((variant) => {
                              const stock = Number(variant.stock) || 0;

                              if (stock === 0) {
                                return (
                                  <span
                                    key={variant._id}
                                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600"
                                  >
                                    Out of Stock
                                  </span>
                                );
                              }

                              if (stock < 10) {
                                return (
                                  <span
                                    key={variant._id}
                                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600"
                                  >
                                    {stock} (Low Stock)
                                  </span>
                                );
                              }

                              return (
                                <span
                                  key={variant._id}
                                  className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                                >
                                  {stock}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-1">
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-400">
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
