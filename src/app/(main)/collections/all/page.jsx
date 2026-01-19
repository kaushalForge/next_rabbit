// app/(main)/collections/all/page.jsx
import CollectionPage from "@/components/pages/Collections/CollectionPage";

export const dynamic = "force-dynamic"; // ⚡ Forces SSR, disables static prerender

export default async function AllCollectionPage({ searchParams }) {
  const params = searchParams || {};
  const query = new URLSearchParams({ collection: "all" });
  for (const [key, value] of Object.entries(params)) {
    if (!value || value === "") continue;
    query.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  let products = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`,
      { next: { revalidate: 0 } },
    );
    if (res.ok) {
      const data = await res.json();
      products = Array.isArray(data) ? data : data.products || [];
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }

  return <CollectionPage products={products} />;
}
