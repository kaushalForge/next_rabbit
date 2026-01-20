// app/(main)/collections/all/page.jsx
import CollectionPage from "@/components/pages/Collections/CollectionPage";

export const dynamic = "force-dynamic"; // SSR only

export default async function AllCollectionPage({ searchParams }) {
  const params = await searchParams;

  const query = new URLSearchParams({ collection: "all" });

  for (const [key, value] of Object.entries(params ?? {})) {
    if (!value || value === "") continue;
    query.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  let products = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`,
      { cache: "no-store" },
    );

    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data : (data.products ?? []);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }

  return <CollectionPage products={products} />;
}
