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
  TbSearch,
  TbFilter,
  TbRefresh,
  TbAlertTriangle,
  TbX,
  TbSend,
  TbUsers,
  TbLoader2,
  TbArrowBackUp,
  TbMailCheck,
  TbUserMinus,
  TbUserPlus,
} from "react-icons/tb";
import {
  fetchOrdersAdminAction,
  updateOrderStatusAction,
  cancelShipmentAction,
  restoreShipmentAction,
  sendOrderEmailAction,
  sendBulkEmailAction,
  fetchAllCustomersAction,
} from "@/actions/adminOrder";

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const PAYMENT_METHODS = ["COD", "eSewa", "Khalti", "Online", "Card"];

const PAYMENT_METHOD_CFG = {
  COD: {
    label: "Cash on Delivery",
    pill: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  },
  eSewa: { label: "eSewa", pill: "bg-green-50 text-green-600 ring-green-200" },
  Khalti: {
    label: "Khalti",
    pill: "bg-purple-50 text-purple-600 ring-purple-200",
  },
  Online: { label: "Online", pill: "bg-blue-50 text-blue-600 ring-blue-200" },
  Card: { label: "Card", pill: "bg-yellow-50 text-yellow-600 ring-yellow-200" },
};

const PAYMENT_STATUS_CFG = {
  Pending: {
    pill: "bg-amber-50 text-amber-600 ring-amber-200",
    dot: "#f59e0b",
  },
  Paid: {
    pill: "bg-emerald-50 text-emerald-600 ring-emerald-200",
    dot: "#10b981",
  },
  Failed: { pill: "bg-red-50 text-red-600 ring-red-200", dot: "#ef4444" },
  Returned: { pill: "bg-rose-50 text-rose-500 ring-rose-200", dot: "#f43f5e" },
};

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

const ORDER_TEMPLATES = [
  {
    label: "Order Confirmed",
    status: "Pending",
    subject: "Order Confirmed — RabbitHub",
    message:
      "Dear Customer,\n\nThank you for your order. We are pleased to confirm that your order has been successfully received and is now being prepared for processing.\n\nYou will receive a follow-up notification once your order has been dispatched.\n\nShould you have any questions in the meantime, please do not hesitate to contact us at inbox.rabbit@gmail.com.\n\nBest regards,\nRabbitHub Customer Support",
  },
  {
    label: "Order Processing",
    status: "Processing",
    subject: "Your Order Is Being Processed — RabbitHub",
    message:
      "Dear Customer,\n\nWe would like to inform you that your order is currently being processed and prepared for shipment.\n\nOur team is carefully handling your items to ensure they are packed and dispatched in a timely manner. You will receive a shipping confirmation as soon as your order is on its way.\n\nWe appreciate your patience and thank you for choosing RabbitHub.\n\nBest regards,\nRabbitHub Customer Support",
  },
  {
    label: "Order Shipped",
    status: "Shipped",
    subject: "Your Order Has Been Shipped — RabbitHub",
    message:
      "Dear Customer,\n\nWe are pleased to inform you that your order has been dispatched and is currently on its way to you.\n\nEstimated delivery time is 3 to 5 business days. Please ensure that someone is available at the delivery address to receive the package.\n\nIf you have any concerns regarding your delivery, please contact us at inbox.rabbit@gmail.com and we will be happy to assist.\n\nThank you for shopping with RabbitHub.\n\nBest regards,\nRabbitHub Customer Support",
  },
  {
    label: "Order Delivered",
    status: "Delivered",
    subject: "Your Order Has Been Delivered — RabbitHub",
    message:
      "Dear Customer,\n\nWe are delighted to confirm that your order has been successfully delivered.\n\nWe hope you are satisfied with your purchase. If you experience any issues with the items received, please contact us within 48 hours at inbox.rabbit@gmail.com and our support team will resolve the matter promptly.\n\nThank you for placing your trust in RabbitHub. We look forward to serving you again.\n\nBest regards,\nRabbitHub Customer Support",
  },
  {
    label: "Order Cancelled",
    status: "Cancelled",
    subject: "Your Order Has Been Cancelled — RabbitHub",
    message:
      "Dear Customer,\n\nWe regret to inform you that your order has been cancelled.\n\nIf you did not initiate this cancellation or believe this has occurred in error, please contact our support team immediately at inbox.rabbit@gmail.com.\n\nIf a payment was made against this order, a full refund will be processed within 5 to 7 business days, depending on your payment method and financial institution.\n\nWe sincerely apologize for any inconvenience this may have caused and hope to serve you again in the future.\n\nBest regards,\nRabbitHub Customer Support",
  },
  {
    label: "Payment Reminder",
    status: null,
    subject:
      "Action Required: Prepare Payment for Your Incoming Order — RabbitHub",
    message:
      "Dear Customer,\n\nWe would like to inform you that your order is currently on its way and will be arriving at your delivery address shortly.\n\nAs your order is being fulfilled on a Cash on Delivery basis, we kindly request that you have the exact payment amount prepared and ready upon delivery. This will help ensure a smooth and prompt handover with our delivery personnel.\n\nPlease ensure that you or an authorized representative is available at the delivery address to receive the package and complete the payment.\n\nShould you have any questions or require assistance prior to delivery, please do not hesitate to reach out to us at inbox.rabbit@gmail.com.\n\nThank you for shopping with RabbitHub. We look forward to completing your order.\n\nBest regards,\nRabbitHub Customer Support",
  },
  { label: "Custom", status: null, subject: "", message: "" },
];

const BULK_TEMPLATES = [
  {
    label: "Flash Sale",
    subject: "Exclusive Flash Sale — Up to 50% Off at RabbitHub",
    message:
      "Dear Valued Customer,\n\nWe are excited to announce an exclusive flash sale at RabbitHub — enjoy up to 50% off on a wide range of products for a limited time only.\n\nVisit our store now to explore the latest deals before they expire. Our flash sales are strictly time-limited and stocks are updated frequently, so we encourage you to browse at your earliest convenience.\n\nThank you for being a valued member of the RabbitHub community. We look forward to serving you.\n\nBest regards,\nRabbitHub Marketing Team",
  },
  {
    label: "New Arrivals",
    subject: "New Products Just Landed at RabbitHub — Be the First to Explore",
    message:
      "Dear Valued Customer,\n\nWe are thrilled to inform you that an exciting range of new products has just arrived at RabbitHub.\n\nOur latest collection has been carefully curated to bring you the best in quality and value. From trending styles to everyday essentials, there is something for everyone.\n\nHead over to our store to browse the newest additions before they sell out. New arrivals tend to go fast, so we encourage you to shop early.\n\nThank you for your continued support.\n\nBest regards,\nRabbitHub Marketing Team",
  },
  {
    label: "Seasonal Offer",
    subject: "Special Seasonal Offers Are Live at RabbitHub",
    message:
      "Dear Valued Customer,\n\nThe season's best deals are now live at RabbitHub.\n\nWe have prepared an exclusive selection of seasonal offers across multiple categories, giving you the perfect opportunity to save more on the products you love. These offers are available for a limited period, so we recommend acting quickly.\n\nVisit our store today and take advantage of these outstanding seasonal deals.\n\nThank you for shopping with RabbitHub.\n\nBest regards,\nRabbitHub Marketing Team",
  },
  {
    label: "Loyalty Reward",
    subject: "A Special Thank You from RabbitHub — You've Earned It",
    message:
      "Dear Valued Customer,\n\nWe sincerely appreciate your continued loyalty and support for RabbitHub. Your trust means everything to us.\n\nAs a token of our gratitude, we would like to offer you an exclusive reward on your next purchase. Please visit our store and check your account for details on your personalized offer.\n\nWe remain committed to delivering the best shopping experience possible, and we look forward to serving you for many more years to come.\n\nWith gratitude,\nRabbitHub Customer Team",
  },
  {
    label: "Announcement",
    subject: "Important Announcement from RabbitHub",
    message:
      "Dear Valued Customer,\n\nWe have an important update we would like to share with you.\n\n[Insert your announcement here.]\n\nIf you have any questions regarding this announcement, please do not hesitate to reach out to us at inbox.rabbit@gmail.com. We are always happy to assist.\n\nThank you for being a part of the RabbitHub community.\n\nBest regards,\nRabbitHub Team",
  },
  { label: "Custom", subject: "", message: "" },
];

const getOrderTemplateIdxForStatus = (status) => {
  const map = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 3,
    Cancelled: 4,
  };
  return map[status] ?? 6;
};

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

const PaymentPill = ({ status }) => {
  const cfg = PAYMENT_STATUS_CFG[status] ?? PAYMENT_STATUS_CFG.Pending;
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

const Spinner = ({ size = "sm" }) => (
  <TbLoader2
    className={`animate-spin ${size === "sm" ? "w-4 h-4" : "w-5 h-5"} text-zinc-400`}
  />
);

// ─────────────────────────────────────────────
// Customer Exclude Panel (bulk only)
// ─────────────────────────────────────────────
const CustomerExcludePanel = ({ excludedIds, onToggle }) => {
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [customerSearch, setCustomerSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAllCustomersAction();
        setCustomers(Array.isArray(data) ? data : []);
      } catch {
        setCustomers([]);
      } finally {
        setLoadingCustomers(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q),
    );
  }, [customers, customerSearch]);

  const excludedCount = excludedIds.size;

  return (
    <div className="rounded-xl border border-zinc-200 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition text-left"
      >
        <div className="flex items-center gap-2">
          <TbUserMinus className="w-4 h-4 text-zinc-500" />
          <span className="text-[11px] font-semibold text-zinc-700 uppercase tracking-[0.15em]">
            Exclude Recipients
          </span>
          {excludedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 text-[10px] font-semibold ring-1 ring-rose-200">
              {excludedCount} excluded
            </span>
          )}
        </div>
        <TbChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-zinc-100">
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <TbSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name or email…"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-3 pb-2">
            <p className="text-[10px] text-zinc-400">
              {loadingCustomers
                ? "Loading…"
                : `${filtered.length} customer${filtered.length !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  customers.forEach(
                    (c) => !excludedIds.has(c._id) && onToggle(c._id),
                  )
                }
                className="text-[10px] font-medium text-rose-500 hover:text-rose-700 transition"
              >
                Exclude all
              </button>
              <span className="text-zinc-300">·</span>
              <button
                onClick={() =>
                  customers.forEach(
                    (c) => excludedIds.has(c._id) && onToggle(c._id),
                  )
                }
                className="text-[10px] font-medium text-emerald-600 hover:text-emerald-800 transition"
              >
                Include all
              </button>
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto divide-y divide-zinc-50">
            {loadingCustomers ? (
              <div className="flex items-center justify-center py-6">
                <Spinner />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-center text-[11px] text-zinc-400 py-6">
                No customers found
              </p>
            ) : (
              filtered.map((c) => {
                const isExcluded = excludedIds.has(c._id);
                return (
                  <div
                    key={c._id}
                    onClick={() => onToggle(c._id)}
                    className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors ${isExcluded ? "bg-rose-50/60" : "hover:bg-zinc-50"}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-semibold ${isExcluded ? "bg-rose-100 text-rose-500" : "bg-zinc-100 text-zinc-600"}`}
                      >
                        {(c.name || "?")[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p
                          className={`text-[11px] font-medium truncate ${isExcluded ? "text-zinc-400 line-through" : "text-zinc-700"}`}
                        >
                          {c.name || "—"}
                        </p>
                        <p className="text-[10px] text-zinc-400 truncate">
                          {c.email}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 ml-2">
                      {isExcluded ? (
                        <span className="flex items-center gap-1 text-[10px] text-rose-500 font-medium">
                          <TbUserMinus className="w-3 h-3" /> Excluded
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                          <TbUserPlus className="w-3 h-3" /> Include
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {excludedCount > 0 && (
            <div className="px-3 py-2 border-t border-zinc-100 bg-rose-50/40">
              <p className="text-[10px] text-rose-500 font-medium">
                {excludedCount} customer{excludedCount !== 1 ? "s" : ""} will
                NOT receive this email. &nbsp;
                <button
                  onClick={() =>
                    customers.forEach(
                      (c) => excludedIds.has(c._id) && onToggle(c._id),
                    )
                  }
                  className="underline hover:no-underline"
                >
                  Clear all
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Email Modal
// ─────────────────────────────────────────────
const EmailModal = ({ target, onClose, onEmailSent }) => {
  const isBulk = target.type === "bulk";
  const TEMPLATES = isBulk ? BULK_TEMPLATES : ORDER_TEMPLATES;
  const defaultIdx = isBulk ? 0 : getOrderTemplateIdxForStatus(target.status);

  const [templateIdx, setTemplateIdx] = useState(defaultIdx);
  const [subject, setSubject] = useState(TEMPLATES[defaultIdx].subject);
  const [message, setMessage] = useState(TEMPLATES[defaultIdx].message);
  const [sending, setSending] = useState(false);
  const [excludedIds, setExcludedIds] = useState(new Set());

  const toggleExclude = useCallback((id) => {
    setExcludedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const applyTemplate = (idx) => {
    setTemplateIdx(idx);
    setSubject(TEMPLATES[idx].subject);
    setMessage(TEMPLATES[idx].message);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required");
      return;
    }
    setSending(true);
    try {
      let status, data;
      if (isBulk) {
        ({ status, data } = await sendBulkEmailAction({
          subject,
          message,
          excludedIds: Array.from(excludedIds),
        }));
      } else {
        ({ status, data } = await sendOrderEmailAction({
          orderId: target.orderId,
          subject,
          message,
        }));
      }

      if (status === 200 || status === 201) {
        toast.success(data?.message || "Email sent!");
        if (!isBulk) onEmailSent?.(target.orderId);
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
      <div
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50 shrink-0">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-500">
              {isBulk
                ? "Bulk Email · All Customers"
                : `Email · Order #${target.orderId}`}
            </p>
            <p className="text-sm font-medium text-zinc-800 mt-0.5">
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

        <div className="p-5 space-y-4 overflow-y-auto">
          {isBulk && (
            <div className="px-3 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
              <p className="text-[10px] font-medium text-blue-600 uppercase tracking-[0.18em] mb-1">
                Bulk Email Purpose
              </p>
              <p className="text-[11px] text-blue-500 leading-relaxed">
                Use bulk emails to announce offers, new arrivals, seasonal
                deals, and loyalty rewards to all customers at once.
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-2">
              {isBulk ? "Marketing Templates" : "Quick Templates"}
            </p>
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => applyTemplate(i)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition ${templateIdx === i ? "bg-zinc-900 text-white border-zinc-900" : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
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

          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-500 mb-1.5">
              Message
            </p>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 bg-zinc-50 resize-none"
            />
          </div>

          {isBulk && (
            <CustomerExcludePanel
              excludedIds={excludedIds}
              onToggle={toggleExclude}
            />
          )}
        </div>

        <div className="flex items-center justify-between px-5 py-4 border-t border-zinc-100 bg-zinc-50 shrink-0">
          <p className="text-[10px] text-zinc-400 font-medium">
            {isBulk
              ? excludedIds.size > 0
                ? `${excludedIds.size} customer${excludedIds.size !== 1 ? "s" : ""} excluded`
                : "Will be sent to all customers"
              : `Recipient: ${target.label}`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-zinc-500 hover:text-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-xl text-xs font-medium hover:bg-zinc-700 transition disabled:opacity-50"
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
// Payment Controls
// ─────────────────────────────────────────────
const PaymentControls = ({
  orderId,
  shipmentId,
  initialStatus,
  initialMethod,
}) => {
  const [paymentStatus, setPaymentStatus] = useState(
    initialStatus || "Pending",
  );
  const [paymentMethod, setPaymentMethod] = useState(initialMethod || "COD");
  const [updatingPayment, setUpdatingPayment] = useState(false);

  const handlePaymentStatusUpdate = async (newPaymentStatus) => {
    if (newPaymentStatus === paymentStatus) return;
    setUpdatingPayment(true);
    try {
      const { status, data } = await updateOrderStatusAction({
        orderId,
        shipmentId,
        paymentStatus: newPaymentStatus,
      });
      if (status === 200 || status === 201) {
        setPaymentStatus(newPaymentStatus);
        toast.success(`Payment marked as ${newPaymentStatus}`);
      } else toast.error(data?.message || "Failed to update payment status");
    } catch {
      toast.error("Failed to update payment status");
    } finally {
      setUpdatingPayment(false);
    }
  };

  const handlePaymentMethodUpdate = async (newPaymentMethod) => {
    if (newPaymentMethod === paymentMethod) return;
    setUpdatingPayment(true);
    try {
      const { status, data } = await updateOrderStatusAction({
        orderId,
        shipmentId,
        paymentMethod: newPaymentMethod,
      });
      if (status === 200 || status === 201) {
        setPaymentMethod(newPaymentMethod);
        toast.success("Payment method updated");
      } else toast.error(data?.message || "Failed to update payment method");
    } catch {
      toast.error("Failed to update payment method");
    } finally {
      setUpdatingPayment(false);
    }
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 px-3 py-2.5 rounded-lg bg-zinc-50 border border-zinc-100">
      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          Payment
        </p>
        <PaymentPill status={paymentStatus} />
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded ring-1 ${PAYMENT_METHOD_CFG[paymentMethod]?.pill ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"}`}
        >
          {PAYMENT_METHOD_CFG[paymentMethod]?.label ?? paymentMethod}
        </span>
        {updatingPayment && <Spinner />}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={paymentMethod}
          disabled={updatingPayment}
          onChange={(e) => handlePaymentMethodUpdate(e.target.value)}
          className="text-[11px] font-medium border border-zinc-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 cursor-pointer"
        >
          {PAYMENT_METHODS.map((m) => (
            <option key={m} value={m}>
              {PAYMENT_METHOD_CFG[m]?.label ?? m}
            </option>
          ))}
        </select>
        {paymentStatus !== "Pending" && (
          <button
            onClick={() => handlePaymentStatusUpdate("Pending")}
            disabled={updatingPayment}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-[10px] font-medium hover:bg-amber-100 transition disabled:opacity-50 ring-1 ring-amber-200"
          >
            <TbClockHour4 className="w-3 h-3" /> Pending
          </button>
        )}
        {paymentStatus !== "Paid" && (
          <button
            onClick={() => handlePaymentStatusUpdate("Paid")}
            disabled={updatingPayment}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-medium hover:bg-emerald-100 transition disabled:opacity-50 ring-1 ring-emerald-200"
          >
            <TbCircleCheck className="w-3 h-3" /> Mark Paid
          </button>
        )}
        {paymentStatus !== "Failed" && (
          <button
            onClick={() => handlePaymentStatusUpdate("Failed")}
            disabled={updatingPayment}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-medium hover:bg-red-100 transition disabled:opacity-50 ring-1 ring-red-200"
          >
            <TbCircleX className="w-3 h-3" /> Failed
          </button>
        )}
        {paymentStatus !== "Returned" && (
          <button
            onClick={() => handlePaymentStatusUpdate("Returned")}
            disabled={updatingPayment}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-500 rounded-lg text-[10px] font-medium hover:bg-rose-100 transition disabled:opacity-50 ring-1 ring-rose-200"
          >
            <TbCircleX className="w-3 h-3" /> Returned
          </button>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Shipment Row — now collapsible
// ─────────────────────────────────────────────
const ShipmentRow = ({
  shipment,
  orderId,
  onStatusChange,
  onCancel,
  onRestore,
  isCancelled,
}) => {
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [localStatus, setLocalStatus] = useState(shipment.status || "Pending");
  // ── NEW: each shipment starts expanded; user can collapse it
  const [collapsed, setCollapsed] = useState(false);

  const handleStatus = async (newStatus) => {
    if (newStatus === localStatus) return;
    setUpdating(true);
    try {
      const { status, data } = await updateOrderStatusAction({
        orderId,
        shipmentId: shipment._id,
        status: newStatus,
      });
      if (status === 200 || status === 201) {
        setLocalStatus(newStatus);
        toast.success(`Shipment marked as ${newStatus}`);
        onStatusChange?.(orderId, shipment._id, newStatus);
      } else toast.error(data?.message || "Failed to update status");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (
      !window.confirm(
        "Cancel this shipment?\n\nPayment status will NOT be changed automatically — update it manually after cancellation.",
      )
    )
      return;
    setCancelling(true);
    await onCancel(orderId, shipment._id);
    setCancelling(false);
  };

  const handleRestore = async () => {
    if (
      !window.confirm(
        "Restore this shipment to active? It will return to Pending status.",
      )
    )
      return;
    setRestoring(true);
    await onRestore(orderId, shipment._id);
    setRestoring(false);
  };

  const displayStatus = isCancelled ? "Cancelled" : localStatus;

  return (
    <div
      className={`rounded-xl border overflow-hidden ${
        isCancelled
          ? "border-zinc-100 bg-zinc-50/80"
          : "border-zinc-200 bg-white"
      }`}
    >
      {/* ── Shipment collapse header (always visible) ── */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 transition text-left ${
          collapsed
            ? isCancelled
              ? "bg-zinc-50/80"
              : "bg-white hover:bg-zinc-50/60"
            : isCancelled
              ? "bg-zinc-50/80 border-b border-zinc-100"
              : "bg-zinc-50/40 border-b border-zinc-100 hover:bg-zinc-50"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[10px] font-medium text-zinc-400 shrink-0">
            #{shipment._id}
          </span>
          <StatusPill status={displayStatus} />
          {isCancelled && (
            <span className="text-[9px] font-medium text-zinc-400 italic hidden sm:inline">
              Payment still editable
            </span>
          )}
          {/* Customer name preview when collapsed */}
          {collapsed && shipment.customer?.fullName && (
            <span className="text-[11px] font-medium text-zinc-600 truncate">
              {shipment.customer.fullName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-medium text-zinc-700">
            Rs.{(shipment.shipmentTotal || 0).toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-400">
            {fmtDate(shipment.createdAt)}
          </span>
          {collapsed ? (
            <TbChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          ) : (
            <TbChevronUp className="w-3.5 h-3.5 text-zinc-400" />
          )}
        </div>
      </button>

      {/* ── Shipment body (hidden when collapsed) ── */}
      {!collapsed && (
        <div className="p-4 space-y-3">
          {shipment.customer && (
            <div className="flex items-center gap-4 px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-100">
              <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center shrink-0 text-[11px] font-medium text-zinc-600">
                {(shipment.customer.fullName || "?")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-medium text-zinc-800">
                  {shipment.customer.fullName || "—"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {shipment.customer.phone || ""}
                  {shipment.customer.phone && shipment.customer.email
                    ? " · "
                    : ""}
                  {shipment.customer.email || ""}
                </p>
              </div>
            </div>
          )}

          <PaymentControls
            orderId={orderId}
            shipmentId={shipment._id}
            initialStatus={shipment.payment?.status}
            initialMethod={shipment.payment?.method}
          />

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
                  <p className="text-[11px] font-medium text-zinc-700 max-w-[140px] truncate">
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

          {!isCancelled ? (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {updating && <Spinner />}
                {localStatus !== "Pending" &&
                  localStatus !== "Processing" &&
                  localStatus !== "Shipped" &&
                  localStatus !== "Delivered" && (
                    <button
                      onClick={() => handleStatus("Pending")}
                      disabled={updating}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-medium hover:bg-amber-100 transition disabled:opacity-50 ring-1 ring-amber-200"
                    >
                      <TbClockHour4 className="w-3.5 h-3.5" /> Mark Confirmed
                    </button>
                  )}
                {localStatus === "Pending" && (
                  <button
                    onClick={() => handleStatus("Processing")}
                    disabled={updating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[11px] font-medium hover:bg-orange-100 transition disabled:opacity-50 ring-1 ring-orange-200"
                  >
                    <TbPackage className="w-3.5 h-3.5" /> Mark Processing
                  </button>
                )}
                {(localStatus === "Pending" ||
                  localStatus === "Processing") && (
                  <button
                    onClick={() => handleStatus("Shipped")}
                    disabled={updating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-medium hover:bg-blue-100 transition disabled:opacity-50 ring-1 ring-blue-200"
                  >
                    <TbTruckDelivery className="w-3.5 h-3.5" /> Mark Shipped
                  </button>
                )}
                {localStatus !== "Delivered" && (
                  <button
                    onClick={() => handleStatus("Delivered")}
                    disabled={updating}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[11px] font-medium hover:bg-emerald-100 transition disabled:opacity-50 ring-1 ring-emerald-200"
                  >
                    <TbCircleCheck className="w-3.5 h-3.5" /> Mark Delivered
                  </button>
                )}
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-500 rounded-lg text-[11px] font-medium hover:bg-rose-100 transition disabled:opacity-50 ring-1 ring-rose-200 ml-auto"
                >
                  {cancelling ? (
                    <Spinner />
                  ) : (
                    <TbCircleX className="w-3.5 h-3.5" />
                  )}{" "}
                  Cancel Shipment
                </button>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                  Or set directly:
                </p>
                <select
                  value={localStatus}
                  onChange={(e) => handleStatus(e.target.value)}
                  disabled={updating}
                  className="text-[11px] font-medium border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900 disabled:opacity-50 cursor-pointer"
                >
                  {STATUSES.filter((s) => s !== "Cancelled").map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="pt-1 flex items-center gap-3 flex-wrap">
              <button
                onClick={handleRestore}
                disabled={restoring}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 text-zinc-700 rounded-lg text-[11px] font-medium hover:bg-zinc-200 transition disabled:opacity-50 ring-1 ring-zinc-200"
              >
                {restoring ? (
                  <Spinner />
                ) : (
                  <TbArrowBackUp className="w-3.5 h-3.5" />
                )}{" "}
                Restore Shipment
              </button>
              <p className="text-[10px] text-zinc-400 font-medium">
                Restores to Pending · Update payment above manually
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Order Row
// ─────────────────────────────────────────────
const OrderRow = ({
  order,
  filterStatus, // ── NEW: passed from parent to filter visible shipments
  onStatusChange,
  onCancel,
  onRestore,
  onEmail,
  emailSentAt,
}) => {
  const [expanded, setExpanded] = useState(false);

  const allShipments = order.shipments || [];
  const cancelledShipments = order.cancelledProducts || [];

  // ── NEW: when a status filter is active, only show matching shipments in the expanded panel
  const visibleActiveShipments = useMemo(() => {
    if (filterStatus === "All") return allShipments;
    if (filterStatus === "Cancelled") return allShipments; // cancelled tab shows cancelled section separately
    return allShipments.filter(
      (sh) => (sh.status || "Pending") === filterStatus,
    );
  }, [allShipments, filterStatus]);

  const visibleCancelledShipments = useMemo(() => {
    // Show cancelled shipments only in "All" or "Cancelled" filter
    if (filterStatus === "All" || filterStatus === "Cancelled")
      return cancelledShipments;
    return [];
  }, [cancelledShipments, filterStatus]);

  const totalShipments = allShipments.length + cancelledShipments.length;
  const totalRevenue = allShipments.reduce(
    (s, sh) => s + (sh.shipmentTotal || 0),
    0,
  );

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

  const customer = (order.shipments?.[0] || order.cancelledProducts?.[0])
    ?.customer;

  return (
    <>
      {/* ── Main order row — soft indigo tint when expanded ── */}
      <tr
        className={`border-b border-zinc-100 transition-colors cursor-pointer ${
          expanded
            ? "bg-indigo-50/40 hover:bg-indigo-50/60"
            : "hover:bg-zinc-50/60"
        }`}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="px-5 py-4">
          <span className="text-xs">#{order._id}</span>
        </td>

        <td className="px-5 py-4">
          {customer ? (
            <div>
              <p className="text-[12px] font-medium text-zinc-800">
                {customer.fullName || "—"}
              </p>
              <p className="text-[10px] text-zinc-400">
                {customer.phone || ""}
              </p>
              <p className="text-[10px] text-zinc-400 truncate max-w-40">
                {customer.email || ""}
              </p>
            </div>
          ) : (
            <span className="text-[12px] text-zinc-400">
              User …{String(order.userId || "").slice(-6)}
            </span>
          )}
        </td>

        <td className="px-5 py-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[12px] text-zinc-600">{totalShipments}</span>
            {cancelledShipments.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-50 text-rose-500 ring-1 ring-rose-200 font-medium">
                {cancelledShipments.length} cancelled
              </span>
            )}
          </div>
        </td>

        <td className="px-5 py-4 text-[12px] font-medium text-zinc-900">
          Rs.{totalRevenue.toLocaleString()}
        </td>

        <td className="px-5 py-4">
          <div className="flex flex-col gap-1.5">
            <StatusPill status={displayStatus} />
            {(() => {
              const pay =
                allShipments[0]?.payment || cancelledShipments[0]?.payment;
              if (!pay) return null;
              return (
                <div className="flex items-center gap-1.5">
                  <PaymentPill status={pay.status || "Pending"} />
                  <span
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded ring-1 ${PAYMENT_METHOD_CFG[pay.method]?.pill ?? "bg-zinc-100 text-zinc-600 ring-zinc-200"}`}
                  >
                    {PAYMENT_METHOD_CFG[pay.method]?.label ?? pay.method ?? "—"}
                  </span>
                </div>
              );
            })()}
          </div>
        </td>

        <td className="px-5 py-4">
          <p className="text-[11px] text-zinc-500">
            {fmtDate(order.createdAt)}
          </p>
          <p className="text-[10px] text-zinc-400">
            {fmtTime(order.createdAt)}
          </p>
        </td>

        <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start gap-1">
              <button
                onClick={() =>
                  onEmail({
                    type: "single",
                    orderId: order._id,
                    status: displayStatus,
                    label:
                      customer?.fullName ||
                      `User …${String(order.userId || "").slice(-6)}`,
                  })
                }
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition ${emailSentAt ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 hover:bg-zinc-900 hover:text-white hover:ring-0" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-900 hover:text-white"}`}
              >
                {emailSentAt ? (
                  <TbMailCheck className="w-3.5 h-3.5" />
                ) : (
                  <TbMail className="w-3.5 h-3.5" />
                )}
                {emailSentAt ? "Resend" : "Email"}
              </button>
              {emailSentAt && (
                <span className="text-[9px] text-emerald-500 font-medium flex items-center gap-0.5 pl-0.5">
                  Sent {fmtTime(emailSentAt)}
                </span>
              )}
            </div>
            <button
              onClick={() => setExpanded((v) => !v)}
              className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${
                expanded
                  ? "bg-indigo-100 hover:bg-indigo-200"
                  : "bg-zinc-100 hover:bg-zinc-200"
              }`}
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

      {/* ── Expanded detail panel — also tinted indigo ── */}
      {expanded && (
        <tr className="border-b border-indigo-100/60">
          <td colSpan={7} className="px-5 pb-5 pt-2 bg-indigo-50/20">
            <div className="space-y-2">
              {/* Active / filtered shipments */}
              <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-zinc-400 mb-3">
                {filterStatus === "All"
                  ? `Active Shipments (${allShipments.length})`
                  : `${filterStatus} Shipments (${visibleActiveShipments.length})`}
              </p>
              {visibleActiveShipments.length === 0 && (
                <p className="text-[11px] text-zinc-400 italic">
                  {filterStatus === "All"
                    ? "No active shipments"
                    : `No shipments with status "${filterStatus}"`}
                </p>
              )}
              {visibleActiveShipments.map((sh) => (
                <ShipmentRow
                  key={sh._id}
                  shipment={sh}
                  orderId={order._id}
                  onStatusChange={onStatusChange}
                  onCancel={onCancel}
                  onRestore={onRestore}
                  isCancelled={false}
                />
              ))}

              {/* Cancelled shipments — only shown in All / Cancelled filter */}
              {visibleCancelledShipments.length > 0 && (
                <>
                  <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-zinc-400 mt-4 mb-2">
                    Cancelled Shipments ({visibleCancelledShipments.length})
                  </p>
                  {visibleCancelledShipments.map((sh) => (
                    <ShipmentRow
                      key={sh._id}
                      shipment={sh}
                      orderId={order._id}
                      onStatusChange={onStatusChange}
                      onCancel={onCancel}
                      onRestore={onRestore}
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
  const [emailModal, setEmailModal] = useState(null);
  const [emailSentLog, setEmailSentLog] = useState({});

  const handleEmailSent = useCallback((orderId) => {
    setEmailSentLog((prev) => ({ ...prev, [orderId]: new Date() }));
  }, []);

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

  const handleStatusChange = useCallback((orderId, shipmentId, newStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o._id !== orderId
          ? o
          : {
              ...o,
              shipments: (o.shipments || []).map((sh) =>
                sh._id === shipmentId ? { ...sh, status: newStatus } : sh,
              ),
            },
      ),
    );
  }, []);

  const handleCancel = useCallback(async (orderId, shipmentId) => {
    try {
      const { status, data } = await cancelShipmentAction({
        orderId,
        shipmentId,
      });
      if (status === 200 || status === 201) {
        toast.success("Shipment cancelled · Update payment manually if needed");
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
      } else toast.error(data?.message || "Failed to cancel shipment");
    } catch {
      toast.error("Failed to cancel shipment");
    }
  }, []);

  const handleRestore = useCallback(async (orderId, shipmentId) => {
    try {
      const { status, data } = await restoreShipmentAction({
        orderId,
        shipmentId,
      });
      if (status === 200 || status === 201) {
        toast.success("Shipment restored to Pending");
        setOrders((prev) =>
          prev.map((o) => {
            if (o._id !== orderId) return o;
            const target = (o.cancelledProducts || []).find(
              (sh) => sh._id === shipmentId,
            );
            if (!target) return o;
            return {
              ...o,
              cancelledProducts: (o.cancelledProducts || []).filter(
                (sh) => sh._id !== shipmentId,
              ),
              shipments: [
                ...(o.shipments || []),
                { ...target, status: "Pending" },
              ],
            };
          }),
        );
      } else toast.error(data?.message || "Failed to restore shipment");
    } catch {
      toast.error("Failed to restore shipment");
    }
  }, []);

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

  // ── UPDATED: filter orders AND narrow which shipments qualify
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return orders.filter((o) => {
      // Search filter
      if (q) {
        const customerFields = (o.shipments || [])
          .flatMap((sh) => [
            sh.customer?.fullName || "",
            sh.customer?.phone || "",
            sh.customer?.email || "",
          ])
          .concat(
            (o.cancelledProducts || []).flatMap((sh) => [
              sh.customer?.fullName || "",
              sh.customer?.phone || "",
              sh.customer?.email || "",
            ]),
          );
        const matchesSearch =
          o._id.toLowerCase().includes(q) ||
          String(o.userId || "")
            .toLowerCase()
            .includes(q) ||
          customerFields.some((f) => f.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }

      // Status filter — only include orders that actually have a matching shipment
      if (filterStatus === "All") return true;
      if (filterStatus === "Cancelled") {
        // Show orders that have at least one cancelled shipment OR all shipments cancelled
        return (
          (o.cancelledProducts || []).length > 0 ||
          (o.shipments || []).length === 0
        );
      }
      // For every other status: order must have at least one active shipment with that exact status
      return (o.shipments || []).some(
        (sh) => (sh.status || "Pending") === filterStatus,
      );
    });
  }, [orders, search, filterStatus]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
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
          <p className="text-sm font-medium text-zinc-700">{error}</p>
          <button
            onClick={loadOrders}
            className="flex items-center gap-2 mx-auto text-xs font-medium text-zinc-500 hover:text-zinc-900 transition"
          >
            <TbRefresh className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    );

  return (
    <>
      {emailModal && (
        <EmailModal
          target={emailModal}
          onClose={() => setEmailModal(null)}
          onEmailSent={handleEmailSent}
        />
      )}

      <div className="min-h-screen p-4">
        <div className="container mx-auto space-y-6">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.35em] text-zinc-400 mb-1">
                RabbitHub · Admin
              </p>
              <h1 className="text-[22px] font-medium text-zinc-900 tracking-tight leading-none">
                Order Management
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setEmailModal({ type: "bulk", label: "All Customers" })
                }
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition"
              >
                <TbUsers className="w-4 h-4" /> Email All
              </button>
              <button
                onClick={loadOrders}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition"
              >
                <TbRefresh className="w-4 h-4" /> Refresh
              </button>
            </div>
          </div>

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
                  <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-zinc-400">
                    {label}
                  </p>
                  <p className="text-lg font-medium text-zinc-900 leading-none mt-0.5">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-50 max-w-xs">
              <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by order ID, name, phone or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <TbFilter className="w-4 h-4 text-zinc-400" />
              {["All", ...STATUSES].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition ${filterStatus === s ? "bg-zinc-900 text-white" : "bg-white text-zinc-500 border border-zinc-200 hover:border-zinc-400"}`}
                >
                  {s}
                </button>
              ))}
            </div>
            <p className="ml-auto text-[11px] text-zinc-400 font-medium">
              {filtered.length} of {orders.length} orders
            </p>
          </div>

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
                        className="text-left px-5 py-3.5 text-[9px] font-medium uppercase tracking-[0.22em] text-zinc-400 whitespace-nowrap"
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
                        filterStatus={filterStatus}
                        onStatusChange={handleStatusChange}
                        onCancel={handleCancel}
                        onRestore={handleRestore}
                        onEmail={setEmailModal}
                        emailSentAt={emailSentLog[order._id] || null}
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
