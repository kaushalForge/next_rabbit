import BestSeller from "@/components/Products/BestSeller";

export default async function ProductsPage() {
  let bestSeller = [];

  try {
    const res = await fetch(
      `${import.meta.env.NEXT_PUBLIC_BACKEND_URL}/api/products/best-seller`,
    );
    bestSeller = await res.json();
    console.log("Best seller data:", bestSeller);
  } catch (err) {
    console.log("Failed to fetch products:", err.message);
  }

  return <BestSeller bestSeller={bestSeller} />;
}
