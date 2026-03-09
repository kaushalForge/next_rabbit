import { NextResponse } from "next/server";
import Cart from "@/models/cart";
import Product from "@/models/product";
import { dbConnect } from "@/lib/dbConnection";
import { cookies } from "next/headers";
import { verifyJWT } from "@/lib/jwt";
import { Types } from "mongoose";

/* ================= HELPERS ================= */
const getOwner = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    if (!token) return null;
    const owner = await verifyJWT(token);
    return owner.payload;
  } catch (error) {
    console.error("getOwner error:", error);
    return null;
  }
};

// Calculate total using offerPrice if available
const calculateTotalPrice = (products) =>
  products.reduce((sum, item) => {
    const sellingPrice = Number(item.offerPrice ?? item.price);
    return sum + sellingPrice * item.quantity;
  }, 0);

/* ================= Find existing product index dynamically ================= */
const findIndexByCategory = (products, product, payload) => {
  if (product.mainCategory === "Fashion") {
    return products.findIndex(
      (p) =>
        p.productId.toString() === payload.productId &&
        p.size === payload.size &&
        p.color === payload.color,
    );
  } else if (product.mainCategory === "Food") {
    return products.findIndex(
      (p) =>
        p.productId.toString() === payload.productId &&
        p.weight === payload.weight, // Compare as string to avoid type mismatch
    );
  } else {
    return products.findIndex(
      (p) => p.productId.toString() === payload.productId,
    );
  }
};

/* ================= GET ================= */
export const GET = async () => {
  try {
    await dbConnect();
    const owner = await getOwner();
    if (!owner)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const cart = await Cart.findOne({ userId: owner.id }).lean();

    const productsWithCategory = await Promise.all(
      (cart?.products || []).map(async (item) => {
        const product = await Product.findById(item.productId)
          .select("mainCategory")
          .lean();

        return {
          ...item,
          mainCategory: product?.mainCategory || "Unknown",
        };
      }),
    );

    const totalPrice = calculateTotalPrice(productsWithCategory);

    return NextResponse.json(
      {
        message: "Cart fetched successfully",
        products: productsWithCategory,
        totalPrice,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("GET /api/cart error:", err);
    return NextResponse.json(
      { message: "Error fetching cart" },
      { status: 500 },
    );
  }
};

/* ================= POST (ADD TO CART) ================= */
export const POST = async (req) => {
  try {
    await dbConnect();
    const owner = await getOwner();
    if (!owner)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const {
      productId,
      quantity,
      size,
      color,
      weight,
      price,
      offerPrice,
      shipmentTotal,
    } = payload;

    const product = await Product.findById(productId)
      .select("name images mainCategory")
      .lean();
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const image = product.images?.[0]?.url || "";
    // Always find cart by ObjectId
    let cart = await Cart.findOne({ userId: new Types.ObjectId(owner.id) });
    if (!cart) {
      cart = new Cart({
        userId: new Types.ObjectId(owner.id),
        products: [],
        totalPrice: 0,
      });
    }

    // Food product must have weight
    if (product.mainCategory === "Food" && (!weight || weight === "")) {
      return NextResponse.json(
        { message: "Weight is required for Food products" },
        { status: 400 },
      );
    }

    // Find existing product index
    const index = cart.products.findIndex((p) => {
      if (product.mainCategory === "Fashion") {
        return (
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        );
      } else if (product.mainCategory === "Food") {
        return p.productId.toString() === productId && p.weight === weight;
      } else {
        return p.productId.toString() === productId;
      }
    });

    let message = "";
    if (index > -1) {
      // Update quantity & price if already exists
      cart.products[index].quantity += quantity;
      cart.products[index].price = price;
      cart.products[index].offerPrice = offerPrice;
      if (product.mainCategory === "Fashion") {
        cart.products[index].size = size;
        cart.products[index].color = color;
      } else if (product.mainCategory === "Food") {
        cart.products[index].weight = weight;
      }
      message = "Cart Updated!";
    } else {
      // Add new product
      const newProduct = {
        productId,
        name: product.name,
        image,
        price,
        offerPrice,
        quantity,
      };
      if (product.mainCategory === "Fashion") {
        newProduct.size = size;
        newProduct.color = color;
      } else if (product.mainCategory === "Food") {
        newProduct.weight = weight;
      }
      cart.products.push(newProduct);
      message = "Added to Cart!";
    }

    // Recalculate total price
    cart.totalPrice = cart.products.reduce((sum, item) => {
      const sellingPrice = Number(item.offerPrice ?? item.price ?? 0);
      return sum + sellingPrice * item.quantity;
    }, 0);

    await cart.save();

    return NextResponse.json(
      { products: cart.products, totalPrice: cart.totalPrice, message },
      { status: 201 },
    );
  } catch (err) {
    console.error("POST cart error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

/* ================= PUT (UPDATE QUANTITY) ================= */
export const PUT = async (req) => {
  try {
    await dbConnect();
    const owner = await getOwner();
    if (!owner)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { productId, quantity, size, color, weight } = payload;

    const cart = await Cart.findOne({ userId: owner.id });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const product = await Product.findById(productId)
      .select("mainCategory")
      .lean();
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const index = findIndexByCategory(cart.products, product, payload);
    if (index === -1)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    cart.products[index].quantity = quantity;

    if (product.mainCategory === "Fashion") {
      cart.products[index].size = size;
      cart.products[index].color = color;
    } else if (product.mainCategory === "Food") {
      cart.products[index].weight = weight;
    }

    cart.totalPrice = calculateTotalPrice(cart.products);
    await cart.save();

    return NextResponse.json(
      {
        products: cart.products,
        totalPrice: cart.totalPrice,
        message: "Quantity updated!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("PUT cart error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};

/* ================= DELETE ================= */
export const DELETE = async (req) => {
  try {
    await dbConnect();
    const owner = await getOwner();
    if (!owner)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const payload = await req.json();
    const { productId, size, color, weight } = payload;

    const cart = await Cart.findOne({ userId: owner.id });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const product = await Product.findById(productId)
      .select("mainCategory")
      .lean();
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const index = findIndexByCategory(cart.products, product, payload);
    if (index > -1) cart.products.splice(index, 1);

    cart.totalPrice = calculateTotalPrice(cart.products);
    await cart.save();

    return NextResponse.json(
      {
        products: cart.products,
        totalPrice: cart.totalPrice,
        message: "Item removed!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("DELETE cart error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
};
