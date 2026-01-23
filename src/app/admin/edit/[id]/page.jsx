import EditProductPage from "@/components/Admin/EditProductPage";
import { cookies } from "next/headers";

const page = async ({ params }) => {
  const { id } = await params; // ✅ no await

  const cookieStore = await cookies(); // ✅ no await
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products/${id}`,
    {
      headers: {
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    console.log("Failed to fetch product");
  }

  const productDetails = await res.json();

  return <EditProductPage productDetails={productDetails} />;
};

export default page;
