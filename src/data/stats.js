"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { fetchProductsAdminAction } from "@/actions/adminProducts";
import { fetchOrdersAdminAction } from "@/actions/adminOrder";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const LOW_STOCK_THRESHOLD = 10; // total stock across all variants
const CRITICAL_STOCK_THRESHOLD = 5; // any single variant below this = critical

// ─────────────────────────────────────────────
// Product helpers
// (root product.stock is always 0 — useless)
// ─────────────────────────────────────────────

/**
 * Sum stock across every fashion/food variant.
 *
 * Fashion product: product.fashion[i].stock
 * Food product:    product.food[i].stock
 */
const getTotalStock = (p) =>
  (p.fashion || []).reduce((s, v) => s + (v.stock || 0), 0) +
  (p.food || []).reduce((s, v) => s + (v.stock || 0), 0);

/**
 * Lowest stock across all individual variants.
 * Useful for flagging a product as critical even when total stock is OK
 * (e.g. one colour is 0 while others are fine).
 */
const getMinVariantStock = (p) => {
  const variants = [
    ...(p.fashion || []).map((v) => v.stock ?? 0),
    ...(p.food || []).map((v) => v.stock ?? 0),
  ];
  return variants.length ? Math.min(...variants) : 0;
};

/**
 * Lowest offer price across all variants of a product.
 * fashion[i].offerPrice  /  food[i].offerPrice
 */
const getLowestOfferPrice = (p) => {
  const prices = [
    ...(p.fashion || []).map((v) => v.offerPrice ?? v.price ?? 0),
    ...(p.food || []).map((v) => v.offerPrice ?? v.price ?? 0),
  ].filter(Boolean);
  return prices.length ? Math.min(...prices) : 0;
};

/**
 * Highest price across all variants (for display on product cards).
 */
const getHighestPrice = (p) => {
  const prices = [
    ...(p.fashion || []).map((v) => v.price ?? 0),
    ...(p.food || []).map((v) => v.price ?? 0),
  ].filter(Boolean);
  return prices.length ? Math.max(...prices) : 0;
};

/**
 * Count total variants (separate SKU rows) for a product.
 */
const getVariantCount = (p) => (p.fashion || []).length + (p.food || []).length;

/**
 * Attach computed fields to a product so UI never re-derives them.
 * All display logic can read p._totalStock, p._minVariantStock, etc.
 */
const enrichProduct = (p) => ({
  ...p,
  _totalStock: getTotalStock(p),
  _minVariantStock: getMinVariantStock(p),
  _lowestPrice: getLowestOfferPrice(p),
  _highestPrice: getHighestPrice(p),
  _variantCount: getVariantCount(p),
});

// ─────────────────────────────────────────────
// Order helpers
// ─────────────────────────────────────────────

/**
 * Active shipments: order.shipments[]
 * Each shipment has: products[{ mainCategory, offerPrice, quantity, ... }]
 */
const extractActiveStats = (orders) => {
  let revenue = 0;
  let unitsSold = 0;
  let count = 0;
  const byCategory = {}; // { Fashion: { revenue, units }, Food: { ... } }

  orders.forEach((order) => {
    (order.shipments || []).forEach((shipment) => {
      count++;
      revenue += shipment.shipmentTotal || 0;

      (shipment.products || []).forEach((p) => {
        const qty = p.quantity || 0;
        const cat = p.mainCategory || "Other";
        unitsSold += qty;

        if (!byCategory[cat]) byCategory[cat] = { revenue: 0, units: 0 };
        byCategory[cat].revenue += (p.offerPrice || 0) * qty;
        byCategory[cat].units += qty;
      });
    });
  });

  return { activeCount: count, revenue, unitsSold, byCategory };
};

/**
 * Cancelled shipments: order.cancelledProducts[]
 * Same product shape as active shipments.
 *
 * REQUIRES the admin orders API route to include cancelledProducts[]
 * in its response — if missing, all cancelled stats return 0.
 */
const extractCancelledStats = (orders) => {
  let cancelledCount = 0;
  let cancelledRevenueLost = 0;
  const byCategory = {};

  orders.forEach((order) => {
    (order.cancelledProducts || []).forEach((shipment) => {
      cancelledCount++;
      cancelledRevenueLost += shipment.shipmentTotal || 0;

      (shipment.products || []).forEach((p) => {
        const qty = p.quantity || 0;
        const cat = p.mainCategory || "Other";
        if (!byCategory[cat]) byCategory[cat] = { revenue: 0, units: 0 };
        byCategory[cat].revenue += (p.offerPrice || 0) * qty;
        byCategory[cat].units += qty;
      });
    });
  });

  return {
    cancelledCount,
    cancelledRevenueLost,
    cancelledByCategory: byCategory,
  };
};

/**
 * 12-month chart data.
 * Uses shipment.createdAt if present, falls back to order.createdAt.
 */
const buildMonthlyData = (orders) => {
  const b = MONTHS.map((month) => ({
    month,
    revenue: 0,
    orders: 0,
    cancelledOrders: 0,
    units: 0,
  }));

  orders.forEach((order) => {
    (order.shipments || []).forEach((s) => {
      const idx = new Date(s.createdAt || order.createdAt).getMonth();
      if (isNaN(idx)) return;
      b[idx].revenue += s.shipmentTotal || 0;
      b[idx].orders += 1;
      b[idx].units += (s.products || []).reduce(
        (sum, p) => sum + (p.quantity || 0),
        0,
      );
    });

    (order.cancelledProducts || []).forEach((s) => {
      const idx = new Date(s.createdAt || order.createdAt).getMonth();
      if (isNaN(idx)) return;
      b[idx].cancelledOrders += 1;
    });
  });

  return b;
};

/**
 * Count shipment-level statuses — NOT order.orderStatus (unreliable).
 * Active shipments use their own .status field.
 * Cancelled shipments always count as Cancelled.
 */
const buildStatusCounts = (orders) => {
  const counts = {
    Pending: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };

  orders.forEach((order) => {
    (order.shipments || []).forEach((s) => {
      const key = s.status || "Pending";
      counts[key in counts ? key : "Pending"]++;
    });
    (order.cancelledProducts || []).forEach(() => {
      counts.Cancelled++;
    });
  });

  return counts;
};

// ─────────────────────────────────────────────
// Core stats builder
// ─────────────────────────────────────────────

export const computeAdminStats = (orders = [], products = []) => {
  // ── orders ──
  const {
    activeCount,
    revenue,
    unitsSold,
    byCategory: activeByCategory,
  } = extractActiveStats(orders);

  const { cancelledCount, cancelledRevenueLost, cancelledByCategory } =
    extractCancelledStats(orders);

  // merge active + cancelled category data
  const merged = { ...activeByCategory };
  Object.entries(cancelledByCategory).forEach(([cat, data]) => {
    if (!merged[cat]) merged[cat] = { revenue: 0, units: 0 };
    merged[cat].revenue += data.revenue;
    merged[cat].units += data.units;
  });
  const totalAllUnits = Object.values(merged).reduce((s, c) => s + c.units, 0);
  const categoryBreakdown = Object.entries(merged).map(([name, data]) => ({
    name,
    ...data,
    percentage:
      totalAllUnits > 0 ? Math.round((data.units / totalAllUnits) * 100) : 0,
  }));

  const statusCounts = buildStatusCounts(orders);
  const statusDistribution = Object.entries(statusCounts)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  const monthlyData = buildMonthlyData(orders);
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  // ── products ──
  // Enrich every product once — UI reads _totalStock, _minVariantStock, etc.
  const enriched = products.map(enrichProduct);

  const totalProducts = enriched.length;

  // Low stock: flag if ANY single variant is below threshold.
  // Previously checked _totalStock (sum of all variants) which meant
  // a product with variants [3, 200] would show 203 total and never
  // appear here. Now checks _minVariantStock so the variant at 3
  // correctly triggers the alert regardless of other variants.
  const lowStockProducts = enriched
    .filter((p) => p._minVariantStock < LOW_STOCK_THRESHOLD)
    .sort((a, b) => a._minVariantStock - b._minVariantStock);

  // Completely out of stock: every variant is 0
  const outOfStock = enriched.filter((p) => p._totalStock === 0);

  // Partial stock-out: at least one variant is 0 but others still have stock
  const variantOutOfStock = enriched.filter(
    (p) => p._minVariantStock === 0 && p._totalStock > 0,
  );

  // Critical: worst variant is between 1–4 (not zero, not enough)
  const criticalVariantProducts = enriched.filter(
    (p) =>
      p._minVariantStock > 0 && p._minVariantStock < CRITICAL_STOCK_THRESHOLD,
  );

  // Top stocked
  const topStockedProducts = [...enriched]
    .sort((a, b) => b._totalStock - a._totalStock)
    .slice(0, 5);

  // Product category split for pie chart: Fashion vs Food
  const productCategorySplit = enriched.reduce((acc, p) => {
    const cat = p.mainCategory || "Other";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});
  const productCategoryDistribution = Object.entries(productCategorySplit).map(
    ([name, value]) => ({ name, value }),
  );

  // Total inventory value (offerPrice × totalStock across all products)
  const totalInventoryValue = enriched.reduce(
    (sum, p) =>
      sum +
      (p.fashion || []).reduce(
        (s, v) => s + (v.offerPrice || 0) * (v.stock || 0),
        0,
      ) +
      (p.food || []).reduce(
        (s, v) => s + (v.offerPrice || 0) * (v.stock || 0),
        0,
      ),
    0,
  );

  return {
    // ── Order counts ──
    // totalOrders = every shipment ever placed (active + cancelled).
    // orders.length counts parent order documents — wrong, one doc can
    // have many shipments and a fully-cancelled order still counted as 1.
    totalOrders: orders.reduce(
      (sum, o) =>
        sum + (o.shipments?.length || 0) + (o.cancelledProducts?.length || 0),
      0,
    ),
    totalActiveShipments: activeCount, // shipments still active
    totalCancelledOrders: cancelledCount, // shipments that were cancelled

    // ── Revenue ──
    totalRevenue: revenue, // active shipments
    cancelledRevenueLost,

    // ── Units ──
    totalUnitsSold: unitsSold,

    // ── Status ──
    statusCounts, // { Pending, Processing, Shipped, Delivered, Cancelled }
    statusDistribution, // [{ name, value }] recharts-ready, zeros filtered

    // ── Charts ──
    monthlyData, // [{ month, revenue, orders, cancelledOrders, units }] × 12
    categoryBreakdown, // order products: [{ name, revenue, units, percentage }]

    // ── Products ──
    totalProducts,
    totalInventoryValue, // Rs. value of all stock on hand

    allProducts: enriched, // every product with _totalStock, _minVariantStock, etc.
    lowStockProducts, // _minVariantStock < 10, sorted asc
    outOfStock, // _totalStock === 0 (every variant gone)
    variantOutOfStock, // _minVariantStock === 0 but _totalStock > 0 (partial stock-out)
    criticalVariantProducts, // any variant < 5 but > 0
    topStockedProducts, // top 5 by _totalStock

    productCategoryDistribution, // [{ name: "Fashion", value: 4 }, { name: "Food", value: 1 }]

    // ── Table ──
    recentOrders,
  };
};

// ─────────────────────────────────────────────
// Data loaders
// ─────────────────────────────────────────────

export const fetchOrders = async () => {
  try {
    const data = await fetchOrdersAdminAction();
    return Array.isArray(data) ? data : (data?.orders ?? []);
  } catch (err) {
    console.error("fetchOrders:", err);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const data = await fetchProductsAdminAction();
    return Array.isArray(data) ? data : (data?.products ?? []);
  } catch (err) {
    console.error("fetchProducts:", err);
    return [];
  }
};

// ─────────────────────────────────────────────
// React hook
// ─────────────────────────────────────────────

export const useAdminStats = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersData, productsData] = await Promise.all([
        fetchOrders(),
        fetchProducts(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      console.error("useAdminStats loadData:", err);
      setError("Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const stats = useMemo(
    () => computeAdminStats(orders, products),
    [orders, products],
  );

  return { stats, orders, products, loading, error, refetch: loadData };
};
