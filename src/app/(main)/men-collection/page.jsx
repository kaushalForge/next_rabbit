import { getMenCollections } from "@/actions/userProducts";
import { Suspense } from "react";
import MenCollection from "@/components/Layout/MenCollection";

const MenCollectionRouting = async () => {
  const menCollection = await getMenCollections();
  return (
    <>
      <MenCollection products={menCollection} />
    </>
  );
};

export default MenCollectionRouting;
