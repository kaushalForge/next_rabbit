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
    return owner;
  } catch (error) {
    console.error("getOwner error:", error);
    return null;
  }
};

// Calculate total using offerPrice if available
const calculateTotalPrice = (products) =>
  products.reduce((sum, item) => {
    const sellingPrice = Number(item.offerPrice || item.price);
    return sum + sellingPrice * item.quantity;
  }, 0);

// Find index of a specific product variant
const findIndex = (products, productId, size, color) =>
  products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color,
  );

/* ================= GET ================= */
export const GET = async () => {
  try {
    await dbConnect();
    const owner = await getOwner();
    if (!owner)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const cart = await Cart.findOne({ userId: owner.id }).lean();

    const totalPrice = calculateTotalPrice(cart?.products || []);

    return NextResponse.json(
      {
        message: "Cart fetched successfully",
        products: cart?.products || [],
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

    const { productId, quantity, size, color, price, offerPrice } =
      await req.json();

    const product = await Product.findById(productId)
      .select("name images")
      .lean();

    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );

    const image = product.images?.[0]?.url || "";

    let cart = await Cart.findOne({ userId: new Types.ObjectId(owner.id) });

    if (!cart) {
      cart = new Cart({
        userId: new Types.ObjectId(owner.id),
        products: [],
        totalPrice: 0,
      });
    }

    const index = findIndex(cart.products, productId, size, color);

    if (index > -1) {
      cart.products[index].quantity += quantity;
      cart.products[index].price = price;
      cart.products[index].offerPrice = offerPrice;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image,
        price,
        offerPrice,
        size,
        color,
        quantity,
      });
    }

    // Calculate totalPrice based on offerPrice
    cart.totalPrice = calculateTotalPrice(cart.products);

    await cart.save();

    return NextResponse.json(
      {
        products: cart.products,
        totalPrice: cart.totalPrice,
        message: "Cart updated!",
      },
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

    const { productId, quantity, size, color } = await req.json();

    const cart = await Cart.findOne({ userId: owner.id });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const index = findIndex(cart.products, productId, size, color);
    if (index === -1)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    cart.products[index].quantity = quantity;

    cart.totalPrice = calculateTotalPrice(cart.products);

    await cart.save();

    return NextResponse.json(
      { products: cart.products, totalPrice: cart.totalPrice },
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

    const { productId, size, color } = await req.json();

    const cart = await Cart.findOne({ userId: owner.id });
    if (!cart)
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    cart.products = cart.products.filter(
      (p) =>
        !(
          p.productId.toString() === productId &&
          p.size === size &&
          p.color === color
        ),
    );

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
