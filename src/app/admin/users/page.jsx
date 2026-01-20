// /app/admin/users/render.jsx
import React from "react";
import UserManagement from "@/components/Admin/UserManagement";
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/all`,
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
    const users = await res.json();
    return <UserManagement allUsersData={users} />;
  } catch (error) {
    return <div className="text-red-500 p-4">Error: {error.message}</div>;
  }
};

export default page;
