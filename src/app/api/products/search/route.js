import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import productModel from "@/models/product";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const collection = searchParams.get("collection");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const gender = searchParams.get("gender");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy");
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const material = searchParams.get("material");
    const brand = searchParams.get("brand");
    const limit = searchParams.get("limit");

    let query = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLowerCase() !== "all") {
      query.category = { $in: category.split(",") };
    }

    if (material && material.toLowerCase() !== "all") {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.size = { $in: size.split(",") };
    }

    if (color) {
      query.color = { $in: color.split(",") };
    }

    if (gender) {
      query.gender = { $regex: gender, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
        { metaDescription: { $regex: search, $options: "i" } },
        { metaKeywords: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    switch (sortBy) {
      case "priceAsc":
        sort = { price: 1 };
        break;
      case "priceDesc":
        sort = { price: -1 };
        break;
      case "popularity":
        sort = { rating: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      default:
        break;
    }

    const products = await productModel
      .find({ ...query, isPublished: true })
      .sort(sort)
      .limit(Number(limit) || 0)
      .lean();

    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("Search products error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
