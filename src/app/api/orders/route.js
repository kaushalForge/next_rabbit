import Order from "@/models/order";
import Cart from "@/models/cart";
import { dbConnect } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

// ------------------- Get user from JWT cookie -------------------
const getOwner = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    if (!token) return null;

    const owner = await verifyJWT(token);
    // Expecting owner.payload.id to be MongoDB ObjectId string
    return owner.payload;
  } catch (error) {
    console.error("getOwner error:", error);
    return null;
  }
};

// ------------------- Helper: transform products -------------------
const transformProducts = (products = []) =>
  products.map((p) => ({
    ...p,
    image:
      Array.isArray(p.images) && p.images.length
        ? p.images[0].url
        : p.image || "",
  }));

// ------------------- GET ALL ORDERS -------------------
export async function GET() {
  const owner = await getOwner();
  if (!owner)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();

    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(owner.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    const transformedOrders = orders.map((order) => ({
      ...order,
      shipments: (order.shipments || []).map((s) => ({
        ...s,
        products: transformProducts(s.products),
      })),
      cancelledProducts: (order.cancelledProducts || []).map((s) => ({
        ...s,
        products: transformProducts(s.products),
      })),
    }));

    return NextResponse.json(
      { success: true, orders: transformedOrders },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET orders error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

// ------------------- POST NEW ORDER -------------------
export async function POST(req) {
  const user = await getOwner();
  if (!user)
    return NextResponse.json({ message: "Unauthorized user" }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();
    const { products, customer, delivery, payment } = body;

    // ------------------- Validations -------------------
    if (!products?.length)
      return NextResponse.json(
        { message: "Products are required" },
        { status: 400 },
      );
    if (!customer?.fullName || !customer?.phone)
      return NextResponse.json(
        { message: "Customer info missing" },
        { status: 400 },
      );
    if (!delivery?.province || !delivery?.district || !delivery?.city)
      return NextResponse.json(
        { message: "Delivery info missing" },
        { status: 400 },
      );
    if (!payment?.method)
      return NextResponse.json(
        { message: "Payment method required" },
        { status: 400 },
      );

    // ------------------- Upload screenshot if present -------------------
    if (payment?.screenshot?.startsWith("data:image")) {
      const base64 = payment.screenshot.split(",")[1];
      const buffer = Buffer.from(base64, "base64");
      const urls = await uploadMultipleToCloudinary([buffer], "payments");
      payment.screenshot = urls[0];
    }

    // ------------------- Calculate totals -------------------
    const productsTotal = products.reduce(
      (sum, p) => sum + (p.offerPrice ?? p.price ?? 0) * (p.quantity ?? 1),
      0,
    );
    const shippingFee = products[0]?.shippingFee ?? 0;
    const shipmentTotal = productsTotal + shippingFee;

    const newShipment = {
      customer,
      delivery,
      products,
      shippingFee,
      shipmentTotal,
      payment,
      status: "Pending",
    };

    // ------------------- Find existing Pending order -------------------
    let existingOrder = await Order.findOne({
      userId: new mongoose.Types.ObjectId(user.id),
      orderStatus: "Pending",
    });

    let finalOrder;
    if (existingOrder) {
      // Push products into existing order
      existingOrder.shipments.push(newShipment);
      existingOrder.totalPrice = existingOrder.shipments.reduce(
        (sum, s) => sum + (s.shipmentTotal || 0),
        0,
      );
      finalOrder = await existingOrder.save();
    } else {
      // Create new order if none exists
      finalOrder = await Order.create({
        userId: new mongoose.Types.ObjectId(user.id),
        shipments: [newShipment],
        totalPrice: shipmentTotal,
        orderStatus: "Pending",
      });
    }

    // ------------------- Clear Cart -------------------
    await Cart.deleteOne({ userId: new mongoose.Types.ObjectId(user.id) });

    return NextResponse.json(
      { message: "Order placed successfully", order: finalOrder },
      { status: existingOrder ? 200 : 201 },
    );
  } catch (error) {
    console.error("POST Order error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

// ------------------- PATCH: CANCEL SHIPMENT -------------------
export async function PATCH(req) {
  const user = await getOwner();
  if (!user)
    return NextResponse.json(
      { success: false, message: "Unauthorized user" },
      { status: 401 },
    );

  try {
    await dbConnect();
    const { shipmentId } = await req.json();

    if (!shipmentId || !mongoose.Types.ObjectId.isValid(shipmentId))
      return NextResponse.json(
        { success: false, message: "Invalid or missing shipmentId" },
        { status: 400 },
      );

    const order = await Order.findOne({
      userId: new mongoose.Types.ObjectId(user.id),
    });
    if (!order)
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );

    const shipment = order.shipments.id(shipmentId);
    if (!shipment)
      return NextResponse.json(
        { success: false, message: "Shipment not found" },
        { status: 404 },
      );

    if (["Shipped", "Delivered"].includes(shipment.status))
      return NextResponse.json(
        {
          success: false,
          message: "Cannot cancel shipped or delivered shipment",
        },
        { status: 400 },
      );

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
      {
        success: true,
        message: "Order cancelled!",
        cancelledShipment:
          order.cancelledProducts[order.cancelledProducts.length - 1],
        order,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Order error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
