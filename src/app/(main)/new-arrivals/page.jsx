import NewArrivals from "@/components/Products/NewArrivals";

const NewArrivalRouting = async () => {
  let newArrivals = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/new-arrivals`,
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    newArrivals = await res.json();
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }

  return <NewArrivals newArrivals={newArrivals} />;
};
export default NewArrivalRouting;
