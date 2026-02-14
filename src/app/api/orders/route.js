import Order from "@/models/order";
import Cart from "@/models/cart";
import { dbConnect } from "@/lib/dbConnection";
import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
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
    if (!products?.length) {
      return NextResponse.json(
        { message: "Products are required" },
        { status: 400 },
      );
    }

    if (!customer?.fullName || !customer?.phone) {
      return NextResponse.json(
        { message: "Customer info missing" },
        { status: 400 },
      );
    }

    if (!delivery?.province || !delivery?.district || !delivery?.city) {
      return NextResponse.json(
        { message: "Delivery info missing" },
        { status: 400 },
      );
    }

    if (!payment?.method) {
      return NextResponse.json(
        { message: "Payment method required" },
        { status: 400 },
      );
    }

    // ---------------- CALCULATE SHIPMENT TOTAL ----------------
    const shipmentTotal = products.reduce((sum, item) => {
      const price = item.offerPrice || item.price || 0;
      return sum + price * item.quantity;
    }, 0);

    // ---------------- CREATE SHIPMENT OBJECT ----------------
    const newShipment = {
      customer,
      delivery,
      products,
      shipmentTotal, // calculated here
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
      // Append new shipment
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

    // ✅ Fetch only orders of current authenticated user
    const orders = await Order.find({ userId: auth.id })
      .sort({ createdAt: -1 })
      .lean();

    // Transform orders to include one image per product
    const transformedOrders = orders.map((order) => {
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

      return { ...order, shipments };
    });

    return NextResponse.json(
      { success: true, orders: transformedOrders },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

