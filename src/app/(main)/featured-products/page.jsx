import FeaturedProducts from "@/components/Products/FeaturedProducts";
import { getFeaturedProducts } from "@/actions/userProducts";

const NewArrivalRouting = async () => {
  const featuredProducts = await getFeaturedProducts();
  return (
    <>
      <FeaturedProducts products={featuredProducts} />
    </>
  );
};

export default NewArrivalRouting;
