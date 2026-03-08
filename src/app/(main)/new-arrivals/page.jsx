import NewArrivals from "@/components/Products/NewArrivals";
import { getNewArrivals } from "@/actions/userProducts";

const NewArrivalRouting = async () => {
  const newArrivals = await getNewArrivals();
  return (
    <>
      <NewArrivals newArrivals={newArrivals} />
    </>
  );
};

export default NewArrivalRouting;
