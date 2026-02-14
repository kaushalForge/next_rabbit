"use server";

import { cookies } from "next/headers";

const API_BASE = process.env.NEXT_PUBLIC_SITE_URL;

// Get user token from cookies
const getOwner = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;
    return token || null;
  } catch (err) {
    console.error("Cannot get token:", err);
    return null;
  }
};

/* =========================
      Fetch Cart
========================= */
export async function fetchCartAction() {
  try {
    const token = await getOwner();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data?.message || "",
      products: data?.products || [],
      totalPrice: data?.totalPrice || 0,
    };
  } catch (err) {
    console.error("fetchCartAction error:", err);
    return {
      status: 500,
      message: err?.message || "Failed to fetch cart",
      products: [],
      totalPrice: 0,
    };
  }
}

/* =========================
      Add to Cart
========================= */
export async function addToCartAction({
  productId,
  quantity,
  size,
  color,
  price,
  offerPrice,
}) {
  try {
    const token = await getOwner();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
        size,
        color,
        price,
        offerPrice,
      }),
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data?.message,
      products: data?.products || [],
      totalPrice: data?.totalPrice || 0,
    };
  } catch (err) {
    console.error("addToCartAction error:", err);
    return {
      status: 500,
      message: "Internal server error",
      products: [],
      totalPrice: 0,
    };
  }
}

/* =========================
      Update Cart Quantity
========================= */
export async function updateCartItemQuantityAction({
  productId,
  quantity,
  size,
  color,
}) {
  try {
    const token = await getOwner();
    if (!token) throw new Error("Unauthorized");

    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify({ productId, quantity, size, color }),
    });

    const data = await res.json();

    return {
      status: res.status,
      message: data?.message,
      products: data?.products || [],
      totalPrice: data?.totalPrice || 0,
    };
  } catch (err) {
    console.error("updateCartItemQuantityAction error:", err);
    return {
      status: 500,
      message: "Internal server error",
      products: [],
      totalPrice: 0,
    };
  }
}

/* =========================
      Remove from Cart
========================= */
export async function removeFromCartAction({ productId, size, color }) {
  try {
    const token = await getOwner();

    const res = await fetch(`${API_BASE}/api/cart`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify({ productId, size, color }),
    });

    const data = await res.json();
    console.log(data, "test");
    return {
      status: res.status,
      message: data.message,
      products: data?.products || [],
      totalPrice: data?.totalPrice || 0,
    };
  } catch (err) {
    console.error("removeFromCartAction error:", err);
    return {
      status: 500,
      message: "Internal server error",
      products: [],
      totalPrice: 0,
    };
  }
}
