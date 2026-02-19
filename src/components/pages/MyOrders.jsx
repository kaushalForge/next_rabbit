"use client";

import { useOrders } from "@/app/context/OrderContext";
import { useEffect } from "react";
import Image from "next/image";
import { MdPayment, MdPerson, MdPhone, MdLocationOn } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Spinner } from "../ui/spinner";
import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { Button } from "../ui/button";

const MyOrders = () => {
  const {
    orders,
    allShipments,
    cancelledShipments,
    cancelShipment,
    loading,
    refreshOrders,
  } = useOrders();
  const { currentUser } = useAuth();

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-gray-100 text-gray-500",
  };

  const paymentStatusColors = {
    Pending: "bg-yellow-50 text-yellow-800 ring-1 ring-yellow-200",
    Paid: "bg-green-50 text-green-800 ring-1 ring-green-200",
    Refunded: "bg-blue-50 text-blue-800 ring-1 ring-blue-200",
    Failed: "bg-red-50 text-red-800 ring-1 ring-red-200",
  };

  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  const handleOrderCancellation = async (shipmentId) => {
    if (!shipmentId) {
      toast.error("Failed to cancel order: no shipment selected", {
        richColors: true,
      });
      return;
    }

    // Ask for confirmation using simple window.confirm
    const userConfirmed = window.confirm(
      "Are you sure you want to cancel this order? This cannot be undone.",
    );
    if (!userConfirmed) return; // User clicked "Cancel"

    try {
      const { status, message, success } = await cancelShipment(shipmentId);

      if (success && (status === 200 || status === 201)) {
        toast.success(message || "Order cancelled successfully", {
          richColors: true,
        });
        await refreshOrders();
      } else {
        toast.error(message || "Failed to cancel order", { richColors: true });
      }
    } catch (err) {
      console.error("handleOrderCancellation error:", err);
      toast.error("Failed to cancel order!", { richColors: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="w-14 h-14 text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        No user data available.
      </div>
    );
  }

  const activeShipments = allShipments || [];
  const cancelled = cancelledShipments || [];

  if (!activeShipments.length && !cancelled.length) {
    return (
      <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="w-full p-4 bg-gray-900 text-white font-semibold text-start">
          Active Orders
        </div>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <p className="text-gray-500 text-center text-base">No orders yet!</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <button
              className="bg-[#ff4500] hover:scale-105 ease-in-out duration-100 transition-all text-white font-medium px-6 py-2 rounded-md shadow-sm"
              onClick={() => (window.location.href = "/collections/all")}
            >
              View All Collections
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderTable = (shipments, isCancelled = false) => (
    <Table className="min-w-full table-auto">
      <TableHeader>
        <TableRow className="bg-gray-50">
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Customer
          </TableHead>
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Delivery
          </TableHead>
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Products
          </TableHead>
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Status
          </TableHead>
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Ordered At
          </TableHead>
          {isCancelled && (
            <TableHead className={`${isCancelled && "text-gray-400"}`}>
              Cancelled At
            </TableHead>
          )}
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Payment
          </TableHead>
          <TableHead className={`${isCancelled && "text-gray-400"}`}>
            Total
          </TableHead>
          {!isCancelled && <TableHead>Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {shipments.map((shipment) => (
          <TableRow
            key={shipment._id}
            className={`transition-colors ${
              isCancelled ? "opacity-50" : "hover:bg-gray-50"
            }`}
          >
            {/* Customer */}
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MdPerson className="text-gray-500" />
                  <span className={isCancelled ? "text-gray-400" : ""}>
                    {shipment.customer?.fullName || "N/A"}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-2 text-sm ${
                    isCancelled ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <MdPhone className="text-gray-500" />
                  {shipment.customer?.phone || "-"}
                </div>
              </div>
            </TableCell>

            {/* Delivery */}
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <MdLocationOn
                    className={isCancelled ? "text-gray-400" : "text-green-500"}
                  />
                  <span className={isCancelled ? "text-gray-400" : ""}>
                    {shipment.delivery?.city || "-"},{" "}
                    {shipment.delivery?.district || "-"},{" "}
                    {shipment.delivery?.province || "-"}
                  </span>
                </div>
              </div>
            </TableCell>

            {/* Products */}
            <TableCell className="align-top">
              <div className="space-y-3">
                {(shipment.products || []).map((p, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-sm ${
                      isCancelled ? "opacity-60" : ""
                    }`}
                  >
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.name}
                        width={50}
                        height={40}
                        className="rounded-sm shrink-0"
                      />
                    )}
                    <div className="flex flex-col">
                      <span
                        className={`font-medium ${
                          isCancelled
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {p.name}
                      </span>
                      {p.mainCategory === "Fashion" && (
                        <span
                          className={`text-xs ${
                            isCancelled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          X{p.quantity} — {p.size} — {p.color}
                        </span>
                      )}
                      {p.mainCategory === "Food" && (
                        <span
                          className={`text-xs ${
                            isCancelled ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          X{p.quantity} — {p.weight}
                        </span>
                      )}
                      <div className="flex gap-2 text-xs flex-wrap">
                        <span
                          className={`${
                            isCancelled
                              ? "line-through text-gray-400"
                              : "text-gray-500"
                          }`}
                        >
                          Rs.{p.price || 0}
                        </span>
                        <span
                          className={`font-medium ${
                            isCancelled ? "text-gray-400" : "text-orange-600"
                          }`}
                        >
                          Offer Price: Rs.{p.offerPrice || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                  isCancelled
                    ? "bg-gray-100 text-gray-400"
                    : statusColors[shipment.status] ||
                      "bg-gray-100 text-gray-600"
                }`}
              >
                {isCancelled ? "Cancelled" : shipment.status || "Pending"}
              </span>
            </TableCell>

            {/* Ordered At */}
            <TableCell
              className={isCancelled ? "text-gray-400" : "text-gray-600"}
            >
              {shipment.createdAt &&
                new Date(shipment.createdAt).toLocaleString()}
            </TableCell>

            {/* Cancelled At */}
            {isCancelled && (
              <TableCell
                className={isCancelled ? "text-gray-400" : "text-gray-600"}
              >
                {shipment.cancelledAt &&
                  new Date(shipment.cancelledAt).toLocaleString()}
              </TableCell>
            )}

            {/* Payment */}
            <TableCell>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center">
                  <MdPayment className="text-gray-400" />
                  <span
                    className={`uppercase font-medium ${
                      isCancelled ? "text-gray-400" : ""
                    }`}
                  >
                    {shipment.payment?.method || "COD"}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                    isCancelled
                      ? "bg-gray-100 text-gray-400"
                      : paymentStatusColors[shipment.payment?.status] ||
                        "bg-gray-100 text-gray-600"
                  }`}
                >
                  {shipment.payment?.status || "Pending"}
                </span>
              </div>
            </TableCell>

            {/* Shipment Total */}
            <TableCell
              className={`font-medium ${
                isCancelled ? "text-gray-400 line-through" : "text-gray-700"
              }`}
            >
              Rs.{shipment.shipmentTotal || 0}
            </TableCell>

            {/* Actions */}
            {!isCancelled && (
              <TableCell
                className={`select-none font-xs tracking-tighter text-gray-700 ${
                  shipment.status !== "Pending"
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                <Button
                  variant="destructive"
                  disabled={shipment.status !== "Pending"}
                  onClick={() => handleOrderCancellation(shipment._id)}
                >
                  Cancel
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Active Orders */}
      {activeShipments.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-4 bg-gray-900 text-white font-semibold text-lg">
            Active Orders
          </div>
          <div className="relative z-10">{renderTable(activeShipments)}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="w-full p-4 bg-gray-900 text-white font-semibold text-start">
            Active Orders
          </div>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <p className="text-gray-500 text-center text-base">
              No orders yet!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <button
                className="bg-[#ff4500] hover:scale-105 ease-in-out duration-100 transition-all text-white font-medium px-6 py-2 rounded-md shadow-sm"
                onClick={() => (window.location.href = "/collections/all")}
              >
                View All Collections
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Orders */}
      {cancelled.length > 0 && (
        <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* subtle overlay */}
          <span className="absolute inset-0 bg-gray-50/60 pointer-events-none"></span>

          {/* header */}
          <div className="relative z-10 p-4 bg-red-900/20 text-gray-600 font-semibold text-lg">
            Cancelled Orders
          </div>

          {/* table */}
          <div className="relative z-10">{renderTable(cancelled, true)}</div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
