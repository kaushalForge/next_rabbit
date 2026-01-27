import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function fetchAdminProducts() {
  try {
    await dbConnect();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("fetchAdminProducts:", error.message);

    if (
      error.message === "Not authenticated" ||
      error.message === "Not authorized as admin"
    ) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
