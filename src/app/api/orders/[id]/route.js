import Order from "@/models/order";
import { dbConnect } from "@/lib/dbConnection";
import { NextResponse } from "next/server";

// GET SINGLE ORDER
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const order = await Order.findById(params.id).populate(
      "userId",
      "name email",
    );

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPDATE ORDER (status, payment, etc.)
export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE ORDER
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    await Order.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Order deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
