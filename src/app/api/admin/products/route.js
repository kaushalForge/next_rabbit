import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";

export async function GET() {
  const auth = await isAdmin();

  if (!auth) {
    return NextResponse.json({}, { status: 404 });
  }

  try {
    await dbConnect();
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
