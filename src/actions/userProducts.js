"use server";

import { cookies } from "next/headers";

export async function fetchAllProductsAction(query) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch product details");
  }

  const productDetail = await res.json();
  return productDetail;
}
