export const dynamic = "force-dynamic";

import React from "react";
import ProductManagement from "@/components/Admin/ProductManagement";
import { cookies } from "next/headers";

const page = async () => {
  try {
    const cookieStore = await cookies(); // kept as requested
    const token = cookieStore.get("token")?.value;

    if (!token) {
      throw new Error("No auth token found in cookies");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      let message = "Failed to fetch products";
      try {
        const errorData = await res.json();
        message = errorData?.message || message;
      } catch (_) {}
      throw new Error(message);
    }

    const products = await res.json();
    return <ProductManagement products={products} />;
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error.message || "Something went wrong"}
      </div>
    );
  }
};

export default page;
