"use client";

import React from "react";
import ProductDetails from "../Layout/ProductDetails";

const Product = ({ productDetail, productId }) => {
  return (
    <>
      <ProductDetails productId={productId} productDetail={productDetail} />
    </>
  );
};

export default Product;
