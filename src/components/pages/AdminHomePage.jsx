"use client";

import Link from "next/link";
import Image from "next/image";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TbCurrencyRupeeNepalese,
  TbShoppingBag,
  TbPackage,
  TbLoader,
  TbChartBar,
  TbTruckDelivery,
  TbCircleCheck,
  TbCircleX,
  TbClockHour4,
  TbAlertTriangle,
  TbTag,
  TbArrowNarrowRight,
  TbActivity,
} from "react-icons/tb";
import { useAdminStats } from "@/data/stats";
import { Spinner } from "../ui/spinner";

const STATUS_CFG = {
  Pending: {
    dot: "#f59e0b",
    pill: "bg-amber-50 text-amber-600 ring-amber-200",
  },
  Processing: {
    dot: "#f97316",
    pill: "bg-orange-50 text-orange-600 ring-orange-200",
  },
  Shipped: { dot: "#3b82f6", pill: "bg-blue-50 text-blue-600 ring-blue-200" },
  Delivered: {
    dot: "#10b981",
    pill: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  },
  Cancelled: { dot: "#f43f5e", pill: "bg-rose-50 text-rose-500 ring-rose-200" },
};

const compact = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `${(n / 1_000).toFixed(1)}K`
      : String(n ?? 0);

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── Micro-components ──────────────────────────────────────────────

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border border-zinc-200 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const CardHead = ({ title, sub, right }) => (
  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </p>
      {sub && <p className="text-[11px] mt-0.5">{sub}</p>}
    </div>
    {right}
  </div>
);

const ViewAll = ({ href }) => (
  <Link
    href={href}
    className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest hover:text-zinc-800 transition-colors"
  >
    View all <TbArrowNarrowRight className="w-3.5 h-3.5" />
  </Link>
);

const StatusPill = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wide ring-1 ${cfg.pill}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      {status || "Pending"}
    </span>
  );
};

const ChartTip = ({ active, payload, label, unit = "Rs." }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 rounded-xl px-3 py-2 shadow-2xl">
      <p className="text-[10px] font-medium mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-[13px] font-medium text-white">
          {unit}
          {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────
// AdminHomePage
// ─────────────────────────────────────────────
const AdminHomePage = () => {
  // FIX #1: useAdminStats takes no arguments — it fetches internally.
  // Old code passed `orders` from useAdmin which caused double-fetch.
  const { stats, orders, loading, error } = useAdminStats();

  const {
    totalOrders,
    totalProducts,
    totalRevenue,
    totalUnitsSold,
    totalCancelledOrders,
    cancelledRevenueLost,
    statusCounts,
    statusDistribution,
    monthlyData,
    lowStockProducts,
    topStockedProducts,
    recentOrders,
    totalInventoryValue,
    productCategoryDistribution,
  } = stats;

  const kpis = {
    revenue: totalRevenue,
    sold: totalUnitsSold,
    pending: statusCounts.Pending ?? 0,
    processing: statusCounts.Processing ?? 0,
    shipped: statusCounts.Shipped ?? 0,
    delivered: statusCounts.Delivered ?? 0,
    cancelled: statusCounts.Cancelled ?? 0,
  };

  // total shipments (active + cancelled) — used for % in donut legend
  const totalShipments =
    (statusCounts.Pending ?? 0) +
    (statusCounts.Processing ?? 0) +
    (statusCounts.Shipped ?? 0) +
    (statusCounts.Delivered ?? 0) +
    (statusCounts.Cancelled ?? 0);

  const lowStock = lowStockProducts.slice(0, 6);
  const topProds = topStockedProducts;
  const recent = recentOrders;

  // ── loading / error ──
  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
        <Spinner className="w-14 h-14 text-primary" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <TbAlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
          <p className="text-sm font-medium text-zinc-700">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.35em] mb-1">
              RabbitHub · Admin Console
            </p>
            <h1 className="text-[22px] font-medium tracking-tight leading-none">
              Store Dashboard
            </h1>
          </div>
          <p className="hidden sm:block text-[10px] font-medium uppercase tracking-widest">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* ══ KPI cards ══ */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: "Total Revenue",
              value: `Rs.${compact(kpis.revenue)}`,
              sub: `Rs.${compact(cancelledRevenueLost)} lost to cancellations`,
              icon: TbCurrencyRupeeNepalese,
              accent: "from-cyan-800 to-gray-600",
              href: null,
            },
            {
              label: "Total Orders",
              value: totalOrders,
              sub: `${kpis.pending} pending · ${totalCancelledOrders} cancelled`,
              icon: TbShoppingBag,
              accent: "from-orange-800 to-blue-600",
              href: "/admin/orders",
            },
            {
              label: "Products in Store",
              value: totalProducts,
              sub: lowStock.length
                ? `${lowStock.length} low stock`
                : "All stocked",
              icon: TbPackage,
              accent: "from-emerald-800 to-teal-600",
              href: "/admin/products",
            },
            {
              label: "Inventory Value",
              value: `Rs.${compact(totalInventoryValue)}`,
              sub: `${compact(totalUnitsSold)} units sold`,
              icon: TbChartBar,
              accent: "from-emerald-800 to-orange-600",
              href: null,
            },
          ].map(({ label, value, sub, icon: Icon, accent, href }) => (
            <div
              key={label}
              // FIX #4: was `bg-linear-to-br` which is not a valid Tailwind class
              className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${accent} p-5 flex flex-col justify-between gap-6 shadow-sm`}
            >
              <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                {href && (
                  <Link
                    href={href}
                    className="flex items-center gap-0.5 text-[10px] font-medium text-white/60 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Manage <TbArrowNarrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/60 mb-1">
                  {label}
                </p>
                <p className="text-[26px] font-medium text-white leading-none tracking-tight">
                  {value}
                </p>
                <p className="text-[11px] text-white/50 mt-1 font-medium">
                  {sub}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ══ Secondary status tiles ══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Pending",
              count: kpis.pending,
              icon: TbClockHour4,
              cls: "text-amber-500 bg-amber-50",
              border: "border-amber-100",
            },
            {
              label: "Processing",
              count: kpis.processing,
              icon: TbLoader,
              cls: "text-teal-500 bg-teal-50",
              border: "border-teal-100",
            },
            {
              label: "Shipped",
              count: kpis.shipped,
              icon: TbTruckDelivery,
              cls: "text-blue-500 bg-blue-50",
              border: "border-blue-100",
            },
            {
              label: "Delivered",
              count: kpis.delivered,
              icon: TbCircleCheck,
              cls: "text-emerald-500 bg-emerald-50",
              border: "border-emerald-100",
            },
            {
              label: "Cancelled",
              count: kpis.cancelled,
              icon: TbCircleX,
              cls: "text-rose-500 bg-rose-50",
              border: "border-rose-100",
            },
          ].map(({ label, count, icon: Icon, cls, border }) => (
            <div
              key={label}
              className={`flex items-center gap-3 bg-white rounded-2xl border ${border} px-4 py-3.5`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cls}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.18em]">
                  {label}
                </p>
                <p className="text-xl font-medium leading-none mt-0.5">
                  {count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ══ Charts row ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Revenue area */}
          <Card className="lg:col-span-2">
            <CardHead
              title="Revenue · 12 months"
              sub="Active shipment revenue only"
              right={<TbActivity className="w-4 h-4 text-zinc-300" />}
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#18181b"
                        stopOpacity={0.15}
                      />
                      <stop offset="100%" stopColor="#18181b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => compact(v)}
                  />
                  <Tooltip content={<ChartTip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#18181b"
                    strokeWidth={2.5}
                    fill="url(#rg)"
                    dot={false}
                    activeDot={{ r: 5, fill: "#18181b", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Status donut */}
          <Card>
            <CardHead title="Order Status" sub="By individual shipments" />
            <div className="p-5">
              {statusDistribution.length ? (
                <>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={68}
                        dataKey="value"
                        stroke="none"
                      >
                        {statusDistribution.map((e) => (
                          <Cell
                            key={e.name}
                            fill={STATUS_CFG[e.name]?.dot ?? "#a1a1aa"}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTip unit="" />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-2 mt-3">
                    {statusDistribution.map((e) => (
                      <div
                        key={e.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              backgroundColor:
                                STATUS_CFG[e.name]?.dot ?? "#a1a1aa",
                            }}
                          />
                          <span className="text-[11px] font-medium text-zinc-600">
                            {e.name}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-zinc-800">
                          {e.value}
                          {/* FIX #5: was dividing by orders.length (order documents = 2)
                              not total shipments (3). Now uses totalShipments. */}
                          <span className="font-medium ml-1">
                            (
                            {totalShipments
                              ? Math.round((e.value / totalShipments) * 100)
                              : 0}
                            %)
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-40 text-xs">
                  No data yet
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ══ Orders bar + Low stock ══ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Monthly orders bar — shows active + cancelled stacked */}
          <Card className="lg:col-span-2">
            <CardHead
              title="Order Volume"
              sub="Active vs cancelled shipments per month"
            />
            <div className="p-5">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart
                  data={monthlyData}
                  barSize={14}
                  margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#f4f4f5"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 10, fill: "#a1a1aa", fontWeight: 700 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#a1a1aa" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<ChartTip unit="" />} />
                  {/* FIX #6: added cancelledOrders bar — was only showing active
                      orders which is 0 for all months in current data. */}
                  <Bar
                    dataKey="orders"
                    name="Active"
                    fill="#18181b"
                    radius={[5, 5, 0, 0]}
                  />
                  <Bar
                    dataKey="cancelledOrders"
                    name="Cancelled"
                    fill="#f43f5e"
                    radius={[5, 5, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Low stock */}
          <Card>
            <CardHead
              title="Low Stock Alert"
              sub="Total variant stock below 10 or a variant is out"
              right={
                lowStock.length ? (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 ring-1 ring-rose-200">
                    {lowStock.length}
                  </span>
                ) : null
              }
            />
            <div className="p-4">
              {lowStock.length ? (
                <div className="flex flex-col gap-2.5">
                  {lowStock.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-zinc-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-[10px]">{p.mainCategory || "—"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        {/* Show the worst variant's stock — that's the real problem */}
                        <span
                          className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ring-1 ${
                            p._minVariantStock === 0
                              ? "bg-rose-50 text-rose-500 ring-rose-200"
                              : "bg-amber-50 text-amber-600 ring-amber-200"
                          }`}
                        >
                          {p._minVariantStock === 0
                            ? "Out"
                            : `${p._minVariantStock} low`}
                        </span>
                        {/* Context: total across all variants */}
                        <span className="text-[9px] font-medium">
                          {p._totalStock} total · {p._variantCount} variants
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <TbCircleCheck className="w-8 h-8 text-emerald-400" />
                  <p className="text-xs font-medium">All products stocked</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* ══ Recent Orders ══ */}
        <Card>
          <CardHead
            title="Recent Orders"
            sub={`Showing last ${recent.length} entries`}
            right={<ViewAll href="/admin/orders" />}
          />
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/40">
                  {[
                    "Order ID",
                    "Customer",
                    "Items",
                    "Total",
                    "Status",
                    "Date",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[9px] font-medium uppercase tracking-[0.22em] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {recent.length ? (
                  recent.map((o) => {
                    const total = (o.shipments || []).reduce(
                      (s, sh) => s + (sh.shipmentTotal || 0),
                      0,
                    );
                    const items = (o.shipments || []).reduce(
                      (s, sh) => s + (sh.products?.length || 0),
                      0,
                    );
                    return (
                      <tr
                        key={o._id}
                        className="hover:bg-zinc-50/60 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <span className="font-mono text-[11px] font-medium">
                            #{o._id?.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-[12px] font-medium text-zinc-700">
                          {o.user?.name ||
                            o.userId?.name ||
                            `User …${String(o.userId || "").slice(-6)}`}
                        </td>
                        <td className="px-5 py-3.5 text-[12px] text-zinc-500">
                          {items} {items === 1 ? "item" : "items"}
                        </td>
                        <td className="px-5 py-3.5 text-[12px] font-medium whitespace-nowrap">
                          Rs.{total.toLocaleString()}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusPill status={o.orderStatus || "Pending"} />
                        </td>
                        <td className="px-5 py-3.5 text-[11px] whitespace-nowrap">
                          {fmtDate(o.createdAt)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-14 text-center text-sm">
                      No orders yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* ══ Top Products ══ */}
        {topProds.length > 0 && (
          <Card>
            <CardHead
              title="Product Inventory"
              sub="Top stocked items in store"
              right={<ViewAll href="/admin/products" />}
            />
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/40">
                    {[
                      "Product",
                      "Category",
                      "Starting Price",
                      "Offer Price",
                      "Total Stock",
                      "Variants",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-[9px] font-medium uppercase tracking-[0.22em] whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {topProds.map((p) => (
                    <tr
                      key={p._id}
                      className="hover:bg-zinc-50/60 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {p.images?.[0]?.url ? (
                            <div className="w-9 h-10 rounded-lg overflow-hidden border border-zinc-100 shrink-0 relative">
                              <Image
                                src={p.images[0].url}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-9 h-10 rounded-lg bg-zinc-100 shrink-0 flex items-center justify-center">
                              <TbTag className="w-4 h-4 text-zinc-300" />
                            </div>
                          )}
                          <span className="text-[12px] font-medium text-zinc-800 max-w-40 truncate">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-zinc-500">
                        {p.mainCategory || "—"}
                      </td>
                      {/* FIX #9: was p.price and p.offerPrice (root level, both 0).
                          Now uses _highestPrice and _lowestPrice from enrichProduct(). */}
                      <td className="px-5 py-3.5 text-[12px] line-through">
                        Rs.{p._highestPrice ?? 0}
                      </td>
                      <td className="px-5 py-3.5 text-[12px] font-medium text-orange-500">
                        Rs.{p._lowestPrice ?? 0}
                      </td>
                      {/* FIX #7: was p.stock (always 0) — now p._totalStock */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`text-[10px] font-medium px-2.5 py-1 rounded-lg ring-1 ${
                            p._totalStock < 10
                              ? "bg-rose-50 text-rose-500 ring-rose-200"
                              : "bg-emerald-50 text-emerald-600 ring-emerald-200"
                          }`}
                        >
                          {p._totalStock} units
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12px] text-zinc-500">
                        {/* FIX #10: new column — _variantCount from enrichProduct() */}
                        {p._variantCount}{" "}
                        {p._variantCount === 1 ? "variant" : "variants"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminHomePage;
