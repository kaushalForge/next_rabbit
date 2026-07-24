// /app/products/page.jsx
import ProductGrid from "@/components/Common/ProductGrid";
import CollectionPage from "@/components/pages/Collections/CollectionPage";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  let products = [];

  try {
    const res = await fetch("/api/products", { credentials: "include",cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
  }

  return <CollectionPage products={products} />;
}
