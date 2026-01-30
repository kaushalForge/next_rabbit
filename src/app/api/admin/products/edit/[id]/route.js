import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
} from "@/lib/cloudinary";

/* ================= HELPERS ================= */
const safeString = (v) =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

const safeNumber = (v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const num = Number(v);
  return isNaN(num) ? undefined : num;
};

const safeBool = (v) => v === "true" || v === true;

const safeArray = (v) =>
  Array.isArray(v) ? v.map((x) => String(x).trim()).filter(Boolean) : undefined;

const normalizeMainCategory = (v) => {
  if (/^fashion$/i.test(v)) return "Fashion";
  if (/^food$/i.test(v)) return "Food";
  return null;
};

/* ================= VALIDATION ================= */
const validateFields = (data, mainCategory) => {
  const errors = {};

  // Common required fields
  if (!data.name) errors.name = "Name is required";
  if (data.price === undefined) errors.price = "Price is required";
  if (data.stock === undefined) errors.stock = "Stock is required";
  if (!data.mainCategory) errors.mainCategory = "Main category is required";

  // Fashion-specific
  if (mainCategory === "Fashion") {
    if (!data.fashion?.size?.length)
      errors["fashion.size"] = "At least one size is required";
    if (!data.fashion?.color?.length)
      errors["fashion.color"] = "At least one color is required";
    if (!data.fashion?.material?.length)
      errors["fashion.material"] = "At least one material is required";
  }

  // Food-specific
  if (mainCategory === "Food") {
    if (!data.food?.sku) errors["food.sku"] = "SKU is required";
    if (!data.food?.foodType) errors["food.foodType"] = "Food type is required";
  }

  return errors;
};

/* ================= PATCH PRODUCT ================= */
export const PATCH = async (req, { params }) => {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await Product.findById(id);
  if (!product)
    return NextResponse.json({ message: "Product not found" }, { status: 404 });

  const formData = await req.formData();

  /* ================= MAIN CATEGORY ================= */
  const mainCategory = normalizeMainCategory(formData.get("mainCategory"));
  if (!mainCategory) {
    return NextResponse.json(
      { message: "Invalid mainCategory (Fashion | Food)" },
      { status: 400 },
    );
  }

  /* ================= IMAGES ================= */
  const uploadedFiles = formData.getAll("images");
  const existingImages = formData.getAll("existingImages[]");

  const buffers = [];
  for (const file of uploadedFiles) {
    if (file instanceof File) {
      buffers.push(Buffer.from(await file.arrayBuffer()));
    }
  }

  const uploadedUrls =
    buffers.length > 0
      ? await uploadMultipleToCloudinary(buffers, "Rabbit")
      : [];

  const removedImages = product.images
    .filter((img) => !existingImages.includes(img.url))
    .map((img) => img.url);

  if (removedImages.length) {
    await deleteMultipleFromCloudinary(removedImages);
  }

  const finalImages = [
    ...product.images.filter((img) => existingImages.includes(img.url)),
    ...uploadedUrls.map((url) => ({ url, altText: product.name })),
  ].slice(0, 6);

  /* ================= BASE UPDATE DOC ================= */
  const updateDoc = {
    name: safeString(formData.get("name")),
    description: safeString(formData.get("description")),
    brand: safeString(formData.get("brand")),
    category: safeString(formData.get("category")),
    weight: safeString(formData.get("weight")),
    price: safeNumber(formData.get("price")),
    offerPrice: safeNumber(formData.get("offerPrice")),
    stock: safeNumber(formData.get("stock")),
    rating: safeNumber(formData.get("rating")),
    countryOfOrigin: safeString(formData.get("countryOfOrigin")),
    metaTitle: safeString(formData.get("metaTitle")),
    metaDescription: safeString(formData.get("metaDescription")),
    isFeatured: safeBool(formData.get("isFeatured")),
    isPublished: safeBool(formData.get("isPublished")),
    tags: safeArray(formData.getAll("tags[]")),
    metaKeywords: safeArray(formData.getAll("metaKeywords[]")),
    images: finalImages,
    mainCategory,
  };

  /* ================= BULLETS ================= */
  const bullets = safeArray(formData.getAll("bulletDescription[]"));
  if (bullets) updateDoc.bulletDescription = bullets;

  const kvBullets = formData
    .getAll("bulletKeyValueDescription[]")
    .map((v) => {
      try {
        const p = JSON.parse(v);
        return p?.key && p?.value ? p : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  if (kvBullets.length) updateDoc.bulletKeyValueDescription = kvBullets;

  /* ================= DIMENSIONS ================= */
  const dimensions = {
    length: safeString(formData.get("dimensions[length]")),
    width: safeString(formData.get("dimensions[width]")),
    height: safeString(formData.get("dimensions[height]")),
  };

  if (Object.values(dimensions).some(Boolean)) {
    updateDoc.dimensions = dimensions;
  }

  /* ================= CATEGORY-SPECIFIC ================= */
  const unsetDoc = {};

  if (mainCategory === "Fashion") {
    updateDoc.fashion = {
      gender: safeString(formData.get("gender")),
      size: safeArray(formData.getAll("size[]")),
      color: safeArray(formData.getAll("color[]")),
      material: safeArray(formData.getAll("material[]")),
      dimensions,
    };
    unsetDoc.food = 1;
  }

  if (mainCategory === "Food") {
    updateDoc.food = {
      sku: safeString(formData.get("sku")),
      foodType: safeString(formData.get("foodType")),
      taste: safeString(formData.get("taste")),
    };
    unsetDoc.fashion = 1;
  }

  /* ================= VALIDATION ================= */
  const errors = validateFields(updateDoc, mainCategory);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { message: "Validation failed", errors },
      { status: 400 },
    );
  }

  /* ================= CLEAN UNDEFINED ================= */
  Object.keys(updateDoc).forEach(
    (k) => updateDoc[k] === undefined && delete updateDoc[k],
  );

  /* ================= UPDATE PRODUCT ================= */
  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
      $set: updateDoc,
      ...(Object.keys(unsetDoc).length && { $unset: unsetDoc }),
    },
    { new: true, runValidators: true },
  );

  return NextResponse.json(
    {
      message: "Product updated successfully",
      updatedProduct,
    },
    { status: 200 },
  );
};
