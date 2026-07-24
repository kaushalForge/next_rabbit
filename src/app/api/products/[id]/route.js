import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import mongoose from "mongoose";
import { slugify } from "@/utils/slugify";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await dbConnect();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    let productData;

    if (isObjectId) {
      productData = await Product.findOne({ _id: id }).lean();
    } else {
      productData = await Product.findOne({ slug: id }).lean();
      if (!productData) {
        const nameRegex = id.replace(/-/g, "\\W+");
        productData = await Product.findOne({
          name: { $regex: nameRegex, $options: "i" },
        }).lean();
      }
    }

    if (!productData) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    productData.slug ||= slugify(productData.name);

    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
