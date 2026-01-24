import BestSeller from "@/components/Products/BestSeller";

export default async function ProductsPage() {
  let bestSeller = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/best-seller`,
    );
    bestSeller = await res.json();
  } catch (err) {
    console.log("Failed to fetch products:", err.message);
  }

  return <BestSeller bestSeller={bestSeller} />;
}
