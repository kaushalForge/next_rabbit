import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Order from "@/models/order";
import { isAdmin } from "@/lib/isAdmin";

export async function GET() {
  const auth = await isAdmin();

  if (!auth) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 },
    );
  }

  try {
    await dbConnect();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, orders }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
