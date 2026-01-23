import ProductManagement from "@/components/Admin/ProductManagement";
import { cookies } from "next/headers";

const page = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    return <div className="text-red-500 p-4">Not authenticated</div>;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/products/all`,
      {
        method: "GET",
        headers: {
          Cookie: `cUser=${token}`,
        },
        cache: "no-store",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch products");
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid products response");
    }

    return <ProductManagement products={data} />;
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
