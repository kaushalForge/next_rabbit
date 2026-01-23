"use server";

export async function fetchAllProductsAction(query) {
  const queryString = new URLSearchParams(
    Object.entries(query).filter(
      ([_, value]) => value !== undefined && value !== "",
    ),
  ).toString();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${queryString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  const products = await res.json();
  return products;
}
