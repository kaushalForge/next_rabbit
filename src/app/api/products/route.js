import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

/**
 * GET /api/products
 * Fetch all products
 */
export async function GET(request) {
  try {
    await dbConnect();

    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 },
    );
  }
}
