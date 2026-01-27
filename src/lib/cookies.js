import { cookies } from "next/headers";

const COOKIE_NAME = "cUser";

/**
 * Set auth cookie
 */
export function setAuthCookie(token) {
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax", // perfect for same-domain apps
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Get auth cookie
 */
export function getAuthCookie() {
  const cookieStore = cookies();
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie() {
  const cookieStore = cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
