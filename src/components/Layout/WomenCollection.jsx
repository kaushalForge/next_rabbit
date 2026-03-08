import GridUI1 from "../Resuables/GridUI1";

const WomenCollection = ({ products }) => {
  if (!products || !Array.isArray(products) || products.length === 0)
    return null;
  return (
    <div className="container px-4 lg:px-6 mx-auto">
      <h2 className="text-center w-full text-3xl font-semibold mb-2">
        Womens Collection!
      </h2>
      <GridUI1 products={products} />
    </div>
  );
};

export default WomenCollection;
