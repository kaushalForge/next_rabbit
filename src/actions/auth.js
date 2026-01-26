"use server";

import { cookies } from "next/headers";

export async function fetchCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cUser")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/get-user`,
      {
        method: "GET",
        headers: {
          Cookie: `cUser=${token}`,
        },
        credentials: "include",
        cache: "no-store",
      },
    );
    const result = await res.json();
    return result;
  } catch (err) {
    console.error(err.message);
    return {
      user: null,
      role: null,
      email: null,
      isLoggedIn: false,
      message: "Server error",
    };
  }
}

export async function handleLogoutAction() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/logout`,
      {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      },
    );

    const result = await res.json();

    return {
      status: res.status,
      result,
    };
  } catch (err) {
    console.error("Logout error:", err.message);
    return {
      status: 500,
      message: "Logout failed",
      isLoggedIn: false,
    };
  }
}
