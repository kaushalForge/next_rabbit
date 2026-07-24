import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

const safeString = (val) => (typeof val === "string" ? val.trim() : "");

// Helper to convert a value to string array (for color, size, weight etc.)
const parseStringArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => v.trim()).filter(Boolean);
  try {
    const arr = JSON.parse(val);
    if (Array.isArray(arr)) return arr.map((v) => String(v).trim());
    return [];
  } catch {
    return val
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
};

// Helper to convert value to number
const parseNumber = (val) => {
  const n = Number(val);
  return isNaN(n) ? 0 : n;
};

export const POST = async (req) => {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  const name = safeString(formData.get("name"));
  const description = safeString(formData.get("description"));
  const mainCategory = safeString(formData.get("mainCategory"));

  if (!name || !description || !mainCategory)
    return NextResponse.json(
      { message: "Name, description, and mainCategory are required" },
      { status: 400 },
    );

  // Prevent duplicate
  const existingProduct = await Product.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existingProduct)
    return NextResponse.json(
      { message: "Product with this name already exists!" },
      { status: 409 },
    );

  // Upload images
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

  // ---------- Fashion ----------
  let fashion = [];
  if (/^fashion$/i.test(mainCategory)) {
    const rawFashion = formData.getAll("fashion[]");
    fashion = rawFashion
      .map((item) => {
        try {
          const parsed = JSON.parse(item);
          return {
            color: parseStringArray(parsed.color),
            size: parseStringArray(parsed.size),
            price: parseNumber(parsed.price), // number
            offerPrice: parseNumber(parsed.offerPrice), // number
            stock: parseNumber(parsed.stock),
            sku: safeString(parsed.sku),
            gender: safeString(parsed.gender),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  // ---------- Food ----------
  let food = [];
  if (/^food$/i.test(mainCategory)) {
    const rawFood = formData.getAll("food[]");
    food = rawFood
      .map((item) => {
        try {
          const parsed = JSON.parse(item);
          return {
            sku: safeString(parsed.sku),
            foodType: safeString(parsed.foodType),
            weight: parseStringArray(parsed.weight),
            taste: safeString(parsed.taste),
            price: parseNumber(parsed.price), // number
            offerPrice: parseNumber(parsed.offerPrice), // number
            batchNumber: safeString(parsed.batchNumber),
            stock: parseNumber(parsed.stock),
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  }

  // ---------- Other fields ----------
  const productObj = {
    user: admin.id,
    name,
    description,
    mainCategory:
      mainCategory.charAt(0).toUpperCase() +
      mainCategory.slice(1).toLowerCase(),
    images,
    tags: formData.getAll("tags[]") || [],
    bulletDescription: formData.getAll("bulletDescription[]") || [],
    bulletKeyValueDescription: (
      formData.getAll("bulletKeyValueDescription[]") || []
    )
      .map((v) => {
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      })
      .filter(Boolean),
    metaTitle: safeString(formData.get("metaTitle")),
    metaDescription: safeString(formData.get("metaDescription")),
    adminNotes: safeString(formData.get("adminNotes")),
    category: safeString(formData.get("category")),
    isFeatured: formData.get("isFeatured") === "true",
    isNewArrival: formData.get("isNewArrival") === "true",
    isBestSeller: formData.get("isBestSeller") === "true",
    isTrending: formData.get("isTrending") === "true",
    isOnSale: formData.get("isOnSale") === "true",
    isPublished: formData.get("isPublished") === "true",
    rating: parseNumber(formData.get("rating")),
    countryOfOrigin: safeString(formData.get("countryOfOrigin")),
    brand: safeString(formData.get("brand")),
    weight: safeString(formData.get("weight")),
    material: safeString(formData.get("material")),
    fashion: fashion.length ? fashion : undefined,
    food: food.length ? food : undefined,
  };

  const newProduct = await Product.create(productObj);

  return NextResponse.json(
    { message: "Product created successfully!", newProduct },
    { status: 201 },
  );
};
