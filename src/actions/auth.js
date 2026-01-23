export async function fetchCurrentUser() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cookie/get-user`,
      {
        method: "GET",
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
    console.error("❌ Logout error:", err.message);
    return {
      status: 500,
      message: "Logout failed",
      isLoggedIn: false,
    };
  }
}
