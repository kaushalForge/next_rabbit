import MenCollection from "@/components/Layout/MenCollection";
export const dynamic = "force-dynamic";

const MenCollectionRouting = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/men-collection`,
      { cache: "no-store" },
    );

    const menCollection = await res.json();
    return <MenCollection products={menCollection} />;
  } catch (error) {
    console.log(error, "error occured");
  }
};

export default MenCollectionRouting;
