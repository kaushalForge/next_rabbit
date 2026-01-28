import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function GET() {
  try {
    await dbConnect();

    const womenProducts = await Product.find({ gender: "female" })
      .limit(8)
      .lean();
    if (!womenProducts || womenProducts.length === 0) {
      return NextResponse.json(
        { message: "No women's collection found" },
        { status: 404 },
      );
    }

    return NextResponse.json(womenProducts, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/women error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
