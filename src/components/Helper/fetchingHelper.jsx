import React from "react";
import Product from "@/components/pages/Product";

const FetchingHelper = async ({ id }) => {
  let productDetail = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
      {
        cache: "no-store",
      },
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch product (${res.status})`);
    }

    productDetail = await res.json();
  } catch (err) {
    console.error("Failed to fetch product details:", err);
  }

  // return must be inside the function
  return <Product productDetail={productDetail} productId={id} />;
};

export default FetchingHelper;
