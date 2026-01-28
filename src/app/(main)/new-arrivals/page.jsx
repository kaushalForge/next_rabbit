import NewArrivals from "@/components/Products/NewArrivals";

const NewArrivalRouting = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/new-arrivals`,
      {
        cache: "no-store",
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
