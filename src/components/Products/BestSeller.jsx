"use client";
import React from "react";
import ProductGrid from "../Common/ProductGrid";

const BestSeller = ({ product }) => {
  return (
    <>
      <div>
        <ProductGrid product={product} />
      </div>
    </>
  );
};

export default BestSeller;
