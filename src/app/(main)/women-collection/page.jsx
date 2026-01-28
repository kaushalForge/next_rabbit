import WomenCollection from "@/components/Layout/WomenCollection";

const WomenCollectionRouting = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/women-collections`,
      {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      },
    );

    const womenCollection = await res.json();
    return <WomenCollection products={womenCollection} />;
  } catch (error) {
    console.log(error, "error occured");
  }
};

export default WomenCollectionRouting;
