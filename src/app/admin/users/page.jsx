import UserManagement from "@/components/Admin/UserManagement";
import { cookies } from "next/headers";

const page = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("cUser")?.value;

    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/all`,
      {
        headers: {
          Cookie: `cUser=${token}`,
        },
        cache: "no-store",
      },
    );
    const users = await res.json();
    if (!res.ok) {
      throw new Error(users.message || "Failed to fetch users");
    }
    return <UserManagement allUsersData={users} />;
  } catch (error) {
    console.error(error);
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
