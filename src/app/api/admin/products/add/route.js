import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import Product from "@/models/product";
import { isAdmin } from "@/lib/isAdmin";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

const safeString = (val) => (typeof val === "string" ? val.trim() : "");

/* ======================= POST PRODUCT ======================= */
export const POST = async (req) => {
  await dbConnect();

  const admin = await isAdmin();
  if (!admin)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();

  // Required
  const name = safeString(formData.get("name"));
  const description = safeString(formData.get("description"));
  const price = Number(formData.get("price") || 0);
  const mainCategory = safeString(formData.get("mainCategory"));

  if (!name || !description || !price) {
    return NextResponse.json(
      { message: "Name, description and price are required" },
      { status: 400 },
    );
  }

  // Validate mainCategory
  if (!/^fashion$/i.test(mainCategory) && !/^food$/i.test(mainCategory)) {
    return NextResponse.json(
      { message: "Invalid mainCategory. Product not added." },
      { status: 400 },
    );
  }

  // Duplicate check
  const existingProduct = await Product.findOne({
    name: { $regex: `^${name}$`, $options: "i" },
  });
  if (existingProduct)
    return NextResponse.json(
      { message: "Product with this name already exists!" },
      { status: 409 },
    );

  // Helper functions
  const toArrayField = (val) => (Array.isArray(val) ? val : val ? [val] : []);
  const safeStringField = (val) => (typeof val === "string" ? val.trim() : "");

  // Arrays
  const size = toArrayField(formData.getAll("size[]")).map(safeStringField);
  const color = toArrayField(formData.getAll("color[]")).map(safeStringField);
  const material = toArrayField(formData.getAll("material[]")).map(
    safeStringField,
  );
  const tags = toArrayField(formData.getAll("tags[]")).map(safeStringField);
  const metaKeywords = toArrayField(formData.getAll("metaKeywords[]")).map(
    safeStringField,
  );

  const bulletDescription = toArrayField(
    formData.getAll("bulletDescription[]"),
  ).map(safeStringField);
  const bulletKeyValueDescription = toArrayField(
    formData.getAll("bulletKeyValueDescription[]"),
  )
    .map((b) => {
      try {
        const parsed = JSON.parse(b);
        return parsed.key && parsed.value ? parsed : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // Strings
  const brand = safeStringField(formData.get("brand"));
  const category = safeStringField(formData.get("category"));
  const gender = safeStringField(formData.get("gender")) || "Unisex"; // Required for Fashion
  const weight = safeStringField(formData.get("weight"));
  const metaTitle = safeStringField(formData.get("metaTitle"));
  const metaDescription = safeStringField(formData.get("metaDescription"));
  const countryOfOrigin = safeStringField(formData.get("countryOfOrigin"));
  const offerPrice = Number(formData.get("offerPrice") || 0);
  const rating = Number(formData.get("rating") || 0);
  const isFeatured = formData.get("isFeatured") === "true";
  const isPublished = formData.get("isPublished") === "true";

  // Dimensions
  const dimensions = {
    length: safeStringField(formData.get("dimensions[length]")),
    width: safeStringField(formData.get("dimensions[width]")),
    height: safeStringField(formData.get("dimensions[height]")),
  };

  // Category-specific
  let fashion = null;
  let food = null;

  if (/^fashion$/i.test(mainCategory)) {
    fashion = { color, size, material, gender, dimensions };
  } else if (/^food$/i.test(mainCategory)) {
    food = {
      sku: safeStringField(formData.get("sku")),
      foodType: safeStringField(formData.get("foodType")),
      taste: safeStringField(formData.get("taste")),
    };
  }

  // Images (only upload if valid category)
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

  // Build product object
  const productObj = {
    user: admin.id,
    name,
    description,
    originalPrice: Number(formData.get("originalPrice") || 0),
    price,
    offerPrice,
    stock: Number(formData.get("stock") || 0),
    size,
    color,
    material,
    brand,
    tags,
    bulletDescription,
    bulletKeyValueDescription,
    gender,
    category,
    weight,
    mainCategory,
    metaTitle,
    metaDescription,
    metaKeywords,
    dimensions,
    countryOfOrigin,
    rating,
    isFeatured,
    isPublished,
    images,
    fashion, // only set if Fashion
    food, // only set if Food
  };

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
