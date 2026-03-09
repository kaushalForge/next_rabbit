"use client";

import Link from "next/link";
import { FaStar } from "react-icons/fa";
import {
  TbPackage,
  TbAlertTriangle,
  TbCircleX,
  TbTrophy,
  TbCurrencyRupeeNepalese,
  TbRefresh,
} from "react-icons/tb";
import { deleteProductAction } from "@/actions/adminProducts";
import { toast } from "sonner";
import { useAdminStats } from "@/data/stats";

// ─────────────────────────────────────────────
// ProductManagement
// No longer receives products as a prop — fetches and computes
// everything through useAdminStats so stock figures are correct.
//
// Previous bugs fixed:
//   1. lowStockProducts / outOfStockProducts counted VARIANTS, not
//      products — one product with 3 low variants scored 3 instead of 1.
//   2. Stock threshold checked per-variant sum, not worst variant.
//      A product with variants [3, 200] showed 203 total and was never
//      flagged. Now uses _minVariantStock from stats.js.
//   3. topRatedProducts threshold was >= 4.5 but all ratings are
//      integers (3–5), so nothing ever qualified. Now >= 4.
// ─────────────────────────────────────────────

const ProductManagement = () => {
  const { stats, loading, error, refetch } = useAdminStats();

  const {
    totalProducts,
    totalInventoryValue,
    allProducts, // all products enriched with _totalStock, _minVariantStock, etc.
    lowStockProducts, // products where _minVariantStock < 10
    outOfStock, // products where _totalStock === 0
    variantOutOfStock, // products where one variant is 0 but others have stock
    criticalVariantProducts,
  } = stats;

  // Top rated: products with rating >= 4
  const topRatedCount = (allProducts || []).filter(
    (p) => Number(p.rating) >= 4,
  ).length;

  // Out of stock count = fully out + partial (any variant = 0)
  const outOfStockCount = outOfStock.length + variantOutOfStock.length;

  const statCards = [
    {
      title: "Total Products",
      value: totalProducts,
      sub: `Rs.${totalInventoryValue.toLocaleString()} inventory value`,
      icon: TbPackage,
      color: "text-violet-600 bg-violet-50",
      border: "border-violet-100",
    },
    {
      title: "Low Stock",
      value: lowStockProducts.length,
      // worst variant stock across all flagged products
      sub: lowStockProducts.length
        ? `Lowest: ${lowStockProducts[0]?._minVariantStock ?? 0} units`
        : "All variants stocked",
      icon: TbAlertTriangle,
      color: "text-amber-600 bg-amber-50",
      border: "border-amber-100",
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      sub: outOfStock.length
        ? `${outOfStock.length} fully · ${variantOutOfStock.length} partial`
        : variantOutOfStock.length
          ? `${variantOutOfStock.length} partial (1+ variant)`
          : "All products available",
      icon: TbCircleX,
      color: "text-rose-500 bg-rose-50",
      border: "border-rose-100",
    },
    {
      title: "Top Rated",
      value: topRatedCount,
      sub: `Rating ≥ 4 out of ${totalProducts}`,
      icon: TbTrophy,
      color: "text-emerald-600 bg-emerald-50",
      border: "border-emerald-100",
    },
  ];

  const handleProductDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      const { status, message } = await deleteProductAction(productId);
      if (status === 200 || status === 201) {
        toast.success(message || "Product deleted successfully!");
        refetch(); // refresh stats after deletion
      } else {
        toast.error(message || "Failed to delete product");
      }
    } catch (err) {
      console.error("Delete product failed:", err);
      toast.error("An error occurred while deleting the product");
    }
  };

  // ── loading ──
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Loading
          </p>
        </div>
      </div>
    );

  // ── error ──
  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <TbAlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <p className="text-sm font-bold text-zinc-700">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 mx-auto text-xs font-bold text-zinc-500 hover:text-zinc-900 transition"
          >
            <TbRefresh className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* ── Header ── */}
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

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4 pb-4">
        {statCards.map((s) => (
          <div
            key={s.title}
            className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm hover:shadow-md transition`}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-500">{s.title}</p>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}
              >
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{s.value}</h3>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">
              {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* ── Product Table ── */}
      <div className="flex-1 overflow-auto px-4 pb-4">
        <div className="min-w-full bg-gray-50 shadow-sm rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left text-gray-700 table-fixed">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">Image</th>
                <th className="px-6 py-3 font-medium">Product Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Stock per Variant</th>
                <th className="px-6 py-3 font-medium text-center">Rating</th>
                <th className="px-6 py-3 font-medium text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allProducts.length > 0 ? (
                allProducts.map((product) => {
                  const variants = [
                    ...(product.fashion || []),
                    ...(product.food || []),
                  ];

                  return (
                    <tr
                      key={product._id}
                      className="bg-white border-b border-gray-200 hover:bg-gray-50 transition"
                      style={{ height: "80px" }}
                    >
                      {/* Image */}
                      <td className="px-6 py-3">
                        <img
                          src={product.images?.[0]?.url || "/placeholder.png"}
                          alt={product.images?.[0]?.altText || product.name}
                          className="h-14 w-14 object-cover rounded-lg border border-gray-200"
                        />
                      </td>

                      {/* Name */}
                      <td className="px-6 py-3 font-medium">
                        <div className="max-w-[180px]">
                          <p className="truncate">{product.name}</p>
                          {/* Show inventory value for this product */}
                          <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-0.5">
                            <TbCurrencyRupeeNepalese className="w-3 h-3" />
                            {[
                              ...(product.fashion || []),
                              ...(product.food || []),
                            ]
                              .reduce(
                                (s, v) =>
                                  s + (v.offerPrice || 0) * (v.stock || 0),
                                0,
                              )
                              .toLocaleString()}{" "}
                            value · {product._variantCount} variants
                          </p>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-3">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-600">
                          {product.mainCategory || "Generic"}
                        </span>
                      </td>

                      {/* Stock per variant — uses real variant stock, not root product.stock */}
                      <td className="px-6 py-3">
                        {variants.length === 0 ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">
                            No variants
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {variants.map((variant) => {
                              const stock = Number(variant.stock) || 0;
                              const label =
                                stock === 0
                                  ? "Out"
                                  : stock < 10
                                    ? `${stock} low`
                                    : String(stock);
                              const cls =
                                stock === 0
                                  ? "bg-red-100 text-red-600"
                                  : stock < 10
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700";
                              return (
                                <span
                                  key={variant._id}
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${cls}`}
                                >
                                  {label}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-3">
                        <div className="flex items-center justify-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={12}
                              className={
                                star <= Math.round(product.rating)
                                  ? "text-yellow-400"
                                  : "text-gray-200"
                              }
                            />
                          ))}
                          <span className="ml-1.5 text-xs text-gray-400">
                            ({product.rating})
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/edit/${product._id}`}
                            className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition text-xs font-semibold"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleProductDelete(product._id)}
                            className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-xs font-semibold"
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
