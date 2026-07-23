"use server";

import Product from "@/components/pages/Product";
import { cookies } from "next/headers";

const FetchingHelper = async ({ id }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!id) {
    return <p className="p-8 text-center text-zinc-500">Product not found.</p>;
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
    return <p className="p-8 text-center text-zinc-500">Failed to load product.</p>;
  }

  const productDetail = await res.json();

  return <Product productDetail={productDetail} productId={id} />;
};

export default FetchingHelper;
