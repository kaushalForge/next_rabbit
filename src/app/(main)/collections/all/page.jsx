import React from "react";
import CollectionPage from "@/components/pages/CollectionPage";

export default function AllCollectionPage({ searchParams }) {
  // ✅ REQUIRED in Next.js 15
  const resolvedSearchParams = React.use(searchParams);

  const query = new URLSearchParams();
  query.set("collection", "all");

  for (const [key, value] of Object.entries(resolvedSearchParams || {})) {
    if (value === undefined || value === null || value === "") continue;

    // normalize arrays → comma separated
    if (Array.isArray(value)) {
      query.set(key, value.join(","));
    } else {
      query.set(key, value);
    }
  }

  return <CollectionFetcher query={query.toString()} />;
}

/* 🔥 isolate async fetch */
async function CollectionFetcher({ query }) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query}`;

  const res = await fetch(url, {
    cache: "no-store", // NEVER cache filtered results
  });

  if (!res.ok) {
    console.error("Fetch failed:", url);
    throw new Error("Failed to fetch products");
  }

  const products = await res.json();
  return <CollectionPage products={products} />;
}
