// src/app/api/products/best-seller/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Find best-selling products based on rating (0-5), sorted descending
    const bestSellers = await Product.find({
      rating: { $gte: 0, $lte: 5 },
    })
      .sort({ rating: -1 }) // highest rated first
      .limit(8)
      .lean();

    // Return 404 if no products found
    if (!bestSellers || bestSellers.length === 0) {
      return NextResponse.json(
        { message: "No Best Sellers found" },
        { status: 404 },
      );
    }

    // Return the best-sellers
    return NextResponse.json(bestSellers, { status: 200 });
  } catch (error) {
    console.error("GET error (best-seller):", error);

    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
