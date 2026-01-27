import { getAuthCookie } from "./cookies";
import { verifyJWT } from "./jwt";
import { connectDB } from "./db";
import User from "@/models/user";

/**
 * Get logged-in user from cookie
 */
export async function getCurrentUser() {
  const token = getAuthCookie();

  if (!token) {
    return null;
  }

  const decoded = verifyJWT(token);

  if (!decoded?.id) {
    return null;
  }

  await connectDB();

  const user = await User.findById(decoded.id).select("-password");

  return user || null;
}

/**
 * Require authentication
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    throw new Error("Forbidden");
  }

  return user;
}
