import { getMenCollections } from "@/actions/userProducts";
import { Suspense } from "react";
import MenCollection from "@/components/Layout/MenCollection";

const MenCollectionRouting = async () => {
  const menCollection = await getMenCollections();
  return (
    <>
      <Suspense>
        <MenCollection products={menCollection} />
      </Suspense>
    </>
  );
};

export default MenCollectionRouting;




