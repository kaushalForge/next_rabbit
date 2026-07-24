import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";

export const PATCH = async (req, { params }) => {
  await dbConnect();
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const { isPublished } = await req.json();
  const updated = await Product.findByIdAndUpdate(
    id,
    { isPublished: !!isPublished },
    { new: true },
  );

  return NextResponse.json({
    message: `Product ${updated.isPublished ? "published" : "unpublished"}`,
    isPublished: updated.isPublished,
  });
};
