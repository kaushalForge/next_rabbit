import WomenCollection from "@/components/Layout/WomenCollection";
import { getWomenCollections } from "@/actions/userProducts";
import { Suspense } from "react";

const WomenCollectionRouting = async () => {
  const womenCollection = await getWomenCollections();
  return (
    <>
      <Suspense>
        <WomenCollection products={womenCollection} />
      </Suspense>
    </>
  );
};

export default WomenCollectionRouting;
