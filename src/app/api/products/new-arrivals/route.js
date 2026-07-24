import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { slugify } from "@/utils/slugify";

export async function GET() {
  try {
    await dbConnect();

    const newArrivals = await Product.find({
      isNewArrival: true,
      isPublished: true,
    })
      .select("-adminNotes")
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    for (const p of newArrivals) p.slug ||= slugify(p.name);

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
