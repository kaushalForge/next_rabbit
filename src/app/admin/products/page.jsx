import React from "react";
import ProductManagement from "@/components/Admin/ProductManagement";
import { cookies } from "next/headers";

const page = async () => {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;
    if (!token) {
      throw new Error("No auth token found in cookies");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: ` ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to fetch users");
    }
    const products = await res.json();
    return <ProductManagement products={products} />;
  } catch (error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
