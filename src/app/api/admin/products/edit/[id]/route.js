import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
} from "@/lib/cloudinary";

export const PATCH = async (req, { params }) => {
  await dbConnect();
  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  if (!id)
    return NextResponse.json(
      { message: "Product ID missing" },
      { status: 400 },
    );

  const formData = await req.formData();
  const uploadedFiles = formData.getAll("images");
  const existingImages = formData.getAll("existingImages[]");

  const buffers = [];
  for (const file of uploadedFiles) {
    const arrayBuffer = await file.arrayBuffer();
    buffers.push(Buffer.from(arrayBuffer));
  }

  const uploadedUrls =
    buffers.length > 0
      ? await uploadMultipleToCloudinary(buffers, "Rabbit")
      : [];

  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const removedImages = product.images
    .filter((img) => !existingImages.includes(img.url))
    .map((img) => img.url);

  if (removedImages.length > 0)
    await deleteMultipleFromCloudinary(removedImages);

  const finalImages = [
    ...product.images.filter((img) => existingImages.includes(img.url)),
    ...uploadedUrls.map((url) => ({ url, altText: product.name })),
  ].slice(0, 6);

  const restFields = {};

  formData.forEach((value, key) => {
    if (key === "images" || key === "existingImages[]") return;

    if (key.endsWith("[]")) {
      const cleanKey = key.replace("[]", "");
      if (!restFields[cleanKey]) restFields[cleanKey] = [];
      restFields[cleanKey].push(value);
    } else if (key.startsWith("dimensions[")) {
      const dimKey = key.replace("dimensions[", "").replace("]", "");
      if (!restFields.dimensions) restFields.dimensions = {};
      restFields.dimensions[dimKey] = value;
    } else if (key.startsWith("meta")) {
      restFields[key] = value;
    } else {
      restFields[key] = value;
    }
  });

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...restFields, images: finalImages },
    { new: true },
  );

  return NextResponse.json({
    message: "Product updated successfully",
    updatedProduct,
  });
};
