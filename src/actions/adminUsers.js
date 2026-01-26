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
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/update-role`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
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
  if (!token) throw new Error("Not authenticated");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/users/delete/${userId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `cUser=${token}`,
      },
      credentials: "include",
    },
  );

  let data;
  try {
    data = await res.json();
  } catch {
    data = { message: "Server returned invalid JSON" };
  }

  revalidatePath("/admin/users");

  return { status: res.status, message: data.message || "" };
}
