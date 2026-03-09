import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { isAdmin } from "@/lib/isAdmin";
import { dbConnect } from "@/lib/dbConnection";
import Order from "@/models/order";

export async function PUT(req) {
  const admin = (await isAdmin())?.user;
  if (!admin)
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );

  try {
    await dbConnect();

    const { orderId, shipmentId } = await req.json();

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId))
      return NextResponse.json({ message: "Invalid orderId" }, { status: 400 });

    if (!shipmentId || !mongoose.Types.ObjectId.isValid(shipmentId))
      return NextResponse.json(
        { message: "Invalid shipmentId" },
        { status: 400 },
      );

    const order = await Order.findById(orderId);
    if (!order)
      return NextResponse.json({ message: "Order not found" }, { status: 404 });

    // Find the shipment inside cancelledProducts
    const cancelledIndex = order.cancelledProducts.findIndex(
      (sh) => sh._id?.toString() === shipmentId,
    );

    if (cancelledIndex === -1)
      return NextResponse.json(
        { message: "Shipment not found in cancelled products" },
        { status: 404 },
      );

    // Pull it out, reset status to Pending, push back into shipments
    const [shipment] = order.cancelledProducts.splice(cancelledIndex, 1);
    shipment.status = "Pending";
    order.shipments.push(shipment);

    // If all shipments were cancelled before, reset orderStatus too
    if (order.orderStatus === "Cancelled") {
      order.orderStatus = "Pending";
    }

    await order.save();

    return NextResponse.json(
      { success: true, message: "Shipment restored successfully", order },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT /api/admin/orders/restore error:", err);
    return NextResponse.json(
      { success: false, message: "Server error", error: err.message },
      { status: 500 },
    );
  }
}
