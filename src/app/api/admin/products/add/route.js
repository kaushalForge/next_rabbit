import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

/* ----------------- HELPERS ----------------- */
const safeParseArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const safeString = (val) => (typeof val === "string" ? val.trim() : "");

export const POST = async (req) => {
  await dbConnect();

  /* ---------- AUTH ---------- */
  const admin = await isAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  /* ---------- FORM DATA ---------- */
  const formData = await req.formData();

  const name = safeString(formData.get("name"));
  const description = safeString(formData.get("description"));
  const price = formData.get("price");

  if (!name || !description || !price) {
    return NextResponse.json(
      { message: "Name, description and price are required" },
      { status: 400 },
    );
  }

  /* ---------- DUPLICATE PRODUCT (CASE-INSENSITIVE) ---------- */
  const existingProduct = await Product.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });

  if (existingProduct) {
    return NextResponse.json(
      { message: "Product with this name already exists!" },
      { status: 409 },
    );
  }

  /* ---------- ARRAYS ---------- */
  const size = safeParseArray(formData.get("size"));
  const color = safeParseArray(formData.get("color"));
  const material = safeParseArray(formData.get("material"));
  const brand = safeParseArray(formData.get("brand"));
  const tags = safeParseArray(formData.get("tags"));

  /* ---------- DIMENSIONS ---------- */
  const dimensions = {
    length: safeString(formData.get("dimensions[length]")),
    width: safeString(formData.get("dimensions[width]")),
    height: safeString(formData.get("dimensions[height]")),
  };

  /* ---------- IMAGES ---------- */
  const uploadedFiles = formData.getAll("images");
  const buffers = [];

  for (const file of uploadedFiles) {
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffers.push(Buffer.from(arrayBuffer));
    }
  }

  const uploadedUrls =
    buffers.length > 0
      ? await uploadMultipleToCloudinary(buffers, "Rabbit")
      : [];

  const images = uploadedUrls.map((url, i) => ({
    url,
    altText: name || `Product ${i + 1}`,
  }));

  /* ---------- PRODUCT OBJECT ---------- */
  const productObj = {
    user: admin.id,
    name,
    description,
    originalPrice: formData.get("originalPrice"),
    price,
    stock: formData.get("stock"),
    size,
    color,
    material,
    brand,
    tags,
    gender: formData.get("gender"),
    category: formData.get("category"),
    weight: formData.get("weight"),
    metaTitle: formData.get("metaTitle"),
    metaDescription: formData.get("metaDescription"),
    metaKeywords: formData.get("metaKeywords"),
    dimensions,
    isFeatured: formData.get("isFeatured") === "true",
    isPublished: formData.get("isPublished") === "true",
    images,
  };

  /* ---------- SAVE ---------- */
  try {
    const newProduct = await Product.create(productObj);

    return NextResponse.json(
      { message: "Product created successfully!", newProduct },
      { status: 201 },
    );
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);

    return NextResponse.json(
      { message: "Server Error", error: err.message },
      { status: 500 },
    );
  }
};
