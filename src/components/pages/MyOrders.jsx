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

const MyOrders = () => {
  const { orders, allShipments, loading, refreshOrders } = useOrders();
  const { currentUser } = useAuth();

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Delivered: "bg-green-100 text-green-800",
    Canceled: "bg-red-100 text-red-800",
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

  // Handle loading
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="w-14 h-14 text-primary" />
      </div>
    );
  }

  // Handle no user
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        No user data available.
      </div>
    );
  }

  // Handle no orders
  if (!allShipments || allShipments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 text-lg font-medium">
        You have no orders yet.
      </div>
    );
  }

  // Group shipments by orderId
  const ordersMap = allShipments.reduce((acc, shipment) => {
    const orderId = shipment.orderId || "Unknown";
    if (!acc[orderId]) acc[orderId] = [];
    acc[orderId].push(shipment);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-6">
      {Object.entries(ordersMap).map(([orderId, shipments]) => (
        <div
          key={orderId}
          className="overflow-hidden rounded-xl border border-gray-200"
        >
          {/* Order Header */}
          <div className="p-4 bg-black text-white font-semibold flex justify-between items-center">
            <div className="text-base">
              Created:{" "}
              {shipments[0]?.createdAt &&
                new Date(shipments[0].createdAt).toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <span>
                Total: Rs.
                {shipments.reduce((sum, s) => sum + (s.shipmentTotal || 0), 0)}
              </span>
            </div>
          </div>

          {/* Orders Table */}
          <Table className="min-w-full table-auto">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Customer Details</TableHead>
                <TableHead>Delivery Details</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ordered At</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {shipments.map((shipment) => (
                <TableRow
                  key={shipment._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Customer */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-gray-500" />
                        <span>{shipment.customer?.fullName || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MdPhone className="text-gray-500" />
                        {shipment.customer?.phone || "-"}
                      </div>
                    </div>
                  </TableCell>

                  {/* Delivery */}
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="text-green-500" />
                        <span>
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
                          className="flex items-center gap-2 text-sm"
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
                            <span className="font-medium text-gray-800">
                              {p.name}
                            </span>
                            <span className="text-gray-500 text-xs">
                              X{p.quantity} — {p.size} — {p.color}
                            </span>
                            <div className="flex gap-2 text-xs flex-wrap">
                              <span className="text-gray-500 line-through">
                                Rs.{p.price || 0}
                              </span>
                              <span className="text-orange-600 font-medium">
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
                        statusColors[shipment.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {shipment.status || "Pending"}
                    </span>
                  </TableCell>

                  {/* Ordered At */}
                  <TableCell className="text-sm text-gray-600">
                    {shipment.createdAt &&
                      new Date(shipment.createdAt).toLocaleString()}
                  </TableCell>

                  {/* Payment */}
                  <TableCell>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center">
                        <MdPayment className="text-gray-400" />
                        <span className="uppercase font-medium">
                          {shipment.payment?.method || "COD"}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold w-fit ${
                          paymentStatusColors[shipment.payment?.status] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {shipment.payment?.status || "Pending"}
                      </span>
                    </div>
                  </TableCell>

                  {/* Shipment Total */}
                  <TableCell className="font-medium text-gray-700">
                    Rs.{shipment.shipmentTotal || 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
