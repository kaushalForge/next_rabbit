// /app/products/page.jsx
import ProductGrid from "@/components/Common/ProductGrid";
import CollectionPage from "@/components/pages/Collections/CollectionPage";
export default async function ProductsPage() {
  let products = [];

  try {
    const res = await fetch("/api/products", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch products");
    products = await res.json();
    console.log("New arrivals data:", products);
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
  }

  return <CollectionPage products={products} />;
}
