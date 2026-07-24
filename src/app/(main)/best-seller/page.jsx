import BestSeller from "@/components/Products/BestSeller";
import { getBestSellers } from "@/actions/userProducts";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const bestSeller = await getBestSellers();

  return <BestSeller bestSeller={bestSeller} />;
}
