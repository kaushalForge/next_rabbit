import BestSeller from "@/components/Products/BestSeller";
import { getBestSellers } from "@/actions/userProducts";

export default async function ProductsPage() {
  const bestSeller = await getBestSellers();

  return <BestSeller bestSeller={bestSeller} />;
}
