import ProductGrid from "../Common/ProductGrid";

const WomenCollection = ({ products }) => {
  return (
    <div className="container px-4 lg:px-6 mx-auto">
      <h2 className="text-center w-full text-3xl font-semibold mb-2">
        Womens Collection!
      </h2>
      <ProductGrid products={products} />
    </div>
  );
};

export default WomenCollection;
