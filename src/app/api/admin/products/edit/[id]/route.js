import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import {
  uploadMultipleToCloudinary,
  deleteMultipleFromCloudinary,
} from "@/lib/cloudinary";

/* ================= HELPERS ================= */
const safeString = (val) => (typeof val === "string" ? val.trim() : "");
const safeNumber = (val) =>
  val !== undefined && val !== null ? Number(val) : 0;
const safeBool = (val) => val === "true" || val === true;

// Convert string / JSON array to string array
const parseStringArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val))
    return val.map((v) => String(v).trim()).filter(Boolean);
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr)) return arr.map((v) => String(v).trim());
  } catch {}
  return String(val)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
};

// ✅ Convert ANY value to Number (not array)
const parseNumber = (val) => {
  if (val === undefined || val === null) return 0;
  return Number(val) || 0;
};

// Normalize main category
const normalizeMainCategory = (v) => {
  if (/^fashion$/i.test(v)) return "Fashion";
  if (/^food$/i.test(v)) return "Food";
  return null;
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
  if (!mainCategory)
    return NextResponse.json(
      { message: "Invalid mainCategory (Fashion | Food)" },
      { status: 400 },
    );

  /* ================= IMAGES ================= */
  const uploadedFiles = formData.getAll("images");
  const existingImagesRaw = formData.getAll("existingImages[]");

  // Convert existing images from frontend (already in new order)
  const existingImages = existingImagesRaw.map((v) => {
    try {
      const parsed = JSON.parse(v);
      if (parsed && parsed.url)
        return { url: parsed.url, altText: parsed.altText || "" };
      return { url: String(v), altText: "" };
    } catch {
      return { url: String(v), altText: "" };
    }
  });

  // Handle newly uploaded files
  const buffers = [];
  for (const file of uploadedFiles) {
    if (file instanceof File)
      buffers.push(Buffer.from(await file.arrayBuffer()));
  }
  const uploadedUrls = buffers.length
    ? await uploadMultipleToCloudinary(buffers, "Rabbit")
    : [];

  // Remove deleted images from Cloudinary
  const removedImages = product.images
    .filter((img) => !existingImages.some((e) => e.url === (img.url || img)))
    .map((img) => img.url || img);

  if (removedImages.length) await deleteMultipleFromCloudinary(removedImages);

  // Combine existing images in the order received from frontend + newly uploaded
  const finalImages = [
    ...existingImages, // <-- THIS preserves the frontend order
    ...uploadedUrls.map((url) => ({
      url,
      altText: safeString(formData.get("name")) || product.name,
    })),
  ].slice(0, 6); // limit to 6 images

  /* ================= FASHION ================= */
  let fashion = [];
  if (mainCategory === "Fashion") {
    fashion = formData
      .getAll("fashion[]")
      .map((item) => {
        try {
          const parsed = JSON.parse(item);
          return {
            color: parseStringArray(parsed.color),
            size: parseStringArray(parsed.size),
            price: parseNumber(parsed.price), // ✅ number
            offerPrice: parseNumber(parsed.offerPrice), // ✅ number
            stock: Number(parsed.stock) || 0,
            sku: safeString(parsed.sku),
            gender: safeString(parsed.gender),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  /* ================= FOOD ================= */
  let food = [];
  if (mainCategory === "Food") {
    food = formData
      .getAll("food[]")
      .map((item) => {
        try {
          const parsed = JSON.parse(item);
          return {
            sku: safeString(parsed.sku),
            foodType: safeString(parsed.foodType),
            weight: parseStringArray(parsed.weight),
            taste: safeString(parsed.taste),
            price: parseNumber(parsed.price), // ✅ number
            offerPrice: parseNumber(parsed.offerPrice), // ✅ number
            batchNumber: safeString(parsed.batchNumber),
            stock: Number(parsed.stock) || 0,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  /* ================= BULLETS ================= */
  const bulletDescription = formData.getAll("bulletDescription[]") || [];
  const bulletKeyValueDescription = (
    formData.getAll("bulletKeyValueDescription[]") || []
  )
    .map((v) => {
      try {
        const parsed = JSON.parse(v);
        return parsed?.key && parsed?.value ? parsed : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  /* ================= UPDATE DOC ================= */
  const updateDoc = {
    name: safeString(formData.get("name")),
    description: safeString(formData.get("description")),
    mainCategory,
    images: finalImages,
    tags: formData.getAll("tags[]") || [],
    bulletDescription,
    bulletKeyValueDescription,
    category: safeString(formData.get("category")),
    metaTitle: safeString(formData.get("metaTitle")),
    metaDescription: safeString(formData.get("metaDescription")),
    isFeatured: safeBool(formData.get("isFeatured")),
    isNewArrival: safeBool(formData.get("isNewArrival")),
    isBestSeller: safeBool(formData.get("isBestSeller")),
    isTrending: safeBool(formData.get("isTrending")),
    isOnSale: safeBool(formData.get("isOnSale")),
    isPublished: safeBool(formData.get("isPublished")),
    rating: safeNumber(formData.get("rating")),
    countryOfOrigin: safeString(formData.get("countryOfOrigin")),
    brand: safeString(formData.get("brand")),
    weight: safeString(formData.get("weight")),
    material: safeString(formData.get("material")),
    fashion: fashion.length ? fashion : undefined,
    food: food.length ? food : undefined,
  };

  Object.keys(updateDoc).forEach(
    (k) => updateDoc[k] === undefined && delete updateDoc[k],
  );

  const updatedProduct = await Product.findByIdAndUpdate(id, updateDoc, {
    new: true,
    runValidators: true,
  });

  return NextResponse.json({
    message: "Product updated successfully",
    updatedProduct,
  });
};
