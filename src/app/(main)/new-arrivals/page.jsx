import NewArrivals from "@/components/Products/NewArrivals";
import { getNewArrivals } from "@/actions/userProducts";
import { Suspense } from "react";

const NewArrivalRouting = async () => {
  const newArrivals = await getNewArrivals();
  return (
    <>
      <Suspense>
        <NewArrivals newArrivals={newArrivals} />
      </Suspense>
    </>
  );
};

export default NewArrivalRouting;
