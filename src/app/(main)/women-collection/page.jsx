import WomenCollection from "@/components/Layout/WomenCollection";

const WomenCollectionRouting = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/women-collection`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    const womenCollection = await res.json();
    return <WomenCollection products={womenCollection} />;
  } catch (error) {
    console.log(error, "error occured");
  }
};

export default WomenCollectionRouting;
