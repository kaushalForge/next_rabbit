import CollectionPage from "@/components/pages/Collections/CollectionPage";
import { fetchAllProductsAction } from "@/actions/userProducts";

const AllCollections = async (props) => {
  const query = await props.searchParams;
  query.collection = "all";
  let products = [];
  try {
    const res = await fetchAllProductsAction(query);
    products = res;
  } catch (err) {
    console.error("Error fetching products:", err);
  }
  return <CollectionPage products={products} />;
};

export default AllCollections;
