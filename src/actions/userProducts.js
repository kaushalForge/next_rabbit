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

export async function getWomenCollections() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/women-collections`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  return await res.json();
}

export async function getNewArrivals() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/new-arrivals`,
    {
      cache: "no-store",
    },
  );

  return await res.json();
}

export async function getBestSellers() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/best-seller`,
    {
      cache: "no-store",
      credentials: "include",
    },
  );

  return await res.json();
}
