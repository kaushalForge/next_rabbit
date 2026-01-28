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
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/products`,
      {
        method: "GET",
        headers: {
          Cookie: `cUser=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );
    const { products } = await res.json();

    return <ProductManagement products={products} />;
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
