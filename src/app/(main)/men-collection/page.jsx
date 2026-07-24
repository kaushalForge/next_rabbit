import { getMenCollections } from "@/actions/userProducts";
import { Suspense } from "react";
import MenCollection from "@/components/Layout/MenCollection";

export const dynamic = "force-dynamic";

const MenCollectionRouting = async () => {
  const menCollection = await getMenCollections();
  return (
    <>
      <MenCollection products={menCollection} />
    </>
  );
};

export default MenCollectionRouting;
