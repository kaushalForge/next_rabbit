import ProductDetails from "../Layout/ProductDetails";

const fetchDetails = async (id) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/products/${id}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    },
  );

  return res.json();
};

const Product = async ({ productId, productDetail }) => {
  let finalProduct = productDetail;

  if (!finalProduct && productId) {
    finalProduct = await fetchDetails(productId);
  }

  return <ProductDetails productId={productId} productDetail={finalProduct} />;
};

export default Product;
