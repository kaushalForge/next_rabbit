"use server";
import CollectionPage from "@/components/pages/Collections/CollectionPage";

export async function fetchAllProductsAction(query) {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    cache: "no-store",
  });

  const products = await res.json();
  // return <CollectionPage products={products} />;

  return products;
}
