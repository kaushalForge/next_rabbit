import Order from "@/models/order";
import { dbConnect } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// Helper to transform product images
const transformProducts = (products = []) =>
  products.map((p) => ({
    ...p,
    image:
      Array.isArray(p.images) && p.images.length
        ? p.images[0].url
        : p.image || "",
  }));

// ----------------------- GET SINGLE ORDER -----------------------
export async function GET(req, { params }) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const order = await Order.findById(params.id).populate(
      "userId",
      "name email",
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Transform shipments and cancelledProducts
    const transformedOrder = {
      ...order.toObject(),
      shipments: (order.shipments || []).map((s) => ({
        ...s,
        products: transformProducts(s.products),
      })),
      cancelledProducts: (order.cancelledProducts || []).map((s) => ({
        ...s,
        products: transformProducts(s.products),
      })),
    };

    return NextResponse.json(
      { success: true, order: transformedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET single order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ----------------------- UPDATE ORDER -----------------------
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const body = await req.json();

    // Only allow certain fields to be updated
    const allowedFields = ["orderStatus", "totalPrice", "payment"];
    const updateData = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) updateData[key] = body[key];
    }

    const updatedOrder = await Order.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, order: updatedOrder },
      { status: 200 },
    );
  } catch (error) {
    console.error("PUT order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ----------------------- DELETE ORDER -----------------------
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid order ID" },
        { status: 400 },
      );
    }

    const deleted = await Order.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Order deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE order error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
