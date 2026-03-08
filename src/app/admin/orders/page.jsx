import OrderManagement from "@/components/Admin/OrderManagement";
import { cookies } from "next/headers";

const page = async ({ params }) => {
  const { id } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/orders`,
    {
      headers: {
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
      cache: "no-store",
    },
  );

  const orderDetails = await res.json();

  return <OrderManagement orderDetails={orderDetails} />;
};

export default page;
