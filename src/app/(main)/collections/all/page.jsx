// app/(main)/collections/all/page.jsx
import CollectionPage from "@/components/pages/Collections/CollectionPage";

export const dynamic = "force-dynamic"; // SSR only

export default async function AllCollectionPage({ searchParams }) {
  // Make sure searchParams is defined
  const params = searchParams ?? {};

  // Build the query string
  const query = new URLSearchParams({ collection: "all" });

  for (const [key, value] of Object.entries(params)) {
    if (!value || value === "") continue;
    query.set(key, Array.isArray(value) ? value.join(",") : value);
  }

  let products = [];

  try {
    // Token is undefined here, remove it unless you handle auth
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/search?${query.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Cookie: `cUser=${token}`, // only use if auth is required
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const data = await res.json();

      // Handle different response shapes
      products = Array.isArray(data) ? data : (data.products ?? []);
    } else {
      // Response was not OK
      console.error("Failed to fetch products. Status:", res.status);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
  }

  return <CollectionPage products={products} />;
}
