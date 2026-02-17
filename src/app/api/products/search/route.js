import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnection";
import productModel from "@/models/product";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    // ===== Parameters =====
    const mainCategory = searchParams.get("mainCategory") || "all"; // optional
    const category = searchParams.get("category");
    const material = searchParams.get("material");
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const color = searchParams.get("color");
    const gender = searchParams.get("gender");
    const weight = searchParams.get("weight");
    const taste = searchParams.get("taste");
    const foodType = searchParams.get("foodType");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy");
    const search = searchParams.get("search");
    const limitParam = searchParams.get("limit");
    const page = Number(searchParams.get("page") || 0);

    // ===== Base query =====
    const query = { isPublished: true };
    if (mainCategory && mainCategory !== "all") {
      query.mainCategory = mainCategory;
    }

    // ===== Generic filters =====
    if (category && category.toLowerCase() !== "all") {
      query.category = { $in: category.split(",").map((c) => c.trim()) };
    }
    if (material && material.toLowerCase() !== "all") {
      query.material = { $in: material.split(",").map((m) => m.trim()) };
    }
    if (brand) {
      query.brand = { $in: brand.split(",").map((b) => b.trim()) };
    }

    // ===== Search =====
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { metaTitle: { $regex: search, $options: "i" } },
        { metaDescription: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { metaKeywords: { $regex: search, $options: "i" } },
      ];
    }

    // ===== Nested filters =====
    const nestedFilters = [];
    if (mainCategory?.toLowerCase() === "fashion") {
      const fashionFilter = {};

      if (size) {
        const sizes = size
          .split(",")
          .map((s) => new RegExp(`^${s.trim()}$`, "i"));
        fashionFilter.size = { $in: sizes };
      }

      if (color) {
        const colors = color
          .split(",")
          .map((c) => new RegExp(`^${c.trim()}$`, "i"));
        fashionFilter.color = { $in: colors };
      }

      if (gender) {
        fashionFilter.gender = { $regex: `^${gender}$`, $options: "i" };
      }

      if (minPrice || maxPrice) {
        const priceQuery = {};
        if (minPrice) priceQuery.$gte = Number(minPrice);
        if (maxPrice) priceQuery.$lte = Number(maxPrice);
        if (Object.keys(priceQuery).length) fashionFilter.price = priceQuery;
      }

      if (Object.keys(fashionFilter).length) {
        nestedFilters.push({ fashion: { $elemMatch: fashionFilter } });
      }
    }

    if (mainCategory?.toLowerCase() === "food") {
      const foodFilter = {};

      if (weight)
        foodFilter.weight = { $in: weight.split(",").map((w) => w.trim()) };
      if (taste)
        foodFilter.taste = { $in: taste.split(",").map((t) => t.trim()) };
      if (foodType)
        foodFilter.foodType = { $in: foodType.split(",").map((f) => f.trim()) };

      if (minPrice || maxPrice) {
        const priceQuery = {};
        if (minPrice) priceQuery.$gte = Number(minPrice);
        if (maxPrice) priceQuery.$lte = Number(maxPrice);
        if (Object.keys(priceQuery).length) foodFilter.price = priceQuery;
      }

      if (Object.keys(foodFilter).length) {
        nestedFilters.push({ food: { $elemMatch: foodFilter } });
      }
    }

    if (nestedFilters.length) {
      query.$and = nestedFilters;
    }

    // ===== Sorting =====
    let sort = {};

    if (sortBy) {
      if (sortBy === "priceAsc") {
        if (!mainCategory || mainCategory.toLowerCase() === "all") {
          // Can't reliably sort by both arrays; default to fashion first
          sort = { "fashion.0.offerPrice": 1 };
        } else if (mainCategory.toLowerCase() === "fashion") {
          sort = { "fashion.0.offerPrice": 1 };
        } else if (mainCategory.toLowerCase() === "food") {
          sort = { "food.0.offerPrice": 1 };
        }
      } else if (sortBy === "priceDesc") {
        if (!mainCategory || mainCategory.toLowerCase() === "all") {
          sort = { "fashion.0.offerPrice": -1 };
        } else if (mainCategory.toLowerCase() === "fashion") {
          sort = { "fashion.0.offerPrice": -1 };
        } else if (mainCategory.toLowerCase() === "food") {
          sort = { "food.0.offerPrice": -1 };
        }
      } else if (sortBy === "popularity") {
        sort = { rating: -1 };
      } else if (sortBy === "newest") {
        sort = { createdAt: -1 };
      }
    }
    // ===== Pagination =====
    const defaultLimit = Number(limitParam) || 16;
    const additional = page > 0 ? 8 * page : 0;
    const finalLimit = defaultLimit + additional;

    // ===== Execute query =====
    const products = await productModel
      .find(query)
      .sort(sort)
      .limit(finalLimit)
      .lean();

    return NextResponse.json(
      { success: true, products, count: products.length },
      { status: 200 },
    );
  } catch (error) {
    console.error("Search products error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 },
    );
  }
}
