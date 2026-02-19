import Order from "@/models/order";
import Cart from "@/models/cart";
import { dbConnect } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/isAdmin";

const getOwner = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    if (!token) return null;
    const owner = await verifyJWT(token);
    return owner;
  } catch (error) {
    console.error("getOwner error:", error);
    return null;
  }
};

export async function GET() {
  const auth = await getOwner();

  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();

    const orders = await Order.find({
      userId: new mongoose.Types.ObjectId(auth.id),
    })
      .sort({ createdAt: -1 })
      .lean();

    const transformedOrders = orders.map((order) => {
      // ✅ Transform shipments
      const shipments = (order.shipments || []).map((shipment) => {
        const products = (shipment.products || []).map((p) => {
          const image =
            p.images && Array.isArray(p.images) && p.images.length > 0
              ? p.images[0].url
              : p.image || "";

          return { ...p, image };
        });

        return { ...shipment, products };
      });

      // ✅ Transform cancelledProducts (root-level array)
      const cancelledProducts = (order.cancelledProducts || []).map(
        (shipment) => {
          const products = (shipment.products || []).map((p) => {
            const image =
              p.images && Array.isArray(p.images) && p.images.length > 0
                ? p.images[0].url
                : p.image || "";

            return { ...p, image };
          });

          return { ...shipment, products };
        },
      );

      // ✅ Return BOTH properly
      return {
        ...order,
        shipments,
        cancelledProducts,
      };
    });

    return NextResponse.json(
      { success: true, orders: transformedOrders },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const user = await getOwner();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { products, customer, delivery, payment } = body;

    // ---------------- VALIDATIONS ----------------
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

    // ---------------- CALCULATE TOTALS ----------------
    const productsTotal = products.reduce(
      (sum, p) => sum + (p.offerPrice || p.price || 0) * (p.quantity || 1),
      0,
    );

    // Sum shipping fees per shipment (assuming all products share the same shipping fee)
    const shippingFee = products[0]?.shippingFee || 0;

    const shipmentTotal = productsTotal + shippingFee;

    // ---------------- CREATE SHIPMENT OBJECT ----------------
    const newShipment = {
      customer,
      delivery,
      products,
      shippingFee,
      shipmentTotal,
      payment,
      status: "Pending",
    };

    // ---------------- FIND EXISTING ORDER ----------------
    let existingOrder = await Order.findOne({
      userId: user.id,
      orderStatus: "Pending",
    });

    let finalOrder;

    if (existingOrder) {
      existingOrder.shipments.push(newShipment);

      // Recalculate totalPrice based on all shipment totals
      existingOrder.totalPrice = existingOrder.shipments.reduce(
        (sum, shipment) => sum + (shipment.shipmentTotal || 0),
        0,
      );

      finalOrder = await existingOrder.save();
    } else {
      // Create new order
      finalOrder = await Order.create({
        userId: user.id,
        shipments: [newShipment],
        totalPrice: shipmentTotal,
        orderStatus: "Pending",
      });
    }

    // ---------------- CLEAR CART ----------------
    await Cart.findOneAndDelete({ userId: user.id });

    return NextResponse.json(
      {
        message: "Order placed successfully and cart cleared",
        order: finalOrder,
      },
      { status: existingOrder ? 200 : 201 },
    );
  } catch (error) {
    console.error("Order POST error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const user = await getOwner();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized user" },
        { status: 401 },
      );
    }

    const { shipmentId } = await req.json();

    if (!shipmentId || !mongoose.Types.ObjectId.isValid(shipmentId)) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing shipmentId" },
        { status: 400 },
      );
    }

    // ✅ Since one order per user
    const order = await Order.findOne({
      userId: new mongoose.Types.ObjectId(user.id),
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 },
      );
    }

    // ✅ Find shipment inside shipments array
    const shipment = order.shipments.id(shipmentId);

    if (!shipment) {
      return NextResponse.json(
        { success: false, message: "Shipment not found" },
        { status: 404 },
      );
    }

    // 🚫 Optional safety check
    if (["Shipped", "Delivered"].includes(shipment.status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot cancel shipped or delivered shipment",
        },
        { status: 400 },
      );
    }

    // ✅ Initialize cancelledProducts if not exists
    if (!Array.isArray(order.cancelledProducts)) {
      order.cancelledProducts = [];
    }

    // ✅ Move shipment to cancelledProducts
    order.cancelledProducts.push({
      ...shipment.toObject(),
      cancelledAt: new Date(),
    });

    // ✅ Remove from shipments
    shipment.deleteOne();

    // ✅ Recalculate totalPrice (based only on active shipments)
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

// GET ALL ORDERS (admin)
// export async function GET() {
//   try {
//     await dbConnect();

//     const orders = await Order.find()
//       .sort({ createdAt: -1 })
//       .populate("userId", "name email");

//     return NextResponse.json(orders);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
