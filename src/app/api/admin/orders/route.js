import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Order from "@/models/order";
import User from "@/models/user"; // required for populate
import { isAdmin } from "@/lib/isAdmin";
import mongoose from "mongoose";

// ------------------- GET ALL ORDERS -------------------
export async function GET() {
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error("GET /admin/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}

const VALID_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const VALID_PAY_STATUSES = ["Pending", "Paid", "Failed", "Returned"];
const VALID_PAY_METHODS = ["COD", "eSewa", "Khalti", "Online", "Card"];

export async function PUT(req) {
  const admin = (await isAdmin())?.user;
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();

    const { orderId, shipmentId, status, paymentStatus, paymentMethod, paymentVerified } =
      await req.json();

    // ── Validate orderId ──
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId))
      return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });

    // ── Validate shipmentId early if provided ──
    if (shipmentId && !mongoose.Types.ObjectId.isValid(shipmentId))
      return NextResponse.json(
        { message: "Invalid shipmentId" },
        { status: 400 },
      );

    // ── Validate enum values ──
    if (status && !VALID_STATUSES.includes(status))
      return NextResponse.json(
        { message: `Invalid status: ${status}` },
        { status: 400 },
      );

    if (paymentStatus && !VALID_PAY_STATUSES.includes(paymentStatus))
      return NextResponse.json(
        { message: `Invalid paymentStatus: ${paymentStatus}` },
        { status: 400 },
      );

    if (paymentMethod && !VALID_PAY_METHODS.includes(paymentMethod))
      return NextResponse.json(
        { message: `Invalid paymentMethod: ${paymentMethod}` },
        { status: 400 },
      );

    // ── Require at least one field ──
    if (!status && !paymentStatus && !paymentMethod && paymentVerified === undefined)
      return NextResponse.json(
        {
          message:
            "Provide at least one of: status, paymentStatus, paymentMethod, paymentVerified",
        },
        { status: 400 },
      );

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    if (shipmentId) {
      const shipment = order.shipments.id(shipmentId);
      const cancelledShipment = !shipment
        ? order.cancelledProducts?.find(
            (sh) => sh._id?.toString() === shipmentId,
          )
        : null;

      if (!shipment && !cancelledShipment)
        return NextResponse.json(
          { message: "Shipment not found" },
          { status: 404 },
        );

      // Status — only on active shipments
      if (status) {
        if (cancelledShipment)
          return NextResponse.json(
            {
              message:
                "Cannot update status of a cancelled shipment. Restore it first.",
            },
            { status: 400 },
          );
        shipment.status = status;
      }

      // Payment verified
      if (paymentVerified !== undefined) {
        if (shipment) {
          if (!shipment.payment) shipment.payment = {};
          shipment.payment.verified = paymentVerified;
        } else if (cancelledShipment) {
          await Order.updateOne(
            { _id: orderId },
            { $set: { "cancelledProducts.$[el].payment.verified": paymentVerified } },
            { arrayFilters: [{ "el._id": new mongoose.Types.ObjectId(shipmentId) }] },
          );
          return NextResponse.json(
            { success: true, message: "Updated successfully" },
            { status: 200 },
          );
        }
      }

      // Payment
      if (paymentStatus || paymentMethod) {
        if (shipment) {
          // Active — Mongoose tracks mutations normally
          if (!shipment.payment) shipment.payment = {};
          if (paymentStatus) shipment.payment.status = paymentStatus;
          if (paymentMethod) shipment.payment.method = paymentMethod;
        } else {
          // Cancelled — untyped array, must use $set + arrayFilters
          const setFields = {};
          if (paymentStatus)
            setFields["cancelledProducts.$[el].payment.status"] = paymentStatus;
          if (paymentMethod)
            setFields["cancelledProducts.$[el].payment.method"] = paymentMethod;

          await Order.updateOne(
            { _id: orderId },
            { $set: setFields },
            {
              arrayFilters: [
                { "el._id": new mongoose.Types.ObjectId(shipmentId) },
              ],
            },
          );

          return NextResponse.json(
            { success: true, message: "Updated successfully" },
            { status: 200 },
          );
        }
      }
    }

    await order.save();
    return NextResponse.json(
      { success: true, message: "Updated successfully", order },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /api/admin/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
// ------------------- CANCEL SPECIFIC SHIPMENT -------------------
export async function PATCH(req) {
  const admin = (await isAdmin())?.user;
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();
    const { orderId, shipmentId } = await req.json();

    if (
      !orderId ||
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !shipmentId ||
      !mongoose.Types.ObjectId.isValid(shipmentId)
    ) {
      return NextResponse.json(
        { message: "Invalid orderId or shipmentId" },
        { status: 400 },
      );
    }

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    const shipment = order.shipments.id(shipmentId);
    if (!shipment)
      return NextResponse.json(
        { message: "Shipment not found" },
        { status: 404 },
      );

    shipment.status = "Cancelled";

    if (!Array.isArray(order.cancelledProducts)) order.cancelledProducts = [];
    order.cancelledProducts.push({
      ...shipment.toObject(),
      cancelledAt: new Date(),
    });

    shipment.deleteOne();

    order.totalPrice = order.shipments.reduce(
      (sum, s) => sum + (s.shipmentTotal || 0),
      0,
    );

    await order.save();

    return NextResponse.json(
      { success: true, message: "Shipment cancelled", order },
      { status: 200 },
    );
  } catch (err) {
    console.error("PATCH /admin/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}

// ------------------- SEND EMAIL TO CUSTOMER -------------------
export async function POST_EMAIL(req) {
  const admin = (await isAdmin())?.user;
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();
    const { orderId, subject, message } = await req.json();

    if (!orderId || !subject || !message)
      return NextResponse.json(
        { message: "Missing orderId, subject, or message" },
        { status: 400 },
      );

    const order = await Order.findById(orderId).populate(
      "userId",
      "email name",
    );
    if (!order || !order.userId?.email)
      return NextResponse.json(
        { message: "User email not found" },
        { status: 404 },
      );

    const emailSent = await sendEmail({
      to: order.userId.email,
      subject,
      text: message,
    });

    if (!emailSent)
      return NextResponse.json(
        { message: "Failed to send email" },
        { status: 500 },
      );

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (err) {
    console.error("POST_EMAIL /admin/orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
