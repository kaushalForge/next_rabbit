import NewArrivals from "@/components/Products/NewArrivals";
import { getNewArrivals } from "@/actions/userProducts";

export const dynamic = "force-dynamic";

const NewArrivalRouting = async () => {
  const newArrivals = await getNewArrivals();
  return (
    <>
      <NewArrivals newArrivals={newArrivals} />
    </>
  );
};

export default NewArrivalRouting;
