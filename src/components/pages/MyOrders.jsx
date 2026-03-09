"use client";

import { useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { MdPayment, MdPerson, MdPhone, MdLocationOn } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
  TbPackage,
  TbTruckDelivery,
  TbCircleCheck,
  TbCircleX,
} from "react-icons/tb";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/app/context/AuthContext";
import { useOrders } from "@/app/context/OrderContext";
import { toast } from "sonner";

// ── Static style maps ──
const STATUS_CONFIG = {
  Pending: {
    cls: "bg-amber-50 text-amber-600 border border-amber-200",
    icon: TbPackage,
  },
  Shipped: {
    cls: "bg-blue-50 text-blue-600 border border-blue-200",
    icon: TbTruckDelivery,
  },
  Delivered: {
    cls: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: TbCircleCheck,
  },
  Cancelled: {
    cls: "bg-zinc-100 text-zinc-400 border border-zinc-200",
    icon: TbCircleX,
  },
};

const PAYMENT_CONFIG = {
  Pending: "bg-amber-50 text-amber-600 border border-amber-200",
  Paid: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Refunded: "bg-sky-50 text-sky-600 border border-sky-200",
  Failed: "bg-red-50 text-red-500 border border-red-200",
};

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ── Badges ──
const StatusBadge = ({ status, isCancelled }) => {
  const label = isCancelled ? "Cancelled" : status || "Pending";
  const config = isCancelled
    ? STATUS_CONFIG.Cancelled
    : (STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending);
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${config.cls}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
};

const PaymentBadge = ({ status, isCancelled }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide ${
      isCancelled
        ? "bg-zinc-100 text-zinc-400 border border-zinc-200"
        : (PAYMENT_CONFIG[status] ??
          "bg-zinc-100 text-zinc-500 border border-zinc-200")
    }`}
  >
    {status || "Pending"}
  </span>
);

// ── Product Item ──
const ProductItem = ({ p, dim }) => (
  <div className={`flex items-start gap-3 ${dim ? "opacity-60" : ""}`}>
    {p.image ? (
      <div className="relative w-12 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-100 bg-zinc-50">
        <Image src={p.image} alt={p.name ?? ""} fill className="object-cover" />
      </div>
    ) : (
      <div className="w-12 h-14 rounded-xl bg-zinc-100 shrink-0 flex items-center justify-center">
        <HiOutlineShoppingBag className="w-4 h-4 text-zinc-300" />
      </div>
    )}
    <div className="flex flex-col gap-0.5 min-w-0 pt-0.5">
      <span
        className={`text-[13px] font-semibold leading-snug truncate ${dim ? "line-through text-zinc-400" : "text-zinc-800"}`}
      >
        {p.name}
      </span>
      <span className="text-[11px] text-zinc-400">
        {p.mainCategory === "Fashion"
          ? `Qty ${p.quantity} · ${p.size} · ${p.color}`
          : p.mainCategory === "Food"
            ? `Qty ${p.quantity} · ${p.weight}`
            : `Qty ${p.quantity}`}
      </span>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="text-[11px] line-through text-zinc-400">
          Rs.{p.price ?? 0}
        </span>
        <span
          className={`text-[12px] font-black ${dim ? "text-zinc-400" : "text-orange-500"}`}
        >
          Rs.{p.offerPrice ?? 0}
        </span>
      </div>
    </div>
  </div>
);

// ────────────────────────────────────────────
// Mobile Order Card — fully minimal, no strips
// ────────────────────────────────────────────
const OrderCard = ({ shipment, isCancelled, onCancel }) => {
  const isPending = shipment.status === "Pending";

  return (
    <article
      className={`rounded-2xl border bg-white overflow-hidden ${isCancelled ? "border-zinc-100" : "border-zinc-200"}`}
    >
      <div className="p-4 flex flex-col gap-3.5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-400 font-semibold mb-0.5">
              Order
            </p>
            <p className="text-[11px] font-mono font-bold text-zinc-400">
              #{shipment._id?.slice(-10).toUpperCase()}
            </p>
          </div>
          <StatusBadge status={shipment.status} isCancelled={isCancelled} />
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Customer + Delivery */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1.5">
              Customer
            </p>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-zinc-700 mb-0.5">
              <MdPerson className="text-zinc-400 shrink-0 w-3.5 h-3.5" />
              <span className="truncate">
                {shipment.customer?.fullName || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
              <MdPhone className="shrink-0 w-3 h-3" />
              {shipment.customer?.phone || "—"}
            </div>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1.5">
              Delivery
            </p>
            <div className="flex items-start gap-1.5 text-[11px] text-zinc-600 leading-snug">
              <MdLocationOn
                className={`shrink-0 mt-0.5 w-3.5 h-3.5 ${isCancelled ? "text-zinc-300" : "text-emerald-500"}`}
              />
              <span>
                {[
                  shipment.delivery?.city,
                  shipment.delivery?.district,
                  shipment.delivery?.province,
                ]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </span>
            </div>
          </div>
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Items */}
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-2.5">
            Items
          </p>
          <div className="flex flex-col gap-3">
            {(shipment.products || []).map((p, i) => (
              <ProductItem
                key={p._id ?? `${p.name}-${i}`}
                p={p}
                dim={isCancelled}
              />
            ))}
          </div>
        </div>

        <div className="h-px bg-zinc-100" />

        {/* Payment · Total · Date */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1.5">
              Payment
            </p>
            <p className="flex items-center gap-1 text-[11px] font-bold uppercase text-zinc-600 mb-1.5">
              <MdPayment className="text-zinc-400 w-3.5 h-3.5" />
              {shipment.payment?.method || "COD"}
            </p>
            <PaymentBadge
              status={shipment.payment?.status}
              isCancelled={isCancelled}
            />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1.5">
              Total
            </p>
            <p
              className={`text-sm font-black ${isCancelled ? "text-zinc-400 line-through" : "text-zinc-900"}`}
            >
              Rs.{shipment.shipmentTotal ?? 0}
            </p>
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-400 font-semibold mb-1.5">
              {isCancelled ? "Cancelled" : "Ordered"}
            </p>
            <p className="text-[11px] text-zinc-500 leading-snug">
              {fmt(isCancelled ? shipment.cancelledAt : shipment.createdAt)}
            </p>
          </div>
        </div>

        {/* Action */}
        {!isCancelled && (
          <button
            disabled={!isPending}
            onClick={() => onCancel(shipment._id)}
            className={`w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-200 ${
              isPending
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isPending ? "Cancel Order" : "Cannot Cancel"}
          </button>
        )}
      </div>
    </article>
  );
};

// ────────────────────────────────────────────
// Desktop Table — clean minimal header
// ────────────────────────────────────────────
const OrderTable = ({ shipments, isCancelled, onCancel }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-zinc-100">
          {[
            "Customer",
            "Delivery",
            "Items",
            "Status",
            "Ordered",
            ...(isCancelled ? ["Cancelled"] : []),
            "Payment",
            "Total",
            ...(!isCancelled ? ["Action"] : []),
          ].map((h) => (
            <th
              key={h}
              className="text-left px-5 py-3.5 text-[9px] uppercase tracking-[0.22em] font-black text-zinc-400 whitespace-nowrap bg-zinc-50/60"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-zinc-50">
        {shipments.map((s) => (
          <tr
            key={s._id}
            className={`transition-colors ${isCancelled ? "opacity-50" : "hover:bg-zinc-50/70"}`}
          >
            <td className="px-5 py-5 align-top">
              <p className="text-[13px] font-semibold text-zinc-800">
                {s.customer?.fullName || "N/A"}
              </p>
              <p className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                <MdPhone className="shrink-0 w-3 h-3" />{" "}
                {s.customer?.phone || "—"}
              </p>
            </td>
            <td className="px-5 py-5 align-top max-w-[150px]">
              <div className="flex items-start gap-1.5 text-[12px] text-zinc-600 leading-snug">
                <MdLocationOn
                  className={`shrink-0 mt-0.5 w-3.5 h-3.5 ${isCancelled ? "text-zinc-300" : "text-emerald-500"}`}
                />
                <span>
                  {[
                    s.delivery?.city,
                    s.delivery?.district,
                    s.delivery?.province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "—"}
                </span>
              </div>
            </td>
            <td className="px-5 py-5 align-top">
              <div className="flex flex-col gap-3">
                {(s.products || []).map((p, i) => (
                  <ProductItem
                    key={p._id ?? `${p.name}-${i}`}
                    p={p}
                    dim={isCancelled}
                  />
                ))}
              </div>
            </td>
            <td className="px-5 py-5 align-top">
              <StatusBadge status={s.status} isCancelled={isCancelled} />
            </td>
            <td className="px-5 py-5 align-top text-[12px] text-zinc-500 whitespace-nowrap">
              {fmt(s.createdAt)}
            </td>
            {isCancelled && (
              <td className="px-5 py-5 align-top text-[12px] text-zinc-400 whitespace-nowrap">
                {fmt(s.cancelledAt)}
              </td>
            )}
            <td className="px-5 py-5 align-top">
              <p className="flex items-center gap-1 text-[11px] font-black uppercase text-zinc-600 mb-1.5">
                <MdPayment className="text-zinc-400 w-3.5 h-3.5" />
                {s.payment?.method || "COD"}
              </p>
              <PaymentBadge
                status={s.payment?.status}
                isCancelled={isCancelled}
              />
            </td>
            <td className="px-5 py-5 align-top whitespace-nowrap">
              <span
                className={`text-sm font-black ${isCancelled ? "text-zinc-400 line-through" : "text-zinc-900"}`}
              >
                Rs.{s.shipmentTotal ?? 0}
              </span>
            </td>
            {!isCancelled && (
              <td className="px-5 py-5 align-top">
                <button
                  disabled={s.status !== "Pending"}
                  onClick={() => onCancel(s._id)}
                  className={`px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all duration-200 whitespace-nowrap ${
                    s.status === "Pending"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  }`}
                >
                  Cancel
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ── Section wrapper — clean white, no accent lines ──
const Section = ({ title, count, children }) => (
  <section className="rounded-2xl border border-zinc-200 bg-white overflow-hidden">
    <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-zinc-100 bg-zinc-50/60">
      <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
        {title}
      </h2>
      {count > 0 && (
        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-200/70 text-zinc-500">
          {count}
        </span>
      )}
    </div>
    {children}
  </section>
);

// ── Empty State ──
const EmptyState = () => (
  <Section title="Active Orders">
    <div className="flex flex-col items-center justify-center gap-5 py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center">
        <HiOutlineShoppingBag className="w-7 h-7 text-zinc-300" />
      </div>
      <div>
        <p className="text-sm font-bold text-zinc-800">No orders yet</p>
        <p className="text-xs text-zinc-400 mt-1">
          Everything you order will appear right here
        </p>
      </div>
      <Link
        href="/collections/all"
        className="bg-zinc-900 hover:bg-zinc-700 text-white text-[11px] font-black uppercase tracking-[0.2em] px-7 py-3 rounded-xl transition-all duration-200"
      >
        Shop the Collection
      </Link>
    </div>
  </Section>
);

// ────────────────────────────────────────────
// MyOrders
// ────────────────────────────────────────────
const MyOrders = () => {
  const {
    allShipments,
    cancelledShipments,
    cancelShipment,
    loading,
    refreshOrders,
  } = useOrders();
  const { currentUser } = useAuth();

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleOrderCancellation = useCallback(
    async (shipmentId) => {
      if (!shipmentId) {
        toast.error("No shipment selected", { richColors: true });
        return;
      }
      const confirmed = window.confirm(
        "Are you sure you want to cancel this order? This cannot be undone.",
      );
      if (!confirmed) return;

      try {
        const { status, message, success } = await cancelShipment(shipmentId);
        if (success && (status === 200 || status === 201)) {
          toast.success(message || "Order cancelled successfully", {
            richColors: true,
          });
        } else {
          toast.error(message || "Failed to cancel order", {
            richColors: true,
          });
        }
      } catch (err) {
        console.error("handleOrderCancellation error:", err);
        toast.error("Failed to cancel order!", { richColors: true });
      }
    },
    [cancelShipment],
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-9 h-9 text-zinc-300" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-zinc-500">
        No user data available.
      </div>
    );
  }

  const activeShipments = allShipments || [];
  const cancelled = cancelledShipments || [];

  if (!activeShipments.length && !cancelled.length) return <EmptyState />;

  return (
    <div className="flex flex-col gap-5">
      {/* Active Orders */}
      {activeShipments.length > 0 ? (
        <Section title="Active Orders" count={activeShipments.length}>
          {/* Mobile */}
          <div className="lg:hidden flex flex-col gap-3 p-4">
            {activeShipments.map((s) => (
              <OrderCard
                key={s._id}
                shipment={s}
                isCancelled={false}
                onCancel={handleOrderCancellation}
              />
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block">
            <OrderTable
              shipments={activeShipments}
              isCancelled={false}
              onCancel={handleOrderCancellation}
            />
          </div>
        </Section>
      ) : (
        <Section title="Active Orders">
          <div className="flex flex-col items-center gap-4 py-14 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center">
              <HiOutlineShoppingBag className="w-6 h-6 text-zinc-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-700">
                No active orders
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Start shopping to see your orders here
              </p>
            </div>
            <Link
              href="/collections/all"
              className="bg-zinc-900 hover:bg-zinc-700 text-white text-[11px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-xl transition-all duration-200"
            >
              Shop Now
            </Link>
          </div>
        </Section>
      )}

      {/* Cancelled Orders */}
      {cancelled.length > 0 && (
        <Section title="Cancelled Orders" count={cancelled.length}>
          {/* Mobile */}
          <div className="lg:hidden flex flex-col gap-3 p-4">
            {cancelled.map((s) => (
              <OrderCard
                key={s._id}
                shipment={s}
                isCancelled={true}
                onCancel={handleOrderCancellation}
              />
            ))}
          </div>
          {/* Desktop */}
          <div className="hidden lg:block">
            <OrderTable
              shipments={cancelled}
              isCancelled={true}
              onCancel={handleOrderCancellation}
            />
          </div>
        </Section>
      )}
    </div>
  );
};

export default MyOrders;
