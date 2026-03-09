"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  TbPackage,
  TbClockHour4,
  TbTruckDelivery,
  TbCircleCheck,
  TbCircleX,
  TbChevronDown,
  TbChevronUp,
  TbMail,
  TbMailForward,
  TbSearch,
  TbFilter,
  TbRefresh,
  TbAlertTriangle,
  TbX,
  TbSend,
  TbUsers,
  TbLoader2,
} from "react-icons/tb";
import {
  fetchOrdersAdminAction,
  updateOrderStatusAction,
  cancelShipmentAction,
  sendOrderEmailAction,
} from "@/actions/adminOrder";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const STATUS_CFG = {
  Pending: {
    pill: "bg-amber-50 text-amber-600 ring-amber-200",
    dot: "#f59e0b",
  },
  Processing: {
    pill: "bg-orange-50 text-orange-600 ring-orange-200",
    dot: "#f97316",
  },
  Shipped: { pill: "bg-blue-50 text-blue-600 ring-blue-200", dot: "#3b82f6" },
  Delivered: {
    pill: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    dot: "#10b981",
  },
  Cancelled: { pill: "bg-rose-50 text-rose-500 ring-rose-200", dot: "#f43f5e" },
};

const EMAIL_TEMPLATES = [
  {
    label: "Order Confirmed",
    subject: "Your order has been confirmed!",
    message:
      "Hi,\n\nThank you for your order. We're happy to confirm that your order has been received and is being processed.\n\nWe'll notify you once it ships.\n\nRabbitHub Team",
  },
  {
    label: "Order Shipped",
    subject: "Your order is on the way!",
    message:
      "Hi,\n\nGreat news! Your order has been shipped and is on its way to you. You can expect delivery within 3–5 business days.\n\nThank you for shopping with RabbitHub!",
  },
  {
    label: "Order Delivered",
    subject: "Your order has been delivered!",
    message:
      "Hi,\n\nYour order has been delivered. We hope you love your purchase!\n\nIf you have any questions or feedback, please don't hesitate to reach out.\n\nRabbitHub Team",
  },
  {
    label: "Order Cancelled",
    subject: "Your order has been cancelled",
    message:
      "Hi,\n\nWe're sorry to inform you that your order has been cancelled. If you did not request this, please contact us immediately.\n\nRabbitHub Team",
  },
  {
    label: "Payment Reminder",
    subject: "Payment pending for your order",
    message:
      "Hi,\n\nThis is a friendly reminder that payment for your recent order is still pending. Please complete the payment to avoid cancellation.\n\nRabbitHub Team",
  },
  { label: "Custom", subject: "", message: "" },
];

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

// ─────────────────────────────────────────────
// Micro-components
// ─────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.Pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide ring-1 ${cfg.pill}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dot }}
      />
      {status || "Pending"}
    </span>
  );
};

const Spinner = ({ size = "sm" }) => (
  <TbLoader2
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-5 h-5"} text-zinc-400`}
  />
);

// ─────────────────────────────────────────────
// Email Modal
// ─────────────────────────────────────────────
const EmailModal = ({ target, onClose }) => {
  // target = { type: "single" | "bulk", orderId?, userId?, label }
  const [templateIdx, setTemplateIdx] = useState(0);
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [message, setMessage] = useState(EMAIL_TEMPLATES[0].message);
  const [sending, setSending] = useState(false);

  const applyTemplate = (idx) => {
    setTemplateIdx(idx);
    setSubject(EMAIL_TEMPLATES[idx].subject);
    setMessage(EMAIL_TEMPLATES[idx].message);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSending(true);
    try {
      const { status, data } = await sendOrderEmailAction({
        orderId: target.orderId,
        subject,
        message,
      });
      if (status === 200 || status === 201) {
        toast.success(data?.message || "Email sent successfully!");
        onClose();
      } else {
        toast.error(data?.message || "Failed to send email");
      }
    } catch {
      toast.error("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">
              {target.type === "bulk"
                ? "Bulk Email · All Customers"
                : `Email · Order #${target.orderId?.slice(-8).toUpperCase()}`}
            </p>
            <p className="text-sm font-bold text-zinc-800 mt-0.5">
              {target.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
          >
            <TbX className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* template picker */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-2">
              Quick Templates
            </p>
            <div className="flex flex-wrap gap-2">
              {EMAIL_TEMPLATES.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(i)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition ${
                    templateIdx === i
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* subject */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
              Subject
            </p>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50"
            />
          </div>

          {/* message */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
              Message
            </p>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
            />
          </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 bg-zinc-50">
          <p className="text-[10px] text-zinc-400 font-medium">
            {target.type === "bulk"
              ? "Will be sent to all customers"
              : `Recipient: ${target.label}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-700 transition disabled:opacity-50"
            >
              {sending ? <Spinner /> : <TbSend className="w-3.5 h-3.5" />}
              {sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Shipment Row (inside expanded order)
// ─────────────────────────────────────────────
const ShipmentRow = ({
  shipment,
  orderId,
  onStatusChange,
  onCancel,
  isCancelled,
}) => {
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleStatus = async (newStatus) => {
    setUpdating(true);
    await onStatusChange(orderId, shipment._id, newStatus);
    setUpdating(false);
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this shipment? This cannot be undone.")) return;
    setCancelling(true);
    await onCancel(orderId, shipment._id);
    setCancelling(false);
  };

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 ${isCancelled ? "border-zinc-100 bg-zinc-50 opacity-70" : "border-zinc-200 bg-white"}`}
    >
      {/* shipment header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-bold text-zinc-400">
            #{shipment._id?.slice(-8).toUpperCase()}
          </span>
          <StatusPill
            status={isCancelled ? "Cancelled" : shipment.status || "Pending"}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black text-zinc-700">
            Rs.{(shipment.shipmentTotal || 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400">
            {fmtDate(shipment.createdAt)}
          </span>
        </div>
      </div>

      {/* products in shipment */}
      <div className="flex flex-wrap gap-2">
        {(shipment.products || []).map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-2 bg-zinc-50 rounded-lg px-2.5 py-1.5 border border-zinc-100"
          >
            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="w-7 h-7 rounded object-cover border border-zinc-200"
              />
            )}
            <div>
              <p className="text-[11px] font-semibold text-zinc-700 max-w-[140px] truncate">
                {p.name}
              </p>
              <p className="text-[9px] text-zinc-400">
                Qty: {p.quantity} · Rs.{p.offerPrice || p.price || 0}
                {p.size ? ` · ${p.size}` : ""}
                {p.color ? ` · ${p.color}` : ""}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* actions — only on active shipments */}
      {!isCancelled && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          {/* status select */}
          <div className="flex items-center gap-1.5">
            {updating && <Spinner />}
            <select
              value={shipment.status || "Pending"}
              onChange={(e) => handleStatus(e.target.value)}
              disabled={updating}
              className="text-[11px] font-bold border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 cursor-pointer"
            >
              {STATUSES.filter((s) => s !== "Cancelled").map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* quick action buttons */}
          {shipment.status !== "Delivered" && (
            <button
              onClick={() => handleStatus("Delivered")}
              disabled={updating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-bold hover:bg-emerald-100 transition disabled:opacity-50 ring-1 ring-emerald-200"
            >
              <TbCircleCheck className="w-3.5 h-3.5" />
              Mark Delivered
            </button>
          )}
          {shipment.status !== "Shipped" && shipment.status !== "Delivered" && (
            <button
              onClick={() => handleStatus("Shipped")}
              disabled={updating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition disabled:opacity-50 ring-1 ring-blue-200"
            >
              <TbTruckDelivery className="w-3.5 h-3.5" />
              Mark Shipped
            </button>
          )}

          {/* cancel */}
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[11px] font-bold hover:bg-rose-100 transition disabled:opacity-50 ring-1 ring-rose-200 ml-auto"
          >
            {cancelling ? <Spinner /> : <TbCircleX className="w-3.5 h-3.5" />}
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Order Row
// ─────────────────────────────────────────────
const OrderRow = ({ order, onStatusChange, onCancel, onEmail }) => {
  const [expanded, setExpanded] = useState(false);

  const allShipments = order.shipments || [];
  const cancelledShipments = order.cancelledProducts || [];
  const totalShipments = allShipments.length + cancelledShipments.length;
  const totalRevenue = allShipments.reduce(
    (s, sh) => s + (sh.shipmentTotal || 0),
    0,
  );

  // derive display status from individual shipments
  const activeStatuses = allShipments.map((s) => s.status || "Pending");
  const hasActive = allShipments.length > 0;
  const displayStatus = !hasActive
    ? "Cancelled"
    : activeStatuses.includes("Shipped")
      ? "Shipped"
      : activeStatuses.includes("Processing")
        ? "Processing"
        : activeStatuses.includes("Delivered")
          ? "Delivered"
          : "Pending";

  return (
    <>
      {/* ── Main row ── */}
      <tr
        className="border-b border-zinc-100 hover:bg-zinc-50/60 transition-colors cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Order ID */}
        <td className="px-5 py-4">
          <span className="font-mono text-[11px] font-bold text-zinc-400">
            #{order._id?.slice(-8).toUpperCase()}
          </span>
        </td>

        {/* Customer */}
        <td className="px-5 py-4 text-[12px] font-semibold text-zinc-700">
          {order.user?.name || `User …${String(order.userId || "").slice(-6)}`}
        </td>

        {/* Shipments */}
        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-zinc-600">{totalShipments}</span>
            {cancelledShipments.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-500 ring-1 ring-rose-200 font-bold">
                {cancelledShipments.length} cancelled
              </span>
            )}
          </div>
        </td>

        {/* Total */}
        <td className="px-5 py-4 text-[12px] font-black text-zinc-900">
          Rs.{totalRevenue.toLocaleString()}
        </td>

        {/* Status */}
        <td className="px-5 py-4">
          <StatusPill status={displayStatus} />
        </td>

        {/* Date */}
        <td className="px-5 py-4">
          <p className="text-[11px] text-zinc-500">
            {fmtDate(order.createdAt)}
          </p>
          <p className="text-[10px] text-zinc-400">
            {fmtTime(order.createdAt)}
          </p>
        </td>

        {/* Actions */}
        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                onEmail({
                  type: "single",
                  orderId: order._id,
                  label: `User …${String(order.userId || "").slice(-6)}`,
                })
              }
              className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg text-[10px] font-bold hover:bg-zinc-900 hover:text-white transition"
            >
              <TbMail className="w-3.5 h-3.5" />
              Email
            </button>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-7 h-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition"
            >
              {expanded ? (
                <TbChevronUp className="w-3.5 h-3.5 text-zinc-500" />
              ) : (
                <TbChevronDown className="w-3.5 h-3.5 text-zinc-500" />
              )}
            </button>
          </div>
        </td>
      </tr>

      {/* ── Expanded shipments ── */}
      {expanded && (
        <tr className="bg-zinc-50/50">
          <td colSpan={7} className="px-5 pb-5 pt-2">
            <div className="space-y-2">
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-3">
                Active Shipments ({allShipments.length})
              </p>

              {allShipments.length === 0 && (
                <p className="text-[11px] text-zinc-400 italic">
                  No active shipments
                </p>
              )}
              {allShipments.map((sh) => (
                <ShipmentRow
                  key={sh._id}
                  shipment={sh}
                  orderId={order._id}
                  onStatusChange={onStatusChange}
                  onCancel={onCancel}
                  isCancelled={false}
                />
              ))}

              {cancelledShipments.length > 0 && (
                <>
                  <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-400 mt-4 mb-2">
                    Cancelled Shipments ({cancelledShipments.length})
                  </p>
                  {cancelledShipments.map((sh) => (
                    <ShipmentRow
                      key={sh._id}
                      shipment={sh}
                      orderId={order._id}
                      onStatusChange={onStatusChange}
                      onCancel={onCancel}
                      isCancelled={true}
                    />
                  ))}
                </>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [emailModal, setEmailModal] = useState(null); // { type, orderId, label } | null

  // ── fetch ──
  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrdersAdminAction();
      setOrders(Array.isArray(data) ? data : (data?.orders ?? []));
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // ── update shipment status ──
  const handleStatusChange = useCallback(
    async (orderId, shipmentId, newStatus) => {
      try {
        const { status, data } = await updateOrderStatusAction({
          orderId,
          shipmentId,
          status: newStatus,
        });
        if (status === 200 || status === 201) {
          toast.success(`Status updated to ${newStatus}`);
          // optimistic local update
          setOrders((prev) =>
            prev.map((o) => {
              if (o._id !== orderId) return o;
              return {
                ...o,
                shipments: (o.shipments || []).map((sh) =>
                  sh._id === shipmentId ? { ...sh, status: newStatus } : sh,
                ),
              };
            }),
          );
        } else {
          toast.error(data?.message || "Failed to update status");
        }
      } catch {
        toast.error("Failed to update status");
      }
    },
    [],
  );

  // ── cancel shipment ──
  const handleCancel = useCallback(async (orderId, shipmentId) => {
    try {
      const { status, data } = await cancelShipmentAction({
        orderId,
        shipmentId,
      });
      if (status === 200 || status === 201) {
        toast.success("Shipment cancelled");
        // optimistic: move shipment from shipments[] to cancelledProducts[]
        setOrders((prev) =>
          prev.map((o) => {
            if (o._id !== orderId) return o;
            const target = (o.shipments || []).find(
              (sh) => sh._id === shipmentId,
            );
            if (!target) return o;
            return {
              ...o,
              shipments: (o.shipments || []).filter(
                (sh) => sh._id !== shipmentId,
              ),
              cancelledProducts: [
                ...(o.cancelledProducts || []),
                { ...target, status: "Cancelled" },
              ],
            };
          }),
        );
      } else {
        toast.error(data?.message || "Failed to cancel shipment");
      }
    } catch {
      toast.error("Failed to cancel shipment");
    }
  }, []);

  // ── stats from live orders state ──
  const stats = useMemo(() => {
    let pending = 0,
      shipped = 0,
      delivered = 0,
      cancelled = 0,
      revenue = 0;
    orders.forEach((o) => {
      (o.shipments || []).forEach((sh) => {
        const s = sh.status || "Pending";
        if (s === "Pending" || s === "Processing") pending++;
        else if (s === "Shipped") shipped++;
        else if (s === "Delivered") {
          delivered++;
          revenue += sh.shipmentTotal || 0;
        }
      });
      (o.cancelledProducts || []).forEach(() => cancelled++);
    });
    const totalShipments = orders.reduce(
      (s, o) =>
        s + (o.shipments?.length || 0) + (o.cancelledProducts?.length || 0),
      0,
    );
    return { totalShipments, pending, shipped, delivered, cancelled, revenue };
  }, [orders]);

  // ── filter + search ──
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        !search ||
        o._id.toLowerCase().includes(search.toLowerCase()) ||
        String(o.userId || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      if (!matchesSearch) return false;
      if (filterStatus === "All") return true;
      if (filterStatus === "Cancelled") {
        return (
          (o.shipments || []).length === 0 ||
          (o.cancelledProducts || []).length > 0
        );
      }
      return (o.shipments || []).some(
        (sh) => (sh.status || "Pending") === filterStatus,
      );
    });
  }, [orders, search, filterStatus]);

  // ── loading / error ──
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
            Loading Orders
          </p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <TbAlertTriangle className="w-10 h-10 text-rose-400 mx-auto" />
          <p className="text-sm font-bold text-zinc-700">{error}</p>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 mx-auto text-xs font-bold text-zinc-500 hover:text-zinc-900 transition"
          >
            <TbRefresh className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      {/* ── Email Modal ── */}
      {emailModal && (
        <EmailModal target={emailModal} onClose={() => setEmailModal(null)} />
      )}

      <div className="min-h-screen bg-zinc-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          {/* ── Header ── */}
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.35em] text-zinc-400 mb-1">
                RabbitHub · Admin
              </p>
              <h1 className="text-[22px] font-black text-zinc-900 tracking-tight leading-none">
                Order Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Bulk email */}
              <button
                onClick={() =>
                  setEmailModal({ type: "bulk", label: "All Customers" })
                }
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition"
              >
                <TbUsers className="w-4 h-4" />
                Email All
              </button>
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition"
              >
                <TbRefresh className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* ── KPI tiles ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              {
                label: "Total",
                value: stats.totalShipments,
                icon: TbPackage,
                cls: "text-zinc-600 bg-zinc-100",
                border: "border-zinc-200",
              },
              {
                label: "Pending",
                value: stats.pending,
                icon: TbClockHour4,
                cls: "text-amber-600 bg-amber-50",
                border: "border-amber-100",
              },
              {
                label: "Shipped",
                value: stats.shipped,
                icon: TbTruckDelivery,
                cls: "text-blue-600 bg-blue-50",
                border: "border-blue-100",
              },
              {
                label: "Delivered",
                value: stats.delivered,
                icon: TbCircleCheck,
                cls: "text-emerald-600 bg-emerald-50",
                border: "border-emerald-100",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                icon: TbCircleX,
                cls: "text-rose-500 bg-rose-50",
                border: "border-rose-100",
              },
              {
                label: "Revenue",
                value: `Rs.${(stats.revenue / 1000).toFixed(1)}K`,
                icon: TbPackage,
                cls: "text-violet-600 bg-violet-50",
                border: "border-violet-100",
              },
            ].map(({ label, value, icon: Icon, cls, border }) => (
              <div
                key={label}
                className={`bg-white rounded-2xl border ${border} px-4 py-3.5 flex items-center gap-3`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cls}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-400">
                    {label}
                  </p>
                  <p className="text-lg font-black text-zinc-900 leading-none mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Filters ── */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* search */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by order ID or user…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>

            {/* status filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <TbFilter className="w-4 h-4 text-zinc-400" />
              {["All", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition ${
                    filterStatus === s
                      ? "bg-zinc-900 text-white"
                      : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="ml-auto text-[11px] text-zinc-400 font-medium">
              {filtered.length} of {orders.length} orders
            </p>
          </div>

          {/* ── Table ── */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60">
                    {[
                      "Order ID",
                      "Customer",
                      "Shipments",
                      "Total",
                      "Status",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-[9px] font-black uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.length > 0 ? (
                    filtered.map((order) => (
                      <OrderRow
                        key={order._id}
                        order={order}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancel}
                        onEmail={setEmailModal}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-16 text-center text-sm text-zinc-400"
                      >
                        {search || filterStatus !== "All"
                          ? "No orders match your filters"
                          : "No orders yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderManagement;
