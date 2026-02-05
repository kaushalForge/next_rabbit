import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function GET() {
  try {
    await dbConnect();

    const bestSellers = await Product.find({
      rating: { $gte: 0, $lte: 5 },
    })
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    if (!bestSellers.length) {
      return NextResponse.json(
        { message: "No Best Sellers found" },
        { status: 404 },
      );
    }

    return NextResponse.json(bestSellers, { status: 200 });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
