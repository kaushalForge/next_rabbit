import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Order from "@/models/order";
import User from "@/models/user"; // required for populate
import { isAdmin } from "@/lib/isAdmin";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

// ------------------- Helper: send email -------------------
const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "inbox.rabbit@gmail.com",
        pass: process.env.RABBIT_EMAIL_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: '"RabbitHub" <inbox.rabbit@gmail.com>',
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
};

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

// ------------------- UPDATE ORDER STATUS -------------------
export async function PUT(req) {
  const admin = (await isAdmin())?.user;
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();
    const { orderId, status, shipmentId } = await req.json();

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId))
      return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    if (shipmentId) {
      const shipment = order.shipments.id(shipmentId);
      if (!shipment)
        return NextResponse.json(
          { message: "Shipment not found" },
          { status: 404 },
        );
      shipment.status = status;
    } else {
      order.orderStatus = status;
    }

    await order.save();

    return NextResponse.json(
      { success: true, message: "Status updated", order },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /admin/orders error:", err);
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
