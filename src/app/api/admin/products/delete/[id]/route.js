import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import productModel from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import { deleteMultipleFromCloudinary } from "@/lib/cloudinary";

export async function DELETE(request, { params }) {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const removedImages = product.images.map((img) => img.url);

    if (removedImages.length > 0) {
      await deleteMultipleFromCloudinary(removedImages);
    }
    await productModel.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "Product removed successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
