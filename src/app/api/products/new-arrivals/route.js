import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function GET() {
  try {
    await dbConnect();

    // Fetch only products that are marked as features (new arrivals)
    const newArrivals = await Product.find({
      isFeatured: true,
      isPublished: true,
    })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    if (!newArrivals || newArrivals.length === 0) {
      return NextResponse.json(
        { message: "No New Arrivals found" },
        { status: 404 },
      );
    }

    return NextResponse.json(newArrivals, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/new-arrivals error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
