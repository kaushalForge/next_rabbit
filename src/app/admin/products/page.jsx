import ProductManagement from "@/components/Admin/ProductManagement";
import { fetchProductsAdminAction } from "@/actions/adminProducts";

export const dynamic = "force-dynamic";

const Page = async () => {
  let products;
  try {
    products = await fetchProductsAdminAction();
  } catch (error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }

  return <ProductManagement products={products} />;
};

export default Page;
