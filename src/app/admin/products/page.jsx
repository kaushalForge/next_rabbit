import ProductManagement from "@/components/Admin/ProductManagement";
import { fetchProductsAdminAction } from "@/actions/adminProducts";

export const dynamic = "force-dynamic";

const Page = async () => {
  try {
    const products = await fetchProductsAdminAction();

    return <ProductManagement products={products} />;
  } catch (error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default Page;
