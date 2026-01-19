import FetchingHelper from "@/components/Helper/fetchingHelper";

const ProductDetailsRouting = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    console.error("Product ID is missing from route params.");
    throw new Error("Product ID is missing from route params.");
  }
  return <FetchingHelper id={id} />;
};

export default ProductDetailsRouting;
