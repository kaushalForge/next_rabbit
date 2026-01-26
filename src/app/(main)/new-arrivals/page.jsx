import NewArrivals from "@/components/Products/NewArrivals";
export const dynamic = "force-dynamic";

const NewArrivalRouting = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/new-arrivals`,
      {
        credentials: "include",
      },
    );

    const newArrivals = await res.json();
    return <NewArrivals newArrivals={newArrivals} />;
  } catch (err) {
    console.error("Failed to fetch products:", err);
  }
};
export default NewArrivalRouting;
