import UserManagement from "@/components/Admin/UserManagement";
import { cookies } from "next/headers";

const page = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `cUser=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );
    const { users } = await res.json();
    return <UserManagement allUsersData={users} />;
  } catch (error) {
    console.error("Fetch error:", error);
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
