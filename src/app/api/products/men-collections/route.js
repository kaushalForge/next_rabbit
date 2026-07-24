import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { slugify } from "@/utils/slugify";

export async function GET() {
  try {
    await dbConnect();

    // Fetch men's products and select only required fields
    const menProducts = await Product.find(
      { "fashion.gender": "Male" },
      {
        _id: 1,
        name: 1,
        rating: 1,
        images: { $slice: 1 }, // only first image
        "fashion.price": 1,
        "fashion.offerPrice": 1,
      },
    )
      .limit(8)
      .lean();

    if (!menProducts || menProducts.length === 0) {
      return NextResponse.json(
        { message: "No men's collection found" },
        { status: 404 },
      );
    }

    // Map products to required structure
    const formattedProducts = menProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      slug: slugify(p.name),
      rating: p.rating || 0,
      images: p.images?.[0]
        ? [{ url: p.images[0].url, altText: p.images[0].altText || p.name }]
        : [],
      price: p.fashion?.[0]?.price || null,
      offerPrice: p.fashion?.[0]?.offerPrice || null,
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/men error:", error);

    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 },
    );
  }
}
