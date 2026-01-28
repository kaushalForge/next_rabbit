"use server";

export async function fetchAllProductsAction(query) {
  const queryString = new URLSearchParams(
    Object.entries(query).filter(
      ([_, value]) => value !== undefined && value !== "",
    ),
  ).toString();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const url = `${baseUrl}/api/products/search?${queryString}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  const { products } = await res.json();
  return products;
}
