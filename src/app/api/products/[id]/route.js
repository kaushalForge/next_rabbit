import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await dbConnect();

    const productData = await Product.findById(id).lean();

    if (!productData) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
