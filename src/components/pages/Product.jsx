import ProductDetails from "./ProductDetails";

const Product = async ({ productId, productDetail }) => {
  return <ProductDetails productId={productId} productDetail={productDetail} />;
};

export default Product;
