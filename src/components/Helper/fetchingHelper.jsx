"use server";

import Product from "@/components/pages/Product";
import { cookies } from "next/headers";

const FetchingHelper = async ({ id }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;
  if (!token) console.log("Not authenticated");

  if (!id) {
    console.log(object)("Product ID is required");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
    {
      method: "GET",
      headers: {
        Cookie: `cUser=${token}`,
      },
      cache: "no-store", // always fresh data
    },
  );

  if (!res.ok) {
    console.log(`Failed to fetch product (${res.status})`);
  }

  const productDetail = await res.json();

  return <Product productDetail={productDetail} productId={id} />;
};

export default FetchingHelper;
