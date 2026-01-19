export const dynamic = "force-dynamic";

import CollectionPage from "@/components/pages/CollectionPage";

export default async function AllCollectionPage({ searchParams }) {
  const query = new URLSearchParams();
  query.set("collection", "all");

  for (const [key, value] of Object.entries(searchParams || {})) {
    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      query.set(key, value.join(","));
    } else {
      query.set(key, value);
    }
  }

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await res.json();

  return <CollectionPage products={products} />;
}
