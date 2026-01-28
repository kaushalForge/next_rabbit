"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createUserAction(userData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
      body: JSON.stringify(userData),
    },
  );
  revalidatePath("/admin/users");

  return { status: res.status }; // return status for client use
}

export async function updateUserRoleAction(userData) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users/edit`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      body: JSON.stringify(userData),
    },
  );

  const data = await res.json();
  revalidatePath("/admin/users");

  return { status: res.status, newRole: data.newRole };
}

export async function deleteUserAction(userId) {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  if (!token) {
    return { status: 401, message: "Not authenticated" };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/users/delete/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      cache: "no-store",
    },
  );

  let data = {};
  try {
    data = await res.json();
  } catch {
    data.message = "Invalid server response";
  }

  revalidatePath("/admin/users");

  return {
    status: res.status,
    message: data.message || "Action completed",
  };
}
