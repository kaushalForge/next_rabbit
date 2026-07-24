// src/app/api/products/best-seller/route.js

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { slugify } from "@/utils/slugify";

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Find best-selling products based on rating (0-5), sorted descending
    const bestSellers = await Product.find({
      rating: { $gte: 0, $lte: 5 },
    })
      .select("-adminNotes")
      .sort({ rating: -1 })
      .limit(8)
      .lean();

    for (const p of bestSellers) p.slug ||= slugify(p.name);

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
