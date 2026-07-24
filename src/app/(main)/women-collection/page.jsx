import WomenCollection from "@/components/Layout/WomenCollection";
import { getWomenCollections } from "@/actions/userProducts";

export const dynamic = "force-dynamic";

const WomenCollectionRouting = async () => {
  const womenCollection = await getWomenCollections();
  return (
    <>
        <WomenCollection products={womenCollection} />
    </>
  );
};

export default WomenCollectionRouting;
